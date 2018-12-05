var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT";

}



game.prototype.setStatus = function (w) {

    if (!(this.gameState === w)) {
        this.gameState = w;
        console.log("[LOG] %s", this.gameState);

    } else {
        return new Error("Impossible status change from %s to %s", this.gameState, w);
    }
};


game.prototype.addReady = function () {

    if (this.gameState != "1 READY" && this.gameState != "2 READY") {
        this.setStatus("1 READY");
        console.log("Current status is %s", this.gameState);
    } else {
        this.setStatus("2 READY");
    }


}

game.prototype.bothPlayersReady = function () {
    return (this.gameState == "2 READY");
}

game.prototype.hasTwoConnectedPlayers = function () {
    return (this.gameState == "2 JOINT");
}

game.prototype.deletePlayer = function () {
    this.gameState = "1 JOINT";
}

game.prototype.addPlayer = function (p) {

    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error("Invalid call to addPlayer, current state is %s", this.gameState);
    }

    var error = this.setStatus("1 JOINT");

    if (error instanceof Error) {
        this.setStatus("2 JOINT");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    } else {
        this.playerB = p;
        return "B";
    }
};

module.exports = game;
