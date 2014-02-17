
	
var page = require('webpage').create();
page.open('test.php', function () {
    page.render('table.png');
	 console.log('Hello, world!');
    phantom.exit();
});