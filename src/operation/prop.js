/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the prop function, which allows to extract properties or indexes. If
 * the property or index is missing, prop returns null
 * @module operation/prop
 */



const gets = (a, m) => m.has(a) ? m.get(a) : null;



/**
 * The prop function
 * @method prop
 * @memberof module:operation/prop
 * @param {String|Number} a The key or index to get
 * @param {Object|Array|Map} b The structure to extract from
 * @return {any|null} Value of the property or index
 *
 * @example
 * const {prop} = require('futils/operation');
 *
 * const obj = {a: 1, b: 2, c: 3};
 * const arr = [1, 2, 3];
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
 * 
 * prop('a', obj); // -> 1
 * prop('a', map); // -> 1
 * prop(0, arr);   // -> 1
 * prop('a');      // -> (b -> b.a)
 */
export const prop = (a, b) => b == null ? (c) => prop(a, c) :
                            b.constructor.name === 'Map' ? gets(a, b) :
                            b.hasOwnProperty(a) ? b[a] : null;