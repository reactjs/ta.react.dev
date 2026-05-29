---
title: 'Effect dependencies-ஐ அகற்றுதல்'
---

<Intro>

Effect ஒன்றை எழுதும் போது, அந்த Effect வாசிக்கும் ஒவ்வொரு reactive value-யும் (props மற்றும் state போன்றவை) உங்கள் Effect-ன் dependencies பட்டியலில் சேர்க்கப்பட்டுள்ளதா என்பதை linter சரிபார்க்கும். இதனால் உங்கள் Effect, component-ன் சமீபத்திய props மற்றும் state உடன் synchronized ஆக இருக்கும். தேவையற்ற dependencies உங்கள் Effect மிக அடிக்கடி run ஆகவோ, கூடவே infinite loop உருவாக்கவோ செய்யலாம். உங்கள் Effects-இலிருந்து தேவையற்ற dependencies-ஐ review செய்து அகற்ற இந்த guide-ஐப் பின்பற்றுங்கள்.

</Intro>

<YouWillLearn>

- infinite Effect dependency loops-ஐ எப்படி சரிசெய்வது
- dependency ஒன்றை அகற்ற விரும்பும் போது என்ன செய்ய வேண்டும்
- value ஒன்றுக்கு "react" செய்யாமல் அதை உங்கள் Effect-இலிருந்து எப்படி வாசிப்பது
- object மற்றும் function dependencies-ஐ எப்படி, ஏன் தவிர்க்க வேண்டும்
- dependency linter-ஐ suppress செய்வது ஏன் ஆபத்தானது, அதற்கு பதிலாக என்ன செய்ய வேண்டும்

</YouWillLearn>

## Dependencies code-உடன் பொருந்த வேண்டும் {/*dependencies-should-match-the-code*/}

Effect ஒன்றை எழுதும் போது, உங்கள் Effect செய்ய வேண்டும் என்று நினைக்கும் விஷயத்தை எப்படி [தொடங்கவும் நிறுத்தவும்](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) வேண்டும் என்பதை முதலில் குறிப்பிடுகிறீர்கள்:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

பின்னர் Effect dependencies-ஐ காலியாக (`[]`) விட்டால், linter சரியான dependencies-ஐ பரிந்துரைக்கும்:

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
  }, []); // <-- இங்குள்ள தவறை சரிசெய்யவும்!
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

linter சொல்வதற்கு ஏற்ப அவற்றை நிரப்புங்கள்:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

[Effects reactive values-க்கு "react" செய்கின்றன.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) `roomId` reactive value ஆக இருப்பதால் (re-render காரணமாக அது மாறலாம்), அதை dependency ஆக குறிப்பிட்டுள்ளீர்களா என்பதை linter சரிபார்க்கிறது. `roomId` வேறு value பெற்றால், React உங்கள் Effect-ஐ re-synchronize செய்யும். இதனால் chat தேர்ந்தெடுத்த room-க்கு இணைந்தே இருந்து, dropdown-க்கு "react" செய்கிறது:

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
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

### dependency ஒன்றை அகற்ற, அது dependency அல்ல என்பதை நிரூபியுங்கள் {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

