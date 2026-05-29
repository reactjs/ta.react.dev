---
style: "<style>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style), உங்கள் document-க்கு inline CSS stylesheets சேர்க்க உதவுகிறது.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<style>` {/*style*/}

உங்கள் document-க்கு inline styles சேர்க்க, [உலாவியில் உள்ளமைந்த `<style>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)-ஐ render செய்யுங்கள். எந்த component-இலிருந்தும் `<style>`-ஐ render செய்யலாம்; [சில நிலைகளில்](#special-rendering-behavior) React அதனுடன் தொடர்புடைய DOM element-ஐ document head-இல் வைத்து, ஒரே மாதிரியான styles-ஐ de-duplicate செய்யும்.

```js
<style>{` p { color: red; } `}</style>
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<style>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ ஆதரிக்கிறது.

* `children`: string, அவசியம். Stylesheet-இன் உள்ளடக்கம்.
* `precedence`: ஒரு string. Document `<head>`-இல் உள்ள பிறவற்றுடன் ஒப்பிடும்போது `<style>` DOM node-ஐ எங்கு rank செய்ய வேண்டும் என்பதை React-க்கு சொல்கிறது; இதுவே எந்த stylesheet மற்றொன்றை override செய்ய முடியும் என்பதை தீர்மானிக்கிறது. React முதலில் கண்டுபிடிக்கும் precedence values "lower" என்றும் பின்னர் கண்டுபிடிக்கும் precedence values "higher" என்றும் infer செய்யும். Style rules atomic ஆக இருப்பதால் பல style systems single precedence value பயன்படுத்தியும் நன்றாக வேலை செய்யும். ஒரே precedence கொண்ட stylesheets, அவை `<link>` ஆக இருந்தாலும் inline `<style>` tags ஆக இருந்தாலும் அல்லது [`preinit`](/reference/react-dom/preinit) functions மூலம் load செய்யப்பட்டாலும் ஒன்றாக சேரும்.
* `href`: ஒரு string. அதே `href` கொண்ட styles-ஐ React [de-duplicate செய்ய](#special-rendering-behavior) அனுமதிக்கிறது.
* `media`: ஒரு string. Stylesheet-ஐ குறிப்பிட்ட [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)-க்கு மட்டுப்படுத்துகிறது.
* `nonce`: ஒரு string. கடுமையான Content Security Policy பயன்படுத்தும்போது [resource-ஐ அனுமதிக்க cryptographic nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).
* `title`: ஒரு string. [Alternative stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)-இன் பெயரை குறிப்பிடுகிறது.

React-உடன் பயன்படுத்த **பரிந்துரைக்கப்படாத** props:

* `blocking`: ஒரு string. `"render"` என்று அமைக்கப்பட்டால், stylesheet load ஆகும் வரை page-ஐ render செய்ய வேண்டாம் என்று browser-க்கு அறிவுறுத்தும். React, Suspense பயன்படுத்தி மேலும் fine-grained control வழங்குகிறது.

#### சிறப்பு rendering நடத்தை {/*special-rendering-behavior*/}

React `<style>` components-ஐ document-இன் `<head>`-க்கு நகர்த்தலாம், ஒரே மாதிரியான stylesheets-ஐ de-duplicate செய்யலாம், மேலும் stylesheet load ஆகும் போது [suspend](/reference/react/Suspense) செய்யலாம்.

இந்த நடத்தை opt in செய்ய, `href` மற்றும் `precedence` props வழங்குங்கள். ஒரே `href` இருந்தால் React styles-ஐ de-duplicate செய்யும். Document `<head>`-இல் உள்ள பிறவற்றுடன் ஒப்பிடும்போது `<style>` DOM node-ஐ எங்கு rank செய்ய வேண்டும் என்பதை `precedence` prop React-க்கு சொல்கிறது; இதுவே எந்த stylesheet மற்றொன்றை override செய்ய முடியும் என்பதை தீர்மானிக்கிறது.

இந்த சிறப்பு கையாளுதலுக்கு மூன்று caveats உள்ளன:

* Style render ஆன பிறகு props-க்கு செய்யப்படும் மாற்றங்களை React புறக்கணிக்கும். (இது நடந்தால் development-இல் React warning காட்டும்.)
* `precedence` prop பயன்படுத்தும்போது (`href` மற்றும் `precedence` தவிர) அனைத்து extraneous props-ஐ React drop செய்யும்.
* அதை render செய்த component unmount ஆன பிறகும் React style-ஐ DOM-இல் விட்டுவைக்கலாம்.

---

## Usage {/*usage*/}

### Inline CSS stylesheet render செய்தல் {/*rendering-an-inline-css-stylesheet*/}

ஒரு component சரியாகக் காட்டப்பட குறிப்பிட்ட CSS styles-ஐப் பொறுத்திருந்தால், அந்த component-க்குள் inline stylesheet ஒன்றை render செய்யலாம்.

`href` prop stylesheet-ஐ தனித்துவமாக அடையாளப்படுத்த வேண்டும்; ஏனெனில் அதே `href` கொண்ட stylesheets-ஐ React de-duplicate செய்யும்.
நீங்கள் `precedence` prop வழங்கினால், component tree-இல் இந்த values தோன்றும் வரிசையை அடிப்படையாகக் கொண்டு React inline stylesheets-ஐ reorder செய்யும்.

Inline stylesheets load ஆகும் போது Suspense boundaries-ஐ trigger செய்யாது.
அவை fonts அல்லது images போன்ற async resources-ஐ load செய்தாலும் கூட.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
