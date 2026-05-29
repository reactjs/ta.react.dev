---
title: "React v18.0"
author: The React Team
date: 2022/03/08
description: React 18 இப்போது npm-இல் கிடைக்கிறது! முந்தைய post-இல், உங்கள் app-ஐ React 18-க்கு upgrade செய்வதற்கான step-by-step instructions பகிர்ந்தோம். இந்த post-இல், React 18-இல் புதிதாக என்ன உள்ளது, அது எதிர்காலத்துக்கு என்ன அர்த்தம் என்பதற்கான overview கொடுக்கிறோம்.
---

March 29, 2022 அன்று [React Team](/community/team) எழுதியது

---

<Intro>

React 18 இப்போது npm-இல் கிடைக்கிறது! முந்தைய post-இல், [உங்கள் app-ஐ React 18-க்கு upgrade செய்வதற்கான](/blog/2022/03/08/react-18-upgrade-guide) step-by-step instructions பகிர்ந்தோம். இந்த post-இல், React 18-இல் புதிதாக என்ன உள்ளது, அது எதிர்காலத்துக்கு என்ன அர்த்தம் என்பதற்கான overview கொடுக்கிறோம்.

</Intro>

---

எங்கள் latest major version, automatic batching போன்ற out-of-the-box improvements, startTransition போன்ற புதிய APIs, மற்றும் Suspense support உடன் streaming server-side rendering ஆகியவற்றை கொண்டுள்ளது.

React 18-இல் உள்ள பல features, powerful புதிய capabilities unlock செய்யும் behind-the-scenes change ஆன எங்கள் புதிய concurrent renderer மேல் build செய்யப்பட்டவை. Concurrent React opt-in - நீங்கள் concurrent feature பயன்படுத்தும்போது மட்டுமே enable ஆகும் - ஆனால் applications build செய்வதில் இது பெரிய தாக்கம் ஏற்படுத்தும் என்று நாங்கள் நினைக்கிறோம்.

React-இல் concurrency support ஆராய்ந்து develop செய்ய பல ஆண்டுகள் செலவிட்டோம்; existing users-க்கு gradual adoption path வழங்க கூடுதல் கவனம் எடுத்தோம். கடந்த கோடையில், community experts-இடமிருந்து feedback பெறவும் முழு React ecosystem-க்கு smooth upgrade experience உறுதி செய்யவும் [React 18 Working Group-ஐ உருவாக்கினோம்](/blog/2021/06/08/the-plan-for-react-18).

தவறவிட்டிருந்தால், React Conf 2021-இல் இந்த vision-ன் பல பகுதிகளை பகிர்ந்தோம்:

