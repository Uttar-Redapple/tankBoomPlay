var LoadAssets = {
    LoadAllAssets: function() {

        // //FOR VIRTUAL JOYSTICK
        // game.load.image('vjoy_base', 'assets/virtualJoystick/base.png');
        // game.load.image('vjoy_body', 'assets/virtualJoystick/body.png');
        // game.load.image('vjoy_cap', 'assets/virtualJoystick/cap.png');

        // LOAD FONT
        game.load.bitmapFont('riccicFreeFont', "fonts/riffic_free_bold.png", "fonts/riffic_free_bold.fnt");

        game.load.image('overlay', "assets/overlay.png");
        game.load.image('onePixel', "assets/one_pixel_white.png");
        game.load.image('background', "assets/splash_bg.png");
        game.load.image('menuBackground', "assets/gameplay/Bg2.png");
        game.load.image('gameTitle', "assets/gameplay/Title.png");
        game.load.image('playButton', "assets/gameplay/Play.png");
        game.load.image('homeButton', "assets/gameplay/ok.png");
        game.load.image('nameBase', "assets/gameplay/Text field.png");

        // game.load.spritesheet('titleArt', "assets/images/gui/title_art_animation.png", 512, 512, 145);

        //Gameplay
        game.load.image('playerBody', "assets/gameplay/Player_Tank_body.png");
        game.load.image('playerHead', "assets/gameplay/Player_Tank_head_rotate.png");
        game.load.image('bullet', "assets/gameplay/Bullet.png");
        game.load.image('healthBarBase', "assets/gameplay/Health_bar_base.png");
        game.load.image('healthBar', "assets/gameplay/Health_bar_top.png");
        game.load.image('timerIcon', "assets/gameplay/timer.png");

        //FOR LOAD THE OBSTACLES
        for (i = 1; i <= 3; i++) {
            obstacleNameString = "obstacle_0" + i;
            game.load.image(obstacleNameString, 'assets/gameplay/' + obstacleNameString + '.png');
        }


        game.load.start();

    }
}