By reading the title of this tutorial, the more experienced functional programmer thinks `Semigroup` and – as a result – hopes for `Monoid`. And this is exactly what this tutorial is all about.

#### Further readings
- [Fantas, eel and specification](http://www.tomharding.me/fantasy-land/)



## Getting the terms right
Let's start with the `Semigroup`. Simply speaking, it defines a general way to combine things of the same type. For example, imagine we have two `Array`s of `Number`s and want to combine them. 
```javascript
const nums1 = [1, 2, 3];

const nums2 = [4, 5, 6];
```

Easy: Using `concat`, we can add the elements together into a single `Array`!
```javascript
console.log(nums1.concat(nums2)); // logs [1, 2, 3, 4, 5, 6]
```

Usually we say, we _concatenate_ the arrays. And, you can see that `Array` instances themself form a `Semigroup`, because `Array`s have a build in way to combine two of them via `.concat`. As trivial as it seems, this is a big deal.

Because, from a technical point of view, it doesn't matter how we combine stuff – in normal order? Or reversed? In case of this example, it appears to be logical to concat `nums2` to the end of `nums1` because of the order of numbers in them. But what if it had been two lists of data in which the order doesn't matter? Maybe it would've been perfectly valid to combine them the other way around.

A `Semigroup` can be thaught of being a kind of protocol that a more concrete type implements (or _guarantees to implement_). As shown above:  
The `Array` data type _guarantees_ to be _concattenable_, because it belongs to the _typeclass_ `Semigroup`.





> **Semigroups**
> There are a number of things which can belong to the `Semigroup` typeclass:  
> `String`, `Number`, `Function`, `Array`, `Boolean`, etc...  
>
> The monoidal structures in the `.monoid` namespace of futils allow to wrap many of the native data types with the behaviour of `Semigroup` and/or `Monoid`.
> `Fn`, which allows to concatenate `function` together, has been used in the [quickstart]{@tutorial 01-quickstart}
>
> As you'll see later, every `Monoid` also implement the typeclass `Semigroup`. This means, you can also use almost every data structures shipping with
> futils when you work with things which have to be combined – have a look into the docs if you like.


## Can we use `concat` with custom data types?
Yes, we can do the same to other types of data containers, too! Here's another example, which defines a `Customer` data type that also belongs to the set of `Semigroup`s:
```javascript
const { adt: {UnionType},
        generics: {Show, Eq} } = require('futils');


// data Customer a = Complete a
//                 | Incomplete a
const Customer = UnionType('Customer', { Complete: ['data'], Incomplete: ['data'] }).
  deriving(Show, Eq);

const {Complete, Incomplete} = Customer;

// #from :: Customer C, Object a => a -> C a
Customer.from = function (d) {
  return d.name && d.birthdate && d.email && d.address ? Complete(d) : Incomplete(d);
}

// concat :: Customer C => C a ~> C a -> C a
Customer.fn.concat = function (C) {
  return this.caseOf({
    Complete: () => this,
    Incomplete: data1 => {
      return C.caseOf({
        Complete: () => C,
        Incomplete: data2 => Customer.from(Object.assign({}, data1, data2))
      })
    }
  });
}



module.exports = {
  Customer
}
```

A `Customer` is a small wrapper around various sets of data, which have to be combined. It can accumulate an unlimited amount of datasets, but they all are wrapped by an `Incomplete` type. If `Incomplete` datasets contain at least these properties:

| Property  | Key          | Requires to be of type |
| --------- | ------------ | ---------------------- |
| Name      | `.name`      | Any                    |
| Birthdate | `.birthdate` | Any                    |
| E-Mail    | `.email`     | Any                    |
| Addresses | `.address`   | Any                    |

They will be marked as a `Complete` set of data.

Although this `concat` function does look a bit complicated, it is perfectly valid and obeys all laws which are associated with `concat`. The `Customer` type therefor is part of the `Semigroup` typeclass.

> **Using `generics`**
> The example uses the **generics** namespace of futils to automatically _derive_ functionality. There are some generic typeclasses shipping with 
> futils, which allows you to implement the required protocols automatically. Here, the `Show` typeclass implements a special `.toString` function
> and the `Eq` typeclass implements a way to check for (deep) equality via `.equals`.
>
> ```javascript
> const { ..., generics: {Show, Eq} } = require('futils');
> ```
>
> ```javascript
> .deriving(Show, Eq);
> ```
>
> This comes with a price. First of all, typeclasses have to be given in a special order, because certain typeclasses depend on
> functionality given by other typeclasses. For example: The Orderable (`Ord`) typeclass depends on the Setoid (`Eq`) typeclass. Also, generics
> will use a generic implementation as base. So, if the generic implementation acts incorrect or throws errors, you have to provide a correctly
> behaving implementaion yourself.
>
> For a complete overview about the typeclasses that require other typeclasses as well as their correct behaviours, have a look into
> the [Fantasy-Land Spec](https://github.com/fantasyland/fantasy-land)

We will be using this data type to demonstrate the use of _concatenation_ to build a bigger result from smaller ones by combining them. Let's assume you got information from two different AJAX calls, one for retrieving the personal information and one for retrieving the address information. They both return their data as JSON:
```javascript
// sendPost :: String -> {} -> Promise JSON Error
const sendPost = url => data => fetch(url, data).then(r => r.json());

// httpPersonal :: {} -> Promise JSON Error
const httpPersonal = sendPost('https://example.com/customers/personal/');
/*
Returns a JSON object with this shape:
{
  "name": String,
  "birthday": UNIX-Timestamp (MS since epoch),
  "email": [{
    "place": String
    "address": String
  }]
}
*/

// httpAddress :: {} -> Promise JSON Error
const httpAddress = sendPost('https://example.com/customers/address/');
/*
Returns a JSON object with this shape:
{
  "address": [{
    "street": String,
    "city": String,
    "zip": String,
    "state": String,
    "country": String
  }]
}
*/
```

Let's combine these two pieces of informations into a single `Customer`! First of all, we need to merge these two separate `Promise`s into a single one with the help of `Promise.all`. Then, we can write a function that takes all the pieces of information and combines them into a single `Customer` data type.  
Easy enough:
```javascript
const { adt: {UnionType},
        generics: {Show, Eq},
        lambda: {compose, curry},
        operation: {map, reduce, concat} } = require('futils');


// Other definitions ...


// upon :: (a -> b) -> ((a -> b) -> c) -> a -> c
const upon = curry((f, g, x) => g(f)(x));

// toCustomer :: JSON [{}] -> Customer a
const toCustomer = compose(
  upon(reduce(concat), f => f(Incomplete({})) ),
  map(Incomplete));

// httpCustomerById :: Number -> Promise (Customer a) Error
const httpCustomerById = customerId => {
  return Promise.all([
    httpPersonal({ body: JSON.stringify({customerId}) }),
    httpAddress({ body: JSON.stringify({customerId}) })
  ]).then(toCustomer);
}



module.exports = {
  Customer,
  httpCustomerById
}
```

It runs all the HTTP calls, then it marks all the indiviual results as `Incomplete` and it finally combines all of them by concatenation into a final `Customer`. If some information is missing, we still get a `Incomplete` dataset back. But if all the required information has been available, we automatically mark the data as `Complete`. And we can do better!



## Getting it right
Let's try to make all of it a bit more readable. This `upon` function is cool though (try and see if you can find out what it does!), but surely it's hard to read. And the `toCustomer` function isn't much better either. First of all, instead of `upon`, `compose`, `map`, `reduce` and `concat`, we could've used `foldMap` and `Customer.from`. This means less imports and less code overall as well!
```javascript
const { adt: {UnionType},
        generics: {Show, Eq},
        operation: {foldMap} } = require('futils');


// Other definitions ...


// Remove upon function
// Remove toCustomer function

// httpCustomerById :: Number -> Promise (Customer a) Error
const httpCustomerById = customerId => {
  return Promise.all([
    httpPersonal({ body: JSON.stringify({customerId}) }),
    httpAddress({ body: JSON.stringify({customerId}) })
  ]).then(foldMap(Customer.from));
}



module.exports = {
  ...
}
```

It would be nice if we were able to convert a `Customer` to another data structure which represents success or failure, especially when the outside world faces our custom data types. And to be able to convert between both structures back and forth freely would be awesome, too. No problem folks – let's do this!


## Converting our `Customer` into `Maybe`
We could either use the `Maybe` or the `Either` data type from the **data** namespace. Which one's better highly depends on the use case. If you want to discard all information of `Incomplete` data use `Maybe`. If you instead want (or need) to convey incomplete datasets, use `Either`. For this tutorial, we are going to use the `Maybe` type.
```javascript
const { adt: {UnionType},
        generics: {Show, Eq},
        operation: {foldMap},
        data: {Maybe} } = require('futils');


// Other definitions ...


// customerToMaybe :: Customer C, Maybe M => C a -> M a
const customerToMaybe = customer => customer.caseOf({
  Complete: Maybe.Some,
  Incomplete: _ => Maybe.None()
});

// maybeToCustomer :: Customer C, Maybe M => M a -> C a
const maybeToCustomer = maybe => maybe.caseOf({
  Some: Customer.from,
  None: _ => Incomplete({})
});



module.exports = {
  Customer,
  httpCustomerById,
  customerToMaybe,
  maybeToCustomer
}
```

Now, we are able to convert freely between a `Customer` and a `Maybe`. This benefits users which want to use our code, because they don't have to deal with a custom data structure. 

#### Usage example
```javascript
const { operation: {foldMap} } = require('futils');
const { httpCustomerById, customerToMaybe } = require('app/customerinfo');


// ========= PURE =========

// renderCustomer :: Maybe M => Maybe a -> String
const renderCustomer = foldMap(data => {
  return `<div class="customer">
    <h1>${data.name}</h1>
    // ... display email, birthdate, addresses ...
  </div>`;
}, '');



// ========= IMPURE =========

// htmlInto :: HTMLElement -> String -> ()
const htmlInto = el => html => {
  el.innerHTML = html;
}



// ========= USE =========

httpCustomerById(123).                // <-- Retrieve Customer
  then(customerToMaybe).              // <-- Convert to Maybe
  then(renderCustomer).               // <-- Do a save render
  then(htmlInto(document.body)).      // <-- Add to HTML
  catch(console.error.bind(console));
```


## Monoids

```javascript
const { adt: {UnionType},
        generics: {Show, Eq},
        operation: {foldMap},
        data: {Maybe} } = require('futils');


// Other definitions ...


// #empty :: () -> Customer a
Customer.empty = () => Incomplete({});
```

```javascript
const { adt: {UnionType},
        generics: {Show, Eq},
        operation: {fold},
        data: {Maybe} } = require('futils');


// Other definitions ...


// httpCustomerById :: Number -> Promise (Customer a) Error
const httpCustomerById = customerId => {
  return Promise.all([
    httpPersonal({ body: JSON.stringify({customerId}) }),
    httpAddress({ body: JSON.stringify({customerId}) })
  ]).then(fold(Customer));
}
```