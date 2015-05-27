Pucman.Interface = (function() {
    return {
		
		/**
		 * preloads data for the interface
		 * @param game state
		 */
        preloadInterface: function(that) {
            that.load.image('homePageButtonPic', 'resources/homePageButton.png');
            that.load.image('plusButtonPic', 'resources/plus.png');
            that.load.image('minusButtonPic', 'resources/minus.png');

            // music
            that.load.audio('music', 'resources/test.mp3');
            that.load.audio('ouch', 'resources/ouch.mp3');
        },
		
		/**
		 * creates the interface
		 * @param gane state
		 */
        createInterface: function(that) {
            //button to got to homepage
            homepageButton = that.game.add.button(((that.game.width / 20) * 17), (that.game.height - 64), 'homePageButtonPic', function() {
                window.location.href = 'http://pcai042.informatik.uni-leipzig.de/~swp15-gkp/';
            }, that);
            //button to increase volume
            plusButton = that.game.add.button(((that.game.width / 20) * 19), (homepageButton.y - ((that.game.cache.getImage('plusButtonPic').height + 32) * 2)), 'plusButtonPic', function() {
                that.backGroundMusic.volume = Math.min(1, that.backGroundMusic.volume + 0.05);
            }, that);
            //button to  decrease volume
            minusButton = that.game.add.button(((that.game.width / 20) * 19), (homepageButton.y - (that.game.cache.getImage('plusButtonPic').height + 32)), 'minusButtonPic', function() {
                that.backGroundMusic.volume = Math.max(0, that.backGroundMusic.volume - 0.05);
            }, that);
			//button to start/pause the game
			var pauseText = 'Pause';
			pauseButton = that.game.add.button(((that.game.width / 20) * 10), (that.game.height - 64), pauseText, function() {
                
            }, that);

            //  Lives
			var text = null;
			if(typeof that.game.pucman == 'undefined') {
			    text = 'Lives: 3';
			} else {
			    text = 'Lives: ' + that.game.pucman.lives;
			}
            that.livesText = that.add.text((that.game.width / 20), (that.game.height - 64), text, {
                fontSize: '32px',
                fill: '#000'
            });
            //  Score
            that.scoreText = that.add.text((that.game.width / 2), (that.game.height - 64), 'Score: 0', {
                fontSize: '32px',
                fill: '#000'
            });


            // music
            that.backGroundMusic = that.game.add.audio('music', 0.2, true);
            that.backGroundMusic.play();
        },
		
		/**
		 * updates the score after eating a dot
		 * @param game state
		 */
        eatDot: function(game) {
            //  Score
            game.scoreText.text = 'Score: ' + game.score;
        }

        /*
        funktionInterface : function(that) {

			homepageButtonClicked: function() {
				window.location.href = 'http://pcai042.informatik.uni-leipzig.de/~swp15-gkp/';
			},

			plusButtonClicked: function() {
				that.backGroundMusic.volume = Math.min(1, that.backGroundMusic.volume + 0.05);
			},

			minusButtonClicked: function() {
				that.backGroundMusic.volume = Math.max(0, that.backGroundMusic.volume - 0.05);
			}		
		}
		*/
    };
})();
