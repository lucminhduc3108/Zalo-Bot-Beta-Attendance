const express = require('express');
const config = require('./config');
const connectDB = require('./config/database');
const webhookRoutes = require('./routes/webhookRoutes');
const zaloService = require('./services/zaloService');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/webhook', webhookRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Zalo Attendance Bot',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      webhook: 'POST /webhook',
      health: 'GET /webhook/health',
      setWebhook: 'GET /set-webhook'
    }
  });
});

// Route tạm để set webhook cho bot hiện tại
app.get('/set-webhook', async (req, res) => {
  const url = req.query.url || `https://${req.headers.host}/webhook`;
  const secretToken = config.ZALO_SECRET_TOKEN;
  try {
    const result = await zaloService.setWebhook(url, secretToken);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Gửi 300 tin nhắn tới user cố định khi server khởi động
// const sendBulkMessages = async (userId) => {
//   const TOTAL = 300;
//   const DELAY_MS = 100;

//   for (let i = 1; i <= TOTAL; i++) {
//     try {
//       await zaloService.sendMessage(userId, `Tin nhắn số ${i}`);
//       console.log(`[BulkSend] Đã gửi tin ${i}/${TOTAL}`);
//     } catch (err) {
//       console.error(`[BulkSend] Lỗi tin ${i}:`, err.message);
//     }
//     await new Promise((r) => setTimeout(r, DELAY_MS));
//   }
//   console.log('[BulkSend] Hoàn tất gửi 300 tin nhắn!');
// };

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected successfully');

    // Start Express server
    app.listen(config.PORT, async () => {
      console.log(`Server is running on port ${config.PORT}`);
      console.log(`Webhook URL: /webhook`);
      console.log(`Health check: /webhook/health`);

      // Gửi 300 tin nhắn sau khi server start
      // await sendBulkMessages('e2ae7932c5672c397576');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
