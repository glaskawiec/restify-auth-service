const restifyErrors = require('restify-errors');
const crypto = require('crypto');
const User = require('../models/User');
const smtpTransport = require('../modules/smtpTransport');
const Token = require('../models/Token');

module.exports = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new restifyErrors.UnauthorizedError('We were unable to find a user with that email.'));
    }

    if (user.isVerified) {
      return next(new restifyErrors.UnauthorizedError('This account has already been verified. Please log in.'));
    }

    const tokenToSave = {
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    };

    const token = await new Token(tokenToSave).save();

    await smtpTransport.sendVerificationTokenEmail(user.email, token.token);

    res.status(200);
    res.send({
      code: 'OK',
      message: 'Verification token was resend successfully',
    });

  } catch (error) {
    return next(new restifyErrors.InternalError(error));
  }

  return next();
};
