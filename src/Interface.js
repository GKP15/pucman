Pucman.Interface = (function() {

    var connectPointList = function(pointList) {
        for (i = 0; i < pointList.length - 1; i++) {
            connectTwoPoints(pointList[i], pointList[i + 1]);
        }
    };

    return {
        preloadInterface : function(game) {
			this.load.image('homePageButtonPic', 'resources/homePageButton.png');
			this.load.image('plusButtonPic', 'resources/plus.png');
			this.load.image('minusButtonPic', 'resources/minus.png');	
        },
        createInterface : function(game) {
			//button to got to homepage
			homepageButton = this.game.add.button(((this.game.width / 20) * 17), (this.game.height - 64), 'homePageButtonPic', this.homepageButtonClicked, this);
			//button to increase volume
			plusButton = this.game.add.button(((this.game.width / 20) * 19), (homepageButton.y - ((this.game.cache.getImage('plusButtonPic').height + 32) * 2)), 'plusButtonPic', this.plusButtonClicked, this);
			//button to  decrease volume
			minusButton = this.game.add.button(((this.game.width / 20) * 19), (homepageButton.y - (this.game.cache.getImage('plusButtonPic').height + 32)), 'minusButtonPic', this.minusButtonClicked, this);

			//  Lives
			livesText = this.add.text((this.game.width / 20), (this.game.height - 64), 'Lives: <3 <3 <3', {
				fontSize: '32px',
				fill: '#000'
			});
			//  Score
			scoreText = this.add.text((this.game.width / 2), (this.game.height - 64), 'Score: 0', {
				fontSize: '32px',
				fill: '#000'
			});
        },
		
        funktionInterface : function(game) {

/**
     * go to Homepage
     */
    homepageButtonClicked: function() {
        window.location.href = 'http://pcai042.informatik.uni-leipzig.de/~swp15-gkp/';
    },

    /**
     * increase background music volume
     */
    plusButtonClicked: function() {
		this.backGroundMusic.volume = Math.min(1, this.backGroundMusic.volume + 0.05);
    },

    /**
     * decrease background music volume
     */
    minusButtonClicked: function() {
        this.backGroundMusic.volume = Math.max(0, this.backGroundMusic.volume - 0.05);
    },		
    };
})();




