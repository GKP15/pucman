Puckman.Preloader = function(game) {
  this.background = null;
  this.preloadBar = null;
  this.ready = false;
};

BasicGame.Preloader.prototype = {
  preload: function() {
    this.background = this.add.sprite(0, 0, 'preloaderBackground');
    this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
    this.load.setPreloadSprite(this.preloadBar);
    this.load.image('titlepage', 'images/title.jpg');
    this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
    this.load.audio('titleMusic', ['audio/main_menu.mp3']);
    this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
  },

  create: function() {
    this.preloadBar.cropEnabled = false;
  },

  update: function() {
    if (this.cache.isSoundDecoded('titleMusic') && this.ready == false) {
      this.ready = true;
      this.state.start('MainMenu');
    }
  }
};
