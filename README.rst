=======================================================================================
A framework for creating powerful and beautiful client-side Javascript calculators.
=======================================================================================

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.cladlab.com)
- Created: 2013/11/11
- Last Modified: 2013/11/22
- Version: v2.3.0.0
- Company: CladLabs	.
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

External Dependencies
=====================

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

========= ========== ============================================================================================================
Version   Date       Comment
========= ========== ============================================================================================================
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
========= ========== ============================================================================================================