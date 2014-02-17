window.onload=function(){
	test("Basic Multiplication Test", function() {
		
		jQuery("#voltage").val(1).change();
		jQuery("#current").val(1).change();
		
		stop();
		
		setTimeout(function(){
			ok(jQuery("#resistance").val() == "1", "Passed!" );
			start();
		}, 1000); 
	});
};