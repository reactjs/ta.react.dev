---
title: <Suspense>
---

<Intro>

`<Suspense>` அதன் children loading முடியும் வரை fallback ஒன்றைக் காட்ட அனுமதிக்கிறது.


```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `<Suspense>` {/*suspense*/}

#### Props {/*props*/}
<<<<<<< HEAD
* `children`: நீங்கள் render செய்ய நினைக்கும் உண்மையான UI. rendering நடக்கும் போது `children` suspend ஆனால், Suspense boundary `fallback`-ஐ render செய்வதற்கு மாறும்.
* `fallback`: உண்மையான UI loading முடிக்கவில்லை என்றால், அதன் இடத்தில் render செய்யப்படும் மாற்று UI. எந்த செல்லுபடியான React node-ஐயும் ஏற்கலாம்; நடைமுறையில் fallback என்பது loading spinner அல்லது skeleton போன்ற இலகுவான placeholder view ஆக இருக்கும். `children` suspend ஆகும்போது Suspense தானாகவே `fallback`-க்கு மாறி, data தயாரானதும் மீண்டும் `children`-க்கு திரும்பும். rendering நடக்கும் போது `fallback` suspend ஆனால், அது அருகிலுள்ள parent Suspense boundary-ஐ இயக்கும்.
=======
* `children`: The actual UI you intend to render. If `children` suspends while rendering, the Suspense boundary will switch to rendering `fallback`.
* `fallback`: An alternate UI to render in place of the actual UI if it has not finished loading. Any valid React node is accepted, though in practice, a fallback is a lightweight placeholder view, such as a loading spinner or skeleton. Suspense will automatically switch to `fallback` when `children` suspends, and back to `children` when the data is ready. If `fallback` suspends while rendering, it will activate the closest parent Suspense boundary.
* <ExperimentalBadge /> **optional** `defer`: A boolean. When `true`, React may show the `fallback` first and render or stream `children` later, even when nothing in them suspends. Use it for content that is expensive to render. Defaults to `false`.
>>>>>>> b011783fcc7a39da9eefd4274147a1444860a12b

#### கவனிக்க வேண்டியவை {/*caveats*/}

<<<<<<< HEAD
- முதல் முறையாக mount ஆகும் முன்பே suspend ஆன renders-க்காக React எந்த state-ஐயும் பாதுகாக்காது. component load ஆனதும், suspend ஆன tree-ஐ React ஆரம்பத்திலிருந்து மீண்டும் render செய்ய முயலும்.
- Suspense ஏற்கனவே tree-க்கான content-ஐக் காட்டிக் கொண்டிருந்தபோது அது மீண்டும் suspend ஆனால், அந்த update [`startTransition`](/reference/react/startTransition) அல்லது [`useDeferredValue`](/reference/react/useDeferredValue) மூலம் ஏற்பட்டதல்ல என்றால் `fallback` மீண்டும் காட்டப்படும்.
- மீண்டும் suspend ஆனதால் ஏற்கனவே தெரியும் content-ஐ React மறைக்க வேண்டியிருந்தால், content tree-இல் உள்ள [layout Effects](/reference/react/useLayoutEffect)-ஐ அது clean up செய்யும். content மீண்டும் காட்டத் தயாரானதும், React layout Effects-ஐ மீண்டும் fire செய்யும். இதனால் DOM layout-ஐ அளக்கும் Effects, content மறைக்கப்பட்டிருக்கும்போது அதைச் செய்ய முயலாது.
- React-இல் Suspense உடன் ஒருங்கிணைக்கப்பட்ட *Streaming Server Rendering* மற்றும் *Selective Hydration* போன்ற உள்ளக optimizations உள்ளன. மேலும் அறிய [architecture overview](https://github.com/reactwg/react-18/discussions/37)-ஐப் படித்து, [technical talk](https://www.youtube.com/watch?v=pj5N-Khihgc)-ஐப் பாருங்கள்.

---

## பயன்பாடு {/*usage*/}
=======
- Suspense does not detect when data is fetched inside an Effect or event handler. It only activates in the [cases listed below.](#what-activates-a-suspense-boundary)
- React does not preserve any state for renders that got suspended before they were able to mount for the first time. When the component has loaded, React will retry rendering the suspended tree from scratch.
- If Suspense was displaying content for the tree, but then it suspended again, the `fallback` will be shown again unless the update causing it was caused by [`startTransition`](/reference/react/startTransition) or [`useDeferredValue`](/reference/react/useDeferredValue).
- React reveals suspended content at most once every 300ms, measured from the last reveal. Boundaries that become ready within that window are [revealed together](/blog/2025/10/01/react-19-2#batching-suspense-boundaries-for-ssr) rather than one at a time.
- If React needs to hide the already visible content because it suspended again, it will clean up [layout Effects](/reference/react/useLayoutEffect) in the content tree. When the content is ready to be shown again, React will fire the layout Effects again. This ensures that Effects measuring the DOM layout don't try to do this while the content is hidden.
- React includes under-the-hood optimizations like *Streaming Server Rendering* and *Selective Hydration* that are integrated with Suspense. Read [an architectural overview](https://github.com/reactwg/react-18/discussions/37) and watch [a technical talk](https://www.youtube.com/watch?v=pj5N-Khihgc) to learn more.

---

### What activates a Suspense boundary {/*what-activates-a-suspense-boundary*/}

A Suspense boundary waits for its content to be ready before revealing it. Any of the following keeps a boundary from revealing its content:

- Lazy-loading component code with [`lazy`](/reference/react/lazy).
- Reading a Promise with [`use`](/reference/react/use), including data streamed from [Server Components](/reference/rsc/server-components) or loaded through a [Suspense-enabled framework](#suspense-enabled-frameworks).
- Loading a stylesheet rendered with [`<link rel="stylesheet">` and a `precedence` prop.](/reference/react-dom/components/link#special-rendering-behavior) React blocks the boundary until the stylesheet loads, up to a timeout. [See an example below.](#waiting-for-a-stylesheet-to-load)
- Waiting for a large boundary's HTML to arrive during streaming server rendering. Sending HTML takes time, so a boundary with enough content activates even when nothing in it suspends. React reveals the content as the HTML arrives.
- Loading fonts. Suspense doesn't wait for fonts by default, but a [`<ViewTransition>`](/reference/react/ViewTransition) update waits for new fonts to load, up to a timeout, so text doesn't flash with a fallback font. [See an example below.](#waiting-for-a-font-to-load)
- Loading images. Suspense doesn't wait for images by default, but during a [`<ViewTransition>`](/reference/react/ViewTransition) update, React blocks the boundary until the image loads, up to a timeout. Adding an `onLoad` handler opts a specific image out. [See an example below.](#waiting-for-an-image-to-load)
- <ExperimentalBadge /> Performing CPU-bound render work inside a [`<Suspense defer>`](#props) boundary.

<Note>

#### Suspense-enabled frameworks {/*suspense-enabled-frameworks*/}

A *Suspense-enabled framework* gives you a way to read data in your component in a way that activates the closest Suspense boundary. The exact way you load your data depends on your framework, and you'll find the details in its documentation. Under the hood, a Suspense-enabled framework maintains a cache of Promises and calls [`use`](/reference/react/use) to suspend on a Promise.

Without a framework, you can read a Promise with `use` directly, as long as the Promise is [cached so the same instance is reused across renders.](/reference/react/use#caching-promises-for-client-components)

</Note>

---

## Usage {/*usage*/}
>>>>>>> b011783fcc7a39da9eefd4274147a1444860a12b

### content loading ஆகும்போது fallback காட்டுதல் {/*displaying-a-fallback-while-content-is-loading*/}

உங்கள் application-ன் எந்த பகுதியையும் Suspense boundary-யால் wrap செய்யலாம்:

```js [[1, 1, "<Loading />"], [2, 2, "<Albums />"]]
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

