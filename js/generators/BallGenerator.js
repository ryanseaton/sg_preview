BallGenerator = function(gameContext, probability) {
	this.DECAY = 3; //seconds
	this.GENERATE_TIME = 5; //seconds
	this.REST_TIME = 3; //seconds
	this.gameContext = gameContext;
	this.spawnProbability = probability;
	this.spawned = [];

	this.mode = 'spawn';

	this.clock = this.gameContext.time.create(false);
	this.clock.name = "ballgenerator";
	this.clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
	
	this.restClock = this.gameContext.time.create(false);
	this.restClock.name = "ballgeneratorRest";
	this.restClock.loop(Phaser.Timer.SECOND, this.updateRestTimer, this);
	this.isRestMode = false;
	this.counter = 0;
};

BallGenerator.prototype = {
	start: function () {
		this.restClock.start();
		this.clock.start();
	},
	
	stop: function() {
		this.clock.stop();
		this.restClock.stop();
	},
	
	startSpawn: function() {
		this.clock.stop();
		this.mode = 'spawn';
		this.clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
		this.clock.start();
	},
	
	//wait until the toolBox is gone
	startDecay: function() {
		this.clock.stop();
		this.mode = 'decay';
		this.clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
		this.clock.start();
	},
	
	decideToSpawn: function() {
		rand = Math.random();
		return rand <= this.spawnProbability;
	},
	
	spawnBall: function() {
		ratio = 0.6;
		yCoord = Math.random()*this.gameContext.game.world.height*ratio;
		yCoord += (this.gameContext.game.world.height*(1-ratio))/2;
		xCoord = Math.random() > 0.5 ? 50: this.gameContext.game.world.width-50;
		this.spawned.push(new Ball(this.gameContext, xCoord, yCoord, this.DECAY));
		
	},
	
	removeDestroyed: function() {
		for (i=0; i< this.spawned.length; i++) {
			if (this.spawned[i].isDestroyed) {
				toDelete = this.spawned.splice(i,1);
				delete toDelete[0];
				delete toDelete;
			}
		}
	},

	updateTimer: function () {
		if (this.gameContext.paused) {return;}
		this.removeDestroyed();
		if (this.isRestMode) {return;}
		if (this.mode == 'spawn') {
			if (this.decideToSpawn()) {
				this.spawnBall();
			}
		} else if (this.mode == 'decay') {
			if (this.spawned.length == 0) {
				this.startSpawn();
			}
		}
	},
	
	updateRestTimer: function () {
		if (this.gameContext.paused) {return;}		
			
		if (this.isRestMode) {
			if (this.counter >= this.REST_TIME) {
				this.counter = 0;
				this.isRestMode = false;
			} else {
				this.counter++;
			}			
		} else {
			if (this.counter >= this.GENERATE_TIME) {
				this.counter = 0;
				this.isRestMode = true;
			} else {
				this.counter++;
			}
		}
	}

};

Ball = function(gameContext, xCoord, yCoord, decayTime) {
	this.debug = false;
	this.isDestroyed = false;
	this.gameContext = gameContext;
	this.xCoord = xCoord;
	this.yCoord = yCoord;
	this.decayTime = decayTime;
	this.clock = this.gameContext.time.create(false);
	this.clock.name = "ball";
	this.clock.loop(Phaser.Timer.SECOND*this.decayTime, this.updateTimer, this);
	
	this.hazardSound = this.gameContext.add.audio('hazardSound');
	this.hazardSound.play();
	
	this.hitSound = this.gameContext.add.audio('hazardHitSound');
	
	this.sprite = this.gameContext.add.sprite(xCoord, yCoord, 'ballStatic');

	
	//P2
	this.gameContext.game.physics.p2.enable(this.sprite, this.debug);
	this.sprite.visible = true;
	this.sprite.body.setCircle(40);
	this.sprite.body.fixedRotation = false;
	this.sprite.body.mass = 3;
	this.sprite.body.onBeginContact.add(this.handleImpact, this);
	this.sprite.body.allowGravity = false;
	this.sprite.body.data.gravityScale = 0;
	this.sprite.body.setMaterial(this.gameContext.ballMaterial);
	this.sprite.body.setCollisionGroup(this.gameContext.hazardCollisionGroup);
	this.sprite.body.collides([this.gameContext.toolCollisionGroup, this.gameContext.wallCollisionGroup]);
	//this.gameContext.game.physics.p2.updateBoundsCollisionGroup();
	
	this.sprite.scale.x =  this.sprite.x < this.gameContext.game.world.width/2 ? 1 : -1;
	this.sprite.body.velocity.x = this.sprite.x < this.gameContext.game.world.width/2 ? 1000 : -1000;
	
	
	this.swatted = false;
	this.swatTimer =  this.gameContext.time.create(false);
	this.swatTimer.name = "ballSwatTimer";
	this.swatTimer.add(Phaser.Timer.SECOND*0.7, this.destroy, this);
	
	this.clock.start();
	
};

Ball.prototype = {
	handleImpact: function(body, shapeA, shapeB, equation) {
		if (this.swatted || this.gameContext.GAME_PHASE != this.gameContext.PLAY_PHASE) { return; } //don't handle impacts because we're on a destroy() countdown
		selectedTool = this.gameContext.currentTool;
		toolKey = selectedTool.sprite.key;
		
		if (body != null && body.sprite.key == toolKey && selectedTool.isAntiHazard) {
			this.handleToolHit();
		} if (body != null && body.sprite.key == toolKey && !selectedTool.isAntiHazard) {
			this.gameContext.stunSelectedTool();
			this.destroy();
		} else {
			//this.hazardSound.play();
			this.sprite.scale.x =  this.sprite.x < this.gameContext.game.world.width/2 ? 1 : -1;
		}

	},
	
	handleToolHit: function() {
		this.hitSound.play();
		this.swatted = true;
		this.swatTimer.start();
		this.sprite.tint = 0x666666;
		this.sprite.body.allowGravity = true;
		this.sprite.scale.y = -1;
		this.sprite.body.data.gravityScale = 1.5;
	},

	destroy: function() {
		this.isDestroyed = true;
		this.clock.stop();
		this.swatTimer.stop();
		this.clock.removeAll();
		this.swatTimer.removeAll();
		this.clock.destroy();
		this.swatTimer.destroy();
		this.clock.isDestroyed = true;
		this.swatTimer.isDestroyed = true;
		this.clock.autoDestroy = true;
		this.swatTimer.autoDestroy = true;
		delete this.clock;
		delete this.swatTimer;
		this.sprite.body.onBeginContact.removeAll();
		this.sprite.body.isSafeDestroy = true;
		this.gameContext.game.physics.p2.removeBodyNextStep(this.sprite.body);
		this.sprite.destroy();
		delete this.sprite;
		delete this.hazardSound;
	},
	
	updateTimer: function() {
		if (this.gameContext.paused) {return;}
		 this.destroy();
	}
};