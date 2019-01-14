const User = require('../models/User');

module.exports = async (req, res, next) => {
  const { userId } = req;

  const user = await User.findById(userId);

  const propsToSend = [
    'email',
  ];

  const payload = {};

  propsToSend.forEach((prop) => {
    payload[prop] = user[prop];
  });

  res.send(payload);

  return next();
};
