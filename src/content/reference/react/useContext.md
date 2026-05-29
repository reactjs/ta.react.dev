---
title: useContext
---

<Intro>

`useContext` என்பது உங்கள் component-இலிருந்து [context](/learn/passing-data-deeply-with-context)-ஐ read செய்து subscribe செய்ய உதவும் React Hook ஆகும்.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## மேற்கோள் {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

உங்கள் component-ன் top level-இல் `useContext`-ஐ call செய்து [context](/learn/passing-data-deeply-with-context)-ஐ read செய்து subscribe செய்யுங்கள்.

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `SomeContext`: நீங்கள் முன்பு [`createContext`](/reference/react/createContext) மூலம் create செய்த context. Context தானாக information-ஐ வைத்திருக்காது; components-இலிருந்து provide செய்யவோ read செய்யவோ முடியும் information வகையை மட்டும் அது குறிக்கிறது.

#### திரும்பும் மதிப்பு {/*returns*/}

`useContext` call செய்கிற component-க்கு context value-ஐ return செய்கிறது. Tree-இல் call செய்கிற component-க்கு மேல் இருக்கும் closest `SomeContext`-க்கு pass செய்யப்பட்ட `value` இதை தீர்மானிக்கிறது. அப்படிப்பட்ட provider எதுவும் இல்லையெனில், அந்த context-க்காக [`createContext`](/reference/react/createContext)-க்கு நீங்கள் pass செய்த `defaultValue` return செய்யப்படும். Return செய்யப்படும் value எப்போதும் up-to-date ஆக இருக்கும். ஏதேனும் context மாறினால், அதை read செய்யும் components-ஐ React automatic ஆக re-render செய்கிறது.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* ஒரு component-இல் உள்ள `useContext()` call, *அதே* component return செய்யும் providers-ஆல் பாதிக்கப்படாது. பொருந்தும் `<Context>`, `useContext()` call செய்யும் component-க்கு **மேலே இருக்க வேண்டும்**.
* வேறுபட்ட `value` பெறும் provider-இலிருந்து தொடங்கி, குறிப்பிட்ட context-ஐ use செய்யும் எல்லா children-ஐயும் React **automatically re-render** செய்கிறது. முந்தைய மற்றும் அடுத்த values [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் ஒப்பிடப்படுகின்றன. [`memo`](/reference/react/memo) மூலம் re-renders-ஐ skip செய்தாலும், children புதிய context values-ஐ பெறுவதை அது தடுக்காது.
* உங்கள் build system output-இல் duplicate modules-ஐ உருவாக்கினால் (symlinks காரணமாக இது நடக்கலாம்), context உடையக்கூடும். Context வழியாக ஏதாவது pass செய்வது, context provide செய்ய நீங்கள் use செய்யும் `SomeContext` மற்றும் அதை read செய்ய நீங்கள் use செய்யும் `SomeContext` ஆகியவை `===` comparison-ல் தீர்மானிக்கப்படும் படி ***முழுமையாக* அதே object** ஆக இருந்தால் மட்டுமே வேலை செய்யும்.

---

## பயன்பாடு {/*usage*/}


### Tree-க்குள் ஆழமாக data pass செய்தல் {/*passing-data-deeply-into-the-tree*/}

உங்கள் component-ன் top level-இல் `useContext`-ஐ call செய்து [context](/learn/passing-data-deeply-with-context)-ஐ read செய்து subscribe செய்யுங்கள்.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

நீங்கள் pass செய்த <CodeStep step={1}>context</CodeStep>-க்கான <CodeStep step={2}>context value</CodeStep>-ஐ `useContext` return செய்கிறது. Context value-ஐ தீர்மானிக்க, React component tree-ஐ தேடி, அந்த குறிப்பிட்ட context-க்கான **மேலே உள்ள closest context provider**-ஐ கண்டுபிடிக்கிறது.

ஒரு `Button`-க்கு context pass செய்ய, அதையோ அதன் parent components-இல் ஒன்றையோ பொருந்தும் context provider-க்குள் wrap செய்யுங்கள்:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Provider மற்றும் `Button` இடையில் எத்தனை component layers இருந்தாலும் பரவாயில்லை. `Form`-க்கு உள்ளே *எங்கிருந்தாலும்* ஒரு `Button` `useContext(ThemeContext)` call செய்தால், அது value ஆக `"dark"`-ஐ பெறும்.

<Pitfall>

`useContext()` எப்போதும் அதை call செய்கிற component-க்கு *மேலே* உள்ள closest provider-ஐ தேடும். அது மேலே நோக்கி தேடும்; நீங்கள் `useContext()` call செய்யும் அதே component-இல் உள்ள providers-ஐ **கருதாது**.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="வரவேற்பு">
      <Button>பதிவு செய்</Button>
      <Button>உள்நுழை</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Context வழியாக pass செய்யப்பட்ட data-வை update செய்தல் {/*updating-data-passed-via-context*/}

பல நேரங்களில், context காலப்போக்கில் மாற வேண்டும் என்று நீங்கள் விரும்புவீர்கள். Context-ஐ update செய்ய, அதை [state](/reference/react/useState)-உடன் combine செய்யுங்கள். Parent component-இல் state variable-ஐ declare செய்து, current state-ஐ <CodeStep step={2}>context value</CodeStep> ஆக provider-க்கு கீழே pass செய்யுங்கள்.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Light theme-க்கு மாற்று
      </Button>
    </ThemeContext>
  );
}
```

இப்போது provider-க்கு உள்ளே உள்ள எந்த `Button`-உம் current `theme` value-ஐ பெறும். Provider-க்கு pass செய்யும் `theme` value-ஐ update செய்ய `setTheme` call செய்தால், எல்லா `Button` components-உம் புதிய `'light'` value உடன் re-render ஆகும்.

<Recipes titleText="Context-ஐ update செய்வதற்கான examples" titleId="examples-basic">

#### Context வழியாக ஒரு value-ஐ update செய்தல் {/*updating-a-value-via-context*/}

இந்த example-இல், `MyApp` component ஒரு state variable-ஐ வைத்திருக்கிறது; பின்னர் அது `ThemeContext` provider-க்கு pass செய்யப்படுகிறது. "Dark mode" checkbox-ஐ check செய்தால் state update ஆகும். Provide செய்யப்பட்ட value மாறும்போது, அந்த context-ஐ use செய்யும் எல்லா components-உம் re-render ஆகும்.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Dark mode பயன்படுத்து
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="வரவேற்பு">
      <Button>பதிவு செய்</Button>
      <Button>உள்நுழை</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

`value="dark"` `"dark"` string-ஐ pass செய்கிறது, ஆனால் `value={theme}` [JSX curly braces](/learn/javascript-in-jsx-with-curly-braces) மூலம் JavaScript `theme` variable-ன் value-ஐ pass செய்கிறது என்பதை கவனிக்கவும். Curly braces, strings அல்லாத context values-ஐயும் pass செய்ய அனுமதிக்கின்றன.

<Solution />

#### Context வழியாக object-ஐ update செய்தல் {/*updating-an-object-via-context*/}

இந்த example-இல், object வைத்திருக்கும் `currentUser` state variable உள்ளது. `{ currentUser, setCurrentUser }`-ஐ ஒரு single object ஆக combine செய்து, `value={}`-க்குள் context வழியாக கீழே pass செய்கிறீர்கள். இதனால் கீழுள்ள `LoginButton` போன்ற எந்த component-உம் `currentUser` மற்றும் `setCurrentUser` இரண்டையும் read செய்து, தேவைப்படும் போது `setCurrentUser` call செய்ய முடியும்.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="வரவேற்பு">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>நீங்கள் {currentUser.name} ஆக உள்நுழைந்துள்ளீர்கள்.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Advika ஆக உள்நுழை</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### பல contexts {/*multiple-contexts*/}

இந்த example-இல், இரண்டு independent contexts உள்ளன. `ThemeContext` current theme-ஐ provide செய்கிறது; அது ஒரு string. அதே நேரத்தில் `CurrentUserContext` current user-ஐ குறிக்கும் object-ஐ வைத்திருக்கிறது.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Dark mode பயன்படுத்து
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="வரவேற்பு">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>நீங்கள் {currentUser.name} ஆக உள்நுழைந்துள்ளீர்கள்.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        முதல் பெயர்{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        கடைசி பெயர்{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        உள்நுழை
      </Button>
      {!canLogin && <i>இரண்டு புலங்களையும் நிரப்பவும்.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Providers-ஐ ஒரு component-ஆக extract செய்தல் {/*extracting-providers-to-a-component*/}

உங்கள் app வளரும்போது, app-ன் root-க்கு அருகில் contexts-ன் ஒரு "pyramid" இருப்பது இயல்பானது. அதில் தவறு எதுவும் இல்லை. ஆனால் nesting அழகாக இல்லை என்று நீங்கள் நினைத்தால், providers-ஐ ஒரு single component-ஆக extract செய்யலாம். இந்த example-இல், `MyProviders` "plumbing"-ஐ மறைத்து, அதற்கு pass செய்யப்பட்ட children-ஐ தேவையான providers-க்குள் render செய்கிறது. `theme` மற்றும் `setTheme` state `MyApp`-க்கே தேவைப்படுவதால், state-ன் அந்த பகுதியை `MyApp` இன்னும் owns செய்கிறது என்பதை கவனிக்கவும்.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Dark mode பயன்படுத்து
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="வரவேற்பு">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>நீங்கள் {currentUser.name} ஆக உள்நுழைந்துள்ளீர்கள்.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        முதல் பெயர்{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        கடைசி பெயர்{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        உள்நுழை
      </Button>
      {!canLogin && <i>இரண்டு புலங்களையும் நிரப்பவும்.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Context மற்றும் reducer உடன் scale செய்தல் {/*scaling-up-with-context-and-a-reducer*/}

பெரிய apps-இல், சில state-க்கு தொடர்பான logic-ஐ components-இலிருந்து வெளியே extract செய்ய context-ஐ [reducer](/reference/react/useReducer)-உடன் combine செய்வது பொதுவானது. இந்த example-இல், reducer மற்றும் இரண்டு separate contexts கொண்ட `TasksContext.js` file-இல் எல்லா "wiring"-உம் மறைக்கப்பட்டுள்ளது.

இந்த example-க்கான [முழு walkthrough](/learn/scaling-up-with-reducer-and-context)-ஐ படிக்கவும்.

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
import { useState, useContext } from 'react';
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

```js src/TaskList.js
import { useState, useContext } from 'react';
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

