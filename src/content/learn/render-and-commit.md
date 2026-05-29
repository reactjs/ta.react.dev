---
title: Render மற்றும் Commit
---

<Intro>

உங்கள் components screen-இல் காட்டப்படுவதற்கு முன், அவை React மூலம் render செய்யப்பட வேண்டும். இந்த process-இல் உள்ள steps-ஐ புரிந்துகொள்வது, உங்கள் code எப்படி execute ஆகிறது என்பதையும் அதன் behavior-ஐ விளக்குவதையும் உதவும்.

</Intro>

<YouWillLearn>

* React-இல் rendering என்றால் என்ன
* React எப்போது, ஏன் ஒரு component-ஐ render செய்கிறது
* ஒரு component-ஐ screen-இல் காட்டும் steps
* Rendering எப்போதும் DOM update உருவாக்காதது ஏன்

</YouWillLearn>

உங்கள் components சமையலறையில் ingredients கொண்டு சுவையான உணவுகளை தயாரிக்கும் cooks என்று கற்பனை செய்யுங்கள். இந்த scenario-வில், React என்பது customers-இடமிருந்து requests எடுத்து, அவர்களுக்கான orders-ஐ கொண்டு சேர்க்கும் waiter. UI-ஐ request செய்து serve செய்யும் இந்த process-க்கு மூன்று steps உள்ளன:

1. Render-ஐ **trigger செய்தல்** (guest-ன் order-ஐ சமையலறைக்கு கொண்டு செல்வது)
2. Component-ஐ **render செய்தல்** (சமையலறையில் order-ஐ தயாரித்தல்)
3. DOM-க்கு **commit செய்தல்** (order-ஐ table-இல் வைப்பது)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="ஒரு உணவகத்தில் server ஆக React, users-இடமிருந்து orders-ஐ பெற்று Component Kitchen-க்கு கொண்டு செல்கிறது." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="Card Chef, React-க்கு புதிய Card component ஒன்றைக் கொடுக்கிறார்." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React, user-ன் table-க்கு Card-ஐ கொண்டு சேர்க்கிறது." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Step 1: Render-ஐ trigger செய்யுங்கள் {/*step-1-trigger-a-render*/}

ஒரு component render ஆக இரண்டு காரணங்கள் உள்ளன:

1. அது component-ன் **initial render.**
2. Component-ன் (அல்லது அதன் ancestors-ல் ஒருவரின்) **state update செய்யப்பட்டுள்ளது.**

### Initial render {/*initial-render*/}

