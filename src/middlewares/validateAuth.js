const jsonwebtoken = require("jsonwebtoken");
const restifyErrors = require("restify-errors");
const config = require("config");
const User = require("../models/User");

module.exports = (options = { isAdmin: false }) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = await jsonwebtoken.verify(token, config.get("jwtSecret"));
    const { userId } = payload;

    req.userId = userId;
    if (options.isAdmin) {
      const user = await User.findById(userId);
      if (!user.isAdmin) {
        return next(new restifyErrors.UnauthorizedError());
      }
    }
    return next();
  } catch (e) {
    return next(new restifyErrors.UnauthorizedError());
  }
};
