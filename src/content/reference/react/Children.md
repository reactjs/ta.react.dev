---
title: Children
---

<Pitfall>

`Children` பயன்படுத்துவது அரிதானது, மேலும் fragile code-க்கு வழிவகுக்கலாம். [பொதுவான alternatives-ஐப் பார்க்கவும்.](#alternatives)

</Pitfall>

<Intro>

[`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children) ஆக நீங்கள் பெற்ற JSX-ஐ manipulate செய்து transform செய்ய `Children` உதவுகிறது.

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `Children.count(children)` {/*children-count*/}

`children` data structure-இல் உள்ள children எண்ணிக்கையை count செய்ய `Children.count(children)`-ஐ call செய்யுங்கள்.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>மொத்த rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[கீழே மேலும் examples பார்க்கவும்.](#counting-children)

#### அளவுருக்கள் {/*children-count-parameters*/}

* `children`: உங்கள் component பெற்ற [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)-ன் value.

#### திருப்பி அளிப்பது {/*children-count-returns*/}

இந்த `children`-க்குள் உள்ள nodes எண்ணிக்கை.

#### கவனிக்க வேண்டியவை {/*children-count-caveats*/}

- Empty nodes (`null`, `undefined`, மற்றும் Booleans), strings, numbers, மற்றும் [React elements](/reference/react/createElement) ஒவ்வொன்றும் தனித்தனி nodes ஆக count செய்யப்படும். Arrays தனித்தனி nodes ஆக count செய்யப்படாது, ஆனால் அவற்றின் children count செய்யப்படும். **Traversal React elements-ஐ விட ஆழமாக செல்லாது:** அவை render செய்யப்படாது, அவற்றின் children traverse செய்யப்படாது. [Fragments](/reference/react/Fragment) traverse செய்யப்படாது.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

`children` data structure-இல் உள்ள ஒவ்வொரு child-க்கும் சில code run செய்ய `Children.forEach(children, fn, thisArg?)`-ஐ call செய்யுங்கள்.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[கீழே மேலும் examples பார்க்கவும்.](#running-some-code-for-each-child)

#### அளவுருக்கள் {/*children-foreach-parameters*/}

* `children`: உங்கள் component பெற்ற [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)-ன் value.
* `fn`: ஒவ்வொரு child-க்கும் run செய்ய விரும்பும் function; [array `forEach` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) callback போல. இது child-ஐ first argument ஆகவும் அதன் index-ஐ second argument ஆகவும் கொண்டு call செய்யப்படும். Index `0`-இல் தொடங்கி ஒவ்வொரு call-இலும் increment ஆகும்.
* **optional** `thisArg`: `fn` function call செய்யப்பட வேண்டிய [`this` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Omit செய்தால், அது `undefined`.

#### திருப்பி அளிப்பது {/*children-foreach-returns*/}

`Children.forEach` `undefined` return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*children-foreach-caveats*/}

- Empty nodes (`null`, `undefined`, மற்றும் Booleans), strings, numbers, மற்றும் [React elements](/reference/react/createElement) ஒவ்வொன்றும் தனித்தனி nodes ஆக count செய்யப்படும். Arrays தனித்தனி nodes ஆக count செய்யப்படாது, ஆனால் அவற்றின் children count செய்யப்படும். **Traversal React elements-ஐ விட ஆழமாக செல்லாது:** அவை render செய்யப்படாது, அவற்றின் children traverse செய்யப்படாது. [Fragments](/reference/react/Fragment) traverse செய்யப்படாது.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

`children` data structure-இல் உள்ள ஒவ்வொரு child-ஐ map செய்ய அல்லது transform செய்ய `Children.map(children, fn, thisArg?)`-ஐ call செய்யுங்கள்.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[கீழே மேலும் examples பார்க்கவும்.](#transforming-children)

#### அளவுருக்கள் {/*children-map-parameters*/}

* `children`: உங்கள் component பெற்ற [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)-ன் value.
* `fn`: [array `map` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) callback போல இருக்கும் mapping function. இது child-ஐ first argument ஆகவும் அதன் index-ஐ second argument ஆகவும் கொண்டு call செய்யப்படும். Index `0`-இல் தொடங்கி ஒவ்வொரு call-இலும் increment ஆகும். இந்த function-இலிருந்து React node ஒன்றை return செய்ய வேண்டும். அது empty node (`null`, `undefined`, அல்லது Boolean), string, number, React element, அல்லது மற்ற React nodes-ன் array ஆக இருக்கலாம்.
* **optional** `thisArg`: `fn` function call செய்யப்பட வேண்டிய [`this` value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this). Omit செய்தால், அது `undefined`.

#### திருப்பி அளிப்பது {/*children-map-returns*/}

`children` `null` அல்லது `undefined` ஆக இருந்தால், அதே value-ஐ return செய்கிறது.

இல்லையெனில், `fn` function-இலிருந்து நீங்கள் return செய்த nodes கொண்ட flat array ஒன்றை return செய்கிறது. Returned array-இல் நீங்கள் return செய்த அனைத்து nodes-உம் இருக்கும்; `null` மற்றும் `undefined` மட்டும் இருக்காது.

#### கவனிக்க வேண்டியவை {/*children-map-caveats*/}

- Empty nodes (`null`, `undefined`, மற்றும் Booleans), strings, numbers, மற்றும் [React elements](/reference/react/createElement) ஒவ்வொன்றும் தனித்தனி nodes ஆக count செய்யப்படும். Arrays தனித்தனி nodes ஆக count செய்யப்படாது, ஆனால் அவற்றின் children count செய்யப்படும். **Traversal React elements-ஐ விட ஆழமாக செல்லாது:** அவை render செய்யப்படாது, அவற்றின் children traverse செய்யப்படாது. [Fragments](/reference/react/Fragment) traverse செய்யப்படாது.

- `fn`-இலிருந்து keys உடன் element அல்லது elements array ஒன்றை return செய்தால், **returned elements-ன் keys, `children`-இல் உள்ள corresponding original item-ன் key-உடன் தானாக combine செய்யப்படும்.** `fn`-இலிருந்து ஒரு array-இல் பல elements return செய்யும்போது, அவற்றின் keys அவற்றுக்கிடையே உள்ளூர் அளவில் unique ஆக இருந்தால் போதும்.

---

### `Children.only(children)` {/*children-only*/}


`children` ஒரு single React element-ஐ represent செய்கிறது என்பதை assert செய்ய `Children.only(children)`-ஐ call செய்யுங்கள்.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### அளவுருக்கள் {/*children-only-parameters*/}

* `children`: உங்கள் component பெற்ற [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)-ன் value.

#### திருப்பி அளிப்பது {/*children-only-returns*/}

`children` [valid element ஆக இருந்தால்,](/reference/react/isValidElement) அந்த element-ஐ return செய்கிறது.

இல்லையெனில், error throw செய்கிறது.

#### கவனிக்க வேண்டியவை {/*children-only-caveats*/}

- இந்த method **array ஒன்றை (`Children.map`-ன் return value போன்றது) `children` ஆக pass செய்தால் எப்போதும் throw செய்யும்.** வேறு வார்த்தைகளில் சொன்னால், `children` single React element ஆக இருக்க வேண்டும் என்பதையே இது enforce செய்கிறது; single element கொண்ட array ஆக இருக்க வேண்டும் என்பதல்ல.

---

### `Children.toArray(children)` {/*children-toarray*/}

`children` data structure-இலிருந்து array ஒன்றை உருவாக்க `Children.toArray(children)`-ஐ call செய்யுங்கள்.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### அளவுருக்கள் {/*children-toarray-parameters*/}

* `children`: உங்கள் component பெற்ற [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)-ன் value.

#### திருப்பி அளிப்பது {/*children-toarray-returns*/}

`children`-இல் உள்ள elements-ன் flat array-ஐ return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*children-toarray-caveats*/}

- Empty nodes (`null`, `undefined`, மற்றும் Booleans) returned array-இல் விடப்படும். **Returned elements-ன் keys, original elements-ன் keys மற்றும் அவற்றின் nesting level மற்றும் position அடிப்படையில் calculate செய்யப்படும்.** இதனால் array-ஐ flatten செய்வது behavior-இல் changes கொண்டு வராது.

---

## பயன்பாடு {/*usage*/}

### Children-ஐ transform செய்தல் {/*transforming-children*/}

உங்கள் component [`children` prop ஆக receive செய்யும்](/learn/passing-props-to-a-component#passing-jsx-as-children) children JSX-ஐ transform செய்ய, `Children.map`-ஐ call செய்யுங்கள்:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

மேலுள்ள example-இல், `RowList` அது receive செய்யும் ஒவ்வொரு child-ஐயும் `<div className="Row">` container-க்குள் wrap செய்கிறது. உதாரணமாக, parent component மூன்று `<p>` tags-ஐ `children` prop ஆக `RowList`-க்கு pass செய்கிறது என்று வைத்துக் கொள்ளுங்கள்:

```js
<RowList>
  <p>இது முதல் உருப்படி.</p>
  <p>இது இரண்டாவது உருப்படி.</p>
  <p>இது மூன்றாவது உருப்படி.</p>
</RowList>
```

பிறகு, மேலுள்ள `RowList` implementation உடன், இறுதி rendered result இதுபோல் இருக்கும்:

```js
<div className="RowList">
  <div className="Row">
    <p>இது முதல் உருப்படி.</p>
  </div>
  <div className="Row">
    <p>இது இரண்டாவது உருப்படி.</p>
  </div>
  <div className="Row">
    <p>இது மூன்றாவது உருப்படி.</p>
  </div>
</div>
```

`Children.map` [arrays-ஐ `map()` மூலம் transform செய்வதற்கு](/learn/rendering-lists) ஒத்தது. வேறுபாடு என்னவெனில், `children` data structure *opaque* என்று கருதப்படுகிறது. இதன் பொருள் அது சில நேரங்களில் array ஆக இருந்தாலும், அது array அல்லது வேறு குறிப்பிட்ட data type என்று நீங்கள் assume செய்யக்கூடாது. அதனால் அதை transform செய்ய வேண்டுமானால் `Children.map` பயன்படுத்த வேண்டும்.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>இது முதல் உருப்படி.</p>
      <p>இது இரண்டாவது உருப்படி.</p>
      <p>இது மூன்றாவது உருப்படி.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### children prop எப்போதும் array ஆக இல்லாதது ஏன்? {/*why-is-the-children-prop-not-always-an-array*/}

React-இல், `children` prop ஒரு *opaque* data structure ஆக கருதப்படுகிறது. இதன் structure எப்படி உள்ளது என்பதை நீங்கள் சார்ந்திருக்கக் கூடாது. Children-ஐ transform செய்ய, filter செய்ய, அல்லது count செய்ய, `Children` methods-ஐ பயன்படுத்த வேண்டும்.

நடைமுறையில், `children` data structure உள்ளார்ந்தவாறு பெரும்பாலும் array ஆக represent செய்யப்படுகிறது. ஆனால் single child மட்டும் இருந்தால், unnecessary memory overhead ஏற்படும் என்பதால் React கூடுதல் array உருவாக்காது. `children` prop-ஐ நேரடியாக introspect செய்வதற்கு பதிலாக `Children` methods-ஐ பயன்படுத்தும் வரை, React data structure உண்மையில் எப்படி implement செய்யப்படுகிறது என்பதை மாற்றினாலும் உங்கள் code உடையாது.

`children` array ஆக இருந்தாலும், `Children.map`-க்கு பயனுள்ள சிறப்பு behavior உள்ளது. உதாரணமாக, `Children.map` returned elements-இல் உள்ள [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key)-ஐ நீங்கள் pass செய்த `children`-இன் keys-உடன் combine செய்கிறது. இதனால் மேலுள்ள example போல wrap செய்யப்பட்டாலும் original JSX children keys-ஐ "இழக்காது" என்பதை உறுதி செய்கிறது.

</DeepDive>

<Pitfall>

நீங்கள் JSX ஆக pass செய்யும் components-ன் render செய்யப்பட்ட output, `children` data structure-இல் **சேராது**. கீழுள்ள example-இல், `RowList` receive செய்யும் `children` மூன்றுக்கு பதிலாக இரண்டு items மட்டுமே கொண்டுள்ளது:

1. `<p>இது முதல் உருப்படி.</p>`
2. `<MoreRows />`

இதனால் இந்த example-இல் இரண்டு row wrappers மட்டும் generate செய்யப்படுகின்றன:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>இது முதல் உருப்படி.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>இது இரண்டாவது உருப்படி.</p>
      <p>இது மூன்றாவது உருப்படி.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`children`-ஐ manipulate செய்யும்போது `<MoreRows />` போன்ற inner component-ன் render செய்யப்பட்ட output-ஐ பெற **எந்த வழியும் இல்லை**. அதனால் [மாற்று solutions-இல் ஒன்றை பயன்படுத்துவது பொதுவாகச் சிறந்தது.](#alternatives)

</Pitfall>

---

### ஒவ்வொரு child-க்கும் சில code run செய்தல் {/*running-some-code-for-each-child*/}

`children` data structure-இல் உள்ள ஒவ்வொரு child-க்கும் iterate செய்ய `Children.forEach`-ஐ call செய்யுங்கள். இது எந்த value-யும் return செய்யாது, மேலும் [array `forEach` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)-க்கு ஒத்தது. உங்கள் சொந்த array உருவாக்குவது போன்ற custom logic run செய்ய இதைப் பயன்படுத்தலாம்.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>இது முதல் உருப்படி.</p>
      <p>இது இரண்டாவது உருப்படி.</p>
      <p>இது மூன்றாவது உருப்படி.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // கடைசி separator-ஐ remove செய்
  return result;
}
```

</Sandpack>

<Pitfall>

முன்பு குறிப்பிடப்பட்டதுபோல், `children`-ஐ manipulate செய்யும்போது inner component-ன் render செய்யப்பட்ட output-ஐ பெற வழியில்லை. அதனால் [மாற்று solutions-இல் ஒன்றை பயன்படுத்துவது பொதுவாகச் சிறந்தது.](#alternatives)

</Pitfall>

---

### Children-ஐ count செய்தல் {/*counting-children*/}

Children எண்ணிக்கையை calculate செய்ய `Children.count(children)`-ஐ call செய்யுங்கள்.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>இது முதல் உருப்படி.</p>
      <p>இது இரண்டாவது உருப்படி.</p>
      <p>இது மூன்றாவது உருப்படி.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        மொத்த rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

முன்பு குறிப்பிடப்பட்டதுபோல், `children`-ஐ manipulate செய்யும்போது inner component-ன் render செய்யப்பட்ட output-ஐ பெற வழியில்லை. அதனால் [மாற்று solutions-இல் ஒன்றை பயன்படுத்துவது பொதுவாகச் சிறந்தது.](#alternatives)

</Pitfall>

---

### Children-ஐ array ஆக மாற்றுதல் {/*converting-children-to-an-array*/}

`children` data structure-ஐ regular JavaScript array ஆக மாற்ற `Children.toArray(children)`-ஐ call செய்யுங்கள். இதனால் [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), அல்லது [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) போன்ற built-in array methods-ஐ பயன்படுத்தி array-ஐ manipulate செய்ய முடியும்.

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>இது முதல் உருப்படி.</p>
      <p>இது இரண்டாவது உருப்படி.</p>
      <p>இது மூன்றாவது உருப்படி.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

முன்பு குறிப்பிடப்பட்டதுபோல், `children`-ஐ manipulate செய்யும்போது inner component-ன் render செய்யப்பட்ட output-ஐ பெற வழியில்லை. அதனால் [மாற்று solutions-இல் ஒன்றை பயன்படுத்துவது பொதுவாகச் சிறந்தது.](#alternatives)

</Pitfall>

---

## மாற்று வழிகள் {/*alternatives*/}

<Note>

இந்த section, இப்படி import செய்யப்படும் `Children` API-க்கு (capital `C` உடன்) alternatives-ஐ விவரிக்கிறது:

```js
import { Children } from 'react';
```

இதைக் நல்லதும் ஊக்குவிக்கப்படுவதுமான [`children` prop பயன்படுத்துவதுடன்](/learn/passing-props-to-a-component#passing-jsx-as-children) (lowercase `c`) குழப்பிக் கொள்ள வேண்டாம்.

</Note>

### பல components-ஐ expose செய்தல் {/*exposing-multiple-components*/}

`Children` methods மூலம் children-ஐ manipulate செய்வது பெரும்பாலும் fragile code-க்கு வழிவகுக்கும். JSX-இல் component ஒன்றுக்கு children pass செய்யும்போது, அந்த component individual children-ஐ manipulate அல்லது transform செய்யும் என்று நீங்கள் வழக்கமாக எதிர்பார்ப்பதில்லை.

முடிந்தால், `Children` methods பயன்படுத்துவதைத் தவிர்க்க முயலுங்கள். உதாரணமாக, `RowList`-ன் ஒவ்வொரு child-மும் `<div className="Row">`-இல் wrap செய்யப்பட வேண்டும் என்றால், `Row` component ஒன்றை export செய்து, ஒவ்வொரு row-ஐயும் இதுபோல் manually wrap செய்யுங்கள்:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>இது முதல் உருப்படி.</p>
      </Row>
      <Row>
        <p>இது இரண்டாவது உருப்படி.</p>
      </Row>
      <Row>
        <p>இது மூன்றாவது உருப்படி.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`Children.map` பயன்படுத்துவதற்கு மாறாக, இந்த approach ஒவ்வொரு child-ஐயும் automatically wrap செய்யாது. **ஆனால் [முந்தைய `Children.map` example](#transforming-children)-உடன் ஒப்பிடும்போது, இந்த approach-க்கு முக்கியமான நன்மை உள்ளது: மேலும் components extract செய்தாலும் இது வேலை செய்கிறது.** உதாரணமாக, உங்கள் சொந்த `MoreRows` component-ஐ extract செய்தாலும் இது இன்னும் வேலை செய்கிறது:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>இது முதல் உருப்படி.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>இது இரண்டாவது உருப்படி.</p>
      </Row>
      <Row>
        <p>இது மூன்றாவது உருப்படி.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

இது `Children.map` உடன் வேலை செய்யாது; ஏனெனில் அது `<MoreRows />`-ஐ single child (மேலும் single row) ஆகவே "பார்க்கும்".

---

### Objects array ஒன்றை prop ஆக accept செய்தல் {/*accepting-an-array-of-objects-as-a-prop*/}

Array ஒன்றை prop ஆக explicit ஆக pass செய்யவும் முடியும். உதாரணமாக, இந்த `RowList` `rows` array-ஐ prop ஆக accept செய்கிறது:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>இது முதல் உருப்படி.</p> },
      { id: 'second', content: <p>இது இரண்டாவது உருப்படி.</p> },
      { id: 'third', content: <p>இது மூன்றாவது உருப்படி.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`rows` regular JavaScript array என்பதால், `RowList` component அதில் [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) போன்ற built-in array methods-ஐ பயன்படுத்த முடியும்.

Children உடன் structured data ஆக கூடுதல் தகவலையும் pass செய்ய விரும்பும்போது இந்த pattern குறிப்பாக பயனுள்ளதாக இருக்கும். கீழுள்ள example-இல், `TabSwitcher` component `tabs` prop ஆக objects array ஒன்றை receive செய்கிறது:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'முதல்',
        content: <p>இது முதல் உருப்படி.</p>
      },
      {
        id: 'second',
        header: 'இரண்டாவது',
        content: <p>இது இரண்டாவது உருப்படி.</p>
      },
      {
        id: 'third',
        header: 'மூன்றாவது',
        content: <p>இது மூன்றாவது உருப்படி.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Children-ஐ JSX ஆக pass செய்வதற்கு மாறாக, இந்த approach ஒவ்வொரு item-உடனும் `header` போன்ற extra data-வை associate செய்ய அனுமதிக்கிறது. நீங்கள் `tabs`-உடன் நேரடியாக வேலை செய்கிறீர்கள், அது array என்பதால், `Children` methods தேவையில்லை.

---

### Rendering customize செய்ய render prop call செய்தல் {/*calling-a-render-prop-to-customize-rendering*/}

ஒவ்வொரு தனிப்பட்ட item-க்கும் JSX produce செய்வதற்கு பதிலாக, JSX return செய்யும் function ஒன்றை pass செய்து, தேவைப்படும் போது அந்த function-ஐ call செய்யலாம். இந்த example-இல், `App` component `renderContent` function-ஐ `TabSwitcher` component-க்கு pass செய்கிறது. `TabSwitcher` component selected tab-க்காக மட்டும் `renderContent`-ஐ call செய்கிறது:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>இது {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

`renderContent` போன்ற prop *render prop* என்று அழைக்கப்படுகிறது, ஏனெனில் அது user interface-ன் ஒரு பகுதியை எப்படி render செய்ய வேண்டும் என்பதை குறிப்பிடும் prop ஆகும். ஆனால் அதில் சிறப்பு எதுவும் இல்லை: அது function ஆக இருக்கும் regular prop மட்டுமே.

Render props functions என்பதால், அவற்றுக்கு தகவலை pass செய்யலாம். உதாரணமாக, இந்த `RowList` component ஒவ்வொரு row-வின் `id` மற்றும் `index`-ஐ `renderRow` render prop-க்கு pass செய்கிறது; அது `index`-ஐப் பயன்படுத்தி even rows-ஐ highlight செய்கிறது:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>இது {id} item.</p>
          </Row>
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        மொத்த rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Children-ஐ manipulate செய்யாமல் parent மற்றும் child components எப்படி cooperate செய்ய முடியும் என்பதற்கான இன்னொரு example இது.

---

## சிக்கல் தீர்த்தல் {/*troubleshooting*/}

### நான் custom component pass செய்கிறேன், ஆனால் `Children` methods அதன் render result-ஐ காட்டவில்லை {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

இப்படி `RowList`-க்கு இரண்டு children pass செய்கிறீர்கள் என்று வைத்துக் கொள்ளுங்கள்:

```js
<RowList>
  <p>முதல் உருப்படி</p>
  <MoreRows />
</RowList>
```

`RowList`-க்குள் `Children.count(children)` செய்தால், உங்களுக்கு `2` கிடைக்கும். `MoreRows` 10 வெவ்வேறு items render செய்தாலும், அல்லது அது `null` return செய்தாலும், `Children.count(children)` இன்னும் `2` ஆகவே இருக்கும். `RowList`-ன் perspective-இல், அது receive செய்த JSX-ஐ மட்டுமே "பார்க்கிறது". `MoreRows` component-ன் internals-ஐ அது "பார்க்காது".

இந்த limitation, component ஒன்றை extract செய்வதை கடினமாக்குகிறது. அதனால்தான் `Children` பயன்படுத்துவதற்கு பதிலாக [alternatives](#alternatives) விரும்பப்படுகின்றன.
