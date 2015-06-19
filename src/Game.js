Pucman.Game = function(game) {
    this.id = null;
    this.graphBitmap = null;
    this.pucman = null;
    this.ghosts = [];
    this.ghostPinky = null;
    this.graph = null;
    this.dots = null;
    this.pPills = null;
    this.maxScore = null;
    this.score = 0;
    this.killGhostScore = 100;
    this.pPillScore = 50;
    this.killDistance = 4;
};

Pucman.Game.prototype = {

    /**
     * initialisation of the state
     * @param graph of the streets
     */
    init: function(graph, id) {
        this.id = id;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.graph = graph;

    },

    /**
     * preloads data for the state
     */
    preload: function() {
        this.load.spritesheet('pucman', 'resources/pucman.png', 28, 28);
        this.load.spritesheet('pinky', 'resources/ghost.png', 27, 27);
        this.load.spritesheet('dot', 'resources/dot.png', 9, 9);
        //this.load.spritesheet('ppill', 'resources/dot.png', 18, 18);

        Pucman.Interface.preloadInterface(this);
    },

    /**
     * called on creation of the state
     */
    create: function() {
        Pucman.Interface.createInterface(this.game);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphBitmap = this.add.bitmapData(
            this.game.width, this.game.height);
        this.graphBitmap.addToWorld();
        this.graphBitmap.clear();
        this.dots = this.add.group();
        this.pPills = this.add.group();
        var stateGame = this;
        this.graph.nodes().forEach(function(node, count) {
            if (count % 300 === 0) {
                var pPill = stateGame.pPills.create(
                    node.position().x, node.position().y, 'ppill'
                );
                pPill.anchor.set(0.5, 0.5);
                node.data('ppill', pPill);
            } else if (count % 10 === 0) {
                var dot = stateGame.dots.create(
                    node.position().x, node.position().y, 'dot'
                );
                dot.anchor.set(0.5, 0.5);
                node.data('dot', dot);
            }
            stateGame.graphBitmap.rect(
                node.position().x - 7,
                node.position().y - 7,
                14, 14, 'rgb(40, 15, 220)'
            );
        });
        this.graph.nodes().forEach(function(node) {
            stateGame.graphBitmap.rect(
                node.position().x - 5,
                node.position().y - 5,
                10, 10, 'rgba(0, 0, 0, 1)'
            );
        });
        this.pucman = new Pucman.Character(
            this.game, "pucman", this.graph.nodes()[Math.floor(Math.random() * this.graph.nodes().length)]);
        this.add.existing(this.pucman);

        this.ghosts = this.add.group();
        ghostPinky = new Pucman.Ghost(
            this.game, "pinky", this.graph.nodes()[Math.floor(Math.random() * this.graph.nodes().length)]);

        this.ghosts.add(ghostPinky);

        this.game.paused = true;
        Pucman.Interface.showMessage(this.game, 'Click anywhere to start');

        //handles unpause event
        function messageScreenHandler(game) {
            if (game.paused) {
                game.state.getCurrentState().msgLabel.destroy();
                game.paused = false;
            }
        }

        //help function to pass a reference of a function with parameters
        function partial(func /*, 0..n args */ ) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function() {
                return func.apply(this, args);
            };
        }

        //add input handler
        this.game.input.onDown.add(partial(messageScreenHandler, this.game), self);
    },

    /**
     * updates the state
     */
    update: function() {
        this.collision();
        if (this.pucman.lives <= 0) {
            this.gameOver(false);
        }
    },

    /**
     * checks if pucman is hit by a ghost
     */
    collision: function() {
        for (var i = 0; i < this.ghosts.length; i++) {
            var ghost = this.ghosts.getChildAt(i);
            if (this.pucman.position.distance(ghost.position) <= this.killDistance) {
                if (this.pucman.killing){
                    ghost.die(this); 
                }
                else if (!this.pucman.invulnerable) {
                    this.pucman.die(this);
                }
            }
        }
    },

    /**
     * end of game (win or lose)
     */
    gameOver: function(win) {

        this.game.state.start('Highscore', true, false, this.score, this.id, win);

    },

    /**
     * get the node of pucman
     * @return node of pucman
     */
    getPucmanNode: function() {
        return this.pucman.node;
    }

};
