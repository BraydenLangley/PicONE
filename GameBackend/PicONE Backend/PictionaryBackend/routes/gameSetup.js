var cache = require('../cache.js');
var games = cache.games;
var users = cache.users;
var functions = require('../functions.js');
var response = functions.response;
//from https://stackoverflow.com/a/6832105
var fs = require('fs');
var items = fs.readFileSync('words.txt').toString().split("\r\n");

module.exports = function (gameStart) {

    gameStart.get('/new', (req, res) => {
        //the below is for question mark parameters
        username = req.query.username;
        //the below is for in url
        //username = req.params.username;

        //check if the person already has a valid username
        if (users.has(username)) {
            //check if the person is not already apart of a game
            if (users.get(username) == null) {
                //generate a random game id
                gameId = Math.trunc(Math.random() * 1000000);
                //this loops to check if the id is already taken
                //NOTE: not the best implementation
                while (games.has(gameId)) {
                    gameId = Math.trunc(Math.random() * 1000000);
                }

                //delete old cached user
                users.del(username);

                //create the users new object
                var userObj = {
                    "gameId": gameId,
                    "score": 0,
                    "choice": null,
                    "guess": null,
                    "guessList": []
                };
                //set the users new object
                users.set(username, userObj);


                //create the game object
                var gameObj = {
                    "admin": username,
                    "users": [username],
                    "currentItem": null,
                    "currentDrawer": null,
                    "items": items,
                    "isStart": false,
                    "inGame": false,
                    "expire": null,
                    "scored": false,
                    "isDrawing": false,
                    "nextRound": false
                };
                //place the game object into cache
                games.set(gameId, gameObj);

                //send response
                response(res, 200, null, gameId);
            }
            else {
                //send response
                response(res, 400, "a user can't be apart of 2 games at the same time", null);
            }
        }
        else {
            //send response
            response(res, 400, "this username hasn't been registered yet", null);
        }
    });

    //NOTE: possible race conditions for this endpoint
    gameStart.get('/:id/join', (req, res) => {
        var gameId = req.params.id;

        //the below is for question mark parameters
        username = req.query.username;
        //the below is for in url
        //username = req.params.username;

        //check if valid game id
        if (games.has(gameId)) {
            //check if username
            if (users.has(username)) {
                //add if for get of username
                if (users.get(username) == null) {
                    //take the game object
                    gameObj = games.take(gameId);
                    //add the user to the selected game object
                    gameObj.users.push(username);
                    //set the new game object to the game id
                    games.set(gameId, gameObj);

                    //delete the current user
                    users.del(username);
                    //create the users new object
                    var userObj = {
                        "gameId": parseInt(gameId),
                        "score": 0,
                        "choice": null,
                        "guess": null,
                        "guessList": []
                    };
                    //set the users new object
                    users.set(username, userObj);

                    //send response
                    response(res, 200, null, "success");
                }
                else {
                    response(res, 400, "user can't be apart of 2 games at the same time");
                }
            }
            //invalid username 
            else {
                //send response
                response(res, 400, "not a valid username", null);
            }
        }
        //invalid game id
        else {
            //send response
            response(res, 400, "invalid game id", null);
        }
    });

    gameStart.get('/:id/end', (req, res) => {
        var gameId = req.params.id;
        //the below is for question mark parameters
        username = req.query.username;
        //the below is for in url
        //username = req.params.username;

        //check if valid game id
        if (games.has(gameId)) {
            //get the game id
            var gameObj = games.get(gameId);

            //check if the user is the admin
            if (gameObj.admin == username) {
                //delete each user apart of the game
                gameObj.users.forEach(delUser);
                //delete the game
                games.del(gameId);
                //send response
                response(res, 200, null, "game and users deleted successfuly");
            }
            else {
                //send response
                //consider change response code
                response(res, 400, null, "a non admin cannot delete a game");
            }
        }
        else {
            //send response
            response(res, 400, "not a valid game id", null);
        }
    });

}

function delUser(user) {
    users.del(user);
}
