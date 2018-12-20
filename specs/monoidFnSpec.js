const {Fn} = require('../dist/futils').monoid;



describe('Fn', () => {
    it('should be able to construct Fn via of', () => {
        expect(Fn.of(() => 'a').value()).toBe('a');
        expect(Fn.of(1).value()).toBe(void 0);
        expect(Fn.of(null).value()).toBe(void 0);
    });

    it('should be able to construct Fn via constructor', () => {
        expect(Fn(a => a).value('a')).toBe('a');
    });

    it('should be able to construct an empty instance', () => {
        expect(Fn.empty().value('a')).toBe('a');
    });

    it('should be able to print itself', () => {
        expect(Fn.of(a => a).toString()).toBe('Fn(Function)');
    });

    it('should be able to test for equality', () => {
        let f = () => 'a';
        let g = () => 'b';
        expect(Fn.of(f).equals(Fn.of(f))).toBe(true);
        expect(Fn.of(f).equals(Fn.of(g))).toBe(false);
        expect(Fn.of(g).equals(Fn.of(f))).toBe(false);
        expect(Fn.of(g).equals(Fn.of(g))).toBe(true);
    });

    it('should be able to concat', () => {
        let f = a => a.toUpperCase();
        let g = a => a + '!';
        expect(Fn.of(f).concat(Fn.of(f)).value('a')).toBe('A');
        expect(Fn.of(f).concat(Fn.of(g)).value('a')).toBe('A!');
        expect(Fn.of(g).concat(Fn.of(f)).value('a')).toBe('A!');
        expect(Fn.empty().concat(Fn.of(f)).value('a')).toBe('A');
        expect(Fn.of(f).concat(Fn.empty()).value('a')).toBe('A');
    });
});