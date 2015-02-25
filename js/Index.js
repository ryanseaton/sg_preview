window.onload = function() {
	var gameWidth = window.innerWidth * window.devicePixelRatio;
	var gameHeight = window.innerHeight * window.devicePixelRatio;
	var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS,'');


	//	Game states
	game.state.add('Boot', SlapGame.Boot);
	game.state.add('Preloader', SlapGame.Preloader);
	game.state.add('DynamicPreloader', SlapGame.DynamicPreloader);
	game.state.add('MainMenu', SlapGame.MainMenu);
	game.state.add('GuideMenu', SlapGame.GuideMenu);
	game.state.add('PlayMenu', SlapGame.PlayMenu);
	game.state.add('SelectLevelMenu', SlapGame.SelectLevelMenu);
	game.state.add('Level', SlapGame.Level);
	game.state.add('LevelHandler', SlapGame.LevelHandler);
	game.state.add('InfoPage', SlapGame.InfoPage);
	game.state.add('Credits', SlapGame.Credits);
	game.state.add('InterstitialAd', SlapGame.InterstitialAd);

	//	Now start the Boot state.
	game.state.start('Boot');
};
