const _ = require('../futils');
describe('futils/types module', function () {

    it('testing isNil :: a -> b', function () {
        var nul = _.isNil(null);
        var undef = _.isNil(void 0);
        var s = _.isNil('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isNull :: a -> b', function () {
        var nul = _.isNull(null);
        var undef = _.isNull(void 0);
        var s = _.isNull('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(false);
        expect(s).toBe(false);
    });

    it('testing isVoid :: a -> b', function () {
        var nul = _.isVoid(null);
        var undef = _.isVoid(void 0);
        var s = _.isVoid('a string');

        expect(nul).toBe(false);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isBool :: a -> b', function () {
        var b = _.isBool(false);
        var s = _.isBool('a string');

        expect(b).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isTrue :: b -> b', function () {
        var b = _.isTrue(false);
        var s = _.isTrue('a string');

        expect(b).toBe(false);
        expect(s).toBe(true);
    });

    it('testing isFalse :: a -> b', function () {
        var b = _.isFalse(false);
        var s = _.isFalse('a string');

        expect(b).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isString :: a -> b', function () {
        var s = _.isString('a string');
        var b = _.isString(true);

        expect(s).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNumber :: a -> b', function () {
        var n = _.isNumber(1);
        var b = _.isNumber(true);
        var nan = _.isNumber(NaN);
        var inf = _.isNumber(Infinity);
        var nil = _.isNumber(null);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(nan).toBe(false);
        expect(inf).toBe(false);
        expect(nil).toBe(false);
    });

    it('testing isInt :: a -> b', function () {
        var n = _.isInt(1);
        var b = _.isInt(true);
        var f32 = _.isInt(1.5);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(f32).toBe(false);
    });

    it('testing isFloat :: a -> b', function () {
        var n = _.isFloat(1.5);
        var b = _.isFloat(true);
        var i32 = _.isFloat(1);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(i32).toBe(false);
    });

    it('testing isFunc :: a -> b', function () {
        var f = _.isFunc(_.isString);
        var b = _.isFunc(true);

        expect(f).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isArray :: a -> b', function () {
        var a = _.isArray([]);
        var b = _.isArray({});

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isObject :: a -> b', function () {
        var a = _.isObject({});
        var b = _.isObject([]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isDate :: a -> b', function () {
        var a = _.isDate(new Date());
        var b = _.isDate('2014-01-01');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isRegex :: a -> b', function () {
        var a = _.isRegex(/.*/g);
        var b = _.isRegex(' ');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isPromise :: a -> b', function () {
        var a = _.isPromise(new Promise((r) => r(1)));
        var b = _.isPromise('string');
        var c = _.isPromise({length: 10});

        expect(a).toBe(true);
        expect(b).toBe(false);
        expect(c).toBe(false);
    });

    it('testing isIterator :: a -> b', function () {
        var a = _.isIterator(null);
        var b = _.isIterator({next: true});
        var c = _.isIterator({next: function () {}});

        expect(a).toBe(false);
        expect(b).toBe(false);
        expect(c).toBe(true);
    });

    it('testing isIterable :: a -> b', function () {
        var a = _.isIterable([]);
        var b = _.isIterable('string');
        var c = _.isIterable({length: 10});
        var d = _.isIterable(new Date());

        expect(a).toBe(true);
        expect(b).toBe(true);
        expect(c).toBe(true);
        expect(d).toBe(false);
    });

    it('testing isGenerator :: a -> b', function () {
        var a = _.isGenerator(null);
        var b = _.isGenerator({next: true});
        var c = _.isGenerator({next() {}});

        function * gen (n) {
            yield n;
        }

        expect(a).toBe(false);
        expect(b).toBe(false);
        expect(c).toBe(false);
        expect(_.isGenerator(gen(0))).toBe(true);
    });

    it('testing isArrayOf :: a -> b', function () {
        var a = _.isArrayOf(_.isString, ['a', 'b', 'c']);
        var b = _.isArrayOf(_.isString, [null, null, null]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isObjectOf :: a -> b', function () {
        var a = _.isObjectOf(_.isString, {a: 'a', b: 'b', c: 'c'});
        var b = _.isObjectOf(_.isString, {a: 1, b: 'b', c: null});

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isSetoid :: a -> b', function () {
        class A { equals() {} }

        let a = new A();
        expect(_.isSetoid(a)).toBe(true);
    });

    it('testing isFunctor :: a -> b', function () {
        class A { map() {} }

        let a = new A();
        expect(_.isFunctor(a)).toBe(true);
    });

    it('testing isApply :: a -> b', function () {
        class A { ap() {} }

        let a = new A();
        expect(_.isApply(a)).toBe(true);
    });

    it('testing isFoldable :: a -> b', function () {
        class A { fold() {} }

        let a = new A();
        expect(_.isFoldable(a)).toBe(true);
    });

    it('testing isApplicative :: a -> b', function () {
        class A { of() {} ap() {} }

        let a = new A();
        expect(_.isApplicative(a)).toBe(true);
    });

    it('testing isMonad :: a -> b', function () {
        class A { equals() {} map() {} flatten() {} flatMap() {} }
        
        let a = new A();
        expect(_.isMonad(a)).toBe(true);
    });
});
    