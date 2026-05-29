---
title: preconnect
---

<Intro>

`preconnect`, resources load செய்யப்படும் என்று நீங்கள் எதிர்பார்க்கும் server-க்கு முன்கூட்டியே connect செய்ய உதவுகிறது.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

ஒரு host-க்கு preconnect செய்ய, `react-dom`-இலிருந்து `preconnect` function-ஐ அழைக்கவும்.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

கொடுக்கப்பட்ட server-க்கு connection ஒன்றைத் திறக்க வேண்டும் என்ற hint-ஐ `preconnect` function browser-க்கு வழங்குகிறது. Browser அதைச் செய்யத் தேர்ந்தெடுத்தால், அந்த server-இலிருந்து resources load ஆகும் வேகம் அதிகரிக்கலாம்.

#### Parameters {/*parameters*/}

* `href`: ஒரு string. நீங்கள் connect செய்ய விரும்பும் server-இன் URL.


#### Returns {/*returns*/}

`preconnect` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

* அதே server-க்கு `preconnect`-ஐ பலமுறை அழைப்பது, ஒருமுறை அழைப்பதற்குச் சமமான விளைவையே தரும்.
* Browser-இல் எந்த சூழலிலும் `preconnect`-ஐ அழைக்கலாம்: component render ஆகும்போது, Effect-இல், event handler-இல், மற்றும் இதுபோன்ற இடங்களில்.
* Server-side rendering-இல் அல்லது Server Components render செய்யும்போது, component render ஆகும் நேரத்தில் அல்லது component render-இலிருந்து தொடங்கிய async context-இல் அழைத்தால் மட்டுமே `preconnect` விளைவளிக்கும். மற்ற எல்லா calls-உம் புறக்கணிக்கப்படும்.
* உங்களுக்கு தேவைப்படும் குறிப்பிட்ட resources தெரிந்திருந்தால், resources-ஐ உடனே load செய்யத் தொடங்கும் [பிற functions](/reference/react-dom/#resource-preloading-apis)-ஐ அதற்கு பதிலாக அழைக்கலாம்.
* Webpage தானே hosted ஆகும் அதே server-க்கு preconnect செய்வதில் பலன் இல்லை; hint வழங்கப்படும் நேரத்துக்குள் அதற்கு ஏற்கனவே connect செய்யப்பட்டிருக்கும்.

---

## Usage {/*usage*/}

### Render செய்யும்போது preconnect செய்தல் {/*preconnecting-when-rendering*/}

அதன் children அந்த host-இலிருந்து external resources load செய்யும் என்பது தெரிந்திருந்தால், component render செய்யும்போது `preconnect`-ஐ அழைக்கவும்.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### Event handler-இல் preconnect செய்தல் {/*preconnecting-in-an-event-handler*/}

External resources தேவைப்படும் page அல்லது state-க்கு மாறுவதற்கு முன், event handler-இல் `preconnect`-ஐ அழைக்கவும். புதிய page அல்லது state render ஆகும் போது அழைப்பதை விட, இது செயல்முறையை முன்கூட்டியே தொடங்குகிறது.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
