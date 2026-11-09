---
title: Server Functions
---

<RSC>

Server Functions [React Server Components](/reference/rsc/server-components)-இல் பயன்படுத்தப்படுகின்றன.

**குறிப்பு:** September 2024 வரை, அனைத்து Server Functions-ஐயும் "Server Actions" என்று குறிப்பிட்டோம். ஒரு Server Function action prop-க்கு pass செய்யப்பட்டாலோ அல்லது action-க்குள் இருந்து call செய்யப்பட்டாலோ அது Server Action; ஆனால் அனைத்து Server Functions-உம் Server Actions அல்ல. Server Functions பல நோக்கங்களுக்கு பயன்படுத்தப்படலாம் என்பதை பிரதிபலிக்க இந்த documentation-இல் naming update செய்யப்பட்டுள்ளது.

</RSC>

<Intro>

Server-இல் execute செய்யப்படும் async functions-ஐ Client Components call செய்ய Server Functions அனுமதிக்கின்றன.

</Intro>

<InlineToc />

<Note>

#### Server Functions-க்கு support எப்படி build செய்வது? {/*how-do-i-build-support-for-server-functions*/}

React 19-இல் Server Functions stable; minor versions இடையே break ஆகாது. ஆனால் React Server Components bundler அல்லது framework-இல் Server Functions implement செய்ய பயன்படுத்தப்படும் underlying APIs semver-ஐ பின்பற்றாது; React 19.x minors இடையே break ஆகலாம்.

Bundler அல்லது framework ஆக Server Functions support செய்ய, குறிப்பிட்ட React version-க்கு pin செய்வதையோ அல்லது Canary release பயன்படுத்துவதையோ பரிந்துரைக்கிறோம். எதிர்காலத்தில் Server Functions implement செய்யப்படும் APIs-ஐ stabilize செய்ய bundlers மற்றும் frameworks உடன் தொடர்ந்து வேலை செய்வோம்.

</Note>

[`"use server"`](/reference/rsc/use-server) directive உடன் Server Function define செய்யப்பட்டால், உங்கள் framework தானாக Server Function-க்கு reference உருவாக்கி, அந்த reference-ஐ Client Component-க்கு pass செய்யும். அந்த function client-இல் call செய்யப்படும்போது, function execute செய்ய React server-க்கு request அனுப்பி result-ஐ return செய்யும்.

Server Functions Server Components-இல் உருவாக்கப்பட்டு props ஆக Client Components-க்கு pass செய்யப்படலாம்; அல்லது Client Components-இல் import செய்து பயன்படுத்தப்படலாம்.

## பயன்பாடு {/*usage*/}

<<<<<<< HEAD
### Server Component-இலிருந்து Server Function உருவாக்குதல் {/*creating-a-server-function-from-a-server-component*/}
=======
### Creating a Server Function in a Server Component {/*creating-a-server-function-from-a-server-component*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Server Components `"use server"` directive மூலம் Server Functions define செய்யலாம்:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote() {
  async function createNoteAction() {
    // Server Function
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

React `EmptyNote` Server Component-ஐ render செய்யும்போது, `createNoteAction` function-க்கு reference உருவாக்கி, அந்த reference-ஐ `Button` Client Component-க்கு pass செய்யும். Button click செய்யப்படும்போது, வழங்கப்பட்ட reference உடன் `createNoteAction` function execute செய்ய React server-க்கு request அனுப்பும்:

```js {5}
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>;
}
```

மேலும் அறிய [`"use server"`](/reference/rsc/use-server) docs-ஐப் பார்க்கவும்.

<<<<<<< HEAD

### Client Components-இலிருந்து Server Functions import செய்தல் {/*importing-server-functions-from-client-components*/}
=======
### Importing a Server Function into a Client Component {/*importing-server-functions-from-client-components*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

`"use server"` directive பயன்படுத்தும் files-இலிருந்து Client Components Server Functions import செய்யலாம்:

```js [[1, 4, "createNote"]]
// actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

Bundler `EmptyNote` Client Component-ஐ build செய்யும்போது, bundle-இல் `createNote` function-க்கு reference உருவாக்கும். `button` click செய்யப்படும்போது, வழங்கப்பட்ட reference-ஐப் பயன்படுத்தி `createNote` function execute செய்ய React server-க்கு request அனுப்பும்:

```js [[1, 4, "createNote"], [1, 7, "createNote"], [1, 9, "createNote"]]
// EmptyNote.js
"use client";

import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()}>Create Empty Note</button>;
}
```

மேலும் அறிய [`"use server"`](/reference/rsc/use-server) docs-ஐப் பார்க்கவும்.

<<<<<<< HEAD
### Actions உடன் Server Functions {/*server-functions-with-actions*/}
=======
### Calling a Server Function from an Action {/*server-functions-with-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Server Functions client-இல் உள்ள Actions-இலிருந்து call செய்யப்படலாம்:

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 15, "updateName"], [2, 13, "submitAction"], [2, 28, "submitAction"]]
// UpdateName.js
"use client";

import {useState, useTransition} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  function submitAction() {
    startTransition(async () => {
      const {error} = await updateName(name);
      // State updates after await aren't automatically marked as Transitions,
      // so wrap them in another startTransition.
      startTransition(() => {
        setError(error);
        if (!error) {
          setName('');
        }
      });
    });
  }

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
    </form>
  );
}
```

