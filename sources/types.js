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
 * @module types
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
export const isNil = (x) => x === null || x === void 0;

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
export const isAny = (x) => !isNil(x);

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
export const isVoid = (x) => x === undefined;

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
export const isNull = (x) => x === null;

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
export const isString = (x) => typeof x === 'string';

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
export const isNumber = (x) => typeof x === 'number' && !isNaN(x) && isFinite(x);

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
export const isInt = (x) => isNumber(x) && x % 1 === 0;

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
export const isFloat = (x) => isNumber(x) && x % 1 !== 0;

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
export const isBool = (x) => typeof x === 'boolean';

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
export const isTrue = (x) => !!x;

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
export const isFalse = (x) => !x;

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
export const isFunc = (x) => typeof x === 'function';

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
export const isObject = (x) => x != null && x.constructor === Object;

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
export const isArray = (x) => Array.isArray(x);

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
export const isDate = (x) => Date.prototype.isPrototypeOf(x);

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
export const isRegex = (x) => RegExp.prototype.isPrototypeOf(x);

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
export const isNode = (x) => Node.prototype.isPrototypeOf(x);

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
export const isNodeList = (x) => NodeList.prototype.isPrototypeOf(x);

/**
 * Returns true if given a Map
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for Maps
 *
 * @example
 * const {isMap} = require('futils');
 *
 * isMap(new Map()); // -> true
 * isMap({}); // -> false
 */
export const isMap = (x) => Map.prototype.isPrototypeOf(x);

/**
 * Returns true if given a Set
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for Sets
 *
 * @example
 * const {isSet} = require('futils');
 *
 * isSet(new Set()); // -> true
 * isSet([]); // -> false
 */
export const isSet = (x) => Set.prototype.isPrototypeOf(x);

/**
 * Returns true if given a WeakSet
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for WeakSets
 *
 * @example
 * const {isWeakSet} = require('futils');
 *
 * isWeakSet(new WeakSet()); // -> true
 * isWeakSet({}); // -> false
 */
export const isWeakSet = (x) => WeakSet.prototype.isPrototypeOf(x);

/**
 * Returns true if given a WeakMap
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for WeakMaps
 *
 * @example
 * const {isWeakMap} = require('futils');
 *
 * isWeakMap(new WeakMap()); // -> true
 * isWeakMap({}); // -> false
 */
export const isWeakMap = (x) => WeakMap.prototype.isPrototypeOf(x);

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
export const isPromise = (x) => Promise.prototype.isPrototypeOf(x) ||
                         x && isFunc(x.then);

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
export const isIterator = (x) => !isNil(x) && isFunc(x.next);

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
export const isIterable = (x) => !isNil(x) && !!(x[Symbol.iterator] || !isNaN(x.length));

/**
 * Returns true for iterators from generator functions. This is the strict
 *     version of isIterator, which only checks for a .next method on the given
 *     iterator while isGenerator checks for ES2015 conformity
 * @method
 * @version 2.8.0
 * @param {any} x Value to check
 * @return {boolean} True for iterators from generators
 *
 * @example
 * const {isGenerator} = require('futils');
 *
 * function * makeIds (seed) {
 *     let n = Math.abs(seed);
 *     while (true) {
 *         yield n;
 *         n += 1;
 *     }
 * }
 * 
 * isGenerator(makeIds(0)); // -> true
 * isGenerator([1, 2, 3]); // -> false
 */
export const isGenerator = (x) => !!x && isFunc(x.next) && isFunc(x.throw) &&
                                    isFunc(x.return) && !!x[Symbol.iterator];

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
export const isArrayOf = (f, x) => {
    if (x === void 0) {
        return (_x) => isArrayOf(f, _x);
    }
    return Array.isArray(x) && x.every(f);
}

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
export const isObjectOf = (f, x) => {
    if (x === void 0) {
        return (_x) => isObjectOf(f, _x);
    }
    
    if (isObject(x)) {
        for (let _key in x) {
            if (x.hasOwnProperty(_key) && !f(x[_key])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

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
export const isSetoid = (x) => x != null && isFunc(x.equals);

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
export const isFunctor = (x) => x != null && isFunc(x.map);

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
export const isApply = (x) => x != null && isFunc(x.ap);

/**
 * Returns true if given a pointed value (something that implements `of`)
 * @method 
 * @version 2.10.0
 * @param {any} x Value to check
 * @return {boolean} True if given a pointed value, false otherwise
 *
 * @example
 * const {isPointed} = require('futils');
 * 
 * isPointed(Array); // -> true
 */
export const isPointed = (x) => x != null && (isFunc(x.constructor.of) || isFunc(x.of));

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
export const isFoldable = (x) => x != null && (isFunc(x.fold) || isFunc(x.reduce));

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
export const isBifunctor = (x) => x != null && isFunc(x.biMap);

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
export const isSemigroup = (x) => x != null && isFunc(x.concat);

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
export const isMonoid = (x) => {
    return isArray(x) ||
           isSemigroup(x) && (isFunc(x.empty) || isFunc(x.constructor.empty));
}

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
export const isApplicative = (x) => isApply(x) && isPointed(x);

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
export const isMonad = (x) => isFunctor(x) && isSetoid(x) &&
                       isFunc(x.flatten) && isFunc(x.flatMap);