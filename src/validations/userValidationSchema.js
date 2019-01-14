const Joi = require('joi');

module.exports = Joi.object().keys({
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  displayName: Joi.string().min(4).max(20).required(),
  isAdmin: Joi.boolean(),
});
