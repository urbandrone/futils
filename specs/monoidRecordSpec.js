const {Record} = require('../dist/futils').monoid;



describe('Record', () => {
    it('should be able to construct Record via of', () => {
        expect(Record.of({a: 1}).value).toEqual({a: 1});
        expect(Record.of('1').value).toEqual({});
        expect(Record.of(null).value).toEqual({});
    });

    it('should be able to construct Record via constructor', () => {
        expect(Record({a: 1}).value).toEqual({a: 1});
    });

    it('should be able to construct an empty instance', () => {
        expect(Record.empty().value).toEqual({});
    });

    it('should be able to print itself', () => {
        expect(Record.of({a: 1}).toString()).toBe('Record({a: 1})');
    });

    it('should be able to test for equality', () => {
        expect(Record.of({a: 1}).equals(Record.of({a: 1}))).toBe(true);
        expect(Record.of({a: 1}).equals(Record.of({a: 2}))).toBe(false);
        expect(Record.of({a: 2}).equals(Record.of({a: 1}))).toBe(false);
        expect(Record.of({a: 2}).equals(Record.of({a: 2}))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Record.of({a: 1}).concat(Record.of({a: 1})).value).toEqual({a: 1});
        expect(Record.of({a: 1}).concat(Record.of({a: 2})).value).toEqual({a: 2});
        expect(Record.of({a: 2}).concat(Record.of({a: 1})).value).toEqual({a: 1});
        expect(Record.empty().concat(Record.of({a: 1})).value).toEqual({a: 1});
        expect(Record.of({a: 1}).concat(Record.empty()).value).toEqual({a: 1});
    });
});