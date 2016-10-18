const _ = require('../futils');
describe('futils/lenses module', function () {
    const {combinators, lenses} = _;

    const struct = {
        name: 'John Doe',
        age: 39,
        emails: ['jdoe@privateaddress.net', 'doejohn@company.com']
    };

    it('testing makeLenses :: ss -> o', function () {
        let L = lenses.makeLenses('emails');

        let getMail = combinators.compose(L.emails, L.index(1));

        expect(lenses.view(getMail, struct)).toBe('doejohn@company.com');
    });

    it('testing view :: l -> o -> a', function () {
        let L = lenses.makeLenses('name', 'age');

        let name = lenses.view(L.name);
        expect(name(struct)).toBe('John Doe');
        expect(lenses.view(L.age, struct)).toBe(39);
    });

    it('testing over :: l -> f -> o -> o', function () {
        let L = lenses.makeLenses('age');

        let inc = lenses.over(L.age, (n) => n + 1);

        expect(inc(struct).age).toBe(40);
        expect(struct.age).toBe(39);
    });

    it('testing set :: l -> a -> o -> o', function () {
        let L = lenses.makeLenses('age');

        let op = lenses.set(L.age, 50);

        expect(op(struct).age).toBe(50);
        expect(struct.age).toBe(39);
    });

    it('testing mappedLens :: f -> xs -> lens', function () {
        let L = combinators.compose(lenses.mappedLens, lenses.mappedLens);
        let s = [[1, 2, 3]];

        let f = (n) => n + 1;

        expect(lenses.over(L, f, s)).toEqual([[2, 3, 4]]);
    });

});

    