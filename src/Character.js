Pucman.Character = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key, 0);
    this.anchor.set(0.5);
    this.position = node.position();
    this.node = node;
    this.lastNode = node;
    this.direction = Phaser.LEFT;
    this.debugCounter = 0;
    this.score = 0;
	this.lives = 3;
};

Pucman.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pucman.Character.constructor = Pucman.Character;

/**
 * updates the position and handles eating
 */
Pucman.Character.prototype.update = function() {

    this.move(this.getDir());
    this.eatDot();
};

/**
 * gets the direction from keyboard input
 * @return current direction
 */
Pucman.Character.prototype.getDir = function() {
    var pressedKey = null;
    if (this.game.cursors.up.isDown) {
        pressedKey = Phaser.UP;
    }
    if (this.game.cursors.right.isDown) {
        pressedKey = Phaser.RIGHT;
    }
    if (this.game.cursors.down.isDown) {
        pressedKey = Phaser.DOWN;
    }
    if (this.game.cursors.left.isDown) {
        pressedKey = Phaser.LEFT;
    }
    return pressedKey;
}; 

/**
 * moves pucman
 * @param the key which is pressed
 */
Pucman.Character.prototype.move = function(pressedKey) {
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
Pucman.Character.prototype.getNodeInDir = function(dir) {
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

/**
 * pucman eats a dot and get points
 */
Pucman.Character.prototype.eatDot = function() {
    var dot = this.node.data('dot');
    if (dot !== undefined) {
        this.game.dots.remove(dot);
        this.node.removeData();
        this.game.score++;
        Pucman.Interface.eatDot(this.game);
        if(this.game.dots.length == 0) {
            this.game.gameOver();
        }
    }
};
