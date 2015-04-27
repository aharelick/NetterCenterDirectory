$(document).ready(function () {

	// gets all the tags from the json file and makes them options
	// in the select element for the library to use
	$.getJSON('/json/tags.json', function(data) {
		$.each(data, function(index, value) {
			$('.tag-select').append('<option value="' + value + '">' + value + '</option>');
		});
		$('.tag-select').tokenize({
			newElements: false,
			placeholder: "please enter your tag(s) here..."
		});
	});

	filepicker.setKey("AISv3IWs7SNW1CjG0QFz8z");
	$("#filepicker-trigger").click(function() {
		filepicker.pick({
			mimetypes: ['image/*'],
		},
		function(Blob) {
			console.log(Blob.url)
    		$("input[name='image']").val(Blob.url)
    	});
	});


	// helper function to change the text of attributes
	function changeAtt(att1, att2, att3) {
		$(".attr:eq(0)").html(att1);
		$(".attr:eq(1)").html(att2);
		$(".attr:eq(2)").html(att3);
	}

	// make attributes correspond to stakeholder position type
	$("#stakeholder").change(function() {
		var position = $(this).val();
		if (position == "students") {
			changeAtt("Experience", "Program/Group", "Site");
		}
		else if (position == "faculty") {
			changeAtt("Department", "Courses Taught", "Research Interests");
		}
		else if (position == "community-members") {
			changeAtt("Work Experience", "Support Interests", "Group/Netter Involvement");
		}
		else if (position == "netter-staff") {
			changeAtt("Position/Role", "Projects/Specific Involvements", "Site");
		}
		else if (position == "alumni-patrons") {
			changeAtt("Work Experience", "Support Interests", "Projects/Specific Involvement w/ Netter");
		}
	});


	function makeTagArray(tagNum) {
		tags = [];
		$('span[tagnum="' + tagNum + '"]').each(function(i,el){
			  tags.push($(el).text());
		});
		return tags;
	}

	/* creates form and submits it to the POST url
	I did this like this because I didn't know how the the form would deal
	with the weird format of tags in the select boxes. In the future we should be graying
	this box out when the user shouldn't be able to submit (all the fields not filled out)
	and maybe make the whole page a form. */
	$('#submit').click(function() {

		var att1Tags = makeTagArray(1);
		var att2Tags = makeTagArray(2);
		var att3Tags = makeTagArray(3);
		console.log(att1Tags);
		console.log(att2Tags);
		console.log(att3Tags);

		var form = $('<form />', {
		action: '/create-profile',
	 	method: 'POST',
		style: 'display: none;'
		});
			$('.data').appendTo(form);
			form.appendTo('body').submit();
	})
	
});