$(document).ready(function () {
	function toggle_div_slide(div) {
		// if div is hidden, slide it down. otherwise, hide it
		if ($(div).is(":hidden")) {
			$(div).slideDown(450);
			if (div == "#login-div") {
				$("#create-div").slideUp(450);
			}
			else if (div == "#create-div") {
				$("#login-div").slideUp(450);
			}
		}
		else {
			$(div).slideUp(450);
		}
	}
	
	$("#login-button").click(function() {
		toggle_div_slide("#login-div");
	});
	
	$("#create-button").click(function() {
		toggle_div_slide("#create-div");
	});
	
	// Another way to do the above stuff in one shot
	// When any element that has an id that ends in button is clicked...
	/*$('[id$=button]').click(function() {
		// we find the next div with id that ends in div and slide it for 700 ms
		$(this).next('[id$=div]').slideToggle(600);
		// then we find the other div (it's just not the one we clicked and find the div)
		var other_div = $('[id$=button]').not($(this)).next('[id$=div]');
		// if it's hidden slide toggle it
		if (!$(other_div).is(':hidden')) {
			$(other_div).slideToggle(600);
		}
	}); */
});