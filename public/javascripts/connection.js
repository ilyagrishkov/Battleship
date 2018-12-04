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

        var field = event.data;

        shotFields.push(event.data);
        numberOfShots++;

        $("." + field).css('background-color', 'black');
        //
        //        var top = +field - 10;
        //        var bottom = +field + 10;
        //        var left = +field - 1;
        //        var right = +field + 1;
        //
        //        if (field < 10) {
        //            field = "0" + field.toString();
        //        }
        //        if (left < 9) {
        //            left = "0" + left.toString();
        //        }
        //        if (right < 10) {
        //            right = "0" + right.toString();
        //        }
        //
        //        $("." + field).css('background-color', 'black');
        //
        //        if (!(shotFields.includes(left.toString()))) {
        //            $("." + left).css('background-color', 'red');
        //        }
        //        if (!(shotFields.includes(right.toString()))) {
        //            $("." + right).css('background-color', 'red');
        //        }
        //        if (!(shotFields.includes(top.toString()))) {
        //            $("." + top).css('background-color', 'red');
        //        }
        //        if (!(shotFields.includes(bottom.toString()))) {
        //            $("." + bottom).css('background-color', 'red');
        //        }
        console.log(event.data);

    };
    socket.onopen = function () {

    };

}
