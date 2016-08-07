/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const {isFunc} = require('./types');
const {dyadic} = require('./decorators');
/**
 * A set of predefined comparator functions
 * @module futils/comparators
 * @requires futils/types
 * @requires futils/decorators
 */

/**
 * Takes in two values and compares them for equality (using ===). Returns a
 *     deferred invocation as long as one of the given parameters is a function
 * @method 
 * @version 0.7.0
 * @param {*} a First item to compare
 * @param {*} b Second item to compare
 * @return {boolean|function} Boolean or deferred invocation
 *
 * @example
 * const {eq, exec} = require('futils');
 *
 * const eq1 = eq(1);
 *
 * eq1(1); // -> true
 * eq1(2); // -> false
 *
 * const isHelloWorld = eq('HELLO WORLD', exec('toUpperCase'));
 * 
 * isHelloWorld('HELLO WORLD'); // -> true
 * isHelloWorld('hello world'); // -> true
 * isHelloWorld('nay'); // -> false
 */
const eq = dyadic((a, b) => {
    if (isFunc(a)) {
        return (ac) => eq(a(ac), b);
    }
    if (isFunc(b)) {
        return (bc) => eq(a, b(bc));
    }
    return a === b;
});

/**
 * Takes two numbers and tests if the second is greater than the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {gt} = require('futils');
 *
 * const gt2 = gt(2);
 *
 * gt2(3); // -> true
 * gt2(2); // -> false
 */
const gt = dyadic((a, b) => a < b);

/**
 * Takes two numbers and tests if the second is greater than or equal to the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {gte} = require('futils');
 *
 * const gte2 = gte(2);
 *
 * gte2(3); // -> true
 * gte2(2); // -> true
 */
const gte = dyadic((a, b) => a <= b);

/**
 * Takes two numbers and tests if the second is smaller than the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {lt} = require('futils');
 *
 * const lt2 = lt(2);
 *
 * lt2(1); // -> true
 * lt2(2); // -> false
 */
const lt = dyadic((a, b) => a > b);

/**
 * Takes two numbers and tests if the second is lower than or equal to the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {lte} = require('futils');
 *
 * const lte2 = lte(2);
 *
 * lte2(1); // -> true
 * lte2(2); // -> true
 */
const lte = dyadic((a, b) => a >= b);

/**
 * Takes two characters and compares them alphabetically
 * @method 
 * @version 0.8.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {locals} = require('futils');
 *
 * ['gamma', 'alpha', 'beta'].sort(locals);
 * // -> ['alpha', 'beta', 'gamma']
 */
const locals = dyadic((a, b) => {
    let lc = a.localeCompare(b);
    return lc < 0 ? -1 : lc > 0 ? 1 : 0;
});

module.exports = {
    eq, gt, gte, lt, lte, locals
};