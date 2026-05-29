---
title: Reducer மற்றும் Context மூலம் scale செய்தல்
---

<Intro>

Reducers ஒரு component-ன் state update logic-ஐ consolidate செய்ய அனுமதிக்கின்றன. Context, information-ஐ மற்ற components-க்கு ஆழமாக pass செய்ய அனுமதிக்கிறது. Complex screen-ன் state manage செய்ய reducers மற்றும் context-ஐ ஒன்றாக combine செய்யலாம்.

</Intro>

<YouWillLearn>

* Reducer-ஐ context உடன் combine செய்வது எப்படி
* State மற்றும் dispatch-ஐ props வழியாக pass செய்வதைத் தவிர்ப்பது எப்படி
* Context மற்றும் state logic-ஐ தனி file-இல் வைத்திருப்பது எப்படி

</YouWillLearn>

## Reducer-ஐ context உடன் combine செய்தல் {/*combining-a-reducer-with-context*/}

[Reducers அறிமுகம்](/learn/extracting-state-logic-into-a-reducer) பகுதியில் இருந்து வரும் இந்த example-இல், state reducer மூலம் manage செய்யப்படுகிறது. Reducer function எல்லா state update logic-ஐயும் கொண்டுள்ளது; அது இந்த file-ன் கீழே declare செய்யப்பட்டுள்ளது:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'கோவிலுக்கு செல்', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/AddTask.js
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

```js src/TaskList.js
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

Reducer event handlers-ஐ short மற்றும் concise ஆக வைத்திருக்க உதவுகிறது. ஆனால் உங்கள் app வளரும்போது, இன்னொரு சிரமத்தைச் சந்திக்கலாம். **தற்போது `tasks` state மற்றும் `dispatch` function top-level `TaskApp` component-இல் மட்டுமே available.** பிற components tasks list-ஐ read செய்யவோ மாற்றவோ, current state மற்றும் அதை மாற்றும் event handlers-ஐ props ஆக explicit ஆக [pass down](/learn/passing-props-to-a-component) செய்ய வேண்டும்.

உதாரணமாக, `TaskApp` tasks list மற்றும் event handlers-ஐ `TaskList`-க்கு pass செய்கிறது:

```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

மேலும் `TaskList` event handlers-ஐ `Task`-க்கு pass செய்கிறது:

```js
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

இதுபோன்ற சிறிய example-இல் இது நன்றாக வேலை செய்கிறது; ஆனால் நடுவில் பத்து அல்லது நூறு components இருந்தால், எல்லா state மற்றும் functions-ஐ pass down செய்வது மிகவும் சிரமமாக இருக்கும்!

அதனால், props வழியாக pass செய்வதற்கான alternative ஆக, `tasks` state மற்றும் `dispatch` function இரண்டையும் [context-க்குள்](/learn/passing-data-deeply-with-context) வைக்க விரும்பலாம். **இவ்வாறு, tree-இல் `TaskApp`-க்கு கீழே உள்ள எந்த component-உம் repetitive "prop drilling" இல்லாமல் tasks-ஐ read செய்து actions dispatch செய்ய முடியும்.**

Reducer-ஐ context உடன் combine செய்வது இப்படி:

1. Context-ஐ **create** செய்யுங்கள்.
2. State மற்றும் dispatch-ஐ context-க்குள் **put** செய்யுங்கள்.
3. Tree-இல் எங்கும் context-ஐ **use** செய்யுங்கள்.

### Step 1: Context-ஐ create செய்யுங்கள் {/*step-1-create-the-context*/}

`useReducer` Hook current `tasks` மற்றும் அவற்றை update செய்ய அனுமதிக்கும் `dispatch` function-ஐ return செய்கிறது:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

அவற்றை tree-க்குள் pass down செய்ய, இரண்டு separate contexts-ஐ [create](/learn/passing-data-deeply-with-context#step-2-use-the-context) செய்வீர்கள்:

- `TasksContext` current tasks list-ஐ provide செய்கிறது.
- `TasksDispatchContext` components actions dispatch செய்ய அனுமதிக்கும் function-ஐ provide செய்கிறது.

பிற files-இலிருந்து பின்னர் import செய்ய, அவற்றை தனி file-இலிருந்து export செய்யுங்கள்:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'கோவிலுக்கு செல்', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/TasksContext.js active
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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

இங்கே, இரண்டு contexts-க்கும் default value ஆக `null` pass செய்கிறீர்கள். Actual values `TaskApp` component மூலம் provide செய்யப்படும்.

### Step 2: State மற்றும் dispatch-ஐ context-க்குள் வையுங்கள் {/*step-2-put-state-and-dispatch-into-context*/}

இப்போது உங்கள் `TaskApp` component-இல் இரண்டு contexts-ஐயும் import செய்யலாம். `useReducer()` return செய்த `tasks` மற்றும் `dispatch`-ஐ எடுத்து, கீழுள்ள முழு tree-க்கும் [provide செய்யுங்கள்](/learn/passing-data-deeply-with-context#step-3-provide-the-context):

```js {4,7-8}
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        ...
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

