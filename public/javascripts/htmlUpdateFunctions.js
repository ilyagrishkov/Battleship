var greenLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Button_Icon_Green.svg/200px-Button_Icon_Green.svg.png";
var redLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Redbutton.svg/2000px-Redbutton.svg.png";


function htmlSetReadyLights(clientTurn) {

    if (clientTurn == true) {
        console.log("switch to player c turn")
        document.getElementById("readyLightClient").src = greenLight;
        document.getElementById("readyLightOther").src = redLight;
    } else if (clientTurn == false) {
        document.getElementById("readyLightClient").src = redLight;
        document.getElementById("readyLightOther").src = greenLight;
    }
}

function htmlClientReady() {
    var button = document.getElementById("readyButton");
    button.onclick = null;
    button.hidden = true;

    document.getElementById("readyLightClient").src = greenLight;

}

function htmlBeginGame() {
    for (var i = 0; i < 10; i++) {

        for (var k = 0; k < 10; k++) {
            var cell = i.toString() + k.toString();
            $("#" + cell).attr('onclick', 'shoot(this.id)');
        }
    }
}

function htmlYourTurn() {
    for (var i = 0; i < 10; i++) {

        for (var k = 0; k < 10; k++) {
            var cell = i.toString() + k.toString();
            $("#" + cell).attr('onclick', 'shoot(this.id)');
        }
    }

    $("#playerTurnSpan").html("YOU");
    htmlSetReadyLights(true);
}

function htmlEndTurn() {

    for (var i = 0; i < 10; i++) {

        for (var k = 0; k < 10; k++) {
            var cell = i.toString() + k.toString();
            $("#" + cell).attr('onclick', '');
        }
    }

    $("#playerTurnSpan").html("ENEMY");
    htmlSetReadyLights(false);

}

function disableChildren(element) {
    var children = element.children();

    $.each(children, function () {
        $(this).attr('disabled', true);
    });
}

function htmlPlaceShip(cells) {

    console.log(cells); //DEBUG
    cells.forEach(function (element) {
        var cellName = gs.cellIntToID(element);
        cellName = cellName + "c";
        console.log(cellName);
        htmlSetBoatCell(cellName);
    })
}

function htmlSunkShip(cellIDs) {
    cellIDs.forEach(function (element) {
        console.log("Setting cell sunk:" + element);
        document.getElementById(element).style.backgroundColor = "red";
    });
}

function htmlDisableShip(boatType) {
    var boatID;
    switch (boatType) {
        case 0: //carrier
            boatID = "Carrier";
            break;
        case 1: //battleship
            boatID = "Battleship";
            break;
        case 2: //submarine
            boatID = "Submarine";;
            break;
        case 3: //destroyer
            boatID = "Destroyer";;
            break;
        case 4: //smallship
            boatID = "SmallShip";;
            break;
        default:
            break;
    }
    document.getElementById(boatID).onclick = null;
}

function htmlSetBoatCell(cellID) {
    document.getElementById(cellID).style.backgroundColor = "black";
    console.log("Changed background for: " + cellID);
}

function htmlUndoBoatCell(cellID) {
    document.getElementById(cellID).style.backgroundColor = "aquamarine";
}

function htmlHitCell(cellID) {
    document.getElementById(cellID).style.backgroundColor = "green";
}

function htmlMissCell(cellID) {
    document.getElementById(cellID).style.backgroundColor = "blue"; //add disable element to all this

}

function htmlVictory() {

}

function htmlLost() {

}
