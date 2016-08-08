const _ = require('../index');
describe('futils/lenses module', function () {
    
    const struct = {
        name: 'John Doe',
        age: 39,
        emails: ['jdoe@privateaddress.net', 'doejohn@company.com']
    };

    it('testing makeLenses :: ss -> o', function () {
        let L = _.makeLenses('emails');

        let getMail = _.compose(L.emails, L.num(1));

        expect(_.view(getMail, struct)).toBe('doejohn@company.com');
    });

    it('testing view :: l -> o -> a', function () {
        let L = _.makeLenses('name', 'age');

        let name = _.view(L.name);
        expect(name(struct)).toBe('John Doe');
        expect(_.view(L.age, struct)).toBe(39);
    });

    it('testing over :: l -> f -> o -> o', function () {
        let L = _.makeLenses('age');

        let inc = _.over(L.age, (n) => n + 1);

        expect(_.view(L.age, inc(struct))).toBe(40);
    });

    it('testing set :: l -> a -> o -> o', function () {
        let L = _.makeLenses('age');

        let op = _.set(L.age, 50);

        expect(_.view(L.age, op(struct))).toBe(50);
    });


});

    