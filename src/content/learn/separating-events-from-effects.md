---
title: 'Events-ஐ Effects-இலிருந்து பிரித்தல்'
---

<Intro>

Event handlers அதே interaction-ஐ மீண்டும் செய்தால் மட்டுமே re-run ஆகும். Event handlers போல அல்லாமல், Effects படிக்கும் prop அல்லது state variable போன்ற value ஒன்று last render-இல் இருந்ததை விட வேறுபட்டிருந்தால், Effects re-synchronize ஆகும். சில நேரங்களில், இரு behaviors-ம் கலந்த ஒன்றும் உங்களுக்கு தேவைப்படலாம்: சில values-க்கு response ஆக re-run ஆகும், ஆனால் மற்ற values-க்கு இல்லாத Effect. அதை எப்படி செய்வது என்பதை இந்தப் பக்கம் கற்றுத்தரும்.

</Intro>

<YouWillLearn>

- Event handler மற்றும் Effect இடையில் எப்படி தேர்வு செய்வது
- Effects ஏன் reactive; event handlers ஏன் reactive அல்ல
- உங்கள் Effect code-ன் ஒரு பகுதி reactive ஆக இருக்கக்கூடாது என்றால் என்ன செய்வது
- Effect Events என்றால் என்ன, அவற்றை உங்கள் Effects-இலிருந்து எப்படி extract செய்வது
- Effect Events பயன்படுத்தி Effects-இலிருந்து latest props மற்றும் state-ஐ எப்படி படிப்பது

</YouWillLearn>

## Event handlers மற்றும் Effects இடையில் தேர்வு செய்தல் {/*choosing-between-event-handlers-and-effects*/}

முதலில், event handlers மற்றும் Effects இடையிலான வேறுபாட்டை recap செய்வோம்.

நீங்கள் ஒரு chat room component implement செய்கிறீர்கள் என்று கற்பனை செய்யுங்கள். உங்கள் requirements இவ்வாறு இருக்கும்:

1. உங்கள் component தேர்ந்தெடுக்கப்பட்ட chat room-க்கு automatic ஆக connect ஆக வேண்டும்.
1. "அனுப்பு" button-ஐ click செய்தால், அது chat-க்கு message அனுப்ப வேண்டும்.

அவற்றுக்கான code-ஐ ஏற்கனவே implement செய்துள்ளீர்கள், ஆனால் அதை எங்கே வைப்பது என்பது தெளிவாக இல்லை என வைத்துக்கொள்ளுங்கள். Event handlers use செய்ய வேண்டுமா அல்லது Effects use செய்ய வேண்டுமா? இந்தக் கேள்விக்கு பதில் சொல்ல வேண்டிய ஒவ்வொரு முறையும், code [*ஏன்* run ஆக வேண்டும்](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) என்பதை consider செய்யுங்கள்.

### குறிப்பிட்ட interactions-க்கு response ஆக event handlers run ஆகும் {/*event-handlers-run-in-response-to-specific-interactions*/}

