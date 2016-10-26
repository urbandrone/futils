/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from './types';
import arity from './arity';

/**
 * A collection of operator functions to work on data structures
 * @module futils/operators
 * @requires futils/types
 * @requires futils/arity
 */



const _owns = Object.prototype.hasOwnProperty;

/**
 * Allows to predefine a method invocation
 * @method
 * @version 0.2.0
 * @param {string|function} method Name of a method or a function
 * @param {any} [partials] Presetted arguments
 * @return {function} Function awaiting a instance
 *
 * @example
 * const {call} = require('futils');
 *
 * const upper = call('toUpperCase');
 * upper('hello world'); // -> 'HELLO WORLD'
 *
 * const firstHalf = call('slice', 0, 5);
 * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
const call = (method, ...partials) => (provider, ...rest) => {
    let res = type.isString(method) && type.isFunc(provider[method]) ?
              provider[method](...partials, ...rest) :
              type.isFunc(method) ?
              method.call(provider, ...partials, ...rest) :
              null;
    if (res == null) {
        return provider;
    }
    return res;
}

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
 * has('missing', testee); // -> false
 */
const has = arity.dyadic((key, x) => _owns.call(x, key));

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
const field = arity.dyadic((key, x) => {
    let ks = type.isString(key) && /\./.test(key) ?
             key.split('.') :
             [key];
    return ks.reduce((a, b) => type.isAny(a) && type.isAny(a[b]) ?
                               a[b] :
                               null,
                     x
                    );
});

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
const assoc = arity.triadic((k, v, x) => {
    let key = k, receiver = x;
    if (type.isArray(x)) {
        receiver = [...x];
        key = parseInt(key, 10);
        if (type.isNumber(key) && key < x.length && key >= 0) {
            receiver[key] = v;
        }
    } else if (type.isObject(x)) {
        receiver = Object.assign({}, x);
        if (type.isString(key)) {
            receiver[key] = v;
        }
    }
    return receiver;
});

/**
 * Given a base object and some extension objects, creates a copy of the base
 *     object and extends that copy with the rest of the extension objects. The
 *     extensions are included from left to right, so that the last
 *     extension overrides the first
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
 * Returns pairs of [key, value] from a given object
 * @method 
 * @version 2.0.0
 * @param {object} xs The object to take pairs from
 * @return {array} Array of pairs [ [pair], [pair], ... ]
 *
 * @example
 * const {pairs} = require('futils');
 *
 * pairs({foo: 1, bar: 0}); // -> [['foo', 1], ['bar', 0]]
 */
const pairs = (xs) => Object.keys(xs).map((k) => [k, xs[k]]);



// -- Arrays --------------------
/**
 * Given a iterable collection, returns the first item
 * @method
 * @version 0.2.0
 * @param {array|array-like} xs The collection
 * @return {*} Whatever the first item is
 *
 * @example
 * const {first} = require('futils');
 *
 * first([1, 2, 3]); // -> 1
 *
 * first(document.querySelectorAll('a')); // -> <a></a>
 */
const first = (xs) => xs[0];

/**
 * Given a iterable collection, returns the head of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the head item is
 *
 * @example
 * const {head} = require('futils');
 *
 * head([1, 2, 3]); // -> [1]
 *
 * head(document.querySelectorAll('a')); // -> [<a></a>]
 */
const head = (xs) => [first(xs)];


/**
 * Given a iterable collection, returns all items but the last of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the initial items are
 *
 * @example
 * const {initial} = require('futils');
 *
 * initial([1, 2, 3]); // -> [1, 2]
 *
 * initial(
 *     document.querySelectorAll('a')
 * ); // -> [<a></a>, <a></a>, ...]
 */
const initial = (xs) => type.isArray(xs) ?
                        xs.slice(0, xs.length - 1) :
                        type.isIterable(xs) ?
                        Array.from(xs).slice(0, xs.length - 1) :
                        [];

