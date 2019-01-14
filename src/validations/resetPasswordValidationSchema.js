const Joi = require('joi');

module.exports = Joi.object().keys({
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  verifyPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  token: Joi.string().required(),
});
