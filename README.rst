==========
candy-calc
==========

-----------------------------------------------------------------------------------
A framework for creating powerful and beautiful client-side Javascript calculators.
-----------------------------------------------------------------------------------

.. image:: https://api.travis-ci.org/gbmhunter/candy-calc.png?branch=master   
	:target: https://travis-ci.org/gbmhunter/candy-calc

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.cladlab.com)
- Created: 2013/11/11
- Last Modified: 2014/02/18
- Version: v7.4.0.0
- Company: CladLabs
- Language: HTML/JS/PHP
- Compiler: n/a
- uC Model: n/a
- Computer Architecture: n/a
- Operating System: n/a
- Documentation Format: n/a
- License: GPLv3

Description
===========

candy-calc can be used to easily create good looking calculators that run inside a browser (purely on the client-side).

Features:
	- Support for inputs (user-entered variables) and outputs (calculated variables)
	- Support for toggle-happy variables which can be both inputs and outputs
	- Support for selectable units (e.g. mV, V, kV) and automatic scaling
	- Built in validators to check consistency of inputs and outputs
	- Ability to add custom validators to both inputs and outputs (e.g. this y must be > x + 2) 
	- Inline tooltip support for warnings/errors to inform the user about what is wrong
	- MathJax support for pretty browser-compatible equations (which can be written using Latex notation)
	- Configurable CSS file to customise the look to suit your application
	- Behind-the-scenes binding (candy-calc implements the MVVM model using knockout.js), so you don't have to worry about event handlers
	- You can run more than one calculator inside a web page.
	- Dependencies are downloaded via CDN to increase page load times

Built-in Validators
-------------------
========== ====================
Name       Description
========== ====================
IS_NUMERIC Returns true is number is a numeral, otherwise false. Follows jQuery.isNumeric().
========== ====================

Dependencies
============

Internal
--------

========================= =============================== ===================================================================
Dependency                Path                            Usage
========================= =============================== ===================================================================
jStorage                  ./lib/jStorage                  To save calculator states (e.g. variable values, selected units) to the users computer.
knockout-deferred-updates ./lib/knockout-deferred-updates To access the dependency tree for checking dependencies are valid before calculation.
knockout-postbox          ./lib/knockout-postbox          To use subscribe/publish features so you can synchronize variable units.
========================= =============================== ===================================================================

External
--------

============== =============== ===================================================================
Dependency     Delivery        Usage
============== =============== ===================================================================
MathJax_       MathJax CDN     Latex rendering of equations.
`knockout.js`_ CDN             Used for it's MVVM framework and binding capabilities.
qTip_          CDN             Tooltip library for information on input/output warnings/errors. 
============== =============== ===================================================================

.. _MathJax: http://www.mathjax.org/
.. _knockout.js: http://knockoutjs.com/
.. _qTip: http://craigsworks.com/projects/qtip/

Issues
======

See GitHub Issues.

Limitations
===========

None documented.

Usage
=====

This repo is designed so that you can clone it directly (using SSH) into a web servers ``public_html`` folder (or any sub-folder).
	
Changelog
=========

