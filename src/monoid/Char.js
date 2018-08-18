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
 * Grants access to the Char monoid. Char can be used to combine multiple items
 * into a string
 * @module monoid/Char
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Char monoid
 * @class module:monoid/Char.Char
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Char} = require('futils/monoid');
 *
 * Char('abc'); // -> Char('abc')
 *
 * Char('abc').value; // -> 'abc'
 */
export const Char = Type('Char', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Char. Returns the empty Char for all values which are
 * no strings
 * @method of
 * @static
 * @memberof module:monoid/Char.Char
 * @param {any} a The value to lift
 * @return {Char} A new Char
 *
 * @example
 * const {Char} = require('futils/monoid');
 *
 * Char.of('abc');    // -> Char('abc')
 * Char.of(null); // -> Char('')
 * Char.of({});   // -> Char('')
 */
Char.of = (a) => typeof a === 'string' ? Char(a) : Char('');
/**
 * Monoid implementation for Char. Returns a Char of an empty string
 * @method empty
 * @static
 * @memberof module:monoid/Char.Char
 * @return {Char} The empty Char
 *
 * @example
 * const {Char} = require('futils/monoid');
 *
 * Char.empty(); // -> Char('')
 */
Char.empty = () => Char('');



/**
 * Concattenates a Char with another using string concattenation
 * @method concat
 * @memberof module:monoid/Char.Char
 * @param {Char} a The Char instance to concattenate with
 * @return {Char} A new Char
 *
 * @example
 * const {Char} = require('futils/monoid');
 *
 * const ch = Char('a');
 *
 * ch.concat(Char('b')); // -> Char('ab')
 */
Char.fn.concat = function (a) {
    if (Char.is(a)) {
        return Char(this.value.concat(a.value));
    }
    throw `Char::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}