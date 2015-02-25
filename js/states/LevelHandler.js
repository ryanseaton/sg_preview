/**
* The Game's Level Handler state constructor.
* This state is used to route the player to either
* the Dynamic Preloader, Interstitial Ad or Info Page states as necessary
* before finally routing them to the Level state.
* @class Slapgame.LevelHandler
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.LevelHandler = function (game) {

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

SlapGame.LevelHandler.prototype = {
		
	init: function(adsAlreadyShown, skipInfo) {		
		this.showAd = CONFIG.ENABLE_ADS && (typeof adsAlreadyShown ===  'undefined' || adsAlreadyShown == false);
		this.skipInfo = typeof skipInfo != 'undefined' && skipInfo == true;
	},
		
	create: function () {
		this.debug = false;
		
		if (!PRELOAD_MANAGER.isComplete()) {
			//console.log("going to dynamic preloader");
			this.state.start('DynamicPreloader');
			return;
		} else {
			//console.log("skipping dynamic preloader");
		}
		
		if (this.showAd) {
//			console.log("going to ad state");
			this.state.start('InterstitialAd', true, false, this.skipInfo);
			return;
		}		

		this.LEVEL_DEFINITION = LEVEL_CONTROLLER.getCurrentLevel();
		if (this.LEVEL_DEFINITION.infoPage && !this.skipInfo) {
			//if we have an array of pages
			if( Object.prototype.toString.call(this.LEVEL_DEFINITION.infoPage) === '[object Array]' ) {
				nextInfoPages = this.LEVEL_DEFINITION.infoPage.slice(0);
				infoPage = nextInfoPages.splice(0,1);
				this.state.start('InfoPage', true, false, infoPage, nextInfoPages);
			} else {
				infoPage = this.LEVEL_DEFINITION.infoPage;
				this.state.start('InfoPage', true, false, infoPage);
			}
		} else {
			this.state.start('Level');
		}	
	}
};
