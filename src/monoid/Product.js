/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {Type} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';




/**
 * Grants access to the Product monoid. Product can be used to multiply multiple
 * numbers into a final number via concattenation
 * @module monoid/Product
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Product monoid
 * @class module:monoid/Product.Product
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Product} = require('futils/monoid');
 *
 * Product(1); // -> Product(1)
 *
 * Product(1).value; // -> 1
 */
export const Product = Type('Product', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Product. Casts it to a number if possible or returns a
 * Product of 1
 * @method of
 * @static
 * @memberof module:monoid/Product.Product
 * @param {any} a The value to lift
 * @return {Product} A new Product
 *
 * @example
 * const {Product} = require('futils/monoid');
 *
 * Product.of(2);    // -> Product(2)
 * Product.of(null); // -> Product(1)
 * Product.of({});   // -> Product(1)
 */
Product.of = (a) => {
    let v = Number(a);
    return typeof v === 'number' && !isNaN(v) ? Product(v) : Product(1);
}
/**
 * Monoid implementation for Product. Returns a Product of 1
 * @method empty
 * @static
 * @memberof module:monoid/Product.Product
 * @return {Product} The empty Product
 *
 * @example
 * const {Product} = require('futils/monoid');
 *
 * Product.empty(); // -> Product(1)
 */
Product.empty = () => Product(1);



/**
 * Concatenates a Product with another using multiplication
 * @method concat
 * @memberof module:monoid/Product.Product
 * @param {Product} a The Product instance to concatenate with
 * @return {Product} A new Product
 *
 * @example
 * const {Product} = require('futils/monoid');
 *
 * const product = Product(2);
 *
 * product.concat(Product(2)); // -> Product(4)
 */
Product.fn.concat = function (a) {
    if (Product.is(a)) {
        return Product(this.value * a.value);
    }
    throw `Product::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}