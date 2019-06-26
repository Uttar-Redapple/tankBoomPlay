//FOR SERVER 
var baseURL = "http://18.185.97.126:6070";

var playerUniqueId;


//FOR SPLASH PAGE
var splashGroup;

//FOR MAIN MENU
var menuGroup;
var playButton;
var name_value;

//FOR GAMEPLAY
var setBoundX;
var setBoundY;
var boundXlimit;
var boundYlimit;
var gameCameraHeight;
var gameCameraWidth;
var cursors;

//Obstacles Creation
var allobstaclesRandomPosX = [];
var allobstaclesRandomPosY = [];
var allobstaclesType = [];
var allObstaclesLevel = [];
var allObstacleId = [];
var allObstacleHealth = [];
var allObstaclesObj = [];
var maxNumberOfObstacles;
var allObstacles = [];
var deadObstacleIndex;

//Player Creation
var allPlayersIdArray = [];
var maximumNumberOfPlayer;
var allPlayers = [];


//FOR GAME OVER POPUP
var gameOverPopupGroup;
var gameOverPopupOverlay;
var gameOverPopupHomeButton;
var yourScoreText;
var currentScoreValue;
var playedTimeText;
var playedTimeValue;

//Score Calculate
var score = 0;
var scoreText;
var scoreValueText;



var time;
var TimerResult;
var timerIcon;
var totalTimeToPrint;
var isTimerPaused = false;

// var isGameOver;

// var time;
// var TimerResult;
// var timerIcon;
// var totalTimeToPrint;
// var isTimerPaused = false;
// var stopwatchObj;