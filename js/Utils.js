/*
 * Miscellaneous utilitiy methods
 */

/*
 * Time formatting
 */
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
};

String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor(sec_num/ 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = minutes+':'+seconds;
    return time;
};


function loadJSON(url, callback) {  
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    //synchronous request
	xobj.open('GET', url, false); 
	xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
};
//JSON.parse(result);

function getRandomHexColor() {
	r = Math.floor(Math.random()*256);
	g = Math.floor(Math.random()*256);
	b = Math.floor(Math.random()*256);
    return "" + componentToHex(r) + componentToHex(g) + componentToHex(b) + "";
};

function getRandomColor() {
	index = Math.floor(Math.random()*COLORS.length);
	return COLORS[index];
};

function getColorByLevel(levelNumber) {
	index = levelNumber % COLORS.length;
	return COLORS[index];
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

function setMenuBackGround(gameContext) {
	gameContext.background = gameContext.add.sprite(0,0, "menu_bg");
	gameContext.background.height = gameContext.game.world.height;
	gameContext.background.width = gameContext.game.world.width;
};

function setInfoPageBackGround(gameContext) {
	gameContext.background = gameContext.add.sprite(0,0, "menu_bg");
	gameContext.background.height = gameContext.game.world.height;
	gameContext.background.width = gameContext.game.world.width;
};

function isInteger(i) {
	return typeof i==='number' && (i%1)===0;
};

