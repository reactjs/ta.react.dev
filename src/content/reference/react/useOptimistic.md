---
title: useOptimistic
---

<Intro>

`useOptimistic` என்பது UI-ஐ optimistic ஆக update செய்ய உதவும் React Hook ஆகும்.

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useOptimistic(value, reducer?)` {/*useoptimistic*/}

ஒரு value-க்கான optimistic state உருவாக்க, உங்கள் component-ன் top level-இல் `useOptimistic`-ஐ call செய்யுங்கள்.

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

[கீழே மேலும் examples பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `value`: Pending Actions எதுவும் இல்லாதபோது return செய்யப்படும் value.
* **optional** `reducer(currentState, action)`: Optimistic state எப்படி update ஆக வேண்டும் என்பதை specify செய்யும் reducer function. இது pure ஆக இருக்க வேண்டும், current state மற்றும் reducer action arguments-ஐ எடுக்க வேண்டும், மேலும் அடுத்த optimistic state-ஐ return செய்ய வேண்டும்.

#### திருப்பி அளிப்பது {/*returns*/}

`useOptimistic` சரியாக இரண்டு values கொண்ட array ஒன்றை return செய்கிறது:

1. `optimisticState`: தற்போதைய optimistic state. Action pending இல்லை என்றால் இது `value`-க்கு சமம்; Action pending இருந்தால், `reducer` return செய்த state-க்கு சமம் (அல்லது `reducer` provide செய்யப்படவில்லை என்றால் set function-க்கு pass செய்யப்பட்ட value-க்கு சமம்).
2. Action-க்குள் optimistic state-ஐ வேறு value-க்கு update செய்ய அனுமதிக்கும் [`set` function](#setoptimistic).

---

### `setOptimistic(optimisticState)` போன்ற `set` functions {/*setoptimistic*/}

`useOptimistic` return செய்யும் `set` function, ஒரு [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions) நடக்கும் காலத்துக்கு state-ஐ update செய்ய அனுமதிக்கிறது. அடுத்த state-ஐ நேரடியாக pass செய்யலாம், அல்லது முந்தைய state-இலிருந்து அதை calculate செய்யும் function ஒன்றை pass செய்யலாம்:

```js
const [optimisticLike, setOptimisticLike] = useOptimistic(false);
const [optimisticSubs, setOptimisticSubs] = useOptimistic(subs);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticSubs(a => a + 1);
    await saveChanges();
  });
}
```

#### அளவுருக்கள் {/*setoptimistic-parameters*/}

* `optimisticState`: ஒரு [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions) நடக்கும்போது optimistic state ஆக இருக்க வேண்டும் என்று நீங்கள் விரும்பும் value. `useOptimistic`-க்கு `reducer` provide செய்திருந்தால், இந்த value உங்கள் reducer-க்கு second argument ஆக pass செய்யப்படும். இது எந்த type value ஆகவும் இருக்கலாம்.
    * `optimisticState` ஆக function ஒன்றை pass செய்தால், அது _updater function_ ஆக treat செய்யப்படும். அது pure ஆக இருக்க வேண்டும், pending state-ஐ அதன் ஒரே argument ஆக எடுக்க வேண்டும், மேலும் அடுத்த optimistic state-ஐ return செய்ய வேண்டும். React உங்கள் updater function-ஐ queue-இல் வைத்து உங்கள் component-ஐ re-render செய்யும். அடுத்த render போது, [`useState` updaters](/reference/react/useState#setstate-parameters)-க்கு ஒத்தபடி queued updaters-ஐ previous state-க்கு apply செய்து React next state-ஐ calculate செய்யும்.

#### திருப்பி அளிப்பது {/*setoptimistic-returns*/}

`set` functions-க்கு return value இல்லை.

#### கவனிக்க வேண்டியவை {/*setoptimistic-caveats*/}

* `set` function ஒரு [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions)-க்குள் call செய்யப்பட வேண்டும். Setter-ஐ Action-க்கு வெளியே call செய்தால், [React warning காட்டும்](#an-optimistic-state-update-occurred-outside-a-transition-or-action), மேலும் optimistic state சிறிது நேரம் render ஆகும்.

<DeepDive>

#### Optimistic state எப்படி வேலை செய்கிறது {/*how-optimistic-state-works*/}

Action நடந்து கொண்டிருக்கும்போது temporary value காட்ட `useOptimistic` உதவுகிறது:

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  const newValue = await saveChanges('b');
  setValue(newValue);
});
```

