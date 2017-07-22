# Getting started
This is a step-by-step tutorial on how to install and use the `futils` toolset. The examples are written for writing a Node based application but are good enough to serve the general purpose, even if you use the toolkit in another environment. To get more information about how to install for a specific environment, please visit the projects [main readme](../readme.md).

## Step 1: Check your Node version
To use this package you must have installed Node V4 or higher. You can check the current version you are running:
```
$ node -v
v6.3.1
```

## Step 2: Download and install the package from NPM
If your version of node and NPM are fine, you can either download and install the package globally or locally. If you do not need to install `futils` globally, you should use a local version per project. This example assumes you use a local copy.

First create a project folder and `cd` into it:
```
$ mkdir my-project
$ cd my-project
```

Create a `package.json` file (either by hand or by typing `npm init`) and install futils:
```
$ npm install futils --save-dev
```
Depending on your OS, you might have to run the command as `sudo`.

## Step 3: Using the package
As written above, futils is a collection of utility functions for various aspects of functional programming. To help you get a better understanding of what futils provides you, here is a first quick look:

```javascript
const {curry, pipe} = require('futils');

// -- Info
// -- This file contains functions to parse a simple string as a given
// -- pattern and then apply it against a date to get a date string from
// -- the date for different locales

/*
type DateInfo = { d :: Int, m :: Int, y :: Int }
*/

// today :: () -> Date
const today = () => new Date();

// _parseDate :: Date -> DateInfo
const _parseDate = (date) => {
	const d = date.getDate();
	const m = date.getMonth() + 1;
	const y = date.getFullYear();
	return {d, m, y};
}

// _parsePattern :: String -> DateInfo -> String
const _parsePattern = curry((p, date) => {
	return p.
		replace(/d/g, date.d < 10 ? `0${date.d}` : date.d).
		replace(/m/g, date.d < 10 ? `0${date.m}` : date.m).
		replace(/y/g, date.y);
});

// formatUSDates :: Date -> String
const formatUSDates = pipe(_parseDate, _parsePattern('m/d/y'));
const formatENDates = pipe(_parseDate, _parsePattern('d/m/y'));
const formatDEDates = pipe(_parseDate, _parsePattern('d.m.y'));

// -- demo
console.log('US', formatUSDates(today()));
console.log('EN', formatENDates(today()));
console.log('DE', formatDEDates(today()));
```

This will print the following to the console:
```
'US' '07/22/2017'
'EN' '22/07/2017'
'DE' '22.07.2017'
```

---
[Index](./readme.md)






