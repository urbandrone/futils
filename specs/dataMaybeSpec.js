const {Either, Id, Maybe, List, Series} = require('../dist/data');
const {None, Some} = Maybe;


describe('Maybe', () => {
    const a = Maybe.of(1);
    const b = Maybe.from(1);
    const c = None();

    it('should be able to construct Some via of', () => {
        expect(Maybe.of('r').toString()).toBe('Some(r)');
    });

    it('should be able to construct None/Some via from', () => {
        expect(Maybe.from('r').toString()).toBe('Some(r)');
        expect(Maybe.from(null).toString()).toBe('None');
    });

    it('should be able to construct None/Some via constructors', () => {
        expect(Some('r').toString()).toBe('Some(r)');
        expect(None().toString()).toBe('None');
    });

    it('should be able to construct an empty instance', () => {
        expect(None.is(Maybe.empty())).toBe(true);
    });

    it('should be able to construct from Id', () => {
        expect(Some.is(Maybe.fromId(Id(1)))).toBe(true);
        expect(None.is(Maybe.fromId(Id(null)))).toBe(true);
    });

    it('should be able to construct from Maybe', () => {
        expect(Some.is(Maybe.fromEither(Either.Right(1)))).toBe(true);
        expect(None.is(Maybe.fromEither(Either.Left(1)))).toBe(true);
    });

    it('should be able to construct from List', () => {
        expect(Some.is(Maybe.fromList(List.of(1)))).toBe(true);
        expect(None.is(Maybe.fromList(List.Nil()))).toBe(true);
    });

    it('should be able to print itself', () => {
        expect(a.toString()).toBe('Some(1)');
        expect(c.toString()).toBe('None');
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

    it('should be able to tell if it is a Some', () => {
        expect(a.isSome()).toBe(true);
        expect(b.isSome()).toBe(true);
        expect(c.isSome()).toBe(false);
    });

    it('should be able to concat', () => {
        expect(Some('a').concat(Some('b')).value).toBe('ab');
        expect(Some('a').concat(None()).value).toBe(null);
        expect(None().concat(Some('b')).value).toBe(null);
        expect(None().concat(None()).value).toBe(null);
    });

    it('should be able to map', () => {
        expect(a.map(x => x + 1).value).toBe(2);
        expect(c.map(x => x + 1).value).toBe(null);
    });

    it('should be able to flatten', () => {
        expect(Some(Some(1)).flat().value).toBe(1);
        expect(None().flat().value).toBe(null);
    });

    it('should be able to chain/flatMap', () => {
        expect(a.flatMap(x => Some(x + 1)).value).toBe(2);
        expect(c.flatMap(x => Some(x + 1)).value).toBe(null);
    });

    it('should be able to extract', () => {
        expect(a.extract()).toBe(1);
        expect(c.extract()).toBe(null);
    });

    it('should be able to extend', () => {
        expect(a.extend(({value}) => value + 1).value).toBe(2);
        expect(c.extend(({value}) => value + 1).value).toBe(null);
    });

    it('should be able to ap', () => {
        expect(Some(x => x + 1).ap(a).value).toBe(2);
        expect(Some(x => x + 1).ap(c).value).toBe(null);
        expect(c.ap(a).value).toBe(null);
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
        expect(a.traverse(x => [x], Array).join('')).toBe('Some(1)');
        expect(c.traverse(x => [x], Array).join('')).toBe('None');
    });

    it('should be able to sequence', () => {
        expect(Some([1]).sequence(Array).join('')).toBe('Some(1)');
        expect(c.sequence(Array).join('')).toBe('None');
    });

    it('should be able to choose alternatives', () => {
        expect(a.alt(Some('r')).value).toBe(1);
        expect(c.alt(Some('r')).value).toBe('r');
    });
});