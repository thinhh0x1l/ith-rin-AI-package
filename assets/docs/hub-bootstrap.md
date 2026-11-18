# Hub bootstrap

Mỗi phiên/task mới:

1. Nếu có skill `using-hub`, load nó trước khi đọc file hoặc viết code.
2. Nếu không, theo bảng route tối thiểu:

| Tình huống | Làm |
|---|---|
| Yêu cầu chưa rõ | hỏi một câu; load `brainstorming` nếu có |
| Cần context | Context Collector (Flash) → context brief |
| Cần plan | Plan mode (Pro) → plan `## Task N:` |
| Thực thi | TDD + ledger scripts |
| Bug | root cause trước fix |
| Sắp báo xong | verify + evidence |

3. Evidence before claims: chạy lệnh, đọc output, mới báo xong.
4. Chi tiết: `docs/ai-work-management.md`; ledger: `scripts/task-*.mjs`.
5. Quy tắc riêng của dự án/skill dự án thắng.
