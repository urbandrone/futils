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


/**
 * The State monad class
 * @class module:futils/monads/state.State
 * @version 2.2.0
 */
export default class State {
    constructor (a) {
        this.compute = a;
    }
    
    set compute (a) { this[MV] = a; }
    get compute () { return this[MV]; }

    /**
     * Returns a new State which grabs whatever is the current state
     * @method get 
     * @memberof module:futils/monads/state.State
     * @static
     * @version 2.2.0
     * @return {State} New empty State
     *
     * @example
     * const {State} = require('futils');
     *
     * const prog = State.get().map((n) => n + 1).
     *                          map((n) => `The final value is: ${n}`);
     *
     * prog.run(2); // -> 'The final value is: 3'
     */
    static get () { return new State((s) => [s, s]); }

    /**
     * Returns a completely new State without a value
     * @method put
     * @memberof module:futils/monads/state.State
     * @static
     * @version 2.2.0
     * @param {any} s The initial state
     * @return {State} A new State
     *
     * @example
     * const {State} = require('futils');
     *
     * const prog = State.get().flatMap((s) => State.put(n + 1));
     *
     * prog.exec(1); // -> 2
     */
    static put (s) { return new State(() => [null, s]); }

    /**
     * Given a function, manipulates the current state and returns a new
     *     state without a value
     * @method modify
     * @memberof module:futils/monads/state.State
     * @static
     * @version 2.2.0
     * @param {function} f Function to manipulate the state with
     * @return {State} A new State
     *
     * @example
     * const {State} = require('futils');
     *
     * const prog = State.modify((s) => s + 1);
     *
     * prog.exec(1); // -> 2
     */
    static modify (f) { return State.get().flatMap((s) => State.put(f(s))); }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @version 2.2.0
     * @memberof module:futils/monads/state.State
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(1);
     *
     * one.toString(); // -> "State"
     */
    toString () { return `State`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/state.State
     * @static
     * @version 2.2.0
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
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/state.State
     * @version 2.2.0
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
            return new State((b) => {
                let r = this.compute(b);
                return [f(r[0]), r[1]];
            });
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
     * @version 2.2.0
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
    static of (a) { return new State((b) => [a, b]); }
    of (a) { return State.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/state.State
     * @version 2.2.0
     * @param {Functor} m Functor to apply the Applicative to
     * @return {State} New instance of the Functor
     *
     * @example
     * const {State, Identity} = require('futils');
     *
     * let one = Identity.of(1);
     *
     * const aInc = State.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Identity(2)
     */
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map((a) => this.run()(a));
        }
        throw 'State::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/state.State
     * @version 2.2.0
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
            return new State((b) => {
                let r = this.compute(b);
                return f(r[0]).compute(r[1]);
            });
        }
        throw 'State::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner run
     * @method flatten
     * @memberof module:futils/monads/state.State
     * @version 2.2.0
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
        return new State((b) => {
            let r = this.compute(b);
            return r[0].compute(r[1]);
        });
    }

    fold (f, x) {
        return f(this.run(x));
    }

    /**
     * Runs the computation and returns the final value
     * @method run
     * @memberof module:futils/monads/state.State
     * @version 2.2.0
     * @param {any} s Initial value
     * @return {any} Value of the final computation
     *
     * @example
     * const {State} = require('futils');
     *
     * const nums = [1, 2, 3, 4, 5];
     *
     * const add = (xs) => {
     *     if (xs.length < 1) { return State.get().flatMap(State.of); }
     *     return State.get().flatMap((sum) => {
     *         return State.put(sum + xs[0]).flatMap(() => add(xs.slice(1)));
     *     });
     * }
     *
     * add(nums).run(0); // -> 15
     */
    run (s) {
        return this.compute(s)[0];
    }

    /**
     * Runs the computation and returns the final state. Usually one uses 'run'
     *     and discards the intermediate state but in some cases it is useful
     *     to return the final state instead of the final value
     * @method exec
     * @memberof module:futils/monads/state.State
     * @version 2.2.0
     * @param {any} s Initial value
     * @return {any} Final state of the computation
     *
     * @example
     * const {State} = require('futils');
     *
     * const nums = [1, 2, 3, 4, 5];
     *
     * const add = (xs) => {
     *     if (xs.length < 1) { return State.get().flatMap(State.of); }
     *     return State.get().flatMap((sum) => {
     *         return State.put(sum + xs[0]).flatMap(() => add(xs.slice(1)));
     *     });
     * }
     *
     * add(nums).exec(0); // -> 15
     */
    exec (s) {
        return this.compute(s)[1];
    }
}