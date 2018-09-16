const {Type, UnionType} = require('../dist/adt');



describe('Type', () => {
    const A = Type('A', ['value']);

    it('should be able to construct instances without new', () => {
        expect(A(1).value).toBe(1);
    });

    it('should be able to reach it\'s own constructor', () => {
        let a = A(1);
        expect(a.constructor(2).value).toBe(2);
    });

    it('should be able to test instances', () => {
        expect(A.is(A(1))).toBe(true);
    });

    it('should be able to report a __type__', () => {
        expect(A(1).__type__).toBe('A');
    });

    it('should be able to extend via prototype/fn', () => {
        A.fn.val = function () { return this.value; }
        expect(A(1).val()).toBe(1);
    });
});



describe('UnionType', () => {
    const A = UnionType('A', {B: ['value'], C: []});
    const {B, C} = A;

    it('should be able to construct instances without new', () => {
        expect(B(1).value).toBe(1);
        expect(C(1).value).toBe(void 0);
    });

    it('should be able to reach it\'s own constructor', () => {
        let b = B(1);
        let c = C();
        expect(b.constructor(2).value).toBe(2);
        expect(c.constructor(2).value).toBe(void 0);
    });

    it('should be able to test instances', () => {
        expect(A.is(B(1))).toBe(true);
        expect(A.is(C())).toBe(true);
        expect(B.is(B(1))).toBe(true);
        expect(C.is(C())).toBe(true);
        expect(C.is(B(1))).toBe(false);
        expect(B.is(C())).toBe(false);
    });

    it('should be able to report a __type__', () => {
        expect(B(1).__type__).toBe('B');
        expect(C().__type__).toBe('C');
    });

    it('should be able to extend via prototype/fn', () => {
        A.fn.val = function () { return this.value; }
        expect(B(1).val()).toBe(1);
        expect(C().val()).toBe(void 0);
    });

    it('should be able to pattern match', () => {
        A.fn.get = function () { return this.caseOf({B: (v) => v, C: () => null}); }
        expect(B(1).get()).toBe(1);
        expect(C().get()).toBe(null);
    });
});