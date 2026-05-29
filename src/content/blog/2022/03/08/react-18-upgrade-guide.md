---
title: "React 18-க்கு upgrade செய்வது எப்படி"
author: Rick Hanlon
date: 2022/03/08
description: Release post-இல் பகிர்ந்தபடி, React 18 எங்கள் புதிய concurrent renderer மூலம் இயங்கும் features-ஐ, existing applications-க்கான gradual adoption strategy உடன் அறிமுகப்படுத்துகிறது. இந்த post-இல், React 18-க்கு upgrade செய்ய வேண்டிய steps வழியாக உங்களை வழிநடத்துகிறோம்.
---

March 08, 2022 அன்று [Rick Hanlon](https://twitter.com/rickhanlonii) எழுதியது

---

<Intro>

[Release post](/blog/2022/03/29/react-v18)-இல் பகிர்ந்தபடி, React 18 எங்கள் புதிய concurrent renderer மூலம் இயங்கும் features-ஐ, existing applications-க்கான gradual adoption strategy உடன் அறிமுகப்படுத்துகிறது. இந்த post-இல், React 18-க்கு upgrade செய்ய வேண்டிய steps வழியாக உங்களை வழிநடத்துகிறோம்.

React 18-க்கு upgrade செய்யும்போது சந்திக்கும் issues-ஐ [report செய்யவும்](https://github.com/facebook/react/issues/new/choose).

</Intro>

<Note>

React Native users-க்கு, React 18 React Native-ன் எதிர்கால version ஒன்றில் ship ஆகும். காரணம், இந்த blogpost-இல் காணப்படும் புதிய capabilities-ன் பயனைப் பெற React 18, New React Native Architecture-ஐ சார்ந்துள்ளது. மேலும் தகவலுக்கு, [இங்கே React Conf keynote](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)-ஐ பார்க்கவும்.

</Note>

---

## Install செய்தல் {/*installing*/}

React-ன் latest version install செய்ய:

```bash
npm install react react-dom
```

அல்லது yarn பயன்படுத்தினால்:

```bash
yarn add react react-dom
```

## Client rendering APIs-இல் மாற்றங்கள் {/*updates-to-client-rendering-apis*/}

React 18-ஐ முதலில் install செய்தால், console-இல் warning ஒன்றைக் காண்பீர்கள்:

<ConsoleBlock level="error">

ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18 roots manage செய்ய சிறந்த ergonomics வழங்கும் புதிய root API-ஐ அறிமுகப்படுத்துகிறது. புதிய root API புதிய concurrent renderer-யையும் enable செய்கிறது; இது concurrent features-க்கு opt in செய்ய அனுமதிக்கிறது.

```js
// Before
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // TypeScript பயன்படுத்தினால் createRoot(container!)
root.render(<App tab="home" />);
```

`unmountComponentAtNode`-ஐ `root.unmount` ஆகவும் மாற்றியுள்ளோம்:

```js
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

Suspense பயன்படுத்தும்போது render callback பொதுவாக எதிர்பார்த்த result தராததால், render-இலிருந்து callback-ஐயும் remove செய்துள்ளோம்:

```js
// Before
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// After
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

பழைய render callback API-க்கு one-to-one replacement இல்லை - அது உங்கள் use case-ஐப் பொறுத்தது. மேலும் தகவலுக்கு [Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5) working group post-ஐ பார்க்கவும்.

</Note>

இறுதியாக, உங்கள் app server-side rendering with hydration பயன்படுத்தினால், `hydrate`-ஐ `hydrateRoot`-க்கு upgrade செய்யவும்:

```js
// Before
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// After
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Unlike with createRoot, you don't need a separate root.render() call here.
```

மேலும் தகவலுக்கு, [இங்கே working group discussion](https://github.com/reactwg/react-18/discussions/5)-ஐ பார்க்கவும்.

<Note>

**Upgrade செய்த பிறகு உங்கள் app வேலை செய்யவில்லை என்றால், அது `<StrictMode>`-இல் wrapped உள்ளதா என்று check செய்யவும்.** [React 18-இல் Strict Mode இன்னும் strict ஆகியுள்ளது](#updates-to-strict-mode), development mode-இல் அது சேர்க்கும் புதிய checks-க்கு உங்கள் எல்லா components-மும் resilient ஆக இருக்காது. Strict Mode remove செய்தால் app fix ஆகினால், upgrade போது அதை remove செய்து, அது சுட்டிக்காட்டும் issues fix செய்த பிறகு மீண்டும் சேர்க்கலாம் (tree-ன் top-இல் அல்லது ஒரு பகுதியிலாவது).

</Note>

## Server rendering APIs-இல் மாற்றங்கள் {/*updates-to-server-rendering-apis*/}

இந்த release-இல், server-இல் Suspense மற்றும் Streaming SSR-ஐ முழுமையாக support செய்ய எங்கள் `react-dom/server` APIs-ஐ revamp செய்கிறோம். இந்த changes-ன் ஒரு பகுதியாக, server-இல் incremental Suspense streaming support செய்யாத பழைய Node streaming API-ஐ deprecate செய்கிறோம்.

இந்த API பயன்படுத்தினால் இப்போது warn செய்யும்:

* `renderToNodeStream`: **Deprecated ⛔️️**

அதற்கு பதிலாக, Node environments-இல் streaming-க்கு இதைப் பயன்படுத்தவும்:
* `renderToPipeableStream`: **New ✨**

Deno மற்றும் Cloudflare workers போன்ற modern edge runtime environments-க்காக Suspense உடன் streaming SSR support செய்ய புதிய API-யையும் அறிமுகப்படுத்துகிறோம்:
* `renderToReadableStream`: **New ✨**

பின்வரும் APIs தொடர்ந்து வேலை செய்யும்; ஆனால் Suspense support limited:
* `renderToString`: **Limited** ⚠️
* `renderToStaticMarkup`: **Limited** ⚠️

இறுதியாக, இந்த API e-mails render செய்வதற்காக தொடர்ந்து வேலை செய்யும்:
* `renderToStaticNodeStream`

Server rendering APIs-க்கு changes பற்றிய மேலும் தகவலுக்கு, [Upgrading to React 18 on the server](https://github.com/reactwg/react-18/discussions/22) working group post, புதிய Suspense SSR Architecture பற்றிய [deep dive](https://github.com/reactwg/react-18/discussions/37), மற்றும் React Conf 2021-இல் [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) பற்றி [Shaundai Person](https://twitter.com/shaundai) வழங்கிய talk-ஐ பார்க்கவும்.

## TypeScript definitions-இல் மாற்றங்கள் {/*updates-to-typescript-definitions*/}

உங்கள் project TypeScript பயன்படுத்தினால், `@types/react` மற்றும் `@types/react-dom` dependencies-ஐ latest versions-க்கு update செய்ய வேண்டும். புதிய types பாதுகாப்பானவை; முன்பு type checker ignore செய்த issues-ஐ catch செய்கின்றன. குறிப்பிடத்தக்க change: props define செய்யும்போது `children` prop இப்போது explicit ஆக list செய்யப்பட வேண்டும். உதாரணம்:

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

Type-only changes-ன் முழு பட்டியலுக்கு [React 18 typings pull request](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210)-ஐ பார்க்கவும். உங்கள் code-ஐ எப்படி adjust செய்யலாம் என்பதைப் பார்க்க library types-இல் example fixes-க்கு அது link செய்கிறது. உங்கள் application code-ஐ புதிய மற்றும் பாதுகாப்பான typings-க்கு விரைவாக port செய்ய [automated migration script](https://github.com/eps1lon/types-react-codemod) பயன்படுத்தலாம்.

Typings-இல் bug கண்டால், DefinitelyTyped repo-இல் [issue file செய்யவும்](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package).

## Automatic batching {/*automatic-batching*/}

React 18 default ஆக அதிக batching செய்வதால் out-of-the-box performance improvements சேர்க்கிறது. Batching என்பது, React பல state updates-ஐ better performance-க்காக single re-render ஆக group செய்வது. React 18-க்கு முன், React event handlers உள்ளே நடந்த updates மட்டும் batched செய்யப்பட்டன. Promises, setTimeout, native event handlers, அல்லது வேறு event உள்ளே updates React-இல் default ஆக batched செய்யப்படவில்லை:

```js
// Before React 18 only React events were batched

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);
```


React 18-இல் `createRoot` உடன் தொடங்கி, updates எங்கிருந்து originate ஆனாலும் எல்லாம் automatically batched செய்யப்படும். இதன் அர்த்தம்: timeouts, promises, native event handlers அல்லது வேறு event உள்ளே updates, React events உள்ளே updates போல் batch செய்யப்படும்:

```js
// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

இது breaking change; ஆனால் இதனால் rendering work குறைந்து, உங்கள் applications-இல் better performance கிடைக்கும் என்று எதிர்பார்க்கிறோம். Automatic batching-இலிருந்து opt out செய்ய `flushSync` பயன்படுத்தலாம்:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

மேலும் தகவலுக்கு, [Automatic batching deep dive](https://github.com/reactwg/react-18/discussions/21)-ஐ பார்க்கவும்.

## Libraries-க்கான புதிய APIs {/*new-apis-for-libraries*/}

React 18 Working Group-இல், styles மற்றும் external stores போன்ற areas-இல் specific use cases-க்கு concurrent rendering support செய்ய தேவையான புதிய APIs உருவாக்க library maintainers உடன் பணிபுரிந்தோம். React 18 support செய்ய, சில libraries பின்வரும் APIs-ல் ஒன்றுக்கு switch செய்ய வேண்டியிருக்கலாம்:

* `useSyncExternalStore` என்பது external stores concurrent reads support செய்ய அனுமதிக்கும் புதிய Hook; store updates synchronous ஆக இருக்க force செய்கிறது. React-க்கு வெளியில் உள்ள state உடன் integrate செய்யும் எந்த library-க்கும் இந்த புதிய API பரிந்துரைக்கப்படுகிறது. மேலும் தகவலுக்கு, [useSyncExternalStore overview post](https://github.com/reactwg/react-18/discussions/70) மற்றும் [useSyncExternalStore API details](https://github.com/reactwg/react-18/discussions/86)-ஐ பார்க்கவும்.
* `useInsertionEffect` என்பது render-இல் styles inject செய்வதால் ஏற்படும் performance issues-ஐ CSS-in-JS libraries address செய்ய அனுமதிக்கும் புதிய Hook. நீங்கள் ஏற்கனவே CSS-in-JS library build செய்யவில்லை என்றால் இதை பயன்படுத்த வேண்டியிருக்கும் என்று எதிர்பார்ப்பதில்லை. DOM mutate ஆன பிறகு, ஆனால் layout effects புதிய layout read செய்வதற்கு முன் இந்த Hook run ஆகும். இது React 17 மற்றும் அதற்கு கீழே ஏற்கனவே இருந்த issue ஒன்றை solve செய்கிறது; React 18-இல் இது இன்னும் முக்கியமானது, ஏனெனில் concurrent rendering போது React browser-க்கு yield செய்து layout recalculate செய்ய வாய்ப்பு தருகிறது. மேலும் தகவலுக்கு, [`<style>`-க்கான Library Upgrade Guide](https://github.com/reactwg/react-18/discussions/110)-ஐ பார்க்கவும்.

React 18, `startTransition`, `useDeferredValue`, மற்றும் `useId` போன்ற concurrent rendering-க்கான புதிய APIs-யையும் அறிமுகப்படுத்துகிறது; இதைப் பற்றி [release post](/blog/2022/03/29/react-v18)-இல் மேலும் பகிர்ந்துள்ளோம்.

## Strict Mode-க்கு updates {/*updates-to-strict-mode*/}

எதிர்காலத்தில், state preserve செய்தபடி UI-ன் sections-ஐ add மற்றும் remove செய்ய React-க்கு அனுமதிக்கும் feature சேர்க்க விரும்புகிறோம். உதாரணமாக, user ஒரு screen-இலிருந்து வேறு tab-க்கு சென்று மீண்டும் திரும்பும்போது, React previous screen-ஐ உடனடியாக காட்ட முடியும். இதை செய்ய, React முன்பிருந்த அதே component state பயன்படுத்தி trees-ஐ unmount மற்றும் remount செய்யும்.

இந்த feature React-க்கு out-of-the-box better performance தரும்; ஆனால் effects பலமுறை mount மற்றும் destroy செய்யப்படுவதற்கு components resilient ஆக இருக்க வேண்டும். பெரும்பாலான effects changes இல்லாமல் வேலை செய்யும்; ஆனால் சில effects ஒருமுறை மட்டுமே mount அல்லது destroy ஆகும் என்று assume செய்கின்றன.

இந்த issues surface செய்ய, React 18 Strict Mode-க்கு புதிய development-only check ஒன்றை அறிமுகப்படுத்துகிறது. ஒரு component முதல் முறையாக mount ஆகும் போதெல்லாம், இந்த புதிய check ஒவ்வொரு component-ஐயும் automatically unmount மற்றும் remount செய்து, இரண்டாவது mount-இல் previous state-ஐ restore செய்யும்.

இந்த change-க்கு முன், React component-ஐ mount செய்து effects உருவாக்கும்:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

React 18-இல் Strict Mode உடன், React development mode-இல் component-ஐ unmount மற்றும் remount செய்வதை simulate செய்யும்:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates unmounting the component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates mounting the component with the previous state.
    * Layout effect setup code runs
    * Effect setup code runs
```

மேலும் தகவலுக்கு, [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) மற்றும் [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18) Working Group posts-ஐ பார்க்கவும்.

## உங்கள் testing environment configure செய்தல் {/*configuring-your-testing-environment*/}

`createRoot` பயன்படுத்த உங்கள் tests-ஐ முதலில் update செய்தால், test console-இல் இந்த warning-ஐ பார்க்கலாம்:

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

இதை fix செய்ய, test run செய்வதற்கு முன் `globalThis.IS_REACT_ACT_ENVIRONMENT`-ஐ `true` ஆக set செய்யவும்:

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

இந்த flag-ன் நோக்கம், React unit test போன்ற environment-இல் run ஆகிறது என்று React-க்கு சொல்லுவது. Update ஒன்றை `act`-ல் wrap செய்ய மறந்தால் React helpful warnings log செய்யும்.

`act` தேவையில்லை என்று React-க்கு சொல்ல flag-ஐ `false` ஆகவும் set செய்யலாம். Full browser environment simulate செய்யும் end-to-end tests-க்கு இது பயனுள்ளதாக இருக்கலாம்.

இறுதியில், testing libraries இதை உங்களுக்காக automatically configure செய்யும் என்று எதிர்பார்க்கிறோம். உதாரணமாக, எந்த கூடுதல் configuration-மும் இல்லாமல் [React Testing Library-ன் அடுத்த version-இல் React 18-க்கு built-in support உள்ளது](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936).

[`act` testing API மற்றும் தொடர்புடைய changes பற்றிய மேலும் background](https://github.com/reactwg/react-18/discussions/102) working group-இல் கிடைக்கிறது.

## Internet Explorer support நீக்குதல் {/*dropping-support-for-internet-explorer*/}

இந்த release-இல், [ஜூன் 15, 2022 அன்று support முடிவடையும்](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge) Internet Explorer-க்கு React support drop செய்கிறது. React 18-இல் அறிமுகப்படுத்தப்பட்ட புதிய features, IE-இல் போதுமான அளவு polyfill செய்ய முடியாத microtasks போன்ற modern browser features பயன்படுத்தி build செய்யப்பட்டுள்ளதால் இந்த change-ஐ இப்போது செய்கிறோம்.

Internet Explorer support செய்ய வேண்டுமெனில், React 17-இலேயே இருக்க பரிந்துரைக்கிறோம்.

## Deprecations {/*deprecations*/}

* `react-dom`: `ReactDOM.render` deprecated. இதைப் பயன்படுத்தினால் warning வரும்; உங்கள் app React 17 mode-இல் run ஆகும்.
* `react-dom`: `ReactDOM.hydrate` deprecated. இதைப் பயன்படுத்தினால் warning வரும்; உங்கள் app React 17 mode-இல் run ஆகும்.
* `react-dom`: `ReactDOM.unmountComponentAtNode` deprecated.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` deprecated.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` deprecated.

## பிற breaking changes {/*other-breaking-changes*/}

* **Consistent useEffect timing**: Click அல்லது keydown event போன்ற discrete user input event போது update trigger செய்யப்பட்டிருந்தால், React இப்போது effect functions-ஐ எப்போதும் synchronously flush செய்கிறது. முன்பு behavior எப்போதும் predictable அல்லது consistent இல்லை.
* **கடுமையான hydration errors**: Missing அல்லது extra text content காரணமான hydration mismatches இப்போது warnings-க்கு பதிலாக errors போல treat செய்யப்படுகின்றன. Server markup-க்கு match செய்ய client-இல் node insert அல்லது delete செய்து individual nodes-ஐ "patch up" செய்ய React இனி முயற்சிக்காது; tree-இல் closest `<Suspense>` boundary வரை client rendering-க்கு revert செய்யும். இதனால் hydrated tree consistent ஆக இருக்கும்; hydration mismatches காரணமாக ஏற்படக்கூடிய potential privacy மற்றும் security holes தவிர்க்கப்படுகின்றன.
* **Suspense trees எப்போதும் consistent:** Component முழுமையாக tree-க்கு add செய்யப்படுவதற்கு முன் suspend ஆனால், React அதை incomplete state-இல் tree-க்கு add செய்யவோ அதன் effects fire செய்யவோ செய்யாது. அதற்கு பதிலாக, React புதிய tree-ஐ முழுமையாக throw away செய்து, asynchronous operation முடியும் வரை காத்திருந்து, பின்னர் scratch-இலிருந்து மீண்டும் rendering retry செய்யும். React retry attempt-ஐ concurrently render செய்யும்; browser-ஐ block செய்யாமல்.
* **Suspense உடன் Layout Effects**: Tree மீண்டும் suspend ஆகி fallback-க்கு revert ஆனபோது, React இப்போது layout effects clean up செய்து, boundary உள்ள content மீண்டும் காட்டப்படும் போது அவற்றை re-create செய்கிறது. Suspense உடன் பயன்படுத்தும்போது component libraries layout-ஐ சரியாக measure செய்ய முடியாமல் இருந்த issue-ஐ இது fix செய்கிறது.
* **புதிய JS environment requirements**: React இப்போது `Promise`, `Symbol`, மற்றும் `Object.assign` உட்பட modern browser features-ஐ சார்ந்துள்ளது. Modern browser features native ஆக வழங்காத அல்லது non-compliant implementations கொண்ட Internet Explorer போன்ற older browsers மற்றும் devices support செய்தால், உங்கள் bundled application-இல் global polyfill include செய்வதைப் பரிசீலிக்கவும்.

## பிற notable changes {/*other-notable-changes*/}

### React {/*react*/}

* **Components இப்போது `undefined` render செய்யலாம்:** Component ஒன்றிலிருந்து `undefined` return செய்தால் React இனி warn செய்யாது. இது allowed component return values-ஐ component tree நடுப்பகுதியில் அனுமதிக்கப்படும் values உடன் consistent ஆக்குகிறது. JSX-க்கு முன் `return` statement மறப்பது போன்ற mistakes-ஐ தடுக்க linter பயன்படுத்த பரிந்துரைக்கிறோம்.
* **Tests-இல், `act` warnings இப்போது opt-in:** End-to-end tests run செய்தால், `act` warnings தேவையில்லை. அவை பயனுள்ளதாக இருக்கும் unit tests-க்கு மட்டும் enable செய்ய [opt-in](https://github.com/reactwg/react-18/discussions/102) mechanism அறிமுகப்படுத்தியுள்ளோம்.
* **Unmounted components-இல் `setState` பற்றி warning இல்லை:** முன்பு, unmounted component-இல் `setState` call செய்தால் memory leaks பற்றி React warn செய்தது. இந்த warning subscriptions-க்காக சேர்க்கப்பட்டது; ஆனால் மக்கள் பெரும்பாலும் state setting fine ஆக இருக்கும் scenarios-இல் இதை சந்தித்தனர், மேலும் workarounds code-ஐ மோசமாக்கின. இந்த warning-ஐ [remove செய்துள்ளோம்](https://github.com/facebook/react/pull/22114).
* **Console logs suppress செய்யப்படாது:** Strict Mode பயன்படுத்தும்போது, unexpected side effects கண்டறிய React ஒவ்வொரு component-யையும் இருமுறை render செய்கிறது. React 17-இல், logs படிக்க நேரடியாக இருக்க இரண்டு renders-இல் ஒன்றுக்கான console logs suppress செய்தோம். இது confusing என்கிற [community feedback](https://github.com/facebook/react/issues/21783)-க்கு பதிலாக suppression remove செய்துள்ளோம். அதற்கு பதிலாக, React DevTools install செய்யப்பட்டிருந்தால், இரண்டாவது render-ன் logs grey-ஆக காட்டப்படும்; அவற்றை முழுமையாக suppress செய்யும் option இருக்கும் (default ஆக off).
* **மேம்பட்ட memory usage:** Unmount போது React இப்போது அதிக internal fields clean up செய்கிறது; இதனால் உங்கள் application code-இல் இருக்கக்கூடிய unfixed memory leaks-ன் impact குறையும்.

### React DOM Server {/*react-dom-server*/}

* **`renderToString`:** Server-இல் suspending போது இனி error ஆகாது. அதற்கு பதிலாக, closest `<Suspense>` boundary-க்கான fallback HTML emit செய்து, அதே content-ஐ client-இல் rendering retry செய்யும். இருந்தாலும் `renderToPipeableStream` அல்லது `renderToReadableStream` போன்ற streaming API-க்கு switch செய்ய பரிந்துரைக்கப்படுகிறது.
* **`renderToStaticMarkup`:** Server-இல் suspending போது இனி error ஆகாது. அதற்கு பதிலாக, closest `<Suspense>` boundary-க்கான fallback HTML emit செய்யும்.

## Changelog {/*changelog*/}

[முழு changelog-ஐ இங்கே](https://github.com/facebook/react/blob/main/CHANGELOG.md) பார்க்கலாம்.
