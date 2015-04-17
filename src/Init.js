//Wird von HTML ELement aufgerufen
init = function() {
	//erstelle neues Spielobject. (Höhe in %, Breite in %, Renderer, HTML-Container, default state, transparent)
	var game = new Phaser.Game('100', '100', Phaser.AUTO, 'gameContainer', null, true);
	//Erstellt neue Karte. (HTML-Container, Map-API)
	map = new mxn.Mapstraction('map', 'openlayers');
	//Center-location
	var latlon = new mxn.LatLonPoint(51.50733, -0.12769);
	//set Center and zoomlevel
	map.setCenterAndZoom(latlon, 10);
	map.setOption('enableDragging', false);
	//disable zoom panel
	map.addControls('pan', false);
	//add game states
	game.state.add('Boot', Pucman.Boot);
	game.state.add('Preloader', Pucman.Preloader);
	game.state.add('MainMenu', Pucman.MainMenu);
	game.state.add('Game', Pucman.Game);
	//start state Boot
	game.state.start('Boot');
};
