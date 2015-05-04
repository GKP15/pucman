var Pucman = {};
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
  
            map.addMarker(geocode_marker);
            // open the marker
            geocode_marker.openBubble();
            geocode_marker.setInfoBubble(bubble);

            // display marker 
            
        });
        geocoder.geocode(address);
        // vom Mittelpunkt ist der linke und rechte rand um 0,01093268394 entfernt
        //geocoder.latConv(address);
        // oberer und unterer Rand sind jeweils 0,005844353 entfernt
              
    },

    /**
     * creation of the game state
     */
    create: function() {
        this.input.mouse.mouseWheelCallback = this.mouseWheel;
        //button to play
        homepageButton = this.game.add.button((this.game.width / 2), (this.game.height / 2), 'playButtonPic', this.playButtonClicked, this);
        homepageButton.anchor.setTo(0.5, 0.5);
        searchField = new TextField(this.game, (this.game.width / 2 - 450), (this.game.height / 2), 275, 'textFieldPic');
    },

    /**
     * preloads of the game state
     */
    preload: function() {
        this.load.image('playButtonPic', 'resources/playButton.png');
        this.load.image('textFieldPic', 'resources/textField.png');
    },

    /**
     * update of the game state
     */
    update: function() {
    	if(searchField.pressedEnter) {
    		this.searchAddress(searchField.textData);
    		searchField.pressedEnter = false;
    	}
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
     * playbutton function
     */
    playButtonClicked: function() {
    	this.searchAddress(searchField.textData);
    	this.game.state.start('Game', true, false, map);
    	
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
