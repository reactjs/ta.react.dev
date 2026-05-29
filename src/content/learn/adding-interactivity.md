---
title: Interactivity சேர்த்தல்
---

<Intro>

Screen-இல் உள்ள சில விஷயங்கள் user input-க்கு பதிலாக update ஆகின்றன. உதாரணமாக, image gallery-யை click செய்வது active image-ஐ மாற்றுகிறது. React-இல், காலத்துடன் மாறும் data *state* என்று அழைக்கப்படுகிறது. எந்த component-க்கும் state சேர்த்து, தேவையானபடி அதை update செய்யலாம். இந்த chapter-இல், interactions handle செய்யும், தங்கள் state-ஐ update செய்யும், மற்றும் காலத்துடன் வேறுபட்ட output-ஐ display செய்யும் components எழுதுவது எப்படி என்பதை கற்றுக்கொள்வீர்கள்.

</Intro>

<YouWillLearn isChapter={true}>

* [User-initiated events-ஐ handle செய்வது எப்படி](/learn/responding-to-events)
* [State மூலம் components தகவலை "நினைவில்" வைத்திருக்க செய்வது எப்படி](/learn/state-a-components-memory)
* [React இரண்டு phases-இல் UI-யை update செய்வது எப்படி](/learn/render-and-commit)
* [State-ஐ மாற்றிய உடனே அது ஏன் update ஆகாது](/learn/state-as-a-snapshot)
* [பல state updates-ஐ queue செய்வது எப்படி](/learn/queueing-a-series-of-state-updates)
* [State-இல் object-ஐ update செய்வது எப்படி](/learn/updating-objects-in-state)
* [State-இல் array-ஐ update செய்வது எப்படி](/learn/updating-arrays-in-state)

</YouWillLearn>

## Events-க்கு பதிலளித்தல் {/*responding-to-events*/}

உங்கள் JSX-க்கு *event handlers* சேர்க்க React அனுமதிக்கிறது. Event handlers என்பது clicking, hovering, form inputs-ல் focus செய்தல் போன்ற user interactions-க்கு பதிலாக trigger ஆகும் உங்கள் சொந்த functions.

