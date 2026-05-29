---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` interactive அல்லாத React tree-ஐ HTML string ஆக render செய்கிறது.

```js
const html = renderToStaticMarkup(reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `renderToStaticMarkup(reactNode, options?)` {/*rendertostaticmarkup*/}

Server-இல், உங்கள் app-ஐ HTML ஆக render செய்ய `renderToStaticMarkup`-ஐ அழைக்கவும்.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

இது உங்கள் React components-க்கான interactive அல்லாத HTML output-ஐ உருவாக்கும்.

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: HTML ஆக render செய்ய விரும்பும் React node. உதாரணமாக, `<Page />` போன்ற JSX node.
* **optional** `options`: Server render-க்கான object.
  * **optional** `identifierPrefix`: [`useId`](/reference/react/useId) மூலம் உருவாக்கப்படும் ID-களுக்கு React பயன்படுத்தும் string prefix. ஒரே பக்கத்தில் பல roots பயன்படுத்தும்போது conflicts தவிர்க்க உதவும்.

#### Returns {/*returns*/}

ஒரு HTML string.

#### Caveats {/*caveats*/}

* `renderToStaticMarkup` output-ஐ hydrate செய்ய முடியாது.

* `renderToStaticMarkup`-க்கு வரம்புடைய Suspense ஆதரவு உள்ளது. ஒரு component suspend செய்தால், `renderToStaticMarkup` உடனே அதன் fallback-ஐ HTML ஆக அனுப்பும்.

* `renderToStaticMarkup` browser-இல் வேலை செய்கிறது, ஆனால் client code-இல் அதை பயன்படுத்த பரிந்துரைக்கப்படவில்லை. Browser-இல் component ஒன்றை HTML ஆக render செய்ய வேண்டுமெனில், [அதை DOM node ஒன்றுக்குள் render செய்து HTML-ஐப் பெறுங்கள்.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Usage {/*usage*/}

### Interactive அல்லாத React tree-ஐ HTML string ஆக render செய்தல் {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

உங்கள் server response-உடன் அனுப்பக்கூடிய HTML string ஆக app-ஐ render செய்ய `renderToStaticMarkup`-ஐ அழைக்கவும்:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// Route handler syntax உங்கள் backend framework-ஐப் பொறுத்தது
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

இது உங்கள் React components-க்கான தொடக்க interactive அல்லாத HTML output-ஐ உருவாக்கும்.

<Pitfall>

இந்த method **hydrate செய்ய முடியாத interactive அல்லாத HTML**-ஐ render செய்கிறது. React-ஐ ஒரு நேரடியான static page generator ஆகப் பயன்படுத்த விரும்பினால், அல்லது emails போன்ற முற்றிலும் static content-ஐ render செய்கிறீர்கள் என்றால் இது பயனுள்ளதாக இருக்கும்.

Interactive apps server-இல் [`renderToString`](/reference/react-dom/server/renderToString)-ஐயும் client-இல் [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐயும் பயன்படுத்த வேண்டும்.

</Pitfall>
