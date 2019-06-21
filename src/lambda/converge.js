// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import {arity} from '../core/arity';
import {typeOf} from '../core/typeof';


/*
 * @module lambda
 */



const _combinator = (f, gs) => {
    let tF = typeOf(f), tG = typeOf(gs), tH = gs.every(h => typeOf(h) === 'Function');
    if (tF === 'Function' && tG === 'Array' && tH) {
      return arity(gs.reduce((n, g) => Math.max(n, g.length), 0), (...args) => {
        return f(...gs.map(g => g(...args)));
      });
    }
    throw `converge :: Expected arguments to be of type function and array of functions but saw ${tF} & ${tG}`;
}



/**
 * The converge function 
 * @method converge
 * @since 3.1.2
 * @memberof module:lambda
 * @param {Function} f The function to converge into
 * @param {Array} gs An array of branching functions
 * @return {Function} A function which applies the results of the branching functions to f
 *
 * @example
 * const {converge} = require('futils').lambda;
 * const {prop} = require('futils').operation;
 *
 * const Person = {
 *   firstName: 'John',
 *   lastName: 'Doe'
 * };
 *
 * const greet = (first, last) => `Hello ${first} ${last}`;
 *
 * const greetPerson = converge(greet, [prop('firstName'), prop('lastName')]);
 *
 * greetPerson(Person); // -> 'Hello John Doe'
 */
export const converge = (f, gs) => f === void 0 ? converge :
                                 gs === void 0 ? (hs) => converge(f, hs) :
                                 _combinator(f, gs);