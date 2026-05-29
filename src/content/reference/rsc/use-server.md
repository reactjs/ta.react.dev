---
title: "'use server'"
titleForTitleTag: "'use server' directive"
---

<RSC>

`'use server'` [React Server Components பயன்படுத்தும்போது](/reference/rsc/server-components) பயன்படும்.

</RSC>


<Intro>

Client-side code-இலிருந்து call செய்யக்கூடிய server-side functions-ஐ `'use server'` குறிக்கிறது.

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `'use server'` {/*use-server*/}

ஒரு async function body-யின் மேற்பகுதியில் `'use server'` சேர்த்து, அந்த function client மூலம் call செய்யக்கூடியது என்று குறிக்கலாம். இந்த functions-ஐ நாம் [_Server Functions_](/reference/rsc/server-functions) என்று அழைக்கிறோம்.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Client-இல் Server Function call செய்யும்போது, pass செய்யப்பட்ட arguments-ன் serialized copy-யை கொண்ட network request server-க்கு அனுப்பப்படும். Server Function value return செய்தால், அந்த value serialize செய்யப்பட்டு client-க்கு return செய்யப்படும்.

Functions-ஐ தனித்தனியாக `'use server'` கொண்டு mark செய்வதற்குப் பதிலாக, file-ன் மேற்பகுதியில் directive-ஐச் சேர்த்து, அந்த file-இல் உள்ள அனைத்து exports-ஐயும் client code-இல் import செய்வது உட்பட எங்கும் பயன்படுத்தக்கூடிய Server Functions ஆக mark செய்யலாம்.

