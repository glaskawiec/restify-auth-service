const User = require('../models/User');
const auth = require('../modules/auth');

module.exports = async (req, res, next) => {
  const googleId = req.user.id;

  // check is user already exists
  const user = await User.findOne({ googleId });

  if (user) {
    // eslint-disable-next-line no-underscore-dangle
    const token = auth.signInUser(user._id);

    // respond with token
    res.send({ token });

    return next();
  }

  const newUser = new User({
    googleId,
    displayName: req.user.displayName,
    isAdmin: false,
  });

  const savedUser = await newUser.save();

  // eslint-disable-next-line no-underscore-dangle
  const token = auth.signInUser(savedUser._id);

  // respond with token
  res.send({ token });

  return next();
};
