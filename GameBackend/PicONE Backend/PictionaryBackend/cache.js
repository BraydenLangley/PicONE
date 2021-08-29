var NodeCache = require('node-cache');

var users = new NodeCache({ stdTTL: 0 });
var games = new NodeCache({ stdTTL: 0 });
var guessLists = new NodeCache({ stdTTL: 0 });
var scoring = new NodeCache({ stdTTL: 0 });

module.exports = {
    users,
    games,
    guessLists,
    scoring
};