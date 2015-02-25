/**
* The Shield Manager singleton
* This manages the life cycle of the guy's shield
* to local storage.
* @class SHIELD_MANAGER
*/
var SHIELD_MANAGER = {
	
	shield: null,
	glowAnim: null,
	gameContext: null,
	shieldDefinition: null,
	shieldConstraint: null,
	isInitialized: false,
	isDebug: false,
	isShieldBroken: false,
	strength: 0,
	
	init: function(gameContext, isDebug) {
		this.gameContext = gameContext;
		this.isDebug = isDebug;
		this.shieldDefinition = this.getShieldDefinition(this.gameContext.LEVEL_DEFINITION.shield);
		this.shieldSound = this.gameContext.add.audio(this.shieldDefinition.sound.name);
		this.strength = this.shieldDefinition.strength;
		this.shield = this.gameContext.add.sprite(this.gameContext.blake.x,this.gameContext.blake.y,this.gameContext.LEVEL_DEFINITION.shield);
		this.shield.anchor.setTo(0.5,0.5);
		this.glowAnim = new GlowAnimation(this.gameContext,this.shield);

	    this.isInitialized = true;
	    this.isShieldBroken = false;
	},
	
	replace: function(gameContext, isDebug) {
		this.gameContext = gameContext;
		this.isDebug = isDebug;
		
		this.shieldConstraint = this.gameContext.game.physics.p2.createLockConstraint(this.gameContext.blake, this.shield
    			, [-1*this.shieldDefinition.offset.x, -1*this.shieldDefinition.offset.y], 0);
		this.shield.body.fixedRotation = true;
		this.isShieldBroken = false;
		this.isInitialized = true;

	},
	
	bringToTop: function() {
		this.shield.bringToTop();
	},
		
	initP2Physics: function() {
    	this.gameContext.game.physics.p2.enable(this.shield, this.isDebug);
    	this.shield.body.collideWorldBounds = false;
    	this.shield.body.fixedRotation = true;
    	this.shield.body.mass = 10;
    	this.shield.body.data.gravityScale = 0;
    	this.shield.body.setCollisionGroup(this.gameContext.targetCollisionGroup);
    	this.shield.body.collides([this.gameContext.toolCollisionGroup]);

    	this.shieldConstraint = this.gameContext.game.physics.p2.createLockConstraint(this.gameContext.blake, this.shield
    			, [-1*this.shieldDefinition.offset.x, -1*this.shieldDefinition.offset.y], 0);
	},
	
	clear: function() {
		this.shield = null;
		this.glowAnim = null;
		this.gameContext = null;
		this.shieldDefinition = null;
		this.shieldConstraint = null;
		this.isInitialized = false;
		this.isDebug = false;
		this.isShieldBroken = false;
	},
	
	hasShield: function() {
		return this.isInitialized;
	},
	
	isBroken: function() {
		return this.isShieldBroken;
	},
	
	breakShield: function() {
		this.isShieldBroken = true;
		this.shield.body.fixedRotation = false;
		this.gameContext.game.physics.p2.removeConstraint(this.shieldConstraint);
		delete this.shieldConstraint;

	},

	getShieldDefinition: function(shieldName) {
		for (index in SHIELDS) {
			shield = SHIELDS[index];
			if (shield.name == shieldName) {
				return shield;
			}
		}
		return null;
	}
};
