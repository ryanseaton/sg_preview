/**
* The Bruise Manager singleton
* This class manages the animation and replacement of
* two bruise sprites (left and right) on the guy's face.
* @class PLAYER_DATA_MANAGER
*/
var BRUISE_MANAGER = {
	
	spriteR: null,
	spriteL: null,
	gameContext: null,
	spriteConstraintR: null,
	spriteConstraintL: null,
	isInitialized: false,
	isDebug: false,
	animationName: null,
	
	init: function(gameContext, isDebug) {
		this.gameContext = gameContext;
		this.isDebug = isDebug;
		this.spriteR = this.gameContext.add.sprite(this.gameContext.blake.x,this.gameContext.blake.y,"anchor");
		this.spriteL = this.gameContext.add.sprite(this.gameContext.blake.x,this.gameContext.blake.y,"anchor");
		this.spriteR.anchor.setTo(0.5,0.5);
		this.spriteL.anchor.setTo(0.5,0.5);		
		this.initP2Physics();
		this.spriteL.scale.x = -1;
		this.animationManagerL = new SpriteAnimationManager();
		this.animationManagerR = new SpriteAnimationManager();
	    this.isInitialized = true;
	},
	
	initP2Physics: function() {
    	this.gameContext.game.physics.p2.enable(this.spriteR, this.isDebug);
    	this.spriteR.body.collideWorldBounds = false;
    	this.spriteR.body.fixedRotation = true;
    	this.spriteR.body.data.gravityScale = 0;
    	this.spriteR.body.setCollisionGroup(this.gameContext.targetCollisionGroup);
    	this.spriteR.body.collides([]);
    	
    	this.gameContext.game.physics.p2.enable(this.spriteL, this.isDebug);
    	this.spriteL.body.collideWorldBounds = false;
    	this.spriteL.body.fixedRotation = true;
    	this.spriteL.body.data.gravityScale = 0;
    	this.spriteL.body.setCollisionGroup(this.gameContext.targetCollisionGroup);
    	this.spriteL.body.collides([]);

    	this.spriteConstraintR = this.gameContext.game.physics.p2.createLockConstraint(this.gameContext.blake, this.spriteR
    			, [0, 0], 0);
    	this.spriteConstraintL = this.gameContext.game.physics.p2.createLockConstraint(this.gameContext.blake, this.spriteL
    			, [0, 0], 0);
	},
	
	clear: function() {
		this.spriteR = null;
		this.spriteL = null;
		this.gameContext = null;
		this.spriteConstraintR = null;
		this.spriteConstraintL = null;
		this.animationManagerL = null;
		this.animationManagerR = null;
		this.isInitialized = false;
	},

	updateSprite: function(key) {
		this.animationName = key;
		this.animationManagerL.loadAnimation(this.animationName,this.spriteL);
		this.spriteL.visible = false;
		this.animationManagerR.loadAnimation(this.animationName,this.spriteR);		
		this.spriteR.visible = false;
	},
	
	playAnimation: function(sprite) {
		if (sprite == this.spriteL) {
			this.animationManagerL.playAnimation(this.animationName, this.spriteL, 17, false);
		} else  {
			this.animationManagerR.playAnimation(this.animationName, this.spriteR, 17, false);
		}
	},
	
	getAnimationName: function(bruiseName) {
		for (index in BRUISES) {
			bruise = BRUISES[index];
			if (bruise.name == bruiseName) {
				return bruise.animation;
			}
		}
		return null;
	}
};
