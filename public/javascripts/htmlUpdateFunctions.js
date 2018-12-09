var greenLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Button_Icon_Green.svg/200px-Button_Icon_Green.svg.png";
var redLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Redbutton.svg/2000px-Redbutton.svg.png";


function htmlSetReadyLights(clientTurn){

    if(clientTurn == true){
        console.log("switch to player c turn")
        document.getElementById("readyLightClient").src=greenLight;
        document.getElementById("readyLightOther").src=redLight;
    }
    else if(clientTurn == false){
        document.getElementById("readyLightClient").src=redLight;
        document.getElementById("readyLightOther").src=greenLight;
    }
}

function htmlClientReady(){
    document.getElementById("turnReadyButton").disabled = true;

    document.getElementById("readyLightClient").src=greenLight;

}

function htmlBeginGame(){
    //stuff
}

function htmlYourTurn(){
    $("#gameGridDivsOther").find('*').attr("disabled", false);
    htmlSetReadyLights(true);
}

function htmlEndTurn(){
    disableChildren($("#gameGridDivsOther")); //try to disable all children when this is called
    htmlSetReadyLights(false);

}

function disableChildren(element){
    var children = element.children();

    $.each(children, function(){
        $(this).attr('disabled',true);
    });
}

function htmlPlaceShip(cells){
    
    console.log(cells); //DEBUG
    cells.forEach(function(element){
        var cellName = element+"c";
        if(element<10){
            cellName = "0"+cellName;
        }
        htmlSetBoatCell(cellName);
    })
}

function htmlDisableShip(boatType){
    var boatID;
    switch(boatType){
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
    document.getElementById(boatID).disabled = true;
}

function htmlSetBoatCell(cellID){
    document.getElementById(cellID).style.backgroundColor = "black";
    console.log("Changed background for: " + cellID);
}

function htmlUndoBoatCell(cellID){
    document.getElementById(cellID).style.backgroundColor = "aquamarine";
}