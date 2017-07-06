window.onload = function() {
	var types = document.getElementsByClassName("type")[0].getElementsByTagName("li");
	for (var i=0;i<types.length;i++) {
		console.log(types[i].getAttribute("data-type"));
	}
}