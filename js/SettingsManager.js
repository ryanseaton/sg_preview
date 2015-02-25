/**
* The Player Settings Manager singleton
* This class reads and writes the player's game settings
* to local storage.
* @class SETTINGS_MANAGER
*/
var SETTINGS_MANAGER = {
	SettingsData: "",
	NewSettingsData: {
		"muteMusic": false			
	},

	init: function() {
		//get the existing player data or create a new one if none exists
		this.SettingsData = (localStorage[CONFIG.LOCAL_STORAGE_KEY_SETTINGS]) ? JSON.parse(localStorage[CONFIG.LOCAL_STORAGE_KEY_SETTINGS]) : this.NewSettingsData;
	},
	
	isMusicMuted: function() {
		return this.SettingsData.muteMusic;
	},
	
	toggleMusic: function() {
		this.SettingsData.muteMusic = this.SettingsData.muteMusic ? false : true;
		localStorage[CONFIG.LOCAL_STORAGE_KEY_SETTINGS] = JSON.stringify(this.SettingsData);
	},
	
};
