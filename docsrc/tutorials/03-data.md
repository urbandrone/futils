Examples of data structures found in the `data` namespace.


# Common use cases

## Avoid `null/undefined` checks

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

```javascript
const { data: {IO, Maybe} } = require('futils');


const queryDOM = selector => x => IO(() =>
   x.flatMap(y => Maybe.from(y.querySelector(selector)))
);


queryDOM('main')
  .flatMap(queryDOM('.main-article'));  // -> IO (Some <article>)

queryDOM('main')
  .flatMap(queryDOM('.not-exisiting')); // -> IO (None)
```

## Pretty `Error` handling

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


## Modify local state

```javascript
const { data: {State} } = require('futils');


const shiftArray = mask => State.get()
  .flatMap(xs => {
    if (mask.length < 1) {
      return State.of(xs);
    }

    let ys = [...xs];
    let shift = mask[0];
    let temp = ys[shift[0]];
    ys[shift[0]] = ys[shift[1]];
    ys[shift[1]] = temp;
    return State.put(ys).flatMap(() => shiftArray(mask.slice(1)));
  });


shiftArray([ [0, 3], [2, 3], [3, 1] ])
  .run(['a', 'b', 'c', 'd']); // -> State(['d', 'c', 'a', 'b'])
```


## Synchronous I/O and side effects

```javascript
const { data: {IO} } = require('futils');


const localStore = IO.of(window.localStorage);

const read = key => IO(storage => storage.getItem(key));

const write = key => data => IO(storage => {
  storage.setItem(key, data);
  return storage;
});



// TODOS_DATA :: [ Todo ]
const TODOS_DATA = [
  { id: 0, title: 'Test todo 1', closed: false },
  { id: 1, title: 'Test todo 2', closed: true }
]

const saveAs = slot => todos =>
  read(slot).flatMap(oldTodos =>
    write(slot)(JSON.stringify(todos))
      .map(_ => !oldTodos ? [] : JSON.parse(oldTodos))
  );


saveAs('my-todo-app')(TODOS_DATA)
  .ap(localStore); // -> IO ([ Todo ])
```


## Async code

```javascript
const { data: {Task} } = require('futils');


const getJSON = url => Task((reject, resolve) => {
  fetch(url).then(r => r.json())
    .then(resolve)
    .catch(reject);
});


const getUsers = getJSON('my/api/users'); // -> Task Error [User]

getUsers.run(
  err => console.error('Error occured', err),
  users => console.log('Received data', users)
);
```