var greenLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Button_Icon_Green.svg/200px-Button_Icon_Green.svg.png";
var redLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Redbutton.svg/2000px-Redbutton.svg.png";


function htmlSetReadyLights(clientTurn){

    if(clientTurn == true){
        console.log("switch to player c turn")
        document.getElementById("readyLightClient").src=greenLight;
        document.getElementById("readyLightOther").src=redLight;
    }
    else{
        document.getElementById("readyLightClient").src=redLight;
        document.getElementById("readyLightClient").src=greenLight;
    }
}

function htmlPlayerReady(){
    document.getElementById("turnReadyButton").disabled = true;

    document.getElementById("readyLightClient").src=greenLight;

}

function htmlBeginGame(){
    document.getElementById("gameGridOther").disabled = false;
}