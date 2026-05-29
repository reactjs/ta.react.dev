---
title: 'உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம்'
---

<Intro>

Effects என்பது React paradigm-இலிருந்து வெளியே செல்லும் escape hatch. அவை React-க்கு "வெளியே step" செய்து, non-React widget, network, அல்லது browser DOM போன்ற external system உடன் உங்கள் components-ஐ synchronize செய்ய அனுமதிக்கின்றன. External system ஏதும் இல்லையெனில் (உதாரணமாக, சில props அல்லது state மாறும் போது component state-ஐ update செய்ய விரும்பினால்), உங்களுக்கு Effect தேவைப்படக்கூடாது. தேவையற்ற Effects-ஐ remove செய்வது உங்கள் code-ஐ புரிந்துகொள்ள வசதியாக்கி, வேகமாக run செய்யவும், குறைவான errors-க்கும் உதவும்.

</Intro>

<YouWillLearn>

* உங்கள் components-இலிருந்து தேவையற்ற Effects-ஐ ஏன் மற்றும் எப்படி remove செய்வது
* Effects இல்லாமல் expensive computations-ஐ cache செய்வது எப்படி
* Effects இல்லாமல் component state-ஐ reset மற்றும் adjust செய்வது எப்படி
* Event handlers இடையில் logic-ஐ share செய்வது எப்படி
* எந்த logic event handlers-க்கு நகர்த்தப்பட வேண்டும்
* Changes பற்றி parent components-க்கு notify செய்வது எப்படி

</YouWillLearn>

## தேவையற்ற Effects-ஐ remove செய்வது எப்படி {/*how-to-remove-unnecessary-effects*/}

Effects தேவைப்படாத இரண்டு common cases உள்ளன:

* **Rendering-க்கான data-வை transform செய்ய Effects தேவையில்லை.** உதாரணமாக, list-ஐ display செய்வதற்கு முன் filter செய்ய விரும்புகிறீர்கள் என்று வைத்துக் கொள்ளுங்கள். List மாறும்போது state variable-ஐ update செய்யும் Effect எழுத வேண்டும் என்று தோன்றலாம். ஆனால் இது inefficient. நீங்கள் state update செய்தால், screen-இல் என்ன இருக்க வேண்டும் என்பதை calculate செய்ய React முதலில் உங்கள் component functions-ஐ call செய்யும். பிறகு React இந்த changes-ஐ DOM-க்கு ["commit"](/learn/render-and-commit) செய்து screen-ஐ update செய்யும். பிறகு React உங்கள் Effects-ஐ run செய்யும். உங்கள் Effect *உடனடியாக* state-ஐ update செய்தால், முழு process scratch-இலிருந்து மீண்டும் தொடங்கும்! தேவையற்ற render passes தவிர்க்க, உங்கள் components-ன் top level-இல் எல்லா data-வையும் transform செய்யுங்கள். உங்கள் props அல்லது state மாறும் போதெல்லாம் அந்த code automatically re-run ஆகும்.
* **User events handle செய்ய Effects தேவையில்லை.** உதாரணமாக, பயனர் product வாங்கும்போது `/api/buy` POST request அனுப்பி notification காட்ட வேண்டும் என்று வைத்துக் கொள்ளுங்கள். Buy button click event handler-இல், என்ன நடந்தது என்று உங்களுக்கு துல்லியமாக தெரியும். Effect run ஆகும் நேரத்தில், பயனர் *என்ன* செய்தார் என்று தெரியாது (உதாரணமாக, எந்த button click செய்யப்பட்டது). அதனால்தான் பொதுவாக user events-ஐ corresponding event handlers-இல் handle செய்வீர்கள்.

