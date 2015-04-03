init = function() {
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameContainer');

  game.state.add('Boot', Pucman.Boot);
  game.state.add('Preloader', Pucman.Preloader);
  game.state.add('MainMenu',  Pucman.MainMenu);
  game.state.add('Game',  Pucman.Game);

  game.state.start('Boot');
};
