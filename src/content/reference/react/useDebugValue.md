---
title: useDebugValue
---

<Intro>

`useDebugValue` என்பது [React DevTools](/learn/react-developer-tools)-இல் custom Hook ஒன்றுக்கு label சேர்க்க உதவும் React Hook.

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

வாசிக்கக்கூடிய debug value ஒன்றைக் காட்ட, உங்கள் [custom Hook](/learn/reusing-logic-with-custom-hooks)-இன் top level-இல் `useDebugValue`-ஐ அழைக்கவும்:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `value`: React DevTools-இல் காட்ட விரும்பும் value. இது எந்த type-ஆகவும் இருக்கலாம்.
* **optional** `format`: Formatting function. Component inspect செய்யப்படும் போது, React DevTools இந்த formatting function-ஐ `value` argument-உடன் அழைத்து, return செய்யப்படும் formatted value-ஐ (அதுவும் எந்த type-ஆகவும் இருக்கலாம்) காட்டும். Formatting function குறிப்பிடவில்லை என்றால், அசல் `value` தானே காட்டப்படும்.

#### Returns {/*returns*/}

`useDebugValue` எதையும் return செய்யாது.

## Usage {/*usage*/}

### Custom Hook-க்கு label சேர்த்தல் {/*adding-a-label-to-a-custom-hook*/}

[React DevTools](/learn/react-developer-tools)-க்காக வாசிக்கக்கூடிய <CodeStep step={1}>debug value</CodeStep> காட்ட, உங்கள் [custom Hook](/learn/reusing-logic-with-custom-hooks)-இன் top level-இல் `useDebugValue`-ஐ அழைக்கவும்.

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

`useOnlineStatus`-ஐ அழைக்கும் components-ஐ inspect செய்யும்போது, அவற்றுக்கு `OnlineStatus: "Online"` போன்ற label கிடைக்கும்:

![Debug value-ஐ காட்டும் React DevTools screenshot](/images/docs/react-devtools-usedebugvalue.png)

`useDebugValue` call இல்லாமல், underlying data மட்டும் (இந்த உதாரணத்தில் `true`) காட்டப்படும்.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

ஒவ்வொரு custom Hook-க்கும் debug values சேர்க்க வேண்டாம். Shared libraries-இன் பகுதியாக உள்ள, inspect செய்ய கடினமான complex internal data structure கொண்ட custom Hooks-க்கு இது மிகவும் மதிப்புடையது.

</Note>

---

### Debug value formatting-ஐ தள்ளிப்போடுதல் {/*deferring-formatting-of-a-debug-value*/}

`useDebugValue`-க்கு இரண்டாவது argument ஆக formatting function ஒன்றையும் pass செய்யலாம்:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

உங்கள் formatting function <CodeStep step={1}>debug value</CodeStep>-ஐ parameter ஆகப் பெற்று, <CodeStep step={2}>formatted display value</CodeStep>-ஐ return செய்ய வேண்டும். உங்கள் component inspect செய்யப்படும் போது, React DevTools இந்த function-ஐ அழைத்து அதன் result-ஐ காட்டும்.

Component உண்மையில் inspect செய்யப்படாவிட்டால் potentially expensive formatting logic ஓடுவதை இதனால் தவிர்க்கலாம். உதாரணமாக, `date` ஒரு Date value என்றால், ஒவ்வொரு render-க்கும் அதில் `toDateString()` அழைப்பதை இது தவிர்க்கிறது.
