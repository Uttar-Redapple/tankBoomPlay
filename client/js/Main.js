var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game');
Phaser.Device.whenReady(function() {
    game.plugins.add(PhaserInput.Plugin);
});
Main = function() {};

var text;

Main.prototype = {
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function() {
        game.load.script('Splash', 'js/Splash.js');
        game.load.script('Menu', 'js/Menu.js');
        game.load.script('Gameplay', 'js/Gameplay.js');

        //	Progress report
        text = game.add.text(game.world.centerX - 80, game.world.centerY, 'Loading...', { fill: '#ffffff' });
        LoadAssets.LoadAllAssets();

    },
    create: function() {

        game.state.add('Splash', Splash);
        game.state.start('Splash');
        game.state.add('Menu', Menu);
        game.state.add('Gameplay', Gameplay);
        // game.state.start('Gameplay');
    },

};
game.state.add('Main', Main);
game.state.start('Main');