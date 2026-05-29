---
title: 'Refs கொண்டு Values-ஐ Reference செய்தல்'
---

<Intro>

ஒரு component சில information-ஐ "remember" செய்ய வேண்டும், ஆனால் அந்த information [புதிய renders trigger செய்ய](/learn/render-and-commit) வேண்டாம் என்றால், நீங்கள் *ref* பயன்படுத்தலாம்.

</Intro>

<YouWillLearn>

- உங்கள் component-க்கு ref சேர்ப்பது எப்படி
- Ref-ன் value update செய்வது எப்படி
- Refs state-இலிருந்து எப்படி வேறுபடுகின்றன
- Refs-ஐ பாதுகாப்பாக பயன்படுத்துவது எப்படி

</YouWillLearn>

## உங்கள் component-க்கு ref சேர்த்தல் {/*adding-a-ref-to-your-component*/}

React-இலிருந்து `useRef` Hook import செய்து உங்கள் component-க்கு ref சேர்க்கலாம்:

```js
import { useRef } from 'react';
```

உங்கள் component-க்குள், `useRef` Hook call செய்து, reference செய்ய விரும்பும் initial value-ஐ ஒரே argument ஆக pass செய்யவும். உதாரணமாக, `0` value-க்கான ref இதோ:

```js
const ref = useRef(0);
```

`useRef` இதுபோன்ற object ஒன்றை return செய்கிறது:

```js
{
  current: 0 // useRef-க்கு நீங்கள் pass செய்த value
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="'current' என்று எழுதப்பட்ட ஒரு arrow, 'ref' என்று எழுதப்பட்ட pocket-க்குள் வைக்கப்பட்டுள்ளது." />

அந்த ref-ன் தற்போதைய value-ஐ `ref.current` property மூலம் access செய்யலாம். இந்த value திட்டமிட்டு mutable; அதாவது அதை read செய்யவும் write செய்யவும் முடியும். இது React track செய்யாத உங்கள் component-ன் ரகசிய pocket போல. (இதுவே React-ன் one-way data flow-இலிருந்து இதை "escape hatch" ஆக்குகிறது; அதைப் பற்றி கீழே மேலும் பார்க்கலாம்!)

இங்கே, ஒவ்வொரு click-க்கும் button `ref.current`-ஐ increment செய்யும்:

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

Ref ஒரு number-ஐ point செய்கிறது; ஆனால் [state](/learn/state-a-components-memory) போல, அது எதையும் point செய்யலாம்: string, object, அல்லது function கூட. State-க்கு மாறாக, ref என்பது read மற்றும் modify செய்யக்கூடிய `current` property கொண்ட plain JavaScript object.

**ஒவ்வொரு increment-க்கும் component re-render ஆகாது** என்பதை கவனிக்கவும். State போலவே, re-renders இடையே refs React மூலம் retained ஆகின்றன. ஆனால் state set செய்வது component-ஐ re-render செய்யும். Ref மாற்றுவது அப்படி செய்யாது!

## Example: Stopwatch உருவாக்குதல் {/*example-building-a-stopwatch*/}

ஒரே component-இல் refs மற்றும் state-ஐ combine செய்யலாம். உதாரணமாக, user button அழுத்தி start அல்லது stop செய்யக்கூடிய stopwatch உருவாக்கலாம். User "Start" அழுத்தியதிலிருந்து எவ்வளவு நேரம் கடந்துள்ளது என்பதை display செய்ய, Start button எப்போது அழுத்தப்பட்டது, current time என்ன என்பதை track செய்ய வேண்டும். **இந்த information rendering-க்கு பயன்படுத்தப்படுகிறது, ஆகவே அதை state-இல் வைத்திருப்பீர்கள்:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

User "Start" அழுத்தும்போது, ஒவ்வொரு 10 milliseconds-க்கும் time update செய்ய [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) பயன்படுத்துவீர்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>கடந்த நேரம்: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        தொடங்கு
      </button>
    </>
  );
}
```

</Sandpack>

