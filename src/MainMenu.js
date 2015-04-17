Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {
	create: function() {
		//gehe in state Game
		this.state.start('Game');
	},

	update: function() {},

	startGame: function(pointer) {}
};