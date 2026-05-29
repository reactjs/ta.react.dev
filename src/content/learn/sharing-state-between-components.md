---
title: Components இடையே State பகிர்தல்
---

<Intro>

சில நேரங்களில், இரண்டு components-ன் state எப்போதும் ஒன்றாக மாற வேண்டும் என்று நீங்கள் விரும்புவீர்கள். அதைச் செய்ய, அவை இரண்டிலிருந்தும் state-ஐ remove செய்து, அவற்றின் closest common parent-க்கு நகர்த்தி, பின்னர் props மூலம் கீழே pass செய்யவும். இது *lifting state up* என்று அழைக்கப்படுகிறது; React code எழுதும்போது நீங்கள் அடிக்கடி செய்யும் விஷயங்களில் இதுவும் ஒன்று.

</Intro>

<YouWillLearn>

- State-ஐ மேலே lift செய்து components இடையே state பகிர்வது எப்படி
- Controlled மற்றும் uncontrolled components என்றால் என்ன

</YouWillLearn>

## Example மூலம் state-ஐ lift செய்தல் {/*lifting-state-up-by-example*/}

இந்த example-இல், parent `Accordion` component இரண்டு தனித்தனி `Panel`-களை render செய்கிறது:

* `Accordion`
  - `Panel`
  - `Panel`

ஒவ்வொரு `Panel` component-க்கும் அதன் content visible ஆக உள்ளதா என்பதை தீர்மானிக்கும் boolean `isActive` state உள்ளது.

இரண்டு panels-க்கும் Show button அழுத்திப் பாருங்கள்:

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          காட்டு
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="பற்றி">
        சுமார் 2 மில்லியன் மக்கள் தொகையுடன், Almaty Kazakhstan-ன் மிகப்பெரிய நகரம். 1929 முதல் 1997 வரை, அது அதன் தலைநகரமாக இருந்தது.
      </Panel>
      <Panel title="பெயர்க்காரணம்">
        இந்த பெயர் <span lang="kk-KZ">алма</span> என்பதிலிருந்து வந்தது; அது Kazakh மொழியில் "apple" என்பதைக் குறிக்கும், மேலும் "apples நிறைந்தது" என்று அடிக்கடி மொழிபெயர்க்கப்படுகிறது. உண்மையில், Almaty சுற்றியுள்ள பகுதி apple-ன் ancestral home என்று கருதப்படுகிறது; wild <i lang="la">Malus sieversii</i> modern domestic apple-ன் ancestor ஆக இருக்கக்கூடிய candidate என்று கருதப்படுகிறது.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

ஒரு panel-ன் button அழுத்துவது மற்ற panel-ஐ பாதிக்கவில்லை என்பதை கவனிக்கவும்; அவை independent.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="மூன்று components கொண்ட tree-ஐ காட்டும் diagram: Accordion என்று label செய்யப்பட்ட parent, Panel என்று label செய்யப்பட்ட இரண்டு children. இரண்டு Panel components-உம் false value கொண்ட isActive-ஐ கொண்டுள்ளன.">

ஆரம்பத்தில், ஒவ்வொரு `Panel`-ன் `isActive` state `false`, எனவே இரண்டும் collapsed ஆக தோன்றுகின்றன

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="முந்தைய diagram-இன் அதே அமைப்பு; முதல் child Panel component-ன் isActive highlight செய்யப்பட்டு click-ஐ குறிக்கிறது, isActive value true ஆக set செய்யப்பட்டுள்ளது. இரண்டாவது Panel component இன்னும் false value கொண்டுள்ளது." >

எந்த `Panel`-ன் button-ஐ click செய்தாலும், அந்த `Panel`-ன் `isActive` state மட்டும் update ஆகும்

</Diagram>

</DiagramGroup>

**ஆனால் இப்போது எந்த நேரத்திலும் ஒரு panel மட்டும் expanded ஆக இருக்க வேண்டும் என்று மாற்ற விரும்புகிறீர்கள் என வைத்துக்கொள்ளுங்கள்.** அந்த design-இல், இரண்டாவது panel expand ஆனால் முதல் panel collapse ஆக வேண்டும். அதை எப்படி செய்வீர்கள்?

இந்த இரண்டு panels-ஐ coordinate செய்ய, மூன்று steps-இல் அவற்றின் state-ஐ parent component-க்கு "lift up" செய்ய வேண்டும்:

