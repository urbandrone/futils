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
const isNil = (x) => x == null;

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
const isAny = (x) => x != null;

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
const isVoid = (x) => x === undefined;

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
const isNull = (x) => x === null;

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
const isString = (x) => typeof x === 'string';

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
const isNumber = (x) => typeof x === 'number' && !isNaN(x) && isFinite(x);

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
const isInt = (x) => isNumber(x) && x % 1 === 0;

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
const isFloat = (x) => isNumber(x) && x % 1 !== 0;

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
const isBool = (x) => typeof x === 'boolean';

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
const isTrue = (x) => !!x;

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
const isFalse = (x) => !x;

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
const isFunc = (x) => typeof x === 'function';

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
const isObject = (x) => ({}.toString.call(x) === '[object Object]');

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
const isArray = (x) => Array.isArray(x);

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
const isDate = (x) => Date.prototype.isPrototypeOf(x);

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
const isRegex = (x) => RegExp.prototype.isPrototypeOf(x);

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
const isNode = (x) => Node.prototype.isPrototypeOf(x);

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
const isNodeList = (x) => NodeList.prototype.isPrototypeOf(x);

const isMap = (x) => Map.prototype.isPrototypeOf(x);

const isWeakMap = (x) => WeakMap.prototype.isPrototypeOf(x);

const isSet = (x) => Set.prototype.isPrototypeOf(x);

const isWeakSet = (x) => WeakSet.prototype.isPrototypeOf(x);

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
const isPromise = (x) => Promise.prototype.isPrototypeOf(x) ||
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
const isIterator = (x) => !isNil(x) && isFunc(x.next);

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
const isIterable = (x) => !isNil(x) && !!(x[Symbol.iterator] || !isNaN(x.length));

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
const isArrayOf = (f, x) => {
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
 * const {isString, isObjectOf} = require('futils');
 *
 * var pass = {greet: 'Hello', subject: 'World'},
 *     fail = {greet: 1, subject: 'World'};
 *
 * const isStrObject = isObjectOf(isString);
 *
 * isStrObject(pass); // -> true
 * isStrObject(fail); // -> false
 */
const isObjectOf = (f, x) => {
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



export default {
    isNil, isAny, isNull, isVoid, isArray, isBool, isSet, isString, isWeakMap,
    isWeakSet, isFalse, isTrue, isFunc, isFloat, isInt, isNumber, isNode,
    isNodeList, isDate, isObject, isPromise, isIterable, isArrayOf, isObjectOf,
    isMap, isRegex, isIterator
};