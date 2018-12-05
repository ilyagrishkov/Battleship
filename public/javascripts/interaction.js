function play() {

    $("body").fadeOut(500).delay(500).queue(function () {
        initializeConnection()
    });
}

function startGame() {

    $("body").load("gameScreen.html");
    $(".style_splash").remove().delay(500).queue(function () {
        $("body").fadeIn(500);
    });
};

function shoot(coordinate_x, coordinate_y) {
    //Here should be shot validation code
    var s = coordinate_x + coordinate_y;
    gs.updateGame(s);
};
