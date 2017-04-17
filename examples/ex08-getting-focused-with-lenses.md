# Getting focused
This time we take a quick dive into some of the things you can do with lenses and how you can put them into use. `futils` shippes a kind of lenses called `van Laarhoven` lenses which are based on functors.

## What is this useful for?
What's interesting about lenses in general is their ability to open nested data structures, manipulate some stuff inside them and reconstruct an entire structure around the altered part. Read that again.

Because all lenses are just functions in and of themself, they can be composed together like all other functions can with `compose` and `pipe`.

```javascript
const {makeLenses, view, set, over, pipe} = require('futils');

// This is our state
const JohnDoe {name: 'John Doe', stats: {hp: {max: 550, level: 275}, level: 6}};

// these are our lenses
const L = makeLenses('name', 'stats', 'hp', 'level', 'max');
```

We have a bunch of lenses now, but most of them are not really useful just by themself. They need some helpers called `view`, `set` and `over`. 

### View
The `view` function is useful to extract (or view, hence it's name) the part of the data structure the used lens is focusing on. For example:

```javascript
const {makeLenses, view, set, over, pipe} = require('futils');


const JohnDoe {name: 'John Doe', stats: {hp: {max: 550, level: 275}, level: 6}};

const L = ...


// extracting first level
view(L.name, JohnDoe); // -> 'John Doe'

// extracting from nested structure

const hpLevel = pipe(L.stats, L.hp, L.level);
view(hpLevel, JohnDoe); // -> 275
```

### Set
As you might have guessed, `set` changes the value a given lens focuses on.

```javascript

const L = ...


// setting first level
set(L.name, 'John Doe!', JohnDoe); // -> {name: 'John Doe!', stats: { ... }};

// setting a value inside a nested structure
set(hpLevel, 250, JohnDoe); // -> {name: 'John Doe', stats: {hp: {level: 250, ...}}};
```

Note that `set` does not alter the `JohnDoe` constant or it's internals! instead, it always creates a new "JohnDoe" and returns it.

### Over
We now have ways to set some data and to view some data, but we cannot manipulate any data which is inside a structure. This is what `over` is useful for. It works like mapping a function through a lens over a value and then giving the whole structure back again.

```javascript

const L = ...



// exclaim :: String -> String
const exclaim = (s) => s + '!';

// hit :: Int -> Int
const hit = (n) => n - 25;


// altering first level
over(L.name, exclaim, JohnDoe); // -> {name: 'John Doe!', stats: { ... }};

// altering a value inside a nested structure
over(hpLevel, hit, JohnDoe); // -> {name: 'John Doe', stats: {hp: {level: 250, ...}}};
```

Like `set` it creates a new structure which it returns.


## Enough theory 


---
[Index](./readme.md)

##### See also
- [Lenses, Stores and Yoneda](https://bartoszmilewski.com/2013/10/08/lenses-stores-and-yoneda/)






