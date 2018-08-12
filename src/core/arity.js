/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


export const arity = (n, f) => {
    if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) {
        throw `Aritiy of a function cannot be ${n}`;
    }
    if (typeof f !== 'function') {
        throw `${f} does not have some arity, only functions have`;
    }
    switch (Math.abs(n)) {
        case 1:
            return (a) => f(a);
        case 2:
            return (a, b) => f(a, b);
        case 3:
            return (a, b, c) => f(a, b, c);
        case 4:
            return (a, b, c, d) => f(a, b, c, d);
        case 5:
            return (a, b, c, d, e) => f(a, b, c, d, e);
        case 6:
            return (a, b, c, d, e, g) => f(a, b, c, d, e, g);
        case 7:
            return (a, b, c, d, e, g, h) => f(a, b, c, d, e, g, h);
        case 8:
            return (a, b, c, d, e, g, h, i) => f(a, b, c, d, e, g, h, i);
        case 9:
            return (a, b, c, d, e, g, h, i, j) => {
                return f(a, b, c, d, e, g, h, i, j);
            }
        case 10:
            return (a, b, c, d, e, g, h, i, j, k) => {
                return f(a, b, c, d, e, g, h, i, j, k);
            }
        case 11:
            return (a, b, c, d, e, g, h, i, j, k, l) => {
                return f(a, b, c, d, e, g, h, i, j, k, l);
            }
        case 12:
            return (a, b, c, d, e, g, h, i, j, k, l, m) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m);
            }
        case 13:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o);
            }
        case 14:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o, p) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o, p);
            }
        case 15:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o, p, q) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o, p, q);
            }
        case 16:
            return (a, b, c, d, e, g, h, i, j, k, l, m, o, p, q, r) => {
                return f(a, b, c, d, e, g, h, i, j, k, l, m, o, p, q, r);
            }
        default:
            return f;
    }
}