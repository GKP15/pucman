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
        //<bbox-query e="12. 387 299 537 658 691" n="51.34 610 786 056 325" s="51. 334 419 153 634 336" w="12. 365 434 169 769 287"/>
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
            var collectedOSMDataWays = new Array();
            var collectedOSMDataNodes = new Array();
    		var arrayEintrag = new Array();
            $.each(geoj,function(key,value){
            	if (key=="features"){
            		$.each(value,function( ordnungszahl,objekt){
            			$.each(objekt,function(oberbegriff,bezeichnung){
            				if(oberbegriff=="geometry"){
            					$.each(bezeichnung,function(coordinates,array){
            						if(coordinates=="coordinates"){
            							arrayEintrag[1]=array;
            							for (var i = 0; i < array.length; ++i){
            								array[i][0] = Math.round(85000 * (array[i][0]-east));
            								array[i][1] = Math.round(85000 * (array[i][1]-north));
            							}
            							//console.log(arrayEintrag[0] + array);
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
            			collectedOSMDataWays [anzahlDerEintraege] = new Object(); 
            			collectedOSMDataWays [anzahlDerEintraege] = arrayEintrag;
            			arrayEintrag = new Array();
            			anzahlDerEintraege++;
            		});
            	}  
            });
			//console.log(collectedOSMDataWays );
            //wo sich wege ueberschneiden, existieren kreuzungen
			collectedOSMDataNodes = new Array();
    		var counter = 0;
			var size = collectedOSMDataWays.length;
			for (var i=0; i < size; ++i){
				var idA = collectedOSMDataWays[i][0];
				$.each(collectedOSMDataWays[i][1],function(key,coordinateA){
					for (var j = i; j < size; ++j){
						if(collectedOSMDataWays[i][0]!==collectedOSMDataWays[j][0]){
    						$.each(collectedOSMDataWays[j][1],function(key0,coordinateB){
    							if (coordinateA[0] == coordinateB[0] && coordinateA[1] == coordinateB[1]){
    								//console.log(idA + " | " + collectedOSMDataWays[j][0]);
    								var entry = new Array(4);
    								entry[0]=idA;
    								entry[1]=collectedOSMDataWays[j][0];
    								entry[2]=coordinateA[0];
    								entry[3]= coordinateA[1];
    								collectedOSMDataNodes[counter] = new Object();
    								collectedOSMDataNodes[counter] = entry;
    								counter++;
    							}
    						})
						}
					}
				})
			}
			//console.log(collectedOSMDataNodes);
			//jetzt bringen wir die koordinaten noch in eine geeignete Form, also sie werden so multipliziert und gerundet dass sie größer als 0 und kleiner als 1000 sind
			//koordinaten befinden sich im array collectedOSMDataWays[id[x,y]typ] und collectedOSMDataNodes[idA,idB,x,y]
			/**
			var x = 0;
			var y = 0;
			for (var i = 0; i < collectedOSMDataNodes.length; ++i){
				if (i==0){
					x = collectedOSMDataNodes[i][2];
					y = collectedOSMDataNodes[i][3];
				}
				if (collectedOSMDataNodes[i][2] < x) {
					x = collectedOSMDataNodes[i][2];
				}
				if (collectedOSMDataNodes[i][3] < y){
					y = collectedOSMDataNodes[i][3];
				}
			}
			console.log("groesster wert: " + x + " " +y );
			for (var i = 0; i < collectedOSMDataNodes.length; ++i){
				if (i==0){
					x = collectedOSMDataNodes[i][2];
					y = collectedOSMDataNodes[i][3];
				}
				if (collectedOSMDataNodes[i][2] > x) {
					x = collectedOSMDataNodes[i][2];
				}
				if (collectedOSMDataNodes[i][3] > y){
					y = collectedOSMDataNodes[i][3];
				}
			}
			console.log("kleinster wert: " + x + " " +y );
			**/
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
