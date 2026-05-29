---
title: useReducer
---

<Intro>

`useReducer` என்பது உங்கள் component-க்கு [reducer](/learn/extracting-state-logic-into-a-reducer) ஒன்றை சேர்க்க உதவும் React Hook ஆகும்.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

[Reducer](/learn/extracting-state-logic-into-a-reducer) மூலம் state manage செய்ய, உங்கள் component-ன் top level-இல் `useReducer`-ஐ call செய்யுங்கள்.

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[கீழே மேலும் examples பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `reducer`: State எப்படி update ஆக வேண்டும் என்பதை specify செய்யும் reducer function. இது pure ஆக இருக்க வேண்டும், state மற்றும் action-ஐ arguments ஆக எடுக்க வேண்டும், மேலும் next state-ஐ return செய்ய வேண்டும். State மற்றும் action எந்த types ஆகவும் இருக்கலாம்.
* `initialArg`: Initial state calculate செய்யப்படும் value. இது எந்த type value ஆகவும் இருக்கலாம். அதிலிருந்து initial state எப்படி calculate செய்யப்படுகிறது என்பது அடுத்த `init` argument-ஐப் பொறுத்தது.
* **optional** `init`: Initial state-ஐ return செய்ய வேண்டிய initializer function. இது specify செய்யப்படவில்லை என்றால், initial state `initialArg` ஆக set செய்யப்படும். இல்லையெனில், `init(initialArg)` call செய்த result initial state ஆக set செய்யப்படும்.

#### திருப்பி அளிப்பது {/*returns*/}

`useReducer` சரியாக இரண்டு values கொண்ட array ஒன்றை return செய்கிறது:

1. தற்போதைய state. First render போது, இது `init(initialArg)` அல்லது `initialArg` (இங்கு `init` இல்லையெனில்) ஆக set செய்யப்படும்.
2. State-ஐ வேறு value-க்கு update செய்து re-render trigger செய்ய அனுமதிக்கும் [`dispatch` function](#dispatch).

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `useReducer` ஒரு Hook; எனவே அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் அதை call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component ஒன்றை extract செய்து state-ஐ அதற்குள் move செய்யுங்கள்.
* `dispatch` function-க்கு stable identity உள்ளது; எனவே Effect dependencies-இலிருந்து அது omit செய்யப்பட்டிருப்பதை நீங்கள் அடிக்கடி காண்பீர்கள், ஆனால் அதை include செய்தாலும் Effect fire ஆகாது. Linter ஒரு dependency-ஐ errors இல்லாமல் omit செய்ய அனுமதித்தால், அது safe. [Effect dependencies remove செய்வது பற்றி மேலும் அறிக.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* Strict Mode-இல், [accidental impurities கண்டுபிடிக்க உதவ](/reference/react/useReducer#my-reducer-or-initializer-function-runs-twice) React உங்கள் reducer மற்றும் initializer-ஐ **இருமுறை call செய்யும்**. இது development-only behavior; production-ஐ பாதிக்காது. உங்கள் reducer மற்றும் initializer pure ஆக இருந்தால் (அப்படியே இருக்க வேண்டும்), இது உங்கள் logic-ஐ பாதிக்கக்கூடாது. Calls-இல் ஒன்றின் result ignore செய்யப்படும்.

---

### `dispatch` function {/*dispatch*/}

`useReducer` return செய்யும் `dispatch` function, state-ஐ வேறு value-க்கு update செய்து re-render trigger செய்ய அனுமதிக்கிறது. `dispatch` function-க்கு action-ஐ மட்டுமே argument ஆக pass செய்ய வேண்டும்:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

நீங்கள் provide செய்த `reducer` function-ஐ தற்போதைய `state` மற்றும் `dispatch`-க்கு pass செய்த action உடன் call செய்த result-க்கு React next state-ஐ set செய்யும்.

#### அளவுருக்கள் {/*dispatch-parameters*/}

* `action`: User செய்த action. இது எந்த type value ஆகவும் இருக்கலாம். Convention படி, action என்பது வழக்கமாக அதை identify செய்யும் `type` property கொண்ட object ஆக இருக்கும்; optionally கூடுதல் தகவலுடன் பிற properties-யும் இருக்கலாம்.

#### திருப்பி அளிப்பது {/*dispatch-returns*/}

`dispatch` functions-க்கு return value இல்லை.

#### கவனிக்க வேண்டியவை {/*setstate-caveats*/}

* `dispatch` function **state variable-ஐ *அடுத்த* render-க்காக மட்டுமே update செய்கிறது**. `dispatch` function call செய்த பிறகு state variable-ஐ read செய்தால், உங்கள் call-க்கு முன் screen-இல் இருந்த [பழைய value-யையே இன்னும் பெறுவீர்கள்](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value).

* நீங்கள் provide செய்யும் new value தற்போதைய `state`-க்கு identical ஆக இருந்தால், [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் தீர்மானிக்கப்படும் போல, React **component மற்றும் அதன் children-ஐ re-render செய்வதை skip செய்யும்.** இது optimization. Result ignore செய்வதற்கு முன் React இன்னும் உங்கள் component-ஐ call செய்ய வேண்டியிருக்கலாம்; ஆனால் அது உங்கள் code-ஐ பாதிக்கக்கூடாது.

* React [state updates-ஐ batch செய்கிறது.](/learn/queueing-a-series-of-state-updates) அனைத்து event handlers run ஆகி அவற்றின் `set` functions call செய்த பிறகு தான் screen-ஐ update செய்கிறது. இது single event-இல் multiple re-renders-ஐ தடுக்கிறது. DOM access செய்ய வேண்டும் போன்ற அரிதான சூழலில் React screen-ஐ முன்னதாக update செய்ய force செய்ய வேண்டும் என்றால், [`flushSync`.](/reference/react-dom/flushSync) பயன்படுத்தலாம்.

---

## பயன்பாடு {/*usage*/}

### Component-க்கு reducer சேர்த்தல் {/*adding-a-reducer-to-a-component*/}

[Reducer](/learn/extracting-state-logic-into-a-reducer) மூலம் state manage செய்ய, உங்கள் component-ன் top level-இல் `useReducer`-ஐ call செய்யுங்கள்.

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` சரியாக இரண்டு items கொண்ட array ஒன்றை return செய்கிறது:

1. நீங்கள் provide செய்த <CodeStep step={3}>initial state</CodeStep>-க்கு initially set செய்யப்பட்ட இந்த state variable-ன் <CodeStep step={1}>current state</CodeStep>.
2. Interaction-க்கு response ஆக அதை change செய்ய அனுமதிக்கும் <CodeStep step={2}>`dispatch` function</CodeStep>.

Screen-இல் உள்ளதை update செய்ய, user செய்ததை represent செய்யும் object ஒன்றுடன் <CodeStep step={2}>`dispatch`</CodeStep>-ஐ call செய்யுங்கள்; அது *action* என்று அழைக்கப்படுகிறது:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React current state மற்றும் action-ஐ உங்கள் <CodeStep step={4}>reducer function</CodeStep>-க்கு pass செய்யும். உங்கள் reducer next state-ஐ calculate செய்து return செய்யும். React அந்த next state-ஐ store செய்து, அதனுடன் உங்கள் component-ஐ render செய்து, UI-ஐ update செய்யும்.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('தெரியாத action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        வயதை அதிகரி
      </button>
      <p>வணக்கம்! உங்கள் வயது {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` [`useState`](/reference/react/useState)-க்கு மிகவும் ஒத்தது; ஆனால் அது event handlers-இலிருந்து state update logic-ஐ உங்கள் component-க்கு வெளியே single function-க்கு move செய்ய அனுமதிக்கிறது. [`useState` மற்றும் `useReducer` இடையே தேர்வு செய்வது பற்றி மேலும் வாசிக்கவும்.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Reducer function எழுதுதல் {/*writing-the-reducer-function*/}

Reducer function இப்படிப் declare செய்யப்படுகிறது:

```js
function reducer(state, action) {
  // ...
}
```

பிறகு next state-ஐ calculate செய்து return செய்யும் code-ஐ நிரப்ப வேண்டும். Convention படி, அதை [`switch` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) ஆக எழுதுவது பொதுவானது. `switch`-இல் ஒவ்வொரு `case`-க்கும் next state ஒன்றை calculate செய்து return செய்யுங்கள்.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('தெரியாத action: ' + action.type);
}
```

Actions எந்த shape-ஆகவும் இருக்கலாம். Convention படி, action-ஐ identify செய்யும் `type` property கொண்ட objects pass செய்வது பொதுவானது. Reducer next state compute செய்ய தேவையான மிகக் குறைந்த information மட்டும் அதில் இருக்க வேண்டும்.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Action type names உங்கள் component-க்கு local ஆகும். [ஒவ்வொரு action-மும் data-வில் multiple changes ஏற்படுத்தினாலும், ஒரு single interaction-ஐ describe செய்கிறது.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) State-ன் shape arbitrary; ஆனால் பொதுவாக அது object அல்லது array ஆக இருக்கும்.

மேலும் அறிய [state logic-ஐ reducer-க்கு extract செய்தல்](/learn/extracting-state-logic-into-a-reducer) வாசிக்கவும்.

<Pitfall>

State read-only. State-இல் உள்ள objects அல்லது arrays எதையும் modify செய்யாதீர்கள்:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

அதற்கு பதிலாக, எப்போதும் உங்கள் reducer-இலிருந்து புதிய objects return செய்யுங்கள்:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

மேலும் அறிய [state-இல் objects update செய்தல்](/learn/updating-objects-in-state) மற்றும் [state-இல் arrays update செய்தல்](/learn/updating-arrays-in-state) வாசிக்கவும்.

</Pitfall>

<Recipes titleText="அடிப்படை useReducer examples" titleId="examples-basic">

#### Form (object) {/*form-object*/}

இந்த example-இல், reducer இரண்டு fields கொண்ட state object ஒன்றை manage செய்கிறது: `name` மற்றும் `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('தெரியாத action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        வயதை அதிகரி
      </button>
      <p>வணக்கம், {state.name}. உங்கள் வயது {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Todo பட்டியல் (array) {/*todo-list-array*/}

இந்த example-இல், reducer tasks array ஒன்றை manage செய்கிறது. Array [mutation இல்லாமல்](/learn/updating-arrays-in-state) update செய்யப்பட வேண்டும்.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague பயணத்திட்டம்</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Kafka Museum பார்க்கவும்', done: true },
  { id: 1, text: 'Puppet show பார்க்கவும்', done: false },
  { id: 2, text: 'Lennon Wall படம்', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Task சேர்க்கவும்"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Immer மூலம் concise update logic எழுதுதல் {/*writing-concise-update-logic-with-immer*/}

Mutation இல்லாமல் arrays மற்றும் objects update செய்வது tedious ஆக இருந்தால், repetitive code-ஐ குறைக்க [Immer](https://github.com/immerjs/use-immer#useimmerreducer) போன்ற library பயன்படுத்தலாம். Objects mutate செய்வது போல concise code எழுத Immer அனுமதிக்கிறது; ஆனால் உள்ளார்ந்த முறையில் அது immutable updates செய்கிறது:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague பயணத்திட்டம்</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Kafka Museum பார்க்கவும்', done: true },
  { id: 1, text: 'Puppet show பார்க்கவும்', done: false },
  { id: 2, text: 'Lennon Wall படம்', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Task சேர்க்கவும்"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Initial state மீண்டும் உருவாகாமல் தவிர்த்தல் {/*avoiding-recreating-the-initial-state*/}

React initial state-ஐ ஒருமுறை save செய்து, அடுத்த renders-இல் அதை ignore செய்கிறது.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

`createInitialState(username)`-ன் result initial render-க்காக மட்டுமே பயன்படுத்தப்பட்டாலும், ஒவ்வொரு render-இலும் இந்த function-ஐ நீங்கள் இன்னும் call செய்கிறீர்கள். இது பெரிய arrays உருவாக்கினால் அல்லது expensive calculations செய்தால் wasteful ஆக இருக்கலாம்.

இதைக் தீர்க்க, அதை `useReducer`-க்கு third argument ஆக **_initializer_ function** ஆக pass செய்யலாம்:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

நீங்கள் pass செய்வது `createInitialState` என்ற *function தானே*, call செய்த result ஆன `createInitialState()` அல்ல என்பதை கவனியுங்கள். இவ்வாறு, initialization-க்கு பிறகு initial state மீண்டும் re-create ஆகாது.

மேலுள்ள example-இல், `createInitialState` `username` argument எடுக்கிறது. உங்கள் initializer initial state compute செய்ய எந்த information-மும் தேவையில்லை என்றால், `useReducer`-க்கு second argument ஆக `null` pass செய்யலாம்.

<Recipes titleText="Initializer pass செய்வதுக்கும் initial state-ஐ நேரடியாக pass செய்வதுக்கும் உள்ள வேறுபாடு" titleId="examples-initializer">

#### Initializer function pass செய்தல் {/*passing-the-initializer-function*/}

இந்த example initializer function-ஐ pass செய்கிறது; எனவே `createInitialState` function initialization போது மட்டுமே run ஆகும். Input-இல் type செய்வது போன்ற component re-renders போது அது run ஆகாது.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "-ன் task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('தெரியாத action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>சேர்</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Initial state-ஐ நேரடியாக pass செய்தல் {/*passing-the-initial-state-directly*/}

இந்த example initializer function-ஐ pass செய்யவில்லை; எனவே input-இல் type செய்வது போன்ற ஒவ்வொரு render-இலும் `createInitialState` function run ஆகும். Behavior-இல் observable difference இல்லை, ஆனால் இந்த code குறைவாக efficient.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "-ன் task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('தெரியாத action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>சேர்</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## சிக்கல் தீர்த்தல் {/*troubleshooting*/}

### நான் action dispatch செய்தேன், ஆனால் logging பழைய state value தருகிறது {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

`dispatch` function call செய்வது **running code-இல் state-ஐ change செய்யாது**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // 43 உடன் re-render request செய்கிறது
  console.log(state.age);  // இன்னும் 42!

  setTimeout(() => {
    console.log(state.age); // இதுவும் 42!
  }, 5000);
}
```

இதற்குக் காரணம் [states snapshot போல நடப்பது.](/learn/state-as-a-snapshot) State update செய்வது new state value உடன் இன்னொரு render request செய்கிறது; ஆனால் ஏற்கனவே running event handler-இல் உள்ள `state` JavaScript variable-ஐ அது பாதிக்காது.

Next state value-ஐ கணிக்க வேண்டுமெனில், reducer-ஐ நீங்களே call செய்து manually calculate செய்யலாம்:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### நான் action dispatch செய்தேன், ஆனால் screen update ஆகவில்லை {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் தீர்மானிக்கப்படும் போல, next state previous state-க்கு equal என்றால் React **உங்கள் update-ஐ ignore செய்யும்.** State-இல் உள்ள object அல்லது array-ஐ நேரடியாக change செய்தால் இது பொதுவாக நடக்கும்:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

நீங்கள் existing `state` object-ஐ mutate செய்து அதை return செய்தீர்கள்; எனவே React update-ஐ ignore செய்தது. இதை fix செய்ய, அவற்றை mutate செய்வதற்கு பதிலாக எப்போதும் [state-இல் objects update செய்தல்](/learn/updating-objects-in-state) மற்றும் [state-இல் arrays update செய்தல்](/learn/updating-arrays-in-state) செய்யப்படுகின்றன என்பதை உறுதி செய்ய வேண்டும்:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Dispatch செய்த பிறகு என் reducer state-ன் ஒரு பகுதி undefined ஆகிறது {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

New state return செய்யும்போது ஒவ்வொரு `case` branch-மும் **existing fields அனைத்தையும் copy செய்கிறது** என்பதை உறுதி செய்யுங்கள்:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // இதை மறக்க வேண்டாம்!
        age: state.age + 1
      };
    }
    // ...
```

மேலுள்ள `...state` இல்லாமல், returned next state `age` field மட்டும் கொண்டிருக்கும், வேறு எதுவும் இருக்காது.

---

### Dispatch செய்த பிறகு என் முழு reducer state undefined ஆகிறது {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

உங்கள் state எதிர்பாராதவிதமாக `undefined` ஆகுமானால், cases-இல் ஒன்றில் state-ஐ `return` செய்ய மறந்திருக்கலாம், அல்லது உங்கள் action type எந்த `case` statements-உடனும் match ஆகாமல் இருக்கலாம். ஏன் என்பதை கண்டுபிடிக்க, `switch`-க்கு வெளியே error throw செய்யுங்கள்:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('தெரியாத action: ' + action.type);
}
```

இத்தகைய mistakes-ஐ catch செய்ய TypeScript போன்ற static type checker-யையும் பயன்படுத்தலாம்.

---

### எனக்கு error வருகிறது: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.` என்று சொல்லும் error உங்களுக்கு வரலாம். பொதுவாக, இது render *போது* unconditional ஆக action dispatch செய்கிறீர்கள் என்பதைக் குறிக்கிறது; அதனால் உங்கள் component ஒரு loop-இல் செல்கிறது: render, dispatch (render ஏற்படுத்துகிறது), render, dispatch (render ஏற்படுத்துகிறது), இப்படியே. இது பெரும்பாலும் event handler specify செய்வதில் ஏற்படும் mistake காரணமாக இருக்கும்:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>என்னை click செய்</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>என்னை click செய்</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>என்னை click செய்</button>
```

இந்த error-ன் காரணத்தை கண்டுபிடிக்க முடியாவிட்டால், console-இல் error-க்கு அடுத்துள்ள arrow-ஐ click செய்து, error-க்கு காரணமான குறிப்பிட்ட `dispatch` function call-ஐ கண்டுபிடிக்க JavaScript stack-ஐ பாருங்கள்.

---

### என் reducer அல்லது initializer function இருமுறை run ஆகிறது {/*my-reducer-or-initializer-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode)-இல், React உங்கள் reducer மற்றும் initializer functions-ஐ இருமுறை call செய்யும். இது உங்கள் code-ஐ உடைக்கக்கூடாது.

இந்த **development-only** behavior [components-ஐ pure ஆக வைத்திருக்க](/learn/keeping-components-pure) உதவுகிறது. React calls-இல் ஒன்றின் result-ஐ பயன்படுத்தி, மற்றதின் result-ஐ ignore செய்கிறது. உங்கள் component, initializer, மற்றும் reducer functions pure ஆக இருக்கும் வரை, இது உங்கள் logic-ஐ பாதிக்கக்கூடாது. ஆனால் அவை accidentally impure ஆக இருந்தால், mistakes-ஐ notice செய்ய இது உதவும்.

உதாரணமாக, இந்த impure reducer function state-இல் உள்ள array-ஐ mutate செய்கிறது:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

React உங்கள் reducer function-ஐ இருமுறை call செய்வதால், todo இருமுறை சேர்க்கப்பட்டதை காண்பீர்கள்; இதன் மூலம் mistake உள்ளது என்பதை அறியலாம். இந்த example-இல், [array-ஐ mutate செய்வதற்கு பதிலாக replace செய்வதன் மூலம்](/learn/updating-arrays-in-state#adding-to-an-array) mistake-ஐ fix செய்யலாம்:

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

இப்போது இந்த reducer function pure ஆக இருப்பதால், அதை கூடுதல் முறையாக call செய்தாலும் behavior-இல் difference வராது. அதனால்தான் React அதை இருமுறை call செய்வது mistakes கண்டுபிடிக்க உதவுகிறது. **Component, initializer, மற்றும் reducer functions மட்டுமே pure ஆக இருக்க வேண்டும்.** Event handlers pure ஆக இருக்க வேண்டியதில்லை; எனவே React உங்கள் event handlers-ஐ ஒருபோதும் இருமுறை call செய்யாது.

மேலும் அறிய [components pure ஆக வைத்திருத்தல்](/learn/keeping-components-pure) வாசிக்கவும்.
