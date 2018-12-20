const {State} = require('../dist/futils').data;


describe('State', () => {
    it('should be able to construct State via of', () => {
        expect(State.of(1).run(0)).toBe(1);
        expect(State.of(1).exec(0)).toBe(0)
    });

    it('should be able to construct State via constructors', () => {
        expect(State(s => State.Result(s * 0.5, s)).run(2)).toBe(1);
        expect(State(s => State.Result(s * 0.5, s)).exec(2)).toBe(2)
    });

    it('should be able to construct via State get', () => {
        expect(State.get().run(0)).toBe(0);
        expect(State.get().exec(0)).toBe(0);
    });

    it('should be able to construct via State put', () => {
        expect(State.put(1).run(0)).toBe(null);
        expect(State.put(1).exec(0)).toBe(1);
    });

    it('should be able to construct via State modify', () => {
        expect(State.modify(s => s + 1).run(0)).toBe(null);
        expect(State.modify(s => s + 1).exec(0)).toBe(1);
    });

    it('should be able to map', () => {
        expect(State.get().map(x => x + 1).run(1)).toBe(2);
        expect(State.get().map(x => x + 1).exec(1)).toBe(1);
    });

    it('should be able to flatten', () => {
        expect(State.of(State.of(1)).flat().run(0)).toBe(1);
        expect(State.of(State.of(1)).flat().exec(0)).toBe(0);
    });

    it('should be able to chain/flatMap', () => {
        expect(State.get().flatMap(x => State.of(x + 1)).run(1)).toBe(2);
        expect(State.get().flatMap(x => State.of(x + 1)).exec(1)).toBe(1);
    });

    it('should be able to ap', () => {
        expect(State.of(x => x + 1).ap(State.of(1)).run(1)).toBe(2);
        expect(State.of(x => x + 1).ap(State.of(1)).exec(1)).toBe(1);
    });
});