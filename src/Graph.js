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
                var source = null;
                while (way.nodes.length > 1) {
                    source = way.nodes.shift();
                    var newWay = {
                        data: {}
                    };
                    newWay.data.id = source + " " + way.nodes[0];
                    newWay.data.source = source;
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
            var nextNode = node.neighborhood('node[id]');
            node.connectedEdges().remove();
            node.remove();
            deleteDeadEnds(nextNode);
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
            createPath(pointList, edge);
            edge.remove();
        });
    };

    var createPath = function(coordList, edge) {
        coordList.pop();
        coordList.shift();
        idSource = edge.source().id();
        idTarget = null;
        for (var i = 0; i <= coordList.length; ++i) {
            if (i < coordList.length) {
                idTarget = edge.id() + '.n' + i;
                var x = 0;
                var y = 0;
                x += coordList[i].x;
                y += coordList[i].y;
                cyGraph.add({
                    group: "nodes",
                    data: {
                        id: idTarget
                    },
                    position: {
                        x: x,
                        y: y
                    }
                });
            } else {
                idTarget = edge.target().id();
            }
            var edgeId = edge.id() + '.e' + i;
            cyGraph.add({
                group: "edges",
                data: {
                    id: edgeId,
                    source: idSource,
                    target: idTarget
                }
            });
            idSource = idTarget;
        }
    };

    var copyNode = function(original) {
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
    };


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
        dirAToB: dirAToB,
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

            cyGraph.nodes().forEach(function(ele) {
                if (ele.degree() === 0) {
                    ele.remove();
                }
            });
            interpolateGraph();
            state.graphReady = true;
            return cyGraph;
        }
    };
})();
