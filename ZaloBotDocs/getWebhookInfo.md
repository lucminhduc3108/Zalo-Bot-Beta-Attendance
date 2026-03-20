API cho phép lấy trạng thái cấu hình hiện tại của webhook

URL: https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/getWebhookInfo
Method: POST
Response Type: application/json
Sample code

const axios = require("axios");
const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/getWebhookInfo`;
const response = await axios.post(entrypoint, {});

Parameters
Không yêu cầu tham số đi kèm.

Sample response
{
  "ok": true,
  "result": {
    "url": "https://your-webhookurl.com",
    "updated_at": 1749633372026
  }
}