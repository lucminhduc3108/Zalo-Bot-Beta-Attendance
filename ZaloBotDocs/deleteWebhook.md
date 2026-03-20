# deleteWebhook

Cập nhật lần cuối: 10/12/2025 

Sử dụng phương thức này để gỡ bỏ thiết lập webhook nếu bạn quyết định chuyển lại sang getUpdates. Phương thức này sẽ trả về True khi xử lý thành công.

URL: https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/deleteWebhook
Method: POST
Response Type: application/json

#### Sample code

const axios = require("axios");
const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/deleteWebhook`;
const response = await axios.post(entrypoint, {});

### Parameters

Không có tham số.

### Sample response
{
  "ok": true,
  "result": {
    "url": "",
    "updated_at": 1749538250568
  }
}