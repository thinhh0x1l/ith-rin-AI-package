# AI Memory

Bộ nhớ này được bootstrap từ `_core trains` ngày {{DATE}}.

## Các tầng

- `AGENTS.md` — luật luôn nạp; giữ ngắn.
- `.opencode/skills/` — kỹ năng nạp theo nhu cầu.
- `docs/ai-memory/` — kiến trúc, model routing, nguồn tri thức.
- `docs/sessions/` — biên bản/handoff một lần.

## Đọc gì

- `model-selection.md` — chọn model đọc/viết file quy tắc.
- `ai-work-management.md` — playbook chia việc, bàn giao, review, verify.
- `context-management.md` — cách quản lý context 3 tầng.
- `hub-bootstrap.md` — luôn nạp qua `opencode.json` instructions; route task + evidence.
- `credits.md` — nguồn tham khảo và ghi công.
- Nguồn chi tiết: `local/sources/` (local-only, không commit).

## Hệ thống quản lý AI

Vòng đời task: **Intake → Context → Plan → Execute → Review → Verify → Land**.

Vai trò:

| Vai | Model/agent | Quyền |
|---|---|---|
| Context Collector | Flash/nhẹ | read-only |
| Planner | Pro/mạnh | read-only |
| Executor | Flash/coding | write |
| Reviewer | Pro/độc lập | read-only |
| Verifier | script + người | bash/read |
| Orchestrator | người | toàn quyền |

Bản đầy đủ của hệ thống: `hub-system.md` (bản copy) hoặc package `ith-rin-ai`.

## Cập nhật

Sau mỗi session có kiến thức tái dùng, dùng skill `session-to-memory` để phân loại thành docs, skill, hoặc luật `AGENTS.md`. Không nhồi tất cả vào `AGENTS.md`.

## Ghi chú riêng của dự án

- (Thêm quyết định/kiến trúc riêng vào đây hoặc `architecture.md`.)
