# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Zalo Bot Attendance System** (Hệ thống Chấm công qua Zalo) - a Node.js application that allows employees to check-in/check-out by sending messages to a Zalo Bot.

## Architecture

```
[Nhân viên] → [Zalo App] → [Zalo Server] ─── Webhook ──→ [Backend] → [MongoDB Database]
                              ↑                                                    ↓
                              └────────── [Phản hồi (sendMessage)] ←───────────┘
```

## Key Technologies

- **Runtime**: Node.js (v16+)
- **Database**: MongoDB (using Mongoose ODM)
- **Tunneling**: ngrok (for exposing local server to Zalo)
- **HTTP Client**: axios

## Environment Variables

Create a `.env` file:
```env
ZALO_BOT_TOKEN=your_bot_token
ZALO_SECRET_TOKEN=your_secret_token
PORT=3000
MONGO_URI=mongodb://localhost:27017/zalo_attendance
# Or use MongoDB Atlas connection string
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zalo_attendance
```

## Zalo Bot API Base URL

All Zalo Bot APIs use: `https://bot-api.zaloplatforms.com/bot${BOT_TOKEN}/`

## Common Commands

```bash
npm install              # Install dependencies
npm start               # Start the server (connects to MongoDB automatically)
npm run dev             # Start in development mode
```

## Webhook Flow

1. Set webhook URL using `setWebhook` API
2. Zalo sends POST requests to your `/webhook` endpoint with header `X-Bot-Api-Secret-Token`
3. Verify the secret token before processing
4. Parse event from `body.result.event_name` (e.g., `message.text.received`)
5. Get message data from `body.result.message` (contains `from.id`, `chat.id`, `text`, etc.)
6. Send response using `sendMessage` API with `chat_id` and `text`

## Event Types

- `message.text.received` - Text message received
- `message.image.received` - Image message received
- `message.sticker.received` - Sticker message received

## Key Files

- `README.md` - Full documentation
- `ZaloBotDocs/` - Zalo Bot API documentation
  - `Webhook.md` - Webhook events and payload structure
  - `sendMessage.md` - Send message API
  - `setWebhook.md` - Set webhook API
  - `getWebhookInfo.md` - Get webhook info
  - `deleteWebhook.md` - Delete webhook

## Database Models

- `src/models/User.js` - User schema (zaloId, displayName, phone)
- `src/models/Attendance.js` - Attendance schema (userId, type, timestamp, note)
- `src/models/userModel.js` - User CRUD operations
- `src/models/attendanceModel.js` - Attendance CRUD operations
