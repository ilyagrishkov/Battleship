var gs;
var shotFields = [];
var MAX_SHOTS = 100;
var numberOfShots = 0;

function GameState(socket) {

    this.clientTurn = false;

    this.shipCells = new Array(17); //stores occupied cells by id in integer format; eg: id = 01 stored as 1, id=90 stored as 90
    this.placedShips = new Array(); //keeps track of which of the 5 ships have been placed
    this.hitCells = new Array(17);
    this.boatsSunk = 0;

    this.MAX_CELLS_DESTROYED = 20;
    this.number_of_destroyed_cells_by_A = 0;
    this.number_of_destroyed_cells_by_B = 0;


    this.boatType = 0;
    this.boatOrientation = 0;

    this.whoWon = function () {

        if (this.number_of_destroyed_cells_by_A == this.MAX_CELLS_DESTROYED) {

            return "A";
        }
        if (this.number_of_destroyed_cells_by_B == this.MAX_CELLS_DESTROYED) {

            return "B";
        }
        return null;
    }
    this.clientReady = function () {

        if (gs.shipCells.length == 17) {
            htmlClientReady();
            //Check enough boats are available
            this.updateGame("Ready")
        } else {
            alert("You havent placed all your ships yet!");
        }

    }


    this.beginGame = function () {
        htmlBeginGame();
    }

    this.clientEndTurn = function () {
        htmlEndTurn();
    }

    this.yourTurn = function () {
        htmlYourTurn();
    }
    this.handleShot = function (cellID) { //receiving shots   
        console.log("Received shot on:" + cellID);
        console.log(gs.shipCells);
        if (gs.shipCells.includes(cellID)) {
            htmlHitCell(gs.cellIntToID(cellID) + "c");
            gs.hitCells[gs.shipCells.indexOf(cellID)] = -1;
            gs.updateGame("hit" + cellID);
            gs.clientEndTurn();

            if (gs.checkSunk(cellID)) { //if sunk
                console.log("boat sunk");
                var boat = gs.getBoatFromCellID(gs.shipCells, cellID);


                gs.sinkShip(boat);

                gs.sendSunk(boat);

                gs.boatsSunk++;
                if (gs.boatsSunk == 5) {
                    gs.allBoatsSunk();
                }
            }

        } else {
            htmlMissCell(gs.cellIntToID(cellID) + "c");
            gs.updateGame("miss" + cellID);
        }
    }
    this.handleHit = function (cell) {
        console.log("Handling hit on: " + cell)

        cellID = gs.cellIntToID(cell)
        htmlHitCell(cellID);

    }
    this.handleMiss = function (cell) {
        console.log("Handling miss on: " + cell)
        cellID = gs.cellIntToID(cell)
        htmlMissCell(cellID);
    }

    this.handleSunk = function (cells) {
        var cellIDs = new Array();
        cells.forEach(function (element) {
            cellIDs.push(gs.cellIntToID(element));
            for (var i = -1; i < 2; i++) { //set miss loop
                for (var j = -1; j < 2; j++) {
                    htmlMissCell(gs.cellIntToID(element + (i + j * 10)));
                }
            }
        })


        htmlSunkShip(cellIDs);


    }

    this.handleGG = function () {
        htmlVictory();
    }

    this.cellIntToID = function (cell) {
        if (cell < 10) {
            return "0" + cell;
        }
        return cell;
    }

    this.sendSunk = function (cells) {
        var message = new Object();
        message.id = "sunk";
        message.boat = cells;
        JSONmessage = JSON.stringify(message);
        gs.updateGame(JSONmessage)
    }

    this.updateGame = function (s) {
        socket.send(s);
    }

    this.deployShip = function (cellID) {
        if (gs.placedShips.includes(gs.boatType)) {
            alert("You have already placed that ship! Select a new one");
        } else {
            var cells = gs.getCellsForBoat(cellID, gs.boatOrientation, gs.boatType);

            if (gs.canPlaceShip(cells, gs.boatOrientation)) {
                console.log("Placing ship");

                htmlPlaceShip(cells);
                htmlDisableShip(gs.boatType); // TODO make work
                gs.addShipToArray(gs.shipCells, cells, gs.boatType);
                gs.placedShips.push(gs.boatType);
            }
        }
    }
    this.addShipToArray = function (array, cells, boatType) {
        var index = -1;
        switch (boatType) {
            case 0: //carrier
                index = 0;
                break;
            case 1: //battleship
                index = 5;
                break;
            case 2: //submarine
                index = 9;
                break;
            case 3: //destroyer
                index = 12;
                break;
            case 4: //smallship
                index = 15;
                break;
            default:
                break;
        }
        for (var i = index; i < index + cells.length; i++) {
            array[i] = cells[i - index];
        }
        console.log(array);
    }

    this.getCellsForBoat = function (cellID, orientation, boatType) { // returns the cells which a boat would occupy
        console.log("Finding cells for boat:" + cellID + "; orientation:" + orientation + "; type:" + boatType);

        var result = new Array();

        id = parseInt(cellID.substring(0, 2));

        var shipLength = 0;
        switch (boatType) {
            case 0: //carrier
                shipLength = 5;
                break;
            case 1: //battleship
                shipLength = 4;
                break;
            case 2: //submarine
                shipLength = 3;
                break;
            case 3: //destroyer
                shipLength = 3;
                break;
            case 4: //smallship
                shipLength = 2;
                break;
            default:
                break;
        }

        var displacement = 0;
        switch (orientation) {
            case 0: //place right
                displacement = 1;
                break;
            case 1: //place left
                displacement = -1;
                break;
            case 2: //place up
                displacement = -10;
                break;
            case 3: //place down
                displacement = 10;
                break;
        }

        for (var i = id; i != id + shipLength * displacement; i += displacement) {
            result.push(i);
        }
        return result;
    }

    this.checkSunk = function (cellID) {
        var result = true;
        var boat = gs.getBoatFromCellID(gs.hitCells, cellID);

        console.log("Checking boat:" + boat);

        boat.forEach(function (element) {
            if (element != -1) {
                result = false;
            }
        });

        return result;
    }

    this.sinkShip = function (boat) {

        var cellIDs = new Array(); //array of cell ids for htmlFunction

        boat.forEach(function (element) {
            cellIDs.push(gs.cellIntToID(element) + "c");
        });


        htmlSunkShip(cellIDs);
    }

    this.allBoatsSunk = function () {
        gs.updateGame("gg");
        htmlLost();
    }




    this.getBoat = function (array, boat) { //returns part of shipCells array with the corresponding boat
        var result = new Array();
        var startIndex = -1;
        var endIndex = -1;
        switch (boat) {
            case 0: //carrier
                startIndex = 0;
                endIndex = 4;
                break;
            case 1: //battleship
                startIndex = 5;
                endIndex = 8;
                break;
            case 2: //submarine
                startIndex = 9;
                endIndex = 11;
                break;
            case 3: //destroyer
                startIndex = 12;
                endIndex = 14;
                break;
            case 4: //smallship
                startIndex = 15;
                endIndex = 16;
                break;
            default:
                break;
        }
        for (var i = startIndex; i < endIndex + 1; i++) {
            result.push(array[i]);
        }

        return result;
    }

    this.getBoatFromCellID = function (array, cellID) {
        var result;
        var cellIndex = gs.shipCells.indexOf(cellID);

        console.log("Finding boat from cell: " + cellID + "index:" + gs.shipCells.indexOf(cellID));

        if (cellIndex < 5) {
            console.log("Clicked on carrier");
            result = gs.getBoat(array, 0);
        } else if (cellIndex < 9) {
            result = gs.getBoat(array, 1);
        } else if (cellIndex < 12) {
            result = gs.getBoat(array, 2);
        } else if (cellIndex < 15) {
            result = gs.getBoat(array, 3);
        } else if (cellIndex < 17) {
            result = gs.getBoat(array, 4);
        }

        return result;
    }

    this.canPlaceShip = function (cells, boatOrientation) {

        var result = true;
        var possibleShipCells = cells;
        var errorMessage;

        if (boatOrientation == 0 || boatOrientation == 1) { //palcing horizontally
            if (Math.floor(cells[0] / 10) - Math.floor(cells[cells.length - 1] / 10) != 0) { //check side borders
                alert("Ship is too close to the side borders!")
                return false;
            }
        } else if (boatOrientation == 2 || boatOrientation == 3) { //placing vertically
            if (cells[cells.length - 1] < 0 || cells[cells.length - 1] > 99) { //check top or bottom border
                alert("Ship is too close to the top or bottom border!")
                return false;
            }
        }
        possibleShipCells.forEach(function (cell) {
            console.log("Checking cell:" + cell); //TODO: MUST ADD CHECK FOR TOP AND LEFT BORDERS

            if (gs.shipCells.includes(cell)) { //checks for space directly on the path
                errorMessage = "Ship collides with another ship";
                result = false;
            } else if (!gs.isFreeAroundCell(cell)) {
                errorMessage = "Ship is too close to another ship";
                result = false;
            }
        });
        if (errorMessage != null) {
            alert(errorMessage);
        }
        return result;;
    }

    this.isFreeAroundCell = function (cellID) { // checks around a given integer cellID and returns false if any of the surrounding cells contain a ship
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (gs.shipCells.includes(cellID + (i + 10 * j))) {
                    return false;
                }
            }
        } //TODO: fix checking across border bug
        return true;
    }

    this.undoShip = function (cellID) {
        htmlUndoBoatCell(cellID);
        gs.shipCells.splice(gs.shipCells.indexOf(cellID), 1);

    }
}



