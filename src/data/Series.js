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




/**
 * Grants access to the Series data structure. Series is a wrapper for arrays, which
 * provides an interface similiar to the other data structures. A Series may only
 * contain values of the same type
 * @module data/Series
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Series data type
 * @class module:data/Series.Series
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series([1, 2, 3]); // -> Series([1, 2, 3])
 */
export const Series = Type('Series', ['value']).
    deriving(Show, Eq, Ord);



/* Utilities */
const arrayFrom = (a) => Array.isArray(a) ? a :
                        a == null ? [] :
                        a.length && typeof a !== 'string' ? Array.from(a) :
                        a[Symbol.iterator] != null ? [...a] :
                        [a];

const sameT = xs => {
    if (xs.length < 2) {
        return xs;
    }
    
    let t = typeOf(xs[0]), _t;
    for (let i = 1; i < xs.length; i += 1) {
        if (t !== (_t = typeOf(xs[i]))) {
            throw `Series of type ${t} cannot contain value of type ${_t}`;
        }
    }
    return xs;
}



/**
 * Lifts one or more values into a Series
 * @method of
 * @static
 * @memberof module:data/Series.Series
 * @param {...any} a The value or values to lift
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(1);    // -> Series([1])
 * Series.of(1, 2); // -> Series([1, 2])
 */
Series.of = (...a) => Series(sameT(a));
/**
 * Monoid implementation for Series. Returns a Series without values
 * @method empty
 * @static
 * @memberof module:data/Series.Series
 * @return {Series} A Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.empty(); // -> Series([])
 */
Series.empty = () => Series([]);
/**
 * Lifts a value into a Series. Somewhat similiar to Series.of, but only accepts a
 * single value and puts it in a array if it is not an array itself. Useful to
 * transform array-like objects on the fly
 * @method from
 * @static
 * @memberof module:data/Series.Series
 * @param {any} a The value to lift
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.from(1);   // -> Series([1])
 * Series.from([1]); // -> Series([1])
 */
Series.from = (a) => Series(sameT(arrayFrom(a)));
/**
 * A natural transformation from an array into a Series
 * @method fromArray
 * @static
 * @memberof module:data/Series.Series
 * @param {Array} a The array to transform
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.fromArray([1, 2, 3]); // -> Series([1, 2, 3])
 */
Series.fromArray = (a) => Series(sameT(a));
/**
 * A natural transformation from an Id to a Series
 * @method fromId
 * @static
 * @memberof module:data/Series.Series
 * @param {Id} a The Id to transform
 * @return {Series} A new Series
 *
 * @example
 * const {Series, Id} = require('futils/data');
 *
 * const id = Id('a value');
 *
 * Series.fromId(id); // -> Series(['a value'])
 */
