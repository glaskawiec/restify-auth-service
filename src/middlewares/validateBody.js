const Joi = require('joi');
const restifyErrors = require('restify-errors');

module.exports = schema => (req, res, next) => {
  if (!req.body) {
    return next(new restifyErrors.BadRequestError('Missing body.'));
  }

  Joi.validate(req.body, schema, (err, value) => {
    if (err) {
      const errors = err.details[0].message;
      return next(new restifyErrors.BadRequestError(errors));
    }

    req.value = value;
    return next();
  });
  return next();
};
