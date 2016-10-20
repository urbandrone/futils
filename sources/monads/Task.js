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
 * 
 */



const RUN_PROG = Symbol('MonadicFork');
const CLEANUP = Symbol('MonadicCleanUp')


const delay = type.isFunc(setImmediate) ? (f) => setImmediate(f) :
              !type.isVoid(process) ? (f) => process.nextTick(f) :
              (f) => setTimeout(f, 0);

const ofVoid = () => void 0;


export default class Task {
    constructor (a, b) { this.fork = a; this.cleanUp = b; }
    set fork (a) { this[RUN_PROG] = a; }
    get fork () { return this[RUN_PROG]; }
    set cleanUp (a) { this[CLEANUP] = a || ofVoid }
    get cleanUp () { return this[CLEANUP]; }
    toString () { return `Task`; }
    static is (a) { return Task.prototype.isPrototypeOf(a); }

    static resolve (a) { return Task.of((rej, res) => res(a)); }
    static reject (a) { return Task.of((rej) => rej(a)); }

    // -- Setoid 
    equals (b) {
        return Task.prototype.isPrototypeOf(b) &&
               b.fork === this.fork &&
               b.cleanUp === this.cleanUp;
    }
    // -- Functor
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
    static of (a, b) { return new Task(a, b); }
    of (a) { return Task.of(a, this.cleanUp); }
    ap (m) {
        let fork = this.fork, mfork = m.fork,
            cleanUp = this.cleanUp, mcleanUp = m.cleanUp;

        const cleanBoth = ([a, b]) => {
            cleanUp(a);
            mcleanUp(b);
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

                let state = fork(guardRej, guardRes((a) => {
                    fload = true; f = a;
                }));
                let mstate = mfork(guardRej, guardRes((b) => {
                    vload = true; v = b;
                }));

                states = [state, mstate];
                return states;
            },
            cleanBoth
        );
    }
    // -- Monad
    flatMap (f) {
        if (type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fork(
                    rej,
                    (a) => f(a).fork(rej, res)
                ),
                this.cleanUp
            );
            // return this.map(f).flatten();
        }
        throw 'Task::flatMap expects argument to be function but saw ' + f;
    }
    // -- Foldable
    // -- ?
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
    cata ({Reject, Resolve}) {
        if (type.isFunc(Resolve) && type.isFunc(Reject)) {
            return this.fold(Reject, Resolve);
        }
        throw 'Task::cata expected Object of {Reject, Resolve}'; 
    }
    // -- Bifunctor
    biMap (f, g) {
        if (type.isFunc(g) && type.isFunc(f)) {
            return Task.of(
                (rej, res) => this.fold(rej, res),
                this.cleanUp
            );
        }
        throw 'Task::biMap expected arguments to be functions but saw ' + [f, g];
    }
    swap () {
        return Task.of(
            (rej, res) => this.fork(res, rej),
            this.cleanUp
        );
    }
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
    static empty () { return Task.of(() => void 0); }
    // -- Semigroup
    concat (m) {
        if (Task.is(m)) {
            let fork = this.fork, mfork = m.fork,
                cleanUp = this.cleanUp, mcleanUp = m.cleanUp;

            const cleanBoth = ([a, b]) => {
                cleanUp(a);
                mcleanUp(b);
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

                    state = fork(guard(rej), guard(res));
                    mstate = mfork(guard(rej), guard(res));
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
    // -- Foldable
    // reduce
}