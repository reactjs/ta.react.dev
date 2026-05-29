---
title: "<option>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<select>`](/reference/react-dom/components/select) box-க்குள் option ஒன்றை render செய்ய உதவுகிறது.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<option>` {/*option*/}

[உலாவியில் உள்ளமைந்த `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<select>`](/reference/react-dom/components/select) box-க்குள் option ஒன்றை render செய்ய உதவுகிறது.

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<option>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ ஆதரிக்கிறது.

மேலும், `<option>` இந்த props-ஐ ஆதரிக்கிறது:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): ஒரு boolean. `true` என்றால், அந்த option தேர்ந்தெடுக்க முடியாததாக இருக்கும் மற்றும் மங்கலாகத் தோன்றும்.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): ஒரு string. Option-இன் பொருளை குறிப்பிடுகிறது. குறிப்பிடப்படவில்லை என்றால், option உள்ளே இருக்கும் text பயன்படுத்தப்படும்.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): இந்த option தேர்ந்தெடுக்கப்பட்டிருந்தால், [parent `<select>` form-இல் submit செய்யப்படும் போது](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) பயன்படுத்தப்படும் value.

#### Caveats {/*caveats*/}

* `<option>`-இல் `selected` attribute-ஐ React ஆதரிக்காது. அதற்கு பதிலாக, uncontrolled select box-க்கு parent [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)-க்கு, அல்லது controlled select-க்கு [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)-க்கு இந்த option-இன் `value`-ஐ pass செய்யுங்கள்.

---

## Usage {/*usage*/}

### Options உடன் select box காட்டுதல் {/*displaying-a-select-box-with-options*/}

Select box ஒன்றைக் காட்ட, உள்ளே `<option>` components பட்டியலுடன் `<select>`-ஐ render செய்யுங்கள். Form-உடன் submit செய்யப்பட வேண்டிய data-வை குறிக்கும் `value` ஒன்றை ஒவ்வொரு `<option>`-க்கும் கொடுங்கள்.

[விருப்பங்கள் பட்டியலுடன் `<select>`-ஐ காட்டுவது பற்றி மேலும் படிக்கவும்.](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>