Setter ஒரு Action-க்குள் call செய்யப்பட்டால், அந்த Action நடந்து கொண்டிருக்கும் போது அந்த state-ஐ காட்ட `useOptimistic` re-render trigger செய்யும். இல்லையெனில், `useOptimistic`-க்கு pass செய்யப்பட்ட `value` return செய்யப்படும்.

இந்த state "optimistic" என்று அழைக்கப்படுகிறது, ஏனெனில் Action உண்மையில் முடிவடைய நேரம் எடுத்தாலும், Action செய்ததின் result-ஐ உடனடியாக user-க்கு காட்ட இது பயன்படுத்தப்படுகிறது.

**Update flow எப்படி நடக்கிறது**

1. **உடனடி update**: `setOptimistic('b')` call செய்யப்பட்டதும், React உடனே `'b'` உடன் render செய்கிறது.

2. **(Optional) Action-இல் await**: Action-இல் நீங்கள் await செய்தால், React `'b'`-ஐ தொடர்ந்து காட்டும்.

3. **Transition schedule செய்யப்பட்டது**: `setValue(newValue)` real state-க்கு update schedule செய்கிறது.

4. **(Optional) Suspense-க்காக wait**: `newValue` suspend ஆனால், React `'b'`-ஐ தொடர்ந்து காட்டும்.

5. **Single render commit**: இறுதியில், `newValue` `value` மற்றும் `optimistic` இரண்டிற்கும் commit ஆகிறது.

Optimistic state-ஐ "clear" செய்ய extra render இல்லை. Transition முடியும் போது, optimistic மற்றும் real state ஒரே render-இல் converge ஆகின்றன.

<Note>

#### Optimistic state temporary ஆகும் {/*optimistic-state-is-temporary*/}

Optimistic state Action நடந்து கொண்டிருக்கும்போது மட்டுமே render ஆகும்; இல்லையெனில் `value` render ஆகும்.

`saveChanges` `'c'` return செய்தால், `value` மற்றும் `optimistic` இரண்டும் `'c'` ஆக இருக்கும், `'b'` அல்ல.

</Note>

**இறுதி state எப்படி தீர்மானிக்கப்படுகிறது**

`useOptimistic`-க்கு கொடுக்கப்படும் `value` argument, Action முடிந்தபின் என்ன display ஆகும் என்பதை தீர்மானிக்கிறது. இது எப்படி வேலை செய்கிறது என்பது நீங்கள் பயன்படுத்தும் pattern-ஐப் பொறுத்தது:

- `useOptimistic(false)` போன்ற **hardcoded values**: Action-க்கு பிறகு, `state` இன்னும் `false` ஆக இருக்கும்; எனவே UI `false` காட்டும். எப்போதும் `false`-இலிருந்து தொடங்கும் pending states-க்கு இது பயனுள்ளதாக இருக்கும்.

- `useOptimistic(isLiked)` போன்ற **props அல்லது state pass செய்தல்**: Action நடக்கும் போது parent `isLiked`-ஐ update செய்தால், Action முடிந்தபின் புதிய value பயன்படுத்தப்படும். Action-ன் result-ஐ UI பிரதிபலிப்பது இதுவே.

- `useOptimistic(items, fn)` போன்ற **reducer pattern**: Action pending இருக்கும்போது `items` மாறினால், state-ஐ recalculate செய்ய React உங்கள் `reducer`-ஐ புதிய `items` உடன் re-run செய்யும். இது latest data-க்கு மேலாக உங்கள் optimistic additions-ஐ வைத்திருக்கிறது.

**Action fail ஆனால் என்ன நடக்கும்**

Action error throw செய்தால், Transition இன்னும் முடியும், மேலும் React தற்போது உள்ள `value` எதுவோ அதனுடன் render செய்கிறது. Parent பொதுவாக success-இல் மட்டுமே `value` update செய்வதால், failure என்றால் `value` மாறவில்லை; எனவே UI optimistic update-க்கு முன் காட்டியதை காட்டும். User-க்கு message காட்ட error-ஐ catch செய்யலாம்.

</DeepDive>

---

## பயன்பாடு {/*usage*/}

### Component-க்கு optimistic state சேர்த்தல் {/*adding-optimistic-state-to-a-component*/}

