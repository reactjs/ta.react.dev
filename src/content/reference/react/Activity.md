---
title: <Activity>
---

<Intro>

`<Activity>` அதன் children-ன் UI மற்றும் internal state-ஐ hide செய்து restore செய்ய அனுமதிக்கிறது.

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Activity>` {/*activity*/}

உங்கள் application-ன் ஒரு பகுதியை hide செய்ய Activity-ஐ பயன்படுத்தலாம்:

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Activity boundary <CodeStep step={1}>hidden</CodeStep> ஆக இருக்கும் போது, React `display: "none"` CSS property பயன்படுத்தி <CodeStep step={2}>அதன் children</CodeStep>-ஐ visual ஆக hide செய்யும். அவற்றின் Effects-ஐயும் destroy செய்து, active subscriptions ஏதேனும் இருந்தால் cleanup செய்யும்.

Hidden ஆக இருக்கும் போது, children புதிய props-க்கு பதிலாக இன்னும் re-render ஆகும்; ஆனால் மீதமுள்ள content-ஐ விட குறைந்த priority-யில்.

Boundary மீண்டும் <CodeStep step={3}>visible</CodeStep> ஆகும் போது, React children-ஐ அவற்றின் previous state restore செய்யப்பட்டபடி reveal செய்யும்; மேலும் அவற்றின் Effects-ஐ மீண்டும் create செய்யும்.

இந்த முறையில், Activity-ஐ "background activity" render செய்யும் mechanism ஆக நினைக்கலாம். மீண்டும் visible ஆக வாய்ப்புள்ள content-ஐ முழுமையாக discard செய்வதற்குப் பதிலாக, அந்த content-ன் UI மற்றும் internal state-ஐ maintain செய்து restore செய்ய Activity-ஐ பயன்படுத்தலாம்; அதே நேரத்தில் hidden content-க்கு வேண்டாத side effects இல்லை என்பதையும் உறுதி செய்யலாம்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

* `children`: நீங்கள் show மற்றும் hide செய்ய விரும்பும் UI.
* `mode`: `'visible'` அல்லது `'hidden'` ஆகியவற்றில் ஒன்றான string value. விடப்பட்டால் default ஆக `'visible'`.

#### Caveats {/*caveats*/}

- ஒரு Activity [ViewTransition](/reference/react/ViewTransition)-க்குள் render செய்யப்பட்டு, [startTransition](/reference/react/startTransition) காரணமான update மூலம் visible ஆனால், அது ViewTransition-ன் `enter` animation-ஐ activate செய்யும். அது hidden ஆனால், அதன் `exit` animation-ஐ activate செய்யும்.
- Text மட்டும் render செய்யும் *hidden* Activity, hidden text render செய்வதற்குப் பதிலாக எதையும் render செய்யாது; ஏனெனில் visibility changes apply செய்ய தொடர்புடைய DOM element இல்லை. உதாரணமாக, `<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` என்பது `const ComponentThatJustReturnsText = () => "வணக்கம், உலகம்!"`-க்காக DOM-இல் எந்த output-ஐயும் உருவாக்காது. `<Activity mode="visible"><ComponentThatJustReturnsText /></Activity>` visible text render செய்யும்.

---

## Usage {/*usage*/}

### மறைக்கப்பட்ட components-ன் state-ஐ restore செய்தல் {/*restoring-the-state-of-hidden-components*/}

React-இல், component ஒன்றை conditionally show அல்லது hide செய்ய வேண்டுமானால், பொதுவாக அந்த condition அடிப்படையில் அதை mount அல்லது unmount செய்வீர்கள்:

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

ஆனால் component-ஐ unmount செய்வது அதன் internal state-ஐ destroy செய்கிறது; அது எப்போதும் நீங்கள் விரும்புவது அல்ல.

அதற்கு பதிலாக Activity boundary மூலம் component-ஐ hide செய்தால், React அதன் state-ஐ பின்னர் பயன்படுத்த "save" செய்யும்:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

இதனால் components-ஐ hide செய்து, பின்னர் அவை இருந்த previous state-இல் restore செய்வது சாத்தியமாகிறது.

கீழுள்ள example-இல் expandable section கொண்ட sidebar உள்ளது. "மேலோட்டம்" அழுத்தினால், அதன் கீழே மூன்று subitems தெரியும். Main app area-விலும் sidebar-ஐ hide மற்றும் show செய்யும் button உள்ளது.

"மேலோட்டம்" section-ஐ expand செய்து, பின்னர் sidebar-ஐ மூடி மீண்டும் திறந்து பாருங்கள்:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Sidebar-ஐ toggle செய்
        </button>
        <h1>முக்கிய content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        மேலோட்டம்
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

`மேலோட்டம்` section எப்போதும் collapsed நிலையில் தொடங்குகிறது. `isShowingSidebar` `false` ஆக மாறும்போது sidebar-ஐ unmount செய்வதால், அதன் internal state முழுவதும் இழக்கப்படுகிறது.

இது Activity-க்கான சரியான use case. Sidebar-ஐ visual ஆக hide செய்தாலும், அதன் internal state-ஐ preserve செய்ய முடியும்.

Sidebar-ன் conditional rendering-ஐ Activity boundary-ஆல் மாற்றுவோம்:

```jsx {7,9}
// Before
{isShowingSidebar && (
  <Sidebar />
)}

