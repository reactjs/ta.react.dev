---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream`, pre-render செய்யப்பட்ட React tree ஒன்றை pipe செய்யக்கூடிய [Node.js Stream](https://nodejs.org/api/stream.html)-க்கு stream செய்கிறது.

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

இந்த API Node.js-க்கு குறிப்பானது. Deno மற்றும் நவீன edge runtimes போன்ற [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) உள்ள சூழல்கள் இதற்கு பதிலாக [`resume`](/reference/react-dom/server/renderToReadableStream)-ஐப் பயன்படுத்த வேண்டும்.

</Note>

---

## Reference {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

Pre-render செய்யப்பட்ட React tree-ஐ HTML ஆக [Node.js Stream](https://nodejs.org/api/stream.html#writable-streams)-க்குள் render செய்வதைத் தொடர `resumeToPipeableStream`-ஐ அழைக்கவும்.

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: நீங்கள் `prerender` அழைத்த React node. உதாரணமாக, `<App />` போன்ற JSX element. இது முழு document-ஐ பிரதிநிதித்துவப்படுத்தும் என எதிர்பார்க்கப்படுகிறது; எனவே `App` component `<html>` tag-ஐ render செய்ய வேண்டும்.
* `postponedState`: [prerender API](/reference/react-dom/static/index)-இலிருந்து return ஆன opaque `postpone` object; நீங்கள் அதை எங்கு சேமித்திருந்தாலும் அங்கிருந்து load செய்யப்பட்டது (உதா. redis, file, அல்லது S3).
* **optional** `options`: Streaming options கொண்ட object.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)-க்கு scripts-ஐ அனுமதிக்கும் [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string.
  * **optional** `signal`: [Server rendering-ஐ abort](#aborting-server-rendering) செய்து, மீதமுள்ளதை client-இல் render செய்ய அனுமதிக்கும் [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
  * **optional** `onError`: Server error ஏற்படும் போதெல்லாம் fire ஆகும் callback; அது [recoverable](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) ஆனதா [இல்லையா](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell) என்பதைக் கருத்தில் கொள்ளாது. Default ஆக இது `console.error` மட்டுமே அழைக்கும். [Crash reports log செய்ய](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server) இதை override செய்தால், `console.error`-ஐ இன்னும் அழைக்கிறீர்களா என்பதை உறுதிசெய்யுங்கள்.
  * **optional** `onShellReady`: [Shell](#specifying-what-goes-into-the-shell) முடிந்த உடனே fire ஆகும் callback. Streaming தொடங்க இங்கே `pipe`-ஐ அழைக்கலாம். HTML loading fallbacks-ஐ content-ஆல் மாற்றும் inline `<script>` tags-உடன், shell-க்கு பிறகு [கூடுதல் content-ஐ React stream செய்யும்](#streaming-more-content-as-it-loads).
  * **optional** `onShellError`: Shell render செய்யும்போது error ஏற்பட்டால் fire ஆகும் callback. இது error-ஐ argument ஆகப் பெறும். Stream-இலிருந்து இன்னும் bytes emit ஆகவில்லை; `onShellReady` அல்லது `onAllReady` எதுவும் அழைக்கப்படாது. எனவே நீங்கள் [fallback HTML shell-ஐ output செய்யலாம்](#recovering-from-errors-inside-the-shell) அல்லது prelude-ஐப் பயன்படுத்தலாம்.


#### Returns {/*returns*/}

`resumeToPipeableStream` இரண்டு methods கொண்ட object ஒன்றை return செய்கிறது:

* `pipe` கொடுக்கப்பட்ட [Writable Node.js Stream](https://nodejs.org/api/stream.html#writable-streams)-க்குள் HTML-ஐ output செய்கிறது. Streaming enable செய்ய வேண்டுமெனில் `onShellReady`-இல் `pipe`-ஐ அழைக்கவும்; crawlers மற்றும் static generation-க்கு `onAllReady`-இல் அழைக்கவும்.
* `abort` [server rendering-ஐ abort](#aborting-server-rendering) செய்து, மீதமுள்ளதை client-இல் render செய்ய அனுமதிக்கிறது.

#### Caveats {/*caveats*/}

- `bootstrapScripts`, `bootstrapScriptContent`, அல்லது `bootstrapModules`-க்கான options-ஐ `resumeToPipeableStream` ஏற்காது. அதற்கு பதிலாக, `postponedState` உருவாக்கும் `prerender` call-க்கு இந்த options-ஐ pass செய்ய வேண்டும். Bootstrap content-ஐ writable stream-க்குள் கைமுறையாகவும் inject செய்யலாம்.
- `identifierPrefix`-ஐ `resumeToPipeableStream` ஏற்காது; ஏனெனில் prefix `prerender` மற்றும் `resumeToPipeableStream` இரண்டிலும் ஒன்றாக இருக்க வேண்டும்.
- Prerender-க்கு `nonce` வழங்க முடியாததால், prerender-க்கு scripts வழங்கவில்லை என்றால் மட்டுமே `resumeToPipeableStream`-க்கு `nonce` வழங்க வேண்டும்.
- முழுமையாக pre-render செய்யப்படாத component ஒன்றைக் கண்டுபிடிக்கும் வரை, `resumeToPipeableStream` root-இலிருந்து re-render செய்கிறது. முழுமையாக prerender செய்யப்பட்ட Components (Component மற்றும் அதன் children prerendering முடித்தவை) மட்டுமே முழுவதும் skip செய்யப்படும்.

## Usage {/*usage*/}

### மேலும் படிக்க {/*further-reading*/}

Resuming, `renderToReadableStream` போலவே நடக்கிறது. மேலும் உதாரணங்களுக்கு [`renderToReadableStream`-இன் usage பகுதியை](/reference/react-dom/server/renderToReadableStream#usage) பார்க்கவும்.
குறிப்பாக `prerenderToNodeStream`-ஐ எவ்வாறு பயன்படுத்துவது என்பதற்கான உதாரணங்கள் [`prerender`-இன் usage பகுதியில்](/reference/react-dom/static/prerender#usage) உள்ளன.
