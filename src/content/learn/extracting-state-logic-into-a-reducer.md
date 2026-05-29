---
title: State Logic-ஐ Reducer-க்குள் பிரித்தெடுத்தல்
---

<Intro>

பல event handler-களில் பரவியிருக்கும் பல state update-களை கொண்ட component-கள் சிக்கலாக மாறலாம். இத்தகைய சூழல்களில், state update logic அனைத்தையும் உங்கள் component-க்கு வெளியே உள்ள ஒரே function-இல் ஒன்றிணைக்கலாம்; அதற்குப் பெயர் _reducer._

</Intro>

<YouWillLearn>

- reducer function என்றால் என்ன
- `useState`-ஐ `useReducer` ஆக எப்படி refactor செய்வது
- reducer-ஐ எப்போது பயன்படுத்துவது
- ஒன்றை நன்றாக எப்படி எழுதுவது

</YouWillLearn>

## reducer மூலம் state logic-ஐ ஒன்றிணைக்கவும் {/*consolidate-state-logic-with-a-reducer*/}

உங்கள் component-கள் சிக்கலாக வளரும்போது, ஒரு component-ன் state எந்தெந்த வழிகளில் update ஆகிறது என்பதை ஒரு பார்வையில் புரிந்துகொள்வது கடினமாகலாம். உதாரணமாக, கீழே உள்ள `TaskApp` component state-இல் `tasks` array-ஐ வைத்திருக்கிறது, மேலும் task-களை சேர்க்க, நீக்க, திருத்த மூன்று வேறு event handler-களைப் பயன்படுத்துகிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague பயணத் திட்டம்</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Kafka Museum-ஐ பார்வையிடு', done: true},
  {id: 1, text: 'பொம்மலாட்டம் பாருங்கள்', done: false},
  {id: 2, text: 'Lennon Wall படம்', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="பணியைச் சேர்"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        சேர்
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>சேமி</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>திருத்து</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>நீக்கு</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

state-ஐ update செய்ய அதன் ஒவ்வொரு event handler-மும் `setTasks`-ஐ call செய்கிறது. இந்த component வளரும்போது, அதற்குள் சிதறிக் கிடக்கும் state logic-ன் அளவும் அதிகரிக்கும். இந்த சிக்கலைக் குறைத்து, உங்கள் logic அனைத்தையும் நேரடியாக அணுகக்கூடிய ஒரே இடத்தில் வைத்திருக்க, அந்த state logic-ஐ உங்கள் component-க்கு வெளியே உள்ள ஒரே function-க்குள் நகர்த்தலாம்; **அதற்கு "reducer" என்று பெயர்.**

Reducer-கள் state-ஐ கையாளும் வேறு வழி. `useState`-இலிருந்து `useReducer`-க்கு மூன்று படிகளில் migrate செய்யலாம்:

1. state அமைப்பதிலிருந்து action-களை dispatch செய்வதற்கு **நகரவும்**.
2. reducer function ஒன்றை **எழுதவும்**.
3. உங்கள் component-இலிருந்து reducer-ஐ **பயன்படுத்தவும்**.

### படி 1: state அமைப்பதிலிருந்து action-களை dispatch செய்வதற்கு நகரவும் {/*step-1-move-from-setting-state-to-dispatching-actions*/}

உங்கள் event handler-கள் தற்போது state அமைப்பதன் மூலம் _என்ன செய்ய வேண்டும்_ என்பதை குறிப்பிடுகின்றன:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

state அமைக்கும் logic அனைத்தையும் நீக்குங்கள். மீதமிருப்பது மூன்று event handler-கள்:

- பயனர் "சேர்" அழுத்தும்போது `handleAddTask(text)` call செய்யப்படுகிறது.
- பயனர் task-ஐ toggle செய்யும்போது அல்லது "சேமி" அழுத்தும்போது `handleChangeTask(task)` call செய்யப்படுகிறது.
- பயனர் "நீக்கு" அழுத்தும்போது `handleDeleteTask(taskId)` call செய்யப்படுகிறது.

Reducer-களுடன் state-ஐ நிர்வகிப்பது, state-ஐ நேரடியாக அமைப்பதிலிருந்து சற்று வேறுபடும். state அமைத்து React-க்கு "என்ன செய்ய வேண்டும்" என்று சொல்லுவதற்கு பதிலாக, உங்கள் event handler-களிலிருந்து "action"-களை dispatch செய்வதன் மூலம் "பயனர் இப்போது என்ன செய்தார்" என்பதை குறிப்பிடுகிறீர்கள். (state update logic வேறு இடத்தில் இருக்கும்!) அதனால் event handler வழியாக "`tasks`-ஐ அமைப்பது" அல்ல, "ஒரு task சேர்க்கப்பட்டது/மாற்றப்பட்டது/நீக்கப்பட்டது" என்ற action-ஐ dispatch செய்கிறீர்கள். இது பயனரின் நோக்கத்தை அதிகமாக விளக்குகிறது.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

நீங்கள் `dispatch`-க்கு pass செய்யும் object "action" என்று அழைக்கப்படுகிறது:

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

இது ஒரு சாதாரண JavaScript object. அதில் என்ன வைக்க வேண்டும் என்பதை நீங்கள் தீர்மானிக்கிறீர்கள்; ஆனால் பொதுவாக அது _என்ன நடந்தது_ என்பதற்கான குறைந்தபட்ச தகவலை கொண்டிருக்க வேண்டும். (`dispatch` function-ஐ பின்னர் ஒரு படியில் சேர்ப்பீர்கள்.)

<Note>

action object எந்த வடிவத்திலும் இருக்கலாம்.

மரபுப்படி, என்ன நடந்தது என்பதை விவரிக்கும் string `type` ஒன்றை கொடுத்து, கூடுதல் தகவலை பிற field-களில் pass செய்வது பொதுவானது. `type` ஒரு component-க்கு குறிப்பிட்டதாக இருக்கும்; எனவே இந்த உதாரணத்தில் `'added'` அல்லது `'added_task'` இரண்டும் சரி. என்ன நடந்தது என்பதைச் சொல்லும் பெயரைத் தேர்ந்தெடுங்கள்!

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### படி 2: reducer function ஒன்றை எழுதுங்கள் {/*step-2-write-a-reducer-function*/}

reducer function என்பது உங்கள் state logic-ஐ வைக்கும் இடம். இது இரண்டு argument-களை எடுக்கிறது: தற்போதைய state மற்றும் action object. பின்னர் அடுத்த state-ஐ return செய்கிறது:

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

reducer-இலிருந்து நீங்கள் return செய்வதையே React state ஆக அமைக்கும்.

இந்த உதாரணத்தில் உங்கள் event handler-களிலிருந்து state அமைக்கும் logic-ஐ reducer function-க்கு நகர்த்த, நீங்கள்:

1. தற்போதைய state-ஐ (`tasks`) முதல் argument ஆக அறிவிக்க வேண்டும்.
2. `action` object-ஐ இரண்டாவது argument ஆக அறிவிக்க வேண்டும்.
3. reducer-இலிருந்து _அடுத்த_ state-ஐ return செய்ய வேண்டும் (React இதையே state ஆக அமைக்கும்).

state அமைக்கும் logic முழுவதும் reducer function-க்கு migrate செய்யப்பட்ட வடிவம் இதோ:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('தெரியாத action: ' + action.type);
  }
}
```

reducer function state-ஐ (`tasks`) argument ஆக எடுப்பதால், அதை **உங்கள் component-க்கு வெளியே அறிவிக்கலாம்.** இது indentation அளவைக் குறைத்து, உங்கள் code-ஐ வாசிக்க உதவும்.

<Note>

மேலுள்ள code if/else statement-களைப் பயன்படுத்துகிறது, ஆனால் reducer-களுக்குள் [switch statement-களை](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) பயன்படுத்துவது மரபு. முடிவு ஒன்றுதான், ஆனால் switch statement-களை ஒரு பார்வையில் வாசிப்பது நேரடியாக இருக்கலாம்.

இந்த documentation-ன் மீதமுள்ள பகுதியில் அவற்றை இவ்வாறு பயன்படுத்துவோம்:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

வேறு `case`-களுக்குள் அறிவிக்கப்பட்ட variable-கள் ஒன்றுடன் ஒன்று மோதாமல் இருக்க, ஒவ்வொரு `case` block-ஐயும் `{` மற்றும் `}` curly brace-களுக்குள் wrap செய்ய பரிந்துரைக்கிறோம். மேலும், ஒரு `case` பொதுவாக `return`-இல் முடிவடைய வேண்டும். `return` செய்ய மறந்தால், code அடுத்த `case`-க்கு "fall through" ஆகும்; இது பிழைகளுக்குக் காரணமாகலாம்!

switch statement-களில் இன்னும் வசதியாக இல்லையெனில், if/else பயன்படுத்துவது முற்றிலும் சரி.

</Note>

<DeepDive>

#### reducer-கள் ஏன் இவ்வாறு அழைக்கப்படுகின்றன? {/*why-are-reducers-called-this-way*/}

reducer-கள் உங்கள் component-க்குள் இருக்கும் code அளவை "reduce" செய்ய முடிந்தாலும், உண்மையில் அவை array-களில் செய்யக்கூடிய [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) operation-ன் பெயரிலிருந்து வந்தவை.

`reduce()` operation ஒரு array-ஐ எடுத்து, பல மதிப்புகளிலிருந்து ஒரே மதிப்பை "accumulate" செய்ய அனுமதிக்கிறது:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

நீங்கள் `reduce`-க்கு pass செய்யும் function "reducer" என்று அழைக்கப்படுகிறது. அது _இதுவரை உள்ள result_ மற்றும் _தற்போதைய item_-ஐ எடுத்து, _அடுத்த result_-ஐ return செய்கிறது. React reducer-களும் இதே எண்ணத்தின் உதாரணம்: அவை _இதுவரை உள்ள state_ மற்றும் _action_-ஐ எடுத்து, _அடுத்த state_-ஐ return செய்கின்றன. இவ்வாறு, காலப்போக்கில் action-களை state ஆகச் சேர்த்துக்கொள்கின்றன.

உங்கள் reducer function-ஐ pass செய்து, `initialState` மற்றும் `actions` array உடன் `reduce()` method-ஐப் பயன்படுத்தி final state-ஐ கணக்கிடவும் முடியும்:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Kafka Museum-ஐ பார்வையிடு'},
  {type: 'added', id: 2, text: 'பொம்மலாட்டம் பாருங்கள்'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall படம்'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

இதை நீங்கள் நீங்களே செய்ய வேண்டியிருப்பதில்லை, ஆனால் React செய்வதற்கு இது ஒத்ததாகும்!

</DeepDive>

### படி 3: உங்கள் component-இலிருந்து reducer-ஐப் பயன்படுத்துங்கள் {/*step-3-use-the-reducer-from-your-component*/}

இறுதியாக, `tasksReducer`-ஐ உங்கள் component-க்கு hook up செய்ய வேண்டும். React-இலிருந்து `useReducer` Hook-ஐ import செய்யுங்கள்:

```js
import { useReducer } from 'react';
```

பிறகு `useState`-ஐ மாற்றலாம்:

```js
const [tasks, setTasks] = useState(initialTasks);
```

இவ்வாறு `useReducer`-ஆல்:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` Hook `useState`-க்கு ஒத்தது; அதற்கு initial state-ஐ pass செய்ய வேண்டும், அது stateful value-ஐயும் state அமைக்கும் வழியையும் (இந்தச் சூழலில் dispatch function) return செய்கிறது. ஆனால் இது சற்று வேறுபடும்.

