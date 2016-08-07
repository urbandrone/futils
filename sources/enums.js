/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const {isAny, isString, isNumber, isFunc, isArray, isObject} = require('./types');
const {dyadic, triadic} = require('./decorators');

/**
 * A collection of enumerable utility functions. Contains abstractions which
 *     work on arrays, objects and monads
 * @module futils/enums
 * @requires futils/types
 * @requires futils/decorators
 */


/**
 * Checks if a given object has a field of a certain key by name which is not
 *     inherited
 * @method 
 * @version 0.2.0
 * @param {string} key Name of the field
 * @param {object} x The object to test
 * @return {boolean} True if the field is present
 *
 * @example
 * const {has} = require('futils');
 *
 * let testee = {foo: 'bar'};
 *
 * has('foo', testee); // -> true
 * has('toString', testee); // -> false
 */
const has = dyadic((key, x) => ({}.hasOwnProperty.call(x, key)));

/**
 * Accesses a given object by a chain of keys
 * @method
 * @version 0.2.0
 * @param {string} key Single key or a chain of keys separated by `.`
 * @param {object|array|string|Monad} x Data structure to access
 * @return {any|null} Either the value of the key or null
 *
 * @example
 * const {field} = require('futils');
 *
 * const getName = field('name');
 * getName({name: 'John Doe'}); // -> 'John Doe'
 *
 * const firstName = field('name.first');
 * firstName({name: {first: 'John', last: 'Doe'}}); // -> 'John'
 */
const field = dyadic((key, x) => {
    var ks = isString(key) && /\./.test(key) ? key.split('.') : [key];
    return ks.reduce((a, b) => isAny(a) && isAny(a[b]) ? a[b] : null, x);
});

/**
 * Looks like the opposite of the `field` function but does the same
 * @method
 * @version 0.2.0
 * @param {object|array|string|Monad} x Data structure to access
 * @param {string} key Single key or chain of keys separated by `.`
 * @return {any|null} Either the value of the key or null
 *
 * @example
 * const {access} = require('futils');
 *
 * var keys = {8: 'Backspace', 9: 'Tab', 13: 'Enter', ... };
 * const keyMeans = access(keys);
 *
 * // imagine a series of keystrokes:
 * [8, 13, ... 13].map(keyMeans); // -> ['Backspace', 'Enter', ... 'Enter']
 */
const access = dyadic((x, k) => !!x ? field(k, x) : null);

/**
 * Assigns a value and a key to a given data structure, returns a clone of the
 *     given structure
 * @method 
 * @version 0.3.0
 * @param {string|number} k The key to assign to
 * @param {*} v The value to assing
 * @param {array|object} x The data structure to transform
 * @return {array|object|*} New array or object or the given thing
 *
 * @example
 * const {assoc} = require('futils');
 *
 * let p = { name: 'John Doe', accounts: [{name: 'jdoe'}] };
 *
 * const setAccountCount = assoc('accountCount');
 * setAccountCount(p.accounts.length, p);
 * // -> {name: 'John Doe', ..., accountCount: 1}
 *
 * console.log(p); // -> {name: 'John Doe', accounts: [...]};
 */
const assoc = triadic((k, v, x) => {
    let key = k, receiver = x;
    if (isArray(x)) {
        receiver = [...x];
        key = parseInt(key, 10);
        if (isNumber(key) && key < x.length && key >= 0) {
            receiver[key] = v;
        }
    } else if (isObject(x)) {
        receiver = Object.assign({}, x);
        if (isString(key)) {
            receiver[key] = v;
        }
    }
    return receiver;
});

/**
 * Allows to predefine a method invocation
 * @method
 * @version 0.2.0
 * @param {string|function} method Name of a method or a function
 * @param {any} [partials] Presetted arguments
 * @return {function} Function awaiting a instance
 *
 * @example
 * const {exec} = require('futils');
 *
 * const upper = exec('toUpperCase');
 * upper('hello world'); // -> 'HELLO WORLD'
 *
 * const firstHalf = exec('slice', 0, 5);
 * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
const exec = (method, ...partials) => (provider, ...rest) => {
    var res = isFunc(provider[method]) ?
              provider[method](...partials, ...rest) :
              isFunc(method) ?
              method.call(provider, ...partials, ...rest) :
              null;
    if (res == null) {
        return provider;
    }
    return res;
}

/**
 * Allows to predefine a method invocation
 * @method
 * @version 0.2.0
 * @param {string|function} method Name of a method or a function
 * @param {any} [partials] Presetted arguments
 * @return {function} Function awaiting a instance
 *
 * @example
 * const {execRight} = require('futils');
 *
 * const upper = execRight('toUpperCase');
 * upper('hello world'); // -> 'HELLO WORLD'
 *
 * const firstHalf = execRight('slice', 5, 0);
 * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
const execRight = (method, ...partials) => (provider, ...rest) => {
    var res = isFunc(provider[method]) ?
              provider[method](...[...partials, ...rest].reverse()) :
              isFunc(method) ?
              method.call(provider, ...[...partials, ...rest].reverse()) :
              null;
    if (res == null) {
        return provider;
    }
    return res;
}

/**
 * Given a base object and some extension objects, extends the base object with
 *     the rest of the extension objects. The extensions are included from left
 *     to right, so that the last extension overrides the first. Note: This
 *     performs a side effect by modifying the base object! If you instead need
 *     a pure version, use the `merge` function
 * @method
 * @version 0.3.0
 * @param {object} x Base object
 * @param {object} ...xs 1 up to N extensions
 * @return {object} The extended base object
 *
 * @example
 * const {extend} = require('futils');
 *
 * var customer = {name: 'John Doe', id: 00000001},
 *     basket = {items: [ ... number of items ... ]};
 *
 * var customerWithBasket = extend(customer, basket);
 *
 * customerWithBasket; // -> {name: '...', id: ..., items: [ ... ]}
 *
 * customer === customerWithBasket; // -> true
 */
