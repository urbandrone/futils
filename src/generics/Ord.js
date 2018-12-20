/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';




/*
 * @module generics
 */



export const compareOrd = (a, b) => {
    let tA = typeOf(a), tB = typeOf(b);
    if (tA === tB) {
        switch (tA) {
            case 'String':
                return a.localeCompare(b) < 0;
            case 'Number':
            case 'Date':
                return a < b;
            case 'Array':
                return a.length < b.length && a.every((x,i) => compareOrd(x, b[i]));
            case 'Object':
                return Object.keys(a).every(x => compareOrd(a[x], b[x]));
            case 'Set':
            case 'Map':
                return compareOrd([...a.entries()], [...b.entries()]);
            case 'Null':
            case 'Void':
            case 'Boolean':
            case 'RegExp':
            case 'Error':
            case 'EvalError':
            case 'TypeError':
            case 'RangeError':
            case 'SyntaxError':
            case 'ReferenceError':
            case 'Function':
            case 'GeneratorFunction':
            case 'Promise':
            case 'Proxy':
            case 'Symbol':
            case 'IO':
            case 'Task':
            case 'State':
            case 'State.Value':
            case 'DataBuffer':
            case 'ArrayBuffer':
            case 'SharedArrayBuffer':
            case 'UInt8Array':
            case 'UInt8ClampedArray':
            case 'UInt16Array':
            case 'UInt64Array':
            case 'Float32Array':
            case 'Float64Array':
            case 'TypedArray':
                return false;
            default:
                return 'value' in a ?
                        compareOrd(a.value, b.value) :
                        a.__values__.reduce((c, av) => {
                            return b.__values__.reduce((d, bv) => {
                                return !!d && compareOrd(a[av], b[bv]);
                            }, c);
                        }, true);
        }
    }
    throw `Cannot order value of type ${tA} with value of type ${tB}`;
}



/**
 * The generics Ord class. Provides a generic equals method for all data structures
 * which derive from it. Any type which derives from Ord must also implement
 * a equals method
 * @class module:generics.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Type} = require('futils').adt;
 * const {Eq, Ord} = require('futils').generics;
 *
 * const Int = Type('Int', ['value']).
 *     deriving(Eq, Ord);
 *
 * const one = Int(1);
 * const two = Int(2);
 *
 * one.lt(two); // -> true
 * one.lte(one); // -> true
 * two.gt(one);  // -> true
 * two.gte(two); // -> true
 */
export class Ord {
    static derive (ctor) {
        if (ctor && ctor.prototype && ctor.prototype.equals) {
            ctor.prototype.lt = function (a) {
                return compareOrd(this, a);
            }
            ctor.prototype.lte = function (a) {
                return this.lt(a) || this.equals(a);
            }
            ctor.prototype.gt = function (a) {
                return !this.lte(a);
            }
            ctor.prototype.gte = function (a) {
                return !this.lt(a) || this.equals(a);
            }
            return ctor;
        }
        throw `Cannot derive Ord from ${typeOf(ctor)}`;
    }
}