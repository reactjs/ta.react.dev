---
title: useDeferredValue
---

<Intro>

`useDeferredValue` என்பது UI-யின் ஒரு பகுதியை update செய்வதை defer செய்ய அனுமதிக்கும் React Hook.

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

அந்த value-ன் deferred version-ஐ பெற, உங்கள் component-ன் top level-இல் `useDeferredValue`-ஐ call செய்யுங்கள்.

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[மேலும் எடுத்துக்காட்டுகளை கீழே பாருங்கள்.](#usage)

#### Parameters {/*parameters*/}

* `value`: நீங்கள் defer செய்ய விரும்பும் value. இது எந்த type-ஆகவும் இருக்கலாம்.
* **optional** `initialValue`: Component-ன் initial render போது பயன்படுத்த வேண்டிய value. இந்த option omit செய்யப்பட்டால், initial render போது `useDeferredValue` defer செய்யாது, ஏனெனில் அதற்கு பதிலாக render செய்ய `value`-ன் முந்தைய version இல்லை.


#### Returns {/*returns*/}

- `currentValue`: Initial render போது, returned deferred value `initialValue` ஆகவோ, அல்லது நீங்கள் வழங்கிய value-க்கு சமமாகவோ இருக்கும். Updates போது, React முதலில் பழைய value உடன் re-render செய்ய முயலும் (அதனால் பழைய value-ஐ return செய்யும்), பின்னர் புதிய value உடன் background-இல் மற்றொரு re-render முயலும் (அதனால் updated value-ஐ return செய்யும்).

#### Caveats {/*caveats*/}

- ஒரு update Transition-க்குள் இருந்தால், update ஏற்கனவே deferred ஆக இருப்பதால் `useDeferredValue` எப்போதும் புதிய `value`-ஐ return செய்யும்; deferred render ஒன்றை spawn செய்யாது.

- `useDeferredValue`-க்கு நீங்கள் pass செய்யும் values primitive values (strings மற்றும் numbers போன்றவை) ஆகவோ அல்லது rendering-க்கு வெளியே உருவாக்கப்பட்ட objects ஆகவோ இருக்க வேண்டும். Rendering போது புதிய object உருவாக்கி உடனே `useDeferredValue`-க்கு pass செய்தால், அது ஒவ்வொரு render-இலும் வேறுபடும்; தேவையற்ற background re-renders ஏற்படும்.

- `useDeferredValue` வேறொரு value-ஐப் பெறும்போது ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) மூலம் compare செய்தால்), current render-க்கு கூடுதலாக (அது இன்னும் previous value-ஐ பயன்படுத்தும்), புதிய value உடன் background-இல் re-render schedule செய்கிறது. Background re-render interruptible: `value`-க்கு மற்றொரு update வந்தால், React background re-render-ஐ scratch-இலிருந்து restart செய்யும். உதாரணமாக, user input-இல் type செய்வது chart தனது deferred value-ஐப் பெற்று re-render செய்யும் வேகத்தைவிட வேகமாக இருந்தால், user type செய்வதை நிறுத்திய பிறகே chart re-render ஆகும்.

- `useDeferredValue` [`<Suspense>`](/reference/react/Suspense)-உடன் integrated. புதிய value காரணமாக background update UI-யை suspend செய்தால், user fallback-ஐ பார்க்கமாட்டார். Data load ஆகும் வரை பழைய deferred value-ஐப் பார்ப்பார்.

- `useDeferredValue` தனியாக extra network requests-ஐத் தடுக்காது.

- `useDeferredValue` தானாக ஏற்படுத்தும் fixed delay எதுவும் இல்லை. React original re-render-ஐ முடித்த உடனே, புதிய deferred value உடன் background re-render-ல் வேலை செய்யத் தொடங்கும். Events (typing போன்றவை) காரணமாக வரும் எந்த updates-மும் background re-render-ஐ interrupt செய்து அதற்கு மேலாக prioritized செய்யப்படும்.

- `useDeferredValue` காரணமாக background re-render ஏற்படும்போது, அது screen-க்கு committed ஆகும் வரை Effects fire ஆகாது. Background re-render suspend செய்தால், data load ஆகி UI update ஆன பிறகே அதன் Effects run ஆகும்.

---

## Usage {/*usage*/}

### புதிய content load ஆகும் போது stale content காட்டுதல் {/*showing-stale-content-while-fresh-content-is-loading*/}

உங்கள் UI-யின் ஒரு பகுதியை update செய்வதை defer செய்ய, component-ன் top level-இல் `useDeferredValue`-ஐ call செய்யுங்கள்.

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

