/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from './types';
import combine from './combinators';
import decorate from './decorators';

/**
 * A collection of monadic functors
 * @module futils/monads
 * @requires futils/types
 * @requires futils/combinators
 */


const MVAL = Symbol('value');
const MTYPE = Symbol('type');

/**
 * Checks if a given object has a field of a certain key by name which is not
 *     inherited
 * @method 
 * @version 0.2.0
 * @param {string} key Name of the field
 * @param {object} x The object to test
 * @return {boolean} True if the field is present
 *
 * @example
 * const {has} = require('futils');
 */

class Identity {
    constructor (a, t) {
        this[MTYPE] = t;
        this[MVAL] = a;
    }
    static of (a) {
        return new Identity(a, 'Identity');
    }
    toString () {
        return `${this[MTYPE]}(${this[MVAL]})`;
    }
    result () {
        return this[MVAL];
    }
    map (f) {
        return Identity.of(f(this.result()));
    }
    flatten () {
        return Identity.of(this.result().result());
    }
    flatMap (f) {
        return this.map(f).flatten();
    }
}




class None extends Identity {
    constructor () { super(null, 'Maybe.None'); }
    static of () { return new None(); }
    isSome () { return false; }
    map () { return this; }
    flatten () { return this; }
    orElse (a) {
        return Maybe.of(a);
    }
    biMap (f) {
        return Maybe.of(f());
    }
}

class Some extends Identity {
    static of (a) { return new Some(a, 'Maybe.Some'); }
    orElse () { return this; }
    isSome () {
        return this.result() != null;
    }
    map (f) {
        return this.isSome() ? Maybe.of(f(this.result())) : this;
    }
    flatten () {
        return this.isSome() ? Maybe.of(this.result().result()) : this;
    }
    biMap (_, g) {
        return this.map(g);
    }
}

class Maybe {
    static of (a) {
        return type.isNil(a) ? Maybe.ofNone() : Maybe.ofSome(a);
    }
    static ofNone () {
        return Maybe.None.of();
    }
    static ofSome (a) {
        return Maybe.Some.of(a);
    }
    static fromEither (ma) {
        return ma.isRight() ?
               Maybe.ofSome(ma.result()) :
               Maybe.ofNone();
    }
}

Maybe.None = None;
Maybe.Some = Some;



class Left extends Identity {
    static of (a) { return new Left(a, 'Either.Left'); }
    orElse (a) { return Right.of(a); }
    biMap (f) { return this.mapLeft(f); }
    isRight () { return false; }
    map () { return this; }
    flatten () { return this; }
    mapLeft (f) { return Left.of(f(this.result())); }
}

class Right extends Identity {
    static of (a) { return new Right(a, 'Either.Right'); }
    orElse () { return this; }
    biMap (_, g) { return this.map(g); }
    isRight () { return Right.prototype.isPrototypeOf(this); }
    map (f) {
        return this.isRight() ? Right.of(f(this.result())) : this;
    }
    flatten () {
        return this.isRight() ? Right.of(this.result().result()) : this;
    }
    mapLeft () { return this; }
}

class Either {
    static ofLeft (a) {
        return Either.Left.of(a);
    }
    static ofRight (a) {
        return Either.Right.of(a);
    }
    static fromMaybe (b, ma) {
        return ma.isSome() ?
               Either.ofRight(ma.result()) :
               Either.ofLeft(b)
    }
    static try (f) {
        return (...args) => {
            try {
                return Right.of(f(...args));
            } catch (exc) {
                return Left.of(exc);
            }
        }
    }
}

Either.Left = Left;
Either.Right = Right;



class IO extends Identity {
    static of (a) {
        // of :: f -> IO f
        return new IO(a, 'IO');
    }
    result () {
        // result :: () => a
        return this[MVAL]();
    }
    map (f) {
        // map :: f -> IO fa
        return IO.of(combine.compose(f, () => this.result()));
    }
    flatten () {
        // this = IO(IO( f ))
        return IO.of(() => this.result().result());
    }
}



// Utilities
// =========
const mmaybe = decorate.curry((x, f, m) => m.isSome() ?
                                            f(m.result()) :
                                            x);

const meither = decorate.curry((g, f, m) => m.isRight() ?
                                            f(m.result()) :
                                            g(m.result()));



export default {
    Identity, Maybe, Either, Some, None, Left, Right, IO,
    mmaybe, meither
};