// After
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

புதிய behavior-ஐ பாருங்கள்:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Sidebar-ஐ toggle செய்
        </button>
        <h1>முக்கிய content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        மேலோட்டம்
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

Sidebar implementation-இல் எந்த changes-உம் இல்லாமல், அதன் internal state இப்போது restore செய்யப்படுகிறது.

---

### மறைக்கப்பட்ட components-ன் DOM-ஐ restore செய்தல் {/*restoring-the-dom-of-hidden-components*/}

Activity boundaries `display: none` பயன்படுத்தி children-ஐ hide செய்வதால், hidden ஆக இருக்கும் போது அவற்றின் DOM-உம் preserve செய்யப்படுகிறது. User மீண்டும் interact செய்ய வாய்ப்புள்ள UI பகுதிகளில் ephemeral state maintain செய்ய இவை சிறந்தவை.

இந்த example-இல், Contact tab-இல் user message உள்ளிடக்கூடிய `<textarea>` உள்ளது. நீங்கள் text உள்ளிட்டு, Home tab-க்கு மாறி, பிறகு மீண்டும் Contact tab-க்கு வந்தால், draft message இழக்கப்படுகிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        தொடர்பு
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>எனக்கு ஒரு message அனுப்புங்கள்!</p>

      <textarea />

      <p>என்னை online-இல் இங்கே காணலாம்:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

ஏனெனில் `App`-இல் `Contact`-ஐ முழுமையாக unmount செய்கிறோம். Contact tab unmount ஆகும்போது, `<textarea>` element-ன் internal DOM state இழக்கப்படுகிறது.

