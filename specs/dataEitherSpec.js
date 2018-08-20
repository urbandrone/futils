const {Either, Id, Maybe, List, Series} = require('../dist/data');
const {Left, Right} = Either;


describe('Either', () => {
    const a = Either.of(1);
    const b = Either.from(1);
    const c = Left(1);

    it('should be able to construct Right via of', () => {
        expect(Either.of('r').toString()).toBe('Right(r)');
    });

    it('should be able to construct Left/Right via from', () => {
        expect(Either.from('r').toString()).toBe('Right(r)');
        expect(Either.from(null).toString()).toBe('Left(Null)');
    });

    it('should be able to construct Left/Right via constructors', () => {
        expect(Right('r').toString()).toBe('Right(r)');
        expect(Left('l').toString()).toBe('Left(l)');
    });

    it('should be able to construct an empty instance', () => {
        expect(Left.is(Either.empty())).toBe(true);
    });

    it('should be able to construct from Id', () => {
        expect(Right.is(Either.fromId(Id(1)))).toBe(true);
        expect(Left.is(Either.fromId(Id(null)))).toBe(true);
    });

    it('should be able to construct from Maybe', () => {
        expect(Right.is(Either.fromMaybe(Maybe.Some(1)))).toBe(true);
        expect(Left.is(Either.fromMaybe(Maybe.None()))).toBe(true);
    });

    it('should be able to construct from List', () => {
        expect(Right.is(Either.fromList(List.of(1)))).toBe(true);
        expect(Left.is(Either.fromList(List.Nil()))).toBe(true);
    });

    it('should be able to construct from Series', () => {
        expect(Right.is(Either.fromSeries(Series.of(1)))).toBe(true);
        expect(Left.is(Either.fromSeries(Series.empty()))).toBe(true);
    });

    it('should be able to print itself', () => {
        expect(a.toString()).toBe('Right(1)');
        expect(c.toString()).toBe('Left(1)');
    });

    it('should be able to test for equality', () => {
        expect(a.equals(b)).toBe(true);
        expect(b.equals(a)).toBe(true);
        expect(a.equals(c)).toBe(false);
        expect(c.equals(a)).toBe(false);
    });

    it('should be able to apply ordering', () => {
        expect(a.lt(b)).toBe(false);
        expect(a.gt(b)).toBe(false);
        expect(a.lte(b)).toBe(true);
        expect(a.gte(b)).toBe(true);
    });

    it('should be able to tell if it is a Right', () => {
        expect(a.isRight()).toBe(true);
        expect(b.isRight()).toBe(true);
        expect(c.isRight()).toBe(false);
    });

    it('should be able to concat', () => {
        expect(Right('a').concat(Right('b')).value).toBe('ab');
        expect(Right('a').concat(Left('b')).value).toBe('b');
        expect(Left('a').concat(Right('b')).value).toBe('a');
        expect(Left('a').concat(Left('b')).value).toBe('a');
    });

    it('should be able to map', () => {
        expect(a.map(x => x + 1).value).toBe(2);
        expect(c.map(x => x + 1).value).toBe(1);
    });

    it('should be able to flatten', () => {
        expect(Right(Right(1)).flat().value).toBe(1);
        expect(Left(1).flat().value).toBe(1);
    });

    it('should be able to chain/flatMap', () => {
        expect(a.flatMap(x => Right(x + 1)).value).toBe(2);
        expect(c.flatMap(x => Right(x + 1)).value).toBe(1);
    });

    it('should be able to ap', () => {
        expect(Right(x => x + 1).ap(a).value).toBe(2);
        expect(Right(x => x + 1).ap(c).value).toBe(1);
        expect(c.ap(a).value).toBe(1);
    });

    it('should be able to biMap', () => {
        expect(a.biMap(() => 'l', x => x).value).toBe(1);
        expect(c.biMap(() => 'l', x => x).value).toBe('l');
    });

    it('should be able to reduce', () => {
        expect(a.reduce((x, y) => x + y, 'r')).toBe('r1');
        expect(c.reduce((x, y) => x + y, 'l')).toBe('l');
    });

    it('should be able to traverse', () => {
        expect(a.traverse(x => [x], Array).join('')).toBe('Right(1)');
        expect(c.traverse(x => [x], Array).join('')).toBe('Left(1)');
    });

    it('should be able to sequence', () => {
        expect(Right([1]).sequence(Array).join('')).toBe('Right(1)');
        expect(c.sequence(Array).join('')).toBe('Left(1)');
    });

    it('should be able to swap', () => {
        expect(a.swap().toString()).toBe('Left(1)');
        expect(c.swap().toString()).toBe('Right(1)');
    });

    it('should be able to choose alternatives', () => {
        expect(a.alt(Right('r')).value).toBe(1);
        expect(c.alt(Right('r')).value).toBe('r');
    });
});