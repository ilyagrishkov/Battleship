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

function htmlSetBoatCell(cellID){
    var cell = document.getElementById(cellID);
    cell.style.backgroundColor = "red";
}