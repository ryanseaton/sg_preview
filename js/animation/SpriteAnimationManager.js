/**
* The Sprite Animation Manager constructor.
* This class is a wrapper for a given sprite's animation functions
* that allows any animation to be played on a sprite object.
* Animations are played by name as defined in data/animations.js
* and the proper sprite sheet is automatically loaded to the sprite
* object if the requested animation is not contained in the already
* loaded sprite sheet.
* The class also allows a 'default' animation to be set so that the
* caller can invoke the 'default' animation without knowing it's name.
* loaded sprite sheet
* @class SpriteAnimationManager
*/
SpriteAnimationManager = function() {
	
	this.loadedSpriteSheet = null;
	this.loadedAnimations = [];
	this.defaultAnimation = null;
	this.sprite = null;
	this.frameRate = null;
};
	
SpriteAnimationManager.prototype = {	
	playAnimation: function(animationName, sprite, frameRate, isRepeating) {
		
		this.frameRate = frameRate;
		if (this.loadedAnimations.indexOf(animationName) < 0) {
			//console.log(animationName+" not loaded");
			this.loadAnimation(animationName, sprite);
		}
		this.sprite.animations.stop();
		this.sprite.animations.play(animationName, frameRate, isRepeating);
		if (this.defaultAnimation != null && animationName != this.defaultAnimation) {
			sprite.events.onAnimationComplete.add(this.playDefaultAnimation, this);
		}
	},
	
	stopAnimations: function() {
		if (this.sprite) {
			this.sprite.animations.stop();
		}		
	},
	
	playDefaultAnimation: function() {
		if (this.loadedAnimations.indexOf(this.defaultAnimation) < 0) {
			this.loadAnimation(this.defaultAnimation, this.sprite);
		}
		this.sprite.animations.stop();
		this.sprite.animations.play(this.defaultAnimation, this.frameRate, true);
		this.sprite.events.onAnimationComplete.removeAll();
	},

	loadAnimation: function(animationName, sprite) {
		//console.log("loadAnim "+animationName);
		spriteSheet = null;
		var definition = null;
		var anim = null;
		for (i in ANIMATION_DEFINITIONS) {
			definition = ANIMATION_DEFINITIONS[i];
			animations = definition.animation;
			for (j in animations) {
				anim = animations[j];
				if (anim.name == animationName) {
					this.loadSpriteSheet(definition, sprite);
					return;
				}
			}
		}
	},
	
	loadSpriteSheet: function(definition, sprite) {
		//console.log("loading "+definition.spritesheet);
		this.sprite = sprite;
		this.sprite.loadTexture(definition.spritesheet, definition.startIndex);
		this.loadedAnimations = [];
		animations = definition.animation;
		for (j in animations) {
			anim = animations[j];
			//console.log("adding animation "+anim.name);
			this.sprite.animations.add(anim.name, anim.frames, false);
			this.loadedAnimations.push(anim.name);
		}		
	},
	
	clearAnimations: function() {
		this.loadedSpriteSheet = null;
		this.loadedAnimations = [];
		this.defaultAnimation = null;
		if (this.sprite) {
			this.sprite.animations.destroy();
		}
		this.sprite = null;
		this.frameRate = null;
	},
	
	getSpriteSheetNames: function() {
		var spriteSheetNames = [];
		for (i in ANIMATION_DEFINITIONS) {
			definition = ANIMATION_DEFINITIONS[i];
				spriteSheetNames.push(definition.spritesheet);
		}
		return spriteSheetNames;
	},
	
	getSpriteSheetNameForAnimation: function(animationName) {
		spriteSheet = null;
		var definition = null;
		var anim = null;
		for (i in ANIMATION_DEFINITIONS) {
			definition = ANIMATION_DEFINITIONS[i];
			animations = definition.animation;
			for (j in animations) {
				anim = animations[j];
				if (anim.name == animationName) {
					return definition.spritesheet;
				}
			}
		}
		return null;
	},
	
	setDefaultAnimation: function(defaultAnimationName,sprite) {
		this.loadAnimation(defaultAnimationName, sprite);
		this.defaultAnimation = defaultAnimationName;
		this.sprite = sprite;
	},
	
	isPlayingDefaultAnimation: function() {
		defaultAnim = this.sprite.animations.getAnimation(this.defaultAnimation);
		return typeof defaultAnim != 'undefined' && defaultAnim != null && defaultAnim.isPlaying;
	}

};
