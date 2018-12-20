const {Product} = require('../dist/futils').monoid;



describe('Product', () => {
    it('should be able to construct Product via of', () => {
        expect(Product.of(1).value).toBe(1);
        expect(Product.of('1').value).toBe(1);
        expect(Product.of(null).value).toBe(1);
    });

    it('should be able to construct Product via constructor', () => {
        expect(Product(1).value).toBe(1);
    });

    it('should be able to construct an empty instance', () => {
        expect(Product.empty().value).toBe(1);
    });

    it('should be able to print itself', () => {
        expect(Product.of(1).toString()).toBe('Product(1)');
    });

    it('should be able to test for equality', () => {
        expect(Product.of(1).equals(Product.of(1))).toBe(true);
        expect(Product.of(1).equals(Product.of(2))).toBe(false);
        expect(Product.of(2).equals(Product.of(1))).toBe(false);
        expect(Product.of(2).equals(Product.of(2))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Product.of(1).concat(Product.of(1)).value).toBe(1);
        expect(Product.of(1).concat(Product.of(2)).value).toBe(2);
        expect(Product.of(2).concat(Product.of(1)).value).toBe(2);
        expect(Product.empty().concat(Product.of(1)).value).toBe(1);
        expect(Product.of(1).concat(Product.empty()).value).toBe(1);
    });
});