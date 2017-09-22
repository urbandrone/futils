/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isFunc, isVoid, isObject, isArray, isArrayOf, isString} from './types';
import {curry} from './decorators';
import {instance} from './operators';

/**
 * Implementation of a type factory
 * @module newtype
 * @requires types
 * @requires decorators
 * @requires operators
 */

const VAL = Symbol('TypeValue');
const TYPE = Symbol('TypeName');



const matchArrayT = (def, x) => {
    return def.length === x.length &&  x.every((_x, _i) => def[_i](_x));
}


const makeType = (name, def) => {
    function TypeCtor (x) {
        let self = instance(TypeCtor, this);
        self[TYPE] = name;
        if (isFunc(def) && def(x)) {
            self[VAL] = x;
            return self;
        }
        if (isObject(def)) {
            if (Object.keys(def).reduce((b, k) => b && !!def[k](x[k]), true)) {
                self[VAL] = x;
                return self;
            }
        }
        if (isArrayOf(isFunc, def) && isArray(x)) {
            if (def.length > 1 && matchArrayT(def, x)) {
                self[VAL] = x;
                return self;
            }
            if (x.every((_x) => def[0](_x))) {
                self[VAL] = x;
                return self;
            }
        }
        throw `Constructor ${name} got invalid value ${JSON.stringify(x)}`;
    }

    TypeCtor.prototype.toString = function () {
        if (isObject(this[VAL])) {
            const xs = Object.keys(this[VAL]).
                map((k) => this[VAL][k].toString()).
                join(', ');

            return `${name}(${xs})`;
        }
        return `${name}(${this[VAL]})`;
    }

    TypeCtor.prototype.valueOf = function () {
        return this[VAL];
    }

    TypeCtor.prototype.fold = function (f) {
        return f(this[VAL]);
    }

    Object.defineProperty(TypeCtor, 'of', {
        writable: false,
        value: function (x) {
            return new TypeCtor(x);
        }
    });

    Object.defineProperty(TypeCtor, 'is', {
        writable: false,
        value: function (x) {
            return TypeCtor.prototype.isPrototypeOf(x);
        }
    });

    return TypeCtor;
}

/**
 * The Type function allows to create `Types` from descriptors. A descriptor
 *     can either be a function of the form `a -> Boolean`, a array like
 *     [a -> Boolean] or a object in the form {prop: a -> transformation(a),
 *     orElse: a -> ?} where the `orElse` clause handle the case that no pattern
 *     matched. Please note that you can omit the `orElse` clause which restricts
 *     the resulting function to the types provided!
 * @method
 * @version 2.1.0
 * @param {string} name Name of the Type to create
 * @param {function|array|object} def Function or descriptor
 * @return {SubType} A new Type constructor
 *
 * @example
 * const {Type, field, isArrayOf, isDate, isString} = require('futils');
 *
 * const Page = Type('Page', {
 *     date: isDate,
 *     title: isString,
 *     text: isString
 * });
 * 
 * const Chapter = Type('Chapter', {
 *     title: isString,
 *     pages: isArrayOf(Page.is)
 * });
 *
 * const title = field('title');
 * const format = Type.cata({
 *     Page: (e) => `${e.title} written on ${e.date.toISOString()}: ${e.text}`,
 *     Chapter: (c) => `- ${c.title} -\n ` + c.pages.map(title).join('\n'),
 *     orElse: () => ''
 * });
 *
 * 
 * let page = Page({
 *     title: 'First page',
 *     date: new Date(),
 *     text: 'A text page.'
 * });
 * 
 * let chapter = Chapter({title: 'Chapter 1', pages: [page]});
 *
 * format(page); // -> 'First page written on 2017-01-19: A text page.'
 * format(chapter); // -> '- Chapter 1 -\n First page\n'
 * format(null); // -> ''
 */
const Type = curry(makeType);


Type.isType = (a) => isObject(a) &&
                     !isVoid(a[VAL]) &&
                     isString(a[TYPE]);


Type.cata = curry((cases, tval) => {
    if (Type.isType(tval) && isFunc(cases[tval[TYPE]])) {
        return cases[tval[TYPE]](tval[VAL]);
    }
    if (isFunc(cases.orElse)) { // has orElse clause?
        return cases.orElse(Type.isType(tval) ? tval[VAL] : tval);
    }
    throw `Type.cata :: Unable to pattern match ${tval}`;
});



export default Type;