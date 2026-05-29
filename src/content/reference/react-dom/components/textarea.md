---
title: "<textarea>"
---

<Intro>

[Built-in browser `<textarea>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) பல வரி text input ஒன்றை render செய்ய உதவுகிறது.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `<textarea>` {/*textarea*/}

Text area ஒன்றைக் காட்ட, [built-in browser `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) component-ஐ render செய்யவும்.

```js
<textarea name="postContent" />
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<textarea>` எல்லா [common element props](/reference/react-dom/components/common#common-props)-ஐயும் ஆதரிக்கிறது.

`value` prop-ஐ அனுப்புவதன் மூலம் [text area-வை controlled ஆக்கலாம்](#controlling-a-text-area-with-a-state-variable):

* `value`: String. Text area-க்குள் உள்ள text-ஐ control செய்கிறது.

நீங்கள் `value` அனுப்பும்போது, அனுப்பப்பட்ட value-ஐ update செய்யும் `onChange` handler-ஐயும் அனுப்ப வேண்டும்.

உங்கள் `<textarea>` uncontrolled ஆக இருந்தால், அதற்கு பதிலாக `defaultValue` prop-ஐ அனுப்பலாம்:

* `defaultValue`: String. Text area-க்கான [initial value](#providing-an-initial-value-for-a-text-area)-ஐ குறிப்பிடுகிறது.

இந்த `<textarea>` props uncontrolled மற்றும் controlled text areas இரண்டிற்கும் பொருந்தும்:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): `'on'` அல்லது `'off'`. Autocomplete நடத்தை எப்படியிருக்க வேண்டும் என்பதை குறிப்பிடுகிறது.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Boolean. `true` என்றால், mount ஆகும்போது React அந்த element-க்கு focus செய்கிறது.
* `children`: `<textarea>` children-ஐ ஏற்காது. Initial value அமைக்க `defaultValue` பயன்படுத்தவும்.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Number. சராசரி character அகலங்களின் அடிப்படையில் default width-ஐ குறிப்பிடுகிறது. Default `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Boolean. `true` என்றால், input interactive ஆக இருக்காது மற்றும் மங்கலாக தோன்றும்.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): String. இந்த input சேர்ந்திருக்கும் `<form>`-இன் `id`-ஐ குறிப்பிடுகிறது. விடப்பட்டால், அருகிலுள்ள parent form பயன்படுத்தப்படும்.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Number. Text-ன் அதிகபட்ச நீளத்தை குறிப்பிடுகிறது.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Number. Text-ன் குறைந்தபட்ச நீளத்தை குறிப்பிடுகிறது.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String. [Form உடன் submit செய்யப்படும்](#reading-the-textarea-value-when-submitting-a-form) இந்த input-ன் பெயரை குறிப்பிடுகிறது.
* `onChange`: [`Event` handler](/reference/react-dom/components/common#event-handler) function. [Controlled text areas](#controlling-a-text-area-with-a-state-variable)-க்கு அவசியம். பயனர் input-ன் value-ஐ மாற்றியவுடன் உடனடியாக fire ஆகும் (உதாரணமாக, ஒவ்வொரு keystroke-க்கும் fire ஆகும்). Browser [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) போல நடக்கும்.
* `onChangeCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onChange` version.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. பயனர் value-ஐ மாற்றியவுடன் உடனடியாக fire ஆகும். வரலாற்று காரணங்களால், React-இல் இதேபோல் வேலை செய்யும் `onChange`-ஐப் பயன்படுத்துவது idiomatic ஆகும்.
* `onInputCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onInput` version.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. Form submit ஆகும்போது input validation-ல் தோல்வியடைந்தால் fire ஆகும். Built-in `invalid` event-இற்கு மாறாக, React `onInvalid` event bubbles செய்கிறது.
* `onInvalidCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onInvalid` version.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. `<textarea>`-க்குள் selection மாறிய பிறகு fire ஆகும். காலியான selection-க்கும் edits-க்கும் (selection-ஐ பாதிக்கக்கூடியவை) `onSelect` event fire ஆகுமாறு React விரிவாக்குகிறது.
* `onSelectCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSelect` version.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): String. Text area value காலியாக இருக்கும்போது மங்கலான நிறத்தில் காட்டப்படும்.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Boolean. `true` என்றால், பயனர் text area-வை edit செய்ய முடியாது.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Boolean. `true` என்றால், form submit ஆக value வழங்கப்பட்டிருக்க வேண்டும்.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Number. சராசரி character உயரங்களின் அடிப்படையில் default height-ஐ குறிப்பிடுகிறது. Default `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): `'hard'`, `'soft'`, அல்லது `'off'`. Form submit செய்யும்போது text எப்படி wrap ஆக வேண்டும் என்பதை குறிப்பிடுகிறது.

#### கவனிக்க வேண்டியவை {/*caveats*/}

- `<textarea>something</textarea>` போன்ற children அனுப்புவது அனுமதிக்கப்படாது. [Initial content-க்கு `defaultValue` பயன்படுத்தவும்.](#providing-an-initial-value-for-a-text-area)
- Text area string `value` prop பெற்றால், அது [controlled ஆகக் கருதப்படும்.](#controlling-a-text-area-with-a-state-variable)
- ஒரே நேரத்தில் ஒரு text area controlled-ஆகவும் uncontrolled-ஆகவும் இருக்க முடியாது.
- Text area தனது lifetime முழுவதும் controlled நிலையிலிருந்து uncontrolled நிலைக்கு அல்லது மாறாக switch ஆக முடியாது.
- ஒவ்வொரு controlled text area-க்கும் அதன் backing value-ஐ synchronously update செய்யும் `onChange` event handler தேவை.

---

## பயன்பாடு {/*usage*/}

### Text area காட்டுதல் {/*displaying-a-text-area*/}

Text area ஒன்றைக் காட்ட `<textarea>` render செய்யவும். [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) மற்றும் [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) attributes மூலம் அதன் default size-ஐ குறிப்பிடலாம்; ஆனால் default ஆக பயனர் அதை resize செய்ய முடியும். Resizing-ஐ disable செய்ய, CSS-இல் `resize: none` குறிப்பிடலாம்.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      உங்கள் பதிவை எழுதுங்கள்:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Text area-க்கு label வழங்குதல் {/*providing-a-label-for-a-text-area*/}

பொதுவாக, ஒவ்வொரு `<textarea>`-வையும் [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag-க்குள் வைப்பீர்கள். இந்த label அந்த text area-வுடன் தொடர்புடையது என்பதை இது browser-க்கு தெரிவிக்கிறது. பயனர் label-ஐ click செய்யும்போது, browser text area-க்கு focus செய்கிறது. Accessibility-க்கும் இது அவசியம்: பயனர் text area-க்கு focus செய்தால் screen reader label caption-ஐ announce செய்யும்.

`<textarea>`-வை `<label>`-க்குள் nest செய்ய முடியாவிட்டால், `<textarea id>` மற்றும் [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) இரண்டிற்கும் அதே ID-ஐ அனுப்பி அவற்றை associate செய்யவும். ஒரே component-ன் instances இடையே conflicts தவிர்க்க, அத்தகைய ID-ஐ [`useId`](/reference/react/useId) மூலம் உருவாக்கவும்.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        உங்கள் பதிவை எழுதுங்கள்:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Text area-க்கு initial value வழங்குதல் {/*providing-an-initial-value-for-a-text-area*/}

Text area-க்கான initial value-ஐ விருப்பமாக குறிப்பிடலாம். அதை `defaultValue` string ஆக அனுப்பவும்.

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      உங்கள் பதிவைத் திருத்துங்கள்:
      <textarea
        name="postContent"
        defaultValue="நேற்று சைக்கிள் ஓட்டியது எனக்கு மிகவும் பிடித்திருந்தது!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

HTML-இல் இருப்பதுபோல், `<textarea>Some content</textarea>` போன்ற initial text அனுப்புவது support செய்யப்படாது.

</Pitfall>

---

### Form submit செய்யும்போது text area value-ஐ படித்தல் {/*reading-the-text-area-value-when-submitting-a-form*/}

உங்கள் textarea-வைச் சுற்றி [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ஒன்றையும், அதன் உள்ளே [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) ஒன்றையும் சேர்க்கவும். இது உங்கள் `<form onSubmit>` event handler-ஐ call செய்யும். Default ஆக, browser form data-வை current URL-க்கு அனுப்பி page-ஐ refresh செய்யும். `e.preventDefault()` call செய்து அந்த behavior-ஐ override செய்யலாம். [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) மூலம் form data-வை படிக்கவும்.

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        பதிவின் தலைப்பு: <input name="postTitle" defaultValue="சைக்கிள் ஓட்டுதல்" />
      </label>
      <label>
        உங்கள் பதிவைத் திருத்துங்கள்:
        <textarea
          name="postContent"
          defaultValue="நேற்று சைக்கிள் ஓட்டியது எனக்கு மிகவும் பிடித்திருந்தது!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">திருத்தங்களை reset செய்</button>
      <button type="submit">பதிவை சேமி</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

உங்கள் `<textarea>`-க்கு ஒரு `name` கொடுக்கவும், உதாரணமாக `<textarea name="postContent" />`. நீங்கள் குறிப்பிடும் `name` form data-வில் key ஆக பயன்படுத்தப்படும், உதாரணமாக `{ postContent: "Your post" }`.

</Note>

<Pitfall>

Default ஆக, `<form>`-க்குள் உள்ள *எந்த* `<button>`-உம் அதை submit செய்யும். இது எதிர்பாராததாக இருக்கலாம்! உங்கள் சொந்த custom `Button` React component இருந்தால், `<button>`-க்கு பதிலாக [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) return செய்வதை பரிசீலிக்கவும். பின்னர், தெளிவாக இருக்க, form submit செய்ய வேண்டிய buttons-க்கு `<button type="submit">` பயன்படுத்தவும்.

</Pitfall>

---

### State variable கொண்டு text area-வை control செய்தல் {/*controlling-a-text-area-with-a-state-variable*/}

`<textarea />` போன்ற text area *uncontrolled* ஆகும். `<textarea defaultValue="Initial text" />` போன்ற [initial value](#providing-an-initial-value-for-a-text-area)-ஐ அனுப்பினாலும், உங்கள் JSX initial value-ஐ மட்டுமே குறிப்பிடுகிறது; இப்போது உள்ள value-ஐ அல்ல.

**_Controlled_ text area ஒன்றை render செய்ய, அதற்கு `value` prop அனுப்பவும்.** நீங்கள் அனுப்பிய `value` text area-வில் எப்போதும் இருக்கும்படி React force செய்யும். பொதுவாக, [state variable](/reference/react/useState) ஒன்றை declare செய்து text area-வை control செய்வீர்கள்:

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // State variable ஒன்றை declare செய்யவும்...
  // ...
  return (
    <textarea
      value={postContent} // ...input-ன் value state variable-க்கு match ஆக force செய்யவும்...
      onChange={e => setPostContent(e.target.value)} // ...மேலும் எந்த edits வந்தாலும் state variable-ஐ update செய்யவும்!
    />
  );
}
```

ஒவ்வொரு keystroke-க்கும் பதிலாக UI-இன் ஏதாவது பகுதியை re-render செய்ய விரும்பினால் இது பயனுள்ளதாக இருக்கும்.

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_வணக்கம்,_ **Markdown**!');
  return (
    <>
      <label>
        Markdown உள்ளிடுங்கள்:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
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

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**`onChange` இல்லாமல் `value` அனுப்பினால், text area-க்குள் type செய்வது முடியாது.** ஒரு text area-க்கு ஏதாவது `value` அனுப்பி அதை control செய்யும்போது, நீங்கள் அனுப்பிய value எப்போதும் இருக்கும்படி அதை *force* செய்கிறீர்கள். எனவே state variable-ஐ `value` ஆக அனுப்பி, ஆனால் `onChange` event handler-இன் போது அந்த state variable-ஐ synchronously update செய்ய மறந்தால், ஒவ்வொரு keystroke-க்கும் பிறகு React text area-வை நீங்கள் குறிப்பிட்ட `value`-க்கே மீண்டும் மாற்றிவிடும்.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}

### நான் type செய்யும்போது என் text area update ஆகவில்லை {/*my-text-area-doesnt-update-when-i-type-into-it*/}

`value` உடன் ஆனால் `onChange` இல்லாமல் text area render செய்தால், console-இல் error காண்பீர்கள்:

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Error message கூறுவது போல, நீங்கள் [*initial* value-ஐ மட்டும் குறிப்பிட](#providing-an-initial-value-for-a-text-area) விரும்பினால், அதற்கு பதிலாக `defaultValue` அனுப்பவும்:

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

[இந்த text area-வை state variable கொண்டு control](#controlling-a-text-area-with-a-state-variable) செய்ய விரும்பினால், `onChange` handler ஒன்றை குறிப்பிடவும்:

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Value திட்டமிட்டே read-only ஆக இருந்தால், error-ஐ suppress செய்ய `readOnly` prop சேர்க்கவும்:

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

---

### ஒவ்வொரு keystroke-க்கும் என் text area caret தொடக்கத்துக்கு தாவுகிறது {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

நீங்கள் [text area-வை control](#controlling-a-text-area-with-a-state-variable) செய்தால், `onChange` போது அதன் state variable-ஐ DOM-இல் உள்ள text area value-க்கு update செய்ய வேண்டும்.

அதை `e.target.value` அல்லாத வேறு ஒன்றாக update செய்ய முடியாது:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

அதை asynchronously-ஆகவும் update செய்ய முடியாது:

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

உங்கள் code-ஐ சரிசெய்ய, அதை synchronously `e.target.value`-க்கு update செய்யவும்:

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

இது பிரச்சினையை சரிசெய்யவில்லை என்றால், ஒவ்வொரு keystroke-க்கும் text area DOM-இலிருந்து அகற்றப்பட்டு மீண்டும் சேர்க்கப்படுவது சாத்தியம். ஒவ்வொரு re-render-க்கும் நீங்கள் தவறுதலாக [state-ஐ reset](/learn/preserving-and-resetting-state) செய்தால் இது நடக்கலாம். உதாரணமாக, text area அல்லது அதன் parents-இல் ஒன்று எப்போதும் வேறு `key` attribute பெறும்போது, அல்லது component definitions-ஐ nest செய்தால் (இது React-இல் அனுமதிக்கப்படாது; ஒவ்வொரு render-க்கும் "inner" component remount ஆகும்) இது நடக்கலாம்.

---

### எனக்கு error வருகிறது: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

Component-க்கு `value` வழங்கினால், அது அதன் lifetime முழுவதும் string ஆகவே இருக்க வேண்டும்.

முதலில் `value={undefined}` அனுப்பி, பின்னர் `value="some string"` அனுப்ப முடியாது; ஏனெனில் component uncontrolled ஆக இருக்க வேண்டுமா அல்லது controlled ஆக இருக்க வேண்டுமா என்பதை React அறியாது. Controlled component எப்போதும் string `value` பெற வேண்டும்; `null` அல்லது `undefined` அல்ல.

உங்கள் `value` API அல்லது state variable-இலிருந்து வந்தால், அது `null` அல்லது `undefined` ஆக initialized ஆகியிருக்கலாம். அப்படியானால், முதலில் அதை empty string (`''`) ஆக அமைக்கவும், அல்லது `value` string என்பதை உறுதிசெய்ய `value={someValue ?? ''}` அனுப்பவும்.
