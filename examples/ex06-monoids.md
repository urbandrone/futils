# Using Monoids
This tutorial focuses on a practical example of using Monoid types from `futils` to validate form elements in a HTML5 document. But let's start with some theory first so you get a solid understanding of what's going on.


## Theory
There are some new things we will learn in this tutorial. First of all, the `foldMap` function, which takes a Monoid constructor and a list of values of the corresponding Semigroup and folds them into a instance of the Monoid. The signature of foldMap is:

```javascript
// foldMap :: Monoid M a, [a] => M -> [a] -> m a
```

It reads as this: `foldMap` is a function which takes a monoid of `a` and a list of as, and returns a monoid of all the as concattenated together with the empty element (also called the unit).

```javascript
const {foldMap, Additive, id} = require('futils');

// foldMap :: Monoid M a, [a] => M -> [a] -> m a

const mSum = foldMap(Additive, [1, 2, 3, 4, 5]);
// -> Additive(15)
```

### Monoids
A Monoid is a Semigroup which contains a Empty element and obeys these laws:

```javascript
// Monoid M a, Monoid M a => M a × M a -> M a | Commutativity
Additive.of(1).concat(Additive.of(1)); // -> Additive(2)

// Monoid M a, Monoid M () => M a × M () -> M a | Associativity
// Monoid M a, Monoid M () => M () × M a -> M a
All.of(true).concat(All.empty()); // -> All(true)
All.empty().concat(All.of(true)); // -> All(true)
```

`futils` comes with a bunch of Monoids from these categories which you can use in you day to day programming:

- Unit (Empty group)
- Additive (Numbers, String)
- Multiple (Numbers)
- All & Any (Booleans)
- Min & Max (Numbers),
- Fn (Functions)
- Dict (Objects/Hashmaps)

As you can see, a lot of things are monoidal values. We can use that fact to our advantage, for example function composition with the Fn monoid:

```javascript
const upper = Fn.of((s) => s.toUpperCase());
const reverse = Fn.of((s) => s.split('').reverse().join(''));

const reverseUpper = upper.concat(reverse);

reverseUpper.fold(id, 'ALl uPPerCasE'); // -> 'ESACREPPU LLA'
```

All of this allows us to write our applications pure and pass in the state later with the additional befefit of beeing guaranteed to be free to mix and match smaller solutions together into a bigger one later.


## Form element validation
Let's start with the practical example. We will do some form validation for inputs of types `email`, `text` and `checkbox`. Our validation function returns `true` if all inputs are in a valid state and `false` if any of them fails.


### Initial preparations
First some utility functions and constant definitions:

```javascript
// EMAIL :: Regex
const EMAIL = /^[a-z0-9]{1,}@[a-z0-9]{3,}\.\w{2,8}$/i

// bool :: (a -> Bool) -> a -> Bool
const bool = pipe(not, not);
// query :: String -> [DOM]
const query = pipe(document.querySelectorAll.bind(document), Array.from);
```

`EMAIL` is just a regular expression

`bool` casts all values into their boolean value

`query` takes a selector a queries all matching nodes into a array


### Validator functions
For evaluations sake, we need some validator functions, which should have the signature `(a -> Bool)`. Most of them will read from DOM nodes.

```javascript
// required :: DOM -> Bool
const required = bool((e) => e && e.required);
// hasVal :: DOM -> Bool
const hasVal = bool((e) => e && e.value && e.value.trim());
// isChecked :: DOM -> Bool
const isChecked = bool((e) => e && e.checked);
// isEmail :: String -> Bool
const isEmail = bool((v) => EMAIL.test(v)); // <- EMAIL :: Regex
// mailValid :: DOM -> Bool
const mailValid = and(hasVal, pipe(hasVal, isEmail));
```


### Querying and validating the DOM
Nearly done. Now we need to define a function which actually queries the DOM for elements, filters only those which are `required`, and maps the validator over it. Here is how one could have defined it:

```javascript
// nodesValid :: (DOM -> Bool) -> String -> [Bool]
const nodesValid = curry((vf, css) => query(css)).
    filter(required).
    map(vf));
```

It takes a predicate function from DOM to Bool, and returns a functions from String to a list of Bools.


### Combining monoids
Now for the fun part: `nodesValid` returns us a list of booleans. From the list written above, we can see that boolean values form a monoidal semigroup and that we can use the `All` monoid as well as the `Any` monoid with them.

What we want is a function which takes a monoid constructor, a function from String to list of Bool which returns a function which takes a hashmap of CSS selectors : validators pairs and returns a monoid with the final result.

In other words:
```javascript
// foldMapInto :: Monoid -> (String -> [Bool]) -> {} -> Monoid Bool
```

We can make the signature more generic by saying the given function has the signature `(a -> [b])` instead of `(String -> [Bool])`. This is how it looks right now:

```javascript
// foldMapInto :: Monoid -> (a -> [b]) -> {} -> Monoid b
const foldMapInto = curry((M, f, hash) => Object.keys(hash).
    map((k) => foldMap(M, f(hash[k], k))).
    reduce((a, b) => a.concat(M.of(b)), M.empty()));
```


### Using it
This is it (nearly). We've made us a nice utility module which we can use to assembly the application on the fly. Here is how it looks like:

```javascript
const config = {
    'input[type="email"]': mailValid,
    'input[type="checkbox"]': isChecked,
    'input[type="text"]': hasVal
};

const prog = foldMapInto(All, nodesValid);

const result = prog(config).fold(id);
// -> Bool
```

If you are like me and want a better overview, here is the complete code in one file. Typically you'd split the application apart from the definitions of the validators and foldMapInto. Please also note the call to `require` at the top of the file which imports all utils needed:

```javascript
const {foldMap, All, id, pipe, not, and, curry} = require('futils');

// EMAIL :: Regex
const EMAIL = /^[a-z0-9]{1,}@[a-z0-9]{3,}\.\w{2,8}$/i

// bool :: (a -> Bool) -> a -> Bool
const bool = pipe(not, not);
// query :: String -> [DOM]
const query = pipe(document.querySelectorAll.bind(document), Array.from);

// required :: DOM -> Bool
const required = bool((e) => e && e.required);
// hasVal :: DOM -> Bool
const hasVal = bool((e) => e && e.value && e.value.trim());
// isChecked :: DOM -> Bool
const isChecked = bool((e) => e && e.checked);
// isEmail :: String -> Bool
const isEmail = bool((v) => EMAIL.test(v));
// mailValid :: DOM -> Bool
const mailValid = and(hasVal, pipe(hasVal, isEmail));

// nodesValid :: (DOM -> Bool) -> String -> [Bool]
const nodesValid = curry((vf, css) => query(css)).
    filter(required).
    map(vf));

// foldMapInto :: Monoid -> (a -> [b]) -> {} -> Monoid b
const foldMapInto = curry((M, f, hash) => Object.keys(hash).
    map((k) => foldMap(M, f(hash[k], k))).
    reduce((a, b) => a.concat(M.of(b)), M.empty()));


// -- Application
const config = {
    'input[type="email"]': mailValid,
    'input[type="checkbox"]': isChecked,
    'input[type="text"]': hasVal
};

const prog = foldMapInto(All, nodesValid);

const result = prog(config).fold(id);
// -> Bool
```


## The end
This tutorial has shown you how `futils` can be used to apply operations onto monoidal datatypes with the help of `All`, `foldMap` and how this allowed us to validate a bunch of required formelements into a single value.


---
[Index](./readme.md)






