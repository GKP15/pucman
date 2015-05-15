var Pucman = {};

Pucman.Game = function(game) {
    this.bmd = null;
    this.pucman = null;
    this.graph = [new Phaser.Point(0, 0),
        new Phaser.Point(200, 150),
        new Phaser.Point(300, 150),
        new Phaser.Point(200, 550),
        new Phaser.Point(1000, 1000)
    ];
};

Pucman.Game.prototype = {

    /**
     * initialisation of the game state
     */
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    },

    /**
     * preload of the game state
     */
    preload: function() {
        //Bilder, spritesheet und tilemap laden
        this.load.spritesheet('pacman', 'resources/pacman.png', 32, 32);
        Pucman.Interface.preloadInterface();
    },

    /**
     * creation of the game state
     */
    create: function() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.stage.backgroundColor = '#0FFF00';
        Pucman.Interface.createInterface();
        Pucman.Graph.createGraph(this.graph);
        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();
        this.bmd.clear();
        for (var i = 0; i < this.graph.length; i++) {
            this.bmd.rect(this.graph[i].x, this.graph[i].y, 1, 1, 'rgba(255, 255, 255, 1)');
        }
        pucman = new Pucman.Character(this, "pucman", this.graph[100]);
        pucman.anchor.set(0.5);
        this.add.existing(pucman);
        console.log(Pucman.Graph.getNodeInDir(this.graph, 50, Phaser.LEFT));
    },

    /**
     * update of the game state
     */
    update: function() {}
};
