/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';

/**
 * Implementation of the Identity monad
 * @module futils/monads/Identity
 * @requires futils/types
 */



const MV = Symbol('MonadicValue');


/**
 * The Identity monad class
 * @class
 * @version 2.0.0
 */
export default class Identity {
    /**
     * Used with `new`, creates a new instance. Use `Identity.of` instead
     * 
     * @param {any} a Value to put into the monad
     * @return {Identity} A monad containing `a`
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     */
    constructor (a) { this.mvalue = a; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * one.toString(); // -> "Identity(1)"
     */
    toString () { return `Identity(${this.mvalue})`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * Identity.is(one); // -> true
     */
    static is (a) { return Identity.prototype.isPrototypeOf(a); }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * 
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     * let one_b = Identity.of(1);
     * let two = Identity.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Identity.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     *
     * @param {function|Applicative} f Function or Applicative to map with
     * @return {Identity} New instance of the Functor
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Identity(2)
     */
    map (f) {
        if (type.isFunc(f)) {
            return Identity.of(f(this.mvalue));
        }
        throw 'Identity::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a Identity wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     *
     * @param {any} a Any value
     * @return {Identity} New instance of the Applicative
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * one.mvalue; // -> 1
     */
    static of (a) { return new Identity(a); }
    of (a) { return Identity.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     *
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * const aInc = Identity.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Identity(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'Identity::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @param {function} f Function returning a monad
     * @return {Monad} New instance of the calling monads type
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * const mInc = (n) => Identity.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> Identity(2);
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'Identity::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @return {Monad} New instance of the monad
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(Identity.of(1));
     *
     * one.flatten(); // -> Identity(1)
     */
    flatten () {
        return Identity.of(this.mvalue.mvalue);
    }
    // -- Foldable
    // reduce
    // -- Bifunctor
    // biMap, Functor
    // -- Profunctor
    // proMap, Functor
    // -- Monoid
    // empty, Semigroup
    // -- Traversable
    // traverse, Functor, Foldable
    // -- Semigroup
    // concat
}