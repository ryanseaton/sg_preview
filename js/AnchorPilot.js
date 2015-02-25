/**
* The Guy's Anchor Pilot constructor.
* The anchor pilot moves the invisible anchor that is
* attached to the guy by a spring. Moving the anchor rather than
* the guy itself gives the smooth motion.
* @class AnchorPilot
* @constructor
* @param {Slapgame.Level} gameContext - Reference to the game level instance.
* @param {Phaser.Sprite} anchor - the anchor's sprite
* @param speed - a multiplier to set the anchor's speed
* @param factor - how erratic the anchor movement should be; a decimal value between 0 and 1
*/
AnchorPilot = function(gameContext, anchor,speed, factor) {
	this.sprite = anchor;
	this.gameContext = gameContext;
	this.speed = speed*22;
	this.factor = factor;
	this.boundingBoxHeight = gameContext.scale.height*(0.60);
	this.boundingBoxWidth = gameContext.scale.width*(0.60);
	
	this.boundingBoxOrigin = {x:this.gameContext.game.world.centerX-this.boundingBoxWidth/2,
								y:this.gameContext.game.world.centerY-this.boundingBoxHeight/2};
	this.clock = this.gameContext.time.create(false); 	
	this.directionClock = this.gameContext.time.create(false);	
	this.direction = {x: 0, y: 0};
	this.isPaused = false;
};

AnchorPilot.prototype = {
	start: function () {
		this.clock.loop(Phaser.Timer.SECOND/3, this.updateTimer, this);
		this.directionClock.loop(Phaser.Timer.SECOND*(1/this.factor), this.updateFC, this);
		this.updateFC();
		this.directionClock.start();
		this.clock.start();
	},
	
	stop: function () {
		this.updateFC();
		this.clock.stop();
		this.directionClock.stop();
	},
	
	pause: function() {
		this.directionClock.pause();
		this.clock.pause();
		this.isPaused = true;
	},
	
	resume: function() {
		//this.clock.loop(Phaser.Timer.SECOND/15, this.updateTimer, this);
		//this.directionClock.loop(Phaser.Timer.SECOND*(1/this.factor), this.updateFC, this);
		if (this.isPaused) {
			this.clock.resume();
			this.directionClock.resume();
			this.isPaused = false;
		}
	},
	
	updateTimer: function() {
		if (this.gameContext.paused) {return;}
		
//		this.sprite.body.velocity.y = this.direction.y * this.speed;
//		this.sprite.body.velocity.x = this.direction.x * this.speed;
		this.sprite.body.y += this.direction.y * this.speed;
		this.sprite.body.x += this.direction.x * this.speed;
    	if (this.sprite.body.x  < this.boundingBoxOrigin.x) {
    		this.direction.x = 1;
    	} else if (this.sprite.body.x > this.boundingBoxOrigin.x+this.boundingBoxWidth) {
    		this.direction.x = -1;
    	}
    	if (this.sprite.body.y  < this.boundingBoxOrigin.y) {
    		this.direction.y = 1;
    	} else if (this.sprite.body.y > this.boundingBoxOrigin.y+this.boundingBoxHeight) {
    		this.direction.y = -1;
    	}
    	this.setVelocity();
	},
	
	updateFC: function() {
		if (this.gameContext.paused) {return;}


		this.direction.x = Math.random();

		this.direction.y = Math.random();

		this.direction.x = (this.direction.x <= 0.5) ? -1: 1;
		this.direction.y = (this.direction.y <= 0.5) ? -1: 1;
		
		this.setVelocity();
		//console.log("FC :"+this.direction.x+", "+this.direction.y);
	},
	
	setVelocity: function() {
		this.sprite.body.velocity.x = this.direction.x * this.speed;
		this.sprite.body.velocity.y = this.direction.y * this.speed;
	}

};