---
link: "<link>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), stylesheets போன்ற external resources பயன்படுத்தவோ document-ஐ link metadata-வுடன் annotate செய்யவோ உதவுகிறது.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `<link>` {/*link*/}

Stylesheets, fonts, மற்றும் icons போன்ற external resources-க்கு link செய்யவோ document-ஐ link metadata-வுடன் annotate செய்யவோ, [உலாவியில் உள்ளமைந்த `<link>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)-ஐ render செய்யுங்கள். எந்த component-இலிருந்தும் `<link>` render செய்யலாம்; React [பெரும்பாலான சூழல்களில்](#special-rendering-behavior) தொடர்புடைய DOM element-ஐ document head-இல் வைக்கும்.

```js
<link rel="icon" href="favicon.ico" />
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<link>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ support செய்கிறது.

* `rel`: ஒரு string, required. [Resource-க்கு உள்ள relationship](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)-ஐ குறிப்பிடுகிறது. React மற்ற links-ஐ விட [`rel="stylesheet"` கொண்ட links-ஐ வேறுபட்டு கையாளுகிறது](#special-rendering-behavior).

`rel="stylesheet"` என்றால் இந்த props பொருந்தும்:

* `precedence`: ஒரு string. Document `<head>`-இல் உள்ள பிறவற்றுடன் ஒப்பிடும்போது `<link>` DOM node-ஐ எங்கு rank செய்ய வேண்டும் என்பதை React-க்கு சொல்கிறது; இதனால் எந்த stylesheet மற்றொன்றை override செய்ய முடியும் என்பது தீர்மானிக்கப்படும். React முதலில் கண்டுபிடிக்கும் precedence values "lower", பின்னர் கண்டுபிடிக்கும் values "higher" என்று infer செய்யும். பல style systems single precedence value-யுடன் நன்றாக வேலை செய்யும்; ஏனெனில் style rules atomic. அதே precedence கொண்ட stylesheets `<link>` ஆக இருந்தாலும் inline `<style>` tags ஆக இருந்தாலும் அல்லது [`preinit`](/reference/react-dom/preinit) functions மூலம் loaded ஆனாலும் ஒன்றாக group செய்யப்படும்.
* `media`: ஒரு string. Stylesheet-ஐ குறிப்பிட்ட [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)-க்கு restrict செய்கிறது.
* `title`: ஒரு string. [Alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)-ன் பெயரை குறிப்பிடுகிறது.

`rel="stylesheet"` என்றாலும் React-ன் [stylesheets-க்கான சிறப்பு கையாளுதலை](#special-rendering-behavior) disable செய்யும் props:

* `disabled`: ஒரு boolean. Stylesheet-ஐ disable செய்கிறது.
* `onError`: ஒரு function. Stylesheet load ஆகத் தவறும்போது call செய்யப்படும்.
* `onLoad`: ஒரு function. Stylesheet load ஆகி முடிந்ததும் call செய்யப்படும்.

`rel="preload"` அல்லது `rel="modulepreload"` என்றால் இந்த props பொருந்தும்:

* `as`: ஒரு string. Resource-ன் வகை. சாத்தியமான values: `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
* `imageSrcSet`: ஒரு string. `as="image"` என்றால் மட்டும் பொருந்தும். [Image-ன் source set](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)-ஐ குறிப்பிடுகிறது.
* `imageSizes`: ஒரு string. `as="image"` என்றால் மட்டும் பொருந்தும். [Image-ன் sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)-ஐ குறிப்பிடுகிறது.

`rel="icon"` அல்லது `rel="apple-touch-icon"` என்றால் இந்த props பொருந்தும்:

* `sizes`: ஒரு string. [Icon-ன் sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

எல்லா சூழல்களிலும் இந்த props பொருந்தும்:

* `href`: ஒரு string. Linked resource-ன் URL.
*  `crossOrigin`: ஒரு string. பயன்படுத்த வேண்டிய [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin). சாத்தியமான values `anonymous` மற்றும் `use-credentials`. `as` `"fetch"` ஆக அமைக்கப்பட்டால் இது தேவைப்படும்.
*  `referrerPolicy`: ஒரு string. Fetch செய்யும்போது அனுப்ப வேண்டிய [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy). சாத்தியமான values `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, மற்றும் `unsafe-url`.
* `fetchPriority`: ஒரு string. Resource fetch செய்ய relative priority-ஐ suggest செய்கிறது. சாத்தியமான values `auto` (default), `high`, மற்றும் `low`.
* `hrefLang`: ஒரு string. Linked resource-ன் மொழி.
* `integrity`: ஒரு string. Resource-ன் authenticity-ஐ [verify செய்ய](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) பயன்படும் cryptographic hash.
* `type`: ஒரு string. Linked resource-ன் MIME type.

React உடன் பயன்படுத்த **பரிந்துரைக்கப்படாத** props:

* `blocking`: ஒரு string. `"render"` ஆக set செய்தால், stylesheet load ஆகும் வரை page-ஐ render செய்ய வேண்டாம் என்று browser-க்கு அறிவுறுத்தும். React Suspense மூலம் இன்னும் fine-grained control வழங்குகிறது.

#### சிறப்பு rendering behavior {/*special-rendering-behavior*/}

React tree-இல் எங்கு render செய்யப்பட்டாலும், `<link>` component-க்கு தொடர்புடைய DOM element-ஐ React எப்போதும் document-ன் `<head>`-க்குள் வைக்கும். DOM-இல் `<link>` இருக்கச் செல்லுபடியான ஒரே இடம் `<head>` தான்; இருந்தாலும், குறிப்பிட்ட page-ஐ represent செய்யும் component தானே `<link>` components render செய்ய முடிவது வசதியானது மற்றும் composable ஆக வைத்திருக்கிறது.

இதற்கு சில விதிவிலக்குகள் உள்ளன:

* `<link>`-க்கு `rel="stylesheet"` prop இருந்தால், இந்த சிறப்பு behavior கிடைக்க அதற்கு `precedence` prop-உம் இருக்க வேண்டும். ஏனெனில் document-இல் stylesheets-ன் order முக்கியமானது; இந்த stylesheet-ஐ பிறவற்றுடன் ஒப்பிடும்போது எப்படி order செய்ய வேண்டும் என்பதை React அறிய வேண்டும்; அதை `precedence` prop மூலம் குறிப்பிடுகிறீர்கள். `precedence` prop விடப்பட்டால், சிறப்பு behavior இல்லை.
* `<link>`-க்கு [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop இருந்தால், சிறப்பு behavior இல்லை; ஏனெனில் இந்த சூழலில் அது document-க்கு பொருந்தாது, page-ன் குறிப்பிட்ட பகுதியை பற்றிய metadata-வை represent செய்கிறது.
* `<link>`-க்கு `onLoad` அல்லது `onError` prop இருந்தால், அந்த சூழலில் linked resource-ன் loading-ஐ உங்கள் React component-க்குள் manual-ஆக manage செய்கிறீர்கள்.

#### Stylesheets-க்கான சிறப்பு behavior {/*special-behavior-for-stylesheets*/}

மேலும், `<link>` stylesheet-க்கு என்றால் (அதாவது அதன் props-இல் `rel="stylesheet"` இருந்தால்), React அதை பின்வரும் வழிகளில் சிறப்பாக கையாளும்:

* Stylesheet load ஆகும் போது `<link>` render செய்யும் component [suspend](/reference/react/Suspense) ஆகும்.
* பல components அதே stylesheet-க்கு links render செய்தால், React அவற்றை de-duplicate செய்து DOM-இல் ஒரே link மட்டும் வைக்கும். இரண்டு links-க்கும் அதே `href` prop இருந்தால் அவை ஒரேதாக கருதப்படும்.

இந்த சிறப்பு behavior-க்கு இரண்டு விதிவிலக்குகள் உள்ளன:

* Link-க்கு `precedence` prop இல்லையெனில், சிறப்பு behavior இல்லை; ஏனெனில் document-இல் stylesheets-ன் order முக்கியமானது, மேலும் இந்த stylesheet-ஐ பிறவற்றுடன் ஒப்பிடும்போது எப்படி order செய்ய வேண்டும் என்பதை React அறிய வேண்டும்; அதை `precedence` prop மூலம் குறிப்பிடுகிறீர்கள்.
* `onLoad`, `onError`, அல்லது `disabled` props-இல் ஏதேனும் ஒன்றை வழங்கினால், சிறப்பு behavior இல்லை; ஏனெனில் stylesheet-ன் loading-ஐ component-க்குள் manual-ஆக manage செய்கிறீர்கள் என்பதை இந்த props காட்டுகின்றன.

இந்த சிறப்பு கையாளுதலுக்கு இரண்டு எச்சரிக்கைகள் உள்ளன:

* Link render ஆன பிறகு props-இல் வரும் மாற்றங்களை React புறக்கணிக்கும். (இது நடந்தால் development-இல் React warning வழங்கும்.)
* Link-ஐ render செய்த component unmount ஆன பிறகும் React link-ஐ DOM-இல் விட்டு விடலாம்.

---

## பயன்பாடு {/*usage*/}

### தொடர்புடைய resources-க்கு link செய்தல் {/*linking-to-related-resources*/}

Icon, canonical URL, அல்லது pingback போன்ற தொடர்புடைய resources-க்கு links மூலம் document-ஐ annotate செய்யலாம். React tree-இல் எங்கு render செய்யப்பட்டாலும், இந்த metadata-வை React document `<head>`-க்குள் வைக்கும்.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Stylesheet-க்கு link செய்தல் {/*linking-to-a-stylesheet*/}

ஒரு component சரியாக display ஆக குறிப்பிட்ட stylesheet-ஐ சார்ந்திருந்தால், அந்த component-க்குள் அந்த stylesheet-க்கு link render செய்யலாம். Stylesheet load ஆகும் போது உங்கள் component [suspend](/reference/react/Suspense) ஆகும். இந்த stylesheet-ஐ பிறவற்றுடன் ஒப்பிடும்போது எங்கு வைக்க வேண்டும் என்பதை React-க்கு சொல்லும் `precedence` prop-ஐ வழங்க வேண்டும். Higher precedence கொண்ட stylesheets, lower precedence கொண்டவற்றை override செய்ய முடியும்.

<Note>
ஒரு stylesheet பயன்படுத்த விரும்பும்போது, [preinit](/reference/react-dom/preinit) function-ஐ call செய்வது பயனுள்ளதாக இருக்கலாம். `<link>` component மட்டும் render செய்வதைவிட, இந்த function-ஐ call செய்வது browser stylesheet-ஐ முன்கூட்டியே fetch செய்யத் தொடங்க அனுமதிக்கலாம்; உதாரணமாக [HTTP Early Hints response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) அனுப்புவதன் மூலம்.
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Stylesheet precedence-ஐ கட்டுப்படுத்துதல் {/*controlling-stylesheet-precedence*/}

Stylesheets ஒன்றோடொன்று conflict ஆகலாம்; அப்போது document-இல் பின்னர் வரும் stylesheet-ஐ browser பயன்படுத்தும். `precedence` prop மூலம் stylesheets-ன் order-ஐ React-ல் கட்டுப்படுத்தலாம். இந்த உதாரணத்தில், மூன்று components stylesheets render செய்கின்றன; அதே precedence கொண்டவை `<head>`-இல் ஒன்றாக group செய்யப்படுகின்றன.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
}

```

</SandpackWithHTMLOutput>

`precedence` values தாமாகவே arbitrary; அவற்றின் பெயரிடல் உங்களிடம் உள்ளது. React முதலில் கண்டுபிடிக்கும் precedence values "lower", பின்னர் கண்டுபிடிக்கும் values "higher" என்று infer செய்யும்.

### Deduplicated stylesheet rendering {/*deduplicated-stylesheet-rendering*/}

பல components-இலிருந்து அதே stylesheet-ஐ render செய்தால், React document head-இல் ஒரே `<link>` மட்டும் வைக்கும்.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Document-க்குள் குறிப்பிட்ட items-ஐ links மூலம் annotate செய்தல் {/*annotating-specific-items-within-the-document-with-links*/}

Document-க்குள் குறிப்பிட்ட items-ஐ தொடர்புடைய resources-க்கு links மூலம் annotate செய்ய, `itemProp` prop உடன் `<link>` component-ஐப் பயன்படுத்தலாம். இந்த சூழலில், React இந்த annotations-ஐ document `<head>`-க்குள் வைக்காது; மற்ற React component போலவே வைக்கும்.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
