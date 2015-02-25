/**
* The Game's Credits constructor.
* @class Slapgame.Level
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.Credits = function (game) {

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
 
    //State phases
    this.FADE_PHASE = 'fadePhase';
    this.SCROLL_PHASE = 'scrollPhase';
    
};

SlapGame.Credits.prototype = {

		
	create: function () {
		
		PRELOAD_MANAGER.updateCreditsStarted();
		
		this.debug = false;		
		
		this.creditsMusic = this.add.audio('creditsMusic');
		this.creditsMusic.play('',0,1,true);

		//background
		this.background = this.add.sprite(0,0, LEVEL_CONTROLLER.getCurrentLevel().background);
		this.background.height = this.game.world.height;
		this.background.width = this.game.world.width;
				
		//sprites
		this.blake = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'guyDizzy');
		
		GUY_ANIMATION_MANAGER.playAnimation('dizzy', this.blake, 17, true);
		
	    var self = this;
	    window.onblur = function () {self.forcePause();};
	    window.onfocus = function () {self.forceResume();};	    
	    
	    //physics
	    this.targetCollisionGroup = null;
	    this.toolCollisionGroup = null;
	    this.hazardCollisionGroup = null;
	    this.fShieldCollisionGroup = null;
		this.initP2Physics();

		this.speed = 350;
		this.setVelocity();
		
		//always assume a touch device
		//this.isTouchEnabled = this.game.input.activePointer != this.game.input.mousePointer ? true : false;
		this.isTouchEnabled = true;
		if (this.isTouchEnabled) {
			//allow the player to interact with the floating head
			this.game.input.onDown.add(this.setVelocity, this);
		}		

		//sound
		this.menuSound = this.add.audio('menuSound');

		
		//buttons
		this.buttons = [];
		this.quitButton = this.add.button(11, this.game.world.height-95, 'buttons', this.quitGame, this, 3, 2, 3, 2);
		this.buttons.push(this.quitButton);
		for (index in this.buttons) {
			this.buttons[index].onDownSound = this.menuSound;
			this.buttons[index].scale.x *= 0.6;
			this.buttons[index].scale.y *= 0.6;
		}
		
		PLAYER_DATA_MANAGER.init();

		//Fade in from black
		var myBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
		var grd = myBitmap.context.createLinearGradient(0,0,0,500);
		grd.addColorStop(0,"black");
		grd.addColorStop(1,"black");
		myBitmap.context.fillStyle = grd;
		myBitmap.context.fillRect(0,0,this.game.world.width, this.game.world.height);
		this.rect = this.add.sprite(0,0, myBitmap);
		this.add.tween(this.rect).to({ alpha: 0 }, 0, Phaser.Easing.Quadratic.InOut, true,1000);
		this.creditsAnimation = new CreditsAnimation(this);

	},
	
	update: function () {

		//do nothing
	},
	
	render: function () {
	    //debug helper
	    if (this.debug) {
		    this.game.debug.body(this.blake);
		    this.game.debug.spriteInfo(this.blake, 32, 32);
	    }
	},
	
	/**
	 * Move the head to the left or right depending on the player's input
	 */
	setVelocity: function() {
		directionY = -1;
		directionX = (this.game.input.x < this.blake.x) ? 1: -1;
		this.blake.body.velocity.y = directionY * this.speed;
		this.blake.body.velocity.x = directionX * this.speed;
	},
	
	forcePause: function () {
		this.game.paused = true;
		this.creditsMusic.pause();
	},
	
	forceResume: function () {
		this.game.paused = false;
		this.creditsMusic.resume();
	},

	initP2Physics: function() {
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		
		//  Turn on impact events for the world, without this we get no collision callbacks
	    this.game.physics.p2.setImpactEvents(true);
	    
	    this.targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.toolCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.hazardCollisionGroup = this.game.physics.p2.createCollisionGroup();
	    this.fShieldCollisionGroup = this.game.physics.p2.createCollisionGroup();

	    
	    this.game.physics.p2.applyGravity = true;
	    this.game.physics.p2.gravity.y = 300;

	    
	    this.game.physics.p2.enable(this.blake, this.debug);
	    this.blake.body.clearShapes();
	    this.blake.body.loadPolygon('physicsData', 'guy');
	    this.blake.body.allowGravity = true;
	    this.blake.body.fixedRotation = false;
	    this.blake.body.damping = 0;
	    this.blake.body.mass = 5;
	    this.blake.body.setCollisionGroup(this.targetCollisionGroup);
	    this.blake.body.collides([this.toolCollisionGroup, this.fShieldCollisionGroup]);
	    this.game.physics.p2.updateBoundsCollisionGroup();

	   
	    /*contact materials*/
	    this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
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
	    this.toolTargetContactMaterial = this.game.physics.p2.createContactMaterial(this.targetMaterial, this.toolMaterial
	    		, { restitution: 0.5 });
	    
	    this.targetWorldContactMaterial = this.game.physics.p2.createContactMaterial(this.targetMaterial, this.worldMaterial
	    		, { restitution: 1.005 });
	    
	    this.blake.body.setMaterial(this.targetMaterial);

	},


	quitGame: function () {

		this.endLevel();
		this.blake.destroy();
		SHIELD_MANAGER.clear();
		GUY_ANIMATION_MANAGER.clearAnimations();
		if (this.isTouchEnabled) {
			this.game.input.onDown.remove(this.setVelocity, this);
		}

		//	Then let's go back to the main menu.
		PRELOAD_MANAGER.updateGoToMenu();
		this.state.start('DynamicPreloader');
	},
	
	endLevel: function () {
		this.creditsMusic.stop();		
	}
};
