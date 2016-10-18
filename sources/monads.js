/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from './types';
import arity from './arity';
import decorators from './decorators';
import Identity from './monads/Identity';
import Maybe from './monads/Maybe';
import Either from './monads/Either';
import IO from './monads/IO';

/**
 * 
 */

const liftA2 = decorators.curry((f, M1, M2) => {
    return M1.map(f).ap(M2);
});

const liftA3 = decorators.curry((f, M1, M2, M3) => {
    return M1.map(f).ap(M2).ap(M3);
});

const liftA4 = decorators.curry((f, M1, M2, M3, M4) => {
    return M1.map(f).ap(M2).ap(M3).ap(M4);
});

const liftA5 = decorators.curry((f, M1, M2, M3, M4, M5) => {
    return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5);
});

const liftA6 = decorators.curry((f, M1, M2, M3, M4, M5, M6) => {
    return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5).ap(M6);
});

const liftA7 = decorators.curry((f, M1, M2, M3, M4, M5, M6, M7) => {
    return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5).ap(M6).ap(M7);
});



export default {
    Identity: Identity,
    IO: IO,
    Some: Maybe.Some,
    None: Maybe.None,
    Maybe: Maybe,
    Right: Either.Right,
    Left: Either.Left,
    Either: Either,
    liftA2: liftA2,
    liftA3: liftA3,
    liftA4: liftA4,
    liftA5: liftA5,
    liftA6: liftA6,
    liftA7: liftA7
    // mmaybe, meither, 
};