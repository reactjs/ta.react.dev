---
title: Context மூலம் data-வை ஆழமாக pass செய்தல்
---

<Intro>

பொதுவாக, parent component-இலிருந்து child component-க்கு props மூலம் information pass செய்வீர்கள். ஆனால் பல intermediate components வழியாக அவற்றை pass செய்ய வேண்டியிருந்தால், அல்லது உங்கள் app-இல் பல components-க்கு ஒரே information தேவைப்பட்டால், props pass செய்வது verbose மற்றும் inconvenient ஆகலாம். *Context* parent component-க்கு, அதன் கீழுள்ள tree-இல் எவ்வளவு ஆழத்தில் இருந்தாலும் எந்த component-க்கும், props மூலம் explicit ஆக pass செய்யாமல் சில information கிடைக்கச் செய்ய அனுமதிக்கிறது.

</Intro>

<YouWillLearn>

- "Prop drilling" என்றால் என்ன
- Repetitive prop passing-ஐ context மூலம் மாற்றுவது எப்படி
- Context-க்கான பொதுவான use cases
- Context-க்கான பொதுவான alternatives

</YouWillLearn>

## Props pass செய்வதில் உள்ள பிரச்சினை {/*the-problem-with-passing-props*/}

[Props pass செய்வது](/learn/passing-props-to-a-component), உங்கள் UI tree வழியாக data-வை அதை பயன்படுத்தும் components-க்கு explicit ஆக pipe செய்ய சிறந்த வழி.

ஆனால் tree-இல் ஆழமாக ஒரு prop pass செய்ய வேண்டியிருந்தால், அல்லது பல components-க்கு ஒரே prop தேவைப்பட்டால், props pass செய்வது verbose மற்றும் inconvenient ஆகலாம். Data தேவைப்படும் components-இலிருந்து nearest common ancestor மிகவும் தூரமாக இருக்கலாம்; அத்தனை உயரத்தில் [state-ஐ lift up செய்வது](/learn/sharing-state-between-components) "prop drilling" என்று அழைக்கப்படும் நிலைக்கு வழிவகுக்கலாம்.

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="மூன்று components கொண்ட tree diagram. Parent-இல் purple நிறத்தில் highlight செய்யப்பட்ட value-ஐ குறிக்கும் bubble உள்ளது. அந்த value இரண்டு children-க்கும் கீழே flow ஆகிறது; இரண்டும் purple ஆக highlight செய்யப்பட்டுள்ளன." >

State-ஐ மேலே lift செய்தல்

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="பத்து nodes கொண்ட tree diagram; ஒவ்வொரு node-க்கும் அதிகபட்சம் இரண்டு children. Root node-இல் purple நிறத்தில் highlight செய்யப்பட்ட value-ஐ குறிக்கும் bubble உள்ளது. அந்த value இரண்டு children வழியாக கீழே flow ஆகிறது; அவை value-ஐ pass செய்கின்றன, ஆனால் தாங்களே contain செய்யவில்லை. Left child value-ஐ இரண்டு children-க்கு pass செய்கிறது; அவை இரண்டும் purple ஆக highlight செய்யப்பட்டுள்ளன. Root-ன் right child, தனது இரண்டு children-இல் right ஒன்றுக்குத் value-ஐ pass செய்கிறது; அது purple ஆக highlight செய்யப்பட்டுள்ளது. அந்த child தனது single child வழியாக value-ஐ pass செய்து, அது தனது இரண்டு children-க்கும் pass செய்கிறது; அவை purple ஆக highlight செய்யப்பட்டுள்ளன.">

Prop drilling

</Diagram>

</DiagramGroup>

Props pass செய்யாமல் data தேவைப்படும் tree components-க்கு அதை "teleport" செய்ய வழி இருந்தால் நன்றாக இருக்காதா? React-ன் context feature மூலம் அது சாத்தியம்!

## Context: props pass செய்வதற்கான alternative {/*context-an-alternative-to-passing-props*/}

Context ஒரு parent component-க்கு அதன் கீழுள்ள முழு tree-க்கும் data provide செய்ய அனுமதிக்கிறது. Context-க்கு பல uses உள்ளன. இதோ ஒரு example. Size-க்காக `level` accept செய்யும் இந்த `Heading` component-ஐ கவனியுங்கள்:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>தலைப்பு</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>துணை-heading</Heading>
      <Heading level={4}>துணை-துணை-heading</Heading>
      <Heading level={5}>துணை-துணை-துணை-heading</Heading>
      <Heading level={6}>துணை-துணை-துணை-துணை-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

