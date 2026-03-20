require('dotenv').config();
const axios = require('axios');

const ZALO_API_BASE = () => `https://bot-api.zaloplatforms.com/bot${process.env.ZALO_BOT_TOKEN}/`;

/**
 * Zalo Bot API Service
 */
const zaloService = {
  /**
   * Send a message to a user
   * @param {string} chatId - User's chat ID
   * @param {string} text - Message text
   * @returns {Promise<Object>} API response
   */
  async sendMessage(chatId, text) {
    try {
      const response = await axios.post(
        `${ZALO_API_BASE()}sendMessage`,
        {
          chat_id: chatId,
          text: text
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Set webhook URL for the bot
   * @param {string} url - Webhook URL
   * @param {string} secretToken - Secret token for verification
   * @returns {Promise<Object>} API response
   */
  async setWebhook(url, secretToken) {
    try {
      const response = await axios.post(
        `${ZALO_API_BASE()}setWebhook`,
        {
          url: url,
          secret_token: secretToken
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting webhook:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get webhook information
   * @returns {Promise<Object>} API response with webhook info
   */
  async getWebhookInfo() {
    try {
      const response = await axios.get(
        `${ZALO_API_BASE()}webhook`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting webhook info:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete webhook
   * @returns {Promise<Object>} API response
   */
  async deleteWebhook() {
    try {
      const response = await axios.delete(
        `${ZALO_API_BASE()}webhook`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting webhook:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get user profile information
   * @param {string} userId - Zalo user ID
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(userId) {
    try {
      const response = await axios.get(
        `${ZALO_API_BASE()}user/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error.response?.data || error.message);
      throw error;
    }
  }
};

module.exports = zaloService;