"Stop" button அழுத்தும்போது, `now` state variable update ஆகுவதை நிறுத்த existing interval-ஐ cancel செய்ய வேண்டும். [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) call செய்து இதைச் செய்யலாம்; ஆனால் user Start அழுத்தியபோது `setInterval` call முன்பு return செய்த interval ID அதற்கு தேவை. அந்த interval ID-ஐ எங்காவது வைத்திருக்க வேண்டும். **Interval ID rendering-க்கு பயன்படுத்தப்படாததால், அதை ref-இல் வைத்திருக்கலாம்:**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>கடந்த நேரம்: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        தொடங்கு
      </button>
      <button onClick={handleStop}>
        நிறுத்து
      </button>
    </>
  );
}
```

</Sandpack>

ஒரு information rendering-க்கு பயன்படுத்தப்பட்டால், அதை state-இல் வைத்திருங்கள். Information event handlers-க்கு மட்டும் தேவைப்பட்டு, அதை மாற்றுவது re-render தேவைப்படாதபோது, ref பயன்படுத்துவது அதிக efficient ஆக இருக்கலாம்.

## Refs மற்றும் state இடையிலான வேறுபாடுகள் {/*differences-between-refs-and-state*/}

Refs state-ஐ விட குறைவான "strict" போல தோன்றலாம்; உதாரணமாக, state setting function எப்போதும் பயன்படுத்த வேண்டியதற்கு பதிலாக அவற்றை mutate செய்யலாம் என்று நீங்கள் நினைக்கலாம். ஆனால் பெரும்பாலான cases-இல், state பயன்படுத்த விரும்புவீர்கள். Refs என்பது அடிக்கடி தேவையில்லாத "escape hatch". State மற்றும் refs இவ்வாறு ஒப்பிடப்படுகின்றன:

| refs | state |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` `{ current: initialValue }` return செய்கிறது | `useState(initialValue)` state variable-ன் current value மற்றும் state setter function (`[value, setValue]`) return செய்கிறது |
| அதை மாற்றும்போது re-render trigger செய்யாது. | அதை மாற்றும்போது re-render trigger செய்கிறது. |
| Mutable - rendering process-க்கு வெளியே `current`-ன் value-ஐ modify மற்றும் update செய்யலாம். | "Immutable" - re-render queue செய்ய state variables modify செய்ய state setting function பயன்படுத்த வேண்டும். |
| Rendering போது `current` value-ஐ read (அல்லது write) செய்யக்கூடாது. | State-ஐ எந்த நேரத்திலும் read செய்யலாம். ஆனால் ஒவ்வொரு render-க்கும் state-ன் தனிப்பட்ட [snapshot](/learn/state-as-a-snapshot) உள்ளது; அது மாறாது. |

