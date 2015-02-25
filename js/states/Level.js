/**
* The Game's Level state constructor.
* @class Slapgame.Level
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/

SlapGame.Level = function (game) {

    /*
     * SINGLETONS:
     * -----------
     * CONFIG
     * GUY_ANIMATION_MANAGER
     * LEVEL_CONTROLLER 
     * PLAYER_DATA_MANAGER
     * SHIELD_MANAGER
     */
	this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
 
    this.PLAY_PHASE = 'playPhase'; // third
    this.LOSE_PHASE = 'LosePhase'; // last
    this.WIN_PHASE = 'winPhase'; // last
    this.COUNTDOWN_PHASE = 'countdownPhase'; //second
    this.MOCKING_PHASE = 'mockingPhase'; // first
    this.GAME_PHASE;
    
    this.TIME_LIMIT;
    this.SLEEP_RATE;
    this.MASS;
    this.DAMPING;
    this.S_REST_LENGTH;
    this.S_STRENGTH;
    this.S_DAMPING;
    this.LEVEL_DEFINITION;
};

SlapGame.Level.prototype = {

		
	create: function () {
		
		this.debug = false;
		
		//PreloadManager
		PRELOAD_MANAGER.updateLevelStarted(LEVEL_CONTROLLER.getIndex());
		
		//clear ad for performance
		AD_MANAGER.init();

		//background
		this.background = this.add.sprite(0,0, LEVEL_CONTROLLER.getCurrentLevel().background);
		this.background.height = this.game.world.height;
		this.background.width = this.game.world.width;
				
		//sprites
		this.anchor = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'anchor');
		this.blake = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'guyAwake');
		
		//Level definition
		this.loadLevel(); 
		
	    var self = this;
	    window.onblur = function () {self.forcePause();};
	    window.onfocus = function () {self.forceResume();};	 
		
		//physics and BRUISE_MANAGER
	    this.targetCollisionGroup = null;
	    this.toolCollisionGroup = null;
	    this.hazardCollisionGroup = null;
	    this.fShieldCollisionGroup = null;
		this.initP2Physics();
		
		//Bruise Manager
		BRUISE_MANAGER.init(this);

		// shield meter
		var meterLength = 260;
		if (SHIELD_MANAGER.hasShield()) {
			this.shieldBreakSound = this.add.audio('shieldBreak');
			this.shieldIcon = this.add.sprite(this.game.world.centerX, 10, 'interface', 6);
			this.shieldContainer = this.add.sprite(this.shieldIcon.x+75, 16, 'interface', 5);
			this.shieldFill = this.add.sprite(this.shieldContainer.x+7, 22, 'interface', 7);
			
			this.shieldMeter = new HealthMeter(this, 0, this.shieldFill);
		}
		this.healthFill = this.add.sprite(this.game.world.centerX-meterLength+7, 22, 'interface', 3);
		this.healthFillContainer = this.add.sprite(this.game.world.centerX-meterLength, 16, 'interface', 2);
		this.healthIcon = this.add.sprite(this.healthFillContainer.x-90, 11, 'interface', 1);

    	
		//Timers
	    this.countdownDisplay = this.add.bitmapText(20, 10, 'titleFont',this.TIME_LIMIT.toString().toMMSS(),CONFIG.LEVEL_TIME_FONT_SIZE);	    
	    this.gameTimer = new GameTimer(this, this.TIME_LIMIT, this.countdownDisplay);
	    this.gameMeter = new HealthMeter(this, this.SLEEP_RATE, this.healthFill);

	    
	  //Tools
		this.currentTool = null;
		this.tools = [];
		this.buttons = [];
		this.makeTools(this.toolNames);	
	    
	    this.anchorPilot = new AnchorPilot(this, this.anchor, this.LEVEL_DEFINITION.anchor.speed, this.LEVEL_DEFINITION.anchor.randomness);
		
		
		//sound
		this.menuSound = this.add.audio('menuSound');
		this.gameMusic = this.add.audio('gameMusic');
		
		//Guy Sounds
		this.guySounds = [];
		if (CONFIG.ENABLE_GUY_SOUNDS) {
			for (index in GUY_SOUNDS) {
				this.guySounds.push(this.add.audio(GUY_SOUNDS[index]));
			}
		this.guySoundFrequency = 1;
		}
		
		//buttons
		this.quitButton = this.add.button(11, this.game.world.height-95, 'buttons', this.quitGame, this, 3, 2, 3, 2);
		this.resetButton = this.add.button(this.game.world.width-95, this.game.world.height-95
				, 'buttons', this.resetGame, this, 1, 0, 1, 0);

		this.buttons.push(this.quitButton);
		this.buttons.push(this.resetButton);
		for (index in this.buttons) {
			this.buttons[index].onDownSound = this.menuSound;
			this.buttons[index].scale.x *= 0.6;
			this.buttons[index].scale.y *= 0.6;
		}
		
		PLAYER_DATA_MANAGER.init();
	    
	    //level display
		this.levelDisplay = this.add.bitmapText(this.game.world.width-290, 10, 'titleFont'
				,STRINGS.LBL_LEVEL+this.LEVEL_DEFINITION.id,CONFIG.LEVEL_TIME_FONT_SIZE);
		
		//level start countdown
		this.GAME_PHASE = this.MOCKING_PHASE;
		this.mockingAnim = new MockingAnimation(this);
		this.blinkManager = new BlinkManager(this, this.blake);
		this.mockingAnim.start();
		if (this.LEVEL_DEFINITION.powerUp) {
			this.availableToolsAnim = new AvailableToolsAnimation(this);
			this.availableToolsAnim.start();
		}		
	},
	
	update: function () {
		if (this.GAME_PHASE == this.MOCKING_PHASE) {
			if (this.mockingAnim.isComplete) {
				this.GAME_PHASE = this.COUNTDOWN_PHASE;
				this.levelStartAnim = new LevelStart(this);
				this.levelStartAnim.start();
				this.blinkManager.start();				
			} 
		} else if (this.GAME_PHASE == this.COUNTDOWN_PHASE) {
			//do nothing until the start countdown is complete
			if (this.levelStartAnim.isComplete) {
				this.GAME_PHASE = this.PLAY_PHASE;
				if (CONFIG.LEVEL_MUSIC) {this.gameMusic.play('',0,1,true);}
				this.startGameClocks();
				if (this.LEVEL_DEFINITION.startingAnimation.repeat) {
					GUY_ANIMATION_MANAGER.playAnimation(this.LEVEL_DEFINITION.startingAnimation.name, this.blake, 17, this.LEVEL_DEFINITION.startingAnimation.repeat);
				}
			}
		} else if (this.GAME_PHASE == this.PLAY_PHASE) {
			this.doPhysics();
			this.updateTools();
			
			//shield
			if (SHIELD_MANAGER.hasShield()) {
				if (this.shieldMeter.isEndCondition && !SHIELD_MANAGER.isBroken()) {
					this.removeShield();
				}
			}
			
			//Level-ending conditions
			if (this.gameMeter.isEndCondition) {
				this.passLevel();
			}
			
			if (this.gameTimer.isTimeUp) {
				this.failLevel();
			}
		}
	},
	
	render: function () {
	    //debug helper
	    if (this.debug) {
		    for (i=0;i<this.tools.length;i++) {
				currentTool = this.tools[i];
				if (currentTool.isToolSelected) {
					this.game.debug.spriteInfo(currentTool.sprite, 32, 32);
					this.game.debug.body(currentTool.sprite);				
				}
			}
		    this.game.debug.body(this.anchor);
		    this.game.debug.spriteInfo(this.anchor, 32, 32);
	    }
	},
	
	startGameClocks: function() {
		this.gameTimer.start();
		this.gameMeter.start();
		if (SHIELD_MANAGER.hasShield()) {
			this.shieldMeter.start();
		}
		if (this.LEVEL_DEFINITION.powerUp) {
			this.toolBoxGenerator.start();
		}
		if (this.LEVEL_DEFINITION.ballHazard) {
			this.ballGenerator.start();
		}
		this.anchorPilot.start();
		
		
	},
	
	stopGameClocks: function() {
		this.gameTimer.stop();
		this.gameMeter.stop();
		if (SHIELD_MANAGER.hasShield()) {
			this.shieldMeter.stop();
		}
		if (this.LEVEL_DEFINITION.replaceShield) {
			this.flyingShieldGenerator.stop();
		}
		if (this.LEVEL_DEFINITION.powerUp) {
			this.toolBoxGenerator.stop();
		}
		if (this.LEVEL_DEFINITION.ballHazard) {
			this.ballGenerator.stop();
		}
		this.blinkManager.stop();
		this.anchorPilot.stop();
		
	},
	
	stopGameSounds: function() {
		if (this.winAnim) {
			this.winAnim.stopSounds();
		} if (this.loseAnim) {
			this.loseAnim.stopSounds();
		} if (this.mockingAnim) {
			this.mockingAnim.stopSounds();
		} if (this.countdownAnim) {
			this.countdownAnim.stopSounds();
		}
	},
	
	forcePause: function () {
		this.game.paused = true;
		if (CONFIG.LEVEL_MUSIC) {
			this.gameMusic.pause();
		}
	},
	
	forceResume: function () {
		this.game.paused = false;
		if (CONFIG.LEVEL_MUSIC) {
			this.gameMusic.resume();
		}
	},

	initP2Physics: function() {
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		
		//  Turn on impact events for the world, without this we get no collision callbacks
	    this.game.physics.p2.setImpactEvents(true);
	    
	    this.game.world.setBounds(0, 0, this.game.world.width, this.game.world.height);
	    
	    this.targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.toolCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.hazardCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.fShieldCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.wallCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.anchorCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    
	    this.game.physics.p2.applyGravity = true;
	    this.game.physics.p2.gravity.y = 300;
	    //console.log(this.game.physics.p2.bounds);
	    
	    

		//  This will force it to decelerate and limit its speed
	    this.game.physics.p2.enable(this.anchor, this.debug);
	    this.anchor.body.allowGravity = false;
	    this.anchor.body.dynamic = false;
	    this.anchor.body.collideWorldBounds = false;
	    this.anchor.body.fixedRotation = true;
	    //this.anchor.body.setCollisionGroup(this.anchorCollisionGroup);
	    //this.anchor.body.collides([this.wallCollisionGroup]);
	    this.anchor.body.mass = 2;
	    
	    
	    //this.game.physics.p2.setBounds(0, 0, this.game.world.width, this.game.world.height, this.wallCollisionGroup);
	    this.game.physics.p2.enable(this.blake, this.debug);
	    this.blake.body.setCircle(95);
//	    this.blake.body.allowGravity = false;
	    this.blake.body.data.gravityScale = 0;
//	    this.blake.body.collideWorldBounds = true;
	    this.blake.body.fixedRotation = true;
	    this.blake.body.damping = this.DAMPING;
	    this.blake.body.mass = this.MASS;
	    this.blake.body.setCollisionGroup(this.targetCollisionGroup);
	    this.blake.body.collides([this.toolCollisionGroup, this.fShieldCollisionGroup, this.wallCollisionGroup]);
	    
	    
	    this.blakeSpring = this.game.physics.p2.createSpring(this.anchor, this.blake, this.S_REST_LENGTH, this.S_STRENGTH, this.S_DAMPING);
	    
	   
	    /*contact materials*/
	    this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
//	    this.createFakeWorldBounds();
	    this.game.physics.p2.setWorldMaterial(this.worldMaterial);
	    
	    //toolBox-World
	    this.toolBoxMaterial = this.game.physics.p2.createMaterial('toolBoxMaterial');
	    this.tbWorldContactMaterial = this.game.physics.p2.createContactMaterial(this.toolBoxMaterial, this.worldMaterial
	    		, { restitution: 0.8 });
	    
	    //HazardBall-World
	    this.ballMaterial = this.game.physics.p2.createMaterial('ballMaterial');
	    this.ballWorldContactMaterial = this.game.physics.p2.createContactMaterial(this.ballMaterial, this.worldMaterial
	    		, { restitution: 1.0 });
	    
	    //tool-target
	    this.targetMaterial = this.game.physics.p2.createMaterial('targetMaterial');
	    this.toolMaterial = this.game.physics.p2.createMaterial('toolMaterial');
	    this.toolTargetContactMaterial = this.game.physics.p2.createContactMaterial(this.targetMaterial, this.toolMaterial);
	    this.toolTargetContactMaterial.friction = 0.8;
	    this.toolTargetContactMaterial.restitution = 0.1;
	    
	    
	    this.blake.body.setMaterial(this.targetMaterial);
	    
	    //SHIELD_MANAGER
		if (SHIELD_MANAGER.hasShield()) {
	    	SHIELD_MANAGER.initP2Physics();
	    }

	},
	
