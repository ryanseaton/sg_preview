FlyingShieldGenerator = function(gameContext, probability) {
	this.DECAY = 3; //seconds
	this.gameContext = gameContext;
	this.spawnProbability = probability;
	this.spawned = [];

	this.mode = 'spawn';

	this.clock = this.gameContext.time.create(false);
	this.clock.name = "fShieldGenerator";
	this.clock.loop(Phaser.Timer.SECOND, this.updateTimer, this);
};

FlyingShieldGenerator.prototype = {
	start: function () {
		this.clock.start();
	},
	
	stop: function() {
		this.clock.stop(false);
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
	
	spawn: function() {
		ratio = 0.6;
		yCoord = Math.random()*this.gameContext.game.world.height*ratio;
		yCoord += (this.gameContext.game.world.height*(1-ratio))/2;
		xCoord = Math.random() > 0.5 ? 50: this.gameContext.game.world.width-50;
		this.spawned.push(new FlyingShield(this.gameContext, xCoord, yCoord, this.DECAY));
		
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
		if (!this.gameContext.paused) {
			this.removeDestroyed();
			if (this.mode == 'spawn') {
				if (this.decideToSpawn()) {
					this.spawn();
				}			
			} else if (this.mode == 'decay') {
				if (this.spawned.length == 0) {
					this.startSpawn();
				}
			}
		} else {
			//do nothing for now
		}
	}	
};

FlyingShield = function(gameContext, xCoord, yCoord, decayTime) {
	this.debug = false;
	this.isDestroyed = false;
	this.spriteSheets = GUY_ANIMATION_MANAGER.getSpriteSheetNames();
	this.gameContext = gameContext;
	this.xCoord = xCoord;
	this.yCoord = yCoord;
	this.decayTime = decayTime;
	this.clock = this.gameContext.time.create(false);
	this.clock.name = "flyingshield";
	this.clock.loop(Phaser.Timer.SECOND*this.decayTime, this.updateTimer, this);
	
	this.flyingShieldSound = this.gameContext.add.audio('shieldSound');
	this.flyingShieldSound.play();
	
	this.hitSound = this.gameContext.add.audio('flyingShieldHitSound');
	this.replaceShieldSound = this.gameContext.add.audio('shieldReplace');
	
//	this.sprite = this.gameContext.add.sprite(xCoord, yCoord, 'flyingShieldAnim');
//	this.animationManager = new SpriteAnimationManager();
//	this.animationManager.playAnimation('shieldFly', this.sprite, 16, true);
	
	this.sprite = this.gameContext.add.sprite(xCoord, yCoord, 'flyingShieldStatic');
	
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
	this.sprite.body.setCollisionGroup(this.gameContext.fShieldCollisionGroup);
	this.sprite.body.collides([this.gameContext.toolCollisionGroup,this.gameContext.targetCollisionGroup, this.gameContext.wallCollisionGroup]);
	//this.gameContext.game.physics.p2.updateBoundsCollisionGroup();
	
	this.sprite.scale.x =  this.sprite.x < this.gameContext.game.world.width/2 ? 1 : -1;
	this.sprite.body.velocity.x = this.sprite.x < this.gameContext.game.world.width/2 ? 800 : -800;
	
	this.swatted = false;
	this.swatTimer =  this.gameContext.time.create(false);
	this.swatTimer.name = "fShieldSwat";
	this.swatTimer.add(Phaser.Timer.SECOND*0.7, this.destroy, this);
	this.clock.start();

};

FlyingShield.prototype = {
		
	handleImpact: function(body, shapeA, shapeB, equation) {
		if (this.swatted || this.gameContext.GAME_PHASE != this.gameContext.PLAY_PHASE) { return; } //don't handle impacts because we're on a destroy() countdown
		selectedTool = this.gameContext.currentTool;
		toolKey = selectedTool.sprite.key;
		
		if (body != null && body.sprite.key == toolKey && selectedTool.isAntiShieldReplacer) {
			this.handleToolHit();
		} else if (body != null && this.spriteSheets.indexOf(body.sprite.key) >= 0) {
			this.replaceShieldSound.play();
			this.gameContext.replaceShield();
			this.destroy();
		} else {
			//this.flyingShieldSound.play();
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
		delete this.flyingShieldSound;
		delete this.hitSound;
	},
	
	getSelectedToolKey: function() {
		return this.gameContext.currentTool.sprite.key;
	},
	
	updateTimer: function() {
		if (this.gameContext.paused) {return;}
		this.destroy();
	}
};