<CodeStep step={2}>children</CodeStep>-க்கு தேவையான code மற்றும் data அனைத்தும் load ஆகும் வரை, React உங்கள் <CodeStep step={1}>loading fallback</CodeStep>-ஐக் காட்டும்.

கீழே உள்ள எடுத்துக்காட்டில், albums பட்டியலை fetch செய்யும் போது `Albums` component *suspend* ஆகிறது. அது render ஆகத் தயாராகும் வரை, React மேலுள்ள அருகிலுள்ள Suspense boundary-யை fallback-ஆகிய உங்கள் `Loading` component-ஐக் காட்டுமாறு மாற்றும். பின்னர் data load ஆனதும், React `Loading` fallback-ஐ மறைத்து, data உடன் `Albums` component-ஐ render செய்கிறது.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        The Beatles artist page-ஐ திற
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Albums artistId={artist.id} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

By contrast, code that fetches data outside of `use`, such as inside an Effect, does not activate the boundary:

<<<<<<< HEAD
**Suspense-enabled data sources மட்டுமே Suspense component-ஐ இயக்கும்.** அவற்றில் அடங்குபவை:

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) மற்றும் [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) போன்ற Suspense-enabled frameworks மூலம் data fetching
- [`lazy`](/reference/react/lazy) மூலம் component code-ஐ lazy-load செய்தல்
- [`use`](/reference/react/use) மூலம் cached Promise-ன் value-ஐ வாசித்தல்

ஒரு Effect அல்லது event handler-க்குள் data fetch செய்யப்படும்போது Suspense அதை கண்டறியாது.

மேலுள்ள `Albums` component-இல் data-ஐ நீங்கள் எப்படி load செய்வீர்கள் என்பது உங்கள் framework-ஐப் பொறுத்தது. Suspense-enabled framework ஒன்றைப் பயன்படுத்தினால், அதன் data fetching documentation-இல் விவரங்களைக் காணலாம்.

opinionated framework ஒன்றைப் பயன்படுத்தாமல் Suspense-enabled data fetching செய்வது இன்னும் ஆதரிக்கப்படவில்லை. Suspense-enabled data source ஒன்றை implement செய்வதற்கான தேவைகள் நிலையாகவும் documentation உடனும் இல்லை. data sources-ஐ Suspense உடன் ஒருங்கிணைக்க ஒரு official API React-ன் எதிர்கால பதிப்பில் வெளியிடப்படும்.
=======
<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        Open The Beatles artist page
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import EffectAlbums from './EffectAlbums.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <EffectAlbums artistId={artist.id} />
      </Suspense>
    </>
  );
}
>>>>>>> b011783fcc7a39da9eefd4274147a1444860a12b

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/EffectAlbums.js
import { useState, useEffect } from 'react';
import { fetchData } from './data.js';

export default function EffectAlbums({ artistId }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let active = true;
    fetchData(`/${artistId}/albums`).then(result => {
      if (active) {
        setAlbums(result);
      }
    });
    return () => {
      active = false;
    };
  }, [artistId]);

  // Suspense can't see this fetch, so its fallback never
  // shows. The list stays empty until the data arrives.
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

