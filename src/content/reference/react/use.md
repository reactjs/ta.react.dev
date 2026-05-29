---
title: use
---

<Intro>

`use` என்பது [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) அல்லது [context](/learn/passing-data-deeply-with-context) போன்ற resource-ன் value-ஐ read செய்ய உதவும் React API ஆகும்.

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `use(resource)` {/*use*/}

உங்கள் component-இல் `use`-ஐ call செய்து, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) அல்லது [context](/learn/passing-data-deeply-with-context) போன்ற resource-ன் value-ஐ read செய்யுங்கள்.

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

React Hooks-களுக்கு மாறாக, `use`-ஐ loops-க்குள் மற்றும் `if` போன்ற conditional statements-க்குள் call செய்யலாம். React Hooks போலவே, `use`-ஐ call செய்யும் function ஒரு Component அல்லது Hook ஆக இருக்க வேண்டும்.

Promise உடன் call செய்யப்படும் போது, `use` API [`Suspense`](/reference/react/Suspense) மற்றும் [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) உடன் integrate ஆகிறது. `use`-க்கு pass செய்யப்பட்ட Promise pending-ஆக இருக்கும் வரை, `use`-ஐ call செய்யும் component *suspend* ஆகும். `use`-ஐ call செய்யும் component Suspense boundary-க்குள் wrap செய்யப்பட்டிருந்தால், fallback காண்பிக்கப்படும். Promise resolve ஆனதும், Suspense fallback-க்கு பதிலாக `use` API return செய்த data-வைப் பயன்படுத்தி rendered components காண்பிக்கப்படும். `use`-க்கு pass செய்யப்பட்ட Promise reject ஆனால், அருகிலுள்ள Error Boundary-ன் fallback காண்பிக்கப்படும்.

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `resource`: நீங்கள் value-ஐ read செய்ய விரும்பும் data source இதுவாகும். Resource ஒரு [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) அல்லது [context](/learn/passing-data-deeply-with-context) ஆக இருக்கலாம்.

#### திரும்பும் மதிப்பு {/*returns*/}