User-ன் perspective-இல், அந்த குறிப்பிட்ட "அனுப்பு" button click செய்யப்பட்டதால் message அனுப்பப்பட வேண்டும். வேறு எந்த நேரத்திலும் அல்லது வேறு எந்த காரணத்திற்காகவும் அவர்களின் message-ஐ அனுப்பினால் user நிச்சயமாக அதிருப்தி அடைவார். அதனால் message அனுப்புவது event handler ஆக இருக்க வேண்டும். Event handlers குறிப்பிட்ட interactions-ஐ handle செய்ய அனுமதிக்கின்றன:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>அனுப்பு</button>
    </>
  );
}
```

Event handler உடன், user button-ஐ அழுத்தினால் *மட்டுமே* `sendMessage(message)` run ஆகும் என்பதை உறுதியாக அறியலாம்.

### Synchronization தேவைப்படும் ஒவ்வொரு முறையும் Effects run ஆகும் {/*effects-run-whenever-synchronization-is-needed*/}

Component chat room-க்கு connected ஆக இருக்க வேண்டியதும் உண்டு என்பதை நினைவில் கொள்ளுங்கள். அந்த code எங்கே செல்லும்?

இந்த code run ஆக வேண்டிய *காரணம்* ஒரு குறிப்பிட்ட interaction அல்ல. User ஏன் அல்லது எப்படி chat room screen-க்கு navigate செய்தார் என்பது முக்கியமல்ல. இப்போது அவர்கள் அதை பார்க்கிறார்கள், அதனுடன் interact செய்யலாம்; எனவே component தேர்ந்தெடுக்கப்பட்ட chat server-க்கு connected ஆக இருக்க வேண்டும். Chat room component உங்கள் app-ன் initial screen ஆக இருந்தாலும், user எந்த interactions-யும் செய்யாதிருந்தாலும், நீங்கள் *இன்னும்* connect செய்ய வேண்டியிருக்கும். அதனால்தான் இது Effect:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

இந்த code உடன், user செய்த குறிப்பிட்ட interactions எதுவாக இருந்தாலும், currently selected chat server-க்கு எப்போதும் active connection இருக்கும் என்பதை உறுதியாக அறியலாம். User உங்கள் app-ஐ மட்டும் open செய்திருந்தாலும், வேறு room தேர்ந்தெடுத்திருந்தாலும், அல்லது வேறு screen-க்கு சென்று திரும்பியிருந்தாலும், உங்கள் Effect component currently selected room உடன் *synchronized ஆகவே இருக்கும்* என்பதையும், [தேவைப்படும் ஒவ்வொரு முறையும் re-connect ஆகும்](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once) என்பதையும் உறுதி செய்கிறது.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>அனுப்பு</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்வு செய்க:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 நீங்கள் அனுப்பியது: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Reactive values மற்றும் reactive logic {/*reactive-values-and-reactive-logic*/}

Intuitively, event handlers எப்போதும் "manual" ஆக trigger செய்யப்படுகின்றன என்று சொல்லலாம்; உதாரணமாக button click செய்வது. மறுபுறம் Effects "automatic": synchronized ஆக இருக்க தேவையான அளவு அவை run மற்றும் re-run ஆகும்.

இதைக் குறித்து சிந்திக்க இன்னும் precise ஆன வழி உள்ளது.

Props, state, மற்றும் உங்கள் component body-க்குள் declare செய்யப்பட்ட variables <CodeStep step={2}>reactive values</CodeStep> என்று அழைக்கப்படுகின்றன. இந்த example-இல், `serverUrl` reactive value அல்ல; ஆனால் `roomId` மற்றும் `message` reactive values. அவை rendering data flow-இல் பங்கேற்கின்றன:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

இத்தகைய reactive values re-render காரணமாக மாறலாம். உதாரணமாக, user `message`-ஐ edit செய்யலாம் அல்லது dropdown-இல் வேறு `roomId` தேர்வு செய்யலாம். Event handlers மற்றும் Effects changes-க்கு வேறுபட்ட முறையில் respond செய்கின்றன:

- **Event handlers-க்குள் உள்ள logic *reactive அல்ல*.** User அதே interaction-ஐ (எ.கா. click) மீண்டும் செய்யாவிட்டால் அது மீண்டும் run ஆகாது. Event handlers reactive values-ஐ, அவற்றின் changes-க்கு "react" செய்யாமல், read செய்ய முடியும்.
- **Effects-க்குள் உள்ள logic *reactive*.** உங்கள் Effect reactive value ஒன்றைப் படித்தால், [அதை dependency ஆக specify செய்ய வேண்டும்.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) பிறகு, re-render அந்த value-ஐ change செய்தால், React உங்கள் Effect-ன் logic-ஐ புதிய value உடன் re-run செய்யும்.

இந்த வேறுபாட்டை விளக்க முந்தைய example-ஐ மீண்டும் பார்க்கலாம்.

### Event handlers-க்குள் உள்ள logic reactive அல்ல {/*logic-inside-event-handlers-is-not-reactive*/}

இந்த code line-ஐ பாருங்கள். இந்த logic reactive ஆக இருக்க வேண்டுமா இல்லையா?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

User-ன் perspective-இல், **`message` மாறுவது அவர்கள் message அனுப்ப விரும்புகிறார்கள் என்று _அர்த்தமல்ல_.** அதற்கு அர்த்தம் user type செய்கிறார் என்பதே. வேறு வார்த்தைகளில், message அனுப்பும் logic reactive ஆக இருக்கக்கூடாது. <CodeStep step={2}>reactive value</CodeStep> மாறியது என்பதற்காக மட்டும் அது மீண்டும் run ஆகக்கூடாது. அதனால்தான் அது event handler-இல் இருக்க வேண்டும்:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

Event handlers reactive அல்ல; எனவே user அனுப்பு button-ஐ click செய்யும் போது மட்டுமே `sendMessage(message)` run ஆகும்.

### Effects-க்குள் உள்ள logic reactive ஆகும் {/*logic-inside-effects-is-reactive*/}

இப்போது இந்த lines-க்கு திரும்புவோம்:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

User-ன் perspective-இல், **`roomId` மாறுவது அவர்கள் வேறு room-க்கு connect ஆக விரும்புகிறார்கள் என்று *அர்த்தம்*.** வேறு வார்த்தைகளில், room-க்கு connect செய்யும் logic reactive ஆக இருக்க வேண்டும். இந்த code lines <CodeStep step={2}>reactive value</CodeStep>-க்கு ஏற்ப "keep up" ஆகவும், அந்த value வேறுபட்டால் மீண்டும் run ஆகவும் நீங்கள் *விரும்புகிறீர்கள்*. அதனால்தான் அது Effect-இல் இருக்க வேண்டும்:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effects reactive என்பதால், `roomId`-ன் ஒவ்வொரு distinct value-க்கும் `createConnection(serverUrl, roomId)` மற்றும் `connection.connect()` run ஆகும். உங்கள் Effect chat connection-ஐ currently selected room உடன் synchronized ஆக வைத்திருக்கும்.

## Non-reactive logic-ஐ Effects-இலிருந்து extract செய்தல் {/*extracting-non-reactive-logic-out-of-effects*/}

Reactive logic மற்றும் non-reactive logic-ஐ mix செய்ய விரும்பும்போது விஷயங்கள் இன்னும் tricky ஆகின்றன.

உதாரணமாக, user chat-க்கு connect ஆகும்போது notification காட்ட விரும்புகிறீர்கள் என்று கற்பனை செய்யுங்கள். Notification-ஐ சரியான color-இல் காட்ட current theme-ஐ (dark அல்லது light) props-இலிருந்து read செய்கிறீர்கள்:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('இணைக்கப்பட்டது!', theme);
    });
    connection.connect();
    // ...
```

