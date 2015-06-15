var connect = require('connect'),
	serveStatic = require('serve-static'),
	args = process.argv.slice(2),
	folder = args[0] || '/../../',
	port = args[1] || '80';	

var server = connect().use(
    serveStatic(__dirname + folder)
).listen(port);

console.log("Server started on port %s in %s", port, folder);