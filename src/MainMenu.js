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
        geocoder.geocode(address);
        // vom Mittelpunkt ist der linke und rechte rand um 0,01093268394 entfernt LATitude
        //geocoder.latConv(address);
        // lon oberer und unterer Rand sind jeweils 0,005844353 entfernt
        //<bbox-query e="12.387299537658691" n="51.34610786056325" s="51.334419153634336" w="12.365434169769287"/>
        var east = map.getCenter().lon + 0.00593268394;
        var north = map.getCenter().lat + 0.002944353 + 0.002944353;
        var south = map.getCenter().lat;
        var west = map.getCenter().lon - 0.00593268394;
        var apiUrlBase = "http://overpass-api.de/api/interpreter?data=[out:json];";
        var apiUrlData = "(way[\"highway\"][\"highway\"!=\"primary\"][\"highway\"!=\"footway\"][\"highway\"!=\"steps\"]"+
	        "[\"highway\"!=\"service\"][\"highway\"!=\"construction\"][\"highway\"!=\"cycleway\"][\"highway\"!=\"path\"]" +
	        "[\"highway\"!=\"elevator\"][\"area\"!=\"yes\"][\"building\"!=\"yes\"]"+
	        "(" + south + "," + west + "," + north + "," + east + "););out body;>;out skel qt;";
        jQuery.getJSON(apiUrlBase+apiUrlData, function(data) {
        })
        .done(function(data) {
            //console.log(data);
            var geoj = osmtogeojson(data);
            var anzahlDerEintraege = 0;
            var collectedOSMData = new Array();
    		var arrayEintrag = new Array();
            $.each(geoj,function(key,value){
            	if (key=="features"){
            		$.each(value,function( ordnungszahl,objekt){
            			$.each(objekt,function(oberbegriff,bezeichnung){
            				if(oberbegriff=="geometry"){
            					$.each(bezeichnung,function(coordinates,array){
            						if(coordinates=="coordinates"){
            							arrayEintrag[1]=array;
            						}
            						if(coordinates=="type"){
            							arrayEintrag[2]=array;
            						}
            					});
            				}
            				if(oberbegriff=="properties"){
            					$.each(bezeichnung,function(identitaet,nummer){
            						if(identitaet=="id"){
            							arrayEintrag[0]=nummer;
            						}
            					});
            				}
            			});
            			collectedOSMData[anzahlDerEintraege] = new Object(); 
            			collectedOSMData[anzahlDerEintraege] = arrayEintrag;
            			arrayEintrag = new Array();
            			anzahlDerEintraege++;
            		});
            	}  
    			console.log(collectedOSMData);
            });
        })
        .fail(function( jqxhr, textStatus, error ) {
            console.log( "Request Failed: " + textStatus);
        }); 
	    
    }, 

    
    /**
     * creation of the game state
     */
    create: function() {
        this.input.mouse.mouseWheelCallback = this.mouseWheel;
        //button to play
        playButton = this.game.add.button((this.game.width + 200)/2, (this.game.height / 2), 'playButtonPic', this.playButtonClicked, this);
        playButton.anchor.setTo(0, 0);
        searchField = new TextField(this.game, (this.game.width - 600)/2, (this.game.height / 2), 13, 'textFieldPic');
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
        //console.log(this.input.mouse.wheelDelta);
        //console.log(map.getZoom());
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
