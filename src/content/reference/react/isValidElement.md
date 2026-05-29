---
title: isValidElement
---

<Intro>

ஒரு value React element ஆக உள்ளதா என்பதை `isValidElement` சரிபார்க்கிறது.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

`value` React element ஆக உள்ளதா என்பதைச் சரிபார்க்க `isValidElement(value)`-ஐ அழைக்கவும்.

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `value`: நீங்கள் சரிபார்க்க விரும்பும் `value`. இது எந்த type-இன் value ஆகவும் இருக்கலாம்.

#### Returns {/*returns*/}

`value` React element என்றால் `isValidElement` `true` return செய்யும். இல்லையெனில் `false` return செய்யும்.

#### Caveats {/*caveats*/}

* **[JSX tags](/learn/writing-markup-with-jsx) மற்றும் [`createElement`](/reference/react/createElement) return செய்யும் objects மட்டுமே React elements ஆகக் கருதப்படுகின்றன.** உதாரணமாக, `42` போன்ற number ஒரு செல்லுபடியாகும் React *node* (மேலும் component-இலிருந்து return செய்யப்படலாம்) என்றாலும், அது செல்லுபடியாகும் React element அல்ல. Arrays மற்றும் [`createPortal`](/reference/react-dom/createPortal) மூலம் உருவாக்கப்பட்ட portals-உம் React elements ஆகக் கருதப்படாது.

---

## Usage {/*usage*/}

### ஏதாவது ஒன்று React element ஆக உள்ளதா என்று சரிபார்த்தல் {/*checking-if-something-is-a-react-element*/}

ஒரு value *React element* ஆக உள்ளதா என்பதைச் சரிபார்க்க `isValidElement`-ஐ அழைக்கவும்.

React elements:

- [JSX tag](/learn/writing-markup-with-jsx) எழுதுவதால் உருவாகும் values
- [`createElement`](/reference/react/createElement) அழைப்பதால் உருவாகும் values

React elements-க்கு, `isValidElement` `true` return செய்யும்:

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX tags are React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Values returned by createElement are React elements
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Strings, numbers, அல்லது arbitrary objects மற்றும் arrays போன்ற பிற values React elements அல்ல.

அவற்றுக்கு `isValidElement` `false` return செய்யும்:

```js
// ❌ These are *not* React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement` தேவைப்படுவது மிகவும் அரிது. [`cloneElement`](/reference/react/cloneElement) போல elements மட்டுமே ஏற்கும் மற்றொரு API-யை அழைக்கும் போது, உங்கள் argument React element அல்லாதபோது error தவிர்க்க விரும்பினால் இது பெரும்பாலும் பயனுள்ளதாக இருக்கும்.

`isValidElement` check சேர்க்க மிகவும் குறிப்பிட்ட காரணம் இல்லாவிட்டால், உங்களுக்கு இது தேவையில்லாமல் இருக்கலாம்.

<DeepDive>

#### React elements vs React nodes {/*react-elements-vs-react-nodes*/}

ஒரு component எழுதும்போது, அதிலிருந்து எந்த வகை *React node*-ஐயும் return செய்யலாம்:

```js
function MyComponent() {
  // ... you can return any React node ...
}
```

React node ஆக இருக்கக்கூடியவை:

- `<div />` அல்லது `createElement('div')` போன்ற முறையில் உருவாக்கப்பட்ட React element
- [`createPortal`](/reference/react-dom/createPortal) மூலம் உருவாக்கப்பட்ட portal
- String
- Number
- `true`, `false`, `null`, அல்லது `undefined` (இவை காட்டப்படாது)
- பிற React nodes கொண்ட array

**`isValidElement` argument *React element* ஆக உள்ளதா என்பதையே சரிபார்க்கிறது; அது React node ஆக உள்ளதா என்பதை அல்ல என்பதை கவனிக்கவும்.** உதாரணமாக, `42` செல்லுபடியாகும் React element அல்ல. ஆனால் அது முழுமையாக செல்லுபடியாகும் React node:

```js
function MyComponent() {
  return 42; // Component-இலிருந்து number return செய்வது சரி
}
```

இதனால், ஏதாவது ஒன்று render செய்யப்படுமா என்பதைச் சரிபார்க்க `isValidElement`-ஐப் பயன்படுத்தக்கூடாது.

</DeepDive>