ஒரே `Section`-க்குள் உள்ள பல headings எப்போதும் ஒரே size-இல் இருக்க வேண்டும் என்று வைத்துக் கொள்ளுங்கள்:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>தலைப்பு</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>துணை-heading</Heading>
          <Heading level={3}>துணை-heading</Heading>
          <Heading level={3}>துணை-heading</Heading>
          <Section>
            <Heading level={4}>துணை-துணை-heading</Heading>
            <Heading level={4}>துணை-துணை-heading</Heading>
            <Heading level={4}>துணை-துணை-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

தற்போது, ஒவ்வொரு `<Heading>`-க்கும் `level` prop-ஐ தனித்தனியாக pass செய்கிறீர்கள்:

```js
<Section>
  <Heading level={3}>பற்றி</Heading>
  <Heading level={3}>புகைப்படங்கள்</Heading>
  <Heading level={3}>வீடியோக்கள்</Heading>
</Section>
```

அதற்கு பதிலாக `level` prop-ஐ `<Section>` component-க்கு pass செய்து `<Heading>`-இலிருந்து remove செய்ய முடிந்தால் நன்றாக இருக்கும். இதனால் ஒரே section-இல் உள்ள அனைத்து headings-க்கும் ஒரே size என்பதை enforce செய்யலாம்:

```js
<Section level={3}>
  <Heading>பற்றி</Heading>
  <Heading>புகைப்படங்கள்</Heading>
  <Heading>வீடியோக்கள்</Heading>
</Section>
```

ஆனால் `<Heading>` component தனது closest `<Section>`-ன் level-ஐ எப்படி அறியும்? **அதற்கு, child ஒன்று tree-இல் மேலே எங்கோ உள்ள data-வை "கேட்க" ஒரு வழி தேவைப்படும்.**

Props மட்டும் கொண்டு அதைச் செய்ய முடியாது. இங்கேதான் context பயன்படுகிறது. இதை மூன்று steps-இல் செய்வீர்கள்:

1. Context ஒன்றை **உருவாக்குங்கள்**. (Heading level-க்காக இருப்பதால் அதை `LevelContext` என்று அழைக்கலாம்.)
2. Data தேவைப்படும் component-இல் அந்த context-ஐ **பயன்படுத்துங்கள்**. (`Heading` `LevelContext`-ஐ பயன்படுத்தும்.)
3. Data specify செய்யும் component-இலிருந்து அந்த context-ஐ **provide செய்யுங்கள்**. (`Section` `LevelContext` provide செய்யும்.)

Context ஒரு parent-க்கு--தூரத்தில் இருந்தாலும்!--அதன் உள்ளேயுள்ள முழு tree-க்கும் data provide செய்ய அனுமதிக்கிறது.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="மூன்று components கொண்ட tree diagram. Parent-இல் orange நிறத்தில் highlight செய்யப்பட்ட value-ஐ குறிக்கும் bubble உள்ளது; அது இரண்டு children-க்கு project ஆகிறது, ஒவ்வொன்றும் orange ஆக highlight செய்யப்பட்டுள்ளன." >

அருகிலுள்ள children-இல் context பயன்படுத்துதல்

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="பத்து nodes கொண்ட tree diagram; ஒவ்வொரு node-க்கும் அதிகபட்சம் இரண்டு children. Root parent node-இல் orange நிறத்தில் highlight செய்யப்பட்ட value-ஐ குறிக்கும் bubble உள்ளது. அந்த value நான்கு leaves மற்றும் tree-இல் உள்ள ஒரு intermediate component-க்கு நேரடியாக project ஆகிறது; அவை எல்லாம் orange ஆக highlight செய்யப்பட்டுள்ளன. மற்ற intermediate components எதுவும் highlight செய்யப்படவில்லை.">

தொலைவில் உள்ள children-இல் context பயன்படுத்துதல்

</Diagram>

</DiagramGroup>

### படி 1: Context உருவாக்குங்கள் {/*step-1-create-the-context*/}

