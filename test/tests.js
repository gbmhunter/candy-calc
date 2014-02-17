/*test( "hello test", function() {
  ok( 1 == "1", "Passed!" );
});

test(
	"Create candy-calc variable test",
	function()
	{
		
	});*/
	
var page = require('webpage').create();
page.open('test.php', function () {
    page.render('table.png');
    phantom.exit();
});