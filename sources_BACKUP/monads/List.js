/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isFunc, isArray} from '../types';
import {equals} from '../operators';

/**
 * Implementation of the List monad
 * @module monads/list
 * @requires types
 */



const MV = Symbol('MonadicValue');


/**
 * The List monad class. This monad is a wrapper for Arrays which implements the
 *     same interfaces for them the other monads in futils provide
 * @class module:monads/list.List
 * @version 2.10.3
 */
export class List {
    constructor (a) {
        this.value = a;
    }
    set value (a) { this[MV] = isArray(a) ? a : [a]; }
    get value () { return this[MV]; }
    set length (_) {}
    get length () { return this.value.length; }

    [Symbol.iterator] () {
        return this.value[Symbol.iterator]();
    }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:monads/list.List
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     *
     * one.toString(); // -> "List([1])"
     */
    toString () { return `List([${this.value}])`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:monads/list.List
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     *
     * List.is(one); // -> true
     */
    static is (a) { return List.prototype.isPrototypeOf(a); }

    /**
     * Converts instances of the Identity monad into instances of the List
     *     monad
     * @method fromIdentity
     * @memberOf module:monads/list.List
     * @static
     * @param {Identity} m Instance of the Identity monad
     * @return {List} Instance of the List monad
     *
     * @example
     * const {Identity, List} = require('futils');
     *
     * const one = Identity.of(1);
     *
     * List.fromIdentity(one); // -> List([1])
     */
    static fromIdentity (m) {
        return m.fold(List.of);
    }

    /**
     * Converts instances of the Maybe monad into instances of the List
     *     monad. If given a Maybe.None, returns an empty List
     * @method fromMaybe
     * @memberOf module:monads/list.List
     * @static
     * @param {None|Some} m The Maybe monad instance
     * @return {List} Instance of the List monad
     *
     * @example
     * const {Maybe, List} = require('futils');
     *
     * const none = Maybe.None();
     * const some = Maybe.Some(1);
     *
     * List.fromMaybe(none); // -> List([])
     * List.fromMaybe(some); // -> List([1])
     */
    static fromMaybe (m) {
        return m.fold(List.empty, List.of);
    }

    /**
     * Converts instances of the Either monad into instances of the List
     *     monad. If given a Either.Left, returns an empty List
     * @method fromEither
     * @memberOf module:monads/list.List
     * @static
     * @param {Left|Right} m The Either monad instance
     * @return {List} Instance of the List monad
     *
     * @example
     * const {Either, List} = require('futils');
     *
     * const left = Either.Left('l');
     * const right = Either.Right('r');
     *
     * List.fromEither(left); // -> List([])
     * List.fromEither(right); // -> List(['r'])
     */
    static fromEither (m) {
        return m.fold(List.empty, List.of);
    }

    /**
     * Converts instances of the IO monad into instances of the List monad.
     *     Please note that this will make the IO run immediatly via it's try()
     *     method which might return an Error as result
     * @method fromIO
     * @memberOf module:monads/list.List
     * @static
     * @param {IO} m The IO monad instance
     * @return {List} Instance of the List monad
     *
     * @example
     * const {IO, List} = require('futils');
     *
     * const doc = IO.of(document).map((d) => d.body);
     *
     * List.fromIO(doc); // -> List([<body>])
     */
    static fromIO (m) {
        let r = m.try();
        return r == null ? List.empty() : List.of(r);
    }

    /**
     * Creates a List monad instance from an Array
     * @method fromArray
     * @memberOf module:monads/list.List
     * @static
     * @param {Array} a The array
     * @return {List} Instance of the List monad
     *
     * @example
     * const {List} = require('futils');
     *
     * List.fromArray([1, 2, 3]); // -> List([1, 2, 3])
     */
    static fromArray (a) {
        return new List(a);
    }

    /**
     * Transforms a List monad instance into an Array
     * @method toArray
     * @memberOf module:monads/list.List
     * @return {Array} The array
     *
     * @example
     * const {List} = require('futils');
     *
     * List.of(1, 2, 3).toArray(); // -> [1, 2, 3]
     */
    toArray () {
        return this.value;
    }

    /**
     * Returns the Unit instance of a List
     * @method empty
     * @memberOf module:monads/list.List
     * @static
     * @return {List} The empty List
     *
     * @example
     * const {List} = require('futils');
     *
     * List.of(1).concat(List.empty()); // -> List([1])
     * List.empty().concat(List.of(1)); // -> List([1])
     */
    static empty () {
        return new List([]);
    }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:monads/list.List
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     * let one_b = List.of(1);
     * let two = List.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return List.is(b) &&
               (b === this ||
                b.value === this.value ||
                b.length === this.length &&
                equals(this.value, b.value));
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:monads/list.List
     * @param {function} f Function to map with
     * @return {List} New instance of the Functor
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> List([2])
     */
    map (f) {
        if (isFunc(f)) {
            return new List(this.value.map(f));
        }
        throw 'List::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a List wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:monads/list.List
     * @static
     * @param {any} a Any value
     * @return {List} New instance of the Applicative
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     *
     * one.value; // -> [1]
     */
    static of (...a) { return new List(a); }
    of (...a) { return List.of(...a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:monads/list.List
     * @param {Functor} m Functor to apply the Applicative to
     * @return {List} New instance of the Functor
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     *
     * const aInc = List.of((a) => a + 1);
     *
     * aInc.ap(one); // -> List([2])
     */
    ap (m) {
        if (isFunc(m.map)) {
            return m.map(this.value[0]);
        }
        throw 'List::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:monads/list.List
     * @param {function} f Function returning a monad
     * @return {List} New instance of the calling monads type
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(1);
     *
     * const mInc = (n) => List.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> List([2]);
     */
    flatMap (f) {
        if (isFunc(f)) {
            return this.map(f).flat();
        }
        throw 'List::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flat
     * @memberof module:monads/list.List
     * @return {List} New instance of the monad
     *
     * @example
     * const {List} = require('futils');
     *
     * let one = List.of(List.of(1));
     *
     * one.flat(); // -> List([1])
     */
    flat () {
        return this.value.reduce((a, m) => a.concat(m));
    }

    flatten() {
        return this.flat();
    }
    // -- Foldable
    
    /**
     * Takes a function and an accumulator, then passes the current value and the
     *   accumulator into it. Returns the result of applying the function to every
     *   value in the list. Each iteration must return a new accumulator value
     * @method fold
     * @memberof module:monads/list.List
     * @param {function} f Function to fold with
     * @param {any} a The initial accumulator value
     * @return {any} The final accumulator
     *
     * @example
     * const {List} = require('futils');
     *
     * const one = List.of('a', 'b');
     *
     * one.fold((acc, n) => acc + n, ''); // -> 'ab'
     */
    fold (f, a) {
        return this.value.reduce(f, a);
    }
    
    /**
     * Takes a function and an accumulator, then passes the current value and the
     *   accumulator into it. Returns the result of applying the function to every
     *   value in the list. Each iteration must return a new accumulator value.
     *   Folds the list from right to left
     * @method foldRight
     * @memberof module:monads/list.List
     * @param {function} f Function to fold with
     * @param {any} a The initial accumulator value
     * @return {any} The final accumulator
     *
     * @example
     * const {List} = require('futils');
     *
     * const one = List.of('a', 'b');
     *
     * one.foldRight((acc, n) => acc + n, ''); // -> 'ba'
     */
    foldRight (f, a) {
        return this.value.reduceRight(f, a);
    }

    /**
     * Takes a function from some value to a Functor and an Applicative and
     *     returns a instance of the Applicative either with a Some or a None
     * @method traverse
     * @memberof module:monads/list.List 
     * @param {function} f Function from a to Applicative(a)
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} A(List(a))
     *
     * @example
     * const {Maybe, List} = require('futils');
     *
     * const one = List.of(1);
     *
     * const odds = (n) => n % 2 !== 0 ? Maybe.of(n) : Maybe.of(null);
     * 
     * one.traverse(odds, Maybe); // -> Some(List([1]))
     */
    traverse (f, A) {
        if (isFunc(f)) {
            return this.value.reduce(
                (t, a) => f(a).map((b) => (s) => s.concat(List.of(b))).ap(t),
                A.of(List.empty())
            );
        }
        throw 'List::traverse expects function but saw ' + f;
    }

    /**
     * Takes an Applicative and returns a instance of the Applicative
     *     either with a Some or a None
     * @method sequence
     * @memberof module:monads/list.List 
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} A(List(a))
     *
     * @example
     * const {Maybe, List} = require('futils');
     *
     * const one = List.of(Maybe.of(1));
     *
     * one.sequence(Maybe); // -> Some(List([1]));
     */
    sequence (A) {
        return this.traverse((a) => a, A);
    }

    // -- Semigroup
    /**
     * Takes another member of the Semigroup and concatenates it
     *     with the List instance
     * @method concat
     * @memberof module:monads/list.List
     * @param {Semigroup} M Other List instance
     * @return {Semigroup} New List
     *
     * @example
     * const {List} = require('futils');
     *
     * const one = List.of(1);
     *
     * one.concat(List.of(2)); // -> List([1, 2])
     */
    concat (S) {
        return new List(this.value.concat(S.value));
    }
}