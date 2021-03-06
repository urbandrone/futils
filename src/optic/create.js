// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { curry } from '../lambda/curry';
import { map } from '../operation/map';

/*
 * @module optic
 */

/**
 * The createLens function acts like a factory for new types of lenses
 * @method createLens
 * @memberof module:optic
 * @version 3.0.0
 * @param {Function} getter A function defining how to get a value from the structure
 * @param {Function} setter A function defining how to clone the structure and set a value
 * @return {Function} A factory function which can be used to create lens types
 *
 * @example
 * const {createLens, over} = require('futils').optic;
 *
 * const MapLens = createLens(
 *   (key, map) => map.get(key),
 *   (key, val, map) => new Map([...map.entries()]).set(key, val)
 * );
 *
 * const LName = MapLens('name');
 *
 * const data = new Map([['name', 'Nice blue'], ['code', '#3d73cc']]);
 *
 * const upper = (a) => a.toUpperCase();

 * over(LName, upper, data); // -> Map([['name', 'NICE BLUE'], ['code', '#3d73cc']])
 */
export const createLens = curry((gets, sets, k, f, a) => {
  return map(b => sets(k, b, a), f(gets(k, a)));
});
