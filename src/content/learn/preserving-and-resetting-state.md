---
title: State-ஐ பாதுகாத்தலும் reset செய்தலும்
---

<Intro>

State components-க்கு இடையில் தனிமைப்படுத்தப்பட்டுள்ளது. UI tree-இல் அவை இருக்கும் இடத்தின் அடிப்படையில் எந்த state எந்த component-க்கு சொந்தமானது என்பதை React கண்காணிக்கிறது. re-renders இடையில் state-ஐ எப்போது பாதுகாக்க வேண்டும், எப்போது reset செய்ய வேண்டும் என்பதை நீங்கள் கட்டுப்படுத்தலாம்.

</Intro>

<YouWillLearn>

* React state-ஐ எப்போது பாதுகாக்க அல்லது reset செய்ய தேர்வு செய்கிறது
* component-ன் state-ஐ reset செய்ய React-ஐ எப்படி கட்டாயப்படுத்துவது
* keys மற்றும் types, state பாதுகாக்கப்படுகிறதா என்பதை எப்படி பாதிக்கின்றன

</YouWillLearn>

## State render tree-இல் உள்ள position-க்கு இணைக்கப்பட்டுள்ளது {/*state-is-tied-to-a-position-in-the-tree*/}

உங்கள் UI-இல் உள்ள component structure-க்காக React [render trees](learn/understanding-your-ui-as-a-tree#the-render-tree)-ஐ உருவாக்குகிறது.

ஒரு component-க்கு state கொடுத்தால், அந்த state component-க்குள் "வாழ்கிறது" என்று நீங்கள் நினைக்கலாம். ஆனால் state உண்மையில் React-க்குள் வைத்திருக்கப்படுகிறது. render tree-இல் அந்த component இருக்கும் இடத்தைப் பயன்படுத்தி, React தன்னிடம் வைத்திருக்கும் ஒவ்வொரு state துண்டையும் சரியான component-உடன் இணைக்கிறது.

இங்கே ஒரே ஒரு `<Counter />` JSX tag தான் உள்ளது, ஆனால் அது இரண்டு வேறு positions-இல் render செய்யப்படுகிறது:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

இவை tree ஆக இப்படித் தெரியும்:

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

React tree

</Diagram>

</DiagramGroup>

**இவை இரண்டு தனி counters; ஏனெனில் ஒவ்வொன்றும் tree-இல் அதன் சொந்த position-இல் render செய்யப்படுகிறது.** React-ஐ பயன்படுத்தும்போது இந்த positions பற்றி பொதுவாக சிந்திக்க வேண்டியதில்லை; ஆனால் இது எப்படி வேலை செய்கிறது என்பதைப் புரிந்துகொள்வது பயனுள்ளதாக இருக்கும்.

React-இல், screen-இல் உள்ள ஒவ்வொரு component-க்கும் முழுமையாக தனிமைப்படுத்தப்பட்ட state உள்ளது. எடுத்துக்காட்டாக, இரண்டு `Counter` components-ஐ பக்கப்பக்கமாக render செய்தால், ஒவ்வொன்றுக்கும் தனித்தனி, independent `score` மற்றும் `hover` states கிடைக்கும்.

இரண்டு counters-யையும் click செய்து பாருங்கள்; அவை ஒன்றையொன்று பாதிக்கவில்லை என்பதை கவனியுங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

நீங்கள் காண்பது போல, ஒரு counter update ஆன போது, அந்த component-க்கான state மட்டும் update ஆகிறது:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

State-ஐ update செய்தல்

</Diagram>

</DiagramGroup>


tree-இல் அதே position-இல் அதே component-ஐ render செய்யும் வரை React state-ஐ வைத்திருக்கும். இதைப் பார்க்க, இரண்டு counters-யையும் increment செய்து, "இரண்டாவது counter-ஐ render செய்" checkbox-ஐ uncheck செய்து இரண்டாவது component-ஐ அகற்றுங்கள்; பின்னர் மீண்டும் tick செய்து அதைச் சேருங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />}
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        இரண்டாவது counter-ஐ render செய்
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

