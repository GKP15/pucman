Pucman.Load = function(game, map) {
    this.map = null;
    this.graph = null;
    this.graphReady = false;

    var opposites = [
        Phaser.NONE,
        Phaser.RIGHT,
        Phaser.LEFT,
        Phaser.DOWN,
        Phaser.UP
    ];

};

Pucman.Load.prototype = {
    
	/**
	 * initialisation of the state
	 * @param the map from mapstraction
	 */
	init: function(map) {
        this.map = map;
        this.graph = Pucman.Graph.getGraph(this);

    },
	
	/**
	 * updates the state
	 */
    update: function() {
        if (this.graphReady) {
            this.game.state.start('Game', false, false, this.graph);
        }
    },

};
