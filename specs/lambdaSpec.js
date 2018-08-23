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
            expect(f.length).toBe(3);
            expect(f('a').length).toBe(2);
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
            expect(f.length).toBe(3);
            expect(f('a').length).toBe(2);
        });
    });
})