# ith-rin AI — AI Management System

Đây là **hệ thống quản lý AI tập trung** cho nhiều dự án. AI của một dự án khác nên đọc file này trước, sau đó đọc các tài liệu chi tiết theo nhu cầu. Mục tiêu: mọi dự án vận hành AI theo cùng một hệ thống — chia việc đúng vai, dùng đúng model, giữ đúng bộ nhớ, chứng minh đúng bằng chứng.

- Master index: `INDEX.md`.
- Local-only index: `local/INDEX.md` (không commit); danh sách từ cấm public ở `local/forbidden-terms.md`.

## 1. Hệ thống gồm gì

| Phần | File chính | Trả lời câu hỏi |
|---|---|---|
| Luật luôn bật | `AGENTS.md` | AI phải tuân theo gì mỗi phiên |
| Bootstrap | `docs/hub-bootstrap.md` | Route task mỗi phiên (nạp qua `instructions`) |
| Quản lý việc | `docs/ai-work-management.md` | Chia việc, bàn giao, review, verify thế nào |
| Chọn model | `docs/model-selection.md` | Model nào cho việc gì |
| Quản lý context | `docs/context-management.md` | Context 3 tầng, state file, stable prefix |
| Nguồn chi tiết (local-only) | `local/sources/` | Case study, nguồn học; không commit/push |
| Registry dự án | `docs/projects.md` | Dự án nào đang được quản lý |
| Credits | `docs/credits.md` | Nguồn tham khảo và ghi công |
| Biên bản | `docs/sessions/` | Handoff, quyết định một lần |
| Kỹ năng | `.opencode/skills/` | Quy trình nạp theo nhu cầu |

## 2. Đọc theo thứ tự

**Nhanh (10 phút):** file này + `AGENTS.md`.

**Đủ để làm việc (30 phút):**

1. `docs/model-selection.md` — chọn model.
2. `docs/ai-work-management.md` — vai trò, chia task, bàn giao, review, verify.
3. `docs/context-management.md` — cách giữ context.

**Sâu hơn:** `local/sources/` (local-only, không commit).

## 3. Vòng đời một task

```text
Intake   → chốt goal, constraints, acceptance
Context  → Flash thu thập, nén thành context brief
Plan     → Pro phân rã, risk, test strategy, acceptance
Execute  → Flash/coding model làm theo plan, TDD
Review   → agent/model độc lập tìm lỗi
Verify   → chạy lệnh, screenshot, evidence
Land     → người duyệt, squash/rebase/PR
```

Mỗi bước có **input, output, cách verify**. Không bước nào tự biến mất.

- Route task: skill `using-hub`.
- Ledger: `scripts/task-workspace.mjs`, `task-start.mjs`, `task-done.mjs`, `review-package.mjs` (plan dùng heading `## Task N:`).

## 4. Vai trò và định tuyến

| Vai | Model/agent | Quyền | Output |
|---|---|---|---|
| Context Collector | Flash/nhẹ | read-only | context brief |
| Planner | Pro/mạnh | read-only | plan + acceptance |
| Executor | Flash/coding | write | code + execution report |
| Reviewer | Pro/độc lập | read-only | findings + verdict |
| Verifier | script + người | bash/read | evidence |
| Orchestrator | người | toàn quyền | quyết định |

## 5. Nguyên tắc hệ thống

1. Một task = một output + một cách verify.
2. Không ai làm hai vai; reviewer không phải người viết.
3. Bàn giao bằng artifact, không bằng trí nhớ hội thoại.
4. Model mạnh cho quyết định, model rẻ cho thi hành.
5. Không có evidence thì chưa xong.
6. Context: luôn bật ít, nạp theo nhu cầu, chi tiết trong file.
7. Việc tất định giao script; việc phá hủy cần approval.
8. Sau session: `session-to-memory` — docs, skill, hoặc luật AGENTS.
9. Người giữ mục tiêu, ngân sách, quyết định cuối.

## 6. Áp dụng vào một dự án

**Dự án mới:**

```bash
node "D:\Storage\inen\trainai\_core trains\templates\new-project\bootstrap.mjs" \
  --target <dir> --name <name> --description <desc> \
  --install <cmd> --dev <cmd> --build <cmd> --test <cmd> --lint <cmd> --typecheck <cmd>
```

**Dự án đã có:** dùng `templates/existing-project/`:

1. Copy 3 tài liệu vào `docs/ai-memory/`.
2. Dán mục “Kế thừa từ hub” vào `AGENTS.md` của dự án.
3. Merge `opencode.json` (skills + references hub).
4. Copy 3 skill vào `.opencode/skills/`.
5. Restart OpenCode, kiểm tra bằng 3 câu hỏi.

**Dự án nào cũng nên có:**

- `AGENTS.md` — luật riêng, ngắn (< 100 dòng).
- `docs/` — chi tiết dự án, ADR, task.
- `.opencode/skills/` — quy trình lặp của dự án.
- `opencode.json` — skills + references tới hub.

## 7. Cập nhật bộ nhớ

Sau mỗi session có kiến thức tái dùng, dùng skill `session-to-memory`:

- Luật luôn đúng cho mọi phiên → `AGENTS.md`.
- Kiến thức chi tiết/quyết định → `docs/`.
- Quy trình lặp lại → `.opencode/skills/<name>/SKILL.md`.
- Một lần/handoff → `docs/sessions/YYYY-MM-DD-<topic>.md`.

Cổng skill (chỉ tạo skill khi cả 7 pass): triggerability, repeatability, knowledge delta, coherence, verifiability, stability, boundary clarity.

## 8. Kiểm tra chất lượng

```bash
node scripts/check-memory.mjs
```

Kiểm: `AGENTS.md` < 100 dòng, JSON hợp lệ, frontmatter skill, link, secret, placeholder. Nếu có `local/forbidden-terms.json`, `check-memory` cũng gọi `check-forbidden-terms` để chặn từ nhạy cảm rò rỉ ra public. `check-memory` cũng gọi `check-index` để đảm bảo `INDEX.md` liệt kê đủ file public. Chạy trước mỗi commit; CI cũng chạy (phần local-only chỉ chạy khi có file local).

## 9. Đọc nguồn gốc

- `local/sources/source-repos.md` — bản đồ đọc `../core` và `../SKILL` (local-only).
- `docs/projects.md` — dự án đang quản lý.
- `templates/` — bộ khởi tạo/retrofit.
