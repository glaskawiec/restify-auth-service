const bcryptjs = require('bcryptjs');
const restifyErrors = require('restify-errors');
const User = require('../models/User');
const auth = require('../modules/auth');

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // get user by email from base
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new restifyErrors.NotFoundError(
          'User with provided email not found.',
        ),
      );
    }


    // check is user verified
    if (!user.isVerified) {
      return next(
        new restifyErrors.UnauthorizedError(
          'User with provided email is not verified.',
        ),
      );
    }


    // compare password
    bcryptjs.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return next(new restifyErrors.UnauthorizedError('Can not authorize.'));
      }
      if (!isMatch) {
        return next(new restifyErrors.UnauthorizedError('Wrong password.'));
      }

      // eslint-disable-next-line no-underscore-dangle
      const userId = user._id;
      const accessToken = auth.signInUser(userId);

      const responseUserData = {
        email: user.email,
        displayName: user.displayName,
      };

      // respond with token
      res.send({ accessToken, user: responseUserData });

      return next();
    });
  } catch (err) {
    // user unauthorized
    return next(new restifyErrors.UnauthorizedError('Can not authorize.'));
  }
  return next();
};
