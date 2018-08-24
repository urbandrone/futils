const {Char} = require('../dist/monoid');



describe('Char', () => {
    it('should be able to construct Char via of', () => {
        expect(Char.of('a').value).toBe('a');
        expect(Char.of(1).value).toBe('');
        expect(Char.of(null).value).toBe('');
    });

    it('should be able to construct Char via constructor', () => {
        expect(Char('a').value).toBe('a');
    });

    it('should be able to construct an empty instance', () => {
        expect(Char.empty().value).toBe('');
    });

    it('should be able to print itself', () => {
        expect(Char.of('a').toString()).toBe('Char(a)');
    });

    it('should be able to test for equality', () => {
        expect(Char.of('a').equals(Char.of('a'))).toBe(true);
        expect(Char.of('a').equals(Char.of('b'))).toBe(false);
        expect(Char.of('b').equals(Char.of('a'))).toBe(false);
        expect(Char.of('b').equals(Char.of('b'))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Char.of('a').concat(Char.of('a')).value).toBe('aa');
        expect(Char.of('b').concat(Char.of('a')).value).toBe('ba');
        expect(Char.of('a').concat(Char.of('b')).value).toBe('ab');
        expect(Char.empty().concat(Char.of('a')).value).toBe('a');
        expect(Char.of('a').concat(Char.empty()).value).toBe('a');
    });
});