Pucman.Highscore = function(game) {
    this.id = null;

};

Pucman.Highscore.prototype = {

    /**
     * initialisation of the state
     */
    init: function(score, id) {
        this.id = id;
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
        }).anchor.setTo(0.5, 0.5);
        this.nameInput = new TextField(this, this.game.width / 2 - 200, this.game.height * 1 / 2, 20, 'textFieldPic', 'Your Name...');
        this.submitButton = this.add.button(this.game.width / 2, this.game.height * 2 / 3, 'submitButtonPic', function() {
            //Save score + name and so on
        //this.id ist die id 
        //this.score ist die score
        //this.nameInput.textData ist der Name des Spielers
		//console.log("highscore.js: " + marker.id + this.nameInput.textData + this.score);
		//savescoredata(this.id, this.nameInput.textData, this.score);

            window.location.reload();
        }, this).anchor.setTo(0.5, 0.5);
    },

    /**
     * updates the state
     */
    update: function() {

    }

};
