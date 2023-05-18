const express = require('express');

const server = express();

const {logger} = require('./middleware/middleware')

server.use(express.json())
server.use(logger)

// global middlewares and the user's router need to be connected here

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
