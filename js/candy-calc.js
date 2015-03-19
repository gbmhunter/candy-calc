//
// @file 			candy-calc.js
// @author 			Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
// @edited 			n/a
// @date 			2013-11-01
// @last-modified	2015-03-18
// @brief 			Binding/calculating code for candy-calc.
// @details
//		See the README in the repo root dir for more info.

// Debug flag. Set to true to print debug information, otherwise false.
var DEBUG = false;

// Load jQuery if not already loaded	
window.jQuery || document.write('<script src="http://code.jquery.com/jquery-latest.min.js"><\/script>');

// Load knockout for binding functionality
document.write('<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js"></script>');

// Load knockout plugin "knockout-deferred-updates"
document.write('<script type="text/javascript" src="/lib/knockout-deferred-updates/knockout-deferred-updates.js"></script>');

// Load knockout plugin "knockout-postbox"
document.write('<script type="text/javascript" src="/lib/knockout-postbox/src/knockout-postbox.js"></script>');

// MathJax for Latex rendering
document.write('<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>');

// Load qTip

// CSS file
document.write('<link type="text/css" rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.1/jquery.qtip.min.css" />');
// JS. Include either the minifed or production version, not both
document.write('<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.1/jquery.qtip.min.js"></script>');


// Candy-calc "namespace"
// All candy-calc framework should be inside this
var cc = new function()
{
	// Enumeration of pre-defined validators
	this.validatorEnum = {
		'IS_NUMBER' 			: 1,
		'IS_POSITIVE_OR_ZERO' 	: 2,
		'IS_NEGATIVE_OR_ZERO' 	: 3
	}
	
	//! @brief		Enumeration of severity levels for validators. Severity level
	//! 			determines background colour of variable.
	this.severityEnum = {
		'warning' 				: 1,
		'error' 				: 2
	}
	
	//! @brief		Used to determine whether variable is an input or an output
	this.stateEnum = {
		'input'					: 1,
		'output'					: 2
	}
	
	//! @brief		Calculator unit object
	this.unit = function(name, multiplier) {
			  this.name = name;
			  this.multiplier = multiplier;
	};
	
	//! @brief		"Class" for validator object, which holds both a message and validator function.
	this.validator = function(app, msg, fn, severity)
	{
		this.app = app;
		this.msg = msg;
		this.fn = fn;	
		this.severity = severity;
	}
	
	// This function is used to link units together. topic is a 
	// specific keyword.
	this.linkUnits = function(calcVar, topic)
	{		
		// Uses the postbox plugin to register with a topic
		calcVar.selUnit.syncWith(topic);
	}
	
	//calcVar2.dispSelUnit.syncWith('units');

	// Registers a calculator so that the bindings will be applied when the page is 
	// loaded. 
	this.registerCalc = function(viewModel, htmlId)
	{
		// Start-up function
		jQuery(document).ready(
			function StartUp()
			{	  		
				// Activates knockout.js for a particular HTML object only	
				ko.applyBindings(new viewModel, document.getElementById(htmlId));	
			}
		);
	}
	
	//! @brief		"Class" for a calcultor input variable.
	this.input = function(app, validatorFn, units, selUnit) {

		//! @brief		The displayed value for the variable
		this.dispVal = ko.observable();

		//! @biref		Array of the available units for the variable.
		this.units = ko.observableArray(units);

		//! @brief		The currently selected unit for the array of available units.
		this.selUnit = ko.observable(this.units()[selUnit]);
		
		//! @brief		Hidded, actual and scaled value, taking into account the units.
		this.val = ko.computed( function(){
			return this.dispVal()*this.selUnit().multiplier;
			},
			this);

		//! @brief		Holds all validator functions.
		this.validatorA = ko.observableArray();
		
		this.trigIndex = ko.observable();
		
		//! @brief		Runs through all the validator functions
		//! @details	Default is to just return true.
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
				// (or there were no validator functions)
				Log('Returning true.');
				return true;
			},
			this
		);
		
		//========================= Methods =========================//
	
		//! @brief		Call this to add a validator for the variable.
		//! @details
		//! @param	validatorEnum	The type of validator you are adding.
		//! @param	severity 		The severity of the validator.
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
	
	//! @brief		"Class" for a calcultor output variable.
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
	
	//! @brief		This can act as both an input and an output.
	//! @param		obj Contains all the setup data.
	//!					obj.name 	The name of the variable, used for debugging purposes only.
	//!					obj.units 	The available units for the variable.
	this.variable = function(obj)
	{
			
		//! @brief		Save the name for debugging purposes
		this.name = obj.name;

		//========= UNITS =========//
			
		//! @brief		Available units for this variable. This does not need 2 seperate values.
		this.units = ko.observableArray(obj.units);
		
		//! @brief		The selected unit for this variable
		this.selUnit = ko.observable(this.units()[obj.selUnitNum]);
		
		// This value is the actual value, stored in the background. dispVal is what the
		// user sees. This is always in SI without any unit postfix.
		// (e.g. V, Hz, never mV, kHz or MHz)
		this.val = ko.observable();
		
		this.app = obj.app;		
				
		// This determines whether the variable is an input or an output
		this.state = ko.computed(obj.stateFn, obj.app);
		
		// This is the value that the user sees. It modifies the actual value, variable.val, 
		// which is kept in the background
		this.dispVal = ko.computed({
			read: function () {

				Log('variable.dispVal.read() called for ' + this.name + '.');

				if(this.state() == cc.stateEnum.output)
				{					
					

					Log('Calculating and writing to underlying variable.');
					// Calculate the value based on the provided
					// equation
					var value = obj.eqFn.call(obj.app);
					
					// Storing
					Log('Storing "' + value + '" in this.val.');
					this.val(value);
					
					
					// Scale value
					value = value/this.selUnit().multiplier
					
					// Now round it
					value = Math.round(value*Math.pow(10, this.roundTo))/Math.pow(10, this.roundTo);
					
					// If this variable hasn't been initialised yet, return blank
					if(this.dispVal == null)
					{
						return '';
					}
					else
					{
						// Make sure dependencies are valid
						for(x = 0; x < this.dispVal.getDependencies().length; x++)
						{
							depVar = this.dispVal.getDependencies()[x]();
							
							if((typeof depVar == 'undefined'))
							{
								Log('A value is still blank!');
								return '';
							}
							if((isNaN(depVar)) && (typeof depVar == 'number'))
							{
								Log('Thing is NaN and not an object!');
								return '';
							}
						}
						
						// If code reaches here then all dependencies are valid
						return value;
					}
				}
				else
				{
					Log('Reading from underlying variable ("' + this.val() + '").');
					
					var value = this.val();

					// We need to check so see whether it is a valid number
					if(!isNaN(value) && !(value == ''))
					{
						Log('Value is a valid number.');
									// Scale it
						value = value/this.selUnit().multiplier
						
						// Now round it
						value = Math.round(value*Math.pow(10, this.roundTo))/Math.pow(10, this.roundTo);
						
						if(isNaN(value))
							return '';
						else
							return value;
					}
					else
					{
						// Value is NaN, so just write it directly
						Log('value is NaN, so returning value directly.');					
						return value;
					}
					
				}
			},
			write: function (value) {
				Log('variable.dispVal.write() called for ' + this.name + '.');
				Log('value = ' + value);

				// We need to check so see whether it is a valid number or empty!
				if(!isNaN(value) && !(value == ''))
				{
					Log('Writing ' + value*this.selUnit().multiplier + ' to underlying variable');
					this.val(value*this.selUnit().multiplier);
				}
				else
				{
					// Value is NaN, so just write it directly
					Log('value is NaN or empty, so writing value directly to underlying variable.');					
					this.val(value);
				}
			},
			owner: this
		}); // this.dispVal = ko.computed({
		
		// Number of decimal places to round value to
		if(obj.roundTo != null)
			this.roundTo = obj.roundTo;
		else
			this.roundTo = 1;		
		
		this.lowerBound = 0; //ko.observable(lowerBound);
		this.upperBound = 0; //ko.observable(upperBound);

		// Holds all validator functions
		this.validatorA = ko.observableArray();
		
		this.trigIndex = ko.observable();
		
		// Default is to just return true.
		this.isValid = ko.computed(
			function()
			{
				Log('variable.isValid() called for ' + this.name + '.');
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
				
		//========================= METHODS =========================

		//! @brief		Call this to add a validator for the variable.
		//! @details
		//! @param	validatorEnum	The type of validator you are adding.
		//! @param	severity 		The severity of the validator.
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

		//! @brief		Adds a custom validator to the calculator variable.
		this.AddCustomValidator = function(app, msg, fn, severity)
		{
			// Create new validator object and add to the end of the array
			this.validatorA.push(new cc.validator(app, msg, fn, severity));
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
				ko.bindingHandlers.value.update(
					element,
					function (){ return valueAccessor().dispVal },
					allBindings,
					viewModel,
					bindingContext);
				  						
				  	Log('ko.bindingHandlers.calcVar.update() called for ' + valueAccessor().name + '.');

					if(valueAccessor().isValid() == false) // Validator returned false, value did not pass this test
					{
						Log('Activating tooltip.');
						// jQuery(element).qtip('disable', false);
						// Note that the only way I have found to successfully replace the tooltip text is
						// to create an entirely new object. This is not the ideal method!
						
							
						// Since validator returned false, add notValid class for CSS to render red
						if(valueAccessor().validatorA()[valueAccessor().trigIndex()].severity == cc.severityEnum.warning)
						{
							Log('Severity == cc.severityEnum.warning.');
							jQuery(element).removeClass("ok");
							jQuery(element).removeClass('error'); 
							jQuery(element).addClass('warning'); 	
							
							jQuery(element).qtip({
								content: {
									// Grab the text shown the the triggered validator object
									text: valueAccessor().validatorA()[valueAccessor().trigIndex()].msg,
									title: 'Warning!'
								},
								style: {
									 classes: 'qTipWarning qtip-rounded qtip-shadow',								   
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
						} // if(valueAccessor().validatorA()[valueAccessor().trigIndex()].severity == cc.severityEnum.warning)						
						else if(valueAccessor().validatorA()[valueAccessor().trigIndex()].severity == cc.severityEnum.error)
						{
							Log('Severity == cc.severityEnum.error.');
							jQuery(element).removeClass("warning");
							jQuery(element).removeClass("ok");
							jQuery(element).addClass('error'); 
							
							jQuery(element).qtip({
								content: {
									// Grab the text shown the the triggered validator object
									text: valueAccessor().validatorA()[valueAccessor().trigIndex()].msg,
									title: 'Error!'
								},
								style: {
									classes: 'qTipError qtip-rounded qtip-shadow'
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
							}); // jQuery(element).qtip({
						} // else if(valueAccessor().validatorA()[valueAccessor().trigIndex()].severity == cc.severityEnum.error)
						else
						{
							Log('ERROR: Severity not valid!');
						}
					} // if(valueAccessor().isValid() == false) 
					else // Validator returned true, value passed this test
					{
						Log('Removing notValid class and disabling tooltip1.');
						// Remove notValid class to make green again
						jQuery(element).removeClass("warning");
						jQuery(element).removeClass("error");
						jQuery(element).addClass("ok");
						// Disable tooltip which showed any errors
						//jQuery(element).qtip('disable', true);
						jQuery(element).qtip('destroy',true)
					} // else
					
			 }
		};
		
		/*
		jQuery.fn.qtip.styles.warningStyle = { // Last part is the name of the style
		   width: 200,
		   background: '#A2D959',
		   color: 'orange',
		   textAlign: 'center',
		   border: {
		      width: 7,
		      radius: 5,
		      color: '#A2D959'
		   },
		   tip: 'bottomLeft',
		   name: 'dark' // Inherit the rest of the attributes from the preset dark style
		}
		*/
	}
);

//! @brief		Logs error messages.
//! @details	Error messages can be turned on and off by setting DEBUG.
function Log(msg)
{
	// Only print if DEBUG variable has been set to true
	if(DEBUG == true)
		console.log(msg);
}



