const Attendance = require('./Attendance');

/**
 * Attendance Model - CRUD operations using Mongoose
 */
const attendanceModel = {
  /**
   * Create a new attendance record
   * @param {Object} attendanceData - Attendance data
   * @returns {Promise<Object>} Created attendance
   */
  async create(attendanceData) {
    const attendance = new Attendance(attendanceData);
    return await attendance.save();
  },

  /**
   * Find attendance records
   * @param {Object} query - Query filters
   * @param {Object} options - Query options (limit, skip, sort)
   * @returns {Promise<Array>} Array of attendance records
   */
  async find(query = {}, options = {}) {
    const { limit = 50, skip = 0, sort = { timestamp: -1 } } = options;
    return await Attendance.find(query)
      .populate('userId', 'zaloId displayName')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  },

  /**
   * Find attendance by ID
   * @param {string} id - Attendance MongoDB ID
   * @returns {Promise<Object|null>} Attendance object or null
   */
  async findById(id) {
    return await Attendance.findById(id);
  },

  /**
   * Get today's attendance for a user
   * @param {string} userId - User MongoDB ID
   * @returns {Promise<Array>} Array of today's attendance
   */
  async getTodayAttendance(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Attendance.find({
      userId,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: -1 });
  },

  /**
   * Get attendance statistics for a user
   * @param {string} userId - User MongoDB ID
   * @param {Object} dateRange - Date range filter
   * @returns {Promise<Array>} Array of statistics
   */
  async getStats(userId, dateRange = {}) {
    const match = userId ? { userId } : {};

    if (dateRange.startDate || dateRange.endDate) {
      match.timestamp = {};
      if (dateRange.startDate) {
        match.timestamp.$gte = new Date(dateRange.startDate);
      }
      if (dateRange.endDate) {
        match.timestamp.$lte = new Date(dateRange.endDate);
      }
    }

    return await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            userId: '$userId',
            type: '$type',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 },
          firstTime: { $min: '$timestamp' },
          lastTime: { $max: '$timestamp' }
        }
      },
      { $sort: { '_id.date': -1, '_id.type': 1 } }
    ]);
  },

  /**
   * Get all attendance for a date range
   * @param {Object} dateRange - Date range with startDate and endDate
   * @returns {Promise<Array>} Array of attendance records
   */
  async getByDateRange(dateRange) {
    const query = {};
    if (dateRange.startDate || dateRange.endDate) {
      query.timestamp = {};
      if (dateRange.startDate) {
        query.timestamp.$gte = new Date(dateRange.startDate);
      }
      if (dateRange.endDate) {
        query.timestamp.$lte = new Date(dateRange.endDate);
      }
    }
    return await Attendance.find(query)
      .populate('userId', 'zaloId displayName')
      .sort({ timestamp: -1 });
  },

  /**
   * Delete attendance by ID
   * @param {string} id - Attendance MongoDB ID
   * @returns {Promise<Object|null>} Deleted attendance or null
   */
  async deleteById(id) {
    return await Attendance.findByIdAndDelete(id);
  }
};

module.exports = attendanceModel;
