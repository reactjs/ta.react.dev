---
title: "<title>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title), document-இன் title-ஐ குறிப்பிட உதவுகிறது.

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<title>` {/*title*/}

Document-இன் title-ஐ குறிப்பிட, [உலாவியில் உள்ளமைந்த `<title>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)-ஐ render செய்யுங்கள். எந்த component-இலிருந்தும் `<title>`-ஐ render செய்யலாம்; React எப்போதும் அதனுடன் தொடர்புடைய DOM element-ஐ document head-இல் வைக்கும்.

```js
<title>My Blog</title>
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<title>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ ஆதரிக்கிறது.

* `children`: `<title>` child ஆக text மட்டுமே ஏற்கும். இந்த text document-இன் title ஆகும். Text மட்டும் render செய்யும் வரை, உங்கள் சொந்த components-ஐயும் pass செய்யலாம்.

#### சிறப்பு rendering நடத்தை {/*special-rendering-behavior*/}

React tree-இல் எங்கு render செய்யப்பட்டாலும், `<title>` component-க்கு தொடர்புடைய DOM element-ஐ React எப்போதும் document-இன் `<head>`-க்குள் வைக்கும். DOM-இல் `<title>` இருக்கக்கூடிய செல்லுபடியாகும் ஒரே இடம் `<head>` தான். இருந்தாலும், ஒரு குறிப்பிட்ட page-ஐ பிரதிநிதித்துவப்படுத்தும் component தன்னுடைய `<title>`-ஐ தானே render செய்ய முடிவது வசதியானதும் composable ஆக வைத்திருப்பதுமானது.

இதற்கு இரண்டு விதிவிலக்குகள் உள்ளன:
* `<title>` ஒரு `<svg>` component-க்குள் இருந்தால், சிறப்பு நடத்தை இல்லை. ஏனெனில் இந்த context-இல் அது document-இன் title-ஐ குறிக்கவில்லை; மாறாக அந்த SVG graphic-க்கான [accessibility annotation](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title) ஆகும்.
* `<title>`-க்கு [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop இருந்தால், சிறப்பு நடத்தை இல்லை. ஏனெனில் இந்த நிலையில் அது document-இன் title-ஐ குறிக்கவில்லை; மாறாக page-இன் குறிப்பிட்ட பகுதி பற்றிய metadata ஆகும்.

<Pitfall>

ஒரு நேரத்தில் ஒரு `<title>` மட்டும் render செய்யுங்கள். ஒரே நேரத்தில் ஒன்றுக்கு மேற்பட்ட components `<title>` tag-ஐ render செய்தால், அந்த titles அனைத்தையும் React document head-இல் வைக்கும். இப்படி நடந்தால், browsers மற்றும் search engines-இன் நடத்தை வரையறுக்கப்படவில்லை.

</Pitfall>

---

## Usage {/*usage*/}

### Document title அமைத்தல் {/*set-the-document-title*/}

Text-ஐ children ஆகக் கொண்டு எந்த component-இலிருந்தும் `<title>` component-ஐ render செய்யுங்கள். React document `<head>`-இல் `<title>` DOM node ஒன்றை வைக்கும்.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Title-இல் variables பயன்படுத்துதல் {/*use-variables-in-the-title*/}

`<title>` component-இன் children ஒரு single string text ஆக இருக்க வேண்டும். (அல்லது single number, அல்லது `toString` method கொண்ட single object ஆக இருக்கலாம்.) இது வெளிப்படையாகத் தெரியாமல் இருக்கலாம், ஆனால் இப்படி JSX curly braces பயன்படுத்துவது:

```js
<title>Results page {pageNumber}</title> // 🔴 பிரச்சினை: இது single string அல்ல
```

... உண்மையில் `<title>` component-க்கு இரண்டு element கொண்ட array-ஐ children ஆகத் தருகிறது (`"Results page"` string மற்றும் `pageNumber`-இன் value). இது error ஏற்படுத்தும். அதற்கு பதிலாக, `<title>`-க்கு single string pass செய்ய string interpolation-ஐப் பயன்படுத்துங்கள்:

```js
<title>{`Results page ${pageNumber}`}</title>
```
