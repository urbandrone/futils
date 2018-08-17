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
 * Grants access to the Max monoid. Max can be used to find the largest item
 * from multiple items by concattenation
 * @module monoid/Max
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Max monoid
 * @class module:monoid/Max.Max
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Max} = require('futils/monoid');
 *
 * Max(1); // -> Max(1)
 *
 * Max(1).value; // -> 1
 */
export const Max = Type('Max', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Max. Casts it to a number if possible or returns a Max
 * of negative Infinity
 * @method of
 * @static
 * @memberOf module:monoid/Max.Max
 * @param {any} a The value to lift
 * @return {Max} A new Max
 *
 * @example
 * const {Max} = require('futils/monoid');
 *
 * Max.of(1);    // -> Max(1)
 * Max.of(null); // -> Max(-Infinity)
 * Max.of({});   // -> Max(-Infinity)
 */
Max.of = (a) => {
    let v = Number(a);
    return typeof v === 'number' && !isNaN(v) ? Max(v) : Max(-Infinity);
}
/**
 * Monoid implementation for Max. Returns a Max of negative Infinity
 * @method empty
 * @static
 * @memberOf module:monoid/Max.Max
 * @return {Max} The empty Max
 *
 * @example
 * const {Max} = require('futils/monoid');
 *
 * Max.empty(); // -> Max(-Infinity)
 */
Max.empty = () => Max(-Infinity);



/**
 * Concattenates a Max with another using Ord.gt comparison
 * @method concat
 * @memberOf module:monoid/Max.Max
 * @param {Max} a The Max instance to concattenate with
 * @return {Max} A new Max
 *
 * @example
 * const {Max} = require('futils/monoid');
 *
 * const max = Max(3);
 *
 * max.concat(Max(2)); // -> Max(3)
 */
Max.prototype.concat = function (a) {
    if (Max.is(a)) {
        return this.gt(a) ? this : a;
    }
    throw `Max::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}