State கொண்டு implement செய்யப்பட்ட counter button இதோ:

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
      நீங்கள் {count} முறை click செய்தீர்கள்
    </button>
  );
}
```

</Sandpack>

`count` value displayed ஆக இருப்பதால், அதற்காக state value பயன்படுத்துவது அர்த்தமுள்ளது. Counter-ன் value `setCount()` மூலம் set செய்யும்போது, React component-ஐ re-render செய்து, screen புதிய count-ஐ பிரதிபலிக்க update ஆகும்.

இதை ref கொண்டு implement செய்ய முயன்றால், React component-ஐ ஒருபோதும் re-render செய்யாது; ஆகவே count மாறுவது நீங்கள் பார்க்க மாட்டீர்கள்! இந்த button click செய்தால் **அதன் text update ஆகாது** என்பதை பாருங்கள்:

<Sandpack>

```js {expectedErrors: {'react-compiler': [13]}}
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      நீங்கள் {countRef.current} முறை click செய்தீர்கள்
    </button>
  );
}
```

</Sandpack>

அதனால் தான் render போது `ref.current` read செய்வது unreliable code-க்கு வழிவகுக்கும். அது தேவைப்பட்டால், அதற்கு பதிலாக state பயன்படுத்தவும்.

<DeepDive>

#### useRef உள்ளே எப்படி வேலை செய்கிறது? {/*how-does-use-ref-work-inside*/}

`useState` மற்றும் `useRef` இரண்டும் React வழங்கினாலும், principle-ஆக `useRef`-ஐ `useState`-ன் _மேல்_ implement செய்யலாம். React-க்குள் `useRef` இவ்வாறு implement செய்யப்பட்டிருக்கலாம் என்று கற்பனை செய்யலாம்:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

முதல் render போது, `useRef` `{ current: initialValue }` return செய்கிறது. இந்த object React-ஆல் stored ஆகிறது; ஆகவே அடுத்த render போது அதே object return செய்யப்படும். இந்த example-இல் state setter unused என்பதை கவனிக்கவும். `useRef` எப்போதும் அதே object return செய்ய வேண்டியதால் அது தேவையில்லை!

Practice-இல் இது போதுமான அளவு பொதுவானதால் React `useRef`-ன் built-in version வழங்குகிறது. ஆனால் setter இல்லாத regular state variable போல இதை நினைக்கலாம். Object-oriented programming உங்களுக்கு தெரிந்திருந்தால், refs instance fields-ஐ நினைவூட்டலாம்; ஆனால் `this.something`-க்கு பதிலாக `somethingRef.current` எழுதுகிறீர்கள்.

</DeepDive>

## Refs எப்போது பயன்படுத்த வேண்டும் {/*when-to-use-refs*/}

பொதுவாக, உங்கள் component React-க்கு வெளியே "step outside" செய்து external APIs-உடன் தொடர்புகொள்ள வேண்டியபோது ref பயன்படுத்துவீர்கள்; பெரும்பாலும் அது component-ன் appearance-ஐ பாதிக்காத browser API ஆக இருக்கும். இத்தகைய அரிதான சூழல்களில் சில:

- [Timeout IDs](https://developer.mozilla.org/docs/Web/API/setTimeout) store செய்தல்
- [DOM elements](https://developer.mozilla.org/docs/Web/API/Element) store மற்றும் manipulate செய்தல்; இதை [அடுத்த page](/learn/manipulating-the-dom-with-refs)-இல் பார்க்கிறோம்
- JSX கணக்கிட அவசியமில்லாத பிற objects store செய்தல்.

உங்கள் component ஏதாவது value store செய்ய வேண்டும், ஆனால் அது rendering logic-ஐ பாதிக்கவில்லை என்றால், refs தேர்வு செய்யவும்.

## Refs-க்கான best practices {/*best-practices-for-refs*/}

இந்த principles-ஐப் பின்பற்றுவது உங்கள் components-ஐ மேலும் predictable ஆக்கும்:

- **Refs-ஐ escape hatch ஆக நடத்துங்கள்.** External systems அல்லது browser APIs உடன் வேலை செய்யும்போது refs பயனுள்ளதாக இருக்கும். உங்கள் application logic மற்றும் data flow-ன் பெரும்பகுதி refs-ஐ சார்ந்திருந்தால், உங்கள் அணுகுமுறையை மறுபரிசீலனை செய்யலாம்.
- **Rendering போது `ref.current`-ஐ read அல்லது write செய்ய வேண்டாம்.** Rendering போது சில information தேவைப்பட்டால், அதற்கு பதிலாக [state](/learn/state-a-components-memory) பயன்படுத்தவும். `ref.current` எப்போது மாறுகிறது என்பதை React அறியாததால், rendering போது அதை read செய்வதற்கே உங்கள் component-ன் behavior predict செய்ய கடினமாகும். (இதற்கான ஒரே விதிவிலக்கு, முதல் render போது ref-ஐ ஒருமுறை மட்டுமே set செய்யும் `if (!ref.current) ref.current = new Thing()` போன்ற code.)

React state-ன் limitations refs-க்கு பொருந்தாது. உதாரணமாக, state ஒவ்வொரு render-க்கும் [snapshot போல](/learn/state-as-a-snapshot) நடந்து, [synchronously update ஆகாது](/learn/queueing-a-series-of-state-updates). ஆனால் ref-ன் current value-ஐ mutate செய்தால், அது உடனே மாறும்:

```js
ref.current = 5;
console.log(ref.current); // 5
```

இதற்குக் காரணம் **ref தானே regular JavaScript object**; ஆகவே அது அப்படியே நடக்கிறது.

Ref உடன் வேலை செய்யும்போது [mutation தவிர்ப்பது](/learn/updating-objects-in-state) பற்றியும் கவலைப்பட தேவையில்லை. நீங்கள் mutate செய்யும் object rendering-க்கு பயன்படுத்தப்படாதவரை, ref அல்லது அதன் contents-ஐ நீங்கள் என்ன செய்கிறீர்கள் என்பது React-க்கு பொருட்டல்ல.

## Refs மற்றும் DOM {/*refs-and-the-dom*/}

Ref எந்த value-யையும் point செய்யலாம். ஆனால் ref-ன் மிகவும் பொதுவான use case DOM element access செய்வது. உதாரணமாக, input-க்கு programmatically focus செய்ய விரும்பினால் இது உதவும். JSX-இல் `<div ref={myRef}>` போல `ref` attribute-க்கு ref pass செய்தால், React தொடர்புடைய DOM element-ஐ `myRef.current`-க்குள் வைக்கும். Element DOM-இலிருந்து அகற்றப்பட்டதும், React `myRef.current`-ஐ `null` ஆக update செய்யும். இதைப் பற்றி [Refs கொண்டு DOM-ஐ Manipulate செய்தல்](/learn/manipulating-the-dom-with-refs)-இல் மேலும் படிக்கலாம்.

<Recap>

- Rendering-க்கு பயன்படுத்தப்படாத values-ஐ வைத்திருக்க refs ஒரு escape hatch. அவை அடிக்கடி தேவையில்லை.
- Ref என்பது `current` என்ற ஒற்றை property கொண்ட plain JavaScript object; அதை read அல்லது set செய்யலாம்.
- `useRef` Hook call செய்வதன் மூலம் React-இடமிருந்து ref கேட்கலாம்.
- State போலவே, refs component re-renders இடையே information retain செய்ய உதவும்.
- State-க்கு மாறாக, ref-ன் `current` value set செய்வது re-render trigger செய்யாது.
- Rendering போது `ref.current` read அல்லது write செய்ய வேண்டாம். இது உங்கள் component predict செய்ய கடினமாக்கும்.

</Recap>



<Challenges>

#### உடைந்த chat input-ஐ சரிசெய்யுங்கள் {/*fix-a-broken-chat-input*/}

Message type செய்து "Send" click செய்யுங்கள். "Sent!" alert காண்பதற்கு முன் மூன்று second delay இருப்பதை கவனிப்பீர்கள். இந்த delay-இல், "Undo" button காணலாம். அதை click செய்யுங்கள். இந்த "Undo" button "Sent!" message தோன்றுவதை நிறுத்த வேண்டும். `handleSend` போது save செய்யப்பட்ட timeout ID-க்காக [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) call செய்வதன் மூலம் இது செய்கிறது. ஆனால் "Undo" click செய்த பிறகும், "Sent!" message இன்னும் தோன்றுகிறது. ஏன் அது வேலை செய்யவில்லை என்பதை கண்டுபிடித்து, சரிசெய்யுங்கள்.

<Hint>

`let timeoutID` போன்ற regular variables re-renders இடையே "survive" செய்யாது; ஏனெனில் ஒவ்வொரு render-மும் உங்கள் component-ஐ scratch-இலிருந்து run செய்து அதன் variables initialize செய்கிறது. Timeout ID-ஐ வேறு எங்காவது வைத்திருக்க வேண்டுமா?

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('அனுப்பப்பட்டது!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'அனுப்புகிறது...' : 'அனுப்பு'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          திரும்பப் பெறு
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

உங்கள் component re-render ஆகும் ஒவ்வொரு முறையும் (state set செய்யும்போது போன்றது), எல்லா local variables-உம் scratch-இலிருந்து initialize செய்யப்படும். அதனால் தான் `timeoutID` போன்ற local variable-இல் timeout ID save செய்து, future-இல் மற்றொரு event handler அதை "see" செய்யும் என்று எதிர்பார்க்க முடியாது. அதற்கு பதிலாக, renders இடையே React preserve செய்யும் ref-இல் அதை store செய்யவும்.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('அனுப்பப்பட்டது!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'அனுப்புகிறது...' : 'அனுப்பு'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          திரும்பப் பெறு
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### Re-render ஆகத் தவறும் component-ஐ சரிசெய்யுங்கள் {/*fix-a-component-failing-to-re-render*/}

இந்த button "On" மற்றும் "Off" இடையே toggle செய்ய வேண்டும். ஆனால் அது எப்போதும் "Off" காட்டுகிறது. இந்த code-இல் என்ன தவறு? அதை சரிசெய்யுங்கள்.

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

இந்த example-இல், ref-ன் current value rendering output கணக்கிட பயன்படுத்தப்படுகிறது: `{isOnRef.current ? 'On' : 'Off'}`. இந்த information ref-இல் இருக்கக்கூடாது; state-இல் இருக்க வேண்டும் என்பதற்கான அறிகுறி இது. சரிசெய்ய, ref-ஐ remove செய்து state பயன்படுத்தவும்:

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Debouncing-ஐ சரிசெய்யுங்கள் {/*fix-debouncing*/}

இந்த example-இல், எல்லா button click handlers-மும் ["debounced"](https://kettanaito.com/blog/debounce-vs-throttle) செய்யப்பட்டுள்ளன. இதன் அர்த்தம் என்ன என்பதைப் பார்க்க, buttons-இல் ஒன்றை அழுத்துங்கள். Message ஒரு second பிறகு தோன்றுவதை கவனிக்கவும். Message காத்திருக்கும் போது button அழுத்தினால், timer reset ஆகும். அதனால் அதே button-ஐ வேகமாக பல முறை தொடர்ந்து click செய்தால், நீங்கள் click செய்வதை நிறுத்திய *பிறகு* ஒரு second வரை message தோன்றாது. Debouncing என்பது user "செய்வதை நிறுத்தும்" வரை சில action-ஐ delay செய்ய உதவுகிறது.

இந்த example வேலை செய்கிறது, ஆனால் intended போல அல்ல. Buttons independent அல்ல. பிரச்சினையைப் பார்க்க, ஒரு button click செய்து உடனே மற்றொரு button click செய்யுங்கள். Delay-க்கு பிறகு இரண்டு buttons-ன் messages-யும் காண்பீர்கள் என்று எதிர்பார்ப்பீர்கள். ஆனால் கடைசி button-ன் message மட்டும் தோன்றுகிறது. முதல் button-ன் message இழக்கப்படுகிறது.

Buttons ஒன்றுக்கொன்று ஏன் interfere செய்கின்றன? Issue-ஐ கண்டுபிடித்து சரிசெய்யுங்கள்.

<Hint>

கடைசி timeout ID variable அனைத்து `DebouncedButton` components இடையே shared ஆகிறது. அதனால் தான் ஒரு button click செய்வது மற்றொரு button-ன் timeout-ஐ reset செய்கிறது. ஒவ்வொரு button-க்கும் தனித்தனி timeout ID store செய்ய முடியுமா?

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Spaceship-ஐ launch செய்
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Soup-ஐ கொதிக்க விடு
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Lullaby பாடு
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutID` போன்ற variable எல்லா components இடேயும் shared ஆகும். அதனால் தான் இரண்டாவது button click செய்வது முதல் button-ன் pending timeout-ஐ reset செய்கிறது. இதைச் சரிசெய்ய, timeout-ஐ ref-இல் வைத்திருக்கலாம். ஒவ்வொரு button-க்கும் அதன் சொந்த ref கிடைக்கும்; ஆகவே அவை ஒன்றுக்கொன்று conflict செய்யாது. இரண்டு buttons-ஐ வேகமாக click செய்தாலும் இரண்டு messages-யும் காட்டப்படுவதை கவனிக்கவும்.

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Spaceship-ஐ launch செய்
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Soup-ஐ கொதிக்க விடு
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Lullaby பாடு
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### Latest state-ஐ படிக்கவும் {/*read-the-latest-state*/}

