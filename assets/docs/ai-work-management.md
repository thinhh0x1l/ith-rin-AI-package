# Quản lý AI và chia việc — playbook

Đây là **playbook chính** của hệ thống. AI của dự án khác nên bắt đầu từ `docs/README.md`, sau đó dùng file này khi thực thi task.

Mục tiêu: biến bạn thành **tech lead** của một nhóm AI, không phải người prompt từng câu. Mỗi task có owner, hợp đồng bàn giao, và bằng chứng hoàn thành. Đây là playbook thực hành, không phải lý thuyết.

## 0. Nguyên tắc gốc

1. **Một task = một output + một cách verify.** Không có output kiểm chứng được thì chưa phải task.
2. **Không ai làm hai vai.** Planner không code; executor không tự duyệt; reviewer không phải người viết.
3. **Bàn giao bằng artifact, không bằng trí nhớ hội thoại.** Mỗi bước để lại file.
4. **Model mạnh cho quyết định, model rẻ cho thi hành.** Đừng dùng Pro để sửa import.
5. **Không có evidence thì chưa xong.** Lệnh đã chạy + kết quả thật.
6. **Người giữ mục tiêu, ngân sách, quyết định cuối.** AI không tự mở rộng phạm vi.

## 1. Mô hình 5 vai

| Vai | Trách nhiệm | Input | Output | Quyền |
|---|---|---|---|---|
| Context Collector | Thu thập, nén, chỉ ra file/nguồn | Yêu cầu gốc | Context brief | read-only |
| Planner | Phân rã, risk, test strategy, acceptance | Context brief | Plan + task list | read-only |
| Executor | Viết code/file theo plan | Plan + context | Code + execution report | write/edit |
| Reviewer | Tìm lỗi độc lập | Code + plan | Findings + verdict | read-only |
| Verifier | Chạy test/lint/build/UI check | Code | Evidence | bash/read |
| Orchestrator (bạn) | Chốt mục tiêu, chia việc, duyệt, land | Tất cả | Quyết định | toàn quyền |

## 2. Phân rã công việc

### 2.1 Kích thước task

- Một task nên nằm trong **30–90 phút** làm việc của agent.
- Nếu task cần sửa > 5 file hoặc > 300 dòng, tách tiếp.
- Nếu không mô tả được acceptance trong 3 dòng, task còn mơ hồ.

### 2.2 Tách theo artifact

| Task | Output | Verify |
|---|---|---|
| Context | `context-brief.md` | mọi claim có path/nguồn |
| Plan | `plan.md` | bước rõ, acceptance rõ |
| Test | test file | fail trước, pass sau |
| Code | file thay đổi | lint/typecheck/test |
| Docs | md cập nhật | link resolve |
| Review | `review.md` | findings có file:line |
| Release | tag/changelog | CI xanh, health check |

### 2.3 Task brief

Mỗi task phải có:

```md
# Task: <tên>

## Goal
<1–2 câu, kết quả người dùng thấy>

## Why
<lý do, ràng buộc kinh doanh>

## Context
- File:
- Nguồn:
- Quyết định đã chốt:

## Constraints
- Không sửa:
- Phải giữ:
- Ngân sách/thời gian:

## Acceptance
- [ ] ...
- [ ] ...

## Verify
<lệnh cụ thể + kết quả mong đợi>

## Open questions
- ...
```

### 2.4 Thứ tự và phụ thuộc

- Vẽ nhanh: `A → B`, `A → C`, `B,C → D`.
- Task không phụ thuộc nhau có thể giao song song; task phụ thuộc phải tuần tự.
- Không giao song song hai task cùng sửa một file.

### 2.5 Definition of Ready / Done

**Ready:**

- Goal rõ, acceptance rõ.
- Context đủ, file chính đã xác định.
- Ràng buộc và vùng cấm rõ.
- Có cách verify.

**Done:**

