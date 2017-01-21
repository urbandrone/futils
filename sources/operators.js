/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from './types';
import arity from './arity';
import rec from './trampolines';

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
const merge = (...xs) => xs.length > 1 ? Object.assign({}, ...xs) : (...ys) => {
    return merge(...xs, ...ys);
};

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
const immutable = (x) => Object.freeze(Object.assign({}, x));

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

/**
 * Given a constructor function and a context (usually `this`) returns either
 *     the context if it is a instance of the constructor or a new object
 *     created from the constructor.prototype
 * @method 
 * @version 2.2.0
 * @param {function} F The constructor function
 * @param {any} ctx The context to check against
 * @return {object} Either the context or a new F
 *
 * @example
 * const {instance} = require('futils');
 *
 * // we use instance here to create a constructor which can be used without
 * //   needing the "new" keyword
 * function Unit (x, y) {
 *     let self = instance(Unit, this);
 *     self.x = x;
 *     self.y = y;
 *     return self;
 * }
 *
 * let newUnit = new Unit(1, 2);
 * let unit = Unit(1, 2);
 *
 * newUnit.x && newUnit.x === 1; // -> true
 * unit.x && unit.x === 1; // -> true
 */
const instance = (F, ctx) => {
    return ctx instanceof F ? ctx : Object.create(F.prototype);
}



// -- Arrays --------------------
/**
 * Concatenates two things which are members of a semigroup
 * @method 
 * @param {any|array|semigroup} a First member
 * @param {any|array|semigroup} b Second member
 * @return {array|semigroup} A new member
 *
 * @example
 * const {concat} = require('futils');
 *
 * const toNs = concat([1, 2]);
 *
 * toNs(3); // -> [1, 2, 3]
 * toNs([3]); // -> [1, 2, 3]
 */
const concat = arity.dyadic((a, b) => {
    if (a && type.isFunc(a.concat)) { return a.concat(b); }
    if (b && type.isFunc(b.concat)) { return b.concat(a); }
    throw 'concat :: Unable to concatenate items ' + [a, b];
});

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

/**
 * Takes to arrays and produces a new array of arrays where each inner array
 *     contains the items of both lists
 * @method 
 * @version 2.3.2
 * @param {array} xs First array
 * @param {array} ys Second array
 * @return {array} A array of arrays
 *
 * @example
 * const {zip} = require('futils');
 *
 * zip([1, 2], ['one', 'two']); // -> [[1, 'one'], [2, 'two']]
 * zip([1, 2], ['one']); // -> [[1, 'one']]
 * zip([1], ['one', 'two']); // -> [[1, 'one']]
 */
const zip = arity.dyadic((xs, ys) => {
    if (type.isArray(xs) && type.isArray(ys)) {
        return xs.length > ys.length ?
                ys.map((y, i) => [xs[i], y]) :
                xs.map((x, i) => [x, ys[i]]);
    }
    return [xs, ys];
});



/** NOTE ===================

Functions in the following sections are implemented in foresight of
tail call optimization, which now finally seems to arrive.

========================= */

/**
 * Given a function, a seed value and a iterable collection, return the
 *     iterable folded down into the seed value
 * @method 
 * @version 2.2.0
 * @param {function} f Function to call on each iteration
 * @param {any} x The seed value to fold into
 * @param {array} xs The collection to fold down
 * @return {any} Depends on the seed value
 *
 * @example
 * const {fold} = require('futils');
 *
 * const add = (a, b) => a + b;
 *
 * fold(add, 0, [1, 2, 3]); // -> 6
 * fold(add, '', ['hello,', ' ', 'world']); // -> 'hello world'
 */
const fold = arity.triadic((f, x, xs) => {
    const go = rec.trampoline((g, acc, as) => {
        if (as.length < 1) { return acc; }
        return rec.suspend(go, g, g(acc, first(as)), rest(as));
    });
    return go(f, x, Array.from(xs));
});

