---
meta: "<meta>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<meta>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta), document-க்கு metadata சேர்க்க உதவுகிறது.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<meta>` {/*meta*/}

Document metadata சேர்க்க, [உலாவியில் உள்ளமைந்த `<meta>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)-ஐ render செய்யுங்கள். எந்த component-இலிருந்தும் `<meta>`-ஐ render செய்யலாம்; React எப்போதும் அதனுடன் தொடர்புடைய DOM element-ஐ document head-இல் வைக்கும்.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<meta>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ ஆதரிக்கிறது.

இதில் பின்வரும் props-இல் *சரியாக ஒன்று* இருக்க வேண்டும்: `name`, `httpEquiv`, `charset`, `itemProp`. இவற்றில் எந்த prop குறிப்பிடப்படுகிறது என்பதைப் பொறுத்து `<meta>` component வேறுபட்ட செயலைச் செய்கிறது.

* `name`: ஒரு string. Document-க்கு இணைக்க வேண்டிய [metadata வகையை](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) குறிப்பிடுகிறது.
* `charset`: ஒரு string. Document பயன்படுத்தும் character set-ஐ குறிப்பிடுகிறது. செல்லுபடியாகும் ஒரே value `"utf-8"`.
* `httpEquiv`: ஒரு string. Document-ஐ process செய்யும் directive-ஐ குறிப்பிடுகிறது.
* `itemProp`: ஒரு string. முழு document-ஐப் பற்றி அல்லாமல், document-இல் உள்ள குறிப்பிட்ட item பற்றிய metadata-ஐ குறிப்பிடுகிறது.
* `content`: ஒரு string. `name` அல்லது `itemProp` props-உடன் பயன்படுத்தும்போது இணைக்க வேண்டிய metadata-ஐ, அல்லது `httpEquiv` prop-உடன் பயன்படுத்தும்போது directive-இன் நடத்தையை குறிப்பிடுகிறது.

#### சிறப்பு rendering நடத்தை {/*special-rendering-behavior*/}

React tree-இல் எங்கு render செய்யப்பட்டாலும், `<meta>` component-க்கு தொடர்புடைய DOM element-ஐ React எப்போதும் document-இன் `<head>`-க்குள் வைக்கும். DOM-இல் `<meta>` இருக்கக்கூடிய செல்லுபடியாகும் ஒரே இடம் `<head>` தான். இருந்தாலும், ஒரு குறிப்பிட்ட page-ஐ பிரதிநிதித்துவப்படுத்தும் component தன்னுடைய `<meta>` components-ஐ தானே render செய்ய முடிவது வசதியானதும் composable ஆக வைத்திருப்பதுமானது.

இதற்கு ஒரு விதிவிலக்கு உள்ளது: `<meta>`-க்கு [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop இருந்தால், சிறப்பு நடத்தை இல்லை. ஏனெனில் இந்த நிலையில் அது document பற்றிய metadata-ஐ குறிக்கவில்லை; மாறாக page-இன் குறிப்பிட்ட பகுதி பற்றிய metadata ஆகும்.

---

## Usage {/*usage*/}

### Document-ஐ metadata-உடன் annotate செய்தல் {/*annotating-the-document-with-metadata*/}

Keywords, summary, அல்லது author பெயர் போன்ற metadata-உடன் document-ஐ annotate செய்யலாம். React tree-இல் எங்கு render செய்யப்பட்டாலும், React இந்த metadata-ஐ document `<head>`-க்குள் வைக்கும்.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

எந்த component-இலிருந்தும் `<meta>` component-ஐ render செய்யலாம். React document `<head>`-இல் `<meta>` DOM node ஒன்றை வைக்கும்.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Document-இல் குறிப்பிட்ட items-ஐ metadata-உடன் annotate செய்தல் {/*annotating-specific-items-within-the-document-with-metadata*/}

Document-இல் குறிப்பிட்ட items-ஐ metadata-உடன் annotate செய்ய, `itemProp` prop-உடன் `<meta>` component-ஐப் பயன்படுத்தலாம். இந்த நிலையில், React இந்த annotations-ஐ document `<head>`-க்குள் வைக்காது; மற்ற React component போலவே அவற்றை வைக்கும்.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