- Acceptance pass.
- Test/lint/typecheck liên quan pass.
- Không còn TODO/TBD trong phạm vi.
- Có evidence (command + output).
- Docs/skill cập nhật nếu hành vi đổi.

## 3. Định tuyến model/agent

### 3.1 Ma trận

| Loại việc | Model/agent | Lý do |
|---|---|---|
| Đọc, tóm tắt, trích context | Flash/nhẹ | rẻ, đủ extraction |
| So sánh nhiều nguồn, spec dài | Pro/Plus/Max | giữ ngữ cảnh |
| Plan, architecture, trade-off | Pro/mạnh | cần khái quát |
| Code execution | Flash/build hoặc coding model | nhanh, rẻ |
| Review độc lập | Pro hoặc agent khác | tránh thiên lệch |
| Test/verify | script + máy | tất định |
| Ảnh | model ảnh chuyên dụng | modality |
| UI verify | người + screenshot/recording | cần mắt người |

### 3.2 Quy tắc định tuyến

- Không dùng model mạnh cho việc mechanical (rename, format, copy).
- Không dùng model rẻ cho quyết định kiến trúc, migration, bảo mật.
- Không để executor tự review; review phải là lượt độc lập.
- Không để planner viết code; nếu planner viết, plan sẽ tự hợp lý hóa.
- Mỗi task ghi rõ model/agent được giao.

### 3.3 OpenCode

Override model cho agent:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": { "model": "<provider>/<flash-model-id>" },
    "plan":  { "model": "<provider>/<pro-model-id>" }
  }
}
```

Command gợi ý:

- `/context` — agent build, model Flash: tạo context brief.
- `/plan` — agent plan, model Pro: tạo plan.
- `/write` — agent build, model Flash: thực thi plan.
- `/review` — agent riêng, model Pro: review độc lập.

Subagent gợi ý: `context-synth`, `planner`, `reviewer` với `permission.edit: deny` cho hai vai đầu.

## 4. Bàn giao

### 4.1 Nguyên tắc

- **Self-contained**: người nhận không cần hỏi lại.
- **Concrete**: file, dòng, lệnh, output.
- **Scoped**: chỉ phần cần cho task.
- **Verifiable**: acceptance + cách kiểm.
- **No secrets**: không `.env`, token, credential.

### 4.2 Chuỗi bàn giao

```text
Yêu cầu
  → Context brief (Flash)
  → Plan + acceptance (Pro)
  → Code + execution report (Flash)
  → Review findings (Pro/độc lập)
  → Verification evidence (script/người)
  → Land (bạn)
```

### 4.3 Mẫu execution report

```md
# Execution report: <task>

## Đã làm
- File:
- Thay đổi:

## Đã chạy
- `<lệnh>` → <kết quả>

## Chưa làm / còn lại
- ...

## Rủi ro
- ...
```

### 4.4 Mẫu review

```md
# Review: <task>

## Verdict
PASS / NEEDS CHANGES

## Findings
- [severity] file:line — vấn đề — đề xuất

