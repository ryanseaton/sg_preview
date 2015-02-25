/**
* The Game's Main Menu state constructor.
* @class Slapgame.MainMenu
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.MainMenu = function (game) {
	this.game = game;
};

SlapGame.MainMenu.prototype = {

	create: function () {
		//PreloadManager
		PRELOAD_MANAGER.updateMenuStarted();
		
		PLAYER_DATA_MANAGER.init();
		SETTINGS_MANAGER.init();
		
		if (!SETTINGS_MANAGER.isMusicMuted() && (!menuMusic || !menuMusic.isPlaying)) {
			menuMusic = this.add.audio('menuMusic');
			menuMusic.play('',0,0.3,true);
		}
		
		var self = this;
	    window.onblur = function () {self.forcePause();};
	    window.onfocus = function () {self.forceResume();};	  
		setMenuBackGround(this);
		this.title = this.add.sprite(this.game.world.centerX, 110, 'title');
		this.title.anchor.setTo(0.5,0.5);
		
		this.titleTween = this.add.tween(this.title);
		this.titleTween.to({width:this.title.width+30, height:this.title.height+20}, 600, Phaser.Easing.Sinusoidal.In, false, 0, false,  false);
		this.titleTween2 = this.add.tween(this.title);
		this.titleTween2.to({width:this.title.width-30, height:this.title.height}, 600, Phaser.Easing.Sinusoidal.In, false, 0, false,  false);
		this.titleTween2.onComplete.add(function() {
			this.titleTween.start();
		}, this);
		this.titleTween.onComplete.add(function() {
			this.titleTween2.start();
		}, this);
		this.titleTween.start();

		
		this.buttons = [];
		this.menuSound = this.add.audio('menuSound');
		this.playButton = this.add.button(this.game.world.centerX, this.game.world.centerY-70, 'buttons', this.playMenu, this, 17, 18, 17, 18);
		this.playButton.anchor.setTo(0.5,0.5);
		this.buttons.push(this.playButton);
		this.guideButton = this.add.button(this.game.world.centerX+100, this.game.world.centerY-16, 'buttons', this.guideMenu, this, 8, 7, 8, 7);
		this.buttons.push(this.guideButton);
		this.soundButton = this.add.button(this.game.world.centerX-254, this.game.world.centerY-16, 'buttons', this.toggleMusic, this, 13, 12, 13, 12);
		this.buttons.push(this.soundButton);
		this.soundOffButton = this.add.button(this.game.world.centerX-254, this.game.world.centerY-16, 'buttons', this.toggleMusic, this, 13, 14, 13, 14);
		this.buttons.push(this.soundOffButton);
//		this.scoreButton = this.add.button(this.game.world.centerX-76, this.game.world.centerY+100, 'buttons', this.showScore, this, 19, 18, 19, 18);
//		this.buttons.push(this.scoreButton);
		if (SETTINGS_MANAGER.isMusicMuted()) {			
			this.soundOffButton.visible = true;
			this.soundButton.visible = false;			
		} else {
			this.soundOffButton.visible = false;
			this.soundButton.visible = true;
		}
		if (Cocoon.nativeAvailable && Cocoon.Device.getDeviceInfo().os != "ios") {
			this.quitButton = this.add.button(15, this.game.world.height-155
					, 'buttons', this.quitGame, this, 24, 23, 24, 23);
			this.quitButton.onDownSound = this.menuSound;
		}
		
		for (index in this.buttons) {
			this.buttons[index].onDownSound = this.menuSound;
			//this.buttons[index].y += index*100;
		}
		
//		this.buttonTween = this.add.tween(this.playButton);
//		this.buttonTween.to({width:this.playButton.width+30, height:this.playButton.height+20}, 600, Phaser.Easing.Sinusoidal.In, false, 0, false,  false);
//		this.buttonTween2 = this.add.tween(this.playButton);
//		this.buttonTween2.to({width:this.playButton.width, height:this.playButton.height}, 600, Phaser.Easing.Sinusoidal.In, false, 0, false,  false);
//		this.buttonTween2.onComplete.add(function() {
//			this.buttonTween.start();
//		}, this);
//		this.buttonTween.onComplete.add(function() {
//			this.buttonTween2.start();
//		}, this);
//		this.buttonTween.start();
		
		//Pre-load Ads
		AD_MANAGER.init();

	},

	update: function () {

	},

	playMenu: function () {
		resumeIndex = PLAYER_DATA_MANAGER.getResumeLevelIndex();
		if (resumeIndex > 0) {
			this.state.start('SelectLevelMenu');
		} else {
			LEVEL_CONTROLLER.setIndex(0);
			
			if (menuMusic) {
				menuMusic.stop();
			}
			
			//	And start the actual game
			PRELOAD_MANAGER.updateGoToLevel(LEVEL_CONTROLLER._currentIndex);
			this.state.start('LevelHandler');
		}
	},

	guideMenu: function () {

		this.state.start('GuideMenu');
	},
	
	toggleMusic: function() {
		if (SETTINGS_MANAGER.isMusicMuted()) {
			this.soundOffButton.visible = false;
			this.soundButton.visible = true;
			if (!menuMusic) {
				menuMusic = this.add.audio('menuMusic');
			}
			if (!menuMusic.isPlaying) {
				menuMusic.play('',0,0.3,true);
			}
		} else {
			this.soundOffButton.visible = true;
			this.soundButton.visible = false;
			menuMusic.stop();
		}
		SETTINGS_MANAGER.toggleMusic();		
	},
	
	showScore: function() {
		//show the socre for the appropriate platform
	},
	
	forcePause: function () {
		this.game.paused = true;
		if(menuMusic) {
			menuMusic.pause();
		}

	},
	
	forceResume: function () {
		this.game.paused = false;
		if(menuMusic) {
			menuMusic.resume();
		}
	},
	
	quitGame: function() {
		Cocoon.App.exit();
	}

};
