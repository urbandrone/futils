/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/* globals setImmediate, process, setTimeout */
import type from '../types';

/**
 * Implementation of the Task monad
 * @module futils/monads/task
 * @requires futils/types
 */



const RUN_PROG = Symbol('MonadicFork');
const CLEANUP = Symbol('MonadicCleanUp')


const delay = type.isFunc(setImmediate) ? (f) => setImmediate(f) :
              !type.isVoid(process) ? (f) => process.nextTick(f) :
              (f) => setTimeout(f, 0);

const ofVoid = () => void 0;



/**
 * The Task monad class
 * @class module:futils/monads/task.Task
 * @version 2.0.0
 */
export default class Task {
    constructor (a, b) { this.fork = a; this.cleanUp = b; }
    set fork (a) { this[RUN_PROG] = a; }
    get fork () { return this[RUN_PROG]; }
    set cleanUp (a) { this[CLEANUP] = a || ofVoid }
    get cleanUp () { return this[CLEANUP]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/task.Task
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     *
     * one.toString(); // -> "Task"
     */
    toString () { return `Task`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/task.Task
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     *
     * Task.is(one); // -> true
     */
    static is (a) { return Task.prototype.isPrototypeOf(a); }

    /**
     * Returns a Task which resolves to the given value
     * @method resolve
     * @memberof module:futils/monads/task.Task
     * @static
     * @param {any} a Value to resolve to
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     *
     * one.fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 1"
     */
    static resolve (a) { return Task.of((rej, res) => res(a)); }

    /**
     * Returns a Task which rejects the given value
     * @method reject
     * @memberof module:futils/monads/task.Task
     * @static
     * @param {any} a Value to resolve to
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.reject(1);
     *
     * one.fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Rejected: 1"
     */
    static reject (a) { return Task.of((rej) => rej(a)); }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:futils/monads/task.Task
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let one_b = Task.resolve(1);
     * let two = Task.resolve(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Task.prototype.isPrototypeOf(b) &&
               b.fork === this.fork &&
               b.cleanUp === this.cleanUp;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/task.Task
     * @param {function} f Function to map with
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 2"
     */
    map (f) {
        if (type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fork(
                    (mv) => rej(mv),
                    (mv) => res(f(mv))
                ),
                this.cleanUp
            );
        }
        throw 'Task::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    /**
     * Creates a new instance of a Task. Use `.of` instead of the constructor 
     * @method of
     * @memberof module:futils/monads/task.Task
     * @static
     * @param {any} a Any value
     * @return {Task} New instance of the Applicative
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.of((rej, res) => res(1));
     *
     * one.fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 1"
     */
    static of (a, b) { return new Task(a, b); }
    of (a) { return Task.of(a, this.cleanUp); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/task.Task
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Functor} New instance of the Functor
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     *
     * const aInc = Task.resolve((a) => a + 1);
     *
     * aInc.ap(one).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolve: ' + n)
     * );
     *
     * // logs "Resolved: 2"
     */
    ap (m) {
        let meFork = this.fork, themFork = m.fork,
            meClean = this.cleanUp, themClean = m.cleanUp;

        const cleanBoth = ([a, b]) => {
            meClean(a);
            themClean(b);
        }

        return Task.of(
            (rej, res) => {
                let f = false, fload = false, v = false, vload = false;
                let states = [], rejected = false;

                const guardRej = (mv) => {
                    if (!rejected) {
                        rejected = true;
                        return rej(mv);
                    }
                }

                const guardRes = (set) => (mv) => {
                    if (rejected) { return; }
                    set(mv);
                    if (vload && fload) {
                        delay(() => cleanBoth(states));
                        return res(f(v));
                    } else {
                        return mv;
                    }
                }

                let state = meFork(guardRej, guardRes((a) => {
                    fload = true; f = a;
                }));
                let mstate = themFork(guardRej, guardRes((b) => {
                    vload = true; v = b;
                }));

                states = [state, mstate];
                return states;
            },
            cleanBoth
        );
    }

    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/task.Task
     * @param {function} f Function returning a monad
     * @return {Monad} New instance of the calling monads type
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     *
     * const mInc = (n) => Task.resolve(1).map((m) => n + m);
     *
     * one.flatMap(mInc).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 2"
     */
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'Task::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:futils/monads/task.Task
     * @return {Monad} New instance of the monad
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(Task.resolve(1));
     *
     * one.flatten().fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 1"
     */
    flatten () {
        return Task.of((rej, res) => {
            return this.fork.fork(rej, res);
        }, this.cleanUp);
    }
    // -- Foldable
    // reduce
    
    // -- ?
    /**
     * Given two functions, folds the first over the instance if it rejects the
     *     Task and the second over the instance if it resolves the Task
     * @method fold
     * @memberof module:futils/monads/task.Task
     * @param {function} f Function handling the None case
     * @param {function} g Function handling the Some case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let nothing = Task.reject(null);
     *
     * const fail = () => 'No int';
     * const success = (n) => `Given ${n}!`;
     *
     * one.fold(fail, success).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: Given 1!"
     * 
     * none.fold(fail, success).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: No int"
     */
    fold (f, g) {
        if (type.isFunc(g) && type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fork(
                    (r) => rej(f(r)),
                    (v) => res(g(v))
                ),
                this.cleanUp
            );
        }
        throw 'Task::fold expects arguments to be functions but saw ' + [f, g];
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `Reject` and
     *     `Resolve` fields pipes the current value through the corresponding
     *     function
     * @method cata   
     * @memberof module:futils/monads/task.Task
     * @param {object} o Object with `Reject` and `Resolve`
     * @return {any} Result of applying the functions to the current value
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let nothing = Task.reject(null);
     *
     * one.cata({
     *     Reject: () => 'Nothing found',
     *     Resolve: (n) => 'Found number of ' + n
     * }).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: Found number of 1"
     *
     * nothing.cata({
     *     Reject: () => 'Nothing found',
     *     Resolve: (n) => 'Found number of ' + n
     * }).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: Nothing found"
     */
    cata ({Reject, Resolve}) {
        if (type.isFunc(Resolve) && type.isFunc(Reject)) {
            return this.fold(Reject, Resolve);
        }
        throw 'Task::cata expected Object of {Reject, Resolve}'; 
    }

    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it reflects None
     *     and the second if it reflects Some. Wraps the result into a new
     *     Bifunctor of the same type before returning
     * @method biMap   
     * @memberof module:futils/monads/task.Task 
     * @param {function} f Function to map if None
     * @param {function} g Function to map if Some
     * @return {Bifunctor} Result in a new container
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let nothing = Task.reject(null);
     *
     * one.biMap(
     *     () => 'Nothing found',
     *     (n) => 'Found number of ' + n
     * ).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: Found number of 1"
     *
     * nothing.biMap(
     *     () => 'Nothing found',
     *     (n) => 'Found number of ' + n
     * ).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: Nothing found"
     */
    biMap (f, g) {
        if (type.isFunc(g) && type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fold(rej, res),
                this.cleanUp
            );
        }
        throw 'Task::biMap expected arguments to be functions but saw ' + [f, g];
    }

    /**
     * Swaps the disjunction and rejects a otherwise resolving Task and
     *     vice versa
     * @method swap
     * @memberof module:futils/monads/either.Right
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let none = Task.reject(null);
     *
     * one.swap().fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: 1"
     * 
     * none.swap().fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: null"
     */
    swap () {
        return Task.of(
            (rej, res) => this.fork(res, rej),
            this.cleanUp
        );
    }

    /**
     * Given a function, maps it if the instance gets rejected
     * @method mapRejected   
     * @memberof module:futils/monads/either.Right
     * @param {function} f Function to map
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let none = Task.reject(null);
     *
     * const nullToZero = (x) => typeof x !== 'number' ? 0 : x;
     *
     * one.mapRejected(nullToZero).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 1"
     * 
     * none.mapRejected(nullToZero).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: 0"
     */
    mapRejected (f) {
        if (type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fork((a) => rej(f(a)), res),
                this.cleanUp
            );
        }
    }
    // -- Traversable
    // -- Monoid
    /**
     * Returns a Task that never rejects and never resolves
     * @method empty
     * @memberof module:futils/monads/task.Task
     * @static
     * @return {Monoid} A monoid of the same type
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * Task.empty(); // -> Task which never does anything
     */
    static empty () { return Task.of(() => void 0); }

