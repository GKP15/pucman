Puckman.Game = function(game) {
};

Puckman.Game.prototype = {

  create: function() {
  },

  update: function() {
  },

  quitGame: function(pointer) {
    this.state.start('MainMenu');
  }
};