* [Keynote](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)-இல், great user experiences build செய்வதை developers-க்கு உதவும் எங்கள் mission-இல் React 18 எப்படி fit ஆகிறது என்பதை விளக்குகிறோம்
* [Shruti Kapoor](https://twitter.com/shrutikapoor08), [React 18-இல் புதிய features பயன்படுத்துவது எப்படி என்பதை demonstrate செய்தார்](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)
* [Shaundai Person](https://twitter.com/shaundai), [Suspense உடன் streaming server rendering](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3) பற்றிய overview கொடுத்தார்

Concurrent Rendering-இல் தொடங்கி, இந்த release-இல் என்ன எதிர்பார்க்கலாம் என்பதற்கான முழு overview கீழே உள்ளது.

<Note>

React Native users-க்கு, React 18 New React Native Architecture உடன் React Native-இல் ship ஆகும். மேலும் தகவலுக்கு, [இங்கே React Conf keynote](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)-ஐ பார்க்கவும்.

</Note>

## Concurrent React என்றால் என்ன? {/*what-is-concurrent-react*/}

React 18-இல் மிக முக்கியமான addition, நீங்கள் ஒருபோதும் சிந்திக்க வேண்டியிருக்காது என்று நாங்கள் நம்பும் ஒன்று: concurrency. Application developers-க்கு இது பெரும்பாலும் உண்மை என்று நினைக்கிறோம்; library maintainers-க்கு கதை சிறிது சிக்கலாக இருக்கலாம்.

Concurrency என்பது தனியே ஒரு feature அல்ல. இது React ஒரே நேரத்தில் உங்கள் UI-ன் பல versions-ஐ prepare செய்ய அனுமதிக்கும் புதிய behind-the-scenes mechanism. Concurrency-ஐ implementation detail என்று நினைக்கலாம் - அது unlock செய்யும் features காரணமாக அது valuable. React அதன் internal implementation-இல் priority queues மற்றும் multiple buffering போன்ற sophisticated techniques பயன்படுத்துகிறது. ஆனால் அந்த concepts எங்கள் public APIs-இல் எங்கும் தெரியாது.

APIs design செய்யும்போது, implementation details-ஐ developers-இடமிருந்து மறைக்க முயற்சிக்கிறோம். React developer ஆக, user experience எப்படி இருக்க வேண்டும் என்ற *what* மீது நீங்கள் கவனம் செலுத்துகிறீர்கள்; அந்த experience-ஐ *how* deliver செய்வது React கவனிக்கிறது. அதனால் concurrency under the hood எப்படி வேலை செய்கிறது என்பதை React developers தெரிந்திருக்க வேண்டும் என்று எதிர்பார்ப்பதில்லை.

ஆனால் Concurrent React, வழக்கமான implementation detail-ஐ விட முக்கியமானது - அது React-ன் core rendering model-க்கு foundational update. எனவே concurrency எப்படி வேலை செய்கிறது என்பதை அறிதல் super important அல்லாதபோதும், high level-இல் அது என்ன என்பதை அறிந்திருப்பது பயனுள்ளதாக இருக்கலாம்.

Concurrent React-ன் முக்கிய property: rendering interruptible. React 18-க்கு முதலில் upgrade செய்தபோது, எந்த concurrent features-யும் சேர்க்கும்முன், updates முந்தைய React versions போலவே render செய்யப்படும் - single, uninterrupted, synchronous transaction ஆக. Synchronous rendering-இல், ஒரு update render ஆகத் தொடங்கிய பிறகு, user screen-இல் result பார்க்கும் வரை எதுவும் அதை interrupt செய்ய முடியாது.

Concurrent render-இல், இது எப்போதும் அப்படி இருக்காது. React ஒரு update render செய்யத் தொடங்கி, நடுவில் pause செய்து, பிறகு continue செய்யலாம். In-progress render-ஐ முழுவதுமாக abandon செய்யக்கூடும். Render interrupt செய்யப்பட்டாலும் UI consistent ஆகத் தோன்றும் என்று React guarantee செய்கிறது. இதைச் செய்ய, முழு tree evaluate ஆன பிறகு, end வரைக்கும் DOM mutations செய்யாமல் காத்திருக்கிறது. இந்த capability மூலம், main thread-ஐ block செய்யாமல் React background-இல் புதிய screens prepare செய்ய முடியும். இதனால் பெரிய rendering task நடுவில் இருந்தாலும் UI user input-க்கு உடனடியாக respond செய்ய முடியும்; fluid user experience உருவாகிறது.

மற்றொரு example reusable state. Concurrent React, UI-ன் sections-ஐ screen-இலிருந்து remove செய்து, பின்னர் previous state-ஐ reuse செய்தபடி மீண்டும் add செய்ய முடியும். உதாரணமாக, user screen ஒன்றிலிருந்து வேறு tab-க்கு சென்று திரும்பும்போது, முன்பிருந்த அதே state-இல் previous screen-ஐ React restore செய்ய முடியும். வரவிருக்கும் minor release-இல், இந்த pattern-ஐ implement செய்யும் `<Offscreen>` என்ற புதிய component சேர்க்க திட்டமிட்டுள்ளோம். அதேபோல், user reveal செய்வதற்கு முன் புதிய UI ready ஆக background-இல் prepare செய்ய Offscreen பயன்படுத்த முடியும்.

Concurrent rendering React-இல் powerful புதிய tool; Suspense, transitions, மற்றும் streaming server rendering உட்பட எங்கள் புதிய features பெரும்பாலானவை இதன் பயனைப் பெற build செய்யப்பட்டவை. ஆனால் இந்த புதிய foundation மேல் நாம் build செய்ய விரும்பும் விஷயங்களின் தொடக்கம் மட்டுமே React 18.

## Concurrent features-ஐ gradual-ஆக adopt செய்தல் {/*gradually-adopting-concurrent-features*/}

Technically, concurrent rendering ஒரு breaking change. Concurrent rendering interruptible என்பதால், அது enable ஆனபோது components சிறிது வேறுபட்டபடி behave செய்யும்.

எங்கள் testing-இல், ஆயிரக்கணக்கான components-ஐ React 18-க்கு upgrade செய்துள்ளோம். நாங்கள் கண்டுபிடித்தது: existing components-ல் கிட்டத்தட்ட அனைத்தும் changes இல்லாமல் concurrent rendering உடன் "just work" செய்கின்றன. ஆனால் சிலவற்றுக்கு கூடுதல் migration effort தேவைப்படலாம். Changes பொதுவாக சிறியதாக இருந்தாலும், அவற்றை உங்கள் சொந்த pace-இல் செய்யும் ability இன்னும் உங்களுக்கு இருக்கும். React 18-இல் புதிய rendering behavior **புதிய features பயன்படுத்தும் உங்கள் app பகுதிகளில் மட்டுமே enable ஆகும்.**

Overall upgrade strategy: existing code break ஆகாமல் உங்கள் application React 18-இல் run ஆகும்படி செய்யுங்கள். பின்னர் உங்கள் சொந்த pace-இல் concurrent features சேர்க்கத் தொடங்கலாம். Development போது concurrency-related bugs surface செய்ய [`<StrictMode>`](/reference/react/StrictMode) பயன்படுத்தலாம். Strict Mode production behavior-ஐ பாதிக்காது; ஆனால் development போது extra warnings log செய்து, idempotent ஆக இருக்க expected functions-ஐ double-invoke செய்யும். அது எல்லாவற்றையும் catch செய்யாது; ஆனால் மிகவும் பொதுவான mistake வகைகளைத் தடுக்க effective.

React 18-க்கு upgrade செய்த பிறகு, concurrent features உடனடியாக பயன்படுத்தத் தொடங்கலாம். உதாரணமாக, user input block செய்யாமல் screens இடையே navigate செய்ய startTransition பயன்படுத்தலாம். அல்லது expensive re-renders throttle செய்ய useDeferredValue பயன்படுத்தலாம்.

ஆனால் long term-இல், உங்கள் app-க்கு concurrency சேர்க்கும் முக்கியமான வழி concurrent-enabled library அல்லது framework பயன்படுத்துவதே என்று எதிர்பார்க்கிறோம். பெரும்பாலான cases-இல், concurrent APIs-ஐ நேரடியாக நீங்கள் interact செய்யமாட்டீர்கள். உதாரணமாக, developers புதிய screen-க்கு navigate செய்யும் ஒவ்வொரு முறையும் startTransition call செய்வதற்கு பதிலாக, router libraries navigations-ஐ automatically startTransition-இல் wrap செய்யும்.

Libraries concurrent compatible ஆக upgrade ஆக சில நேரம் ஆகலாம். Concurrent features-ன் பயனை libraries நேரடியாக பெற புதிய APIs வழங்கியுள்ளோம். இதற்கிடையில், React ecosystem-ஐ gradual-ஆக migrate செய்ய நாங்கள் வேலை செய்வதால் maintainers-க்கு பொறுமையாக இருங்கள்.

மேலும் தகவலுக்கு, எங்கள் முந்தைய post-ஐ பார்க்கவும்: [React 18-க்கு upgrade செய்வது எப்படி](/blog/2022/03/08/react-18-upgrade-guide).

## Data frameworks-இல் Suspense பயன்பாடு {/*suspense-in-data-frameworks*/}

React 18-இல், Relay, Next.js, Hydrogen, அல்லது Remix போன்ற opinionated frameworks-இல் data fetching-க்கு [Suspense](/reference/react/Suspense) பயன்படுத்தத் தொடங்கலாம். Suspense உடன் ad hoc data fetching technically possible; ஆனால் general strategy ஆக இன்னும் பரிந்துரைக்கப்படவில்லை.

எதிர்காலத்தில், opinionated framework இல்லாமலேயே Suspense உடன் உங்கள் data access செய்வதை உதவும் கூடுதல் primitives expose செய்யலாம். ஆனால் Suspense, உங்கள் application architecture-இல் ஆழமாக integrate செய்யப்பட்டபோது சிறப்பாக வேலை செய்கிறது: உங்கள் router, data layer, மற்றும் server rendering environment. எனவே long term-இல்கூட, React ecosystem-இல் libraries மற்றும் frameworks முக்கிய பங்கு வகிக்கும் என்று எதிர்பார்க்கிறோம்.

முந்தைய React versions போல, client-இல் React.lazy உடன் code splitting-க்கு Suspense பயன்படுத்தலாம். ஆனால் Suspense பற்றிய எங்கள் vision எப்போதும் code loading-ஐ விட பெரியது - இறுதியில் அதே declarative Suspense fallback எந்த asynchronous operation-யையும் (code, data, images போன்றவை loading) handle செய்யும் வகையில் Suspense support-ஐ விரிவாக்குவதே goal.

## Server Components இன்னும் development-இல் உள்ளது {/*server-components-is-still-in-development*/}

[**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components) என்பது server மற்றும் client முழுவதும் span ஆகும் apps build செய்ய developers-க்கு அனுமதிக்கும் வரவிருக்கும் feature; client-side apps-ன் rich interactivity-யையும் traditional server rendering-ன் improved performance-யையும் combine செய்கிறது. Server Components, Concurrent React-க்கு inherently coupled அல்ல; ஆனால் Suspense மற்றும் streaming server rendering போன்ற concurrent features உடன் சிறப்பாக வேலை செய்ய வடிவமைக்கப்பட்டுள்ளது.

Server Components இன்னும் experimental; ஆனால் minor 18.x release ஒன்றில் initial version release செய்ய எதிர்பார்க்கிறோம். இதற்கிடையில், proposal-ஐ advance செய்து broad adoption-க்கு ready ஆக்க Next.js, Hydrogen, Remix போன்ற frameworks உடன் பணிபுரிகிறோம்.

## React 18-இல் புதிதாக என்ன? {/*whats-new-in-react-18*/}

### புதிய feature: Automatic batching {/*new-feature-automatic-batching*/}

Batching என்பது, better performance-க்காக React பல state updates-ஐ single re-render ஆக group செய்வது. Automatic batching இல்லாமல், React event handlers உள்ளே updates மட்டும் batched செய்தோம். Promises, setTimeout, native event handlers, அல்லது வேறு event உள்ளே updates React-இல் default ஆக batched செய்யப்படவில்லை. Automatic batching உடன், இந்த updates automatically batched செய்யப்படும்:


```js
// Before: only React events were batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

மேலும் தகவலுக்கு, [React 18-இல் குறைவான renders-க்கான Automatic batching](https://github.com/reactwg/react-18/discussions/21) post-ஐ பார்க்கவும்.

### புதிய feature: Transitions {/*new-feature-transitions*/}

Transition என்பது urgent மற்றும் non-urgent updates இடையே வேறுபாடு காட்ட React-இல் உள்ள புதிய concept.

* **Urgent updates** typing, clicking, pressing போன்ற direct interaction-ஐ reflect செய்கின்றன.
* **Transition updates** UI-ஐ ஒரு view-இலிருந்து மற்றொன்றுக்கு transition செய்கின்றன.

Typing, clicking, pressing போன்ற urgent updates, physical objects எப்படி behave செய்யும் என்பதைப் பற்றிய எங்கள் intuitions-க்கு match ஆக immediate response தேவை. இல்லையெனில் அவை "தவறாக" உணரப்படும். ஆனால் transitions வேறுபடும்; user screen-இல் ஒவ்வொரு intermediate value-யையும் பார்க்க எதிர்பார்ப்பதில்லை.

உதாரணமாக, dropdown-இல் filter தேர்வு செய்தால், click செய்தவுடன் filter button தானே உடனடியாக respond செய்ய வேண்டும் என்று எதிர்பார்ப்பீர்கள். ஆனால் actual results தனியாக transition ஆகலாம். சிறிய delay கவனிக்க முடியாததாகவும், பெரும்பாலும் expected ஆகவும் இருக்கும். Results rendering முடிவதற்கு முன் filter-ஐ மீண்டும் மாற்றினால், latest results மட்டும் பார்க்க வேண்டும் என்பதே முக்கியம்.

சாதாரணமாக, சிறந்த user experience-க்காக single user input ஒன்று urgent update-ஐயும் non-urgent update-ஐயும் உருவாக்க வேண்டும். எந்த updates urgent, எவை "transitions" என்பதை React-க்கு தெரிவிக்க input event உள்ளே startTransition API பயன்படுத்தலாம்:


```js
import { startTransition } from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```


startTransition-இல் wrap செய்யப்பட்ட updates non-urgent ஆக handle செய்யப்படும்; clicks அல்லது key presses போன்ற urgent updates வந்தால் interrupted ஆகும். User transition-ஐ interrupt செய்தால் (உதாரணமாக, தொடர்ச்சியாக பல characters type செய்தால்), React முடிக்கப்படாத stale rendering work-ஐ throw out செய்து latest update மட்டும் render செய்யும்.


* `useTransition`: pending state track செய்யும் value உட்பட transitions தொடங்கும் Hook.
* `startTransition`: Hook பயன்படுத்த முடியாதபோது transitions தொடங்கும் method.

Transitions concurrent rendering-க்கு opt in செய்யும்; இதனால் update interrupt செய்யப்படலாம். Content re-suspend ஆனால், background-இல் transition content render செய்யும் போது current content-ஐத் தொடர்ந்து காட்ட React-க்கு transitions சொல்கின்றன (மேலும் தகவலுக்கு [Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)-ஐ பார்க்கவும்).

[Transitions docs இங்கே பார்க்கவும்](/reference/react/useTransition).

### புதிய Suspense features {/*new-suspense-features*/}

Component tree-ன் ஒரு பகுதி இன்னும் display செய்ய ready ஆகவில்லை என்றால், அதன் loading state-ஐ declaratively specify செய்ய Suspense அனுமதிக்கிறது:

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense, React programming model-இல் "UI loading state"-ஐ first-class declarative concept ஆக்குகிறது. இதன் மேல் higher-level features build செய்ய இது அனுமதிக்கிறது.

பல ஆண்டுகளுக்கு முன் Suspense-ன் limited version ஒன்றை அறிமுகப்படுத்தினோம். ஆனால் supported use case React.lazy உடன் code splitting மட்டும்; server-இல் rendering செய்யும்போது support ஏதும் இல்லை.

React 18-இல், server-இல் Suspense support சேர்த்துள்ளோம்; concurrent rendering features பயன்படுத்தி அதன் capabilities-ஐ விரிவாக்கியுள்ளோம்.

React 18-இல் Suspense transition API உடன் சேரும்போது சிறப்பாக வேலை செய்கிறது. Transition நடக்கும் போது suspend செய்தால், ஏற்கனவே visible content fallback-ஆல் replace செய்யப்படுவதை React தடுக்கிறது. அதற்கு பதிலாக, மோசமான loading state தவிர்க்க போதுமான data load ஆகும் வரை render-ஐ delay செய்யும்.

மேலும் அறிய, [React 18-இல் Suspense](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) RFC-ஐ பார்க்கவும்.

### புதிய client மற்றும் server rendering APIs {/*new-client-and-server-rendering-apis*/}

இந்த release-இல் client மற்றும் server rendering-க்கு expose செய்யும் APIs-ஐ redesign செய்யும் வாய்ப்பைப் பயன்படுத்தினோம். இந்த changes, React 18-இல் புதிய APIs-க்கு upgrade செய்யும் போது users பழைய APIs-ஐ React 17 mode-இல் தொடர்ந்து பயன்படுத்த அனுமதிக்கின்றன.

#### React DOM Client {/*react-dom-client*/}

இந்த புதிய APIs இப்போது `react-dom/client`-இலிருந்து export செய்யப்படுகின்றன:

* `createRoot`: `render` அல்லது `unmount` செய்ய root உருவாக்கும் புதிய method. `ReactDOM.render` பதிலாக இதைப் பயன்படுத்தவும். React 18-இன் புதிய features இதில்லாமல் வேலை செய்யாது.
* `hydrateRoot`: Server rendered application-ஐ hydrate செய்ய புதிய method. புதிய React DOM Server APIs உடன் சேர்த்து `ReactDOM.hydrate` பதிலாக இதைப் பயன்படுத்தவும். React 18-இன் புதிய features இதில்லாமல் வேலை செய்யாது.

Rendering அல்லது hydration போது React errors-இலிருந்து recover ஆகும்போது logging செய்ய உங்களுக்கு notification வேண்டும் என்றால், `createRoot` மற்றும் `hydrateRoot` இரண்டும் `onRecoverableError` என்ற புதிய option ஏற்கின்றன. Default ஆக, React [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError) பயன்படுத்தும்; older browsers-இல் `console.error` பயன்படுத்தும்.

[React DOM Client docs இங்கே பார்க்கவும்](/reference/react-dom/client).

#### React DOM Server {/*react-dom-server*/}

இந்த புதிய APIs இப்போது `react-dom/server`-இலிருந்து export செய்யப்படுகின்றன; server-இல் streaming Suspense-க்கு full support கொண்டுள்ளன:

* `renderToPipeableStream`: Node environments-இல் streaming-க்கு.
* `renderToReadableStream`: Deno மற்றும் Cloudflare workers போன்ற modern edge runtime environments-க்காக.

Existing `renderToString` method தொடர்ந்து வேலை செய்கிறது; ஆனால் பரிந்துரைக்கப்படவில்லை.

[React DOM Server docs இங்கே பார்க்கவும்](/reference/react-dom/server).

### புதிய Strict Mode behaviors {/*new-strict-mode-behaviors*/}

எதிர்காலத்தில், state preserve செய்தபடி UI-ன் sections-ஐ add மற்றும் remove செய்ய React-க்கு அனுமதிக்கும் feature சேர்க்க விரும்புகிறோம். உதாரணமாக, user ஒரு screen-இலிருந்து tab away செய்து மீண்டும் திரும்பும்போது, React previous screen-ஐ உடனடியாக காட்ட முடியும். இதைச் செய்ய, React முன்பிருந்த அதே component state பயன்படுத்தி trees-ஐ unmount மற்றும் remount செய்யும்.

இந்த feature React apps-க்கு out-of-the-box better performance தரும்; ஆனால் effects பலமுறை mount மற்றும் destroy செய்யப்படுவதற்கு components resilient ஆக இருக்க வேண்டும். பெரும்பாலான effects changes இல்லாமல் வேலை செய்யும்; ஆனால் சில effects ஒருமுறை மட்டுமே mount அல்லது destroy ஆகும் என்று assume செய்கின்றன.

இந்த issues surface செய்ய, React 18 Strict Mode-க்கு புதிய development-only check ஒன்றை அறிமுகப்படுத்துகிறது. ஒரு component முதல் முறையாக mount ஆகும் போதெல்லாம், இந்த புதிய check ஒவ்வொரு component-ஐயும் automatically unmount மற்றும் remount செய்து, இரண்டாவது mount-இல் previous state-ஐ restore செய்யும்.

இந்த change-க்கு முன், React component-ஐ mount செய்து effects உருவாக்கும்:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```


React 18-இல் Strict Mode உடன், React development mode-இல் component-ஐ unmount மற்றும் remount செய்வதை simulate செய்யும்:

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
* React simulates unmounting the component.
  * Layout effects are destroyed.
  * Effects are destroyed.
* React simulates mounting the component with the previous state.
  * Layout effects are created.
  * Effects are created.
```

[Reusable state உறுதி செய்வதற்கான docs இங்கே பார்க்கவும்](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### புதிய Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId` என்பது client மற்றும் server இரண்டிலும் unique IDs generate செய்யும் புதிய Hook; hydration mismatches தவிர்க்கிறது. Unique IDs தேவைப்படும் accessibility APIs உடன் integrate செய்யும் component libraries-க்கு இது முதன்மையாக பயனுள்ளது. இது React 17 மற்றும் அதற்கு கீழே ஏற்கனவே இருந்த issue-ஐ solve செய்கிறது; ஆனால் புதிய streaming server renderer HTML-ஐ out-of-order deliver செய்வதால் React 18-இல் இன்னும் முக்கியமானது. [Docs இங்கே பார்க்கவும்](/reference/react/useId).

> Note
>
> `useId`, [list-இல் keys generate செய்ய](/learn/rendering-lists#where-to-get-your-key) அல்ல. Keys உங்கள் data-இலிருந்து generate செய்யப்பட வேண்டும்.

#### useTransition {/*usetransition*/}

`useTransition` மற்றும் `startTransition` சில state updates urgent அல்ல என்று mark செய்ய அனுமதிக்கின்றன. பிற state updates default ஆக urgent என கருதப்படும். Urgent state updates (உதாரணமாக text input update செய்வது), non-urgent state updates-ஐ (உதாரணமாக search results list render செய்வது) interrupt செய்ய React அனுமதிக்கும். [Docs இங்கே பார்க்கவும்](/reference/react/useTransition).

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` tree-ன் non-urgent பகுதியை re-render செய்வதை defer செய்ய அனுமதிக்கிறது. இது debouncing போலவே, ஆனால் அதனுடன் ஒப்பிடும்போது சில advantages உள்ளது. Fixed time delay இல்லை; first render screen-இல் reflect ஆனவுடன் deferred render முயற்சிக்க React முயலும். Deferred render interruptible; user input-ஐ block செய்யாது. [Docs இங்கே பார்க்கவும்](/reference/react/useDeferredValue).

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` என்பது external stores concurrent reads support செய்ய அனுமதிக்கும் புதிய Hook; store updates synchronous ஆக இருக்க force செய்கிறது. External data sources-க்கு subscriptions implement செய்யும்போது useEffect தேவைப்படுவதை இது நீக்குகிறது; React-க்கு வெளியில் உள்ள state உடன் integrate செய்யும் எந்த library-க்கும் இது பரிந்துரைக்கப்படுகிறது. [Docs இங்கே பார்க்கவும்](/reference/react/useSyncExternalStore).

> Note
>
> `useSyncExternalStore` libraries பயன்படுத்துவதற்காக intended; application code-க்கு அல்ல.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` என்பது render-இல் styles inject செய்வதால் ஏற்படும் performance issues-ஐ CSS-in-JS libraries address செய்ய அனுமதிக்கும் புதிய Hook. நீங்கள் ஏற்கனவே CSS-in-JS library build செய்யவில்லை என்றால் இதை ஒருபோதும் பயன்படுத்த வேண்டியிருக்கும் என்று எதிர்பார்ப்பதில்லை. DOM mutate ஆன பிறகு, ஆனால் layout effects புதிய layout read செய்வதற்கு முன் இந்த Hook run ஆகும். இது React 17 மற்றும் அதற்கு கீழே ஏற்கனவே இருந்த issue ஒன்றை solve செய்கிறது; React 18-இல் இது இன்னும் முக்கியமானது, ஏனெனில் concurrent rendering போது React browser-க்கு yield செய்து layout recalculate செய்ய வாய்ப்பு தருகிறது. [Docs இங்கே பார்க்கவும்](/reference/react/useInsertionEffect).

> Note
>
> `useInsertionEffect` libraries பயன்படுத்துவதற்காக intended; application code-க்கு அல்ல.

## Upgrade செய்வது எப்படி {/*how-to-upgrade*/}

Step-by-step instructions மற்றும் breaking மற்றும் notable changes-ன் முழு பட்டியலுக்கு [React 18-க்கு upgrade செய்வது எப்படி](/blog/2022/03/08/react-18-upgrade-guide)-ஐ பார்க்கவும்.

## Changelog {/*changelog*/}

### React {/*react*/}

* Urgent updates-ஐ transitions-இலிருந்து பிரிக்க `useTransition` மற்றும் `useDeferredValue` சேர்க்கப்பட்டது. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* Unique IDs generate செய்ய `useId` சேர்க்கப்பட்டது. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* External store libraries React உடன் integrate செய்ய உதவ `useSyncExternalStore` சேர்க்கப்பட்டது. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* Pending feedback இல்லாத `useTransition` version ஆக `startTransition` சேர்க்கப்பட்டது. ([#19696](https://github.com/facebook/react/pull/19696)  by [@rickhanlonii](https://github.com/rickhanlonii))
* CSS-in-JS libraries-க்காக `useInsertionEffect` சேர்க்கப்பட்டது. ([#21913](https://github.com/facebook/react/pull/21913)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Content மீண்டும் தோன்றும்போது Suspense layout effects-ஐ remount செய்யும்படி மாற்றப்பட்டது.  ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* Restorable state check செய்ய `<StrictMode>` effects-ஐ re-run செய்யும்படி மாற்றப்பட்டது. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* Symbols எப்போதும் available என்று assume செய்யப்பட்டது. ([#23348](https://github.com/facebook/react/pull/23348)  by [@sebmarkbage](https://github.com/sebmarkbage))
* `object-assign` polyfill remove செய்யப்பட்டது. ([#23351](https://github.com/facebook/react/pull/23351)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Unsupported `unstable_changedBits` API remove செய்யப்பட்டது.  ([#20953](https://github.com/facebook/react/pull/20953)  by [@acdlite](https://github.com/acdlite))
* Components `undefined` render செய்ய அனுமதிக்கப்பட்டது. ([#21869](https://github.com/facebook/react/pull/21869)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Clicks போன்ற discrete events-இலிருந்து வரும் `useEffect` synchronously flush செய்யப்பட்டது. ([#21150](https://github.com/facebook/react/pull/21150)  by [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` இப்போது `null` போலவே behave செய்கிறது; ignore செய்யப்படாது. ([#21854](https://github.com/facebook/react/pull/21854)  by [@rickhanlonii](https://github.com/rickhanlonii))
* அதே component-க்கு resolve ஆகும் எல்லா `lazy()`-யையும் equivalent ஆக கருதப்பட்டது. ([#20357](https://github.com/facebook/react/pull/20357)  by [@sebmarkbage](https://github.com/sebmarkbage))
* First render போது console patch செய்யப்படாது. ([#22308](https://github.com/facebook/react/pull/22308)  by [@lunaruan](https://github.com/lunaruan))
* Memory usage மேம்படுத்தப்பட்டது. ([#21039](https://github.com/facebook/react/pull/21039)  by [@bgirard](https://github.com/bgirard))
* String coercion throw செய்தால் messages மேம்படுத்தப்பட்டது (Temporal.*, Symbol போன்றவை) ([#22064](https://github.com/facebook/react/pull/22064)  by [@justingrant](https://github.com/justingrant))
* Available என்றால் `MessageChannel`-க்கு பதிலாக `setImmediate` பயன்படுத்தப்பட்டது. ([#20834](https://github.com/facebook/react/pull/20834)  by [@gaearon](https://github.com/gaearon))
* Suspended trees உள்ளே context propagate ஆகாத issue fix செய்யப்பட்டது. ([#23095](https://github.com/facebook/react/pull/23095)  by [@gaearon](https://github.com/gaearon))
* Eager bailout mechanism remove செய்வதன் மூலம் `useReducer` incorrect props observe செய்த issue fix செய்யப்பட்டது. ([#22445](https://github.com/facebook/react/pull/22445)  by [@josephsavona](https://github.com/josephsavona))
* Safari-இல் iframes append செய்யும்போது `setState` ignore செய்யப்படும் issue fix செய்யப்பட்டது. ([#23111](https://github.com/facebook/react/pull/23111)  by [@gaearon](https://github.com/gaearon))
* Tree-இல் `ZonedDateTime` render செய்யும்போது crash fix செய்யப்பட்டது. ([#20617](https://github.com/facebook/react/pull/20617)  by [@dimaqq](https://github.com/dimaqq))
* Tests-இல் document `null` ஆக set செய்யப்பட்டால் crash fix செய்யப்பட்டது. ([#22695](https://github.com/facebook/react/pull/22695)  by [@SimenB](https://github.com/SimenB))
* Concurrent features on இருக்கும்போது `onLoad` trigger ஆகாத issue fix செய்யப்பட்டது. ([#23316](https://github.com/facebook/react/pull/23316)  by [@gnoff](https://github.com/gnoff))
* Selector `NaN` return செய்தால் warning fix செய்யப்பட்டது.  ([#23333](https://github.com/facebook/react/pull/23333)  by [@hachibeeDI](https://github.com/hachibeeDI))
* Tests-இல் document `null` ஆக set செய்யப்பட்டால் crash fix செய்யப்பட்டது. ([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* Generated license header fix செய்யப்பட்டது. ([#23004](https://github.com/facebook/react/pull/23004)  by [@vitaliemiron](https://github.com/vitaliemiron))
* Entry points-இல் ஒன்றாக `package.json` சேர்க்கப்பட்டது. ([#22954](https://github.com/facebook/react/pull/22954)  by [@Jack](https://github.com/Jack-Works))
* Suspense boundary வெளியே suspending அனுமதிக்கப்பட்டது. ([#23267](https://github.com/facebook/react/pull/23267)  by [@acdlite](https://github.com/acdlite))
* Hydration fail ஆகும் ஒவ்வொரு முறையும் recoverable error log செய்யப்பட்டது. ([#23319](https://github.com/facebook/react/pull/23319)  by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* `createRoot` மற்றும் `hydrateRoot` சேர்க்கப்பட்டது. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Selective hydration சேர்க்கப்பட்டது. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Known ARIA attributes பட்டியலில் `aria-description` சேர்க்கப்பட்டது. ([#22142](https://github.com/facebook/react/pull/22142)  by [@mahyareb](https://github.com/mahyareb))
* Video elements-க்கு `onResize` event சேர்க்கப்பட்டது. ([#21973](https://github.com/facebook/react/pull/21973)  by [@rileyjshaw](https://github.com/rileyjshaw))
* Known props-க்கு `imageSizes` மற்றும் `imageSrcSet` சேர்க்கப்பட்டது. ([#22550](https://github.com/facebook/react/pull/22550)  by [@eps1lon](https://github.com/eps1lon))
* `value` வழங்கப்பட்டால் non-string `<option>` children அனுமதிக்கப்பட்டது.  ([#21431](https://github.com/facebook/react/pull/21431)  by [@sebmarkbage](https://github.com/sebmarkbage))
* `aspectRatio` style apply ஆகாத issue fix செய்யப்பட்டது. ([#21100](https://github.com/facebook/react/pull/21100)  by [@gaearon](https://github.com/gaearon))
* `renderSubtreeIntoContainer` call செய்யப்பட்டால் warn செய்யப்பட்டது. ([#23355](https://github.com/facebook/react/pull/23355)  by [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* புதிய streaming renderer சேர்க்கப்பட்டது. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* Multiple requests handle செய்யும்போது SSR-இல் context providers fix செய்யப்பட்டது. ([#23171](https://github.com/facebook/react/pull/23171)  by [@frandiox](https://github.com/frandiox))
* Text mismatch ஏற்பட்டால் client render-க்கு revert செய்யப்பட்டது. ([#23354](https://github.com/facebook/react/pull/23354)  by [@acdlite](https://github.com/acdlite))
* `renderToNodeStream` deprecate செய்யப்பட்டது. ([#23359](https://github.com/facebook/react/pull/23359)  by [@sebmarkbage](https://github.com/sebmarkbage))
* புதிய server renderer-இல் spurious error log fix செய்யப்பட்டது. ([#24043](https://github.com/facebook/react/pull/24043)  by [@eps1lon](https://github.com/eps1lon))
* புதிய server renderer-இல் bug fix செய்யப்பட்டது. ([#22617](https://github.com/facebook/react/pull/22617)  by [@shuding](https://github.com/shuding))
* Server-இல் custom elements உள்ளே function மற்றும் symbol values ignore செய்யப்பட்டது. ([#21157](https://github.com/facebook/react/pull/21157)  by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Production-இல் `act` பயன்படுத்தினால் throw செய்யப்பட்டது. ([#21686](https://github.com/facebook/react/pull/21686)  by [@acdlite](https://github.com/acdlite))
* `global.IS_REACT_ACT_ENVIRONMENT` மூலம் spurious act warnings disable செய்வதை support செய்தல். ([#22561](https://github.com/facebook/react/pull/22561)  by [@acdlite](https://github.com/acdlite))
* React work schedule செய்யக்கூடிய எல்லா APIs-ஐ cover செய்ய act warning விரிவாக்கப்பட்டது. ([#22607](https://github.com/facebook/react/pull/22607)  by [@acdlite](https://github.com/acdlite))
* `act` batch updates செய்யும்படி மாற்றப்பட்டது. ([#21797](https://github.com/facebook/react/pull/21797)  by [@acdlite](https://github.com/acdlite))
* Dangling passive effects warning remove செய்யப்பட்டது. ([#22609](https://github.com/facebook/react/pull/22609)  by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Fast Refresh-இல் late-mounted roots track செய்யப்பட்டது. ([#22740](https://github.com/facebook/react/pull/22740)  by [@anc95](https://github.com/anc95))
* `package.json`-க்கு `exports` field சேர்க்கப்பட்டது. ([#23087](https://github.com/facebook/react/pull/23087)  by [@otakustay](https://github.com/otakustay))

### Server Components (Experimental) மாற்றங்கள் {/*server-components-experimental*/}

* Server Context support சேர்க்கப்பட்டது. ([#23244](https://github.com/facebook/react/pull/23244)  by [@salazarm](https://github.com/salazarm))
* `lazy` support சேர்க்கப்பட்டது. ([#24068](https://github.com/facebook/react/pull/24068)  by [@gnoff](https://github.com/gnoff))
* Webpack 5-க்காக webpack plugin update செய்யப்பட்டது ([#22739](https://github.com/facebook/react/pull/22739)  by [@michenly](https://github.com/michenly))
* Node loader-இல் mistake fix செய்யப்பட்டது. ([#22537](https://github.com/facebook/react/pull/22537)  by [@btea](https://github.com/btea))
* Edge environments-க்காக `window` பதிலாக `globalThis` பயன்படுத்தப்பட்டது. ([#22777](https://github.com/facebook/react/pull/22777)  by [@huozhi](https://github.com/huozhi))
