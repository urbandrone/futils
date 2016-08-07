# futils
##### A toolkit for functional programming in JavaScript. 

## Requirements
*Node*: `6.3.1 or higher`

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
The documentation for `futils` is generated with JSDoc and can be found here:

## Examples
Coming soon

## Information
*License*: MIT  
*Author*: D. Hofmann <the.urban.drone@gmail.com>  
*NPM*: https://npmjs.org/package/futils  
*GitHub*: https://github.com/urbandrone/futils