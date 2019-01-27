Based on the contents of the [Quickstart]{@tutorial 01-quickstart} tutorial, this shows an alternative solution to the same domain, almost entirely with the help of `Type` and `UnionType` from the **adt** package. This time, the resulting looks like chained calls (a.k.a. _fluent api_) on the outside, but is completely pure on the inside. Also note the similarity between the end result and the comparison solution using arrays.



## Noteworthy
This section contains snippets of the complete code which might demand some explanation, be that because of their syntax, or because of new concepts. Feel free to skip them if you like.


### Usage of `UnionType`
We create a new "data" type `Sentence`, which can either be empty (`""`) or at least contain a single word. To represent a `Sentence` build from the empty string, we define a sub-type `EmptyString` without any fields and a `Line` sub-type which holds an `Array` of values. Any `Sentence` can only ever be either of both sub-types. You can think of it as a special form of `if` statement at the type level. 
```javascript
// data Sentence a = Line (Array a)
//                   | EmptyString
const Sentence = UnionType('Sentence', {Line: ['ls'], EmptyString: []});
```

### Pattern matching
Also note, that we can use pattern matching against the types created by `UnionType` (to a certain extend). This way, we can handle every sub-type separately which gives great power.
```javascript
// map :: Sentence S => S a ~> (a -> b) -> S b
Sentence.fn.map = function (f) {
    return this.caseOf({
        Line: ls => Line(ls.map(f)), // <-- do this if the instance is a "Line"
        EmptyString: () => this      // <-- do this for "EmptyString" instances 
    });
}
```

## Complete code
You can see the complete code below.
```javascript
// file: utils/parsers/sentences.js
// ================================

const { adt: {Type, UnionType},
        monoid: {Fn},
        lambda: {curry, pipe},
        operation: {map, prop, foldMap} } = require('futils');



/********** DATA TYPES **********/

// data Matrix = Matrix [String]
const Matrix = Type('Matrix', ['value']);

// map :: Matrix M => M [String] ~> (String -> String) -> M [String]
Matrix.fn.map = function (f) {
    return Matrix(this.value.map(f));
}

// reduce :: Matrix M => M [String] ~> (a -> String -> a) -> a -> a
Matrix.fn.reduce = function (f, a) {
    return this.value.reduce(f, a);
}



// data Sentence a = Line (Array a)
//                   | EmptyString
const Sentence = UnionType('Sentence', {Line: ['ls'], EmptyString: []});
const {Line, EmptyString} = Sentence;

// #fromString :: Sentence S => String -> S a
Sentence.fromString = function (string) {
    return string.trim() !== '' ? Sentence.of(string.split(/\s+/g)) : EmptyString();
}

// map :: Sentence S => S a ~> (a -> b) -> S b
Sentence.fn.map = function (f) {
    return this.caseOf({
        Line: ls => Line(ls.map(f)),
        EmptyString: () => this
    });
}

// reduce  :: Sentence S => S a ~> ((b, a) -> b) -> a -> b
Sentence.fn.reduce = function (f, a) {
    return this.caseOf({
        Line: ls => ls.reduce(f, a),
        EmptyString: () => a
    });
}

// join  :: Sentence S => S a ~> String -> String
Sentence.fn.join = function (sep) {
    return this.reduce((acc, wrd) => !acc ? wrd : `${acc}${sep}${wrd}`, '');
}



// Parser :: { String : () -> Fn (String -> String) }
const Parser = {
    '^': _ => Fn(s => s[0].toUpperCase() + s.slice(1)),
    '!': _ => Fn(s => '-.+/=*'.includes(s) ? s : s + '!'),
    '<': _ => Fn(s => s.length < 2 ? s : s.split('').reverse().join('')),
    '"': _ => Fn(s => s.trim())
}

// interpreter :: (Matrix, Parser) -> (Number -> Number)
const interpreter = (m, p) => foldMap(x => p[x](x), m).value;



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



// result :: Sentence a
const result = Sentence.fromString('hello world - how are you today?').map(interpret);

// empty :: Sentence a
const empty = Sentence.fromString('').map(interpret);

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

// convert :: String -> [String]
const convert = s => {
    if (s.trim() !== '') {      // <-- the if-statement removed by UnionType
        return s.split(/\s+/g);
    }
    return [];
}



// result :: [String]
const result = convert('hello world - how are you today?').map(interpret);

// empty :: [String]
const empty = convert('').map(interpret);

console.log(`Parsed: ${result.join(' ')}`);
console.log(`Empty: ${empty.join(' ')}`);
```