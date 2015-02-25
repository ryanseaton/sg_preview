/**
* The Level Asset Manager singleton
* This is used by the dynamic preloader to
* glean the asset-relevant information about
* a level from it's definition. It contains
* two LevelAssetRecords; one for the current
* level and one for the level to be loaded.
* @class LEVEL_ASSET_MANAGER
*/

LevelAssetRecord = function() {
    	this.background= null;
    	this.shield= null;
    	this.toolBox= false;
    	this.tools= [];
    	this.hasHazard= false;
    	this.hasShieldReplacer = false;
    	this.infoPage = null;
    	this.startingAnimation= null;
    	this.hitAnimations= null;
    	this.successAnimation= null;
    	this.failAnimation= null;
};

var LEVEL_ASSET_MANAGER = {
		current_level_assets : new LevelAssetRecord(),
		next_level_assets: new LevelAssetRecord(),
		
		createAssetRecord: function(levelDefinition) {
			assetRecord = new LevelAssetRecord();
			assetRecord.background = levelDefinition.background;			

			if (typeof levelDefinition.shield != 'undefined') {
				assetRecord.shield = levelDefinition.shield;
			}
			
			assetRecord.toolBox = levelDefinition.powerUp;
			assetRecord.tools = levelDefinition.tool;
			assetRecord.hasHazard = typeof levelDefinition.ballHazard != 'undefined';
			assetRecord.hasShieldReplacer = levelDefinition.replaceShield;

			
			if (typeof levelDefinition.infoPage != 'undefined') {
				assetRecord.infoPage = levelDefinition.infoPage;
			}

			
			assetRecord.startingAnimation = levelDefinition.startingAnimation.name;
			assetRecord.hitAnimations = levelDefinition.hitAnimations;
			assetRecord.successAnimation = levelDefinition.successAnimation.name;
			assetRecord.failAnimation = levelDefinition.failAnimation.name;
			
			return assetRecord;
		},
		
		createCurrentAssetRecord: function(levelDefinition) {
			this.current_level_assets = this.createAssetRecord(levelDefinition);
			
		},
		
		createNextAssetRecord: function(levelDefinition) {
			this.next_level_assets = this.createAssetRecord(levelDefinition);
		}
};
