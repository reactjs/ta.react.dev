---
title: "React 19.2"
author: The React Team
date: 2025/10/01
description: React 19.2, Activity, React Performance Tracks, useEffectEvent மற்றும் பல புதிய features சேர்க்கிறது.
---

October 1, 2025 அன்று [React Team](/community/team) எழுதியது

---

<Intro>

React 19.2 இப்போது npm-இல் கிடைக்கிறது!

</Intro>

இது கடந்த ஆண்டில் எங்கள் மூன்றாவது release; டிசம்பரில் React 19 மற்றும் ஜூனில் React 19.1-ஐ தொடர்ந்து வருகிறது. இந்த post-இல், React 19.2-இன் புதிய features பற்றிய overview கொடுத்து, சில notable changes-ஐ highlight செய்கிறோம்.

<InlineToc />

---

## புதிய React features {/*new-react-features*/}

### `<Activity />` {/*activity*/}

`<Activity>` உங்கள் app-ஐ control மற்றும் prioritize செய்யக்கூடிய "activities" ஆகப் பிரிக்க அனுமதிக்கிறது.

உங்கள் app-ன் பகுதிகளை conditionally render செய்வதற்கான alternative ஆக Activity-ஐ பயன்படுத்தலாம்:

```js
// Before
{isVisible && <Page />}

// After
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

React 19.2-இல், Activity இரண்டு modes support செய்கிறது: `visible` மற்றும் `hidden`.

- `hidden`: children-ஐ hide செய்கிறது, effects-ஐ unmount செய்கிறது, மேலும் React-க்கு செய்ய வேறு வேலை எதுவும் இல்லாத வரை அனைத்து updates-ஐ defer செய்கிறது.
- `visible`: children-ஐ show செய்கிறது, effects-ஐ mount செய்கிறது, மேலும் updates normally process செய்ய அனுமதிக்கிறது.

இதன் அர்த்தம்: screen-இல் visible ஆக உள்ள எதனுடைய performance-யையும் பாதிக்காமல், app-ன் hidden பகுதிகளை pre-render செய்து render செய்தபடி வைத்திருக்கலாம்.

User அடுத்ததாக navigate செய்ய வாய்ப்புள்ள app-ன் hidden பகுதிகளை render செய்ய, அல்லது user விட்டு சென்ற பகுதிகளின் state-ஐ save செய்ய Activity பயன்படுத்தலாம். Background-இல் data, css, மற்றும் images load செய்வதால் navigations வேகமாகிறது; மேலும் back navigations input fields போன்ற state-ஐ maintain செய்ய அனுமதிக்கிறது.

எதிர்காலத்தில், வெவ்வேறு use cases-க்காக Activity-க்கு மேலும் modes சேர்க்க திட்டமிட்டுள்ளோம்.

Activity பயன்படுத்தும் examples-க்கு, [Activity docs](/reference/react/Activity)-ஐ பார்க்கவும்.

---

### `useEffectEvent` {/*use-effect-event*/}

`useEffect` உடன் பொதுவான pattern ஒன்று, external system-இலிருந்து வரும் ஒரு வகை "events" பற்றி app code-க்கு notify செய்வது. உதாரணமாக, chat room connect ஆனபோது notification காட்ட விரும்பலாம்:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('இணைக்கப்பட்டது!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

மேலுள்ள code-இல் உள்ள problem: இப்படியான "event" உள்ளே பயன்படுத்தப்படும் எந்த values-லும் change ஏற்பட்டால், அதைச் சுற்றியுள்ள Effect மீண்டும் run ஆகும். உதாரணமாக, `theme` மாறினால் chat room reconnect ஆகும். `roomId` போன்ற Effect logic-க்கு தொடர்புடைய values-க்கு இது அர்த்தமுள்ளதாகும்; ஆனால் `theme`-க்கு அர்த்தமில்லை.

இதைக் solve செய்ய, பெரும்பாலான users lint rule disable செய்து dependency-ஐ exclude செய்கிறார்கள். ஆனால் பின்னர் Effect update செய்ய வேண்டியிருந்தால் dependencies up to date ஆக இருக்க linter உதவ முடியாது; இது bugs-க்கு வழிவகுக்கலாம்.

`useEffectEvent` உடன், இந்த logic-ன் "event" பகுதியை அதை emit செய்யும் Effect-இலிருந்து split செய்யலாம்:

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('இணைக்கப்பட்டது!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ எல்லா dependencies-மும் declared (Effect Events dependencies அல்ல)
  // ...
```

