---
title: Escape Hatches (React-க்கு வெளியே செல்லும் வழிகள்)
---

<Intro>

உங்கள் சில components React-க்கு வெளியே உள்ள systems-ஐ control செய்து அவற்றுடன் synchronize செய்ய வேண்டியிருக்கும். உதாரணமாக, browser API பயன்படுத்தி input-ஐ focus செய்ய வேண்டியிருக்கலாம், React இல்லாமல் implemented செய்யப்பட்ட video player-ஐ play மற்றும் pause செய்ய வேண்டியிருக்கலாம், அல்லது remote server-இலிருந்து messages-ஐ connect செய்து listen செய்ய வேண்டியிருக்கலாம். இந்த chapter-இல், React-க்கு "வெளியே செல்ல" மற்றும் external systems-க்கு connect செய்ய உதவும் escape hatches-ஐ கற்றுக்கொள்வீர்கள். உங்கள் application logic மற்றும் data flow-ன் பெரும்பகுதி இந்த features-ஐ சார்ந்து இருக்கக்கூடாது.

</Intro>

<YouWillLearn isChapter={true}>

* [Re-render செய்யாமல் தகவலை "நினைவில்" வைத்திருப்பது எப்படி](/learn/referencing-values-with-refs)
* [React manage செய்யும் DOM elements-ஐ access செய்வது எப்படி](/learn/manipulating-the-dom-with-refs)
* [Components-ஐ external systems-உடன் synchronize செய்வது எப்படி](/learn/synchronizing-with-effects)
* [உங்கள் components-இலிருந்து தேவையற்ற Effects-ஐ remove செய்வது எப்படி](/learn/you-might-not-need-an-effect)
* [Effect-ன் lifecycle component-ன் lifecycle-இலிருந்து எப்படி வேறுபடுகிறது](/learn/lifecycle-of-reactive-effects)
* [சில values Effects-ஐ மீண்டும் trigger செய்வதைத் தடுப்பது எப்படி](/learn/separating-events-from-effects)
* [உங்கள் Effect குறைவாக re-run ஆக செய்வது எப்படி](/learn/removing-effect-dependencies)
* [Components இடையே logic பகிர்வது எப்படி](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Refs மூலம் values-ஐ reference செய்தல் {/*referencing-values-with-refs*/}

ஒரு component சில தகவலை "நினைவில்" வைத்திருக்க வேண்டும், ஆனால் அந்த தகவல் [புதிய renders-ஐ trigger](/learn/render-and-commit) செய்ய வேண்டாம் என்றால், *ref* ஒன்றைப் பயன்படுத்தலாம்:

```js
const ref = useRef(0);
```

State போலவே, refs re-renders இடையே React-ஆல் retained ஆகின்றன. ஆனால் state set செய்தால் component re-render ஆகும். Ref மாற்றினால் re-render ஆகாது! அந்த ref-ன் current value-ஐ `ref.current` property மூலம் access செய்யலாம்.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('நீங்கள் ' + ref.current + ' முறை click செய்தீர்கள்!');
  }

  return (
    <button onClick={handleClick}>
      என்னை click செய்!
    </button>
  );
}
```

</Sandpack>

Ref என்பது React track செய்யாத உங்கள் component-ன் ரகசிய பையில் இருப்பது போன்றது. உதாரணமாக, component-ன் rendering output-ஐ பாதிக்காத [timeout IDs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element), மற்றும் பிற objects-ஐ store செய்ய refs பயன்படுத்தலாம்.

<LearnMore path="/learn/referencing-values-with-refs">

தகவலை நினைவில் வைத்திருக்க refs-ஐ எப்படி பயன்படுத்துவது என்பதை அறிய **[Referencing Values with Refs](/learn/referencing-values-with-refs)**-ஐ படியுங்கள்.

</LearnMore>

## Refs மூலம் DOM-ஐ manipulate செய்தல் {/*manipulating-the-dom-with-refs*/}

உங்கள் render output-க்கு match ஆக DOM-ஐ React தானாக update செய்கிறது, எனவே உங்கள் components அதை அடிக்கடி manipulate செய்யத் தேவையில்லை. ஆனால் சில நேரங்களில் React manage செய்யும் DOM elements-க்கு access தேவைப்படலாம்--உதாரணமாக node ஒன்றை focus செய்ய, அதற்கு scroll செய்ய, அல்லது அதன் size மற்றும் position-ஐ measure செய்ய. React-இல் இவற்றுக்கான built-in வழி இல்லை, எனவே DOM node-க்கு ref தேவைப்படும். உதாரணமாக, button-ஐ click செய்தால் ref பயன்படுத்தி input focus செய்யப்படும்:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Input-ஐ focus செய்
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

React manage செய்யும் DOM elements-ஐ access செய்வது எப்படி என்பதை அறிய **[Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs)**-ஐ படியுங்கள்.

</LearnMore>

## Effects மூலம் synchronize செய்தல் {/*synchronizing-with-effects*/}

சில components external systems-உடன் synchronize செய்ய வேண்டும். உதாரணமாக, React state அடிப்படையில் non-React component ஒன்றை control செய்ய விரும்பலாம், server connection அமைக்கலாம், அல்லது component screen-இல் தோன்றும்போது analytics log அனுப்பலாம். குறிப்பிட்ட events-ஐ handle செய்ய event handlers உதவுவது போல அல்லாமல், *Effects* rendering-க்கு பிறகு சில code run செய்ய அனுமதிக்கின்றன. React-க்கு வெளியே உள்ள system-உடன் உங்கள் component-ஐ synchronize செய்ய அவற்றைப் பயன்படுத்துங்கள்.

இயக்கு/இடைநிறுத்து button-ஐ சில முறை அழுத்தி, video player `isPlaying` prop value-உடன் எப்படி synchronized ஆக இருக்கிறது என்பதைப் பாருங்கள்:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'இடைநிறுத்து' : 'இயக்கு'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

பல Effects தங்களுக்குப் பிறகு "clean up" செய்கின்றன. உதாரணமாக, chat server-க்கு connection அமைக்கும் Effect, அந்த server-இலிருந்து உங்கள் component-ஐ disconnect செய்வது எப்படி என்று React-க்கு சொல்வதற்கான *cleanup function* ஒன்றை return செய்ய வேண்டும்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Chat-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connect செய்யப்படுகிறது...');
    },
    disconnect() {
      console.log('❌ Disconnect செய்யப்பட்டது.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Development-இல், React உங்கள் Effect-ஐ கூடுதலாக ஒருமுறை உடனே run செய்து clean up செய்யும். அதனால்தான் `"✅ Connect செய்யப்படுகிறது..."` இருமுறை print ஆகிறது. Cleanup function implement செய்ய மறக்கவில்லை என்பதை இது உறுதி செய்கிறது.

<LearnMore path="/learn/synchronizing-with-effects">

Components-ஐ external systems-உடன் synchronize செய்வது எப்படி என்பதை அறிய **[Synchronizing with Effects](/learn/synchronizing-with-effects)**-ஐ படியுங்கள்.

</LearnMore>

## உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம் {/*you-might-not-need-an-effect*/}

Effects என்பது React paradigm-இலிருந்து ஒரு escape hatch. அவை React-க்கு "வெளியே செல்ல" மற்றும் உங்கள் components-ஐ ஏதாவது external system-உடன் synchronize செய்ய அனுமதிக்கின்றன. External system எதுவும் இல்லையெனில் (உதாரணமாக, சில props அல்லது state மாறும்போது component state update செய்ய விரும்பினால்), Effect தேவையில்லை. தேவையற்ற Effects-ஐ remove செய்வது உங்கள் code-ஐ follow செய்ய திறமையாகவும், வேகமாக run ஆகவும், குறைவான error-prone ஆகவும் மாற்றும்.

Effects தேவையில்லாத இரண்டு பொதுவான cases:
- **Rendering-க்காக data transform செய்ய Effects தேவையில்லை.**
- **User events handle செய்ய Effects தேவையில்லை.**

உதாரணமாக, மற்ற state அடிப்படையில் சில state adjust செய்ய Effect தேவையில்லை:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

அதற்கு பதிலாக, rendering போது முடிந்த அளவு calculate செய்யுங்கள்:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

ஆனால், external systems-உடன் synchronize செய்ய Effects *தேவைப்படும்*.

<LearnMore path="/learn/you-might-not-need-an-effect">

தேவையற்ற Effects-ஐ remove செய்வது எப்படி என்பதை அறிய **[You Might Not Need an Effect](/learn/you-might-not-need-an-effect)**-ஐ படியுங்கள்.

</LearnMore>

## Reactive effects-ன் lifecycle {/*lifecycle-of-reactive-effects*/}

Effects-க்கு components-இலிருந்து வேறுபட்ட lifecycle உள்ளது. Components mount, update, அல்லது unmount ஆகலாம். Effect இரண்டு விஷயங்கள் மட்டுமே செய்ய முடியும்: ஏதாவது ஒன்றை synchronize செய்ய தொடங்குவது, பின்னர் அதை synchronize செய்வதை நிறுத்துவது. உங்கள் Effect காலத்துடன் மாறும் props மற்றும் state-ஐ சார்ந்திருந்தால், இந்த cycle பலமுறை நடக்கலாம்.

இந்த Effect `roomId` prop-ன் value-ஐ சார்ந்துள்ளது. Props *reactive values*; அதாவது அவை re-render போது மாறக்கூடும். `roomId` மாறினால் Effect எப்படி *re-synchronizes* செய்கிறது (server-க்கு மீண்டும் connect செய்கிறது) என்பதை கவனியுங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்யப்படுகிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

உங்கள் Effect-ன் dependencies-ஐ சரியாக specify செய்துள்ளீர்களா என்பதை check செய்ய React linter rule ஒன்றை வழங்குகிறது. மேலுள்ள example-இல் dependencies list-இல் `roomId` specify செய்ய மறந்தால், linter அந்த bug-ஐ தானாக கண்டறியும்.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Effect-ன் lifecycle component-ன் lifecycle-இலிருந்து எப்படி வேறுபடுகிறது என்பதை அறிய **[Lifecycle of Reactive Events](/learn/lifecycle-of-reactive-effects)**-ஐ படியுங்கள்.

</LearnMore>

## Events-ஐ Effects-இலிருந்து பிரித்தல் {/*separating-events-from-effects*/}

Event handlers அதே interaction-ஐ மீண்டும் செய்தால் மட்டுமே re-run ஆகும். Event handlers-க்கு மாறாக, Effects அவை read செய்யும் props அல்லது state போன்ற values கடைசி render-இலிருந்து வேறுபட்டால் re-synchronize ஆகும். சில நேரங்களில், இருவகை behaviors-ன் mix ஒன்றை விரும்பலாம்: சில values-க்கு பதிலாக re-run ஆகும் Effect, மற்ற values-க்கு அல்ல.

Effects-க்குள் உள்ள அனைத்து code-மும் *reactive*. அது read செய்யும் reactive value re-render காரணமாக மாறினால் மீண்டும் run ஆகும். உதாரணமாக, `roomId` அல்லது `theme` மாறினால் இந்த Effect chat-க்கு மீண்டும் connect செய்யும்:

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
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('இணைக்கப்பட்டது!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme பயன்படுத்து
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
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

இது ideal அல்ல. `roomId` மாறினால் மட்டுமே chat மீண்டும் connect ஆக வேண்டும். `theme` switch செய்ததால் chat மீண்டும் connect ஆகக் கூடாது! `theme` read செய்யும் code-ஐ உங்கள் Effect-இலிருந்து *Effect Event* ஒன்றுக்குள் நகர்த்துங்கள்:

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
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('இணைக்கப்பட்டது!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
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
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme பயன்படுத்து
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
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

```js src/notifications.js hidden
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