இரண்டாவது counter-ஐ render செய்வதை நிறுத்தும் உடனே அதன் state முழுவதும் மறைந்து விடுகிறது என்பதை கவனியுங்கள். React component ஒன்றை அகற்றும்போது, அதன் state-ஐ destroy செய்வதால்தான் இது நடக்கிறது.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

component ஒன்றை நீக்குதல்

</Diagram>

</DiagramGroup>

"இரண்டாவது counter-ஐ render செய்" என்பதை tick செய்தால், இரண்டாவது `Counter` மற்றும் அதன் state ஆரம்பத்திலிருந்து (`score = 0`) initialize செய்யப்பட்டு DOM-இல் சேர்க்கப்படுகிறது.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

component ஒன்றைச் சேர்த்தல்

</Diagram>

</DiagramGroup>

**UI tree-இல் component அதன் position-இல் render செய்யப்படும் வரை React அந்த component-ன் state-ஐ பாதுகாக்கிறது.** அது அகற்றப்பட்டாலோ, அதே position-இல் வேறு component render செய்யப்பட்டாலோ, React அதன் state-ஐ கைவிடும்.

## அதே position-இல் அதே component state-ஐ பாதுகாக்கிறது {/*same-component-at-the-same-position-preserves-state*/}

இந்த எடுத்துக்காட்டில், இரண்டு வேறு `<Counter />` tags உள்ளன:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} />
      ) : (
        <Counter isFancy={false} />
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        fancy styling பயன்படுத்து
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

checkbox-ஐ tick செய்தாலும் clear செய்தாலும், counter state reset ஆகாது. `isFancy` `true` ஆக இருந்தாலும் `false` ஆக இருந்தாலும், root `App` component return செய்யும் `div`-ன் முதல் child ஆக எப்போதும் `<Counter />` இருக்கும்:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

`Counter` அதே position-இல் இருப்பதால், `App` state update ஆனாலும் `Counter` reset ஆகாது

</Diagram>

</DiagramGroup>


அதே position-இல் அதே component இருப்பதால், React-ன் பார்வையில் அது அதே counter தான்.

<Pitfall>

**React-க்கு முக்கியமானது UI tree-இல் உள்ள position; JSX markup-இல் உள்ள இடமல்ல** என்பதை நினைவில் கொள்ளுங்கள்! இந்த component-இல் `if`-க்குள் மற்றும் வெளியே வேறு `<Counter />` JSX tags உடன் இரண்டு `return` clauses உள்ளன:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          fancy styling பயன்படுத்து
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        fancy styling பயன்படுத்து
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

checkbox-ஐ tick செய்தால் state reset ஆகும் என்று நீங்கள் எதிர்பார்க்கலாம்; ஆனால் அது reset ஆகாது! ஏனெனில் **இந்த இரண்டு `<Counter />` tags-மும் அதே position-இல் render செய்யப்படுகின்றன.** உங்கள் function-இல் conditions எங்கே வைத்துள்ளீர்கள் என்பதை React அறியாது. அது "பார்ப்பது" நீங்கள் return செய்யும் tree மட்டுமே.

இரு நிலைகளிலும், `App` component முதல் child ஆக `<Counter />` கொண்ட `<div>`-ஐ return செய்கிறது. React-க்கு இந்த இரண்டு counters-க்கும் அதே "address" உள்ளது: root-ன் முதல் child-ன் முதல் child. உங்கள் logic-ஐ எப்படிச் structure செய்தாலும், முந்தைய render மற்றும் அடுத்த render இடையில் React அவற்றை இப்படித்தான் match செய்கிறது.

</Pitfall>

## அதே position-இல் வேறு components state-ஐ reset செய்கின்றன {/*different-components-at-the-same-position-reset-state*/}

இந்த எடுத்துக்காட்டில், checkbox-ஐ tick செய்தால் `<Counter>` ஒரு `<p>`-ஆல் மாற்றப்படும்:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>பிறகு பார்க்கலாம்!</p>
      ) : (
        <Counter />
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        ஓய்வு எடு
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

இங்கே, அதே position-இல் _வேறு_ component types-க்கு இடையில் switch செய்கிறீர்கள். ஆரம்பத்தில் `<div>`-ன் முதல் child-இல் `Counter` இருந்தது. ஆனால் நீங்கள் `p`-ஐ மாற்றிப் போட்டபோது, React UI tree-இலிருந்து `Counter`-ஐ அகற்றி அதன் state-ஐ destroy செய்தது.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

`Counter` `p` ஆக மாறும்போது, `Counter` நீக்கப்பட்டு `p` சேர்க்கப்படுகிறது

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

மீண்டும் switch செய்யும்போது, `p` நீக்கப்பட்டு `Counter` சேர்க்கப்படுகிறது

</Diagram>

</DiagramGroup>

மேலும், **அதே position-இல் வேறு component ஒன்றை render செய்தால், அதன் முழு subtree-ன் state reset ஆகும்.** இது எப்படி வேலை செய்கிறது என்பதைப் பார்க்க, counter-ஐ increment செய்து பின்னர் checkbox-ஐ tick செய்யுங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} />
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        fancy styling பயன்படுத்து
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