ஒரு அல்லது பல optimistic states declare செய்ய, உங்கள் component-ன் top level-இல் `useOptimistic`-ஐ call செய்யுங்கள்.

```js [[1, 4, "age"], [1, 5, "name"], [1, 6, "todos"], [2, 4, "optimisticAge"], [2, 5, "optimisticName"], [2, 6, "optimisticTodos"], [3, 4, "setOptimisticAge"], [3, 5, "setOptimisticName"], [3, 6, "setOptimisticTodos"], [4, 6, "reducer"]]
import { useOptimistic } from 'react';

function MyComponent({age, name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(age);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, reducer);
  // ...
```

`useOptimistic` சரியாக இரண்டு items கொண்ட array ஒன்றை return செய்கிறது:

1. <CodeStep step={1}>value</CodeStep> ஆக provide செய்யப்பட்ட value-க்கு initially set செய்யப்பட்ட <CodeStep step={2}>optimistic state</CodeStep>.
2. [Action](reference/react/useTransition#functions-called-in-starttransition-are-called-actions) நடக்கும் போது state-ஐ temporary ஆக change செய்ய அனுமதிக்கும் <CodeStep step={3}>set function</CodeStep>.
   * <CodeStep step={4}>reducer</CodeStep> provide செய்யப்பட்டிருந்தால், optimistic state return செய்வதற்கு முன் அது run ஆகும்.

<CodeStep step={2}>optimistic state</CodeStep>-ஐ பயன்படுத்த, Action-க்குள் `set` function-ஐ call செய்யுங்கள்.

Actions என்பது `startTransition`-க்குள் call செய்யப்படும் functions:

```js {3}
function onAgeChange(e) {
  startTransition(async () => {
    setOptimisticAge(42);
    const newAge = await postAge(42);
    setAge(newAge);
  });
}
```

`age` தற்போதைய age ஆகவே இருக்கும் போது React முதலில் optimistic state `42`-ஐ render செய்யும். Action POST-க்காக காத்திருந்து, பிறகு `age` மற்றும் `optimisticAge` இரண்டிற்கும் `newAge` render செய்கிறது.

Deep dive-க்கு [Optimistic state எப்படி வேலை செய்கிறது](#how-optimistic-state-works) பார்க்கவும்.

<Note>

[Action props](/reference/react/useTransition#exposing-action-props-from-components) பயன்படுத்தும்போது, `startTransition` இல்லாமல் set function-ஐ call செய்யலாம்:

```js [[3, 2, "setOptimisticName"]]
async function submitAction() {
  setOptimisticName('Taylor');
  await updateName('Taylor');
}
```

இது வேலை செய்கிறது, ஏனெனில் Action props ஏற்கனவே `startTransition`-க்குள் call செய்யப்படுகின்றன.

Example-க்கு பார்க்கவும்: [Action props-இல் optimistic state பயன்படுத்துதல்](#using-optimistic-state-in-action-props).

</Note>

---

### Action props-இல் optimistic state பயன்படுத்துதல் {/*using-optimistic-state-in-action-props*/}

[Action prop](/reference/react/useTransition#exposing-action-props-from-components)-இல், `startTransition` இல்லாமல் optimistic setter-ஐ நேரடியாக call செய்யலாம்.

இந்த example, `<form>` `submitAction` prop-க்குள் optimistic state set செய்கிறது:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import EditName from './EditName';

export default function App() {
  const [name, setName] = useState('Alice');

  return <EditName name={name} action={setName} />;
}
```

```js src/EditName.js active
import { useOptimistic, startTransition } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, action }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name);

  async function submitAction(formData) {
    const newName = formData.get('name');
    setOptimisticName(newName);

    const updatedName = await updateName(newName);
    startTransition(() => {
      action(updatedName);
    })
  }

  return (
    <form action={submitAction}>
      <p>உங்கள் பெயர்: {optimisticName}</p>
      <p>
        <label>அதை மாற்றுங்கள்: </label>
        <input
          type="text"
          name="name"
          disabled={name !== optimisticName}
        />
      </p>
    </form>
  );
}
```

```js src/actions.js hidden
export async function updateName(name) {
  await new Promise((res) => setTimeout(res, 1000));
  return name;
}
```

</Sandpack>

இந்த example-இல், user form submit செய்தால், server request நடந்து கொண்டிருக்கும்போது `newName`-ஐ optimistic ஆக காட்ட `optimisticName` உடனடியாக update ஆகிறது. Request முடிந்ததும், response-இல் இருந்து வரும் actual `updatedName` உடன் `name` மற்றும் `optimisticName` render ஆகின்றன.

<DeepDive>

#### இதற்கு `startTransition` ஏன் தேவையில்லை? {/*why-doesnt-this-need-starttransition*/}

Convention படி, `startTransition`-க்குள் call செய்யப்படும் props "Action" என்று பெயரிடப்படுகின்றன.

`submitAction` "Action" என்ற பெயருடன் இருப்பதால், அது ஏற்கனவே `startTransition`-க்குள் call செய்யப்படுகிறது என்பதை நீங்கள் அறியலாம்.

Action prop pattern-க்கு [Components-இலிருந்து `action` prop expose செய்தல்](/reference/react/useTransition#exposing-action-props-from-components) பார்க்கவும்.

</DeepDive>

---

### Action props-க்கு optimistic state சேர்த்தல் {/*adding-optimistic-state-to-action-props*/}

[Action prop](/reference/react/useTransition#exposing-action-props-from-components) உருவாக்கும்போது, உடனடி feedback காட்ட `useOptimistic` சேர்க்கலாம்.

`action` pending இருக்கும் போது "Submit செய்யப்படுகிறது..." காட்டும் button இதோ:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import Button from './Button';
import { submitForm } from './actions.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button action={async () => {
        await submitForm();
        startTransition(() => {
          setCount(c => c + 1);
        });
      }}>அதிகரி</Button>
      {count > 0 && <p>{count} முறை submit செய்யப்பட்டது!</p>}
    </div>
  );
}
```

```js src/Button.js active
import { useOptimistic, startTransition } from 'react';

export default function Button({ action, children }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setIsPending(true);
          await action();
        });
      }}
    >
      {isPending ? 'Submit செய்யப்படுகிறது...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function submitForm() {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Button click செய்தால், `setIsPending(true)` optimistic state-ஐ பயன்படுத்தி உடனடியாக "Submit செய்யப்படுகிறது..." காட்டி button-ஐ disable செய்கிறது. Action முடிந்ததும், `isPending` தானாக `false` ஆக render ஆகிறது.

இந்த pattern, `Button` உடன் `action` prop எப்படி பயன்படுத்தப்பட்டாலும் pending state-ஐ தானாக காட்டுகிறது:

```js
// Show pending state for a state update
<Button action={() => { setState(c => c + 1) }} />

// Show pending state for a navigation
<Button action={() => { navigate('/done') }} />

// Show pending state for a POST
<Button action={async () => { await fetch(/* ... */) }} />

// Show pending state for any combination
<Button action={async () => {
  setState(c => c + 1);
  await fetch(/* ... */);
  navigate('/done');
}} />
```

`action` prop-இல் உள்ள அனைத்தும் முடியும் வரை pending state காட்டப்படும்.

<Note>

`isPending` மூலம் pending state பெற [`useTransition`](/reference/react/useTransition)-யையும் பயன்படுத்தலாம்.

வேறுபாடு: `useTransition` உங்களுக்கு `startTransition` function-ஐ தருகிறது; `useOptimistic` எந்த Transition உடனும் வேலை செய்கிறது. உங்கள் component தேவைகளுக்கு பொருந்துவது எதுவோ அதை பயன்படுத்துங்கள்.

</Note>

---

### Props அல்லது state-ஐ optimistically update செய்தல் {/*updating-props-or-state-optimistically*/}

Action நடந்து கொண்டிருக்கும்போது உடனடியாக update செய்ய props அல்லது state-ஐ `useOptimistic`-இல் wrap செய்யலாம்.

இந்த example-இல், `LikeButton` `isLiked`-ஐ prop ஆக receive செய்து click செய்தவுடன் அதை உடனடியாக toggle செய்கிறது:

<Sandpack>

```js src/App.js
import { useState, useOptimistic, startTransition } from 'react';
import { toggleLike } from './actions.js';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      const newValue = !optimisticIsLiked
      console.log('⏳ optimistic state set செய்கிறது: ' + newValue);

      setOptimisticIsLiked(newValue);
      const updatedValue = await toggleLike(newValue);

      startTransition(() => {
        console.log('⏳ real state set செய்கிறது: ' + updatedValue );
        setIsLiked(updatedValue);
      });
    });
  }

  if (optimisticIsLiked !== isLiked) {
    console.log('✅ optimistic state render ஆகிறது: ' + optimisticIsLiked);
  } else {
    console.log('✅ real value render ஆகிறது: ' + optimisticIsLiked);
  }


  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ விருப்பத்தை நீக்கு' : '🤍 விருப்பு தெரிவி'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike(value) {
  return await new Promise((res) => setTimeout(() => res(value), 1000));
  // In a real app, this would update the server
}
```

```js src/index.js hidden
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
// Not using StrictMode so double render logs are not shown.
root.render(<App />);
```

</Sandpack>

Button click செய்தால், heart liked ஆக காட்டப்படும் வகையில் displayed state-ஐ `setOptimisticIsLiked` உடனடியாக update செய்கிறது. அதே நேரத்தில், `await toggleLike` background-இல் run ஆகிறது. `await` முடிந்ததும், "real" `isLiked` state-ஐ `setIsLiked` parent update செய்கிறது, மேலும் இந்த புதிய value-க்கு match ஆக optimistic state render ஆகிறது.

<Note>

இந்த example, next value calculate செய்ய `optimisticIsLiked`-இலிருந்து read செய்கிறது. Base state மாறாது என்றால் இது வேலை செய்கிறது; ஆனால் உங்கள் Action pending இருக்கும்போது base state மாறக்கூடும் என்றால், state updater அல்லது reducer பயன்படுத்த விரும்பலாம்.

Example-க்கு [தற்போதைய state அடிப்படையில் state update செய்தல்](#updating-state-based-on-current-state) பார்க்கவும்.

</Note>

---

### பல values-ஐ ஒன்றாக update செய்தல் {/*updating-multiple-values-together*/}

ஒரு optimistic update பல related values-ஐ பாதித்தால், அவற்றை ஒன்றாக update செய்ய reducer பயன்படுத்துங்கள். இது UI consistent ஆக இருப்பதை உறுதி செய்கிறது.

Follow state மற்றும் follower count இரண்டையும் update செய்யும் follow button இதோ:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { followUser, unfollowUser } from './actions.js';
import FollowButton from './FollowButton';

export default function App() {
  const [user, setUser] = useState({
    name: 'React',
    isFollowing: false,
    followerCount: 10500
  });

  async function followAction(shouldFollow) {
    if (shouldFollow) {
      await followUser(user.name);
    } else {
      await unfollowUser(user.name);
    }
    startTransition(() => {
      setUser(current => ({
        ...current,
        isFollowing: shouldFollow,
        followerCount: current.followerCount + (shouldFollow ? 1 : -1)
      }));
    });
  }

  return <FollowButton user={user} followAction={followAction} />;
}
```

