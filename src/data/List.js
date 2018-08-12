/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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
 * Grants access to the List data structure. List is a wrapper for arrays, which
 * provides an interface similiar to the other data structures
 * @module data/List
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The List data type
 * @class module:data/List.List
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {List} = require('futils/data');
 *
 * List([1, 2, 3]); // -> List([1, 2, 3])
 */
export const List = Type('List', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts one or more values into a List
 * @method of
 * @static
 * @memberOf module:data/List.List
 * @param {...any} a The value or values to lift
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils/data');
 *
 * List.of(1);    // -> List([1])
 * List.of(1, 2); // -> List([1, 2])
 */
List.of = (...a) => List(a);
/**
 * Monoid implementation for List. Returns a List without values
 * @method empty
 * @static
 * @memberOf module:data/List.List
 * @return {List} A List
 *
 * @example
 * const {List} = require('futils/data');
 *
 * List.empty(); // -> List([])
 */
List.empty = () => List([]);
/**
 * Lifts a value into a List. Somewhat similiar to List.of, but only accepts a
 * single value and puts it in a array if it is not an array itself. Useful to
 * transform array-like objects on the fly
 * @method from
 * @static
 * @memberOf module:data/List.List
 * @param {any} a The value to lift
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils/data');
 *
 * List.from(1);   // -> List([1])
 * List.from([1]); // -> List([1])
 */
List.from = (a) => List(arrayFrom(a));
/**
 * A natural transformation from an array into a List
 * @method fromArray
 * @static
 * @memberOf module:data/List.List
 * @param {Array} a The array to transform
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils/data');
 *
 * List.fromArray([1, 2, 3]); // -> List([1, 2, 3])
 */
List.fromArray = List;
/**
 * A natural transformation from an Id to a List
 * @method fromId
 * @static
 * @memberOf module:data/List.List
 * @param {Id} a The Id to transform
 * @return {List} A new List
 *
 * @example
 * const {List, Id} = require('futils/data');
 *
 * const id = Id('a value');
 *
 * List.fromId(id); // -> List(['a value'])
 */
List.fromId = (a) => List.from(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a List
 * @method fromMaybe
 * @static
 * @memberOf module:data/List.List
 * @param {Some|None} a The Maybe to transform
 * @return {List} A List with the value of a Maybe.Some and an empty List for Maybe.None
 *
 * @example
 * const {List, Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a value');
 * const none = Maybe.None();
 *
 * List.fromMaybe(some); // -> List(['a value'])
 * List.fromMaybe(none); // -> List([])
 */
List.fromMaybe = (a) => a.isSome() ? List.from(a.value) : List.empty();
/**
 * A natural transformation from an Either.Left or Either.Right into a List
 * @method fromEither
 * @static
 * @memberOf module:data/List.List
 * @param {Left|Right} a The Either to transform
 * @return {List} List with value(s) for Either.Right, empty List for Either.Left
 *
 * @example
 * const {List, Either} = require('futils/data');
 *
 * const l = Either.Left('a left');
 * const r = Either.Right('a right');
 *
 * List.fromEither(l); // -> List([])
 * List.fromEither(r); // -> List(['a right'])
 */
List.fromEither = (a) => a.isRight() ? List.from(a.value) : List.empty();



List.prototype[Symbol.iterator] = function () {
    return this.value[Symbol.iterator]();
}
/**
 * A natural transformation from a List into an array
 * @method toArray
 * @memberOf module:data/List.List
 * @return {Array} Array of values
 *
 * @example
 * const {List} = require('futils/data');
 *
 * List.of(1, 2, 3).toArray(); // -> [1, 2, 3]
 */
List.prototype.toArray = function () {
    return this.value;
}
/**
 * Concattenates a List with another List
 * @method concat
 * @memberOf module:data/List.List
 * @param {List} a The List instance to concattenate with
 * @return {List} A List containing all values from both Lists
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 *
 * ls.concat(List.of(4, 5, 6)); // -> List([1, 2, 3, 4, 5, 6])
 */
List.prototype.concat = function (a) {
    if (List.is(a)) {
        return List(this.value.concat(a.value));
    }
    throw `List::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over each value in the List
 * @method map
 * @memberOf module:data/List.List
 * @param {Function} f The function to map
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 * 
 * const inc = (n) => n + 1;
 *
 * ls.map(inc); // -> List([2, 3, 4])
 */
List.prototype.map = function (f) {
    return List(this.value.map(f));
}
/**
 * Flattens a nested List one level
 * @method flat
 * @memberOf module:data/List.List
 * @return {List} A List flattened
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(List.of(1, 2, 3));
 *
 * ls.flat(); // -> List([1, 2, 3])
 */
List.prototype.flat = function () {
    return this.value.reduce((l, a) => l.concat(a));
}
/**
 * Maps a List returning function over each value in the List and flattens the result
 * @method flatMap
 * @memberOf module:data/List.List
 * @param {Function} f A List returning function to map
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 *
 * const inc = (n) => List.of(n + 1);
 *
 * ls.flatMap(inc); // -> List([2, 3, 4])
 */
List.prototype.flatMap = function (f) {
    return this.map(f).flat();
}
/**
 * Applies a function in a List to the values in another List
 * @method ap
 * @memberOf module:data/List.List
 * @param {List} a The List that holds the values
 * @return {List} List which contains the results of applying the function
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 *
 * const mInc = List.of((n) => n + 1);
 *
 * mInc.ap(ls); // -> List([2, 3, 4])
 */
List.prototype.ap = function (a) {
    return a.map(this.value[0]);
}
/**
 * Works like the Array.reduce method. If given a function and an initial value,
 * reduces the values in the List to a final value
 * @method reduce
 * @memberOf module:data/List.List
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduce(reducer, 0); // -> 6
 */
List.prototype.reduce = function (f, x) {
    return this.value.reduce(f, x);
}
/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the List into the applicative
 * @method traverse
 * @memberOf data/List.List
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A List wrapped in the applicative
 *
 * @example
 * const {List, Maybe} = require('futils/data');
 * 
 * const ls = List.of(1, 2, 3)
 *
 * const fn = (n) => Maybe.of(n);
 *
 * ls.traverse(fn, Maybe); // -> Some(List([1, 2, 3]))
 */
List.prototype.traverse = function (f, A) {
    return this.reduce(
        (t, a) => f(a).map(b => c => c.concat(List.of(b))).ap(t),
        A.of(List.empty())
    );
}
/**
 * Sequences a List into another applicative Type
 * @method sequence
 * @memberOf module:data/List.List
 * @param {Applicative} A A constructor with of and ap methods
 * @return {Applicative} A List wrapped in the applicative
 *
 * @example
 * const {List, Maybe} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 *
 * ls.sequence(Maybe); // -> Some(List([1, 2, 3]))
 */
List.prototype.sequence = function (A) {
    return this.traverse(x => x, A);
}
/**
 * Alternative implementation, allows to swap a empty List
 * @method alt
 * @memberOf data/List.List
 * @param {List} a The alternative List
 * @return {List} Choosen alternative
 *
 * @example
 * const {List} = require('futils/data');
 *
 * const ls = List.of(1, 2, 3);
 * const ns = List.empty();
 *
 * ls.alt(List.of(4)); // -> List([1, 2, 3])
 * ls.alt(List.of());  // -> List([1, 2, 3])
 * ns.alt(List.of(4)); // -> List([4])
 * ns.alt(List.of());  // -> List([])
 */
List.prototype.alt = function (a) {
    return this.value.length < 1 ? a : this;
}