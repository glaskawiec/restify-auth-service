const restifyErrors = require('restify-errors');
const User = require('../models/User');
const Token = require('../models/Token');

module.exports = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    const dataBaseToken = await Token.findOne({ token });

    if (!dataBaseToken) {
      return next(new restifyErrors.UnauthorizedError("Provided token not valid."));
    }

    const user = await User.findOne({
      _id: dataBaseToken._userId,
      email
    });

    if (!user) {
      return next(new restifyErrors.UnauthorizedError("Unable to find a user for this token."));
    }

    if (user.isVerified) {
      return next(new restifyErrors.BadRequestError("User already verified."));
    }

    user.isVerified = true;
    await user.save();

    res.send({
      code: 'Verifyed',
      message: 'User was successfully verifyed.',
    });

  } catch (error) {
    return next(new restifyErrors.InternalError(error));
  }

  return next();
};
