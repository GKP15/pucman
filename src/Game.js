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

    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        var streets = Pucman.GetGeoData.getData(
            this.game.width, this.game.height);
        Pucman.Graph.convertToPaths(this, streets);
        this.graph = [];
        for (var i = 0; i < streets.length; i++) {
            this.graph = this.graph.concat(streets[i]);
        }
    },

    preload: function() {
        this.load.spritesheet('pucman', 'resources/pucman.png', 32, 32);
        Pucman.Interface.preloadInterface(this);
    },

    create: function() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphBitmap = this.add.bitmapData(
            this.game.width, this.game.height);
        this.graphBitmap.addToWorld();
        this.graphBitmap.clear();
        for (var i = 0; i < this.graph.length; i++) {
            this.graphBitmap.rect(
                this.graph[i].x, this.graph[i].y, 8, 8, 'rgba(0, 0, 0, 1)');
        }
        pucman = new Pucman.Character(this, "pucman", this.graph[100]);
        pucman.anchor.set(0.5);
        this.add.existing(pucman);
        Pucman.Interface.createInterface(this);
    },

    update: function() {},

    render: function() {
        // Sprite debug info
        //this.game.debug.spriteInfo(pucman, 32, 32);

    }
};
