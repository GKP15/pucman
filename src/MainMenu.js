Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {
	
	init: function(map) {
		map.setCenterAndZoom(new mxn.LatLonPoint(51.3365278, 12.3764688), 10);
		//gehe in state Game
		setTimeout(continueExecution, 10000);
		
	},
	
	create: function() {
		
	},

	update: function() {},

	startGame: function(pointer) {},
	
	continueExecution: function() {
		this.state.start('Game');
	}
};

