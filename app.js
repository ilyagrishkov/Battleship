var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");

var port = 3000;
var app = express();

var initialized = 1;
var websockets = {};

app.use(express.static(__dirname + "/public"));

var server = http.createServer(app);

const wss = new websocket.Server({
    server
});

var currentGame = new Game(initialized);
var connectionID = 0;

wss.on("connection", function (ws) {

    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    ws.send(currentGame.id);
    console.log("Player %s of a type %s is connected to the room %s", con.id, playerType, currentGame.id);

    if (currentGame.hasTwoConnectedPlayers()) {

        var playerOne = websockets[con.id - 1];
        var playerTwo = websockets[con.id];
        playerOne.playerA.send("2 JOINT");
        playerTwo.playerB.send("2 JOINT");

        currentGame = new Game(++initialized);
    }

    con.on("message", function incoming(message) {

        let gameObj = websockets[con.id];
        let isPlayerA = (gameObj.playerA == con) ? true : false;

        if (isPlayerA) {

            console.log("[LOG] Player A sent message: %s", message);


            if (gameObj.hasTwoConnectedPlayers()) {
                gameObj.playerB.send(message);
            }

        } else {

            console.log("[LOG] Player B sent message: %s", message);

            gameObj.playerA.send(message);
        }
    });

    con.on("close", function () {
        console.log("[STATUS] Player %s in room %s is disconnected", playerType, websockets[con.id].id);
    });
});

server.listen(port);
