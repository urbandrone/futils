/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';




/**
 * A generic Show module
 * @module generics/Show
 */



export const showT = (a) => {
    if (a === null) { return 'Null'; }
    if (a === void 0) { return 'Void'; }
    switch (a.constructor.name) {
        case 'Boolean':
        case 'String':
        case 'Number':
        case 'RegExp':
        case 'Symbol':
            return a.toString();
        case 'Function':
        case 'GeneratorFunction':
        case 'Promise':
        case 'Proxy':
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
        case 'Error':
        case 'EvalError':
        case 'TypeError':
        case 'RangeError':
        case 'SyntaxError':
        case 'ReferenceError':
            return a.constructor.name;
        case 'Date':
            return `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
        case 'Array':
            return `[${a.map(showT).join(', ')}]`;
        case 'Object':
            return '{' + Object.keys(a).map(k => `${k}: ${showT(a[k])}`).join(', ') + '}';
        case 'Set':
            return 'Set(' + [...a.entries()].map(([k, v]) => `${k}: ${showT(v)}`).join(', ') + ')';
        case 'Map':
            return 'Map(' + [...a.entries()].map(([k, v]) => `${k}: ${showT(v)}`).join(', ') + ')';
        default:
            return `${a}`;
    }
}



/**
 * The generics Show class. Provides a generic toString method for all data structures
 * which derive from it
 * @class module:generics/Show.Show
 * @static
 * @private
 * @version 3.0.0
 *
 * @example
 * const {Type} = require('futils/adt');
 * const {Show} = require('futils/generics');
 *
 * const Int = Type('Int', ['value']).
 *     deriving(Show);
 *
 * const one = Int(1);
 *
 * one.toString();   // -> 'Int 1'
 * one.inspect();    // -> 'Int 1'
 */
export class Show {
    static mixInto (ctor) {
        if (ctor && ctor.prototype) {
            ctor.prototype.toString = function () {
                if (this.__type__ != null) {
                    return `${this.__type__}(${this.__values__.map(v => showT(this[v])).join(' ')})`;
                }
                return showT(this);
            }
            ctor.prototype.inspect = function () {
                return this.toString();
            }
            return ctor;
        }
        throw `Cannot derive Show from ${typeOf(ctor)}`;
    }
}