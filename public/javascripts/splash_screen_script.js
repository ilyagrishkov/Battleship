var msg = "I have joined!"

function play() {
    $('.control_element_play').stop().fadeOut(700).queue(function (next) {
        $('.control_element_connection').stop().fadeIn(700);
        next();
    });
}

function createGame() {
    $('.control_element_connection').fadeOut(700).queue(function (next) {
        $('.control_element_id_out').fadeIn(700);
        next();
    });
    var socket = new WebSocket("ws://localhost:3000");
    socket.onmessage = function (event) {
        document.getElementById("game_id").innerHTML = event.data;
    }
    socket.onopen = function () {
        socket.send(msg);
    };
}

function connectToGame() {
    $('.control_element_connection').fadeOut(700).queue(function (next) {
        $('.control_element_id_in').fadeIn(700);
        next();
    });
}