const extend = (x, ...xs) => Object.assign(x, ...xs);

/**
 * Given a base object and some extension objects, creates a copy of the base
 *     object and extends that copy with the rest of the extension objects. The
 *     extensions are included from left to right, so that the last
 *     extension overrides the first. Note: This creates a new object, based on
 *     the first given parameter. If you instead want to perform a side effect
 *     use the `extend` function
 * @method
 * @version 0.3.0
 * @param {object} x Base object
 * @param {object} ...xs 1 up to N extensions
 * @return {object} The extended copy of the base object
 *
 * @example
 * const {merge} = require('futils');
 *
 * var customer = {name: 'John Doe', id: 00000001},
 *     basket = {items: [ ... number of items ... ]};
 *
 * var customerWithBasket = merge(customer, basket);
 * 
 * customerWithBasket; // -> {name: '...', id: ..., items: [ ... ]}
 *
 * customer === customerWithBasket; // -> false
 */
const merge = (...xs) => Object.assign({}, ...xs);

/**
 * Takes a object and prevents its pairs from being changed or removed, as well
 *     as freezing their enumerability, writability and configurability.
 * @method
 * @version 0.3.0
 * @param {object} x Object to make immutable
 * @return {object} Immutable object
 *
 * @example
 * const {immutable} = require('futils');
 *
 * var money = immutable({dollar: 5, cents: 50});
 *
 * money.dollar; // -> 5
 *
 * money.dollar += 5; // ;-)
 *
 * money.dollar; // -> 5
 */
const immutable = (x) => Object.freeze(merge(x));

/**
 * Given a iterable collection, returns the first item
 * @method
 * @version 0.2.0
 * @param {array|nodelist|array-like} xs The collection
 * @return {any} Whatever the first item is
 *
 * @example
 * const {first} = require('futils');
 *
 * first([1, 2, 3]); // -> 1
 *
 * first(document.querySelectorAll('a')); // -> <a>...</a>
 */
const first = (xs) => xs[0];

/**
 * Given a iterable collection, returns the last item
 * @method
 * @version 0.2.0
 * @param {array|nodelist|array-like} xs The collection
 * @return {any} Whatever the last item is
 *
 * @example
 * const {last} = require('futils');
 *
 * last([1, 2, 3]); // -> 3
 *
 * last(document.querySelectorAll('a')); // -> <a>...</a>
 */
const last = (xs) => xs[xs.length - 1];

/**
 * Generic mapper method, works on anything that implements a `map` method as
 *     well as on arrays and objects
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function to map
 * @param {object|array|Monad} m The mappable
 * @return {object|array|Monad} New instance of the mappable
 *
 * @example
 * const {map} = require('futils');
 *
 * const addOne = (n) => n + 1;
 * map(addOne, [1, 2, 3]); // -> [2, 3, 4]
 *
 * // auto curried:
 * const mapAdd1 = map(addOne);
 */
const map = dyadic((f, m) => {
    var ks, r;
    if (isFunc(f)) {
        if (isFunc(m.map)) {
            return m.map(f);
        }
        if (isObject(m)) {
            ks = Object.keys(m);
            r = {};
            for (let k of ks) {
                r[k] = f(m[k], k, m);
            }
            return r;
        }
        return m;
    }
    throw 'enums::map awaits a function as first argument but saw ' + f;
});

/**
 * Generic flatten method, works on anything that implements a `flatten` method
 *     as well as on arrays
 * @method
 * @version 0.2.0
 * @param {object|array|Monad} m The thing to flatten
 * @return {object|array|Monad} New instance or given if object
 *
 * @example
 * const {flatten} = require('futils');
 *
 * flatten([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, 4, 5]
 */
const flatten = (m) => {
    var xs;
    if (m && isFunc(m.flatten)) {
        return m.flatten();
    }
    if (isArray(m)) {
        xs = flattenTCO(m);
        while (isFunc(xs)) { xs = xs(); }
        return xs;
    }
    return m;
}

function flattenTCO (xs, ys = []) {
    if (xs.lenght < 1) { return ys; }
    if (isArray(xs[0])) {
        return () => {
            return flattenTCO([...xs[0], ...xs.slice(1)], ys);
        }
    }
    return () => {
        return flattenTCO([...xs.slice(1)], [...ys, xs[0]]);
    }
}

/**
 * Generic flatMap method, works on anything which implements a `map` and a
 *     `flatten` method as well as on arrays and on objects. Please note that
 *     objects will not be flattened
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function
 * @param {object|array|Monad} m The mappable
 * @return {object|array|Monad} New instance of given mappable
 *
 * @example
 * const {flatMap} = require('futils');
 *
 * const split = (s) => s.split('');
 * flatMap(split, ['Hello world']); // -> ['H', 'e', 'l', 'l', 'o', ...]
 */
const flatMap = dyadic((f, m) => {
    if (isFunc(f)) {
        return flatten(map(f, m));
    }
    throw 'enums::flatMap awaits a function as first argument but saw ' + f;
});



module.exports = {
    field, has, exec, execRight, access, extend, merge, immutable, first,
    last, map, flatten, flatMap, assoc
};