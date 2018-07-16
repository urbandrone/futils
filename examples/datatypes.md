# Datatypes and pattern matching
Using abstract data types (ADTs) and pattern matching is common in a lot of functionals languages. With `futils` you can use these techniques to a certain extend when writing JavaScript. In this tutorial we will see how.

## Simple types
Although JavaScript is not strict, it provides some types to program against. All of us know the situation when we see an "undefined is not a XXX" message by running our programs. Some people try to work around this by using a static type checker like [Flow](https://flow.org/) or a compile-to-javascript language like [TypeScript](https://www.typescriptlang.org/) which includes static type checking out of the box. On the other hand, some people enjoy not having to write type annotations all the time and argue that most type checking systems just cover the most simple types but cannot help when looking at complex datatypes.

`futils` tries to help in both cases. First of all, it includes a bunch of functions to check against simple types provided by the runtime with the help of the functions found in the types package.

Here is a small excerpt:
```javascript
const {isString, isInt, isWeakMap, isIterable} = require('futils');

isString('Hello world'); // -> true
isString(null); // -> false

isInt(123); // -> true
isInt(123.0); // -> false

isWeakMap(new WeakMap()); // -> true
isWeakMap([]); // -> false

isIterable([]); // -> true
isIterable({}); // -> false
```

And often times they are enough to get the job done. But sometimes you want to have more complex types to check against and work with. 

### Complex types
Imagine you would want to use more advanced types for – lets say – a contacts application. What types would you use? Well, obviously there would be two things, a "person" type and a "list of persons" type. Lets first focus on the "person" type.

What are persons made of? Usually people tend to have a first name and a last name as well as an address where they live. We could model the first and last name from strings. Fair enough, here is our first implementation:

```javascript
const {isString} = require('futils');

const Person = (first, last) => {
    if (!isString(first)) { // first is no string? then reject
        throw 'The first name of a person must be a string!';
    }
    if (!isString(last)) { // last is not a string? then also reject
        throw 'The last name of a person must be a string!';
    }
    return {first, last};
}
```

OK, with this we can create a person. But wait, we missed the address part! We could implement it almost the same way right into the `Person` function but because addresses may be shared between different persons, lets create a separate `Address` function for it.

What are addresses made of? Usually they contain a street and a city. We can model both with strings, too. Lets do that:

```javascript
const {isString} = require('futils');

const Person = (first, last) => {
    ... skipped ...
}

const Address = (street, city) => {
    if (!isString(street)) {
        throw 'The street of an address must be a string!';
    }
    if (!isString(city)) {
        throw 'The city of an address must be a string!';
    }
    return {street, city};
}
```

That looks good. By now, we can create a person and we can create an address. But we cannot type check against either of both, so we need to implement more stuff to do that. Lets do it:

```javascript
const {isString} = require('futils');

const Person = (first, last) => {
    ... skipped ...
}

const Address = (street, city) => {
    ... skipped ...
}

const isPerson = (x) => x && isString(x.first) && isString(x.last);

const isAddress = (x) => x && isString(x.street) && isString(x.city);
```

Seems to do what we want? Unfortunatly not. Initially we defined a person to be someone who has a first name, a last name _and_ an address. At this point we could either extend `Person` with a third argument or we could create a _third_ function which combines the `Address` and the `Person` function. In my optinion both ways are valid, but to keep things simple we decide to do the first and extend the `Person` function with a third parameter. This also means, we need to shift and modify our code a bit:

```javascript
const {isString} = require('futils');

const Address = (street, city) => {
    ... skipped ...
}

const isAddress = (x) => x && isString(x.street) && isString(x.city);

const Person = (first, last, address) => {
    if (!isString(first)) {
        throw 'The first name of a person must be a string!';
    }
    if (!isString(last)) {
        throw 'The last name of a person must be a string!';
    }
    if (!isAddress(address)) {
        throw 'The address given is invalid!';
    }
    return {first, last, address};
}

const isPerson = (x) => x && isString(x.first) && isString(x.last) && isAddress(x.address);
```

Yay, we have a working solution to create addresses and persons! But man – we had to do a lot of stuff! Lets try it:

```javascript
const {isString} = require('futils');

... skipped ...

const addr1 = Address('Fake Road 123', 'Faketown');
const johndoe = Person('John', 'Doe', addr1);

isPerson(johndoe); // -> true
johndoe.toString(); // -> [object Object]
```

Oh no, persons are objects and therefor return `[object Object]` when we call `toString` on them. This means we need a custom `toString` function if we want to print them properly. And we haven't even started writing the code for lists of persons!

Lets have a look if `futils` can lend us a helping hand here.

### A more sane solution
Instead of writing down everything by hand, `futils` provides you a simple but very powerful function named `Type`. The code below does _exactly the same_ (and more!) the code we have written above does, plus it is obviously more readable:

```javascript
const {Type, isString} = require('futils');

const Address = Type('Address', {
    street: isString,
    city: isString
});

const Person = Type('Person', {
    first: isString,
    last: isString,
    address: Address.is
});
```

We defined two types here: An `Address` type and a `Person` type, just like we did before. But we don't have to write down all the complicated logic which works behind the scenes. And look: The address field of the `Person` type validates against the `Address` type without us having to define any special function to do so. Awesome!

```javascript
const addr1 = Address({street: 'Fake Road 123', city: 'Faketown'});
const johndoe = Person({first: 'John', last: 'Doe', address: addr1});

Person.is(johndoe); // -> true
johndoe.toString(); // -> "Person(John, Doe, Address(Fake Road 123, Faketown))"
```

Calling `toString` gives us back a clear description of what is _inside_ the type, even if another type is nested into it.

### Working with abstract types
Now we have seen what abstract types _are_, we need to take a look at how we can _use_ them. To do so, the `Type` function defines a little helper function `cata` which allows to create functions based on pattern matching, which allows us to match against a _type_. Here is a little demo:

```javascript
const show = Type.cata({
    Address: (x) => `${x.street} in ${x.city}`,
    Person: (x) => `${x.first} ${x.last} from ${show(x.address)}`
});
```

This means: Let `show` be a function which either matches against an `Address` or against a `Person` and prints out a neat description. Lets try it:

```javascript
const addr2 = Address({street: 'Teststreet 1', city: 'Exampleton'});
const dianejones = Person({first: 'Diane', last: 'Jones', address: addr2});

show(dianejones); // -> 'Diane Jones from Teststreet 1 in Exampleton'
```

What happens if we pass in a string?

```javascript
show('Test'); // -> Error 'Type.cata :: Unable to pattern match Test'
```

We _restricted_ the `show` function to only work on two types, namely `Address` and `Person` but we passed it a value of type `String` and that is the reason it threw an error.

We can relax this behaviour a bit, if we tell `cata` how to deal with things which neither are `Address` or `Person` values by adding a third case named `orElse` which will be called for any value which does not match another case.

```javascript
const show = Type.cata({
    Address: (x) => `${x.street} in ${x.city}`,
    Person: (x) => `${x.first} ${x.last} from ${show(x.address)}`,
    orElse: (x) => isString(x) ? x : ''
});
```

Let's try passing in the string again:

```javascript
show('Test'); // -> 'Test'
```

### Pattern matching
In fact, we don't have to stop here – `Type.cata` not only allows to match on types defined via `Type` itself, but also to pattern match agains _native_ values (except `null` and `undefined`). This means, we can write the `show` function more expressive by adding a case for strings:

```javascript
const show = Type.cata({
    Address: (x) => `${x.street} in ${x.city}`,
    Person: (x) => `${x.first} ${x.last} from ${show(x.address)}`,
    String: (s) => s,
    orElse: () => ''
});
```

Finally, we can use _destructuring_. This leaves us with the end result:

```javascript
const show = Type.cata({
    Address: ({street, city}) => `${street} in ${city}`,
    Person: ({first, last, address}) => `${first} ${last} from ${show(address)}`,
    String: (s) => s,
    orElse: () => ''
});
```

## Extending types
Besides `cata`, some types we define need more methods to work efficiently with them. Good news: Any type returned by `Type` is a constructor function and we can augment it's `prototype` with new methods.

For example, let's construct a type `TimeStamp` which holds a value of type `Date`, and implement the Functor interface on it (if you havn't done already, take a look at the [monads](./monads.md) example).

```javascript
const {Type, curry, isDate} = require('futils');


const TimeStamp = Type('TimeStamp', isDate);

TimeStamp.prototype.map = function (f) {
    return this.fold((d) => TimeStamp(f(d)));
}
```

Aw yeah, now we can run functions over the value in our custom type and keep all the goodness we've seen so far! Here's some code for you:

```javascript
const MS_DAY = 1000 * 60 * 60 * 24;


// incrementDays :: Number -> TimeStamp Date -> TimeStamp Date
const incrementDays = curry((n, date) => new Date(+date + n * MS_DAY));


TimeStamp(new Date(2018, 2, 10)).
    map(incrementDays(3)).
    fold((d) => d); // -> Date(2018, 2, 13)
```


## Conclusion
This tutorial gave a brief introduction about how to define and use abstract types and the `Type` function provided by `futils`. I hope you enjoyed reading it and got some ideas how to use abstract types in your own programs.



---
[Index](./readme.md)






