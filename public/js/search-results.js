//does not yet account for longhand of abreviations 

	$(document).ready(function() {
  		var results = (<%-JSON.stringify(results)%>);
  		for (Object o : results) {
  			console.log(o.bio);
  		}

	});