DOM events போலவே, Effect Events எப்போதும் latest props மற்றும் state-ஐ "பார்க்கும்".

**Effect Events dependency array-இல் declare செய்யப்படக்கூடாது**. Linter அவற்றை dependencies ஆக insert செய்ய முயற்சிக்காமல் இருக்க `eslint-plugin-react-hooks@latest`-க்கு upgrade செய்ய வேண்டும். Effect Events "அவற்றின்" Effect இருக்கும் அதே component அல்லது Hook-இல் மட்டுமே declare செய்ய முடியும் என்பதையும் கவனிக்கவும். இந்த restrictions linter மூலம் verify செய்யப்படுகின்றன.

<Note>

#### `useEffectEvent` எப்போது பயன்படுத்த வேண்டும்? {/*when-to-use-useeffectevent*/}

User event-க்கு பதிலாக Effect-இலிருந்து fire ஆகும் conceptually "events" ஆன functions-க்கு `useEffectEvent` பயன்படுத்த வேண்டும் (இதுவே அதை "Effect Event" ஆக்குகிறது). எல்லாவற்றையும் `useEffectEvent`-இல் wrap செய்ய வேண்டியதில்லை; lint error silence செய்ய மட்டும் இதைப் பயன்படுத்தவும் வேண்டாம், ஏனெனில் இது bugs-க்கு வழிவகுக்கலாம்.

Event Effects பற்றி எப்படி சிந்திப்பது என்ற deep dive-க்கு பார்க்கவும்: [Events-ஐ Effects-இலிருந்து பிரித்தல்](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects).

