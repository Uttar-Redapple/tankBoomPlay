var allbullets = [];
var Gameplay = function() {};
Gameplay.prototype = {
    init: function() {
        Utils.ScaleManager();
    },
    preload: function() {
        game.input.keyboard.enabled = true;
        allbullets = [];
        allPlayersIdArray = [];
        allPlayers = [];
    },

    create: function() {
        cursors = game.input.keyboard.createCursorKeys();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = "#a8adb8";

        //CREATE BACKGROUND
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                this.CreateBackground(i * 1440, j * 1118);
            }
        }

        //SCORE TEXT
        scoreText = game.add.bitmapText(1060, 50, 'riccicFreeFont', 'SCORE :', 30);
        scoreText.tint = "0x000000";
        scoreText.anchor.set(0.5, 0.5);
        scoreText.fixedToCamera = true;

        //SCORE TEXT
        scoreValueText = game.add.bitmapText(1160, 50, 'riccicFreeFont', '0', 30);
        scoreValueText.tint = "0x000000";
        scoreValueText.anchor.set(0.5, 0.5);
        scoreValueText.fixedToCamera = true;

        //SHOW THE TIMER
        time = this;
        time.startTime = new Date();
        time.totalTime = 120;
        time.timeElapsed = 0;
        Utils.createTimer();
        time.gameTimer = game.time.events.loop(100, function() {
            Utils.updateTimer();
        });
        game.time.events.start();

        game.world.setBounds(-500,-500, setBoundX, setBoundY);
        game.camera.height = gameCameraHeight;
        game.camera.width = gameCameraWidth;
        boundXlimit = setBoundX - game.camera.width;
        boundYlimit = setBoundY - game.camera.height;
        this.CreateObsatcles();

        //SHOW THE VIRTUAL JOYSTICK
        if (!game.device.desktop) {
            moveGamepad = game.plugins.add(Phaser.Plugin.VirtualGamepad);
            moveJoystick = moveGamepad.addJoystick(150, 600, 1.2, 'gamepad');
            moveGamepadButton = moveGamepad.addButton(150, 600, 0, 'gamepad');

            rotateGamepad = game.plugins.add(Phaser.Plugin.VirtualJoystick);
            rotateJoystick = rotateGamepad.addJoystick(1100, 600, 1.2, 'gamepad');
            rotateGamepadButton = rotateGamepad.addButton(1100, 600, 0, 'gamepad');
        }

        GameOverPopup.CreateGameOverPopup();
    }, //End of create function
    ReturnSpeed: function(){
        var random = Math.random();
        if(random > 0.5){
            return Utils.getRandomNumber(20, 50);
        }
        return Utils.getRandomNumber(-20, -50);
    },
    CreateBackground: function(posx, posy) {
        var gameplayBackground = Utils.SpriteSettingsControl(gameplayBackground, posx, posy, 'background', "true", "true", 0, 0, 1, 1);
    },
    update: function() {
        Debug.log("Update Call............")
        for(var i = 0;i<allPlayers.length;i++){
            if(allPlayers[i] != null || undefined){
                this.MovePlayerEmit();
                for(var j = 0;j<allbullets.length;j++){
                    if(allPlayers[i].playerId != playerUniqueId){
                        allPlayers[i].CollisionChecking(allPlayers[i].playerGroup,allbullets[j],allPlayers[i].playerId);
                    }
                }
                allPlayers[i].RotateTurret();

                //FIRE BULLETS USING JOYSTICK
                if (!game.device.desktop) {
                    if (rotateJoystick.properties.inUse) {
                        if (allPlayers[i].playerId == playerUniqueId) {
                            Client.FireEmit(allPlayers[i].playerHead.angle);
                        }
                    }
                } 
                else{
                    if (game.input.activePointer.leftButton.isDown) {
                        if(allPlayers[i].playerId == playerUniqueId){
                            Client.FireEmit(allPlayers[i].playerHead.angle);
                        }
                    }
                }
            }
        }
    },
    FireBullet: function(data){
        for(var i = 0;i<allPlayers.length;i++){
            if(data.isFire){
                if(allPlayers[i] != null){
                    if(allPlayers[i].playerId == data.userId){
                        allPlayers[i].FireBullets(data.playerAngle);
                    }
                }
            }
        }
    },
    RotatePlayerTurret : function(data){
        for(var i = 0;i<allPlayers.length;i++){
            if(allPlayers[i] != null){
                if(allPlayers[i].playerId == data.userId){
                    allPlayers[i].playerHead.angle = data.playerAngle;
                }
            }
        }
    },
    CreateObsatcles: function(){
        for (var i = 0; i < maxNumberOfObstacles; i++) {
            var obstacleObj = new Obstacle();
            allObstacles.push(obstacleObj.CreateObstacle(allobstaclesRandomPosX[i],allobstaclesRandomPosY[i],allobstaclesType[i],allObstacleId[i],allObstacleHealth[i]));
            allObstaclesObj.push(obstacleObj);
        }
        setTimeout(() => {
            Client.ObstacleCreationDone();
        }, 2000);
    },
    CreateSingleObstacle: function(data){
        var obstacleObj = new Obstacle();
        allObstacles.push(obstacleObj.CreateObstacle(data.X,data.Y,data.type,data.id,data.health));
        allObstaclesObj[deadObstacleIndex] = obstacleObj;
        
    },
    MoveObstacles: function(data){
        if(allObstaclesObj.length > 0){
            for (var i = 0; i < data.length; i++) {
                if(allObstaclesObj[i].obstacleId == data[i].id){
                    allObstaclesObj[i].MoveObstacle(data[i].X,data[i].Y);
                    for(var j = 0;j<allPlayers.length;j++){
                        allObstaclesObj[i].CollisionChecking(allPlayers[j].playerGroup,allPlayers[j].bullets);
                    }
                }
            }
        }
    },
    SetObstacleHealth: function(obsatclesID,obstacleHealth,isDead){
        for(var i=0;i<allObstaclesObj.length;i++){
            if(allObstaclesObj[i].obstacleId == obsatclesID){
                allObstaclesObj[i].obstacleHelathBar.scale.x = obstacleHealth;
                if(isDead){
                    deadObstacleIndex = i;
                    allObstaclesObj[i].obstacleGroup.destroy();
                    this.CalculateScore();
                }
            }
        }
    },
    SetPlayerHealth: function(playerId,playerHealth,isDead){
        for(var i = 0;i<allPlayers.length;i++){
            if(allPlayers[i] != null){
                if(allPlayers[i].playerId == playerId){
                    allPlayers[i].healthBar.scale.x = playerHealth;
                }
            }
        }
    },
    CreatePlayer: function(data){
        for (var i = 0; i < data.data.length; i++) {
            var playerObj = new Player();
            playerObj.CreatePlayer(data.data[i].userName,data.data[i].userId,data.data[i].X,data.data[i].Y,data.data[i].camPosX,data.data[i].camPosY);
            allPlayers.push(playerObj);
        }
    },  
    CreateSinglePlayer: function(data){
        var playerObj = new Player();
        playerObj.CreatePlayer(data.data.userName,data.data.userId,data.data.X,data.data.Y);
        allPlayers.push(playerObj);
    },
    MovePlayerEmit: function(playerObj){

        //VIRTUAL JOYSTICK FOR MOVE THE PLAYER
        if (!game.device.desktop) {
            if (moveJoystick.properties.left) {
                Client.PlayerMovementDirection("left");
            } else if (moveJoystick.properties.right) {
                Client.PlayerMovementDirection("right");
            } else if (moveJoystick.properties.up) {
                Client.PlayerMovementDirection("up");
            } else if (moveJoystick.properties.down) {
                Client.PlayerMovementDirection("down");
            }
        } 

        else{
            if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                Client.PlayerMovementDirection("left");
            } else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                Client.PlayerMovementDirection("right");
            } else if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                Client.PlayerMovementDirection("up");
            } else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                Client.PlayerMovementDirection("down");
            }
        }

    },
    MovePlayerOn: function(data){
        for(var i = 0;i<allPlayers.length;i++){
            if(allPlayers[i] != null){
                Debug.log("The data............"+JSON.stringify(data));
                if(data.data.userId === allPlayers[i].playerId){
                    if(allPlayers[i].playerId === playerUniqueId){
                        game.camera.x = data.data.camPosX;
                        game.camera.y = data.data.camPosY;
                    }
                    allPlayers[i].playerGroup.x = data.data.X;
                    allPlayers[i].playerGroup.y = data.data.Y;
                }
            }
        }        
    },
    render: function() {
        game.debug.cameraInfo(game.camera, 32, 32);
    },
    CalculateScore: function() {
        score += 1;
        scoreValueText.setText(score.toString());
    },
    DestroyPlayer: function(userId){
        for(var i=0;i<allPlayers.length;i++){
            if(allPlayers[i].playerId == userId){
                if(allPlayers[i].playerId == playerUniqueId){
                    game.input.keyboard.enabled = false;
                    GameOverPopup.ShowGameOverPopup();
                    game.time.events.stop();
                }
                allPlayers[i].playerGroup.destroy();
                allPlayers[i] = null;
                allPlayers.splice(i, 1);
                // allPlayers = allPlayers.filter(function(element) {
                //     return element !== undefined;
                // });
            }
        }
    }
}; //End of Gameplay.prototype