#### Caveats {/*caveats*/}
* `'use server'` function அல்லது module-ன் முற்றிலும் தொடக்கத்தில் இருக்க வேண்டும்; imports உட்பட எந்த code-க்கும் மேலாக (directives-க்கு மேலுள்ள comments சரி). இது single அல்லது double quotes-இல் எழுதப்பட வேண்டும்; backticks-இல் அல்ல.
* `'use server'` server-side files-இல் மட்டுமே பயன்படுத்தப்படலாம். உருவாகும் Server Functions props மூலம் Client Components-க்கு pass செய்யப்படலாம். ஆதரிக்கப்படும் [serialization types](#serializable-parameters-and-return-values)-ஐப் பார்க்கவும்.
* [Client code](/reference/rsc/use-client)-இலிருந்து Server Functions import செய்ய, directive module level-இல் பயன்படுத்தப்பட வேண்டும்.
* Underlying network calls எப்போதும் asynchronous என்பதால், `'use server'` async functions-இல் மட்டுமே பயன்படுத்தப்படலாம்.
* Server Functions-க்கு வரும் arguments-ஐ எப்போதும் untrusted input ஆகக் கருதி, mutations-ஐ authorize செய்யுங்கள். [Security considerations](#security)-ஐப் பார்க்கவும்.
* Server Functions [Transition](/reference/react/useTransition)-இல் call செய்யப்பட வேண்டும். [`<form action>`](/reference/react-dom/components/form#props) அல்லது [`formAction`](/reference/react-dom/components/input#props)-க்கு pass செய்யப்பட்ட Server Functions தானாக transition-இல் call செய்யப்படும்.
* Server-side state-ஐ update செய்யும் mutations-க்காக Server Functions வடிவமைக்கப்பட்டவை; data fetching-க்கு அவை பரிந்துரைக்கப்படவில்லை. அதன்படி, Server Functions implement செய்யும் frameworks பொதுவாக ஒரே நேரத்தில் ஒரு action மட்டும் process செய்யும்; return value-ஐ cache செய்ய வழி இருக்காது.

### Security considerations {/*security*/}

Server Functions-க்கு arguments முழுவதும் client-controlled. Security-க்காக, அவற்றை எப்போதும் untrusted input ஆகக் கருதி, arguments-ஐ தேவைக்கேற்ப validate மற்றும் escape செய்வதை உறுதிசெய்யுங்கள்.

எந்த Server Function-இலும், logged-in user அந்த action செய்ய அனுமதிக்கப்பட்டவரா என்பதை validate செய்யுங்கள்.

<Wip>

Server Function-இலிருந்து sensitive data அனுப்பப்படுவதைத் தடுக்க, unique values மற்றும் objects client code-க்கு pass செய்யப்படுவதைத் தடுக்கும் experimental taint APIs உள்ளன.

[experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) மற்றும் [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference)-ஐப் பார்க்கவும்.

</Wip>

### Serializable arguments மற்றும் return values {/*serializable-parameters-and-return-values*/}

Client code Server Function-ஐ network மூலம் call செய்வதால், pass செய்யப்படும் arguments அனைத்தும் serializable ஆக இருக்க வேண்டும்.

Server Function arguments-க்கு ஆதரிக்கப்படும் types:

* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) மூலம் global Symbol registry-இல் register செய்யப்பட்ட symbols மட்டும்
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) மூலம் உருவாக்கப்பட்ட, serializable properties கொண்டவை
* Functions that are Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

குறிப்பாக, இவை support செய்யப்படாது:
* React elements, அல்லது [JSX](/learn/writing-markup-with-jsx)
* Component functions உட்பட Server Function அல்லாத எந்த functions-உம்
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* குறிப்பிடப்பட்ட built-ins தவிர, எந்த class-ன் instances ஆன objects அல்லது [null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects) கொண்ட objects
* Globally register செய்யப்படாத symbols, எ.கா. `Symbol('my new symbol')`
* Event handlers-இலிருந்து வரும் events


ஆதரிக்கப்படும் serializable return values, boundary Client Component-க்கான [serializable props](/reference/rsc/use-client#serializable-types) போலவே இருக்கும்.


## பயன்பாடு {/*usage*/}

### Forms-இல் Server Functions {/*server-functions-in-forms*/}

Server Functions-ன் மிகப் பொதுவான use case, data mutate செய்யும் functions-ஐ call செய்வது. Browser-இல், user mutation submit செய்ய [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) பாரம்பரிய அணுகுமுறை. React Server Components உடன், [forms](/reference/react-dom/components/form)-இல் Server Functions-ஐ Actions ஆக first-class support செய்ய React அறிமுகப்படுத்துகிறது.

User username request செய்ய அனுமதிக்கும் form இங்கே:

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

இந்த உதாரணத்தில் `requestUsername` என்பது `<form>`-க்கு pass செய்யப்பட்ட Server Function. User இந்த form-ஐ submit செய்தால், server function `requestUsername`-க்கு network request அனுப்பப்படும். Form-இல் Server Function call செய்யும்போது, React form-ன் <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep>-வை Server Function-க்கு முதல் argument ஆக வழங்கும்.

Form `action`-க்கு Server Function pass செய்வதன் மூலம், React form-ஐ [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) செய்ய முடியும். அதாவது JavaScript bundle load ஆகும் முன்பே forms submit செய்யப்படலாம்.

#### Forms-இல் return values கையாளுதல் {/*handling-return-values*/}

Username request form-இல், ஒரு username கிடைக்காமல் இருக்கலாம். `requestUsername` அது fail ஆனதா இல்லையா என்பதை எங்களுக்குச் சொல்ல வேண்டும்.

Progressive enhancement-ஐ support செய்யும்போது Server Function result அடிப்படையில் UI-ஐ update செய்ய, [`useActionState`](/reference/react/useActionState)-ஐப் பயன்படுத்துங்கள்.

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

பெரும்பாலான Hooks போல, `useActionState` <CodeStep step={1}>[client code](/reference/rsc/use-client)</CodeStep>-இல் மட்டுமே call செய்யப்பட முடியும் என்பதை கவனியுங்கள்.

### `<form>`-க்கு வெளியே Server Function call செய்தல் {/*calling-a-server-function-outside-of-form*/}

Server Functions exposed server endpoints ஆகும்; client code-இல் எங்கிருந்தும் call செய்யலாம்.

[Form](/reference/react-dom/components/form)-க்கு வெளியே Server Function பயன்படுத்தும்போது, Server Function-ஐ [Transition](/reference/react/useTransition)-இல் call செய்யுங்கள்; இது loading indicator display செய்ய, [optimistic state updates](/reference/react/useOptimistic) காட்ட, மற்றும் எதிர்பாராத errors-ஐ handle செய்ய அனுமதிக்கிறது. Forms Server Functions-ஐ தானாக transitions-இல் wrap செய்யும்.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Server Function return value-ஐ read செய்ய, return செய்யப்பட்ட promise-ஐ `await` செய்ய வேண்டும்.
