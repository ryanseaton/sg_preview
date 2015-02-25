/**
* The Game's Countdown Timer constructor.
* between levels.
* @class GameTimer
* @constructor
* @param {Slapgame.Level} gameContext - Reference to the game level instance.
* @param timeLimit
* @param {Phaer.BitmapText} bitmapTextDisplay
*/
GameTimer = function (gameContext, timeLimit, bitmapTextDisplay) {
	this.gameContext = gameContext;
	this.timeLimit = timeLimit;
	this.timeLeft = timeLimit;
	this.totalTime = 0;
	this.textDisplay = bitmapTextDisplay;
	this.addTimeAnimation = null;
	//timer for the clock
	this.clock = this.gameContext.time.create(false); 
	this.clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
	this.pulseAnimation = new BitmapTextPulseAnimation(this.gameContext, this.textDisplay);
};

GameTimer.prototype = {
	start: function () {
		this.isTimeUp = false;
		this.clock.start();
	},
	
	pause: function() {
		this.clock.pause();
	},
	
	resume: function() {
		this.clock.resume();
	},
	
	stop: function () {
		this.clock.stop();
		this.clock.removeAll();
		this.pulseAnimation.stop();
	},

	timeUp: function() {		
		this.isTimeUp = true;
		this.stop();
		//this.gameContext.failLevel();
	},
	
	addTime: function(extraTime) {
		this.timeLeft += extraTime;
		this.addTimeAnimation = new AddTimeAnimation(this.gameContext, extraTime);
		this.addTimeAnimation.start();
	},
	
	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.addTimeAnimation) {
				if (this.addTimeAnimation.isComplete) {
					this.addTimeAnimation.destroy();
					delete this.addTimeAnimation;
				}
			}
			if (this.timeLeft == 0) {
				this.pulseAnimation.stop();
				this.timeUp();
				return;
			} else if (this.timeLeft == 6) {
				this.textDisplay.fontName = 'titleRedFont';
				this.pulseAnimation.start();
			} else if (this.timeLeft > 6 && this.pulseAnimation.isRunning) {
				this.textDisplay.fontName = 'titleFont';
				this.pulseAnimation.stop();
			}
			this.totalTime++;
			this.timeLeft--;
			this.textDisplay.setText(this.timeLeft.toString().toMMSS());
			if (this.gameContext.debug) {
				console.log("p2 bodies: "+this.gameContext.game.physics.p2.total);
				console.log("# timers: "+this.gameContext.time._timers.length);
				console.log("sprites: "+this.gameContext.world.children.length);
			}
			
		} else {
			//do nothing for now
		}
	}
		
};
