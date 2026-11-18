# Cách quản lý context AI

Tổng hợp từ blog tham khảo, `../core`, `../SKILL`, workflow case study. “Context” ở đây không chỉ là cửa sổ token; nó là **hệ thống nhiều tầng** giúp agent biết phải đọc gì, nhớ gì, bỏ gì, và chứng minh gì.

## 0. Ba tầng context

| Tầng | Mục đích | Ví dụ |
|---|---|---|
| Luôn bật | Luật ổn định, ngắn | `AGENTS.md`, `CLAUDE.md`, global memory |
| Theo nhu cầu | Quy trình/kỹ năng | `SKILL.md`, `references/`, specs, plans |
| Runtime | Context của task đang chạy | prompt, message history, artifacts, ledger |

Nguyên tắc: **luôn bật ít, nạp theo nhu cầu, chi tiết để trong file**. Không nhồi mọi thứ vào prompt.

## 1. Context cho coding agent

### 1.1 Project memory

- `AGENTS.md`/`CLAUDE.md` ở gốc repo: luật chung, lệnh build/test/lint, cấu trúc, điều cấm.
- File con theo app/package: luật cục bộ, tránh file gốc quá dài.
- Global memory `~/.claude/CLAUDE.md`: quy tắc hành vi dùng chung.
- `/init` (Claude Code): tạo project index ban đầu — tech stack, directory, build, constraint.

### 1.2 Docs-first

- Trước khi code: brainstorm → PRD/ADR/RFC → plan.
- `ARCHITECTURE_DECISION_RECORD.md` giữ quyết định, tech choice, interface; chống trôi context khi implement.
- Refactor lớn: RFC → nhiều execution plan.
- Docs là nguồn sự thật; chat chỉ là nơi thảo luận.

### 1.3 Skill progressive disclosure

- `SKILL.md` mỏng: mục tiêu, trigger, workflow, boundary, verify.
- Chi tiết đẩy vào `references/`; thao tác tất định vào `scripts/`.
- Agent chỉ đọc reference khi cần; không nạp cả skill vào context mặc định.
- `description` phải chứa trigger; body không lặp “When to use”.

### 1.4 State file thay cho trí nhớ hội thoại

Workflow case study dùng:

- `spec` — hợp đồng đã duyệt.
- `tasks.md` — chia task, `Produces`/`Consumes`, failing test, Verify, `Expected`.
- `progress.md` — ledger: `Ruling`, `Slicing`, `Task N: complete`.
- review package — diff + spec + review focus.
- verify report/artboard — evidence.

Compaction xóa chat nhưng không xóa file. Agent đọc ledger + `git log` thay vì nhớ.

### 1.5 Bàn giao self-contained

- Context brief: goal, why, constraints, files, acceptance, verify, open questions.
- Không “như đã bàn”, không “theo session trước”.
- Ghi `path:line`; lệnh cụ thể; quote feedback gốc nếu quan trọng.
- `session-handoff` tạo prompt bàn giao cho agent khác.
- `session-to-skill-and-blog` tách “how” (skill) khỏi “why” (blog).

### 1.6 Hỏi đúng lúc, đọc trước khi hỏi

- Đọc code/docs hiện có trước khi hỏi; không bắt người dùng trả lời điều file đã nói.
- Chỉ hỏi điều làm thay đổi sản phẩm; một câu mỗi message.
- Playback lại hiểu biết, đánh dấu guess.
- Step up lên document khi nhiều module/architecture/>5 quyết định.

### 1.7 Fresh context cho review

- Review cuối bằng agent/model khác, không tự review.
- Reviewer nhận spec + diff + review focus + ledger rulings.
- Một fix pass; Critical/Important sửa, Minor defer.
- Evidence before claims: chạy lệnh, đọc output, nêu kết quả.

### 1.8 Re-read trước khi sửa

- Đọc lại native file ngay trước mỗi edit.
- Chỉ patch phần định sửa; giữ human edits.
- Đổi output format → đọc lại docs của skill; “đã đọc một lần” không đủ.

