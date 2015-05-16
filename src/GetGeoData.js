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
        var widthConversion =  width / (east - west);
        var heightConversion = height / (south - north);
        for (var i = 0; i < streets.length; i++) {
            for (var j = 0; j < streets[i].length; j++) {
                var test = streets[i][j][0];
                streets[i][j][0] = (streets[i][j][0] - west) * widthConversion;
                streets[i][j][1] = (streets[i][j][1] - north) * heightConversion;
            }
        }
    };

    var toPixelPoint = function(pX, pY, width, height) {
        pX = (pX - west) * width / (east - west);
        pY = (pY - north) * height / (south - north);
    };

    return {
        getData: function(width, height) {
            //var east = map.getCenter().lon + 0.00593268394;
            //var north = map.getCenter().lat + 0.002944353 + 0.002944353;
            //var south = map.getCenter().lat;
            //var west = map.getCenter().lon - 0.00593268394;

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
