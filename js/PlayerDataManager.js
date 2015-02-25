/**
* The Player Data Manager singleton
* This class reads and writes the player's game progress
* to local storage.
* @class PLAYER_DATA_MANAGER
*/
var PLAYER_DATA_MANAGER = {
	//Player data contains an array of level records,
	//one level record per level in the game.
	//Each level record contains an array of attempts
	PlayerData: "",
	NewPlayerData: {
		"levelRecords": []			
	},
	NewLevelRecord: {
		"id": null,
	    "attempts": [],
	    "highestScore": 0,
	    "isBeaten": false
	},
	NewAttempt: {
		levelID : null,
		isSuccess : false,
		score : 0,
		slaps : 0
	},
	init: function() {
		//get the existing player data or create a new one if non exists
		this.PlayerData = (localStorage[CONFIG.LOCAL_STORAGE_KEY]) ? JSON.parse(localStorage[CONFIG.LOCAL_STORAGE_KEY]) : this.NewPlayerData;
//		console.log(this.PlayerData);
	},
	saveAttempt: function(levelID, isSuccess, score, slaps) {
		//create a new Attempt object
		var attempt = JSON.parse(JSON.stringify(this.NewAttempt));
		
		attempt.levelID = levelID;
		attempt.isSuccess = isSuccess;
		attempt.score = score;
		attempt.slaps = slaps;
		
		//get the player's level record for this level if it exists
		//make a new one if it doesn't
		currentLevelRecord = this.getCurrentLevelRecord(levelID);
		if (!currentLevelRecord) {
			isNewCurrentLevelRecord = true;
			var currentLevelRecord = JSON.parse(JSON.stringify(this.NewLevelRecord));
			currentLevelRecord.id = levelID;
			currentLevelRecord.highestScore = score;
		} else {
			isNewCurrentLevelRecord = false;
		}
		//determine the highest score by comparing this new score to all
		//the scores in the level record
//		highestScore = score;
//		for (index in currentLevelRecord.attempts) {
//			highestScore =(currentLevelRecord.attempts[index].score > highestScore) ?
//					currentLevelRecord.attempts[index].score : highestScore;
//		}

		highestScore = score > currentLevelRecord.highestScore ? score : currentLevelRecord.highestScore;
		currentLevelRecord.highestScore = highestScore;
		currentLevelRecord.isBeaten = currentLevelRecord.isBeaten || isSuccess;
		
		//add the level attempt to the level record
		currentLevelRecord.attempts.push(attempt);
		
		//If this was a new level record then we add it to
		//the player level record array.
		//Otherwise we were already updating the existing
		//level record.
		if (isNewCurrentLevelRecord) {
			this.PlayerData.levelRecords.push(currentLevelRecord);
		}
		
		//Stringify the Player data and write it to the local storage
		//console.log(this.PlayerData);
		localStorage[CONFIG.LOCAL_STORAGE_KEY] = JSON.stringify(this.PlayerData);	
	},
	getCurrentLevelRecord: function(levelID) {
		levelRecords = this.PlayerData.levelRecords;
		for (index in levelRecords) {
			if (levelRecords[index].id == levelID) {
				return levelRecords[index];
			}
		}
		return null;
	},
	getResumeLevelIndex: function() {
		highestLevelId = 0;
		highestLevelIndex = 0;
		levelRecords = this.PlayerData.levelRecords;
		for (index=0; index < levelRecords.length; index++) {
			//console.log("index: "+index+", id: "+levelRecords[index].id+", isBeaten"+levelRecords[index].isBeaten);
			if (typeof levelRecords[index].id == 'number' 
			&& levelRecords[index].isBeaten === true) {
				//highestLevel = index+1 % levelRecords.length;
				highestLevelId = levelRecords[index].id > highestLevelId ? levelRecords[index].id: highestLevelId;
				highestLevelIndex = index;
			}		
		}
		
		//the resume level ID = the highest level id (we want the next level)
		return highestLevelId <= LEVEL_CONTROLLER._maxIndex ? highestLevelId : LEVEL_CONTROLLER._maxIndex;
//		return highestLevelIndex;
	}
};