Client-இல் அதை Action-இல் wrap செய்வதன் மூலம் Server Function-ன் `isPending` state-ஐ access செய்ய இது அனுமதிக்கிறது.

<<<<<<< HEAD
மேலும் அறிய [`<form>`-க்கு வெளியே Server Function call செய்தல்](/reference/rsc/use-server#calling-a-server-function-outside-of-form) docs-ஐப் பார்க்கவும்.

### Form Actions உடன் Server Functions {/*using-server-functions-with-form-actions*/}
=======
For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passing a Server Function to the `<form>` `action` prop {/*using-server-functions-with-form-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Server Functions React 19-ன் புதிய Form features உடன் வேலை செய்கின்றன.

<<<<<<< HEAD
Form-ஐ server-க்கு தானாக submit செய்ய, Server Function-ஐ Form-க்கு pass செய்யலாம்:
=======
Pass a Server Function to the `<form>` `action` prop to submit the form to the server. React passes the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to the Server Function as its first argument:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    throw new Error('Name is required');
  }
  await db.users.updateName(name);
}
```

```js [[1, 4, "updateName"], [1, 8, "updateName"]]
// UpdateName.js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  );
}
```

<<<<<<< HEAD
Form submission வெற்றி பெற்றால், React form-ஐ தானாக reset செய்யும். Pending state, last response access செய்ய, அல்லது progressive enhancement support செய்ய `useActionState` சேர்க்கலாம்.
=======
When the Server Function passed to the `<form>` `action` prop succeeds, React automatically resets the form's uncontrolled fields. Users can submit the form before its JavaScript bundle loads. Use `useActionState` to access the Action's pending state and most recent return value.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

மேலும் அறிய [Forms-இல் Server Functions](/reference/rsc/use-server#server-functions-in-forms) docs-ஐப் பார்க்கவும்.

<<<<<<< HEAD
### `useActionState` உடன் Server Functions {/*server-functions-with-use-action-state*/}

Action pending state மற்றும் கடைசியாக return செய்யப்பட்ட response மட்டும் access செய்ய வேண்டிய பொதுவான சூழலில், `useActionState` உடன் Server Functions-ஐ call செய்யலாம்:
=======
### Calling a Server Function with `useActionState` {/*server-functions-with-use-action-state*/}

Call a Server Function with `useActionState` to access the Action's pending state and most recent return value. The Server Function receives the previous state as its first argument and the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as its second argument. Its return value becomes the next state:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(previousState, formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "submitAction"], [2, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

<<<<<<< HEAD
Server Functions உடன் `useActionState` பயன்படுத்தும்போது, hydration முடிவதற்கு முன் செய்யப்பட்ட form submissions-ஐயும் React தானாக replay செய்யும். இதன் பொருள் app hydrate ஆகும் முன்பே users உங்கள் app உடன் interact செய்ய முடியும்.
=======
When the function passed to `useActionState` is a Server Function, users can submit the form before hydration finishes. React can display the Server Function's return value before JavaScript loads.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

மேலும் அறிய [`useActionState`](/reference/react/useActionState) docs-ஐப் பார்க்கவும்.

<<<<<<< HEAD
### `useActionState` உடன் progressive enhancement {/*progressive-enhancement-with-useactionstate*/}
=======
To keep submitted values or control when the form resets, see [Preserving form values after an Action](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Supporting progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Server Functions `useActionState`-ன் மூன்றாவது argument மூலம் progressive enhancement-ஐயும் support செய்கின்றன.

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "/name/update"], [3, 8, "submitAction"], [3, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, {error: null}, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<<<<<<< HEAD
<CodeStep step={2}>permalink</CodeStep> `useActionState`-க்கு வழங்கப்பட்டால், JavaScript bundle load ஆகும் முன் form submit செய்யப்பட்டால் React வழங்கப்பட்ட URL-க்கு redirect செய்யும்.
=======
If you pass the <CodeStep step={2}>`permalink`</CodeStep> to `useActionState`, the browser navigates to that URL when the form is submitted before the JavaScript bundle loads. At the destination, render the same form component with the same Server Function and `permalink` so React can pass the returned state to it.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

மேலும் அறிய [`useActionState`](/reference/react/useActionState) docs-ஐப் பார்க்கவும்.
