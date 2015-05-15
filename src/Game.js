var Pucman = {};

Pucman.Game = function(game) {
    this.graphBitmap = null;
    this.pucman = null;
    this.graph = [new Phaser.Point(0, 0),
        new Phaser.Point(1100, 500),
        new Phaser.Point(100, 100),
        new Phaser.Point(1920, 1080)
    ];
};

Pucman.Game.prototype = {

    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    },

    preload: function() {
        //Bilder, spritesheet und tilemap laden
        this.load.spritesheet('pucman', 'resources/pucman.png', 32, 32);
    },

    create: function() {
        this.cursors = this.input.keyboard.createCursorKeys();
        Pucman.Graph.createGraph(this.graph);
        this.graphBitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.graphBitmap.addToWorld();
        this.graphBitmap.clear();
        for (var i = 0; i < this.graph.length; i++) {
            this.graphBitmap.rect(this.graph[i].x, this.graph[i].y, 8, 8, 'rgba(0, 0, 0, 1)');
        }
        pucman = new Pucman.Character(this, "pucman", this.graph[100]);
        pucman.anchor.set(0.5);
        this.add.existing(pucman);
    },

    update: function() {}
};