`use` API, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-ன் resolved value அல்லது [context](/learn/passing-data-deeply-with-context) போன்ற resource-இலிருந்து read செய்யப்பட்ட value-ஐ return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `use` API ஒரு Component அல்லது Hook-க்குள் call செய்யப்பட வேண்டும்.
* [Server Component](/reference/rsc/server-components)-இல் data fetch செய்யும்போது, `use`-ஐ விட `async` மற்றும் `await`-ஐ விரும்புங்கள். `async` மற்றும் `await`, `await` invoke செய்யப்பட்ட இடத்திலிருந்து rendering-ஐ தொடர்கின்றன; ஆனால் `use`, data resolve ஆன பிறகு component-ஐ மீண்டும் render செய்கிறது.
* Client Components-இல் Promises உருவாக்குவதற்கு பதிலாக, [Server Components](/reference/rsc/server-components)-இல் Promises உருவாக்கி அவற்றை [Client Components](/reference/rsc/use-client)-க்கு pass செய்வதை விரும்புங்கள். Client Components-இல் உருவாக்கப்படும் Promises ஒவ்வொரு render-லும் மீண்டும் உருவாக்கப்படும். Server Component-இலிருந்து Client Component-க்கு pass செய்யப்படும் Promises re-renders முழுவதும் stable ஆக இருக்கும். [இந்த உதாரணத்தைப் பார்க்கவும்](#streaming-data-from-server-to-client).

---

## பயன்பாடு {/*usage*/}

### `use` மூலம் context read செய்தல் {/*reading-context-with-use*/}

[context](/learn/passing-data-deeply-with-context) `use`-க்கு pass செய்யப்படும் போது, அது [`useContext`](/reference/react/useContext) போலவே செயல்படும். `useContext` உங்கள் component-ன் top level-இல் call செய்யப்பட வேண்டியிருந்தாலும், `use`-ஐ `if` போன்ற conditionals-க்குள் மற்றும் `for` போன்ற loops-க்குள் call செய்யலாம். இது அதிக flexible என்பதால் `useContext`-ஐ விட `use` விரும்பப்படுகிறது.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

நீங்கள் pass செய்த <CodeStep step={1}>context</CodeStep>-க்கான <CodeStep step={2}>context value</CodeStep>-ஐ `use` return செய்கிறது. Context value-ஐ தீர்மானிக்க, React component tree-ஐ search செய்து, அந்த குறிப்பிட்ட context-க்கான **மேலே உள்ள மிக அருகிலுள்ள context provider**-ஐ கண்டுபிடிக்கிறது.

ஒரு `Button`-க்கு context pass செய்ய, அதை அல்லது அதன் parent components-இல் ஒன்றை பொருத்தமான context provider-க்குள் wrap செய்யுங்கள்.

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

Provider மற்றும் `Button` இடையில் எத்தனை component layers இருந்தாலும் அது முக்கியமில்லை. `Form`-க்குள் *எங்கிருந்தாலும்* ஒரு `Button` `use(ThemeContext)` call செய்தால், அது value ஆக `"dark"`-ஐ பெறும்.

[`useContext`](/reference/react/useContext)-க்கு மாறாக, <CodeStep step={2}>`use`</CodeStep>-ஐ <CodeStep step={1}>`if`</CodeStep> போன்ற conditionals மற்றும் loops-இல் call செய்யலாம்.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> ஒரு <CodeStep step={1}>`if`</CodeStep> statement-க்குள் இருந்து call செய்யப்படுகிறது; இதனால் Context-இலிருந்து values-ஐ conditionally read செய்ய முடியும்.

<Pitfall>

`useContext` போலவே, `use(context)` அதை call செய்யும் component-க்கு *மேலே* உள்ள மிக அருகிலுள்ள context provider-ஐ எப்போதும் தேடும். அது மேல்நோக்கி search செய்கிறது; நீங்கள் `use(context)` call செய்யும் component-இலுள்ள context providers-ஐ **கருத்தில் கொள்ளாது**.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

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
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
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

### Server-இலிருந்து client-க்கு data stream செய்தல் {/*streaming-data-from-server-to-client*/}

<CodeStep step={1}>Server Component</CodeStep>-இலிருந்து <CodeStep step={2}>Client Component</CodeStep>-க்கு Promise-ஐ prop ஆக pass செய்வதன் மூலம், server-இலிருந்து client-க்கு data stream செய்யலாம்.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

பிறகு <CodeStep step={2}>Client Component</CodeStep>, <CodeStep step={4}>prop ஆக பெற்ற Promise</CodeStep>-ஐ எடுத்து <CodeStep step={5}>`use`</CodeStep> API-க்கு pass செய்கிறது. இதனால் Server Component ஆரம்பத்தில் உருவாக்கிய <CodeStep step={4}>Promise</CodeStep>-இலிருந்து value-ஐ <CodeStep step={2}>Client Component</CodeStep> read செய்ய முடியும்.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
<CodeStep step={2}>`Message`</CodeStep> <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>-இல் wrap செய்யப்பட்டிருப்பதால், Promise resolve ஆகும் வரை fallback காண்பிக்கப்படும். Promise resolve ஆனதும், value <CodeStep step={5}>`use`</CodeStep> API மூலம் read செய்யப்படும்; பிறகு <CodeStep step={2}>`Message`</CodeStep> component Suspense fallback-ஐ replace செய்யும்.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

Server Component-இலிருந்து Client Component-க்கு Promise pass செய்யும் போது, அதன் resolved value server மற்றும் client இடையே pass செய்ய serializable ஆக இருக்க வேண்டும். Functions போன்ற data types serializable அல்ல; எனவே அவை இப்படிப்பட்ட Promise-ன் resolved value ஆக இருக்க முடியாது.

</Note>


<DeepDive>

#### Promise-ஐ Server Component-இலா Client Component-இலா resolve செய்ய வேண்டும்? {/*resolve-promise-in-server-or-client-component*/}

Promise-ஐ Server Component-இலிருந்து Client Component-க்கு pass செய்து, Client Component-இல் `use` API மூலம் resolve செய்யலாம். அதே Promise-ஐ Server Component-இல் `await` மூலம் resolve செய்து, தேவையான data-வை Client Component-க்கு prop ஆக pass செய்யவும் முடியும்.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

ஆனால் [Server Component](/reference/rsc/server-components)-இல் `await` பயன்படுத்துவது, `await` statement முடியும் வரை அதன் rendering-ஐ block செய்யும். Server Component-இலிருந்து Client Component-க்கு Promise pass செய்வது, அந்த Promise Server Component-ன் rendering-ஐ block செய்வதைத் தடுக்கிறது.

</DeepDive>

### Rejected Promises-ஐ கையாளுதல் {/*dealing-with-rejected-promises*/}

சில நேரங்களில் `use`-க்கு pass செய்யப்பட்ட Promise reject ஆகலாம். Rejected Promises-ஐ நீங்கள் இரண்டு வழிகளில் கையாளலாம்:

1. [Error Boundary மூலம் பயனர்களுக்கு error காண்பித்தல்.](#displaying-an-error-to-users-with-error-boundary)
2. [`Promise.catch` மூலம் மாற்று value வழங்குதல்](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use`-ஐ try-catch block-இல் call செய்ய முடியாது. Try-catch block-க்கு பதிலாக [உங்கள் component-ஐ Error Boundary-இல் wrap செய்யுங்கள்](#displaying-an-error-to-users-with-error-boundary), அல்லது [Promise-ன் `.catch` method மூலம் பயன்படுத்த மாற்று value வழங்குங்கள்](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Error Boundary மூலம் பயனர்களுக்கு error காண்பித்தல் {/*displaying-an-error-to-users-with-error-boundary*/}

Promise reject ஆகும் போது உங்கள் பயனர்களுக்கு error காண்பிக்க விரும்பினால், [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) பயன்படுத்தலாம். Error Boundary பயன்படுத்த, `use` API-ஐ call செய்யும் component-ஐ Error Boundary-இல் wrap செய்யுங்கள். `use`-க்கு pass செய்யப்பட்ட Promise reject ஆனால், Error Boundary-க்கான fallback காண்பிக்கப்படும்.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### `Promise.catch` மூலம் மாற்று value வழங்குதல் {/*providing-an-alternative-value-with-promise-catch*/}

`use`-க்கு pass செய்யப்பட்ட Promise reject ஆகும் போது மாற்று value வழங்க விரும்பினால், Promise-ன் <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> method-ஐ பயன்படுத்தலாம்.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Promise-ன் <CodeStep step={1}>`catch`</CodeStep> method-ஐ பயன்படுத்த, Promise object-இல் <CodeStep step={1}>`catch`</CodeStep>-ஐ call செய்யுங்கள். <CodeStep step={1}>`catch`</CodeStep> ஒரு argument மட்டும் எடுக்கும்: error message-ஐ argument ஆகப் பெறும் function. <CodeStep step={1}>`catch`</CodeStep>-க்கு pass செய்யப்பட்ட function எதை <CodeStep step={2}>return</CodeStep> செய்கிறதோ, அது Promise-ன் resolved value ஆகப் பயன்படுத்தப்படும்.

---

## பிரச்சினைத் தீர்வு {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

நீங்கள் `use`-ஐ React Component அல்லது Hook function-க்கு வெளியே call செய்கிறீர்கள், அல்லது try-catch block-இல் call செய்கிறீர்கள். Try-catch block-க்குள் `use` call செய்கிறீர்கள் என்றால், உங்கள் component-ஐ Error Boundary-இல் wrap செய்யுங்கள்; அல்லது Promise-ன் `catch`-ஐ call செய்து error-ஐ catch செய்து, Promise-ஐ வேறு value உடன் resolve செய்யுங்கள். [இந்த உதாரணங்களைப் பார்க்கவும்](#dealing-with-rejected-promises).

`use`-ஐ React Component அல்லது Hook function-க்கு வெளியே call செய்கிறீர்கள் என்றால், `use` call-ஐ React Component அல்லது Hook function-க்கு நகர்த்துங்கள்.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ the function calling `use` is not a Component or Hook
    const message = use(messagePromise);
    // ...
```

அதற்கு பதிலாக, component closures எதற்கும் வெளியே `use`-ஐ call செய்யுங்கள்; அங்கு `use`-ஐ call செய்யும் function ஒரு Component அல்லது Hook ஆக இருக்கும்.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` is being called from a component.
  const message = use(messagePromise);
  // ...
```
