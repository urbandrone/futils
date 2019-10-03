const {Task, Either, Id, Maybe, List, Series, IO} = require('../dist/futils').data;


describe('Task', () => {
    const ignore = _ => null;

    it('should be able to construct Task via of', () => {
        let v = null;
        runs(function() {
            Task.of(1).run(ignore, n => { v = n; })
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct Task via constructors', () => {
        let v = null;
        runs(function() {
            Task((f, o) => o(1)).run(ignore, n => { v = n; })
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct via Task resolve', () => {
        let v = null;
        runs(function() {
            Task.resolve(1).run(ignore, n => { v = n; })
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct via Task reject', () => {
        let v = null;
        runs(function() {
            Task.reject(1).run(n => { v = n; }, ignore)
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct from timeout', () => {
        let v = null;
        runs(function() {
            Task.timeout(200, () => 1).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 3000);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct from promise returning function', () => {
        let v = null;
        let f = x => new Promise((o) => { o(x); });

        runs(function() {
            Task.fromPromiseFunction(f)(1).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct from node style callback function', () => {
        let v = null;
        let f = (x, g) => g(null, x);

        runs(function() {
            Task.fromNodeFunction(f)(1).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct from Id', () => {
        let v = null;
        runs(function() {
            Task.fromId(Id(1)).run(ignore, n => { v = n; })
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to construct from Maybe', () => {
        let v, w;
        runs(function() {
            Task.fromMaybe(Maybe.Some(1)).run(ignore, n => { v = n; });
            Task.fromMaybe(Maybe.None()).run(n => { w = n; }, ignore);
        });

        waitsFor(() => v === 1 && w === null, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
          expect(w).toBe(null);
        });
    });

    it('should be able to construct from Either', () => {
        let v, w;
        runs(function() {
            Task.fromEither(Either.Right(1)).run(ignore, n => { v = n; });
            Task.fromEither(Either.Left(1)).run(n => { w = n; }, ignore);
        });

        waitsFor(() => v === 1 && w === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
          expect(w).toBe(1);
        });
    });

    it('should be able to construct from List', () => {
        let v, w;
        runs(function() {
            Task.fromList(List.of(1)).run(ignore, n => { v = n; });
            Task.fromList(List.Nil()).run(n => { w = n; }, ignore);
        });

        waitsFor(() => v === 1 && List.Nil.is(w), 'v should be 1, w should be Nil', 500);

        runs(function() {
            expect(v).toBe(1);
            expect(w).toEqual(List.Nil());
        });
    });

    it('should be able to construct from IO', () => {
        let v = null;
        runs(function() {
            Task.fromIO(IO.of(1)).run(ignore, n => { v = n; })
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to transform into a Promise', () => {
        let v = null;

        runs(function() {
            Task.of(1).toPromise().then((n) => { v = n; }, ignore)
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to concat', () => {
        let v = null;

        runs(function() {
            Task.timeout(100, () => 1).concat(Task.timeout(200, () => 2)).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to map', () => {
        let v = null;

        runs(function() {
            Task.of(0).map(a => a + 1).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to flatten', () => {
        let v = null;

        runs(function() {
            Task.of(Task.of(1)).flat().run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to chain/flatMap', () => {
        let v = null;

        runs(function() {
            Task.of(0).flatMap(a => Task.of(a + 1)).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to ap', () => {
        let v = null;

        runs(function() {
            Task.of(x => y => x + y).ap(Task.of(0)).ap(Task.of(1)).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });

    it('should be able to swap', () => {
        let v, w;

        runs(function() {
            Task.resolve(1).swap().run((n) => { v = n; }, ignore);
            Task.reject(1).swap().run(ignore, (n) => { w = n; });
        });

        waitsFor(() => v === 1 && w === 1, 'v & w should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
          expect(w).toBe(1);
        });
    });

    it('should be able to choose alternatives', () => {
        let v = null;

        runs(function() {
            Task.reject(1).alt(Task.of(1)).run(ignore, (n) => { v = n; });
        });

        waitsFor(() => v === 1, 'v should be 1', 500);

        runs(function() {
          expect(v).toBe(1);
        });
    });
});