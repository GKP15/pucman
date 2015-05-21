Pucman.Graph = (function() {

    var state = null;
    var map = null;
    var geoData = null;
    var cyGraph = null;
    var north = null;
    var east = null;
    var south = null;
    var west = null;
    var apiUrlBase = null;
    var apiUrlData = null;

    var getGeoData = function() {

        var result = null;
        $.ajax({
            url: apiUrlBase + apiUrlData,
            DataType: 'json',
            async: false,
            success: function(data) {
                result = data;
            }
        });
        return result;
    };

    var createCyGraph = function(result) {

        var elements = {
            edges: [],
            nodes: []
        };
        for (var i = 0; i < result.elements.length; ++i) {
            if (result.elements[i].type === "node") {
                var node = result.elements[i];
                var newNode = {
                    data: {},
                    position: {}
                };
                newNode.data.id = "" + node.id;
                newNode.position.x = node.lon;
                newNode.position.y = node.lat;
                elements.nodes.push(newNode);
            } else if (result.elements[i].type === "way") {
                var way = result.elements[i];
                var node = null;
                while (way.nodes.length > 1) {
                    node = way.nodes.pop();
                    var newWay = {
                        data: {}
                    };
                    newWay.data.id = node + "" + way.nodes[0];
                    newWay.data.source = node;
                    newWay.data.target = way.nodes[0];
                    elements.edges.push(newWay);
                }
            }
        }
        return cytoscape({
            headless: true,
            elements: elements,
            layout: {
                name: 'preset',
                positions: undefined,
                zoom: undefined,
                pan: undefined,
                fit: false,
                padding: 30,
                animate: false,
                animationDuration: 500,
                ready: undefined,
                stop: undefined
            }
        });
    };

    var convertNodeToPixel = function(node) {
        var widthConversion = state.game.width / (east - west);
        var heightConversion = state.game.height / (south - north);
        var pos = {
            x: (node.position().x - west) * widthConversion,
            y: (node.position().y - north) * heightConversion
        };
        node.position(pos);
    };

    var deleteDeadEnds = function(node) {
        if (node.degree() === 1) {
            node.remove();
            deleteDeadEnds(node.neighborhood('node[id]'));
        }
    };

    var dirAToB = function(pointA, pointB) {
        var dir = Phaser.Point.subtract(pointA, pointB);
        var dirArrow = null;
        if (dir.y < (-1 * Math.abs(dir.x))) {
            dirArrow = Phaser.DOWN;
        } else if (dir.x >= Math.abs(dir.y)) {
            dirArrow = Phaser.LEFT;
        } else if (dir.y > Math.abs(dir.x)) {
            dirArrow = Phaser.UP;
        } else if (dir.x <= (-1 * Math.abs(dir.y))) {
            dirArrow = Phaser.RIGHT;
        }
        return dirArrow;
    };

    var cleanCrossroads = function(node) {
        var neighbors = node.neighborhood('node[id]');
        var listDir = [];
        for (var i = 0, len = neighbors.length; i < len; i++) {
            var dir = dirAToB(node.position(), neighbors[i].position());
            if (listDir.indexOf(dir) === -1) {
                listDir.push(dir);
            } else {
                node.edgesWith(neighbors[i]).remove();
                deleteDeadEnds(neighbors[i]);
            }
        }
    };

    var interpolateGraph = function() {
        cyGraph.edges().forEach(function(edge) {
        	var pointList = [];
        	pointList.push(edge.source().position());
            pointList.push(edge.target().position());
            interpolatePointList(pointList);
            //wenn die kante interpoliert ist fuege sie in cyGraph ein
            createPath(pointList);
        })
    };
         
              //interpoliere jede Kante
            
            
            /*
            // wenn der knoten mehr als 2 ausgehende kanten hat
            if (startNode.degree() >= 3) {
            	
            	
            	//betrachte die nachbarschaft des knoten
                var neighbors = startNode.neighborhood('node[id]');
                //fuer jeden nachbarknoten
                for (var i = 0, len = neighbors.length; i < len; i++) {
                    var coord = [];
                    //schreib dir die position auf
                    var newPoint = new Phaser.Point(neighbors[i].position());
                    coord.push(newPoint);
                    //bis hierhin läufts
                    //den alten pfad löschen return letzter knoten (also nächste kreuzung)
                    var lastNode = removePathSaveCoor(startNode, coord);
                    //coord.push(newPoint);
                    interpolatePointList(coord);
                    coord.push();
                    //coord.shift();
                    //Wenn alles klappt, hier aus coordList wie in createCyGraph
                    //elements.node und elements.edges basteln und hinzufuegen.
                    //Wobei die aussen liegenden edges mit lastNode und startNode
                    //verbinden muessen
                    createPath(coord, startNode, lastNode);
                }
            }
            
        });*/
var createPath = function (coordList){

   	var len = coordList.length;
   	for(var i = 0; i < len ; ++i){
   		//1. schritt: neuen knoten definieren
   		if (i === 0){
   			//im ersten iterationsschritt gibt es keine source
   			//also neuen knoten erstellen und i hochsetzen
   			var id = coordList[i].x + "node" + coordList[i].y;
   			var x = 0;
   			var y = 0;
   			x += coordList[i].x;
   			y += coordList[i].y;
			++i;
			cyGraph.add({
			    group: "nodes",
			    data: { id: id },
			    position: { x: x, y: y}
			});
   		}
   		else{
   			//oldNewNode = copyNode(newNode);
   			// folgenden iterationsschritten ist source = der zuletzt eingefügte knoten
   			var lastId = id;
   			id = coordList[i].x + "node" + coordList[i].y;
   			x = 0;
   			y = 0;
   			x += coordList[i].x;
   			y += coordList[i].y;
   			cyGraph.add({
			    group: "nodes",
			    data: { id: id },
			    position: { x: x, y: y}
			});
			//console.log(newNode.position);
   		
			//neuer knoten hat koordinaten und eine id - knoten wird als neues elemnt hinzugefügt
			//zweiter schritt: neue Kante einfügen
			//kante geht von vorherigem knoten zu aktuellem knoten
   			var edgeId = lastId + "edge" + id;
	        cyGraph.add([
   			        {group: "edges", 
   			        	data: { id: edgeId, source: lastId , target: id }
   			        }
   			]);
   		}
   	}
};

var copyNode = function(original){
	var copy = {
			data: {},
			position: {}
	};
	copy.data.id = original.data.id + "";
	copy.position.x = original.position.x + 1;
	copy.position.y = original.position.y + 1;
	--copy.position.x;
	--copy.position.y;
	return copy;
}

    /*
    var createPath = function (coordList, startNode, lastNode){
    	 var newElements = {
    	            edges: [],
    	            nodes: []
    	        };
    	 var newNode = {
					data: {},
					position: {}
				};
    	 var len = coordList.length
    	for(var i = 0; i < len ; ++i){
    		//datenstruktur muss hier geändert werden. die neu einzufuegenden nodes haben keine id.
    		//deren neue id ist x-koordinate cat y-kordinate
    		//1. schritt: neuen knoten definieren
    		var x = coordList[i].x;
    		var y = coordList[i].y;
    		var id = x + "" + y;
    		if (i === 0){
    			//im ersten iterationsschritt ist source = startNode
				var oldNewNode = startNode;
    		}
    		else{
    			// folgenden iterationsschritten ist source = der zuletzt eingefügte knoten
    			oldNewNode = newNode;
    		}
    		newNode.data.id = id;
			newNode.position.x = x;
			newNode.position.y = y;
			//neuer knoten hat koordinaten und eine id - knoten wird als neues elemnt hinzugefügt
			newElements.nodes.push(newNode);
			var newWay = {
                    data: {}
                };
			//zweiter schritt: neue Kante einfügen
			//kante geht von vorherigem knoten zu aktuellem knoten
			newWay.data.id = oldNewNode.id() + "" + id;
            newWay.data.source = oldNewNode;
            newWay.data.target = newNode;
            //neue kante hat id, source und target, kann eingefügt werden
            newElements.edges.push(newWay);
            // nach dem letzten iterationsschritt muss nocch die letzte kante eingefügt werden 
        	// source = letzter hinzugefügter knoten + target = lastNode
            if( i === (len-1) ){
            	var newWay = {
                        data: {}
                    };
            	newWay.data.id = newNode.id() + "" + lastNode.id();
                newWay.data.source = newNode;
                newWay.data.target = lastNode;
                //neue kante hat id, source und target, kann eingefügt werden
                newElements.edges.push(newWay);
                // udn wenn alle drin sind, müssen diese elemente noch an cyGraph geadded werden
                cyGraph.add(newElements);
            }
    	}
    };
    */
    var removePathSaveCoor = function(node, coord) {
        var lastNode = null;
        coord.push(new Phaser.Point(node.position()));
        if (node.degree() === 1) {
        	lastNeighbor = node.neighborhood('node[id]');
            node.remove();
            removePathSaveCoor(lastNeighbor, coord);
        } else {
            lastNode = node;
            return lastNode;
        }
    };

    var interpolatePointList = function(pointList) {
        var pointListX = [];
        var pointListY = [];
        var step = 1 / spanOfPointList(pointList);
        while (pointList.length !== 0) {
            var point = pointList.shift();
            pointListX.push(point.x);
            pointListY.push(point.y);
        }
        for (i = 1; i >= 0; i -= step) {
            var pX = Phaser.Math.catmullRomInterpolation(pointListX, i);
            var pY = Phaser.Math.catmullRomInterpolation(pointListY, i);
            var nextPoint = new Phaser.Point(Math.round(pX), Math.round(pY));
            if (pointList.length === 0 || !nextPoint.equals(pointList[0])) {
                pointList.unshift(nextPoint);
            }
        }
    };

    var spanOfPointList = function(pointList) {
        var span = 0;
        for (var i = 0; i < pointList.length - 1; i++) {
            span += Phaser.Point.distance(pointList[i], pointList[i + 1]);
        }
        return span;
    };

    return {
        getGraph: function(game) {
            state = game;
            map = state.map;
            north = map.getBounds().ne.lat;
            east = map.getBounds().ne.lon;
            south = map.getBounds().sw.lat;
            west = map.getBounds().sw.lon;
            apiUrlBase = "http://overpass-api.de/api/interpreter?data=[out:json];";
            apiUrlData = "(way[\"highway\"][\"highway\"!=\"primary\"][\"highway\"!=\"footway\"][\"highway\"!=\"steps\"]" +
                "[\"highway\"!=\"service\"][\"highway\"!=\"construction\"][\"highway\"!=\"cycleway\"][\"highway\"!=\"path\"]" +
                "[\"highway\"!=\"elevator\"][\"area\"!=\"yes\"][\"building\"!=\"yes\"][\"highway\"!=\"bridleway\"]" +
                "[\"highway\"!=\"raceway\"][\"highway\"!=\"track\"][\"highway\"!=\"trunk\"][\"highway\"!=\"tertiary_link\"]" +
                "[\"highway\"!=\"secondary_link\"]" +
                "(" + south + "," + west + "," + north + "," + east + "););out body;>;out skel qt;";
            geoData = getGeoData();
            cyGraph = createCyGraph(geoData);
            cyGraph.nodes().forEach(function(ele) {
                deleteDeadEnds(ele);
            });
            cyGraph.nodes().forEach(function(ele) {
                cleanCrossroads(ele);
            });
            cyGraph.nodes().forEach(function(ele) {
                convertNodeToPixel(ele);
            });
            interpolateGraph();
            state.graphReady = true;
            return cyGraph;
        }
    };
})();
