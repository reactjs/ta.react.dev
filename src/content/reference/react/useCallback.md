---
title: useCallback
---

<Intro>

`useCallback` என்பது re-renders இடையே function definition ஒன்றை cache செய்ய உதவும் React Hook ஆகும்.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) values மற்றும் functions-ஐ தானாக memoize செய்வதால், manual `useCallback` calls தேவையை குறைக்கிறது. Memoization-ஐ தானாக கையாள compiler-ஐ பயன்படுத்தலாம்.

</Note>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Re-renders இடையே function definition ஒன்றை cache செய்ய, உங்கள் component-ன் top level-இல் `useCallback`-ஐ call செய்யுங்கள்:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[கீழே மேலும் examples பார்க்கவும்.](#usage)

#### அளவுருக்கள் {/*parameters*/}

* `fn`: நீங்கள் cache செய்ய விரும்பும் function value. இது எந்த arguments-ஐயும் ஏற்று எந்த values-ஐயும் return செய்யலாம். Initial render போது React உங்கள் function-ஐ உங்களுக்கே return செய்யும் (call செய்யாது!). அடுத்த renders-இல், கடந்த render முதல் `dependencies` மாறவில்லை என்றால் React அதே function-ஐ மீண்டும் தரும். இல்லையெனில், இந்த render போது நீங்கள் pass செய்த function-ஐ தரும், மேலும் பின்னர் reuse செய்ய முடிந்தால் பயன்படுத்த store செய்து வைக்கும். React உங்கள் function-ஐ call செய்யாது. அதை எப்போது call செய்ய வேண்டும், call செய்ய வேண்டுமா என்பதை நீங்கள் தீர்மானிக்க function உங்களுக்கு return செய்யப்படுகிறது.

* `dependencies`: `fn` code-க்குள் reference செய்யப்பட்ட அனைத்து reactive values-ன் list. Reactive values-இல் props, state, மேலும் உங்கள் component body-க்குள் நேரடியாக declared செய்யப்பட்ட அனைத்து variables மற்றும் functions அடங்கும். உங்கள் linter [React-க்காக configured](/learn/editor-setup#linting) செய்யப்பட்டிருந்தால், ஒவ்வொரு reactive value-மும் dependency ஆக சரியாக குறிப்பிடப்பட்டுள்ளதா என்பதை அது verify செய்யும். Dependencies list-இல் constant எண்ணிக்கையிலான items இருக்க வேண்டும், மேலும் `[dep1, dep2, dep3]` போல inline ஆக எழுதப்பட வேண்டும். React ஒவ்வொரு dependency-யையும் அதன் முந்தைய value-உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm மூலம் compare செய்யும்.

#### திருப்பி அளிப்பது {/*returns*/}

Initial render-இல், நீங்கள் pass செய்த `fn` function-ஐ `useCallback` return செய்யும்.

பின்வரும் renders-இல், dependencies மாறவில்லை என்றால் கடந்த render-இல் ஏற்கனவே stored செய்யப்பட்ட `fn` function-ஐ return செய்யும்; இல்லையெனில், இந்த render போது நீங்கள் pass செய்த `fn` function-ஐ return செய்யும்.

#### கவனிக்க வேண்டியவை {/*caveats*/}

* `useCallback` ஒரு Hook; எனவே அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் அதை call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component ஒன்றை extract செய்து state-ஐ அதற்குள் move செய்யுங்கள்.
* React **அதற்கு குறிப்பிட்ட காரணம் இல்லாமல் cached function-ஐ தூக்கி எறியாது.** உதாரணமாக, development-இல், உங்கள் component file-ஐ edit செய்தால் React cache-ஐ தூக்கி எறியும். Development மற்றும் production இரண்டிலும், initial mount போது உங்கள் component suspend ஆனால் React cache-ஐ தூக்கி எறியும். எதிர்காலத்தில், cache-ஐ தூக்கி எறிவதை பயன்படுத்தும் மேலும் features React சேர்க்கலாம்--உதாரணமாக, React எதிர்காலத்தில் virtualized lists-க்கு built-in support சேர்த்தால், virtualized table viewport-க்கு வெளியே scroll ஆகும் items-க்கான cache-ஐ தூக்கி எறிவது பொருத்தமாக இருக்கும். `useCallback`-ஐ performance optimization ஆக நீங்கள் சார்ந்திருந்தால், இது உங்கள் எதிர்பார்ப்புகளுடன் பொருந்தும். இல்லையெனில், [state variable](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) அல்லது [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) அதிகமாக பொருந்தலாம்.

---

## Usage {/*usage*/}

### Components re-render ஆகாமல் skip செய்தல் {/*skipping-re-rendering-of-components*/}

Rendering performance-ஐ optimize செய்யும்போது, child components-க்கு pass செய்யும் functions-ஐ cache செய்ய வேண்டியிருக்கும். இதை செய்வதற்கான syntax-ஐ முதலில் பார்த்து, பிறகு எந்த சூழல்களில் இது பயனுள்ளதாக இருக்கும் என்று பார்க்கலாம்.

உங்கள் component-ன் re-renders இடையே function ஒன்றை cache செய்ய, அதன் definition-ஐ `useCallback` Hook-க்குள் wrap செய்யுங்கள்:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback`-க்கு இரண்டு விஷயங்களை pass செய்ய வேண்டும்:

1. Re-renders இடையே cache செய்ய விரும்பும் function definition.
2. உங்கள் function-க்குள் பயன்படுத்தப்படும் component-இல் உள்ள ஒவ்வொரு value-யையும் உள்ளடக்கிய <CodeStep step={2}>dependencies list</CodeStep>.

Initial render-இல், `useCallback`-இலிருந்து நீங்கள் பெறும் <CodeStep step={3}>returned function</CodeStep> நீங்கள் pass செய்த function ஆக இருக்கும்.

பின்வரும் renders-இல், React <CodeStep step={2}>dependencies</CodeStep>-ஐ முந்தைய render போது pass செய்த dependencies-உடன் compare செய்யும். Dependencies எதுவும் மாறவில்லை என்றால் ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) மூலம் compare செய்யும்போது), `useCallback` முன்பு இருந்த அதே function-ஐ return செய்யும். இல்லையெனில், *இந்த* render-இல் நீங்கள் pass செய்த function-ஐ `useCallback` return செய்யும்.

வேறு வார்த்தைகளில் சொன்னால், dependencies மாறும் வரை `useCallback` re-renders இடையே function ஒன்றை cache செய்கிறது.

**இது எப்போது பயனுள்ளதாக இருக்கும் என்பதை ஒரு example மூலம் பார்ப்போம்.**

`ProductPage`-இலிருந்து `ShippingForm` component-க்கு `handleSubmit` function ஒன்றை pass செய்கிறீர்கள் என்று வைத்துக் கொள்ளுங்கள்:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` prop-ஐ toggle செய்தால் app ஒரு கணம் freeze ஆகிறது, ஆனால் உங்கள் JSX-இலிருந்து `<ShippingForm />`-ஐ remove செய்தால் அது வேகமாக உணரப்படுகிறது என்று நீங்கள் கவனித்துள்ளீர்கள். இதனால் `ShippingForm` component-ஐ optimize செய்து பார்க்க வேண்டியது மதிப்புள்ளதாக தெரிகிறது.

**Default ஆக, ஒரு component re-render ஆனால், React அதன் children அனைத்தையும் recursively re-render செய்கிறது.** இதனால் தான் `ProductPage` வேறு `theme`-உடன் re-render ஆகும்போது, `ShippingForm` component-மும் re-render ஆகிறது. Re-render செய்ய அதிக calculation தேவையில்லாத components-க்கு இது சரி. ஆனால் re-render slow என்று நீங்கள் verify செய்திருந்தால், அதன் props கடந்த render போலவே இருந்தால் `ShippingForm` re-render ஆகாமல் skip செய்ய [`memo`:](/reference/react/memo)-வில் wrap செய்வதன் மூலம் React-க்கு சொல்லலாம்.

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**இந்த change மூலம், `ShippingForm`-ன் அனைத்து props-உம் கடந்த render போலவே இருந்தால் அது re-render ஆகாமல் skip செய்யும்.** இதுதான் function ஒன்றை cache செய்வது முக்கியமாகும் தருணம்! `useCallback` இல்லாமல் `handleSubmit`-ஐ define செய்தீர்கள் என்று வைத்துக் கொள்ளுங்கள்:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**JavaScript-இல், `function () {}` அல்லது `() => {}` எப்போதும் _வேறு_ function ஒன்றை உருவாக்கும்;** `{}` object literal எப்போதும் புதிய object ஒன்றை உருவாக்குவது போல. சாதாரணமாக இது ஒரு பிரச்சினை அல்ல; ஆனால் இதன் பொருள் `ShippingForm` props ஒருபோதும் அதேபோல் இருக்காது, உங்கள் [`memo`](/reference/react/memo) optimization வேலை செய்யாது. இங்கேதான் `useCallback` பயன்படுகிறது:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...இந்த dependencies மாறாத வரை...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit`-ஐ `useCallback`-இல் wrap செய்வதன் மூலம், re-renders இடையே அது *அதே* function ஆக இருப்பதை நீங்கள் உறுதி செய்கிறீர்கள்** (dependencies மாறும் வரை). குறிப்பிட்ட காரணம் இல்லையெனில் function ஒன்றை `useCallback`-இல் wrap செய்ய *வேண்டிய அவசியம் இல்லை*. இந்த example-இல், காரணம்: அதை [`memo`,](/reference/react/memo)-வில் wrap செய்யப்பட்ட component-க்கு pass செய்கிறீர்கள், இதனால் அது re-render-ஐ skip செய்ய முடிகிறது. இந்த page-இல் தொடர்ந்து விவரிக்கப்படும் வேறு காரணங்களுக்கும் `useCallback` தேவைப்படலாம்.

<Note>

**`useCallback`-ஐ performance optimization ஆக மட்டுமே சார்ந்து பயன்படுத்த வேண்டும்.** அது இல்லாமல் உங்கள் code வேலை செய்யவில்லை என்றால், அடிப்படை பிரச்சினையை கண்டுபிடித்து முதலில் அதை fix செய்யுங்கள். பிறகு `useCallback`-ஐ மீண்டும் சேர்க்கலாம்.

</Note>

<DeepDive>

#### useCallback, useMemo-வுடன் எப்படி தொடர்புடையது? {/*how-is-usecallback-related-to-usememo*/}

[`useMemo`](/reference/react/useMemo)-வை `useCallback` உடன் நீங்கள் அடிக்கடி காண்பீர்கள். Child component ஒன்றை optimize செய்ய முயற்சிக்கும்போது இரண்டும் பயனுள்ளவை. நீங்கள் கீழே pass செய்யும் ஏதாவது ஒன்றை [memoize](https://en.wikipedia.org/wiki/Memoization) செய்ய (அதாவது cache செய்ய) இவை உதவுகின்றன:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // உங்கள் function-ஐ call செய்து அதன் result-ஐ cache செய்கிறது
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // உங்கள் function-ஐயே cache செய்கிறது
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

அவை cache செய்ய அனுமதிப்பது *எதை* என்பதில் தான் வேறுபாடு:

* **[`useMemo`](/reference/react/useMemo) உங்கள் function-ஐ call செய்ததன் *result*-ஐ cache செய்கிறது.** இந்த example-இல், `product` மாறாத வரை அது மாறாமல் இருக்க `computeRequirements(product)` call செய்த result-ஐ cache செய்கிறது. இதனால் `ShippingForm` தேவையற்ற re-render இல்லாமல் `requirements` object-ஐ கீழே pass செய்ய முடிகிறது. தேவைப்படும் போது, result-ஐ calculate செய்ய render போது நீங்கள் pass செய்த function-ஐ React call செய்யும்.
* **`useCallback` *function-ஐயே* cache செய்கிறது.** `useMemo` போல இல்லாமல், நீங்கள் provide செய்யும் function-ஐ இது call செய்யாது. அதற்கு பதிலாக, `productId` அல்லது `referrer` மாறாத வரை `handleSubmit` *தானே* மாறாமல் இருக்க நீங்கள் provide செய்த function-ஐ cache செய்கிறது. இதனால் `ShippingForm` தேவையற்ற re-render இல்லாமல் `handleSubmit` function-ஐ கீழே pass செய்ய முடிகிறது. User form-ஐ submit செய்யும் வரை உங்கள் code run ஆகாது.

[`useMemo`,](/reference/react/useMemo) உங்களுக்கு ஏற்கனவே தெரிந்திருந்தால், `useCallback`-ஐ இதுபோல் நினைப்பது உதவியாக இருக்கலாம்:

```js {expectedErrors: {'react-compiler': [3]}}
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo` மற்றும் `useCallback` இடையிலான வேறுபாடு பற்றி மேலும் வாசிக்கவும்.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### useCallback-ஐ எல்லா இடங்களிலும் சேர்க்க வேண்டுமா? {/*should-you-add-usecallback-everywhere*/}

உங்கள் app இந்த site போல இருந்து, பெரும்பாலான interactions பெரிய அளவிலானவை (ஒரு page அல்லது முழு section-ஐ மாற்றுவது போன்றவை) என்றால், memoization பொதுவாக தேவையில்லை. மறுபுறம், உங்கள் app drawing editor போல இருந்து, பெரும்பாலான interactions நுணுக்கமானவை (shapes-ஐ நகர்த்துவது போன்றவை) என்றால், memoization மிகவும் உதவியாக இருக்கலாம்.

`useCallback` மூலம் function ஒன்றை cache செய்வது சில சூழல்களில் மட்டுமே மதிப்புடையது:

- அதை [`memo`.](/reference/react/memo)-வில் wrap செய்யப்பட்ட component-க்கு prop ஆக pass செய்கிறீர்கள். Value மாறவில்லை என்றால் re-render-ஐ skip செய்ய விரும்புகிறீர்கள். Dependencies மாறினால் மட்டுமே component re-render ஆக memoization அனுமதிக்கிறது.
- நீங்கள் pass செய்யும் function பின்னர் ஏதாவது Hook-ன் dependency ஆக பயன்படுத்தப்படுகிறது. உதாரணமாக, `useCallback`-இல் wrap செய்யப்பட்ட இன்னொரு function இதை சார்ந்திருக்கலாம், அல்லது [`useEffect.`](/reference/react/useEffect)-இலிருந்து இந்த function-ஐ நீங்கள் சார்ந்திருக்கலாம்.

மற்ற சூழல்களில் function ஒன்றை `useCallback`-இல் wrap செய்வதில் எந்த நன்மையும் இல்லை. அதனால் பெரிய தீங்கும் இல்லை; எனவே சில teams தனிப்பட்ட cases பற்றி யோசிக்காமல், முடிந்தவரை memoize செய்யத் தேர்வு செய்கின்றன. அதன் downside என்னவெனில் code குறைவாக readable ஆகிறது. மேலும் எல்லா memoization-மும் பயனுள்ளதாக இருப்பதில்லை: "எப்போதும் புதியது" ஆக இருக்கும் ஒரு value மட்டும் இருந்தாலும், முழு component-க்கான memoization உடைந்து விடும்.

`useCallback` function-ஐ *உருவாக்குவதை* தடுக்காது என்பதை கவனியுங்கள். நீங்கள் எப்போதும் function ஒன்றை உருவாக்குகிறீர்கள் (அது சரிதான்!), ஆனால் எதுவும் மாறவில்லை என்றால் React அதை புறக்கணித்து cached function-ஐ உங்களுக்கு திருப்பித் தருகிறது.

**நடைமுறையில், சில principles-ஐப் பின்பற்றுவதன் மூலம் நிறைய memoization-ஐ தேவையற்றதாக மாற்றலாம்:**

1. ஒரு component visual ஆக பிற components-ஐ wrap செய்யும்போது, அது [JSX-ஐ children ஆக accept](/learn/passing-props-to-a-component#passing-jsx-as-children) செய்ய அனுமதியுங்கள். அப்போது wrapper component தனது சொந்த state-ஐ update செய்தாலும், அதன் children re-render ஆக வேண்டியதில்லை என்பதை React அறியும்.
2. Local state-ஐ விரும்புங்கள்; தேவையை விட மேலாக [state-ஐ lift up](/learn/sharing-state-between-components) செய்ய வேண்டாம். Forms போன்ற transient state அல்லது ஒரு item hovered ஆக உள்ளதா போன்ற state-ஐ tree-ன் top-இலோ global state library-இலோ வைத்திருக்க வேண்டாம்.
3. உங்கள் [rendering logic-ஐ pure ஆக வைத்திருங்கள்.](/learn/keeping-components-pure) ஒரு component re-render ஆகும்போது பிரச்சினை ஏற்படுகிறதா அல்லது கவனிக்கத்தக்க visual artifact உருவாகிறதா என்றால், அது உங்கள் component-இல் bug! Memoization சேர்ப்பதற்குப் பதிலாக bug-ஐ fix செய்யுங்கள்.
4. [State update செய்யும் unnecessary Effects](/learn/you-might-not-need-an-effect)-ஐ தவிர்க்கவும். React apps-இல் உள்ள பெரும்பாலான performance பிரச்சினைகள், components மீண்டும் மீண்டும் render ஆகச் செய்யும் Effects-இலிருந்து தொடங்கும் update chains காரணமாக ஏற்படுகின்றன.
5. உங்கள் Effects-இலிருந்து [unnecessary dependencies-ஐ remove செய்ய](/learn/removing-effect-dependencies) முயற்சிக்கவும். உதாரணமாக, memoization-க்கு பதிலாக, ஏதாவது object அல்லது function-ஐ Effect-க்குள் அல்லது component-க்கு வெளியே move செய்வது பல நேரங்களில் நேரடியாக இருக்கும்.

ஒரு குறிப்பிட்ட interaction இன்னும் laggy ஆக உணர்ந்தால், memoization மூலம் எந்த components அதிகம் பயன் பெறுகின்றன என்பதைப் பார்க்க [React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)-ஐ பயன்படுத்தி, தேவையான இடத்தில் memoization சேர்க்கவும். இந்த principles உங்கள் components-ஐ debug செய்யவும் புரிந்துகொள்ளவும் உதவுகின்றன, எனவே எப்படியும் அவற்றைப் பின்பற்றுவது நல்லது. நீண்ட காலத்தில், இதை முழுமையாகத் தீர்க்க [memoization-ஐ தானாக செய்வது](https://www.youtube.com/watch?v=lGEMwh32soc) குறித்து நாங்கள் ஆராய்ந்து வருகிறோம்.

</DeepDive>

<Recipes titleText="useCallback மற்றும் function-ஐ நேரடியாக declare செய்வதற்கிடையிலான வேறுபாடு" titleId="examples-rerendering">

#### `useCallback` மற்றும் `memo` மூலம் re-rendering-ஐ skip செய்தல் {/*skipping-re-rendering-with-usecallback-and-memo*/}

இந்த example-இல், நீங்கள் render செய்கிற React component உண்மையிலேயே slow ஆக இருந்தால் என்ன நடக்கும் என்பதை பார்க்க `ShippingForm` component **செயற்கையாக மெதுவாக்கப்பட்டுள்ளது**. Counter-ஐ increment செய்து theme-ஐ toggle செய்து பாருங்கள்.

Counter-ஐ increment செய்வது slow ஆக உணரப்படுகிறது, ஏனெனில் அது மெதுவாக்கப்பட்ட `ShippingForm`-ஐ re-render செய்ய கட்டாயப்படுத்துகிறது. Counter மாறியுள்ளதால் இது எதிர்பார்க்கப்படும் behavior; user-ன் புதிய தேர்வை screen-இல் பிரதிபலிக்க வேண்டும்.

அடுத்து, theme-ஐ toggle செய்து பாருங்கள். **[`memo`](/reference/react/memo)-வுடன் `useCallback` இருப்பதற்கு நன்றி, செயற்கை slowdown இருந்தும் இது fast ஆகும்!** `handleSubmit` function மாறாததால் `ShippingForm` re-render ஆகாமல் skip செய்தது. `handleSubmit` function மாறாததற்குக் காரணம், கடந்த render முதல் `productId` மற்றும் `referrer` (உங்கள் `useCallback` dependencies) இரண்டும் மாறவில்லை.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        இருள் பயன்முறை
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[செயற்கையாக மெதுவானது] <ShippingForm /> render ஆகிறது');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>குறிப்பு: <code>ShippingForm</code> செயற்கையாக மெதுவாக்கப்பட்டுள்ளது!</b></p>
      <label>
        Items எண்ணிக்கை:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        தெரு:
        <input name="street" />
      </label>
      <label>
        நகரம்:
        <input name="city" />
      </label>
      <label>
        அஞ்சல் குறியீடு:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit செய்</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

#### எப்போதும் component re-render ஆகுதல் {/*always-re-rendering-a-component*/}

இந்த example-இலும், நீங்கள் render செய்கிற React component உண்மையிலேயே slow ஆக இருந்தால் என்ன நடக்கும் என்பதை பார்க்க `ShippingForm` implementation **செயற்கையாக மெதுவாக்கப்பட்டுள்ளது**. Counter-ஐ increment செய்து theme-ஐ toggle செய்து பாருங்கள்.

முந்தைய example போல இல்லாமல், இப்போது theme-ஐ toggle செய்வதும் slow ஆகிறது! காரணம் **இந்த version-இல் `useCallback` call இல்லை;** எனவே `handleSubmit` எப்போதும் புதிய function ஆகும், மெதுவாக்கப்பட்ட `ShippingForm` component re-render-ஐ skip செய்ய முடியாது.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        இருள் பயன்முறை
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[செயற்கையாக மெதுவானது] <ShippingForm /> render ஆகிறது');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>குறிப்பு: <code>ShippingForm</code> செயற்கையாக மெதுவாக்கப்பட்டுள்ளது!</b></p>
      <label>
        Items எண்ணிக்கை:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        தெரு:
        <input name="street" />
      </label>
      <label>
        நகரம்:
        <input name="city" />
      </label>
      <label>
        அஞ்சல் குறியீடு:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit செய்</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


ஆனால் இதோ அதே code, **செயற்கை slowdown remove செய்யப்பட்ட நிலையில்.** `useCallback` இல்லாதது கவனிக்கத்தக்கதாக உணரப்படுகிறதா இல்லையா?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        இருள் பயன்முறை
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('<ShippingForm /> render ஆகிறது');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Items எண்ணிக்கை:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        தெரு:
        <input name="street" />
      </label>
      <label>
        நகரம்:
        <input name="city" />
      </label>
      <label>
        அஞ்சல் குறியீடு:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit செய்</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


பல நேரங்களில், memoization இல்லாத code நன்றாகவே வேலை செய்கிறது. உங்கள் interactions போதுமான அளவு fast ஆக இருந்தால், memoization தேவையில்லை.

உங்கள் app-ஐ உண்மையில் எது slow ஆக்குகிறது என்பதை realistic ஆக புரிந்துகொள்ள, React-ஐ production mode-இல் run செய்ய வேண்டும், [React Developer Tools](/learn/react-developer-tools)-ஐ disable செய்ய வேண்டும், மேலும் உங்கள் app users பயன்படுத்தும் devices-க்கு ஒத்த devices-ஐ பயன்படுத்த வேண்டும் என்பதை நினைவில் கொள்ளுங்கள்.

<Solution />

</Recipes>

---

### Memoized callback-இலிருந்து state update செய்தல் {/*updating-state-from-a-memoized-callback*/}

சில நேரங்களில், memoized callback-இலிருந்து முந்தைய state அடிப்படையில் state update செய்ய வேண்டியிருக்கலாம்.

இந்த `handleAddTodo` function `todos`-ஐ dependency ஆக குறிப்பிடுகிறது, ஏனெனில் அது அதிலிருந்து அடுத்த todos-ஐ compute செய்கிறது:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Memoized functions-க்கு சாத்தியமான அளவு குறைந்த dependencies இருக்க வேண்டும் என்று நீங்கள் பொதுவாக விரும்புவீர்கள். அடுத்த state-ஐ calculate செய்வதற்காக மட்டும் state ஒன்றை read செய்தால், அதற்கு பதிலாக [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) ஒன்றை pass செய்வதன் மூலம் அந்த dependency-ஐ remove செய்யலாம்:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos dependency தேவையில்லை
  // ...
```

இங்கே, `todos`-ஐ dependency ஆக்கி உள்ளே read செய்வதற்குப் பதிலாக, state-ஐ *எப்படி* update செய்ய வேண்டும் என்ற instruction-ஐ (`todos => [...todos, newTodo]`) React-க்கு pass செய்கிறீர்கள். [Updater functions பற்றி மேலும் வாசிக்கவும்.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Effect மிக அடிக்கடி fire ஆகாமல் தடுப்பது {/*preventing-an-effect-from-firing-too-often*/}

சில நேரங்களில், [Effect:](/learn/synchronizing-with-effects)-க்குள் இருந்து function ஒன்றை call செய்ய விரும்பலாம்.

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

இது ஒரு பிரச்சினையை உருவாக்குகிறது. [ஒவ்வொரு reactive value-யும் உங்கள் Effect-ன் dependency ஆக declared செய்யப்பட வேண்டும்.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) ஆனால் `createOptions`-ஐ dependency ஆக declare செய்தால், உங்கள் Effect chat room-க்கு தொடர்ந்து reconnect செய்யும்:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 பிரச்சினை: இந்த dependency ஒவ்வொரு render-இலும் மாறுகிறது
  // ...
```

இதைக் தீர்க்க, Effect-இலிருந்து call செய்ய வேண்டிய function-ஐ `useCallback`-க்குள் wrap செய்யலாம்:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId மாறும்போது மட்டுமே மாறும்

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ createOptions மாறும்போது மட்டுமே மாறும்
  // ...
```

`roomId` அதேபோல் இருந்தால் re-renders இடையே `createOptions` function அதேபோல் இருப்பதை இது உறுதி செய்கிறது. **ஆனால் function dependency தேவையை நீக்குவது இன்னும் சிறந்தது.** உங்கள் function-ஐ Effect-க்குள் *move* செய்யுங்கள்:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback அல்லது function dependencies தேவையில்லை!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId மாறும்போது மட்டுமே மாறும்
  // ...
```

இப்போது உங்கள் code நேரடியாக உள்ளது, மேலும் `useCallback` தேவையில்லை. [Effect dependencies-ஐ remove செய்வது பற்றி மேலும் அறிக.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Custom Hook ஒன்றை optimize செய்தல் {/*optimizing-a-custom-hook*/}

நீங்கள் [custom Hook](/learn/reusing-logic-with-custom-hooks) எழுதுகிறீர்கள் என்றால், அது return செய்யும் functions-ஐ `useCallback`-இல் wrap செய்வது பரிந்துரைக்கப்படுகிறது:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

இதனால் உங்கள் Hook-ன் consumers, தேவையானபோது தங்கள் சொந்த code-ஐ optimize செய்ய முடியும்.

---

## சிக்கல் தீர்த்தல் {/*troubleshooting*/}

### என் component render ஆகும் ஒவ்வொரு முறையும், `useCallback` வேறு function return செய்கிறது {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Dependency array-ஐ second argument ஆக குறிப்பிட்டுள்ளீர்களா என்பதை உறுதி செய்யுங்கள்!

Dependency array-ஐ மறந்துவிட்டால், `useCallback` ஒவ்வொரு முறையும் புதிய function ஒன்றை return செய்யும்:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 ஒவ்வொரு முறையும் புதிய function return செய்கிறது: dependency array இல்லை
  // ...
```

Dependency array-ஐ second argument ஆக pass செய்த corrected version இதோ:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ தேவையில்லாமல் புதிய function return செய்யாது
  // ...
```

இதுவும் உதவவில்லை என்றால், உங்கள் dependencies-இல் குறைந்தது ஒன்று முந்தைய render-இல் இருந்ததிலிருந்து வேறுபடுகிறது என்பதுதான் பிரச்சினை. உங்கள் dependencies-ஐ console-க்கு manually log செய்வதன் மூலம் இந்த பிரச்சினையை debug செய்யலாம்:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

பிறகு console-இல் வெவ்வேறு re-renders-இலிருந்து வரும் arrays மீது right-click செய்து இரண்டிற்கும் "Store as a global variable" என்பதை select செய்யலாம். முதல் ஒன்று `temp1` ஆகவும், இரண்டாவது `temp2` ஆகவும் save ஆனதாக வைத்துக் கொண்டால், இரு arrays-இலுள்ள ஒவ்வொரு dependency-யும் அதேதானா என்பதை browser console-இல் check செய்யலாம்:

```js
Object.is(temp1[0], temp2[0]); // Arrays இடையே முதல் dependency அதேதானா?
Object.is(temp1[1], temp2[1]); // Arrays இடையே இரண்டாவது dependency அதேதானா?
Object.is(temp1[2], temp2[2]); // ... ஒவ்வொரு dependency-க்கும் இதேபோல் ...
```

எந்த dependency memoization-ஐ உடைக்கிறது என்பதை கண்டுபிடித்த பிறகு, அதை remove செய்ய வழி கண்டுபிடிக்கவும், அல்லது [அதையும் memoize செய்யவும்.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Loop ஒன்றில் ஒவ்வொரு list item-க்கும் `useCallback` call செய்ய வேண்டும், ஆனால் அது அனுமதிக்கப்படவில்லை {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` component [`memo`](/reference/react/memo)-வில் wrap செய்யப்பட்டிருக்கிறது என்று வைத்துக் கொள்ளுங்கள். `ReportList` component re-render ஆகும்போது list-இல் உள்ள ஒவ்வொரு `Chart`-மும் re-render ஆகாமல் skip செய்ய விரும்புகிறீர்கள். ஆனால் loop-க்குள் `useCallback` call செய்ய முடியாது:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

அதற்கு பதிலாக, individual item-க்கு component ஒன்றை extract செய்து, `useCallback`-ஐ அங்கே வையுங்கள்:

```js {5,12-21}
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
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

மாற்றாக, கடைசி snippet-இல் `useCallback`-ஐ remove செய்து, அதற்கு பதிலாக `Report`-ஐயே [`memo`.](/reference/react/memo)-வில் wrap செய்யலாம். `item` prop மாறவில்லை என்றால், `Report` re-render ஆகாமல் skip செய்யும்; எனவே `Chart`-மும் re-render ஆகாமல் skip செய்யும்:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
