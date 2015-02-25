ToolBoxGenerator = function(gameContext) {
	this.DECAY = 5; //seconds
	this.gameContext = gameContext;
	this.spawnProbability = this.gameContext.LEVEL_DEFINITION.powerUpFrequency ? 
			this.gameContext.LEVEL_DEFINITION.powerUpFrequency : 0.2;
	this.toolBox = null;

	this.mode = 'spawn';

	this.clock = this.gameContext.time.create(false);
	this.clock.name = "toolBoxGenerator";
	this.clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
};

ToolBoxGenerator.prototype = {
	start: function () {
		this.clock.start();
	},
	
	stop: function() {
		this.clock.stop();
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
	
	spawnToolBox: function() {
		ratio = 0.7;
		xCoord = Math.random()*this.gameContext.world.width*ratio;
		xCoord += (this.gameContext.world.width*(1-ratio))/2;
		yCoord = 50;
		this.toolBox = new ToolBox(this.gameContext, xCoord, yCoord, this.DECAY);
		
	},

	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.mode == 'spawn') {
				if (this.decideToSpawn()) {
					this.spawnToolBox();
					this.startDecay();
				}			
			} else if (this.mode == 'decay') {
				if (this.toolBox.isDestroyed) {
					delete this.toolBox;
					this.startSpawn();
				}
			}
		} else {
			//do nothing for now
		}
	}	
};

ToolBox = function(gameContext, xCoord, yCoord, decayTime) {
	this.debug = false;
	this.isDestroyed = false;
	this.gameContext = gameContext;
	this.xCoord = xCoord;
	this.yCoord = yCoord;
	this.decayTime = decayTime;
	this.clock = this.gameContext.time.create(false);
	this.clock.name = "toolbox";
	this.clock.loop(Phaser.Timer.SECOND*this.decayTime/2, this.updateTimer, this);
	
	this.fadeClock = this.gameContext.time.create(false);
	this.fadeClock.name = "toolBoxFade";
	this.fadeClock.loop(Phaser.Timer.SECOND/7*(this.decayTime/2), this.updateFadeTimer, this);
	
	this.boxSound = this.gameContext.add.audio('boxSound');
	this.boxSound.volume = 0.4;	
	this.boxSound.play();
	this.bounceSound = this.gameContext.add.audio('boxBounceSound');
	
	this.sprite = this.gameContext.add.sprite(xCoord, yCoord, 'boxAnim');
	this.animationManager = new SpriteAnimationManager();
	this.animationManager.playAnimation('boxBounce', this.sprite, 17, true);
	
	//P2
	this.gameContext.game.physics.p2.enable(this.sprite, this.debug);
	this.sprite.visible = true;
	this.sprite.body.setRectangle(60,60);
	this.sprite.body.fixedRotation = true;
	this.sprite.body.mass = 4;
	this.sprite.body.onBeginContact.add(this.handleImpact, this);
	this.sprite.body.allowGravity = true;
	this.sprite.body.data.gravityScale = 1.5;
	this.sprite.body.setMaterial(this.gameContext.toolBoxMaterial);
	this.sprite.body.setCollisionGroup(this.gameContext.targetCollisionGroup);
	this.sprite.body.collides([this.gameContext.targetCollisionGroup, this.gameContext.toolCollisionGroup, this.gameContext.wallCollisionGroup]);
	this.gameContext.game.physics.p2.updateBoundsCollisionGroup();

	this.mode = 'solid';
	this.clock.start();

};

ToolBox.prototype = {
	handleImpact: function(body, shapeA, shapeB, equation) {
		if (this.gameContext.GAME_PHASE != this.gameContext.PLAY_PHASE) {return;}
		toolKey = this.getSelectedToolKey();
		if (body != null && body.sprite.key == toolKey) {
			this.gameContext.selectPowerUp();
			this.destroy();
		} else if (body != null && body.name == 'wall') {
			this.bounceSound.play();
		}

	},

	beginFade: function() {
		this.mode = 'fade';
		this.fadeClock.start();
	},
	
	destroy: function() {
		this.isDestroyed = true;
		this.clock.stop();
		this.fadeClock.stop();
		this.clock.removeAll();
		this.fadeClock.removeAll();
		this.clock.destroy();
		this.fadeClock.destroy();
		this.clock.isDestroyed = true;
		this.fadeClock.isDestroyed = true;
		this.clock.autoDestroy = true;
		this.fadeClock.autoDestroy = true;
		delete this.clock;
		delete this.fadeClock;
		this.sprite.body.onBeginContact.removeAll();
		this.sprite.body.isSafeDestroy = true;
		this.gameContext.game.physics.p2.removeBodyNextStep(this.sprite.body);
		this.sprite.destroy();
		delete this.sprite;
		delete this.bounceSound;
		delete this.boxSound;
	},
	
	getSelectedToolKey: function() {
		return this.gameContext.currentTool.sprite.key;
	},
	
	updateTimer: function() {
		if (this.gameContext.paused) {return;}
		if (this.mode == 'solid') {
			this.beginFade();
		} else if (this.mode == 'fade') {
			this.destroy();
		}
	},
	
	updateFadeTimer: function() {
		if (this.gameContext.paused) {return;}
		if (this.sprite.alpha > 0) {
			this.sprite.alpha -= 0.11;
		}
	}
};