Active tab-ஐ show மற்றும் hide செய்ய Activity boundary பயன்படுத்த மாறினால், ஒவ்வொரு tab-ன் DOM state-ஐ preserve செய்யலாம். Text உள்ளிட்டு tabs-ஐ மீண்டும் மாற்றிப் பாருங்கள்; draft message இனி reset ஆகவில்லை என்பதை காண்பீர்கள்:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        தொடர்பு
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Contact.js
export default function Contact() {
  return (
    <div>
      <p>எனக்கு ஒரு message அனுப்புங்கள்!</p>

      <textarea />

      <p>என்னை online-இல் இங்கே காணலாம்:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

இங்கேயும், Contact tab implementation-ஐ மாற்றாமல் அதன் internal state-ஐ preserve செய்ய Activity boundary உதவியது.

---

### தெரிய வாய்ப்புள்ள content-ஐ pre-render செய்தல் {/*pre-rendering-content-thats-likely-to-become-visible*/}

இதுவரை, user interact செய்த content-ன் ephemeral state-ஐ discard செய்யாமல், அதை Activity எப்படி hide செய்ய முடியும் என்பதை பார்த்தோம்.

ஆனால் user இன்னும் முதல் முறையாக பார்க்காத content-ஐ _prepare_ செய்யவும் Activity boundaries பயன்படுத்தப்படலாம்:

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

Activity boundary அதன் initial render போது <CodeStep step={1}>hidden</CodeStep> ஆக இருந்தால், அதன் children page-இல் visible ஆக இருக்காது — ஆனால் அவை visible content-ஐ விட குறைந்த priority-யில், Effects mount செய்யாமல், _இன்னும் render செய்யப்படும்_.

இந்த _pre-rendering_, children-க்கு தேவையான code அல்லது data-வை முன்கூட்டியே load செய்ய அனுமதிக்கிறது. பின்னர் Activity boundary visible ஆகும் போது, children குறைந்த loading time உடன் வேகமாக தோன்ற முடியும்.

ஒரு example-ஐ பார்க்கலாம்.

இந்த demo-வில், Posts tab சில data-வை load செய்கிறது. அதை அழுத்தினால், data fetch செய்யப்படும் போது Suspense fallback display ஆகும்:

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        பதிவுகள்
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 ஏற்றப்படுகிறது...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Implement செய்யப்படவில்லை');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'பதிவு #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

ஏனெனில் அதன் tab active ஆகும் வரை `App` `Posts`-ஐ mount செய்யாது.

Active tab-ஐ show மற்றும் hide செய்ய Activity boundary பயன்படுத்தும் வகையில் `App`-ஐ update செய்தால், app முதலில் load ஆகும்போது `Posts` pre-render செய்யப்படும்; அது visible ஆகும் முன் data fetch செய்ய இது அனுமதிக்கும்.

இப்போது Posts tab-ஐ click செய்து பாருங்கள்:

<Sandpack>

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        பதிவுகள்
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 ஏற்றப்படுகிறது...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Implement செய்யப்படவில்லை');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'பதிவு #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Hidden Activity boundary காரணமாக `Posts` வேகமான render-க்காக தன்னைத் தயார்படுத்த முடிந்தது.

---

User அடுத்ததாக interact செய்ய வாய்ப்புள்ள UI பகுதிகளுக்கான loading times-ஐ குறைக்க, hidden Activity boundaries மூலம் components-ஐ pre-render செய்வது சக்திவாய்ந்த வழி.

<Note>

**Suspense-enabled data sources மட்டுமே pre-rendering போது fetched செய்யப்படும்.** அவை:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) மற்றும் [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) போன்ற Suspense-enabled frameworks மூலம் data fetching
- [`lazy`](/reference/react/lazy) மூலம் component code lazy-load செய்தல்
- [`use`](/reference/react/use) மூலம் cached Promise-ன் value-ஐ வாசித்தல்

Effect-க்குள் fetched செய்யப்படும் data-வை Activity detect செய்யாது.

மேலுள்ள `Posts` component-இல் data load செய்யும் exact முறை உங்கள் framework-ஐப் பொறுத்தது. Suspense-enabled framework பயன்படுத்தினால், அதன் data fetching documentation-இல் details காண்பீர்கள்.

Opinionated framework இல்லாமல் Suspense-enabled data fetching இன்னும் support செய்யப்படவில்லை. Suspense-enabled data source implement செய்வதற்கான requirements unstable மற்றும் undocumented. Data sources-ஐ Suspense உடன் integrate செய்வதற்கான official API React-ன் எதிர்கால version-இல் release செய்யப்படும்.

</Note>

---


### Page load நேரத்தில் interactions-ஐ வேகப்படுத்துதல் {/*speeding-up-interactions-during-page-load*/}

React-இல் Selective Hydration என்ற internal performance optimization உள்ளது. இது உங்கள் app-ன் initial HTML-ஐ _chunks_-ஆக hydrate செய்வதன் மூலம் வேலை செய்கிறது; page-இல் உள்ள பிற components தங்கள் code அல்லது data-வை இன்னும் load செய்யாதிருந்தாலும், சில components interactive ஆக முடியும்.

Suspense boundaries Selective Hydration-இல் பங்கேற்கின்றன; ஏனெனில் அவை உங்கள் component tree-ஐ இயல்பாக ஒன்றிலிருந்து ஒன்று independent ஆன units-ஆகப் பிரிக்கின்றன:

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Chats ஏற்றப்படுகிறது...">
        <Chats />
      </Suspense>
    </>
  )
}
```

இங்கே, `Chats` mount ஆகி data fetch செய்யத் தொடங்குவதற்கு முன்பே, page-ன் initial render போது `MessageComposer` முழுமையாக hydrated ஆக முடியும்.

அதனால் உங்கள் component tree-ஐ தனித்தனி units-ஆகப் பிரிப்பதன் மூலம், app-ன் server-rendered HTML-ஐ chunks-ஆக hydrate செய்ய Suspense React-க்கு அனுமதிக்கிறது; இதனால் app-ன் பகுதிகள் முடிந்தவரை வேகமாக interactive ஆக முடியும்.

ஆனால் Suspense பயன்படுத்தாத pages பற்றி என்ன?

இந்த tabs example-ஐ எடுத்துக்கொள்ளுங்கள்:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        முகப்பு
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        வீடியோ
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

இங்கே, React முழு page-ஐ ஒரே நேரத்தில் hydrate செய்ய வேண்டும். `Home` அல்லது `Video` render ஆக மெதுவாக இருந்தால், hydration போது tab buttons unresponsive போலத் தோன்றலாம்.

Active tab-ஐ சுற்றி Suspense சேர்த்தால் இது தீரும்:

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        முகப்பு
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        வீடியோ
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...ஆனால் அது UI-யையும் மாற்றும்; ஏனெனில் initial render-இல் `Placeholder` fallback display ஆகும்.

அதற்கு பதிலாக Activity பயன்படுத்தலாம். Activity boundaries தங்கள் children-ஐ show மற்றும் hide செய்வதால், அவை component tree-ஐ இயல்பாக independent units-ஆகப் பிரிக்கின்றன. Suspense போலவே, இந்த feature அவற்றை Selective Hydration-இல் பங்கேற்க அனுமதிக்கிறது.

Active tab-ஐ சுற்றி Activity boundaries பயன்படுத்த example-ஐ update செய்வோம்:

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        முகப்பு
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        வீடியோ
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

இப்போது initial server-rendered HTML original version போலவே தெரிகிறது; ஆனால் Activity காரணமாக, `Home` அல்லது `Video` mount செய்வதற்கு முன்பே React tab buttons-ஐ முதலில் hydrate செய்ய முடியும்.

---

அதனால் content-ஐ hide மற்றும் show செய்வதற்கு கூடுதலாக, page-ன் எந்த பகுதிகள் தனியாக interactive ஆக முடியும் என்பதை React-க்கு தெரிவிப்பதன் மூலம், hydration போது உங்கள் app performance-ஐ மேம்படுத்த Activity boundaries உதவுகின்றன.

உங்கள் page அதன் content-ன் எந்த பகுதியையும் ஒருபோதும் hide செய்யாவிட்டாலும், hydration performance-ஐ மேம்படுத்த always-visible Activity boundaries சேர்க்கலாம்:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
}
```

