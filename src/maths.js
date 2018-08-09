/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {curry} from './decorators';
import {trampoline, suspend} from './trampolines';
import {isIterable, isNumber} from './types';

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

/**
 * Calculates the sum based on different possible inputs. Ignores values
 *     which are not numbers or iterators and replaces them with zero
 * @method
 * @version 2.9.0
 * @param {number|array|iterator} [...a] A list of numbers or many single numbers
 * @return {number} The sum
 *
 * @example
 * const {sum} = require('futils');
 *
 * sum(1, 2, null, 3); // -> 6
 * sum([1, 2, null, 3]); // -> 6
 * sum([1, 2], 3); // -> 6
 * sum(null); // -> 0
 *
 * // -- or use with iterators. this generator produces up to N numbers
 * function * genN (n) {
 *     const i = 0;
 *     const j = Math.abs(n);
 *     while (i <= j) {
 *     	   yield i;
 *     	   i += 1;
 *     }
 * }
 *
 * sum(genN(3)); // -> 6
 * sum(genN(2), 3); // -> 6
 * sum(0, gen(3)); // -> 6
 *
 * // -- or mix and match
 * sum(1, genN(3), null, [1, 2, 3]); // -> 13
 */
export const sum = (...ns) => ns.reduce((m, n) => {
	if (isNumber(n)) {
		return m + n;
	}
	if (isIterable(n)) {
		const go = trampoline((x, xs) => {
			if (xs.length < 1) { return x; }
			return suspend(go, x + (isNumber(xs[0]) ? xs[0] : 0), xs.slice(1));
		});
		return go(m, [...n]);
	}
	return m;
}, 0);

/**
 * Calculates the product based on different possible inputs. Ignores values
 *     which are not numbers or iterators and replaces them with one
 * @method
 * @version 2.9.0
 * @param {number|array|iterator} [...a] A list of numbers or many single numbers
 * @return {number} The product
 *
 * @example
 * const {product} = require('futils');
 *
 * product(1, 2, null, 3); // -> 6
 * product([1, 2, null, 3]); // -> 6
 * product([1, 2], 3); // -> 6
 * product(null); // -> 0
 *
 * // -- or use with iterators. this generator produces up to N numbers
 * function * genN (n) {
 *     const i = 1;
 *     const j = Math.abs(n);
 *     while (i <= j) {
 *     	   yield i;
 *     	   i += 1;
 *     }
 * }
 *
 * product(genN(3)); // -> 6
 * product(genN(2), 3); // -> 6
 * product(1, gen(3)); // -> 6
 *
 * // -- or mix and match
 * product(1, genN(3), null, [1, 2, 3]); // -> 36
 */
export const product = (...ns) => ns.reduce((m, n) => {
	if (isNumber(n)) {
		return m < 1 ? n : m * n;
	}
	if (isIterable(n)) {
		const go = trampoline((x, xs) => {
			if (xs.length < 1) { return x; }
			return suspend(go, x * (isNumber(xs[0]) ? xs[0] : 1), xs.slice(1));
		});
		return go(m < 1 ? 1 : m, [...n]);
	}
	return m;
}, 0);