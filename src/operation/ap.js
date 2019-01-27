/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/*
 * @module operation
 */



/**
 * The ap function allows to apply a function inside a Applicative to a value in
 * another Functor. Because the .then function of a Promise flattens a returned
 * Promise, ap can be used with Promise, too
 * @method ap
 * @memberof module:operation
 * @param {Applicative|Promise} af The Applicative or Promise to apply
 * @param {Functor|Promise} a A Functor interface implementing type or a Promise
 * @return {Functor|Promise} A new instance of the Functor or Promise
 *
 * @example
 * const {Id} = require('futils').data;
 * const {ap} = require('futils').operation;
 *
 * const upper = Id.of((a) => a.toUppserCase());
 * 
 * ap(upper, Id.of('a')); // -> Id('A')
 * ap(upper);             // -> (Functor -> Functor)
 */
export const ap = (af, a) => {
    return a == null ? (b) => ap(af, b) : 
    typeof af.then === 'function' ? af.then(f => a.then(f, x => x), x => x) :
    af.ap(a);
}