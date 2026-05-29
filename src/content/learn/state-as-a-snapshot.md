---
title: Snapshot ஆக State
---

<Intro>

State variables படிக்கவும் எழுதவும் கூடிய வழக்கமான JavaScript variables போல தோன்றலாம். ஆனால் state, snapshot போலவே நடக்கிறது. அதை set செய்வது ஏற்கனவே உங்களிடம் உள்ள state variable-ஐ மாற்றாது; அதற்கு பதிலாக re-render ஒன்றை trigger செய்கிறது.

</Intro>

<YouWillLearn>

* State set செய்வது re-renders-ஐ எப்படி trigger செய்கிறது
* State எப்போது, எப்படி update ஆகிறது
* State set செய்த உடனே அது ஏன் update ஆகாது
* Event handlers state-ன் "snapshot"-ஐ எப்படி அணுகுகின்றன

</YouWillLearn>

## State set செய்வது renders-ஐ trigger செய்கிறது {/*setting-state-triggers-renders*/}

Click போன்ற user event-க்கு பதிலாக உங்கள் user interface நேரடியாக மாறுகிறது என்று நீங்கள் நினைக்கலாம். React-இல், இந்த mental model-இலிருந்து அது சிறிது வேறுபடுகிறது. முந்தைய page-இல், [state set செய்வது React-இலிருந்து re-render ஒன்றை request செய்கிறது](/learn/render-and-commit#step-1-trigger-a-render) என்பதை பார்த்தீர்கள். இதன் அர்த்தம், interface ஒரு event-க்கு react செய்ய, நீங்கள் *state-ஐ update* செய்ய வேண்டும்.

இந்த example-இல், "அனுப்பு" அழுத்தும்போது, `setIsSent(true)` UI-ஐ re-render செய்ய React-க்கு சொல்கிறது:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('வணக்கம்!');
  if (isSent) {
    return <h1>உங்கள் செய்தி அனுப்பப்பட்டுக்கொண்டிருக்கிறது!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="செய்தி"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">அனுப்பு</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Button-ஐ click செய்யும்போது நடப்பது இதுதான்:

1. `onSubmit` event handler execute ஆகிறது.
2. `setIsSent(true)` `isSent`-ஐ `true` ஆக set செய்து, புதிய render ஒன்றை queue செய்கிறது.
3. புதிய `isSent` value-க்கு ஏற்ப React component-ஐ re-render செய்கிறது.

State மற்றும் rendering இடையிலான தொடர்பை இன்னும் அருகில் பார்ப்போம்.

## Rendering நேரத்தில் ஒரு snapshot எடுக்கிறது {/*rendering-takes-a-snapshot-in-time*/}

["Rendering"](/learn/render-and-commit#step-2-react-renders-your-components) என்றால் React உங்கள் component-ஐ, அதாவது ஒரு function-ஐ, call செய்கிறது. அந்த function-இலிருந்து நீங்கள் return செய்யும் JSX, அந்த நேரத்தில் UI-ன் snapshot போல இருக்கும். அதன் props, event handlers, local variables எல்லாம் **அந்த render நேரத்தில் இருந்த state-ஐப் பயன்படுத்தியே** கணக்கிடப்பட்டவை.

Photograph அல்லது movie frame போல அல்லாமல், நீங்கள் return செய்யும் UI "snapshot" interactive ஆகும். Inputs-க்கு பதிலாக என்ன நடக்க வேண்டும் என்பதை குறிப்பிடும் event handlers போன்ற logic அதில் அடங்கும். React screen-ஐ இந்த snapshot-க்கு match ஆக update செய்து event handlers-ஐ connect செய்கிறது. அதன் விளைவாக, button-ஐ அழுத்தினால் உங்கள் JSX-இலிருந்து வந்த click handler trigger ஆகும்.

React ஒரு component-ஐ re-render செய்யும்போது:

1. React உங்கள் function-ஐ மீண்டும் call செய்கிறது.
2. உங்கள் function புதிய JSX snapshot ஒன்றை return செய்கிறது.
3. பின்னர் React, உங்கள் function return செய்த snapshot-க்கு match ஆக screen-ஐ update செய்கிறது.

<IllustrationBlock sequential>
    <Illustration caption="React function-ஐ execute செய்கிறது" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Snapshot-ஐ கணக்கிடுகிறது" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM tree-ஐ update செய்கிறது" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Component-ன் memory ஆக, state உங்கள் function return ஆன பிறகு மறைந்துவிடும் வழக்கமான variable போல அல்ல. State உண்மையில் React-இலேயே, உங்கள் function-க்கு வெளியே, ஒரு shelf-ல் இருப்பது போல "வாழ்கிறது". React உங்கள் component-ஐ call செய்யும்போது, அந்த குறிப்பிட்ட render-க்கான state snapshot-ஐ உங்களுக்கு தருகிறது. உங்கள் component, புதிய props மற்றும் event handlers தொகுப்புடன் UI snapshot-ஐ அதன் JSX-இல் return செய்கிறது; இவை அனைத்தும் **அந்த render-இலிருந்த state values-ஐப் பயன்படுத்தியே** கணக்கிடப்பட்டவை!

<IllustrationBlock sequential>
  <Illustration caption="State-ஐ update செய்ய React-க்கு நீங்கள் சொல்கிறீர்கள்" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React state value-ஐ update செய்கிறது" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="State value-ன் snapshot ஒன்றை React component-க்கு அனுப்புகிறது" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

இது எப்படி வேலை செய்கிறது என்பதை காண ஒரு சிறிய experiment. இந்த example-இல், "+3" button-ஐ click செய்தால் counter மூன்று முறை increment ஆகும் என்று நீங்கள் எதிர்பார்க்கலாம், ஏனெனில் அது `setNumber(number + 1)`-ஐ மூன்று முறை call செய்கிறது.

"+3" button-ஐ click செய்தால் என்ன நடக்கிறது என்று பாருங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

`number` ஒவ்வொரு click-க்கும் ஒருமுறை மட்டுமே increment ஆகிறது என்பதை கவனிக்கவும்!

**State set செய்வது அதை *அடுத்த* render-க்காக மட்டுமே மாற்றுகிறது.** முதல் render-இல், `number` `0` ஆக இருந்தது. அதனால் தான், *அந்த render-ன்* `onClick` handler-இல், `setNumber(number + 1)` call ஆன பிறகும் `number` value இன்னும் `0` ஆகவே உள்ளது:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

இந்த button-ன் click handler React-க்கு செய்யச் சொல்வது:

1. `setNumber(number + 1)`: `number` `0`, ஆகவே `setNumber(0 + 1)`.
    - அடுத்த render-இல் `number`-ஐ `1` ஆக மாற்ற React தயாராகிறது.
2. `setNumber(number + 1)`: `number` `0`, ஆகவே `setNumber(0 + 1)`.
    - அடுத்த render-இல் `number`-ஐ `1` ஆக மாற்ற React தயாராகிறது.
3. `setNumber(number + 1)`: `number` `0`, ஆகவே `setNumber(0 + 1)`.
    - அடுத்த render-இல் `number`-ஐ `1` ஆக மாற்ற React தயாராகிறது.

நீங்கள் `setNumber(number + 1)`-ஐ மூன்று முறை call செய்தாலும், *இந்த render-ன்* event handler-இல் `number` எப்போதும் `0`, எனவே state-ஐ `1` ஆக மூன்று முறை set செய்கிறீர்கள். அதனால் தான் event handler முடிந்த பிறகு, React component-ஐ `number` `3` ஆக அல்ல, `1` ஆக re-render செய்கிறது.

உங்கள் code-இல் state variables-ஐ அவற்றின் values-ஆக மனதில் substitute செய்தும் இதைக் காணலாம். *இந்த render*-க்கு `number` state variable `0` என்பதால், அதன் event handler இதுபோல இருக்கும்:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

அடுத்த render-க்கு, `number` `1`, எனவே *அந்த render-ன்* click handler இதுபோல இருக்கும்:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

இதனால் button-ஐ மீண்டும் click செய்தால் counter `2` ஆகவும், அடுத்த click-இல் `3` ஆகவும், இவ்வாறு தொடர்ந்து set ஆகும்.

## காலப்போக்கில் State {/*state-over-time*/}

சரி, அது சுவாரஸ்யமாக இருந்தது. இந்த button-ஐ click செய்தால் என்ன alert வரும் என்று ஊகிக்க முயலுங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

முன்பு பார்த்த substitution method-ஐப் பயன்படுத்தினால், alert "0" காட்டும் என்று நீங்கள் ஊகிக்கலாம்:

```js
setNumber(0 + 5);
alert(0);
```

ஆனால் alert-க்கு timer வைத்தால் என்ன, அதனால் component re-render ஆன _பிறகு_ மட்டுமே அது fire ஆகும்? அது "0" சொல்லுமா அல்லது "5" சொல்லுமா? ஊகித்து பாருங்கள்!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

ஆச்சரியமா? Substitution method-ஐப் பயன்படுத்தினால், alert-க்கு அனுப்பப்பட்ட state-ன் "snapshot"-ஐ பார்க்கலாம்.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

Alert run ஆகும் நேரத்திற்குள் React-இல் சேமிக்கப்பட்ட state மாறியிருக்கலாம்; ஆனால் பயனர் அதனுடன் interact செய்த நேரத்தில் இருந்த state snapshot-ஐப் பயன்படுத்தியே அது schedule செய்யப்பட்டது!

**ஒரு state variable-ன் value render ஒன்றுக்குள் ஒருபோதும் மாறாது,** அதன் event handler code asynchronous ஆக இருந்தாலும். *அந்த render-ன்* `onClick` உள்ளே, `setNumber(number + 5)` call ஆன பிறகும் `number` value `0` ஆகவே தொடர்கிறது. React உங்கள் component-ஐ call செய்து UI-ன் "snapshot எடுத்த" நேரத்தில் அதன் value "fixed" ஆனது.

Timing mistakes குறைய உங்கள் event handlers-க்கு இது எப்படி உதவுகிறது என்பதற்கான example இதோ. கீழே, ஐந்து வினாடி delay-உடன் message அனுப்பும் form உள்ளது. இந்த scenario-வை நினைத்துப் பாருங்கள்:

1. நீங்கள் "அனுப்பு" button-ஐ அழுத்தி, Alice-க்கு "வணக்கம்" அனுப்புகிறீர்கள்.
2. ஐந்து வினாடி delay முடிவதற்கு முன், "யாருக்கு" field-ன் value-ஐ "Bob" ஆக மாற்றுகிறீர்கள்.

`alert` என்ன display செய்யும் என்று எதிர்பார்க்கிறீர்கள்? "நீங்கள் Alice-க்கு வணக்கம் என்றீர்கள்" என்று display செய்யுமா? அல்லது "நீங்கள் Bob-க்கு வணக்கம் என்றீர்கள்" என்று display செய்யுமா? உங்களுக்கு தெரிந்தவற்றின் அடிப்படையில் ஊகித்து, பிறகு இதை முயற்சிக்கவும்:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('வணக்கம்');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`நீங்கள் ${to}-க்கு ${message} என்றீர்கள்`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        யாருக்கு:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="செய்தி"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">அனுப்பு</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React ஒரு render-ன் event handlers-க்குள் state values-ஐ "fixed" ஆக வைத்திருக்கிறது.** Code run ஆகிக்கொண்டிருக்கும்போது state மாறிவிட்டதா என்று நீங்கள் கவலைப்பட வேண்டியதில்லை.

ஆனால் re-render-க்கு முன் latest state-ஐ படிக்க விரும்பினால் என்ன? அடுத்த page-இல் பார்க்கப்படும் [state updater function](/learn/queueing-a-series-of-state-updates)-ஐ பயன்படுத்த வேண்டும்!

<Recap>

* State set செய்வது புதிய render-ஐ request செய்கிறது.
* React state-ஐ உங்கள் component-க்கு வெளியே, ஒரு shelf-ல் இருப்பது போல சேமிக்கிறது.
* `useState` call செய்யும்போது, React *அந்த render-க்கான* state snapshot-ஐ உங்களுக்கு தருகிறது.
* Variables மற்றும் event handlers re-renders-ஐ "survive" செய்யாது. ஒவ்வொரு render-க்கும் அதன் சொந்த event handlers உள்ளன.
* ஒவ்வொரு render-மும் (அதன் உள்ள functions-மும்), React *அந்த* render-க்கு கொடுத்த state snapshot-ஐ மட்டுமே எப்போதும் "பார்க்கும்".
* Render செய்யப்பட்ட JSX பற்றி சிந்திப்பதைப்போல், event handlers-இல் state-ஐ மனதில் substitute செய்யலாம்.
* கடந்த காலத்தில் உருவாக்கப்பட்ட event handlers, அவை உருவாக்கப்பட்ட render-இலிருந்த state values-ஐ கொண்டிருக்கும்.

</Recap>



<Challenges>

#### Traffic light ஒன்றை implement செய்யுங்கள் {/*implement-a-traffic-light*/}

Button அழுத்தும்போது toggle ஆகும் crosswalk light component இதோ:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        {walk ? 'நில்' : 'நடு'} என்று மாற்று
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'நடு' : 'நில்'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Click handler-க்கு `alert` ஒன்றை சேர்க்கவும். Light green ஆக இருந்து "நடு" என்று சொன்னால், button click செய்ததும் "அடுத்தது நில்" என்று சொல்ல வேண்டும். Light red ஆக இருந்து "நில்" என்று சொன்னால், button click செய்ததும் "அடுத்தது நடு" என்று சொல்ல வேண்டும்.

`alert`-ஐ `setWalk` call-க்கு முன் வைத்தாலும் பின் வைத்தாலும் வேறுபாடு இருக்கிறதா?

<Solution>

உங்கள் `alert` இதுபோல இருக்க வேண்டும்:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'அடுத்தது நில்' : 'அடுத்தது நடு');
  }

  return (
    <>
      <button onClick={handleClick}>
        {walk ? 'நில்' : 'நடு'} என்று மாற்று
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'நடு' : 'நில்'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

அதை `setWalk` call-க்கு முன் வைத்தாலும் பின் வைத்தாலும் வேறுபாடு இல்லை. அந்த render-ன் `walk` value fixed. `setWalk` call செய்வது அதை *அடுத்த* render-க்காக மட்டுமே மாற்றும்; முந்தைய render-இலிருந்து வந்த event handler-ஐ பாதிக்காது.

இந்த line முதலில் counter-intuitive போல தோன்றலாம்:

```js
alert(walk ? 'அடுத்தது நில்' : 'அடுத்தது நடு');
```

ஆனால் இதை இவ்வாறு படித்தால் அர்த்தமாகும்: "Traffic light இப்போது 'நடு' காட்டினால், message 'அடுத்தது நில்' என்று சொல்ல வேண்டும்." உங்கள் event handler-க்குள் உள்ள `walk` variable அந்த render-ன் `walk` value-க்கு match ஆகும்; அது மாறாது.

Substitution method-ஐ பயன்படுத்தி இது சரியானது என்பதை verify செய்யலாம். `walk` `true` ஆக இருக்கும்போது, உங்களுக்கு கிடைப்பது:

```js
<button onClick={() => {
  setWalk(false);
  alert('அடுத்தது நில்');
}}>
  நில் என்று மாற்று
</button>
<h1 style={{color: 'darkgreen'}}>
  நடு
</h1>
```

ஆகவே "நில் என்று மாற்று" click செய்வது `walk` `false` ஆக set செய்யப்பட்ட render ஒன்றை queue செய்து, "அடுத்தது நில்" என்று alert செய்கிறது.

</Solution>

</Challenges>
