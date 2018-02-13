# Array mutations
The `futils` library itself is written pure, which means it does not mutation any state by itself. And, all functions which work on arrays create new copies of the array (except `fold`, `foldRight`, etc.) they work on. Let's take a look at how to use them to ease our life a bit.

## Array mapping and folding
The most common things we usually do when working with large collections of items is:

* mapping
* filtering
* and folding/reducing

People tend to use (in terms of functional programming) clumsy libraries when doing so, and in response fall back to a OOP based style of programming because the wrap every array into `_.chain` and then call the `.prototype` based method on the returned instance. That's not very functional.

Let's see how to do things in a functional way. Here is a little example. It's a bit generic, but it helps to see the differences in both writing and thinking about stuff.

> **Tip**
> To understand _what_ some code does it is often useful to start reading from
> _bottom to top_, to understand _how_ it does it's things start reading from 
> _top to bottom_

> **Tip**
> Here's a small info for reading the type annotations:
> 
> A `type alias` means, we want a new name for an existing type. So 
> `type alias A :: Array` says "Everytime you read A, read Array".
> 
> Functions are annotated this way: `NameOfFunc :: a -> b -> c`
> which says "For every NameOfFunc you see, use a function which first takes
> a, then takes b and then returns c."
> Functions with signatures `NameOfFunc :: [a, b] -> c` mean "For every 
> NameOfFunc you see, use a function which first takes an array of a and b and
> then returns c."

### Example
Imagine you have a `[]` of many `[Number, Number]` which represent taxes and current capitals. Now you want to know "What's the total capital next month?", so you start writing a small program to calculate it for you.

The mathematical formula for calculating the capital per month for a whole year is:
```text
Capital + (Capital × Taxes × 12) ÷ (100 × 12)
```

We can write this as code:
```javascript
const {pipe, map, fold} = require('futils');
// type alias C :: Number
// type alias Z :: Number
// type alias T :: Number

// calcCapital :: [T, C] -> Z
const calcCapital = ([T, C]) => C + (C * T * 12) / (100 * 12);
// sum :: [Z] -> Z
const sum = fold((a, b) => a + b, 0);
// capital :: [[T, C]] -> Z
const completeCapitalPerYear = pipe(map(calcCapital), sum);

const ACCOUNTS = [
    [3.42, 100],
    [2.38, -250]
];

completeCapitalPerYear(ACCOUNTS); // -> -152.53
```

Just two functions which we can reuse easily and some help from `map`, `fold` and `pipe`. First we write our function to calculate the capital after a year, then we define a function to calculate a sum of any array of numbers (which can come from anywhere if you already have one).

Using `map` we map over the _outer_ accounts the function to calculate the capital and then sum it all up. Tada: Out comes the overall capital the next month! Nice!

OK, this might be a bit cheesy but it illustrates the basic concept. We define _how to transform one thing_, then use the array utilities to _transform many of them_. You can also use monoids, what you will see in a later tutorial.

### Creating images from Base64 encoded strings
Here is another example of the concept. We want to create a hashmap of images from an array of `{}` which describe the images. Something you might receive from a web api.

