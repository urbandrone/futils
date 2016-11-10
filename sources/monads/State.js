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
    constructor (a, b) { this.value = a; this.previous = b; }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    set previous (a) { this[OV] = a; }
    get previous () { return this[OV] || null; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/state.State
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(1);
     *
     * one.toString(); // -> "State(1)"
     */
    toString () { return `State(${this.value})`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/state.State
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {State} = require('futils');
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
     * const {State} = require('futils');
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
               b.value === this.value;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/state.State
     * @param {function} f Function to map with
     * @return {State} New instance of the Functor
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> State(2)
     */
    map (f) {
        if (type.isFunc(f)) {
            return new State(f(this.value), this.value);
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
     * const {State} = require('futils');
     *
     * let one = State.of(1);
     *
     * one.value; // -> 1
     */
    static of (a) { return new State(a, null); }
    of (a) { return State.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/state.State
     * @param {Functor} m Functor to apply the Applicative to
     * @return {State} New instance of the Functor
     *
     * @example
     * const {State, Identity} = require('futils');
     *
     * let one = State.of(1);
     *
     * const aInc = Identity.of((a) => a + 1);
     *
     * aInc.ap(one); // -> State(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.value);
        }
        throw 'State::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/state.State
     * @param {function} f Function returning a monad
     * @return {State} New instance of the calling monads type
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(1);
     *
     * const mInc = (n) => State.of(n + 1);
     *
     * one.flatMap(mInc); // -> State(2);
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).value;
        }
        throw 'State::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:futils/monads/state.State
     * @return {State} New instance of the monad
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(State.of(1));
     *
     * one.flatten(); // -> State(1)
     */
    flatten () {
        return this.value;
    }

    /**
     * Given a function, folds the instance with it
     * @method fold
     * @param {function} f Function handling the value
     * @return {any} Whatever f returns
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(1);
     *
     * one.fold((v) => v); // -> 1
     * 
     */
    fold (f) {
        return f(this.value);
    }

    /**
     * Returns the unit of a State
     * @method empty
     * @return {State} A new empty State
     *
     * @example
     * const {State, id} = require('futils');
     *
     * State.of(1).concat(State.empty()).fold(id); // -> 1
     * State.empty().concat(State.of(1)).fold(id); // -> 1
     */
    static empty () {
        return new State(null, null);
    }

    // -- Semigroup
    /**
     * Concatenates this State with another State
     * @method concat
     * @memberof module:futils/monads/state.State
     * @param {State} semi Other State
     * @return {State} A new State
     *
     * @example
     * const {State, id} = require('futils');
     *
     * let current = State.of(1280);
     *
     * const winSize = () => current.concat(State.of(1600));
     *
     * let state = winSize();
     * state.fold(id); // -> 1600
     * state.previous.fold(id); // -> 1280
     */
    concat (semi) {
        let s = semi.value === null ? [this.value, semi] : [semi.value, this];
        return new State(...s);
    }
}