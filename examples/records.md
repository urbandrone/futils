# Transformation of objects
This time we are going to look at the `merge` operator of `futils` and how to use it when coding applications.

## What does it?
The merge function was designed to extend a given object in a pure way so that it doesnt override the given object. For convencience you can just pass in the original and then a `{}` with properties to change and the merge function will automatically create a modified copy of the original. It is really useful for redux-style applications.

#### Signature
```text
merge :: a -> b -> ab'
```

It takes object `a` and object `b` and returns a copy of both merged together. In fact, I lied. The real signature would rather be:

```text
merge :: a -> b -> ...n -> ab ... n'
```

because it accepts two up to N object to be merged together.

## How do I use it?
Use the merge function when you need to merge intermediate data collections together. These will be needed quite often and merge is therefor a useful utility.

Here is some example code:
```javascript
const {merge} = require('futils');

const getUserAvatar = (url) => ... // some promise
const getUserInfo = (url) => ... // some promise

Promise.all(getUserAvatar(url), getUserInfo(url)).
    then(merge). // combine intermediate JSON
    then((infoAvatar) => ... /* do stuff */).
    catch((exc) => console.error(exc.message));
```

Or you can use it to update some state and return the new version:
```javascript
const {merge} = require('futils');

// updateAge :: state -> state
const updateAge = (state) => state.isDead ?
                             state :
                             merge(state, {age: state.age + 1});

// update :: state, action -> state
const update = (state, action) => {
    switch (action.type) {
        case 'UPDATE_AGE':
            return updateAge(state);
        default:
            return state;
    }
}
```

Although it looks like `merge` modifies the state, it internally first creates a copy and modifies the copy then.

## Reading from a object
There exists the `field` function which is a convenient helper when accessing objects. It takes a `{key : value}` pair and transforms it into a `[[key, value]]` structure, which can be looped/mapped/etc. easily.

#### Signature
```text
field :: String -> a -> b
```

The nice thing is, you can given `field` a path to follow into the structure like this:
```javascript
const {field} = require('futils');

const STRUCT = {foo: {type: 'img', size: {w: 160, h: 90}},
                bar: {type: 'video', size: {w: 320, h: 180}}};

const fooWidth = field('foo.size.w');
const fooHeight = field('foo.size.h');

fooWidth(STRUCT); // -> 160
fooHeight(STRUCT); // -> 90
```


## Arrays from objects and objects in arrays
Quite often you will want to transform a given object into a array, so you can map, filter and fold over it. Here is how you can do it with `futils` and the pairs function:

```javascript
const {pairs, merge, fold} = require('futils');

@TODO
```

Another often found structure are arrays with objects in them.

One well-known function from underscore/lodash is `pluck`: It takes an array of objects and a property name and extracts the property value from each object.
This is how you create it with `futils`:

```javascript
const {map, field, curry} = require('futils');

/*
type alias Hash :: Object
*/

// pluck :: String -> [Hash] -> [a]
const pluck = curry((prop, xs) => map(field(prop), xs));

// getVal :: [Hash] -> [a]
const getVal = pluck('value');



const VALS = [{
    value: 10
}, {
    value: 8
}];

getVal(VALS); // -> [10, 8]
pluck('value', VALS); // -> [10, 8]
```

## The end
Hopefully you found that useful and stay tuned for the next part, which covers the topic of monads!


---
[Index](./readme.md)





