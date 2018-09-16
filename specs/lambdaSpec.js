const L = require('../dist/lambda');



describe('Lambda', () => {
    describe('compose', () => {
        it('should be able to compose multiple unary functions', () => {
            let f = a => a.split('').reverse().join('');
            let g = a => a.toUpperCase();
            let h = L.compose(f, g);
            expect(h('hello')).toBe('OLLEH');
        });

        it('should preserve the arity', () => {
            let f = a => a;
            let g = (a, _) => a;
            let h = L.compose(f, g);
            expect(h.length).toBe(2);
        });
    });

    describe('pipe', () => {
        it('should be able to compose multiple unary functions', () => {
            let f = a => a.split('').reverse().join('');
            let g = a => a.toUpperCase();
            let h = L.pipe(g, f);
            expect(h('hello')).toBe('OLLEH');
            expect(h.length).toBe(1);
        });

        it('should preserve the arity', () => {
            let f = a => a;
            let g = (a, _) => a;
            let h = L.pipe(g, f);
            expect(h.length).toBe(2);
        });
    });

    describe('constant', () => {
        it('should return a constant function', () => {
            let f = L.constant(1);
            expect(f()).toBe(1);
        });
    });

    describe('curry', () => {
        it('should curry functions from the left', () => {
            let f = L.curry((a, b, c) => a + b + c);
            expect(f('a', 'b', 'c')).toBe('abc');
            expect(f('a')('b')('c')).toBe('abc');
            expect(f()('a')('b', 'c')).toBe('abc');
            expect(f('a', 'b')('c')).toBe('abc');
            expect(f('a')('b')()('c')).toBe('abc');
        });

        it('should preserve the arity', () => {
            let f = L.curry((a, b, c) => a + b + c);
            let g = L.curry(f);
            expect(f.length).toBe(3);
            expect(f('a').length).toBe(2);
            expect(g.length).toBe(3);
            expect(g('a').length).toBe(2);
        });
    });

    describe('curryRight', () => {
        it('should curry functions from the right', () => {
            let f = L.curryRight((a, b, c) => a + b + c);
            expect(f('a', 'b', 'c')).toBe('cba');
            expect(f('a')('b')('c')).toBe('cba');
            expect(f()('a')('b', 'c')).toBe('cba');
            expect(f('a', 'b')('c')).toBe('cba');
            expect(f('a')('b')()('c')).toBe('cba');
        });

        it('should preserve the arity', () => {
            let f = L.curryRight((a, b, c) => a + b + c);
            let g = L.curryRight(f);
            expect(f.length).toBe(3);
            expect(f('a').length).toBe(2);
            expect(g.length).toBe(3);
            expect(g('a').length).toBe(2);
        });
    });

    describe('fixed', () => {
        it('should return the fixed point of a function', () => {
            let f = L.fixed((g) => (n) => n <= 1 ? 1 : n * g(n - 1));
            expect(f(6)).toBe(720);
        });
    });

    describe('flip', () => {
        it('should flip the first two arguments', () => {
            let f = L.flip((a, b, c) => a + b + c);
            expect(f('a', 'b', 'c')).toBe('bac');
        });

        it('should preserve the arity', () => {
            let f = L.flip((a, b, c) => c);
            expect(f.length).toBe(3);
        });

        it('should work with curried functions', () => {
            let f =L.curry((a, b, c) => a + b + c);
            let g = L.flip(f);
            expect(g('a').length).toBe(2);
            expect(g('a', 'c').length).toBe(1);
            expect(g('a', 'c', 'b')).toBe('cab');
        });
    });

    describe('id', () => {
        it('should return what is given', () => {
            expect(L.id(1)).toBe(1);
            expect(L.id(L.id)(1)).toBe(1);
        });
    });

    describe('memoize', () => {
        it('should cache results from equal arguments', () => {
            let runs = 0;
            let f = L.memoize((a, b) => { runs += 1; return a + b; });
            expect(f('a', 'b')).toBe('ab');
            expect(f('a', 'b')).toBe('ab');
            expect(f('a', 'c')).toBe('ac');
            expect(runs).toBe(2);
        });

        it('should preserve the arity', () => {
            let f = L.memoize((a, b) => a + b);
            expect(f.length).toBe(2);
        });
    });

    describe('not', () => {
        it('should negate the result of the given function', () => {
            let f = L.not(a => a > 2);
            expect(f(1)).toBe(true);
            expect(f(3)).toBe(false);
        });

        it('should preserve the arity', () => {
            let f = L.not((a, b) => a + b > 2);
            expect(f.length).toBe(2);
        });
    });

    describe('partial', () => {
        it('should allow to apply a function partially', () => {
            let f = L.partial((a, b) => a + b);
            expect(f('a', 'b')).toBe('ab');
            expect(f(void 0, 'b')('a')).toBe('ab');
            expect(f()('a')('b')).toBe('ab');
            expect(f('a')()('b')).toBe('ab');
        });
    });

    describe('partialRight', () => {
        it('should allow to apply a function partially', () => {
            let f = L.partialRight((a, b) => a + b);
            expect(f('a', 'b')).toBe('ba');
            expect(f(void 0, 'b')('a')).toBe('ba');
            expect(f()('a')('b')).toBe('ba');
            expect(f('a')()('b')).toBe('ba');
        });
    });
});