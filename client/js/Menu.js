var Menu = function() {};
Menu.prototype = {
    init: function() {
        Utils.ScaleManager();
    },

    preload: function() {
        game.stage.disableVisibilityChange = true;
        game.time.advancedTiming = true;
    },
    create: function() {
        this.DestroyMenu();
        this.CreateMenu();
        allobstaclesRandomPosX = [];
        allobstaclesRandomPosY = [];
        allobstaclesType = [];
        allObstaclesLevel = [];
        allObstacleId = [];
        allObstacleHealth = [];
        allObstaclesObj = [];
        allObstacles = [];

    }, //End of create function

    CreateMenu: function() {
        menuGroup = game.add.group();

        //ADD BG
        var menuBackground = Utils.SpriteSettingsControl(menuBackground, 640, 360, 'menuBackground', "true", "true", 0.5, 0.5, 1, 1);

        //ADD GAME TITLE
        var menuHeading = Utils.SpriteSettingsControl(menuHeading, 640, 130, 'gameTitle', "true", "true", 0.5, 0.5, 1, 1);

        //ADD GAME TITLE
        var nameBase = Utils.SpriteSettingsControl(nameBase, 640, 330, 'nameBase', "true", "true", 0.5, 0.5, 1, 1);

        name_value = game.add.inputField(385.0, 300.0, {
            font: '40px Arial',
            fill: '#000000',
            fillAlpha: 0,
            fontWeight: 'bold',
            width: 490,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Enter your name',
            zoom: false,
            cursorColor: '#000000'
        });

        // ADD PLAY BUTTON
        playButton = Utils.ButtonSettingsControl(playButton, 640.0, 550.0, 'playButton', this.PlayButtonOnPress, null, null, this.PlayButtonOnRelease, "true", "true", 0.5, 0.5, 1, 1, this);
        menuGroup.add(menuBackground);
        menuGroup.add(menuHeading);
        menuGroup.add(playButton);

    }, //End of CreateMenu function

    PlayButtonOnPress: function() {
        game.add.tween(playButton.scale).to({ x: 0.95, y: 0.95 }, 100, Phaser.Easing.Linear.Out, true);
    },
    PlayButtonOnRelease: function() {
        game.add.tween(playButton.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Linear.Out, true);

        if (name_value.value != "") {
            // setTimeout(StateTransition.TransitToGamePlay, 100);
            Client.GameRequestEmit(name_value.value);
        }
    },

    DestroyMenu: function() {
        if (menuGroup != null) {
            menuGroup.destroy();
        }
    }, //End of DestroyMenu function

}; //End of Menu.prototype