---
title: useState
---

<Intro>

`useState` என்பது உங்கள் component-க்கு [state variable](/learn/state-a-components-memory) சேர்க்க அனுமதிக்கும் React Hook.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useState(initialState)` {/*usestate*/}

ஒரு [state variable](/learn/state-a-components-memory) declare செய்ய, உங்கள் component-ன் top level-இல் `useState` call செய்யுங்கள்.

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

[Array destructuring](https://javascript.info/destructuring-assignment) பயன்படுத்தி state variables-க்கு `[something, setSomething]` போல பெயரிடுவது convention.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `initialState`: State ஆரம்பத்தில் இருக்க வேண்டும் என்று நீங்கள் விரும்பும் value. இது எந்த type value-ஆகவும் இருக்கலாம்; ஆனால் functions-க்கு special behavior உள்ளது. Initial render-க்குப் பிறகு இந்த argument ignore செய்யப்படும்.
  * `initialState` ஆக function pass செய்தால், அது _initializer function_ ஆக treat செய்யப்படும். அது pure ஆக இருக்க வேண்டும், arguments எதையும் எடுக்கக்கூடாது, எந்த type value-யையும் return செய்யலாம். Component initialize ஆகும் போது React உங்கள் initializer function-ஐ call செய்து, அதன் return value-ஐ initial state ஆக store செய்யும். [கீழே உள்ள example-ஐ பார்க்கவும்.](#avoiding-recreating-the-initial-state)

#### Returns {/*returns*/}

`useState` சரியாக இரண்டு values கொண்ட array-ஐ return செய்கிறது:

1. Current state. முதல் render போது, நீங்கள் pass செய்த `initialState`-க்கு இது match ஆகும்.
2. State-ஐ வேறு value-க்கு update செய்து re-render trigger செய்ய அனுமதிக்கும் [`set` function](#setstate).

#### Caveats {/*caveats*/}

* `useState` ஒரு Hook என்பதால், அதை **உங்கள் component-ன் top level** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component ஒன்றை extract செய்து state-ஐ அதற்குள் move செய்யுங்கள்.
* Strict Mode-இல், [accidental impurities கண்டுபிடிக்க உதவ](#my-initializer-or-updater-function-runs-twice) React உங்கள் initializer function-ஐ **இருமுறை call செய்யும்**. இது development-only behavior; production-ஐ பாதிக்காது. உங்கள் initializer function pure ஆக இருந்தால் (அப்படியே இருக்க வேண்டும்), இது behavior-ஐ பாதிக்கக்கூடாது. Calls-இல் ஒன்றின் result ignore செய்யப்படும்.

---

### `setSomething(nextState)` போன்ற `set` functions {/*setstate*/}

`useState` return செய்யும் `set` function, state-ஐ வேறு value-க்கு update செய்து re-render trigger செய்ய அனுமதிக்கிறது. Next state-ஐ நேரடியாக pass செய்யலாம், அல்லது previous state-இலிருந்து அதை calculate செய்யும் function pass செய்யலாம்:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameters {/*setstate-parameters*/}

* `nextState`: State ஆக இருக்க வேண்டும் என்று நீங்கள் விரும்பும் value. இது எந்த type value-ஆகவும் இருக்கலாம்; ஆனால் functions-க்கு special behavior உள்ளது.
  * `nextState` ஆக function pass செய்தால், அது _updater function_ ஆக treat செய்யப்படும். அது pure ஆக இருக்க வேண்டும், pending state-ஐ ஒரே argument ஆக எடுக்க வேண்டும், next state-ஐ return செய்ய வேண்டும். React உங்கள் updater function-ஐ queue-இல் வைத்து, component-ஐ re-render செய்யும். அடுத்த render போது, queued updaters அனைத்தையும் previous state மீது apply செய்து React next state-ஐ calculate செய்யும். [கீழே உள்ள example-ஐ பார்க்கவும்.](#updating-state-based-on-the-previous-state)

#### Returns {/*setstate-returns*/}

`set` functions-க்கு return value இல்லை.

#### Caveats {/*setstate-caveats*/}

* `set` function ***அடுத்த* render-க்கான state variable-ஐ மட்டும் update செய்கிறது**. `set` function call செய்த பிறகு state variable-ஐ read செய்தால், உங்கள் call-க்கு முன் screen-இல் இருந்த [old value-ஐயே இன்னும் பெறுவீர்கள்](#ive-updated-the-state-but-logging-gives-me-the-old-value).

* நீங்கள் வழங்கும் புதிய value current `state`-க்கு identical ஆக இருந்தால் ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் தீர்மானிக்கப்படும்), React **component மற்றும் அதன் children re-render செய்வதை skip செய்யும்.** இது optimization. சில cases-இல் children skip செய்வதற்கு முன் React உங்கள் component-ஐ இன்னும் call செய்ய வேண்டியிருக்கலாம்; அது உங்கள் code-ஐ பாதிக்கக்கூடாது.

* React [state updates-ஐ batch செய்கிறது.](/learn/queueing-a-series-of-state-updates) எல்லா event handlers run ஆகி, அவை `set` functions call செய்த பிறகு **screen-ஐ update செய்கிறது.** இதனால் single event-இல் பல re-renders தவிர்க்கப்படுகின்றன. DOM access செய்ய போன்ற காரணத்திற்காக React screen-ஐ முன்னதாக update செய்ய force செய்ய வேண்டிய அரிய case-இல் [`flushSync`](/reference/react-dom/flushSync) பயன்படுத்தலாம்.

* `set` function-க்கு stable identity உள்ளது; எனவே அது Effect dependencies-இலிருந்து omit செய்யப்பட்டிருப்பதை அடிக்கடி காண்பீர்கள். ஆனால் அதை include செய்தாலும் Effect fire ஆகாது. Linter ஒரு dependency-ஐ errors இல்லாமல் omit செய்ய அனுமதித்தால், அது safe. [Effect dependencies remove செய்வது பற்றி மேலும் அறிக.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* `set` function-ஐ *rendering போது* call செய்வது தற்போது render ஆகும் component-க்குள் மட்டுமே அனுமதிக்கப்படுகிறது. React அதன் output-ஐ discard செய்து, புதிய state உடன் உடனே மீண்டும் render செய்ய முயலும். இந்த pattern அரிதாகவே தேவைப்படும்; ஆனால் **previous renders-இலிருந்து information store செய்ய** இதைப் பயன்படுத்தலாம். [கீழே உள்ள example-ஐ பார்க்கவும்.](#storing-information-from-previous-renders)

* Strict Mode-இல், [accidental impurities கண்டுபிடிக்க உதவ](#my-initializer-or-updater-function-runs-twice) React உங்கள் updater function-ஐ **இருமுறை call செய்யும்**. இது development-only behavior; production-ஐ பாதிக்காது. உங்கள் updater function pure ஆக இருந்தால் (அப்படியே இருக்க வேண்டும்), இது behavior-ஐ பாதிக்கக்கூடாது. Calls-இல் ஒன்றின் result ignore செய்யப்படும்.

---

## Usage {/*usage*/}

### Component-க்கு state சேர்த்தல் {/*adding-state-to-a-component*/}

ஒன்று அல்லது அதற்கு மேற்பட்ட [state variables](/learn/state-a-components-memory) declare செய்ய, உங்கள் component-ன் top level-இல் `useState` call செய்யுங்கள்.

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

[Array destructuring](https://javascript.info/destructuring-assignment) பயன்படுத்தி state variables-க்கு `[something, setSomething]` போல பெயரிடுவது convention.

`useState` சரியாக இரண்டு items கொண்ட array-ஐ return செய்கிறது:

1. இந்த state variable-ன் <CodeStep step={1}>current state</CodeStep>; ஆரம்பத்தில் நீங்கள் வழங்கிய <CodeStep step={3}>initial state</CodeStep>-ஆக set செய்யப்படும்.
2. Interaction-க்கு பதிலாக அதை வேறு எந்த value-க்கும் மாற்ற அனுமதிக்கும் <CodeStep step={2}>`set` function</CodeStep>.

Screen-இல் உள்ளதை update செய்ய, next state ஒன்றுடன் `set` function call செய்யுங்கள்:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React next state-ஐ store செய்து, புதிய values உடன் உங்கள் component-ஐ மீண்டும் render செய்து, UI-ஐ update செய்யும்.

<Pitfall>

`set` function call செய்வது [ஏற்கனவே execute ஆகும் code-இல் current state-ஐ **மாற்றாது**](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // இன்னும் "Taylor" தான்!
}
```