உங்கள் app தொடங்கும்போது, initial render-ஐ trigger செய்ய வேண்டும். Frameworks மற்றும் sandboxes சில நேரங்களில் இந்த code-ஐ மறைத்துவிடும்; ஆனால் இது target DOM node உடன் [`createRoot`](/reference/react-dom/client/createRoot) call செய்து, பிறகு அதன் `render` method-ஐ உங்கள் component உடன் call செய்வதன் மூலம் செய்யப்படுகிறது:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: பிரதிபலிக்கும் petals கொண்ட மிகப்பெரிய metallic flower sculpture"
    />
  );
}
```

</Sandpack>

`root.render()` call-ஐ comment out செய்து component மறைவதைப் பாருங்கள்!

### State updates நேரத்தில் re-renders {/*re-renders-when-state-updates*/}

Component initially render ஆன பிறகு, அதன் state-ஐ [`set` function](/reference/react/useState#setstate) மூலம் update செய்து மேலும் renders trigger செய்யலாம். உங்கள் component-ன் state update செய்வது தானாகவே render ஒன்றை queue செய்கிறது. (ஒரு restaurant guest, முதல் order கொடுத்த பிறகு தாகம் அல்லது பசி நிலையைப் பொறுத்து tea, dessert, மற்றும் பலவற்றை order செய்வது போல இதை கற்பனை செய்யலாம்.)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="ஒரு உணவகத்தில் server ஆக React, head இடத்தில் cursor கொண்ட patron ஆக காட்டப்பட்ட user-க்கு Card UI serve செய்கிறது. Patron, black card அல்ல pink card வேண்டும் என்று தெரிவிக்கிறார்!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...trigger செய்கிறது..." alt="React Component Kitchen-க்கு திரும்பி, Card Chef-க்கு pink Card தேவை என்று சொல்கிறது." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="Card Chef, React-க்கு pink Card-ஐ கொடுக்கிறார்." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Step 2: React உங்கள் components-ஐ render செய்கிறது {/*step-2-react-renders-your-components*/}

Render ஒன்றை trigger செய்த பிறகு, screen-இல் என்ன காட்ட வேண்டும் என்பதை கண்டறிய React உங்கள் components-ஐ call செய்கிறது. **"Rendering" என்பது React உங்கள் components-ஐ call செய்வது.**

* **Initial render-இல்,** React root component-ஐ call செய்யும்.
* **பிற renders-இல்,** render-ஐ trigger செய்த state update உள்ள function component-ஐ React call செய்யும்.

இந்த process recursive: updated component வேறு component ஒன்றை return செய்தால், React அடுத்து _அந்த_ component-ஐ render செய்யும்; அந்த component-மும் ஏதாவது return செய்தால், அடுத்து _அந்த_ component-ஐ render செய்யும்; இவ்வாறே தொடரும். Nested components எதுவும் மீதமில்லாமல், screen-இல் என்ன காட்டப்பட வேண்டும் என்பதை React துல்லியமாக அறியும் வரை process தொடரும்.

கீழுள்ள example-இல், React `Gallery()` மற்றும் `Image()`-ஐ பலமுறை call செய்யும்:

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>ஊக்கமளிக்கும் சிற்பங்கள்</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: பிரதிபலிக்கும் petals கொண்ட மிகப்பெரிய metallic flower sculpture"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Initial render நடக்கும் போது,** `<section>`, `<h1>`, மற்றும் மூன்று `<img>` tags-க்காக React [DOM nodes உருவாக்கும்](https://developer.mozilla.org/docs/Web/API/Document/createElement).
* **Re-render நடக்கும் போது,** முந்தைய render முதல் அவற்றின் properties-ல் ஏதேனும் மாறியுள்ளதா என்பதை React கணக்கிடும். அடுத்த step, commit phase வரைக்கும் அந்த தகவலுடன் எதையும் செய்யாது.

<Pitfall>

Rendering எப்போதும் [pure calculation](/learn/keeping-components-pure) ஆக இருக்க வேண்டும்:

* **அதே inputs, அதே output.** அதே inputs கொடுக்கப்பட்டால், component எப்போதும் அதே JSX-ஐ return செய்ய வேண்டும். (யாராவது tomatoes உடன் salad order செய்தால், onions உடன் salad கிடைக்கக் கூடாது!)
* **அது தனக்கான வேலையை மட்டும் செய்ய வேண்டும்.** Rendering-க்கு முன் இருந்த objects அல்லது variables எதையும் அது மாற்றக்கூடாது. (ஒரு order, வேறு ஒருவரின் order-ஐ மாற்றக் கூடாது.)

இல்லையெனில், உங்கள் codebase complexity-ல் வளரும்போது குழப்பமான bugs மற்றும் unpredictable behavior-ஐ சந்திக்கலாம். "Strict Mode"-இல் develop செய்யும்போது, React ஒவ்வொரு component-ன் function-ஐ இருமுறை call செய்கிறது; இது impure functions காரணமாக ஏற்படும் mistakes-ஐ surface செய்ய உதவும்.

</Pitfall>

<DeepDive>

#### Performance-ஐ optimize செய்தல் {/*optimizing-performance*/}

Updated component tree-இல் மிகவும் உயரத்தில் இருந்தால், அதன் உள்ளே nested ஆன அனைத்து components-ஐயும் render செய்வது performance-க்கு optimal அல்ல. Performance issue ஒன்றை சந்தித்தால், அதை தீர்க்க பல opt-in வழிகள் [Performance](https://reactjs.org/docs/optimizing-performance.html) section-இல் விவரிக்கப்பட்டுள்ளன. **முன்கூட்டியே optimize செய்ய வேண்டாம்!**

</DeepDive>

## Step 3: React changes-ஐ DOM-க்கு commit செய்கிறது {/*step-3-react-commits-changes-to-the-dom*/}

உங்கள் components-ஐ render (call) செய்த பிறகு, React DOM-ஐ modify செய்யும்.

* **Initial render-க்கு,** React உருவாக்கிய அனைத்து DOM nodes-ஐ screen-இல் வைக்க [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API-ஐ பயன்படுத்தும்.
* **Re-renders-க்கு,** DOM latest rendering output-க்கு match ஆக, தேவையான குறைந்தபட்ச operations-ஐ (rendering நடக்கும் போது கணக்கிடப்பட்டவை!) React apply செய்யும்.

**Renders இடையே வேறுபாடு இருந்தால் மட்டுமே React DOM nodes-ஐ மாற்றும்.** உதாரணமாக, parent-இலிருந்து ஒவ்வொரு second-க்கும் வேறு props pass ஆகி re-render ஆகும் component இதோ. `<input>`-இல் text சேர்த்து அதன் `value` update செய்யலாம்; ஆனால் component re-render ஆனாலும் அந்த text மறைவதில்லை என்பதை கவனிக்கவும்:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

இந்த last step-இல், React புதிய `time` கொண்டு `<h1>`-ன் content-ஐ மட்டும் update செய்வதால் இது வேலை செய்கிறது. `<input>` கடந்த முறை இருந்த அதே இடத்தில் JSX-இல் இருப்பதை React பார்க்கிறது; எனவே React `<input>`-ஐயும் அதன் `value`-யையும் தொடாது!
## Epilogue: Browser paint {/*epilogue-browser-paint*/}

Rendering முடிந்து React DOM-ஐ update செய்த பிறகு, browser screen-ஐ repaint செய்யும். இந்த process "browser rendering" என்று அறியப்பட்டாலும், docs முழுவதும் குழப்பம் தவிர்க்க இதை "painting" என்று குறிப்பிடுவோம்.

<Illustration alt="Browser, 'card element உடன் still life'-ஐ paint செய்கிறது." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* React app-இல் எந்த screen update-மும் மூன்று steps-இல் நடக்கிறது:
  1. Trigger
  2. Render
  3. Commit
* உங்கள் components-இல் mistakes கண்டறிய Strict Mode பயன்படுத்தலாம்
* Rendering result கடந்த முறை இருந்ததைப் போலவே இருந்தால், React DOM-ஐ தொடாது

</Recap>
