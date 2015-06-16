//
// @file 			server.js
// @author 			Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
// @edited 			n/a
// @date 			2015-06-14
// @last-modified	2015-06-16
// @brief 			Creates node.
// @details
//		See the README in the repo root dir for more info.

var connect = require('connect'),
	serveStatic = require('serve-static'),
	args = process.argv.slice(2),
	folder = args[0] || '/../../../../',	// We assume candy-calc is cloned into /lib/candy-calc, and
	port = args[1] || '80';	

var server = connect().use(
    serveStatic(__dirname + folder)
).listen(port);

console.log("Server started on port %s in %s", port, folder);