1. Child components-இலிருந்து state-ஐ **remove** செய்யவும்.
2. Common parent-இலிருந்து hardcoded data-வை **pass** செய்யவும்.
3. Common parent-க்கு state-ஐ **add** செய்து, event handlers உடன் அதை கீழே pass செய்யவும்.

இதனால் `Accordion` component இரு `Panel`-களையும் coordinate செய்து, ஒரே நேரத்தில் ஒன்றை மட்டும் expand செய்ய முடியும்.

### Step 1: Child components-இலிருந்து state-ஐ remove செய்யவும் {/*step-1-remove-state-from-the-child-components*/}

`Panel`-ன் `isActive` மீது control-ஐ அதன் parent component-க்கு நீங்கள் கொடுப்பீர்கள். அதாவது parent component `isActive`-ஐ `Panel`-க்கு prop ஆக pass செய்யும். `Panel` component-இலிருந்து **இந்த line-ஐ remove செய்வதால்** தொடங்குங்கள்:

```js
const [isActive, setIsActive] = useState(false);
```

அதற்கு பதிலாக, `Panel`-ன் props list-இல் `isActive` சேர்க்கவும்:

```js
function Panel({ title, children, isActive }) {
```

இப்போது `Panel`-ன் parent component, [prop ஆக கீழே pass செய்வதன் மூலம்](/learn/passing-props-to-a-component) `isActive`-ஐ *control* செய்ய முடியும். மாறாக, `Panel` component-க்கு இப்போது `isActive` value மீது *control இல்லை*; அது parent component-ன் பொறுப்பு!

### Step 2: Common parent-இலிருந்து hardcoded data pass செய்யவும் {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

State-ஐ lift up செய்ய, coordinate செய்ய விரும்பும் *இரண்டு* child components-க்கும் closest common parent component-ஐ கண்டுபிடிக்க வேண்டும்:

* `Accordion` *(closest common parent)*
  - `Panel`
  - `Panel`

இந்த example-இல், அது `Accordion` component. இது இரண்டு panels-க்கும் மேலே இருப்பதால் மற்றும் அவற்றின் props-ஐ control செய்ய முடிவதால், எந்த panel தற்போது active என்பது குறித்து "source of truth" ஆக மாறும். `Accordion` component இரண்டு panels-க்கும் `isActive`-ன் hardcoded value ஒன்றை (உதாரணமாக, `true`) pass செய்யட்டும்:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="பற்றி" isActive={true}>
        சுமார் 2 மில்லியன் மக்கள் தொகையுடன், Almaty Kazakhstan-ன் மிகப்பெரிய நகரம். 1929 முதல் 1997 வரை, அது அதன் தலைநகரமாக இருந்தது.
      </Panel>
      <Panel title="பெயர்க்காரணம்" isActive={true}>
        இந்த பெயர் <span lang="kk-KZ">алма</span> என்பதிலிருந்து வந்தது; அது Kazakh மொழியில் "apple" என்பதைக் குறிக்கும், மேலும் "apples நிறைந்தது" என்று அடிக்கடி மொழிபெயர்க்கப்படுகிறது. உண்மையில், Almaty சுற்றியுள்ள பகுதி apple-ன் ancestral home என்று கருதப்படுகிறது; wild <i lang="la">Malus sieversii</i> modern domestic apple-ன் ancestor ஆக இருக்கக்கூடிய candidate என்று கருதப்படுகிறது.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          காட்டு
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Accordion` component-இல் hardcoded `isActive` values-ஐ edit செய்து screen-இல் result-ஐ பாருங்கள்.

### Step 3: Common parent-க்கு state சேர்க்கவும் {/*step-3-add-state-to-the-common-parent*/}

State-ஐ lift up செய்வது, state ஆக நீங்கள் store செய்யும் விஷயத்தின் nature-ஐ அடிக்கடி மாற்றும்.

இந்த case-இல், ஒரே நேரத்தில் ஒரு panel மட்டும் active ஆக இருக்க வேண்டும். அதாவது `Accordion` common parent component, *எந்த* panel active என்பதை track செய்ய வேண்டும். `boolean` value-க்கு பதிலாக, active `Panel`-ன் index ஆக number ஒன்றை state variable-க்கு பயன்படுத்தலாம்:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex` `0` என்றால் முதல் panel active; அது `1` என்றால் இரண்டாவது panel active.

