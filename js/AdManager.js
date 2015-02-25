/**
* The Ad Manager singleton
* This class is used to manage the life cycle
* of the CocoonJS interstitial ads.
* @class PLAYER_DATA_MANAGER
*/
var AD_MANAGER = {
	
	fullscreenParams : null,
	interstitial: null,
	interstitialAdReady : false,

	
	init: function() {
		if (!CONFIG.ENABLE_ADS) { return; }
		this.fullscreenParams = CONFIG.INTERSTITIAL_PARAMS;
		if (this.interstitialAdReady) {
			//console.log("already loaded");
			return;
		}
		if (this.interstitial == null) {
			this.interstitial = Cocoon.Ad.createInterstitial(this.fullscreenParams);
			this.interstitial.onFullScreenReady.addEventListener(this.onInterstitialReady);
			this.interstitial.onFullScreenHidden.addEventListener(this.onInterstitialHidden);
			this.interstitial.onFullScreenShown.addEventListener(this.onInterstitialShown);
		}
		
		this.interstitial.refreshInterstitial();
	},
	
	showInterstitial: function() {
		if (!CONFIG.ENABLE_ADS) { return false; }
		//console.log("ready sanity check: "+this.adReady);
		if (this.interstitialAdReady) {
			this.fullscreen = this.interstitial.showInterstitial();
			return true;
		} else {
			return false;
		}
	},
	
	releaseInterstitial: function() {
		if (!CONFIG.ENABLE_ADS) { return; }
		if (this.interstitial) {
			Cocoon.Ad.releaseInterstitial(this.interstitial);
		} else {
			//console.log("not releasing "+this.interstitial);
		}
	},

	onInterstitialReady: function() {
		//console.log("ready...");
		AD_MANAGER.interstitialAdReady = true;
	},

	onInterstitialHidden: function() {
		//console.log("hidden...");
		//game.state.start('LevelHandler', true, false, true);
//		Cocoon.app.resume();
		//Cocoon.Ad.releaseInterstitial(this.fullscreen);
		
	},

	onInterstitialShown: function() {
		//console.log("shown");
		this.interstitialAdReady = false;
//		Cocoon.app.pause();
	}
};