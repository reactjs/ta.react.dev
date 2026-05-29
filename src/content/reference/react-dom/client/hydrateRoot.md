---
title: hydrateRoot
---

<Intro>

முன்பு [`react-dom/server`](/reference/react-dom/server) மூலம் HTML content உருவாக்கப்பட்ட browser DOM node-க்குள் React components-ஐ display செய்ய `hydrateRoot` உதவுகிறது.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Server environment-இல் React ஏற்கனவே render செய்த existing HTML-க்கு React-ஐ "attach" செய்ய `hydrateRoot` call செய்யவும்.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

`domNode`-க்குள் இருக்கும் HTML-க்கு React attach ஆகி, அதன் உள்ளே உள்ள DOM-ஐ manage செய்வதை எடுத்துக்கொள்ளும். React-இல் முழுமையாக build செய்யப்பட்ட app-க்கு, பொதுவாக அதன் root component உடன் ஒரே ஒரு `hydrateRoot` call மட்டுமே இருக்கும்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: Server-இல் root element ஆக rendered செய்யப்பட்ட [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element).

* `reactNode`: Existing HTML-ஐ render செய்ய பயன்படுத்தப்பட்ட "React node". இது பொதுவாக `renderToPipeableStream(<App />)` போன்ற `ReactDOM Server` method மூலம் rendered செய்யப்பட்ட `<App />` போன்ற JSX துண்டாக இருக்கும்.

* **optional** `options`: இந்த React root-க்கான options கொண்ட object.

  * **optional** `onCaughtError`: Error Boundary-இல் React error ஒன்றை catch செய்தபோது call செய்யப்படும் callback. Error Boundary catch செய்த `error` மற்றும் `componentStack` கொண்ட `errorInfo` object உடன் call செய்யப்படும்.
  * **optional** `onUncaughtError`: Error ஒன்று throw செய்யப்பட்டு Error Boundary-யால் catch செய்யப்படாதபோது call செய்யப்படும் callback. Throw செய்யப்பட்ட `error` மற்றும் `componentStack` கொண்ட `errorInfo` object உடன் call செய்யப்படும்.
  * **optional** `onRecoverableError`: Errors-இலிருந்து React தானாக recover செய்யும்போது call செய்யப்படும் callback. React throw செய்யும் `error` மற்றும் `componentStack` கொண்ட `errorInfo` object உடன் call செய்யப்படும். சில recoverable errors, original error cause-ஐ `error.cause` ஆகக் கொண்டிருக்கலாம்.
  * **optional** `identifierPrefix`: [`useId`](/reference/react/useId) உருவாக்கும் IDs-க்கு React பயன்படுத்தும் string prefix. ஒரே page-இல் பல roots பயன்படுத்தும்போது conflicts தவிர்க்க உதவும். Server-இல் பயன்படுத்திய prefix-ஐப் போலவே இதுவும் இருக்க வேண்டும்.


#### Returns {/*returns*/}

`hydrateRoot` இரண்டு methods கொண்ட object ஒன்றை return செய்கிறது: [`render`](#root-render) மற்றும் [`unmount`](#root-unmount).

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `hydrateRoot()` rendered content server-rendered content-க்கு identical ஆக இருக்கும் என்று எதிர்பார்க்கிறது. Mismatches-ஐ bugs ஆகக் கருதி அவற்றை fix செய்ய வேண்டும்.
* Development mode-இல், hydration போது mismatches பற்றி React warn செய்யும். Mismatches இருந்தால் attribute differences patch செய்யப்படும் என்ற guarantee இல்லை. Performance காரணங்களுக்காக இது முக்கியம்; பெரும்பாலான apps-இல் mismatches அரிது, ஆகவே எல்லா markup-யும் validate செய்வது மிகச் செலவானதாக இருக்கும்.
* உங்கள் app-இல் ஒரே ஒரு `hydrateRoot` call மட்டுமே இருக்க வாய்ப்பு அதிகம். Framework பயன்படுத்தினால், அது இந்த call-ஐ உங்களுக்காகச் செய்யலாம்.
* உங்கள் app ஏற்கனவே rendered HTML இல்லாமல் client-rendered ஆக இருந்தால், `hydrateRoot()` பயன்படுத்துவது supported அல்ல. அதற்கு பதிலாக [`createRoot()`](/reference/react-dom/client/createRoot) பயன்படுத்தவும்.

---

### `root.render(reactNode)` {/*root-render*/}

Browser DOM element-க்கான hydrated React root-க்குள் React component ஒன்றை update செய்ய `root.render` call செய்யவும்.

```js
root.render(<App />);
```

Hydrated `root`-இல் React `<App />`-ஐ update செய்யும்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*root-render-parameters*/}

