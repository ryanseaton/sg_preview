/**
* The Game's Info Page state constructor.
* This state is used between Level states to inform
* the player about new game play mechanics and items.
* @class Slapgame.InfoPage
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.InfoPage = function (game) {

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

    this.LEVEL_DEFINITION;
};

SlapGame.InfoPage.prototype = {
		
	/*
	 * Splice the next Info Page definition from the list
	 * and set it as the next info page to be displayed (after the current one).
	 */
	init: function(infoPage, nextInfoPages) {
		this.infoPage = infoPage;
		this.nextInfoPages = null;
		this.nextInfoPage = null;
		if (typeof nextInfoPages !== "undefined" && nextInfoPages != null
		&& nextInfoPages.length > 0) {			
			this.nextInfoPages = nextInfoPages;
			this.nextInfoPage = this.nextInfoPages.splice(0,1);
		}
	},
		
	create: function () {
		this.debug = false;
		
		var infoPages = INFO_PAGES;
		this.pageDefinition = null;
		for (index in infoPages) {
			ip = infoPages[index];
			if (ip.name == this.infoPage) {
				this.pageDefinition = ip;
			}			
		}
		
		if (this.pageDefinition == null) {
				this.state.start('Level');		
		}
		
		//sound
		this.music = this.pageDefinition.type == "tool" ? this.add.audio('infoToolSound') : this.add.audio('infoSound');
		this.music.play();

		//background
		setInfoPageBackGround(this);
				
		this.animationManager = null;
		//sprites
		if (this.pageDefinition.animation) {
			this.image = this.add.sprite(this.game.world.centerX, this.game.world.centerY-70, "anchor");
			this.animationManager = new SpriteAnimationManager();
			this.animationManager.playAnimation(this.pageDefinition.animation, this.image, 17, true);
		} else {
			this.image = this.add.sprite(this.game.world.centerX, this.game.world.centerY-70, this.pageDefinition.name);
		}
		
		this.image.anchor.setTo(0.5, 0.5);
		this.infoText = this.add.bitmapText(this.game.world.centerX-330, this.game.world.centerY+120
				, 'titleFont',this.pageDefinition.text,60);
		this.infoText.multiLine = true;
		this.infoText.align = 'left';
		this.continueButton = this.add.button(this.game.world.centerX+330, this.game.world.centerY
				, 'buttons', this.goToNext, this, 11, 10, 11, 10);
		this.menuSound = this.add.audio('menuSound');
		this.continueButton.onDownSound = this.menuSound;
		this.continueButton.anchor.setTo(0.5,0.5);


	},
	
	update: function () {
	},
	
	stopSounds: function() {
		this.music.stop();
	},
	
	goToNext: function() {
		this.stopSounds();
		if (this.nextInfoPage) {
			this.state.start('InfoPage', true, false, this.nextInfoPage, this.nextInfoPages);
		} else {
			this.state.start('Level');
		}		
	}
};
