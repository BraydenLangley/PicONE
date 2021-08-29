var express = require('express');
var cache = require('../cache.js');
var games = cache.games;
var users = cache.users;
var functions = require('../functions.js');
var response = functions.response;
//from https://stackoverflow.com/a/6832105
var fs = require('fs');

module.exports = function (game) {
    game.get('/:id/start', (req, res) => {
        var gameId = req.params.id;
        //the below is for question mark parameters
        username = req.query.username;
        //the below is for in url
        //username = req.params.username;

        //check if valid game id
        if (games.has(gameId)) {
            //get game object
            var gameObj = games.get(gameId);
            //check if user is game admin
            if (gameObj.admin == username) {
                //check game hasn't started
                if (gameObj.isStart == false) {
                    //set that the game has started
                    gameObj.isStart = true;
                    //pick random first drawer
                    var userIndex = Math.floor(Math.random() * gameObj.users.length);
                    //set the index for the object
                    gameObj.currentDrawer = userIndex;
                    //delete the current game object
                    games.del(gameId);
                    //set the new game object
                    games.set(gameId, gameObj);
                    response(res, 200, null, "success");
                }
                else {
                    response(res, 400, "game has already started", null);
                }
            }
            else {
                response(res, 400, "user not admin", null);
            }
        }
        else {
            response(res, 400, "invalid game id", null);
        }
    });

    game.get('/:id/hasStarted', (req, res) => {
        var gameId = req.params.id;
        //check if valid game id
        if (games.has(gameId)) {
            //check if the game has started
            if (games.get(gameId).isStart) {
                response(res, 200, null, true);
            }
            else {
                response(res, 200, null, false);
            }
        }
        else {
            response(res, 400, "game doesn't exist", null);
        }
    });

    game.get('/:id/players', (req, res) => {
        var gameId = req.params.id;
        if (games.has(gameId)) {
            var gameObj = games.get(gameId);
            response(res, 200, null, {
                count: gameObj.users.length,
                users: gameObj.users
            })
        }
        else {
            response(res, 400, "game doesn't exist", null);
        }
    });

    game.get('/:id/startDrawing', (req, res) => {
        var gameId = req.params.id;
        if (games.has(gameId)) {
            var gameObj = games.get(gameId);
            gameObj.isDrawing = true;
            games.del(gameId);
            games.set(gameId, gameObj);
            response(res, 200, null, "success");
        }
        else {
            response(res, 400, "game doesn't exist", null);
        }
    });

    game.get('/:id/hasStartedDrawing', (req, res) => {
        var gameId = req.params.id;
        if (games.has(gameId)) {
            response(res, 200, null, games.get(gameId).isDrawing);
        }
        else {
            response(res, 400, "game doesn't exist", null);
        }
    });

    game.get('/:id/startNextRound', (req, res) => {
        var gameId = req.params.id;
        if (games.has(gameId)) {
            var gameObj = games.get(gameId);
            gameObj.nextRound = true;
            games.del(gameId);
            games.set(gameId, gameObj);
            response(res, 200, null, "success");
        }
        else {
            response(res, 400, "game doesn't exist", null);
        }
    });

    game.get('/:id/hasNextRoundStarted', (req, res) => {
        var gameId = req.params.id;
        if (games.has(gameId)) {
            response(res, 200, null, games.get(gameId).nextRound);
        }
        else {
            response(res, 400, "game doesn't exist", null);
        }
    });
}
