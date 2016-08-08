# Getting started
This is a step-by-step tutorial on how to install and use the `futils` toolset. The examples are written for writing a Node based application but are good enough to serve the general purpose, even if you use the toolkit in another environment. To get more information about how to install for a specific environment, please visit the projects [main readme](../readme.md).

## Step 1: Check your Node and NPM version
To use this package, you should have installed Node V6.3.1 or above. You can check the current version you are running:
```
$ node -v
v6.3.1
```

After that, also check your NPM version. It should be V3.7.1 or higher:
```
$ npm -v
3.7.1
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
const {map, pipe, exec, given, isString} = require('futils');

let messages = [
    {from: 'Marc', text: 'nice match yesterday!'},
    {from: 'Jenny', text: 'hey there, how are you doing?'}
];

const format = (msg) => `${msg.from} has written: ${msg.text}`;
const printOut = given(isString, console.log.bind(console));

const formatPrint = pipe(map(format), exec('join', '\n'), printOut);

formatPrint(messages);
```

This will print the following to the console:
```
Marc has written: nice match yesterday!
Jenny has written: hey there, how are you doing?
```

---
[Index](./readme.md)






