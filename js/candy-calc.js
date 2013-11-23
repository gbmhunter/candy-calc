//
// @file 		candy-calc.js
// @author 		Geoffrey Hunter <gbmhunter@gmail.com> (www.cladlabs.com)
// @edited 		n/a
// @date 		2013/11/01
// @brief 		Binding/calculating code for candy-calc.
// @details
//				See the README in the repo root dir for more info.

// Debug flag. Set to true to print debug information, otherwise false.
var DEBUG = false;

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

// Candy-calc "namespace"
// All candy-calc framework should be inside this
var cc = new function()
{
	// Enumeration of pre-defined validators
	this.validatorEnum = {
		'IS_NUMBER' 				: 1,
		'IS_POSITIVE_OR_ZERO' 	: 2,
		'IS_NEGATIVE_OR_ZERO' 	: 3
	}
	
	// Enumeration of severity levels for validators. Severity level
	// determines background colour of variable.
	this.severityEnum = {
		'warning' 				: 1,
		'error' 					: 2
	}
	
	// Used to determine whether variable is an input or an output
	this.stateEnum = {
		'input'					: 1,
		'output'					: 2
	}
	
	// Calculator unit object
	this.unit = function(name, multiplier) {
			  this.name = name;
			  this.multiplier = multiplier;
	};
	
	// "Class" for validator object, which holds both a message and validator function
	this.validator = function(app, msg, fn, severity)
	{
		this.app = app;
		this.msg = msg;
		this.fn = fn;	
		this.severity = severity;
	}
	
	// This function links two unit sets together, so that when sourceUnit is changed,
	// destinationUnit is changed also.
	// Note, does not work correctly yet! destination variable does not update select box
	this.linkUnits = function(sourceCalcVar, destinationCalcVar)
	{
		Log('Linking units...');
		Log('sourceCalcVar.selUnit = ');
		Log(sourceCalcVar.selUnit());
		Log('destinationCalcVar.selUnit = ');
		Log(destinationCalcVar.selUnit());
		// Destination selUnit is now a computed variable
		destinationCalcVar.selUnit = ko.computed(
			function(){
				Log('!!!!Changing destination units');
				Log('sourceCalcVar.selUnit() = ');
				Log(sourceCalcVar.selUnit());
				Log('destinationCalcVar.selUnit = ');
				Log(destinationCalcVar.selUnit());
			// Make it equal to the source variables selected unit
				return sourceCalcVar.selUnit();
			},
			this);
	}

	// Registers a calculator so that the bindings will be applied when the page is 
	// loaded. 
	this.registerCalc = function(viewModel, htmlId)
	{
		// Start-up function
		jQuery(document).ready(
			function StartUp()
			{	  		
				console.log(viewModel);
				// Activates knockout.js for a particular HTML object only	
				ko.applyBindings(new viewModel, document.getElementById(htmlId));	
			}
		);
	}
	
	// "Class" for a calc variable
	this.input = function(app, validatorFn, units, selUnit) {
		this.dispVal = ko.observable();
		this.units = ko.observableArray(units);
		this.selUnit = ko.observable(this.units()[selUnit]);
		
		// Scaled value, taking into account the units
		this.val = ko.computed( function(){
			return this.dispVal()*this.selUnit().multiplier;
		},
		this);

		// Holds all validator functions
		this.validatorA = ko.observableArray();
		
		this.trigIndex = ko.observable();
		
		// Default is to just return true.
		this.isValid = ko.computed(
			function()
			{
				Log('Computing isValid for input.');
				Log('Validator array length = ' + this.validatorA().length);
				for (var i = 0; i < this.validatorA().length; i++) {
					if(this.validatorA()[i].fn(this.validatorA()[i].app) == false)
					{
						// Remember the validator which returned false
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
		
		this.AddValidator = function(validatorEnum, severity)
		{
			switch(validatorEnum)
			{
				case cc.validatorEnum.IS_NUMBER:
					Log('Adding IS_NUMBER validator.');
					this.validatorA.push(
						new cc.validator(
							this,
							'Value must be a number!',
							function(variable)
							{
								Log('Testing ' + variable.val());
								return jQuery.isNumeric(variable.val());
							}, 
							severity)
					);
					break;
				//case default:
					//console.log('Enum not recognised.');
			}
		}
		
		this.AddCustomValidator = function(app, msg, fn, severity)
		{
			// Create new validator object and add to the end of the array
			Log('Adding new custom validator.');
			this.validatorA.push(new cc.validator(app, msg, fn, severity));
		}
		
		
   }; // this.input
	
	this.output = function(app, compFn, validatorFn, units, selUnit, roundTo) {
			
		this.units = ko.observableArray(units);
		this.selUnit = ko.observable(this.units()[selUnit]);
		
		this.val = ko.computed(compFn, app);
		
		// Number of decimal places to round value to
		if(roundTo != null)
			this.roundTo = roundTo;
		else
			this.roundTo = 1;
		
		// This is the displayed value
		this.dispVal = ko.computed(function(){
				var unroundedVal = this.val()/this.selUnit().multiplier;
				// Round the value
				var roundedVal = Math.round(unroundedVal*Math.pow(10, this.roundTo))/Math.pow(10, this.roundTo);
				//var roundedVal = this.val();
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
				Log('Computing isValid for output.');
				Log('Validator array length = ' + this.validatorA().length);
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
		this.AddCustomValidator = function(app, msg, fn)
		{
			// Create new validator object and add to the end of the array
			this.validatorA.push(new validator(app, msg, fn));
		}
				
	};
	
	this.variable = function(app, eqFn, validatorFn, units, selUnit, roundTo, stateFn)
	{
			
		// Available units for this variable	
		this.units = ko.observableArray(units);
		
		// The selected unit for this variable
		this.selUnit = ko.observable(this.units()[selUnit]);
		
		// This value "shadows" the .val variable. Needed when variable maybe an input or an output
		this.shadowVal = ko.observable();
		
		this.app = app;		
				
		// This determines whether the variable is an input or an output
		this.state = ko.computed(stateFn, app);
		
		// Build the computed function up from the provided compFn, and internal stuff to make it able
		// to be both an input or an output
		
		// The actual value for this variable. This is always in SI without any unit postfix.
		// (e.g. V, Hz, never mV, kHz or MHz)
		this.val = ko.computed({
			read: function () {
				if(this.state() == cc.stateEnum.output)
				{
					console.log('Calculating variable and writing to shadow variable.');
					// Calculate the value based on the provided
					// equation
					var value = eqFn.call(app);
					this.shadowVal(value)
					return value ;
				}
				else
				{
					console.log('Reading from shadow variable.');
					return this.shadowVal();
				}
			},
			write: function (value) {
				console.log('Writing to shadow variable');
				this.shadowVal(value);
			},
			owner: this
		});
		
		// Number of decimal places to round value to
		if(roundTo != null)
			this.roundTo = roundTo;
		else
			this.roundTo = 1;
		
		// This is the displayed value
		this.dispVal = ko.computed(
			function(){
				console.log(this);
				var unroundedVal = this.val()/this.selUnit().multiplier;
				// Round the value
				var roundedVal = Math.round(unroundedVal*Math.pow(10, this.roundTo))/Math.pow(10, this.roundTo);
				//var roundedVal = this.val();
				return roundedVal;
			},
			this
		);				
		
		this.lowerBound = 0; //ko.observable(lowerBound);
		this.upperBound = 0; //ko.observable(upperBound);

		// Holds all validator functions
		this.validatorA = ko.observableArray();
		
		this.trigIndex = ko.observable();
		
		// Default is to just return true.
		this.isValid = ko.computed(
			function()
			{
				Log('Computing isValid for output.');
				Log('Validator array length = ' + this.validatorA().length);
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
		this.AddCustomValidator = function(app, msg, fn)
		{
			// Create new validator object and add to the end of the array
			this.validatorA.push(new validator(app, msg, fn));
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
				
				// Call value binding (child binding)
				ko.bindingHandlers.value.init(
					element,
					function (){ return valueAccessor().dispVal } ,
					allBindings,
					viewModel,
					bindingContext);
				  
				// Create Opentip (tooltip) for input box
				Log('Initialising calculator variable handlers');			
								
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
						// jQuery(element).qtip('disable', false);
						// Note that the only way I have found to successfully replace the tooltip text is
						// to create an entirely new object. This is not the ideal method!
						
							
						// Since validator returned false, add notValid class for CSS to render red
						if(valueAccessor().validatorA()[valueAccessor().trigIndex()].severity == cc.severityEnum.warning)
						{
							jQuery(element).removeClass('error'); 
							jQuery(element).addClass('warning'); 	
							
							jQuery(element).qtip({
								content: {
									// Grab the text shown the the triggered validator object
									text: valueAccessor().validatorA()[valueAccessor().trigIndex()].msg,
									title: 'Warning!'
								},
								style: {
									classes: 'qtip-orange qtip-rounded qtip-shadow'
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
						}							
						else if(valueAccessor().validatorA()[valueAccessor().trigIndex()].severity == cc.severityEnum.error)
						{
							jQuery(element).removeClass("warning");
							jQuery(element).addClass('error'); 
							
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
						}
					}
					else // Validator returned true, value passed this test
					{
						Log('Removing notValid class and disabling tooltip.');
						// Remove notValid class to make green again
						jQuery(element).removeClass("warning");
						jQuery(element).removeClass("error");
						// Disable tooltip which showed any errors
						//jQuery(element).qtip('disable', true);
						jQuery(element).qtip('destroy',true)
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



