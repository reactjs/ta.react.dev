---
script: "<script>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script), உங்கள் document-க்கு script சேர்க்க உதவுகிறது.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `<script>` {/*script*/}

உங்கள் document-க்கு inline அல்லது external scripts சேர்க்க, [உலாவியில் உள்ளமைந்த `<script>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)-ஐ render செய்யுங்கள். எந்த component-இலிருந்தும் `<script>`-ஐ render செய்யலாம்; React [சில சூழல்களில்](#special-rendering-behavior) தொடர்புடைய DOM element-ஐ document head-இல் வைத்து, ஒரே மாதிரியான scripts-ஐ de-duplicate செய்யும்.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<script>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ ஆதரிக்கிறது.

இதில் `children` அல்லது `src` prop ஆகியவற்றில் *ஒன்றாவது* இருக்க வேண்டும்.

* `children`: ஒரு string. Inline script-ன் source code.
* `src`: ஒரு string. External script-ன் URL.

ஆதரிக்கப்படும் பிற props:

* `async`: ஒரு boolean. Document-ன் மீதமுள்ள பகுதி process ஆகும் வரை script execution-ஐ browser defer செய்ய அனுமதிக்கிறது; performance-க்கான விரும்பத்தக்க behavior இது.
*  `crossOrigin`: ஒரு string. பயன்படுத்த வேண்டிய [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). இதன் சாத்தியமான values `anonymous` மற்றும் `use-credentials`.
* `fetchPriority`: ஒரு string. ஒரே நேரத்தில் பல scripts fetch செய்யும்போது அவற்றை priority அடிப்படையில் browser rank செய்ய அனுமதிக்கிறது. `"high"`, `"low"`, அல்லது `"auto"` (default) ஆக இருக்கலாம்.
* `integrity`: ஒரு string. Script-ன் authenticity-ஐ [verify செய்ய](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) பயன்படும் cryptographic hash.
* `noModule`: ஒரு boolean. ES modules ஆதரிக்கும் browsers-இல் script-ஐ disable செய்கிறது; ஆதரிக்காத browsers-க்கு fallback script வழங்க அனுமதிக்கிறது.
* `nonce`: ஒரு string. Strict Content Security Policy பயன்படுத்தும்போது resource-ஐ அனுமதிக்க cryptographic [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
* `referrer`: ஒரு string. Script மற்றும் அந்த script பின்னர் fetch செய்யும் resources-ஐ fetch செய்யும்போது [எந்த Referer header அனுப்ப வேண்டும்](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) என்பதைச் சொல்கிறது.
* `type`: ஒரு string. Script [classic script, ES module, அல்லது import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type) ஆக உள்ளதா என்பதைச் சொல்கிறது.

Scripts-க்கான React-ன் [சிறப்பு கையாளுதலை](#special-rendering-behavior) disable செய்யும் props:

* `onError`: ஒரு function. Script load ஆகத் தவறும்போது call செய்யப்படும்.
* `onLoad`: ஒரு function. Script load ஆகி முடிந்ததும் call செய்யப்படும்.

React உடன் பயன்படுத்த **பரிந்துரைக்கப்படாத** props:

* `blocking`: ஒரு string. `"render"` ஆக அமைத்தால், script load ஆகும் வரை page-ஐ render செய்ய வேண்டாம் என்று browser-க்கு அறிவுறுத்துகிறது. React Suspense மூலம் இன்னும் fine-grained control வழங்குகிறது.
* `defer`: ஒரு string. Document load ஆகி முடியும் வரை script-ஐ execute செய்வதை browser-க்கு தடுக்கிறது. Streaming server-rendered components உடன் compatible அல்ல. அதற்கு பதிலாக `async` prop-ஐப் பயன்படுத்துங்கள்.

#### சிறப்பு rendering behavior {/*special-rendering-behavior*/}

React `<script>` components-ஐ document-ன் `<head>`-க்கு நகர்த்தி, ஒரே மாதிரியான scripts-ஐ de-duplicate செய்ய முடியும்.

இந்த behavior-க்கு opt in செய்ய, `src` மற்றும் `async={true}` props வழங்குங்கள். Scripts-க்கு அதே `src` இருந்தால் React அவற்றை de-duplicate செய்யும். Scripts பாதுகாப்பாக நகர்த்தப்பட அனுமதிக்க `async` prop true ஆக இருக்க வேண்டும்.

இந்த சிறப்பு கையாளுதலுக்கு இரண்டு எச்சரிக்கைகள் உள்ளன:

* Script render ஆன பிறகு props-இல் வரும் மாற்றங்களை React புறக்கணிக்கும். (இது நடந்தால் development-இல் React warning வழங்கும்.)
* அதை render செய்த component unmount ஆன பிறகும் React script-ஐ DOM-இல் விட்டு விடலாம். (Scripts DOM-இல் insert செய்யப்படும் போது ஒரே முறை மட்டும் execute ஆகும் என்பதால் இதனால் விளைவு இல்லை.)

---

## பயன்பாடு {/*usage*/}

### External script-ஐ render செய்தல் {/*rendering-an-external-script*/}

ஒரு component சரியாக display ஆக சில scripts-ஐ சார்ந்திருந்தால், அந்த component-க்குள் `<script>`-ஐ render செய்யலாம்.
ஆனால் script load ஆகி முடியும் முன்பே component commit ஆகலாம்.
`onLoad` prop-ஐப் பயன்படுத்துவது போன்ற முறையில் `load` event fire ஆன பிறகு script content-ஐ சார்ந்து செயல்படலாம்.

பல components அதை render செய்தாலும், அதே `src` உள்ள scripts-ஐ React de-duplicate செய்து, அவற்றில் ஒன்றை மட்டும் DOM-இல் insert செய்யும்.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
ஒரு script-ஐப் பயன்படுத்த விரும்பும்போது, [preinit](/reference/react-dom/preinit) function-ஐ call செய்வது பயனுள்ளதாக இருக்கலாம். `<script>` component-ஐ மட்டும் render செய்வதைவிட, இந்த function-ஐ call செய்வது browser script-ஐ முன்னதாக fetch செய்யத் தொடங்க அனுமதிக்கலாம்; உதாரணமாக [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) அனுப்புவதன் மூலம்.
</Note>

### Inline script-ஐ render செய்தல் {/*rendering-an-inline-script*/}

Inline script சேர்க்க, script source code-ஐ children ஆகக் கொண்டு `<script>` component-ஐ render செய்யுங்கள். Inline scripts de-duplicate செய்யப்படாது, document `<head>`-க்கு நகர்த்தப்படாது.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
