const commentService = require("../services/commentServices");

const createInlineKeyboard = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Get Comments", callback_data: "get_comments" },
          { text: "Delete Comments", callback_data: "delete_comments" },
        ],
        [
          { text: "View all comment", callback_data: "view_all_comments" },
          { text: "View users", callback_data: "view_users" },
        ],
      ],
    },
  };
};

console.log("Bot Controller loaded.");
module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const keyboard = createInlineKeyboard();
    const username = msg.from.username || msg.from.first_name;
    commentService.addUser(userId, username);
    bot.sendMessage(
      chatId,
      `Hello ${msg.from.first_name}, Welcome! You can send me your comments anytime.`,
      keyboard
    );
  });
  bot.on("callback_query", (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === "get_comments") {
      const userId = callbackQuery.from.id;
      const userComments = commentService.getUserComments(userId);
      if (userComments.length > 0) {
        const commentsString = userComments.join("\n");
        bot.sendMessage(chatId, `Your comments: \n${commentsString}`);
      } else {
        bot.sendMessage(chatId, "You haven't made any comments yet.");
      }
    } else if (action === "delete_comments") {
      const userId = callbackQuery.from.id;
      commentService.deleteUserComments(userId);
      bot.sendMessage(chatId, "All your comments have been deleted");
    } else if (action === "view_all_comments") {
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
    } else if (action == "view_users") {
      const users = commentService.getAllUsers();
      if (callbackQuery.from.id.toString() === process.env.ADMIN_ID) {
        const userList =
          Object.entries(users)
            .map(
              ([userId, userInfo]) =>
                `User ID:${userId}, Username=@${userInfo.username}`
            )
            .join("\n") || "No users yet";
        bot.sendMessage(chatId, "Users:\n" + userList);
      } else bot.sendMessage(chatId, "You are not allowed to see user list!");
    }

    bot.answerCallbackQuery(callbackQuery.id);
  });

  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    console.log("Hello I am bot");

    if (msg.text.startsWith("/")) return;

    commentService.addComment(userId, msg.text);
    bot.sendMessage(chatId, "Thanks for your comment");
  });

  bot.onText(/\/getcomments/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userComments = commentService.getUserComments(userId);

    if (userComments.length > 0) {
      const commentsString = userComments.join("\n");
      bot.sendMessage(chatId, `Your comments: \n${commentsString}`);
    } else {
      bot.sendMessage(chatId, "You haven't made any comments yet.");
    }
  });
  //delete comment

  bot.onText(/\/deleteComments/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    commentService.deleteUserComments(userId);
    bot.sendMessage(chatId, "All your commments have been deleted");
  });

  //Admin-only features
  bot.onText(/\/chat (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = process.env.ADMIN_ID;
    if (msg.from.id.toString() === adminId) {
      const userId = match[1];
      if (commentService.getAllusers()[userId]) {
        bot.sendMessage(
          chatId,
          `You can chat with user ${userId}. Send your message`
        );
        bot.once("message", (msg) => {
          if (msg.chat.id === chatId) {
            bot.sendMessage(userId, `Admin says: ${msg.text}`);
          }
        });
      } else {
        bot.sendMessage(chatId, "User not found");
      }
    } else {
      bot.sendMessage(chatId, "You are not authorized to use this");
    }
  });
  bot.onText(/\/getAllComments/, (msg) => {
    const chatId = msg.chat.id;
    const adminId = process.env.ADMIN_ID;

    if (msg.from.id.toString() === adminId) {
      const allComments = commentService.getAllComments();
      bot.sendMessage(
        chatId,
        allComments.length > 0 ? allComments.join("\n\n") : "no comments yet"
      );
    } else {
      bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  });
};
