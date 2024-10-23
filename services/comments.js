const comments = {}; // { userId: [comments] }
const ideas = {}; // { userId: [ideas] }
const helpRequests = {}; // { userId: [helpRequests] }
const users = {}; // { userId: { username: "..." } }

module.exports = {
  addUser: (userId, username) => {
    if (!users[userId]) {
      users[userId] = { username };
    }
  },

  addComment: (userId, comment) => {
    if (!comments[userId]) {
      comments[userId] = [];
    }
    comments[userId].push(comment);
  },

  getUserComments: (userId) => {
    return comments[userId] || [];
  },

  deleteUserComments: (userId) => {
    delete comments[userId];
  },

  getAllComments: () => {
    let allComments = [];
    for (const [userId, userComments] of Object.entries(comments)) {
      const username = users[userId] ? users[userId].username : "Unknown";
      allComments.push(`User: @${username} \n${userComments.join("\n")}`);
    }
    return allComments;
  },

  addIdea: (userId, idea) => {
    if (!ideas[userId]) {
      ideas[userId] = [];
    }
    ideas[userId].push(idea);
  },

  getAllIdeas: () => {
    let allIdeas = [];
    for (const [userId, userIdeas] of Object.entries(ideas)) {
      const username = users[userId] ? users[userId].username : "Unknown";
      allIdeas.push(`User: @${username} \n${userIdeas.join("\n")}`);
    }
    return allIdeas;
  },

  addHelpRequest: (userId, helpRequest) => {
    if (!helpRequests[userId]) {
      helpRequests[userId] = [];
    }
    helpRequests[userId].push(helpRequest);
  },

  getAllHelpRequests: () => {
    let allHelpRequests = [];
    for (const [userId, userHelpRequests] of Object.entries(helpRequests)) {
      const username = users[userId] ? users[userId].username : "Unknown";
      allHelpRequests.push(
        `User: @${username} \n${userHelpRequests.join("\n")}`
      );
    }
    return allHelpRequests;
  },

  getAllUsers: () => users,
};