ஆனால் `theme` ஒரு reactive value (re-rendering காரணமாக அது மாறலாம்), மேலும் [Effect படிக்கும் ஒவ்வொரு reactive value-உம் அதன் dependency ஆக declare செய்யப்பட வேண்டும்.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) இப்போது உங்கள் Effect-ன் dependency ஆக `theme`-ஐ specify செய்ய வேண்டும்:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('இணைக்கப்பட்டது!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ எல்லா dependencies-உம் declared
  // ...
```

இந்த example-ஐ பயன்படுத்திப் பார்த்து, இந்த user experience-இல் உள்ள பிரச்சினையை கண்டுபிடிக்க முடியுமா என்று பாருங்கள்:

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

  return <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme use செய்
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
        throw Error('"connected" event மட்டும் supported.');
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

`roomId` மாறும்போது, நீங்கள் எதிர்பார்த்தபடி chat re-connect ஆகிறது. ஆனால் `theme`-உம் dependency என்பதால், dark மற்றும் light theme இடையே switch செய்யும் ஒவ்வொரு முறையும் chat *மீண்டும்* re-connect ஆகிறது. அது நல்லதல்ல!

வேறு வார்த்தைகளில், இந்த line reactive ஆன Effect-க்குள் இருந்தாலும், அது reactive ஆக இருக்க நீங்கள் *விரும்பவில்லை*:

```js
      // ...
      showNotification('இணைக்கப்பட்டது!', theme);
      // ...
```

இந்த non-reactive logic-ஐ அதை சுற்றியுள்ள reactive Effect-இலிருந்து பிரிக்க உங்களுக்கு ஒரு வழி தேவை.

### Effect Event declare செய்தல் {/*declaring-an-effect-event*/}

இந்த non-reactive logic-ஐ உங்கள் Effect-இலிருந்து extract செய்ய [`useEffectEvent`](/reference/react/useEffectEvent) என்ற சிறப்பு Hook-ஐ use செய்யுங்கள்:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('இணைக்கப்பட்டது!', theme);
  });
  // ...
```

இங்கே, `onConnected` ஒரு *Effect Event* என்று அழைக்கப்படுகிறது. அது உங்கள் Effect logic-ன் ஒரு பகுதி, ஆனால் event handler போல அதிகமாக behave செய்கிறது. அதற்குள் உள்ள logic reactive அல்ல; மேலும் அது உங்கள் props மற்றும் state-ன் latest values-ஐ எப்போதும் "பார்க்கும்".

இப்போது உங்கள் Effect-க்குள் இருந்து `onConnected` Effect Event-ஐ call செய்யலாம்:

```js {2-4,9,13}
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
  }, [roomId]); // ✅ எல்லா dependencies-உம் declared
  // ...
```

இது பிரச்சினையை solve செய்கிறது. `theme` Effect-இல் இனி use செய்யப்படாததால், உங்கள் Effect dependencies list-இலிருந்து அதை *remove* செய்ய வேண்டியிருந்தது என்பதை கவனியுங்கள். மேலும் `onConnected`-ஐ அதில் *add* செய்யவும் தேவையில்லை; ஏனெனில் **Effect Events reactive அல்ல, அவை dependencies-இலிருந்து omit செய்யப்பட வேண்டும்.**

புதிய behavior நீங்கள் எதிர்பார்ப்பது போல வேலை செய்கிறது என்பதை verify செய்யுங்கள்:

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

  return <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme use செய்
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
        throw Error('"connected" event மட்டும் supported.');
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

Effect Events-ஐ event handlers-க்கு மிகவும் ஒத்ததாக நீங்கள் நினைக்கலாம். முக்கிய வேறுபாடு: event handlers user interactions-க்கு response ஆக run ஆகும்; ஆனால் Effect Events-ஐ Effects-இலிருந்து நீங்கள் trigger செய்கிறீர்கள். Effects-ன் reactivity மற்றும் reactive ஆக இருக்கக்கூடாத code இடையிலான "chain"-ஐ break செய்ய Effect Events உதவுகின்றன.

### Effect Events மூலம் latest props மற்றும் state படித்தல் {/*reading-latest-props-and-state-with-effect-events*/}

Dependency linter-ஐ suppress செய்ய நீங்கள் tempted ஆகக்கூடிய பல patterns-ஐ Effect Events மூலம் fix செய்யலாம்.

உதாரணமாக, page visits-ஐ log செய்யும் Effect ஒன்று உங்களிடம் உள்ளது என வைத்துக்கொள்ளுங்கள்:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

பின்னர், உங்கள் site-க்கு பல routes சேர்க்கிறீர்கள். இப்போது உங்கள் `Page` component current path கொண்ட `url` prop பெறுகிறது. `logVisit` call-ன் ஒரு பகுதியாக `url`-ஐ pass செய்ய விரும்புகிறீர்கள், ஆனால் dependency linter complain செய்கிறது:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect-க்கு missing dependency உள்ளது: 'url'
  // ...
}
```

Code என்ன செய்ய வேண்டும் என்று நீங்கள் விரும்புகிறீர்கள் என்பதை சிந்தியுங்கள். ஒவ்வொரு URL-மும் வேறு page-ஐ represent செய்வதால், வேறுபட்ட URLs-க்கு தனித்தனி visit log செய்ய நீங்கள் *விரும்புகிறீர்கள்*. வேறு வார்த்தைகளில், இந்த `logVisit` call `url`-ஐப் பொறுத்தவரை reactive ஆக *இருக்க வேண்டும்*. அதனால்தான், இந்த case-இல் dependency linter-ஐ பின்பற்றி, `url`-ஐ dependency ஆக சேர்ப்பது பொருத்தமானது:

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ எல்லா dependencies-உம் declared
  // ...
}
```

