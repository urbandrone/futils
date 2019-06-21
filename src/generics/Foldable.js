// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import {typeOf} from '../core/typeof';
import {VALS} from '../core/constants';




/*
 * @module generics
 */



export const reduce = (f, a, b) => {
    let tB = typeOf(b);
    if (typeOf(f) === 'Function') {
        switch (tB) {
            case 'NaN':
            case 'Null':
            case 'Void':
                return a;
            case 'Array':
                return b.reduce(f, a);
            case 'Object':
                return Object.keys(b).reduce((x, k) => f(x, b[k], k), a);
            case 'Set':
                return [...b.values()].reduce(f, a);
            case 'Map':
                return [...b.entries()].reduce((x, [k, v]) => f(x, v, k), a);
            case 'Function':
            case 'GeneratorFunction':
            case 'Promise':
            case 'IO':
            case 'Task':
            case 'Cont':
            case 'Return':
                return b;
            default:
                return b[VALS] !== void 0 ? b[VALS].reduce((x, v) => f(x, b[v]), a) :
                                            f(a, b);
        }
    }
    return a;
}



/*
 * The generics Foldable class. Provides a generic reduce method for all data structures
 * which derive from it. Deriving Foldable with a type already implementing it will
 * throw errors.
 * @summary Works only for types which have a single data field!
 * @class module:generics.Foldable
 * @static
 * @version 3.2.0
 *
 * @example
 * const {Type} = require('futils').adt;
 * const {Foldable} = require('futils').generics;
 *
 * const Char = Type('Char', ['value']).
 *     deriving(Foldable);
 *
 * Char('a').reduce((x, a) => `${x}: ${a}`, 'Char is'); // -> 'Char is: a'
 */
export class Foldable {
    static derive (ctor) {
        if (ctor && ctor.prototype && !ctor.prototype.reduce) {
            ctor.prototype.reduce = function (f, a) {
                return reduce(f, a, this);
            }
            return ctor;
        }
        throw `Cannot derive Foldable from ${typeOf(ctor)}`;
    }
}