
SlapGame.GuideMenu = function (game) {
	this.game = game;
};

SlapGame.GuideMenu.prototype = {

	create: function () {
		//this.music = this.add.audio('titleMusic');
		//this.music.play();
		setMenuBackGround(this);
		
		this.title = this.add.sprite(this.game.world.centerX, 110, 'title');
		this.title.anchor.setTo(0.5,0.5);

		this.buttons = [];
		this.menuSound = this.add.audio('menuSound');
		this.backButton = this.add.button(15, this.game.world.height-155, 'buttons', this.mainMenu, this, 3, 2, 3, 2);
		this.buttons.push(this.backButton);
		for (index in this.buttons) {
			this.buttons[index].onDownSound = this.menuSound;
		}
		
		this.infoText = this.add.bitmapText(this.game.world.centerX-400, this.game.world.centerY-100, 'titleFont',STRINGS.GUIDE_INFO,60);
		
		var self = this;
	    window.onblur = function () {self.forcePause();};
	    window.onfocus = function () {self.forceResume();};
	},

	update: function () {
		
	},
	
	mainMenu: function () {
		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('MainMenu');
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
	}
};
