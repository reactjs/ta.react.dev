---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 இப்போது npm-இல் கிடைக்கிறது! இந்த post-இல், React 19-இன் புதிய features மற்றும் அவற்றை நீங்கள் எப்படி adopt செய்யலாம் என்பதற்கான overview-ஐ தருகிறோம்.
---

December 05, 2024 அன்று [The React Team](/community/team)

---
<Note>

### React 19 இப்போது stable! {/*react-19-is-now-stable*/}

இந்த post ஏப்ரலில் React 19 RC உடன் முதலில் பகிரப்பட்ட பிறகு சேர்க்கப்பட்டவை:

- **Suspended trees-க்கான pre-warming**: [Improvements to Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense)-ஐ பார்க்கவும்.
- **React DOM static APIs**: [New React DOM Static APIs](#new-react-dom-static-apis)-ஐ பார்க்கவும்.

_Stable release date-ஐ பிரதிபலிக்க இந்த post-ன் date update செய்யப்பட்டுள்ளது._

</Note>

<Intro>

React v19 இப்போது npm-இல் கிடைக்கிறது!

</Intro>

எங்கள் [React 19 Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)-இல், உங்கள் app-ஐ React 19-க்கு upgrade செய்வதற்கான step-by-step instructions-ஐ பகிர்ந்தோம். இந்த post-இல், React 19-இன் புதிய features மற்றும் அவற்றை நீங்கள் எப்படி adopt செய்யலாம் என்பதற்கான overview-ஐ தருகிறோம்.

- [React 19-இல் புதியவை](#whats-new-in-react-19)
- [React 19-இல் improvements](#improvements-in-react-19)
- [Upgrade செய்வது எப்படி](#how-to-upgrade)

Breaking changes list-க்கு [Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)-ஐ பார்க்கவும்.

---

## React 19-இல் புதியவை {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

React apps-இல் பொதுவான use case ஒன்று data mutation செய்து, அதன் response-க்கு ஏற்ப state update செய்வது. உதாரணமாக, user தன் பெயரை மாற்ற form submit செய்தால், நீங்கள் API request செய்து, பின்னர் response-ஐ handle செய்வீர்கள். முன்பு pending states, errors, optimistic updates, மற்றும் sequential requests-ஐ கைமுறையாக handle செய்ய வேண்டியிருந்தது.

உதாரணமாக, pending மற்றும் error state-ஐ `useState`-இல் handle செய்யலாம்:

```js
// Before Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update செய்
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19-இல், pending states, errors, forms, மற்றும் optimistic updates-ஐ தானாக handle செய்ய transitions-இல் async functions பயன்படுத்த support சேர்க்கிறோம்.

உதாரணமாக, pending state-ஐ உங்களுக்காக handle செய்ய `useTransition` பயன்படுத்தலாம்:

```js
// Using pending state from Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update செய்
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

Async transition உடனடியாக `isPending` state-ஐ true ஆக set செய்து, async request(s)-ஐ செய்து, எந்த transitions முடிந்த பிறகும் `isPending`-ஐ false ஆக மாற்றும். Data மாறிக்கொண்டிருக்கும்போது current UI responsive மற்றும் interactive ஆக இருக்க இது அனுமதிக்கிறது.

<Note>

#### Convention படி, async transitions பயன்படுத்தும் functions "Actions" என்று அழைக்கப்படுகின்றன. {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actions data submit செய்வதை உங்களுக்காக தானாக manage செய்கின்றன:

- **Pending state**: Actions request தொடக்கத்தில் ஆரம்பித்து இறுதி state update committed ஆனதும் தானாக reset ஆகும் pending state-ஐ வழங்குகின்றன.
- **Optimistic updates**: Requests submit ஆகிக்கொண்டிருக்கும்போது users-க்கு உடனடி feedback காட்ட புதிய [`useOptimistic`](#new-hook-optimistic-updates) hook-ஐ Actions support செய்கின்றன.
- **Error handling**: Request தோல்வியடைந்தால் Error Boundaries display செய்யவும், optimistic updates-ஐ தானாக அவற்றின் original value-க்கு revert செய்யவும் Actions error handling வழங்குகின்றன.
- **Forms**: `<form>` elements இப்போது `action` மற்றும் `formAction` props-க்கு functions pass செய்வதை support செய்கின்றன. `action` props-க்கு functions pass செய்வது default ஆக Actions-ஐப் பயன்படுத்தி submission-க்கு பிறகு form-ஐ தானாக reset செய்கிறது.

</Note>

Actions-ன் மேல் கட்டியமைத்து, optimistic updates manage செய்ய React 19 [`useOptimistic`](#new-hook-optimistic-updates)-ஐ அறிமுகப்படுத்துகிறது, மேலும் Actions-க்கான common cases handle செய்ய புதிய hook [`React.useActionState`](#new-hook-useactionstate)-ஐ வழங்குகிறது. `react-dom`-இல் forms-ஐ தானாக manage செய்ய [`<form>` Actions](#form-actions) மற்றும் forms-இல் Actions-க்கான common cases support செய்ய [`useFormStatus`](#new-hook-useformstatus)-ஐ சேர்க்கிறோம்.

React 19-இல், மேலுள்ள example இதுபோல் simplify செய்யலாம்:

```js
// Using <form> Actions and useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update செய்</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

அடுத்த section-இல், React 19-இல் உள்ள ஒவ்வொரு புதிய Action feature-ஐயும் பிரித்து பார்ப்போம்.

### புதிய hook: `useActionState` {/*new-hook-useactionstate*/}

Actions-க்கான common cases-ஐ மேம்படுத்த, `useActionState` எனும் புதிய hook ஒன்றை சேர்த்துள்ளோம்:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // You can return any result of the action.
      // Here, we return only the error.
      return error;
    }

    // handle success
    return null;
  },
  null,
);
```

`useActionState` ஒரு function-ஐ ("Action") ஏற்று, call செய்ய wrapped Action-ஐ return செய்கிறது. இது வேலை செய்வதற்கான காரணம் Actions compose ஆகும். Wrapped Action call செய்யப்படும்போது, `useActionState` Action-ன் கடைசி result-ஐ `data` ஆகவும், Action-ன் pending state-ஐ `pending` ஆகவும் return செய்யும்.

<Note>

`React.useActionState` Canary releases-இல் முன்பு `ReactDOM.useFormState` என்று அழைக்கப்பட்டது; அதை rename செய்து `useFormState`-ஐ deprecated செய்துள்ளோம்.

மேலும் தகவலுக்கு [#28491](https://github.com/facebook/react/pull/28491)-ஐ பார்க்கவும்.

</Note>

மேலும் தகவலுக்கு [`useActionState`](/reference/react/useActionState) docs-ஐ பார்க்கவும்.

### React DOM: `<form>` Actions {/*form-actions*/}

Actions, `react-dom`-க்கான React 19-ன் புதிய `<form>` features-உடனும் integrated ஆகின்றன. Actions மூலம் forms-ஐ தானாக submit செய்ய, `<form>`, `<input>`, மற்றும் `<button>` elements-ன் `action` மற்றும் `formAction` props ஆக functions pass செய்ய support சேர்த்துள்ளோம்:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

ஒரு `<form>` Action வெற்றி பெற்றால், uncontrolled components-க்காக React form-ஐ தானாக reset செய்யும். `<form>`-ஐ கைமுறையாக reset செய்ய வேண்டுமெனில், புதிய `requestFormReset` React DOM API-ஐ call செய்யலாம்.

மேலும் தகவலுக்கு [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input), மற்றும் `<button>` பற்றிய `react-dom` docs-ஐ பார்க்கவும்.

### React DOM: புதிய hook: `useFormStatus` {/*new-hook-useformstatus*/}

Design systems-இல், props-ஐ component-க்கு கீழே drilling செய்யாமல், அவை உள்ள `<form>` பற்றிய தகவலுக்கு access தேவைப்படும் design components எழுதுவது பொதுவானது. இதை Context மூலம் செய்யலாம்; ஆனால் common case-ஐ மேம்படுத்த, `useFormStatus` எனும் புதிய hook சேர்த்துள்ளோம்:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

Parent `<form>` ஒரு Context provider போல இருந்தால் எப்படி status read செய்வீர்களோ, `useFormStatus` அப்படியே அதன் status-ஐ read செய்கிறது.

மேலும் தகவலுக்கு [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) பற்றிய `react-dom` docs-ஐ பார்க்கவும்.

### புதிய hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

Data mutation செய்யும்போது மற்றொரு பொதுவான UI pattern, async request நடந்து கொண்டிருக்கும்போது final state-ஐ optimistically காட்டுவது. இதை மேம்படுத்த React 19-இல் `useOptimistic` எனும் புதிய hook சேர்க்கிறோம்:

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>உங்கள் பெயர்: {optimisticName}</p>
      <p>
        <label>பெயரை மாற்று:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

`updateName` request progress-இல் இருக்கும்போது `useOptimistic` hook உடனடியாக `optimisticName`-ஐ render செய்யும். Update முடிந்ததும் அல்லது error ஏற்பட்டதும், React தானாக `currentName` value-க்கு திரும்பும்.

மேலும் தகவலுக்கு [`useOptimistic`](/reference/react/useOptimistic) docs-ஐ பார்க்கவும்.

### புதிய API: `use` {/*new-feature-use*/}

React 19-இல் render போது resources read செய்ய புதிய API ஒன்றை அறிமுகப்படுத்துகிறோம்: `use`.

உதாரணமாக, `use` மூலம் promise ஒன்றை read செய்யலாம்; promise resolve ஆகும் வரை React Suspend செய்யும்:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // When `use` suspends in Comments,
  // this Suspense boundary will be shown.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### Render-இல் உருவாக்கப்பட்ட promises-ஐ `use` support செய்யாது. {/*use-does-not-support-promises-created-in-render*/}

Render-இல் உருவாக்கப்பட்ட promise-ஐ `use`-க்கு pass செய்ய முயன்றால், React warning தரும்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

Fix செய்ய, promises-க்கு caching support செய்யும் Suspense-powered library அல்லது framework-இலிருந்து promise ஒன்றை pass செய்ய வேண்டும். எதிர்காலத்தில் render-இல் promises cache செய்வதை மேம்படுத்த features ship செய்ய திட்டமிடுகிறோம்.

</Note>

Early returns-க்கு பிறகு போன்ற cases-இல் Context-ஐ conditionally read செய்ய அனுமதிக்கும் வகையில், `use` மூலம் context-ஐயும் read செய்யலாம்:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }

  // This would not work with useContext
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

`use` API hooks போல render-இல் மட்டுமே call செய்ய முடியும். Hooks-க்கு மாறாக, `use` conditionally call செய்ய முடியும். எதிர்காலத்தில் `use` மூலம் render-இல் resources consume செய்ய இன்னும் பல வழிகளை support செய்ய திட்டமிடுகிறோம்.

மேலும் தகவலுக்கு [`use`](/reference/react/use) docs-ஐ பார்க்கவும்.

## புதிய React DOM Static APIs {/*new-react-dom-static-apis*/}

Static site generation-க்காக `react-dom/static`-க்கு இரண்டு புதிய APIs சேர்த்துள்ளோம்:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Static HTML generation-க்காக data load ஆக காத்திருப்பதன் மூலம், இந்த புதிய APIs `renderToString`-ஐ மேம்படுத்துகின்றன. Node.js Streams மற்றும் Web Streams போன்ற streaming environments-உடன் வேலை செய்ய அவை வடிவமைக்கப்பட்டுள்ளன. உதாரணமாக, Web Stream environment-இல், `prerender` மூலம் React tree-ஐ static HTML ஆக prerender செய்யலாம்:

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Prerender APIs static HTML stream return செய்வதற்கு முன் அனைத்து data-வும் load ஆக காத்திருக்கும். Streams strings-ஆக convert செய்யப்படலாம், அல்லது streaming response-உடன் அனுப்பப்படலாம். Existing [React DOM server rendering APIs](/reference/react-dom/server) support செய்யும் போல content load ஆகும்போது streaming செய்வதை இவை support செய்யாது.

மேலும் தகவலுக்கு [React DOM Static APIs](/reference/react-dom/static)-ஐ பார்க்கவும்.

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components என்பது bundling-க்கு முன், உங்கள் client application அல்லது SSR server-இலிருந்து தனியான environment-இல் components-ஐ ahead of time render செய்ய அனுமதிக்கும் புதிய option. இந்த தனி environment தான் React Server Components-இல் உள்ள "server". Server Components உங்கள் CI server-இல் build time-இல் ஒருமுறை run ஆகலாம், அல்லது web server பயன்படுத்தி ஒவ்வொரு request-க்கும் run செய்யலாம்.

Canary channel-இலிருந்து included செய்யப்பட்ட React Server Components features அனைத்தும் React 19-இல் உள்ளன. இதன் பொருள், Server Components உடன் ship செய்யும் libraries, [Full-stack React Architecture](/learn/creating-a-react-app#which-features-make-up-the-react-teams-full-stack-architecture-vision)-ஐ support செய்யும் frameworks-இல் பயன்படுத்த `react-server` [export condition](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) உடன் React 19-ஐ peer dependency ஆக target செய்யலாம்.


<Note>

#### Server Components-க்கு support எப்படி build செய்வது? {/*how-do-i-build-support-for-server-components*/}

React 19-இல் React Server Components stable ஆக உள்ளன; minor versions இடையே அவை break ஆகாது. ஆனால் React Server Components bundler அல்லது framework implement செய்ய பயன்படுத்தப்படும் underlying APIs semver-ஐ follow செய்யாது; React 19.x-இல் minors இடையே break ஆகலாம்.

Bundler அல்லது framework ஆக React Server Components support செய்ய, குறிப்பிட்ட React version-க்கு pin செய்யவோ, Canary release பயன்படுத்தவோ பரிந்துரைக்கிறோம். React Server Components implement செய்ய பயன்படுத்தப்படும் APIs-ஐ எதிர்காலத்தில் stabilize செய்ய bundlers மற்றும் frameworks-உடன் தொடர்ந்து வேலை செய்வோம்.

</Note>


மேலும் அறிய [React Server Components](/reference/rsc/server-components) docs-ஐ பார்க்கவும்.

### Server Actions {/*server-actions*/}

Server Actions, server-இல் execute செய்யப்படும் async functions-ஐ Client Components call செய்ய அனுமதிக்கின்றன.

`"use server"` directive உடன் Server Action define செய்யப்பட்டால், உங்கள் framework server function-க்கு reference ஒன்றை தானாக உருவாக்கி, அந்த reference-ஐ Client Component-க்கு pass செய்யும். அந்த function client-இல் call செய்யப்படும்போது, function execute செய்ய React server-க்கு request அனுப்பி result-ஐ return செய்யும்.

<Note>

#### Server Components-க்கு directive இல்லை. {/*there-is-no-directive-for-server-components*/}

ஒரு பொதுவான தவறான புரிதல் Server Components `"use server"` மூலம் குறிக்கப்படுகின்றன என்பதாகும்; ஆனால் Server Components-க்கு directive இல்லை. `"use server"` directive Server Actions-க்காக பயன்படுத்தப்படுகிறது.

மேலும் தகவலுக்கு [Directives](/reference/rsc/directives) docs-ஐ பார்க்கவும்.

</Note>

Server Actions Server Components-இல் உருவாக்கப்பட்டு Client Components-க்கு props ஆக pass செய்யப்படலாம், அல்லது Client Components-இல் import செய்து பயன்படுத்தப்படலாம்.

மேலும் அறிய [React Server Actions](/reference/rsc/server-actions) docs-ஐ பார்க்கவும்.

## React 19-இல் improvements {/*improvements-in-react-19*/}

### Prop ஆக `ref` {/*ref-as-a-prop*/}

React 19 முதல், function components-க்காக `ref`-ஐ prop ஆக access செய்யலாம்:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

புதிய function components-க்கு இனி `forwardRef` தேவைப்படாது; புதிய `ref` prop-ஐப் பயன்படுத்த உங்கள் components-ஐ தானாக update செய்ய codemod வெளியிடுவோம். Future versions-இல் `forwardRef`-ஐ deprecate செய்து remove செய்வோம்.

<Note>

Classes-க்கு pass செய்யப்படும் `ref`s props ஆக pass செய்யப்படாது, ஏனெனில் அவை component instance-ஐ reference செய்கின்றன.

</Note>

### Hydration errors-க்கான diffs {/*diffs-for-hydration-errors*/}

`react-dom`-இல் hydration errors-க்கான error reporting-ஐயும் மேம்படுத்தினோம். உதாரணமாக, mismatch பற்றிய எந்த தகவலும் இல்லாமல் DEV-இல் பல errors log செய்வதற்கு பதிலாக:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

இப்போது mismatch-ன் diff உடன் ஒரு message மட்டும் log செய்கிறோம்:


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### Provider ஆக `<Context>` {/*context-as-a-provider*/}

React 19-இல், `<Context.Provider>`-க்கு பதிலாக `<Context>`-ஐ provider ஆக render செய்யலாம்:


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );
}
```

புதிய Context providers `<Context>`-ஐ பயன்படுத்தலாம்; existing providers-ஐ convert செய்ய codemod வெளியிடுவோம். Future versions-இல் `<Context.Provider>`-ஐ deprecate செய்வோம்.

### Refs-க்கான cleanup functions {/*cleanup-functions-for-refs*/}

`ref` callbacks-இலிருந்து cleanup function return செய்வதை இப்போது support செய்கிறோம்:

```js {7-9}
<input
  ref={(ref) => {
    // ref created

    // NEW: return a cleanup function to reset
    // the ref when element is removed from DOM.
    return () => {
      // ref cleanup
    };
  }}
/>
```

Component unmount ஆகும்போது, `ref` callback-இலிருந்து return செய்யப்பட்ட cleanup function-ஐ React call செய்யும். இது DOM refs, class components-க்கான refs, மற்றும் `useImperativeHandle`-க்கு வேலை செய்கிறது.

<Note>

முன்பு, component unmount ஆகும்போது React `ref` functions-ஐ `null` உடன் call செய்தது. உங்கள் `ref` cleanup function return செய்தால், React இப்போது இந்த step-ஐ skip செய்யும்.

Future versions-இல், components unmount ஆகும்போது refs-ஐ `null` உடன் call செய்வதை deprecate செய்வோம்.

</Note>

Ref cleanup functions அறிமுகப்படுத்தப்பட்டதால், `ref` callback-இலிருந்து வேறு எதையும் return செய்வது இப்போது TypeScript-ஆல் rejected செய்யப்படும். Fix பொதுவாக implicit returns பயன்படுத்துவதை நிறுத்துவது; உதாரணமாக:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

Original code `HTMLDivElement`-ன் instance-ஐ return செய்தது; இது cleanup function ஆக இருக்க வேண்டுமா, அல்லது cleanup function return செய்ய விரும்பவில்லையா என்பதை TypeScript அறிய முடியாது.

இந்த pattern-ஐ [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return) மூலம் codemod செய்யலாம்.

### `useDeferredValue` initial value {/*use-deferred-value-initial-value*/}

`useDeferredValue`-க்கு `initialValue` option ஒன்றை சேர்த்துள்ளோம்:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');

  return (
    <Results query={value} />
  );
}
```

<CodeStep step={2}>initialValue</CodeStep> வழங்கப்பட்டால், component-ன் initial render-க்கு `useDeferredValue` அதை `value` ஆக return செய்யும்; பின்னணியில் <CodeStep step={1}>deferredValue</CodeStep> returned ஆகும் re-render-ஐ schedule செய்யும்.

மேலும் அறிய [`useDeferredValue`](/reference/react/useDeferredValue)-ஐ பார்க்கவும்.

### Document Metadata-க்கு support {/*support-for-metadata-tags*/}

HTML-இல், `<title>`, `<link>`, மற்றும் `<meta>` போன்ற document metadata tags document-ன் `<head>` section-இல் வைக்க reserved செய்யப்பட்டவை. React-இல், app-க்கு பொருத்தமான metadata என்ன என்பதை முடிவு செய்யும் component, நீங்கள் `<head>` render செய்யும் இடத்திலிருந்து மிகவும் தொலைவில் இருக்கலாம்; அல்லது React `<head>`-ஐ முற்றிலும் render செய்யாமல் இருக்கலாம். முன்பு, இந்த elements effect ஒன்றில் கைமுறையாக insert செய்யப்பட வேண்டும், அல்லது [`react-helmet`](https://github.com/nfl/react-helmet) போன்ற libraries மூலம் செய்யப்பட வேண்டும்; React application-ஐ server render செய்யும்போது கவனமாக handle செய்ய வேண்டியது அவசியம்.

React 19-இல், components-இல் document metadata tags-ஐ natively render செய்ய support சேர்க்கிறோம்:

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

React இந்த component-ஐ render செய்யும்போது, `<title>` `<link>` மற்றும் `<meta>` tags-ஐ பார்த்து, அவற்றை document-ன் `<head>` section-க்கு தானாக hoist செய்யும். இந்த metadata tags-ஐ natively support செய்வதால், client-only apps, streaming SSR, மற்றும் Server Components உடன் அவை வேலை செய்வதை உறுதி செய்ய முடிகிறது.

<Note>

#### உங்களுக்கு இன்னும் Metadata library தேவைப்படலாம் {/*you-may-still-want-a-metadata-library*/}

Simple use cases-க்கு Document Metadata-ஐ tags ஆக render செய்வது பொருத்தமாக இருக்கலாம்; ஆனால் current route அடிப்படையில் generic metadata-ஐ specific metadata-ஆல் override செய்வது போன்ற வலிமையான features-ஐ libraries வழங்க முடியும். இந்த features, [`react-helmet`](https://github.com/nfl/react-helmet) போன்ற frameworks மற்றும் libraries metadata tags-ஐ replace செய்வதற்குப் பதிலாக support செய்வதை உதவுகின்றன.

</Note>

மேலும் தகவலுக்கு [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link), மற்றும் [`<meta>`](/reference/react-dom/components/meta) docs-ஐ பார்க்கவும்.

### Stylesheets-க்கு support {/*support-for-stylesheets*/}

Externally linked (`<link rel="stylesheet" href="...">`) மற்றும் inline (`<style>...</style>`) ஆகிய இருவகை stylesheets-க்கும் style precedence rules காரணமாக DOM-இல் கவனமான positioning தேவைப்படுகிறது. Components-க்குள் composability அனுமதிக்கும் stylesheet capability கட்டுவது கடினம்; எனவே users தங்கள் styles அனைத்தையும் அவற்றை சாரக்கூடிய components-இலிருந்து தொலைவில் load செய்வதோ, அல்லது இந்த complexity-ஐ encapsulate செய்யும் style library பயன்படுத்துவதோ ஆகிவிடுகிறது.

React 19-இல், இந்த complexity-ஐ address செய்து, Client-இல் Concurrent Rendering மற்றும் Server-இல் Streaming Rendering ஆகியவற்றுடன் built-in stylesheet support மூலம் இன்னும் ஆழமான integration வழங்குகிறோம். உங்கள் stylesheet-ன் `precedence`-ஐ React-க்கு சொன்னால், அது DOM-இல் stylesheet insertion order-ஐ manage செய்து, அந்த style rules-ஐ சார்ந்த content reveal ஆகும் முன் stylesheet (external என்றால்) load ஆகியிருப்பதை உறுதி செய்யும்.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- foo மற்றும் bar இடையில் insert செய்யப்படும்
    </div>
  )
}
```

Server Side Rendering போது React stylesheet-ஐ `<head>`-இல் include செய்யும்; இதனால் browser அது load ஆகும் வரை paint செய்யாது. Streaming தொடங்கிய பிறகு stylesheet தாமதமாக கண்டறியப்பட்டாலும், அந்த stylesheet-ஐ சார்ந்த Suspense boundary content reveal ஆகும் முன் client-இல் `<head>`-க்குள் stylesheet insert செய்யப்படுவதை React உறுதி செய்யும்.

Client Side Rendering போது, newly rendered stylesheets load ஆகும் வரை render commit செய்வதற்கு React காத்திருக்கும். உங்கள் application-இல் பல இடங்களில் இந்த component-ஐ render செய்தால், React stylesheet-ஐ document-இல் ஒருமுறை மட்டும் include செய்யும்:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // DOM-இல் duplicate stylesheet link உருவாகாது
  </>
}
```

Stylesheets-ஐ கைமுறையாக load செய்வதில் பழகிய users-க்கு, அவற்றை சார்ந்த components-க்கு அருகில் அந்த stylesheets-ஐ அமைக்க இது ஒரு வாய்ப்பு. இதனால் local reasoning மேம்படும்; உண்மையில் சார்ந்துள்ள stylesheets மட்டுமே load ஆகின்றன என்பதை உறுதி செய்வதும் மேம்படும்.

Style libraries மற்றும் bundlers-உடன் style integrations-மும் இந்த புதிய capability-ஐ adopt செய்யலாம்; ஆகவே நீங்கள் உங்கள் சொந்த stylesheets-ஐ நேரடியாக render செய்யாவிட்டாலும், உங்கள் tools இந்த feature-ஐப் பயன்படுத்த upgrade ஆகும்போது அதனால் பயன் பெறலாம்.

மேலும் விவரங்களுக்கு [`<link>`](/reference/react-dom/components/link) மற்றும் [`<style>`](/reference/react-dom/components/style) docs-ஐ படியுங்கள்.

### Async scripts-க்கு support {/*support-for-async-scripts*/}

HTML-இல் normal scripts (`<script src="...">`) மற்றும் deferred scripts (`<script defer="" src="...">`) document order-இல் load ஆகும்; இதனால் இத்தகைய scripts-ஐ உங்கள் component tree-யின் ஆழத்தில் render செய்வது சவாலாகிறது. ஆனால் Async scripts (`<script async="" src="...">`) arbitrary order-இல் load ஆகும்.

React 19-இல், script-ஐ உண்மையில் சார்ந்துள்ள components-க்குள், உங்கள் component tree-யின் எங்கிருந்தாலும் அவற்றை render செய்ய அனுமதிப்பதன் மூலம் async scripts-க்கு மேம்பட்ட support சேர்த்துள்ளோம்; script instances relocate மற்றும் deduplicate செய்வதை நீங்கள் manage செய்ய வேண்டியதில்லை.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      வணக்கம் உலகமே
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // DOM-இல் duplicate script உருவாகாது
    </body>
  </html>
}
```

அனைத்து rendering environments-இலும், async scripts deduplicate செய்யப்படும்; அதனால் பல வெவ்வேறு components மூலம் render செய்யப்பட்டாலும் React script-ஐ ஒருமுறை மட்டும் load செய்து execute செய்யும்.

Server Side Rendering-இல், async scripts `<head>`-இல் include செய்யப்பட்டு, stylesheets, fonts, image preloads போன்ற paint-ஐ block செய்யும் முக்கியமான resources-க்கு பின்னால் prioritize செய்யப்படும்.

மேலும் விவரங்களுக்கு [`<script>`](/reference/react-dom/components/script) docs-ஐ படியுங்கள்.

### Resources preloading-க்கு support {/*support-for-preloading-resources*/}

Initial document load மற்றும் client side updates போது, Browser-க்கு அது விரைவில் load செய்ய வேண்டியிருக்கும் resources பற்றி மிக ஆரம்பத்தில் சொல்வது page performance-இல் பெரிய தாக்கத்தை ஏற்படுத்தும்.

Inefficient resource loading காரணமாக தடைபடாத சிறந்த experiences கட்டுவதைக் மிகவும் மேம்படுத்த, Browser resources load மற்றும் preload செய்ய பல புதிய APIs-ஐ React 19 சேர்க்கிறது.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // இந்த script-ஐ eager ஆக load செய்து execute செய்கிறது
  preload('https://.../path/to/font.woff', { as: 'font' }) // இந்த font-ஐ preload செய்கிறது
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // இந்த stylesheet-ஐ preload செய்கிறது
  prefetchDNS('https://...') // இந்த host-இலிருந்து உண்மையில் எதையும் request செய்யாமல் இருக்கலாம்
  preconnect('https://...') // ஏதாவது request செய்வீர்கள், ஆனால் என்ன என்று உறுதி இல்லாத போது
}
```
```html
<!-- மேலுள்ளவை பின்வரும் DOM/HTML-ஐ உருவாக்கும் -->
<html>
  <head>
    <!-- links/scripts call order-ஆல் அல்ல, early loading-க்கு உள்ள utility-ஆல் prioritized செய்யப்படும் -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Stylesheet loading-இலிருந்து fonts போன்ற கூடுதல் resources discovery-ஐ வெளியே நகர்த்துவதன் மூலம் initial page loads-ஐ optimize செய்ய இந்த APIs பயன்படுத்தப்படலாம். எதிர்பார்க்கப்படும் navigation பயன்படுத்தும் resources list-ஐ prefetch செய்து, click அல்லது hover போது கூட அந்த resources-ஐ eager ஆக preload செய்வதன் மூலம் client updates-ஐ வேகமாக்கவும் முடியும்.

மேலும் விவரங்களுக்கு [Resource Preloading APIs](/reference/react-dom#resource-preloading-apis)-ஐ பார்க்கவும்.

### Third-party scripts மற்றும் extensions-உடன் compatibility {/*compatibility-with-third-party-scripts-and-extensions*/}

Third-party scripts மற்றும் browser extensions-ஐ கணக்கில் கொள்ள hydration-ஐ மேம்படுத்தியுள்ளோம்.

Hydrating போது, client-இல் render ஆகும் element server-இலிருந்து வந்த HTML-இல் உள்ள element-க்கு match ஆகவில்லை என்றால், content-ஐ fix செய்ய React client re-render-ஐ force செய்யும். முன்பு, third-party scripts அல்லது browser extensions மூலம் element insert செய்யப்பட்டிருந்தால், அது mismatch error மற்றும் client render-ஐ trigger செய்தது.

React 19-இல், `<head>` மற்றும் `<body>`-இல் உள்ள unexpected tags skip செய்யப்படும்; இதனால் mismatch errors தவிர்க்கப்படும். தொடர்பில்லாத hydration mismatch காரணமாக React முழு document-ஐ re-render செய்ய வேண்டியிருந்தால், third-party scripts மற்றும் browser extensions insert செய்த stylesheets-ஐ அது அப்படியே விட்டு விடும்.

### மேம்பட்ட error reporting {/*error-handling*/}

Duplication-ஐ remove செய்து caught மற்றும் uncaught errors handle செய்வதற்கான options வழங்க React 19-இல் error handling-ஐ மேம்படுத்தினோம். உதாரணமாக, Error Boundary-யால் catch செய்யப்பட்ட render error இருந்தால், முன்பு React error-ஐ இரண்டு முறை throw செய்தது (ஒருமுறை original error-க்காக, பின்னர் automatically recover செய்யத் தவறிய பிறகு மீண்டும்), பின்னர் error எங்கு ஏற்பட்டது பற்றிய info உடன் `console.error` call செய்தது.

இதனால் ஒவ்வொரு caught error-க்கும் மூன்று errors வந்தன:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

React 19-இல், அனைத்து error information-உம் சேர்ந்த ஒரே error-ஐ log செய்கிறோம்:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

மேலும், `onRecoverableError`-ஐ complement செய்ய இரண்டு புதிய root options சேர்த்துள்ளோம்:

- `onCaughtError`: React Error Boundary-இல் error ஒன்றை catch செய்தால் call செய்யப்படும்.
- `onUncaughtError`: Error throw செய்யப்பட்டு Error Boundary-யால் catch செய்யப்படாத போது call செய்யப்படும்.
- `onRecoverableError`: Error throw செய்யப்பட்டு தானாக recovered ஆனபோது call செய்யப்படும்.

மேலும் info மற்றும் examples-க்கு [`createRoot`](/reference/react-dom/client/createRoot) மற்றும் [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) docs-ஐ பார்க்கவும்.

### Custom Elements-க்கு support {/*support-for-custom-elements*/}

React 19 custom elements-க்கு முழு support சேர்க்கிறது மற்றும் [Custom Elements Everywhere](https://custom-elements-everywhere.com/)-இல் உள்ள அனைத்து tests-களையும் pass செய்கிறது.

முந்தைய versions-இல், Custom Elements-ஐ React-இல் பயன்படுத்துவது கடினமாக இருந்தது, ஏனெனில் React unrecognized props-ஐ properties-ஆக அல்ல, attributes-ஆக நடத்தினது. React 19-இல், client-இலும் SSR நேரத்திலும் பின்வரும் strategy-யுடன் வேலை செய்யும் properties support சேர்த்துள்ளோம்:

- **Server Side Rendering**: Custom element-க்கு pass செய்யப்பட்ட props, அவற்றின் type `string`, `number` போன்ற primitive value ஆக இருந்தால், அல்லது value `true` ஆக இருந்தால் attributes ஆக render செய்யப்படும். `object`, `symbol`, `function` போன்ற non-primitive types கொண்ட props, அல்லது value `false` கொண்ட props omit செய்யப்படும்.
- **Client Side Rendering**: Custom Element instance-இல் உள்ள property-க்கு match ஆகும் props properties ஆக assigned செய்யப்படும்; இல்லையெனில் அவை attributes ஆக assigned செய்யப்படும்.

React-இல் Custom Element support-ன் design மற்றும் implementation-ஐ முன்னெடுத்த [Joey Arhar](https://github.com/josepharhar)-க்கு நன்றி.


#### Upgrade செய்வது எப்படி {/*how-to-upgrade*/}
Step-by-step instructions மற்றும் breaking மற்றும் notable changes-ன் முழு list-க்கு [React 19 Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)-ஐ பார்க்கவும்.

_குறிப்பு: இந்த post முதலில் 04/25/2024 அன்று published செய்யப்பட்டது; stable release உடன் 12/05/2024-க்கு update செய்யப்பட்டது._
