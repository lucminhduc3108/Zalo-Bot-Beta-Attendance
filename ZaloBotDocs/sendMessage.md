API cho phép Bot của bạn gửi tin nhắn văn bản đến người dùng hoặc các cuộc trò chuyện.

URL: https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage
Method: POST
Response Type: application/json
Sample code
const axios = require("axios");

const entrypoint = `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/sendMessage`;
const response = await axios.post(entrypoint, {
  chat_id: "abc.xyz",
  text: "Hello"
});

Parameters
Trường	Kiểu dữ liệu	Bắt buộc	Mô tả
chat_id	String	true	ID của người nhận hoặc cuộc trò chuyện
text	String	true	Nội dung văn bản của tin nhắn sẽ được gửi, với độ dài từ 1 đến 2000 ký tự
Sample response
{
  "ok": true,
  "result": {
    "message_id": "82599fa32f56d00e8941",
    "date": 1749632637199
  }
}

