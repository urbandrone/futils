# Getting focused
This time we take a quick dive into some of the things you can do with lenses and how you can put them into use. `futils` shippes a kind of lenses called `van Laarhoven` lenses which are based on functors.


## What are they useful for?
What's interesting about lenses in general is their ability to open nested data structures, manipulate some stuff inside and reconstruct the entire structures around the altered parts. Read that again.

Because all lenses are just functions in and of themself, they can be composed together like all other functions can with `compose` and `pipe`.

> If you use `compose`, you are able to write your lenses from left to right,
> which makes them more readable. With `pipe`, you have to write them from
> right to left.

With `futils`, you can create lenses which operate on objects with the `makeLenses` function. See below for some example code.

```javascript
const {makeLenses, view, set, over, compose} = require('futils');

// This is our state
const Player = {name: 'John Doe', stats: {hp: {max: 550, level: 275}, level: 6}};

// these are our lenses
const L = makeLenses('name', 'stats', 'hp', 'level');
```

We have a bunch of lenses now, but most of them are not really useful just by themself. They need some helpers called `view`, `set` and `over`. 

### View
The `view` function is useful to extract (or view, hence it's name) the part of the data structure the used lens is focusing on. For example:

```javascript
const {makeLenses, view, set, over, compose} = require('futils');


const Player = {name: 'John Doe', stats: {hp: {max: 550, level: 275}, level: 6}};

const L = ...


// composition of lenses
const hpLevel = compose(L.stats, L.hp, L.level);


view(L.name, Player); // -> 'John Doe'
view(hpLevel, Player); // -> 275
```

### Set
As you might have guessed, `set` changes the value a given lens focuses on.

```javascript
const L = ...
const hpLevel = ...


set(L.name, 'John Doe!', Player); // -> {name: 'John Doe!', stats: { ... }};
set(hpLevel, 250, Player); // -> {name: 'John Doe', stats: {hp: {level: 250, ...}}};
```

Note that `set` does not alter the `Player` constant or it's internals! instead, it always creates a new "Player" and returns it.


### Over
Now we have a way to set and to view parts of the structure, but we cannot manipulate any value which is inside it. This is what `over` is useful for. It works like mapping a function through a lens over a value and then giving the whole structure back again.

```javascript
const L = ...
const hpLevel = ...


// toUpper :: String -> String
const toUpper = (s) => s.toUpperCase();

// decrease :: Int -> Int
const decrease = (n) => n - 25;


over(L.name, toUpper, Player); // -> {name: 'JOHN DOE', stats: { ... }};
over(hpLevel, decrease, Player); // -> {name: 'John Doe', stats: {hp: {level: 250, ...}}};
```

Like `set` it creates a new structure and leaves the old one intact.


## Focusing over arrays
When creating a new set of lenses with `makeLenses`, a special lens for numerical keys is created, too. It has the special name `index`.

```javascript
const L = makeLenses(); // just index based lenses

const thirdOfFirst = compose(L.index(0), L.index(2));

view(thirdOfFirst, [['a', 'b', 'c']]); // -> 'c'
set(thirdOfFirst, 'd', [['a', 'b', 'c']]); // -> [['a', 'b', 'd']]
over(thirdOfFirst, toUpper, [['a', 'b', 'c']]); // -> [['a', 'b', 'C']]
```

Instead of piping the whole array structure through the lens, it is also possible to map a lens over the array:

```javascript
[['a', 'b', 'c']].map(over(L.index(2), toUpper)); // -> [['a', 'b', 'C']]
```

If you need to map over every item of an array, `futils` provides a special helper lens called `mappedLens`:

```javascript
const {mappedLens, over} = require('futils');

over(mappedLens, toUpper, ['a', 'b', 'c']); // -> ['A', 'B', 'C']
```

You can compose it exactly like other lenses:

```javascript
const {mappedLens, over, compose} = require('futils');

const mapMapLens = compose(mappedLens, mappedLens);

over(mapMapLens, toUpper, [['a', 'b', 'c']]); // -> [['A', 'B', 'C']]
```

## A lens for `Map`s
Since ES6 (or ES2015) the new `Map` structure is available in JavaScript. The lenses in `futils` are not primarily created to work with this new structure, but it is trivial to create a lens which does work with them which covers the final part of this tutorial.

For the purpose of creating new _kinds_ of lenses, there exists the special `lens` function that accepts a getter and a setter function and creates us a new lens.

```javascript
const {lens} = require('futils');

const mapsL = lens(                      // mapsL is a new lens type
    (key, m) => m.get(key),              // getter function for mapsL
    (key, value, m) => m.set(key, value) // setter function for mapsL
);
```

Here, `mapsL` is a new lens which works over ES6 `Map` structures:

```javascript
const {lens, over, map} = require('futils');

// mapsL :: Lens
const mapsL = lens(
    (key, m) => m.get(key),
    (key, value, m) => m.set(key, value)
);

// userMap :: Map
const userMap = new Map([['users', ['John Doe']]]);

// prog :: [String] -> [String]
const prog = map((s) => s.split(' ').reverse().join(', '));

over(mapsL('users'), prog, userMap).entries();
// -> [[users', ['Doe, John']]]
```

However, by using this code the `userMap` structure is altered which is _not_ how lenses work in general. So please keep in mind: If you create new lens types, _you are responsible for making them work correctly_. This means, the setter function should create a new `Map`.

> This is not necessary but just good measure! Maybe you are working with a
> third party library like `Immutable.js` which already creates a new Map when
> you call `set` on it!

```javascript
const {lens, over} = require('futils');

const mapsL = lens(
    (key, m) => m.get(key),
    (key, value, m) => new Map(m.entries()).set(key, value) // return a new Map
);
```


---
[Index](./readme.md)

##### See also
- [Lenses, Stores and Yoneda](https://bartoszmilewski.com/2013/10/08/lenses-stores-and-yoneda/)






