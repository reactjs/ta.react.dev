---
title: useTransition
---

<Intro>

`useTransition` என்பது UI-யின் ஒரு பகுதியை background-இல் render செய்ய அனுமதிக்கும் React Hook ஆகும்.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useTransition()` {/*usetransition*/}

சில state updates-ஐ Transitions ஆகக் குறிக்க, உங்கள் component-ன் top level-இல் `useTransition`-ஐ call செய்யுங்கள்.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[மேலும் எடுத்துக்காட்டுகளை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

`useTransition` எந்த parameters-யையும் ஏற்காது.

#### Returns {/*returns*/}

`useTransition` சரியாக இரண்டு items கொண்ட array ஒன்றை return செய்கிறது:

1. pending Transition ஒன்று உள்ளதா என்பதைச் சொல்வதற்கான `isPending` flag.
2. updates-ஐ Transition ஆகக் குறிக்க அனுமதிக்கும் [`startTransition` function](#starttransition).

---

### `startTransition(action)` {/*starttransition*/}

`useTransition` return செய்யும் `startTransition` function, update ஒன்றை Transition ஆகக் குறிக்க அனுமதிக்கிறது.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### `startTransition`-இல் call செய்யப்படும் functions "Actions" என்று அழைக்கப்படுகின்றன. {/*functions-called-in-starttransition-are-called-actions*/}

`startTransition`-க்கு pass செய்யப்படும் function "Action" என்று அழைக்கப்படுகிறது. convention படி, `startTransition`-க்குள் call செய்யப்படும் எந்த callback-உம் (callback prop போன்றது) `action` எனப் பெயரிடப்பட வேண்டும் அல்லது "Action" suffix-ஐ கொண்டிருக்க வேண்டும்:

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      சமர்ப்பி
    </button>
  );
}

```

</Note>



#### Parameters {/*starttransition-parameters*/}

