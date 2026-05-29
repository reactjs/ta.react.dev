---
title: RSC Sandbox Test
---

## அடிப்படை Server Component {/*basic-server-component*/}

<SandpackRSC>

```js src/App.js
export default function App() {
  return <h1>Hello from a Server Component!</h1>;
}
```

</SandpackRSC>

## Server + Client Components {/*server-client*/}

<SandpackRSC>

```js src/App.js
import Counter from './Counter';

export default function App() {
  return (
    <div>
      <h1>Server Component</h1>
      <p>This text is rendered on the server.</p>
      <Counter />
    </div>
  );
}
```

```js src/Counter.js
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

</SandpackRSC>

## Suspense உடன் Async Server Component {/*async-suspense*/}

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import Albums from './Albums';

export default function App() {
  return (
    <div>
      <h1>Music</h1>
      <Suspense fallback={<p>Loading albums...</p>}>
        <Albums />
      </Suspense>
    </div>
  );
}
```

```js src/Albums.js
async function fetchAlbums() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ['Abbey Road', 'Let It Be', 'Revolver'];
}

export default async function Albums() {
  const albums = await fetchAlbums();
  return (
    <ul>
      {albums.map(album => (
        <li key={album}>{album}</li>
      ))}
    </ul>
  );
}
```

</SandpackRSC>

## Streaming proof {/*streaming-proof*/}

இந்த demo streaming incremental என்பதை நிரூபிக்கிறது. Shell `<Suspense>` fallback உடன் உடனே render ஆகிறது. 2 seconds-க்கு பிறகு async component stream ஆகி வந்து, outer content re-render ஆகாமல் அதை மாற்றுகிறது. Timestamps அந்த இடைவெளியை காட்டுகின்றன.

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import SlowData from './SlowData';
import Timestamp from './Timestamp';

export default function App() {
  return (
    <div>
      <h1>Streaming Proof</h1>
      <p>Shell rendered at: <Timestamp /></p>
      <Suspense fallback={<p>⏳ Waiting for data to stream in...</p>}>
        <SlowData />
      </Suspense>
    </div>
  );
}
```

```js src/SlowData.js
import Timestamp from './Timestamp';

async function fetchData() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return ['Chunk A', 'Chunk B', 'Chunk C'];
}

