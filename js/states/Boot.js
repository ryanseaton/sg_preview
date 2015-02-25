var SlapGame = {};
var InputRatio = {x:1,y:1};

/**
* The Game's Boot state constructor.
* @class Slapgame.Level
* @constructor
* @param {Phaser.game} game - Reference to the game instance.
*/

SlapGame.Boot = function (game) {

};

var menuMusic = null;

SlapGame.Boot.prototype = {

    preload: function () {
        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
    	this.load.image('menu_bg', 'images/backgrounds/main_bg.png');
    	
		
        //this.load.image('preloaderBar', 'images/preload_bar.png');
		this.load.image('logoGray', 'images/logo_gray.png');
		this.load.image('logo', 'images/logo.png');

    },

    create: function () {
    	
    	this.background = this.add.sprite(0,0, "menu_bg");
		this.background.height = this.game.world.height;
		this.background.width = this.game.world.width;

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;
        
        this.setupScaling();

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        PRELOAD_MANAGER.updateGoToMenu();
        this.state.start('DynamicPreloader');

    },
    
    /**
     * Setup the scaling behaviour for the game
     * if the device's aspect ratio is less than 0.7 then
     * set the resolution to 1280x7680. Otherwise 
     * a resolution of 1280x960 will be used.
     * 768/1280=0.6 -> optimus G
	 * 1536/2048=0.75 -> Nexus 9
	 * 600/1024=0.58 -> Galaxy Tab 3
	 * 480/800==0.6 -> Galaxy Ace IIx
     */
    setupScaling: function () {

//        	console.log( JSON.stringify(Cocoon.Device.getDeviceInfo()) );
        	var w = window.innerWidth;
        	h = window.innerHeight;
        	var width = (h > w) ? h : w,
        	height = (h > w) ? w : h;
        	
        	var aR = height/width;

        	gameWidth = 1280;
        	gameHeight = aR <= 0.70 ? 768 : 960;

            var ratio = this.getRatio('fill', gameWidth, gameHeight);
            this.game.world.scale.x = ratio.x;
            this.game.world.scale.y = ratio.y;

            InputRatio.x = 1/ratio.x;
            InputRatio.y = 1/ratio.y;
            this.game.world.updateTransform();
            
            this.game.input.scale.x = ratio.dips;
            this.game.input.scale.y = ratio.dips;
            
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setupScale(this.game.world.scale.x*gameWidth, this.game.world.scale.y*gameHeight);
            this.game.world.setBounds(0, 0, gameWidth, gameHeight);

    },
    
    getRatio: function (type, w, h) {
    	var width = window.innerWidth,
        	height = window.innerHeight;

        var dips = window.devicePixelRatio;

        width = width * dips;
        height = height * dips;
        
        var scaleX = width / w,
            scaleY = height / h,
            result = {
                x: 1,
                y: 1,
                dips: dips
            };

        switch (type) {
            case 'all':
                result.x = scaleX > scaleY ? scaleY : scaleX;
                result.y = scaleX > scaleY ? scaleY : scaleX;
                break;
            case 'fit':
                result.x = scaleX > scaleY ? scaleX : scaleY;
                result.y = scaleX > scaleY ? scaleX : scaleY;
                break;
            case 'fill':
                result.x = scaleX;
                result.y = scaleY;
                break;
        }

        return result;
    }

};
