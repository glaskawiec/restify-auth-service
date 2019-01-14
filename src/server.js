const bunyan = require('bunyan');
const restify = require('restify');
const config = require('config');

const restifyCorsMiddleware = require('restify-cors-middleware');
const initializeMongoose = require('./modules/initializeMongoose');
const initializeSwagger = require('./modules/initializeSwagger');
const initializePassport = require('./modules/initializePassport');
const initializeRoutes = require('./routes/initializeRoutes');

const webAppOrigin = config.get('webAppOrigin');
const port = config.get('port');
const errorLogFilePath = config.get('errorLogFilePath');

const server = restify.createServer();

// configure logger
server.on('after', restify.plugins.auditLogger({
  log: bunyan.createLogger({
    name: 'audit',
    src: true,
    serializers: {
      err: bunyan.stdSerializers.err,
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
    },
    streams: [
      {
        stream: process.stderr,
        level: 'debug',
      },
      {
        level: 'info',
        path: `${__dirname}/..${errorLogFilePath}/info.log`, // log ERROR and above to a file
      },
      {
        level: 'error',
        path: `${__dirname}/..${errorLogFilePath}/error.log`, // log ERROR and above to a file
      },
    ],
  }),
  event: 'after',
  printLog: true,
}));


// configure cors
const cors = restifyCorsMiddleware({
  origins: [webAppOrigin],
});

// configure middleware
server.pre(cors.preflight);
server.use(cors.actual);
server.pre(restify.plugins.jsonBodyParser({ mapParams: true }));
server.pre(restify.plugins.acceptParser(server.acceptable));
server.pre(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.gzipResponse());
server.pre(restify.plugins.fullResponse());
server.use(restify.plugins.requestLogger());

// configure passport
initializePassport(server);

// configure routes
initializeRoutes(server);

// configure swagger
initializeSwagger(server);

// configure mongoose
initializeMongoose();

server.listen(port, () => {
  console.log(`${server.name} listening at ${server.url}`);
});

module.exports = server;
