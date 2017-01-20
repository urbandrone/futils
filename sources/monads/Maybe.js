/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';

/**
 * Implementation of the Maybe monad
 * @module futils/monads/maybe
 * @requires futils/types
 */



const MV = Symbol('MonadicValue');


/**
 * Implementation of the Maybe monad
 * @class module:futils/monads/maybe.Maybe
 * @static
 * @version 2.0.0
 */
class Maybe {
    constructor (a) {
        this.value = a;
    }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/maybe.Maybe
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     * let nothing = Maybe.of(null);
     *
     * one.toString(); // -> "Some(1)"
     * nothing.toString(); // -> "None"
     */
    toString () { return `Maybe`; }

    /**
     * Creates either a Maybe.None or a Maybe.Some from a given Either.Left or
     *     a Either.Right monad
     * @method fromEither
     * @memberof module:futils/monads/maybe.Maybe
     * @static
     * @param {Left|Right} m The Either instance to transform
     * @return {None|Some} None or Some wrapper
     *
     * @example
     * const {Maybe, Left, Right} = require('futils');
     *
     * let left = Left.of('This is a failure');
     * let right = Right.of('This is a success');
     *
     * let nothing = Maybe.fromEither(left);
     * let some = Maybe.fromEither(right);
     *
     * nothing; // -> None(null)
     * some; // -> Some('This is a success')
     */
    static fromEither (m) {
        return m.fold(None.of, Maybe.of);
    }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/maybe.Maybe
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     *
     * Maybe.is(one); // -> true
     */
    static is (a) { return Maybe.prototype.isPrototypeOf(a); }

    /**
     * Returns true if called on a Some and false if called on a None
     * @method isSome
     * @memberof module:futils/monads/maybe.Maybe
     * @return {boolean} True
     */
    isSome () { return this.value !== null; }

    // -- Setoid
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:futils/monads/maybe.Maybe
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     * let one_b = Maybe.of(1);
     * let two = Maybe.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Maybe.prototype.isPrototypeOf(b) &&
               b.value === this.value;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/maybe.Maybe
     * @param {function} f Function to map with
     * @return {Maybe} New instance of the Functor
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Some(2)
     */
    map (f) {
        if (type.isFunc(f)) {
            return this.isSome() ? Maybe.of(f(this.value)) : this;
        }
        throw 'Maybe::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a Maybe wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:futils/monads/maybe.Maybe
     * @static
     * @param {any} a Any value
     * @return {Maybe} New instance of the Applicative
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     *
     * one.value; // -> 1
     */
    static of (a) { return type.isNil(a) ? new None() : new Some(a); }
    of (a) { return Maybe.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/maybe.Maybe
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Maybe} New instance of the Functor
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     *
     * const aInc = Maybe.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Some(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return this.isSome() ? m.map(this.value) : m;
        }
        throw 'Maybe::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/maybe.Maybe
     * @param {function} f Function returning a monad
     * @return {Maybe} New instance of the calling monads type
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     *
     * const mInc = (n) => Maybe.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> Some(2);
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.isSome() ? this.map(f).value : this;
        }
        throw 'Maybe::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:futils/monads/maybe.Maybe
     * @return {Maybe} New instance of the monad
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(Maybe.of(1));
     *
     * one.flatten(); // -> Some(1)
     */
    flatten () {
        return this.isSome() ? this.value : this;
    }
    // -- Recovering
    orGet (a) { return this.isSome() ? this.value : a; }
    orElse (a) { return this.isSome() ? this : Maybe.of(a); }
    // -- Foldable
    // reduce
    
    // -- ?
    /**
     * Given two functions, folds the first over the instance if it reflects
     *     None and the second over the instance if it reflects Some
     * @method fold
     * @memberof module:futils/monads/maybe.Maybe
     * @param {function} f Function handling the None case
     * @param {function} g Function handling the Some case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     * let nothing = Maybe.of(null);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.fold(fail, success); // -> 'Given 2!';
     * none.fold(fail, success); // -> 'No int!';
     */
    fold (f, g) {
        if (type.isFunc(g)) {
            return this.isSome() ? g(this.value) : f(null);
        }
        throw 'Maybe::fold expects argument 2 to be function but saw ' + g;
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `None` and `Some`
     *     fields (functions) pipes the current value through the corresponding
     *     function
     * @method cata   
     * @memberof module:futils/monads/maybe.Maybe
     * @param {object} o Object with `None` and `Some`
     * @return {any} Result of applying the functions to the current value
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     * let nothing = Maybe.of(null);
     *
     * one.cata({
     *     None: () => 'Nothing found',
     *     Some: (n) => 'Found number of ' + n
     * });
     * // -> 'Found number of 1'
     *
     * nothing.cata({
     *     None: () => 'Nothing found',
     *     Some: (n) => 'Found number of ' + n
     * });
     * // -> 'Nothing found'
     */
    cata (o) {
        if (type.isFunc(o.Some) && type.isFunc(o.None)) {
            return this.fold(o.None, o.Some);
        }
        throw 'Maybe::cata expected Object of {Some: fn}, but saw ' + o; 
    }
    
    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it reflects None
     *     and the second if it reflects Some. Wraps the result into a new
     *     Bifunctor of the same type before returning
     * @method biMap   
     * @memberof module:futils/monads/maybe.Maybe 
     * @param {function} f Function to map if None
     * @param {function} g Function to map if Some
     * @return {Maybe} Result in a new container
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * let one = Maybe.of(1);
     * let nothing = Maybe.of(null);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.biMap(fail, success); // -> Some('Given 1!')
     * nothing.biMap(fail, success); // -> Some('No int :(')
     */
    biMap (f, g) {
        if (type.isFunc(f) && type.isFunc(g)) {
            return Maybe.of(this.fold(f, g));
        }
        throw 'Maybe::biMap expects argument 2 to be function but saw ' + g;
    }
}












/**
 * The Maybe.Some monad
 * @class module:futils/monads/maybe.Some
 * @version 2.0.0
 */
export class Some extends Maybe {
    constructor (a) { super(a); }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    toString () { return `Some(${this.value})`; }
    static of (a) { return Maybe.of(a); }
}



/**
 * The Maybe.None monad
 * @class module:futils/monads/maybe.None
 * @version 2.0.0
 */
export class None extends Maybe {
    constructor () { super(null); }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    toString () { return 'None'; }
    static of () { return new None(); }
}




export default Maybe;