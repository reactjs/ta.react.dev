---
title: useMemo
---

<Intro>

`useMemo` என்பது re-renders இடையில் ஒரு calculation-ன் result-ஐ cache செய்ய உதவும் React Hook ஆகும்.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) values மற்றும் functions-ஐ automatically memoize செய்து, manual `useMemo` calls-ன் தேவையை குறைக்கிறது. Memoization-ஐ automatic ஆக handle செய்ய compiler-ஐ use செய்யலாம்.

</Note>

<InlineToc />

---

## மேற்கோள் {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Re-renders இடையில் ஒரு calculation-ஐ cache செய்ய, உங்கள் component-ன் top level-இல் `useMemo`-ஐ call செய்யுங்கள்:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `calculateValue`: நீங்கள் cache செய்ய விரும்பும் value-ஐ calculate செய்யும் function. இது pure ஆக இருக்க வேண்டும், arguments எதையும் எடுக்கக் கூடாது, எந்த type value-யையும் return செய்யலாம். Initial render போது React உங்கள் function-ஐ call செய்யும். அடுத்த renders-இல், கடைசி render-இலிருந்து `dependencies` மாறவில்லை என்றால் React அதே value-ஐ மீண்டும் return செய்யும். இல்லையெனில், அது `calculateValue`-ஐ call செய்து, அதன் result-ஐ return செய்து, பின்னர் reuse செய்ய store செய்யும்.