இந்த example-இல், "Send" அழுத்திய பிறகு message காட்டப்படுவதற்கு முன் சிறிய delay உள்ளது. "hello" type செய்து Send அழுத்தி, உடனே input-ஐ மீண்டும் edit செய்யுங்கள். உங்கள் edits இருந்தாலும், alert இன்னும் "hello" காட்டும் (அது button clicked ஆன [நேரத்தில்](/learn/state-as-a-snapshot#state-over-time) state-ன் value).

பொதுவாக, app-இல் இந்த behavior தான் நீங்கள் விரும்புவீர்கள். ஆனால் சில occasional cases-இல் asynchronous code ஏதாவது state-ன் *latest* version-ஐ read செய்ய வேண்டும் என்று விரும்பலாம். Click நேரத்தில் இருந்த text-க்கு பதிலாக *current* input text-ஐ alert காட்டச் செய்வதற்கான வழி நினைக்க முடியுமா?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('அனுப்புகிறது: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        அனுப்பு
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State [snapshot போல](/learn/state-as-a-snapshot) வேலை செய்கிறது; ஆகவே timeout போன்ற asynchronous operation-இலிருந்து latest state-ஐ read செய்ய முடியாது. ஆனால் latest input text-ஐ ref-இல் வைத்திருக்கலாம். Ref mutable; ஆகவே `current` property-ஐ எந்த நேரத்திலும் read செய்யலாம். Current text rendering-க்கும் பயன்படுத்தப்படுவதால், இந்த example-இல் உங்களுக்கு *இரண்டும்* தேவை: state variable (rendering-க்கு) மற்றும் ref (timeout-இல் read செய்ய). Current ref value-ஐ manually update செய்ய வேண்டும்.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('அனுப்புகிறது: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        அனுப்பு
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