முதலில், context உருவாக்க வேண்டும். உங்கள் components அதை பயன்படுத்த முடியும் வகையில் அதை **ஒரு file-இலிருந்து export** செய்ய வேண்டும்:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>தலைப்பு</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>துணை-heading</Heading>
          <Heading level={3}>துணை-heading</Heading>
          <Heading level={3}>துணை-heading</Heading>
          <Section>
            <Heading level={4}>துணை-துணை-heading</Heading>
            <Heading level={4}>துணை-துணை-heading</Heading>
            <Heading level={4}>துணை-துணை-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`createContext`-க்கு ஒரே argument _default_ value. இங்கே, `1` மிகப்பெரிய heading level-ஐ குறிக்கிறது; ஆனால் எந்த kind value-யையும் (object கூட) pass செய்யலாம். Default value-ன் முக்கியத்துவத்தை அடுத்த step-இல் பார்ப்பீர்கள்.

### படி 2: Context பயன்படுத்துங்கள் {/*step-2-use-the-context*/}

React-இலிருந்து `useContext` Hook-ஐயும், உங்கள் context-ஐயும் import செய்யுங்கள்:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

தற்போது, `Heading` component props-இலிருந்து `level` read செய்கிறது:

```js
export default function Heading({ level, children }) {
  // ...
}
```

அதற்கு பதிலாக, `level` prop-ஐ remove செய்து, இப்போது import செய்த `LevelContext` context-இலிருந்து value read செய்யுங்கள்:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` ஒரு Hook. `useState` மற்றும் `useReducer` போலவே, Hook-ஐ React component-க்குள் உடனடியாக மட்டுமே call செய்யலாம் (loops அல்லது conditions-க்குள் அல்ல). **`Heading` component `LevelContext`-ஐ read செய்ய விரும்புகிறது என்று `useContext` React-க்கு சொல்கிறது.**

இப்போது `Heading` component-க்கு `level` prop இல்லாததால், இனி JSX-இல் இதுபோல் level prop-ஐ `Heading`-க்கு pass செய்ய தேவையில்லை:

```js
<Section>
  <Heading level={4}>துணை-துணை-heading</Heading>
  <Heading level={4}>துணை-துணை-heading</Heading>
  <Heading level={4}>துணை-துணை-heading</Heading>
</Section>
```

அதற்கு பதிலாக அதை receive செய்வது `Section` ஆக இருக்க JSX-ஐ update செய்யுங்கள்:

```jsx
<Section level={4}>
  <Heading>துணை-துணை-heading</Heading>
  <Heading>துணை-துணை-heading</Heading>
  <Heading>துணை-துணை-heading</Heading>
