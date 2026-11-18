# AGENTS.md — {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Bắt đầu

- Đọc `docs/ai-memory/README.md` để hiểu bộ nhớ AI kế thừa.
- Hệ thống quản lý AI đầy đủ: `docs/ai-memory/hub-system.md` (bản copy) hoặc package `ith-rin-ai`.
- Đọc `docs/ai-memory/context-management.md` hoặc `ai-work-management.md` khi cần quản lý context/chia việc.
- Quy tắc riêng của dự án này thắng quy tắc chung.

## Lệnh

| Việc | Lệnh |
|---|---|
| Cài đặt | `{{INSTALL_CMD}}` |
| Dev | `{{DEV_CMD}}` |
| Build | `{{BUILD_CMD}}` |
| Test | `{{TEST_CMD}}` |
| Lint | `{{LINT_CMD}}` |
| Typecheck | `{{TYPECHECK_CMD}}` |

## Cấu trúc

- `src/` — mã nguồn chính.
- `docs/` — tài liệu và bộ nhớ AI.
- `docs/sessions/` — biên bản/handoff một lần.
- `.opencode/skills/` — kỹ năng AI của dự án.

## Quy ước

- Giữ thay đổi trong phạm vi yêu cầu.
- Chỉ chạy lint/typecheck trên file thay đổi.
- Viết test cho hành vi mới hoặc bugfix khi có test framework.
- Ghi rõ lệnh đã chạy và kết quả khi báo hoàn thành.

## Không được làm

- Không commit/push nếu chưa được yêu cầu.
- Không đưa secrets, token, `.env` vào file hoặc log.
- Không bịa lệnh, model, hoặc kết quả kiểm thử.
- Không sửa file ngoài phạm vi yêu cầu.

## Kế thừa từ hub

- `docs/ai-memory/model-selection.md` — chọn model đọc rule-md và viết rule-md.
- `docs/ai-memory/ai-work-management.md` — playbook chia việc, bàn giao, review, verify.
- `docs/ai-memory/context-management.md` — cách quản lý context 3 tầng.
- `docs/ai-memory/credits.md` — nguồn tham khảo.
- Nguồn chi tiết: `local/sources/` (local-only, không commit).
- Hub gốc (tham khảo): `{{HUB_PATH}}`.

## Bộ nhớ AI

- `AGENTS.md` (file này) — luật luôn nạp; giữ ngắn.
- `docs/ai-memory/` — bộ nhớ chi tiết.
- `.opencode/skills/` — kỹ năng nạp theo nhu cầu: bắt đầu task bằng `using-hub`, sau session dùng `session-to-memory`.
- `scripts/` — ledger task: `task-workspace`, `task-start`, `task-done`, `review-package`.
- `docs/sessions/` — biên bản/handoff một lần.

## Verify

- Chạy lint/typecheck trên file đổi.
- Chạy test liên quan.
- Kiểm tra link trong tài liệu nếu vừa sửa docs.
- Báo cáo lệnh đã chạy và kết quả thực tế.
