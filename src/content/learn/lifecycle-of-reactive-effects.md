---
title: 'Reactive Effects-ன் lifecycle'
---

<Intro>

Effects-க்கு components-இலிருந்து வேறுபட்ட lifecycle உள்ளது. Components mount, update, அல்லது unmount ஆகலாம். ஒரு Effect இரண்டு விஷயங்களையே செய்ய முடியும்: ஏதாவது ஒன்றை synchronize செய்யத் தொடங்குவது, பின்னர் அதை synchronize செய்வதை நிறுத்துவது. உங்கள் Effect காலப்போக்கில் மாறும் props மற்றும் state-ஐ சார்ந்திருந்தால், இந்த cycle பல முறை நடக்கலாம். உங்கள் Effect-ன் dependencies-ஐ சரியாக குறிப்பிடியுள்ளீர்களா என்று பார்க்க React ஒரு linter rule வழங்குகிறது. இதனால் உங்கள் Effect சமீபத்திய props மற்றும் state உடன் synchronized ஆக இருக்கும்.

</Intro>

<YouWillLearn>

- ஒரு Effect-ன் lifecycle, component-ன் lifecycle-இலிருந்து எப்படி வேறுபடுகிறது
- ஒவ்வொரு தனி Effect-ஐயும் தனித்தனியாக எப்படி சிந்திக்க வேண்டும்
- உங்கள் Effect எப்போது, ஏன் re-synchronize செய்ய வேண்டும்
- உங்கள் Effect-ன் dependencies எப்படி தீர்மானிக்கப்படுகின்றன
- ஒரு value reactive என்பதன் பொருள் என்ன
- காலியான dependency array என்பதன் பொருள் என்ன
- linter மூலம் உங்கள் dependencies சரியானவை என்று React எப்படி சரிபார்க்கிறது
- linter-உடன் நீங்கள் உடன்படாதபோது என்ன செய்ய வேண்டும்

</YouWillLearn>

## ஒரு Effect-ன் lifecycle {/*the-lifecycle-of-an-effect*/}

ஒவ்வொரு React component-மும் ஒரே lifecycle வழியாக செல்கிறது:

- screen-இல் சேர்க்கப்படும் போது component _mount_ ஆகிறது.
- பொதுவாக interaction-க்கு பதிலாக புதிய props அல்லது state கிடைக்கும் போது component _update_ ஆகிறது.
- screen-இலிருந்து அகற்றப்படும் போது component _unmount_ ஆகிறது.

**components பற்றி சிந்திக்க இது நல்ல முறை, ஆனால் Effects பற்றி அல்ல.** அதற்கு பதிலாக, ஒவ்வொரு Effect-ஐயும் உங்கள் component-ன் lifecycle-இலிருந்து தனித்து சிந்திக்க முயலுங்கள். ஒரு Effect, தற்போதைய props மற்றும் state உடன் [external system ஒன்றை synchronize செய்வது](/learn/synchronizing-with-effects) எப்படி என்பதை விவரிக்கிறது. உங்கள் code மாறும்போது, synchronization அதிகமாகவோ குறைவாகவோ நடக்க வேண்டியிருக்கும்.

இந்த கருத்தை விளக்க, உங்கள் component-ஐ chat server-க்கு இணைக்கும் இந்த Effect-ஐப் பாருங்கள்:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

உங்கள் Effect-ன் body, **synchronize செய்யத் தொடங்குவது** எப்படி என்பதை குறிப்பிடுகிறது:

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

உங்கள் Effect return செய்யும் cleanup function, **synchronize செய்வதை நிறுத்துவது** எப்படி என்பதை குறிப்பிடுகிறது:

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

உள்ளுணர்வாக, உங்கள் component mount ஆகும் போது React **synchronize செய்யத் தொடங்கி**, component unmount ஆகும் போது **synchronize செய்வதை நிறுத்தும்** என்று நீங்கள் நினைக்கலாம். ஆனால் கதை இதோடு முடிவதில்லை! சில நேரங்களில் component mounted ஆகவே இருக்கும் போது, **பல முறை synchronization-ஐ தொடங்கியும் நிறுத்தியும்** ஆக வேண்டியிருக்கலாம்.

இது _ஏன்_ தேவையாகிறது, _எப்போது_ நடக்கிறது, இந்த behavior-ஐ நீங்கள் _எப்படி_ கட்டுப்படுத்தலாம் என்பதைக் காண்போம்.

<Note>

சில Effects எந்த cleanup function-யையும் return செய்யாது. [பெரும்பாலும்,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) நீங்கள் ஒன்றை return செய்ய விரும்புவீர்கள்; ஆனால் இல்லையெனில், நீங்கள் காலியான cleanup function ஒன்றை return செய்தது போல React நடக்கும்.

</Note>

### synchronization ஏன் ஒன்றுக்கு மேற்பட்ட முறை நடக்க வேண்டியிருக்கலாம் {/*why-synchronization-may-need-to-happen-more-than-once*/}

இந்த `ChatRoom` component, dropdown-இல் பயனர் தேர்வு செய்யும் `roomId` prop-ஐப் பெறுகிறது என்று கற்பனை செய்யுங்கள். ஆரம்பத்தில் பயனர் `"general"` room-ஐ `roomId` ஆக தேர்வு செய்கிறார் என்று வைத்துக்கொள்வோம். உங்கள் app `"general"` chat room-ஐக் காட்டுகிறது:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

UI காட்டப்பட்ட பிறகு, React உங்கள் Effect-ஐ run செய்து **synchronize செய்யத் தொடங்கும்.** அது `"general"` room-க்கு இணைக்கிறது:

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" room-க்கு connect செய்கிறது
    connection.connect();
    return () => {
      connection.disconnect(); // "general" room-இலிருந்து disconnect செய்கிறது
    };
  }, [roomId]);
  // ...
```

இதுவரை எல்லாம் சரி.

பின்னர், பயனர் dropdown-இல் வேறு room ஒன்றை தேர்வு செய்கிறார் (எடுத்துக்காட்டாக, `"travel"`). முதலில் React UI-ஐ update செய்யும்:

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

அடுத்து என்ன நடக்க வேண்டும் என்று சிந்தியுங்கள். UI-இல் `"travel"` தேர்வு செய்யப்பட்ட chat room என்று பயனர் பார்க்கிறார். ஆனால் கடைசியாக run ஆன Effect இன்னும் `"general"` room-க்கு இணைந்தே இருக்கிறது. **`roomId` prop மாறிவிட்டது; எனவே அப்போது உங்கள் Effect செய்தது (`"general"` room-க்கு இணைத்தது) இனி UI-உடன் பொருந்தாது.**

இந்த நேரத்தில், React இரண்டு விஷயங்களைச் செய்ய வேண்டும்:

1. பழைய `roomId` உடன் synchronize செய்வதை நிறுத்துதல் (`"general"` room-இலிருந்து disconnect செய்தல்)
2. புதிய `roomId` உடன் synchronize செய்யத் தொடங்குதல் (`"travel"` room-க்கு connect செய்தல்)

**அதிர்ஷ்டமாக, இந்த இரண்டையும் எப்படி செய்ய வேண்டும் என்பதை நீங்கள் ஏற்கனவே React-க்கு கற்றுக்கொடுத்துவிட்டீர்கள்!** உங்கள் Effect-ன் body synchronize செய்யத் தொடங்குவது எப்படி என்பதை குறிப்பிடுகிறது; cleanup function synchronize செய்வதை நிறுத்துவது எப்படி என்பதை குறிப்பிடுகிறது. இப்போது React செய்ய வேண்டியது, அவற்றை சரியான வரிசையில், சரியான props மற்றும் state உடன் call செய்வதுதான். அது எப்படி நடக்கிறது என்பதைப் பார்ப்போம்.

### React உங்கள் Effect-ஐ எப்படி re-synchronize செய்கிறது {/*how-react-re-synchronizes-your-effect*/}

உங்கள் `ChatRoom` component அதன் `roomId` prop-க்கு புதிய value பெற்றிருப்பதை நினைவில் கொள்ளுங்கள். அது முன்பு `"general"` ஆக இருந்தது; இப்போது `"travel"` ஆக உள்ளது. வேறு room-க்கு மீண்டும் connect செய்ய, React உங்கள் Effect-ஐ re-synchronize செய்ய வேண்டும்.

**synchronize செய்வதை நிறுத்த,** `"general"` room-க்கு connect செய்த பிறகு உங்கள் Effect return செய்த cleanup function-ஐ React call செய்யும். `roomId` `"general"` ஆக இருந்ததால், cleanup function `"general"` room-இலிருந்து disconnect செய்கிறது:

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" room-க்கு connect செய்கிறது
    connection.connect();
    return () => {
      connection.disconnect(); // "general" room-இலிருந்து disconnect செய்கிறது
    };
    // ...
```

