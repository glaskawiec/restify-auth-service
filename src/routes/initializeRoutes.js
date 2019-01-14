const v1 = require('./v1');

const ver = 'v1';

module.exports = (server) => {
  v1(server, ver);
};
