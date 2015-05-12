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
	});
});