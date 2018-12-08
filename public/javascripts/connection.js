var gs;
var shotFields = [];
var MAX_SHOTS = 100;
var numberOfShots = 0;

var boatType = -1;
var boatOrientation = 0;

function GameState(socket) {

    this.clientTurn = false;

    this.shipCells = new Array(); //stores occupied cells by id in integer format; eg: id = 01 stored as 1, id=90 stored as 90
    this.placedShips = new Array(5); //keeps track of which of the 5 ships have been placed

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
    this.clientReady = function () {

        if(gs.shipCells.length==17){
            htmlClientReady();
            //Check enough boats are available
            this.updateGame("Ready")
        }
        else{
            alert("You havent placed all your ships yet!");
        }

    }


    this.beginGame = function () {
        htmlBeginGame();
    }

    this.clientEndTurn = function () {
        htmlEndTurn();
    }

    this.yourTurn = function(){

    }

    this.updateGame = function (s) {
        socket.send(s);
    }

    this.deployShip = function(cellID){ // TOODO: check for space, check neighbouring ships ,deploy ship     

        if(gs.shipCells.includes(cellID)){
            gs.undoShip(cellID);
        }
        else{
            if(gs.shipCells.length == 17){
                alert("You already have the max number of cells!");
            }else{


                htmlSetBoatCell(cellID);
                console.log("Deployed ship on: " + cellID);
                gs.shipCells.push(cellID);
            }
        }   
    }

    this.deployShip = function(cellID){
        if(placedShips.includes(boatType)){
            alert("You have already placed that ship! Select a new one");
        }
        else{
            var shipLength = 0;
            switch(boatType){
                case 0:
                    shipLength = 5;
                    break;
                case 1:
                    shipLength = 4;
                    break;
                case 2:
                    shipLength = 3;
                    break;
                case 3:
                    shipLength = 3;
                    break;
                case 4:
                    shipLength = 2;
                    break;    
                default:
                    break;
            }

            if(gs.canPlaceShip(cellID, shipLength, boatOrientation)){
                
            }
            
        }
    }

    this.canPlaceShip = function(cellID,length,orientation){

        id = parseInt(parsecellID.substring(0,2))

        var displacement = 0;
        switch(orientation){
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

        for(var i = id; i < length; i += displacement){
            if(i/10 > 9 || i%10 > 9 || gs.shipCells.includes(i)){ //checks for space directly on the path
                return false;
            }
        }
        return true;
    }

    this.undoShip = function(cellID){
        htmlUndoBoatCell(cellID);
        gs.shipCells.splice(gs.shipCells.indexOf(cellID),1);

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
            waitForSecondPlayer();
        }


        if (event.data == "endTurn") {
            gs.changeTurn();
        }

        if (event.data == "bothReady") {

            /*var field = event.data;

            shotFields.push(event.data);
            numberOfShots++;

            $("." + field).css('background-color', 'black');*/

        };

        if (event.data == "bothReady") {

            gs.beginGame();
        }

        if (event.data == "yourTurn") {
            gs.yourTurn();
        }

        console.log(event.data);

        socket.onopen = function () {

        };
    }
}

function shoot(cellID) {
    //Here should be shot validation code
    gs.clientEndTurn();

    var coordinate_x = cellID.substring(0,1);
    var coordinate_y = cellID.substring(1);

    var s = coordinate_x + coordinate_y;
    gs.updateGame(s);
};


function setClientReady() {
    gs.clientReady();
}

function deployShip(cellID){
    console.log(gs.clientTurn);

    gs.deployShip(cellID);
    
}

function setSelectedShipType(type){
    if(type.equals("Battleship")){
        boatType = 0;
    }
    else if(type.equals("Carrier")){
        boatType = 1;
    }
    else if(type.equals("Submarine")){
        boatType = 2;
    }
    else if(type.equals("Destroyer")){
        boatType = 3;
    }
    else if(type.equals("SmallShip")){
        boatType = 4;
    }   
}

function setShipOrientation(orientation){
    boatOrientation = orientation;
}