=======================================================================================
A framework for creating powerful and beautiful client-side Javascript calculators.
=======================================================================================

- Author: gbmhunter <gbmhunter@gmail.com> (http://www.cladlab.com)
- Created: 2013/11/11
- Last Modified: 2013/11/18
- Version: v1.1.0.0
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

External Dependencies
=====================

MathJax (delivered through MathJax CDN) for latex rendering of equations.

knockout.js (delivered through CDN) for MVVM framework.

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
v1.1.0.0  2013/11/18 Tidied up code, added comments where appropriate. Moved calculator functions into cc 'namespace'. calcInput became cc.input and renamed calcComp object to cc.output.
v1.0.2.0  2013/11/14 candy-calc now loads jQuery if it has not already been loaded. Fixed some code indenting issues. All debug messages now get turned off if debug is set to false. Moved knockout, MathJax, qTip includes into candy-calc.js rather than making the user include these manually.
v1.0.1.0  2013/11/14 Gave the calculator outputs a smaller border and made them black (used to be white).
v1.0.0.0  2013/11/14 Core Javascript code added (in folder /js/), basic calculator functionality works.
v0.2.0.0  2013/11/12 Added more CSS to style the candy-calc tables. Centered all columns except the description column. Made the input box smaller. Made the table width a percentage of the parent element rather than a fixed pixel width.
v0.1.0.0  2013/11/11 Initial commit. Repo currently only has CSS file and simple README, calculator engine has not been added yet.
========= ========== ============================================================================================================