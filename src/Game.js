Pucman.Game = function(game) {
    this.graphBitmap = null;
    this.pucman = null;
    this.graph = null;
    this.dots = null;

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
        this.load.spritesheet('dot', 'resources/pucman.png', 10, 10);

        //Pucman.Interface.preloadInterface(this);
    },

    create: function() {
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
                var dot = dots.create(ele.position().x, ele.position().y, 'dot');
                dot.anchor.set(0.5);
                ele.data('dot', dot);
            }
            bitmap.rect(
                ele.position().x,
                ele.position().y,
                4, 4, 'rgba(0, 0, 0, 1)'
            );
        });
        pucman = new Pucman.Character(
            this, "pucman", this.graph.nodes()[110]);
        this.add.existing(pucman);
        //Pucman.Interface.create(this);
    },

    update: function() {}

};