</Sandpack>

During streaming server rendering, a boundary also activates while its HTML is still streaming in. With any streaming server rendering API, React sends [the shell](/reference/react-dom/server/renderToPipeableStream#specifying-what-goes-into-the-shell) with the `fallback` first, then streams in each boundary's HTML and swaps out its `fallback` as that content arrives. Press "Render the page" to watch the page stream in:

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Streaming SSR</title>
</head>
<body>
  <button id="render">Render the page</button>
  <br /><br />
  <iframe id="container" style="width: 100%; height: 180px; border: 1px solid #aaa;"></iframe>
</body>
</html>
```

```js src/index.js
import { flushReadableStreamToFrame } from './demo-helpers.js';
import { Suspense, use } from 'react';
import { renderToReadableStream } from 'react-dom/server';

let posts = null;

function Posts() {
  const text = use(posts.promise);
  return <p>{text}</p>;
}

function ProfilePage() {
  return (
    <html>
      <body>
        <h1>Alice</h1>
        <p>Photographer and traveler.</p>
        <Suspense fallback={<p>⌛ Loading posts...</p>}>
          <Posts />
        </Suspense>
      </body>
    </html>
  );
}

async function main(frame) {
  posts = Promise.withResolvers();
  const stream = await renderToReadableStream(<ProfilePage />);

  // The posts resolve after the shell has streamed, so React
  // streams their HTML in and swaps out the fallback.
  setTimeout(() => {
    posts.resolve(
      'Just got back from two weeks along the coast. The drive ' +
      'was longer than expected, but every stop was worth it. ' +
      'A full write-up and more photos are coming soon.'
    );
  }, 1500);

  await flushReadableStreamToFrame(stream, frame);
}

document.getElementById('render').addEventListener('click', () => {
  main(document.getElementById('container'));
});
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

</Sandpack>

---

### content-ஐ ஒரே நேரத்தில் சேர்த்து வெளிப்படுத்துதல் {/*revealing-content-together-at-once*/}

இயல்பாக, Suspense-க்குள் உள்ள முழு tree-யும் ஒரே unit ஆக கருதப்படும். எடுத்துக்காட்டாக, இந்த components-இல் *ஒன்று மட்டுமே* data-க்காக காத்திருந்து suspend ஆனாலும், அவை *அனைத்தும்* சேர்ந்து loading indicator-ஆல் மாற்றப்படும்:

```js {2-5}
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

பின்னர் அவை அனைத்தும் காட்டத் தயாரானதும், அனைத்தும் ஒரே நேரத்தில் சேர்ந்து தோன்றும்.

கீழே உள்ள எடுத்துக்காட்டில், `Biography` மற்றும் `Albums` இரண்டும் சில data-ஐ fetch செய்கின்றன. ஆனால் அவை ஒரே Suspense boundary-க்குள் தொகுக்கப்பட்டிருப்பதால், இந்த components எப்போதும் ஒரே நேரத்தில் சேர்ந்து "pop in" ஆகும்.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        The Beatles artist page-ஐ திற
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<Loading />}>
        <Biography artistId={artist.id} />
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return `The Beatles 1960-இல் Liverpool-இல் உருவான ஆங்கில rock band ஆக இருந்தனர்;
    அதில் John Lennon, Paul McCartney, George Harrison
    மற்றும் Ringo Starr இருந்தனர்.`;
}

async function getAlbums() {
async function getAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
```

</Sandpack>

data load செய்யும் components, Suspense boundary-ன் நேரடி children ஆக இருக்க வேண்டிய அவசியமில்லை. எடுத்துக்காட்டாக, `Biography` மற்றும் `Albums`-ஐ புதிய `Details` component-க்குள் நகர்த்தலாம். இது behavior-ஐ மாற்றாது. `Biography` மற்றும் `Albums` ஒரே அருகிலுள்ள parent Suspense boundary-யைப் பகிர்வதால், அவற்றின் reveal சேர்த்து ஒருங்கிணைக்கப்படும்.

```js {2,8-11}
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

---

### nested content load ஆகும் போதே அதை வெளிப்படுத்துதல் {/*revealing-nested-content-as-it-loads*/}

ஒரு component suspend ஆகும்போது, அருகிலுள்ள parent Suspense component fallback-ஐக் காட்டும். இதனால் loading sequence ஒன்றை உருவாக்க பல Suspense components-ஐ nest செய்யலாம். அடுத்த நிலை content கிடைக்கத் தொடங்கும் போது, ஒவ்வொரு Suspense boundary-ன் fallback நிரப்பப்படும். எடுத்துக்காட்டாக, album பட்டியலுக்கே தனி fallback கொடுக்கலாம்:

```js {3,7}
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

இந்த மாற்றத்துடன், `Biography`-ஐக் காட்டுவதற்கு `Albums` load ஆக "காத்திருக்க" வேண்டியதில்லை.

sequence இதுவாக இருக்கும்:

1. `Biography` இன்னும் load ஆகவில்லை என்றால், முழு content area-வின் இடத்தில் `BigSpinner` காட்டப்படும்.
2. `Biography` loading முடித்ததும், `BigSpinner` content-ஆல் மாற்றப்படும்.
3. `Albums` இன்னும் load ஆகவில்லை என்றால், `Albums` மற்றும் அதன் parent `Panel` இடத்தில் `AlbumsGlimmer` காட்டப்படும்.
4. இறுதியாக, `Albums` loading முடித்ததும், அது `AlbumsGlimmer`-ஐ மாற்றும்.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ArtistPage from './ArtistPage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  } else {
    return (
      <button onClick={() => setShow(true)}>
        The Beatles artist page-ஐ திற
      </button>
    );
  }
}
```

```js src/ArtistPage.js active
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<BigSpinner />}>
        <Biography artistId={artist.id} />
        <Suspense fallback={<AlbumsGlimmer />}>
          <Panel>
            <Albums artistId={artist.id} />
          </Panel>
        </Suspense>
      </Suspense>
    </>
  );
}

