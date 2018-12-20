/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';
import {UnionType} from '../adt';




/*
 * @module data
 */



/**
 * The Free union type can be used to transform any
 * structure into a monad. This means, Free can be used to create DSLs or custom
 * interpreters for actions. It is hard to understand Free just by looking at it's
 * documentation, so make sure to also read the tutorial on github
 * @class module:data.Free
 * @static
 * @version 3.0.0
 * 
 * @example
 * const {Free} = require('futils').data;
 * const {Cont, Return} = Free;
 *
 * Free.Cont(1, Free.Return); // -> Cont(1)
 * Cont(1, Return);           // -> Cont(1)
 *
 * Free.Return(1);            // -> Return(1)
 * Return(1);                 // -> Return(1)
 */
export const Free = UnionType('Free', {Cont: ['value', 'run'], Return: ['value']});
const {Cont, Return} = Free;



/**
 * Lifts a value into a Free.Return
 * @method of
 * @memberof module:data.Free
 * @static
 * @param {any} a The value to lift
 * @return {Return} A Free.Return instance
 *
 * @example
 * const {Free} = require('futils').data;
 *
 * // TODO
 */
Free.of = Return;
/**
 * Lifts a structure into a Free.Cont
 * @method liftM
 * @static
 * @memberof module:data.Free
 * @param {any} a The structure
 * @return {Cont} A Free.Cont instance
 *
 * @example
 * const {Free} = require('futils').data;
 *
 * // TODO
 */
Free.liftM = a => Cont(a, Return);
/**
 * A shortcut version of Free.liftM, takes a constructor function and returns a
 * lifted function which puts the resulting structure into a Free.Cont
 * @method from
 * @static
 * @memberof module:data.Free
 * @param {Function} F The constructor function to lift
 * @return {Cont} A Free.Cont instance
 *
 * @example
 * const {Free} = require('futils').data;
 *
 * // TODO
 */
Free.from = F => arity(F.length, (...xs) => Free.liftM(F(...xs)));



/**
 * Maps a function over a Free.Return or a Free.Cont and returns a new Free
 * @method map
 * @memberof module:data.Free
 * @instance
 * @param {Function} f The function to map
 * @return {Return|Cont} A new Free
 *
 * @example
 * const {Free} = require('futils').data;
 *
 * // TODO
 */
Free.fn.map = function (f) {
    return this.caseOf({
        Return: (v) => Return(f(v)),
        Cont: (v, run) => Cont(v, x => run(x).map(f))
    });
}
/**
 * Maps a Free returning function over a Free.Return or Free.Cont and flattens
 * the result
 * @method flatMap
 * @memberof module:data.Free
 * @instance
 * @param {Function} f A Free returning function to map
 * @return {Return|Cont} A new Free
 *
 * @example
 * const {Free} = require('futils').data;
 *
 * // TODO
 */
Free.fn.flatMap = function (f) {
    return this.caseOf({
        Return: (v) => f(v),
        Cont: (v, run) => Cont(v, x => run(x).flatMap(f)) 
    });
}
/**
 * Free applicative implementation, applies a function in a Free to a value in
 * another Free
 * @method ap
 * @memberof module:data.Free
 * @instance
 * @param {Return|Cont} a The Free that holds the value
 * @return {Return|Cont} Free which returns the result of applying the function
 *
 * @example
 * const {Free} = require('futils').data;
 *
 * // TODO
 */
Free.fn.ap = function (a) {
    return this.caseOf({
        Return: (run) => a.map(run),
        Cont: (v, run) => Cont(v, x => run(x).ap(a))
    });
}
/**
 * If given a interpreter function, which should be a natural transformation,
 * interprets the computation build with Free
 * @method interpret
 * @memberof module:data.Free
 * @instance
 * @param {Function} transform The interpreter function
 * @param {ApplicativeMonad} A The data structure to interpret into
 * @return {ApplicativeMonad} A data structure which holds the result
 *
 * @example
 * const {Free, Id} = require('futils').data;
 *
 * // TODO
 */
Free.fn.interpret = function (transform, A) {
    return this.caseOf({
        Return: (v) => A.of(v),
        Cont: (v, run) => v == null ?
                run().interpret(transform, A) :
                transform(v).flatMap(x => run(x).interpret(transform, A))
    });
}