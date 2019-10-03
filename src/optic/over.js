// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { curry } from '../lambda/curry';
import { Val } from './_Val';

/*
 * @module optic
 */

/**
 * The over function. Over allows to apply a function over a focused
 * value of a data structure and return the whole structure
 * @method over
 * @memberof module:optic
 * @version 3.0.0
 * @param {Lens} l A lens to focus with
 * @param {Function} f A tranformation function
 * @param {Object|Array} a The structure to operate on
 * @return {Object|Array} A manipulated clone of the structure
 *
 * @example
 * const {lenses, over} = require('futils').optic;
 *
 * const L = lenses('name');
 *
 * const color = {code: '#3d73cc', name: 'Nice blue'};
 * const upper = (a) => a.toUpperCase();
 *
 * over(L.name, upper, color); // -> {code: '#3d73cc', name: 'NICE BLUE'}
 */
export const over = curry((lens, f, a) => lens(x => Val(f(x)))(a).value);