export default async function SlowData() {
  const items = await fetchData();
  return (
    <div>
      <p>Data streamed in at: <Timestamp /></p>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/Timestamp.js
'use client';

export default function Timestamp() {
  return <strong>{new Date().toLocaleTimeString()}</strong>;
}
```

</SandpackRSC>

## Flight data types {/*flight-data-types*/}

இந்த demo Map, Set, Date, மற்றும் BigInt-ஐ server component-இலிருந்து Flight stream வழியாக client component-க்கு pass செய்கிறது; முழு Flight protocol type system end-to-end வேலை செய்கிறது என்பதை நிரூபிக்கிறது.

<SandpackRSC>

```js src/App.js
import DataViewer from './DataViewer';

export default function App() {
  const map = new Map([
    ['alice', 100],
    ['bob', 200],
  ]);
  const set = new Set(['react', 'next', 'remix']);
  const date = new Date('2025-06-15T12:00:00Z');
  const big = 9007199254740993n;

  return (
    <div>
      <h1>Flight Data Types</h1>
      <DataViewer map={map} set={set} date={date} big={big} />
    </div>
  );
}
```

```js src/DataViewer.js
'use client';

export default function DataViewer({ map, set, date, big }) {
  const checks = [
    ['Map', map instanceof Map, () => (
      <ul>{[...map.entries()].map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>
    )],
    ['Set', set instanceof Set, () => (
      <ul>{[...set].map(v => <li key={v}>{v}</li>)}</ul>
    )],
    ['Date', date instanceof Date, () => (
      <p>{date.toISOString()}</p>
    )],
    ['BigInt', typeof big === 'bigint', () => (
      <p>{big.toString()}</p>
    )],
  ];

  return (
    <div>
      {checks.map(([label, passed, render]) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <strong>{label}: {passed ? 'pass' : 'FAIL'}</strong>
          {render()}
        </div>
      ))}
    </div>
  );
}
```

</SandpackRSC>

## use() உடன் Promise streaming {/*promise-streaming-use*/}

Server ஒரு promise உருவாக்குகிறது (2s-இல் resolve ஆகும்) மற்றும் 3s suspend ஆகும் parent async component வழியாக அதை prop ஆக pass செய்கிறது. Parent ~3s-இல் reveal ஆகும் போது, promise ஏற்கனவே resolved ஆகிவிட்டது; ஆகவே `use()` inner fallback இல்லாமல் உடனே return செய்கிறது. Elapsed time ~3000ms (parent-ன் delay) ஆக இருக்க வேண்டும்; ~5000ms அல்ல (அப்படியானால் promise client-இல் restart ஆனது என்று அர்த்தம்).

<SandpackRSC>

```js src/App.js
import { Suspense } from 'react';
import SlowParent from './SlowParent';
import UserCard from './UserCard';

async function fetchUser() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { name: 'Alice', role: 'Engineer' };
}

function now() {
  return Date.now();
}

export default function App() {
  const serverTime = now();
  const userPromise = fetchUser();
  return (
    <div>
      <h1>Promise Streaming</h1>
      <p>Promise resolves in 2s. Parent suspends for 3s.</p>
      <Suspense fallback={<p>Outer: waiting for parent (3s)...</p>}>
        <SlowParent>
          <Suspense fallback={<p>Inner: waiting for data (should not appear!)</p>}>
            <UserCard userPromise={userPromise} serverTime={serverTime} />
          </Suspense>
        </SlowParent>
      </Suspense>
    </div>
  );
}
```

```js src/SlowParent.js
export default async function SlowParent({ children }) {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <div>{children}</div>;
}
```

```js src/UserCard.js
'use client';
import { use } from 'react';

function now() {
  return Date.now();
}
export default function UserCard({ userPromise, serverTime }) {
  const user = use(userPromise);
  const elapsed = now() - serverTime;
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 16,
    }}>
      <strong>{user.name}</strong>
      <p>{user.role}</p>
      <p style={{ fontSize: 13 }}>
        Rendered {elapsed}ms after server created the promise.
      </p>
      <p style={{ color: '#666', fontSize: 12 }}>
        ~3000ms = promise already resolved, waited only for parent.
        ~5000ms would mean the promise restarted on the client.
      </p>
    </div>
  );
}
```

</SandpackRSC>

## Server Actions-இல் Flight data types {/*flight-data-types-actions*/}

இந்த demo Map, Set, Date, மற்றும் BigInt-ஐ client component-இலிருந்து `encodeReply`/`decodeReply` மூலம் server action-க்கு அனுப்பி, பின்னர் round trip முடிந்தும் types சரியாக உள்ளனவா என்பதை verify செய்கிறது.

<SandpackRSC>

```js src/App.js
import { testTypes, getResults } from './actions';
import TestButton from './TestButton';

