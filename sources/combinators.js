/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type from './types';
import arity from './aritize';
/**
 * A collection of higher order helpers for functional composition
 * @module futils/combinators
 * @requires futils/types
 * @requires futils/aritize
 */

/**
 * The identity or I combinator (idiot in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {any} Returns x
 */
const identity = (x) => x;

/**
 * The getter or K combinator (kestrel in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {anx} x Anything
 * @return {function} A getter of x
 */
const getter = (x) => () => x;

/**
 * The tap or T combinator (thrush in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {function} Function awaiting a function to tap with
 *
 * @example
 * const {isNumber} = require('futils');
 * 
 * const sqr = (n) => n * n;
 * 
 * const saveSqr = tap(sqr)((op) => {
 *     return (_n) => {
 *         return isNumber(_n) ? op(_n) : _n;
 *     }
 * });
 */
const tap = (x) => (y) => y(x);

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
const pipe = (f, ...fs) => {
    if (type.isFunc(f) && type.isArrayOf(type.isFunc, fs)) {
        return arity.aritize(
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
const compose = (...fs) => {
    if (type.isArrayOf(type.isFunc, fs)) {
        return pipe(fs.reverse());
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
const and = (...fs) => {
    if (type.isArrayOf(type.isFunc, fs)) {
        return arity.aritize(fs[0].length, (...xs) => {
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
const or = (...fs) => {
    if (type.isArrayOf(type.isFunc, fs)) {
        return arity.aritize(fs[0].length, (...xs) => {
            return fs.some((f) => !!f(...xs));
        });
    }
    throw 'combinators::or awaits functions but saw ' + fs;
}

/**
 * Takes N functions and returns a function which splats the incoming arguments
 *     onto the given function so that each function gets the same parameters.
 *     The returned function returns whatever the first splatted function
 *     returns
 * @method 
 * @version 0.4.0
 * @param {function} ...fs N functions to wrap
 * @return {function} A splatter function
 *
 * @example
 * const {splat} = require('futils');
 *
 * const sideFX1 = (...) => { ... };
 * const sideFX2 = (...) => { ... };
 *
 * const splattedFX = splat(
 *     sideFX1,
 *     sideFX2
 * );
 */
const splat = (...fs) => {
    if (type.isArrayOf(type.isFunc, fs)) {
        return (...xs) => {
            var r = fs[0](...xs);
            fs.slice(1).forEach((f) => f(...xs));
            return r == null ? null : r;
        }
    }
    throw 'combinators::splat awaits a bunch of functions but saw ' + fs;
}



export default { 
    compose, pipe, identity, tap, getter, and, or, splat
};