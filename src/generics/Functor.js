// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { typeOf } from '../core/typeof';
import { arity } from '../core/arity';
import { VALS } from '../core/constants';

/*
 * @module generics
 */

export const map = (f, a) => {
  let tA = typeOf(a);
  if (typeOf(f) === 'Function') {
    switch (tA) {
      // case 'NaN':
      // case 'Null':
      // case 'Void':
      // case 'String':
      // case 'Number':
      // case 'Boolean':
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
      //   return f(a);
      // case 'Array':
      // case 'Id':
      // case 'IO':
      // case 'Task':
      // case 'State':
      // case 'List':
      // case 'Some':
      // case 'None':
      // case 'Left':
      // case 'Right':
      // case 'Cont':
      // case 'Return':
      //   return a.map(f);
      case 'Object':
        return Object.keys(a).reduce((r, k) => {
          r[k] = map(f, a[k]);
          return r;
        }, Object.create(null));
      case 'Set':
        return new Set([...a.values()].map(f));
      case 'Map':
        return new Map([...a.entries()].map(([k, v]) => [k, map(f, v)]));
      case 'Function':
        return arity(a.length, (...args) => {
          return f(a(...args));
        });
      case 'GeneratorFunction':
        return function*(...args) {
          yield* f(a(...args));
        };
      case 'Promise':
        return a.then(f);
      default:
        return a && typeOf(a.map) === 'Function'
          ? a.map(f)
          : a && a[VALS] !== void 0
          ? a.constructor(...a[VALS].map(v => map(f, a[v])))
          : f(a);
    }
  }
  return a;
};
/*
 * The generics Functor class. Provides a generic map method for all data structures
 * which derive from it. Deriving Functor with a type already implementing it will
 * throw errors.
 * @class module:generics.Functor
 * @static
 * @version 3.3.0
 *
 * @example
 * const {Type} = require('futils').adt;
 * const {Functor} = require('futils').generics;
 *
 * const Int = Type('Int', ['value']).
 *   deriving(Functor);
 *
 * const increment = a => a + 1;
 *
 * const one = Int(1);
 * one.map(increment); // -> Int(2)
 */
export class Functor {
  static derive(ctor) {
    if (ctor && ctor.prototype && !ctor.prototype.map) {
      ctor.prototype.map = function(f) {
        return map(f, this);
      };
      return ctor;
    }
    throw `Cannot derive Functor from ${typeOf(ctor)}`;
  }
}