Effect Events-க்குள் உள்ள code reactive அல்ல, எனவே `theme` மாறுவது இனி உங்கள் Effect-ஐ மீண்டும் connect செய்யாது.

<LearnMore path="/learn/separating-events-from-effects">

சில values Effects-ஐ மீண்டும் trigger செய்வதைத் தடுப்பது எப்படி என்பதை அறிய **[Separating Events from Effects](/learn/separating-events-from-effects)**-ஐ படியுங்கள்.

</LearnMore>

## Effect dependencies remove செய்தல் {/*removing-effect-dependencies*/}

நீங்கள் Effect எழுதும்போது, அந்த Effect read செய்யும் ஒவ்வொரு reactive value-யும் (props மற்றும் state போன்றவை) உங்கள் Effect-ன் dependencies list-இல் சேர்க்கப்பட்டுள்ளதா என்பதை linter verify செய்யும். இது உங்கள் Effect உங்கள் component-ன் latest props மற்றும் state-உடன் synchronized ஆக இருப்பதை உறுதி செய்கிறது. தேவையற்ற dependencies உங்கள் Effect மிக அடிக்கடி run ஆகவோ, அல்லது infinite loop உருவாக்கவோ செய்யலாம். அவற்றை எப்படி remove செய்வது என்பது case-ஐப் பொறுத்தது.

