Pucman.Graph = (function() {

    var opposites = [
        Phaser.NONE,
        Phaser.RIGHT,
        Phaser.LEFT,
        Phaser.DOWN,
        Phaser.UP
    ];

    var connectPointList = function(pointList) {
        for (i = 0; i < pointList.length - 1; i++) {
            connectTwoPoints(pointList[i], pointList[i + 1]);
        }
    };

    var interpolateStreet = function(street) {
        startPoint = street.shift();
        street.unshift(startPoint.clone());
        endPoint = street.pop();
        street.push(endPoint.clone());
        interpolatePointList(street);
        street.shift();
        street.unshift(startPoint);
        street.pop();
        street.push(endPoint);
        connectPointList(street);
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

    var connectTwoPoints = function(pointA, pointB) {
        var dir = Phaser.Point.subtract(pointA, pointB);
        if (dir.y < (-1 * Math.abs(dir.x))) {
            pointA[Phaser.DOWN] = pointB;
            pointB[Phaser.UP] = pointA;
        } else if (dir.x >= Math.abs(dir.y)) {
            pointA[Phaser.LEFT] = pointB;
            pointB[Phaser.RIGHT] = pointA;
        } else if (dir.y > Math.abs(dir.x)) {
            pointA[Phaser.UP] = pointB;
            pointB[Phaser.DOWN] = pointA;
        } else if (dir.x <= (-1 * Math.abs(dir.y))) {
            pointA[Phaser.RIGHT] = pointB;
            pointB[Phaser.LEFT] = pointA;
        }
    };

    var connectStreets = function(streets) {
        for (var street = 0; street < streets.length; street++) {
            for (var point = 0; point < streets[street].length; point++) {
                isPointJunction(streets[street][point], streets);       
            }
        }
    };

    var isPointJunction = function(pointToCheck, streets) {
        for (var street = 0; street < streets.length; street++) {
            for (var point = 0; point < streets[street].length; point++) {
                if (pointToCheck.equals(streets[street][point])) {
                    createJunction(pointToCheck, streets[street][point]);
                }
            }
        }
    };

    var createJunction = function(pointA, pointB) {
        // dir is short for Phaser directions
        for (var dir = 1; dir < 5; dir++) {
            if (pointA[dir] === undefined && pointB[dir] !== undefined) {
                pointA[dir] = pointB[dir];
                pointA[dir][opposites[dir]] = pointA;
            }
        }
    };

    /* 
     * Delete streets who are involved in a junction between more than four 
     * streets.
     * Delete streets who connect to junction from the same direction as another
     * street.
     */
    var clearStreets = function(streets) {
        for (var counter = 0, len = streets.length; counter < len; counter++) {
            var street = streets.shift();
            var isIllegalStreet = false;
            for (var point = 0; point < street.length; point++) {
                isIllegalStreet = isIllegalStreet ||
                    isPointIllegal(streets, street[point]);
            }
            if (!isIllegalStreet) {
                streets.push(street);
            }
        }
    };

    var isPointIllegal = function(streets, pointToCheck) {
        var numberJunctions = 0;
        var isIllegal = false;
        for (var street = 0; street < streets.length; street++) {
            for (var point = 0; point < streets[street].length; point++) {
                if (pointToCheck.equals(streets[street][point])) {
                    isIllegal = isIllegal ||
                        shareConInDir(pointToCheck, streets[street][point]);
                    numberJunctions++;
                }
            }
        }
        if (numberJunctions > 3) {
            return true;
        } else {
            return isIllegal;
        }
    };

    var shareConInDir = function(pointA, pointB) {
        if (pointA == pointB) {
            return true;
        }
        var shareCon = false;
        // dir is short for Phaser directions
        for (var dir = 1; dir < 5; dir++) {
            if (pointA[dir] !== undefined && pointB[dir] !== undefined) {
                shareCon = true;
            }
        }
        return shareCon;
    };

    var convertToPointList = function(street) {
        for (var i = 0; i < street.length; i++) {
            var pointArray = street.shift();
            street.push(new Phaser.Point(pointArray[0], pointArray[1]));
        }
    };

    return {
        convertToPaths: function(streets) {
            for (var i = 0; i < streets.length; i++) {
                convertToPointList(streets[i]);
                connectPointList(streets[i]);
            }
            clearStreets(streets);
            connectStreets(streets);
            for (i = 0; i < streets.length; i++) {
                interpolateStreet(streets[i]);
            }
        }
    };
})();
