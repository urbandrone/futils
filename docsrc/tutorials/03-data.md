Examples of the data structures found in the `data` namespace.

#### Further readings
- [Fantas, eel and specification](http://www.tomharding.me/fantasy-land/)



# Examples

### Avoid `null/undefined` checks

Using `Maybe` allows to avoid `null` and `undefined` checks. 

```javascript
const { data: {Maybe} } = require('futils');

const DATA = {
  a: { b: 3 }
}


const safeGet = prop => x =>
  prop in x
    ? Maybe.from(x[prop])
    : Maybe.empty();


safeGet('a')(DATA).flatMap(safeGet('b')); // -> Some(3)
safeGet('a')(DATA).flatMap(safeGet('c')); // -> None()
```

Use `Maybe` to implement a safe query function for DOM elements.

```javascript
const { data: {Maybe} } = require('futils');


const safeQuery = selector => x =>
  Maybe.from(x && x.querySelector ? x.querySelector(selector) : null);


safeQuery('main')(document)
  .flatMap(safeQuery('.main-article'));  // -> Some(<article>)

safeQuery('main')(document)
  .flatMap(safeQuery('.not-exisiting')); // -> None()
```



### Pretty `Error` handling

The `Either` structure makes it easy to provide a much nicer handling of `Error`s
and/or to short-circuit a `Error` producing operation with an appropriate failure
description.

```javascript
const { data: {Either} } = require('futils');


const isNum = x => typeof x === 'number' && !isNaN(x);

const multiply = x => y =>
  isNum(x) && isNum(y)
    ? Either.Right(x * y)
    : Either.Left(`Cannot multiply ${y} with ${x}`);

const divide = x => y =>
  isNum(x) && isNum(y)
    ? x !== 0
        ? Either.Right(y / x)
        : Either.Left(`Division by zero ${y}/${x}`)
    : Either.Left(`Cannot divide ${y} by ${x}`);


multiply(2)(2)
  .flatMap(divide(4));   // -> Right(1)

multiply(2)(NaN)
  .flatMap(divide(4));   // -> Left('Cannot multiply NaN with 2')

multiply(2)(2)
  .flatMap(divide(0));   // -> Left('Division by zero 4/0')

multiply(2)(2)
  .flatMap(divide(NaN)); // -> Left('Cannot divide 4 by NaN')
```



### Modify local state

To modify some local state in place, the `State` data structure can be utilized.
The example below shows how it is used to modify the index positions of items in
an `Array`.

```javascript
const { data: {State} } = require('futils');


const DATA = ['a', 'b', 'c', 'd'];
const INDEX_MASK = [
    [0, 3], // switch first and forth in place   => ['d', 'b', 'c', 'a']
    [2, 3], // switch third and fourth in place  => ['d', 'b', 'a', 'c'] 
    [3, 1]  // switch fourth and second in place => ['d', 'c', 'a', 'b']
  ];


const shiftArray = mask => State.get()
  .flatMap(xs => {
    if (mask.length < 1) {
      return State.of(xs);
    }

    // === MODIFY ARRAY ===
    let shift = mask[0];
    let temp = xs[shift[0]];
    xs[shift[0]] = xs[shift[1]];
    xs[shift[1]] = temp;
    // === MODIFY ARRAY ===

    return State.put(xs).flatMap(() => shiftArray(mask.slice(1)));
  });


shiftArray(INDEX_MASK)
  .run([...DATA]); // -> ['d', 'c', 'a', 'b']
```



### Synchronous I/O and side effects

The `IO` data structure is used to write a simple API for `window.localStorage`.

```javascript
const { data: {IO} } = require('futils');


// type Todo = { id :: Number, title :: String, closed :: Boolean }

// DATA :: [ Todo ]
const DATA = [
  { id: 0, title: 'Test todo 1', closed: false },
  { id: 1, title: 'Test todo 2', closed: true }
]



const localStore = IO.of(window.localStorage);

const read = key => IO(storage =>
  !storage.has(key)
    ? null
    : JSON.parse(storage.getItem(key))
);

const write = key => data => IO(storage => {
  storage.setItem(key, JSON.stringify(data));
  return storage;
});

const saveAs = slot => todos => store =>
  store.concat(
    read(slot).flatMap(oldTodos =>
      store.concat(write(slot)(JSON.stringify(todos))
        .map(_ => !oldTodos ? [] : JSON.parse(oldTodos))
      )
    )
  );



saveAs('my-todo-app')(DATA)(localStore); // -> IO ([ Todo ])
```



### Async code

Using `Task` to make a lazy `Promise`.

```javascript
const { data: {Task} } = require('futils');


const getJSON = url => Task((reject, resolve) => {
  fetch(url).then(r => r.json())
    .then(resolve)
    .catch(reject);
});


const getUsers = getJSON('https://reqres.in/api/users?page=2'); // -> Task Error JSON

getUsers.run(
  err => console.error('Error occured', err),
  users => console.log('Received data', users)
);
```

Using `Task` to wrap node's `fs` module.

```javascript
const { data: {Task} } = require('futils');
const fs = require('fs');


const readFile = path => Task((reject, resolve) =>
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }
    resolve(data);
  })
);

const writeFile = path => data => Task((reject, resolve) =>
  fs.writeFile(path, 'utf8', data, err => {
    if (err) {
      return reject(err);
    }
    resolve(path);
  })
);

const copyFile = path => destination =>
  readFile(path).flatMap(writeFile(destination));


copyFile('myfile.txt')('mycopy.txt')
  .run(
    err => console.error('Error whily copying', err),
    path => console.log('Copied to', path)
  );
```