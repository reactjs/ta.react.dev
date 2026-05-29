---
title: memo
---

<Intro>

`memo` என்பது props மாறாதபோது component re-render ஆகாமல் தவிர்க்க உதவும் ஒரு React API.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) அனைத்து components-க்கும் `memo`-க்கு சமமான optimization-ஐ தானாக apply செய்கிறது; இதனால் manual memoization தேவையை குறைக்கிறது. Component memoization-ஐ தானாக கையாள compiler-ஐ பயன்படுத்தலாம்.

</Note>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

ஒரு component-ன் *memoized* version பெற அதை `memo`-வில் wrap செய்யவும். அதன் props மாறாதவரை, parent component re-render ஆனாலும் உங்கள் component-ன் இந்த memoized version பொதுவாக re-render ஆகாது. ஆனால் React இன்னும் அதை re-render செய்யலாம்: memoization என்பது performance optimization; guarantee அல்ல.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `Component`: நீங்கள் memoize செய்ய விரும்பும் component. `memo` இந்த component-ஐ modify செய்யாது; அதற்கு பதிலாக புதிய memoized component-ஐ return செய்கிறது. Functions மற்றும் [`forwardRef`](/reference/react/forwardRef) components உட்பட எந்த valid React component-உம் ஏற்றுக்கொள்ளப்படும்.

* **optional** `arePropsEqual`: இரண்டு arguments ஏற்கும் function: component-ன் previous props மற்றும் new props. பழைய மற்றும் புதிய props சமமாக இருந்தால், அதாவது component புதிய props உடன் பழைய props போலவே அதே output render செய்து அதேபோல் நடந்து கொண்டால், இது `true` return செய்ய வேண்டும். இல்லையெனில் `false` return செய்ய வேண்டும். பொதுவாக, இந்த function-ஐ நீங்கள் குறிப்பிடமாட்டீர்கள். Default ஆக, React ஒவ்வொரு prop-ஐயும் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) மூலம் compare செய்யும்.

#### Returns {/*returns*/}

`memo` புதிய React component ஒன்றை return செய்கிறது. `memo`-க்கு கொடுக்கப்பட்ட component போலவே இது நடக்கும்; ஆனால் அதன் props மாறாதவரை parent re-render ஆகும்போது React அதை எப்போதும் re-render செய்யாது.

---

## பயன்பாடு {/*usage*/}

### Props மாறாதபோது re-rendering-ஐ தவிர்த்தல் {/*skipping-re-rendering-when-props-are-unchanged*/}

React பொதுவாக parent re-render ஆனாலெல்லாம் component-ஐ re-render செய்கிறது. `memo` மூலம், புதிய props பழைய props போலவே இருந்தால் parent re-render ஆனாலும் React re-render செய்யாத component ஒன்றை உருவாக்கலாம். இப்படிப்பட்ட component *memoized* என்று அழைக்கப்படுகிறது.

Component ஒன்றை memoize செய்ய, அதை `memo`-வில் wrap செய்து, அது return செய்யும் value-ஐ உங்கள் original component-க்கு பதிலாக பயன்படுத்தவும்:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>வணக்கம், {name}!</h1>;
});

