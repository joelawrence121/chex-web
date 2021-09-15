var board;
var game;

window.onload = function () {
    initGame();
}

var initGame = function () {
    var config = {
        draggable: true,
        position: 'start',
        onDrop: handleMove,
        showNotation: true
    };

    board = new ChessBoard('gameBoard', config);
    game = new Chess();
}

var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});

    if (move === null) return 'snapback';
}