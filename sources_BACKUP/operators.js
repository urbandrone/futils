/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isAny, isFunc, isArray, isString, isSetoid, isFunctor, isMap, isSet,
        isNumber, isObject, isIterable, isApply, isMonoid, isRegex, isGenerator} from './types';
import {dyadic, triadic} from './arity';
import {trampoline, suspend} from './trampolines';

/**
 * A collection of operator functions to work on data structures
 * @module operators
 * @requires types
 * @requires arity
 */


const _owns = Object.prototype.hasOwnProperty;

const _runGen = (f, seed, gen) => {
    let result = seed, x = null;
    while (true) {
        x = f(result, gen);
        if (x.done) {
            if (isFunc(gen.return)) { gen.return(); }
            break;
        } else {
            result = x.value;
        }
    }
    return result;
}

const _arrIter = (it) => [...it];

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
 * const firstFive = call('slice', 0, 5);
 * firstFive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
export const call = (method, ...partials) => (provider, ...rest) => {
    let res = isString(method) && isFunc(provider[method]) ?
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
 * Checks if a given object has a field of a certain key by name which is not
 *     inherited
 * @method 
 * @version 0.2.0
 * @param {string} key Name of the field
 * @param {object|map} x The object or map to test
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
export const has = dyadic((key, x) => isMap(x) ? x.has(key) : _owns.call(x, key));

/**
 * Accesses a given object by a chain of keys
 * @method
 * @version 2.7.2
 * @param {string} key Single key or a chain of keys separated by `.`
 * @param {object|array|string|map} x Data structure to access
 * @return {any|null} Either the value of the key or null
 *
 * @example
 * const {prop} = require('futils');
 *
 * const getName = prop('name');
 * getName({name: 'John Doe'}); // -> 'John Doe'
 *
 * const firstName = prop('name.first');
 * firstName({name: {first: 'John', last: 'Doe'}}); // -> 'John'
 */
export const prop = dyadic((key, x) => {
    let ks = isString(key) && /\./.test(key) ?
                key.split('.') :
                [key];
    return ks.reduce((a, b) => {
        if (isAny(a)) {
            return isMap(a) && a.has(b) ? a.get(b) :
                    isAny(a[b]) ? a[b] : null;
        }
        return null;
    }, x);
});

/**
 * Alias for the `prop` function. 
 * @method
 * @deprecated Use prop
 * @version 0.2.0
 * @param {string} key Single key or a chain of keys separated by `.`
 * @param {object|array|string|map} x Data structure to access
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
export const field = prop;

/**
 * Assigns a value and a key to a given data structure, returns a clone of the
 *     given structure
 * @method 
 * @version 0.3.0
 * @param {string|number} k The key to assign to
 * @param {*} v The value to assing
 * @param {array|object|map} x The data structure to transform
 * @return {array|object|map|*} New array, object, map or the given thing
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
export const assoc = triadic((k, v, x) => {
    let key = k, receiver = x;
    if (isArray(x)) {
        receiver = [...x];
        key = parseInt(key, 10);
        if (isNumber(key) && key < x.length && key >= 0) {
            receiver[key] = v;
        }
        return receiver;
    }
    if (isObject(x)) {
        receiver = Object.assign({}, x);
        if (isString(key)) {
            receiver[key] = v;
        }
        return receiver;
    } 
    if (isMap(x)) {
        receiver = new Map(x.entries());
        receiver.set(key, v);
    }
    return receiver;
});

/**
 * Given a base object and some extension objects, creates a copy of the base
 *     object and extends that copy with the rest of the extension objects. The
 *     extensions are included from left to right, so that the last
 *     extension overrides the first. If given just one object it returns a
 *     functions which awaits 1 up to N more objects to merge together.
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
export const merge = (...xs) => xs.length > 1 ?
    Object.assign({}, ...xs) :
    (...ys) => merge(...xs, ...ys);

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
export const immutable = (x) => Object.freeze(Object.assign({}, x));

/**
 * Returns pairs of [key, value] from a given object
 * @method 
 * @version 2.0.0
 * @param {object|map} xs The object to take pairs from
 * @return {array} Array of pairs [ [pair], [pair], ... ]
 *
 * @example
 * const {pairs} = require('futils');
 *
 * pairs({foo: 1, bar: 0}); // -> [['foo', 1], ['bar', 0]]
 */
export const pairs = (xs) => isMap(xs) ?
    [...xs.entries()] :
    Object.keys(xs).map((k) => [k, xs[k]]);

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
 * //   requiring the "new" keyword
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
export const instance = (F, ctx) => {
    return ctx instanceof F ? ctx : Object.create(F.prototype);
}



// -- Arrays --------------------
/**
 * Concatenates two things which are members of a semigroup. Uses addition to
 *     combine numbers. Uses composition to combine functions.
 * @method 
 * @param {number|function|array|semigroup} a First member
 * @param {number|function|array|semigroup} b Second member
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
export const concat = dyadic((a, b) => {
    if (isNumber(a) && isNumber(b)) { return a + b; }
    if (isFunc(a) && isFunc(b)) { return (...x) => b(a(...x)); }
    if (isObject(a) && isObject(b)) { return Object.assign({}, a, b); }
    if (isAny(a) && isFunc(a.concat)) { return a.concat(b); }
    throw 'concat :: Unable to concatenate items ' + [a, b];
});

/**
 * Given a iterable collection, returns the first item.
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
export const first = (xs) => xs[0];

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
export const head = (xs) => [first(xs)];


/**
 * Given a iterable collection, returns all items but the last of it. Don't use
 *    it on infinite sequences.
 * @method
 * @version 2.0.0
 * @param {array|array-like|iterator} xs The collection
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
export const initial = (xs) => {
    let _xs = xs;
    if (isArray(xs)) {
        return xs.slice(0, xs.length - 1);
    }
    if (isIterable(xs)) {
        _xs = Array.from(xs);
        return _xs.slice(0, _xs.length - 1);
    }
    return [];
}

/**
 * Given a iterable collection, returns the last item.
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
export const last = (xs) => xs[xs.length - 1];

/**
 * Given a iterable collection, returns the tail of it.
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
export const tail = (xs) => [last(xs)];

/**
 * Given a iterable collection, returns all items but the first of it. Don't use
 *    it on infinite sequences.
 * @method
 * @version 2.0.0
 * @param {array|array-like|iterator} xs The collection
 * @return {array} Whatever the rest items are
 *
 * @example
 * const {rest} = require('futils');
 *
 * rest([1, 2, 3]); // -> [2, 3]
 *
 * rest(document.querySelectorAll('a')); // -> [..., <a></a>, <a></a>]
 */
export const rest = (xs) => isArray(xs) ?
    xs.slice(1) :
    isIterable(xs) ?
    Array.from(xs).slice(1) :
    [];

/**
 * Returns the item at the given index position from either a string, array or
 *     array-like. Don't use it on infinite sequences
 * @method
 * @version 2.5.2
 * @param {number} index Index position of the item to get (zero based)
 * @param {string|array|iterator} x Collection to get the item from
 * @return {any} Item at the given position
 *
 * @example
 * const {nth} = require('futils');
 *
 * nth(1, 'abc'); // -> 'b'
 */
export const nth = dyadic((i, x) => isNumber(i) && (isString(x) || isArray(x)) ?
    x[Math.max(0, Math.min(x.length, Math.abs(i)))] :
    isIterable(x) ?
    nth(i, Array.from(x)) :
    x)

/**
 * When given a array, joins the contents by a given separator
 * @method
 * @version 2.5.2
 * @param {string} separator String to use as separator between the items
 * @param {array} xs The collection
 * @return {string} All items joined together
 *
 * @example
 * const {join} = require('futils');
 *
 * join('-', [1, 2, 3]); // -> '1-2-3'
 */
export const join = dyadic((separator, xs) => isArray(xs) ?
    xs.join(separator) :
    xs);

/**
 * Splits a string into pieces with a given separator
 * @method
 * @version 2.5.2
 * @param {string|regexp} splitter Value to split at
 * @param {string} x The string to split
 * @return {array} Array of pieces
 *
 * @example
 * const {split} = require('futils');
 *
 * split('-', '1-2-3'); // -> ['1', '2', '3']
 */
export const split = dyadic((splitter, x) => isString(x) ?
    x.split(splitter) :
    x);

/**
 * Replaces parts of a string with other parts and returns the result
 * @method
 * @version 2.5.2
 * @param {regexp} sign Identifier of things to replace
 * @param {string|function} repl Replacement or replacer function
 * @param {string} x The to manipulate
 * @return {string} Result of the replacement
 *
 * @example
 * const {replace} = require('futils');
 *
 * replace('-', ', ', '1-2-3'); // -> '1, 2, 3'
 */
export const replace = triadic((sign, repl, x) => isRegex(sign) && isString(x) ?
    x.replace(sign, repl) :
    x);

/**
 * Transforms a string into all uppercase
 * @method
 * @version 2.5.2
 * @param {string} x The string to transform
 * @return {string} The altered string
 *
 * @example
 * const {toUpper} = require('futils');
 *
 * toUpper('abc'); // -> 'ABC'
 */
export const toUpper = (x) => isString(x) ? x.toUpperCase() : x;

/**
 * Transforms a string into all lowercase
 * @method
 * @version 2.5.2
 * @param {string} x The string to transform
 * @return {string} The altered string
 *
 * @example
 * const {toLower} = require('futils');
 *
 * toLower('ABC'); // -> 'abc'
 */
export const toLower = (x) => isString(x) ? x.toLowerCase() : x;

/**
 * Trims whitespace from both sides of a string
 * @method
 * @version 2.7.2
 * @param {string} x The string to trim
 * @return {string} The altered string
 *
 * @example
 * const {trim} = require('futils');
 *
 * trim('   hello world   '); // -> 'hello world'
 */
export const trim = (x) => isString(x) ? x.trim() : x;

/**
 * Given a string or an array, reverses the input. If the input is an array,
 *   the function first creates a copy and reverses that so the original is
 *   left intact. Don't use it on infinite sequences
 * @method
 * @version 2.7.2
 * @param {string|array|array-like|iterator} x The collection to reverse
 * @return {string|array} A reversed string or array
 *
 * @example
 * const {reverse} = require('futils');
 *
 * reverse('abc'); // -> 'cba'
 *
 * reverse([1, 2, 3]); // -> [3, 2, 1]
 */
export const reverse = (xs) => isArray(xs) ?
    xs.slice().reverse() :
    isString(xs) ?
    xs.split('').reverse().join('') :
    isIterable(xs) ?
    Array.from(xs).reverse() :
    xs;

/**
 * Given a iterable collection, returns all unique items of it. Don't use
 *    it on infinite sequences.
 * @method
 * @version 2.0.0
 * @param {array|array-like|iterator} xs The collection
 * @return {array} Only unique items
 *
 * @example
 * const {unique} = require('futils');
 *
 * unique([2, 1, 2, 3, 3, 1]); // -> [2, 1, 3]
 */
export const unique = (xs) => Array.from(xs).reduce((acc, x) => {
    return acc.lastIndexOf(x) < 0 ? [...acc, x] : acc;
}, []);

/**
 * Given two iterable collections, returns the union of them. Don't use
 *    it on infinite sequences.
 * @method
 * @version 2.0.0
 * @param {array|array-like|iterator} xs First collection
 * @param {array|array-like|iterator} ys Second collection
 * @return {array} The union of xs and ys
 *
 * @example
 * const {union} = require('futils');
 *
 * union([2, 1, 2], [3, 3, 1]); // -> [2, 1, 3]
 */
export const union = dyadic((xs, ys) => unique([...xs, ...ys]));

/**
 * Given two iterable collections, returns the intersection of them. Don't use
 *    it on infinite sequences.
 * @method
 * @version 2.0.0
 * @param {array|array-like|iterator} xs First collection
 * @param {array|array-like|iterator} ys Second collection
 * @return {array} The intersection of xs and ys
 *
 * @example
 * const {intersect} = require('futils');
 *
 * intersect([2, 1, 2], [3, 3, 1]); // -> [1]
 */
export const intersect = dyadic((xs, ys) => {
    let _xs = xs, _ys = ys;
    if (isIterable(xs) && isIterable(ys)) {
        _xs = Array.from(xs);
        _ys = Array.from(ys);
        return union(_xs, _ys).filter((a) => {
            return _xs.indexOf(a) > -1 && _ys.indexOf(a) > -1;
        });
    }
    throw 'operators::intersect awaits two iterables but saw ' + [xs, ys];
});


/**
 * Given two iterable collections, returns the difference of them. Don't use
 *    it on infinite sequences.
 * @method
 * @version 2.0.0
 * @param {array|array-like|iterator} xs First collection
 * @param {array|array-like|iterator} ys Second collection
 * @return {array} The difference of xs and ys
 *
 * @example
 * const {differ} = require('futils');
 *
 * differ([2, 1, 2], [3, 3, 1]); // -> [2, 3]
 */
export const differ = dyadic((xs, ys) => {
    let _xs = xs, _ys = ys;
    if (isIterable(xs) && isIterable(ys)) {
        _xs = Array.from(xs);
        _ys = Array.from(ys);
        return union(_xs, _ys).filter((a) => {
            return _xs.indexOf(a) < 0 || _ys.indexOf(a) < 0
        });
    }
    throw 'operators::differ awaits two iterables but saw ' + [xs, ys];
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
 * zip(1, 2); // -> [[1, 2]]
 */
export const zip = dyadic((xs, ys) => {
    if (isArray(xs) && isArray(ys)) {
        return xs.length > ys.length ?
                ys.map((y, i) => [xs[i], y]) :
                xs.map((x, i) => [x, ys[i]]);
    }
    return [[xs, ys]];
});

/**
 * Given a function, a seed value and a iterable collection, return the
 *     iterable folded down into the seed value. Don't use
 *     it on infinite sequences.
 * @method 
 * @version 2.2.0
 * @param {function} f Function to call on each iteration
 * @param {any} x The seed value to fold into
 * @param {array|array-like|iterator|Monad|Monoid} xs The collection to fold
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
export const fold = triadic((f, x, xs) => {
    if (isFunc(xs.fold)) {
        return xs.fold(f, x);
    }
    if (isFunc(xs.reduce)) {
        return xs.reduce(f, x);
    }
    const go = trampoline((g, acc, as) => {
        if (as.length < 1) { return acc; }
        return suspend(go, g, g(acc, first(as)), rest(as));
    });
    return go(f, x, Array.from(xs));
});

/**
 * Given a function, a seed value and a iterable collection, return the
 *     iterable folded down into the seed value. Don't use
 *     it on infinite sequences.
 * @method 
 * @version 2.8.0
 * @param {function} f Function to call on each iteration
 * @param {any} x The seed value to fold into
 * @param {array|array-like|iterator} xs The collection to fold
 * @return {any} Depends on the seed value
 *
 * @example
 * const {foldRight} = require('futils');
 *
 * const add = (a, b) => a + b;
 *
 * foldRight(add, 0, [1, 2, 3]); // -> 6
 * foldRight(add, '', ['hello,', ' ', 'world']); // -> 'world hello'
 */
export const foldRight = triadic((f, x, xs) => {
    if (isFunc(xs.foldRight)) {
        return xs.foldRight(f, x);
    }
    if (isFunc(xs.reduceRight)) {
        return xs.reduceRight(f, x);
    }
    const go = trampoline((g, acc, as) => {
        if (as.length < 1) { return acc; }
        return suspend(go, g, g(acc, last(as)), initial(as));
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
export const unfold = dyadic((f, x) => {
    const go = trampoline((g, y, ys) => {
        let r = g(y);
        if (r == null) { return ys; }
        return suspend(go, g, r[1], [...ys, r[0]]);
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
 * @return {array} List of all integers from start through to end
 *
 * @example
 * const {range} = require('futils');
 *
 * range(2, 8); // -> [2, 3, 4, 5, 6, 7, 8]
 */
export const range = dyadic((start, stop) => {
    return unfold((n) => n <= stop ? [n, n + 1] : null, start);
});

/**
 * Given a function and a list, filters the list with the given function and
 *     returns a list that only contains values for which the function returned
 *     a truthy value. Don't use it on infinite sequences.
 * @method 
 * @version 2.2.0
 * @param {function} f Filter function
 * @param {array|array-like|iterator} xs List to filter
 * @return {array} New list
 *
 * @example
 * const {filter} = require('futils');
 *
 * const evens = (n) => n % 2 === 0;
 *
 * filter(evens, [1, 2, 3, 4, 5, 6]); // -> [2, 4, 6]
 */
export const filter = dyadic((f, xs) => {
    return fold((ys, x) => !!f(x) ? [...ys, x] : ys, [], xs);
});

/**
 * Given a list, returns a new list with all `null` and `undefined` values
 *     removed. Don't use it on infinite sequences.
 * @method 
 * @version 2.2.0
 * @param {array|array-like|iterator} xs List to transform
 * @return {array} A new list
 *
 * @example
 * const {keep} = require('futils');
 *
 * keep([1, null, 3]); // -> [1, 3]
 */
export const keep = (xs) => filter((x) => x != null, xs);

/**
 * Given a number `n` and a list, drops the first n items from the list. Don't
 *     use it on infinite sequences.
 * @method 
 * @version 2.2.0
 * @param {number} n Number of items to drop
 * @param {array|array-like|iterator} xs List to drop items from
 * @return {array} New list
 *
 * @example
 * const {drop} = require('futils');
 *
 * drop(2, [1, 2, 3, 4]); // -> [3, 4]
 */
export const drop = dyadic((n, xs) => {
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
 *     function returns a falsy value for the first time. Don't use
 *     it on infinite sequences.
 * @method 
 * @version 2.2.0 
 * @param {function} f Predicate function
 * @param {array|array-like|iterator} xs List to drop items from
 * @return {array} New list
 *
 * @example
 * const {dropWhile} = require('futils');
 *
 * const lt3 = (n) => n < 3;
 *
 * dropWhile(lt3, [1, 2, 3, 4]); // -> [3, 4]
 */
export const dropWhile = dyadic((f, xs) => {
    let drops = true;
    return fold((ys, x) => {
        drops = drops && !!f(x);
        if (drops) {
            return ys;
        }
        return [...ys, x];
    }, [], Array.from(xs));
});

/**
 * Given a number `n` and a list, takes n items from the beginning of the list
 *     and drops the rest. Can be used on infinite sequences.
 * @method 
 * @version 2.2.0 
 * @param {number} n Number of items to take
 * @param {array|array-like|iterator} xs List to take items from
 * @return {array} New list
 *
 * @example
 * const {take} = require('futils');
 *
 * take(2, [1, 2, 3, 4, 5]); // -> [1, 2];
 *
 * 
 * // You can even use it on infinite sequences
 * function * nums() {
 *     let i = 1;
 *     while (true) {
 *         yield i;
 *         i += 1;
 *     }
 * }
 *
 * take(2, nums()); // -> [1, 2]
 */
export const take = dyadic((n, xs) => {
    let i = 0;
    if (isGenerator(xs)) {
        return _runGen((res, gen) => {
            const v = gen.next();
            if (v.done || i >= n) {
                return {done: true, value: res};
            }
            i += 1;
            return {value: [...res, v.value]};
        }, [], xs);
    }
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
 *     list until the function returns a falsy value for the first time. Can be
 *     used on infinite sequences.
 * @method 
 * @version 2.2.0 
 * @param {function} f Predicate function
 * @param {array|array-like|iterator} xs List to take items from
 * @return {array} New list
 *
 * @example
 * const {takeWhile} = require('futils');
 *
 * const lt3 = (n) => n < 3;
 *
 * takeWhile(lt3, [1, 2, 3, 4, 5]); // -> [1, 2]
 *
 * 
 * // You can even use it on infinite sequences
 * function * nums() {
 *     let i = 1;
 *     while (true) {
 *         yield i;
 *         i += 1;
 *     }
 * }
 *
 * takeWhile(lt3, nums()); // -> [1, 2]
 */
export const takeWhile = dyadic((f, xs) => {
    let takes = true;
    if (isGenerator(xs)) {
        return _runGen((res, gen) => {
            const v = gen.next();
            if (v.done || !(takes = !!f(v.value))) {
                return {done: true, value: res};
            }
            return {value: [...res, v.value]};
        }, [], xs);
    }
    return fold((ys, x) => {
        if (takes && (takes = !!f(x))) {
            return [...ys, x];
        }
        return ys;
    }, [], Array.from(xs));
});

/**
 * Given a function and a list, returns the first item for which the function
 *     returns a truthy value. Don't use it on infinite sequences.
 * @method 
 * @version 2.2.0 
 * @param {function} f Function to match with
 * @param {array|array-like|iterator} xs List to find item from
 * @return {any|null} Either a match or null
 *
 * @example
 * const {find} = require('futils');
 *
 * const divBy = (n) => (m) => n % m === 0;
 *
 * find(divBy(2), [1, 2, 3, 4, 5]); // -> 2
 */
export const find = dyadic((f, xs) => {
    return fold((ys, x) => ys == null && !!f(x) ? x : ys, null, xs);
});

/**
 * Given a function and a list, returns the first item for which the function
 *     returns a truthy value. Matches items from the right. Don't use
 *     it on infinite sequences.
 * @method 
 * @version 2.2.0 
 * @param {function} f Function to match with
 * @param {array|array-like|iterator} xs List to find item from
 * @return {any|null} Either a match or null
 *
 * @example
 * const {findRight} = require('futils');
 *
 * const divBy = (n) => (m) => n % m === 0;
 *
 * findRight(divBy(2), [1, 2, 3, 4, 5]); // -> 4
 */
export const findRight = dyadic((f, xs) => find(f, Array.from(xs).reverse()));

/**
 * Given a Monoid TypeConstructor and a list, folds all values in the list into
 *     the Monoid Type. When used with a function instead of a Monoid, make sure
 *     the function returns a value which belongs to a semigroup
 * @method 
 * @version 2.4.0
 * @param {Monoid|function} M Monoid or function returning a Array
 * @param {array} xs A list of values
 * @return {Monoid} Unit of the monoid concatenated with all xs
 *
 * @example
 * const {foldMap, Char} = require('futils');
 *
 * // foldMap with a function
 * foldMap((v) => v.toUpperCase(), ['a', 'b']); // -> 'AB'
 *
 * // foldMap with Monoids 1
 * foldMap(Char, ['Hello', ' ', 'world']); // -> Char('Hello world')
 *
 * // foldMap with Monoids 2
 * foldMap(Char.of('Hello'), [' ', 'world']); // -> Char('Hello world')
 */
export const foldMap = dyadic((M, xs) => {
    if (isFunc(M) && !isFunc(M.empty)) {
        return fold((m, x) => m.concat(M(x)), M(xs[0]), xs.slice(1));
    }
    if(isMonoid(M)) {
        return fold((m, x) => m.concat(m.of(x)), M, xs);
    }
    return fold((m, x) => m.concat(M.of(x)), M.empty(), xs);
});




// -- Setoid --------------------
/**
 * Generic setoid method that checks for deep equality. Please note that this
 *     may have a significant loss in performance for deeply nested structures.
 * @method
 * @version 2.0.0 
 * @param {any} a Any value to compare
 * @param {any} b Any value to compare 
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
export const equals = dyadic((a, b) => {
    if (isSetoid(a)) { return a.equals(b); }
    if (a == null) { return b == null; }
    if (b == null) { return a == null; }
    let tA = a.constructor.name, tB = b.constructor.name;
    if (tA === tB) {
        switch (tA) {
            case 'Number':
            case 'Function':
            case 'String':
            case 'Boolean':
            case 'Symbol':
            case 'Promise':
                return a === b;
            case 'Date':
                return a.valueOf() === b.valueOf();
            case 'RegExp':
                return a.toString() === b.toString();
            case 'Array':
                return a.length === b.length && a.every((x, i) => equals(x, b[i]));
            case 'Object':
                return Object.keys(a).every((k) => equals(a[k], b[k])) &&
                       Object.keys(b).every((k) => equals(b[k], a[k]));
            case 'Set':
            case 'Map':
                return equals(_arrIter(a.entries()), _arrIter(b.entries()));
            case 'Error':
            case 'TypeError':
            case 'RangeError':
            case 'SyntaxError':
            case 'ReferenceError':
                return a.name === b.name && a.message === b.message;
            default:
                return false;
        }
    }
    return false;
});

/**
 * Test if a given element is part of a collection
 * @method elem
 * @version 2.12.0
 * @param {any} x The value to check against
 * @param {array|object|set} xs The collection
 * @return {boolean} True if the element is part of the collection
 *
 * @example
 * const {elem} = require('futils');
 *
 * elem(2, [1, 2, 3]); // -> true
 * elem(2, [1, 3, 5]); // -> false
 */
export const elem = dyadic((a, xs) => {
    if (isArray(xs)) {
        return xs.some(equals(a));
    }
    if (isObject(xs)) {
        return Object.keys(xs).some((k) => equals(a, xs[k]));
    }
    if (isSet(xs)) {
        return xs.has(a);
    }
    return false;
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
export const map = dyadic((f, m) => {
    if (isFunc(f)) {
        if (isFunctor(m)) {
            return m.map(f);
        }
        if (isObject(m)) {
            return Object.keys(m).reduce((acc, k) => {
                acc[k] = f(m[k], k, m);
                return acc;
            }, {});
        }
        if (isIterable(m)) {
            return Array.from(m).map(f);
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
export const ap = dyadic((mf, ma) => {
    if (isFunc(mf)) {
        return isFunctor(ma) ? ma.map(mf) :
               isObject(ma) ? map(mf, ma) :
               mf(ma);
    }
    if (isApply(mf)) {
        return isFunctor(ma) ? mf.ap(ma) : 
               isObject(ma) ? mf.ap({map: (f) => map(f, ma)}) :
               mf.ap([ma])[0];
    }
    throw 'operators::ap awaits apply/function as first argument but saw ' + mf;
});



// -- Monad --------------------

/**
 * Generic flat method, works on anything that implements a `flat` method
 *     as well as on arrays
 * @method
 * @version 2.12.0
 * @param {array|Monad} m The thing to flatten
 * @param {boolean} [deep=false] Optional flag to flatten nested arrays completely
 * @return {array|Monad} New instance of given
 *
 * @example
 * const {flat} = require('futils');
 *
 * flat([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, [4, 5]]
 * flat([[1, 2], 3, [[4, 5]]], true); // -> [1, 2, 3, 4, 5]
 */
export const flat = (m, deep = false) => {
    if (isFunc(m.flat)) {
        return m.flat(!deep ? undefined : Infinity);
    }
    if (isFunc(m.flatten)) {
        return m.flatten();
    }
    if (isObject(m) && !isFunc(m.flatten)) {
        return m;
    }
    if (isArray(m)) {
        if (!deep) {
            return m.reduce((a, b) => a.concat(b), []);
        }
        const go = trampoline((xs, ys) => {
            if (ys.length < 1) { return xs; }
            if (isArray(ys[0])) {
                return suspend(go, xs, [...ys[0], ...ys.slice(1)]);
            }
            return suspend(go, [...xs, ys[0]], ys.slice(1));
        });
        return go([], m);
    }
    throw 'operators::flatten awaits Monad or array but saw ' + m;
}

/**
 * Alias for the `flat` function
 * @method
 * @deprecated Use flat
 * @version 0.2.0
 * @param {array|Monad} m The thing to flatten
 * @param {boolean} [deep=false] Optional flag to flatten nested arrays completely
 * @return {array|Monad} New instance of given
 *
 * @example
 * const {flatten} = require('futils');
 *
 * flatten([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, [4, 5]]
 * flatten([[1, 2], 3, [[4, 5]]], true); // -> [1, 2, 3, 4, 5]
 */
export const flatten = flat;

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
export const flatMap = dyadic((f, m) => {
    if (isFunc(f)) {
        if (isFunc(m.flatMap)) {
            return m.flatMap(f);
        }
        return flatten(map(f, m), false);
    }
    throw 'operators::flatMap awaits function as 1. argument but saw ' + f;
});


/**
 * Given a function from "a" to "Structure a", a Applicative constructor *     and a Traversable, wraps the Applicative around the structure and
 *     returns the result 
 * @method 
 * @version 2.4.1
 * @param {function} f Function in the form `(a -> Applicative a)`
 * @param {Applicative} A Applicative constructor
 * @param {array|Applicative} xs Structure to traverse
 * @return {Applicative} The structure wrapped in a Applicative
 *
 * @example
 * const {Maybe, traverse} = require('futils');
 *
 * const xs = [1, 2, 3];
 *
 * const gt0 = (n) => n > 0 ? Maybe.of(n) : Maybe.of(null);
 *
 * traverse(gt0, Maybe, xs); // -> Some([1, 2, 3])
 */
export const traverse = triadic((f, A, xs) => {
    if (isFunc(f) && isFunc(A.of)) {
        if (isFunc(xs.traverse)) {
            return xs.traverse(f, A);
        }
        if (isArray(xs)) {
            return xs.reduce(
                (a, x) => f(x).map(b => c => c.concat([b])).ap(a),
                A.of([])
            );
        }
        throw 'operators::traverse cannot act on ' + xs;
    }
    throw 'operators::traverse awaits function & applicative, saw ' + [f, A];
});

/**
 * Sequences containers, given a Applicative constructor and a structure
 * @method 
 * @version 2.4.1
 * @param {Applicative} A Applicative constructor
 * @param {array|Applicative} xs Structure to sequence
 * @return {Applicative} The structure wrapped into a Applicative
 *
 * @example
 * const {Some, sequence} = require('futils');
 *
 * const xs = [Some.of(1), Some.of(2), Some.of(3)];
 *
 * sequence(Some, xs); // -> Some([1, 2, 3])
 */
export const sequence = dyadic((A, xs) => traverse((a) => a, A, xs));