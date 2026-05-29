---
title: cloneElement
---

<Pitfall>

`cloneElement` பயன்படுத்துவது அரிதானது; இது fragile code-க்கு வழிவகுக்கலாம். [பொதுவான மாற்று வழிகளைப் பார்க்கவும்.](#alternatives)

</Pitfall>

<Intro>

மற்றொரு element-ஐ starting point ஆகப் பயன்படுத்தி புதிய React element உருவாக்க `cloneElement` உதவுகிறது.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

`element` அடிப்படையில், ஆனால் வேறுபட்ட `props` மற்றும் `children` உடன் React element உருவாக்க `cloneElement`-ஐ call செய்யுங்கள்:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `element`: `element` argument valid React element ஆக இருக்க வேண்டும். உதாரணமாக, அது `<Something />` போன்ற JSX node, [`createElement`](/reference/react/createElement) call செய்த result, அல்லது மற்றொரு `cloneElement` call-ன் result ஆக இருக்கலாம்.

* `props`: `props` argument object அல்லது `null` ஆக இருக்க வேண்டும். நீங்கள் `null` pass செய்தால், cloned element original `element.props` அனைத்தையும் retain செய்யும். இல்லையெனில், `props` object-இல் உள்ள ஒவ்வொரு prop-க்கும், return செய்யப்படும் element `element.props`-இல் உள்ள value-ஐ விட `props`-இல் உள்ள value-ஐ "prefer" செய்யும். மீதமுள்ள props original `element.props`-இலிருந்து நிரப்பப்படும். `props.key` அல்லது `props.ref` pass செய்தால், அவை original values-ஐ replace செய்யும்.

* **optional** `...children`: பூஜ்யம் அல்லது அதற்கு மேற்பட்ட child nodes. அவை React elements, strings, numbers, [portals](/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, மற்றும் `false`), மற்றும் React nodes-ன் arrays உட்பட எந்த React nodes ஆகவும் இருக்கலாம். `...children` arguments எதையும் pass செய்யவில்லை என்றால், original `element.props.children` preserve செய்யப்படும்.

#### Returns {/*returns*/}

`cloneElement` சில properties கொண்ட React element object-ஐ return செய்கிறது:

* `type`: `element.type` போலவே இருக்கும்.
* `props`: நீங்கள் pass செய்த overriding `props` உடன் `element.props`-ஐ shallow-ஆக merge செய்த result.
* `ref`: `props.ref` மூலம் override செய்யப்படாதவரை original `element.ref`.
* `key`: `props.key` மூலம் override செய்யப்படாதவரை original `element.key`.

பொதுவாக, உங்கள் component-இலிருந்து element-ஐ return செய்வீர்கள் அல்லது அதை மற்றொரு element-ன் child ஆக்குவீர்கள். Element-ன் properties-ஐ read செய்யலாம் என்றாலும், element உருவாக்கப்பட்ட பிறகு அதை opaque ஆகக் கருதி render செய்வதே சிறந்தது.

#### Caveats {/*caveats*/}

* Element-ஐ clone செய்வது **original element-ஐ modify செய்யாது.**

* **எல்லா children-உம் statically known ஆக இருந்தால் மட்டுமே** `cloneElement(element, null, child1, child2, child3)` போல `cloneElement`-க்கு children-ஐ பல arguments ஆக pass செய்யுங்கள். உங்கள் children dynamic என்றால், முழு array-ஐ மூன்றாவது argument ஆக pass செய்யுங்கள்: `cloneElement(element, null, listItems)`. இதனால் dynamic lists-க்கு missing `key`s பற்றி React [warning வழங்கும்](/learn/rendering-lists#keeping-list-items-in-order-with-key). Static lists-க்கு இது அவசியமில்லை; ஏனெனில் அவை reorder ஆகாது.

* `cloneElement` data flow trace செய்வதை கடினமாக்குகிறது; எனவே **அதற்கு பதிலாக [மாற்று வழிகளை](#alternatives) முயற்சிக்கவும்.**

---

## பயன்பாடு {/*usage*/}

### Element-ன் props-ஐ override செய்தல் {/*overriding-props-of-an-element*/}

ஒரு <CodeStep step={1}>React element</CodeStep>-ன் props-ஐ override செய்ய, <CodeStep step={2}>override செய்ய வேண்டிய props</CodeStep> உடன் அதை `cloneElement`-க்கு pass செய்யுங்கள்:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

இங்கு resulting <CodeStep step={3}>cloned element</CodeStep> `<Row title="Cabbage" isHighlighted={true} />` ஆக இருக்கும்.

**இது எப்போது பயனுள்ளதாக இருக்கும் என்பதை ஒரு உதாரணத்தின் மூலம் பார்ப்போம்.**

தேர்வு செய்யக்கூடிய rows பட்டியலாக தனது [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children)-ஐ render செய்யும் `List` component-ஐ கற்பனை செய்யுங்கள்; எந்த row தேர்வு செய்யப்படுகிறது என்பதை மாற்றும் "Next" button உள்ளது. `List` component தேர்வு செய்யப்பட்ட `Row`-ஐ வேறுபட்டு render செய்ய வேண்டும்; ஆகவே அது பெற்ற ஒவ்வொரு `<Row>` child-ஐயும் clone செய்து, கூடுதல் `isHighlighted: true` அல்லது `isHighlighted: false` prop சேர்க்கிறது:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
```

`List` பெற்ற original JSX இவ்வாறு இருப்பதாக வைத்துக் கொள்வோம்:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

தன் children-ஐ clone செய்வதன் மூலம், `List` உள்ளே உள்ள ஒவ்வொரு `Row`-க்கும் extra information pass செய்ய முடியும். Result இவ்வாறு இருக்கும்:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true}
  />
  <Row
    title="Garlic"
    isHighlighted={false}
  />
  <Row
    title="Apple"
    isHighlighted={false}
  />
</List>
```

"Next" press செய்தால் `List`-ன் state update ஆகி, வேறு row highlight ஆகிறது என்பதை கவனியுங்கள்:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
        />
      )}
    </List>
  );
}
```

```js src/List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

