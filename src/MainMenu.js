Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {
	
	/**
	 * initialisation of the game state
	 */
	init: function(map) {
		map.setCenterAndZoom(new mxn.LatLonPoint(51.3365278, 12.3764688), 10);
		
	},
	
	/**
	 * creation of the game state
	 */
	create: function() {
		this.input.mouse.mouseWheelCallback = this.mouseWheel;
	},
	
	/**
	 * update of the game state
	 */
	update: function() {},
	
	/**
	 * catch mousewheel movement
	 */
	mouseWheel: function(event) {
		//Ausgabe des Wertes des Mausrads
		console.log(this.input.mouse.wheelDelta);
		console.log(map.getZoom());
		this.world.scale.x = map.getZoom() / 10.0; 
		this.world.scale.y = map.getZoom() / 10.0; 
		map.setZoom(map.getZoom() + this.input.mouse.wheelDelta);
	}
};