export default async function App() {
  const results = await getResults();
  return (
    <div>
      <h1>Flight Types in Server Actions</h1>
      <TestButton testTypes={testTypes} />
      {results ? (
        <div>
          {results.map(r => (
            <div key={r.label} style={{ marginBottom: 12 }}>
              <strong>{r.label}: {r.ok ? 'pass' : 'FAIL'}</strong>
              <p>{r.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Click the button to send typed data to the server action.</p>
      )}
    </div>
  );
}
```

```js src/actions.js
'use server';

let results = null;

export async function testTypes(map, set, date, big) {
  results = [
    {
      label: 'Map',
      ok: map instanceof Map,
      detail: map instanceof Map
        ? 'entries: ' + JSON.stringify([...map.entries()])
        : 'received: ' + typeof map,
    },
    {
      label: 'Set',
      ok: set instanceof Set,
      detail: set instanceof Set
        ? 'values: ' + JSON.stringify([...set])
        : 'received: ' + typeof set,
    },
    {
      label: 'Date',
      ok: date instanceof Date,
      detail: date instanceof Date
        ? date.toISOString()
        : 'received: ' + typeof date,
    },
    {
      label: 'BigInt',
      ok: typeof big === 'bigint',
      detail: typeof big === 'bigint'
        ? big.toString()
        : 'received: ' + typeof big,
    },
  ];
}

export async function getResults() {
  return results;
}
```

```js src/TestButton.js
'use client';
import { useTransition } from 'react';

export default function TestButton({ testTypes }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await testTypes(
        new Map([['alice', 100], ['bob', 200]]),
        new Set(['react', 'next', 'remix']),
        new Date('2025-06-15T12:00:00Z'),
        9007199254740993n
      );
    });
  }

  return (
    <button onClick={handleClick} disabled={pending}>
      {pending ? 'Sending...' : 'Send typed data to server'}
    </button>
  );
}
```

</SandpackRSC>

## Server Action mutation + re-render {/*action-mutation-rerender*/}

Server action server-side data-வை mutate செய்து confirmation string return செய்கிறது. Action முடிந்த பிறகு framework முழு server component tree-ஐ தானாக re-render செய்வதால் மட்டுமே updated list visible ஆகிறது; server component data-வை மீண்டும் read செய்து புதிய UI-ஐ client-க்கு stream செய்கிறது.

<SandpackRSC>

```js src/App.js
import { getTodos } from './db';
import { createTodo } from './actions';
import AddTodo from './AddTodo';

export default function App() {
  const todos = getTodos();
  return (
    <div>
      <h1>Todo List</h1>
      <p style={{ color: '#666', fontSize: 13 }}>
        This list is rendered by a server component
        reading server-side data. It only updates because
        the server re-renders after each action.
      </p>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
      <AddTodo createTodo={createTodo} />
    </div>
  );
}
```

```js src/db.js
let todos = ['Buy groceries'];

export function getTodos() {
  return [...todos];
}

export function addTodo(text) {
  todos.push(text);
}
```

```js src/actions.js
'use server';
import { addTodo } from './db';

export async function createTodo(text) {
  if (!text) return 'Please enter a todo.';
  addTodo(text);
  return 'Added: ' + text;
}
```

```js src/AddTodo.js
'use client';
import { useState, useTransition } from 'react';

export default function AddTodo({ createTodo }) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createTodo(text);
      setMessage(result);
      setText('');
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New todo"
        />
        <button disabled={pending}>
          {pending ? 'Adding...' : 'Add'}
        </button>
      </form>
      {message && (
        <p style={{ color: '#666', fontSize: 13 }}>
          Action returned: "{message}"
        </p>
      )}
    </div>
  );
}
```

</SandpackRSC>

## Inline Server Actions {/*inline-server-actions*/}

Function body-யில் `'use server'` கொண்டு server component-க்குள் inline-ஆக define செய்யப்பட்ட server actions. Action module-level state மீது close over செய்து prop ஆக pass செய்யப்படுகிறது; தனி `actions.js` file தேவையில்லை.

<SandpackRSC>

```js src/App.js
import LikeButton from './LikeButton';

let count = 0;

export default function App() {
  async function addLike() {
    'use server';
    count++;
  }

  return (
    <div>
      <h1>Inline Server Actions</h1>
      <p>Likes: {count}</p>
      <LikeButton addLike={addLike} />
    </div>
  );
}
```

```js src/LikeButton.js
'use client';

export default function LikeButton({ addLike }) {
  return (
    <form action={addLike}>
      <button type="submit">Like</button>
    </form>
  );
}
```

</SandpackRSC>

## Server Functions {/*server-functions*/}

<SandpackRSC>

```js src/App.js
import { addLike, getLikeCount } from './actions';
import LikeButton from './LikeButton';

export default async function App() {
  const count = await getLikeCount();
  return (
    <div>
      <h1>Server Functions</h1>
      <p>Likes: {count}</p>
      <LikeButton addLike={addLike} />
    </div>
  );
}
```

```js src/actions.js
'use server';

let count = 0;

export async function addLike() {
  count++;
}

export async function getLikeCount() {
  return count;
}
```

```js src/LikeButton.js
'use client';

export default function LikeButton({ addLike }) {
  return (
    <form action={addLike}>
      <button type="submit">Like</button>
    </form>
  );
}
```

</SandpackRSC>
