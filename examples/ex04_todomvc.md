# TodoMVC
The famous "TodoMVC" implemented with `futils` and `snabbdom`.

## First lesson
Lorem ipsum dolor...

Here comes a code block:
```javascript
// constants.js
const INPUT_PLACEHOLDER = 'What needs to be done?';

```

Here comes a code block:
```javascript
// helpers.js
const {exec, pipe, partial} = require('futils');

const replace = partial(exec('replace'), undefined, undefined);
const toLowerCase = exec('toLowerCase');

const escId = pipe(replace( /\s+|\.|\:/g, '_'), toLowerCase);


module.exports = {
    replace, toLowerCase, escId
}
```

Here comes a code block:
```javascript
// todo.js
const $h = require('snabbdom/h');
const {curry, partial} = require('futils');
const {escId} = require('./helpers');


// Model : String -> String -> Model
const Model = curry((name, done) => ({name, done}));


// radio : String -> String -> Bool -> Fn -> VNode
const radio = curry((name, value, checked, handler) => {
    return $h('input.radio_input', {
        props: {type: 'radio', name, value, checked},
        on: {change: handler}
    });
});

// View : Model -> VNode
const View = ({name, done}, handler) => {
    return $h('div', {className: done ? 'todo done' : 'todo'}, [
        radio(escId(name), 'done', done, handler(!done)),
        $h('span.todo_name', name)
    ]);
}

module.exports = {
    Model, View
};
```

Here comes a code block:
```javascript
// todos.js
const $h = require('snabbdom/h');
const {exec, compose} = require('futils');
const Todo = require('./todo');
const {INPUT_PLACEHOLDER} = require('./constants');


const Model = (todos) => todos.map(Todo.Model);


const ADD_NEW = Symbol('add_todo');
const CHECK = Symbol('todo_done');
const UNCHECK = Symbol('todo_not_done');
const CLEAR_DONE = Symbol('remove_done');

const update = (action, model) => {
    switch (action.type) {
        case ADD_NEW:
            return [...model, Model(action.data)];
        case CLEAR_DONE:
            return model.filter((todo) => !todo.done);
        case CHECK:
        case UNCHECK:
            return model.map((todo) => {
                if (todo.name === action.id) {
                    todo.done = !todo.done;
                }
                return todo;
            });
        default:
            return model;
    }
}


const View = (model) => {
    return $h('div.todos', {}, [
        $h('div.todos_head', {}, [
            $h('input.todos_input', {
                props: {type: 'text', placeholder: INPUT_PLACEHOLDER},
                on: {input: update}
            })
        ])
    ]);
}
```
Here comes a code block:
```javascript
// main.js
const $ = require('snabbdom');


const patch = $.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners')
]);

```

### Theory or subsection inside lesson
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat.


---
[Index](./readme.md)






