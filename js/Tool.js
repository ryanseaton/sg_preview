/**
* The Game's Tool constructor.
* Tool instances are used by the player to slap the guy. Instances
* are created from definitions in data/tools.js
* @class Tool
* @constructor
* @param toolDefinition - the JSON tool definition from data/tools.js
* @param {Slapgame.Level} gameContext - Reference to the game level instance.
*/
Tool = function(toolDefinition, gameContext) {
	this.slapCount = 0;
	this.debug = gameContext.debug;
	this.toolDefinition = toolDefinition;
	this.toolName = toolDefinition.name;
	this.isToolSelected = false;
	this.isAnimComplete = true;
	this.isNewClick = false;
	this.gameContext = gameContext;
	//used to get keys for hit detection
	this.spriteSheets = GUY_ANIMATION_MANAGER.getSpriteSheetNames();
	
	this.spriteAnimationManager = null;
	this.splash = null;
	this.splashAnimationManager = null;
	this.toolSplashAnimation = null;
	this.bruise = null;
	
	this.sprite = null;
	
	this.initSpriteAndAnimations();
	
	//impact sound
	this.sound = this.gameContext.add.audio(this.toolDefinition.sound.name);
	
	//stun sound
	if (typeof this.gameContext.LEVEL_DEFINITION.ballHazard != 'undefined') {
		this.stunSound = this.gameContext.add.audio('stunSound');
	}
	
	
	//speedMultiplier
	this.speedMultiplier = this.toolDefinition.speedMultiplier ? this.toolDefinition.speedMultiplier : 0;
	
	//Immune to Ball Hazard
	this.isAntiHazard = this.toolDefinition.isAntiHazard ? true : false;
	
	//Flying Shield swatting ability
	this.isAntiShieldReplacer = this.toolDefinition.isAntiShieldReplacer ? true : false;
	
	//time rewind
	this.timeRewind = (typeof this.toolDefinition.timeRewind != 'undefined') 
		? this.toolDefinition.timeRewind : null;

  //timer stun
	this.stunTimer = this.gameContext.time.create(false);
	this.stunTimer.name = this.toolDefinition.name+"Stun";
	this.stunTimer.add(Phaser.Timer.SECOND*2, this.endStun, this);
	this.isStunFinished = true;
    
    this.tapSpriteCoords = {x: this.gameContext.game.input.x, y: this.gameContext.game.input.y};
    
};

