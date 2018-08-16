/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {Type} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';

/* Utilities */
const arrayFrom = (a) => Array.isArray(a) ? a :
                        a == null ? [] :
                        a.length && typeof a !== 'string' ? Array.from(a) :
                        [a];




/**
 * Grants access to the ArrayList data structure. ArrayList is a wrapper for arrays, which
 * provides an interface similiar to the other data structures
 * @module data/ArrayList
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The ArrayList data type
 * @class module:data/ArrayList.ArrayList
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * ArrayList([1, 2, 3]); // -> ArrayList([1, 2, 3])
 */
export const ArrayList = Type('ArrayList', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts one or more values into a ArrayList
 * @method of
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @param {...any} a The value or values to lift
 * @return {ArrayList} A new ArrayList
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * ArrayList.of(1);    // -> ArrayList([1])
 * ArrayList.of(1, 2); // -> ArrayList([1, 2])
 */
ArrayList.of = (...a) => ArrayList(a);
/**
 * Monoid implementation for ArrayList. Returns a ArrayList without values
 * @method empty
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @return {ArrayList} A ArrayList
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * ArrayList.empty(); // -> ArrayList([])
 */
ArrayList.empty = () => ArrayList([]);
/**
 * Lifts a value into a ArrayList. Somewhat similiar to ArrayList.of, but only accepts a
 * single value and puts it in a array if it is not an array itself. Useful to
 * transform array-like objects on the fly
 * @method from
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @param {any} a The value to lift
 * @return {ArrayList} A new ArrayList
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * ArrayList.from(1);   // -> ArrayList([1])
 * ArrayList.from([1]); // -> ArrayList([1])
 */
ArrayList.from = (a) => ArrayList(arrayFrom(a));
/**
 * A natural transformation from an array into a ArrayList
 * @method fromArray
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Array} a The array to transform
 * @return {ArrayList} A new ArrayList
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * ArrayList.fromArray([1, 2, 3]); // -> ArrayList([1, 2, 3])
 */
ArrayList.fromArray = ArrayList;
/**
 * A natural transformation from an Id to a ArrayList
 * @method fromId
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Id} a The Id to transform
 * @return {ArrayList} A new ArrayList
 *
 * @example
 * const {ArrayList, Id} = require('futils/data');
 *
 * const id = Id('a value');
 *
 * ArrayList.fromId(id); // -> ArrayList(['a value'])
 */
ArrayList.fromId = (a) => ArrayList.from(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a ArrayList
 * @method fromMaybe
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Some|None} a The Maybe to transform
 * @return {ArrayList} A ArrayList with the value of a Maybe.Some and an empty ArrayList for Maybe.None
 *
 * @example
 * const {ArrayList, Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a value');
 * const none = Maybe.None();
 *
 * ArrayList.fromMaybe(some); // -> ArrayList(['a value'])
 * ArrayList.fromMaybe(none); // -> ArrayList([])
 */
ArrayList.fromMaybe = (a) => a.isSome() ? ArrayList.from(a.value) : ArrayList.empty();
/**
 * A natural transformation from an Either.Left or Either.Right into a ArrayList
 * @method fromEither
 * @static
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Left|Right} a The Either to transform
 * @return {ArrayList} ArrayList with value(s) for Either.Right, empty ArrayList for Either.Left
 *
 * @example
 * const {ArrayList, Either} = require('futils/data');
 *
 * const l = Either.Left('a left');
 * const r = Either.Right('a right');
 *
 * ArrayList.fromEither(l); // -> ArrayList([])
 * ArrayList.fromEither(r); // -> ArrayList(['a right'])
 */
ArrayList.fromEither = (a) => a.isRight() ? ArrayList.from(a.value) : ArrayList.empty();



ArrayList.prototype[Symbol.iterator] = function () {
    return this.value[Symbol.iterator]();
}
/**
 * A natural transformation from a ArrayList into an array
 * @method toArray
 * @memberOf module:data/ArrayList.ArrayList
 * @return {Array} Array of values
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * ArrayList.of(1, 2, 3).toArray(); // -> [1, 2, 3]
 */
ArrayList.prototype.toArray = function () {
    return this.value;
}
/**
 * Concattenates a ArrayList with another ArrayList
 * @method concat
 * @memberOf module:data/ArrayList.ArrayList
 * @param {ArrayList} a The ArrayList instance to concattenate with
 * @return {ArrayList} A ArrayList containing all values from both ArrayLists
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 *
 * ls.concat(ArrayList.of(4, 5, 6)); // -> ArrayList([1, 2, 3, 4, 5, 6])
 */
ArrayList.prototype.concat = function (a) {
    if (ArrayList.is(a)) {
        return ArrayList(this.value.concat(a.value));
    }
    throw `ArrayList::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over each value in the ArrayList
 * @method map
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Function} f The function to map
 * @return {ArrayList} A new ArrayList
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 * 
 * const inc = (n) => n + 1;
 *
 * ls.map(inc); // -> ArrayList([2, 3, 4])
 */
ArrayList.prototype.map = function (f) {
    return ArrayList(this.value.map(f));
}
/**
 * Flattens a nested ArrayList one level
 * @method flat
 * @memberOf module:data/ArrayList.ArrayList
 * @return {ArrayList} A ArrayList flattened
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(ArrayList.of(1, 2, 3));
 *
 * ls.flat(); // -> ArrayList([1, 2, 3])
 */
ArrayList.prototype.flat = function () {
    return this.value.reduce((l, a) => l.concat(a));
}
/**
 * Maps a ArrayList returning function over each value in the ArrayList and flattens the result
 * @method flatMap
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Function} f A ArrayList returning function to map
 * @return {ArrayList} A new ArrayList
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 *
 * const inc = (n) => ArrayList.of(n + 1);
 *
 * ls.flatMap(inc); // -> ArrayList([2, 3, 4])
 */
ArrayList.prototype.flatMap = function (f) {
    return this.map(f).flat();
}
/**
 * Applies a function in a ArrayList to the values in another ArrayList
 * @method ap
 * @memberOf module:data/ArrayList.ArrayList
 * @param {ArrayList} a The ArrayList that holds the values
 * @return {ArrayList} ArrayList which contains the results of applying the function
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 *
 * const mInc = ArrayList.of((n) => n + 1);
 *
 * mInc.ap(ls); // -> ArrayList([2, 3, 4])
 */
ArrayList.prototype.ap = function (a) {
    return a.map(this.value[0]);
}
/**
 * Works like the Array.reduce method. If given a function and an initial value,
 * reduces the values in the ArrayList to a final value
 * @method reduce
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduce(reducer, 0); // -> 6
 */
ArrayList.prototype.reduce = function (f, x) {
    return this.value.reduce(f, x);
}
/**
 * Works like the Array.reduceRight method. If given a function and an initial
 * value, reduces the values in the ArrayList to a final value
 * @method reduceRight
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduceRight(reducer, 0); // -> 6
 */
ArrayList.prototype.reduceRight = function (f, x) {
    return this.value.reduceRight(f, x);
}
/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the ArrayList into the applicative
 * @method traverse
 * @memberOf data/ArrayList.ArrayList
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A ArrayList wrapped in the applicative
 *
 * @example
 * const {ArrayList, Maybe} = require('futils/data');
 * 
 * const ls = ArrayList.of(1, 2, 3)
 *
 * const fn = (n) => Maybe.of(n);
 *
 * ls.traverse(fn, Maybe); // -> Some(ArrayList([1, 2, 3]))
 */
ArrayList.prototype.traverse = function (f, A) {
    return this.reduce(
        (t, a) => f(a).map(b => c => c.concat(ArrayList.of(b))).ap(t),
        A.of(ArrayList.empty())
    );
}
/**
 * Sequences a ArrayList into another applicative Type
 * @method sequence
 * @memberOf module:data/ArrayList.ArrayList
 * @param {Applicative} A A constructor with of and ap methods
 * @return {Applicative} A ArrayList wrapped in the applicative
 *
 * @example
 * const {ArrayList, Maybe} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 *
 * ls.sequence(Maybe); // -> Some(ArrayList([1, 2, 3]))
 */
ArrayList.prototype.sequence = function (A) {
    return this.traverse(x => x, A);
}
/**
 * Alternative implementation, allows to swap a empty ArrayList
 * @method alt
 * @memberOf data/ArrayList.ArrayList
 * @param {ArrayList} a The alternative ArrayList
 * @return {ArrayList} Choosen alternative
 *
 * @example
 * const {ArrayList} = require('futils/data');
 *
 * const ls = ArrayList.of(1, 2, 3);
 * const ns = ArrayList.empty();
 *
 * ls.alt(ArrayList.of(4));    // -> ArrayList([1, 2, 3])
 * ls.alt(ArrayList.empty());  // -> ArrayList([1, 2, 3])
 * ns.alt(ArrayList.of(4));    // -> ArrayList([4])
 * ns.alt(ArrayList.empty());  // -> ArrayList([])
 */
ArrayList.prototype.alt = function (a) {
    return this.value.length < 1 ? a : this;
}

ArrayList.prototype.foldMap = function (f) {
    return this.value.reduce((m, x) => m == null ? f(x) : m.concat(f(x)), null);
}

ArrayList.prototype.fold = function (A) {
    return this.foldMap(A.of);
}

ArrayList.prototype.filter = function (f) {
    return ArrayList(this.value.filter(f));
}

ArrayList.prototype.intercalate = function (a) {
    return ArrayList(this.value.reduce((ls, x) => ls.length < 1 ? ls.concat(x) : ls.concat([x, a]), []));
}

ArrayList.prototype.join = function (a) {
    return this.value.join(a);
}

ArrayList.prototype.cons = function (a) {
    return ArrayList([a].concat(this.value));
}

ArrayList.prototype.snoc = function (a) {
    return ArrayList(this.value.concat(a));
}

ArrayList.protoype.head = function () {
    return this.value[0] == null ? null : this.value[0];
}

ArrayList.prototype.tail = function () {
    return this.drop(1);
}

ArrayList.prototype.take = function (n) {
    return ArrayList(this.value.slice(0, n));
}

ArrayList.protoype.drop = function (n) {
    return ArrayList(this.value.slice(n));
}