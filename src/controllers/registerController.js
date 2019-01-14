const restifyErrors = require('restify-errors');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const smtpTransport = require('../modules/smtpTransport');

module.exports = async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    const userToCreate = { email, password, displayName };

    const user = await User.findOne({ email });

    if (user) {
      return next(new restifyErrors.ConflictError('User Already Exists'));
    }

    // save user
    const savedUser = await new User(userToCreate).save();

    // Create a verification token for this user
    const tokenToSave = {
      _userId: savedUser._id,
      token: crypto.randomBytes(16).toString('hex')
    }

    const token = await new Token(tokenToSave).save();

    //send verification token email
    await smtpTransport.sendVerificationTokenEmail(email, token.token);

    res.status(201);
    res.send({
      code: 'Created',
      message: 'User was successfully created. Verification token has been sent to email.',
    });
  } catch (e) {
    console.log(e);
    return next(new restifyErrors.InternalError());
  }
  return next();
};