## Đã kiểm
- [ ] acceptance
- [ ] test/lint
- [ ] edge case
- [ ] security
```

## 5. Quy trình 5 bước

1. **Intake** — chốt goal, constraints, acceptance. Nếu thiếu, hỏi.
2. **Context** — Flash thu thập, nén thành brief; chỉ đường dẫn, không dán cả repo.
3. **Plan** — Pro phân rã, risk, test strategy; chốt plan.
4. **Execute** — Flash/coding model làm theo plan, TDD, commit nhỏ, báo evidence.
5. **Review & Verify** — reviewer độc lập + test/lint/UI; bạn duyệt và land.

Tách **stage** (tạo/sửa draft) khỏi **apply** (merge/publish). Thay đổi quan trọng cần người duyệt.

## 6. Mức trưởng thành

| Mức | Năng lực | Cách làm |
|---|---|---|
| L1 | Chuyển vai thủ công | Tab Plan/Build, đổi model |
| L2 | Command + artifact | `/context`, `/plan`, `/write`, lưu file |
| L3 | Subagent có hợp đồng | `context-synth`, `planner`, `reviewer` |
| L4 | Orchestrator có checkpoint | agent chính gọi subagent, budget, dừng đúng lúc |
| L5 | Đo và cải tiến | metrics, retrospective, cập nhật skill |

Đừng lên L3–L4 khi L1–L2 còn tắc. Tự động hóa sai quy trình chỉ làm sai nhanh hơn.

## 7. Guardrails và anti-pattern

| Anti-pattern | Hậu quả | Cách sửa |
|---|---|---|
| Task mơ hồ | Agent tự đoán, rework | Task brief + acceptance |
| Context dump | Tốn token, lẫn | Brief có chọn lọc |
| Một model làm hết | Sai vai, tốn tiền | Ma trận định tuyến |
| Executor tự review | Bỏ sót lỗi | Reviewer độc lập |
| Không evidence | Báo xong ảo | Bắt buộc command/output |
| Quá nhiều agent song song | Context switching, conflict | Giới hạn 2–3 |
| Plan trôi | Làm lệch mục tiêu | Plan file + checkpoint |
| Auto publish/write | Rủi ro | Stage/apply + approval |
| Secret trong prompt | Lộ dữ liệu | Scan + không đọc `.env` |

## 8. Đo lường

Theo dõi trên 10–20 task:

- First-pass success: task đúng ngay lần đầu.
- Rework rate: số lần phải làm lại.
- Review findings: số lỗi reviewer tìm được.
- Context misses: số lần agent phải hỏi lại.
- Cost/task: token/chi phí trung bình.
- Time-to-evidence: thời gian từ task đến verify.

Câu hỏi retrospective:

- Task nào phải làm lại? Vì thiếu context hay plan sai?
- Vai nào thường xuyên bị lẫn?
- Rule nào trong `AGENTS.md` bị bỏ qua?
- Có nên tách task nhỏ hơn không?
- Có nên đổi model/agent cho loại việc này không?

## 9. Áp dụng vào `_core trains` + dự án mẫu

- Hub giữ **luật + template + skill**; dự án mẫu là **pilot**.
- Bắt đầu bằng 1 task nhỏ trong dự án mẫu: context brief → plan → execute → review → verify.
- Lưu task tại `docs/tasks/YYYY-MM-DD-<ten>.md` (hoặc `docs/sessions/` nếu là điều tra).
- Sau 3 task, cập nhật `AGENTS.md`/skill dựa trên chỗ tắc thật.
- Khi quy trình ổn, mới thêm command/subagent tự động.

## 10. Checklist nhanh

**Trước khi giao:**

- [ ] Goal + acceptance rõ.
- [ ] Context đủ, file chính xác định.
- [ ] Vùng cấm/ràng buộc rõ.
- [ ] Model/agent được chọn đúng.
- [ ] Cách verify có.

**Sau khi nhận:**

- [ ] Output đúng format.
- [ ] Acceptance pass.
- [ ] Test/lint pass.
- [ ] Evidence có.
- [ ] Không secret, không phạm vi ngoài.
- [ ] Docs/skill cập nhật nếu cần.

## 11. Template tối giản

```md
# Task: <tên>

Goal:
Why:
Context (files):
Constraints:
Acceptance:
Verify:
Owner (model/agent):
Open questions:
```

```md
# Plan: <tên>

1. <bước> — file — verify
2. ...

Risks:
Rollback:
```

```md
# Review: <tên>

Verdict:
Findings:
- [severity] file:line — vấn đề — đề xuất
Checked:
- [ ] acceptance
- [ ] tests
- [ ] security
```

## 12. Chu trình bộ nhớ

Sau mỗi session, dùng skill `session-to-memory`:

| Kiến thức | Đích |
|---|---|
| Luật đúng cho mọi phiên | `AGENTS.md` |
| Kiến thức/quyết định chi tiết | `docs/` |
| Quy trình lặp lại (qua 7 cổng) | `.opencode/skills/<name>/SKILL.md` |
| Một lần/handoff | `docs/sessions/YYYY-MM-DD-<topic>.md` |

ADR:

```md
# ADR-<NNN>: <title>

