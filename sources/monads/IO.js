/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';

/**
 * Implementation of the IO monad
 * @module futils/monads/io
 * @requires futils/types
 */



const MV = Symbol('MonadicValue');

const comp = (f, g) => (...args) => f(g(...args));


/**
 * The IO monad class
 * @class module:futils/monads/io.IO
 * @version 2.0.0
 */
export default class IO {
    constructor (a) { this.run = a; }
    set run (a) { this[MV] = a; }
    get run () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/io.IO
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     *
     * one.toString(); // -> "IO"
     */
    toString () { return `IO`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/io.IO
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     *
     * IO.is(one); // -> true
     */
    static is (a) { return IO.prototype.isPrototypeOf(a); }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:futils/monads/io.IO
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     * let one_b = IO.of(1);
     * let two = IO.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return IO.prototype.isPrototypeOf(b) &&
               this.run === b.run;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/io.IO
     * @param {function} f Function to map with
     * @return {IO} New instance of the Functor
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> IO(2)
     */
    map (f) {
        if (type.isFunc(f)) {
            return new IO(comp(f, this.run));
        }
        throw 'IO::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a Identity wrapping the given value `a`. Use
     *     `.of` instead of the constructor
     * @method of
     * @memberof module:futils/monads/io.IO
     * @static
     * @param {any} a Any value
     * @return {IO} New instance of the Applicative
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     *
     * one.run(); // -> 1
     */
    static of (a) { return new IO(() => a); }
    of (a) { return IO.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/io.IO
     * @param {Functor} m Functor to apply the Applicative to
     * @return {IO} New instance of the Functor
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     *
     * const aInc = IO.of((a) => a + 1);
     *
     * aInc.ap(one); // -> IO(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.run);
        }
        throw 'IO::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/io.IO
     * @param {function} f Function returning a monad
     * @return {IO} New instance of the calling monads type
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(1);
     *
     * const mInc = (n) => IO.of(n + 1);
     *
     * one.flatMap(mInc); // -> IO(2);
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).run();
        }
        throw 'IO::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:futils/monads/io.IO
     * @return {IO} New instance of the monad
     *
     * @example
     * const {IO} = require('futils');
     *
     * let one = IO.of(IO.of(1));
     *
     * one.flatten(); // -> IO(1)
     */
    flatten () {
        return this.run();
    }

    fold (f) {
        return f(this.run());
    }

    // -- Semigroup
    // concat

    // -- Monoid
    // empty
}