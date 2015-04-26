$(document).ready(function () {

	$('#login-button').click(function() {
		if ($('#login-div').is(":hidden")) {
			$('#login-button').hide();
			$('#login-div').slideDown(450);
			$('html, body').animate({
        		scrollTop: $("#login-div").offset().top
    		}, 1000);
		} else {
			$('#login-div').slideUp(450);
		}
	})
	
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