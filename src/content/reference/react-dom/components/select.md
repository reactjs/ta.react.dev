---
title: "<select>"
---

<Intro>

[Built-in browser `<select>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select), options கொண்ட select box render செய்ய அனுமதிக்கிறது.

```js
<select>
  <option value="someOption">சில option</option>
  <option value="otherOption">மற்ற option</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<select>` {/*select*/}

Select box display செய்ய, [built-in browser `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) component-ஐ render செய்யவும்.

```js
<select>
  <option value="someOption">சில option</option>
  <option value="otherOption">மற்ற option</option>
</select>
```

[கீழே மேலும் examples பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<select>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ support செய்கிறது.

`value` prop pass செய்வதன் மூலம் [select box-ஐ controlled ஆக்கலாம்](#controlling-a-select-box-with-a-state-variable):

* `value`: String (அல்லது [`multiple={true}`](#enabling-multiple-selection)-க்கு strings array). எந்த option selected என்பதை control செய்கிறது. ஒவ்வொரு value string-மும் `<select>` உள்ளே nested இருக்கும் ஏதேனும் `<option>`-ன் `value`-க்கு match ஆக வேண்டும்.

`value` pass செய்தால், அந்த passed value-ஐ update செய்யும் `onChange` handler-யையும் pass செய்ய வேண்டும்.

உங்கள் `<select>` uncontrolled என்றால், அதற்கு பதிலாக `defaultValue` prop pass செய்யலாம்:

* `defaultValue`: String (அல்லது [`multiple={true}`](#enabling-multiple-selection)-க்கு strings array). [Initially selected option](#providing-an-initially-selected-option)-ஐ specify செய்கிறது.

இந்த `<select>` props uncontrolled மற்றும் controlled select boxes இரண்டுக்கும் relevant:

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): String. சாத்தியமான [autocomplete behaviors](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)-ல் ஒன்றை specify செய்கிறது.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Boolean. `true` என்றால், mount போது React element-ஐ focus செய்யும்.
* `children`: `<select>` children ஆக [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), மற்றும் [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) components-ஐ ஏற்கிறது. இறுதியில் allowed components-ல் ஒன்றை render செய்தால் உங்கள் சொந்த components-யையும் pass செய்யலாம். இறுதியில் `<option>` tags render செய்யும் உங்கள் சொந்த components pass செய்தால், நீங்கள் render செய்யும் ஒவ்வொரு `<option>`-க்கும் `value` இருக்க வேண்டும்.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Boolean. `true` என்றால், select box interactive ஆக இருக்காது; dimmed ஆக தோன்றும்.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): String. இந்த select box சேர்ந்துள்ள `<form>`-ன் `id`-ஐ specify செய்கிறது. Omit செய்தால், closest parent form.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Boolean. `true` என்றால், browser [multiple selection](#enabling-multiple-selection)-ஐ அனுமதிக்கும்.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): String. [Form உடன் submit செய்யப்படும்](#reading-the-select-box-value-when-submitting-a-form) இந்த select box-க்கான name-ஐ specify செய்கிறது.
* `onChange`: [`Event` handler](/reference/react-dom/components/common#event-handler) function. [Controlled select boxes](#controlling-a-select-box-with-a-state-variable)-க்கு required. User வேறு option pick செய்தவுடன் உடனடியாக fires ஆகும். Browser [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) போல behave செய்கிறது.
* `onChangeCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onChange` version.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. User value மாற்றியவுடன் உடனடியாக fires ஆகும். Historical reasons காரணமாக, React-இல் இதற்கு பதிலாக similarly work செய்யும் `onChange` பயன்படுத்துவது idiomatic.
* `onInputCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onInput` version.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` handler](/reference/react-dom/components/common#event-handler) function. Form submit போது input validation fail ஆனால் fires ஆகும். Built-in `invalid` event-க்கு மாறாக, React `onInvalid` event bubbles.
* `onInvalidCapture`: [Capture phase](/learn/responding-to-events#capture-phase-events)-இல் fire ஆகும் `onInvalid` version.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Boolean. `true` என்றால், form submit செய்ய value வழங்கப்பட வேண்டும்.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Number. `multiple={true}` selects-க்கு, initially visible items-ன் preferred number-ஐ specify செய்கிறது.

#### Caveats {/*caveats*/}

- HTML-இல் போல அல்லாமல், `<option>`-க்கு `selected` attribute pass செய்வது supported இல்லை. அதற்கு பதிலாக uncontrolled select boxes-க்கு [`<select defaultValue>`](#providing-an-initially-selected-option) மற்றும் controlled select boxes-க்கு [`<select value>`](#controlling-a-select-box-with-a-state-variable) பயன்படுத்தவும்.
- Select box `value` prop பெற்றால், அது [controlled ஆக treat செய்யப்படும்](#controlling-a-select-box-with-a-state-variable).
- Select box ஒரே நேரத்தில் controlled மற்றும் uncontrolled ஆக இருக்க முடியாது.
- Select box அதன் lifetime-இல் controlled அல்லது uncontrolled இடையே switch செய்ய முடியாது.
- ஒவ்வொரு controlled select box-க்கும் அதன் backing value-ஐ synchronously update செய்யும் `onChange` event handler தேவை.

---

## Usage {/*usage*/}

### Options உடன் select box display செய்தல் {/*displaying-a-select-box-with-options*/}

Select box display செய்ய, உள்ளே `<option>` components list உடன் `<select>` render செய்யவும். Form உடன் submit செய்ய வேண்டிய data-வை represent செய்ய ஒவ்வொரு `<option>`-க்கும் `value` கொடுக்கவும்.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      ஒரு பழம் தேர்வு செய்யுங்கள்:
      <select name="selectedFruit">
        <option value="apple">ஆப்பிள்</option>
        <option value="banana">வாழைப்பழம்</option>
        <option value="orange">ஆரஞ்சு</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

---

### Select box-க்கு label வழங்குதல் {/*providing-a-label-for-a-select-box*/}

பொதுவாக, ஒவ்வொரு `<select>`-யையும் [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag உள்ளே வைப்பீர்கள். இந்த label அந்த select box உடன் associated என்று browser-க்கு இது சொல்கிறது. User label click செய்தால், browser select box-ஐ automatically focus செய்யும். Accessibility-க்கும் இது அவசியம்: user select box-ஐ focus செய்யும்போது screen reader label caption-ஐ announce செய்யும்.

`<select>`-ஐ `<label>`-க்குள் nest செய்ய முடியாவிட்டால், `<select id>` மற்றும் [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)-க்கு அதே ID pass செய்து associate செய்யவும். ஒரே component-ன் multiple instances இடையே conflicts தவிர்க்க, அப்படியான ID-ஐ [`useId`](/reference/react/useId) மூலம் generate செய்யவும்.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        ஒரு பழம் தேர்வு செய்யுங்கள்:
        <select name="selectedFruit">
          <option value="apple">ஆப்பிள்</option>
          <option value="banana">வாழைப்பழம்</option>
          <option value="orange">ஆரஞ்சு</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        ஒரு காய்கறி தேர்வு செய்யுங்கள்:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">வெள்ளரிக்காய்</option>
        <option value="corn">சோளம்</option>
        <option value="tomato">தக்காளி</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Initially selected option வழங்குதல் {/*providing-an-initially-selected-option*/}

Default ஆக, browser list-இல் உள்ள முதல் `<option>`-ஐ select செய்யும். வேறு option-ஐ default ஆக select செய்ய, அந்த `<option>`-ன் `value`-ஐ `<select>` element-க்கு `defaultValue` ஆக pass செய்யவும்.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      ஒரு பழம் தேர்வு செய்யுங்கள்:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">ஆப்பிள்</option>
        <option value="banana">வாழைப்பழம்</option>
        <option value="orange">ஆரஞ்சு</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>

<Pitfall>

HTML-இல் போல அல்லாமல், தனிப்பட்ட `<option>`-க்கு `selected` attribute pass செய்வது supported இல்லை.

</Pitfall>

---

### Multiple selection enable செய்தல் {/*enabling-multiple-selection*/}

User multiple options select செய்ய, `<select>`-க்கு `multiple={true}` pass செய்யவும். அந்த case-இல், initially selected options தேர்வு செய்ய `defaultValue`-யும் specify செய்தால், அது array ஆக இருக்க வேண்டும்.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      சில பழங்களை தேர்வு செய்யுங்கள்:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">ஆப்பிள்</option>
        <option value="banana">வாழைப்பழம்</option>
        <option value="orange">ஆரஞ்சு</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Form submit செய்யும்போது select box value படித்தல் {/*reading-the-select-box-value-when-submitting-a-form*/}

உங்கள் select box சுற்றி [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) சேர்த்து, உள்ளே [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) வைக்கவும். இது உங்கள் `<form onSubmit>` event handler-ஐ call செய்யும். Default ஆக, browser form data-வை current URL-க்கு அனுப்பி page refresh செய்யும். `e.preventDefault()` call செய்து அந்த behavior-ஐ override செய்யலாம். [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) மூலம் form data படிக்கவும்.
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
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) இதில் multiple select values சேராது
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        உங்களுக்கு பிடித்த பழம் தேர்வு செய்யுங்கள்:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">ஆப்பிள்</option>
          <option value="banana">வாழைப்பழம்</option>
          <option value="orange">ஆரஞ்சு</option>
        </select>
      </label>
      <label>
        உங்களுக்கு பிடித்த எல்லா காய்கறிகளையும் தேர்வு செய்யுங்கள்:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">வெள்ளரிக்காய்</option>
          <option value="corn">சோளம்</option>
          <option value="tomato">தக்காளி</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

உங்கள் `<select>`-க்கு `name` கொடுக்கவும், உதாரணமாக `<select name="selectedFruit" />`. நீங்கள் specify செய்த `name`, form data-இல் key ஆக பயன்படுத்தப்படும், உதாரணமாக `{ selectedFruit: "orange" }`.

`<select multiple={true}>` பயன்படுத்தினால், form-இலிருந்து படிக்கும் [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ஒவ்வொரு selected value-யையும் தனித்த name-value pair ஆக include செய்யும். மேலுள்ள example-இல் console logs-ஐ கவனமாகப் பாருங்கள்.

</Note>

<Pitfall>

Default ஆக, `<form>` உள்ளே உள்ள *எந்த* `<button>`-யும் அதை submit செய்யும். இது ஆச்சரியமாக இருக்கலாம்! உங்களுக்கென custom `Button` React component இருந்தால், `<button>` பதிலாக [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) return செய்வதைப் பரிசீலிக்கவும். பின்னர் explicit ஆக, form submit செய்ய வேண்டிய buttons-க்கு `<button type="submit">` பயன்படுத்தவும்.

</Pitfall>

---

### State variable மூலம் select box control செய்தல் {/*controlling-a-select-box-with-a-state-variable*/}

`<select />` போன்ற select box *uncontrolled*. `<select defaultValue="orange" />` போல [initially selected value pass செய்தாலும்](#providing-an-initially-selected-option), உங்கள் JSX initial value-ஐ மட்டுமே specify செய்கிறது; இப்போது உள்ள value-ஐ அல்ல.

**_Controlled_ select box render செய்ய, அதற்கு `value` prop pass செய்யவும்.** React select box எப்போதும் நீங்கள் pass செய்த `value` வைத்திருக்க force செய்யும். பொதுவாக, [state variable](/reference/react/useState) declare செய்து select box-ஐ control செய்வீர்கள்:

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // State variable declare செய்க...
  // ...
  return (
    <select
      value={selectedFruit} // ...select value state variable-க்கு match ஆக force செய்க...
      onChange={e => setSelectedFruit(e.target.value)} // ...மற்றும் எந்த change ஆனாலும் state variable update செய்க!
    >
      <option value="apple">ஆப்பிள்</option>
      <option value="banana">வாழைப்பழம்</option>
      <option value="orange">ஆரஞ்சு</option>
    </select>
  );
}
```

ஒவ்வொரு selection-க்கும் response ஆக UI-ன் ஒரு பகுதியை re-render செய்ய விரும்பினால் இது பயனுள்ளதாகும்.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        ஒரு பழம் தேர்வு செய்யுங்கள்:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">ஆப்பிள்</option>
          <option value="banana">வாழைப்பழம்</option>
          <option value="orange">ஆரஞ்சு</option>
        </select>
      </label>
      <hr />
      <label>
        உங்களுக்கு பிடித்த எல்லா காய்கறிகளையும் தேர்வு செய்யுங்கள்:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">வெள்ளரிக்காய்</option>
          <option value="corn">சோளம்</option>
          <option value="tomato">தக்காளி</option>
        </select>
      </label>
      <hr />
      <p>உங்களுக்கு பிடித்த பழம்: {selectedFruit}</p>
      <p>உங்களுக்கு பிடித்த காய்கறிகள்: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**`onChange` இல்லாமல் `value` pass செய்தால், option select செய்வது impossible ஆகும்.** Select box-ஐ `value` pass செய்து control செய்யும்போது, நீங்கள் pass செய்த value அதற்கு எப்போதும் இருக்க வேண்டும் என்று _force_ செய்கிறீர்கள். எனவே `value` ஆக state variable pass செய்து, `onChange` event handler போது அந்த state variable-ஐ synchronously update செய்ய மறந்தால், ஒவ்வொரு keystroke பிறகும் React select box-ஐ நீங்கள் specify செய்த `value`-க்கு revert செய்யும்.

HTML-இல் போல அல்லாமல், தனிப்பட்ட `<option>`-க்கு `selected` attribute pass செய்வது supported இல்லை.

</Pitfall>
