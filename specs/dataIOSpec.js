const {IO, Either, Id, Maybe, List, Series} = require('../dist/futils').data;


describe('IO', () => {
    it('should be able to construct IO via of', () => {
        expect(IO.of('r').run()).toBe('r');
        expect(IO.of('r').constructor.of === IO.of).toBe(true);
        expect(IO['fantasy-land/of']('r').run()).toBe('r');
    });

    it('should be able to construct IO via from', () => {
        expect(IO.from('r').run()).toBe('r');
        expect(IO.from(x => x).run('r')).toBe('r');
    });

    it('should be able to construct IO via constructors', () => {
        expect(IO(() => 'r').run()).toBe('r');
    });

    it('should be able to construct from Maybe', () => {
        expect(IO.is(IO.fromMaybe(Maybe.Some(1)))).toBe(true);
        expect(IO.is(IO.fromMaybe(Maybe.None()))).toBe(true);
    });

    it('should be able to construct from Either', () => {
        expect(IO.is(IO.fromEither(Either.Right(1)))).toBe(true);
        expect(IO.is(IO.fromEither(Either.Left(1)))).toBe(true);
    });

    it('should be able to construct from Id', () => {
        expect(IO.is(IO.fromId(Id.of(1)))).toBe(true);
    });

    it('should be able to construct from List', () => {
        expect(IO.is(IO.fromList(List.of(1)))).toBe(true);
    });

    it('should be able to construct an empty instance', () => {
        expect(IO.is(IO.empty())).toBe(true);
        expect(IO.is(IO['fantasy-land/empty']())).toBe(true);
    });

    it('should be able to concat', () => {
        expect(IO.of('a').concat(IO(x => x.toUpperCase())).run()).toBe('A');
        expect(IO.of('a')['fantasy-land/concat'](IO(x => x.toUpperCase())).run()).toBe('A');
    });

    it('should be able to map', () => {
        expect(IO.of(1).map(x => x + 1).run()).toBe(2);
        expect(IO.of(1)['fantasy-land/map'](x => x + 1).run()).toBe(2);
    });

    it('should be able to flatten', () => {
        expect(IO.of(IO(() => 1)).flat().run()).toBe(1);
    });

    it('should be able to chain/flatMap', () => {
        expect(IO.of(1).flatMap(x => IO.of(x + 1)).run()).toBe(2);
        expect(IO.of(1)['fantasy-land/chain'](x => IO.of(x + 1)).run()).toBe(2);
    });

    it('should be able to ap', () => {
        expect(IO(x => x + 1).ap(IO.of(1)).run()).toBe(2);
        expect(IO.of(1)['fantasy-land/ap'](IO(x => x + 1)).run()).toBe(2);
    });

    it('should be able to contraMap', () => {
        expect(IO.empty().contraMap(x => x.toFixed(2)).run(1)).toBe('1.00');
        expect(IO.empty()['fantasy-land/contramap'](x => x.toFixed(2)).run(1)).toBe('1.00');
    });

    it('should be able to proMap', () => {
        expect(IO.empty().proMap(x => x.toFixed(2), x => x.replace('.', ',')).run(1)).toBe('1,00');
        expect(IO.empty()['fantasy-land/promap'](x => x.toFixed(2), x => x.replace('.', ',')).run(1)).toBe('1,00');
    });
});