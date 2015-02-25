GlowAnimation = function(gameContext,sprite) {
//	this.bArray = [0xFFFF00,0xFFFF11,0xFFFF22,0xFFFF33,0xFFFF44,0xFFFF55,0xFFFF66,0xFFFF77,0xFFFF99,0xFFFF99
//	               ,0xFFFFAA,0xFFFFBB,0xFFFFCC,0xFFFFDD,0xFFFFEE,0xFFFFFF];
	this.bArray = [0xFFFF00,0xFFFF22,0xFFFF44,0xFFFF66,0xFFFF99
	               ,0xFFFFAA,0xFFFFCC,0xFFFFEE];
	this.sprite = sprite;
	this.bIndex = 0;
	this.gameContext = gameContext;
	this.mode = 'up';

	this.clock = this.gameContext.time.create(false);
	this.clock.name = "glowAnim";
	this.clock.loop(Phaser.Timer.SECOND/12, this.updateTimer, this);
};

GlowAnimation.prototype = {
	start: function () {
		this.bIndex = 0;
		this.mode = 'up';
		this.clock.start();
	},
	
	stop: function () {
		this.clock.stop();
		this.sprite.tint = 0xFFFFFF;
		this.clock.loop(Phaser.Timer.SECOND/13, this.updateTimer, this);
	},

	updateTimer: function () {
		if (!this.gameContext.paused) {
			this.sprite.tint = this.bArray[this.bIndex];
			if (this.mode == 'up') {
				if (this.bIndex == this.bArray.length -1) {
					this.mode = 'down';
				} else {
					this.bIndex++;
				}
			} else if (this.mode = 'down') {
				if (this.bIndex == 0) {
					this.mode = 'up';
				} else {
					this.bIndex--;
				}
			}

		} else {
			//do nothing for now
		}
	}
		
};