---

## சிக்கல் தீர்க்குதல் {/*troubleshooting*/}

### என் hidden components-க்கு வேண்டாத side effects உள்ளன {/*my-hidden-components-have-unwanted-side-effects*/}

Activity boundary அதன் children-இல் `display: none` set செய்து, அவற்றின் Effects ஏதேனும் இருந்தால் cleanup செய்வதன் மூலம் content-ஐ hide செய்கிறது. எனவே side effects-ஐ சரியாக cleanup செய்யும் பெரும்பாலான well-behaved React components, Activity மூலம் hide செய்யப்படுவதற்கு ஏற்கனவே robust ஆக இருக்கும்.

ஆனால் hidden component ஒன்று unmounted component-இலிருந்து வேறுபடுமாறு நடக்கும் சில situations _உள்ளன_. குறிப்பாக, hidden component-ன் DOM destroy செய்யப்படாததால், அந்த DOM-இலிருந்து வரும் side effects component hidden ஆன பிறகும் persist ஆகும்.

உதாரணமாக, `<video>` tag-ஐ எடுத்துக்கொள்ளுங்கள். பொதுவாக இதற்கு cleanup தேவையில்லை; ஏனெனில் video play செய்து கொண்டிருந்தாலும், tag-ஐ unmount செய்வது browser-இல் video மற்றும் audio play ஆகுவதை நிறுத்திவிடும். இந்த demo-வில் video play செய்து, பிறகு Home அழுத்திப் பாருங்கள்:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        வீடியோ
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

Video எதிர்பார்த்தபடி play ஆகுவதை நிறுத்துகிறது.

இப்போது, user கடைசியாக பார்த்த timecode-ஐ preserve செய்ய விரும்புகிறோம் என்று வைத்துக்கொள்வோம்; அப்போது அவர்கள் மீண்டும் video tab-க்கு திரும்பும்போது அது ஆரம்பத்திலிருந்து மீண்டும் தொடங்காது.

இது Activity-க்கான சிறந்த use case!

Inactive tab-ஐ unmount செய்வதற்குப் பதிலாக hidden Activity boundary மூலம் hide செய்ய `App`-ஐ update செய்து, இந்த முறை demo எப்படி behave செய்கிறது என்று பார்ப்போம்:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        வீடியோ
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Video.js
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