அது *அடுத்த* render முதல் `useState` return செய்யும் value-ஐ மட்டுமே பாதிக்கும்.

</Pitfall>

<Recipes titleText="அடிப்படை useState examples" titleId="examples-basic">

#### Counter (number) {/*counter-number*/}

இந்த example-இல், `count` state variable ஒரு number வைத்திருக்கிறது. Button click செய்தால் அது increment ஆகும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      நீங்கள் என்னை {count} முறை அழுத்தினீர்கள்
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Text field (string) {/*text-field-string*/}

இந்த example-இல், `text` state variable ஒரு string வைத்திருக்கிறது. நீங்கள் type செய்யும் போது, `handleChange` browser input DOM element-இலிருந்து latest input value-ஐ read செய்து, state update செய்ய `setText` call செய்கிறது. இதனால் current `text`-ஐ கீழே display செய்ய முடிகிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>நீங்கள் type செய்தது: {text}</p>
      <button onClick={() => setText('hello')}>
        மீட்டமை
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (boolean) {/*checkbox-boolean*/}

இந்த example-இல், `liked` state variable ஒரு boolean வைத்திருக்கிறது. Input-ஐ click செய்யும் போது, browser checkbox input checked ஆக உள்ளதா என்பதை வைத்து `setLiked`, `liked` state variable-ஐ update செய்கிறது. Checkbox-க்கு கீழே text render செய்ய `liked` variable பயன்படுத்தப்படுகிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        இது எனக்கு பிடித்தது
      </label>
      <p>இது உங்களுக்கு {liked ? 'பிடித்தது' : 'பிடிக்கவில்லை'}.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Form (இரண்டு variables) {/*form-two-variables*/}

