/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';

/**
 * Implementation of the State monad
 * @module futils/monads/state
 * @requires futils/types
 */


const MV = Symbol('MonadicValue');
const OV = Symbol('OldMonadicValue');


/**
 * The State monad class
 * @class module:futils/monads/state.State
 * @version 2.0.0
 */
export default class State {
    constructor (a, b) { this.mvalue = a; this.mbefore = b; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }
    set mbefore (a) { this[OV] = a; }
    get mbefore () { return this[OV] || null; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/state.State
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(1);
     *
     * one.toString(); // -> "State(1, null)"
     */
    toString () { return `State(${this.mvalue}, ${this.mbefore})`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/state.State
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(1);
     *
     * State.is(one); // -> true
     */
    static is (a) { return State.prototype.isPrototypeOf(a); }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:futils/monads/state.State
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(1);
     * let one_b = State.of(1);
     * let two = State.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return State.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue &&
               b.mbefore === this.mbefore;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/state.State
     * @param {function} f Function to map with
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> State(2)
     * one.map(inc).toString(); // -> State(2, 1)
     */
    map (f) {
        if (type.isFunc(f)) {
            return State.of(f(this.mvalue), this.mvalue);
        }
        throw 'State::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a State wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:futils/monads/state.State
     * @static
     * @param {any} a Any value
     * @return {State} New instance of the Applicative
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(1);
     *
     * one.mvalue; // -> 1
     */
    static of (a, b) { return State.is(a) ? a : new State(a, b); }
    of (a, b) { return State.of(a, b); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/state.State
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {State, Identity} = require('futils').monads;
     *
     * let one = State.of(1);
     *
     * const aInc = Identity.of((a) => a + 1);
     *
     * aInc.ap(one); // -> State(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'State::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/state.State
     * @param {function} f Function returning a monad
     * @return {Monad} New instance of the calling monads type
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(1);
     *
     * const mInc = (n) => State.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> State(2);
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'State::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:futils/monads/state.State
     * @return {Monad} New instance of the monad
     *
     * @example
     * const {State} = require('futils').monads;
     *
     * let one = State.of(State.of(1));
     *
     * one.flatten(); // -> State(1)
     */
    flatten () {
        return State.of(this.mvalue.mvalue, this.mvalue.mbefore);
    }
    // -- Foldable
    // reduce
}