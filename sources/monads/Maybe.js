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



export class Some {
    constructor (a) { this.mvalue = a; }
    set mvalue (a) {
        if (type.isNil(a)) {
            throw 'Some::of cannot create from null or undefined but saw ' + a;
        }
        this[MV] = a;
    }
    get mvalue () { return this[MV]; }
    toString () { return `Some(${this.mvalue})`; }
    static is (a) { return Some.prototype.isPrototypeOf(a); }
    isSome () { return !type.isNil(this.mvalue); }

    // -- Setoid
    equals (b) {
        return Some.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }
    // -- Functor
    map (f) {
        if (type.isFunc(f)) {
            return Maybe.of(f(this.mvalue));
        }
        throw 'Some::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    static of (a) { return Some.is(a) ? a : new Some(a); }
    of (a) { return Some.of(a); }
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'Some::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'Some::flatMap expects argument to be function but saw ' + f;
    }
    flatten () {
        return Identity.of(this.mvalue.mvalue);
    }
    // -- Recovering
    orElse () { return this.mvalue; }
    orSome () { return this; }
    // -- Foldable
    reduce (f, a) {
        if (type.isFunc(f)) {
            return f(a, this.mvalue);
        }
        throw 'Some::reduce expects first argument to be function but saw ' + f;
    }
    // -- ?
    fold (_, g) {
        if (type.isFunc(g)) {
            return g(this.mvalue);
        }
        throw 'Some::fold expects argument 2 to be function but saw ' + g;
    }
    cata (o) {
        if (type.isFunc(o.Some)) {
            return this.fold(o, o.Some);
        }
        throw 'Some::cata expected Object of {Some: fn}, but saw ' + o; 
    }
    // -- Bifunctor
    biMap (_, g) {
        if (type.isFunc(g)) {
            return Maybe.of(this.fold(_, g));
        }
        throw 'Some::biMap expects argument 2 to be function but saw ' + g;
    }
    // -- Traversable
}


export class None {
    constructor () { this.mvalue = null; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }
    toString () { return 'None'; }
    static is (a) { return None.prototype.isPrototypeOf(a); }
    isSome () { return false; }

    // -- Setoid
    equals (b) {
        return None.prototype.isPrototypeOf(b) &&
               b.toString() === this.toString();
    }
    // -- Functor
    map () { return this; }
    // -- Applicative
    static of () { return new None(); }
    of () { return None.of(); }
    ap (m) { return m; }
    // -- Monad
    flatMap () { return this; }
    flatten () { return this; }
    // -- Recovering
    orElse (a) { return a; }
    orSome (a) { return Maybe.of(a); }
    // -- Foldable
    // reduce
    // -- ?
    fold (f) {
        if (type.isFunc(f)) {
            return f();
        }
        throw 'None::fold expects argument 1 to be function but saw ' + f;
    }
    cata (o) {
        if (type.isFunc(o.None)) {
            return this.fold(o.None);
        }
        throw 'None::cata expected Object of {None: fn}, but saw ' + o; 
    }
    // -- Bifunctor
    biMap (f) {
        if (type.isFunc(f)) {
            return Maybe.of(this.fold(f));
        }
        throw 'None::biMap expects argument 1 to be function but saw ' + f;
    }
    // -- Traversable
}




export default class Maybe {
    static of (a) {
        return type.isNil(a) ? None.of() : Some.of(a);
    }
    static fromNullable (a) { return Maybe.of(a); }
    static fromEither (m) {
        return m.fold(None.of, Some.of);
    }
    static is (a) { return Some.is(a) || None.is(a); }
}