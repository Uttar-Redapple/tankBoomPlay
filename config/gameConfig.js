let gameConfig = {};

gameConfig.setBoundX = 5500;
gameConfig.setBoundY = 5500;

gameConfig.maxNumberOfObstacles = 120;
gameConfig.maxObjectHealth=0.5;

gameConfig.maxPlayerHealth=1;

gameConfig.gameCameraHeight = 720;
gameConfig.gameCameraWidth = 1280;


gameConfig.boundXLimit =4000;
gameConfig.boundYLimit =4500;
//gameConfig.boundXLimit =250;
//gameConfig.boundYLimit =250;

module.exports = {
    setBoundX:gameConfig.setBoundX,
    setBoundY:gameConfig.setBoundY,
    gameCameraHeight:gameConfig.gameCameraHeight,
    gameCameraWidth:gameConfig.gameCameraWidth,
    boundXLimit:gameConfig.boundXLimit,
    boundYLimit:gameConfig.boundYLimit,
    maxNumberOfObstacles:gameConfig.maxNumberOfObstacles,
    maxObjectHealth:gameConfig.maxObjectHealth,
    maxPlayerHealth:gameConfig.maxPlayerHealth
}