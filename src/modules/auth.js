const jsonwebtoken = require('jsonwebtoken');
const config = require('config');

module.exports = {
  signInUser: (userId) => {
    const payload = {
      userId,
    };

    const token = jsonwebtoken.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.get('jwtTokenExpiresIn') },
    );

    return token;
  },
};