* `reactNode`: நீங்கள் update செய்ய விரும்பும் "React node". இது பொதுவாக `<App />` போன்ற JSX துண்டாக இருக்கும்; ஆனால் [`createElement()`](/reference/react/createElement) கொண்டு உருவாக்கப்பட்ட React element, string, number, `null`, அல்லது `undefined`-யையும் pass செய்யலாம்.


#### Returns {/*root-render-returns*/}

`root.render` `undefined` return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*root-render-caveats*/}

* Root hydration முடிவதற்கு முன் `root.render` call செய்தால், React existing server-rendered HTML content-ஐ clear செய்து முழு root-ஐ client rendering-க்கு மாற்றும்.

---

### `root.unmount()` {/*root-unmount*/}

React root-க்குள் rendered tree ஒன்றை destroy செய்ய `root.unmount` call செய்யவும்.

```js
root.unmount();
```

React-இல் முழுமையாக build செய்யப்பட்ட app-க்கு பொதுவாக `root.unmount` calls எதுவும் இருக்காது.

உங்கள் React root-ன் DOM node (அல்லது அதன் ancestors-இல் ஏதேனும் ஒன்று) வேறு code மூலம் DOM-இலிருந்து அகற்றப்படக்கூடும் என்றால் இது பெரும்பாலும் பயனுள்ளதாக இருக்கும். உதாரணமாக, inactive tabs-ஐ DOM-இலிருந்து அகற்றும் jQuery tab panel ஒன்றை நினைத்துப் பாருங்கள். Tab ஒன்று அகற்றப்பட்டால், அதற்குள் உள்ள அனைத்தும் (அதற்குள் உள்ள React roots உட்பட) DOM-இலிருந்து அகற்றப்படும். அகற்றப்பட்ட root-ன் content-ஐ manage செய்வதை "stop" செய்ய React-க்கு `root.unmount` call செய்து சொல்ல வேண்டும். இல்லையெனில், அகற்றப்பட்ட root-க்குள் உள்ள components subscriptions போன்ற resources-ஐ clean up செய்து free செய்யாது.

`root.unmount` call செய்வது root-இல் உள்ள அனைத்து components-ஐயும் unmount செய்து, tree-இல் உள்ள event handlers அல்லது state ஆகியவற்றை நீக்குவதையும் உட்பட, root DOM node-இலிருந்து React-ஐ "detach" செய்யும்.


#### Parameters {/*root-unmount-parameters*/}

`root.unmount` எந்த parameters-யும் ஏற்காது.


#### Returns {/*root-unmount-returns*/}

`root.unmount` `undefined` return செய்கிறது.

#### கவனிக்க வேண்டியவை {/*root-unmount-caveats*/}

* `root.unmount` call செய்வது tree-இல் உள்ள அனைத்து components-ஐயும் unmount செய்து root DOM node-இலிருந்து React-ஐ "detach" செய்யும்.

* `root.unmount` call செய்த பிறகு அதே root-இல் மீண்டும் `root.render` call செய்ய முடியாது. Unmounted root-இல் `root.render` call செய்ய முயன்றால் "Cannot update an unmounted root" error throw ஆகும்.

---

## பயன்பாடு {/*usage*/}

### Server-rendered HTML-ஐ hydrate செய்தல் {/*hydrating-server-rendered-html*/}

உங்கள் app-ன் HTML [`react-dom/server`](/reference/react-dom/server) மூலம் generate செய்யப்பட்டிருந்தால், client-இல் அதை *hydrate* செய்ய வேண்டும்.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

இது <CodeStep step={1}>browser DOM node</CodeStep>-க்குள் உள்ள server HTML-ஐ உங்கள் app-க்கான <CodeStep step={2}>React component</CodeStep> கொண்டு hydrate செய்யும். பொதுவாக, startup போது இதை ஒருமுறை செய்வீர்கள். Framework பயன்படுத்தினால், அது behind the scenes இதைச் செய்யலாம்.