அப்பா! Hidden ஆன பிறகும் video மற்றும் audio தொடர்ந்து play ஆகின்றன; ஏனெனில் tab-ன் `<video>` element இன்னும் DOM-இல் உள்ளது.

இதை fix செய்ய, video-ஐ pause செய்யும் cleanup function கொண்ட Effect ஒன்றை சேர்க்கலாம்:

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

`useEffect`-க்கு பதிலாக `useLayoutEffect` call செய்கிறோம்; ஏனெனில் conceptually cleanup code component-ன் UI visual ஆக hidden ஆகுவதுடன் தொடர்புடையது. Regular effect பயன்படுத்தினால், code re-suspending Suspense boundary அல்லது View Transition போன்றவற்றால் delayed ஆகலாம்.

புதிய behavior-ஐ பார்ப்போம். Video play செய்து, Home tab-க்கு மாறி, பின்னர் மீண்டும் Video tab-க்கு திரும்பிப் பாருங்கள்:

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        முகப்பு
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        வீடியோ
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>என் profile-க்கு வரவேற்கிறோம்!</p>
  );
}
```

```js src/Video.js
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

இது சிறப்பாக வேலை செய்கிறது! Activity boundary மூலம் video எப்போது hidden ஆனாலும் அது play ஆகுவதை cleanup function நிறுத்துகிறது. மேலும், `<video>` tag ஒருபோதும் destroy செய்யப்படாததால் timecode preserve செய்யப்படுகிறது; user மீண்டும் பார்க்க திரும்பும்போது video-வை மீண்டும் initialize அல்லது download செய்ய வேண்டியதில்லை.

Hidden ஆகும், ஆனால் user விரைவில் மீண்டும் interact செய்ய வாய்ப்புள்ள UI பகுதிகளின் ephemeral DOM state-ஐ preserve செய்ய Activity பயன்படுத்தும் சிறந்த example இது.

---

`<video>` போன்ற சில tags-க்கு unmount செய்வதும் hide செய்வதும் வெவ்வேறு behavior கொண்டவை என்பதை இந்த example காட்டுகிறது. ஒரு component side effect கொண்ட DOM render செய்தால், Activity boundary அதை hide செய்யும்போது அந்த side effect-ஐத் தடுக்க விரும்பினால், அதை cleanup செய்ய return function கொண்ட Effect சேர்க்கவும்.

இதற்கான மிகப் பொதுவான cases பின்வரும் tags-இல் இருக்கும்:

  - `<video>`
  - `<audio>`
  - `<iframe>`

பொதுவாக, உங்கள் React components-இன் பெரும்பாலானவை Activity boundary மூலம் hide செய்யப்படுவதற்கு ஏற்கனவே robust ஆக இருக்க வேண்டும். Conceptually, "hidden" Activities unmounted போலவே என்று நினைக்க வேண்டும்.

சரியான cleanup இல்லாத பிற Effects-ஐ விரைவாக கண்டுபிடிக்க [`<StrictMode>`](/reference/react/StrictMode) பயன்படுத்த பரிந்துரைக்கிறோம்; இது Activity boundaries-க்கு மட்டும் அல்ல, React-இல் பல பிற behaviors-க்கும் முக்கியமானது.

---


### என் hidden components-இல் இயங்காத Effects உள்ளன {/*my-hidden-components-have-effects-that-arent-running*/}

`<Activity>` "hidden" ஆக இருக்கும் போது, அதன் children-ன் எல்லா Effects-உம் cleaned up ஆகும். Conceptually, children unmounted ஆகின்றன; ஆனால் React அவற்றின் state-ஐ பின்னர் பயன்படுத்த save செய்கிறது. இது Activity-யின் feature; ஏனெனில் UI-ன் hidden பகுதிகளுக்காக subscriptions active ஆகாது, hidden content-க்கு தேவையான work குறையும்.

Component-ன் side effects cleanup செய்ய Effect mount ஆகும் என்பதை நீங்கள் நம்பியிருந்தால், அந்த work-ஐ return செய்யப்படும் cleanup function-இல் செய்யுமாறு Effect-ஐ refactor செய்யுங்கள்.

Problematic Effects-ஐ விரைவாக கண்டுபிடிக்க [`<StrictMode>`](/reference/react/StrictMode) சேர்க்க பரிந்துரைக்கிறோம்; இது unexpected side-effects-ஐ பிடிக்க Activity unmounts மற்றும் mounts-ஐ விரைவாக perform செய்யும்.