* `dependencies`: `calculateValue` code-க்குள் reference செய்யப்படும் எல்லா reactive values-ன் பட்டியல். Reactive values-ல் props, state, மேலும் உங்கள் component body-க்குள் நேரடியாக declare செய்யப்பட்ட எல்லா variables மற்றும் functions அடங்கும். உங்கள் linter [React-க்காக configure செய்யப்பட்டிருந்தால்](/learn/editor-setup#linting), ஒவ்வொரு reactive value-மும் dependency ஆக சரியாக குறிப்பிடப்பட்டுள்ளதா என்று அது verify செய்யும். Dependencies பட்டியல் constant number of items-ஐ கொண்டிருக்க வேண்டும்; `[dep1, dep2, dep3]` போல inline ஆக எழுதப்பட வேண்டும். React ஒவ்வொரு dependency-யையும் அதன் previous value-உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் ஒப்பிடும்.

#### திரும்பும் மதிப்பு {/*returns*/}

Initial render-இல், arguments இல்லாமல் `calculateValue` call செய்த result-ஐ `useMemo` return செய்கிறது.

அடுத்த renders-இல், dependencies மாறவில்லை என்றால் last render-இலிருந்து ஏற்கனவே stored value-ஐ return செய்யும்; இல்லையெனில் `calculateValue`-ஐ மீண்டும் call செய்து, `calculateValue` return செய்த result-ஐ return செய்யும்.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `useMemo` ஒரு Hook என்பதால், அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-க்குள் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் அதை call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component-ஐ extract செய்து state-ஐ அதற்குள் நகர்த்துங்கள்.
* Strict Mode-இல், [தற்செயலான impurities-ஐ கண்டுபிடிக்க உதவ](/reference/react/useMemo#my-calculation-runs-twice-on-every-re-render) React உங்கள் calculation function-ஐ **இருமுறை call செய்யும்**. இது development-only behavior; production-ஐ பாதிக்காது. உங்கள் calculation function pure ஆக இருந்தால் (அப்படித்தான் இருக்க வேண்டும்), இது உங்கள் logic-ஐ பாதிக்கக் கூடாது. Calls-இல் ஒன்றின் result புறக்கணிக்கப்படும்.
* React **அப்படி செய்ய குறிப்பிட்ட காரணம் இல்லாவிட்டால் cached value-ஐ தூக்கி எறியாது.** உதாரணமாக, development-இல், உங்கள் component file-ஐ edit செய்யும்போது React cache-ஐ தூக்கி எறியும். Development மற்றும் production இரண்டிலும், initial mount போது உங்கள் component suspend ஆனால் React cache-ஐ தூக்கி எறியும். எதிர்காலத்தில், cache-ஐ தூக்கி எறிவதைப் பயன்படுத்தும் கூடுதல் features-ஐ React சேர்க்கலாம்--உதாரணமாக, எதிர்காலத்தில் virtualized lists-க்கு built-in support சேர்த்தால், virtualized table viewport-இலிருந்து scroll out ஆகும் items-க்கு cache-ஐ தூக்கி எறிவது பொருத்தமாக இருக்கும். `useMemo`-வை performance optimization ஆக மட்டுமே நீங்கள் நம்பினால் இது சரியே. இல்லையெனில், [state variable](/reference/react/useState#avoiding-recreating-the-initial-state) அல்லது [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) மேலும் பொருத்தமாக இருக்கலாம்.

<Note>

இவ்வாறு return values-ஐ cache செய்வது [*memoization*](https://en.wikipedia.org/wiki/Memoization) என்றும் அழைக்கப்படுகிறது; அதனால்தான் இந்த Hook `useMemo` என்று அழைக்கப்படுகிறது.

</Note>

---

## பயன்பாடு {/*usage*/}

### செலவு அதிகமான recalculations-ஐ skip செய்தல் {/*skipping-expensive-recalculations*/}

Re-renders இடையில் ஒரு calculation-ஐ cache செய்ய, உங்கள் component-ன் top level-இல் அதை `useMemo` call-க்குள் wrap செய்யுங்கள்:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo`-க்கு நீங்கள் இரண்டு விஷயங்களை pass செய்ய வேண்டும்:

1. `() =>` போல arguments எதையும் எடுக்காமல், நீங்கள் calculate செய்ய விரும்பியதை return செய்யும் <CodeStep step={1}>calculation function</CodeStep>.
2. உங்கள் calculation-க்குள் use செய்யப்படும் உங்கள் component-இன் ஒவ்வொரு value-யையும் கொண்ட <CodeStep step={2}>dependencies பட்டியல்</CodeStep>.

Initial render-இல், `useMemo`-இலிருந்து நீங்கள் பெறும் <CodeStep step={3}>value</CodeStep>, உங்கள் <CodeStep step={1}>calculation</CodeStep>-ஐ call செய்த result ஆக இருக்கும்.

ஒவ்வொரு அடுத்த render-இலும், React <CodeStep step={2}>dependencies</CodeStep>-ஐ last render போது நீங்கள் pass செய்த dependencies-உடன் compare செய்யும். Dependencies எதுவும் மாறவில்லை என்றால் ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) மூலம் ஒப்பிடும்போது), `useMemo` நீங்கள் முன்பு calculate செய்த value-ஐ return செய்யும். இல்லையெனில், React உங்கள் calculation-ஐ மீண்டும் run செய்து புதிய value-ஐ return செய்யும்.

வேறு வார்த்தைகளில், அதன் dependencies மாறும் வரை `useMemo` re-renders இடையில் calculation result-ஐ cache செய்கிறது.

**இது எப்போது பயனுள்ளதாக இருக்கும் என்பதைப் பார்க்க ஒரு example-ஐப் பார்ப்போம்.**

Default ஆக, உங்கள் component re-render ஆகும் ஒவ்வொரு முறையும் அதன் முழு body-யையும் React மீண்டும் run செய்யும். உதாரணமாக, இந்த `TodoList` தனது state-ஐ update செய்தாலோ parent-இலிருந்து புதிய props பெற்றாலோ, `filterTodos` function மீண்டும் run ஆகும்:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

பொதுவாக இது பிரச்சினையல்ல, ஏனெனில் பெரும்பாலான calculations மிகவும் வேகமானவை. ஆனால் நீங்கள் பெரிய array-ஐ filter அல்லது transform செய்தாலோ, செலவு அதிகமான computation செய்தாலோ, data மாறவில்லை என்றால் அதை மீண்டும் செய்வதை skip செய்ய விரும்பலாம். `todos` மற்றும் `tab` இரண்டும் last render-இல் இருந்தது போலவே இருந்தால், முன்பு காட்டியபடி calculation-ஐ `useMemo`-க்குள் wrap செய்வது, ஏற்கனவே calculate செய்த `visibleTodos`-ஐ reuse செய்ய அனுமதிக்கும்.

இந்த வகை caching *[memoization](https://en.wikipedia.org/wiki/Memoization)* என்று அழைக்கப்படுகிறது.

<Note>

**`useMemo`-வை performance optimization ஆக மட்டுமே நம்ப வேண்டும்.** அது இல்லாமல் உங்கள் code வேலை செய்யவில்லை என்றால், அடிப்படை problem-ஐ கண்டுபிடித்து முதலில் fix செய்யுங்கள். அதன் பிறகு performance மேம்படுத்த `useMemo` சேர்க்கலாம்.

</Note>

<DeepDive>

#### ஒரு calculation செலவு அதிகமா என்பதை எப்படி அறிதல்? {/*how-to-tell-if-a-calculation-is-expensive*/}

பொதுவாக, நீங்கள் ஆயிரக்கணக்கான objects-ஐ create செய்தாலோ loop செய்தாலோ தவிர, அது செலவு அதிகமானதாக இருக்க வாய்ப்பு குறைவு. மேலும் நம்பிக்கை பெற, code-ன் ஒரு பகுதியிலான செலவான நேரத்தை அளக்க console log சேர்க்கலாம்:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

நீங்கள் அளக்கும் interaction-ஐ செய்யுங்கள் (உதாரணமாக, input-இல் type செய்வது). பின்னர் console-இல் `filter array: 0.15ms` போன்ற logs-ஐ காண்பீர்கள். மொத்த logged time குறிப்பிடத்தக்க அளவுக்கு சேர்ந்தால் (எ.கா. `1ms` அல்லது அதற்கு மேல்), அந்த calculation-ஐ memoize செய்வது பொருத்தமாக இருக்கலாம். ஒரு experiment ஆக, அந்த interaction-க்கு total logged time குறைந்ததா இல்லையா என்பதை verify செய்ய calculation-ஐ `useMemo`-க்குள் wrap செய்யலாம்:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
    return filterTodos(todos, tab); // todos மற்றும் tab மாறவில்லை என்றால் skip செய்யப்படும்
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` *முதல்* render-ஐ வேகமாக்காது. Updates போது தேவையற்ற work-ஐ skip செய்ய மட்டுமே இது உதவும்.

உங்கள் machine பயனர்களின் machines-ஐ விட வேகமாக இருக்கலாம் என்பதை நினைவில் கொள்ளுங்கள்; எனவே artificial slowdown உடன் performance-ஐ test செய்வது நல்லது. உதாரணமாக, இதற்காக Chrome [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) option-ஐ வழங்குகிறது.

Development-இல் performance-ஐ measure செய்வது மிகச் சரியான results-ஐ தராது என்பதையும் கவனிக்கவும். (உதாரணமாக, [Strict Mode](/reference/react/StrictMode) on ஆக இருந்தால், ஒவ்வொரு component-மும் ஒரு முறை அல்ல, இருமுறை render ஆகுவது தெரியும்.) மிகச் சரியான timings பெற, உங்கள் app-ஐ production-க்காக build செய்து, பயனர்கள் வைத்திருப்பதற்கு ஒத்த device-இல் test செய்யுங்கள்.

</DeepDive>

<DeepDive>

#### எல்லா இடத்திலும் useMemo சேர்க்க வேண்டுமா? {/*should-you-add-usememo-everywhere*/}

உங்கள் app இந்த site போல இருந்து, பெரும்பாலான interactions coarse ஆக இருந்தால் (ஒரு page அல்லது முழு section-ஐ replace செய்வது போன்றவை), memoization பொதுவாக தேவையில்லை. மறுபுறம், உங்கள் app drawing editor போல இருந்து, பெரும்பாலான interactions granular ஆக இருந்தால் (shapes-ஐ நகர்த்துவது போன்றவை), memoization மிகவும் பயனுள்ளதாக இருக்கலாம்.

`useMemo` மூலம் optimize செய்வது சில cases-இல் மட்டுமே மதிப்புடையது:

- நீங்கள் `useMemo`-க்குள் வைக்கும் calculation குறிப்பிடத்தக்க அளவு slow ஆகவும், அதன் dependencies அரிதாக மாறுபவையாகவும் இருக்கும்போது.
- அதை [`memo`](/reference/react/memo)-ஆல் wrap செய்யப்பட்ட component-க்கு prop ஆக pass செய்யும்போது. Value மாறவில்லை என்றால் re-rendering-ஐ skip செய்ய விரும்புகிறீர்கள். Dependencies ஒரே மாதிரியாக இல்லாதபோது மட்டுமே உங்கள் component re-render ஆக memoization அனுமதிக்கிறது.
- நீங்கள் pass செய்யும் value பின்னர் ஏதேனும் Hook-ன் dependency ஆக use செய்யப்படும் போது. உதாரணமாக, இன்னொரு `useMemo` calculation value அதைப் பொறுத்திருக்கலாம். அல்லது [`useEffect`](/reference/react/useEffect)-இலிருந்து இந்த value-ஐ நீங்கள் சார்ந்து இருக்கலாம்.

மற்ற cases-இல் calculation-ஐ `useMemo`-க்குள் wrap செய்வதால் பயன் இல்லை. அதைச் செய்வதால் பெரிதாக தீங்கும் இல்லை; அதனால் சில teams individual cases பற்றி யோசிக்காமல், முடிந்தவரை memoize செய்ய தேர்வு செய்கின்றன. இந்த அணுகுமுறையின் downside என்னவெனில் code குறைவாக readable ஆகிறது. மேலும், எல்லா memoization-உம் effective அல்ல: "எப்போதும் புதியது" ஆக இருக்கும் ஒரு single value, முழு component-ற்கான memoization-ஐ break செய்ய போதுமானது.

**நடைமுறையில், சில principles-ஐ பின்பற்றுவதன் மூலம் நிறைய memoization-ஐ தேவையற்றதாக்கலாம்:**

1. ஒரு component பிற components-ஐ visual ஆக wrap செய்தால், அது [JSX-ஐ children ஆக accept செய்ய](/learn/passing-props-to-a-component#passing-jsx-as-children) அனுமதியுங்கள். இவ்வாறு, wrapper component தனது state-ஐ update செய்தாலும், அதன் children re-render ஆக தேவையில்லை என்று React அறியும்.
1. Local state-ஐ prefer செய்யுங்கள்; தேவையை விட மேலாக [state-ஐ lift up](/learn/sharing-state-between-components) செய்ய வேண்டாம். உதாரணமாக, forms போன்ற transient state அல்லது item hovered ஆக உள்ளதா என்ற state-ஐ உங்கள் tree-ன் top-இலோ global state library-இலோ வைத்திருக்க வேண்டாம்.
1. உங்கள் [rendering logic-ஐ pure ஆக](/learn/keeping-components-pure) வைத்திருங்கள். ஒரு component re-render ஆகுவது problem ஏற்படுத்தினாலோ அல்லது கண்கூடாகத் தெரியும் visual artifact உருவாக்கினாலோ, அது உங்கள் component-இல் bug! Memoization சேர்ப்பதற்குப் பதிலாக bug-ஐ fix செய்யுங்கள்.
1. [State-ஐ update செய்யும் தேவையற்ற Effects](/learn/you-might-not-need-an-effect)-ஐ தவிர்க்கவும். React apps-இல் பெரும்பாலான performance problems, components மீண்டும் மீண்டும் render ஆக காரணமான Effects-இல் தொடங்கும் update chains-ஆல் ஏற்படுகின்றன.
1. உங்கள் Effects-இலிருந்து [தேவையற்ற dependencies-ஐ remove செய்ய](/learn/removing-effect-dependencies) முயற்சிக்கவும். உதாரணமாக, memoization-க்கு பதிலாக, சில object அல்லது function-ஐ Effect-க்குள் அல்லது component-க்கு வெளியே நகர்த்துவது பல நேரங்களில் நேரடியாக இருக்கும்.

ஒரு குறிப்பிட்ட interaction இன்னும் laggy ஆகத் தோன்றினால், memoization-இலிருந்து அதிக பயன் பெறும் components எவை என்பதைப் பார்க்க [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)-ஐ use செய்து, தேவையான இடங்களில் memoization சேர்க்கவும். இந்த principles உங்கள் components-ஐ debug செய்யவும் புரிந்துகொள்ளவும் உதவும், எனவே எந்த case-இலுமே அவற்றைப் பின்பற்றுவது நல்லது. நீண்ட காலத்தில், இதை முழுமையாக தீர்க்க [granular memoization-ஐ automatic ஆக செய்வது](https://www.youtube.com/watch?v=lGEMwh32soc) குறித்து நாங்கள் research செய்கிறோம்.

</DeepDive>

<Recipes titleText="useMemo மற்றும் value-ஐ நேரடியாக calculate செய்வதற்கிடையிலான வேறுபாடு" titleId="examples-recalculation">

#### `useMemo` மூலம் recalculation-ஐ skip செய்தல் {/*skipping-recalculation-with-usememo*/}

இந்த example-இல், rendering போது நீங்கள் call செய்யும் JavaScript function உண்மையில் slow ஆக இருந்தால் என்ன நடக்கும் என்பதை பார்க்க, `filterTodos` implementation **artificial ஆக slow செய்யப்பட்டுள்ளது**. Tabs-ஐ மாற்றியும் theme-ஐ toggle செய்தும் முயற்சிக்கவும்.

Tabs-ஐ மாற்றுவது slow ஆக உணரப்படும், ஏனெனில் அது slow செய்யப்பட்ட `filterTodos`-ஐ மீண்டும் execute செய்ய கட்டாயப்படுத்துகிறது. `tab` மாறியிருப்பதால் இது எதிர்பார்க்கப்படுகிறதே; அதனால் முழு calculation-ம் மீண்டும் run ஆக *வேண்டும்*. (அது ஏன் இருமுறை run ஆகிறது என்று ஆர்வமாக இருந்தால், அது [இங்கே](#my-calculation-runs-twice-on-every-re-render) விளக்கப்பட்டுள்ளது.)

Theme-ஐ toggle செய்யுங்கள். **Artificial slowdown இருந்தபோதும் `useMemo` காரணமாக இது வேகமாக இருக்கிறது!** `todos` மற்றும் `tab` (நீங்கள் `useMemo`-க்கு dependencies ஆக pass செய்பவை) last render-இலிருந்து மாறாததால் slow `filterTodos` call skip செய்யப்பட்டது.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        அனைத்தும்
      </button>
      <button onClick={() => setTab('active')}>
        செயலில் உள்ளவை
      </button>
      <button onClick={() => setTab('completed')}>
        முடிந்தவை
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode பயன்படுத்து
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>குறிப்பு: <code>filterTodos</code> artificial ஆக slow செய்யப்பட்டுள்ளது!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### ஒரு value-ஐ எப்போதும் recalculate செய்தல் {/*always-recalculating-a-value*/}

இந்த example-இலும், rendering போது நீங்கள் call செய்யும் JavaScript function உண்மையில் slow ஆக இருந்தால் என்ன நடக்கும் என்பதை பார்க்க, `filterTodos` implementation **artificial ஆக slow செய்யப்பட்டுள்ளது**. Tabs-ஐ மாற்றியும் theme-ஐ toggle செய்தும் முயற்சிக்கவும்.

முந்தைய example-க்கு மாறாக, இப்போது theme-ஐ toggle செய்வதும் slow ஆகிறது! காரணம், **இந்த version-இல் `useMemo` call இல்லை;** எனவே artificial ஆக slow செய்யப்பட்ட `filterTodos` ஒவ்வொரு re-render-இலும் call செய்யப்படுகிறது. `theme` மட்டும் மாறினாலும் அது call செய்யப்படும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        அனைத்தும்
      </button>
      <button onClick={() => setTab('active')}>
        செயலில் உள்ளவை
      </button>
      <button onClick={() => setTab('completed')}>
        முடிந்தவை
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode பயன்படுத்து
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>குறிப்பு: <code>filterTodos</code> artificial ஆக slow செய்யப்பட்டுள்ளது!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

ஆனால் இதோ அதே code **artificial slowdown நீக்கப்பட்ட வடிவத்தில்** உள்ளது. `useMemo` இல்லாதது தெளிவாக உணரப்படுகிறதா இல்லையா?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        அனைத்தும்
      </button>
      <button onClick={() => setTab('active')}>
        செயலில் உள்ளவை
      </button>
      <button onClick={() => setTab('completed')}>
        முடிந்தவை
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode பயன்படுத்து
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

பல நேரங்களில், memoization இல்லாத code நன்றாக வேலை செய்யும். உங்கள் interactions போதுமான வேகமாக இருந்தால், memoization தேவைப்படாமல் இருக்கலாம்.

`utils.js`-இல் todo items எண்ணிக்கையை அதிகரித்து behavior எப்படி மாறுகிறது என்பதை பார்க்கலாம். இந்த குறிப்பிட்ட calculation ஆரம்பத்தில் மிகவும் expensive அல்ல; ஆனால் todos எண்ணிக்கை குறிப்பிடத்தக்க அளவில் வளர்ந்தால், overhead-ன் பெரும்பகுதி filtering-இல் அல்ல, re-rendering-இல் இருக்கும். `useMemo` மூலம் re-rendering-ஐ எப்படி optimize செய்யலாம் என்பதைப் பார்க்க கீழே தொடர்ந்து படிக்கவும்.

<Solution />

</Recipes>

---

### Components re-render ஆகுவதை skip செய்தல் {/*skipping-re-rendering-of-components*/}

சில cases-இல், child components re-render ஆகும் performance-ஐ optimize செய்யவும் `useMemo` உதவும். இதை விளக்க, இந்த `TodoList` component `visibleTodos`-ஐ child `List` component-க்கு prop ஆக pass செய்கிறது என்று எடுத்துக் கொள்வோம்:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`theme` prop-ஐ toggle செய்தால் app ஒரு கணம் freeze ஆகிறது, ஆனால் JSX-இலிருந்து `<List />`-ஐ remove செய்தால் அது வேகமாக உணரப்படுகிறது என்பதை நீங்கள் கவனித்துள்ளீர்கள். இது `List` component-ஐ optimize செய்ய முயற்சிப்பது மதிப்புடையது என்பதை காட்டுகிறது.

**Default ஆக, ஒரு component re-render ஆகும்போது, React அதன் எல்லா children-ஐயும் recursively re-render செய்கிறது.** அதனால் `TodoList` வேறு `theme` உடன் re-render ஆகும்போது, `List` component-மும் re-render ஆகிறது. Re-render செய்ய அதிக calculation தேவைப்படாத components-க்கு இது சரி. ஆனால் re-render slow என்று நீங்கள் verify செய்திருந்தால், last render-இல் இருந்தது போல props ஒரே மாதிரியாக இருக்கும்போது `List` re-render ஆகுவதை skip செய்ய [`memo`](/reference/react/memo)-ஆல் அதை wrap செய்யலாம்:

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**இந்த மாற்றத்தால், `List`-ன் props அனைத்தும் last render-இல் இருந்தது போலவே *same* ஆக இருந்தால் அது re-render ஆகுவதை skip செய்யும்.** இங்கேதான் calculation-ஐ cache செய்வது முக்கியமாகிறது! `useMemo` இல்லாமல் `visibleTodos`-ஐ calculate செய்ததாகக் கற்பனை செய்யுங்கள்:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**மேலுள்ள example-இல், `{}` object literal எப்போதும் புதிய object உருவாக்குவது போல, `filterTodos` function எப்போதும் *வேறு* array உருவாக்குகிறது.** பொதுவாக இது பிரச்சினையல்ல; ஆனால் இதனால் `List` props ஒருபோதும் same ஆகாது, உங்கள் [`memo`](/reference/react/memo) optimization வேலை செய்யாது. இங்கேதான் `useMemo` உதவுகிறது:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...இந்த dependencies மாறாத வரை...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**`visibleTodos` calculation-ஐ `useMemo`-க்குள் wrap செய்வதன் மூலம், re-renders இடையில் அது *same* value-ஐ வைத்திருப்பதை உறுதி செய்கிறீர்கள்** (dependencies மாறும் வரை). குறிப்பிட்ட காரணம் இல்லாவிட்டால் calculation-ஐ `useMemo`-க்குள் wrap செய்ய *வேண்டியதில்லை*. இந்த example-இல் காரணம், அதை [`memo`](/reference/react/memo)-ஆல் wrap செய்யப்பட்ட component-க்கு pass செய்கிறீர்கள்; இதனால் அது re-rendering-ஐ skip செய்ய முடியும். `useMemo` சேர்க்க இன்னும் சில காரணங்கள் இந்த page-இல் கீழே விவரிக்கப்பட்டுள்ளன.

<DeepDive>

#### தனித்தனி JSX nodes-ஐ memoize செய்தல் {/*memoizing-individual-jsx-nodes*/}

`List`-ஐ [`memo`](/reference/react/memo)-ஆல் wrap செய்வதற்குப் பதிலாக, `<List />` JSX node-ஐயே `useMemo`-க்குள் wrap செய்யலாம்:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

Behavior அதேபோல இருக்கும். `visibleTodos` மாறவில்லை என்றால், `List` re-render ஆகாது.

`<List items={visibleTodos} />` போன்ற JSX node என்பது `{ type: List, props: { items: visibleTodos } }` போன்ற object. இந்த object-ஐ create செய்வது மிகவும் cheap; ஆனால் அதன் contents last time-இல் இருந்தது போலவே உள்ளதா இல்லையா என்பதை React அறியாது. அதனால்தான் default ஆக React `List` component-ஐ re-render செய்கிறது.

ஆனால் previous render-இல் இருந்த அதே exact JSX-ஐ React பார்த்தால், உங்கள் component-ஐ re-render செய்ய முயற்சிக்காது. ஏனெனில் JSX nodes [immutable](https://en.wikipedia.org/wiki/Immutable_object). JSX node object காலப்போக்கில் மாறியிருக்க முடியாது, எனவே re-render-ஐ skip செய்வது safe என்று React அறியும். ஆனால் இது வேலை செய்ய, node code-இல் same போல தோன்றுவதல்ல; அது *உண்மையிலேயே அதே object* ஆக இருக்க வேண்டும். இந்த example-இல் `useMemo` அதைத்தான் செய்கிறது.

JSX nodes-ஐ manual ஆக `useMemo`-க்குள் wrap செய்வது வசதியாக இல்லை. உதாரணமாக, இதை conditionally செய்ய முடியாது. அதனால் பொதுவாக JSX nodes-ஐ wrap செய்வதற்குப் பதிலாக components-ஐ [`memo`](/reference/react/memo)-ஆல் wrap செய்வீர்கள்.

</DeepDive>

<Recipes titleText="Re-renders-ஐ skip செய்வதற்கும் எப்போதும் re-render செய்வதற்கும் உள்ள வேறுபாடு" titleId="examples-rerendering">

#### `useMemo` மற்றும் `memo` மூலம் re-rendering-ஐ skip செய்தல் {/*skipping-re-rendering-with-usememo-and-memo*/}

இந்த example-இல், நீங்கள் render செய்யும் React component உண்மையில் slow ஆக இருந்தால் என்ன நடக்கும் என்பதை பார்க்க, `List` component **artificial ஆக slow செய்யப்பட்டுள்ளது**. Tabs-ஐ மாற்றியும் theme-ஐ toggle செய்தும் முயற்சிக்கவும்.

Tabs-ஐ மாற்றுவது slow ஆக உணரப்படும், ஏனெனில் அது slow செய்யப்பட்ட `List`-ஐ re-render செய்ய கட்டாயப்படுத்துகிறது. `tab` மாறியிருப்பதால் இது எதிர்பார்க்கப்படுகிறது; பயனரின் புதிய தேர்வை screen-இல் பிரதிபலிக்க வேண்டும்.

அடுத்து, theme-ஐ toggle செய்து பாருங்கள். **Artificial slowdown இருந்தபோதும் [`memo`](/reference/react/memo)-உடன் `useMemo` இருப்பதால் இது வேகமாக உள்ளது!** `visibleTodos` array last render-இலிருந்து மாறாததால் `List` re-rendering-ஐ skip செய்தது. `todos` மற்றும் `tab` (நீங்கள் `useMemo`-க்கு dependencies ஆக pass செய்பவை) last render-இலிருந்து மாறாததால் `visibleTodos` array மாறவில்லை.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        அனைத்தும்
      </button>
      <button onClick={() => setTab('active')}>
        செயலில் உள்ளவை
      </button>
      <button onClick={() => setTab('completed')}>
        முடிந்தவை
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode பயன்படுத்து
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>குறிப்பு: <code>List</code> artificial ஆக slow செய்யப்பட்டுள்ளது!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### ஒரு component-ஐ எப்போதும் re-render செய்தல் {/*always-re-rendering-a-component*/}

இந்த example-இலும், நீங்கள் render செய்யும் React component உண்மையில் slow ஆக இருந்தால் என்ன நடக்கும் என்பதை பார்க்க, `List` implementation **artificial ஆக slow செய்யப்பட்டுள்ளது**. Tabs-ஐ மாற்றியும் theme-ஐ toggle செய்தும் முயற்சிக்கவும்.

முந்தைய example-க்கு மாறாக, இப்போது theme-ஐ toggle செய்வதும் slow ஆகிறது! காரணம், **இந்த version-இல் `useMemo` call இல்லை;** எனவே `visibleTodos` எப்போதும் வேறு array ஆக இருக்கும், மேலும் slow செய்யப்பட்ட `List` component re-rendering-ஐ skip செய்ய முடியாது.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        அனைத்தும்
      </button>
      <button onClick={() => setTab('active')}>
        செயலில் உள்ளவை
      </button>
      <button onClick={() => setTab('completed')}>
        முடிந்தவை
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode பயன்படுத்து
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>குறிப்பு: <code>List</code> artificial ஆக slow செய்யப்பட்டுள்ளது!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js {expectedErrors: {'react-compiler': [5, 6]}} src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

ஆனால் இதோ அதே code **artificial slowdown நீக்கப்பட்ட வடிவத்தில்** உள்ளது. `useMemo` இல்லாதது தெளிவாக உணரப்படுகிறதா இல்லையா?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        அனைத்தும்
      </button>
      <button onClick={() => setTab('active')}>
        செயலில் உள்ளவை
      </button>
      <button onClick={() => setTab('completed')}>
        முடிந்தவை
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode பயன்படுத்து
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

பல நேரங்களில், memoization இல்லாத code நன்றாக வேலை செய்யும். உங்கள் interactions போதுமான வேகமாக இருந்தால், memoization தேவைப்படாது.

உங்கள் app-ஐ உண்மையில் slow ஆக்குவது என்ன என்பதை realistic ஆக புரிந்துகொள்ள, React-ஐ production mode-இல் run செய்யவும், [React Developer Tools](/learn/react-developer-tools)-ஐ disable செய்யவும், உங்கள் app users பயன்படுத்தும் devices-க்கு ஒத்த devices-ஐ use செய்யவும் வேண்டும் என்பதை நினைவில் கொள்ளுங்கள்.

<Solution />

</Recipes>

---

### Effect மிகவும் அடிக்கடி fire ஆகாமல் தடுப்பது {/*preventing-an-effect-from-firing-too-often*/}

சில நேரங்களில், ஒரு [Effect](/learn/synchronizing-with-effects)-க்குள் ஒரு value-ஐ use செய்ய விரும்பலாம்:

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

இது ஒரு problem உருவாக்குகிறது. [ஒவ்வொரு reactive value-மும் உங்கள் Effect-ன் dependency ஆக declare செய்யப்பட வேண்டும்.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) ஆனால் `options`-ஐ dependency ஆக declare செய்தால், உங்கள் Effect chat room-க்கு தொடர்ந்து reconnect செய்யும்:


```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 சிக்கல்: இந்த dependency ஒவ்வொரு render-இலும் மாறுகிறது
  // ...
```

இதை தீர்க்க, Effect-இலிருந்து call செய்ய வேண்டிய object-ஐ `useMemo`-க்குள் wrap செய்யலாம்:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId மாறும்போது மட்டுமே மாறும்

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ options மாறும்போது மட்டுமே மாறும்
  // ...
```

`useMemo` cached object-ஐ return செய்தால், `options` object re-renders இடையில் same ஆக இருப்பதை இது உறுதி செய்கிறது.

ஆனால் `useMemo` semantic guarantee அல்ல; performance optimization என்பதால், [அப்படி செய்ய குறிப்பிட்ட காரணம் இருந்தால்](#caveats) React cached value-ஐ தூக்கி எறியலாம். இதுவும் effect மீண்டும் fire ஆக காரணமாகும், **எனவே function dependency தேவைப்படுவதை நீக்குவது இன்னும் சிறந்தது**. அதற்காக உங்கள் object-ஐ Effect-க்குள் *உள்ளே* நகர்த்துங்கள்:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ useMemo அல்லது object dependencies தேவையில்லை!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId மாறும்போது மட்டுமே மாறும்
  // ...
```

இப்போது உங்கள் code நேரடியாக உள்ளது; `useMemo` தேவையில்லை. [Effect dependencies-ஐ remove செய்வது பற்றி மேலும் அறிக.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)


### மற்றொரு Hook-ன் dependency-ஐ memoize செய்தல் {/*memoizing-a-dependency-of-another-hook*/}

Component body-க்குள் நேரடியாக create செய்யப்பட்ட object-ஐ சார்ந்த calculation ஒன்று உங்களிடம் உள்ளது என்று வைத்துக் கொள்ளுங்கள்:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 கவனம்: component body-இல் create செய்யப்பட்ட object-ஐ dependency ஆக வைத்துள்ளது
  // ...
```

இப்படியான object-ஐ சார்ந்து இருப்பது memoization-ன் நோக்கத்தை தோற்கடிக்கிறது. Component re-render ஆகும்போது, component body-க்குள் நேரடியாக உள்ள எல்லா code-மும் மீண்டும் run ஆகும். **`searchOptions` object-ஐ create செய்யும் code lines ஒவ்வொரு re-render-இலும் run ஆகும்.** `searchOptions` உங்கள் `useMemo` call-ன் dependency ஆக இருப்பதால், மேலும் அது ஒவ்வொரு முறையும் வேறாக இருப்பதால், dependencies வேறாக உள்ளன என்று React அறிந்து `searchItems`-ஐ ஒவ்வொரு முறையும் recalculate செய்யும்.

இதை fix செய்ய, `searchOptions` object-ஐ dependency ஆக pass செய்வதற்கு முன், அதையே *memoize* செய்யலாம்:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ text மாறும்போது மட்டுமே மாறும்

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ allItems அல்லது searchOptions மாறும்போது மட்டுமே மாறும்
  // ...
```

மேலுள்ள example-இல், `text` மாறவில்லை என்றால் `searchOptions` object-உம் மாறாது. ஆனால் இதைவிட சிறந்த fix, `searchOptions` object declaration-ஐ `useMemo` calculation function-க்குள் *உள்ளே* நகர்த்துவது:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ allItems அல்லது text மாறும்போது மட்டுமே மாறும்
  // ...
```

இப்போது உங்கள் calculation நேரடியாக `text`-ஐ சார்ந்துள்ளது (அது string என்பதால் "தற்செயலாக" வேறாக மாற முடியாது).

---

### Function-ஐ memoize செய்தல் {/*memoizing-a-function*/}

`Form` component [`memo`](/reference/react/memo)-ஆல் wrap செய்யப்பட்டிருக்கிறது என்று வைத்துக் கொள்ளுங்கள். அதற்கு prop ஆக ஒரு function-ஐ pass செய்ய விரும்புகிறீர்கள்:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

`{}` வேறு object-ஐ create செய்வது போலவே, `function() {}` போன்ற function declarations மற்றும் `() => {}` போன்ற expressions ஒவ்வொரு re-render-இலும் *வேறு* function உருவாக்குகின்றன. புதிய function உருவாக்குவது தானாகவே பிரச்சினையல்ல. இது தவிர்க்க வேண்டிய ஒன்றும் அல்ல! ஆனால் `Form` component memoized ஆக இருந்தால், props எதுவும் மாறாதபோது அதை re-render செய்வதை skip செய்ய விரும்புவீர்கள். *எப்போதும்* வேறாக இருக்கும் prop ஒன்று memoization-ன் நோக்கத்தை தோற்கடிக்கும்.

`useMemo` மூலம் function-ஐ memoize செய்ய, உங்கள் calculation function மற்றொரு function-ஐ return செய்ய வேண்டும்:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

இது clunky ஆகத் தெரிகிறது! **Functions-ஐ memoize செய்வது பொதுவானதானதால், அதற்காக React-இல் built-in Hook உள்ளது. கூடுதல் nested function எழுத வேண்டியதைத் தவிர்க்க, உங்கள் functions-ஐ `useMemo`-க்கு பதிலாக [`useCallback`](/reference/react/useCallback)-க்குள் wrap செய்யுங்கள்:**

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

மேலுள்ள இரண்டு examples-உம் முழுமையாக equivalent. `useCallback`-ன் ஒரே பயன், உள்ளே கூடுதல் nested function எழுத வேண்டியதைத் தவிர்க்க அனுமதிப்பது. அது வேறு எதையும் செய்யாது. [`useCallback` பற்றி மேலும் படிக்கவும்.](/reference/react/useCallback)

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### ஒவ்வொரு re-render-இலும் என் calculation இருமுறை run ஆகிறது {/*my-calculation-runs-twice-on-every-re-render*/}

[Strict Mode](/reference/react/StrictMode)-இல், உங்கள் சில functions-ஐ React ஒருமுறை அல்ல இருமுறை call செய்யும்:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

இது எதிர்பார்க்கப்பட்ட behavior; உங்கள் code-ஐ உடைக்கக் கூடாது.

இந்த **development-only** behavior உங்கள் [components-ஐ pure ஆக வைத்திருக்க](/learn/keeping-components-pure) உதவுகிறது. React calls-இல் ஒன்றின் result-ஐ use செய்து, மற்ற call-ன் result-ஐ புறக்கணிக்கிறது. உங்கள் component மற்றும் calculation functions pure ஆக இருக்கும் வரை, இது உங்கள் logic-ஐ பாதிக்கக் கூடாது. ஆனால் அவை தற்செயலாக impure ஆக இருந்தால், தவறை கவனித்து fix செய்ய இது உதவும்.

உதாரணமாக, இந்த impure calculation function நீங்கள் prop ஆக பெற்ற array-ஐ mutate செய்கிறது:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'நடக்கச் செல்!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React உங்கள் function-ஐ இருமுறை call செய்வதால், todo இருமுறை சேர்க்கப்படுவதை நீங்கள் கவனிப்பீர்கள். உங்கள் calculation ஏற்கனவே உள்ள objects எதையும் change செய்யக்கூடாது; ஆனால் calculation போது நீங்கள் create செய்த *new* objects-ஐ change செய்வது சரி. உதாரணமாக, `filterTodos` function எப்போதும் *வேறு* array return செய்தால், அதற்கு பதிலாக *அந்த* array-ஐ mutate செய்யலாம்:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'நடக்கச் செல்!' });
    return filtered;
  }, [todos, tab]);
```

Purity பற்றி மேலும் அறிய [components-ஐ pure ஆக வைத்திருத்தல்](/learn/keeping-components-pure)-ஐ படிக்கவும்.

மேலும், mutation இல்லாமல் [objects update செய்தல்](/learn/updating-objects-in-state) மற்றும் [arrays update செய்தல்](/learn/updating-arrays-in-state) பற்றிய guides-ஐ பார்க்கவும்.

---

### என் `useMemo` call object-ஐ return செய்ய வேண்டும், ஆனால் undefined return செய்கிறது {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

இந்த code வேலை செய்யாது:

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

JavaScript-இல், `() => {` arrow function body-யை தொடங்குகிறது; எனவே `{` brace உங்கள் object-ன் பகுதி அல்ல. அதனால் அது object-ஐ return செய்யாது, தவறுகளுக்கு வழிவகுக்கும். `({` மற்றும் `})` போன்ற parentheses சேர்ப்பதன் மூலம் இதை fix செய்யலாம்:

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

ஆனால் இது இன்னும் குழப்பமாக உள்ளது; parentheses-ஐ remove செய்வதன் மூலம் யாராவது நேரடியாக உடைக்கலாம்.

இந்த தவறைத் தவிர்க்க, `return` statement-ஐ explicit ஆக எழுதுங்கள்:

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### என் component render ஆகும் ஒவ்வொரு முறையும், `useMemo`-இல் உள்ள calculation மீண்டும் run ஆகிறது {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Dependency array-ஐ second argument ஆக specify செய்துள்ளீர்களா என்பதை உறுதி செய்யுங்கள்!

Dependency array-ஐ மறந்தால், `useMemo` calculation-ஐ ஒவ்வொரு முறையும் மீண்டும் run செய்யும்:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Dependency array-ஐ second argument ஆக pass செய்யும் சரிசெய்யப்பட்ட version இதோ:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

இது உதவவில்லை என்றால், உங்கள் dependencies-இல் குறைந்தபட்சம் ஒன்று previous render-இலிருந்து வேறுபட்டுள்ளது என்பதே problem. உங்கள் dependencies-ஐ console-க்கு manual ஆக log செய்வதன் மூலம் இந்த problem-ஐ debug செய்யலாம்:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

பின்னர் console-இல் வேறு re-renders-இலிருந்து வந்த arrays மீது right-click செய்து, இரண்டிற்கும் "Store as a global variable" என்பதை select செய்யலாம். முதல் ஒன்று `temp1` ஆகவும், இரண்டாவது ஒன்று `temp2` ஆகவும் save ஆனது என்று வைத்துக் கொண்டால், இரண்டு arrays-இலுமுள்ள ஒவ்வொரு dependency-யும் same ஆக உள்ளதா என்பதை browser console மூலம் check செய்யலாம்:

```js
Object.is(temp1[0], temp2[0]); // arrays-இடையில் முதல் dependency same ஆக உள்ளதா?
Object.is(temp1[1], temp2[1]); // arrays-இடையில் இரண்டாவது dependency same ஆக உள்ளதா?
Object.is(temp1[2], temp2[2]); // ...ஒவ்வொரு dependency-க்கும் இதேபோல்...
```

எந்த dependency memoization-ஐ break செய்கிறது என்று கண்டுபிடித்ததும், அதை remove செய்ய ஒரு வழி காணுங்கள், அல்லது [அதையும் memoize செய்யுங்கள்](#memoizing-a-dependency-of-another-hook).

---

### Loop-இல் ஒவ்வொரு list item-க்கும் `useMemo` call செய்ய வேண்டும், ஆனால் அது அனுமதிக்கப்படவில்லை {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` component [`memo`](/reference/react/memo)-ஆல் wrap செய்யப்பட்டிருக்கிறது என்று வைத்துக் கொள்ளுங்கள். `ReportList` component re-render ஆகும்போது list-இலுள்ள ஒவ்வொரு `Chart` re-render ஆகுவதையும் skip செய்ய விரும்புகிறீர்கள். ஆனால் loop-இல் `useMemo` call செய்ய முடியாது:

```js {expectedErrors: {'react-compiler': [6]}} {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

அதற்கு பதிலாக, ஒவ்வொரு item-க்கும் component-ஐ extract செய்து, தனித்தனி items-க்கான data-வை memoize செய்யுங்கள்:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

மாற்றாக, `useMemo`-ஐ remove செய்து, அதற்கு பதிலாக `Report`-ஐயே [`memo`](/reference/react/memo)-ஆல் wrap செய்யலாம். `item` prop மாறவில்லை என்றால், `Report` re-rendering-ஐ skip செய்யும்; அதனால் `Chart`-உம் re-rendering-ஐ skip செய்யும்:

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
