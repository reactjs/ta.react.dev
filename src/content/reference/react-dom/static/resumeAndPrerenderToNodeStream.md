---
title: resumeAndPrerenderToNodeStream
---

<Intro>

`resumeAndPrerenderToNodeStream`, prerender செய்யப்பட்ட React tree ஒன்றை [Node.js Stream](https://nodejs.org/api/stream.html) பயன்படுத்தி static HTML string ஆகத் தொடர்கிறது.

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

இந்த API Node.js-க்கு குறிப்பானது. Deno மற்றும் நவீன edge runtimes போன்ற [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) உள்ள சூழல்கள் இதற்கு பதிலாக [`prerender`](/reference/react-dom/static/prerender)-ஐப் பயன்படுத்த வேண்டும்.

</Note>

---

## Reference {/*reference*/}

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)` {/*resumeandprerendertolnodestream*/}

Prerender செய்யப்பட்ட React tree-ஐ static HTML string ஆகத் தொடர `resumeAndPrerenderToNodeStream`-ஐ அழைக்கவும்.

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

Client-இல், server உருவாக்கிய HTML-ஐ interactive ஆக்க [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐ அழைக்கவும்.

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: நீங்கள் `prerender` (அல்லது முந்தைய `resumeAndPrerenderToNodeStream`) அழைத்த React node. உதாரணமாக, `<App />` போன்ற JSX element. இது முழு document-ஐ பிரதிநிதித்துவப்படுத்தும் என எதிர்பார்க்கப்படுகிறது; எனவே `App` component `<html>` tag-ஐ render செய்ய வேண்டும்.
* `postponedState`: [prerender API](/reference/react-dom/static/index)-இலிருந்து return ஆன opaque `postpone` object; நீங்கள் அதை எங்கு சேமித்திருந்தாலும் அங்கிருந்து load செய்யப்பட்டது (உதா. redis, file, அல்லது S3).
* **optional** `options`: Streaming options கொண்ட object.
  * **optional** `signal`: [Server rendering-ஐ abort](#aborting-server-rendering) செய்து, மீதமுள்ளதை client-இல் render செய்ய அனுமதிக்கும் [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
  * **optional** `onError`: Server error ஏற்படும் போதெல்லாம் fire ஆகும் callback; அது [recoverable](#recovering-from-errors-outside-the-shell) ஆனதா [இல்லையா](#recovering-from-errors-inside-the-shell) என்பதைக் கருத்தில் கொள்ளாது. Default ஆக இது `console.error` மட்டுமே அழைக்கும். [Crash reports log செய்ய](#logging-crashes-on-the-server) இதை override செய்தால், `console.error`-ஐ இன்னும் அழைக்கிறீர்களா என்பதை உறுதிசெய்யுங்கள்.

#### Returns {/*returns*/}

`resumeAndPrerenderToNodeStream` ஒரு Promise-ஐ return செய்கிறது:
- Rendering வெற்றிகரமாக இருந்தால், Promise பின்வற்றைக் கொண்ட object ஆக resolve ஆகும்:
  - `prelude`: HTML-இன் [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). இந்த stream-ஐ response-ஐ chunks ஆக அனுப்பப் பயன்படுத்தலாம், அல்லது முழு stream-ஐ string ஆக வாசிக்கலாம்.
  - `postponed`: `resumeAndPrerenderToNodeStream` abort செய்யப்பட்டால் [`resumeToNodeStream`](/reference/react-dom/server/resume) அல்லது [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)-க்கு pass செய்யக்கூடிய JSON-serializeable, opaque object.
- Rendering தோல்வியடைந்தால், Promise reject செய்யப்படும். [Fallback shell-ஐ output செய்ய இதைப் பயன்படுத்துங்கள்.](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)

#### Caveats {/*caveats*/}

Prerendering செய்யும்போது `nonce` கிடைக்கும் option அல்ல. Nonces ஒவ்வொரு request-க்கும் unique ஆக இருக்க வேண்டும்; [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) மூலம் உங்கள் application-ஐ secure செய்ய nonces பயன்படுத்தினால், nonce value-ஐ prerender-இலேயே சேர்ப்பது பொருத்தமற்றதும் பாதுகாப்பற்றதுமானது.

<Note>

### `resumeAndPrerenderToNodeStream`-ஐ எப்போது பயன்படுத்த வேண்டும்? {/*when-to-use-prerender*/}

Static `resumeAndPrerenderToNodeStream` API static server-side generation (SSG)-க்கு பயன்படுத்தப்படுகிறது. `renderToString` போல இல்லாமல், `resumeAndPrerenderToNodeStream` resolve ஆகும் முன் அனைத்து data load ஆகும் வரை காத்திருக்கும். Suspense பயன்படுத்தி fetch செய்ய வேண்டிய data உட்பட முழு page-க்கான static HTML உருவாக்க இதை ஏற்றதாக ஆக்குகிறது. Content load ஆகும் போதே stream செய்ய, [renderToReadableStream](/reference/react-dom/server/renderToReadableStream) போன்ற streaming server-side render (SSR) API-யைப் பயன்படுத்துங்கள்.

Partial pre-rendering-ஐ ஆதரிக்க `resumeAndPrerenderToNodeStream` abort செய்யப்படலாம்; பின்னர் மற்றொரு `resumeAndPrerenderToNodeStream` மூலம் தொடரலாம் அல்லது `resume` மூலம் resume செய்யலாம்.

</Note>

---

## Usage {/*usage*/}

### மேலும் படிக்க {/*further-reading*/}

`resumeAndPrerenderToNodeStream`, [`prerender`](/reference/react-dom/static/prerender)-க்கு ஒத்ததாக நடக்கிறது; ஆனால் abort செய்யப்பட்ட, முன்பே தொடங்கிய prerendering process-ஐத் தொடர இதைப் பயன்படுத்தலாம்.
Prerender செய்யப்பட்ட tree-ஐ resume செய்வது பற்றிய கூடுதல் தகவல்களுக்கு, [resume documentation](/reference/react-dom/server/resume#resuming-a-prerender)-ஐப் பார்க்கவும்.
