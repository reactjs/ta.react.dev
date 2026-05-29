---
title: prerenderToNodeStream
---

<Intro>

`prerenderToNodeStream`, [Node.js Stream](https://nodejs.org/api/stream.html) பயன்படுத்தி React tree ஒன்றை static HTML string ஆக render செய்கிறது.

```js
const {prelude, postponed} = await prerenderToNodeStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

இந்த API Node.js-க்கு specific. Deno மற்றும் modern edge runtimes போன்ற [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) கொண்ட environments, இதற்கு பதிலாக [`prerender`](/reference/react-dom/static/prerender) பயன்படுத்த வேண்டும்.

</Note>

---

## Reference {/*reference*/}

### `prerenderToNodeStream(reactNode, options?)` {/*prerender*/}

உங்கள் app-ஐ static HTML ஆக render செய்ய `prerenderToNodeStream` call செய்யவும்.

```js
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

Client-இல், server-generated HTML interactive ஆக [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call செய்யவும்.

[கீழே மேலும் examples பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: HTML-க்கு render செய்ய விரும்பும் React node. உதாரணமாக, `<App />` போன்ற JSX node. இது முழு document-ஐ represent செய்யும் என்று எதிர்பார்க்கப்படுகிறது; எனவே App component `<html>` tag-ஐ render செய்ய வேண்டும்.

* **optional** `options`: Static generation options கொண்ட object.
  * **optional** `bootstrapScriptContent`: குறிப்பிடப்பட்டால், இந்த string inline `<script>` tag-இல் வைக்கப்படும்.
  * **optional** `bootstrapScripts`: Page-இல் emit செய்ய வேண்டிய `<script>` tags-க்கான string URLs array. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call செய்யும் `<script>`-ஐ include செய்ய இதைப் பயன்படுத்தவும். Client-இல் React run செய்ய வேண்டாம் என்றால் இதை omit செய்யவும்.
  * **optional** `bootstrapModules`: `bootstrapScripts` போலவே, ஆனால் [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) emit செய்கிறது.
  * **optional** `identifierPrefix`: [`useId`](/reference/react/useId) generate செய்யும் IDs-க்கு React பயன்படுத்தும் string prefix. ஒரே page-இல் multiple roots பயன்படுத்தும்போது conflicts தவிர்க்க பயனுள்ளது. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)-க்கு pass செய்யப்பட்ட அதே prefix ஆக இருக்க வேண்டும்.
  * **optional** `namespaceURI`: Stream-க்கான root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) கொண்ட string. Default regular HTML. SVG-க்கு `'http://www.w3.org/2000/svg'` அல்லது MathML-க்கு `'http://www.w3.org/1998/Math/MathML'` pass செய்யவும்.
  * **optional** `onError`: [recoverable](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-outside-the-shell) ஆனதோ [அல்லாததோ](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell), server error ஏற்படும் ஒவ்வொரு முறையும் fire ஆகும் callback. Default ஆக, இது `console.error` மட்டுமே call செய்கிறது. [Crash reports log செய்ய](/reference/react-dom/server/renderToPipeableStream#logging-crashes-on-the-server) override செய்தால், இன்னும் `console.error` call செய்வதை உறுதிசெய்யவும். Shell emit ஆகும்முன் [status code adjust செய்யவும்](/reference/react-dom/server/renderToPipeableStream#setting-the-status-code) இதைப் பயன்படுத்தலாம்.
  * **optional** `progressiveChunkSize`: ஒரு chunk-இல் உள்ள bytes எண்ணிக்கை. [Default heuristic பற்றி மேலும் படிக்கவும்.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **optional** `signal`: [Abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal); இது [prerendering abort செய்யவும்](#aborting-prerendering) மீதியை client-இல் render செய்யவும் அனுமதிக்கிறது.

#### Returns {/*returns*/}

`prerenderToNodeStream` ஒரு Promise return செய்கிறது:
- Rendering successful என்றால், Promise பின்வருவன கொண்ட object-க்கு resolve ஆகும்:
  - `prelude`: HTML-ன் [Node.js Stream](https://nodejs.org/api/stream.html). இந்த stream-ஐ chunks-ஆக response அனுப்ப பயன்படுத்தலாம், அல்லது முழு stream-ஐ string ஆக read செய்யலாம்.
  - `postponed`: `prerenderToNodeStream` முடிவடையவில்லை என்றால் [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)-க்கு pass செய்யக்கூடிய JSON-serializeable, opaque object. இல்லையெனில் `null`; அதாவது `prelude` எல்லா content-யையும் கொண்டுள்ளது, resume தேவையில்லை.
- Rendering fail ஆனால், Promise reject செய்யப்படும். [Fallback shell output செய்ய இதைப் பயன்படுத்தவும்.](/reference/react-dom/server/renderToPipeableStream#recovering-from-errors-inside-the-shell)

#### Caveats {/*caveats*/}

Prerendering செய்யும்போது `nonce` option கிடைக்காது. Nonces ஒவ்வொரு request-க்கும் unique ஆக இருக்க வேண்டும்; உங்கள் application-ஐ [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) மூலம் secure செய்ய nonces பயன்படுத்தினால், nonce value-ஐ prerender-இலேயே include செய்வது inappropriate மற்றும் insecure ஆகும்.

<Note>

### நான் `prerenderToNodeStream` எப்போது பயன்படுத்த வேண்டும்? {/*when-to-use-prerender*/}

Static `prerenderToNodeStream` API, static server-side generation (SSG)-க்கு பயன்படுத்தப்படுகிறது. `renderToString`-க்கு மாறாக, `prerenderToNodeStream` resolve ஆகும்முன் எல்லா data load ஆக காத்திருக்கும். Suspense பயன்படுத்தி fetch செய்ய வேண்டிய data உட்பட, full page-க்கான static HTML generate செய்ய இது பொருத்தமானது. Content load ஆகும் போதே stream செய்ய, [renderToReadableStream](/reference/react-dom/server/renderToReadableStream) போன்ற streaming server-side render (SSR) API பயன்படுத்தவும்.

Partial pre-rendering support செய்ய, `prerenderToNodeStream` abort செய்யப்பட்டு பின்னர் `resumeToPipeableStream` மூலம் resumed செய்யப்படலாம்.

</Note>

---

## Usage {/*usage*/}

### React tree-ஐ static HTML stream ஆக render செய்தல் {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

உங்கள் React tree-ஐ static HTML ஆக [Node.js Stream](https://nodejs.org/api/stream.html)-க்குள் render செய்ய `prerenderToNodeStream` call செய்யவும்:

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { prerenderToNodeStream } from 'react-dom/static';

// The route handler syntax depends on your backend framework
app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
  });

  response.setHeader('Content-Type', 'text/plain');
  prelude.pipe(response);
});
```

<CodeStep step={1}>Root component</CodeStep>-உடன், <CodeStep step={2}>bootstrap `<script>` paths</CodeStep> பட்டியலை வழங்க வேண்டும். உங்கள் root component **root `<html>` tag உட்பட முழு document-ஐ** return செய்ய வேண்டும்.

உதாரணமாக, அது இவ்வாறு இருக்கலாம்:

```js [[1, 1, "App"]]
export default function App() {
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

Resulting HTML stream-இல் React [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) மற்றும் உங்கள் <CodeStep step={2}>bootstrap `<script>` tags</CodeStep>-ஐ inject செய்யும்:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... உங்கள் components-இலிருந்து HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

Client-இல், உங்கள் bootstrap script [`hydrateRoot` call மூலம் முழு `document`-ஐ hydrate செய்ய வேண்டும்:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

இது static server-generated HTML-க்கு event listeners attach செய்து interactive ஆக்கும்.

<DeepDive>

#### Build output-இலிருந்து CSS மற்றும் JS asset paths படித்தல் {/*reading-css-and-js-asset-paths-from-the-build-output*/}

Final asset URLs (JavaScript மற்றும் CSS files போன்றவை) build-க்கு பிறகு பெரும்பாலும் hashed ஆக இருக்கும். உதாரணமாக, `styles.css`-க்கு பதிலாக `styles.123456.css` கிடைக்கலாம். Static asset filenames hash செய்வது, அதே asset-ன் ஒவ்வொரு distinct build-க்கும் வேறு filename இருக்கும் என்பதை guarantee செய்கிறது. இது பயனுள்ளதாகும், ஏனெனில் static assets-க்கு long-term caching-ஐ safe ஆக enable செய்ய அனுமதிக்கிறது: குறிப்பிட்ட பெயர் கொண்ட file content எப்போதும் மாறாது.

ஆனால் build-க்கு பிறகே asset URLs தெரிந்தால், அவற்றை source code-இல் வைக்க வழியில்லை. உதாரணமாக, முன்புபோல் JSX-இல் `"/styles.css"` hardcode செய்வது வேலை செய்யாது. அவற்றை உங்கள் source code-இல் இருந்து வெளியே வைத்திருக்க, prop ஆக pass செய்யப்படும் map-இலிருந்து real filenames-ஐ உங்கள் root component படிக்கலாம்:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>என் app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Server-இல், `<App assetMap={assetMap} />` render செய்து asset URLs கொண்ட உங்கள் `assetMap` pass செய்யவும்:

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: [assetMap['/main.js']]
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

உங்கள் server இப்போது `<App assetMap={assetMap} />` render செய்வதால், hydration errors தவிர்க்க client-இலும் `assetMap` உடன் render செய்ய வேண்டும். `assetMap`-ஐ serialize செய்து client-க்கு இவ்வாறு pass செய்யலாம்:

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

மேலுள்ள example-இல், `bootstrapScriptContent` option client-இல் global `window.assetMap` variable set செய்யும் கூடுதல் inline `<script>` tag சேர்க்கிறது. இதனால் client code அதே `assetMap`-ஐ read செய்ய முடியும்:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Client மற்றும் server இரண்டும் அதே `assetMap` prop உடன் `App` render செய்வதால் hydration errors இல்லை.

</DeepDive>

---

### React tree-ஐ static HTML string ஆக render செய்தல் {/*rendering-a-react-tree-to-a-string-of-static-html*/}

உங்கள் app-ஐ static HTML string ஆக render செய்ய `prerenderToNodeStream` call செய்யவும்:

```js
import { prerenderToNodeStream } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  return new Promise((resolve, reject) => {
    let data = '';
    prelude.on('data', chunk => {
      data += chunk;
    });
    prelude.on('end', () => resolve(data));
    prelude.on('error', reject);
  });
}
```

இது உங்கள் React components-ன் initial non-interactive HTML output உருவாக்கும். Client-இல், அந்த server-generated HTML-ஐ *hydrate* செய்து interactive ஆக்க [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call செய்ய வேண்டும்.

---

### எல்லா data load ஆக காத்திருத்தல் {/*waiting-for-all-data-to-load*/}

Static HTML generation முடிந்து resolve ஆகும்முன், `prerenderToNodeStream` எல்லா data load ஆக காத்திருக்கும். உதாரணமாக, cover, friends மற்றும் photos கொண்ட sidebar, posts பட்டியல் ஆகியவற்றைக் காட்டும் profile page ஒன்றைக் கருதுங்கள்:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`<Posts />` சில data load செய்ய வேண்டியுள்ளது; அதற்கு சிறிது நேரம் எடுக்கும் என்று கற்பனை செய்யுங்கள். Ideally, posts முடியும் வரை காத்திருந்து, அது HTML-இல் include ஆக வேண்டும். இதை செய்ய, data மீது suspend செய்ய Suspense பயன்படுத்தலாம்; static HTML-க்கு resolve ஆகும்முன் suspended content முடியும் வரை `prerenderToNodeStream` காத்திருக்கும்.

<Note>

**Suspense-enabled data sources மட்டுமே Suspense component-ஐ activate செய்யும்.** அவற்றில் அடங்குவது:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) மற்றும் [Next.js](https://nextjs.org/docs/getting-started/react-essentials) போன்ற Suspense-enabled frameworks உடன் data fetching
- [`lazy`](/reference/react/lazy) மூலம் component code lazy-loading
- [`use`](/reference/react/use) மூலம் Promise-ன் value-ஐ read செய்தல்

Effect அல்லது event handler உள்ளே data fetch செய்யப்படும்போது Suspense அதை detect செய்யாது.

மேலுள்ள `Posts` component-இல் data எப்படி load செய்வது என்பது உங்கள் framework-ஐப் பொறுத்தது. Suspense-enabled framework பயன்படுத்தினால், அதன் data fetching documentation-இல் விவரங்கள் கிடைக்கும்.

Opinionated framework இல்லாமல் Suspense-enabled data fetching இன்னும் support செய்யப்படவில்லை. Suspense-enabled data source implement செய்வதற்கான requirements unstable மற்றும் undocumented. Data sources-ஐ Suspense உடன் integrate செய்ய official API, React-ன் எதிர்கால version-இல் release செய்யப்படும்.

</Note>

---

### Prerendering abort செய்தல் {/*aborting-prerendering*/}

Timeout-க்கு பிறகு prerender-ஐ "give up" செய்ய force செய்யலாம்:

```js {2-5,11}
async function renderToString() {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort()
  }, 10000);

  try {
    // the prelude will contain all the HTML that was prerendered
    // before the controller aborted.
    const {prelude} = await prerenderToNodeStream(<App />, {
      signal: controller.signal,
    });
    //...
```

Incomplete children கொண்ட எந்த Suspense boundaries-யும் fallback state-இல் prelude-இல் சேர்க்கப்படும்.

இதை [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) அல்லது [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) உடன் சேர்த்து partial prerendering-க்கு பயன்படுத்தலாம்.

## Troubleshooting {/*troubleshooting*/}

### முழு app render ஆகும்வரை என் stream தொடங்கவில்லை {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

`prerenderToNodeStream` response, resolve ஆகும்முன் அனைத்து Suspense boundaries resolve ஆக காத்திருப்பதையும் சேர்த்து முழு app rendering முடியும் வரை காத்திருக்கும். இது முன்கூட்டியே static site generation (SSG)-க்காக வடிவமைக்கப்பட்டுள்ளது; content load ஆகும் போது மேலும் content stream செய்வதை support செய்யாது.

Content load ஆகும் போதே stream செய்ய, [renderToPipeableStream](/reference/react-dom/server/renderToPipeableStream) போன்ற streaming server render API பயன்படுத்தவும்.
