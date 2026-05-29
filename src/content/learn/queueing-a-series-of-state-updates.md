---
title: State Updates தொடர் ஒன்றை Queue செய்தல்
---

<Intro>

State variable set செய்வது மற்றொரு render-ஐ queue செய்யும். ஆனால் சில நேரங்களில், அடுத்த render-ஐ queue செய்வதற்கு முன் value மீது பல operations செய்ய விரும்பலாம். இதைச் செய்ய, React state updates-ஐ எப்படி batch செய்கிறது என்பதைப் புரிந்துகொள்வது உதவும்.

</Intro>

<YouWillLearn>

* "Batching" என்றால் என்ன, பல state updates process செய்ய React அதை எப்படி பயன்படுத்துகிறது
* ஒரே state variable-க்கு பல updates-ஐ தொடர்ச்சியாக apply செய்வது எப்படி

</YouWillLearn>

## React state updates-ஐ batch செய்கிறது {/*react-batches-state-updates*/}

`setNumber(number + 1)`-ஐ மூன்று முறை call செய்வதால், "+3" button click செய்தால் counter மூன்று முறை increment ஆகும் என்று நீங்கள் எதிர்பார்க்கலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

ஆனால் முந்தைய section-இல் பார்த்தபடி, [ஒவ்வொரு render-ன் state values fixed ஆக இருக்கும்](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time). ஆகவே முதல் render-ன் event handler-க்குள் `number` value எத்தனை முறை `setNumber(1)` call செய்தாலும் எப்போதும் `0` தான்:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

ஆனால் இங்கே இன்னொரு factor செயல்படுகிறது. **உங்கள் state updates process செய்வதற்கு முன் event handlers-இல் உள்ள *அனைத்து* code-மும் run ஆகும் வரை React காத்திருக்கும்.** அதனால் தான் இந்த `setNumber()` calls அனைத்திற்குப் பிறகே re-render நடக்கிறது.

இது restaurant-இல் order எடுக்கும் waiter-ஐ நினைவூட்டலாம். உங்கள் முதல் dish சொன்னவுடனே waiter kitchen-க்கு ஓடமாட்டார்! அதற்கு பதிலாக, நீங்கள் order முடிக்க, அதை மாற்ற, அதே table-இல் உள்ள மற்றவர்களிடமிருந்தும் orders எடுக்க காத்திருப்பார்.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Restaurant-இல் elegant cursor, React உடன் பல முறை order செய்கிறது; waiter பாத்திரத்தில் React உள்ளது. அவள் setState() பல முறை call செய்த பிறகு, waiter அவள் இறுதி order ஆக கேட்ட கடைசியை எழுதிக்கொள்கிறார்." />

