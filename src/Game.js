Pucman.Game = function(game) {
};

Pucman.Game.prototype = {

  create: function() {
  },

  update: function() {
  },

  quitGame: function(pointer) {
    this.state.start('MainMenu');
  }
};
