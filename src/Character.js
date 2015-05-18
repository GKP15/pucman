Pucman.Character = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key);
    //this.anchor.set(0.5);
    this.position = node;
    this.lastPosition = node;
    this.direction = Phaser.LEFT;
    this.debugCounter = 0;
};

Pucman.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pucman.Character.constructor = Pucman.Character;

Pucman.Character.prototype.update = function() {
    this.debugCounter++;
    if (this.debugCounter > 20) {
        this.move();
        this.debugCounter = 0;
    }
};

Pucman.Character.prototype.move = function() {
    var nextDir = 0;
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

    if (this.position[pressedKey] !== undefined) {
        nextDir = pressedKey;
    } else {
        var numCon = 0;
        for (var i = 1; i < 5; i++) {
            numCon += (this.position[i] !== undefined) ? 1 : 0;
        }
        switch (numCon) {
            case 2:
                for (i = 1; i < 5; i++) {
                    if (this.position[i] !== undefined &&
                        !this.position[i].equals(this.lastPosition)) {
                        nextDir = i;
                    }
                }
                break;
            case 1:
            case 3:
            case 4:
                if (this.position[this.direction] !== undefined) {
                    nextDir = this.direction;
                }
                break;
        }
    }
    this.lastPosition = this.position;
    if (nextDir !== 0) {
        this.position = this.position[nextDir];
        this.direction = nextDir;
    }
};
