/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';




/**
 * A generic Ord module. Any type which derives from Ord must also implement
 * a equals method
 * @module generics/Ord
 * @requires core/typeOf
 */



export const compareT = (a, b) => {
    let tA = typeOf(a), tB = typeOf(this);
    if (tA === tB) {
        switch (tA) {
            case 'String':
                return a.localeCompare(b) > 0;
            case 'Number':
            case 'Date':
                return b < a;
            case 'Array':
                return b.length < a.length && b.every((x,i) => compareT(x, a[i]));
            case 'Object':
                return Object.keys(b).every(x => compareT(a[x], b[x]));
            case 'Set':
            case 'Map':
                return compareT([...a.entries()], [...b.entries()]);
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
                return compareT(a.value, b.value);
        }
    }
    throw `Cannot order value of type ${tA} with value of type ${tB}`;
}



/**
 * The generics Ord class. Provides a generic equals method for all data structures
 * which derive from it
 * @class module:generics/Ord.Ord
 * @static
 * @private
 * @version 3.0.0
 *
 * @example
 * const {Type} = require('futils/adt');
 * const {Ord} = require('futils/generics');
 *
 * const Int = Type('Int', ['value']).
 *     deriving(Ord);
 *
 * const one = Int(1);
 * const two = Int(2);
 *
 * one.lt(two); // -> true
 * one.lte(one); // -> true
 * two.gt(one);  // -> true
 * two.gte(two); // -> true
 * 
 */
export class Ord {
    static mixInto (ctor) {
        if (ctor && ctor.prototype && ctor.prototype.equals) {
            ctor.prototype.lt = function (a) {
                return compareT(a, this);
            }
            ctor.prototype.lte = function (a) {
                return this.lt(a) || this.equals(a);
            }
            ctor.prototype.gt = function (a) {
                return !this.lte(a);
            }
            ctor.prototype.gte = function (a) {
                return !this.lt(a);
            }
            return ctor;
        }
        throw `Cannot derive Ord from ${typeOf(ctor)}`;
    }
}


export default { Ord, compareT }