---
title: useEffect
---

<Intro>

`useEffect` என்பது ஒரு component-ஐ [external system உடன் synchronize செய்ய](/learn/synchronizing-with-effects) அனுமதிக்கும் React Hook.

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Effect ஒன்றை declare செய்ய உங்கள் component-ன் top level-இல் `useEffect` call செய்யுங்கள்:

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[மேலும் examples கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `setup`: உங்கள் Effect-ன் logic கொண்ட function. உங்கள் setup function optional ஆக ஒரு *cleanup* function-ஐ return செய்யலாம். உங்கள் [component commit](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) ஆனதும், React உங்கள் setup function-ஐ run செய்யும். Dependencies மாறிய ஒவ்வொரு commit-க்கும் பிறகு, React முதலில் பழைய values உடன் cleanup function-ஐ (நீங்கள் கொடுத்திருந்தால்) run செய்து, பிறகு புதிய values உடன் setup function-ஐ run செய்யும். உங்கள் component DOM-இலிருந்து remove செய்யப்பட்ட பிறகு, React உங்கள் cleanup function-ஐ run செய்யும்.

* **optional** `dependencies`: `setup` code-க்குள் referenced ஆன எல்லா reactive values-ன் list. Reactive values-இல் props, state, மற்றும் உங்கள் component body-க்குள் நேரடியாக declared செய்யப்பட்ட எல்லா variables மற்றும் functions அடங்கும். உங்கள் linter [React-க்காக configured](/learn/editor-setup#linting) செய்யப்பட்டிருந்தால், ஒவ்வொரு reactive value-உம் dependency ஆக சரியாக specified உள்ளதா என்று verify செய்யும். Dependencies list-இல் constant number of items இருக்க வேண்டும்; மேலும் `[dep1, dep2, dep3]` போல inline ஆக எழுதப்பட வேண்டும். React ஒவ்வொரு dependency-யையும் அதன் previous value உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison பயன்படுத்தி compare செய்யும். இந்த argument-ஐ omit செய்தால், component-ன் ஒவ்வொரு commit-க்கும் பிறகு உங்கள் Effect re-run ஆகும். [Dependencies array, empty array, மற்றும் dependency ஏதும் இல்லாமல் pass செய்வதின் வேறுபாட்டைப் பார்க்கவும்.](#examples-dependencies)

#### Returns {/*returns*/}

`useEffect` `undefined` return செய்கிறது.

#### Caveats {/*caveats*/}

* `useEffect` ஒரு Hook என்பதால், அதை **உங்கள் component-ன் top level** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component ஒன்றை extract செய்து state-ஐ அதற்குள் move செய்யுங்கள்.

* நீங்கள் **ஏதாவது external system உடன் synchronize செய்ய முயற்சிக்கவில்லை என்றால்,** [உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம்.](/learn/you-might-not-need-an-effect)

* Strict Mode on ஆக இருந்தால், முதல் real setup-க்கு முன் React **development-only ஆன கூடுதல் setup+cleanup cycle ஒன்றை** run செய்யும். உங்கள் cleanup logic, setup logic-ஐ "mirror" செய்கிறதா மற்றும் setup செய்கிறதை stop அல்லது undo செய்கிறதா என்பதை உறுதி செய்யும் stress-test இது. இது பிரச்சினை ஏற்படுத்தினால், [cleanup function-ஐ implement செய்யுங்கள்.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* உங்கள் dependencies-இல் சில objects அல்லது component-க்குள் defined ஆன functions இருந்தால், அவை **தேவையானதை விட அதிகமாக Effect re-run ஆக** காரணமாகும் அபாயம் உள்ளது. இதை fix செய்ய, தேவையற்ற [object](#removing-unnecessary-object-dependencies) மற்றும் [function](#removing-unnecessary-function-dependencies) dependencies-ஐ remove செய்யுங்கள். உங்கள் Effect-க்கு வெளியே [state updates](#updating-state-based-on-previous-state-from-an-effect) மற்றும் [non-reactive logic](#reading-the-latest-props-and-state-from-an-effect)-ஐயும் extract செய்யலாம்.

* உங்கள் Effect interaction (click போன்றது) காரணமாக ஏற்பட்டதல்ல என்றால், React பொதுவாக browser-க்கு **உங்கள் Effect run செய்வதற்கு முன் updated screen-ஐ முதலில் paint செய்ய** அனுமதிக்கும். உங்கள் Effect visual ஏதாவது செய்கிறதானால் (உதாரணமாக tooltip position செய்தல்), delay கவனிக்கத்தக்கதாக இருந்தால் (உதாரணமாக flicker ஆனால்), `useEffect`-ஐ [`useLayoutEffect`](/reference/react/useLayoutEffect)-ஆக மாற்றுங்கள்.

* உங்கள் Effect interaction (click போன்றது) காரணமாக ஏற்பட்டிருந்தால், **browser updated screen-ஐ paint செய்வதற்கு முன் React உங்கள் Effect-ஐ run செய்யலாம்**. Effect-ன் result-ஐ event system observe செய்ய முடியும் என்பதை இது உறுதி செய்கிறது. பொதுவாக இது எதிர்பார்த்தபடி வேலை செய்கிறது. ஆனால் `alert()` போன்ற work-ஐ paint-க்கு பிறகு வரை defer செய்ய வேண்டுமெனில், `setTimeout` use செய்யலாம். மேலும் தகவலுக்கு [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) பார்க்கவும்.

* உங்கள் Effect interaction (click போன்றது) காரணமாக இருந்தாலும், **உங்கள் Effect-க்குள் உள்ள state updates-ஐ process செய்வதற்கு முன் browser screen-ஐ repaint செய்ய React அனுமதிக்கலாம்.** பொதுவாக இது எதிர்பார்த்தபடி வேலை செய்கிறது. ஆனால் browser screen-ஐ repaint செய்வதை block செய்ய வேண்டுமெனில், `useEffect`-ஐ [`useLayoutEffect`](/reference/react/useLayoutEffect)-ஆக மாற்ற வேண்டும்.

* Effects **client-இல் மட்டுமே run ஆகும்.** Server rendering போது அவை run ஆகாது.

---

## Usage {/*usage*/}

### External system-க்கு connect செய்தல் {/*connecting-to-an-external-system*/}

சில components page-இல் display ஆகும் போது network, browser API, அல்லது third-party library ஒன்றுடன் connected ஆகவே இருக்க வேண்டும். இந்த systems React மூலம் controlled அல்ல; எனவே அவை *external* என்று அழைக்கப்படுகின்றன.

உங்கள் component-ஐ [ஏதாவது external system-க்கு connect செய்ய](/learn/synchronizing-with-effects), உங்கள் component-ன் top level-இல் `useEffect` call செய்யுங்கள்:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect`-க்கு இரண்டு arguments pass செய்ய வேண்டும்:

1. அந்த system-க்கு connect செய்யும் <CodeStep step={1}>setup code</CodeStep> கொண்ட *setup function*.
   - அந்த system-இலிருந்து disconnect செய்யும் <CodeStep step={2}>cleanup code</CodeStep> கொண்ட *cleanup function*-ஐ அது return செய்ய வேண்டும்.
2. அந்த functions-க்குள் use செய்யப்பட்ட உங்கள் component-இலிருந்து வரும் ஒவ்வொரு value-யையும் உள்ளடக்கும் <CodeStep step={3}>dependencies list</CodeStep>.

**தேவைப்படும் ஒவ்வொரு முறையும் React உங்கள் setup மற்றும் cleanup functions-ஐ call செய்யும்; இது பல முறை நடக்கலாம்:**

1. உங்கள் component page-க்கு add செய்யப்படும் போது *(mounts)* உங்கள் <CodeStep step={1}>setup code</CodeStep> run ஆகும்.
2. <CodeStep step={3}>dependencies</CodeStep> மாறிய உங்கள் component-ன் ஒவ்வொரு commit-க்கும் பிறகு:
   - முதலில், பழைய props மற்றும் state உடன் உங்கள் <CodeStep step={2}>cleanup code</CodeStep> run ஆகும்.
   - பின்னர், புதிய props மற்றும் state உடன் உங்கள் <CodeStep step={1}>setup code</CodeStep> run ஆகும்.
3. உங்கள் component page-இலிருந்து remove செய்யப்பட்ட பிறகு *(unmounts)* உங்கள் <CodeStep step={2}>cleanup code</CodeStep> கடைசியாக ஒருமுறை run ஆகும்.

**மேலுள்ள example-க்கு இந்த sequence-ஐ விளக்கிப் பார்ப்போம்.**

மேலுள்ள `ChatRoom` component page-க்கு add செய்யப்படும் போது, அது initial `serverUrl` மற்றும் `roomId` உடன் chat room-க்கு connect ஆகும். Commit காரணமாக `serverUrl` அல்லது `roomId` ஏதாவது மாறினால் (உதாரணமாக user dropdown-இல் வேறு chat room தேர்வு செய்தால்), உங்கள் Effect *முந்தைய room-இலிருந்து disconnect செய்து, அடுத்த room-க்கு connect ஆகும்.* `ChatRoom` component page-இலிருந்து remove செய்யப்படும் போது, உங்கள் Effect கடைசியாக ஒருமுறை disconnect செய்யும்.

**[Bugs கண்டுபிடிக்க உதவ](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed), development-இல் React <CodeStep step={1}>setup</CodeStep>-க்கு முன் <CodeStep step={1}>setup</CodeStep> மற்றும் <CodeStep step={2}>cleanup</CodeStep>-ஐ கூடுதலாக ஒருமுறை run செய்கிறது.** உங்கள் Effect-ன் logic சரியாக implemented உள்ளதா என்பதை verify செய்யும் stress-test இது. இது visible issues ஏற்படுத்தினால், உங்கள் cleanup function-இல் சில logic missing. Cleanup function setup function செய்ததை stop அல்லது undo செய்ய வேண்டும். Rule of thumb: setup ஒருமுறை call செய்யப்படுவது (production போல) மற்றும் *setup* → *cleanup* → *setup* sequence (development போல) இடையே user வேறுபாடு காணக்கூடாது. [பொதுவான solutions பார்க்கவும்.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**ஒவ்வொரு Effect-ஐயும் [independent process ஆக எழுத](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) முயற்சிக்கவும்; மேலும் [ஒரு setup/cleanup cycle பற்றி மட்டும் ஒரே நேரத்தில் சிந்திக்கவும்.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** உங்கள் component mounting, updating, அல்லது unmounting ஆகியவற்றில் எது நடக்கிறது என்பது முக்கியமாக இருக்கக்கூடாது. Cleanup logic setup logic-ஐ சரியாக "mirror" செய்தால், setup மற்றும் cleanup தேவையான அளவு அடிக்கடி run ஆனாலும் உங்கள் Effect resilient ஆக இருக்கும்.

<Note>

Effect ஒன்று உங்கள் component-ஐ chat service போன்ற external system உடன் [synchronized ஆக வைத்திருக்க](/learn/synchronizing-with-effects) அனுமதிக்கிறது. இங்கே *external system* என்பது React மூலம் controlled அல்லாத எந்த code பகுதியையும் குறிக்கும், உதாரணமாக:

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> மற்றும் <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep> மூலம் manage செய்யப்படும் timer.
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> மற்றும் <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep> பயன்படுத்தும் event subscription.
* <CodeStep step={1}>`animation.start()`</CodeStep> மற்றும் <CodeStep step={2}>`animation.reset()`</CodeStep> போன்ற API கொண்ட third-party animation library.

**நீங்கள் எந்த external system-க்கும் connect செய்யவில்லை என்றால், [உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம்.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="External system-க்கு connect செய்வதற்கான examples" titleId="examples-connecting">

#### Chat server-க்கு connect செய்தல் {/*connecting-to-a-chat-server*/}

இந்த example-இல், `ChatRoom` component `chat.js`-இல் defined செய்யப்பட்ட external system உடன் connected ஆக இருக்க Effect use செய்கிறது. `ChatRoom` component தோன்ற "Chat-ஐ திற" அழுத்துங்கள். இந்த sandbox development mode-இல் run ஆகிறது; எனவே [இங்கே விளக்கப்பட்டுள்ளபடி](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) கூடுதல் connect-and-disconnect cycle ஒன்று உள்ளது. Dropdown மற்றும் input பயன்படுத்தி `roomId` மற்றும் `serverUrl` மாற்றிப் பார்த்து, Effect chat-க்கு எப்படி re-connect ஆகிறது என்பதை பாருங்கள். Effect கடைசியாக ஒருமுறை disconnect ஆகுவதைக் காண "Chat-ஐ மூடு" அழுத்துங்கள்.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
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
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Global browser event-ஐ listen செய்தல் {/*listening-to-a-global-browser-event*/}

இந்த example-இல், external system browser DOM தானே. சாதாரணமாக JSX மூலம் event listeners specify செய்வீர்கள்; ஆனால் global [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) object-ஐ இவ்வாறு listen செய்ய முடியாது. Effect ஒன்று `window` object-க்கு connect செய்து அதன் events-ஐ listen செய்ய அனுமதிக்கிறது. `pointermove` event-ஐ listen செய்வது cursor (அல்லது finger) position-ஐ track செய்து red dot அதனுடன் நகர update செய்ய உதவும்.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Animation trigger செய்தல் {/*triggering-an-animation*/}

இந்த example-இல், external system `animation.js`-இல் உள்ள animation library. அது DOM node-ஐ argument ஆக எடுத்து animation-ஐ control செய்ய `start()` மற்றும் `stop()` methods expose செய்யும் `FadeInAnimation` என்ற JavaScript class-ஐ வழங்குகிறது. இந்த component underlying DOM node-ஐ access செய்ய [ref use செய்கிறது](/learn/manipulating-the-dom-with-refs). Component தோன்றும் போது, Effect ref-இலிருந்து DOM node-ஐ read செய்து, அந்த node-க்கு animation-ஐ automatic ஆக start செய்கிறது.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
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
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove செய்' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome />}
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

<Solution />

#### Modal dialog-ஐ control செய்தல் {/*controlling-a-modal-dialog*/}

இந்த example-இல், external system browser DOM. `ModalDialog` component [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element-ஐ render செய்கிறது. அது `isOpen` prop-ஐ [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) மற்றும் [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) method calls உடன் synchronize செய்ய Effect use செய்கிறது.

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Dialog-ஐ திற
      </button>
      <ModalDialog isOpen={show}>
        வணக்கம்!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>மூடு</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Element visibility-ஐ track செய்தல் {/*tracking-element-visibility*/}

இந்த example-இல், external system மீண்டும் browser DOM. `App` component நீளமான list ஒன்றை, பின்னர் `Box` component-ஐ, பின்னர் மற்றொரு நீளமான list-ஐ display செய்கிறது. List-ஐ கீழே scroll செய்யுங்கள். `Box` component முழுவதும் viewport-இல் fully visible ஆகும் போது background color black ஆக மாறுகிறது என்பதை கவனியுங்கள். இதை implement செய்ய, `Box` component [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)-ஐ manage செய்ய Effect use செய்கிறது. DOM element viewport-இல் visible ஆகும் போது இந்த browser API உங்களுக்கு notify செய்கிறது.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (தொடர்ந்து scroll செய்க)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Effects-ஐ custom Hooks-இல் wrap செய்தல் {/*wrapping-effects-in-custom-hooks*/}

Effects ஒரு ["escape hatch"](/learn/escape-hatches): நீங்கள் "React-க்கு வெளியே step செய்ய" வேண்டியபோது மற்றும் உங்கள் use case-க்கு சிறந்த built-in solution இல்லாதபோது அவற்றை use செய்கிறீர்கள். Effects-ஐ அடிக்கடி manual ஆக எழுத வேண்டிய நிலை உங்களுக்கு வந்தால், உங்கள் components சார்ந்திருக்கும் common behaviors-க்கு சில [custom Hooks](/learn/reusing-logic-with-custom-hooks) extract செய்ய வேண்டும் என்பதற்கான அறிகுறியாக அது இருக்கும்.

உதாரணமாக, இந்த `useChatRoom` custom Hook உங்கள் Effect-ன் logic-ஐ இன்னும் declarative API பின்னால் "hide" செய்கிறது:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

பிறகு எந்த component-இலிருந்தும் அதை இவ்வாறு use செய்யலாம்:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

React ecosystem-இல் ஒவ்வொரு purpose-க்கும் பல சிறந்த custom Hooks கிடைக்கின்றன.

[Effects-ஐ custom Hooks-இல் wrap செய்வது பற்றி மேலும் அறிக.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Effects-ஐ custom Hooks-இல் wrap செய்வதற்கான examples" titleId="examples-custom-hooks">

#### Custom `useChatRoom` Hook {/*custom-usechatroom-hook*/}

இந்த example [முந்தைய examples-இல்](#examples-connecting) ஒன்றுக்கு identical; ஆனால் logic custom Hook-க்கு extract செய்யப்பட்டுள்ளது.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Custom `useWindowListener` Hook {/*custom-usewindowlistener-hook*/}

இந்த example [முந்தைய examples-இல்](#examples-connecting) ஒன்றுக்கு identical; ஆனால் logic custom Hook-க்கு extract செய்யப்பட்டுள்ளது.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Custom `useIntersectionObserver` Hook {/*custom-useintersectionobserver-hook*/}

இந்த example [முந்தைய examples-இல்](#examples-connecting) ஒன்றுக்கு identical; ஆனால் logic பகுதியளவில் custom Hook-க்கு extract செய்யப்பட்டுள்ளது.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (தொடர்ந்து scroll செய்க)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Non-React widget-ஐ control செய்தல் {/*controlling-a-non-react-widget*/}

சில நேரங்களில், external system ஒன்றை உங்கள் component-ன் prop அல்லது state ஒன்றுடன் synchronized ஆக வைத்திருக்க விரும்புவீர்கள்.

உதாரணமாக, React இல்லாமல் எழுதப்பட்ட third-party map widget அல்லது video player component உங்களிடம் இருந்தால், அதன் state உங்கள் React component-ன் current state-க்கு match ஆகும் வகையில் அதில் methods call செய்ய Effect use செய்யலாம். இந்த Effect `map-widget.js`-இல் defined செய்யப்பட்ட `MapWidget` class-ன் instance ஒன்றை create செய்கிறது. `Map` component-ன் `zoomLevel` prop-ஐ மாற்றும்போது, அதை synchronized ஆக வைத்திருக்க Effect class instance-இல் `setZoom()` call செய்கிறது:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom அளவு: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

இந்த example-இல் cleanup function தேவையில்லை; ஏனெனில் `MapWidget` class அதற்கு pass செய்யப்பட்ட DOM node-ஐ மட்டும் manage செய்கிறது. `Map` React component tree-இலிருந்து remove செய்யப்பட்ட பிறகு, DOM node மற்றும் `MapWidget` class instance இரண்டும் browser JavaScript engine மூலம் automatic ஆக garbage-collected ஆகும்.

---

### Effects மூலம் data fetch செய்தல் {/*fetching-data-with-effects*/}

உங்கள் component-க்காக data fetch செய்ய Effect use செய்யலாம். [நீங்கள் framework use செய்தால்,](/learn/creating-a-react-app#full-stack-frameworks) Effects-ஐ manual ஆக எழுதுவதைக் காட்டிலும் உங்கள் framework-ன் data fetching mechanism use செய்வது மிகவும் efficient ஆக இருக்கும் என்பதை கவனிக்கவும்.

Effect-இலிருந்து data-ஐ manual ஆக fetch செய்ய விரும்பினால், உங்கள் code இவ்வாறு இருக்கலாம்:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

`false` ஆக initialized செய்யப்பட்டு cleanup போது `true` ஆக set செய்யப்படும் `ignore` variable-ஐ கவனியுங்கள். Network responses நீங்கள் அனுப்பிய order-இல் அல்லாமல் வேறு order-இல் வரக்கூடும்; [உங்கள் code "race conditions" காரணமாக பாதிக்கப்படாமல் இருப்பதை](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) இது உறுதி செய்கிறது.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'ஏற்றுகிறது...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('இது ' + person + ' உடைய bio.');
    }, delay);
  })
}
```

</Sandpack>

[`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) syntax பயன்படுத்தியும் rewrite செய்யலாம்; ஆனால் cleanup function இன்னும் provide செய்ய வேண்டும்:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'ஏற்றுகிறது...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('இது ' + person + ' உடைய bio.');
    }, delay);
  })
}
```

</Sandpack>

Data fetching-ஐ நேரடியாக Effects-இல் எழுதுவது repetitive ஆகும்; பின்னர் caching மற்றும் server rendering போன்ற optimizations சேர்ப்பதையும் கடினமாக்கும். [உங்கள் சொந்த custom Hook-ஆக இருந்தாலும் அல்லது community maintained Hook-ஆக இருந்தாலும் அதை use செய்வது மேம்படும்.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Effects-இல் data fetching-க்கு நல்ல alternatives என்ன? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effects-க்குள் `fetch` calls எழுதுவது, குறிப்பாக முழுமையாக client-side apps-இல், [data fetch செய்வதற்கான popular வழி](https://www.robinwieruch.de/react-hooks-fetch-data/). ஆனால் இது மிகவும் manual approach; மேலும் குறிப்பிடத்தக்க downsides உள்ளன:

- **Effects server-இல் run ஆகாது.** இதன் பொருள் initial server-rendered HTML data இல்லாத loading state மட்டும் கொண்டிருக்கும். Client computer எல்லா JavaScript-ஐயும் download செய்து app-ஐ render செய்த பிறகே இப்போது data load செய்ய வேண்டும் என்பதை கண்டறியும். இது efficient அல்ல.
- **Effects-இல் நேரடியாக fetching செய்வது "network waterfalls" உருவாக்க உதவுகிறது.** நீங்கள் parent component-ஐ render செய்கிறீர்கள்; அது சில data fetch செய்கிறது; child components-ஐ render செய்கிறது; பின்னர் அவை தங்கள் data fetch செய்ய தொடங்குகின்றன. Network வேகமாக இல்லையெனில், எல்லா data-யையும் parallel-ஆக fetch செய்வதை விட இது குறிப்பிடத்தக்க அளவு slow.
- **Effects-இல் நேரடியாக fetching செய்வது பொதுவாக data preload அல்லது cache செய்யப்படாது என்பதைக் குறிக்கும்.** உதாரணமாக, component unmount ஆகி மீண்டும் mount ஆனால், data-ஐ மீண்டும் fetch செய்ய வேண்டியிருக்கும்.
- **இது மிகவும் ergonomic அல்ல.** [Race conditions](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) போன்ற bugs ஏற்படாத வகையில் `fetch` calls எழுதும்போது கணிசமான boilerplate code தேவைப்படும்.

இந்த downsides list React-க்கு மட்டும் குறிப்பானது அல்ல. எந்த library-யுடனும் mount போது data fetch செய்வதற்கு இது பொருந்தும். Routing போலவே, data fetching-ஐ நன்றாக செய்வது trivial அல்ல; எனவே பின்வரும் approaches-ஐ பரிந்துரைக்கிறோம்:

- **நீங்கள் [framework](/learn/creating-a-react-app#full-stack-frameworks) use செய்தால், அதன் built-in data fetching mechanism-ஐ use செய்யுங்கள்.** Modern React frameworks efficient ஆன, மேலுள்ள pitfalls இல்லாத integrated data fetching mechanisms கொண்டுள்ளன.
- **இல்லையெனில், client-side cache use செய்வதையோ build செய்வதையோ consider செய்யுங்கள்.** Popular open source solutions-இல் [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), மற்றும் [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) அடங்கும். உங்கள் சொந்த solution-ஐயும் build செய்யலாம்; அப்போது under the hood Effects use செய்வீர்கள், ஆனால் requests-ஐ deduplicate செய்தல், responses-ஐ cache செய்தல், மற்றும் network waterfalls தவிர்த்தல் (data preload செய்வதன் மூலம் அல்லது data requirements-ஐ routes-க்கு hoist செய்வதன் மூலம்) ஆகிய logic சேர்ப்பீர்கள்.

இந்த approaches எதுவும் உங்களுக்கு பொருந்தவில்லை என்றால், Effects-இல் நேரடியாக data fetch செய்வதைத் தொடரலாம்.

</DeepDive>

---

### Reactive dependencies specify செய்தல் {/*specifying-reactive-dependencies*/}

**உங்கள் Effect-ன் dependencies-ஐ நீங்கள் "தேர்வு" செய்ய முடியாது என்பதை கவனியுங்கள்.** உங்கள் Effect code use செய்யும் ஒவ்வொரு <CodeStep step={2}>reactive value</CodeStep>-உம் dependency ஆக declare செய்யப்பட வேண்டும். உங்கள் Effect-ன் dependency list surrounding code மூலம் determined ஆகிறது:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // இது reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // இதுவும் reactive value

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // இந்த Effect இந்த reactive values-ஐ read செய்கிறது
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ எனவே அவற்றை உங்கள் Effect-ன் dependencies ஆக specify செய்ய வேண்டும்
  // ...
}
```

`serverUrl` அல்லது `roomId` ஏதாவது மாறினால், உங்கள் Effect புதிய values பயன்படுத்தி chat-க்கு reconnect செய்யும்.

**[Reactive values](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)-இல் props மற்றும் உங்கள் component-க்குள் நேரடியாக declared செய்யப்பட்ட அனைத்து variables மற்றும் functions அடங்கும்.** `roomId` மற்றும் `serverUrl` reactive values என்பதால், அவற்றை dependencies-இலிருந்து remove செய்ய முடியாது. அவற்றை omit செய்ய முயற்சித்து [உங்கள் linter React-க்காக சரியாக configured](/learn/editor-setup#linting) செய்யப்பட்டிருந்தால், இதை fix செய்ய வேண்டிய தவறாக linter flag செய்யும்:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect-க்கு missing dependencies உள்ளன: 'roomId' மற்றும் 'serverUrl'
  // ...
}
```

**Dependency ஒன்றை remove செய்ய, அது dependency ஆக *இருக்க தேவையில்லை* என்பதை linter-க்கு ["prove" செய்ய வேண்டும்.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** உதாரணமாக, `serverUrl` reactive அல்ல மற்றும் re-renders போது மாறாது என்பதை prove செய்ய, அதை உங்கள் component-க்கு வெளியே move செய்யலாம்:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // இனி reactive value அல்ல

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ எல்லா dependencies-உம் declared
  // ...
}
```

இப்போது `serverUrl` reactive value அல்ல (மற்றும் re-render போது மாற முடியாது), அது dependency ஆக இருக்க தேவையில்லை. **உங்கள் Effect code எந்த reactive values-யும் use செய்யவில்லை என்றால், அதன் dependency list empty (`[]`) ஆக இருக்க வேண்டும்:**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // இனி reactive value அல்ல
const roomId = 'music'; // இனி reactive value அல்ல

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ எல்லா dependencies-உம் declared
  // ...
}
```

[Empty dependencies கொண்ட Effect](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) உங்கள் component-ன் props அல்லது state ஏதாவது மாறும்போது re-run ஆகாது.

<Pitfall>

உங்களிடம் existing codebase இருந்தால், linter-ஐ இவ்வாறு suppress செய்யும் சில Effects இருக்கலாம்:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Dependencies code-க்கு match ஆகவில்லை என்றால், bugs அறிமுகப்படுத்தும் risk அதிகம்.** Linter-ஐ suppress செய்வதன் மூலம், உங்கள் Effect depend செய்யும் values பற்றி React-க்கு நீங்கள் "பொய்" சொல்கிறீர்கள். [அதற்கு பதிலாக, அவை தேவையற்றவை என்பதை prove செய்யுங்கள்.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Reactive dependencies pass செய்வதற்கான examples" titleId="examples-dependencies">

#### Dependency array pass செய்தல் {/*passing-a-dependency-array*/}

Dependencies-ஐ specify செய்தால், உங்கள் Effect **initial commit-க்கு பிறகும் _மற்றும்_ dependencies மாறிய commits-க்கு பிறகும்** run ஆகும்.

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // a அல்லது b வேறுபட்டால் மீண்டும் run ஆகும்
```

கீழுள்ள example-இல், `serverUrl` மற்றும் `roomId` [reactive values](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values); எனவே இரண்டும் dependencies ஆக specify செய்யப்பட வேண்டும். அதன் விளைவாக, dropdown-இல் வேறு room தேர்வு செய்தாலும் அல்லது server URL input edit செய்தாலும் chat re-connect ஆகும். ஆனால் `message` Effect-இல் use செய்யப்படாததால் (அதனால் dependency அல்ல), message edit செய்தால் chat re-connect ஆகாது.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
      <label>
        உங்கள் message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Empty dependency array pass செய்தல் {/*passing-an-empty-dependency-array*/}

உங்கள் Effect உண்மையாக எந்த reactive values-யும் use செய்யவில்லை என்றால், அது **initial commit-க்கு பிறகு மட்டும்** run ஆகும்.

```js {3}
useEffect(() => {
  // ...
}, []); // மீண்டும் run ஆகாது (development-இல் ஒருமுறை தவிர)
```

**Empty dependencies இருந்தாலும், bugs கண்டுபிடிக்க உதவ setup மற்றும் cleanup [development-இல் கூடுதலாக ஒருமுறை run ஆகும்](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development).**


இந்த example-இல் `serverUrl` மற்றும் `roomId` இரண்டும் hardcoded. அவை component-க்கு வெளியே declared செய்யப்பட்டதால், reactive values அல்ல; எனவே dependencies அல்ல. Dependency list empty ஆக இருப்பதால், re-renders போது Effect re-run ஆகாது.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
      <label>
        உங்கள் message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
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
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

</Sandpack>

<Solution />


#### Dependency array ஏதும் pass செய்யாதல் {/*passing-no-dependency-array-at-all*/}

Dependency array எதையும் pass செய்யவில்லை என்றால், உங்கள் component-ன் **ஒவ்வொரு commit-க்கும் பிறகு** உங்கள் Effect run ஆகும்.

```js {3}
useEffect(() => {
  // ...
}); // எப்போதும் மீண்டும் run ஆகும்
```

இந்த example-இல், `serverUrl` மற்றும் `roomId`-ஐ மாற்றும்போது Effect re-run ஆகிறது; இது sensible. ஆனால் `message`-ஐ மாற்றும்போதும் அது *மீண்டும்* re-run ஆகிறது; இது பெரும்பாலும் விரும்பத்தகாதது. அதனால்தான் பொதுவாக dependency array-ஐ specify செய்வீர்கள்.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Dependency array ஏதும் இல்லை

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
      <label>
        உங்கள் message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Effect-இலிருந்து previous state அடிப்படையில் state update செய்தல் {/*updating-state-based-on-previous-state-from-an-effect*/}

Effect-இலிருந்து previous state அடிப்படையில் state update செய்ய விரும்பும்போது, ஒரு பிரச்சினை வரலாம்:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Counter-ஐ ஒவ்வொரு second-க்கும் increment செய்ய விரும்புகிறீர்கள்...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ...ஆனால் `count`-ஐ dependency ஆக specify செய்தால் interval எப்போதும் reset ஆகும்.
  // ...
}
```

`count` reactive value என்பதால், அது dependencies list-இல் specify செய்யப்பட வேண்டும். ஆனால் `count` மாறும் ஒவ்வொரு முறையும் Effect cleanup செய்து மீண்டும் setup செய்ய இது காரணமாகிறது. இது ideal அல்ல.

இதை fix செய்ய, `setCount`-க்கு [`c => c + 1` state updater-ஐ pass செய்யுங்கள்](/reference/react/useState#updating-state-based-on-the-previous-state):

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ State updater-ஐ pass செய்க
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ இப்போது count dependency அல்ல

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

இப்போது `count + 1` பதிலாக `c => c + 1` pass செய்வதால், [உங்கள் Effect இனி `count`-ஐ depend செய்ய வேண்டியதில்லை.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) இந்த fix-ன் விளைவாக, `count` மாறும் ஒவ்வொரு முறையும் interval-ஐ cleanup செய்து setup செய்ய தேவையில்லை.

---


### தேவையற்ற object dependencies-ஐ நீக்குதல் {/*removing-unnecessary-object-dependencies*/}

உங்கள் Effect rendering போது create செய்யப்பட்ட object அல்லது function ஒன்றை depend செய்தால், அது மிக அடிக்கடி run ஆகலாம். உதாரணமாக, `options` object [ஒவ்வொரு render-க்கும் வேறுபடுவதால்](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) இந்த Effect ஒவ்வொரு commit-க்கும் பிறகு re-connect ஆகிறது:

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 இந்த object ஒவ்வொரு re-render-க்கும் scratch-இலிருந்து create செய்யப்படுகிறது
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // இது Effect-க்குள் use செய்யப்படுகிறது
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 அதன் விளைவாக, இந்த dependencies ஒவ்வொரு commit-இலும் எப்போதும் வேறுபடும்
  // ...
```

Rendering போது create செய்யப்பட்ட object-ஐ dependency ஆக use செய்வதை தவிர்க்கவும். அதற்கு பதிலாக, object-ஐ Effect-க்குள் create செய்யுங்கள்:

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
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
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
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

இப்போது `options` object-ஐ Effect-க்குள் create செய்வதால், Effect தானாகவே `roomId` string-ஐ மட்டும் depend செய்கிறது.

இந்த fix உடன், input-இல் type செய்வது chat-ஐ reconnect செய்யாது. Re-created ஆகும் object போல அல்லாமல், `roomId` போன்ற string-ஐ வேறு value-ஆக set செய்யாவிட்டால் அது மாறாது. [Dependencies remove செய்வது பற்றி மேலும் படிக்கவும்.](/learn/removing-effect-dependencies)

---

### தேவையற்ற function dependencies-ஐ நீக்குதல் {/*removing-unnecessary-function-dependencies*/}

உங்கள் Effect rendering போது create செய்யப்பட்ட object அல்லது function ஒன்றை depend செய்தால், அது மிக அடிக்கடி run ஆகலாம். உதாரணமாக, `createOptions` function [ஒவ்வொரு render-க்கும் வேறுபடுவதால்](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally) இந்த Effect ஒவ்வொரு commit-க்கும் பிறகு re-connect ஆகிறது:

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 இந்த function ஒவ்வொரு re-render-க்கும் scratch-இலிருந்து create செய்யப்படுகிறது
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // இது Effect-க்குள் use செய்யப்படுகிறது
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 அதன் விளைவாக, இந்த dependencies ஒவ்வொரு commit-இலும் எப்போதும் வேறுபடும்
  // ...
```

ஒவ்வொரு re-render-க்கும் function ஒன்றை scratch-இலிருந்து create செய்வது தனியாக ஒரு problem அல்ல. அதை optimize செய்ய தேவையில்லை. ஆனால் அதை உங்கள் Effect-ன் dependency ஆக use செய்தால், அது ஒவ்வொரு commit-க்கும் பிறகு உங்கள் Effect re-run ஆக காரணமாகும்.

Rendering போது create செய்யப்பட்ட function-ஐ dependency ஆக use செய்வதை தவிர்க்கவும். அதற்கு பதிலாக, அதை Effect-க்குள் declare செய்யுங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

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
  }, [roomId]);

  return (
    <>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
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
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
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
      console.log('✅ "' + roomId + '" அறைக்கு ' + serverUrl + ' இல் connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" அறையிலிருந்து ' + serverUrl + ' இல் disconnect ஆனது');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

இப்போது `createOptions` function-ஐ Effect-க்குள் define செய்வதால், Effect தானாகவே `roomId` string-ஐ மட்டும் depend செய்கிறது. இந்த fix உடன், input-இல் type செய்வது chat-ஐ reconnect செய்யாது. Re-created ஆகும் function போல அல்லாமல், `roomId` போன்ற string-ஐ வேறு value-ஆக set செய்யாவிட்டால் அது மாறாது. [Dependencies remove செய்வது பற்றி மேலும் படிக்கவும்.](/learn/removing-effect-dependencies)

---

### Effect-இலிருந்து latest props மற்றும் state படித்தல் {/*reading-the-latest-props-and-state-from-an-effect*/}

Default ஆக, Effect-இலிருந்து reactive value ஒன்றை read செய்தால், அதை dependency ஆக add செய்ய வேண்டும். அந்த value-ன் ஒவ்வொரு change-க்கும் உங்கள் Effect "react" செய்யும் என்பதை இது உறுதி செய்கிறது. பெரும்பாலான dependencies-க்கு, இதுவே நீங்கள் விரும்பும் behavior.

**ஆனால் சில நேரங்களில், அவற்றுக்கு "react" செய்யாமல் Effect-இலிருந்து *latest* props மற்றும் state-ஐ read செய்ய நீங்கள் விரும்புவீர்கள்.** உதாரணமாக, ஒவ்வொரு page visit-க்கும் shopping cart-இல் உள்ள items எண்ணிக்கையை log செய்ய விரும்புகிறீர்கள் என்று கற்பனை செய்யுங்கள்:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ எல்லா dependencies-உம் declared
  // ...
}
```

**ஒவ்வொரு `url` change-க்கும் பிறகு புதிய page visit log செய்ய வேண்டும், ஆனால் `shoppingCart` மட்டும் மாறினால் வேண்டாம் என்றால்?** [Reactivity rules](#specifying-reactive-dependencies)-ஐ break செய்யாமல் `shoppingCart`-ஐ dependencies-இலிருந்து exclude செய்ய முடியாது. ஆனால் Effect-க்குள் இருந்து call செய்யப்பட்டாலும், code-ன் ஒரு பகுதி changes-க்கு "react" செய்ய வேண்டாம் என்று express செய்யலாம். [`useEffectEvent`](/reference/react/useEffectEvent) Hook மூலம் [*Effect Event* declare செய்து](/learn/separating-events-from-effects#declaring-an-effect-event), `shoppingCart` read செய்யும் code-ஐ அதற்குள் move செய்யுங்கள்:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ எல்லா dependencies-உம் declared
  // ...
}
```

**Effect Events reactive அல்ல; அவை உங்கள் Effect-ன் dependencies-இலிருந்து எப்போதும் omit செய்யப்பட வேண்டும்.** இதுவே non-reactive code-ஐ (சில props மற்றும் state-ன் latest value-ஐ read செய்யும் இடம்) அவற்றுக்குள் வைக்க அனுமதிக்கிறது. `onVisit`-க்குள் `shoppingCart` read செய்வதன் மூலம், `shoppingCart` உங்கள் Effect-ஐ re-run செய்யாது என்பதை உறுதி செய்கிறீர்கள்.

[Effect Events reactive மற்றும் non-reactive code-ஐ பிரிக்க எப்படி உதவுகின்றன என்பதை மேலும் படிக்கவும்.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Server மற்றும் client-இல் வேறுபட்ட content display செய்தல் {/*displaying-different-content-on-the-server-and-the-client*/}

உங்கள் app server rendering use செய்தால் ([நேரடியாக](/reference/react-dom/server) அல்லது [framework](/learn/creating-a-react-app#full-stack-frameworks) மூலம்), உங்கள் component இரண்டு வேறுபட்ட environments-இல் render ஆகும். Server-இல், initial HTML produce செய்ய அது render ஆகும். Client-இல், அந்த HTML-க்கு உங்கள் event handlers attach செய்ய React rendering code-ஐ மீண்டும் run செய்யும். அதனால்தான் [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) வேலை செய்ய, உங்கள் initial render output client மற்றும் server-இல் identical ஆக இருக்க வேண்டும்.

அரிதான cases-இல், client-இல் வேறுபட்ட content display செய்ய வேண்டியிருக்கலாம். உதாரணமாக, உங்கள் app [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)-இலிருந்து சில data read செய்தால், server-இல் அதை செய்ய முடியாது. இதை இவ்வாறு implement செய்யலாம்:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

App loading ஆகும் போது, user initial render output-ஐ பார்ப்பார். பின்னர் அது loaded மற்றும் hydrated ஆனதும், உங்கள் Effect run ஆகி `didMount`-ஐ `true` ஆக set செய்து re-render trigger செய்யும். இது client-only render output-க்கு switch செய்யும். Effects server-இல் run ஆகாததால், initial server render போது `didMount` `false` ஆக இருந்தது இதனால்தான்.

இந்த pattern-ஐ குறைவாக use செய்யுங்கள். Slow connection கொண்ட users initial content-ஐ கணிசமான நேரம்--சில seconds கூட--பார்ப்பார்கள் என்பதை நினைவில் கொள்ளுங்கள்; எனவே உங்கள் component appearance-இல் jarring changes செய்ய விரும்பமாட்டீர்கள். பல cases-இல், CSS மூலம் conditionally வேறுபட்ட விஷயங்களை காட்டி இதற்கான தேவையை தவிர்க்கலாம்.

---

## Troubleshooting {/*troubleshooting*/}

### Component mount ஆகும்போது என் Effect இருமுறை run ஆகிறது {/*my-effect-runs-twice-when-the-component-mounts*/}

Strict Mode on ஆக இருந்தால், development-இல் actual setup-க்கு முன் React setup மற்றும் cleanup-ஐ கூடுதலாக ஒருமுறை run செய்கிறது.

உங்கள் Effect-ன் logic சரியாக implemented உள்ளதா என்பதை verify செய்யும் stress-test இது. இது visible issues ஏற்படுத்தினால், உங்கள் cleanup function-இல் சில logic missing. Cleanup function setup function செய்ததை stop அல்லது undo செய்ய வேண்டும். Rule of thumb: setup ஒருமுறை call செய்யப்படுவது (production போல) மற்றும் setup → cleanup → setup sequence (development போல) இடையே user வேறுபாடு காணக்கூடாது.

[இது bugs கண்டுபிடிக்க எப்படி உதவுகிறது](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) மற்றும் [உங்கள் logic-ஐ எப்படி fix செய்வது](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) பற்றி மேலும் படிக்கவும்.

---

### ஒவ்வொரு re-render-க்கும் பிறகு என் Effect run ஆகிறது {/*my-effect-runs-after-every-re-render*/}

முதலில், dependency array specify செய்ய மறந்துவிடவில்லை என்பதை check செய்யுங்கள்:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Dependency array இல்லை: ஒவ்வொரு commit-க்கும் பிறகு re-run ஆகும்!
```

Dependency array specify செய்திருந்தும் உங்கள் Effect loop-இல் re-run ஆகிக் கொண்டிருந்தால், உங்கள் dependencies-இல் ஒன்று ஒவ்வொரு re-render-க்கும் வேறுபடுவதால்தான்.

உங்கள் dependencies-ஐ console-க்கு manual ஆக log செய்து இந்த problem-ஐ debug செய்யலாம்:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

பின்னர் console-இல் வேறுபட்ட re-renders-இலிருந்து வந்த arrays-ஐ right-click செய்து இரண்டிற்கும் "Store as a global variable" select செய்யலாம். முதல் ஒன்று `temp1` ஆகவும் இரண்டாவது ஒன்று `temp2` ஆகவும் save ஆனதாகக் கொண்டு, இரு arrays-இலுள்ள ஒவ்வொரு dependency-யும் same ஆக உள்ளதா என்பதை browser console மூலம் check செய்யலாம்:

```js
Object.is(temp1[0], temp2[0]); // arrays இடையே முதல் dependency same ஆக உள்ளதா?
Object.is(temp1[1], temp2[1]); // arrays இடையே இரண்டாவது dependency same ஆக உள்ளதா?
Object.is(temp1[2], temp2[2]); // ... ஒவ்வொரு dependency-க்கும் இதேபோல் ...
```

ஒவ்வொரு re-render-க்கும் வேறுபடும் dependency-ஐ கண்டுபிடித்ததும், பொதுவாக பின்வரும் வழிகளில் ஒன்றால் அதை fix செய்யலாம்:

- [Effect-இலிருந்து previous state அடிப்படையில் state update செய்தல்](#updating-state-based-on-previous-state-from-an-effect)
- [தேவையற்ற object dependencies-ஐ நீக்குதல்](#removing-unnecessary-object-dependencies)
- [தேவையற்ற function dependencies-ஐ நீக்குதல்](#removing-unnecessary-function-dependencies)
- [Effect-இலிருந்து latest props மற்றும் state படித்தல்](#reading-the-latest-props-and-state-from-an-effect)

Last resort ஆக (இந்த methods உதவவில்லை என்றால்), அதன் creation-ஐ [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) அல்லது (functions-க்கு) [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) மூலம் wrap செய்யுங்கள்.

---

### என் Effect infinite cycle-இல் தொடர்ந்து re-run ஆகிறது {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

உங்கள் Effect infinite cycle-இல் run ஆனால், இந்த இரண்டு விஷயங்களும் உண்மை ஆக வேண்டும்:

- உங்கள் Effect ஏதாவது state-ஐ update செய்கிறது.
- அந்த state re-render-க்கு வழிவகுக்கிறது; அது Effect-ன் dependencies மாற காரணமாகிறது.

Problem-ஐ fix செய்யத் தொடங்குவதற்கு முன், உங்கள் Effect DOM, network, third-party widget போன்ற external system ஒன்றுடன் connect செய்கிறதா என்று உங்களையே கேளுங்கள். உங்கள் Effect ஏன் state set செய்ய வேண்டும்? அது அந்த external system உடன் synchronize செய்கிறதா? அல்லது உங்கள் application's data flow-ஐ அதன்மூலம் manage செய்ய முயற்சிக்கிறீர்களா?

External system இல்லையெனில், [Effect-ஐ முழுமையாக remove செய்வது](/learn/you-might-not-need-an-effect) உங்கள் logic-ஐ simplify செய்யுமா என்று consider செய்யுங்கள்.

நீங்கள் உண்மையாக external system ஒன்றுடன் synchronize செய்கிறீர்கள் என்றால், உங்கள் Effect ஏன் மற்றும் எந்த conditions-இல் state update செய்ய வேண்டும் என்று சிந்தியுங்கள். உங்கள் component-ன் visual output-ஐ பாதிக்கும் ஏதாவது மாறியுள்ளதா? Rendering-இல் use செய்யப்படாத data ஒன்றை track செய்ய வேண்டுமெனில், re-renders trigger செய்யாத [ref](/reference/react/useRef#referencing-a-value-with-a-ref) இன்னும் பொருத்தமாக இருக்கலாம். உங்கள் Effect தேவையானதை விட அதிகமாக state update செய்து re-renders trigger செய்யவில்லை என்பதை verify செய்யுங்கள்.

இறுதியாக, உங்கள் Effect சரியான நேரத்தில் state update செய்தாலும் loop இன்னும் இருந்தால், அந்த state update Effect-ன் dependencies-இல் ஒன்றை மாற்றுவதால்தான். [Dependency changes-ஐ debug செய்வது எப்படி என்பதை படிக்கவும்.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### என் component unmount ஆகாதிருந்தாலும் cleanup logic run ஆகிறது {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

Cleanup function unmount போது மட்டும் அல்ல, dependencies மாறிய ஒவ்வொரு re-render-க்கும் முன்பும் run ஆகும். மேலும் development-இல், component mount ஆன உடனே React [setup+cleanup-ஐ கூடுதலாக ஒருமுறை run செய்கிறது.](#my-effect-runs-twice-when-the-component-mounts)

Corresponding setup code இல்லாமல் cleanup code இருந்தால், அது பொதுவாக code smell:

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

உங்கள் cleanup logic setup logic-க்கு "symmetrical" ஆக இருக்க வேண்டும்; setup செய்ததை stop அல்லது undo செய்ய வேண்டும்:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Effect lifecycle component lifecycle-இலிருந்து எப்படி வேறுபடுகிறது என்பதை அறிக.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### என் Effect visual ஏதாவது செய்கிறது; அது run ஆகும் முன் flicker தெரிகிறது {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

உங்கள் Effect browser [screen-ஐ paint செய்வதை](/learn/render-and-commit#epilogue-browser-paint) block செய்ய வேண்டும் என்றால், `useEffect`-ஐ [`useLayoutEffect`](/reference/react/useLayoutEffect)-ஆக மாற்றுங்கள். **பெரும்பாலான Effects-க்கு இது தேவையில்லை** என்பதை கவனிக்கவும். Browser paint-க்கு முன் உங்கள் Effect run ஆகுவது மிக முக்கியமானபோது மட்டும் இது தேவைப்படும்: உதாரணமாக, user பார்க்கும் முன் tooltip-ஐ measure செய்து position செய்ய.
