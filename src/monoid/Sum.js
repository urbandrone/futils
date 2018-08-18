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
 * Grants access to the Sum monoid. Sum can be used to sum up multiple numbers
 * into a final number via concattenation
 * @module monoid/Sum
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Sum monoid
 * @class module:monoid/Sum.Sum
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Sum} = require('futils/monoid');
 *
 * Sum(1); // -> Sum(1)
 *
 * Sum(1).value; // -> 1
 */
export const Sum = Type('Sum', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Sum. Casts it to a number if possible or returns a Sum
 * of 0
 * @method of
 * @static
 * @memberof module:monoid/Sum.Sum
 * @param {any} a The value to lift
 * @return {Sum} A new Sum
 *
 * @example
 * const {Sum} = require('futils/monoid');
 *
 * Sum.of(1);    // -> Sum(1)
 * Sum.of(null); // -> Sum(0)
 * Sum.of({});   // -> Sum(0)
 */
Sum.of = (a) => {
    let v = Number(a);
    return typeof v === 'number' && !isNaN(v) ? Sum(v) : Sum(0);
}
/**
 * Monoid implementation for Sum. Returns a Sum of 0
 * @method empty
 * @static
 * @memberof module:monoid/Sum.Sum
 * @return {Sum} The empty Sum
 *
 * @example
 * const {Sum} = require('futils/monoid');
 *
 * Sum.empty(); // -> Sum(0)
 */
Sum.empty = () => Sum(0);



/**
 * Concattenates a Sum with another using addition
 * @method concat
 * @memberof module:monoid/Sum.Sum
 * @param {Sum} a The Sum instance to concattenate with
 * @return {Sum} A new Sum
 *
 * @example
 * const {Sum} = require('futils/monoid');
 *
 * const sum = Sum(1);
 *
 * sum.concat(Sum(1)); // -> Sum(2)
 */
Sum.fn.concat = function (a) {
    if (Sum.is(a)) {
        return Sum(this.value + a.value);
    }
    throw `Sum::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}