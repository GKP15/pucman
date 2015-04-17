Pucman.Preloader = function(game) {};

Pucman.Preloader.prototype = {
	preload: function() {},

	create: function() {
		//gehe in state MainMenu
		this.state.start('MainMenu');
	},

	update: function() {}
};