## 2. Context cho AI product

### 2.1 Admin agent core

- **Persisted schema vs wire schema**: conversation lưu frame giàu (core-system, scene-system, context-snapshot, dry-run, approval...); mỗi lượt compile thành wire message `system/user/assistant/tool`.
- Backend chỉ hiểu 5 role; frame không map bị drop. Frontend là nơi compile.
- **Stable prefix**: core system, scene system, reminder giữ ổn định; context mới append muộn.
- **BudgetPlanner**: quyết định giữ/tóm tắt/cắt frame theo token budget.
- **Tool cache**: raw payload ở frontend; chỉ summary vào message.
- **Scene**: `general` và `in-page` có policy slot khác nhau.

### 2.2 Message engine (translation)

- Một conversation append-only cho mỗi job.
- System prompt cố định; mọi context thay đổi (target language, style, glossary) nằm trong user message.
- VFS giữ bản dịch; tool `write`/`patch`/`read`/`request_review`.
- Sub-agent reviewer chạy conversation mới, trả issues.
- Mục tiêu: prefix cache hit; DeepSeek cache prefix ~0.1x; provider routing có thể miss, chấp nhận.

### 2.3 Pi runtime

- Model registry: `contextWindow`, `maxTokens`, cost.
- Context overflow detection; retry có kiểm soát.
- Cost capture theo usage; metrics ledger.
- Per-feature model assignment; provider config tách khỏi model.

### 2.4 Task queue

- Việc dài chạy async; dedup key, `force`, Redis lock, leader/follower.
- Follower đọc lại stream byte-identical; cache hit phát `done` tổng hợp.
- SSE/realtime; polling fallback.

## 3. Nguyên tắc xuyên suốt

1. **Tách durable context khỏi chat.** File sống ngoài context window.
2. **Stable prefix, append late.** Giữ cache; đừng rewrite phần đầu.
3. **Progressive disclosure.** Luật ngắn; chi tiết theo nhu cầu.
4. **Self-contained handoff.** Người nhận không cần hỏi lại.
5. **Evidence + provenance.** File, lệnh, thời gian, build/commit.
6. **Fresh context cho judgment.** Review không cùng người viết.
7. **Context budget.** Token/cost là tài nguyên; không dump.
8. **Compaction-safe state.** Ledger/tasks/spec thay trí nhớ.
9. **Read before ask.** Code/docs hiện có là context miễn phí.
10. **Model routing.** Model mạnh cho context/plan; model rẻ cho thi hành.

## 4. Áp dụng cho `_core trains`

- `AGENTS.md` ngắn; `docs/` chi tiết; `.opencode/skills/` theo nhu cầu.
- Task brief + plan + ledger cho việc lớn; `docs/sessions/` cho điều tra.
- `session-to-memory` sau mỗi session; skill-first nếu quy trình lặp.
- Model routing: `plan` = Pro, `build` = Flash; context collector = Flash.
- Review độc lập; evidence trước khi báo xong.
- Không đưa context của một dự án vào hub; để trong `docs/` của dự án.

## 5. Nguồn đọc

- `../core/apps/core/AGENTS.md` — AI module, Pi runtime.
- `../core/docs/superpowers/specs/2026-05-31-admin-agent-core-design.md` — message pipeline, budget, stable prefix.
- `../core/docs/superpowers/specs/2026-08-06-ai-message-engine-design.md` — append-only conversation, VFS, cache.
- `../core/docs/superpowers/specs/2026-05-30-ai-sdk-migration-to-pi-design.md` — context overflow, cost, registry.
- `../SKILL` — skill progressive disclosure, session-handoff, session-to-skill-and-blog.
- `local/sources/methodology-notes.md` — context engineering, docs-first (local-only).
- `docs/ai-work-management.md` — task brief, handoff, review.
- `local/sources/workflow-case-study.md` — ledger, artifacts, verify (local-only).
