const {Max} = require('../dist/monoid');



describe('Max', () => {
    it('should be able to construct Max via of', () => {
        expect(Max.of(1).value).toBe(1);
        expect(Max.of('1').value).toBe(-Infinity);
        expect(Max.of(null).value).toBe(-Infinity);
    });

    it('should be able to construct Max via constructor', () => {
        expect(Max(1).value).toBe(1);
    });

    it('should be able to construct an empty instance', () => {
        expect(Max.empty().value).toBe(-Infinity);
    });

    it('should be able to print itself', () => {
        expect(Max.of(1).toString()).toBe('Max(1)');
    });

    it('should be able to test for equality', () => {
        expect(Max.of(1).equals(Max.of(1))).toBe(true);
        expect(Max.of(1).equals(Max.of(2))).toBe(false);
        expect(Max.of(2).equals(Max.of(1))).toBe(false);
        expect(Max.of(2).equals(Max.of(2))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Max.of(1).concat(Max.of(1)).value).toBe(1);
        expect(Max.of(1).concat(Max.of(2)).value).toBe(2);
        expect(Max.of(2).concat(Max.of(1)).value).toBe(2);
        expect(Max.empty().concat(Max.of(1)).value).toBe(1);
        expect(Max.of(1).concat(Max.empty()).value).toBe(1);
    });
});