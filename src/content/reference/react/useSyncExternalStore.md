---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` என்பது external store ஒன்றுக்கு subscribe செய்ய உதவும் React Hook ஆகும்.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

External data store-இலிருந்து value ஒன்றை படிக்க, உங்கள் component-ன் top level-இல் `useSyncExternalStore` call செய்யவும்.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

இது store-இல் உள்ள data-வின் snapshot-ஐ return செய்கிறது. நீங்கள் arguments ஆக இரண்டு functions அனுப்ப வேண்டும்:

1. `subscribe` function store-க்கு subscribe செய்து, unsubscribe செய்யும் function ஒன்றை return செய்ய வேண்டும்.
2. `getSnapshot` function store-இலிருந்து data snapshot ஒன்றை படிக்க வேண்டும்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `subscribe`: ஒற்றை `callback` argument-ஐ எடுத்து அதை store-க்கு subscribe செய்யும் function. Store மாறும்போது, வழங்கப்பட்ட `callback`-ஐ invoke செய்ய வேண்டும்; இதனால் React `getSnapshot`-ஐ மீண்டும் call செய்து, தேவைப்பட்டால் component-ஐ re-render செய்யும். `subscribe` function subscription-ஐ clean up செய்யும் function ஒன்றை return செய்ய வேண்டும்.

* `getSnapshot`: Component-க்கு தேவையான store data-வின் snapshot-ஐ return செய்யும் function. Store மாறாதவரை, `getSnapshot`-க்கு மீண்டும் மீண்டும் வரும் calls அதே value-ஐ return செய்ய வேண்டும். Store மாறி, return செய்யப்பட்ட value வேறுபட்டிருந்தால் ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) மூலம் ஒப்பிடப்படுகிறது), React component-ஐ re-render செய்கிறது.

* **optional** `getServerSnapshot`: Store data-வின் initial snapshot-ஐ return செய்யும் function. இது server rendering போது மற்றும் server-rendered content client-இல் hydration ஆகும் போது மட்டுமே பயன்படுத்தப்படும். Server snapshot client மற்றும் server இடையே ஒன்றாகவே இருக்க வேண்டும்; பொதுவாக அது serialize செய்யப்பட்டு server-இலிருந்து client-க்கு அனுப்பப்படும். இந்த argument-ஐ விடுவிட்டால், component-ஐ server-இல் render செய்வது error throw செய்யும்.

#### Returns {/*returns*/}

உங்கள் rendering logic-இல் பயன்படுத்தக்கூடிய store-ன் தற்போதைய snapshot.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `getSnapshot` return செய்யும் store snapshot immutable ஆக இருக்க வேண்டும். அடிப்படையான store mutable data கொண்டிருந்தால், data மாறியிருந்தால் புதிய immutable snapshot-ஐ return செய்யவும். இல்லையெனில், cached last snapshot-ஐ return செய்யவும்.

* Re-render போது வேறு `subscribe` function அனுப்பப்பட்டால், React புதியதாக அனுப்பப்பட்ட `subscribe` function-ஐப் பயன்படுத்தி store-க்கு மீண்டும் subscribe செய்யும். இதைத் தவிர்க்க, `subscribe`-ஐ component-க்கு வெளியே declare செய்யலாம்.

* [Non-blocking Transition update](/reference/react/useTransition) போது store mutate செய்யப்பட்டால், React அந்த update-ஐ blocking ஆகச் செய்யும் நிலைக்கு fallback செய்யும். குறிப்பாக, ஒவ்வொரு Transition update-க்கும், DOM-க்கு changes apply செய்வதற்கு முன் React `getSnapshot`-ஐ இரண்டாவது முறை call செய்யும். அது முதலில் call செய்யப்பட்டபோது இருந்த value-யிலிருந்து வேறு value return செய்தால், React update-ஐ scratch-இலிருந்து restart செய்து, இந்த முறை blocking update ஆக apply செய்யும்; இதனால் screen-இல் உள்ள ஒவ்வொரு component-உம் store-ன் அதே version-ஐ பிரதிபலிக்கிறது என்பதை உறுதிசெய்யும்.

* `useSyncExternalStore` return செய்யும் store value அடிப்படையில் render-ஐ _suspend_ செய்வது பரிந்துரைக்கப்படவில்லை. காரணம், external store-க்கு mutations-ஐ [non-blocking Transition updates](/reference/react/useTransition) ஆக mark செய்ய முடியாது; ஆகவே அவை அருகிலுள்ள [`Suspense` fallback](/reference/react/Suspense)-ஐ trigger செய்து, screen-இல் ஏற்கனவே rendered content-ஐ loading spinner-ஆல் மாற்றும். இது பொதுவாக மோசமான UX ஆகும்.

  உதாரணமாக, கீழ்கண்டவை discouraged:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## பயன்பாடு {/*usage*/}

### External store-க்கு subscribe செய்தல் {/*subscribing-to-an-external-store*/}

உங்கள் பெரும்பாலான React components data-வை அவற்றின் [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) மற்றும் [context](/reference/react/useContext)-இலிருந்தே படிக்கும். ஆனால் சில நேரங்களில், காலப்போக்கில் மாறும் React-க்கு வெளியே உள்ள store ஒன்றிலிருந்து component சில data-வை படிக்க வேண்டும். இதில் அடங்குபவை:

* React-க்கு வெளியே state வைத்திருக்கும் third-party state management libraries.
* Mutable value ஒன்றையும் அதன் changes-க்கு subscribe செய்ய events-ஐயும் expose செய்யும் Browser APIs.

External data store-இலிருந்து value ஒன்றை படிக்க, உங்கள் component-ன் top level-இல் `useSyncExternalStore` call செய்யவும்.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

இது store-இல் உள்ள data-வின் <CodeStep step={3}>snapshot</CodeStep>-ஐ return செய்கிறது. நீங்கள் arguments ஆக இரண்டு functions அனுப்ப வேண்டும்:

1. <CodeStep step={1}>`subscribe` function</CodeStep> store-க்கு subscribe செய்து, unsubscribe செய்யும் function ஒன்றை return செய்ய வேண்டும்.
2. <CodeStep step={2}>`getSnapshot` function</CodeStep> store-இலிருந்து data snapshot ஒன்றை படிக்க வேண்டும்.

உங்கள் component store-க்கு subscribed ஆக இருக்கவும், changes வந்தால் re-render ஆகவும் React இந்த functions-ஐப் பயன்படுத்தும்.

உதாரணமாக, கீழே உள்ள sandbox-இல், `todosStore` React-க்கு வெளியே data சேமிக்கும் external store ஆக implement செய்யப்பட்டுள்ளது. `TodosApp` component, `useSyncExternalStore` Hook மூலம் அந்த external store-க்கு connect ஆகிறது.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Todo சேர்க்க</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

முடிந்தவரை, [`useState`](/reference/react/useState) மற்றும் [`useReducer`](/reference/react/useReducer) உடன் built-in React state பயன்படுத்த பரிந்துரைக்கிறோம். Existing non-React code உடன் integrate செய்ய வேண்டியிருந்தால் `useSyncExternalStore` API பெரும்பாலும் பயனுள்ளதாக இருக்கும்.

</Note>

---

### Browser API-க்கு subscribe செய்தல் {/*subscribing-to-a-browser-api*/}

காலப்போக்கில் மாறும் browser expose செய்யும் value ஒன்றுக்கு subscribe செய்ய விரும்பும்போது `useSyncExternalStore` சேர்க்கும் மற்றொரு காரணம் கிடைக்கும். உதாரணமாக, network connection active ஆக உள்ளதா என்பதை உங்கள் component display செய்ய வேண்டுமென்று நினைக்கலாம். Browser இந்த தகவலை [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) என்ற property மூலம் expose செய்கிறது.

இந்த value React அறியாமல் மாறக்கூடும்; எனவே அதை `useSyncExternalStore` மூலம் படிக்க வேண்டும்.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`getSnapshot` function-ஐ implement செய்ய, browser API-இலிருந்து current value-ஐ படிக்கவும்:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

அடுத்து, `subscribe` function-ஐ implement செய்ய வேண்டும். உதாரணமாக, `navigator.onLine` மாறும்போது, browser `window` object-இல் [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) மற்றும் [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events fire செய்கிறது. `callback` argument-ஐ தொடர்புடைய events-க்கு subscribe செய்து, பிறகு subscriptions-ஐ clean up செய்யும் function ஒன்றை return செய்ய வேண்டும்:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

இப்போது external `navigator.onLine` API-இலிருந்து value-ஐ எப்படி படிக்க வேண்டும், அதன் changes-க்கு எப்படி subscribe செய்ய வேண்டும் என்பதை React அறியும். உங்கள் device-ஐ network-இலிருந்து disconnect செய்து, அதற்கு பதிலாக component re-render ஆகும் என்பதை கவனிக்கவும்:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Logic-ஐ custom Hook-க்கு பிரித்தெடுத்தல் {/*extracting-the-logic-to-a-custom-hook*/}

பொதுவாக உங்கள் components-இல் `useSyncExternalStore`-ஐ நேரடியாக எழுத மாட்டீர்கள். அதற்கு பதிலாக, உங்கள் சொந்த custom Hook-இலிருந்து அதை call செய்வீர்கள். இது ஒரே external store-ஐ வெவ்வேறு components-இலிருந்து பயன்படுத்த உதவுகிறது.

உதாரணமாக, இந்த custom `useOnlineStatus` Hook network online ஆக உள்ளதா என்பதை track செய்கிறது:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

இப்போது வெவ்வேறு components underlying implementation-ஐ repeat செய்யாமல் `useOnlineStatus` call செய்யலாம்:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ முன்னேற்றம் சேமிக்கப்பட்டது');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'முன்னேற்றத்தை சேமி' : 'மீண்டும் இணைக்கிறது...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Server rendering-க்கு support சேர்த்தல் {/*adding-support-for-server-rendering*/}

உங்கள் React app [server rendering](/reference/react-dom/server) பயன்படுத்தினால், initial HTML உருவாக்க உங்கள் React components browser environment-க்கு வெளியிலும் run ஆகும். External store-க்கு connect செய்யும்போது இது சில சவால்களை உருவாக்குகிறது:

- Browser-only API-க்கு connect செய்தால், அது server-இல் இல்லாததால் வேலை செய்யாது.
- Third-party data store-க்கு connect செய்தால், அதன் data server மற்றும் client இடையே match ஆக வேண்டும்.

இந்த சிக்கல்களைத் தீர்க்க, `useSyncExternalStore`-க்கு மூன்றாவது argument ஆக `getServerSnapshot` function ஒன்றை அனுப்பவும்:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Server-generated HTML-க்கு எப்போதும் "Online" காட்டவும்
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot` function `getSnapshot`-க்கு ஒத்ததாக இருக்கும்; ஆனால் இரண்டு சூழல்களில் மட்டுமே run ஆகும்:

