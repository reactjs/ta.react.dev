---
title: useFormStatus
---

<Intro>

கடைசி form submission-ன் status information-ஐ தரும் Hook தான் `useFormStatus`.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

`useFormStatus` Hook கடைசி form submission-ன் status information-ஐ வழங்குகிறது.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Status information பெற, `Submit` component `<form>`-க்குள் render செய்யப்பட வேண்டும். Form actively submit ஆகிறதா என்பதைச் சொல்லும் <CodeStep step={1}>`pending`</CodeStep> property போன்ற information-ஐ Hook return செய்கிறது.

மேலுள்ள உதாரணத்தில், form submit ஆகும் போது `<button>` presses-ஐ disable செய்ய `Submit` இந்த information-ஐப் பயன்படுத்துகிறது.

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

`useFormStatus` parameters எதையும் ஏற்காது.

#### Returns {/*returns*/}

பின்வரும் properties கொண்ட `status` object:

* `pending`: ஒரு boolean. `true` என்றால் parent `<form>` submission pending நிலையில் உள்ளது. இல்லையெனில் `false`.

* `data`: Parent `<form>` submit செய்யும் data-வை கொண்ட [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)-ஐ implement செய்யும் object. Active submission இல்லையெனில் அல்லது parent `<form>` இல்லையெனில், இது `null` ஆக இருக்கும்.

* `method`: `'get'` அல்லது `'post'` என்ற string value. Parent `<form>` `GET` அல்லது `POST` [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) மூலம் submit செய்கிறதா என்பதை இது குறிக்கிறது. Default-ஆக, `<form>` `GET` method-ஐப் பயன்படுத்தும்; இதை [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method) property மூலம் குறிப்பிடலாம்.

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: Parent `<form>`-ன் `action` prop-க்கு pass செய்யப்பட்ட function-க்கு reference. Parent `<form>` இல்லையெனில், property `null` ஆக இருக்கும். `action` prop-க்கு URI value வழங்கப்பட்டிருந்தாலோ, அல்லது `action` prop குறிப்பிடப்படவில்லையெனில், `status.action` `null` ஆக இருக்கும்.

#### Caveats {/*caveats*/}

* `useFormStatus` Hook `<form>`-க்குள் render செய்யப்படும் component-இலிருந்து call செய்யப்பட வேண்டும்.
* `useFormStatus` parent `<form>`-க்கான status information மட்டும் return செய்யும். அதே component-இலோ child components-இலோ render செய்யப்படும் எந்த `<form>`-க்கான status information-ஐயும் return செய்யாது.

---

## பயன்பாடு {/*usage*/}

### Form submission நேரத்தில் pending state காட்டுதல் {/*display-a-pending-state-during-form-submission*/}
ஒரு form submit ஆகும் போது pending state காட்ட, `<form>`-க்குள் render செய்யப்படும் component-இல் `useFormStatus` Hook-ஐ call செய்து, return செய்யப்பட்ட `pending` property-ஐ read செய்யலாம்.

இங்கு form submit ஆகிறது என்பதை காட்ட `pending` property-ஐப் பயன்படுத்துகிறோம்.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
</Sandpack>

<Pitfall>

##### அதே component-இல் render செய்யப்படும் `<form>`-க்கான status information-ஐ `useFormStatus` return செய்யாது. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

`useFormStatus` Hook parent `<form>`-க்கான status information மட்டும் return செய்யும்; Hook-ஐ call செய்யும் அதே component-இல் அல்லது child components-இல் render செய்யப்படும் எந்த `<form>`-க்கும் அல்ல.

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

அதற்கு பதிலாக `<form>`-க்குள் இருக்கும் component-இலிருந்து `useFormStatus`-ஐ call செய்யுங்கள்.

```js
function Submit() {
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // This is the <form> `useFormStatus` tracks
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Submit செய்யப்படும் form data-வை read செய்தல் {/*read-form-data-being-submitted*/}

User submit செய்யும் data என்ன என்பதை display செய்ய, `useFormStatus` return செய்யும் status information-ன் `data` property-ஐப் பயன்படுத்தலாம்.

இங்கு users username request செய்யக்கூடிய form உள்ளது. அவர்கள் எந்த username request செய்துள்ளனர் என்பதை உறுதிப்படுத்தும் தற்காலிக status message காட்ட `useFormStatus`-ஐப் பயன்படுத்தலாம்.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### `status.pending` ஒருபோதும் `true` ஆகவில்லை {/*pending-is-never-true*/}

`useFormStatus` parent `<form>`-க்கான status information மட்டும் return செய்யும்.

`useFormStatus` call செய்யும் component `<form>`-க்குள் nested ஆக இல்லை என்றால், `status.pending` எப்போதும் `false` return செய்யும். `<form>` element-ன் child ஆன component-இல் `useFormStatus` call செய்யப்படுகிறதா என்பதை verify செய்யுங்கள்.

அதே component-இல் render செய்யப்படும் `<form>`-ன் status-ஐ `useFormStatus` track செய்யாது. மேலும் விவரங்களுக்கு [Pitfall](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component)-ஐப் பார்க்கவும்.
