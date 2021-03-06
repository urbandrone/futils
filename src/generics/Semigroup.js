// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { typeOf } from '../core/typeof';
import { arity } from '../core/arity';
import { VALS, NIL } from '../core/constants';

/*
 * @module generics
 */

export const concat = (a, b) => {
  let tA = typeOf(a);
  if (typeOf(b) === tA) {
    switch (tA) {
      case 'NaN':
      case 'Null':
      case 'Void':
      case 'State':
      case 'Cont':
      case 'Return':
        return a;
      case 'Number':
      case 'Boolean':
        return [b.valueOf(), a.valueOf()];
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
      //   return [b, a];
      // case 'String':
      // case 'Array':
      // case 'Id':
      // case 'IO':
      // case 'Task':
      // case 'List':
      // case 'Some':
      // case 'None':
      // case 'Left':
      // case 'Right':
      //   return b.concat(a);
      case 'Object':
        return Object.assign(Object.create(null), b, a);
      case 'Set':
        return new Set([...b.values(), ...a.values()]);
      case 'Map':
        return [...b.entries(), ...a.entries()].reduceRight(
          (m, [k, v]) => {
            if (!m.has(k)) {
              m.set(k, v);
            }
            return m;
          },
          new Map()
        );
      case 'Function':
        return arity(b.length, (...args) => {
          return a(b(...args));
        });
      case 'GeneratorFunction':
        return function*(...args) {
          yield* a(b(...args));
        };
      case 'Promise':
        return Promise.race([a, b]);
      default:
        if (b.concat) {
          return b.concat(a);
        }
        if (b[VALS] !== void 0) {
          return b[VALS].reduce((x, v) => {
            if (!NIL(x[v])) {
              x[v] = concat(x[v], b[v]);
            } else {
              x[v] = b[v];
            }
            return x;
          }, a);
        }
        return [b, a];
    }
  }
  return a;
};

/*
 * The generics Semigroup class. Provides a generic ap method for all data structures
 * which derive from it. Deriving Semigroup with a type already implementing it will
 * throw errors.
 * @summary Works only for types which have a single data field!
 * @class module:generics.Semigroup
 * @static
 * @version 3.3.0
 *
 * @example
 * const {Type} = require('futils').adt;
 * const {Semigroup} = require('futils').generics;
 *
 * const Char = Type('Char', ['value']).
 *   deriving(Semigroup);
 *
 * const charB = Char('b');
 * const charA = Char('a');
 *
 * charA.concat(charB); // -> Char('ab')
 */
export class Semigroup {
  static derive(ctor) {
    if (ctor && ctor.prototype && !ctor.prototype.concat) {
      ctor.prototype.concat = function(S) {
        return concat(S, this);
      };
      return ctor;
    }
    throw `Cannot derive Semigroup from ${typeOf(ctor)}`;
  }
}
