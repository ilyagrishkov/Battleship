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

    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message);
    });

    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(++initialized);
    }
});

server.listen(port);
