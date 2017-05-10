# Getting focused
This time we take a quick dive into some of the things you can do with lenses and how you can put them into use. `futils` shippes a kind of lenses called `van Laarhoven` lenses which are based on functors.


## What are they useful for?
What's interesting about lenses in general is their ability to open nested data structures, manipulate some stuff inside and reconstruct the entire structures around the altered parts. Read that again.

Because all lenses are just functions in and of themself, they can be composed together like all other functions can with `compose` and `pipe`.

With `futils`, you can create lenses which operate on objects with the `makeLenses` function. See below for some example code.

```javascript
const {makeLenses, view, set, over, pipe} = require('futils');

// This is our state
const Player = {name: 'John Doe', stats: {hp: {max: 550, level: 275}, level: 6}};

// these are our lenses
const L = makeLenses('name', 'stats', 'hp', 'level');
```

We have a bunch of lenses now, but most of them are not really useful just by themself. They need some helpers called `view`, `set` and `over`. 

### View
The `view` function is useful to extract (or view, hence it's name) the part of the data structure the used lens is focusing on. For example:

```javascript
const {makeLenses, view, set, over, pipe} = require('futils');


const Player = {name: 'John Doe', stats: {hp: {max: 550, level: 275}, level: 6}};

const L = ...


// composition of lenses
const hpLevel = pipe(L.stats, L.hp, L.level);


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
We have ways to set and to view now but we cannot manipulate any value which is inside a structure. This is what `over` is useful for. It works like mapping a function through a lens over a value and then giving the whole structure back again.

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
When creating a new set of lenses with `makeLenses`, a special lens for numerical keys is created too. It has the special name `index`.

```javascript
const L = makeLenses(); // just index based lenses

const thirdOfFirst = pipe(L.index(0), L.index(2));

view(thirdOfFirst, [['a', 'b', 'c']]); // -> 'c'
set(thirdOfFirst, 'd', [['a', 'b', 'c']]); // -> [['a', 'b', 'd']]
over(thirdOfFirst, toUpper, [['a', 'b', 'c']]); // -> [['a', 'b', 'C']]
```

Instead of piping the whole array structure through the lens, it is also possible to map a lens over the array:

```javascript
[['a', 'b', 'c']].map(over(L.index(2), toUpper)); // -> [['a', 'b', 'C']]
```

If you need to map over all items an array contains, `futils` provides a special helper lens called `mappedLens`:

```javascript
const {mappedLens, over} = require('futils');

over(mappedLens, toUpper, ['a', 'b', 'c']); // -> ['A', 'B', 'C']
```

You can compose it exactly like other lenses:

```javascript
const {mappedLens, over, pipe} = require('futils');

const mapMapLens = pipe(mappedLens, mappedLens);

over(mapMapLens, toUpper, [['a', 'b', 'c']]); // -> [['A', 'B', 'C']]
```


---
[Index](./readme.md)

##### See also
- [Lenses, Stores and Yoneda](https://bartoszmilewski.com/2013/10/08/lenses-stores-and-yoneda/)