உதாரணமாக, இந்த Effect input edit செய்யும் ஒவ்வொரு முறையும் மீண்டும் உருவாக்கப்படும் `options` object-ஐ சார்ந்துள்ளது:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்யப்படுகிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

அந்த chat-இல் message type செய்யத் தொடங்கும் ஒவ்வொரு முறையும் chat மீண்டும் connect ஆக வேண்டாம். இந்த problem-ஐ fix செய்ய, `options` object உருவாக்கத்தை Effect-க்குள் நகர்த்துங்கள்; அப்போது Effect `roomId` string-ஐ மட்டும் சாரும்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்யப்படுகிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`options` dependency-ஐ remove செய்ய dependency list-ஐ edit செய்வதிலிருந்து நீங்கள் தொடங்கவில்லை என்பதை கவனியுங்கள். அது தவறாக இருக்கும். அதற்கு பதிலாக, surrounding code-ஐ மாற்றி dependency *தேவையற்றதாக* ஆக்கியீர்கள். Dependency list-ஐ உங்கள் Effect code பயன்படுத்தும் அனைத்து reactive values-ன் list ஆக நினைத்துக்கொள்ளுங்கள். அந்த list-இல் என்ன வைக்க வேண்டும் என்று நீங்கள் intentional ஆக தேர்வு செய்வதில்லை. List உங்கள் code-ஐ describe செய்கிறது. Dependency list-ஐ மாற்ற, code-ஐ மாற்றுங்கள்.

