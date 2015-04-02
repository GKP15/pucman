var Puckman = {};

Puckman.Boot = function(game) {};

Puckman.Boot.prototype = {

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
    this.load.image('preloaderBackground', 'images/preloader_background.jpg');
    this.load.image('preloaderBar', 'images/preloadr_bar.png');
  },

  create: function() {
    this.game.plugin = this.game.plugin.add(Phaser.Plugin.GoogleMapsRender);
    this.state.start('Preloader');
  }
};