```js src/FollowButton.js active
import { useOptimistic, startTransition } from 'react';

export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p><strong>{user.name}</strong></p>
      <p>{optimisticState.followerCount} பின்தொடர்பவர்கள்</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow செய்' : 'Follow செய்'}
      </button>
    </div>
  );
}
```

```js src/actions.js hidden
export async function followUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}

export async function unfollowUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Reducer புதிய `isFollowing` value-ஐ receive செய்து, புதிய follow state மற்றும் updated follower count இரண்டையும் single update-இல் calculate செய்கிறது. இதனால் button text மற்றும் count எப்போதும் sync-இல் இருக்கும்.


<DeepDive>

#### Updaters மற்றும் reducers இடையே தேர்வு செய்தல் {/*choosing-between-updaters-and-reducers*/}

Current state அடிப்படையில் state calculate செய்ய `useOptimistic` இரண்டு patterns-ஐ support செய்கிறது:

**Updater functions** [useState updaters](/reference/react/useState#updating-state-based-on-the-previous-state) போல வேலை செய்கின்றன. Setter-க்கு function ஒன்றை pass செய்யுங்கள்:

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**Reducers** update logic-ஐ setter call-இலிருந்து பிரிக்கின்றன:

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Calculate next state based on current and action
});
dispatch(action);
```

