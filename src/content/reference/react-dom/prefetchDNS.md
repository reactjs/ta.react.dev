---
title: prefetchDNS
---

<Intro>

`prefetchDNS`, resources load செய்யப்படும் என்று நீங்கள் எதிர்பார்க்கும் server-இன் IP-ஐ முன்கூட்டியே lookup செய்ய உதவுகிறது.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

ஒரு host-ஐ lookup செய்ய, `react-dom`-இலிருந்து `prefetchDNS` function-ஐ அழைக்கவும்.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

கொடுக்கப்பட்ட server-இன் IP address-ஐ lookup செய்ய வேண்டும் என்ற hint-ஐ `prefetchDNS` function browser-க்கு வழங்குகிறது. Browser அதைச் செய்யத் தேர்ந்தெடுத்தால், அந்த server-இலிருந்து resources load ஆகும் வேகம் அதிகரிக்கலாம்.

#### Parameters {/*parameters*/}

* `href`: ஒரு string. நீங்கள் connect செய்ய விரும்பும் server-இன் URL.

#### Returns {/*returns*/}

`prefetchDNS` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

* அதே server-க்கு `prefetchDNS`-ஐ பலமுறை அழைப்பது, ஒருமுறை அழைப்பதற்குச் சமமான விளைவையே தரும்.
* Browser-இல் எந்த சூழலிலும் `prefetchDNS`-ஐ அழைக்கலாம்: component render ஆகும்போது, Effect-இல், event handler-இல், மற்றும் இதுபோன்ற இடங்களில்.
* Server-side rendering-இல் அல்லது Server Components render செய்யும்போது, component render ஆகும் நேரத்தில் அல்லது component render-இலிருந்து தொடங்கிய async context-இல் அழைத்தால் மட்டுமே `prefetchDNS` விளைவளிக்கும். மற்ற எல்லா calls-உம் புறக்கணிக்கப்படும்.
* உங்களுக்கு தேவைப்படும் குறிப்பிட்ட resources தெரிந்திருந்தால், resources-ஐ உடனே load செய்யத் தொடங்கும் [பிற functions](/reference/react-dom/#resource-preloading-apis)-ஐ அதற்கு பதிலாக அழைக்கலாம்.
* Webpage தானே hosted ஆகும் அதே server-ஐ prefetch செய்வதில் பலன் இல்லை; hint வழங்கப்படும் நேரத்துக்குள் அது ஏற்கனவே lookup செய்யப்பட்டிருக்கும்.
* [`preconnect`](/reference/react-dom/preconnect)-உடன் ஒப்பிடும்போது, பல domains-க்கு ஊகத்தின் அடிப்படையில் connect செய்யும் சூழலில் `prefetchDNS` சிறந்ததாக இருக்கலாம். அப்படி இருக்கும் போது preconnections-இன் overhead, அதன் பயனை விட அதிகமாகலாம்.

---

## Usage {/*usage*/}

### Render செய்யும்போது DNS prefetch செய்தல் {/*prefetching-dns-when-rendering*/}

அதன் children அந்த host-இலிருந்து external resources load செய்யும் என்பது தெரிந்திருந்தால், component render செய்யும்போது `prefetchDNS`-ஐ அழைக்கவும்.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### Event handler-இல் DNS prefetch செய்தல் {/*prefetching-dns-in-an-event-handler*/}

External resources தேவைப்படும் page அல்லது state-க்கு மாறுவதற்கு முன், event handler-இல் `prefetchDNS`-ஐ அழைக்கவும். புதிய page அல்லது state render ஆகும் போது அழைப்பதை விட, இது செயல்முறையை முன்கூட்டியே தொடங்குகிறது.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
