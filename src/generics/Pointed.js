/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {arity} from '../core/arity';




/*
 * @module generics
 */



/*
 * The generics Pointed class. Provides a generic of method for all data constructors
 * which derive from it. Deriving Pointed with a type already implementing it will
 * throw errors.
 * @class module:generics.Pointed
 * @static
 * @version 3.1.0
 *
 * @example
 * const {Type} = require('futils').adt;
 * const {Pointed, Apply, Functor} = require('futils').generics;
 *
 * const Int = Type('Int', ['value']).
 *     deriving(Functor, Apply, Pointed);
 *
 * const one = Int.of(1); // -> Int(1)
 */
export class Pointed {
    static derive (ctor) {
        if (ctor && ctor.prototype && ctor.prototype.ap && !ctor.of) {
            ctor.of = arity(ctor.length, function (...args) {
               return ctor.deriving ? ctor(...args) : new ctor(...args); 
            });
            return ctor;
        }
        throw `Cannot derive Pointed from ${typeOf(ctor)}`;
    }
}