/**
 * Given a function and a initial value, accumulates values into an array until
 *     the function returns either null or undefined. This function can be used
 *     to implement `while` loops.
 * @method 
 * @version 2.2.0
 * @param {function} f Function to call on each iteration
 * @return {array} Collection of accumulated values
 *
 * @example
 * const {unfold} = require('futils');
 *
 * const fifthUntil = (n) => unfold((x) => x <= n ? [x, x + 5] : null, 5);
 *
 * fifthUntil(25); // -> [5, 10, 15, 20, 25]
 */
const unfold = arity.dyadic((f, x) => {
    const go = rec.trampoline((g, y, ys) => {
        let r = g(y);
        if (r == null) { return ys; }
        return rec.suspend(go, g, r[1], [...ys, r[0]]);
    });
    return go(f, x, []);
});

/**
 * Given a start and end index, returns a array from start to end containing
 *     all indices in between
 * @method 
 * @version 2.2.0
 * @param {integer} start Starting index
 * @param {integer} stop Final index
 * @return {array} List of all integers from start through end
 *
 * @example
 * const {range} = require('futils');
 *
 * range(2, 8); // -> [2, 3, 4, 5, 6, 7, 8]
 */
const range = arity.dyadic((start, stop) => {
    return unfold((n) => n <= stop ? [n, n + 1] : null, start);
});

/**
 * Given a function and a list, filters the list with the given function and
 *     returns a list that only contains values for which the function returned
 *     a truthy value
 * @method 
 * @version 2.2.0
 * @param {function} f Filter function
 * @param {array} xs List to filter
 * @return {array} New list
 *
 * @example
 * const {filter} = require('futils');
 *
 * const evens = (n) => n % 2 === 0;
 *
 * filter(evens, [1, 2, 3, 4, 5, 6]); // -> [2, 4, 6]
 */
const filter = arity.dyadic((f, xs) => {
    return fold((ys, x) => !!f(x) ? [...ys, x] : ys, [], Array.from(xs));
});

/**
 * Given a list, returns a new list with all `null` and `undefined` values
 *     removed
 * @method 
 * @version 2.2.0
 * @param {array} xs List to transform
 * @return {array} A new list
 *
 * @example
 * const {keep} = require('futils');
 *
 * keep([1, null, 3]); // -> [1, 3]
 */
const keep = (xs) => filter((x) => x != null, Array.from(xs));

/**
 * Given a number `n` and a list, drops the first n items from the list
 * @method 
 * @version 2.2.0
 * @param {number} n Number of items to drop
 * @param {array} xs List to drop items from
 * @return {array} New list
 *
 * @example
 * const {drop} = require('futils');
 *
 * drop(2, [1, 2, 3, 4]); // -> [3, 4]
 */
const drop = arity.dyadic((n, xs) => {
    let i = Math.round(Math.abs(n));
    return fold((ys, x) => {
        if (i > 0) {
            i -= 1;
            return ys;
        }
        return [...ys, x];
    }, [], Array.from(xs));
});

/**
 * Given a predicate function and a list, drops items from the list until the
 *     function returns a falsy value for the first time
 * @method 
 * @version 2.2.0 
 * @param {function} f Predicate function
 * @param {array} xs List to drop items from
 * @return {array} New list
 *
 * @example
 * const {dropWhile} = require('futils');
 *
 * const lt3 = (n) => n < 3;
 *
 * dropWhile(lt3, [1, 2, 3, 4, 5]); // -> [4, 5]
 */
const dropWhile = arity.dyadic((f, xs) => {
    let drop = true;
    return fold((ys, x) => {
        drop = drop && !!f(x);
        if (drop) {
            return ys;
        }
        return [...ys, x];
    }, [], Array.from(xs));
});

/**
 * Given a number `n` and a list, takes n items from the beginning of the list
 *     and drops the rest
 * @method 
 * @version 2.2.0 
 * @param {number} n Number of items to take
 * @param {array} xs List to take items from
 * @return {array} New list
 *
 * @example
 * const {take} = require('futils');
 *
 * take(2, [1, 2, 3, 4, 5]); // -> [1, 2];
 */
const take = arity.dyadic((n, xs) => {
    let i = 0;
    return fold((ys, x) => {
        if (i < n) {
            i += 1;
            return [...ys, x];
        }
        return ys;
    }, [], Array.from(xs));
});

