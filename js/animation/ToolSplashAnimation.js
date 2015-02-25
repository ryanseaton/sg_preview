ToolSplashAnimation = function(gameContext, sprite, animationManager, splashSound) {
	this.animationManager = animationManager;
	this.sprite = sprite;
	this.gameContext = gameContext;
	this.powerUpSound = splashSound;
	//console.log(this.powerUpSound);
	
	this.clock = this.gameContext.time.create(false); 
	this.clock.name = "toolsplash";
	this.clock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
	
};

ToolSplashAnimation.prototype = {
	start: function (xCoord, yCoord) {
		this.sprite.x = xCoord;
		this.sprite.y = yCoord;
		this.sprite.anchor.setTo(0.5,0.5);
		this.sprite.visible = true;
		this.sprite.alpha = 1.0;
		this.sprite.scale.x = 1.0;
		this.sprite.scale.y = 1.0;
		if (this.animationManager) {
			this.animationManager.playAnimation(this.animationManager.loadedAnimations[0], this.sprite, 17, false);
		}
		this.clock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
		this.clock.start();
		this.powerUpSound.play();

	},
	
	stop: function() {
		this.clock.stop();
		if (this.animationManager) {
			this.animationManager.stopAnimations();
		}
		this.clock.removeAll();
		this.sprite.visible = false;
//		this.sprite.destroy();
	},

	stopSounds: function() {
		this.powerUpSound.stop();
	},
	
	destroy: function() {
		if (this.animationManager) {
			this.animationManager.clearAnimations();
			delete this.animationManager;
		}
		this.sprite.destroy();
		delete this.sprite;
	},

	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.sprite.alpha > 0.1) {
				this.sprite.scale.x += 0.2;
				this.sprite.scale.y += 0.2;
				this.sprite.alpha -= 0.1;
			} else {
				this.stop();
			}
		} else {
			//do nothing for now
		}
	}		
};