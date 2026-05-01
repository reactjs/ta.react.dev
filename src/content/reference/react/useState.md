---
title: useState
---

<Intro>

`useState` என்பது உங்கள் காம்போனென்டில் ஒரு [ஸ்டேட் வெரியபிளை](/learn/state-a-components-memory) சேர்க்க உதவும் ரியாக்ட் ஹூக்.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## குறிப்புகள் {/*reference*/}

### `useState(initialState)` {/*usestate*/}

உங்கள் காம்போனென்ட்டின் மேல் மட்டத்தில் `useState` ஐ அழைத்து ஒரு [ஸ்டேட் வெரியபிளை](/learn/state-a-components-memory) அறிவிக்கவும்.

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

ஸ்டேட் வெரியபிள்களுக்கு `[something, setSomething]` என்ற முறையில் [அரே டிஸ்ட்ரக்சரிங்](https://javascript.info/destructuring-assignment) பயன்படுத்தி பெயரிடுவது வழக்கம்.

[#usage பகுதியில் மேலும் உதாரணங்கள் உள்ளன.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `initialState`: ஆரம்பத்தில் ஸ்டேட் எந்த மதிப்பாக இருக்கவேண்டும் என்று நீங்கள் தருவது. இது எந்த வகை (type) மதிப்பும் ஆகலாம்; ஆனால் ஃபங்க்ஷன் (function) க்கு தனியான நடத்தை உண்டு. தொடக்க ரெண்டர் (initial render) ஆகியதும் இந்த ஆர்க்யூமென்ட் புறக்கணிக்கப்படும்.
  * நீங்கள் `initialState` ஆக ஒரு ஃபங்க்ஷனை அனுப்பினால், அது _இனிஷலைஸர் ஃபங்க்ஷன்_ ஆகக் கருதப்படும். அது பியூர் (pure) ஆக இருக்க வேண்டும், எந்த ஆர்க்யூமென்ட்களையும் எடுக்கக்கூடாது, மேலும் எந்த வகையினதும் மதிப்பை ரிட்டர்ன் செய்ய வேண்டும். காம்போனென்டை இனிஷலைஸ் செய்யும் போது ரியாக்ட் உங்கள் இனிஷலைஸர் ஃபங்க்ஷனை அழைத்து, அதன் ரிட்டர்ன் மதிப்பை ஆரம்ப ஸ்டேடாக சேமிக்கும். [கீழே ஒரு உதாரணம்.](#avoiding-recreating-the-initial-state)

#### திருப்பும் மதிப்புகள் {/*returns*/}

`useState` இரண்டு மதிப்புகள் கொண்ட ஒரு அரேவைத் திருப்பும்:

1. தற்போதைய ஸ்டேட். முதல் ரெண்டரில், இது நீங்கள் கொடுத்த `initialState` உடன் பொருந்தும்.
2. ஸ்டேட்டை மாற்றி மறுபடியும் ரெண்டர் நடைபெற [`set` ஃபங்க்ஷன்](#setstate).

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `useState` ஒரு ஹூக் என்பதால், அதை **உங்கள் காம்போனென்ட்டின் மேல் மட்டத்தில்** அல்லது உங்கள் சொந்த ஹூக்களில் மட்டுமே அழைக்க முடியும். லூப் அல்லது கண்டிஷன்களுக்குள் அழைக்க முடியாது. அப்படி தேவைப்பட்டால், புதிய காம்போனென்ட் ஒன்றை பிரித்து, அந்த ஸ்டேட்டை அதில் நகர்த்தவும்.
* ஸ்ட்ரிக்ட் மோடில் (Strict Mode), ரியாக்ட் **உங்கள் இனிஷலைஸர் ஃபங்க்ஷனை இருமுறை** அழைக்கும்; இது [தற்செயலான “இம்ப்யூரிட்டி”யை கண்டுபிடிக்க உதவ](#my-initializer-or-updater-function-runs-twice) செய்யப்படும். இது டெவலப்மெண்ட்-க்கு மட்டும்; புரொடக்ஷனில் பாதிப்பு இல்லை. உங்கள் இனிஷலைஸர் ஃபங்க்ஷன் பியூர் என்றால் (அப்படித்தான் இருக்க வேண்டும்), இதனால் நடத்தை பாதிக்கப்படாது. அழைப்புகளில் ஒன்றின் விளைவு புறக்கணிக்கப்படும்.

---

### `set` ஃபங்க்ஷன்கள், `setSomething(nextState)` போன்றவை {/*setstate*/}

`useState` திருப்பும் `set` ஃபங்க்ஷன், ஸ்டேட்டை மாற்றி மறுபடியும் ரெண்டரைத் தூண்டும். நீங்கள் அடுத்த ஸ்டேட்டை நேரடியாகவோ, அல்லது முந்தைய ஸ்டேட்டிலிருந்து அதை கணக்கிடும் ஒரு ஃபங்க்ஷனையோ அனுப்பலாம்:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### அளவுருக்கள் {/*setstate-parameters*/}

* `nextState`: ஸ்டேட் எதுவாக இருக்கவேண்டும் என்று நீங்கள் தரும் மதிப்பு. எந்த வகையும் ஆகலாம்; ஆனால் ஃபங்க்ஷன்களுக்கு தனியான நடத்து உண்டு.
  * நீங்கள் `nextState` ஆக ஒரு ஃபங்க்ஷனை அனுப்பினால், அது _அப்டேடர் ஃபங்க்ஷன்_ ஆகக் கருதப்படும். அது பியூர் ஆக இருக்க வேண்டும், ஒரே ஆர்க்யூமென்ட் ஆக பண்டிங் ஸ்டேட்டை (pending state) மட்டும் எடுக்க வேண்டும், மேலும் அடுத்த ஸ்டேட்டை ரிட்டர்ன் செய்ய வேண்டும். ரியாக்ட் உங்கள் அப்டேடரை க்யூவில் வைத்து, உங்கள் காம்போனென்ட்டை மறுபடியும் ரெண்டர் செய்யும். அடுத்த ரெண்டரில், க்யூவில் உள்ள எல்லா அப்டேடர்களையும் முந்தைய ஸ்டேட்டில் பயன்படுத்தி அடுத்த ஸ்டேட்டை கணக்கிடும். [கீழே உதாரணம்.](#updating-state-based-on-the-previous-state)

#### திருப்பும் மதிப்பு {/*setstate-returns*/}

`set` ஃபங்க்ஷன்களுக்கு ரிட்டர்ன் மதிப்பு இல்லை.

#### கவனிக்க வேண்டியவை {/*setstate-caveats*/}

* `set` ஃபங்க்ஷன் **அடுத்த ரெண்டருக்கான ஸ்டேட் வெரியபிளை மட்டுமே அப்டேட் செய்கிறது**. `set` ஐ அழைத்தவுடன் ஸ்டேட்டை வாசித்தால், [இன்னும் பழைய மதிப்பே கிடைக்கும்](#ive-updated-the-state-but-logging-gives-me-the-old-value) — அதாவது அழைப்புக்கு முன் திரையில் இருந்த மதிப்பு.

* நீங்கள் கொடுக்கும் புதிய மதிப்பு, தற்போதைய `state` உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ஒப்பீட்டின்படி முழுக் கூடுதல் (identical) என்றால், ரியாக்ட் **அந்த காம்போனென்ட் மற்றும் அதன் சைல்ட்களை ரெண்டர் செய்வதைத் தவிர்த்து விடும்.** இது ஒரு ஆப்டிமைசெஷன்.

* ரியாக்ட் [ஸ்டேட் அப்டேட்களை பேட்ச் செய்கிறது.](/learn/queueing-a-series-of-state-updates) அதாவது **அனைத்து இவென்ட் ஹாண்ட்லர்கள் முடிந்து** அவர்கள் `set` ஃபங்க்ஷன்களை அழைத்த பின் தான் திரையை அப்டேட் செய்யும். இதனால் ஒரு சிங்கிள் இவென்டில் பல ரெண்டர்களைத் தவிர்க்கலாம். அரிதாக, நீங்கள் திரையை உடனடியாக அப்டேட் செய்யத் திணிக்க வேண்டுமெனில் (உதாரணமாக DOM ஐ அணுக), [`flushSync`](/reference/react-dom/flushSync) பயன்படுத்தலாம்.

* `set` ஃபங்க்ஷனின் அடையாளம் (identity) ஸ்டேபிள். அதனால் அது Effect டெபெண்டென்ஸிகளில் பல நேரங்களில் விலக்கப்படும். அதை சேர்த்தாலும் Effect தேவையில்லாமல் ஃபயர் ஆகாது. லின்டர் ஏதேனும் டெபெண்டென்ஸியை பிழையில்லாமல் விட்டு விட அனுமதித்தால், அது பாதுகாப்பானதே. [Effect டெபெண்டென்ஸிகளை எவ்வாறு குறைப்பது என்பதைப் படிக்கவும்.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* ரெண்டர் ஆகும் நேரத்தில் `set` ஃபங்க்ஷனை அழைப்பது, தற்போதைய ரெண்டர் செய்யப்படும் காம்போனென்ட்டுக்கு மட்டும் அனுமதிக்கப்படுகிறது. ரியாக்ட் அந்த அவுட்புட்டை கழித்து, புதிய ஸ்டேட்டுடன் உடனே மீண்டும் ரெண்டர் செய்யும். இது அரிதாகவே தேவைப்படும்; இருந்தாலும் **முந்தைய ரெண்டர்களிலிருந்து தகவலை சேமிக்க** இதைப் பயன்படுத்தலாம். [கீழே உதாரணம்.](#storing-information-from-previous-renders)

* ஸ்ட்ரிக்ட் மோடில், ரியாக்ட் **உங்கள் அப்டேடர் ஃபங்க்ஷனை இருமுறை** அழைக்கும் — [தற்செயலான “இம்ப்யூரிட்டி”களை கண்டுபிடிக்க உதவ](#my-initializer-or-updater-function-runs-twice). இது டெவலப்மெண்டில் மட்டுமே நடக்கும்; புரொடக்ஷனில் பாதிப்பு இல்லை. உங்கள் அப்டேடர் பியூர் என்றால் நடத்தை பாதிக்காது. இரண்டு அழைப்புகளில் ஒன்றின் விளைவு புறக்கணிக்கப்படும்.

---

## பயன்பாடு {/*usage*/}

### ஒரு காம்போனென்டில் ஸ்டேட்டைச் சேர்ப்பது {/*adding-state-to-a-component*/}

ஒரு அல்லது அதற்கு மேற்பட்ட [ஸ்டேட் வெரியபிள்களை](/learn/state-a-components-memory) அறிவிக்க உங்கள் காம்போனென்ட்டின் மேல் மட்டத்தில் `useState` ஐ அழைக்கவும்.

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

ஸ்டேட் வெரியபிள்களுக்கு `[something, setSomething]` என்ற பெயரிடும் முறையை [அரே டிஸ்ட்ரக்சரிங்](https://javascript.info/destructuring-assignment) மூலம் பின்பற்றுவது வழக்கம்.

`useState` நிர்வகிக்கும் இந்த ஸ்டேட்டிற்கு இரண்டு பொருட்கள் கொண்ட அரே திரும்பும்:

1. இந்த ஸ்டேட் வெரியபிளின் <CodeStep step={1}>தற்போதைய ஸ்டேட்</CodeStep> — <CodeStep step={3}>ஆரம்ப ஸ்டேட்</CodeStep> மூலம் தொடங்கும்.
2. இடைமுக தொடர்புகளுக்குப் பதிலளிக்க அதை மாற்ற உதவும் <CodeStep step={2}>`set` ஃபங்க்ஷன்</CodeStep>.

திரையில் காண்பதை மாற்ற, `set` ஃபங்க்ஷனை அடுத்த ஸ்டேட்டுடன் அழைக்கவும்:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

ரியாக்ட் அடுத்த ஸ்டேட்டை சேமித்து, புதிய மதிப்புகளுடன் உங்கள் காம்போனென்ட்டை மீண்டும் ரெண்டர் செய்து UI-ஐ அப்டேட் செய்யும்.

<Pitfall>

`set` ஃபங்க்ஷனை அழைப்பது [ஏற்கனவே இயங்கிக் கொண்டிருக்கும் கோடில் இருக்கும் தற்போதைய ஸ்டேட்டை **மாற்றாது**](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

இந்த மாற்றம் *அடுத்த* ரெண்டர் முதல் `useState` திருப்பும் மதிப்பில் மட்டுமே பிரதிபலிக்கும்.

</Pitfall>

<Recipes titleText="அடிப்படை useState உதாரணங்கள்" titleId="examples-basic">

#### கவுண்டர் (எண்) {/*counter-number*/}

இந்த உதாரணத்தில், `count` என்ற ஸ்டேட் வெரியபிள் ஒரு எண்ணை வைத்திருக்கிறது. பட்டனை சொடுக்கும்போது அது ஒரு யூனிட்டால் அதிகரிக்கும்.

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
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### உரை புலம் (ஸ்ட்ரிங்) {/*text-field-string*/}

இந்த உதாரணத்தில், `text` என்ற ஸ்டேட் வெரியபிள் ஒரு ஸ்ட்ரிங்கை வைத்திருக்கிறது. நீங்கள் தட்டச்சு செய்யும்போது, `handleChange` ப்ரவுசர் இன்புட் DOM எலிமென்டிலிருந்து சமீபத்திய மதிப்பை வாசித்து, ஸ்டேட்டை அப்டேட் செய்ய `setText` ஐ அழைக்கும். இதனால் தற்போதைய `text` ஐ கீழே காட்ட முடியும்.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### செக்பாக்ஸ் (பூலியன்) {/*checkbox-boolean*/}

இந்த உதாரணத்தில், `liked` என்ற ஸ்டேட் வெரியபிள் ஒரு பூலியன் மதிப்பை வைத்திருக்கிறது. நீங்கள் இன்புட்-ஐ சொடுக்கும்போது, ப்ரவுசர் செக்பாக்ஸ் தேர்ந்தெடுக்கப்பட்டதா என்பதை வைத்து `setLiked` `liked` ஸ்டேட்டை அப்டேட் செய்யும். அந்த `liked` மதிப்பு செக்பாக்ஸின் கீழே உள்ள உரையை ரெண்டர் செய்ய பயன்படுத்தப்படும்.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### படிவம் (இரண்டு வெரியபிள்கள்) {/*form-two-variables*/}

ஒரே காம்போனென்ட்டில் ஒன்றுக்கு மேற்பட்ட ஸ்டேட் வெரியபிள்களை அறிவிக்கலாம். ஒவ்வொரு ஸ்டேட் வெரியபிளும் முற்றிலும் சுயாதீனமானது.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### முந்தைய ஸ்டேட்டை அடிப்படையாகக் கொண்டு அப்டேட் செய்வது {/*updating-state-based-on-the-previous-state*/}

`age` `42` என்று கொள்வோம். இந்த ஹாண்ட்லர் `setAge(age + 1)` ஐ மூன்று முறை அழைக்கிறது:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

ஆனால், ஒரு முறை சொடுக்கிய பிறகு, `age` `45` ஆகாமல் `43` ஆக மட்டுமே இருக்கும்! காரணம், `set` ஃபங்க்ஷனை அழைப்பது ஏற்கனவே ஓடிக்கொண்டிருக்கும் கோடில் உள்ள `age` ஸ்டேட் வெரியபிளை [அப்போதே அப்டேட் செய்யாது](/learn/state-as-a-snapshot). ஆகவே ஒவ்வொரு `setAge(age + 1)` அழைப்பும் `setAge(43)` ஆகிவிடுகிறது.

இதற்கு தீர்வாக, அடுத்த ஸ்டேட்டை நேரடியாக அனுப்புவதற்கு பதிலாக, **ஒரு *அப்டேடர் ஃபங்க்ஷனை*** `setAge` க்கு அனுப்பலாம்:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

இங்கு `a => a + 1` உங்கள் அப்டேடர் ஃபங்க்ஷன். அது <CodeStep step={1}>பண்டிங் ஸ்டேட்டை</CodeStep> எடுத்து அதிலிருந்து <CodeStep step={2}>அடுத்த ஸ்டேட்டை</CodeStep> கணக்கிடுகிறது.

ரியாக்ட் உங்கள் அப்டேடர்களை ஒரு [க்யூவில்](/learn/queueing-a-series-of-state-updates) வைக்கும். அடுத்த ரெண்டரில், அதே வரிசையில் அவற்றை அழைக்கும்:

1. `a => a + 1` க்கு பண்டிங் ஸ்டேடாக `42` கிடைக்கும்; அது அடுத்த ஸ்டேடாக `43` ஐ ரிட்டர்ன் செய்யும்.
1. `a => a + 1` க்கு பண்டிங் `43`; அடுத்தது `44`.
1. `a => a + 1` க்கு பண்டிங் `44`; அடுத்தது `45`.

வேறு அப்டேட்கள் க்யூவில் இல்லாததால், இறுதியில் ரியாக்ட் `45` ஐ தற்போதைய ஸ்டேடாக சேமிக்கும்.

வழக்கமாக, பண்டிங் ஸ்டேட் ஆர்க்யூமென்ட்டிற்கு அந்த ஸ்டேட் வெரியபிளின் முதல் எழுத்தை பெயராக (உதா: `age` க்கு `a`) பயன்படுத்துவார்கள். இல்லை என்றால் `prevAge` போன்ற தெளிவான பெயரையும் பயன்படுத்தலாம்.

டெவலப்மெண்டில் அவை [பியூர்](/learn/keeping-components-pure) என்பதை உறுதிப்படுத்த ரியாக்ட் [உங்கள் அப்டேடர்களை இருமுறை அழைக்கலாம்](#my-initializer-or-updater-function-runs-twice).

<DeepDive>

#### எப்போதும் அப்டேடரைப் பயன்படுத்த வேண்டுமா? {/*is-using-an-updater-always-preferred*/}

முந்தைய ஸ்டேட்டிலிருந்து புதிய ஸ்டேட்டை கணக்கிடும்போது `setAge(a => a + 1)` போல எப்போதும் எழுத வேண்டும் என்ற பரிந்துரையை நீங்கள் கேட்கலாம். இதில் தீங்கு ஏதும் இல்லை; ஆனால் எப்போதும் அவசியமுமில்லை.

பல சமயங்களில், இரு முறைகளிலும் பெரிய வித்தியாசம் இருக்காது. திட்டமிட்ட யூசர் செயல்களில் (உதா: கிளிக்), அடுத்த கிளிக்கிற்கு முன் `age` ஸ்டேட் அப்டேட் ஆகியிருக்கும் என்பதை ரியாக்ட் உறுதிப்படுத்தும். அதனால் ஹாண்ட்லர் தொடக்கத்தில் “ஸ்டேல்” `age` பார்க்கும் ஆபத்து இல்லை.

ஆனால் ஒரே இவென்டில் பல அப்டேட்கள் செய்தால், அப்டேடர்கள் உதவிகரமானவை. ஸ்டேட் வெரியபிளை நேரடியாக அணுகுவதைத் தவிர்க்க வேண்டிய ஆப்டிமைசேஷன்களில் இதுவும் வசதியாக இருக்கும்.

தொடர்ச்சியான ஸ்டைலை (consistency) விரும்பினால், முந்தைய ஸ்டேட்டிலிருந்து கணக்கிடும் நேரங்களில் எப்போதும் அப்டேடரை எழுதுவது நியாயம். வேறு ஒரு ஸ்டேட் வெரியபிளின் முந்தைய ஸ்டேட்டிலிருந்து கணக்கிட வேண்டுமானால், அவற்றை ஒரே ஆப்ஜெக்டாக இணைத்து [ஒரு ரெட்யூசரைப் பயன்படுத்தலாம்.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="அப்டேடரை அனுப்புவது vs அடுத்த ஸ்டேட்டை நேரடியாக அனுப்புவது" titleId="examples-updater">

#### அப்டேடர் ஃபங்க்ஷனை அனுப்புவது {/*passing-the-updater-function*/}

இந்த உதாரணத்தில் அப்டேடர் ஃபங்க்ஷன் அனுப்பப்படுவதால் "+3" பட்டன் சரியாக செயல்படும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### அடுத்த ஸ்டேட்டை நேரடியாக அனுப்புவது {/*passing-the-next-state-directly*/}

இந்த உதாரணத்தில் அப்டேடர் ஃபங்க்ஷன் **அனுப்பப்படவில்லை**, அதனால் "+3" பட்டன் **எதிர்பார்த்தபடி செயல்படாது**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### ஸ்டேட்டில் ஆப்ஜெக்ட்களையும் அரேகளையும் அப்டேட் செய்வது {/*updating-objects-and-arrays-in-state*/}

ஸ்டேட்டில் ஆப்ஜெக்ட்களையும் அரேகளையும் வைத்திருக்கலாம். ரியாக்டில் ஸ்டேட் ரீட்-ஒண்லி எனக் கருதப்படுகிறது; எனவே **இருக்கும் ஆப்ஜெக்ட்களை *ம்யூட்டேட்* செய்வதற்குப் பதிலாக *ரீப்ளேஸ்* செய்ய வேண்டும்**. உதாரணமாக, ஸ்டேட்டில் `form` என்ற ஆப்ஜெக்ட் இருந்தால், அதை ம்யூட்டேட் செய்யாதீர்கள்:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

அதற்கு பதிலாக, புதிய ஆப்ஜெக்ட்டை உருவாக்கி முழுவதையும் ரீப்ளேஸ் செய்யவும்:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

[ஸ்டேட்டில் ஆப்ஜெக்ட்களை அப்டேட் செய்வது](/learn/updating-objects-in-state) மற்றும் [ஸ்டேட்டில் அரேகளை அப்டேட் செய்வது](/learn/updating-arrays-in-state) பற்றி மேலும் படிக்கவும்.

<Recipes titleText="ஸ்டேட்டில் ஆப்ஜெக்ட்கள் மற்றும் அரேகள் — உதாரணங்கள்" titleId="examples-objects">

#### படிவம் (ஆப்ஜெக்ட்) {/*form-object*/}

இந்த உதாரணத்தில், `form` என்ற ஸ்டேட் வெரியபிள் ஒரு ஆப்ஜெக்டை வைத்திருக்கிறது. ஒவ்வொரு இன்புடிற்கும் `setForm` ஐ அழைக்கும் மாற்ற ஹாண்ட்லர் இருக்கும்; அது முழு படிவத்தின் அடுத்த ஸ்டேட்டை அனுப்பும். `{ ...form }` என்ற ஸ்பிரெடு சிண்டாக்ஸ், ஸ்டேட் ஆப்ஜெக்ட் ம்யூட்டேட் செய்யப்படாமல் ரீப்ளேஸ் செய்யப்படுவதை உறுதிசெய்கிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### படிவம் (நெஸ்டட் ஆப்ஜெக்ட்) {/*form-nested-object*/}

இந்த உதாரணத்தில் ஸ்டேட் மேலும் நெஸ்டட் ஆக இருக்கிறது. நெஸ்டட் ஸ்டேட்டை அப்டேட் செய்யும்போது, நீங்கள் அப்டேட் செய்யும் ஆப்ஜெக்ட்டின் நகலை உருவாக்க வேண்டும்; அதைப் “கொண்டிருக்கும்” மேல்மட்ட ஆப்ஜெக்ட்களுக்கும் நகல் தேவை. மேலும் அறிய [நெஸ்டட் ஆப்ஜெக்டை அப்டேட் செய்வது](/learn/updating-objects-in-state#updating-a-nested-object) படிக்கவும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### பட்டியல் (அரே) {/*list-array*/}

இந்த உதாரணத்தில், `todos` என்ற ஸ்டேட் வெரியபிள் ஒரு அரேவை வைத்திருக்கிறது. ஒவ்வொரு பட்டன் ஹாண்ட்லரும் அந்த அரேவின் அடுத்த பதிப்புடன் `setTodos` ஐ அழைக்கும். `[...todos]` ஸ்பிரெடு சிண்டாக்ஸ், `todos.map()` மற்றும் `todos.filter()` ஆகியவை ஸ்டேட் அரே ம்யூட்டேட் செய்யப்படாமல் ரீப்ளேஸ் செய்யப்படுவதை உறுதிசெய்கின்றன.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Immer உடன் சுருக்கமான அப்டேட் லாஜிக் எழுதுவது {/*writing-concise-update-logic-with-immer*/}

ம்யூட்டேஷன் இல்லாமல் அரேக்கள் மற்றும் ஆப்ஜெக்ட்களை அப்டேட் செய்வது சிரமமாக இருந்தால், [Immer](https://github.com/immerjs/use-immer) போன்ற லைப்ரரியை பயன்படுத்தி மீள்மீண்டும் எழுத வேண்டிய கோடை குறைக்கலாம். Immer, நீங்கள் ஆப்ஜெக்ட்களை ம்யூட்டேட் செய்கிறீர்கள் போல சுருக்கமாக எழுத அனுமதிக்கும்; ஆனால் உட்புறத்தில் அது இம்மியூட்டபிள் அப்டேட்களைச் செய்கிறது:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### ஆரம்ப ஸ்டேட்டை மீண்டும் உருவாக்குவதைத் தவிர்ப்பது {/*avoiding-recreating-the-initial-state*/}

ரியாக்ட் ஆரம்ப ஸ்டேட்டை ஒருமுறை சேமித்து, அடுத்த ரெண்டர்களில் அதை புறக்கணிக்கிறது.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()` இன் விளைவு ஆரம்ப ரெண்டருக்கே தேவையாக இருந்தாலும், நீங்கள் ஒவ்வொரு ரெண்டரிலும் இந்த ஃபங்க்ஷனை அழைக்கிறீர்கள். இது பெரிய அரேகளை உருவாக்கினாலோ, அதிக செலவான கணக்கீடுகளைச் செய்தாலோ வீணாகும்.

இதற்கு, அதை `useState` க்கு **ஒரு _இனிஷலைஸர்_ ஃபங்க்ஷனாக** அனுப்பலாம்:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

இங்கே நீங்கள் அனுப்புவது `createInitialTodos()` அழைப்பின் விளைவு அல்ல; *ஃபங்க்ஷன் தானே* (`createInitialTodos`). ஒரு ஃபங்க்ஷனை `useState` க்கு அனுப்பினால், ரியாக்ட் அதை இனிஷலைஸேஷன் சமயத்தில் மட்டுமே அழைக்கும்.

டெவலப்மெண்டில், அவை [பியூர்](/learn/keeping-components-pure) என்பதை உறுதிப்படுத்த ரியாக்ட் [உங்கள் இனிஷலைஸர்களை இருமுறை அழைக்கலாம்](#my-initializer-or-updater-function-runs-twice).

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### இனிஷலைஸர் ஃபங்க்ஷனை அனுப்புவது {/*passing-the-initializer-function*/}

இந்த உதாரணத்தில் இனிஷலைஸர் ஃபங்க்ஷன் அனுப்பப்பட்டதால், `createInitialTodos` இனிஷலைஸேஷன் சமயத்தில் மட்டும் ஓடும். நீங்கள் இன்புடில் தட்டச்சு செய்தால் போன்ற ரீரெண்டர்களில் அது ஓடாது.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### ஆரம்ப ஸ்டேட்டை நேரடியாக அனுப்புவது {/*passing-the-initial-state-directly*/}

இந்த உதாரணத்தில் இனிஷலைஸர் ஃபங்க்ஷன் **அனுப்பப்படவில்லை**. அதனால் `createInitialTodos` ஒவ்வொரு ரெண்டரிலும் (உதா: நீங்கள் இன்புடில் தட்டச்சு செய்யும்போது) ஓடும். நடத்தில் வேறுபாடு தெரியாவிட்டாலும், இந்த கோடு குறைத்திறனுடையது.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### `key` மூலம் ஸ்டேட்டை ரீசெட் செய்வது {/*resetting-state-with-a-key*/}

பட்டியலை [ரெண்டர் செய்வதில்](/learn/rendering-lists) `key` அட்ரிப்யூட்டைப் பெரும்பாலும் பார்க்கலாம். ஆனால் இதற்கு வேறு ஒரு பயனும் உண்டு.

ஒரு காம்போனென்ட்டுக்கு வேறு `key` ஒன்றை அனுப்புவதன் மூலம் அதன் ஸ்டேட்டை **ரீசெட்** செய்யலாம். இந்த உதாரணத்தில், Reset பட்டன் `version` என்ற ஸ்டேட் வெரியபிளை மாற்றுகிறது; அதை `Form` க்கு `key` ஆக அனுப்புகிறோம். `key` மாறும்போது, ரியாக்ட் `Form` காம்போனென்ட்டை (அதன் சைல்டுகளுடன்) புதியதாக உருவாக்குகிறது; இதனால் ஸ்டேட் ரீசெட் ஆகிறது.

மேலும் அறிய [ஸ்டேட்டை காக்கவும்/ரீசெட் செய்யவும்](/learn/preserving-and-resetting-state) படிக்கவும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### முந்தைய ரெண்டர்களிலிருந்து தகவலைச் சேமிப்பது {/*storing-information-from-previous-renders*/}

பொதுவாக, ஸ்டேட்டை இவென்ட் ஹாண்ட்லர்களில் அப்டேட் செய்வீர்கள். ஆனால் அரிதாக, ரெண்டரிங்குக்கு பதிலளிக்க ஸ்டேட்டை சரிசெய்ய வேண்டிய நிலை வரும் — உதா: ஒரு ப்ராப் மாறும்போது ஸ்டேட் வெரியபிளை மாற்ற வேண்டுமானால்.

பெரும்பாலும், இதைத் தேவையில்லை:

* **தேவையான மதிப்பு தற்போதைய ப்ராப்ஸ் அல்லது வேறு ஸ்டேட்டிலிருந்து முழுமையாக கணக்கிடக்கூடியதாக இருந்தால், அந்த மீதியான ஸ்டேட்டைத் தானே [நீக்கிவிடுங்கள்.](/learn/choosing-the-state-structure#avoid-redundant-state)** மீண்டும் மீண்டும் கணக்கிடுவது குறித்து கவலைப்பட்டால், [`useMemo` ஹூக்](/reference/react/useMemo) உதவும்.
* முழு காம்போனென்ட் ட்ரீயின் ஸ்டேட்டை ரீசெட் செய்ய [உங்கள் காம்போனென்டுக்கு வேறு `key` ஒன்றை அனுப்புங்கள்.](#resetting-state-with-a-key)
* முடிந்தால், தொடர்புடைய அனைத்து ஸ்டேட்டையும் இவென்ட் ஹாண்ட்லர்களிலேயே அப்டேட் செய்யுங்கள்.

மேற்கண்டவற்றில் ஒன்றும் பொருந்தாத அரிதான சூழலில், உங்கள் காம்போனென்ட் ரெண்டர் ஆகிக்கொண்டிருக்கும் போது `set` ஃபங்க்ஷனை அழைத்து, இதுவரை ரெண்டர் செய்யப்பட்ட மதிப்புகளை அடிப்படையாகக் கொண்டு ஸ்டேட்டை அப்டேட் செய்யும் ஒரு பாடர்னை பயன்படுத்தலாம்.

இதோ ஒரு உதாரணம். இந்த `CountLabel` காம்போனென்ட், அதற்கு அனுப்பப்படும் `count` ப்ராபை காட்டுகிறது:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

கடந்த மாறுதலிலிருந்து கவுண்டர் *அதிகரித்ததா, குறைந்ததா* என்பதை காட்ட வேண்டுமென்றால்? `count` ப்ராப் அதை சொல்லாது — அதன் முந்தைய மதிப்பை நீங்கள் நினைவில் வைத்திருக்க வேண்டும். அதைக் கண்காணிக்க `prevCount` என்ற ஸ்டேட் வெரியபிளைச் சேர்க்கவும். மேலும், அதிகரித்ததா குறைந்ததா என்பதைக் காட்ட `trend` என்ற மற்றொரு ஸ்டேட் வெரியபிளைச் சேர்க்கவும். `prevCount` மற்றும் `count` ஐ ஒப்பிட்டு, ஒத்தில்லையெனில் இரண்டையும் அப்டேட் செய்யவும். இப்போது தற்போதைய count ப்ராபையும், அது *கடந்த ரெண்டரிலிருந்து எவ்வாறு மாறியது* என்பதையும் காட்ட முடியும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

குறிப்பு: ரெண்டரிங் சமயத்தில் `set` ஃபங்க்ஷனை அழைத்தால், அது `prevCount !== count` போன்ற கண்டிஷன் உள்ளேயே இருக்க வேண்டும்; மேலும் அந்த கண்டிஷனுக்குள் `setPrevCount(count)` போன்ற அழைப்பும் இருக்க வேண்டும். இல்லையெனில், உங்கள் காம்போனென்ட் தொடர்ச்சியாக ரீரெண்டர் ஆகி க்ராஷ் ஆகும். மேலும், இவ்வாறு அப்டேட் செய்ய இயல்வது *தற்போது ரெண்டர் ஆகும்* காம்போனென்ட்டின் ஸ்டேட்டையே. ரெண்டரிங் சமயத்தில் *வேறு* காம்போனென்ட்டின் `set` ஃபங்க்ஷனை அழைப்பது பிழை. கடைசியாக, உங்கள் `set` அழைப்பு இன்னும் [ம்யூட்டேஷன் இல்லாமல் ஸ்டேட்டை அப்டேட் செய்யவே](#updating-objects-and-arrays-in-state) வேண்டும் — இது [பியூர் ஃபங்க்ஷன்களின்](/learn/keeping-components-pure) விதிகளை மீறலாம் என்பதல்ல.

இந்த பாடர்னை புரிந்து கொள்வது சற்று கடினம்; பொதுவாகத் தவிர்ப்பதே நல்லது. இருந்தாலும், இது Effect-ல் ஸ்டேட்டை அப்டேட் செய்வதைக் காட்டிலும் மேல். ரெண்டரிங் சமயத்தில் `set` அழைத்தால், உங்கள் காம்போனென்ட் `return` ஆனவுடன் உடனே (சைல்ட்களை ரெண்டர் செய்யும் முன்னர்) ரியாக்ட் அதை மீண்டும் ரெண்டர் செய்யும். இதனால் சைல்ட்கள் இரண்டு முறை ரெண்டர் ஆக வேண்டியதில்லை. உங்கள் காம்போனென்ட் ஃபங்க்ஷனின் மீதியெல்லாம் ஓடும் (ஆனால் அதன் விளைவு தூக்கி எறியப்படும்). உங்கள் கண்டிஷன் எல்லா ஹூக் அழைப்புகளுக்கும் கீழே இருந்தால், தொடக்கத்திலேயே `return;` ஒன்றை சேர்த்து ரெண்டரிங்கை மீண்டும் ஆரம்பிக்கலாம்.

---

## பழுது பார்த்தல் {/*troubleshooting*/}

### நான் ஸ்டேட்டை அப்டேட் செய்தேன், ஆனால் லோகில் பழைய மதிப்பு தான் வருகிறது {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

`set` ஃபங்க்ஷனை அழைப்பது **ஓடிக்கொண்டிருக்கும் கோடில் ஸ்டேட்டை மாற்றாது**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

இது [ஸ்டேட் ஒரு ஸ்நாப்ஷாட் போல நடப்பதனால்](/learn/state-as-a-snapshot). ஸ்டேட்டை அப்டேட் செய்வது புதிய ஸ்டேட்டுடன் இன்னொரு ரெண்டரை கோருவதுதான்; ஏற்கனவே இயங்கும் இந்த இவென்ட் ஹாண்ட்லரில் உள்ள `count` ஜாவாஸ்கிரிப்ட் வெரியபிளை அது பாதிக்காது.

அடுத்த ஸ்டேட்டை பயன்படுத்த வேண்டுமெனில், அதை `set` க்கு அனுப்புவதற்கு முன் ஒரு வெரியபிளில் சேமிக்கலாம்:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### நான் ஸ்டேட்டை அப்டேட் செய்தேன், ஆனால் திரை அப்டேட் ஆகவில்லை {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ஒப்பீட்டின்படி **அடுத்த ஸ்டேட் முந்தைய ஸ்டேட்டுக்கு சமமாக இருந்தால்**, ரியாக்ட் உங்கள் அப்டேட்டை புறக்கணிக்கும். இது பொதுவாக ஸ்டேட்டில் உள்ள ஆப்ஜெக்ட் அல்லது அரேவை நேரடியாக மாற்றும்போது நடக்கும்:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

நீங்கள் இருக்கும் `obj` ஆப்ஜெக்டை ம்யூட்டேட் செய்து அதை மீண்டும் `setObj` க்கு அனுப்பியதால், ரியாக்ட் அப்டேட்டை புறக்கணித்தது. இதை சரி செய்ய, ஸ்டேட்டில் உள்ள ஆப்ஜெக்ட்களையும் அரேகளையும் எப்போதும் [_ம்யூட்டேட்_ செய்யாமல் _ரீப்ளேஸ்_](#updating-objects-and-arrays-in-state) செய்வதை உறுதிப்படுத்துங்கள்:

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### எனக்கு “Too many re-renders” என்ற பிழை வருகிறது {/*im-getting-an-error-too-many-re-renders*/}

இந்த மாதிரி ஒரு பிழை வந்துகிடைக்கும்: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` பொதுவாக, நீங்கள் ரெண்டரிங் சமயத்தில் கண்டிஷன் இல்லாமல் ஸ்டேட்டை அமைத்துவிட்டீர்கள் என்பதைக் குறிக்கும். இதனால் உங்கள் காம்போனென்ட் லூப்பில் சிக்கி விடும்: render → set state (render) → render → set state (render) ... போன்றதாக. இது பெரும்பாலும் இவென்ட் ஹாண்ட்லரை குறிப்பிடும் முறையில் உள்ள தவறால் ஏற்படும்:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

இந்த பிழையின் காரணத்தை கண்டுபிடிக்க முடியவில்லை என்றால், கான்சோலில் இருக்கும் பிழை அருகே உள்ள அம்பை சொடுக்கி, ஜாவாஸ்கிரிப்ட் ஸ்டாக்கில் எந்த `set` அழைப்பே காரணமெனத் தேடுங்கள்.

---

### என் இனிஷலைஸர் அல்லது அப்டேடர் ஃபங்க்ஷன் இரண்டு முறை ஓடுகிறது {/*my-initializer-or-updater-function-runs-twice*/}

[ஸ்ட்ரிக்ட் மோடில்](/reference/react/StrictMode), ரியாக்ட் சில ஃபங்க்ஷன்களை ஒருமுறை பதிலாக இரண்டு முறை அழைக்கும்:

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

இது எதிர்பார்க்கப்பட்டதே; உங்கள் கோடை கெடுப்பதில்லை.

இந்த நடத்தை **டெவலப்மெண்டில் மட்டும்** நடக்கும்; இது [காம்போனென்ட்களை பியூர் வைத்திருக்க](/learn/keeping-components-pure) உதவுகிறது. ரியாக்ட் இரண்டு அழைப்புகளில் ஒன்றின் விளைவையே பயன்படுத்தி, மற்றதைக் கவனிக்காது. உங்கள் காம்போனென்ட், இனிஷலைஸர், அப்டேடர் ஃபங்க்ஷன்கள் பியூர் ஆக இருந்தால், உங்கள் லாஜிக் பாதிக்கப்படாது. தவறுதலாக இம்ப்யூர் ஆக இருந்தால், இந்த நடத்தை அவற்றை புலப்படுத்த உதவும்.

உதாரணமாக, இந்த இம்ப்யூர் அப்டேடர் ஸ்டேட்டில் உள்ள ஒரு அரேவை ம்யூட்டேட் செய்கிறது:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

ரியாக்ட் உங்கள் அப்டேடரை இரண்டு முறை அழைக்கும் போது, todo இரண்டு முறை சேர்க்கப்பட்டிருப்பதைப் பார்க்கலாம்; இதனால் பிழை இருப்பது புரியும். இந்த உதாரணத்தில், [அரேவை ம்யூட்டேட் செய்வதற்கு பதிலாக ரீப்ளேஸ் செய்வதன் மூலம்](#updating-objects-and-arrays-in-state) பிழையை சரி செய்யலாம்:

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

இப்போது இந்த அப்டேடர் பியூர் ஆனதால், அதை ஒரு முறை கூடுதலாக அழைத்தாலும் நடத்தில் மாற்றம் இல்லை. அதனால்தான் ரியாக்ட் இருமுறை அழைப்பது பிழைகளை கண்டுபிடிக்க உதவுகிறது. **பியூர் ஆக இருக்க வேண்டியது காம்போனென்ட், இனிஷலைஸர், அப்டேடர் ஃபங்க்ஷன்களே.** இவென்ட் ஹாண்ட்லர்கள் பியூர் ஆக வேண்டியதில்லை; ரியாக்ட் அவற்றை இருமுறை அழைக்காது.

மேலும் அறிய [காம்போனென்ட்களை பியூர் வைத்திருப்பது](/learn/keeping-components-pure) படிக்கவும்.

---

### ஒரு ஃபங்க்ஷனை ஸ்டேட்டில் வைக்க முயற்சிக்கிறேன், ஆனால் அது அழைக்கப்படுகிறது {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

இப்படி ஒரு ஃபங்க்ஷனை ஸ்டேட்டில் வைக்க முடியாது:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

நீங்கள் ஃபங்க்ஷனை அனுப்புவதால், `someFunction` ஐ ரியாக்ட் [இனிஷலைஸர் ஃபங்க்ஷன்](#avoiding-recreating-the-initial-state) என்றும், `someOtherFunction` ஐ [அப்டேடர் ஃபங்க்ஷன்](#updating-state-based-on-the-previous-state) என்றும் கருதும்; அதனால் அவற்றை அழைத்து விளைவுகளைச் சேமிக்க முயலும். உண்மையில் ஒரு ஃபங்க்ஷனை *சேமிக்க*, இரண்டிலும் முன்னால் `() =>` சேர்க்க வேண்டும். அப்போது ரியாக்ட் நீங்கள் அனுப்பும் ஃபங்க்ஷன்களைச் சேமிக்கும்.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