Tool.prototype = {
	
	select : function(spawnAtDefault) {
		if (this.sprite == null) { this.initSpriteAndAnimations(); }
		
		if (spawnAtDefault){
			xCoord = this.gameContext.game.world.centerX+300;
			yCoord = this.gameContext.game.world.centerY-55;
		} else {
			xCoord = this.gameContext.game.input.x*InputRatio.x;
			yCoord = this.gameContext.game.input.y*InputRatio.y;
		}
		this.sprite.x = xCoord;
		this.sprite.y = yCoord;
		
		this.impactForce = this.toolDefinition.impact;
		this.resetTextureName = this.toolDefinition.sprite.name;
		this.isNewClick = true;
		this.slapCount = 0;
		
		//P2
		collisionGroups = [this.gameContext.wallCollisionGroup, this.gameContext.targetCollisionGroup, this.gameContext.hazardCollisionGroup];
		if (this.isAntiShieldReplacer) {collisionGroups.push(this.gameContext.fShieldCollisionGroup);}
		this.sprite.visible = true;
		this.sprite.scale.x = 1; //avoid clockwise convex vertices
		this.sprite.scale.y = 1; //avoid clockwise convex vertices

		this.gameContext.game.physics.p2.enable(this.sprite, this.debug);
		this.sprite.body.setCircle(75);
		this.sprite.body.fixedRotation = true;
		this.sprite.body.mass = this.toolDefinition.mass;
		this.sprite.body.onBeginContact.add(this.toolHit, this);
		//this.sprite.body.allowGravity = false;
		this.sprite.body.data.gravityScale = 0;
		this.sprite.body.setCollisionGroup(this.gameContext.toolCollisionGroup);
		this.sprite.body.collides(collisionGroups);
		this.sprite.body.setMaterial(this.gameContext.toolMaterial);
		
		//touch input - force it for now
		//this.isTouchEnabled = this.gameContext.game.input.activePointer != this.gameContext.game.input.mousePointer ? true : false;
		this.isTouchEnabled = true;
	    //console.log("touch enabled ? "+ this.isTouchEnabled);
		
		//Bruise
		if (this.bruise) {
			BRUISE_MANAGER.updateSprite(this.bruise.animationName);
		}
		
	    this.isToolSelected = true;
	    
	    this.fixZOrdering();

	},
	
	unSelect : function() {
		if (this.sprite.body.debugBody)
        {
			this.sprite.body.debugBody.destroy();
        }
		
		if (!this.isStunFinished) {
			this.endStun();
		}

		this.sprite.body.onBeginContact.removeAll();
		this.sprite.body.isSafeDestroy = true;
		this.gameContext.game.physics.p2.removeBodyNextStep(this.sprite.body);
		delete this.sprite.body;
		this.sprite.body = null;
		this.sprite.visible = false;
		this.isToolSelected = false;

	},
	
	destroy: function() {
		this.isToolSelected = false;
		this.animation = null;
		if (this.sprite) {
			this.sprite.destroy();
			delete this.sprite;
		}
		this.sound = null;
		this.resetTextureName = null;
	},
	
	stopTimers: function() {
		this.stunTimer.stop();
	},
	
	fixZOrdering: function() {
		if (SHIELD_MANAGER.hasShield()) {
			SHIELD_MANAGER.bringToTop();
		}
		this.sprite.bringToTop();
		this.gameContext.healthFill.bringToTop();
		this.gameContext.healthFillContainer.bringToTop();
		this.gameContext.healthIcon.bringToTop();
		if (SHIELD_MANAGER.hasShield()) {
			this.gameContext.shieldFill.bringToTop();
			this.gameContext.shieldContainer.bringToTop();
			this.gameContext.shieldIcon.bringToTop();
		}
		//level display
		if (typeof this.gameContext.levelDisplay != 'undefined') {
			this.gameContext.levelDisplay.destroy();
			delete this.gameContext.levelDisplay;
		}
		this.gameContext.levelDisplay = this.gameContext.add.bitmapText(this.gameContext.game.world.width-290
				, 10, 'titleFont',STRINGS.LBL_LEVEL+this.gameContext.LEVEL_DEFINITION.id,70);
	},
	
	initSpriteAndAnimations: function(spawnAtDefault) {
		//sprite - loaded by key in preloader
		this.sprite = this.gameContext.add.sprite(this.gameContext.game.world.centerX+300
				, this.gameContext.game.input.y, this.toolDefinition.sprite.name);
		this.sprite.visible = false;
		this.sprite.anchor.setTo(0.5,0.5);
		
		//impact animation
		if (typeof this.toolDefinition.sprite.animation != 'undefined') {
			//ANIMATION MANAGER!
			this.spriteAnimationManager = new SpriteAnimationManager();
			this.spriteAnimationManager.loadAnimation(this.toolDefinition.sprite.animation.name, this.sprite);
		} else {
			//this.spriteAnimationManager = null;
		}
		//splash
		if (typeof this.toolDefinition.splash != 'undefined') {
			this.splash = this.gameContext.add.sprite(this.gameContext.game.world.centerX, this.gameContext.game.world.centerY
					, this.toolDefinition.splash.name);
			this.splash.visible = false;
			
			//splash sound
			this.splashSoundName = this.toolDefinition.splash.sound ? this.toolDefinition.splash.sound.name : null;
			//console.log(this.splashSoundName);
			this.splashSound = this.splashSoundName ? this.gameContext.add.audio(this.splashSoundName) : null;
			//console.log(this.splashSound);
			
			//splash animation
			if (typeof this.toolDefinition.splash.animation != 'undefined') {
				this.splashAnimationManager = new SpriteAnimationManager();
				this.splashAnimationManager.loadAnimation(this.toolDefinition.splash.animation.name, this.splash);
			} else {
				//this.splashAnimationManager = null;
			}
		} else {
			this.splash = null;
			this.splashAnimation = null;
		}
		
	    //ToolSplashAnimation
	    if (this.splash) {
	    	this.toolSplashAnimation = new ToolSplashAnimation(this.gameContext, this.splash, this.splashAnimationManager, this.splashSound);
	    }
	    
	    //Bruise
	    if (typeof this.toolDefinition.bruise != 'undefined') {
	    	this.bruise = new Bruise(this.gameContext, this.toolDefinition.bruise.name, this, this.toolDefinition.bruise.numSlaps);
	    }
	},
	
	stun: function() {
		//console.log("stun called");
		this.stunSound.play();
		this.isStunFinished = false;
		this.stunTimer.start();
		if (!Cocoon.nativeAvailable || Cocoon.Device.getDeviceInfo().os != "ios") {
			this.sprite.tint = 0x666666;
		}
		this.sprite.body.allowGravity = true;
		this.sprite.scale.y = -1;
		this.sprite.body.data.gravityScale = 1.5;
	},
	
	endStun: function() {
		//the level may have ended
		if (this.gameContext.GAME_PHASE != this.gameContext.PLAY_PHASE) {return;}
//		if (!this.sprite) {return;}
		this.isStunFinished = true;
//		this.stunTimer.stop(false);
		this.stunTimer.stop(true);
		if (!Cocoon.nativeAvailable || Cocoon.Device.getDeviceInfo().os != "ios") {
			this.sprite.tint = 0xFFFFFF;
		}
		this.sprite.body.allowGravity = false;
		this.sprite.body.data.gravityScale = 0;
		this.sprite.scale.y = 1;
		this.stunTimer.add(Phaser.Timer.SECOND*2, this.endStun, this);
	},
	
	animate : function() {
		if (this.hasImpactAnimation) {
			this.sprite.animations.play(this.animation.name, 20, false);
		}
	},
	
	playToolSplashAnimation: function() {
		if (this.toolSplashAnimation) {
			this.toolSplashAnimation.start(this.gameContext.game.world.centerX, this.gameContext.game.world.centerY);
		}
	},
	
	resetAnimation : function() {
		this.sprite.loadTexture(this.resetTextureName,0);
		this.isAnimComplete = true;
	},
	
	invertIfNecessary : function(referenceObject) {
		//P2 Body
		if (!this.isToolSelected) {
			this.sprite.scale.x = 1;
			return;
		}
		if(this.sprite.x  > referenceObject.body.x) {
			this.sprite.scale.x = 1;
		} else {
			this.sprite.scale.x = -1;
		}
	},
	
	handleMovement: function() {
		if (!this.isTouchEnabled) {
			this.handleAnimationForMouse();
		} else {
			this.moveToCursorForTouch();
		}
	},

	moveToMouse : function() {
		if (this.isAnimComplete) {
			if (Math.abs(this.sprite.x - this.gameContext.game.input.x) < 25 && Math.abs(this.sprite.y - this.gameContext.game.input.y) < 25) {
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
	        } else {
	        	xDistance = this.gameContext.game.input.x - this.sprite.x;
	        	yDistance = this.gameContext.game.input.y - this.sprite.y;
	        	this.sprite.body.velocity.x = xDistance*15;
	        	this.sprite.body.velocity.y = yDistance*15;
	        }
		}
	},
	
	moveToCursorForTouch : function() {
		if (this.gameContext.game.input.activePointer.isUp) {
			this.swipeComplete = true;
		} else if (this.gameContext.game.input.activePointer.isDown) {
			if (this.swipeComplete && this.isStunFinished) {
				if (this.spriteAnimationManager) {
					this.spriteAnimationManager.playAnimation(this.toolDefinition.sprite.animation.name, this.sprite, 17, false);
				}
				//TODO: swipe sound
			}
			this.swipeComplete = false;
			this.returnToPoint(this.gameContext.game.input);
		}
	},

	
	returnToPoint : function (reference) {
		if (!this.isStunFinished) {return;}
		if (Math.abs(this.sprite.x - reference.x) < 25 && Math.abs(this.sprite.y - reference.y) < 25) {
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
			this.swipeComplete = true;
        } else {
        	xDistance = reference.x*InputRatio.x - this.sprite.x;
        	yDistance = reference.y*InputRatio.y - this.sprite.y;
        	xBaseSpeed = xDistance  < 0 ? -400 : 400;
        	yBaseSpeed = yDistance  < 0 ? -400 : 400;
        	this.sprite.body.velocity.x = xBaseSpeed + xDistance*this.speedMultiplier;
        	this.sprite.body.velocity.y = yBaseSpeed + yDistance*this.speedMultiplier;
        }
	},
	
	//currently not used
//	handleAnimationForMouse : function() {
//		if (this.gameContext.game.input.activePointer.isDown) {
//			 if (!this.isAnimComplete) {
//				 this.animate();
//				 this.isNewClick = false;
//			 } else if (this.isAnimComplete && this.isNewClick){
//				//stop the tool from flying away when you click a button
//				 if (!this.gameContext.isHoveringOverButton()) {
//				 //this.sound.play();
//				 this.animate();
//				 this.isNewClick = false;
//				//P2 physics
//				 //this.sprite.body.data.applyForce([forceX,forceY],[0, 0]);
//				 }
//				 
//			 }
//		 } else if (this.gameContext.game.input.activePointer.isUp) {
//			 this.isNewClick = true;
//			 if (!this.isAnimComplete) {
//				 this.animate();
//			 } else {
//				 //follow the cursor
//				 this.moveToMouse();
//			 }
//		 }
//	},
	
	//currently not used
//	handleTap : function() {
//		if (this.isTapFinished && !this.gameContext.isHoveringOverButton()) {
//			this.tapSpriteCoords.x = this.sprite.x;
//			this.tapSpriteCoords.y = this.sprite.y;
//			//screen relative force ratios
//			ratioX = this.gameContext.game.world.width/800;
//			ratioY = Math.abs(this.gameContext.game.world.centerY-this.sprite.y)/this.gameContext.game.world.height;
//			
//			forceX = (this.gameContext.game.world.centerX -  this.sprite.x) > 0 ? -1*this.toolDefinition.force.touchX : this.toolDefinition.force.touchX;
//			forceY = (this.gameContext.game.world.centerY -  this.sprite.y) > 0 ? -1*this.toolDefinition.force.touchY : this.toolDefinition.force.touchY;
//			forceX *= ratioX;
//			forceY *= ratioY;
//			this.sound.play();
//			this.sprite.body.data.applyForce([forceX,forceY],[0, 0]); 
//			this.animate();
//			this.tapTimer.start();
//			this.isTapFinished = false;
//			this.isReturnedToRest = false;
//			this.isTouchedSinceTap = false;
//		}
//
//	},
	
//	handleOnDown: function() {
//		if (this.isTapFinished && this.isAnimComplete) {
//			this.isTouchedSinceTap = true;
//		}
//	},
	
//	endTapTimer: function () {
//		this.isTapFinished = true;
//		this.tapTimer.stop(false);
//		this.tapTimer.add(CONFIG.TAP_TIMER_DURATION, this.endTapTimer, this);
//	},
	
	/*
	 * Handle collisons between the tool and other bodies
	 */
	toolHit : function (body, shapeA, shapeB, equation) {
		if (this.gameContext.GAME_PHASE == this.gameContext.PLAY_PHASE) {
			
			//we hit the world bounds?
			if (body == null || body.sprite == 'undefined' || body.sprite == null) {
				
			//we hit some 'body'
			} else {				
				isPlayImpactAnimation = false;
				meterTarget = null;
				physicsForce = null;
				//find out how 'hard' the hit was
				magnitude = Math.sqrt(Math.pow(this.sprite.body.velocity.x,2) + Math.pow(this.sprite.body.velocity.y,2));
				slapSound = null;
				slapVolume = (magnitude > 1200) ? 0.8 : 0.6;
				boostAmount = 0;
				// we hit the face	
				//note: the toolBox's sprite could be null
				if (body != null && body.sprite != null && this.spriteSheets.indexOf(body.sprite.key) >= 0 && magnitude > 1000) {
					slapSound  = this.sound;		
					boostAmount = (magnitude > 100) ? this.impactForce : this.impactForce*0.55;
					isPlayImpactAnimation = true;
					meterTarget = this.gameContext.gameMeter;
					physicsForce = (magnitude > 2000) ? this.getSlapForce(magnitude) : null;
				// we hit the shield
				} else if (SHIELD_MANAGER.hasShield() && body.sprite.key == SHIELD_MANAGER.shield.body.sprite.key && magnitude > 1000) {
					slapSound  = SHIELD_MANAGER.shieldSound;
					boostAmount = (magnitude > 100) ? this.impactForce-SHIELD_MANAGER.strength
							: (this.impactForce*0.5)-SHIELD_MANAGER.strength;
					//prevent boost amounts from being negative
					boostAmount = boostAmount < 0 ? 0 : boostAmount;
					meterTarget = this.gameContext.shieldMeter;
					physicsForce = (magnitude > 1500) ? this.getSlapForce(magnitude) : null;
				}
				this.handleSlap(slapSound, slapVolume, meterTarget, boostAmount, isPlayImpactAnimation, physicsForce);
			}			
			
		}
	},
	
	/*
	 * Handle the collision between the tool and the guy
	 */
	handleSlap: function(slapSound, slapVolume, meterTarget, boostAmount, isPlayImpactAnimation, physicsForce) {		
		if (slapSound !=null) {
			slapSound.volume = slapVolume;
			slapSound.play();
		}
		if (isPlayImpactAnimation) {
			this.gameContext.playImpactAnimation(this.sprite);
			if (CONFIG.ENABLE_GUY_SOUNDS) {
				this.gameContext.playGuySound();
			}			
		}
		if (physicsForce != null) {
			this.gameContext.blake.body.data.applyForce(physicsForce, [0, 0]);
		}
		if (meterTarget != null) {
			meterTarget.boost(boostAmount);
			//Bruising
			if (this.bruise && meterTarget == this.gameContext.gameMeter) {
				this.slapCount++;
				if (this.slapCount >= this.bruise.numSlaps) {
					this.bruise.applyBruise();
				}
				
			}
		}
	},
	
	getSlapForce: function(magnitude) {
		magnitudeMultiplier = Math.ceil(magnitude/10);
		forceX = (this.gameContext.blake.x -  this.sprite.x) > 0 ? -1*this.toolDefinition.force.touchX 
				: this.toolDefinition.force.touchX;
		forceY = (this.gameContext.blake.y -  this.sprite.y) > 0 ? -1*this.toolDefinition.force.touchY 
				: this.toolDefinition.force.touchY;

		forceY = (this.gameContext.blake.y -  this.sprite.y) < 60 ? forceY : 0;
		return [forceX, forceY];
	}
};