</Note>

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal` [React Server Components](/reference/rsc/server-components) உடன் மட்டுமே பயன்படுத்தப்பட வேண்டும்.

</RSC>

[`cache()`](/reference/react/cache) lifetime முடிந்தது எப்போது என்பதை அறிய `cacheSignal` அனுமதிக்கிறது:

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

Result இனி cache-இல் பயன்படுத்தப்படாதபோது work-ஐ clean up அல்லது abort செய்ய இது அனுமதிக்கிறது, உதாரணமாக:

- React rendering-ஐ வெற்றிகரமாக முடித்துள்ளது
- Render abort செய்யப்பட்டது
- Render fail ஆனது

மேலும் தகவலுக்கு, [`cacheSignal` docs](/reference/react/cacheSignal)-ஐ பார்க்கவும்.

---

### Performance Tracks {/*performance-tracks*/}

உங்கள் React app-ன் performance பற்றி மேலும் தகவல் வழங்க React 19.2, Chrome DevTools performance profiles-க்கு புதிய [custom tracks](https://developer.chrome.com/docs/devtools/performance/extension) set ஒன்றை சேர்க்கிறது:

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

[React Performance Tracks docs](/reference/dev-tools/react-performance-tracks), tracks-இல் உள்ள அனைத்தையும் விளக்குகின்றன; ஆனால் இங்கே high-level overview.

#### Scheduler ⚛ {/*scheduler-*/}

User interactions-க்கான "blocking" அல்லது startTransition உள்ள updates-க்கான "transition" போன்ற வெவ்வேறு priorities-க்கு React என்ன வேலை செய்கிறது என்பதை Scheduler track காட்டுகிறது. ஒவ்வொரு track உள்ளேயும், update schedule செய்த event போன்ற செய்யப்படும் work வகை, அந்த update-க்கான render எப்போது நடந்தது போன்றவை தெரியும்.

ஒரு update வேறு priority-க்காக காத்திருப்பதால் எப்போது blocked ஆகிறது, அல்லது தொடர்வதற்கு முன் React paint-க்காக எப்போது காத்திருக்கிறது போன்ற தகவல்களையும் காட்டுகிறோம். React உங்கள் code-ஐ வெவ்வேறு priorities-ஆக எப்படி split செய்கிறது, மற்றும் work எந்த order-இல் முடிந்தது என்பதைப் புரிந்துகொள்ள Scheduler track உதவும்.

அதில் உள்ள அனைத்தையும் பார்க்க [Scheduler track](/reference/dev-tools/react-performance-tracks#scheduler) docs-ஐ பார்க்கவும்.

#### Components ⚛ {/*components-*/}

React render செய்யவோ effects run செய்யவோ வேலை செய்கிற components tree-ஐ Components track காட்டுகிறது. Children mount ஆகும் போது அல்லது effects mounted ஆகும் போது "Mount" போன்ற labels, அல்லது React வெளியே உள்ள work-க்கு yield செய்வதால் rendering blocked ஆகும்போது "Blocked" போன்ற labels உள்ளே தெரியும்.

Components எப்போது render ஆகின்றன அல்லது effects run செய்கின்றன, அந்த work முடிக்க எவ்வளவு நேரம் எடுக்கிறது என்பதைக் புரிந்துகொண்டு performance problems identify செய்ய Components track உதவும்.

அதில் உள்ள அனைத்தையும் பார்க்க [Components track docs](/reference/dev-tools/react-performance-tracks#components)-ஐ பார்க்கவும்.

---

## புதிய React DOM features {/*new-react-dom-features*/}

### Partial Pre-rendering {/*partial-pre-rendering*/}

19.2-இல், app-ன் ஒரு பகுதியை முன்கூட்டியே pre-render செய்து, பின்னர் rendering resume செய்யும் புதிய capability சேர்க்கிறோம்.

இந்த feature "Partial Pre-rendering" என்று அழைக்கப்படுகிறது; இது உங்கள் app-ன் static பகுதிகளை pre-render செய்து CDN-இலிருந்து serve செய்யவும், பின்னர் dynamic content கொண்டு shell-ஐ fill செய்ய rendering resume செய்யவும் அனுமதிக்கிறது.

பின்னர் resume செய்ய app ஒன்றை pre-render செய்ய, முதலில் `AbortController` உடன் `prerender` call செய்யவும்:

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// Save the postponed state for later
await savePostponedState(postponed);

// Send prelude to client or CDN.
```

பிறகு, `prelude` shell-ஐ client-க்கு return செய்து, பின்னர் SSR stream-க்கு "resume" செய்ய `resume` call செய்யலாம்:

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// Send stream to client.
```

அல்லது SSG-க்கான static HTML பெற resume செய்ய `resumeAndPrerender` call செய்யலாம்:

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Send complete HTML prelude to CDN.
```

மேலும் தகவலுக்கு, புதிய APIs-க்கான docs-ஐ பார்க்கவும்:
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): Web Streams-க்காக.
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream) Node Streams-க்காக.
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) Web Streams-க்காக.
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) Node Streams-க்காக.

மேலும், prerender APIs இப்போது `resume` APIs-க்கு pass செய்ய `postpone` state return செய்கின்றன.

---

## Notable changes {/*notable-changes*/}

### SSR-க்காக Suspense boundaries batch செய்தல் {/*batching-suspense-boundaries-for-ssr*/}

Client-இல் render செய்யப்பட்டதா அல்லது server-side rendering-இலிருந்து stream செய்யப்பட்டதா என்பதைப் பொறுத்து Suspense boundaries வேறுபட்ட முறையில் reveal ஆகும் behavioral bug ஒன்றை fix செய்தோம்.

