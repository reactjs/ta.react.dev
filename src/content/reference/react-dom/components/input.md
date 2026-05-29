---
title: "<input>"
---

<Intro>

[Built-in browser `<input>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) பல வகையான form inputs render செய்ய உதவுகிறது.

```js
<input />
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `<input>` {/*input*/}

Input ஒன்றைக் காட்ட, [built-in browser `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) component-ஐ render செய்யவும்.

```js
<input name="myInput" />
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<input>` எல்லா [common element props](/reference/react-dom/components/common#common-props)-ஐயும் support செய்கிறது.

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): String அல்லது function. `type="submit"` மற்றும் `type="image"`-க்கு parent `<form action>`-ஐ override செய்கிறது. URL `action`-க்கு pass செய்யப்பட்டால் form standard HTML form போல நடக்கும். Function `formAction`-க்கு pass செய்யப்பட்டால், அந்த function form submission-ஐ handle செய்யும். [`<form action>`](/reference/react-dom/components/form#props)-ஐ பார்க்கவும்.

இந்த props-இல் ஒன்றை pass செய்வதன் மூலம் [input-ஐ controlled ஆக்கலாம்](#controlling-an-input-with-a-state-variable):

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Boolean. Checkbox input அல்லது radio button selected ஆக உள்ளதா என்பதை control செய்கிறது.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): String. Text input-க்கு அதன் text-ஐ control செய்கிறது. (Radio button-க்கு, அதன் form data-வை குறிப்பிடுகிறது.)

இவற்றில் ஏதேனும் ஒன்றை pass செய்யும்போது, pass செய்யப்பட்ட value-ஐ update செய்யும் `onChange` handler-ஐயும் pass செய்ய வேண்டும்.

இந்த `<input>` props uncontrolled inputs-க்கு மட்டும் பொருந்தும்:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Boolean. `type="checkbox"` மற்றும் `type="radio"` inputs-க்கான [initial value](#providing-an-initial-value-for-an-input)-ஐ குறிப்பிடுகிறது.
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): String. Text input-க்கான [initial value](#providing-an-initial-value-for-an-input)-ஐ குறிப்பிடுகிறது.

இந்த `<input>` props uncontrolled மற்றும் controlled inputs இரண்டிற்கும் பொருந்தும்:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): String. `type="file"` input எந்த filetypes-ஐ accept செய்யும் என்பதை குறிப்பிடுகிறது.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): String. `type="image"` input-க்கான alternative image text-ஐ குறிப்பிடுகிறது.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): String. `type="file"` input capture செய்யும் media-வை (microphone, video, அல்லது camera) குறிப்பிடுகிறது.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): String. சாத்தியமான [autocomplete behaviors](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)-இல் ஒன்றை குறிப்பிடுகிறது.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Boolean. `true` என்றால், mount ஆகும்போது React element-க்கு focus செய்கிறது.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): String. Element-ன் directionality-க்கான form field name-ஐ குறிப்பிடுகிறது.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Boolean. `true` என்றால், input interactive ஆக இருக்காது மற்றும் மங்கலாக தோன்றும்.
* `children`: `<input>` children-ஐ ஏற்காது.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): String. இந்த input சேர்ந்திருக்கும் `<form>`-இன் `id`-ஐ குறிப்பிடுகிறது. விடப்பட்டால், அருகிலுள்ள parent form பயன்படுத்தப்படும்.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): String. `type="submit"` மற்றும் `type="image"`-க்கு parent `<form action>`-ஐ override செய்கிறது.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): String. `type="submit"` மற்றும் `type="image"`-க்கு parent `<form enctype>`-ஐ override செய்கிறது.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): String. `type="submit"` மற்றும் `type="image"`-க்கு parent `<form method>`-ஐ override செய்கிறது.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): String. `type="submit"` மற்றும் `type="image"`-க்கு parent `<form noValidate>`-ஐ override செய்கிறது.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): String. `type="submit"` மற்றும் `type="image"`-க்கு parent `<form target>`-ஐ override செய்கிறது.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): String. `type="image"` input-க்கான image height-ஐ குறிப்பிடுகிறது.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): String. Autocomplete options கொண்ட `<datalist>`-ன் `id`-ஐ குறிப்பிடுகிறது.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Number. Numerical மற்றும் datetime inputs-ன் maximum value-ஐ குறிப்பிடுகிறது.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Number. Text மற்றும் பிற inputs-ன் maximum length-ஐ குறிப்பிடுகிறது.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Number. Numerical மற்றும் datetime inputs-ன் minimum value-ஐ குறிப்பிடுகிறது.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Number. Text மற்றும் பிற inputs-ன் minimum length-ஐ குறிப்பிடுகிறது.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Boolean. `<type="file"` மற்றும் `type="email"`-க்கு multiple values அனுமதிக்கப்படுமா என்பதை குறிப்பிடுகிறது.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String. [Form உடன் submit செய்யப்படும்](#reading-the-input-values-when-submitting-a-form) இந்த input-ன் பெயரை குறிப்பிடுகிறது.
* `onChange`: [`Event` handler](/reference/react-dom/components/common#event-handler) function. [Controlled inputs](#controlling-an-input-with-a-state-variable)-க்கு அவசியம். பயனர் input-ன் value-ஐ மாற்றியவுடன் உடனடியாக fire ஆகும் (உதாரணமாக, ஒவ்வொரு keystroke-க்கும் fire ஆகும்). Browser [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) போல நடக்கும்.
* `onChangeCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onChange` version.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. பயனர் value-ஐ மாற்றியவுடன் உடனடியாக fire ஆகும். வரலாற்று காரணங்களால், React-இல் இதேபோல் வேலை செய்யும் `onChange`-ஐப் பயன்படுத்துவது idiomatic ஆகும்.
* `onInputCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onInput` version.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. Form submit ஆகும்போது input validation-ல் தோல்வியடைந்தால் fire ஆகும். Built-in `invalid` event-இற்கு மாறாக, React `onInvalid` event bubbles செய்கிறது.
* `onInvalidCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onInvalid` version.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. `<input>`-க்குள் selection மாறிய பிறகு fire ஆகும். காலியான selection-க்கும் edits-க்கும் (selection-ஐ பாதிக்கக்கூடியவை) `onSelect` event fire ஆகுமாறு React விரிவாக்குகிறது.
* `onSelectCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onSelect` version.
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): String. `value` match ஆக வேண்டிய pattern-ஐ குறிப்பிடுகிறது.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): String. Input value காலியாக இருக்கும்போது மங்கலான நிறத்தில் காட்டப்படும்.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Boolean. `true` என்றால், பயனர் input-ஐ edit செய்ய முடியாது.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Boolean. `true` என்றால், form submit ஆக value வழங்கப்பட்டிருக்க வேண்டும்.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Number. Width set செய்வதற்கு ஒத்தது; ஆனால் unit control-ஐப் பொறுத்தது.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): String. `type="image"` input-க்கான image source-ஐ குறிப்பிடுகிறது.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Positive number அல்லது `'any'` string. Valid values இடையிலான distance-ஐ குறிப்பிடுகிறது.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): String. [Input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)-இல் ஒன்று.
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): String. `type="image"` input-க்கான image width-ஐ குறிப்பிடுகிறது.

#### கவனிக்க வேண்டியவை {/*caveats*/}

- Checkboxes-க்கு `value` (அல்லது `defaultValue`) அல்ல, `checked` (அல்லது `defaultChecked`) தேவை.
- Text input string `value` prop பெற்றால், அது [controlled ஆகக் கருதப்படும்](#controlling-an-input-with-a-state-variable).
- Checkbox அல்லது radio button boolean `checked` prop பெற்றால், அது [controlled ஆகக் கருதப்படும்](#controlling-an-input-with-a-state-variable).
- ஒரே நேரத்தில் input controlled-ஆகவும் uncontrolled-ஆகவும் இருக்க முடியாது.
- Input தனது lifetime முழுவதும் controlled நிலையிலிருந்து uncontrolled நிலைக்கு அல்லது மாறாக switch ஆக முடியாது.
- ஒவ்வொரு controlled input-க்கும் அதன் backing value-ஐ synchronously update செய்யும் `onChange` event handler தேவை.

---

## பயன்பாடு {/*usage*/}

### வெவ்வேறு வகை inputs காட்டுதல் {/*displaying-inputs-of-different-types*/}

Input ஒன்றைக் காட்ட `<input>` component-ஐ render செய்யவும். Default ஆக, அது text input ஆக இருக்கும். Checkbox-க்கு `type="checkbox"`, radio button-க்கு `type="radio"`, [அல்லது மற்ற input types-இல் ஒன்றை](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) pass செய்யலாம்.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Input-க்கு label வழங்குதல் {/*providing-a-label-for-an-input*/}

பொதுவாக, ஒவ்வொரு `<input>`-யும் [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag-க்குள் வைப்பீர்கள். இந்த label அந்த input-உடன் தொடர்புடையது என்பதை இது browser-க்கு தெரிவிக்கிறது. பயனர் label-ஐ click செய்யும்போது, browser input-க்கு தானாக focus செய்கிறது. Accessibility-க்கும் இது அவசியம்: பயனர் தொடர்புடைய input-க்கு focus செய்தால் screen reader label caption-ஐ announce செய்யும்.

`<input>`-ஐ `<label>`-க்குள் nest செய்ய முடியாவிட்டால், `<input id>` மற்றும் [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) இரண்டிற்கும் அதே ID-ஐ pass செய்து அவற்றை associate செய்யவும். ஒரே component-ன் பல instances இடையே conflicts தவிர்க்க, அத்தகைய ID-ஐ [`useId`](/reference/react/useId) மூலம் generate செய்யவும்.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        உங்கள் முதல் பெயர்:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>உங்கள் வயது:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Input-க்கு initial value வழங்குதல் {/*providing-an-initial-value-for-an-input*/}

எந்த input-க்கும் initial value-ஐ விருப்பமாக குறிப்பிடலாம். Text inputs-க்கு அதை `defaultValue` string ஆக pass செய்யவும். Checkboxes மற்றும் radio buttons, அதற்கு பதிலாக `defaultChecked` boolean மூலம் initial value குறிப்பிட வேண்டும்.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="ஆரம்ப value ஒன்று" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Form submit செய்யும்போது input values-ஐ படித்தல் {/*reading-the-input-values-when-submitting-a-form*/}

உங்கள் inputs-ஐச் சுற்றி [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ஒன்றையும், அதன் உள்ளே [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) ஒன்றையும் சேர்க்கவும். இது உங்கள் `<form onSubmit>` event handler-ஐ call செய்யும். Default ஆக, browser form data-வை current URL-க்கு அனுப்பி page-ஐ refresh செய்யும். `e.preventDefault()` call செய்து அந்த behavior-ஐ override செய்யலாம். [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) மூலம் form data-வை படிக்கவும்.

<Sandpack>

```js
export default function MyForm() {
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
        Text input: <input name="myInput" defaultValue="ஆரம்ப value ஒன்று" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Form reset செய்</button>
      <button type="submit">Form submit செய்</button>
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

ஒவ்வொரு `<input>`-க்கும் `name` கொடுக்கவும், உதாரணமாக `<input name="firstName" defaultValue="Taylor" />`. நீங்கள் குறிப்பிட்ட `name` form data-வில் key ஆக பயன்படுத்தப்படும், உதாரணமாக `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Default ஆக, `type` attribute இல்லாத `<form>`-க்குள் உள்ள `<button>` அதை submit செய்யும். இது எதிர்பாராததாக இருக்கலாம்! உங்கள் சொந்த custom `Button` React component இருந்தால், `<button>` (type இல்லாமல்) பயன்படுத்துவதற்கு பதிலாக [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) பயன்படுத்த பரிசீலிக்கவும். பின்னர், தெளிவாக இருக்க, form submit செய்ய வேண்டிய buttons-க்கு `<button type="submit">` பயன்படுத்தவும்.

</Pitfall>

---

### State variable கொண்டு input-ஐ control செய்தல் {/*controlling-an-input-with-a-state-variable*/}

`<input />` போன்ற input *uncontrolled* ஆகும். `<input defaultValue="Initial text" />` போன்ற [initial value](#providing-an-initial-value-for-an-input)-ஐ pass செய்தாலும், உங்கள் JSX initial value-ஐ மட்டுமே குறிப்பிடுகிறது. இப்போது value என்னாக இருக்க வேண்டும் என்பதை அது control செய்யாது.

**_Controlled_ input ஒன்றை render செய்ய, அதற்கு `value` prop pass செய்யவும் (checkboxes மற்றும் radios-க்கு `checked`).** நீங்கள் pass செய்த `value` input-இல் எப்போதும் இருக்கும்படி React force செய்யும். பொதுவாக, [state variable](/reference/react/useState) ஒன்றை declare செய்து இதைச் செய்வீர்கள்:

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // State variable ஒன்றை declare செய்யவும்...
  // ...
  return (
    <input
      value={firstName} // ...input value state variable-க்கு match ஆக force செய்யவும்...
      onChange={e => setFirstName(e.target.value)} // ...மேலும் எந்த edits வந்தாலும் state variable-ஐ update செய்யவும்!
    />
  );
}
```

எப்படியும் state தேவைப்பட்டிருந்தால் controlled input பொருத்தமானது. உதாரணமாக, ஒவ்வொரு edit-க்கும் UI-ஐ re-render செய்ய:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        முதல் பெயர்:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>உங்கள் பெயர் {firstName}.</p>}
      ...
```

Input state-ஐ adjust செய்ய பல வழிகள் வழங்க விரும்பினாலும் இது பயனுள்ளதாகும் (உதாரணமாக, button click செய்வதன் மூலம்):

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        வயது:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          10 ஆண்டுகள் சேர்க்கவும்
        </button>
```

Controlled components-க்கு pass செய்யும் `value` `undefined` அல்லது `null` ஆக இருக்கக்கூடாது. Initial value காலியாக இருக்க வேண்டுமானால் (கீழே உள்ள `firstName` field போல), உங்கள் state variable-ஐ empty string (`''`) ஆக initialize செய்யவும்.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        முதல் பெயர்:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        வயது:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          10 ஆண்டுகள் சேர்க்கவும்
        </button>
      </label>
      {firstName !== '' &&
        <p>உங்கள் பெயர் {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>உங்கள் வயது {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**`onChange` இல்லாமல் `value` pass செய்தால், input-க்குள் type செய்வது முடியாது.** ஒரு input-க்கு ஏதாவது `value` pass செய்து அதை control செய்யும்போது, நீங்கள் pass செய்த value எப்போதும் இருக்கும்படி அதை *force* செய்கிறீர்கள். எனவே state variable-ஐ `value` ஆக pass செய்து, ஆனால் `onChange` event handler-இன் போது அந்த state variable-ஐ synchronously update செய்ய மறந்தால், ஒவ்வொரு keystroke-க்கும் பிறகு React input-ஐ நீங்கள் குறிப்பிட்ட `value`-க்கே மீண்டும் மாற்றிவிடும்.

</Pitfall>

---

### ஒவ்வொரு keystroke-க்கும் re-rendering optimize செய்தல் {/*optimizing-re-rendering-on-every-keystroke*/}

Controlled input பயன்படுத்தும்போது, ஒவ்வொரு keystroke-க்கும் state set செய்கிறீர்கள். உங்கள் state கொண்ட component பெரிய tree ஒன்றை re-render செய்தால், இது மெதுவாகலாம். Re-rendering performance optimize செய்ய சில வழிகள் உள்ளன.

உதாரணமாக, ஒவ்வொரு keystroke-க்கும் எல்லா page content-ஐயும் re-render செய்யும் form ஒன்றுடன் தொடங்குகிறீர்கள் எனக் கொள்ளுங்கள்:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

`<PageContent />` input state-ஐ சார்ந்திராததால், input state-ஐ அதன் சொந்த component-க்குள் நகர்த்தலாம்:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

இது performance-ஐ குறிப்பிடத்தக்க அளவு மேம்படுத்துகிறது; ஏனெனில் இப்போது ஒவ்வொரு keystroke-க்கும் `SignupForm` மட்டும் re-render ஆகும்.

Re-rendering தவிர்க்க முடியாத சூழல் இருந்தால் (உதாரணமாக, `PageContent` search input-ன் value-ஐ சார்ந்திருந்தால்), பெரிய re-render நடக்கும் நடுவிலும் controlled input responsive ஆக இருக்க [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) உதவுகிறது.

---

## Troubleshooting {/*troubleshooting*/}

### நான் type செய்யும்போது என் text input update ஆகவில்லை {/*my-text-input-doesnt-update-when-i-type-into-it*/}

`value` உடன் ஆனால் `onChange` இல்லாமல் input render செய்தால், console-இல் error காண்பீர்கள்:

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Error message கூறுவது போல, நீங்கள் [*initial* value-ஐ மட்டும் குறிப்பிட](#providing-an-initial-value-for-an-input) விரும்பினால், அதற்கு பதிலாக `defaultValue` pass செய்யவும்:

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

[இந்த input-ஐ state variable கொண்டு control](#controlling-an-input-with-a-state-variable) செய்ய விரும்பினால், `onChange` handler ஒன்றை குறிப்பிடவும்:

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

Value திட்டமிட்டே read-only ஆக இருந்தால், error-ஐ suppress செய்ய `readOnly` prop சேர்க்கவும்:

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### Click செய்தால் என் checkbox update ஆகவில்லை {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

`checked` உடன் ஆனால் `onChange` இல்லாமல் checkbox render செய்தால், console-இல் error காண்பீர்கள்:

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

Error message கூறுவது போல, நீங்கள் [*initial* value-ஐ மட்டும் குறிப்பிட](#providing-an-initial-value-for-an-input) விரும்பினால், அதற்கு பதிலாக `defaultChecked` pass செய்யவும்:

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

[இந்த checkbox-ஐ state variable கொண்டு control](#controlling-an-input-with-a-state-variable) செய்ய விரும்பினால், `onChange` handler ஒன்றை குறிப்பிடவும்:

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Checkboxes-க்கு `e.target.value`-க்கு பதிலாக `e.target.checked` படிக்க வேண்டும்.

</Pitfall>

Checkbox திட்டமிட்டே read-only ஆக இருந்தால், error-ஐ suppress செய்ய `readOnly` prop சேர்க்கவும்:

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### ஒவ்வொரு keystroke-க்கும் என் input caret தொடக்கத்துக்கு தாவுகிறது {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

நீங்கள் [input-ஐ control](#controlling-an-input-with-a-state-variable) செய்தால், `onChange` போது அதன் state variable-ஐ DOM-இலிருந்து வரும் input value-க்கு update செய்ய வேண்டும்.

அதை `e.target.value` அல்லாத வேறு ஒன்றாக update செய்ய முடியாது (checkboxes-க்கு `e.target.checked`):

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

இது பிரச்சினையை சரிசெய்யவில்லை என்றால், ஒவ்வொரு keystroke-க்கும் input DOM-இலிருந்து அகற்றப்பட்டு மீண்டும் சேர்க்கப்படுவது சாத்தியம். ஒவ்வொரு re-render-க்கும் நீங்கள் தவறுதலாக [state-ஐ reset](/learn/preserving-and-resetting-state) செய்தால் இது நடக்கலாம்; உதாரணமாக, input அல்லது அதன் parents-இல் ஒன்று எப்போதும் வேறு `key` attribute பெறும்போது, அல்லது component function definitions-ஐ nest செய்தால் (இது supported அல்ல; "inner" component எப்போதும் வேறு tree ஆகக் கருதப்படும்).

---

### எனக்கு error வருகிறது: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Component-க்கு `value` வழங்கினால், அது அதன் lifetime முழுவதும் string ஆகவே இருக்க வேண்டும்.

முதலில் `value={undefined}` pass செய்து, பின்னர் `value="some string"` pass செய்ய முடியாது; ஏனெனில் component uncontrolled ஆக இருக்க வேண்டுமா அல்லது controlled ஆக இருக்க வேண்டுமா என்பதை React அறியாது. Controlled component எப்போதும் string `value` பெற வேண்டும்; `null` அல்லது `undefined` அல்ல.

உங்கள் `value` API அல்லது state variable-இலிருந்து வந்தால், அது `null` அல்லது `undefined` ஆக initialized ஆகியிருக்கலாம். அப்படியானால், முதலில் அதை empty string (`''`) ஆக set செய்யவும், அல்லது `value` string என்பதை உறுதிசெய்ய `value={someValue ?? ''}` pass செய்யவும்.

அதேபோல், checkbox-க்கு `checked` pass செய்தால், அது எப்போதும் boolean என்பதை உறுதிசெய்யவும்.
