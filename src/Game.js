Pucman.Game = function(game) {
    this.graphBitmap = null;
    this.pucman = null;
    this.ghosts = [];
    this.ghostPinky = null;
    this.graph = null;
    this.dots = null;
    this.maxScore = null;
    this.score = 0;

    var opposites = [
        Phaser.NONE,
        Phaser.RIGHT,
        Phaser.LEFT,
        Phaser.DOWN,
        Phaser.UP
    ];

};

Pucman.Game.prototype = {
	
	/**
	 * initialisation of the state
	 * @param graph of the streets
     */
    init: function(graph) {
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
		this.load.spritesheet('ghost', 'resources/ghost.png', 32, 32);
        this.load.spritesheet('dot', 'resources/dot.png', 10, 10);

        Pucman.Interface.preloadInterface(this);
    },
	
	/**
	 * caleld on creation of the state
	 */
    create: function() {
        Pucman.Interface.createInterface(this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphBitmap = this.add.bitmapData(
            this.game.width, this.game.height);
        this.graphBitmap.addToWorld();
        this.graphBitmap.clear();
        var bitmap = this.graphBitmap;
        var count = 0;
        this.dots = this.add.group();
        var dots = this.dots;
        this.graph.nodes().forEach(function(node) {
            ++count;
            if (count % 10 === 0) {
                var dot = dots.create(
                    node.position().x,
                    node.position().y,
                    'dot'
                );
                dot.anchor.set(0.5, 0.5);
                node.data('dot', dot);
            }
			bitmap.rect(
                node.position().x - 6,
                node.position().y - 6,
                12, 1, 'rgb(40, 15, 220)'
            );
			bitmap.rect(
                node.position().x - 6,
                node.position().y - 6,
                1, 12, 'rgb(40, 15, 220)'
            );
			bitmap.rect(
                node.position().x + 6,
                node.position().y - 6,
                1, 12, 'rgb(40, 15, 220)'
            );
			bitmap.rect(
                node.position().x - 6,
                node.position().y + 6,
                12, 1, 'rgb(40, 15, 220)'
            );
        });
		this.graph.nodes().forEach(function(node) {
			bitmap.rect(
                node.position().x - 5,
                node.position().y - 5,
                10, 10, 'rgba(0, 0, 0, 0.5)'
            );
		});
        this.pucman = new Pucman.Character(
            this.game, "pucman", this.graph.nodes()[110]);
        this.add.existing(this.pucman);

        this.ghosts = this.add.group();
        ghostPinky = new Pucman.Ghost(
            this.game, "ghost", this.graph.nodes()[10]);
        
        this.ghosts.add(ghostPinky);
	    
    },
	
	/**
	 * updates the state
	 */
    update: function() {
        this.eat();
        if ( this.pucman.lives === 0 ){
            this.gameOver();
        }
    },
	
	/**
	 * eating of pucman by a ghost
	 */
    eat: function() {
        if(this.pucman.invulnerable) return;
		for (var i = 0; i < this.ghosts.length; i++) {
            if (this.pucman.node === this.ghosts.getChildAt(i).node) {
                this.pucman.lives--;
                this.livesText.setText('Lives: ' + this.pucman.lives);
				//this.pucman.animations.play('flashing');
				this.pucman.invulnerable = true;
				this.game.time.events.add(Phaser.Timer.SECOND * 3, function() {
				    this.pucman.invulnerable = false;
				    //this.pucman.animations.stop('flashing', true);
				}, this)
            }
        }
    },
    
	/**
	 * end of game (win or lose)
	 */
    gameOver: function() {
        Menu.initMap();
        this.destroy();
    },
	
	destroy: function() {
	    window.location.reload();
    },
	
	getPucmanNode: function() {
        return this.pucman.node;
    }

};
