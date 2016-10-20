(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.futils = factory());
}(this, function () { 'use strict';

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
   * const {arity} = require('futils');
   *
   * const sum = (x, ...xs) => xs.reduce((a, b) => a + b, x);
   * sum(1, 2, 3); // -> 6
   *
   * const addTwo = arity.aritize(2, sum);
   * addTwo(1, 2, 3); // -> 3
   */
  var aritize = function aritize(n, f) {
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
   * const {arity} = require('futils');
   * 
   * var all = (...xs) => xs;
   *
   * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
   *
   * arity.monadic(all)(1, 2, 3, 4); // -> [1]
   */
  var monadic = function monadic(f) {
      if (isFn(f)) {
          return function () {
              var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

              if (x === void 0) {
                  return monadic(f);
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
   * const {arity} = require('futils');
   * 
   * var all = (...xs) => xs;
   *
   * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
   *
   * const just2 = arity.dyadic(all);
   * just2(1, 2, 3, 4); // -> [1, 2]
   */
  var dyadic = function dyadic(f) {
      if (isFn(f)) {
          return function () {
              var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
              var y = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];

              if (x === void 0) {
                  return dyadic(f);
              }
              if (y === void 0) {
                  return monadic(function (_y) {
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
   * const {arity} = require('futils');
   * 
   * var all = (...xs) => xs;
   *
   * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
   *
   * const just3 = arity.triadic(all);
   * just3(1, 2, 3, 4); // -> [1, 2, 3]
   */
  var triadic = function triadic(f) {
      if (isFn(f)) {
          return function () {
              var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
              var y = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
              var z = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];

              if (x === void 0) {
                  return triadic(f);
              }
              if (y === void 0) {
                  return dyadic(function (_y, _z) {
                      return f(x, _y, _z);
                  });
              }
              if (z === void 0) {
                  return monadic(function (_z) {
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
   * const {arity} = require('futils');
   * 
   * var all = (...xs) => xs;
   *
   * all(1, 2, 3, 4, 5); // -> [1, 2, 3, 4, 5]
   *
   * const just4 = arity.tetradic(all);
   * just4(1, 2, 3, 4, 5); // -> [1, 2, 3, 4]
   */
  var tetradic = function tetradic(f) {
      if (isFn(f)) {
          return function () {
              var w = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
              var x = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
              var y = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];
              var z = arguments.length <= 3 || arguments[3] === undefined ? void 0 : arguments[3];

              if (w === void 0) {
                  return tetradic(f);
              }
              if (x === void 0) {
                  return triadic(function (_x, _y, _z) {
                      return f(w, _x, _y, _z);
                  });
              }
              if (y === void 0) {
                  return dyadic(function (_y, _z) {
                      return f(w, x, _y, _z);
                  });
              }
              if (z === void 0) {
                  return monadic(function (_z) {
                      return f(w, x, y, _z);
                  });
              }
              return f(w, x, y, z);
          };
      }
      throw 'decorators::tetradic awaits a function but saw ' + f;
  };

  var arity = { aritize: aritize, monadic: monadic, dyadic: dyadic, tetradic: tetradic, triadic: triadic };

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
  var isNil = function isNil(x) {
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
  var isAny = function isAny(x) {
    return !isNil(x);
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
  var isVoid = function isVoid(x) {
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
  var isNull = function isNull(x) {
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
   * const {operators} = require('futils');
   *
   * operators.isString('Hello world'); // -> true
   * operators.isString(null); // -> false
   */
  var isString = function isString(x) {
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
  var isNumber = function isNumber(x) {
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
  var isInt = function isInt(x) {
    return isNumber(x) && x % 1 === 0;
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
  var isFloat = function isFloat(x) {
    return isNumber(x) && x % 1 !== 0;
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
  var isBool = function isBool(x) {
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
  var isTrue = function isTrue(x) {
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
  var isFalse = function isFalse(x) {
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
  var isFunc = function isFunc(x) {
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
  var isObject = function isObject(x) {
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
  var isArray = function isArray(x) {
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
  var isDate = function isDate(x) {
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
  var isRegex = function isRegex(x) {
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
  var isNode = function isNode(x) {
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
  var isNodeList = function isNodeList(x) {
    return NodeList.prototype.isPrototypeOf(x);
  };

  var isMap = function isMap(x) {
    return Map.prototype.isPrototypeOf(x);
  };

  var isWeakMap = function isWeakMap(x) {
    return WeakMap.prototype.isPrototypeOf(x);
  };

  var isSet = function isSet(x) {
    return Set.prototype.isPrototypeOf(x);
  };

  var isWeakSet = function isWeakSet(x) {
    return WeakSet.prototype.isPrototypeOf(x);
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
  var isPromise = function isPromise(x) {
    return Promise.prototype.isPrototypeOf(x) || x && isFunc(x.then);
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
  var isIterator = function isIterator(x) {
    return !isNil(x) && isFunc(x.next);
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
  var isIterable = function isIterable(x) {
    return !isNil(x) && !!(x[Symbol.iterator] || !isNaN(x.length));
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
   * const {isString, isArrayOf} = require('futils');
   *
   * var pass = ['Hello', 'World'],
   *     fail = [1, 'World'];
   *
   * const isStrArray = isArrayOf(isString);
   *
   * isStrArray(pass); // -> true
   * isStrArray(fail); // -> false
   */
  var isArrayOf = function isArrayOf(f, x) {
    if (x === void 0) {
      return function (_x) {
        return isArrayOf(f, _x);
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
   * const {type} = require('futils');
   *
   * var pass = {greet: 'Hello', subject: 'World'},
   *     fail = {greet: 1, subject: 'World'};
   *
   * const isStrObject = type.isObjectOf(type.isString);
   *
   * isStrObject(pass); // -> true
   * isStrObject(fail); // -> false
   */
  var isObjectOf = function isObjectOf(f, x) {
    if (x === void 0) {
      return function (_x) {
        return isObjectOf(f, _x);
      };
    }

    if (isObject(x)) {
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
   * const {type} = require('futils');
   *
   * const makeSetoid = (x) => ({
   *     equals(b) {}
   * });
   * 
   * type.isSetoid(makeSetoid(10)); // -> true
   */
  var isSetoid = function isSetoid(x) {
    return !!x && isFunc(x.equals);
  };

  /**
   * Returns true if given a functor (something that implements `map`)
   * @method 
   * @version 2.0.0
   * @param {any} x Value to check
   * @return {boolean} True if given a functor, false otherwise
   *
   * @example
   * const {type} = require('futils');
   * 
   * type.isFunctor([]); // -> true
   */
  var isFunctor = function isFunctor(x) {
    return !!x && isFunc(x.map);
  };

  /**
   * Returns true if given a apply (something that implements `ap`)
   * @method 
   * @version 2.0.0
   * @param {any} x Value to check
   * @return {boolean} True if given a apply, false otherwise
   *
   * @example
   * const {type} = require('futils');
   *
   * const makeApply = (x) => ({
   *     ap(f) {}
   * });
   * 
   * type.isApply(makeApply(10)); // -> true
   */
  var isApply = function isApply(x) {
    return !!x && isFunc(x.ap);
  };

  /**
   * Returns true if given a foldable (something that implements `fold`)
   * @method 
   * @version 2.0.0
   * @param {any} x Value to check
   * @return {boolean} True if given a foldable, false otherwise
   *
   * @example
   * const {type} = require('futils');
   *
   * const makeFoldable = (x) => ({
   *     fold (f, g) {}
   * });
   * 
   * type.isFoldable(makeFoldable(10)); // -> true
   */
  var isFoldable = function isFoldable(x) {
    return !!x && isFunc(x.fold);
  };

  /**
   * Returns true if given a applicative (something that implements `ap` and `of`)
   * @method 
   * @version 2.0.0
   * @param {any} x Value to check
   * @return {boolean} True if given a applicative, false otherwise
   *
   * @example
   * const {type} = require('futils');
   *
   * const makeApplicative = (x) => ({
   *     of(a) {}
   *     ap(f) {}
   * });
   * 
   * type.isApplicative(makeApplicative(10)); // -> true
   */
  var isApplicative = function isApplicative(x) {
    return isApply(x) && (isFunc(x.of) || isFunc(x.constructor.of));
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
   * const {type} = require('futils');
   *
   * const makeMonad = (x) => ({
   *     equals(y) {},
   *     map(f) {},
   *     flatten() {},
   *     flatMap(f) {}
   * });
   * 
   * type.isSetoid(makeMonad(10)); // -> true
   */
  var isMonad = function isMonad(x) {
    return isFunctor(x) && isSetoid(x) && isFunc(x.flatten) && isFunc(x.flatMap);
  };

  var type = {
    isNil: isNil, isAny: isAny, isNull: isNull, isVoid: isVoid, isArray: isArray, isBool: isBool, isSet: isSet, isString: isString, isWeakMap: isWeakMap,
    isWeakSet: isWeakSet, isFalse: isFalse, isTrue: isTrue, isFunc: isFunc, isFloat: isFloat, isInt: isInt, isNumber: isNumber, isNode: isNode,
    isNodeList: isNodeList, isDate: isDate, isObject: isObject, isPromise: isPromise, isIterable: isIterable, isArrayOf: isArrayOf, isObjectOf: isObjectOf,
    isMap: isMap, isRegex: isRegex, isIterator: isIterator, isSetoid: isSetoid, isFunctor: isFunctor, isApplicative: isApplicative, isApply: isApply,
    isFoldable: isFoldable, isMonad: isMonad
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
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

  /**
   * A collection of higher order helpers for functional composition
   * @module futils/combinators
   * @requires futils/types
   * @requires futils/arity
   */

  /**
   * The identity or I combinator (idiot in smullians "how to mock a mockingbird")
   * @method
   * @version 0.4.0
   * @param {any} x Anything
   * @return {any} Returns x
   */
  var identity = function identity(x) {
      return x;
  };

  /**
   * The getter or K combinator (kestrel in smullians "how to mock a mockingbird")
   * @method
   * @version 0.4.0
   * @param {anx} x Anything
   * @return {function} A getter of x
   */
  var getter = function getter(x) {
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
   * const {combinators, type} = require('futils');
   * 
   * const sqr = (n) => n * n;
   * 
   * const saveSqr = combinators.tap(sqr)((op) => {
   *     return (_n) => {
   *         return type.isNumber(_n) ? op(_n) : _n;
   *     }
   * });
   */
  var tap = function tap(x) {
      return function (y) {
          return y(x);
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
   * const {combinators} = require('futils');
   *
   * const add1 = (n) => n + 1;
   * const mult2 = (n) => n * 2;
   *
   * const mult2Add1 = combinators.pipe(mult2, add1);
   *
   * add1(mult2(2)) === mult2Add1(2);
   * // -> true
   */
  var pipe = function pipe(f) {
      for (var _len = arguments.length, fs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          fs[_key - 1] = arguments[_key];
      }

      if (type.isFunc(f) && type.isArrayOf(type.isFunc, fs)) {
          return arity.aritize(f.length, function () {
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
   * const {combinators} = require('futils');
   *
   * const add1 = (n) => n + 1;
   * const mult2 = (n) => n * 2;
   *
   * const mult2Add1 = combinators.compose(add1, mult2);
   *
   * add1(mult2(2)) === mult2Add1(2);
   * // -> true
   */
  var compose = function compose() {
      for (var _len2 = arguments.length, fs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          fs[_key2] = arguments[_key2];
      }

      if (type.isArrayOf(type.isFunc, fs)) {
          return pipe.apply(undefined, toConsumableArray(fs.reverse()));
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
   * const {combinators} = require('futils');
   *
   * const isStr = (s) => typeof s === 'string';
   * const hasAt = (s) => s.includes('@');
   *
   * const smellsLikeMail = combinators.and(isStr, hasAt);
   */
  var and = function and() {
      for (var _len3 = arguments.length, fs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          fs[_key3] = arguments[_key3];
      }

      if (type.isArrayOf(type.isFunc, fs)) {
          return arity.aritize(fs[0].length, function () {
              for (var _len4 = arguments.length, xs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                  xs[_key4] = arguments[_key4];
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
   * const {combinators} = require('futils');
   *
   * const isStr = (s) => typeof s === 'string';
   * const isNum = (n) => !isNaN(n);
   *
   * const strOrNum = combinators.or(isStr, isNum);
   */
  var or = function or() {
      for (var _len5 = arguments.length, fs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          fs[_key5] = arguments[_key5];
      }

      if (type.isArrayOf(type.isFunc, fs)) {
          return arity.aritize(fs[0].length, function () {
              for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                  xs[_key6] = arguments[_key6];
              }

              return fs.some(function (f) {
                  return !!f.apply(undefined, xs);
              });
          });
      }
      throw 'combinators::or awaits functions but saw ' + fs;
  };

  var combinators = {
      compose: compose, pipe: pipe, identity: identity, tap: tap, getter: getter, and: and, or: or
  };

  /**
   * A collection of function decorator functions. Please note that these are not
   *     compatible with the proposed ES7 method decorators
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
  var once = function once(f) {
      var called = 0;
      if (type.isFunc(f)) {
          return arity.aritize(f.length, function () {
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
  var not = function not(f) {
      if (type.isFunc(f)) {
          return arity.aritize(f.length, function () {
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
  var flip = function flip(f) {
      if (type.isFunc(f)) {
          return arity.aritize(f.length, function () {
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
  var curry = function curry(f) {
      if (type.isFunc(f)) {
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

                  return curry(f).apply(undefined, args.concat(rest));
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
  var curryRight = function curryRight(f) {
      if (type.isFunc(f)) {
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

                  return curry(f).apply(undefined, args.concat(rest));
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
  var partial = function partial(f) {
      for (var _len6 = arguments.length, pargs = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          pargs[_key6 - 1] = arguments[_key6];
      }

      var _ps = pargs;
      if (type.isFunc(f)) {
          while (_ps.length < f.length) {
              _ps.push(void 0);
          }
          return function () {
              for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                  args[_key7] = arguments[_key7];
              }

              var _as = _ps.map(function (a) {
                  return type.isVoid(a) ? args.shift() : a;
              });
              if (_as.lastIndexOf(void 0) < 0) {
                  return f.apply(undefined, toConsumableArray(_as));
              }
              return partial.apply(undefined, [f].concat(toConsumableArray(_as)));
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
  var partialRight = function partialRight(f) {
      for (var _len8 = arguments.length, pargs = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
          pargs[_key8 - 1] = arguments[_key8];
      }

      var _ps = pargs;
      if (type.isFunc(f)) {
          while (_ps.length < f.length) {
              _ps.push(void 0);
          }
          return function () {
              for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                  args[_key9] = arguments[_key9];
              }

              var _as = _ps.map(function (a) {
                  return type.isVoid(a) ? args.shift() : a;
              });
              if (_as.lastIndexOf(void 0) < 0) {
                  return f.apply(undefined, toConsumableArray(_as.reverse()));
              }
              return partial.apply(undefined, [f].concat(toConsumableArray(_as)));
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
  var given = function given(p) {
      var t = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
      var f = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];

      if (t === void 0) {
          return function (_t, _f) {
              return given(p, _t, _f);
          };
      }

      if (type.isFunc(p) && type.isFunc(t)) {
          if (type.isFunc(f)) {
              return arity.aritize(t.length, function () {
                  return !!p.apply(undefined, arguments) ? t.apply(undefined, arguments) : f.apply(undefined, arguments);
              });
          }
          return arity.aritize(t.length, function () {
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
  var memoize = function memoize(f) {
      var cached = {};
      if (type.isFunc(f)) {
          return arity.aritize(f.length, function () {
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

  var decorators = {
      not: not, flip: flip, curry: curry, curryRight: curryRight, partial: partial, partialRight: partialRight, given: given,
      memoize: memoize, once: once
  };

  /**
   * A collection of operator functions to work on arrays, objects, monads, etc...
   * @module futils/operators
   * @requires futils/types
   * @requires futils/arity
   */

  var _keyed = Object.prototype.hasOwnProperty;

  /**
   * Allows to predefine a method invocation
   * @method
   * @version 0.2.0
   * @param {string|function} method Name of a method or a function
   * @param {any} [partials] Presetted arguments
   * @return {function} Function awaiting a instance
   *
   * @example
   * const {operators} = require('futils');
   *
   * const upper = operators.call('toUpperCase');
   * upper('hello world'); // -> 'HELLO WORLD'
   *
   * const firstHalf = operators.call('slice', 0, 5);
   * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
   */
  var call = function call(method) {
      for (var _len = arguments.length, partials = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          partials[_key - 1] = arguments[_key];
      }

      return function (provider) {
          for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              rest[_key2 - 1] = arguments[_key2];
          }

          var res = type.isString(method) && type.isFunc(provider[method]) ? provider[method].apply(provider, partials.concat(rest)) : type.isFunc(method) ? method.call.apply(method, [provider].concat(partials, rest)) : null;
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
   * const {operators} = require('futils');
   *
   * let testee = {foo: 'bar'};
   *
   * operators.has('foo', testee); // -> true
   * operators.has('missing', testee); // -> false
   */
  var has = arity.dyadic(function (key, x) {
      return _keyed.call(x, key);
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
   * const {operators} = require('futils');
   *
   * const getName = operators.field('name');
   * getName({name: 'John Doe'}); // -> 'John Doe'
   *
   * const firstName = operators.field('name.first');
   * firstName({name: {first: 'John', last: 'Doe'}}); // -> 'John'
   */
  var field = arity.dyadic(function (key, x) {
      var ks = type.isString(key) && /\./.test(key) ? key.split('.') : [key];
      return ks.reduce(function (a, b) {
          return type.isAny(a) && type.isAny(a[b]) ? a[b] : null;
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
   * const {operators} = require('futils');
   *
   * let p = { name: 'John Doe', accounts: [{name: 'jdoe'}] };
   *
   * const setAccountCount = operators.assoc('accountCount');
   * setAccountCount(p.accounts.length, p);
   * // -> {name: 'John Doe', ..., accountCount: 1}
   *
   * console.log(p); // -> {name: 'John Doe', accounts: [...]};
   */
  var assoc = arity.triadic(function (k, v, x) {
      var key = k,
          receiver = x;
      if (type.isArray(x)) {
          receiver = [].concat(toConsumableArray(x));
          key = parseInt(key, 10);
          if (type.isNumber(key) && key < x.length && key >= 0) {
              receiver[key] = v;
          }
      } else if (type.isObject(x)) {
          receiver = Object.assign({}, x);
          if (type.isString(key)) {
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
   * const {operators} = require('futils');
   *
   * var customer = {name: 'John Doe', id: 00000001},
   *     basket = {items: [ ... number of items ... ]};
   *
   * var customerWithBasket = operators.merge(customer, basket);
   * 
   * customerWithBasket; // -> {name: '...', id: ..., items: [ ... ]}
   *
   * customer === customerWithBasket; // -> false
   */
  var merge = function merge() {
      for (var _len3 = arguments.length, xs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          xs[_key3] = arguments[_key3];
      }

      return Object.assign.apply(Object, [{}].concat(xs));
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
   * const {operators} = require('futils');
   *
   * var money = operators.immutable({dollar: 5, cents: 50});
   *
   * money.dollar; // -> 5
   *
   * money.dollar += 5; // ;-)
   *
   * money.dollar; // -> 5
   */
  var immutable = function immutable(x) {
      return Object.freeze(merge(x));
  };

  // -- Arrays --------------------
  /**
   * Given a iterable collection, returns the first item
   * @method
   * @version 0.2.0
   * @param {array|array-like} xs The collection
   * @return {*} Whatever the first item is
   *
   * @example
   * const {operators} = require('futils');
   *
   * operators.first([1, 2, 3]); // -> 1
   *
   * operators.first(document.querySelectorAll('a')); // -> <a></a>
   */
  var first = function first(xs) {
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
   * const {operators} = require('futils');
   *
   * operators.head([1, 2, 3]); // -> [1]
   *
   * operators.head(document.querySelectorAll('a')); // -> [<a></a>]
   */
  var head = function head(xs) {
      return [first(xs)];
  };

  /**
   * Given a iterable collection, returns all items but the last of it
   * @method
   * @version 2.0.0
   * @param {array|array-like} xs The collection
   * @return {array} Whatever the initial items are
   *
   * @example
   * const {operators} = require('futils');
   *
   * operators.initial([1, 2, 3]); // -> [1, 2]
   *
   * operators.initial(
   *     document.querySelectorAll('a')
   * ); // -> [<a></a>, <a></a>, ...]
   */
  var initial = function initial(xs) {
      return type.isArray(xs) ? xs.slice(0, xs.length - 1) : type.isIterable(xs) ? Array.from(xs).slice(0, xs.length - 1) : [];
  };

  /**
   * Given a iterable collection, returns the last item
   * @method
   * @version 0.2.0
   * @param {array|array-like} xs The collection
   * @return {*} Whatever the last item is
   *
   * @example
   * const {operators} = require('futils');
   *
   * operators.last([1, 2, 3]); // -> 3
   *
   * operators.last(document.querySelectorAll('a')); // -> <a></a>
   */
  var last = function last(xs) {
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
   * const {operators} = require('futils');
   *
   * operators.tail([1, 2, 3]); // -> [3]
   *
   * operators.tail(document.querySelectorAll('a')); // -> [<a></a>]
   */
  var tail = function tail(xs) {
      return [last(xs)];
  };

  /**
   * Given a iterable collection, returns all items but the first of it
   * @method
   * @version 2.0.0
   * @param {array|array-like} xs The collection
   * @return {array} Whatever the rest items are
   *
   * @example
   * const {operators} = require('futils');
   *
   * operators.rest([1, 2, 3]); // -> [2, 3]
   *
   * operators.rest(document.querySelectorAll('a')); // -> [..., <a></a>, <a></a>]
   */
  var rest = function rest(xs) {
      return type.isArray(xs) ? xs.slice(1) : type.isIterable(xs) ? Array.from(xs).slice(1) : [];
  };

  /**
   * Given a iterable collection, returns all unique items of it
   * @method
   * @version 2.0.0
   * @param {array|array-like} xs The collection
   * @return {array} Only unique items
   *
   * @example
   * const {operators} = require('futils');
   *
   * operators.unique([2, 1, 2, 3, 3, 1]); // -> [2, 1, 3]
   */
  var unique = function unique(xs) {
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
   * const {operators} = require('futils');
   *
   * operators.union([2, 1, 2], [3, 3, 1]); // -> [2, 1, 3]
   */
  var union = arity.dyadic(function (xs, ys) {
      return unique([].concat(toConsumableArray(xs), toConsumableArray(ys)));
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
   * const {operators} = require('futils');
   *
   * operators.intersect([2, 1, 2], [3, 3, 1]); // -> [1]
   */
  var intersect = arity.dyadic(function (xs, ys) {
      return union(xs, ys).filter(function (a) {
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
   * const {operators} = require('futils');
   *
   * operators.differ([2, 1, 2], [3, 3, 1]); // -> [2, 3]
   */
  var differ = arity.dyadic(function (xs, ys) {
      return union(xs, ys).filter(function (a) {
          return xs.indexOf(a) < 0 || ys.indexOf(a) < 0;
      });
  });

  // -- Setoid --------------------
  /**
   * Generic setoid method, works on anything that implements a `equals` method. If
   *     no `equals` is found it matches on the value directly via strict
   *     comparison (===)
   * @method
   * @version 2.0.0 
   * @param {Setoid|*} a Any value to compare
   * @param {Setoid|*} b Any value to compare 
   * @return {boolean} True if both are equal
   *
   * @example
   * const {monads, operators} = require('futils');
   *
   * let m = monads.Some(1);
   * let n = monads.Some(1);
   *
   * operators.equals(m, n); // -> true
   * operators.equals(1, 1); // -> true
   */
  var equals = arity.dyadic(function (a, b) {
      return type.isSetoid(b) ? b.equals(a) : a === b;
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
   * const {operators} = require('futils');
   *
   * const addOne = (n) => n + 1;
   * operators.map(addOne, [1, 2, 3]); // -> [2, 3, 4]
   *
   * let mapAddOne = operators.map(addOne);
   * operators.map(mapAddOne, [[1, 2], [3]]); // -> [[2, 3], [4]]
   */
  var _map = arity.dyadic(function (f, m) {
      if (type.isFunc(f)) {
          if (type.isFunctor(m)) {
              return m.map(f);
          }
          if (type.isObject(m)) {
              return Object.keys(m).reduce(function (acc, k) {
                  acc[k] = f(m[k], k, m);
                  return acc;
              }, {});
          }
          return m;
      }
      throw 'operators::map awaits a function as first argument but saw ' + f;
  });

  // -- Apply --------------------
  /**
   * Generic apply method, works with either of (function, functor) or
   *     (apply/applicative, functor) or (apply/applicative, any)
   * @method
   * @version 2.0.0
   * @param {function|Applicative} mf Either function or Applicative
   * @param {array|Functor|*} ma Either array, Functor or single value
   * @return {array|Functor|*} Depending on the given input
   *
   * @example
   * const {monads, operators} = require('futils');
   *
   * let as = [1, 3, 5];
   * let inc = (n) => n + 1;
   *
   * ap(inc, as); // -> [2, 4, 6]
   * ap(inc)(as); // -> [2, 4, 6]
   *
   * let minc = monads.Identity(inc);
   * 
   * ap(minc, as); // -> [2, 4, 6]
   * ap(minc)(as); // -> [2, 4, 6]
   */
  var ap = arity.dyadic(function (mf, ma) {
      if (type.isFunc(mf)) {
          return type.isFunctor(ma) ? ma.map(mf) : type.isObject(ma) ? _map(mf, ma) : mf(ma);
      }
      if (type.isApply(mf)) {
          return type.isFunctor(ma) ? mf.ap(ma) : type.isObject(ma) ? mf.ap({ map: function map(f) {
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
   * @return {array|Monad} New instance of given
   *
   * @example
   * const {operators} = require('futils');
   *
   * operators.flatten([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, 4, 5]
   */
  var flatten = function flatten(m) {
      if (type.isFunc(m.flatten)) {
          return m.flatten();
      }
      if (type.isArray(m)) {
          var xs = flattenTCO(m, []);
          while (xs instanceof Function) {
              xs = xs();
          }
          return xs;
      }
      throw 'operators::flatten awaits Monad or array but saw ' + m;
  };

  function flattenTCO(xs, ys) {
      if (xs.length <= 0) {
          return ys;
      }
      return function () {
          if (type.isArray(xs[0])) {
              return flattenTCO([].concat(toConsumableArray(xs[0]), toConsumableArray(xs.slice(1))), ys);
          }
          return flattenTCO(xs.slice(1), [].concat(toConsumableArray(ys), [xs[0]]));
      };
  }

  /**
   * Generic flatMap method, works on anything which implements a `map` and a
   *     `flatten` method as well as on arrays. If given a object as data,
   *     the result will be mapped and merged via `operators.merge`
   * @method
   * @version 0.2.0
   * @param {function} f Transformation function
   * @param {object|array|Monad} m The Monad, array or object
   * @return {object|array|Monad} New instance of given Monad, array or object
   *
   * @example
   * const {operators} = require('futils');
   *
   * const split = (s) => s.split(' ');
   * operators.flatMap(split, ['Hello world']); // -> ['Hello', 'world']
   */
  var flatMap = arity.dyadic(function (f, m) {
      if (type.isFunc(f)) {
          return type.isObject(m) ? merge(m, _map(f, m)) : flatten(_map(f, m));
      }
      throw 'operators::flatMap awaits a function as first argument but saw ' + f;
  });

  var operators = {
      field: field, has: has, call: call, merge: merge, immutable: immutable, first: first, last: last, head: head, tail: tail,
      initial: initial, rest: rest, unique: unique, union: union, map: _map, flatten: flatten, flatMap: flatMap, assoc: assoc, equals: equals,
      ap: ap, intersect: intersect, differ: differ
  };

  /**
   * A collection of lens creators and operation functions for composable lenses
   * @module futils/lenses
   * @requires futils/combinators
   * @requires futils/decorators
   * @requires futils/operators
   */

  var Const = function Const(x) {
    return { value: x, map: function map() {
        return this;
      }
    };
  };
  var Id = function Id(x) {
    return { value: x, map: function map(f) {
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
   * let MapLens = lens((k, xs) => xs.get(k), (k, v, xs) => xs.set(k, v));
   * let m = new Map([['users', ['john doe']]]); 
   *
   * over(MapLens('users'), (s) => s.toUpperCase(), m); // -> ['JOHN DOE']
   */
  var lens = decorators.curry(function (gets, sets, k, f, xs) {
    return operators.map(function (replacement) {
      return sets(k, replacement, xs);
    }, f(gets(k, xs)));
  });

  // The bare bones, creates a lens which works on arrays and objects
  var baseLens = lens(operators.field, operators.assoc);

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
  var view = decorators.curry(function (l, data) {
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
  var over = decorators.curry(function (l, f, data) {
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
  var set$1 = decorators.curry(function (l, v, data) {
    return over(l, function () {
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
  var makeLenses = function makeLenses() {
    for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
      fields[_key] = arguments[_key];
    }

    return fields.reduce(function (acc, field) {
      if (!operators.has(field, acc)) {
        acc[field] = baseLens(field);
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
   * const {compose, makeLenses, mappedLens, over} = require('futils');
   *
   * let data = [[1, 2, 3]];
   *
   * const inc = (n) => n + 1;
   *
   * const mapMapLens = compose(mappedLens, mappedLens);
   * over(mapMapLens, inc, data); // -> [[2, 3, 4]]
   */
  var mappedLens = decorators.curry(function (f, xs) {
    return Id(operators.map(comp(operators.field('value'), f), xs));
  });

  var lenses = { lens: lens, makeLenses: makeLenses, mappedLens: mappedLens, view: view, over: over, set: set$1 };

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
      return {
          '@@transducer/step': f,
          '@@transducer/init': function transducerInit() {
              throw 'transducers/init not supported on generic transformers';
          },
          '@@transducer/result': function transducerResult(v) {
              return v;
          }
      };
  }

  Transformer.isReduced = function (v) {
      return !type.isNil(v) && v.reduced;
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
  var fold = decorators.curry(function (tf, seed, ls) {
      var xf = type.isFunc(tf) ? Transformer(tf) : tf,
          v = seed;

      if (type.isObject(ls)) {
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
  var transduce = decorators.curry(function (tf, step, seed, ls) {
      return fold(tf(type.isFunc(step) ? Transformer(step) : step), seed, ls);
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
  var into = decorators.curry(function (seed, tf, ls) {
      if (type.isArray(seed)) {
          return transduce(tf, function (arr, v) {
              return [].concat(toConsumableArray(arr), [v]);
          }, seed, ls);
      }
      if (type.isObject(seed)) {
          return transduce(tf, function (obj, _ref) {
              var _ref2 = slicedToArray(_ref, 2);

              var v = _ref2[0];
              var k = _ref2[1];

              var c = Object.assign({}, obj);
              c[k] = v;
              return c;
          }, seed, ls);
      }
      if (type.isNumber(seed) || type.isString(seed)) {
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
  var map = function map(f) {
      return function (xf) {
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  return xf[STEP](xs, f(v));
              },
              '@@transducer/result': function transducerResult(v) {
                  return xf[RESULT](v);
              }
          };
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
  var filter = function filter(f) {
      return function (xf) {
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  return !!f(v) ? xf[STEP](xs, v) : xs;
              },
              '@@transducer/result': function transducerResult(v) {
                  return xf[RESULT](v);
              }
          };
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
  var flatten$1 = function flatten(xf) {
      return {
          '@@transducer/init': function transducerInit() {
              return xf[INIT]();
          },
          '@@transducer/step': function transducerStep(xs, v) {
              return fold({
                  '@@transducer/init': function transducerInit() {
                      return xf[INIT]();
                  },
                  '@@transducer/step': function transducerStep(_xs, __v) {
                      var _v = xf[STEP](_xs, __v);
                      return Transformer.isReduced(_v) ? Transformer.deref(_v) : _v;
                  },
                  '@@transducer/result': function transducerResult(_v) {
                      return _v;
                  }
              }, xs, v);
          },
          '@@transducer/result': function transducerResult(v) {
              return xf[RESULT](v);
          }
      };
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
  var drop = function drop() {
      var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      return function (xf) {
          var i = n;
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  if (i > 0) {
                      i -= 1;
                      return xs;
                  }
                  return xf[STEP](xs, v);
              },
              '@@transducer/result': function transducerResult(v) {
                  return xf[RESULT](v);
              }
          };
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
  var dropWhile = function dropWhile(f) {
      return function (xf) {
          var drop = true,
              stop = false;
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  if (!stop && (drop = !!f(v))) {
                      return xs;
                  }
                  stop = true;
                  return xf[STEP](xs, v);
              },
              '@@transducer/result': function transducerResult(v) {
                  return xf[RESULT](v);
              }
          };
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
  var take = function take() {
      var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      return function (xf) {
          var i = 0;
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  if (i < n) {
                      i += 1;
                      return xf[STEP](xs, v);
                  }
                  return Transformer.reduce(xs);
              },
              '@@transducer/result': function transducerResult(v) {
                  return xf[RESULT](v);
              }
          };
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
  var takeWhile = function takeWhile(f) {
      return function (xf) {
          var take = true;
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  take = !!f(v);
                  if (take) {
                      return xf[STEP](xs, v);
                  }
                  return Transformer.reduce(xs);
              },
              '@@transducer/result': function transducerResult(v) {
                  return xf[RESULT](v);
              }
          };
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
  var keep = function keep(xf) {
      return {
          '@@transducer/init': function transducerInit() {
              return xf[INIT]();
          },
          '@@transducer/step': function transducerStep(xs, v) {
              return !type.isNil(v) ? xf[STEP](xs, v) : xs;
          },
          '@@transducer/result': function transducerResult(v) {
              return xf[RESULT](v);
          }
      };
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
  var unique$1 = function unique(xf) {
      var found = Object.create(null);
      return {
          '@@transducer/init': function transducerInit() {
              return xf[INIT]();
          },
          '@@transducer/step': function transducerStep(xs, v) {
              if (!found[v]) {
                  found[v] = true;
                  return xf[STEP](xs, v);
              }
              return xs;
          },
          '@@transducer/result': function transducerResult(v) {
              return xf[RESULT](v);
          }
      };
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
      var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      return function (xf) {
          var p = [],
              _xs;
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
                  if (p.length < n) {
                      p.push(v);
                      return xs;
                  }
                  _xs = xf[STEP](xs, p);
                  p = [v];
                  return _xs;
              },
              '@@transducer/result': function transducerResult(v) {
                  if (p.length > 0) {
                      return xf[RESULT](xf[STEP](v, p));
                  }
                  return xf[RESULT](v);
              }
          };
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
          var p = [],
              _xs,
              cur,
              last;
          return {
              '@@transducer/init': function transducerInit() {
                  return xf[INIT]();
              },
              '@@transducer/step': function transducerStep(xs, v) {
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
              },
              '@@transducer/result': function transducerResult(v) {
                  if (p.length > 0) {
                      return xf[RESULT](xf[STEP](v, p));
                  }
                  return xf[RESULT](v);
              }
          };
      };
  };

  var transducers = {
      fold: fold, transduce: transduce, into: into, map: map, filter: filter, unique: unique$1, keep: keep, partition: partition, partitionWith: partitionWith,
      take: take, takeWhile: takeWhile, drop: drop, dropWhile: dropWhile, flatten: flatten$1
  };

  /**
   * 
   */

  var MV = Symbol('MonadicValue');

  var Identity = function () {
      function Identity(a) {
          classCallCheck(this, Identity);
          this.mvalue = a;
      }

      createClass(Identity, [{
          key: 'toString',
          value: function toString() {
              return 'Identity(' + this.mvalue + ')';
          }
      }, {
          key: 'equals',


          // -- Setoid 
          value: function equals(b) {
              return Identity.prototype.isPrototypeOf(b) && b.mvalue === this.mvalue;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map(f) {
              if (type.isFunc(f)) {
                  return Identity.of(f(this.mvalue));
              }
              throw 'Identity::map expects argument to be function but saw ' + f;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a) {
              return Identity.of(a);
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              if (type.isFunc(m.map)) {
                  return m.map(this.mvalue);
              }
              throw 'Identity::ap expects argument to be Functor but saw ' + m;
          }
          // -- Monad

      }, {
          key: 'flatMap',
          value: function flatMap(f) {
              if (type.isFunc(f)) {
                  return Identity.of(f(this.mvalue).mvalue);
              }
              throw 'Identity::flatMap expects argument to be function but saw ' + f;
          }
          // -- Foldable
          // reduce
          // -- Bifunctor
          // biMap, Functor
          // -- Profunctor
          // proMap, Functor
          // -- Monoid
          // empty, Semigroup
          // -- Traversable
          // traverse, Functor, Foldable
          // -- Semigroup
          // concat

      }, {
          key: 'mvalue',
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

  /**
   * 
   */

  var MV$1 = Symbol('MonadicValue');

  var Some = function () {
      function Some(a) {
          classCallCheck(this, Some);
          this.mvalue = a;
      }

      createClass(Some, [{
          key: 'toString',
          value: function toString() {
              return 'Some(' + this.mvalue + ')';
          }
      }, {
          key: 'isSome',
          value: function isSome() {
              return !type.isNil(this.mvalue);
          }

          // -- Setoid

      }, {
          key: 'equals',
          value: function equals(b) {
              return Some.prototype.isPrototypeOf(b) && b.mvalue === this.mvalue;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map(f) {
              if (type.isFunc(f)) {
                  return Maybe.of(f(this.mvalue));
              }
              throw 'Some::map expects argument to be function but saw ' + f;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a) {
              return Some.of(a);
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              if (type.isFunc(m.map)) {
                  return m.map(this.mvalue);
              }
              throw 'Some::ap expects argument to be Functor but saw ' + m;
          }
          // -- Monad

      }, {
          key: 'flatMap',
          value: function flatMap(f) {
              if (type.isFunc(f)) {
                  return Maybe.of(f(this.mvalue).mvalue);
                  // return this.map(f).flatten();
              }
              throw 'Some::flatMap expects argument to be function but saw ' + f;
          }
          // -- Recovering

      }, {
          key: 'orElse',
          value: function orElse() {
              return this.mvalue;
          }
      }, {
          key: 'orSome',
          value: function orSome() {
              return this;
          }
          // -- Foldable

      }, {
          key: 'reduce',
          value: function reduce(f, a) {
              if (type.isFunc(f)) {
                  return f(a, this.mvalue);
              }
              throw 'Some::reduce expects first argument to be function but saw ' + f;
          }
          // -- ?

      }, {
          key: 'fold',
          value: function fold(_, g) {
              if (type.isFunc(g)) {
                  return g(this.mvalue);
              }
              throw 'Some::fold expects argument 2 to be function but saw ' + g;
          }
      }, {
          key: 'cata',
          value: function cata(o) {
              if (type.isFunc(o.Some)) {
                  return this.fold(o, o.Some);
              }
              throw 'Some::cata expected Object of {Some: fn}, but saw ' + o;
          }
          // -- Bifunctor

      }, {
          key: 'biMap',
          value: function biMap(_, g) {
              if (type.isFunc(g)) {
                  return Maybe.of(this.fold(_, g));
              }
              throw 'Some::biMap expects argument 2 to be function but saw ' + g;
          }
          // -- Traversable

      }, {
          key: 'mvalue',
          set: function set(a) {
              if (type.isNil(a)) {
                  throw 'Some::of cannot create from null or undefined but saw ' + a;
              }
              this[MV$1] = a;
          },
          get: function get() {
              return this[MV$1];
          }
      }], [{
          key: 'is',
          value: function is(a) {
              return Some.prototype.isPrototypeOf(a);
          }
      }, {
          key: 'of',
          value: function of(a) {
              return new Some(a);
          }
      }]);
      return Some;
  }();

  var None = function () {
      function None() {
          classCallCheck(this, None);
          this.mvalue = null;
      }

      createClass(None, [{
          key: 'toString',
          value: function toString() {
              return 'None';
          }
      }, {
          key: 'isSome',
          value: function isSome() {
              return false;
          }

          // -- Setoid

      }, {
          key: 'equals',
          value: function equals(b) {
              return None.prototype.isPrototypeOf(b) && b.toString() === this.toString();
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map() {
              return this;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of() {
              return None.of();
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              return m;
          }
          // -- Monad

      }, {
          key: 'flatten',
          value: function flatten() {
              return this;
          }
          // -- Chain

      }, {
          key: 'flatMap',
          value: function flatMap() {
              return this;
          }
          // -- Recovering

      }, {
          key: 'orElse',
          value: function orElse(a) {
              return a;
          }
      }, {
          key: 'orSome',
          value: function orSome(a) {
              return Maybe.of(a);
          }
          // -- Foldable
          // reduce
          // -- ?

      }, {
          key: 'fold',
          value: function fold(f) {
              if (type.isFunc(f)) {
                  return f();
              }
              throw 'None::fold expects argument 1 to be function but saw ' + f;
          }
      }, {
          key: 'cata',
          value: function cata(o) {
              if (type.isFunc(o.None)) {
                  return this.fold(o.None);
              }
              throw 'None::cata expected Object of {None: fn}, but saw ' + o;
          }
          // -- Bifunctor

      }, {
          key: 'biMap',
          value: function biMap(f) {
              if (type.isFunc(f)) {
                  return Maybe.of(this.fold(f));
              }
              throw 'None::biMap expects argument 1 to be function but saw ' + f;
          }
          // -- Traversable

      }, {
          key: 'mvalue',
          set: function set(a) {
              this[MV$1] = a;
          },
          get: function get() {
              return this[MV$1];
          }
      }], [{
          key: 'is',
          value: function is(a) {
              return None.prototype.isPrototypeOf(a);
          }
      }, {
          key: 'of',
          value: function of() {
              return new None();
          }
      }]);
      return None;
  }();

  var Maybe = function () {
      function Maybe() {
          classCallCheck(this, Maybe);
      }

      createClass(Maybe, null, [{
          key: 'of',
          value: function of(a) {
              return type.isNil(a) ? None.of() : Some.of(a);
          }
      }, {
          key: 'fromNullable',
          value: function fromNullable(a) {
              return Maybe.of(a);
          }
      }, {
          key: 'fromEither',
          value: function fromEither(m) {
              return m.fold(None.of, Some.of);
          }
      }, {
          key: 'is',
          value: function is(a) {
              return Some.is(a) || None.is(a);
          }
      }]);
      return Maybe;
  }();

  /**
   * 
   */

  var MV$2 = Symbol('MonadicValue');

  var Right = function () {
      function Right(a) {
          classCallCheck(this, Right);
          this.mvalue = a;
      }

      createClass(Right, [{
          key: 'toString',
          value: function toString() {
              return 'Right(' + this.mvalue + ')';
          }
      }, {
          key: 'isRight',
          value: function isRight() {
              return true;
          }

          // -- Setoid

      }, {
          key: 'equals',
          value: function equals(b) {
              return Right.prototype.isPrototypeOf(b) && b.mvalue === this.mvalue;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map(f) {
              if (type.isFunc(f)) {
                  return Right.of(f(this.mvalue));
              }
              throw 'Right::map expects argument to be function but saw ' + f;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a) {
              return Right.of(a);
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              if (type.isFunc(m.map)) {
                  return m.map(this.mvalue);
              }
              throw 'Right::ap expects argument to be Functor but saw ' + m;
          }
          // -- Monad

      }, {
          key: 'flatMap',
          value: function flatMap(f) {
              if (type.isFunc(f)) {
                  return Either.try(function (mv) {
                      return f(mv).mvalue;
                  }, this.mvalue);
              }
              throw 'Right::flatMap expects argument to be function but saw ' + f;
          }
          // -- Recovering

      }, {
          key: 'orElse',
          value: function orElse() {
              return this.mvalue;
          }
      }, {
          key: 'orRight',
          value: function orRight() {
              return this;
          }
          // -- Foldable
          // reduce
          // -- ?

      }, {
          key: 'fold',
          value: function fold(_, g) {
              if (type.isFunc(g)) {
                  return g(this.mvalue);
              }
              throw 'Right::fold expects argument 2 to be function but saw ' + g;
          }
      }, {
          key: 'cata',
          value: function cata(o) {
              if (type.isFunc(o.Right)) {
                  return o.Right(this.mvalue);
              }
              throw 'Right::cata expected Object of {Right: fn}, but saw ' + o;
          }
          // -- Bifunctor

      }, {
          key: 'biMap',
          value: function biMap(_, g) {
              if (type.isFunc(g)) {
                  return Right.of(g(this.mvalue));
              }
              throw 'Right::biMap expects argument 2 to be function but saw ' + g;
          }
      }, {
          key: 'swap',
          value: function swap() {
              return Left.of(this.mvalue);
          }
      }, {
          key: 'mapLeft',
          value: function mapLeft() {
              return this;
          }
          // -- Semigroup
          // -- Traversable

      }, {
          key: 'mvalue',
          set: function set(a) {
              this[MV$2] = a;
          },
          get: function get() {
              return this[MV$2];
          }
      }], [{
          key: 'is',
          value: function is(a) {
              return Right.prototype.isPrototypeOf(a);
          }
      }, {
          key: 'of',
          value: function of(a) {
              return new Right(a);
          }
      }]);
      return Right;
  }();

  var Left = function () {
      function Left(a) {
          classCallCheck(this, Left);
          this.mvalue = a;
      }

      createClass(Left, [{
          key: 'toString',
          value: function toString() {
              return 'Left(' + this.mvalue + ')';
          }
      }, {
          key: 'isRight',
          value: function isRight() {
              return false;
          }

          // -- Setoid

      }, {
          key: 'equals',
          value: function equals(b) {
              return Left.prototype.isPrototypeOf(b) && b.mvalue === this.mvalue;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map() {
              return this;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a) {
              return Left.of(a);
          }
      }, {
          key: 'ap',
          value: function ap() {
              return this;
          }
          // -- Monad

      }, {
          key: 'flatten',
          value: function flatten() {
              return this;
          }
          // -- Chain

      }, {
          key: 'flatMap',
          value: function flatMap() {
              return this;
          }
          // -- Recovering

      }, {
          key: 'orElse',
          value: function orElse(a) {
              return a;
          }
      }, {
          key: 'orRight',
          value: function orRight(a) {
              return Right.of(a);
          }
          // -- Foldable

      }, {
          key: 'reduce',
          value: function reduce(f, a) {
              if (type.isFunc(f)) {
                  return f(a, this.mvalue);
              }
          }
          // -- ?

      }, {
          key: 'fold',
          value: function fold(f) {
              if (type.isFunc(f)) {
                  return f(this.mvalue);
              }
              throw 'Left::fold expects argument 1 to be function but saw ' + f;
          }
      }, {
          key: 'cata',
          value: function cata(o) {
              if (type.isFunc(o.Left)) {
                  return o.Left(this.mvalue);
              }
              throw 'Left::cata expected Object of {Left: fn}, but saw ' + o;
          }
          // -- Bifunctor

      }, {
          key: 'biMap',
          value: function biMap(f) {
              if (type.isFunc(f)) {
                  return Left.of(f(this.mvalue));
              }
              throw 'Left::biMap expects argument 1 to be function but saw ' + f;
          }
      }, {
          key: 'swap',
          value: function swap() {
              return Right.of(this.mvalue);
          }
      }, {
          key: 'mapLeft',
          value: function mapLeft(f) {
              if (type.isFunc(f)) {
                  return this.biMap(f);
              }
              throw 'Left::biMap expects argument 1 to be function but saw ' + f;
          }
          // -- Traversable

      }, {
          key: 'mvalue',
          set: function set(a) {
              this[MV$2] = a;
          },
          get: function get() {
              return this[MV$2];
          }
      }], [{
          key: 'is',
          value: function is(a) {
              return Left.prototype.isPrototypeOf(a);
          }
      }, {
          key: 'of',
          value: function of(a) {
              return new Left(a);
          }
      }]);
      return Left;
  }();

  var Either = function () {
      function Either() {
          classCallCheck(this, Either);
      }

      createClass(Either, null, [{
          key: 'fromNullable',
          value: function fromNullable(exc, a) {
              if (!type.isNull(a) && !type.isVoid(a)) {
                  return Right.of(a);
              }
              return Left.of(exc);
          }
      }, {
          key: 'fromMaybe',
          value: function fromMaybe(exc, m) {
              return m.fold(function () {
                  return Left.of(exc);
              }, Right.of);
          }
      }, {
          key: 'fromIO',
          value: function fromIO(exc, m) {
              var e = Either.try(m.performIO);
              return e.isRight() ? e : Left.of(exc);
          }
      }, {
          key: 'try',
          value: function _try(f) {
              for (var _len = arguments.length, partials = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  partials[_key - 1] = arguments[_key];
              }

              if (type.isFunc(f)) {
                  if (f.length <= partials.length) {
                      try {
                          var R = f.apply(undefined, partials);
                          return Error.prototype.isPrototypeOf(R) ? Left.of(R.message) : Right.of(R);
                      } catch (exc) {
                          return Left.of(exc.message);
                      }
                  }
                  return function () {
                      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                          args[_key2] = arguments[_key2];
                      }

                      try {
                          var _R = f.apply(undefined, partials.concat(args));
                          return Error.prototype.isPrototypeOf(_R) ? Left.of(_R.message) : Right.of(_R);
                      } catch (exc) {
                          return Left.of(exc.message);
                      }
                  };
              }
              throw 'Either::try expects argument to be function but saw ' + f;
          }
      }]);
      return Either;
  }();

  /**
   * 
   */

  var MV$3 = Symbol('MonadicValue');

  var IO = function () {
      function IO(a) {
          classCallCheck(this, IO);
          this.performIO = a;
      }

      createClass(IO, [{
          key: 'toString',
          value: function toString() {
              return 'IO(' + this.performIO + ')';
          }
      }, {
          key: 'equals',


          // -- Setoid 
          value: function equals(b) {
              return IO.prototype.isPrototypeOf(b) && b.performIO === b.performIO;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map(f) {
              if (type.isFunc(f)) {
                  return IO.of(combinators.compose(f, this.performIO));
              }
              throw 'IO::map expects argument to be function but saw ' + f;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a) {
              return IO.of(a);
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              if (type.isFunc(m.map)) {
                  return m.map(this.performIO);
              }
              throw 'IO::ap expects argument to be Functor but saw ' + m;
          }
          // -- Monad

      }, {
          key: 'flatMap',
          value: function flatMap(f) {
              if (type.isFunc(f)) {
                  return IO.of(combinators.compose(function (mv) {
                      return mv.performIO ? mv.performIO() : mv.mvalue;
                  }, f, this.performIO));
                  // return this.map(f).flatten();
              }
              throw 'IO::flatMap expects argument to be function but saw ' + f;
          }
          // -- Semigroup

      }, {
          key: 'concat',
          value: function concat(m) {
              if (IO.is(m)) {
                  return IO.of(combinators.compose(m.performIO, this.performIO));
              }
              throw 'IO::concat expected argument to be IO but saw ' + m;
          }
          // -- Monoid

      }, {
          key: 'performIO',
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
              return new IO(a);
          }
      }, {
          key: 'empty',
          value: function empty() {
              return IO.of(combinators.identity);
          }
          // -- Foldable
          // reduce

      }]);
      return IO;
  }();

  /**
   * 
   */

  var MV$4 = Symbol('MonadicValue');
  var OV = Symbol('OldMonadicValue');

  var State = function () {
      function State(a, b) {
          classCallCheck(this, State);
          this.mvalue = a;this.mbefore = b;
      }

      createClass(State, [{
          key: 'toString',
          value: function toString() {
              return 'State(' + this.mvalue + ', ' + this.mbefore + ')';
          }
      }, {
          key: 'equals',


          // -- Setoid 
          value: function equals(b) {
              return State.prototype.isPrototypeOf(b) && b.mvalue === this.mvalue && b.mbefore === this.mbefore;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map(f) {
              if (type.isFunc(f)) {
                  return State.of(f(this.mvalue), this.mvalue);
              }
              throw 'State::map expects argument to be function but saw ' + f;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a, b) {
              return State.of(a, b);
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              if (type.isFunc(m.map)) {
                  return m.map(this.mvalue);
              }
              throw 'State::ap expects argument to be Functor but saw ' + m;
          }
          // -- Monad

      }, {
          key: 'flatMap',
          value: function flatMap(f) {
              if (type.isFunc(f)) {
                  return State.of(f(this.mvalue).mvalue, this.mvalue);
              }
              throw 'State::flatMap expects argument to be function but saw ' + f;
          }
          // -- Foldable
          // reduce

      }, {
          key: 'mvalue',
          set: function set(a) {
              this[MV$4] = a;
          },
          get: function get() {
              return this[MV$4];
          }
      }, {
          key: 'mbefore',
          set: function set(a) {
              this[OV] = a;
          },
          get: function get() {
              return this[OV] || null;
          }
      }], [{
          key: 'is',
          value: function is(a) {
              return State.prototype.isPrototypeOf(a);
          }
      }, {
          key: 'of',
          value: function of(a, b) {
              return new State(a, b);
          }
      }]);
      return State;
  }();

  /**
   * 
   */

  var RUN_PROG = Symbol('MonadicFork');
  var CLEANUP = Symbol('MonadicCleanUp');

  var delay = type.isFunc(setImmediate) ? function (f) {
      return setImmediate(f);
  } : !type.isVoid(process) ? function (f) {
      return process.nextTick(f);
  } : function (f) {
      return setTimeout(f, 0);
  };

  var ofVoid = function ofVoid() {
      return void 0;
  };

  var Task = function () {
      function Task(a, b) {
          classCallCheck(this, Task);
          this.fork = a;this.cleanUp = b;
      }

      createClass(Task, [{
          key: 'toString',
          value: function toString() {
              return 'Task';
          }
      }, {
          key: 'equals',


          // -- Setoid 
          value: function equals(b) {
              return Task.prototype.isPrototypeOf(b) && b.fork === this.fork && b.cleanUp === this.cleanUp;
          }
          // -- Functor

      }, {
          key: 'map',
          value: function map(f) {
              var _this = this;

              if (type.isFunc(f)) {
                  return Task.of(function (rej, res) {
                      return _this.fork(function (mv) {
                          return rej(mv);
                      }, function (mv) {
                          return res(f(mv));
                      });
                  }, this.cleanUp);
              }
              throw 'Task::map expects argument to be function but saw ' + f;
          }
          // -- Applicative

      }, {
          key: 'of',
          value: function of(a) {
              return Task.of(a, this.cleanUp);
          }
      }, {
          key: 'ap',
          value: function ap(m) {
              var fork = this.fork,
                  mfork = m.fork,
                  cleanUp = this.cleanUp,
                  mcleanUp = m.cleanUp;

              var cleanBoth = function cleanBoth(_ref) {
                  var _ref2 = slicedToArray(_ref, 2);

                  var a = _ref2[0];
                  var b = _ref2[1];

                  cleanUp(a);
                  mcleanUp(b);
              };

              return Task.of(function (rej, res) {
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

                  var guardRes = function guardRes(set) {
                      return function (mv) {
                          if (rejected) {
                              return;
                          }
                          set(mv);
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

                  var state = fork(guardRej, guardRes(function (a) {
                      fload = true;f = a;
                  }));
                  var mstate = mfork(guardRej, guardRes(function (b) {
                      vload = true;v = b;
                  }));

                  states = [state, mstate];
                  return states;
              }, cleanBoth);
          }
          // -- Monad

      }, {
          key: 'flatMap',
          value: function flatMap(f) {
              var _this2 = this;

              if (type.isFunc(f)) {
                  return Task.of(function (rej, res) {
                      return _this2.fork(rej, function (a) {
                          return f(a).fork(rej, res);
                      });
                  }, this.cleanUp);
                  // return this.map(f).flatten();
              }
              throw 'Task::flatMap expects argument to be function but saw ' + f;
          }
          // -- Foldable
          // -- ?

      }, {
          key: 'fold',
          value: function fold(f, g) {
              var _this3 = this;

              if (type.isFunc(g) && type.isFunc(f)) {
                  return Task.of(function (rej, res) {
                      return _this3.fork(function (r) {
                          return rej(f(r));
                      }, function (v) {
                          return res(g(v));
                      });
                  }, this.cleanUp);
              }
              throw 'Task::fold expects arguments to be functions but saw ' + [f, g];
          }
      }, {
          key: 'cata',
          value: function cata(_ref3) {
              var Reject = _ref3.Reject;
              var Resolve = _ref3.Resolve;

              if (type.isFunc(Resolve) && type.isFunc(Reject)) {
                  return this.fold(Reject, Resolve);
              }
              throw 'Task::cata expected Object of {Reject, Resolve}';
          }
          // -- Bifunctor

      }, {
          key: 'biMap',
          value: function biMap(f, g) {
              var _this4 = this;

              if (type.isFunc(g) && type.isFunc(f)) {
                  return Task.of(function (rej, res) {
                      return _this4.fold(rej, res);
                  }, this.cleanUp);
              }
              throw 'Task::biMap expected arguments to be functions but saw ' + [f, g];
          }
      }, {
          key: 'swap',
          value: function swap() {
              var _this5 = this;

              return Task.of(function (rej, res) {
                  return _this5.fork(res, rej);
              }, this.cleanUp);
          }
      }, {
          key: 'mapRejected',
          value: function mapRejected(f) {
              var _this6 = this;

              if (type.isFunc(f)) {
                  return Task.of(function (rej, res) {
                      return _this6.fork(function (a) {
                          return rej(f(a));
                      }, res);
                  }, this.cleanUp);
              }
          }
          // -- Traversable
          // -- Monoid

      }, {
          key: 'concat',

          // -- Semigroup
          value: function concat(m) {
              var _this7 = this;

              if (Task.is(m)) {
                  var _ret = function () {
                      var fork = _this7.fork,
                          mfork = m.fork,
                          cleanUp = _this7.cleanUp,
                          mcleanUp = m.cleanUp;

                      var cleanBoth = function cleanBoth(_ref4) {
                          var _ref5 = slicedToArray(_ref4, 2);

                          var a = _ref5[0];
                          var b = _ref5[1];

                          cleanUp(a);
                          mcleanUp(b);
                      };

                      return {
                          v: Task.of(function (rej, res) {
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

                              state = fork(guard(rej), guard(res));
                              mstate = mfork(guard(rej), guard(res));
                              states = [state, mstate];
                              return states;
                          }, cleanBoth)
                      };
                  }();

                  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
              }
              throw 'Task::concat expected argument to be Task but saw ' + m;
          }
          // -- Recovering

      }, {
          key: 'orElse',
          value: function orElse(f) {
              var _this8 = this;

              if (type.isFunc(f)) {
                  return Task.of(function (rej, res) {
                      return _this8.fork(function (a) {
                          return f(a).fork(rej, res);
                      }, res);
                  }, this.cleanUp);
              }
              throw 'Task::orElse expected argument to be function but saw ' + f;
          }
          // -- Foldable
          // reduce

      }, {
          key: 'fork',
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
      }, {
          key: 'resolve',
          value: function resolve(a) {
              return Task.of(function (rej, res) {
                  return res(a);
              });
          }
      }, {
          key: 'reject',
          value: function reject(a) {
              return Task.of(function (rej) {
                  return rej(a);
              });
          }
      }, {
          key: 'of',
          value: function of(a, b) {
              return new Task(a, b);
          }
      }, {
          key: 'empty',
          value: function empty() {
              return Task.of(function () {
                  return void 0;
              });
          }
      }]);
      return Task;
  }();

  /**
   * 
   */

  var liftA2 = decorators.curry(function (f, M1, M2) {
      return M1.map(f).ap(M2);
  });

  var liftA3 = decorators.curry(function (f, M1, M2, M3) {
      return M1.map(f).ap(M2).ap(M3);
  });

  var liftA4 = decorators.curry(function (f, M1, M2, M3, M4) {
      return M1.map(f).ap(M2).ap(M3).ap(M4);
  });

  var liftA5 = decorators.curry(function (f, M1, M2, M3, M4, M5) {
      return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5);
  });

  var liftA6 = decorators.curry(function (f, M1, M2, M3, M4, M5, M6) {
      return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5).ap(M6);
  });

  var liftA7 = decorators.curry(function (f, M1, M2, M3, M4, M5, M6, M7) {
      return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5).ap(M6).ap(M7);
  });

  var liftA8 = decorators.curry(function (f, M1, M2, M3, M4, M5, M6, M7, M8) {
      return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5).ap(M6).ap(M7).ap(M8);
  });

  var monads = {
      Identity: Identity, IO: IO, Maybe: Maybe, None: None, Some: Some, State: State, Either: Either, Left: Left, Right: Right, Task: Task,
      liftA2: liftA2, liftA3: liftA3, liftA4: liftA4, liftA5: liftA5, liftA6: liftA6, liftA7: liftA7, liftA8: liftA8
      // mmaybe, meither, 
  };

  var __main = {
      arity: arity,
      type: type,
      combinators: combinators,
      decorators: decorators,
      monads: monads,
      lenses: lenses,
      operators: operators,
      transducers: transducers
  };

  return __main;

}));