- HTML generate செய்யும்போது அது server-இல் run ஆகும்.
- [Hydration](/reference/react-dom/client/hydrateRoot) போது client-இல் run ஆகும்; அதாவது React server HTML-ஐ எடுத்து interactive ஆக்கும் போது.

App interactive ஆகும்முன் பயன்படுத்தப்படும் initial snapshot value-ஐ இது வழங்க உதவுகிறது. Server rendering-க்கு அர்த்தமுள்ள initial value இல்லை என்றால், [client-இல் rendering force செய்ய](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) இந்த argument-ஐ விடுங்கள்.

<Note>

`getServerSnapshot` server-இல் return செய்த அதே data-வை initial client render-இலும் return செய்கிறது என்பதை உறுதிசெய்யவும். உதாரணமாக, `getServerSnapshot` server-இல் prepopulated store content return செய்திருந்தால், அந்த content-ஐ client-க்கு transfer செய்ய வேண்டும். இதைச் செய்யும் ஒரு வழி, server rendering போது `window.MY_STORE_DATA` போன்ற global ஒன்றை set செய்யும் `<script>` tag emit செய்து, client-இல் `getServerSnapshot` உள்ளே அந்த global-இலிருந்து படிப்பது. உங்கள் external store இதை எப்படி செய்வது என்பதைப் பற்றிய instructions வழங்க வேண்டும்.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### எனக்கு error வருகிறது: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