எந்த `Panel`-இலுள்ள "காட்டு" button click செய்தாலும், `Accordion`-இல் active index மாற வேண்டும். `Panel` `activeIndex` state-ஐ நேரடியாக set செய்ய முடியாது; ஏனெனில் அது `Accordion`-க்குள் define செய்யப்பட்டுள்ளது. `Accordion` component, [event handler-ஐ prop ஆக கீழே pass செய்வதன் மூலம்](/learn/responding-to-events#passing-event-handlers-as-props) `Panel` component தனது state-ஐ மாற்ற *explicitly allow* செய்ய வேண்டும்:

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

`Panel`-க்குள் உள்ள `<button>` இப்போது `onShow` prop-ஐ click event handler ஆக பயன்படுத்தும்:

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="பற்றி"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        சுமார் 2 மில்லியன் மக்கள் தொகையுடன், Almaty Kazakhstan-ன் மிகப்பெரிய நகரம். 1929 முதல் 1997 வரை, அது அதன் தலைநகரமாக இருந்தது.
      </Panel>
      <Panel
        title="பெயர்க்காரணம்"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        இந்த பெயர் <span lang="kk-KZ">алма</span> என்பதிலிருந்து வந்தது; அது Kazakh மொழியில் "apple" என்பதைக் குறிக்கும், மேலும் "apples நிறைந்தது" என்று அடிக்கடி மொழிபெயர்க்கப்படுகிறது. உண்மையில், Almaty சுற்றியுள்ள பகுதி apple-ன் ancestral home என்று கருதப்படுகிறது; wild <i lang="la">Malus sieversii</i> modern domestic apple-ன் ancestor ஆக இருக்கக்கூடிய candidate என்று கருதப்படுகிறது.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          காட்டு
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

இதனால் state lift up செய்வது முடிந்தது! State-ஐ common parent component-க்கு நகர்த்தியது, இரண்டு panels-ஐ coordinate செய்ய உங்களுக்கு அனுமதித்தது. இரண்டு "is shown" flags-க்கு பதிலாக active index பயன்படுத்தியது, எந்த நேரத்திலும் ஒரு panel மட்டும் active என்பதை உறுதிசெய்தது. Event handler-ஐ child-க்கு pass செய்தது, child parent-ன் state-ஐ மாற்ற அனுமதித்தது.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="மூன்று components கொண்ட tree-ஐ காட்டும் diagram: Accordion என்று label செய்யப்பட்ட parent, Panel என்று label செய்யப்பட்ட இரண்டு children. Accordion zero value கொண்ட activeIndex-ஐ கொண்டுள்ளது; அது முதல் Panel-க்கு true என்ற isActive value-ஆகவும், இரண்டாவது Panel-க்கு false என்ற isActive value-ஆகவும் pass செய்யப்படுகிறது." >

ஆரம்பத்தில், `Accordion`-ன் `activeIndex` `0`, எனவே முதல் `Panel` `isActive = true` பெறுகிறது

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="முந்தைய diagram-இன் அதே அமைப்பு; parent Accordion component-ன் activeIndex value highlight செய்யப்பட்டு click-ஐ குறிக்கிறது, value one ஆக மாறியுள்ளது. இரு child Panel components-க்கு செல்லும் flow-யும் highlight செய்யப்பட்டுள்ளது; ஒவ்வொரு child-க்கும் pass செய்யப்பட்ட isActive value எதிர்மாறாக set செய்யப்பட்டுள்ளது: முதல் Panel-க்கு false, இரண்டாவதற்கு true." >

`Accordion`-ன் `activeIndex` state `1` ஆக மாறும்போது, இரண்டாவது `Panel` அதற்கு பதிலாக `isActive = true` பெறுகிறது

</Diagram>

</DiagramGroup>

<DeepDive>

#### Controlled மற்றும் uncontrolled components {/*controlled-and-uncontrolled-components*/}

சில local state கொண்ட component-ஐ "uncontrolled" என்று அழைப்பது பொதுவானது. உதாரணமாக, `isActive` state variable கொண்ட original `Panel` component uncontrolled; ஏனெனில் panel active ஆக இருக்கிறதா இல்லையா என்பதை அதன் parent பாதிக்க முடியாது.

மாறாக, ஒரு component-இல் உள்ள முக்கிய information அதன் சொந்த local state-க்கு பதிலாக props மூலம் driven ஆக இருந்தால், அந்த component "controlled" என்று சொல்லலாம். இது parent component அதன் behavior-ஐ முழுமையாக specify செய்ய அனுமதிக்கிறது. `isActive` prop கொண்ட final `Panel` component, `Accordion` component மூலம் controlled ஆகிறது.

Uncontrolled components தங்கள் parents-க்குள் பயன்படுத்த நேரடியானவை; ஏனெனில் அவற்றுக்கு குறைந்த configuration போதும். ஆனால் அவற்றை ஒன்றாக coordinate செய்ய விரும்பும்போது அவை குறைவான flexible. Controlled components மிக அதிக flexible; ஆனால் parent components அவற்றை props மூலம் முழுமையாக configure செய்ய வேண்டும்.

நடைமுறையில், "controlled" மற்றும் "uncontrolled" என்பது strict technical terms அல்ல; ஒவ்வொரு component-க்கும் பொதுவாக local state மற்றும் props இரண்டின் mix இருக்கும். இருந்தாலும், components எப்படி design செய்யப்பட்டுள்ளன, அவை என்ன capabilities வழங்குகின்றன என்பதைப் பற்றி பேச இது பயனுள்ள வழி.

Component எழுதும்போது, அதில் எந்த information controlled (props மூலம்) ஆக இருக்க வேண்டும், எந்த information uncontrolled (state மூலம்) ஆக இருக்க வேண்டும் என்பதை சிந்தியுங்கள். ஆனால் உங்கள் எண்ணத்தை எப்போது வேண்டுமானாலும் மாற்றி பின்னர் refactor செய்யலாம்.

</DeepDive>

## ஒவ்வொரு state-க்கும் single source of truth {/*a-single-source-of-truth-for-each-state*/}

React application-இல், பல components தங்களுக்கே உரிய state கொண்டிருக்கும். சில state, inputs போன்ற leaf components-க்கு (tree-ன் அடிப்பகுதியில் உள்ள components) அருகில் "live" செய்யலாம். மற்ற state app-ன் மேல் பகுதிக்கு அருகில் "live" செய்யலாம். உதாரணமாக, client-side routing libraries கூட பொதுவாக current route-ஐ React state-இல் store செய்து, props மூலம் கீழே pass செய்வதன் மூலம் implement செய்யப்படுகின்றன!

**ஒவ்வொரு unique state துண்டிற்கும், அதை "own" செய்யும் component-ஐ நீங்கள் தேர்வு செய்வீர்கள்.** இந்த principle ["single source of truth"](https://en.wikipedia.org/wiki/Single_source_of_truth) கொண்டிருப்பது என்றும் அழைக்கப்படுகிறது. எல்லா state-உம் ஒரே இடத்தில் lives செய்கிறது என்று இதன் அர்த்தம் இல்லை; ஆனால் _ஒவ்வொரு_ state துண்டிற்கும், அந்த information-ஐ hold செய்யும் _குறிப்பிட்ட_ component ஒன்று இருக்கும். Components இடையே shared state-ஐ duplicate செய்வதற்கு பதிலாக, அதை அவற்றின் common shared parent-க்கு *lift up* செய்து, தேவைப்படும் children-க்கு *pass down* செய்யவும்.

நீங்கள் app-இல் வேலை செய்யும் போது அது மாறும். State-ன் ஒவ்வொரு பகுதியும் எங்கு "lives" செய்கிறது என்பதை புரிந்துகொண்டிருக்கும் போது, state-ஐ கீழே அல்லது மீண்டும் மேலே நகர்த்துவது பொதுவானது. இது process-ன் ஒரு பகுதியே!

இது இன்னும் சில components உடன் நடைமுறையில் எப்படி உணரப்படுகிறது என்பதைப் பார்க்க, [React-இல் சிந்தித்தல்](/learn/thinking-in-react) படிக்கவும்.

<Recap>

* இரண்டு components-ஐ coordinate செய்ய விரும்பும்போது, அவற்றின் state-ஐ common parent-க்கு நகர்த்தவும்.
* பின்னர் common parent-இலிருந்து props மூலம் information-ஐ கீழே pass செய்யவும்.
* இறுதியாக, children parent-ன் state-ஐ மாற்ற event handlers-ஐ கீழே pass செய்யவும்.
* Components-ஐ "controlled" (props மூலம் driven) அல்லது "uncontrolled" (state மூலம் driven) என சிந்திப்பது பயனுள்ளது.

</Recap>

<Challenges>

#### Sync ஆன inputs {/*synced-inputs*/}

இந்த இரண்டு inputs independent. அவற்றை sync-இல் வைத்திருங்கள்: ஒரு input edit செய்தால் மற்ற input அதே text உடன் update ஆக வேண்டும்; அதற்கு மாறாகவும்.

<Hint>

அவற்றின் state-ஐ parent component-க்குள் lift up செய்ய வேண்டும்.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="முதல் input" />
      <Input label="இரண்டாவது input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

`text` state variable-ஐ `handleChange` handler உடன் parent component-க்குள் நகர்த்தவும். பின்னர் அவற்றை இரண்டு `Input` components-க்கும் props ஆக pass செய்யவும். இதனால் அவை sync-இல் இருக்கும்.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="முதல் input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="இரண்டாவது input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### List-ஐ filter செய்தல் {/*filtering-a-list*/}

இந்த example-இல், `SearchBar` தனது text input-ஐ control செய்யும் சொந்த `query` state கொண்டுள்ளது. அதன் parent `FilterableList` component items-ன் `List` display செய்கிறது; ஆனால் அது search query-ஐ கருத்தில் கொள்ளவில்லை.

Search query-க்கு ஏற்ப list-ஐ filter செய்ய `filterItems(foods, query)` function-ஐ பயன்படுத்தவும். உங்கள் changes சோதிக்க, input-இல் "s" type செய்தால் list "Sushi", "Shish kebab", மற்றும் "Dim sum" ஆகக் குறைகிறது என்பதை verify செய்யவும்.

`filterItems` ஏற்கனவே implemented மற்றும் imported ஆக உள்ளது; அதனால் அதை நீங்களே எழுத வேண்டியதில்லை என்பதை கவனிக்கவும்!

<Hint>

`SearchBar`-இலிருந்து `query` state மற்றும் `handleChange` handler-ஐ remove செய்து, அவற்றை `FilterableList`-க்கு நகர்த்த வேண்டும். பின்னர் அவற்றை `SearchBar`-க்கு `query` மற்றும் `onChange` props ஆக pass செய்யவும்.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      தேடு:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi என்பது தயாரிக்கப்பட்ட vinegared rice கொண்ட பாரம்பரிய Japanese dish'
}, {
  id: 1,
  name: 'Dal',
  description: 'Dal தயாரிக்கும் மிகவும் பொதுவான முறை soup வடிவில்; அதில் onions, tomatoes மற்றும் பல spices சேர்க்கப்படலாம்'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi என்பது savoury அல்லது sweet filling-ஐ unleavened dough-ஆல் சுற்றி boiling water-இல் சமைத்து செய்யப்படும் filled dumplings'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab என்பது skewered மற்றும் grilled meat cubes கொண்டு செய்யப்படும் பிரபலமான உணவு.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum என்பது Cantonese மக்கள் breakfast மற்றும் lunch-க்கு restaurants-இல் பாரம்பரியமாக சுவைக்கும் பல சிறிய dishes தொகுப்பு'
}];
```

</Sandpack>

<Solution>

`query` state-ஐ `FilterableList` component-க்குள் lift up செய்யவும். Filtered list பெற `filterItems(foods, query)` call செய்து அதை `List`-க்கு pass செய்யவும். இப்போது query input மாறுவது list-இல் பிரதிபலிக்கும்:

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      தேடு:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js src/data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi என்பது தயாரிக்கப்பட்ட vinegared rice கொண்ட பாரம்பரிய Japanese dish'
}, {
  id: 1,
  name: 'Dal',
  description: 'Dal தயாரிக்கும் மிகவும் பொதுவான முறை soup வடிவில்; அதில் onions, tomatoes மற்றும் பல spices சேர்க்கப்படலாம்'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi என்பது savoury அல்லது sweet filling-ஐ unleavened dough-ஆல் சுற்றி boiling water-இல் சமைத்து செய்யப்படும் filled dumplings'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab என்பது skewered மற்றும் grilled meat cubes கொண்டு செய்யப்படும் பிரபலமான உணவு.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum என்பது Cantonese மக்கள் breakfast மற்றும் lunch-க்கு restaurants-இல் பாரம்பரியமாக சுவைக்கும் பல சிறிய dishes தொகுப்பு'
}];
```

</Sandpack>

</Solution>

</Challenges>