பின்னர் இந்த render-இல் நீங்கள் வழங்கிய Effect-ஐ React run செய்யும். இந்த முறை `roomId` `"travel"` ஆக இருப்பதால், அது `"travel"` chat room-க்கு **synchronize செய்யத் தொடங்கும்** (அதன் cleanup function பின்னர் call செய்யப்படும் வரை):

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "travel" room-க்கு connect செய்கிறது
    connection.connect();
    // ...
```

இதனால், UI-இல் பயனர் தேர்வு செய்த அதே room-க்கு நீங்கள் இப்போது இணைக்கப்பட்டுள்ளீர்கள். பிரச்சினை தவிர்க்கப்பட்டது!

உங்கள் component வேறு `roomId` உடன் re-render ஆகும் ஒவ்வொரு முறையும், உங்கள் Effect re-synchronize ஆகும். எடுத்துக்காட்டாக, பயனர் `roomId`-ஐ `"travel"` இலிருந்து `"music"` ஆக மாற்றுகிறார் என்று வைத்துக்கொள்வோம். React மீண்டும் cleanup function-ஐ call செய்து உங்கள் Effect-ன் **synchronization-ஐ நிறுத்தும்** (`"travel"` room-இலிருந்து disconnect செய்யும்). பின்னர் புதிய `roomId` prop உடன் அதன் body-ஐ run செய்து மீண்டும் **synchronize செய்யத் தொடங்கும்** (`"music"` room-க்கு connect செய்யும்).

இறுதியாக, பயனர் வேறு screen-க்கு சென்றால், `ChatRoom` unmount ஆகும். இப்போது இணைந்திருப்பதற்கே தேவையில்லை. React கடைசியாக ஒருமுறை உங்கள் Effect-ன் **synchronization-ஐ நிறுத்தி**, `"music"` chat room-இலிருந்து disconnect செய்யும்.

### Effect-ன் பார்வையில் சிந்தித்தல் {/*thinking-from-the-effects-perspective*/}

`ChatRoom` component-ன் பார்வையில் நடந்த அனைத்தையும் மீண்டும் பார்க்கலாம்:

1. `roomId` `"general"` ஆக அமைந்த நிலையில் `ChatRoom` mounted ஆனது
1. `roomId` `"travel"` ஆக அமைந்த நிலையில் `ChatRoom` updated ஆனது
1. `roomId` `"music"` ஆக அமைந்த நிலையில் `ChatRoom` updated ஆனது
1. `ChatRoom` unmounted ஆனது

component-ன் lifecycle-இல் இந்த ஒவ்வொரு கட்டத்திலும், உங்கள் Effect வேறு விஷயங்களைச் செய்தது:

1. உங்கள் Effect `"general"` room-க்கு connect செய்தது
1. உங்கள் Effect `"general"` room-இலிருந்து disconnect செய்து `"travel"` room-க்கு connect செய்தது
1. உங்கள் Effect `"travel"` room-இலிருந்து disconnect செய்து `"music"` room-க்கு connect செய்தது
1. உங்கள் Effect `"music"` room-இலிருந்து disconnect செய்தது

இப்போது Effect-ன் சொந்த பார்வையில் என்ன நடந்தது என்று சிந்திப்போம்:

```js
  useEffect(() => {
    // Your Effect connected to the room specified with roomId...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...until it disconnected
      connection.disconnect();
    };
  }, [roomId]);
```

இந்த code-ன் அமைப்பு, நடந்ததை ஒருவருக்கொன்று overlap ஆகாத காலப்பகுதிகளின் sequence ஆக பார்க்கத் தூண்டலாம்:

1. உங்கள் Effect `"general"` room-க்கு connect செய்தது (disconnect ஆகும் வரை)
1. உங்கள் Effect `"travel"` room-க்கு connect செய்தது (disconnect ஆகும் வரை)
1. உங்கள் Effect `"music"` room-க்கு connect செய்தது (disconnect ஆகும் வரை)

முன்பு நீங்கள் component-ன் பார்வையில் சிந்தித்தீர்கள். அந்த பார்வையில் பார்த்தால், Effects-ஐ "render-க்கு பிறகு" அல்லது "unmount-க்கு முன்" போன்ற குறிப்பிட்ட நேரங்களில் fire ஆகும் "callbacks" அல்லது "lifecycle events" என்று நினைக்கத் தோன்றும். இந்த சிந்தனை முறை மிக விரைவாக சிக்கலாகிவிடும், எனவே அதைத் தவிர்ப்பது நல்லது.

**அதற்கு பதிலாக, ஒவ்வொரு முறையும் ஒரு start/stop cycle-ஐ மட்டுமே கவனியுங்கள். component mount ஆகிறதா, update ஆகிறதா, அல்லது unmount ஆகிறதா என்பது முக்கியமல்ல. synchronization-ஐ எப்படி தொடங்குவது, எப்படி நிறுத்துவது என்பதை விவரிப்பதே உங்கள் பணி. அதைச் சரியாக செய்தால், உங்கள் Effect தேவையான அளவு பல முறை தொடங்கப்பட்டாலும் நிறுத்தப்பட்டாலும் உறுதியாக இயங்கும்.**

JSX-ஐ உருவாக்கும் rendering logic-ஐ எழுதும்போது component mount ஆகிறதா update ஆகிறதா என்று நீங்கள் சிந்திப்பதில்லை என்பதை இது நினைவூட்டலாம். screen-இல் என்ன இருக்க வேண்டும் என்பதை நீங்கள் விவரிக்கிறீர்கள்; மீதியை React [தானாகத் தீர்மானிக்கிறது.](/learn/reacting-to-input-with-state)

### உங்கள் Effect re-synchronize செய்ய முடியும் என்பதை React எப்படி சரிபார்க்கிறது {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

நீங்கள் முயற்சிக்கக்கூடிய live எடுத்துக்காட்டு இதோ. `ChatRoom` component-ஐ mount செய்ய "Chat-ஐ திற" அழுத்துங்கள்:

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
  const [show, setShow] = useState(false);
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

component முதல் முறையாக mount ஆகும்போது, மூன்று logs தெரிகின்றன என்பதை கவனியுங்கள்:

1. `✅ "general" room-க்கு https://localhost:1234-இல் இணைக்கிறது...` *(development-only)*
1. `❌ "general" room-இலிருந்து துண்டிக்கப்பட்டது: https://localhost:1234.` *(development-only)*
1. `✅ "general" room-க்கு https://localhost:1234-இல் இணைக்கிறது...`

