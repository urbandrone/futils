/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const {compose, getter} = require('./combinators');
const {dyadic, triadic, curry} = require('./decorators');
const {dot, assoc, map} = require('./enums');

/**
 * A collection of lens creators and operation functions for composable lenses
 * @module futils/lenses
 * @requires futils/combinators
 * @requires futils/decorators
 * @requires futils/enums
 */


const Const = (x) => ({value: x, map(){ return this; }});
const Identity = (x) => ({value: x, map(f){ return Identity(f(x)); }});

/**
 * Allows to create new types of lenses which work on different data structures
 *     than objects and arrays. Please note that the setter function has to
 *     take care to clone the given structure appropriate before manipulating it
 * @method 
 * @version 0.6.0
 * @param {function} getter A function defining how to get a value from the structure
 * @param {function} setter A function defining how to clone the structure and set a value
 * @return {function} A lens for the given data type
 *
 * @example
 * const {lens, over} = require('futils');
 *
 * let MapLens = lens((k, xs) => xs.get(k), (k, v, xs) => xs.set(k, v));
 * let m = new Map([['users', ['john doe']]]); 
 *
 * over(MapLens('users'), (s) => s.toUpperCase(), m); // -> ['JOHN DOE']
 */
const lens = curry((gets, sets, k, f, xs) => {
    return map((replacement) => sets(k, replacement, xs), f(gets(k, xs)))
});

// The bare bones, creates a lens which works on arrays and objects
const baseLens = lens(dot, assoc);


/**
 * Given a lens and a data structure, returns the current value foci on the data
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} lens A lens created by makeLenses
 * @param {array|object} data The data structure
 * @return {*} Whatever the current value is
 *
 * @example
 * const {makeLenses, view} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * view(L.name, data); // -> 'John Doe'
 */
const view = dyadic((lens, data) => lens(Const)(data).value);

/**
 * Given a lens, a function and a data structure, applies the function to the
 *     foci of the lens on the data structure and returns a copy of the given
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} lens A lens created by makeLenses
 * @param {function} f A data transforming function
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {makeLenses, over} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * over(L.name, (s) => s.toUpperCase(), data);
 * // -> {name: 'JOHN DOE', age: 30}
 */
const over = triadic((lens, f, data) => lens((y) => Identity(f(y)))(data).value );

/**
 * Given a lens, a value and a data structure, sets the value of the foci of the
 *     lens to the given value on the data structure and returns a copy of the
 *     given structure
 * @method 
 * @version 0.6.0
 * @param {function} lens A lens created by makeLenses
 * @param {*} v The value to set
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {makeLenses, set} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * set(L.name, 'Adam Smith', data);
 * // -> {name: 'Adam Smith', age: 30}
 */
const set = triadic((lens, v, data) => over(lens, getter(v), data));

/**
 * Takes a variadic number of string parameters and returns a collection of
 *     lenses where each lens points to one of the given parameters. A additional
 *     "num" lensmaker is returned too to allow peeking into array items
 * @method 
 * @version 0.6.0
 * @param {string} fields* String representing the fields on a object
 * @return {object} Collection of lenses
 *
 * @example
 * const {compose, makeLenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30, friends: [{name: 'Adam Smith'}]};
 * let L = makeLenses('name', 'age', 'friends');
 *
 * L.name(data); // -> 'John Doe'
 * L.age(data); // -> 30
 *
 * const firstFriendsName = compose(L.friends, L.num(0), L.name);
 * firstFriendsName(data); // -> 'Adam Smith'
 */
const makeLenses = (...fields) => fields.reduce((acc, field) => {
    if (acc[field] === void 0) {
        acc[field] = baseLens(field);
    }
    return acc;
}, { num: baseLens });

/**
 * Utility function, maps a lens over a nested data structure
 * @method 
 * @version 0.6.0
 * @param {function} f Data transformation function
 * @param {array|object} data The nested data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {compose, makeLenses, mappedLens, over} = require('futils');
 *
 * let data = [{id: '1'}, {id: '2'}, {id: '3'}];
 * let L = makeLenses('id');
 * 
 * const toInt = (n) => parseInt(n, 10);
 *
 * const nestedIdsLens = compose(mappedLens, L.id);
 * over(nestedIdsLens, toInt, data); // -> [{id: 1}, {id: 2}, {id: 3}]
 */
const mappedLens = (f, xs) => Identity(map(compose((x) => x.value, f), xs));



module.exports = { lens, makeLenses, mappedLens, view, over, set };