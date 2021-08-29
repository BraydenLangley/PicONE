# Introduction 
This is the backend source code in node.js for a Pictionary like game.

# Documentation

## Libraries
Node-Cache: https://www.npmjs.com/package/node-cache
cache.has(key)
cache.set(key, val, [ ttl ] )

## Responses
### Standard Response
```javascript
{
    "status": 200,
    "error": null,
    "response": null,
}
```

The standard JSON response object will be in the above form containing three main items:
* Status: An integer which is one of the standard http status codes. You can find the standard http status codes at [this link](https://httpstatuses.com/).
* Error: Will be null most of the time but have a message if there is an error
* Response: This will be null if there is an error and a message or an object if the operation was successful

### Possible Answers Response
```javascript
[ "cat", "dog", "chicken" ]
```

This is the standard response object for possible answers. This would be the object within the response field of the Standard Response.



## Endpoints

This section covers all the endpoints that will be supported by the API. `:id` is used as a filler with in the path for the game id being used.
### /reg
This endpoint is used for registering a username.

This will return status 409 if the username is already taken.
This will return status 200 for successful username registration.

### /game/new
This endpoint is used for creating a new game.

On success this will return status 200 with the Standerd Response with the response section as the game number.

### /game/:id/join
This endpoint is used for joining a game.

On success this will return status 200 with the Standard Response with the response section with a timer expiration.
On failure this will return status 400 with the error section saying that the game id is invalid.

### /game/:id/end
This endpoint is used to end a game. This endpoint can only be used by the person that created the game.

On success this will return status 200 with the Standard Response with the response section as true.
On failure this will return status 400 with the Standard Response with the error section saying that the user can't end the game.

### /game/:id/draw
This endpoint is used to get the timer for all persons and a item to draw if they are the current drawer.

On success for the current drawer this will return a timer and a item to draw.
On success for the other people this will return only a timer.
On failure this will return status 400 with the Standard Response with the error section saying that it's a invalid game or they aren't apart of the game.

### /game/:id/guess
This endpoint is send a guess to the server.

On success this will return status 200 with the Standard Response with the response section as true.

### /game/:id/guess/final
This endpoint is used to get the possible final answers.

On success this will return the Possible Answers Response.

### /game/:id/guess/choice
This endpoint is used to send the users final choice to the server.

On success this will return status 200 with the Standard Response with the response section as true.

### /game/:id/answer
This endpoint is used to get the correct answer.

On success this will return status 200 with the Standard Response with the response section as the correct answer and a timer for when the next round starts.



## Internal Objects

### Game Objects

```javascript
{
    "admin": ,
    "users": [],
    "currentItem": 0,
    "currentDrawer":
}
```


### Score Objects

```javascript
{
    "gameId": 123456,
    "answer": ,
    "score": 1
}
```
