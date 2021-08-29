var express = require('express');
var game = express.Router();
var cache = require('../cache.js');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
var games = cache.games;
var users = cache.users;
var guessLists = cache.guessLists;
var scoring = cache.scoring;
// source: https://xomino.com/2015/04/28/how-to-add-a-node-js-express-route-in-a-separate-file/
var gameSetup = require('./gameSetup.js')(game);
var gameStat = require('./gameStat.js')(game);
var functions = require('../functions.js');
var response = functions.response;
//var fs = require('fs');
//var items = fs.readFileSync('words.txt').toString().split('\r\n');

game.get('/:id/draw/item', (req, res) => {
    var gameId = req.params.id;
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;

    //check if valid game id
    if (games.has(gameId) && games.get(gameId).isStart) {
        //set item to null for default
        var itemToDraw = null;
        //check if a round is currently underway
        if (games.get(gameId).inGame == false) {
            //take the current game object
            var gameObj = games.take(gameId);
            //get random item index
            var index = Math.floor(Math.random() * gameObj.items.length);
            //get the current item
            var currItem = gameObj.items[index];
            gameObj.inGame = true;

            //remove the current item from the array
            gameObj.items.splice(index, 1);
            //set the current item
            gameObj.currentItem = currItem;
            //set the game object in cache
            games.set(gameId, gameObj);
        }
        //get the current game
        var gameObj = games.get(gameId);
        //check if user is current drawer
        if (gameObj.users[gameObj.currentDrawer] == username) {
            //set item to the current item
            itemToDraw = gameObj.currentItem;
        }

        response(res, 200, null, itemToDraw);
    }
    else {
        response(res, 400, "invalid game id", null);
    }
});

game.get('/:id/draw/expire', (req, res) => {
    var gameId = req.params.id;
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;

    //check if valid game id
    if (games.has(gameId) && games.get(gameId).isStart) {
        //check if expire has been set
        if (games.get(gameId).expire == null) {
            //take the current game object
            var gameObj = games.take(gameId);

            //get current date
            var expire = new Date();
            //set expire as current date in seconds plus one minute
            expire = expire.setSeconds(expire.getSeconds() + 60);
            //set the expire in the game object
            gameObj.expire = expire;

            //set the game object in cache
            games.set(gameId, gameObj);
        }
        //get the current game
        var gameObj = games.get(gameId);

        var expire = null;
        expire = gameObj.expire;

        response(res, 200, null, expire);
    }
    else {
        response(res, 400, "invalid game id", null);
    }
});

game.get('/:id/draw/new', (req, res) => {
    var gameId = req.params.id;
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;

    //check if valid game id
    if (games.has(gameId) && games.get(gameId).isStart) {
        //check if user is admin
        if (games.get(gameId).admin == username) {
            //take the current game object
            var gameObj = games.take(gameId);

            for (var i = 0; i < gameObj.users.length; i++) {
                lock.acquire(gameObj.users[i], function (done) {
                    //take the current user
                    var user = users.take(gameObj.users[i]);
                    //set all required fields to null
                    user.guess = null;
                    user.guessList = null;
                    user.choice = null;
                    //set the user back in the cache
                    users.set(gameObj.users[i], user);
                    done();
                }, function (err, ret) {
                    //lock released
                });
            }

            gameObj.currentItem = null;
            gameObj.scored = false;
            gameObj.currentDrawer = (gameObj.currentDrawer + 1) % gameObj.users.length;
            gameObj.inGame = false;
            gameObj.isDrawing = false;
            gameObj.nextRound = false;
            gameObj.expire = null;

            //set the game object in cache
            games.set(gameId, gameObj);
        }

        response(res, 200, null, "success");
    }
    else {
        response(res, 400, "invalid game id", null);
    }
});

game.get('/:id/guess', (req, res) => {
    var gameId = req.params.id;
    var guess = req.query.guess;
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;
    if (games.has(gameId) && games.get(gameId).isStart) {
        if (users.has(username)) {
            if (games.get(gameId).users[games.get(gameId).currentDrawer] == username) {
                response(res, 400, "drawer cannot guess", null);
                return;
            }
            //take the users object
            var userObj = users.take(username);
            //set the guess for the user
            userObj.guess = guess;
            //add the current guess to the list of guesses
            userObj.guessList.push(guess);
            //store the user object in the user cache
            users.set(username, userObj);

            response(res, 200, null, "success");
        }
        else {
            response(res, 400, "username not valid", null);
        }
    }
    else {
        response(res, 400, "game id not valid or game hasn't started", null);
    }
});

