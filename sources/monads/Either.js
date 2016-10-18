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



class Right {
    constructor (a) { this.mvalue = a; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }
    toString () { return `Right(${this.mvalue})`; }
    static is (a) { return Right.prototype.isPrototypeOf(a); }
    isRight () { return true; }

    // -- Chain
    chain (f) {
        if (type.isFunc(f)) {
            return f(this.value)
        }
        throw 'Right::chain expects argument to be function but saw ' + f;
    }
    // -- Setoid
    equals (b) {
        return Right.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }
    // -- Functor
    map (f) {
        if (type.isFunc(f)) {
            return Right.of(f(this.mvalue));
        }
        throw 'Right::map expects argument to be function but saw ' + f;
    }
    // -- Applicative
    static of (a) { return new Right(a); }
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.mvalue);
        }
        throw 'Right::ap expects argument to be Functor but saw ' + m;
    }
    // -- Monad
    flatten () {
        if (Right.is(this.mvalue)) {
            return Right.of(this.mvalue.mvalue);
        }
        return this;
    }
    flatMap (f) {
        if (type.isFunc(f)) {
            return this.map(f).flatten();
        }
        throw 'Right::flatMap expects argument to be function but saw ' + f;
    }
    // -- Recovering
    orElse () { return this.mvalue; }
    orRight () { return this; }
    // -- Foldable
    fold (_, g) {
        if (type.isFunc(g)) {
            return g(this.mvalue);
        }
        throw 'Right::fold expects argument 2 to be function but saw ' + g;
    }
    cata (o) {
        if (type.isFunc(o.Right)) {
            return o.Right(this.mvalue);
        }
        throw 'Right::cata expected Object of {Right: fn}, but saw ' + o; 
    }
    biMap (_, g) {
        if (type.isFunc(g)) {
            return this.map(g);
        }
        throw 'Right::biMap expects argument 2 to be function but saw ' + g;
    }
    swap () {
        return Left.of(this.mvalue);
    }
    // -- Traversable
}


class Left {
    constructor (a) { this.mvalue = a; }
    set mvalue (a) { this[MV] = a; }
    get mvalue () { return this[MV]; }
    toString () { return `Left(${this.mvalue})`; }
    static is (a) { return Left.prototype.isPrototypeOf(a); }
    isRight () { return false; }

    // -- Setoid
    equals (b) {
        return Left.prototype.isPrototypeOf(b) &&
               b.mvalue === this.mvalue;
    }
    // -- Functor
    map () { return this; }
    // -- Applicative
    static of (a) { return new Left(a); }
    ap () { return this; }
    // -- Monad
    flatten () { return this; }
    // -- Chain
    flatMap () { return this; }
    // -- Recovering
    orElse (a) { return a; }
    orRight (a) { return Right.of(a); }
    // -- Foldable
    fold (f) {
        if (type.isFunc(f)) {
            return f(this.mvalue);
        }
        throw 'Left::fold expects argument 1 to be function but saw ' + f;
    }
    cata (o) {
        if (type.isFunc(o.Left)) {
            return o.Left(this.mvalue);
        }
        throw 'Left::cata expected Object of {Left: fn}, but saw ' + o; 
    }
    biMap (f) {
        if (type.isFunc(f)) {
            return Left.of(f(this.mvalue));
        }
        throw 'Left::biMap expects argument 1 to be function but saw ' + f;
    }
    swap () {
        return Right.of(this.mvalue);
    }
    // -- Traversable
}




class Either {
    static Left (a) {
        return new Left(a);
    }
    static Right (a) {
        return new Right(a);
    }
    static fromNullable (exc, a) {
        if (!type.isNull(a) && !type.isVoid(a)) {
            return new Right(a);
        }
        return new Left(exc);
    }
    static fromMaybe (exc, m) {
        return m.fold(() => Either.Left(exc), Either.Right);
    }
    static fromIO (exc, m) {
        let e = Either.try(m.performIO);
        return e.isRight() ? e : Either.Left(exc);
    }
    static try (f, ...partials) {
        if (type.isFunc(f)) {
            if (f.length <= partials.length) {
                try {
                    let R = f(...partials);
                    return Error.prototype.isPrototypeOf(R) ?
                           Either.Left(R.message) :
                           Either.Right(R);
                } catch (exc) {
                    return Either.Left(exc.message);
                }
            }
            return (...args) => {
                try {
                    let R = f(...partials, ...args);
                    return Error.prototype.isPrototypeOf(R) ?
                           Either.Left(R.message) :
                           Either.Right(R);
                } catch (exc) {
                    return Either.Left(exc.message);
                }
            }
        }
        throw 'Either::try expects argument to be function but saw ' + f;
    }
}


export default Either;