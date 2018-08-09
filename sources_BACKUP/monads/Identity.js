/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isFunc} from '../types';
import {equals} from '../operators';

/**
 * Implementation of the Identity monad
 * @module monads/identity
 * @requires types
 */



const MV = Symbol('MonadicValue');


/**
 * The Identity monad class. This monad is useful if you just want to apply some
 *   operations to a value which will always succeed. Consider using one of the
 *   other monads if this is not the case.
 * @class module:monads/identity.Identity
 * @version 2.0.0
 */
export class Identity {
    constructor (a) {
        this.value = a;
    }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:monads/identity.Identity
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * one.toString(); // -> "Identity(1)"
     */
    toString () { return `Identity(${this.value})`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:monads/identity.Identity
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * Identity.is(one); // -> true
     */
    static is (a) { return Identity.prototype.isPrototypeOf(a); }

    /**
     * Converts instances of the Maybe monad into instances of the Identity
     *     monad. If given a Maybe.None, returns an Identity with a null value
     * @method fromMaybe
     * @memberOf module:monads/identity.Identity
     * @static
     * @param {None|Some} m The Maybe monad instance
     * @return {Identity} Instance of the Identity monad
     *
     * @example
     * const {Maybe, Identity} = require('futils');
     *
     * const none = Maybe.None();
     * const some = Maybe.Some(1);
     *
     * Identity.fromMaybe(none); // -> Identity(null)
     * Identity.fromMaybe(some); // -> Identity(1)
     */
    static fromMaybe (m) {
        return m.fold(Identity.of, Identity.of);
    }

    /**
     * Converts instances of the Either monad into instances of the Identity
     *     monad
     * @method fromEither
     * @memberOf module:monads/identity.Identity
     * @static
     * @param {Left|Right} m The Either monad instance
     * @return {Identity} Instance of the Identity monad
     *
     * @example
     * const {Either, Identity} = require('futils');
     *
     * const left = Either.Left('l');
     * const right = Either.Right('r');
     *
     * Identity.fromEither(left); // -> Identity('l')
     * Identity.fromEither(right); // -> Identity('r')
     */
    static fromEither (m) {
        return m.fold(Identity.of, Identity.of);
    }

    /**
     * Converts instances of the List monad into instances of the Identity monad.
     *     Please note that only the first item of the List will be returned
     * @method fromList
     * @memberOf monads/identity.Identity
     * @static
     * @param {List} m The List monad instance
     * @return {Identity} Instance of the Identity monad
     *
     * @example
     * const {List, Identity} = require('futils');
     *
     * const nums = List.of(1, 2, 3);
     *
     * Identity.fromList(nums); // -> Identity(1)
     */
    static fromList (m) {
        return Identity.of(m.value[0]);
    }

    /**
     * Converts instances of the IO monad into instances of the Identity monad.
     *     Please note that this will make the IO run immediatly via it's try()
     *     method which might return an Error as result
     * @method fromIO
     * @memberOf module:monads/identity.Identity
     * @static
     * @param {IO} m The IO monad instance
     * @return {Identity} Instance of the Identity monad
     *
     * @example
     * const {IO, Identity} = require('futils');
     *
     * const doc = IO.of(document).map((d) => d.body);
     *
     * Identity.fromIO(doc); // -> Identity(<body>)
     */
    static fromIO (m) {
        return Identity.of(m.try());
    }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:monads/identity.Identity
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     * let one_b = Identity.of(1);
     * let two = Identity.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Identity.is(b) && equals(this.value, b.value);
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:monads/identity.Identity
     * @param {function} f Function to map with
     * @return {Identity} New instance of the Functor
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Identity(2)
     */
    map (f) {
        if (isFunc(f)) {
            return new Identity(f(this.value));
        }
        throw 'Identity::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a Identity wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:monads/identity.Identity
     * @static
     * @param {any} a Any value
     * @return {Identity} New instance of the Applicative
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * one.value; // -> 1
     */
    static of (a) { return new Identity(a); }
    of (a) { return Identity.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:monads/identity.Identity
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Identity} New instance of the Functor
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * const aInc = Identity.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Identity(2)
     */
    ap (m) {
        if (isFunc(m.map)) {
            return m.map(this.value);
        }
        throw 'Identity::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:monads/identity.Identity
     * @param {function} f Function returning a monad
     * @return {Identity} New instance of the calling monads type
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * const mInc = (n) => Identity.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> Identity(2);
     */
    flatMap (f) {
        if (isFunc(f)) {
            return this.map(f).flat();
        }
        throw 'Identity::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flat
     * @memberof module:monads/identity.Identity
     * @return {Identity} New instance of the monad
     *
     * @example
     * const {Identity} = require('futils');
     *
     * let one = Identity.of(Identity.of(1));
     *
     * one.flat(); // -> Identity(1)
     */
    flat () {
        return this.value;
    }

    flatten() {
        return this.flat();
    }
    // -- Foldable
    
    /**
     * Takes a function and passes the current value into it. Returns the result
     *   of applying the function to the value
     * @method fold
     * @memberof module:monads/identity.Identity
     * @param {function} f Function to fold with
     * @return {any} Whatever the function returns
     *
     * @example
     * const {Identity} = require('futils');
     *
     * const one = Identity.of(1);
     *
     * one.fold((n) => n + 1); // -> 2
     */
    fold (f) {
        return f(this.value);
    }
    // -- Bifunctor
    // biMap, Functor
    // -- Profunctor
    // proMap, Functor
    // -- Monoid
    // empty, Semigroup
    // -- Traversable
    

    /**
     * Takes a function from some value to a Functor and an Applicative and
     *     returns a instance of the Applicative either with a Some or a None
     * @method traverse
     * @memberof module:monads/identity.Identity 
     * @param {function} f Function from a to Applicative(a)
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} A(Identity(a))
     *
     * @example
     * const {Maybe, Identity} = require('futils');
     *
     * const one = Identity.of(1);
     *
     * const odds = (n) => n % 2 !== 0 ? Maybe.of(n) : Maybe.of(null);
     * 
     * one.traverse(odds, Maybe); // -> Some(Identity(1))
     */
    traverse (f, A) {
        if (isFunc(f)) {
            return A.of(Identity.of).ap(this.fold(f));
        }
        throw 'Identity::traverse expects function but saw ' + f;
    }

    /**
     * Takes an Applicative and returns a instance of the Applicative
     *     either with a Some or a None
     * @method sequence
     * @memberof module:monads/identity.Identity 
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} A(Identity(a))
     *
     * @example
     * const {Maybe, Identity} = require('futils');
     *
     * const one = Identity.of(Maybe.of(1));
     *
     * one.sequence(Maybe); // -> Some(Identity(1));
     */
    sequence (A) {
        return this.traverse((a) => a, A);
    }
    // -- Semigroup
    /**
     * Concatenates this member of a semigroup with another member of
     *     the same semigroup if the inner value is a semigroup
     * @method concat
     * @memberof module:monads/identity.Identity 
     * @param {Identity} S Other member of the same semigroup
     * @return {Identity} Both Identitys concatenated
     *
     * @example
     * const {Identity} = require('futils');
     *
     * const hello = Identity.of('hello ');
     * const world = Identity.of('world');
     *
     * hello.concat(world); // -> Identity('hello world')
     */
    concat (S) {
        return Identity.of(this.value.concat(S.value));
    }
}