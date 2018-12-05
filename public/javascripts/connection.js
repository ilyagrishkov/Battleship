var gs;
var shotFields = [];
var MAX_SHOTS = 100;
var numberOfShots = 0;

function GameState(socket) {

    this.clientTurn = false;
    
    this.MAX_CELLS_DESTROYED = 20;
    this.number_of_destroyed_cells_by_A = 0;
    this.number_of_destroyed_cells_by_B = 0;

    this.whoWon = function () {

        if (this.number_of_destroyed_cells_by_A == this.MAX_CELLS_DESTROYED) {

            return "A";
        }
        if (this.number_of_destroyed_cells_by_B == this.MAX_CELLS_DESTROYED) {

            return "B";
        }
        return null;
    }
    this.clientReady = function(){

        htmlPlayerReady();

        // insert here code to send player ready to server
    }

    this.beginGame = function(){
        htmlBeginGame();

        
    }

    this.clientEndTurn = function(){
        htmlSetReadyLights(false);
    }

    this.clientTurn = function(){
        clientTurn = true;
        htmlSetReadyLights(clientTurn);
    }

 

    
    this.updateGame = function (s) {
        socket.send(s);
    }
}


function initializeConnection() {

    var socket = new WebSocket("ws://localhost:3000");
    gs = new GameState(socket);

    socket.onmessage = function (event) {

        if (event.data == "otherPlayerDisconnected") {
            disconnection();
            socket.close();
        }

        if (event.data == "2 JOINT") {
            startGame();
        } else if (event.data == "1 JOINT") {
            console.log("[LOG] Test passed")
            waitForSecondPlayer();
        }

        if(event.data == "yourTurn"){
            gs.changeTurn();
        }

        if(event.data == "bothReady"){ 
            gs.beginGame();
        }
        var field = event.data;

        shotFields.push(event.data);
        numberOfShots++;

        $("." + field).css('background-color', 'black');

        console.log(event.data);

    };

    socket.onopen = function () {

    };
}

function shoot(coordinate_x, coordinate_y) {
    //Here should be shot validation code
    gs.clientEndTurn();

    var s = coordinate_x + coordinate_y;
    gs.updateGame(s);
};

function setClientReady(){
    gs.clientReady();
}