Setter call இயல்பாக update-ஐ describe செய்யும் calculations-க்கு **updaters பயன்படுத்துங்கள்**. இது `useState` உடன் `setState(prev => ...)` பயன்படுத்துவதற்கு ஒத்தது.

Update-க்கு data pass செய்ய வேண்டியபோது (எந்த item சேர்க்க வேண்டும் போன்றது) அல்லது single hook கொண்டு பல update types handle செய்யும்போது **reducers பயன்படுத்துங்கள்**.

**Reducer ஏன் பயன்படுத்த வேண்டும்?**

உங்கள் Transition pending இருக்கும்போது base state மாறக்கூடும் என்றால் reducers அவசியம். Add pending இருக்கும்போது `todos` மாறினால் (உதாரணமாக, வேறு user todo சேர்த்தால்), என்ன காட்ட வேண்டும் என்பதை recalculate செய்ய React உங்கள் reducer-ஐ புதிய `todos` உடன் re-run செய்யும். இது outdated copy-க்கு பதிலாக latest list-இல் உங்கள் புதிய todo சேர்க்கப்படுவதை உறுதி செய்கிறது.

`setOptimistic(prev => [...prev, newItem])` போன்ற updater function, Transition தொடங்கியபோதைய state-ஐ மட்டும் பார்க்கும்; async work நடக்கும் போது ஏற்பட்ட updates-ஐ தவறவிடும்.

