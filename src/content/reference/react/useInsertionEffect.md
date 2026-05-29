---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` CSS-in-JS library authors-க்கானது. நீங்கள் CSS-in-JS library-யில் வேலை செய்து styles inject செய்ய ஒரு இடம் தேவைப்படவில்லை என்றால், அதன் பதிலாக உங்களுக்கு [`useEffect`](/reference/react/useEffect) அல்லது [`useLayoutEffect`](/reference/react/useLayoutEffect) தான் பெரும்பாலும் தேவைப்படும்.

</Pitfall>

<Intro>

எந்த layout Effects-உம் fire ஆகும் முன் DOM-இல் elements insert செய்ய `useInsertionEffect` அனுமதிக்கிறது.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Layout-ஐ read செய்ய வேண்டிய Effects fire ஆகும் முன் styles insert செய்ய `useInsertionEffect`-ஐ call செய்யுங்கள்:

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
  });
  return rule;
}
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `setup`: உங்கள் Effect logic உள்ள function. உங்கள் setup function விருப்பமாக ஒரு *cleanup* function-ஐயும் return செய்யலாம். உங்கள் component DOM-இல் சேர்க்கப்பட்ட பிறகு, ஆனால் எந்த layout Effects-உம் fire ஆகும் முன், React உங்கள் setup function-ஐ run செய்யும். Dependencies மாறிய ஒவ்வொரு re-render-க்கும் பிறகு, React முதலில் பழைய values உடன் cleanup function-ஐ (நீங்கள் வழங்கியிருந்தால்) run செய்து, பின்னர் புதிய values உடன் உங்கள் setup function-ஐ run செய்யும். உங்கள் component DOM-இலிருந்து அகற்றப்படும்போது, React உங்கள் cleanup function-ஐ run செய்யும்.

* **optional** `dependencies`: `setup` code-க்குள் reference செய்யப்படும் அனைத்து reactive values-ன் பட்டியல். Reactive values-ல் props, state, மற்றும் உங்கள் component body-க்குள் நேரடியாக declare செய்யப்பட்ட அனைத்து variables மற்றும் functions அடங்கும். உங்கள் linter [React-க்காக configure செய்யப்பட்டிருந்தால்](/learn/editor-setup#linting), ஒவ்வொரு reactive value-உம் dependency ஆக சரியாக குறிப்பிடப்பட்டுள்ளதா என்பதை அது verify செய்யும். Dependencies பட்டியல் நிலையான எண்ணிக்கையிலான items கொண்டிருக்க வேண்டும், மேலும் `[dep1, dep2, dep3]` போல inline-ஆக எழுதப்பட வேண்டும். React ஒவ்வொரு dependency-யையும் அதன் முந்தைய value-உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm மூலம் ஒப்பிடும். Dependencies-ஐ நீங்கள் குறிப்பிடவே இல்லை என்றால், component-ன் ஒவ்வொரு re-render-க்கும் பிறகு உங்கள் Effect மீண்டும் run ஆகும்.

#### Returns {/*returns*/}

`useInsertionEffect` `undefined` return செய்கிறது.

#### எச்சரிக்கைகள் {/*caveats*/}

* Effects client-இல் மட்டுமே run ஆகும். Server rendering நேரத்தில் அவை run ஆகாது.
* `useInsertionEffect`-க்குள் இருந்து state-ஐ update செய்ய முடியாது.
* `useInsertionEffect` run ஆகும் நேரத்தில் refs இன்னும் attach செய்யப்படாமல் இருக்கும்.
* DOM update ஆகும் முன்போ பிறகோ `useInsertionEffect` run ஆகலாம். DOM குறிப்பிட்ட நேரத்தில் update ஆகிவிட்டதாக நம்பிக்கொண்டு code எழுதக்கூடாது.
* மற்ற Effect வகைகளில் ஒவ்வொரு Effect-க்கும் cleanup fire ஆகி, பின்னர் ஒவ்வொரு Effect-க்கும் setup fire ஆகும். ஆனால் `useInsertionEffect` cleanup மற்றும் setup இரண்டையும் ஒரே நேரத்தில் ஒரு component வீதம் fire செய்கிறது. இதனால் cleanup மற்றும் setup functions "interleaving" ஆகும்.
---

## பயன்பாடு {/*usage*/}

### CSS-in-JS libraries-இலிருந்து dynamic styles inject செய்தல் {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

வழக்கமாக, plain CSS பயன்படுத்தி React components-க்கு style கொடுப்பீர்கள்.

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

சில teams CSS files எழுதுவதற்குப் பதிலாக JavaScript code-க்குள் நேரடியாக styles எழுத விரும்புகின்றன. இதற்கு பொதுவாக CSS-in-JS library அல்லது tool தேவைப்படும். CSS-in-JS-க்கு மூன்று பொதுவான அணுகுமுறைகள் உள்ளன:

1. Compiler மூலம் CSS files-க்கு static extraction
2. Inline styles, எ.கா. `<div style={{ opacity: 1 }}>`
3. `<style>` tags-ன் runtime injection

நீங்கள் CSS-in-JS பயன்படுத்தினால், முதல் இரண்டு அணுகுமுறைகளின் சேர்க்கையை பரிந்துரைக்கிறோம் (static styles-க்கு CSS files, dynamic styles-க்கு inline styles). **இரண்டு காரணங்களுக்காக runtime `<style>` tag injection-ஐ பரிந்துரைக்கவில்லை:**

1. Runtime injection browser-ஐ styles-ஐ மிகவும் அடிக்கடி recalculate செய்ய வற்புறுத்துகிறது.
2. React lifecycle-இல் தவறான நேரத்தில் நடந்தால் runtime injection மிகவும் மெதுவாக இருக்கலாம்.

முதல் பிரச்சினையைத் தீர்க்க முடியாது; ஆனால் இரண்டாவது பிரச்சினையைத் தீர்க்க `useInsertionEffect` உதவுகிறது.

எந்த layout Effects-உம் fire ஆகும் முன் styles insert செய்ய `useInsertionEffect`-ஐ call செய்யுங்கள்:

```js {4-11}
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // But if you have to do it, then it's important to do in useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

