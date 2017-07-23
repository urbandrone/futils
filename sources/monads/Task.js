/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/* globals setImmediate, process, setTimeout */
import {isVoid, isFunc} from '../types';

/**
 * Implementation of the Task monad
 * @module monads/Task
 * @requires types
 */



const RUN_PROG = Symbol('MonadicFork');
const CLEANUP = Symbol('MonadicCleanUp')


const delay = (f) => typeof setImmediate !== 'undefined' ? setImmediate(f) :
              typeof process !== 'undefined' ? process.nextTick(f) :
              setTimeout(f, 0);

const ofVoid = () => void 0;



/**
 * The Task monad class
 * @class module:monads/task.Task
 * @version 2.0.0
 */
export class Task {
    constructor (a, b) {
        this.run = a;
        this.cleanUp = b;
    }
    set run (a) { this[RUN_PROG] = a; }
    get run () { return this[RUN_PROG]; }
    set cleanUp (a) { this[CLEANUP] = a || ofVoid }
    get cleanUp () { return this[CLEANUP]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:monads/task.Task
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     *
     * one.toString(); // -> "Task"
     */
    toString () { return `Task`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:monads/task.Task
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     *
     * Task.is(one); // -> true
     */
    static is (a) { return Task.prototype.isPrototypeOf(a); }

    /**
     * Returns a Task which resolves to the given value
     * @method resolve
     * @memberof module:monads/task.Task
     * @static
     * @param {any} a Value to resolve to
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     *
     * one.run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 1"
     */
    static resolve (a) { return new Task((_, res) => res(a)); }

    /**
     * Returns a Task which rejects the given value
     * @method reject
     * @memberof module:monads/task.Task
     * @static
     * @param {any} a Value to resolve to
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.reject(1);
     *
     * one.run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Rejected: 1"
     */
    static reject (a) { return new Task((rej) => rej(a)); }

    /**
     * Create a Task from a callback function. If the callback throws a error
     * for any reason, that error is caught automatically and propagates along
     * the error chain. This method is curried
     * @method fromFunction
     * @memberof module:monads/task.Task
     * @static
     * @param {function} f The callback accepting function to use
     * @param {any} [...args] Arguments to pass to the function when called
     * @return {Task} A new Task
     *
     * @example
     * const {Task, IO, pipe} = require('futils');
     *
     * const log = console.log.bind(console);
     * const err = console.error.bind(console);
     *
     * const sidefx = (f) => (x) => { f(x); return x; }
     *
     * const noEvt = sidefx((e) => e.preventDefault());
     *
     *
     * // -- the async stuff
     * const delayedTick = (res, n) => setTimeout(() =>res(n), n);
     *
     * const get = Task.fromFunction(delayedTick, 500).
     *    map((n) => `I appeared ${n} milliseconds later`;);
     * 
     *
     * // -- usage example
     * const emit = get.run.bind(get, err, log);
     *
     * const ioWriteClick = new IO(pipe(noEvt, (e) => e.target)).
     *     map(sidefx((node) => node.innerHTML += '<hr><br>I appear on click!<br>')).
     *     map(sidefx(emit));
     *
     * node.addEventListener('click', ioWriteClick.run, false);
     *
     * // logs "I appeared 500 milliseconds later" around 500 ms after a click
     */
    static fromFunction (f, ...args) {
        if (args.length < f.length - 1) {
            return (..._args) => Task.fromFunction(f, ...args, ..._args);
        }
        return new Task((rej, res) => {
            try {
                f(res, ...args);
            } catch (exc) {
                rej(exc);
            }
        });
    }

    /**
     * Create a Task from a Node JS style callback function. This method is curried
     * @method fromNodeCPS
     * @memberof module:monads/task.Task
     * @static
     * @param {function} f The CPS callback function to use
     * @param {any} [...args] Arguments to pass to the function when called
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     * const fs = require('fs');
     * 
     * const readFile = Task.fromNodeCPS(fs.readFile.bind(fs));
     * 
     * readFile('path/to/file.txt', 'utf8').
     *     map(( ... ) = > ... );
     */
    static fromNodeCPS (f, ...args) {
        if (args.length < f.length - 1) {
            return (..._args) => Task.fromNodeCPS(f, ...args, ..._args);
        }
        return new Task((rej, res) => {
            f(...args, (err, x) => {
                if (err) { rej(err); }
                else { res(x); }
            });
        });
    }

    /** 
     * Create a Task from a given Promise
     * @method fromPromise
     * @memberof module:monads/task.Task
     * @static
     * @param {Promise} p The promise object to wrap
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     * const fetch = require('node-fetch');
     *
     * const promiseReturningApi = (x) => fetch(`https://url?param=${x}`);
     *
     * Task.fromPromise(promiseReturningApi('superman')).
     *     map(( supermanJson ) => ... )
     *
     */
    static fromPromise (p) {
        return new Task((rej, res) => {
            p.then(res).catch(rej);
        });
    }

    /**
     * Takes a `Task` and transforms it into a promise. Optionally, a create
     *   function can be given which allows creation of different Promises from
     *   various libraries. This method is also implemented as a instance method
     *   with the same name
     * @method toPromise
     * @memberof module:monads/task.Task
     * @static
     * @param {Task} a The Task to transform
     * @param {function} [creator] Promise returning function
     * @return {Promise} A new Promise
     *
     * @example
     * const {Task, pipe} = require('futils');
     *
     * const randN = Task.
     *    fromFunction((rej, res) => res(Math.floor(Math.random() * 100)));
     *
     * const randNPromise = randN.flatMap(Task.toPromise);
     *
     * // Alternative to using Task.toPromise is using the instance method:
     * const randNPromise = randN.toPromise();
     * 
     * randNPromise.
     *     then( ... ).
     *     then( ... )
     */
    static toPromise (a, creator) {
        if (isFunc(creator)) {
            return creator((res, rej) => {
                a.run(rej, res);
            });
        }

        if (!isVoid(Promise) && isFunc(Promise)) {
            // if no creator given and possible then convert into native
            // promises
            return new Promise((res, rej) => {
                a.run(rej, res);
            });
        }

        throw `Cannot create Promise from ${a}`;
    }

    /* same as above, but implemented as instance method */
    toPromise (creator) {
        return Task.toPromise(this, creator);
    }

    /**
     * Takes N tasks and reduces them into a single Task which emits the
     * result of the Task that first returns from all given tasks
     * @method race
     * @memberof module:monads/task.Task
     * @static
     * @param {Task} ...tasks Two up to N Task instances
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     * 
     * const getUserAccInfo = ... // something returning a Task Error Http
     * const getLocalUserAcc = ... // something returning a Task Error IndexedDb
     *
     * const userInfo = Task.race(getUserAccInfo, getLocalUserAcc);
     *
     * // note: user will be result of either getUserAccInfo or getLocalUserAcc
     * //     and depends on which of both runs faster
     * userInfo.run(console.error, (user) => ... )
     */
    static race (...tasks) {
        return tasks.reduce((acc, t) => acc.concat(t), Task.empty());
    }

    /**
     * Takes N tasks and reduces them into a single Task which emits when all
     * given tasks are finished or either one of them fails. Please note, this
     * resolves into a array of all task results in order.
     * @method all
     * @memberof module:monads/task.Task
     * @static
     * @param {Task} ...tasks Two up to N Task instances
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     * 
     * const getUserAccInfo = ... // something returning a Task Error Http
     * const getLocalUserAcc = ... // something returning a Task Error IndexedDb
     *
     * const userInfo = Task.all(getUserAccInfo, getLocalUserAcc);
     *
     * // note: the success handler receives the arguments in the same order the
     * //       tasks have been given but packed into a array. this happens to
     * //       each function application, regardless of run(), map(), flatMap(),
     * //       etc.
     * userInfo.run(console.error, ([userAcc, userLocal]) => ... )
     */
    static all (...tasks) {
        return new Task((rej, res) => {
            let result = [];
            let missing = tasks.length;
            tasks.forEach((t, i) => {
                t.run(rej, (data) => {
                    result[i] = data;
                    missing -= 1;
                    if (missing < 1) {
                        res(result);
                    }
                });
            });
        });
    }

    // -- Setoid 
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:monads/task.Task
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let one_b = Task.resolve(1);
     * let two = Task.resolve(2);
     *
     * one.equals(one); // -> true
     * one.equals(one_b); // -> false
     * one.equals(two); // -> false
     */
    equals (b) {
        return Task.prototype.isPrototypeOf(b) && b.run === this.run;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:monads/task.Task
     * @param {function} f Function to map with
     * @return {Task} New instance of the Functor
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 2"
     */
    map (f) {
        if (isFunc(f)) {
            return new Task(
                (rej, res) => this.run(
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
     * @memberof module:monads/task.Task
     * @static
     * @param {any} a Any value
     * @return {Task} New instance of the Applicative
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.of((rej, res) => res(1));
     *
     * one.run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 1"
     */
    static of (a) { return new Task((rej, res) => res(a)); }
    of (a) { return Task.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:monads/task.Task
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Task} New instance of the Functor
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     *
     * const aInc = Task.resolve((a) => a + 1);
     *
     * aInc.ap(one).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolve: ' + n)
     * );
     *
     * // logs "Resolved: 2"
     */
    ap (m) {
        let meFork = this.run, themFork = m.run,
            meClean = this.cleanUp, themClean = m.cleanUp;

        const cleanBoth = (a, b) => {
            meClean(a);
            themClean(b);
        }

        return new Task(
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
                        delay(() => cleanBoth(states[0], states[1]));
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
     * @memberof module:monads/task.Task
     * @param {function} f Function returning a monad
     * @return {Task} New instance of the calling monads type
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     *
     * const mInc = (n) => Task.resolve(1).map((m) => n + m);
     *
     * one.flatMap(mInc).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 2"
     */
    flatMap (f) {
        if (isFunc(f)) {
            return new Task((rej, res) => {
                return this.run(
                    (a) => rej(a),
                    (b) => f(b).run(rej, res)
                );
            }, this.cleanUp);
        }
        throw 'Task::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten
     * @memberof module:monads/task.Task
     * @return {Task} New instance of the monad
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(Task.resolve(1));
     *
     * one.flatten().run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     *
     * // logs "Resolved: 1"
     */
    flatten () {
        return new Task((rej, res) => this.run().run(rej, res), this.cleanUp);
    }
    // -- Foldable
    // reduce
    
    // -- ?
    /**
     * Given two functions, folds the first over the instance if it rejects the
     *     Task and the second over the instance if it resolves the Task
     * @method fold
     * @memberof module:monads/task.Task
     * @param {function} f Function handling the a Failure case
     * @param {function} g Function handling the Success case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let nothing = Task.reject(null);
     *
     * one.fold(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 1"
     * 
     * none.fold(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: null"
     */
    fold (f, g) {
        if (isFunc(g) && isFunc(f)) {
            return this.run(f, g);
        }
        throw 'Task::fold expects arguments to be functions but saw ' + [f, g];
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `Reject` and
     *     `Resolve` fields pipes the current value through the corresponding
     *     function
     * @method cata   
     * @memberof module:monads/task.Task
     * @param {object} o Object with `Reject` and `Resolve`
     * @return {any} Result of applying the functions to the current value
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let nothing = Task.reject(null);
     *
     * one.cata({
     *     Reject: () => 'Nothing found',
     *     Resolve: (n) => 'Found number of ' + n
     * });
     * // "Found number of 1"
     *
     * nothing.cata({
     *     Reject: () => 'Nothing found',
     *     Resolve: (n) => 'Found number of ' + n
     * });
     * // "Nothing found"
     */
    cata ({Reject, Resolve}) {
        if (isFunc(Resolve) && isFunc(Reject)) {
            return this.fold(Reject, Resolve);
        }
        throw 'Task::cata expected Object of {Reject, Resolve}'; 
    }

    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it reflects a
     *     Failure and the second if it reflects Success. Wraps the result into
     *     a new Bifunctor of the same type before returning
     * @method biMap   
     * @memberof module:monads/task.Task 
     * @param {function} f Function to map if a Failure
     * @param {function} g Function to map if Success
     * @return {Task} Result in a new container
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let nothing = Task.reject(null);
     *
     * one.biMap(
     *     () => 'Nothing found',
     *     (n) => 'Found number of ' + n
     * ).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: Found number of 1"
     *
     * nothing.biMap(
     *     () => 'Nothing found',
     *     (n) => 'Found number of ' + n
     * ).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: Nothing found"
     */
    biMap (f, g) {
        if (isFunc(g) && isFunc(f)) {
            return new Task(
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
     * @memberof module:monads/task.Task
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let none = Task.reject(null);
     *
     * one.swap().run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: 1"
     * 
     * none.swap().run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: null"
     */
    swap () {
        return new Task(
            (rej, res) => this.run(res, rej),
            this.cleanUp
        );
    }

    /**
     * Given a function, maps it if the instance gets rejected
     * @method mapRejected   
     * @memberof module:monads/task.Task
     * @param {function} f Function to map
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let none = Task.reject(null);
     *
     * const nullToZero = (x) => typeof x !== 'number' ? 0 : x;
     *
     * one.mapRejected(nullToZero).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 1"
     * 
     * none.mapRejected(nullToZero).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Rejected: 0"
     */
    mapRejected (f) {
        if (isFunc(f)) {
            return new Task(
                (rej, res) => this.run((a) => rej(f(a)), res),
                this.cleanUp
            );
        }
    }
    // -- Traversable
    // -- Monoid
    /**
     * Returns a Task that never rejects and never resolves
     * @method empty
     * @memberof module:monads/task.Task
     * @static
     * @return {Task} A monoid of the same type
     *
     * @example
     * const {Task} = require('futils');
     *
     * Task.empty(); // -> Task which never does anything
     */
    static empty () { return new Task(() => void 0); }

    // -- Semigroup
    /**
     * Concats the instance with another one and selects the one which first
     *     completes
     * @method concat
     * @memberof module:monads/task.Task
     * @param {Task} m Another Task
     * @return {Task} A new Task
     *
     * @example
     * const {Task} = require('futils');
     *
     * let one = Task.resolve(1);
     * let idle = Task.empty();
     *
     * one.concat(idle).run(
     *     (x) => console.error('Rejected: ' + x),
     *     (n) => console.log('Resolved: ' + n)
     * );
     * // logs "Resolved: 1"
     */
    concat (m) {
        if (Task.is(m)) {
            let meFork = this.run, themFork = m.run,
                meClean = this.cleanUp, themClean = m.cleanUp;

            const cleanBoth = (a, b) => {
                meClean(a);
                themClean(b);
            }

            return new Task(
                (rej, res) => {
                    let states, done = false;
                    let state, mstate;

                    const guard = (f) => (mv) => {
                        if (!done) {
                            done = true;
                            delay(() => cleanBoth(states[0], states[1]));
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
        if (isFunc(f)) {
            return new Task(
                (rej, res) => this.run((a) => f(a).run(rej, res), res),
                this.cleanUp
            );            
        }
        throw 'Task::orElse expected argument to be function but saw ' + f;
    }
}