---
title: 'Refs மூலம் DOM-ஐ கையாளுதல்'
---

<Intro>

உங்கள் render output-க்கு பொருந்தும்படி React [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)-ஐ தானாக update செய்கிறது; எனவே உங்கள் components அதை அடிக்கடி manipulate செய்ய வேண்டியதில்லை. ஆனால் சில நேரங்களில் React manage செய்யும் DOM elements-ஐ access செய்ய வேண்டியிருக்கலாம்--உதாரணமாக, node ஒன்றை focus செய்ய, அதற்கு scroll செய்ய, அல்லது அதன் size மற்றும் position அளவிட. React-இல் இவற்றுக்கான built-in வழி இல்லை; எனவே DOM node-க்கு ஒரு *ref* தேவைப்படும்.

</Intro>

<YouWillLearn>

- `ref` attribute மூலம் React நிர்வகிக்கும் DOM node-ஐ அணுகுவது எப்படி
- `ref` JSX attribute, `useRef` Hook-உடன் எப்படி தொடர்புடையது
- மற்றொரு component-ன் DOM node-ஐ access செய்வது எப்படி
- React manage செய்யும் DOM-ஐ எந்த சூழல்களில் modify செய்வது safe

</YouWillLearn>

## DOM node-க்கு ref பெறுதல் {/*getting-a-ref-to-the-node*/}

React நிர்வகிக்கும் DOM node-ஐ அணுக, முதலில் `useRef` Hook-ஐ import செய்யுங்கள்:

```js
import { useRef } from 'react';
```

பிறகு, உங்கள் component-க்குள் ref declare செய்ய அதை பயன்படுத்துங்கள்:

```js
const myRef = useRef(null);
```

இறுதியாக, DOM node பெற விரும்பும் JSX tag-க்கு உங்கள் ref-ஐ `ref` attribute ஆக pass செய்யுங்கள்:

```js
<div ref={myRef}>
```

