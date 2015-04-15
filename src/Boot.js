var Pucman = {};

Pucman.Boot = function(game) {};

Pucman.Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;
    if (this.game.device.desktop) {
      this.scale.pageAlignHorizontally = true;
    } else {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
    }
  },

  preload: function() {
  },

  create: function() {
    this.state.start('Preloader');
  }
};