/**
 * Given a iterable collection, returns the last item
 * @method
 * @version 0.2.0
 * @param {array|array-like} xs The collection
 * @return {*} Whatever the last item is
 *
 * @example
 * const {last} = require('futils');
 *
 * last([1, 2, 3]); // -> 3
 *
 * last(document.querySelectorAll('a')); // -> <a></a>
 */
const last = (xs) => xs[xs.length - 1];

/**
 * Given a iterable collection, returns the tail of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the tail item is
 *
 * @example
 * const {tail} = require('futils');
 *
 * tail([1, 2, 3]); // -> [3]
 *
 * tail(document.querySelectorAll('a')); // -> [<a></a>]
 */
const tail = (xs) => [last(xs)];

/**
 * Given a iterable collection, returns all items but the first of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Whatever the rest items are
 *
 * @example
 * const {rest} = require('futils');
 *
 * rest([1, 2, 3]); // -> [2, 3]
 *
 * rest(document.querySelectorAll('a')); // -> [..., <a></a>, <a></a>]
 */
const rest = (xs) => type.isArray(xs) ?
                     xs.slice(1) :
                     type.isIterable(xs) ?
                     Array.from(xs).slice(1) :
                     [];

/**
 * Given a iterable collection, returns all unique items of it
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs The collection
 * @return {array} Only unique items
 *
 * @example
 * const {unique} = require('futils');
 *
 * unique([2, 1, 2, 3, 3, 1]); // -> [2, 1, 3]
 */
const unique = (xs) => xs.reduce((acc, x) => {
    return acc.lastIndexOf(x) < 0 ? [...acc, x] : acc;
}, []);

/**
 * Given two iterable collections, returns the union of them
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs First collection
 * @param {array|array-like} ys Second collection
 * @return {array} The union of xs and ys
 *
 * @example
 * const {union} = require('futils');
 *
 * union([2, 1, 2], [3, 3, 1]); // -> [2, 1, 3]
 */
const union = arity.dyadic((xs, ys) => unique([...xs, ...ys]));

/**
 * Given two iterable collections, returns the intersection of them
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs First collection
 * @param {array|array-like} ys Second collection
 * @return {array} The intersection of xs and ys
 *
 * @example
 * const {intersect} = require('futils');
 *
 * intersect([2, 1, 2], [3, 3, 1]); // -> [1]
 */
const intersect = arity.dyadic((xs, ys) => {
    return union(xs, ys).filter((a) => {
        return xs.indexOf(a) > -1 && ys.indexOf(a) > -1;
    });
});


/**
 * Given two iterable collections, returns the difference of them
 * @method
 * @version 2.0.0
 * @param {array|array-like} xs First collection
 * @param {array|array-like} ys Second collection
 * @return {array} The difference of xs and ys
 *
 * @example
 * const {differ} = require('futils');
 *
 * differ([2, 1, 2], [3, 3, 1]); // -> [2, 3]
 */
const differ = arity.dyadic((xs, ys) => {
    return union(xs, ys).filter((a) => {
        return xs.indexOf(a) < 0 || ys.indexOf(a) < 0;
    });
});



// -- Setoid --------------------
/**
 * Generic setoid method, works on anything that implements a `equals` method. If
 *     no `equals` is found it matches on the value directly via strict
 *     comparison (===)
 * @method
 * @version 2.0.0 
 * @param {Setoid|*} a Any value to compare
 * @param {Setoid|*} b Any value to compare 
 * @return {boolean} True if both are equal
 *
 * @example
 * const {Maybe, equals} = require('futils');
 *
 * let m = Maybe.of(1);
 * let n = Maybe.of(1);
 *
 * equals(m, n); // -> true
 * equals(1, 1); // -> true
 */
const equals = arity.dyadic((a, b) => {
    return type.isSetoid(b) ? b.equals(a) : a === b;
});


// -- Functor --------------------
/**
 * Generic functor method, works on anything that implements a `map` method as
 *     well as on arrays and objects
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function to map
 * @param {object|array|Functor} m The functor to map over
 * @return {object|array|Functor} New instance of the functor
 *
 * @example
 * const {map} = require('futils');
 *
 * const addOne = (n) => n + 1;
 * map(addOne, [1, 2, 3]); // -> [2, 3, 4]
 *
 * let mapAddOne = map(addOne);
 * map(mapAddOne, [[1, 2], [3]]); // -> [[2, 3], [4]]
 */
