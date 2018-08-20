const {Either, Id, Maybe, List, Series} = require('../dist/data');


describe('Id', () => {
    const a = Id.of(1);

    it('should be able to construct Id via of', () => {
        expect(Id.of('r').toString()).toBe('Id(r)');
    });

    it('should be able to construct Id via from', () => {
        expect(Id.from('r').toString()).toBe('Id(r)');
    });

    it('should be able to construct Id via constructors', () => {
        expect(Id('r').toString()).toBe('Id(r)');
    });

    it('should be able to construct from Maybe', () => {
        expect(Id.is(Id.fromMaybe(Maybe.Some(1)))).toBe(true);
        expect(Id.is(Id.fromMaybe(Maybe.None()))).toBe(true);
    });

    it('should be able to construct from Either', () => {
        expect(Id.is(Id.fromEither(Either.Right(1)))).toBe(true);
        expect(Id.is(Id.fromEither(Either.Left(1)))).toBe(true);
    });

    it('should be able to construct from List', () => {
        expect(Id.is(Id.fromList(List.of(1)))).toBe(true);
    });

    it('should be able to construct from Series', () => {
        expect(Id.is(Id.fromSeries(Series.of(1)))).toBe(true);
    });

    it('should be able to print itself', () => {
        expect(a.toString()).toBe('Id(1)');
    });

    it('should be able to test for equality', () => {
        expect(a.equals(Id(1))).toBe(true);
        expect(Id(1).equals(a)).toBe(true);
    });

    it('should be able to apply ordering', () => {
        expect(a.lt(Id(1))).toBe(false);
        expect(a.gt(Id(1))).toBe(false);
        expect(a.lte(Id(1))).toBe(true);
        expect(a.gte(Id(1))).toBe(true);
    });

    it('should be able to concat', () => {
        expect(Id('a').concat(Id('b')).value).toBe('ab');
    });

    it('should be able to map', () => {
        expect(a.map(x => x + 1).value).toBe(2);
    });

    it('should be able to flatten', () => {
        expect(Id(Id(1)).flat().value).toBe(1);
    });

    it('should be able to chain/flatMap', () => {
        expect(a.flatMap(x => Id(x + 1)).value).toBe(2);
    });

    it('should be able to ap', () => {
        expect(Id(x => x + 1).ap(a).value).toBe(2);
    });

    it('should be able to reduce', () => {
        expect(a.reduce((x, y) => x + y, 'r')).toBe('r1');
    });

    it('should be able to traverse', () => {
        expect(a.traverse(x => [x], Array).join('')).toBe('Id(1)');
    });

    it('should be able to sequence', () => {
        expect(Id([1]).sequence(Array).join('')).toBe('Id(1)');
    });
});