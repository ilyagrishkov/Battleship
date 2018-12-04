var msg = "I have joined!";

function play() {
    initializeConnection();
    $("body").fadeOut(500).queue(function (next) {
        $("body").load("gameScreen.html");
        $(".style_splash").remove();
        next();
    }).queue(function (next) {
        $("body").fadeIn(500);
        next();
    });
    //    $('.control_element_play').stop().fadeOut(700).queue(function (next) {
    //        $('.control_element_connection').stop().fadeIn(700);
    //        next();
    //    });
}

function createGame() {
    $('.control_element_connection').fadeOut(700).queue(function (next) {
        $('.control_element_id_out').fadeIn(700);
        next();
    });
    initializeConnection();
}

function connectToGame() {
    $('.control_element_connection').fadeOut(700).queue(function (next) {
        $('.control_element_id_in').fadeIn(700);
        next();
    });
}

function startGame() {

    $("body").fadeOut(500).queue(function (next) {
        $("body").load("gameScreen.html");
        $(".style_splash").remove();
        next();
    }).queue(function (next) {
        $("body").fadeIn(500);
        next();
    });
};



function testing() {
    gs.updateGame("Text");

};

function shoot(coordinate_x, coordinate_y) {
    //Here should be shot validation code
    var s = coordinate_x + coordinate_y;
    gs.updateGame(s);
};
