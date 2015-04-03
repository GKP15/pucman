Pucman.MainMenu = function(game) {
  this.music = null;
  this.playButton = null;
};

Pucman.MainMenu.prototype = {
  create: function() {
    this.music = this.add.audio('titleMusic');
    this.music.play();
    this.add.sprite(0, 0, 'titlepage');
    this.playButton = this.add.button(
      400, 600,
      'playButton',
      this.startGame,
      this,
      'buttonOver',
      'buttonOut',
      'buttonOver'
    );
  },

  update: function() {},

  startGame: function(pointer) {
    this.music.stop();
    this.state.start('Game');
  }
};
