// Get the modal

const OBJS = [
	"#candle",
	"#mug",
	"#matchbox",
	"#keyboard"
].map(x => $(x));

const fname_per_cursor = {
	"mag_glass": "img/cursors/mag_glass.png",
	"match": "img/cursors/match.png",
	"lit_match": "img/cursors/lit_match.png"
}

const fname_per_id = {
	"#mag_glass": "img/objects/Mag_Glass.png",
	"#candle": "img/objects/Candle.png",
	"#mug": "img/objects/ALA.png",
	"#crt": "img/objects/CRT.png",
	"#keyboard": "img/objects/Keyboard.png",
	"#matchbox": "img/objects/Matchbox_with_wolf.png",
}

var state = "idle"; // states: ["idle", "match", "lit_match", "glass"]
var enabled = false;

var modal_bkg = $("#modal-bkg");
var modal = $("#modal");
var modal_contents = $("#modal-contents");

var timer;

var elapse_time = 0;
var enter_time;

function clr() {
	modal_bkg.css("display", "none");
	OBJS.forEach(x => x.css("display", "initial"));
	modal_contents.attr("src", ""); // jtodo: preload all images and selectively display them, instead of loading
}

function modal_handler(obj) {
	return () => {
		if(state == "glass") {
			toggle_obj(obj);
			modal_bkg.css("display", "block");
			modal_contents.attr("src", fname_per_id[obj]);
		}
		
	}
}

function toggle_obj(obj) {
	$(obj).css("display", $(obj).css("display") == "none" ? "initial" : "none");
}

function clr_state() {
	state = "idle";
	$("body").css("cursor", "initial");
	clr();
}
function equip_glass() {
	state = "glass";
	$("body").css("cursor", 'url(' + fname_per_cursor["mag_glass"] + ') 25 15, auto');
}
function equip_match() {
	state = "match";
	$("body").css("cursor", 'url(' + fname_per_cursor["match"] + '), auto');
}
function light_match() {
	state = "lit_match";
	$("body").css("cursor", 'url(' + fname_per_cursor["lit_match"] + ') 0 62, auto');
}
function reveal() {
	enabled = true;
	$("#details").append('<img id="annotation" src="img/annotation.png" style="display: none;" />');
	$("#annotation").fadeIn({"duration": 500});
	$("#annotation").click( () => {
		if(state == "glass" && enabled) {
			window.open("Case_Details_Secret.pdf");
			
		} else if (state == "glass") {
			window.open("Case_Details.pdf");
		}
	});
}

function state_update(event) { 
	if(enabled) {
		if ( state == "glass" && event.target == document.getElementById("mag_glass")) {
			clr_state();
		}
		else if ( state == "idle" && event.target == document.getElementById("mag_glass")) {
			equip_glass();
		}
		else if( (state == "lit_match" | state == "match" | state == "glass") && event.target.tagName == "BODY") {
			clr_state();
			$("#mag_glass").css("display", "initial"); // cheaper than a whole clr() 
		}
	}
	else { 
		if(state == "idle" && event.target == document.getElementById("matchbox")) {
			equip_match();
		}
		else if(state == "match" && event.target == document.getElementById("candle")) {
			light_match();
		}
		else if ( state == "idle" && event.target == document.getElementById("mag_glass")) {
			equip_glass();
		}
		else if( (state == "lit_match" | state == "match" | state == "glass") && event.target.tagName == "BODY") {
			clr_state();
			$("#mag_glass").css("display", "initial"); // cheaper than a whole clr() 
		}
		
	}
}

function main() {
	window.onclick = function(event) {
		state_update(event);
		if (event.target == document.getElementById("modal-bkg")) { clr(); }
	}
	
	OBJS.forEach(x => x.click(modal_handler('#' + x.attr('id'))));
	$("#mag_glass").click(() => toggle_obj("#mag_glass"));
	$("#crt").click(() => { if(state == "glass"){ window.open("notebook.html"); }});
	$("#werewolf").click(() => { if(state == "glass"){ window.open("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Werwolf.png/440px-Werwolf.png"); }});
	$('#case_details').on({
		mouseover: () => {
			if(state == "lit_match") {
				enter_time = Date.now();
				setTimeout(() => {
					if(enter_time && (Date.now() - enter_time) >= 2000) {
						reveal();
					}
				}, 2000);
			}
		},
		mouseleave: () => { enter_time = undefined; }      
	});
	$("#case_details").click( () => {
		if(state == "glass" && enabled) {
			window.open("Case_Details_Secret.pdf");
			
		} else if (state == "glass") {
			window.open("Case_Details.pdf");
		}
	});
}

$(document).ready(main);