Initial render போது, <CodeStep step={2}>deferred value</CodeStep> நீங்கள் வழங்கிய <CodeStep step={1}>value</CodeStep>-க்கு சமமாக இருக்கும்.

Updates போது, <CodeStep step={2}>deferred value</CodeStep> latest <CodeStep step={1}>value</CodeStep>-ஐவிட "lag behind" ஆக இருக்கும். குறிப்பாக, React முதலில் deferred value-ஐ update செய்யாமல் re-render செய்து, பின்னர் புதிதாகப் பெற்ற value உடன் background-இல் re-render செய்ய முயலும்.

**இது எப்போது பயனுள்ளதாக இருக்கும் என்பதைப் பார்க்க ஒரு example-ஐ படிப்படியாகப் பார்ப்போம்.**

<Note>

இந்த example நீங்கள் Suspense-enabled data source பயன்படுத்துகிறீர்கள் என்று கருதுகிறது:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) மற்றும் [Next.js](https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense) போன்ற Suspense-enabled frameworks மூலம் data fetching
- [`lazy`](/reference/react/lazy) மூலம் component code-ஐ lazy-load செய்தல்
- [`use`](/reference/react/use) மூலம் Promise-ன் value-ஐ வாசித்தல்

[Suspense மற்றும் அதன் limitations பற்றி மேலும் அறிக.](/reference/react/Suspense)

</Note>


இந்த example-இல், `SearchResults` component search results fetch செய்யும்போது [suspends](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading). `"a"` type செய்து, results-க்காக காத்திருந்து, பின்னர் அதை `"ab"` ஆக edit செய்து பாருங்கள். `"a"`-க்கான results loading fallback-ஆல் replace செய்யப்படும்.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Albums தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றப்படுகிறது...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p><i>"{query}"</i>-க்கு பொருத்தங்கள் இல்லை</p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('செயல்படுத்தப்படவில்லை');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

ஒரு பொதுவான alternative UI pattern, results list update-ஐ *defer* செய்து, புதிய results ready ஆகும் வரை முந்தைய results-ஐ தொடர்ந்து காட்டுவது. Query-யின் deferred version-ஐ கீழே pass செய்ய `useDeferredValue` call செய்யுங்கள்:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Albums தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றப்படுகிறது...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` உடனடியாக update ஆகும், எனவே input புதிய value-ஐ display செய்யும். ஆனால் data load ஆகும் வரை `deferredQuery` தனது previous value-ஐ வைத்திருக்கும்; எனவே `SearchResults` சிறிது நேரம் stale results-ஐ காட்டும்.

கீழே உள்ள example-இல் `"a"` enter செய்து, results load ஆக காத்திருந்து, பின்னர் input-ஐ `"ab"` ஆக edit செய்யுங்கள். Suspense fallback-க்கு பதிலாக, புதிய results load ஆகும் வரை stale result list-ஐ இப்போது காண்பதை கவனியுங்கள்:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Albums தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றப்படுகிறது...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p><i>"{query}"</i>-க்கு பொருத்தங்கள் இல்லை</p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('செயல்படுத்தப்படவில்லை');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### Value ஒன்றை defer செய்வது உட்புறத்தில் எப்படி வேலை செய்கிறது? {/*how-does-deferring-a-value-work-under-the-hood*/}

இது இரண்டு steps-இல் நடக்கிறது என்று நினைக்கலாம்:

1. **முதலில், React புதிய `query` (`"ab"`) உடன் re-render செய்கிறது, ஆனால் பழைய `deferredQuery` (இன்னும் `"a"`) உடன்.** Result list-க்கு நீங்கள் pass செய்யும் `deferredQuery` value *deferred* ஆக உள்ளது: அது `query` value-ஐவிட "lags behind".

2. **Background-இல், React `query` மற்றும் `deferredQuery` இரண்டும் `"ab"` ஆக update செய்யப்பட்ட நிலையில் re-render செய்ய முயற்சிக்கிறது.** இந்த re-render முடிந்தால், React அதை screen-இல் காட்டும். ஆனால் அது suspend செய்தால் (`"ab"`-க்கான results இன்னும் load ஆகவில்லை), React இந்த rendering attempt-ஐ கைவிட்டு, data load ஆன பிறகு இந்த re-render-ஐ மீண்டும் retry செய்யும். Data ready ஆகும் வரை user stale deferred value-ஐத் தொடர்ந்து பார்க்குவார்.

Deferred "background" rendering interruptible. உதாரணமாக, நீங்கள் input-இல் மீண்டும் type செய்தால், React அதை கைவிட்டு புதிய value உடன் restart செய்யும். React எப்போதும் latest provided value-ஐ பயன்படுத்தும்.

ஒவ்வொரு keystroke-க்கும் இன்னும் network request ஒன்று இருக்கிறது என்பதை கவனியுங்கள். இங்கே defer செய்யப்படுவது results display செய்வது (அவை ready ஆகும் வரை), network requests தாமாக அல்ல. User தொடர்ந்து type செய்தாலும், ஒவ்வொரு keystroke-க்கும் responses cached ஆகும்; எனவே Backspace அழுத்துவது instant, மீண்டும் fetch செய்யாது.

</DeepDive>

---

### Content stale என்பதைச் சுட்டிக்காட்டுதல் {/*indicating-that-the-content-is-stale*/}

மேலுள்ள example-இல், latest query-க்கான result list இன்னும் loading-இல் உள்ளது என்பதற்கான indication இல்லை. புதிய results load ஆக சில நேரம் எடுத்தால் user குழப்பமடையலாம். Result list latest query-க்கு match ஆகவில்லை என்பதை user-க்கு மேலும் தெளிவாகச் சொல்ல, stale result list display ஆகும் போது visual indication ஒன்றைச் சேர்க்கலாம்:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

இந்த change-உடன், நீங்கள் type செய்யத் தொடங்கும் உடனே, புதிய result list load ஆகும் வரை stale result list சற்றே dim ஆகும். Dimming படிப்படியாக உணரப்பட CSS transition ஒன்றையும் சேர்க்கலாம்; கீழே உள்ள example போல:

<Sandpack>

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Albums தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றப்படுகிறது...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p><i>"{query}"</i>-க்கு பொருத்தங்கள் இல்லை</p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('செயல்படுத்தப்படவில்லை');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### UI-யின் ஒரு பகுதியுக்கான re-rendering-ஐ defer செய்தல் {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue`-ஐ performance optimization ஆகவும் பயன்படுத்தலாம். உங்கள் UI-யின் ஒரு பகுதி re-render ஆக மெதுவாக இருந்தால், அதை optimize செய்ய நேரடியான வழி இல்லாவிட்டால், அது UI-யின் மீதியை block செய்வதைத் தடுக்க விரும்பினால் இது பயனுள்ளது.

