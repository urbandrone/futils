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




/**
 * Grants access to the Fn monoid. Fn can be used to combine multiple functions
 * into a single function
 * @module monoid/Fn
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 */



/**
 * The Fn monoid
 * @class module:monoid/Fn.Fn
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Fn} = require('futils/monoid');
 *
 * Fn((a) => a); // -> Fn(a -> a)
 *
 * Fn((a) => a).value; // -> (a -> a)
 */
export const Fn = Type('Fn', ['value']).
    deriving(Show, Eq);



/**
 * Lifts a value into a Fn. Returns the empty Fn for values which are no
 * functions
 * @method of
 * @static
 * @memberof module:monoid/Fn.Fn
 * @param {any} a The value to lift
 * @return {Fn} A new Fn
 *
 * @example
 * const {Fn} = require('futils/monoid');
 *
 * Fn.of((a) => a * 2);    // -> Fn(a -> a * 2)
 * Fn.of(null);            // -> Fn(a -> a)
 * Fn.of({});              // -> Fn(a -> a)
 */
Fn.of = (a) => typeof a === 'function' ? Fn(a) : Fn(x => x);
/**
 * Monoid implementation for Fn. Returns a Fn of the id function (a -> a)
 * @method empty
 * @static
 * @memberof module:monoid/Fn.Fn
 * @return {Fn} The empty Fn
 *
 * @example
 * const {Fn} = require('futils/monoid');
 *
 * Fn.empty(); // -> Fn(a -> a)
 */
Fn.empty = () => Fn(a => a);



/**
 * Concattenates a Fn with another using function composition
 * @method concat
 * @memberof module:monoid/Fn.Fn
 * @param {Fn} a The Fn instance to concattenate with
 * @return {Fn} A new Fn
 *
 * @example
 * const {Fn} = require('futils/monoid');
 *
 * const fn = Fn((a) => a * 2);
 *
 * fn.concat(Fn((a) => a * 3)); // -> Fn(a -> a * 2 * 3)
 */
Fn.fn.concat = function (a) {
    if (Fn.is(a)) {
        return Fn(x => a.value(this.value(x)));
    }
    throw `Fn::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}