`<button>` போன்ற built-in components, `onClick` போன்ற built-in browser events-ஐ மட்டுமே support செய்கின்றன. ஆனால் நீங்கள் உங்கள் சொந்த components-ஐயும் உருவாக்கலாம்; அவற்றின் event handler props-க்கு உங்களுக்கு விருப்பமான application-specific names கொடுக்கலாம்.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('இயக்கப்படுகிறது!')}
      onUploadImage={() => alert('Upload செய்யப்படுகிறது!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Movie-ஐ இயக்கு
      </Button>
      <Button onClick={onUploadImage}>
        Image-ஐ upload செய்
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Event handlers சேர்ப்பது எப்படி என்பதை அறிய **[Responding to Events](/learn/responding-to-events)**-ஐ படியுங்கள்.

</LearnMore>

## State: component-ன் memory {/*state-a-components-memory*/}

Interaction-ன் விளைவாக screen-இல் உள்ளதை மாற்ற components-க்கு அடிக்கடி தேவைப்படும். Form-இல் type செய்தால் input field update ஆக வேண்டும்; image carousel-இல் "next" click செய்தால் காட்டப்படும் image மாற வேண்டும்; "buy" click செய்தால் product shopping cart-இல் சேர வேண்டும். Components விஷயங்களை "நினைவில்" வைத்திருக்க வேண்டும்: current input value, current image, shopping cart. React-இல், இத்தகைய component-specific memory *state* என்று அழைக்கப்படுகிறது.

[`useState`](/reference/react/useState) Hook மூலம் component-க்கு state சேர்க்கலாம். *Hooks* என்பது உங்கள் components React features-ஐ பயன்படுத்த அனுமதிக்கும் சிறப்பு functions (state அவற்றில் ஒன்று). `useState` Hook state variable ஒன்றை declare செய்ய அனுமதிக்கிறது. அது initial state-ஐ எடுத்து, இரண்டு values கொண்ட pair-ஐ return செய்கிறது: current state, அதை update செய்யும் state setter function.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Image gallery click போது state-ஐ எப்படி பயன்படுத்தி update செய்கிறது என்பதற்கான example:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        கலைஞர்: {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        விவரங்களை {showMore ? 'மறை' : 'காட்டு'}
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Pre-Hispanic symbols-ஐ குறிப்பது போன்ற abstract themes-க்காக Colvin பெரும்பாலும் அறியப்பட்டாலும், neurosurgery-க்கு homage ஆன இந்த மிகப்பெரிய sculpture, அவரது மிகவும் அடையாளம் காணக்கூடிய public art pieces-இல் ஒன்று.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'மனித மூளையை விரல் நுனிகளில் மென்மையாகத் தாங்கும், குறுக்காக அமைந்த இரண்டு கைகளின் bronze statue.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'இந்த மிகப்பெரிய (75 ft. அல்லது 23m) silver flower Buenos Aires-இல் உள்ளது. மாலையில் அல்லது பலமான காற்று வீசும்போது petals மூடிக் கொள்ளவும், காலையில் திறக்கவும் அது வடிவமைக்கப்பட்டுள்ளது.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'Reflective mirror-like petals மற்றும் வலுவான stamens கொண்ட மிகப்பெரிய metallic flower sculpture.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson சமத்துவம், சமூக நீதி, மேலும் மனிதகுலத்தின் essential மற்றும் spiritual qualities மீது கொண்ட அக்கறைக்காக அறியப்பட்டார். இந்த பெரும் (7ft. அல்லது 2.13m) bronze, அவர் "universal humanity உணர்வுடன் நிரம்பிய symbolic Black presence" என்று விவரித்ததை பிரதிநிதித்துவப்படுத்துகிறது.',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'மனிதத் தலை போல் தோன்றும் sculpture நிலைத்தும் solemn ஆகவும் தெரிகிறது. அது அமைதியையும் serenity-யையும் வெளிப்படுத்துகிறது.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Easter Island-இல் அமைந்துள்ள 1,000 moai, அல்லது இன்றும் உள்ள monumental statues, early Rapa Nui மக்களால் உருவாக்கப்பட்டவை; சிலர் அவை deified ancestors-ஐ பிரதிநிதித்துவப்படுத்தின என்று நம்புகிறார்கள்.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'அளவுக்கு மீறி பெரிய தலைகளும் சோகம் நிறைந்த முகங்களும் கொண்ட மூன்று monumental stone busts.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanas என்பது femininity மற்றும் maternity-யின் symbols ஆன triumphant creatures. ஆரம்பத்தில் Saint Phalle Nanas-க்காக fabric மற்றும் found objects பயன்படுத்தினார்; பின்னர் மேலும் vibrant effect பெற polyester-ஐ அறிமுகப்படுத்தினார்.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'மகிழ்ச்சி வெளிப்படுத்தும் colorful costume அணிந்த whimsical dancing female figure-ன் பெரிய mosaic sculpture.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'இந்த abstract bronze sculpture, Yorkshire Sculpture Park-இல் உள்ள The Family of Man series-ன் ஒரு பகுதி. Hepworth உலகின் literal representations உருவாக்காமல், மக்கள் மற்றும் landscapes-இல் இருந்து ஊக்கமடைந்த abstract forms உருவாக்கத் தேர்ந்தெடுத்தார்.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'மனித figure-ஐ நினைவூட்டும் வகையில் ஒன்றின் மேல் ஒன்று stacked செய்யப்பட்ட மூன்று elements கொண்ட உயரமான sculpture.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: 'நான்கு தலைமுறை woodcarvers-இலிருந்து வந்த Fakeye-ன் work, traditional மற்றும் contemporary Yoruba themes-ஐ blended செய்தது.',
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'Patterns-ஆல் அலங்கரிக்கப்பட்ட குதிரையின் மேல் கவனமான முகத்துடன் இருக்கும் warrior-ன் intricate wood sculpture.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: 'Youth மற்றும் beauty-யின் fragility மற்றும் impermanence-க்கு metaphor ஆக fragmented body sculptures-க்காக Szapocznikow அறியப்பட்டார். இந்த sculpture, ஒன்றின் மேல் ஒன்று stacked செய்யப்பட்ட மிகவும் realistic ஆன இரண்டு பெரிய bellies-ஐ காட்டுகிறது; ஒவ்வொன்றும் சுமார் ஐந்து feet (1.5m) உயரம்.',
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'Classical sculptures-இல் உள்ள bellies-இலிருந்து மிகவும் வேறுபட்ட folds-ன் cascade-ஐ நினைவூட்டும் sculpture.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'Terracotta Army என்பது சீனாவின் முதல் Emperor Qin Shi Huang-ன் armies-ஐ depict செய்யும் terracotta sculptures-ன் collection. இந்த army-யில் 8,000-க்கும் அதிகமான soldiers, 520 horses கொண்ட 130 chariots, மற்றும் 150 cavalry horses இருந்தன.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: 'ஒவ்வொன்றும் தனித்த facial expression மற்றும் armor கொண்ட 12 solemn warriors-ன் terracotta sculptures.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'New York City debris-இலிருந்து objects scavenging செய்து, பின்னர் அவற்றை monumental constructions ஆக assemble செய்வதற்காக Nevelson அறியப்பட்டார். இதில், bedpost, juggling pin, seat fragment போன்ற disparate parts-ஐ பயன்படுத்தி, Cubism-ன் geometric abstraction of space and form தாக்கத்தை பிரதிபலிக்கும் boxes-களாக அவற்றை nail மற்றும் glue செய்தார்.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'தனித்தனி elements முதலில் தெளிவாகத் தெரியாத black matte sculpture.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar traditional மற்றும் modern, natural மற்றும் industrial ஆகியவற்றை merge செய்கிறார். அவரது art மனிதன் மற்றும் இயற்கை இடையிலான relationship-ஐ மையப்படுத்துகிறது. அவரது work abstract ஆகவும் figurative ஆகவும் compelling, gravity defying, மேலும் "unlikely materials-ன் fine synthesis" என்று விவரிக்கப்பட்டது.',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'Concrete wall-இல் mounted செய்யப்பட்டு floor-க்கு இறங்கும் pale wire-like sculpture. அது இலகுவாகத் தோன்றுகிறது.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Zoo நீரில் மூழ்கி விளையாடும் hippos இடம்பெறும் Hippo Square ஒன்றை commission செய்தது.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'நீரில் நீந்துவது போல sidewalk-இலிருந்து மேலெழும் bronze hippo sculptures குழு.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

ஒரு value-ஐ நினைவில் வைத்து interaction போது அதை update செய்வது எப்படி என்பதை அறிய **[State: A Component's Memory](/learn/state-a-components-memory)**-ஐ படியுங்கள்.

</LearnMore>

## Render மற்றும் commit {/*render-and-commit*/}

உங்கள் components screen-இல் display ஆகும் முன், அவை React-ஆல் rendered செய்யப்பட வேண்டும். இந்த process-இன் steps-ஐப் புரிந்துகொள்வது, உங்கள் code எப்படி execute ஆகிறது மற்றும் அதன் behavior-ஐ எப்படி விளக்குவது என்பதைச் சிந்திக்க உதவும்.

உங்கள் components kitchen-இல் சுவையான dishes-ஐ ingredients-இலிருந்து assemble செய்யும் cooks என்று கற்பனை செய்யுங்கள். இந்த scenario-வில், React customers-இலிருந்து requests எடுத்து அவர்களுக்கு orders கொண்டு வரும் waiter. UI-ஐ request செய்து serve செய்வதற்கான இந்த process மூன்று steps கொண்டது:

1. Render ஒன்றை **Triggering** செய்தல் (diner-ன் order-ஐ kitchen-க்கு deliver செய்தல்)
2. Component-ஐ **Rendering** செய்தல் (kitchen-இல் order-ஐ தயாரித்தல்)
3. DOM-க்கு **Committing** செய்தல் (order-ஐ table-ல் வைப்பது)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="Restaurant-இல் server போல React, users-இலிருந்து orders எடுத்து Component Kitchen-க்கு deliver செய்கிறது." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="Card Chef React-க்கு புதிய Card component ஒன்றை தருகிறார்." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React user-ன் table-க்கு Card-ஐ deliver செய்கிறது." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

UI update-ன் lifecycle-ஐ அறிய **[Render and Commit](/learn/render-and-commit)**-ஐ படியுங்கள்.

</LearnMore>

## Snapshot ஆக state {/*state-as-a-snapshot*/}

சாதாரண JavaScript variables-க்கு மாறாக, React state snapshot போல நடக்கிறது. அதை set செய்வது உங்களிடம் ஏற்கனவே உள்ள state variable-ஐ மாற்றாது; அதற்கு பதிலாக re-render ஒன்றை trigger செய்கிறது. இது முதலில் ஆச்சரியமாக இருக்கலாம்!

```js
console.log(count);  // 0
setCount(count + 1); // 1 உடன் re-render request செய்
console.log(count);  // இன்னும் 0!
```

இந்த behavior subtle bugs-ஐத் தவிர்க்க உதவுகிறது. சிறிய chat app ஒன்று இதோ. முதலில் "அனுப்பு" அழுத்தி, *பிறகு* recipient-ஐ Bob-ஆக மாற்றினால் என்ன நடக்கும் என்று ஊகிக்கவும். ஐந்து seconds கழித்து `alert`-இல் யாருடைய பெயர் தோன்றும்?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('வணக்கம்');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`நீங்கள் ${to}-க்கு "${message}" என்று சொன்னீர்கள்`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        பெறுநர்:{' '}
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


<LearnMore path="/learn/state-as-a-snapshot">

Event handlers-க்குள் state ஏன் "fixed" ஆகவும் மாறாததாகவும் தோன்றுகிறது என்பதை அறிய **[State as a Snapshot](/learn/state-as-a-snapshot)**-ஐ படியுங்கள்.

</LearnMore>

## State updates தொடரை queue செய்தல் {/*queueing-a-series-of-state-updates*/}

இந்த component-இல் bug உள்ளது: "+3" click செய்தால் score ஒருமுறை மட்டுமே increment ஆகிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>மதிப்பெண்: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

இது ஏன் நடக்கிறது என்பதை [State as a Snapshot](/learn/state-as-a-snapshot) விளக்குகிறது. State set செய்வது புதிய re-render ஒன்றை request செய்கிறது, ஆனால் ஏற்கனவே running code-இல் அதை மாற்றாது. எனவே `setScore(score + 1)` call செய்த உடனேயும் `score` தொடர்ந்து `0` ஆகவே இருக்கும்.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

State set செய்யும்போது *updater function* ஒன்றை pass செய்வதன் மூலம் இதை fix செய்யலாம். `setScore(score + 1)`-ஐ `setScore(s => s + 1)`-ஆல் replace செய்வது "+3" button-ஐ எப்படி fix செய்கிறது என்பதை கவனியுங்கள். இது பல state updates-ஐ queue செய்ய அனுமதிக்கிறது.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>மதிப்பெண்: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

State updates தொடரை எப்படி queue செய்வது என்பதை அறிய **[Queueing a Series of State Updates](/learn/queueing-a-series-of-state-updates)**-ஐ படியுங்கள்.

</LearnMore>

## State-இல் objects update செய்தல் {/*updating-objects-in-state*/}

State, objects உட்பட எந்த வகையான JavaScript value-ஐயும் hold செய்ய முடியும். ஆனால் React state-இல் வைத்திருக்கும் objects மற்றும் arrays-ஐ நேரடியாக மாற்றக்கூடாது. அதற்கு பதிலாக, object அல்லது array-ஐ update செய்யும்போது, புதிய ஒன்றை உருவாக்க வேண்டும் (அல்லது existing ஒன்றின் copy செய்ய வேண்டும்), பின்னர் அந்த copy-ஐப் பயன்படுத்த state-ஐ update செய்ய வேண்டும்.

பொதுவாக, மாற்ற விரும்பும் objects மற்றும் arrays-ஐ copy செய்ய `...` spread syntax-ஐ பயன்படுத்துவீர்கள். உதாரணமாக, nested object-ஐ update செய்வது இதுபோல் இருக்கலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        பெயர்:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        தலைப்பு:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        நகரம்:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        படம்:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' - கலைஞர்: '}
        {person.name}
        <br />
        ({person.artwork.city}-இல் உள்ளது)
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Code-இல் objects copy செய்வது tedious ஆக இருந்தால், repetitive code-ஐ குறைக்க [Immer](https://github.com/immerjs/use-immer) போன்ற library ஒன்றை பயன்படுத்தலாம்:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        பெயர்:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        தலைப்பு:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        நகரம்:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        படம்:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' - கலைஞர்: '}
        {person.name}
        <br />
        ({person.artwork.city}-இல் உள்ளது)
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

Objects-ஐ சரியாக update செய்வது எப்படி என்பதை அறிய **[Updating Objects in State](/learn/updating-objects-in-state)**-ஐ படியுங்கள்.

</LearnMore>

## State-இல் arrays update செய்தல் {/*updating-arrays-in-state*/}

Arrays என்பது state-இல் store செய்யக்கூடிய மற்றொரு mutable JavaScript objects வகை; அவற்றை read-only ஆக நடத்த வேண்டும். Objects போலவே, state-இல் store செய்யப்பட்ட array-ஐ update செய்யும்போது, புதிய ஒன்றை உருவாக்க வேண்டும் (அல்லது existing ஒன்றின் copy செய்ய வேண்டும்), பின்னர் புதிய array-ஐ பயன்படுத்த state set செய்ய வேண்டும்:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>கலை பார்க்க வேண்டிய பட்டியல்</h1>
      <h2>நான் பார்க்க வேண்டிய கலைப் பட்டியல்:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Code-இல் arrays copy செய்வது tedious ஆக இருந்தால், repetitive code-ஐ குறைக்க [Immer](https://github.com/immerjs/use-immer) போன்ற library ஒன்றை பயன்படுத்தலாம்:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>கலை பார்க்க வேண்டிய பட்டியல்</h1>
      <h2>நான் பார்க்க வேண்டிய கலைப் பட்டியல்:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

Arrays-ஐ சரியாக update செய்வது எப்படி என்பதை அறிய **[Updating Arrays in State](/learn/updating-arrays-in-state)**-ஐ படியுங்கள்.

</LearnMore>

## அடுத்து என்ன? {/*whats-next*/}

இந்த chapter-ஐ page by page படிக்கத் தொடங்க [Responding to Events](/learn/responding-to-events)-க்கு செல்லுங்கள்!

அல்லது, இந்த topics உங்களுக்கு ஏற்கனவே தெரிந்திருந்தால், [Managing State](/learn/managing-state) பற்றி படிக்கலாமே?
