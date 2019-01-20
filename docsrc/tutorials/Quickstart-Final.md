# Quickstart Final Solution
Based on the contents of the [Quickstart]{@tutorial Quickstart-Basic} tutorial, this shows an alternative solution to the same domain, almost entirely with the help of `Type` and `UnionType` from the **adt** package. This time, the resulting looks like chained calls (a.k.a. _fluent api_) on the outside, but is completely pure on the inside. Also note the similarity between the end result and the comparison solution using arrays.

## Complete code
You can see the complete code below.

> **Hint: Type signatures**
> Inside the code, you will see type signatures which look like this one: `.map :: Sentence a ~> ...` in the beginning. Read them like this: "_For the_ `.map` _method of a_ `Sentence` holds: When called with ...".

```javascript
// file: utils/parsers/sentences.js
// ================================

const { adt: {Type, UnionType},
        monoid: {Fn},
        lambda: {curry, pipe},
        operation: {map, prop, foldMap} } = require('futils');



/********** DATA TYPES **********/

// data Matrix = Matrix (Array String)
const Matrix = Type('Matrix', ['value']);

// .map :: Matrix [String] ~> (String -> String) -> Matrix [String]
Matrix.fn.map = function (f) {
    return Matrix(this.value.map(f));
}

// .reduce :: Matrix [String] ~> (a -> String -> a) -> a -> a
Matrix.fn.reduce = function (f, a) {
    return this.value.reduce(f, a);
}




/* ========= TEST ========= */
// data Word = Word String
const Word = Type('Word', ['val']);

// .map :: Word String ~> (String -> String) -> Word String
Word.fn.map = function (f) {
    return Word(f(this.val));
}



// data Sentence = Line (Array Word)
//               | EmptyString
const Sentence = UnionType('Sentence', {Line: ['ws'], EmptyString: []});
const {Line, EmptyString} = Sentence;

// #of :: Array String -> Line (Array Word)
Sentence.of = function (ws) {
    return Line(ws.map(Word));
}

// #from :: String -> Sentence
Sentence.from = function (string) {
    return string.trim() !== '' ? Sentence.of(string.split(/\s+/g)) : EmptyString();
}

// .map :: forall a b. Sentence a ~> (a -> b) -> Sentence b
Sentence.fn.map = function (f) {
    return this.caseOf({
        Line: ws => Line(ws.map(w => w.map(f))),
        EmptyString: () => this
    });
}

// .reduce :: forall a b. Sentence a ~> ((b, a) -> b) -> a -> b
Sentence.fn.reduce = function (f, a) {
    return this.caseOf({
        Line: ws => ws.reduce(f, a),
        EmptyString: () => a
    });
}

// .join :: Sentence a ~> String -> String
Sentence.fn.join = function (sep) {
    return this.reduce((acc, wrd) => !acc ? wrd.val : `${acc}${sep}${wrd.val}`, '');
}



// Parser :: Object (String : () -> Fn (String -> String))
const Parser = {
    '^': _ => Fn(s => s[0].toUpperCase() + s.slice(1)),
    '!': _ => Fn(s => '-.+/=*'.includes(s) ? s : s + '!'),
    '<': _ => Fn(s => s.length < 2 ? s : s.split('').reverse().join('')),
    '"': _ => Fn(s => s.trim())
}

// interpreter :: (Matrix, Parser) -> (Number -> Number)
const interpreter = (m, p) => foldMap(x => p[x[0]](x), m).value;



module.exports = {Matrix, Parser, Sentence, interpreter}
```



## Test
For a quick test, use this as a template:
```javascript
// file: hello-world.js
// ================================

const {Matrix, Parser, Sentence, interpreter} = require('./utils/parsers/sentences');

// matrix :: Matrix
const matrix = Matrix(['^', '!', '<']);

// interpret :: String -> String
const interpret = interpreter(matrix, Parser);

// convert :: String -> Sentence
const convert = s => Sentence.from(s);



// result :: Sentence
const result = convert('hello world - how are you today?').map(interpret);

// empty :: Sentence
const empty = convert('').map(interpret);

console.log(`Parsed: ${result.join(' ')}`);
console.log(`Empty: ${empty.join(' ')}`);
```



## `Array` based solution
As a comparison, here is a solution based on `Array` instead of `Sentence`. The core parts are equal, but the `Sentence` based solution conveys more clarity by abstracting the underlying types away into more descriptive ones.
```javascript
// file: hello-world-array.js
// ================================

const {Matrix, Parser, interpreter} = require('./utils/parsers/sentences');

// matrix :: Matrix
const matrix = Matrix(['^', '!', '<']);

// interpret :: String -> String
const interpret = interpreter(matrix, Parser);

// convert :: String -> Array String
const convert = s => {
    if (s.trim() !== '') {
        return s.split(/\s+/g);
    }
    return [];
}



// result :: Array String
const result = convert('hello world - how are you today?').map(interpret);

// empty :: Array String
const empty = convert('').map(interpret);

console.log(`Parsed: ${result.join(' ')}`);
console.log(`Empty: ${empty.join(' ')}`);
```