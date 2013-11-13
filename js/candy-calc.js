//
// @file 		candy-calc.js
// @author 		Geoffrey Hunter <gbmhunter@gmail.com> (www.cladlabs.com)
// @edited 		n/a
// @date 		2013/11/01
// @brief 		Binding/calculating code for candy-calc.
// @details
//				See the README in the root dir for more info.


//var j = jQuery.noConflict();

// Debug flag. Set to true to print debug information, otherwise false.

var DEBUG = true;

var unit = function(name, multiplier) {
        this.name = name;
        this.multiplier = multiplier;
   };
	
// "Class" for validator object, which holds both a message and validator function
function validator(msg, fn, app)
{
	this.msg = msg;
	this.fn = fn;
	this.app = app;
}
	
// "Class" for a calc variable
var calcInput = function(app, validatorFn, units, selUnit) {
			this.dispVal = ko.observable();
			this.units = ko.observableArray(units);
			this.selUnit = ko.observable(this.units()[selUnit]);
			
			// Scaled value, taking into account the units
			this.val = ko.computed( function(){
				return parseFloat(this.dispVal())*parseFloat(this.selUnit().multiplier);
			},
			this);

			// Holds all validator functions
			this.validatorA = ko.observableArray();
			
			//this.triggeredValidator = ko.observable();
			
			this.trigIndex = ko.observable();
			
			// Default is to just return true.
			this.isValid = ko.computed(
				function()
				{
					console.log('Computing isValid.');
					for (var i = 0; i < this.validatorA().length; i++) {
						if(this.validatorA()[i].fn(this.validatorA()[i].app) == false)
						{
							// Remember the validator which returned false
							//this.triggeredValidator(this.validatorA()[i]);
							console.log('Setting index.');
							this.trigIndex(i);
							console.log('Returning false.');
							return false;
						}
					}
					// Only gets here if no validator function returned false
					console.log('Returning true.');
					return true;
				},
				this
			);
			
			// Methods
			this.AddValidator = function(msg, fn, app)
			{
				// Create new validator object and add to the end of the array
				this.validatorA.push(new validator(msg, fn, app));
			}
   };
	
var calcComp = function(app, compFn, validatorFn, units, selUnit) {
			
	this.units = ko.observableArray(units);
	this.selUnit = ko.observable(this.units()[selUnit]);
	
	this.val = ko.computed(compFn, app);
	
	// Number of decimal places to round value to
	this.roundTo = 1;
	
	// This is the displayed value
	this.dispVal = ko.computed(function(){
			var unroundedVal = this.val()/this.selUnit().multiplier;
			// Round the value
			var roundedVal = Math.round(unroundedVal*Math.pow(10, this.roundTo))/Math.pow(10, this.roundTo);
			return roundedVal;
		},
		this);				
	
	this.lowerBound = 0; //ko.observable(lowerBound);
	this.upperBound = 0; //ko.observable(upperBound);

	// Holds all validator functions
	this.validatorA = ko.observableArray();
	
	this.trigIndex = ko.observable();
	
	// Default is to just return true.
	this.isValid = ko.computed(
		function()
		{
			console.log('Computing isValid.');
			for (var i = 0; i < this.validatorA().length; i++) {
				if(this.validatorA()[i].fn(this.validatorA()[i].app) == false)
				{
					// Remember the validator which returned false
					//this.triggeredValidator(this.validatorA()[i]);
					console.log('Setting index.');
					this.trigIndex(i);
					console.log('Returning false.');
					return false;
				}
			}
			// Only gets here if no validator function returned false
			console.log('Returning true.');
			return true;
		},
		this
	);
			
	// Methods
	this.AddValidator = function(msg, fn, app)
	{
		// Create new validator object and add to the end of the array
		this.validatorA.push(new validator(msg, fn, app));
	}
			
};

// Stuff to execute on start-up
// - Register custom binding handler
jQuery(document).ready(
	function StartUp()
	{	  		
		// Create custom binding
		ko.bindingHandlers.calcVar = {
			init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				// This will be called when the binding is first applied to an element
				// Set up any initial state, event handlers, etc. here
				//console.log(valueAccessor()().rawVal());
				// Call value binding (child binding)
				ko.bindingHandlers.value.init(element, function (){ return valueAccessor().dispVal } , allBindings, viewModel, bindingContext);
				  
				// Create Opentip (tooltip) for input box
				console.log('Initialising calculator variable handlers');
				jQuery(element).qtip({ // Grab some elements to apply the tooltip to
					content: {
						text: '',
						title: 'Error!'
					},
					style: {
						classes: 'qtip-red qtip-rounded qtip-shadow'
					},
					show: {
						effect: function(offset) {
							jQuery(this).slideDown(100); // "this" refers to the tooltip
						}
					},
					hide: {
						effect: function(offset) {
							jQuery(this).slideDown(100); // "this" refers to the tooltip
						}
					}
				})
				// We want this disabled by default.
				jQuery(element).qtip('disable', true);
								
			 },
			 update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				  // This will be called once when the binding is first applied to an element,
				  // and again whenever the associated observable changes value.
				  // Update the DOM element based on the supplied values here.
		
				  // Call value binding (child binding)
				  ko.bindingHandlers.value.update(element, function (){ return valueAccessor().dispVal } , allBindings, viewModel, bindingContext);
				  																				
					if(valueAccessor().isValid() == false)
					{
						//console.log('Activating tooltip.');
						jQuery(element).qtip('disable', false);
						// Update text
						console.log('Qtip');
						//jQuery(element).qtip('option', 'content.text', 'BLAH');
						jQuery(element).qtip({ // Grab some elements to apply the tooltip to
								content: {
									text: valueAccessor().validatorA()[valueAccessor().trigIndex()].msg,
									title: 'Error!'
								},
								style: {
									classes: 'qtip-red qtip-rounded qtip-shadow'
								},
								show: {
									effect: function(offset) {
										jQuery(this).slideDown(100); // "this" refers to the tooltip
									}
								},
								hide: {
									effect: function(offset) {
										jQuery(this).slideDown(100); // "this" refers to the tooltip
									}
								}
							});
							
						// Add notValid class for CSS to render red
						jQuery(element).addClass("notValid"); 						
					}
					else
					{
						// Remove notValid class to make green again
						jQuery(element).removeClass("notValid");
						jQuery(element).qtip('disable', true);
					}
					
			 }
		};
	}
);

// Logs error messages
function Log(msg)
{
	// Only print if DEBUG variable has been set to true
	if(DEBUG == true)
		console.log(msg);
}

