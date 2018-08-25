/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the drop function
 * @module operation/drop
 */



const _drop = (n, a) => typeof a === 'string' || isNaN(a.length) ? [a] :
                        Array.from(a).slice(n);


/**
 * The drop function
 * @method drop
 * @memberof module:operation/drop
 * @param {Number} n Number of items to drop
 * @param {Array|Cons} a The collection to drop the items from
 * @return {Array|Nil} Result of the drop
 *
 * @example
 * const {drop} = require('futils/operation');
 *
 * drop(1, ['a', 'b']); // -> 'b'
 * drop(1);             // -> (Array/Cons -> Array/Cons)
 */
export const drop = (n, a) => a == null ? (b) => drop(n, b) :
                                a.drop ? a.drop(n) :
                                _drop(n, a);