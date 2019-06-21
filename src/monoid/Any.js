// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import {typeOf} from '../core/typeof';
import {Type} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';




/*
 * @module monoid
 */



/**
 * The Any monoid. Any can be used to check of any of multiple
 * items are true
 * @class module:monoid.Any
 * @extends module:generics/Show
 * @extends module:generics/Eq
 * @extends module:generics/Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Any} = require('futils').monoid;
 *
 * Any(true); // -> Any(true)
 *
 * Any(true).value; // -> true
 */
export const Any = Type('Any', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Any. Returns the empty Any for values which are no booleans
 * @method of
 * @static
 * @memberof module:monoid.Any
 * @param {any} a The value to lift
 * @return {Any} A new Any
 *
 * @example
 * const {Any} = require('futils').monoid;
 *
 * Any.of(true);    // -> Any(true)
 * Any.of(null); // -> Any(false)
 * Any.of({});   // -> Any(false)
 */
Any.of = (a) => typeof a === 'boolean' ? Any(a) : Any(false);
/**
 * Monoid implementation for Any. Returns a Any of false
 * @method empty
 * @static
 * @memberof module:monoid.Any
 * @return {Any} The empty Any
 *
 * @example
 * const {Any} = require('futils').monoid;
 *
 * Any.empty(); // -> Any(false)
 */
Any.empty = () => Any(false);



/**
 * Concatenates a Any with another using boolean comparison
 * @method concat
 * @memberof module:monoid.Any
 * @instance
 * @param {Any} a The Any instance to concatenate with
 * @return {Any} A new Any
 *
 * @example
 * const {Any} = require('futils').monoid;
 *
 * const any = Any(true);
 *
 * any.concat(Any(false)); // -> Any(true)
 */
Any.fn.concat = function (a) {
    if (Any.is(a)) {
        return !this.value ? Any(!!a.value) : this;
    }
    throw `Any::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}