// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { typeOf } from '../core/typeof';
import { Type } from '../adt';
import { Show } from '../generics/Show';

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
export const Pair = Type('Pair', ['_1', '_2']).deriving(Show);

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
 * Pair.from(1);    // -> a => Pair(_1: 1, _2: a)
 */
Pair.from = (a, b) => {
  return b === void 0 ? c => Pair.from(a, c) : Pair(a, b);
};

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
 * Pair.fromRight(1);    // -> a => Pair(_1: a, _2: 1)
 */
Pair.fromRight = (b, a) => {
  return a === void 0 ? c => Pair.fromRight(b, c) : Pair(a, b);
};

/**
 * Concatenates a Pair with another. Please note, that the inner values have
 * to be part of a Semigroup as well for concatenation to succeed
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
Pair.fn.concat = function(a) {
  if (Pair.is(a)) {
    return Pair(this._1.concat(a._1), this._2.concat(a._2));
  }
  throw `Pair::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
};

/**
 * Maps a function over the second value of a Pair and returns a new Pair
 * @method map
 * @memberof module:data.Pair
 * @instance
 * @param {Function} f The function to map
 * @return {Pair} A new Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * const inc = a => a + 1;
 *
 * Pair(1, 1).map(inc); // -> Pair(1, 2)
 */
Pair.fn.map = function(f) {
  return Pair(this._1, f(this._2));
};

/**
 * If given a function that takes a Pair and returns a value, returns a Pair
 * @method extend
 * @memberof module:data.Pair
 * @instance
 * @param {Function} f A function taking a Pair
 * @return {Pair} A new Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * const addFstSnd = ({ _1, _2 }) => _1 + _2;
 *
 * Pair(1, 1).extend(addFstSnd); // -> Pair(1, 2)
 */
Pair.fn.extend = function(f) {
  return Pair(this._1, f(this));
};

/**
 * Returns the first value of a Pair
 * @method fst
 * @memberof module:data.Pair
 * @instance
 * @return {any} The first value of the Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * Pair(1, 2).fst(); // -> 1
 */
Pair.fn.fst = function() {
  return this._1;
};

/**
 * Returns the second value of a Pair
 * @method snd
 * @memberof module:data.Pair
 * @instance
 * @return {any} The second value of the Pair
 *
 * @example
 * const {Pair} = require('futils').data;
 *
 * Pair(1, 2).snd(); // -> 2
 */
Pair.fn.snd = function() {
  return this._2;
};