இந்த error உங்கள் `getSnapshot` function ஒவ்வொரு முறை call செய்யும்போதும் புதிய object return செய்கிறது என்பதைக் குறிக்கிறது, உதாரணமாக:

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

`getSnapshot` return value கடந்த முறை இருந்ததை விட வேறுபட்டிருந்தால் React component-ஐ re-render செய்யும். அதனால் தான், எப்போதும் வேறு value return செய்தால், infinite loop-இல் சென்று இந்த error கிடைக்கும்.

உங்கள் `getSnapshot` object, ஏதாவது உண்மையில் மாறியிருந்தால் மட்டுமே வேறு object return செய்ய வேண்டும். உங்கள் store immutable data கொண்டிருந்தால், அந்த data-வை நேரடியாக return செய்யலாம்:

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

உங்கள் store data mutable ஆக இருந்தால், உங்கள் `getSnapshot` function அதற்கான immutable snapshot-ஐ return செய்ய வேண்டும். இதன் அர்த்தம் அது புதிய objects உருவாக்க *வேண்டும்*; ஆனால் ஒவ்வொரு call-க்கும் இதைச் செய்யக்கூடாது. அதற்கு பதிலாக, கடைசியாக கணக்கிடப்பட்ட snapshot-ஐ store செய்து, store-இல் data மாறவில்லை என்றால் கடந்த முறை இருந்த அதே snapshot-ஐ return செய்ய வேண்டும். Mutable data மாறியுள்ளதா என்பதை நீங்கள் எப்படி தீர்மானிப்பது, உங்கள் mutable store-ஐப் பொறுத்தது.

---

### ஒவ்வொரு re-render-க்கும் என் `subscribe` function call ஆகிறது {/*my-subscribe-function-gets-called-after-every-re-render*/}

இந்த `subscribe` function component-க்கு *உள்ளே* define செய்யப்பட்டதால் ஒவ்வொரு re-render-க்கும் அது வேறுபட்டதாக இருக்கும்:

```js {2-5}
function ChatIndicator() {
  // 🚩 Always a different function, so React will resubscribe on every re-render
  function subscribe() {
    // ...
  }

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

Re-renders இடையில் வேறு `subscribe` function அனுப்பினால் React உங்கள் store-க்கு resubscribe செய்யும். இது performance சிக்கல்களை ஏற்படுத்தி, resubscribe செய்வதைத் தவிர்க்க விரும்பினால், `subscribe` function-ஐ வெளியே நகர்த்தவும்:

```js {1-4}
// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

மாற்றாக, ஏதாவது argument மாறும்போது மட்டுமே resubscribe செய்ய `subscribe`-ஐ [`useCallback`](/reference/react/useCallback)-க்குள் wrap செய்யலாம்:

```js {2-5}
function ChatIndicator({ userId }) {
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
