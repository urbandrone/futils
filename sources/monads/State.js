/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isFunc} from '../types';

/**
 * Implementation of the State monad
 * @module monads/State
 * @requires types
 */


const MV = Symbol('MonadicValue');
const runState = Symbol('RunState');


/**
 * The State monad class allows to define operations which manipulate some state
 *   and produce intermediate states in between operations which are the basis
 *   for the next operation.
 * @class module:monads/state.State
 * @version 2.2.0
 */
export class State {
    constructor (a) {
        this.compute = a;
    }
    
    set compute (a) { this[MV] = a; }
    get compute () { return this[MV]; }

    [runState](s) {
        return this.compute(s);
    }

    /**
     * Returns a new State which grabs whatever is the current state
     * @method get 
     * @memberof module:monads/state.State
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
     * @memberof module:monads/state.State
     * @static
     * @version 2.2.0
     * @param {any} s The initial state
     * @return {State} A new State
     *
     * @example
     * const {State} = require('futils');
     *
     * const prog = State.get().
     *     flatMap((s) => State.put(s + 1));
     *
     * prog.exec(1); // -> 2
     */
    static put (s) { return new State(() => [null, s]); }

    /**
     * Given a function, manipulates the current state and returns a new
     *     state without a value
     * @method modify
     * @memberof module:monads/state.State
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
    static modify (f) { return State.get().flatMap((a) => State.put(f(a))); }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @version 2.2.0
     * @memberof module:monads/state.State
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
     * @memberof module:monads/state.State
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

    /**
     * Converts instances of the Identity monad into instances of the State monad
     *     by settings the value inside the Identity as current value of the
     *     resulting State monad
     * @method fromIdentity
     * @memberOf module:monads/state.State
     * @static
     * @param {Identity} m The Identity monad instance
     * @return {State} State monad instance
     *
     * @example
     * const {Identity, State} = require('futils');
     *
     * const id = Identity.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * State.fromIdentity(id).map(inc).run(1); // -> 3
     */
    static fromIdentity (m) {
        return m.fold(State.of);
    }

    /**
     * Converts instances of the Maybe monad into instances of the State monad.
     *     If given a Maybe.None, returns a blank State via State.get()
     * @method fromMaybe
     * @memberOf module:monads/state.State
     * @static
     * @param {None|Some} m Maybe monad instance
     * @return {State} State monad instance
     *
     * @example
     * const {Maybe, State} = require('futils');
     *
     * const none = Maybe.None();
     * const some = Maybe.Some(1);
     *
     * const inc = (a) => a + 1;
     *
     * State.fromMaybe(some).map(inc).run(1); // -> 3
     * State.fromMaybe(none).map(inc).run(1); // -> 2
     */
    static fromMaybe (m) {
        return m.fold(State.get, State.of);
    }

    /**
     * Converts instances of the Either monad into instances of the State monad.
     *     If given a Either.Left, returns a blank State via State.get()
     * @method fromEither
     * @memberOf module:monads/state.State
     * @static
     * @param {Left|Right} m Either monad instance
     * @return {State} State monad instance
     *
     * @example
     * const {Either, State} = require('futils');
     *
     * const left = Either.Left(1);
     * const right = Either.Right(1);
     *
     * const inc = (a) => a + 1;
     *
     * State.fromEither(right).map(inc).run(1); // -> 3
     * State.fromEither(left).map(inc).run(1); // -> 2
     */
    static fromEither (m) {
        return m.fold(State.get, State.of);
    }

    /**
     * Converts instances of the IO monad into instances of the State monad
     * @method fromIO
     * @memberOf module:monads/state.State
     * @static
     * @param {IO} m IO monad instance
     * @return {State} State monad instance
     *
     * @example
     * const {IO, State} = require('futils');
     *
     * const io = IO.of(1);
     * const ioInc = new IO((a) => a + 1);
     *
     * State.fromIO(io).run(); // -> 1
     * State.fromIO(ioInc).run(1); // -> 2
     */
    static fromIO (m) {
        return State.get().map((a) => m.try(a));
    }

