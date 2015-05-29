Pucman.Highscore = function(game) {
    
};

Pucman.Highscore.prototype = {
    
	/**
	 * initialisation of the state
	 */
	init: function(score) {
		this.score = score;
    },
	
	preload: function() {
        this.load.image('textFieldPic', 'resources/textField.png');
        this.load.image('submitButtonPic', 'resources/submitButton.png');
    },
	
	create: function() {
        
		this.scoreText = this.add.text(this.game.width / 2, this.game.height * 1 / 3, 'Score: ' + this.score, {
                fontSize: '32px',
                fill: '#000000'
            }).anchor.setTo(0.5,0.5);
		this.nameInput = new TextField(this, this.game.width / 2 - 200, this.game.height * 1/ 2, 20, 'textFieldPic', 'Your Name...');
		this.submitButton = this.add.button(this.game.width / 2, this.game.height * 2 / 3, 'submitButtonPic', function() {
            //Save score + name and so on
			
			
			window.location.reload();
        }, this).anchor.setTo(0.5,0.5);
    },
	
	/**
	 * updates the state
	 */
    update: function() {
        
    }

};