checkbox-ஐ click செய்தால் counter state reset ஆகிறது. நீங்கள் `Counter`-ஐ render செய்தாலும், `div`-ன் முதல் child `section`-இலிருந்து `div` ஆக மாறுகிறது. child `section` DOM-இலிருந்து அகற்றப்பட்டபோது, அதன் கீழுள்ள முழு tree-யும் (`Counter` மற்றும் அதன் state உட்பட) destroy செய்யப்பட்டது.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

`section` `div` ஆக மாறும்போது, `section` நீக்கப்பட்டு புதிய `div` சேர்க்கப்படுகிறது

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

மீண்டும் switch செய்யும்போது, `div` நீக்கப்பட்டு புதிய `section` சேர்க்கப்படுகிறது

</Diagram>

</DiagramGroup>

ஒரு பொதுவான விதியாக, **re-renders இடையில் state-ஐ பாதுகாக்க விரும்பினால், உங்கள் tree-ன் structure ஒரு render-இலிருந்து அடுத்த render-க்கு "match up" ஆக வேண்டும்.** structure வேறுபட்டால், state destroy ஆகும்; ஏனெனில் React tree-இலிருந்து component ஒன்றை அகற்றும்போது state-ஐ destroy செய்கிறது.

<Pitfall>

அதனால் தான் component function definitions-ஐ nest செய்யக்கூடாது.

