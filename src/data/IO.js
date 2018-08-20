/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {Type} from '../adt';




/**
 * Grants access to the IO data structure, which is used to describe computations
 * that perform unpure interactions with the outer world
 * @module data/IO
 * @requires adt
 */



/**
 * The IO data structure
 * @class module:data/IO.IO
 * @version 3.0.0
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const envA = (key) => IO(() => process[key]);
 * const envB = IO((key) => process[key]);
 * const envC = (key) => IO((data) => data[key]);
 *
 * envA('arch').run();        // -> <architecture>
 * envB.run('arch');          // -> <architecture>
 * envC('arch').run(process); // -> <architecture>
 */
export const IO = Type('IO', ['run']);



/**
 * Lifts a value into a IO
 * @method of
 * @static
 * @memberof module:data/IO.IO
 * @param {any} a The value to lift
 * @return {IO} The value wrapped into a IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * IO.of(1); // -> IO(_ -> 1)
 */
IO.of = (a) => IO(() => a);
/**
 * Monoid implementation for IO. Returns a IO that returns what is passed to it
 * @method empty
 * @static
 * @memberof module:data/IO.IO
 * @return {IO} A IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * IO.empty(); // -> IO(a -> a)
 */
IO.empty = () => IO((a) => a);
/**
 * Lifts a value into a IO. Similiar to IO.of, but if the value is a function
 * it is used as computation basis
 * @method from
 * @static
 * @memberof module:data/IO.IO
 * @param {any} a The value to lift
 * @return {IO} A IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const inc = (n) => n + 1;
 *
 * IO.from(1);   // -> IO(_ -> 1)
 * IO.from(inc); // -> IO(n -> n + 1)
 */
IO.from = (a) => typeof a === 'function' ? IO(a) : IO.of(a);
/**
 * A natural transformation from an Either.Left or Either.Right into a IO
 * @method fromEither
 * @static
 * @memberof module:data/IO.IO
 * @param {Left|Right} a The Either to transform
 * @return {IO} A IO with the value of the Either
 *
 * @example
 * const {IO, Either} = require('futils/data');
 *
 * const l = Either.Left('a left');
 * const r = Either.Right('a right');
 *
 * IO.fromEither(l); // -> IO(_ -> 'a left')
 * IO.fromEither(r); // -> IO(_ -> 'a right')
 */
IO.fromEither = (a) => IO.of(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a IO
 * @method fromMaybe
 * @static
 * @memberof module:data/IO.IO
 * @param {Some|None} a The Maybe to transform
 * @return {IO} A IO with the value of the Maybe.Some or null
 *
 * @example
 * const {IO, Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a some');
 * const none = Maybe.None();
 *
 * IO.fromMaybe(some); // -> IO(_ -> 'a some')
 * IO.fromMaybe(none); // -> IO(_ -> null)
 */
IO.fromMaybe = (a) => IO.of(a.value);
/**
 * A natural transformation from a List into a IO. Please note that this
 * transformation looses data, because only the first element of the list is
 * taken
 * @method fromList
 * @static
 * @memberof module:data/IO.IO
 * @param {List} a The List to transform
 * @return {IO} A IO with the first value
 *
 * @example
 * const {IO, List} = require('futils/data');
 *
 * const ls = List.of(2).cons(1);
 *
 * IO.fromList(ls); // -> IO(_ -> 1)
 */
IO.fromList = (a) => IO.of(a.head);
/**
 * A natural transformation from a Series into a IO. Please note that this
 * transformation looses data, because only the first element of the series is
 * taken
 * @method fromSeries
 * @static
 * @memberof module:data/IO.IO
 * @param {Series} a The Series to transform
 * @return {IO} A IO with the first value
 *
 * @example
 * const {IO, Series} = require('futils/data');
 *
 * const ls = Series.of(1, 2);
 *
 * IO.fromSeries(ls); // -> IO(_ -> 1)
 */
IO.fromSeries = (a) => IO.of(a.value[0] == null ? null : a.value[0]);
/**
 * A natural transformation from an Id into a IO
 * @method fromId
 * @static
 * @memberof module:data/IO.IO
 * @param {Id} a The Id to transform
 * @return {IO} A IO with the value of the Id
 *
 * @example
 * const {IO, Id} = require('futils/data');
 *
 * const id = Id.of(1);
 *
 * IO.fromId(id); // -> IO(_ -> 1)
 */
IO.fromId = (a) => IO.of(a.value);



/**
 * Concattenates a IO with another
 * @method concat
 * @memberof module:data/IO.IO
 * @param {IO} a The IO to concattenate with
 * @return {IO} Result of concattening the IO with the given one
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const ioProcess = IO.of(process);
 * const ioArch = IO((p) => p.arch);
 *
 * ioProcess.concat(ioArch); // -> IO(_ -> <architecture>)
 */
IO.fn.concat = function (a) {
    if (IO.is(a)) {
        return IO((v) => a.run(this.run(v)));
    }
    throw `IO::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over the value in a IO
 * @method map
 * @memberof module:data/IO.IO
 * @param {Function} f The function to map
 * @return {IO} A IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const io = IO.of(1);
 *
 * const inc = (n) => n + 1;
 *
 * io.map(inc); // -> IO(_ -> 2)
 */
IO.fn.map = function (f) {
    return IO((v) => f(this.run(v)));
}
/**
 * Flattens a nested IO by one level
 * @method flat
 * @memberof module:data/IO.IO
 * @return {IO} A flattened IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * cons io = IO.of(IO.of(1));
 *
 * io.flat(); // -> IO(_ -> 1)
 */
IO.fn.flat = function () {
    return this.run();
}
/**
 * Maps a IO returning function over a IO and flattens the result
 * @method flatMap
 * @memberof module:data/IO.IO
 * @param {Function} f A IO returning function to map
 * @return {IO} A new IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const io = IO.of(1);
 *
 * const inc = (n) => IO.of(n + 1);
 *
 * io.flatMap(inc); // -> IO(_ -> 2)
 */
IO.fn.flatMap = function (f) {
    return this.map(f).flat();
}
/**
 * Applies a function in an IO to a value in another IO
 * @method ap
 * @memberof module:data/IO.IO
 * @param {IO} a The IO that holds the value
 * @return {IO} IO which contains the result of applying the function
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const io = IO.of(1);
 *
 * const mInc = IO.of((n) => n + 1);
 *
 * mInc.ap(io); // -> IO(_ -> 2)
 */
IO.fn.ap = function (a) {
    return a.map(this.run);
}
/**
 * Contravariant functor implementation, contramaps a function over the value 
 * passed into the IO
 * @method contraMap
 * @memberof module:data/IO.IO
 * @param {Function} f The function to contramap with
 * @return {IO} A new IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const io = IO.empty();
 *
 * const len = (xs) => xs.length;
 *
 * io.contraMap(len).run([1, 2]); // -> 2
 */
IO.fn.contraMap = function (f) {
    return IO((v) => this.run(f(v)));
}
/**
 * Profunctor implementation, contramaps the first function over the value given
 * into the IO and maps the second function over the result
 * @method proMap
 * @memberof module:data/IO.IO
 * @param {Function} f The function to contramap
 * @param {Function} g The function to map
 * @return {IO} A new IO
 *
 * @example
 * const {IO} = require('futils/data');
 *
 * const io = IO.empty();
 *
 * const even = (n) => n % 2 === 0;
 *
 * const len = (xs) => xs.length;
 *
 * io.proMap(len, even).run([1, 2]); // -> true
 */
IO.fn.proMap = function (f, g) {
    return IO((v) => g(this.run(f(v))));
}