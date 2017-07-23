/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {isFunc, isArrayOf} from './types';
import {aritize} from './arity';
/**
 * A collection of higher order helpers for functional composition
 * @module combinators
 * @requires types
 * @requires arity
 */

/**
 * The identity, id or I combinator
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {any} Returns x
 */
export const id = (x) => x;

/**
 * The getter or K combinator (kestrel in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {anx} x Anything
 * @return {function} A getter of x
 */
export const getter = (x) => () => x;

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
export const tap = (x) => (y) => y(x);

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
export const by = (x, y, ...zs) => {
    if (y === void 0) {
        return (y, ..._zs) => by(x, y, ..._zs);
    }
    return zs.length > 0 ? x(...zs.map(y)) : (..._zs) => x(..._zs.map(y));
}

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
export const pipe = (f, ...fs) => {
    if (isFunc(f) && isArrayOf(isFunc, fs)) {
        return aritize(
            f.length,
            (...args) => fs.reduce((v, g) => g(v), f(...args))
        );
    }
    throw 'combinators::pipe awaits functions but saw ' + [f, ...fs];
}

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
export const compose = (...fs) => {
    if (isArrayOf(isFunc, fs)) {
        return pipe(...fs.reverse());
    }
    throw 'combinators::compose awaits functions but saw ' + fs;
}

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
export const and = (...fs) => {
    if (isArrayOf(isFunc, fs)) {
        return aritize(fs[0].length, (...xs) => {
            return !fs.some((f) => !f(...xs));
        });
    }
    throw 'combinators::and awaits functions but saw ' + fs;
}

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
export const or = (...fs) => {
    if (isArrayOf(isFunc, fs)) {
        return aritize(fs[0].length, (...xs) => {
            return fs.some((f) => !!f(...xs));
        });
    }
    throw 'combinators::or awaits functions but saw ' + fs;
}

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
export const fixed = (f) => {
    if (isFunc(f)) {
        return ((g) => g(g))((h) => f((...xs) => h(h)(...xs)));
    }
    throw 'combinators::fixed awaits function but saw ' + f;
}