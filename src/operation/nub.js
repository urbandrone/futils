/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {nubBy} from './nubby';
import {equals} from './equals';



/**
 * Provides the nub function, which removes duplicates from either a List or an
 * Array
 * @module operation/nub
 */



/**
 * The nub function
 * @method nub
 * @memberof module:operation/nub
 * @param {Array|Cons|Nil} a The collection to remove duplicates from
 * @return {Array|Cons|Nil} A new collection with all duplicates removed
 *
 * @example
 * const {nub} = require('futils/operation');
 *
 * nub(['a', 'b', 'a']); // -> ['a', 'b']
 * nub([]);              // -> []
 */
export const nub = nubBy(equals);