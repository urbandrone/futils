const O = require('../dist/optic');


describe('Optic', () => {
    describe('lenses', () => {
        it('should be able to create Array and Object lenses', () => {
            let L = O.lenses('foo');
            expect(typeof L.foo).toBe('function');
            expect(typeof L.index).toBe('function');
        });
    });

    describe('view', () => {
        it('should be able to focus with a lens', () => {
            let L = O.lenses('foo');
            expect(O.view(L.foo, {foo: 1})).toBe(1);
            expect(O.view(L.index(0), [1, 2, 3])).toBe(1);
        });
    });

    describe('set', () => {
        it('should be able to set a focused property/index with a lens', () => {
            let L = O.lenses('foo');
            expect(O.view(L.foo, O.set(L.foo, 4, {foo: 1}))).toBe(4);
            expect(O.view(L.index(0), O.set(L.index(0), 4, [1, 2, 3]))).toBe(4);
        });
    });

    describe('over', () => {
        it('should be able to map over a focused property/index with a lens', () => {
            let L = O.lenses('foo');
            expect(O.view(L.foo, O.over(L.foo, a => a * 4, {foo: 1}))).toBe(4);
            expect(O.view(L.index(0), O.over(L.index(0), a => a * 4, [1, 2, 3]))).toBe(4);
        });
    });

    describe('createLens', () => {
        it('should be able to create new lens types', () => {
            let M = new Map([['foo', 1], ['bar', 2]]);

            let ML = O.createLens(
                (k, m) => m.has(k) ? m.get(k) : null,
                (k, v, m) => { let n = new Map([...m.entries()]); n.set(k, v); return n; }
            );

            let LFoo = ML('foo');
            expect(O.view(LFoo, M)).toBe(1);
            expect(O.view(LFoo, O.set(LFoo, 3, M))).toBe(3);
            expect(O.view(LFoo, O.over(LFoo, a => a * 3, M))).toBe(3);
        });
    });
});