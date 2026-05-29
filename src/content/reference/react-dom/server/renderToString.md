---
title: renderToString
---

<Pitfall>

`renderToString` streaming அல்லது data-க்காக காத்திருப்பதை support செய்யாது. [மாற்று வழிகளைப் பார்க்கவும்.](#alternatives)

</Pitfall>

<Intro>

`renderToString` ஒரு React tree-ஐ HTML string ஆக render செய்கிறது.

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

Server-இல், உங்கள் app-ஐ HTML ஆக render செய்ய `renderToString`-ஐ call செய்யுங்கள்.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Client-இல், server-generated HTML-ஐ interactive ஆக்க [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐ call செய்யுங்கள்.

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: HTML ஆக render செய்ய வேண்டிய React node. உதாரணமாக `<App />` போன்ற JSX node.

* **optional** `options`: Server render-க்கான object.
  * **optional** `identifierPrefix`: [`useId`](/reference/react/useId) உருவாக்கும் IDs-க்கு React பயன்படுத்தும் string prefix. ஒரே page-இல் பல roots பயன்படுத்தும்போது conflicts-ஐத் தவிர்க்க பயனுள்ளது. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters)-க்கு pass செய்யப்பட்ட அதே prefix ஆக இருக்க வேண்டும்.

#### Returns {/*returns*/}

ஒரு HTML string.

#### Caveats {/*caveats*/}

* `renderToString`-க்கு வரையறுக்கப்பட்ட Suspense support மட்டுமே உள்ளது. ஒரு component suspend ஆனால், `renderToString` உடனே அதன் fallback-ஐ HTML ஆக அனுப்பும்.

* `renderToString` browser-இல் வேலை செய்யும்; ஆனால் client code-இல் அதை பயன்படுத்துவது [பரிந்துரைக்கப்படவில்லை.](#removing-rendertostring-from-the-client-code)

---

## பயன்பாடு {/*usage*/}

### React tree-ஐ HTML string ஆக render செய்தல் {/*rendering-a-react-tree-as-html-to-a-string*/}

உங்கள் server response உடன் அனுப்பக்கூடிய HTML string ஆக app-ஐ render செய்ய `renderToString`-ஐ call செய்யுங்கள்:

```js {5-6}
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

இது உங்கள் React components-ன் ஆரம்ப non-interactive HTML output-ஐ உருவாக்கும். Client-இல், அந்த server-generated HTML-ஐ *hydrate* செய்து interactive ஆக்க [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐ call செய்ய வேண்டும்.


<Pitfall>

`renderToString` streaming அல்லது data-க்காக காத்திருப்பதை support செய்யாது. [மாற்று வழிகளைப் பார்க்கவும்.](#alternatives)

</Pitfall>

---

## மாற்று வழிகள் {/*alternatives*/}

### Server-இல் `renderToString`-இலிருந்து streaming render-க்கு migration செய்தல் {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` உடனடியாக ஒரு string return செய்கிறது; ஆகவே content load ஆகும்போது அதை stream செய்வதை support செய்யாது.

சாத்தியமானபோது, இந்த முழு அம்சங்களைக் கொண்ட மாற்று வழிகளைப் பயன்படுத்த பரிந்துரைக்கிறோம்:

* நீங்கள் Node.js பயன்படுத்தினால், [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)-ஐப் பயன்படுத்துங்கள்.
* நீங்கள் Deno அல்லது [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) கொண்ட modern edge runtime பயன்படுத்தினால், [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)-ஐப் பயன்படுத்துங்கள்.

உங்கள் server environment streams-ஐ support செய்யவில்லை என்றால், `renderToString`-ஐத் தொடர்ந்து பயன்படுத்தலாம்.

---

### Server-இல் `renderToString`-இலிருந்து static prerender-க்கு migration செய்தல் {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` உடனடியாக ஒரு string return செய்கிறது; ஆகவே static HTML generation-க்காக data load ஆக காத்திருப்பதை support செய்யாது.

இந்த முழு அம்சங்களைக் கொண்ட மாற்று வழிகளைப் பயன்படுத்த பரிந்துரைக்கிறோம்:

* நீங்கள் Node.js பயன்படுத்தினால், [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)-ஐப் பயன்படுத்துங்கள்.
* நீங்கள் Deno அல்லது [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) கொண்ட modern edge runtime பயன்படுத்தினால், [`prerender`](/reference/react-dom/static/prerender)-ஐப் பயன்படுத்துங்கள்.

உங்கள் static site generation environment streams-ஐ support செய்யவில்லை என்றால், `renderToString`-ஐத் தொடர்ந்து பயன்படுத்தலாம்.

---

### Client code-இலிருந்து `renderToString`-ஐ அகற்றுதல் {/*removing-rendertostring-from-the-client-code*/}

சில சமயங்களில், ஒரு component-ஐ HTML ஆக மாற்ற client-இல் `renderToString` பயன்படுத்தப்படுகிறது.

```js {1-2}
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // உதாரணமாக, "<svg>...</svg>"
```

**Client-இல்** `react-dom/server` import செய்வது தேவையில்லாமல் bundle size-ஐ அதிகரிக்கும்; அதனைத் தவிர்க்க வேண்டும். Browser-இல் ஒரு component-ஐ HTML ஆக render செய்ய வேண்டுமெனில், [`createRoot`](/reference/react-dom/client/createRoot)-ஐப் பயன்படுத்தி DOM-இலிருந்து HTML-ஐ read செய்யுங்கள்:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // உதாரணமாக, "<svg>...</svg>"
```

[`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property-ஐ read செய்வதற்கு முன் DOM update ஆகியிருப்பதை உறுதிசெய்ய [`flushSync`](/reference/react-dom/flushSync) call அவசியம்.

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Component suspend ஆகும்போது HTML எப்போதும் fallback-ஐ கொண்டிருக்கும் {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` Suspense-ஐ முழுமையாக support செய்யாது.

ஏதாவது component suspend ஆனால் (எடுத்துக்காட்டாக, அது [`lazy`](/reference/react/lazy) மூலம் define செய்யப்பட்டிருப்பதால் அல்லது data fetch செய்வதால்), அதன் content resolve ஆக `renderToString` காத்திருக்காது. அதற்கு பதிலாக, `renderToString` அதற்கு மேலுள்ள அருகிலான [`<Suspense>`](/reference/react/Suspense) boundary-ஐ கண்டறிந்து, அதன் `fallback` prop-ஐ HTML-இல் render செய்யும். Client code load ஆகும் வரை content தோன்றாது.

இதைக் கையாள [பரிந்துரைக்கப்பட்ட streaming solutions](#alternatives)-இல் ஒன்றைப் பயன்படுத்துங்கள். Server side rendering-க்கு, server-இல் content resolve ஆகும் போது chunks ஆக stream செய்ய முடியும்; client code load ஆகும் முன்பே page படிப்படியாக நிரம்புவதை user பார்க்கலாம். Static site generation-க்கு, static HTML உருவாக்கும் முன் எல்லா content-உம் resolve ஆகும் வரை அவை காத்திருக்க முடியும்.