19.2 முதல், server-rendered Suspense boundaries-ன் reveals-ஐ React சிறிது நேரம் batch செய்யும்; இதனால் அதிக content ஒன்றாக reveal ஆகும், மேலும் client-rendered behavior உடன் align ஆகும்.

<Diagram name="19_2_batching_before" height={162} width={1270} alt="மூன்று sections கொண்ட diagram; ஒவ்வொரு section இடையிலும் arrow transition. முதல் section-இல் faded bars உடன் glimmer loading state காட்டும் page rectangle உள்ளது. இரண்டாவது panel page-ன் top half reveal ஆகி blue-ஆக highlighted காட்டுகிறது. மூன்றாவது panel முழு page reveal ஆகி blue-ஆக highlighted காட்டுகிறது.">

முன்பு, streaming server-side rendering போது, suspense content fallbacks-ஐ உடனடியாக replace செய்தது.

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="மூன்று sections கொண்ட diagram; ஒவ்வொரு section இடையிலும் arrow transition. முதல் section-இல் faded bars உடன் glimmer loading state காட்டும் page rectangle உள்ளது. இரண்டாவது panel அதே page-ஐ காட்டுகிறது. மூன்றாவது panel முழு page reveal ஆகி blue-ஆக highlighted காட்டுகிறது.">

React 19.2-இல், suspense boundaries சிறிது நேரம் batch செய்யப்படுகின்றன; இதனால் அதிக content ஒன்றாக reveal ஆக அனுமதிக்கிறது.

</Diagram>

இந்த fix, SSR போது Suspense-க்காக `<ViewTransition>` support செய்ய apps-ஐ தயார்படுத்துகிறது. அதிக content ஒன்றாக reveal செய்வதால், animations பெரிய content batches-இல் run ஆகலாம்; அருகருகே stream ஆகும் content animations chain ஆகுவதை தவிர்க்கலாம்.

<Note>

Throttling core web vitals மற்றும் search ranking-ஐ பாதிக்காததை உறுதிசெய்ய React heuristics பயன்படுத்துகிறது.

உதாரணமாக, total page load time 2.5s-க்கு அணுகினால் ([LCP](https://web.dev/articles/lcp)-க்கு "good" என கருதப்படும் நேரம்), React batching நிறுத்தி content-ஐ உடனடியாக reveal செய்யும்; இதனால் metric miss ஆகுவதற்கான காரணம் throttling ஆகாது.

</Note>

---

### SSR: Node-இல் Web Streams ஆதரவு {/*ssr-web-streams-support-for-node*/}

React 19.2, Node.js-இல் streaming SSR-க்கு Web Streams support சேர்க்கிறது:
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) இப்போது Node.js-க்கு கிடைக்கிறது
- [`prerender`](/reference/react-dom/static/prerender) இப்போது Node.js-க்கு கிடைக்கிறது

புதிய `resume` APIs-யும்:
- [`resume`](/reference/react-dom/server/resume) Node.js-க்கு கிடைக்கிறது.
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) Node.js-க்கு கிடைக்கிறது.


<Pitfall>

#### Node.js-இல் server-side rendering-க்கு Node Streams-ஐ முன்னுரிமை அளிக்கவும் {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

Node.js environments-இல், Node Streams APIs பயன்படுத்துவதையே நாங்கள் இன்னும் மிகுந்த பரிந்துரைக்கிறோம்:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

ஏனெனில் Node-இல் Node Streams, Web Streams-ஐ விட மிகவும் வேகமாக உள்ளன; மேலும் Web Streams default ஆக compression support செய்யாது. இதனால் users streaming-ன் benefits-ஐ தவறுதலாக இழக்கலாம்.

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

`recommended` preset-இல் default ஆக flat config உடன், புதிய React Compiler powered rules-க்கு opt-in உடன் `eslint-plugin-react-hooks@latest`-யையும் publish செய்துள்ளோம்.

Legacy config-ஐ தொடர்ந்து பயன்படுத்த, `recommended-legacy`-க்கு மாற்றலாம்:

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