const map = arity.dyadic((f, m) => {
    if (type.isFunc(f)) {
        if (type.isFunctor(m)) {
            return m.map(f);
        }
        if (type.isObject(m)) {
            return Object.keys(m).reduce((acc, k) => {
                acc[k] = f(m[k], k, m);
                return acc;
            }, {});
        }
        return m;
    }
    throw 'operators::map awaits a function as first argument but saw ' + f;
});

// -- Apply --------------------
/**
 * Generic apply method, works with either of (function, functor) or
 *     (apply/applicative, functor) or (apply/applicative, any)
 * @method
 * @version 2.0.0
 * @param {function|Applicative} mf Either function or Applicative
 * @param {array|Functor|*} ma Either array, Functor or single value
 * @return {array|Functor|*} Depending on the given input
 *
 * @example
 * const {Identity, ap} = require('futils');
 *
 * let as = [1, 3, 5];
 * let inc = (n) => n + 1;
 *
 * ap(inc, as); // -> [2, 4, 6]
 * ap(inc)(as); // -> [2, 4, 6]
 *
 * let minc = Identity.of(inc);
 * 
 * ap(minc, as); // -> [2, 4, 6]
 * ap(minc)(as); // -> [2, 4, 6]
 */
const ap = arity.dyadic((mf, ma) => {
    if (type.isFunc(mf)) {
        return type.isFunctor(ma) ? ma.map(mf) :
               type.isObject(ma) ? map(mf, ma) :
               mf(ma);
    }
    if (type.isApply(mf)) {
        return type.isFunctor(ma) ? mf.ap(ma) : 
               type.isObject(ma) ? mf.ap({map: (f) => map(f, ma)}) :
               mf.ap([ma])[0];
    }
    throw 'operators::ap awaits apply/function as first argument but saw ' + mf;
});



// -- Monad --------------------

/**
 * Generic flatten method, works on anything that implements a `flatten` method
 *     as well as on arrays
 * @method
 * @version 0.2.0
 * @param {array|Monad} m The thing to flatten
 * @return {array|Monad} New instance of given
 *
 * @example
 * const {flatten} = require('futils');
 *
 * flatten([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, 4, 5]
 */
const flatten = (m) => {
    if (type.isFunc(m.flatten)) {
        return m.flatten();
    }
    if (type.isArray(m)) {
        let xs = flattenTCO(m, []);
        while (xs instanceof Function) {
            xs = xs();
        }
        return xs;
    }
    throw 'operators::flatten awaits Monad or array but saw ' + m;
}

function flattenTCO (xs, ys) {
    if (xs.length <= 0) {
        return ys;
    }
    return function () {
        if (type.isArray(xs[0])) {
            return flattenTCO([...xs[0], ...xs.slice(1)], ys);
        }
        return flattenTCO(xs.slice(1), [...ys, xs[0]]);
    }
}

/**
 * Generic flatMap method, works on anything which implements a `map` and a
 *     `flatten` method as well as on arrays. If given a object as data,
 *     the result will be mapped and merged via `merge`
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function
 * @param {object|array|Monad} m The Monad, array or object
 * @return {object|array|Monad} New instance of given Monad, array or object
 *
 * @example
 * const {flatMap} = require('futils');
 *
 * const split = (s) => s.split(' ');
 * flatMap(split, ['Hello world']); // -> ['Hello', 'world']
 */
const flatMap = arity.dyadic((f, m) => {
    if (type.isFunc(f)) {
        return type.isObject(m) ? merge(m, map(f, m)) : flatten(map(f, m));
    }
    throw 'operators::flatMap awaits a function as first argument but saw ' + f;
});



export default {
    field, has, call, merge, immutable, first, last, head, tail,
    initial, rest, unique, union, map, flatten, flatMap, assoc, equals,
    ap, intersect, differ, pairs
};