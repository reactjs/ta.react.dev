---
title: preinitModule
---

<Note>

[React அடிப்படையிலான frameworks](/learn/creating-a-react-app) பெரும்பாலும் resource loading-ஐ உங்களுக்குப் பதிலாக கையாளும், எனவே இந்த API-யை நீங்களே அழைக்க வேண்டியிருக்காமல் இருக்கலாம். விவரங்களுக்கு உங்கள் framework-இன் documentation-ஐப் பாருங்கள்.

</Note>

<Intro>

`preinitModule`, ESM module ஒன்றை முன்கூட்டியே fetch செய்து evaluate செய்ய உதவுகிறது.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

ESM module ஒன்றை preinit செய்ய, `react-dom`-இலிருந்து `preinitModule` function-ஐ அழைக்கவும்.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

கொடுக்கப்பட்ட module-ஐ download செய்து execute செய்யத் தொடங்க வேண்டும் என்ற hint-ஐ `preinitModule` function browser-க்கு வழங்குகிறது; இது நேரத்தைச் சேமிக்கலாம். நீங்கள் `preinit` செய்யும் modules download முடிந்தவுடன் execute செய்யப்படும்.

#### Parameters {/*parameters*/}

* `href`: ஒரு string. Download செய்து execute செய்ய விரும்பும் module-இன் URL.
* `options`: ஒரு object. இது பின்வரும் properties-ஐக் கொண்டுள்ளது:
  *  `as`: அவசியமான string. இது `'script'` ஆக இருக்க வேண்டும்.
  *  `crossOrigin`: ஒரு string. பயன்படுத்த வேண்டிய [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). இதன் சாத்தியமான values `anonymous` மற்றும் `use-credentials`.
  *  `integrity`: ஒரு string. Module-இன் [நம்பகத்தன்மையை சரிபார்க்க](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) அதன் cryptographic hash.
  *  `nonce`: ஒரு string. கடுமையான Content Security Policy பயன்படுத்தும்போது [module-ஐ அனுமதிக்க cryptographic nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).

#### Returns {/*returns*/}

`preinitModule` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

* அதே `href`-உடன் `preinitModule`-ஐ பலமுறை அழைப்பது, ஒருமுறை அழைப்பதற்குச் சமமான விளைவையே தரும்.
* Browser-இல் எந்த சூழலிலும் `preinitModule`-ஐ அழைக்கலாம்: component render ஆகும்போது, Effect-இல், event handler-இல், மற்றும் இதுபோன்ற இடங்களில்.
* Server-side rendering-இல் அல்லது Server Components render செய்யும்போது, component render ஆகும் நேரத்தில் அல்லது component render-இலிருந்து தொடங்கிய async context-இல் அழைத்தால் மட்டுமே `preinitModule` விளைவளிக்கும். மற்ற எல்லா calls-உம் புறக்கணிக்கப்படும்.

---

## Usage {/*usage*/}

### Render செய்யும்போது preloading {/*preloading-when-rendering*/}

அந்த component அல்லது அதன் children குறிப்பிட்ட module ஒன்றைப் பயன்படுத்தும் என்பது தெரிந்திருந்தால், மேலும் module download ஆனவுடன் உடனே evaluate செய்யப்பட்டு விளைவளிப்பது உங்களுக்கு ஏற்றதாக இருந்தால், component render செய்யும்போது `preinitModule`-ஐ அழைக்கவும்.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Browser module-ஐ download செய்ய வேண்டும் ஆனால் உடனே execute செய்ய வேண்டாம் என விரும்பினால், அதற்கு பதிலாக [`preloadModule`](/reference/react-dom/preloadModule)-ஐப் பயன்படுத்துங்கள். ESM module அல்லாத script ஒன்றை preinit செய்ய விரும்பினால், [`preinit`](/reference/react-dom/preinit)-ஐப் பயன்படுத்துங்கள்.

### Event handler-இல் preloading {/*preloading-in-an-event-handler*/}

Module தேவைப்படும் page அல்லது state-க்கு மாறுவதற்கு முன், event handler-இல் `preinitModule`-ஐ அழைக்கவும். புதிய page அல்லது state render ஆகும் போது அழைப்பதை விட, இது செயல்முறையை முன்கூட்டியே தொடங்குகிறது.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
