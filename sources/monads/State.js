/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';

/**
 * 
 */


const MV = Symbol('MonadicValue');
const OV = Symbol('OldMonadicValue');



export default class State {
    constructor (a, b) { this.mvalue = a; this.mbefore = b; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }
    set mbefore (a) { this[OV] = a; }
    get mbefore () { return this[OV] || null; }
    toString () { return `State(${this.mvalue}, ${this.mbefore})`; }
    static is (a) { return State.prototype.isPrototypeOf(a); }

    // -- Setoid 
    equals (b) {
        return State.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue &&
               b.mbefore === this.mbefore;
    }
    // -- Functor
    map (f) {
        if (type.isFunc(f)) {
            return State.of(f(this.mvalue), this.mvalue);
        }
        throw 'State::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    static of (a, b) { return new State(a, b); }
    of (a, b) { return State.of(a, b); }
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'State::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    flatMap (f) {
        if (type.isFunc(f)) {
            return State.of(f(this.mvalue).mvalue, this.mvalue);
        }
        throw 'State::flatMap expects argument to be function but saw ' + f;
    }
    // -- Foldable
    // reduce
}