---
title: cache
---

<RSC>

`cache` [React Server Components](/reference/rsc/server-components) உடன் மட்டுமே பயன்படுத்தப்பட வேண்டும்.

</RSC>

<Intro>

Data fetch அல்லது computation-ன் result-ஐ cache செய்ய `cache` உதவுகிறது.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `cache(fn)` {/*cache*/}

Caching கொண்ட function version ஒன்றை உருவாக்க, எந்த components-க்கும் வெளியே `cache` call செய்யவும்.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

`getMetrics` முதல் முறையாக `data` உடன் call செய்யப்படும்போது, `getMetrics` `calculateMetrics(data)`-ஐ call செய்து result-ஐ cache-இல் store செய்யும். அதே `data` உடன் `getMetrics` மீண்டும் call செய்யப்பட்டால், `calculateMetrics(data)`-ஐ மீண்டும் call செய்வதற்கு பதிலாக cached result-ஐ return செய்யும்.

[மேலும் examples-ஐ கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

- `fn`: Results cache செய்ய வேண்டிய function. `fn` எந்த arguments-யும் எடுக்கலாம், எந்த value-யும் return செய்யலாம்.

#### Returns {/*returns*/}

`cache`, அதே type signature உடன் `fn`-ன் cached version-ஐ return செய்கிறது. இந்த process-இல் அது `fn`-ஐ call செய்யாது.

கொடுக்கப்பட்ட arguments உடன் `cachedFn` call செய்யும்போது, முதலில் cached result cache-இல் உள்ளதா என்று check செய்கிறது. Cached result இருந்தால், result-ஐ return செய்கிறது. இல்லையெனில், arguments உடன் `fn`-ஐ call செய்து, result-ஐ cache-இல் store செய்து, result-ஐ return செய்கிறது. Cache miss இருந்தால் மட்டுமே `fn` call செய்யப்படும்.

<Note>

Inputs அடிப்படையில் return values cache செய்வதற்கான optimization [_memoization_](https://en.wikipedia.org/wiki/Memoization) என்று அறியப்படுகிறது. `cache` return செய்யும் function-ஐ memoized function என்று குறிப்பிடுகிறோம்.

</Note>

#### கவனிக்க வேண்டியவை {/*caveats*/}

- ஒவ்வொரு server request-க்கும் அனைத்து memoized functions-க்கான cache-ஐ React invalidate செய்யும்.
- `cache`-க்கு ஒவ்வொரு call-உம் புதிய function உருவாக்கும். அதாவது அதே function உடன் `cache`-ஐ பல முறை call செய்தால், ஒரே cache-ஐ share செய்யாத வேறு memoized functions return ஆகும்.
- `cachedFn` errors-ஐயும் cache செய்யும். சில arguments-க்கு `fn` error throw செய்தால், அது cached ஆகி, அதே arguments உடன் `cachedFn` call செய்யும்போது அதே error மீண்டும் throw செய்யப்படும்.
- `cache` [Server Components](/reference/rsc/server-components)-இல் மட்டுமே பயன்படுத்தப்பட வேண்டும்.

---

## பயன்பாடு {/*usage*/}

### செலவான computation ஒன்றை cache செய்தல் {/*cache-expensive-computation*/}

Duplicate work தவிர்க்க `cache` பயன்படுத்தவும்.

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

அதே `user` object `Profile` மற்றும் `TeamReport` இரண்டிலும் rendered ஆனால், இரண்டு components வேலை share செய்து அந்த `user`-க்காக `calculateUserMetrics`-ஐ ஒருமுறை மட்டுமே call செய்யலாம்.

`Profile` முதலில் rendered ஆகிறது என்று நினைத்துக் கொள்ளுங்கள். அது <CodeStep step={1}>`getUserMetrics`</CodeStep>-ஐ call செய்து cached result உள்ளதா என்று check செய்யும். அந்த `user` உடன் `getUserMetrics` call செய்யப்படுவது இதுவே முதல் முறை என்பதால் cache miss இருக்கும். பின்னர் `getUserMetrics` அந்த `user` உடன் `calculateUserMetrics`-ஐ call செய்து result-ஐ cache-க்கு write செய்யும்.

`TeamReport` அதன் `users` list-ஐ render செய்து அதே `user` object-ஐ அடையும் போது, அது <CodeStep step={2}>`getUserMetrics`</CodeStep>-ஐ call செய்து cache-இலிருந்து result-ஐ படிக்கும்.

[`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) pass செய்வதன் மூலம் `calculateUserMetrics` abort செய்யக்கூடியதாக இருந்தால், React rendering முடித்துவிட்டபின் செலவான computation-ஐ cancel செய்ய [`cacheSignal()`](/reference/react/cacheSignal) பயன்படுத்தலாம். `calculateUserMetrics` ஏற்கனவே `cacheSignal`-ஐ நேரடியாகப் பயன்படுத்தி cancellation-ஐ internally handle செய்திருக்கலாம்.

<Pitfall>

##### வேறு memoized functions-ஐ call செய்தால் வேறு caches-இலிருந்து படிக்கும். {/*pitfall-different-memoized-functions*/}

அதே cache-ஐ access செய்ய, components அதே memoized function-ஐ call செய்ய வேண்டும்.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

மேலுள்ள example-இல், <CodeStep step={2}>`Precipitation`</CodeStep> மற்றும் <CodeStep step={1}>`Temperature`</CodeStep> இரண்டும் தங்களுக்கே உரிய cache look-up கொண்ட புதிய memoized function உருவாக்க `cache` call செய்கின்றன. இரண்டு components-உம் அதே `cityData`-க்காக render ஆனால், `calculateWeekReport` call செய்ய duplicate work செய்வார்கள்.

மேலும், component render ஆகும் ஒவ்வொரு முறையும் `Temperature` <CodeStep step={1}>புதிய memoized function</CodeStep> உருவாக்குகிறது; இதனால் cache sharing சாத்தியமில்லை.

Cache hits அதிகரிக்கவும் வேலை குறைக்கவும், இரண்டு components அதே cache-ஐ access செய்ய அதே memoized function-ஐ call செய்ய வேண்டும். அதற்கு, components முழுவதும் [`import` செய்யக்கூடிய](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) dedicated module ஒன்றில் memoized function-ஐ define செய்யவும்.

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

இங்கே, இரண்டு components-உம் `./getWeekReport.js`-இலிருந்து exported ஆகும் <CodeStep step={3}>அதே memoized function</CodeStep>-ஐ call செய்து அதே cache-இல் read மற்றும் write செய்கின்றன.

</Pitfall>

### Data snapshot ஒன்றை share செய்தல் {/*take-and-share-snapshot-of-data*/}

Components இடையே data snapshot ஒன்றை share செய்ய, `fetch` போன்ற data-fetching function உடன் `cache` call செய்யவும். பல components அதே data fetch செய்தால், ஒரு request மட்டும் செய்யப்படும்; return ஆன data cached ஆகி components முழுவதும் shared ஆகும். Server render முழுவதும் அனைத்து components-உம் அதே data snapshot-ஐ refer செய்கின்றன.

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
  return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}

async function MinimalWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

`AnimatedWeatherCard` மற்றும் `MinimalWeatherCard` இரண்டும் அதே <CodeStep step={1}>city</CodeStep>-க்காக render ஆனால், <CodeStep step={2}>memoized function</CodeStep>-இலிருந்து அதே data snapshot-ஐ பெறும்.

`AnimatedWeatherCard` மற்றும் `MinimalWeatherCard` வேறு <CodeStep step={1}>city</CodeStep> arguments-ஐ <CodeStep step={2}>`getTemperature`</CodeStep>-க்கு வழங்கினால், `fetchTemperature` இரண்டு முறை call செய்யப்படும்; ஒவ்வொரு call site-உம் வேறு data பெறும்.

<CodeStep step={1}>city</CodeStep> cache key ஆக செயல்படுகிறது.

<Note>

<CodeStep step={3}>Asynchronous rendering</CodeStep> Server Components-க்கு மட்டுமே supported.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
  const temperature = await getTemperature(city);
  // ...
}
```

Asynchronous data பயன்படுத்தும் components-ஐ Client Components-இல் render செய்ய, [`use()` documentation](/reference/react/use)-ஐ பார்க்கவும்.

</Note>

### Data-ஐ preload செய்தல் {/*preload-data*/}

நேரம் எடுக்கும் data fetch ஒன்றை cache செய்வதன் மூலம், component render ஆகும்முன் asynchronous work-ஐ தொடங்கலாம்.

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
});

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

`Page` render ஆகும்போது, component <CodeStep step={1}>`getUser`</CodeStep>-ஐ call செய்கிறது; ஆனால் return ஆன data-வை அது பயன்படுத்தவில்லை என்பதை கவனிக்கவும். இந்த early <CodeStep step={1}>`getUser`</CodeStep> call, `Page` மற்ற computational work செய்து children render செய்யும் போது நடக்கும் asynchronous database query-ஐ தொடங்குகிறது.

`Profile` render ஆகும்போது, நாம் <CodeStep step={2}>`getUser`</CodeStep>-ஐ மீண்டும் call செய்கிறோம். Initial <CodeStep step={1}>`getUser`</CodeStep> call ஏற்கனவே return செய்து user data-வை cache செய்திருந்தால், `Profile` <CodeStep step={2}>இந்த data-வை கேட்டு காத்திருக்கும்போது</CodeStep>, மற்றொரு remote procedure call தேவைப்படாமல் cache-இலிருந்து நேரடியாகப் படிக்க முடியும். <CodeStep step={1}>Initial data request</CodeStep> இன்னும் முடிவடையவில்லை என்றால், இந்த pattern-இல் data preload செய்வது data-fetching delay-ஐ குறைக்கும்.

<DeepDive>

#### Asynchronous work-ஐ cache செய்தல் {/*caching-asynchronous-work*/}

[Asynchronous function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ஒன்றை evaluate செய்யும்போது, அந்த work-க்கான [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) கிடைக்கும். Promise அந்த work-ன் state-ஐ (_pending_, _fulfilled_, _failed_) மற்றும் இறுதியில் settle ஆன result-ஐ வைத்திருக்கும்.

இந்த example-இல், asynchronous function <CodeStep step={1}>`fetchData`</CodeStep> `fetch`-ஐ await செய்யும் promise ஒன்றை return செய்கிறது.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work
  await getData();
  // ...
}
```

முதல் முறையாக <CodeStep step={2}>`getData`</CodeStep> call செய்யும்போது, <CodeStep step={1}>`fetchData`</CodeStep> return செய்த promise cached ஆகிறது. பின்னர் வரும் look-ups அதே promise-ஐ return செய்யும்.

முதல் <CodeStep step={2}>`getData`</CodeStep> call `await` செய்யவில்லை; ஆனால் <CodeStep step={3}>இரண்டாவது</CodeStep> call செய்கிறது என்பதை கவனிக்கவும். [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) என்பது promise-ன் settled result-ஐ காத்திருந்து return செய்யும் JavaScript operator. முதல் <CodeStep step={2}>`getData`</CodeStep> call, இரண்டாவது <CodeStep step={3}>`getData`</CodeStep> look-up செய்ய promise cache ஆகும் வகையில் `fetch`-ஐ தொடங்குவதற்கே செய்கிறது.

<CodeStep step={3}>இரண்டாவது call</CodeStep> நேரத்தில் promise இன்னும் _pending_ ஆக இருந்தால், `await` result-க்காக pause செய்யும். Optimization என்னவென்றால், `fetch` காத்திருக்கும் போது React computational work தொடர முடியும்; இதனால் <CodeStep step={3}>இரண்டாவது call</CodeStep>-க்கான wait time குறையும்.

Promise ஏற்கனவே error ஆகவோ _fulfilled_ result ஆகவோ settled ஆக இருந்தால், `await` அந்த value-ஐ உடனடியாக return செய்யும். இரண்டு outcomes-இலும் performance benefit உள்ளது.

</DeepDive>

<Pitfall>

##### Component-க்கு வெளியே memoized function call செய்தால் cache பயன்படுத்தப்படாது. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

Component-இல் உள்ள memoized function-க்கு மட்டுமே React cache access வழங்குகிறது. Component-க்கு வெளியே <CodeStep step={1}>`getUser`</CodeStep> call செய்தால், அது function-ஐ evaluate செய்தாலும் cache-ஐ படிக்கவோ update செய்யவோ செய்யாது.

இதற்குக் காரணம் cache access [context](/learn/passing-data-deeply-with-context) மூலம் வழங்கப்படுகிறது; அது component-இலிருந்தே accessible.

</Pitfall>

<DeepDive>

#### `cache`, [`memo`](/reference/react/memo), அல்லது [`useMemo`](/reference/react/useMemo) எப்போது பயன்படுத்த வேண்டும்? {/*cache-memo-usememo*/}

குறிப்பிடப்பட்ட அனைத்து APIs-உம் memoization வழங்குகின்றன; ஆனால் வேறுபாடு, அவை எதை memoize செய்ய நோக்கமுடையவை, cache-ஐ யார் access செய்ய முடியும், அவற்றின் cache எப்போது invalidated ஆகிறது என்பதில் உள்ளது.

#### `useMemo` {/*deep-dive-use-memo*/}

பொதுவாக, Client Component-இல் renders முழுவதும் செலவான computation ஒன்றை cache செய்ய [`useMemo`](/reference/react/useMemo) பயன்படுத்த வேண்டும். உதாரணமாக, component-க்குள் data transformation ஒன்றை memoize செய்ய.

```jsx {expectedErrors: {'react-compiler': [4]}} {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```

இந்த example-இல், `App` அதே record உடன் இரண்டு `WeatherReport`-களை render செய்கிறது. இரண்டு components-உம் அதே வேலை செய்தாலும், அவை work share செய்ய முடியாது. `useMemo`-ன் cache component-க்கு local மட்டுமே.

ஆனால் `App` re-render ஆகி `record` object மாறவில்லை என்றால், ஒவ்வொரு component instance-உம் work skip செய்து `avgTemp`-ன் memoized value-ஐப் பயன்படுத்தும் என்பதை `useMemo` உறுதிசெய்கிறது. கொடுக்கப்பட்ட dependencies உடன் `avgTemp`-ன் கடைசி computation-ஐ மட்டுமே `useMemo` cache செய்யும்.

#### `cache` {/*deep-dive-cache*/}

பொதுவாக, components முழுவதும் share செய்யக்கூடிய work-ஐ memoize செய்ய Server Components-இல் `cache` பயன்படுத்த வேண்டும்.

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```

முந்தைய example-ஐ `cache` பயன்படுத்தி மீண்டும் எழுதினால், இந்த case-இல் <CodeStep step={3}>`WeatherReport`-ன் இரண்டாவது instance</CodeStep>, duplicate work-ஐ skip செய்து <CodeStep step={1}>முதல் `WeatherReport`</CodeStep> போல அதே cache-இலிருந்து read செய்ய முடியும். முந்தைய example-இலிருந்து இன்னொரு வேறுபாடு: computations-க்கு மட்டுமே பயன்படுத்தப்பட வேண்டிய `useMemo`-வுக்கு மாறாக, <CodeStep step={2}>data fetches-ஐ memoize செய்யவும்</CodeStep> `cache` பரிந்துரைக்கப்படுகிறது.

தற்போது, `cache` Server Components-இல் மட்டுமே பயன்படுத்தப்பட வேண்டும்; cache server requests முழுவதும் invalidated ஆகும்.

#### `memo` {/*deep-dive-memo*/}

Props மாறாதபோது component re-render ஆகாமல் தடுக்க [`memo`](/reference/react/memo) பயன்படுத்த வேண்டும்.

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record);
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

இந்த example-இல், இரண்டு `MemoWeatherReport` components-உம் முதலில் render ஆகும்போது `calculateAvg` call செய்யும். ஆனால் `record` மாறாமல் `App` re-render ஆனால், props எதுவும் மாறவில்லை; ஆகவே `MemoWeatherReport` re-render ஆகாது.

`useMemo`-வுடன் ஒப்பிடும்போது, `memo` குறிப்பிட்ட computations-ஐ விட props அடிப்படையில் component render-ஐ memoize செய்கிறது. `useMemo` போலவே, memoized component கடைசி prop values உடன் கடைசி render-ஐ மட்டுமே cache செய்கிறது. Props மாறியவுடன், cache invalidate ஆகி component re-render ஆகும்.

</DeepDive>

---

## Troubleshooting {/*troubleshooting*/}

### அதே arguments உடன் call செய்திருந்தாலும் என் memoized function இன்னும் run ஆகிறது {/*memoized-function-still-runs*/}

முன்பு குறிப்பிடப்பட்ட pitfalls-ஐ பார்க்கவும்:
* [வேறு memoized functions-ஐ call செய்தால் வேறு caches-இலிருந்து படிக்கும்.](#pitfall-different-memoized-functions)
* [Component-க்கு வெளியே memoized function call செய்தால் cache பயன்படுத்தப்படாது.](#pitfall-memoized-call-outside-component)

மேலுள்ளவை எதுவும் பொருந்தாவிட்டால், cache-இல் ஏதாவது இருக்கிறதா என்று React check செய்வது எப்படி என்பதில் சிக்கல் இருக்கலாம்.

உங்கள் arguments [primitives](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) அல்லாவிட்டால் (எ.கா. objects, functions, arrays), அதே object reference pass செய்கிறீர்கள் என்பதை உறுதிசெய்யவும்.

Memoized function call செய்யும்போது, result ஏற்கனவே cached ஆக உள்ளதா என்று பார்க்க React input arguments-ஐ look up செய்யும். Cache hit உள்ளதா என்பதை தீர்மானிக்க React arguments-ன் shallow equality-ஐ பயன்படுத்தும்.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

இந்த case-இல், இரண்டு `MapMarker`-களும் அதே வேலை செய்கிறதுபோல், `{x: 10, y: 10, z:10}` என்ற அதே value உடன் `calculateNorm` call செய்கிறதுபோல் தெரியும். Objects அதே values கொண்டிருந்தாலும், ஒவ்வொரு component-உம் தனது சொந்த `props` object உருவாக்குவதால் அவை அதே object reference அல்ல.

Cache hit உள்ளதா என்பதை verify செய்ய React input மீது [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) call செய்யும்.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

இதைக் கையாள ஒரு வழி, vector dimensions-ஐ `calculateNorm`-க்கு pass செய்வதாக இருக்கலாம். இது வேலை செய்கிறது, ஏனெனில் dimensions தாமே primitives.

மற்றொரு solution, vector object-ஐ component-க்கு prop ஆக pass செய்வதாக இருக்கலாம். இரண்டு component instances-க்கும் அதே object-ஐ pass செய்ய வேண்டும்.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```
