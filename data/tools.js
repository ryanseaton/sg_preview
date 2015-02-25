var TOOLS = 
[
	{"name": "handTool",
// 		"sprite": {"name": "handAnim", "animation": {"name": "handSlap"}},
		"sprite": {"name": "handStatic"},
 		"bruise": {"name": "bruise", "numSlaps": 10},
 		"splash": {"name": "handAnim", "animation": {"name": "handSlap"}
 		, "sound": {"name": "handSplashSound", "file": "grunt.ogg"}},
 		"sound": {"name": "slap", "file": "slap_purchased.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 70000, "touchY": 20000},
 		"impact": 13,
 		"speedMultiplier": 10,
 		"mass": 12
	},
	{"name": "bearTool",
// 		"sprite": {"name": "bearClaw", "animation": {"name": "bearClaw"}},
		"sprite": {"name": "bearClawStatic"},
 		"bruise": {"name": "clawMarks", "numSlaps": 3},
 		"splash": {"name": "bearHead", "sound": {"name": "bearSplashSound", "file": "bear.ogg"}},
 		"sound": {"name": "bearHitSound", "file": "flesh_impact_04.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 90000, "touchY": 50000},
 		"impact": 25,
 		"speedMultiplier": 3,
 		"mass": 26
	},
	{"name": "eagleTool",
// 		"sprite": {"name": "eagleClaw" , "animation": {"name": "eagleClaw"}},
		"sprite": {"name": "eagleClawStatic"},
 		"bruise": {"name": "clawMarks2", "numSlaps": 5},
 		"splash": {"name": "eagleHead", "animation": {"name": "eagleCry"}
 		, "sound": {"name": "eagleSplashSound", "file": "eagle.ogg"}},
 		"sound": {"name": "eagleHitSound", "file": "flesh_impact_03.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 40000, "touchY": 10000},
 		"impact": 16,
 		"speedMultiplier": 30,
 		"mass": 14
	},
	{"name": "featherTool",
// 		"sprite": {"name": "feather", "animation": {"name": "featherFloat"}},
		"sprite": {"name": "featherStatic"},
 		"splash": {"name": "featherAnim", "animation": {"name": "featherFloat"}
 		, "sound": {"name": "featherSplashSound", "file": "feather_splash.ogg"}},
 		"sound": {"name": "pokeSound", "file": "poke.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 10000, "touchY": 5000},
 		"impact": 5,
 		"speedMultiplier": 35,
 		"mass": 2
	},
	{"name": "clockTool",
 		"sprite": {"name": "clockStatic"},
 		"bruise": {"name": "bruise", "numSlaps": 8},
 		"splash": {"name": "clockAnim", "animation": {"name": "clockRewind"}
 		, "sound": {"name": "clockSplashSound", "file": "alarm_clock2.ogg"}},
 		"sound": {"name": "clockHitSound", "file": "clock_hit.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 50000, "touchY": 20000},
 		"impact": 13,
 		"timeRewind": 10,
 		"speedMultiplier": 7,
 		"mass": 16
	},
	{"name": "duckTool",
// 		"sprite": {"name": "rubberDuck" , "animation": {"name": "rubberDuck"}},
		"sprite": {"name": "rubberDuckStatic"},
 		"splash": {"name": "rubberDuck", "animation": {"name": "rubberDuck"}
 		, "sound": {"name": "duckSplashSound", "file": "squeak_long_purchased.ogg"}},
 		"sound": {"name": "duckHitSound", "file": "squeak_hit_purchased.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 30000, "touchY": 10000},
 		"impact": 12,
 		"isAntiHazard": true,
 		"speedMultiplier": 17,
 		"mass": 8
	},
	{"name": "bootTool",
// 		"sprite": {"name": "oldBoot" , "animation": {"name": "oldBoot"}},
		"sprite": {"name": "oldBootStatic"},
 		"bruise": {"name": "bruise", "numSlaps": 6},
 		"splash": {"name": "oldBoot", "animation": {"name": "oldBoot"}
 		, "sound": {"name": "bootSplashSound", "file": "boot_splash2.ogg"}},
 		"sound": {"name": "bootHitSound", "file": "boot_hit2.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 85000, "touchY": 50000},
 		"impact": 17,
 		"speedMultiplier": 8,
 		"isAntiShieldReplacer": true,
 		"mass": 12
	},
	{"name": "panTool",
// 		"sprite": {"name": "panAnim" , "animation": {"name": "panHit"}},
		"sprite": {"name": "panStatic"},
 		"bruise": {"name": "bruise", "numSlaps": 4},
 		"splash": {"name": "panAnim", "animation": {"name": "panHit"}
 		, "sound": {"name": "panSplashSound", "file": "pan_splash.ogg"}},
 		"sound": {"name": "panHitSound", "file": "pan_hit.ogg"},
 		"force": {"mouseX": 50000, "mouseY": 25000, "touchX": 70000, "touchY": 20000},
 		"impact": 19,
 		"isAntiShieldReplacer": true,
 		"isAntiHazard": true,
 		"speedMultiplier": 8,
 		"mass": 23
	}
	
];