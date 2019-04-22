/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {NIL} from '../core/constants';



/*
 * @module operation
 */



/**
 * The flat function. It can be used to flatten a nested data structure
 * one level down
 * @method flat
 * @memberof module:operation
 * @param {Function} f The function to flat with
 * @param {Monad|Array} a Any Array and/or Monad interface implementing type
 * @return {Monad|Array} A new instance of the Array or Monad
 *
 * @example
 * const {flat} = require('futils').operation;
 *
 * flat([['a'], ['b']]); // -> ['a', 'b']
 */
export const flat = a => NIL(a) ? a :
                         a.flat ? a.flat() :
                         a.reduce((x, y) => x.concat(y), []);