முதல் இரண்டு logs development-இல் மட்டும் வரும். development-இல், React ஒவ்வொரு component-யையும் ஒரு முறை கூடுதலாக remount செய்கிறது.

**development-இல் உடனடியாக re-synchronize செய்ய வைத்து, உங்கள் Effect அதைச் செய்ய முடியும் என்பதை React சரிபார்க்கிறது.** கதவு பூட்டு வேலை செய்கிறதா என்று பார்க்க கதவை ஒரு முறை கூடுதலாகத் திறந்து மூடுவது போல இதை நினைக்கலாம். [cleanup-ஐ நன்றாக implement செய்துள்ளீர்களா](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) என்று பார்க்க, React development-இல் உங்கள் Effect-ஐ ஒரு முறை கூடுதலாகத் தொடங்கி நிறுத்துகிறது.

நடைமுறையில், உங்கள் Effect பயன்படுத்தும் சில data மாறினால் தான் அது பெரும்பாலும் re-synchronize ஆகும். மேலுள்ள sandbox-இல் தேர்ந்தெடுத்த chat room-ஐ மாற்றுங்கள். `roomId` மாறும்போது உங்கள் Effect re-synchronize ஆகிறது என்பதை கவனியுங்கள்.

ஆனால் re-synchronization தேவையான இன்னும் சில அரிதான சூழல்களும் உள்ளன. எடுத்துக்காட்டாக, chat திறந்திருக்கும் போது மேலுள்ள sandbox-இல் `serverUrl`-ஐ edit செய்து பாருங்கள். code-இல் நீங்கள் செய்யும் edits-க்கு பதிலாக Effect re-synchronize ஆகிறது என்பதை கவனியுங்கள். எதிர்காலத்தில், re-synchronization-ஐ நம்பும் மேலும் பல features-ஐ React சேர்க்கலாம்.

### Effect-ஐ re-synchronize செய்ய வேண்டும் என்பதை React எப்படி அறிகிறது {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

`roomId` மாறிய பிறகு உங்கள் Effect re-synchronize ஆக வேண்டும் என்பதை React எப்படி அறிந்தது என்று நீங்கள் நினைக்கலாம். அதன் code `roomId`-ஐ சார்ந்துள்ளது என்று நீங்கள் [dependencies பட்டியலில்](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies) சேர்த்து *React-க்கு சொன்னதால்* தான்:

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId prop காலப்போக்கில் மாறலாம்
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // இந்த Effect roomId-ஐ வாசிக்கிறது
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // இந்த Effect roomId-ஐ "depends on" செய்கிறது என்று React-க்கு சொல்கிறீர்கள்
  // ...
```

இது எப்படி வேலை செய்கிறது:

1. `roomId` ஒரு prop என்று உங்களுக்கு தெரியும்; அதாவது அது காலப்போக்கில் மாறலாம்.
2. உங்கள் Effect `roomId`-ஐ வாசிக்கிறது என்று உங்களுக்கு தெரியும் (அதனால் அதன் logic, பின்னர் மாறக்கூடிய value ஒன்றைச் சார்ந்துள்ளது).
3. அதனால் தான் அதை உங்கள் Effect-ன் dependency ஆக குறிப்பிட்டீர்கள் (`roomId` மாறும்போது re-synchronize ஆக).

உங்கள் component re-render ஆன ஒவ்வொரு முறையும், நீங்கள் pass செய்த dependencies array-ஐ React பார்க்கும். array-இல் உள்ள ஏதாவது value, முந்தைய render-இல் அதே இடத்தில் pass செய்த value-இலிருந்து வேறுபட்டிருந்தால், React உங்கள் Effect-ஐ re-synchronize செய்யும்.

எடுத்துக்காட்டாக, initial render-இல் `["general"]` pass செய்து, அடுத்த render-இல் `["travel"]` pass செய்தால், React `"general"` மற்றும் `"travel"`-ஐ compare செய்யும். இவை வேறு values ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) மூலம் compare செய்யப்படும்), எனவே React உங்கள் Effect-ஐ re-synchronize செய்யும். மறுபுறம், உங்கள் component re-render ஆனாலும் `roomId` மாறவில்லை என்றால், உங்கள் Effect அதே room-க்கு இணைந்தே இருக்கும்.

### ஒவ்வொரு Effect-மும் தனி synchronization process-ஐ குறிக்கிறது {/*each-effect-represents-a-separate-synchronization-process*/}

நீங்கள் ஏற்கனவே எழுதிய Effect உடன் அதே நேரத்தில் இந்த logic run ஆக வேண்டும் என்பதற்காக மட்டுமே தொடர்பில்லாத logic-ஐ உங்கள் Effect-க்கு சேர்க்க வேண்டாம். எடுத்துக்காட்டாக, பயனர் room-ஐ visit செய்யும்போது analytics event ஒன்றை அனுப்ப விரும்புகிறீர்கள் என்று வைத்துக்கொள்வோம். `roomId`-ஐ சார்ந்த Effect ஒன்று ஏற்கனவே உங்களிடம் உள்ளது; எனவே analytics call-ஐ அதிலேயே சேர்க்க விருப்பம் வரலாம்:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

ஆனால் பின்னர் connection-ஐ மீண்டும் establish செய்ய வேண்டிய இன்னொரு dependency-ஐ இந்த Effect-க்கு சேர்ப்பதாக கற்பனை செய்யுங்கள். இந்த Effect re-synchronize ஆனால், அதே room-க்காக `logVisit(roomId)`-ஐயும் call செய்யும்; அது நீங்கள் நினைத்தது அல்ல. visit-ஐ log செய்வது, connect செய்வதிலிருந்து **தனி process**. அவற்றை இரண்டு தனி Effects ஆக எழுதுங்கள்:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**உங்கள் code-இல் உள்ள ஒவ்வொரு Effect-மும் தனித்துவமான, சுயாதீனமான synchronization process-ஐ குறிக்க வேண்டும்.**

மேலுள்ள எடுத்துக்காட்டில், ஒரு Effect-ஐ நீக்கினாலும் மற்ற Effect-ன் logic உடையாது. அவை வேறு விஷயங்களை synchronize செய்கின்றன என்பதற்கான நல்ல சான்று இது; எனவே அவற்றை பிரிப்பது பொருத்தமானது. மறுபுறம், ஒன்றாக இருக்க வேண்டிய logic பகுதியை தனித்தனி Effects ஆக பிரித்தால், code "cleaner" போலத் தோன்றலாம்; ஆனால் அதை [maintain செய்வது கடினமாகும்.](/learn/you-might-not-need-an-effect#chains-of-computations) அதனால் code cleaner ஆகத் தோன்றுகிறதா என்பதை அல்ல, processes ஒன்றா அல்லது தனித்தனியா என்பதை சிந்திக்க வேண்டும்.

## Effects reactive values-க்கு "react" செய்கின்றன {/*effects-react-to-reactive-values*/}

உங்கள் Effect இரண்டு variables-ஐ (`serverUrl` மற்றும் `roomId`) வாசிக்கிறது, ஆனால் நீங்கள் `roomId`-ஐ மட்டுமே dependency ஆக குறிப்பிட்டுள்ளீர்கள்:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

`serverUrl` ஏன் dependency ஆக இருக்க வேண்டியதில்லை?

இதற்குக் காரணம், re-render காரணமாக `serverUrl` ஒருபோதும் மாறாது. component எத்தனை முறை, எந்த காரணத்தால் re-render ஆனாலும் அது எப்போதும் அதே value தான். `serverUrl` மாறாததால், அதை dependency ஆக குறிப்பிடுவது அர்த்தமில்லை. dependencies காலப்போக்கில் மாறும்போது தான் ஏதாவது செய்கின்றன!

மறுபுறம், re-render-இல் `roomId` வேறுபடலாம். **Props, state, மற்றும் component-க்குள் declare செய்யப்பட்ட பிற values _reactive_; ஏனெனில் அவை rendering நடக்கும் போது கணக்கிடப்படுகின்றன, மேலும் React data flow-வில் பங்கேற்கின்றன.**

`serverUrl` ஒரு state variable ஆக இருந்தால், அது reactive ஆக இருக்கும். Reactive values dependencies-இல் சேர்க்கப்பட வேண்டும்:

```js {2,5,10}
function ChatRoom({ roomId }) { // Props காலப்போக்கில் மாறும்
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State காலப்போக்கில் மாறலாம்

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // உங்கள் Effect props மற்றும் state-ஐ வாசிக்கிறது
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // இந்த Effect props மற்றும் state-ஐ "depends on" செய்கிறது என்று React-க்கு சொல்கிறீர்கள்
  // ...
}
```

`serverUrl`-ஐ dependency ஆக சேர்ப்பதன் மூலம், அது மாறிய பிறகு Effect re-synchronize ஆகும் என்பதை உறுதி செய்கிறீர்கள்.

இந்த sandbox-இல் தேர்ந்தெடுத்த chat room-ஐ மாற்றிப் பாருங்கள் அல்லது server URL-ஐ edit செய்து பாருங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
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

`roomId` அல்லது `serverUrl` போன்ற reactive value-ஐ மாற்றும் போதெல்லாம், Effect chat server-க்கு மீண்டும் connect செய்கிறது.

### காலியான dependencies உடைய Effect என்ன பொருள் தருகிறது {/*what-an-effect-with-empty-dependencies-means*/}

`serverUrl` மற்றும் `roomId` இரண்டையும் component-க்கு வெளியே நகர்த்தினால் என்ன நடக்கும்?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

இப்போது உங்கள் Effect-ன் code *எந்த* reactive values-யையும் பயன்படுத்தவில்லை; எனவே அதன் dependencies காலியாக (`[]`) இருக்கலாம்.

component-ன் பார்வையில் சிந்தித்தால், காலியான `[]` dependency array என்பது இந்த Effect component mount ஆகும் போது மட்டும் chat room-க்கு connect செய்து, component unmount ஆகும் போது மட்டும் disconnect செய்யும் என்பதாகும். (உங்கள் logic-ஐ stress-test செய்ய development-இல் React இதை இன்னும் [ஒரு முறை கூடுதலாக re-synchronize செய்யும்](#how-react-verifies-that-your-effect-can-re-synchronize) என்பதை நினைவில் கொள்ளுங்கள்.)


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

ஆனால் நீங்கள் [Effect-ன் பார்வையில் சிந்தித்தால்,](#thinking-from-the-effects-perspective) mounting மற்றும் unmounting பற்றி சிந்திக்கவே தேவையில்லை. முக்கியமானது, synchronize செய்யத் தொடங்கவும் நிறுத்தவும் உங்கள் Effect என்ன செய்கிறது என்பதை நீங்கள் குறிப்பிட்டுள்ளீர்கள் என்பதுதான். இப்போது அதற்கு reactive dependencies இல்லை. ஆனால் ஒருநாள் பயனர் `roomId` அல்லது `serverUrl`-ஐ காலப்போக்கில் மாற்ற வேண்டும் என்று விரும்பினால் (அவை reactive ஆகிவிடும்), உங்கள் Effect-ன் code மாறாது. அவற்றை dependencies-க்கு சேர்ப்பதே போதும்.

### component body-இல் declare செய்யப்படும் அனைத்து variables-ும் reactive {/*all-variables-declared-in-the-component-body-are-reactive*/}

Props மற்றும் state மட்டும் reactive values அல்ல. அவற்றிலிருந்து நீங்கள் கணக்கிடும் values-யும் reactive. props அல்லது state மாறினால், உங்கள் component re-render ஆகும்; அவற்றிலிருந்து கணக்கிடப்பட்ட values-யும் மாறும். அதனால் Effect பயன்படுத்தும் component body-யிலுள்ள அனைத்து variables-ும் Effect dependency list-இல் இருக்க வேண்டும்.

பயனர் dropdown-இல் chat server ஒன்றை தேர்வு செய்யலாம்; ஆனால் settings-இல் default server-ஐயும் configure செய்யலாம் என்று வைத்துக்கொள்வோம். settings state-ஐ நீங்கள் ஏற்கனவே [context](/learn/scaling-up-with-reducer-and-context)-இல் வைத்துள்ளீர்கள், எனவே அந்த context-இலிருந்து `settings`-ஐ வாசிக்கிறீர்கள். இப்போது props-இலிருந்து வரும் selected server மற்றும் default server அடிப்படையில் `serverUrl`-ஐ கணக்கிடுகிறீர்கள்:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId reactive
  const settings = useContext(SettingsContext); // settings reactive
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // உங்கள் Effect roomId மற்றும் serverUrl-ஐ வாசிக்கிறது
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // இவற்றில் ஏதேனும் மாறும்போது re-synchronize ஆக வேண்டும்!
  // ...
}
```

