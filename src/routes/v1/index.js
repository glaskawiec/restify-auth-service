const auth = require("./auth");
const users = require("./users");

module.exports = (server, ver) => {
  auth(server, ver);
  users(server, ver);
};
