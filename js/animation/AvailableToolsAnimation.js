/**
* The Available Tools Animation class constructor.
* Shows what tools are available for a given level
* @class AvailableToolsAnimation
* @constructor
* @param {SlapGame.Level} gameContext - Reference to the current game level instance.
*/

AvailableToolsAnimation = function(gameContext) {
	this.gameContext = gameContext;
	this.tools = this.gameContext.tools;
	this.displaySprites = [];
	this.mode = 'wait';	

	this.clock = this.gameContext.time.create(false); 
	this.clock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
	this.isComplete = false;
};

AvailableToolsAnimation.prototype = {
	start: function () {
		this.displayTools();
		this.clock.start();
	},

	stop: function() {
		this.clock.stop();
		this.boxAnimManager.stopAnimations();
		for (i=0; i <  this.displaySprites.length; i++) {
			this.displaySprites[i].visible = false;
			this.displaySprites[i].destroy();
			delete this.displaySprites[i];
		}
		delete this.displaySprites;
		this.clock.removeAll();
		this.clock.destroy();
		delete this.clock;
	},
	
	displayTools: function() {
		itemOffset = 20;
		
		this.displaySprites.push(this.gameContext.add.sprite(0,this.gameContext.game.world.height-130,'boxAnim'));
		this.displaySprites.push(this.gameContext.add.bitmapText(0, this.gameContext.game.world.height-100
				, 'levelNumbersFont',"=",60));
		//a hack
		this.displaySprites[1].width = this.displaySprites[1].children[0].width;
		for (index in this.tools) {
			newSprite = this.gameContext.add.sprite(0,this.gameContext.game.world.height-130,this.tools[index].sprite.key);
			newSprite.scale.x = 0.5;
			newSprite.scale.y = 0.5;
			this.displaySprites.push(newSprite);
		}
		
		totalWidth = 30;
		for (i=0; i <  this.displaySprites.length; i++) {
			//skip the equals sign
			if (i != 1) {
				totalWidth += this.displaySprites[i].width + itemOffset;
			}
		}		
		
		originX = this.gameContext.game.world.centerX - (totalWidth/2);
		
		this.displaySprites[0].x = originX;
		
		
		for (i=1; i <  this.displaySprites.length; i++) {
			this.displaySprites[i].x = this.displaySprites[i-1].x + this.displaySprites[i-1].width + itemOffset;
		}
		
		this.boxAnimManager = new SpriteAnimationManager();
		this.boxAnimManager.playAnimation('boxBounce', this.displaySprites[0], 17, true);
	},

	beginFade: function () {
		this.clock.stop();
		this.mode = 'fade';
		this.clock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
		this.clock.start();
	},


	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.mode == 'wait') {
				if (this.gameContext.GAME_PHASE == this.gameContext.COUNTDOWN_PHASE) {
					this.beginFade();
				}			
			} else if (this.mode == 'fade') {
				if (this.displaySprites[0].alpha > 0.1) {
					for (i=0; i <  this.displaySprites.length; i++) {
						this.displaySprites[i].alpha -= 0.05;
					}
				} else {
					this.stop();
				}
			}
		}
	}
};