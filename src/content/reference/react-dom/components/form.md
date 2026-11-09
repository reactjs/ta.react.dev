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

<<<<<<< HEAD
[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): URL அல்லது function. `action`-க்கு URL pass செய்தால் form HTML form component போல behave செய்யும். `action`-க்கு function pass செய்தால், [Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components)-ஐத் தொடர்ந்து Transition-இல் அந்த function form submission-ஐ handle செய்யும். `action`-க்கு pass செய்யப்பட்ட function async ஆக இருக்கலாம்; submitted form-ன் [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) கொண்ட single argument உடன் call செய்யப்படும். `<button>`, `<input type="submit">`, அல்லது `<input type="image">` component-இல் உள்ள `formAction` attribute மூலம் `action` prop override செய்யப்படலாம்.

#### Caveats {/*caveats*/}

* `action` அல்லது `formAction`-க்கு function pass செய்தால், `method` prop value எதுவாக இருந்தாலும் HTTP method POST ஆக இருக்கும்.
=======
* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): A string containing a URL, or a function. If you pass a URL, the form behaves like a standard HTML form. If you pass a function, it handles the submission. See [Handling form submission with an action prop](#handle-form-submission-with-an-action-prop).
  * If you pass a function to `action`, React runs it in a [Transition](/reference/react/useTransition) following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components).
  * The function may be async. React calls it with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form.
  * A `formAction` prop on a `<button>`, `<input type="submit">`, or `<input type="image">` overrides this `action`.
