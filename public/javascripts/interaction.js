function play() {

    $("#controls").fadeOut(500).delay(500).queue(function () {
        initializeConnection();
    });
}

function waitForSecondPlayer() {
    $("#waiting").fadeIn(500);
}

function startGame() {
    $("body").fadeOut(500).queue(function () {;
        $("body").load("gameScreen.html");
        $(".style_splash").remove();
        $("body").stop().fadeIn(500);
    })

    loadGrid();
};

function disconnection() {
    $("#disconnection").fadeIn(500);
    $("#disconnected_screen_background").fadeIn(500).delay(3000).queue(function () {

        window.location.replace("/index.html");
    });
};

function loadGrid(){

}
