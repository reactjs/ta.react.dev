---
title: Components-ஐ pure ஆக வைத்திருத்தல்
---

<Intro>

சில JavaScript functions *pure* ஆக இருக்கும். Pure functions ஒரு calculation மட்டும் செய்து அதற்கு மேல் எதையும் செய்யாது. உங்கள் components-ஐ pure functions ஆக மட்டுமே strict ஆக எழுதினால், codebase வளரும்போது குழப்பமான bugs மற்றும் unpredictable behavior-ன் முழு வகையையே தவிர்க்க முடியும். ஆனால் இந்த நன்மைகளைப் பெற, நீங்கள் பின்பற்ற வேண்டிய சில rules உள்ளன.

</Intro>

<YouWillLearn>

* Purity என்றால் என்ன, அது bugs தவிர்க்க எப்படி உதவுகிறது
* Render phase-க்கு வெளியே changes வைத்திருப்பதன் மூலம் components-ஐ pure ஆக வைத்திருப்பது எப்படி
* Components-இல் mistakes கண்டுபிடிக்க Strict Mode-ஐ எப்படி பயன்படுத்துவது

</YouWillLearn>

## Purity: Formulas போல components {/*purity-components-as-formulas*/}

Computer science-இல் (குறிப்பாக functional programming உலகில்), [pure function](https://wikipedia.org/wiki/Pure_function) என்பது பின்வரும் பண்புகள் கொண்ட function:

* **தன் வேலையை மட்டும் பார்க்கும்.** அது call செய்யப்படுவதற்கு முன் இருந்த எந்த objects அல்லது variables-ஐயும் மாற்றாது.
* **அதே inputs, அதே output.** அதே inputs கொடுக்கப்பட்டால், pure function எப்போதும் அதே result-ஐ return செய்ய வேண்டும்.

Pure functions-க்கு ஒரு example உங்களுக்கு ஏற்கனவே தெரிந்திருக்கலாம்: கணித formulas.

இந்த கணித formula-ஐ கவனியுங்கள்: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

<Math><MathI>x</MathI> = 2</Math> என்றால் <Math><MathI>y</MathI> = 4</Math>. எப்போதும்.

<Math><MathI>x</MathI> = 3</Math> என்றால் <Math><MathI>y</MathI> = 6</Math>. எப்போதும்.

<Math><MathI>x</MathI> = 3</Math> என்றால், நேரம் அல்லது stock market state-ஐப் பொறுத்து <MathI>y</MathI> சில நேரங்களில் <Math>9</Math> அல்லது <Math>–1</Math> அல்லது <Math>2.5</Math> ஆக இருக்காது.

<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> மற்றும் <Math><MathI>x</MathI> = 3</Math> என்றால், <MathI>y</MathI> _எப்போதும்_ <Math>6</Math> ஆக இருக்கும்.

இதைக் JavaScript function ஆக மாற்றினால், அது இதுபோல் இருக்கும்:

```js
function double(number) {
  return 2 * number;
}
```

மேலுள்ள example-இல், `double` ஒரு **pure function.** அதற்கு `3` pass செய்தால், அது `6` return செய்யும். எப்போதும்.

React இந்த concept-ஐச் சுற்றியே design செய்யப்பட்டுள்ளது. **நீங்கள் எழுதும் ஒவ்வொரு component-யும் pure function என்று React கருதுகிறது.** அதாவது, நீங்கள் எழுதும் React components அதே inputs கொடுக்கப்பட்டால் எப்போதும் அதே JSX-ஐ return செய்ய வேண்டும்:

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>
      <li>{drinkers} cups தண்ணீரை கொதிக்கவைக்கவும்.</li>
      <li>{drinkers} spoon tea மற்றும் {0.5 * drinkers} spoon மசாலா சேர்க்கவும்.</li>
      <li>{0.5 * drinkers} cups பாலை கொதிக்க சேர்த்து, சுவைக்கேற்ப சர்க்கரை சேர்க்கவும்.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>மசாலா Chai Recipe</h1>
      <h2>இருவருக்கு</h2>
      <Recipe drinkers={2} />
      <h2>ஒரு கூட்டத்துக்கு</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

`Recipe`-க்கு `drinkers={2}` pass செய்தால், அது `2 cups தண்ணீர்` கொண்ட JSX return செய்யும். எப்போதும்.

`drinkers={4}` pass செய்தால், அது `4 cups தண்ணீர்` கொண்ட JSX return செய்யும். எப்போதும்.

கணித formula போலவே.

உங்கள் components-ஐ recipes போல நினைக்கலாம்: cooking process போது புதிய ingredients அறிமுகப்படுத்தாமல் அவற்றைப் பின்பற்றினால், ஒவ்வொரு முறையும் அதே dish கிடைக்கும். அந்த "dish" என்பது component React-க்கு [render](/learn/render-and-commit) செய்ய serve செய்யும் JSX.

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="x பேருக்கான tea recipe: x cups தண்ணீர் எடுத்து, x spoons tea மற்றும் 0.5x spoons மசாலா சேர்த்து, 0.5x cups பால் சேர்க்கவும்" />

## Side Effects: எதிர்பார்த்த மற்றும் எதிர்பாராத விளைவுகள் {/*side-effects-unintended-consequences*/}

React-ன் rendering process எப்போதும் pure ஆக இருக்க வேண்டும். Components தங்கள் JSX-ஐ மட்டும் *return* செய்ய வேண்டும்; rendering-க்கு முன் இருந்த எந்த objects அல்லது variables-ஐயும் *மாற்றக்கூடாது*--அப்படிச் செய்தால் அவை impure ஆகிவிடும்!

இந்த rule-ஐ உடைக்கும் component ஒன்று இங்கே:

<Sandpack>

```js {expectedErrors: {'react-compiler': [5]}}
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>விருந்தினர் #{guest}-க்கான tea cup</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

இந்த component அதற்கு வெளியே declared செய்யப்பட்ட `guest` variable-ஐ read செய்து write செய்கிறது. இதன் பொருள் **இந்த component-ஐ பலமுறை call செய்தால் வெவ்வேறு JSX உருவாகும்!** மேலும், _மற்ற_ components `guest`-ஐ read செய்தால், அவை எப்போது rendered செய்யப்பட்டன என்பதைப் பொறுத்து அவற்றும் வெவ்வேறு JSX உருவாக்கும்! அது predictable அல்ல.

நமது formula <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>-க்கு திரும்பினால், இப்போது <Math><MathI>x</MathI> = 2</Math> என்றாலும், <Math><MathI>y</MathI> = 4</Math> என்று நம்ப முடியாது. Tests fail ஆகலாம், users குழப்பமடையலாம், planes sky-இலிருந்து விழலாம்--இது எப்படி confusing bugs-க்கு வழிவகுக்கும் என்பதை பார்க்க முடிகிறது!

[`guest`-ஐ prop ஆக pass செய்வதன் மூலம்](/learn/passing-props-to-a-component) இந்த component-ஐ fix செய்யலாம்:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>விருந்தினர் #{guest}-க்கான tea cup</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

இப்போது உங்கள் component pure ஆக உள்ளது, ஏனெனில் அது return செய்யும் JSX `guest` prop-ஐ மட்டுமே சார்ந்துள்ளது.

பொதுவாக, உங்கள் components எந்த particular order-இல் rendered ஆகும் என்று எதிர்பார்க்கக்கூடாது. <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>-ஐ <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>-க்கு முன் அல்லது பின் call செய்வது mattered அல்ல: இரண்டு formulas-மும் ஒன்றுக்கொன்று independent ஆக resolve ஆகும். அதேபோல், ஒவ்வொரு component-மும் "தனக்காகவே சிந்திக்க" வேண்டும்; rendering போது மற்றவற்றுடன் coordinate செய்யவோ, அவற்றைச் சாரவோ முயலக்கூடாது. Rendering ஒரு school exam போல: ஒவ்வொரு component-மும் JSX-ஐ தானாக calculate செய்ய வேண்டும்!

<DeepDive>

#### StrictMode மூலம் impure calculations கண்டறிதல் {/*detecting-impure-calculations-with-strict-mode*/}

அவற்றை எல்லாம் இன்னும் பயன்படுத்தவில்லை என்றாலும், React-இல் rendering போது read செய்யக்கூடிய மூன்று வகை inputs உள்ளன: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), மற்றும் [context](/learn/passing-data-deeply-with-context). இந்த inputs-ஐ எப்போதும் read-only ஆக நடத்த வேண்டும்.

User input-க்கு பதிலாக ஏதாவது ஒன்றை *மாற்ற* விரும்பினால், variable-க்கு write செய்வதற்குப் பதிலாக [state set செய்ய](/learn/state-a-components-memory) வேண்டும். Component rendering ஆகும் போது preexisting variables அல்லது objects-ஐ ஒருபோதும் மாற்றக்கூடாது.

Development போது ஒவ்வொரு component function-ஐயும் இரண்டு முறை call செய்யும் "Strict Mode" ஒன்றை React வழங்குகிறது. **Component functions-ஐ இருமுறை call செய்வதன் மூலம், இந்த rules-ஐ உடைக்கும் components-ஐ Strict Mode கண்டுபிடிக்க உதவுகிறது.**

Original example "விருந்தினர் #1", "விருந்தினர் #2", "விருந்தினர் #3" என்பதற்குப் பதிலாக "விருந்தினர் #2", "விருந்தினர் #4", "விருந்தினர் #6" காட்டியதை கவனியுங்கள். Original function impure, எனவே அதை இருமுறை call செய்தது அதை உடைத்தது. ஆனால் fixed pure version function ஒவ்வொரு முறையும் இருமுறை call செய்யப்பட்டாலும் வேலை செய்கிறது. **Pure functions calculate மட்டும் செய்கின்றன; எனவே அவற்றை இருமுறை call செய்தால் எதுவும் மாறாது**--`double(2)`-ஐ இருமுறை call செய்தாலும் return ஆகும் value மாறாதது போல, <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>-ஐ இருமுறை solve செய்தாலும் <MathI>y</MathI> என்ன என்பது மாறாதது போல. அதே inputs, அதே outputs. எப்போதும்.

Strict Mode production-இல் எந்த effect-உம் இல்லை, எனவே அது உங்கள் users-க்கான app-ஐ slow செய்யாது. Strict Mode-ஐ opt in செய்ய, உங்கள் root component-ஐ `<React.StrictMode>`-க்குள் wrap செய்யலாம். சில frameworks இதை default ஆக செய்கின்றன.

</DeepDive>

### Local mutation: உங்கள் component-ன் சிறிய ரகசியம் {/*local-mutation-your-components-little-secret*/}

மேலுள்ள example-இல், பிரச்சினை என்னவெனில் component rendering போது *preexisting* variable-ஐ மாற்றியது. இது பொதுவாக **"mutation"** என்று அழைக்கப்படுகிறது; கொஞ்சம் பயமுறுத்தும் சொல்லாக. Pure functions function scope-க்கு வெளியே உள்ள variables-ஐயோ, call-க்கு முன் உருவாக்கப்பட்ட objects-ஐயோ mutate செய்யாது--அப்படிச் செய்தால் அவை impure ஆகும்!

ஆனால், **rendering போது நீங்கள் *இப்போதுதான்* உருவாக்கிய variables மற்றும் objects-ஐ மாற்றுவது முற்றிலும் சரி.** இந்த example-இல், நீங்கள் `[]` array ஒன்றை உருவாக்கி, அதை `cups` variable-க்கு assign செய்து, அதில் ஒரு dozen cups-ஐ `push` செய்கிறீர்கள்:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>விருந்தினர் #{guest}-க்கான tea cup</h2>;
}

export default function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

`cups` variable அல்லது `[]` array `TeaGathering` function-க்கு வெளியே உருவாக்கப்பட்டிருந்தால், இது பெரிய பிரச்சினையாக இருக்கும்! அந்த array-க்கு items push செய்வதன் மூலம் *preexisting* object-ஐ மாற்றியிருப்பீர்கள்.

ஆனால் இது சரி, ஏனெனில் அவற்றை *அதே render போது*, `TeaGathering`-க்குள் உருவாக்கியுள்ளீர்கள். `TeaGathering`-க்கு வெளியே உள்ள எந்த code-க்கும் இது நடந்தது ஒருபோதும் தெரியாது. இது **"local mutation"** என்று அழைக்கப்படுகிறது--உங்கள் component-ன் சிறிய ரகசியம் போல.

## எங்கு side effects ஏற்படுத்தலாம் {/*where-you-_can_-cause-side-effects*/}

Functional programming purity-யை அதிகமாக சார்ந்திருந்தாலும், ஒருகட்டத்தில் எங்காவது _ஏதாவது_ மாற வேண்டியிருக்கும். Programming-ன் நோக்கமே அதுதான்! இந்த changes--screen update செய்தல், animation தொடங்குதல், data மாற்றுதல்--**side effects** என்று அழைக்கப்படுகின்றன. அவை rendering போது அல்லாமல் _"side-இல்"_ நடக்கும் விஷயங்கள்.

React-இல், **side effects பொதுவாக [event handlers](/learn/responding-to-events)-க்குள் இருக்க வேண்டும்.** Event handlers என்பது நீங்கள் ஏதாவது action செய்தால் React run செய்யும் functions--உதாரணமாக, button click செய்தால். Event handlers உங்கள் component-க்குள் *defined* செய்யப்பட்டிருந்தாலும், அவை rendering *போது* run ஆகாது! **எனவே event handlers pure ஆக இருக்க வேண்டியதில்லை.**

மற்ற எல்லா options-உம் exhausted ஆகி, உங்கள் side effect-க்கு சரியான event handler கண்டுபிடிக்க முடியாவிட்டால், உங்கள் component-இல் [`useEffect`](/reference/react/useEffect) call மூலம் அதை returned JSX-க்கு attach செய்யலாம். Rendering-க்கு பிறகு, side effects allowed ஆகும் நேரத்தில், அதை execute செய்ய React-க்கு இது சொல்கிறது. **ஆனால், இந்த அணுகுமுறை உங்கள் கடைசி வழியாக இருக்க வேண்டும்.**

சாத்தியமானபோது, rendering மட்டும் கொண்டு உங்கள் logic-ஐ express செய்ய முயலுங்கள். அது எவ்வளவு தூரம் அழைத்துச் செல்லும் என்று நீங்கள் ஆச்சரியப்படுவீர்கள்!

<DeepDive>

#### React purity பற்றி ஏன் கவலைப்படுகிறது? {/*why-does-react-care-about-purity*/}

Pure functions எழுத சிறிது பழக்கமும் discipline-உம் தேவை. ஆனால் அது அற்புதமான வாய்ப்புகளையும் unlock செய்கிறது:

* உங்கள் components வேறு environment-இல் run ஆகலாம்--உதாரணமாக, server-இல்! அதே inputs-க்கு அதே result return செய்வதால், ஒரு component பல user requests-க்கு serve செய்ய முடியும்.
* Inputs மாறாத components-ன் [rendering-ஐ skip](/reference/react/memo) செய்வதன் மூலம் performance மேம்படுத்தலாம். Pure functions எப்போதும் அதே results return செய்வதால், அவற்றை cache செய்வது safe.
* Deep component tree ஒன்றின் rendering நடுவே data மாறினால், outdated render-ஐ முடிக்க நேரம் வீணாக்காமல் React rendering-ஐ restart செய்ய முடியும். Purity எந்த நேரத்திலும் calculation stop செய்வதை safe ஆக்குகிறது.

நாங்கள் கட்டும் ஒவ்வொரு புதிய React feature-மும் purity-யைப் பயன்படுத்துகிறது. Data fetching-இலிருந்து animations, performance வரை, components-ஐ pure ஆக வைத்திருப்பது React paradigm-ன் சக்தியை unlock செய்கிறது.

</DeepDive>

<Recap>

* Component pure ஆக இருக்க வேண்டும், அதாவது:
  * **தன் வேலையை மட்டும் பார்க்க வேண்டும்.** Rendering-க்கு முன் இருந்த objects அல்லது variables எதையும் மாற்றக்கூடாது.
  * **அதே inputs, அதே output.** அதே inputs கொடுக்கப்பட்டால், component எப்போதும் அதே JSX-ஐ return செய்ய வேண்டும்.
* Rendering எந்த நேரத்திலும் நடக்கலாம், எனவே components ஒன்றின் rendering sequence-ஐ மற்றொன்று சாரக்கூடாது.
* உங்கள் components rendering-க்கு பயன்படுத்தும் inputs எதையும் mutate செய்யக்கூடாது. இதில் props, state, context அடங்கும். Screen update செய்ய, preexisting objects mutate செய்வதற்குப் பதிலாக state-ஐ ["set"](/learn/state-a-components-memory) செய்யுங்கள்.
* உங்கள் component-ன் logic-ஐ நீங்கள் return செய்யும் JSX-இல் express செய்ய முயலுங்கள். "விஷயங்களை மாற்ற" வேண்டியபோது, வழக்கமாக அதை event handler-இல் செய்ய வேண்டும். கடைசி வழியாக, `useEffect` பயன்படுத்தலாம்.
* Pure functions எழுத சிறிது practice தேவை, ஆனால் அது React paradigm-ன் சக்தியை unlock செய்கிறது.

</Recap>



<Challenges>

#### உடைந்த clock-ஐ சரிசெய்யுங்கள் {/*fix-a-broken-clock*/}

இந்த component midnight முதல் காலை ஆறு மணி வரை `<h1>`-ன் CSS class-ஐ `"night"` ஆகவும், மற்ற எல்லா நேரங்களிலும் `"day"` ஆகவும் set செய்ய முயல்கிறது. ஆனால் அது வேலை செய்யவில்லை. இந்த component-ஐ சரிசெய்ய முடியுமா?

உங்கள் solution வேலை செய்கிறதா என்பதை verify செய்ய, computer-ன் timezone-ஐ தற்காலிகமாக மாற்றலாம். Current time midnight மற்றும் காலை ஆறு மணிக்கு இடையில் இருந்தால், clock inverted colors கொண்டிருக்க வேண்டும்!

<Hint>

Rendering ஒரு *calculation*; அது விஷயங்களை "செய்ய" முயலக்கூடாது. அதே idea-வை வேறுவிதமாக express செய்ய முடியுமா?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
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
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

`className`-ஐ calculate செய்து render output-இல் சேர்ப்பதன் மூலம் இந்த component-ஐ fix செய்யலாம்:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
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
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

இந்த example-இல், side effect (DOM modify செய்தல்) முற்றிலும் தேவையில்லை. நீங்கள் JSX மட்டும் return செய்ய வேண்டியது தான்.

</Solution>

#### உடைந்த profile-ஐ சரிசெய்யுங்கள் {/*fix-a-broken-profile*/}

இரண்டு `Profile` components வெவ்வேறு data-வுடன் side by side render செய்யப்படுகின்றன. முதல் profile-இல் "சுருக்கு" அழுத்தி, பின்னர் அதை "விரி" செய்யுங்கள். இப்போது இரண்டு profiles-மும் ஒரே person-ஐ காட்டுவதைக் கவனிப்பீர்கள். இது bug.

Bug-ன் காரணத்தை கண்டுபிடித்து அதைச் சரிசெய்யுங்கள்.

<Hint>

Buggy code `Profile.js`-இல் உள்ளது. அதை முழுவதும் top to bottom வாசித்துள்ளீர்கள் என்பதை உறுதி செய்யுங்கள்!

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}} src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'சுருக்கு' : 'விரி'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

பிரச்சினை என்னவெனில் `Profile` component `currentPerson` எனும் preexisting variable-க்கு write செய்கிறது, மேலும் `Header` மற்றும் `Avatar` components அதிலிருந்து read செய்கின்றன. இதனால் *மூன்றும்* impure ஆகி predict செய்ய கடினமாகிறது.

Bug fix செய்ய, `currentPerson` variable-ஐ remove செய்யுங்கள். அதற்கு பதிலாக, `Profile`-இலிருந்து `Header` மற்றும் `Avatar`-க்கு அனைத்து தகவலையும் props மூலம் pass செய்யுங்கள். இரு components-க்கும் `person` prop சேர்த்து, அதை முழுவதும் கீழே pass செய்ய வேண்டும்.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'சுருக்கு' : 'விரி'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Component functions எந்த particular order-இல் execute ஆகும் என்று React guarantee செய்யாது என்பதை நினைவில் கொள்ளுங்கள்; எனவே variables set செய்வதன் மூலம் அவற்றுக்கிடையே communicate செய்ய முடியாது. அனைத்து communication-மும் props மூலம் நடக்க வேண்டும்.

</Solution>

#### உடைந்த story tray-ஐ சரிசெய்யுங்கள் {/*fix-a-broken-story-tray*/}

உங்கள் company-யின் CEO, உங்கள் online clock app-க்கு "stories" சேர்க்கச் சொல்கிறார்; நீங்கள் இல்லை என்று சொல்ல முடியாது. `stories` list ஒன்றை ஏற்று, அதன் பின் "Story உருவாக்கு" placeholder காட்டும் `StoryTray` component ஒன்றை எழுதியுள்ளீர்கள்.

Prop ஆக பெறும் `stories` array-ன் இறுதியில் இன்னொரு fake story push செய்வதன் மூலம் "Story உருவாக்கு" placeholder-ஐ implement செய்தீர்கள். ஆனால் ஏதோ காரணத்தால், "Story உருவாக்கு" ஒன்றுக்கு மேற்பட்ட முறை தோன்றுகிறது. Issue-ஐ fix செய்யுங்கள்.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Story உருவாக்கு'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>இப்போது நேரம் {time.toLocaleTimeString()}.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Clock update ஆகும் ஒவ்வொரு முறையும் "Story உருவாக்கு" *இருமுறை* சேர்க்கப்படுவதை கவனியுங்கள். Rendering போது mutation உள்ளது என்பதற்கான hint இது--இத்தகைய issues தெளிவாகத் தெரிய Strict Mode components-ஐ இருமுறை call செய்கிறது.

`StoryTray` function pure அல்ல. பெற்ற `stories` array (ஒரு prop!)-இல் `push` call செய்வதால், `StoryTray` rendering தொடங்குவதற்கு *முன்* உருவாக்கப்பட்ட object-ஐ அது mutate செய்கிறது. இது buggy ஆகவும் predict செய்ய மிகவும் கடினமாகவும் ஆக்குகிறது.

நேரடியான fix, array-ஐத் தொடவே வேண்டாம்; "Story உருவாக்கு"-ஐ தனியாக render செய்யுங்கள்:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Story உருவாக்கு</li>
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>இப்போது நேரம் {time.toLocaleTimeString()}.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

மாற்றாக, item ஒன்றை push செய்வதற்கு முன் (existing array-ஐ copy செய்து) _புதிய_ array உருவாக்கலாம்:

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  const storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Story உருவாக்கு'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js {expectedErrors: {'react-compiler': [16]}} src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit-ன் Story" },
  {id: 1, label: "Taylor-ன் Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>இப்போது நேரம் {time.toLocaleTimeString()}.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

இது உங்கள் mutation-ஐ local ஆகவும், உங்கள் rendering function-ஐ pure ஆகவும் வைத்திருக்கும். ஆனால் இன்னும் கவனமாக இருக்க வேண்டும்: உதாரணமாக, array-யின் existing items ஏதாவது ஒன்றை மாற்ற முயன்றால், அந்த items-ஐயும் clone செய்ய வேண்டும்.

Arrays-இல் எந்த operations அவற்றை mutate செய்கின்றன, எந்தவை செய்யாது என்பதை நினைவில் வைத்திருப்பது பயனுள்ளது. உதாரணமாக, `push`, `pop`, `reverse`, மற்றும் `sort` original array-ஐ mutate செய்யும்; ஆனால் `slice`, `filter`, மற்றும் `map` புதிய ஒன்றை உருவாக்கும்.

</Solution>

</Challenges>
