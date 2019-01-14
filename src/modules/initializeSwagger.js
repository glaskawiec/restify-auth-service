const restifySwaggerJsdoc = require('restify-swagger-jsdoc');
const config = require('config');

module.exports = (server) => {
  restifySwaggerJsdoc.createSwaggerPage({
    title: 'Restify authentication service documentation', // Page title (required)
    version: '1.0.0', // Server version (required)
    server, // Restify server instance created with restify.createServer() (required)
    path: config.get('docsPath'), // Public url where the swagger page will be available (required)
    description: 'My great app', // A short description of the application. (default: '')
    tags: [
      {
        // A list of tags used by the specification with additional metadata (default: [])
        name: 'Tag name',
        description: 'Tag description',
      },
    ],
    host: 'localhost', // The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths.
    schemes: [], // The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". (default: [])
    apis: [`${__dirname}/routes/v1/*.js`], // Path to the API docs (default: [])
    definitions: { myObject: [] }, // External definitions to add to swagger (default: [])
    routePrefix: 'v1', // prefix to add for all routes (default: '')
    forceSecure: false, // force swagger-ui to use https protocol to load JSON file (default: false)
  });
};
