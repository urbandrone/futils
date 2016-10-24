/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';

/**
 * Implementation of the Either monad
 * @module futils/monads/Either
 * @requires futils/types
 */



const MV = Symbol('MonadicValue');


/**
 * The Either.Right monad class
 * @class
 * @version 2.0.0
 */
export class Right {
    /**
     * Used with `new`, creates a new instance. Use `Right.of` instead
     * 
     * @param {any} a Value to put into the monad
     * @return {Right} A monad containing `a`
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     */
    constructor (a) { this.mvalue = a; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * 
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let right = Right.of(1);
     *
     * right.toString(); // -> "Right(1)"
     */
    toString () { return `Right(${this.mvalue})`; }

    /**
     * Returns true if given a instance of the class
     * 
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     *
     * Right.is(one); // -> true
     */
    static is (a) { return Right.prototype.isPrototypeOf(a); }

    /**
     * Returns true if called on a Right and false if called on a Left
     *     
     * @return {boolean} True
     */
    isRight () { return true; }

    // -- Setoid
    /**
     * Given another Setoid, checks if they are equal
     * 
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     * let one_b = Right.of(1);
     * let two = Right.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Right.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }

    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     *
     * @param {function} f Function to map with
     * @return {Right} New instance of the Functor
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Right(2)
     */
    map (f) {
        if (type.isFunc(f)) {
            return Right.of(f(this.mvalue));
        }
        throw 'Right::map expects argument to be function but saw ' + f;
    }

    // -- Applicative
    /**
     * Creates a new instance of a Right wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     *
     * @param {any} a Any value
     * @return {Right} New instance of the Applicative
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     *
     * one.mvalue; // -> 1
     */
    static of (a) { return Right.is(a) ? a : new Right(a); }
    of (a) { return Right.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     *
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     *
     * const aInc = Right.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Right(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'Right::ap expects argument to be Functor but saw ' + m;
    }

    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * 
     * @param {function} f Function returning a monad
     * @return {Monad} New instance of the calling monads type
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(1);
     *
     * const mInc = (n) => Right.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> Right(2);
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'Right::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     *     
     * @return {Monad} New instance of the monad
     *
     * @example
     * const {Right} = require('futils').monads;
     *
     * let one = Right.of(Right.of(1));
     *
     * one.flatten(); // -> Right(1)
     */
    flatten () {
        return Right.of(this.mvalue.mvalue);
    }

    // -- Recovering
    orElse () { return this.mvalue; }
    orRight () { return this; }

    // -- Foldable
    // reduce
    
    // -- ?
    /**
     * Given two functions, folds the first over the instance if it reflects a
     *     Left and the second over the instance if it reflects a Right
     *     
     * @param {function} f Function handling the Left case
     * @param {function} g Function handling the Right case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Right, Left} = require('futils').monads;
     *
     * let one = Right.of(1);
     * let nothing = Left.of(null);
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
        throw 'Right::fold expects argument 2 to be function but saw ' + g;
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `Left` and `Right`
     *     fields (functions) pipes the current value through the corresponding
     *     function
     *     
     * @param {object} o Object with `Left` and `Right`
     * @return {any} Result of applying the functions to the current value
     *
     * @example
     * const {Right, Left} = require('futils').monads;
     *
     * let one = Right.of(1);
     * let nothing = Left.of(null);
     *
     * one.cata({
     *     Left: () => 'Nothing found',
     *     Right: (n) => 'Found number of ' + n
     * });
     * // -> 'Found number of 1'
     *
     * nothing.cata({
     *     Left: () => 'Nothing found',
     *     Right: (n) => 'Found number of ' + n
     * });
     * // -> 'Nothing found'
     */
    cata (o) {
        if (type.isFunc(o.Right)) {
            return o.Right(this.mvalue);
        }
        throw 'Right::cata expected Object of {Right: fn}, but saw ' + o; 
    }

    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it reflects Left
     *     and the second if it reflects Right. Wraps the result into a new
     *     Bifunctor of the same type before returning
     *     
     * @param {function} f Function to map if Left
     * @param {function} g Function to map if Right
     * @return {Bifunctor} Result in a new container
     *
     * @example
     * const {Right, Left} = require('futils').monads;
     *
     * let one = Right.of(1);
     * let nothing = Left.of(null);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.biMap(fail, success); // -> Right('Given 1!')
     * nothing.biMap(fail, success); // -> Left('No int :(')
     */
    biMap (_, g) {
        if (type.isFunc(g)) {
            return Right.of(g(this.mvalue));
        }
        throw 'Right::biMap expects argument 2 to be function but saw ' + g;
    }

    /**
     * Swaps a Left into a Right and a Right into a Left (swaps the disjunction)
     *
     * @return {Left|Right} A Left or Right, depending on the instance
     *
     * @example
     * const {Right, Left} = require('futils').monads;
     *
     * let one = Right.of(1);
     * let nan = Left.of(NaN);
     *
     * one.swap(); // -> Left(1);
     * nan.swap(); // -> Right(NaN)
     */
    swap () {
        return Left.of(this.mvalue);
    }

    /**
     * Given a function, maps it if the instance is a Left and does nothing if
     *     it is a Right
     * @method mapLeft
     * @param {function} f Function to map
     * @return {Left|Right} A Left with updated value or a Right
     *
     * @example
     * const {Right, Left} = require('futils').monads;
     *
     * let one = Right.of(1);
     * let nan = Left.of(NaN);
     *
     * const nanToZero = (x) => isNaN(x) ? 0 : x;
     *
     * one.mapLeft(nanToZero); // -> Right(1)
     * nan.mapLeft(nanToZero); // -> Left(0)
     */
    mapLeft () { return this; }
    // -- Semigroup
    // -- Traversable
}




/**
 * The Either.Left monad class
 * @class
 * @version 2.0.0
 */
export class Left {
    /**
     * Used with `new`, creates a new instance. Use `Left.of` instead
     * 
     * @param {any} a Value to put into the monad
     * @return {Left} A monad containing `a`
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let one = Left.of(1);
     */
    constructor (a) { this.mvalue = a; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * 
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let left = Left.of(1);
     *
     * left.toString(); // -> "Left(1)"
     */
    toString () { return `Left(${this.mvalue})`; }

    /**
     * Returns true if given a instance of the class
     * 
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let one = Left.of(1);
     *
     * Left.is(one); // -> true
     */
    static is (a) { return Left.prototype.isPrototypeOf(a); }

    /**
     * Returns true if called on a Right and false if called on a Left
     *     
     * @return {boolean} False
     */
    isRight () { return false; }

    // -- Setoid
    /**
     * Given another Setoid, checks if they are equal
     * 
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let one = Left.of(1);
     * let one_b = Left.of(1);
     * let two = Left.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Left.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor. Does nothing if
     *     called on a Left.
     *
     * @param {function} f Function to map with
     * @return {Left} New instance of the Functor
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let one = Left.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Left(1)
     */
    map () { return this; }
    // -- Applicative
    /**
     * Creates a new instance of a Left wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     *
     * @param {any} a Any value
     * @return {Left} New instance of the Applicative
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let one = Left.of(1);
     *
     * one.mvalue; // -> 1
     */
    static of (a) { return Left.is(a) ? a : new Left(a); }
    of (a) { return Left.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor. Does nothing if called on a Left
     *
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {Left} = require('futils').monads;
     *
     * let one = Left.of(1);
     *
     * const aInc = Left.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Left(1)
     */
    ap (m) { return m; }
    // -- Monad
    flatMap () { return this; }
    flatten () { return this; }
    // -- Recovering
    orElse (a) { return a; }
    orRight (a) { return Right.of(a); }
    // -- Foldable
    // reduce
    // -- ?
    fold (f) {
        if (type.isFunc(f)) {
            return f(this.mvalue);
        }
        throw 'Left::fold expects argument 1 to be function but saw ' + f;
    }
    cata (o) {
        if (type.isFunc(o.Left)) {
            return o.Left(this.mvalue);
        }
        throw 'Left::cata expected Object of {Left: fn}, but saw ' + o; 
    }
    // -- Bifunctor
    biMap (f) {
        if (type.isFunc(f)) {
            return Left.of(f(this.mvalue));
        }
        throw 'Left::biMap expects argument 1 to be function but saw ' + f;
    }
    swap () {
        return Right.of(this.mvalue);
    }
    mapLeft (f) {
        if (type.isFunc(f)) {
            return this.biMap(f);
        }
        throw 'Left::biMap expects argument 1 to be function but saw ' + f;
    }
    // -- Traversable
}




export default class Either {
    static is (a) { return Left.is(a) || Right.is(a); }
    static fromNullable (exc, a) {
        if (!type.isNull(a) && !type.isVoid(a)) {
            return Right.of(a);
        }
        return Left.of(exc);
    }
    static fromMaybe (exc, m) {
        return m.fold(() => Left.of(exc), Right.of);
    }
    static fromIO (exc, m) {
        return Either.try(m.performIO);
    }
    static try (f, ...partials) {
        if (type.isFunc(f)) {
            if (f.length <= partials.length) {
                try {
                    let R = f(...partials);
                    return Error.prototype.isPrototypeOf(R) ?
                           Left.of(R.message) :
                           Right.of(R);
                } catch (exc) {
                    return Left.of(exc.message);
                }
            }
            return (...args) => {
                try {
                    let R = f(...partials, ...args);
                    return Error.prototype.isPrototypeOf(R) ?
                           Left.of(R.message) :
                           Right.of(R);
                } catch (exc) {
                    return Left.of(exc.message);
                }
            }
        }
        throw 'Either::try expects argument to be function but saw ' + f;
    }
}