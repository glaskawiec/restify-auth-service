const restifyErrors = require('restify-errors');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { password, verifyPassword, token } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (user) {
      if (password === verifyPassword) {
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      } else {
        res.send(new restifyErrors.BadRequestError('Passwords do not match.'));
      }
    } else {
      res.send(new restifyErrors.UnprocessableEntityError('Password reset token is invalid or has expired.'));
    }

    res.send({
      code: 'OK',
      message: 'Password reset success.',
    });
  } catch (err) {
    res.send(new restifyErrors.UnprocessableEntityError(err));
  }
  return next();
};
