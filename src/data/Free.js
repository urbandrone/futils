/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';
import {UnionType} from '../adt';



export const Free = UnionType('Free', {Cont: ['value', 'run'], Return: ['value']});
const {Cont, Return} = Free;



Free.of = Return;
Free.liftM = a => Cont(a, Return);
Free.from = F => arity(F.length, (...xs) => Free.liftM(F(...xs)));

Free.fn.map = function (f) {
    return this.caseOf({
        Return: (v) => Return(f(v)),
        Cont: (v, run) => Cont(v, x => run(x).map(f))
    });
}

Free.fn.flatMap = function (f) {
    return this.caseOf({
        Return: (v) => f(v),
        Cont: (v, run) => Cont(v, x => run(x).flatMap(f)) 
    });
}

Free.fn.ap = function (a) {
    return this.caseOf({
        Return: (run) => a.map(run),
        Cont: (v, run) => Cont(v, x => run(x).ap(a))
    });
}

Free.fn.interpret = function (transform, A) {
    return this.caseOf({
        Return: (v) => A.of(v),
        Cont: (v, run) => v == null ?
                run().interpret(transform, A) :
                transform(v).flatMap(x => run(x).interpret(transform, A))
    });
}