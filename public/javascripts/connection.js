var gs;
var shotFields = [];
var MAX_SHOTS = 100;
var numberOfShots = 0;

function GameState(socket) {

    this.clientTurn = false;

    this.shipCells = new Array(); //stores occupied cells by id in integer format; eg: id = 01 stored as 1, id=90 stored as 90
    this.placedShips = new Array(); //keeps track of which of the 5 ships have been placed

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

    /*this.deployShip = function(cellID){ // TOODO: check for space, check neighbouring ships ,deploy ship     

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
    }*/

    this.deployShip = function(cellID){
        if(gs.placedShips.includes(gs.boatType)){
            alert("You have already placed that ship! Select a new one");
        }
        else{
            var cells = gs.getCellsForBoat(cellID,gs.boatOrientation,gs.boatType);

            if(gs.canPlaceShip(cells,gs.boatOrientation)){
                console.log("Placing ship");

                htmlPlaceShip(cells);
                htmlDisableShip(gs.boatType);// TODO make work
                gs.addShipToArray(cells,gs.boatType);
                gs.placedShips.push(gs.boatType);
            }         
        }
    }
    this.addShipToArray= function(cells,boatType){
        var index = -1;
        switch(boatType){
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
        for(var i = index; i < cells.length; i++){
            gs.shipCells[i] = cells[i-index];
        }
    }

    this.getCellsForBoat = function(cellID,orientation,boatType){ // returns the cells which a boat would occupy
        console.log("Finding cells for boat:" +cellID+ "; orientation:"+ orientation+ "; type:" + boatType);

        var result = new Array();

        id = parseInt(cellID.substring(0,2));

       var shipLength = 0;
        switch(boatType){
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

        for(var i = id; i != id + shipLength*displacement; i += displacement){
            result.push(i);
        }
        return result;
    }

    this.canPlaceShip = function(cells,boatOrientation){

        var result = true;
        var possibleShipCells = cells;
        var errorMessage;

        if(boatOrientation == 0 || boatOrientation == 1){//placing horizontally row doesnt change
            if(Math.floor(cells[0]/10) != Math.floor(cells[cells.length-1]/10)){
                alert("Ship is too close to the side borders!")
                return false;
            }
        }
        else if(boatOrientation ==2 || boatOrientation ==3){
            if(Math.floor(cells[0]%10) != Math.floor(cells[cells.length-1]%10)){
                alert("Ship is too close to the top or bottom border!")
                return false;
            }
        }
        possibleShipCells.forEach(function(cell){
            console.log("Checking cell:" + cell); //TODO: MUST ADD CHECK FOR TOP AND LEFT BORDERS
            
            if(gs.shipCells.includes(cell)){ //checks for space directly on the path
                errorMessage = "Ship collides with another ship";
                result = false;
            }
            else  if(!gs.isFreeAroundCell(cell)){
                errorMessage = "Ship is too close to another ship";
                result = false;    
            }
        });
        if(errorMessage != null){
            alert(errorMessage);
        }
        return result;;
    }

    this.isFreeAroundCell = function(cellID){ // checks around a given integer cellID and returns false if any of the surrounding cells contain a ship
        for(var i = -1; i<=1; i++){
            for(var j = -1; j<=1;j++){
                if(gs.shipCells.includes(cellID+(i+10*j))){
                    return false;
                }
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

            gs.beginGame();
        }

        if (event.data == "yourTurn") {
            gs.yourTurn();
        }

        if(event.data.substring(0,4) == "shot" ){

        }
        if(event.data.substring(0,3) == "hit"){
            
        }

        console.log("Received:" + event.data);
    
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

    gs.deployShip(cellID);
    
}

function setSelectedShipType(type){
    if(type =="Carrier"){
        gs.boatType = 0;
    }
    else if(type == "Battleship"){
        gs.boatType = 1;
    }
    else if(type == "Submarine"){
        gs.boatType = 2;
    }
    else if(type == "Destroyer"){
        gs.boatType = 3;
    }
    else if(type == "SmallShip"){
        gs.boatType = 4;
    }
    
    console.log(gs.boatType);
}

function setShipOrientation(orientation){
    gs.boatOrientation = orientation;
    console.log(gs.boatOrientation);
}