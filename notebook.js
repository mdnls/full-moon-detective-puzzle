

function main() {
	$('#submit').click(function() {
		console.log("Button");
		if($('#name').val().toLowerCase() == "cooper" && $('#case').val() == "0780504") {
			window.location.href = "secret.com";
		}
		else if($('#name').val().toLowerCase() == "" && $('#case').val() == "") { }
		else {
			$("#warn").css("display", "initial");
		}
	      });
}

$(document).ready(main);