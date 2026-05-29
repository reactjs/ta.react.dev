---
title: <StrictMode>
---


<Intro>

`<StrictMode>` development காலத்திலேயே உங்கள் components-இல் பொதுவான bugs-ஐ கண்டுபிடிக்க உதவுகிறது.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

உள்ளிருக்கும் component tree-க்கு கூடுதல் development behaviors மற்றும் warnings enable செய்ய `StrictMode` பயன்படுத்துங்கள்:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

Strict Mode பின்வரும் development-only behaviors-ஐ enable செய்கிறது:

- Impure rendering காரணமாக வரும் bugs-ஐ கண்டுபிடிக்க உங்கள் components [கூடுதலாக ஒருமுறை re-render](#fixing-bugs-found-by-double-rendering-in-development) ஆகும்.
- Missing Effect cleanup காரணமாக வரும் bugs-ஐ கண்டுபிடிக்க உங்கள் components [Effects-ஐ கூடுதலாக ஒருமுறை re-run](#fixing-bugs-found-by-re-running-effects-in-development) செய்யும்.
- Missing ref cleanup காரணமாக வரும் bugs-ஐ கண்டுபிடிக்க உங்கள் components [ref callbacks-ஐ கூடுதலாக ஒருமுறை re-run](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) செய்யும்.
- Deprecated APIs பயன்படுத்தப்படுகிறதா என்று உங்கள் components [check செய்யப்படும்.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` props ஏற்காது.

#### Caveats {/*caveats*/}

* `<StrictMode>`-இல் wrap செய்யப்பட்ட tree-க்குள் Strict Mode-இலிருந்து opt out செய்ய வழியில்லை. இதனால் `<StrictMode>`-க்குள் உள்ள எல்லா components-உம் check செய்யப்படுகின்றன என்ற நம்பிக்கை கிடைக்கும். ஒரு product-இல் வேலை செய்யும் இரண்டு teams இந்த checks பயனுள்ளதா என்பதைப் பற்றி ஒத்துக் கொள்ளவில்லை என்றால், அவர்கள் consensus அடைய வேண்டும் அல்லது `<StrictMode>`-ஐ tree-இல் கீழே நகர்த்த வேண்டும்.

---

## Usage {/*usage*/}

### முழு app-க்கும் Strict Mode இயக்குதல் {/*enabling-strict-mode-for-entire-app*/}

`<StrictMode>` component-க்குள் உள்ள முழு component tree-க்கும் Strict Mode கூடுதல் development-only checks enable செய்கிறது. Development process ஆரம்பத்திலேயே உங்கள் components-இல் பொதுவான bugs-ஐ கண்டுபிடிக்க இந்த checks உதவுகின்றன.


முழு app-க்கும் Strict Mode enable செய்ய, root component-ஐ render செய்யும்போது அதை `<StrictMode>`-ஆல் wrap செய்யுங்கள்:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

முழு app-ஐ Strict Mode-இல் wrap செய்ய பரிந்துரைக்கிறோம், குறிப்பாக புதிதாக உருவாக்கப்பட்ட apps-க்கு. உங்களுக்காக [`createRoot`](/reference/react-dom/client/createRoot) call செய்யும் framework பயன்படுத்தினால், Strict Mode enable செய்வது எப்படி என்பதை அதன் documentation-ல் பார்க்கவும்.

Strict Mode checks **development-இல் மட்டுமே run** ஆனாலும், production-இல் நம்பகமாக reproduce செய்ய கடினமான, ஏற்கனவே உங்கள் code-இல் இருக்கும் bugs-ஐ கண்டுபிடிக்க உதவுகின்றன. Users report செய்வதற்கு முன் bugs-ஐ fix செய்ய Strict Mode உதவுகிறது.

<Note>

Strict Mode development-இல் பின்வரும் checks-ஐ enable செய்கிறது:

- Impure rendering காரணமாக வரும் bugs-ஐ கண்டுபிடிக்க உங்கள் components [கூடுதலாக ஒருமுறை re-render](#fixing-bugs-found-by-double-rendering-in-development) ஆகும்.
- Missing Effect cleanup காரணமாக வரும் bugs-ஐ கண்டுபிடிக்க உங்கள் components [Effects-ஐ கூடுதலாக ஒருமுறை re-run](#fixing-bugs-found-by-re-running-effects-in-development) செய்யும்.
- Missing ref cleanup காரணமாக வரும் bugs-ஐ கண்டுபிடிக்க உங்கள் components [ref callbacks-ஐ கூடுதலாக ஒருமுறை re-run](#fixing-bugs-found-by-re-running-ref-callbacks-in-development) செய்யும்.
- Deprecated APIs பயன்படுத்தப்படுகிறதா என்று உங்கள் components [check செய்யப்படும்.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**இந்த checks அனைத்தும் development-only; production build-ஐ பாதிக்காது.**

</Note>

---

### App-ன் ஒரு பகுதிக்கு Strict Mode இயக்குதல் {/*enabling-strict-mode-for-a-part-of-the-app*/}

உங்கள் application-ன் எந்த பகுதியிற்கும் Strict Mode enable செய்யலாம்:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

இந்த example-இல், Strict Mode checks `Header` மற்றும் `Footer` components மீது run ஆகாது. ஆனால் `Sidebar` மற்றும் `Content` மீதும், அவற்றுக்குள் எவ்வளவு ஆழமாக இருந்தாலும் உள்ள எல்லா components மீதும் run ஆகும்.

<Note>

App-ன் ஒரு பகுதிக்கு `StrictMode` enable செய்யப்பட்டால், production-இல் சாத்தியமான behaviors-ஐ மட்டுமே React enable செய்யும். உதாரணமாக, app root-இல் `<StrictMode>` enable செய்யப்படவில்லை என்றால், initial mount-இல் அது [Effects-ஐ கூடுதலாக ஒருமுறை re-run](#fixing-bugs-found-by-re-running-effects-in-development) செய்யாது; ஏனெனில் parent effects இல்லாமல் child effects double fire ஆக இது காரணமாகும், அது production-இல் நடக்க முடியாது.

</Note>

---

### Development-இல் double rendering மூலம் கண்டுபிடிக்கப்படும் bugs-ஐ சரிசெய்தல் {/*fixing-bugs-found-by-double-rendering-in-development*/}

[நீங்கள் எழுதும் ஒவ்வொரு component-உம் pure function என்று React கருதுகிறது.](/learn/keeping-components-pure) இதன் பொருள், நீங்கள் எழுதும் React components ஒரே inputs (props, state, context) கொடுக்கப்பட்டால் எப்போதும் அதே JSX-ஐ return செய்ய வேண்டும்.

இந்த விதியை மீறும் components கணிக்க முடியாதபடி நடந்து bugs ஏற்படுத்தும். தவறுதலாக impure ஆன code-ஐ கண்டுபிடிக்க உதவ, Strict Mode உங்கள் சில functions-ஐ (pure ஆக இருக்க வேண்டியவற்றை மட்டும்) **development-இல் இருமுறை call செய்கிறது.** இதில் அடங்குபவை:

- உங்கள் component function body (top-level logic மட்டும்; எனவே event handlers-க்குள் உள்ள code இதில் சேராது)
- [`useState`](/reference/react/useState), [`set` functions](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), அல்லது [`useReducer`](/reference/react/useReducer)-க்கு நீங்கள் pass செய்யும் functions
- [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) போன்ற சில class component methods ([முழு பட்டியலை பார்க்கவும்](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

ஒரு function pure என்றால், அதை இருமுறை run செய்தாலும் அதன் behavior மாறாது; ஏனெனில் pure function ஒவ்வொரு முறையும் அதே result தரும். ஆனால் ஒரு function impure என்றால் (உதாரணமாக, அது பெறும் data-வை mutate செய்தால்), அதை இருமுறை run செய்வது தெளிவாக தெரியும் (அதுவே அதை impure ஆக்குகிறது!) இதனால் bug-ஐ ஆரம்பத்திலேயே கண்டுபிடித்து fix செய்ய முடியும்.

**Strict Mode-இல் double rendering bugs-ஐ ஆரம்பத்திலேயே கண்டுபிடிக்க எப்படி உதவுகிறது என்பதை விளக்கும் example இதோ.**

இந்த `StoryTray` component `stories` array-ஐ எடுத்து, முடிவில் கடைசி "Story உருவாக்கு" item ஒன்றை சேர்க்கிறது:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Story உருவாக்கு' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

மேலுள்ள code-இல் ஒரு தவறு உள்ளது. ஆனால் initial output சரியாகத் தோன்றுவதால் அதை தவறவிடுவது சாத்தியம்.

`StoryTray` component பல முறை re-render ஆனால் இந்த தவறு மேலும் தெளிவாக தெரியும். உதாரணமாக, அதன் மேல் hover செய்யும் ஒவ்வொரு முறையும் வேறு background color உடன் `StoryTray` re-render ஆகும்படி செய்வோம்:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Story உருவாக்கு' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

`StoryTray` component மீது hover செய்யும் ஒவ்வொரு முறையும் "Story உருவாக்கு" மீண்டும் list-க்கு சேர்க்கப்படுவதை கவனியுங்கள். Code-ன் நோக்கம் அதை முடிவில் ஒருமுறை மட்டும் சேர்ப்பதே. ஆனால் `StoryTray` props-இலிருந்து வந்த `stories` array-ஐ நேரடியாக modify செய்கிறது. `StoryTray` render ஆகும் ஒவ்வொரு முறையும், அதே array-ன் முடிவில் "Story உருவாக்கு" மீண்டும் சேர்க்கப்படுகிறது. வேறு வார்த்தைகளில், `StoryTray` pure function அல்ல--அதை பல முறை run செய்தால் வெவ்வேறு results கிடைக்கும்.

இந்த பிரச்சினையை fix செய்ய, array-ன் copy ஒன்றை உருவாக்கி, original array-க்கு பதிலாக அந்த copy-ஐ modify செய்யலாம்:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Array-ஐ clone செய்
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Story உருவாக்கு' });
```

இது [`StoryTray` function-ஐ pure ஆக்கும்.](/learn/keeping-components-pure) அது call செய்யப்படும் ஒவ்வொரு முறையும், array-ன் புதிய copy-ஐ மட்டுமே modify செய்யும்; எந்த external objects அல்லது variables-ஐயும் பாதிக்காது. இது bug-ஐ தீர்க்கிறது, ஆனால் அதன் behavior-இல் ஏதோ தவறு இருப்பது தெளிவாகத் தெரியும் முன் component அதிகமாக re-render ஆக வேண்டியிருந்தது.

**Original example-இல் bug தெளிவாக தெரியவில்லை. இப்போது original (buggy) code-ஐ `<StrictMode>`-இல் wrap செய்வோம்:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Story உருவாக்கு' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode உங்கள் rendering function-ஐ *எப்போதும்* இருமுறை call செய்கிறது; எனவே தவறை உடனே பார்க்க முடியும்** ("Story உருவாக்கு" இருமுறை தோன்றுகிறது). இதனால் இத்தகைய தவறுகளை process ஆரம்பத்திலேயே கவனிக்க முடியும். உங்கள் component Strict Mode-இல் render ஆகுமாறு fix செய்தால், முன்னிருந்த hover functionality போன்ற பல சாத்தியமான future production bugs-ஐயும் *அதே நேரத்தில்* fix செய்கிறீர்கள்:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Array-ஐ clone செய்
  items.push({ id: 'create', label: 'Story உருவாக்கு' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Strict Mode இல்லாமல், மேலும் re-renders சேர்க்கும் வரை bug-ஐ தவறவிடுவது நேரடியாக இருந்தது. Strict Mode அதே bug-ஐ உடனே தோன்றச் செய்தது. உங்கள் team-க்கும் users-க்கும் push செய்வதற்கு முன் bugs-ஐ கண்டுபிடிக்க Strict Mode உதவுகிறது.

[Components pure ஆக வைத்திருப்பது பற்றி மேலும் வாசிக்கவும்.](/learn/keeping-components-pure)

<Note>

[React DevTools](/learn/react-developer-tools) installed இருந்தால், second render call-இல் வரும் `console.log` calls சற்று dimmed ஆகத் தோன்றும். அவற்றை முழுமையாக suppress செய்ய React DevTools ஒரு setting-ஐயும் வழங்குகிறது (default ஆக off).

</Note>

---

### Development-இல் Effects re-run செய்வதால் கண்டுபிடிக்கப்படும் bugs-ஐ சரிசெய்தல் {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode [Effects](/learn/synchronizing-with-effects)-இல் bugs கண்டுபிடிக்கவும் உதவும்.

ஒவ்வொரு Effect-க்கும் சில setup code இருக்கும்; cleanup code-உம் இருக்கலாம். பொதுவாக, component *mount* ஆகும் போது (screen-க்கு சேர்க்கப்படும் போது) React setup call செய்கிறது; component *unmount* ஆகும் போது (screen-இலிருந்து நீக்கப்படும் போது) cleanup call செய்கிறது. கடைசி render-இலிருந்து dependencies மாறியிருந்தால், React cleanup மற்றும் setup-ஐ மீண்டும் call செய்கிறது.

Strict Mode on ஆக இருந்தால், React ஒவ்வொரு Effect-க்கும் **development-இல் கூடுதலாக ஒரு setup+cleanup cycle** run செய்யும். இது ஆச்சரியமாகத் தோன்றலாம், ஆனால் manually பிடிக்க கடினமான subtle bugs-ஐ வெளிப்படுத்த உதவுகிறது.

**Strict Mode-இல் Effects re-run செய்வது bugs-ஐ ஆரம்பத்திலேயே கண்டுபிடிக்க எப்படி உதவுகிறது என்பதை விளக்கும் example இதோ.**

Component ஒன்றை chat-க்கு connect செய்யும் இந்த example-ஐ கவனியுங்கள்:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்கிறது...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

இந்த code-இல் ஒரு issue உள்ளது, ஆனால் அது உடனடியாக தெளிவாகத் தெரியாமல் இருக்கலாம்.

Issue-ஐ தெளிவாக காட்ட, ஒரு feature implement செய்வோம். கீழுள்ள example-இல், `roomId` hardcoded இல்லை. அதற்கு பதிலாக, user dropdown-இலிருந்து connect செய்ய விரும்பும் `roomId`-ஐ select செய்யலாம். "Chat-ஐ திற" click செய்து, பிறகு வெவ்வேறு chat rooms-ஐ ஒன்றன்பின் ஒன்றாக select செய்யுங்கள். Console-இல் active connections எண்ணிக்கையை கவனியுங்கள்:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்ந்தெடுக்கவும்:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்கிறது...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Open connections எண்ணிக்கை தொடர்ந்து அதிகரித்துக்கொண்டே இருப்பதை கவனிப்பீர்கள். உண்மையான app-இல், இது performance மற்றும் network பிரச்சினைகளை ஏற்படுத்தும். Issue என்னவென்றால், [உங்கள் Effect-இல் cleanup function இல்லை:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

இப்போது உங்கள் Effect தன்னைத்தானே "clean up" செய்து outdated connections-ஐ destroy செய்வதால் leak தீர்கிறது. ஆனால், மேலும் features (select box) சேர்க்கும் வரை பிரச்சினை visible ஆகவில்லை என்பதை கவனியுங்கள்.

**Original example-இல் bug தெளிவாக தெரியவில்லை. இப்போது original (buggy) code-ஐ `<StrictMode>`-இல் wrap செய்வோம்:**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்கிறது...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Strict Mode உடன், பிரச்சினை இருப்பதை உடனே பார்க்கிறீர்கள்** (active connections எண்ணிக்கை 2 ஆக தாவுகிறது). Strict Mode ஒவ்வொரு Effect-க்கும் கூடுதல் setup+cleanup cycle run செய்கிறது. இந்த Effect-க்கு cleanup logic இல்லை; எனவே இது extra connection உருவாக்குகிறது, ஆனால் அதை destroy செய்யாது. இது cleanup function missing என்பதற்கான hint.

இத்தகைய தவறுகளை process ஆரம்பத்திலேயே கவனிக்க Strict Mode உதவுகிறது. Strict Mode-இல் cleanup function சேர்த்து Effect-ஐ fix செய்தால், முன்னிருந்த select box போன்ற பல சாத்தியமான future production bugs-ஐயும் *அதே நேரத்தில்* fix செய்கிறீர்கள்:

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} room-க்கு வரவேற்கிறோம்!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Chat room-ஐ தேர்ந்தெடுக்கவும்:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Chat-ஐ மூடு' : 'Chat-ஐ திற'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ "' + roomId + '" room-க்கு ' + serverUrl + '-இல் connect செய்கிறது...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ "' + roomId + '" room-இலிருந்து ' + serverUrl + '-இல் disconnect செய்யப்பட்டது');
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Console-இல் active connection count இனி தொடர்ந்து அதிகரிக்கவில்லை என்பதை கவனியுங்கள்.

Strict Mode இல்லாமல், உங்கள் Effect-க்கு cleanup தேவை என்பதை தவறவிடுவது நேரடியாக இருந்தது. Development-இல் உங்கள் Effect-க்கு *setup* மட்டும் run செய்வதற்குப் பதிலாக *setup → cleanup → setup* run செய்வதால், missing cleanup logic-ஐ Strict Mode தெளிவாக காட்டியது.

[Effect cleanup implement செய்வது பற்றி மேலும் வாசிக்கவும்.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### Development-இல் ref callbacks re-run செய்வதால் கண்டுபிடிக்கப்படும் bugs-ஐ சரிசெய்தல் {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

Strict Mode [callback refs](/learn/manipulating-the-dom-with-refs)-இலுள்ள bugs கண்டுபிடிக்கவும் உதவும்.

ஒவ்வொரு callback `ref`-க்கும் சில setup code இருக்கும்; cleanup code-உம் இருக்கலாம். பொதுவாக, element *created* ஆகும் போது (DOM-க்கு சேர்க்கப்படும் போது) React setup call செய்கிறது; element *removed* ஆகும் போது (DOM-இலிருந்து நீக்கப்படும் போது) cleanup call செய்கிறது.

Strict Mode on ஆக இருந்தால், React ஒவ்வொரு callback `ref`-க்கும் **development-இல் கூடுதலாக ஒரு setup+cleanup cycle** run செய்யும். இது ஆச்சரியமாகத் தோன்றலாம், ஆனால் manually பிடிக்க கடினமான subtle bugs-ஐ வெளிப்படுத்த உதவுகிறது.

ஒரு பட்டியலில் இருந்து item வகையை select செய்து, அவற்றில் ஒன்றுக்கு scroll செய்ய அனுமதிக்கும் இந்த example-ஐ கவனியுங்கள். "Neo" மற்றும் "Millie" இடையே switch செய்தால், list-இல் items எண்ணிக்கை தொடர்ந்து அதிகரிப்பதை console logs காட்டும்; மேலும் "இங்கு scroll செய்" buttons வேலை செய்யாமல் போகும்:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>இங்கு scroll செய்:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Map-க்கு item சேர்க்கிறது. மொத்த items: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ List-இல் items மிக அதிகம்!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
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


**இது production bug!** Ref callback cleanup-இல் items-ஐ list-இலிருந்து remove செய்யாததால், items list தொடர்ந்து அதிகரிக்கிறது. இது உண்மையான app-இல் performance பிரச்சினைகளை ஏற்படுத்தக்கூடிய memory leak; மேலும் app behavior-ஐ உடைக்கிறது.

Issue என்னவென்றால், ref callback தன்னைத்தானே cleanup செய்யவில்லை:

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

இப்போது original (buggy) code-ஐ `<StrictMode>`-இல் wrap செய்வோம்:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>இங்கு scroll செய்:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Map-க்கு item சேர்க்கிறது. மொத்த items: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ List-இல் items மிக அதிகம்!');
                }
                return () => {
                  // 🚩 No cleanup, this is a bug!
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
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

**Strict Mode உடன், பிரச்சினை இருப்பதை உடனே பார்க்கிறீர்கள்**. Strict Mode ஒவ்வொரு callback ref-க்கும் கூடுதல் setup+cleanup cycle run செய்கிறது. இந்த callback ref-க்கு cleanup logic இல்லை; எனவே இது refs சேர்க்கிறது, ஆனால் அவற்றை remove செய்யாது. இது cleanup function missing என்பதற்கான hint.

Callback refs-இல் உள்ள தவறுகளை விரைவாக கண்டுபிடிக்க Strict Mode உதவுகிறது. Strict Mode-இல் cleanup function சேர்த்து callback-ஐ fix செய்தால், முன் இருந்த "இங்கு scroll செய்" bug போன்ற பல சாத்தியமான future production bugs-ஐயும் *அதே நேரத்தில்* fix செய்கிறீர்கள்:

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef([]);
  const [catList, setCatList] = useState(setupCatList);
  const [cat, setCat] = useState('neo');

  function scrollToCat(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  const cats = catList.filter(c => c.type === cat)

  return (
    <>
      <nav>
        <button onClick={() => setCat('neo')}>Neo</button>
        <button onClick={() => setCat('millie')}>Millie</button>
      </nav>
      <hr />
      <nav>
        <span>இங்கு scroll செய்:</span>{cats.map((cat, index) => (
          <button key={cat.src} onClick={() => scrollToCat(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {cats.map((cat) => (
            <li
              key={cat.src}
              ref={(node) => {
                const list = itemsRef.current;
                const item = {cat: cat, node};
                list.push(item);
                console.log(`✅ Map-க்கு item சேர்க்கிறது. மொத்த items: ${list.length}`);
                if (list.length > 10) {
                  console.log('❌ List-இல் items மிக அதிகம்!');
                }
                return () => {
                  list.splice(list.indexOf(item), 1);
                  console.log(`❌ Map-இலிருந்து item நீக்குகிறது. மொத்த items: ${itemsRef.current.length}`);
                }
              }}
            >
              <img src={cat.src} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'neo', src: "https://placecats.com/neo/320/240?" + i});
  }
  for (let i = 0; i < 10; i++) {
    catList.push({type: 'millie', src: "https://placecats.com/millie/320/240?" + i});
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

இப்போது StrictMode-இல் initial mount போது, ref callbacks அனைத்தும் setup செய்யப்படுகின்றன, cleanup செய்யப்படுகின்றன, பின்னர் மீண்டும் setup செய்யப்படுகின்றன:

```
...
✅ Map-க்கு item சேர்க்கிறது. மொத்த items: 10
...
❌ Map-இலிருந்து item நீக்குகிறது. மொத்த items: 0
...
✅ Map-க்கு item சேர்க்கிறது. மொத்த items: 10
```

**இது எதிர்பார்க்கப்பட்டதே.** Ref callbacks சரியாக cleaned up ஆகின்றன என்பதை Strict Mode உறுதி செய்கிறது; எனவே size எதிர்பார்த்த அளவை மீறி வளராது. Fix பிறகு, memory leaks இல்லை, மேலும் எல்லா features-உம் எதிர்பார்த்தபடி வேலை செய்கின்றன.

Strict Mode இல்லாமல், app-இல் பல இடங்களில் click செய்து broken features கவனிக்கும் வரை bug-ஐ தவறவிடுவது நேரடியாக இருந்தது. Production-க்கு push செய்வதற்கு முன் bugs உடனே தோன்றும்படி Strict Mode செய்தது.

---
### Strict Mode காட்டும் deprecation warnings-ஐ சரிசெய்தல் {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

`<StrictMode>` tree-க்குள் எங்காவது உள்ள component இந்த deprecated APIs-இல் ஒன்றை பயன்படுத்தினால் React warn செய்யும்:

* [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount) போன்ற `UNSAFE_` class lifecycle methods. [Alternatives-ஐ பார்க்கவும்.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)

இந்த APIs முதன்மையாக பழைய [class components](/reference/react/Component)-இல் பயன்படுத்தப்படுகின்றன; எனவே modern apps-இல் அரிதாகவே தோன்றும்.