function initializeConnection() {

    var socket = new WebSocket("ws://" + location.host);
    gs = new GameState(socket);

    socket.onmessage = function (event) {

        if (event.data == "otherPlayerDisconnected") {
            disconnection();
            socket.close();
        } else if (event.data == "2 JOINT") {
            startGame();
        } else if (event.data == "1 JOINT") {
            waitForSecondPlayer();
        } else if (event.data == "endTurn") {
            gs.clientEndTurn();
        }

        if (event.data == "BOTH READY") {

            gs.beginGame();
        } else if (event.data == "yourTurn") {
            gs.yourTurn();
        } else if (event.data.substring(0, 4) == "shot") {
            gs.yourTurn();
            gs.handleShot(parseInt(event.data.substring(4)));
        } else if (event.data.substring(0, 3) == "hit") {
            gs.handleHit(parseInt(event.data.substring(3)));
        } else if (event.data.substring(0, 4) == "miss") {
            gs.clientEndTurn();
            gs.handleMiss(parseInt(event.data.substring(4)));
        } else if (event.data == "gg") {
            gs.handleGG();
        } else if (JSON.parse(event.data).id == "sunk") {
            console.log("received sunk");
            gs.handleSunk(JSON.parse(event.data).boat);
        }

        console.log("Received:" + event.data);

        socket.onopen = function () {

        };
    }
}

function shoot(cellID) {
    //Here should be shot validation code


    var coordinate_x = cellID.substring(0, 1);
    var coordinate_y = cellID.substring(1);

    var s = coordinate_x + coordinate_y;
    gs.updateGame("shot" + s);
};


function setClientReady() {
    gs.clientReady();
}

function deployShip(cellID) {

    gs.deployShip(cellID);

}

function setSelectedShipType(type) {
    if (type == "Carrier") {
        gs.boatType = 0;
    } else if (type == "Battleship") {
        gs.boatType = 1;
    } else if (type == "Submarine") {
        gs.boatType = 2;
    } else if (type == "Destroyer") {
        gs.boatType = 3;
    } else if (type == "SmallShip") {
        gs.boatType = 4;
    }

    console.log(gs.boatType);
}

function setShipOrientation(orientation) {
    gs.boatOrientation = orientation;
    console.log(gs.boatOrientation);
}
