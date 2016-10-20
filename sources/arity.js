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



const isFn = (f) => typeof f === 'function';

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
const aritize = (n, f) => {
    let len = n, args = [], wrap = null;
    if (f.length >= len) { return f; }
    while (len > 0) { args.push('arg' + len--); }
    wrap = 'return (' + args.join(',') + ') => fx(' + args.join(',') + ')';
    return new Function('fx', wrap)(f);
}



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
const monadic = (f) => {
    if (isFn(f)) {
        return (x = void 0) => {
            if (x === void 0) {
                return monadic(f);
            }
            return f(x);
        }
    }
    throw 'decorators::monadic awaits a function but saw ' + f;
}

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
const dyadic = (f) => {
    if (isFn(f)) {
        return (x = void 0, y = void 0) => {
            if (x === void 0) {
                return dyadic(f);
            }
            if (y === void 0) {
                return monadic((_y) => f(x, _y));
            }
            return f(x, y);
        }
    }
    throw 'decorators::dyadic awaits a function but saw ' + f;
}

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
const triadic = (f) => {
    if (isFn(f)) {
        return (x = void 0, y = void 0, z = void 0) => {
            if (x === void 0) {
                return triadic(f);
            }
            if (y === void 0) {
                return dyadic((_y, _z) => f(x, _y, _z));
            }
            if (z === void 0) {
                return monadic((_z) => f(x, y, _z));
            }
            return f(x, y, z);
        }
    }
    throw 'decorators::triadic awaits a function but saw ' + f;
}

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
const tetradic = (f) => {
    if (isFn(f)) {
        return (w = void 0, x = void 0, y = void 0, z = void 0) => {
            if (w === void 0) {
                return tetradic(f);
            }
            if (x === void 0) {
                return triadic((_x, _y, _z) => f(w, _x, _y, _z));
            }
            if (y === void 0) {
                return dyadic((_y, _z) => f(w, x, _y, _z));
            }
            if (z === void 0) {
                return monadic((_z) => f(w, x, y, _z));
            }
            return f(w, x, y, z);
        }
    }
    throw 'decorators::tetradic awaits a function but saw ' + f;
}

export default { aritize, monadic, dyadic, tetradic, triadic };