var Splash = function() {};
Splash.prototype = {
    init: function() {
        Utils.ScaleManager();
    },
    preload: function() {

    },
    create: function() {

        Splash.prototype.CreateSplash();

        this.SetTimeOut();
    },

    CreateSplash: function() {
        splashGroup = game.add.group();

        //ADD SPLASH PAGE BACKGROUND
        var splashPageBackground = Utils.SpriteSettingsControl(splashPageBackground, 640, 360, 'menuBackground', "true", "true", 0.5, 0.5, 1, 1);
        //ADD GAME TITLE
        var splashPageHeading = Utils.SpriteSettingsControl(splashPageHeading, 640, 360, 'gameTitle', "true", "true", 0.5, 0.5, 1, 1);

        splashGroup.add(splashPageBackground);
        splashGroup.add(splashPageHeading);
    },

    DestroySplash: function() {
        if (splashGroup != null) {
            splashGroup.destroy();
        }
    },

    SetTimeOut: function() {
        setTimeout(this.ChangeState, 1000);
    },
    ChangeState: function() {
        StateTransition.TransitToMenu();

        setTimeout(function() {
            Splash.prototype.DestroySplash();
        }, 600);
    }
};