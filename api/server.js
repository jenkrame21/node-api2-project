// implement your server here
// require your posts router and connect it here
const express = require('express');
const server = express();
const postRouter = require('./posts/posts-router');

server.use(express.json());
server.use('/api/posts', postRouter);

// CATCH-ALL
server.use('*', (req, res) => {
    res.status(404).json({ 
        message: "404 NOT FOUND"
    });
});

module.exports = server;
