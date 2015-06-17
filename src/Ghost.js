Pucman.Ghost = function(game, key, node) {

    Phaser.Sprite.call(this, game, 100, 100, key, 0);
    this.anchor.set(0.5);
    this.position = Phaser.Point.parse(node.position());
    this.jail = this.position.clone();
    this.jailNode = node;
    this.node = node;
    this.lastNode = node;
    this.direction = Phaser.LEFT;
    this.stateGame = game.state.getCurrentState();
    this.frozen = false;
    this.frozenTime = 5000;
    this.stateGame = game.state.getCurrentState();
    this.getDir = this.prototype[key];
};

Pucman.Ghost.prototype = Object.create(Pucman.Character.prototype);
Pucman.Ghost.constructor = Pucman.Ghost;

/**
 * updates the position
 */
Pucman.Ghost.prototype.update = function() {

    if (!this.frozen) {
        this.move(this.getDir(this.stateGame));
    }
};

Pucman.Ghost.prototype.pinky = function(stateGame) {
    if ( stateGame.pucman.killing) {
        return Pucman.Graph.dirAToB( stateGame.pucman.position, this.position);
    }
    else if (this.node.neighborhood('node[id]').length > 2) {

        // if pucman has a distance of more than sqrt(15000) the ghost targets him
        function calcDir(ghostPos, pucmanPos) {
            if ((ghostPos.x - pucmanPos.x) * (ghostPos.x - pucmanPos.x) + (ghostPos.y - pucmanPos.y) * (ghostPos.y - pucmanPos.y) > 15000) {
                return Pucman.Graph.dirAToB(ghostPos, pucmanPos);
            }

            return Math.floor(Math.random() * 4);
        }

        var newDir = calcDir(this.node.position(), this.stateGame.getPucmanNode().position());
        //if the ghost runs against a wall, change direction
        while (typeof this.getNodeInDir(newDir) == 'undefined') {
            newDir = Math.floor(Math.random() * 4);
        }

        return newDir;

    } else {
        return this.direction;
    }
};


Pucman.Ghost.prototype.die = function(stateGame) {
    this.position = this.jail;
    this.node = this.jailNode;
    this.lastNode = this.jailNode;
    this.frozen = true;
    stateGame.game.time.events.add(this.frozenTime, function() {
        this.frozen = false;
    }, this);
};
