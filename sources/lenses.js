/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import decorators from './decorators';
import operators from './operators';

/**
 * A collection of lens creators and operation functions for composable lenses
 * @module futils/lenses
 * @requires futils/combinators
 * @requires futils/decorators
 * @requires futils/operators
 */


const Const = (x) => ({value: x, map(){ return this; }});
const Id = (x) => ({value: x, map(f){ return Id(f(x)); }});
const comp = (f, g) => (...args) => f(g(...args));

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
 * const {lenses} = require('futils');
 *
 * let MapLens = lenses.lens(
 *     (k, xs) => xs.get(k),
 *     (k, v, xs) => xs.set(k, v)
 * );
 * 
 * let m = new Map([['users', ['john doe']]]); 
 *
 * lenses.over(MapLens('users'), (s) => s.toUpperCase(), m); // -> ['JOHN DOE']
 */
const lens = decorators.curry((gets, sets, k, f, xs) => {
    return operators.map(
        (replacement) => sets(k, replacement, xs),
        f(gets(k, xs))
    )
});

// The bare bones, creates a lens which works on arrays and objects
const baseLens = lens(operators.field, operators.assoc);


/**
 * Given a lens and a data structure, returns the current value foci on the data
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {array|object} data The data structure
 * @return {*} Whatever the current value is
 *
 * @example
 * const {lenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = lenses.makeLenses('name', 'age');
 *
 * lenses.view(L.name, data); // -> 'John Doe'
 */
const view = decorators.curry((l, data) => l(Const)(data).value);

/**
 * Given a lens, a function and a data structure, applies the function to the
 *     foci of the lens on the data structure and returns a copy of the given
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {function} f A data transforming function
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {lenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = lenses.makeLenses('name', 'age');
 *
 * lenses.over(L.name, (s) => s.toUpperCase(), data);
 * // -> {name: 'JOHN DOE', age: 30}
 */
const over = decorators.curry((l, f, data) => l((y) => Id(f(y)))(data).value );

/**
 * Given a lens, a value and a data structure, sets the value of the foci of the
 *     lens to the given value on the data structure and returns a copy of the
 *     given structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {*} v The value to set
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {lenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = lenses.makeLenses('name', 'age');
 *
 * lenses.set(L.name, 'Adam Smith', data);
 * // -> {name: 'Adam Smith', age: 30}
 */
const set = decorators.curry((l, v, data) => over(l, () => v, data));

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
 * const {combinators, lenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30, friends: [{name: 'Adam Smith'}]};
 * let L = lenses.makeLenses('name', 'age', 'friends');
 *
 * L.name(data); // -> 'John Doe'
 * L.age(data); // -> 30
 *
 * const firstFriendsName = combinators.compose(L.friends, L.index(0), L.name);
 * firstFriendsName(data); // -> 'Adam Smith'
 */
const makeLenses = (...fields) => fields.reduce((acc, field) => {
    if (!operators.has(field, acc)) {
        acc[field] = baseLens(field);
    }
    return acc;
}, { index: baseLens });

/**
 * Utility function, maps a lens over a nested data structure
 * @method 
 * @version 1.0.4
 * @param {function} f Data transformation function
 * @param {array|object} data The nested data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {combinators, lenses} = require('futils');
 *
 * let data = [[1, 2, 3]];
 *
 * const inc = (n) => n + 1;
 *
 * const mapMapLens = combinators.compose(lenses.mappedLens, lenses.mappedLens);
 * lenses.over(mapMapLens, inc, data); // -> [[2, 3, 4]]
 */
const mappedLens = decorators.curry((f, xs) => Id(operators.map(
    comp(operators.field('value'), f), xs
)));



export default { lens, makeLenses, mappedLens, view, over, set };