இந்த எடுத்துக்காட்டில், `serverUrl` ஒரு prop அல்லது state variable அல்ல. rendering நடக்கும் போது நீங்கள் கணக்கிடும் சாதாரண variable அது. ஆனால் rendering நடக்கும் போது கணக்கிடப்படுவதால், re-render காரணமாக அது மாறலாம். அதனால் அது reactive.

**component-க்குள் உள்ள அனைத்து values-யும் (props, state, மற்றும் component body-யிலுள்ள variables உட்பட) reactive. எந்த reactive value-யும் re-render-இல் மாறலாம், எனவே reactive values-ஐ Effect-ன் dependencies ஆக சேர்க்க வேண்டும்.**

மற்ற வார்த்தைகளில் சொன்னால், component body-யிலிருந்து வரும் அனைத்து values-க்கும் Effects "react" செய்கின்றன.

<DeepDive>

#### global அல்லது mutable values dependencies ஆக இருக்க முடியுமா? {/*can-global-or-mutable-values-be-dependencies*/}

Mutable values (global variables உட்பட) reactive அல்ல.

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) போன்ற mutable value dependency ஆக இருக்க முடியாது.** அது mutable, எனவே React rendering data flow-க்கு வெளியே எந்த நேரத்திலும் மாறலாம். அது மாறுவது உங்கள் component-ன் re-render-ஐ trigger செய்யாது. ஆகவே dependencies-இல் அதை குறிப்பிட்டாலும், அது மாறும் போது Effect-ஐ re-synchronize செய்ய வேண்டும் என்பதை React *அறியாது*. மேலும் rendering நடக்கும் போது mutable data-ஐ வாசிப்பது (dependencies-ஐ கணக்கிடும் நேரம் அதுவே) [rendering-ன் purity](/learn/keeping-components-pure)-ஐ உடைக்கும்; எனவே இது React விதிகளையும் உடைக்கும். அதற்கு பதிலாக, [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) மூலம் external mutable value ஒன்றை வாசித்து subscribe செய்ய வேண்டும்.

