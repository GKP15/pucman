Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {
	
	/**
	 * initialisation of the game state and the geocoder
	 */
	init: function(map) {
		var address = {};
		address.address = 'Leipzig';
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
		//this.input.mouse.mouseWheelCallback = this.mouseWheel;
		//button to play
		homepageButton = this.game.add.button((this.game.width / 2), (this.game.height / 2), 'playButtonPic', this.playButtonClicked, this);
		homepageButton.anchor.setTo(0.5,0.5);
		
	},
	
	/**
	 * preloads of the game state
	 */
	preload: function() {
		this.load.image('playButtonPic', 'resources/playButton.png');
	},
	
	/**
	 * update of the game state
	 */
	update: function() {
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
	},
	
	/**
	 * catch mousewheel movement
	 */
	playButtonClicked: function() {
		this.state.start('Game');
	}
};