ஒவ்வொரு keystroke-க்கும் re-render ஆகும் text field மற்றும் component (chart அல்லது நீண்ட list போன்றது) உங்களிடம் உள்ளது என்று கற்பனை செய்யுங்கள்:

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

முதலில், props அதேபோல் இருந்தால் re-render தவிர்க்க `SlowList`-ஐ optimize செய்யுங்கள். இதற்காக, [அதை `memo`-வில் wrap செய்யுங்கள்:](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

ஆனால், முந்தைய render போது இருந்ததைப் போலவே `SlowList` props *அதே* இருந்தால் மட்டுமே இது உதவும். இப்போது நீங்கள் எதிர்கொள்ளும் பிரச்சினை, அவை *வேறுபட்ட* போது, மேலும் உண்மையில் வேறு visual output காட்ட வேண்டியபோது அது மெதுவாக இருப்பதுதான்.

குறிப்பாக, முக்கிய performance பிரச்சினை என்னவெனில், input-இல் type செய்யும் ஒவ்வொரு முறையும் `SlowList` புதிய props பெறுகிறது; அதன் முழு tree re-render ஆகுவது typing-ஐ janky ஆக உணரச் செய்கிறது. இந்த case-இல், result list update செய்வதைவிட (மெதுவாக இருக்க அனுமதிக்கப்படுகிறது) input update செய்வதை (அது வேகமாக இருக்க வேண்டும்) prioritize செய்ய `useDeferredValue` அனுமதிக்கிறது:

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

இது `SlowList` re-rendering-ஐ வேகமாக்காது. ஆனால் list re-rendering-ஐ deprioritize செய்யலாம், அதனால் அது keystrokes-ஐ block செய்யாது என்று React-க்கு சொல்கிறது. List input-ஐவிட "lag behind" ஆகி பின்னர் "catch up" செய்யும். முன்பைப் போல, React list-ஐ முடிந்தவரை விரைவில் update செய்ய முயலும்; ஆனால் user typing-ஐ block செய்யாது.

<Recipes titleText="useDeferredValue மற்றும் optimize செய்யாத re-rendering இடையிலான வேறுபாடு" titleId="examples">

#### List-ன் deferred re-rendering {/*deferred-re-rendering-of-the-list*/}

இந்த example-இல், `SlowList` component-இல் உள்ள ஒவ்வொரு item-மும் **செயற்கையாக மெதுவாக்கப்பட்டுள்ளது**; இதனால் input responsive ஆக இருக்க `useDeferredValue` எப்படி உதவுகிறது என்பதைப் பார்க்கலாம். Input-இல் type செய்து, list அதை விட "lag behind" ஆக இருந்தாலும் typing snappy ஆக இருப்பதை கவனியுங்கள்.

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[செயற்கையாக மெதுவாக்கப்பட்டது] 250 <SlowItem /> render செய்கிறது');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      உரை: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### List-ன் optimize செய்யப்படாத re-rendering {/*unoptimized-re-rendering-of-the-list*/}

இந்த example-இல், `SlowList` component-இல் உள்ள ஒவ்வொரு item-மும் **செயற்கையாக மெதுவாக்கப்பட்டுள்ளது**, ஆனால் `useDeferredValue` இல்லை.

Input-இல் type செய்வது மிகவும் janky ஆக உணரப்படுவதை கவனியுங்கள். `useDeferredValue` இல்லாமல், ஒவ்வொரு keystroke-மும் முழு list-ஐ non-interruptible முறையில் உடனடியாக re-render செய்ய force செய்கிறது என்பதால்தான் இது நடக்கிறது.

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[செயற்கையாக மெதுவாக்கப்பட்டது] 250 <SlowItem /> render செய்கிறது');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      உரை: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

இந்த optimization-க்கு `SlowList` [`memo`](/reference/react/memo)-வில் wrap செய்யப்பட்டிருக்க வேண்டும். ஏனெனில் `text` மாறும் ஒவ்வொரு முறையும், parent component-ஐ React விரைவாக re-render செய்ய முடியும். அந்த re-render போது, `deferredText` இன்னும் அதன் previous value-ஐ வைத்திருக்கும், எனவே `SlowList` re-rendering-ஐ skip செய்ய முடியும் (அதன் props மாறவில்லை). [`memo`](/reference/react/memo) இல்லையெனில், அது எப்படியும் re-render ஆக வேண்டியிருக்கும்; optimization-ன் நோக்கம் தோல்வியடையும்.

</Pitfall>

<DeepDive>

#### Value defer செய்வது debouncing மற்றும் throttling-இலிருந்து எப்படி வேறுபடுகிறது? {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

இந்த scenario-வில் முன்பு பயன்படுத்தியிருக்கும் இரண்டு பொதுவான optimization techniques உள்ளன:

- *Debouncing* என்றால், list update செய்வதற்கு முன் user type செய்வதை நிறுத்தும் வரை (எ.கா. ஒரு second) காத்திருப்பீர்கள்.
- *Throttling* என்றால், அவ்வப்போது list update செய்வீர்கள் (எ.கா. அதிகபட்சம் ஒரு second-க்கு ஒருமுறை).

சில cases-இல் இந்த techniques பயனுள்ளவை என்றாலும், rendering optimize செய்ய `useDeferredValue` அதிகம் பொருத்தமானது; ஏனெனில் அது React உடன் ஆழமாக integrated ஆகி user-ன் device-க்கு ஏற்ப adapt ஆகிறது.

Debouncing அல்லது throttling போலல்லாமல், இது fixed delay ஒன்றைத் தேர்ந்தெடுக்க வேண்டியதில்லை. User-ன் device வேகமாக இருந்தால் (எ.கா. powerful laptop), deferred re-render கிட்டத்தட்ட உடனே நடக்கும்; கவனிக்கப்படாது. User-ன் device மெதுவாக இருந்தால், device எவ்வளவு மெதுவாக இருக்கிறதோ அதற்கேற்ப list input-ஐவிட "lag behind" ஆகும்.

மேலும், debouncing அல்லது throttling போல அல்லாமல், `useDeferredValue` மூலம் செய்யப்படும் deferred re-renders default ஆக interruptible. அதாவது React பெரிய list ஒன்றை re-render செய்து கொண்டிருக்கும்போது user மற்றொரு keystroke செய்தால், React அந்த re-render-ஐ கைவிட்டு, keystroke-ஐ handle செய்து, பின்னர் background-இல் மீண்டும் rendering தொடங்கும். இதற்கு மாறாக, debouncing மற்றும் throttling இன்னும் janky experience தரும்; ஏனெனில் அவை *blocking:* rendering keystroke-ஐ block செய்யும் தருணத்தை மட்டும் postpone செய்கின்றன.

நீங்கள் optimize செய்கிற work rendering போது நடக்கவில்லை என்றால், debouncing மற்றும் throttling இன்னும் பயனுள்ளவை. உதாரணமாக, குறைவான network requests fire செய்ய அவை உதவும். இந்த techniques-ஐ ஒன்றாகவும் பயன்படுத்தலாம்.

</DeepDive>
