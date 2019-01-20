<div class="readme_logo">![futils Logo](media/logo.jpg?raw=true, 'futils Logo')</div>
<div class="icon icon--whale1" id="topwhale"></div>

[![Current NPM version](https://badge.fury.io/js/futils.svg)](https://badge.fury.io/js/futils)
[![Build Status](https://travis-ci.org/urbandrone/futils.svg?branch=master)](https://travis-ci.org/urbandrone/futils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



# What this is all about
The futils library is designed to allow you to incorporate various aspects of _functional programming_ techniques into your JavaScript code. It ships basic building blocks as well as advanced data structures and also the tools to create your own ones. It allows you to use _tacit programming_ with functional composition, partial application and other function(al) operations. Or maybe you want to express the intend of your code with custom data types and to work with powerful data structures like `Either`, `Task` and `IO`. 

If that doesn't convince you to give it a go, here's an example that should spark your imagination. This is some code for the [SCUMM](https://en.wikipedia.org/wiki/SCUMM) engine, which [Ron Gilbert](https://en.wikipedia.org/wiki/Ron_Gilbert) has shown in 2011:

```
cut-scene {
    ...
    actor nurse-edna in-room edna-bedroom at 60,20
    camera-follow nurse-edna
    actor nurse-edna walk-to 30,20
    wait-for-actor nurse-edna
    say-line nurse-edna "WHATS'S YOUR POINT ED!!!"
    wait-for-talking nurse-edna
    ...
}
```

It's a beautiful little piece of _declarative_ code. And it's quite easy to understand, right? The first line says it's a "cut-scene", the curly brackets denote everything inside it as part of a block (or group), and each line in the block reads like an instruction. futils tries to give you the tools at hand you need to write your day-to-day JavaScript code with equal expressive power. Get rid of those messy `if` statements, `for` loops and clutter and instead develop and use a beautiful API you've build almost alongside your application.

#### Further readings:
It is recommended to have a basic understanding about what functional programming in JavaScript looks like and how it is done. In case you have little experience with it, these should get you going:
- [A Gentle Introduction to Functional JavaScript Style](https://jrsinclair.com/articles/2016/gentle-introduction-to-functional-javascript-style/)
- [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://github.com/MostlyAdequate/mostly-adequate-guide)
  _Note: `chain` is `flatMap` in futils_
- [Fantas, eel and specification](http://www.tomharding.me/fantasy-land/)
  _Note: `chain` is `flatMap` in futils_
- [Monads in JavaScript](https://curiosity-driven.org/monads-in-javascript)
  _Note: `unit` is the type constructor and `bind` is `flatMap` in futils_

<div class="grid grid--1of6">
    <div class="icon icon--whale2"></div>

> **Why is `flatMap` chosen over `bind` or `chain`?**
> Mostly in favor to have a unified interface with the native `Array.prototype.flatMap` and `Array.prototype.flat` methods. Read more about it:
> [`Array.prototype.flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap),
> [`Array.prototype.flat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat),
> [EcmaScript Proposal](https://github.com/tc39/proposal-flatMap). Not only does it cause less friction when reading your code, it also makes
> porting function compositions easier because it frees you from having to distinguish your functions based on the fact that they either utilize
> `chain` when working with monads, or `flatMap` when working with arrays.
</div>



# Download
The library can be loaded either by downloading it from [NPM](https://www.npmjs.com/package/futils), by getting it from a [CDN](https://unpkg.com/futils@latest) or by downloading it from [Github](https://raw.githubusercontent.com/urbandrone/futils/master/dist/futils.js).

| Source     | Snippet                                                                  |
| -----------|--------------------------------------------------------------------------|
| **NPM**    | `npm i futils`                                                           |
| **CDN**    | `<script src="https://unpkg.com/futils@latest"></script>`                |
| **Github** | `<script src="local/path/to/futils.js"></script>`                        |

## Requirements
futils requires a few things to be available to function properly. First of all, it needs to have `Symbol` support. In case you are unsure if the target platform provides it, use a shim from the list below. The same goes for `Promise` ans `Object.assign`. Also check out:
- [ES6 compat table: `Promise`](http://kangax.github.io/compat-table/es6/#test-Promise)
- [ES6 compat table: `Symbols`](http://kangax.github.io/compat-table/es6/#test-Symbol)
- [ES6 compat table: `Object.assign`](http://kangax.github.io/compat-table/es6/#test-Object_static_methods)

#### Shims:
You can use either of these shims if needed:
- core-js (**recommended**): [Github](https://github.com/zloirock/core-js) | [CDN](https://unpkg.com/core-js-bundle@3.0.0-beta.9/minified.js)
- es6-shim: [Github](https://github.com/paulmillr/es6-shim) | [CDN](https://cdnjs.com/libraries/es6-shim)



# Quickstart
Start with this [quickstart tutorial]{@tutorial Quickstart-Basic} if you haven't used futils before. Otherwise, have fun exploring the other tutorials or reading the docs for interesting functionality!