Compiler enabled rules-ன் முழு பட்டியலுக்கு, [linter docs](/reference/eslint-plugin-react-hooks#recommended)-ஐ பார்க்கவும்.

முழு changes பட்டியலுக்கு `eslint-plugin-react-hooks` [changelog](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610)-ஐ பார்க்கவும்.

---

### Default `useId` prefix-ஐ update செய்தல் {/*update-the-default-useid-prefix*/}

19.2-இல், default `useId` prefix-ஐ `:r:` (19.0.0) அல்லது `«r»` (19.1.0)-இலிருந்து `_r_` ஆக update செய்கிறோம்.

CSS selectors-க்கு valid அல்லாத special character பயன்படுத்திய original intent: users எழுதிய IDs உடன் collide ஆக வாய்ப்பு குறைவாக இருக்கும் என்பதே. ஆனால் View Transitions support செய்ய, `useId` generate செய்யும் IDs, `view-transition-name` மற்றும் XML 1.0 names-க்கு valid ஆக இருப்பதை உறுதிசெய்ய வேண்டும்.

---

## Changelog {/*changelog*/}

பிற notable changes
- `react-dom`: Hoistable styles-இல் nonce பயன்படுத்த அனுமதி [#32461](https://github.com/facebook/react/pull/32461)
- `react-dom`: React owned node-ஐ Container ஆக பயன்படுத்தும் போது அதில் text content இருந்தால் warn செய்யுதல் [#32774](https://github.com/facebook/react/pull/32774)

Notable bug fixes
- `react`: Context-ஐ "SomeContext.Provider" பதிலாக "SomeContext" ஆக stringify செய்தல் [#33507](https://github.com/facebook/react/pull/33507)
- `react`: Popstate event-இல் infinite useDeferredValue loop fix [#32821](https://github.com/facebook/react/pull/32821)
- `react`: useDeferredValue-க்கு initial value pass செய்யும்போது இருந்த bug fix [#34376](https://github.com/facebook/react/pull/34376)
- `react`: Client Actions உடன் forms submit செய்யும்போது crash fix [#33055](https://github.com/facebook/react/pull/33055)
- `react`: Dehydrated suspense boundaries resuspend ஆனால் அவற்றின் content-ஐ hide/unhide செய்தல் [#32900](https://github.com/facebook/react/pull/32900)
- `react`: Hot Reload போது wide trees-இல் stack overflow தவிர்த்தல் [#34145](https://github.com/facebook/react/pull/34145)
- `react`: பல இடங்களில் component stacks மேம்படுத்தல் [#33629](https://github.com/facebook/react/pull/33629), [#33724](https://github.com/facebook/react/pull/33724), [#32735](https://github.com/facebook/react/pull/32735), [#33723](https://github.com/facebook/react/pull/33723)
- `react`: React.lazy-ed Component உள்ளே React.use உடன் இருந்த bug fix [#33941](https://github.com/facebook/react/pull/33941)
- `react-dom`: ARIA 1.3 attributes பயன்படுத்தும்போது warning நிறுத்துதல் [#34264](https://github.com/facebook/react/pull/34264)
- `react-dom`: Suspense fallbacks உள்ளே deeply nested Suspense உடன் இருந்த bug fix [#33467](https://github.com/facebook/react/pull/33467)
- `react-dom`: Rendering போது abort செய்த பிறகு suspending ஆகும்போது hanging தவிர்த்தல் [#34192](https://github.com/facebook/react/pull/34192)

முழு changes பட்டியலுக்கு, [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md)-ஐ பார்க்கவும்.


---

_இந்த post-ஐ [எழுதிய](https://www.youtube.com/shorts/T9X3YkgZRG0) [Ricky Hanlon](https://bsky.app/profile/ricky.fm)-க்கும், இந்த post-ஐ review செய்த [Dan Abramov](https://bsky.app/profile/danabra.mov), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me), மற்றும் [Joe Savona](https://x.com/en_JS)-க்கும் நன்றி._
