var GameOverPopup = {
    CreateGameOverPopup: function() {
        gameOverPopupGroup = game.add.group();
        gameOverPopupGroup.fixedToCamera = true;

        //ADD GAME OVER POPUP OVERLAY
        gameOverPopupOverlay = Utils.ButtonSettingsControl(gameOverPopupOverlay, 640.0, 360.0, 'overlay', this.GameOverPopupOverlayOnPress, null, null, null, "true", "true", 0.5, 0.5, 4, 4, this);

        //YOUR SCORE TEXT
        yourScoreText = game.add.bitmapText(590, 200, 'riccicFreeFont', 'YOUR SCORE : ', 40);
        yourScoreText.anchor.set(0.5, 0.5);
        yourScoreText.tint = "0x000000";

        //CURRENT SCORE VALUE TEXT
        currentScoreValue = game.add.bitmapText(803, 200, 'riccicFreeFont', '123456', 45);
        currentScoreValue.anchor.set(0.5, 0.5);
        currentScoreValue.tint = "0x000000";

        //PLAYED TIME TEXT
        playedTimeText = game.add.bitmapText(590, 280, 'riccicFreeFont', 'PLAYED TIME : ', 35);
        playedTimeText.anchor.set(0.5, 0.5);
        playedTimeText.tint = "0x000000";

        //PLAYED TIME VALUE TEXT
        playedTimeValue = game.add.bitmapText(803, 280, 'riccicFreeFont', '10:00', 40);
        playedTimeValue.anchor.set(0.5, 0.5);
        playedTimeValue.tint = "0x000000";


        //ADD GAME OVER MENU BUTTON
        gameOverPopupHomeButton = Utils.ButtonSettingsControl(gameOverPopupHomeButton, 660, 480, 'homeButton', this.GameOverPopupHomeButtonOnPress, null, null, this.GameOverPopupHomeButtonOnRelease, "true", "true", 0.5, 0.5, 1, 1, this);

        gameOverPopupGroup.add(gameOverPopupOverlay);
        gameOverPopupGroup.add(yourScoreText);
        gameOverPopupGroup.add(currentScoreValue);
        gameOverPopupGroup.add(playedTimeText);
        gameOverPopupGroup.add(playedTimeValue);
        gameOverPopupGroup.add(gameOverPopupHomeButton);

        gameOverPopupGroup.visible = false;
        gameOverPopupGroup.alpha = 0;
    },

    ShowGameOverPopup: function() {
        game.world.bringToTop(gameOverPopupGroup);
        gameOverPopupGroup.visible = true;
        game.add.tween(gameOverPopupGroup).to({ alpha: 1 }, 300, Phaser.Easing.Linear.Out, true);
        currentScoreValue.text = score;
        playedTimeValue.text = totalTimeToPrint;
    },

    HideGameOverPopup: function() {
        var tween = game.add.tween(gameOverPopupGroup).to({ alpha: 0 }, 200, Phaser.Easing.Linear.Out, true);
        tween.onComplete.add(function() {
            gameOverPopupGroup.visible = false;
        });
    },

    GameOverPopupOverlayOnPress: function() {
        // console.log("GameOverPopupOverlayOnPress");
    },

    GameOverPopupHomeButtonOnPress: function() {
        game.add.tween(gameOverPopupHomeButton.scale).to({ x: 0.95, y: 0.95 }, 100, Phaser.Easing.Linear.Out, true);
    },
    GameOverPopupHomeButtonOnRelease: function() {
        game.add.tween(gameOverPopupHomeButton.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Linear.Out, true);

        // //HIDE THE GAME OVER POPUP
        // GameOverPopup.HideGameOverPopup();

        // //TRANSIT TO MAIN MENU
        Client.AddUser();
        StateTransition.TransitToMenu();
        // isGameOver = false;

    },


}