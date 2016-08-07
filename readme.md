# futils
##### A toolkit for functional programming

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
After installation you can access the functions by importing `futils`. How you access the `futils` package depends on your environment. Currently there is only support for NodeJS, but supporting AMD as well as Browsers and ES6 Modules is planned.
```
const {given, isString, pipe, exec} = require('futils');

const myFunc = given(isString, pipe('toUpperCase'), exec('split', '.'));

myFunc('hello.world'); // -> ['HELLO', 'WORLD']
```

## Documentation
Coming soon

## Example
Coming soon

## Information
*License*: MIT  
*Author*: D. Hofmann <the.urban.drone@gmail.com>  
*NPM*: https://npmjs.org/package/futils  
*GitHub*: https://github.com/urbandrone/futils