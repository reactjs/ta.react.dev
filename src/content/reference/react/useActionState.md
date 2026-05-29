---
title: useActionState
---

<Intro>

`useActionState` என்பது [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions)-ஐ பயன்படுத்தி side effects உடன் state-ஐ update செய்ய உதவும் React Hook ஆகும்.

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## மேற்கோள் {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

ஒரு Action-ன் result-க்கான state create செய்ய, உங்கள் component-ன் top level-இல் `useActionState`-ஐ call செய்யுங்கள்.

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `reducerAction`: Action trigger செய்யப்படும் போது call செய்யப்படும் function. அது call செய்யப்படும் போது, முதல் argument ஆக previous state-ஐ (ஆரம்பத்தில் நீங்கள் provide செய்த `initialState`, அதன் பிறகு அதன் previous return value), அதன் பின் `dispatchAction`-க்கு pass செய்யப்பட்ட `actionPayload`-ஐ பெறும்.
* `initialState`: State ஆரம்பத்தில் இருக்க வேண்டும் என்று நீங்கள் விரும்பும் value. `dispatchAction` முதல் முறையாக invoke செய்யப்பட்ட பிறகு React இந்த argument-ஐ ignore செய்கிறது.
* **optional** `permalink`: இந்த form modify செய்யும் unique page URL-ஐ கொண்ட string.
  * Progressive enhancement உடன் [React Server Components](/reference/rsc/server-components) உள்ள pages-இல் use செய்ய.
  * `reducerAction` ஒரு [Server Function](/reference/rsc/server-functions) ஆக இருந்து, JavaScript bundle load ஆகும் முன் form submit செய்யப்பட்டால், browser current page URL-க்கு பதிலாக குறிப்பிட்ட permalink URL-க்கு navigate செய்யும்.

#### திரும்பும் மதிப்பு {/*returns*/}

`useActionState` சரியாக மூன்று values கொண்ட array-ஐ return செய்கிறது:

