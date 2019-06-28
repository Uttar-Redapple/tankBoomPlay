/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const check = require("./checkLib.js");
const response = require('./responseLib')
const gameConfig = require('./../../config/gameConfig');

//Storing States in Two Array and creating gameState object
let allObstacles = [];//Using redis hash should improve performance
let allOnlineUsers = [];//Using redis hash should improve performance

//End Storing States

let startMyInterVal;

//get Player object from List(with for loop time complexity is O(n),can be improved to O(1) if redis hash used)
let getPlayer = (data)=>{
    for(player of allOnlineUsers){
        if(player.userId==data.userId){
            return player;


        }
    }

}//End get Player object

//update Player Position
let updatePlayerPos = (data,player)=>{
    let playerMovement = player;
    if(data.dir=="up" && playerMovement.Y>150){
        playerMovement.Y-=5;
        playerMovement.camPosY-=5;
    }else if(data.dir=="up" && playerMovement.Y<=150){
        playerMovement.Y=151;
        playerMovement.camPosY=playerMovement.Y-360;

    }
    if(data.dir=="down" && playerMovement.Y<gameConfig.boundYLimit){
        playerMovement.Y+=5;
        playerMovement.camPosY+=5;
    }else if(data.dir=="down" && playerMovement.Y>=gameConfig.boundYLimit){
        playerMovement.Y=gameConfig.boundYLimit-1;
        playerMovement.camPosY=playerMovement.Y-360;

    }
    if(data.dir=="right" && playerMovement.X<gameConfig.boundXLimit){
        playerMovement.X+=5;
        playerMovement.camPosX+=5;
    }else if(data.dir=="right" && playerMovement.X>=gameConfig.boundXLimit){
        playerMovement.X=gameConfig.boundXLimit-1;
        playerMovement.camPosX=playerMovement.X-640;
        

    }
    if(data.dir=="left" && playerMovement.X>150){
        playerMovement.X-=5;
        playerMovement.camPosX-=5;
    }else if(data.dir=="left" && playerMovement.X<=150){
        playerMovement.X=151;
        playerMovement.camPosX=playerMovement.X-640;

    }

    return playerMovement;
    

}//End Update Player Position

//Kill Player(with for loop time complexity is O(n),can be improved to O(1) if redis hash used)
let killPlayer = (data)=>{
    let removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(data.userId);
    allOnlineUsers.splice(removeIndex,1)
    return data.userId;
}// End kill Player

//random direction
let randDirX = ()=>{
    let dir=["right","left"];
    let randDirectX=dir[Math.floor(Math.random() * dir.length)];
    return randDirectX;
}

let randDirY = ()=>{
    let dir=["up","down"];
    let randDirectY=dir[Math.floor(Math.random() * dir.length)];
    return randDirectY;
}//end random direction




//Creating Obstacles
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


function createObstacles() {
    this.id = shortid.generate();
    this.X = Math.floor(Math.random() * gameConfig.boundXLimit);
    this.Y = Math.floor(Math.random() * gameConfig.boundYLimit);
    this.Xdir=randDirX();
    this.Ydir=randDirY();
    this.health =gameConfig.maxObjectHealth;
    this.type =getRndInteger(1,4);
}//End Createing Obstacles


//reverse dir
let reverseDir = (dir)=>{
    if(dir=="up"){
        return "down";
    }else if(dir=="down"){
        return "up";
    }else if(dir=="right"){
        return "left";
    }else if(dir=="left"){
        return "right";
    }

}//end reverse dir



//Updating Positions of Objects
let updatePos = ()=>{
    //(with for loop time complexity is O(n),can be improved to O(1) if redis hash used)
    for(obj of allObstacles){

        if(obj.Xdir=="right" && obj.X<gameConfig.boundXLimit){
            obj.X+=0.3;
        }else if(obj.Xdir=="right" && obj.X>=gameConfig.boundXLimit){
            //console.log("upper X limit reached,current direction :" + obj.Xdir)
            obj.Xdir=reverseDir(obj.Xdir);
            //console.log("direction reversed to :" + obj.Xdir)
            obj.X-=1;
        }

        if(obj.Xdir=="left" && obj.X>150){
            obj.X-=0.3;
        }else if(obj.Xdir=="left" && obj.X<=150){
            //console.log("lower X limit reached,current direction :" + obj.Xdir)
            obj.Xdir=reverseDir(obj.Xdir);
            //console.log("direction reversed to :" + obj.Xdir)
            obj.X+=1;
        }
   
       if(obj.Ydir=="down" && obj.Y<gameConfig.boundYLimit){
           obj.Y+=0.3;
       }else if(obj.Ydir=="down" && obj.Y>=gameConfig.boundYLimit){
           //console.log("upper Y limit reached,current direction :" + obj.Ydir)
           obj.Ydir=reverseDir(obj.Ydir);
           //console.log("direction reversed to :" + obj.Ydir)
           obj.Y-=1;
       }

       if(obj.Ydir=="up" && obj.Y>150){
           obj.Y-=0.3;
       }else if(obj.Ydir=="up" && obj.Y<=150){
           //console.log("lower Y limit reached,current direction :" + obj.Ydir)
           obj.Ydir=reverseDir(obj.Ydir);
           //console.log("direction reversed to :" + obj.Ydir)
           obj.Y+=1;
       }

    }

}//End Updating Object Positions

