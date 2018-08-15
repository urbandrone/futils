/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the ap function
 * @module operation/ap
 */



/**
 * The ap function
 * @method ap
 * @memberOf module:operation/ap
 * @param {Applicative} af The Applicative to apply
 * @param {Functor} a A Functor interface implementing type
 * @return {Functor} A new instance of the Functor
 *
 * @example
 * const {Id} = require('futils/data');
 * const {ap} = require('futils/operation');
 *
 * const upper = Id.of((a) => a.toUppserCase());
 * 
 * ap(upper, Id.of('a')); // -> Id('A')
 * ap(upper);             // -> (Functor -> Functor)
 */
export const ap = (af, a) => {
    return a == null ? (b) => ap(af, b) : af.ap(a);
}