game.get('/:id/guess/final', (req, res) => {
    var gameId = req.params.id;
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;

    //check if valid game id and if game has started
    if (games.has(gameId) && games.get(gameId).isStart) {
        //get the game object
        var gameObj = games.get(gameId);
        //check if the guess list has already been generated
        //if not then generate
        if (!guessLists.has(gameId)) {
            //lock on the game id
            //source: https://www.npmjs.com/package/async-lock
            lock.acquire(toString(gameId), function (done) {
                //check if the guess list has already been generated
                //if not then generate
                if (!guessLists.has(gameId)) {
                    //create a empty full list
                    var fullList = [];
                    //loop over the game's users
                    for (var i = 0; i < gameObj.users.length; i++) {
                        //get the current user
                        var user = gameObj.users[i];
                        //get the users guess list
                        var userGuessList = users.get(user).guessList;
                        //concat the users guess list on the full list
                        fullList = fullList.concat(userGuessList);
                    }
                    //return only unique guesses
                    //source: https://stackoverflow.com/a/33121880
                    var uniqueList = Array.from(new Set(fullList));
                    for (var i = 0; i < uniqueList.length; i++) {
                        uniqueList[i] = uniqueList[i].toLowerCase();
                    }
                    //set the game's guess list in the guessLists cache
                    guessLists.set(gameId, uniqueList);
                }
                done();
            }, function (err, ret) {
                //lock released
            });
        }
        //return the game's guessList
        response(res, 200, null, guessLists.get(gameId));
    }
    else {
        response(res, 400, "invalid game id or game hasn't started yet", null);
    }
});

game.get('/:id/guess/choice', (req, res) => {
    //the below is for question mark parameters
    username = req.query.username;
    //the below is for in url
    //username = req.params.username;
    var choice = req.query.choice;

    if (users.has(username)) {
        var userObj = users.take(username);
        userObj.choice = choice;
        users.set(username, userObj);
        response(res, 200, null, "success")
    }
    else {
        response(res, 400, "invalid username", null);
    }
});

game.get('/:id/answer/correct', (req, res) => {
    var gameId = req.params.id;
    if (games.has(gameId)) {
        response(res, 200, null, games.get(gameId).currentItem);
    }
    else {
        response(res, 400, "invalid game id", null);
    }
});

game.get('/:id/answer/score', (req, res) => {
    var gameId = req.params.id;
    //check if valid game
    if (games.has(gameId)) {
        //check if scoring has been done already
        if (games.get(gameId).scored == false) {
            //acquire a lock for the game
            lock.acquire(toString(gameId), function (done) {
                //check if scoring has been done already
                if (games.get(gameId).scored == false) {
                    //get the game object
                    var gameObj = games.get(gameId);
                    //loop through the users
                    for (var i = 0; i < gameObj.users.length; i++) {
                        //get the current user
                        var user = gameObj.users[i];
                        //check if correct answer
                        if (users.get(user).choice == gameObj.currentItem.toLowerCase()) {
                            var userObj = users.take(user);
                            //add one to the users score
                            userObj.score += 1;
                            users.set(user, userObj);
                        }
                    }
                    //set scored to true
                    gameObj.scored = true;
                    games.del(gameId);
                    games.set(gameId, gameObj);

                    //create score array
                    var score = [];
                    //loop through all users
                    for (var i = 0; i < gameObj.users.length; i++) {
                        var userObj = users.get(gameObj.users[i]);
                        var user = {
                            "username": gameObj.users[i],
                            "score": userObj.score,
                            "choice": userObj.choice
                        };
                        score = score.concat(user);
                    }
                    scoring.set(gameId, score);
                }
                done();
            }, function (err, ret) {
            });
        }
        response(res, 200, null, scoring.get(gameId));
    }
    else {
        response(res, 400, "invalid game id", null);
    }
});

module.exports = game;