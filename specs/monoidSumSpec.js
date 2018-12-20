const {Sum} = require('../dist/futils').monoid;



describe('Sum', () => {
    it('should be able to construct Sum via of', () => {
        expect(Sum.of(1).value).toBe(1);
        expect(Sum.of('1').value).toBe(0);
        expect(Sum.of(null).value).toBe(0);
    });

    it('should be able to construct Sum via constructor', () => {
        expect(Sum(1).value).toBe(1);
    });

    it('should be able to construct an empty instance', () => {
        expect(Sum.empty().value).toBe(0);
    });

    it('should be able to print itself', () => {
        expect(Sum.of(1).toString()).toBe('Sum(1)');
    });

    it('should be able to test for equality', () => {
        expect(Sum.of(1).equals(Sum.of(1))).toBe(true);
        expect(Sum.of(1).equals(Sum.of(2))).toBe(false);
        expect(Sum.of(2).equals(Sum.of(1))).toBe(false);
        expect(Sum.of(2).equals(Sum.of(2))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Sum.of(1).concat(Sum.of(1)).value).toBe(2);
        expect(Sum.of(1).concat(Sum.of(2)).value).toBe(3);
        expect(Sum.of(2).concat(Sum.of(1)).value).toBe(3);
        expect(Sum.empty().concat(Sum.of(1)).value).toBe(1);
        expect(Sum.of(1).concat(Sum.empty()).value).toBe(1);
    });
});