`useEffect` போலவே, `useInsertionEffect` server-இல் run ஆகாது. Server-இல் எந்த CSS rules பயன்படுத்தப்பட்டுள்ளன என்பதை collect செய்ய வேண்டுமெனில், rendering நேரத்தில் அதைச் செய்யலாம்:

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[Runtime injection கொண்ட CSS-in-JS libraries-ஐ `useInsertionEffect`-க்கு upgrade செய்வது குறித்து மேலும் படிக்கவும்.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Rendering அல்லது useLayoutEffect நேரத்தில் styles inject செய்வதைவிட இது எப்படி சிறந்தது? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

Rendering நேரத்தில் styles insert செய்தால், மேலும் React ஒரு [non-blocking update-ஐ](/reference/react/useTransition#perform-non-blocking-updates-with-actions) process செய்து கொண்டிருந்தால், component tree render ஆகும் போது browser ஒவ்வொரு frame-இலும் styles-ஐ recalculate செய்யும்; இது **மிகவும் மெதுவாக** இருக்கலாம்.

[`useLayoutEffect`](/reference/react/useLayoutEffect) அல்லது [`useEffect`](/reference/react/useEffect) நேரத்தில் styles insert செய்வதைவிட `useInsertionEffect` சிறந்தது; ஏனெனில் உங்கள் components-இல் பிற Effects run ஆகும் நேரத்திற்குள் `<style>` tags ஏற்கனவே insert செய்யப்பட்டிருப்பதை இது உறுதிசெய்கிறது. இல்லையெனில் பழைய styles காரணமாக regular Effects-இல் layout calculations தவறாக இருக்கும்.

</DeepDive>
