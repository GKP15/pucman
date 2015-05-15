Pucman.Character = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key);
    //this.anchor.set(0.5);
    this.position = node;
};

Pucman.Character.prototype = Object.create(Phaser.Sprite.prototype);
Pucman.Character.constructor = Pucman.Character;

Pucman.Character.prototype.update = function() {
   this.move(); 
};

Pucman.Character.prototype.move = function() {
    if (this.game.cursors.left.isDown && this.position[Phaser.LEFT]) {
        this.position = this.position[Phaser.LEFT];
    } else if (this.game.cursors.right.isDown && this.position[Phaser.RIGHT]) {
        this.position = this.position[Phaser.RIGHT];
    } else if (this.game.cursors.up.isDown && this.position[Phaser.UP]) {
        this.position = this.position[Phaser.UP];
    } else if (this.game.cursors.down.isDown && this.position[Phaser.DOWN]) {
        this.position = this.position[Phaser.DOWN];
    }
};