உங்கள் app-ஐ hydrate செய்ய, React உங்கள் components-ன் logic-ஐ server-இலிருந்து வந்த initial generated HTML-க்கு "attach" செய்கிறது. Hydration, server-இலிருந்து வந்த initial HTML snapshot-ஐ browser-இல் run ஆகும் முழுமையான interactive app ஆக மாற்றுகிறது.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>-க்குள் உள்ள HTML content
  react-dom/server மூலம் App-இலிருந்து generate செய்யப்பட்டது.
-->
<div id="root"><h1>வணக்கம், உலகம்!</h1><button>நீங்கள் என்னை <!-- -->0<!-- --> முறை click செய்தீர்கள்</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
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

`hydrateRoot`-ஐ மீண்டும் call செய்யவோ, அதிக இடங்களில் call செய்யவோ தேவையில்லை. இதிலிருந்து, React உங்கள் application-ன் DOM-ஐ manage செய்யும். UI-ஐ update செய்ய, உங்கள் components [state பயன்படுத்தும்](/reference/react/useState).

<Pitfall>

`hydrateRoot`-க்கு நீங்கள் pass செய்யும் React tree, server-இல் produce செய்தது போலவே **அதே output** produce செய்ய வேண்டும்.

User experience-க்கு இது முக்கியம். உங்கள் JavaScript code load ஆகும்முன், பயனர் server-generated HTML-ஐ சில நேரம் பார்க்கிறார். Server rendering அதன் output-ன் HTML snapshot-ஐ காட்டி app வேகமாக load ஆனது என்ற illusion உருவாக்குகிறது. திடீரென வேறு content காட்டுவது அந்த illusion-ஐ உடைக்கும். அதனால் தான் server render output, client-இல் initial render output-க்கு match ஆக வேண்டும்.

Hydration errors-க்கு வழிவகுக்கும் மிகவும் பொதுவான காரணங்கள்:

* Root node-க்குள் React-generated HTML-ஐச் சுற்றிய extra whitespace (newlines போன்றவை).
* Rendering logic-இல் `typeof window !== 'undefined'` போன்ற checks பயன்படுத்துதல்.
* Rendering logic-இல் [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) போன்ற browser-only APIs பயன்படுத்துதல்.
* Server மற்றும் client-இல் வேறு data render செய்தல்.

சில hydration errors-இலிருந்து React recover செய்யும்; ஆனால் **மற்ற bugs போலவே அவற்றையும் நீங்கள் fix செய்ய வேண்டும்.** சிறந்த case-இல் அவை slowdown-க்கு வழிவகுக்கும்; மோசமான case-இல் event handlers தவறான elements-க்கு attach ஆகலாம்.

</Pitfall>

---

### முழு document-ஐ hydrate செய்தல் {/*hydrating-an-entire-document*/}

React-இல் முழுமையாக build செய்யப்பட்ட apps, [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) tag உட்பட முழு document-ஐ JSX ஆக render செய்யலாம்:

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>என் app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

முழு document-ஐ hydrate செய்ய, `hydrateRoot`-க்கு முதல் argument ஆக [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) global-ஐ pass செய்யவும்:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### தவிர்க்க முடியாத hydration mismatch errors-ஐ suppress செய்தல் {/*suppressing-unavoidable-hydration-mismatch-errors*/}

ஒரு element-ன் attribute அல்லது text content server மற்றும் client இடையே தவிர்க்க முடியாத வகையில் வேறுபட்டிருந்தால் (உதாரணமாக, timestamp), hydration mismatch warning-ஐ அமைதிப்படுத்தலாம்.

Element ஒன்றில் hydration warnings-ஐ அமைதிப்படுத்த, `suppressHydrationWarning={true}` சேர்க்கவும்:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>-க்குள் உள்ள HTML content
  react-dom/server மூலம் App-இலிருந்து generate செய்யப்பட்டது.
-->
<div id="root"><h1>தற்போதைய தேதி: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      தற்போதைய தேதி: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

இது ஒரு level deep மட்டுமே வேலை செய்யும்; escape hatch ஆகவே intended. இதை அதிகமாகப் பயன்படுத்த வேண்டாம். Mismatched text content-ஐ patch செய்ய React **முயற்சிக்காது**.

---

### Client மற்றும் server content வேறுபட்டதை கையாளுதல் {/*handling-different-client-and-server-content*/}