/**
 * Given a predicate function and a list, takes items from the beginning of the
 *     list until the function returns a falsy value for the first time
 * @method 
 * @version 2.2.0 
 * @param {function} f Predicate function
 * @param {array} xs List to take items from
 * @return {array} New list
 *
 * @example
 * const {takeWhile} = require('futils');
 *
 * const lt3 = (n) => n < 3;
 *
 * takeWhile(lt3, [1, 2, 3, 4, 5]); // -> [1, 2]
 */
const takeWhile = arity.dyadic((f, xs) => {
    let take = true;
    return fold((ys, x) => {
        if (take && (take = !!f(x))) {
            return [...ys, x];
        }
        return ys;
    }, [], Array.from(xs));
});

/**
 * Given a function and a list, returns the first item for which the function
 *     returns a truthy value
 * @method 
 * @version 2.2.0 
 * @param {function} f Function to match with
 * @param {array} xs List to find item from
 * @return {any|null} Either a match or null
 *
 * @example
 * const {find} = require('futils');
 *
 * const divBy = (n) => (m) => n % m === 0;
 *
 * find(divBy(2), [1, 2, 3, 4, 5]); // -> 2
 */
const find = arity.dyadic((f, xs) => {
    return fold((ys, x) => ys == null && !!f(x) ? x : ys, null, Array.from(xs));
});

/**
 * Given a function and a list, returns the first item for which the function
 *     returns a truthy value. Matches items from the right
 * @method 
 * @version 2.2.0 
 * @param {function} f Function to match with
 * @param {array} xs List to find item from
 * @return {any|null} Either a match or null
 *
 * @example
 * const {findRight} = require('futils');
 *
 * const divBy = (n) => (m) => n % m === 0;
 *
 * findRight(divBy(2), [1, 2, 3, 4, 5]); // -> 4
 */
const findRight = arity.dyadic((f, xs) => find(f, Array.from(xs).reverse()));

/**
 * Given a Monoid TypeConstructor and a list, folds all values in the list into
 *     the Monoid Type
 * @method 
 * @version 2.4.0
 * @param {Monoid} M Constructor of the monoid typeclass
 * @param {array} xs A list of values
 * @return {Monoid} Unit of the monoid concatenated with all xs
 *
 * @example
 * const {foldMap, All, Any} = require('futils');
 *
 * foldMap(All, [true, false, true, true]); // -> All(false)
 * foldMap(Any, [true, false, true, true]); // -> Any(true)
 */
const foldMap = arity.dyadic((M, xs) => {
    return fold((m, x) => m.concat(M.of(x)), M.empty(), xs);
});




// -- Setoid --------------------
/**
 * Generic setoid method, works on anything that implements a `equals` method. If
 *     no `equals` is found it matches on the values directly via strict
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
        if (type.isIterable(m)) {
            return Array.from(m).map(f);
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
    if (type.isObject(m)) {
        return m;
    }
    if (type.isFunc(m.flatten)) {
        return m.flatten();
    }
    if (type.isArray(m)) {
        const go = rec.trampoline((xs, ys) => {
            if (ys.length < 1) { return xs; }
            if (type.isArray(ys[0])) {
                return rec.suspend(go, xs, [...ys[0], ...ys.slice(1)]);
            }
            return rec.suspend(go, [...xs, ys[0]], ys.slice(1));
        });
        return go([], m);
    }
    throw 'operators::flatten awaits Monad or array but saw ' + m;
}

/**
 * Generic flatMap method, works on anything which implements a `map` and a
 *     `flatten` method as well as on arrays and objects
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
        return flatten(map(f, m));
    }
    throw 'operators::flatMap awaits a function as first argument but saw ' + f;
});



export default {
    field, has, call, merge, immutable, first, last, head, tail, concat, zip,
    initial, rest, unique, union, map, flatten, flatMap, assoc, equals,
    ap, intersect, differ, pairs, instance, fold, unfold, range, take, takeWhile,
    filter, drop, dropWhile, keep, find, findRight, foldMap
};