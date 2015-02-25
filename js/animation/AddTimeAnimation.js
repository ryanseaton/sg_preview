AddTimeAnimation = function(gameContext, time) {
	this.gameContext = gameContext;
	this.timeAmount = time;
	this.isComplete = false;
	this.timeText = this.gameContext.add.bitmapText(175, 80, 'titleRedFont',"+"+this.timeAmount,90);
	
};

AddTimeAnimation.prototype = {
	start: function (xCoord, yCoord) {		
		this.tweenOut();
	},
	
	stop: function() {
		this.clock.stop();
	},
	
	tweenOut: function() {
		this.tween = this.gameContext.add.tween(this.timeText);
		this.tween.to({y:0, alpha:0}, 1500, Phaser.Easing.Cubic.In, false, 0, false,  false);
		this.tween.start();
		this.tween.onComplete.add(function() {
			this.destroy = true;
		}, this);
	},
	
	destroy: function() {
		this.tween.destroy();
		this.timeText.destroy();
		delete this.timeText;
	},
		
};