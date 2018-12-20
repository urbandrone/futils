const {Any} = require('../dist/futils').monoid;



describe('Any', () => {
    it('should be able to construct Any via of', () => {
        expect(Any.of(true).value).toBe(true);
        expect(Any.of(false).value).toBe(false);
        expect(Any.of(1).value).toBe(false);
        expect(Any.of(null).value).toBe(false);
    });

    it('should be able to construct Any via constructor', () => {
        expect(Any(true).value).toBe(true);
        expect(Any(false).value).toBe(false);
    });

    it('should be able to construct an empty instance', () => {
        expect(Any.empty().value).toBe(false);
    });

    it('should be able to print itself', () => {
        expect(Any.of(true).toString()).toBe('Any(true)');
    });

    it('should be able to test for equality', () => {
        expect(Any.of(true).equals(Any.of(true))).toBe(true);
        expect(Any.of(true).equals(Any.of(false))).toBe(false);
        expect(Any.of(false).equals(Any.of(true))).toBe(false);
        expect(Any.of(false).equals(Any.of(false))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Any.of(true).concat(Any.of(true)).value).toBe(true);
        expect(Any.of(false).concat(Any.of(true)).value).toBe(true);
        expect(Any.of(true).concat(Any.of(false)).value).toBe(true);
        expect(Any.of(false).concat(Any.of(false)).value).toBe(false);
        expect(Any.empty().concat(Any.of(true)).value).toBe(true);
        expect(Any.of(true).concat(Any.empty()).value).toBe(true);
        expect(Any.empty().concat(Any.of(false)).value).toBe(false);
        expect(Any.of(false).concat(Any.empty()).value).toBe(false);
    });
});