/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isFunc, isNil} from '../types';

/**
 * Implementation of the Maybe monad
 * @module monads/maybe
 * @requires types
 */



const MV = Symbol('MonadicValue');


/**
 * Implementation of the Maybe monad. This monad allows to model any actions
 *   which can produce a null/non-existing result by utilizing the None subclass
 *   and the Some subclass for operations which produce a result.
 * @class module:monads/maybe.Maybe
 * @static
 * @version 2.0.0
 */
export class Maybe {
    constructor (a) {
        this.value = a;
    }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:monads/maybe.Maybe
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
     * @memberof module:monads/maybe.Maybe
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
     * @memberof module:monads/maybe.Maybe
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
     * @memberof module:monads/maybe.Maybe
     * @return {boolean} True
     */
    isSome () { return this.value != null; }

    // -- Setoid
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:monads/maybe.Maybe
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
     * @memberof module:monads/maybe.Maybe
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
        return this.fold(
            () => new None(),
            (s) => Maybe.of(f(s))
        );
    }
    // -- Applicative
    /**
     * Creates a new instance of a Maybe wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:monads/maybe.Maybe
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
    static of (a) { return isNil(a) ? new None() : new Some(a); }
    of (a) { return Maybe.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:monads/maybe.Maybe
     * @param {Functor} F Functor to apply the Applicative to
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
    ap (F) {
        return this.fold(
            () => new None(),
            (s) => F.map(s)
        );
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:monads/maybe.Maybe
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
        return this.map(f).flatten();
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:monads/maybe.Maybe
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

    /**
     * Allows recovering into a final value if the operation comes to a dead
     *     end
     * @method orGet
     * @memberof module:monads/maybe.Maybe
     * @param {any} x Recovery value if operating on a None
     * @return {any} The recovery value on a None, the value on a Some
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * const one = Maybe.of(1);
     * const none = Maybe.empty();
     *
     * one.orGet('recover!'); // -> 1
     * none.orGet('recover!'); // -> 'recover!'
     */
    orGet (a) { return this.isSome() ? this.value : a; }

    /**
     * Allows recovering into a new Some if the operation comes to a dead
     *     end
     * @method orElse
     * @memberof module:monads/maybe.Maybe
     * @param {any} x Recovery value if operating on a Left
     * @return {Some} Either a Some of the recovery or the value
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * const one = Maybe.of(1);
     * const none = Maybe.empty();
     *
     * one.orElse('recover!'); // -> Some(1)
     * none.orElse('recover!'); // -> Some('recover!')
     */
    orElse (a) { return this.isSome() ? this : Maybe.of(a); }

    // -- Foldable
    /**
     * Given two functions, folds the first over the instance if it reflects
     *     None and the second over the instance if it reflects Some
     * @method fold
     * @memberof module:monads/maybe.Maybe
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
     * const fail = () => 'No int!';
     * const success = (n) => `Given ${n}!`;
     *
     * one.fold(fail, success); // -> 'Given 2!';
     * none.fold(fail, success); // -> 'No int!';
     */
    fold (f, g) {
        if (this.isSome()) {
            return g(this.value);
        }
        return f(this.value);
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `None` and `Some`
     *     fields (functions) pipes the current value through the corresponding
     *     function
     * @method cata   
     * @memberof module:monads/maybe.Maybe
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
    cata ({None, Some}) {
        return this.fold(None, Some);
    }

    /**
     * Takes a function from some value to a Functor and an Applicative and
     *     returns a instance of the Applicative either with a Some or a None
     * @method traverse
     * @memberof module:monads/maybe.Maybe 
     * @param {function} f Function from a to Applicative(a)
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Some(x)) or A(None)
     *
     * @example
     * const {Maybe, Identity} = require('futils');
     *
     * const one = Identity.of(1);
     *
     * // Note: ::traverse needs it's second parameter, because the Maybe
     * //   type may-be None so leaving the second argument blank results
     * //   in the instance not knowing where to traverse to in a None case
     * 
     * one.traverse(Maybe.of, Maybe);
     * // -> Some(Identity(1))
     */
    traverse (f, A) {
        return this.fold(() => A.of(new None()),
                         (x) => f(x).map(Maybe.of))
        
    }

    /**
     * Takes an Applicative and returns a instance of the Applicative
     *     either with a Some or a None
     * @method sequence
     * @memberof module:monads/maybe.Maybe 
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Some(x)) or A(None)
     *
     * @example
     * const {Maybe, Identity} = require('futils');
     *
     * const one = Maybe.of(Identity.of(1));
     *
     * one.sequence(Identity); // -> Identity(Some(1));
     */
    sequence (A) {
        return this.traverse((a) => a, A);
    }
    
    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it reflects None
     *     and the second if it reflects Some. Wraps the result into a new
     *     Bifunctor of the same type before returning
     * @method biMap   
     * @memberof module:monads/maybe.Maybe 
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
        if (isFunc(f) && isFunc(g)) {
            return Maybe.of(this.fold(f, g));
        }
        throw 'Maybe::biMap expects functions but saw ' + f + ', ' + g;
    }

    // Semigroup
    /**
     * Concatenates this member of a semigroup with another member of
     *     the same semigroup
     * @method concat
     * @memberof module:monads/maybe.Maybe 
     * @param {Maybe} S Other member of the same semigroup
     * @return {Maybe} Both Maybes concatenated
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * const hello = Maybe.of('hello ');
     * const world = Maybe.of('world');
     *
     * hello.concat(world); // -> Some('hello world')
     */
    concat (S) {
        return this.fold(
            () => S,
            (s) => S.isSome() ?
                    Some.of(s.concat(S.value)) :
                    Some.of(s)
        );
    }

    // Monoid
    /**
     * Returns the Unit instance of a Maybe
     * @method empty
     * @memberof module:monads/maybe.Maybe 
     * @return {None} A new None
     *
     * @example
     * const {Maybe} = require('futils');
     *
     * const str = Maybe.of('hello world');
     *
     * str.concat(Maybe.empty()); // -> Some('hello world')
     * Maybe.empty().concat(str); // -> Some('hello world')
     */
    static empty () { return new None(); }
}












/**
 * The Maybe.Some monad. Inherits from the Maybe monad.
 * @class module:monads/maybe.Some
 * @augments module:monads/maybe.Maybe
 * @version 2.0.0
 */
export class Some extends Maybe {
    constructor (a) { super(a); }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    toString () { return `Some(${this.value})`; }
    static of (a) { return new Some(a); }
}



/**
 * The Maybe.None monad. Inherits from the Maybe monad.
 * @class module:monads/maybe.None
 * @augments module:monads/maybe.Maybe
 * @version 2.0.0
 */
export class None extends Maybe {
    constructor () { super(null); }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    toString () { return 'None'; }
    static of () { return new None(); }
}