</Section>
```

நீங்கள் வேலை செய்யச் செய்ய முயன்ற markup இதுதான் என்பதை நினைவில் கொள்ளுங்கள்:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>தலைப்பு</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Section level={4}>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

இந்த example இன்னும் முழுமையாக வேலை செய்யவில்லை என்பதை கவனியுங்கள்! அனைத்து headings-க்கும் ஒரே size உள்ளது, ஏனெனில் **நீங்கள் context-ஐ *பயன்படுத்துகிறீர்கள்*, ஆனால் அதை இன்னும் *provide* செய்யவில்லை.** அதை எங்கிருந்து பெற வேண்டும் என்று React-க்கு தெரியாது!

Context provide செய்யவில்லை என்றால், முந்தைய step-இல் நீங்கள் specify செய்த default value-ஐ React பயன்படுத்தும். இந்த example-இல், `createContext`-க்கு argument ஆக `1` specify செய்ததால், `useContext(LevelContext)` `1` return செய்கிறது; அதனால் அந்த headings அனைத்தும் `<h1>` ஆகின்றன. ஒவ்வொரு `Section`-மும் தனது context-ஐ provide செய்யச் செய்வதன் மூலம் இந்த பிரச்சினையை fix செய்வோம்.

### படி 3: Context provide செய்யுங்கள் {/*step-3-provide-the-context*/}

`Section` component தற்போது தனது children-ஐ render செய்கிறது:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

அவற்றுக்கு `LevelContext` provide செய்ய, **அவற்றை context provider-இல் wrap செய்யுங்கள்**:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

இது React-க்கு சொல்வது: "இந்த `<Section>`-க்குள் உள்ள எந்த component `LevelContext` கேட்டாலும், இதன் `level`-ஐ கொடு." Component, UI tree-இல் மேலே உள்ள nearest `<LevelContext>` value-ஐ பயன்படுத்தும்.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>தலைப்பு</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Section level={4}>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext value={level}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Original code-இன் அதே result தான், ஆனால் ஒவ்வொரு `Heading` component-க்கும் `level` prop pass செய்ய வேண்டியதில்லை! அதற்கு பதிலாக, அது மேலே உள்ள closest `Section`-இடம் கேட்டு தனது heading level-ஐ "கண்டுபிடிக்கிறது":

1. `<Section>`-க்கு `level` prop pass செய்கிறீர்கள்.
2. `Section` தனது children-ஐ `<LevelContext value={level}>`-க்குள் wrap செய்கிறது.
3. `Heading` `useContext(LevelContext)` மூலம் மேலுள்ள closest `LevelContext` value-ஐ கேட்கிறது.

## அதே component-இல் context பயன்படுத்தியும் provide செய்தலும் {/*using-and-providing-context-from-the-same-component*/}

தற்போது, ஒவ்வொரு section-ன் `level`-ஐ இன்னும் manually specify செய்ய வேண்டும்:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Context மேலுள்ள component-இலிருந்து information read செய்ய அனுமதிப்பதால், ஒவ்வொரு `Section`-மும் மேலுள்ள `Section`-இலிருந்து `level`-ஐ read செய்து, `level + 1`-ஐ தானாக கீழே pass செய்யலாம். இதை இப்படிச் செய்யலாம்:

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

இந்த change மூலம், `<Section>`-க்கும் `<Heading>`-க்கும் `level` prop pass செய்யவே தேவையில்லை:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>தலைப்பு</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Heading>துணை-heading</Heading>
          <Section>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
            <Heading>துணை-துணை-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading ஒரு Section-க்குள் இருக்க வேண்டும்!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

இப்போது `Heading` மற்றும் `Section` இரண்டும் அவை எவ்வளவு "deep" என கண்டுபிடிக்க `LevelContext` read செய்கின்றன. மேலும் `Section`, அதன் உள்ளே உள்ள எதுவும் "deeper" level-இல் உள்ளது என்று specify செய்ய தனது children-ஐ `LevelContext`-க்குள் wrap செய்கிறது.

<Note>

இந்த example heading levels பயன்படுத்துகிறது, ஏனெனில் nested components context-ஐ எப்படி override செய்ய முடியும் என்பதை அவை visual ஆக காட்டுகின்றன. ஆனால் context பல வேறு use cases-க்கும் பயனுள்ளதாகும். முழு subtree-க்கும் தேவையான எந்த information-ஐயும் கீழே pass செய்யலாம்: current color theme, தற்போது logged in user, போன்றவை.

</Note>

## Context intermediate components வழியாக pass ஆகிறது {/*context-passes-through-intermediate-components*/}

Context provide செய்யும் component மற்றும் அதை பயன்படுத்தும் component இடையே உங்களுக்கு விருப்பமான அளவு components insert செய்யலாம். இதில் `<div>` போன்ற built-in components மற்றும் நீங்கள் build செய்யும் components இரண்டும் அடங்கும்.

இந்த example-இல், அதே `Post` component (dashed border உடன்) இரண்டு வெவ்வேறு nesting levels-இல் render செய்யப்படுகிறது. அதன் உள்ளே உள்ள `<Heading>` தனது level-ஐ closest `<Section>`-இலிருந்து தானாக பெறுகிறது என்பதை கவனியுங்கள்:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>என் Profile</Heading>
      <Post
        title="வணக்கம் traveller!"
        body="என் adventures பற்றி வாசிக்கவும்."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>சமீபத்திய Posts</Heading>
      <Post
        title="Lisbon-ன் சுவைகள்"
        body="...அந்த pastéis de nata!"
      />
      <Post
        title="Tango தாளத்தில் Buenos Aires"
        body="எனக்கு மிகவும் பிடித்தது!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading ஒரு Section-க்குள் இருக்க வேண்டும்!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('தெரியாத level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

இது வேலை செய்ய நீங்கள் எந்த special செயலும் செய்யவில்லை. ஒரு `Section` அதன் உள்ளேயுள்ள tree-க்கான context-ஐ specify செய்கிறது; எனவே `<Heading>`-ஐ எங்கு insert செய்தாலும், அது சரியான size பெறும். மேலுள்ள sandbox-இல் முயற்சிக்கவும்!

**Context, "தங்கள் surroundings-க்கு adapt ஆகும்" components எழுத அனுமதிக்கிறது; அவை _எங்கு_ (அல்லது வேறு வார்த்தைகளில், _எந்த context-இல்_) render செய்யப்படுகின்றன என்பதைப் பொறுத்து தங்களை வேறுபடக் display செய்யும்.**

Context வேலை செய்வது [CSS property inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance)-ஐ நினைவூட்டலாம். CSS-இல், `<div>`-க்கு `color: blue` specify செய்யலாம்; அதன் உள்ளே எவ்வளவு ஆழமாக இருந்தாலும் எந்த DOM node-மும், நடுவே உள்ள வேறு DOM node `color: green` மூலம் override செய்யாவிட்டால், அந்த color-ஐ inherit செய்யும். அதேபோல் React-இல், மேலிருந்து வரும் context-ஐ override செய்ய ஒரே வழி, வேறு value கொண்ட context provider-இல் children-ஐ wrap செய்வது.

CSS-இல், `color` மற்றும் `background-color` போன்ற வெவ்வேறு properties ஒன்றை ஒன்று override செய்யாது. அனைத்து `<div>`-களின் `color`-ஐ red ஆக set செய்தாலும் `background-color` பாதிக்கப்படாது. அதேபோல், **வெவ்வேறு React contexts ஒன்றை ஒன்று override செய்யாது.** `createContext()` மூலம் நீங்கள் உருவாக்கும் ஒவ்வொரு context-மும் மற்றவற்றிலிருந்து முற்றிலும் separate; அந்த particular context-ஐ use செய்து provide செய்யும் components-ஐ மட்டும் இணைக்கிறது. ஒரு component பிரச்சினையின்றி பல வெவ்வேறு contexts-ஐ use அல்லது provide செய்யலாம்.

## Context பயன்படுத்துவதற்கு முன் {/*before-you-use-context*/}

Context பயன்படுத்துவது மிகவும் tempting! ஆனால் இதன் பொருள் அதை overuse செய்வதும் சாத்தியம். **சில props-ஐ several levels deep pass செய்ய வேண்டும் என்பதற்காகவே அந்த information-ஐ context-இல் வைக்க வேண்டும் என்று அர்த்தமில்லை.**

Context பயன்படுத்துவதற்கு முன் நீங்கள் பரிசீலிக்க வேண்டிய சில alternatives:

1. **[Props pass செய்வதிலிருந்து](/learn/passing-props-to-a-component) தொடங்குங்கள்.** உங்கள் components trivial அல்லாவிட்டால், dozen components வழியாக dozen props pass செய்வது unusual அல்ல. இது slog போல உணரப்படலாம்; ஆனால் எந்த components எந்த data-வை use செய்கின்றன என்பதை மிகவும் தெளிவாக்குகிறது! உங்கள் code maintain செய்யும் நபர் props மூலம் data flow explicit ஆக்கியதற்காக மகிழ்வார்.
2. **Components extract செய்து, அவற்றுக்கு [JSX-ஐ `children` ஆக pass செய்யுங்கள்](/learn/passing-props-to-a-component#passing-jsx-as-children).** அந்த data-வை use செய்யாத intermediate components பல layers வழியாக data pass செய்தால் (அவை அதை மேலும் கீழே pass செய்கின்றன மட்டுமே), வழியில் சில components extract செய்ய மறந்திருக்கலாம் என்பதைக் குறிக்கும். உதாரணமாக, `posts` போன்ற data props-ஐ நேரடியாக use செய்யாத visual components-க்கு pass செய்யலாம்: `<Layout posts={posts} />`. அதற்கு பதிலாக, `Layout` `children` prop எடுக்கச் செய்து, `<Layout><Posts posts={posts} /></Layout>` render செய்யுங்கள். இதனால் data specify செய்யும் component மற்றும் அதை தேவைப்படும் component இடையிலான layers எண்ணிக்கை குறையும்.

இந்த approaches எதுவும் உங்களுக்கு நன்றாக வேலை செய்யவில்லை என்றால், context-ஐ பரிசீலிக்கவும்.

## Context-க்கான use cases {/*use-cases-for-context*/}

* **Theming:** உங்கள் app user-க்கு அதன் appearance மாற்ற அனுமதித்தால் (உதா. dark mode), உங்கள் app-ன் top-இல் context provider வைத்து, visual look adjust செய்ய வேண்டிய components-இல் அந்த context-ஐ பயன்படுத்தலாம்.
* **Current account:** தற்போது logged in user யார் என்பதை பல components அறிய வேண்டியிருக்கலாம். அதை context-இல் வைப்பது tree-இல் எங்கு வேண்டுமானாலும் read செய்வதை வசதியாக்குகிறது. சில apps ஒரே நேரத்தில் பல accounts operate செய்யவும் அனுமதிக்கின்றன (உதா. வேறு user ஆக comment விட). அத்தகைய சூழல்களில், UI-ன் ஒரு பகுதியை வேறு current account value கொண்ட nested provider-இல் wrap செய்வது வசதியாக இருக்கலாம்.
* **Routing:** பெரும்பாலான routing solutions current route வைத்திருக்க context-ஐ internally பயன்படுத்துகின்றன. இதனால் ஒவ்வொரு link-க்கும் அது active ஆக உள்ளதா இல்லையா "தெரியும்". நீங்கள் சொந்த router build செய்தால், இதையும் செய்ய விரும்பலாம்.
* **State manage செய்தல்:** உங்கள் app வளரும்போது, app top-க்கு அருகில் நிறைய state இருக்கலாம். கீழே தொலைவில் உள்ள பல components அதை change செய்ய விரும்பலாம். Complex state manage செய்து அதை தொலைவில் உள்ள components-க்கு அதிக சிரமமின்றி pass செய்ய [context உடன் reducer பயன்படுத்துவது](/learn/scaling-up-with-reducer-and-context) பொதுவானது.

Context static values-க்கு மட்டும் கட்டுப்பட்டது அல்ல. அடுத்த render-இல் வேறு value pass செய்தால், அதை read செய்யும் கீழுள்ள அனைத்து components-யையும் React update செய்யும்! அதனால் context பெரும்பாலும் state உடன் சேர்த்து பயன்படுத்தப்படுகிறது.

பொதுவாக, tree-ன் வெவ்வேறு பகுதிகளில் உள்ள தொலைவிலான components-க்கு ஏதாவது information தேவைப்பட்டால், context உதவும் என்பது நல்ல indication.

<Recap>

* Context ஒரு component-க்கு அதன் கீழுள்ள முழு tree-க்கும் சில information provide செய்ய அனுமதிக்கிறது.
* Context pass செய்ய:
  1. `export const MyContext = createContext(defaultValue)` மூலம் அதை create செய்து export செய்யுங்கள்.
  2. எவ்வளவு ஆழத்தில் இருந்தாலும் எந்த child component-இலும் read செய்ய `useContext(MyContext)` Hook-க்கு pass செய்யுங்கள்.
  3. Parent-இலிருந்து provide செய்ய children-ஐ `<MyContext value={...}>`-க்குள் wrap செய்யுங்கள்.
* Context நடுவே உள்ள எந்த components வழியாகவும் pass ஆகும்.
* Context "தங்கள் surroundings-க்கு adapt ஆகும்" components எழுத அனுமதிக்கிறது.
* Context பயன்படுத்துவதற்கு முன், props pass செய்வதையோ JSX-ஐ `children` ஆக pass செய்வதையோ முயற்சிக்கவும்.

</Recap>

<Challenges>

#### Prop drilling-ஐ context-ஆல் மாற்றுங்கள் {/*replace-prop-drilling-with-context*/}

இந்த example-இல், checkbox toggle செய்வது ஒவ்வொரு `<PlaceImage>`-க்கும் pass செய்யப்படும் `imageSize` prop-ஐ மாற்றுகிறது. Checkbox state top-level `App` component-இல் வைத்திருக்கப்படுகிறது, ஆனால் ஒவ்வொரு `<PlaceImage>`-க்கும் அது தெரிய வேண்டும்.

தற்போது, `App` `imageSize`-ஐ `List`-க்கு pass செய்கிறது; அது ஒவ்வொரு `Place`-க்கும் pass செய்கிறது; அது `PlaceImage`-க்கு pass செய்கிறது. `imageSize` prop-ஐ remove செய்து, அதற்கு பதிலாக `App` component-இலிருந்து நேரடியாக `PlaceImage`-க்கு pass செய்யுங்கள்.

`Context.js`-இல் context declare செய்யலாம்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        பெரிய images பயன்படுத்து
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: '20-ஆம் நூற்றாண்டின் இறுதியில் வீடுகளுக்கு bright colors தேர்வு செய்யும் tradition தொடங்கியது.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'வீடுகள் demolition-இலிருந்து காப்பாற்ற, local resident ஆன Huang Yung-Fu 1924-இல் அவற்றில் 1,200-ஐ painting செய்தார்.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexico',
  description: 'Hillside neighborhood-இல் உள்ள வீடுகளை cover செய்யும் உலகின் மிகப்பெரிய murals-இல் ஒன்று.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'இந்த landmark-ஐ Chilean-born artist ஆன Jorge Selarón, "Brazilian people-க்கு tribute" ஆக உருவாக்கினார்.',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italy',
  description: '16-ஆம் நூற்றாண்டு வரை செல்லும் specific color system-ஐ பின்பற்றி வீடுகள் paint செய்யப்படுகின்றன.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marocco',
  description: 'வீடுகள் ஏன் blue ஆக paint செய்யப்பட்டுள்ளன என்பதில் சில theories உள்ளன; அந்த color mosquitoes-ஐ repel செய்கிறது அல்லது sky மற்றும் heaven-ஐ symbolize செய்கிறது என்பதும் அவற்றில் ஒன்று.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: '2009-இல், வீடுகளை paint செய்து exhibitions மற்றும் art installations கொண்டு village cultural hub ஆக மாற்றப்பட்டது.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

அனைத்து components-இலிருந்தும் `imageSize` prop-ஐ remove செய்யுங்கள்.

`Context.js`-இலிருந்து `ImageSizeContext` create செய்து export செய்யுங்கள். பிறகு value-ஐ கீழே pass செய்ய List-ஐ `<ImageSizeContext value={imageSize}>`-க்குள் wrap செய்து, `PlaceImage`-இல் அதை read செய்ய `useContext(ImageSizeContext)` பயன்படுத்துங்கள்:

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        பெரிய images பயன்படுத்து
      </label>
      <hr />
      <List />
    </ImageSizeContext>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: '20-ஆம் நூற்றாண்டின் இறுதியில் வீடுகளுக்கு bright colors தேர்வு செய்யும் tradition தொடங்கியது.',
  imageId: 'K9HVAGH'
}, {
  id: 1,
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'வீடுகள் demolition-இலிருந்து காப்பாற்ற, local resident ஆன Huang Yung-Fu 1924-இல் அவற்றில் 1,200-ஐ painting செய்தார்.',
  imageId: '9EAYZrt'
}, {
  id: 2,
  name: 'Macromural de Pachuca, Mexico',
  description: 'Hillside neighborhood-இல் உள்ள வீடுகளை cover செய்யும் உலகின் மிகப்பெரிய murals-இல் ஒன்று.',
  imageId: 'DgXHVwu'
}, {
  id: 3,
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'இந்த landmark-ஐ Chilean-born artist ஆன Jorge Selarón, "Brazilian people-க்கு tribute" ஆக உருவாக்கினார்.',
  imageId: 'aeO3rpI'
}, {
  id: 4,
  name: 'Burano, Italy',
  description: '16-ஆம் நூற்றாண்டு வரை செல்லும் specific color system-ஐ பின்பற்றி வீடுகள் paint செய்யப்படுகின்றன.',
  imageId: 'kxsph5C'
}, {
  id: 5,
  name: 'Chefchaouen, Marocco',
  description: 'வீடுகள் ஏன் blue ஆக paint செய்யப்பட்டுள்ளன என்பதில் சில theories உள்ளன; அந்த color mosquitoes-ஐ repel செய்கிறது அல்லது sky மற்றும் heaven-ஐ symbolize செய்கிறது என்பதும் அவற்றில் ஒன்று.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: '2009-இல், வீடுகளை paint செய்து exhibitions மற்றும் art installations கொண்டு village cultural hub ஆக மாற்றப்பட்டது.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://react.dev/images/docs/scientists/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

நடுவிலுள்ள components இனி `imageSize` pass செய்ய வேண்டியதில்லை என்பதை கவனியுங்கள்.

</Solution>

</Challenges>
