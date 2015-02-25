BlinkManager = function(gameContext, blinkSprite) {
	this.BLINK_INTERVAL = 3; //seconds
	this.BLINK_CHANCE = 0.5;
	this.gameContext = gameContext;
	this.blinkSprite = blinkSprite;

	this.clock = this.gameContext.time.create(false);
	this.clock.name = "blinkManager";
	this.clock.loop(Phaser.Timer.SECOND*this.BLINK_INTERVAL, this.updateTimer, this);

};

BlinkManager.prototype = {
	start: function () {
		this.clock.start();
	},
	
	stop: function() {
		this.clock.stop();
	},
	
	decideToBlink: function() {
		rnd = Math.random();
		return rnd < this.BLINK_CHANCE;
	},


	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.decideToBlink) {
				if (GUY_ANIMATION_MANAGER.isPlayingDefaultAnimation()) {
					GUY_ANIMATION_MANAGER.playAnimation("blink", this.blinkSprite, 17, false);
				}
			}
		} else {
			//do nothing
		}
	}
		
};