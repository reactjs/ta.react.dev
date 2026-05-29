---
title: preinit
---

<Note>

[React அடிப்படையிலான frameworks](/learn/creating-a-react-app) பெரும்பாலும் resource loading-ஐ உங்களுக்குப் பதிலாக கையாளும், எனவே இந்த API-யை நீங்களே அழைக்க வேண்டியிருக்காமல் இருக்கலாம். விவரங்களுக்கு உங்கள் framework-இன் documentation-ஐப் பாருங்கள்.

</Note>

<Intro>

`preinit`, stylesheet அல்லது external script ஒன்றை முன்கூட்டியே fetch செய்து evaluate செய்ய உதவுகிறது.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Script அல்லது stylesheet ஒன்றை preinit செய்ய, `react-dom`-இலிருந்து `preinit` function-ஐ அழைக்கவும்.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

கொடுக்கப்பட்ட resource-ஐ download செய்து execute செய்யத் தொடங்க வேண்டும் என்ற hint-ஐ `preinit` function browser-க்கு வழங்குகிறது; இது நேரத்தைச் சேமிக்கலாம். நீங்கள் `preinit` செய்யும் scripts download முடிந்ததும் execute செய்யப்படும். நீங்கள் preinit செய்யும் stylesheets document-க்குள் insert செய்யப்படும்; இதனால் அவை உடனே effect ஆகும்.

#### Parameters {/*parameters*/}

* `href`: ஒரு string. Download செய்து execute செய்ய விரும்பும் resource-இன் URL.
* `options`: ஒரு object. இது பின்வரும் properties-ஐக் கொண்டுள்ளது:
  *  `as`: அவசியமான string. Resource-இன் type. இதன் சாத்தியமான values `script` மற்றும் `style`.
  * `precedence`: ஒரு string. Stylesheets-க்கு அவசியம். மற்றவற்றுடன் ஒப்பிடும்போது stylesheet எங்கு insert செய்யப்பட வேண்டும் என்பதைச் சொல்கிறது. அதிக precedence கொண்ட stylesheets, குறைந்த precedence கொண்டவற்றை override செய்ய முடியும். சாத்தியமான values `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: ஒரு string. பயன்படுத்த வேண்டிய [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). இதன் சாத்தியமான values `anonymous` மற்றும் `use-credentials`.
  *  `integrity`: ஒரு string. Resource-இன் [நம்பகத்தன்மையை சரிபார்க்க](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) அதன் cryptographic hash.
  *  `nonce`: ஒரு string. கடுமையான Content Security Policy பயன்படுத்தும்போது [resource-ஐ அனுமதிக்க cryptographic nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
  *  `fetchPriority`: ஒரு string. Resource-ஐ fetch செய்வதற்கான relative priority-ஐ பரிந்துரைக்கிறது. சாத்தியமான values `auto` (default), `high`, மற்றும் `low`.

#### Returns {/*returns*/}

`preinit` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

* அதே `href`-உடன் `preinit`-ஐ பலமுறை அழைப்பது, ஒருமுறை அழைப்பதற்குச் சமமான விளைவையே தரும்.
* Browser-இல் எந்த சூழலிலும் `preinit`-ஐ அழைக்கலாம்: component render ஆகும்போது, Effect-இல், event handler-இல், மற்றும் இதுபோன்ற இடங்களில்.
* Server-side rendering-இல் அல்லது Server Components render செய்யும்போது, component render ஆகும் நேரத்தில் அல்லது component render-இலிருந்து தொடங்கிய async context-இல் அழைத்தால் மட்டுமே `preinit` விளைவளிக்கும். மற்ற எல்லா calls-உம் புறக்கணிக்கப்படும்.

---

## Usage {/*usage*/}

### Render செய்யும்போது preinit செய்தல் {/*preiniting-when-rendering*/}

அந்த component அல்லது அதன் children குறிப்பிட்ட resource ஒன்றைப் பயன்படுத்தும் என்பது தெரிந்திருந்தால், மேலும் resource download ஆனவுடன் evaluate செய்யப்பட்டு உடனே effect ஆகுவது உங்களுக்கு ஏற்றதாக இருந்தால், component render செய்யும்போது `preinit`-ஐ அழைக்கவும்.

<Recipes titleText="Preinit செய்வதற்கான உதாரணங்கள்">

#### External script ஒன்றை preinit செய்தல் {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Browser script-ஐ download செய்ய வேண்டும் ஆனால் உடனே execute செய்ய வேண்டாம் என விரும்பினால், அதற்கு பதிலாக [`preload`](/reference/react-dom/preload)-ஐப் பயன்படுத்துங்கள். ESM module ஒன்றை load செய்ய விரும்பினால், [`preinitModule`](/reference/react-dom/preinitModule)-ஐப் பயன்படுத்துங்கள்.

<Solution />

#### Stylesheet ஒன்றை preinit செய்தல் {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

அவசியமான `precedence` option, document உள்ளே stylesheets-இன் வரிசையை கட்டுப்படுத்த உதவுகிறது. அதிக precedence கொண்ட stylesheets குறைந்த precedence கொண்டவற்றை overrule செய்ய முடியும்.

Stylesheet-ஐ download செய்ய வேண்டும் ஆனால் உடனே document-க்குள் insert செய்ய வேண்டாம் என விரும்பினால், அதற்கு பதிலாக [`preload`](/reference/react-dom/preload)-ஐப் பயன்படுத்துங்கள்.

<Solution />

</Recipes>

### Event handler-இல் preinit செய்தல் {/*preiniting-in-an-event-handler*/}

External resources தேவைப்படும் page அல்லது state-க்கு மாறுவதற்கு முன், event handler-இல் `preinit`-ஐ அழைக்கவும். புதிய page அல்லது state render ஆகும் போது அழைப்பதை விட, இது செயல்முறையை முன்கூட்டியே தொடங்குகிறது.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
