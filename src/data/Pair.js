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




/*
 * @module data
 */



/**
 * The Pair data type. Pair acts 
 * @class module:data.Pair
 * @extends module:generics.Show
 * @static
 * @version 3.1.0
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * Pair(1, 2); // -> Pair(_1: 1, _2: 2)
 *
 * Pair(1, 2)._1; // -> 1
 * Pair(1, 2)._2; // -> 2
 */
export const Pair = UnionType('Pair', ['_1', '_2']).
    deriving(Show);



/**
 * Lifts two values into a Pair. This method is curried
 * @method from
 * @static
 * @memberof module:data.Pair
 * @param {any} a The first value to lift
 * @param {any} b The second value to lift
 * @return {Pair} The values wrapped in a Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * Pair.from(1, 'a'); // -> Pair(_1: 1, _2: 'a')
 * Pair.from(1);      // -> a => Pair(_1: 1, _2: a)
 */
Pair.from = (a, b) => {
    return b === void 0 ? c => Pair.from(a, c) :
                          Pair(a, b);
}
/**
 * Lifts two values into a Pair from the right. This method is curried
 * @method fromRight
 * @static
 * @memberof module:data.Pair
 * @param {any} a The second value to lift
 * @param {any} b The first value to lift
 * @return {Pair} The values wrapped in a Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * Pair.fromRight(1, 'a'); // -> Pair(_1: 'a', _2: 1)
 * Pair.fromRight(1);      // -> a => Pair(_1: a, _2: 1)
 */
Pair.fromRight = (b, a) => {
    return a === void 0 ? c => Pair.fromRight(b, c) :
                          Pair(a, b);
}



/**
 * Concatenates a Pair with another. Please note, that the inner values have
 * to be part of a Semigroup as well for concattenation to succeed
 * @method concat
 * @memberof module:data.Pair
 * @instance
 * @param {Pair} a The Pair instance to concatenate with
 * @return {Pair} A new Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * const h = Pair('hello', 'how');
 * const w = Pair('world', 'are you today?');
 * const s = Pair(' ', ' ');
 *
 * h.concat(s).concat(w); // -> Pair('hello world', 'how are you today?')
 */
Pair.fn.concat = function (a) {
    if (Pair.is(a)) {
        return Pair(this._1.concat(a._1), this._2.concat(a._2));
    }
    throw `Pair::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}