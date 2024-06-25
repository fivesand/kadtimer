// ==UserScript==
// @name        KadTimer
// @version     1.0
// @updateURL   https://github.com/fivesand/kadtimer
// @author      fivemilliononly
// @description Kadoatery Time Keeping
// @match       *://www.neopets.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

(async function() {
	var KTDB = "kadoatery-timer";
	var lmr = await GM.getValue(KTDB);

	// functions
	// allows icon to be dragged around the page
	// reference: https://stackoverflow.com/questions/13152578/create-a-draggable-div-in-native-javascript

	var dragObj = null;
	function draggable() {
		var parent = document.getElementById("KadTimer");
		var objimg = document.getElementById("KadTimerIcon");
		parent.style.position = "absolute";
  
		objimg.onmousedown = function(e) {
			dragObj = parent;
		}
		objimg.addEventListener("dragstart", (e) => {
			e.preventDefault();
		});
		objimg.addEventListener("dragend", (e) => {
			e.preventDefault();
		});
	}
  
	document.onmouseup = function(e) {
		dragObj = null;
	};
  
	document.onmousemove = function(e) {
		if(dragObj == null) return;
		dragObj.style.left = e.pageX +"px";
		dragObj.style.top= e.pageY +"px";
	};
	
	function getKadTimers() {
		var lmr = parseInt(document.getElementById("ktlmr").value);
		GM.setValue(KTDB, lmr);

		// next spawn time
		var spawntext = "";
		var spawntime = lmr;
		var spawnclass = "ktmini";
		for(let i=0;i<10;i++) {
			spawntime = parseInt(spawntime)+7;
			if(spawntime>59) {
				spawntime-=60;
			}
			if(spawntime<10) {
				spawntime = "0" + spawntime;
			}
			if(i>3) spawnclass = "ktmain";
				spawntext += "<span class='"+spawnclass+"'>:"+spawntime+"</span> ";
			}
			document.getElementById("ktspawn").innerHTML = spawntext;
		}

		function setKadTimerIcon() {
		var html = `
<style>
#KadTimer {
	padding:10px;
	width:320px;
	color:#fff;
	position:fixed;
	top:300px;
	left:400px;
	z-index:9999;
	border-radius:7px;
	background:rgba(0,0,0,0.5);
}
#KadTimer * {
	font:14px Arial,Verdana,Tahoma!important;
}
#KadTimer input {
	padding:0 5px;
	color:#000;
}
#KadTimerIcon {
	margin-right:10px;
	margin-bottom:70px;
	width:64px;
	height:64px;
	border-radius:7px;
	float:left;
}
#ktlmr {
	width:50px;
	border:0;
}
#ktbtn {
	margin:0 10px;
	position:relative;
	top:-1px;
}
#ktspawn {
	padding:0 5px;
	width:220px;
	height:21px;
	background:#777;
	display:inline-block;
}
#ktspawn .ktmain, #ktspawn .ktmini {font-size:12px!important}
.ktmain {
	color:#000;
}
.ktmini {
	color:#CCC;
}
#kthelp {
	color:#CCC;
	text-decoration:underline;
	cursor:pointer;
	position:relative;
}
#kthelp:hover {
	text-decoration:none;
}
#kthelp:after {
	content: attr(tip);
	font-family:Arial, Helvetica, sans-serif;
	font-size:90%;
	line-height:1.2em;
	color:#000;
	width:200px;
	padding:5px 10px;
	border-radius:7px;
	background:#ccc;
	position:absolute;
	top:27px;
	left:-10px;
	display:none;
}
#kthelp:before {
	z-index:1000;
	position:absolute;
	content:"";
	top:15px;
	left:0px;
	border-right:7px transparent solid;
	border-left:7px transparent solid;
	display:none;
}
#kthelp:hover {
	z-index:1000;
	position:relative;
	color:#8325f7;
}
#kthelp:hover:after{
	display:block;
}
#kthelp:hover:before{
	display:block;
}
#kttips {
	font-size:10px!important;
}
</style>
<div id="KadTimer">
<img id="KadTimerIcon" src="//images.neopets.com/games/kadoatery/pink_happy.gif">
<div id="KadTimerContent">
	<p>Last Main: <input type="number" id="ktlmr" placeholder="00" min="0" max="59" pattern="^([1-5]?[0-9]|59)$"> <input type="button" id="ktbtn" class="btn btn-default btn-sm" value="Set"></input> [<a id="kthelp" tip="Enter the minute of last Kadoatery main refresh time to get next predicted Kadoatery feeding times">?</a>]</p>
	<p>Next Predicted Spawn Times<br><div id="ktspawn">Set last main minute and click Set</div></p>
	<p id="kttips"><span class="ktmini">Time with light color is mini spawn<span><br><span class="ktmain">Time with dark color is main spawn</span></p>
</div>
</div>
	`;
	var kadTimer = document.createElement("div");
	kadTimer.id = "KadTimerContainer";
	kadTimer.innerHTML = html;
	var parentelement = document.getElementsByTagName("body")[0]
	parentelement.append(kadTimer);

	document.getElementById("ktbtn").addEventListener("click", getKadTimers);

	if(lmr) {
		document.getElementById("ktlmr").value = lmr;
		getKadTimers();
	}
};

setKadTimerIcon();
draggable();

})();
  