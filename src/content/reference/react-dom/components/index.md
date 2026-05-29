---
title: "React DOM Components"
---

<Intro>

உலாவியில் உள்ளமைந்த அனைத்து [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) மற்றும் [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) components-ஐ React support செய்கிறது.

</Intro>

---

## பொதுவான components {/*common-components*/}

உலாவியில் உள்ளமைந்த அனைத்து components சில props மற்றும் events-ஐ support செய்கின்றன.

* [பொதுவான components (எ.கா. `<div>`)](/reference/react-dom/components/common)

இதில் `ref` மற்றும் `dangerouslySetInnerHTML` போன்ற React-specific props அடங்கும்.

---

## Form components {/*form-components*/}

உலாவியில் உள்ளமைந்த இந்த components user input-ஐ ஏற்கின்றன:

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

இவை React-இல் சிறப்பு வாய்ந்தவை; ஏனெனில் `value` prop-ஐ இவற்றுக்கு pass செய்தால் அவை *[controlled](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)* ஆகும்.

---

## Resource மற்றும் metadata components {/*resource-and-metadata-components*/}

உலாவியில் உள்ளமைந்த இந்த components external resources load செய்யவோ document-ஐ metadata உடன் annotate செய்யவோ உதவுகின்றன:

* [`<link>`](/reference/react-dom/components/link)
* [`<meta>`](/reference/react-dom/components/meta)
* [`<script>`](/reference/react-dom/components/script)
* [`<style>`](/reference/react-dom/components/style)
* [`<title>`](/reference/react-dom/components/title)

இவை React-இல் சிறப்பு வாய்ந்தவை; ஏனெனில் React அவற்றை document head-இல் render செய்யவும், resources load ஆகும் போது suspend செய்யவும், குறிப்பிட்ட ஒவ்வொரு component-ன் reference page-இல் விவரிக்கப்பட்டுள்ள பிற behaviors-ஐ செயல்படுத்தவும் முடியும்.

---

## அனைத்து HTML components {/*all-html-components*/}

உலாவியில் உள்ளமைந்த அனைத்து HTML components-ஐ React support செய்கிறது. இதில் அடங்குபவை:

