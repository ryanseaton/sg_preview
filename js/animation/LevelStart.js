LevelStart = function(gameContext) {
	this.gameContext = gameContext;

	this.isComplete = false;
	this.startBuffer = Phaser.Timer.SECOND;
	this.fontSize = 180;
	this.mode = "startBuffer";
	
	this.x = this.gameContext.game.world.centerX-230;
	this.y = this.gameContext.game.world.centerY-150;

	
	this.startText = this.gameContext.add.bitmapText(this.x, this.y
			, 'winFont',"",this.fontSize);
	
	
	this.tween = this.gameContext.add.tween(this.startText);
	this.tween.to({y:this.gameContext.game.world.height-140}, 1000, Phaser.Easing.Elastic.In, false, 0, false,  false);

	this.clock = this.gameContext.time.create(false);
	this.clock.loop(this.startBuffer, this.updateTimer, this);
	this.clock.name = "LevelStart";
	this.startSound = this.gameContext.add.audio('startSound');
	this.startSound.volume = 0.7;
	this.goSound = this.gameContext.add.audio('goSound');
	this.goSound.volume = 0.7;
	
};

LevelStart.prototype = {
	start: function () {
		this.clock.start();
	},
	
	stopSounds: function() {
		this.startSound.stop();
		this.goSound.stop();
	},
	
	doReady: function () {
		this.mode = 'ready';
		this.startSound.play();
		this.startText.setText(STRINGS.READY_LEVEL);
		//set the default guy animation for the level
		if (this.gameContext.LEVEL_DEFINITION.startingAnimation) {
			GUY_ANIMATION_MANAGER.playAnimation(this.gameContext.LEVEL_DEFINITION.startingAnimation.name, this.gameContext.blake, 17, this.gameContext.LEVEL_DEFINITION.startingAnimation.repeat);
		}
	},

	
	doStart: function () {
		this.mode = 'finished';
		this.goSound.play();
		this.startText.setText(STRINGS.START_LEVEL);
		this.startText.x += 40;
		this.tween.start();
	},
	
	endAnimation: function() {
		this.clock.stop();
		this.tween.stop();
		this.clock.removeAll();
		this.startText.visible = false;
		this.isComplete = true;
	},

	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.mode == 'startBuffer') {
				this.doReady();
			} else if (this.mode == 'ready'){
				this.doStart();
			} else if (this.mode == 'finished') {
				this.endAnimation();
			}
		}
	}
		
};