/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import {arity} from '../core/arity';


/*
 * @module operation
 */



/**
 * The proMap function is useful when working with ProFunctor implementing types
 * @method proMap
 * @memberof module:operation
 * @version 3.1.0
 * @param {Function} f A failure/lhs handling function
 * @param {Function} g A success/rhs handling function
 * @param {ProFunctor|Function} B The ProFunctor to proMap over
 * @return {ProFunctor|Function} A new instance of the ProFunctor
 *
 * @example
 * const {proMap} = require('futils').operation;
 * const {IO} = require('futils').data;
 *
 * 
 * // strToChars :: String -> [Char]
 * const strToChars = a => a.split('');
 *
 * // countChars :: [Char] -> Number
 * const countChars = as => as.length;
 *
 * // removeChars :: [Char] -> [Char] -> [Char]
 * const removeChars = bs -> as -> as.filter(a => bs.every(b => a !== b));
 *
 * // prog :: IO([Chars] -> [Chars])
 * const prog = IO(removeChars(['a', 'e', 'i', 'o', 'u']));
 * 
 * proMap(strToChars, countChars, prog);  // -> IO(String -> Number)
 */
export const proMap = (f, g, a) => g == null ? (h, b) => proMap(f, h, b) :
                                  a == null ? b => proMap(f, g, b) :
                                  a.proMap ? a.proMap(f, g) :
                                  arity(a.length, (...args) => g(a(f(...args))));