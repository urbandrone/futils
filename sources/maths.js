/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {curry} from './decorators';
import {trampoline, suspend} from './trampolines';

/**
 * Provides basic math operations missing on Math
 * @module maths
 * @requires decorators
 */



/**
 * Takes two numbers and adds them together
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The final value
 *
 * @example
 * const {add} = require('futils');
 *
 * add(1, 2); // -> 3
 *
 * const incOne = add(1);
 * incOne(2); // -> 3
 */
export const add = curry((a, b) => a + b);

/**
 * Takes two numbers and subtracts the first from the second
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The final value
 *
 * @example
 * const {subtract} = require('futils');
 *
 * subtract(1, 3); // -> 2
 *
 * const decOne = subtract(1);
 * decOne(3); // -> 2
 */
export const subtract = curry((a, b) => b - a);

/**
 * Takes two numbers and returns the product of both
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The final value
 *
 * @example
 * const {multiply} = require('futils');
 *
 * multiply(2, 2); // -> 4
 *
 * const double = multiply(2);
 * double(3); // -> 6
 */
export const multiply = curry((a, b) => a * b);

/**
 * Takes two numbers and divides the second by the first
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The final value
 *
 * @example
 * const {divide} = require('futils');
 *
 * divide(2, 6); // -> 3
 *
 * const half = divide(2);
 * half(6); // -> 3
 */
export const divide = curry((a, b) => !a ? 0 : b / a);

/**
 * Takes two numbers and returns the module of the second with the first
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The final value
 *
 * @example
 * const {modulo} = require('futils');
 *
 * modulo(2, 3); // -> 1
 *
 * const moduloTwo = modulo(2);
 * moduloTwo(3); // -> 1
 */
export const modulo = curry((a, b) => !a ? 0 : b % a);

/**
 * Calculates the greates common divisor of two numbers
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The greatest common divisor
 *
 * @example
 * const {gcd} = require('futils');
 *
 * gcd(3780, 3528); // -> 252
 */
export const gcd = curry((a, b) => {
	const go = trampoline((_a, _b) => {
		const _r = _a % _b;
		return _r === 0 ? _b : suspend(gcd, _b, _r);
	});
	return !a || !b ? 0 : go(a, b);
});

/**
 * Calculates the least common multiple of two numbers
 * @method
 * @version 2.7.0
 * @param {number} a First number
 * @param {number} b Second number
 * @return {number} The least common multiple
 *
 * @example
 * const {lcm} = require('futils');
 *
 * lcm(12, 18); // -> 36
 */
export const lcm = curry((a, b) => !a || !b ? 0 : Math.abs(a * b) / gcd(a, b));