1. Current state. முதல் render போது, நீங்கள் pass செய்த `initialState`-க்கு இது match ஆகும். `dispatchAction` invoke செய்யப்பட்ட பிறகு, `reducerAction` return செய்த value-க்கு match ஆகும்.
2. [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions)-க்குள் நீங்கள் call செய்யும் `dispatchAction` function.
3. இந்த Hook-க்காக dispatched Actions ஏதேனும் pending ஆக உள்ளதா என்பதை சொல்லும் `isPending` flag.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `useActionState` ஒரு Hook என்பதால், அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-க்குள் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் அதை call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component-ஐ extract செய்து state-ஐ அதற்குள் நகர்த்துங்கள்.
* `dispatchAction`-க்கு பல calls இருந்தால், React அவற்றை queue செய்து sequential ஆக execute செய்கிறது. `reducerAction`-க்கு ஒவ்வொரு call-உம் previous call-ன் result-ஐ பெறும்.
* `dispatchAction` function stable identity-ஐ கொண்டுள்ளது, எனவே Effect dependencies-இல் அது அடிக்கடி omit செய்யப்பட்டிருப்பதைப் பார்ப்பீர்கள்; ஆனால் அதை include செய்தாலும் Effect fire ஆகாது. Linter ஒரு dependency-ஐ errors இல்லாமல் omit செய்ய அனுமதித்தால், அதைச் செய்வது safe. [Effect dependencies-ஐ remove செய்வது பற்றி மேலும் அறிக.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* `permalink` option-ஐ use செய்யும்போது, destination page-இல் அதே form component render ஆகிறதா என்பதை உறுதி செய்யுங்கள் (அதே `reducerAction` மற்றும் `permalink` உட்பட), அப்படியானால் state-ஐ எப்படி pass செய்ய வேண்டும் என்பதை React அறியும். Page interactive ஆன பிறகு இந்த parameter-க்கு effect இல்லை.
* Server Functions use செய்யும்போது, `initialState` [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values) ஆக இருக்க வேண்டும் (plain objects, arrays, strings, numbers போன்ற values).
* `dispatchAction` error throw செய்தால், React queued actions அனைத்தையும் cancel செய்து, அருகிலுள்ள [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)-ஐ காட்டும்.
* Multiple ongoing Actions இருந்தால், React அவற்றை ஒன்றாக batch செய்கிறது. இது future release-இல் remove செய்யப்படக்கூடிய limitation.

<Note>

`dispatchAction` ஒரு Action-இலிருந்து call செய்யப்பட வேண்டும்.

அதை [`startTransition`](/reference/react/startTransition)-க்குள் wrap செய்யலாம், அல்லது [Action prop](/reference/react/useTransition#exposing-action-props-from-components)-க்கு pass செய்யலாம். அந்த scope-க்கு வெளியே உள்ள calls Transition-ன் பகுதியாகக் கருதப்படாது; development mode-இல் [error log செய்யும்](#async-function-outside-transition).

</Note>

---

### `reducerAction` function {/*reduceraction*/}

`useActionState`-க்கு pass செய்யப்படும் `reducerAction` function previous state-ஐப் பெற்று new state-ஐ return செய்கிறது.

`useReducer`-இல் உள்ள reducers-க்கு மாறாக, `reducerAction` async ஆக இருக்கலாம் மற்றும் side effects செய்யலாம்:

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

நீங்கள் `dispatchAction` call செய்யும் ஒவ்வொரு முறையும், React `actionPayload` உடன் `reducerAction`-ஐ call செய்கிறது. Reducer data post செய்வது போன்ற side effects செய்து, new state-ஐ return செய்யும். `dispatchAction` பல முறை call செய்யப்பட்டால், React அவற்றை queue செய்து order-இல் execute செய்கிறது; எனவே previous call-ன் result current call-க்கு `previousState` ஆக pass செய்யப்படும்.

#### அளவுருக்கள் {/*reduceraction-parameters*/}

* `previousState`: கடைசி state. ஆரம்பத்தில் இது `initialState`-க்கு சமமாக இருக்கும். `dispatchAction`-க்கு முதல் call பிறகு, அது return செய்யப்பட்ட last state-க்கு சமமாக இருக்கும்.

* **optional** `actionPayload`: `dispatchAction`-க்கு pass செய்யப்படும் argument. இது எந்த type value ஆகவும் இருக்கலாம். `useReducer` conventions போல, இது பொதுவாக அதை அடையாளப்படுத்தும் `type` property மற்றும் optional ஆக கூடுதல் information கொண்ட பிற properties உடைய object ஆக இருக்கும்.

#### திரும்பும் மதிப்பு {/*reduceraction-returns*/}

`reducerAction` new state-ஐ return செய்து, அந்த state உடன் re-render செய்ய Transition-ஐ trigger செய்கிறது.

#### கவனிக்க வேண்டியவை {/*reduceraction-caveats*/}

* `reducerAction` sync அல்லது async ஆக இருக்கலாம். Notification காட்டுவது போன்ற sync actions அல்லது server-க்கு updates post செய்வது போன்ற async actions செய்யலாம்.
* `reducerAction` side effects-ஐ அனுமதிக்க வடிவமைக்கப்பட்டிருப்பதால், `<StrictMode>`-இல் `reducerAction` இருமுறை invoke செய்யப்படாது.
* `reducerAction`-ன் return type, `initialState`-ன் type-க்கு match ஆக வேண்டும். TypeScript mismatch infer செய்தால், உங்கள் state type-ஐ explicit ஆக annotate செய்ய வேண்டியிருக்கலாம்.
* `reducerAction`-இல் `await` பிறகு state set செய்தால், தற்போதைக்கு state update-ஐ கூடுதல் `startTransition`-க்குள் wrap செய்ய வேண்டும். மேலும் தகவலுக்கு [startTransition](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) docs-ஐ பார்க்கவும்.
* Server Functions use செய்யும்போது, `actionPayload` [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values) ஆக இருக்க வேண்டும் (plain objects, arrays, strings, numbers போன்ற values).

<DeepDive>

#### இது ஏன் `reducerAction` என்று அழைக்கப்படுகிறது? {/*why-is-it-called-reduceraction*/}

`useActionState`-க்கு pass செய்யப்படும் function *reducer action* என்று அழைக்கப்படுகிறது, ஏனெனில்:

- அது `useReducer` போல previous state-ஐ new state ஆக *reduce* செய்கிறது.
- அது Transition-க்குள் call செய்யப்படுகிறது மற்றும் side effects செய்ய முடியும் என்பதால் அது ஒரு *Action*.

கருத்து ரீதியாக, `useActionState` என்பது `useReducer` போலவே, ஆனால் reducer-இல் side effects செய்ய முடியும்.

</DeepDive>

---

## பயன்பாடு {/*usage*/}

### Action-க்கு state சேர்த்தல் {/*adding-state-to-an-action*/}

Action-ன் result-க்கான state create செய்ய, உங்கள் component-ன் top level-இல் `useActionState`-ஐ call செய்யுங்கள்.

```js [[1, 7, "count"], [2, 7, "dispatchAction"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);

  // ...
}
```

`useActionState` சரியாக மூன்று items கொண்ட array-ஐ return செய்கிறது:

1. நீங்கள் provide செய்த initial state-க்கு ஆரம்பத்தில் set செய்யப்பட்ட <CodeStep step={1}>current state</CodeStep>.
2. `reducerAction`-ஐ trigger செய்ய அனுமதிக்கும் <CodeStep step={2}>action dispatcher</CodeStep>.
3. Action in progress ஆக உள்ளதா என்பதைச் சொல்லும் <CodeStep step={3}>pending state</CodeStep>.

`addToCartAction`-ஐ call செய்ய, <CodeStep step={2}>action dispatcher</CodeStep>-ஐ call செய்யுங்கள். React previous count உடன் `addToCartAction` calls-ஐ queue செய்யும்.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <span>அளவு: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>டிக்கெட் சேர்{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row button {
  margin-left: auto;
  min-width: 150px;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

"டிக்கெட் சேர்" click செய்யும் ஒவ்வொரு முறையும், React `addToCartAction`-க்கு ஒரு call-ஐ queue செய்கிறது. எல்லா tickets சேர்க்கப்படும் வரை React pending state-ஐ காட்டி, பிறகு final state உடன் re-render செய்கிறது.

<DeepDive>

#### `useActionState` queuing எப்படி வேலை செய்கிறது {/*how-useactionstate-queuing-works*/}

"டிக்கெட் சேர்" பல முறை click செய்து பாருங்கள். ஒவ்வொரு click-க்கும் புதிய `addToCartAction` queue செய்யப்படும். Artificial 1 second delay இருப்பதால், 4 clicks complete ஆக ~4 seconds எடுக்கும்.

**இது `useActionState` design-இல் நினைத்தே செய்யப்பட்ட ஒன்று.**

`prevCount`-ஐ `addToCartAction`-ன் அடுத்த call-க்கு pass செய்ய, `addToCartAction`-ன் previous result-ஐ காத்திருக்க வேண்டும். அதாவது அடுத்த Action-ஐ call செய்வதற்கு முன் previous Action முடிவதற்காக React காத்திருக்க வேண்டும்.

பொதுவாக இதை [useOptimistic உடன் பயன்படுத்துவதன் மூலம்](/reference/react/useActionState#using-with-useoptimistic) தீர்க்கலாம்; ஆனால் மேலும் complex cases-க்கு [queued actions-ஐ cancel செய்தல்](#cancelling-queued-actions) அல்லது `useActionState` use செய்யாதது பற்றி யோசிக்கலாம்.

</DeepDive>

---

### பல Action types பயன்படுத்துதல் {/*using-multiple-action-types*/}

பல types handle செய்ய, `dispatchAction`-க்கு argument pass செய்யலாம்.

Convention ஆக, இதை switch statement ஆக எழுதுவது common. Switch-இல் ஒவ்வொரு case-க்கும் சில next state-ஐ calculate செய்து return செய்யுங்கள். Argument எந்த shape-ஆகவும் இருக்கலாம், ஆனால் action-ஐ identify செய்யும் `type` property உடைய objects pass செய்வது common.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      {isPending ? '🌀 Update செய்கிறது...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Quantity-ஐ increase அல்லது decrease செய்ய click செய்தால், `"ADD"` அல்லது `"REMOVE"` dispatch செய்யப்படும். `reducerAction`-இல், quantity-ஐ update செய்ய வேறு APIs call செய்யப்படுகின்றன.

இந்த example-இல், quantity மற்றும் total இரண்டையும் replace செய்ய Actions-ன் pending state-ஐ use செய்கிறோம். Quantity-ஐ உடனே update செய்வது போன்ற immediate feedback provide செய்ய விரும்பினால், `useOptimistic` use செய்யலாம்.

<DeepDive>

#### `useActionState` எப்படி `useReducer`-இலிருந்து வேறுபடுகிறது? {/*useactionstate-vs-usereducer*/}

இந்த example `useReducer` போல இருப்பதை நீங்கள் கவனிக்கலாம், ஆனால் அவை வேறு purposes-க்கு பயன்படுகின்றன:

- உங்கள் UI-ன் state manage செய்ய **`useReducer`-ஐ use செய்யுங்கள்**. Reducer pure ஆக இருக்க வேண்டும்.

- உங்கள் Actions-ன் state manage செய்ய **`useActionState`-ஐ use செய்யுங்கள்**. Reducer side effects செய்ய முடியும்.

User Actions-இலிருந்து வரும் side effects-க்கான `useReducer` போல `useActionState`-ஐ நினைக்கலாம். Previous Action அடிப்படையில் அடுத்த Action-ஐ compute செய்வதால், அது [calls-ஐ sequential ஆக order செய்ய](/reference/react/useActionState#how-useactionstate-queuing-works) வேண்டும். Actions-ஐ parallel ஆக perform செய்ய விரும்பினால், `useState` மற்றும் `useTransition`-ஐ நேரடியாக use செய்யுங்கள்.

</DeepDive>

---

### `useOptimistic` உடன் பயன்படுத்துதல் {/*using-with-useoptimistic*/}

Immediate UI feedback காட்ட, `useActionState`-ஐ [`useOptimistic`](/reference/react/useOptimistic)-உடன் combine செய்யலாம்:


<Sandpack>

```js src/App.js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      <span>{isPending ? '🌀 Update செய்கிறது...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


`setOptimisticCount` quantity-ஐ உடனே update செய்கிறது, மேலும் `dispatchAction()` `updateCartAction`-ஐ queue செய்கிறது. பயனரின் update இன்னும் apply ஆகிக்கொண்டிருக்கிறது என்ற feedback தர quantity மற்றும் total இரண்டிலும் pending indicator தோன்றும்.

---


### Action props உடன் பயன்படுத்துதல் {/*using-with-action-props*/}

[Action prop](/reference/react/useTransition#exposing-action-props-from-components)-ஐ expose செய்யும் component-க்கு `dispatchAction` function-ஐ pass செய்தால், `startTransition` அல்லது `useOptimistic`-ஐ நீங்களே call செய்ய வேண்டியதில்லை.

இந்த example, QuantityStepper component-ன் `increaseAction` மற்றும் `decreaseAction` props-ஐ use செய்வதை காட்டுகிறது:

<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function addAction() {
    dispatchAction({type: 'ADD'});
  }

  function removeAction() {
    dispatchAction({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      {isPending ? '🌀 Update செய்கிறது...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

`<QuantityStepper>` transitions, pending state, மற்றும் count-ஐ optimistically update செய்வதற்கான built-in support கொண்டதால், Action-க்கு _எதை_ change செய்ய வேண்டும் என்பதை மட்டும் சொல்ல வேண்டும்; அதை _எப்படி_ change செய்வது உங்கள் சார்பாக handle செய்யப்படும்.

---

### Queued Actions-ஐ cancel செய்தல் {/*cancelling-queued-actions*/}

Pending Actions-ஐ cancel செய்ய `AbortController` use செய்யலாம்:

<Sandpack>

```js src/App.js
import { useActionState, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
          <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      {isPending ? '🌀 Update செய்கிறது...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = 'AbortError';
  constructor(message = 'செயல்பாடு abort செய்யப்பட்டது') {
    super(message);
  }
}

function sleep(ms, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

Increase அல்லது decrease பல முறை click செய்து பாருங்கள்; நீங்கள் எத்தனை முறை click செய்தாலும் total 1 second-க்குள் update ஆகிறது என்பதை கவனிக்கவும். இது வேலை செய்வது, previous Action-ஐ "complete" செய்ய `AbortController` use செய்வதால்; அப்படிச் செய்தால் next Action proceed செய்ய முடியும்.

<Pitfall>

ஒரு Action-ஐ abort செய்வது எப்போதும் safe அல்ல.

உதாரணமாக, Action ஒரு mutation செய்தால் (database-க்கு write செய்வது போன்றது), network request-ஐ abort செய்வது server-side change-ஐ undo செய்யாது. அதனால்தான் `useActionState` default ஆக abort செய்யாது. Side effect-ஐ safely ignore செய்யவோ retry செய்யவோ முடியும் என்று உங்களுக்கு தெரிந்தால் மட்டுமே இது safe.

</Pitfall>

---

### `<form>` Action props உடன் பயன்படுத்துதல் {/*use-with-a-form*/}

`dispatchAction` function-ஐ `<form>`-க்கு `action` prop ஆக pass செய்யலாம்.

இவ்வாறு use செய்தால், React submission-ஐ automatic ஆக Transition-க்குள் wrap செய்கிறது; எனவே `startTransition`-ஐ நீங்களே call செய்ய வேண்டியதில்லை. `reducerAction` previous state மற்றும் submitted `FormData`-வை பெறும்:

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}

async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      {isPending ? '🌀 Update செய்கிறது...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

இந்த example-இல், பயனர் stepper arrows-ஐ click செய்தால், button form-ஐ submit செய்கிறது மற்றும் `useActionState` form data உடன் `updateCartAction`-ஐ call செய்கிறது. Server update-ஐ confirm செய்யும் போது புதிய quantity-ஐ உடனே காட்ட இந்த example `useOptimistic`-ஐ use செய்கிறது.

<RSC>

[Server Function](/reference/rsc/server-functions) உடன் use செய்தால், hydration (React server-rendered HTML-க்கு attach ஆகும் நேரம்) complete ஆகும் முன் server-ன் response-ஐ காட்ட `useActionState` அனுமதிக்கிறது. Dynamic content உள்ள pages-இல் progressive enhancement-க்காக (JavaScript load ஆகும் முன் form வேலை செய்ய அனுமதிக்க) optional `permalink` parameter-ஐயும் use செய்யலாம். பொதுவாக இதை உங்கள் framework உங்கள் சார்பாக handle செய்யும்.

</RSC>

Forms உடன் Actions use செய்வது பற்றிய கூடுதல் தகவலுக்கு [`<form>`](/reference/react-dom/components/form#handle-form-submission-with-a-server-function) docs-ஐ பார்க்கவும்.

---

### Errors-ஐ handle செய்தல் {/*handling-errors*/}

`useActionState` உடன் errors handle செய்ய இரண்டு வழிகள் உள்ளன.

உங்கள் backend-இலிருந்து வரும் "quantity not available" போன்ற known validation errors-க்கு, அதை உங்கள் `reducerAction` state-ன் பகுதியாக return செய்து UI-இல் display செய்யலாம்.

`undefined is not a function` போன்ற unknown errors-க்கு, error throw செய்யலாம். React queued Actions அனைத்தையும் cancel செய்து, `useActionState` hook-இலிருந்து error-ஐ rethrow செய்வதன் மூலம் அருகிலுள்ள [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)-ஐ காட்டும்.

<Sandpack>

```js src/App.js
import {useActionState, startTransition} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {addToCart} from './api';
import Total from './Total';

function Checkout() {
  const [state, dispatchAction, isPending] = useActionState(
    async (prevState, quantity) => {
      const result = await addToCart(prevState.count, quantity);
      if (result.error) {
        // Return the error from the API as state
        return {...prevState, error: `${quantity} அளவை சேர்க்க முடியவில்லை: ${result.error}`};
      }

      if (!isPending) {
        // Clear the error state for the first dispatch.
        return {count: result.count, error: null};
      }

      // Return the new count, and any errors that happened.
      return {count: result.count, error: prevState.error};


    },
    {
      count: 0,
      error: null,
    }
  );

  function handleAdd(quantity) {
    startTransition(() => {
      dispatchAction(quantity);
    });
  }

  return (
    <div className="checkout">
      <h2>செக் அவுட்</h2>
      <div className="row">
        <span>Eras Tour டிக்கெட்டுகள்</span>
        <span>
          {isPending && '🌀 '}அளவு: {state.count}
        </span>
      </div>
      <div className="buttons">
        <button onClick={() => handleAdd(1)}>1 சேர்</button>
        <button onClick={() => handleAdd(10)}>10 சேர்</button>
        <button onClick={() => handleAdd(NaN)}>NaN சேர்</button>
      </div>
      {state.error && <div className="error">{state.error}</div>}
      <hr />
      <Total quantity={state.count} isPending={isPending} />
    </div>
  );
}



export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => (
        <div className="checkout">
          <h2>ஏதோ தவறு ஏற்பட்டது</h2>
          <p>Action-ஐ complete செய்ய முடியவில்லை.</p>
          <button onClick={resetErrorBoundary}>மீண்டும் முயற்சி செய்</button>
        </div>
      )}>
      <Checkout />
    </ErrorBoundary>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>மொத்தம்</span>
      <span>
        {isPending ? '🌀 Update செய்கிறது...' : formatter.format(quantity * 9999)}
      </span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count, quantity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (quantity > 5) {
    return {error: 'அளவு available இல்லை'};
  } else if (isNaN(quantity)) {
    throw new Error('அளவு number ஆக இருக்க வேண்டும்');
  }
  return {count: count + quantity};
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
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

இந்த example-இல், "10 சேர்" validation error return செய்யும் API-ஐ simulate செய்கிறது; அதை `updateCartAction` state-இல் store செய்து inline ஆக display செய்கிறது. "NaN சேர்" invalid count-க்கு வழிவகுக்கும், எனவே `updateCartAction` throw செய்கிறது; அது `useActionState` வழியாக `ErrorBoundary`-க்கு propagate ஆகி reset UI-ஐ காட்டுகிறது.


---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### என் `isPending` flag update ஆகவில்லை {/*ispending-not-updating*/}

நீங்கள் `dispatchAction`-ஐ manually call செய்கிறீர்கள் என்றால் (Action prop வழியாக அல்ல), call-ஐ [`startTransition`](/reference/react/startTransition)-க்குள் wrap செய்துள்ளீர்களா என்பதை உறுதி செய்யுங்கள்:

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

`dispatchAction` Action prop-க்கு pass செய்யப்பட்டால், React அதை automatic ஆக Transition-க்குள் wrap செய்கிறது.

---

### என் Action form data-வை read செய்ய முடியவில்லை {/*action-cannot-read-form-data*/}

நீங்கள் `useActionState` use செய்யும்போது, `reducerAction` தனது first argument ஆக ஒரு extra argument பெறுகிறது: previous அல்லது initial state. அதனால் submitted form data அதன் first argument-க்கு பதிலாக second argument ஆக இருக்கும்.

```js {2,7}
// Without useActionState
function action(formData) {
  const name = formData.get('name');
}

// With useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### என் actions skip செய்யப்படுகின்றன {/*actions-skipped*/}

நீங்கள் `dispatchAction`-ஐ பல முறை call செய்து, அவற்றில் சில run ஆகவில்லை என்றால், முந்தைய `dispatchAction` call ஒன்று error throw செய்ததாலாக இருக்கலாம்.

`reducerAction` throw செய்தால், அதன் பிறகு queue செய்யப்பட்ட எல்லா `dispatchAction` calls-ஐயும் React skip செய்கிறது.

இதை handle செய்ய, உங்கள் `reducerAction`-க்குள் errors-ஐ catch செய்து, throw செய்வதற்கு பதிலாக error state return செய்யுங்கள்:

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Return error state instead of throwing
    return { success: false, error: error.message };
  }
}
```

---

### என் state reset ஆகவில்லை {/*reset-state*/}

`useActionState` built-in reset function provide செய்யாது. State-ஐ reset செய்ய, reset signal-ஐ handle செய்யும் வகையில் உங்கள் `reducerAction`-ஐ design செய்யலாம்:

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // Handle reset
  if (payload === null) {
    return initialState;
  }
  // Normal action logic
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      dispatchAction(null); // reset trigger செய்ய null pass செய்க
    });
  }

  // ...
}
```

மாற்றாக, fresh state உடன் remount ஆக force செய்ய `useActionState` use செய்யும் component-க்கு `key` prop சேர்க்கலாம், அல்லது submission பிறகு automatic ஆக reset ஆகும் `<form>` `action` prop-ஐ use செய்யலாம்.

---

### எனக்கு error வருகிறது: "An async function with useActionState was called outside of a transition." {/*async-function-outside-transition*/}

Common mistake என்பது Transition-க்குள் இருந்து `dispatchAction` call செய்ய மறப்பது:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.

</ConsoleLogLine>
</ConsoleBlockMulti>


`dispatchAction` Transition-க்குள் run ஆக வேண்டும் என்பதால் இந்த error நடக்கிறது:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ❌ Wrong: calling dispatchAction outside a Transition
    dispatchAction();
  }

  // ...
}
```

Fix செய்ய, call-ஐ [`startTransition`](/reference/react/startTransition)-க்குள் wrap செய்யுங்கள்:

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

அல்லது `dispatchAction`-ஐ Action prop-க்கு pass செய்யுங்கள்; அது Transition-க்குள் call செய்யப்படும்:

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  // ✅ Correct: action prop wraps in a Transition for you
  return <Button action={dispatchAction}>...</Button>;
}
```

---

### எனக்கு error வருகிறது: "Cannot update action state while rendering" {/*cannot-update-during-render*/}

Render நடக்கும் போது `dispatchAction` call செய்ய முடியாது:

<ConsoleBlock level="error">

Cannot update action state while rendering.

</ConsoleBlock>

இது infinite loop ஏற்படுத்தும்; ஏனெனில் `dispatchAction` call செய்வது state update-ஐ schedule செய்கிறது, அது re-render-ஐ trigger செய்கிறது, அது மீண்டும் `dispatchAction` call செய்கிறது.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  // ❌ Wrong: calling dispatchAction during render
  dispatchAction();

  // ...
}
```

Fix செய்ய, user events-க்கு response ஆக மட்டுமே `dispatchAction` call செய்யுங்கள் (form submissions அல்லது button clicks போன்றவை).