External systems உடன் [synchronize](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) செய்ய Effects *தேவை*. உதாரணமாக, jQuery widget-ஐ React state உடன் synchronized ஆக வைத்திருக்கும் Effect எழுதலாம். Effects மூலம் data fetch செய்யவும் முடியும்: உதாரணமாக, current search query உடன் search results-ஐ synchronize செய்யலாம். Modern [frameworks](/learn/creating-a-react-app#full-stack-frameworks), components-இல் நேரடியாக Effects எழுதுவதை விட efficient ஆன built-in data fetching mechanisms provide செய்கின்றன என்பதை நினைவில் கொள்ளுங்கள்.

சரியான intuition பெற உதவ, சில common concrete examples-ஐப் பார்ப்போம்!

### Props அல்லது state அடிப்படையில் state update செய்தல் {/*updating-state-based-on-props-or-state*/}

உங்களிடம் இரண்டு state variables கொண்ட component உள்ளது என்று வைத்துக் கொள்ளுங்கள்: `firstName` மற்றும் `lastName`. அவற்றை concatenate செய்து `fullName` calculate செய்ய விரும்புகிறீர்கள். மேலும், `firstName` அல்லது `lastName` மாறும் போதெல்லாம் `fullName` update ஆக வேண்டும். உங்கள் முதல் instinct `fullName` state variable சேர்த்து, அதை Effect-இல் update செய்வதாக இருக்கலாம்:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

இது தேவையை விட complicated. மேலும் inefficient: `fullName`-க்கான stale value உடன் முழு render pass ஒன்றைச் செய்கிறது, பிறகு updated value உடன் உடனே re-render செய்கிறது. State variable மற்றும் Effect-ஐ remove செய்யுங்கள்:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**ஏதேனும் ஒன்று existing props அல்லது state-இலிருந்து calculate செய்ய முடிந்தால், [அதை state-இல் வைக்க வேண்டாம்.](/learn/choosing-the-state-structure#avoid-redundant-state) அதற்கு பதிலாக, rendering போது calculate செய்யுங்கள்.** இது உங்கள் code-ஐ faster (extra "cascading" updates தவிர்க்கிறீர்கள்), simpler (சில code remove செய்கிறீர்கள்), மற்றும் குறைவான error-prone (வேறு state variables ஒன்றுடன் ஒன்று out of sync ஆகும் bugs தவிர்க்கிறீர்கள்) ஆக்கும். இந்த அணுகுமுறை உங்களுக்கு புதிதாக இருந்தால், state-இல் என்ன செல்ல வேண்டும் என்பதை [Thinking in React](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) விளக்குகிறது.

### Expensive calculations-ஐ cache செய்தல் {/*caching-expensive-calculations*/}

இந்த component props மூலம் பெறும் `todos`-ஐ எடுத்து `filter` prop படி filter செய்து `visibleTodos` compute செய்கிறது. Result-ஐ state-இல் store செய்து Effect-இலிருந்து update செய்ய வேண்டும் என்று தோன்றலாம்:

```js {expectedErrors: {'react-compiler': [7]}} {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

முன்னைய example போல, இது தேவையற்றதும் inefficient-உம். முதலில் state மற்றும் Effect-ஐ remove செய்யுங்கள்:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

பொதுவாக இந்த code சரி! ஆனால் `getFilteredTodos()` slow ஆக இருக்கலாம் அல்லது உங்களிடம் நிறைய `todos` இருக்கலாம். அப்படியானால் `newTodo` போன்ற தொடர்பில்லாத state variable மாறினால் `getFilteredTodos()`-ஐ recalculate செய்ய விரும்பமாட்டீர்கள்.

Expensive calculation-ஐ [`useMemo`](/reference/react/useMemo) Hook-க்குள் wrap செய்வதன் மூலம் cache (அல்லது ["memoize"](https://en.wikipedia.org/wiki/Memoization)) செய்யலாம்:

<Note>

[React Compiler](/learn/react-compiler) expensive calculations-ஐ உங்களுக்காக automatic ஆக memoize செய்ய முடியும்; பல cases-இல் manual `useMemo` தேவையை இது நீக்குகிறது.

</Note>

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Or, written as a single line:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**`todos` அல்லது `filter` மாறியிருந்தால் மட்டுமே inner function re-run ஆக வேண்டும் என்று இது React-க்கு சொல்கிறது.** Initial render போது `getFilteredTodos()` return value-ஐ React நினைவில் வைத்துக்கொள்ளும். அடுத்த renders போது, `todos` அல்லது `filter` வேறுபட்டுள்ளதா என்று அது check செய்யும். Last time போலவே இருந்தால், `useMemo` store செய்த last result-ஐ return செய்யும். அவை வேறுபட்டால், React inner function-ஐ மீண்டும் call செய்து (அதன் result-ஐ store செய்து) return செய்யும்.

நீங்கள் [`useMemo`](/reference/react/useMemo)-க்குள் wrap செய்யும் function rendering போது run ஆகும், எனவே இது [pure calculations](/learn/keeping-components-pure)-க்கு மட்டும் வேலை செய்யும்.

<DeepDive>

#### ஒரு calculation expensive என்பதை எப்படி அறிதல்? {/*how-to-tell-if-a-calculation-is-expensive*/}

பொதுவாக, நீங்கள் ஆயிரக்கணக்கான objects create செய்தாலோ அல்லது loop செய்தாலோ தவிர, அது expensive ஆக இருக்க வாய்ப்பு குறைவு. மேலும் நம்பிக்கை பெற, code-ன் ஒரு பகுதியில் செலவாகும் நேரத்தை அளக்க console log சேர்க்கலாம்:

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

நீங்கள் அளக்கும் interaction-ஐ செய்யுங்கள் (உதாரணமாக, input-இல் type செய்வது). பிறகு console-இல் `filter array: 0.15ms` போன்ற logs காண்பீர்கள். மொத்த logged time குறிப்பிடத்தக்க அளவாக சேர்ந்தால் (எ.கா. `1ms` அல்லது அதற்கு மேல்), அந்த calculation-ஐ memoize செய்வது பொருத்தமாக இருக்கலாம். Experiment ஆக, அந்த interaction-க்கு total logged time குறைந்ததா என்பதை verify செய்ய calculation-ஐ `useMemo`-க்குள் wrap செய்யலாம்:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todos மற்றும் filter மாறவில்லை என்றால் skip செய்யப்படும்
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` *முதல்* render-ஐ faster ஆக்காது. Updates போது தேவையற்ற work-ஐ skip செய்ய மட்டுமே இது உதவும்.

உங்கள் machine பயனர்களின் machines-ஐ விட faster ஆக இருக்கலாம் என்பதை நினைவில் கொள்ளுங்கள்; எனவே artificial slowdown உடன் performance test செய்வது நல்லது. உதாரணமாக, இதற்காக Chrome [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option வழங்குகிறது.

Development-இல் performance measure செய்வது மிகச் சரியான results தராது என்பதையும் கவனிக்கவும். (உதாரணமாக, [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், ஒவ்வொரு component-மும் ஒருமுறை அல்ல இருமுறை render ஆகும்.) மிகச் சரியான timings பெற, உங்கள் app-ஐ production-க்காக build செய்து, பயனர்கள் வைத்திருப்பதைப் போன்ற device-இல் test செய்யுங்கள்.

</DeepDive>

### Prop மாறும் போது எல்லா state-ஐயும் reset செய்தல் {/*resetting-all-state-when-a-prop-changes*/}

இந்த `ProfilePage` component `userId` prop பெறுகிறது. Page-இல் comment input உள்ளது; அதன் value-ஐ வைத்திருக்க `comment` state variable use செய்கிறீர்கள். ஒருநாள் problem கவனிக்கிறீர்கள்: ஒரு profile-இலிருந்து மற்றொன்றுக்கு navigate செய்யும்போது, `comment` state reset ஆகவில்லை. அதன் விளைவாக, தவறான user profile-இல் comment post செய்வது மேம்படுகிறது. Issue-ஐ fix செய்ய, `userId` மாறும் போதெல்லாம் `comment` state variable-ஐ clear செய்ய விரும்புகிறீர்கள்:

```js {expectedErrors: {'react-compiler': [6]}} {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

இது inefficient, ஏனெனில் `ProfilePage` மற்றும் அதன் children முதலில் stale value உடன் render ஆகி, பிறகு மீண்டும் render ஆகும். மேலும் இது complicated, ஏனெனில் `ProfilePage`-க்குள் state கொண்ட *ஒவ்வொரு* component-இலும் இதைச் செய்ய வேண்டியிருக்கும். உதாரணமாக, comment UI nested ஆக இருந்தால், nested comment state-ஐயும் clear செய்ய விரும்புவீர்கள்.

அதற்கு பதிலாக, ஒவ்வொரு user's profile-உம் conceptually _different_ profile என்று React-க்கு explicit key கொடுத்து சொல்லலாம். உங்கள் component-ஐ இரண்டாக split செய்து, outer component-இலிருந்து inner one-க்கு `key` attribute pass செய்யுங்கள்:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

பொதுவாக, அதே component அதே இடத்தில் render செய்யப்பட்டால் React state-ஐ preserve செய்கிறது. **`Profile` component-க்கு `userId`-ஐ `key` ஆக pass செய்வதன் மூலம், வேறுபட்ட `userId` கொண்ட இரண்டு `Profile` components state share செய்யக்கூடாத இரண்டு different components ஆக நடத்த React-க்கு கேட்கிறீர்கள்.** Key (நீங்கள் `userId` ஆக set செய்தது) மாறும் ஒவ்வொரு முறையும், React DOM-ஐ recreate செய்து, `Profile` component மற்றும் அதன் children அனைத்தின் [state-ஐ reset](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) செய்யும். இப்போது profiles இடையில் navigate செய்யும்போது `comment` field automatic ஆக clear ஆகும்.

இந்த example-இல், outer `ProfilePage` component மட்டுமே export செய்யப்பட்டு project-இல் உள்ள பிற files-க்கு visible ஆகிறது என்பதை கவனிக்கவும். `ProfilePage` render செய்யும் components அதற்கு key pass செய்ய வேண்டியதில்லை: அவை `userId`-ஐ regular prop ஆக pass செய்கின்றன. `ProfilePage` அதை inner `Profile` component-க்கு `key` ஆக pass செய்வது implementation detail.

### Prop மாறும் போது சில state-ஐ adjust செய்தல் {/*adjusting-some-state-when-a-prop-changes*/}

சில நேரங்களில், prop change போது state-ன் ஒரு பகுதியை reset அல்லது adjust செய்ய விரும்பலாம், ஆனால் முழுவதையும் அல்ல.

இந்த `List` component `items` list-ஐ prop ஆக பெறுகிறது, மேலும் selected item-ஐ `selection` state variable-இல் maintain செய்கிறது. `items` prop வேறு array பெறும் ஒவ்வொரு முறையும் `selection`-ஐ `null` ஆக reset செய்ய விரும்புகிறீர்கள்:

```js {expectedErrors: {'react-compiler': [7]}} {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

இதுவும் ideal அல்ல. `items` மாறும் ஒவ்வொரு முறையும், `List` மற்றும் அதன் child components முதலில் stale `selection` value உடன் render ஆகும். பிறகு React DOM-ஐ update செய்து Effects-ஐ run செய்யும். இறுதியில், `setSelection(null)` call `List` மற்றும் அதன் child components-க்கு மற்றொரு re-render ஏற்படுத்தி, இந்த முழு process-ஐ மீண்டும் தொடங்கும்.

Effect-ஐ delete செய்வதிலிருந்து தொடங்குங்கள். அதற்கு பதிலாக, rendering போது state-ஐ நேரடியாக adjust செய்யுங்கள்:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

இப்படியாக [previous renders-இலிருந்து information store செய்தல்](/reference/react/useState#storing-information-from-previous-renders) புரிந்துகொள்ள கடினமாக இருக்கலாம், ஆனால் அதே state-ஐ Effect-இல் update செய்வதை விட இது சிறந்தது. மேலுள்ள example-இல், `setSelection` render போது நேரடியாக call செய்யப்படுகிறது. `return` statement உடன் அது வெளியேறியவுடன் React `List`-ஐ *உடனடியாக* re-render செய்யும். React இன்னும் `List` children-ஐ render செய்யவோ DOM-ஐ update செய்யவோ இல்லை, எனவே stale `selection` value-ஐ render செய்வதை `List` children skip செய்ய இது அனுமதிக்கிறது.

Rendering போது component-ஐ update செய்தால், React returned JSX-ஐ throw away செய்து உடனே rendering retry செய்யும். மிகவும் slow cascading retries தவிர்க்க, render போது *அதே* component-ன் state-ஐ மட்டுமே update செய்ய React அனுமதிக்கிறது. Render போது மற்றொரு component-ன் state-ஐ update செய்தால், error காண்பீர்கள். Loops தவிர்க்க `items !== prevItems` போன்ற condition அவசியம். State-ஐ இவ்வாறு adjust செய்யலாம், ஆனால் மற்ற side effects (DOM change செய்தல் அல்லது timeouts set செய்தல் போன்றவை) [components pure ஆக இருக்க](/learn/keeping-components-pure) event handlers அல்லது Effects-இல் இருக்க வேண்டும்.

**இந்த pattern Effect-ஐ விட efficient என்றாலும், பெரும்பாலான components-க்கு இதுவும் தேவையில்லை.** எப்படி செய்தாலும், props அல்லது மற்ற state அடிப்படையில் state adjust செய்வது உங்கள் data flow-ஐ புரிந்துகொள்ளவும் debug செய்யவும் கடினமாக்குகிறது. அதற்கு பதிலாக [key மூலம் எல்லா state-ஐ reset செய்ய](/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes) முடியுமா அல்லது [rendering போது எல்லாவற்றையும் calculate செய்ய](/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state) முடியுமா என்று எப்போதும் check செய்யுங்கள். உதாரணமாக, selected *item*-ஐ store (மற்றும் reset) செய்வதற்கு பதிலாக, selected *item ID*-ஐ store செய்யலாம்:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

இப்போது state-ஐ "adjust" செய்யவே தேவையில்லை. Selected ID உடைய item list-இல் இருந்தால், அது selected ஆகவே இருக்கும். இல்லையெனில், matching item கிடைக்காததால் rendering போது calculated `selection` `null` ஆகும். இந்த behavior வேறுபட்டது, ஆனால் arguably சிறந்தது; ஏனெனில் `items`-க்கு பெரும்பாலான changes selection-ஐ preserve செய்யும்.

### Event handlers இடையே logic பகிர்தல் {/*sharing-logic-between-event-handlers*/}

ஒரு product page-இல் இரண்டு buttons (Buy மற்றும் Checkout) உள்ளதாக வைத்துக்கொள்ளுங்கள்; இரண்டும் அந்த product-ஐ வாங்க அனுமதிக்கின்றன. User product-ஐ cart-இல் சேர்க்கும் ஒவ்வொரு முறையும் notification காட்ட விரும்புகிறீர்கள். இரண்டு buttons-ன் click handlers-இலுமே `showNotification()` call செய்வது repetitive ஆக தோன்றும்; எனவே இந்த logic-ஐ Effect-இல் வைக்க நீங்கள் tempted ஆகலாம்:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`${product.name} shopping cart-இல் சேர்க்கப்பட்டது!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

இந்த Effect தேவையற்றது. பெரும்பாலும் இது bugs-ஐயும் ஏற்படுத்தும். உதாரணமாக, page reloads இடையிலும் உங்கள் app shopping cart-ஐ "நினைவில்" வைத்திருக்கிறது என வைத்துக்கொள்ளுங்கள். Product-ஐ cart-இல் ஒருமுறை சேர்த்து page-ஐ refresh செய்தால், notification மீண்டும் தோன்றும். அந்த product page-ஐ refresh செய்யும் ஒவ்வொரு முறையும் அது தொடர்ந்து தோன்றும். காரணம், page load ஆகும்போதே `product.isInCart` ஏற்கனவே `true` ஆக இருக்கும்; எனவே மேலுள்ள Effect `showNotification()`-ஐ call செய்யும்.

**சில code Effect-இலா அல்லது event handler-இலா இருக்க வேண்டும் என்பது தெளிவாக இல்லையெனில், இந்த code *ஏன்* run ஆக வேண்டும் என்று உங்களையே கேளுங்கள். Component user-க்கு காட்டப்பட்டது *என்பதற்காக* run ஆக வேண்டிய code-க்கு மட்டும் Effects-ஐ use செய்யுங்கள்.** இந்த example-இல், page காட்டப்பட்டது என்பதற்காக அல்ல; user *button-ஐ அழுத்தியதால்* notification தோன்ற வேண்டும்! Effect-ஐ delete செய்து, shared logic-ஐ இரு event handlers-இலிருந்தும் call செய்யப்படும் ஒரு function-க்குள் வையுங்கள்:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`${product.name} shopping cart-இல் சேர்க்கப்பட்டது!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

இது தேவையற்ற Effect-ஐ remove செய்வதுடன் bug-ஐயும் fix செய்கிறது.

### POST request அனுப்புதல் {/*sending-a-post-request*/}

இந்த `Form` component இரண்டு வகையான POST requests அனுப்புகிறது. அது mount ஆகும்போது ஒரு analytics event அனுப்புகிறது. Form-ஐ நிரப்பி Submit button-ஐ click செய்தால், அது `/api/register` endpoint-க்கு POST request அனுப்பும்:

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

முந்தைய example-இல் இருந்த அதே criteria-ஐ இங்கே apply செய்வோம்.

Analytics POST request Effect-இலேயே இருக்க வேண்டும். ஏனெனில் analytics event-ஐ அனுப்புவதற்கான _காரணம்_ form காட்டப்பட்டது என்பதே. (Development-இல் அது இருமுறை fire ஆகும்; அதை எப்படி கையாளுவது என்பதை [இங்கே பார்க்கவும்](/learn/synchronizing-with-effects#sending-analytics).)

ஆனால் `/api/register` POST request form _காட்டப்பட்டதால்_ ஏற்படுவது அல்ல. நீங்கள் request-ஐ ஒரு குறிப்பிட்ட தருணத்தில் மட்டும் அனுப்ப விரும்புகிறீர்கள்: user button-ஐ அழுத்தும்போது. அது _அந்த குறிப்பிட்ட interaction_-இல் மட்டுமே நடக்க வேண்டும். இரண்டாவது Effect-ஐ delete செய்து, அந்த POST request-ஐ event handler-க்குள் move செய்யுங்கள்:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

சில logic-ஐ event handler-இலா அல்லது Effect-இலா வைக்க வேண்டும் என்று தீர்மானிக்கும்போது, user-ன் perspective-இல் அது _எந்த வகையான logic_ என்பதே நீங்கள் பதிலளிக்க வேண்டிய முக்கிய கேள்வி. இந்த logic ஒரு குறிப்பிட்ட interaction காரணமாக ஏற்பட்டால், அதை event handler-இல் வைத்திருங்கள். User screen-இல் component-ஐ _பார்ப்பதால்_ அது ஏற்படுமானால், அதை Effect-இல் வைத்திருங்கள்.

### Computations-ஐ chain செய்தல் {/*chains-of-computations*/}

சில நேரங்களில், ஒரு state-ன் ஒரு பகுதியை மற்ற state அடிப்படையில் adjust செய்யும் Effects-ஐ chain செய்ய உங்களுக்கு தோன்றலாம்:

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('நல்ல game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game ஏற்கனவே முடிந்துவிட்டது.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

இந்த code-இல் இரண்டு பிரச்சினைகள் உள்ளன.

முதல் பிரச்சினை, இது மிகவும் inefficient: chain-இல் உள்ள ஒவ்வொரு `set` call-க்கும் இடையில் component (மற்றும் அதன் children) re-render ஆக வேண்டும். மேலுள்ள example-இல், worst case-இல் (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) கீழுள்ள tree-க்கு மூன்று தேவையற்ற re-renders ஏற்படும்.

இரண்டாவது பிரச்சினை, அது slow அல்லாதிருந்தாலும், உங்கள் code evolve ஆகும்போது, நீங்கள் எழுதிய "chain" புதிய requirements-க்கு பொருந்தாத cases-ஐ சந்திப்பீர்கள். Game moves history-ஐ step through செய்ய ஒரு வழி சேர்க்கிறீர்கள் என கற்பனை செய்யுங்கள். அதற்காக ஒவ்வொரு state variable-ஐயும் கடந்தகால value ஒன்றாக update செய்வீர்கள். ஆனால் `card` state-ஐ கடந்தகால value-ஆக set செய்தால் Effect chain மீண்டும் trigger ஆகி, நீங்கள் காட்டும் data-ஐ மாற்றிவிடும். இத்தகைய code பெரும்பாலும் rigid மற்றும் fragile ஆக இருக்கும்.

இந்த case-இல், rendering போது calculate செய்யக்கூடியதை calculate செய்து, state-ஐ event handler-இல் adjust செய்வது சிறந்தது:

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game ஏற்கனவே முடிந்துவிட்டது.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('நல்ல game!');
        }
      }
    }
  }

  // ...
```

இது மிகவும் efficient. மேலும், game history-ஐ view செய்ய ஒரு வழி implement செய்தால், இப்போது ஒவ்வொரு state variable-ஐயும் கடந்தகால move-ஆக set செய்ய முடியும்; மற்ற ஒவ்வொரு value-யையும் adjust செய்யும் Effect chain trigger ஆகாது. பல event handlers இடையே logic-ஐ reuse செய்ய வேண்டுமெனில், நீங்கள் [ஒரு function extract செய்து](#sharing-logic-between-event-handlers) அந்த handlers-இலிருந்து அதை call செய்யலாம்.

Event handlers-க்குள் [state snapshot போல behave செய்யும்](/learn/state-as-a-snapshot) என்பதை நினைவில் கொள்ளுங்கள். உதாரணமாக, `setRound(round + 1)` call செய்த பிறகும், `round` variable user button click செய்த நேரத்தில் இருந்த value-ஐயே பிரதிபலிக்கும். Calculations-க்கு அடுத்த value தேவைப்பட்டால், அதை `const nextRound = round + 1` போல manual ஆக define செய்யுங்கள்.

சில cases-இல், அடுத்த state-ஐ event handler-இல் நேரடியாக calculate செய்ய *முடியாது*. உதாரணமாக, பல dropdowns உள்ள form ஒன்றை கற்பனை செய்யுங்கள்; அடுத்த dropdown-ன் options முந்தைய dropdown-இல் selected value-ஐ சார்ந்திருக்கின்றன. அப்போது நீங்கள் network உடன் synchronize செய்வதால் Effects chain பொருத்தமானது.

### Application-ஐ initialize செய்தல் {/*initializing-the-application*/}

சில logic app load ஆகும்போது ஒருமுறை மட்டுமே run ஆக வேண்டும்.

அதை top-level component-இல் உள்ள Effect-இல் வைக்க நீங்கள் tempted ஆகலாம்:

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

ஆனால் அது [development-இல் இருமுறை run ஆகும்](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) என்பதை நீங்கள் விரைவில் கவனிப்பீர்கள். இது issues ஏற்படுத்தலாம்; உதாரணமாக, function இருமுறை call செய்ய வடிவமைக்கப்படாததால் authentication token invalid ஆகக்கூடும். பொதுவாக, உங்கள் components remount செய்யப்படும்போது resilient ஆக இருக்க வேண்டும். இதில் உங்கள் top-level `App` component-உம் அடங்கும்.

Production-இல் நடைமுறையில் அது ஒருபோதும் remount ஆகாமல் இருக்கலாம்; ஆனால் எல்லா components-இலும் அதே constraints-ஐ பின்பற்றுவது code-ஐ move செய்யவும் reuse செய்யவும் உதவும். சில logic *ஒவ்வொரு component mount-க்கும் ஒருமுறை* அல்ல, *ஒவ்வொரு app load-க்கும் ஒருமுறை* மட்டுமே run ஆக வேண்டும் என்றால், அது ஏற்கனவே execute ஆனதா என்று track செய்ய top-level variable சேர்க்கவும்:

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Module initialization போது, app render ஆகும் முன்பும் அதை run செய்யலாம்:

```js {1,5}
if (typeof window !== 'undefined') { // browser-இல் run ஆகிறோமா என்று check செய்க.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Top level-இல் உள்ள code உங்கள் component import செய்யப்படும் போது ஒருமுறை run ஆகும்; அது இறுதியில் render ஆகவில்லை என்றாலும். Arbitrary components import செய்யும்போது slowdown அல்லது எதிர்பாராத behavior தவிர்க்க, இந்த pattern-ஐ அதிகமாக use செய்ய வேண்டாம். App-wide initialization logic-ஐ `App.js` போன்ற root component modules-இலோ அல்லது உங்கள் application's entry point-இலோ வைத்திருங்கள்.

### State changes பற்றி parent components-க்கு தெரிவித்தல் {/*notifying-parent-components-about-state-changes*/}

`true` அல்லது `false` ஆக இருக்கக்கூடிய internal `isOn` state கொண்ட `Toggle` component எழுதுகிறீர்கள் என வைத்துக்கொள்ளுங்கள். அதை toggle செய்ய சில வேறுபட்ட வழிகள் உள்ளன (click செய்வது அல்லது drag செய்வது). `Toggle`-ன் internal state மாறும் ஒவ்வொரு முறையும் parent component-க்கு தெரிவிக்க விரும்புகிறீர்கள்; எனவே `onChange` event-ஐ expose செய்து அதை Effect-இலிருந்து call செய்கிறீர்கள்:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

முன்னதாக பார்த்தது போல, இது ideal அல்ல. `Toggle` முதலில் தனது state-ஐ update செய்கிறது, பின்னர் React screen-ஐ update செய்கிறது. அதன் பிறகு React Effect-ஐ run செய்து, parent component-இலிருந்து pass செய்யப்பட்ட `onChange` function-ஐ call செய்கிறது. இப்போது parent component தனது state-ஐ update செய்து, மற்றொரு render pass-ஐ தொடங்கும். எல்லாவற்றையும் ஒரே pass-இல் செய்வது சிறந்தது.

Effect-ஐ delete செய்து, அதற்கு பதிலாக *இரு* components-ன் state-ஐயும் அதே event handler-க்குள் update செய்யுங்கள்:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

இந்த அணுகுமுறையில், `Toggle` component மற்றும் அதன் parent component இரண்டும் event நேரத்தில் தங்கள் state-ஐ update செய்கின்றன. React வெவ்வேறு components-இலிருந்து வரும் [updates-ஐ ஒன்றாக batch செய்கிறது](/learn/queueing-a-series-of-state-updates), எனவே ஒரே render pass மட்டுமே இருக்கும்.

State-ஐ முழுமையாக remove செய்து, அதற்கு பதிலாக parent component-இலிருந்து `isOn`-ஐ பெறவும் முடியும்:

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["State-ஐ மேலே lifting செய்வது"](/learn/sharing-state-between-components) parent component தனது சொந்த state-ஐ toggle செய்வதன் மூலம் `Toggle`-ஐ முழுமையாக control செய்ய அனுமதிக்கிறது. இதன் பொருள் parent component அதிக logic கொண்டிருக்க வேண்டியிருக்கும்; ஆனால் மொத்தத்தில் கவலைப்பட வேண்டிய state குறையும். இரண்டு வேறுபட்ட state variables-ஐ synchronized ஆக வைத்திருக்க முயற்சிக்கும் ஒவ்வொரு முறையும், அதற்கு பதிலாக state-ஐ மேலே lift செய்ய முயற்சிக்கவும்!

### Parent-க்கு data pass செய்தல் {/*passing-data-to-the-parent*/}

இந்த `Child` component சில data-ஐ fetch செய்து, பிறகு அதை Effect-இல் `Parent` component-க்கு pass செய்கிறது:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React-இல், data parent components-இலிருந்து அவற்றின் children-க்கு flow ஆகிறது. Screen-இல் ஏதாவது தவறாக தெரிந்தால், எந்த component தவறான prop-ஐ pass செய்கிறது அல்லது தவறான state வைத்திருக்கிறது என்பதை கண்டுபிடிக்கும் வரை component chain-இல் மேலே சென்று information எங்கிருந்து வருகிறது என்பதை trace செய்யலாம். Child components Effects-இல் parent components-ன் state-ஐ update செய்தால், data flow-ஐ trace செய்வது மிகவும் கடினமாகும். Child மற்றும் parent இரண்டுக்கும் அதே data தேவைப்படுவதால், parent component அந்த data-ஐ fetch செய்து, அதற்கு பதிலாக child-க்கு *கீழே pass* செய்யட்டும்:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

இது நேரடியானது; மேலும் data flow-ஐ predictable ஆக வைத்திருக்கிறது: data parent-இலிருந்து child-க்கு கீழே flow ஆகிறது.

### External store-க்கு subscribe செய்தல் {/*subscribing-to-an-external-store*/}

சில நேரங்களில், உங்கள் components React state-க்கு வெளியே உள்ள சில data-க்கு subscribe செய்ய வேண்டியிருக்கும். இந்த data ஒரு third-party library-இலிருந்தோ அல்லது built-in browser API-இலிருந்தோ வரலாம். React-க்கு தெரியாமலே இந்த data மாறக்கூடியதால், உங்கள் components-ஐ அதற்கு manual ஆக subscribe செய்ய வேண்டும். இது பெரும்பாலும் Effect மூலம் செய்யப்படுகிறது, உதாரணமாக:

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

இங்கே, component ஒரு external data store-க்கு subscribe செய்கிறது (இந்த case-இல் browser `navigator.onLine` API). இந்த API server-இல் இல்லாததால் (அதனால் initial HTML-க்கு use செய்ய முடியாது), ஆரம்பத்தில் state `true` ஆக set செய்யப்படுகிறது. Browser-இல் அந்த data store-ன் value மாறும் ஒவ்வொரு முறையும், component தனது state-ஐ update செய்கிறது.

இதற்காக Effects use செய்வது பொதுவானதாக இருந்தாலும், external store-க்கு subscribe செய்வதற்காக React-ல் purpose-built Hook உள்ளது; அதையே முன்னுரிமையாக use செய்ய வேண்டும். Effect-ஐ delete செய்து, அதை [`useSyncExternalStore`](/reference/react/useSyncExternalStore) call ஆக மாற்றுங்கள்:

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // அதே function-ஐ pass செய்யும் வரை React resubscribe செய்யாது
    () => navigator.onLine, // client-இல் value பெறுவது எப்படி
    () => true // server-இல் value பெறுவது எப்படி
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Mutable data-ஐ Effect மூலம் React state-க்கு manual ஆக sync செய்வதை விட இந்த அணுகுமுறை குறைவான error-prone. பொதுவாக, மேலுள்ள `useOnlineStatus()` போன்ற custom Hook எழுதுவீர்கள்; அப்போது individual components-இல் இந்த code-ஐ repeat செய்ய தேவையில்லை. [React components-இலிருந்து external stores-க்கு subscribe செய்வது பற்றி மேலும் படிக்கவும்.](/reference/react/useSyncExternalStore)

### Data fetch செய்தல் {/*fetching-data*/}

பல apps data fetching-ஐ தொடங்க Effects use செய்கின்றன. இவ்வாறு data fetching Effect எழுதுவது மிகவும் பொதுவானது:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

இந்த fetch-ஐ event handler-க்கு move செய்ய *வேண்டியதில்லை*.

முந்தைய examples-இல் logic-ஐ event handlers-க்குள் வைக்க வேண்டியிருந்தது; அதற்கு இது contradiction போல தோன்றலாம்! ஆனால் fetch செய்வதற்கான முக்கிய காரணம் *typing event* அல்ல என்பதை கவனியுங்கள். Search inputs பெரும்பாலும் URL-இலிருந்து prepopulate செய்யப்படும்; user input-ஐ தொடாமலேயே Back மற்றும் Forward navigate செய்யலாம்.

`page` மற்றும் `query` எங்கிருந்து வருகிறது என்பது முக்கியமல்ல. இந்த component visible ஆக இருக்கும் வரை, current `page` மற்றும் `query`-க்கான network data உடன் `results`-ஐ [synchronized](/learn/synchronizing-with-effects) ஆக வைத்திருக்க விரும்புகிறீர்கள். இதனால்தான் இது Effect.

ஆனால் மேலுள்ள code-இல் bug உள்ளது. நீங்கள் `"hello"`-வை வேகமாக type செய்கிறீர்கள் என கற்பனை செய்யுங்கள். அப்போது `query` `"h"`-இலிருந்து `"he"`, `"hel"`, `"hell"`, மற்றும் `"hello"` ஆக மாறும். இது தனித்தனி fetches-ஐ தொடங்கும்; ஆனால் responses எந்த order-இல் வரும் என்பதில் guarantee இல்லை. உதாரணமாக, `"hell"` response, `"hello"` response-க்கு *பிறகு* வரலாம். அது கடைசியாக `setResults()` call செய்வதால், நீங்கள் தவறான search results காட்டுவீர்கள். இது ["race condition"](https://en.wikipedia.org/wiki/Race_condition) என்று அழைக்கப்படுகிறது: இரண்டு வேறுபட்ட requests ஒன்றுக்கொன்று "race" செய்து, நீங்கள் எதிர்பார்த்ததை விட வேறு order-இல் வந்தன.

**Race condition-ஐ fix செய்ய, stale responses-ஐ ignore செய்ய [cleanup function சேர்க்க](/learn/synchronizing-with-effects#fetching-data) வேண்டும்:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

உங்கள் Effect data fetch செய்யும்போது, கடைசியாக request செய்யப்பட்ட response தவிர மற்ற எல்லா responses-உம் ignored ஆகும் என்பதை இது உறுதி செய்கிறது.

Data fetching implement செய்வதில் race conditions-ஐ கையாள்வது மட்டுமே சிரமம் அல்ல. Responses-ஐ cache செய்வது (user Back click செய்ததும் previous screen உடனே தோன்ற), server-இல் data fetch செய்வது எப்படி (initial server-rendered HTML spinner பதிலாக fetched content கொண்டிருக்க), மற்றும் network waterfalls-ஐ தவிர்ப்பது எப்படி (ஒவ்வொரு parent-க்காக காத்திருக்காமல் child data fetch செய்ய) என்பதையும் நீங்கள் யோசிக்க வேண்டியிருக்கும்.

**இந்த issues React மட்டும் அல்ல, எந்த UI library-க்கும் பொருந்தும். அவற்றை solve செய்வது trivial அல்ல; அதனால் modern [frameworks](/learn/creating-a-react-app#full-stack-frameworks), Effects-இல் data fetch செய்வதை விட efficient ஆன built-in data fetching mechanisms வழங்குகின்றன.**

நீங்கள் framework use செய்யவில்லை (உங்களுடையதை build செய்யவும் விரும்பவில்லை) ஆனால் Effects-இலிருந்து data fetching-ஐ இன்னும் ergonomic ஆக்க விரும்பினால், இந்த example போல fetching logic-ஐ custom Hook ஆக extract செய்வதை consider செய்யுங்கள்:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Error handling-க்கும் content loading ஆகிறதா என்பதை track செய்யவும் சில logic சேர்க்க நீங்கள் விரும்பலாம். இப்படி ஒரு Hook-ஐ நீங்களே build செய்யலாம் அல்லது React ecosystem-இல் ஏற்கனவே உள்ள பல solutions-இல் ஒன்றை use செய்யலாம். **இது மட்டும் framework-ன் built-in data fetching mechanism use செய்வதைப் போல efficient ஆக இருக்காது; இருந்தாலும் data fetching logic-ஐ custom Hook-க்குள் move செய்வது, பின்னர் efficient data fetching strategy-ஐ adopt செய்வதை உதவும்.**

பொதுவாக, Effects எழுத வேண்டிய நிலை வந்தால், மேலுள்ள `useData` போன்ற இன்னும் declarative மற்றும் purpose-built API கொண்ட custom Hook-க்குள் ஒரு functionality-ஐ extract செய்ய முடியுமா என்று கவனித்து இருங்கள். உங்கள் components-இல் raw `useEffect` calls குறைவாக இருக்கும் அளவுக்கு, application-ஐ maintain செய்வது நேரடியாக இருக்கும்.

<Recap>

- Render போது ஏதாவது ஒன்றை calculate செய்ய முடிந்தால், உங்களுக்கு Effect தேவையில்லை.
- Expensive calculations-ஐ cache செய்ய, `useEffect` பதிலாக `useMemo` சேர்க்கவும்.
- முழு component tree-ன் state-ஐ reset செய்ய, அதற்கு வேறுபட்ட `key` pass செய்யவும்.
- Prop change-க்கு response ஆக state-ன் குறிப்பிட்ட பகுதியை reset செய்ய, rendering போது அதை set செய்யவும்.
- Component *காட்டப்பட்டதால்* run ஆகும் code Effects-இல் இருக்க வேண்டும்; மற்றவை events-இல் இருக்க வேண்டும்.
- பல components-ன் state-ஐ update செய்ய வேண்டுமெனில், அதை ஒரே event-இல் செய்வது சிறந்தது.
- வேறுபட்ட components-இல் உள்ள state variables-ஐ synchronize செய்ய முயற்சிக்கும் ஒவ்வொரு முறையும், state-ஐ மேலே lift செய்வதை consider செய்யுங்கள்.
- Effects மூலம் data fetch செய்யலாம்; ஆனால் race conditions தவிர்க்க cleanup implement செய்ய வேண்டும்.

</Recap>

<Challenges>

#### Effects இல்லாமல் data-ஐ transform செய்தல் {/*transform-data-without-effects*/}

கீழுள்ள `TodoList` todos list ஒன்றைக் காட்டுகிறது. "செயலில் உள்ள todos மட்டும் காட்டு" checkbox tick செய்யப்பட்டால், completed todos list-இல் காட்டப்படாது. எந்த todos visible ஆக இருந்தாலும், footer இன்னும் completed ஆகாத todos count-ஐ காட்டும்.

தேவையற்ற state மற்றும் Effects அனைத்தையும் remove செய்து இந்த component-ஐ simplify செய்யுங்கள்.

<Sandpack>

```js {expectedErrors: {'react-compiler': [12, 16, 20]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos மீதம்
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        செயலில் உள்ள todos மட்டும் காட்டு
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        சேர்
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('ஆப்பிள்கள் வாங்கு', true),
  createTodo('ஆரஞ்சுகள் வாங்கு', true),
  createTodo('கேரட்டுகள் வாங்கு'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Rendering போது ஏதாவது ஒன்றை calculate செய்ய முடிந்தால், அதற்காக state அல்லது அதை update செய்யும் Effect தேவையில்லை.

</Hint>

<Solution>

இந்த example-இல் இரண்டு essential state pieces மட்டுமே உள்ளன: `todos` list மற்றும் checkbox tick செய்யப்பட்டுள்ளதா என்பதை காட்டும் `showActive` state variable. மற்ற எல்லா state variables-உம் [redundant](/learn/choosing-the-state-structure#avoid-redundant-state); அவற்றை rendering போது calculate செய்யலாம். இதில் `footer`-உம் அடங்கும்; அதை surrounding JSX-க்குள் நேரடியாக move செய்யலாம்.

உங்கள் முடிவு இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        செயலில் உள்ள todos மட்டும் காட்டு
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos மீதம்
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        சேர்
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('ஆப்பிள்கள் வாங்கு', true),
  createTodo('ஆரஞ்சுகள் வாங்கு', true),
  createTodo('கேரட்டுகள் வாங்கு'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Effects இல்லாமல் calculation-ஐ cache செய்தல் {/*cache-a-calculation-without-effects*/}

இந்த example-இல், todos-ஐ filter செய்வது `getVisibleTodos()` என்ற தனி function-ஆக extract செய்யப்பட்டுள்ளது. அந்த function-க்குள் `console.log()` call உள்ளது; அது எப்போது call செய்யப்படுகிறது என்பதை கவனிக்க உதவும். "செயலில் உள்ள todos மட்டும் காட்டு" என்பதை toggle செய்து, அது `getVisibleTodos()`-ஐ re-run செய்யவைக்கிறது என்பதை கவனியுங்கள். எந்த todos-ஐ display செய்ய வேண்டும் என்பதை toggle செய்யும்போது visible todos மாறுவதால், இது எதிர்பார்க்கப்பட்டதே.

`TodoList` component-இல் `visibleTodos` list-ஐ மீண்டும் compute செய்யும் Effect-ஐ remove செய்வதே உங்கள் பணி. ஆனால் input-இல் type செய்யும்போது `getVisibleTodos()` *re-run ஆகாது* (அதனால் logs print ஆகாது) என்பதை உறுதி செய்ய வேண்டும்.

<Hint>

Visible todos-ஐ cache செய்ய `useMemo` call சேர்ப்பது ஒரு solution. இன்னொரு, அவ்வளவு வெளிப்படையாகத் தெரியாத solution-உம் உள்ளது.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        செயலில் உள்ள todos மட்டும் காட்டு
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        சேர்
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() ${++calls} முறை call செய்யப்பட்டது`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('ஆப்பிள்கள் வாங்கு', true),
  createTodo('ஆரஞ்சுகள் வாங்கு', true),
  createTodo('கேரட்டுகள் வாங்கு'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

State variable மற்றும் Effect-ஐ remove செய்து, அதற்கு பதிலாக `getVisibleTodos()` call-ன் result-ஐ cache செய்ய `useMemo` call சேர்க்கவும்:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        செயலில் உள்ள todos மட்டும் காட்டு
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        சேர்
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() ${++calls} முறை call செய்யப்பட்டது`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('ஆப்பிள்கள் வாங்கு', true),
  createTodo('ஆரஞ்சுகள் வாங்கு', true),
  createTodo('கேரட்டுகள் வாங்கு'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

இந்த change உடன், `todos` அல்லது `showActive` மாறினால் மட்டுமே `getVisibleTodos()` call செய்யப்படும். Input-இல் type செய்வது `text` state variable-ஐ மட்டும் மாற்றுவதால், அது `getVisibleTodos()` call-ஐ trigger செய்யாது.

`useMemo` தேவையில்லாத இன்னொரு solution-உம் உள்ளது. `text` state variable todos list-ஐ எந்தவிதமாகவும் பாதிக்க முடியாததால், `NewTodo` form-ஐ தனி component-ஆக extract செய்து, `text` state variable-ஐ அதற்குள் move செய்யலாம்:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        செயலில் உள்ள todos மட்டும் காட்டு
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        சேர்
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() ${++calls} முறை call செய்யப்பட்டது`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('ஆப்பிள்கள் வாங்கு', true),
  createTodo('ஆரஞ்சுகள் வாங்கு', true),
  createTodo('கேரட்டுகள் வாங்கு'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

இந்த approach-உம் requirements-ஐ satisfy செய்கிறது. Input-இல் type செய்யும்போது `text` state variable மட்டும் update ஆகிறது. `text` state variable child `NewTodo` component-க்குள் இருப்பதால், parent `TodoList` component re-render ஆகாது. அதனால்தான் நீங்கள் type செய்யும்போது `getVisibleTodos()` call செய்யப்படாது. (`TodoList` வேறு காரணத்தால் re-render ஆனால் அது இன்னும் call செய்யப்படும்.)

</Solution>

#### Effects இல்லாமல் state-ஐ reset செய்தல் {/*reset-state-without-effects*/}

இந்த `EditContact` component `{ id, name, email }` வடிவிலான contact object-ஐ `savedContact` prop ஆக பெறுகிறது. Name மற்றும் email input fields-ஐ edit செய்து பாருங்கள். Save அழுத்தும்போது, form-க்கு மேலுள்ள contact-ன் button edited name-ஆக update ஆகிறது. Reset அழுத்தும்போது, form-இல் pending ஆக உள்ள changes அனைத்தும் discard செய்யப்படும். இந்த UI எப்படி இயங்குகிறது என்பதை உணர்ந்து கொள்ள சிறிது பயன்படுத்திப் பாருங்கள்.

மேலுள்ள buttons மூலம் ஒரு contact-ஐ select செய்யும்போது, அந்த contact-ன் details-ஐ பிரதிபலிக்க form reset ஆகிறது. இது `EditContact.js`-க்குள் உள்ள Effect மூலம் செய்யப்படுகிறது. இந்த Effect-ஐ remove செய்யுங்கள். `savedContact.id` மாறும்போது form-ஐ reset செய்ய மற்றொரு வழியை கண்டுபிடியுங்கள்.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js {expectedErrors: {'react-compiler': [8, 9]}} src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        பெயர்:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        மின்னஞ்சல்:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        சேமி
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset செய்
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

`savedContact.id` வேறுபட்டால், `EditContact` form conceptually _வேறு contact-ன் form_ என்றும் state preserve செய்யக்கூடாது என்றும் React-க்கு சொல்ல ஒரு வழி இருந்தால் நன்றாக இருக்கும். அப்படியான வழி ஏதேனும் நினைவிருக்கிறதா?

</Hint>

<Solution>

`EditContact` component-ஐ இரண்டாக split செய்யுங்கள். Form state அனைத்தையும் inner `EditForm` component-க்குள் move செய்யுங்கள். Outer `EditContact` component-ஐ export செய்து, அது `savedContact.id`-ஐ inner `EditForm` component-க்கு `key` ஆக pass செய்யுமாறு செய்யுங்கள். அதன் விளைவாக, நீங்கள் வேறு contact-ஐ select செய்யும் ஒவ்வொரு முறையும் inner `EditForm` component form state அனைத்தையும் reset செய்து DOM-ஐ recreate செய்யும்.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        பெயர்:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        மின்னஞ்சல்:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        சேமி
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset செய்
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Effects இல்லாமல் form submit செய்தல் {/*submit-a-form-without-effects*/}

இந்த `Form` component ஒரு நண்பருக்கு message அனுப்ப அனுமதிக்கிறது. நீங்கள் form-ஐ submit செய்தால், `showForm` state variable `false` ஆக set செய்யப்படும். இது `sendMessage(message)` call செய்யும் Effect-ஐ trigger செய்கிறது; அது message-ஐ அனுப்பும் (console-இல் பார்க்கலாம்). Message அனுப்பப்பட்ட பிறகு, form-க்கு திரும்ப செல்ல உதவும் "Chat-ஐ திற" button உடன் "நன்றி" dialog-ஐ பார்க்கிறீர்கள்.

உங்கள் app-ன் users மிக அதிகமான messages அனுப்புகிறார்கள். Chat செய்வதை சிறிது கடினமாக்க, form-க்கு பதிலாக "நன்றி" dialog-ஐ *முதலில்* காட்ட முடிவு செய்துள்ளீர்கள். `showForm` state variable-ஐ `true` பதிலாக `false` ஆக initialize செய்ய மாற்றுங்கள். அந்த change செய்தவுடன், empty message அனுப்பப்பட்டது என்று console காட்டும். இந்த logic-இல் ஏதோ தவறு உள்ளது!

இந்த பிரச்சினையின் root cause என்ன? அதை எப்படி fix செய்வது?

<Hint>

User "நன்றி" dialog-ஐ பார்த்ததால் message அனுப்பப்பட வேண்டுமா? அல்லது அதற்கு மாறாக இருக்க வேண்டுமா?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>எங்கள் சேவைகளை பயன்படுத்தியதற்கு நன்றி!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Chat-ஐ திற
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="செய்தி"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        அனுப்பு
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('செய்தி அனுப்பப்படுகிறது: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` state variable form-ஐ காட்ட வேண்டுமா அல்லது "நன்றி" dialog-ஐ காட்ட வேண்டுமா என்பதை தீர்மானிக்கிறது. ஆனால் "நன்றி" dialog _காட்டப்பட்டது_ என்பதற்காக நீங்கள் message அனுப்பவில்லை. User _form-ஐ submit செய்ததால்_ message அனுப்ப விரும்புகிறீர்கள். Misleading Effect-ஐ delete செய்து, `sendMessage` call-ஐ `handleSubmit` event handler-க்குள் move செய்யுங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>எங்கள் சேவைகளை பயன்படுத்தியதற்கு நன்றி!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Chat-ஐ திற
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="செய்தி"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        அனுப்பு
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('செய்தி அனுப்பப்படுகிறது: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

இந்த version-இல் _form submit செய்வது_ (அது ஒரு event) மட்டுமே message அனுப்ப காரணமாகிறது என்பதை கவனியுங்கள். `showForm` ஆரம்பத்தில் `true` ஆக set செய்யப்பட்டிருந்தாலும் `false` ஆக set செய்யப்பட்டிருந்தாலும் இது அதேபோல் வேலை செய்யும். (அதை `false` ஆக set செய்து, extra console messages இல்லை என்பதை கவனியுங்கள்.)

</Solution>

</Challenges>
