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
 * The Max monoid. Max can be used to find the largest item
 * from multiple items by concatenation
 * @class module:monoid.Max
 * @extends module:generics/Show
 * @extends module:generics/Eq
 * @extends module:generics/Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Max} = require('futils').monoid;
 *
 * Max(1); // -> Max(1)
 *
 * Max(1).value; // -> 1
 */
export const Max = Type('Max', ['value']).deriving(Show, Eq, Ord);

/**
 * Lifts a value into a Max. Returns a Max of negative Infinity if the value
 * isn't a number
 * @method of
 * @static
 * @memberof module:monoid.Max
 * @param {any} a The value to lift
 * @return {Max} A new Max
 *
 * @example
 * const {Max} = require('futils').monoid;
 *
 * Max.of(1);  // -> Max(1)
 * Max.of(null); // -> Max(-Infinity)
 * Max.of({});   // -> Max(-Infinity)
 */
Max.of = a =>
  typeof a === 'number' && !isNaN(a) ? Max(a) : Max(-Infinity);

/**
 * Monoid implementation for Max. Returns a Max of negative Infinity
 * @method empty
 * @static
 * @memberof module:monoid.Max
 * @return {Max} The empty Max
 *
 * @example
 * const {Max} = require('futils').monoid;
 *
 * Max.empty(); // -> Max(-Infinity)
 */
Max.empty = () => Max(-Infinity);

/**
 * Concatenates a Max with another using Ord.gt comparison
 * @method concat
 * @memberof module:monoid.Max
 * @instance
 * @param {Max} a The Max instance to concatenate with
 * @return {Max} A new Max
 *
 * @example
 * const {Max} = require('futils').monoid;
 *
 * const max = Max(3);
 *
 * max.concat(Max(2)); // -> Max(3)
 */
Max.fn.concat = function(a) {
  if (Max.is(a)) {
    return this.gt(a) ? this : a;
  }
  throw `Max::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
};