இப்போது ஒவ்வொரு page visit உடனும் shopping cart-இல் உள்ள items எண்ணிக்கையையும் include செய்ய விரும்புகிறீர்கள் என வைத்துக்கொள்ளுங்கள்:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect-க்கு missing dependency உள்ளது: 'numberOfItems'
  // ...
}
```

Effect-க்குள் `numberOfItems` use செய்ததால், அதை dependency ஆக add செய்ய linter கேட்கிறது. ஆனால் `numberOfItems`-ஐப் பொறுத்தவரை `logVisit` call reactive ஆக இருக்க நீங்கள் *விரும்பவில்லை*. User shopping cart-இல் ஏதாவது சேர்த்து `numberOfItems` மாறினால், user page-ஐ மீண்டும் visited செய்தார் என்று இது *அர்த்தமல்ல*. வேறு வார்த்தைகளில், *page visit செய்வது* ஒரு பொருளில் "event". அது ஒரு துல்லியமான தருணத்தில் நடக்கிறது.

Code-ஐ இரண்டு பகுதிகளாக split செய்யுங்கள்:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ எல்லா dependencies-உம் declared
  // ...
}
```

இங்கே, `onVisit` ஒரு Effect Event. அதற்குள் உள்ள code reactive அல்ல. அதனால்தான் `numberOfItems` (அல்லது வேறு எந்த reactive value!) use செய்தாலும், அது changes போது surrounding code re-execute ஆகுமோ என்று கவலைப்பட வேண்டியதில்லை.

மறுபுறம், Effect தானாகவே reactive ஆகவே இருக்கும். Effect-க்குள் உள்ள code `url` prop-ஐ use செய்கிறது; எனவே வேறு `url` உடன் ஒவ்வொரு re-render-க்கும் பிறகு Effect re-run ஆகும். அதன் விளைவாக, அது `onVisit` Effect Event-ஐ call செய்யும்.

இதன் விளைவாக, `url` மாறும் ஒவ்வொரு முறையும் `logVisit` call செய்வீர்கள்; மேலும் latest `numberOfItems`-ஐ எப்போதும் read செய்வீர்கள். ஆனால் `numberOfItems` தனியாக மாறினால், அது எந்த code-ஐயும் re-run செய்யாது.

<Note>

Arguments இல்லாமல் `onVisit()` call செய்து, அதற்குள் `url`-ஐ read செய்ய முடியுமா என்று நீங்கள் யோசிக்கலாம்:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

இது வேலை செய்யும்; ஆனால் இந்த `url`-ஐ Effect Event-க்கு explicit ஆக pass செய்வது சிறந்தது. **`url`-ஐ உங்கள் Effect Event-க்கு argument ஆக pass செய்வதன் மூலம், வேறு `url` கொண்ட page-ஐ visit செய்வது user-ன் perspective-இல் தனி "event" ஆகும் என்று சொல்கிறீர்கள்.** `visitedUrl` நடந்த "event"-ன் ஒரு *பகுதி*:

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

உங்கள் Effect Event `visitedUrl`-ஐ explicit ஆக "கேட்கிறது" என்பதால், இப்போது `url`-ஐ Effect dependencies-இலிருந்து தவறுதலாக remove செய்ய முடியாது. `url` dependency-ஐ remove செய்தால் (distinct page visits ஒன்றாக count ஆகும்), linter அதைப் பற்றி warn செய்யும். `url`-ஐப் பொறுத்தவரை `onVisit` reactive ஆக இருக்க வேண்டும்; எனவே `url`-ஐ அதற்குள் read செய்வதற்குப் பதிலாக (அங்கே அது reactive ஆக இருக்காது), உங்கள் Effect-இலிருந்து அதை *pass* செய்கிறீர்கள்.

