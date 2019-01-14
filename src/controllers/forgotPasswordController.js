const restifyErrors = require('restify-errors');
const crypto = require('crypto');
const config = require('config');
const User = require('../models/User');
const { sendResetPasswordTokenEmail } = require('../modules/smtpTransport');

module.exports = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new restifyErrors.NotFoundError('User with provided email not found.'));
    }

    const buffer = await crypto.randomBytes(20);
    const token = await buffer.toString('hex');

    // eslint-disable-next-line no-underscore-dangle
    await User.findOneAndUpdate({ _id: user._id },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 86400000,
        isAdmin: true,
      },
      {
        upsert: true,
        new: true,
      });

    await sendResetPasswordTokenEmail(email, token);

    res.send({
      code: 'OK',
      message: `User password reset token was sent to ${email}`,
    });
    return next();
  } catch (err) {
    return next(new restifyErrors.InternalServerError());
  }
};
