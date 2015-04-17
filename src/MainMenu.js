Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {
	create: function() {
		game.state.states['Boot'].map.addControls('pan', true);
		//gehe in state Game
		this.state.start('Game');
	},

	update: function() {},

	startGame: function(pointer) {}
};