Pucman.GetGeoData = (function() {
	var getDataWith = function(map) {
		var allData = new Array(2);
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
	    	/*auswerten der geoJSON datei die zurueckgegeben wird
	    		-> parsen - wege notieren, kreuzungen notieren
	    		! rechnet auch gleich in pixel um, so dass die kordinaten zwischen 0 und 1000 liegen */
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
	        								//die geocoordinaten werden in pixel umgerechnet
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
	        //in collectedOSMDataWays stehen die wege drinne, in der form [id(int),[koordinateOstWest(int),KoordinateNordSued(int)],typ(String)]
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
			allData[0] = collectedOSMDataWays;
			allData[1] = collectedOSMDataNodes;
			return allData;
			//collectedOSMDataNodes stehen die kreuzungen drinne(Array von ints) [idWegA,idWegB,KoordinateOstWest,KoordinateNordSued]
			//console.log(collectedOSMDataNodes);
			//koordinaten befinden sich im array collectedOSMDataWays[id[x,y]typ] und collectedOSMDataNodes[idA,idB,x,y]
	    })
	    .fail(function( jqxhr, textStatus, error ) {
	        console.log( "Request Failed: " + textStatus);
	    }); 
	};
	
    return {
        getData : function(map) {
        	getDataWith(map)
        	}
    };
})();