உங்கள் Effect-ன் dependencies-ஐ நீங்கள் "தேர்வு" செய்ய முடியாது என்பதை கவனியுங்கள். உங்கள் Effect-ன் code பயன்படுத்தும் ஒவ்வொரு <CodeStep step={2}>reactive value</CodeStep>-யும் dependency list-இல் declare செய்யப்பட வேண்டும். dependency list சுற்றியுள்ள code-ஆல் தீர்மானிக்கப்படுகிறது:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[Reactive values](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) என்பது props மற்றும் உங்கள் component-க்குள் நேரடியாக declare செய்யப்பட்ட அனைத்து variables மற்றும் functions-ஐ உட்கொள்கிறது. `roomId` reactive value ஆக இருப்பதால், அதை dependency list-இலிருந்து அகற்ற முடியாது. linter அதை அனுமதிக்காது:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect-இல் missing dependency உள்ளது: 'roomId'
  // ...
}
```

linter சரியாகத்தான் இருக்கும்! `roomId` காலப்போக்கில் மாறக்கூடியதால், இது உங்கள் code-இல் bug ஒன்றை உருவாக்கும்.

**dependency ஒன்றை அகற்ற, அது dependency ஆக *இருக்க வேண்டியதில்லை* என்பதை linter-க்கு "நிரூபியுங்கள்".** எடுத்துக்காட்டாக, `roomId` reactive அல்ல, re-renders-இல் மாறாது என்பதை நிரூபிக்க அதை component-க்கு வெளியே நகர்த்தலாம்:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // இனி reactive value அல்ல

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

இப்போது `roomId` reactive value அல்ல (re-render-இல் மாற முடியாது), எனவே அது dependency ஆக இருக்க வேண்டியதில்லை:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

அதனால் இப்போது [காலியான (`[]`) dependency list](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) குறிப்பிடலாம். உங்கள் Effect இனி எந்த reactive value-யையும் *உண்மையாகவே* சார்ந்திருக்கவில்லை; எனவே component-ன் props அல்லது state மாறும் போது அது மீண்டும் run ஆக *உண்மையாகவே* தேவையில்லை.

### dependencies-ஐ மாற்ற, code-ஐ மாற்றுங்கள் {/*to-change-the-dependencies-change-the-code*/}

உங்கள் workflow-இல் ஒரு pattern-ஐ கவனித்திருக்கலாம்:

1. முதலில், உங்கள் Effect-ன் **code-ஐ மாற்றுகிறீர்கள்** அல்லது reactive values எப்படித் declare செய்யப்படுகின்றன என்பதை மாற்றுகிறீர்கள்.
2. பின்னர், linter-ஐப் பின்பற்றி, **நீங்கள் மாற்றிய code-க்கு பொருந்த** dependencies-ஐ சரிசெய்கிறீர்கள்.
3. dependencies பட்டியலில் திருப்தி இல்லையெனில், **முதல் படிக்கு திரும்புகிறீர்கள்** (மீண்டும் code-ஐ மாற்றுகிறீர்கள்).

கடைசி பகுதி முக்கியமானது. **dependencies-ஐ மாற்ற விரும்பினால், முதலில் சுற்றியுள்ள code-ஐ மாற்றுங்கள்.** dependency list-ஐ [உங்கள் Effect-ன் code பயன்படுத்தும் அனைத்து reactive values-யின் பட்டியல்](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) என்று நினைக்கலாம். அந்த பட்டியலில் என்ன இட வேண்டும் என்பதை நீங்கள் *தேர்வு* செய்யவில்லை. அந்த பட்டியல் உங்கள் code-ஐ *விவரிக்கிறது*. dependency list-ஐ மாற்ற, code-ஐ மாற்றுங்கள்.

இது equation ஒன்றைத் தீர்ப்பது போல உணரலாம். ஒரு இலக்குடன் தொடங்கலாம் (எடுத்துக்காட்டாக, dependency ஒன்றை அகற்றுதல்), அந்த இலக்குக்கு பொருந்தும் code-ஐ நீங்கள் "கண்டுபிடிக்க" வேண்டும். equations தீர்ப்பது எல்லோருக்கும் சுவாரஸ்யமாக இருக்காது; Effects எழுதுவதற்கும் அதே சொல்லலாம்! அதிர்ஷ்டமாக, கீழே முயற்சிக்கக்கூடிய பொதுவான recipes பட்டியல் உள்ளது.

<Pitfall>

உங்களிடம் ஏற்கனவே உள்ள codebase இருந்தால், linter-ஐ இவ்வாறு suppress செய்யும் சில Effects இருக்கலாம்:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**dependencies code-உடன் பொருந்தவில்லை என்றால், bugs உருவாகும் அபாயம் மிக அதிகம்.** linter-ஐ suppress செய்வதன் மூலம், உங்கள் Effect எந்த values-ஐ சார்ந்துள்ளது என்பதைப் பற்றி React-க்கு நீங்கள் "பொய்" சொல்கிறீர்கள்.

அதற்கு பதிலாக, கீழே உள்ள techniques-ஐ பயன்படுத்துங்கள்.

</Pitfall>

<DeepDive>

#### dependency linter-ஐ suppress செய்வது ஏன் இவ்வளவு ஆபத்தானது? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

linter-ஐ suppress செய்வது கண்டுபிடிக்கவும் சரிசெய்யவும் கடினமான, மிகவும் unintuitive bugs-க்கு வழிவகுக்கும். ஒரு எடுத்துக்காட்டு இதோ:

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        எண்ணிக்கை: {count}
        <button onClick={() => setCount(0)}>மீட்டமை</button>
      </h1>
      <hr />
      <p>
        ஒவ்வொரு வினாடியும் increment ஆகும் அளவு:
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

நீங்கள் Effect-ஐ "mount ஆனபோது மட்டும்" run செய்ய விரும்பினீர்கள் என்று வைத்துக்கொள்வோம். [காலியான (`[]`) dependencies](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) அதைச் செய்கின்றன என்று படித்ததால், linter-ஐ புறக்கணித்து dependencies ஆக `[]`-ஐ கட்டாயமாக குறிப்பிட்டீர்கள்.

இந்த counter இரண்டு buttons மூலம் configure செய்யப்படும் அளவு படி ஒவ்வொரு வினாடியும் increment ஆக வேண்டும். ஆனால் இந்த Effect எதையும் சார்ந்ததல்ல என்று React-க்கு நீங்கள் "பொய்" சொன்னதால், React initial render-இலிருந்து வந்த `onTick` function-ஐ என்றைக்கும் பயன்படுத்திக் கொண்டே இருக்கும். [அந்த render-இல்,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` `0` ஆகவும் `increment` `1` ஆகவும் இருந்தன. அதனால் அந்த render-இலிருந்து வந்த `onTick` ஒவ்வொரு வினாடியும் எப்போதும் `setCount(0 + 1)`-ஐ call செய்கிறது; நீங்கள் எப்போதும் `1`-ஐப் பார்க்கிறீர்கள். இப்படிப்பட்ட bugs பல components-களில் பரவியிருந்தால் சரிசெய்ய கடினமாகும்.

linter-ஐ புறக்கணிப்பதை விட எப்போதும் சிறந்த solution இருக்கும்! இந்த code-ஐ சரிசெய்ய, `onTick`-ஐ dependency list-இல் சேர்க்க வேண்டும். (interval ஒரே முறை மட்டுமே setup ஆகும் என்பதை உறுதி செய்ய, [`onTick`-ஐ Effect Event ஆக்குங்கள்.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**dependency lint error-ஐ compilation error போல நடத்த பரிந்துரைக்கிறோம். அதை suppress செய்யவில்லை என்றால், இப்படிப்பட்ட bugs-ஐ நீங்கள் ஒருபோதும் காணமாட்டீர்கள்.** இந்த page-ன் மீதமுள்ள பகுதி, இதற்கும் பிற நிலைகளுக்கும் மாற்று வழிகளை document செய்கிறது.

</DeepDive>

## தேவையற்ற dependencies-ஐ அகற்றுதல் {/*removing-unnecessary-dependencies*/}

code-ஐ பிரதிபலிக்க Effect-ன் dependencies-ஐ ஒவ்வொரு முறையும் adjust செய்யும் போது, dependency list-ஐப் பாருங்கள். இந்த dependencies-இல் ஏதாவது மாறும் போது Effect மீண்டும் run ஆகுவது பொருத்தமா? சில நேரங்களில் பதில் "இல்லை":

* உங்கள் Effect-ன் *வேறு பகுதிகளை* வேறு conditions-இல் re-execute செய்ய விரும்பலாம்.
* dependency ஒன்றின் மாற்றங்களுக்கு "react" செய்வதற்குப் பதிலாக, அதன் *சமீபத்திய value*-ஐ மட்டும் வாசிக்க விரும்பலாம்.
* dependency ஒன்று object அல்லது function என்பதால் *தற்செயலாக* மிக அடிக்கடி மாறலாம்.

சரியான solution-ஐ கண்டுபிடிக்க, உங்கள் Effect பற்றி சில கேள்விகளுக்கு பதில் அளிக்க வேண்டும். அவற்றைப் பார்ப்போம்.

### இந்த code event handler-க்கு நகர வேண்டுமா? {/*should-this-code-move-to-an-event-handler*/}

முதலில் சிந்திக்க வேண்டியது, இந்த code Effect ஆக இருக்க வேண்டுமா என்பதுதான்.

ஒரு form-ஐ கற்பனை செய்யுங்கள். submit செய்தபோது, `submitted` state variable-ஐ `true` ஆக அமைக்கிறீர்கள். POST request அனுப்பி notification காட்ட வேண்டும். `submitted` `true` ஆக இருப்பதற்கு "react" செய்யும் Effect-க்குள் இந்த logic-ஐ வைத்துள்ளீர்கள்:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('வெற்றிகரமாக பதிவு செய்யப்பட்டது!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

பின்னர், தற்போதைய theme-க்கு ஏற்ப notification message-ஐ style செய்ய விரும்புகிறீர்கள், எனவே தற்போதைய theme-ஐ வாசிக்கிறீர்கள். `theme` component body-இல் declare செய்யப்பட்டதால், அது reactive value; எனவே அதை dependency ஆக சேர்க்கிறீர்கள்:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('வெற்றிகரமாக பதிவு செய்யப்பட்டது!', theme);
    }
  }, [submitted, theme]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

இதைச் செய்ததால், நீங்கள் ஒரு bug உருவாக்கிவிட்டீர்கள். முதலில் form-ஐ submit செய்து, பின்னர் Dark மற்றும் Light themes இடையே switch செய்கிறீர்கள் என்று கற்பனை செய்யுங்கள். `theme` மாறும், Effect மீண்டும் run ஆகும், அதனால் அதே notification மீண்டும் காட்டப்படும்!

**இங்கே பிரச்சினை என்னவெனில் இது முதலில் Effect ஆக இருக்கவே கூடாது.** *form submit செய்தல்* என்ற குறிப்பிட்ட interaction-க்கு பதிலாக இந்த POST request-ஐ அனுப்பி notification காட்ட விரும்புகிறீர்கள். குறிப்பிட்ட interaction-க்கு பதிலாக சில code run செய்ய, அந்த logic-ஐ நேரடியாக பொருந்திய event handler-க்குள் வையுங்கள்:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('வெற்றிகரமாக பதிவு செய்யப்பட்டது!', theme);
  }

  // ...
}
```

இப்போது code event handler-இல் இருப்பதால், அது reactive அல்ல; எனவே பயனர் form-ஐ submit செய்தால் மட்டுமே run ஆகும். [event handlers மற்றும் Effects இடையே தேர்வு செய்வது](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) மற்றும் [தேவையற்ற Effects-ஐ எப்படி நீக்குவது](/learn/you-might-not-need-an-effect) பற்றி மேலும் படிக்கவும்.

### உங்கள் Effect தொடர்பில்லாத பல விஷயங்களைச் செய்கிறதா? {/*is-your-effect-doing-several-unrelated-things*/}

அடுத்ததாக, உங்கள் Effect தொடர்பில்லாத பல விஷயங்களைச் செய்கிறதா என்று உங்களையே கேளுங்கள்.

பயனர் city மற்றும் area தேர்வு செய்ய வேண்டிய shipping form ஒன்றை உருவாக்குகிறீர்கள் என்று கற்பனை செய்யுங்கள். தேர்ந்தெடுக்கப்பட்ட `country` அடிப்படையில் server-இலிருந்து `cities` பட்டியலை fetch செய்து dropdown-இல் காட்டுகிறீர்கள்:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன

  // ...
```