சுருக்கமாக, `List` பெற்ற `<Row />` elements-ஐ clone செய்து, அவற்றுக்கு extra prop சேர்த்தது.

<Pitfall>

Children-ஐ clone செய்வது, உங்கள் app-இல் data எப்படி flow ஆகிறது என்பதைப் புரிந்துகொள்வதை கடினமாக்கும். [மாற்று வழிகளில்](#alternatives) ஒன்றை முயற்சிக்கவும்.

</Pitfall>

---

## மாற்று வழிகள் {/*alternatives*/}

### Render prop மூலம் data pass செய்தல் {/*passing-data-with-a-render-prop*/}

`cloneElement` பயன்படுத்துவதற்கு பதிலாக, `renderItem` போன்ற *render prop* ஏற்கலாம். இங்கு `List` `renderItem`-ஐ prop ஆகப் பெறுகிறது. ஒவ்வொரு item-க்கும் `List` `renderItem` call செய்து, `isHighlighted`-ஐ argument ஆக pass செய்கிறது:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

`renderItem` prop-ஐ "render prop" என்று அழைப்பது, ஏதாவது ஒன்றை எப்படி render செய்ய வேண்டும் என்பதை குறிப்பிடும் prop என்பதால். உதாரணமாக, கொடுக்கப்பட்ட `isHighlighted` value உடன் `<Row>` render செய்யும் `renderItem` implementation-ஐ pass செய்யலாம்:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

இறுதி result `cloneElement` பயன்படுத்தியதுடன் ஒரே மாதிரியாக இருக்கும்:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true}
  />
  <Row
    title="Garlic"
    isHighlighted={false}
  />
  <Row
    title="Apple"
    isHighlighted={false}
  />
</List>
```

ஆனால் `isHighlighted` value எங்கிருந்து வருகிறது என்பதை தெளிவாக trace செய்ய முடியும்.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

இந்த pattern `cloneElement`-ஐ விட விரும்பத்தக்கது; ஏனெனில் இது இன்னும் explicit.

---

### Context மூலம் data pass செய்தல் {/*passing-data-through-context*/}

`cloneElement`-க்கு மற்றொரு மாற்று வழி [context மூலம் data pass செய்வது](/learn/passing-data-deeply-with-context).


உதாரணமாக, `HighlightContext` define செய்ய [`createContext`](/reference/react/createContext)-ஐ call செய்யலாம்:

```js
export const HighlightContext = createContext(false);
```

உங்கள் `List` component அது render செய்யும் ஒவ்வொரு item-ஐயும் `HighlightContext` provider-க்குள் wrap செய்யலாம்:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext>
        );
      })}
```

இந்த அணுகுமுறையில், `Row` `isHighlighted` prop பெறவே தேவையில்லை. அதற்கு பதிலாக அது context-ஐ read செய்கிறது:

```js src/Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

இதனால் calling component `<Row>`-க்கு `isHighlighted` pass செய்வதைப் பற்றி அறியவோ கவலைப்படவோ வேண்டியதில்லை:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

அதற்கு பதிலாக, `List` மற்றும் `Row` highlighting logic-ஐ context மூலம் coordinate செய்கின்றன.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js src/List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js src/Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Context மூலம் data pass செய்வது பற்றி மேலும் அறிக.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Logic-ஐ custom Hook-க்குள் extract செய்தல் {/*extracting-logic-into-a-custom-hook*/}

நீங்கள் முயற்சிக்கக்கூடிய மற்றொரு அணுகுமுறை: "non-visual" logic-ஐ உங்கள் சொந்த Hook-க்குள் extract செய்து, உங்கள் Hook return செய்யும் information-ஐ வைத்து என்ன render செய்ய வேண்டும் என்பதை தீர்மானிப்பது. உதாரணமாக, `useList` custom Hook-ஐ இவ்வாறு எழுதலாம்:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

பிறகு அதை இவ்வாறு பயன்படுத்தலாம்:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Data flow explicit ஆக உள்ளது; ஆனால் state எந்த component-இலிருந்தும் பயன்படுத்தக்கூடிய `useList` custom Hook-க்குள் உள்ளது:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js src/useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js src/Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js src/data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

இந்த logic-ஐ வெவ்வேறு components இடையே reuse செய்ய விரும்பினால், இந்த அணுகுமுறை குறிப்பாக பயனுள்ளது.
