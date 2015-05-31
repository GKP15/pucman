Pucman.Highscore = function(game) {
    this.id = null;

};

Pucman.Highscore.prototype = {

    /**
     * initialisation of the state
     */
    init: function(score, id, win) {
        this.id = id;
        this.score = score;
        this.win = win;
    },

    /**
     * prelaods the state
     */
    preload: function() {
        this.load.image('textFieldPic', 'resources/textField.png');
        this.load.image('submitButtonPic', 'resources/submitButton.png');
    },
    
    /**
     * called on creation of the state
     */
    create: function() {
        
        this.wiinText = this.add.text(this.game.width / 2, this.game.height * 1 / 4, 'You ' + this.win ? 'win' : 'lost' + ' the game!', {
            fontSize: '64px',
            fill: '#000000'
        }).anchor.setTo(0.5, 0.5);
        this.scoreText = this.add.text(this.game.width / 2, this.game.height * 1 / 3, 'Score: ' + this.score, {
            fontSize: '32px',
            fill: '#000000'
        }).anchor.setTo(0.5, 0.5);
        this.nameInput = new TextField(this, this.game.width / 2 - 200, this.game.height * 1 / 2, 20, 'textFieldPic', 'Your Name...');
        this.submitButton = this.add.button(this.game.width / 2, this.game.height * 2 / 3, 'submitButtonPic', function() {
            //Call function to save Highscore (Map_ID, Player_Name, Highscore_Value
            savescoredata(this.id, this.nameInput.textData, this.score);

            window.location.reload();
        }, this).anchor.setTo(0.5, 0.5);
    },

    /**
     * updates the state
     */
    update: function() {

    }

};
