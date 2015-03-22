$(document).ready(function () {
	function toggle_div_slide(div) {
		// if div is hidden, slide it down. otherwise, hide it
		if ($(div).is(":hidden")) {
			$(div).slideDown(450);
			if (div == "#login_div") {
				$("#create_div").slideUp(450);
			}
			else if (div == "#create_div") {
				$("#login_div").slideUp(450);
			}
		}
		else {
			$(div).slideUp(450);
		}
	}
	
	$("#login_button").click(function() {
		toggle_div_slide("#login_div");
	});
	
	$("#create_button").click(function() {
		toggle_div_slide("#create_div");
	});
});