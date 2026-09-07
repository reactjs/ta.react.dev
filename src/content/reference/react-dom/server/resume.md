---
title: resume
---

<Intro>

`resume` pre-render செய்யப்பட்ட React tree-ஐ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)-க்கு stream செய்கிறது.

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

இந்த API [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)-ஐ சார்ந்தது. Node.js-க்கு, அதன் பதிலாக [`resumeToNodeStream`](/reference/react-dom/server/renderToPipeableStream)-ஐப் பயன்படுத்துங்கள்.

</Note>

---

## குறிப்பு {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

Pre-render செய்யப்பட்ட React tree-ஐ HTML ஆக [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)-க்குள் render செய்வதை resume செய்ய `resume`-ஐ call செய்யுங்கள்.

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

<<<<<<< HEAD
* `reactNode`: நீங்கள் `prerender` call செய்த React node. உதாரணமாக `<App />` போன்ற JSX element. இது முழு document-ஐ represent செய்யும் என்று எதிர்பார்க்கப்படுகிறது; எனவே `App` component `<html>` tag-ஐ render செய்ய வேண்டும்.
* `postponedState`: [prerender API](/reference/react-dom/static/index) return செய்த opaque `postpone` object; நீங்கள் எங்கே store செய்திருந்தாலும் அங்கிருந்து load செய்யப்பட்டது (எ.கா. redis, file, அல்லது S3).
* **optional** `options`: Streaming options கொண்ட object.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)-க்கு scripts அனுமதிக்க [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string.
  * **optional** `signal`: [Server rendering-ஐ abort செய்து](#aborting-server-rendering) மீதியை client-இல் render செய்ய அனுமதிக்கும் [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
  * **optional** `onError`: Server error ஏற்படும் போதெல்லாம் fire ஆகும் callback; அது [recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ஆக இருந்தாலும் [இல்லாவிட்டாலும்](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell). Default-ஆக, இது `console.error` மட்டும் call செய்யும். [Crash reports log செய்ய](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) இதை override செய்தால், இன்னும் `console.error` call செய்வதை உறுதிசெய்யுங்கள்.
=======
* `reactNode`: The React node you called `prerender` with. For example, a JSX element like `<App />`. It is expected to represent the entire document, so the `App` component should render the `<html>` tag.
* `postponedState`: The opaque `postpone` object returned from a [prerender API](/reference/react-dom/static/index), loaded from wherever you stored it (e.g. redis, a file, or S3).
* **optional** `options`: An object with streaming options.
  * **optional** `nonce`: A [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string to allow scripts for [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **optional** `signal`: An [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that lets you [abort server rendering](#aborting-server-rendering) and render the rest on the client.
  * <CanaryBadge /> **optional** `onBrowserBailout`: A callback React calls when it recovers from [`browser()`](/reference/react-dom/browser) by leaving a Suspense fallback for the browser to replace. It receives an `Error` describing the browser-only render and an `errorInfo` object containing the `componentStack`. If a reason was passed to `browser`, it is available as `error.cause`. By default, React does nothing. [See how to report browser-only rendering.](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)
  * **optional** `onError`: A callback that fires whenever there is a server error, whether [recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) or [not.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) By default, this only calls `console.error`. If you override it to [log crash reports,](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) make sure that you still call `console.error`.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290


#### Returns {/*returns*/}

`resume` ஒரு Promise-ஐ return செய்கிறது:

- `resume` வெற்றிகரமாக [shell](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell) உருவாக்கினால், அந்த Promise [Writable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)-க்கு pipe செய்யக்கூடிய [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)-க்கு resolve ஆகும்.
- Shell-இல் error ஏற்பட்டால், Promise அந்த error உடன் reject ஆகும்.

Return செய்யப்பட்ட stream-க்கு கூடுதல் property ஒன்று உள்ளது:

* `allReady`: எல்லா rendering-உம் முடிந்ததும் resolve ஆகும் Promise. [Crawlers மற்றும் static generation-க்கு](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) response return செய்வதற்கு முன் `await stream.allReady` செய்யலாம். அப்படிச் செய்தால் progressive loading கிடைக்காது. Stream final HTML-ஐ கொண்டிருக்கும்.

#### Caveats {/*caveats*/}

- `bootstrapScripts`, `bootstrapScriptContent`, அல்லது `bootstrapModules` options-ஐ `resume` ஏற்காது. அதற்கு பதிலாக, `postponedState` உருவாக்கும் `prerender` call-க்கு இந்த options-ஐ pass செய்ய வேண்டும். Bootstrap content-ஐ writable stream-க்குள் manual-ஆக inject செய்யவும் முடியும்.
- Prefix `prerender` மற்றும் `resume` இரண்டிலும் ஒன்றாக இருக்க வேண்டியதால், `resume` `identifierPrefix`-ஐ ஏற்காது.
- `nonce` prerender-க்கு வழங்க முடியாததால், prerender-க்கு scripts வழங்கவில்லை என்றால் மட்டுமே `resume`-க்கு `nonce` வழங்க வேண்டும்.
- முழுமையாக pre-render செய்யப்படாத component கிடைக்கும் வரை root-இலிருந்து `resume` re-render செய்கிறது. முழுமையாக prerender செய்யப்பட்ட Components மட்டும் (Component மற்றும் அதன் children prerendering முடித்தவை) முழுவதுமாக skip செய்யப்படும்.

## பயன்பாடு {/*usage*/}

### Prerender-ஐ resume செய்தல் {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    const partialHTML = decoder.decode(value, {stream: true});
    document.write(partialHTML);
  }

  document.write(decoder.decode());
}

// This doesn't need to be an error.
// You can use any other means to check if an error during prerender was
// from an intentional abort or a real error.
export class Postponed extends Error {}

// We're just hardcoding a session here.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

</Sandpack>

### மேலும் படிக்க {/*further-reading*/}

<<<<<<< HEAD
Resuming `renderToReadableStream` போல செயல்படுகிறது. மேலும் உதாரணங்களுக்கு, [`renderToReadableStream`-ன் usage section](/reference/react-dom/server/renderToReadableStream#usage)-ஐப் பார்க்கவும்.
`prerender`-ஐ குறிப்பாக எப்படி பயன்படுத்துவது என்பதற்கான உதாரணங்கள் [`prerender`-ன் usage section](/reference/react-dom/static/prerender#usage)-இல் உள்ளன.
=======
Resuming behaves like `renderToReadableStream`. For more examples, check out the [usage section of `renderToReadableStream`](/reference/react-dom/server/renderToReadableStream#usage).
The [usage section of `prerender`](/reference/react-dom/static/prerender#usage) includes examples of how to use `prerender` specifically.
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290
