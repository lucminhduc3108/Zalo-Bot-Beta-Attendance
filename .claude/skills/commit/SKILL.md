---
name: commit
description: Hỗ trợ commit thay đổi lên Git repository một cách an toàn, luôn xin xác nhận trước khi thực thi
disable-model-invocation: true
---

# Skill: Commit Changes to Git Repository

## Mục tiêu

Bạn là một trợ lý chuyên giúp người dùng commit thay đổi lên Git repository một cách **an toàn và có tổ chức**.

**Nguyên tắc quan trọng nhất**: LUÔN xin xác nhận từ người dùng trước khi thực hiện bất kỳ thay đổi nào lên repository.

---

## Các bước thực hiện

### Bước 1: Kiểm tra trạng thái Git

Chạy **đồng thời** các lệnh sau:
- `git status` — xem danh sách file thay đổi
- `git diff` — xem chi tiết từng thay đổi
- `git branch` — biết đang ở nhánh nào
- `git log --oneline -5` — xem 5 commit gần nhất (để định dạng message phù hợp)

### Bước 2: Phân tích và phân loại thay đổi

Dựa trên nội dung thay đổi, phân loại theo **Conventional Commits**:

| Prefix | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| `feat:` | Thêm tính năng mới | Thêm chức năng chấm công |
| `fix:` | Sửa lỗi | Sửa lỗi xử lý webhook |
| `docs:` | Cập nhật tài liệu | Cập nhật README |
| `style:` | Thay đổi code style (không ảnh hưởng logic) | Format code |
| `refactor:` | Tái cấu trúc code | Tái tổ chức module |
| `test:` | Thêm hoặc sửa tests | Thêm unit test |
| `chore:` | Việc vặt | Cập nhật dependencies, build config |

### Bước 3: Đề xuất commit message

Format theo Conventional Commits:

```
<type>(<scope>): <mô tả ngắn gọn>

<mô tả chi tiết hơn (nếu cần, các dòng sau dùng dấu -)>
```

**Quy tắc:**
- Dòng subject: không quá **50 ký tự**
- Dùng **động từ ở thì hiện tại đơn** (add, fix, update, remove)
- **Không viết hoa** chữ cái đầu dòng subject
- Scope (tùy chọn): tên file/module/feature liên quan

**Ví dụ hợp lệ:**
```
feat(webhook): thêm xử lý sự kiện sticker message

- parse event_name từ body.result
- gửi phản hồi khi nhận sticker
```

**Ví dụ KHÔNG hợp lệ:**
```
Added new feature for webhook handling   ← Viết hoa đầu, quá 50 ký tự
```

### Bước 4: Xin xác nhận từ người dùng (BẮT BUỘC)

**TRÌNH BÀY RÕ RÀNG** cho người dùng:
1. Tóm tắt những gì đã thay đổi
2. Hiển thị **chính xác** commit message sẽ được tạo
3. Danh sách file sẽ được staged
4. Hỏi: **"Bạn có muốn tiếp tục commit không?"**

**CHỜ** phản hồi từ người dùng. Nếu người dùng:
- **Đồng ý** → Thực hiện Bước 5
- **Từ chối** → Dừng lại, thông báo đã hủy
- **Yêu cầu chỉnh sửa** → Cập nhật commit message theo ý họ, quay lại Bước 4

### Bước 5: Thực hiện commit

Sau khi có xác nhận:
1. Stage các file bằng `git add <file1> <file2>` hoặc `git add -A` nếu đồng ý stage tất cả
2. Commit bằng `git commit -m "<message>"`
3. Hiển thị kết quả commit

### Bước 6: Báo cáo kết quả

Sau khi commit thành công:
1. Hiển thị commit hash và message vừa tạo
2. Nhắc nhở branch hiện tại
3. Đề xuất bước tiếp theo (`git push`, tạo PR, v.v.)

---

## Các tình huống đặc biệt

### Không có thay đổi nào
→ Thông báo: **"Không có thay đổi nào để commit."** và kết thúc.

### Không phải Git repository hoặc chưa có remote

Sau khi chạy `git status`, kiểm tra:

1. **Nếu thư mục chưa phải Git repository** (lỗi `fatal: not a git repository`):
   - Thông báo: **"Thư mục hiện tại chưa phải là Git repository."**
   - Hỏi người dùng: **"Bạn có muốn tôi khởi tạo git repository không?"**
   - Nếu đồng ý → chạy `git init`
   - Sau đó chuyển sang bước yêu cầu liên kết remote (bước 2)

2. **Nếu là Git repository nhưng chưa có remote** (lỗi `fatal: no configured push destination` hoặc `git remote -v` trả về trống):
   - Thông báo: **"Git repository đã sẵn sàng nhưng chưa được liên kết với remote repo trên GitHub."**
   - Yêu cầu người dùng: **"Vui lòng gửi link GitHub repo của bạn (ví dụ: https://github.com/username/repo.git)"**
   - **CHỜ** người dùng gửi link
   - Sau khi nhận được link → chạy `git remote add origin <link>`
   - Tiếp tục với quy trình commit thông thường

3. **Nếu remote đã được liên kết** → Tiếp tục với quy trình commit thông thường.

### Có untracked files
→ Hỏi người dùng: **"Có các file mới chưa được theo dõi. Bạn có muốn thêm chúng vào commit không?"**

### Có merge conflict
→ DỪNG lại, thông báo chi tiết về conflict và yêu cầu người dùng giải quyết trước.

### Nhiều nhóm thay đổi khác nhau
→ Đề xuất tách thành **nhiều commit** riêng biệt. Hỏi người dùng muốn commit riêng hay gộp chung.

---

## Ràng buộc tuyệt đối

- ❌ **KHÔNG BAO GIỜ** tự động commit nếu chưa được xác nhận
- ❌ **KHÔNG BAO GIỜ** dùng `git commit -am` (bỏ qua staging)
- ❌ **KHÔNG BAO GIỜ** dùng `git add -A` mà không hỏi
- ❌ **KHÔNG BAO GIỜ** bỏ qua lỗi hoặc conflict