</DeepDive>

---

### List-இல் optimistically சேர்த்தல் {/*optimistically-adding-to-a-list*/}

List-இல் items-ஐ optimistically சேர்க்க வேண்டுமெனில், `reducer` பயன்படுத்துங்கள்:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React கற்றுக்கொள்' }
  ]);

  async function addTodoAction(newTodo) {
    const savedTodo = await addTodo(newTodo);
    startTransition(() => {
      setTodos(todos => [...todos, savedTodo]);
    });
  }

  return <TodoList todos={todos} addTodoAction={addTodoAction} />;
}
```

```js src/TodoList.js active
import { useOptimistic, startTransition } from 'react';

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: newTodo.id, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text: text };
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      await addTodoAction(newTodo);
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('புதிய todo')}>Todo சேர்க்கவும்</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && "(சேர்க்கப்படுகிறது...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  // In a real app, this would save to the server
  return { ...todo, pending: false };
}
```

</Sandpack>

`reducer` தற்போதைய todos list மற்றும் சேர்க்க வேண்டிய new todo-ஐ receive செய்கிறது. இது முக்கியம்; ஏனெனில் உங்கள் add pending இருக்கும்போது `todos` prop மாறினால் (உதாரணமாக, வேறு user todo சேர்த்தால்), updated list உடன் reducer-ஐ re-run செய்வதன் மூலம் React உங்கள் optimistic state-ஐ update செய்யும். இது outdated copy-க்கு பதிலாக latest list-இல் உங்கள் புதிய todo சேர்க்கப்படுவதை உறுதி செய்கிறது.

<Note>

ஒவ்வொரு optimistic item-உம் `pending: true` flag-ஐ கொண்டுள்ளது; அதனால் individual items-க்கு loading state காட்டலாம். Server respond செய்து parent saved item உடன் canonical `todos` list-ஐ update செய்ததும், pending flag இல்லாத confirmed item-க்கு optimistic state update ஆகிறது.

</Note>

---

### பல `action` types handle செய்தல் {/*handling-multiple-action-types*/}

பல வகை optimistic updates (items சேர்த்தல் மற்றும் நீக்குதல் போன்றவை) handle செய்ய வேண்டுமெனில், `action` objects உடன் reducer pattern பயன்படுத்துங்கள்.

இந்த shopping cart example, single reducer மூலம் add மற்றும் remove handle செய்வதை காட்டுகிறது:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addToCart, removeFromCart, updateQuantity } from './actions.js';
import ShoppingCart from './ShoppingCart';

export default function App() {
  const [cart, setCart] = useState([]);

  const cartActions = {
    async add(item) {
      await addToCart(item);
      startTransition(() => {
        setCart(current => {
          const exists = current.find(i => i.id === item.id);
          if (exists) {
            return current.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      });
    },
    async remove(id) {
      await removeFromCart(id);
      startTransition(() => {
        setCart(current => current.filter(item => item.id !== id));
      });
    },
    async updateQuantity(id, quantity) {
      await updateQuantity(id, quantity);
      startTransition(() => {
        setCart(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
    }
  };

  return <ShoppingCart cart={cart} cartActions={cartActions} />;
}
```

