/**
* The Level Controller singleton
* This manages what levels are available to the player
* to local storage.
* @class PLAYER_DATA_MANAGER
*/
var LEVEL_CONTROLLER = {
	_currentIndex : 0,
	_maxIndex : LEVELS.level.length -1,
		
	getIndex: function() {
		return this._currentIndex;
	},
	
	setIndex: function(newIndex) {
		if (newIndex >= LEVELS.level.length || newIndex < 0) {
			return false;
		} else {
			this._currentIndex = newIndex;
			return true;
		}
	},
	
	hasNext: function() {
		return this._currentIndex < LEVELS.level.length -1;
	},
	
	advance: function() {
		if (this.hasNext()) {
			this._currentIndex++;
			return true;
		} else {
			return false;
		}
	},
	
	getCurrentLevel: function() {
		return LEVELS.level[this._currentIndex];
	},
	
	getLevel: function(index) {
		return LEVELS.level[index];
	},
	
	getCreditsLevel: function() {
		return LEVELS.level[this._maxIndex];
	}
};