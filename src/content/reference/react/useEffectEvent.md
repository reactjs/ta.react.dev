---
title: useEffectEvent
---

<Intro>

Events-ஐ Effects-இலிருந்து பிரிக்க உதவும் React Hook தான் `useEffectEvent`.

```js
const onEvent = useEffectEvent(callback)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Effect Event ஒன்றை உருவாக்க, உங்கள் component-ன் top level-இல் `useEffectEvent` call செய்யவும்.

```js {4,6}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('இணைக்கப்பட்டது!', theme);
  });
}
```

Effect Events உங்கள் Effect logic-ன் ஒரு பகுதியாகும்; ஆனால் அவை event handler போல நடக்கின்றன. Effect-ஐ மீண்டும் synchronize செய்யாமல், render-இலிருந்து latest values-ஐ (props மற்றும் state போன்றவை) எப்போதும் "பார்க்கும்"; ஆகவே அவை Effect dependencies-இலிருந்து exclude செய்யப்படுகின்றன. மேலும் அறிய [Events-ஐ Effects-இலிருந்து பிரித்தல்](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects)-ஐ பார்க்கவும்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `callback`: உங்கள் Effect Event-க்கான logic கொண்ட function. இந்த function எந்த எண்ணிக்கையிலான arguments-யும் ஏற்கலாம், எந்த value-யும் return செய்யலாம். Return செய்யப்பட்ட Effect Event function-ஐ நீங்கள் call செய்யும்போது, call நேரத்தில் render-இலிருந்து latest committed values-ஐ `callback` எப்போதும் access செய்யும்.

#### Returns {/*returns*/}

`useEffectEvent`, உங்கள் `callback` போலவே அதே type signature கொண்ட Effect Event function ஒன்றை return செய்கிறது.

இந்த function-ஐ `useEffect`, `useLayoutEffect`, `useInsertionEffect` உள்ளே, அல்லது அதே component-இல் உள்ள மற்ற Effect Events உள்ளிருந்து call செய்யலாம்.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `useEffectEvent` ஒரு Hook; ஆகவே அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component ஒன்றை extract செய்து Effect Event-ஐ அதற்குள் நகர்த்தவும்.
* Effect Events, Effects உள்ளிருந்து அல்லது மற்ற Effect Events உள்ளிருந்து மட்டுமே call செய்யப்படலாம். Rendering போது அவற்றை call செய்ய வேண்டாம்; மற்ற components அல்லது Hooks-க்கு pass செய்ய வேண்டாம். [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) linter இந்த restriction-ஐ enforce செய்கிறது.
* உங்கள் Effect-ன் dependency array-இல் dependencies குறிப்பிடுவதைத் தவிர்க்க `useEffectEvent` பயன்படுத்த வேண்டாம். இது bugs மறைக்கிறது மற்றும் code புரிந்துகொள்ள கடினமாக்குகிறது. Effects-இலிருந்து உண்மையில் fire ஆகும் event logic-க்கு மட்டுமே இதைப் பயன்படுத்தவும்.
* Effect Event functions-க்கு stable identity இல்லை. அவற்றின் identity ஒவ்வொரு render-க்கும் திட்டமிட்டு மாறுகிறது.

<DeepDive>

#### Effect Events ஏன் stable அல்ல? {/*why-are-effect-events-not-stable*/}

`useState`-இன் `set` functions அல்லது refs போல அல்லாமல், Effect Event functions-க்கு stable identity இல்லை. அவற்றின் identity ஒவ்வொரு render-க்கும் திட்டமிட்டு மாறுகிறது:

```js
// 🔴 Wrong: including Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]); // இதைப் பற்றி ESLint warn செய்யும்
```

இது deliberate design choice. Effect Events அதே component-இலுள்ள Effects உள்ளிருந்து மட்டுமே call செய்யப்பட வேண்டியவை. அவற்றை local-ஆக மட்டுமே call செய்ய முடியும், மற்ற components-க்கு pass செய்யவோ dependency arrays-இல் சேர்க்கவோ முடியாது; ஆகவே stable identity எந்த பயனும் தராது, மாறாக bugs-ஐ mask செய்யும்.

Non-stable identity runtime assertion போல செயல்படுகிறது: உங்கள் code தவறாக function identity-ஐ சார்ந்திருந்தால், ஒவ்வொரு render-க்கும் Effect மீண்டும் run ஆகுவது தெரியும்; bug தெளிவாகும்.

இந்த design, Effect Events conceptually குறிப்பிட்ட effect-க்கு சொந்தமானவை; reactivity-யிலிருந்து opt out செய்யும் general purpose API அல்ல என்பதை வலுப்படுத்துகிறது.

</DeepDive>

---

## பயன்பாடு {/*usage*/}


### Effect-இல் event பயன்படுத்துதல் {/*using-an-event-in-an-effect*/}

*Effect Event* ஒன்றை உருவாக்க, உங்கள் component-ன் top level-இல் `useEffectEvent` call செய்யவும்:


```js [[1, 1, "onConnected"]]
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('இணைக்கப்பட்டது!');
  }
});
```

`useEffectEvent` ஒரு `event callback`-ஐ accept செய்து <CodeStep step={1}>Effect Event</CodeStep>-ஐ return செய்கிறது. Effect Event என்பது Effect-ஐ மீண்டும் connect செய்யாமல் Effects உள்ளே call செய்யக்கூடிய function:

```js [[1, 3, "onConnected"]]
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