```js src/ShoppingCart.js active
import { useOptimistic, startTransition } from 'react';

export default function ShoppingCart({ cart, cartActions }) {
  const [optimisticCart, dispatch] = useOptimistic(
    cart,
    (currentCart, action) => {
      switch (action.type) {
        case 'add':
          const exists = currentCart.find(item => item.id === action.item.id);
          if (exists) {
            return currentCart.map(item =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity + 1, pending: true }
                : item
            );
          }
          return [...currentCart, { ...action.item, quantity: 1, pending: true }];
        case 'remove':
          return currentCart.filter(item => item.id !== action.id);
        case 'update_quantity':
          return currentCart.map(item =>
            item.id === action.id
              ? { ...item, quantity: action.quantity, pending: true }
              : item
          );
        default:
          return currentCart;
      }
    }
  );

  function handleAdd(item) {
    startTransition(async () => {
      dispatch({ type: 'add', item });
      await cartActions.add(item);
    });
  }

  function handleRemove(id) {
    startTransition(async () => {
      dispatch({ type: 'remove', id });
      await cartActions.remove(id);
    });
  }

  function handleUpdateQuantity(id, quantity) {
    startTransition(async () => {
      dispatch({ type: 'update_quantity', id, quantity });
      await cartActions.updateQuantity(id, quantity);
    });
  }

  const total = optimisticCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>கொள்முதல் வண்டி</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleAdd({
          id: 1, name: 'T-Shirt', price: 25
        })}>
          T-Shirt சேர் ($25)
        </button>{' '}
        <button onClick={() => handleAdd({
          id: 2, name: 'Mug', price: 15
        })}>
          Mug சேர் ($15)
        </button>
      </div>
      {optimisticCart.length === 0 ? (
        <p>உங்கள் cart காலியாக உள்ளது</p>
      ) : (
        <ul>
          {optimisticCart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} ×
              {item.quantity}
              {' '}= ${item.price * item.quantity}
              <button
                onClick={() => handleRemove(item.id)}
                style={{ marginLeft: 8 }}
              >
                நீக்கு
              </button>
              {item.pending && ' ...'}
            </li>
          ))}
        </ul>
      )}
      <p><strong>மொத்தம்: ${total}</strong></p>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addToCart(item) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function removeFromCart(id) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function updateQuantity(id, quantity) {
  await new Promise((res) => setTimeout(res, 800));
}
```

</Sandpack>

Reducer மூன்று `action` types (`add`, `remove`, `update_quantity`) handle செய்து, ஒவ்வொன்றிற்கும் புதிய optimistic state return செய்கிறது. ஒவ்வொரு `action`-மும் `pending: true` flag set செய்கிறது; இதனால் [Server Function](/reference/rsc/server-functions) run ஆகும்போது visual feedback காட்டலாம்.

---

### Error recovery உடன் optimistic ஆக நீக்குதல் {/*optimistic-delete-with-error-recovery*/}

Items-ஐ optimistically delete செய்யும்போது, Action fail ஆகும் சூழலை handle செய்ய வேண்டும்.

