# Currying and partial application


## curry
```javascript
// helpers/maths.js
const {curry} = require('futils');

const add = curry((a, b) => a + b);
const sub = curry((a, b) => a - b);
const mult = curry((a, b) => a * b);
const div = curry((a, b) => a / b);
const mod = curry((a, b) => a % b);

module.exports = {
    add, sub, mult, div, mod
};
```

```javascript
// calc.js
const maths = require('./helpers/maths');


```

## partial
```javascript
// helpers/maths.js
const {curry, partial} = require('futils');

...

const max = partial(Math.max.bind(Math), 0);
const min = partial(Math.min.bind(Math), 0);

module.exports = {
    ..., max, min
};
```

---
[Index](./readme.md)






