Pucman.Game = function(game) {
    this.graphBitmap = null;
    this.pucman = null;
    this.graph = null;

    var opposites = [
        Phaser.NONE,
        Phaser.RIGHT,
        Phaser.LEFT,
        Phaser.DOWN,
        Phaser.UP
    ];

};

Pucman.Game.prototype = {

    init: function(graph) {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.graph = graph;

    },

    preload: function() {
        this.load.spritesheet('pucman', 'resources/pucman.png', 32, 32);
	    this.load.image('dot', 'ressources/a92dd25b2c280345f10be915553a2efd.png',3,3);

        //Pucman.Interface.preloadInterface(this);
    },

    create: function() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphBitmap = this.add.bitmapData(
            this.game.width, this.game.height);
        this.graphBitmap.addToWorld();
        this.graphBitmap.clear();
        var bitmap =  this.graphBitmap;
        var count = 0;
        dots = this.add.group();
        this.graph.nodes().forEach(function(ele) {
        	++count;
        	if ( count%30 == 0 ){
        		ele.grabify();
        		dots.create(ele.position.x, ele.position.y, 'dot');
        	}
        	else{
        		bitmap.rect(
        				ele.position().x, 
        				ele.position().y, 
        				4, 4, 'rgba(0, 0, 0, 1)'
        				);
        		ele.ungrabify();
        	}
        });
        pucman = new Pucman.Character(
            this, "pucman", this.graph.nodes()[110]);
        this.add.existing(pucman);
        //Pucman.Interface.create(this);
    },

    update: function() {}

};
