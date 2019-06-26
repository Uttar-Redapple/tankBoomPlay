var Utils = {
    //All Button Control
    ButtonSettingsControl: function(buttonObj, posX, posY, imageName, OnInputDownEvent, OnInputHoverEvent, OnInputOutEvent, OnInputUpEvent, isSetAnchor, isSetScale, anchorX, anchorY, scaleX, scaleY, referenceClass) {
        buttonObj = game.add.sprite(posX, posY, imageName);
        if (isSetAnchor == "true") {
            buttonObj.anchor.setTo(anchorX, anchorY);
        }
        if (isSetScale == "true") {
            buttonObj.scale.setTo(scaleX, scaleY);
        }
        buttonObj.inputEnabled = true;
        if (OnInputDownEvent != null)
            buttonObj.events.onInputDown.add(OnInputDownEvent, referenceClass);
        if (OnInputHoverEvent != null)
            buttonObj.events.onInputOver.add(OnInputHoverEvent, referenceClass);
        if (OnInputOutEvent != null)
            buttonObj.events.onInputOut.add(OnInputOutEvent, referenceClass);
        if (OnInputUpEvent != null)
            buttonObj.events.onInputUp.add(OnInputUpEvent, referenceClass);
        return buttonObj;
    },
    //All Sprite Control
    SpriteSettingsControl: function(spriteObj, posX, posY, imageName, isSetAnchor, isSetScale, anchorX, anchorY, scaleX, scaleY, isInputEnable) {
        spriteObj = game.add.sprite(posX, posY, imageName);
        if (isSetAnchor == "true") {
            spriteObj.anchor.setTo(anchorX, anchorY);
        }
        if (isSetScale == "true") {
            spriteObj.scale.setTo(scaleX, scaleY);
        }
        if (isInputEnable == "true")
            spriteObj.inputEnabled = true;
        return spriteObj;
    },

    //ScaleManager of All
    ScaleManager: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },

    //FOR GENERATE THE NUMBER WITH 0 OR WITHOUT 0 FORMAT
    getZeroPaddedString: function(number) {
        var string;
        if (number < 10) {
            string = '0' + number;
        } else {
            string = '' + number;
        }

        return string;
    }, //END OF getZeroPaddedString FUNCTION

    //FOR GET THE RANDOM NUMBER
    getRandomNumber: function(min, max) {
        return parseInt(min + Math.random() * (max - min + 1));
    }, //END OF getRandomNumber FUNCTION

    createTimer: function() {
        timerIcon = Utils.SpriteSettingsControl(timerIcon, 780, 50, 'timerIcon', "true", "true", 0.5, 0.5, 0.4, 0.4);
        timerIcon.tint = "0x000000";
        time.timeLabel = time.game.add.bitmapText(850, 50, 'riccicFreeFont', "10:00", 30);
        time.timeLabel.anchor.set(0.5, 0.5);
        time.timeLabel.tint = "0x000000";
        timerIcon.fixedToCamera = true;
        time.timeLabel.fixedToCamera = true;
    },

    updateTimer: function() {
        var currentTime = new Date();
        var timeDifference = time.startTime.getTime() - currentTime.getTime();

        // Time elapsed in seconds
        time.timeElapsed = Math.abs(timeDifference / 1000);

        //Time remaining in seconds
        var timeRemaining = time.totalTime - time.timeElapsed;
        var timeRemaining = time.timeElapsed;

        var minutes = Math.floor(time.timeElapsed / 60);
        var seconds = Math.floor(time.timeElapsed) - (60 * minutes);

        //Display minutes, add a 0 to the start if less than 10
        TimerResult = (minutes < 10) ? "" + minutes : minutes;


        // TimerResult = (seconds < 10) ? seconds : "" + seconds;
        if (minutes > 0) {
            // TimerResult += ":" + seconds;
            TimerResult += (seconds < 10) ? ":0" + seconds : ":" + seconds;
        } else {
            TimerResult = seconds;
        }
        // time.timeLabel.text = TimerResult + ":" + currentTime.getMilliseconds();
        var milSec = (currentTime.getMilliseconds()).toString();
        roundValue = milSec.substr(0, 1);

        totalTimeToPrint = TimerResult + ":" + roundValue;
        time.timeLabel.text = TimerResult + ":" + roundValue;
    },


};