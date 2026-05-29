---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack` development-இல் தற்போதைய Owner Stack-ஐ read செய்து, கிடைத்தால் string ஆக return செய்கிறது.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

தற்போதைய Owner Stack-ஐ பெற `captureOwnerStack`-ஐ call செய்யுங்கள்.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Parameters {/*parameters*/}

`captureOwnerStack` parameters எதையும் ஏற்காது.

#### Returns {/*returns*/}

`captureOwnerStack` `string | null` return செய்கிறது.

Owner Stacks கிடைக்கும் இடங்கள்:
- Component render
- Effects (எ.கா. `useEffect`)
- React-ன் event handlers (எ.கா. `<button onClick={...} />`)
- React error handlers ([React Root options](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError`, மற்றும் `onUncaughtError`)

Owner Stack கிடைக்கவில்லை என்றால், `null` return செய்யப்படும் ([சிக்கல் தீர்வு: Owner Stack `null` ஆக உள்ளது](#the-owner-stack-is-null)-ஐப் பார்க்கவும்).

#### Caveats {/*caveats*/}

- Owner Stacks development-இல் மட்டுமே கிடைக்கும். Development-க்கு வெளியே `captureOwnerStack` எப்போதும் `null` return செய்யும்.

<DeepDive>

#### Owner Stack vs Component Stack {/*owner-stack-vs-component-stack*/}

Owner Stack, [`onUncaughtError`-இல் உள்ள `errorInfo.componentStack`](/reference/react-dom/client/hydrateRoot#error-logging-in-production) போன்ற React error handlers-இல் கிடைக்கும் Component Stack-இலிருந்து வேறுபட்டது.

உதாரணமாக, பின்வரும் code-ஐ எடுத்துக் கொள்ளுங்கள்:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // The stacks are logged instead of showing them in the UI directly to
    // highlight that browsers will apply sourcemaps to the logged stacks.
    // Note that sourcemapping is only applied in the real browser console not
    // in the fake one displayed on this page.
    // Press "fork" to be able to view the sourcemapped stack in a real console.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` ஒரு error throw செய்யும்.
அந்த error-ன் Component Stack:

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

ஆனால் Owner Stack இவ்வளவு மட்டுமே காட்டும்:

```
at Component
```

இந்த Stack-இல் `App` அல்லது DOM components (எ.கா. `fieldset`) Owners ஆக கருதப்படாது; ஏனெனில் `SubComponent` கொண்ட node-ஐ "உருவாக்குவதில்" அவை பங்களிக்கவில்லை. `App` மற்றும் DOM components node-ஐ forward செய்தவை மட்டுமே. `App` `children` node-ஐ render செய்தது மட்டும்; ஆனால் `Component` `<SubComponent />` மூலம் `SubComponent` கொண்ட node-ஐ உருவாக்கியது.

`Navigation` அல்லது `legend` stack-இல் இல்லை; ஏனெனில் அது `<SubComponent />` கொண்ட node-க்கு sibling மட்டுமே.

`SubComponent` ஏற்கனவே callstack-ன் பகுதியாக இருப்பதால் omit செய்யப்படுகிறது.

</DeepDive>

## பயன்பாடு {/*usage*/}

### Custom error overlay-ஐ மேம்படுத்துதல் {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

Error overlay-இல் highlight செய்ய <CodeStep step={1}>`console.error`</CodeStep> calls-ஐ intercept செய்தால், Owner Stack சேர்க்க <CodeStep step={2}>`captureOwnerStack`</CodeStep>-ஐ call செய்யலாம்.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Raw HTML-இல் Error dialog,
  ஏனெனில் React app-இல் error crash ஆகலாம்.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- இது DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Display console.error() message
  errorBody.innerText = consoleMessage;

  // Display owner stack
  errorOwnerStack.innerText = ownerStack;

  // Show the dialog
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Owner Stack `null` ஆக உள்ளது {/*the-owner-stack-is-null*/}

`captureOwnerStack` call React controlled function-க்கு வெளியே நடந்துள்ளது; எ.கா. `setTimeout` callback-இல், `fetch` call-க்கு பிறகு, அல்லது custom DOM event handler-இல். Render, Effects, React event handlers, மற்றும் React error handlers (எ.கா. `hydrateRoot#options.onCaughtError`) நேரத்தில் Owner Stacks கிடைக்க வேண்டும்.

கீழே உள்ள உதாரணத்தில், button click செய்தால் empty Owner Stack log செய்யப்படும்; ஏனெனில் `captureOwnerStack` custom DOM event handler நேரத்தில் call செய்யப்பட்டது. Owner Stack முன்னதாக capture செய்யப்பட வேண்டும்; உதாரணமாக `captureOwnerStack` call-ஐ Effect body-க்குள் நகர்த்தலாம்.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Should call `captureOwnerStack` here.
    function handleEvent() {
      // Calling it in a custom DOM event handler is too late.
      // The Owner Stack will be `null` at this point.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack` கிடைக்கவில்லை {/*captureownerstack-is-not-available*/}

`captureOwnerStack` development builds-இல் மட்டுமே export செய்யப்படும். Production builds-இல் இது `undefined` ஆக இருக்கும். Production மற்றும் development இரண்டிற்கும் bundled ஆகும் files-இல் `captureOwnerStack` பயன்படுத்தப்பட்டால், namespace import-இலிருந்து அதை conditionally access செய்ய வேண்டும்.

```js
// Don't use named imports of `captureOwnerStack` in files that are bundled for development and production.
import {captureOwnerStack} from 'react';
// Use a namespace import instead and access `captureOwnerStack` conditionally.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