function BigSpinner() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles 1960-இல் Liverpool-இல் உருவான ஆங்கில rock band ஆக இருந்தனர்;
    அதில் John Lennon, Paul McCartney, George Harrison
    மற்றும் Ringo Starr இருந்தனர்.`;
}

async function getAlbums() {
async function getAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

உங்கள் UI-யின் எந்த பகுதிகள் எப்போதும் ஒரே நேரத்தில் சேர்ந்து "pop in" ஆக வேண்டும், எந்த பகுதிகள் loading states-ன் sequence-இல் படிப்படியாக மேலும் content-ஐ வெளிப்படுத்த வேண்டும் என்பதை Suspense boundaries மூலம் ஒருங்கிணைக்கலாம். உங்கள் app-ன் மற்ற behavior-ஐ பாதிக்காமல் tree-இன் எந்த இடத்திலும் Suspense boundaries-ஐ சேர்க்கலாம், நகர்த்தலாம், அல்லது நீக்கலாம்.

ஒவ்வொரு component-ஐச் சுற்றியும் Suspense boundary வைக்க வேண்டாம். பயனர் அனுபவிக்க வேண்டும் என்று நீங்கள் நினைக்கும் loading sequence-ஐ விட Suspense boundaries அதிக granular ஆக இருக்கக்கூடாது. நீங்கள் designer உடன் பணிபுரிந்தால், loading states எங்கு வைக்கப்பட வேண்டும் என்று அவர்களிடம் கேளுங்கள்; அவர்கள் அதை ஏற்கனவே design wireframes-இல் சேர்த்திருக்க வாய்ப்பு உள்ளது.

---

### புதிய content loading ஆகும்போது பழைய content-ஐக் காட்டுதல் {/*showing-stale-content-while-fresh-content-is-loading*/}

இந்த எடுத்துக்காட்டில், search results-ஐ fetch செய்யும் போது `SearchResults` component suspend ஆகிறது. `"a"` என type செய்து, results வர காத்திருந்து, பின்னர் அதை `"ab"` ஆக மாற்றுங்கள். `"a"`-க்கான results loading fallback-ஆல் மாற்றப்படும்.

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        ஆல்பங்களைத் தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றுகிறது...</h2>}>
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
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
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

ஒரு பொதுவான மாற்று UI pattern என்பது பட்டியலை update செய்வதை *defer* செய்து, புதிய results தயாராகும் வரை முந்தைய results-ஐத் தொடர்ந்து காட்டுவது. [`useDeferredValue`](/reference/react/useDeferredValue) Hook query-ன் deferred version-ஐ கீழே pass செய்ய அனுமதிக்கிறது:

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        ஆல்பங்களைத் தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றுகிறது...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` உடனடியாக update ஆகும், எனவே input புதிய value-ஐக் காட்டும். ஆனால் data load ஆகும் வரை `deferredQuery` அதன் முந்தைய value-ஐ வைத்திருக்கும், எனவே `SearchResults` சிறிது நேரம் பழைய results-ஐக் காட்டும்.

பயனருக்கு இது தெளிவாகத் தெரிய, பழைய result list காட்டப்படும் போது ஒரு visual indication சேர்க்கலாம்:

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1
}}>
  <SearchResults query={deferredQuery} />
