Let's have a look at how futils can be used with other frameworks like React. 



## The purpose of futils
The futils library isn't designed for tasks like DOM manipulation or rendering
views, it is designed to manipulate data instead. 



> **Note**
> foo bar baz bam quux  
> 


## Headline Section


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
      onSubmit={onSubmit}
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
  First: Symbol('UserFirstName'),
  Last: Symbol('UserLastName'),
  Mail: Symbol('UserEMail')
};



const setProp = curry((prop, id, value, user) => {
  return user.id !== id ? user : { ...user, [prop]: value };
});

const update = (users, {type, payload: {id, value}}) => {
  switch (type) {
    case Actions.First:
      return users.map(setProp('firstname', id, value));
    case Actions.Last:
      return users.map(setProp('lastname', id, value));
    case Actions.Mail:
      return users.map(setProp('email', id, value));
    default:
      return users;
  }
}



const User = ({id, firstname, lastname, email, onChange}) => {
  const setState = curry((actionType, userId, e) => {
    onChange({
      type: actionType,
      payload: {
        id: userId,
        value: e.target.value.trim()
      }
    });
  });

  <Form className="user" action={`/user/${id}/save`} method="POST">
    <FormGroup className="grid grid--c2-rA">
      <TextInput name="Firstname" value={firstname} onChange={setState(Actions.First, id)}>Firstname</TextInput>
      <TextInput name="Lastname" value={lastname} onChange={setState(Actions.Last, id)}>Lastname</TextInput>
      <TextInput name="Email" value={email} onChange={setState(Actions.Mail, id)}>Email</TextInput>
    </FormGroup>
  </Form>
}



module.exports = { User, update };
```


```javascript
// file: App.js

const ReactDOM = require('react-dom');
const { Store } = require('./helpers/store');
const { User, update } = require('./components/user');



const { dispatch, getState } = Store(update, [{
  id: 0,
  firstname: 'John',
  lastname: 'Doe',
  email: 'jdoe@acme.com'
}]);

const Users = ({list, interact}) => (
  <div className="users">
  {list.map(user => (
    <User
      key={user.id}
      id={user.id}
      firstname={user.firstname}
      lastname={user.lastname}
      email={user.email}
      onChange={interact} />
  ))}
  </div>
);



ReactDOM.render(<Users list={getState()} interact={dispatch} />, document.querySelector('#app'));
```