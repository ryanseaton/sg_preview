/**
* The BitmapText Pulse Animation class constructor.
*
* @class BitmapTextPulseAnimation
* @constructor
* @param {SlapGame.Level} gameContext - Reference to the current game level instance.
* @param {Phaser.BitmapText} bitmapText - The BitmapText to animate.
*/
BitmapTextPulseAnimation = function(gameContext, bitmapText) {
	this.gameContext = gameContext;
	this.isComplete = false;
	this.bitmapText = bitmapText;
	this.isRunning = false;

	this.timerSound = this.gameContext.add.audio('timerSound');
	
	this.textTween = this.gameContext.add.tween(this.bitmapText);
	this.textTween.to({fontSize:this.bitmapText.fontSize+35}, 500, Phaser.Easing.Sinusoidal.In, false, 0, false,  false);
	this.textTween2 = this.gameContext.add.tween(this.bitmapText);
	this.textTween2.to({fontSize:this.bitmapText.fontSize}, 500, Phaser.Easing.Sinusoidal.In, false, 0, false,  false);
	this.textTween2.onComplete.add(function() {
		this.textTween.start();
		this.timerSound.play();
	}, this);
	this.textTween.onComplete.add(function() {
		this.textTween2.start();
	}, this);
	
	
};

BitmapTextPulseAnimation.prototype = {
	start: function() {		
		this.textTween.start();
		this.timerSound.play();
		this.isRunning = true;
	},
	
	stop: function() {
		this.bitmapText.fontSize = CONFIG.LEVEL_TIME_FONT_SIZE;
		this.textTween.stop();
		this.textTween2.stop();
		this.isRunning = false;

	},

	stopSounds: function() {

	},
	
	destroy: function() {
		this.timeText.destroy();
		delete this.timeText;
	}
		
};