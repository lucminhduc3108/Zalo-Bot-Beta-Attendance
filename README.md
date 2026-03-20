# Hệ thống Chấm công qua Zalo Bot

Hệ thống chấm công cơ bản sử dụng Zalo Bot để điểm danh check-in/check-out.

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cách hoạt động](#cách-hoạt-động)
- [Cấu trúc dữ liệu](#cấu-trúc-dữ-liệu)
- [API Endpoints](#api-endpoints)
- [Cài đặt](#cài-đặt)
- [Ví dụ tương tác](#ví-dụ-tương-tác)

---

## Giới thiệu

Hệ thống cho phép nhân viên chấm công bằng cách nhắn tin nhắn cho Zalo Bot:

- **Check-in**: Nhắn `checkin` để bắt đầu làm việc
- **Check-out**: Nhắn `checkout` để kết thúc làm việc

### Sơ đồ luồng dữ liệu (Webhook)

```
[Nhân viên] → [Zalo App] → [Zalo Server] ─── Webhook ──→ [Backend] → [MongoDB Database]
                ↑                                                             ↓
                └──────────────────── [Phản hồi (sendMessage)] ←────────────┘
```

---

## Cách hoạt động (Webhook)

1. **Nhân viên** nhắn tin nhắn `checkin` hoặc `checkout` cho Zalo Bot
2. **Zalo Server** nhận tin nhắn và gửi webhook POST request về backend (kèm header `X-Bot-Api-Secret-Token`)
3. **Backend** nhận được webhook và xử lý:
   - Verify secret_token từ header X-Bot-Api-Secret-Token
   - Parse thông tin (from.id, chat.id, message.text, event_name)
   - Kiểm tra user đã được đăng ký chưa
   - Lưu record vào MongoDB database
   - Gọi API `sendMessage` để phản hồi cho user
4. **User** nhận được thông báo xác nhận

### Sự kiện Webhook (event_name)

Zalo hỗ trợ các loại sự kiện:
- `message.text.received`: Nhận tin nhắn văn bản
- `message.image.received`: Nhận tin nhắn hình ảnh
- `message.sticker.received`: Nhận tin nhắn Sticker
- `message.unsupported.received`: Nhận tin nhắn chưa hỗ trợ

---

## Cấu trúc dữ liệu

### Database: MongoDB

Sử dụng MongoDB (Mongoose ODM) để lưu trữ dữ liệu.

### Collection `users`

Lưu thông tin nhân viên:

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | MongoDB ID tự động |
| zaloId | String | Zalo user ID (unique) |
| displayName | String | Tên hiển thị |
| phone | String | Số điện thoại |
| createdAt | Date | Ngày tạo |
| updatedAt | Date | Ngày cập nhật |

### Collection `attendance`

Lưu lịch sử chấm công:

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | MongoDB ID tự động |
| userId | ObjectId | Reference đến collection users |
| type | String | Loại: 'checkin' hoặc 'checkout' |
| timestamp | Date | Thời điểm chấm công |
| note | String | Ghi chú |
| createdAt | Date | Ngày tạo record |

### Dữ liệu từ Webhook

Webhook từ Zalo gửi về với các trường chính:

| Trường | Kiểu | Mô tả |
|---------|------|-------|
| ok | Boolean | Luôn true |
| result.event_name | String | Tên sự kiện (message.text.received, ...) |
| result.message.from.id | String | ID người gửi |
| result.message.from.display_name | String | Tên hiển thị người gửi |
| result.message.from.is_bot | Boolean | Người gửi có phải là bot không |
| result.message.chat.id | String | ID cuộc trò chuyện (dùng để phản hồi) |
| result.message.chat.chat_type | String | Loại: PRIVATE hoặc GROUP |
| result.message.text | String | Nội dung tin nhắn |
| result.message.message_id | String | ID tin nhắn |
| result.message.date | Number | Timestamp tin nhắn |

---

## API Endpoints

### Webhook Endpoints

#### `GET /webhook` (Webhook Verification)
Verify webhook với Zalo.

**Query params:**
```
?your_bot_token=xxx
```

#### `POST /webhook` (Nhận tin nhắn)
Zalo gửi webhook POST request về backend khi có tin nhắn.

**Headers:**
```
X-Bot-Api-Secret-Token: your_secret_token
```

**Request từ Zalo:**
```json
{
  "ok": true,
  "result": {
    "message": {
      "from": {
        "id": "6ede9afa66b88fe6d6a9",
        "display_name": "Ted",
        "is_bot": false
      },
      "chat": {
        "id": "6ede9afa66b88fe6d6a9",
        "chat_type": "PRIVATE"
      },
      "text": "checkin",
      "message_id": "2d758cb5e222177a4e35",
      "date": 1750316131602
    },
    "event_name": "message.text.received"
  }
}
```

### Zalo Bot API (Gửi tin nhắn)

Backend gọi API để gửi tin nhắn phản hồi cho user.

#### `POST https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`
Gửi tin nhắn phản hồi cho user.

**Request:**
```json
{
  "chat_id": "user_zalo_id",
  "text": "Check-in thành công!"
}
```

**Response:**
```json
{
  "ok": true,
  "result": {
    "message_id": "82599fa32f56d00e8941",
    "date": 1749632637199
  }
}
```

**Sample code:**
```javascript
const axios = require("axios");

const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`;
const response = await axios.post(entrypoint, {
  chat_id: "user_zalo_id",
  text: "Check-in thành công!"
});
```

### Internal API Endpoints

#### `POST /api/attendance/checkin`
Xử lý check-in.

#### `POST /api/attendance/checkout`
Xử lý check-out.

#### `GET /api/attendance/:userId`
Lấy lịch sử chấm công của user.

---

## Cài đặt

### Yêu cầu

- Node.js (v16 trở lên)
- npm hoặc yarn
- MongoDB (local hoặc MongoDB Atlas)
- ngrok (để expose local server ra public URL cho Zalo gọi webhook)

### Các bước

1. **Clone hoặc tải code**

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình environment variables**

   Tạo file `.env`:
   ```env
   # Zalo Bot Credentials
   ZALO_BOT_TOKEN=your_bot_token

   # Webhook Secret Token (dùng để xác thực request từ Zalo)
   ZALO_SECRET_TOKEN=your_secret_token

   # Server
   PORT=3000

   # MongoDB Connection
   # Local MongoDB:
   MONGO_URI=mongodb://localhost:27017/zalo_attendance

   # Hoặc MongoDB Atlas:
   # MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zalo_attendance
   ```

4. **Đảm bảo MongoDB đang chạy**
   - Nếu dùng local: Đảm bảo MongoDB service đang hoạt động
   - Nếu dùng Atlas: Đã có account và cluster MongoDB Atlas

5. **Chạy ngrok để expose local server**
   ```bash
   ngrok http 3000
   ```
   Copy URL ngrok (ví dụ: `https://abc123.ngrok.io`)

6. **Set webhook với Zalo Bot**

   Gọi API để đăng ký webhook URL:
   ```javascript
   const axios = require("axios");

   const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/setWebhook`;
   const response = await axios.post(entrypoint, {
     url: "https://your-ngrok-url/webhook",
     secret_token: "your-secret-token"
   });
   ```

7. **Khởi chạy server**
   ```bash
   npm start
   ```

8. **Gửi tin nhắn cho Bot**

   - Mở Zalo, tìm kiếm và nhắn tin cho Bot của bạn
   - Nhắn `checkin` hoặc `checkout` để test

---

## Ví dụ tương tác

### Tin nhắn Check-in

| User | Bot |
|------|-----|
| `checkin` | ✅ **Check-in thành công!** |
| | Xin chào Nguyễn Văn A |
| | Thời gian: 09:00 - 18/03/2026 |

### Tin nhắn Check-out

| User | Bot |
|------|-----|
| `checkout` | ✅ **Check-out thành công!** |
| | Tạm biệt Nguyễn Văn A |
| | Giờ ra: 18:00 - 18/03/2026 |
| | Tổng thời gian làm việc: 9h |

### Tin nhắn không hợp lệ

| User | Bot |
|------|-----|
| `hello` | ❌ Tin nhắn không hợp lệ |
| | Vui lòng nhắn `checkin` hoặc `checkout` để chấm công |

---

## Cấu trúc thư mục

```
project/
├── src/
│   ├── index.js                # Entry point
│   ├── config/
│   │   ├── index.js           # Cấu hình (env variables)
│   │   └── database.js        # Kết nối MongoDB
│   ├── models/
│   │   ├── User.js            # User Mongoose Schema
│   │   ├── Attendance.js      # Attendance Mongoose Schema
│   │   ├── userModel.js       # User CRUD operations
│   │   └── attendanceModel.js # Attendance CRUD operations
│   ├── handlers/
│   │   └── messageHandler.js # Xử lý tin nhắn checkin/checkout
│   └── services/
│       └── zaloService.js    # Gọi Zalo API
├── .env                       # Environment variables
│   ├── ZALO_BOT_TOKEN
│   ├── ZALO_SECRET_TOKEN
│   ├── PORT
│   └── MONGO_URI
├── package.json
└── README.md
```

### Luồng xử lý webhook

```javascript
// Pseudocode cho webhook handler
app.use(express.json());
const WEBHOOK_SECRET_TOKEN = 'your-secret-token';

app.post("/webhook", async (req, res) => {
  // Verify secret_token từ header
  const secretToken = req.headers["x-bot-api-secret-token"];
  if (secretToken !== WEBHOOK_SECRET_TOKEN) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const body = req.body;
  const { event_name, message } = body.result;

  if (event_name === 'message.text.received') {
    const userId = message.from.id;
    const chatId = message.chat.id;
    const text = message.text;

    if (text === 'checkin') {
      await saveCheckin(userId);
      await zaloAPI.sendMessage(chatId, '✅ Check-in thành công!');
    } else if (text === 'checkout') {
      await saveCheckout(userId);
      await zaloAPI.sendMessage(chatId, '✅ Check-out thành công!');
    }
  }

  res.json({ message: "Success" });
});
```

### Cấu hình Webhook với Zalo

Để thiết lập webhook, sử dụng API `setWebhook`:

```javascript
const axios = require("axios");
const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/setWebhook`;
const response = await axios.post(entrypoint, {
  url: "https://your-webhookurl.com",
  secret_token: "mykey-abcyxz"
});
```

**Các API quản lý Webhook:**

| API | URL | Mô tả |
|-----|-----|-------|
| setWebhook | `POST /bot${BOT_TOKEN}/setWebhook` | Thiết lập webhook URL |
| getWebhookInfo | `POST /bot${BOT_TOKEN}/getWebhookInfo` | Lấy thông tin webhook hiện tại |
| deleteWebhook | `POST /bot${BOT_TOKEN}/deleteWebhook` | Xóa cấu hình webhook |

---

## License

MIT License