* `action`: ஒன்று அல்லது அதற்கு மேற்பட்ட [`set` functions](/reference/react/useState#setstate)-ஐ call செய்து சில state-ஐ update செய்யும் function. React `action`-ஐ parameters இல்லாமல் உடனடியாக call செய்து, `action` function call நடக்கும் போது synchronously schedule செய்யப்பட்ட அனைத்து state updates-ஐயும் Transitions ஆகக் குறிக்கும். `action`-இல் awaited செய்யப்படும் async calls Transition-இல் சேர்க்கப்படும்; ஆனால் தற்போது `await`-க்கு பிறகு வரும் எந்த `set` functions-யையும் கூடுதல் `startTransition`-இல் wrap செய்ய வேண்டும் ([Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition) பார்க்கவும்). Transitions ஆகக் குறிக்கப்பட்ட state updates [non-blocking](#perform-non-blocking-updates-with-actions) ஆக இருக்கும், மேலும் [தேவையற்ற loading indicators-ஐக் காட்டாது](#preventing-unwanted-loading-indicators).

#### Returns {/*starttransition-returns*/}

`startTransition` எதையும் return செய்யாது.

#### கவனிக்க வேண்டியவை {/*starttransition-caveats*/}

* `useTransition` ஒரு Hook, எனவே அது components அல்லது custom Hooks-க்குள் மட்டுமே call செய்யப்படலாம். வேறு இடத்தில் Transition ஒன்றைத் தொடங்க வேண்டும் என்றால் (எடுத்துக்காட்டாக, data library-இலிருந்து), அதற்கு பதிலாக standalone [`startTransition`](/reference/react/startTransition)-ஐ call செய்யுங்கள்.

* அந்த state-ன் `set` function-க்கு உங்களிடம் access இருந்தால் மட்டுமே update ஒன்றை Transition-க்குள் wrap செய்ய முடியும். prop அல்லது custom Hook value ஒன்றிற்கு பதிலாக Transition தொடங்க விரும்பினால், அதற்கு பதிலாக [`useDeferredValue`](/reference/react/useDeferredValue)-ஐ முயற்சி செய்யுங்கள்.

* `startTransition`-க்கு நீங்கள் pass செய்யும் function உடனடியாக call செய்யப்படும்; அது execute ஆகும் போது நடக்கும் அனைத்து state updates-ஐயும் Transitions ஆகக் குறிக்கும். எடுத்துக்காட்டாக, `setTimeout`-இல் state updates செய்ய முயன்றால், அவை Transitions ஆகக் குறிக்கப்படாது.

* எந்த async requests-க்கும் பிறகு வரும் state updates-ஐ Transitions ஆகக் குறிக்க, அவற்றை மற்றொரு `startTransition`-இல் wrap செய்ய வேண்டும். இது எதிர்காலத்தில் சரிசெய்யப்படும் அறியப்பட்ட limitation ([Troubleshooting](#react-doesnt-treat-my-state-update-after-await-as-a-transition) பார்க்கவும்).

* `startTransition` function-க்கு stable identity உள்ளது; எனவே Effect dependencies-இலிருந்து அது தவிர்க்கப்பட்டிருப்பதை நீங்கள் அடிக்கடி காணலாம், ஆனால் அதை சேர்ப்பதால் Effect fire ஆகாது. linter errors இல்லாமல் dependency ஒன்றை விட அனுமதித்தால், அதைச் செய்வது பாதுகாப்பானது. [Effect dependencies-ஐ அகற்றுவது பற்றி மேலும் அறியவும்.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Transition ஆகக் குறிக்கப்பட்ட state update, பிற state updates-ஆல் interrupt செய்யப்படும். எடுத்துக்காட்டாக, Transition-க்குள் chart component ஒன்றை update செய்கிறீர்கள்; chart re-render நடுவில் இருக்கும்போது input-இல் type செய்யத் தொடங்கினால், input update-ஐ handle செய்த பிறகு chart component-ன் rendering work-ஐ React மீண்டும் தொடங்கும்.

* text inputs-ஐ control செய்ய Transition updates-ஐப் பயன்படுத்த முடியாது.

* பல ongoing Transitions இருந்தால், React தற்போது அவற்றை ஒன்றாக batch செய்கிறது. இது எதிர்கால release-இல் அகற்றப்படக்கூடிய limitation.

## பயன்பாடு {/*usage*/}

### Actions மூலம் non-blocking updates செய்யுதல் {/*perform-non-blocking-updates-with-actions*/}

Actions உருவாக்கவும் pending state-ஐ access செய்யவும், உங்கள் component-ன் மேல் பகுதியில் `useTransition`-ஐ call செய்யுங்கள்:

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` சரியாக இரண்டு items கொண்ட array ஒன்றை return செய்கிறது:

1. pending Transition ஒன்று உள்ளதா என்பதைச் சொல்வதற்கான <CodeStep step={1}>`isPending` flag</CodeStep>.
2. Action ஒன்றை உருவாக்க அனுமதிக்கும் <CodeStep step={2}>`startTransition` function</CodeStep>.

Transition ஒன்றைத் தொடங்க, `startTransition`-க்கு function ஒன்றை இவ்வாறு pass செய்யுங்கள்:

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

`startTransition`-க்கு pass செய்யப்படும் function "Action" என்று அழைக்கப்படுகிறது. Action-க்குள் state-ஐ update செய்யலாம், மேலும் (விருப்பமாக) side effects-ஐ செய்யலாம்; page-இல் user interactions-ஐ block செய்யாமல் work background-இல் நடைபெறும். ஒரு Transition பல Actions-ஐ கொண்டிருக்கலாம்; Transition நடந்து கொண்டிருக்கும் போது உங்கள் UI responsive ஆகவே இருக்கும். எடுத்துக்காட்டாக, பயனர் ஒரு tab-ஐ click செய்து பின்னர் மனம் மாறி மற்றொரு tab-ஐ click செய்தால், முதல் update முடிவதற்காக காத்திருக்காமல் இரண்டாவது click உடனடியாக handle செய்யப்படும்.

in-progress Transitions பற்றி பயனருக்கு feedback தர, `startTransition` முதல் call-இல் `isPending` state `true` ஆக மாறி, அனைத்து Actions முடிந்து final state பயனருக்கு காட்டப்படும் வரை `true` ஆக இருக்கும். [தேவையற்ற loading indicators-ஐத் தடுக்க](#preventing-unwanted-loading-indicators) Actions-இல் உள்ள side effects வரிசையாக முடிவதை Transitions உறுதி செய்கின்றன; Transition நடந்து கொண்டிருக்கும்போது `useOptimistic` மூலம் உடனடி feedback வழங்கலாம்.

<Recipes titleText="Actions மற்றும் வழக்கமான event handling இடையிலான வேறுபாடு">

#### Action-இல் quantity-ஐ update செய்தல் {/*updating-the-quantity-in-an-action*/}

இந்த எடுத்துக்காட்டில், cart-இல் item-ன் quantity-ஐ update செய்ய server-க்கு அனுப்பும் request-ஐ `updateQuantity` function simulate செய்கிறது. request முடிக்க குறைந்தது ஒரு வினாடி ஆகும் வகையில் இந்த function *artificially slowed down* செய்யப்பட்டுள்ளது.

quantity-ஐ பல முறை வேகமாக update செய்யுங்கள். எந்த requests நடந்து கொண்டிருந்தாலும் pending "Total" state காட்டப்படுகிறது; "Total" final request முடிந்த பிறகே update ஆகிறது என்பதை கவனியுங்கள். update ஒரு Action-இல் இருப்பதால், request நடந்து கொண்டிருக்கும்போதும் "quantity" தொடர்ந்து update செய்யப்படலாம்.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>செக் அவுட்</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">அளவு: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>மொத்தம்:</span>
      <span>
        {isPending ? "🌀 புதுப்பிக்கிறது..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

Actions எப்படி வேலை செய்கின்றன என்பதை காட்டும் அடிப்படை எடுத்துக்காட்டு இது; ஆனால் requests out of order ஆக முடிவதை இந்த எடுத்துக்காட்டு handle செய்யாது. quantity-ஐ பல முறை update செய்யும்போது, பின்னர் அனுப்பிய requests-க்கு பிறகு முந்தைய requests முடிந்து, quantity out of order ஆக update ஆகலாம். இது எதிர்காலத்தில் சரிசெய்யப்படும் அறியப்பட்ட limitation (கீழே உள்ள [Troubleshooting](#my-state-updates-in-transitions-are-out-of-order) பார்க்கவும்).

பொதுவான use cases-க்கு, React இத்தகைய built-in abstractions வழங்குகிறது:
- [`useActionState`](/reference/react/useActionState)
- [`<form>` actions](/reference/react-dom/components/form)
- [Server Functions](/reference/rsc/server-functions)

இந்த solutions request ordering-ஐ உங்களுக்காக handle செய்கின்றன. async state transitions-ஐ manage செய்யும் உங்கள் சொந்த custom hooks அல்லது libraries உருவாக்க Transitions-ஐப் பயன்படுத்தும் போது, request ordering மீது உங்களுக்கு அதிக கட்டுப்பாடு இருக்கும்; ஆனால் அதை நீங்களே handle செய்ய வேண்டும்.

<Solution />

#### Action இல்லாமல் quantity-ஐ update செய்தல் {/*updating-the-users-name-without-an-action*/}

இந்த எடுத்துக்காட்டிலும், cart-இல் item-ன் quantity-ஐ update செய்ய server-க்கு அனுப்பும் request-ஐ `updateQuantity` function simulate செய்கிறது. request முடிக்க குறைந்தது ஒரு வினாடி ஆகும் வகையில் இந்த function *artificially slowed down* செய்யப்பட்டுள்ளது.

quantity-ஐ பல முறை வேகமாக update செய்யுங்கள். எந்த request நடந்து கொண்டிருந்தாலும் pending "Total" state காட்டப்படுகிறது; ஆனால் "quantity" click செய்யப்பட்ட ஒவ்வொரு முறைக்கும் "Total" பல முறை update ஆகிறது என்பதை கவனியுங்கள்:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>செக் அவுட்</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">அளவு: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>மொத்தம்:</span>
      <span>
        {isPending ? "🌀 புதுப்பிக்கிறது..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

இந்த பிரச்சினைக்கான பொதுவான தீர்வு, quantity update ஆகும் போது பயனர் மாற்றங்கள் செய்வதைத் தடுப்பது:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>செக் அவுட்</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">அளவு: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>மொத்தம்:</span>
      <span>
        {isPending ? "🌀 புதுப்பிக்கிறது..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

இந்த solution app மெதுவாக இருப்பது போல உணரச் செய்கிறது; ஏனெனில் பயனர் quantity-ஐ update செய்யும் ஒவ்வொரு முறையும் காத்திருக்க வேண்டும். quantity update ஆகும் போதும் UI-யுடன் பயனர் interact செய்ய அனுமதிக்க, மேலும் complex handling-ஐ கைமுறையாக சேர்க்கலாம்; ஆனால் Actions இந்த நிலையை straight-forward built-in API மூலம் handle செய்கின்றன.

<Solution />

</Recipes>

---

### components-இலிருந்து `action` prop-ஐ expose செய்தல் {/*exposing-action-props-from-components*/}

parent ஒன்று Action-ஐ call செய்ய அனுமதிக்க, component-இலிருந்து `action` prop-ஐ expose செய்யலாம்.

எடுத்துக்காட்டாக, இந்த `TabButton` component அதன் `onClick` logic-ஐ `action` prop-க்குள் wrap செய்கிறது:

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

parent component தனது state-ஐ `action`-க்குள் update செய்வதால், அந்த state update Transition ஆகக் குறிக்கப்படுகிறது. இதனால் "பதிவுகள்"-ஐ click செய்த உடனே "தொடர்பு"-ஐ click செய்யலாம்; அது user interactions-ஐ block செய்யாது:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        பற்றி
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        பதிவுகள் (மெதுவாக)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        தொடர்பு
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>என் profile-க்கு வரவேற்கிறேன்!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[செயற்கையாக மெதுவானது] 500 <SlowPost /> render செய்கிறது');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      பதிவு #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        என்னை online-இல் இங்கே காணலாம்:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<Note>

component-இலிருந்து `action` prop-ஐ expose செய்யும் போது, அதை transition-க்குள் `await` செய்ய வேண்டும்.

இதனால் `action` callback synchronous அல்லது asynchronous எதுவாக இருந்தாலும், action-இல் உள்ள `await`-ஐ wrap செய்ய கூடுதல் `startTransition` தேவைப்படாது.

</Note>

---

### pending visual state ஒன்றைக் காட்டுதல் {/*displaying-a-pending-visual-state*/}

Transition நடந்து கொண்டிருக்கிறது என்பதை பயனருக்கு சுட்டிக்காட்ட, `useTransition` return செய்யும் `isPending` boolean value-ஐப் பயன்படுத்தலாம். எடுத்துக்காட்டாக, tab button-க்கு சிறப்பு "pending" visual state இருக்கலாம்:

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

"பதிவுகள்"-ஐ click செய்வது இப்போது அதிக responsive ஆக உணரப்படுவது, tab button தானே உடனே update ஆகுவதால் என்பதை கவனியுங்கள்:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        பற்றி
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        பதிவுகள் (மெதுவாக)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        தொடர்பு
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>என் profile-க்கு வரவேற்கிறேன்!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[செயற்கையாக மெதுவானது] 500 <SlowPost /> render செய்கிறது');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      பதிவு #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        என்னை online-இல் இங்கே காணலாம்:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### தேவையற்ற loading indicators-ஐத் தடுக்குதல் {/*preventing-unwanted-loading-indicators*/}

இந்த எடுத்துக்காட்டில், `PostsTab` component [use](/reference/react/use) பயன்படுத்தி சில data-ஐ fetch செய்கிறது. "பதிவுகள்" tab-ஐ click செய்தால், `PostsTab` component *suspend* ஆகி, அருகிலுள்ள loading fallback தோன்றும்:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 ஏற்றுகிறது...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        பற்றி
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        பதிவுகள்
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        தொடர்பு
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>என் profile-க்கு வரவேற்கிறேன்!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        என்னை online-இல் இங்கே காணலாம்:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'பதிவு #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

loading indicator காட்ட முழு tab container-ஐ மறைப்பது சீரற்ற user experience-ஐ உருவாக்கும். `TabButton`-க்கு `useTransition` சேர்த்தால், அதற்கு பதிலாக tab button-இலேயே pending state-ஐக் காட்டலாம்.

"பதிவுகள்"-ஐ click செய்வது இனி முழு tab container-ஐ spinner-ஆல் மாற்றுவதில்லை என்பதை கவனியுங்கள்:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 ஏற்றுகிறது...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        பற்றி
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        பதிவுகள்
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        தொடர்பு
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>என் profile-க்கு வரவேற்கிறேன்!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        என்னை online-இல் இங்கே காணலாம்:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'பதிவு #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Suspense உடன் Transitions பயன்படுத்துவது பற்றி மேலும் படிக்கவும்.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transitions, *ஏற்கனவே வெளிப்பட்ட* content (tab container போன்றது) மறைக்கப்படுவதைத் தவிர்க்க வேண்டிய அளவுக்கு மட்டுமே "காத்திருக்கும்". பதிவுகள் tab-க்கு [nested `<Suspense>` boundary](/reference/react/Suspense#revealing-nested-content-as-it-loads) இருந்தால், Transition அதற்காக "காத்திருக்காது".

</Note>

---

### Suspense-enabled router ஒன்றை உருவாக்குதல் {/*building-a-suspense-enabled-router*/}

நீங்கள் React framework அல்லது router ஒன்றை உருவாக்குகிறீர்கள் என்றால், page navigations-ஐ Transitions ஆகக் குறிக்க பரிந்துரைக்கிறோம்.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

இது மூன்று காரணங்களுக்காக பரிந்துரைக்கப்படுகிறது:

- [Transitions interruptible ஆகும்,](#perform-non-blocking-updates-with-actions) எனவே re-render முடியும் வரை காத்திருக்காமல் பயனர் வேறு இடத்தில் click செய்யலாம்.
- [Transitions தேவையற்ற loading indicators-ஐத் தடுக்கின்றன,](#preventing-unwanted-loading-indicators) இதனால் navigation-இல் சீரற்ற jumps தவிர்க்கப்படுகின்றன.
- [Transitions அனைத்து pending actions-க்காக காத்திருக்கின்றன](#perform-non-blocking-updates-with-actions), எனவே புதிய page காட்டப்படுவதற்கு முன் side effects முடிவதற்கு பயனர் காத்திருக்க முடியும்.

navigations-க்கு Transitions பயன்படுத்தும் நேர்மையான router எடுத்துக்காட்டு இதோ.

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        இசை உலாவி
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles artist page-ஐ திற
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles 1960-இல் Liverpool-இல் உருவான ஆங்கில rock band ஆக இருந்தனர்;
    அதில் John Lennon, Paul McCartney, George Harrison
    மற்றும் Ringo Starr இருந்தனர்.`;
}

async function getAlbums() {
async function getAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense-enabled](/reference/react/Suspense) routers இயல்பாகவே navigation updates-ஐ Transitions-க்குள் wrap செய்யும் என்று எதிர்பார்க்கப்படுகிறது.

</Note>

---

### error boundary மூலம் பயனர்களுக்கு error காட்டுதல் {/*displaying-an-error-to-users-with-error-boundary*/}

`startTransition`-க்கு pass செய்யப்பட்ட function error throw செய்தால், [error boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) மூலம் உங்கள் பயனருக்கு error காட்டலாம். error boundary பயன்படுத்த, `useTransition` call செய்யும் component-ஐ error boundary-க்குள் wrap செய்யுங்கள். `startTransition`-க்கு pass செய்யப்பட்ட function error ஆனால், error boundary-க்கான fallback காட்டப்படும்.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️ஏதோ தவறு ஏற்பட்டது</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("எடுத்துக்காட்டு Error: error boundary-ஐ trigger செய்ய throw செய்யப்பட்ட error");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      comment சேர்க்க
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
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
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### Transition-இல் input ஒன்றை update செய்வது வேலை செய்யாது {/*updating-an-input-in-a-transition-doesnt-work*/}

input ஒன்றைக் control செய்யும் state variable-க்கு Transition பயன்படுத்த முடியாது:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use Transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

இதற்குக் காரணம் Transitions non-blocking ஆக இருப்பது; ஆனால் change event-க்கு பதிலாக input update synchronously நடக்க வேண்டும். typing-க்கு பதிலாக Transition run செய்ய விரும்பினால், உங்களுக்கு இரண்டு options உள்ளன:

1. இரண்டு தனி state variables declare செய்யலாம்: ஒன்று input state-க்கு (எப்போதும் synchronously update ஆகும்), மற்றொன்று Transition-இல் update செய்ய. இதனால் synchronous state-ஐப் பயன்படுத்தி input-ஐ control செய்து, input-ஐ விட "lag behind" ஆக இருக்கும் Transition state variable-ஐ உங்கள் மீதமுள்ள rendering logic-க்கு pass செய்யலாம்.
2. மாற்றாக, ஒரு state variable வைத்துக் கொண்டு, உண்மையான value-ஐ விட "lag behind" ஆக இருக்கும் [`useDeferredValue`](/reference/react/useDeferredValue)-ஐ சேர்க்கலாம். புதிய value-யை தானாக "catch up" செய்ய non-blocking re-renders-ஐ அது trigger செய்யும்.

---

### என் state update-ஐ React Transition ஆக நடத்தவில்லை {/*react-doesnt-treat-my-state-update-as-a-transition*/}

state update-ஐ Transition-இல் wrap செய்யும் போது, அது `startTransition` call *நடக்கும் போது* நடக்கிறது என்பதை உறுதி செய்யுங்கள்:

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

`startTransition`-க்கு pass செய்யும் function synchronous ஆக இருக்க வேண்டும். இப்படியாக update ஒன்றை Transition ஆகக் குறிக்க முடியாது:

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

அதற்கு பதிலாக இவ்வாறு செய்யலாம்:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

---

### `await`-க்கு பிறகு வரும் என் state update-ஐ React Transition ஆக நடத்தவில்லை {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

`startTransition` function-க்குள் `await` பயன்படுத்தும்போது, `await`-க்கு பிறகு நடக்கும் state updates Transitions ஆகக் குறிக்கப்படாது. ஒவ்வொரு `await`-க்கு பிறகும் வரும் state updates-ஐ `startTransition` call-க்குள் wrap செய்ய வேண்டும்:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Not using startTransition after await
  setPage('/about');
});
```

ஆனால் இதற்கு பதிலாக இது வேலை செய்யும்:

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

async context-ன் scope-ஐ React இழப்பதால் ஏற்படும் JavaScript limitation இது. எதிர்காலத்தில் [AsyncContext](https://github.com/tc39/proposal-async-context) கிடைக்கும் போது, இந்த limitation அகற்றப்படும்.

---

### component-க்கு வெளியே இருந்து `useTransition` call செய்ய விரும்புகிறேன் {/*i-want-to-call-usetransition-from-outside-a-component*/}

`useTransition` ஒரு Hook என்பதால், component-க்கு வெளியே அதை call செய்ய முடியாது. இந்த நிலையில், அதற்கு பதிலாக standalone [`startTransition`](/reference/react/startTransition) method-ஐப் பயன்படுத்துங்கள். அது அதே முறையில் வேலை செய்கிறது; ஆனால் `isPending` indicator-ஐ வழங்காது.

---

### `startTransition`-க்கு நான் pass செய்யும் function உடனடியாக execute ஆகிறது {/*the-function-i-pass-to-starttransition-executes-immediately*/}

இந்த code-ஐ run செய்தால், அது 1, 2, 3 print செய்யும்:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1, 2, 3 print ஆகுவது எதிர்பார்க்கப்பட்டதே.** `startTransition`-க்கு நீங்கள் pass செய்யும் function delay ஆகாது. browser `setTimeout` போல callback-ஐ பின்னர் run செய்யாது. React உங்கள் function-ஐ உடனடியாக execute செய்கிறது; ஆனால் அது *run ஆகும் போது* schedule செய்யப்பட்ட எந்த state updates-யும் Transitions ஆகக் குறிக்கப்படும். இது இவ்வாறு வேலை செய்கிறது என்று கற்பனை செய்யலாம்:

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```

### Transitions-இல் உள்ள என் state updates out of order ஆகின்றன {/*my-state-updates-in-transitions-are-out-of-order*/}

`startTransition`-க்குள் `await` செய்தால், updates out of order ஆக நடப்பதை நீங்கள் காணலாம்.

இந்த எடுத்துக்காட்டில், cart-இல் item-ன் quantity-ஐ update செய்ய server-க்கு அனுப்பும் request-ஐ `updateQuantity` function simulate செய்கிறது. network requests-க்கான race conditions-ஐ simulate செய்ய, இந்த function *ஒவ்வொரு மாற்று request-யையும் முந்தையதற்குப் பிறகு artificially return செய்கிறது*.

quantity-ஐ ஒருமுறை update செய்து, பின்னர் பல முறை வேகமாக update செய்யுங்கள். தவறான total தெரிந்திருக்கலாம்:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);

  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>செக் அவுட்</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">அளவு: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>மொத்தம்:</span>
      <div>
        <div>
          {isPending
            ? "🌀 புதுப்பிக்கிறது..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `தவறான மொத்தம், எதிர்பார்த்தது: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


பல முறை click செய்யும்போது, முந்தைய requests பின்னர் அனுப்பிய requests-க்கு பிறகு முடிவது சாத்தியம். இது நடந்தால், நோக்கப்பட்ட வரிசை என்ன என்பதை அறிய React-க்கு தற்போது வழி இல்லை. காரணம், updates asynchronously schedule செய்யப்படுகின்றன; async boundary-க்கு அப்பால் வரிசையின் context-ஐ React இழக்கிறது.

இது எதிர்பார்க்கப்பட்டதே; ஏனெனில் Transition-க்குள் உள்ள Actions execution order-ஐ guarantee செய்யாது. பொதுவான use cases-க்கு, ordering-ஐ உங்களுக்காக handle செய்யும் [`useActionState`](/reference/react/useActionState) மற்றும் [`<form>` actions](/reference/react-dom/components/form) போன்ற higher-level abstractions-ஐ React வழங்குகிறது. advanced use cases-க்கு, இதை handle செய்ய உங்கள் சொந்த queuing மற்றும் abort logic-ஐ implement செய்ய வேண்டும்.


execution order-ஐ `useActionState` handle செய்வதற்கான எடுத்துக்காட்டு:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // state-ஐ update செய்ய புதிய quantity-ஐ return செய்யவும்
    },
    1 // initial quantity
  );

  return (
    <div>
      <h1>செக் அவுட்</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">அளவு: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>மொத்தம்:</span>
      <div>
        <div>
          {isPending
            ? "🌀 புதுப்பிக்கிறது..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `தவறான மொத்தம், எதிர்பார்த்தது: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>