========= ========== ==============================================================================================
Version   Date       Comment
========= ========== ==============================================================================================
v7.4.0.0  2014/02/18 Added QUnit CSS file, for better styling when unit tests are run manually, closes #42.
v7.3.0.0  2014/02/18 Added unit test for checking that the 'calcWhat' radio buttons work correctly, closes #41.
v7.2.0.0  2014/02/18 Added TravisCI 'Build Passing' image to README, closes #39. Added 'candy-calc' to README title, closes #40.
v7.1.0.0  2014/02/17 'Basic Multiplication Test' is now implemented correctly.
v7.0.7.0  2014/02/17 Removed unneeded info and invalid php in test.html.
v7.0.6.0  2014/02/17 Added 'http' qualifier before qTip javascript and css inclusions, so it works when candy-calc is run locally without a server. QTest loads up 'basic-addition-test', which hasn't been fully implemented yet.
v7.0.5.0  2014/02/17 Deleted unused test files. One basic unit test working (but not related to candy-calc), closes #38.
v7.0.4.0  2014/02/17 Renamed test.php to test.html to see if it will fix failing unit tests.
v7.0.3.0  2014/02/17 Added run-qunit.js file for running QUnit tests (file copied from PhantomJs examples).
v7.0.2.0  2014/02/17 Added QUnit tests.
v7.0.1.0  2014/02/17 PhantomJs should now print 'Hello World' (for testing).
v7.0.0.0  2014/02/17 Added beginnings of unit tests. Commit to test if TravisCI works properly with files in ./test/ folder.
v6.2.1.0  2014/02/17 Input boxes now have fixed border colours to help differentiate them from outputs, closes #35. ok class is assigned to input/output boxes that have valid data, closes #37.
v6.2.0.0  2013/12/08 'cc.variable()' now accepts and single object literal, makes candy-calc easier to use, closes 34#.
v6.1.3.0  2013/12/08 Made ./lib/ locations fixed to cladlab.com.
v6.1.2.0  2013/12/08 Attempt to fix Javascript src errors to ./lib/ locations when running from website.
v6.1.1.0  2013/12/08 qTip colours now match input boxes better, and warning text easier to read, closes #25.
v6.1.0.1  2013/12/08 Following changes apply to the README: Added internal dependency section, added jStorage, knockout-postbox and knockout-deferred-updates to list of internal dependencies.
v6.1.0.0  2013/12/08 Implemented the postbox API for syncing units together. The `cc.linkUnits()` API has changed so that you provide a unit and a keyword together. This allows you link as many units as you want together.
v6.0.0.0  2013/12/08 Added 'knockout-postbox' library as git submodule into './lib/knockout-postbox'. This will be used to sync 'ko.observables' and 'ko.computed()' values with each other.
v5.1.3.0  2013/12/07 Fixed infinite recursion issue with `linkUnits()` function, required unit array for both variables to be the same object.
v5.1.2.0  2013/12/04 Fixed bug where output variable was not being updated correctly.
v5.1.0.0  2013/12/03 Added dependency checking using the knockout-deferred-updates library. This library causes the 'Standard Resistance Finder' calculator in 'Js-EngCalcs' to freeze the browser. Will fix this issue.
v5.0.0.0  2013/12/03 Added the knockout-deferred-updates library as a submodule in ``./lib/``. This is primarily for getting access to the observable dependency tree, so that dependencies can be checked (and not in the compute function) before doing an actual calculation.
v4.1.0.0  2013/12/02 ``cc.variable()`` now displays '' (blank) if underlying value is ``NaN``. This fixes the issue where it was displaying ``NaN`` if any dependencies are blank (i.e. on start-up), but it does produce the problem where NaN is not displayed if 0/0 occurs (which is a legitimate issue), closes #33.
v4.0.2.0  2013/11/29 Fixed bug where displayed value was being rounded differently depending on whether it was an input or an output, closes #31.
v4.0.1.0  2013/11/29 Fixed issue with variables values changing wrongly when 'non 1.0' units where selected and the calculated variable was changed, closes #30.
v4.0.0.0  2013/11/25 Added jStorage library as git submodule into ``/lib/jStorage``. This is going to be used to store (for remembering) calculator variables on the user's device.
v3.2.1.0  2013/11/26 Removed ``console.log(viewModel)`` from ``cc.RegisterCalc()`` as it was causing issues when running on web server.
v3.2.0.1  2013/11/24 Attempt to fix rendering of Changelog in README.
v3.2.0.0  2013/11/24 Added rounding and unit support for the all-in-one ``cc.variable``. Renamed ``variable.shadowVal`` to ``variable.val`` and ``variable.val`` to ``variable.dispVal``, as the old ``dispVal`` was now redundant.
v3.1.0.0  2013/11/24 Basic all-in-one variable support working with ``cc.variable``. Uses shadow variables and separate read/write functions to achieve selectable input/output support. Added relevant info to README.
v3.0.0.0  2013/11/23 Working on support for variables which can be both inputs and outputs (depending on say, whether a radio button is selected). This is to get the Ohms Law calculator working correctly.
v2.3.1.0  2013/11/22 Moved ``unit`` and ``validator`` objects to inside the ``cc`` object. Closes #8, closes #9.
v2.3.0.0  2013/11/22 Added support for multiple calculators to run on the same page, using the ``cc.registerCalc()`` API. Closes #21.
v2.2.0.0  2013/11/21 Added linkUnits() function. Closes #20, although it doesn't work correctly yet.
v2.1.2.4  2013/11/21 Fix didn't work, reverting to old external link style (no new window).
v2.1.2.3  2013/11/21 Attempt to fix broken README links.
v2.1.2.2  2013/11/21 Made external README links open a new window. Fixes #18.
v2.1.2.1  2013/11/21 Added information to README about tooltip support. Tabulated the external dependencies in the README and added qTip. Added external links to dependencies. Closes #11, closes #16, closes #17.
v2.1.2.0  2013/11/21 Made sure no debug messages are printed when debug = false. Tooltip now displays 'Warning' title when severity is warning. Background colour of warning tooltip is now orange. Closes #15, closes #14, closes #12.
v2.1.1.0  2013/11/20 Deleted some commented code.
v2.1.0.0  2013/11/18 Added support for validator severity levels. Add CSS to colour warnings and errors differently.
v2.0.1.0  2013/11/18 Fixed bug where stuff like '2z' was not being detected as 'not a numeral' because of parseFloat function calls. Added info to built-in validator IS_NUMERAL and features section to README.
v2.0.0.0  2013/11/18 Added support for pre-defined validators (AddValidator()). Custom validators now called with AddCustomValidator(). qTip is destroyed when non-longer needed to prevent qTips remaining visible when they shouldn't be.
v1.1.0.0  2013/11/18 Tidied up code, added comments where appropriate. Moved calculator functions into cc 'namespace'. calcInput became cc.input and renamed calcComp object to cc.output.
v1.0.2.0  2013/11/14 candy-calc now loads jQuery if it has not already been loaded. Fixed some code indenting issues. All debug messages now get turned off if debug is set to false. Moved knockout, MathJax, qTip includes into candy-calc.js rather than making the user include these manually.
v1.0.1.0  2013/11/14 Gave the calculator outputs a smaller border and made them black (used to be white).
v1.0.0.0  2013/11/14 Core Javascript code added (in folder /js/), basic calculator functionality works.
v0.2.0.0  2013/11/12 Added more CSS to style the candy-calc tables. Centered all columns except the description column. Made the input box smaller. Made the table width a percentage of the parent element rather than a fixed pixel width.
v0.1.0.0  2013/11/11 Initial commit. Repo currently only has CSS file and simple README, calculator engine has not been added yet.
========= ========== ==============================================================================================