<Solution />

</Recipes>

---

### Fallback default value-ஐ குறிப்பிடுதல் {/*specifying-a-fallback-default-value*/}

Parent tree-இல் அந்த குறிப்பிட்ட <CodeStep step={1}>context</CodeStep>-க்கான providers எதையும் React கண்டுபிடிக்க முடியாவிட்டால், `useContext()` return செய்யும் context value, நீங்கள் [அந்த context-ஐ create செய்தபோது](/reference/react/createContext) குறிப்பிட்ட <CodeStep step={3}>default value</CodeStep>-க்கு சமமாக இருக்கும்:

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Default value **ஒருபோதும் மாறாது**. Context-ஐ update செய்ய வேண்டும் என்றால், [மேலே விவரித்தபடி](#updating-data-passed-via-context) அதை state உடன் use செய்யுங்கள்.

பல நேரங்களில், `null`-க்கு பதிலாக default ஆக use செய்ய இன்னும் meaningful ஆன value இருக்கலாம், உதாரணமாக:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

இவ்வாறு செய்தால், பொருந்தும் provider இல்லாமல் தவறுதலாக ஏதேனும் component-ஐ render செய்தாலும் அது உடையாது. Tests-இல் பல providers setup செய்யாமல் test environment-இல் உங்கள் components நன்றாக வேலை செய்யவும் இது உதவும்.

கீழுள்ள example-இல், "Theme மாற்று" button எப்போதும் light ஆக இருக்கும்; ஏனெனில் அது **எந்த theme context provider-க்கும் வெளியே** உள்ளது, மேலும் default context theme value `'light'`. Default theme-ஐ `'dark'` ஆக edit செய்து முயற்சிக்கவும்.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Theme மாற்று
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="வரவேற்பு">
      <Button>பதிவு செய்</Button>
      <Button>உள்நுழை</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Tree-இன் ஒரு பகுதிக்காக context-ஐ override செய்தல் {/*overriding-context-for-a-part-of-the-tree*/}

Tree-இன் ஒரு பகுதியை வேறு value கொண்ட provider-க்குள் wrap செய்வதன் மூலம், அந்த பகுதிக்கான context-ஐ override செய்யலாம்.

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

தேவைப்படும் அளவுக்கு providers-ஐ nest செய்து override செய்யலாம்.

<Recipes titleText="Context-ஐ override செய்வதற்கான examples">

#### Theme-ஐ override செய்தல் {/*overriding-a-theme*/}

இங்கே, `Footer`-க்கு *உள்ளே* இருக்கும் button, வெளியே உள்ள buttons (`"dark"`) விட வேறுபட்ட context value (`"light"`) பெறுகிறது.

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="வரவேற்பு">
      <Button>பதிவு செய்</Button>
      <Button>உள்நுழை</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>அமைப்புகள்</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### தானாக nest ஆகும் headings {/*automatically-nested-headings*/}

Context providers-ஐ nest செய்யும்போது information-ஐ "accumulate" செய்யலாம். இந்த example-இல், section nesting-ன் depth-ஐ குறிப்பிடும் `LevelContext`-ஐ `Section` component track செய்கிறது. அது parent section-இலிருந்து `LevelContext`-ஐ read செய்து, ஒன்று அதிகரித்த `LevelContext` number-ஐ அதன் children-க்கு provide செய்கிறது. இதன் விளைவாக, `Heading` component எத்தனை `Section` components-க்கு உள்ளே nested ஆக இருக்கிறது என்பதன் அடிப்படையில் `<h1>`, `<h2>`, `<h3>`, ... tags-இல் எதை use செய்வது என்பதை தானாக தீர்மானிக்க முடியும்.

இந்த example-க்கான [விரிவான walkthrough](/learn/passing-data-deeply-with-context)-ஐ படிக்கவும்.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>தலைப்பு</Heading>
      <Section>
        <Heading>தலைப்பு</Heading>
        <Heading>தலைப்பு</Heading>
        <Heading>தலைப்பு</Heading>
        <Section>
          <Heading>துணை heading</Heading>
          <Heading>துணை heading</Heading>
          <Heading>துணை heading</Heading>
          <Section>
            <Heading>துணை துணை heading</Heading>
            <Heading>துணை துணை heading</Heading>
            <Heading>துணை துணை heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading ஒரு Section-க்குள் இருக்க வேண்டும்!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Objects மற்றும் functions pass செய்யும்போது re-renders-ஐ optimize செய்தல் {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Objects மற்றும் functions உட்பட எந்த values-ஐயும் context வழியாக pass செய்யலாம்.

```js [[2, 10, "{ currentUser, login }"]]
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

இங்கே, <CodeStep step={2}>context value</CodeStep> இரண்டு properties கொண்ட JavaScript object; அவற்றில் ஒன்று function. `MyApp` re-render ஆகும் ஒவ்வொரு முறையும் (உதாரணமாக, route update-இல்), இது *வேறு* function-ஐச் சுட்டும் *வேறு* object ஆக இருக்கும். அதனால் `useContext(AuthContext)` call செய்யும் tree-இல் ஆழமான எல்லா components-ஐயும் React re-render செய்ய வேண்டி வரும்.

சிறிய apps-இல் இது பிரச்சினையல்ல. ஆனால் `currentUser` போன்ற underlying data மாறவில்லை என்றால், அவற்றை re-render செய்ய தேவையில்லை. அந்த உண்மையை React பயன்படுத்த உதவ, `login` function-ஐ [`useCallback`](/reference/react/useCallback)-ஆல் wrap செய்து, object creation-ஐ [`useMemo`](/reference/react/useMemo)-க்குள் wrap செய்யலாம். இது ஒரு performance optimization:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

இந்த மாற்றத்தின் விளைவாக, `MyApp` re-render ஆக வேண்டியிருந்தாலும், `currentUser` மாறாத வரை `useContext(AuthContext)` call செய்யும் components re-render ஆக வேண்டியதில்லை.

[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) மற்றும் [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) பற்றி மேலும் படிக்கவும்.

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### என் component என் provider-இலிருந்து value-ஐ பார்க்கவில்லை {/*my-component-doesnt-see-the-value-from-my-provider*/}

இது நடக்கும் சில common வழிகள் உள்ளன:

1. `useContext()` call செய்யும் அதே component-இல் (அல்லது அதற்கு கீழே) நீங்கள் `<SomeContext>` render செய்கிறீர்கள். `useContext()` call செய்யும் component-க்கு *மேலாகவும் வெளியிலும்* `<SomeContext>`-ஐ நகர்த்துங்கள்.
2. உங்கள் component-ஐ `<SomeContext>`-ஆல் wrap செய்ய மறந்திருக்கலாம், அல்லது நீங்கள் நினைத்ததைவிட வேறு tree பகுதியில் அதை வைத்திருக்கலாம். [React DevTools](/learn/react-developer-tools) பயன்படுத்தி hierarchy சரியாக உள்ளதா என்று check செய்யுங்கள்.
3. உங்கள் tooling-இல் உள்ள build issue காரணமாக, provide செய்யும் component பார்க்கும் `SomeContext` மற்றும் read செய்யும் component பார்க்கும் `SomeContext` இரண்டு வேறு objects ஆக இருக்கலாம். உதாரணமாக, symlinks use செய்தால் இது நடக்கலாம். அவற்றை `window.SomeContext1` மற்றும் `window.SomeContext2` போன்ற globals-க்கு assign செய்து, console-இல் `window.SomeContext1 === window.SomeContext2` என்பதை check செய்து இதை verify செய்யலாம். அவை ஒன்றாக இல்லையெனில், build tool level-இல் அந்த issue-ஐ fix செய்யுங்கள்.

### Default value வேறாக இருந்தாலும் என் context-இலிருந்து எப்போதும் `undefined` கிடைக்கிறது {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Tree-இல் `value` இல்லாத provider இருக்கலாம்:

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext>
   <Button />
</ThemeContext>
```

`value`-ஐ specify செய்ய மறந்தால், அது `value={undefined}` pass செய்வது போலாகும்.

நீங்கள் தவறுதலாக வேறு prop பெயரையும் பயன்படுத்தியிருக்கலாம்:

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

இந்த இரு cases-இலும் console-இல் React-இலிருந்து warning காண வேண்டும். அவற்றை fix செய்ய, prop-ஐ `value` என்று அழைக்கவும்:

```js {1,2}
// ✅ Passing the value prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

[உங்கள் `createContext(defaultValue)` call-இலிருந்து வரும் default value](#specifying-a-fallback-default-value) **மேலே பொருந்தும் provider ஒன்றும் இல்லாதபோது மட்டுமே** use செய்யப்படும் என்பதை கவனிக்கவும். Parent tree-இல் எங்காவது `<SomeContext value={undefined}>` component இருந்தால், `useContext(SomeContext)` call செய்யும் component context value ஆக `undefined`-ஐப் *பெறும்*.
