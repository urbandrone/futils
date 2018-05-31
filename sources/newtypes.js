/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isFunc, isNil, isObject, isArray, isArrayOf, isString} from './types';
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

const ERROR = {
    NO_NAME: `Type awaits string and definition as arguments.
>   Name is missing or empty string.`,
    NO_DEF: `Type awaits string and definition as argument.
>   Definition is missing or none of:
    - Function (x) => boolean
    - Object of pairs {key: (x) => boolean}
    - Array of functions [(x) => boolean]`
}



const matchDef = (def, val) => {
    if (isFunc(def) && def(val)) {
        return true;
    }
    if (isArrayOf(isFunc, def) && isArray(val)) {
        if (def.length > 1) {
            return def.length === val.length && def.every((d, i) => d(val[i]));
        }
        return val.every((v) => def[0](v));
    }
    if (isObject(def) && isObject(val)) {
        return Object.keys(def).reduce((b, k) => {
            return b && !isNil(val[k]) && def[k](val[k]);
        }, true);
    }
    return false;
}



const makeType = (name, def) => {
    if (!isString(name) || name.trim() === '') {
        throw ERROR.NO_NAME;
    }
    if (!isFunc(def) && !isObject(def) && !isArrayOf(isFunc, def)) {
        throw ERROR.NO_DEF;
    }

    function TypeCtor (x) {
        let self = instance(TypeCtor, this);
        self[TYPE] = name;
        if (matchDef(def, x)) {
            self[VAL] = x;
            return self;
        }
        throw `Type ${name} got invalid value ${JSON.stringify(x)}`;
    }
    Object.defineProperties(TypeCtor, {
        of: {
            writable: false,
            enumerable: true,
            value: function (x) {
                return new TypeCtor(x);
            }
        },
        is: {
            writable: false,
            enumerable: true,
            value: function (x) {
                return TypeCtor.prototype.isPrototypeOf(x);
            }
        }
    });
    Object.defineProperties(TypeCtor.prototype, {
        toString: {
            writable: false,
            enumerable: true,
            value: function () {
                if (isObject(this[VAL])) {
                    return `${name}(${Object.keys(this[VAL]).reduce((a, k) => {
                        return !a ?
                               this[VAL][k].toString() :
                               `${a}, ${this[VAL][k].toString()}`;
                    }, '')})`;
                }
                return `${name}(${this[VAL].toString()})`;
            }
        },
        valueOf: {
            writable: false,
            enumerable: true,
            value: function () {
                return this[VAL];
            }
        },
        fold: {
            writable: false,
            enumerable: true,
            value: function (f, x) {
                if (isFunc(f)) {
                    return f(this[VAL], x);
                }
                throw `${name}::fold expected argument to be function but saw ${f}`;
            }
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
 * 
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


Type.isType = (a) => !isNil(a) &&
                     !isNil(a[VAL]) &&
                     isString(a[TYPE]);


Type.cata = curry((cases, tval) => {
    if (tval != null) {
        if (Type.isType(tval) && isFunc(cases[tval[TYPE]])) {
            return cases[tval[TYPE]](tval[VAL]);
        }
        if (isFunc(cases[tval.constructor.name])) {
            return cases[tval.constructor.name](tval);
        }
    }
    if (isFunc(cases.orElse)) { // has orElse clause?
        return cases.orElse(Type.isType(tval) ? tval[VAL] : tval);
    }
    throw `Type.cata :: Unable to pattern match ${tval}`;
});



export default Type;