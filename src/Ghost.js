Pucman.Ghost = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key, 0);
    this.anchor.set(0.5);
    this.position = node.position();
    this.node = node;
    this.lastNode = node;
    this.direction = Phaser.LEFT;
    this.debugCounter = 0;
    this.score = 0;
};

Pucman.Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Pucman.Ghost.constructor = Pucman.Ghost;

/**
 * updates the position
 */
Pucman.Ghost.prototype.update = function() {

    this.move(this.getDir());
};

/**
 * gets the direction (random)
 * @return current direction
 */
Pucman.Ghost.prototype.getDir = function() {
    
    if(Math.random() * 10 < 2) {
        return Math.floor(Math.random() * 4);
    }
    
}; 

/**
 * moves the ghost
 * @param the key which is pressed
 */
Pucman.Ghost.prototype.move = function(pressedKey) {
    var nextDir = 0;
    if (this.getNodeInDir(pressedKey) !== undefined) {
        nextDir = pressedKey;
    } else {
        var numCon = 0;
        for (var i = 1; i < 5; i++) {
            numCon += (this.getNodeInDir(i) !== undefined) ? 1 : 0;
        }
        switch (numCon) {
            case 2:
                for (i = 1; i < 5; i++) {
                    if (this.getNodeInDir(i) !== undefined &&
                        !this.getNodeInDir(i).same(this.lastNode)) {
                        nextDir = i;
                    }
                }
                break;
            case 1:
            case 3:
            case 4:
                if (this.getNodeInDir(this.direction) !== undefined) {
                    nextDir = this.direction;
                }
                break;
        }
    }
    this.lastNode = this.node;
    if (nextDir !== 0) {
        this.node = this.getNodeInDir(nextDir);
        this.direction = nextDir;
        this.position = this.node.position();
    }
};

/**
 * searches for the next node at given direction
 * @param direction
 * @return next node at this direction
 */
Pucman.Ghost.prototype.getNodeInDir = function(dir) {
    var nodeInDir;
    var neighbors = this.node.neighborhood('node[id]');
    for (var i = 0; i < neighbors.length; i++) {
        if (Pucman.Graph.dirAToB(this.node.position(),
                neighbors[i].position()) === dir) {
            nodeInDir = neighbors[i];
        }
    }
    return nodeInDir;
};
