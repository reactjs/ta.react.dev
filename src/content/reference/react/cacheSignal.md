---
title: cacheSignal
---

<RSC>

`cacheSignal` தற்போது [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)-உடன் மட்டுமே பயன்படுத்தப்படுகிறது.

</RSC>

<Intro>

`cache()` lifetime முடிந்தது எப்போது என்பதை அறிய `cacheSignal` அனுமதிக்கிறது.

```js
const signal = cacheSignal();
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `cacheSignal` {/*cachesignal*/}

`AbortSignal` பெற `cacheSignal`-ஐ அழைக்கவும்.

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

React rendering முடித்ததும், `AbortSignal` abort செய்யப்படும். இனி தேவையில்லாத in-flight work-ஐ cancel செய்ய இது அனுமதிக்கிறது.
பின்வரும் நேரங்களில் rendering முடிந்ததாக கருதப்படும்:
- React rendering-ஐ வெற்றிகரமாக முடித்தது
- Render abort செய்யப்பட்டது
- Render தோல்வியடைந்தது

#### Parameters {/*parameters*/}

இந்த function எந்த parameters-யும் ஏற்காது.

#### Returns {/*returns*/}

Rendering நடக்கும் போது அழைத்தால் `cacheSignal` ஒரு `AbortSignal` return செய்யும். இல்லையெனில் `cacheSignal()` `null` return செய்யும்.

#### Caveats {/*caveats*/}

- `cacheSignal` தற்போது [React Server Components](/reference/rsc/server-components)-இல் மட்டுமே பயன்படுத்தப்பட உள்ளது. Client Components-இல் இது எப்போதும் `null` return செய்யும். எதிர்காலத்தில், client cache refresh அல்லது invalidate ஆகும் போது Client Component-க்கும் இது பயன்படுத்தப்படும். Client-இல் இது எப்போதும் null தான் என்று நீங்கள் கருதக்கூடாது.
- Rendering-க்கு வெளியே அழைத்தால், தற்போதைய scope நிரந்தரமாக cached இல்லை என்பதை தெளிவாக்க `cacheSignal` `null` return செய்யும்.

---

## Usage {/*usage*/}

### In-flight requests-ஐ cancel செய்தல் {/*cancel-in-flight-requests*/}

In-flight requests-ஐ abort செய்ய <CodeStep step={1}>`cacheSignal`</CodeStep>-ஐ அழைக்கவும்.

```js [[1, 4, "cacheSignal()"]]
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

<Pitfall>
Rendering-க்கு வெளியே தொடங்கப்பட்ட async work-ஐ abort செய்ய `cacheSignal`-ஐப் பயன்படுத்த முடியாது. உதாரணமாக:

```js
import {cacheSignal} from 'react';
// 🚩 Pitfall: The request will not actually be aborted if the rendering of `Component` is finished.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### React rendering முடித்த பிறகு errors-ஐ புறக்கணித்தல் {/*ignore-errors-after-react-has-finished-rendering*/}

ஒரு function throw செய்தால், அது cancellation காரணமாக இருக்கலாம் (உதா. <CodeStep step={1}>Database connection</CodeStep> மூடப்பட்டுள்ளது). Error cancellation காரணமா அல்லது உண்மையான error-ஆ என்பதைச் சரிபார்க்க <CodeStep step={2}>`aborted` property</CodeStep>-ஐப் பயன்படுத்தலாம். Cancellation காரணமாக ஏற்பட்ட <CodeStep step={3}>errors-ஐ புறக்கணிக்க</CodeStep> நீங்கள் விரும்பலாம்.

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // only log if it's a real error and not due to cancellation
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>No data available</div>;
  }
  return <div>{data.name}</div>;
}
```
