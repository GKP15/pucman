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
        cyGraph.nodes().forEach(function(ele) {
            var startNode = ele;
            if (startNode.degree() >= 3) {
                var neighbors = startNode.neighborhood('node[id]');
                for (var i = 0, len = neighbors.length; i < len; i++) {
                    var coord = [];
                    coord.push(new Phaser.Point(node.position()));
                    var lastNode = null;
                    removePathSaveCoor(startNode, coord, lastNode);
                    coord.push(new Phaser.Point(node.position()));
                    interpolatePointList(coord);
                    //Wenn alles klappt, hier aus coord wie in createCyGraph
                    //elements basteln und hinzufuegen
                }
            }
        });
    };

    var removePathSaveCoor = function(node, coord, lastNode) {
        coord.push(new Phaser.Point(node.position()));
        if (node.degree() === 1) {
            node.remove();
            removePathSaveCoor(node.neighborhood('node[id]', coord, lastNode));
        } else {
            lastNode = node;
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
