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



const Identity = Type('Identity', ['value']).
    deriving(Show, Eq, Ord);



Identity.of = Identity;
Identity.from = Identity;

Identity.fromEither = (a) => Identity(a.value);
Identity.fromMaybe = (a) => Identity(a.value);
Identity.fromList = (a) => Identity(a.value[0]);


Identity.prototype.map = function (f) {
    return Identity(f(this.value));
}

Identity.prototype.flat = function () {
    return this.value;
}

Identity.prototype.flatMap = function (f) {
    return this.map(f).flat();
}

Identity.prototype.ap = function (a) {
    return a.map(this.value);
}

Identity.prototype.reduce = function (f, x) {
    return f(x, this.value);
}

Identity.prototype.traverse = function (f, A) {
    return A.prototype.ap ?
           A.of(Identity.of).ap(f(this.value)) :
           f(this.value).map(Identity.of);
}

Identity.prototype.sequence = function (A) {
    return this.traverse((v) => v, A);
}



export default {Identity};