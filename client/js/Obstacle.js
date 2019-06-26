var Obstacle = function() {
    this.obstacle = "";
    this.obstacleHelathBar = "";
    this.obstacleGroup = "";
    this.obstacleId = "";
    this.obstacleType ="";

    this.CreateObstacle = function(randomPosx,randomPosY,obstacleType,obstacleId,healthbar) {
        this.obstacleGroup = game.add.physicsGroup();
        var randomObstacle = Utils.getRandomNumber(1, 3);
        this.obstacle = Utils.SpriteSettingsControl(this.obstacle,randomPosx/*Utils.getRandomNumber(0,4000)*/, randomPosY/*Utils.getRandomNumber(0,4000)*/, 'obstacle_0' + obstacleType, "true", "true", 0.5, 0.5, 1, 1);
        this.obstacleGroup.add(this.obstacle);
        var obstacleHelathBase = Utils.SpriteSettingsControl(obstacleHelathBase, 0, 40, 'healthBarBase', "true", "true", 0.5, 0.5, 0.5, 0.5);
        this.obstacle.addChild(obstacleHelathBase);
        this.obstacleHelathBar = Utils.SpriteSettingsControl(this.obstacleHelathBar, -23, 39.5, 'healthBar', "true", "true", 0, 0.5, healthbar, 0.5);
        this.obstacle.addChild(this.obstacleHelathBar);
        this.obstacleId = obstacleId;
        this.obstacleType = obstacleType;
        return this.obstacle;
    }

    this.MoveObstacle = function(randomPosX,randomPosY) {
        this.obstacle.x = randomPosX;
        this.obstacle.y = randomPosY;
    }

    this.CollisionChecking = function(playerGroupReference,bulletGroupReference) {
        // console.log("The body 1..........");
        game.physics.arcade.overlap(playerGroupReference, this.obstacleGroup, ObstaclePlayerCollision, null, this);

        game.physics.arcade.overlap(bulletGroupReference, this.obstacleGroup, ObstacleBulletCollision, null, this);

        // game.physics.arcade.overlap(this.obstacleGroup, this.obstacleGroup, ObstacleCollisionChecking, null, this);
    }
    ObstacleCollisionChecking = function(sprite1,sprite2){
        console.log("The body 1..........",sprite1.key + "The body 2............",sprite2.key);
        if(sprite1){
            this.obstacle.body.velocity.x = 5;
            this.obstacle.body.velocity.y = 5;
        }
        if (sprite2) {
            this.obstacle.body.velocity.x = 5;
            this.obstacle.body.velocity.y = 5;
        }
    }
    ObstaclePlayerCollision = function(sprite1, sprite2) {
        Client.ObsatcleHitUpdate(this.obstacleId,"player");
        Client.PlayerHitUpdate(sprite1.children[2].name,"obstacle",this.obstacleType);
    }
    ObstacleBulletCollision = function(sprite1, sprite2){
        sprite1.kill();
        Client.ObsatcleHitUpdate(this.obstacleId,"bullet");
    }
}