    // -- Semigroup
    /**
     * Concats the instance with another one and selects the one which first
     *     completes
     * @method concat
     * @memberof module:futils/monads/task.Task
     * @param {Task} m Another Task
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils').monads;
     *
     * let one = Task.resolve(1);
     * let idle = Task.empty();
     *
     * one.concat(idle).fork(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 1"
     */
    concat (m) {
        if (Task.is(m)) {
            let meFork = this.fork, themFork = m.fork,
                meClean = this.cleanUp, themClean = m.cleanUp;

            const cleanBoth = ([a, b]) => {
                meClean(a);
                themClean(b);
            }

            return Task.of(
                (rej, res) => {
                    let states, done = false;
                    let state, mstate;

                    const guard = (f) => (mv) => {
                        if (!done) {
                            done = true;
                            delay(() => cleanBoth(state));
                            f(mv);
                        }
                    }

                    state = meFork(guard(rej), guard(res));
                    mstate = themFork(guard(rej), guard(res));
                    states = [state, mstate];
                    return states;
                },
                cleanBoth
            )
        }
        throw 'Task::concat expected argument to be Task but saw ' + m;
    }
    // -- Recovering
    orElse (f) {
        if (type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fork((a) => f(a).fork(rej, res), res),
                this.cleanUp
            );            
        }
        throw 'Task::orElse expected argument to be function but saw ' + f;
    }
}