export default Greeting;
```

React component எப்போதும் [pure rendering logic](/learn/keeping-components-pure) கொண்டிருக்க வேண்டும். இதன் பொருள், அதன் props, state, context மாறவில்லை என்றால் அதே output return செய்ய வேண்டும். `memo` பயன்படுத்துவதன் மூலம், உங்கள் component இந்த requirement-ஐ பின்பற்றுகிறது என்று React-க்கு சொல்கிறீர்கள்; ஆகவே அதன் props மாறாதவரை React re-render செய்ய வேண்டியதில்லை. `memo` இருந்தாலும், அதன் சொந்த state மாறினால் அல்லது அது பயன்படுத்தும் context மாறினால் உங்கள் component re-render ஆகும்.

இந்த example-இல், `name` மாறும்போது `Greeting` component re-render ஆகிறது (ஏனெனில் அது அதன் props-இல் ஒன்று), ஆனால் `address` மாறும்போது re-render ஆகாது (ஏனெனில் அது prop ஆக `Greeting`-க்கு pass செய்யப்படவில்லை):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        பெயர்{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        முகவரி{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting render ஆன நேரம்", new Date().toLocaleTimeString());
  return <h3>வணக்கம்{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**`memo`-வை performance optimization ஆக மட்டுமே நம்ப வேண்டும்.** அது இல்லாமல் உங்கள் code வேலை செய்யவில்லை என்றால், underlying problem-ஐ கண்டுபிடித்து முதலில் சரிசெய்யவும். பின்னர் performance மேம்படுத்த `memo` சேர்க்கலாம்.

</Note>

<DeepDive>

#### Memo-வை எல்லா இடங்களிலும் சேர்க்க வேண்டுமா? {/*should-you-add-memo-everywhere*/}

உங்கள் app இந்த site போல இருந்து, பெரும்பாலான interactions coarse ஆக இருந்தால் (page அல்லது முழு section மாற்றுவது போன்றவை), memoization பொதுவாக தேவையில்லை. மறுபுறம், உங்கள் app drawing editor போல இருந்து, பெரும்பாலான interactions granular ஆக இருந்தால் (shapes நகர்த்துவது போன்றவை), memoization மிகவும் உதவியாக இருக்கலாம்.

உங்கள் component அடிக்கடி அதே props உடன் re-render ஆகி, அதன் re-rendering logic செலவானதாக இருந்தால் மட்டுமே `memo` கொண்டு optimize செய்வது மதிப்புடையது. Component re-render ஆகும்போது உணரக்கூடிய lag இல்லை என்றால், `memo` தேவையில்லை. Rendering போது define செய்யப்பட்ட object அல்லது plain function போன்ற *எப்போதும் வேறுபடும்* props-ஐ component-க்கு pass செய்தால் `memo` முற்றிலும் பயனற்றது என்பதை நினைவில் கொள்ளுங்கள். அதனால் தான் `memo` உடன் [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) மற்றும் [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) அடிக்கடி தேவைப்படும்.

மற்ற cases-இல் component-ஐ `memo`-வில் wrap செய்வதால் பயன் இல்லை. அதைச் செய்வதில் பெரிய தீங்கும் இல்லை; ஆகவே சில teams individual cases பற்றி சிந்திக்காமல், முடிந்தவரை memoize செய்ய தேர்வு செய்கின்றன. இந்த அணுகுமுறையின் குறைபாடு code படிக்க கடினமாகும் என்பதே. மேலும், எல்லா memoization-மும் பயனுள்ளதாக இருக்காது: "எப்போதும் புதியதாக" இருக்கும் ஒரு value போதும், முழு component-க்கான memoization-ஐ உடைக்க.

**நடைமுறையில், சில principles-ஐ பின்பற்றுவதன் மூலம் பெரும்பாலான memoization தேவையை நீக்கலாம்:**

1. Component ஒன்று மற்ற components-ஐ visually wrap செய்யும்போது, அது [JSX-ஐ children ஆக accept செய்ய](/learn/passing-props-to-a-component#passing-jsx-as-children) விடுங்கள். இதனால் wrapper component தனது சொந்த state-ஐ update செய்யும்போது, அதன் children re-render ஆக வேண்டியதில்லை என்று React அறியும்.
1. Local state-ஐ விரும்புங்கள்; தேவையானதை விட மேலாக [state-ஐ lift up](/learn/sharing-state-between-components) செய்ய வேண்டாம். உதாரணமாக, forms போன்ற transient state அல்லது item hover ஆனதா போன்றவற்றை tree-ன் மேல் பகுதியிலோ global state library-யிலோ வைத்திருக்க வேண்டாம்.
1. உங்கள் [rendering logic pure ஆக](/learn/keeping-components-pure) இருக்கட்டும். Component re-render ஆகும்போது problem ஏற்படினால் அல்லது கவனிக்கத்தக்க visual artifact உருவானால், அது உங்கள் component-இல் bug! Memoization சேர்ப்பதற்கு பதிலாக bug-ஐ சரிசெய்யுங்கள்.
1. [State update செய்யும் தேவையற்ற Effects](/learn/you-might-not-need-an-effect)-ஐத் தவிர்க்கவும். React apps-இல் பெரும்பாலான performance problems, உங்கள் components மீண்டும் மீண்டும் render ஆக காரணமான Effects-இலிருந்து தொடங்கும் update chains காரணமாக உருவாகின்றன.
1. உங்கள் Effects-இலிருந்து [தேவையற்ற dependencies-ஐ remove செய்ய](/learn/removing-effect-dependencies) முயற்சிக்கவும். உதாரணமாக, memoization-க்கு பதிலாக, சில object அல்லது function-ஐ Effect-க்குள் அல்லது component-க்கு வெளியே நகர்த்துவது பெரும்பாலும் நேரடியானது.

குறிப்பிட்ட interaction இன்னும் laggy ஆக இருந்தால், எந்த components memoization மூலம் அதிகம் பயன் பெறும் என்பதைப் பார்க்க [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)-ஐ பயன்படுத்தி, தேவையான இடத்தில் memoization சேர்க்கவும். இந்த principles உங்கள் components-ஐ debug செய்யவும் புரிந்துகொள்ளவும் உதவும்; ஆகவே எப்படியாயினும் அவற்றை பின்பற்றுவது நல்லது. நீண்டகாலத்தில், இதை முழுமையாகத் தீர்க்க [granular memoization தானாக செய்வது](https://www.youtube.com/watch?v=lGEMwh32soc) குறித்து நாங்கள் ஆராய்ந்து வருகிறோம்.

</DeepDive>

---

### State பயன்படுத்தி memoized component-ஐ update செய்தல் {/*updating-a-memoized-component-using-state*/}

Component memoized ஆக இருந்தாலும், அதன் சொந்த state மாறும்போது அது இன்னும் re-render ஆகும். Memoization என்பது parent-இலிருந்து component-க்கு pass செய்யப்படும் props-ஐ மட்டுமே சார்ந்தது.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        பெயர்{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        முகவரி{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting render ஆன நேரம்', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('வணக்கம்');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'வணக்கம்'}
          onChange={e => onChange('வணக்கம்')}
        />
        வழக்கமான வாழ்த்து
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'வணக்கம், வரவேற்கிறோம்'}
          onChange={e => onChange('வணக்கம், வரவேற்கிறோம்')}
        />
        உற்சாகமான வாழ்த்து
      </label>
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

State variable-ஐ அதன் current value-க்கே set செய்தால், `memo` இல்லாவிட்டாலும் React உங்கள் component re-render ஆகாமல் தவிர்க்கும். உங்கள் component function கூடுதலாக ஒருமுறை call ஆகுவதை நீங்கள் இன்னும் பார்க்கலாம்; ஆனால் result discard செய்யப்படும்.

---

### Context பயன்படுத்தி memoized component-ஐ update செய்தல் {/*updating-a-memoized-component-using-a-context*/}

Component memoized ஆக இருந்தாலும், அது பயன்படுத்தும் context மாறும்போது அது இன்னும் re-render ஆகும். Memoization என்பது parent-இலிருந்து component-க்கு pass செய்யப்படும் props-ஐ மட்டுமே சார்ந்தது.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Theme மாற்று
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting render ஆன நேரம்", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>வணக்கம், {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

ஏதாவது context-ன் ஒரு _பகுதி_ மாறும்போது மட்டுமே உங்கள் component re-render ஆக வேண்டும் என்றால், component-ஐ இரண்டாக split செய்யவும். Outer component-இல் context-இலிருந்து தேவையானதை படித்து, அதை prop ஆக memoized child-க்கு pass செய்யவும்.

---

### Props changes-ஐ குறைத்தல் {/*minimizing-props-changes*/}

`memo` பயன்படுத்தும்போது, ஏதேனும் prop முந்தைய value-க்கு *shallowly equal* ஆக இல்லாவிட்டால் உங்கள் component re-render ஆகும். இதன் அர்த்தம், React உங்கள் component-இல் உள்ள ஒவ்வொரு prop-ஐயும் அதன் previous value-உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் compare செய்கிறது. `Object.is(3, 3)` `true`, ஆனால் `Object.is({}, {})` `false` என்பதை கவனிக்கவும்.

`memo`-இலிருந்து அதிக பயன் பெற, props மாறும் தடவைகளை குறைக்கவும். உதாரணமாக, prop ஒரு object என்றால், [`useMemo`](/reference/react/useMemo) பயன்படுத்தி parent component ஒவ்வொரு முறையும் அந்த object-ஐ மீண்டும் create செய்வதைத் தவிர்க்கவும்:

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Props changes-ஐ குறைக்கும் சிறந்த வழி, component தேவையான குறைந்தபட்ச தகவலை மட்டுமே props-இல் accept செய்கிறது என்பதை உறுதிசெய்வது. உதாரணமாக, முழு object-க்கு பதிலாக individual values-ஐ accept செய்யலாம்:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Individual values கூட சில நேரங்களில் குறைவாக மாறும் values-ஆக project செய்யப்படலாம். உதாரணமாக, இங்கே ஒரு component value-ஐ விட அதன் இருப்பை குறிக்கும் boolean-ஐ accept செய்கிறது:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Memoized component-க்கு function pass செய்ய வேண்டியிருந்தால், அது ஒருபோதும் மாறாதபடி உங்கள் component-க்கு வெளியே declare செய்யவும், அல்லது re-renders இடையில் அதன் definition-ஐ cache செய்ய [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) பயன்படுத்தவும்.

---

### Custom comparison function குறிப்பிடுதல் {/*specifying-a-custom-comparison-function*/}

சில அரிதான cases-இல் memoized component-ன் props changes-ஐ குறைப்பது சாத்தியமில்லாமல் இருக்கலாம். அப்போது, shallow equality பயன்படுத்துவதற்கு பதிலாக பழைய மற்றும் புதிய props-ஐ compare செய்ய React பயன்படுத்தும் custom comparison function ஒன்றை வழங்கலாம். இந்த function `memo`-க்கு இரண்டாவது argument ஆக pass செய்யப்படும். புதிய props பழைய props போலவே அதே output-ஐ ஏற்படுத்தினால் மட்டுமே இது `true` return செய்ய வேண்டும்; இல்லையெனில் `false` return செய்ய வேண்டும்.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

இதைச் செய்தால், உங்கள் comparison function உண்மையில் component re-render செய்வதை விட வேகமானதா என்பதை உறுதிசெய்ய browser developer tools-இல் Performance panel-ஐப் பயன்படுத்தவும். நீங்கள் ஆச்சரியப்படலாம்.

Performance measurements செய்யும்போது, React production mode-இல் run ஆகிறது என்பதை உறுதிசெய்யவும்.

<Pitfall>

Custom `arePropsEqual` implementation வழங்கினால், **functions உட்பட ஒவ்வொரு prop-ஐயும் compare செய்ய வேண்டும்.** Functions பெரும்பாலும் parent components-ன் props மற்றும் state-ஐ [close over](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) செய்கின்றன. `oldProps.onClick !== newProps.onClick` ஆக இருக்கும்போது நீங்கள் `true` return செய்தால், உங்கள் component அதன் `onClick` handler-க்குள் முந்தைய render-இலிருந்த props மற்றும் state-ஐத் தொடர்ந்து "பார்க்கும்"; இது மிகவும் குழப்பமான bugs-க்கு வழிவகுக்கும்.

நீங்கள் வேலை செய்கிற data structure-க்கு அறியப்பட்ட limited depth உள்ளது என்று 100% உறுதியாக இல்லாவிட்டால், `arePropsEqual`-க்குள் deep equality checks செய்ய வேண்டாம். **Deep equality checks மிக மிக மெதுவாக ஆகலாம்**; பின்னர் யாராவது data structure-ஐ மாற்றினால் உங்கள் app பல seconds-க்கு freeze ஆகலாம்.

</Pitfall>

---

### React Compiler பயன்படுத்தினால் இன்னும் React.memo தேவையா? {/*react-compiler-memo*/}

[React Compiler](/learn/react-compiler) enable செய்தால், பொதுவாக `React.memo` இனி தேவையில்லை. Compiler component re-rendering-ஐ தானாக optimize செய்கிறது.

இது எப்படி வேலை செய்கிறது:

**React Compiler இல்லாமல்**, தேவையற்ற re-renders-ஐ தடுக்க `React.memo` தேவை:

```js
// Parent re-renders every second
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Without memo, this re-renders every second even though props don't change
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>வணக்கம், {name}!</div>;
});
```

**React Compiler enabled ஆக இருந்தால்**, அதே optimization தானாக நடக்கும்:

```js
// No memo needed - compiler prevents re-renders automatically
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>வணக்கம், {name}!</div>;
}
```

React Compiler உருவாக்கும் முக்கிய பகுதி இதோ:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... other code ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... return statement ...
}
```

