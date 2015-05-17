/**
 * Format for map should be:
 * UP;RIGHT;DOWN;LEFT;X;Y
 * Node identifier is the row.
 * Example
 * ;;1;120;130;
 * ;;0;120;120;
 */

Map = fuction(game) {
    this.phaser = Phaser;
}

create = function() {
    

getNodeInDirection = function(entity, direction, graph) {
    switch (direction) {
        case UP:
            return graph[entity.node][0];
        case RIGHT:
            return graph[entity.node][1];
        case LEFT:
            return graph[entity.node][2];
        case DOWN:
            return graph[entity.node][3];
        default:
            return entity.node;
    }
};
Pacman.prototype.edge = null;
var graph = [][];

createGraph = function(nodelist) {
    for ( int i = 0; i <= nodelist.length; i++ ) {
       for ( int j = 0; j <= nodelist[i].length; j++ ) {
          graph += interpolatePoints(nodelist[i][0], nodelist[i][j]);
       }
    }
}
