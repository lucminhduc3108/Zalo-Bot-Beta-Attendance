require('dotenv').config();

module.exports = {
  ZALO_BOT_TOKEN: process.env.ZALO_BOT_TOKEN,
  ZALO_SECRET_TOKEN: process.env.ZALO_SECRET_TOKEN,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGO_URI || process.env.MONGODB_URI
};