இங்கே, `MyTextField` component function `MyComponent`-க்குள் *define* செய்யப்பட்டுள்ளது:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>{counter} முறை click செய்யப்பட்டது</button>
    </>
  );
}
```

</Sandpack>


button-ஐ click செய்யும் ஒவ்வொரு முறையும், input state மறைந்து விடுகிறது! காரணம், `MyComponent`-ன் ஒவ்வொரு render-க்கும் *வேறு* `MyTextField` function உருவாக்கப்படுகிறது. அதே position-இல் நீங்கள் *வேறு* component-ஐ render செய்கிறீர்கள், எனவே React கீழே உள்ள அனைத்து state-ஐயும் reset செய்கிறது. இது bugs மற்றும் performance பிரச்சினைகளுக்கு வழிவகுக்கும். இந்த பிரச்சினையைத் தவிர்க்க, **component functions-ஐ எப்போதும் top level-இல் declare செய்யுங்கள்; அவற்றின் definitions-ஐ nest செய்ய வேண்டாம்.**

</Pitfall>

## அதே position-இல் state-ஐ reset செய்தல் {/*resetting-state-at-the-same-position*/}

இயல்பாக, component அதே position-இல் இருக்கும் வரை React அதன் state-ஐ பாதுகாக்கும். பொதுவாக, நீங்கள் விரும்புவதும் இதுதான்; எனவே default behavior ஆக இது பொருத்தமானது. ஆனால் சில நேரங்களில், component-ன் state-ஐ reset செய்ய நீங்கள் விரும்பலாம். ஒவ்வொரு turn-இலும் இரண்டு players தங்கள் scores-ஐ கண்காணிக்க அனுமதிக்கும் இந்த app-ஐப் பாருங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        அடுத்த player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}-ன் மதிப்பெண்: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

தற்போது, player-ஐ மாற்றும் போது score பாதுகாக்கப்படுகிறது. இரண்டு `Counter`s-மும் அதே position-இல் தோன்றுகின்றன; எனவே `person` prop மாறிய *அதே* `Counter` என்று React பார்க்கிறது.

ஆனால் கருத்து ரீதியாக, இந்த app-இல் அவை இரண்டு தனி counters ஆக இருக்க வேண்டும். UI-இல் அவை அதே இடத்தில் தோன்றலாம்; ஆனால் ஒன்று Taylor-க்கான counter, மற்றொன்று Sarah-க்கான counter.

அவற்றுக்கு இடையில் switch செய்யும் போது state-ஐ reset செய்ய இரண்டு வழிகள் உள்ளன:

1. components-ஐ வேறு positions-இல் render செய்தல்
2. ஒவ்வொரு component-க்கும் `key` மூலம் explicit identity கொடுத்தல்


### Option 1: component ஒன்றை வேறு positions-இல் render செய்தல் {/*option-1-rendering-a-component-in-different-positions*/}

இந்த இரண்டு `Counter`s independent ஆக இருக்க வேண்டும் என்றால், அவற்றை இரண்டு வேறு positions-இல் render செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        அடுத்த player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}-ன் மதிப்பெண்: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* ஆரம்பத்தில், `isPlayerA` `true` ஆக உள்ளது. ஆகவே முதல் position-இல் `Counter` state உள்ளது; இரண்டாவது position காலியாக உள்ளது.
* "அடுத்த player" button-ஐ click செய்தால், முதல் position clear ஆகிறது; ஆனால் இரண்டாவது position இப்போது `Counter` ஒன்றைக் கொண்டுள்ளது.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

ஆரம்ப state

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

"next" click செய்தல்

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

"next" மீண்டும் click செய்தல்

</Diagram>

</DiagramGroup>

ஒவ்வொரு `Counter`-ன் state, அது DOM-இலிருந்து அகற்றப்படும் ஒவ்வொரு முறையும் destroy ஆகிறது. அதனால் தான் button-ஐ click செய்யும் ஒவ்வொரு முறையும் அவை reset ஆகின்றன.

அதே இடத்தில் render செய்யப்படும் independent components சிலவே இருந்தால் இந்த solution வசதியானது. இந்த எடுத்துக்காட்டில் இரண்டு மட்டுமே உள்ளன, எனவே JSX-இல் இரண்டையும் தனித்தனியாக render செய்வது சிரமமல்ல.

### Option 2: key மூலம் state-ஐ reset செய்தல் {/*option-2-resetting-state-with-a-key*/}

component-ன் state-ஐ reset செய்ய இன்னொரு, மேலும் generic ஆன வழியும் உள்ளது.

[lists render செய்யும் போது](/learn/rendering-lists#keeping-list-items-in-order-with-key) `key`s-ஐ நீங்கள் பார்த்திருக்கலாம். Keys lists-க்காக மட்டும் அல்ல! எந்த components-களையும் React வேறுபடுத்திக் கொள்ள keys-ஐப் பயன்படுத்தலாம். இயல்பாக, React parent-க்குள் உள்ள வரிசையை ("முதல் counter", "இரண்டாவது counter") பயன்படுத்தி components-ஐ வேறுபடுத்துகிறது. ஆனால் இது வெறும் *முதல்* counter அல்லது *இரண்டாவது* counter அல்ல, குறிப்பிட்ட counter -- எடுத்துக்காட்டாக, *Taylor-ன்* counter -- என்று React-க்கு சொல்ல keys உதவுகின்றன. இதனால் *Taylor-ன்* counter tree-இல் எங்கு தோன்றினாலும் React அதை அறியும்!

இந்த எடுத்துக்காட்டில், JSX-இல் அதே இடத்தில் தோன்றினாலும் இரண்டு `<Counter />`s state-ஐப் பகிரவில்லை:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        அடுத்த player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}-ன் மதிப்பெண்: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        ஒன்றைச் சேர்
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Taylor மற்றும் Sarah இடையே switch செய்தால் state பாதுகாக்கப்படாது. ஏனெனில் **நீங்கள் அவற்றுக்கு வேறு `key`s கொடுத்துள்ளீர்கள்:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

`key` குறிப்பிடுவது, parent-க்குள் உள்ள வரிசைக்கு பதிலாக `key`-யையே position-ன் பகுதியாகப் பயன்படுத்த வேண்டும் என்று React-க்கு சொல்கிறது. அதனால் JSX-இல் அதே இடத்தில் render செய்தாலும், React அவற்றை இரண்டு வேறு counters ஆகப் பார்க்கிறது; எனவே அவை ஒருபோதும் state-ஐப் பகிராது. counter screen-இல் தோன்றும் ஒவ்வொரு முறையும் அதன் state உருவாக்கப்படும். அது அகற்றப்படும் ஒவ்வொரு முறையும் அதன் state destroy ஆகும். அவற்றுக்கு இடையில் toggle செய்தால் அவற்றின் state மீண்டும் மீண்டும் reset ஆகும்.

<Note>

keys globally unique அல்ல என்பதை நினைவில் கொள்ளுங்கள். அவை *parent-க்குள்* உள்ள position-ஐ மட்டுமே குறிப்பிடுகின்றன.

</Note>

### key மூலம் form ஒன்றை reset செய்தல் {/*resetting-a-form-with-a-key*/}

forms-ஐ கையாளும் போது key மூலம் state-ஐ reset செய்வது குறிப்பாக பயனுள்ளதாக இருக்கும்.

இந்த chat app-இல், `<Chat>` component text input state-ஐக் கொண்டுள்ளது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={contact.name + ' உடன் chat'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

input-இல் ஏதாவது உள்ளிட்டு, பிறகு வேறு recipient-ஐத் தேர்வு செய்ய "Alice" அல்லது "Bob" அழுத்துங்கள். `<Chat>` tree-இல் அதே position-இல் render செய்யப்படுவதால் input state பாதுகாக்கப்படுகிறது என்பதை கவனிப்பீர்கள்.

**பல apps-இல் இது விரும்பத்தக்க behavior ஆக இருக்கலாம்; ஆனால் chat app-இல் அல்ல!** தவறுதலான click காரணமாக பயனர் ஏற்கனவே type செய்த message-ஐ தவறான நபருக்கு அனுப்ப அனுமதிக்க விரும்பமாட்டீர்கள். இதைச் சரிசெய்ய, `key` சேர்க்கவும்:

```js
<Chat key={to.id} contact={to} />
```

வேறு recipient-ஐத் தேர்வு செய்யும் போது, `Chat` component மற்றும் அதன் கீழுள்ள tree-இல் உள்ள எந்த state-உம் ஆரம்பத்திலிருந்து மீண்டும் உருவாக்கப்படும் என்பதை இது உறுதி செய்கிறது. React DOM elements-ஐ reuse செய்வதற்குப் பதிலாக மீண்டும் உருவாக்கும்.

இப்போது recipient-ஐ switch செய்தால் text field எப்போதும் clear ஆகும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={contact.name + ' உடன் chat'}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email}-க்கு அனுப்பு</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive>

#### அகற்றப்பட்ட components-க்கான state-ஐ பாதுகாத்தல் {/*preserving-state-for-removed-components*/}

உண்மையான chat app-இல், பயனர் முந்தைய recipient-ஐ மீண்டும் தேர்வு செய்யும்போது input state-ஐ recover செய்ய நீங்கள் விரும்பலாம். இனி தெரியாத component-க்காக state-ஐ "alive" வைத்திருக்க சில வழிகள் உள்ளன:

- தற்போதைய chat மட்டும் அல்லாமல் _அனைத்து_ chats-யையும் render செய்து, மற்ற அனைத்தையும் CSS மூலம் மறைக்கலாம். chats tree-இலிருந்து அகற்றப்படாது, எனவே அவற்றின் local state பாதுகாக்கப்படும். simple UIs-க்கு இந்த solution நன்றாக வேலை செய்கிறது. ஆனால் மறைக்கப்பட்ட trees பெரியதாகவும் நிறைய DOM nodes கொண்டதாகவும் இருந்தால் இது மிகவும் மெதுவாகலாம்.
- நீங்கள் [state-ஐ மேலே lift](/learn/sharing-state-between-components) செய்து, ஒவ்வொரு recipient-க்கான pending message-ஐ parent component-இல் வைத்திருக்கலாம். இவ்வாறு செய்தால் child components அகற்றப்பட்டாலும் பிரச்சினையில்லை; முக்கியமான தகவலை parent தான் வைத்திருக்கும். இது மிகவும் பொதுவான solution.
- React state-க்கு கூடுதலாக வேறு source ஒன்றையும் பயன்படுத்தலாம். எடுத்துக்காட்டாக, பயனர் தவறுதலாக page-ஐ close செய்தாலும் message draft நீடிக்க வேண்டும் என்று நீங்கள் விரும்பலாம். இதை implement செய்ய, `Chat` component அதன் state-ஐ [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)-இலிருந்து வாசித்து initialize செய்யவும், drafts-ஐ அங்கேயே save செய்யவும் செய்யலாம்.

எந்த strategy-ஐ தேர்வு செய்தாலும், _Alice உடன்_ chat மற்றும் _Bob உடன்_ chat கருத்து ரீதியாக வேறுபட்டவை; எனவே தற்போதைய recipient அடிப்படையில் `<Chat>` tree-க்கு `key` கொடுப்பது பொருத்தமானது.

</DeepDive>

<Recap>

- அதே component அதே position-இல் render செய்யப்படும் வரை React state-ஐ வைத்திருக்கும்.
- State JSX tags-இல் வைக்கப்படாது. நீங்கள் அந்த JSX-ஐ வைத்திருக்கும் tree position-உடன் அது தொடர்புடையது.
- வேறு key கொடுத்து subtree-ஐ அதன் state reset செய்ய கட்டாயப்படுத்தலாம்.
- component definitions-ஐ nest செய்யாதீர்கள்; இல்லையெனில் தவறுதலாக state reset ஆகும்.

</Recap>



<Challenges>

#### மறைந்து போகும் input text-ஐ சரிசெய்யுங்கள் {/*fix-disappearing-input-text*/}

இந்த எடுத்துக்காட்டு button-ஐ அழுத்தும்போது message ஒன்றைக் காட்டுகிறது. ஆனால் button-ஐ அழுத்துவது தவறுதலாக input-ஐயும் reset செய்கிறது. இது ஏன் நடக்கிறது? button-ஐ அழுத்தும்போது input text reset ஆகாதபடி சரிசெய்யுங்கள்.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>குறிப்பு: உங்களுக்கு பிடித்த நகரம்?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>குறிப்பை மறை</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>குறிப்பைக் காட்டு</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

பிரச்சினை என்னவெனில் `Form` வேறு positions-இல் render செய்யப்படுகிறது. `if` branch-இல், அது `<div>`-ன் இரண்டாவது child; ஆனால் `else` branch-இல், அது முதல் child. ஆகவே ஒவ்வொரு position-இலும் component type மாறுகிறது. முதல் position `p` மற்றும் `Form` இடையே மாறுகிறது; இரண்டாவது position `Form` மற்றும் `button` இடையே மாறுகிறது. component type மாறும் ஒவ்வொரு முறையும் React state-ஐ reset செய்கிறது.

`Form` எப்போதும் அதே position-இல் render ஆகும் வகையில் branches-ஐ ஒன்றுபடுத்துவது நேரடியான solution:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>குறிப்பு: உங்களுக்கு பிடித்த நகரம்?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>குறிப்பை மறை</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>குறிப்பைக் காட்டு</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


தொழில்நுட்ப ரீதியாக, `if` branch structure-க்கு match ஆக `else` branch-இல் `<Form />`-க்கு முன் `null`-ஐயும் சேர்க்கலாம்:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>குறிப்பு: உங்களுக்கு பிடித்த நகரம்?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>குறிப்பை மறை</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>குறிப்பைக் காட்டு</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

இவ்வாறு செய்தால், `Form` எப்போதும் இரண்டாவது child ஆக இருக்கும்; எனவே அது அதே position-இல் இருந்து தனது state-ஐ வைத்திருக்கும். ஆனால் இந்த approach தெளிவாக இல்லை; மேலும் வேறு யாராவது அந்த `null`-ஐ அகற்றிவிடும் அபாயத்தையும் கொண்டுவருகிறது.

</Solution>

#### இரண்டு form fields-ஐ மாற்றிக் கொள்ளுங்கள் {/*swap-two-form-fields*/}

இந்த form first name மற்றும் last name உள்ளிட அனுமதிக்கிறது. எந்த field முதலில் வர வேண்டும் என்பதை கட்டுப்படுத்தும் checkbox-யும் உள்ளது. checkbox-ஐ tick செய்தால், "கடைசி பெயர்" field "முதல் பெயர்" field-க்கு முன் தோன்றும்.

இது கிட்டத்தட்ட வேலை செய்கிறது, ஆனால் ஒரு bug உள்ளது. "முதல் பெயர்" input-ஐ நிரப்பி checkbox-ஐ tick செய்தால், text முதல் input-இலேயே இருக்கும் (அது இப்போது "கடைசி பெயர்"). order-ஐ reverse செய்யும் போது input text-உம் *சேர்ந்து* நகரும் வகையில் சரிசெய்யுங்கள்.

<Hint>

இந்த fields-க்கு parent-க்குள் உள்ள position மட்டும் போதவில்லை போல தெரிகிறது. re-renders இடையில் state-ஐ எப்படி match செய்ய வேண்டும் என்று React-க்கு சொல்ல ஏதாவது வழி உள்ளதா?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      வரிசையை மாற்று
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="கடைசி பெயர்" />
        <Field label="முதல் பெயர்" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="முதல் பெயர்" />
        <Field label="கடைசி பெயர்" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`if` மற்றும் `else` branches இரண்டிலும் உள்ள இரண்டு `<Field>` components-க்கும் `key` கொடுக்கவும். parent-க்குள் அவற்றின் order மாறினாலும், ஒவ்வொரு `<Field>`-க்கும் சரியான state-ஐ எப்படி "match up" செய்ய வேண்டும் என்பதை இது React-க்கு சொல்கிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      வரிசையை மாற்று
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="கடைசி பெயர்" />
        <Field key="firstName" label="முதல் பெயர்" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="முதல் பெயர்" />
        <Field key="lastName" label="கடைசி பெயர்" />
        {checkbox}
      </>
    );
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### detail form ஒன்றை reset செய்யுங்கள் {/*reset-a-detail-form*/}

இது editable contact list. தேர்ந்தெடுத்த contact-ன் details-ஐ edit செய்து, பின்னர் update செய்ய "சேமி" அல்லது உங்கள் மாற்றங்களை undo செய்ய "மீட்டமை" அழுத்தலாம்.

வேறு contact-ஐ (எடுத்துக்காட்டாக Alice) தேர்வு செய்தால் state update ஆகிறது; ஆனால் form முந்தைய contact-ன் details-ஐ தொடர்ந்து காட்டுகிறது. selected contact மாறும் போது form reset ஆகும் வகையில் சரிசெய்யுங்கள்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        பெயர்:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        மின்னஞ்சல்:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        சேமி
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        மீட்டமை
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

`EditContact` component-க்கு `key={selectedId}` கொடுக்கவும். இதனால் வேறு contacts இடையே switch செய்தால் form reset ஆகும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        பெயர்:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        மின்னஞ்சல்:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        சேமி
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        மீட்டமை
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### image loading ஆகும் போது அதை clear செய்யுங்கள் {/*clear-an-image-while-its-loading*/}

"அடுத்து" அழுத்தும் போது, browser அடுத்த image-ஐ loading செய்யத் தொடங்குகிறது. ஆனால் அது அதே `<img>` tag-இல் காட்டப்படுவதால், அடுத்தது load ஆகும் வரை இயல்பாக முந்தைய image-ஐவே நீங்கள் பார்க்கலாம். text எப்போதும் image-உடன் பொருந்த வேண்டும் என்பது முக்கியமானால், இது விரும்பத்தக்கதாக இருக்காது. "அடுத்து" அழுத்தும் தருணத்திலேயே முந்தைய image உடனடியாக clear ஆகும் வகையில் மாற்றுங்கள்.

<Hint>

DOM-ஐ reuse செய்வதற்குப் பதிலாக மீண்டும் உருவாக்க வேண்டும் என்று React-க்கு சொல்ல வழி உள்ளதா?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        அடுத்து
      </button>
      <h3>
        படம் {index + 1} / {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

`<img>` tag-க்கு `key` வழங்கலாம். அந்த `key` மாறும்போது, React `<img>` DOM node-ஐ ஆரம்பத்திலிருந்து மீண்டும் உருவாக்கும். ஒவ்வொரு image load ஆகும் போது இது சிறிய flash-ஐ ஏற்படுத்தும்; எனவே உங்கள் app-இல் உள்ள ஒவ்வொரு image-க்கும் இதைச் செய்ய விரும்பமாட்டீர்கள். ஆனால் image எப்போதும் text-உடன் பொருந்த வேண்டும் என்பதை உறுதி செய்ய விரும்பினால் இது பொருத்தமானது.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        அடுத்து
      </button>
      <h3>
        படம் {index + 1} / {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### list-இல் தவறான இடத்தில் இருக்கும் state-ஐ சரிசெய்யுங்கள் {/*fix-misplaced-state-in-the-list*/}

இந்த list-இல், ஒவ்வொரு `Contact`-க்கும் அதற்காக "email காட்டு" அழுத்தப்பட்டதா என்பதை தீர்மானிக்கும் state உள்ளது. Alice-க்காக "email காட்டு" அழுத்தி, பின்னர் "reverse order-இல் காட்டு" checkbox-ஐ tick செய்யுங்கள். இப்போது expand ஆகியிருப்பது _Taylor-ன்_ email; ஆனால் கீழே நகர்ந்த Alice-ன் email collapsed ஆகத் தெரிகிறது என்பதை கவனிப்பீர்கள்.

தேர்ந்தெடுத்த ordering எதுவாக இருந்தாலும் expanded state ஒவ்வொரு contact-உடனும் தொடர்புடையதாக இருக்கும் வகையில் சரிசெய்யுங்கள்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        reverse order-இல் காட்டு
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'மறை' : 'காட்டு'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

பிரச்சினை என்னவெனில் இந்த எடுத்துக்காட்டு index-ஐ `key` ஆகப் பயன்படுத்தியது:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

ஆனால் state _ஒவ்வொரு குறிப்பிட்ட contact_-உடன் தொடர்புடையதாக இருக்க வேண்டும்.

அதற்கு பதிலாக contact ID-ஐ `key` ஆகப் பயன்படுத்துவது பிரச்சினையை சரிசெய்கிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        reverse order-இல் காட்டு
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js src/Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'மறை' : 'காட்டு'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State tree position-உடன் தொடர்புடையது. order-ஐ நம்புவதற்குப் பதிலாக named position ஒன்றை குறிப்பிட `key` உதவுகிறது.

</Solution>

</Challenges>
