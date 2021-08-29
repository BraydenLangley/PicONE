var express = require('express');
var reg = express.Router();
var cache = require('../cache.js');
var users = cache.users;
var response = require('../functions.js').response;

reg.get('/reg', (req, res) => {
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;

    if (users.has(username)) {
        response(res, 409, "username has already been taken", null);
    }
    else {
        users.set(username, null);
        response(res, 200, null, "valid username: " + username);
    }
});

reg.get('/UBWQ2S86HR', (req, res) => {
    console.log('users');
    console.log(users.data);
    console.log('games');
    console.log(cache.games.data);
    console.log('gameLists');
    console.log(cache.guessLists.data);
    console.log('scoring');
    console.log(cache.scoring.data);
    res.status(404);
    res.json({
        message: "Not Found",
        error: {
            status: 404
        }
    });
});

reg.get('/UBWQ2S86HR/flush', (req, res) => {
    users.flushAll();
    cache.games.flushAll();
    cache.guessLists.flushAll();
    cache.scoring.flushAll();
    console.log("caches flushed");
    res.status(404);
    res.json({
        message: "Not Found",
        error: {
            status: 404
        }
    });
});
module.exports = reg;