Series.fromId = (a) => Series.from(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a Series
 * @method fromMaybe
 * @static
 * @memberof module:data/Series.Series
 * @param {Some|None} a The Maybe to transform
 * @return {Series} A Series with the value of a Maybe.Some and an empty Series for Maybe.None
 *
 * @example
 * const {Series, Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a value');
 * const none = Maybe.None();
 *
 * Series.fromMaybe(some); // -> Series(['a value'])
 * Series.fromMaybe(none); // -> Series([])
 */
Series.fromMaybe = (a) => a.isSome() ? Series.from(a.value) : Series.empty();
/**
 * A natural transformation from an Either.Left or Either.Right into a Series
 * @method fromEither
 * @static
 * @memberof module:data/Series.Series
 * @param {Left|Right} a The Either to transform
 * @return {Series} Series with value(s) for Either.Right, empty Series for Either.Left
 *
 * @example
 * const {Series, Either} = require('futils/data');
 *
 * const l = Either.Left('a left');
 * const r = Either.Right('a right');
 *
 * Series.fromEither(l); // -> Series([])
 * Series.fromEither(r); // -> Series(['a right'])
 */
Series.fromEither = (a) => a.isRight() ? Series.from(a.value) : Series.empty();
/**
 * A natural transformation from a List into a Series
 * @method fromList
 * @static
 * @memberof module:data/Series.Series
 * @param {Cons|Nil} a The List to transform
 * @return {Series} A new Series
 *
 * @example
 * const {Series, List} = require('futils/data');
 *
 * const ls = List.of(3).cons(2).cons(1);
 * 
 * Series.fromList(ls); // -> Series([1, 2, 3])
 */
Series.fromList = (a) => Series(sameT(a.toArray()));



Series.fn[Symbol.iterator] = function () {
    return this.value[Symbol.iterator]();
}
/**
 * A natural transformation from a Series into an array
 * @method toArray
 * @memberof module:data/Series.Series
 * @return {Array} Array of values
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(1, 2, 3).toArray(); // -> [1, 2, 3]
 */
Series.fn.toArray = function () {
    return this.value;
}
/**
 * Concatenates a Series with another Series
 * @method concat
 * @memberof module:data/Series.Series
 * @param {Series} a The Series instance to concatenate with
 * @return {Series} A Series containing all values from both Seriess
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 *
 * ls.concat(Series.of(4, 5, 6)); // -> Series([1, 2, 3, 4, 5, 6])
 */
Series.fn.concat = function (a) {
    if (Series.is(a)) {
        return Series(sameT(this.value.concat(a.value)));
    }
    throw `Series::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over each value in the Series
 * @method map
 * @memberof module:data/Series.Series
 * @param {Function} f The function to map
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 * 
 * const inc = (n) => n + 1;
 *
 * ls.map(inc); // -> Series([2, 3, 4])
 */
Series.fn.map = function (f) {
    return Series(this.value.map(f));
}
/**
 * Flattens a nested Series one level
 * @method flat
 * @memberof module:data/Series.Series
 * @return {Series} A Series flattened
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(Series.of(1, 2, 3));
 *
 * ls.flat(); // -> Series([1, 2, 3])
 */
Series.fn.flat = function () {
    return this.value.reduce((l, a) => l.concat(a));
}
/**
 * Maps a Series returning function over each value in the Series and flattens the result
 * @method flatMap
 * @memberof module:data/Series.Series
 * @param {Function} f A Series returning function to map
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 *
 * const inc = (n) => Series.of(n + 1);
 *
 * ls.flatMap(inc); // -> Series([2, 3, 4])
 */
Series.fn.flatMap = function (f) {
    return this.map(f).flat();
}
Series.fn.extract = function () {
    return this.value.length < 1 ? null : this.value[0];
}
Series.fn.extend = function (f) {
    return this.reduceRight((s, a) => Series.from(f(s.cons(a))), Series.empty());
}
/**
 * Applies a function in a Series to the values in another Series
 * @method ap
 * @memberof module:data/Series.Series
 * @param {Series} a The Series that holds the values
 * @return {Series} Series which contains the results of applying the function
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 *
 * const mInc = Series.of((n) => n + 1);
 *
 * mInc.ap(ls); // -> Series([2, 3, 4])
 */
Series.fn.ap = function (a) {
    return this.value.length < 1 ? this : a.map(this.value[0]);
}
/**
 * Works like the Array.reduce method. If given a function and an initial value,
 * reduces the values in the Series to a final value
 * @method reduce
 * @memberof module:data/Series.Series
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduce(reducer, 0); // -> 6
 */
Series.fn.reduce = function (f, x) {
    return this.value.reduce(f, x);
}
/**
 * Works like the Array.reduceRight method. If given a function and an initial
 * value, reduces the values in the Series to a final value
 * @method reduceRight
 * @memberof module:data/Series.Series
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduceRight(reducer, 0); // -> 6
 */
Series.fn.reduceRight = function (f, x) {
    return this.value.reduceRight(f, x);
}
/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the Series into the applicative
 * @method traverse
 * @memberof data/Series.Series
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Series wrapped in the applicative
 *
 * @example
 * const {Series, Maybe} = require('futils/data');
 * 
 * const ls = Series.of(1, 2, 3)
 *
 * const fn = (n) => Maybe.of(n);
 *
 * ls.traverse(fn, Maybe); // -> Some(Series([1, 2, 3]))
 */
Series.fn.traverse = function (f, A) {
    return this.reduce(
        (t, a) => f(a).map(b => c => c.concat(Series.of(b))).ap(t),
        A.of(Series.empty())
    );
}
/**
 * Sequences a Series into another applicative Type
 * @method sequence
 * @memberof module:data/Series.Series
 * @param {Applicative} A A constructor with of and ap methods
 * @return {Applicative} A Series wrapped in the applicative
 *
 * @example
 * const {Series, Maybe} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 *
 * ls.sequence(Maybe); // -> Some(Series([1, 2, 3]))
 */
Series.fn.sequence = function (A) {
    return this.traverse(x => x, A);
}
/**
 * Alternative implementation, allows to swap a empty Series
 * @method alt
 * @memberof data/Series.Series
 * @param {Series} a The alternative Series
 * @return {Series} Choosen alternative
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2, 3);
 * const ns = Series.empty();
 *
 * ls.alt(Series.of(4));    // -> Series([1, 2, 3])
 * ls.alt(Series.empty());  // -> Series([1, 2, 3])
 * ns.alt(Series.of(4));    // -> Series([4])
 * ns.alt(Series.empty());  // -> Series([])
 */
Series.fn.alt = function (a) {
    return this.value.length < 1 ? a : this;
}
/**
 * Takes function which returns a Monoid and folds the Series with it into a Monoid
 * @method foldMap
 * @memberof module:data/Series.Series
 * @param {Function} f The Monoid returning function
 * @return {Monoid} A Monoid of the type the function returns
 *
 * @example
 * const {Series} = require('futils/data');
 * const {Sum} = require('futils/monoid');
 *
 * const fn = (n) => Sum.of(n);
 *
 * Series.of(1, 2, 3).foldMap(fn); // -> Sum(6)
 */
Series.fn.foldMap = function (f) {
    return this.value.reduce((m, x) => m == null ? f(x) : m.concat(f(x)), null);
}
/**
 * Takes a Monoid and folds the Series into it
 * @method fold
 * @memberof module:data/Series.Series
 * @param {Monoid} A The Monoid type constructor
 * @return {Monoid} A Monoid of the type the function returns
 *
 * @example
 * const {Series} = require('futils/data');
 * const {Sum} = require('futils/monoid');
 *
 * Series.of(1, 2, 3).fold(Sum); // -> Sum(6)
 */
Series.fn.fold = function (A) {
    return this.foldMap(A.of);
}
/**
 * Takes a function which returns a Boolean and filters the Series with it. Works
 * much like the Array.filter function
 * @method filter
 * @memberof module:data/Series.Series
 * @param {Function} f The function to filter with
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const even = (n) => n % 2 === 0;
 *
 * Series.of(1, 2, 3).filter(even); // -> Series([2])
 */
Series.fn.filter = function (f) {
    return Series(this.value.filter(f));
}
/**
 * Takes a value and puts it between each entry in the Series
 * @method intersperse
 * @memberof module:data/Series.Series
 * @param {any} a The value to put in between
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(1, 2).intersperse(0.5); // -> Series([1, 0.5, 2])
 */
Series.fn.intersperse = function (a) {
    return Series(sameT(this.value.reduce((ls, x) => ls.length < 1 ? ls.concat(x) : ls.concat([a, x]), [])));
}
/**
 * Sets the given value to the head position of a Series
 * @method cons
 * @memberof module:data/Series.Series
 * @param {any} a The value to set
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(2).cons(1); // -> Series([1, 2]);
 */
Series.fn.cons = function (a) {
    return Series(sameT([a].concat(this.value)));
}
/**
 * Sets a given value to the tail position of a Series
 * @method snoc
 * @memberof module:data/Series.Series
 * @param {any} a The value to set
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(1).snoc(2); // -> Series([1, 2])
 */
Series.fn.snoc = function (a) {
    return Series(sameT(this.value.concat(a)));
}
/**
 * If given a number N, returns the first N items from the Series
 * @method take
 * @memberof module:data/Series.Series
 * @param {Number} n Amount of elements to take from the beginning of the Series
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(0, 1, 2).take(2); // -> Series([0, 1])
 */
Series.fn.take = function (n) {
    return Series(this.value.slice(0, n));
}
/**
 * If given a number N, drops the first N items from the Series
 * @method drop
 * @memberof module:data/Series.Series
 * @param {Number} n Amount of elements to drop from the beginning of the Series
 * @return {Series} A new Series
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * Series.of(0, 1, 2).drop(2); // -> Series([2])
 */
Series.fn.drop = function (n) {
    return Series(this.value.slice(n));
}
/**
 * Given a predicate function, returns the first element for which the
 * predicate returns true. If no element passes the predicate, null is returned
 * @method find
 * @memberof module:data/Series.Series
 * @param {Function} f The predicate function
 * @return {any|null} The first match or null
 *
 * @example
 * const {Series} = require('futils/data');
 *
 * const even = (n) => n % 2 === 0;
 * 
 * Series.of(1, 2, 3).find(even); // -> 2
 */
Series.fn.find = function (f) {
    let r = this.value.find ? this.value.find(f) :
            this.value.reduce((x, y) => x == null && !!f(y) ? y : x, null);
    return r == null ? null : r;
}