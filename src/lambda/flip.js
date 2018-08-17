/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';



/**
 * Provides the flip function, which flips the order of the first two arguments
 * to a function
 * @module lambda/flip
 */



/**
 * The flip function
 * @method flip
 * @memberOf module:lambda/flip
 * @param {Function} f The function to flip arguments
 * @return {Function} A variant of f
 *
 * @example
 * const {flip} = require('futils/lambda');
 *
 * const ordered = (a, b, c) => `${a}${b}${c}`;
 *
 * const flipped = flip(ordered);
 *
 * ordered(1, 2, 3); // -> '123'
 * flipped(1, 2, 3); // -> '213'
 */
export const flip = f => f.length < 2 ? f :
                        arity(f.length, (a, b, ...xs) => f(b, a, ...xs))