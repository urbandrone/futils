/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Provides the aritize function
 * @module arity
 */



const isFn = (f) => typeof f === 'function';

/**
 * Takes a number and a function with a variadic number of arguments and returns
 *     a function which takes as much arguments as specified. Valid numbers range
 *     from zero up to and including sixteen.
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
 * addTwo.length; // -> 2
 * addTwo(1, 2, 3); // -> 3
 */
export const aritize = (n, f) => {
    if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) {
        throw 'arity::aritize awaits a number as first argument but saw ' + n;
    }
    if (!isFn(f)) {
        throw 'arity::aritize awaits a function as second argument but saw ' + f;
    }
    switch (Math.abs(n)) {
        case 1:
            return (a) => f(a);
        case 2:
            return (a, b) => f(a, b);
        case 3:
            return (a, b, c) => f(a, b, c);
        case 4:
            return (a, b, c, d) => f(a, b, c, d);
        case 5:
            return (a, b, c, d, e) => f(a, b, c, d, e);
        case 6:
            return (a, b, c, d, e, g) => f(a, b, c, d, e, g);
        case 7:
            return (a, b, c, d, e, g, h) => f(a, b, c, d, e, g, h);
        case 8:
            return (a, b, c, d, e, g, h, i) => f(a, b, c, d, e, g, h, i);
        case 9:
            return (a, b, c, d, e, g, h, i, j) => {
                return f(a, b, c, d, e, g, h, i, j);
            }
        case 10:
            return (a, b, c, d, e, g, h, i, j, k) => {
                return f(a, b, c, d, e, g, h, i, j, k);
            }
        case 11:
            return (a, b, c, d, e, g, h, i, j, k, l) => {
                return f(a, b, c, d, e, g, h, i, j, k, l);
            }
        case 12:
            return (a, b, c, d, e, g, h, i, j, k, l, m) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m);
            }
        case 13:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o);
            }
        case 14:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o, p) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o, p);
            }
        case 15:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o, p, q) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o, p, q);
            }
        case 16:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o, p, q, r) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o, p, q, r);
            }
        default:
            return f;
    }
}



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
export const monadic = (f) => {
    if (isFn(f)) {
        return (x = void 0) => {
            if (x === void 0) {
                return monadic(f);
            }
            return f(x);
        }
    }
    throw 'arity::monadic awaits a function but saw ' + f;
}

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
export const dyadic = (f) => {
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
    throw 'arity::dyadic awaits a function but saw ' + f;
}

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
export const triadic = (f) => {
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
    throw 'arity::triadic awaits a function but saw ' + f;
}

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
export const tetradic = (f) => {
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
    throw 'arity::tetradic awaits a function but saw ' + f;
}