//Object Collision with Bullets(with for loop time complexity is O(n),can be improved to O(1) if redis hash used)
let getObj = (data)=>{
    for(obj of allObstacles){
        if((obj.id==data.obstacleID) && data.isHit){
            return obj;


        }
    }

}//End Object Collision

//Object Killed(with for loop time complexity is O(n),can be improved to O(1) if redis hash used)
let killObj = (data)=>{
    //console.log("An Object has been Killed")
    let removeObjIndex = allObstacles.map(function(object) { return object.id; }).indexOf(data.id);
    let newObj = new createObstacles();
    allObstacles.splice(removeObjIndex,1,newObj);
    return newObj;


}//End Object Killed




//Start Socket-io Code
let setServer = (server) => {

    
    

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection',(socket) => {

        socket.on('addUser',() => {

            
            // setting socket user id 
            socket.userId = shortid.generate()
             
            
            console.log(`${socket.userId} is online`);
            let userPosX = Math.floor(Math.random() * gameConfig.boundXLimit);
            let userPosY = Math.floor(Math.random() * gameConfig.boundYLimit);
            let userCamPosX = userPosX - 640;
            let userCamPosY = userPosY - 360;
            let userMaxHealth = gameConfig.maxPlayerHealth;


            let userObj = {userId:socket.userId,userMaxHealth:userMaxHealth,X:userPosX,Y:userPosY,camPosX:userCamPosX,camPosY:userCamPosY,createdOn:Date.now()}
            allOnlineUsers.push(userObj);
           
            socket.emit("user_connected", response.generate(false,"User Added",1,userObj));


            socket.on("gameRequest",(data)=>{

                console.log("Game Request Received")
                let gameConf = {};
                gameConf.setBoundX=gameConfig.setBoundX
                gameConf.setBoundY=gameConfig.setBoundY
                gameConf.gameCameraHeight=gameConfig.gameCameraHeight
                gameConf.gameCameraWidth=gameConfig.gameCameraWidth
                gameConf.boundXLimit=gameConfig.boundXLimit
                gameConf.boundYLimit=gameConfig.boundYLimit
                gameConf.maxNumberOfObstacles=gameConfig.maxNumberOfObstacles
                gameConf.maxObjectHealth=gameConfig.maxObjectHealth
                gameConf.maxPlayerHealth=gameConfig.maxPlayerHealth
                socket.emit("gameReply",response.generate(false,"Game Config",1,gameConf))
                //let currentUser = data;
                let currentUser = getPlayer(data);
                currentUser.userName = data.userName;

                 // setting room name
                 socket.room = 'gameRoom'
                 // joining game-room.
                 socket.join(socket.room)
                 currentUser.room = socket.room;
                 //allOnlineUsers.push(userObj)//Using redis hash should improve performance
                 var userIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(data.userId);
                 allOnlineUsers.splice(userIndex,1,currentUser)
                 console.log("all online users :",allOnlineUsers)
                 socket.emit("connected_room", response.generate(false,"User entered room",1,allOnlineUsers));

                 socket.to(socket.room).broadcast.emit('user_entered',response.generate(false,"New user enter to room",1,currentUser));
            })


2
          
        }) // end of listening addUser and gameRequest event
        
        //Handling Player movement
        socket.on("playerMovementDirection",(data)=>{
            console.log("Player Movement Data for : "+data.userId);
            console.log("Current Player List :" ,allOnlineUsers)
           let currentPlayer = getPlayer(data);

            if(check.isEmpty(currentPlayer)){
                io.in(socket.room).emit("playerMovementUpdate",response.generate(true,"data received with some error,No such player found in list",0,currentPlayer))
                //myIo.emit("playerMovementUpdate",response.generate(true,"data received with some error,No such player found in list",0,currentPlayer))


            }else{
                console.log("Current Player : "+ currentPlayer.userId);
                let playerMove = updatePlayerPos(data,currentPlayer);

                io.in(socket.room).emit("playerMovementUpdate",response.generate(false,"Player Movement Updated",1,playerMove))
                //myIo.emit("playerMovementUpdate",response.generate(false,"Player Movement Updated",1,playerMove))

            }
                
        })//End Handling Player Movement

        //Handling Turret Rotation
        socket.on("playerRotationEmit",(data)=>{
            //console.log("Turret Rotation Data received : " + data.playerAngle);
            //console.log("Data is about to be emitted to room :" + socket.room)
            socket.to(socket.room).broadcast.emit("playerRotationOn",data);
            //console.log("Data Emitted")
        })//End Turret Rotation

        //Handling Bullet fire
        socket.on("playerFireEmit",(data)=>{
            //console.log("Bullet fire Data received : " + data.isFire);
            //console.log("Data is about to be emitted to room :" + socket.room)
            io.in(socket.room).emit("playerFireOn",data);
            //console.log("Data Emitted")
        })//End Bullet fire
        


       //Handling createObstacle Event
        socket.on("createObstacle",()=>{
        
           if(allObstacles.length==0){
               for(i=0;i<gameConfig.maxNumberOfObstacles;i++){
                   let obstacle = new createObstacles();
                   allObstacles.push(obstacle);//Using redis hash should improve performance
                   

               }
           }

         //console.log(allObstacles);
         socket.emit("obstacleList",response.generate(false,"Obstacle List",1,allObstacles))
        })//End Create Obstacle

       

        //Handling Obstacle Movement
       socket.on("updatePos",(data)=>{
        console.log("updatePos Received");
    
            if(data.isObstaclesCreated){ 
                startMyInterVal=setInterval(()=>{
                 updatePos()

                 socket.emit("obstacleMovement",allObstacles)
                },1200/24)
                 
                               

            }


        })
        //Handling Player Hit
        socket.on("playerHit",(data)=>{
            let playerHurt = getPlayer(data);//Aynchronous code can be used to improve performance
            if(data.hitType=="bullet"){

                
                if(check.isEmpty(playerHurt)){
                    socket.emit("playerHealthUpdate",response.generate(true,"data received with some error,No such player found in list",0,playerHurt))
    
                }else{
                    if(playerHurt.userMaxHealth>0.1){
                        playerHurt.userMaxHealth-=0.1;
                        playerHurt.isDead=false;
                        playerHurt.hitType="bullet";
                        io.in(socket.room).emit("playerHealthUpdate",playerHurt)

                    }else{
                        let deadPlayer = killPlayer(playerHurt);
                        console.log("user is killed :");
            
                        console.log(deadPlayer);
                        io.in(socket.room).emit("userKilled",{userId:deadPlayer})
                    }

                   
                }

            }else if(data.hitType=="obstacle"){
                if(check.isEmpty(playerHurt)){
                    socket.emit("playerHealthUpdate",response.generate(true,"data received with some error,No such player found in list",0,playerHurt))
                }else if(data.obstacleType==3){
                    //console.log(data.userId+"hit by pentagon");
                    if(playerHurt.userMaxHealth>0.05){
                        playerHurt.userMaxHealth-=0.05;
                        playerHurt.isDead=false;
                        playerHurt.hitType="obstacle";
                        io.in(socket.room).emit("playerHealthUpdate",playerHurt)

                    }else{
                        let deadPlayer = killPlayer(playerHurt);
                        console.log("user is killed :");
            
                        console.log(deadPlayer);
                        io.in(socket.room).emit("userKilled",{userId:deadPlayer})
                    }
                }else if(data.obstacleType==2){
                    //console.log(data.userId+"hit by triangle");
                    if(playerHurt.userMaxHealth>0.033){
                        playerHurt.userMaxHealth-=0.033;
                        playerHurt.isDead=false;
                        playerHurt.hitType="obstacle";
                        io.in(socket.room).emit("playerHealthUpdate",playerHurt)

                    }else{
                        let deadPlayer = killPlayer(playerHurt);
                        console.log("user is killed :");
            
                        console.log(deadPlayer);
                        io.in(socket.room).emit("userKilled",{userId:deadPlayer})
                    }

                }else if(data.obstacleType==1){
                    //console.log(data.userId+"hit by triangle");
                    if(playerHurt.userMaxHealth>0.025){
                        playerHurt.userMaxHealth-=0.025;
                        playerHurt.isDead=false;
                        playerHurt.hitType="obstacle";
                        io.in(socket.room).emit("playerHealthUpdate",playerHurt)
                    }else{
                        let deadPlayer = killPlayer(playerHurt);
                        console.log("user is killed :");
            
                        console.log(deadPlayer);
                        io.in(socket.room).emit("userKilled",{userId:deadPlayer})
                    }


                }

            }


        })//End Player Hit


        //Handling Obstacle Hit
        socket.on("obstacleHit",(data)=>{
            let obsObj = getObj(data);//Aynchronous code can be used to improve performance
            if(data.hitType=="bullet"){
                
                if(check.isEmpty(obsObj)){
                    socket.emit("obstacleHealthUpdate",response.generate(true,"data received with some error,No such object found in list",0,obsObj))
    
                }else{
                   
                    if(obsObj.type==1){
                        if(obsObj.health>0.25){
                            obsObj.health-=0.25;
                            obsObj.isDead=false;
                            obsObj.hitType="bullet";
                            socket.emit("obstacleHealthUpdate",obsObj)
        
                        }else{
                           let newObject = killObj(obsObj);
                           
                           obsObj.isDead=true;
                           obsObj.hitType="bullet";
                           socket.emit("obstacleHealthUpdate",obsObj)
    
                           socket.emit("obstacleKilled",newObject);
                        }   
                    }else if(obsObj.type==2){
                        if(obsObj.health>0.20){
                            obsObj.health-=0.20;
                            obsObj.isDead=false;
                            obsObj.hitType="bullet";
                            socket.emit("obstacleHealthUpdate",obsObj)
        
                        }else{
                            let newObject = killObj(obsObj);
                            obsObj.isDead=true;
                            obsObj.hitType="bullet";
                            socket.emit("obstacleHealthUpdate",obsObj)
                            socket.emit("obstacleKilled",newObject);
        
                        }     
                    }else if(obsObj.type==3){
                        if(obsObj.health>0.1){
                            obsObj.health-=0.1;
                            obsObj.isDead=false;
                            obsObj.hitType="bullet";
                            socket.emit("obstacleHealthUpdate",obsObj)
        
                        }else{
                            let newObject = killObj(obsObj);
                            obsObj.isDead=true;
                            obsObj.hitType="bullet";
                            socket.emit("obstacleHealthUpdate",obsObj)
                            socket.emit("obstacleKilled",newObject);
        
                        }
                    }
    
                }

            }else if(data.hitType=="player"){
                if(check.isEmpty(obsObj)){
                    socket.emit("obstacleHealthUpdate",response.generate(true,"data received with some error,No such object found in list",0,obsObj))
                }else if(obsObj.type==3){
                    if(obsObj.health>0.125){
                        obsObj.health-=0.125;
                        obsObj.isDead=false;
                        obsObj.hitType="player";
                        socket.emit("obstacleHealthUpdate",obsObj)

                    }else{
                        let newObject = killObj(obsObj);
                        obsObj.isDead=true;
                        obsObj.hitType="player";
                        socket.emit("obstacleHealthUpdate",obsObj)
                        socket.emit("obstacleKilled",newObject);

                    }
                }else if(obsObj.type==2){
                    if(obsObj.health>0.25){
                        obsObj.health-=0.25;
                        obsObj.isDead=false;
                        obsObj.hitType="player";
                        socket.emit("obstacleHealthUpdate",obsObj)

                    }else{
                        let newObject = killObj(obsObj);
                        obsObj.isDead=true;
                        obsObj.hitType="player";
                        socket.emit("obstacleHealthUpdate",obsObj)
                        socket.emit("obstacleKilled",newObject);

                    }

                }else if(obsObj.type==1){
                    let newObject = killObj(obsObj);
                    obsObj.isDead=true;
                    obsObj.hitType="player";
                    socket.emit("obstacleHealthUpdate",obsObj)
                    socket.emit("obstacleKilled",newObject);

                }

            }




            


        })//End Obstacle Hit
       
 


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            
            console.log(socket.userId);
            clearInterval(startMyInterVal)
            console.log("Interval Cleared")

            //Using redis hash should improve performance
            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            //console.log(allOnlineUsers)

            socket.to(socket.room).broadcast.emit('userDisconnected',{userId:socket.userId});
            socket.leave(socket.room)


            

        


        }) // end of on disconnect





    });

}



module.exports = {
    setServer: setServer
}
