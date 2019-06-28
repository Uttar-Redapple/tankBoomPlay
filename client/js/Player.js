var Player = function() {

    this.playerGroup = "";
    this.playerBody = "";
    this.playerHead = "";
    this.healthBarBase = "";
    this.healthBar = "";
    this.playerNameText = "";
    this.bullets = ""; //bullet group
    this.bulletTime = 0;
    this.playerId = "";

    this.CreatePlayer = function(_playerName, playerId,playerPosx,playerPosY,gameCameraPosX,gameCameraPosY) {
        //CREATE BULLETS GROUP
        if(playerId == playerUniqueId){
            game.camera.x = gameCameraPosX;
            game.camera.y = gameCameraPosY;
        }
        this.playerId = playerId;
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.enable = true;
        this.bullets.checkCollision = true;
        allbullets.push(this.bullets);

        this.playerGroup = Utils.SpriteSettingsControl(this.playerGroup, playerPosx, playerPosY, 'playerBody', "true", "true", 0.5, 0.5, 1, 1);
        this.playerHead = Utils.SpriteSettingsControl(this.playerHead, 0, 0, 'playerHead', "true", "true", 0, 0.5, 1, 1);
        this.playerBody = Utils.SpriteSettingsControl(this.playerBody, 0, 0, 'playerBody', "true", "true", 0.5, 0.5, 1, 1);
        this.playerBody.name = this.playerId;
        this.healthBarBase = Utils.SpriteSettingsControl(this.healthBarBase, 0, 80, 'healthBarBase', "true", "true", 0.5, 0.5, 1, 1);
        // this.healthBarBase.visible = false;
        this.healthBar = Utils.SpriteSettingsControl(this.healthBar, -47, 79.5, 'healthBar', "true", "true", 0, 0.5, 1, 1);
        // this.healthBar.visible = false;
        this.playerNameText = game.add.bitmapText(0, -90, 'riccicFreeFont', _playerName, 30);
        this.playerNameText.tint = "0x000000";
        this.playerNameText.anchor.set(0.5, 0.5);

        // this.playerGroup.addChild(this.playerId);
        this.playerGroup.addChild(this.bullets);
        this.playerGroup.addChild(this.playerHead);
        this.playerGroup.addChild(this.playerBody);
        this.playerGroup.addChild(this.healthBarBase);
        this.playerGroup.addChild(this.healthBar);
        this.playerGroup.addChild(this.playerNameText);

        game.physics.enable(this.playerGroup, Phaser.Physics.ARCADE);
        this.playerGroup.body.allowRotation = false;
    }

    this.RotateTurret = function() {
        // Debug.log("Rotate Turret............"+this.playerId);
        if(this.playerId === playerUniqueId){

            if (!game.device.desktop) {
                if (rotateJoystick.properties.inUse) {
                    this.playerHead.rotation = rotateJoystick.properties.rotation;
                    Client.RotationEmit(this.playerHead.angle);
                }
            } 
            else{
                this.playerHead.rotation = game.physics.arcade.angleToPointer(this.playerGroup);    
                // Debug.log("The angle........"+this.playerHead.angle);
                Client.RotationEmit(this.playerHead.angle);
            }
        }
    }
    this.FireBullets = function(playerAngle) {
        Debug.log("The Bullet Fire For Player");
        if (game.time.now > this.bulletTime) {
            var bullet = this.bullets.getFirstExists(false);
            if (bullet) {
                var degreeToRad = playerAngle * (Math.PI / 180);
                var xPos = 120 * Math.cos(degreeToRad);
                var yPos = 120 * Math.sin(degreeToRad);
                bullet.reset(xPos, yPos);
                game.physics.arcade.velocityFromAngle(playerAngle, 500, bullet.body.velocity);
                this.bulletTime = game.time.now + 200;
            }
        }
    }
    this.CollisionChecking = function(playerGroup,bulletsGroup,userId) {
        game.physics.arcade.overlap(playerGroup, bulletsGroup, PlayerBulletCollision, null, this);
    }
    PlayerBulletCollision = function(sprite1, sprite2) {
        sprite2.kill();
        Client.PlayerHitUpdate(sprite1.children[2].name,"bullet",0);
        // console.log("Bullets Collision with player............"+sprite1.children[2].name);
        // Client.ObsatcleHitUpdate(this.obstacleId,"player");
    }

}