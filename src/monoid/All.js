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
 * The All monoid. All can be used to check of all of multiple
 * items are true
 * @class module:monoid.All
 * @extends module:generics/Show
 * @extends module:generics/Eq
 * @extends module:generics/Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {All} = require('futils').monoid;
 *
 * All(true); // -> All(true)
 *
 * All(true).value; // -> true
 */
export const All = Type('All', ['value']).deriving(Show, Eq, Ord);

/**
 * Lifts a value into a All. Returns the empty All for values which are no booleans
 * @method of
 * @static
 * @memberof module:monoid.All
 * @param {any} a The value to lift
 * @return {All} A new All
 *
 * @example
 * const {All} = require('futils').monoid;
 *
 * All.of(false);  // -> All(false)
 * All.of(null); // -> All(true)
 * All.of({});   // -> All(true)
 */
All.of = a => (typeof a === 'boolean' ? All(a) : All(true));

/**
 * Monoid implementation for All. Returns a All of true
 * @method empty
 * @static
 * @memberof module:monoid.All
 * @return {All} The empty All
 *
 * @example
 * const {All} = require('futils').monoid;
 *
 * All.empty(); // -> All(true)
 */
All.empty = () => All(true);

/**
 * Concatenates a All with another using boolean comparison
 * @method concat
 * @memberof module:monoid.All
 * @instance
 * @param {All} a The All instance to concatenate with
 * @return {All} A new All
 *
 * @example
 * const {All} = require('futils').monoid;
 *
 * const all = All(true);
 *
 * all.concat(All(false)); // -> All(false)
 */
All.fn.concat = function(a) {
  if (All.is(a)) {
    return !this.value ? this : All(!!this.value && !!a.value);
  }
  throw `All::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
};
