/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';



/**
 * Provides the curry function. Curry can be used to turn a function which takes
 * multiple arguments at once into a function which takes its arguments in
 * multiple steps
 * @module lambda/curry
 */



function _curried (f, xs) {
    if (xs.length >= f.length) { return f(...xs); }
    return arity(f.length - xs.length, (...ys) => _curried(f, xs.concat(ys)));
}



/**
 * The curry function. Takes a function and returns a variant of it which takes
 * arguments until enough arguments to execute the given function are consumed
 * @method curry
 * @memberOf module:lambda/curry
 * @param {Function} f The function to curry
 * @return {Function} The curried variant
 *
 * @example
 * const {curry} = require('futils/lambda');
 *
 * const add = (a, b) => a + b;
 * const cAdd = curry(add);
 *
 * add(1);     // -> NaN
 * cAdd(1);    // -> (n -> 1 + n)
 * cAdd(1)(2); // -> 3
 */
export const curry = f => f.length <= 1 ? f : _curried(f, []);