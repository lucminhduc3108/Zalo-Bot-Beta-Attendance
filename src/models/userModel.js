const User = require('./User');

/**
 * User Model - CRUD operations using Mongoose
 */
const userModel = {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  },

  /**
   * Find user by Zalo ID
   * @param {string} zaloId - Zalo user ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findByZaloId(zaloId) {
    return await User.findOne({ zaloId });
  },

  /**
   * Find user by ID
   * @param {string} id - User MongoDB ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id) {
    return await User.findById(id);
  },

  /**
   * Find all users
   * @param {Object} query - Query filters
   * @returns {Promise<Array>} Array of users
   */
  async findAll(query = {}) {
    return await User.find(query).sort({ createdAt: -1 });
  },

  /**
   * Update user by Zalo ID
   * @param {string} zaloId - Zalo user ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateByZaloId(zaloId, updateData) {
    return await User.findOneAndUpdate(
      { zaloId },
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
  },

  /**
   * Delete user by Zalo ID
   * @param {string} zaloId - Zalo user ID
   * @returns {Promise<Object|null>} Deleted user or null
   */
  async deleteByZaloId(zaloId) {
    return await User.findOneAndDelete({ zaloId });
  },

  /**
   * Check if user exists by Zalo ID
   * @param {string} zaloId - Zalo user ID
   * @returns {Promise<boolean>} True if exists
   */
  async existsByZaloId(zaloId) {
    const user = await User.findOne({ zaloId }).select('_id');
    return !!user;
  }
};

module.exports = userModel;
