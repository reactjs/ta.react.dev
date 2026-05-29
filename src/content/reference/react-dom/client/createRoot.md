---
title: createRoot
---

<Intro>

Browser DOM node-க்குள் React components display செய்ய root ஒன்றை உருவாக்க `createRoot` உதவுகிறது.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Browser DOM element-க்குள் content display செய்ய React root ஒன்றை உருவாக்க `createRoot` call செய்யவும்.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React `domNode`-க்கு root ஒன்றை உருவாக்கி, அதன் உள்ளே உள்ள DOM-ஐ manage செய்வதை எடுத்துக்கொள்ளும். Root உருவாக்கிய பிறகு, அதற்குள் React component display செய்ய [`root.render`](#root-render) call செய்ய வேண்டும்:

```js
root.render(<App />);
```

React-இல் முழுமையாக build செய்யப்பட்ட app-க்கு, பொதுவாக அதன் root component-க்காக ஒரே ஒரு `createRoot` call மட்டுமே இருக்கும். Page-ன் சில பகுதிகளுக்கு React "sprinkles" பயன்படுத்தும் page-க்கு தேவையான அளவு தனித்தனி roots இருக்கலாம்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: [DOM element.](https://developer.mozilla.org/en-US/docs/Web/API/Element) இந்த DOM element-க்காக React root உருவாக்கி, rendered React content display செய்ய `render` போன்ற functions-ஐ root மீது call செய்ய அனுமதிக்கும்.

* **optional** `options`: இந்த React root-க்கான options கொண்ட object.

  * **optional** `onCaughtError`: Error Boundary-இல் React error ஒன்றை catch செய்தபோது call செய்யப்படும் callback. Error Boundary catch செய்த `error` மற்றும் `componentStack` கொண்ட `errorInfo` object உடன் call செய்யப்படும்.
  * **optional** `onUncaughtError`: Error ஒன்று throw செய்யப்பட்டு Error Boundary-யால் catch செய்யப்படாதபோது call செய்யப்படும் callback. Throw செய்யப்பட்ட `error` மற்றும் `componentStack` கொண்ட `errorInfo` object உடன் call செய்யப்படும்.
  * **optional** `onRecoverableError`: Errors-இலிருந்து React தானாக recover செய்யும்போது call செய்யப்படும் callback. React throw செய்யும் `error` மற்றும் `componentStack` கொண்ட `errorInfo` object உடன் call செய்யப்படும். சில recoverable errors, original error cause-ஐ `error.cause` ஆகக் கொண்டிருக்கலாம்.
  * **optional** `identifierPrefix`: [`useId`](/reference/react/useId) உருவாக்கும் IDs-க்கு React பயன்படுத்தும் string prefix. ஒரே page-இல் பல roots பயன்படுத்தும்போது conflicts தவிர்க்க உதவும்.

#### Returns {/*returns*/}

`createRoot` இரண்டு methods கொண்ட object ஒன்றை return செய்கிறது: [`render`](#root-render) மற்றும் [`unmount`](#root-unmount).

#### கவனிக்க வேண்டியவை {/*caveats*/}
* உங்கள் app server-rendered ஆக இருந்தால், `createRoot()` பயன்படுத்துவது supported அல்ல. அதற்கு பதிலாக [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) பயன்படுத்தவும்.
* உங்கள் app-இல் ஒரே ஒரு `createRoot` call மட்டுமே இருக்க வாய்ப்பு அதிகம். Framework பயன்படுத்தினால், அது இந்த call-ஐ உங்களுக்காகச் செய்யலாம்.
* உங்கள் component-ன் child அல்லாத DOM tree-ன் வேறு பகுதியில் JSX துண்டை render செய்ய வேண்டுமெனில் (உதாரணமாக, modal அல்லது tooltip), `createRoot`-க்கு பதிலாக [`createPortal`](/reference/react-dom/createPortal) பயன்படுத்தவும்.

---

### `root.render(reactNode)` {/*root-render*/}

React root-ன் browser DOM node-க்குள் [JSX](/learn/writing-markup-with-jsx) துண்டை ("React node") display செய்ய `root.render` call செய்யவும்.

```js
root.render(<App />);
```

React `root`-இல் `<App />`-ஐ display செய்து, அதன் உள்ளே உள்ள DOM-ஐ manage செய்வதை எடுத்துக்கொள்ளும்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*root-render-parameters*/}

* `reactNode`: நீங்கள் display செய்ய விரும்பும் *React node*. இது பொதுவாக `<App />` போன்ற JSX துண்டாக இருக்கும்; ஆனால் [`createElement()`](/reference/react/createElement) கொண்டு உருவாக்கப்பட்ட React element, string, number, `null`, அல்லது `undefined`-யையும் pass செய்யலாம்.


#### Returns {/*root-render-returns*/}

`root.render` `undefined` return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*root-render-caveats*/}

* `root.render`-ஐ முதல் முறை call செய்யும்போது, React component-ஐ render செய்வதற்கு முன் React root-க்குள் உள்ள எல்லா existing HTML content-ஐயும் React clear செய்யும்.

* உங்கள் root-ன் DOM node, server-இல் அல்லது build போது React உருவாக்கிய HTML கொண்டிருந்தால், event handlers-ஐ existing HTML-க்கு attach செய்யும் [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)-ஐ பயன்படுத்தவும்.

* அதே root-இல் `render`-ஐ ஒன்றுக்கு மேல் முறை call செய்தால், நீங்கள் pass செய்த latest JSX-ஐ பிரதிபலிக்க React தேவையானபடி DOM-ஐ update செய்யும். முன்பு rendered tree உடன் ["matching it up"](/learn/preserving-and-resetting-state) செய்து DOM-ன் எந்த பகுதிகளை reuse செய்யலாம், எவை recreate செய்ய வேண்டும் என்பதை React தீர்மானிக்கும். அதே root-இல் மீண்டும் `render` call செய்வது root component-இல் [`set` function](/reference/react/useState#setstate) call செய்வதைப் போன்றது: React தேவையற்ற DOM updates-ஐ தவிர்க்கும்.

* Rendering தொடங்கிய பிறகு synchronous என்றாலும், `root.render(...)` அப்படி அல்ல. அதாவது அந்த குறிப்பிட்ட render-ன் effects (`useLayoutEffect`, `useEffect`) fire ஆகும்முன் `root.render()`-க்கு பிறகு உள்ள code run ஆகலாம். இது பொதுவாக பரவாயில்லை, அரிதாகவே adjustment தேவைப்படும். Effect timing முக்கியமான அரிதான cases-இல், initial render முழுமையாக synchronously run ஆகும்படி `root.render(...)`-ஐ [`flushSync`](https://react.dev/reference/react-dom/flushSync)-க்குள் wrap செய்யலாம்.

  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 The HTML will not include the rendered <App /> yet:
  console.log(document.body.innerHTML);
  ```

---

### `root.unmount()` {/*root-unmount*/}

React root-க்குள் rendered tree ஒன்றை destroy செய்ய `root.unmount` call செய்யவும்.

```js
root.unmount();
```

React-இல் முழுமையாக build செய்யப்பட்ட app-க்கு பொதுவாக `root.unmount` calls எதுவும் இருக்காது.

உங்கள் React root-ன் DOM node (அல்லது அதன் ancestors-இல் ஏதேனும் ஒன்று) வேறு code மூலம் DOM-இலிருந்து அகற்றப்படக்கூடும் என்றால் இது பெரும்பாலும் பயனுள்ளதாக இருக்கும். உதாரணமாக, inactive tabs-ஐ DOM-இலிருந்து அகற்றும் jQuery tab panel ஒன்றை நினைத்துப் பாருங்கள். Tab ஒன்று அகற்றப்பட்டால், அதற்குள் உள்ள அனைத்தும் (அதற்குள் உள்ள React roots உட்பட) DOM-இலிருந்து அகற்றப்படும். அப்படியானால், அகற்றப்பட்ட root-ன் content-ஐ manage செய்வதை "stop" செய்ய React-க்கு `root.unmount` call செய்து சொல்ல வேண்டும். இல்லையெனில், அகற்றப்பட்ட root-க்குள் உள்ள components subscriptions போன்ற global resources-ஐ clean up செய்து free செய்ய வேண்டுமென்று அறியாது.

`root.unmount` call செய்வது root-இல் உள்ள அனைத்து components-ஐயும் unmount செய்து, tree-இல் உள்ள event handlers அல்லது state ஆகியவற்றை நீக்குவதையும் உட்பட, root DOM node-இலிருந்து React-ஐ "detach" செய்யும்.


#### Parameters {/*root-unmount-parameters*/}

`root.unmount` எந்த parameters-யும் ஏற்காது.


#### Returns {/*root-unmount-returns*/}

`root.unmount` `undefined` return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*root-unmount-caveats*/}

* `root.unmount` call செய்வது tree-இல் உள்ள அனைத்து components-ஐயும் unmount செய்து root DOM node-இலிருந்து React-ஐ "detach" செய்யும்.

* `root.unmount` call செய்த பிறகு அதே root-இல் மீண்டும் `root.render` call செய்ய முடியாது. Unmounted root-இல் `root.render` call செய்ய முயன்றால் "Cannot update an unmounted root" error throw ஆகும். ஆனால் அந்த node-க்கான முந்தைய root unmount செய்யப்பட்ட பிறகு, அதே DOM node-க்காக புதிய root உருவாக்கலாம்.

---

## பயன்பாடு {/*usage*/}

### React-இல் முழுமையாக build செய்யப்பட்ட app render செய்தல் {/*rendering-an-app-fully-built-with-react*/}

உங்கள் app React-இல் முழுமையாக build செய்யப்பட்டிருந்தால், முழு app-க்காக ஒரே root உருவாக்கவும்.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

பொதுவாக, startup போது இந்த code-ஐ ஒருமுறை மட்டுமே run செய்ய வேண்டும். இது:

1. உங்கள் HTML-இல் defined ஆன <CodeStep step={1}>browser DOM node</CodeStep>-ஐ கண்டுபிடிக்கும்.
2. உங்கள் app-க்கான <CodeStep step={2}>React component</CodeStep>-ஐ அதன் உள்ளே display செய்யும்.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>என் app</title></head>
  <body>
    <!-- இது DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>வணக்கம், உலகம்!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      நீங்கள் என்னை {count} முறை click செய்தீர்கள்
    </button>
  );
}
```

</Sandpack>

**உங்கள் app React-இல் முழுமையாக build செய்யப்பட்டிருந்தால், மேலும் roots உருவாக்கவோ [`root.render`](#root-render) மீண்டும் call செய்யவோ தேவையில்லை.**

இதிலிருந்து, React உங்கள் முழு app-ன் DOM-ஐ manage செய்யும். மேலும் components சேர்க்க, [அவற்றை `App` component-க்குள் nest செய்யவும்](/learn/importing-and-exporting-components). UI update செய்ய வேண்டியபோது, உங்கள் ஒவ்வொரு component-உம் [state பயன்படுத்தி](/reference/react/useState) இதைச் செய்யலாம். Modal அல்லது tooltip போன்ற extra content-ஐ DOM node-க்கு வெளியே display செய்ய வேண்டியபோது, [portal மூலம் render செய்யவும்](/reference/react-dom/createPortal).

<Note>

உங்கள் HTML காலியாக இருந்தால், app-ன் JavaScript code load ஆகி run ஆகும் வரை user blank page பார்ப்பார்:

```html
<div id="root"></div>
```

இது மிகவும் மெதுவாக உணரப்படலாம்! இதைத் தீர்க்க, உங்கள் components-இலிருந்து initial HTML-ஐ [server-இல் அல்லது build போது](/reference/react-dom/server) generate செய்யலாம். அப்பொழுது JavaScript code load ஆகும்முன் visitors text படிக்க, images பார்க்க, links click செய்ய முடியும். இந்த optimization-ஐ out of the box செய்யும் [framework பயன்படுத்த](/learn/creating-a-react-app#full-stack-frameworks) பரிந்துரைக்கிறோம். அது எப்போது run ஆகிறது என்பதைக் பொறுத்து, இது *server-side rendering (SSR)* அல்லது *static site generation (SSG)* என்று அழைக்கப்படுகிறது.

</Note>

<Pitfall>

**Server rendering அல்லது static generation பயன்படுத்தும் apps `createRoot`-க்கு பதிலாக [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call செய்ய வேண்டும்.** அப்போது React உங்கள் HTML-இலிருந்து DOM nodes-ஐ destroy செய்து re-create செய்வதற்கு பதிலாக *hydrate* (reuse) செய்யும்.

</Pitfall>

---

### React-இல் பகுதியளவு build செய்யப்பட்ட page render செய்தல் {/*rendering-a-page-partially-built-with-react*/}

உங்கள் page [React-இல் முழுமையாக build செய்யப்படவில்லை](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) என்றால், React manage செய்யும் ஒவ்வொரு top-level UI பகுதிக்கும் root உருவாக்க `createRoot`-ஐ பல முறை call செய்யலாம். ஒவ்வொரு root-இலும் [`root.render`](#root-render) call செய்து வேறு content display செய்யலாம்.

இங்கே, `index.html` file-இல் defined ஆன இரண்டு DOM nodes-க்குள் இரண்டு வேறு React components rendered ஆகின்றன:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>என் app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>இந்த paragraph React மூலம் render செய்யப்படவில்லை (verify செய்ய index.html திறக்கவும்).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="வணக்கம்!" author="Sophie" />
      <Comment text="எப்படி இருக்கிறீர்கள்?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

[`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) மூலம் புதிய DOM node ஒன்றை உருவாக்கி, அதை document-க்கு manually add செய்யவும் முடியும்.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // Document-இல் எங்கு வேண்டுமானாலும் சேர்க்கலாம்
```

React tree-ஐ DOM node-இலிருந்து remove செய்து, அது பயன்படுத்திய அனைத்து resources-ஐ clean up செய்ய [`root.unmount`](#root-unmount) call செய்யவும்.

```js
root.unmount();
```

உங்கள் React components வேறு framework-இல் எழுதப்பட்ட app-க்குள் இருந்தால் இது பெரும்பாலும் பயனுள்ளதாக இருக்கும்.

---

### Root component-ஐ update செய்தல் {/*updating-a-root-component*/}

அதே root-இல் `render`-ஐ ஒன்றுக்கு மேல் முறை call செய்யலாம். Component tree structure முன்பு rendered ஆனதுடன் match ஆகும் வரை, React [state-ஐ preserve செய்யும்](/learn/preserving-and-resetting-state). இந்த example-இல் ஒவ்வொரு second-க்கும் repeated `render` calls மூலம் updates வந்தாலும், input-இல் type செய்ய முடிகிறது என்பதை கவனிக்கவும்; அதாவது updates destructive அல்ல:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>வணக்கம், உலகம்! {counter}</h1>
      <input placeholder="இங்கே ஏதாவது type செய்யுங்கள்" />
    </>
  );
}
```

</Sandpack>

`render`-ஐ பல முறை call செய்வது அரிது. பொதுவாக, உங்கள் components அதற்கு பதிலாக [state update செய்யும்](/reference/react/useState).

### Production சூழலில் error logging கையாளுதல் {/*error-logging-in-production*/}

Default ஆக, React அனைத்து errors-ஐ console-க்கு log செய்கிறது. உங்கள் சொந்த error reporting implement செய்ய, optional error handler root options `onUncaughtError`, `onCaughtError` மற்றும் `onRecoverableError` வழங்கலாம்:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

<CodeStep step={1}>onCaughtError</CodeStep> option என்பது இரண்டு arguments உடன் call செய்யப்படும் function:

1. Throw செய்யப்பட்ட <CodeStep step={2}>error</CodeStep>.
2. Error-ன் <CodeStep step={4}>componentStack</CodeStep> கொண்ட <CodeStep step={3}>errorInfo</CodeStep> object.

`onUncaughtError` மற்றும் `onRecoverableError` உடன் சேர்த்து, உங்கள் சொந்த error reporting system implement செய்யலாம்:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // The specific implementation is up to you.
  // `console.error()` is only used for demonstration purposes.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Keep in mind to remove these options in development to leverage
  // React's default handlers or implement your own overlay for development.
  // The handlers are only specfied unconditionally here for demonstration purposes.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>ஏதோ தவறு ஏற்பட்டது.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Uncaught error-ஐ trigger செய்
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Caught error-ஐ trigger செய்
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

</Sandpack>

## Troubleshooting {/*troubleshooting*/}

### நான் root உருவாக்கினேன், ஆனால் எதுவும் display ஆகவில்லை {/*ive-created-a-root-but-nothing-is-displayed*/}

Root-க்குள் உங்கள் app-ஐ உண்மையில் *render* செய்ய மறக்கவில்லை என்பதை உறுதிசெய்யவும்:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

அதைச் செய்யும் வரை, எதுவும் display ஆகாது.

---

### எனக்கு error வருகிறது: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

`createRoot`-க்கான options-ஐ `root.render(...)`-க்கு pass செய்வது பொதுவான தவறு:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

சரிசெய்ய, root options-ஐ `root.render(...)`-க்கு அல்ல, `createRoot(...)`-க்கு pass செய்யவும்:

```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

---

### எனக்கு error வருகிறது: "Target container is not a DOM element" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

இந்த error, நீங்கள் `createRoot`-க்கு pass செய்வது DOM node அல்ல என்பதைக் குறிக்கிறது.

என்ன நடக்கிறது என்பது தெளிவில்லையெனில், அதை log செய்து பாருங்கள்:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

உதாரணமாக, `domNode` `null` என்றால், [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) `null` return செய்தது என்று பொருள். உங்கள் call நேரத்தில் கொடுக்கப்பட்ட ID கொண்ட node document-இல் இல்லாவிட்டால் இது நடக்கும். இதற்கு சில காரணங்கள் இருக்கலாம்:

1. நீங்கள் தேடும் ID, HTML file-இல் பயன்படுத்திய ID-இலிருந்து மாறுபட்டிருக்கலாம். Typos உள்ளதா check செய்யவும்!
2. உங்கள் bundle-ன் `<script>` tag, HTML-இல் அதன் *பிறகு* தோன்றும் DOM nodes எதையும் "see" செய்ய முடியாது.

இந்த error கிடைக்கும் இன்னொரு பொதுவான வழி, `createRoot(domNode)`-க்கு பதிலாக `createRoot(<App />)` எழுதுவது.

---

### எனக்கு error வருகிறது: "Functions are not valid as a React child." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

இந்த error, நீங்கள் `root.render`-க்கு pass செய்வது React component அல்ல என்பதைக் குறிக்கிறது.

`root.render`-ஐ `<Component />`-க்கு பதிலாக `Component` உடன் call செய்தால் இது நடக்கலாம்:

```js {2,5}
// 🚩 Wrong: App is a function, not a Component.
root.render(App);

// ✅ Correct: <App /> is a component.
root.render(<App />);
```

அல்லது function ஒன்றை call செய்த result-க்கு பதிலாக, function-ஐயே `root.render`-க்கு pass செய்தால்:

```js {2,5}
// 🚩 Wrong: createApp is a function, not a component.
root.render(createApp);

// ✅ Correct: call createApp to return a component.
root.render(createApp());
```

---

### என் server-rendered HTML scratch-இலிருந்து மீண்டும் உருவாக்கப்படுகிறது {/*my-server-rendered-html-gets-re-created-from-scratch*/}

உங்கள் app server-rendered ஆக இருந்து, React உருவாக்கிய initial HTML கொண்டிருந்தால், root உருவாக்கி `root.render` call செய்வது அந்த HTML அனைத்தையும் delete செய்து, பின்னர் அனைத்து DOM nodes-ஐ scratch-இலிருந்து re-create செய்வதை கவனிக்கலாம். இது மெதுவாக இருக்கலாம், focus மற்றும் scroll positions reset ஆகலாம், மேலும் பிற user input இழக்கப்படலாம்.

Server-rendered apps `createRoot`-க்கு பதிலாக [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) பயன்படுத்த வேண்டும்:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

அதன் API வேறுபட்டது என்பதை கவனிக்கவும். குறிப்பாக, பொதுவாக மேலும் `root.render` call இருக்காது.
