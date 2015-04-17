Pucman.Preloader = function(game) {};

Pucman.Preloader.prototype = {
	init: function(map) {
		this.state.start('MainMenu', true, false, map);
	},
	
	preload: function() {},

	create: function() {
		//gehe in state MainMenu
		
	},

	update: function() {}
};