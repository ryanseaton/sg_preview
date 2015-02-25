WinAnimation = function(gameContext) {
	this.maxTextSize = 100;
	this.gameContext = gameContext;
	
	this.finalX = 333;
	this.finalY = 331;
	this.finalFontSize = 106;
	this.maxTextHeight = this.gameContext.game.world.centerY-150;

	this.scoreCount = 0;
	this.scoreString = "0000";
	
	this.congratSounds = [this.gameContext.add.audio('allRightSound'), this.gameContext.add.audio('yeahSound')];
	this.winSound = this.gameContext.add.audio('winSound');
	this.winText = null;
	
};

WinAnimation.prototype = {
	start: function () {
		this.playWinSounds();
		this.gameContext.resetButton.visible = false;
		this.expand();
		//this.winClock.start();
		if (this.gameContext.LEVEL_DEFINITION.successAnimation) {
			GUY_ANIMATION_MANAGER.playAnimation(this.gameContext.LEVEL_DEFINITION.successAnimation.name
					, this.gameContext.blake, 13, this.gameContext.LEVEL_DEFINITION.successAnimation.repeat);
		}
	},

	expand: function() {
		//this.winSound.play();
		//this.winClock.stop();
		this.winText = this.gameContext.add.bitmapText(this.gameContext.game.world.centerX, this.gameContext.game.world.centerY
				, 'winFont',STRINGS.LEVEL_PASSED,10);
		
		
		tween = this.gameContext.add.tween(this.winText);
		tween.to({y:this.finalY, x:this.finalX, fontSize:this.finalFontSize}, 1500, Phaser.Easing.Circular.Out, false, 0, false,  false);
		tween.start();
		tween.onComplete.add(function() {
			this.slideUp();
		}, this);
	},
	
	
	stopSounds: function() {
		this.winSound.stop();
		if (this.crySound) {
			this.crySound.stop();
		}
	},

	
	showScore: function () {
		this.winClock.stop();
		this.mode = 'score';

		this.scoreText = this.gameContext.add.bitmapText(this.gameContext.game.world.centerX-220, this.gameContext.game.world.centerY-50
				, 'titleDarkFont',STRINGS.LBL_SCORE+this.scoreString,80);

		this.winClock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
		this.winClock.start();
	},
	
	slideUp: function () {

		tween = this.gameContext.add.tween(this.winText);
		tween.to({y:this.maxTextHeight }, 1000, Phaser.Easing.Quartic.Out, false, 0, false,  false);
		tween.start();
		tween.onComplete.add(function() {
			this.showContinue();
		}, this);
		
	},
	
	showContinue: function() {
		this.gameContext.continueButton = this.gameContext.add.button(this.gameContext.game.world.centerX, this.gameContext.game.world.centerY+100
				, 'buttons', this.gameContext.goToNextLevel, this.gameContext, 11, 10, 11, 10);
		this.gameContext.continueButton.onDownSound = this.gameContext.menuSound;
		this.gameContext.continueButton.anchor.setTo(0.5,0.5);
		if (this.gameContext.LEVEL_DEFINITION.successSound) {
			this.crySound.play();
		}
	},

	playWinSounds: function() {
		congratSound = this.getRandomCongratSound();
		congratSound.onStop.addOnce(function() {
			this.winSound.play();
		}, this);
		congratSound.play();
	},
	
	getRandomCongratSound: function() {
		var i = Math.floor(Math.random()*this.congratSounds.length);
		this.congratSounds[i].volume = 7;
		return this.congratSounds[i];
	}
		
};