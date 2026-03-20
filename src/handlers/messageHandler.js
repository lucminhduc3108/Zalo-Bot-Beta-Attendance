const userModel = require('../models/userModel');
const attendanceModel = require('../models/attendanceModel');
const zaloService = require('../services/zaloService');

/**
 * Message Handler - Xử lý tin nhắn từ Zalo
 */
const messageHandler = {
  /**
   * Auto register user if not exists
   * @param {string} zaloId - Zalo user ID
   * @param {string} displayName - User's display name
   * @returns {Promise<Object>} User object
   */
  async autoRegisterUser(zaloId, displayName = '') {
    let user = await userModel.findByZaloId(zaloId);

    if (!user) {
      user = await userModel.create({
        zaloId,
        displayName
      });
      console.log(`New user registered: ${zaloId} - ${displayName}`);
    }

    return user;
  },

  /**
   * Handle check-in request
   * @param {Object} user - User object
   * @param {string} chatId - Chat ID for response
   * @returns {Promise<string>} Response message
   */
  async handleCheckin(user, chatId) {
    const todayAttendance = await attendanceModel.getTodayAttendance(user._id);

    // Check if already checked in today
    const hasCheckin = todayAttendance.some(a => a.type === 'checkin');
    if (hasCheckin) {
      const existingCheckin = todayAttendance.find(a => a.type === 'checkin');
      const time = new Date(existingCheckin.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh'
      });
      const message = `Bạn đã check-in hôm nay lúc ${time} rồi!`;
      await zaloService.sendMessage(chatId, message);
      return message;
    }

    // Create check-in record
    await attendanceModel.create({
      userId: user._id,
      type: 'checkin',
      timestamp: new Date()
    });

    const now = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    });

    const message = `✅ Check-in thành công!\n\n👤 Xin chào ${user.displayName || 'bạn'}!\n⏰ Thời gian: ${now}\n📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}`;

    await zaloService.sendMessage(chatId, message);
    return message;
  },

  /**
   * Handle check-out request
   * @param {Object} user - User object
   * @param {string} chatId - Chat ID for response
   * @returns {Promise<string>} Response message
   */
  async handleCheckout(user, chatId) {
    const todayAttendance = await attendanceModel.getTodayAttendance(user._id);

    // Check if has checked in today
    const hasCheckin = todayAttendance.some(a => a.type === 'checkin');
    if (!hasCheckin) {
      const message = 'Bạn chưa check-in hôm nay! Vui lòng check-in trước.';
      await zaloService.sendMessage(chatId, message);
      return message;
    }

    // Check if already checked out
    const hasCheckout = todayAttendance.some(a => a.type === 'checkout');
    if (hasCheckout) {
      const message = 'Bạn đã check-out hôm nay rồi!';
      await zaloService.sendMessage(chatId, message);
      return message;
    }

    // Create check-out record
    await attendanceModel.create({
      userId: user._id,
      type: 'checkout',
      timestamp: new Date()
    });

    const now = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    });

    // Calculate work duration
    const checkinRecord = todayAttendance.find(a => a.type === 'checkin');
    const checkinTime = new Date(checkinRecord.timestamp);
    const checkoutTime = new Date();
    const durationMs = checkoutTime - checkinTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    const message = `✅ Check-out thành công!\n\n👤 ${user.displayName || 'bạn'}\n⏰ Thời gian: ${now}\n📅 Ngày: ${new Date().toLocaleDateString('vi-VN')}\n⏱️ Thời gian làm việc: ${hours}h ${minutes}p`;

    await zaloService.sendMessage(chatId, message);
    return message;
  },

  /**
   * Get today's attendance summary for a user
   * @param {Object} user - User object
   * @param {string} chatId - Chat ID for response
   * @returns {Promise<string>} Response message
   */
  async handleGetStatus(user, chatId) {
    const todayAttendance = await attendanceModel.getTodayAttendance(user._id);

    const checkin = todayAttendance.find(a => a.type === 'checkin');
    const checkout = todayAttendance.find(a => a.type === 'checkout');

    let message = `📊 Tình trạng hôm nay (${new Date().toLocaleDateString('vi-VN')})\n\n`;
    message += `👤 ${user.displayName || 'bạn'}\n`;

    if (checkin) {
      const checkinTime = new Date(checkin.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      message += `✅ Check-in: ${checkinTime}\n`;
    } else {
      message += `❌ Chưa check-in\n`;
    }

    if (checkout) {
      const checkoutTime = new Date(checkout.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      message += `✅ Check-out: ${checkoutTime}\n`;
    } else {
      message += `❌ Chưa check-out\n`;
    }

    await zaloService.sendMessage(chatId, message);
    return message;
  },

  /**
   * Handle help command
   * @param {string} chatId - Chat ID for response
   * @returns {Promise<string>} Response message
   */
  async handleHelp(chatId) {
    const message = `📖 Hướng dẫn sử dụng Bot Chấm công\n\n`
      + `Các lệnh có thể sử dụng:\n`
      + `• "checkin" hoặc "vào" - Check-in\n`
      + `• "checkout" hoặc "ra" - Check-out\n`
      + `• "status" hoặc "trạng thái" - Xem tình trạng hôm nay\n`
      + `• "help" hoặc "giúp" - Xem hướng dẫn\n\n`
      + `Chúc bạn làm việc hiệu quả! 💪`;

    await zaloService.sendMessage(chatId, message);
    return message;
  },

  /**
   * Main handler for incoming messages
   * @param {Object} messageData - Message data from Zalo webhook
   * @returns {Promise<string>} Response message
   */
  async handleMessage(messageData) {
    const { from, chat, text } = messageData;
    const zaloId = from?.id;
    const chatId = chat?.id || from?.id;
    const messageText = (text || '').toLowerCase().trim();

    if (!zaloId) {
      console.error('No zaloId found in message');
      return 'Không thể xác định người dùng';
    }

    // Auto register user
    const displayName = from?.displayName || '';
    const user = await this.autoRegisterUser(zaloId, displayName);

    // Process commands
    if (messageText === 'checkin' || messageText === 'vào') {
      return await this.handleCheckin(user, chatId);
    }

    if (messageText === 'checkout' || messageText === 'ra') {
      return await this.handleCheckout(user, chatId);
    }

    if (messageText === 'status' || messageText === 'trạng thái') {
      return await this.handleGetStatus(user, chatId);
    }

    if (messageText === 'help' || messageText === 'giúp' || messageText === '?') {
      return await this.handleHelp(chatId);
    }

    // Default response
    const welcomeMessage = `👋 Xin chào ${user.displayName || 'bạn'}!\n\n`
      + `Chào mừng bạn đến với hệ thống chấm công Zalo Bot.\n`
      + `Gửi "help" để xem các lệnh có thể sử dụng.`;


    await zaloService.sendMessage(chatId, welcomeMessage);
    return welcomeMessage;
  }
};

module.exports = messageHandler;
