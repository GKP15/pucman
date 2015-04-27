/**
 * Einstieg aus der HTML-Datei
 */
require(["lib/phaser.js", "MainMenu", "Game"], function() {
    //Höhe in %, Breite in %, Renderer, HTML-Container, default state, transparent)
    /**	phaser-game */
    var game = new Phaser.Game('100', '100', Phaser.AUTO, 'gameContainer', null, true);
    map = new mxn.Mapstraction('map', 'openlayers');
    //Center-location
    var latlon = new mxn.LatLonPoint(51.3365278, 12.3764688);
    //set Center and zoomlevel
    map.setCenterAndZoom(latlon, 10);
    map.setOption('enableDragging', true);
    //disable zoom panel
    map.addControls('pan', true);

    //add game states
    game.state.add('MainMenu', Pucman.MainMenu);
    game.state.add('Game', Pucman.Game);
    //start state Boot
    game.state.start('MainMenu', true, false, map);
});
