/**
* The Game's Interstitial Ad state constructor.
* This state is used to display interstitial ads
* between levels.
* @class Slapgame.InterstitialAd
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.InterstitialAd = function (game) {

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

SlapGame.InterstitialAd.prototype = {
		
	/*
	 * Skip the info page when restarting a level - just show the ad.
	 */
	init: function(skipInfo) {
		this.skipInfo = skipInfo;
	},
		
	create: function () {
		result = AD_MANAGER.showInterstitial();
		
		//console.log("ad result: "+result);
		if (result) {
			// in case the ad never shows...
			this.timer = this.time.create(false); 
			this.timer.add(Phaser.Timer.SECOND*0.5, this.timeout, this);
			this.timer.start();
			
			var _this = this;
			AD_MANAGER.interstitial.onFullScreenReady.addEventListener(function() {
				//console.log("ia ready");
				AD_MANAGER.interstitialAdReady = true;
			});
			AD_MANAGER.interstitial.onFullScreenShown.addEventListener(function() {
				//console.log("ia shown");
				AD_MANAGER.interstitialAdReady = false;
				_this.timer.stop();
			});
			
			AD_MANAGER.interstitial.onFullScreenHidden.addEventListener(function() {
				//console.log("ia hidden");
				_this.goToLevel(_this);
			});
		} else {
			this.state.start('LevelHandler', true, false, true, this.skipInfo);
		}
	},
	
	goToLevel: function(gameContext) {
		gameContext.state.start('LevelHandler', true, false, true, this.skipInfo);
	},
	
	timeout: function() {
		this.state.start('LevelHandler', true, false, true, this.skipInfo);
	}
};
