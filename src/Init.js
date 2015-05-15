/**
 * Einstieg aus der HTML-Datei
 */
init = function() {
    var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameContainer');
    game.state.add('Game', Pucman.Game);
    game.state.start('Game', true);
};
