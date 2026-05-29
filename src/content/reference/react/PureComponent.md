---
title: PureComponent
---

<Pitfall>

Classes-க்கு பதிலாக components-ஐ functions ஆக define செய்ய பரிந்துரைக்கிறோம். [Migrate செய்வது எப்படி என்று பார்க்கவும்.](#alternatives)

</Pitfall>

<Intro>

`PureComponent` [`Component`](/reference/react/Component)-க்கு ஒத்தது; ஆனால் அதே props மற்றும் state இருந்தால் re-renders-ஐ skip செய்கிறது. Class components-ஐ React இன்னும் support செய்கிறது; ஆனால் புதிய code-இல் அவற்றைப் பயன்படுத்த பரிந்துரைக்கவில்லை.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `PureComponent` {/*purecomponent*/}

அதே props மற்றும் state-க்கு class component re-render ஆகாமல் skip செய்ய, [`Component`](/reference/react/Component)-க்கு பதிலாக `PureComponent`-ஐ extend செய்யுங்கள்:

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` என்பது `Component`-ன் subclass; [அனைத்து `Component` APIs](/reference/react/Component#reference)-ஐயும் support செய்கிறது. `PureComponent`-ஐ extend செய்வது, props மற்றும் state-ஐ shallow-ஆக compare செய்யும் custom [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) method define செய்வதற்கு equivalent.


[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

---

## பயன்பாடு {/*usage*/}

### Class components-க்கு தேவையற்ற re-renders-ஐ skip செய்தல் {/*skipping-unnecessary-re-renders-for-class-components*/}

பொதுவாக parent re-render ஆகும் போதெல்லாம் React component-ஐ re-render செய்யும். Optimization ஆக, புதிய props மற்றும் state பழைய props மற்றும் state-க்கு சமமாக இருக்கும் வரை, parent re-render ஆனாலும் React re-render செய்யாத component-ஐ உருவாக்கலாம். [Class components](/reference/react/Component) `PureComponent`-ஐ extend செய்வதன் மூலம் இந்த behavior-க்கு opt in செய்யலாம்:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React component எப்போதும் [pure rendering logic](/learn/keeping-components-pure) கொண்டிருக்க வேண்டும். அதாவது அதன் props, state, மற்றும் context மாறவில்லை என்றால் அது அதே output-ஐ return செய்ய வேண்டும். `PureComponent` பயன்படுத்துவதன் மூலம், உங்கள் component இந்த தேவையை பின்பற்றுகிறது என்று React-க்கு சொல்கிறீர்கள்; ஆகவே props மற்றும் state மாறாத வரை React re-render செய்ய வேண்டியதில்லை. ஆனால் அது பயன்படுத்தும் context மாறினால், உங்கள் component இன்னும் re-render ஆகும்.

இந்த உதாரணத்தில், `name` மாறும்போது `Greeting` component re-render ஆகும் (ஏனெனில் அது அதன் props-ல் ஒன்று), ஆனால் `address` மாறும்போது re-render ஆகாது (ஏனெனில் அது `Greeting`-க்கு prop ஆக pass செய்யப்படவில்லை) என்பதை கவனியுங்கள்:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Classes-க்கு பதிலாக components-ஐ functions ஆக define செய்ய பரிந்துரைக்கிறோம். [Migrate செய்வது எப்படி என்று பார்க்கவும்.](#alternatives)

</Pitfall>

---

## மாற்று வழிகள் {/*alternatives*/}

### `PureComponent` class component-இலிருந்து function-க்கு migrate செய்தல் {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

புதிய code-இல் [class components](/reference/react/Component)-க்கு பதிலாக function components பயன்படுத்த பரிந்துரைக்கிறோம். `PureComponent` பயன்படுத்தும் existing class components உங்களிடம் இருந்தால், அவற்றை இவ்வாறு convert செய்யலாம். இது original code:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

இந்த component-ஐ [class-இலிருந்து function-க்கு convert செய்யும்போது](/reference/react/Component#alternatives), அதை [`memo`](/reference/react/memo)-வில் wrap செய்யுங்கள்:

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

`PureComponent` போல அல்லாமல், [`memo`](/reference/react/memo) புதிய மற்றும் பழைய state-ஐ compare செய்யாது. Function components-இல், அதே state உடன் [`set` function](/reference/react/useState#setstate) call செய்வது `memo` இல்லாமலேயே [default-ஆக re-renders-ஐத் தடுக்கிறது](/reference/react/memo#updating-a-memoized-component-using-state).

</Note>
