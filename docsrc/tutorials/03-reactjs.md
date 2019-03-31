Let's have a look at how futils can be used with other frameworks. This tutorial uses React and a minimal Flux implementation. 



## Why another framework?
The purpose of futils is to ease working with _data_, that's what it has been designed for. Other frameworks are designed to make working with the view layer easier. By combining the two solutions, we can build whole applications.





## Code snippets


```javascript
// file: helpers/unique.js


// chr :: () -> String
const chr = () => Math.random().toString(16).slice(-4);

// uniqueId :: String? -> String
const uniqueId = prefix => `${prefix ? prefix + '-' : ''}${[
    chr4() + chr4(),
    chr4(),
    chr4(),
    chr4(),
    chr4(),
    chr4() + chr4()
].join('-')}`;



module.exports = { uniqueId };
```


```javascript
// file: helpers/sideeffect.js

const { adt: {Type}, data: {IO} } = require('futils');



// data Effect a = SideEffect (Task Error (IO a))
const Effect = Type('SideEffect', ['getIO'])

Effect.of = a => Effect(() => IO(x => {
  const r = a(x);
  return r === void 0 ? x : r;
}));

Effect.empty = () => Effect.of(x => x);

Effect.fn.concat = function (S) {
  return Effect(() => this.getIO().concat(S.getIO()));
}

Effect.fn.run = function (x) {
  try {
    return this.getIO().run(x);
  } catch (exc) {
    if (console) {
      console.error(exc);
    }
  }
}



module.exports = { Effect };
```


```javascript
// file: helpers/store.js

const { lambda: {curry} } = require('futils');



// Store :: (a -> Action -> a) -> a -> Store
const Store = curry((update, initial) => {
  let state = initial;
  let observers = new Set();

  const getState = () => state;

  const dispatch = action => {
    state = update(state, action);
    observers.forEach(obs => { obs.update(state); });
  }

  const subscribe = observer => {
    observers.add(observer);
    return () => { observers.delete(observer); }
  }

  return { dispatch, getState, subscribe };
});

Store.combineUpdates = (...updates) => curry((state, action) => {
  return updates.reduce((s, u) => u(s, action), state);
});



module.exports = { Store };
```


```javascript
// file: elements/textinput.js

const { uniqueId } = require('../helpers/unique');



const TextInput = ({className, children, name, value, placeholder, onChange}) => {
  const _id = uniqueId('input');

  return (
    <div className={`input input--text ${className}`}>
      <label
        className="input_label"
        htmlFor={_id}
      >
        {children}
      </label>
      <input
        className="input_element"
        id={_id}
        name={name}
        value={value || null}
        placeholder={placeholder || null}
        onChange={onChange}
      />
    </div>
  );
}



module.exports = { TextInput };
```


```javascript
// file: elements/forms.js



const rejEvent = e => { e.preventDefault(); }

const FormGroup = ({className, children}) => {
  return (
    <div className={`form_group ${className}`}>
    {children}
    </div>
  );
}

const Form = ({className, children, action, method, enctype, onSubmit}) => {
  return (
    <form
      className={`form ${className}`}
      action={action}
      onSubmit={onSubmit || rejEvent}
      method={method || 'GET'}
      enctype={enctype || 'application/x-www-form-urlencoded'}
    >
    {children}
    </form>
  );
}



module.exports = { Form, FormGroup };
```


