test("Basic Multiplication Test", function() {
		
		// Select voltage field to be calculated
		jQuery("#resistanceCalcWhat").attr('checked', 'checked').trigger('click');
		
		jQuery("#voltage").val(1).change();
		jQuery("#current").val(1).change();
		
		stop();
		
		setTimeout(function(){
			ok(jQuery("#resistance").val() == "1", "Passed!" );
			start();
		}, 1000); 
});

test("Calculate What Test", function() {
		
		// Select voltage field to be calculated
		jQuery("#voltageCalcWhat").attr('checked', 'checked').trigger('click');
		
		// Now set the other two
		jQuery("#current").val(5).change();
		jQuery("#resistance").val(7).change();
		
		stop();
		
		setTimeout(function(){
			ok(jQuery("#voltage").val() == "35", "Passed!" );
			start();
		}, 1000); 
});