Delete fail ஆனால் error message எப்படி display செய்வது, மேலும் UI தானாக rollback ஆகி item-ஐ மீண்டும் காட்டுவது எப்படி என்பதை இந்த example காட்டுகிறது.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { deleteItem } from './actions.js';
import ItemList from './ItemList';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'React கற்றுக்கொள்' },
    { id: 2, name: 'App ஒன்றை build செய்' },
    { id: 3, name: 'Production-க்கு deploy செய்' },
  ]);

  async function deleteAction(id) {
    await deleteItem(id);
    startTransition(() => {
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  return <ItemList items={items} deleteAction={deleteAction} />;
}
```

```js src/ItemList.js active
import { useState, useOptimistic, startTransition } from 'react';

export default function ItemList({ items, deleteAction }) {
  const [error, setError] = useState(null);
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (currentItems, idToRemove) =>
      currentItems.map(item =>
        item.id === idToRemove
          ? { ...item, deleting: true }
          : item
      )
  );

  function handleDelete(id) {
    setError(null);
    startTransition(async () => {
      removeItem(id);
      try {
        await deleteAction(id);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div>
      <h2>உங்கள் items</h2>
      <ul>
        {optimisticItems.map(item => (
          <li
            key={item.id}
            style={{
              opacity: item.deleting ? 0.5 : 1,
              textDecoration: item.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }}
          >
            {item.name}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={item.deleting}
              style={{ marginLeft: 8 }}
            >
              {item.deleting ? 'நீக்கப்படுகிறது...' : 'நீக்கு'}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p style={{ color: 'red', padding: 8, background: '#fee' }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

```js src/actions.js hidden
export async function deleteItem(id) {
  await new Promise((res) => setTimeout(res, 1000));
  // Item 3 always fails to demonstrate error recovery
  if (id === 3) {
    throw new Error('நீக்க முடியாது. Permission denied.');
  }
}
```

</Sandpack>

'Production-க்கு deploy செய்' என்பதை delete செய்து பாருங்கள். Delete fail ஆனதும், item தானாக list-இல் மீண்டும் தோன்றும்.

---

## சிக்கல் தீர்த்தல் {/*troubleshooting*/}

### எனக்கு error வருகிறது: "An optimistic state update occurred outside a Transition or Action" {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

இந்த error-ஐ நீங்கள் பார்க்கலாம்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

An optimistic state update occurred outside a Transition or Action. To fix, move the update to an Action, or wrap with `startTransition`.

</ConsoleLogLine>

</ConsoleBlockMulti>

Optimistic setter function `startTransition`-க்குள் call செய்யப்பட வேண்டும்:

```js
// 🚩 Incorrect: outside a Transition
function handleClick() {
  setOptimistic(newValue);  // Warning!
  // ...
}

// ✅ Correct: inside a Transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Also correct: inside an Action prop
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

Action-க்கு வெளியே setter call செய்தால், optimistic state சிறிது நேரம் தோன்றி உடனே original value-க்கு திரும்பிவிடும். உங்கள் Action run ஆகும் போது optimistic state-ஐ "hold" செய்ய Transition இல்லாததால் இது நடக்கிறது.

### எனக்கு error வருகிறது: "Cannot update optimistic state while rendering" {/*cannot-update-optimistic-state-while-rendering*/}

இந்த error-ஐ நீங்கள் பார்க்கலாம்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Cannot update optimistic state while rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

Component-ன் render phase போது optimistic setter call செய்தால் இந்த error ஏற்படும். Event handlers, effects, அல்லது பிற callbacks-இலிருந்து மட்டுமே அதை call செய்யலாம்:

```js
// 🚩 Incorrect: calling during render
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // This runs during render - not allowed!
  setPending(true);

  // ...
}

// ✅ Correct: calling inside startTransition
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function handleClick() {
    startTransition(() => {
      setPending(true);
      // ...
    });
  }

  // ...
}

// ✅ Also correct: calling from an Action
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### என் optimistic updates பழைய values காட்டுகின்றன {/*my-optimistic-updates-show-stale-values*/}

உங்கள் optimistic state பழைய data அடிப்படையாக இருப்பது போலத் தோன்றினால், current state-க்கு relative ஆக optimistic state calculate செய்ய updater function அல்லது reducer பயன்படுத்தவும்.

```js
// May show stale data if state changes during Action
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // count மாறினாலும் எப்போதும் 5 ஆக set செய்கிறது

// Better: relative updates handle state changes correctly
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // தற்போதைய count எதுவாக இருந்தாலும் அதற்கு 1 சேர்க்கிறது
```

விவரங்களுக்கு [தற்போதைய state அடிப்படையில் state update செய்தல்](#updating-state-based-on-current-state) பார்க்கவும்.

### என் optimistic update pending ஆக உள்ளதா என தெரியவில்லை {/*i-dont-know-if-my-optimistic-update-is-pending*/}

`useOptimistic` எப்போது pending என்பதை அறிய உங்களுக்கு மூன்று options உள்ளன:

1. **`optimisticValue === value` என check செய்யுங்கள்**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

Values equal இல்லை என்றால், Transition ஒன்று நடந்து கொண்டிருக்கிறது.

2. **`useTransition` ஒன்றை சேர்க்கவும்**

```js
const [isPending, startTransition] = useTransition();
const [optimistic, setOptimistic] = useOptimistic(value);

//...
startTransition(() => {
  setOptimistic(state);
})
```

`useTransition` உள்ளார்ந்த முறையில் `isPending`-க்கு `useOptimistic` பயன்படுத்துவதால், இது option 1-க்கு சமமானது.

3. **உங்கள் reducer-இல் `pending` flag சேர்க்கவும்**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

ஒவ்வொரு optimistic item-க்கும் தனி flag இருப்பதால், individual items-க்கு loading state காட்டலாம்.
