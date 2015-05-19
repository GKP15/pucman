Pucman.GetGeoData = (function() {
    var streets = null;

    var north = null;
    var east = null;
    var south = null;
    var west = null;
	var elements = {};

    var convertToGraph = function(result) {

    	elements.edges = [];
    	elements.nodes = [];
    	
    	
    	for(var i = 0; i < result.elements.length ; ++i){
    		if(result.elements[i].type === "node"){
    			var node = result.elements[i];
    			var newNode = {data:{},position:{}};
    			newNode.data.id = "" + node.id;
    			newNode.position.x = node.lon;
    			newNode.position.y = node.lat;
    			elements.nodes.push(newNode);
    		}
    		else if(result.elements[i].type === "way"){
    			var way = result.elements[i];
    			var node = null;
    			while ( way.nodes.length > 1 ){
    				node = way.nodes.pop();
	    			var newWay = {data:{}};
	    			newWay.data.id = node + "" + way.nodes[0];
	    			newWay.data.source = node;
	    			newWay.data.target = way.nodes[0];
	    			elements.edges.push(newWay);
    			}
    		}
    	}
    	
    	 cy = cytoscape({
             ready: function() {
                 console.log('ready');
             },
             headless: true,
             elements: elements
         });
    	 return cy;
    };


    var extractStreets = function(geoData) {
        streets = [];
        var geoJSONData = osmtogeojson(geoData);
        for (var i = 0; i < geoJSONData.features.length; i++) {
            streets.push(geoJSONData.features[i].geometry.coordinates);
        }
    };

    var convertStreetsToPixel = function(streets, width, height) {
        var widthConversion = width / (east - west);
        var heightConversion = height / (south - north);
        for (var i = 0; i < streets.length; i++) {
            for (var j = 0, len = streets[i].length; j < len; j++) {
                var point = streets[i].shift();
                point.x = Math.round((point.x - west) * widthConversion);
                point.y = Math.round((point.y - north) * heightConversion);
                streets[i].push(point);
            }
        }
    };

    var removeNode = function(node) {
    	//wenn der knoten keine nachbarn mehr hat, töte ihn
    	if (node.degree(false) === 0){
			node.remove();
			console.log(node);
    	}
    	//wenn der knoten noch einen nachbarn hat
    	else if(node.degree(false) === 1){
    		//suche den einen Nachbarn
    		//rufe für den nachbarn removeNode ( cy, node) auf und töte den knoten selbst
        	var edges = node.connectedEdges();
        	var nodeSource = edges[0].source();
        	var nodeTarget = edges[0].target();
        	if (nodeSource === node){
    			nodeSource.remove();
    			removeNode(nodeTarget);
        	}
        	else {
        		nodeTarget.remove();
    			removeNode(nodeSource);
        	}
    	}
    };

    return {
        convertStreetsToPixel: function(streets, width, height) {
            convertStreetsToPixel(streets, width, height);
        },
        getData: function(width, height) {
            //grenzen dynamisch eingrenzen
            north = map.getBounds().ne.lat;
            east = map.getBounds().ne.lon;
            south = map.getBounds().sw.lat;
            west = map.getBounds().sw.lon;

            var apiUrlBase = "http://overpass-api.de/api/interpreter?data=[out:json];";
            var apiUrlData = "(way[\"highway\"][\"highway\"!=\"primary\"][\"highway\"!=\"footway\"][\"highway\"!=\"steps\"]" +
                "[\"highway\"!=\"service\"][\"highway\"!=\"construction\"][\"highway\"!=\"cycleway\"][\"highway\"!=\"path\"]" +
                "[\"highway\"!=\"elevator\"][\"area\"!=\"yes\"][\"building\"!=\"yes\"][\"highway\"!=\"bridleway\"]" +
                "[\"highway\"!=\"raceway\"][\"highway\"!=\"track\"][\"highway\"!=\"trunk\"][\"highway\"!=\"tertiary_link\"]" +
                "[\"highway\"!=\"secondary_link\"]" +
                "(" + south + "," + west + "," + north + "," + east + "););out body;>;out skel qt;";

            $.ajax({
                url: apiUrlBase + apiUrlData,
                DataType: 'json',
                async: false,
                success: function(result) {
                	 cy = convertToGraph(result);
                     //schritt 3: sackgassen entfernen
                     //node nehmen, schauen ob er weniger als 2 nachbarn hat. node entfernen
                     //iteriert über alle knoten des graphen
                     cy.nodes().forEach(function( ele ){
                 		//wenn der Grad des Knoten kleiner als 2 (weniger als 2 nachbarknoten) wird dieser knoten aus dem graphen entfernt
                 		if(ele.degree(false) < 2){
                 			removeNode(ele);
                 		}
                     });
                }
            });
            
            //graph ist erstellt.
            //schritt 1: strassen die aus der gleichen richtung kommen entfernen
            //schritt 2: strassen entfernen, wenn sie an kreuzungen liegen die mehr als 4 nachbarn haben (sollte schon erledigt sein da schritt 1
            

            
           
             //convertStreetsToPixel(width, height);
            //return streets;
        }
    };
})();