```javascript
// file: components/user.js

const { lambda: {curry} } = require('futils');



const Actions = {
  First: Symbol('SetUserFirstName'),
  Last: Symbol('SetUserLastName'),
  Mail: Symbol('SetUserEMail')
};



const setWhereIdEquals = curry((prop, id, value, user) => {
  return user.id !== id ? user : { ...user, [prop]: value };
});

const update = (users, {type, payload: {id, value}}) => {
  switch (type) {
    case Actions.First:
      return users.map(setWhereIdEquals('firstname', id, value));
    case Actions.Last:
      return users.map(setWhereIdEquals('lastname', id, value));
    case Actions.Mail:
      return users.map(setWhereIdEquals('email', id, value));
    default:
      return users;
  }
}


const fxRead = Effect.of(env => {
  env.event.preventDefault();
  env.value = env.event.target.value.trim();
});

const fxChange = Effect.of(env => {
  env.change({
    type: env.action,
    payload: {
      id: env.id,
      value: env.value
    }
  });
});


const User = ({id, firstname, lastname, email, onChange}) => {  
  const setState = curry((actionType, userId, e) => fxRead.
    concat(fxChange).
    run({
      event: e,
      change: onChange,
      action: actionType,
      id: userId
    }));

  <Form className="user" action={`/user/${id}/save`}>
    <FormGroup className="grid grid--c2-rA">
      <TextInput name="Firstname" value={firstname} onInput={setState(Actions.First, id)}>Firstname</TextInput>
      <TextInput name="Lastname" value={lastname} onInput={setState(Actions.Last, id)}>Lastname</TextInput>
      <TextInput name="Email" value={email} onInput={setState(Actions.Mail, id)}>Email</TextInput>
    </FormGroup>
  </Form>
}



module.exports = { User, update };
```


```javascript
// file: components/appform.js

const { lambda: {curry} } = require('futils');
const { uniqueId } = require('../helpers/unique');
const { Effect } = require('../helpers/sideeffect');



const Actions = {
  AddUser: Symbol('AddUser')
};




const update = (users, {type, payload: user}) => {
  switch (type) {
    case Actions.AddUser:
      return users.concat(user);
    default:
      return users;
  }
}


const fxEvent = Effect.of(env => {
  env.event.preventDefault();
  return Object.assing(env, {
    nodes: {
      first: env.event.target.elements['Firstname'],
      last: env.event.target.elements['Lastname'],
      email: env.event.target.elements['Email']
    }
  });
});

const fxSubmit = Effect.of(env => {
  env.submit({
    type: env.action,
    payload: {
      id: env.id,
      firstname: env.nodes.first.value.trim(),
      lastname: env.nodes.last.value.trim(),
      email: env.nodes.email.value.trim()
    }
  });
});

const fxClear = Effect.of(env => {
  env.nodes.first.value = '';
  env.nodes.last.value = '';
  env.nodes.email.value = '';
});


const AppForm = ({onSubmit}) => {  
  const setState = curry((actionType, e) => fxEvent.
    concat(fxClear).
    concat(fxSubmit).
    run({
      event: e,
      submit: onSubmit,
      action: actionType,
      id: uniqueId()
    }));

  return (
    <Form className="appform" action="users/add" onSubmit={setState(Actions.AddUser)}>
      <FormGroup className="grid grid--c2-rA">
        <TextInput name="Firstname">Firstname</TextInput>
        <TextInput name="Lastname">Lastname</TextInput>
        <TextInput name="Email">Email</TextInput>
      </FormGroup>
      <FormGroup className="form_footer">
        <button type="submit" className="btn btn--submit">Add User</button>
      </FormGroup>
    </Form>
  );
}



module.exports = { AppForm, update };
```


```javascript
// file: App.js

const ReactDOM = require('react-dom');
const { Store } = require('./helpers/store');
const User = require('./components/user');
const AppForm = require('./components/appform');


const update = Store.combineUpdates(User.update, AppForm.update);

const { dispatch, getState } = Store(update, [{
  id: 0,
  firstname: 'John',
  lastname: 'Doe',
  email: 'jdoe@acme.com'
}]);

const Users = ({list, interact}) => (
  <div className="app_users">
  {list.map(user => <User key={user.id}
                          id={user.id}
                          firstname={user.firstname}
                          lastname={user.lastname}
                          email={user.email}
                          onChange={interact} />
  )}
  </div>
);

const App = () => (
  <div className="app">
    <AppForm onSubmit={dispatch} />
    <Users list={getState()} interact={dispatch} />
  </div>
)



ReactDOM.render(<App />, document.querySelector('#app'));
```