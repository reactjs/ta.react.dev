---
title: preload
---

<Note>

[React அடிப்படையிலான frameworks](/learn/creating-a-react-app) பெரும்பாலும் resource loading-ஐ உங்களுக்காக கையாளும்; எனவே இந்த API-ஐ நீங்கள் நேரடியாக call செய்ய வேண்டியிருக்காமல் இருக்கலாம். விவரங்களுக்கு உங்கள் framework-ன் documentation-ஐப் பார்க்கவும்.

</Note>

<Intro>

நீங்கள் பயன்படுத்துவீர்கள் என்று எதிர்பார்க்கும் stylesheet, font, அல்லது external script போன்ற resource-ஐ முன்கூட்டியே fetch செய்ய `preload` உதவுகிறது.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `preload(href, options)` {/*preload*/}

ஒரு resource-ஐ preload செய்ய, `react-dom`-இலிருந்து `preload` function-ஐ call செய்யுங்கள்.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

கொடுக்கப்பட்ட resource-ஐ download செய்யத் தொடங்க வேண்டும் என்ற hint-ஐ `preload` function browser-க்கு வழங்குகிறது; இதனால் நேரம் சேமிக்கலாம்.

#### Parameters {/*parameters*/}

* `href`: ஒரு string. நீங்கள் download செய்ய விரும்பும் resource-ன் URL.
* `options`: ஒரு object. இதில் பின்வரும் properties உள்ளன:
  *  `as`: தேவைப்படும் string. Resource-ன் வகை. இதன் [சாத்தியமான values](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as): `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: ஒரு string. பயன்படுத்த வேண்டிய [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). இதன் சாத்தியமான values `anonymous` மற்றும் `use-credentials`. `as` `"fetch"` ஆக அமைக்கப்பட்டால் இது தேவைப்படும்.
  *  `referrerPolicy`: ஒரு string. Fetch செய்யும்போது அனுப்ப வேண்டிய [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy). இதன் சாத்தியமான values `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, மற்றும் `unsafe-url`.
  *  `integrity`: ஒரு string. Resource-ன் authenticity-ஐ [verify செய்ய](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) பயன்படும் cryptographic hash.
  *  `type`: ஒரு string. Resource-ன் MIME type.
  *  `nonce`: ஒரு string. Strict Content Security Policy பயன்படுத்தும்போது resource-ஐ அனுமதிக்க cryptographic [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
  *  `fetchPriority`: ஒரு string. Resource-ஐ fetch செய்ய relative priority-ஐ suggest செய்கிறது. சாத்தியமான values `auto` (default), `high`, மற்றும் `low`.
  *  `imageSrcSet`: ஒரு string. `as: "image"` உடன் மட்டும் பயன்படும். [Image-ன் source set](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)-ஐ குறிப்பிடுகிறது.
  *  `imageSizes`: ஒரு string. `as: "image"` உடன் மட்டும் பயன்படும். [Image-ன் sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)-ஐ குறிப்பிடுகிறது.

#### Returns {/*returns*/}

`preload` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

* `preload`-க்கு செய்யப்படும் பல equivalent calls, ஒரே call போலவே விளைவு தரும். பின்வரும் rules அடிப்படையில் `preload` calls equivalent எனக் கருதப்படும்:
  * அவற்றுக்கு அதே `href` இருந்தால் இரண்டு calls equivalent; ஆனால்:
  * `as` `image` ஆக அமைக்கப்பட்டால், அதே `href`, `imageSrcSet`, மற்றும் `imageSizes` இருந்தால் இரண்டு calls equivalent.
* Browser-இல், எந்த சூழலிலும் `preload`-ஐ call செய்யலாம்: component render ஆகும்போது, Effect-இல், event handler-இல், போன்றவை.
* Server-side rendering-இல் அல்லது Server Components render செய்யும்போது, ஒரு component render ஆகும்போது அல்லது component render-இலிருந்து உருவான async context-இல் call செய்தால் மட்டுமே `preload` விளைவு தரும். மற்ற calls அனைத்தும் புறக்கணிக்கப்படும்.

---

## பயன்பாடு {/*usage*/}

### Rendering நேரத்தில் preloading {/*preloading-when-rendering*/}

ஒரு component அல்லது அதன் children குறிப்பிட்ட resource-ஐப் பயன்படுத்தும் என்று தெரிந்தால், அந்த component render ஆகும்போது `preload`-ஐ call செய்யுங்கள்.

<Recipes titleText="Preloading உதாரணங்கள்">

#### External script-ஐ preload செய்தல் {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Browser script-ஐ download செய்வதோடு மட்டும் இல்லாமல் உடனே execute செய்யத் தொடங்க வேண்டும் என்றால், அதற்கு பதிலாக [`preinit`](/reference/react-dom/preinit)-ஐப் பயன்படுத்துங்கள். ESM module load செய்ய விரும்பினால், [`preloadModule`](/reference/react-dom/preloadModule)-ஐப் பயன்படுத்துங்கள்.

<Solution />

#### Stylesheet-ஐ preload செய்தல் {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Stylesheet document-இல் உடனே insert செய்யப்பட வேண்டும் என்றால் (அதாவது browser அதை download செய்வதோடு மட்டும் இல்லாமல் உடனே parse செய்யத் தொடங்கும்), அதற்கு பதிலாக [`preinit`](/reference/react-dom/preinit)-ஐப் பயன்படுத்துங்கள்.

<Solution />

#### Font-ஐ preload செய்தல் {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

ஒரு stylesheet-ஐ preload செய்தால், அந்த stylesheet refer செய்யும் fonts-ஐயும் preload செய்வது நல்லது. அப்படிச் செய்தால், stylesheet download ஆகி parse செய்யப்படுவதற்கு முன்பே browser font-ஐ download செய்யத் தொடங்கலாம்.

<Solution />

#### Image-ஐ preload செய்தல் {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Image preload செய்யும்போது, screen அளவுக்கு [சரியான அளவுள்ள image-ஐ fetch செய்ய](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) `imageSrcSet` மற்றும் `imageSizes` options browser-க்கு உதவுகின்றன.

<Solution />

</Recipes>

### Event handler-இல் preloading {/*preloading-in-an-event-handler*/}

External resources தேவைப்படும் page அல்லது state-க்கு transition ஆகும் முன் event handler-இல் `preload`-ஐ call செய்யுங்கள். புதிய page அல்லது state render ஆகும் போது call செய்வதைவிட, இது process-ஐ முன்னதாகத் தொடங்க வைக்கிறது.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