இப்போதைக்கு, information-ஐ props வழியாகவும் context-இலுமாக இரண்டிலும் pass செய்கிறீர்கள்:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

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
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext>
    </TasksContext>
  );
}

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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'கோவிலுக்கு செல்', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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

அடுத்த step-இல் prop passing-ஐ remove செய்வீர்கள்.

### Step 3: Tree-இல் எங்கும் context பயன்படுத்துங்கள் {/*step-3-use-context-anywhere-in-the-tree*/}

இப்போது tasks list அல்லது event handlers-ஐ tree-க்குள் கீழே pass செய்ய வேண்டியதில்லை:

```js {4-5}
<TasksContext value={tasks}>
  <TasksDispatchContext value={dispatch}>
    <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext>
</TasksContext>
```

அதற்கு பதிலாக, task list தேவைப்படும் எந்த component-உம் அதை `TasksContext`-இலிருந்து read செய்யலாம்:

```js {2}
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

Task list-ஐ update செய்ய, எந்த component-உம் context-இலிருந்து `dispatch` function-ஐ read செய்து call செய்யலாம்:

```js {3,9-13}
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>சேர்</button>
    // ...
```

**`TaskApp` component எந்த event handlers-ஐயும் கீழே pass செய்யவில்லை; `TaskList` கூட `Task` component-க்கு எந்த event handlers-ஐயும் pass செய்யவில்லை.** ஒவ்வொரு component-உம் தன்னுக்குத் தேவையான context-ஐ read செய்கிறது:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext>
    </TasksContext>
  );
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'கோவிலுக்கு செல்', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Task சேர்க்கவும்"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>சேர்</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

**State இன்னும் top-level `TaskApp` component-இல்தான் "lives"; அது `useReducer` மூலம் manage செய்யப்படுகிறது.** ஆனால் அதன் `tasks` மற்றும் `dispatch` இப்போது இந்த contexts-ஐ import செய்து பயன்படுத்துவதன் மூலம் tree-இல் கீழே உள்ள ஒவ்வொரு component-க்கும் available.

## எல்லா wiring-யையும் ஒரு file-க்குள் நகர்த்துதல் {/*moving-all-wiring-into-a-single-file*/}

இதை கட்டாயம் செய்ய வேண்டியதில்லை, ஆனால் reducer மற்றும் context இரண்டையும் ஒரே file-க்குள் நகர்த்துவதால் components-ஐ இன்னும் சுத்தமாக்கலாம். தற்போது, `TasksContext.js` இரண்டு context declarations மட்டும் கொண்டுள்ளது:

```js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

இந்த file இப்போது கொஞ்சம் நிரம்பப் போகிறது! Reducer-ஐ அதே file-க்குள் நகர்த்துவீர்கள். பிறகு அதே file-இல் புதிய `TasksProvider` component-ஐ declare செய்வீர்கள். இந்த component எல்லா pieces-ஐயும் ஒன்றாக இணைக்கும்:

