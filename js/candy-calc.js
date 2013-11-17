//
// @file 		candy-calc.js
// @author 		Geoffrey Hunter <gbmhunter@gmail.com> (www.cladlabs.com)
// @edited 		n/a
// @date 		2013/11/01
// @brief 		Binding/calculating code for candy-calc.
// @details
//				See the README in the repo root dir for more info.

// Debug flag. Set to true to print debug information, otherwise false.
var DEBUG = true;

// Load jQuery if not already loaded	
window.jQuery || document.write('<script src="http://code.jquery.com/jquery-latest.min.js"><\/script>');

// Load knockout for binding functionality
document.write('<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js"></script>');

// MathJax for Latex rendering
document.write('<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>');

// Load qTip

// CSS file
document.write('<link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.0/jquery.qtip.min.css" />');
// JS. Include either the minifed or production version, not both
document.write('<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.0/jquery.qtip.min.js"></script>');

// Calculator unit object
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

// Candy-calc "namespace"
var cc = new function()
{
	// "Class" for a calc variable
	this.input = function(app, validatorFn, units, selUnit) {
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
				Log('Computing isValid.');
				for (var i = 0; i < this.validatorA().length; i++) {
					if(this.validatorA()[i].fn(this.validatorA()[i].app) == false)
					{
						// Remember the validator which returned false
						//this.triggeredValidator(this.validatorA()[i]);
						Log('Setting index.');
						this.trigIndex(i);
						Log('Returning false.');
						return false;
					}
				}
				// Only gets here if no validator function returned false
				Log('Returning true.');
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
	
	this.output = function(app, compFn, validatorFn, units, selUnit) {
			
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
				Log('Computing isValid.');
				for (var i = 0; i < this.validatorA().length; i++) {
					if(this.validatorA()[i].fn(this.validatorA()[i].app) == false)
					{
						// Remember the validator which returned false
						//this.triggeredValidator(this.validatorA()[i]);
						Log('Setting index.');
						this.trigIndex(i);
						Log('Returning false.');
						return false;
					}
				}
				// Only gets here if no validator function returned false
				Log('Returning true.');
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
				//Log(valueAccessor()().rawVal());
				// Call value binding (child binding)
				ko.bindingHandlers.value.init(element, function (){ return valueAccessor().dispVal } , allBindings, viewModel, bindingContext);
				  
				// Create Opentip (tooltip) for input box
				Log('Initialising calculator variable handlers');
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
				  																				
					if(valueAccessor().isValid() == false) // Validator returned false, value did not pass this test
					{
						Log('Activating tooltip.');
						jQuery(element).qtip('disable', false);
						// Note that the only way I have found to successfully replace the tooltip text is
						// to create an entirely new object. This is not the ideal method!
						jQuery(element).qtip({
								content: {
									// Grab the text shown the the triggered validator object
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
							
						// Since validator returned false, add notValid class for CSS to render red
						jQuery(element).addClass("notValid"); 						
					}
					else // Validator returned true, value passed this test
					{
						// Remove notValid class to make green again
						jQuery(element).removeClass("notValid");
						// Disable tooltip which showed any errors
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

