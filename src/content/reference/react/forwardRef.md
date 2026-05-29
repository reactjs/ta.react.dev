---
title: forwardRef
---

<Deprecated>

React 19-இல் `forwardRef` இனி அவசியமில்லை. அதற்கு பதிலாக `ref`-ஐ prop ஆக pass செய்யுங்கள்.

`forwardRef` எதிர்கால release-இல் deprecated ஆகும். [இங்கே](/blog/2024/04/25/react-19#ref-as-a-prop) மேலும் அறிக.

</Deprecated>

<Intro>

உங்கள் component parent component-க்கு [ref](/learn/manipulating-the-dom-with-refs) மூலம் DOM node expose செய்ய `forwardRef` உதவுகிறது.

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

உங்கள் component ref பெறவும் அதை child component-க்கு forward செய்யவும் `forwardRef()`-ஐ call செய்யுங்கள்:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `render`: உங்கள் component-க்கான render function. Parent-இலிருந்து உங்கள் component பெற்ற props மற்றும் `ref` உடன் React இந்த function-ஐ call செய்யும். நீங்கள் return செய்யும் JSX உங்கள் component-ன் output ஆக இருக்கும்.

#### Returns {/*returns*/}

`forwardRef` JSX-இல் render செய்யக்கூடிய React component-ஐ return செய்கிறது. Plain functions ஆக define செய்யப்பட்ட React components போல அல்லாமல், `forwardRef` return செய்யும் component `ref` prop-ஐயும் பெற முடியும்.

#### Caveats {/*caveats*/}

* Strict Mode-இல், [தற்செயலான impurities கண்டுபிடிக்க உதவ](/reference/react/useState#my-initializer-or-updater-function-runs-twice) React உங்கள் render function-ஐ **இரண்டு முறை call செய்யும்**. இது development-only behavior; production-ஐ பாதிக்காது. உங்கள் render function pure என்றால் (அப்படித்தான் இருக்க வேண்டும்), இது உங்கள் component-ன் logic-ஐ பாதிக்காது. Calls-இல் ஒன்றின் result புறக்கணிக்கப்படும்.


---

### `render` function {/*render-function*/}

`forwardRef` render function-ஐ argument ஆக ஏற்கிறது. React இந்த function-ஐ `props` மற்றும் `ref` உடன் call செய்யும்:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parameters {/*render-parameters*/}

* `props`: Parent component pass செய்த props.

* `ref`: Parent component pass செய்த `ref` attribute. `ref` object அல்லது function ஆக இருக்கலாம். Parent component ref pass செய்யவில்லை என்றால், அது `null` ஆக இருக்கும். நீங்கள் பெறும் `ref`-ஐ மற்றொரு component-க்கு pass செய்யவேண்டும், அல்லது [`useImperativeHandle`](/reference/react/useImperativeHandle)-க்கு pass செய்ய வேண்டும்.

#### Returns {/*render-returns*/}

`forwardRef` JSX-இல் render செய்யக்கூடிய React component-ஐ return செய்கிறது. Plain functions ஆக define செய்யப்பட்ட React components போல அல்லாமல், `forwardRef` return செய்யும் component `ref` prop-ஐ ஏற்க முடியும்.

---

## பயன்பாடு {/*usage*/}

### Parent component-க்கு DOM node expose செய்தல் {/*exposing-a-dom-node-to-the-parent-component*/}

Default-ஆக, ஒவ்வொரு component-ன் DOM nodes private. ஆனால் சில நேரங்களில் DOM node-ஐ parent-க்கு expose செய்வது பயனுள்ளதாக இருக்கும்; உதாரணமாக, அதை focus செய்ய அனுமதிக்க. இதற்கு opt in செய்ய, உங்கள் component definition-ஐ `forwardRef()`-க்குள் wrap செய்யுங்கள்:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Props-க்கு பிறகு இரண்டாவது argument ஆக <CodeStep step={1}>ref</CodeStep> பெறுவீர்கள். Expose செய்ய விரும்பும் DOM node-க்கு அதை pass செய்யுங்கள்:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

இதனால் parent `Form` component, `MyInput` expose செய்த <CodeStep step={2}>`<input>` DOM node</CodeStep>-ஐ access செய்ய முடியும்:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

இந்த `Form` component `MyInput`-க்கு [ref pass செய்கிறது](/reference/react/useRef#manipulating-the-dom-with-a-ref). `MyInput` component அந்த ref-ஐ `<input>` browser tag-க்கு *forward* செய்கிறது. அதன் விளைவாக, `Form` component அந்த `<input>` DOM node-ஐ access செய்து அதில் [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) call செய்ய முடியும்.

உங்கள் component-க்குள் உள்ள DOM node-க்கு ref expose செய்வது, பின்னர் component internals மாற்றுவதைக் கடினமாக்கும் என்பதை நினைவில் கொள்ளுங்கள். பொதுவாக buttons அல்லது text inputs போன்ற reusable low-level components-இலிருந்து DOM nodes expose செய்வீர்கள்; avatar அல்லது comment போன்ற application-level components-க்கு இதைச் செய்யமாட்டீர்கள்.

<Recipes titleText="Ref forward செய்வதற்கான உதாரணங்கள்">

#### Text input-ஐ focus செய்தல் {/*focusing-a-text-input*/}

Button click செய்தால் input focus ஆகும். `Form` component ref define செய்து அதை `MyInput` component-க்கு pass செய்கிறது. `MyInput` component அந்த ref-ஐ browser `<input>`-க்கு forward செய்கிறது. இதனால் `Form` component `<input>`-ஐ focus செய்ய முடியும்.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Video play மற்றும் pause செய்தல் {/*playing-and-pausing-a-video*/}

Button click செய்தால் `<video>` DOM node-இல் [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) மற்றும் [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) call செய்யப்படும். `App` component ref define செய்து அதை `MyVideoPlayer` component-க்கு pass செய்கிறது. `MyVideoPlayer` component அந்த ref-ஐ browser `<video>` node-க்கு forward செய்கிறது. இதனால் `App` component `<video>`-ஐ play மற்றும் pause செய்ய முடியும்.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### பல components வழியாக ref forward செய்தல் {/*forwarding-a-ref-through-multiple-components*/}

`ref`-ஐ DOM node-க்கு forward செய்வதற்கு பதிலாக, `MyInput` போன்ற உங்கள் சொந்த component-க்கு forward செய்யலாம்:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

அந்த `MyInput` component ref-ஐ அதன் `<input>`-க்கு forward செய்தால், `FormField`-க்கு கொடுக்கப்படும் ref அந்த `<input>`-ஐ தரும்:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` component ref define செய்து அதை `FormField`-க்கு pass செய்கிறது. `FormField` component அந்த ref-ஐ `MyInput`-க்கு forward செய்கிறது; `MyInput` அதை browser `<input>` DOM node-க்கு forward செய்கிறது. இதுவே `Form` அந்த DOM node-ஐ access செய்வது.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### DOM node-க்கு பதிலாக imperative handle expose செய்தல் {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

முழு DOM node-ஐ expose செய்வதற்கு பதிலாக, குறுகிய methods தொகுப்புடன் *imperative handle* என்று அழைக்கப்படும் custom object-ஐ expose செய்யலாம். இதை செய்ய, DOM node-ஐ hold செய்ய தனி ref define செய்ய வேண்டும்:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

நீங்கள் பெற்ற `ref`-ஐ [`useImperativeHandle`](/reference/react/useImperativeHandle)-க்கு pass செய்து, `ref`-க்கு expose செய்ய வேண்டிய value-ஐ குறிப்பிடுங்கள்:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

ஏதாவது component `MyInput`-க்கு ref பெற்றால், DOM node-க்கு பதிலாக உங்கள் `{ focus, scrollIntoView }` object மட்டும் பெறும். இதனால் உங்கள் DOM node பற்றிய நீங்கள் expose செய்யும் information-ஐ குறைந்தபட்சமாக கட்டுப்படுத்தலாம்.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Imperative handles பயன்படுத்துவது குறித்து மேலும் படிக்கவும்.](/reference/react/useImperativeHandle)

<Pitfall>

**Refs-ஐ அதிகமாகப் பயன்படுத்த வேண்டாம்.** Props ஆக வெளிப்படுத்த முடியாத *imperative* behaviors-க்காக மட்டுமே refs பயன்படுத்த வேண்டும்: உதாரணமாக, node-க்கு scroll செய்தல், node-ஐ focus செய்தல், animation trigger செய்தல், text select செய்தல், போன்றவை.

**ஏதாவது ஒன்றை prop ஆக வெளிப்படுத்த முடிந்தால், ref பயன்படுத்த வேண்டாம்.** உதாரணமாக, `Modal` component-இலிருந்து `{ open, close }` போன்ற imperative handle expose செய்வதற்கு பதிலாக, `<Modal isOpen={isOpen} />` போல `isOpen`-ஐ prop ஆக ஏற்குவது சிறந்தது. Props மூலம் imperative behaviors expose செய்ய [Effects](/learn/synchronizing-with-effects) உதவலாம்.

</Pitfall>

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### என் component `forwardRef`-இல் wrap செய்யப்பட்டுள்ளது, ஆனால் அதற்கான `ref` எப்போதும் `null` ஆக உள்ளது {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

பொதுவாக இதன் அர்த்தம்: நீங்கள் பெற்ற `ref`-ஐ உண்மையில் பயன்படுத்த மறந்துவிட்டீர்கள்.

உதாரணமாக, இந்த component தனது `ref` உடன் எதையும் செய்யவில்லை:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

இதைக் சரிசெய்ய, `ref`-ஐ DOM node-க்கோ அல்லது ref ஏற்கக்கூடிய மற்றொரு component-க்கோ கீழே pass செய்யுங்கள்:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

Logic-இன் சில பகுதி conditional என்றால், `MyInput`-க்கான `ref`-உம் `null` ஆக இருக்கலாம்:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput` `false` என்றால், ref எந்த node-க்கும் forward செய்யப்படாது; `MyInput`-க்கான ref empty ஆக இருக்கும். இந்த உதாரணத்தில் உள்ள `Panel` போல condition மற்றொரு component-க்குள் மறைந்திருந்தால், இதை தவறவிடுவது சாத்தியம்:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
