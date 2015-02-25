// Animation names MUST BE UNIQUE!!!
ANIMATION_DEFINITIONS =
[
 //Guy animations
//  {"spritesheet": "guySleep",
//	"file": {"name": "images/animations/guy/sleep.png", "width": 512, "height": 486},
//    "startIndex": 0,
//	"animation": [
//	              {"name":"sleep", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
//	             ]
//  },
//  {"spritesheet": "guyWakeUp",
//	"file": {"name": "images/animations/guy/wakeUp.png", "width": 512, "height": 486},
//    "startIndex": 0,
//	"animation": [
//	              {"name":"wakeUp", "frames": [0,1,2,3,4,5,6,7]}
//	             ]
//  },
  {"spritesheet": "guyAwake",
	"file": {"name": "images/animations/guy/hit_left_right_blink.png", "width": 512, "height": 486},
    "startIndex": 0,
	"animation": [
					{"name":"awakeRest", "frames": [15,15,15]},
					{"name":"hitFromLeft", "frames": [0,1,2,3,4,5]},
					{"name":"hitFromRight", "frames": [6,7,8,9,10,11]},
					{"name":"blink", "frames": [12,13,14,15]},
	             ]
  },
  {"spritesheet": "guyLaugh",
	"file": {"name": "images/animations/guy/laugh.png", "width": 512, "height": 486},
    "startIndex": 0,
	"animation": [
	              	{"name":"laugh", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
//  {"spritesheet": "guyCryBlink",
//	"file": {"name": "images/animations/guy/cry.png", "width": 512, "height": 486},
//    "startIndex": 0,
//	"animation": [
//	              	{"name":"cry", "frames": [0,1,2,3,4,5,6,7,8,9,10,11]},
//	              	{"name":"blink", "frames": [12,13,14,15]}
//	             ]
//  },
  {"spritesheet": "guyDizzy",
	"file": {"name": "images/animations/guy/dizzy.png", "width": 512, "height": 486},
    "startIndex": 0,
	"animation": [
	              	{"name":"dizzy", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  
  //Bruises
  {"spritesheet": "bruise",
	"file": {"name": "images/animations/bruise/bruise_anim.png", "width": 512, "height": 486},
    "startIndex": 0,
	"animation": [
	              	{"name":"bruise", "frames": [0,1,2,3,4,5]}
	             ]
  },
  {"spritesheet": "clawMarks",
	"file": {"name": "images/animations/bruise/claw_marks.png", "width": 291, "height": 373},
    "startIndex": 0,
	"animation": [
	              	{"name":"clawMarks", "frames": [0]}
	             ]
  },
  {"spritesheet": "clawMarks2",
	"file": {"name": "images/animations/bruise/claw_marks2.png", "width": 291, "height": 373},
    "startIndex": 0,
	"animation": [
	              	{"name":"clawMarks2", "frames": [0]}
	             ]
  },
  //Shield animations
  {"spritesheet": "heartIcon",
	"file": {"name": "images/animations/heart_anim.png", "width": 100, "height": 100},
    "startIndex": 0,
	"animation": [
	              	{"name":"heartBeat", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "heartStatic",
	"file": {"name": "images/animations/heart.png", "width": 100, "height": 100},
    "startIndex": 0,
	"animation": [
	              	{"name":"heartStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "shieldIcon",
	"file": {"name": "images/animations/shield_anim.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"shieldPulse", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "shieldStatic",
	"file": {"name": "images/animations/shield.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"shieldStatic", "frames": [0]}
	             ]
  },
  
  //Toolbox
  {"spritesheet": "boxAnim",
	"file": {"name": "images/animations/box_anim.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"boxBounce", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  
  //Tools
  {"spritesheet": "handAnim",
	"file": {"name": "images/animations/tool/hand_slap_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"handSlap", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "handStatic",
	"file": {"name": "images/animations/tool/hand.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"handStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "eagleClaw",
	"file": {"name": "images/animations/tool/eagle_claw_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"eagleClaw", "frames":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "eagleClawStatic",
	"file": {"name": "images/animations/tool/eagle_claw.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"eagleClawStatic", "frames":[0]}
	             ]
  },
  {"spritesheet": "eagleHead",
	"file": {"name": "images/animations/tool/eagle_head_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"eagleCry", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "featherAnim",
	"file": {"name": "images/animations/tool/feather_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"featherFloat", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "featherStatic",
	"file": {"name": "images/animations/tool/feather.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"featherStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "bearClaw",
	"file": {"name": "images/animations/tool/bear_claw_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"bearClaw", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "bearClawStatic",
	"file": {"name": "images/animations/tool/bear_claw.png", "width": 240, "height": 224},
    "startIndex": 0,
	"animation": [
	              	{"name":"bearClawStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "bearHead",
	"file": {"name": "images/animations/tool/bear_head.png", "width": 202, "height": 204},
    "startIndex": 0,
	"animation": [
	              	{"name":"bearHead", "frames": [0]}
	             ]
  },
  {"spritesheet": "clockAnim",
	"file": {"name": "images/animations/tool/alarm_clock_anim.png", "width": 242, "height": 250},
    "startIndex": 0,
	"animation": [
	              	{"name":"clockRewind", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },  
  {"spritesheet": "clockStatic",
	"file": {"name": "images/animations/tool/alarm_clock.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"clockStatic", "frames": [0]}
	             ]
  },  
  {"spritesheet": "rubberDuck",
	"file": {"name": "images/animations/tool/duck_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"rubberDuck", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "rubberDuckStatic",
	"file": {"name": "images/animations/tool/rubber_duck.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"rubberDuckStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "oldBoot",
	"file": {"name": "images/animations/tool/boot_hit.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"oldBoot", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "oldBootStatic",
	"file": {"name": "images/animations/tool/boot.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"oldBootStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "panAnim",
	"file": {"name": "images/animations/tool/pan_hit_anim.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"panHit", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "panStatic",
	"file": {"name": "images/animations/tool/pan.png", "width": 240, "height": 240},
    "startIndex": 0,
	"animation": [
	              	{"name":"panStatic", "frames": [0]}
	             ]
  },
  
  //Generators
  {"spritesheet": "ballAnim",
	"file": {"name": "images/animations/ball_anim.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"ballSmile", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "ballStatic",
	"file": {"name": "images/animations/ball.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"ballStatic", "frames": [0]}
	             ]
  },
  {"spritesheet": "flyingShieldAnim",
	"file": {"name": "images/animations/shield_fly_anim.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"shieldFly", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "flyingShieldStatic",
	"file": {"name": "images/animations/shield_fly.png", "width": 120, "height": 120},
    "startIndex": 0,
	"animation": [
	              	{"name":"flyingShieldStatic", "frames": [0]}
	             ]
  },
  
  //Tutorials
  {"spritesheet": "tut1Anim",
	"file": {"name": "images/animations/infopage/tut1_anim.png", "width": 425, "height": 273},
    "startIndex": 0,
	"animation": [
	              	{"name":"tut1", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  },
  {"spritesheet": "panExplosionAnim",
//	"file": {"name": "images/animations/infopage/pan_explosion_anim2.png", "width": 425, "height": 273},
	"file": {"name": "images/animations/infopage/pan_explosion_anim3.png", "width": 398.5, "height": 256},
    "startIndex": 0,
	"animation": [
	              	{"name":"panExplode", "frames": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]}
	             ]
  }
  
];