//	createFakeWorldBounds: function() {
//		
//		this.game.physics.p2.updateBoundsCollisionGroup(this.wallCollisionGroup);
//		this.topWall = this.add.sprite(this.game.world.centerX, 0, 'anchor');
//		this.leftWall = this.add.sprite(0, this.game.world.centerY, 'anchor');
//		this.rightWall = this.add.sprite(this.game.world.width-2, this.game.world.centerY, 'anchor');
//		this.bottomWall = this.add.sprite(this.game.world.centerX, this.game.world.height-2, 'anchor');
//		
//		this.game.physics.p2.enable([this.topWall, this.leftWall, this.rightWall, this.bottomWall], this.debug);
//		
//		this.topWall.body.setRectangle(this.game.world.width-8, 4);
//		this.leftWall.body.setRectangle(4,this.game.world.height-8);
//		this.rightWall.body.setRectangle(4, this.game.world.height-8);
//		this.bottomWall.body.setRectangle(this.game.world.width-8, 4);
//		
//		this.walls = [this.topWall, this.leftWall, this.rightWall, this.bottomWall];
//		for (index in this.walls) {
//			wall = this.walls[index].body;
//			wall.setCollisionGroup(this.wallCollisionGroup);
//			wall.collides([this.toolCollisionGroup, this.fShieldCollisionGroup, this.hazardCollisionGroup, this.targetCollisionGroup, this.anchorCollisionGroup]);
//			wall.setMaterial(this.worldMaterial);
//			wall.mass = 100;
//			wall.dynamic = false;
//			wall.name = 'wall';
//		}
//	},
	
	loadLevel: function() {
		this.LEVEL_DEFINITION = LEVEL_CONTROLLER.getCurrentLevel();
		this.TIME_LIMIT = this.LEVEL_DEFINITION.timeLimit;
		this.SLEEP_RATE = this.LEVEL_DEFINITION.sleepRate;
		this.MASS = this.LEVEL_DEFINITION.mass;
		this.DAMPING = this.LEVEL_DEFINITION.damping;
		this.S_REST_LENGTH = this.LEVEL_DEFINITION.spring.restLength;
		this.S_STRENGTH = this.LEVEL_DEFINITION.spring.strength;
		this.S_DAMPING = this.LEVEL_DEFINITION.spring.damping;
		//loads the starting sprite for the guy
		//set the default animation to return to
		if (this.LEVEL_DEFINITION.startingAnimation) {
			GUY_ANIMATION_MANAGER.setDefaultAnimation(this.LEVEL_DEFINITION.startingAnimation.name,this.blake);
		}		
		
		
		tools = this.LEVEL_DEFINITION.tool;
		this.toolNames = [];
		for (index in tools) {
			this.toolNames.push(tools[index]);
		}
		if (this.LEVEL_DEFINITION.shield) {
			SHIELD_MANAGER.init(this, this.debug);
		}
		if (this.LEVEL_DEFINITION.replaceShield) {
			this.flyingShieldGenerator = new FlyingShieldGenerator(this, 0.40);
		}
		if (this.LEVEL_DEFINITION.powerUp) {
		    //TODO: load as per level definition
		    this.toolBoxGenerator = new ToolBoxGenerator(this);
		}
		if (this.LEVEL_DEFINITION.ballHazard) {
		    this.ballGenerator = new BallGenerator(this, this.LEVEL_DEFINITION.ballHazard);
		}
	},

	makeTools: function(toolNames) {
		var toolList = TOOLS;
		for (index in toolList) {
			toolDefinition = toolList[index];
			if (toolNames.indexOf(toolDefinition.name) > -1) {	
				this.tools.push(new Tool(toolDefinition, this));				
			}
		}
		this.selectTool(this.tools[0]);
		this.currentTool = this.tools[0];
	},
	
	getSelectedTool: function() {
		for (i=0;i<this.tools.length;i++) {
			currentTool = this.tools[i];
			if (currentTool.isToolSelected) {	
				return currentTool;
			}
		}
		return null;
	},
	
	selectPowerUp: function() {
		//currentTool = this.getSelectedTool();
		rndIndex = Math.floor(Math.random()*this.tools.length);
		if (this.tools[rndIndex] == this.currentTool) {
			//console.log("avoiding selecting the same tool");
			rndIndex = (rndIndex + 1) % this.tools.length;
		}
		//console.log("new tool index: "+rndIndex);
		
		this.currentTool.unSelect();
		this.tools[rndIndex].select();
		this.currentTool = this.tools[rndIndex];
		this.tools[rndIndex].playToolSplashAnimation();
		if (this.tools[rndIndex].timeRewind) {this.gameTimer.addTime(this.tools[rndIndex].timeRewind);}
	},
	
	updateTools: function() {		
		//currentTool = this.getSelectedTool();
		//console.log("current tool: "+currentTool.toolName);
		this.currentTool.invertIfNecessary(this.blake);
		this.currentTool.handleMovement();
	},
	
	stunSelectedTool: function() {
		//selectedTool = this.getSelectedTool();
		//selectedTool.stun();
		this.currentTool.stun();
	},
	
	doPhysics: function() {
		//P2 Physics
		//to stop spring 'orbit'
		this.blake.body.velocity.y=this.blake.body.velocity.y*0.9;
	},
	
	destroyTools: function() {
		for (i=0;i<this.tools.length;i++) {
			var currentTool = this.tools[i];
			//if (currentTool.isToolSelected) {
			currentTool.destroy();
			//}
		}
	},

	
	selectTool: function (tool) {
			if (!tool.isToolSelected) {
				tool.select(true);
			} else {
//				console.log("tool already selected!");
				//tool.destroy();
			}
	},
	
	isHoveringOverButton: function() {
		for(index in this.buttons){
			button = this.buttons[index];
			if ((this.game.input.x > button.x && this.game.input.x < button.x+button.width) 
					&& (this.game.input.y > button.y && this.game.input.y < button.y+button.height)) {
				return true;
			}
		}
		return false;
	},
	
	removeShield: function() {
		this.shieldBreakSound.play();
		SHIELD_MANAGER.breakShield();
		this.shieldContainer.tint = 0x333333;		
		this.shieldMeter.stop();
		//this.shieldIconAM.stopAnimations();
		this.shieldIcon.tint = 0x666666;
		if (this.LEVEL_DEFINITION.replaceShield) {
			this.flyingShieldGenerator.start();
		}
	},
	
	replaceShield: function() {
		if (this.LEVEL_DEFINITION.shield && SHIELD_MANAGER.isShieldBroken) {
			SHIELD_MANAGER.replace(this, this.debug);
			this.shieldMeter.initialize();
			this.flyingShieldGenerator.stop();
			//this.shieldIconAM.playAnimation('shieldPulse', this.shieldIcon, 20, true);
			this.shieldIcon.tint = 0xFFFFFF;
			this.shieldContainer.tint = 0xFFFFFF;
			this.gameTimer.addTime(5);
		}
	},
	
	playImpactAnimation: function(toolSprite) {
		if (typeof this.LEVEL_DEFINITION.hitAnimations !== 'undefined' ) {			
			fromLeft = this.LEVEL_DEFINITION.hitAnimations[0];
			fromRight = this.LEVEL_DEFINITION.hitAnimations[1];			
			if (toolSprite.x > this.blake.x) {
				GUY_ANIMATION_MANAGER.playAnimation(fromRight, this.blake, 17, false);
			} else {
				GUY_ANIMATION_MANAGER.playAnimation(fromLeft, this.blake, 17, false);
			}
		}
	},
	
	playGuySound: function() {
		rand = Math.random();
		if ( rand <= this.guySoundFrequency) {
			//if no guy sound is currently playing
			alreadyPlaying = false;
			for (index in this.guySounds) {
				if (this.guySounds[index].isPlaying) {
					alreadyPlaying = true;
					break;
				}
			}
			if (!alreadyPlaying) {
				rand2 = Math.floor(Math.random()*GUY_SOUNDS.length);
				this.guySounds[rand2].volume = 0.5;
				this.guySounds[rand2].play();
			}
			
		}

	},
	
	unCoupleSpring: function() {
		//this.isTouchEnabled = this.game.input.activePointer != this.game.input.mousePointer ? true : false;
		this.isTouchEnabled = true;
		//workaround for phaser bug
		var allSprings = this.game.physics.p2.getSprings();
//		console.log(allSprings);
	    if (allSprings.length > 0){ 
//	    	console.log("removing spring");
	        this.game.physics.p2.removeSpring(this.blakeSpring);
	    }
	    this.blake.body.clearShapes();
	    this.blake.body.loadPolygon('physicsData', 'guy');
	    this.blake.body.setMaterial(this.targetMaterial);
	    this.blake.body.setCollisionGroup(this.targetCollisionGroup);
	    this.blake.body.fixedRotation = false;
	    this.blake.body.data.gravityScale = 1.0;
	    this.blake.body.damping = 0.5;
	    this.targetWorldContactMaterial = this.game.physics.p2.createContactMaterial(this.targetMaterial, this.worldMaterial
	    		, { restitution: 1.01 });
	    this.game.physics.p2.updateBoundsCollisionGroup();
		this.speed = 350;
		this.setVelocity();
		if (this.isTouchEnabled) {
			this.game.input.onDown.add(this.setVelocity, this);
		}
	},
	
	reomoveFakeWalls: function() {
		this.topWall.body.clearShapes();
		this.leftWall.body.clearShapes();
		this.rightWall.body.clearShapes();
		this.bottomWall.body.clearShapes();
	},
	
	setVelocity: function() {
		directionY = -1;
		directionX = (this.game.input.x*InputRatio.x < this.blake.x) ? 1: -1;
		this.blake.body.velocity.y = directionY * this.speed;
		this.blake.body.velocity.x = directionX * this.speed;

	},

	quitGame: function (pointer) {

		this.endLevel();
		this.blake.destroy();
		this.stopGameSounds();
		SHIELD_MANAGER.clear();
		GUY_ANIMATION_MANAGER.clearAnimations();
		if (this.isTouchEnabled) {
			this.game.input.onDown.remove(this.setVelocity, this);
		}

		//	Then let's go back to the main menu.
		PRELOAD_MANAGER.updateGoToMenu();
		this.state.start('DynamicPreloader');
	},
	
	resetGame: function () {

		this.endLevel();
		this.blake.destroy();
		this.stopGameSounds();
		SHIELD_MANAGER.clear();
		GUY_ANIMATION_MANAGER.clearAnimations();
		if (this.isTouchEnabled) {
			this.game.input.onDown.remove(this.setVelocity, this);
		}
		PRELOAD_MANAGER.updateLevelReset();
		this.state.start('LevelHandler', true, false, false, true);
	},
	
	passLevel: function () {
		this.GAME_PHASE = this.WIN_PHASE;
		PLAYER_DATA_MANAGER.saveAttempt(LEVEL_CONTROLLER.getCurrentLevel().id, true, this.gameTimer.timeLeft * 100, this.tools[0].slapCount);
		this.endLevel();
		this.healthIcon.tint = 0x666666;
		this.healthFillContainer.tint = 0x333333;	
		this.winAnim = new WinAnimation(this);
		this.winAnim.start();
		this.unCoupleSpring();
	},
	
	failLevel: function () {
		this.GAME_PHASE = this.LOSE_PHASE;
		this.endLevel();
		this.loseAnim = new LoseAnimation(this);
		this.loseAnim.start();
		PLAYER_DATA_MANAGER.saveAttempt(LEVEL_CONTROLLER.getCurrentLevel().id, false, 0, this.tools[0].slapCount);
	},	
	
	endLevel: function () {
		//Pre-load Ads
		this.currentTool.stopTimers();
		this.destroyTools();
		if (CONFIG.LEVEL_MUSIC) {
			this.gameMusic.stop();
		}		
		this.stopGameClocks();
		if (SHIELD_MANAGER.hasShield()) {
			SHIELD_MANAGER.glowAnim.stop();
		}
		
	},
	
	goToNextLevel: function() {
		this.destroyTools();
		this.blake.destroy();
		isNotLastLevel = LEVEL_CONTROLLER.advance();
		this.stopGameSounds();
		SHIELD_MANAGER.clear();
		GUY_ANIMATION_MANAGER.clearAnimations();
		//	Then let's go back to the main menu.
		if (isNotLastLevel) {
			PRELOAD_MANAGER.updateGoToLevel(LEVEL_CONTROLLER._currentIndex);
			this.state.start('LevelHandler');
		} else {
			PRELOAD_MANAGER.updateGoToCredits();
			this.state.start('DynamicPreloader');
		}
	}
};
