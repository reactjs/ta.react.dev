---
title: Components மற்றும் Hooks pure ஆக இருக்க வேண்டும்
---

<Intro>
Pure functions ஒரு calculation மட்டுமே செய்கின்றன; அதற்கு மேல் எதுவும் செய்யாது. இது உங்கள் code-ஐ புரிந்துகொள்ளவும் debug செய்யவும் உதவுகிறது, மேலும் React உங்கள் components மற்றும் Hooks-ஐ சரியாக automatically optimize செய்ய அனுமதிக்கிறது.
</Intro>

<Note>
இந்த reference page advanced topics-ஐ cover செய்கிறது; [Components-ஐ Pure ஆக வைத்திருத்தல்](/learn/keeping-components-pure) page-இல் உள்ள concepts குறித்து familiarity தேவை.
</Note>

<InlineToc />

### Purity ஏன் முக்கியம்? {/*why-does-purity-matter*/}

React-ஐ _React_ ஆக்கும் முக்கிய concepts-இல் ஒன்று _purity_. Pure component அல்லது hook என்பது:

* **Idempotent** - அதே inputs உடன் run செய்தால் [ஒவ்வொரு முறையும் அதே result கிடைக்கும்](/learn/keeping-components-pure#purity-components-as-formulas) - component inputs-க்கு props, state, context; hook inputs-க்கு arguments.
* **Render-இல் side effects இல்லை** - Side effects கொண்ட code [**rendering-இலிருந்து தனியாக**](#how-does-react-run-your-code) run ஆக வேண்டும். உதாரணமாக [event handler](/learn/responding-to-events) ஆக - user UI உடன் interact செய்து update ஏற்படுத்தும் இடம்; அல்லது [Effect](/reference/react/useEffect) ஆக - render-க்கு பிறகு run ஆகும்.
* **Non-local values mutate செய்யாது**: Components மற்றும் Hooks render-இல் [locally create செய்யப்படாத values-ஐ ஒருபோதும் modify செய்யக்கூடாது](#mutation).

Render pure ஆக வைத்தால், user முதலில் பார்க்க மிகவும் முக்கியமான updates எவை என்பதை React புரிந்துகொண்டு prioritize செய்ய முடியும். இது render purity காரணமாக சாத்தியமாகிறது: components [render-இல்](#how-does-react-run-your-code) side effects இல்லாததால், update செய்ய அவ்வளவு முக்கியமில்லாத components-ஐ React pause செய்து, தேவைப்படும் போது பின்னர் திரும்பிச் செய்யலாம்.

Concretely, இதன் அர்த்தம் rendering logic பலமுறை run ஆகக்கூடும்; அதனால் React உங்கள் user-க்கு pleasant user experience தர முடியும். ஆனால் உங்கள் component-இல் untracked side effect இருந்தால் - உதாரணமாக [render போது](#how-does-react-run-your-code) global variable value modify செய்தால் - React உங்கள் rendering code-ஐ மீண்டும் run செய்யும்போது, உங்கள் side effects நீங்கள் விரும்பும் விதத்துக்கு match ஆகாத முறையில் trigger ஆகும். இது users உங்கள் app-ஐ அனுபவிக்கும் விதத்தை பாதிக்கும் unexpected bugs-க்கு வழிவகுக்கும். இதற்கான [example-ஐ Keeping Components Pure page-இல்](/learn/keeping-components-pure#side-effects-unintended-consequences) பார்க்கலாம்.

#### React உங்கள் code-ஐ எப்படி run செய்கிறது? {/*how-does-react-run-your-code*/}

React declarative: React-க்கு _எதை_ render செய்ய வேண்டும் என்று சொல்கிறீர்கள்; அதை user-க்கு _எப்படி_ சிறப்பாக display செய்வது React கண்டறியும். இதை செய்ய, React உங்கள் code run செய்யும் சில phases கொண்டுள்ளது. React நன்றாகப் பயன்படுத்த இந்த phases அனைத்தையும் தெரிந்திருக்க வேண்டியதில்லை. ஆனால் high level-இல், _render_-இல் எந்த code run ஆகிறது, அதன் வெளியே என்ன run ஆகிறது என்பதை அறிந்திருக்க வேண்டும்.

_Rendering_ என்பது உங்கள் UI-ன் அடுத்த version எப்படி இருக்க வேண்டும் என்பதை calculate செய்வது. Rendering-க்கு பிறகு, React இந்த புதிய calculation-ஐ எடுத்து, உங்கள் UI-ன் முந்தைய version உருவாக்க பயன்படுத்திய calculation உடன் compare செய்கிறது. பிறகு changes apply செய்ய, [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)-க்கு (உங்கள் user உண்மையில் பார்க்கும் பகுதி) தேவையான குறைந்தபட்ச changes மட்டும் commit செய்கிறது. இறுதியாக, [Effects](/learn/synchronizing-with-effects) flushed செய்யப்படுகின்றன (மீதமில்லை வரை அவை run செய்யப்படுகின்றன). மேலும் விரிவான தகவலுக்கு [Render](/learn/render-and-commit) மற்றும் [Commit and Effect Hooks](/reference/react/hooks#effect-hooks) docs-ஐ பார்க்கவும்.

<DeepDive>

#### Code render-இல் run ஆகிறதா என்பதை எப்படி அறிதல் {/*how-to-tell-if-code-runs-in-render*/}

Code render போது run ஆகிறதா என்பதை அறிய விரைவான heuristic ஒன்று: அது எங்கே உள்ளது என்று பாருங்கள். கீழுள்ள example போல top level-இல் எழுதப்பட்டிருந்தால், அது render போது run ஆக வாய்ப்பு அதிகம்.

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // render போது உருவாக்கப்படுகிறது
  // ...
}
```

Event handlers மற்றும் Effects render-இல் run ஆகாது:

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // this code is in an event handler, so it's only run when the user triggers this
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // this code is inside of an Effect, so it only runs after rendering
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## Components மற்றும் Hooks idempotent ஆக இருக்க வேண்டும் {/*components-and-hooks-must-be-idempotent*/}

Components தங்கள் inputs - props, state, மற்றும் context - அடிப்படையில் எப்போதும் அதே output return செய்ய வேண்டும். இதுவே _idempotency_. [Idempotency](https://en.wikipedia.org/wiki/Idempotence) என்பது functional programming-இல் பிரபலமான term. அதே inputs உடன் அந்த code piece run செய்தால் [ஒவ்வொரு முறையும் அதே result கிடைக்கும்](learn/keeping-components-pure) என்ற கருத்தை குறிக்கிறது.

இந்த rule நிலைக்க, [render போது](#how-does-react-run-your-code) run ஆகும் _அனைத்து_ code-யும் idempotent ஆக இருக்க வேண்டும். உதாரணமாக, இந்த code line idempotent அல்ல (அதனால் component-யும் idempotent அல்ல):

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Bad: எப்போதும் வேறு result return செய்கிறது!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` idempotent அல்ல; அது எப்போதும் current date return செய்கிறது, மேலும் call செய்யும் ஒவ்வொரு முறையும் result மாறுகிறது. மேலுள்ள component render செய்தால், screen-இல் காட்டப்படும் time, component render செய்யப்பட்ட நேரத்தில் stuck ஆகிவிடும். அதேபோல் `Math.random()` போன்ற functions-யும் idempotent அல்ல; inputs அதே இருந்தாலும் ஒவ்வொரு call-க்கும் வேறு results return செய்கின்றன.

இதன் அர்த்தம் `new Date()` போன்ற non-idempotent functions-ஐ _முழுவதும்_ பயன்படுத்தக்கூடாது என்பதல்ல - அவற்றை [render போது](#how-does-react-run-your-code) பயன்படுத்துவதை தவிர்க்க வேண்டும். இந்த case-இல், [Effect](/reference/react/useEffect) பயன்படுத்தி latest date-ஐ இந்த component உடன் _synchronize_ செய்யலாம்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Keep track of the current date's state. `useState` receives an initializer function as its
  //    initial state. It only runs once when the hook is called, so only the current date at the
  //    time the hook is called is set first.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Update the current date every second using `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code இனி render-இல் run ஆகாது
    }, 1000);
    // 3. Return a cleanup function so we don't leak the `setInterval` timer.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

Non-idempotent `new Date()` call-ஐ Effect-இல் wrap செய்வதால், அந்த calculation [rendering-க்கு வெளியே](#how-does-react-run-your-code) நகர்கிறது.

React உடன் external state ஒன்றை synchronize செய்ய வேண்டியதில்லை என்றால், user interaction-க்கு response ஆக மட்டுமே update செய்ய வேண்டுமானால் [event handler](/learn/responding-to-events) பயன்படுத்துவதையும் பரிசீலிக்கலாம்.

---

## Side effects render-க்கு வெளியே run ஆக வேண்டும் {/*side-effects-must-run-outside-of-render*/}

[Side effects](/learn/keeping-components-pure#side-effects-unintended-consequences) [render-இல்](#how-does-react-run-your-code) run ஆகக்கூடாது; ஏனெனில் சிறந்த possible user experience உருவாக்க React components-ஐ பலமுறை render செய்யலாம்.

<Note>
Side effects என்பது Effects-ஐ விட broader term. Effects என்பது குறிப்பாக `useEffect`-இல் wrap செய்யப்பட்ட code-ஐ குறிக்கிறது; side effect என்பது caller-க்கு value return செய்வது என்ற primary result தவிர வேறு observable effect கொண்ட எந்த code-க்கும் general term.

Side effects பொதுவாக [event handlers](/learn/responding-to-events) அல்லது Effects உள்ளே எழுதப்படுகின்றன. ஆனால் render போது ஒருபோதும் இல்லை.
</Note>

Render pure ஆக இருக்க வேண்டும் என்றாலும், உங்கள் app screen-இல் ஏதாவது interesting காட்டுவது போன்றவற்றைச் செய்ய side effects ஓர் இடத்தில் அவசியம்! இந்த rule-ன் முக்கிய point: side effects [render-இல்](#how-does-react-run-your-code) run ஆகக்கூடாது, ஏனெனில் React components-ஐ பலமுறை render செய்யலாம். பெரும்பாலான cases-இல், side effects handle செய்ய [event handlers](learn/responding-to-events) பயன்படுத்துவீர்கள். Event handler பயன்படுத்துவது, இந்த code render போது run ஆக வேண்டியதில்லை என்று React-க்கு explicit ஆகச் சொல்கிறது; இதனால் render pure ஆக இருக்கும். அனைத்து options-யும் exhausted ஆன பிறகு - கடைசி resort ஆக மட்டும் - `useEffect` பயன்படுத்தி side effects handle செய்யலாம்.

### Mutation எப்போது okay? {/*mutation*/}

#### Local mutation {/*local-mutation*/}
Side effect-க்கு பொதுவான example mutation. JavaScript-இல் இது non-[primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) value-ன் value மாற்றுவதை குறிக்கிறது. பொதுவாக mutation React-இல் idiomatic அல்ல; ஆனால் _local_ mutation முற்றிலும் fine:

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Good: locally created
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Good: local mutation okay
  }
  return <section>{items}</section>;
}
```

Local mutation தவிர்க்க உங்கள் code-ஐ சிரமப்படுத்த தேவையில்லை. Brevity-க்காக இங்கே [`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) பயன்படுத்தலாம்; ஆனால் local array ஒன்றை உருவாக்கி [render போது](#how-does-react-run-your-code) அதில் items push செய்வதில் தவறு இல்லை.

நாம் `items` mutate செய்கிறோம் போலத் தெரிந்தாலும், கவனிக்க வேண்டிய முக்கிய point: இந்த code அதை _locally_ மட்டும் செய்கிறது - component மீண்டும் render செய்யப்படும் போது mutation "remembered" ஆகாது. வேறு வார்த்தைகளில், component இருக்கும் வரை மட்டுமே `items` இருக்கும். `<FriendList />` render செய்யப்படும் ஒவ்வொரு முறையும் `items` எப்போதும் _recreated_ ஆகுவதால், component எப்போதும் அதே result return செய்யும்.

மாறாக, `items` component வெளியே உருவாக்கப்பட்டிருந்தால், அது முந்தைய values-ஐ வைத்துக்கொண்டு changes-ஐ நினைவில் வைக்கும்:

```js {1,7}
const items = []; // 🔴 Bad: component வெளியே உருவாக்கப்பட்டது
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Bad: render வெளியே உருவாக்கப்பட்ட value-ஐ mutate செய்கிறது
  }
  return <section>{items}</section>;
}
```

`<FriendList />` மீண்டும் run ஆகும் போது, அந்த component run ஆகும் ஒவ்வொரு முறையும் `friends`-ஐ `items`-க்கு append செய்வோம்; இதனால் duplicated results பல உருவாகும். இந்த `<FriendList />` version [render போது](#how-does-react-run-your-code) observable side effects கொண்டுள்ளது மற்றும் **rule-ஐ உடைக்கிறது**.

#### Lazy initialization {/*lazy-initialization*/}

முழுமையாக "pure" அல்லாதிருந்தாலும் lazy initialization fine:

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Good: மற்ற components-ஐ பாதிக்காவிட்டால்
  // Continue rendering...
}
```

#### DOM-ஐ மாற்றுதல் {/*changing-the-dom*/}

User-க்கு நேரடியாக visible ஆன side effects, React components-ன் render logic-இல் அனுமதிக்கப்படாது. வேறு வார்த்தைகளில், component function call செய்வது மட்டுமே screen-இல் change உருவாக்கக்கூடாது.

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Bad: DOM-ஐ மாற்றுகிறது
}
```

Render-க்கு வெளியே `document.title` update செய்ய desired result பெற ஒரு வழி, [component-ஐ `document` உடன் synchronize செய்வது](/learn/synchronizing-with-effects).

Component பலமுறை call செய்யப்படுவது safe ஆகவும், மற்ற components rendering-ஐ பாதிக்காததாகவும் இருந்தால், strict functional programming sense-இல் அது 100% pure ஆக இல்லாவிட்டாலும் React கவலைப்படாது. [Components idempotent ஆக இருக்க வேண்டும்](/reference/rules/components-and-hooks-must-be-pure) என்பதே அதிக முக்கியம்.

---

## Props மற்றும் state immutable {/*props-and-state-are-immutable*/}

Component-ன் props மற்றும் state immutable [snapshots](learn/state-as-a-snapshot). அவற்றை நேரடியாக mutate செய்யாதீர்கள். அதற்கு பதிலாக, புதிய props-ஐ கீழே pass செய்யவும், `useState`-இலிருந்து setter function-ஐ பயன்படுத்தவும்.

Props மற்றும் state values rendering-க்கு பிறகு update செய்யப்படும் snapshots என்று சிந்திக்கலாம். இந்த காரணத்தால், props அல்லது state variables-ஐ நேரடியாக modify செய்ய வேண்டாம்: அதற்கு பதிலாக புதிய props pass செய்யவும், அல்லது அடுத்த முறை component render செய்யும்போது state update செய்ய வேண்டும் என்று React-க்கு சொல்ல உங்களுக்கு வழங்கப்பட்ட setter function பயன்படுத்தவும்.

### Props mutate செய்யாதீர்கள் {/*props*/}
Props immutable; அவற்றை mutate செய்தால் application inconsistent output உருவாக்கும். Circumstances-ஐப் பொறுத்து அது வேலை செய்யலாம் அல்லது செய்யாமல் இருக்கலாம் என்பதால் debug செய்ய கடினமாக இருக்கும்.

```js {expectedErrors: {'react-compiler': [2]}} {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Bad: props-ஐ நேரடியாக ஒருபோதும் mutate செய்யாதீர்கள்
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Good: அதற்கு பதிலாக copy உருவாக்கவும்
  return <Link url={url}>{item.title}</Link>;
}
```

### State mutate செய்யாதீர்கள் {/*state*/}
`useState` state variable மற்றும் அந்த state update செய்ய setter return செய்கிறது.

```js
const [stateVariable, setter] = useState(0);
```

State variable-ஐ in-place update செய்வதற்குப் பதிலாக, `useState` return செய்யும் setter function பயன்படுத்தி update செய்ய வேண்டும். State variable-இல் values மாற்றுவது component update ஆக காரணமில்லை; users outdated UI-யுடன் விடப்படுவார்கள். Setter function பயன்படுத்துவது state மாறியுள்ளது, UI update செய்ய re-render queue செய்ய வேண்டும் என்று React-க்கு தெரிவிக்கிறது.

```js {expectedErrors: {'react-compiler': [2, 5]}} {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Bad: state-ஐ நேரடியாக ஒருபோதும் mutate செய்யாதீர்கள்
  }

  return (
    <button onClick={handleClick}>
      என்னை {count} முறை அழுத்தினீர்கள்
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Good: useState return செய்த setter function பயன்படுத்தவும்
  }

  return (
    <button onClick={handleClick}>
      என்னை {count} முறை அழுத்தினீர்கள்
    </button>
  );
}
```

---

## Hooks-க்கு return values மற்றும் arguments immutable {/*return-values-and-arguments-to-hooks-are-immutable*/}

Values hook-க்கு pass செய்யப்பட்டவுடன், அவற்றை modify செய்யக்கூடாது. JSX-இல் props போலவே, values hook-க்கு pass செய்யப்பட்டபோது immutable ஆகும்.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Bad: hook arguments-ஐ நேரடியாக mutate செய்யாதீர்கள்
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Good: அதற்கு பதிலாக copy உருவாக்கவும்
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

React-இல் முக்கியமான principle ஒன்று _local reasoning_: component அல்லது hook என்ன செய்கிறது என்பதை அதன் code-ஐ தனியாகப் பார்த்து புரிந்துகொள்ளும் திறன். Hooks call செய்யப்படும் போது அவற்றை "black boxes" போல treat செய்ய வேண்டும். உதாரணமாக, custom hook ஒன்று தனது arguments-ஐ dependencies ஆகப் பயன்படுத்தி அதன் உள்ளே values memoize செய்திருக்கலாம்:

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

Hook-ன் arguments mutate செய்தால், custom hook-ன் memoization incorrect ஆகும்; எனவே அதைத் தவிர்ப்பது முக்கியம்.

```js {4}
style = useIconStyle(icon);         // `style`, `icon` அடிப்படையில் memoized
icon.enabled = false;               // Bad: 🔴 hook arguments-ஐ நேரடியாக mutate செய்யாதீர்கள்
style = useIconStyle(icon);         // முன்பு memoized result return ஆகிறது
```

```js {4}
style = useIconStyle(icon);         // `style`, `icon` அடிப்படையில் memoized
icon = { ...icon, enabled: false }; // Good: ✅ அதற்கு பதிலாக copy உருவாக்கவும்
style = useIconStyle(icon);         // `style`-ன் புதிய value calculate செய்யப்படுகிறது
```

அதேபோல், Hooks-ன் return values-ஐ modify செய்யாமல் இருப்பதும் முக்கியம்; அவை memoized ஆகியிருக்கலாம்.

---

## JSX-க்கு pass செய்த பிறகு values immutable {/*values-are-immutable-after-being-passed-to-jsx*/}

Values JSX-இல் பயன்படுத்தப்பட்ட பிறகு அவற்றை mutate செய்யாதீர்கள். Mutation-ஐ JSX உருவாக்கப்படும் முன் நகர்த்தவும்.

Expression-இல் JSX பயன்படுத்தும்போது, component rendering முடிவதற்கு முன் React JSX-ஐ eagerly evaluate செய்யலாம். இதன் அர்த்தம்: values JSX-க்கு pass செய்த பிறகு அவற்றை mutate செய்தால் outdated UIs உருவாகலாம்; component output update செய்ய வேண்டும் என்பதை React அறியாது.

```js {expectedErrors: {'react-compiler': [4]}} {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Bad: மேலுள்ள JSX-இல் styles ஏற்கனவே பயன்படுத்தப்பட்டது
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Good: புதிய value உருவாக்கினோம்
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