Highlighted lines-ஐ கவனியுங்கள்: Compiler `<ExpensiveChild name="John" />`-ஐ cache check ஒன்றில் wrap செய்கிறது. `name` prop எப்போதும் `"John"` என்பதால், இந்த JSX ஒருமுறை உருவாக்கப்பட்டு ஒவ்வொரு parent re-render-இலும் reuse செய்யப்படுகிறது. இதுவே `React.memo` செய்யும் செயல் - props மாறாதபோது child re-render ஆகாமல் தடுக்கிறது.

React Compiler தானாக:
1. `ExpensiveChild`-க்கு pass செய்யப்பட்ட `name` prop மாறவில்லை என்பதை track செய்கிறது
2. முன்பு உருவாக்கப்பட்ட JSX-ஐ `<ExpensiveChild name="John" />`-க்கு reuse செய்கிறது
3. `ExpensiveChild` re-render ஆகுவதையே முழுமையாக skip செய்கிறது

இதன் அர்த்தம் **React Compiler பயன்படுத்தும்போது உங்கள் components-இலிருந்து `React.memo`-வை பாதுகாப்பாக remove செய்யலாம்**. Compiler அதே optimization-ஐ தானாக வழங்கி, உங்கள் code-ஐ சுத்தமாகவும் maintain செய்ய திறமையாகவும் ஆக்குகிறது.

