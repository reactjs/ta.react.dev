---
title: State-ஐ நிர்வகித்தல்
---

<Intro>

உங்கள் application வளரும்போது, உங்கள் state எப்படி ஒழுங்குபடுத்தப்படுகிறது மற்றும் data உங்கள் components இடையே எப்படி flows ஆகிறது என்பதில் அதிகமாக திட்டமிட்டு செயல்படுவது உதவியாக இருக்கும். Redundant அல்லது duplicate state என்பது bugs-க்கு பொதுவான காரணம். இந்த chapter-இல், state-ஐ நன்றாக structure செய்வது எப்படி, state update logic-ஐ maintainable ஆக வைத்திருப்பது எப்படி, மற்றும் தொலைவில் உள்ள components இடையே state-ஐ share செய்வது எப்படி என்பதை கற்றுக்கொள்வீர்கள்.

</Intro>

<YouWillLearn isChapter={true}>

* [UI changes-ஐ state changes ஆக எப்படி சிந்திப்பது](/learn/reacting-to-input-with-state)
* [State-ஐ நன்றாக structure செய்வது எப்படி](/learn/choosing-the-state-structure)
* [Components இடையே share செய்ய state-ஐ "lift state up" செய்வது எப்படி](/learn/sharing-state-between-components)
* [State preserve ஆகுமா அல்லது reset ஆகுமா என்பதை control செய்வது எப்படி](/learn/preserving-and-resetting-state)
* [Complex state logic-ஐ ஒரு function-இல் consolidate செய்வது எப்படி](/learn/extracting-state-logic-into-a-reducer)
* ["Prop drilling" இல்லாமல் information pass செய்வது எப்படி](/learn/passing-data-deeply-with-context)
* [உங்கள் app வளரும்போது state management-ஐ scale செய்வது எப்படி](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## State மூலம் input-க்கு react செய்தல் {/*reacting-to-input-with-state*/}

React-இல், code-இலிருந்து UI-ஐ நேரடியாக modify செய்யமாட்டீர்கள். உதாரணமாக, "button-ஐ disable செய்", "button-ஐ enable செய்", "success message-ஐ காட்டு" போன்ற commands எழுதமாட்டீர்கள். அதற்கு பதிலாக, உங்கள் component-ன் வெவ்வேறு visual states-க்கு ("initial state", "typing state", "success state") நீங்கள் பார்க்க விரும்பும் UI-ஐ describe செய்வீர்கள்; பின்னர் user input-க்கு பதிலாக state changes-ஐ trigger செய்வீர்கள். இது designers UI பற்றி சிந்திக்கும் முறைக்கு ஒத்தது.

React பயன்படுத்தி build செய்யப்பட்ட quiz form இதோ. Submit button-ஐ enable அல்லது disable செய்வதையும், அதன் பதிலாக success message காட்ட வேண்டுமா என்பதையும் தீர்மானிக்க இது `status` state variable-ஐ எப்படி பயன்படுத்துகிறது என்பதை கவனியுங்கள்.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>அது சரி!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>நகர quiz</h2>
      <p>
        காற்றை குடிக்கக்கூடிய தண்ணீராக மாற்றும் billboard எந்த நகரத்தில் உள்ளது?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit செய்
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('நல்ல guess, ஆனால் தவறான பதில். மீண்டும் முயற்சிக்கவும்!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

State-driven mindset உடன் interactions-ஐ எப்படி அணுகுவது என்பதை அறிய **[State மூலம் Input-க்கு React செய்தல்](/learn/reacting-to-input-with-state)** வாசிக்கவும்.

</LearnMore>

## State structure-ஐ தேர்வு செய்தல் {/*choosing-the-state-structure*/}

State-ஐ நன்றாக structure செய்வது, modify மற்றும் debug செய்ய இனிமையான component மற்றும் தொடர்ந்து bugs உண்டாக்கும் component ஆகியவற்றுக்கிடையே வித்தியாசத்தை உருவாக்கலாம். மிக முக்கியமான principle: state-இல் redundant அல்லது duplicated information இருக்கக்கூடாது. தேவையற்ற state இருந்தால், அதை update செய்ய மறப்பது சாத்தியம், bugs அறிமுகமாகும்!

உதாரணமாக, இந்த form-இல் **redundant** `fullName` state variable உள்ளது:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>உங்களை check in செய்வோம்</h2>
      <label>
        முதல் பெயர்:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        உங்கள் ticket வழங்கப்படும் பெயர்: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Component render ஆகும்போது `fullName`-ஐ calculate செய்வதன் மூலம் அதை remove செய்து code-ஐ simplify செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>உங்களை check in செய்வோம்</h2>
      <label>
        முதல் பெயர்:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        உங்கள் ticket வழங்கப்படும் பெயர்: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

இது சிறிய change போலத் தோன்றலாம், ஆனால் React apps-இல் பல bugs இதே முறையில் fix செய்யப்படுகின்றன.

<LearnMore path="/learn/choosing-the-state-structure">

Bugs தவிர்க்க state shape-ஐ எப்படி design செய்வது என்பதை அறிய **[State Structure-ஐ தேர்வு செய்தல்](/learn/choosing-the-state-structure)** வாசிக்கவும்.

</LearnMore>

## Components இடையே state share செய்தல் {/*sharing-state-between-components*/}

சில நேரங்களில், இரண்டு components-ன் state எப்போதும் ஒன்றாக மாற வேண்டும் என்று நீங்கள் விரும்பலாம். அதைச் செய்ய, இரண்டிலிருந்தும் state-ஐ remove செய்து, அவற்றின் nearest common parent-க்கு move செய்து, பின்னர் props மூலம் அவற்றுக்கு pass செய்யுங்கள். இது "lifting state up" என்று அழைக்கப்படுகிறது; React code எழுதும்போது நீங்கள் செய்யும் மிகவும் பொதுவான செயல்களில் ஒன்று.

இந்த example-இல், ஒரே நேரத்தில் ஒரு panel மட்டும் active ஆக இருக்க வேண்டும். இதை அடைய, ஒவ்வொரு individual panel-க்குள் active state வைத்திருப்பதற்கு பதிலாக, parent component state-ஐ வைத்துக்கொண்டு அதன் children-க்கான props-ஐ குறிப்பிடுகிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="பற்றி"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        சுமார் 2 million மக்கள் தொகையுடன், Almaty Kazakhstan-ன் மிகப்பெரிய நகரம். 1929 முதல் 1997 வரை அது அதன் தலைநகரமாக இருந்தது.
      </Panel>
      <Panel
        title="சொற்பிறப்பு"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        பெயர் <span lang="kk-KZ">алма</span> என்பதிலிருந்து வருகிறது; அது Kazakh மொழியில் "apple" என்ற பொருள், மேலும் "apples நிரம்பியது" என்று அடிக்கடி மொழிபெயர்க்கப்படுகிறது. உண்மையில், Almaty சுற்றிய பகுதி apple-ன் ancestral home என்று கருதப்படுகிறது; wild <i lang="la">Malus sieversii</i> modern domestic apple-ன் ancestor ஆக இருக்கக்கூடிய candidate என கருதப்படுகிறது.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          காட்டு
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

State-ஐ lift up செய்வது மற்றும் components-ஐ sync-இல் வைத்திருப்பது பற்றி அறிய **[Components இடையே State Share செய்தல்](/learn/sharing-state-between-components)** வாசிக்கவும்.

</LearnMore>

## State-ஐ preserve செய்தல் மற்றும் reset செய்தல் {/*preserving-and-resetting-state*/}

ஒரு component-ஐ re-render செய்யும்போது, tree-ன் எந்த பகுதிகளை keep செய்ய வேண்டும் (மற்றும் update செய்ய வேண்டும்), எந்த பகுதிகளை discard செய்ய வேண்டும் அல்லது scratch-இலிருந்து re-create செய்ய வேண்டும் என்பதை React தீர்மானிக்க வேண்டும். பெரும்பாலான சூழல்களில், React-ன் automatic behavior போதுமான அளவு நன்றாக வேலை செய்கிறது. Default ஆக, முந்தைய rendered component tree-உடன் "match up" ஆகும் tree பகுதிகளை React preserve செய்கிறது.

ஆனால் சில நேரங்களில் இது நீங்கள் விரும்புவது அல்ல. இந்த chat app-இல், message type செய்து பிறகு recipient-ஐ switch செய்தால் input reset ஆகாது. இதனால் user தவறுதலாக தவறான person-க்கு message அனுப்பலாம்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={contact.name + ' உடன் chat'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

`<Chat key={email} />` போல வேறு `key` pass செய்வதன் மூலம் default behavior-ஐ override செய்து, ஒரு component தனது state-ஐ reset செய்ய React-ஐ *force* செய்யலாம். Recipient வேறுபட்டால், அது புதிய data (மற்றும் inputs போன்ற UI) உடன் scratch-இலிருந்து re-create செய்யப்பட வேண்டிய *வேறு* `Chat` component என்று கருதப்பட வேண்டும் என்பதைக் React-க்கு இது சொல்கிறது. இப்போது recipients இடையே switch செய்தால் input field reset ஆகிறது--அதே component-ஐ render செய்தாலும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={contact.name + ' உடன் chat'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

State-ன் lifetime மற்றும் அதை எப்படி control செய்வது என்பதை அறிய **[State-ஐ Preserve மற்றும் Reset செய்தல்](/learn/preserving-and-resetting-state)** வாசிக்கவும்.

</LearnMore>

## State logic-ஐ reducer-க்கு extract செய்தல் {/*extracting-state-logic-into-a-reducer*/}

பல event handlers முழுவதும் பரவிய பல state updates கொண்ட components overwhelming ஆகலாம். இத்தகைய சூழல்களுக்கு, அனைத்து state update logic-ஐ உங்கள் component-க்கு வெளியே "reducer" என்று அழைக்கப்படும் single function-இல் consolidate செய்யலாம். உங்கள் event handlers concise ஆகும், ஏனெனில் அவை user "actions"-ஐ மட்டும் specify செய்கின்றன. File-ன் bottom-இல், ஒவ்வொரு action-க்கும் response ஆக state எப்படி update ஆக வேண்டும் என்பதை reducer function specify செய்கிறது!

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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Logic-ஐ reducer function-இல் consolidate செய்வது எப்படி என்பதை அறிய **[State Logic-ஐ Reducer-க்கு Extract செய்தல்](/learn/extracting-state-logic-into-a-reducer)** வாசிக்கவும்.

</LearnMore>

## Context மூலம் data-வை ஆழமாக pass செய்தல் {/*passing-data-deeply-with-context*/}

பொதுவாக, parent component-இலிருந்து child component-க்கு props மூலம் information pass செய்வீர்கள். ஆனால் பல components வழியாக ஏதாவது prop pass செய்ய வேண்டியிருந்தால், அல்லது பல components-க்கு ஒரே information தேவைப்பட்டால், props pass செய்வது சிரமமாகலாம். Context, parent component-க்கு அதன் கீழுள்ள tree-இல் உள்ள எந்த component-க்கும்--அது எவ்வளவு ஆழமாக இருந்தாலும்--props வழியாக explicit ஆக pass செய்யாமல் information வழங்க அனுமதிக்கிறது.

இங்கே, `Heading` component தனது heading level-ஐ nearest `Section`-இடம் அதன் level-ஐ "கேட்டு" தீர்மானிக்கிறது. ஒவ்வொரு `Section`-மும் parent `Section`-ஐ கேட்டு அதில் ஒன்று சேர்ப்பதன் மூலம் தனது சொந்த level-ஐ track செய்கிறது. ஒவ்வொரு `Section`-மும் கீழுள்ள அனைத்து components-க்கும் props pass செய்யாமல் information வழங்குகிறது--அதை context மூலம் செய்கிறது.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>தலைப்பு</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Section>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
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

<LearnMore path="/learn/passing-data-deeply-with-context">

Props pass செய்வதற்கான alternative ஆக context பயன்படுத்துவது பற்றி அறிய **[Context மூலம் Data-வை ஆழமாக Pass செய்தல்](/learn/passing-data-deeply-with-context)** வாசிக்கவும்.

</LearnMore>

## Reducer மற்றும் context உடன் scale செய்தல் {/*scaling-up-with-reducer-and-context*/}

Reducers ஒரு component-ன் state update logic-ஐ consolidate செய்ய அனுமதிக்கின்றன. Context, information-ஐ ஆழமாக பிற components-க்கு pass செய்ய அனுமதிக்கிறது. Complex screen ஒன்றின் state-ஐ manage செய்ய reducers மற்றும் context-ஐ ஒன்றாக combine செய்யலாம்.

இந்த approach-இல், complex state கொண்ட parent component அதை reducer மூலம் manage செய்கிறது. Tree-இல் எவ்வளவு ஆழத்தில் இருந்தாலும் மற்ற components அதன் state-ஐ context மூலம் read செய்யலாம். அந்த state-ஐ update செய்ய actions dispatch செய்யவும் அவற்றால் முடியும்.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Kyoto-வில் ஓய்வு நாள்</h1>
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
  { id: 1, text: 'Temple-ஐ பார்வையிடு', done: false },
  { id: 2, text: 'Matcha குடி', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

வளரும் app-இல் state management எப்படி scale ஆகிறது என்பதை அறிய **[Reducer மற்றும் Context உடன் Scale செய்தல்](/learn/scaling-up-with-reducer-and-context)** வாசிக்கவும்.

</LearnMore>

## அடுத்து என்ன? {/*whats-next*/}

இந்த chapter-ஐ page by page வாசிக்கத் தொடங்க [State மூலம் Input-க்கு React செய்தல்](/learn/reacting-to-input-with-state)-க்கு செல்லுங்கள்!

அல்லது, இந்த topics ஏற்கனவே தெரிந்திருந்தால், [Escape Hatches](/learn/escape-hatches) பற்றி வாசிக்கலாமே?