`onConnected` ஒரு <CodeStep step={1}>Effect Event</CodeStep> என்பதால், `muted` மற்றும் `onConnect` Effect dependencies-இல் இல்லை.

<Pitfall>

##### Dependencies தவிர்க்க Effect Events பயன்படுத்த வேண்டாம் {/*pitfall-skip-dependencies*/}

"தேவையற்றவை" என்று நீங்கள் நினைக்கும் dependencies list செய்வதைத் தவிர்க்க `useEffectEvent` பயன்படுத்துவது கவர்ச்சியாக இருக்கலாம். ஆனால் இது bugs மறைக்கிறது மற்றும் code புரிந்துகொள்ள கடினமாக்குகிறது:

```js
// 🔴 Wrong: Using Effect Events to hide dependencies
const logVisit = useEffectEvent(() => {
  log(pageUrl);
});

useEffect(() => {
  logVisit()
}, []); // pageUrl இல்லாததால் logs தவறவிடப்படுகின்றன
```

ஒரு value உங்கள் Effect மீண்டும் run ஆக காரணமாக இருக்க வேண்டுமெனில், அதை dependency ஆக வைத்திருங்கள். உங்கள் Effect-ஐ உண்மையில் re-trigger செய்யக்கூடாத logic-க்கு மட்டுமே Effect Events பயன்படுத்தவும்.

மேலும் அறிய [Events-ஐ Effects-இலிருந்து பிரித்தல்](/learn/separating-events-from-effects)-ஐ பார்க்கவும்.

</Pitfall>

---

### Latest values உடன் timer பயன்படுத்துதல் {/*using-a-timer-with-latest-values*/}

Effect-இல் `setInterval` அல்லது `setTimeout` பயன்படுத்தும்போது, அந்த values மாறும்போதெல்லாம் timer restart ஆகாமல் render-இலிருந்து latest values-ஐ படிக்க நீங்கள் அடிக்கடி விரும்புவீர்கள்.

இந்த counter, ஒவ்வொரு second-க்கும் current `increment` value அளவுக்கு `count`-ஐ increment செய்கிறது. Interval restart ஆகாமல், `onTick` Effect Event latest `count` மற்றும் `increment`-ஐ படிக்கிறது:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        ஒவ்வொரு second-க்கும் increment செய்யும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Timer run ஆகிக்கொண்டிருக்கும்போது increment value-ஐ மாற்றி பாருங்கள். Counter உடனே புதிய increment value-ஐ பயன்படுத்தும்; ஆனால் timer restart ஆகாமல் smooth ஆக tick செய்து கொண்டிருக்கும்.

---

### Latest values உடன் event listener பயன்படுத்துதல் {/*using-an-event-listener-with-latest-values*/}

Effect-இல் event listener set up செய்யும்போது, callback-இல் render-இலிருந்து latest values-ஐ படிக்க அடிக்கடி தேவைப்படும். `useEffectEvent` இல்லாமல், அந்த values-ஐ dependencies-இல் சேர்க்க வேண்டியிருக்கும்; இதனால் ஒவ்வொரு change-க்கும் listener remove செய்யப்பட்டு மீண்டும் add செய்யப்படும்.

இந்த example cursor-ஐ பின்தொடரும் dot-ஐ காட்டுகிறது; ஆனால் "புள்ளி நகரலாம்" checked ஆக இருந்தால் மட்டுமே. Effect மீண்டும் run ஆகாமல், `onMove` Effect Event எப்போதும் latest `canMove` value-ஐ படிக்கிறது:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        புள்ளி நகர அனுமதி உள்ளது
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Checkbox toggle செய்து cursor-ஐ நகர்த்துங்கள். Dot checkbox state-க்கு உடனடியாக பதிலளிக்கும்; ஆனால் component mount ஆகும்போது event listener ஒருமுறை மட்டுமே set up செய்யப்படும்.

---

### External systems-க்கு reconnect செய்வதைத் தவிர்த்தல் {/*showing-a-notification-without-reconnecting*/}

Effect-க்கு பதிலாக ஏதாவது செய்ய விரும்பும்போது, ஆனால் அந்த "ஏதாவது" நீங்கள் react செய்ய விரும்பாத value ஒன்றைச் சார்ந்திருக்கும்போது `useEffectEvent`-ன் common use case தோன்றுகிறது.