So here is how you might end up building this stuff (we'll see how to work with async code when we reach the [monads tutorial](./monads.md)):

```javascript
// notice how we use futils from a CDN and therefor don't use require but the
// global futils namespace instead

/* globals futils */
const {curry, pipe, map, fold} = futils;

/*
type alias Frag :: HTMLDocumentFragment
type alias Img :: HTMLImageElement
type alias JSONImage :: { name :: String, type :: String, :: base64 :: String }
*/

// toImg :: JSONImage -> Img
const toImg = curry(({type, name, base64}) => {
    const img = document.createElement('img');
    img.alt = name.trim();
    img.src = `data:${type};base64,${base64}`;
    return img;
});

// collector :: Frag -> Img -> Frag
const collector = curry((fragm, img) => {
    (fragm || (fragm = document.createDocumentFragment())).appendChild(img);
    return fragm;
});

// create :: [JSONImage] -> Frag
const create = pipe(map(toImg), fold(collector, null));


// Boom!
const IMAGES = [{
    name: '',
    type: 'image/png'
    base64: '',
}, {
    name: '',
    type: 'image/jpg'
    base64: '',
}];

document.body.appendChild(create(IMAGES));
```

## Filtering, scanning, manipulating and combining of arrays
Besides mapping and filtering, `futils` provides functions to filter arrays, finding the first/last occurences or any occurence of a value inside a array as well as combining arrays in different ways.

Although `futils` does not alter any input, it automatically clones the array into a new one. This way you can create new versions of existing things by not destroying the older data, which will become important if you want to use `pipe` and `compose` as well as the Monads we will see later.

#### Signatures
```text
filter :: (a -> Boolean) -> [a] -> [a]

find :: (a -> Boolean) -> [a] -> a

first :: [a] -> a

differ :: [a, b] -> [b, c] -> [a, c]

drop :: Number -> [a] -> [a]
```

All good stuff! The filter function works just like the usual filter you know from `[]` and with the find function you can get the first occurence of a value from the left for which a predicate function returns true. With the first function you get the first item out of a array, the differ function gives a array of differences between two arrays and the drop functions drops a number of items from the beginning of a array and returns the rest.

Except filter, all of the functions also have accompanying functions which do the opposite:

#### Signatures
```text
findRight :: (a -> Boolean) -> [a] -> a

last :: [a] -> a

intersect :: [a, b] -> [b, c] -> [b]

take :: Number -> [a] -> [a]
```

This shows how to use take, map and fold together:
```javascript
const {curry, pipe, map, take, fold} = futils;

/*
type alias Frag :: HTMLDocumentFragment
type alias DOM :: HTMLElement
type alias Recommendation :: {}
*/

// -- here is a utility
// $frag :: () -> Frag
const $frag = () => document.createDocumentFragment();

// getRecommendationsAsync :: String, a -> Promise [Recommendation] Error
const getRecommendationsAsync = (url, params) => ...
// recommendationToDom :: Recommendation -> DOM
const recommendationToDom = (recommendation) => ...
// toFragment :: [DOM] -> Frag
const toFragment = (elms) => fold($append, $frag(), elms);

// prog :: [Recommendation] -> Frag
const prog = pipe(take(5), map(recommendationToDom), toFragment);

getRecommendationsAsync(). // <- Promise [Recommendation] Error
    then(prog). // <- Promise Frag Error
    then((fragment) => { document.body.appendChild(fragment); }).
    catch((exc) => { console.error(exc.message); });
```

## Array creation
Not only can you manipulate existing arrays, you can also quickly create arrays by using `futils`. This is done by using two other utility functions:

#### Signatures
```text
range :: Int -> Int -> [Int]

unfold :: (a -> [a, b] || null) -> a -> [b]
```

What is that? OK, `range` seems fairly simple, right? It takes two integers and returns us an array of intergers starting from the first through to and including the second.

But what ist `unfold`? This looks a bit weird: It takes a function `(a -> [a, b] || null)`, then some `a` and finally it returns an array `[b]`. Let me tell you: `range` is implemented in terms of unfold and uses it under the hood.

Here is how you can use it for example:
```javascript
const {pipe, call, unfold, memoize} = require('futils');

const fibs = unfold((n) => n > 0 ? [n, (n - 1) + (n - 2)] : null);

const fibonacci = memoize(pipe(fibs, call('reverse')));

fibonacci(13); // -> [1, 1, 2, 3, 5, 8, 13]
```

We also use memoization here, which increases performance if `fibonacci` is called more than once by only run the calculation when the incoming argument differs from a previous call.

## The end
Hopefully this helps understanding how to use the `futils` array functions at a solid basic concept which we are going to build upon in upcoming examples.


---
[Index](./readme.md)