ஒரே component-இல் ஒன்றுக்கு மேற்பட்ட state variables declare செய்யலாம். ஒவ்வொரு state variable-உம் முழுமையாக independent.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        வயதை increment செய்
      </button>
      <p>வணக்கம், {name}. உங்கள் வயது {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### முந்தைய state அடிப்படையில் state புதுப்பித்தல் {/*updating-state-based-on-the-previous-state*/}

`age` `42` என்று வைத்துக்கொள்ளுங்கள். இந்த handler `setAge(age + 1)`-ஐ மூன்று முறை call செய்கிறது:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

ஆனால் ஒரு click-க்கு பிறகு, `age` `45` அல்ல, `43` மட்டுமே ஆகும்! ஏனெனில் `set` function call செய்வது ஏற்கனவே run ஆகும் code-இல் `age` state variable-ஐ [update செய்யாது](/learn/state-as-a-snapshot). எனவே ஒவ்வொரு `setAge(age + 1)` call-உம் `setAge(43)` ஆகிறது.

இந்த பிரச்சினையைத் தீர்க்க, next state-க்கு பதிலாக `setAge`-க்கு **ஒரு *updater function* pass செய்யலாம்**:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

இங்கே, `a => a + 1` உங்கள் updater function. இது <CodeStep step={1}>pending state</CodeStep>-ஐ எடுத்து, அதிலிருந்து <CodeStep step={2}>next state</CodeStep>-ஐ calculate செய்கிறது.

React உங்கள் updater functions-ஐ [queue](/learn/queueing-a-series-of-state-updates)-இல் வைக்கிறது. பின்னர் அடுத்த render போது, அவற்றை அதே order-இல் call செய்யும்:

1. `a => a + 1`, pending state ஆக `42`-ஐ receive செய்து next state ஆக `43` return செய்யும்.
1. `a => a + 1`, pending state ஆக `43`-ஐ receive செய்து next state ஆக `44` return செய்யும்.
1. `a => a + 1`, pending state ஆக `44`-ஐ receive செய்து next state ஆக `45` return செய்யும்.

மற்ற queued updates இல்லாததால், இறுதியில் React `45`-ஐ current state ஆக store செய்யும்.

Convention-ஆக, pending state argument-க்கு state variable name-ன் முதல் எழுத்தை பயன்படுத்துவது பொதுவானது; `age`-க்கு `a` போல. ஆனால் `prevAge` அல்லது உங்களுக்கு தெளிவாகத் தோன்றும் வேறு பெயரையும் பயன்படுத்தலாம்.

அவை [pure](/learn/keeping-components-pure) என்பதை verify செய்ய React development-இல் [உங்கள் updaters-ஐ இருமுறை call செய்யலாம்](#my-initializer-or-updater-function-runs-twice).

<DeepDive>

#### Updater பயன்படுத்துவது எப்போதும் preferred ஆகுமா? {/*is-using-an-updater-always-preferred*/}

நீங்கள் set செய்யும் state previous state-இலிருந்து calculate செய்யப்படுமானால், எப்போதும் `setAge(a => a + 1)` போன்ற code எழுத வேண்டும் என்ற recommendation கேட்கலாம். அதில் தீங்கு இல்லை, ஆனால் அது எப்போதும் அவசியமில்லை.

பெரும்பாலான cases-இல், இந்த இரண்டு approaches இடையே வேறுபாடு இல்லை. Clicks போன்ற intentional user actions-க்கு, அடுத்த click-க்கு முன் `age` state variable update ஆகியிருக்கும் என்பதை React எப்போதும் உறுதி செய்கிறது. அதனால் event handler ஆரம்பத்தில் click handler "stale" `age` பார்க்கும் risk இல்லை.

ஆனால் ஒரே event-க்குள் பல updates செய்தால், updaters உதவியாக இருக்கும். State variable-ஐ நேரடியாக access செய்வது inconvenient ஆக இருந்தாலும் அவை உதவும் (re-renders optimize செய்யும்போது இதைச் சந்திக்கலாம்).

சிறிது verbose syntax-ஐ விட consistency-ஐ விரும்பினால், நீங்கள் set செய்யும் state previous state-இலிருந்து calculate செய்யப்படும்போது எப்போதும் updater எழுதுவது reasonable. அது *வேறு* state variable-ன் previous state-இலிருந்து calculate செய்யப்படுமானால், அவற்றை ஒரே object-ஆக combine செய்து [reducer பயன்படுத்தலாம்.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="Updater pass செய்வதும் next state-ஐ நேரடியாக pass செய்வதும் உள்ள வித்தியாசம்" titleId="examples-updater">

#### Updater function pass செய்தல் {/*passing-the-updater-function*/}

இந்த example updater function pass செய்கிறது; எனவே "+3" button வேலை செய்கிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>உங்கள் வயது: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Next state-ஐ நேரடியாக pass செய்தல் {/*passing-the-next-state-directly*/}

இந்த example updater function pass செய்யாது; எனவே "+3" button **எதிர்பார்த்தபடி வேலை செய்யாது**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>உங்கள் வயது: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### State-இல் objects மற்றும் arrays புதுப்பித்தல் {/*updating-objects-and-arrays-in-state*/}

Objects மற்றும் arrays-ஐ state-இல் வைக்கலாம். React-இல் state read-only எனக் கருதப்படுகிறது; எனவே **existing objects-ஐ *mutate* செய்வதற்குப் பதிலாக அவற்றை *replace* செய்ய வேண்டும்**. உதாரணமாக, state-இல் `form` object இருந்தால், அதை mutate செய்ய வேண்டாம்:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

அதற்கு பதிலாக, புதிய object ஒன்றை create செய்து முழு object-ஐ replace செய்யுங்கள்:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

மேலும் அறிய [state-இல் objects update செய்தல்](/learn/updating-objects-in-state) மற்றும் [state-இல் arrays update செய்தல்](/learn/updating-arrays-in-state) வாசிக்கவும்.

<Recipes titleText="State-இல் objects மற்றும் arrays examples" titleId="examples-objects">

#### Form (object) {/*form-object*/}

இந்த example-இல், `form` state variable ஒரு object வைத்திருக்கிறது. ஒவ்வொரு input-க்கும், முழு form-ன் next state உடன் `setForm` call செய்யும் change handler உள்ளது. `{ ...form }` spread syntax, state object mutate ஆகாமல் replace ஆகிறது என்பதை உறுதி செய்கிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        முதல் பெயர்:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        கடைசி பெயர்:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Form (nested object) {/*form-nested-object*/}

இந்த example-இல், state மேலும் nested. Nested state update செய்யும்போது, நீங்கள் update செய்யும் object-ன் copy-யையும், மேலே செல்லும் வழியில் அதை "containing" செய்யும் objects-ன் copy-யையும் create செய்ய வேண்டும். மேலும் அறிய [nested object update செய்தல்](/learn/updating-objects-in-state#updating-a-nested-object) வாசிக்கவும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        பெயர்:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        தலைப்பு:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        நகரம்:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        படம்:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' உருவாக்கியது '}
        {person.name}
        <br />
        ({person.artwork.city}-இல் உள்ளது)
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### List (array) {/*list-array*/}

இந்த example-இல், `todos` state variable ஒரு array வைத்திருக்கிறது. ஒவ்வொரு button handler-உம் அந்த array-ன் next version உடன் `setTodos` call செய்கிறது. `[...todos]` spread syntax, `todos.map()` மற்றும் `todos.filter()` state array mutate ஆகாமல் replace ஆகிறது என்பதை உறுதி செய்கின்றன.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'பால் வாங்கு', done: true },
  { id: 1, title: 'tacos சாப்பிடு', done: false },
  { id: 2, title: 'தேநீர் தயாரி', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Todo சேர்க்கவும்"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Immer மூலம் சுருக்கமான update logic எழுதுதல் {/*writing-concise-update-logic-with-immer*/}

Mutation இல்லாமல் arrays மற்றும் objects update செய்வது tedious ஆகத் தோன்றினால், repetitive code-ஐ குறைக்க [Immer](https://github.com/immerjs/use-immer) போன்ற library பயன்படுத்தலாம். Objects mutate செய்வது போல concise code எழுத Immer அனுமதிக்கிறது; ஆனால் உள்ளே அது immutable updates செய்கிறது:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art bucket list</h1>
      <h2>நான் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Initial state-ஐ மீண்டும் create செய்வதைத் தவிர்த்தல் {/*avoiding-recreating-the-initial-state*/}

React initial state-ஐ ஒருமுறை save செய்து, அடுத்த renders-இல் அதை ignore செய்கிறது.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()`-ன் result initial render-க்கு மட்டும் பயன்படுத்தப்பட்டாலும், ஒவ்வொரு render-இலும் நீங்கள் இந்த function-ஐ call செய்கிறீர்கள். இது பெரிய arrays create செய்தாலோ expensive calculations செய்தாலோ வீணாக இருக்கலாம்.

இதைக் தீர்க்க, அதை `useState`-க்கு **_initializer_ function ஆக pass செய்யலாம்**:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

நீங்கள் `createInitialTodos`-ஐ pass செய்கிறீர்கள் என்பதை கவனியுங்கள்; அது *function itself*. அதை call செய்த result ஆன `createInitialTodos()` அல்ல. `useState`-க்கு function pass செய்தால், React அதை initialization போது மட்டும் call செய்யும்.

அவை [pure](/learn/keeping-components-pure) என்பதை verify செய்ய React development-இல் [உங்கள் initializers-ஐ இருமுறை call செய்யலாம்](#my-initializer-or-updater-function-runs-twice).

<Recipes titleText="Initializer pass செய்வதும் initial state-ஐ நேரடியாக pass செய்வதும் உள்ள வித்தியாசம்" titleId="examples-initializer">

#### Initializer function-ஐ pass செய்தல் {/*passing-the-initializer-function*/}

இந்த example initializer function pass செய்கிறது; எனவே `createInitialTodos` function initialization போது மட்டுமே run ஆகும். Input-இல் type செய்வது போன்ற component re-render நேரங்களில் அது run ஆகாது.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'உருப்படி ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>சேர்</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Initial state-ஐ நேரடியாக pass செய்தல் {/*passing-the-initial-state-directly*/}

இந்த example initializer function pass செய்யாது; எனவே input-இல் type செய்வது போன்ற ஒவ்வொரு render-இலும் `createInitialTodos` function run ஆகும். Behavior-இல் பார்க்கக்கூடிய வித்தியாசம் இல்லை; ஆனால் இந்த code குறைவான திறன் கொண்டது.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'உருப்படி ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>சேர்</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Key மூலம் state reset செய்தல் {/*resetting-state-with-a-key*/}

[Lists render செய்யும் போது](/learn/rendering-lists) `key` attribute-ஐ அடிக்கடி சந்திப்பீர்கள். ஆனால் அது இன்னொரு நோக்கத்தையும் நிறைவேற்றுகிறது.

ஒரு component-க்கு வேறு `key` pass செய்வதன் மூலம் **அந்த component-ன் state-ஐ reset செய்யலாம்.** இந்த example-இல், மீட்டமை button `version` state variable-ஐ மாற்றுகிறது; அதை `Form`-க்கு `key` ஆக pass செய்கிறோம். `key` மாறும்போது, React `Form` component-ஐ (அதன் children அனைத்தையும்) scratch-இலிருந்து re-create செய்கிறது; எனவே அதன் state reset ஆகிறது.

மேலும் அறிய [state preserve மற்றும் reset செய்தல்](/learn/preserving-and-resetting-state) வாசிக்கவும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>மீட்டமை</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>வணக்கம், {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### முந்தைய renders-இலிருந்து information சேமித்தல் {/*storing-information-from-previous-renders*/}

பொதுவாக, event handlers-இல் state update செய்வீர்கள். ஆனால் அரிய cases-இல் rendering-க்கு பதிலாக state adjust செய்ய விரும்பலாம் -- உதாரணமாக, prop மாறும்போது state variable ஒன்றை மாற்ற விரும்பலாம்.

பெரும்பாலான cases-இல், இது தேவையில்லை:

* **உங்களுக்கு தேவையான value current props அல்லது பிற state-இலிருந்து முழுவதும் compute செய்ய முடிந்தால், [அந்த redundant state-ஐ முழுமையாக remove செய்யுங்கள்.](/learn/choosing-the-state-structure#avoid-redundant-state)** அடிக்கடி recompute ஆகுமோ என்று கவலைப்பட்டால், [`useMemo` Hook](/reference/react/useMemo) உதவும்.
* முழு component tree-ன் state-ஐ reset செய்ய விரும்பினால், [உங்கள் component-க்கு வேறு `key` pass செய்யுங்கள்.](#resetting-state-with-a-key)
* முடிந்தால், event handlers-இல் தொடர்புடைய state அனைத்தையும் update செய்யுங்கள்.

இவை எதுவும் பொருந்தாத அரிய case-இல், இதுவரை render செய்யப்பட்ட values அடிப்படையில் state update செய்ய ஒரு pattern பயன்படுத்தலாம்: உங்கள் component render ஆகும் போது `set` function call செய்வது.

இதோ ஒரு example. இந்த `CountLabel` component, அதற்கு pass செய்யப்பட்ட `count` prop-ஐ display செய்கிறது:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

கடைசி change-க்கு பிறகு counter *அதிகரித்ததா அல்லது குறைந்ததா* என்பதை காட்ட வேண்டும் என்று வைத்துக்கொள்ளுங்கள். `count` prop இதைச் சொல்லாது -- அதன் previous value-ஐ track செய்ய வேண்டும். அதை track செய்ய `prevCount` state variable சேர்க்கவும். Count அதிகரித்ததா குறைந்ததா என்பதை hold செய்ய `trend` என்ற மற்றொரு state variable சேர்க்கவும். `prevCount`-ஐ `count` உடன் compare செய்து, அவை சமமல்ல என்றால் `prevCount` மற்றும் `trend` இரண்டையும் update செய்யுங்கள். இப்போது current count prop-ஐயும் *கடைசி render-க்கு பிறகு அது எப்படி மாறியது* என்பதையும் காட்டலாம்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        அதிகரி
      </button>
      <button onClick={() => setCount(count - 1)}>
        குறை
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'அதிகரிக்கிறது' : 'குறைகிறது');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>எண்ணிக்கை {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Rendering போது `set` function call செய்தால், அது `prevCount !== count` போன்ற condition-க்குள் இருக்க வேண்டும்; மேலும் அந்த condition-க்குள் `setPrevCount(count)` போன்ற call இருக்க வேண்டும். இல்லையெனில், உங்கள் component crash ஆகும் வரை loop-இல் re-render ஆகும். மேலும், இவ்வாறு *தற்போது render ஆகும்* component-ன் state-ஐ மட்டும் update செய்யலாம். Rendering போது *வேறு* component-ன் `set` function call செய்வது error. இறுதியாக, உங்கள் `set` call இன்னும் [mutation இல்லாமல் state update](#updating-objects-and-arrays-in-state) செய்ய வேண்டும் -- இதனால் [pure functions](/learn/keeping-components-pure)-ன் பிற விதிகளை உடைக்கலாம் என்பதல்ல.

இந்த pattern புரிந்துகொள்ள கடினமாக இருக்கலாம்; பொதுவாக தவிர்ப்பதே நல்லது. ஆனால் effect-இல் state update செய்வதைவிட இது மேல். Render போது `set` function call செய்தால், உங்கள் component `return` statement-இல் இருந்து வெளியேறியதும், children render செய்வதற்கு முன்பே React அந்த component-ஐ உடனே re-render செய்யும். இதனால் children இருமுறை render செய்ய வேண்டியதில்லை. உங்கள் component function-ன் மீதமுள்ள பகுதி இன்னும் execute ஆகும் (result throw away செய்யப்படும்). உங்கள் condition எல்லா Hook calls-க்கும் கீழே இருந்தால், rendering-ஐ முன்னதாக restart செய்ய early `return;` சேர்க்கலாம்.

---

## சிக்கல் தீர்க்குதல் {/*troubleshooting*/}

### State update செய்தேன், ஆனால் logging பழைய value-ஐ தருகிறது {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

`set` function call செய்வது **running code-இல் state-ஐ மாற்றாது**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // 1 உடன் re-render request செய்
  console.log(count);  // இன்னும் 0!

  setTimeout(() => {
    console.log(count); // இதுவும் 0!
  }, 5000);
}
```

ஏனெனில் [states snapshot போல behave செய்கின்றன.](/learn/state-as-a-snapshot) State update செய்வது புதிய state value உடன் மற்றொரு render request செய்கிறது; ஆனால் ஏற்கனவே running ஆகும் event handler-இல் உள்ள `count` JavaScript variable-ஐ பாதிக்காது.

Next state-ஐ பயன்படுத்த வேண்டுமானால், அதை `set` function-க்கு pass செய்வதற்கு முன் variable ஒன்றில் save செய்யலாம்:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### State update செய்தேன், ஆனால் screen புதுப்பிக்கப்படவில்லை {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

Next state previous state-க்கு equal என்றால் ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் தீர்மானிக்கப்படும்), React **உங்கள் update-ஐ ignore செய்யும்.** State-இல் உள்ள object அல்லது array-ஐ நேரடியாக மாற்றும்போது இது பொதுவாக நடக்கும்:

```js
obj.x = 10;  // 🚩 தவறு: existing object-ஐ mutate செய்கிறது
setObj(obj); // 🚩 எதையும் செய்யாது
```

நீங்கள் existing `obj` object-ஐ mutate செய்து அதை மீண்டும் `setObj`-க்கு pass செய்ததால், React update-ஐ ignore செய்தது. இதை fix செய்ய, state-இல் objects மற்றும் arrays-ஐ _mutate_ செய்வதற்குப் பதிலாக எப்போதும் [_replace_ செய்கிறீர்கள்](#updating-objects-and-arrays-in-state) என்பதை உறுதி செய்ய வேண்டும்:

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### "Too many re-renders" error வருகிறது {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.` என்று error வரலாம். பொதுவாக, நீங்கள் *render போது* unconditionally state set செய்கிறீர்கள் என்பதைக் குறிக்கும்; எனவே உங்கள் component loop-இல் நுழைகிறது: render, set state (இது render ஏற்படுத்தும்), render, set state (இது render ஏற்படுத்தும்), இப்படி தொடரும். பெரும்பாலும், event handler specify செய்வதில் உள்ள mistake இதற்கு காரணம்:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>என்னை click செய்</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>என்னை click செய்</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>என்னை click செய்</button>
```

இந்த error-ன் காரணத்தை கண்டுபிடிக்க முடியவில்லை என்றால், console-இல் error-க்கு அருகிலுள்ள arrow-ஐ click செய்து JavaScript stack-ஐ பார்த்து error-க்கு காரணமான குறிப்பிட்ட `set` function call-ஐ கண்டுபிடிக்கவும்.

---

### என் initializer அல்லது updater function இருமுறை run ஆகிறது {/*my-initializer-or-updater-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode)-இல், React உங்கள் சில functions-ஐ ஒருமுறை அல்ல, இருமுறை call செய்யும்:

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

இது எதிர்பார்க்கப்பட்டதே; உங்கள் code-ஐ உடைக்கக்கூடாது.

இந்த **development-only** behavior [components pure ஆக இருக்க](/learn/keeping-components-pure) உதவுகிறது. React calls-இல் ஒன்றின் result-ஐ பயன்படுத்தி, மற்றதின் result-ஐ ignore செய்கிறது. உங்கள் component, initializer, மற்றும் updater functions pure ஆக இருக்கும் வரை, இது உங்கள் logic-ஐ பாதிக்கக்கூடாது. ஆனால் அவை தவறுதலாக impure என்றால், mistakes-ஐ கவனிக்க இது உதவுகிறது.

உதாரணமாக, இந்த impure updater function state-இல் உள்ள array-ஐ mutate செய்கிறது:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

React உங்கள் updater function-ஐ இருமுறை call செய்வதால், todo இருமுறை சேர்க்கப்பட்டது என்பதைப் பார்ப்பீர்கள்; எனவே தவறு இருப்பதை அறியலாம். இந்த example-இல், [array-ஐ mutate செய்வதற்குப் பதிலாக replace செய்வதன் மூலம்](#updating-objects-and-arrays-in-state) தவறை fix செய்யலாம்:

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

இப்போது இந்த updater function pure என்பதால், அதை extra time call செய்தாலும் behavior-இல் வேறுபாடு வராது. இதனால் தான் React அதை இருமுறை call செய்வது mistakes கண்டுபிடிக்க உதவுகிறது. **Component, initializer, மற்றும் updater functions மட்டும் pure ஆக இருக்க வேண்டும்.** Event handlers pure ஆக இருக்க தேவையில்லை; எனவே React உங்கள் event handlers-ஐ ஒருபோதும் இருமுறை call செய்யாது.

மேலும் அறிய [components pure ஆக வைத்தல்](/learn/keeping-components-pure) வாசிக்கவும்.

---

### State-ஐ function ஆக set செய்ய முயல்கிறேன், ஆனால் அது call செய்யப்படுகிறது {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Function ஒன்றை state-க்குள் இவ்வாறு வைக்க முடியாது:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

நீங்கள் function pass செய்வதால், React `someFunction` ஒரு [initializer function](#avoiding-recreating-the-initial-state), `someOtherFunction` ஒரு [updater function](#updating-state-based-on-the-previous-state) என்று கருதுகிறது; எனவே அவற்றை call செய்து result-ஐ store செய்ய முயலும். Function-ஐ உண்மையில் *store* செய்ய, இரு cases-இலும் அவற்றுக்கு முன் `() =>` வைக்க வேண்டும். அப்போது React நீங்கள் pass செய்யும் functions-ஐ store செய்யும்.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
