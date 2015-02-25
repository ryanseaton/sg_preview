MockingAnimation = function(gameContext) {
	this.gameContext = gameContext;
	

	this.mode = 'init';
	
	this.insultString = "";
	this.displayString = "";
	this.stringCounter = 0;
	this.setInsult();
	this.laughSound = this.gameContext.add.audio('fastLaugh');
	this.takeThatSound = this.gameContext.add.audio('takeThatSound');
	this.mockText = this.gameContext.add.bitmapText(this.gameContext.game.world.centerX-370, this.gameContext.game.world.centerY-200
			, 'titleLimeFont',"",70);
	this.mockText.multiLine = true;
	this.mockText.align = 'left';
	this.clock = this.gameContext.time.create(false);
	this.clock.name = "mockingAnimation";
	this.clock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
	this.isComplete = false;
};

MockingAnimation.prototype = {
	start: function () {
		this.clock.start();
		this.laughSound.volume = .7;
		this.laughSound.play();
		GUY_ANIMATION_MANAGER.playAnimation("laugh", this.gameContext.blake, 16, true);
	},
	
	stopSounds: function() {
		this.laughSound.stop();
	},

	deliverInsult: function () {
		this.clock.stop();
		this.mode = 'insult';

		this.clock.loop(Phaser.Timer.SECOND/13, this.updateTimer, this);
		this.clock.start();
	},
	
	doWait: function() {
		this.clock.stop();
		this.mode = 'wait';

		this.clock.loop(Phaser.Timer.SECOND*1.5, this.updateTimer, this);
		this.clock.start();
	},
	
	doPostInsult: function() {
		this.clock.stop();
		this.takeThatSound.volume = .7;
		this.takeThatSound.play();
		this.mode = 'postInsult';

		this.clock.loop(Phaser.Timer.SECOND/10, this.updateTimer, this);
		this.clock.start();
	},


	updateTimer: function () {
		if (!this.gameContext.paused) {
			if (this.mode == 'init') {
				if (this.gameContext.blake.alpha > 0.2) {
					this.gameContext.blake.alpha -= 0.18;
					if (SHIELD_MANAGER.hasShield()) {
						SHIELD_MANAGER.shield.alpha -= 0.18;
					}
					for (i=0;i<this.gameContext.tools.length;i++) {
						currentTool = this.gameContext.tools[i];
						if (currentTool.isToolSelected) {	
							currentTool.sprite.alpha -= 0.18;
						}
					}
				} else {
					this.deliverInsult();
				}				
			} else if (this.mode == 'insult') {
				this.displayString = this.insultString.substr(0,this.stringCounter+1);
				this.mockText.setText(this.displayString);
//				this.mockText.align = 'center';
				this.stringCounter++;
				
				if (this.stringCounter == this.insultString.length) {
					this.doWait();
				}
			} else if (this.mode == 'wait') {
				this.doPostInsult();
			} else if (this.mode == 'postInsult') {
				if (this.gameContext.blake.alpha < 1.0) {
					this.gameContext.blake.alpha += 0.18;
					if (SHIELD_MANAGER.hasShield()) {
						SHIELD_MANAGER.shield.alpha += 0.18;
					}
					for (i=0;i<this.gameContext.tools.length;i++) {
						currentTool = this.gameContext.tools[i];
						if (currentTool.isToolSelected) {	
							currentTool.sprite.alpha += 0.18;
						}
					}
				} else {
					this.mockText.visible = false;
					this.isComplete = true;
					this.clock.stop();
					this.clock.removeAll();
				}				
			} 
		} else {
			//do nothing for now
		}
	},
	
	setInsult: function() {
		this.insultString = "\""+INSULTS[LEVEL_CONTROLLER.getIndex()]+"\"";
	}
		
};