/**
* The Game's Bruise constructor.
* This class represents the bruising behaviour
* associated with one or more tools
* @class Bruise
* @constructor
* @param {Slapgame.Level} gameContext - Reference to the game level instance.
* @param bruiseName - the name of the bruise as defined in data/bruises.js
* @param {Tool} tool - the Tool instance to which this Bruise belongs
* @param numSlaps - the number of slaps required for the bruise to start showing up
*/
Bruise = function(gameContext, bruiseName, tool, numSlaps) {
	this.numSlaps = numSlaps;
	this.tool = tool;
	this.decayTime = 1.5; //seconds
	this.gameContext = gameContext;
	this.animationName = BRUISE_MANAGER.getAnimationName(bruiseName);
	BRUISE_MANAGER.updateSprite(this.animationName);
	this.clock = this.gameContext.time.create(false);
	this.clock.name = bruiseName;
	this.LRSprite = null;
};

Bruise.prototype = {
		
	applyBruise: function() {
		this.clock.stop();
		if (BRUISE_MANAGER.animationName != this.animationName) {
			BRUISE_MANAGER.updateSprite(this.animationName);
		}
		
		this.LRSprite = this.gameContext.currentTool.sprite.x > this.gameContext.blake.x ? BRUISE_MANAGER.spriteR : BRUISE_MANAGER.spriteL;

		this.LRSprite.visible = true;
		this.LRSprite.alpha = 1.0;
		this.clock.loop(Phaser.Timer.SECOND/8*this.decayTime, this.updateTimer, this);
		this.clock.start();
		BRUISE_MANAGER.playAnimation(this.LRSprite);
	},

	
	stop: function() {
		this.clock.stop();
	},	

		
	updateTimer: function() {
		if (this.gameContext.paused) {return;}
		if (BRUISE_MANAGER.spriteR.alpha >= 0.1) {
			this.fadeBruiseSprite(BRUISE_MANAGER.spriteR);
		}
		if (BRUISE_MANAGER.spriteL.alpha >= 0.1) {
			this.fadeBruiseSprite(BRUISE_MANAGER.spriteL);
		}
		if (BRUISE_MANAGER.spriteL.visible == false && BRUISE_MANAGER.spriteR.visible == false) {
			this.stop();
		}
	},
	
	fadeBruiseSprite: function(sprite) {
		sprite.alpha -= 0.1;
		if (sprite.alpha < 0.1) {
			sprite.visible = false;
		}
	}
		
};