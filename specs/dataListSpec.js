const {Either, Id, Maybe, List, Series} = require('../dist/data');
const {Cons, Nil} = List;


describe('List', () => {
    const a = List.of(1);
    const c = Nil();
    const f = (x, y) => x + y;

    it('should be able to construct Cons via of', () => {
        expect(List.of('r').toString()).toBe('Cons(r, Nil)');
    });

    it('should be able to construct Nil/Cons via from', () => {
        expect(List.from('r').toString()).toBe('Cons(r, Nil)');
        expect(List.from(null).toString()).toBe('Nil');
    });

    it('should be able to construct Nil/Cons via constructors', () => {
        expect(Cons('r', Nil()).toString()).toBe('Cons(r, Nil)');
        expect(Nil().toString()).toBe('Nil');
    });

    it('should be able to construct an empty instance', () => {
        expect(Nil.is(List.empty())).toBe(true);
    });

    it('should be able to construct from Id', () => {
        expect(Cons.is(List.fromId(Id(1)))).toBe(true);
        expect(Nil.is(List.fromId(Id(null)))).toBe(true);
    });

    it('should be able to construct from Either', () => {
        expect(Cons.is(List.fromEither(Either.Right(1)))).toBe(true);
        expect(Nil.is(List.fromEither(Either.Left(1)))).toBe(true);
    });

    it('should be able to construct from Maybe', () => {
        expect(Cons.is(List.fromMaybe(Maybe.of(1)))).toBe(true);
        expect(Nil.is(List.fromMaybe(Maybe.None()))).toBe(true);
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
        expect(a.toString()).toBe('Cons(1, Nil)');
        expect(c.toString()).toBe('Nil');
    });

    it('should be able to concat', () => {
        expect(Cons('a', Nil()).concat(Cons('b', Nil())).reduce(f, '')).toBe('ab');
        expect(Cons('a', Nil()).concat(Nil()).reduce(f, '')).toBe('');
        expect(Nil().concat(Cons('b', Nil())).reduce(f, '')).toBe('');
        expect(Nil().concat(Nil()).reduce(f, '')).toBe('');
    });

    it('should be able to map', () => {
        expect(a.map(x => x + 1).reduce(f, 0)).toBe(2);
        expect(c.map(x => x + 1).reduce(f, 0)).toBe(0);
    });

    it('should be able to flatten', () => {
        expect(Cons(Cons(1, Nil()), Nil()).flat().reduce(f, 0)).toBe(1);
        expect(Nil().flat().reduce(f, 0)).toBe(0);
    });

    it('should be able to chain/flatMap', () => {
        expect(a.flatMap(x => Cons(x + 1, Nil())).reduce(f, 0)).toBe(2);
        expect(c.flatMap(x => Cons(x + 1, Nil())).reduce(f, 0)).toBe(0);
    });

    it('should be able to extract', () => {
        expect(a.extract()).toBe(1);
        expect(c.extract()).toBe(null);
    });

    it('should be able to extend', () => {
        expect(a.extend(({head}) => head + 1).reduce(f, 0)).toBe(2);
        expect(c.extend(({head}) => head + 1).reduce(f, 0)).toBe(0);
    });

    it('should be able to ap', () => {
        expect(Cons(x => x + 1, Nil()).ap(a).reduce(f, 0)).toBe(2);
        expect(Cons(x => x + 1, Nil()).ap(c).reduce(f, 0)).toBe(0);
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
        expect(a.traverse(x => Id.of(x), Id).toString()).toBe('Id(Cons(1, Nil))');
        expect(c.traverse(x => Id.of(x), Id).toString()).toBe('Id(Nil)');
    });

    it('should be able to sequence', () => {
        expect(Cons(Id.of(1), Nil()).sequence(Id).toString()).toBe('Id(Cons(1, Nil))');
        expect(c.sequence(Id).toString()).toBe('Id(Nil)');
    });

    it('should be able to choose alternatives', () => {
        expect(a.alt(Cons('r', Nil())).reduce(f, '')).toBe('1');
        expect(c.alt(Cons('r', Nil())).reduce(f, '')).toBe('r');
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
        expect(Cons(1, Cons(2, Nil())).filter(x => x % 2 === 0).toString()).toBe('Cons(2, Nil)');
    });

    it('should be able to intersperse', () => {
        expect(Cons(1, Cons(2, Nil())).intersperse(0.5).toString()).toBe('Cons(1, Cons(0.5, Cons(2, Nil)))');
    });

    it('should support cons', () => {
        expect(a.cons(0).toString()).toBe('Cons(0, Cons(1, Nil))');
    });

    it('should support snoc', () => {
        expect(a.snoc(2).toString()).toBe('Cons(1, Cons(2, Nil))');
    });

    it('should be able to reach the head', () => {
        expect(a.head).toBe(1);
        expect(c.head).toBe(null);
    });

    it('should be able to reach the tail', () => {
        expect(a.tail.toString()).toBe('Nil');
        expect(c.tail.toString()).toBe('Nil');
    });

    it('should be able to take', () => {
        const ls = List.of(3).cons(2).cons(1);
        expect(ls.take(2).toString()).toBe('Cons(1, Cons(2, Nil))');
    });

    it('should be able to drop', () => {
        const ls = List.of(3).cons(2).cons(1);
        expect(ls.drop(2).toString()).toBe('Cons(3, Nil)');
    });

    it('should be able to find', () => {
        const ls = List.of(3).cons(2).cons(1);
        expect(ls.find(x => x === 2)).toBe(2);
        expect(ls.find(x => x === 4)).toBe(null);
    });
});