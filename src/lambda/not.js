/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';



/**
 * Provides the not function. It takes a function and returns a variant of it
 * that negates the return value
 * @module lambda/not
 */



/**
 * The not function
 * @method not
 * @memberOf module:lambda/not
 * @param {Function} f The function to negate the return value
 * @return {Function} A variant of f
 *
 * @example
 * const {not} = require('futils/lambda');
 *
 * const isNull = (a) => a === null;
 *
 * const isntNull = not(isNull);
 *
 * isNull(null);   // -> true
 * isntNull(null); // -> false
 */
export const not = f => arity(f.length, (...xs) => !f(...xs));