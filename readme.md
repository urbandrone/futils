# futils
##### A toolkit for functional programming in JavaScript. 

## Requirements
*Node*: `6.3.1 or higher`

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)

## Install
Global installation
```
npm install futils -g
```

Local installation
```
npm install futils --save-dev
```

## Usage
After installation you can access the functions by importing `futils`. How you access the `futils` package depends on your environment. Currently there is only support for NodeJS and ES6 Modules via [jspm.io](http://jspm.io/), but supporting AMD as well as Browsers is planned.

### NodeJS 6.3.1+
```
const {given, isString, pipe, exec} = require('futils');

const myFunc = given(isString, pipe(exec('toUpperCase'), exec('split', '.')));

myFunc('hello.world'); // -> ['HELLO', 'WORLD']
```

### ES6 (via jspm.io and SystemJS)
```
import {given, isString, pipe, exec} from 'futils';

const myFunc = given(isString, pipe(exec('toUpperCase'), exec('split', '.')));

myFunc('hello.world'); // -> ['HELLO', 'WORLD']
```

### Browser
```
Coming soon
```

### AMD
```
Coming soon
```

## Documentation
You can find the online documentation for `futils` here:
[Online API Docs](http://www.der-davi.de/futils/docs/0.9.1/index.html)

The documentation for `futils` can by generated like this:
```
cd path/to/futils/
npm run docs
```

The generated documentation is placed under `node_modules/futils/docs/` if you installed `futils` locally

## Examples
Coming soon

## Information
*License*: MIT  
*Author*: D. Hofmann <the.urban.drone@gmail.com>  
*NPM*: https://npmjs.org/package/futils  
*GitHub*: https://github.com/urbandrone/futils