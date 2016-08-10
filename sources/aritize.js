/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Provides the aritize function
 * @module futils/aritize
 */



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
const aritize = (n, f) => {
    let len = n, args = [], wrap = null;
    if (f.length >= len) { return f; }
    while (len > 0) { args.push('arg' + len--); }
    args = args.join(',');
    wrap = 'return (' + args + ') => fx(' + args + ')';
    return new Function('fx', wrap)(f);
}

export default { aritize };