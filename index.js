const { telegramToken } = require("./config/config");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
require("./controllers/controller")(bot);
console.log("Tlegram bot is running");

bot.on("polling_error", (error) => console.error(error));
