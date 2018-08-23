/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the tail function. It takes all but the first element from a List,
 * Series or Array(-like) and returns it
 * @module operation/tail
 */



const _rst = a => typeof a === 'string' || isNaN(a.length) ? [a] :
                    Array.from(a).slice(1);



/**
 * The tail function
 * @method tail
 * @memberof module:operation/tail
 * @param {Array|Cons} a The collection to take the tail from
 * @return {Array|Cons|Nil} Either the tail or a Array
 *
 * @example
 * const {tail} = require('futils/operation');
 *
 * tail(['a', 'b']); // -> ['b']
 * tail([]);         // -> []
 */
export const tail = a => a == null ? [] : 
                        a.__type__ === 'Cons' || a.__type__ === 'Nil' ? a.tail :
                        _rst(a);