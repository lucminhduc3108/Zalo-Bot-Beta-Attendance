API cho phép cấu hình Webhook URL cho Bot của bạn.

URL: https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/setWebhook
Method: POST
Response Type: application/json
Sample code

const axios = require("axios");
const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/setWebhook`;
const response = await axios.post(entrypoint, {
  url: "https://your-webhookurl.com",
  secret_token: "mykey-abcyxz"
});

Parameters
Trường	Kiểu dữ liệu	Bắt buộc	Mô tả
url	String	true	URL nhận thông báo dạng HTTPS.
secret_token	String	true	Một khóa bí mật từ 8 tới 256 ký tự, để xác thực yêu cầu từ Zalo gọi về hệ thống của bạn. Token sẽ được đính kèm trong header "X-Bot-Api-Secret-Token" trong tất cả các yêu cầu từ Zalo gọi tới hệ thống của bạn.
Sample response
{
  "ok": true,
  "result": {
    "url": "https://your-webhookurl.com",
    "updated_at": 1749538250568
  }
}