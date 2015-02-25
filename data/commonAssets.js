COMMON_ASSETS = {
		//always loaded
		"common" : {
			"atlases": [
			        {"name": "buttons", "image": "images/buttons/button_images.png", "data": "images/buttons/button_images.json"}
			],
			"spritesheets": [
			],
			"images": [
			],
			"audio": [
			          {"name": "menuSound", "file": "audio/tool/impact/impact_1.ogg"}
			]
		},
		
		//Credits: load the last level as well as this
		"credits" : {
			"spritesheets": [
			],
			"images": [
			],
			"audio": [
			          {"name": "creditsMusic", "file": "audio/music/level_music4.ogg"}
			]
		},
		"menu" : {
			"atlases": [
			        {"name": "levelSelection", "image": "images/buttons/level_selection_images.png", "data": "images/buttons/level_selection_images.json"}
			],
			"spritesheets": [
			],
			"images": [
					{"name": "title", "file": "images/logo3_big.png"},
			],
			"audio": [
					{"name": "menuMusic", "file": "audio/music/menu_music.ogg"}					
			]
		},
		"infoPage" : {
			"spritesheets": [
			],
			"images": [
			],
			"audio": [
					{"name": "infoSound", "file": "audio/info_page/infoSound.ogg"},
					{"name": "infoToolSound", "file": "audio/info_page/infoToolSound.ogg"},
			],
			"background": "infoPage_bg"
		},
		"level" : {
			"atlases": [
			        {"name": "interface", "image": "images/ui_images.png", "data": "images/ui_images.json"}
			],
			"spritesheets": [
			],
			"images": [
			   		{"name": "anchor", "file": "images/clear.png"}
			],
			"audio": [
					{"name": "gameMusic", "file": "audio/music/level_music2.ogg"},
					{"name": "loseSound", "file": "audio/music/lose.ogg"},
					{"name": "winSound", "file": "audio/music/win2.ogg"},
					{"name": "startSound", "file": "audio/music/start_short.ogg"},
					{"name": "goSound", "file": "audio/music/go_sound.ogg"},
					{"name": "slowLaugh", "file": "audio/voice/laugh6.ogg"},
					{"name": "fastLaugh", "file": "audio/voice/laugh4.ogg"},
					{"name": "allRightSound", "file": "audio/voice/all_right_echo.ogg"},
					{"name": "yeahSound", "file": "audio/voice/yea_echo.ogg"},
					{"name": "takeThatSound", "file": "audio/voice/take_that_echo.ogg"},
					{"name": "timerSound", "file": "audio/timer/tone3.ogg"}
					
			],
			"animations": [
			        "heartStatic",
			        "dizzy"
			],
			"physics": [
					{"name": "physicsData", "data": "physics/guy.json"}
			]
		},
		"shield" : {
			"spritesheets": [
			],
			"images": [
			],
			"audio": [
			       {"name": "shieldBreak", "file": "audio/flying_shield/slow_bounce.ogg"},
			],
			"animations": [
			        "shieldStatic",
			]
		},
		"flyingShield" : {
			"spritesheets": [
			],
			"images": [
					
			],
			"audio": [
					{"name": "shieldSound", "file": "audio/flying_shield/flying_shield.ogg"},
					{"name": "shieldReplace", "file": "audio/flying_shield/shield_replace2.ogg"},
					{"name": "flyingShieldHitSound", "file": "audio/flying_shield/bounce3.ogg"},
			],
			"animations": [
			        "flyingShieldStatic",
			]
		},
		"hazard" : {
			"spritesheets": [
			],
			"images": [
			],
			"audio": [
					{"name": "hazardSound", "file": "audio/hazard/hazard3.ogg"},
					{"name": "hazardHitSound", "file": "audio/hazard/Proximity55.ogg"},
					{"name": "stunSound", "file": "audio/hazard/Power_down_04.ogg"},
			],
			"animations": [
			        "ballStatic",
			]
		},
		"toolBox" : {
			"spritesheets": [
			],
			"images": [					
					{"name": "toolBox", "file":  "images/box.png"}
			],
			"audio": [
					{"name": "powerUpSound", "file": "audio/toolbox/powerup_2.ogg"},
					{"name": "boxSound", "file": "audio/toolbox/powerup_3.ogg"},
					{"name": "boxBounceSound", "file": "audio/toolbox/bounce1.ogg"}
			],
			"animations": [
			        "boxBounce",
			]
		},
		"fonts" : [
				{"name": "titleFont", "image": "fonts/bree_bright_with_outline.png", "xml": "fonts/bree_bright_with_outline.fnt"},
				{"name": "titleRedFont", "image": "fonts/bree_red_with_outline.png", "xml": "fonts/bree_red_with_outline.fnt"},
				{"name": "titleDarkFont", "image": "fonts/bree_dark_with_outline.png", "xml": "fonts/bree_dark_with_outline.fnt"},
				{"name": "titleLimeFont", "image": "fonts/bree_lime_with_outline.png", "xml": "fonts/bree_lime_with_outline.fnt"},
				{"name": "winFont", "image": "fonts/chewy_level_passed_bright.png", "xml": "fonts/chewy_level_passed_bright.fnt"},
				{"name": "levelNumbersFont", "image": "fonts/level_numbers.png", "xml": "fonts/level_numbers.fnt"}
		]
};