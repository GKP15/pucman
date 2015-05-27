//globale PucmanVariable
Pucman = {};
Pucman.MainMenu = function(game, map) {
    this.map = null;
};

Pucman.MainMenu.prototype = {
    
	/**
	 * initialisation of the state
	 * @param map from mapstraction
	 */
    init: function(map) {
        this.map = map;
        // create a marker positioned at a lat/lon 
        //var geocodeMarker = new mxn.Marker(location.point);
        //geocodeMarker.setIcon("http://bibinfo.kobv.de/Bibfuehrer/resources/markers/marker-gold.png", [21, 25], [0.5, 0.5]);
        //var bubble = location.locality + ", " + location.region;

        //map.addMarker(geocodeMarker);
        // open the marker

        //geocodeMarker.setInfoBubble(bubble);
        //geocodeMarker.openBubble();

        // display marker 

    },
    
	/**
	 * preloads data for the state
	 */
    preload: function() {
        this.load.image('searchButtonPic', 'resources/playButton.png');
        this.load.image('textFieldPic', 'resources/textField.png');
    },
	
	/**
	 * called on creation of the state
	 */
    create: function() {
        this.input.mouse.mouseWheelCallback = this.mouseWheel;
        searchButton = this.game.add.button(
            (this.game.width + 200) / 2, (this.game.height / 2),
            'searchButtonPic',
            this.searchButtonClicked, this);
        searchField = new TextField(
            this.game, (this.game.width - 600) / 2, (this.game.height / 2), 13, 'textFieldPic');

        // get Markerdata from RDF DB Array[[city,longi,lati,person,score],[...]]
        //var geomapmarkers = rdfmarkerget();
        // 
        //var markerPoint = [geomapmarkers[0][2], geomapmarkers[0][1]];
        //var point = new mxn.LatLonPoint(markerPoint);
        //var highscore_marker = new mxn.Marker(markerPoint);
       // highscore_marker.setIcon("http://bibinfo.kobv.de/Bibfuehrer/resources/markers/marker-gold.png", [21, 25], [0.5, 0.5]);
        //map.addMarker(highscore_marker);
        // open the marker            
        //highscore_marker.setInfoBubble(bubble);
        //highscore_marker.openBubble();

    },
    
	/**
	 * updates the state
	 */
    update: function() {

        if (searchField.pressedEnter) {
            this.searchAddress(searchField.textData);
            searchField.pressedEnter = false;
        }

    },

    /**
     * searchButton function
     */
    searchButtonClicked: function() {
        //this.searchAddress(searchField.textData);
		this.game.state.start('Load', true, false, map);

    },

    /**
     * search and geocode the given address
	 * @param text from the textfield
     */
    searchAddress: function(input) {
        var address = {};
        address.address = input;
        geocoder.geocode(address);
    },

    /**
     * catch mousewheel movement
	 * @param mouswheel event
     */
    mouseWheel: function(event) {
        //Ausgabe des Wertes des Mausrads
        console.log(this.input.mouse.wheelDelta);
        //console.log(map.getZoom());
        this.world.scale.x = map.getZoom() / 10.0;
        this.world.scale.y = map.getZoom() / 10.0;
        map.setZoom(map.getZoom() + this.input.mouse.wheelDelta);
    }
};
