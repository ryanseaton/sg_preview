/**
* The Game's Health Meter constructor.
* @class HealthMeter
* @constructor
* @param {Slapgame.Level} gameContext - Reference to the game level instance.
* @param rate - the rate in pixels per second that health wil regenerate
* @param {Phaser.Sprite} meterSprite - the sprite that shows the health value
* @param {boolean} isVertical - true if the meter is vertical, false if horizontal
* @param {boolean} isStartEmpty - true if full health is represented by a an empty meter, false otherwise
*/
HealthMeter = function (gameContext, rate, meterSprite, isVertical, isStartEmpty) {
	this.isVertical = (typeof isVertical != 'undefined' && isVertical != null && isVertical ) ? true : false;
	this.isStartEmpty = (typeof isStartEmpty != 'undefined' && isStartEmpty != null && isStartEmpty ) ? true : false;
	this.sprite = meterSprite;
	this.maxVal = this.isVertical ? this.sprite.height : this.sprite.width;
	//console.log('initial height: '+this.maxVal);
	this.gameContext = gameContext;
	this.rate = rate;	
	this.value = this.isStartEmpty ? 0 : this.maxVal;
	
	this.timer = this.gameContext.time.create(false);
	this.timer.name = "hMeter";
	//this.start();
    this.timer.loop(Phaser.Timer.SECOND/8, this.updateTimer, this);

   this.initialize();
};

HealthMeter.prototype = {
	start: function () {
		this.timer.start();		
	},	
	
	pause: function() {
		this.timer.pause();
	},
	
	resume: function() {
		this.timer.resume();
	},
	
	
	stop: function () {
		this.timer.stop(false);
		this.timer.removeAll();
		if ( typeof this.coolDownTimer != 'undefined') {
			this.coolDownTimer.stop();
		}
		//console.log('awake meter stopped');
	},
	
	initialize: function() {		
	    this.value = this.isStartEmpty ? 0 : this.maxVal;
	    if (this.isStartEmpty) {
	    	this.cropRect = this.isVertical 
	    		? {x : 0, y : this.sprite.height , width : this.sprite.width, height : 0}
	    		: {x : 0, y : 0 , width : 0, height : this.sprite.height};
	    } else {
	    	this.cropRect = {x : 0, y : 0 , width : this.sprite.width, height : this.sprite.height};
	    }
	    this.isEndCondition = false;
	    this.isCoolDownComplete = false;
	    this.updateSprite();
	},
	
	boost: function (amount) {
		if (this.isStartEmpty) {
			amount = amount * -1;
		}
		if (this.value - amount < 0) {
			this.value = 0;
		} else if (this.value - amount > this.maxVal){
			this.value = this.maxVal;
		} else {
			this.value -= amount;
		}
		
		this.checkEndCondition();
		this.updateSprite();
	},
	
	coolDownReset: function(duration) {
		this.timer.stop();
		updateInterval  = 10;
		this.coolDownRate = Math.ceil(this.maxVal / (updateInterval*duration));
		this.coolDownTimer = this.gameContext.time.create(false);
		
	    this.coolDownTimer.loop(Phaser.Timer.SECOND/updateInterval, this.updateCoolDownTimer, this);
	    this.coolDownTimer.start();
	},
	
	checkEndCondition: function() {
		endValue = this.isStartEmpty ? this.maxVal : 0;
		if (this.value == endValue) {
			this.stop();
			this.isEndCondition = true;		}

	},
	
	updateCoolDownTimer: function() {
		if (!this.gameContext.paused) {
			rate = this.coolDownRate;
			value = this.value;
			if (this.isStartEmpty) {
				this.value = (0 > this.value - this.coolDownRate) ? 0 : (this.value - this.coolDownRate);
			} else {
				this.value = (this.maxVal < this.value + this.coolDownRate) ? this.maxVal : this.value + this.coolDownRate;
			}			
			this.updateSprite();
			
			//the opposite of checkEndCondition()
			endValue = this.isStartEmpty ? 0 : this.maxVal;
			if (this.value == endValue) {
				this.coolDownTimer.stop();
				this.coolDownTimer.removeAll();
				this.isCoolDownComplete = true;
				this.timer.start();
			}

		} else {
			//alert('game pause detected');
		}
	},
	
	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.isStartEmpty) {
				this.value = (0 > this.value - this.rate) ? 0 : this.value - this.rate;
			} else {
				this.value = (this.maxVal < this.value + this.rate) ? this.maxVal : this.value + this.rate;
			}
			this.updateSprite();
			
		} else {
			//alert('game pause detected');
		}
	},
	
	updateSprite: function() {
		if (this.isVertical) {
			//because the crop rectangle is upside down for the
			//vertical crop
			this.cropRect.height = this.value * -1;
		} else {
			this.cropRect.width = this.value;
		}		
		this.sprite.crop(this.cropRect);		
	}
		
};
