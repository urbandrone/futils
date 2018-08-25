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
 * Grants access to the Min monoid. Min can be used to find the smallest item
 * from multiple items by concattenation
 * @module monoid/Min
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Min monoid
 * @class module:monoid/Min.Min
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Min} = require('futils/monoid');
 *
 * Min(1); // -> Min(1)
 *
 * Min(1).value; // -> 1
 */
export const Min = Type('Min', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Min. Returns a Min of Infinity if the value
 * isn't a number
 * @method of
 * @static
 * @memberof module:monoid/Min.Min
 * @param {any} a The value to lift
 * @return {Min} A new Min
 *
 * @example
 * const {Min} = require('futils/monoid');
 *
 * Min.of(1);    // -> Min(1)
 * Min.of(null); // -> Min(Infinity)
 * Min.of({});   // -> Min(Infinity)
 */
Min.of = a => typeof a === 'number' && !isNaN(a) ? Min(a) : Min(Infinity);
/**
 * Monoid implementation for Min. Returns a Min of Infinity
 * @method empty
 * @static
 * @memberof module:monoid/Min.Min
 * @return {Min} The empty Min
 *
 * @example
 * const {Min} = require('futils/monoid');
 *
 * Min.empty(); // -> Min(Infinity)
 */
Min.empty = () => Min(Infinity);



/**
 * Concatenates a Min with another using Ord.lt comparison
 * @method concat
 * @memberof module:monoid/Min.Min
 * @param {Min} a The Min instance to concatenate with
 * @return {Min} A new Min
 *
 * @example
 * const {Min} = require('futils/monoid');
 *
 * const min = Min(3);
 *
 * min.concat(Min(2)); // -> Min(2)
 */
Min.fn.concat = function (a) {
    if (Min.is(a)) {
        return this.lt(a) ? this : a;
    }
    throw `Min::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}