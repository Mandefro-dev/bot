let comments = {};
let users = {};
module.exports = {
  addUser: (userId, username) => {
    if (!users[userId]) {
      users[userId] = { username, comments: [] };
    }
  },
  //add commens
  addComment: (userId, comment) => {
    if (!comments[userId]) {
      comments[userId] = [];
    }
    comments[userId].push(comment);
  },
  getAllUsers: () => {
    return users;
  },

  //Get all comments for specfic user
  getUserComments: (userId) => {
    return comments[userId] || [];
  },
  //delte user comments
  deleteUserComments: (userId) => {
    delete comments[userId];
  },
  //Get all commnts for admin
  getAllComments: () => {
    let allComments = [];

    for (const [userId, userComments] of Object.entries(comments)) {
      // Get the username of the user from the users object, or 'Uknown' if the user is not found.  // This is for demonstration purposes, in a real-world application, you might want to handle this differently.

      const username1 = users[userId] ? users[userId].username : "Uknown";

      allComments.push(`User: @${username1} : \n${userComments.join("\n")}`);
    }
    return allComments;
  },
};
