# Chọn model khi đọc và viết file quy tắc

Tài liệu này trả lời câu hỏi: với OpenCode Go, nên chọn model nào để đọc các file `.md` mà repo khác dùng để hướng dẫn AI, và chọn model nào để viết quy tắc cho dự án của mình.

## Trả lời ngắn

| Việc | Chọn gì | Ghi chú |
|---|---|---|
| Đọc và tóm tắt `AGENTS.md`, `CLAUDE.md`, `SKILL.md`, `README.md` | Model dòng Flash/nhẹ | Nhanh, ít tốn hạn mức, đủ để trích ý chính |
| Đọc nhiều repo cùng lúc hoặc file rất dài | Model Pro/Plus/Max | Giữ ngữ cảnh tốt hơn, ít bỏ sót quy tắc |
| Viết `AGENTS.md` hoặc bộ quy tắc mới | Model mạnh nhất trong hạn mức | Cần khái quát, cô đọng, tránh viết dài dòng |
| Chỉ đọc và phân tích | Chế độ Plan (`Tab`) | Không sửa file |

Danh sách model thay đổi theo thời điểm và gói. Gõ `/models` trong OpenCode để xem danh sách hiện tại. Không giả định một tên model cụ thể là luôn có. Nếu có các dòng như Flash của DeepSeek/GLM/Qwen, hoặc Pro/Max tương ứng, chọn theo đúng loại việc ở bảng trên.

## Vì sao chia như vậy

- **Đọc rule-md là bài toán extraction.** Mục tiêu là tìm câu quy tắc, lệnh build/test/lint, cấu trúc thư mục, điều cấm. Model nhẹ làm tốt và rẻ.
- **Viết rule-md là bài toán synthesis.** Phải loại trùng, dung hòa xung đột, chọn mức trừu tượng phù hợp, và cắt xuống còn vài chục dòng. Model yếu thường viết dài, chung chung, hoặc bỏ mất ràng buộc quan trọng.
- **File quá dài làm AI bỏ qua quy tắc.** Giữ `AGENTS.md` ngắn; đưa chi tiết vào `docs/` và link tới.

## Quy trình gợi ý

1. Dùng model Flash đọc từng repo, trích ra:
   - lệnh build / test / lint;
   - cấu trúc thư mục và entrypoint;
   - quy ước code và naming;
   - điều cấm / vùng nguy hiểm;
   - quy trình release, migrate, deploy.
2. Dùng model mạnh gộp các kết quả, loại trùng, giải quyết xung đột.
3. Viết `AGENTS.md` ở gốc dự án, giữ dưới khoảng 100 dòng.
4. Chạy thử một task nhỏ để xem AI có tuân thủ không; sửa lại quy tắc nếu bị bỏ qua.

## Mẫu cấu trúc AGENTS.md

```md
# AGENTS.md

## Lệnh
- build:
- test:
- lint:

## Cấu trúc
- ...

## Quy ước
- ...

## Không được làm
- ...

## Verify
- ...
```

## Lưu ý

- Các file này hướng dẫn AI khi làm việc, không phải dữ liệu huấn luyện model.
- Không đưa secrets, token, hay thông tin máy cá nhân vào file quy tắc.
- Nếu repo nguồn có nhiều tầng `AGENTS.md`, đọc file gốc trước rồi mới đọc file con.
