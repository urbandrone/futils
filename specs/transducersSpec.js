const {id, transducers} = require('../futils');
describe('futils/transducers module', function () {
    let t = transducers;
    let add1 = (v) => v + 1;
    let even = (v) => v % 2;    
    let append = (a, b) => {
        a.push(b);
        return [...a];
    }


    it('testing fold :: xf, x, coll -> x', function () {
        let r = t.fold(
            function (a, b) { return a + b; },
            0,
            [1, 2, 3]
        );

        let r2 = t.fold(
            function (r, kv) { return r + kv[1]; },
            '',
            {a: 1, b: 2, c: 3}
        );

        expect(r).toBe(6);
        expect(r2).toBe('abc');
    });

    it('testing transduce :: f -> xf, f, x, coll -> x', function () {
        let r = t.transduce(
            id,
            function (r, v) { return r * v; },
            1,
            [1, 2, 3, 4, 5]
        );

        expect(r).toBe(120);
    });

    it('testing into :: f -> x, xf, coll -> x', function () {
        let r = t.into(
            0,
            t.map(add1),
            [1, 2, 3]
        );

        let r2 = t.into(
            '',
            t.map(add1),
            [1, 2, 3]
        );

        expect(r).toBe(9);
        expect(r2).toBe('234');
    });

    it('testing flatten :: xf -> xf', function () {
        let r = t.transduce(t.flatten, append, [], [[1], [2], [3]]);

        expect(r).toEqual([1, 2, 3]);
    });

    it('testing map :: f -> f -> xf -> xf', function () {
        let r = t.into([], t.map(add1), [1, 2, 3]);

        expect(r).toEqual([2, 3, 4]);
    });

    it('testing filter :: f -> f -> xf -> xf', function () {
        let r = t.into('', t.filter(even), [1, '2', 3]);
        expect(r).toBe('13');
    });

    it('testing drop :: f -> n -> xf -> xf', function () {
        let r = t.into([], t.drop(2), [1, 2, 3]);
        expect(r).toEqual([3]);
    });

    it('testing dropWhile :: f -> f -> xf -> xf', function () {
        let r = t.into([], t.dropWhile(even), [1, 2, 3]);
        expect(r).toEqual([2, 3]);
    });

    it('testing take :: f -> n -> xf -> xf', function () {
        let r = t.into([], t.take(2), [1, 2, 3]);
        expect(r).toEqual([1, 2]);
    });

    it('testing takeWhile :: f -> f -> xf -> xf', function () {
        let r = t.into([], t.takeWhile(even), [1, 2, 3]);
        expect(r).toEqual([1]);
    });

    it('testing keep :: f -> xf -> xf', function () {
        let r = t.into([], t.keep, [1, null]);
        expect(r).toEqual([1]);
    });

    it('testing unique :: f -> xf -> xf', function () {
        let r = t.into([], t.unique, [1, 2, 2, 3]);
        expect(r).toEqual([1, 2, 3]);
    });

    it('testing partition :: f -> n -> xf -> xf', function () {
        let r = t.transduce(t.partition(3), append, [], [1, 2, 3, 4, 5]);
        expect(r).toEqual([[1, 2, 3], [4, 5]]);
    });

    it('testing partitionWith :: f -> f -> xf -> xf', function () {
        let r = t.transduce(t.partitionWith(even), append, [], [1, 2, 3]);
        expect(r).toEqual([[1], [2], [3]]);
    });

});

    