Context:
Options:
Decision:
Consequences:
Evidence:
```

Learning note (5 dòng cuối mỗi phiên):

```md
Hiểu gì:
Chưa hiểu gì:
Bằng chứng:
Sẽ kiểm chứng thế nào:
Cần hỏi ai/đọc gì:
```

## 13. Áp dụng vào dự án

- Dự án mới: `bootstrap-project` / `templates/new-project/`.
- Dự án đã có: `templates/existing-project/` — không overwrite `AGENTS.md`.
- Dự án giữ riêng: `AGENTS.md` ngắn + `docs/` + `.opencode/skills/` + `opencode.json`.
- Quy tắc riêng của dự án thắng quy tắc chung; hub chỉ giữ registry + pattern tái dùng.

## 14. Ví dụ một task hoàn chỉnh

**Intake — task brief:**

```md
# Task: thêm validate upload ảnh

Goal: từ chối file >50MB và định dạng không hỗ trợ, báo lỗi rõ
Why: upload ảnh lớn làm crash trang
Context: apps/web/app/upload/page.tsx, lib/photo.ts
Constraints: không đổi API backend
Acceptance:
- [ ] file 60MB bị từ chối kèm thông báo
- [ ] HEIC/JPEG/PNG/WebP vẫn nhận
Verify: pnpm test -- apps/web/lib/photo.test.ts; pnpm lint:web
Owner: executor Flash
```

**Context brief (Flash):**

```md
Mục tiêu: validate trước khi gọi API upload
File: upload/page.tsx (đọc file, gọi API), lib/photo.ts (parse)
Ràng buộc: max 50MB, whitelist định dạng
Câu hỏi mở: nhiều file cùng lúc?
```

**Plan (Pro):**

```md
1. Viết test fail cho validateSize/validateFormat — lib/photo.test.ts — pnpm test
2. Thêm validate vào lib/photo.ts — pnpm test
3. Hiện lỗi ở upload/page.tsx — pnpm lint:web + test
Risk: EXIF làm size sai → dùng file.size, không đọc header
Rollback: revert commit
```

**Execution report (Flash):**

```md
Đã làm: lib/photo.ts + upload/page.tsx + 4 test
Đã chạy: pnpm test -- apps/web/lib/photo.test.ts → 8 pass
Còn lại: không
```

**Review (Pro độc lập):**

```md
Verdict: PASS
Findings:
- [Minor] upload/page.tsx:42 — thông báo lỗi thiếu kích thước tối đa
Checked:
- [x] acceptance
- [x] tests
- [x] security
```

**Verify (script + người):**

```md
pnpm test → 8/8 pass
pnpm lint:web → clean
Thử tay: upload 60MB → thông báo đúng; upload HEIC → nhận
```

**Land:** squash vào nhánh chính sau khi người duyệt.

## 15. Scripts hỗ trợ (hub)

```text
node scripts/task-workspace.mjs <plan.md>          # tạo docs/tasks/<plan>/ + ledger
node scripts/task-start.mjs <plan.md> <N>          # in brief task N + lưu BASE
node scripts/task-done.mjs <plan.md> <N> -- <test> # chạy test, pass thì ghi ledger
node scripts/review-package.mjs <plan.md>          # đóng gói cho review cuối
```

Plan phải dùng heading `## Task <N>: <tên>` với các mục Goal / Files / Acceptance / Verify / Expected. Ledger sống ở `docs/tasks/<plan>/progress.md`; mỗi dòng `Task N: complete` là bằng chứng qua compaction. Script `review-package` đóng gói diff, commits, rulings, review focus cho reviewer mới.