* [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method): A string that specifies the HTTP method to use when `action` is a URL. Defaults to `get`.
* `onSubmit`: An [`Event` handler](/reference/react-dom/components/common#react-event-object) function. Fires when the form is submitted. See [Handling form submission with an event handler](#handle-form-submission-with-an-event-handler).

#### Caveats {/*caveats*/}

* If you pass a function to `action` or `formAction`, the HTTP method will be `POST` regardless of the value of the `method` prop.
* If you pass a function to `action` or `formAction`, React resets all [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) field elements after the Action succeeds. See [Preserving form values after an Action](#preserve-form-values-after-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

---

## Usage {/*usage*/}

<<<<<<< HEAD
### Client-இல் form submission handle செய்தல் {/*handle-form-submission-on-the-client*/}

Form submit செய்யப்படும் போது function run ஆக, form-ன் `action` prop-க்கு function pass செய்யவும். [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), argument ஆக function-க்கு pass செய்யப்படும்; இதனால் form submit செய்த data-வை access செய்யலாம். இது URLs மட்டுமே ஏற்கும் conventional [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)-இலிருந்து வேறுபடுகிறது. `action` function succeed ஆன பிறகு, form-இல் உள்ள எல்லா uncontrolled field elements reset செய்யப்படும்.
=======
### Handling form submission with an event handler {/*handle-form-submission-with-an-event-handler*/}

Pass a function to the `onSubmit` event handler to run code when the form is submitted. By default, the browser sends the form data to the current URL and refreshes the page. Calling [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in the event handler overrides this behavior.

If you also pass a function to `action`, React runs it after `onSubmit` unless `onSubmit` calls `e.preventDefault()`.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

`onSubmit` works in every version of React and gives you direct access to the [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event). Starting in React 19, the [`action` prop](#handle-form-submission-with-an-action-prop) is the preferred API for form submissions. With `action`, React runs the submission in a [Transition](/reference/react/useTransition) and manages pending state and concurrency across multiple submissions. You can also use optimistic updates, Error Boundaries, and [Server Functions](/reference/rsc/server-functions).

</Note>

---

### Handling form submission with an action prop {/*handle-form-submission-with-an-action-prop*/}

Pass a function to the `action` prop to run it when the form is submitted. React calls the function with a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object containing the values of every input with a `name` attribute. Your inputs can be [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You don't need `value`/`onChange` pairs, an `onSubmit` handler, or `e.preventDefault()`.

When you pass a function to `action`, React:

* Runs the function in a [Transition](/reference/react/useTransition).
* Makes the pending state available to child components via [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propagates any errors to the nearest Error Boundary.
* Resets the form's uncontrolled fields when the function succeeds. To keep their values, see [Preserving form values after an Action](#preserve-form-values-after-an-action).

Because the Action runs in a Transition, you can also use [`useActionState`](/reference/react/useActionState) to manage form state and [`useOptimistic`](/reference/react/useOptimistic) for optimistic UI. For [Server Functions](/reference/rsc/server-functions) and progressive enhancement, see [Handling form submission with a Server Function](#handle-form-submission-with-a-server-function).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
<<<<<<< HEAD
    const query = formData.get("query");
    alert(`நீங்கள் '${query}' என்று தேடினீர்கள்`);
=======
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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

<<<<<<< HEAD
### Server Function உடன் form submission handle செய்தல் {/*handle-form-submission-with-a-server-function*/}

Input மற்றும் submit button உடன் `<form>` render செய்யவும். Form submit செய்யப்படும் போது function run ஆக, form-ன் `action` prop-க்கு Server Function ([`'use server'`](/reference/rsc/use-server) கொண்டு mark செய்யப்பட்ட function) pass செய்யவும்.

Server Function-ஐ `<form action>`-க்கு pass செய்வது, JavaScript enabled இல்லாமலோ code load ஆகும்முன்னோ users forms submit செய்ய அனுமதிக்கிறது. Slow connection, device, அல்லது JavaScript disabled கொண்ட users-க்கு இது பயனுள்ளது; `action` prop-க்கு URL pass செய்யும்போது forms வேலை செய்வதைப் போன்றது.

`<form>`-ன் action-க்கு data வழங்க hidden form fields பயன்படுத்தலாம். Server Function hidden form field data-வை [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instance ஆகப் பெற்று call செய்யப்படும்.
=======
---

### Handling form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

A `<form>`'s `action` prop can run a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) when the user submits the form. Users can submit that form before JavaScript loads or when JavaScript is disabled. This matches how forms behave when you pass a URL to `action`.

React calls the Server Function with the form's [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and includes every input with a `name` attribute. To pass additional data, such as an ID from props, see [Passing extra data to an Action](#passing-extra-data-to-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```jsx
import { addComment } from './actions.js';

function CommentForm() {
  return (
<<<<<<< HEAD
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Cart-இல் சேர்க்கவும்</button>
=======
    <form action={addComment}>
      <textarea name="comment" />
      <button type="submit">Comment</button>
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
    </form>
  );
}
```

<<<<<<< HEAD
Hidden form fields பயன்படுத்தி `<form>`-ன் action-க்கு data வழங்குவதற்கு பதிலாக, extra arguments supply செய்ய <CodeStep step={1}>`bind`</CodeStep> method call செய்யலாம். Function-க்கு argument ஆக pass செய்யப்படும் <CodeStep step={3}>`formData`</CodeStep>-க்கு கூடுதலாக, இது புதிய argument (<CodeStep step={2}>`productId`</CodeStep>)-ஐ function-க்கு bind செய்யும்.
=======
```js
// actions.js
'use server';
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

export async function addComment(formData) {
  const comment = formData.get('comment');
  // ...
}
```

<DeepDive>

#### Passing extra data to an Action {/*passing-extra-data-to-an-action*/}

An Action receives the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData). To include data the user did not enter, such as an ID from props, use one of these approaches:

* **Hidden fields** add the value to `FormData`. The value appears in the HTML, and `formData.get` returns a string. Users can submit the form before JavaScript loads.
* **Binding with `bind`** passes the value as an argument to a Server Function, before `formData`. The argument keeps its type, so a number stays a number. It must be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values). Users can submit the form before JavaScript loads.
* **A function in the component** reads props and state directly. It runs after JavaScript loads, then calls a Server Function with those values.

The client sends hidden field values and bound arguments. Check on the server that the logged-in user is allowed to perform the Action. See [Security considerations](/reference/rsc/use-server#security).

#### Hidden fields {/*passing-extra-data-hidden-fields*/}

In a Server Component, render an `<input type="hidden">` with a `name` and `value`. React includes that value in the `FormData` passed to the Action.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    'use server';
    await updateCart(formData.get('productId'));
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

React includes a submit button's `name` and `value` in `FormData` when that button submits the form.

#### Binding with `bind` {/*passing-extra-data-bind*/}

In a Server Component, call [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) on the Server Function and pass the bound function to `action`. Pass `null` as the first argument to `bind`. Each argument after `null` comes before the `formData` argument React passes when the form is submitted.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Cart-இல் சேர்க்கவும்</button>
    </form>
  );
}
```

<<<<<<< HEAD
`<form>` [Server Component](/reference/rsc/use-client) மூலம் render செய்யப்படும் போது, மேலும் [Server Function](/reference/rsc/server-functions) `<form>`-ன் `action` prop-க்கு pass செய்யப்படும் போது, form [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) ஆகும்.

### Form submission போது pending state காட்டுதல் {/*display-a-pending-state-during-form-submission*/}
Form submit ஆகும் போது pending state display செய்ய, `<form>`-இல் render செய்யப்படும் component ஒன்றில் `useFormStatus` Hook call செய்து, return செய்யப்படும் `pending` property-ஐ read செய்யலாம்.
=======
When the form is submitted, React calls `addProductToCart(formData)`, which calls `addToCart(productId, formData)`.

If you also use [`useActionState`](/reference/react/useActionState), the Server Function receives `productId`, `previousState`, and `formData`, in that order. Define that function in a separate file and bind it from the Client Component.

#### A function in the component {/*passing-extra-data-function*/}

Define the function passed to `action` in the Client Component so it can read the component's props or state. That function passes those values to a Server Function.

```jsx
// AddToCart.js
'use client';

import { updateCart } from './actions.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    await updateCart(productId, formData);
  }
  return (
    <form action={addToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function updateCart(productId, formData) {
  // ...
}
```

Because `addToCart` runs in the browser, the component's JavaScript must load before the form can submit.

</DeepDive>

---

### Displaying a pending state during form submission {/*display-a-pending-state-during-form-submission*/}

To display a pending state when a form is being submitted, you can call the [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) Hook in a component rendered in a `<form>` and read the `pending` property returned.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

இங்கே, form submitting ஆகிறது என்பதை indicate செய்ய `pending` property பயன்படுத்துகிறோம்.

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
<<<<<<< HEAD
      {pending ? "சமர்ப்பிக்கிறது..." : "சமர்ப்பி"}
=======
      {pending ? 'Submitting...' : 'Submit'}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

<<<<<<< HEAD
`useFormStatus` Hook பற்றி மேலும் அறிய [reference documentation](/reference/react-dom/hooks/useFormStatus)-ஐ பார்க்கவும்.

### Form data-வை optimistically update செய்தல் {/*optimistically-updating-form-data*/}
`useOptimistic` Hook, network request போன்ற background operation முடிவதற்கு முன் user interface-ஐ optimistically update செய்யும் வழி வழங்குகிறது. Forms context-இல், இந்த technique apps மேலும் responsive ஆக உணர உதவுகிறது. User form submit செய்தால், changes reflect செய்ய server response காத்திருக்காமல், expected outcome உடன் interface உடனடியாக update செய்யப்படும்.
=======
To learn more about the `useFormStatus` Hook, see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

---

### Optimistically updating form data {/*optimistically-updating-form-data*/}

The [`useOptimistic`](/reference/react/useOptimistic) Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

உதாரணமாக, user form-இல் message type செய்து "Send" button அழுத்தும்போது, message உண்மையில் server-க்கு அனுப்பப்படுவதற்கு முன்பே, `useOptimistic` Hook அந்த message-ஐ "Sending..." label உடன் list-இல் உடனடியாக காட்ட அனுமதிக்கிறது. இந்த "optimistic" approach வேகம் மற்றும் responsiveness உணர்வை தருகிறது. பின்னர் form background-இல் message-ஐ உண்மையில் send செய்ய முயற்சிக்கும். Server message receive செய்ததை confirm செய்ததும், "Sending..." label remove செய்யப்படும்.

<Sandpack>

```js src/App.js
import { startTransition, useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef(null);
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
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
<<<<<<< HEAD
    { text: "வணக்கம்!", sending: false, key: 1 }
=======
    { text: 'Hello there!', sending: false, key: 1 }
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    startTransition(() => {
      setMessages((messages) => [...messages, { text: sentMessage }]);
    });
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  // Simulate a message delivery delay
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

<<<<<<< HEAD
[//]: # '`useOptimistic` reference documentation page publish ஆன பிறகு அடுத்த line-ஐ uncomment செய்து, இந்த line-ஐ delete செய்யவும்'
[//]: # '`useOptimistic` Hook பற்றி மேலும் அறிய [reference documentation](/reference/react/useOptimistic)-ஐ பார்க்கவும்.'
=======
To learn more about the `useOptimistic` Hook, see the [reference documentation](/reference/react/useOptimistic).

---
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

### Form submission errors handle செய்தல் {/*handling-form-submission-errors*/}

<<<<<<< HEAD
சில cases-இல் `<form>`-ன் `action` prop call செய்யும் function error throw செய்யும். `<form>`-ஐ Error Boundary-இல் wrap செய்வதன் மூலம் இந்த errors handle செய்யலாம். `<form>`-ன் `action` prop call செய்யும் function error throw செய்தால், error boundary-ன் fallback display செய்யப்படும்.
=======
To handle errors thrown by a function passed to a `<form>`'s `action` prop, wrap the form in an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). React displays the boundary's fallback when the function throws.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
    throw new Error('search error');
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
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<<<<<<< HEAD
### JavaScript இல்லாமல் form submission error காட்டுதல் {/*display-a-form-submission-error-without-javascript*/}
=======
#### Handling form submission errors before JavaScript loads {/*display-a-form-submission-error-without-javascript*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Progressive enhancement-க்காக JavaScript bundle load ஆகும்முன் form submission error message display செய்ய வேண்டிய requirements:

<<<<<<< HEAD
1. `<form>` [Client Component](/reference/rsc/use-client) மூலம் render செய்யப்பட வேண்டும்
1. `<form>`-ன் `action` prop-க்கு pass செய்யப்படும் function [Server Function](/reference/rsc/server-functions) ஆக இருக்க வேண்டும்
1. Error message display செய்ய `useActionState` Hook பயன்படுத்தப்பட வேண்டும்

`useActionState` இரண்டு parameters ஏற்கிறது: [Server Function](/reference/rsc/server-functions) மற்றும் initial state. `useActionState` இரண்டு values return செய்கிறது: state variable மற்றும் action. `useActionState` return செய்யும் action, form-ன் `action` prop-க்கு pass செய்யப்பட வேண்டும். `useActionState` return செய்யும் state variable error message display செய்ய பயன்படுத்தலாம். `useActionState`-க்கு pass செய்யப்பட்ட Server Function return செய்யும் value, state variable update செய்ய பயன்படுத்தப்படும்.
=======
1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the [`useActionState`](/reference/react/useActionState) Hook be used to display the error message

Define the Server Function in a separate file with the [`'use server'`](/reference/rsc/use-server) directive. It receives the previous state followed by the submitted `FormData`:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

<<<<<<< HEAD
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
=======
export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }
}
```

In a Client Component, pass the Server Function to `useActionState`. Pass the returned Action to the form's `action` prop and render the returned state:

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
<<<<<<< HEAD
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
=======
    <form action={signupAction}>
      <label htmlFor="email">Email: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  );
}
```

If the form is submitted before JavaScript loads, React includes the Server Function's returned error message in the server-rendered response.

<<<<<<< HEAD
export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("இந்த email address ஏற்கனவே சேர்க்கப்பட்டுள்ளது");
=======
---

### Preserving form values after an Action {/*preserve-form-values-after-an-action*/}

When a function passed to `action` or `formAction` completes without throwing, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You may want to keep the submitted values after saving edits, or when the Action returns a [validation error](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).

To preserve those values, you can store them with [`useState`](/reference/react/useState) and pass them to each field's [`defaultValue`](/reference/react-dom/components/input#providing-an-initial-value-for-an-input). Update the state when the Action finishes. React applies the updated defaults before resetting the form, so the fields keep those values.

Try changing the title and clicking **Save**. In this example, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) shows "Saving..." during a simulated one-second request. Then `setTitle` updates the saved title and preserves it in the input.

<Sandpack>

```js src/App.js
import { startTransition, useState } from 'react';
import SaveButton from './SaveButton.js';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    await new Promise((res) => setTimeout(res, 1000));
    startTransition(() => {
      setTitle(formData.get('title'));
    });
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <SaveButton />
      <p>Saved title: {title}</p>
    </form>
  );
}
```

```js src/SaveButton.js hidden
import { useFormStatus } from 'react-dom';

export default function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Form action-இலிருந்து state update செய்வது பற்றி மேலும் அறிய [`useActionState`](/reference/react/useActionState) docs-ஐ பார்க்கவும்
=======
The call to `setTitle` [after `await`](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) needs another [`startTransition`](/reference/react/startTransition) to mark it as a Transition update.

`saveAction` can also call a [Server Function](/reference/rsc/server-functions) and store its return value:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function submitTitle(formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return title;
}
```

Add [`'use client'`](/reference/rsc/use-client) at the top of the component's file, import `submitTitle`, and replace `saveAction`. The rest of the form stays the same:

```js
import { submitTitle } from './actions.js';

async function saveAction(formData) {
  const savedTitle = await submitTitle(formData);
  startTransition(() => {
    setTitle(savedTitle);
  });
}
```

#### Preserving form values before JavaScript loads {/*preserving-form-values-before-javascript-loads*/}

With [`useActionState`](/reference/react/useActionState), React can display a [Server Function](/reference/rsc/server-functions)'s returned value before hydration completes. The form can use those values as its new defaults. In a [Client Component](/reference/rsc/use-client), `useActionState` receives the Server Function and returns an Action for the form's `action` prop.

See [Handling form submission errors before JavaScript loads](#display-a-form-submission-error-without-javascript) for the same behavior with errors.

The Server Function receives the previous state followed by the submitted `FormData`. In this example, `updateTitle` saves the title and returns `{ title }`, which becomes the new state. Passing `state.title` to `defaultValue` preserves the saved title after the reset:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function updateTitle(previousState, formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return { title };
}
```

```js
// EditForm.js
'use client';

import { useActionState } from 'react';
import { updateTitle } from './actions.js';

export default function EditForm() {
  const [state, updateTitleAction, isPending] = useActionState(updateTitle, {
    title: 'My draft',
  });

  return (
    <form action={updateTitleAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

<DeepDive>

#### Other ways to control form resets {/*other-ways-to-control-form-resets*/}

The examples above keep every submitted value by storing it before the reset. You can also choose which values survive, or when the reset runs:

* **Keep values only when validation fails.** Return the same state shape from every submission. When validation fails, include the submitted `FormData` and read each field with `state.submitted?.get('title') ?? ''`. When validation succeeds, set that `FormData` to `null` so the reset clears those fields. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values) shows this pattern.

* **Skip the reset with `onSubmit`.** Handle the submission in `onSubmit`, call `e.preventDefault()`, and run the Action inside [`startTransition`](/reference/react/useTransition). Because the form's `action` does not run, React does not reset the form.

* **Reset at a specific moment.** Call the form element's [`reset()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset) method to immediately reset uncontrolled fields to their default values. To schedule a reset as part of an Action or Transition, call [`requestFormReset`](/blog/2024/12/05/react-19#form-actions) from `react-dom` instead.

* **Reset the form and the component state together.** Change the [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key) of the component that renders the form. React recreates the component and its DOM, which resets the fields and any local state.

</DeepDive>

---
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

### Multiple submission types handle செய்தல் {/*handling-multiple-submission-types*/}

<<<<<<< HEAD
User அழுத்தும் button அடிப்படையில் multiple submission actions handle செய்ய forms design செய்யலாம். Form உள்ளே உள்ள ஒவ்வொரு button-யும், `formAction` prop set செய்வதன் மூலம் தனித்த action அல்லது behavior உடன் associate செய்யப்படலாம்.

User குறிப்பிட்ட button tap செய்தால், form submit செய்யப்படும்; அந்த button-ன் attributes மற்றும் action மூலம் define செய்யப்பட்ட corresponding action execute செய்யப்படும். உதாரணமாக, form default ஆக article-ஐ review-க்கு submit செய்யலாம்; ஆனால் article-ஐ draft ஆக save செய்ய `formAction` set செய்யப்பட்ட தனி button வைத்திருக்கலாம்.
=======
A form can have more than one submit button, each running a different Action. A button without `formAction` runs the form's `action`; a button with `formAction` runs its own Action instead. For example, the form below publishes an article by default, but its **Save draft** button stores the current content without publishing it. It uses [`useActionState`](/reference/react/useActionState) to preserve the saved draft:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // Preserve the saved draft after submission
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`Your draft of '${content}' was saved!`);
        return payload.data;
      case 'publish':
        alert(`'${content}' was published!`);
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
<<<<<<< HEAD
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' '${button}' button மூலம் publish செய்யப்பட்டது`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`'${content}' பற்றிய உங்கள் draft save செய்யப்பட்டது!`);
=======
    dispatchFormState({
      type: 'publish',
      data: formData,
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData,
    });
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ''}
      />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Draft save செய்</button>
    </form>
  );
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### My form fields are cleared after submission {/*my-form-fields-are-cleared-after-submission*/}

When a function passed to `action` or `formAction` succeeds, React resets the form's uncontrolled fields to their default values. Text fields without a `defaultValue` become empty. Returning a validation error instead of throwing also triggers this reset.

To keep a submitted value, store it in state and pass it to the field's `defaultValue`. See [Preserving form values after an Action](#preserve-form-values-after-an-action) for examples, or [preserving values when validation fails](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).
