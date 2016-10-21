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
export class Some {
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
    set mvalue (a) {
        if (type.isNil(a)) {
            throw 'Some::of cannot create from null or undefined but saw ' + a;
        }
        this[MV] = a;
    }
    get mvalue () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * 
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Identity} = require('futils').monads;
     *
     * let one = Identity.of(1);
     *
     * one.toString(); // -> "Identity(1)"
     */
    toString () { return `Some(${this.mvalue})`; }

    /**
     * Returns true if given a instance of the class
     * 
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
    static is (a) { return Some.prototype.isPrototypeOf(a); }

    /**
     * Returns true if the Some wraps a value which is neither `undefined` nor
     *     `null`
     *     
     * @return {boolean} True
     */
    isSome () { return true; }

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
        return Some.prototype.isPrototypeOf(b) &&
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
            return Maybe.of(f(this.mvalue));
        }
        throw 'Some::map expects argument to be function but saw ' + f;
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
    static of (a) { return Some.is(a) ? a : new Some(a); }
    of (a) { return Some.of(a); }

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
        throw 'Some::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * 
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
        throw 'Some::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     *     
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
        return Maybe.of(this.mvalue.mvalue);
    }
    // -- Recovering
    orElse () { return this.mvalue; }
    orSome () { return this; }
    // -- Foldable
    // reduce
    // -- ?
    /**
     * Given two functions (`f` & `g`), folds `f` over the instance if it reflects
     *     None and `g` over the instance if it reflects Some
     * @method fold
     * @param {function} f Function handling the None case
     * @param {function} g Function handling the Some case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Maybe} = require('futils').monads;
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
    fold (_, g) {
        if (type.isFunc(g)) {
            return g(this.mvalue);
        }
        throw 'Some::fold expects argument 2 to be function but saw ' + g;
    }
    cata (o) {
        if (type.isFunc(o.Some) && type.isFunc(o.None)) {
            return this.fold(o.None, o.Some);
        }
        throw 'Some::cata expected Object of {Some: fn}, but saw ' + o; 
    }
    // -- Bifunctor
    biMap (f, g) {
        if (type.isFunc(f) && type.isFunc(g)) {
            return Maybe.of(this.fold(f, g));
        }
        throw 'Some::biMap expects argument 2 to be function but saw ' + g;
    }
    // -- Traversable
}



/**
 * Implementation of the Maybe.None monad
 * @class
 * @version 2.0.0
 */
export class None {
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
    constructor () { this.mvalue = null; }
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
    toString () { return 'None'; }

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
    static is (a) { return None.prototype.isPrototypeOf(a); }
    isSome () { return false; }

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
        return None.prototype.isPrototypeOf(b) &&
               b.toString() === this.toString();
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
    map () { return this; }
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
    static of () { return new None(); }
    of () { return None.of(); }

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
    ap (m) { return m; }
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
    flatMap () { return this; }

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
    flatten () { return this; }
    // -- Recovering
    orElse (a) { return a; }
    orSome (a) { return Maybe.of(a); }
    // -- Foldable
    // reduce
    // -- ?
    fold (f) {
        if (type.isFunc(f)) {
            return f();
        }
        throw 'None::fold expects argument 1 to be function but saw ' + f;
    }
    cata (o) {
        if (type.isFunc(o.None)) {
            return this.fold(o.None);
        }
        throw 'None::cata expected Object of {None: fn}, but saw ' + o; 
    }
    // -- Bifunctor
    biMap (f) {
        if (type.isFunc(f)) {
            return Maybe.of(this.fold(f));
        }
        throw 'None::biMap expects argument 1 to be function but saw ' + f;
    }
    // -- Traversable
}




export default class Maybe {
    static of (a) {
        return type.isNil(a) ? None.of() : Some.of(a);
    }
    static fromNullable (a) { return Maybe.of(a); }
    static fromEither (m) {
        return m.fold(None.of, Some.of);
    }
    static is (a) { return Some.is(a) || None.is(a); }
}