</div>
```

கீழே உள்ள எடுத்துக்காட்டில் `"a"` என உள்ளிட்டு, results load ஆக காத்திருந்து, பின்னர் input-ஐ `"ab"` ஆக மாற்றுங்கள். புதிய results load ஆகும் வரை Suspense fallback-க்கு பதிலாக மங்கலான பழைய result list தெரிகிறது என்பதை கவனியுங்கள்:


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
        ஆல்பங்களைத் தேடு:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>ஏற்றுகிறது...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
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
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
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

<Note>

deferred values மற்றும் [Transitions](#preventing-already-revealed-content-from-hiding) இரண்டும் inline indicators-ஐ முன்னிலைப்படுத்தி Suspense fallback காட்டப்படுவதைத் தவிர்க்க உதவும். Transitions முழு update-ஐ non-urgent எனக் குறிக்கும், எனவே அவை பொதுவாக frameworks மற்றும் router libraries மூலம் navigation-க்கு பயன்படுத்தப்படுகின்றன. மறுபுறம், UI-யின் ஒரு பகுதியை non-urgent எனக் குறித்து, அது UI-யின் மீதியை விட சிறிது "lag behind" ஆக இருக்க அனுமதிக்க வேண்டிய application code-இல் deferred values பெரும்பாலும் பயனுள்ளதாக இருக்கும்.

</Note>

---

### ஏற்கனவே வெளிப்பட்ட content மறைக்கப்படுவதைத் தடுக்குதல் {/*preventing-already-revealed-content-from-hiding*/}

ஒரு component suspend ஆகும்போது, அருகிலுள்ள parent Suspense boundary fallback-ஐக் காட்ட மாறும். அது ஏற்கனவே சில content-ஐக் காட்டிக் கொண்டிருந்தால், இது சீரற்ற user experience-ஐ உருவாக்கலாம். இந்த button-ஐ அழுத்திப் பாருங்கள்:

<Sandpack>

```js src/App.js
import { Suspense, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        இசை உலாவி
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles artist page-ஐ திற
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles 1960-இல் Liverpool-இல் உருவான ஆங்கில rock band ஆக இருந்தனர்;
    அதில் John Lennon, Paul McCartney, George Harrison
    மற்றும் Ringo Starr இருந்தனர்.`;
}

async function getAlbums() {
async function getAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

நீங்கள் button-ஐ அழுத்தியபோது, `Router` component `IndexPage`-க்கு பதிலாக `ArtistPage`-ஐ render செய்தது. `ArtistPage`-க்குள் உள்ள ஒரு component suspend ஆனதால், அருகிலுள்ள Suspense boundary fallback-ஐக் காட்டத் தொடங்கியது. அருகிலுள்ள Suspense boundary root-க்கு அருகில் இருந்ததால், முழு site layout `BigSpinner`-ஆல் மாற்றப்பட்டது.

இதைக் தடுக்க, [`startTransition`:](/reference/react/startTransition) மூலம் navigation state update-ஐ *Transition* ஆகக் குறிக்கலாம்:

```js {5,7}
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

state transition urgent அல்ல; ஏற்கனவே வெளிப்பட்ட content-ஐ மறைப்பதற்குப் பதிலாக முந்தைய page-ஐத் தொடர்ந்து காட்டுவது நல்லது என்று இது React-க்கு தெரிவிக்கிறது. இப்போது button-ஐ click செய்தால், `Biography` load ஆகும் வரை அது "காத்திருக்கும்":

<Sandpack>

```js src/App.js
import { Suspense, startTransition, useState } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout">
      <section className="header">
        இசை உலாவி
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles artist page-ஐ திற
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles 1960-இல் Liverpool-இல் உருவான ஆங்கில rock band ஆக இருந்தனர்;
    அதில் John Lennon, Paul McCartney, George Harrison
    மற்றும் Ringo Starr இருந்தனர்.`;
}

