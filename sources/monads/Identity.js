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



export default class Identity {
    constructor (a) { this.mvalue = a; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }
    toString () { return `Identity(${this.mvalue})`; }
    static is (a) { return Identity.prototype.isPrototypeOf(a); }

    // -- Setoid 
    equals (b) {
        return Identity.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }
    // -- Functor
    map (f) {
        if (type.isFunc(f)) {
            return Identity.of(f(this.mvalue));
        }
        throw 'Identity::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    static of (a) { return new Identity(a); }
    of (a) { return Identity.of(a); }
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'Identity::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'Identity::flatMap expects argument to be function but saw ' + f;
    }
    flatten () {
        return Identity.of(this.mvalue.mvalue);
    }
    // -- Foldable
    // reduce
    // -- Bifunctor
    // biMap, Functor
    // -- Profunctor
    // proMap, Functor
    // -- Monoid
    // empty, Semigroup
    // -- Traversable
    // traverse, Functor, Foldable
    // -- Semigroup
    // concat
}