இது [Effect-இல் data fetch செய்வதற்கான](/learn/you-might-not-need-an-effect#fetching-data) நல்ல எடுத்துக்காட்டு. `country` prop அடிப்படையில் `cities` state-ஐ network உடன் synchronize செய்கிறீர்கள். இதை event handler-இல் செய்ய முடியாது; ஏனெனில் `ShippingForm` காட்டப்படும் உடனேயும், `country` மாறும் ஒவ்வொரு முறையும் (எந்த interaction காரணமாக இருந்தாலும்) fetch செய்ய வேண்டும்.

இப்போது city areas-க்கான இரண்டாவது select box-ஐ சேர்க்கிறீர்கள் என்று வைத்துக்கொள்வோம்; அது தற்போது தேர்ந்தெடுக்கப்பட்ட `city`-க்கான `areas`-ஐ fetch செய்ய வேண்டும். அதே Effect-க்குள் areas பட்டியலுக்கான இரண்டாவது `fetch` call-ஐ சேர்ப்பதிலிருந்து தொடங்கலாம்:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன

  // ...
```

ஆனால் Effect இப்போது `city` state variable-ஐ பயன்படுத்துவதால், dependencies பட்டியலில் `city`-ஐ சேர்க்க வேண்டியதாகிவிட்டது. அது ஒரு பிரச்சினையை உருவாக்கியது: பயனர் வேறு city தேர்வு செய்தால், Effect மீண்டும் run ஆகி `fetchCities(country)`-ஐ call செய்யும். இதனால் cities பட்டியலை தேவையில்லாமல் பல முறை refetch செய்வீர்கள்.

**இந்த code-இல் பிரச்சினை என்னவெனில், நீங்கள் தொடர்பில்லாத இரண்டு வேறு விஷயங்களை synchronize செய்கிறீர்கள்:**

1. `country` prop அடிப்படையில் `cities` state-ஐ network-க்கு synchronize செய்ய விரும்புகிறீர்கள்.
1. `city` state அடிப்படையில் `areas` state-ஐ network-க்கு synchronize செய்ய விரும்புகிறீர்கள்.

logic-ஐ இரண்டு Effects ஆகப் பிரியுங்கள்; ஒவ்வொன்றும் தன்னுடன் synchronize செய்ய வேண்டிய prop/state-க்கு react செய்யும்:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன

  // ...
```

இப்போது முதல் Effect `country` மாறினால் மட்டுமே மீண்டும் run ஆகும்; இரண்டாவது Effect `city` மாறும்போது மீண்டும் run ஆகும். அவற்றை நோக்கத்தின் அடிப்படையில் பிரித்துள்ளீர்கள்: இரண்டு வேறு விஷயங்கள் இரண்டு தனி Effects மூலம் synchronized ஆகின்றன. இரண்டு தனி Effects-க்கு இரண்டு தனி dependency lists உள்ளன, எனவே அவை தற்செயலாக ஒன்றையொன்று trigger செய்யாது.

இறுதி code அசல் code-ஐ விட நீளமாக இருக்கலாம், ஆனால் இந்த Effects-ஐப் பிரிப்பது இன்னும் சரியானதே. [ஒவ்வொரு Effect-மும் independent synchronization process-ஐ குறிக்க வேண்டும்.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) இந்த எடுத்துக்காட்டில், ஒரு Effect-ஐ நீக்கினாலும் மற்ற Effect-ன் logic உடையாது. அதாவது அவை *வேறு விஷயங்களை synchronize செய்கின்றன,* எனவே அவற்றை பிரிப்பது நல்லது. duplication குறித்து கவலை இருந்தால், [repetitive logic-ஐ custom Hook-க்குள் extract செய்து](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks) இந்த code-ஐ மேம்படுத்தலாம்.

### அடுத்த state-ஐ கணக்கிட சில state-ஐ வாசிக்கிறீர்களா? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

புதிய message வந்த ஒவ்வொரு முறையும், இந்த Effect புதிதாக உருவாக்கப்பட்ட array மூலம் `messages` state variable-ஐ update செய்கிறது:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

அனைத்து existing messages-ஐயும் வைத்து தொடங்கி, இறுதியில் புதிய message-ஐ சேர்க்க [புதிய array உருவாக்க](/learn/updating-arrays-in-state) இது `messages` variable-ஐப் பயன்படுத்துகிறது. ஆனால் `messages` Effect வாசிக்கும் reactive value என்பதால், அது dependency ஆக இருக்க வேண்டும்:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

`messages`-ஐ dependency ஆக்குவது ஒரு பிரச்சினையை உருவாக்குகிறது.

ஒவ்வொரு message-ஐப் பெறும் போதும், `setMessages()` பெற்ற message-ஐ கொண்ட புதிய `messages` array உடன் component-ஐ re-render செய்யும். ஆனால் இந்த Effect இப்போது `messages`-ஐ சார்ந்திருப்பதால், இது Effect-ஐ *மேலும்* re-synchronize செய்யும். எனவே ஒவ்வொரு புதிய message-ும் chat-ஐ reconnect செய்யும். பயனருக்கு அது பிடிக்காது!

பிரச்சினையை சரிசெய்ய, Effect-க்குள் `messages`-ஐ வாசிக்க வேண்டாம். அதற்கு பதிலாக, `setMessages`-க்கு [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) ஒன்றை pass செய்யுங்கள்:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

**இப்போது உங்கள் Effect `messages` variable-ஐ முற்றிலும் வாசிக்கவில்லை என்பதை கவனியுங்கள்.** `msgs => [...msgs, receivedMessage]` போன்ற updater function ஒன்றை pass செய்தால் போதும். React [உங்கள் updater function-ஐ queue-இல் வைக்கும்](/learn/queueing-a-series-of-state-updates), அடுத்த render-இல் அதற்கு `msgs` argument-ஐ வழங்கும். அதனால் Effect தானே இனி `messages`-ஐ சார்ந்து இருக்க வேண்டியதில்லை. இந்த fix-ன் விளைவாக, chat message ஒன்றைப் பெறுவது இனி chat-ஐ reconnect செய்யாது.

### மாற்றங்களுக்கு "react" செய்யாமல் value ஒன்றை வாசிக்க விரும்புகிறீர்களா? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

`isMuted` `true` அல்லாத வரை, பயனர் புதிய message பெறும் போது sound ஒன்றை play செய்ய விரும்புகிறீர்கள் என்று வைத்துக்கொள்வோம்:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

உங்கள் Effect இப்போது அதன் code-இல் `isMuted`-ஐ பயன்படுத்துவதால், அதை dependencies-இல் சேர்க்க வேண்டும்:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

பிரச்சினை என்னவெனில் `isMuted` மாறும் ஒவ்வொரு முறையும் (எடுத்துக்காட்டாக, பயனர் "Muted" toggle-ஐ அழுத்தும் போது), Effect re-synchronize ஆகி chat-க்கு reconnect செய்யும். இது விரும்பத்தக்க user experience அல்ல! (இந்த எடுத்துக்காட்டில், linter-ஐ disable செய்தாலும் வேலை செய்யாது; அப்படிச் செய்தால் `isMuted` அதன் பழைய value-இலேயே "stuck" ஆகிவிடும்.)

இந்த பிரச்சினையை தீர்க்க, reactive ஆக இருக்கக் கூடாத logic-ஐ Effect-இலிருந்து extract செய்ய வேண்டும். இந்த Effect `isMuted` மாற்றங்களுக்கு "react" செய்ய வேண்டாம். [இந்த non-reactive logic பகுதியை Effect Event-க்குள் நகர்த்துங்கள்:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

Effect Events, Effect ஒன்றை reactive பகுதிகள் (`roomId` போன்ற reactive values மற்றும் அவற்றின் மாற்றங்களுக்கு "react" செய்ய வேண்டியவை) மற்றும் non-reactive பகுதிகள் (`onMessage` `isMuted`-ஐ வாசிப்பது போல சமீபத்திய values-ஐ மட்டும் வாசிப்பவை) எனப் பிரிக்க அனுமதிக்கின்றன. **இப்போது `isMuted`-ஐ Effect Event-க்குள் வாசிப்பதால், அது உங்கள் Effect-ன் dependency ஆக இருக்க வேண்டியதில்லை.** இதன் விளைவாக, "Muted" setting-ஐ on/off toggle செய்தால் chat reconnect ஆகாது; அசல் பிரச்சினை தீர்க்கப்படுகிறது!

#### props-இலிருந்து வரும் event handler-ஐ wrap செய்தல் {/*wrapping-an-event-handler-from-the-props*/}

உங்கள் component event handler ஒன்றை prop ஆக பெறும் போது இதே போன்ற பிரச்சினையை சந்திக்கலாம்:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

parent component ஒவ்வொரு render-இலும் *வேறு* `onReceiveMessage` function pass செய்கிறது என்று வைத்துக்கொள்வோம்:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage` dependency என்பதால், ஒவ்வொரு parent re-render-க்கும் பிறகு Effect re-synchronize ஆகும். இது chat-க்கு reconnect செய்யும். இதைத் தீர்க்க, call-ஐ Effect Event-க்குள் wrap செய்யுங்கள்:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

Effect Events reactive அல்ல, எனவே அவற்றை dependencies ஆக குறிப்பிட வேண்டியதில்லை. இதன் விளைவாக, parent component ஒவ்வொரு re-render-இலும் வேறு function pass செய்தாலும் chat இனி reconnect ஆகாது.

#### reactive மற்றும் non-reactive code-ஐப் பிரித்தல் {/*separating-reactive-and-non-reactive-code*/}

இந்த எடுத்துக்காட்டில், `roomId` மாறும் ஒவ்வொரு முறையும் visit ஒன்றை log செய்ய விரும்புகிறீர்கள். ஒவ்வொரு log-உடனும் தற்போதைய `notificationCount`-ஐ சேர்க்க விரும்புகிறீர்கள்; ஆனால் `notificationCount` மாறுவது log event-ஐ trigger செய்ய *விரும்பவில்லை*.

solution மீண்டும் non-reactive code-ஐ Effect Event-க்குள் பிரிப்பதே:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

உங்கள் logic `roomId` தொடர்பாக reactive ஆக இருக்க வேண்டும்; எனவே `roomId`-ஐ Effect-க்குள் வாசிக்கிறீர்கள். ஆனால் `notificationCount` மாறுவது கூடுதல் visit ஒன்றை log செய்ய வேண்டாம்; எனவே `notificationCount`-ஐ Effect Event-க்குள் வாசிக்கிறீர்கள். [Effect Events பயன்படுத்தி Effects-இலிருந்து சமீபத்திய props மற்றும் state-ஐ வாசிப்பது பற்றி மேலும் அறியவும்.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### ஏதாவது reactive value தற்செயலாக மாறுகிறதா? {/*does-some-reactive-value-change-unintentionally*/}

சில நேரங்களில், உங்கள் Effect ஒரு குறிப்பிட்ட value-க்கு "react" செய்ய வேண்டும் என்று நீங்கள் உண்மையாகவே விரும்பலாம்; ஆனால் அந்த value நீங்கள் விரும்புவதை விட அடிக்கடி மாறும் -- மேலும் பயனரின் பார்வையில் உண்மையான மாற்றத்தை பிரதிபலிக்காமல் இருக்கலாம். எடுத்துக்காட்டாக, உங்கள் component body-இல் `options` object ஒன்றை உருவாக்கி, பின்னர் அதை Effect-க்குள் வாசிக்கிறீர்கள் என்று வைத்துக்கொள்வோம்:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

இந்த object component body-இல் declare செய்யப்பட்டதால், அது [reactive value.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Effect-க்குள் இத்தகைய reactive value-ஐ வாசிக்கும் போது, அதை dependency ஆக declare செய்கிறீர்கள். இதனால் உங்கள் Effect அதன் மாற்றங்களுக்கு "react" செய்வது உறுதி:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

அதை dependency ஆக declare செய்வது முக்கியம்! எடுத்துக்காட்டாக, `roomId` மாறினால், புதிய `options` உடன் உங்கள் Effect chat-க்கு reconnect செய்வதை இது உறுதி செய்கிறது. ஆனால் மேலுள்ள code-இல் ஒரு பிரச்சினையும் உள்ளது. அதை பார்க்க, கீழே உள்ள sandbox-இல் input-இல் type செய்து, console-இல் என்ன நடக்கிறது என்பதைப் பாருங்கள்:

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

மேலுள்ள sandbox-இல், input `message` state variable-ஐ மட்டும் update செய்கிறது. பயனரின் பார்வையில், இது chat connection-ஐ பாதிக்கக் கூடாது. ஆனால் `message`-ஐ update செய்யும் ஒவ்வொரு முறையும், உங்கள் component re-render ஆகிறது. component re-render ஆனபோது, அதன் உள்ளேயுள்ள code மீண்டும் ஆரம்பத்திலிருந்து run ஆகிறது.

`ChatRoom` component-ன் ஒவ்வொரு re-render-இலும் புதிய `options` object ஆரம்பத்திலிருந்து உருவாக்கப்படுகிறது. கடைசி render-இல் உருவாக்கப்பட்ட `options` object-இலிருந்து இது *வேறு object* என்று React பார்க்கிறது. அதனால் `options`-ஐ சார்ந்த உங்கள் Effect re-synchronize ஆகிறது; நீங்கள் type செய்யும் போதே chat reconnect ஆகிறது.

**இந்த பிரச்சினை objects மற்றும் functions-ஐ மட்டுமே பாதிக்கும். JavaScript-இல் புதிதாக உருவாக்கப்படும் ஒவ்வொரு object மற்றும் function மற்ற அனைத்திலிருந்தும் வேறுபட்டதாக கருதப்படுகிறது. அவற்றின் உள்ளடக்கம் ஒன்றே இருந்தாலும் அதனால் மாற்றமில்லை!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**Object மற்றும் function dependencies, உங்கள் Effect தேவையை விட அதிகமாக re-synchronize ஆகச் செய்யலாம்.**

அதனால், இயன்றபோது உங்கள் Effect-ன் dependencies ஆக objects மற்றும் functions-ஐத் தவிர்க்க முயற்சி செய்ய வேண்டும். அதற்கு பதிலாக, அவற்றை component-க்கு வெளியே, Effect-க்குள் நகர்த்துங்கள், அல்லது அவற்றிலிருந்து primitive values-ஐ extract செய்யுங்கள்.

#### static objects மற்றும் functions-ஐ component-க்கு வெளியே நகர்த்துங்கள் {/*move-static-objects-and-functions-outside-your-component*/}

object எந்த props மற்றும் state-யையும் சார்ந்திருக்கவில்லை என்றால், அந்த object-ஐ component-க்கு வெளியே நகர்த்தலாம்:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

இவ்வாறு, அது reactive அல்ல என்பதை linter-க்கு நீங்கள் *நிரூபிக்கிறீர்கள்*. re-render காரணமாக அது மாற முடியாது; எனவே அது dependency ஆக இருக்க வேண்டியதில்லை. இப்போது `ChatRoom` re-render ஆனாலும் உங்கள் Effect re-synchronize ஆகாது.

இது functions-க்கும் வேலை செய்கிறது:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

`createOptions` உங்கள் component-க்கு வெளியே declare செய்யப்பட்டதால், அது reactive value அல்ல. அதனால் அது உங்கள் Effect-ன் dependencies-இல் குறிப்பிடப்பட வேண்டியதில்லை; மேலும் அது ஒருபோதும் உங்கள் Effect re-synchronize ஆகக் காரணமாகாது.

#### dynamic objects மற்றும் functions-ஐ உங்கள் Effect-க்குள் நகர்த்துங்கள் {/*move-dynamic-objects-and-functions-inside-your-effect*/}

உங்கள் object, re-render காரணமாக மாறக்கூடிய `roomId` prop போன்ற reactive value ஒன்றை சார்ந்திருந்தால், அதை உங்கள் component-க்கு *வெளியே* எடுத்துச் செல்ல முடியாது. ஆனால் அதன் creation-ஐ உங்கள் Effect-ன் code-க்குள் நகர்த்தலாம்:

```js {7-10,11,14}
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
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

இப்போது `options` உங்கள் Effect-க்குள் declare செய்யப்பட்டதால், அது இனி உங்கள் Effect-ன் dependency அல்ல. அதற்கு பதிலாக, உங்கள் Effect பயன்படுத்தும் ஒரே reactive value `roomId`. `roomId` object அல்லது function அல்லாததால், அது *தற்செயலாக* வேறுபடாது என்பதை உறுதி செய்யலாம். JavaScript-இல் numbers மற்றும் strings அவற்றின் content மூலம் compare செய்யப்படுகின்றன:

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

இந்த fix காரணமாக, input-ஐ edit செய்தால் chat இனி reconnect ஆகாது:

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
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

ஆனால் நீங்கள் எதிர்பார்ப்பது போல `roomId` dropdown-ஐ மாற்றும் போது அது reconnect ஆகும்.

இது functions-க்கும் வேலை செய்கிறது:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

உங்கள் Effect-க்குள் logic பகுதிகளை group செய்ய உங்கள் சொந்த functions-ஐ எழுதலாம். அவற்றையும் உங்கள் Effect-க்குள் *declare* செய்தால், அவை reactive values அல்ல; எனவே அவை உங்கள் Effect-ன் dependencies ஆக இருக்க வேண்டியதில்லை.

#### objects-இலிருந்து primitive values-ஐ வாசித்தல் {/*read-primitive-values-from-objects*/}

சில நேரங்களில், props-இலிருந்து object ஒன்றைப் பெறலாம்:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

இங்கே ஆபத்து என்னவெனில் parent component rendering நடக்கும் போது object-ஐ உருவாக்கும்:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

இதனால் parent component re-render ஆகும் ஒவ்வொரு முறையும் உங்கள் Effect reconnect ஆகும். இதைச் சரிசெய்ய, object-இலிருந்து தகவலை Effect-க்கு *வெளியே* வாசியுங்கள்; object மற்றும் function dependencies இருக்காமல் தவிர்க்கவும்:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

logic சற்று repetitive ஆகிறது (Effect-க்கு வெளியே object-இலிருந்து சில values-ஐ வாசித்து, பின்னர் Effect-க்குள் அதே values உடன் object ஒன்றை உருவாக்குகிறீர்கள்). ஆனால் உங்கள் Effect *உண்மையில்* எந்த தகவலை சார்ந்துள்ளது என்பதை இது மிகவும் explicit ஆக்குகிறது. parent component தற்செயலாக object-ஐ மீண்டும் உருவாக்கினால், chat reconnect ஆகாது. ஆனால் `options.roomId` அல்லது `options.serverUrl` உண்மையில் வேறுபட்டிருந்தால், chat reconnect ஆகும்.

#### functions-இலிருந்து primitive values-ஐ கணக்கிடுதல் {/*calculate-primitive-values-from-functions*/}

அதே அணுகுமுறை functions-க்கும் வேலை செய்யலாம். எடுத்துக்காட்டாக, parent component function ஒன்றை pass செய்கிறது என்று வைத்துக்கொள்வோம்:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

அதை dependency ஆக்காமல் இருக்க (மற்றும் re-renders-இல் reconnect ஆகாமல் இருக்க), அதை Effect-க்கு வெளியே call செய்யுங்கள். இது objects அல்லாத `roomId` மற்றும் `serverUrl` values-ஐ தருகிறது; அவற்றை உங்கள் Effect-க்குள் வாசிக்கலாம்:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
```

இது [pure](/learn/keeping-components-pure) functions-க்கு மட்டுமே வேலை செய்கிறது; ஏனெனில் அவற்றை rendering நடக்கும் போது call செய்வது பாதுகாப்பானது. உங்கள் function event handler ஆக இருந்தாலும், அதன் மாற்றங்கள் உங்கள் Effect-ஐ re-synchronize செய்ய வேண்டாம் என்றால், [அதை Effect Event-க்குள் wrap செய்யுங்கள்.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Dependencies எப்போதும் code-உடன் பொருந்த வேண்டும்.
- உங்கள் dependencies-இல் திருப்தி இல்லையெனில், edit செய்ய வேண்டியது code தான்.
- linter-ஐ suppress செய்வது மிகவும் குழப்பமான bugs-க்கு வழிவகுக்கும்; அதை எப்போதும் தவிர்க்க வேண்டும்.
- dependency ஒன்றை அகற்ற, அது தேவையில்லை என்பதை linter-க்கு "நிரூபிக்க" வேண்டும்.
- குறிப்பிட்ட interaction-க்கு பதிலாக சில code run ஆக வேண்டும் என்றால், அந்த code-ஐ event handler-க்கு நகர்த்துங்கள்.
- உங்கள் Effect-ன் வேறு பகுதிகள் வேறு காரணங்களுக்காக re-run ஆக வேண்டும் என்றால், அதை பல Effects ஆகப் பிரியுங்கள்.
- முந்தைய state அடிப்படையில் state-ஐ update செய்ய விரும்பினால், updater function-ஐ pass செய்யுங்கள்.
- சமீபத்திய value-ஐ அதற்கு "react" செய்யாமல் வாசிக்க விரும்பினால், உங்கள் Effect-இலிருந்து Effect Event ஒன்றை extract செய்யுங்கள்.
- JavaScript-இல் objects மற்றும் functions வேறு நேரங்களில் உருவாக்கப்பட்டிருந்தால் அவை வேறுபட்டவை என்று கருதப்படும்.
- object மற்றும் function dependencies-ஐத் தவிர்க்க முயற்சி செய்யுங்கள். அவற்றை component-க்கு வெளியே அல்லது Effect-க்குள் நகர்த்துங்கள்.

</Recap>

<Challenges>

#### reset ஆகிக்கொண்டிருக்கும் interval-ஐ சரிசெய்யுங்கள் {/*fix-a-resetting-interval*/}

இந்த Effect ஒவ்வொரு வினாடியும் tick ஆகும் interval ஒன்றை setup செய்கிறது. விசித்திரமாக ஏதோ நடப்பதை கவனித்துள்ளீர்கள்: interval tick ஆகும் ஒவ்வொரு முறையும் அது destroy செய்யப்பட்டு மீண்டும் உருவாக்கப்படுகிறது போல தெரிகிறது. interval தொடர்ந்து மீண்டும் உருவாக்கப்படாதபடி code-ஐ சரிசெய்யுங்கள்.

<Hint>

இந்த Effect-ன் code `count`-ஐ சார்ந்துள்ளது போல தெரிகிறது. இந்த dependency தேவையில்லாதபடி செய்ய ஏதாவது வழி உள்ளதா? அந்த value-க்கு dependency சேர்க்காமல், அதன் முந்தைய value அடிப்படையில் `count` state-ஐ update செய்ய வழி இருக்க வேண்டும்.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ interval உருவாக்கப்படுகிறது');
    const id = setInterval(() => {
      console.log('⏰ interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ interval clear செய்யப்படுகிறது');
      clearInterval(id);
    };
  }, [count]);

  return <h1>எண்ணிக்கை: {count}</h1>
}
```

</Sandpack>

<Solution>

Effect-க்குள் இருந்து `count` state-ஐ `count + 1` ஆக update செய்ய விரும்புகிறீர்கள். ஆனால் இதனால் உங்கள் Effect `count`-ஐ சார்ந்துவிடுகிறது; அது ஒவ்வொரு tick-க்கும் மாறுகிறது. அதனால் தான் interval ஒவ்வொரு tick-க்கும் மீண்டும் உருவாக்கப்படுகிறது.

இதைக் தீர்க்க, [updater function](/reference/react/useState#updating-state-based-on-the-previous-state)-ஐ பயன்படுத்தி `setCount(count + 1)`-க்கு பதிலாக `setCount(c => c + 1)` எழுதுங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ interval உருவாக்கப்படுகிறது');
    const id = setInterval(() => {
      console.log('⏰ interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ interval clear செய்யப்படுகிறது');
      clearInterval(id);
    };
  }, []);

  return <h1>எண்ணிக்கை: {count}</h1>
}
```

</Sandpack>

Effect-க்குள் `count`-ஐ வாசிப்பதற்குப் பதிலாக, React-க்கு `c => c + 1` instruction ("இந்த எண்ணை increment செய்!") ஒன்றை pass செய்கிறீர்கள். React அதை அடுத்த render-இல் apply செய்யும். மேலும் உங்கள் Effect-க்குள் `count` value-ஐ இனி வாசிக்க வேண்டியதில்லை என்பதால், உங்கள் Effect-ன் dependencies-ஐ காலியாக (`[]`) வைத்திருக்கலாம். இது ஒவ்வொரு tick-க்கும் Effect interval-ஐ மீண்டும் உருவாக்குவதைத் தடுக்கிறது.

</Solution>

#### மீண்டும் trigger ஆகும் animation-ஐ சரிசெய்யுங்கள் {/*fix-a-retriggering-animation*/}

இந்த எடுத்துக்காட்டில், "காட்டு" அழுத்தும்போது welcome message fade in ஆகிறது. animation ஒரு வினாடி எடுக்கும். "அகற்று" அழுத்தும்போது welcome message உடனடியாக மறையும். fade-in animation-க்கான logic `animation.js` file-இல் plain JavaScript [animation loop](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) ஆக implement செய்யப்பட்டுள்ளது. அந்த logic-ஐ மாற்ற வேண்டியதில்லை. அதை third-party library போல நடத்தலாம். உங்கள் Effect DOM node-க்காக `FadeInAnimation` instance ஒன்றை உருவாக்கி, animation-ஐ control செய்ய `start(duration)` அல்லது `stop()` call செய்கிறது. `duration` slider மூலம் கட்டுப்படுத்தப்படுகிறது. slider-ஐ adjust செய்து animation எப்படி மாறுகிறது என்பதைப் பாருங்கள்.

இந்த code ஏற்கனவே வேலை செய்கிறது, ஆனால் நீங்கள் மாற்ற விரும்பும் ஒன்று உள்ளது. தற்போது, `duration` state variable-ஐ control செய்யும் slider-ஐ நகர்த்தும்போது, அது animation-ஐ retrigger செய்கிறது. Effect `duration` variable-க்கு "react" செய்யாதபடி behavior-ஐ மாற்றுங்கள். "காட்டு" அழுத்தும்போது, Effect slider-இல் உள்ள தற்போதைய `duration`-ஐ பயன்படுத்த வேண்டும். ஆனால் slider-ஐ நகர்த்துவது மட்டும் animation-ஐ retrigger செய்யக்கூடாது.

<Hint>

Effect-க்குள் reactive ஆக இருக்கக் கூடாத code line ஏதேனும் உள்ளதா? non-reactive code-ஐ Effect-இலிருந்து எப்படி வெளியே நகர்த்தலாம்?

</Hint>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in நேரம்: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

உங்கள் Effect `duration`-ன் சமீபத்திய value-ஐ வாசிக்க வேண்டும்; ஆனால் `duration` மாற்றங்களுக்கு "react" செய்ய வேண்டாம். animation-ஐ தொடங்க `duration`-ஐப் பயன்படுத்துகிறீர்கள், ஆனால் animation தொடங்குவது reactive அல்ல. non-reactive code line-ஐ Effect Event-க்குள் extract செய்து, அந்த function-ஐ உங்கள் Effect-இலிருந்து call செய்யுங்கள்.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in நேரம்: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

`onAppear` போன்ற Effect Events reactive அல்ல, எனவே animation-ஐ retrigger செய்யாமல் அவற்றுக்குள் `duration`-ஐ வாசிக்கலாம்.

</Solution>

#### reconnect ஆகும் chat-ஐ சரிசெய்யுங்கள் {/*fix-a-reconnecting-chat*/}

இந்த எடுத்துக்காட்டில், "theme-ஐ toggle செய்" அழுத்தும் ஒவ்வொரு முறையும் chat reconnect ஆகிறது. இது ஏன் நடக்கிறது? Server URL-ஐ edit செய்தாலோ வேறு chat room தேர்வு செய்தாலோ மட்டும் chat reconnect ஆகும் வகையில் தவறை சரிசெய்யுங்கள்.

`chat.js`-ஐ external third-party library போல நடத்துங்கள்: அதன் API-ஐ check செய்ய அதைப் பார்க்கலாம், ஆனால் edit செய்ய வேண்டாம்.

<Hint>

இதைக் சரிசெய்ய ஒன்றுக்கு மேற்பட்ட வழிகள் உள்ளன; ஆனால் இறுதியில் object ஒன்றை dependency ஆக வைத்திருப்பதைத் தவிர்க்க வேண்டும்.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        theme-ஐ toggle செய்
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>{options.roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

உங்கள் Effect `options` object-ஐ சார்ந்திருப்பதால் மீண்டும் run ஆகிறது. Objects தற்செயலாக மீண்டும் உருவாக்கப்படலாம்; இயன்றபோது அவற்றை உங்கள் Effects-ன் dependencies ஆகத் தவிர்க்க முயற்சி செய்ய வேண்டும்.

மிகக் குறைந்த invasive fix என்பது `roomId` மற்றும் `serverUrl`-ஐ Effect-க்கு வெளியே வாசித்து, பின்னர் Effect அந்த primitive values-ஐ சார்ந்திருக்கச் செய்வது (அவை தற்செயலாக மாற முடியாது). Effect-க்குள் object ஒன்றை உருவாக்கி, அதை `createConnection`-க்கு pass செய்யுங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        theme-ஐ toggle செய்
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>{options.roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

object `options` prop-ஐ மேலும் குறிப்பான `roomId` மற்றும் `serverUrl` props-ஆல் மாற்றுவது இன்னும் சிறந்தது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        theme-ஐ toggle செய்
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் இணைக்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது: ' + serverUrl);
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

இயன்ற இடங்களில் primitive props-ஐப் பயன்படுத்துவது பின்னர் உங்கள் components-ஐ optimize செய்வதை உதவும்.

</Solution>

#### reconnect ஆகும் chat-ஐ மீண்டும் சரிசெய்யுங்கள் {/*fix-a-reconnecting-chat-again*/}

இந்த எடுத்துக்காட்டு encryption உடனோ இல்லாமலோ chat-க்கு connect செய்கிறது. checkbox-ஐ toggle செய்து, encryption on/off ஆக இருக்கும் போது console-இல் வரும் வேறு messages-ஐ கவனியுங்கள். room-ஐ மாற்றிப் பாருங்கள். பின்னர் theme-ஐ toggle செய்து பாருங்கள். நீங்கள் chat room-க்கு connect ஆனபோது, சில வினாடிகளுக்கு ஒருமுறை புதிய messages பெறுவீர்கள். அவற்றின் color நீங்கள் தேர்வு செய்த theme-உடன் பொருந்துகிறதா என்று சரிபாருங்கள்.

இந்த எடுத்துக்காட்டில், theme-ஐ மாற்ற முயலும் ஒவ்வொரு முறையும் chat reconnect ஆகிறது. இதைச் சரிசெய்யுங்கள். fix பிறகு, theme-ஐ மாற்றுவது chat-ஐ reconnect செய்யக்கூடாது; ஆனால் encryption settings-ஐ toggle செய்வது அல்லது room-ஐ மாற்றுவது reconnect செய்ய வேண்டும்.

`chat.js`-இல் எந்த code-ஐயும் மாற்ற வேண்டாம். அதற்கு வெளியே, அதே behavior கிடைத்தால் எந்த code-ஐயும் மாற்றலாம். எடுத்துக்காட்டாக, எந்த props கீழே pass செய்யப்படுகின்றன என்பதை மாற்றுவது உதவியாக இருக்கலாம்.

<Hint>

நீங்கள் இரண்டு functions-ஐ கீழே pass செய்கிறீர்கள்: `onMessage` மற்றும் `createConnection`. `App` re-render ஆகும் ஒவ்வொரு முறையும் இவை இரண்டும் ஆரம்பத்திலிருந்து உருவாக்கப்படுகின்றன. அவை ஒவ்வொரு முறையும் புதிய values ஆகக் கருதப்படுகின்றன; அதனால் தான் அவை உங்கள் Effect-ஐ மீண்டும் trigger செய்கின்றன.

இந்த functions-இல் ஒன்று event handler. event handler function-ன் புதிய values-க்கு "react" செய்யாமல், Effect-இல் event handler-ஐ call செய்ய ஏதாவது வழி தெரியுமா? அது இங்கே உதவும்!

இந்த functions-இல் மற்றொன்று imported API method-க்கு சில state pass செய்வதற்காக மட்டுமே உள்ளது. இந்த function உண்மையில் தேவையா? கீழே pass செய்யப்படும் முக்கியமான தகவல் என்ன? `App.js`-இலிருந்து `ChatRoom.js`-க்கு சில imports-ஐ நகர்த்த வேண்டியிருக்கலாம்.

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        dark theme பயன்படுத்து
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        encryption-ஐ இயக்கு
      </label>
      <label>
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('புதிய message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '" room-க்கு இணைக்கிறது... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இரண்டு முறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு இணைக்கிறது... (unencrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இரண்டு முறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

இதைக் தீர்க்க ஒன்றுக்கு மேற்பட்ட சரியான வழிகள் உள்ளன; அவற்றில் ஒரு சாத்தியமான solution இதோ.

அசல் எடுத்துக்காட்டில், theme-ஐ toggle செய்வது வேறு `onMessage` மற்றும் `createConnection` functions உருவாக்கப்பட்டு கீழே pass செய்யப்படுவதற்கு காரணமானது. Effect இந்த functions-ஐ சார்ந்திருந்ததால், theme-ஐ toggle செய்யும் ஒவ்வொரு முறையும் chat reconnect ஆனது.

`onMessage` தொடர்பான பிரச்சினையை சரிசெய்ய, அதை Effect Event-க்குள் wrap செய்ய வேண்டியிருந்தது:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

`onMessage` prop-இற்கு மாறாக, `onReceiveMessage` Effect Event reactive அல்ல. அதனால் அது உங்கள் Effect-ன் dependency ஆக இருக்க வேண்டியதில்லை. இதன் விளைவாக, `onMessage`-இல் வரும் மாற்றங்கள் chat reconnect ஆகக் காரணமாகாது.

`createConnection`-க்கு இதேதை செய்ய முடியாது; ஏனெனில் அது *reactive ஆக இருக்க வேண்டும்*. பயனர் encrypted மற்றும் unencrypted connection இடையே switch செய்தாலோ, தற்போதைய room-ஐ switch செய்தாலோ Effect re-trigger ஆக வேண்டும் என்று நீங்கள் *விரும்புகிறீர்கள்*. ஆனால் `createConnection` function என்பதால், அது வாசிக்கும் தகவல் *உண்மையில்* மாறியதா இல்லையா என்பதைச் சரிபார்க்க முடியாது. இதைத் தீர்க்க, `App` component-இலிருந்து `createConnection`-ஐ pass செய்வதற்குப் பதிலாக raw `roomId` மற்றும் `isEncrypted` values-ஐ pass செய்யுங்கள்:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('புதிய message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

இப்போது `App`-இலிருந்து `createConnection` function-ஐ கீழே pass செய்வதற்குப் பதிலாக, அதை Effect-க்குள் *நகர்த்தலாம்*:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

இந்த இரண்டு மாற்றங்களுக்குப் பிறகு, உங்கள் Effect எந்த function values-யையும் சார்ந்திருக்காது:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // reactive அல்ல

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // reactive value-ஐ வாசிக்கிறது
      };
      if (isEncrypted) { // reactive value-ஐ வாசிக்கிறது
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
```

இதன் விளைவாக, அர்த்தமுள்ள ஏதாவது ஒன்று (`roomId` அல்லது `isEncrypted`) மாறும் போது மட்டும் chat reconnect ஆகும்:

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

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        dark theme பயன்படுத்து
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        encryption-ஐ இயக்கு
      </label>
      <label>
        chat room-ஐத் தேர்வுசெய்க:{' '}
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
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('புதிய message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '" room-க்கு இணைக்கிறது... (encrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (encrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இரண்டு முறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்க வேண்டும். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்க வேண்டும். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு இணைக்கிறது... (unencrypted)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (unencrypted)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இரண்டு முறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
