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
 * Grants access to the Record monoid. Record can be used to combine multiple
 * key-value pairs into a single one by merging
 * @module monoid/Record
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Record monoid
 * @class module:monoid/Record.Record
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Record} = require('futils/monoid');
 *
 * Record({foo: 1}); // -> Record({ foo :: 1 })
 *
 * Record({foo: 1}).value; // -> { foo :: 1 }
 */
export const Record = Type('Record', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into a Record. Returns the empty Record for values which are no
 * key-value pairs
 * @method of
 * @static
 * @memberOf module:monoid/Record.Record
 * @param {any} a The value to lift
 * @return {Record} A new Record
 *
 * @example
 * const {Record} = require('futils/monoid');
 *
 * Record.of({foo: 1});        // -> Record({ foo :: 1 })
 * Record.of(null);            // -> Record({})
 * Record.of((a) => a * 2);    // -> Record({})
 */
Record.of = (a) => typeOf(a) === 'Object' ? Record(a) : Record({});
/**
 * Monoid implementation for Record. Returns a Record of a empty key-value pair
 * @method empty
 * @static
 * @memberOf module:monoid/Record.Record
 * @return {Record} The empty Record
 *
 * @example
 * const {Record} = require('futils/monoid');
 *
 * Record.empty(); // -> Record({})
 */
Record.empty = () => Record({});



/**
 * Concattenates a Record with another by merging key-value pairs. Please note
 * that this operation might loose data because fields with the same keys will
 * be overriden
 * @method concat
 * @memberOf module:monoid/Record.Record
 * @param {Record} a The Record instance to concattenate with
 * @return {Record} A new Record
 *
 * @example
 * const {Record} = require('futils/monoid');
 *
 * const kv = Record({foo: 1});
 *
 * kv.concat(Record({bar: 2}); // -> Record({ foo :: 1, bar :: 2 })
 * kv.concat(Record({foo: 2}); // -> Record({ foo :: 2 })
 */
Record.prototype.concat = function (a) {
    if (Record.is(a)) {
        return Record(Object.assign({}, this.value, a.value));
    }
    throw `Record::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}