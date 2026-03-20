const express = require('express');
const router = express.Router();
const config = require('../config');
const messageHandler = require('../handlers/messageHandler');

/**
 * Webhook Routes - Xử lý webhook từ Zalo
 */

// GET / - Verify webhook (Zalo will call this to verify)
router.get('/', (req, res) => {
  console.log('Webhook verification requested');
  res.status(200).send('Webhook is active');
});

// POST / - Receive events from Zalo
router.post('/', async (req, res) => {
  try {

    // Verify secret token
    const secretToken = req.headers['x-bot-api-secret-token'];
    if (!secretToken || secretToken !== config.ZALO_SECRET_TOKEN) {
      console.warn('Invalid secret token:', secretToken);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Zalo payload: { event_name, message } - KHÔNG có "result"
    const event = req.body?.event_name;
    const message = req.body?.message;

    // Extract user info
    const user_id = message?.from?.id;
    const text = message?.text;
    const time = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    });
    const date = new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    });

    console.log('═══════════════════════════════════════');
    console.log('📩 NHẬN TIN NHẮN TỪ ZALO');
    console.log('───────────────────────────────────────');
    console.log(`👤 User ID: ${user_id}`);
    console.log(`💬 Text: ${text || '(không có text)'}`);
    console.log(`⏰ Time: ${time}`);
    console.log(`📅 Date: ${date}`);
    console.log(`📋 Event: ${event}`);
    console.log('═══════════════════════════════════════');

    // Handle text message only
    if (event === 'message.text.received') {
      console.log(message);
      await messageHandler.handleMessage(message);
    } else {
      console.log('Ignored event type:', event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