async function getAlbums() {
async function getAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

Transition *அனைத்து* content-மும் load ஆக காத்திருக்காது. ஏற்கனவே வெளிப்பட்ட content மறைக்கப்படுவதைத் தவிர்க்க தேவையான அளவு நேரம் மட்டுமே காத்திருக்கும். எடுத்துக்காட்டாக, website `Layout` ஏற்கனவே வெளிப்பட்டிருந்ததால், அதை loading spinner-க்கு பின்னால் மறைப்பது சரியாக இருக்காது. ஆனால் `Albums`-ஐச் சுற்றியுள்ள nested `Suspense` boundary புதியது, எனவே Transition அதற்காக காத்திருக்காது.

<Note>

Suspense-enabled routers இயல்பாகவே navigation updates-ஐ Transitions-க்குள் wrap செய்யும் என்று எதிர்பார்க்கப்படுகிறது.

</Note>

---

### Transition நடந்து கொண்டிருப்பதைச் சுட்டிக்காட்டுதல் {/*indicating-that-a-transition-is-happening*/}

மேலுள்ள எடுத்துக்காட்டில், button-ஐ click செய்த பிறகு navigation நடந்து கொண்டிருக்கிறது என்பதற்கான visual indication இல்லை. indicator ஒன்றைச் சேர்க்க, [`startTransition`](/reference/react/startTransition)-க்கு பதிலாக boolean `isPending` value-ஐ தரும் [`useTransition`](/reference/react/useTransition)-ஐப் பயன்படுத்தலாம். கீழே உள்ள எடுத்துக்காட்டில், Transition நடந்து கொண்டிருக்கும் போது website header styling-ஐ மாற்ற இது பயன்படுத்தப்படுகிறது:

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 ஏற்றுகிறது...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        இசை உலாவி
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      The Beatles artist page-ஐ திற
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('இன்னும் செயல்படுத்தப்படவில்லை');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles 1960-இல் Liverpool-இல் உருவான ஆங்கில rock band ஆக இருந்தனர்;
    அதில் John Lennon, Paul McCartney, George Harrison
    மற்றும் Ringo Starr இருந்தனர்.`;
}

async function getAlbums() {
async function getAlbums() {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

---

### navigation-இல் Suspense boundaries-ஐ reset செய்தல் {/*resetting-suspense-boundaries-on-navigation*/}

<<<<<<< HEAD
Transition நடக்கும் போது, ஏற்கனவே வெளிப்பட்ட content மறைக்கப்படுவதை React தவிர்க்கும். ஆனால் வேறு parameters உள்ள route-க்கு navigate செய்தால், அது *வேறு* content என்று React-க்கு தெரிவிக்க வேண்டியிருக்கலாம். இதை `key` மூலம் வெளிப்படுத்தலாம்:
=======
During a Transition, React avoids hiding already revealed content. However, when you navigate to *different* content, such as another user's profile, you'll want the boundary to show the fallback instead of the previous content. You can express this with a `key`:
>>>>>>> b011783fcc7a39da9eefd4274147a1444860a12b

```js
<ProfilePage key={queryParams.id} />
```

<<<<<<< HEAD
ஒரு பயனரின் profile page-க்குள் நீங்கள் navigate செய்கிறீர்கள், அப்போது ஏதாவது suspend ஆகிறது என்று கற்பனை செய்யுங்கள். அந்த update Transition-க்குள் wrap செய்யப்பட்டிருந்தால், ஏற்கனவே தெரியும் content-க்கு fallback-ஐ trigger செய்யாது. அதுதான் எதிர்பார்க்கப்படும் behavior.

ஆனால் இப்போது நீங்கள் இரண்டு வெவ்வேறு user profiles-க்கு இடையில் navigate செய்கிறீர்கள் என்று கற்பனை செய்யுங்கள். அப்படியானால் fallback-ஐக் காட்டுவது பொருத்தமானது. எடுத்துக்காட்டாக, ஒரு user-ன் timeline மற்றொரு user-ன் timeline-இலிருந்து *வேறு content* ஆகும். `key` குறிப்பிடுவதன் மூலம், வெவ்வேறு users-ன் profiles-ஐ React வெவ்வேறு components ஆக நடத்தி, navigation நடக்கும் போது Suspense boundaries-ஐ reset செய்வதை உறுதி செய்கிறீர்கள். Suspense-integrated routers இதை தானாகச் செய்ய வேண்டும்.
=======
With a different `key`, React treats the profiles as different content and resets the Suspense boundary during navigation. The `key` can go on the boundary itself or on a component above it. Suspense-integrated routers should do this automatically.

In the example below, opening the profile page loads the first profile. Pressing "Bob" navigates to a different profile, and the `key` resets the boundary, so the fallback shows instead of the previous user's bio. Try removing the `key`: the previous bio stays visible while the next one loads:

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ProfilePage from './ProfilePage.js';

export default function App() {
  const [show, setShow] = useState(false);
  if (show) {
    return <ProfilePage />;
  }
  return (
    <button onClick={() => setShow(true)}>
      Open profile page
    </button>
  );
}
```

```js src/ProfilePage.js active
import { Suspense, useState, startTransition } from 'react';
import Bio from './Bio.js';
import { fetchBio } from './data.js';

export default function ProfilePage() {
  const [user, setUser] = useState(() => ({
    id: 'alice',
    bioPromise: fetchBio('alice'),
  }));
  function navigate(id) {
    startTransition(() => {
      setUser({ id, bioPromise: fetchBio(id) });
    });
  }
  return (
    <>
      <button onClick={() => navigate('alice')}>
        Alice
      </button>
      <button onClick={() => navigate('bob')}>
        Bob
      </button>
      <Suspense key={user.id} fallback={<p>⌛ Loading profile...</p>}>
        <Bio bioPromise={user.bioPromise} />
      </Suspense>
    </>
  );
}
```

```js src/Bio.js
import { use } from 'react';

export default function Bio({ bioPromise }) {
  const bio = use(bioPromise);
  return <p>{bio}</p>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchBio(userId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  return userId === 'alice'
    ? 'Alice is a photographer and traveler.'
    : 'Bob collects vintage synthesizers.';
}
```

```css
button {
  margin-right: 8px;
}
```

</Sandpack>
>>>>>>> b011783fcc7a39da9eefd4274147a1444860a12b

---

### server errors மற்றும் client-only content-க்கு fallback வழங்குதல் {/*providing-a-fallback-for-server-errors-and-client-only-content*/}

நீங்கள் [streaming server rendering APIs](/reference/react-dom/server)-இல் ஒன்றையோ (அவற்றை நம்பியிருக்கும் framework ஒன்றையோ) பயன்படுத்தினால், server-இல் errors-ஐ handle செய்ய React உங்கள் `<Suspense>` boundaries-ஐயும் பயன்படுத்தும். ஒரு component server-இல் error throw செய்தால், React server render-ஐ abort செய்யாது. அதற்கு பதிலாக, மேலுள்ள அருகிலுள்ள `<Suspense>` component-ஐ கண்டுபிடித்து, அதன் fallback-ஐ (spinner போன்றது) உருவாக்கப்பட்ட server HTML-இல் சேர்க்கும். பயனர் முதலில் spinner-ஐப் பார்ப்பார்.

client-இல், அதே component-ஐ React மீண்டும் render செய்ய முயலும். அது client-இலும் error ஆனால், React error-ஐ throw செய்து, அருகிலுள்ள [Error Boundary](/reference/react/Component#static-getderivedstatefromerror)-ஐக் காட்டும். ஆனால் client-இல் error ஆகவில்லை என்றால், content இறுதியில் வெற்றிகரமாகக் காட்டப்பட்டதால் React அந்த error-ஐ பயனருக்கு காட்டாது.

சில components server-இல் render ஆகாமல் opt out செய்ய இதைப் பயன்படுத்தலாம். இதற்கு server environment-இல் error throw செய்து, பின்னர் அவற்றின் HTML-ஐ fallbacks-ஆல் மாற்ற `<Suspense>` boundary-க்குள் wrap செய்யவும்:

```js
<Suspense fallback={<Loading />}>
  <Chat />
</Suspense>

function Chat() {
  if (typeof window === 'undefined') {
    throw Error('Chat client-இல் மட்டுமே render செய்ய வேண்டும்.');
  }
  // ...
}
```

server HTML-இல் loading indicator இருக்கும். client-இல் அது `Chat` component-ஆல் மாற்றப்படும்.

---

### Providing a fallback for browser-only content {/*providing-a-fallback-for-browser-only-content*/}

A Suspense boundary can provide a fallback for a browser-only component. Wrap the component in `<Suspense>` and call [`use(browser())`](/reference/react/use#use-browser) inside it.

Click **Reload** to see the loading fallback in the initial HTML. After hydration, React displays the draft loaded from `localStorage`.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

During server rendering, React includes the Suspense boundary's fallback in the HTML. In the browser, React replaces the fallback with the saved draft.

---

### Waiting for a stylesheet to load {/*waiting-for-a-stylesheet-to-load*/}

A stylesheet rendered with [`<link rel="stylesheet">` and a `precedence` prop](/reference/react-dom/components/link#special-rendering-behavior) blocks the Suspense boundary until the stylesheet loads, up to a timeout, so the content doesn't appear unstyled.

In the example below, the `Card` component renders a stylesheet with `precedence`. Press "Show card": React shows the fallback until the stylesheet has loaded, and then reveals the card with its styles applied.

For comparison, the second button performs the same update without React, in a separate document. Nothing waits for the stylesheet, so the card's text appears in a fallback font first and then switches:

<Sandpack>

```js
import { Suspense, useState, startTransition } from 'react';
import { freshStylesheetUrl } from './styles.js';
import VanillaCard from './VanillaCard.js';

function Card({ href }) {
  return (
    <>
      <link rel="stylesheet" href={href} precedence="default" />
      <div className="fancy-card">This card uses a font from the stylesheet.</div>
    </>
  );
}

export default function App() {
  const [href, setHref] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setHref(freshStylesheetUrl());
          });
        }}>
        Show card
      </button>
      {href && (
        <Suspense fallback={<p>⌛ Loading styles...</p>}>
          <Card href={href} />
        </Suspense>
      )}
      <hr />
      <VanillaCard />
    </>
  );
}
```

```js src/VanillaCard.js
import { useRef } from 'react';
import { freshStylesheetUrl } from './styles.js';

export default function VanillaCard() {
  const ref = useRef(null);
  function show() {
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; }
        .fancy-card {
          padding: 20px;
          border-radius: 8px;
          color: white;
          font-family: 'Caveat', sans-serif;
          font-size: 24px;
          background: linear-gradient(135deg, #087ea4, #2b3491);
        }
      </style>
      <div class="fancy-card">This card uses a font from the stylesheet.</div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show card (without React)</button>
      <iframe ref={ref} title="Vanilla card" className="vanilla-frame" />
    </>
  );
}
```

```js src/styles.js hidden
// Add a unique parameter so the stylesheet isn't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}
```

```css
#root {
  min-height: 300px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.fancy-card {
  margin-top: 1em;
  padding: 20px;
  border-radius: 8px;
  color: white;
  font-family: 'Caveat', sans-serif;
  font-size: 24px;
  background: linear-gradient(135deg, #087ea4, #2b3491);
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 90px;
}
```

</Sandpack>

---

### Animating from Suspense content {/*animating-from-suspense-content*/}

Suspense composes with [`<ViewTransition>`](/reference/react/ViewTransition) to animate the swap from the fallback to the content. Wrap the boundary in a `<ViewTransition>`, and React treats the swap as an update, cross-fading between the fallback and the content by default:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

Where you place the `<ViewTransition>` relative to the boundary determines whether the fallback and content cross-fade as one update or animate as separate exit and enter animations. You can also [customize the animation](/reference/react/ViewTransition#customizing-animations) with View Transition classes.

[Learn more about animating from Suspense content.](/reference/react/ViewTransition#animating-from-suspense-content)

</Note>

---

### Waiting for a font to load {/*waiting-for-a-font-to-load*/}

When a [`<ViewTransition>`](/reference/react/ViewTransition) animates a Suspense boundary's reveal, React waits for new fonts the content introduces, up to a timeout, so the text doesn't flash with a fallback font. This only happens during a `<ViewTransition>` update.

In the example below, the Suspense boundary is wrapped in a `<ViewTransition>`, and the `Quote` component suspends while its data loads. Rendering the quote starts its font download. React keeps the fallback visible until the font has loaded, so the quote appears already in its font.

For comparison, the second button performs the same update without React. Nothing waits for the font, so the text appears in a fallback font first and then switches:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshFontUrl } from './font.js';
import VanillaQuote from './VanillaQuote.js';

function Quote({ fontSrc }) {
  const quote = use(fetchQuote());
  return (
    <>
      <style href={fontSrc} precedence="default">
        {`@font-face {
          font-family: 'Fancy';
          src: url(${fontSrc}) format('truetype');
          font-display: swap;
        }`}
      </style>
      <p className="quote fancy">{quote}</p>
    </>
  );
}

export default function App() {
  const [fontSrc, setFontSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setFontSrc(freshFontUrl());
          });
        }}>
        Show quote
      </button>
      {fontSrc && (
        <ViewTransition>
          <Suspense fallback={<p className="quote">⌛ Loading quote...</p>}>
            <Quote fontSrc={fontSrc} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaQuote />
    </>
  );
}
```

```js src/VanillaQuote.js
import { useRef } from 'react';
import { freshFontUrl } from './font.js';

export default function VanillaQuote() {
  const ref = useRef(null);
  function show() {
    const style = document.createElement('style');
    style.textContent = `@font-face {
      font-family: 'VanillaFancy';
      src: url(${freshFontUrl()}) format('truetype');
      font-display: swap;
    }`;
    document.head.appendChild(style);
    ref.current.innerHTML = `<p class="quote vanilla-fancy">The best way to predict the future is to invent it.</p>`;
  }
  return (
    <>
      <button onClick={show}>Show quote (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/font.js hidden
// Add a unique parameter so the font isn't cached,
// and every run shows the loading state.
export function freshFontUrl() {
  return (
    'https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/Caveat%5Bwght%5D.ttf' +
    '?t=' +
    Date.now()
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = null;

export function fetchQuote() {
  if (!cache) {
    cache = new Promise((resolve) => {
      // Add a fake delay to make waiting noticeable.
      setTimeout(() => {
        resolve(
          'The best way to predict the future is to invent it.'
        );
      }, 500);
    });
  }
  return cache;
}
```

```css
#root {
  min-height: 260px;
}
.quote {
  font-size: 20px;
  margin-top: 1em;
}
.fancy {
  font-family: 'Fancy', sans-serif;
}
.vanilla-fancy {
  font-family: 'VanillaFancy', sans-serif;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Waiting for an image to load {/*waiting-for-an-image-to-load*/}

When a [`<ViewTransition>`](/reference/react/ViewTransition) animates a Suspense boundary's reveal, React waits for visible images to load, up to a timeout, so the animation doesn't start with a half-loaded image. This only happens during a `<ViewTransition>` update. Adding an `onLoad` handler opts a specific image out, even inside a `<ViewTransition>`.

In the example below, the Suspense boundary is wrapped in a `<ViewTransition>` and shows a profile skeleton until the portrait has loaded.

For comparison, the second button performs the same update without React. Nothing waits for the image, so the card appears immediately and the image pops in when it loads:

<Sandpack>

```js
import { ViewTransition, Suspense, useState, startTransition } from 'react';
import { freshImageUrl } from './image.js';
import VanillaProfile from './VanillaProfile.js';

function Profile({ src }) {
  return (
    <div className="card">
      <img src={src} alt="Jack Pope" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [src, setSrc] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setSrc(freshImageUrl());
          });
        }}>
        Show profile
      </button>
      {src && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile src={src} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfile />
    </>
  );
}
```

```js src/VanillaProfile.js
import { useRef } from 'react';
import { freshImageUrl } from './image.js';

export default function VanillaProfile() {
  const ref = useRef(null);
  function show() {
    ref.current.innerHTML = `<div class="card">
      <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
      <p>Jack Pope</p>
    </div>`;
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <div ref={ref} />
    </>
  );
}
```

```js src/image.js hidden
// Add a unique parameter so the image isn't cached,
// and every run shows the loading state.
export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Coordinating fonts, images, and stylesheets {/*coordinating-fonts-images-and-stylesheets*/}

A Suspense boundary can wait for data, stylesheets, fonts, and images at once. Waiting for fonts and images only happens during a [`<ViewTransition>`](/reference/react/ViewTransition) update. In the example below, the `ProfileCard` component suspends while its data loads, and renders a stylesheet with `precedence`, text in a new font, and a portrait. React keeps the skeleton visible while the data and the stylesheet load. The `<ViewTransition>` reveal then waits for the font and the image, so the card appears complete.

For comparison, the version without React loads the same data and shows every resource arriving on its own schedule:

<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import VanillaProfileCard from './VanillaProfileCard.js';

function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

function ProfileCardPlaceholder() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>
      {resources && (
        <ViewTransition>
          <Suspense fallback={<ProfileCardPlaceholder />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <VanillaProfileCard />
    </>
  );
}
```

```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export default function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Add a unique parameter so the resources aren't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchQuote() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### update நடக்கும் போது UI fallback-ஆல் மாற்றப்படுவதை எப்படி தடுக்கலாம்? {/*preventing-unwanted-fallbacks*/}

தெரியும் UI-ஐ fallback-ஆல் மாற்றுவது சீரற்ற user experience-ஐ உருவாக்கும். ஒரு update component-ஐ suspend செய்யும்போது, அருகிலுள்ள Suspense boundary ஏற்கனவே பயனருக்கு content-ஐக் காட்டிக் கொண்டிருந்தால் இது நடக்கலாம்.

இது நடக்காமல் தடுக்க, [`startTransition` பயன்படுத்தி update-ஐ non-urgent எனக் குறியிடுங்கள்](#preventing-already-revealed-content-from-hiding). Transition நடக்கும் போது, தேவையற்ற fallback தோன்றுவதைத் தடுக்க போதுமான data load ஆகும் வரை React காத்திருக்கும்:

```js {2-3,5}
function handleNextPageClick() {
  // If this update suspends, don't hide the already displayed content
  startTransition(() => {
    setCurrentPage(currentPage + 1);
  });
}
```

இது ஏற்கனவே உள்ள content மறைக்கப்படுவதைத் தவிர்க்கும். ஆனால் புதிதாக render செய்யப்பட்ட எந்த `Suspense` boundaries-மும் UI-ஐ block செய்யாமல், content கிடைக்கும் போதே பயனர் பார்க்க அனுமதிக்க உடனடியாக fallbacks-ஐக் காட்டும்.

**non-urgent updates நடக்கும் போது மட்டுமே React தேவையற்ற fallbacks-ஐத் தடுக்கும்**. urgent update-ன் விளைவாக render வந்தால், React அதை தாமதப்படுத்தாது. [`startTransition`](/reference/react/startTransition) அல்லது [`useDeferredValue`](/reference/react/useDeferredValue) போன்ற API மூலம் நீங்கள் opt in செய்ய வேண்டும்.

உங்கள் router Suspense உடன் integrated ஆக இருந்தால், அது அதன் updates-ஐ தானாகவே [`startTransition`](/reference/react/startTransition)-க்குள் wrap செய்ய வேண்டும்.
