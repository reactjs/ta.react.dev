---
title: createRef
---

<Pitfall>

`createRef` பெரும்பாலும் [class components](/reference/react/Component)-க்குப் பயன்படுத்தப்படுகிறது. Function components பொதுவாக அதன் பதிலாக [`useRef`](/reference/react/useRef)-ஐ நம்புகின்றன.

</Pitfall>

<Intro>

`createRef` எந்த value-யையும் கொண்டிருக்கக்கூடிய [ref](/learn/referencing-values-with-refs) object-ஐ உருவாக்குகிறது.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `createRef()` {/*createref*/}

[Class component](/reference/react/Component)-க்குள் [ref](/learn/referencing-values-with-refs) declare செய்ய `createRef`-ஐ call செய்யுங்கள்.

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

`createRef` parameters எதையும் ஏற்காது.

#### Returns {/*returns*/}

`createRef` ஒரு property கொண்ட object-ஐ return செய்கிறது:

* `current`: ஆரம்பத்தில் இது `null` ஆக set செய்யப்படும். பின்னர் அதை வேறு ஒன்றாக set செய்யலாம். Ref object-ஐ React-க்கு JSX node-ன் `ref` attribute ஆக pass செய்தால், React அதன் `current` property-ஐ set செய்யும்.

#### Caveats {/*caveats*/}

* `createRef` எப்போதும் *வேறுபட்ட* object-ஐ return செய்கிறது. நீங்கள் நேரடியாக `{ current: null }` எழுதுவது போன்றதே இது.
* Function component-இல், எப்போதும் அதே object-ஐ return செய்யும் [`useRef`](/reference/react/useRef)-ஐயே நீங்கள் பெரும்பாலும் விரும்புவீர்கள்.
* `const ref = useRef()` என்பது `const [ref, _] = useState(() => createRef(null))` என்பதற்கு equivalent.

---

## பயன்பாடு {/*usage*/}

### Class component-இல் ref declare செய்தல் {/*declaring-a-ref-in-a-class-component*/}

[Class component](/reference/react/Component)-க்குள் ref declare செய்ய, `createRef`-ஐ call செய்து அதன் result-ஐ class field-க்கு assign செய்யுங்கள்:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

இப்போது உங்கள் JSX-இல் உள்ள `<input>`-க்கு `ref={this.inputRef}` pass செய்தால், React `this.inputRef.current`-ஐ input DOM node-ஆல் populate செய்யும். உதாரணமாக, input-ஐ focus செய்யும் button-ஐ இவ்வாறு உருவாக்கலாம்:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` பெரும்பாலும் [class components](/reference/react/Component)-க்குப் பயன்படுத்தப்படுகிறது. Function components பொதுவாக அதன் பதிலாக [`useRef`](/reference/react/useRef)-ஐ நம்புகின்றன.

</Pitfall>

---

## மாற்று வழிகள் {/*alternatives*/}

### `createRef` பயன்படுத்தும் class-இலிருந்து `useRef` பயன்படுத்தும் function-க்கு migrate செய்தல் {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

புதிய code-இல் [class components](/reference/react/Component)-க்கு பதிலாக function components பயன்படுத்த பரிந்துரைக்கிறோம். `createRef` பயன்படுத்தும் existing class components உங்களிடம் இருந்தால், அவற்றை இவ்வாறு convert செய்யலாம். இது original code:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

இந்த component-ஐ [class-இலிருந்து function-க்கு convert செய்யும்போது](/reference/react/Component#alternatives), `createRef` calls-ஐ [`useRef`](/reference/react/useRef) calls-ஆக மாற்றுங்கள்:

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
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>
