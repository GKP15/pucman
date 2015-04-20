Pucman.Preloader = function(game) {};

Pucman.Preloader.prototype = {
	/**
	 * initialisation of the game state
	 */
	init: function(map) {
		this.state.start('MainMenu', true, false, map);
	},
	
	/**
	 * preload of the game state
	 */
	preload: function() {		
		this.load.audio('music', 'resources/test.mp3');
		this.load.audio('ouch', 'resources/ouch.mp3');
	},

	/**
	 * creation of the game state
	 */
	create: function() {
		//gehe in state MainMenu
		this.state.start('MainMenu');
		//this.state.start('MainMenu');
		this.ready = false;
	},
		
	/**
	 * update of the game state
	 */
    update: function () {

        //  Make sure all our mp3s have decoded before starting the game
        if (!this.ready){
            if (this.cache.isSoundDecoded('music') && this.cache.isSoundDecoded('ouch')){
                this.ready = true;
                this.state.start('MainMenu');
            }
        }
	}
}