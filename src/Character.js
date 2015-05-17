Pucman.Character = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key);
    //this.anchor.set(0.5);
    this.position = node;
    this.lastPosition = node;
    this.direction = Phaser.LEFT;
};

Pucman.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pucman.Character.constructor = Pucman.Character;

Pucman.Character.prototype.update = function() {
    this.move();
};

Pucman.Character.prototype.move = function() {
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
        this.lastPosition = this.position;
        this.direction = pressedKey;
        this.position = this.position[pressedKey];
    } else {
        this.nextPosition();
    }
};

Pucman.Character.prototype.nextPosition = function() {
    var numCon = 0;
    for (var dir = 1; dir < 5; dir++) {
        numCon += (this.position[dir] !== undefined) ? 1 : 0;
    }
    console.log(numCon);    
    switch (numCon) {
        case 2:
            for (var i = 1; i <= 4; i++) {
                if (this.position[i] !== undefined &&
                    this.position[i] != this.lastPosition) {
                    this.lastPosition = this.position;
                    this.direction = i;
                    this.position = this.position[i];
                }
            }
            break;
        case 1:
        case 3:
        case 4:
            if (this.position[this.direction] !== undefined) {
                this.lastPosition = this.position;
                this.position = this.position[this.direction];
            } else {
                this.lastPosition = this.position;
            }
            break;
    }
};
