---
title: lazy
---

<Intro>

ஒரு component முதன்முறையாக render ஆகும் வரை அதன் code load ஆகுவதை defer செய்ய `lazy` உதவுகிறது.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `lazy(load)` {/*lazy*/}

Lazy-loaded React component declare செய்ய, உங்கள் components-க்கு வெளியே `lazy`-ஐ call செய்யுங்கள்:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `load`: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) அல்லது மற்றொரு *thenable* (`then` method கொண்ட Promise போன்ற object) return செய்யும் function. Return செய்யப்பட்ட component-ஐ முதன்முறையாக render செய்ய முயற்சிக்கும் வரை React `load`-ஐ call செய்யாது. React முதலில் `load`-ஐ call செய்த பிறகு, அது resolve ஆக காத்திருந்து, resolved value-ன் `.default`-ஐ React component ஆக render செய்யும். Return செய்யப்பட்ட Promise மற்றும் Promise-ன் resolved value இரண்டும் cache செய்யப்படும்; ஆகவே React `load`-ஐ ஒருமுறைக்கு மேல் call செய்யாது. Promise reject ஆனால், அருகிலுள்ள Error Boundary handle செய்ய React rejection reason-ஐ `throw` செய்யும்.

#### Returns {/*returns*/}

`lazy` உங்கள் tree-இல் render செய்யக்கூடிய React component-ஐ return செய்கிறது. Lazy component-க்கான code இன்னும் load ஆகிக்கொண்டிருக்கும்போது, அதை render செய்ய முயற்சிப்பது *suspend* ஆகும். அது load ஆகும் வரை loading indicator காட்ட [`<Suspense>`](/reference/react/Suspense)-ஐப் பயன்படுத்துங்கள்.

---

### `load` function {/*load*/}

#### Parameters {/*load-parameters*/}

`load` parameters எதையும் பெறாது.

#### Returns {/*load-returns*/}

நீங்கள் [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) அல்லது வேறு *thenable* (`then` method கொண்ட Promise போன்ற object) return செய்ய வேண்டும். அது இறுதியில் `.default` property ஒரு valid React component type ஆக இருக்கும் object-க்கு resolve ஆக வேண்டும்; உதாரணமாக function, [`memo`](/reference/react/memo), அல்லது [`forwardRef`](/reference/react/forwardRef) component.

---

## பயன்பாடு {/*usage*/}

### Suspense உடன் components-ஐ lazy-load செய்தல் {/*suspense-for-code-splitting*/}

வழக்கமாக, static [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) declaration மூலம் components-ஐ import செய்வீர்கள்:

```js
import MarkdownPreview from './MarkdownPreview.js';
```

இந்த component முதன்முறையாக render ஆகும் வரை அதன் code load ஆகுவதை defer செய்ய, இந்த import-ஐ இதனால் மாற்றுங்கள்:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

இந்த code [dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)-ஐ நம்புகிறது; இதற்கு உங்கள் bundler அல்லது framework support தேவைப்படலாம். இந்த pattern-ஐப் பயன்படுத்த, நீங்கள் import செய்யும் lazy component `default` export ஆக export செய்யப்பட்டிருக்க வேண்டும்.

இப்போது உங்கள் component-ன் code on demand load ஆகுவதால், அது load ஆகும் போது என்ன display ஆக வேண்டும் என்பதையும் குறிப்பிட வேண்டும். Lazy component அல்லது அதன் parents-இல் ஏதேனும் ஒன்றை [`<Suspense>`](/reference/react/Suspense) boundary-க்குள் wrap செய்வதன் மூலம் இதைச் செய்யலாம்:

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

இந்த உதாரணத்தில், `MarkdownPreview`-ஐ render செய்ய முயற்சிக்கும் வரை அதன் code load ஆகாது. `MarkdownPreview` இன்னும் load ஆகவில்லை என்றால், அதன் இடத்தில் `Loading` காட்டப்படும். Checkbox-ஐ tick செய்து பார்க்கவும்:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

இந்த demo artificial delay உடன் load ஆகிறது. அடுத்த முறை checkbox-ஐ untick செய்து tick செய்தால், `Preview` cache செய்யப்பட்டிருக்கும்; எனவே loading state இருக்காது. Loading state-ஐ மீண்டும் பார்க்க sandbox-இல் "Reset" click செய்யுங்கள்.

[Suspense மூலம் loading states கையாளுவது பற்றி மேலும் அறிக.](/reference/react/Suspense)

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### என் `lazy` component-ன் state எதிர்பாராத விதமாக reset ஆகிறது {/*my-lazy-components-state-gets-reset-unexpectedly*/}

`lazy` components-ஐ பிற components-க்குள் declare செய்ய வேண்டாம்:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: This will cause all state to be reset on re-renders
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

அதற்கு பதிலாக, அவற்றை எப்போதும் உங்கள் module-ன் top level-இல் declare செய்யுங்கள்:

```js {3-4}
import { lazy } from 'react';

// ✅ Good: Declare lazy components outside of your components
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