    // -- Setoid 
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:monads/state.State
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
     * one.map(inc).run(); // -> 2
     */
    map (f) {
        if (isFunc(f)) {
            return new State((s) => {
                let [a, s2] = this[runState](s);
                return [f(a), s2];
            });
        }
        throw 'State::map expects argument to be function but saw ' + f;
    }

    // -- Applicative
    /**
     * Creates a new instance of a State wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:monads/state.State
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
     * one.run(); // -> 1
     */
    static of (a) { return new State((s) => [a, s]); }
    of (a) { return State.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:monads/state.State
     * @version 2.2.0
     * @param {Functor} m Functor to apply the Applicative to
     * @return {State} New instance of the Functor
     *
     * @example
     * const {State} = require('futils');
     *
     * let div2 = State.of((a) => a / 2);
     *
     * const aInc = State.get().map((a) => a + 1);
     *
     * div2.ap(aInc).run(2); // -> 1.5;
     */
    ap (m) {
        if (isFunc(m.map)) {
            return this.flatMap(m.map.bind(m));
        }
        throw 'State::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:monads/state.State
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
     * one.flatMap(mInc).run(); // -> 2;
     */
    flatMap (f) {
        if (isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'State::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner run
     * @method flatten
     * @memberof module:monads/state.State
     * @version 2.2.0
     * @return {State} New instance of the monad
     *
     * @example
     * const {State} = require('futils');
     *
     * let one = State.of(State.of(1));
     *
     * one.flatten().run(); // -> 1
     */
    flatten () {
        return new State((s) => {
            let [m, s2] = this[runState](s);
            return m[runState](s2);
        });
    }

    /**
     * Runs the computation and passes the result to the given function
     * @method fold
     * @memberof module:monads/state.State
     * @param {function} f Function the result is passed into
     * @param {any} x The seed value to compute the result from
     * @return {any} The final state passed through the function
     *
     * @example
     * const {State} = require('futils');
     *
     * const inc = State.get().map((n) => n + 1);
     *
     * inc.fold((x) => x, 1); // -> 2
     */
    fold (f, x) {
        return f(this.run(x));
    }

    /**
     * Runs the computation and passes the final state to the given function
     * @method foldExec
     * @memberof module:monads/state.State
     * @param {function} f Function the state is passed into
     * @param {any} x The seed state to compute the result from
     * @return {any} The final state passed through the function
     *
     * @example
     * const {State} = require('futils');
     *
     * const inc = State.get().map((n) => n + 1);
     *
     * inc.foldExec((x) => x, 1); // -> 1
     */
    foldExec (f, x) {
        return f(this.exec(x));
    }

    /**
     * Runs the computation and returns the final value
     * @method run
     * @memberof module:monads/state.State
     * @version 2.2.0
     * @param {any} s Initial value
     * @return {any} Value of the final computation
     *
     * @example
     * const {State} = require('futils');
     *
     * const push = (a) => new State((s) => [null, [...s, a]]);
     * const shift = () => new State((s) => [s[0], s.slice(1)]);
     *
     * const prog = State.get().
     *   flatMap(shift).
     *   flatMap(push).
     *   flatMap(shift);
     *
     * prog.run([1, 2, 3]); // -> 2
     */
    run (s) {
        return this[runState](s)[0];
    }

    /**
     * Runs the computation and returns the final state. Usually one uses 'run'
     *     and discards the intermediate state but in some cases it is useful
     *     to return the final state instead of the final value
     * @method exec
     * @memberof module:monads/state.State
     * @version 2.2.0
     * @param {any} s Initial value
     * @return {any} Final state of the computation
     *
     * @example
     * const {State} = require('futils');
     *
     * const push = (a) => new State((s) => [null, [...s, a]]);
     * const shift = () => new State((s) => [s[0], s.slice(1)]);
     *
     * const prog = State.get().
     *   flatMap(shift).
     *   flatMap(push).
     *   flatMap(shift);
     *
     * prog.exec([1, 2, 3]); // -> [3, 1]
     */
    exec (s) {
        return this[runState](s)[1];
    }
}