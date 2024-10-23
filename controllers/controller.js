const commentService = require("../services/comments");

const createInlineKeyboard = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Give comment", callback_data: "give_comment" },
          { text: "Suggest New Idea", callback_data: "suggest_idea" },
        ],
        [
          { text: "Ask for Help", callback_data: "ask_help" },
          { text: "View all comments", callback_data: "View_all_comments" },
        ],
      ],
    },
  };
};
module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const keyboard = createInlineKeyboard();
    const username = msg.from.username || msg.from.first_name;
    commentService.addUser(userId, username);
    bot.sendMessage(
      chatId,
      `Hello ${msg.from.first_name}, Welcome! How can I assit you today!.`,
      keyboard
    );
  });
  //writing query
  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;
    const userId = callbackQuery.from.id;
    const username =
      callbackQuery.from.username || callbackQuery.from.first_name;

    if (action === "give_comment") {
      bot.sendMessage(chatId, "Please Type your comment here");
      bot.once("message", (msg) => {
        commentService.addComment(userId, msg.text);
        bot.sendMessage(chatId, "Thanks for your comment!");
        //notfiy to admin
        bot.sendMessage(
          process.env.ADMIN_ID,
          `New comment from @${username}: ${msg.text}`
        );
      });
    } else if (action === "suggest_idea") {
      bot.sendMessage(chatId, "Please Type your idea here");
      bot.once("message", (msg) => {
        commentService.addIdea(userId, msg.text);
        bot.sendMessage(chatId, "Thanks for your suggestion!");
        //notfiy to admin
        bot.sendMessage(
          process.env.ADMIN_ID,
          `New idea from @${username}: ${msg.text}`
        );
      });
    } else if (action === "ask_help") {
      bot.sendMessage(chatId, "please describe the help you need ");
      bot.once("message", (msg) => {
        commentService.addHelpRequest(userId, msg.text);
        bot.sendMessage(
          chatId,
          "Thanks for reaching out! The admin will review your request."
        );
        //notfiy to admin
        bot.sendMessage(
          process.env.ADMIN_ID,
          `New help request from @${username}: ${msg.text}`
        );
      });
    } else if (action === "View_all_comments") {
      const adminId = process.env.ADMIN_ID;
      if (callbackQuery.from.id.toString() === adminId) {
        const allComments = commentService.getAllComments();
        bot.sendMessage(
          chatId,
          allComments.length > 0 ? allComments.join("\n\n") : "no comments yet"
        );
      } else {
        bot.sendMessage(chatId, "You are not allowed to see all comments!");
      }
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    console.log("User message received.");
    if (msg.text.startsWith("/")) return;
    commentService.addComment(userId, msg.text);
    bot.sendMessage(
      chatId,
      "Thanks for your comment! If you need help, feel free to ask."
    );
  });
};
