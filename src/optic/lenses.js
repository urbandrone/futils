// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { createLens } from './create';

/*
 * @module optic
 */

/* Utilities */
const kvLens = createLens(
  (k, a) => {
    let b = a[k];
    return b == null ? null : b;
  },
  (k, v, a) => {
    let b = Array.isArray(a) ? [...a] : Object.assign({}, a);
    b[k] = v;
    return b;
  }
);

/**
 * The lenses function, which allows to create a collection of lenses
 * from strings. Also creates a "index" lens which can be used with arrays
 * @method lenses
 * @memberof module:optic
 * @version 3.0.0
 * @param {...String} a Strings representing the properties of an object
 * @return {Object} Collection of lenses
 *
 * @example
 * const {lenses, over} = require('futils').optic;
 *
 * const L = lenses('name');
 *
 * const color = {color: '#3d73cc', name: 'Nice blue'};
 * const upper = (a) => a.toUpperCase();
 *
 * over(L.name, upper, color); // -> {color: '#3d73cc', name: 'NICE BLUE'}
 */
export const lenses = (...ks) =>
  ks.reduce(
    (acc, k) => {
      acc[k] = kvLens(k);
      return acc;
    },
    { index: kvLens }
  );
