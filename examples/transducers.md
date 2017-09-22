# Working with transducers
In contrast to working with loops, one may use the usual Array.prototype methods to iterate over an array. Transducers are somewhat of the next step of iterating over collections. `futils` comes with a set of transducers inspired by the clojure language.

## The power of transducers
One of the most significant disantvatages of the native Array methods is that each of them creates a new intermediate collection, which results in multiple
`for`-loop-like behaviours for each method call. This slows down the execution time of your code (the more operations you do, the slower it gets). This is one of the main reasons developers tend to avoid using `map`, `filter` and `reduce`.

No one can doubt that this code:
```javascript
let output = [1, 2, 3].
        map((n) => n + 1).
        filter((n) => n > 2).
        reduce((acc, n) => acc + ' ' + n, 'Numbers:');
output; // -> Numbers: 3 4
```

is nicer to read and understand than this one:
```javascript
let output = 'Numbers:',
    ns = [1, 2, 3];
for (let i = 0, l = ns.length, t; i < l; ++i) {
    t = ns[i] + 1;          // map
    if (t > 2) {           // filter
        output += ' ' + t;  // reduce
    }
}
output; // -> Numbers: 3 4
```

But the second one is faster! This is because it only makes **one** loop instead of the Array.prototype methods which loop **three** times over the numbers.

In other words, using the Array.prototype is like writing this (although much shorter):
```javascript
let output = 'Numbers:',
    ns = [1, 2, 3],
    copy1 = [],
    copy2 = [];
for (let i = 0, l = ns.length; i < l; ++i) {
    copy1[i] = ns[i] + 1;      // map
}
for (let i = 0, l = copy1.length; i < l; ++i) {
    if (copy1[i] > 2) {           // filter
        copy2[i] = copy1[i];
    }
}
for (let i = 0, l = copy2.length; i < l; ++i) {
    output += ' ' + copy2[i];  // reduce
}
output; // -> Numbers: 3 4
```

The benefit of being much more readable has the drawback to slow down your code. But we want the best of both worlds! But how?

## Transform and reduce
By using transducers! A transducer itself is just a function and can be composed like any other function too. This is pretty straight forward and allows to create code like this: 
```javascript
const {transducers, compose} = require('futils');
const {map, filter, transduce} = transducers;

const join = (a, b) => a + ' ' + b;
const inc1Filter2 = compose(map((n) => n + 1), filter((n) => n > 2));

transduce(inc1Filter2, join, 'Numbers:', [1, 2, 3]); // -> Numbers: 3 4
```

And it only uses **one** loop. Cool! There is a bunch of other cool stuff transducers can be useful for.

## Be lazy
Transducers are lazy in a sense that they allow to create chains of complex transformations which are only ever executed by calling `transduce` on them.

## Be portable
The transducers provided by `futils` implement the [transducer protocol](https://github.com/queckezz/transducer-protocol) which improves portability. So for example, you can use the transducers in combination with [reactive streams](./ex02-reactive.md) as long as they implement a `transduce` method which adheres to the same protocol. You can even mix-and-match multiple transducer libraries with `futils`, for example if some of them provide transducers `futils` does not provide.


---
[Index](./readme.md)






