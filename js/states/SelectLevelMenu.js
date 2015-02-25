/**
* The Game's Select Level Menu state constructor.
* This state paginates the levels and allows the user to
* select one to play.
* @class Slapgame.SelectLevelMenu
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/
SlapGame.SelectLevelMenu = function (game) {
	this.game = game;
	this.fontSize = 40;
};

SlapGame.SelectLevelMenu.prototype = {

	create: function () {
		setMenuBackGround(this);
		
		this.title = this.add.sprite(this.game.world.centerX, 110, 'title');
		this.title.anchor.setTo(0.5,0.5);

		this.buttons = [];
		this.menuSound = this.add.audio('menuSound');
		
		PLAYER_DATA_MANAGER.init();
		this.resumeIndex = PLAYER_DATA_MANAGER.getResumeLevelIndex();
		this.levelButtons = [];
		this.selectedIndex = null;

		xStart = this.game.world.centerX-340;
		yStart = this.game.world.centerY-170;
		numCols = 5;
		numRows = 3;
		
		this.currentPage = 0;
		this.pages = Math.ceil((LEVEL_CONTROLLER._maxIndex+1)/(numRows*numCols));
  		// current page according to last played level, if any
		this.currentPage = Math.floor(this.resumeIndex/(numRows*numCols));
		if(this.currentPage>this.pages-1){
			this.currentPage = this.pages-1;
		}
		
		this.levelButtonGroup = this.add.group();
		for (i=0; i <= LEVEL_CONTROLLER._maxIndex; i++) {
			x=xStart+((i%numCols))*150;
			y=yStart+Math.floor(i/numCols)*140;
			font = (i <= this.resumeIndex) ? 'levelNumbersFont' : 'superGrayFont';
			
			var levelButton = this.add.button(x, y, 'levelSelection', this.handleLevelButton, this);
			levelButton.index = i;
			levelButton.frame = i <= this.resumeIndex ? 5 : 4;
			this.levelButtonGroup.add(levelButton);
			if (i <= this.resumeIndex) {
				var levelNumber = this.add.bitmapText(x+11, y+10,font,(i+1).toString(),this.fontSize);
				this.levelButtonGroup.add(levelNumber);
			}			
			//new page
			if ((i+1)%(numCols*numRows)==0) {
				xStart = xStart+this.game.world.width;
				yStart = yStart-140*numRows;
			}
			
			this.buttons.push(levelButton);
		}
		//scroll to the right page for resuming
		this.levelButtonGroup.x = this.currentPage * this.game.world.width * -1;
		
		
		this.leftButton = this.add.button(this.game.world.centerX-150, this.game.world.height-150, 'levelSelection', this.handleArrowButton, this, 1, 0, 1, 0);
		this.leftButton.name = "leftButton";
		this.buttons.push(this.leftButton);
		this.rightButton = this.add.button(this.game.world.centerX+50, this.game.world.height-150, 'levelSelection', this.handleArrowButton, this, 3, 2, 3, 2);
		this.rightButton.name = "rightButton";
		this.buttons.push(this.rightButton);
		
		// can we turn one page left?
		if(this.currentPage==0){
			this.leftButton.alpha = 0.3;
		}
		// can we turn one page right?
		if(this.currentPage==this.pages-1){
			this.rightButton.alpha = 0.3;
		}

		this.backButton = this.add.button(15, this.game.world.height-155, 'buttons', this.playMenu, this, 3, 2, 3, 2);
		this.buttons.push(this.backButton);
		
		//set button sounds
		for (i in this.buttons) {
			this.buttons[i].onDownSound = this.menuSound;
		}

		var self = this;
	    window.onblur = function () {self.forcePause();};
	    window.onfocus = function () {self.forceResume();};	

	},

	update: function () {

	},

	playMenu: function () {
		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('MainMenu');
	},
	
	handleArrowButton: function(button) {
		// touching right arrow and still not reached last page
		if(button.name == "rightButton" && this.currentPage<this.pages-1){
			this.leftButton.alpha = 1;
			this.currentPage++;
			// fade out the button if we reached last page
			if(this.currentPage == this.pages-1){
				button.alpha = 0.3;
			}
			// scrolling level pages
			var buttonsTween = this.game.add.tween(this.levelButtonGroup);
			buttonsTween.to({
				x: this.currentPage * this.game.world.width * -1
			}, 500, Phaser.Easing.Cubic.None);
			buttonsTween.start();
		}
		// touching left arrow and still not reached first page
		if(button.name == "leftButton" && this.currentPage>0){
			this.rightButton.alpha = 1;
			this.currentPage--;
			// fade out the button if we reached first page
			if(this.currentPage == 0){
				button.alpha = 0.3;
			}
			// scrolling level pages
			var buttonsTween = this.game.add.tween(this.levelButtonGroup);
			buttonsTween.to({
				x: this.currentPage * this.game.world.width * -1
			}, 400, Phaser.Easing.Cubic.None);
			buttonsTween.start();
		}		
	},
	
	handleLevelButton: function(button) {

		// the level is playable, then play the level!!
		if(button.index <= this.resumeIndex){
			if (menuMusic) {
				menuMusic.stop();
			}
			LEVEL_CONTROLLER.setIndex(button.index);
			//	And start the actual game
			PRELOAD_MANAGER.updateGoToLevel(LEVEL_CONTROLLER._currentIndex);
			this.state.start('LevelHandler');
		}
		// else, let's shake the locked levels
		else{
			left = button.x - 5;
			right = button.x + 5;
			origin = button.x;
			var buttonTween = this.game.add.tween(button)
			buttonTween.to({
				x: left
			}, 20, Phaser.Easing.Cubic.None);
			buttonTween.to({
				x: right
			}, 20, Phaser.Easing.Cubic.None);
			buttonTween.to({
				x: left
			}, 20, Phaser.Easing.Cubic.None);
			buttonTween.to({
				x: origin
			}, 20, Phaser.Easing.Cubic.None);
			buttonTween.start();
		}
	
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
