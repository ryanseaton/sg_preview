CreditsAnimation = function(gameContext) {
	this.gameContext = gameContext;
	
	this.x = this.gameContext.game.world.centerX-50;
	this.y = this.gameContext.game.world.centerY-110;

	this.isComplete = false;
	this.counter = 0;
	this.startBuffer = Phaser.Timer.SECOND;
	this.fontSize = 100;
	this.mode = "startBuffer";
	
	
	this.clock = this.gameContext.time.create(false);
	this.clock.name = "credits";
	this.tweenClock = this.gameContext.time.create(false);
	this.clock.name = "creditsTween";
	this.startSound = this.gameContext.add.audio('startSound');
	
	this.updateTimer();
};

CreditsAnimation.prototype = {
	start: function () {
		this.clock.start();
	},
	
	stopSounds: function() {
		this.startSound.stop();
	},
	
	doBuffer: function () {
		this.clock.stop();
		this.mode = 'buffer';
		this.clock.loop(Phaser.Timer.SECOND*2, this.updateTimer, this);
		this.clock.start();	
	},

	
	doScrolling: function () {
		this.clock.stop();
		this.mode = 'scrolling';
		this.creditRole = this.gameContext.add.bitmapText(this.x, this.y
				, 'titleFont',"",this.fontSize);
		this.creditName = this.gameContext.add.bitmapText(this.x, this.y
				, 'titleDarkFont',"",this.fontSize);
		this.displayCredit();
		this.clock.loop(Phaser.Timer.SECOND*9, this.updateTimer, this);
		this.clock.start();
	},
	
	displayCredit: function() {
		this.tweenClock.stop();
		this.creditRole.alpha = 0;
		this.creditName.alpha = 0;
		this.creditRole.setText(CREDITS[this.counter].role);
		this.creditName.setText(CREDITS[this.counter].name);
		this.creditRole.x = this.gameContext.game.world.centerX-450;
		this.creditRole.y = this.gameContext.game.world.centerY-160;
		this.creditName.x = this.gameContext.game.world.centerX-700;
		this.creditName.y = this.gameContext.game.world.centerY-40;
		this.gameContext.add.tween(this.creditRole).to({ alpha: 1 }, 0, Phaser.Easing.Linear.None, true,1000)
			.to({ alpha: 1 }, 0, Phaser.Easing.Quadratic.InOut, true,2000)
			.to({ alpha: 0 }, 0, Phaser.Easing.Quadratic.InOut, true,2000);
		this.gameContext.add.tween(this.creditName).to({ alpha: 1 }, 0, Phaser.Easing.Linear.None, true,2000)
			.to({ alpha: 1 }, 0, Phaser.Easing.Quadratic.InOut, true,2000)
			.to({ alpha: 0 }, 0, Phaser.Easing.Quadratic.InOut, true,1000);
		this.counter++;
		this.tweenClock.loop(Phaser.Timer.SECOND/20, this.updateTimerForTween, this);
		this.tweenClock.start();
	},
	
	endAnimation: function() {
		this.clock.stop();
		this.clock.removeAll();
		this.tweenClock.stop();
		this.tweenClock.removeAll();
		this.isComplete = true;
	},

	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.mode == 'startBuffer') {
				this.doBuffer();
			} else if (this.mode == 'buffer'){
				this.doScrolling();
			} else if (this.mode == 'scrolling') {
				if (this.counter < CREDITS.length) {
					this.displayCredit();
				} else {
					this.endAnimation();
					this.gameContext.quitGame();
				}
			}
		} else {
			//do nothing for now
		}
	},
	
	updateTimerForTween: function () {
		if (!this.gameContext.paused) {
			this.creditRole.x += 3;
			this.creditName.x += 6;
		} else {
			//do nothing for now
		}
	}
		
};