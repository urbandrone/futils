# A pattern for medium to decent sized applications

![John Doe](https://api.adorable.io/avatars/285/doe%40example.com "John Doe")





```javascript
// dvc-app.js
const {Task, curry} = require('futils');
const snabbdom = require('snabbdom');
const classes = require('snabbdom/modules/class');
const props = require('snabbdom/modules/props');
const style = require('snabbdom/modules/style');
const on = require('snabbdom/modules/eventlisteners');

const patch = snabbdom.init([classes, props, style, on]);

// async :: a → Task a
const async = (v) => Task.is(v) ? v : Task.of(v);

// signalize :: (Action → State) → ActionType → a → ()
const signalize = curry((f, type, data) => f({type, data}));

// render :: State → DOM → Component → ()
const render = curry((state, node, cmp) => {
    // vNode is a new virtual representation of the state
    // as a virtual DOM node
    const vNode = cmp.view(state, signalize((action) => {
        // next contains the new state produced by the controller.
        // by wrapping it in a Task, we are free to do async
        //   actions in the controller and return them which
        //   will resolve the automatically
        // run executes the computation and fails silently or
        //   produces a new state and calls render with it
        const next = async(cmp.controller(state, action));
        next.run(() => null, // <- place (Error → ()) here like log
                 (nstate) => render(nstate, vNode, cmp));
    }));
    patch(node, vNode);
});

module.exports = { render };
```





---
[Index](./readme.md)






