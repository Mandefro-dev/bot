require("dotenv").config();

module.exports = {
  telegramToken: process.env.TELEGRAM_TOKEN, // Fix the typo here
  adminId: process.env.ADMIN_ID,
};
