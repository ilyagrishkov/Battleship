
function play() {

    $(".control_element_play").stop().fadeOut(500).delay(500).queue(function () {
        initializeConnection();
    });
}

function waitForSecondPlayer() {
    $("#waiting").fadeIn(500);
}


function startGame() {
    $(".container").stop().fadeOut(500).delay(200).queue(function (next) {
        $("body").load("gameScreen.html",loadGridOther);
        $(".style_splash").remove();
    });
};


function disconnection() {
    $("#disconnection").fadeIn(500);
    $("#disconnected_screen_background").fadeIn(500).delay(3000).queue(function () {
        window.location.replace("/");
    });
};

function loadGridOther() { //loads divs through nested for-loops

    for(var i = 65; i<75;i++){
      $("#gameGridDivsOther").append('<div class = "gameGridHeader">'+String.fromCharCode(i)+'</div>');
    }

    for(var i = 1; i <11; i++){
        console.log("Adding row");
        $("#gameGridDivsOther").append('<div class = "gameGridHeader">'+i+'</div>');
         
        for(var k = 0; k < 10; k++){
            var otherCell = $('<div class="gameGridCell" id="'+k+i+'" onclick="shoot(this.id)"></div>')
            $("#gameGridDivsOther").append(otherCell.clone());
        }
    }

    loadGridClient();
}

function loadGridClient() { //loads divs through nested for-loops
    for(var i = 65; i<75;i++){
        $("#gameGridDivsClient").append('<div class = "gameGridHeader">'+String.fromCharCode(i)+'</div>');
    }

    for(var i = 0; i <10; i++){
        console.log("Adding row");
        $("#gameGridDivsClient").append('<div class = "gameGridHeader">'+(i+1)+'</div>');
         
        for(var k = 0; k < 10; k++){
            var otherCell = $('<div class="gameGridCell" id="'+i+k+'c" onclick="deployShip(this.id)"></div>')
            $("#gameGridDivsClient").append(otherCell.clone());
        }
    }
}
