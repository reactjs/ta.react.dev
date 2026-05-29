---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` ஒரு React tree-ஐ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) ஆக render செய்கிறது.

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

இந்த API [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)-ஐச் சார்ந்தது. Node.js-க்கு இதற்குப் பதிலாக [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)-ஐ பயன்படுத்துங்கள்.

</Note>

---

## Reference {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

உங்கள் React tree-ஐ HTML ஆக [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)-க்குள் render செய்ய `renderToReadableStream`-ஐ call செய்யுங்கள்.

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Client-இல், server உருவாக்கிய HTML-ஐ interactive ஆக்க [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐ call செய்யுங்கள்.

[மேலும் எடுத்துக்காட்டுகளை கீழே பாருங்கள்.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: HTML ஆக render செய்ய விரும்பும் React node. உதாரணமாக, `<App />` போன்ற JSX element. இது முழு document-ஐ represent செய்யும் என்று எதிர்பார்க்கப்படுகிறது, எனவே `App` component `<html>` tag-ஐ render செய்ய வேண்டும்.

* **optional** `options`: Streaming options கொண்ட object.
  * **optional** `bootstrapScriptContent`: குறிப்பிடப்பட்டால், இந்த string inline `<script>` tag-இல் வைக்கப்படும்.
  * **optional** `bootstrapScripts`: Page-இல் emit செய்ய வேண்டிய `<script>` tags-க்கான string URLs-ன் array. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐ call செய்யும் `<script>`-ஐ சேர்க்க இதைப் பயன்படுத்துங்கள். Client-இல் React-ஐ முற்றிலும் run செய்ய வேண்டாம் என்றால் இதை விடுங்கள்.
  * **optional** `bootstrapModules`: `bootstrapScripts` போலவே, ஆனால் [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)-ஐ emit செய்கிறது.
  * **optional** `identifierPrefix`: [`useId`](/reference/react/useId) உருவாக்கும் IDs-க்காக React பயன்படுத்தும் string prefix. ஒரே page-இல் பல roots பயன்படுத்தும்போது conflicts தவிர்க்க இது பயனுள்ளது. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)-க்கு pass செய்த அதே prefix ஆக இருக்க வேண்டும்.
  * **optional** `namespaceURI`: Stream-க்கான root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) கொண்ட string. Default regular HTML ஆகும். SVG-க்கு `'http://www.w3.org/2000/svg'` அல்லது MathML-க்கு `'http://www.w3.org/1998/Math/MathML'` pass செய்யுங்கள்.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)-க்காக scripts-ஐ அனுமதிக்கும் [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string.
  * **optional** `onError`: [Recoverable](#recovering-from-errors-outside-the-shell) ஆக இருந்தாலும் [இல்லாவிட்டாலும்](#recovering-from-errors-inside-the-shell) server error ஏற்படும் ஒவ்வொரு முறையும் fire ஆகும் callback. Default ஆக இது `console.error`-ஐ மட்டும் call செய்கிறது. [Crash reports log செய்ய](#logging-crashes-on-the-server) அதை override செய்தால், இன்னும் `console.error`-ஐ call செய்கிறீர்கள் என்பதை உறுதி செய்யுங்கள். Shell emit ஆகும் முன் [status code-ஐ சரிசெய்ய](#setting-the-status-code) இதைப் பயன்படுத்தலாம்.
  * **optional** `progressiveChunkSize`: ஒரு chunk-இல் உள்ள bytes எண்ணிக்கை. [Default heuristic பற்றி மேலும் படிக்கவும்.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  * **optional** `signal`: [Server rendering-ஐ abort](#aborting-server-rendering) செய்து மீதமுள்ளதை client-இல் render செய்ய அனுமதிக்கும் [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).


#### Returns {/*returns*/}

`renderToReadableStream` ஒரு Promise-ஐத் திருப்பித் தருகிறது:

- [Shell](#specifying-what-goes-into-the-shell)-ஐ render செய்வது வெற்றியடைந்தால், அந்த Promise [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)-ஆக resolve ஆகும்.
- Shell render செய்வது தோல்வியடைந்தால், Promise reject செய்யப்படும். [Fallback shell output செய்ய இதைப் பயன்படுத்துங்கள்.](#recovering-from-errors-inside-the-shell)

திரும்ப வரும் stream-க்கு கூடுதல் property ஒன்று உள்ளது:

* `allReady`: [Shell](#specifying-what-goes-into-the-shell) மற்றும் கூடுதல் [content](#streaming-more-content-as-it-loads) அனைத்தும் உட்பட rendering முழுவதும் முடிந்தபோது resolve ஆகும் Promise. [Crawlers மற்றும் static generation](#waiting-for-all-content-to-load-for-crawlers-and-static-generation)-க்காக response return செய்வதற்கு முன் `await stream.allReady` செய்யலாம். அப்படிச் செய்தால் progressive loading கிடைக்காது. Stream இறுதி HTML-ஐ கொண்டிருக்கும்.

---

## Usage {/*usage*/}

### React tree-ஐ HTML ஆக Readable Web Stream-க்கு render செய்தல் {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

உங்கள் React tree-ஐ HTML ஆக [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)-க்குள் render செய்ய `renderToReadableStream`-ஐ call செய்யுங்கள்:

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

<CodeStep step={1}>Root component</CodeStep>-உடன், <CodeStep step={2}>bootstrap `<script>` paths</CodeStep>-ன் list-ஐ வழங்க வேண்டும். உங்கள் root component **root `<html>` tag உட்பட முழு document-ஐ** return செய்ய வேண்டும்.

உதாரணமாக, அது இதுபோல் இருக்கலாம்:

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

Resulting HTML stream-க்குள் React [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) மற்றும் உங்கள் <CodeStep step={2}>bootstrap `<script>` tags</CodeStep>-ஐ inject செய்யும்:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... உங்கள் components-இலிருந்து வரும் HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

Client-இல், உங்கள் bootstrap script [`hydrateRoot` call மூலம் முழு `document`-ஐ hydrate செய்ய வேண்டும்:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

இது server உருவாக்கிய HTML-க்கு event listeners-ஐ attach செய்து அதை interactive ஆக்கும்.

<DeepDive>

#### Build output-இலிருந்து CSS மற்றும் JS asset paths-ஐ வாசித்தல் {/*reading-css-and-js-asset-paths-from-the-build-output*/}

இறுதி asset URLs (JavaScript மற்றும் CSS files போன்றவை) build-க்கு பிறகு அடிக்கடி hashed ஆக இருக்கும். உதாரணமாக, `styles.css` என்பதற்குப் பதிலாக `styles.123456.css` கிடைக்கலாம். Static asset filenames-ஐ hash செய்வது, அதே asset-ன் ஒவ்வொரு வேறுபட்ட build-க்கும் வேறுபட்ட filename இருப்பதை உறுதி செய்கிறது. இது பயனுள்ளதாகும், ஏனெனில் static assets-க்கு long-term caching-ஐ பாதுகாப்பாக enable செய்ய அனுமதிக்கிறது: ஒரு குறிப்பிட்ட பெயர் கொண்ட file-ன் content ஒருபோதும் மாறாது.

ஆனால் build முடிந்த பிறகே asset URLs தெரிந்தால், அவற்றை source code-இல் வைக்க வழியில்லை. உதாரணமாக, முன்பு போல JSX-இல் `"/styles.css"`-ஐ hardcode செய்வது வேலை செய்யாது. அவற்றை source code-இலிருந்து வெளியே வைத்திருக்க, prop ஆக pass செய்யப்பட்ட map-இலிருந்து root component உண்மையான filenames-ஐ read செய்யலாம்:

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

Server-இல், `<App assetMap={assetMap} />`-ஐ render செய்து, asset URLs கொண்ட உங்கள் `assetMap`-ஐ pass செய்யுங்கள்:

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

உங்கள் server இப்போது `<App assetMap={assetMap} />`-ஐ render செய்கிறது என்பதால், hydration errors தவிர்க்க client-இலும் அதே `assetMap` உடன் render செய்ய வேண்டும். `assetMap`-ஐ serialize செய்து client-க்கு இதுபோல் pass செய்யலாம்:

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

மேலுள்ள எடுத்துக்காட்டில், `bootstrapScriptContent` option கூடுதல் inline `<script>` tag ஒன்றைச் சேர்த்து, client-இல் global `window.assetMap` variable-ஐ set செய்கிறது. இதனால் client code அதே `assetMap`-ஐ read செய்ய முடியும்:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Client மற்றும் server இரண்டும் ஒரே `assetMap` prop உடன் `App`-ஐ render செய்கின்றன, எனவே hydration errors இல்லை.

</DeepDive>

---

### Content load ஆகும்போது கூடுதல் content-ஐ stream செய்தல் {/*streaming-more-content-as-it-loads*/}

Server-இல் data அனைத்தும் load ஆகும் முன்பே user content-ஐப் பார்க்கத் தொடங்க streaming அனுமதிக்கிறது. உதாரணமாக, cover, friends மற்றும் photos கொண்ட sidebar, மேலும் posts list காட்டும் profile page ஒன்றைக் கவனியுங்கள்:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />`-க்கான data load ஆக சில நேரம் எடுக்கிறது என்று கற்பனை செய்யுங்கள். Posts-க்கு காத்திருக்காமல் profile page content-ன் மீதியை user-க்கு காட்ட விரும்புவீர்கள். இதைச் செய்ய, [`Posts`-ஐ `<Suspense>` boundary-க்குள் wrap செய்யுங்கள்:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
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

`Posts` அதன் data-வை load செய்யும் முன்பே HTML-ஐ stream செய்ய தொடங்க React-க்கு இது சொல்கிறது. React முதலில் loading fallback (`PostsGlimmer`)-க்கான HTML-ஐ அனுப்பும்; பின்னர் `Posts` அதன் data-வை load செய்து முடித்ததும், அந்த loading fallback-ஐ அந்த HTML-ஆல் மாற்றும் inline `<script>` tag உடன் மீதமுள்ள HTML-ஐ React அனுப்பும். User-ன் பார்வையில், page முதலில் `PostsGlimmer` உடன் தோன்றி, பின்னர் `Posts`-ஆல் மாற்றப்படும்.

மேலும் granular loading sequence உருவாக்க [`<Suspense>` boundaries-ஐ nest](/reference/react/Suspense#revealing-nested-content-as-it-loads) செய்யலாம்:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```


இந்த எடுத்துக்காட்டில், React page-ஐ இன்னும் முன்னதாக stream செய்ய தொடங்க முடியும். `ProfileLayout` மற்றும் `ProfileCover` மட்டும் முதலில் render முடிக்க வேண்டும், ஏனெனில் அவை எந்த `<Suspense>` boundary-யிலும் wrap செய்யப்படவில்லை. ஆனால் `Sidebar`, `Friends`, அல்லது `Photos` data load செய்ய வேண்டியிருந்தால், React அதற்கு பதிலாக `BigSpinner` fallback-க்கான HTML-ஐ அனுப்பும். பின்னர், கூடுதல் data கிடைக்கும்போது, அனைத்தும் visible ஆகும் வரை மேலும் content தொடர்ந்து reveal ஆகும்.

Streaming, browser-இல் React தானாக load ஆக காத்திருக்க வேண்டியதில்லை; உங்கள் app interactive ஆகும் வரை காத்திருக்கவும் வேண்டியதில்லை. Server-இலிருந்து வரும் HTML content எந்த `<script>` tags load ஆகும் முன்பே progressively reveal ஆகும்.

[Streaming HTML எப்படி வேலை செய்கிறது என்பதை மேலும் படிக்கவும்.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Suspense-enabled data sources மட்டுமே Suspense component-ஐ activate செய்யும்.** அவற்றில் அடங்குபவை:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) மற்றும் [Next.js](https://nextjs.org/docs/getting-started/react-essentials) போன்ற Suspense-enabled frameworks மூலம் data fetching
- [`lazy`](/reference/react/lazy) மூலம் component code-ஐ lazy-load செய்தல்
- [`use`](/reference/react/use) மூலம் Promise-ன் value-ஐ வாசித்தல்

Effect அல்லது event handler-க்குள் data fetch செய்யப்படும் போது Suspense அதை detect செய்யாது.

மேலுள்ள `Posts` component-இல் data-வை load செய்யும் சரியான முறை உங்கள் framework-ஐப் பொறுத்தது. நீங்கள் Suspense-enabled framework பயன்படுத்தினால், அதன் data fetching documentation-இல் விவரங்களை காண்பீர்கள்.

Opinionated framework இல்லாமல் Suspense-enabled data fetching இன்னும் support செய்யப்படவில்லை. Suspense-enabled data source-ஐ implement செய்ய வேண்டிய requirements unstable மற்றும் undocumented ஆக உள்ளன. Data sources-ஐ Suspense-உடன் integrate செய்யும் official API, React-ன் எதிர்கால version ஒன்றில் release செய்யப்படும்.

</Note>

---

### Shell-இல் என்ன சேர வேண்டும் என்பதை குறிப்பிடுதல் {/*specifying-what-goes-into-the-shell*/}

எந்த `<Suspense>` boundaries-க்கும் வெளியே இருக்கும் உங்கள் app-ன் பகுதி *shell* என அழைக்கப்படுகிறது:

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

User காணக்கூடிய earliest loading state-ஐ அது தீர்மானிக்கிறது:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Root-இல் முழு app-ஐ `<Suspense>` boundary-க்குள் wrap செய்தால், shell அந்த spinner-ஐ மட்டும் கொண்டிருக்கும். ஆனால் அது இனிமையான user experience அல்ல, ஏனெனில் screen-இல் பெரிய spinner ஒன்றைக் காண்பது, இன்னும் சிறிது காத்திருந்து உண்மையான layout-ஐப் பார்ப்பதைவிட மெதுவாகவும் எரிச்சலாகவும் உணரப்படலாம். அதனால்தான் பொதுவாக shell *minimal but complete* ஆக உணரப்படும் வகையில்--முழு page layout-ன் skeleton போல--`<Suspense>` boundaries-ஐ அமைக்க விரும்புவீர்கள்.

`renderToReadableStream`-க்கு உள்ள async call, முழு shell render ஆனவுடன் `stream` ஆக resolve ஆகும். வழக்கமாக, அந்த `stream` உடன் response உருவாக்கி return செய்வதன் மூலம் அப்போது streaming தொடங்குவீர்கள்:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

`stream` return ஆகும் நேரத்தில், nested `<Suspense>` boundaries-இல் உள்ள components இன்னும் data load செய்து கொண்டிருக்கலாம்.

---

### Server-இல் crashes-ஐ log செய்தல் {/*logging-crashes-on-the-server*/}

Default ஆக, server-இல் உள்ள அனைத்து errors console-க்கு log செய்யப்படும். Crash reports log செய்ய இந்த behavior-ஐ override செய்யலாம்:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Custom `onError` implementation வழங்கினால், மேலே போல errors-ஐ console-க்கும் log செய்ய மறக்காதீர்கள்.

---

### Shell-க்குள் errors-இலிருந்து recover செய்தல் {/*recovering-from-errors-inside-the-shell*/}

இந்த எடுத்துக்காட்டில், shell `ProfileLayout`, `ProfileCover`, மற்றும் `PostsGlimmer`-ஐ கொண்டுள்ளது:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

அந்த components render ஆகும்போது error ஏற்பட்டால், client-க்கு அனுப்ப React-க்கு meaningful HTML எதுவும் இருக்காது. கடைசி முயற்சியாக server rendering-ஐ சாராத fallback HTML அனுப்ப, உங்கள் `renderToReadableStream` call-ஐ `try...catch`-க்குள் wrap செய்யுங்கள்:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>ஏதோ தவறு ஏற்பட்டது</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Shell உருவாக்கும்போது error இருந்தால், `onError` மற்றும் உங்கள் `catch` block இரண்டும் fire ஆகும். Error reporting-க்கு `onError`-ஐப் பயன்படுத்துங்கள்; fallback HTML document அனுப்ப `catch` block-ஐப் பயன்படுத்துங்கள். உங்கள் fallback HTML அவசியமாக error page ஆக இருக்க வேண்டியதில்லை. அதற்கு பதிலாக, client-இல் மட்டும் உங்கள் app-ஐ render செய்யும் alternative shell-ஐ சேர்க்கலாம்.

---

### Shell-க்கு வெளியே errors-இலிருந்து recover செய்தல் {/*recovering-from-errors-outside-the-shell*/}

இந்த எடுத்துக்காட்டில், `<Posts />` component `<Suspense>`-க்குள் wrap செய்யப்பட்டுள்ளது, எனவே அது shell-ன் பகுதி *அல்ல*:

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` component-இல் அல்லது அதற்குள் எங்காவது error ஏற்பட்டால், React [அதிலிருந்து recover செய்ய முயலும்:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)

1. அது அருகிலுள்ள `<Suspense>` boundary (`PostsGlimmer`)-க்கான loading fallback-ஐ HTML-க்குள் emit செய்யும்.
2. Server-இல் `Posts` content-ஐ render செய்ய முயல்வதை அது "give up" செய்யும்.
3. Client-இல் JavaScript code load ஆனபோது, React client-இல் `Posts`-ஐ render செய்ய *retry* செய்யும்.

Client-இல் `Posts`-ஐ render செய்வதை retry செய்ததும் *மீண்டும்* தோல்வியடைந்தால், React client-இல் error-ஐ throw செய்யும். Rendering போது throw செய்யப்படும் அனைத்து errors போலவே, [அருகிலுள்ள parent error boundary](/reference/react/Component#static-getderivedstatefromerror) user-க்கு error எப்படிக் காட்டப்பட வேண்டும் என்பதை தீர்மானிக்கும். நடைமுறையில், error recover செய்ய முடியாதது உறுதியாகும் வரை user loading indicator-ஐப் பார்ப்பார் என்பதே இதன் பொருள்.

Client-இல் `Posts` render செய்வதை retry செய்தது வெற்றியடைந்தால், server-இலிருந்து வந்த loading fallback client rendering output-ஆல் மாற்றப்படும். Server error இருந்தது user-க்கு தெரியாது. ஆனால் server `onError` callback மற்றும் client [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) callbacks fire ஆகும்; இதனால் error பற்றி நீங்கள் notified ஆக முடியும்.

---

### Status code-ஐ set செய்தல் {/*setting-the-status-code*/}

Streaming ஒரு tradeoff-ஐ அறிமுகப்படுத்துகிறது. User content-ஐ விரைவாகப் பார்க்க, page-ஐ மிக விரைவாக stream செய்ய விரும்புகிறீர்கள். ஆனால் streaming தொடங்கிய பிறகு, response status code-ஐ இனி set செய்ய முடியாது.

உங்கள் app-ஐ shell (அனைத்து `<Suspense>` boundaries-க்கும் மேலே) மற்றும் மீதமுள்ள content ஆக [பிரிப்பதன் மூலம்](#specifying-what-goes-into-the-shell), இந்த பிரச்சினையின் ஒரு பகுதியை நீங்கள் ஏற்கனவே தீர்த்துவிட்டீர்கள். Shell error செய்தால், error status code-ஐ set செய்ய அனுமதிக்கும் உங்கள் `catch` block run ஆகும். இல்லையெனில், app client-இல் recover ஆகக்கூடும் என்பதை நீங்கள் அறிந்திருப்பதால், "OK" அனுப்பலாம்.

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>ஏதோ தவறு ஏற்பட்டது</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Shell-க்கு *வெளியே* உள்ள component (அதாவது `<Suspense>` boundary-க்குள்) error throw செய்தால், React rendering-ஐ நிறுத்தாது. இதன் பொருள் `onError` callback fire ஆகும், ஆனால் உங்கள் code `catch` block-க்குள் செல்லாமல் தொடர்ந்து run ஆகும். ஏனெனில் React அந்த error-இலிருந்து client-இல் recover செய்ய முயலும், [மேலே விவரித்தபடி](#recovering-from-errors-outside-the-shell).

ஆனால், விரும்பினால், ஏதோ ஒன்று errored ஆனது என்ற தகவலைப் பயன்படுத்தி status code-ஐ set செய்யலாம்:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>ஏதோ தவறு ஏற்பட்டது</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Initial shell content உருவாக்கும்போது ஏற்பட்ட shell-க்கு வெளியேயுள்ள errors-ஐ மட்டுமே இது catch செய்யும், எனவே இது exhaustive அல்ல. ஏதாவது content-க்கு error ஏற்பட்டதா என்பதைத் தெரிந்துகொள்வது critical என்றால், அதை shell-க்குள் மேலே நகர்த்தலாம்.

---

### வேறு errors-ஐ வேறு வழிகளில் handle செய்தல் {/*handling-different-errors-in-different-ways*/}

நீங்கள் [உங்கள் சொந்த `Error` subclasses-ஐ உருவாக்கலாம்](https://javascript.info/custom-errors) மற்றும் எந்த error throw செய்யப்பட்டது என்பதைச் சரிபார்க்க [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator-ஐப் பயன்படுத்தலாம். உதாரணமாக, custom `NotFoundError` ஒன்றை define செய்து உங்கள் component-இலிருந்து அதை throw செய்யலாம். பின்னர் `onError`-இல் error-ஐ save செய்து, response return செய்வதற்கு முன் error type-ஐப் பொறுத்து வேறு செயலைச் செய்யலாம்:

```js {2-3,5-15,22,28,33}
async function handler(request) {
  let didError = false;
  let caughtError = null;

  function getStatusCode() {
    if (didError) {
      if (caughtError instanceof NotFoundError) {
        return 404;
      } else {
        return 500;
      }
    } else {
      return 200;
    }
  }

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>ஏதோ தவறு ஏற்பட்டது</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Shell-ஐ emit செய்து streaming தொடங்கியதும், status code-ஐ மாற்ற முடியாது என்பதை நினைவில் கொள்ளுங்கள்.

---

### Crawlers மற்றும் static generation-க்காக content அனைத்தும் load ஆக காத்திருத்தல் {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

Content கிடைக்கும் போதே user அதை காண முடிவதால் streaming சிறந்த user experience-ஐ வழங்குகிறது.

ஆனால் crawler உங்கள் page-ஐ visit செய்யும்போது, அல்லது build time-இல் pages உருவாக்கும் போது, content-ஐ progressively reveal செய்வதற்கு பதிலாக, content அனைத்தும் முதலில் load ஆக அனுமதித்து பின்னர் இறுதி HTML output-ஐ உருவாக்க விரும்பலாம்.

`stream.allReady` Promise-ஐ await செய்வதன் மூலம் content அனைத்தும் load ஆக காத்திருக்கலாம்:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... உங்கள் bot detection strategy-ஐப் பொறுத்தது ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>ஏதோ தவறு ஏற்பட்டது</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Regular visitor progressively loaded content-ன் stream-ஐ பெறுவார். Crawler, data அனைத்தும் load ஆன பிறகு இறுதி HTML output-ஐப் பெறும். ஆனால் இதனால் crawler *அனைத்து* data-க்கும் காத்திருக்க வேண்டும்; அவற்றில் சில load ஆக மெதுவாகவோ error ஆகவோ இருக்கலாம். உங்கள் app-ஐப் பொறுத்து, crawlers-க்கும் shell-ஐ அனுப்ப தேர்வு செய்யலாம்.

---

### Server rendering-ஐ abort செய்தல் {/*aborting-server-rendering*/}

Timeout-க்கு பிறகு server rendering-ஐ "give up" செய்ய கட்டாயப்படுத்தலாம்:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React மீதமுள்ள loading fallbacks-ஐ HTML ஆக flush செய்து, மீதியை client-இல் render செய்ய முயலும்.
