Pucman.Graph = (function() {

    var connectPointList = function(pointList) {
        for (i = 0; i < pointList.length - 1; i++) {
            connectTwoPoints(pointList[i], pointList[i + 1]);
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
        for (i = 0; i <= 1; i += step) {
            var pX = Phaser.Math.catmullRomInterpolation(pointListX, i);
            var pY = Phaser.Math.catmullRomInterpolation(pointListY, i);
            pointList.push(new Phaser.Point(pX, pY));
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
        var dir = Phaser.Point.subtract(pointA,  pointB);
        if (dir.y < (-1 * Math.abs(dir.x))) {
            pointA.up = pointB;
            pointB.down = pointA;
        } else if (dir.x > Math.abs(dir.y)) {
            pointA.right = pointB;
            pointB.left = pointA;
        } else if (dir.y > Math.abs(dir.x)) {
            pointA.down = pointB;
            pointB.up = pointA;
        } else if (dir.x < (-1 * Math.abs(dir.y))) {
            pointA.left = pointB;
            pointB.right = pointA;
        }
    };

    return {
        createGraph : function(pointList) {
            interpolatePointList(pointList);
            connectPointList(pointList);
        },
        test : function(game) {
            game.arsch = null;
        }
    };
})();

