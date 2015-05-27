Pucman.Game = function(game) {
    this.graphBitmap = null;
    this.pucman = null;
    this.ghosts = [];
    this.ghostPinky = null;
    this.graph = null;
    this.dots = null;
    this.lives = 3;
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
        this.load.spritesheet('pucman', 'resources/pucman2.png', 32, 32);
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
        this.graph.nodes().forEach(function(ele) {
            ++count;
            if (count % 10 === 0) {
                var dot = dots.create(
                    ele.position().x,
                    ele.position().y,
                    'dot'
                );
                dot.anchor.set(0.5, 0.5);
                ele.data('dot', dot);
            }
            bitmap.rect(
                ele.position().x - 5,
                ele.position().y - 5,
                10, 10, 'rgba(27, 247, 181, 0.2)'
            );
        });
        this.pucman = new Pucman.Character(
            this, "pucman", this.graph.nodes()[110]);
        this.add.existing(this.pucman);

        this.ghosts = this.add.group();
        ghostPinky = new Pucman.Ghost(
            this, "ghost", this.graph.nodes()[10]);
        
        this.ghosts.add(ghostPinky);
    },
	
	/**
	 * updates the state
	 */
    update: function() {
        this.eat();
        if ( this.lives === 0 ){
            this.gameOver();
        }
    },
	
	/**
	 * eating of pucman by a ghost
	 */
    eat: function() {
        for (var i = 0; i < this.ghosts.length; i++) {
            if (this.pucman.node === this.ghosts.getChildAt(i).node) {
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
            }
        }
    },
    
	/**
	 * end of game (win or lose)
	 */
    gameOver: function() {
        Menu.initMap();
        this.destroy();
    }



};
