![futils Logo](/logo.jpg?raw=true, 'futils Logo')

**A collection of tools for functional programming in JavaScript** 

[![NPM](https://nodei.co/npm/futils.png)](https://nodei.co/npm/futils/)

[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)
[![dependencies](https://david-dm.org/urbandrone/futils.svg)](https://david-dm.org/urbandrone/futils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# About
futils is a small (around 10 Kilobytes when minimized and gzipped) library for generic functional programming in javascript. It is divided into several namespaces which you can see below:

| Package    | Namespace     | Description                                                                                    |
|------------|---------------|------------------------------------------------------------------------------------------------|
| Trampoline | `.trampoline` | Useful to create tail recursive functions in a not tail recursive language.                    |
| Operation  | `.operation`  | Functions that allow to operate with various data structures in a Point-Free form.             |
| Lambda     | `.lambda`     | Contains helpers for working with functions, like `curry`, `flip` and `compose`.               |
| ADT        | `.adt`        | Allows easy creation of algebraic single and union data types.                                 |
| Generics   | `.generics`   | Building blocks for new data structures which can derive generic methods.                      |
| Monoid     | `.monoid`     | A collection of some of the most common monoidal structures like `Sum` and `All`.              |
| Data       | `.data`       | Pre-made data structures. All of these implement various interface contracts (typeclasses).    |
| Optic      | `.optic`      | van Laarhoven based lenses for `Object` and `Array` structures.                                |

# Documentation
Find the complete documentation as well as a quickstart [online](https://urbandrone.github.io/futils/).

# Download
The library can be loaded either by downloading it from [NPM](https://www.npmjs.com/package/futils), by getting it from a [CDN](https://unpkg.com/futils@latest) or by downloading it from [Github](https://raw.githubusercontent.com/urbandrone/futils/master/dist/futils.js).

| Source     | Snippet                                                                  |
| -----------|--------------------------------------------------------------------------|
| **NPM**    | `npm i futils`                                                           |
| **CDN**    | `<script src="https://unpkg.com/futils@latest"></script>`                |
| **Github** | `<script src="local/path/to/futils.js"></script>`                        |

---
*License*: MIT  
*NPM*: https://npmjs.org/package/futils  
*GitHub*: https://github.com/urbandrone/futils