const {Min} = require('../dist/futils').monoid;



describe('Min', () => {
    it('should be able to construct Min via of', () => {
        expect(Min.of(1).value).toBe(1);
        expect(Min.of('1').value).toBe(Infinity);
        expect(Min.of(null).value).toBe(Infinity);
    });

    it('should be able to construct Min via constructor', () => {
        expect(Min(1).value).toBe(1);
    });

    it('should be able to construct an empty instance', () => {
        expect(Min.empty().value).toBe(Infinity);
    });

    it('should be able to print itself', () => {
        expect(Min.of(1).toString()).toBe('Min(1)');
    });

    it('should be able to test for equality', () => {
        expect(Min.of(1).equals(Min.of(1))).toBe(true);
        expect(Min.of(1).equals(Min.of(2))).toBe(false);
        expect(Min.of(2).equals(Min.of(1))).toBe(false);
        expect(Min.of(2).equals(Min.of(2))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Min.of(1).concat(Min.of(1)).value).toBe(1);
        expect(Min.of(1).concat(Min.of(2)).value).toBe(1);
        expect(Min.of(2).concat(Min.of(1)).value).toBe(1);
        expect(Min.empty().concat(Min.of(1)).value).toBe(1);
        expect(Min.of(1).concat(Min.empty()).value).toBe(1);
    });
});