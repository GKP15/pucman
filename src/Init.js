//Wird von HTML ELement aufgerufen
init = function() {
	//erstelle neues Spielobject. (Höhe in %, Breite in %, Renderer, HTML-Container, default state, transparent)
	var game = new Phaser.Game('100', '100', Phaser.AUTO, 'gameContainer', null, true);
	//add game states
	game.state.add('Boot', Pucman.Boot);
	game.state.add('Preloader', Pucman.Preloader);
	game.state.add('MainMenu', Pucman.MainMenu);
	game.state.add('Game', Pucman.Game);
	//start state Boot
	game.state.start('Boot');
};
