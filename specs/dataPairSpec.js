const {Pair} = require('../dist/futils').data;
const {Sum} = require('../dist/futils').monoid;


describe('Pair', () => {
    it('should be able to construct Pair via from', () => {
        expect(Pair.from(1, 'r').toString()).toBe('Pair(1, r)');
    });

    it('should be able to construct Pair via fromRight', () => {
        expect(Pair.fromRight(1, 'r').toString()).toBe('Pair(r, 1)');
    });

    it('should be able to construct Pair via constructors', () => {
        expect(Pair(1, 'r').toString()).toBe('Pair(1, r)');
    });

    it('should be able to print itself', () => {
        expect(Pair('a', 1).toString()).toBe('Pair(a, 1)');
    });

    it('should be able to concat', () => {
        expect(Pair('a', [0]).concat(Pair('b', [1])).toString()).toBe('Pair(ab, [0, 1])');
    });
});