* [`<aside>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside)
* [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
* [`<b>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b)
* [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
* [`<bdi>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi)
* [`<bdo>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo)
* [`<blockquote>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote)
* [`<body>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body)
* [`<br>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br)
* [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
* [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
* [`<caption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption)
* [`<cite>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite)
* [`<code>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code)
* [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col)
* [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup)
* [`<data>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data)
* [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist)
* [`<dd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd)
* [`<del>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/del)
* [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
* [`<dfn>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn)
* [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
* [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)
* [`<dl>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)
* [`<dt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt)
* [`<em>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em)
* [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed)
* [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
* [`<figcaption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption)
* [`<figure>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
* [`<footer>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)
* [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
* [`<h1>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h1)
* [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
* [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header)
* [`<hgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup)
* [`<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)
* [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html)
* [`<i>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)
* [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
* [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
* [`<input>`](/reference/react-dom/components/input)
* [`<ins>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ins)
* [`<kbd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd)
* [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)
* [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend)
* [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
* [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* [`<main>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main)
* [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map)
* [`<mark>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark)
* [`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu)
* [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
* [`<meter>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter)
* [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
* [`<noscript>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript)
* [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)
* [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
* [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)
* [`<option>`](/reference/react-dom/components/option)
* [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)
* [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)
* [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
* [`<pre>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre)
* [`<progress>`](/reference/react-dom/components/progress)
* [`<q>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q)
* [`<rp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp)
* [`<rt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt)
* [`<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)
* [`<s>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s)
* [`<samp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section)
* [`<select>`](/reference/react-dom/components/select)
* [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
* [`<small>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small)
* [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
* [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span)
* [`<strong>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)
* [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)
* [`<sub>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub)
* [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary)
* [`<sup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup)
* [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
* [`<tbody>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody)
* [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td)
* [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
* [`<textarea>`](/reference/react-dom/components/textarea)
* [`<tfoot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot)
* [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th)
* [`<thead>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead)
* [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
* [`<tr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr)
* [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)
* [`<u>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u)
* [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)
* [`<var>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var)
* [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
* [`<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr)

<Note>

[DOM standard](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) போலவே, prop names-க்கு React `camelCase` convention-ஐப் பயன்படுத்துகிறது. உதாரணமாக, `tabindex`-க்கு பதிலாக `tabIndex` எழுதுவீர்கள். Existing HTML-ஐ JSX-ஆக மாற்ற [online converter](https://transform.tools/html-to-jsx) பயன்படுத்தலாம்.

</Note>

---

### Custom HTML elements {/*custom-html-elements*/}

`<my-element>` போல dash கொண்ட tag-ஐ render செய்தால், நீங்கள் [custom HTML element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) render செய்ய விரும்புகிறீர்கள் என்று React கருதும்.

உலாவியில் உள்ளமைந்த HTML element-ஐ [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) attribute உடன் render செய்தாலும், அது custom element ஆகவே நடத்தப்படும்.

#### Custom elements-இல் values set செய்தல் {/*attributes-vs-properties*/}

Custom elements-க்கு data pass செய்ய இரண்டு முறைகள் உள்ளன:

1. Attributes: Markup-இல் display ஆகும்; string values-க்கு மட்டுமே set செய்ய முடியும்
2. Properties: Markup-இல் display ஆகாது; arbitrary JavaScript values-க்கு set செய்ய முடியும்

Default-ஆக, JSX-இல் bound செய்யப்பட்ட values-ஐ React attributes ஆக pass செய்யும்:

```jsx
<my-element value="Hello, world!"></my-element>
```

Custom elements-க்கு pass செய்யப்படும் non-string JavaScript values default-ஆக serialize செய்யப்படும்:

```jsx
// Will be passed as `"1,2,3"` as the output of `[1,2,3].toString()`
<my-element value={[1,2,3]}></my-element>
```

ஆனால் construction நேரத்தில் class-இல் property name தோன்றினால், custom element-ன் அந்த property arbitrary values pass செய்யக்கூடியது என்று React அறிந்துகொள்ளும்:

<Sandpack>

```js src/index.js hidden
import {MyElement} from './MyElement.js';
import { createRoot } from 'react-dom/client';
import {App} from "./App.js";

customElements.define('my-element', MyElement);

const root = createRoot(document.getElementById('root'))
root.render(<App />);
```

```js src/MyElement.js active
export class MyElement extends HTMLElement {
  constructor() {
    super();
    // The value here will be overwritten by React
    // when initialized as an element
    this.value = undefined;
  }

  connectedCallback() {
    this.innerHTML = this.value.join(", ");
  }
}
```

```js src/App.js
export function App() {
  return <my-element value={[1,2,3]}></my-element>
}
```

</Sandpack>

#### Custom elements-இல் events கேட்குதல் {/*custom-element-events*/}

Custom elements பயன்படுத்தும்போது பொதுவான pattern: event ஏற்படும் போது call செய்ய function ஏற்குவதற்குப் பதிலாக அவை [`CustomEvent`s](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) dispatch செய்யலாம். JSX மூலம் event-க்கு bind செய்யும்போது `on` prefix பயன்படுத்தி இந்த events-ஐ listen செய்யலாம்.

<Sandpack>

```js src/index.js hidden
import {MyElement} from './MyElement.js';
import { createRoot } from 'react-dom/client';
import {App} from "./App.js";

customElements.define('my-element', MyElement);

const root = createRoot(document.getElementById('root'))
root.render(<App />);
```

```javascript src/MyElement.js
export class MyElement extends HTMLElement {
  constructor() {
    super();
    this.test = undefined;
    this.emitEvent = this._emitEvent.bind(this);
  }

  _emitEvent() {
    const event = new CustomEvent('speak', {
      detail: {
        message: 'Hello, world!',
      },
    });
    this.dispatchEvent(event);
  }

  connectedCallback() {
    this.el = document.createElement('button');
    this.el.innerText = 'Say hi';
    this.el.addEventListener('click', this.emitEvent);
    this.appendChild(this.el);
  }

  disconnectedCallback() {
    this.el.removeEventListener('click', this.emitEvent);
  }
}
```

```jsx src/App.js active
export function App() {
  return (
    <my-element
      onspeak={e => console.log(e.detail.message)}
    ></my-element>
  )
}
```

</Sandpack>

<Note>

Events case-sensitive; dash (`-`) support செய்கின்றன. Custom element events-ஐ listen செய்யும்போது event casing-ஐ preserve செய்து அனைத்து dashes-ஐயும் சேர்க்கவும்:

```jsx
// Listens for `say-hi` events
<my-element onsay-hi={console.log}></my-element>
// Listens for `sayHi` events
<my-element onsayHi={console.log}></my-element>
```

</Note>
---

## அனைத்து SVG components {/*all-svg-components*/}

உலாவியில் உள்ளமைந்த அனைத்து SVG components-ஐ React support செய்கிறது. இதில் அடங்குபவை:

* [`<a>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/a)
* [`<animate>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate)
* [`<animateMotion>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion)
* [`<animateTransform>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateTransform)
* [`<circle>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle)
* [`<clipPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath)
* [`<defs>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs)
* [`<desc>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc)
* [`<discard>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/discard)
* [`<ellipse>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse)
* [`<feBlend>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feBlend)
* [`<feColorMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix)
* [`<feComponentTransfer>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComponentTransfer)
* [`<feComposite>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComposite)
* [`<feConvolveMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feConvolveMatrix)
* [`<feDiffuseLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDiffuseLighting)
* [`<feDisplacementMap>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
* [`<feDistantLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDistantLight)
* [`<feDropShadow>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow)
* [`<feFlood>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFlood)
* [`<feFuncA>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncA)
* [`<feFuncB>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncB)
* [`<feFuncG>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncG)
* [`<feFuncR>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncR)
* [`<feGaussianBlur>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur)
* [`<feImage>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feImage)
* [`<feMerge>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMerge)
* [`<feMergeNode>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMergeNode)
* [`<feMorphology>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMorphology)
* [`<feOffset>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feOffset)
* [`<fePointLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/fePointLight)
* [`<feSpecularLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpecularLighting)
* [`<feSpotLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpotLight)
* [`<feTile>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTile)
* [`<feTurbulence>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
* [`<filter>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter)
* [`<foreignObject>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject)
* [`<g>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g)
* `<hatch>`
* `<hatchpath>`
* [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image)
* [`<line>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line)
* [`<linearGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient)
* [`<marker>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker)
* [`<mask>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mask)
* [`<metadata>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/metadata)
* [`<mpath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mpath)
* [`<path>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path)
* [`<pattern>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/pattern)
* [`<polygon>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon)
* [`<polyline>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline)
* [`<radialGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient)
* [`<rect>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/script)
* [`<set>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/set)
* [`<stop>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop)
* [`<style>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style)
* [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg)
* [`<switch>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/switch)
* [`<symbol>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol)
* [`<text>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text)
* [`<textPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/textPath)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)
* [`<tspan>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan)
* [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)
* [`<view>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/view)

<Note>

[DOM standard](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) போலவே, prop names-க்கு React `camelCase` convention-ஐப் பயன்படுத்துகிறது. உதாரணமாக, `tabindex`-க்கு பதிலாக `tabIndex` எழுதுவீர்கள். Existing SVG-ஐ JSX-ஆக மாற்ற [online converter](https://transform.tools/) பயன்படுத்தலாம்.

Namespaced attributes-ஐயும் colon இல்லாமல் எழுத வேண்டும்:

* `xlink:actuate` என்பது `xlinkActuate` ஆகும்.
* `xlink:arcrole` என்பது `xlinkArcrole` ஆகும்.
* `xlink:href` என்பது `xlinkHref` ஆகும்.
* `xlink:role` என்பது `xlinkRole` ஆகும்.
* `xlink:show` என்பது `xlinkShow` ஆகும்.
* `xlink:title` என்பது `xlinkTitle` ஆகும்.
* `xlink:type` என்பது `xlinkType` ஆகும்.
* `xml:base` என்பது `xmlBase` ஆகும்.
* `xml:lang` என்பது `xmlLang` ஆகும்.
* `xml:space` என்பது `xmlSpace` ஆகும்.
* `xmlns:xlink` என்பது `xmlnsXlink` ஆகும்.

</Note>
