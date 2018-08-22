const {Either, Id, Maybe, List, Series} = require('../dist/data');

describe('Series', () => {
    const a = Series.of(1);
    const c = Series.empty();
    const f = (x, y) => x + y;

    it('should be able to construct Series via of', () => {
        expect(Series.of('r').toString()).toBe('Series([r])');
    });

    it('should be able to construct Series via from', () => {
        expect(Series.from('r').toString()).toBe('Series([r])');
        expect(Series.from(null).toString()).toBe('Series([])');
    });

    it('should be able to construct Series via constructors', () => {
        expect(Series(['r']).toString()).toBe('Series([r])');
    });

    it('should be able to construct an empty instance', () => {
        expect(Series.is(Series.empty())).toBe(true);
    });

    it('should be able to construct from Id', () => {
        expect(Series.is(Series.fromId(Id(1)))).toBe(true);
    });

    it('should be able to construct from Either', () => {
        expect(Series.is(Series.fromEither(Either.Right(1)))).toBe(true);
    });

    it('should be able to construct from Maybe', () => {
        expect(Series.is(Series.fromMaybe(Maybe.of(1)))).toBe(true);
    });

    it('should be able to construct from List', () => {
        expect(Series.is(Series.fromList(List.of(1)))).toBe(true);
    });

    it('should be able to be coerced itself into an array', () => {
        expect(a.toArray()).toEqual([1]);
    });

    it('should be able to be coerced itself into an iterable', () => {
        const it = a[Symbol.iterator]();
        expect(it.next().value).toBe(1);
        expect(it.next().done).toBe(true);
    });

    it('should be able to print itself', () => {
        expect(a.toString()).toBe('Series([1])');
    });

    it('should be able to concat', () => {
        expect(Series(['a']).concat(Series(['b'])).reduce(f, '')).toBe('ab');
        expect(Series([]).concat(Series([])).reduce(f, '')).toBe('');
    });

    it('should be able to map', () => {
        expect(a.map(x => x + 1).reduce(f, 0)).toBe(2);
        expect(c.map(x => x + 1).reduce(f, 0)).toBe(0);
    });

    it('should be able to flatten', () => {
        expect(Series([Series([1])]).flat().reduce(f, 0)).toBe(1);
    });

    it('should be able to chain/flatMap', () => {
        expect(a.flatMap(x => Series([x + 1])).reduce(f, 0)).toBe(2);
    });

    it('should be able to extract', () => {
        expect(a.extract()).toBe(1);
        expect(c.extract()).toBe(null);
    });

    it('should be able to extend', () => {
        expect(a.extend(({value}) => value.join(',')).reduce(f, '')).toBe('1');
        expect(c.extend(({value}) => value.join(',')).reduce(f, '')).toBe('');
    });

    it('should be able to ap', () => {
        expect(Series([x => x + 1]).ap(a).reduce(f, 0)).toBe(2);
        expect(Series([x => x + 1]).ap(c).reduce(f, 0)).toBe(0);
        expect(c.ap(a).reduce(f, 0)).toBe(0);
    });

    it('should be able to reduce', () => {
        expect(a.reduce(f, 'r')).toBe('r1');
        expect(c.reduce(f, 'l')).toBe('l');
    });

    it('should be able to reduce right', () => {
        expect(a.reduceRight(f, 'r')).toBe('r1');
        expect(c.reduceRight(f, 'l')).toBe('l');
    });

    it('should be able to traverse', () => {
        expect(a.traverse(x => Id.of(x), Id).toString()).toBe('Id(Series([1]))');
        expect(c.traverse(x => Id.of(x), Id).toString()).toBe('Id(Series([]))');
    });

    it('should be able to sequence', () => {
        expect(Series([Id.of(1)]).sequence(Id).toString()).toBe('Id(Series([1]))');
        expect(c.sequence(Id).toString()).toBe('Id(Series([]))');
    });

    it('should be able to choose alternatives', () => {
        expect(a.alt(Series(['r'])).reduce(f, '')).toBe('1');
        expect(c.alt(Series(['r'])).reduce(f, '')).toBe('r');
    });

    it('should be able to foldmap', () => {
        const s = x => `${x}`;
        expect(a.foldMap(s)).toBe('1');
    });

    it('should be able to fold', () => {
        const S = {of: x => `${x}`};
        expect(a.fold(S)).toBe('1');
    });

    it('should be able to filter', () => {
        expect(Series([1, 2]).filter(x => x % 2 === 0).toString()).toBe('Series([2])');
    });

    it('should be able to intersperse', () => {
        expect(Series([1, 2]).intersperse(0.5).toString()).toBe('Series([1, 0.5, 2])');
    });

    it('should support cons', () => {
        expect(a.cons(0).toString()).toBe('Series([0, 1])');
    });

    it('should support snoc', () => {
        expect(a.snoc(2).toString()).toBe('Series([1, 2])');
    });

    it('should be able to take', () => {
        const ls = Series.of(1, 2, 3);
        expect(ls.take(2).toString()).toBe('Series([1, 2])');
    });

    it('should be able to drop', () => {
        const ls = Series.of(1, 2, 3);
        expect(ls.drop(2).toString()).toBe('Series([3])');
    });

    it('should be able to find', () => {
        const ls = Series.of(1, 2, 3);
        expect(ls.find(x => x === 2)).toBe(2);
        expect(ls.find(x => x === 4)).toBe(null);
    });
});