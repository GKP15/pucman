Pucman.GetGeoData = (function() {
    var streets = null;

    var north = null;
    var east = null;
    var south = null;
    var west = null;


    var extractStreets = function(geoData) {
        streets = [];
        var geoJSONData = osmtogeojson(geoData);
        for (var i = 0; i < geoJSONData.features.length; i++) {
            streets.push(geoJSONData.features[i].geometry.coordinates);
        }
    };

    var convertStreetsToPixel = function(width, height) {
        var widthConversion = width / (east - west);
        var heightConversion = height / (south - north);
        for (var i = 0; i < streets.length; i++) {
            for (var j = 0, len = streets[i].length; j < len; j++) {
                var point = streets[i].shift();
                point[0] = Math.round((point[0] - west) * widthConversion);
                point[1] = Math.round((point[1] - north) * heightConversion);
                if (point[0] >= 0 && point[1] >= 0 &&
                    point[0] <= width && point[1] <= height) {
                    streets[i].push(point);
                }
            }
        }
    };


    return {
        getData: function(width, height) {
            north = map.getBounds().ne.lat;
            east = map.getBounds().ne.lon;
            south = map.getBounds().sw.lat;
            west = map.getBounds().sw.lon;

            var apiUrlBase = "http://overpass-api.de/api/interpreter?data=[out:json];";
            var apiUrlData = "(way[\"highway\"][\"highway\"!=\"primary\"][\"highway\"!=\"footway\"][\"highway\"!=\"steps\"]" +
                "[\"highway\"!=\"service\"][\"highway\"!=\"construction\"][\"highway\"!=\"cycleway\"][\"highway\"!=\"path\"]" +
                "[\"highway\"!=\"elevator\"][\"area\"!=\"yes\"][\"building\"!=\"yes\"]" +
                "(" + south + "," + west + "," + north + "," + east + "););out body;>;out skel qt;";

            $.ajax({
                url: apiUrlBase + apiUrlData,
                DataType: 'json',
                async: false,
                success: function(result) {
                    extractStreets(result);
                }
            });
            convertStreetsToPixel(width, height);
            return streets;
        }
    };
})();
