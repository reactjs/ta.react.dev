---
title: "<form>"
---

<Intro>

[Built-in browser `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form), information submit செய்ய interactive controls உருவாக்க அனுமதிக்கிறது.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">தேடு</button>
</form>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<form>` {/*form*/}

Information submit செய்ய interactive controls உருவாக்க, [built-in browser `<form>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)-ஐ render செய்யவும்.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">தேடு</button>
</form>
```

[கீழே மேலும் examples பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<form>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ support செய்கிறது.

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL அல்லது function. `action`-க்கு URL pass செய்தால் form HTML form component போல behave செய்யும். `action`-க்கு function pass செய்தால், [Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components)-ஐத் தொடர்ந்து Transition-இல் அந்த function form submission-ஐ handle செய்யும். `action`-க்கு pass செய்யப்பட்ட function async ஆக இருக்கலாம்; submitted form-ன் [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) கொண்ட single argument உடன் call செய்யப்படும். `<button>`, `<input type="submit">`, அல்லது `<input type="image">` component-இல் உள்ள `formAction` attribute மூலம் `action` prop override செய்யப்படலாம்.

#### Caveats {/*caveats*/}

* `action` அல்லது `formAction`-க்கு function pass செய்தால், `method` prop value எதுவாக இருந்தாலும் HTTP method POST ஆக இருக்கும்.

---

## Usage {/*usage*/}

### Client-இல் form submission handle செய்தல் {/*handle-form-submission-on-the-client*/}

Form submit செய்யப்படும் போது function run ஆக, form-ன் `action` prop-க்கு function pass செய்யவும். [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), argument ஆக function-க்கு pass செய்யப்படும்; இதனால் form submit செய்த data-வை access செய்யலாம். இது URLs மட்டுமே ஏற்கும் conventional [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)-இலிருந்து வேறுபடுகிறது. `action` function succeed ஆன பிறகு, form-இல் உள்ள எல்லா uncontrolled field elements reset செய்யப்படும்.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`நீங்கள் '${query}' என்று தேடினீர்கள்`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">தேடு</button>
    </form>
  );
}
```

</Sandpack>

### Server Function உடன் form submission handle செய்தல் {/*handle-form-submission-with-a-server-function*/}

Input மற்றும் submit button உடன் `<form>` render செய்யவும். Form submit செய்யப்படும் போது function run ஆக, form-ன் `action` prop-க்கு Server Function ([`'use server'`](/reference/rsc/use-server) கொண்டு mark செய்யப்பட்ட function) pass செய்யவும்.

Server Function-ஐ `<form action>`-க்கு pass செய்வது, JavaScript enabled இல்லாமலோ code load ஆகும்முன்னோ users forms submit செய்ய அனுமதிக்கிறது. Slow connection, device, அல்லது JavaScript disabled கொண்ட users-க்கு இது பயனுள்ளது; `action` prop-க்கு URL pass செய்யும்போது forms வேலை செய்வதைப் போன்றது.

`<form>`-ன் action-க்கு data வழங்க hidden form fields பயன்படுத்தலாம். Server Function hidden form field data-வை [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instance ஆகப் பெற்று call செய்யப்படும்.

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Cart-இல் சேர்க்கவும்</button>
    </form>

  );
}
```

Hidden form fields பயன்படுத்தி `<form>`-ன் action-க்கு data வழங்குவதற்கு பதிலாக, extra arguments supply செய்ய <CodeStep step={1}>`bind`</CodeStep> method call செய்யலாம். Function-க்கு argument ஆக pass செய்யப்படும் <CodeStep step={3}>`formData`</CodeStep>-க்கு கூடுதலாக, இது புதிய argument (<CodeStep step={2}>`productId`</CodeStep>)-ஐ function-க்கு bind செய்யும்.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Cart-இல் சேர்க்கவும்</button>
    </form>
  );
}
```

`<form>` [Server Component](/reference/rsc/use-client) மூலம் render செய்யப்படும் போது, மேலும் [Server Function](/reference/rsc/server-functions) `<form>`-ன் `action` prop-க்கு pass செய்யப்படும் போது, form [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) ஆகும்.

### Form submission போது pending state காட்டுதல் {/*display-a-pending-state-during-form-submission*/}
Form submit ஆகும் போது pending state display செய்ய, `<form>`-இல் render செய்யப்படும் component ஒன்றில் `useFormStatus` Hook call செய்து, return செய்யப்படும் `pending` property-ஐ read செய்யலாம்.

இங்கே, form submitting ஆகிறது என்பதை indicate செய்ய `pending` property பயன்படுத்துகிறோம்.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "சமர்ப்பிக்கிறது..." : "சமர்ப்பி"}
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

`useFormStatus` Hook பற்றி மேலும் அறிய [reference documentation](/reference/react-dom/hooks/useFormStatus)-ஐ பார்க்கவும்.

### Form data-வை optimistically update செய்தல் {/*optimistically-updating-form-data*/}
`useOptimistic` Hook, network request போன்ற background operation முடிவதற்கு முன் user interface-ஐ optimistically update செய்யும் வழி வழங்குகிறது. Forms context-இல், இந்த technique apps மேலும் responsive ஆக உணர உதவுகிறது. User form submit செய்தால், changes reflect செய்ய server response காத்திருக்காமல், expected outcome உடன் interface உடனடியாக update செய்யப்படும்.

உதாரணமாக, user form-இல் message type செய்து "Send" button அழுத்தும்போது, message உண்மையில் server-க்கு அனுப்பப்படுவதற்கு முன்பே, `useOptimistic` Hook அந்த message-ஐ "Sending..." label உடன் list-இல் உடனடியாக காட்ட அனுமதிக்கிறது. இந்த "optimistic" approach வேகம் மற்றும் responsiveness உணர்வை தருகிறது. பின்னர் form background-இல் message-ஐ உண்மையில் send செய்ய முயற்சிக்கும். Server message receive செய்ததை confirm செய்ததும், "Sending..." label remove செய்யப்படும்.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (அனுப்புகிறது...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="வணக்கம்!" />
        <button type="submit">அனுப்பு</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "வணக்கம்!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # '`useOptimistic` reference documentation page publish ஆன பிறகு அடுத்த line-ஐ uncomment செய்து, இந்த line-ஐ delete செய்யவும்'
[//]: # '`useOptimistic` Hook பற்றி மேலும் அறிய [reference documentation](/reference/react/useOptimistic)-ஐ பார்க்கவும்.'

### Form submission errors handle செய்தல் {/*handling-form-submission-errors*/}

சில cases-இல் `<form>`-ன் `action` prop call செய்யும் function error throw செய்யும். `<form>`-ஐ Error Boundary-இல் wrap செய்வதன் மூலம் இந்த errors handle செய்யலாம். `<form>`-ன் `action` prop call செய்யும் function error throw செய்தால், error boundary-ன் fallback display செய்யப்படும்.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
  }
  return (
    <ErrorBoundary
      fallback={<p>Form submit செய்யும் போது error ஏற்பட்டது</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">தேடு</button>
      </form>
    </ErrorBoundary>
  );
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### JavaScript இல்லாமல் form submission error காட்டுதல் {/*display-a-form-submission-error-without-javascript*/}

Progressive enhancement-க்காக JavaScript bundle load ஆகும்முன் form submission error message display செய்ய வேண்டிய requirements:

1. `<form>` [Client Component](/reference/rsc/use-client) மூலம் render செய்யப்பட வேண்டும்
1. `<form>`-ன் `action` prop-க்கு pass செய்யப்படும் function [Server Function](/reference/rsc/server-functions) ஆக இருக்க வேண்டும்
1. Error message display செய்ய `useActionState` Hook பயன்படுத்தப்பட வேண்டும்

`useActionState` இரண்டு parameters ஏற்கிறது: [Server Function](/reference/rsc/server-functions) மற்றும் initial state. `useActionState` இரண்டு values return செய்கிறது: state variable மற்றும் action. `useActionState` return செய்யும் action, form-ன் `action` prop-க்கு pass செய்யப்பட வேண்டும். `useActionState` return செய்யும் state variable error message display செய்ய பயன்படுத்தலாம். `useActionState`-க்கு pass செய்யப்பட்ட Server Function return செய்யும் value, state variable update செய்ய பயன்படுத்தப்படும்.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`"${email}" சேர்க்கப்பட்டது`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>என் newsletter-க்கு sign up செய்யுங்கள்</h1>
      <p>Error பார்க்க அதே email-ஐ இருமுறை sign up செய்யுங்கள்</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("இந்த email address ஏற்கனவே சேர்க்கப்பட்டுள்ளது");
  }
  emails.push(newEmail);
}
```

</Sandpack>

Form action-இலிருந்து state update செய்வது பற்றி மேலும் அறிய [`useActionState`](/reference/react/useActionState) docs-ஐ பார்க்கவும்

### Multiple submission types handle செய்தல் {/*handling-multiple-submission-types*/}

User அழுத்தும் button அடிப்படையில் multiple submission actions handle செய்ய forms design செய்யலாம். Form உள்ளே உள்ள ஒவ்வொரு button-யும், `formAction` prop set செய்வதன் மூலம் தனித்த action அல்லது behavior உடன் associate செய்யப்படலாம்.

User குறிப்பிட்ட button tap செய்தால், form submit செய்யப்படும்; அந்த button-ன் attributes மற்றும் action மூலம் define செய்யப்பட்ட corresponding action execute செய்யப்படும். உதாரணமாக, form default ஆக article-ஐ review-க்கு submit செய்யலாம்; ஆனால் article-ஐ draft ஆக save செய்ய `formAction` set செய்யப்பட்ட தனி button வைத்திருக்கலாம்.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' '${button}' button மூலம் publish செய்யப்பட்டது`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`'${content}' பற்றிய உங்கள் draft save செய்யப்பட்டது!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Draft save செய்</button>
    </form>
  );
}
```

</Sandpack>
