# Kế hoạch xây dựng Hệ thống Chấm công qua Zalo Bot

## Tóm tắt yêu cầu
- **Loại dự án**: Dự án mới xây từ đầu
- **Công nghệ**: Node.js + Express + **MongoDB**
- **Tính năng**: Check-in/Check-out cơ bản
- **Đăng ký user**: Tự động khi gửi tin nhắn lần đầu
- **Tunneling**: Dùng ngrok

---

## Danh sách Task (chi tiết)

### Phase 1: Khởi tạo Project
- [ ] **1.1** Tạo `package.json` và cài đặt dependencies (express, axios, mongoose, dotenv)
- [ ] **1.2** Tạo cấu thư mục theo README (src/config, src/routes, src/services, src/handlers, src/models, src/utils, database)
- [ ] **1.3** Tạo file `.env` mẫu với các biến ZALO_BOT_TOKEN, ZALO_SECRET_TOKEN, PORT, **MONGODB_URI**

### Phase 2: Database (MongoDB)
- [ ] **2.1** Cài đặt MongoDB driver (`mongoose`)
- [ ] **2.2** Tạo `src/config/database.js` - kết nối MongoDB sử dụng mongoose
- [ ] **2.3** Tạo `src/models/User.js` - schema MongoDB cho User (zaloId, phone, name, createdAt)
- [ ] **2.4** Tạo `src/models/Attendance.js` - schema MongoDB cho Attendance (userId, type, timestamp, createdAt)
- [ ] **2.5** Cập nhật `src/index.js` gọi kết nối database khi khởi động

### Phase 3: Models (tên file giữ nguyên, nội dung dùng MongoDB)
- [ ] **3.1** Cập nhật `src/models/userModel.js` - dùng Mongoose methods (create, findOne, findById)
- [ ] **3.2** Cập nhật `src/models/attendanceModel.js` - dùng Mongoose methods (create, find, aggregate)

### Phase 4: Services (Zalo API)
- [ ] **4.1** Tạo `src/services/zaloService.js` - gọi Zalo Bot API
  - sendMessage(chat_id, text)
  - setWebhook(url, secret_token)
  - getWebhookInfo()
  - deleteWebhook()

### Phase 5: Handlers (Xử lý logic)
- [ ] **5.1** Tạo `src/handlers/messageHandler.js` - xử lý tin nhắn
  - handleCheckin(user, chatId): lưu attendance type='checkin', gửi phản hồi
  - handleCheckout(user, chatId): lưu attendance type='checkout', gửi phản hồi
  - autoRegisterUser(zaloId, displayName): tạo user mới nếu chưa tồn tại

### Phase 6: Routes & Server
- [ ] **6.1** Tạo `src/routes/webhookRoutes.js` - GET /webhook (verify), POST /webhook (nhận tin nhắn)
- [ ] **6.2** Tạo `src/config/index.js` - load environment variables
- [ ] **6.3** Tạo `src/index.js` - entry point, khởi tạo Express server

### Phase 7: Test & Deploy
- [ ] **7.1** Đảm bảo MongoDB Atlas cluster đang chạy và lấy connection string
- [ ] **7.2** Chạy `ngrok http 3000` để lấy public URL
- [ ] **7.3** Gọi API setWebhook để đăng ký URL với Zalo
- [ ] **7.4** Chạy `npm start` và test bằng cách gửi tin nhắn cho Bot

---

## Thứ tự thực hiện đề xuất

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
```

## File critical cần tạo/sửa
- `package.json` - thêm mongoose
- `.env` - thêm MONGODB_URI
- `src/config/database.js` - kết nối MongoDB
- `src/config/index.js` - load environment variables
- `src/models/User.js` - User schema (MongoDB)
- `src/models/Attendance.js` - Attendance schema (MongoDB)
- `src/models/userModel.js` - CRUD operations
- `src/models/attendanceModel.js` - CRUD operations
- `src/services/zaloService.js`
- `src/handlers/messageHandler.js`
- `src/routes/webhookRoutes.js`
- `src/index.js`
