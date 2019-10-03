// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { typeOf } from '../core/typeof';
import { Type } from '../adt';
import { Show } from '../generics/Show';
import { Eq } from '../generics/Eq';
import { Ord } from '../generics/Ord';

/*
 * @module monoid
 */

/**
 * The Product monoid. Product can be used to multiply multiple
 * numbers into a final number via concatenation
 * @class module:monoid.Product
 * @extends module:generics/Show
 * @extends module:generics/Eq
 * @extends module:generics/Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Product} = require('futils').monoid;
 *
 * Product(1); // -> Product(1)
 *
 * Product(1).value; // -> 1
 */
export const Product = Type('Product', ['value']).deriving(Show, Eq, Ord);

/**
 * Lifts a value into a Product. Returns a Product of 1 if the value
 * isn't a number
 * @method of
 * @static
 * @memberof module:monoid.Product
 * @param {any} a The value to lift
 * @return {Product} A new Product
 *
 * @example
 * const {Product} = require('futils').monoid;
 *
 * Product.of(2);  // -> Product(2)
 * Product.of(null); // -> Product(1)
 * Product.of({});   // -> Product(1)
 */
Product.of = a =>
  typeof a === 'number' && !isNaN(a) ? Product(a) : Product(1);

/**
 * Monoid implementation for Product. Returns a Product of 1
 * @method empty
 * @static
 * @memberof module:monoid.Product
 * @return {Product} The empty Product
 *
 * @example
 * const {Product} = require('futils').monoid;
 *
 * Product.empty(); // -> Product(1)
 */
Product.empty = () => Product(1);

/**
 * Concatenates a Product with another using multiplication
 * @method concat
 * @memberof module:monoid.Product
 * @instance
 * @param {Product} a The Product instance to concatenate with
 * @return {Product} A new Product
 *
 * @example
 * const {Product} = require('futils').monoid;
 *
 * const product = Product(2);
 *
 * product.concat(Product(2)); // -> Product(4)
 */
Product.fn.concat = function(a) {
  if (Product.is(a)) {
    return Product(this.value * a.value);
  }
  throw `Product::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
};
