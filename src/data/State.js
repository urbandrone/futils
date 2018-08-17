/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {Type} from '../adt';




/**
 * Grants access to the State data structure, which is used to describe computations
 * with intermediate state
 * @module data/State
 * @requires adt
 */







/**
 * The State data structure
 * @class module:data/State.State
 * @version 3.0.0
 *
 * @example
 * const {State, StateResult} = require('futils/data');
 *
 * const state = State((s) => StateResult(1, s));
 *
 * state.run(0);           // -> 1
 * state.exec(0);          // -> 0
 * state.compute(0).value; // -> 1
 * state.compute(0).state; // -> 0
 */
export const State = Type('State', ['compute']);
/**
 * A wrapper for a stateful computations result value and state. Every computation
 * of a State data structure should return a StateResult. This is only needed,
 * if one wants to create State structures from scratch
 * @class module:data/State.StateResult
 * @version 3.0.0
 */
export const StateResult = Type('State.Result', ['value', 'state']);



/**
 * Lifts a value into a State
 * @method of
 * @static
 * @memberOf module:data/State.State
 * @param {any} a The value to lift
 * @return {State} A new State structure
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.of(1);
 *
 * state.run(0);  // -> 1
 * state.exec(0); // -> 0
 */
State.of = (a) => State((s) => StateResult(a, s));
/**
 * Returns a State which drops intermediate values and copies the intermediate
 * state as the value and the state of the computation
 * @method get
 * @static
 * @memberOf module:data/State.State
 * @return {State} A new State with the intermediate state copied to the value
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.get();
 *
 * state.run(0);  // -> 0
 * state.exec(0); // -> 0
 */
State.get = () => State((s) => StateResult(s, s));
/**
 * Puts whatever is given as the new intermediate state, replacing the current
 * value with null and dropping the current intermediate state
 * @method put
 * @static
 * @memberOf module:data/State.State
 * @param {any} s Whatever should be the new intermediate state
 * @return {State} A new State
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.put(1);
 *
 * state.run(0);  // -> null
 * state.exec(0); // -> 1
 */
State.put = (s) => State(() => StateResult(null, s));
/**
 * If given a function, uses the function to modify the intermediate state and
 * drops the current value
 * @method modify
 * @static
 * @memberOf module:data/State.State
 * @param {Function} f A function which returns a new intermediate state from the current one
 * @return {State} A new State
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.modify((n) => n + 1);
 *
 * state.run(0);  // -> null
 * state.exec(0); // -> 1
 */
State.modify = (f) => State.get().flatMap((s) => State.put(f(s)));



/**
 * Maps a function over the current value of a State
 * @method map
 * @memberOf module:data/State.State
 * @param {Function} f The function to map
 * @return {State} A new State
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.of(1);
 * 
 * const inc = (n) => n + 1;
 *
 * state.map(inc); // -> State(2, ?)
 */
State.prototype.map = function (f) {
    return State((s) => {
        let {value, state} = this.compute(s);
        return StateResult(f(value), state);
    });
}
/**
 * Flattens a nested State one level
 * @method flat
 * @memberOf module:data/State.State
 * @return {State} A new State
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.of(State.of(1));
 *
 * state.flat();  // -> State(1, ?)
 */
State.prototype.flat = function () {
    return State((s) => {
        let {value, state} = this.compute(s);
        return value.compute(state);
    });
}
/**
 * Maps a State returning function over a State and flattens the result
 * @method flatMap
 * @memberOf module:data/State.State
 * @param {Function} f A State returning function to map
 * @return {State} A new State
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.of(1);
 *
 * const inc = (n) => State.of(n + 1);
 *
 * state.flatMap(inc); // -> State(2, ?)
 */
State.prototype.flatMap = function (f) {
    return this.map(f).flat();
}
/**
 * Applies a function as the current value of a State to a value in another State
 * @method ap
 * @memberOf module:data/State.State
 * @param {State} a The State which has the current value
 * @return {State} State which contains the result of applying the function
 *
 * @example
 * const {State} = require('futils/data');
 *
 * const state = State.of(1);
 *
 * const mInc = State.of((n) => n + 1);
 *
 * mInc.ap(state); // -> State(2, ?)
 */
State.prototype.ap = function (a) {
    return this.flatMap(a.map.bind(a));
}
/**
 * Given an initial state, computes the final value and returns it
 * @method run
 * @memberOf module:data/State.State
 * @param {any} s The initial state
 * @return {any} The final value of the computation
 *
 * @example
 * const {State} = require('futils/data');
 *
 * State.of(1).run(0); // -> 1
 */
State.prototype.run = function (s) {
    return this.compute(s).value;
}
/**
 * Given an initial state, computes the final state and returns it
 * @method exec
 * @memberOf module:data/State.State
 * @param {any} s The initial state
 * @return {any} The final state of the computation
 *
 * @example
 * const {State} = require('futils/data');
 *
 * State.of(1).run(0); // -> 0
 */
State.prototype.exec = function (s) {
    return this.compute(s).state;
}