<LearnMore path="/learn/removing-effect-dependencies">

உங்கள் Effect குறைவாக re-run ஆக செய்வது எப்படி என்பதை அறிய **[Removing Effect Dependencies](/learn/removing-effect-dependencies)**-ஐ படியுங்கள்.

</LearnMore>

## Custom Hooks மூலம் logic reuse செய்தல் {/*reusing-logic-with-custom-hooks*/}

React `useState`, `useContext`, மற்றும் `useEffect` போன்ற built-in Hooks உடன் வருகிறது. சில நேரங்களில், data fetch செய்ய, user online-இல் உள்ளாரா என்பதை track செய்ய, அல்லது chat room-க்கு connect செய்ய போன்ற குறிப்பிட்ட நோக்கத்திற்கான Hook ஒன்று இருந்தால் நன்றாக இருக்கும் என்று நினைப்பீர்கள். இதற்காக, உங்கள் application's needs-க்காக உங்கள் சொந்த Hooks உருவாக்கலாம்.

இந்த example-இல், `usePointerPosition` custom Hook cursor position-ஐ track செய்கிறது; `useDelayedValue` custom Hook நீங்கள் pass செய்த value-ஐவிட குறிப்பிட்ட milliseconds அளவிற்கு "lagging behind" இருக்கும் value-ஐ return செய்கிறது. Cursor-ஐ sandbox preview area மீது நகர்த்தி, cursor-ஐ பின்தொடரும் moving trail of dots-ஐப் பாருங்கள்:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

நீங்கள் custom Hooks உருவாக்கலாம், அவற்றை ஒன்றாக compose செய்யலாம், அவற்றுக்கு இடையில் data pass செய்யலாம், மேலும் components இடையே அவற்றை reuse செய்யலாம். உங்கள் app வளரும்போது, நீங்கள் ஏற்கனவே எழுதிய custom Hooks-ஐ reuse செய்ய முடிவதால், கைமுறையாக குறைவான Effects எழுதுவீர்கள். React community maintain செய்யும் பல சிறந்த custom Hooks-உம் உள்ளன.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Components இடையே logic பகிர்வது எப்படி என்பதை அறிய **[Reusing Logic with Custom Hooks](/learn/reusing-logic-with-custom-hooks)**-ஐ படியுங்கள்.

</LearnMore>

## அடுத்து என்ன? {/*whats-next*/}

இந்த chapter-ஐ page by page படிக்கத் தொடங்க [Referencing Values with Refs](/learn/referencing-values-with-refs)-க்கு செல்லுங்கள்!
