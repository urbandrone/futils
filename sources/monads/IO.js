/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import combinators from '../combinators';
import type from '../types';

/**
 * 
 */



const MV = Symbol('MonadicValue');



export default class IO {
    constructor (a) { this.performIO = a; }
    set performIO (a) { this[MV] = a; }
    get performIO () { return this[MV]; }
    toString () { return `IO(${this.performIO})`; }
    static is (a) { return IO.prototype.isPrototypeOf(a); }

    // -- Setoid 
    equals (b) {
        return IO.prototype.isPrototypeOf(b) &&
               b.performIO === b.performIO;
    }
    // -- Functor
    map (f) {
        if (type.isFunc(f)) {
            return IO.of(combinators.compose(f, this.performIO));
        }
        throw 'IO::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    static of (a) { return new IO(a); }
    of (a) { return IO.of(a); }
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.performIO);
        }
        throw 'IO::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    flatMap (f) {
        if (type.isFunc(f)) {
            return IO.of(combinators.compose(
                (mv) => mv.performIO ? mv.performIO() : mv.mvalue,
                f,
                this.performIO
            ));
            // return this.map(f).flatten();
        }
        throw 'IO::flatMap expects argument to be function but saw ' + f;
    }
    // -- Semigroup
    concat (m) {
        if (IO.is(m)) {
            return IO.of(combinators.compose(m.performIO, this.performIO));
        }
        throw 'IO::concat expected argument to be IO but saw ' + m;
    }
    // -- Monoid
    static empty () { return IO.of(combinators.identity); }
    // -- Foldable
    // reduce
}