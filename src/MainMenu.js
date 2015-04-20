Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {
	
	/**
	 * initialisation of the game state and the geocoder
	 */
	init: function(map) {
		var address = {};
		address.address = 'Grimma';
		geocoder = new mxn.Geocoder('openlayers', function(location) {

		    // display the map centered on a latitude and longitude + zoom-level
		    map.setCenterAndZoom(location.point, 15);
		    
		    // create a marker positioned at a lat/lon 
		    var geocode_marker = new mxn.Marker(location.point);
		    var bubble = location.locality + ", " + location.region;

			// open the marker
			geocode_marker.openBubble();
		    geocode_marker.setInfoBubble(bubble);

		    // display marker 
		    map.addMarker(geocode_marker);
		});
		geocoder.geocode(address);
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
	update: function() {
		this.state.start('Game');
	},
	
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

