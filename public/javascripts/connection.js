var gs;
var shotFields = [];
var MAX_SHOTS = 100;
var numberOfShots = 0;

function GameState(socket) {

    this.MAX_CELLS_DESTROYED = 20;
    this.room_number = 0;
    this.number_of_destroyed_cells_by_A = 0;
    this.number_of_destroyed_cells_by_B = 0;

    this.setRoomNumber = function (nRoom) {
        this.room_number = nRoom;
    }

    this.whoWon = function () {

        if (this.number_of_destroyed_cells_by_A == this.MAX_CELLS_DESTROYED) {

            return "A";
        }
        if (this.number_of_destroyed_cells_by_A == this.MAX_CELLS_DESTROYED) {

            return "B";
        }
        return null;
    }
    this.updateGame = function (s) {
        socket.send(s);
    }

}


function initializeConnection() {

    var socket = new WebSocket("ws://localhost:3000");
    gs = new GameState(socket);

    socket.onmessage = function (event) {

        if (event.data == "2 JOINT") {
            window.setTimeout(startGame(), 500);
        }

        var field = event.data;

        shotFields.push(event.data);
        numberOfShots++;

        $("." + field).css('background-color', 'black');

        console.log(event.data);

    };
    socket.onopen = function () {
        gs.playersConnected++;
    };

}
