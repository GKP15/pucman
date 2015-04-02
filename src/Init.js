init = function() {
  var API_KEY = 'AIzaSyD-L9S94qy4G_3zEeTY_r-NOzfAv1P74z8';

  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameContainer');

  game.state.add('Boot', Puckman.Boot);
  game.state.add('Preloader', Puckman.Preloader);
  game.state.add('MainMenu',  Puckman.MainMenu);
  game.state.add('Game',  Puckman.Game);

  game.state.start('Boot');
};
