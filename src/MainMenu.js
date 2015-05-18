//globale PucmanVariable
Pucman = {};
Pucman.MainMenu = function(game) {};

Pucman.MainMenu.prototype = {

    init: function() {
        geocoder = new mxn.Geocoder('openlayers', function(location) {

            // display the map centered on a latitude and longitude + zoom-level
            map.setCenterAndZoom(location.point, 10);
            
            // create a marker positioned at a lat/lon 
            var geocode_marker = new mxn.Marker(location.point);
			geocode_marker.setIcon("http://bibinfo.kobv.de/Bibfuehrer/resources/markers/marker-gold.png",[21,25],[0.5,0.5]);
            var bubble = location.locality + ", " + location.region;
  
            map.addMarker(geocode_marker);
            // open the marker
            
            geocode_marker.setInfoBubble(bubble);
			geocode_marker.openBubble();

            // display marker 
            
        });
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    },

    preload: function() {
        this.load.image('searchButtonPic', 'resources/playButton.png');
        this.load.image('textFieldPic', 'resources/textField.png');
	},

    create: function() {
        searchButton = this.game.add.button((this.game.width + 200)/2, (this.game.height / 2), 'searchButtonPic', this.searchButtonClicked, this);
        searchField = new TextField(this.game, (this.game.width - 600)/2, (this.game.height / 2), 13, 'textFieldPic');
    },

    update: function() {
    	
		if(searchField.pressedEnter) {
    		this.searchAddress(searchField.textData);
    		searchField.pressedEnter = false;
    	}
		
	},
	
    /**
     * searchButton function
     */
    searchButtonClicked: function() {
    	this.searchAddress(searchField.textData);
    	this.state.start('Game', true);
    	
    },
    
    /**
     * search and geocode the given address
     */
    searchAddress: function(input) {
    	var address = {};
    	address.address = input;
    	geocoder.geocode(address);
    }
};
