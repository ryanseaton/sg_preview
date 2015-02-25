LoseAnimation = function(gameContext) {
	this.maxTextSize = 100;
	this.gameContext = gameContext;
	
	this.finalX = 460;
	this.finalY = 200;
	this.finalFontSize = 100;
	this.maxTextHeight = this.gameContext.game.world.centerY-150;
	
	this.mode = 'return-to-center';
	this.isCentered = false;
	this.isTweenComplete = false;
	
	this.loseText = this.gameContext.add.bitmapText(this.gameContext.game.world.centerX-5, 0
			, 'titleLimeFont',STRINGS.TIME_UP,10);
	this.clock = this.gameContext.time.create(false);
	this.clock.name = "loseAnimation";
	this.clock.loop(Phaser.Timer.SECOND/20, this.updateTimer, this);
	this.loseSound = this.gameContext.add.audio('loseSound');
	
	this.laughSound = this.gameContext.add.audio('slowLaugh');

	
};

LoseAnimation.prototype = {
	start: function () {
		this.loseSound.play();
		this.gameContext.resetButton.visible = false;
		this.clock.start();
		this.tweenIn();
	},
	
	stopSounds: function() {
		this.laughSound.stop();
		this.loseSound.stop();
	},
	
	tweenIn: function() {
		tween = this.gameContext.add.tween(this.loseText);
		tween.to({y:this.finalY, x:this.finalX, fontSize:this.finalFontSize}, 1500, Phaser.Easing.Bounce.Out, false, 0, false,  false);
		tween.start();
		tween.onComplete.add(function() {
			this.isTweenComplete = true;
		}, this);
	},
	
	startLaugh: function () {
		this.clock.stop();
		this.mode = 'laugh';		
		this.clock.loop(Phaser.Timer.SECOND/16, this.updateTimer, this);
		this.clock.start();
		this.laughSound.volume = 0.8;
		if (this.gameContext.LEVEL_DEFINITION.failSound) {
			this.laughSound.play();
		}
		if (this.gameContext.LEVEL_DEFINITION.failAnimation) {
			GUY_ANIMATION_MANAGER.playAnimation(this.gameContext.LEVEL_DEFINITION.failAnimation.name
					, this.gameContext.blake, 16, this.gameContext.LEVEL_DEFINITION.failAnimation.repeat);
		}
	},
	
	doWait: function() {
		this.clock.stop();
		this.mode = 'wait';
		seconds = 3;
		this.clock.loop(Phaser.Timer.SECOND*seconds, this.updateTimer, this);
		this.clock.start();
	},
	
	showTryAgain: function() {
		this.gameContext.againButton = this.gameContext.add.button(this.gameContext.game.world.centerX, this.gameContext.game.world.centerY+230
				, 'buttons', this.gameContext.resetGame, this.gameContext, 1, 0, 1, 0);
		this.gameContext.againButton.onDownSound = this.gameContext.menuSound;
		this.gameContext.againButton.anchor.setTo(0.5,0.5);
	},

	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.mode == 'return-to-center') {
				if (!this.isTweenComplete) {
					if (!this.isCentered) {
						this.returnToCenter();
					}
				} else {
					this.startLaugh();
				}
			} else if (this.mode == 'laugh'){
				
					if (SHIELD_MANAGER.hasShield() && !SHIELD_MANAGER.isShieldBroken) {
						if (SHIELD_MANAGER.shield.alpha > 0.2) {
							SHIELD_MANAGER.shield.alpha -= 0.05;
						} else {
							this.doWait();
						}
					} else {
						this.doWait();
					}
			}  else if (this.mode == 'wait') {
				this.clock.stop();
				this.clock.removeAll();
				this.showTryAgain();
			}
		}
	},
	
	returnToCenter : function () {
		if (Math.abs(this.gameContext.anchor.x - this.gameContext.game.world.centerX) < 25 && Math.abs(this.gameContext.anchor.y - this.gameContext.game.world.centerY) < 25) {
			this.gameContext.anchor.body.velocity.x = 0;
			this.gameContext.anchor.body.velocity.y = 0;
			this.isCentered = true;
        } else {
        	xDistance = this.gameContext.game.world.centerX - this.gameContext.anchor.x;
        	yDistance = this.gameContext.game.world.centerY - this.gameContext.anchor.y;
        	xBaseSpeed = xDistance  < 0 ? -50 : 50;
        	yBaseSpeed = yDistance  < 0 ? -50 : 50;
        	this.gameContext.anchor.body.x += xBaseSpeed;
        	this.gameContext.anchor.body.y += yBaseSpeed;

        }
	}
		
};