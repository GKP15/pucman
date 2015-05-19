Pucman.Graph = (function() {

    var game = null;
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
            elements: elements
        });
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

    return {
        getGraph: function(game) {
            this.game = game;
            map = game.map;
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
            game.graphReady = true;
            return cyGraph;
        }
    };
})();