இந்த example-இல், chat component ஒரு room-க்கு connect ஆகி connected ஆனபோது notification காட்டுகிறது. User checkbox மூலம் notifications mute செய்யலாம். ஆனால் user settings மாற்றும் ஒவ்வொரு முறையும் chat room-க்கு reconnect ஆக வேண்டாம்:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect, useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    console.log('✅ ' + roomId + ' உடன் இணைக்கப்பட்டது (muted: ' + muted + ')');
    if (!muted) {
      showNotification(roomId + ' உடன் இணைக்கப்பட்டது');
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ ' + roomId + ' உடன் இணைக்கிறது...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ ' + roomId + ' இலிருந்து துண்டிக்கப்பட்டது');
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);
  return (
    <>
      <label>
        Chat room தேர்வு செய்யவும்:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        Notifications-ஐ mute செய்
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        muted={muted}
      />
    </>
  );
}
```

```js src/chat.js
const serverUrl = 'https://localhost:1234';

export function createConnection(roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Handler-ஐ இருமுறை சேர்க்க முடியாது.');
      }
      if (event !== 'connected') {
        throw Error('"connected" event மட்டுமே supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Rooms மாற்றி பாருங்கள். Chat reconnect ஆகி notification காட்டும். இப்போது notifications-ஐ mute செய்யுங்கள். `muted` Effect-க்குள் அல்ல, Effect Event-க்குள் read செய்யப்படுவதால் chat connected ஆகவே இருக்கும்.

---

### Custom Hooks-இல் Effect Events பயன்படுத்துதல் {/*using-effect-events-in-custom-hooks*/}

உங்கள் சொந்த custom Hooks-க்குள் `useEffectEvent` பயன்படுத்தலாம். இது சில values-ஐ non-reactive ஆக வைத்தபடி Effects-ஐ encapsulate செய்யும் reusable Hooks உருவாக்க உதவுகிறது:

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Counter({ incrementBy }) {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + incrementBy);
  }, 1000);

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>ஒவ்வொரு second-க்கும் {incrementBy} அளவுக்கு increment செய்கிறது</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        Increment அளவு:{' '}
        <select
          value={incrementBy}
          onChange={(e) => setIncrementBy(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </label>
      <hr />
      <Counter incrementBy={incrementBy} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

இந்த example-இல், `useInterval` interval ஒன்றை set up செய்யும் custom Hook. அதற்கு pass செய்யப்பட்ட `callback` Effect Event-ஆக wrap செய்யப்பட்டுள்ளது; எனவே ஒவ்வொரு render-க்கும் புதிய `callback` pass செய்யப்பட்டாலும் interval reset ஆகாது.

---

## Troubleshooting {/*troubleshooting*/}

### எனக்கு error வருகிறது: "A function wrapped in useEffectEvent can't be called during rendering" {/*cant-call-during-rendering*/}

இந்த error, உங்கள் component-ன் render phase போது Effect Event function-ஐ call செய்கிறீர்கள் என்பதைக் குறிக்கிறது. Effect Events Effects அல்லது மற்ற Effect Events உள்ளிருந்து மட்டுமே call செய்யப்படலாம்.

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Wrong: calling during render
  onLog();

  // ✅ Correct: call from an Effect
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

Render போது logic run செய்ய வேண்டுமெனில், அதை `useEffectEvent`-இல் wrap செய்ய வேண்டாம். Logic-ஐ நேரடியாக call செய்யவும் அல்லது Effect-க்குள் நகர்த்தவும்.

---

### எனக்கு lint error வருகிறது: "Functions returned from useEffectEvent must not be included in the dependency array" {/*effect-event-in-deps*/}

"Functions returned from `useEffectEvent` must not be included in the dependency array" போன்ற warning கண்டால், உங்கள் dependencies-இலிருந்து Effect Event-ஐ remove செய்யவும்:

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Wrong: Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Correct: no Effect Event in dependencies
useEffect(() => {
  onSomething();
}, []);
```

Effect Events dependencies ஆக list செய்யப்படாமல் Effects-இலிருந்து call செய்யப்படுவதற்காக design செய்யப்பட்டவை. Function identity [திட்டமிட்டு stable அல்ல](#why-are-effect-events-not-stable) என்பதால் linter இதை enforce செய்கிறது. அதைச் சேர்த்தால் உங்கள் Effect ஒவ்வொரு render-க்கும் மீண்டும் run ஆகும்.

---

### எனக்கு lint error வருகிறது: "... is a function created with useEffectEvent, and can only be called from Effects" {/*effect-event-called-outside-effect*/}

"... is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events" போன்ற warning கண்டால், function-ஐ தவறான இடத்திலிருந்து call செய்கிறீர்கள்:

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Wrong: calling from event handler
function handleClick() {
  onSomething();
}

// 🔴 Wrong: passing to child component
return <Child onSomething={onSomething} />;

// ✅ Correct: calling from Effect
useEffect(() => {
  onSomething();
}, []);
```

Effect Events அவை define செய்யப்பட்ட component-க்கு local ஆன Effects-இல் பயன்படுத்தப்படுவதற்காகவே வடிவமைக்கப்பட்டவை. Event handlers-க்கு callback தேவைப்பட்டாலோ children-க்கு pass செய்ய வேண்டுமானாலோ, அதற்கு பதிலாக regular function அல்லது `useCallback` பயன்படுத்தவும்.
