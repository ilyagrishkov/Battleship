var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");
var gameStatus = require("./statTracker");

var port = 3000;
var app = express();

var websockets = [];

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("splash.ejs", {
        gamesInitialized: gameStatus.gamesInitialized,
        gamesAborted: gameStatus.gamesAborted,
        gamesCompleted: gameStatus.gamesCompleted
    });
});

var server = http.createServer(app);

const wss = new websocket.Server({
    server
});

var currentGame = new Game(gameStatus.gamesInitialized);
var connectionID = 0;


wss.on("connection", function (ws) {

    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    ws.send(currentGame.id);
    console.log("[STATUS] Player %s of a type %s is connected to the room %s", con.id, playerType, currentGame.id);

    var player = websockets[con.id];

    if (currentGame.hasTwoConnectedPlayers()) {

        player.playerA.send("2 JOINT");
        player.playerB.send("2 JOINT");

        currentGame = new Game(gameStatus.gamesInitialized++);
    } else {

        player.playerA.send("1 JOINT");
    }

    con.on("message", function incoming(message) {

        if (message == "Ready") {
            let gameObj = websockets[con.id];
            let isPlayerA = (gameObj.playerA == con) ? true : false;
            if (isPlayerA) {

                gameObj.addReady();
                console.log("[LOG] %s", gameObj.gameState);

            } else {
                gameObj.addReady();
                console.log("[LOG] %s", gameObj.gameState);

            }

            if (gameObj.bothPlayersReady()) {
                gameObj.playerA.send("yourTurn");
                gameObj.playerB.send("endTurn");
            }
        } else {

            let gameObj = websockets[con.id];
            let isPlayerA = (gameObj.playerA == con) ? true : false;

            if (isPlayerA) {

                console.log("[LOG] Player A sent message: %s", message);


                if (gameObj.hasTwoConnectedPlayers() || gameObj.bothPlayersReady()) {
                    gameObj.playerB.send(message);
                }

            } else {

                console.log("[LOG] Player B sent message: %s", message);

                gameObj.playerA.send(message);
            }
        }
    });

    con.on("close", function () {
        console.log("[STATUS] Player %s in room %s is disconnected", playerType, websockets[con.id].id);


        var message = "otherPlayerDisconnected";
        let gameObj = websockets[con.id];
        let isPlayerA = (gameObj.playerA == con) ? true : false;

        if (gameObj.hasTwoConnectedPlayers() || gameObj.gameState == "1 READY" || gameObj.bothPlayersReady()) {



            if (isPlayerA) {

                if (gameObj.playerB != null) {

                    gameObj.playerB.send(message);
                }
                gameObj.playerA = null;
                gameStatus.gamesAborted++;
                connectionID--;

            } else {


                if (gameObj.playerA != null) {
                    gameObj.playerA.send(message);
                }
                gameObj.playerB = null;
                connectionID--;
            }
        } else {
            currentGame = new Game(initialized);
            connectionID--;
        }
    });
});

server.listen(port);
