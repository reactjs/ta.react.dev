---
title: immutability
---

<Intro>

Props, state, மற்றும் [immutable ஆக இருக்கும்](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) பிற values-ஐ mutate செய்வதை எதிர்த்து validate செய்கிறது.

</Intro>

## Rule விவரங்கள் {/*rule-details*/}

ஒரு component-ன் props மற்றும் state immutable snapshots. அவற்றை நேரடியாக mutate செய்யக்கூடாது. அதற்கு பதிலாக புதிய props-ஐ கீழே pass செய்து, `useState`-இலிருந்து கிடைக்கும் setter function-ஐப் பயன்படுத்துங்கள்.

## பொதுவான மீறல்கள் {/*common-violations*/}

### Invalid {/*invalid*/}

```js
// ❌ Array push mutation
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // Mutate செய்கிறது!
    setItems(items); // அதே reference, re-render இல்லை
  };
}

// ❌ Object property assignment
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // Mutate செய்கிறது!
    setUser(user); // அதே reference
  };
}

// ❌ Sort without spreading
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort mutate செய்கிறது!
  };
}
```

### Valid {/*valid*/}

```js
// ✅ Create new array
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // புதிய array
  };
}

// ✅ Create new object
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // புதிய object
  };
}
```

## சிக்கல் தீர்வு {/*troubleshooting*/}

### ஒரு array-க்கு items சேர்க்க வேண்டும் {/*add-items-array*/}

`push()` போன்ற methods மூலம் arrays-ஐ mutate செய்தால் re-renders trigger ஆகாது:

```js
// ❌ Wrong: Mutating the array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // அதே array reference!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

அதற்கு பதிலாக புதிய array உருவாக்குங்கள்:

```js
// ✅ Better: Create a new array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // Or: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### Nested objects-ஐ update செய்ய வேண்டும் {/*update-nested-objects*/}

Nested properties-ஐ mutate செய்தால் re-renders trigger ஆகாது:

```js
// ❌ Wrong: Mutating nested object
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // Mutation!
    setUser(user); // அதே object reference
  };
}
```

Update செய்ய வேண்டிய ஒவ்வொரு level-இலும் spread செய்யுங்கள்:

```js
// ✅ Better: Create new objects at each level
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}
```
