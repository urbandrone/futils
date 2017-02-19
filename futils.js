// futils -- https://www.npmjs.com/package/futils
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.futils = factory());
}(this, (function () { 'use strict';

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Provides the aritize function
 * @module futils/arity
 */

var isFn = function isFn(f) {
    return typeof f === 'function';
};

/**
 * Takes a number and a function with a variadic number of arguments and returns
 *     a function which takes as much arguments as specified
 * @method 
 * @version 0.8.0
 * @param {number} n Integer value describing the arity
 * @param {function} f The function to aritize
 * @return {function} A wrapper for f with a arity of n
 *
 * @example
 * const {aritize} = require('futils');
 *
 * const sum = (x, ...xs) => xs.reduce((a, b) => a + b, x);
 * sum(1, 2, 3); // -> 6
 *
 * const addTwo = aritize(2, sum);
 * addTwo(1, 2, 3); // -> 3
 */
var aritize$1 = function aritize$1(n, f) {
    var len = n,
        args = [],
        wrap = null;
    if (f.length >= len) {
        return f;
    }
    while (len > 0) {
        args.push('arg' + len--);
    }
    wrap = 'return (' + args.join(',') + ') => fx(' + args.join(',') + ')';
    return new Function('fx', wrap)(f);
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 1
 * @method
 * @version 0.4.0
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {monadic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
 *
 * monadic(all)(1, 2, 3, 4); // -> [1]
 */
var monadic$1 = function monadic$1(f) {
    if (isFn(f)) {
        return function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : void 0;

            if (x === void 0) {
                return monadic$1(f);
            }
            return f(x);
        };
    }
    throw 'decorators::monadic awaits a function but saw ' + f;
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 2
 * @method
 * @version 0.4.0
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {dyadic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
 *
 * const just2 = dyadic(all);
 * just2(1, 2, 3, 4); // -> [1, 2]
 */
var dyadic$1 = function dyadic$1(f) {
    if (isFn(f)) {
        return function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : void 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;

            if (x === void 0) {
                return dyadic$1(f);
            }
            if (y === void 0) {
                return monadic$1(function (_y) {
                    return f(x, _y);
                });
            }
            return f(x, y);
        };
    }
    throw 'decorators::dyadic awaits a function but saw ' + f;
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 3
 * @method
 * @version 0.4.0
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {triadic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
 *
 * const just3 = triadic(all);
 * just3(1, 2, 3, 4); // -> [1, 2, 3]
 */
var triadic$1 = function triadic$1(f) {
    if (isFn(f)) {
        return function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : void 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;
            var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : void 0;

            if (x === void 0) {
                return triadic$1(f);
            }
            if (y === void 0) {
                return dyadic$1(function (_y, _z) {
                    return f(x, _y, _z);
                });
            }
            if (z === void 0) {
                return monadic$1(function (_z) {
                    return f(x, y, _z);
                });
            }
            return f(x, y, z);
        };
    }
    throw 'decorators::triadic awaits a function but saw ' + f;
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 4
 * @method
 * @version 0.4.0
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {tetradic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4, 5); // -> [1, 2, 3, 4, 5]
 *
 * const just4 = tetradic(all);
 * just4(1, 2, 3, 4, 5); // -> [1, 2, 3, 4]
 */
var tetradic$1 = function tetradic$1(f) {
    if (isFn(f)) {
        return function () {
            var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : void 0;
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : void 0;
            var z = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : void 0;

            if (w === void 0) {
                return tetradic$1(f);
            }
            if (x === void 0) {
                return triadic$1(function (_x, _y, _z) {
                    return f(w, _x, _y, _z);
                });
            }
            if (y === void 0) {
                return dyadic$1(function (_y, _z) {
                    return f(w, x, _y, _z);
                });
            }
            if (z === void 0) {
                return monadic$1(function (_z) {
                    return f(w, x, y, _z);
                });
            }
            return f(w, x, y, z);
        };
    }
    throw 'decorators::tetradic awaits a function but saw ' + f;
};

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * A collection of type checking utility functions to determine the type of a
 *     variable at runtime
 * @module futils/types
 */

/**
 * Returns true if given either `null` or `undefined`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True or false
 *
 * @example
 * const {isNil} = require('futils');
 *
 * isNil(null); // -> true
 * isNil(''); // -> false
 */
var isNil$1 = function isNil$1(x) {
  return x === null || x === void 0;
};

/**
 * Returns true if given anything but `null` or `undefined`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True or false
 *
 * @example
 * const {isAny} = require('futils');
 *
 * isAny(null); // -> false
 * isAny(''); // -> true
 */
var isAny$1 = function isAny$1(x) {
  return !isNil$1(x);
};

/**
 * Returns true if given `undefined`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for `undefined`
 *
 * @example
 * const {isVoid} = require('futils');
 *
 * isVoid(null); // -> false
 * isVoid(undefined); // -> true
 */
var isVoid$1 = function isVoid$1(x) {
  return x === undefined;
};

/**
 * Returns true if given `null`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for `null`
 *
 * @example
 * const {isNull} = require('futils');
 *
 * isNull(null); // -> true
 * isNull(undefined); // -> false
 */
var isNull$1 = function isNull$1(x) {
  return x === null;
};

/**
 * Returns true if given a string
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for strings
 *
 * @example
 * const {isString} = require('futils');
 *
 * isString('Hello world'); // -> true
 * isString(null); // -> false
 */
var isString$1 = function isString$1(x) {
  return typeof x === 'string';
};

/**
 * Returns true if given a number. Returns false if given `NaN` or `Infinity`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for number values
 *
 * @example
 * const {isNumber} = require('futils');
 *
 * isNumber(1); // -> true
 * isNumber('1'); // -> false
 * isNumber(NaN); // -> false
 */
var isNumber$1 = function isNumber$1(x) {
  return typeof x === 'number' && !isNaN(x) && isFinite(x);
};

/**
 * Returns true if given a integer
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for integers
 *
 * @example
 * const {isInt} = require('futils');
 *
 * isInt(1); // -> true
 * isInt(1.1); // -> false
 */
var isInt$1 = function isInt$1(x) {
  return isNumber$1(x) && x % 1 === 0;
};

/**
 * Returns true if given a floating point number
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for floating point numbers
 *
 * @example
 * const {isFloat} = require('futils');
 *
 * isFloat(1); // -> false
 * isFloat(1.1); // -> true
 */
var isFloat$1 = function isFloat$1(x) {
  return isNumber$1(x) && x % 1 !== 0;
};

/**
 * Returns true if given a boolean value
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for boolean values
 *
 * @example
 * const {isBool} = require('futils');
 *
 * isBool(false); // -> true
 * isBool('false'); // -> false
 */
var isBool$1 = function isBool$1(x) {
  return typeof x === 'boolean';
};

/**
 * Returns true for any value which evaluates to true
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for all truthy values
 *
 * @example
 * const {isTrue} = require('futils');
 *
 * isTrue(true); // -> true
 * isTrue(null); // -> false
 */
var isTrue$1 = function isTrue$1(x) {
  return !!x;
};

/**
 * Returns true for any value which evaluates to false
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for all falsy values
 *
 * @example
 * const {isFalse} = require('futils');
 *
 * isFalse(true); // -> false
 * isFalse(null); // -> true
 */
var isFalse$1 = function isFalse$1(x) {
  return !x;
};

/**
 * Returns true if given functions
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for functions
 *
 * @example
 * const {isFunc} = require('futils');
 *
 * isFunc(() => null); // -> true
 * isFunc(null); // -> false
 */
var isFunc$1 = function isFunc$1(x) {
  return typeof x === 'function';
};

/**
 * Returns true if given plain objects
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for object
 *
 * @example
 * const {isObject} = require('futils');
 *
 * isObject({}); // -> true
 * isObject([]); // -> false
 */
var isObject$1 = function isObject$1(x) {
  return {}.toString.call(x) === '[object Object]';
};

/**
 * Returns true if given a array
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for arrays
 *
 * @example
 * const {isArray} = require('futils');
 *
 * isArray([]); // -> true
 * isArray({}); // -> false
 */
var isArray$1 = function isArray$1(x) {
  return Array.isArray(x);
};

/**
 * Returns true if given a `Date` instance
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for `Date` instances
 *
 * @example
 * const {isDate} = require('futils');
 *
 * isDate(new Date()); // -> true
 * isDate('2016-05-01'); // -> false
 */
var isDate$1 = function isDate$1(x) {
  return Date.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a `RegExp` instance
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for regular expressions
 *
 * @example
 * const {isRegex} = require('futils');
 *
 * isRegex(/.+/g); // -> true
 * isRegex('/.+/g'); // -> false
 */
var isRegex$1 = function isRegex$1(x) {
  return RegExp.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a single DOM node
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for DOM nodes
 *
 * @example
 * const {isNode} = require('futils');
 *
 * isNode(document.body); // -> true
 * isNode(null); // -> false
 */
var isNode$1 = function isNode$1(x) {
  return Node.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a Nodelist
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for Nodelists
 *
 * @example
 * const {isNodeList} = require('futils');
 *
 * isNodeList(document.querySelectorAll('body')); // -> true
 * isNodeList([document.body]); // -> false
 */
var isNodeList$1 = function isNodeList$1(x) {
  return NodeList.prototype.isPrototypeOf(x);
};









/**
 * Returns true if given a promise
 * @method
 * @version 0.1.0
 * @param {any} x The value to check
 * @return {boolean} True for promises
 *
 * @example
 * const {isPromise} = require('futils');
 *
 * isPromise(new Promise( ... )); // -> true
 * isPromise({then() { ... }}); // ->true
 * isPromise({}); // -> false
 */
var isPromise$1 = function isPromise$1(x) {
  return Promise.prototype.isPrototypeOf(x) || x && isFunc$1(x.then);
};

/**
 * Returns true if given a iterator
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for iterators
 *
 * @example
 * const {isIterator} = require('futils');
 *
 * var ns = [1, 2, 3];
 * isIterator(ns[Symbol.iterator]()); // -> true
 */
var isIterator$1 = function isIterator$1(x) {
  return !isNil$1(x) && isFunc$1(x.next);
};

/**
 * Returns true for all iterables which implement `Symbol.iterator`
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for iterables
 *
 * @example
 * const {isIterable} = require('futils');
 *
 * isIterable([1, 2, 3]); // -> true
 * isIterable({}); // -> false
 */
var isIterable$1 = function isIterable$1(x) {
  return !isNil$1(x) && !!(x[Symbol.iterator] || !isNaN(x.length));
};

/**
 * Awaits a type predicate and a value and returns true if the value is a array
 *     and only contains items which pass the predicate
 * @method
 * @version 0.3.0
 * @param {function} f The predicate
 * @param {any} x Value to check
 * @return {boolean} True if array of items which pass f
 *
 * @example
 * const {isArrayOf, isString} = require('futils');
 *
 * var pass = ['Hello', 'World'],
 *     fail = [1, 'World'];
 *
 * const isStrArray = isArrayOf(isString);
 *
 * isStrArray(pass); // -> true
 * isStrArray(fail); // -> false
 */
var isArrayOf$1 = function isArrayOf$1(f, x) {
  if (x === void 0) {
    return function (_x) {
      return isArrayOf$1(f, _x);
    };
  }
  return Array.isArray(x) && x.every(f);
};

/**
 * Awaits a type predicate and a value and returns true if the value is a object
 *     and only contains values which pass the predicate
 * @method
 * @version 0.3.0
 * @param {function} f The predicate
 * @param {any} x Value to check
 * @return {boolean} True if object of values which pass f
 *
 * @example
 * const {isObjectOf, isString} = require('futils');
 *
 * var pass = {greet: 'Hello', subject: 'World'},
 *     fail = {greet: 1, subject: 'World'};
 *
 * const isStrObject = isObjectOf(isString);
 *
 * isStrObject(pass); // -> true
 * isStrObject(fail); // -> false
 */
var isObjectOf$1 = function isObjectOf$1(f, x) {
  if (x === void 0) {
    return function (_x) {
      return isObjectOf$1(f, _x);
    };
  }

  if (isObject$1(x)) {
    for (var _key in x) {
      if (x.hasOwnProperty(_key) && !f(x[_key])) {
        return false;
      }
    }
    return true;
  }
  return false;
};

/**
 * Returns true if given a setoid (something that implements `equals`)
 * @method 
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a setoid, false otherwise
 *
 * @example
 * const {isSetoid} = require('futils');
 *
 * const makeSetoid = (x) => ({
 *     equals(b) {}
 * });
 * 
 * isSetoid(makeSetoid(10)); // -> true
 */
var isSetoid$1 = function isSetoid$1(x) {
  return !!x && isFunc$1(x.equals);
};

/**
 * Returns true if given a functor (something that implements `map`)
 * @method 
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a functor, false otherwise
 *
 * @example
 * const {isFunctor} = require('futils');
 * 
 * isFunctor([]); // -> true
 */
var isFunctor$1 = function isFunctor$1(x) {
  return !!x && isFunc$1(x.map);
};

/**
 * Returns true if given a apply (something that implements `ap`)
 * @method 
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a apply, false otherwise
 *
 * @example
 * const {isApply} = require('futils');
 *
 * const makeApply = (x) => ({
 *     ap(f) {}
 * });
 * 
 * isApply(makeApply(10)); // -> true
 */
var isApply$1 = function isApply$1(x) {
  return !!x && isFunc$1(x.ap);
};

/**
 * Returns true if given a foldable (something that implements `fold`)
 * @method 
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a foldable, false otherwise
 *
 * @example
 * const {isFoldable} = require('futils');
 *
 * const makeFoldable = (x) => ({
 *     fold (f, g) {}
 * });
 * 
 * isFoldable(makeFoldable(10)); // -> true
 */
var isFoldable$1 = function isFoldable$1(x) {
  return !!x && isFunc$1(x.fold);
};

/**
 * Returns true if given a bifunctor (something that implements `biMap`)
 * @method
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a bifunctor, false otherwise
 *
 * @example
 * const {isBifunctor} = require('futils');
 *
 * const makeBifunctor = (x) => ({
 *     biMap(f, g) {}
 * });
 *
 * isBifunctor(makeBifunctor(1)); // -> true
 */
var isBifunctor$1 = function isBifunctor$1(x) {
  return !!x && isFunc$1(x.biMap);
};

/**
 * Returns true if given a semigroup (something that implements `concat`)
 * @method
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a semigroup, false otherwise
 *
 * @example
 * const {isSemigroup} = require('futils');
 *
 * isSemigroup([]); // -> true
 */
var isSemigroup$1 = function isSemigroup$1(x) {
  return !!x && isFunc$1(x.concat);
};

/**
 * Returns true if given a monoid (something that implements `concat` and `empty`)
 * @method
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a monoid
 *
 * @example
 * const {isMonoid} = require('futils');
 *
 * isMonoid([]); // -> true
 */


/**
 * Returns true if given a applicative (something that implements `ap` and `of`)
 * @method 
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a applicative, false otherwise
 *
 * @example
 * const {isApplicative} = require('futils');
 *
 * const makeApplicative = (x) => ({
 *     of(a) {}
 *     ap(f) {}
 * });
 * 
 * isApplicative(makeApplicative(10)); // -> true
 */
var isApplicative$1 = function isApplicative$1(x) {
  return isApply$1(x) && (isFunc$1(x.of) || isFunc$1(x.constructor.of));
};

/**
 * Returns true if given a monad (something that implements `equals`,
 *     `map`, `flatten` and `flatMap`)
 * @method 
 * @version 2.0.0
 * @param {any} x Value to check
 * @return {boolean} True if given a monad, false otherwise
 *
 * @example
 * const {isMonad} = require('futils');
 *
 * const makeMonad = (x) => ({
 *     equals(y) {},
 *     map(f) {},
 *     flatten() {},
 *     flatMap(f) {}
 * });
 * 
 * isMonad(makeMonad(10)); // -> true
 */
var isMonad$1 = function isMonad$1(x) {
  return isFunctor$1(x) && isSetoid$1(x) && isFunc$1(x.flatten) && isFunc$1(x.flatMap);
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set$2 = function set$2(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$2(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Provides functional trampolines
 * @module futils/trampolines
 */
var SUSPENDED = Symbol('SuspendedInvocation');

/**
 * Suspends the invocation of a function. Usually this is used in conjunction
 *     with trampolines
 * @method 
 * @version 2.2.0
 * @param {function} f The function to suspend
 * @param {any} [args*] Optional args to partially apply on the next invocation
 * @return {Suspended} A suspended invocation
 */
var suspend$1 = function suspend$1(f) {
    var _ref;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return _ref = {}, defineProperty(_ref, SUSPENDED, true), defineProperty(_ref, 'run', function run() {
        return f.apply(undefined, args);
    }), _ref;
};

var isSuspended = function isSuspended(a) {
    return isObject$1(a) && isFunc$1(a.run) && a[SUSPENDED];
};

/**
 * Wraps a tail recursive function into a tramponline which executes it savely
 *     as soon as it is called without growing the stack. Any arguments passed
 *     to the trampoline are used to create the seed value from the passed in
 *     function
 * @method 
 * @version 2.2.0
 * @param {function} f) The function to wrap in a trampoline
 * @return {function} A trampolined function
 *
 * @example
 * const {trampoline} = require('futils');
 *
 * const factorial = trampoline((n, m = 1) => {
 *     // note that we have the base case first which terminates the
 *     //   computation and if it does not hit, we return a suspended
 *     //   invocation with 'suspend(...)'
 *     return n <= 1 ? m : suspend(factorial, n - 1, n * m);
 * });
 *
 * // let the magic happen (oh, and you need BigInt support of course...)
 * console.log(factorial(25000));
 */
var trampoline$1 = function trampoline$1(f) {
    if (isFunc$1(f)) {
        return aritize$1(f.length, function () {
            var result = f.apply(undefined, arguments);
            while (isSuspended(result)) {
                result = result.run();
            }
            return result;
        });
    }
    throw 'trampoline :: expected argument to be function but saw ' + f;
};

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * A collection of higher order helpers for functional composition
 * @module futils/combinators
 * @requires futils/types
 * @requires futils/arity
 */

/**
 * The identity, id or I combinator
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {any} Returns x
 */
var id$1 = function id$1(x) {
    return x;
};

/**
 * The getter or K combinator (kestrel in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {anx} x Anything
 * @return {function} A getter of x
 */
var getter$1 = function getter$1(x) {
    return function () {
        return x;
    };
};

/**
 * The tap or T combinator (thrush in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {function} Function awaiting a function to tap with
 *
 * @example
 * const {tap, isNumber} = require('futils');
 * 
 * const sqr = (n) => n * n;
 * 
 * const saveSqr = tap(sqr)((op) => {
 *     return (_n) => {
 *         return isNumber(_n) ? op(_n) : _n;
 *     }
 * });
 */
var tap$1 = function tap$1(x) {
    return function (y) {
        return y(x);
    };
};

/**
 * Takes 2 functions and an arbitrary number of parameters, then calls the
 *     second function over each parameter and calls the first function with
 *     the result
 * @method
 * @version 2.3.0
 * @param {function} x Function which returns the final result
 * @param {function} y Function to map over
 * @param {any} ...zs Parameters
 * @return {any} Final result
 *
 * @example
 * const {by, equals, field} = require('futils');
 *
 * const eqLength = by(equals, field('length'));
 *
 * eqLength('hi', 'cu'); // -> true
 * eqLength('hi', 'bye'); // -> false
 */
var by$1 = function by$1(x, y) {
    for (var _len = arguments.length, zs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        zs[_key - 2] = arguments[_key];
    }

    if (y === void 0) {
        return function (y) {
            for (var _len2 = arguments.length, _zs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                _zs[_key2 - 1] = arguments[_key2];
            }

            return by$1.apply(undefined, [x, y].concat(_zs));
        };
    }
    return zs.length > 0 ? x.apply(undefined, toConsumableArray(zs.map(y))) : function () {
        for (var _len3 = arguments.length, _zs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            _zs[_key3] = arguments[_key3];
        }

        return x.apply(undefined, toConsumableArray(_zs.map(y)));
    };
};

/**
 * Composes 2 up to N function together into one. `pipe` allows function
 *     composition from left to right instead of right to left. Use the `compose`
 *     function if you want the opposite behaviour
 * @method
 * @version 0.4.0
 * @param {function} ...fs 2 up to N functions
 * @return {function} Composition of the given functions
 *
 * @example
 * const {pipe} = require('futils');
 *
 * const add1 = (n) => n + 1;
 * const mult2 = (n) => n * 2;
 *
 * const mult2Add1 = pipe(mult2, add1);
 *
 * add1(mult2(2)) === mult2Add1(2);
 * // -> true
 */
var pipe$1 = function pipe$1(f) {
    for (var _len4 = arguments.length, fs = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        fs[_key4 - 1] = arguments[_key4];
    }

    if (isFunc$1(f) && isArrayOf$1(isFunc$1, fs)) {
        return aritize$1(f.length, function () {
            return fs.reduce(function (v, g) {
                return g(v);
            }, f.apply(undefined, arguments));
        });
    }
    throw 'combinators::pipe awaits functions but saw ' + [f].concat(fs);
};

/**
 * Composes 2 up to N functions together into one. `compose` composes the
 *     given functions from right to left instead of from left to right. Use
 *     the `pipe` function if you want to opposite behaviour
 * @method
 * @version 0.4.0
 * @param {function} ...fs 2 up to N functions
 * @return {function} Composition of the given functions
 *
 * @example
 * const {compose} = require('futils');
 *
 * const add1 = (n) => n + 1;
 * const mult2 = (n) => n * 2;
 *
 * const mult2Add1 = compose(add1, mult2);
 *
 * add1(mult2(2)) === mult2Add1(2);
 * // -> true
 */
var compose$1 = function compose$1() {
    for (var _len5 = arguments.length, fs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        fs[_key5] = arguments[_key5];
    }

    if (isArrayOf$1(isFunc$1, fs)) {
        return pipe$1.apply(undefined, toConsumableArray(fs.reverse()));
    }
    throw 'combinators::compose awaits functions but saw ' + fs;
};

/**
 * Composes 2 up to N predicate functions into one. The returned predicate only
 *     returns true if all the composed predicates return true
 * @method 
 * @version 0.4.0
 * @param {function} ...fs 2 up to N predicates to compose
 * @return {function} Composed predicate function
 *
 * @example
 * const {and} = require('futils');
 *
 * const isStr = (s) => typeof s === 'string';
 * const hasAt = (s) => s.includes('@');
 *
 * const smellsLikeMail = and(isStr, hasAt);
 */
var and$1 = function and$1() {
    for (var _len6 = arguments.length, fs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        fs[_key6] = arguments[_key6];
    }

    if (isArrayOf$1(isFunc$1, fs)) {
        return aritize$1(fs[0].length, function () {
            for (var _len7 = arguments.length, xs = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                xs[_key7] = arguments[_key7];
            }

            return !fs.some(function (f) {
                return !f.apply(undefined, xs);
            });
        });
    }
    throw 'combinators::and awaits functions but saw ' + fs;
};

/**
 * Composes 2 up to N predicates into one. The returned predicate returns true
 *     as long as one of the given predicate functions evaluates to true
 * @method 
 * @version 0.4.0
 * @param {function} ...fs 2 up to N predicates to compose
 * @return {function} Composed predicate function
 *
 * @example
 * const {or} = require('futils');
 *
 * const isStr = (s) => typeof s === 'string';
 * const isNum = (n) => !isNaN(n);
 *
 * const strOrNum = or(isStr, isNum);
 */
var or$1 = function or$1() {
    for (var _len8 = arguments.length, fs = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        fs[_key8] = arguments[_key8];
    }

    if (isArrayOf$1(isFunc$1, fs)) {
        return aritize$1(fs[0].length, function () {
            for (var _len9 = arguments.length, xs = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                xs[_key9] = arguments[_key9];
            }

            return fs.some(function (f) {
                return !!f.apply(undefined, xs);
            });
        });
    }
    throw 'combinators::or awaits functions but saw ' + fs;
};

/**
 * Also known as the Y combinator from lambda calculus. Takes a function `f` and
 *     returns a function `g` which represents the fixed-point of `f`. Allows to
 *     implement recursive anonymous functions without recursion or iteration
 * @method
 * @version 2.3.0
 * @param {function} f The function to calculate the fixed-point of
 * @return {function} The fixed-point of f
 *
 * @example
 * const {fixed} = require('futils');
 *
 * const factorial = fixed((fact) => (n) => n < 1 ? 1 : n * fact(n - 1));
 *
 * factorial(6); // -> 720 (6 * 5 * 4 * 3 * 2 * 1)
 */
var fixed$1 = function fixed$1(f) {
    if (isFunc$1(f)) {
        return function (g) {
            return g(g);
        }(function (h) {
            return f(function () {
                return h(h).apply(undefined, arguments);
            });
        });
    }
    throw 'combinators::fixed awaits function but saw ' + f;
};

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * A collection of function decorator functions. Please note that these are not
 *     the same as the proposed ES7 object and method decorators
 * @module futils/decorators
 * @requires futils/types
 * @requires futils/arity
 */

/**
 * Takes a function and returns a variant of it which will only executed once
 * @method
 * @version 0.5.0
 * @param {function} f The function to wrap
 * @return {function} A wrapped function
 *
 * @example
 * const {once} = require('futils');
 *
 * var N = 0;
 * const inc = () => N += 1;
 *
 * const incOnce = once(inc);
 *
 * inc();
 * inc();
 * inc();
 * N; // -> 3
 *
 * incOnce();
 * incOnce();
 * incOnce();
 * N; // -> 4
 */
var once$1 = function once$1(f) {
    var called = 0;
    if (isFunc$1(f)) {
        return aritize$1(f.length, function () {
            if (called === 0) {
                called = 1;
                return f.apply(undefined, arguments);
            }
            return null;
        });
    }
    throw 'decorators::once awaits a function but saw ' + f;
};

/**
 * Takes a predicate function and returns the invariant of it
 * @method
 * @version 0.4.0
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {not} = require('futils');
 *
 * const lower1 = (n) => n < 1;
 * const greater1 = not(lower1);
 *
 * lower1(0); // -> true
 * greater1(2); // -> true
 */
var not$1 = function not$1(f) {
    if (isFunc$1(f)) {
        return aritize$1(f.length, function () {
            return !f.apply(undefined, arguments);
        });
    }
    throw 'decorators::not awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant which calls the original function with
 * the arguments reversed
 * @method
 * @version 0.4.0
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {flip} = require('futils');
 *
 * const divideWith = (a, b) => a / b;
 * const divideWithR = flip(divideWith);
 *
 * divideWith(2, 4); // -> 2
 * divideWithR(2, 4); // -> 0.5
 */
var flip$1 = function flip$1(f) {
    if (isFunc$1(f)) {
        return aritize$1(f.length, function () {
            for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
                xs[_key] = arguments[_key];
            }

            return f.apply(undefined, toConsumableArray(xs.reverse()));
        });
    }
    throw 'decorators::flip awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant of it, which consecutevly consumes
 *     more arguments until enough parameters are given to execute the given
 *     function
 * @method
 * @version 0.4.0
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {curry} = require('futils');
 *
 * const greet = (greeting, who) => greeting + ' ' + who + '!';
 * const cGreet = curry(greet);
 *
 * greet('Hello', 'World'); // -> 'Hello World!'
 * greet('Hello'); // -> 'Hello undefined!'
 *
 * cGreet('Hello', 'World'); // -> 'Hello World!'
 * cGreet('Hello'); // -> function
 * 
 * const greetHello = cGreet('Hello');
 * greetHello('World'); // -> 'Hello World!'
 */
var curry$1 = function curry$1(f) {
    if (isFunc$1(f)) {
        if (f.length < 2) {
            return f;
        }
        return function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (f.length <= args.length) {
                return f.apply(undefined, args);
            }
            return function () {
                for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    rest[_key3] = arguments[_key3];
                }

                return curry$1(f).apply(undefined, args.concat(rest));
            };
        };
    }
    throw 'decorators::curry awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant of it, which consecutevly consumes
 *     more arguments until enough parameters are given to execute the given
 *     function. On execution, reverses the arguments given
 * @method
 * @version 0.4.0
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {curryRight} = require('futils');
 *
 * const greet = (greeting, who) => greeting + ' ' + who + '!';
 * const cGreet = curryRight(greet);
 *
 * greet('Hello', 'World'); // -> 'Hello World!'
 * greet('Hello'); // -> 'Hello undefined!'
 *
 * cGreet('Hello', 'World'); // -> 'World Hello!'
 * cGreet('World'); // -> function
 * 
 * const toTheWorld = cGreet('World');
 * toTheWorld('Hello'); // -> 'Hello World!'
 */
var curryRight$1 = function curryRight$1(f) {
    if (isFunc$1(f)) {
        if (f.length < 2) {
            return f;
        }
        return function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            if (f.length <= args.length) {
                return f.apply(undefined, toConsumableArray(args.reverse()));
            }
            return function () {
                for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    rest[_key5] = arguments[_key5];
                }

                return curry$1(f).apply(undefined, args.concat(rest));
            };
        };
    }
    throw 'decorators::curryRight awaits a function but saw ' + f;
};

/**
 * Takes a function and optional parameters to prefill the function with. One
 *     can use `undefined` to skip parameters while presetting, which will be
 *     seen as a placeholder. Accumulates the later given parameters to the left
 *     of the arguments list
 * @method
 * @version 0.4.0
 * @param {function} f The function to partially apply
 * @param {any} ...pargs Parameters to preset
 * @return {function} The wrapped function
 *
 * @example
 * const {partial} = require('futils');
 *
 * const add = (a, b) => a + b;
 * const pAdd = partial(add, undefined, 1);
 *
 * add(1, 2); // -> 3
 * pAdd(2); // -> 3
 */
var partial$1 = function partial$1(f) {
    for (var _len6 = arguments.length, pargs = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        pargs[_key6 - 1] = arguments[_key6];
    }

    var _ps = pargs;
    if (isFunc$1(f)) {
        while (_ps.length < f.length) {
            _ps.push(void 0);
        }
        return function () {
            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
            }

            var _as = _ps.map(function (a) {
                return isVoid$1(a) ? args.shift() : a;
            });
            if (_as.lastIndexOf(void 0) < 0) {
                return f.apply(undefined, toConsumableArray(_as));
            }
            return partial$1.apply(undefined, [f].concat(toConsumableArray(_as)));
        };
    }
    throw 'decorators::partial awaits a function but saw ' + f;
};

/**
 * Takes a function and optional parameters to prefill the function with. One
 *     can use `undefined` to skip parameters while presetting, which will be
 *     seen as a placeholder. Accumulates the later given parameters to the right
 *     of the arguments list
 * @method
 * @version 0.4.0
 * @param {function} f The function to partially apply
 * @param {any} ...pargs Parameters to preset
 * @return {function} The wrapped function
 *
 * @example
 * const {partialRight} = require('futils');
 *
 * const add = (a, b) => a + b;
 * const pAdd = partialRight(add, 1);
 *
 * add(1, 2); // -> 3
 * pAdd(2); // -> 3
 */
var partialRight$1 = function partialRight$1(f) {
    for (var _len8 = arguments.length, pargs = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        pargs[_key8 - 1] = arguments[_key8];
    }

    var _ps = pargs;
    if (isFunc$1(f)) {
        while (_ps.length < f.length) {
            _ps.push(void 0);
        }
        return function () {
            for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                args[_key9] = arguments[_key9];
            }

            var _as = _ps.map(function (a) {
                return isVoid$1(a) ? args.shift() : a;
            });
            if (_as.lastIndexOf(void 0) < 0) {
                return f.apply(undefined, toConsumableArray(_as.reverse()));
            }
            return partial$1.apply(undefined, [f].concat(toConsumableArray(_as)));
        };
    }
    throw 'decorators::partialRight awaits a function but saw ' + f;
};

/**
 * Takes a predicate function and a continuation function and returns a function
 *     which only executes the continuation if the predicate succeeds. Given a
 *     optional failure function, the `given` function allows to model `if` and
 *     `if-else` expressions
 * @method
 * @version 0.5.0
 * @param {function} p A predicate
 * @param {function} t A continuation
 * @param {function} [f] A failure
 * @return {function} A wrapped function
 *
 * @example
 * const {given, isString} = require('futils');
 *
 * const greet = given(
 *     isString,
 *     (subject) => `Hello ${subject}`,
 *     () => 'Need a string!'
 * );
 *
 * greet('World'); // -> Hello World
 * greet(null); // -> Need a string!
 */
var given$1 = function given$1(p) {
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;
    var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : void 0;

    if (t === void 0) {
        return function (_t, _f) {
            return given$1(p, _t, _f);
        };
    }

    if (isFunc$1(p) && isFunc$1(t)) {
        if (isFunc$1(f)) {
            return aritize$1(t.length, function () {
                return !!p.apply(undefined, arguments) ? t.apply(undefined, arguments) : f.apply(undefined, arguments);
            });
        }
        return aritize$1(t.length, function () {
            return !!p.apply(undefined, arguments) ? t.apply(undefined, arguments) : null;
        });
    }
    throw 'decorators::given awaits (fn, fn fn?), but saw ' + [p, t, f];
};

/**
 * Takes a function and returns a variant of it, which only executes the given
 *     function once for the given arguments. If the returned function is
 *     called with some arguments it already received, the computation is skipped
 *     and the previously calculated result is returned
 * @method
 * @version 0.4.0
 * @param {function} f The function to memoize
 * @return {function} A memoized function
 *
 * @example
 * const {memoize} = require('futils');
 *
 * const complexCalculation = memoize(( ... ) => { ... });
 */
var memoize$1 = function memoize$1(f) {
    var cached = {};
    if (isFunc$1(f)) {
        return aritize$1(f.length, function () {
            for (var _len10 = arguments.length, xs = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                xs[_key10] = arguments[_key10];
            }

            var k = JSON.stringify(xs);
            if (!cached.hasOwnProperty(k)) {
                cached[k] = f.apply(undefined, xs);
            }
            return cached[k];
        });
    }
    throw 'decorators::memoize awaits a function but saw ' + f;
};

/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * A collection of operator functions to work on data structures
 * @module futils/operators
 * @requires futils/types
 * @requires futils/arity
 */

var _owns = Object.prototype.hasOwnProperty;

/**
 * Allows to predefine a method invocation
 * @method
 * @version 0.2.0
 * @param {string|function} method Name of a method or a function
 * @param {any} [partials] Presetted arguments
 * @return {function} Function awaiting a instance
 *
 * @example
 * const {call} = require('futils');
 *
 * const upper = call('toUpperCase');
 * upper('hello world'); // -> 'HELLO WORLD'
 *
 * const firstHalf = call('slice', 0, 5);
 * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
var call$1 = function call$1(method) {
    for (var _len = arguments.length, partials = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        partials[_key - 1] = arguments[_key];
    }

    return function (provider) {
        for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            rest[_key2 - 1] = arguments[_key2];
        }

        var res = isString$1(method) && isFunc$1(provider[method]) ? provider[method].apply(provider, partials.concat(rest)) : isFunc$1(method) ? method.call.apply(method, [provider].concat(partials, rest)) : null;
        if (res == null) {
            return provider;
        }
        return res;
    };
};

/**
 * Checks if a given object has a field of a certain key by name which is not
 *     inherited
 * @method 
 * @version 0.2.0
 * @param {string} key Name of the field
 * @param {object} x The object to test
 * @return {boolean} True if the field is present
 *
 * @example
 * const {has} = require('futils');
 *
 * let testee = {foo: 'bar'};
 *
 * has('foo', testee); // -> true
 * has('missing', testee); // -> false
 */
var has$1 = dyadic$1(function (key, x) {
    return _owns.call(x, key);
});

/**
 * Accesses a given object by a chain of keys
 * @method
 * @version 0.2.0
 * @param {string} key Single key or a chain of keys separated by `.`
 * @param {object|array|string|Monad} x Data structure to access
 * @return {any|null} Either the value of the key or null
 *
 * @example
 * const {field} = require('futils');
 *
 * const getName = field('name');
 * getName({name: 'John Doe'}); // -> 'John Doe'
 *
 * const firstName = field('name.first');
 * firstName({name: {first: 'John', last: 'Doe'}}); // -> 'John'
 */
var field$1 = dyadic$1(function (key, x) {
    var ks = isString$1(key) && /\./.test(key) ? key.split('.') : [key];
    return ks.reduce(function (a, b) {
        return isAny$1(a) && isAny$1(a[b]) ? a[b] : null;
    }, x);
});

/**
 * Assigns a value and a key to a given data structure, returns a clone of the
 *     given structure
 * @method 
 * @version 0.3.0
 * @param {string|number} k The key to assign to
 * @param {*} v The value to assing
 * @param {array|object} x The data structure to transform
 * @return {array|object|*} New array or object or the given thing
 *
 * @example
 * const {assoc} = require('futils');
 *
 * let p = { name: 'John Doe', accounts: [{name: 'jdoe'}] };
 *
 * const setAccountCount = assoc('accountCount');
 * setAccountCount(p.accounts.length, p);
 * // -> {name: 'John Doe', ..., accountCount: 1}
 *
 * console.log(p); // -> {name: 'John Doe', accounts: [...]};
 */
var assoc$1 = triadic$1(function (k, v, x) {
    var key = k,
        receiver = x;
    if (isArray$1(x)) {
        receiver = [].concat(toConsumableArray(x));
        key = parseInt(key, 10);
        if (isNumber$1(key) && key < x.length && key >= 0) {
            receiver[key] = v;
        }
    } else if (isObject$1(x)) {
        receiver = Object.assign({}, x);
        if (isString$1(key)) {
            receiver[key] = v;
        }
    }
    return receiver;
});

/**
 * Given a base object and some extension objects, creates a copy of the base
 *     object and extends that copy with the rest of the extension objects. The
 *     extensions are included from left to right, so that the last
 *     extension overrides the first
 * @method
 * @version 0.3.0
 * @param {object} x Base object
 * @param {object} ...xs 1 up to N extensions
 * @return {object} The extended copy of the base object
 *
 * @example
 * const {merge} = require('futils');
 *
 * var customer = {name: 'John Doe', id: 00000001},
 *     basket = {items: [ ... number of items ... ]};
 *
 * var customerWithBasket = merge(customer, basket);
 * 
 * customerWithBasket; // -> {name: '...', id: ..., items: [ ... ]}
 *
 * customer === customerWithBasket; // -> false
 */
var merge$1 = function merge$1() {
    for (var _len3 = arguments.length, xs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        xs[_key3] = arguments[_key3];
    }

    return xs.length > 1 ? Object.assign.apply(Object, [{}].concat(xs)) : function () {
        for (var _len4 = arguments.length, ys = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            ys[_key4] = arguments[_key4];
        }

        return merge$1.apply(undefined, xs.concat(ys));
    };
};

/**
 * Takes a object and prevents its pairs from being changed or removed, as well
 *     as freezing their enumerability, writability and configurability.
 * @method
 * @version 0.3.0
 * @param {object} x Object to make immutable
 * @return {object} Immutable object
 *
 * @example
 * const {immutable} = require('futils');
 *
 * var money = immutable({dollar: 5, cents: 50});
 *
 * money.dollar; // -> 5
 *
 * money.dollar += 5; // ;-)
 *
 * money.dollar; // -> 5
 */
var immutable$1 = function immutable$1(x) {
    return Object.freeze(Object.assign({}, x));
};

/**
 * Returns pairs of [key, value] from a given object
 * @method 
 * @version 2.0.0
 * @param {object} xs The object to take pairs from
 * @return {array} Array of pairs [ [pair], [pair], ... ]
 *
 * @example
 * const {pairs} = require('futils');
 *
 * pairs({foo: 1, bar: 0}); // -> [['foo', 1], ['bar', 0]]
 */
var pairs$1 = function pairs$1(xs) {
    return Object.keys(xs).map(function (k) {
        return [k, xs[k]];
    });
};

/**
 * Given a constructor function and a context (usually `this`) returns either
 *     the context if it is a instance of the constructor or a new object
 *     created from the constructor.prototype
 * @method 
 * @version 2.2.0
 * @param {function} F The constructor function
 * @param {any} ctx The context to check against
 * @return {object} Either the context or a new F
 *
 * @example
 * const {instance} = require('futils');
 *
 * // we use instance here to create a constructor which can be used without
 * //   needing the "new" keyword
 * function Unit (x, y) {
 *     let self = instance(Unit, this);
 *     self.x = x;
 *     self.y = y;
 *     return self;
 * }
 *
 * let newUnit = new Unit(1, 2);
 * let unit = Unit(1, 2);
 *
 * newUnit.x && newUnit.x === 1; // -> true
 * unit.x && unit.x === 1; // -> true
 */
var instance$1 = function instance$1(F, ctx) {
    return ctx instanceof F ? ctx : Object.create(F.prototype);
};

// -- Arrays --------------------
/**
 * Concatenates two things which are members of a semigroup. Uses addition to
 *     combine numbers. Uses composition to combine functions.
 * @method 
 * @param {number|function|array|semigroup} a First member
 * @param {number|function|array|semigroup} b Second member
 * @return {array|semigroup} A new member
 *
 * @example
 * const {concat} = require('futils');
 *
 * const toNs = concat([1, 2]);
 *
 * toNs(3); // -> [1, 2, 3]
 * toNs([3]); // -> [1, 2, 3]
 */
var concat$2 = dyadic$1(function (a, b) {
    if (isNumber$1(a) && isNumber$1(b)) {
        return a + b;
    }
    if (isFunc$1(a) && isFunc$1(b)) {
        return function () {
            return b(a.apply(undefined, arguments));
        };
    }
    if (isAny$1(a) && isFunc$1(a.concat)) {
        return a.concat(b);
    }
    throw 'concat :: Unable to concatenate items ' + [a, b];
});

/**
 * Given a iterable collection, returns the first item
 * @method
 * @version 0.2.0
 * @param {array|array-like} xs The collection
 * @return {*} Whatever the first item is
 *
 * @example
 * const {first} = require('futils');
 *
 * first([1, 2, 3]); // -> 1
 *
 * first(document.querySelectorAll('a')); // -> <a></a>
 */
var first$1 = function first$1(xs) {
    return xs[0];
};

/**
 * Given a iterable collection, returns the head of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the head item is
 *
 * @example
 * const {head} = require('futils');
 *
 * head([1, 2, 3]); // -> [1]
 *
 * head(document.querySelectorAll('a')); // -> [<a></a>]
 */
var head$1 = function head$1(xs) {
    return [first$1(xs)];
};

/**
 * Given a iterable collection, returns all items but the last of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the initial items are
 *
 * @example
 * const {initial} = require('futils');
 *
 * initial([1, 2, 3]); // -> [1, 2]
 *
 * initial(
 *     document.querySelectorAll('a')
 * ); // -> [<a></a>, <a></a>, ...]
 */
var initial$1 = function initial$1(xs) {
    return isArray$1(xs) ? xs.slice(0, xs.length - 1) : isIterable$1(xs) ? Array.from(xs).slice(0, xs.length - 1) : [];
};

/**
 * Given a iterable collection, returns the last item
 * @method
 * @version 0.2.0
 * @param {array|array-like} xs The collection
 * @return {*} Whatever the last item is
 *
 * @example
 * const {last} = require('futils');
 *
 * last([1, 2, 3]); // -> 3
 *
 * last(document.querySelectorAll('a')); // -> <a></a>
 */
var last$1 = function last$1(xs) {
    return xs[xs.length - 1];
};

/**
 * Given a iterable collection, returns the tail of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the tail item is
 *
 * @example
 * const {tail} = require('futils');
 *
 * tail([1, 2, 3]); // -> [3]
 *
 * tail(document.querySelectorAll('a')); // -> [<a></a>]
 */
var tail$1 = function tail$1(xs) {
    return [last$1(xs)];
};

/**
 * Given a iterable collection, returns all items but the first of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the rest items are
 *
 * @example
 * const {rest} = require('futils');
 *
 * rest([1, 2, 3]); // -> [2, 3]
 *
 * rest(document.querySelectorAll('a')); // -> [..., <a></a>, <a></a>]
 */
var rest$1 = function rest$1(xs) {
    return isArray$1(xs) ? xs.slice(1) : isIterable$1(xs) ? Array.from(xs).slice(1) : [];
};

/**
 * Given a iterable collection, returns all unique items of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Only unique items
 *
 * @example
 * const {unique} = require('futils');
 *
 * unique([2, 1, 2, 3, 3, 1]); // -> [2, 1, 3]
 */
var unique$1 = function unique$1(xs) {
    return xs.reduce(function (acc, x) {
        return acc.lastIndexOf(x) < 0 ? [].concat(toConsumableArray(acc), [x]) : acc;
    }, []);
};

/**
 * Given two iterable collections, returns the union of them
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs First collection
 * @param {array|array-like} ys Second collection
 * @return {array} The union of xs and ys
 *
 * @example
 * const {union} = require('futils');
 *
 * union([2, 1, 2], [3, 3, 1]); // -> [2, 1, 3]
 */
var union$1 = dyadic$1(function (xs, ys) {
    return unique$1([].concat(toConsumableArray(xs), toConsumableArray(ys)));
});

/**
 * Given two iterable collections, returns the intersection of them
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs First collection
 * @param {array|array-like} ys Second collection
 * @return {array} The intersection of xs and ys
 *
 * @example
 * const {intersect} = require('futils');
 *
 * intersect([2, 1, 2], [3, 3, 1]); // -> [1]
 */
var intersect$1 = dyadic$1(function (xs, ys) {
    return union$1(xs, ys).filter(function (a) {
        return xs.indexOf(a) > -1 && ys.indexOf(a) > -1;
    });
});

/**
 * Given two iterable collections, returns the difference of them
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs First collection
 * @param {array|array-like} ys Second collection
 * @return {array} The difference of xs and ys
 *
 * @example
 * const {differ} = require('futils');
 *
 * differ([2, 1, 2], [3, 3, 1]); // -> [2, 3]
 */
var differ$1 = dyadic$1(function (xs, ys) {
    return union$1(xs, ys).filter(function (a) {
        return xs.indexOf(a) < 0 || ys.indexOf(a) < 0;
    });
});

/**
 * Takes to arrays and produces a new array of arrays where each inner array
 *     contains the items of both lists
 * @method 
 * @version 2.3.2
 * @param {array} xs First array
 * @param {array} ys Second array
 * @return {array} A array of arrays
 *
 * @example
 * const {zip} = require('futils');
 *
 * zip([1, 2], ['one', 'two']); // -> [[1, 'one'], [2, 'two']]
 * zip([1, 2], ['one']); // -> [[1, 'one']]
 * zip([1], ['one', 'two']); // -> [[1, 'one']]
 */
var zip$1 = dyadic$1(function (xs, ys) {
    if (isArray$1(xs) && isArray$1(ys)) {
        return xs.length > ys.length ? ys.map(function (y, i) {
            return [xs[i], y];
        }) : xs.map(function (x, i) {
            return [x, ys[i]];
        });
    }
    return [xs, ys];
});

/** NOTE ===================

Functions in the following sections are implemented in foresight of
tail call optimization, which now finally seems to arrive.

========================= */

/**
 * Given a function, a seed value and a iterable collection, return the
 *     iterable folded down into the seed value
 * @method 
 * @version 2.2.0
 * @param {function} f Function to call on each iteration
 * @param {any} x The seed value to fold into
 * @param {array|Monad|Monoid} xs The collection to fold down
 * @return {any} Depends on the seed value
 *
 * @example
 * const {fold} = require('futils');
 *
 * const add = (a, b) => a + b;
 *
 * fold(add, 0, [1, 2, 3]); // -> 6
 * fold(add, '', ['hello,', ' ', 'world']); // -> 'hello world'
 */
var fold$2 = triadic$1(function (f, x, xs) {
    if (isFunc$1(xs.fold)) {
        return xs.fold(f, x);
    }
    var go = trampoline$1(function (g, acc, as) {
        if (as.length < 1) {
            return acc;
        }
        return suspend$1(go, g, g(acc, first$1(as)), rest$1(as));
    });
    return go(f, x, Array.from(xs));
});

/**
 * Given a function and a initial value, accumulates values into an array until
 *     the function returns either null or undefined. This function can be used
 *     to implement `while` loops.
 * @method 
 * @version 2.2.0
 * @param {function} f Function to call on each iteration
 * @return {array} Collection of accumulated values
 *
 * @example
 * const {unfold} = require('futils');
 *
 * const fifthUntil = (n) => unfold((x) => x <= n ? [x, x + 5] : null, 5);
 *
 * fifthUntil(25); // -> [5, 10, 15, 20, 25]
 */
var unfold$1 = dyadic$1(function (f, x) {
    var go = trampoline$1(function (g, y, ys) {
        var r = g(y);
        if (r == null) {
            return ys;
        }
        return suspend$1(go, g, r[1], [].concat(toConsumableArray(ys), [r[0]]));
    });
    return go(f, x, []);
});

/**
 * Given a start and end index, returns a array from start to end containing
 *     all indices in between
 * @method 
 * @version 2.2.0
 * @param {integer} start Starting index
 * @param {integer} stop Final index
 * @return {array} List of all integers from start through end
 *
 * @example
 * const {range} = require('futils');
 *
 * range(2, 8); // -> [2, 3, 4, 5, 6, 7, 8]
 */
var range$1 = dyadic$1(function (start, stop) {
    return unfold$1(function (n) {
        return n <= stop ? [n, n + 1] : null;
    }, start);
});

/**
 * Given a function and a list, filters the list with the given function and
 *     returns a list that only contains values for which the function returned
 *     a truthy value
 * @method 
 * @version 2.2.0
 * @param {function} f Filter function
 * @param {array} xs List to filter
 * @return {array} New list
 *
 * @example
 * const {filter} = require('futils');
 *
 * const evens = (n) => n % 2 === 0;
 *
 * filter(evens, [1, 2, 3, 4, 5, 6]); // -> [2, 4, 6]
 */
var filter$1 = dyadic$1(function (f, xs) {
    return fold$2(function (ys, x) {
        return !!f(x) ? [].concat(toConsumableArray(ys), [x]) : ys;
    }, [], Array.from(xs));
});

/**
 * Given a list, returns a new list with all `null` and `undefined` values
 *     removed
 * @method 
 * @version 2.2.0
 * @param {array} xs List to transform
 * @return {array} A new list
 *
 * @example
 * const {keep} = require('futils');
 *
 * keep([1, null, 3]); // -> [1, 3]
 */
var keep$1 = function keep$1(xs) {
    return filter$1(function (x) {
        return x != null;
    }, Array.from(xs));
};

/**
 * Given a number `n` and a list, drops the first n items from the list
 * @method 
 * @version 2.2.0
 * @param {number} n Number of items to drop
 * @param {array} xs List to drop items from
 * @return {array} New list
 *
 * @example
 * const {drop} = require('futils');
 *
 * drop(2, [1, 2, 3, 4]); // -> [3, 4]
 */
var drop$1 = dyadic$1(function (n, xs) {
    var i = Math.round(Math.abs(n));
    return fold$2(function (ys, x) {
        if (i > 0) {
            i -= 1;
            return ys;
        }
        return [].concat(toConsumableArray(ys), [x]);
    }, [], Array.from(xs));
});

/**
 * Given a predicate function and a list, drops items from the list until the
 *     function returns a falsy value for the first time
 * @method 
 * @version 2.2.0 
 * @param {function} f Predicate function
 * @param {array} xs List to drop items from
 * @return {array} New list
 *
 * @example
 * const {dropWhile} = require('futils');
 *
 * const lt3 = (n) => n < 3;
 *
 * dropWhile(lt3, [1, 2, 3, 4, 5]); // -> [4, 5]
 */
var dropWhile$1 = dyadic$1(function (f, xs) {
    var drop = true;
    return fold$2(function (ys, x) {
        drop = drop && !!f(x);
        if (drop) {
            return ys;
        }
        return [].concat(toConsumableArray(ys), [x]);
    }, [], Array.from(xs));
});

/**
 * Given a number `n` and a list, takes n items from the beginning of the list
 *     and drops the rest
 * @method 
 * @version 2.2.0 
 * @param {number} n Number of items to take
 * @param {array} xs List to take items from
 * @return {array} New list
 *
 * @example
 * const {take} = require('futils');
 *
 * take(2, [1, 2, 3, 4, 5]); // -> [1, 2];
 */
var take$1 = dyadic$1(function (n, xs) {
    var i = 0;
    return fold$2(function (ys, x) {
        if (i < n) {
            i += 1;
            return [].concat(toConsumableArray(ys), [x]);
        }
        return ys;
    }, [], Array.from(xs));
});

/**
 * Given a predicate function and a list, takes items from the beginning of the
 *     list until the function returns a falsy value for the first time
 * @method 
 * @version 2.2.0 
 * @param {function} f Predicate function
 * @param {array} xs List to take items from
 * @return {array} New list
 *
 * @example
 * const {takeWhile} = require('futils');
 *
 * const lt3 = (n) => n < 3;
 *
 * takeWhile(lt3, [1, 2, 3, 4, 5]); // -> [1, 2]
 */
var takeWhile$1 = dyadic$1(function (f, xs) {
    var take = true;
    return fold$2(function (ys, x) {
        if (take && (take = !!f(x))) {
            return [].concat(toConsumableArray(ys), [x]);
        }
        return ys;
    }, [], Array.from(xs));
});

/**
 * Given a function and a list, returns the first item for which the function
 *     returns a truthy value
 * @method 
 * @version 2.2.0 
 * @param {function} f Function to match with
 * @param {array} xs List to find item from
 * @return {any|null} Either a match or null
 *
 * @example
 * const {find} = require('futils');
 *
 * const divBy = (n) => (m) => n % m === 0;
 *
 * find(divBy(2), [1, 2, 3, 4, 5]); // -> 2
 */
var find$1 = dyadic$1(function (f, xs) {
    return fold$2(function (ys, x) {
        return ys == null && !!f(x) ? x : ys;
    }, null, Array.from(xs));
});

/**
 * Given a function and a list, returns the first item for which the function
 *     returns a truthy value. Matches items from the right
 * @method 
 * @version 2.2.0 
 * @param {function} f Function to match with
 * @param {array} xs List to find item from
 * @return {any|null} Either a match or null
 *
 * @example
 * const {findRight} = require('futils');
 *
 * const divBy = (n) => (m) => n % m === 0;
 *
 * findRight(divBy(2), [1, 2, 3, 4, 5]); // -> 4
 */
var findRight$1 = dyadic$1(function (f, xs) {
    return find$1(f, Array.from(xs).reverse());
});

/**
 * Given a Monoid TypeConstructor and a list, folds all values in the list into
 *     the Monoid Type
 * @method 
 * @version 2.4.0
 * @param {Monoid} M Constructor of the monoid typeclass
 * @param {array} xs A list of values
 * @return {Monoid} Unit of the monoid concatenated with all xs
 *
 * @example
 * const {foldMap, All, Any} = require('futils');
 *
 * foldMap(All, [true, false, true, true]); // -> All(false)
 * foldMap(Any, [true, false, true, true]); // -> Any(true)
 */
var foldMap$1 = dyadic$1(function (M, xs) {
    return fold$2(function (m, x) {
        return m.concat(x);
    }, M.empty(), xs.map(M.of));
});

// -- Setoid --------------------
/**
 * Generic setoid method, works on anything that implements a `equals` method. If
 *     no `equals` is found it matches on the values directly via strict
 *     comparison (===)
 * @method
 * @version 2.0.0 
 * @param {Setoid|*} a Any value to compare
 * @param {Setoid|*} b Any value to compare 
 * @return {boolean} True if both are equal
 *
 * @example
 * const {Maybe, equals} = require('futils');
 *
 * let m = Maybe.of(1);
 * let n = Maybe.of(1);
 *
 * equals(m, n); // -> true
 * equals(1, 1); // -> true
 */
var equals$2 = dyadic$1(function (a, b) {
    return isSetoid$1(b) ? b.equals(a) : a === b;
});

// -- Functor --------------------
/**
 * Generic functor method, works on anything that implements a `map` method as
 *     well as on arrays and objects
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function to map
 * @param {object|array|Functor} m The functor to map over
 * @return {object|array|Functor} New instance of the functor
 *
 * @example
 * const {map} = require('futils');
 *
 * const addOne = (n) => n + 1;
 * map(addOne, [1, 2, 3]); // -> [2, 3, 4]
 *
 * let mapAddOne = map(addOne);
 * map(mapAddOne, [[1, 2], [3]]); // -> [[2, 3], [4]]
 */
var _map = dyadic$1(function (f, m) {
    if (isFunc$1(f)) {
        if (isFunctor$1(m)) {
            return m.map(f);
        }
        if (isIterable$1(m)) {
            return Array.from(m).map(f);
        }
        if (isObject$1(m)) {
            return Object.keys(m).reduce(function (acc, k) {
                acc[k] = f(m[k], k, m);
                return acc;
            }, {});
        }
        return m;
    }
    throw 'operators::map awaits a function as first argument but saw ' + f;
});

var ap$2 = dyadic$1(function (mf, ma) {
    if (isFunc$1(mf)) {
        return isFunctor$1(ma) ? ma.map(mf) : isObject$1(ma) ? _map(mf, ma) : mf(ma);
    }
    if (isApply$1(mf)) {
        return isFunctor$1(ma) ? mf.ap(ma) : isObject$1(ma) ? mf.ap({ map: function map(f) {
                return _map(f, ma);
            } }) : mf.ap([ma])[0];
    }
    throw 'operators::ap awaits apply/function as first argument but saw ' + mf;
});

// -- Monad --------------------

/**
 * Generic flatten method, works on anything that implements a `flatten` method
 *     as well as on arrays
 * @method
 * @version 0.2.0
 * @param {array|Monad} m The thing to flatten
 * @param {boolean} [deep=false] Optional flag to flatten nested arrays
 * @return {array|Monad} New instance of given
 *
 * @example
 * const {flatten} = require('futils');
 *
 * flatten([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, [4, 5]]
 * flatten([[1, 2], 3, [[4, 5]]], true); // -> [1, 2, 3, 4, 5]
 */
var flatten$2 = function flatten$2(m) {
    var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (isObject$1(m)) {
        return m;
    }
    if (isFunc$1(m.flatten)) {
        return m.flatten();
    }
    if (isArray$1(m)) {
        if (!deep) {
            return m.reduce(function (a, b) {
                return a.concat(b);
            }, []);
        }
        var go = trampoline$1(function (xs, ys) {
            if (ys.length < 1) {
                return xs;
            }
            if (isArray$1(ys[0])) {
                return suspend$1(go, xs, [].concat(toConsumableArray(ys[0]), toConsumableArray(ys.slice(1))));
            }
            return suspend$1(go, [].concat(toConsumableArray(xs), [ys[0]]), ys.slice(1));
        });
        return go([], m);
    }
    throw 'operators::flatten awaits Monad or array but saw ' + m;
};

/**
 * Generic flatMap method, works on anything which implements a `map` and a
 *     `flatten` method as well as on arrays and objects
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function
 * @param {object|array|Monad} m The Monad, array or object
 * @return {object|array|Monad} New instance of given Monad, array or object
 *
 * @example
 * const {flatMap} = require('futils');
 *
 * const split = (s) => s.split(' ');
 * flatMap(split, ['Hello world']); // -> ['Hello', 'world']
 */
var flatMap$2 = dyadic$1(function (f, m) {
    if (isFunc$1(f)) {
        if (isFunc$1(m.flatMap)) {
            return m.flatMap(f);
        }
        return flatten$2(_map(f, m), false);
    }
    throw 'operators::flatMap awaits function as 1. argument but saw ' + f;
});

/**
 * Given a function from "a" to "Structure a", a Applicative constructor *     and a Traversable, wraps the Applicative around the structure and
 *     returns the result 
 * @method 
 * @version 2.4.1
 * @param {function} f Function in the form `(a -> Applicative a)`
 * @param {Applicative} A Applicative constructor
 * @param {array|Applicative} xs Structure to traverse
 * @return {Applicative} The structure wrapped in a Applicative
 *
 * @example
 * const {Some, traverse} = require('futils');
 *
 * const xs = [1, 2, 3];
 *
 * traverse(Some.of, Some, xs); // -> Some([1, 2, 3])
 */
var traverse$2 = triadic$1(function (f, A, xs) {
    if (isFunc$1(f) && isFunc$1(A.of)) {
        if (isFunc$1(xs.traverse)) {
            return xs.traverse(f, A);
        }
        if (isArray$1(xs)) {
            return xs.reduceRight(function (a, x) {
                return f(x).map(Array.of).concat(a);
            }, A.of([]));
        }
        throw 'operators::traverse cannot act on ' + xs;
    }
    throw 'operators::traverse awaits function & applicative, saw ' + [f, A];
});

/**
 * Sequences containers, given a Applicative constructor and a structure
 * @method 
 * @version 2.4.1
 * @param {Applicative} A Applicative constructor
 * @param {array|Applicative} xs Structure to sequence
 * @return {Applicative} The structure wrapped into a Applicative
 *
 * @example
 * const {Some, sequence} = require('futils');
 *
 * const xs = [Some.of(1), Some.of(2), Some.of(3)];
 *
 * sequence(Some, xs); // -> Some([1, 2, 3])
 */
var sequence$2 = dyadic$1(function (A, xs) {
    return traverse$2(function (a) {
        return a;
    }, A, xs);
});

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * A collection of lens creators and operation functions for composable lenses
 * @module futils/lenses
 * @requires futils/combinators
 * @requires futils/decorators
 * @requires futils/operators
 */

var Const = function Const(x) {
  return { value: x, map: function _map() {
      return this;
    }
  };
};
var Id = function Id(x) {
  return { value: x, map: function _map(f) {
      return Id(f(x));
    }
  };
};
var comp = function comp(f, g) {
  return function () {
    return f(g.apply(undefined, arguments));
  };
};

/**
 * Allows to create new types of lenses which work on different data structures
 *     than objects and arrays. Please note that the setter function has to
 *     take care to clone the given structure appropriate before manipulating it
 * @method 
 * @version 0.6.0
 * @param {function} getter A function defining how to get a value from the structure
 * @param {function} setter A function defining how to clone the structure and set a value
 * @return {function} A lens for the given data type
 *
 * @example
 * const {lens, over} = require('futils');
 *
 * let MapLens = lens(
 *     (k, xs) => xs.get(k),
 *     (k, v, xs) => xs.set(k, v)
 * );
 * 
 * let m = new Map([['users', ['john doe']]]); 
 *
 * over(MapLens('users'), (s) => s.toUpperCase(), m); // -> ['JOHN DOE']
 */
var lens$1 = curry$1(function (gets, sets, k, f, xs) {
  return _map(function (replacement) {
    return sets(k, replacement, xs);
  }, f(gets(k, xs)));
});

// The bare bones, creates a lens which works on arrays and objects
var baseLens = lens$1(field$1, assoc$1);

/**
 * Given a lens and a data structure, returns the current value foci on the data
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {array|object} data The data structure
 * @return {*} Whatever the current value is
 *
 * @example
 * const {makeLenses, view} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * view(L.name, data); // -> 'John Doe'
 */
var view$1 = curry$1(function (l, data) {
  return l(Const)(data).value;
});

/**
 * Given a lens, a function and a data structure, applies the function to the
 *     foci of the lens on the data structure and returns a copy of the given
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {function} f A data transforming function
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {makeLenses, over} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * over(L.name, (s) => s.toUpperCase(), data);
 * // -> {name: 'JOHN DOE', age: 30}
 */
var over$1 = curry$1(function (l, f, data) {
  return l(function (y) {
    return Id(f(y));
  })(data).value;
});

/**
 * Given a lens, a value and a data structure, sets the value of the foci of the
 *     lens to the given value on the data structure and returns a copy of the
 *     given structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {*} v The value to set
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {makeLenses, set} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * set(L.name, 'Adam Smith', data);
 * // -> {name: 'Adam Smith', age: 30}
 */
var set$3 = curry$1(function (l, v, data) {
  return over$1(l, function () {
    return v;
  }, data);
});

/**
 * Takes a variadic number of string parameters and returns a collection of
 *     lenses where each lens points to one of the given parameters. A additional
 *     "num" lensmaker is returned too to allow peeking into array items
 * @method 
 * @version 0.6.0
 * @param {string} fields* String representing the fields on a object
 * @return {object} Collection of lenses
 *
 * @example
 * const {compose, makeLenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30, friends: [{name: 'Adam Smith'}]};
 * let L = makeLenses('name', 'age', 'friends');
 *
 * L.name(data); // -> 'John Doe'
 * L.age(data); // -> 30
 *
 * const firstFriendsName = compose(L.friends, L.index(0), L.name);
 * firstFriendsName(data); // -> 'Adam Smith'
 */
var makeLenses$1 = function makeLenses$1() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  return fields.reduce(function (acc, field$$1) {
    if (!has$1(field$$1, acc)) {
      acc[field$$1] = baseLens(field$$1);
    }
    return acc;
  }, { index: baseLens });
};

/**
 * Utility function, maps a lens over a nested data structure
 * @method 
 * @version 1.0.4
 * @param {function} f Data transformation function
 * @param {array|object} data The nested data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {compose, mappedLens} = require('futils');
 *
 * let data = [[1, 2, 3]];
 *
 * const inc = (n) => n + 1;
 *
 * const mapMapLens = compose(mappedLens, mappedLens);
 * over(mapMapLens, inc, data); // -> [[2, 3, 4]]
 */
var mappedLens$1 = curry$1(function (f, xs) {
  return Id(_map(comp(field$1('value'), f), xs));
});

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * A collection of transducer functions, inspired by Clojure
 * @module futils/transducers
 * @requires futils/types
 * @requires futils/decorators
 */

// Let's ensure we adhere to the official transducer protocol
var STEP = '@@transducer/step';
var INIT = '@@transducer/init';
var RESULT = '@@transducer/result';

// A generic transformer/transducer, not exposed
function Transformer(f) {
    var _ref;

    return _ref = {}, defineProperty(_ref, STEP, f), defineProperty(_ref, INIT, function () {
        throw 'transducers/init not supported on generic transformers';
    }), defineProperty(_ref, RESULT, function (v) {
        return v;
    }), _ref;
}

Transformer.isReduced = function (v) {
    return !isNil$1(v) && v.reduced;
};
Transformer.reduce = function (v) {
    return { value: v, reduced: true };
};
Transformer.deref = function (rv) {
    return rv && rv.value !== undefined ? rv.value : null;
};

/**
 * Works much like the Array::reduce function but accepts objects and all
 *     iterables which implement the @@iterator protocol
 * @method 
 * @version 0.5.0
 * @param {function|transducer} tf A transformer function or a transducer
 * @param {any} seed The seed value to transduce into
 * @param {object|iterable} xs The data to transduce over
 * @return {any} The given data transduced into the seed value
 *
 * @example
 * const {fold} = require('futils').transducers;
 *
 * const sep = (a, b) => !a ? b : a + ' - ' + b;
 * fold(sep, '', [1, 2, 3]); // -> '1 - 2 - 3'
 *
 * const pair = (a, b) => a + ': ' + b;
 * fold(
 *     (acc, [val, key]) => sep(acc, pair(key, val)),
 *     '',
 *     {a: 1, b: 2, c: 3} 
 * );
 * // -> 'a: 1 - b: 2 - c: 3'
 */
var fold$3 = curry$1(function (tf, seed, ls) {
    var xf = isFunc$1(tf) ? Transformer(tf) : tf,
        v = seed;

    if (isObject$1(ls)) {
        var ks = Object.keys(ls);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = ks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var k = _step.value;

                v = xf[STEP](v, [ls[k], k]);
                if (Transformer.isReduced(v)) {
                    v = Transformer.deref(v);
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return xf[RESULT](v);
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = ls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var i = _step2.value;

            v = xf[STEP](v, i);
            if (Transformer.isReduced(v)) {
                v = Transformer.deref(v);
                break;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return xf[RESULT](v);
});

/**
 * Takes a transducer, a step function which reduces, a initial value and a set
 *     of data to transduce over
 * @method 
 * @version 0.5.0
 * @param {transducer} tf A transducer to transduce with
 * @param {function|transducer} step A reducing function or transducer
 * @param {any} seed The seed value to transduce into
 * @param {object|iterable} xs The data to transduce over
 * @return {any} The given data transduced into the seed value
 *
 * @example
 * const {transduce, map} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const add1 = map((n) => n + 1);
 *
 * transduce(add1, sum, 0, [1, 2, 3]); // -> 9
 */
var transduce = curry$1(function (tf, step, seed, ls) {
    return fold$3(tf(isFunc$1(step) ? Transformer(step) : step), seed, ls);
});

/**
 * Takes a initial value, a transducer and some data and transduces the data into
 *     the seed. Please note that the step function is calculated on-the-fly, if
 *     you need more control please use the [transduce]{@link transducers#transduce}
 *     function
 * @method 
 * @version 0.5.0
 * @param {any} seed The seed value to transduce into
 * @param {transducer} tf A transducer to transduce with
 * @param {object|iterable} xs The data to transduce over
 * @return {any} The given data transduced into the seed value
 *
 * @example
 * const {into, map} = require('futils').transducers;
 *
 * const add1 = map((n) => n + 1);
 *
 * into(0, add1, [1, 2, 3]); // -> 9
 * into([], add1, [1, 2, 3]); // -> [2, 3, 4]
 * into('', add1, [1, 2, 3]); // -> '234'
 */
var into = curry$1(function (seed, tf, ls) {
    if (isArray$1(seed)) {
        return transduce(tf, function (arr, v) {
            return [].concat(toConsumableArray(arr), [v]);
        }, seed, ls);
    }
    if (isObject$1(seed)) {
        return transduce(tf, function (obj, _ref2) {
            var _ref3 = slicedToArray(_ref2, 2),
                v = _ref3[0],
                k = _ref3[1];

            var c = Object.assign({}, obj);
            c[k] = v;
            return c;
        }, seed, ls);
    }
    if (isNumber$1(seed) || isString$1(seed)) {
        return transduce(tf, function (acc, v) {
            return acc + v;
        }, seed, ls);
    }
    throw 'transducers::into got unknown inital value, use ::transduce with a special step function';
});

/**
 * Takes a function and returns a transducer which maps the function over each
 *     value in a data structure
 * @method 
 * @version 0.5.0
 * @param {function} f The function to map with
 * @return {function} A function which returns a mapping transducer
 *
 * @example
 * const {transduce, map} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const add1 = map((n) => n + 1);
 *
 * transduce(add1, sum, 0, [1, 2, 3]); // -> 9
 */
var map$2 = function map$2(f) {
    return function (xf) {
        var _ref4;

        return _ref4 = {}, defineProperty(_ref4, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref4, STEP, function (xs, v) {
            return xf[STEP](xs, f(v));
        }), defineProperty(_ref4, RESULT, function (v) {
            return xf[RESULT](v);
        }), _ref4;
    };
};

/**
 * Takes a function and returns a transducer which filters with the given function
 *     all values in a data structure
 * @method 
 * @version 0.5.0
 * @param {function} f The function to filter with, should be a predicate function
 * @return {function} A function which returns a filtering transducer
 *
 * @example
 * const {transduce, filter} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const modBy2 = filter((n) => n % 2 === 0);
 *
 * transduce(modBy2, sum, 0, [1, 2, 3]); // -> 2
 */
var filter$2 = function filter$2(f) {
    return function (xf) {
        var _ref5;

        return _ref5 = {}, defineProperty(_ref5, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref5, STEP, function (xs, v) {
            return !!f(v) ? xf[STEP](xs, v) : xs;
        }), defineProperty(_ref5, RESULT, function (v) {
            return xf[RESULT](v);
        }), _ref5;
    };
};

/**
 * Takes another transducer and flattens the intermediate nested data structure
 *     on level
 * @method 
 * @version 0.5.0
 * @param {transducer} xf Other transducer
 * @return {transducer} A flattening transducer
 *
 * @example
 * const {transduce, flatten} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 *
 * transduce(flatten, sum, 0, [[1], [2], [3]]); // -> 6
 */
var flatten$3 = function flatten$3(xf) {
    var _ref6;

    return _ref6 = {}, defineProperty(_ref6, INIT, function () {
        return xf[INIT]();
    }), defineProperty(_ref6, STEP, function (xs, v) {
        var _fold;

        return fold$3((_fold = {}, defineProperty(_fold, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_fold, STEP, function (_xs, __v) {
            var _v = xf[STEP](_xs, __v);
            return Transformer.isReduced(_v) ? Transformer.deref(_v) : _v;
        }), defineProperty(_fold, RESULT, function (_v) {
            return _v;
        }), _fold), xs, v);
    }), defineProperty(_ref6, RESULT, function (v) {
        return xf[RESULT](v);
    }), _ref6;
};

/**
 * Takes a number and returns a transducer which drops the first N values according
 *     to the given number
 * @method 
 * @version 0.5.0
 * @param {number} [n = 1] A integer number, specifying the number of items to drop
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, drop} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const tail = drop(1);
 *
 * transduce(tail, sum, 0, [1, 2, 3]); // -> 5
 */
var drop$2 = function drop$2() {
    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    return function (xf) {
        var _ref7;

        var i = n;
        return _ref7 = {}, defineProperty(_ref7, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref7, STEP, function (xs, v) {
            if (i > 0) {
                i -= 1;
                return xs;
            }
            return xf[STEP](xs, v);
        }), defineProperty(_ref7, RESULT, function (v) {
            return xf[RESULT](v);
        }), _ref7;
    };
};

/**
 * Similiar to [drop]{@link transducers#drop}, but takes a function instead of
 *     a number and drops items until the function retuns false for the first
 *     time
 * @method 
 * @version 0.5.0
 * @param {function} f A predicate function
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, dropWhile} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const above2 = dropWhile((n) => n < 2);
 *
 * transduce(above2, sum, 0, [1, 2, 3]); // -> 5
 */
var dropWhile$2 = function dropWhile$2(f) {
    return function (xf) {
        var _ref8;

        var drop = true,
            stop = false;
        return _ref8 = {}, defineProperty(_ref8, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref8, STEP, function (xs, v) {
            if (!stop && (drop = !!f(v))) {
                return xs;
            }
            stop = true;
            return xf[STEP](xs, v);
        }), defineProperty(_ref8, RESULT, function (v) {
            return xf[RESULT](v);
        }), _ref8;
    };
};

/**
 * Takes a number and returns a transducer which takes N items from the beginning
 *     according to the given number
 * @method 
 * @version 0.5.0
 * @param {number} n The number of items to take
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, take} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const initial = take(2);
 *
 * transduce(initial, sum, 0, [1, 2, 3]); // -> 3
 */
var take$2 = function take$2() {
    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    return function (xf) {
        var _ref9;

        var i = 0;
        return _ref9 = {}, defineProperty(_ref9, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref9, STEP, function (xs, v) {
            if (i < n) {
                i += 1;
                return xf[STEP](xs, v);
            }
            return Transformer.reduce(xs);
        }), defineProperty(_ref9, RESULT, function (v) {
            return xf[RESULT](v);
        }), _ref9;
    };
};

/**
 * Similiar to [take]{@link transducers#take}, but takes a function instead of
 *     a number and takes items until the function retuns false for the first
 *     time
 * @method 
 * @version 0.5.0
 * @param {function} f A predicate function
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, takeWhile} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const below3 = takeWhile((n) => n < 3);
 *
 * transduce(below3, sum, 0, [1, 2, 3]); // -> 3
 */
var takeWhile$2 = function takeWhile$2(f) {
    return function (xf) {
        var _ref10;

        var take = true;
        return _ref10 = {}, defineProperty(_ref10, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref10, STEP, function (xs, v) {
            take = !!f(v);
            if (take) {
                return xf[STEP](xs, v);
            }
            return Transformer.reduce(xs);
        }), defineProperty(_ref10, RESULT, function (v) {
            return xf[RESULT](v);
        }), _ref10;
    };
};

/**
 * Implements a transducers which removes all null or undefined values but keeps
 *     the rest
 * @method 
 * @version 0.5.0
 * @param {transducer} xf Other transducer
 * @return {transducer} A keeping transducer
 *
 * @example
 * const {transduce, keep} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * 
 * transduce(keep, sum, 0, [1, null, 3]); // -> 4
 */
var keep$2 = function keep$2(xf) {
    var _ref11;

    return _ref11 = {}, defineProperty(_ref11, INIT, function () {
        return xf[INIT]();
    }), defineProperty(_ref11, STEP, function (xs, v) {
        return !isNil$1(v) ? xf[STEP](xs, v) : xs;
    }), defineProperty(_ref11, RESULT, function (v) {
        return xf[RESULT](v);
    }), _ref11;
};

/**
 * Implements a transducer which removes duplicated values
 * @method 
 * @version 0.5.0
 * @param {transducer} xf Other transducer
 * @return {transducer} A unique transducer
 *
 * @example
 * const {transduce, unique} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 *
 * transduce(unique, sum, 0, [1, 2, 1, 3, 2]); // -> 6
 */
var unique$2 = function unique$2(xf) {
    var _ref12;

    var found = Object.create(null);
    return _ref12 = {}, defineProperty(_ref12, INIT, function () {
        return xf[INIT]();
    }), defineProperty(_ref12, STEP, function (xs, v) {
        if (!found[v]) {
            found[v] = true;
            return xf[STEP](xs, v);
        }
        return xs;
    }), defineProperty(_ref12, RESULT, function (v) {
        return xf[RESULT](v);
    }), _ref12;
};

/**
 * Takes a number N and returns a transducer which partitions the input into
 *     subparts of N items
 * @method 
 * @version 0.5.0
 * @param {number} n Number of items inside each partition
 * @return {function} A function awaiting another transducer
 *
 * @example
 * const {transduce, partition} = require('futils').transducers;
 *
 * const push = (a, b) => a.push(b) && a;
 *
 * transduce(partition(2), push, [], [1, 2, 3, 4]); // -> [[1, 2], [3, 4]]
 */
var partition = function partition() {
    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    return function (xf) {
        var _ref13;

        var p = [],
            _xs;
        return _ref13 = {}, defineProperty(_ref13, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref13, STEP, function (xs, v) {
            if (p.length < n) {
                p.push(v);
                return xs;
            }
            _xs = xf[STEP](xs, p);
            p = [v];
            return _xs;
        }), defineProperty(_ref13, RESULT, function (v) {
            if (p.length > 0) {
                return xf[RESULT](xf[STEP](v, p));
            }
            return xf[RESULT](v);
        }), _ref13;
    };
};

/**
 * Similiar to [partition]{@link transducers#partition} but instead of taking a
 *     number it takes a function and partitions each time the function returns
 *     a result different to what it returned in the previous step
 * @method 
 * @version 0.5.0
 * @param {function} f The function to partition with
 * @return {function} A function awaiting another transducer
 *
 * @example
 * const {transduce, partitionWith} = require('futils').transducers;
 *
 * const push = (a, b) => a.push(b) && a;
 * const modBy3 = partitionWith((n) => n % 3 === 0);
 *
 * transduce(modBy3, push, [], [1, 2, 3, 4, 5]); // -> [[1, 2], [3], [4, 5]]
 */
var partitionWith = function partitionWith(f) {
    return function (xf) {
        var _ref14;

        var p = [],
            _xs,
            cur,
            last;
        return _ref14 = {}, defineProperty(_ref14, INIT, function () {
            return xf[INIT]();
        }), defineProperty(_ref14, STEP, function (xs, v) {
            cur = f(v);
            if (p.length < 1) {
                last = cur;
                p.push(v);
                return xs;
            }
            if (last === cur) {
                p.push(v);
                return xs;
            }
            last = cur;
            _xs = xf[STEP](xs, p);
            p = [v];
            return _xs;
        }), defineProperty(_ref14, RESULT, function (v) {
            if (p.length > 0) {
                return xf[RESULT](xf[STEP](v, p));
            }
            return xf[RESULT](v);
        }), _ref14;
    };
};



var Transducers = Object.freeze({
	fold: fold$3,
	transduce: transduce,
	into: into,
	map: map$2,
	filter: filter$2,
	flatten: flatten$3,
	drop: drop$2,
	dropWhile: dropWhile$2,
	take: take$2,
	takeWhile: takeWhile$2,
	keep: keep$2,
	unique: unique$2,
	partition: partition,
	partitionWith: partitionWith
});

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Implementation of different monoids
 * @module futils/monoids
 */

var VAL = Symbol('MonoidalValue');
var id$2 = function id$2(a) {
    return a || null;
};

/**
 * Creates new instances of the Unit monoid. In vanilla JavaScript, the only
 *     members of the Unit category are null and undefined.
 * @class module:futils/monoids.Unit
 * @member Unit
 * @version 2.4.0
 *
 * @example
 * const {Unit, id} = require('futils');
 *
 * let one = Unit.of(1) or new Unit(1)
 * one.fold(id); // -> null
 * one.concat(one).fold(id); // -> null
 * Unit.empty().concat(one).fold(id); // -> null
 * one.concat(Unit.empty()).fold(id); // -> null
 */
var Unit = function () {
    function Unit() {
        classCallCheck(this, Unit);
        this[VAL] = null;
    }

    createClass(Unit, [{
        key: 'concat',
        value: function concat(monoid) {
            return monoid;
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f();
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Unit();
        }
    }, {
        key: 'of',
        value: function of() {
            return new Unit();
        }
    }]);
    return Unit;
}();

/**
 * Creates new instances of the Additive monoid. In vanilla JavaScript, values
 *     which are members of the Additive category are numbers and strings.
 * @class module:futils/monoids.Additive
 * @member Additive
 * @version 2.2.0
 *
 * @example
 * const {Additive, id} = require('futils');
 *
 * let one = Additive.of(1) or new Additive(1)
 * one.fold(id); // -> 1
 * one.concat(one).fold(id); // -> 2
 * Additive.empty().concat(one).fold(id); // -> 1
 * one.concat(Additive.empty()).fold(id); // -> 1
 */
var Additive$1 = function () {
    function Additive(a) {
        classCallCheck(this, Additive);

        this[VAL] = a;
    }

    createClass(Additive, [{
        key: 'concat',
        value: function concat(monoid) {
            return new Additive(this[VAL] + monoid[VAL]);
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Additive(0);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Additive(a);
        }
    }]);
    return Additive;
}();

/**
 * Creates new instances of the Multiple monoid. In vanilla JavaScript, values
 *     which are members of the Multiple category are numbers.
 * @class module:futils/monoids.Multiple
 * @member Multiple
 * @version 2.2.0
 *
 * @example
 * const {Multiple, id} = require('futils');
 *
 * let two = Multiple.of(2) or new Multiple(2)
 * two.fold(id); // -> 2
 * two.concat(two).fold(id); // -> 4
 * Multiple.empty().concat(two).fold(id); // -> 2
 * two.concat(Multiple.empty()).fold(id); // -> 2
 */
var Multiple$1 = function () {
    function Multiple(a) {
        classCallCheck(this, Multiple);

        this[VAL] = a;
    }

    createClass(Multiple, [{
        key: 'concat',
        value: function concat(monoid) {
            return new Multiple(this[VAL] * monoid[VAL]);
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Multiple(1);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Multiple(a);
        }
    }]);
    return Multiple;
}();

/**
 * Creates new instances of the All monoid. In vanilla JavaScript, values
 *     which are members of the All category are booleans.
 * @class module:futils/monoids.All
 * @member All
 * @version 2.2.0
 *
 * @example
 * const {All, id} = require('futils');
 *
 * let truth = All.of(true) or new All(true)
 * truth.fold(id); // -> true
 * truth.concat(truth).fold(id); // -> true
 * All.empty().concat(truth).fold(id); // -> true
 * truth.concat(All.empty()).fold(id); // -> true
 */
var All$1 = function () {
    function All(a) {
        classCallCheck(this, All);

        this[VAL] = a;
    }

    createClass(All, [{
        key: 'concat',
        value: function concat(monoid) {
            return new All(this[VAL] && monoid[VAL]);
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new All(true);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new All(a);
        }
    }]);
    return All;
}();

/**
 * Creates new instances of the Any monoid. In vanilla JavaScript, values
 *     which are members of the Any category are booleans.
 * @class module:futils/monoids.Any
 * @member Any
 * @version 2.2.0
 *
 * @example
 * const {Any, id} = require('futils');
 *
 * let truth = Any.of(true) or new Any(true)
 * truth.fold(id); // -> true
 * truth.concat(truth).fold(id); // -> true
 * Any.empty().concat(truth).fold(id); // -> true
 * truth.concat(Any.empty()).fold(id); // -> true
 */
var Any$1 = function () {
    function Any(a) {
        classCallCheck(this, Any);

        this[VAL] = a;
    }

    createClass(Any, [{
        key: 'concat',
        value: function concat(monoid) {
            return new Any(this[VAL] || monoid[VAL]);
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Any(false);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Any(a);
        }
    }]);
    return Any;
}();

/**
 * Creates new instances of the Fn monoid. In vanilla JavaScript, values
 *     which are members of the Fn category are functions.
 * @class module:futils/monoids.Fn
 * @member Fn
 * @version 2.2.0
 *
 * @example
 * const {Fn, id} = require('futils');
 *
 * let mf = Fn.of(2) or new Fn(() => 2)
 * mf.fold(id); // -> 2
 * mf.concat(Fn.of((n) => n * n)).fold(id); // -> 4
 * Fn.empty().concat(mf).fold(id); // -> 2
 * mf.concat(Fn.empty()).fold(id); // -> 2
 */
var Fn$1 = function () {
    function Fn(a) {
        classCallCheck(this, Fn);

        this[VAL] = a;
    }

    createClass(Fn, [{
        key: 'concat',
        value: function concat(monoid) {
            var _this = this;

            return new Fn(function (a) {
                return monoid[VAL](_this[VAL](a));
            });
        }
    }, {
        key: 'fold',
        value: function fold(f, a) {
            return f(this[VAL](a));
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Fn(id$2);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Fn(function () {
                return a;
            });
        }
    }]);
    return Fn;
}();

/**
 * Creates new instances of the Min monoid. In vanilla JavaScript, values
 *     which are members of the Min category are numbers.
 * @class module:futils/monoids.Min
 * @member Min
 * @version 2.2.0
 *
 * @example
 * const {Min, id} = require('futils');
 *
 * let two = Min.of(2) or new Min(2)
 * two.fold(id); // -> 2
 * two.concat(Min.of(1)).fold(id); // -> 1
 * Min.empty().concat(two).fold(id); // -> 2
 * two.concat(Min.empty()).fold(id); // -> 2
 */
var Min$1 = function () {
    function Min(a) {
        classCallCheck(this, Min);

        this[VAL] = a;
    }

    createClass(Min, [{
        key: 'concat',
        value: function concat(monoid) {
            return new Min(Math.min(this[VAL], monoid[VAL]));
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Min(Infinity);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Min(a);
        }
    }]);
    return Min;
}();

/**
 * Creates new instances of the Max monoid. In vanilla JavaScript, values
 *     which are members of the Max category are numbers. 
 * @class module:futils/monoids.Max
 * @member Max
 * @version 2.2.0
 *
 * @example
 * const {Max, id} = require('futils');
 *
 * let one = Max.of(1) or new Max(1)
 * one.fold(id); // -> 1
 * one.concat(Max.of(2)).fold(id); // -> 2
 * Max.empty().concat(one).fold(id); // -> 1
 * one.concat(Max.empty()).fold(id); // -> 1
 */
var Max$1 = function () {
    function Max(a) {
        classCallCheck(this, Max);

        this[VAL] = a;
    }

    createClass(Max, [{
        key: 'concat',
        value: function concat(monoid) {
            return new Max(Math.max(this[VAL], monoid[VAL]));
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Max(-Infinity);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Max(a);
        }
    }]);
    return Max;
}();

/**
 * Creates new instances of the Dict monoid. In vanilla JavaScript, values
 *     which are members of the Dict category are objects and prototypes.
 * @class module:futils/monoids.Dict
 * @member Dict
 * @version 2.2.0
 *
 * @example
 * const {Dict, id} = require('futils');
 *
 * let one = Dict.of({price: 1}) or new Dict({price: 1})
 * one.fold(id); // -> {price: 1}
 * one.concat(Dict.of({count: 10})).fold(id); // -> {price: 1, count: 10}
 * Dict.empty().concat(one).fold(id); // -> {price: 1}
 * one.concat(Dict.empty()).fold(id); // -> {price: 1}
 */
var Dict$1 = function () {
    function Dict(a) {
        classCallCheck(this, Dict);

        this[VAL] = a;
    }

    createClass(Dict, [{
        key: 'concat',
        value: function concat(monoid) {
            return new Dict(Object.assign({}, this[VAL], monoid[VAL]));
        }
    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this[VAL]);
        }
    }], [{
        key: 'empty',
        value: function empty() {
            return new Dict({});
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Dict(a);
        }
    }]);
    return Dict;
}();

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * Implementation of a Union type factory
 * @module futils/uniontypes
 * @requires futils/types
 * @requires futils/decorators
 * @requires futils/operators
 */

var VAL$1 = Symbol('TypeValue');
var TYPE = Symbol('TypeName');

var makeType = function makeType(name, def) {
    function TypeCtor(x) {
        var self = instance$1(TypeCtor, this);
        self[TYPE] = name;
        if (isFunc$1(def) && def(x)) {
            self[VAL$1] = x;
            return self;
        }
        if (isObject$1(def)) {
            if (Object.keys(def).reduce(function (b, k) {
                return b && !!def[k](x[k]);
            }, true)) {
                self[VAL$1] = x;
                return self;
            }
        }
        throw 'Constructor ' + name + ' got invalid value ' + JSON.stringify(x);
    }

    TypeCtor.prototype.toString = function () {
        return name + '(' + this[VAL$1] + ')';
    };

    TypeCtor.prototype.valueOf = function () {
        return this[VAL$1];
    };

    TypeCtor.prototype.fold = function (f) {
        return f(this[VAL$1]);
    };

    TypeCtor.of = function (x) {
        return new TypeCtor(x);
    };

    return TypeCtor;
};

/**
 * The Type function allows to create `Union-Types` from descriptors. A descriptor
 *     can either be a function of the form `a -> Boolean` or a object in the
 *     form Object(TypeName: a -> transformation(a), orElse: a -> ? ) where
 *     the `orElse` clause handle the case that no pattern key matched (this is
 *     better known as a catamorphism). Please note that you cannot omit the
 *     `orElse` clause!
 * @method
 * @version 2.1.0
 * @param {string} name Name of the Type to create
 * @param {function|object} def Function or descriptor
 * @return {SubType} A new Type constructor
 *
 * @example
 * const {Type, field, isArray, isDate, isString} = require('futils');
 *
 * const List = Type('List', isArray);
 * 
 * List.fold = Type.cata({
 *     List: (xs) => xs,
 *     orElse: () => []
 * });
 *
 * 
 * const ns = List([1, 2, 3]); // or List.of([1, 2, 3])
 *
 * Type.isType(ns); // -> true
 * 
 * List.fold(ns); // -> [1, 2, 3]
 * ns.fold((xs) => xs); // -> [1, 2, 3]
 *
 * List.fold(null); // -> []
 *
 *
 *
 *
 * 
 * const Page = Type('DiaryPage', {
 *     date: isDate,
 *     title: isString,
 *     text: isString
 * });
 * 
 * const Chapter = Type('DiaryChapter', {
 *     title: isString,
 *     pages: isArray
 * });
 *
 * const title = field('title');
 * const format = Type.cata({
 *     Page: (e) => `${e.title} written on ${e.date.toISOString()}: ${e.text}`,
 *     Chapter: (c) => `- ${c.title} -\n ` + c.pages.map(title).join('\n'),
 *     orElse: () => ''
 * });
 *
 * 
 * let page = Page({
 *     title: 'First page',
 *     date: new Date(),
 *     text: 'A text page.'
 * });
 * 
 * let chapter = Chapter({title: 'Chapter 1', pages: [page]});
 *
 * format(page); // -> 'First page written on 2017-01-19: A text page.'
 * format(chapter); // -> '- Chapter 1 -\n First page\n'
 * format(null); // -> ''
 */
var Type$1 = curry$1(makeType);

Type$1.isType = function (a) {
    return isObject$1(a) && !isVoid$1(a[VAL$1]) && isString$1(a[TYPE]);
};

Type$1.cata = curry$1(function (cases, tval) {
    if (isFunc$1(cases.orElse)) {
        // has orElse clause?
        if (Type$1.isType(tval)) {
            // is tval a Type?
            if (isFunc$1(cases[tval[TYPE]])) {
                // is there a case for tval?
                return cases[tval[TYPE]](tval[VAL$1]);
            }
            return cases.orElse(tval[VAL$1]);
        }
        return cases.orElse(tval);
    }
    throw 'Type.cata :: Found no "orElse" case in ' + cases;
});

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * Implementation of the Identity monad
 * @module futils/monads/identity
 * @requires futils/types
 */

var MV = Symbol('MonadicValue');

/**
 * The Identity monad class
 * @class module:futils/monads/identity.Identity
 * @version 2.0.0
 */
var Identity$1 = function () {
    function Identity(a) {
        classCallCheck(this, Identity);

        this.value = a;
    }

    createClass(Identity, [{
        key: 'toString',


        /**
         * Returns a string representation of the instance
         * @method toString
         * @memberof module:futils/monads/identity.Identity
         * @return {string} String representation of the calling instance
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * one.toString(); // -> "Identity(1)"
         */
        value: function toString() {
            return 'Identity(' + this.value + ')';
        }

        /**
         * Returns true if given a instance of the class
         * @method is
         * @memberof module:futils/monads/identity.Identity
         * @static
         * @param {any} a Value to check
         * @return {boolean} True if instance of the class
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * Identity.is(one); // -> true
         */

    }, {
        key: 'equals',


        // -- Setoid 
        /**
         * Given another Setoid, checks if they are equal
         * @method equals
         * @memberof module:futils/monads/identity.Identity
         * @param {Setoid} b Setoid to compare against
         * @return {boolean} True if both are equal
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         * let one_b = Identity.of(1);
         * let two = Identity.of(2);
         *
         * one.equals(one_b); // -> true
         * one.equals(two); // -> false
         */
        value: function equals(b) {
            return Identity.prototype.isPrototypeOf(b) && b.value === this.value;
        }
        // -- Functor
        /**
         * Maps a function `f` over the value inside the Functor
         * @method map
         * @memberof module:futils/monads/identity.Identity
         * @param {function} f Function to map with
         * @return {Identity} New instance of the Functor
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * const inc = (a) => a + 1;
         *
         * one.map(inc); // -> Identity(2)
         */

    }, {
        key: 'map',
        value: function map(f) {
            if (isFunc$1(f)) {
                return new Identity(f(this.value));
            }
            throw 'Identity::map expects argument to be function but saw ' + f;
        }
        // -- Applicative
        /**
         * Creates a new instance of a Identity wrapping the given value `a`. Use
         *     `.of` instead of the constructor together with `new`
         * @method of
         * @memberof module:futils/monads/identity.Identity
         * @static
         * @param {any} a Any value
         * @return {Identity} New instance of the Applicative
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * one.value; // -> 1
         */

    }, {
        key: 'of',
        value: function of(a) {
            return Identity.of(a);
        }

        /**
         * Applies a wrapped function to a given Functor and returns a new instance
         *     of the Functor
         * @method ap
         * @memberof module:futils/monads/identity.Identity
         * @param {Functor} m Functor to apply the Applicative to
         * @return {Identity} New instance of the Functor
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * const aInc = Identity.of((a) => a + 1);
         *
         * aInc.ap(one); // -> Identity(2)
         */

    }, {
        key: 'ap',
        value: function ap(m) {
            if (isFunc$1(m.map)) {
                return m.map(this.value);
            }
            throw 'Identity::ap expects argument to be Functor but saw ' + m;
        }
        // -- Monad
        /**
         * Chains function calls which return monads into a single monad
         * @method flatMap
         * @memberof module:futils/monads/identity.Identity
         * @param {function} f Function returning a monad
         * @return {Identity} New instance of the calling monads type
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * const mInc = (n) => Identity.of(1).map((m) => n + m);
         *
         * one.flatMap(mInc); // -> Identity(2);
         */

    }, {
        key: 'flatMap',
        value: function flatMap(f) {
            if (isFunc$1(f)) {
                return this.map(f).value;
            }
            throw 'Identity::flatMap expects argument to be function but saw ' + f;
        }

        /**
         * Flattens down a nested monad one level and returns a new monad containing
         *     the inner value
         * @method flatten
         * @memberof module:futils/monads/identity.Identity
         * @return {Identity} New instance of the monad
         *
         * @example
         * const {Identity} = require('futils');
         *
         * let one = Identity.of(Identity.of(1));
         *
         * one.flatten(); // -> Identity(1)
         */

    }, {
        key: 'flatten',
        value: function flatten() {
            return this.value;
        }
        // -- Foldable
        // reduce

    }, {
        key: 'fold',
        value: function fold(f) {
            return f(this.value);
        }
        // -- Bifunctor
        // biMap, Functor
        // -- Profunctor
        // proMap, Functor
        // -- Monoid
        // empty, Semigroup
        // -- Traversable


        /**
         * Takes a function from some value to a Functor and an Applicative and
         *     returns a instance of the Applicative either with a Some or a None
         * @method traverse
         * @memberof module:futils/monads/identity.Identity 
         * @param {function} f Function from a to Applicative(a)
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} A(Identity(a))
         *
         * @example
         * const {Maybe, Identity} = require('futils');
         *
         * const one = Identity.of(1);
         *
         * // Note: ::traverse doesn't need it's second parameter but
         * //   the type signature stays the same (because this is the
         * //   Identity monod)
         * 
         * one.traverse(Maybe.of, Maybe);
         * // -> Some(Identity(1))
         */

    }, {
        key: 'traverse',
        value: function traverse(f, A) {
            if (isFunc$1(f)) {
                return this.fold(function (x) {
                    return f(x).map(Identity.of);
                });
            }
            throw 'Identity::traverse expects function but saw ' + f;
        }

        /**
         * Takes an Applicative and returns a instance of the Applicative
         *     either with a Some or a None
         * @method sequence
         * @memberof module:futils/monads/identity.Identity 
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} A(Identity(a))
         *
         * @example
         * const {Maybe, Identity} = require('futils');
         *
         * const one = Identity.of(Maybe.of(1));
         *
         * one.sequence(Maybe); // -> Some(Identity(1));
         */

    }, {
        key: 'sequence',
        value: function sequence(A) {
            return this.traverse(function (a) {
                return a;
            }, A);
        }
        // -- Semigroup

    }, {
        key: 'concat',
        value: function concat(S) {
            return this.fold(function (a) {
                return Identity.of(a.concat(S.value));
            });
        }
    }, {
        key: 'value',
        set: function set(a) {
            this[MV] = a;
        },
        get: function get() {
            return this[MV];
        }
    }], [{
        key: 'is',
        value: function is(a) {
            return Identity.prototype.isPrototypeOf(a);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Identity(a);
        }
    }]);
    return Identity;
}();

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * Implementation of the Maybe monad
 * @module futils/monads/maybe
 * @requires futils/types
 */

var MV$1 = Symbol('MonadicValue');

/**
 * Implementation of the Maybe monad
 * @class module:futils/monads/maybe.Maybe
 * @static
 * @version 2.0.0
 */
var Maybe$1 = function () {
    function Maybe(a) {
        classCallCheck(this, Maybe);

        this.value = a;
    }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/maybe.Maybe
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     * let nothing = Maybe.of(null);
     *
     * one.toString(); // -> "Some(1)"
     * nothing.toString(); // -> "None"
     */


    createClass(Maybe, [{
        key: 'toString',
        value: function toString() {
            return 'Maybe';
        }

        /**
         * Creates either a Maybe.None or a Maybe.Some from a given Either.Left or
         *     a Either.Right monad
         * @method fromEither
         * @memberof module:futils/monads/maybe.Maybe
         * @static
         * @param {Left|Right} m The Either instance to transform
         * @return {None|Some} None or Some wrapper
         *
         * @example
         * const {Maybe, Left, Right} = require('futils');
         *
         * let left = Left.of('This is a failure');
         * let right = Right.of('This is a success');
         *
         * let nothing = Maybe.fromEither(left);
         * let some = Maybe.fromEither(right);
         *
         * nothing; // -> None(null)
         * some; // -> Some('This is a success')
         */

    }, {
        key: 'isSome',


        /**
         * Returns true if called on a Some and false if called on a None
         * @method isSome
         * @memberof module:futils/monads/maybe.Maybe
         * @return {boolean} True
         */
        value: function isSome() {
            return this.value != null;
        }

        // -- Setoid
        /**
         * Given another Setoid, checks if they are equal
         * @method equals
         * @memberof module:futils/monads/maybe.Maybe
         * @param {Setoid} b Setoid to compare against
         * @return {boolean} True if both are equal
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         * let one_b = Maybe.of(1);
         * let two = Maybe.of(2);
         *
         * one.equals(one_b); // -> true
         * one.equals(two); // -> false
         */

    }, {
        key: 'equals',
        value: function equals(b) {
            return Maybe.prototype.isPrototypeOf(b) && b.value === this.value;
        }
        // -- Functor
        /**
         * Maps a function `f` over the value inside the Functor
         * @method map
         * @memberof module:futils/monads/maybe.Maybe
         * @param {function} f Function to map with
         * @return {Maybe} New instance of the Functor
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         *
         * const inc = (a) => a + 1;
         *
         * one.map(inc); // -> Some(2)
         */

    }, {
        key: 'map',
        value: function map(f) {
            return this.fold(function () {
                return new None$1();
            }, function (s) {
                return Maybe.of(f(s));
            });
        }
        // -- Applicative
        /**
         * Creates a new instance of a Maybe wrapping the given value `a`. Use
         *     `.of` instead of the constructor together with `new`
         * @method of
         * @memberof module:futils/monads/maybe.Maybe
         * @static
         * @param {any} a Any value
         * @return {Maybe} New instance of the Applicative
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         *
         * one.value; // -> 1
         */

    }, {
        key: 'of',
        value: function of(a) {
            return Maybe.of(a);
        }

        /**
         * Applies a wrapped function to a given Functor and returns a new instance
         *     of the Functor
         * @method ap
         * @memberof module:futils/monads/maybe.Maybe
         * @param {Functor} F Functor to apply the Applicative to
         * @return {Maybe} New instance of the Functor
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         *
         * const aInc = Maybe.of((a) => a + 1);
         *
         * aInc.ap(one); // -> Some(2)
         */

    }, {
        key: 'ap',
        value: function ap(F) {
            return this.fold(function () {
                return F;
            }, function (s) {
                return F.map(s);
            });
        }
        // -- Monad
        /**
         * Chains function calls which return monads into a single monad
         * @method flatMap
         * @memberof module:futils/monads/maybe.Maybe
         * @param {function} f Function returning a monad
         * @return {Maybe} New instance of the calling monads type
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         *
         * const mInc = (n) => Maybe.of(1).map((m) => n + m);
         *
         * one.flatMap(mInc); // -> Some(2);
         */

    }, {
        key: 'flatMap',
        value: function flatMap(f) {
            return this.map(f).flatten();
        }

        /**
         * Flattens down a nested monad one level and returns a new monad containing
         *     the inner value
         * @method flatten
         * @memberof module:futils/monads/maybe.Maybe
         * @return {Maybe} New instance of the monad
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(Maybe.of(1));
         *
         * one.flatten(); // -> Some(1)
         */

    }, {
        key: 'flatten',
        value: function flatten() {
            return this.isSome() ? this.value : this;
        }
        // -- Recovering

        /**
         * Allows recovering into a final value if the operation comes to a dead
         *     end
         * @method orGet
         * @memberof module:futils/monads/maybe.Maybe
         * @param {any} x Recovery value if operating on a None
         * @return {any} The recovery value on a None, the value on a Some
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * const one = Maybe.of(1);
         * const none = Maybe.empty();
         *
         * one.orGet('recover!'); // -> 1
         * none.orGet('recover!'); // -> 'recover!'
         */

    }, {
        key: 'orGet',
        value: function orGet(a) {
            return this.isSome() ? this.value : a;
        }

        /**
         * Allows recovering into a new Some if the operation comes to a dead
         *     end
         * @method orElse
         * @memberof module:futils/monads/maybe.Maybe
         * @param {any} x Recovery value if operating on a Left
         * @return {Some} Either a Some of the recovery or the value
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * const one = Maybe.of(1);
         * const none = Maybe.empty();
         *
         * one.orElse('recover!'); // -> Some(1)
         * none.orElse('recover!'); // -> Some('recover!')
         */

    }, {
        key: 'orElse',
        value: function orElse(a) {
            return this.isSome() ? this : Maybe.of(a);
        }

        // -- Foldable
        /**
         * Given two functions, folds the first over the instance if it reflects
         *     None and the second over the instance if it reflects Some
         * @method fold
         * @memberof module:futils/monads/maybe.Maybe
         * @param {function} f Function handling the None case
         * @param {function} g Function handling the Some case
         * @return {any} Whatever f or g return
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         * let nothing = Maybe.of(null);
         *
         * const fail = () => 'No int!';
         * const success = (n) => `Given ${n}!`;
         *
         * one.fold(fail, success); // -> 'Given 2!';
         * none.fold(fail, success); // -> 'No int!';
         */

    }, {
        key: 'fold',
        value: function fold(f, g) {
            if (this.isSome()) {
                return g(this.value);
            }
            return f(this.value);
        }

        /**
         * Implementation of the catamorphism. Given a object with `None` and `Some`
         *     fields (functions) pipes the current value through the corresponding
         *     function
         * @method cata   
         * @memberof module:futils/monads/maybe.Maybe
         * @param {object} o Object with `None` and `Some`
         * @return {any} Result of applying the functions to the current value
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         * let nothing = Maybe.of(null);
         *
         * one.cata({
         *     None: () => 'Nothing found',
         *     Some: (n) => 'Found number of ' + n
         * });
         * // -> 'Found number of 1'
         *
         * nothing.cata({
         *     None: () => 'Nothing found',
         *     Some: (n) => 'Found number of ' + n
         * });
         * // -> 'Nothing found'
         */

    }, {
        key: 'cata',
        value: function cata(_ref) {
            var None = _ref.None,
                Some = _ref.Some;

            return this.fold(None, Some);
        }

        /**
         * Takes a function from some value to a Functor and an Applicative and
         *     returns a instance of the Applicative either with a Some or a None
         * @method traverse
         * @memberof module:futils/monads/maybe.Maybe 
         * @param {function} f Function from a to Applicative(a)
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} Either A(Some(x)) or A(None)
         *
         * @example
         * const {Maybe, Identity} = require('futils');
         *
         * const one = Identity.of(1);
         *
         * // Note: ::traverse needs it's second parameter, because the Maybe
         * //   type may-be None so leaving the second argument blank results
         * //   in the instance not knowing where to traverse to in a None case
         * 
         * one.traverse(Maybe.of, Maybe);
         * // -> Some(Identity(1))
         */

    }, {
        key: 'traverse',
        value: function traverse(f, A) {
            return this.fold(function () {
                return A.of(new None$1());
            }, function (x) {
                return f(x).map(Maybe.of);
            });
        }

        /**
         * Takes an Applicative and returns a instance of the Applicative
         *     either with a Some or a None
         * @method sequence
         * @memberof module:futils/monads/maybe.Maybe 
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} Either A(Some(x)) or A(None)
         *
         * @example
         * const {Maybe, Identity} = require('futils');
         *
         * const one = Maybe.of(Identity.of(1));
         *
         * one.sequence(Identity); // -> Identity(Some(1));
         */

    }, {
        key: 'sequence',
        value: function sequence(A) {
            return this.traverse(function (a) {
                return a;
            }, A);
        }

        // -- Bifunctor
        /**
         * Given two functions, maps the first over the instance if it reflects None
         *     and the second if it reflects Some. Wraps the result into a new
         *     Bifunctor of the same type before returning
         * @method biMap   
         * @memberof module:futils/monads/maybe.Maybe 
         * @param {function} f Function to map if None
         * @param {function} g Function to map if Some
         * @return {Maybe} Result in a new container
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         * let nothing = Maybe.of(null);
         *
         * const fail = () => 'No int :(';
         * const success = (n) => `Given ${n}!`;
         *
         * one.biMap(fail, success); // -> Some('Given 1!')
         * nothing.biMap(fail, success); // -> Some('No int :(')
         */

    }, {
        key: 'biMap',
        value: function biMap(f, g) {
            if (isFunc$1(f) && isFunc$1(g)) {
                return Maybe.of(this.fold(f, g));
            }
            throw 'Maybe::biMap expects functions but saw ' + f + ', ' + g;
        }

        // Semigroup
        /**
         * Concatenates this member of a semigroup with another member of
         *     the same semigroup
         * @method concat
         * @memberof module:futils/monads/maybe.Maybe 
         * @param {Maybe} S Other member of the same semigroup
         * @return {Maybe} Both Maybes concatenated
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * const hello = Maybe.of('hello ');
         * const world = Maybe.of('world');
         *
         * hello.concat(world); // -> Some('hello world')
         */

    }, {
        key: 'concat',
        value: function concat(S) {
            return this.fold(function () {
                return S;
            }, function (s) {
                return S.isSome() ? Some$1.of(s.concat(S.value)) : Some$1.of(s);
            });
        }

        // Monoid
        // * @memberof module:futils/monads/maybe.Maybe 
        /**
         * Returns the Unit instance of a Maybe
         * @method empty
         * @return {None} A new None
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * const str = Maybe.of('hello world');
         *
         * str.concat(Maybe.empty()); // -> Some('hello world')
         * Maybe.empty().concat(str); // -> Some('hello world')
         */

    }], [{
        key: 'fromEither',
        value: function fromEither(m) {
            return m.fold(None$1.of, Maybe.of);
        }

        /**
         * Returns true if given a instance of the class
         * @method is
         * @memberof module:futils/monads/maybe.Maybe
         * @static
         * @param {any} a Value to check
         * @return {boolean} True if instance of the class
         *
         * @example
         * const {Maybe} = require('futils');
         *
         * let one = Maybe.of(1);
         *
         * Maybe.is(one); // -> true
         */

    }, {
        key: 'is',
        value: function is(a) {
            return Maybe.prototype.isPrototypeOf(a);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return isNil$1(a) ? new None$1() : new Some$1(a);
        }
    }, {
        key: 'empty',
        value: function empty() {
            return new None$1();
        }
    }]);
    return Maybe;
}();

/**
 * The Maybe.Some monad
 * @class module:futils/monads/maybe.Some
 * @version 2.0.0
 */
var Some$1 = function (_Maybe) {
    inherits(Some, _Maybe);

    function Some(a) {
        classCallCheck(this, Some);
        return possibleConstructorReturn(this, (Some.__proto__ || Object.getPrototypeOf(Some)).call(this, a));
    }

    createClass(Some, [{
        key: 'toString',
        value: function toString() {
            return 'Some(' + this.value + ')';
        }
    }, {
        key: 'value',
        set: function set(a) {
            this[MV$1] = a;
        },
        get: function get() {
            return this[MV$1];
        }
    }], [{
        key: 'of',
        value: function of(a) {
            return new Some(a);
        }
    }]);
    return Some;
}(Maybe$1);

/**
 * The Maybe.None monad
 * @class module:futils/monads/maybe.None
 * @version 2.0.0
 */
var None$1 = function (_Maybe2) {
    inherits(None, _Maybe2);

    function None() {
        classCallCheck(this, None);
        return possibleConstructorReturn(this, (None.__proto__ || Object.getPrototypeOf(None)).call(this, null));
    }

    createClass(None, [{
        key: 'toString',
        value: function toString() {
            return 'None';
        }
    }, {
        key: 'value',
        set: function set(a) {
            this[MV$1] = a;
        },
        get: function get() {
            return this[MV$1];
        }
    }], [{
        key: 'of',
        value: function of() {
            return new None();
        }
    }]);
    return None;
}(Maybe$1);

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * Implementation of the Either monad
 * @module futils/monads/either
 * @requires futils/types
 */

var MV$2 = Symbol('MonadicValue');
var IS_RIGHT = Symbol('Either.isRight');

var evalsRight = function evalsRight(x) {
    return !isNil$1(x) && !Error.prototype.isPrototypeOf(x);
};

var Either$1 = function () {
    function Either(l, r) {
        classCallCheck(this, Either);

        if (evalsRight(r)) {
            this.value = r;
            this[IS_RIGHT] = true;
            return this;
        }
        this.value = l && l.message ? l.message : l;
        this[IS_RIGHT] = false;
    }

    createClass(Either, [{
        key: 'toString',


        /**
         * Returns a string representation of the instance
         * @method toString
         * @memberof module:futils/monads/either.Either
         * @return {string} String representation of the calling instance
         *
         * @example
         * const {Right} = require('futils');
         *
         * let right = Right.of(1);
         *
         * right.toString(); // -> "Right(1)"
         */
        value: function toString() {
            return this.isRight() ? 'Right(' + this.value + ')' : 'Left(' + this.value + ')';
        }

        /**
         * Returns true if called on a Right and false if called on a Left
         * @method isRight
         * @memberof module:futils/monads/either.Either
         * @return {boolean} True
         */

    }, {
        key: 'isRight',
        value: function isRight() {
            return !!this[IS_RIGHT];
        }

        /**
         * Returns true if given a instance of the class
         * @method is
         * @memberof module:futils/monads/either.Either
         * @static
         * @param {any} a Value to check
         * @return {boolean} True if instance of the class
         *
         * @example
         * const {Either, Right} = require('futils');
         *
         * let one = Right.of(1);
         *
         * Either.is(one); // -> true
         */

    }, {
        key: 'equals',


        /**
         * Given another Setoid, checks if they are equal
         * @method equals
         * @memberof module:futils/monads/either.Either
         * @param {Setoid} b Setoid to compare against
         * @return {boolean} True if both are equal
         *
         * @example
         * const {Right} = require('futils');
         *
         * let one = Right.of(1);
         * let one_b = Right.of(1);
         * let two = Right.of(2);
         *
         * one.equals(one_b); // -> true
         * one.equals(two); // -> false
         */
        value: function equals(S) {
            return Either.is(S) && S.value === this.value;
        }

        /**
         * Applies a wrapped function to a given Functor and returns a new instance
         *     of the Functor
         * @method ap
         * @memberof module:futils/monads/either.Either
         * @param {Functor} m Functor to apply the Applicative to
         * @return {Right} New instance of the Functor
         *
         * @example
         * const {Right} = require('futils');
         *
         * let one = Right.of(1);
         *
         * const aInc = Right.of((a) => a + 1);
         *
         * aInc.ap(one); // -> Right(2)
         */

    }, {
        key: 'ap',
        value: function ap(F) {
            return this.fold(function () {
                return F;
            }, function (r) {
                return F.map(r);
            });
        }

        // -- Semigroup
        /**
         * Concatenates this member of a semigroup with another member of the
         *     same semigroup
         * @method concat
         * @memberof module:futils/monads/either.Either
         * @param {Either} S Other member of the same semigroup
         * @return {Either} Both eithers concatenated
         *
         * @example
         * const {Either} = require('futils');
         *
         * const hello = Either.of('hello ');
         * const world = Either.of('world');
         *
         * hello.concat(world); // -> Right('hello world')
         */

    }, {
        key: 'concat',
        value: function concat(S) {
            return this.fold(function () {
                return S;
            }, function (r) {
                return S.isRight() ? Right$1.of(r.concat(S.value)) : Right$1.of(r);
            });
        }

        /**
         * Returns the Unit instance of a Either
         * @method empty
         * @memberof module:futils/monads/either.Either
         * @static
         * @return {Left} A new Left
         *
         * @example
         * const {Either} = require('futils');
         *
         * const str = Either.of('hello world');
         *
         * str.concat(Either.empty()); // -> Right('hello world')
         * Either.empty().concat(str); // -> Right('hello world')
         */

    }, {
        key: 'map',

        /**
         * Maps a function `f` over the value inside the Functor
         * @method map
         * @memberof module:futils/monads/either.Either
         * @param {function} f Function to map with
         * @return {Right} New instance of the Functor
         *
         * @example
         * const {Right} = require('futils');
         *
         * let one = Right.of(1);
         *
         * const inc = (a) => a + 1;
         *
         * one.map(inc); // -> Right(2)
         */
        value: function map(f) {
            if (isFunc$1(f)) {
                return this.fold(function (l) {
                    return Left$1.of(l);
                }, function (r) {
                    return Right$1.of(f(r));
                });
            }
        }

        /**
         * Given a function, maps it if the instance is a Left and does nothing if
         *     it is a Right
         * @method mapLeft   
         * @memberof module:futils/monads/either.Either
         * @param {function} f Function to map
         * @return {Left|Right} A Left with updated value or a Right
         *
         * @example
         * const {Right, Left} = require('futils');
         *
         * let one = Right.of(1);
         * let nan = Left.of(NaN);
         *
         * const nanToZero = (x) => isNaN(x) ? 0 : x;
         *
         * one.mapLeft(nanToZero); // -> Right(1)
         * nan.mapLeft(nanToZero); // -> Left(0)
         */

    }, {
        key: 'mapLeft',
        value: function mapLeft(f) {
            return this.fold(function (l) {
                return Left$1.of(f(l));
            }, function (r) {
                return Right$1.of(r);
            });
        }

        /**
         * Chains function calls which return monads into a single monad
         * @method flatMap
         * @memberof module:futils/monads/either.Either
         * @param {function} f Function returning a monad
         * @return {Right} New instance of the calling monads type
         *
         * @example
         * const {Right} = require('futils');
         *
         * let one = Right.of(1);
         *
         * const mInc = (n) => Right.of(1).map((m) => n + m);
         *
         * one.flatMap(mInc); // -> Right(2);
         */

    }, {
        key: 'flatMap',
        value: function flatMap(f) {
            return this.map(f).flatten();
        }

        /**
         * Flattens down a nested monad one level and returns a new monad containing
         *     the inner value
         * @method flatten  
         * @memberof module:futils/monads/either.Either  
         * @return {Right} New instance of the monad
         *
         * @example
         * const {Right} = require('futils');
         *
         * let one = Right.of(Right.of(1));
         *
         * one.flatten(); // -> Right(1)
         */

    }, {
        key: 'flatten',
        value: function flatten() {
            return this.isRight() ? this.value : this;
        }
        /**
         * Given two functions, folds the first over the instance if it reflects a
         *     Left and the second over the instance if it reflects a Right
         * @method fold    
         * @memberof module:futils/monads/either.Either
         * @param {function} f Function handling the Left case
         * @param {function} g Function handling the Right case
         * @return {any} Whatever f or g return
         *
         * @example
         * const {Right, Left} = require('futils');
         *
         * let one = Right.of(1);
         * let nothing = Left.of(null);
         *
         * const fail = () => 'No int :(';
         * const success = (n) => `Given ${n}!`;
         *
         * one.fold(fail, success); // -> 'Given 2!';
         * none.fold(fail, success); // -> 'No int!';
         */

    }, {
        key: 'fold',
        value: function fold(left, right) {
            if (this.isRight()) {
                return right(this.value);
            }
            return left(this.value);
        }

        /**
         * Implementation of the catamorphism. Given a object with `Left` and `Right`
         *     fields (functions) pipes the current value through the corresponding
         *     function
         * @method cata   
         * @memberof module:futils/monads/either.Either
         * @param {object} o Object with `Left` and `Right`
         * @return {any} Result of applying the functions to the current value
         *
         * @example
         * const {Right, Left} = require('futils');
         *
         * let one = Right.of(1);
         * let nothing = Left.of(null);
         *
         * one.cata({
         *     Left: () => 'Nothing found',
         *     Right: (n) => 'Found number of ' + n
         * });
         * // -> 'Found number of 1'
         *
         * nothing.cata({
         *     Left: () => 'Nothing found',
         *     Right: (n) => 'Found number of ' + n
         * });
         * // -> 'Nothing found'
         */

    }, {
        key: 'cata',
        value: function cata(_ref) {
            var Left = _ref.Left,
                Right = _ref.Right;

            return this.fold(Left, Right);
        }

        /**
         * Takes a function from some value to a Functor and an
         *     Applicative and returns a instance of the Applicative
         *     either with a Left or a Right
         * @method traverse
         * @memberof module:futils/monads/either.Either
         * @param {function} f Function from a to Applicative(a)
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} Either A(Right(x)) or A(Left(x))
         *
         * @example
         * const {Right, Identity} = require('futils');
         *
         * const one = Right.of(1);
         * 
         * one.traverse(Identity.of, Identity);
         * // -> Identity(Right(1))
         */

    }, {
        key: 'traverse',
        value: function traverse(f, A) {
            return this.fold(function (l) {
                return A.of(l).map(Left$1.of);
            }, function (r) {
                return f(r).map(Right$1.of);
            });
        }

        /**
         * Takes an Applicative and returns a instance of the Applicative
         *     either with a Left or a Right
         * @method sequence
         * @memberof module:futils/monads/either.Either
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} Either A(Right(x)) or A(Left(x))
         *
         * @example
         * const {Right, Identity} = require('futils');
         *
         * const one = Right.of(Identity.of(1));
         *
         * one.sequence(Identity); // -> Identity(Right(1));
         */

    }, {
        key: 'sequence',
        value: function sequence(A) {
            return this.traverse(function (a) {
                return a;
            }, A);
        }

        /**
         * Given two functions, maps the first over the instance if it reflects Left
         *     and the second if it reflects Right. Wraps the result into a new
         *     Bifunctor of the same type before returning
         * @method biMap    
         * @memberof module:futils/monads/either.Either
         * @param {function} f Function to map if Left
         * @param {function} g Function to map if Right
         * @return {Right} Result in a new container
         *
         * @example
         * const {Right, Left} = require('futils');
         *
         * let one = Right.of(1);
         * let nothing = Left.of(null);
         *
         * const fail = () => 'No int :(';
         * const success = (n) => `Given ${n}!`;
         *
         * one.biMap(fail, success); // -> Right('Given 1!')
         * nothing.biMap(fail, success); // -> Left('No int :(')
         */

    }, {
        key: 'biMap',
        value: function biMap(left, right) {
            return this.fold(function (l) {
                return Left$1.of(left(l));
            }, function (r) {
                return Right$1.of(right(r));
            });
        }

        /**
         * Swaps a Left into a Right and a Right into a Left (swaps the disjunction)
         * @method swap
         * @memberof module:futils/monads/either.Either
         * @return {Left|Right} A Left or Right, depending on the instance
         *
         * @example
         * const {Right, Left} = require('futils');
         *
         * let one = Right.of(1);
         * let nan = Left.of(NaN);
         *
         * one.swap(); // -> Left(1);
         * nan.swap(); // -> Right(NaN)
         */

    }, {
        key: 'swap',
        value: function swap() {
            return this.fold(function (l) {
                return Right$1.of(l);
            }, function (r) {
                return Left$1.of(r);
            });
        }

        /**
         * Allows recovering into a final value if the operation comes to a dead
         *     end
         * @method orGet
         * @memberof module:futils/monads/either.Either
         * @param {any} x Recovery value if operating on a Left
         * @return {any} The recovery value on a Left, the value on a Right
         *
         * @example
         * const {Either} = require('futils');
         *
         * const one = Either.of(1);
         * const none = Either.empty();
         *
         * one.orGet('recover!'); // -> 1
         * none.orGet('recover!'); // -> 'recover!'
         */

    }, {
        key: 'orGet',
        value: function orGet(x) {
            return this.fold(function () {
                return x;
            }, function (a) {
                return a;
            });
        }
        /**
         * Allows recovering into a new Right if the operation comes to a dead
         *     end
         * @method orElse
         * @memberof module:futils/monads/either.Either
         * @param {any} x Recovery value if operating on a Left
         * @return {Right} Either a Right of the recovery or the value
         *
         * @example
         * const {Either} = require('futils');
         *
         * const one = Either.of(1);
         * const none = Either.empty();
         *
         * one.orElse('recover!'); // -> Right(1)
         * none.orElse('recover!'); // -> Right('recover!')
         */

    }, {
        key: 'orElse',
        value: function orElse(x) {
            return this.fold(function () {
                return evalsRight(x) ? Right$1.of(x) : Left$1.of(x);
            }, function (r) {
                return Right$1.of(r);
            });
        }
    }, {
        key: 'value',
        set: function set(a) {
            this[MV$2] = a;
        },
        get: function get() {
            return this[MV$2];
        }

        /**
         * Given a fallback and the value to create from, returns a Left with the
         *     fallback value if the actual value has been null or undefined and
         *     a Right if the value has any other value
         * @method fromNullable
         * @memberof module:futils/monads/either.Either
         * @static
         * @param {any} exc Fallback value
         * @param {any} a Value to wrap
         * @return {Left|Right} Either a Left with the fallback or a Right
         *
         * @example
         * const {Either} = require('futils');
         * 
         * Either.fromNullable(1); // -> Right(1)
         * Either.fromNullable(null); // -> Left(null)
         */

    }], [{
        key: 'fromNullable',
        value: function fromNullable(a) {
            if (evalsRight(a)) {
                return Right$1.of(a);
            }
            return Left$1.of(a);
        }

        /**
         * Creates a Either.Left or a Either.Right from a given Maybe.None or
         *     Maybe.Some
         * @method fromMaybe
         * @memberof module:futils/monads/either.Either
         * @static
         * @param {None|Some} m The Maybe instance to transform
         * @return {Left|Right} Left or Right wrapper
         *
         * @example
         * const {Maybe, Either} = require('futils');
         *
         * let some = Maybe.of(1);
         * let none = Maybe.of(null);
         *
         * Either.fromMaybe(some); // -> Right(1)
         * Either.fromMaybe(none); // -> Left(null)
         */

    }, {
        key: 'fromMaybe',
        value: function fromMaybe(m) {
            return m.fold(Either.empty, Either.of);
        }

        /**
         * Creates a Either.Left or a Either.Right from a given IO monad
         * @method fromIO
         * @memberof module:futils/monads/either.Either
         * @static
         * @param {IO} m IO monad instance
         * @return {Left|Right} Left or Right wrapper
         *
         * @example
         * const {Either, IO} = require('futils');
         *
         * let location = IO.of(window.location.href);
         * let fails = IO.of(window.local.href);
         *
         * Either.fromIO(location); // -> Right('...')
         * Either.fromIO(fails); // -> Left('TypeError: ...')
         */

    }, {
        key: 'fromIO',
        value: function fromIO(m) {
            for (var _len = arguments.length, ps = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                ps[_key - 1] = arguments[_key];
            }

            return Either.try(m.run).apply(undefined, ps);
        }

        /**
         * Given a function and (optional) partial arguments, returns a function if
         *     the given arguments are smaller than the functions arity, or executes
         *     the function and returns a Left on failure and a Right on success
         * @method try
         * @memberof module:futils/monads/either.Either
         * @static
         * @param {function} f Function to execute
         * @return {function} A function awaiting arguments to execute f
         *
         * @example
         * const {Either} = require('futils');
         *
         * const readUrl = () => window.location.href;
         * const fails = () => window.local.href;
         *
         * Either.try(readUrl)(); // -> Right(' ... ')
         * Either.try(fails)(); // -> Left('TypeError: ... ')
         */

    }, {
        key: 'try',
        value: function _try(f) {
            if (isFunc$1(f)) {
                return function () {
                    try {
                        var r = f.apply(undefined, arguments);
                        if (Either.is(r)) {
                            return r;
                        }
                        if (evalsRight(r)) {
                            return Right$1.of(r);
                        }
                        return Left$1.of(r);
                    } catch (exc) {
                        return Left$1.of(exc.message);
                    }
                };
            }
            throw 'Either::try expects argument to be function but saw ' + f;
        }
    }, {
        key: 'is',
        value: function is(x) {
            return Either.prototype.isPrototypeOf(x);
        }

        /**
         * Creates a new instance of a Right wrapping the given value `a`. Use
         *     `.of` instead of the constructor together with `new`
         * @method of
         * @memberof module:futils/monads/either.Either
         * @static
         * @param {any} a Any value
         * @return {Right} New instance of the Applicative
         *
         * @example
         * const {Right} = require('futils');
         *
         * let one = Right.of(1);
         *
         * one.value; // -> 1
         */

    }, {
        key: 'of',
        value: function of(a) {
            return Right$1.of(a);
        }
    }, {
        key: 'empty',
        value: function empty() {
            return Left$1.of(null);
        }
    }]);
    return Either;
}();

/**
 * The Either.Right monad class
 * @class module:futils/monads/either.Right
 * @version 2.0.0
 */
var Right$1 = function (_Either) {
    inherits(Right, _Either);

    function Right(a) {
        classCallCheck(this, Right);
        return possibleConstructorReturn(this, (Right.__proto__ || Object.getPrototypeOf(Right)).call(this, null, a));
    }

    createClass(Right, [{
        key: 'toString',
        value: function toString() {
            return 'Right(' + this.value + ')';
        }
    }, {
        key: 'value',
        set: function set(a) {
            this[MV$2] = a;
        },
        get: function get() {
            return this[MV$2];
        }
    }], [{
        key: 'of',
        value: function of(a) {
            return new Right(a);
        }
    }]);
    return Right;
}(Either$1);

/**
 * The Either.Left monad class
 * @class module:futils/monads/either.Left
 * @version 2.0.0
 */
var Left$1 = function (_Either2) {
    inherits(Left, _Either2);

    function Left(a) {
        classCallCheck(this, Left);
        return possibleConstructorReturn(this, (Left.__proto__ || Object.getPrototypeOf(Left)).call(this, a, null));
    }

    createClass(Left, [{
        key: 'toString',
        value: function toString() {
            return 'Left(' + this.value + ')';
        }
    }, {
        key: 'value',
        set: function set(a) {
            this[MV$2] = a;
        },
        get: function get() {
            return this[MV$2];
        }
    }], [{
        key: 'of',
        value: function of(a) {
            return new Left(a);
        }
    }]);
    return Left;
}(Either$1);

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * Implementation of the IO monad
 * @module futils/monads/io
 * @requires futils/types
 */

var MV$3 = Symbol('MonadicValue');

/**
 * The IO monad class
 * @class module:futils/monads/io.IO
 * @version 2.0.0
 */
var IO$1 = function () {
    function IO(a) {
        classCallCheck(this, IO);

        this.run = a;
    }

    createClass(IO, [{
        key: 'toString',


        /**
         * Returns a string representation of the instance
         * @method toString
         * @memberof module:futils/monads/io.IO
         * @return {string} String representation of the calling instance
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         *
         * one.toString(); // -> "IO"
         */
        value: function toString() {
            return 'IO';
        }

        /**
         * Returns true if given a instance of the class
         * @method is
         * @memberof module:futils/monads/io.IO
         * @static
         * @param {any} a Value to check
         * @return {boolean} True if instance of the class
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         *
         * IO.is(one); // -> true
         */

    }, {
        key: 'equals',


        // -- Setoid 
        /**
         * Given another Setoid, checks if they are equal
         * @method equals
         * @memberof module:futils/monads/io.IO
         * @param {Setoid} b Setoid to compare against
         * @return {boolean} True if both are equal
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         * let one_b = IO.of(1);
         * let two = IO.of(2);
         *
         * one.equals(one_b); // -> true
         * one.equals(two); // -> false
         */
        value: function equals(b) {
            return IO.prototype.isPrototypeOf(b) && this.run === b.run;
        }
        // -- Functor
        /**
         * Maps a function `f` over the value inside the Functor
         * @method map
         * @memberof module:futils/monads/io.IO
         * @param {function} f Function to map with
         * @return {IO} New instance of the Functor
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         *
         * const inc = (a) => a + 1;
         *
         * one.map(inc); // -> IO(2)
         */

    }, {
        key: 'map',
        value: function map(f) {
            if (isFunc$1(f)) {
                return new IO(compose$1(f, this.run));
            }
            throw 'IO::map expects argument to be function but saw ' + f;
        }
        // -- Applicative
        /**
         * Creates a new instance of a Identity wrapping the given value `a`. Use
         *     `.of` instead of the constructor
         * @method of
         * @memberof module:futils/monads/io.IO
         * @static
         * @param {any} a Any value
         * @return {IO} New instance of the Applicative
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         *
         * one.run(); // -> 1
         */

    }, {
        key: 'of',
        value: function of(a) {
            return IO.of(a);
        }

        /**
         * Applies a wrapped function to a given Functor and returns a new instance
         *     of the Functor
         * @method ap
         * @memberof module:futils/monads/io.IO
         * @param {Functor} m Functor to apply the Applicative to
         * @return {IO} New instance of the Functor
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         *
         * const aInc = IO.of((a) => a + 1);
         *
         * aInc.ap(one); // -> IO(2)
         */

    }, {
        key: 'ap',
        value: function ap(m) {
            if (isFunc$1(m.map)) {
                return m.map(this.run);
            }
            throw 'IO::ap expects argument to be Functor but saw ' + m;
        }
        // -- Monad
        /**
         * Chains function calls which return monads into a single monad
         * @method flatMap
         * @memberof module:futils/monads/io.IO
         * @param {function} f Function returning a monad
         * @return {IO} New instance of the calling monads type
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(1);
         *
         * const mInc = (n) => IO.of(n + 1);
         *
         * one.flatMap(mInc); // -> IO(2);
         */

    }, {
        key: 'flatMap',
        value: function flatMap(f) {
            if (isFunc$1(f)) {
                return this.map(f).run();
            }
            throw 'IO::flatMap expects argument to be function but saw ' + f;
        }

        /**
         * Flattens down a nested monad one level and returns a new monad containing
         *     the inner value
         * @method flatten
         * @memberof module:futils/monads/io.IO
         * @return {IO} New instance of the monad
         *
         * @example
         * const {IO} = require('futils');
         *
         * let one = IO.of(IO.of(1));
         *
         * one.flatten(); // -> IO(1)
         */

    }, {
        key: 'flatten',
        value: function flatten() {
            return this.run();
        }
    }, {
        key: 'fold',
        value: function fold(f, x) {
            return f(this.run(x));
        }

        /**
         * Takes a function from some value to a Functor and an 
         *     Applicative and returns a instance of the Applicative
         *     wrapping a IO
         * @method traverse
         * @memberof module:futils/monads/io.IO 
         * @param {function} f Function from a to Applicative(a)
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} A(IO(a))
         *
         * @example
         * const {IO, Identity} = require('futils');
         *
         * const one = IO.of(1);
         * 
         * one.traverse(Identity.of, Identity);
         * // -> Identity(IO(1))
         */

    }, {
        key: 'traverse',
        value: function traverse(f, A) {
            if (isFunc$1(f)) {
                return this.fold(function (x) {
                    return f(x).map(IO.of);
                });
            }
            throw 'IO::traverse expects function but saw ' + f;
        }

        /**
         * Takes an Applicative and returns a instance of the Applicative
         *      wrapping a IO
         * @method sequence
         * @memberof module:futils/monads/io.IO 
         * @param {Applicative} A Applicative constructor
         * @return {Applicative} A(IO(a))
         *
         * @example
         * const {IO, Identity} = require('futils');
         *
         * const one = IO.of(Identity.of(1));
         *
         * one.sequence(Identity); // -> Identity(IO(1));
         */

    }, {
        key: 'sequence',
        value: function sequence(A) {
            return this.traverse(id$1, A);
        }

        // -- Semigroup
        /**
         * Takes another member of the Semigroup and concatenates it
         *     with the IO instance
         * @method concat
         * @memberof module:futils/monads/io.IO
         * @param {Semigroup} M Other IO instance
         * @return {Semigroup} New IO
         *
         * @example
         * const {IO} = require('futils');
         *
         * const topScroll = new IO(() => window.scrollTop);
         * const winHeight = new IO((n) => n + window.innerHeight);
         *
         * const screenBottom = topScroll.concat(winHeight);
         *
         * screenBottom.run(); // -> Int
         */

    }, {
        key: 'concat',
        value: function concat(M) {
            return new IO(compose$1(M.run, this.run));
        }

        // -- Monoid
        /**
         * Returns the Unit instance of a IO
         * @method empty
         * @memberof module:futils/monads/io.IO
         * @static
         * @return {Monoid} The empty IO
         *
         * @example
         * const {IO} = require('futils');
         *
         * IO.of(1).concat(IO.empty()); // -> IO(1)
         * IO.empty().concat(IO.of(1)); // -> IO(1)
         */

    }, {
        key: 'try',


        /**
         * Takes a seed value and the computation in a try-catch block and
         *     returns the final value. Returns the error if an error occurs
         * @method try
         * @memberof module:futils/monads/io.IO
         * @param {any} [x] Optional seed value to run the computation with
         * @return {any|Error} Result of the computation
         */
        value: function _try(x) {
            try {
                return this.fold(id$1, x);
            } catch (exc) {
                return exc;
            }
        }
    }, {
        key: 'run',
        set: function set(a) {
            this[MV$3] = a;
        },
        get: function get() {
            return this[MV$3];
        }
    }], [{
        key: 'is',
        value: function is(a) {
            return IO.prototype.isPrototypeOf(a);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new IO(function () {
                return a;
            });
        }
    }, {
        key: 'empty',
        value: function empty() {
            return new IO(id$1);
        }
    }]);
    return IO;
}();

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * Implementation of the State monad
 * @module futils/monads/state
 * @requires futils/types
 */

var MV$4 = Symbol('MonadicValue');

/**
 * The State monad class
 * @class module:futils/monads/state.State
 * @version 2.2.0
 */
var State$1 = function () {
    function State(a) {
        classCallCheck(this, State);

        this.compute = a;
    }

    createClass(State, [{
        key: 'toString',


        /**
         * Returns a string representation of the instance
         * @method toString
         * @version 2.2.0
         * @memberof module:futils/monads/state.State
         * @return {string} String representation of the calling instance
         *
         * @example
         * const {State} = require('futils');
         *
         * let one = State.of(1);
         *
         * one.toString(); // -> "State"
         */
        value: function toString() {
            return 'State';
        }

        /**
         * Returns true if given a instance of the class
         * @method is
         * @memberof module:futils/monads/state.State
         * @static
         * @version 2.2.0
         * @param {any} a Value to check
         * @return {boolean} True if instance of the class
         *
         * @example
         * const {State} = require('futils');
         *
         * let one = State.of(1);
         *
         * State.is(one); // -> true
         */

    }, {
        key: 'map',


        // -- Setoid 
        // -- Functor
        /**
         * Maps a function `f` over the value inside the Functor
         * @method map
         * @memberof module:futils/monads/state.State
         * @version 2.2.0
         * @param {function} f Function to map with
         * @return {State} New instance of the Functor
         *
         * @example
         * const {State} = require('futils');
         *
         * let one = State.of(1);
         *
         * const inc = (a) => a + 1;
         *
         * one.map(inc); // -> State(2)
         */
        value: function map(f) {
            var _this = this;

            if (isFunc$1(f)) {
                return new State(function (b) {
                    var r = _this.compute(b);
                    return [f(r[0]), r[1]];
                });
            }
            throw 'State::map expects argument to be function but saw ' + f;
        }

        // -- Applicative
        /**
         * Creates a new instance of a State wrapping the given value `a`. Use
         *     `.of` instead of the constructor together with `new`
         * @method of
         * @memberof module:futils/monads/state.State
         * @static
         * @version 2.2.0
         * @param {any} a Any value
         * @return {State} New instance of the Applicative
         *
         * @example
         * const {State} = require('futils');
         *
         * let one = State.of(1);
         *
         * one.value; // -> 1
         */

    }, {
        key: 'of',
        value: function of(a) {
            return State.of(a);
        }

        /**
         * Applies a wrapped function to a given Functor and returns a new instance
         *     of the Functor
         * @method ap
         * @memberof module:futils/monads/state.State
         * @version 2.2.0
         * @param {Functor} m Functor to apply the Applicative to
         * @return {State} New instance of the Functor
         *
         * @example
         * const {State, Identity} = require('futils');
         *
         * let one = Identity.of(1);
         *
         * const aInc = State.of((a) => a + 1);
         *
         * aInc.ap(one); // -> Identity(2)
         */

    }, {
        key: 'ap',
        value: function ap(m) {
            var _this2 = this;

            if (isFunc$1(m.map)) {
                return m.map(function (a) {
                    return _this2.run()(a);
                });
            }
            throw 'State::ap expects argument to be Functor but saw ' + m;
        }
        // -- Monad
        /**
         * Chains function calls which return monads into a single monad
         * @method flatMap
         * @memberof module:futils/monads/state.State
         * @version 2.2.0
         * @param {function} f Function returning a monad
         * @return {State} New instance of the calling monads type
         *
         * @example
         * const {State} = require('futils');
         *
         * let one = State.of(1);
         *
         * const mInc = (n) => State.of(n + 1);
         *
         * one.flatMap(mInc); // -> State(2);
         */

    }, {
        key: 'flatMap',
        value: function flatMap(f) {
            var _this3 = this;

            if (isFunc$1(f)) {
                return new State(function (b) {
                    var r = _this3.compute(b);
                    return f(r[0]).compute(r[1]);
                });
            }
            throw 'State::flatMap expects argument to be function but saw ' + f;
        }

        /**
         * Flattens down a nested monad one level and returns a new monad containing
         *     the inner run
         * @method flatten
         * @memberof module:futils/monads/state.State
         * @version 2.2.0
         * @return {State} New instance of the monad
         *
         * @example
         * const {State} = require('futils');
         *
         * let one = State.of(State.of(1));
         *
         * one.flatten(); // -> State(1)
         */

    }, {
        key: 'flatten',
        value: function flatten() {
            var _this4 = this;

            return new State(function (b) {
                var r = _this4.compute(b);
                return r[0].compute(r[1]);
            });
        }
    }, {
        key: 'fold',
        value: function fold(f, x) {
            return f(this.run(x));
        }

        /**
         * Runs the computation and returns the final value
         * @method run
         * @memberof module:futils/monads/state.State
         * @version 2.2.0
         * @param {any} s Initial value
         * @return {any} Value of the final computation
         *
         * @example
         * const {State} = require('futils');
         *
         * const nums = [1, 2, 3, 4, 5];
         *
         * const add = (xs) => {
         *     if (xs.length < 1) { return State.get().flatMap(State.of); }
         *     return State.get().flatMap((sum) => {
         *         return State.put(sum + xs[0]).flatMap(() => add(xs.slice(1)));
         *     });
         * }
         *
         * add(nums).run(0); // -> 15
         */

    }, {
        key: 'run',
        value: function run(s) {
            return this.compute(s)[0];
        }

        /**
         * Runs the computation and returns the final state. Usually one uses 'run'
         *     and discards the intermediate state but in some cases it is useful
         *     to return the final state instead of the final value
         * @method exec
         * @memberof module:futils/monads/state.State
         * @version 2.2.0
         * @param {any} s Initial value
         * @return {any} Final state of the computation
         *
         * @example
         * const {State} = require('futils');
         *
         * const nums = [1, 2, 3, 4, 5];
         *
         * const add = (xs) => {
         *     if (xs.length < 1) { return State.get().flatMap(State.of); }
         *     return State.get().flatMap((sum) => {
         *         return State.put(sum + xs[0]).flatMap(() => add(xs.slice(1)));
         *     });
         * }
         *
         * add(nums).exec(0); // -> 15
         */

    }, {
        key: 'exec',
        value: function exec(s) {
            return this.compute(s)[1];
        }
    }, {
        key: 'compute',
        set: function set(a) {
            this[MV$4] = a;
        },
        get: function get() {
            return this[MV$4];
        }

        /**
         * Returns a new State which grabs whatever is the current state
         * @method get 
         * @memberof module:futils/monads/state.State
         * @static
         * @version 2.2.0
         * @return {State} New empty State
         *
         * @example
         * const {State} = require('futils');
         *
         * const prog = State.get().map((n) => n + 1).
         *                          map((n) => `The final value is: ${n}`);
         *
         * prog.run(2); // -> 'The final value is: 3'
         */

    }], [{
        key: 'get',
        value: function get() {
            return new State(function (s) {
                return [s, s];
            });
        }

        /**
         * Returns a completely new State without a value
         * @method put
         * @memberof module:futils/monads/state.State
         * @static
         * @version 2.2.0
         * @param {any} s The initial state
         * @return {State} A new State
         *
         * @example
         * const {State} = require('futils');
         *
         * const prog = State.get().flatMap((s) => State.put(n + 1));
         *
         * prog.exec(1); // -> 2
         */

    }, {
        key: 'put',
        value: function put(s) {
            return new State(function () {
                return [null, s];
            });
        }

        /**
         * Given a function, manipulates the current state and returns a new
         *     state without a value
         * @method modify
         * @memberof module:futils/monads/state.State
         * @static
         * @version 2.2.0
         * @param {function} f Function to manipulate the state with
         * @return {State} A new State
         *
         * @example
         * const {State} = require('futils');
         *
         * const prog = State.modify((s) => s + 1);
         *
         * prog.exec(1); // -> 2
         */

    }, {
        key: 'modify',
        value: function modify(f) {
            return State.get().flatMap(function (s) {
                return State.put(f(s));
            });
        }
    }, {
        key: 'is',
        value: function is(a) {
            return State.prototype.isPrototypeOf(a);
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new State(function (b) {
                return [a, b];
            });
        }
    }]);
    return State;
}();

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/* globals setImmediate, process, setTimeout */
/**
 * Implementation of the Task monad
 * @module futils/monads/task
 * @requires futils/types
 */

var RUN_PROG = Symbol('MonadicFork');
var CLEANUP = Symbol('MonadicCleanUp');

var delay = typeof setImmediate !== 'undefined' ? function (f) {
    return setImmediate(f);
} : typeof process !== 'undefined' ? function (f) {
    return process.nextTick(f);
} : function (f) {
    return setTimeout(f, 0);
};

var ofVoid = function ofVoid() {
    return void 0;
};

/**
 * The Task monad class
 * @class module:futils/monads/task.Task
 * @version 2.0.0
 */
var Task$1 = function () {
    function Task(a, b) {
        classCallCheck(this, Task);

        this.run = a;
        this.cleanUp = b;
    }

    createClass(Task, [{
        key: 'toString',


        /**
         * Returns a string representation of the instance
         * @method toString
         * @memberof module:futils/monads/task.Task
         * @return {string} String representation of the calling instance
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         *
         * one.toString(); // -> "Task"
         */
        value: function toString() {
            return 'Task';
        }

        /**
         * Returns true if given a instance of the class
         * @method is
         * @memberof module:futils/monads/task.Task
         * @static
         * @param {any} a Value to check
         * @return {boolean} True if instance of the class
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         *
         * Task.is(one); // -> true
         */

    }, {
        key: 'equals',


        // -- Setoid 
        /**
         * Given another Setoid, checks if they are equal
         * @method equals
         * @memberof module:futils/monads/task.Task
         * @param {Setoid} b Setoid to compare against
         * @return {boolean} True if both are equal
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let one_b = Task.resolve(1);
         * let two = Task.resolve(2);
         *
         * one.equals(one); // -> true
         * one.equals(one_b); // -> false
         * one.equals(two); // -> false
         */
        value: function equals(b) {
            return Task.prototype.isPrototypeOf(b) && b.run === this.run;
        }
        // -- Functor
        /**
         * Maps a function `f` over the value inside the Functor
         * @method map
         * @memberof module:futils/monads/task.Task
         * @param {function} f Function to map with
         * @return {Task} New instance of the Functor
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         *
         * const inc = (a) => a + 1;
         *
         * one.map(inc).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Resolved: 2"
         */

    }, {
        key: 'map',
        value: function map(f) {
            var _this = this;

            if (isFunc$1(f)) {
                return new Task(function (rej, res) {
                    return _this.run(function (mv) {
                        return rej(mv);
                    }, function (mv) {
                        return res(f(mv));
                    });
                }, this.cleanUp);
            }
            throw 'Task::map expects argument to be function but saw ' + f;
        }
        // -- Applicative
        /**
         * Creates a new instance of a Task. Use `.of` instead of the constructor 
         * @method of
         * @memberof module:futils/monads/task.Task
         * @static
         * @param {any} a Any value
         * @return {Task} New instance of the Applicative
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.of((rej, res) => res(1));
         *
         * one.run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         *
         * // logs "Resolved: 1"
         */

    }, {
        key: 'of',
        value: function of(a) {
            return Task.of(a);
        }

        /**
         * Applies a wrapped function to a given Functor and returns a new instance
         *     of the Functor
         * @method ap
         * @memberof module:futils/monads/task.Task
         * @param {Functor} m Functor to apply the Applicative to
         * @return {Task} New instance of the Functor
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         *
         * const aInc = Task.resolve((a) => a + 1);
         *
         * aInc.ap(one).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolve: ' + n)
         * );
         *
         * // logs "Resolved: 2"
         */

    }, {
        key: 'ap',
        value: function ap(m) {
            var meFork = this.run,
                themFork = m.run,
                meClean = this.cleanUp,
                themClean = m.cleanUp;

            var cleanBoth = function cleanBoth(_ref) {
                var _ref2 = slicedToArray(_ref, 2),
                    a = _ref2[0],
                    b = _ref2[1];

                meClean(a);
                themClean(b);
            };

            return new Task(function (rej, res) {
                var f = false,
                    fload = false,
                    v = false,
                    vload = false;
                var states = [],
                    rejected = false;

                var guardRej = function guardRej(mv) {
                    if (!rejected) {
                        rejected = true;
                        return rej(mv);
                    }
                };

                var guardRes = function guardRes(set$$1) {
                    return function (mv) {
                        if (rejected) {
                            return;
                        }
                        set$$1(mv);
                        if (vload && fload) {
                            delay(function () {
                                return cleanBoth(states);
                            });
                            return res(f(v));
                        } else {
                            return mv;
                        }
                    };
                };

                var state = meFork(guardRej, guardRes(function (a) {
                    fload = true;f = a;
                }));
                var mstate = themFork(guardRej, guardRes(function (b) {
                    vload = true;v = b;
                }));

                states = [state, mstate];
                return states;
            }, cleanBoth);
        }

        // -- Monad
        /**
         * Chains function calls which return monads into a single monad
         * @method flatMap
         * @memberof module:futils/monads/task.Task
         * @param {function} f Function returning a monad
         * @return {Task} New instance of the calling monads type
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         *
         * const mInc = (n) => Task.resolve(1).map((m) => n + m);
         *
         * one.flatMap(mInc).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         *
         * // logs "Resolved: 2"
         */

    }, {
        key: 'flatMap',
        value: function flatMap(f) {
            var _this2 = this;

            if (isFunc$1(f)) {
                return new Task(function (rej, res) {
                    return _this2.run(function (a) {
                        return rej(a);
                    }, function (b) {
                        return f(b).run(rej, res);
                    });
                }, this.cleanUp);
            }
            throw 'Task::flatMap expects argument to be function but saw ' + f;
        }

        /**
         * Flattens down a nested monad one level and returns a new monad containing
         *     the inner value
         * @method flatten
         * @memberof module:futils/monads/task.Task
         * @return {Task} New instance of the monad
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(Task.resolve(1));
         *
         * one.flatten().run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         *
         * // logs "Resolved: 1"
         */

    }, {
        key: 'flatten',
        value: function flatten() {
            var _this3 = this;

            return new Task(function (rej, res) {
                return _this3.run().run(rej, res);
            }, this.cleanUp);
        }
        // -- Foldable
        // reduce

        // -- ?
        /**
         * Given two functions, folds the first over the instance if it rejects the
         *     Task and the second over the instance if it resolves the Task
         * @method fold
         * @memberof module:futils/monads/task.Task
         * @param {function} f Function handling the a Failure case
         * @param {function} g Function handling the Success case
         * @return {any} Whatever f or g return
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let nothing = Task.reject(null);
         *
         * one.fold(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Resolved: 1"
         * 
         * none.fold(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Rejected: null"
         */

    }, {
        key: 'fold',
        value: function fold(f, g) {
            if (isFunc$1(g) && isFunc$1(f)) {
                return this.run(f, g);
            }
            throw 'Task::fold expects arguments to be functions but saw ' + [f, g];
        }

        /**
         * Implementation of the catamorphism. Given a object with `Reject` and
         *     `Resolve` fields pipes the current value through the corresponding
         *     function
         * @method cata   
         * @memberof module:futils/monads/task.Task
         * @param {object} o Object with `Reject` and `Resolve`
         * @return {any} Result of applying the functions to the current value
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let nothing = Task.reject(null);
         *
         * one.cata({
         *     Reject: () => 'Nothing found',
         *     Resolve: (n) => 'Found number of ' + n
         * });
         * // "Found number of 1"
         *
         * nothing.cata({
         *     Reject: () => 'Nothing found',
         *     Resolve: (n) => 'Found number of ' + n
         * });
         * // "Nothing found"
         */

    }, {
        key: 'cata',
        value: function cata(_ref3) {
            var Reject = _ref3.Reject,
                Resolve = _ref3.Resolve;

            if (isFunc$1(Resolve) && isFunc$1(Reject)) {
                return this.fold(Reject, Resolve);
            }
            throw 'Task::cata expected Object of {Reject, Resolve}';
        }

        // -- Bifunctor
        /**
         * Given two functions, maps the first over the instance if it reflects a
         *     Failure and the second if it reflects Success. Wraps the result into
         *     a new Bifunctor of the same type before returning
         * @method biMap   
         * @memberof module:futils/monads/task.Task 
         * @param {function} f Function to map if a Failure
         * @param {function} g Function to map if Success
         * @return {Task} Result in a new container
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let nothing = Task.reject(null);
         *
         * one.biMap(
         *     () => 'Nothing found',
         *     (n) => 'Found number of ' + n
         * ).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Resolved: Found number of 1"
         *
         * nothing.biMap(
         *     () => 'Nothing found',
         *     (n) => 'Found number of ' + n
         * ).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Rejected: Nothing found"
         */

    }, {
        key: 'biMap',
        value: function biMap(f, g) {
            var _this4 = this;

            if (isFunc$1(g) && isFunc$1(f)) {
                return new Task(function (rej, res) {
                    return _this4.fold(rej, res);
                }, this.cleanUp);
            }
            throw 'Task::biMap expected arguments to be functions but saw ' + [f, g];
        }

        /**
         * Swaps the disjunction and rejects a otherwise resolving Task and
         *     vice versa
         * @method swap
         * @memberof module:futils/monads/either.Right
         * @return {Task} A new Task
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let none = Task.reject(null);
         *
         * one.swap().run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Rejected: 1"
         * 
         * none.swap().run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Resolved: null"
         */

    }, {
        key: 'swap',
        value: function swap() {
            var _this5 = this;

            return new Task(function (rej, res) {
                return _this5.run(res, rej);
            }, this.cleanUp);
        }

        /**
         * Given a function, maps it if the instance gets rejected
         * @method mapRejected   
         * @memberof module:futils/monads/either.Right
         * @param {function} f Function to map
         * @return {Task} A new Task
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let none = Task.reject(null);
         *
         * const nullToZero = (x) => typeof x !== 'number' ? 0 : x;
         *
         * one.mapRejected(nullToZero).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Resolved: 1"
         * 
         * none.mapRejected(nullToZero).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Rejected: 0"
         */

    }, {
        key: 'mapRejected',
        value: function mapRejected(f) {
            var _this6 = this;

            if (isFunc$1(f)) {
                return new Task(function (rej, res) {
                    return _this6.run(function (a) {
                        return rej(f(a));
                    }, res);
                }, this.cleanUp);
            }
        }
        // -- Traversable
        // -- Monoid
        /**
         * Returns a Task that never rejects and never resolves
         * @method empty
         * @memberof module:futils/monads/task.Task
         * @static
         * @return {Task} A monoid of the same type
         *
         * @example
         * const {Task} = require('futils');
         *
         * Task.empty(); // -> Task which never does anything
         */

    }, {
        key: 'concat',


        // -- Semigroup
        /**
         * Concats the instance with another one and selects the one which first
         *     completes
         * @method concat
         * @memberof module:futils/monads/task.Task
         * @param {Task} m Another Task
         * @return {Task} A new Task
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         * let idle = Task.empty();
         *
         * one.concat(idle).run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         * // logs "Resolved: 1"
         */
        value: function concat(m) {
            if (Task.is(m)) {
                var meFork = this.run,
                    themFork = m.run,
                    meClean = this.cleanUp,
                    themClean = m.cleanUp;

                var cleanBoth = function cleanBoth(_ref4) {
                    var _ref5 = slicedToArray(_ref4, 2),
                        a = _ref5[0],
                        b = _ref5[1];

                    meClean(a);
                    themClean(b);
                };

                return new Task(function (rej, res) {
                    var states = void 0,
                        done = false;
                    var state = void 0,
                        mstate = void 0;

                    var guard = function guard(f) {
                        return function (mv) {
                            if (!done) {
                                done = true;
                                delay(function () {
                                    return cleanBoth(state);
                                });
                                f(mv);
                            }
                        };
                    };

                    state = meFork(guard(rej), guard(res));
                    mstate = themFork(guard(rej), guard(res));
                    states = [state, mstate];
                    return states;
                }, cleanBoth);
            }
            throw 'Task::concat expected argument to be Task but saw ' + m;
        }
        // -- Recovering

    }, {
        key: 'orElse',
        value: function orElse(f) {
            var _this7 = this;

            if (isFunc$1(f)) {
                return new Task(function (rej, res) {
                    return _this7.run(function (a) {
                        return f(a).run(rej, res);
                    }, res);
                }, this.cleanUp);
            }
            throw 'Task::orElse expected argument to be function but saw ' + f;
        }
    }, {
        key: 'run',
        set: function set(a) {
            this[RUN_PROG] = a;
        },
        get: function get() {
            return this[RUN_PROG];
        }
    }, {
        key: 'cleanUp',
        set: function set(a) {
            this[CLEANUP] = a || ofVoid;
        },
        get: function get() {
            return this[CLEANUP];
        }
    }], [{
        key: 'is',
        value: function is(a) {
            return Task.prototype.isPrototypeOf(a);
        }

        /**
         * Returns a Task which resolves to the given value
         * @method resolve
         * @memberof module:futils/monads/task.Task
         * @static
         * @param {any} a Value to resolve to
         * @return {Task} A new Task
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.resolve(1);
         *
         * one.run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         *
         * // logs "Resolved: 1"
         */

    }, {
        key: 'resolve',
        value: function resolve(a) {
            return new Task(function (_, res) {
                return res(a);
            });
        }

        /**
         * Returns a Task which rejects the given value
         * @method reject
         * @memberof module:futils/monads/task.Task
         * @static
         * @param {any} a Value to resolve to
         * @return {Task} A new Task
         *
         * @example
         * const {Task} = require('futils');
         *
         * let one = Task.reject(1);
         *
         * one.run(
         *     (x) => console.error('Rejected: ' + x),
         *     (n) => console.log('Resolved: ' + n)
         * );
         *
         * // logs "Rejected: 1"
         */

    }, {
        key: 'reject',
        value: function reject(a) {
            return new Task(function (rej) {
                return rej(a);
            });
        }
    }, {
        key: 'of',
        value: function of(a) {
            return new Task(function (rej, res) {
                return res(a);
            });
        }
    }, {
        key: 'empty',
        value: function empty() {
            return new Task(function () {
                return void 0;
            });
        }
    }]);
    return Task;
}();

/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * A collection of monads and monad helper functions
 * @module futils/monads
 * @requires futils/decorators
 * @requires futils/monads/identity
 * @requires futils/monads/maybe
 * @requires futils/monads/either
 * @requires futils/monads/io
 * @requires futils/monads/state
 * @requires futils/monads/task
 */

/**
 * Grants access to the Identity monad class
 * @member Identity
 */

/**
 * Grants access to the Maybe.Some monad class
 * @member Some
 */

/**
 * Grants access to the Maybe.None monad class
 * @member None
 */

/**
 * Grants access to the Maybe monad class
 * @member Maybe
 */

/**
 * Grants access to the Either.Right monad class
 * @member Right
 */

/**
 * Grants access to the Either monad class
 * @member Either
 */

/**
 * Grants access to the IO monad class
 * @member IO
 */

/**
 * Grants access to the State monad class
 * @member State
 */

/**
 * Grants access to the Task monad class
 * @member Task
 */

/**
 * Takes a (curried!) function and two Applicatives and applies the function to
 *     both 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA2, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 *
 * const add = curry((a, b) => a + b);
 *
 * liftA2(add, m1, m2); // -> Identity(2)
 */
var liftA2$1 = curry$1(function (f, M1, M2) {
  return M1.map(f).ap(M2);
});

/**
 * Takes a (curried!) function and three Applicatives and applies the function to
 *     all three 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @param {Applicative} M3 Third applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA3, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 * let m3 = Identity.of(1);
 *
 * const add = curry((a, b, c) => a + b + c);
 *
 * liftA3(add, m1, m2, m3); // -> Identity(3)
 */
var liftA3$1 = curry$1(function (f, M1, M2, M3) {
  return M1.map(f).ap(M2).ap(M3);
});

/**
 * Takes a (curried!) function and four Applicatives and applies the function to
 *     all four 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @param {Applicative} M3 Third applicative
 * @param {Applicative} M4 Third applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA4, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 * let m3 = Identity.of(1);
 * let m4 = Identity.of(1);
 *
 * const add = curry((a, b, c, d) => a + b + c + d);
 *
 * liftA4(add, m1, m2, m3, m4); // -> Identity(4)
 */
var liftA4$1 = curry$1(function (f, M1, M2, M3, M4) {
  return M1.map(f).ap(M2).ap(M3).ap(M4);
});

/**
 * Takes a (curried!) function and five Applicatives and applies the function to
 *     all five 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @param {Applicative} M3 Third applicative
 * @param {Applicative} M4 Third applicative
 * @param {Applicative} M5 Third applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA5, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 * let m3 = Identity.of(1);
 * let m4 = Identity.of(1);
 * let m5 = Identity.of(1);
 *
 * const add = curry((a, b, c, d, e) => a + b + c + d + e);
 *
 * liftA5(add, m1, m2, m3, m4, m5); // -> Identity(5)
 */
var liftA5$1 = curry$1(function (f, M1, M2, M3, M4, M5) {
  return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5);
});

var monads = { liftA2: liftA2$1, liftA3: liftA3$1, liftA4: liftA4$1, liftA5: liftA5$1, Identity: Identity$1, Task: Task$1, State: State$1, Maybe: Maybe$1, Some: Some$1, None: None$1, Either: Either$1, Left: Left$1, Right: Right$1, IO: IO$1 };

var trampoline$$1 = trampoline$1;
var suspend$$1 = suspend$1;

var aritize$$1 = aritize$1;
var monadic$$1 = monadic$1;
var dyadic$$1 = dyadic$1;
var triadic$$1 = triadic$1;
var tetradic$$1 = tetradic$1;

var isNil$$1 = isNil$1;
var isAny$$1 = isAny$1;
var isNull$$1 = isNull$1;
var isVoid$$1 = isVoid$1;
var isString$$1 = isString$1;
var isNumber$$1 = isNumber$1;
var isInt$$1 = isInt$1;
var isFloat$$1 = isFloat$1;
var isBool$$1 = isBool$1;
var isTrue$$1 = isTrue$1;
var isFalse$$1 = isFalse$1;
var isFunc$$1 = isFunc$1;
var isObject$$1 = isObject$1;
var isArray$$1 = isArray$1;
var isDate$$1 = isDate$1;
var isRegex$$1 = isRegex$1;
var isNode$$1 = isNode$1;
var isNodeList$$1 = isNodeList$1;
var isPromise$$1 = isPromise$1;
var isIterator$$1 = isIterator$1;
var isIterable$$1 = isIterable$1;
var isArrayOf$$1 = isArrayOf$1;
var isObjectOf$$1 = isObjectOf$1;
var isSetoid$$1 = isSetoid$1;
var isFunctor$$1 = isFunctor$1;
var isApply$$1 = isApply$1;
var isFoldable$$1 = isFoldable$1;
var isBifunctor$$1 = isBifunctor$1;
var isSemigroup$$1 = isSemigroup$1;
var isMonad$$1 = isMonad$1;
var isApplicative$$1 = isApplicative$1;

var id$$1 = id$1;
var getter$$1 = getter$1;
var tap$$1 = tap$1;
var pipe$$1 = pipe$1;
var compose$$1 = compose$1;
var and$$1 = and$1;
var or$$1 = or$1;
var by$$1 = by$1;
var fixed$$1 = fixed$1;

var once$$1 = once$1;
var not$$1 = not$1;
var flip$$1 = flip$1;
var curry$$1 = curry$1;
var curryRight$$1 = curryRight$1;
var partial$$1 = partial$1;
var partialRight$$1 = partialRight$1;
var given$$1 = given$1;
var memoize$$1 = memoize$1;

var Type = Type$1;

var Additive$$1 = Additive$1;
var Multiple$$1 = Multiple$1;
var Min$$1 = Min$1;
var Max$$1 = Max$1;
var Dict$$1 = Dict$1;
var Fn$$1 = Fn$1;
var All$$1 = All$1;
var Any$$1 = Any$1;

var Identity = monads.Identity;
var IO = monads.IO;
var Maybe = monads.Maybe;
var None = monads.None;
var Some = monads.Some;
var Either = monads.Either;
var Left = monads.Left;
var Right = monads.Right;
var State = monads.State;
var Task = monads.Task;
var liftA2 = monads.liftA2;
var liftA3 = monads.liftA3;
var liftA4 = monads.liftA4;
var liftA5 = monads.liftA5;

var lens$$1 = lens$1;
var makeLenses$$1 = makeLenses$1;
var mappedLens$$1 = mappedLens$1;
var view$$1 = view$1;
var over$$1 = over$1;
var set$1 = set$3;

var call$$1 = call$1;
var field$$1 = field$1;
var has$$1 = has$1;
var merge$$1 = merge$1;
var immutable$$1 = immutable$1;
var instance$$1 = instance$1;
var first$$1 = first$1;
var last$$1 = last$1;
var head$$1 = head$1;
var tail$$1 = tail$1;
var initial$$1 = initial$1;
var rest$$1 = rest$1;
var unique$$1 = unique$1;
var union$$1 = union$1;
var map$1 = _map;
var flatten$1 = flatten$2;
var flatMap$1 = flatMap$2;
var assoc$$1 = assoc$1;
var equals$1 = equals$2;
var ap$1 = ap$2;
var intersect$$1 = intersect$1;
var differ$$1 = differ$1;
var pairs$$1 = pairs$1;
var fold$1 = fold$2;
var unfold$$1 = unfold$1;
var concat$1 = concat$2;
var range$$1 = range$1;
var filter$$1 = filter$1;
var keep$$1 = keep$1;
var drop$$1 = drop$1;
var dropWhile$$1 = dropWhile$1;
var take$$1 = take$1;
var takeWhile$$1 = takeWhile$1;
var find$$1 = find$1;
var findRight$$1 = findRight$1;
var foldMap$$1 = foldMap$1;
var zip$$1 = zip$1;
var traverse$1 = traverse$2;
var sequence$1 = sequence$2;

var transducers = Transducers;

var futils$1 = Object.freeze({
	trampoline: trampoline$$1,
	suspend: suspend$$1,
	aritize: aritize$$1,
	monadic: monadic$$1,
	dyadic: dyadic$$1,
	triadic: triadic$$1,
	tetradic: tetradic$$1,
	isNil: isNil$$1,
	isAny: isAny$$1,
	isNull: isNull$$1,
	isVoid: isVoid$$1,
	isString: isString$$1,
	isNumber: isNumber$$1,
	isInt: isInt$$1,
	isFloat: isFloat$$1,
	isBool: isBool$$1,
	isTrue: isTrue$$1,
	isFalse: isFalse$$1,
	isFunc: isFunc$$1,
	isObject: isObject$$1,
	isArray: isArray$$1,
	isDate: isDate$$1,
	isRegex: isRegex$$1,
	isNode: isNode$$1,
	isNodeList: isNodeList$$1,
	isPromise: isPromise$$1,
	isIterator: isIterator$$1,
	isIterable: isIterable$$1,
	isArrayOf: isArrayOf$$1,
	isObjectOf: isObjectOf$$1,
	isSetoid: isSetoid$$1,
	isFunctor: isFunctor$$1,
	isApply: isApply$$1,
	isFoldable: isFoldable$$1,
	isBifunctor: isBifunctor$$1,
	isSemigroup: isSemigroup$$1,
	isMonad: isMonad$$1,
	isApplicative: isApplicative$$1,
	id: id$$1,
	getter: getter$$1,
	tap: tap$$1,
	pipe: pipe$$1,
	compose: compose$$1,
	and: and$$1,
	or: or$$1,
	by: by$$1,
	fixed: fixed$$1,
	once: once$$1,
	not: not$$1,
	flip: flip$$1,
	curry: curry$$1,
	curryRight: curryRight$$1,
	partial: partial$$1,
	partialRight: partialRight$$1,
	given: given$$1,
	memoize: memoize$$1,
	Type: Type,
	Additive: Additive$$1,
	Multiple: Multiple$$1,
	Min: Min$$1,
	Max: Max$$1,
	Dict: Dict$$1,
	Fn: Fn$$1,
	All: All$$1,
	Any: Any$$1,
	Identity: Identity,
	IO: IO,
	Maybe: Maybe,
	None: None,
	Some: Some,
	Either: Either,
	Left: Left,
	Right: Right,
	State: State,
	Task: Task,
	liftA2: liftA2,
	liftA3: liftA3,
	liftA4: liftA4,
	liftA5: liftA5,
	lens: lens$$1,
	makeLenses: makeLenses$$1,
	mappedLens: mappedLens$$1,
	view: view$$1,
	over: over$$1,
	set: set$1,
	call: call$$1,
	field: field$$1,
	has: has$$1,
	merge: merge$$1,
	immutable: immutable$$1,
	instance: instance$$1,
	first: first$$1,
	last: last$$1,
	head: head$$1,
	tail: tail$$1,
	initial: initial$$1,
	rest: rest$$1,
	unique: unique$$1,
	union: union$$1,
	map: map$1,
	flatten: flatten$1,
	flatMap: flatMap$1,
	assoc: assoc$$1,
	equals: equals$1,
	ap: ap$1,
	intersect: intersect$$1,
	differ: differ$$1,
	pairs: pairs$$1,
	fold: fold$1,
	unfold: unfold$$1,
	concat: concat$1,
	range: range$$1,
	filter: filter$$1,
	keep: keep$$1,
	drop: drop$$1,
	dropWhile: dropWhile$$1,
	take: take$$1,
	takeWhile: takeWhile$$1,
	find: find$$1,
	findRight: findRight$$1,
	foldMap: foldMap$$1,
	zip: zip$$1,
	traverse: traverse$1,
	sequence: sequence$1,
	transducers: transducers
});

return futils$1;

})));
