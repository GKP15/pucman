init = function() {
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'gameContainer', null, true);
  map = new mxn.Mapstraction('map', 'openlayers');
  var latlon = new mxn.LatLonPoint(51.50733, -0.12769);
  map.setCenterAndZoom(latlon, 10);
  game.state.add('Boot', Pucman.Boot);
  game.state.add('Preloader', Pucman.Preloader);
  game.state.add('MainMenu', Pucman.MainMenu);
  game.state.add('Game', Pucman.Game);
  game.state.start('Boot');
};