`useRef` Hook `current` என்ற single property கொண்ட object ஒன்றை return செய்கிறது. ஆரம்பத்தில் `myRef.current` `null` ஆக இருக்கும். React இந்த `<div>`-க்காக DOM node உருவாக்கும்போது, அந்த node-க்கு reference-ஐ `myRef.current`-க்கு வைக்கும். பிறகு உங்கள் [event handlers](/learn/responding-to-events)-இலிருந்து இந்த DOM node-ஐ access செய்து, அதில் defined செய்யப்பட்ட built-in [browser APIs](https://developer.mozilla.org/docs/Web/API/Element)-ஐ பயன்படுத்தலாம்.

```js
// You can use any browser APIs, for example:
myRef.current.scrollIntoView();
```

### உதாரணம்: Text input-ஐ focus செய்தல் {/*example-focusing-a-text-input*/}

இந்த உதாரணத்தில், button-ஐ click செய்தால் input focus ஆகும்:

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
        Input-ஐ focus செய்
      </button>
    </>
  );
}
```

</Sandpack>

இதை implement செய்ய:

1. `useRef` Hook மூலம் `inputRef` declare செய்யுங்கள்.
2. அதை `<input ref={inputRef}>` ஆக pass செய்யுங்கள். இது **இந்த `<input>`-ன் DOM node-ஐ `inputRef.current`-க்குள் வைக்க** React-க்கு சொல்கிறது.
3. `handleClick` function-இல், input DOM node-ஐ `inputRef.current`-இலிருந்து read செய்து, `inputRef.current.focus()` மூலம் அதில் [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) call செய்யுங்கள்.
4. `handleClick` event handler-ஐ `onClick` மூலம் `<button>`-க்கு pass செய்யுங்கள்.

DOM manipulation என்பது refs-க்கான மிகவும் பொதுவான use case என்றாலும், `useRef` Hook timer IDs போன்ற React-க்கு வெளியிலுள்ள பிற விஷயங்களை store செய்யவும் பயன்படுத்தப்படலாம். State போலவே, refs renders இடையே நிலைத்திருக்கும். Refs என்பது set செய்தால் re-renders trigger செய்யாத state variables போன்றவை. Refs பற்றி [Refs மூலம் Values-ஐ Refer செய்தல்](/learn/referencing-values-with-refs)-இல் வாசிக்கவும்.

### உதாரணம்: Element-க்கு scroll செய்தல் {/*example-scrolling-to-an-element*/}

ஒரு component-இல் ஒன்றுக்கு மேற்பட்ட refs இருக்கலாம். இந்த உதாரணத்தில், மூன்று images கொண்ட carousel உள்ளது. ஒவ்வொரு button-மும் தொடர்புடைய DOM node-இல் browser [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) method-ஐ call செய்வதன் மூலம் ஒரு image-ஐ center செய்கிறது:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Ref callback-ஐ பயன்படுத்தி refs பட்டியலை நிர்வகிப்பது எப்படி {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

மேலுள்ள examples-இல், predefined எண்ணிக்கையிலான refs உள்ளது. ஆனால் சில நேரங்களில் list-இல் உள்ள ஒவ்வொரு item-க்கும் ref தேவைப்படலாம், மேலும் எத்தனை items இருக்கும் என்பது தெரியாது. இதுபோல் செய்வது **வேலை செய்யாது**:

```js
<ul>
  {items.map((item) => {
    // Doesn't work!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

ஏனெனில் **Hooks உங்கள் component-ன் top-level-இல் மட்டுமே call செய்யப்பட வேண்டும்.** Loop-இல், condition-இல், அல்லது `map()` call-க்குள் `useRef` call செய்ய முடியாது.

இதற்கான ஒரு வழி, அவற்றின் parent element-க்கு single ref பெற்று, பிறகு [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) போன்ற DOM manipulation methods பயன்படுத்தி அதிலிருந்து individual child nodes-ஐ "find" செய்வது. ஆனால் இது brittle; உங்கள் DOM structure மாறினால் உடையலாம்.

மற்றொரு solution, **`ref` attribute-க்கு function pass செய்வது.** இது [`ref` callback](/reference/react-dom/components/common#ref-callback) என்று அழைக்கப்படுகிறது. Ref set செய்ய வேண்டிய நேரத்தில் React உங்கள் ref callback-ஐ DOM node உடன் call செய்யும்; அதை clear செய்ய வேண்டிய நேரத்தில் callback return செய்த cleanup function-ஐ call செய்யும். இதனால் உங்கள் சொந்த array அல்லது [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) maintain செய்து, index அல்லது ஏதாவது ID மூலம் எந்த ref-ஐயும் access செய்யலாம்.

Long list-இல் arbitrary node ஒன்றுக்கு scroll செய்ய இந்த approach-ஐ எப்படி பயன்படுத்தலாம் என்பதை இந்த example காட்டுகிறது:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[8])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat.imageUrl} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catCount = 10;
  const catList = new Array(catCount)
  for (let i = 0; i < catCount; i++) {
    let imageUrl = '';
    if (i < 5) {
      imageUrl = "https://placecats.com/neo/320/240";
    } else if (i < 8) {
      imageUrl = "https://placecats.com/millie/320/240";
    } else {
      imageUrl = "https://placecats.com/bella/320/240";
    }
    catList[i] = {
      id: i,
      imageUrl,
    };
  }
  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

இந்த example-இல், `itemsRef` single DOM node-ஐ hold செய்யவில்லை. அதற்கு பதிலாக, item ID-இலிருந்து DOM node-க்கு [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) ஒன்றை hold செய்கிறது. ([Refs எந்த values-ஐயும் hold செய்ய முடியும்!](/learn/referencing-values-with-refs)) ஒவ்வொரு list item-இலுள்ள [`ref` callback](/reference/react-dom/components/common#ref-callback) Map-ஐ update செய்வதை கவனிக்கிறது:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

இதனால் பின்னர் Map-இலிருந்து individual DOM nodes-ஐ read செய்யலாம்.

<Note>

Strict Mode இயங்கினால், ref callbacks development-இல் இருமுறை run ஆகும்.

Callback refs-இல் [இது bugs கண்டுபிடிக்க எப்படி உதவுகிறது](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) என்பதை மேலும் வாசிக்கவும்.

</Note>

</DeepDive>

## மற்றொரு component-ன் DOM nodes-ஐ அணுகுதல் {/*accessing-another-components-dom-nodes*/}

<Pitfall>
Refs ஒரு escape hatch. _மற்றொரு_ component-ன் DOM nodes-ஐ கையால் மாற்றுவது உங்கள் code-ஐ எளிதில் உடையக்கூடியதாக மாற்றலாம்.
</Pitfall>

Parent component-இலிருந்து child components-க்கு refs-ஐ [மற்ற prop போலவே](/learn/passing-props-to-a-component) pass செய்யலாம்.

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

மேலுள்ள example-இல், parent component ஆன `MyForm`-இல் ref உருவாக்கப்பட்டு, child component ஆன `MyInput`-க்கு pass செய்யப்படுகிறது. பிறகு `MyInput` ref-ஐ `<input>`-க்கு pass செய்கிறது. `<input>` ஒரு [built-in component](/reference/react-dom/components/common) என்பதால், React ref-ன் `.current` property-ஐ `<input>` DOM element-க்கு set செய்கிறது.

`MyForm`-இல் உருவாக்கப்பட்ட `inputRef` இப்போது `MyInput` return செய்த `<input>` DOM element-ஐ point செய்கிறது. `MyForm`-இல் உருவாக்கப்பட்ட click handler, `inputRef`-ஐ access செய்து `<input>`-இல் focus set செய்ய `focus()` call செய்ய முடியும்.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Input-ஐ focus செய்
      </button>
    </>
  );
}
```

</Sandpack>

<DeepDive>

#### Imperative handle மூலம் API-ன் ஒரு பகுதியை expose செய்தல் {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

மேலுள்ள example-இல், `MyInput`-க்கு pass செய்யப்பட்ட ref original DOM input element-க்கு pass செய்யப்படுகிறது. இதனால் parent component அதில் `focus()` call செய்ய முடிகிறது. ஆனால் இதே காரணத்தால் parent component வேறு ஏதாவது செய்யவும் முடியும்--உதாரணமாக, அதன் CSS styles மாற்றலாம். அரிதான சூழல்களில், exposed functionality-ஐ restrict செய்ய விரும்பலாம். அதை [`useImperativeHandle`](/reference/react/useImperativeHandle) மூலம் செய்யலாம்:

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Input-ஐ focus செய்</button>
    </>
  );
}
```

</Sandpack>

இங்கே, `MyInput`-க்குள் உள்ள `realInputRef` உண்மையான input DOM node-ஐ வைத்திருக்கிறது. ஆனால் [`useImperativeHandle`](/reference/react/useImperativeHandle), parent component-க்கு ref value ஆக உங்கள் சொந்த special object-ஐ வழங்குமாறு React-க்கு சொல்கிறது. எனவே `Form` component-க்குள் `inputRef.current`-க்கு `focus` method மட்டும் இருக்கும். இந்த நிலையில், ref "handle" DOM node அல்ல; [`useImperativeHandle`](/reference/react/useImperativeHandle) call-க்குள் நீங்கள் உருவாக்கும் custom object.

</DeepDive>

## React refs-ஐ attach செய்யும் நேரம் {/*when-react-attaches-the-refs*/}

React-இல், ஒவ்வொரு update-மும் [இரண்டு phases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) ஆக split செய்யப்படுகிறது:

* **Render** போது, screen-இல் என்ன இருக்க வேண்டும் என்பதை கண்டுபிடிக்க React உங்கள் components-ஐ call செய்கிறது.
* **Commit** போது, React changes-ஐ DOM-க்கு பயன்படுத்துகிறது.

பொதுவாக, rendering போது refs access செய்ய [விரும்பமாட்டீர்கள்](/learn/referencing-values-with-refs#best-practices-for-refs). DOM nodes hold செய்யும் refs-க்கும் இதே பொருந்தும். First render போது, DOM nodes இன்னும் உருவாக்கப்படவில்லை; எனவே `ref.current` `null` ஆக இருக்கும். Updates render செய்யும்போதும் DOM nodes இன்னும் update செய்யப்படவில்லை. எனவே அவற்றை read செய்ய இது மிக விரைவாகும்.

React commit போது `ref.current` set செய்கிறது. DOM update செய்வதற்கு முன், பாதிக்கப்பட்ட `ref.current` values-ஐ React `null` ஆக set செய்கிறது. DOM update செய்த பிறகு, அவற்றை உடனடியாக corresponding DOM nodes-க்கு set செய்கிறது.

**பொதுவாக, refs-ஐ event handlers-இலிருந்து access செய்வீர்கள்.** Ref-ஐ வைத்து ஏதாவது செய்ய வேண்டும், ஆனால் அதற்கான particular event எதுவும் இல்லையெனில், Effect தேவைப்படலாம். Effects பற்றி அடுத்த pages-இல் பேசுவோம்.

<DeepDive>

#### flushSync மூலம் state updates-ஐ synchronous ஆக flush செய்தல் {/*flushing-state-updates-synchronously-with-flush-sync*/}

புதிய todo சேர்த்து, screen-ஐ list-ன் last child வரை கீழே scroll செய்யும் இந்த code-ஐ கவனியுங்கள். ஏதோ காரணத்தால், அது எப்போதும் கடைசியாக சேர்க்கப்பட்ட todo-க்கு *முன்னிருந்த* todo-க்கு தான் scroll செய்கிறது என்பதை கவனியுங்கள்:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        சேர்
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

இந்த இரண்டு lines-இல்தான் பிரச்சினை உள்ளது:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React-இல், [state updates queue செய்யப்படுகின்றன.](/learn/queueing-a-series-of-state-updates) பொதுவாக, இதுவே நீங்கள் விரும்புவது. ஆனால் இங்கே இது பிரச்சினை ஏற்படுத்துகிறது, ஏனெனில் `setTodos` DOM-ஐ உடனடியாக update செய்யாது. எனவே list-ஐ அதன் last element-க்கு scroll செய்யும் நேரத்தில், todo இன்னும் சேர்க்கப்படவில்லை. அதனால்தான் scrolling எப்போதும் ஒரு item "பின் தங்குகிறது".

இந்த பிரச்சினையை சரிசெய்ய, React DOM-ஐ synchronously update ("flush") செய்ய force செய்யலாம். இதற்கு, `react-dom`-இலிருந்து `flushSync` import செய்து, **state update-ஐ** `flushSync` call-க்குள் wrap செய்யுங்கள்:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

`flushSync`-க்குள் wrap செய்யப்பட்ட code execute ஆன உடனே DOM-ஐ synchronously update செய்ய இது React-க்கு instruct செய்யும். இதன் விளைவாக, அதை scroll செய்ய முயற்சிக்கும் நேரத்திற்குள் last todo ஏற்கனவே DOM-இல் இருக்கும்:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        சேர்
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Refs மூலம் DOM-ஐ கையாளும் சிறந்த நடைமுறைகள் {/*best-practices-for-dom-manipulation-with-refs*/}

Refs ஒரு escape hatch. "React-க்கு வெளியே step" செய்ய வேண்டியபோது மட்டுமே அவற்றை பயன்படுத்த வேண்டும். Focus manage செய்தல், scroll position manage செய்தல், அல்லது React expose செய்யாத browser APIs call செய்தல் ஆகியவை இதற்கான பொதுவான examples.

Focusing மற்றும் scrolling போன்ற non-destructive actions-க்கு மட்டும் கட்டுப்பட்டால், பிரச்சினைகள் வரக்கூடாது. ஆனால் DOM-ஐ manually **modify** செய்ய முயன்றால், React செய்யும் changes-உடன் conflict ஏற்படும் risk உண்டு.

இந்த பிரச்சினையை விளக்க, இந்த example-இல் welcome message மற்றும் இரண்டு buttons உள்ளன. முதல் button, React-இல் வழக்கமாக செய்வது போல [conditional rendering](/learn/conditional-rendering) மற்றும் [state](/learn/state-a-components-memory) பயன்படுத்தி அதன் presence-ஐ toggle செய்கிறது. இரண்டாவது button, React control-க்கு வெளியே DOM-இலிருந்து அதை forcefully remove செய்ய [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)-ஐ பயன்படுத்துகிறது.

"setState மூலம் toggle செய்" என்பதை சில முறை அழுத்திப் பாருங்கள். Message மறைந்து மீண்டும் தோன்ற வேண்டும். பிறகு "DOM-இலிருந்து remove செய்" அழுத்துங்கள். இது அதை forcefully remove செய்யும். இறுதியாக, "setState மூலம் toggle செய்" அழுத்துங்கள்:

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        setState மூலம் toggle செய்
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        DOM-இலிருந்து remove செய்
      </button>
      {show && <p ref={ref}>வணக்கம் உலகம்</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM element-ஐ manually remove செய்த பிறகு, அதை மீண்டும் காட்ட `setState` பயன்படுத்த முயன்றால் crash ஏற்படும். ஏனெனில் நீங்கள் DOM-ஐ மாற்றியுள்ளீர்கள், அதை சரியாக தொடர்ந்து manage செய்வது எப்படி என்று React-க்கு தெரியாது.

**React நிர்வகிக்கும் DOM nodes-ஐ மாற்றுவதைத் தவிர்க்கவும்.** React நிர்வகிக்கும் elements-ஐ மாற்றுதல், children சேர்த்தல், அல்லது children remove செய்தல் inconsistent visual results அல்லது மேலுள்ளதைப் போன்ற crashes-க்கு வழிவகுக்கும்.

ஆனால் இதனால் அதை ஒருபோதும் செய்ய முடியாது என்று பொருளில்லை. இதற்கு caution தேவை. **React update செய்ய _காரணமே இல்லாத_ DOM பகுதிகளை நீங்கள் safe ஆக modify செய்யலாம்.** உதாரணமாக, JSX-இல் ஏதாவது `<div>` எப்போதும் empty ஆக இருந்தால், அதன் children list-ஐ touch செய்ய React-க்கு reason இருக்காது. எனவே அங்கே elements-ஐ manually add அல்லது remove செய்வது safe.

<Recap>

- Refs என்பது generic concept, ஆனால் பெரும்பாலும் DOM elements hold செய்ய அவற்றைப் பயன்படுத்துவீர்கள்.
- `<div ref={myRef}>` pass செய்வதன் மூலம் DOM node-ஐ `myRef.current`-க்குள் வைக்க React-க்கு instruct செய்கிறீர்கள்.
- பொதுவாக, focus செய்தல், scroll செய்தல், அல்லது DOM elements அளவிடுதல் போன்ற non-destructive actions-க்கு refs பயன்படுத்துவீர்கள்.
- Component இயல்பாக தனது DOM nodes-ஐ expose செய்யாது. `ref` prop பயன்படுத்தி DOM node-ஐ expose செய்ய opt in செய்யலாம்.
- React manage செய்யும் DOM nodes-ஐ change செய்வதைத் தவிர்க்கவும்.
- React manage செய்யும் DOM nodes-ஐ modify செய்தால், React update செய்ய காரணமே இல்லாத பகுதிகளை மட்டும் modify செய்யுங்கள்.

</Recap>



<Challenges>

#### Video-ஐ இயக்கவும் இடைநிறுத்தவும் {/*play-and-pause-the-video*/}

இந்த example-இல், button state variable-ஐ toggle செய்து playing மற்றும் paused state இடையே switch செய்கிறது. ஆனால் video-ஐ உண்மையில் play அல்லது pause செய்ய, state toggle செய்வது மட்டும் போதாது. `<video>`-க்கான DOM element-இல் [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) மற்றும் [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) call செய்ய வேண்டும். அதற்கு ref சேர்த்து, button வேலை செய்யச் செய்யுங்கள்.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'இடைநிறுத்து' : 'இயக்கு'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

கூடுதல் சவாலாக, பயனர் video-ஐ right-click செய்து உள்ளமைந்த browser media controls மூலம் இயக்கினாலும், "இயக்கு" button video playing state-உடன் sync-இல் இருக்கச் செய்யுங்கள். அதற்காக video-வில் `onPlay` மற்றும் `onPause` listen செய்ய விரும்பலாம்.

<Solution>

Ref declare செய்து அதை `<video>` element-இல் வையுங்கள். பிறகு next state-ஐப் பொறுத்து event handler-இல் `ref.current.play()` மற்றும் `ref.current.pause()` call செய்யுங்கள்.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'இடைநிறுத்து' : 'இயக்கு'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

உள்ளமைந்த browser controls-ஐ கையாள, `<video>` element-க்கு `onPlay` மற்றும் `onPause` handlers சேர்த்து அவற்றிலிருந்து `setIsPlaying` call செய்யலாம். இவ்வாறு, பயனர் browser controls மூலம் video-ஐ இயக்கினால் state அதற்கு ஏற்ப adjust ஆகும்.

</Solution>

#### தேடல் புலத்தை focus செய்யுங்கள் {/*focus-the-search-field*/}

"தேடு" button click செய்தால் field-க்கு focus செல்லும் வகையில் செய்யுங்கள்.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>தேடு</button>
      </nav>
      <input
        placeholder="ஏதாவது தேடுகிறீர்களா?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Input-க்கு ref சேர்த்து, அதை focus செய்ய DOM node-இல் `focus()` call செய்யுங்கள்:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          தேடு
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="ஏதாவது தேடுகிறீர்களா?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### பட carousel-ஐ scroll செய்தல் {/*scrolling-an-image-carousel*/}

இந்த image carousel-ல் active image-ஐ switch செய்யும் "அடுத்து" button உள்ளது. Click செய்தால் gallery active image-க்கு horizontal ஆக scroll ஆகும் வகையில் செய்யுங்கள். Active image-ன் DOM node-இல் [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) call செய்ய வேண்டும்:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

இந்த exercise-க்கு ஒவ்வொரு image-க்கும் ref தேவை இல்லை. தற்போது active image-க்கு ref வைத்திருக்கலாம், அல்லது list-க்கே ref வைத்திருப்பதும் போதும். Scroll செய்வதற்கு *முன்* DOM update ஆகியிருப்பதை உறுதி செய்ய `flushSync` பயன்படுத்துங்கள்.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          அடுத்து
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'பூனை #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

`selectedRef` declare செய்து, தற்போதைய image-க்கு மட்டும் conditionally pass செய்யலாம்:

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i` என்றால் image selected என்று பொருள்; அந்த `<li>` `selectedRef` receive செய்யும். `selectedRef.current` எப்போதும் சரியான DOM node-ஐ point செய்வதை React உறுதி செய்யும்.

Scroll செய்வதற்கு முன் React DOM-ஐ update செய்ய force செய்ய `flushSync` call அவசியம் என்பதை கவனியுங்கள். இல்லையெனில், `selectedRef.current` எப்போதும் முன்பு selected செய்யப்பட்ட item-ஐ point செய்திருக்கும்.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          அடுத்து
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'பூனை #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catCount = 10;
const catList = new Array(catCount);
for (let i = 0; i < catCount; i++) {
  const bucket = Math.floor(Math.random() * catCount) % 2;
  let imageUrl = '';
  switch (bucket) {
    case 0: {
      imageUrl = "https://placecats.com/neo/250/200";
      break;
    }
    case 1: {
      imageUrl = "https://placecats.com/millie/250/200";
      break;
    }
    case 2:
    default: {
      imageUrl = "https://placecats.com/bella/250/200";
      break;
    }
  }
  catList[i] = {
    id: i,
    imageUrl,
  };
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### தனி components-ஐ பயன்படுத்தி தேடல் புலத்தை focus செய்தல் {/*focus-the-search-field-with-separate-components*/}

"தேடு" button click செய்தால் field-க்கு focus செல்லும் வகையில் செய்யுங்கள். ஒவ்வொரு component-மும் தனி file-இல் defined செய்யப்பட்டுள்ளது; அதை அங்கிருந்து move செய்யக்கூடாது என்பதை கவனியுங்கள். அவற்றை எப்படி ஒன்றாக connect செய்வீர்கள்?

<Hint>

`SearchInput` போன்ற உங்கள் சொந்த component-இலிருந்து DOM node-ஐ expose செய்ய opt in செய்ய, `ref`-ஐ prop ஆக pass செய்ய வேண்டும்.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      தேடு
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="ஏதாவது தேடுகிறீர்களா?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton`-க்கு `onClick` prop சேர்க்க வேண்டும்; மேலும் `SearchButton` அதை browser `<button>`-க்கு கீழே pass செய்ய வேண்டும். `<SearchInput>`-க்கும் ref கீழே pass செய்வீர்கள்; அது உண்மையான `<input>`-க்கு அதை forward செய்து நிரப்பும். இறுதியாக, click handler-இல் அந்த ref-க்குள் stored செய்யப்பட்ட DOM node-இல் `focus` call செய்வீர்கள்.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      தேடு
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="ஏதாவது தேடுகிறீர்களா?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
