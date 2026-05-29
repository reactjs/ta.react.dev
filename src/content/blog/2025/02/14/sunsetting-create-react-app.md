---
title: "Create React App-ஐ sunsetting செய்தல்"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: இன்று, புதிய apps-க்காக Create React App-ஐ deprecate செய்கிறோம்; existing apps framework-க்கு migrate செய்யவோ, Vite, Parcel, அல்லது RSBuild போன்ற build tool-க்கு migrate செய்யவோ ஊக்குவிக்கிறோம். Framework உங்கள் project-க்கு சரியான fit அல்லாதபோது, நீங்கள் உங்கள் சொந்த framework உருவாக்க விரும்பும்போது, அல்லது React app ஒன்றை scratch-இலிருந்து build செய்து React எப்படி வேலை செய்கிறது என்பதை கற்க விரும்பும்போது உதவும் docs-யையும் வழங்குகிறோம்.
---

February 14, 2025 அன்று [Matt Carroll](https://twitter.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm) எழுதியது

---

<Intro>

இன்று, புதிய apps-க்காக [Create React App](https://create-react-app.dev/)-ஐ deprecate செய்கிறோம்; existing apps ஒரு [framework](#how-to-migrate-to-a-framework)-க்கு migrate செய்யவோ, Vite, Parcel, அல்லது RSBuild போன்ற [build tool-க்கு migrate செய்யவோ](#how-to-migrate-to-a-build-tool) ஊக்குவிக்கிறோம்.

Framework உங்கள் project-க்கு சரியான fit அல்லாதபோது, நீங்கள் உங்கள் சொந்த framework உருவாக்க விரும்பும்போது, அல்லது [React app ஒன்றை scratch-இலிருந்து build செய்து](/learn/build-a-react-app-from-scratch) React எப்படி வேலை செய்கிறது என்பதை கற்க விரும்பும்போது உதவும் docs-யையும் வழங்குகிறோம்.

</Intro>

-----

2016-இல் Create React App-ஐ release செய்தபோது, புதிய React app ஒன்றை build செய்ய தெளிவான வழி இல்லை.

React app உருவாக்க, JSX, linting, மற்றும் hot reloading போன்ற basic features support செய்ய பல tools install செய்து, அவற்றை நீங்களே wire up செய்ய வேண்டியிருந்தது. இதை சரியாக செய்வது மிகவும் tricky; அதனால் [community](https://github.com/react-boilerplate/react-boilerplate) [பொதுவான](https://github.com/gaearon/react-hot-boilerplate) [setups-க்காக](https://github.com/erikras/react-redux-universal-hot-example) [boilerplates](https://github.com/petehunt/react-boilerplate) [உருவாக்கியது](https://github.com/kriasoft/react-starter-kit). ஆனால் boilerplates update செய்ய கடினமாக இருந்தன; fragmentation காரணமாக React புதிய features release செய்வதும் கடினமானது.

Create React App, பல tools-ஐ ஒரே recommended configuration-ஆக இணைப்பதன் மூலம் இந்த பிரச்சினைகளை தீர்த்தது. இதனால் apps புதிய tooling features-க்கு நேரடியாக upgrade செய்ய முடிந்தது; மேலும் React team, non-trivial tooling changes (Fast Refresh support, React Hooks lint rules) மிகப் பரந்த audience-க்கு deploy செய்ய முடிந்தது.

இந்த model இவ்வளவு பிரபலமானதால், இன்று இதே முறையில் வேலை செய்யும் முழு tools category ஒன்று உள்ளது.

## Create React App-ஐ deprecate செய்தல் {/*deprecating-create-react-app*/}

Create React App தொடங்க வசதியாக்கினாலும், high performant production apps build செய்வதை கடினமாக்கும் [பல limitations](#limitations-of-build-tools) உள்ளன. கொள்கை ரீதியாக, இதை [framework](#why-we-recommend-frameworks)-ஆக evolve செய்வதன் மூலம் இந்த பிரச்சினைகளை தீர்க்கலாம்.

ஆனால் Create React App-க்கு தற்போது active maintainers இல்லை; மேலும் இந்த பிரச்சினைகளை ஏற்கனவே தீர்க்கும் பல existing frameworks உள்ளன. எனவே Create React App-ஐ deprecate செய்ய தீர்மானித்துள்ளோம்.

இன்று முதல், நீங்கள் புதிய app install செய்தால், deprecation warning பார்க்கிறீர்கள்:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app is deprecated.
{'\n\n'}
You can find a list of up-to-date React frameworks on react.dev
For more info see: react.dev/link/cra
{'\n\n'}
This error message will only be shown once per install.

</ConsoleLogLine>
</ConsoleBlockMulti>

Create React App [website](https://create-react-app.dev/) மற்றும் GitHub [repo](https://github.com/facebook/create-react-app)-விலும் deprecation notice சேர்த்துள்ளோம். Create React App maintenance mode-இல் தொடர்ந்து வேலை செய்யும்; மேலும் React 19 உடன் வேலை செய்ய Create React App-ன் புதிய version ஒன்றை publish செய்துள்ளோம்.

## Framework-க்கு migrate செய்வது எப்படி {/*how-to-migrate-to-a-framework*/}
புதிய React apps-ஐ [framework உடன் உருவாக்க](/learn/creating-a-react-app) பரிந்துரைக்கிறோம். நாங்கள் பரிந்துரைக்கும் அனைத்து frameworks-யும் client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)) மற்றும் single-page apps ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA))-ஐ support செய்கின்றன; server இல்லாமல் CDN அல்லது static hosting service-க்கு deploy செய்யலாம்.

Existing apps-க்கு, client-only SPA-க்கு migrate செய்ய இந்த guides உதவும்:

* [Next.js-ன் Create React App migration guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [React Router-ன் framework adoption guide](https://reactrouter.com/upgrading/component-routes).
* [Expo webpack-இலிருந்து Expo Router-க்கு migration guide](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## Build tool-க்கு migrate செய்வது எப்படி {/*how-to-migrate-to-a-build-tool*/}

உங்கள் app-க்கு unusual constraints இருந்தால், அல்லது இந்த பிரச்சினைகளை உங்கள் சொந்த framework build செய்வதன் மூலம் solve செய்ய விரும்பினால், அல்லது React scratch-இலிருந்து எப்படி வேலை செய்கிறது என்பதை கற்கவே விரும்பினால், Vite, Parcel அல்லது Rsbuild பயன்படுத்தி React உடன் உங்கள் சொந்த custom setup உருவாக்கலாம்.

Existing apps-க்கு, build tool-க்கு migrate செய்ய இந்த guides உதவும்:

* [Vite Create React App migration guide](https://www.robinwieruch.de/vite-create-react-app/)
* [Parcel Create React App migration guide](https://parceljs.org/migration/cra/)
* [Rsbuild Create React App migration guide](https://rsbuild.dev/guide/migration/cra)

Vite, Parcel அல்லது Rsbuild உடன் தொடங்க உதவ, [React App ஒன்றை Scratch-இலிருந்து Build செய்தல்](/learn/build-a-react-app-from-scratch) என்ற புதிய docs சேர்த்துள்ளோம்.

<DeepDive>

#### எனக்கு framework தேவையா? {/*do-i-need-a-framework*/}

பெரும்பாலான apps framework-ன் பயனைப் பெறும்; ஆனால் React app ஒன்றை scratch-இலிருந்து build செய்யும் valid cases உள்ளன. நல்ல thumb rule: உங்கள் app-க்கு routing தேவைப்பட்டால், framework உங்களுக்கு பயனாக இருக்கும்.

Svelte-க்கு Sveltekit, Vue-க்கு Nuxt, Solid-க்கு SolidStart இருப்பது போல, data-fetching மற்றும் code-splitting போன்ற features-இல் routing-ஐ out of the box முழுமையாக integrate செய்யும் [framework பயன்படுத்த React பரிந்துரைக்கிறது](#why-we-recommend-frameworks). இது உங்கள் சொந்த complex configurations எழுத வேண்டிய சிரமத்தையும், உண்மையில் framework ஒன்றை நீங்களே build செய்ய வேண்டிய நிலையும் தவிர்க்கிறது.

ஆனால் Vite, Parcel, அல்லது Rsbuild போன்ற build tool பயன்படுத்தி நீங்கள் எப்போதும் [React app ஒன்றை scratch-இலிருந்து build செய்யலாம்](/learn/build-a-react-app-from-scratch).

</DeepDive>

[Build tools-ன் limitations](#limitations-of-build-tools) மற்றும் [ஏன் frameworks பரிந்துரைக்கிறோம்](#why-we-recommend-frameworks) என்பதை மேலும் அறிய தொடர்ந்து படிக்கவும்.

## Build tools-ன் limitations {/*limitations-of-build-tools*/}

Create React App மற்றும் அதுபோன்ற build tools, React app build செய்ய தொடங்குவதை உதவுகின்றன. `npx create-react-app my-app` run செய்த பிறகு, development server, linting, மற்றும் production build உடன் fully configured React app கிடைக்கும்.

உதாரணமாக, நீங்கள் internal admin tool build செய்தால், landing page ஒன்றிலிருந்து தொடங்கலாம்:

```js
export default function App() {
  return (
    <div>
      <h1>Admin Tool-க்கு வரவேற்கிறோம்!</h1>
    </div>
  )
}
```

இதனால் JSX, default linting rules, மற்றும் development மற்றும் production இரண்டிலும் run செய்ய bundler போன்ற features உடன் React-இல் உடனடியாக coding தொடங்கலாம். ஆனால் real production app build செய்ய தேவையான tools இந்த setup-இல் இல்லை.

பெரும்பாலான production apps routing, data fetching, மற்றும் code splitting போன்ற problems-க்கு solutions தேவைப்படும்.

### Routing {/*routing*/}

Create React App குறிப்பிட்ட routing solution ஒன்றை include செய்யாது. நீங்கள் இப்போது தொடங்குகிறீர்கள் என்றால், routes இடையே switch செய்ய `useState` பயன்படுத்துவது ஒரு option. ஆனால் இதைச் செய்தால், உங்கள் app-க்கு links share செய்ய முடியாது - ஒவ்வொரு link-யும் அதே page-க்கு செல்லும் - மேலும் காலப்போக்கில் app structure கடினமாகிறது:

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ Routing in state does not create URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

இதனால் தான் Create React App பயன்படுத்தும் பெரும்பாலான apps, [React Router](https://reactrouter.com/) அல்லது [Tanstack Router](https://tanstack.com/router/latest) போன்ற routing library சேர்த்து routing solve செய்கின்றன. Routing library உடன், app-க்கு கூடுதல் routes சேர்க்கலாம்; இது உங்கள் app structure பற்றி opinions வழங்குகிறது, மேலும் routes-க்கு links share செய்ய தொடங்க அனுமதிக்கிறது. உதாரணமாக, React Router உடன் routes define செய்யலாம்:

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Each route has it's own URL
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

இந்த change-இன் மூலம், `/dashboard`-க்கு link share செய்யலாம்; app dashboard page-க்கு navigate செய்யும். Routing library கிடைத்த பிறகு, nested routes, route guards, மற்றும் route transitions போன்ற கூடுதல் features சேர்க்கலாம்; routing library இல்லாமல் அவற்றை implement செய்வது கடினம்.

இங்கே ஒரு tradeoff உள்ளது: routing library app-க்கு complexity சேர்க்கிறது; அதே சமயம் அது இல்லாமல் implement செய்ய கடினமான features-யையும் சேர்க்கிறது.

### Data fetching {/*data-fetching*/}

Create React App-இல் இன்னொரு பொதுவான problem data fetching. Create React App குறிப்பிட்ட data fetching solution ஒன்றை include செய்யாது. நீங்கள் தொடங்குகிறீர்கள் என்றால், data load செய்ய effect-இல் `fetch` பயன்படுத்துவது பொதுவான option.

ஆனால் இதைச் செய்தால், component render ஆன பிறகே data fetch செய்யப்படும்; இதனால் network waterfalls ஏற்படலாம். உங்கள் app render ஆகும்போது data fetch செய்வதால், code download ஆகும் நேரத்திலேயே parallel-ஆக fetch செய்யாமல் network waterfalls உருவாகின்றன:

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Fetching data in a component causes network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Effect-இல் fetching செய்வதால், data முன்பே fetch செய்ய முடிந்திருந்தாலும், user content பார்க்க இன்னும் நீண்ட நேரம் காத்திருக்க வேண்டும். இதை solve செய்ய, [TanStack Query](https://tanstack.com/query/), [SWR](https://swr.vercel.app/), [Apollo](https://www.apollographql.com/docs/react), அல்லது [Relay](https://relay.dev/) போன்ற data fetching library பயன்படுத்தலாம்; இவை component render ஆகும்முன் request தொடங்க data prefetch செய்யும் options வழங்குகின்றன.

Route level-இல் data dependencies specify செய்ய உங்கள் routing "loader" pattern உடன் integrate செய்யும்போது இந்த libraries சிறப்பாக வேலை செய்கின்றன; இதனால் router உங்கள் data fetches-ஐ optimize செய்ய முடியும்:

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Fetching data in parallel while the code is downloading
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Initial load-இல், route render ஆகும்முன் router data-வை உடனடியாக fetch செய்ய முடியும். User app-இல் navigate செய்யும்போது, router data மற்றும் route இரண்டையும் ஒரே நேரத்தில் fetch செய்து fetches-ஐ parallelize செய்ய முடியும். இதனால் screen-இல் content காணும் நேரம் குறைகிறது; user experience மேம்படலாம்.

ஆனால் இதற்கு உங்கள் app-இல் loaders சரியாக configure செய்ய வேண்டும்; performance-க்காக complexity tradeoff செய்யப்படுகிறது.

### Code splitting {/*code-splitting*/}

Create React App-இல் இன்னொரு பொதுவான problem [code splitting](https://www.patterns.dev/vanilla/bundle-splitting). Create React App குறிப்பிட்ட code splitting solution ஒன்றை include செய்யாது. நீங்கள் இப்போது தொடங்குகிறீர்கள் என்றால், code splitting பற்றி யோசிக்கவோமல் இருக்கலாம்.

இதனால் உங்கள் app ஒரே bundle ஆக ship செய்யப்படும்:

```txt
- bundle.js    75kb
```

ஆனால் ideal performance-க்கு, உங்கள் code-ஐ தனித்தனியான bundles-ஆக "split" செய்ய வேண்டும்; இதனால் user-க்கு தேவைப்படுவது மட்டுமே download செய்ய வேண்டும். அவர்கள் இருக்கும் page பார்க்க தேவையான code மட்டுமே download செய்வதால், app load ஆக user காத்திருக்கும் நேரம் குறையும்.

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

Code-splitting செய்வதற்கான ஒரு வழி `React.lazy`. ஆனால் இதனால் component render ஆகும் வரை code fetch செய்யப்படாது; network waterfalls ஏற்படலாம். இன்னும் optimal solution, code download ஆகும் நேரத்திலேயே code-ஐ parallel-ஆக fetch செய்யும் router feature பயன்படுத்துவது. உதாரணமாக, route code split செய்யப்பட வேண்டும் என்றும் அது load ஆகும் நேரத்தை optimize செய்ய வேண்டும் என்றும் குறிப்பிட React Router `lazy` option வழங்குகிறது:

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Routes are downloaded before rendering
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

Optimized code-splitting சரியாக செய்வது tricky; user-க்கு தேவையானதைவிட அதிக code download செய்யும் mistakes செய்வது சாத்தியம். Caching maximize செய்ய, fetches parallelize செய்ய, மற்றும் ["import on interaction"](https://www.patterns.dev/vanilla/import-on-interaction) patterns support செய்ய, router மற்றும் data loading solutions உடன் integrate ஆனபோது இது சிறப்பாக வேலை செய்கிறது.

### மேலும்... {/*and-more*/}

இவை Create React App-ன் limitations-இன் சில examples மட்டுமே.

Routing, data-fetching, மற்றும் code splitting integrate செய்த பிறகு, pending states, navigation interruptions, user-க்கு error messages, மற்றும் data revalidation ஆகியவற்றையும் consider செய்ய வேண்டும். Users solve செய்ய வேண்டிய முழு categories உள்ளன:

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>Accessibility</li>
    <li>Asset loading</li>
    <li>Authentication</li>
    <li>Caching</li>
  </ul>
  <ul>
    <li>Error handling</li>
    <li>Mutating data</li>
    <li>Navigations</li>
    <li>Optimistic updates</li>
  </ul>
  <ul>
    <li>Progressive enhancement</li>
    <li>Server-side rendering</li>
    <li>Static site generation</li>
    <li>Streaming</li>
  </ul>
</div>

இவை அனைத்தும் சேர்ந்து மிகவும் optimal [loading sequence](https://www.patterns.dev/vanilla/loading-sequence)-ஐ உருவாக்குகின்றன.

Create React App-இல் இந்த பிரச்சினைகள் ஒவ்வொன்றையும் தனித்தனியாக solve செய்வது கடினமாக இருக்கலாம்; ஏனெனில் ஒவ்வொரு problem-மும் மற்றவற்றுடன் interconnected ஆக உள்ளது, மேலும் users-க்கு அறிமுகம் இல்லாத problem areas-இல் deep expertise தேவைப்படலாம். இந்த பிரச்சினைகளை solve செய்ய, users Create React App மேல் தங்கள் சொந்த bespoke solutions build செய்ய வேண்டிய நிலை ஏற்படுகிறது; இதுவே Create React App ஆரம்பத்தில் solve செய்ய முயன்ற problem.

## ஏன் frameworks பரிந்துரைக்கிறோம் {/*why-we-recommend-frameworks*/}

Create React App, Vite, அல்லது Parcel போன்ற build tool-இல் இந்த எல்லா pieces-ஐயும் நீங்கள் solve செய்ய முடியும்; ஆனால் அதை நன்றாக செய்வது கடினம். Create React App பல build tools-ஐ ஒன்றாக integrate செய்தது போலவே, users-க்கு சிறந்த experience வழங்க இந்த features அனைத்தையும் ஒன்றாக integrate செய்யும் tool தேவை.

Build tools, rendering, routing, data fetching, மற்றும் code splitting-ஐ integrate செய்யும் இந்த tools category "frameworks" என அழைக்கப்படுகிறது - அல்லது React-ஐயே framework என்று அழைக்க விரும்பினால், இவற்றை "metaframeworks" என்று அழைக்கலாம்.

Build tools, tooling-ஐ மேம்படுத்த சில opinions impose செய்வதைப் போலவே, frameworks மிகச் சிறந்த user experience வழங்க உங்கள் app-ஐ structure செய்வது பற்றி சில opinions impose செய்கின்றன. இதனால் தான் புதிய projects-க்கு [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/), மற்றும் [Expo](https://expo.dev/) போன்ற frameworks-ஐ பரிந்துரைக்கத் தொடங்கினோம்.

Frameworks, Create React App போலவே getting started experience வழங்குகின்றன; ஆனால் real production apps-இல் users எப்படியும் solve செய்ய வேண்டிய problems-க்கும் solutions வழங்குகின்றன.

<DeepDive>

#### Server rendering விருப்பத் தேர்வு {/*server-rendering-is-optional*/}

நாங்கள் பரிந்துரைக்கும் frameworks அனைத்தும் [client-side rendered (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR) app உருவாக்கும் option வழங்குகின்றன.

சில cases-இல் CSR ஒரு page-க்கு சரியான தேர்வு; ஆனால் பல நேரங்களில் அது சரியானது அல்ல. உங்கள் app-ன் பெரும்பாலான பகுதி client-side ஆக இருந்தாலும், [static-site generation (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) அல்லது [server-side rendering (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR) போன்ற server rendering features-இன் பயன் பெறக்கூடிய individual pages அடிக்கடி இருக்கும்; உதாரணமாக Terms of Service page அல்லது documentation.

Server rendering பொதுவாக client-க்கு குறைவான JavaScript மற்றும் முழு HTML document அனுப்புகிறது; இது [Total Blocking Time (TBD)](https://web.dev/articles/tbt)-ஐ குறைப்பதன் மூலம் வேகமான [First Contentful Paint (FCP)](https://web.dev/articles/fcp) உருவாக்கும்; இது [Interaction to Next Paint (INP)](https://web.dev/articles/inp)-ஐயும் குறைக்க முடியும். இதனால் தான் [Chrome team](https://web.dev/articles/rendering-on-the-web), சிறந்த possible performance பெற full client-side approach-க்கு பதிலாக static அல்லது server-side render-ஐ consider செய்ய developers-ஐ ஊக்குவித்துள்ளது.

Server பயன்படுத்துவதில் tradeoffs உள்ளன; அது ஒவ்வொரு page-க்கும் எப்போதும் சிறந்த option அல்ல. Server-இல் pages generate செய்வது கூடுதல் cost ஏற்படுத்துகிறது மற்றும் generate செய்ய நேரம் எடுக்கும்; இது [Time to First Byte (TTFB)](https://web.dev/articles/ttfb)-ஐ அதிகரிக்கலாம். மிகச்சிறந்த performance கொண்ட apps, ஒவ்வொரு strategy-யின் tradeoffs அடிப்படையில் page-by-page சரியான rendering strategy-ஐ தேர்ந்தெடுக்க முடியும்.

Frameworks நீங்கள் விரும்பினால் எந்த page-இலும் server பயன்படுத்தும் option வழங்குகின்றன; ஆனால் server பயன்படுத்த உங்களை force செய்யாது. இதனால் உங்கள் app-ன் ஒவ்வொரு page-க்கும் சரியான rendering strategy தேர்வு செய்ய முடியும்.

#### Server Components பற்றி என்ன? {/*server-components*/}

நாங்கள் பரிந்துரைக்கும் frameworks, React Server Components support-யும் கொண்டுள்ளன.

Server Components, routing மற்றும் data fetching-ஐ server-க்கு நகர்த்துவதன் மூலம் இந்த பிரச்சினைகளை solve செய்ய உதவுகின்றன; மேலும் rendered route மட்டும் அடிப்படையாக அல்லாமல், நீங்கள் render செய்யும் data அடிப்படையில் client components-க்கு code splitting செய்ய அனுமதிக்கின்றன. சிறந்த possible [loading sequence](https://www.patterns.dev/vanilla/loading-sequence)-க்காக ship செய்யப்படும் JavaScript அளவையும் குறைக்கின்றன.

Server Components-க்கு server அவசியமில்லை. Static-site generated app (SSG) உருவாக்க build time-இல் உங்கள் CI server-இல் run செய்யலாம்; server-side rendered (SSR) app-க்காக runtime-இல் web server-இல் run செய்யலாம்.

மேலும் தகவலுக்கு [Introducing zero-bundle size React Server Components](/blog/2020/12/21/data-fetching-with-react-server-components) மற்றும் [docs](/reference/rsc/server-components)-ஐ பார்க்கவும்.

</DeepDive>

<Note>

#### Server rendering SEO-க்காக மட்டும் அல்ல {/*server-rendering-is-not-just-for-seo*/}

பொதுவான misunderstanding ஒன்று: server rendering [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO)-க்காக மட்டுமே என்பது.

Server rendering SEO-ஐ மேம்படுத்தலாம்; அதே சமயம் user screen-இல் content பார்க்கும்முன் download மற்றும் parse செய்ய வேண்டிய JavaScript அளவை குறைப்பதால் performance-யையும் மேம்படுத்துகிறது.

இதனால் தான் சிறந்த possible performance பெற, full client-side approach-க்கு பதிலாக static அல்லது server-side render consider செய்ய [Chrome team](https://web.dev/articles/rendering-on-the-web) developers-ஐ ஊக்குவித்துள்ளது.

</Note>

---

_Create React App-ஐ உருவாக்கிய [Dan Abramov](https://bsky.app/profile/danabra.mov)-க்கும், பல ஆண்டுகளாக Create React App-ஐ maintain செய்த [Joe Haddad](https://github.com/Timer), [Ian Schmitz](https://github.com/ianschmitz), [Brody McKee](https://github.com/mrmckeb), மற்றும் [பலருக்கும்](https://github.com/facebook/create-react-app/graphs/contributors) நன்றி. இந்த post-ஐ review செய்து feedback வழங்கிய [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Devon Govett](https://bsky.app/profile/devongovett.bsky.social), [Eli White](https://x.com/Eli_White), [Jack Herrington](https://bsky.app/profile/jherr.dev), [Joe Savona](https://x.com/en_JS), [Lauren Tan](https://bsky.app/profile/no.lol), [Lee Robinson](https://x.com/leeerob), [Mark Erikson](https://bsky.app/profile/acemarke.dev), [Ryan Florence](https://x.com/ryanflorence), [Sophie Alpert](https://bsky.app/profile/sophiebits.com), [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com), மற்றும் [Theo Browne](https://x.com/theo)-க்கும் நன்றி._
