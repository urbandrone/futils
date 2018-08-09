/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {Type} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';

/* Utilities */
const arrayFrom = (a) => Array.isArray(a) ? a :
                        a == null ? [] :
                        a.length && typeof a !== 'string' ? Array.from(a) :
                        [a];



const List = Type('List', ['value']).
    deriving(Show, Eq, Ord);



List.of = (...a) => List(a);
List.empty = () => List([]);
List.from = (a) => List(arrayFrom(a));
List.fromArray = List;
List.fromIdentity = (a) => List.from(a.value);
List.fromMaybe = (a) => a.isSome() ? List.from(a.value) : List.empty();
List.fromEither = (a) => a.isRight() ? List.from(a.value) : List.empty();



List.prototype[Symbol.iterator] = function () {
    return this.value[Symbol.iterator]();
}

List.prototype.toArray = function () {
    return this.value;
}

List.prototype.concat = function (a) {
    return List(this.value.concat(a.value));
}

List.prototype.map = function (f) {
    return List(this.value.map(f));
}

List.prototype.flat = function () {
    return this.value.reduce((l, a) => l.concat(a));
}

List.prototype.flatMap = function (f) {
    return this.map(f).flat();
}

List.prototype.ap = function (a) {
    return a.map(this.value[0]);
}

List.prototype.reduce = function (f, x) {
    return this.value.reduce(f, x);
}

List.prototype.traverse = function (f, A) {
    return this.reduce(
        (t, a) => f(a).map(b => c => c.concat(List.of(b))).ap(t),
        A.of(List.empty())
    );
}

List.prototype.sequence = function (A) {
    return this.traverse(x => x, A);
}

List.prototype.alt = function (a) {
    return this.value.length < 1 ? a : this;
}




export default {List};