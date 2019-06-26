var Client = {};
Client.socket = io(baseURL); 

Client.socket.connect();

// // Add a connect listener
Client.socket.on('connect', function() {
    // Debug.log('Client has connected to the server!' + Client.socket.id);
    Client.AddUser();
});
// Add a disconnect listener
Client.socket.on('disconnect', function() {
    Debug.log('The client has disconnected!');
});

//Add a User Connected Listener
Client.socket.on('user_connected', function(data) {
    // Debug.log("The User Connected Data..........." + JSON.stringify(data));
    UserConnected(data);
});
//Add a GameReply Listener
Client.socket.on('gameReply', function(data) {
    // Debug.log("The Game Reply Data..........." + JSON.stringify(data));
    GameRequestOn(data);
});
//Add a CreateObstacleList Listener
Client.socket.on('obstacleList', function(data) {
    // Debug.log("The Obstacle List Data..........." + JSON.stringify(data));
    ObstacleListDataOn(data);
});
//ObstacleMovement
Client.socket.on('obstacleMovement', function(data) {
    // Debug.log("The Obstacle Movement..........." + JSON.stringify(data));  
    Gameplay.prototype.MoveObstacles(data);
});
//ObstacleMovement
Client.socket.on('obstacleHealthUpdate', function(data) {
    // Debug.log("The Obstacle Health Update Obj..........." + JSON.stringify(data));
    ObstacleHealthUpdateOn(data);
});
//ObstacleMovement
Client.socket.on('obstacleKilled', function(data) {
    // Debug.log("The Obstacle Killed Respawn Data..........." + JSON.stringify(data));
    Gameplay.prototype.CreateSingleObstacle(data);
    // ObstacleHealthUpdateOn(data);
});
//Add a CreatePlayer Listener
Client.socket.on('connected_room', function(data) {
    // console.log("The Connected Room..........." + JSON.stringify(data));
    setTimeout(() => {
        Gameplay.prototype.CreatePlayer(data);
    }, 1000);
});
Client.socket.on('user_entered', function(data) {
    // Debug.log("The user entered..........." + JSON.stringify(data));
    Gameplay.prototype.CreateSinglePlayer(data);
});
Client.socket.on('playerMovementUpdate', function(data) {
    // Debug.log("The Player Movement Update..........." + JSON.stringify(data));
    Gameplay.prototype.MovePlayerOn(data);
});
Client.socket.on('playerRotationOn', function(data) {
    // Debug.log("The Player Rotation Update..........." + JSON.stringify(data));
    Gameplay.prototype.RotatePlayerTurret(data);
});
Client.socket.on('playerFireOn', function(data) {
    Debug.log("The Player Fire Update..........." + JSON.stringify(data));
    Gameplay.prototype.FireBullet(data);
});
Client.socket.on('playerHealthUpdate', function(data) {
    console.log("The Player Health Update..........." + JSON.stringify(data));
    Gameplay.prototype.SetPlayerHealth(data.userId,data.userMaxHealth,data.isDead);
});
Client.socket.on('userKilled', function(data) {
    console.log("The Player Killed..........." + JSON.stringify(data));
    Gameplay.prototype.DestroyPlayer(data.userId);
});
Client.socket.on('userDisconnected', function(data) {
    console.log("The Player Disconnected..........." + JSON.stringify(data));
    Gameplay.prototype.DestroyPlayer(data.userId);
});

//AddUser Emit
Client.AddUser = function() {
    // Debug.log("Enter into the Add User Function");
    Client.socket.emit('addUser', "");
}
//Add user On
UserConnected = function(data) {
    Debug.log("The Connected User");
    if (data.status == 1) {
        // Debug.log("User Connected Success");
        playerUniqueId = data.data.userId;
        Database.SaveData("userId", data.data.userId);
    } else {
        // Debug.log("User Connected Failure");
    }
}

//GameRequest Emit
Client.GameRequestEmit = function(userName) {
    Debug.log("Enter into the Game Request emit"+userName);
    var data = {
        "userName" : userName,
    };

    Client.socket.emit('gameRequest', data);
}
//Game Request On
GameRequestOn = function(data) {
    Debug.log("Enter into the Game Request On" + JSON.stringify(data));
    if (data.status == 1) {
        Debug.log("GameRequestOn....true");
        setBoundX = data.data.setBoundX;
        setBoundY = data.data.setBoundY;
        gameCameraHeight = data.data.gameCameraHeight;
        gameCameraWidth = data.data.gameCameraWidth;
        setTimeout(StateTransition.TransitToGamePlay, 100);
        Client.CreateObstacleEmit();
    } 
    else {
        Debug.log("GameRequestOn....false");
    }
}

//Obstacle Emit
Client.CreateObstacleEmit = function() {
    Debug.log("Enter into the Game Request emit");
    Client.socket.emit('createObstacle', "");
}
ObstacleListDataOn = function(data){
    if (data.status == 1) {
        Debug.log("Obstacle List Data...................");
        for(var i = 0;i<data.data.length;i++){
            maxNumberOfObstacles = data.data.length;
            allObstacleId[i] = data.data[i].id;
            allobstaclesRandomPosX[i] = data.data[i].X;
            allobstaclesRandomPosY[i] = data.data[i].Y;
            allobstaclesType[i] = data.data[i].type;
            allObstacleHealth[i] = data.data[i].health;
        }
    }
}
//Obsatcle Creation done
Client.ObstacleCreationDone = function() {
    Debug.log("Enter into the Game Request emit");
    var data = {
        "isObstaclesCreated" : true,
    };
    Client.socket.emit('updatePos', data);
}
//Obsatcle Hit Update
Client.ObsatcleHitUpdate = function(obstacleId,obstacleType){
    // Debug.log("Enter into the Obstacle Hit Update........");
    var data = {
        "obstacleID" : obstacleId,
        "isHit" : true,
        "hitType" : obstacleType,
    };
    Client.socket.emit('obstacleHit',data);
}
//Obsatcle Health Update
ObstacleHealthUpdateOn = function(data){
    // Debug.log("Enter into the Obstacle Health Update........");
    Gameplay.prototype.SetObstacleHealth(data.id,data.health,data.isDead);
}
//Player
Client.PlayerMovementDirection = function(movementDirection){
    // Debug.log("The User Id....................."+Database.LoadData("userId"));
    var data = {
        "userId" : playerUniqueId,
        "dir" : movementDirection,
    };
    Client.socket.emit('playerMovementDirection',data);
}
Client.RotationEmit = function(rotationAngle){
    var data = {
        "userId" : playerUniqueId,
        "playerAngle" : rotationAngle,
    };
    Client.socket.emit('playerRotationEmit',data);
}
Client.FireEmit = function(playerAngle){
    var data = {
        "userId" : playerUniqueId,
        "isFire" : true,
        "playerAngle" : playerAngle,
    };
    Client.socket.emit('playerFireEmit',data);
}

Client.PlayerHitUpdate = function(userId,hitType,obstacleType){
    console.log("Player Hit Update Emit..............................."+userId + "The hit Type..........."+hitType + "The Obstalce type....."+obstacleType);
    var data = {
        "userId" : userId,
        "isHit" : true,
        "hitType" : hitType,
        "obstacleType" : obstacleType,
    }
    Client.socket.emit('playerHit',data);
}
