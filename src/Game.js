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
        //Pucman.Interface.preloadInterface(this);
    },

    create: function() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.graphBitmap = this.add.bitmapData(
            this.game.width, this.game.height);
        this.graphBitmap.addToWorld();
        this.graphBitmap.clear();
        this.graph.nodes().forEach(function(ele) {
            this.graphBitmap.rect(
                ele.x, ele.y, 8, 8, 'rgba(0, 0, 0, 1)');
        });
        //pucman = new Pucman.Character(this, "pucman", this.graph[100]);
        //pucman.anchor.set(0.5);
        //this.add.existing(pucman);
        //Pucman.Interface.createhttp://www.smart-webentwicklung.de/2013/05/javascript-callback-funktionen-erstellen-nutzen/Interface(this);
    },

    update: function() {},

    render: function() {}
};
