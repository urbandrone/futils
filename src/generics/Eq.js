/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';




/**
 * A generic Eq module
 * @module generics/Eq
 * @requires core/typeOf
 */



export const compareT = (a, b) => {
    let tA = typeOf(a), tB = typeOf(this);
    if (tA !== tB) { return false; }
    switch (tA) {
        case 'Null':
        case 'Void':
        case 'Boolean':
        case 'String':
        case 'Number':
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
            return a === b;
        case 'Date':
            return b.valueOf() === a.valueOf();
        case 'RegExp':
            return b.toString() === a.toString();
        case 'Array':
            return b.length === a.length && a.every((x,i) => compareT(x, b[i]));
        case 'Object':
            return Object.keys(a).every(x => compareT(a[x], b[x])) &&
                   Object.keys(b).every(x => compareT(a[x], b[x]));
        case 'Set':
        case 'Map':
            return compareT([...b.entries()], [...a.entries()]);
        case 'Error':
        case 'EvalError':
        case 'TypeError':
        case 'RangeError':
        case 'SyntaxError':
        case 'ReferenceError':
            return a.name === b.name && a.message === b.message;
        default:
            return compareT(a.value, b.value);
    }
}



/**
 * The generics Eq class. Provides a generic equals method for all data structures
 * which derive from it
 * @class module:generics/Eq.Eq
 * @static
 * @private
 * @version 3.0.0
 *
 * @example
 * const {Type} = require('futils/adt');
 * const {Eq} = require('futils/generics');
 *
 * const Int = Type('Int', ['value']).
 *     deriving(Eq);
 *
 * const one = Int(1);
 * const two = Int(2);
 * const eno = Int(1);
 *
 * one.equals(eno); // -> true
 * one.equals(two); // -> false
 * one.equals(1);   // -> false
 */
export class Eq {
    static mixInto (ctor) {
        if (ctor && ctor.prototype) {
            ctor.prototype.equals = function (a) {
                return compareT(this, a);
            }
            return ctor;
        }
        throw `Cannot derive Eq from ${typeOf(ctor)}`;
    }
}



export default { Eq, compareT }