`useReducer` Hook இரண்டு argument-களை எடுக்கிறது:

1. reducer function
2. initial state

மேலும் இது return செய்கிறது:

1. stateful value
2. dispatch function (பயனர் action-களை reducer-க்கு "dispatch" செய்ய)

இப்போது இது முழுமையாக இணைக்கப்பட்டுள்ளது! இங்கே, reducer component file-ன் கீழே அறிவிக்கப்பட்டுள்ளது:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague பயணத் திட்டம்</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Kafka Museum-ஐ பார்வையிடு', done: true},
  {id: 1, text: 'பொம்மலாட்டம் பாருங்கள்', done: false},
  {id: 2, text: 'Lennon Wall படம்', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="பணியைச் சேர்"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        சேர்
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>சேமி</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>திருத்து</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>நீக்கு</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

விரும்பினால், reducer-ஐ வேறு file-க்குக் கூட நகர்த்தலாம்:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague பயணத் திட்டம்</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Kafka Museum-ஐ பார்வையிடு', done: true},
  {id: 1, text: 'பொம்மலாட்டம் பாருங்கள்', done: false},
  {id: 2, text: 'Lennon Wall படம்', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="பணியைச் சேர்"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        சேர்
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>சேமி</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>திருத்து</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>நீக்கு</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

இவ்வாறு concern-களைப் பிரித்தால் component logic-ஐ வாசிப்பது நேரடியாக இருக்கும். இப்போது event handler-கள் action-களை dispatch செய்வதன் மூலம் _என்ன நடந்தது_ என்பதை மட்டுமே குறிப்பிடுகின்றன; reducer function அவற்றுக்கு பதிலாக _state எப்படி update ஆகிறது_ என்பதை தீர்மானிக்கிறது.

## `useState` மற்றும் `useReducer`-ஐ ஒப்பிடுதல் {/*comparing-usestate-and-usereducer*/}

Reducer-களுக்கும் குறைகள் இல்லாமல் இல்லை! அவற்றை ஒப்பிட சில வழிகள் இதோ:

- **Code அளவு:** பொதுவாக `useState`-இல் தொடக்கத்தில் குறைவான code எழுத வேண்டும். `useReducer`-இல் reducer function-ஐயும் action-களை dispatch செய்வதையும் எழுத வேண்டும். ஆனால் பல event handler-கள் state-ஐ ஒரேபோன்ற முறையில் மாற்றினால், code-ஐ குறைக்க `useReducer` உதவும்.
- **வாசிப்புத் தெளிவு:** state update-கள் நேரடியானவை என்றால் `useState`-ஐ வாசிப்பது சாத்தியம். அவை சிக்கலாகும்போது, உங்கள் component code பெரிதாகி scan செய்வது கடினமாகலாம். இந்த நிலையில், update logic-ன் _எப்படி_ என்பதையும் event handler-களின் _என்ன நடந்தது_ என்பதையும் சுத்தமாகப் பிரிக்க `useReducer` உதவும்.
- **Debugging:** `useState` உடன் bug இருந்தால், state _எங்கே_ தவறாக அமைக்கப்பட்டது, _ஏன்_ என்று சொல்ல கடினமாகலாம். `useReducer` உடன், ஒவ்வொரு state update-யையும் அது _ஏன்_ நடந்தது (எந்த `action` காரணமாக) என்பதையும் பார்க்க reducer-க்குள் console log சேர்க்கலாம். ஒவ்வொரு `action`-மும் சரியாக இருந்தால், பிழை reducer logic-இல்தான் உள்ளது என்று தெரியும். ஆனால் `useState`-ஐ விட அதிக code வழியாக step செய்ய வேண்டும்.
- **Testing:** reducer என்பது உங்கள் component-ஐ சாராத pure function. இதனால் அதை export செய்து தனியாக test செய்யலாம். பொதுவாக component-களை இன்னும் realistic சூழலில் test செய்வது சிறந்ததாயினும், சிக்கலான state update logic-க்கு, குறிப்பிட்ட initial state மற்றும் action-க்கு உங்கள் reducer குறிப்பிட்ட state-ஐ return செய்கிறது என்று assert செய்வது பயனுள்ளதாக இருக்கும்.
- **தனிப்பட்ட விருப்பம்:** சிலருக்கு reducer-கள் பிடிக்கும்; சிலருக்கு பிடிக்காது. அது சரி. இது விருப்பம் சார்ந்தது. `useState` மற்றும் `useReducer` இடையே எப்போதும் முன்னும் பின்னும் convert செய்யலாம்: அவை equivalent!

ஒரு component-இல் தவறான state update-கள் காரணமாக அடிக்கடி bug-களைச் சந்தித்து, அதன் code-க்கு அதிக structure சேர்க்க விரும்பினால் reducer பயன்படுத்த பரிந்துரைக்கிறோம். எல்லாவற்றிற்கும் reducer பயன்படுத்த வேண்டியதில்லை: mix and match செய்யலாம்! ஒரே component-இல் `useState` மற்றும் `useReducer` இரண்டையும் பயன்படுத்தலாம்.

## reducer-களை நன்றாக எழுதுதல் {/*writing-reducers-well*/}

reducer-களை எழுதும்போது இந்த இரண்டு குறிப்புகளை மனதில் வைத்திருங்கள்:

- **Reducer-கள் pure ஆக இருக்க வேண்டும்.** [state updater function-களைப்](/learn/queueing-a-series-of-state-updates) போலவே, reducer-களும் rendering நடக்கும் போது இயங்கும்! (Action-கள் அடுத்த render வரை queue செய்யப்படும்.) இதன் பொருள் reducer-கள் [pure ஆக இருக்க வேண்டும்](/learn/keeping-components-pure): ஒரே input-கள் எப்போதும் ஒரே output-ஐத் தர வேண்டும். அவை request-களை அனுப்பக்கூடாது, timeout-களை schedule செய்யக்கூடாது, அல்லது side effect-களை (component-க்கு வெளியே உள்ள விஷயங்களை பாதிக்கும் operation-கள்) செய்யக்கூடாது. அவை [object-களையும்](/learn/updating-objects-in-state) [array-களையும்](/learn/updating-arrays-in-state) mutation இல்லாமல் update செய்ய வேண்டும்.
- **ஒவ்வொரு action-மும் ஒரே ஒரு பயனர் interaction-ஐ விவரிக்க வேண்டும்; அது data-வில் பல மாற்றங்களுக்கு வழிவகுத்தாலும்.** உதாரணமாக, reducer நிர்வகிக்கும் ஐந்து field-கள் உள்ள form-இல் பயனர் "மீட்டமை" அழுத்தினால், ஐந்து தனித்தனி `set_field` action-களை dispatch செய்வதைவிட ஒரே `reset_form` action-ஐ dispatch செய்வது பொருத்தமானது. reducer-இல் ஒவ்வொரு action-ஐயும் log செய்தால், எந்த interaction அல்லது response எந்த வரிசையில் நடந்தது என்பதை மீண்டும் கட்டமைக்க அந்த log போதுமான தெளிவாக இருக்க வேண்டும். இது debugging-க்கு உதவும்!

## Immer மூலம் சுருக்கமான reducer-களை எழுதுதல் {/*writing-concise-reducers-with-immer*/}

சாதாரண state-இல் [object-களையும்](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) [array-களையும்](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) update செய்வதைப் போலவே, reducer-களை சுருக்கமாக்க Immer library-யைப் பயன்படுத்தலாம். இங்கே, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) `push` அல்லது `arr[i] =` assignment மூலம் state-ஐ mutate செய்ய அனுமதிக்கிறது:

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
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague பயணத் திட்டம்</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Kafka Museum-ஐ பார்வையிடு', done: true},
  {id: 1, text: 'பொம்மலாட்டம் பாருங்கள்', done: false},
  {id: 2, text: 'Lennon Wall படம்', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="பணியைச் சேர்"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        சேர்
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>சேமி</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>திருத்து</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>நீக்கு</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
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

Reducer-கள் pure ஆக இருக்க வேண்டும், எனவே அவை state-ஐ mutate செய்யக்கூடாது. ஆனால் Immer உங்களுக்கு mutate செய்ய பாதுகாப்பான சிறப்பு `draft` object-ஐ வழங்குகிறது. உள்ளே, `draft`-இல் நீங்கள் செய்த மாற்றங்களுடன் உங்கள் state-ன் copy-ஐ Immer உருவாக்கும். அதனால் `useImmerReducer` நிர்வகிக்கும் reducer-கள் தங்கள் முதல் argument-ஐ mutate செய்ய முடியும், state-ஐ return செய்ய வேண்டியதில்லை.

<Recap>

- `useState`-இலிருந்து `useReducer`-க்கு மாற்ற:
  1. event handler-களிலிருந்து action-களை dispatch செய்யுங்கள்.
  2. கொடுக்கப்பட்ட state மற்றும் action-க்கு அடுத்த state-ஐ return செய்யும் reducer function-ஐ எழுதுங்கள்.
  3. `useState`-ஐ `useReducer`-ஆல் மாற்றுங்கள்.
- Reducer-கள் கொஞ்சம் அதிக code எழுதச் செய்கின்றன, ஆனால் debugging மற்றும் testing-க்கு உதவுகின்றன.
- Reducer-கள் pure ஆக இருக்க வேண்டும்.
- ஒவ்வொரு action-மும் ஒரே ஒரு பயனர் interaction-ஐ விவரிக்க வேண்டும்.
- mutating style-இல் reducer-களை எழுத விரும்பினால் Immer-ஐப் பயன்படுத்துங்கள்.

</Recap>

<Challenges>

#### event handler-களிலிருந்து action-களை dispatch செய்யுங்கள் {/*dispatch-actions-from-event-handlers*/}

தற்போது, `ContactList.js` மற்றும் `Chat.js`-இல் உள்ள event handler-களில் `// TODO` comment-கள் உள்ளன. அதனால் input-இல் type செய்வது வேலை செய்யவில்லை; button-களை click செய்தாலும் தேர்ந்தெடுக்கப்பட்ட recipient மாறவில்லை.

இந்த இரண்டு `// TODO`-களையும் தொடர்புடைய action-களை `dispatch` செய்யும் code-ஆல் மாற்றுங்கள். action-களின் எதிர்பார்க்கப்படும் shape மற்றும் type-ஐப் பார்க்க, `messengerReducer.js`-இல் உள்ள reducer-ஐச் சரிபாருங்கள். reducer ஏற்கனவே எழுதப்பட்டுள்ளது, எனவே அதை மாற்றத் தேவையில்லை. `ContactList.js` மற்றும் `Chat.js`-இல் action-களை dispatch செய்வதுதான் தேவையானது.

<Hint>

`dispatch` function prop ஆக pass செய்யப்பட்டிருப்பதால், இந்த இரண்டு component-களிலும் ஏற்கனவே கிடைக்கிறது. எனவே தொடர்புடைய action object உடன் `dispatch`-ஐ call செய்ய வேண்டும்.

action object shape-ஐச் சரிபார்க்க, reducer-ஐ பார்த்து அது எந்த `action` field-களை எதிர்பார்க்கிறது என்பதைப் பார்க்கலாம். உதாரணமாக, reducer-இல் உள்ள `changed_selection` case இதுபோல் தெரிகிறது:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

இதன் பொருள், உங்கள் action object-இல் `type: 'changed_selection'` இருக்க வேண்டும். `action.contactId` பயன்படுத்தப்படுவதையும் நீங்கள் பார்க்கிறீர்கள், எனவே உங்கள் action-இல் `contactId` property-ஐ சேர்க்க வேண்டும்.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'வணக்கம்',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

reducer code-இலிருந்து, action-கள் இதுபோல் இருக்க வேண்டும் என்று ஊகிக்கலாம்:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'வணக்கம்!',
});
```

தொடர்புடைய message-களை dispatch செய்ய update செய்யப்பட்ட உதாரணம் இதோ:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'வணக்கம்',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### message அனுப்பும்போது input-ஐ clear செய்யுங்கள் {/*clear-the-input-on-sending-a-message*/}

தற்போது "அனுப்பு" அழுத்தினால் எதுவும் நடக்காது. "அனுப்பு" button-க்கு இதை செய்யும் event handler ஒன்றைச் சேருங்கள்:

1. recipient-ன் email மற்றும் message உடன் `alert` காட்ட வேண்டும்.
2. message input-ஐ clear செய்ய வேண்டும்.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'வணக்கம்',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

"அனுப்பு" button event handler-இல் இதைச் செய்ய இரண்டு வழிகள் உள்ளன. ஒரு அணுகுமுறை alert காட்டி, பிறகு காலியான `message` உடன் `edited_message` action-ஐ dispatch செய்வது:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'வணக்கம்',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`"${message}" என்பதை ${contact.email}-க்கு அனுப்புகிறது`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        {contact.email}-க்கு அனுப்பு
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

இது வேலை செய்து, நீங்கள் "அனுப்பு" அழுத்தும்போது input-ஐ clear செய்கிறது.

ஆனால் _பயனரின் பார்வையில்_, message அனுப்புவது field-ஐ edit செய்வதிலிருந்து வேறு action. அதை பிரதிபலிக்க, அதற்கு பதிலாக `sent_message` என்ற _புதிய_ action ஒன்றை உருவாக்கி, அதை reducer-இல் தனியாக handle செய்யலாம்:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'வணக்கம்',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`"${message}" என்பதை ${contact.email}-க்கு அனுப்புகிறது`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}-க்கு அனுப்பு
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

இதன் resulting behavior ஒன்றுதான். ஆனால் action type-கள் சிறந்த நிலையில் "state எப்படி மாற வேண்டும்" என்பதற்குப் பதிலாக "பயனர் என்ன செய்தார்" என்பதை விவரிக்க வேண்டும் என்பதை நினைவில் கொள்ளுங்கள். இது பின்னர் மேலும் feature-களைச் சேர்ப்பதை உதவும்.

இரண்டு தீர்வுகளில் எதைப் பயன்படுத்தினாலும், `alert`-ஐ reducer-க்குள் வைக்க **கூடாது** என்பது முக்கியம். reducer pure function ஆக இருக்க வேண்டும்: அது அடுத்த state-ஐ மட்டும் கணக்கிட வேண்டும். பயனருக்கு message காட்டுவது உட்பட அது எதையும் "செய்ய" கூடாது. அது event handler-இல் நடக்க வேண்டும். (இத்தகைய பிழைகளைப் பிடிக்க உதவ, Strict Mode-இல் React உங்கள் reducer-களை பல முறை call செய்யும். அதனால் reducer-இல் alert வைத்தால், அது இரண்டு முறை fire ஆகும்.)

</Solution>

#### tab-களுக்கிடையே மாறும்போது input மதிப்புகளை மீட்டெடுக்கவும் {/*restore-input-values-when-switching-between-tabs*/}

இந்த உதாரணத்தில், வேறு recipient-களுக்கிடையே மாறும்போது text input எப்போதும் clear ஆகிறது:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // input-ஐ clear செய்கிறது
  };
```

