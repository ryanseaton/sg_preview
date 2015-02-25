/**
* The Game's Dynamic Preloader state constructor.
* This state is used between Level state transitions,
* between menu to Level transitions and on the initial preloading.
* Before changing game states the PRELOAD_MANAGER's record must
* be updated with the required destination state or level number.
* See PreloadManager.js
* Levels are loaded and unloaded by comparing their asset records
* in the LEVEL_ASSET_MANAGER. See LevelAssetManager.js.
* See data/commonAssets.js for section asset definitions.
* @class Slapgame.DynamicPreloader
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.DynamicPreloader = function (game) {
	this.ready = false;
};

SlapGame.DynamicPreloader.prototype = {
		
		init: function() {
		},

	preload: function () {
		//background
		setMenuBackGround(this);
		if (!PRELOAD_MANAGER.isComplete()) {
			//do the load and unload
			
			//Initial preload after boot
			if (PRELOAD_MANAGER.isFirstPreload()) {
				this.targetState = "MainMenu";
				this.preloadCommon();
				this.preloadMenu();
				
			//From Menu to level or Credits
			} else if (PRELOAD_MANAGER.isFromMenu()
					&& (PRELOAD_MANAGER.isToLevel()
					|| PRELOAD_MANAGER.isToCredits())) {				
				this.targetState = "LevelHandler";
				this.unloadMenu();
				if (PRELOAD_MANAGER.isToCredits()) {
					this.preloadCredits();
				} else {
					this.preloadLevel();
				}
			//From level to another level or credits
			} else if (PRELOAD_MANAGER.isFromLevel()
					&& (PRELOAD_MANAGER.isToLevel()
					|| PRELOAD_MANAGER.isToCredits())) {				
				if (PRELOAD_MANAGER.isToCredits()) {
					this.targetState = "Credits";
					this.preloadLevelToCredits();
				} else {
					this.targetState = "LevelHandler";
					this.unloadPreloadLevelToLevel();
				}				
			//From level or credits to menu
			} else if (PRELOAD_MANAGER.isToMenu()
					&& (PRELOAD_MANAGER.isFromLevel()
					|| PRELOAD_MANAGER.isFromCredits)) {				
				if (PRELOAD_MANAGER.isFromCredits()) {
					this.unloadCredits();
				} else {
					this.unloadLevel();
				}
				this.targetState = "MainMenu";
				this.preloadMenu();
			}
			PRELOAD_MANAGER.updatePreloadComplete();
		} else {
		}
		
		//preload bar		
	    this.preloadOutline = this.add.sprite(this.game.world.centerX-140, this.game.world.centerY-52, 'logoGray');
	    this.preloadBar = this.add.sprite(this.game.world.centerX-140, this.game.world.centerY-52, 'logo');

	    this.load.setPreloadSprite(this.preloadBar,0);

	},

	create: function () {
		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	/*
	 * Preloading is complete so we just go to the target state
	 */
	update: function () {
		this.state.start(this.targetState);

	},
	
	unloadImageList: function(imageList) {
		for (index in imageList) {
			image = imageList[index];
			//console.log("dumping image: "+image.name);
			if (Cocoon.nativeAvailable) {
				img = this.cache.getImage(image.name);
				img.dispose();
			}
			this.cache.removeImage(image.name);
		}
	},
	
	unloadAnimationList: function(animationList) {
		for (index in animationList) {
			imageName = animationList[index];
			spritesheetName = GUY_ANIMATION_MANAGER.getSpriteSheetNameForAnimation(imageName);
			//console.log("dumping animation: "+imageName+" from spritesheet: "+spritesheetName);
			if (Cocoon.nativeAvailable) {
				img = this.cache.getImage(spritesheetName);
				try {
					img.dispose();
				} catch (err) {
					//console.log("spritesheet can't be disposed");
				}
			}
			this.cache.removeImage(spritesheetName);
		}
	},
	
	unloadAudioList: function(audioList) {
		for (index in audioList) {
			audio = audioList[index];
			//console.log("dumping audio: "+audio.name);
//			if (Cocoon.nativeAvailable) {
//				sound = this.cache.getSound(audio.name);
//				sound.dispose();
//			}
			this.cache.removeSound(audio.name);
		}
	},
	
	preloadAnimationList: function (aList) {
		//console.log(aList);
		var definition = null;
		var anim = null;
		for (i in ANIMATION_DEFINITIONS) {
			definition = ANIMATION_DEFINITIONS[i];
			animations = definition.animation;
			for (j in animations) {
				anim = animations[j];
				k = aList.indexOf(anim.name);
				if (k > -1) {
					//console.log("loading list spritesheet: "+definition.spritesheet);
					this.load.spritesheet(definition.spritesheet, definition.file.name, definition.file.width, definition.file.height);
				}
			}
		}
	},
	
	preloadImageList: function(imageList) {
		for (index in imageList) {
			image = imageList[index];
			//console.log("loading list image "+image.name);
			this.load.image(image.name, image.file);
		}
	},
	
	preloadAudioList: function(audioList) {
		for (index in audioList) {
			audio = audioList[index];
			//console.log("loading list audio "+audio.name+", "+audio.file);
			this.load.audio(audio.name, [audio.file]);
		}
	},
	
	preloadShield: function (sName) {
		for(index in SHIELDS) {
			shield = SHIELDS[index];
			if (shield.name == sName) {
				this.load.image(shield.name,'images/shields/'+shield.file);
				this.load.audio(shield.sound.name, ['audio/shield/'+shield.sound.file]);
				return;
			}
		}
	},
	
	setBackgroundAssets: function(images, bgName) {
		var bgList = BACKGROUNDS;
		for (index in bgList) {
			bg = bgList[index];
			if (bgName == bg.name) {
				images.push({name: bgName, file: 'images/backgrounds/'+bg.file});
				return;
			}
		}
	},
	
	setShieldAssets: function (images, audio, shieldName) {
		for(index in SHIELDS) {
			shield = SHIELDS[index];
			if (shield.name == shieldName) {
				images.push({name: shield.name, file: 'images/shields/'+shield.file});
				audio.push({name: shield.sound.name, file: 'audio/shield/'+shield.sound.file});
				return;
			}
		}
	},
	
	setInfoPageAssets: function (images, animations, music, ipName) {
		if( Object.prototype.toString.call(ipName) === '[object Array]' ) {
			for (index in ipName) {
				this.setIndividualInfoPageAssets(images, animations, music, ipName[index]);
			}
		} else {
			this.setIndividualInfoPageAssets(images, animations, music, ipName);
		}
	},
	
	setIndividualInfoPageAssets: function (images, animations, music, ipName) {
		ip = this.getInfoPageDefinition(ipName);
		if (typeof ip.animation != 'undefined') {
			animations.push(ip.animation);
		} else if (typeof ip.image != 'undefined') {
			images.push({name: ip.name, file: 'images/'+ip.image});
		}
		audio = ip.type == "tool" ? {name: "infoToolSound", file : "audio/info_page/infoSound.ogg"}
		: {name: "infoSound", file : "audio/info_page/infoToolSound.ogg"};
		music.push(audio);
	},

	
	setToolAssets: function (animations, sounds, tool) {
		//sprite animation
		spriteAnimation = typeof tool.sprite.animation != 'undefined' ? tool.sprite.animation.name :  tool.sprite.name;
		animations.push(spriteAnimation);
		//tool impact sound
		sounds.push({"name": tool.sound.name, "file": 'audio/tool/impact/'+tool.sound.file});
		
		if (typeof tool.splash != 'undefined') {
			//splash animation
			splashAnimation = typeof tool.splash.animation != 'undefined' ? tool.splash.animation.name :  tool.splash.name;
			animations.push(splashAnimation);
			//splash sound
			if (typeof tool.splash.sound != 'undefined') {
				sounds.push({"name": tool.splash.sound.name, "file": 'audio/tool/splash/'+tool.splash.sound.file});
			}
		}
		if (typeof tool.bruise != 'undefined') {
			animations.push(BRUISE_MANAGER.getAnimationName(tool.bruise.name));
		}
	},
	
	setToolListAssets: function(animations, sounds, levelTools) {
		var toolList = TOOLS;
		for (i in levelTools) {
			toolName = levelTools[i];
			for (index in toolList) {
				tool = toolList[index];
				if (tool.name == toolName) {
					this.setToolAssets(animations, sounds, tool);
				}
			}
		}
	},
	
	setToolReconciliationLists: function(l1, l2, unloadTools, preloadTools) {
		for (i in l1) {
			oldTool = l1[i];
			if (l2.indexOf(oldTool) < 0) {
//				//console.log("pushing unload "+oldTool);
				unloadTools.push(oldTool);
			}
		}
		for (j in l2) {
			newTool = l2[j];
			if (l1.indexOf(newTool) < 0) {
//				//console.log("pushing preload "+newTool);
				preloadTools.push(newTool);
			}
		}
	},
	
	preloadImagesBySection: function (sectionName) {
		section = sectionName.images;
		for(index in section) {
			image = section[index];
			//console.log("loading image "+image.name);
			this.load.image(image.name, image.file);
		}
	},
	
	preloadAnimationsBySection: function (sectionName) {
		var animList = [];
		animList = sectionName.animations;
		this.preloadAnimationList(animList);
	},
	
	preloadAudioBySection: function (sectionName) {
		section = sectionName.audio;
		for(index in section) {
			audio = section[index];
			//console.log("loading audio "+audio.name+", "+audio.file);
			this.load.audio(audio.name, [audio.file]);
		}
	},
	
	preloadSpritesheetsBySection: function (sectionName) {
		section = sectionName.spritesheets;
		for(index in section) {
			spritesheet = section[index];
			//console.log("loading spritesheet "+spritesheet.name);
			this.load.spritesheet(spritesheet.name, spritesheet.file, spritesheet.width, spritesheet.height);
		}
	},
	
	preloadPhysicsBySection: function (sectionName) {
		section = sectionName.physics;
		for(index in section) {
			physics = section[index];
			//console.log("loading physics "+physics.name);
			this.load.physics(physics.name, physics.data);
		}
	},
	
	preloadBackgroundBySection: function (sectionName) {
		if (typeof sectionName.background != 'undefined') {
			var bgName = sectionName.background;
			var bgList = BACKGROUNDS;
			for (index in bgList) {
				bg = bgList[index];
				if (bgName == bg.name) {
					images.push({name: bgName, file: 'images/backgrounds/'+bg.file});
					return;
				}
			}
		}
	},
	
	preloadAtlasesBySection: function (sectionName) {
		
		section = sectionName.atlases;
		for(index in section) {
			atlas = section[index];
//			console.log("loading atlas "+atlas.name);
			this.load.atlas(atlas.name, atlas.image, atlas.data)
		}
	},
	
	preloadFonts: function () {
		section = COMMON_ASSETS.fonts;
		for(index in section) {
			font = section[index];
			this.load.bitmapFont(font.name, font.image, font.xml);
		}
	},
	
	setImagesBySection: function (images, sectionName) {
		section = sectionName.images;
		for(index in section) {
			image = section[index];
			//console.log("setting image "+image.name);
			images.push({"name": image.name, "file": image.file});
		}
	},
	
	setAnimationsBySection: function (animations, sectionName) {
		var animList = [];
		animList = sectionName.animations;
		//console.log("pushing anim list");
		//console.log(animList);
		for (index in animList) {
			animations.push(animList[index]);
		}
		
	},
	
	setAudioBySection: function (audioList, sectionName) {
		section = sectionName.audio;
		for(index in section) {
			audio = section[index];
			//console.log("setting audio "+audio.name+", "+audio.file);
			audioList.push({"name": audio.name, "file": audio.file});
		}
	},
	
	unloadImagesBySection: function (sectionName) {
		section = sectionName.images;
		for(index in section) {
			image = section[index];
			//console.log("unloading image: "+image.name);
			if (Cocoon.nativeAvailable) {
				img = this.cache.getImage(image.name);
				img.dispose();
			}
			this.cache.removeImage(image.name);
		}
	},
	
	unloadAnimationsBySection: function (sectionName) {
		var animList = [];
		animList = sectionName.animations;
		this.unloadAnimationList(animList);
	},
	
	unloadAudioBySection: function (sectionName) {
		section = sectionName.audio;
		for(index in section) {
			audio = section[index];
			//console.log("unloading audio: "+audio.name);
//			if (Cocoon.nativeAvailable) {
//				sound = this.cache.getSound(audio.name);
//				sound.dispose();
//			}
			this.cache.removeSound(audio.name);
		}
	},
	
	unloadSpritesheetsBySection: function (sectionName) {
		section = sectionName.spritesheets;
		for(index in section) {
			spritesheet = section[index];
			//console.log("unloading spritesheet: "+spritesheet.name);
			if (Cocoon.nativeAvailable) {
				img = this.cache.getImage(spritesheet.name);
				img.dispose();
			}
			this.cache.removeImage(spritesheet.name);
		}
	},
	
	unloadPhysicsBySection: function (sectionName) {
		section = sectionName.physics;
		for(index in section) {
			physics = section[index];
			//console.log("unloading physics: "+physics.name);
//			if (Cocoon.nativeAvailable) {
//				img = this.cache.getImage(physics.name);
//				img.dispose();
//			}
			this.cache.removePhysics(physics.name);
		}
	},
	
	unloadBackgroundBySection: function (sectionName) {
		if (typeof sectionName.background != 'undefined') {
			var bgName = sectionName.background;
			var bgList = BACKGROUNDS;
			for (index in bgList) {
				bg = bgList[index];
				if (bgName == bg.name) {
					//console.log("unloading image: "+bg.name);
					if (Cocoon.nativeAvailable) {
						img = this.cache.getImage(bg.name);
						img.dispose();
					}
					this.cache.removeImage(bg.name);
					return;
				}
			}
		}
	},
	
	unloadAtlasesBySection: function (sectionName) {
		section = sectionName.atlases;
		for(index in section) {
			atlas = section[index];
			//console.log("loading atlas "+atlas.name);
			//console.log("unloading spritesheet: "+spritesheet.name);
			if (Cocoon.nativeAvailable) {
				img = this.cache.getImage(atlas.name);
				img.dispose();
			}
			this.cache.removeImage(atlas.name);
		}
	},
	
	unloadFonts: function () {
		section = COMMON_ASSETS.fonts;
		for(index in section) {
			font = section[index];
			this.load.bitmapFont(font.name, font.image, font.xml);
		}
	},
	
	preloadCommon: function () {
		this.preloadAtlasesBySection(COMMON_ASSETS.common);
		this.preloadImagesBySection(COMMON_ASSETS.common);
		this.preloadAudioBySection(COMMON_ASSETS.common);
		this.preloadSpritesheetsBySection(COMMON_ASSETS.common);
		this.preloadFonts();
	},
		
	preloadLevelCommonAssets: function() {
		this.preloadAtlasesBySection(COMMON_ASSETS.level);
		this.preloadImagesBySection(COMMON_ASSETS.level);
		this.preloadAudioBySection(COMMON_ASSETS.level);
		this.preloadSpritesheetsBySection(COMMON_ASSETS.level);
		this.preloadAnimationsBySection(COMMON_ASSETS.level);
		this.preloadPhysicsBySection(COMMON_ASSETS.level);
	},
	
	setShieldCommonAssets: function(images, animation, audio) {
		this.setImagesBySection(images, COMMON_ASSETS.shield);
		this.setAudioBySection(audio,COMMON_ASSETS.shield);
		this.setAnimationsBySection(animation, COMMON_ASSETS.shield);
	},
	
	setFlyingShieldCommonAssets: function(images, animation, audio) {
		this.setImagesBySection(images, COMMON_ASSETS.flyingShield);
		this.setAudioBySection(audio,COMMON_ASSETS.flyingShield);
		this.setAnimationsBySection(animation, COMMON_ASSETS.flyingShield);
	},
	
	setHazardCommonAssets: function(images, animation, audio) {
		this.setImagesBySection(images, COMMON_ASSETS.hazard);
		this.setAudioBySection(audio, COMMON_ASSETS.hazard);
		this.setAnimationsBySection(animation, COMMON_ASSETS.hazard);
	},
	
	setToolBoxCommonAssets: function(images, animation, audio) {
		this.setImagesBySection(images, COMMON_ASSETS.toolBox);
		this.setAudioBySection(audio, COMMON_ASSETS.toolBox);
		this.setAnimationsBySection(animation, COMMON_ASSETS.toolBox);
	},
	
	unloadLevelCommonAssets: function() {
		this.unloadAtlasesBySection(COMMON_ASSETS.level);
		this.unloadImagesBySection(COMMON_ASSETS.level);
		this.unloadAudioBySection(COMMON_ASSETS.level);
		this.unloadSpritesheetsBySection(COMMON_ASSETS.level);
		this.unloadAnimationsBySection(COMMON_ASSETS.level);
		this.unloadPhysicsBySection(COMMON_ASSETS.level);
	},
	
	/*
	 * Preload the next level (from Menu state)
	 */
	preloadLevel: function() {
		this.preloadLevelCommonAssets();
		this.preloadLevelCustomAssets(LEVEL_CONTROLLER.getLevel(PRELOAD_MANAGER.getTo()));
	},
	
	preloadLevelCustomAssets: function(levelDefinition) {
		LEVEL_ASSET_MANAGER.createNextAssetRecord(levelDefinition);
		this.preloadNextAssetRecord();
	},
	
	/*
	 * Preload the credits.
	 */
	preloadCredits: function() {
		this.preloadLevelCommonAssets();
		this.preloadLevelCustomAssets(LEVEL_CONTROLLER.getCreditsLevel());
		this.preloadAudioBySection(COMMON_ASSETS.credits);
	},
	
	/*
	 * Create asset records for the current level and credits. Then perform
	 * the asset unloading and loading.
	 */
	preloadLevelToCredits: function() {
		LEVEL_ASSET_MANAGER.createCurrentAssetRecord(LEVEL_CONTROLLER.getLevel(PRELOAD_MANAGER.getFrom()));
		LEVEL_ASSET_MANAGER.createNextAssetRecord(LEVEL_CONTROLLER.getCreditsLevel());
		this.doUnloadPreloadLevelToLevel();
		this.preloadAudioBySection(COMMON_ASSETS.credits);
	},
	
	/*
	 * Create asset records for the current and next level. Then perform
	 * the asset unloading and loading.
	 */
	unloadPreloadLevelToLevel: function() {
		LEVEL_ASSET_MANAGER.createCurrentAssetRecord(LEVEL_CONTROLLER.getLevel(PRELOAD_MANAGER.getFrom()));
		LEVEL_ASSET_MANAGER.createNextAssetRecord(LEVEL_CONTROLLER.getLevel(PRELOAD_MANAGER.getTo()));
		this.doUnloadPreloadLevelToLevel();
	},
	
	/*
	 * Unload one level and preload the next level but keep common assets.
	 */
	doUnloadPreloadLevelToLevel: function() {		
		var currentImages = [], currentAnimations = [], currentAudio = []
		, nextImages = [], nextAnimations = [], nextAudio = [];
		
		//get the asset list sets for the current and next levels
		this.setCurrentLevelCustomAssets(currentImages, currentAnimations, currentAudio);
		this.setNextLevelCustomAssets(nextImages, nextAnimations, nextAudio);
		
		var unloadImages = [], unloadAnimations = [], unloadAudio = []
		, preloadImages = [], preloadAnimations = [], preloadAudio = [];
		
		//set unload and preload asset lists by reconciling the current and next
		//asset lists. Assets common to both the current and next lists are purged.
		this.setUnloadPreloadAssets(unloadImages, preloadImages, currentImages, nextImages);
		this.setUnloadPreloadAssets(unloadAudio, preloadAudio, currentAudio, nextAudio);
		this.setUnloadPreloadAssets(unloadAnimations, preloadAnimations, currentAnimations, nextAnimations);
		
		//unload assets from the reconcilied unload list
		this.unloadImageList(unloadImages);
		this.unloadAnimationList(unloadAnimations);
		this.unloadAudioList(unloadAudio);
		
		//load assets from thre reconciled load list
		this.preloadImageList(preloadImages);
		this.preloadAnimationList(preloadAnimations);
		this.preloadAudioList(preloadAudio);
	},
	
	/*
	 * Create the reconciled unload and preload asset lists by removing
	 * assets common to the current and next lists
	 * @param unloadList
	 * @param preloadList
	 * @param currentList
	 * @param nextList
	 */
	setUnloadPreloadAssets: function(unloadList, preloadList, currentList, nextList) {
		for (i in currentList) {
			oldTool = currentList[i];
			if (nextList.indexOf(oldTool) < 0) {
				unloadList.push(oldTool);
			}
		}
		for (j in nextList) {
			newTool = nextList[j];
			if (currentList.indexOf(newTool) < 0) {
				preloadList.push(newTool);
			}
		}
	},
	
	preloadMenuToLevel: function() {
		this.unloadMenu();
		this.preloadLevel();
	},
	
	/*
	 * Preload the menu.
	 */
	preloadMenu: function() {
		this.preloadAtlasesBySection(COMMON_ASSETS.menu);
		this.preloadImagesBySection(COMMON_ASSETS.menu);
		this.preloadAudioBySection(COMMON_ASSETS.menu);
		this.preloadSpritesheetsBySection(COMMON_ASSETS.menu);
	},
	
	/*
	 * Unload the menu.
	 */
	unloadMenu: function() {
		this.unloadAtlasesBySection(COMMON_ASSETS.menu);
		this.unloadImagesBySection(COMMON_ASSETS.menu);
		this.unloadAudioBySection(COMMON_ASSETS.menu);
		this.unloadSpritesheetsBySection(COMMON_ASSETS.menu);
	},
	
	/*
	 * Set the image, animation and audio asset lists for the
	 * current level based on the LEVEL_ASSET_MANAGER's current level.
	 */
	setCurrentLevelCustomAssets: function(images, animations, audio) {
		ar = LEVEL_ASSET_MANAGER.current_level_assets;
		this.setLevelCustomAssets(ar, images, animations, audio);
	},
	
	/*
	 * Set the image, animation and audio asset lists for the
	 * next level based on the LEVEL_ASSET_MANAGER's next level.
	 */
	setNextLevelCustomAssets: function(images, animations, audio) {
		ar = LEVEL_ASSET_MANAGER.next_level_assets;
		this.setLevelCustomAssets(ar, images, animations, audio);
	},
	
	/*
	 * Populate the image, animation and audio asset lists based
	 * on the asset record definition
	 */
	setLevelCustomAssets: function(ar, images, animations, audio) {
		
		this.setBackgroundAssets(images, ar.background);
		animations.push(ar.failAnimation);
		animations.push(ar.hitAnimations[0]);
		animations.push(ar.startingAnimation);
		animations.push(ar.successAnimation);
		if (ar.hasHazard) {
			this.setHazardCommonAssets(images, animations, audio);
		}
		if (ar.hasShieldReplacer) {
			this.setFlyingShieldCommonAssets(images, animations, audio);
		}
		if (ar.shield) {
			this.setShieldAssets(images, audio, ar.shield);
			this.setShieldCommonAssets(images, animations, audio);
		}
		if (ar.infoPage) {
			this.setInfoPageAssets(images, animations, audio, ar.infoPage);
			this.setBackgroundAssets(images, COMMON_ASSETS.infoPage.background);
		}
		
		if (ar.toolBox) {
			this.setToolBoxCommonAssets(images, animations, audio);
		}
		
		this.setToolListAssets(animations, audio, ar.tools);

	},
	
	/*
	 * Load the next Level based on the LEVEL_ASSET_MANAGER
	 */
	preloadNextAssetRecord: function() {
		ar = LEVEL_ASSET_MANAGER.next_level_assets;
		//console.log(ar);
		
		preloadImages = [];
		preloadAnimations = [];
		preloadAudio = [];		

		this.setBackgroundAssets(preloadImages, ar.background);
		preloadAnimations.push(ar.failAnimation);
		preloadAnimations.push(ar.hitAnimations[0]);
		preloadAnimations.push(ar.startingAnimation);
		preloadAnimations.push(ar.successAnimation);
		if (ar.hasHazard) {
			this.setHazardCommonAssets(preloadImages, preloadAnimations, preloadAudio);
		}
		if (ar.hasShieldReplacer) {
			this.setFlyingShieldCommonAssets(preloadImages, preloadAnimations, preloadAudio);			
		}
		if (ar.shield) {
			this.setShieldAssets(preloadImages, preloadAudio, ar.shield);
			this.setShieldCommonAssets(preloadImages, preloadAnimations, preloadAudio);
		}
		if (ar.infoPage) {
			this.setInfoPageAssets(preloadImages, preloadAnimations, preloadAudio, ar.infoPage);
			this.setBackgroundAssets(preloadImages, COMMON_ASSETS.infoPage.background);
		}
		
		if (ar.toolBox) {
			this.setToolBoxCommonAssets(preloadImages, preloadAnimations, preloadAudio);
		}
		
		this.setToolListAssets(preloadAnimations, preloadAudio, ar.tools);

		this.preloadImageList(preloadImages);
		this.preloadAnimationList(preloadAnimations);
		this.preloadAudioList(preloadAudio);
	},
	
	/*
	 * Unload the current Level based on the LEVEL_ASSET_MANAGER
	 */
	unloadCurrentAssetRecord: function() {
		ar = LEVEL_ASSET_MANAGER.current_level_assets;
		
		unloadImages = [];
		unloadAnimations = [];
		unloadAudio = [];		

		this.setBackgroundAssets(unloadImages, ar.background);
		unloadAnimations.push(ar.failAnimation);
		unloadAnimations.push(ar.hitAnimations[0]);
		unloadAnimations.push(ar.startingAnimation);
		unloadAnimations.push(ar.successAnimation);
		if (ar.hasHazard) {
			this.setHazardCommonAssets(unloadImages, unloadAnimations, unloadAudio);
		}
		if (ar.hasShieldReplacer) {
			this.setFlyingShieldCommonAssets(unloadImages, unloadAnimations, unloadAudio);
		}
		if (ar.shield) {
			this.setShieldAssets(unloadImages, unloadAudio, ar.shield);
			this.setShieldCommonAssets(unloadImages, unloadAnimations, unloadAudio);
		}
		if (ar.infoPage) {
			this.setInfoPageAssets(unloadImages, unloadAnimations, unloadAudio, ar.infoPage);
			this.setBackgroundAssets(unloadImages, COMMON_ASSETS.infoPage.background);
		}
		
		if (ar.toolBox) {
			this.setToolBoxCommonAssets(unloadImages, unloadAnimations, unloadAudio);
		}
		
		this.setToolListAssets(unloadAnimations, unloadAudio, ar.tools);

		this.unloadImageList(unloadImages);
		this.unloadAnimationList(unloadAnimations);
		this.unloadAudioList(unloadAudio);
	},
	
	/*
	 * Unload the current level.
	 */
	unloadLevel: function() {
		this.unloadLevelCommonAssets();
		this.unloadLevelCustomAssets(LEVEL_CONTROLLER.getLevel(PRELOAD_MANAGER.getFrom()));
	},
	
	
	unloadLevelCustomAssets: function(levelDefinition) {
		LEVEL_ASSET_MANAGER.createCurrentAssetRecord(levelDefinition);
		this.unloadCurrentAssetRecord();
	},
	
	/*
	 * Unload the credits.
	 */
	unloadCredits: function() {
		this.unloadLevelCommonAssets();
		this.unloadLevelCustomAssets(LEVEL_CONTROLLER.getCreditsLevel());
		this.unloadAudioBySection(COMMON_ASSETS.credits);
	},
	
	/*
	 * Get the JSON Info Page definition based on the name
	 * Page names are unique.
	 * @param {String} ipName - The name of the Info Page
	 * @return {Object} the Info Page definition
	 */
	getInfoPageDefinition: function(ipName) {
		var infoPages = INFO_PAGES;
		var pageDefinition = null;
		for (index in infoPages) {
			ip = infoPages[index];
			if (ip.name == ipName) {
				pageDefinition = ip;
			}			
		}
		return pageDefinition;
	}
};