Server மற்றும் client-இல் திட்டமிட்டே வேறு ஒன்றை render செய்ய வேண்டுமானால், two-pass rendering செய்யலாம். Client-இல் வேறு ஒன்றை render செய்யும் components, `isClient` போன்ற [state variable](/reference/react/useState)-ஐப் படிக்கலாம்; அதை [Effect](/reference/react/useEffect)-இல் `true` ஆக set செய்யலாம்:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>-க்குள் உள்ள HTML content
  react-dom/server மூலம் App-இலிருந்து generate செய்யப்பட்டது.
-->
<div id="root"><h1>Server ஆக உள்ளது</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

{/* kind of an edge case, seems fine to use this hack here */}
```js {expectedErrors: {'react-compiler': [7]}} src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Client ஆக உள்ளது' : 'Server ஆக உள்ளது'}
    </h1>
  );
}
```

</Sandpack>

இந்த வழியில் initial render pass, server போலவே அதே content render செய்து mismatches தவிர்க்கும்; ஆனால் hydration முடிந்த உடனே synchronously கூடுதல் pass நடக்கும்.

<Pitfall>

இந்த அணுகுமுறை hydration-ஐ மெதுவாக்கும்; ஏனெனில் உங்கள் components இரண்டு முறை render செய்ய வேண்டும். Slow connections-இல் user experience-ஐ கவனத்தில் கொள்ளுங்கள். JavaScript code initial HTML render-ஐ விட குறிப்பிடத்தக்க வகையில் தாமதமாக load ஆகலாம்; ஆகவே hydration-க்கு உடனே வேறு UI render செய்வதும் user-க்கு திடீரென மாறுவது போல உணரப்படலாம்.

</Pitfall>

---

### Hydrated root component-ஐ update செய்தல் {/*updating-a-hydrated-root-component*/}

Root hydration முடிந்த பிறகு, root React component-ஐ update செய்ய [`root.render`](#root-render) call செய்யலாம். **[`createRoot`](/reference/react-dom/client/createRoot)-க்கு மாறாக, initial content ஏற்கனவே HTML ஆக render செய்யப்பட்டிருப்பதால் இதை பொதுவாக செய்யத் தேவையில்லை.**

Hydration-க்கு பிறகு ஏதாவது நேரத்தில் `root.render` call செய்து, component tree structure முன்பு rendered ஆனதுடன் match ஆனால், React [state-ஐ preserve செய்யும்](/learn/preserving-and-resetting-state). இந்த example-இல் ஒவ்வொரு second-க்கும் repeated `render` calls மூலம் updates வந்தாலும், input-இல் type செய்ய முடிகிறது என்பதை கவனிக்கவும்; அதாவது updates destructive அல்ல:

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>-க்குள் உள்ள அனைத்து HTML content-ம்
  react-dom/server கொண்டு <App /> render செய்வதன் மூலம் generate செய்யப்பட்டது.
-->
<div id="root"><h1>வணக்கம், உலகம்! <!-- -->0</h1><input placeholder="இங்கே ஏதாவது type செய்யுங்கள்"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

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

Hydrated root-இல் [`root.render`](#root-render) call செய்வது அரிது. பொதுவாக, அதற்கு பதிலாக components-இல் ஒன்றுக்குள் [state update செய்வீர்கள்](/reference/react/useState).

### Production சூழலில் error logging கையாளுதல் {/*error-logging-in-production*/}

Default ஆக, React அனைத்து errors-ஐ console-க்கு log செய்கிறது. உங்கள் சொந்த error reporting implement செய்ய, optional error handler root options `onUncaughtError`, `onCaughtError` மற்றும் `onRecoverableError` வழங்கலாம்:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
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
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Keep in mind to remove these options in development to leverage
  // React's default handlers or implement your own overlay for development.
  // The handlers are only specfied unconditionally here for demonstration purposes.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
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

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>என் app</title>
</head>
<body>
<!--
  Recoverable errors trigger செய்ய, server-rendered content-இலிருந்து வேறுபடும் HTML content-ஐ திட்டமிட்டு பயன்படுத்துகிறோம்.
-->
<div id="root">Hydration-க்கு முன் server content.</div>
</body>
</html>
```
</Sandpack>

## Troubleshooting {/*troubleshooting*/}


### எனக்கு error வருகிறது: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

`hydrateRoot`-க்கான options-ஐ `root.render(...)`-க்கு pass செய்வது பொதுவான தவறு:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

சரிசெய்ய, root options-ஐ `root.render(...)`-க்கு அல்ல, `hydrateRoot(...)`-க்கு pass செய்யவும்:

```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