பல recipient-களுக்கிடையே ஒரே message draft-ஐ பகிர விரும்பாததால் இது நடக்கிறது. ஆனால் ஒவ்வொரு contact-க்கும் தனித்தனி draft-ஐ உங்கள் app "நினைவில்" வைத்திருந்து, contact-களை மாற்றும்போது அவற்றை மீட்டெடுத்தால் இன்னும் நல்லது.

உங்கள் பணி, _ஒவ்வொரு contact-க்கும்_ தனித்தனி message draft நினைவில் இருக்கும்படி state அமைப்பை மாற்றுவது. reducer, initial state, மற்றும் component-களில் சில மாற்றங்களைச் செய்ய வேண்டும்.

<Hint>

உங்கள் state-ஐ இதுபோல் அமைக்கலாம்:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'வணக்கம், Taylor', // contactId = 0 க்கான draft
    1: 'வணக்கம், Alice', // contactId = 1 க்கான draft
  },
};
```

`messages` object-ஐ update செய்ய `[key]: value` [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) syntax உதவும்:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'வணக்கம்',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`"${message}" என்பதை ${contact.email}-க்கு அனுப்புகிறது`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}-க்கு அனுப்பு
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

ஒவ்வொரு contact-க்கும் தனித்தனி message draft-ஐச் சேமித்து update செய்ய reducer-ஐ update செய்ய வேண்டும்:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

தற்போது தேர்ந்தெடுக்கப்பட்ட contact-க்கான message-ஐப் படிக்க `Messenger` component-யையும் update செய்ய வேண்டும்:

```js
const message = state.messages[state.selectedId];
```

முழுமையான தீர்வு இதோ:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'வணக்கம், Taylor',
    1: 'வணக்கம், Alice',
    2: 'வணக்கம், Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`"${message}" என்பதை ${contact.email}-க்கு அனுப்புகிறது`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}-க்கு அனுப்பு
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

குறிப்பாக, இந்த வேறு behavior-ஐ implement செய்ய எந்த event handler-யையும் மாற்ற வேண்டியிருக்கவில்லை. reducer இல்லாமல், state-ஐ update செய்யும் ஒவ்வொரு event handler-யையும் மாற்ற வேண்டியிருக்கும்.

</Solution>

#### `useReducer`-ஐ ஆரம்பத்திலிருந்து implement செய்யுங்கள் {/*implement-usereducer-from-scratch*/}

முன்னைய உதாரணங்களில், React-இலிருந்து `useReducer` Hook-ஐ import செய்தீர்கள். இந்த முறை, _`useReducer` Hook-ஐயே_ நீங்கள் implement செய்வீர்கள்! தொடங்குவதற்கான stub இதோ. இது 10 வரிகளுக்கு மேல் code எடுக்கக் கூடாது.

உங்கள் மாற்றங்களை test செய்ய, input-இல் type செய்து பாருங்கள் அல்லது ஒரு contact-ஐத் தேர்ந்தெடுங்கள்.

<Hint>

implementation-ன் மேலும் விரிவான sketch இதோ:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

reducer function இரண்டு argument-களை எடுக்கும் என்பதை நினைவுபடுத்திக் கொள்ளுங்கள்: தற்போதைய state மற்றும் action object; அது அடுத்த state-ஐ return செய்கிறது. உங்கள் `dispatch` implementation அதனுடன் என்ன செய்ய வேண்டும்?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'வணக்கம், Taylor',
    1: 'வணக்கம், Alice',
    2: 'வணக்கம், Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`"${message}" என்பதை ${contact.email}-க்கு அனுப்புகிறது`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}-க்கு அனுப்பு
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

ஒரு action-ஐ dispatch செய்வது, தற்போதைய state மற்றும் action உடன் reducer-ஐ call செய்து, அதன் result-ஐ அடுத்த state ஆகச் சேமிக்கிறது. code-இல் இது இப்படித் தெரிகிறது:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'வணக்கம், Taylor',
    1: 'வணக்கம், Alice',
    2: 'வணக்கம், Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('தெரியாத action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + '-க்கு chat செய்யுங்கள்'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`"${message}" என்பதை ${contact.email}-க்கு அனுப்புகிறது`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}-க்கு அனுப்பு
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

பெரும்பாலான சூழல்களில் இது முக்கியமில்லை என்றாலும், சற்றே அதிக துல்லியமான implementation இதுபோல் இருக்கும்:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

ஏனெனில் dispatch செய்யப்பட்ட action-கள் அடுத்த render வரை queue செய்யப்படும்; இது [updater function-களைப்](/learn/queueing-a-series-of-state-updates) போன்றது.

</Solution>

</Challenges>
