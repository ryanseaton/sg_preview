/**
* The Game's Preload Manager singleton
* Before going to the next state each state defines whether
* the previous asset preloading completed, what state or level
* is the 'current' one and which state or level is the 'next'
* one to be loaded.
* @class PRELOAD_MANAGER
*/
var PRELOAD_MANAGER = {
		record : {
			isComplete : false,
			from : null,
			to : null
		},
		updateLevelStarted: function(levelIndex) {
			this.record.isComplete = false;
			this.record.from = levelIndex;
			this.record.to = null;
		},
		
		updateMenuStarted: function() {
			this.record.isComplete = false;
			this.record.from = "menu";
			this.record.to = null;
		},
		
		updateCreditsStarted: function() {
			this.record.isComplete = false;
			this.record.from = "credits";
			this.record.to = null;
		},
		
		updateGoToLevel: function(levelIndex) {
			this.record.isComplete = false;
			this.record.to = levelIndex;
		},
		
		updateLevelReset: function() {
			this.record.isComplete = true;
		},
		
		updateGoToMenu: function() {
			this.record.isComplete = false;
			this.record.to = "menu";
		},
		
		updateGoToCredits: function() {
			this.record.isComplete = false;
			this.record.to = "credits";
		},
		
		updatePreloadComplete: function() {
			this.record.isComplete = true;
		},
		
		isComplete: function() {
			return this.record.isComplete;
		},
		
		isFirstPreload: function() {
			return this.record.from == null && this.record.to == "menu";
		},
		
		isFromMenu: function() {
			return this.record.from == "menu";
		},
		
		isFromCredits: function() {
			return this.record.from == "credits";
		},
		
		isFromLevel: function() {
			return isInteger(this.record.from);
		},
		
		isToMenu: function() {
			return this.record.to == "menu";
		},
		
		isToCredits: function() {
			return this.record.to == "credits";
		},
		
		isToLevel: function() {
			return isInteger(this.record.to);
		},
		
		getTo: function() {
			return this.record.to;
		},
		
		getFrom: function() {
			return this.record.from;
		}
		
};