இதனால் பல state variables-ஐ, பல components-இலிருந்தும் கூட, அதிகமான [re-renders](/learn/render-and-commit#re-renders-when-state-updates) trigger செய்யாமல் update செய்யலாம். ஆனால் இதன் அர்த்தம், உங்கள் event handler மற்றும் அதில் உள்ள code அனைத்தும் முடியும் வரை UI update ஆகாது என்பதும். **Batching** என்று அழைக்கப்படும் இந்த behavior, உங்கள் React app-ஐ மிகவும் வேகமாக run செய்யும். சில variables மட்டும் update ஆன "half-finished" renders போன்ற confusing நிலைகளை கையாள வேண்டியதையும் இது தவிர்க்கிறது.

**Clicks போன்ற *பல* intentional events முழுவதும் React batch செய்யாது**; ஒவ்வொரு click தனியாக handle செய்யப்படும். பொதுவாக safe ஆனபோது மட்டுமே React batching செய்கிறது என்று நம்பலாம். உதாரணமாக, முதல் button click form-ஐ disable செய்தால், இரண்டாவது click அதை மீண்டும் submit செய்யாது என்பதை இது உறுதிசெய்கிறது.

## அடுத்த render-க்கு முன் அதே state-ஐ பல முறை update செய்தல் {/*updating-the-same-state-multiple-times-before-the-next-render*/}

இது uncommon use case; ஆனால் அடுத்த render-க்கு முன் அதே state variable-ஐ பல முறை update செய்ய விரும்பினால், `setNumber(number + 1)` போன்ற *next state value* pass செய்வதற்கு பதிலாக, queue-இல் முந்தைய value அடிப்படையில் next state-ஐ கணக்கிடும் *function* pass செய்யலாம், உதாரணமாக `setNumber(n => n + 1)`. இது state value-ஐ replace செய்வதற்கு பதிலாக "state value மீது ஏதாவது செய்" என்று React-க்கு சொல்லும் வழி.

இப்போது counter-ஐ increment செய்து பாருங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

இங்கே, `n => n + 1` ஒரு **updater function** என்று அழைக்கப்படுகிறது. அதை state setter-க்கு pass செய்தால்:

1. Event handler-இல் உள்ள மற்ற code அனைத்தும் run ஆன பிறகு process செய்ய React இந்த function-ஐ queue செய்கிறது.
2. அடுத்த render போது, React queue-ஐ கடந்து சென்று final updated state-ஐ உங்களுக்கு தருகிறது.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Event handler execute செய்யும் போது React இந்த lines of code-ஐ எப்படி process செய்கிறது:

1. `setNumber(n => n + 1)`: `n => n + 1` ஒரு function. React அதை queue-க்கு add செய்கிறது.
1. `setNumber(n => n + 1)`: `n => n + 1` ஒரு function. React அதை queue-க்கு add செய்கிறது.
1. `setNumber(n => n + 1)`: `n => n + 1` ஒரு function. React அதை queue-க்கு add செய்கிறது.

அடுத்த render போது `useState` call செய்யும்போது, React queue-ஐ process செய்கிறது. முந்தைய `number` state `0`; ஆகவே முதல் updater function-க்கு `n` argument ஆக React அதையே pass செய்கிறது. பின்னர் உங்கள் முந்தைய updater function-ன் return value-ஐ அடுத்த updater-க்கு `n` ஆக pass செய்கிறது; இவ்வாறு தொடர்கிறது:

| queued update | `n` | returns |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React `3`-ஐ final result ஆக store செய்து, அதை `useState`-இலிருந்து return செய்கிறது.

அதனால் தான் மேலுள்ள example-இல் "+3" click செய்தால் value சரியாக 3 அளவுக்கு increment ஆகிறது.

### State replace செய்த பிறகு update செய்தால் என்ன நடக்கும் {/*what-happens-if-you-update-state-after-replacing-it*/}

இந்த event handler பற்றி என்ன? அடுத்த render-இல் `number` என்னாக இருக்கும் என்று நினைக்கிறீர்கள்?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Number-ஐ அதிகரிக்கவும்</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

இந்த event handler React-க்கு செய்யச் சொல்வது:

1. `setNumber(number + 5)`: `number` `0`, ஆகவே `setNumber(0 + 5)`. React அதன் queue-க்கு *"`5` ஆக replace செய்"* என்பதைக் add செய்கிறது.
2. `setNumber(n => n + 1)`: `n => n + 1` ஒரு updater function. React *அந்த function*-ஐ அதன் queue-க்கு add செய்கிறது.

அடுத்த render போது, React state queue-ஐ process செய்கிறது:

| queued update | `n` | returns |
|--------------|---------|-----|
| "`5` ஆக replace செய்" | `0` (பயன்படுத்தப்படாது) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React `6`-ஐ final result ஆக store செய்து, அதை `useState`-இலிருந்து return செய்கிறது.

<Note>

`setState(5)` உண்மையில் `setState(n => 5)` போலவே வேலை செய்கிறது; ஆனால் `n` பயன்படுத்தப்படாது என்பதை நீங்கள் கவனித்திருக்கலாம்!

</Note>

### State update செய்த பிறகு replace செய்தால் என்ன நடக்கும் {/*what-happens-if-you-replace-state-after-updating-it*/}

இன்னொரு example முயற்சிப்போம். அடுத்த render-இல் `number` என்னாக இருக்கும் என்று நினைக்கிறீர்கள்?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Number-ஐ அதிகரிக்கவும்</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

இந்த event handler execute செய்யும் போது React இந்த lines of code-ஐ process செய்வது:

1. `setNumber(number + 5)`: `number` `0`, ஆகவே `setNumber(0 + 5)`. React அதன் queue-க்கு *"`5` ஆக replace செய்"* என்பதைக் add செய்கிறது.
2. `setNumber(n => n + 1)`: `n => n + 1` ஒரு updater function. React *அந்த function*-ஐ அதன் queue-க்கு add செய்கிறது.
3. `setNumber(42)`: React அதன் queue-க்கு *"`42` ஆக replace செய்"* என்பதைக் add செய்கிறது.

அடுத்த render போது, React state queue-ஐ process செய்கிறது:

| queued update | `n` | returns |
|--------------|---------|-----|
| "`5` ஆக replace செய்" | `0` (பயன்படுத்தப்படாது) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "`42` ஆக replace செய்" | `6` (பயன்படுத்தப்படாது) | `42` |

பின்னர் React `42`-ஐ final result ஆக store செய்து, அதை `useState`-இலிருந்து return செய்கிறது.

சுருக்கமாக, `setNumber` state setter-க்கு நீங்கள் pass செய்வதை இவ்வாறு சிந்திக்கலாம்:

* **Updater function** (எ.கா. `n => n + 1`) queue-க்கு add செய்யப்படும்.
* **வேறு எந்த value-யும்** (எ.கா. number `5`) ஏற்கனவே queued ஆனதை ignore செய்து "`5` ஆக replace செய்" என்பதைக் queue-க்கு add செய்கிறது.

Event handler முடிந்த பிறகு, React re-render trigger செய்யும். Re-render போது, React queue-ஐ process செய்யும். Updater functions rendering போது run ஆகின்றன; ஆகவே **updater functions [pure](/learn/keeping-components-pure) ஆக இருக்க வேண்டும்** மற்றும் result-ஐ மட்டும் *return* செய்ய வேண்டும். அவற்றுக்குள் state set செய்யவோ மற்ற side effects run செய்யவோ முயற்சிக்க வேண்டாம். Strict Mode-இல், பிழைகளை கண்டுபிடிக்க உதவ React ஒவ்வொரு updater function-ஐயும் இரண்டு முறை run செய்யும் (ஆனால் இரண்டாவது result-ஐ discard செய்யும்).

### Naming conventions {/*naming-conventions*/}

Updater function argument-ஐ தொடர்புடைய state variable-ன் முதல் எழுத்துகளால் name செய்வது பொதுவானது:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

மேலும் verbose code விரும்பினால், `setEnabled(enabled => !enabled)` போல முழு state variable name-ஐ repeat செய்வது அல்லது `setEnabled(prevEnabled => !prevEnabled)` போல prefix பயன்படுத்துவது மற்றொரு common convention.

<Recap>

* State set செய்வது existing render-இல் variable-ஐ மாற்றாது; அது புதிய render ஒன்றை request செய்கிறது.
* Event handlers run ஆகி முடிந்த பிறகு React state updates-ஐ process செய்கிறது. இதுவே batching என்று அழைக்கப்படுகிறது.
* ஒரே event-இல் ஒரு state-ஐ பல முறை update செய்ய, `setNumber(n => n + 1)` updater function பயன்படுத்தலாம்.

</Recap>



<Challenges>

#### Request counter-ஐ சரிசெய்யுங்கள் {/*fix-a-request-counter*/}

User ஒரே நேரத்தில் art item-க்கு பல orders submit செய்ய உதவும் art marketplace app-இல் நீங்கள் வேலை செய்கிறீர்கள். User "Buy" button அழுத்தும் ஒவ்வொரு முறையும், "Pending" counter ஒன்று அதிகரிக்க வேண்டும். மூன்று seconds பிறகு, "Pending" counter குறைய வேண்டும்; "Completed" counter அதிகரிக்க வேண்டும்.

ஆனால் "Pending" counter intended போல நடக்கவில்லை. "Buy" அழுத்தும்போது, அது `-1` ஆக குறைகிறது (இது சாத்தியமாக இருக்கக்கூடாது!). நீங்கள் வேகமாக இரண்டு முறை click செய்தால், இரண்டு counters-உம் unpredictable ஆக நடக்கிறது போல தெரிகிறது.

இது ஏன் நடக்கிறது? இரண்டு counters-யையும் சரிசெய்யுங்கள்.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        வாங்கு
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

`handleClick` event handler-க்குள், `pending` மற்றும் `completed` values click event நடந்த நேரத்தில் இருந்த values-ஐச் சார்ந்துள்ளன. முதல் render-க்கு, `pending` `0`; ஆகவே `setPending(pending - 1)` `setPending(-1)` ஆகிறது, அது தவறு. Click நேரத்தில் தீர்மானிக்கப்பட்ட concrete value-க்கு set செய்வதற்குப் பதிலாக counters-ஐ *increment* அல்லது *decrement* செய்ய விரும்புகிறீர்கள் என்பதால், updater functions pass செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        வாங்கு
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

இதனால் counter-ஐ increment அல்லது decrement செய்யும்போது, click நேரத்தில் state இருந்ததை விட அதன் *latest* state-ஐ சார்ந்து செய்வதை உறுதிசெய்கிறது.

</Solution>

#### State queue-ஐ நீங்களே implement செய்யுங்கள் {/*implement-the-state-queue-yourself*/}

இந்த challenge-இல், React-ன் மிகச் சிறிய பகுதியை scratch-இலிருந்து நீங்கள் மீண்டும் implement செய்வீர்கள்! கேட்பதுபோல் இது கடினமில்லை.

Sandbox preview-ஐ scroll செய்து பாருங்கள். அது **நான்கு test cases** காட்டுகிறது என்பதை கவனிக்கவும். அவை இந்த page-இல் முன்பு பார்த்த examples-க்கு பொருந்துகின்றன. உங்கள் பணி `getFinalState` function-ஐ implement செய்து, அந்த cases ஒவ்வொன்றுக்கும் சரியான result return செய்வது. சரியாக implement செய்தால், நான்கு tests-உம் pass ஆக வேண்டும்.

நீங்கள் இரண்டு arguments பெறுவீர்கள்: `baseState` initial state (எ.கா. `0`), மற்றும் `queue` என்பது numbers (எ.கா. `5`) மற்றும் updater functions (எ.கா. `n => n + 1`) mix கொண்ட array; அவை add செய்யப்பட்ட order-இலேயே இருக்கும்.

இந்த page-இல் உள்ள tables காட்டுவது போல final state return செய்வதே உங்கள் பணி!

<Hint>

நீங்கள் சிக்கினால், இந்த code structure-இலிருந்து தொடங்குங்கள்:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

Missing lines-ஐ நிரப்புங்கள்!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

இது final state கணக்கிட React பயன்படுத்தும், இந்த page-இல் துல்லியமாக விவரிக்கப்பட்ட algorithm:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

இப்போது React-ன் இந்த பகுதி எப்படி வேலை செய்கிறது என்று உங்களுக்கு தெரியும்!

</Solution>

</Challenges>
