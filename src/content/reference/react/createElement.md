---
title: createElement
---

<Intro>

`createElement` ஒரு React element உருவாக்க உதவுகிறது. இது [JSX](/learn/writing-markup-with-jsx) எழுதுவதற்கான மாற்று வழியாக செயல்படுகிறது.

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

கொடுக்கப்பட்ட `type`, `props`, மற்றும் `children` உடன் React element உருவாக்க `createElement`-ஐ call செய்யுங்கள்.

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `type`: `type` argument valid React component type ஆக இருக்க வேண்டும். உதாரணமாக, அது tag name string (`'div'` அல்லது `'span'` போன்றது), அல்லது React component (function, class, அல்லது [`Fragment`](/reference/react/Fragment) போன்ற special component) ஆக இருக்கலாம்.

* `props`: `props` argument object அல்லது `null` ஆக இருக்க வேண்டும். நீங்கள் `null` pass செய்தால், அது empty object போலவே நடத்தப்படும். நீங்கள் pass செய்த `props`-க்கு பொருந்தும் props உடன் React element உருவாக்கும். உங்கள் `props` object-இலுள்ள `ref` மற்றும் `key` special; அவை return செய்யப்பட்ட `element`-இல் `element.props.ref` மற்றும் `element.props.key` ஆக *கிடைக்காது*. அவை `element.ref` மற்றும் `element.key` ஆக கிடைக்கும்.

* **optional** `...children`: பூஜ்யம் அல்லது அதற்கு மேற்பட்ட child nodes. அவை React elements, strings, numbers, [portals](/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, மற்றும் `false`), மற்றும் React nodes-ன் arrays உட்பட எந்த React nodes ஆகவும் இருக்கலாம்.

#### Returns {/*returns*/}

`createElement` சில properties கொண்ட React element object-ஐ return செய்கிறது:

* `type`: நீங்கள் pass செய்த `type`.
* `props`: `ref` மற்றும் `key` தவிர நீங்கள் pass செய்த `props`.
* `ref`: நீங்கள் pass செய்த `ref`. இல்லையெனில் `null`.
* `key`: நீங்கள் pass செய்த `key`, string ஆக coerced செய்யப்பட்டது. இல்லையெனில் `null`.

பொதுவாக, உங்கள் component-இலிருந்து element-ஐ return செய்வீர்கள் அல்லது அதை மற்றொரு element-ன் child ஆக்குவீர்கள். Element-ன் properties-ஐ நீங்கள் read செய்யலாம் என்றாலும், element உருவாக்கப்பட்ட பிறகு அதை opaque ஆகக் கருதி render செய்வதே சிறந்தது.

#### Caveats {/*caveats*/}

* **React elements மற்றும் அவற்றின் props-ஐ [immutable](https://en.wikipedia.org/wiki/Immutable_object) ஆக நடத்த வேண்டும்**; உருவாக்கப்பட்ட பிறகு அவற்றின் contents-ஐ மாற்றக்கூடாது. Development-இல், இதை enforce செய்ய React return செய்யப்பட்ட element மற்றும் அதன் `props` property-ஐ shallow-ஆக [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) செய்யும்.

* JSX பயன்படுத்தும்போது, **உங்கள் சொந்த custom component-ஐ render செய்ய tag capital letter-ஆல் தொடங்க வேண்டும்.** வேறு வார்த்தைகளில், `<Something />` என்பது `createElement(Something)`-க்கு equivalent; ஆனால் `<something />` (lowercase) என்பது `createElement('something')`-க்கு equivalent (இது string என்பதால் built-in HTML tag ஆக நடத்தப்படும்).

* **எல்லா children-உம் statically known ஆக இருந்தால் மட்டுமே** `createElement('h1', {}, child1, child2, child3)` போல `createElement`-க்கு children-ஐ பல arguments ஆக pass செய்யுங்கள். உங்கள் children dynamic என்றால், முழு array-ஐ மூன்றாவது argument ஆக pass செய்யுங்கள்: `createElement('ul', {}, listItems)`. இதனால் dynamic lists-க்கு missing `key`s பற்றி React [warning வழங்கும்](/learn/rendering-lists#keeping-list-items-in-order-with-key). Static lists-க்கு இது அவசியமில்லை; ஏனெனில் அவை reorder ஆகாது.

---

## பயன்பாடு {/*usage*/}

### JSX இல்லாமல் element உருவாக்குதல் {/*creating-an-element-without-jsx*/}

[JSX](/learn/writing-markup-with-jsx) உங்களுக்கு பிடிக்கவில்லை அல்லது உங்கள் project-இல் பயன்படுத்த முடியவில்லை என்றால், மாற்று வழியாக `createElement`-ஐப் பயன்படுத்தலாம்.

JSX இல்லாமல் element உருவாக்க, சில <CodeStep step={1}>type</CodeStep>, <CodeStep step={2}>props</CodeStep>, மற்றும் <CodeStep step={3}>children</CodeStep> உடன் `createElement`-ஐ call செய்யுங்கள்:

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep> optional; உங்களுக்கு தேவையான அளவு pass செய்யலாம் (மேலுள்ள உதாரணத்தில் மூன்று children உள்ளன). இந்த code greeting உடன் ஒரு `<h1>` header-ஐ display செய்யும். ஒப்பிடுவதற்காக, அதே உதாரணம் JSX-இல் இங்கே மறுபடியும் எழுதப்பட்டுள்ளது:

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

உங்கள் சொந்த React component-ஐ render செய்ய, `'h1'` போன்ற string-க்கு பதிலாக `Greeting` போன்ற function-ஐ <CodeStep step={1}>type</CodeStep> ஆக pass செய்யுங்கள்:

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

JSX உடன் இது இவ்வாறு இருக்கும்:

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

`createElement` கொண்டு எழுதப்பட்ட முழு உதாரணம் இங்கே:

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

அதே உதாரணம் JSX பயன்படுத்தி இங்கே எழுதப்பட்டுள்ளது:

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

இரண்டு coding styles-உம் சரியானவை; உங்கள் project-க்கு விருப்பமானதை பயன்படுத்தலாம். `createElement`-ஐ ஒப்பிடும்போது JSX பயன்படுத்துவதின் முக்கிய நன்மை, எந்த closing tag எந்த opening tag-க்கு பொருந்துகிறது என்பதை நேரடியாகப் பார்க்க முடிவது.

<DeepDive>

#### React element என்றால் உண்மையில் என்ன? {/*what-is-a-react-element-exactly*/}

Element என்பது user interface-ன் ஒரு பகுதியை விவரிக்கும் lightweight description. உதாரணமாக, `<Greeting name="Taylor" />` மற்றும் `createElement(Greeting, { name: 'Taylor' })` இரண்டும் இதுபோன்ற object-ஐ உருவாக்கும்:

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**இந்த object-ஐ உருவாக்குவது `Greeting` component-ஐ render செய்யவோ DOM elements உருவாக்கவோ செய்யாது என்பதை கவனியுங்கள்.**

React element என்பது ஒரு description போன்றது; `Greeting` component-ஐ பின்னர் render செய்ய React-க்கு கொடுக்கப்படும் instruction. உங்கள் `App` component-இலிருந்து இந்த object-ஐ return செய்வதன் மூலம், அடுத்ததாக என்ன செய்ய வேண்டும் என்பதை React-க்கு சொல்கிறீர்கள்.

Elements உருவாக்குவது மிகக் குறைந்த செலவுடையது; அதனால் அதை optimize செய்யவோ தவிர்க்கவோ முயற்சிக்கத் தேவையில்லை.

</DeepDive>
