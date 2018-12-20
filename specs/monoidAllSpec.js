const {All} = require('../dist/futils').monoid;



describe('All', () => {
    it('should be able to construct All via of', () => {
        expect(All.of(true).value).toBe(true);
        expect(All.of(false).value).toBe(false);
        expect(All.of(1).value).toBe(true);
        expect(All.of(null).value).toBe(true);
    });

    it('should be able to construct All via constructor', () => {
        expect(All(true).value).toBe(true);
        expect(All(false).value).toBe(false);
    });

    it('should be able to construct an empty instance', () => {
        expect(All.empty().value).toBe(true);
    });

    it('should be able to print itself', () => {
        expect(All.of(true).toString()).toBe('All(true)');
    });

    it('should be able to test for equality', () => {
        expect(All.of(true).equals(All.of(true))).toBe(true);
        expect(All.of(true).equals(All.of(false))).toBe(false);
        expect(All.of(false).equals(All.of(true))).toBe(false);
        expect(All.of(false).equals(All.of(false))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(All.of(true).concat(All.of(true)).value).toBe(true);
        expect(All.of(false).concat(All.of(true)).value).toBe(false);
        expect(All.of(true).concat(All.of(false)).value).toBe(false);
        expect(All.of(false).concat(All.of(false)).value).toBe(false);
        expect(All.empty().concat(All.of(true)).value).toBe(true);
        expect(All.of(true).concat(All.empty()).value).toBe(true);
        expect(All.empty().concat(All.of(false)).value).toBe(false);
        expect(All.of(false).concat(All.empty()).value).toBe(false);
    });
});