Effect-க்குள் asynchronous logic இருந்தால் இது குறிப்பாக முக்கியமாகிறது:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Visits log செய்வதை delay செய்
  }, [url]);
```

இங்கே, `onVisit`-க்குள் உள்ள `url` *latest* `url`-ஐ (ஏற்கனவே மாறியிருக்கலாம்) குறிக்கும்; ஆனால் `visitedUrl` இந்த Effect (மற்றும் இந்த `onVisit` call) முதலில் run ஆக காரணமான `url`-ஐ குறிக்கும்.

</Note>

<DeepDive>

#### அதற்கு பதிலாக dependency linter-ஐ suppress செய்வது சரியா? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

ஏற்கனவே உள்ள codebases-இல், lint rule இவ்வாறு suppressed செய்யப்பட்டிருப்பதை சில நேரங்களில் பார்க்கலாம்:

```js {expectedErrors: {'react-compiler': [8]}} {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

**Linter-ஐ ஒருபோதும் suppress செய்ய வேண்டாம்** என்று பரிந்துரைக்கிறோம்.

Rule-ஐ suppress செய்வதன் முதல் downside: உங்கள் code-இல் புதிதாக அறிமுகமான reactive dependency-க்கு உங்கள் Effect "react" செய்ய வேண்டியபோது React இனி warn செய்யாது. முந்தைய example-இல், React நினைவூட்டியதால் தான் `url`-ஐ dependencies-க்கு சேர்த்தீர்கள். Linter-ஐ disable செய்தால், அந்த Effect-க்கு எதிர்கால edits செய்யும்போது இத்தகைய reminders இனி கிடைக்காது. இது bugs-க்கு வழிவகுக்கும்.

Linter-ஐ suppress செய்வதால் உருவாகும் குழப்பமான bug-க்கு ஒரு example இங்கே. இந்த example-இல், dot cursor-ஐ follow செய்ய வேண்டுமா என்பதை முடிவு செய்ய `handleMove` function current `canMove` state variable value-ஐ read செய்ய வேண்டும். ஆனால் `handleMove`-க்குள் `canMove` எப்போதும் `true` ஆகவே உள்ளது.

ஏன் என்று பார்க்க முடியுமா?

<Sandpack>

```js {expectedErrors: {'react-compiler': [16]}}
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Dot நகர அனுமதி உள்ளது
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


இந்த code-இன் பிரச்சினை dependency linter-ஐ suppress செய்வதில்தான். Suppression-ஐ remove செய்தால், இந்த Effect `handleMove` function-ஐ depend செய்ய வேண்டும் என்பதை பார்க்கலாம். இது பொருத்தமானதே: `handleMove` component body-க்குள் declare செய்யப்பட்டுள்ளதால் அது reactive value ஆகிறது. ஒவ்வொரு reactive value-உம் dependency ஆக specify செய்யப்பட வேண்டும்; இல்லையெனில் அது காலப்போக்கில் stale ஆகக்கூடும்!

Original code-ன் author, Effect எந்த reactive values-ஐயும் depend செய்யவில்லை (`[]`) என்று React-க்கு "பொய்" சொன்னுள்ளார். அதனால்தான் `canMove` மாறிய பிறகும் (அதனுடன் `handleMove` மாறிய பிறகும்) React Effect-ஐ re-synchronize செய்யவில்லை. React Effect-ஐ re-synchronize செய்யாததால், listener ஆக attached ஆன `handleMove`, initial render போது create செய்யப்பட்ட `handleMove` function ஆகும். Initial render போது `canMove` `true` ஆக இருந்ததால், initial render-இலிருந்து வந்த `handleMove` அந்த value-ஐ என்றென்றும் பார்க்கும்.

**Linter-ஐ ஒருபோதும் suppress செய்யவில்லை என்றால், stale values தொடர்பான பிரச்சினைகளை நீங்கள் பார்க்கவே மாட்டீர்கள்.**

`useEffectEvent` உடன், linter-க்கு "பொய்" சொல்ல தேவையில்லை; code நீங்கள் எதிர்பார்ப்பது போலவே வேலை செய்கிறது:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

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
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Dot நகர அனுமதி உள்ளது
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

இதனால் `useEffectEvent` *எப்போதும்* சரியான solution என்று அர்த்தமல்ல. Reactive ஆக இருக்க வேண்டாம் என்று நீங்கள் விரும்பும் code lines-க்கு மட்டுமே அதை apply செய்ய வேண்டும். மேலுள்ள sandbox-இல், Effect-ன் code `canMove`-ஐப் பொறுத்தவரை reactive ஆக இருக்க வேண்டாம் என்று நீங்கள் விரும்பினீர்கள். அதனால்தான் Effect Event extract செய்வது பொருத்தமானது.

Linter-ஐ suppress செய்வதற்கான மற்ற சரியான alternatives குறித்து [Effect Dependencies-ஐ நீக்குதல்](/learn/removing-effect-dependencies) படிக்கவும்.

</DeepDive>

### Effect Events-ன் வரம்புகள் {/*limitations-of-effect-events*/}

Effect Events-ஐ எப்படி use செய்யலாம் என்பதில் அவற்றுக்கு கடுமையான வரம்புகள் உள்ளன:

* **அவற்றை Effects-க்குள் இருந்து மட்டும் call செய்யுங்கள்.**
* **அவற்றை மற்ற components அல்லது Hooks-க்கு ஒருபோதும் pass செய்ய வேண்டாம்.**

உதாரணமாக, Effect Event-ஐ இவ்வாறு declare செய்து pass செய்ய வேண்டாம்:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 தவிர்க்கவும்: Effect Events-ஐ pass செய்தல்

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // dependencies-இல் "callback" specify செய்ய வேண்டும்
}
```

அதற்கு பதிலாக, Effect Events-ஐ அவற்றை use செய்யும் Effects-க்கு நேரடியாக அருகில் எப்போதும் declare செய்யுங்கள்:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ நல்லது: Effect-க்குள் locally மட்டும் call செய்யப்படுகிறது
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // "onTick" (Effect Event) dependency ஆக specify செய்ய தேவையில்லை
}
```

Effect Events உங்கள் Effect code-ன் non-reactive "pieces". அவை அவற்றை use செய்யும் Effect-க்கு அருகிலேயே இருக்க வேண்டும்.

<Recap>

- Event handlers குறிப்பிட்ட interactions-க்கு response ஆக run ஆகும்.
- Synchronization தேவைப்படும் ஒவ்வொரு முறையும் Effects run ஆகும்.
- Event handlers-க்குள் உள்ள logic reactive அல்ல.
- Effects-க்குள் உள்ள logic reactive.
- Non-reactive logic-ஐ Effects-இலிருந்து Effect Events-க்கு move செய்யலாம்.
- Effect Events-ஐ Effects-க்குள் இருந்து மட்டும் call செய்யுங்கள்.
- Effect Events-ஐ மற்ற components அல்லது Hooks-க்கு pass செய்ய வேண்டாம்.

</Recap>

<Challenges>

#### Update ஆகாத variable-ஐ fix செய்தல் {/*fix-a-variable-that-doesnt-update*/}

இந்த `Timer` component ஒவ்வொரு second-க்கும் அதிகரிக்கும் `count` state variable-ஐ வைத்திருக்கிறது. அது எவ்வளவு அதிகரிக்கிறது என்ற value `increment` state variable-இல் store செய்யப்பட்டுள்ளது. Plus மற்றும் minus buttons மூலம் `increment` variable-ஐ control செய்யலாம்.

ஆனால் plus button-ஐ எத்தனை முறை click செய்தாலும், counter ஒவ்வொரு second-க்கும் இன்னும் ஒன்றாகவே increment ஆகிறது. இந்த code-இல் என்ன தவறு? Effect-ன் code-க்குள் `increment` ஏன் எப்போதும் `1`-க்கு சமமாக உள்ளது? தவறைக் கண்டுபிடித்து fix செய்யுங்கள்.

<Hint>

இந்த code-ஐ fix செய்ய, rules-ஐ பின்பற்றுவது போதுமானது.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>Reset செய்</button>
      </h1>
      <hr />
      <p>
        ஒவ்வொரு second-க்கும் increment ஆகும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
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

<Solution>

வழக்கம்போல, Effects-இல் bugs தேடும்போது linter suppressions-ஐ தேடுவதிலிருந்து தொடங்குங்கள்.

Suppression comment-ஐ remove செய்தால், இந்த Effect-ன் code `increment`-ஐ depend செய்கிறது என்று React சொல்லும்; ஆனால் இந்த Effect எந்த reactive values-ஐயும் depend செய்யவில்லை (`[]`) என்று React-க்கு நீங்கள் "பொய்" சொன்னீர்கள். Dependency array-க்கு `increment` சேர்க்கவும்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>Reset செய்</button>
      </h1>
      <hr />
      <p>
        ஒவ்வொரு second-க்கும் increment ஆகும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
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

இப்போது `increment` மாறும்போது, React உங்கள் Effect-ஐ re-synchronize செய்யும்; அது interval-ஐ restart செய்யும்.

</Solution>

#### Freeze ஆகும் counter-ஐ fix செய்தல் {/*fix-a-freezing-counter*/}

இந்த `Timer` component ஒவ்வொரு second-க்கும் அதிகரிக்கும் `count` state variable-ஐ வைத்திருக்கிறது. அது எவ்வளவு அதிகரிக்கிறது என்ற value `increment` state variable-இல் store செய்யப்பட்டுள்ளது; அதை plus மற்றும் minus buttons மூலம் control செய்யலாம். உதாரணமாக, plus button-ஐ ஒன்பது முறை அழுத்திப் பாருங்கள்; இப்போது `count` ஒவ்வொரு second-க்கும் ஒன்றாக அல்ல, பத்தாக அதிகரிக்கிறது என்பதை கவனியுங்கள்.

இந்த user interface-இல் ஒரு சிறிய issue உள்ளது. Plus அல்லது minus buttons-ஐ ஒரு second-க்கு ஒருமுறையை விட வேகமாக தொடர்ந்து அழுத்தினால், timer தானே pause ஆனது போல தோன்றலாம். எந்த button-ஐ கடைசியாக அழுத்தியதிலிருந்து ஒரு second கடந்த பிறகே அது மீண்டும் தொடங்கும். இது ஏன் நடக்கிறது என்பதை கண்டுபிடித்து, timer இடையூறு இல்லாமல் *ஒவ்வொரு* second-க்கும் tick ஆகுமாறு issue-ஐ fix செய்யுங்கள்.

<Hint>

Timer-ஐ set up செய்யும் Effect `increment` value-க்கு "react" செய்வது போல தெரிகிறது. `setCount` call செய்ய current `increment` value-ஐ use செய்யும் line உண்மையில் reactive ஆக இருக்க வேண்டுமா?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>Reset செய்</button>
      </h1>
      <hr />
      <p>
        ஒவ்வொரு second-க்கும் increment ஆகும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
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

<Solution>

Issue என்னவென்றால், Effect-க்குள் உள்ள code `increment` state variable-ஐ use செய்கிறது. அது உங்கள் Effect-ன் dependency என்பதால், `increment`-இன் ஒவ்வொரு change-உம் Effect-ஐ re-synchronize செய்ய வைக்கிறது; அதனால் interval clear ஆகிறது. Interval fire ஆகும் வாய்ப்பு கிடைக்கும் முன்பே அதை ஒவ்வொரு முறையும் clear செய்தால், timer நின்றுவிட்டது போல தோன்றும்.

Issue-ஐ solve செய்ய, Effect-இலிருந்து `onTick` Effect Event-ஐ extract செய்யுங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
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
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>Reset செய்</button>
      </h1>
      <hr />
      <p>
        ஒவ்வொரு second-க்கும் increment ஆகும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
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

`onTick` ஒரு Effect Event என்பதால், அதற்குள் உள்ள code reactive அல்ல. `increment`-இல் change எந்த Effects-ஐயும் trigger செய்யாது.

</Solution>

#### Adjust செய்ய முடியாத delay-ஐ fix செய்தல் {/*fix-a-non-adjustable-delay*/}

இந்த example-இல் interval delay-ஐ customize செய்யலாம். அது `delay` state variable-இல் store செய்யப்பட்டுள்ளது; இரண்டு buttons அதை update செய்கின்றன. ஆனால் "plus 100 ms" button-ஐ `delay` 1000 milliseconds (அதாவது ஒரு second) ஆகும் வரை அழுத்தினாலும், timer இன்னும் மிக வேகமாக (ஒவ்வொரு 100 ms-க்கும்) increment ஆகிறது என்பதை கவனிப்பீர்கள். `delay`-க்கு செய்த உங்கள் changes ignore செய்யப்பட்டதுபோல் இருக்கும். Bug-ஐ கண்டுபிடித்து fix செய்யுங்கள்.

<Hint>

Effect Events-க்குள் உள்ள code reactive அல்ல. `setInterval` call re-run ஆக வேண்டும் என்று நீங்கள் _விரும்பும்_ cases உள்ளனவா?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>Reset செய்</button>
      </h1>
      <hr />
      <p>
        Increment ஆகும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        அதிகரிப்பு தாமதம்:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

மேலுள்ள example-இன் பிரச்சினை, code உண்மையில் என்ன செய்ய வேண்டும் என்பதை consider செய்யாமல் `onMount` என்ற Effect Event extract செய்ததுதான். Effect Events-ஐ குறிப்பிட்ட காரணத்திற்காக மட்டும் extract செய்ய வேண்டும்: உங்கள் code-ன் ஒரு பகுதியை non-reactive ஆக்க விரும்பும்போது. ஆனால் `delay` state variable-ஐப் பொறுத்தவரை `setInterval` call reactive ஆக *இருக்க வேண்டும்*. `delay` மாறினால், interval-ஐ scratch-இலிருந்து set up செய்ய நீங்கள் விரும்புகிறீர்கள்! இந்த code-ஐ fix செய்ய, reactive code அனைத்தையும் மீண்டும் Effect-க்குள் கொண்டு வாருங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>Reset செய்</button>
      </h1>
      <hr />
      <p>
        Increment ஆகும் அளவு:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        அதிகரிப்பு தாமதம்:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

பொதுவாக, code-ன் *purpose* விட *timing* மீது கவனம் செலுத்தும் `onMount` போன்ற functions குறித்து நீங்கள் சந்தேகமாக இருக்க வேண்டும். முதலில் அது "மேலும் descriptive" போல தோன்றலாம்; ஆனால் அது உங்கள் intent-ஐ மறைத்துவிடும். Rule of thumb ஆக, Effect Events user-ன் perspective-இல் நடக்கும் ஏதோ ஒன்றை correspond செய்ய வேண்டும். உதாரணமாக, `onMessage`, `onTick`, `onVisit`, அல்லது `onConnected` நல்ல Effect Event names. அவற்றுக்குள் உள்ள code பெரும்பாலும் reactive ஆக இருக்க தேவையில்லை. மறுபுறம், `onMount`, `onUpdate`, `onUnmount`, அல்லது `onAfterRender` மிகவும் generic; reactive ஆக *இருக்க வேண்டிய* code-ஐ அவற்றுக்குள் தவறுதலாக வைப்பது சாத்தியம். அதனால்தான் உங்கள் Effect Events-க்கு, code எப்போது run ஆனது என்பதற்கு பதிலாக, *user நடந்ததாக நினைக்கும் விஷயம்* அடிப்படையில் பெயரிட வேண்டும்.

</Solution>

#### Delayed notification-ஐ fix செய்தல் {/*fix-a-delayed-notification*/}

நீங்கள் chat room-இல் join செய்யும்போது, இந்த component notification காட்டுகிறது. ஆனால் அது notification-ஐ உடனடியாக காட்டாது. அதற்கு பதிலாக, user UI-ஐ சுற்றிப் பார்க்க வாய்ப்பு இருக்கும்படி notification செயற்கையாக இரண்டு seconds delay செய்யப்படுகிறது.

இது கிட்டத்தட்ட வேலை செய்கிறது, ஆனால் ஒரு bug உள்ளது. Dropdown-ஐ "general" இலிருந்து "travel", பின்னர் மிக வேகமாக "music" ஆக மாற்றிப் பாருங்கள். போதுமான வேகத்தில் செய்தால், இரண்டு notifications காண்பீர்கள் (எதிர்பார்த்தபடி!) ஆனால் அவை *இரண்டும்* "music அறைக்கு வரவேற்கிறோம்" என்று சொல்லும்.

"general" இலிருந்து "travel", பின்னர் மிக வேகமாக "music" ஆக switch செய்யும்போது, இரண்டு notifications காணும்படி fix செய்யுங்கள்: முதல் ஒன்று "travel அறைக்கு வரவேற்கிறோம்", இரண்டாவது ஒன்று "music அறைக்கு வரவேற்கிறோம்". (கூடுதல் challenge ஆக, notifications ஏற்கனவே correct rooms காட்டுமாறு செய்துவிட்டீர்கள் என வைத்துக்கொண்டு, latter notification மட்டும் display ஆக code-ஐ மாற்றுங்கள்.)

<Hint>

உங்கள் Effect எந்த room-க்கு connect ஆனது என்பதை அறிவது. உங்கள் Effect Event-க்கு pass செய்ய விரும்பக்கூடிய தகவல் ஏதேனும் உள்ளதா?

</Hint>

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
    showNotification(roomId + ' அறைக்கு வரவேற்கிறோம்', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme use செய்
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
        throw Error('"connected" event மட்டும் supported.');
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

<Solution>

உங்கள் Effect Event-க்குள், `roomId` என்பது *Effect Event call செய்யப்பட்ட நேரத்தில்* உள்ள value.

உங்கள் Effect Event இரண்டு second delay உடன் call செய்யப்படுகிறது. நீங்கள் travel room-இலிருந்து music room-க்கு வேகமாக switch செய்தால், travel room-ன் notification காட்டப்படும் நேரத்திற்குள் `roomId` ஏற்கனவே `"music"` ஆகிவிடும். அதனால்தான் இரண்டு notifications-உம் "music அறைக்கு வரவேற்கிறோம்" என்று சொல்கின்றன.

Issue-ஐ fix செய்ய, Effect Event-க்குள் *latest* `roomId`-ஐ read செய்வதற்கு பதிலாக, கீழுள்ள `connectedRoomId` போல அதை உங்கள் Effect Event-ன் parameter ஆக்குங்கள். பிறகு `onConnected(roomId)` call செய்வதன் மூலம் உங்கள் Effect-இலிருந்து `roomId` pass செய்யுங்கள்:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification(connectedRoomId + ' அறைக்கு வரவேற்கிறோம்', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme use செய்
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
        throw Error('"connected" event மட்டும் supported.');
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

`roomId` `"travel"` ஆக set செய்யப்பட்டிருந்த Effect (`"travel"` room-க்கு connect ஆனது) `"travel"`-க்கான notification-ஐ காட்டும். `roomId` `"music"` ஆக set செய்யப்பட்டிருந்த Effect (`"music"` room-க்கு connect ஆனது) `"music"`-க்கான notification-ஐ காட்டும். வேறு வார்த்தைகளில், `connectedRoomId` உங்கள் Effect-இலிருந்து (அது reactive) வருகிறது; ஆனால் `theme` எப்போதும் latest value-ஐ use செய்கிறது.

கூடுதல் challenge-ஐ solve செய்ய, notification timeout ID-ஐ save செய்து, உங்கள் Effect-ன் cleanup function-இல் அதை clear செய்யுங்கள்:

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification(connectedRoomId + ' அறைக்கு வரவேற்கிறோம்', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark theme use செய்
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
        throw Error('"connected" event மட்டும் supported.');
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

நீங்கள் rooms மாற்றும்போது, ஏற்கனவே scheduled ஆன (ஆனால் இன்னும் displayed ஆகாத) notifications cancel ஆகும் என்பதை இது உறுதி செய்கிறது.

</Solution>

</Challenges>