**[`ref.current`](/reference/react/useRef#reference) போன்ற mutable value அல்லது அதிலிருந்து நீங்கள் வாசிக்கும் விஷயங்களும் dependency ஆக இருக்க முடியாது.** `useRef` return செய்யும் ref object தானே dependency ஆக இருக்கலாம்; ஆனால் அதன் `current` property திட்டமிட்டே mutable ஆக உள்ளது. அது [re-render trigger செய்யாமல் ஏதாவது ஒன்றை track செய்ய](/learn/referencing-values-with-refs) உதவுகிறது. ஆனால் அது மாறுவது re-render trigger செய்யாததால், அது reactive value அல்ல; அது மாறும் போது உங்கள் Effect-ஐ மீண்டும் run செய்ய வேண்டும் என்பதை React அறியாது.

இந்த page-இல் கீழே நீங்கள் காண்பதுபோல், இந்த பிரச்சினைகளை linter தானாகச் சரிபார்க்கும்.

</DeepDive>

### ஒவ்வொரு reactive value-யையும் dependency ஆக குறிப்பிட்டுள்ளீர்களா என்பதை React சரிபார்க்கிறது {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

உங்கள் linter [React-க்காக configure செய்யப்பட்டிருந்தால்,](/learn/editor-setup#linting) உங்கள் Effect-ன் code பயன்படுத்தும் ஒவ்வொரு reactive value-யும் அதன் dependency ஆக declare செய்யப்பட்டுள்ளதா என்று அது பார்க்கும். எடுத்துக்காட்டாக, `roomId` மற்றும் `serverUrl` இரண்டும் reactive என்பதால் இது ஒரு lint error:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- இங்கே ஏதோ தவறு உள்ளது!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
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

இது React error போலத் தோன்றலாம்; ஆனால் உண்மையில் React உங்கள் code-இல் உள்ள bug-ஐச் சுட்டிக்காட்டுகிறது. `roomId` மற்றும் `serverUrl` இரண்டும் காலப்போக்கில் மாறலாம்; ஆனால் அவை மாறும்போது உங்கள் Effect-ஐ re-synchronize செய்ய நீங்கள் மறந்துவிட்டீர்கள். UI-இல் பயனர் வேறு values தேர்வு செய்த பிறகும், நீங்கள் initial `roomId` மற்றும் `serverUrl`-க்கே இணைந்திருப்பீர்கள்.

bug-ஐ சரிசெய்ய, `roomId` மற்றும் `serverUrl`-ஐ உங்கள் Effect-ன் dependencies ஆக குறிப்பிடும் linter-ன் பரிந்துரையைப் பின்பற்றுங்கள்:

```js {9}
function ChatRoom({ roomId }) { // roomId reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

மேலுள்ள sandbox-இல் இந்த fix-ஐ முயற்சி செய்யுங்கள். linter error மறைந்துவிட்டதா, chat தேவையான போது reconnect ஆகிறதா என்று சரிபாருங்கள்.

<Note>

சில சமயங்களில், component-க்குள் declare செய்யப்பட்டிருந்தாலும் ஒரு value ஒருபோதும் மாறாது என்பதை React *அறியும்*. எடுத்துக்காட்டாக, `useState` return செய்யும் [`set` function](/reference/react/useState#setstate) மற்றும் [`useRef`](/reference/react/useRef) return செய்யும் ref object ஆகியவை *stable*; re-render-இல் அவை மாறாது என்பதில் உத்தரவாதம் உள்ளது. Stable values reactive அல்ல, எனவே அவற்றை list-இல் இருந்து விடலாம். அவற்றை சேர்ப்பதும் அனுமதிக்கப்படுகிறது: அவை மாறாது, எனவே பிரச்சினையில்லை.

</Note>

### re-synchronize செய்ய வேண்டாம் என்று நினைக்கும் போது என்ன செய்யலாம் {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

முந்தைய எடுத்துக்காட்டில், `roomId` மற்றும் `serverUrl`-ஐ dependencies ஆக பட்டியலிட்டு lint error-ஐ நீங்கள் சரிசெய்தீர்கள்.

**ஆனால் இதற்குப் பதிலாக, இந்த values reactive values அல்ல என்பதை linter-க்கு "நிரூபிக்க" முடியும்,** அதாவது re-render காரணமாக அவை *மாற முடியாது* என்பதை காட்டலாம். எடுத்துக்காட்டாக, `serverUrl` மற்றும் `roomId` rendering-ஐ சார்ந்து இல்லாமல் எப்போதும் அதே values ஆக இருந்தால், அவற்றை component-க்கு வெளியே நகர்த்தலாம். இப்போது அவை dependencies ஆக இருக்க வேண்டியதில்லை:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl reactive அல்ல
const roomId = 'general'; // roomId reactive அல்ல

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

அவற்றை *Effect-க்குள்* கூட நகர்த்தலாம். அவை rendering நடக்கும் போது கணக்கிடப்படவில்லை, எனவே reactive அல்ல:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl reactive அல்ல
    const roomId = 'general'; // roomId reactive அல்ல
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ அனைத்து dependencies-யும் declare செய்யப்பட்டுள்ளன
  // ...
}
```

**Effects என்பது code-இன் reactive blocks.** அவற்றுக்குள் நீங்கள் வாசிக்கும் values மாறும்போது அவை re-synchronize ஆகும். ஒவ்வொரு interaction-க்கும் ஒருமுறை மட்டும் run ஆகும் event handlers-களைப் போல அல்லாமல், synchronization தேவையான போதெல்லாம் Effects run ஆகும்.

**உங்கள் dependencies-ஐ நீங்கள் "தேர்வு" செய்ய முடியாது.** Effect-இல் நீங்கள் வாசிக்கும் ஒவ்வொரு [reactive value](#all-variables-declared-in-the-component-body-are-reactive)-யும் உங்கள் dependencies-இல் இருக்க வேண்டும். linter இதை enforce செய்கிறது. சில நேரங்களில் இது infinite loops போன்ற பிரச்சினைகளுக்கும், உங்கள் Effect மிக அடிக்கடி re-synchronize ஆகுவதற்கும் வழிவகுக்கலாம். இந்த பிரச்சினைகளை linter-ஐ suppress செய்து சரிசெய்யாதீர்கள்! அதற்கு பதிலாக முயற்சிக்க வேண்டியது:

* **உங்கள் Effect ஒரு independent synchronization process-ஐ குறிக்கிறதா என்று சரிபாருங்கள்.** உங்கள் Effect எதையும் synchronize செய்யவில்லை என்றால், [அது தேவையற்றதாக இருக்கலாம்.](/learn/you-might-not-need-an-effect) அது பல independent விஷயங்களை synchronize செய்தால், [அதைப் பிரியுங்கள்.](#each-effect-represents-a-separate-synchronization-process)

* **props அல்லது state-ன் சமீபத்திய value-ஐ அதற்கு "react" செய்யாமலும் Effect-ஐ re-synchronize செய்யாமலும் வாசிக்க விரும்பினால்,** உங்கள் Effect-ஐ reactive பகுதி (Effect-இல் வைத்திருப்பீர்கள்) மற்றும் non-reactive பகுதி (_Effect Event_ என்று அழைக்கப்படும் ஒன்றாக extract செய்வீர்கள்) எனப் பிரிக்கலாம். [Events-ஐ Effects-இலிருந்து பிரிப்பது பற்றி படிக்கவும்.](/learn/separating-events-from-effects)

* **objects மற்றும் functions-ஐ dependencies ஆக நம்புவதைத் தவிர்க்கவும்.** rendering நடக்கும் போது objects மற்றும் functions உருவாக்கி, பின்னர் அவற்றை Effect-இலிருந்து வாசித்தால், அவை ஒவ்வொரு render-இலும் வேறுபடும். இதனால் உங்கள் Effect ஒவ்வொரு முறையும் re-synchronize ஆகும். [Effects-இலிருந்து தேவையற்ற dependencies-ஐ அகற்றுவது பற்றி மேலும் படிக்கவும்.](/learn/removing-effect-dependencies)

<Pitfall>

linter உங்கள் நண்பன், ஆனால் அதன் சக்திக்கு வரம்புகள் உள்ளன. dependencies *தவறாக* உள்ளபோது மட்டுமே linter அறியும். ஒவ்வொரு நிலைக்கும் *சிறந்த* தீர்வு என்ன என்பதை அது அறியாது. linter dependency ஒன்றை பரிந்துரைக்கிறது; ஆனால் அதைச் சேர்ப்பது loop-ஐ உருவாக்குகிறது என்றால், linter-ஐ புறக்கணிக்க வேண்டும் என்பதல்ல. அந்த value reactive ஆக இல்லாமல், dependency ஆக *தேவைப்படாத* வகையில் Effect-க்குள் (அல்லது வெளியே) உள்ள code-ஐ மாற்ற வேண்டும்.

உங்களிடம் ஏற்கனவே உள்ள codebase இருந்தால், linter-ஐ இப்படி suppress செய்யும் சில Effects இருக்கலாம்:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[அடுத்த](/learn/separating-events-from-effects) [pages](/learn/removing-effect-dependencies)-இல், விதிகளை மீறாமல் இந்த code-ஐ எப்படி சரிசெய்வது என்பதை நீங்கள் கற்பீர்கள். இதை சரிசெய்வது எப்போதும் மதிப்புடையது!

</Pitfall>

<Recap>

- Components mount, update, மற்றும் unmount ஆகலாம்.
- ஒவ்வொரு Effect-க்கும், அதைச் சுற்றியுள்ள component-இலிருந்து தனி lifecycle உள்ளது.
- ஒவ்வொரு Effect-மும் *தொடங்கி* *நிறுத்தக்கூடிய* தனி synchronization process-ஐ விவரிக்கிறது.
- Effects-ஐ எழுதும் மற்றும் வாசிக்கும் போது, component-ன் பார்வையை (அது எப்படி mount/update/unmount ஆகிறது) விட ஒவ்வொரு தனி Effect-ன் பார்வையில் (synchronization-ஐ எப்படி தொடங்குவது, நிறுத்துவது) சிந்தியுங்கள்.
- component body-க்குள் declare செய்யப்படும் values "reactive".
- Reactive values காலப்போக்கில் மாறக்கூடியவை; எனவே அவை Effect-ஐ re-synchronize செய்ய வேண்டும்.
- Effect-க்குள் பயன்படுத்தப்படும் அனைத்து reactive values-யும் dependencies ஆக குறிப்பிடப்பட்டுள்ளனவா என்பதை linter சரிபார்க்கிறது.
- linter flag செய்யும் அனைத்து errors-மும் உண்மையானவை. விதிகளை மீறாமல் code-ஐ சரிசெய்ய எப்போதும் ஒரு வழி இருக்கும்.

</Recap>

<Challenges>

#### ஒவ்வொரு keystroke-க்கும் reconnect ஆகுவதை சரிசெய்யுங்கள் {/*fix-reconnecting-on-every-keystroke*/}

இந்த எடுத்துக்காட்டில், component mount ஆகும் போது `ChatRoom` component chat room-க்கு connect செய்கிறது, unmount ஆகும் போது disconnect செய்கிறது, வேறு chat room-ஐ தேர்வு செய்யும் போது reconnect செய்கிறது. இந்த behavior சரியானது, எனவே அது தொடர்ந்து இயங்க வேண்டும்.

ஆனால் ஒரு பிரச்சினை உள்ளது. கீழே உள்ள message box input-இல் நீங்கள் type செய்யும் போதெல்லாம், `ChatRoom` *மேலும்* chat-க்கு reconnect செய்கிறது. (console-ஐ clear செய்து input-இல் type செய்தால் இதைக் கவனிக்கலாம்.) இது நடக்காதபடி பிரச்சினையை சரிசெய்யுங்கள்.

<Hint>

இந்த Effect-க்கு dependency array ஒன்றைச் சேர்க்க வேண்டியிருக்கலாம். எந்த dependencies இருக்க வேண்டும்?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

இந்த Effect-க்கு dependency array எதுவும் இல்லை, எனவே ஒவ்வொரு re-render-க்கும் பிறகும் அது re-synchronize ஆனது. முதலில் dependency array ஒன்றைச் சேர்க்கவும். பின்னர் Effect பயன்படுத்தும் ஒவ்வொரு reactive value-யும் array-இல் குறிப்பிடப்பட்டுள்ளதா என்பதை உறுதி செய்யவும். எடுத்துக்காட்டாக, `roomId` reactive (ஏனெனில் அது prop), எனவே அது array-இல் சேர்க்கப்பட வேண்டும். இதனால் பயனர் வேறு room-ஐ தேர்வு செய்யும் போது chat reconnect ஆகும். மறுபுறம், `serverUrl` component-க்கு வெளியே define செய்யப்பட்டுள்ளது. அதனால் அது array-இல் இருக்க வேண்டியதில்லை.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### synchronization-ஐ on மற்றும் off செய்யுங்கள் {/*switch-synchronization-on-and-off*/}

இந்த எடுத்துக்காட்டில், screen-இல் pink dot-ஐ நகர்த்த ஒரு Effect window [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) event-க்கு subscribe செய்கிறது. preview area மீது hover செய்து பாருங்கள் (அல்லது mobile device-இல் இருந்தால் screen-ஐ தொடுங்கள்), pink dot உங்கள் இயக்கத்தை எப்படி பின்தொடர்கிறது என்பதைப் பாருங்கள்.

ஒரு checkbox-யும் உள்ளது. checkbox-ஐ tick செய்வது `canMove` state variable-ஐ toggle செய்கிறது, ஆனால் இந்த state variable code-இல் எங்கும் பயன்படுத்தப்படவில்லை. `canMove` `false` ஆக இருக்கும் போது (checkbox tick செய்யப்படாத போது), dot நகர்வதை நிறுத்தும் வகையில் code-ஐ மாற்றுவது உங்கள் பணி. checkbox-ஐ மீண்டும் on செய்து (`canMove`-ஐ `true` ஆக அமைத்து) விட்டால், dot மீண்டும் movement-ஐ பின்தொடர வேண்டும். மற்ற வார்த்தைகளில், dot நகர முடியுமா முடியாதா என்பது checkbox checked ஆக உள்ளதா என்பதுடன் synchronized ஆக இருக்க வேண்டும்.

<Hint>

Effect ஒன்றை conditionally declare செய்ய முடியாது. ஆனால் Effect-க்குள் உள்ள code conditions-ஐப் பயன்படுத்தலாம்!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        dot நகர அனுமதிக்கப்படுகிறது
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

<Solution>

ஒரு தீர்வு, `setPosition` call-ஐ `if (canMove) { ... }` condition-க்குள் wrap செய்வது:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        dot நகர அனுமதிக்கப்படுகிறது
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

மாற்றாக, *event subscription* logic-ஐ `if (canMove) { ... }` condition-க்குள் wrap செய்யலாம்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        dot நகர அனுமதிக்கப்படுகிறது
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

இந்த இரு நிலைகளிலும், `canMove` என்பது Effect-க்குள் நீங்கள் வாசிக்கும் reactive variable. அதனால் அது Effect dependencies பட்டியலில் குறிப்பிடப்பட வேண்டும். இதனால் அதன் value மாறும் ஒவ்வொரு முறையும் Effect re-synchronize ஆகும்.

</Solution>

#### stale value bug ஒன்றை ஆராயுங்கள் {/*investigate-a-stale-value-bug*/}

இந்த எடுத்துக்காட்டில், checkbox on ஆக இருக்கும் போது pink dot நகர வேண்டும்; checkbox off ஆக இருக்கும் போது நகர்வதை நிறுத்த வேண்டும். இதற்கான logic ஏற்கனவே implement செய்யப்பட்டுள்ளது: `handleMove` event handler `canMove` state variable-ஐ சரிபார்க்கிறது.

ஆனால் ஏதோ காரணத்தால், `handleMove`-க்குள் உள்ள `canMove` state variable "stale" போலத் தெரிகிறது: checkbox-ஐ off செய்த பிறகும் அது எப்போதும் `true` ஆகவே உள்ளது. இது எப்படி சாத்தியம்? code-இல் உள்ள தவறை கண்டுபிடித்து சரிசெய்யுங்கள்.

<Hint>

linter rule suppress செய்யப்பட்டிருப்பதை பார்த்தால், அந்த suppression-ஐ அகற்றுங்கள்! தவறுகள் பொதுவாக அங்கேதான் இருக்கும்.

</Hint>

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
        dot நகர அனுமதிக்கப்படுகிறது
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

<Solution>

அசல் code-இல் இருந்த பிரச்சினை dependency linter-ஐ suppress செய்ததுதான். suppression-ஐ அகற்றினால், இந்த Effect `handleMove` function-ஐ சார்ந்துள்ளது என்பதைப் பார்ப்பீர்கள். இது பொருத்தமானது: `handleMove` component body-க்குள் declare செய்யப்பட்டுள்ளது, எனவே அது reactive value ஆகிறது. ஒவ்வொரு reactive value-யும் dependency ஆக குறிப்பிடப்பட வேண்டும்; இல்லையெனில் அது காலப்போக்கில் stale ஆகலாம்!

அசல் code-ன் ஆசிரியர், Effect எந்த reactive values-யையும் சார்ந்ததல்ல (`[]`) என்று React-க்கு "பொய்" சொன்னுள்ளார். அதனால் தான் `canMove` மாறிய பிறகும் (அதனுடன் `handleMove` மாறிய பிறகும்) React Effect-ஐ re-synchronize செய்யவில்லை. React Effect-ஐ re-synchronize செய்யாததால், listener ஆக attached ஆன `handleMove` initial render-இல் உருவாக்கப்பட்ட `handleMove` function ஆகும். initial render-இல் `canMove` `true` ஆக இருந்ததால், initial render-இலிருந்து வந்த `handleMove` அந்த value-ஐ என்றும் பார்க்கும்.

**நீங்கள் linter-ஐ ஒருபோதும் suppress செய்யவில்லை என்றால், stale values தொடர்பான பிரச்சினைகளை ஒருபோதும் காணமாட்டீர்கள்.** இந்த bug-ஐ தீர்க்க சில வேறு வழிகள் உள்ளன, ஆனால் linter suppression-ஐ அகற்றுவதிலிருந்து எப்போதும் தொடங்க வேண்டும். பின்னர் lint error-ஐ சரிசெய்ய code-ஐ மாற்றுங்கள்.

Effect dependencies-ஐ `[handleMove]` ஆக மாற்றலாம்; ஆனால் அது ஒவ்வொரு render-க்கும் புதிதாக defined function ஆக இருப்பதால், dependency array-ஐ முற்றிலும் அகற்றலாம். அப்போது Effect ஒவ்வொரு re-render-க்கும் பிறகு *re-synchronize ஆகும்*:

<Sandpack>

```js
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
  });

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        dot நகர அனுமதிக்கப்படுகிறது
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

இந்த solution வேலை செய்கிறது, ஆனால் அது சிறந்ததல்ல. Effect-க்குள் `console.log('Resubscribing')` வைத்தால், ஒவ்வொரு re-render-க்கும் பிறகு அது resubscribe ஆகிறது என்பதை கவனிப்பீர்கள். Resubscribe செய்வது வேகமானது, ஆனால் அதை இவ்வளவு அடிக்கடி தவிர்ப்பது நன்றாக இருக்கும்.

சிறந்த fix என்பது `handleMove` function-ஐ Effect-க்குள் நகர்த்துவது. அப்போது `handleMove` reactive value ஆக இருக்காது, எனவே உங்கள் Effect function ஒன்றை சார்ந்திருக்காது. அதற்கு பதிலாக, உங்கள் code இப்போது Effect-க்குள் வாசிக்கும் `canMove`-ஐ சார்ந்திருக்க வேண்டும். இது நீங்கள் விரும்பிய behavior-க்கு பொருந்துகிறது, ஏனெனில் உங்கள் Effect இப்போது `canMove` value உடன் synchronized ஆக இருக்கும்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        dot நகர அனுமதிக்கப்படுகிறது
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

Effect body-க்குள் `console.log('Resubscribing')` சேர்த்து பாருங்கள்; இப்போது checkbox-ஐ toggle செய்யும் போது (`canMove` மாறும் போது) அல்லது code-ஐ edit செய்யும் போது மட்டும் அது resubscribe ஆகிறது என்பதை கவனியுங்கள். இது எப்போதும் resubscribe செய்த முந்தைய அணுகுமுறையை விட சிறந்தது.

இந்த வகை பிரச்சினைக்கு மேலும் பொதுவான அணுகுமுறையை [Events-ஐ Effects-இலிருந்து பிரித்தல்](/learn/separating-events-from-effects) பகுதியில் கற்பீர்கள்.

</Solution>

#### connection switch ஒன்றை சரிசெய்யுங்கள் {/*fix-a-connection-switch*/}

இந்த எடுத்துக்காட்டில், `chat.js`-இல் உள்ள chat service இரண்டு வேறு APIs-ஐ expose செய்கிறது: `createEncryptedConnection` மற்றும் `createUnencryptedConnection`. root `App` component, encryption பயன்படுத்த வேண்டுமா வேண்டாமா என்பதை பயனர் தேர்வு செய்ய அனுமதிக்கிறது; பின்னர் அதற்கு பொருந்தும் API method-ஐ child `ChatRoom` component-க்கு `createConnection` prop ஆக pass செய்கிறது.

ஆரம்பத்தில் console logs connection encrypted அல்ல என்று சொல்கின்றன என்பதை கவனியுங்கள். checkbox-ஐ on செய்து பாருங்கள்: எதுவும் நடக்காது. ஆனால் அதன் பிறகு தேர்ந்தெடுத்த room-ஐ மாற்றினால், chat reconnect ஆகி *மேலும்* encryption enable ஆகும் (console messages-இல் காண்பீர்கள்). இது ஒரு bug. checkbox-ஐ toggle செய்வதும் chat reconnect ஆகக் காரணமாகும் வகையில் bug-ஐ சரிசெய்யுங்கள்.

<Hint>

linter-ஐ suppress செய்வது எப்போதும் சந்தேகத்திற்குரியது. இது bug ஆக இருக்க முடியுமா?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        encryption-ஐ இயக்கு
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [8]}} src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '" room-க்கு இணைக்கிறது... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு இணைக்கிறது... (unencrypted)');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

linter suppression-ஐ அகற்றினால், lint error ஒன்றைப் பார்ப்பீர்கள். பிரச்சினை என்னவெனில் `createConnection` ஒரு prop; எனவே அது reactive value. அது காலப்போக்கில் மாறலாம்! (உண்மையிலும் மாற வேண்டும்; பயனர் checkbox-ஐ tick செய்யும் போது, parent component `createConnection` prop-க்கு வேறு value pass செய்கிறது.) அதனால் அது dependency ஆக இருக்க வேண்டும். bug-ஐ சரிசெய்ய அதை list-இல் சேர்க்கவும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        encryption-ஐ இயக்கு
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '" room-க்கு இணைக்கிறது... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு இணைக்கிறது... (unencrypted)');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

`createConnection` dependency ஆக இருப்பது சரியானது. ஆனால் இந்த code சற்றே fragile; ஏனெனில் யாராவது `App` component-ஐ edit செய்து இந்த prop-ன் value ஆக inline function ஒன்றை pass செய்யலாம். அப்படியானால், `App` component re-render ஆகும் ஒவ்வொரு முறையும் அதன் value வேறுபடும், எனவே Effect மிக அடிக்கடி re-synchronize ஆகலாம். இதைத் தவிர்க்க, அதற்கு பதிலாக `isEncrypted`-ஐ கீழே pass செய்யலாம்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        encryption-ஐ இயக்கு
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 "' + roomId + '" room-க்கு இணைக்கிறது... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு இணைக்கிறது... (unencrypted)');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து துண்டிக்கப்பட்டது (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

இந்த version-இல், `App` component function ஒன்றிற்குப் பதிலாக boolean prop ஒன்றை pass செய்கிறது. Effect-க்குள் எந்த function-ஐ பயன்படுத்த வேண்டும் என்பதை நீங்கள் தீர்மானிக்கிறீர்கள். `createEncryptedConnection` மற்றும் `createUnencryptedConnection` இரண்டும் component-க்கு வெளியே declare செய்யப்பட்டுள்ளதால், அவை reactive அல்ல; dependencies ஆக இருக்க வேண்டியதில்லை. இதைப் பற்றி [Effect Dependencies-ஐ அகற்றுதல்](/learn/removing-effect-dependencies) பகுதியில் மேலும் கற்பீர்கள்.

</Solution>

#### select boxes சங்கிலியை நிரப்புங்கள் {/*populate-a-chain-of-select-boxes*/}

இந்த எடுத்துக்காட்டில் இரண்டு select boxes உள்ளன. ஒன்று பயனரை planet ஒன்றை தேர்வு செய்ய அனுமதிக்கிறது. மற்றொன்று *அந்த planet-இல்* உள்ள place ஒன்றை தேர்வு செய்ய அனுமதிக்கிறது. இரண்டாவது box இன்னும் வேலை செய்யவில்லை. தேர்ந்தெடுத்த planet-இல் உள்ள places-ஐ அது காட்டச் செய்வதே உங்கள் பணி.

முதல் select box எப்படி வேலை செய்கிறது என்பதைப் பாருங்கள். அது `"/planets"` API call-இன் result மூலம் `planetList` state-ஐ populate செய்கிறது. தற்போது தேர்ந்தெடுக்கப்பட்ட planet-ன் ID `planetId` state variable-இல் வைக்கப்படுகிறது. `"/planets/" + planetId + "/places"` API call-இன் result மூலம் `placeList` state variable populate ஆகும் வகையில், எங்கு கூடுதல் code சேர்க்க வேண்டும் என்பதை நீங்கள் கண்டுபிடிக்க வேண்டும்.

இதைக் சரியாக implement செய்தால், planet ஒன்றை தேர்வு செய்வது place list-ஐ populate செய்ய வேண்டும். planet-ஐ மாற்றுவது place list-ஐ மாற்ற வேண்டும்.

<Hint>

உங்களிடம் இரண்டு independent synchronization processes இருந்தால், இரண்டு தனி Effects எழுத வேண்டும்.

</Hint>

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('planets பட்டியல் fetch செய்யப்பட்டது.');
        setPlanetList(result);
        setPlanetId(result[0].id); // முதல் planet-ஐத் தேர்வு செய்க
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        planet ஒன்றைத் தேர்வுசெய்க:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        place ஒன்றைத் தேர்வுசெய்க:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>நீங்கள் செல்லும் இடம்: {placeId || '???'}, {planetId || '???'}-இல் </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('"/planets/earth/places" போன்ற URL எதிர்பார்க்கப்பட்டது. கிடைத்தது: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('"/planets" அல்லது "/planets/earth/places" போன்ற URL எதிர்பார்க்கப்பட்டது. கிடைத்தது: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) string argument ஒன்றை எதிர்பார்க்கிறது. ' +
      'இதற்கு பதிலாக கிடைத்தது: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('அறியாத planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

இங்கு இரண்டு independent synchronization processes உள்ளன:

- முதல் select box, remote planets list உடன் synchronized ஆகிறது.
- இரண்டாவது select box, தற்போதைய `planetId`-க்கான remote places list உடன் synchronized ஆகிறது.

அதனால் அவற்றை இரண்டு தனி Effects ஆக விவரிப்பது பொருத்தமானது. இதை எப்படி செய்யலாம் என்பதற்கான எடுத்துக்காட்டு:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('planets பட்டியல் fetch செய்யப்பட்டது.');
        setPlanetList(result);
        setPlanetId(result[0].id); // முதல் planet-ஐத் தேர்வு செய்க
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('"' + planetId + '" planet-இல் places பட்டியல் fetch செய்யப்பட்டது.');
        setPlaceList(result);
        setPlaceId(result[0].id); // முதல் place-ஐத் தேர்வு செய்க
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        planet ஒன்றைத் தேர்வுசெய்க:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        place ஒன்றைத் தேர்வுசெய்க:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>நீங்கள் செல்லும் இடம்: {placeId || '???'}, {planetId || '???'}-இல் </p>
    </>
  );
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('"/planets/earth/places" போன்ற URL எதிர்பார்க்கப்பட்டது. கிடைத்தது: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('"/planets" அல்லது "/planets/earth/places" போன்ற URL எதிர்பார்க்கப்பட்டது. கிடைத்தது: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) string argument ஒன்றை எதிர்பார்க்கிறது. ' +
      'இதற்கு பதிலாக கிடைத்தது: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('அறியாத planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

இந்த code சற்றே repetitive. ஆனால் அதை ஒரு Effect ஆக இணைக்க இது நல்ல காரணமல்ல! அப்படிச் செய்தால், இரண்டு Effects-ன் dependencies-யையும் ஒரே list-இல் இணைக்க வேண்டியிருக்கும்; பின்னர் planet-ஐ மாற்றுவது அனைத்து planets list-ஐ மீண்டும் fetch செய்யும். Effects code reuse-க்கான கருவி அல்ல.

அதற்கு பதிலாக, repetition-ஐ குறைக்க, கீழே உள்ள `useSelectOptions` போன்ற custom Hook-க்குள் சில logic-ஐ extract செய்யலாம்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        planet ஒன்றைத் தேர்வுசெய்க:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        place ஒன்றைத் தேர்வுசெய்க:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>நீங்கள் செல்லும் இடம்: {placeId || '...'}, {planetId || '...'}-இல் </p>
    </>
  );
}
```

```js src/useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js src/api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('"/planets/earth/places" போன்ற URL எதிர்பார்க்கப்பட்டது. கிடைத்தது: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('"/planets" அல்லது "/planets/earth/places" போன்ற URL எதிர்பார்க்கப்பட்டது. கிடைத்தது: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) string argument ஒன்றை எதிர்பார்க்கிறது. ' +
      'இதற்கு பதிலாக கிடைத்தது: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('அறியாத planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

அது எப்படி வேலை செய்கிறது என்பதைப் பார்க்க sandbox-இல் உள்ள `useSelectOptions.js` tab-ஐப் பாருங்கள். Ideally, உங்கள் application-இல் உள்ள பெரும்பாலான Effects, நீங்கள் எழுதினாலும் community எழுதியதாக இருந்தாலும் custom Hooks-ஆல் இறுதியில் மாற்றப்பட வேண்டும். Custom Hooks synchronization logic-ஐ மறைக்கின்றன; எனவே calling component-க்கு Effect பற்றி தெரியாது. உங்கள் app-இல் தொடர்ந்து பணிபுரியும்போது, தேர்வு செய்ய Hooks-ன் palette உருவாகும்; இறுதியில் உங்கள் components-இல் Effects-ஐ அடிக்கடி எழுத வேண்டியதில்லை.

</Solution>

</Challenges>
