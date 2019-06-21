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



export const flat = (a) => {
    let tA = typeOf(a);
    switch (tA) {
        case 'String':
        case 'Number':
        case 'Boolean':
            return a.valueOf();
        // case 'NaN':
        // case 'Null':
        // case 'Void':
        // case 'Object':
        // case 'Proxy':
        // case 'Symbol':
        // case 'DataBuffer':
        // case 'ArrayBuffer':
        // case 'SharedArrayBuffer':
        // case 'UInt8Array':
        // case 'UInt8ClampedArray':
        // case 'UInt16Array':
        // case 'UInt64Array':
        // case 'Float32Array':
        // case 'Float64Array':
        // case 'TypedArray':
        // case 'State.Result':
        // case 'Cont':
        // case 'Return':
        // case 'Set':
        // case 'Map':
        // case 'Function':
        // case 'GeneratorFunction':
        // case 'Promise':
        //     return a;
        // case 'Id':
        // case 'IO':
        // case 'Task':
        // case 'State':
        // case 'List':
        // case 'Some':
        // case 'None':
        // case 'Left':
        // case 'Right':
        case 'Array':
            return a.flat ? a.flat() : a.reduce((b, x) => b.concat(x), []);
        default:
            return a && a.flat ? a.flat() :
                   a && a[VALS] !== void 0 && a[VALS].length > 0 ? a[a[VALS][0]] :
                   a;
    }
}



/*
 * The generics Monad class. Provides a generic map method for all data structures
 * which derive from it. Deriving Monad with a type already implementing it will
 * throw errors. Monad can only be derived from classes which implement the Functor
 * typeclass.
 * @summary Works only for types which have a single data field!
 * @class module:generics.Monad
 * @static
 * @version 3.2.0
 *
 * @example
 * const {Type} = require('futils').adt;
 * const {Monad, Functor} = require('futils').generics;
 *
 * const Int = Type('Int', ['value']).
 *     deriving(Functor, Monad);
 *
 * const increment = a => Int(a + 1);
 *
 * const one = Int(1);
 * one.flatMap(increment);    // -> Int(2)
 * one.map(increment).flat(); // -> Int(2)
 */
export class Monad {
    static derive (ctor) {
        if (ctor && ctor.prototype && ctor.prototype.map && !ctor.prototype.flat && !ctor.prototype.flatMap) {
            ctor.prototype.flat = function () {
                return flat(this);
            }
            ctor.prototype.flatMap = function (f) {
                return this.map(f).flat();
            }
            return ctor;
        }
        throw `Cannot derive Monad from ${typeOf(ctor)}`;
    }
}