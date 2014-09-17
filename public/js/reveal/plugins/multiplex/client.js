(function() {
	var multiplex = Reveal.getConfig().multiplex,
			socketId = multiplex.id,
			socket = io.connect(multiplex.url);

	socket.on(multiplex.id, function(data) {
		// ignore data from sockets that aren't ours
		if(data.socketId !== socketId) {
			return;
		}

		Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
	});
}());
