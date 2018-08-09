/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {UnionType} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';



const Either = UnionType('Either', {Right: ['value'], Left: ['value']}).
    deriving(Show, Eq, Ord);

const {Right, Left} = Either;



Either.of = Right;
Either.empty = Left;
Either.from = (a) => a == null || Error.prototype.isPrototypeOf(a) ? Left(a) : Right(a);

Either.fromMaybe = (a) => a.isSome() ? Right(a.value) : Left(null);
Either.fromIdentity = (a) => Either.from(a.value);
Either.fromList = (a) => Either.from(a.value[0]);
Either.try = (a) => (v) => {
    try { return Right(a.run(v)); } catch (exc) { return Left(exc); }
}



Either.prototype.isRight = function () {
    return this.caseOf({
        Left: () => false,
        Right: () => true
    });
}

Either.prototype.concat = function (a) {
    return this.caseOf({
        Left: () => a,
        Right: (v) => Either.is(a) && a.isRight() ? Right(v.concat(a.value)) : this
    });
}

Either.prototype.map = function (f) {
    return this.caseOf({
        Left: () => this,
        Right: (v) => Either.from(f(v))
    });
}

Either.prototype.flat = function () {
    return this.caseOf({
        Left: () => this,
        Right: (v) => v
    });
}

Either.prototype.flatMap = function (f) {
    return this.map(f).flat();
}

Either.prototype.ap = function (a) {
    return this.caseOf({
        Left: () => this,
        Right: (f) => a.map(f)
    });
}

Either.prototype.biMap = function (f, g) {
    return this.caseOf({
        Left: (v) => Either.from(f(v)),
        Right: (v) => Either.from(g(v))
    });
}

Either.prototype.reduce = function (f, x) {
    return this.caseOf({
        Left: () => x,
        Right: (v) => f(x, v)
    });
}

Either.prototype.traverse = function (f, A) {
    return this.caseOf({
        Left: () => A.of(this),
        Right: (v) => f(v).map(Either.from)
    });
}

Either.prototype.sequence = function (A) {
    return this.traverse((v) => v, A);
}

Either.prototype.alt = function (a) {
    return this.caseOf({
        Left: () => a,
        Right: () => this
    });
}

Either.prototype.swap = function () {
    return this.caseOf({
        Left: Right,
        Right: Left
    });
}



export default {Either, Right, Left};