<Note>

Compiler-ன் optimization உண்மையில் `React.memo`-வை விட விரிவானது. உங்கள் component tree முழுவதும் `React.memo`-வை `useMemo` உடன் சேர்ப்பதுபோல, components-க்குள் intermediate values மற்றும் expensive computations-ஐயும் அது memoize செய்கிறது.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### Prop object, array, அல்லது function ஆக இருக்கும்போது என் component re-render ஆகிறது {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React பழைய மற்றும் புதிய props-ஐ shallow equality மூலம் compare செய்கிறது: அதாவது ஒவ்வொரு புதிய prop-உம் பழைய prop-க்கு reference-equal ஆக உள்ளதா என்பதை பார்க்கிறது. Parent re-render ஆகும் ஒவ்வொரு முறையும் நீங்கள் புதிய object அல்லது array உருவாக்கினால், அதற்குள் உள்ள individual elements எல்லாம் அதேபோல இருந்தாலும் React அதை changed எனக் கருதும். அதேபோல், parent component render ஆகும்போது புதிய function உருவாக்கினால், function-க்கு அதே definition இருந்தாலும் React அது changed எனக் கருதும். இதைத் தவிர்க்க, [props-ஐ simplify செய்யவும் அல்லது parent component-இல் props-ஐ memoize செய்யவும்](#minimizing-props-changes).
