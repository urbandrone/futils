/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from './types';
import decorators from './decorators';
import operators from './operators';

/**
 * Implementation of a Union type factory
 * @module futils/uniontypes
 * @requires futils/types
 * @requires futils/decorators
 * @requires futils/operators
 */

const VAL = Symbol('TypeValue');
const TYPE = Symbol('TypeName');



const makeType = (name, def) => {
    function TypeCtor (x) {
        let self = operators.instance(TypeCtor, this);
        if (TypeCtor.typeOf(x)) {
            self[VAL] = x;
            self[TYPE] = name;
            return self;
        }
        throw new TypeError(`${name} constructor matched invalid ${x}`);
    }

    TypeCtor.prototype.toString = function () {
        return `${name}(${this[VAL]})`;
    }

    TypeCtor.prototype.valueOf = function () {
        return this[VAL];
    }

    TypeCtor.prototype.fold = function (f) {
        return f(this[VAL]);
    }

    TypeCtor.typeOf = function (x) {
        if (type.isFunc(def)) {
            return !!def(x);
        }
        if (type.isObject(def)) {
            return Object.keys(def).reduce(
                (b, k) => b && !!def[k](x[k]),
                true
            );
        }
        return false;
    }

    return TypeCtor;
}

/**
 * The Type function allows to create `Union-Types` from descriptors. A descriptor
 *     can either be a function of the form `a -> Boolean` or a object in the
 *     form Object(TypeName: a -> transformation(a), orElse: a -> ? ) where
 *     the `orElse` clause handle the case that no pattern key matched (this is
 *     better known as a catamorphism). Please note that you cannot omit the
 *     `orElse` clause!
 * @method
 * @version 2.1.0
 * @param {string} name Name of the Type to create
 * @param {function|object} def Function or descriptor
 * @return {SubType} A new Type constructor
 *
 * @example
 * const {Type, compose, isArray} = require('futils');
 *
 * const List = Type('List', isArray);
 *
 * List.fold = Type.cata({
 *     List: (xs) => xs,
 *     orElse: () => []
 * });
 *
 * 
 * const ns = List([1, 2, 3]);
 *
 * Type.isType(ns); // -> true
 * 
 * List.fold(ns); // -> [2, 3, 4]
 * List.fold(null); // -> []
 */
const Type = decorators.curry((name, def) => {
    return makeType(name, def);
});


Type.isType = (a) => type.isObject(a) &&
                     !type.isVoid(a[VAL]) &&
                     type.isString(a[TYPE]);


Type.cata = decorators.curry((cases, tval) => {
    if (type.isFunc(cases.orElse)) { // no orElse clause?
        if (Type.isType(tval)) { // is tval a Type?
            if (type.isFunc(cases[tval[TYPE]])) { // is there a case for tval?
                return cases[tval[TYPE]](tval[VAL]);
            }
            return cases.orElse(tval[VAL]);
        }
        return cases.orElse(tval);
    }
    throw `Type.cata :: Found no "orElse" case in ${cases}`;
});



export default Type;