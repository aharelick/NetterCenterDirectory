$(document).ready(function() {
	$.each( results, function( key, value ) {
		var date = moment(value.updated);
		var html = '<div class="single-result">' +
			'<div class="rect"></div>' +
			'<a href=/profile/' + value.username + '>' +
				'<div class="circle" style="background-image: url(' + value.picture + ');"></div>' +
			'</a>' +
			'<div class="profile-body">' +
				'<a href=/profile/' + value.username + '><span class="name">' + value.name + '</span></a></br></br>' +
				'<div class="user-description">' + value.bio + '</div>' +
				'<span class="tags"></span>' +
				'<span class="updated">' + date.format("dddd, MMMM Do YYYY") + '</span>' +
			'</div>' + '</div>'
		$( ".results" ).append(html);
	});
});