1. அது state-ஐ reducer மூலம் manage செய்யும்.
2. அது கீழுள்ள components-க்கு இரண்டு contexts-ஐயும் provide செய்யும்.
3. அதற்கு JSX pass செய்ய முடிவதற்காக, அது [`children`-ஐ prop ஆக எடுக்கும்](/learn/passing-props-to-a-component#passing-jsx-as-children).

```js
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

**இது உங்கள் `TaskApp` component-இலிருந்து எல்லா complexity மற்றும் wiring-யையும் நீக்குகிறது:**

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'கோவிலுக்கு செல்', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Task சேர்க்கவும்"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>சேர்</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

Context-ஐ _use_ செய்யும் functions-ஐயும் `TasksContext.js`-இலிருந்து export செய்யலாம்:

```js
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

ஒரு component context-ஐ read செய்ய வேண்டும்போது, இந்த functions வழியாக அதைச் செய்யலாம்:

```js
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

இது behavior-ஐ எந்த வகையிலும் மாற்றாது, ஆனால் பின்னர் இந்த contexts-ஐ மேலும் split செய்யவோ அல்லது இந்த functions-ல் logic சேர்க்கவோ இது இடமளிக்கும். **இப்போது context மற்றும் reducer wiring அனைத்தும் `TasksContext.js`-இல் உள்ளது. இதனால் components clean ஆகவும் uncluttered ஆகவும் இருந்து, data எங்கிருந்து வருகிறது என்பதற்குப் பதிலாக அவை என்ன display செய்கின்றன என்பதில் கவனம் செலுத்தும்:**

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>கியோட்டோவில் விடுமுறை நாள்</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'கோவிலுக்கு செல்', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Task சேர்க்கவும்"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>சேர்</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

`TasksProvider`-ஐ tasks-ஐ எப்படி கையாள வேண்டும் என்பதை அறிந்த screen-ன் ஒரு பகுதியாகவும், `useTasks`-ஐ அவற்றை read செய்வதற்கான வழியாகவும், `useTasksDispatch`-ஐ tree-இல் கீழே உள்ள எந்த component-இலிருந்தும் அவற்றை update செய்வதற்கான வழியாகவும் நினைக்கலாம்.

<Note>

`useTasks` மற்றும் `useTasksDispatch` போன்ற functions *[Custom Hooks](/learn/reusing-logic-with-custom-hooks)* என்று அழைக்கப்படுகின்றன. உங்கள் function பெயர் `use` என்று தொடங்கினால், அது custom Hook ஆக கருதப்படும். இதனால் அதன் உள்ளே `useContext` போன்ற பிற Hooks-ஐ பயன்படுத்த முடியும்.

</Note>

உங்கள் app வளரும்போது, இதுபோன்ற பல context-reducer pairs இருக்கலாம். Tree-இல் ஆழமாக உள்ள data-வை access செய்ய வேண்டியபோது, அதிக வேலை இல்லாமல் உங்கள் app-ஐ scale செய்யவும் [state-ஐ மேலே உயர்த்தவும்](/learn/sharing-state-between-components) இது ஒரு சக்திவாய்ந்த வழி.

<Recap>

- எந்த component-உம் மேலே உள்ள state-ஐ read செய்து update செய்ய reducer-ஐ context உடன் combine செய்யலாம்.
- State மற்றும் dispatch function-ஐ கீழுள்ள components-க்கு provide செய்ய:
  1. இரண்டு contexts-ஐ create செய்யுங்கள் (state-க்கும் dispatch functions-க்கும்).
  2. Reducer-ஐ பயன்படுத்தும் component-இலிருந்து இரண்டு contexts-ஐயும் provide செய்யுங்கள்.
  3. அவற்றை read செய்ய வேண்டிய components-இலிருந்து தேவையான context-ஐ use செய்யுங்கள்.
- எல்லா wiring-யையும் ஒரே file-க்குள் நகர்த்துவதன் மூலம் components-ஐ இன்னும் declutter செய்யலாம்.
  - Context provide செய்யும் `TasksProvider` போன்ற component-ஐ export செய்யலாம்.
  - அதை read செய்ய `useTasks` மற்றும் `useTasksDispatch` போன்ற custom Hooks-ஐயும் export செய்யலாம்.
- உங்கள் app-இல் இதுபோன்ற பல context-reducer pairs இருக்கலாம்.

</Recap>
