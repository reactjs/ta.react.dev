---
title: useRef
---

<Intro>

`useRef` என்பது rendering-க்கு தேவையில்லாத value ஒன்றை reference செய்ய உதவும் React Hook.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

[Ref](/learn/referencing-values-with-refs) ஒன்றை declare செய்ய, உங்கள் component-ன் top level-இல் `useRef` call செய்யவும்.

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `initialValue`: Ref object-ன் `current` property ஆரம்பத்தில் எப்படியிருக்க வேண்டும் என்று நீங்கள் விரும்பும் value. இது எந்த type value-யாகவும் இருக்கலாம். Initial render-க்கு பிறகு இந்த argument ignored செய்யப்படும்.

#### Returns {/*returns*/}

`useRef` ஒற்றை property கொண்ட object ஒன்றை return செய்கிறது:

* `current`: ஆரம்பத்தில், நீங்கள் pass செய்த `initialValue` ஆக set செய்யப்படும். பின்னர் அதை வேறு ஒன்றாக set செய்யலாம். Ref object-ஐ JSX node-க்கு `ref` attribute ஆக React-க்கு pass செய்தால், React அதன் `current` property-ஐ set செய்யும்.

அடுத்த renders-இல், `useRef` அதே object-ஐ return செய்யும்.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `ref.current` property-ஐ mutate செய்யலாம். State-க்கு மாறாக, இது mutable. ஆனால் அது rendering-க்கு பயன்படுத்தப்படும் object ஒன்றை வைத்திருந்தால் (உதாரணமாக, உங்கள் state-ன் ஒரு பகுதி), அந்த object-ஐ mutate செய்யக்கூடாது.
* `ref.current` property-ஐ மாற்றும்போது, React உங்கள் component-ஐ re-render செய்யாது. Ref என்பது plain JavaScript object என்பதால், அதை நீங்கள் எப்போது மாற்றுகிறீர்கள் என்பதை React அறியாது.
* [Initialization](#avoiding-recreating-the-ref-contents) தவிர, rendering போது `ref.current`-ஐ write _அல்லது read_ செய்ய வேண்டாம். இது உங்கள் component-ன் behavior-ஐ unpredictable ஆக்கும்.
* Strict Mode-இல், [accidental impurities கண்டுபிடிக்க உதவ](/reference/react/useState#my-initializer-or-updater-function-runs-twice) React **உங்கள் component function-ஐ இரண்டு முறை call செய்யும்**. இது development-only behavior; production-ஐ பாதிக்காது. ஒவ்வொரு ref object-உம் இரண்டு முறை உருவாக்கப்படும்; ஆனால் versions-இல் ஒன்று discard செய்யப்படும். உங்கள் component function pure ஆக இருந்தால் (அப்படியே இருக்க வேண்டும்), இது behavior-ஐ பாதிக்காது.

---

## பயன்பாடு {/*usage*/}

### Ref கொண்டு value ஒன்றை reference செய்தல் {/*referencing-a-value-with-a-ref*/}

ஒன்று அல்லது அதற்கு மேற்பட்ட [refs](/learn/referencing-values-with-refs)-ஐ declare செய்ய, உங்கள் component-ன் top level-இல் `useRef` call செய்யவும்.

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef`, நீங்கள் வழங்கிய <CodeStep step={3}>initial value</CodeStep>-க்கு முதலில் set செய்யப்பட்ட ஒற்றை <CodeStep step={2}>`current` property</CodeStep> கொண்ட <CodeStep step={1}>ref object</CodeStep>-ஐ return செய்கிறது.

அடுத்த renders-இல், `useRef` அதே object-ஐ return செய்யும். தகவலை store செய்து பின்னர் read செய்ய அதன் `current` property-ஐ மாற்றலாம். இது உங்களுக்கு [state](/reference/react/useState)-ஐ நினைவூட்டலாம்; ஆனால் ஒரு முக்கியமான வேறுபாடு உள்ளது.

**Ref மாற்றுவது re-render trigger செய்யாது.** இதன் பொருள், உங்கள் component-ன் visual output-ஐ பாதிக்காத தகவலை store செய்ய refs சிறந்தவை. உதாரணமாக, [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) ஒன்றை store செய்து பின்னர் retrieve செய்ய வேண்டுமானால், அதை ref-இல் வைக்கலாம். Ref-க்குள் value update செய்ய, அதன் <CodeStep step={2}>`current` property</CodeStep>-ஐ manually மாற்ற வேண்டும்:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

பின்னர், அந்த interval ID-ஐ ref-இலிருந்து read செய்து [அந்த interval-ஐ clear](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) செய்யலாம்:

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

Ref பயன்படுத்துவதன் மூலம், நீங்கள் உறுதிசெய்வது:

- Re-renders இடையே **தகவலை store செய்யலாம்** (ஒவ்வொரு render-க்கும் reset ஆகும் regular variables போல அல்ல).
- அதை மாற்றுவது **re-render trigger செய்யாது** (re-render trigger செய்யும் state variables போல அல்ல).
- **தகவல் உங்கள் component-ன் ஒவ்வொரு copy-க்கும் local** ஆக இருக்கும் (shared ஆக இருக்கும் வெளியுள்ள variables போல அல்ல).

Ref மாற்றுவது re-render trigger செய்யாது; ஆகவே screen-இல் display செய்ய வேண்டிய தகவலை store செய்ய refs பொருத்தமானவை அல்ல. அதற்கு பதிலாக state பயன்படுத்தவும். [`useRef` மற்றும் `useState` இடையே தேர்வு செய்வது](/learn/referencing-values-with-refs#differences-between-refs-and-state) பற்றி மேலும் படிக்கவும்.

<Recipes titleText="useRef கொண்டு value ஒன்றை reference செய்யும் examples" titleId="examples-value">

#### Click counter {/*click-counter*/}

இந்த component, button எத்தனை முறை clicked ஆனது என்பதை track செய்ய ref பயன்படுத்துகிறது. இங்கே state-க்கு பதிலாக ref பயன்படுத்துவது சரி; ஏனெனில் click count event handler-இல் மட்டுமே read மற்றும் write செய்யப்படுகிறது.

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

JSX-இல் `{ref.current}` காட்டினால், click செய்தபோது number update ஆகாது. ஏனெனில் `ref.current` set செய்வது re-render trigger செய்யாது. Rendering-க்கு பயன்படுத்தப்படும் தகவல் state ஆக இருக்க வேண்டும்.

<Solution />

#### Stopwatch {/*a-stopwatch*/}

இந்த example state மற்றும் refs சேர்த்து பயன்படுத்துகிறது. `startTime` மற்றும் `now` இரண்டும் rendering-க்கு பயன்படுத்தப்படுவதால் state variables. ஆனால் button அழுத்தும்போது interval stop செய்ய [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) ஒன்றையும் hold செய்ய வேண்டும். Interval ID rendering-க்கு பயன்படுத்தப்படாததால், அதை ref-இல் வைத்திருந்து manually update செய்வது பொருத்தமானது.

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

<Solution />

</Recipes>

<Pitfall>

**Rendering போது `ref.current`-ஐ write _அல்லது read_ செய்ய வேண்டாம்.**

உங்கள் component-ன் body [pure function போல நடக்கிறது](/learn/keeping-components-pure) என்று React எதிர்பார்க்கிறது:

- Inputs ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), மற்றும் [context](/learn/passing-data-deeply-with-context)) அதே இருந்தால், அது துல்லியமாக அதே JSX return செய்ய வேண்டும்.
- வேறு order-இல் அல்லது வேறு arguments உடன் call செய்வது மற்ற calls-ன் results-ஐ பாதிக்கக்கூடாது.

Ref-ஐ **rendering போது** read அல்லது write செய்வது இந்த expectations-ஐ உடைக்கும்.

```js {expectedErrors: {'react-compiler': [4]}} {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

அதற்கு பதிலாக event handlers அல்லது effects-இலிருந்து refs read அல்லது write செய்யலாம்.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

Rendering போது ஏதாவது read [அல்லது write](/reference/react/useState#storing-information-from-previous-renders) செய்ய *வேண்டியிருந்தால்*, அதற்கு பதிலாக [state பயன்படுத்தவும்](/reference/react/useState).

இந்த rules-ஐ உடைத்தால், உங்கள் component இன்னும் வேலை செய்யலாம்; ஆனால் React-இல் நாங்கள் சேர்க்கும் புதிய features பலவும் இந்த expectations-ஐ சார்ந்திருக்கும். [உங்கள் components pure ஆக வைத்திருப்பது](/learn/keeping-components-pure#where-you-_can_-cause-side-effects) பற்றி மேலும் படிக்கவும்.

</Pitfall>

---

### Ref கொண்டு DOM-ஐ manipulate செய்தல் {/*manipulating-the-dom-with-a-ref*/}

[DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API)-ஐ manipulate செய்ய ref பயன்படுத்துவது மிகவும் பொதுவானது. இதற்கு React built-in support கொண்டுள்ளது.

முதலில், `null` என்ற <CodeStep step={3}>initial value</CodeStep> உடன் <CodeStep step={1}>ref object</CodeStep> declare செய்யவும்:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

பிறகு, manipulate செய்ய விரும்பும் DOM node-ன் JSX-க்கு உங்கள் ref object-ஐ `ref` attribute ஆக pass செய்யவும்:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

React DOM node-ஐ உருவாக்கி screen-இல் வைத்த பிறகு, உங்கள் ref object-ன் <CodeStep step={2}>`current` property</CodeStep>-ஐ அந்த DOM node ஆக set செய்யும். இப்போது `<input>`-ன் DOM node-ஐ access செய்து [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) போன்ற methods call செய்யலாம்:

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

Node screen-இலிருந்து அகற்றப்படும்போது, React `current` property-ஐ மீண்டும் `null` ஆக set செய்யும்.

[Refs கொண்டு DOM-ஐ manipulate செய்தல்](/learn/manipulating-the-dom-with-refs) பற்றி மேலும் படிக்கவும்.

<Recipes titleText="useRef கொண்டு DOM-ஐ manipulate செய்யும் examples" titleId="examples-dom">

#### Text input-க்கு focus செய்தல் {/*focusing-a-text-input*/}

இந்த example-இல், button click செய்தால் input focus ஆகும்:

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
        Input-க்கு focus செய்
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Image-ஐ view-க்குள் scroll செய்தல் {/*scrolling-an-image-into-view*/}

இந்த example-இல், button click செய்தால் image view-க்குள் scroll ஆகும். இது list DOM node-க்கு ref பயன்படுத்தி, பின்னர் scroll செய்ய வேண்டிய image-ஐ கண்டுபிடிக்க DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API call செய்கிறது.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Neo
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Millie
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Bella
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### Video play மற்றும் pause செய்தல் {/*playing-and-pausing-a-video*/}

இந்த example `<video>` DOM node மீது [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) மற்றும் [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) call செய்ய ref பயன்படுத்துகிறது.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### உங்கள் சொந்த component-க்கு ref expose செய்தல் {/*exposing-a-ref-to-your-own-component*/}

சில நேரங்களில் parent component, உங்கள் component-க்குள் உள்ள DOM-ஐ manipulate செய்ய அனுமதிக்க விரும்பலாம். உதாரணமாக, நீங்கள் `MyInput` component எழுதுகிறீர்கள்; ஆனால் parent input-க்கு focus செய்ய முடிந்திருக்க வேண்டும் (parent-க்கு அதற்கு access இல்லை). Parent-இல் `ref` உருவாக்கி, அந்த `ref`-ஐ child component-க்கு prop ஆக pass செய்யலாம். விரிவான walkthrough-ஐ [இங்கே](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) படிக்கவும்.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Input-க்கு focus செய்
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Ref contents மீண்டும் உருவாகாமல் தவிர்த்தல் {/*avoiding-recreating-the-ref-contents*/}

React initial ref value-ஐ ஒருமுறை save செய்து, அடுத்த renders-இல் அதை ignore செய்கிறது.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()`-ன் result initial render-க்கு மட்டுமே பயன்படுத்தப்பட்டாலும், நீங்கள் இந்த function-ஐ ஒவ்வொரு render-க்கும் call செய்து கொண்டிருக்கிறீர்கள். இது expensive objects உருவாக்கினால் wasteful ஆகலாம்.

இதைக் தீர்க்க, ref-ஐ அதற்கு பதிலாக இவ்வாறு initialize செய்யலாம்:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

சாதாரணமாக, render போது `ref.current` write அல்லது read செய்வது அனுமதிக்கப்படாது. ஆனால் இந்த case-இல் result எப்போதும் அதே; condition initialization போது மட்டுமே execute ஆகிறது, ஆகவே இது முழுமையாக predictable.

<DeepDive>

#### useRef-ஐ பின்னர் initialize செய்யும்போது null checks தவிர்ப்பது எப்படி {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

Type checker பயன்படுத்தி, எப்போதும் `null` check செய்ய விரும்பவில்லை என்றால், இதுபோன்ற pattern ஒன்றை முயற்சிக்கலாம்:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

இங்கே, `playerRef` தானே nullable. ஆனால் `getPlayer()` `null` return செய்யும் case இல்லை என்பதை உங்கள் type checker-ஐ நம்ப வைக்க முடியும். பின்னர் உங்கள் event handlers-இல் `getPlayer()` பயன்படுத்தவும்.

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### Custom component-க்கு ref பெற முடியவில்லை {/*i-cant-get-a-ref-to-a-custom-component*/}

உங்கள் சொந்த component-க்கு இதுபோல் `ref` pass செய்ய முயன்றால்:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

Console-இல் error கிடைக்கலாம்:

<ConsoleBlock level="error">

TypeError: Cannot read properties of null

</ConsoleBlock>

Default ஆக, உங்கள் சொந்த components அவற்றுக்குள் உள்ள DOM nodes-க்கு refs expose செய்யாது.

இதைக் சரிசெய்ய, ref பெற விரும்பும் component-ஐ கண்டுபிடிக்கவும்:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

பின்னர் உங்கள் component ஏற்கும் props list-இல் `ref` சேர்த்து, தொடர்புடைய child [built-in component](/reference/react-dom/components/common)-க்கு `ref`-ஐ prop ஆக pass செய்யவும்:

```js {1,6}
function MyInput({ value, onChange, ref }) {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
};

export default MyInput;
```

பின்னர் parent component அதற்கான ref-ஐ பெற முடியும்.

[மற்றொரு component-ன் DOM nodes-ஐ access செய்வது](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) பற்றி மேலும் படிக்கவும்.
