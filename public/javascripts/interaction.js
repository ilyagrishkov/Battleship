function play() {

    $(".control_element_play").stop().fadeOut(500).delay(500).queue(function () {
        initializeConnection();
    });
}

function waitForSecondPlayer() {
    $("#waiting").fadeIn(500);
}

function startGame() {
    $(".container").stop().fadeOut(500).delay(200).queue(function () {
        $("body").fadeOut(0);
        $("body").load("gameScreen.html");
        $(".style_splash").remove();
        $("body").stop().fadeIn(500);
        
        loadGrid();
    })

    
};

function disconnection() {
    $("#disconnection").fadeIn(500);
    $("#disconnected_screen_background").fadeIn(500).delay(3000).queue(function () {
        window.location.replace("/index.html");
    });
};S

function loadGrid() { //loads divs through nested for-loops
    var otherCell = $('<div class="gameGridCell"></div>')
    for(var i = 1; i <11; i++){
        console.log("Adding row");
        $("#gameGridDivsClient").append('<div class = "gameGridCell"></div>'); //cant access div by IDe
        console.log(window.print());
        for(var k = 0; k < 10; k++){
            $("#gameGridDivsClient").append(otherCell);
        }
    }
}
