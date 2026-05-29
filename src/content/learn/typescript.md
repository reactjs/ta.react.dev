---
title: TypeScript பயன்படுத்துதல்
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

JavaScript codebases-க்கு type definitions சேர்க்க TypeScript ஒரு பிரபலமான வழி. TypeScript [JSX-ஐ support செய்கிறது](/learn/writing-markup-with-jsx); உங்கள் project-க்கு [`@types/react`](https://www.npmjs.com/package/@types/react) மற்றும் [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) சேர்ப்பதன் மூலம் முழு React Web support பெறலாம்.

</Intro>

<YouWillLearn>

* [React Components உடன் TypeScript](/learn/typescript#typescript-with-react-components)
* [Hooks உடன் typing examples](/learn/typescript#example-hooks)
* [`@types/react`-இலிருந்து common types](/learn/typescript#useful-types)
* [மேலும் கற்க இடங்கள்](/learn/typescript#further-learning)

</YouWillLearn>

## Installation {/*installation*/}

அனைத்து [production-grade React frameworks](/learn/creating-a-react-app#full-stack-frameworks)-உம் TypeScript பயன்படுத்த support வழங்குகின்றன. Installation-க்கு framework-specific guide-ஐப் பின்பற்றவும்:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Existing React project-க்கு TypeScript சேர்த்தல் {/*adding-typescript-to-an-existing-react-project*/}

React-ன் type definitions-ன் latest version install செய்ய:

<TerminalBlock>
npm install --save-dev @types/react @types/react-dom
</TerminalBlock>

உங்கள் `tsconfig.json`-இல் கீழ்கண்ட compiler options set செய்யப்பட வேண்டும்:

1. [`lib`](https://www.typescriptlang.org/tsconfig/#lib)-இல் `dom` சேர்க்கப்பட்டிருக்க வேண்டும் (குறிப்பு: `lib` option குறிப்பிடப்படாவிட்டால், default ஆக `dom` சேர்க்கப்படும்).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) valid options-இல் ஒன்றாக set செய்யப்பட வேண்டும். பெரும்பாலான applications-க்கு `preserve` போதுமானது.
  நீங்கள் library publish செய்தால், எந்த value தேர்வு செய்ய வேண்டும் என்பதை [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx)-இல் பார்க்கவும்.

## React Components உடன் TypeScript பயன்படுத்துதல் {/*typescript-with-react-components*/}

<Note>

JSX கொண்ட ஒவ்வொரு file-மும் `.tsx` file extension பயன்படுத்த வேண்டும். இந்த file JSX கொண்டுள்ளது என்பதை TypeScript-க்கு சொல்லும் TypeScript-specific extension இதுவாகும்.

</Note>

React உடன் TypeScript எழுதுவது, React உடன் JavaScript எழுதுவதற்கு மிகவும் ஒத்ததாகும். Component-உடன் வேலை செய்யும்போது முக்கிய வேறுபாடு: உங்கள் component props-க்கு types வழங்கலாம். இந்த types correctness checking-க்கும் editors-இல் inline documentation வழங்கவும் பயன்படும்.

[Quick Start](/learn) guide-இலிருந்து [`MyButton` component](/learn#components)-ஐ எடுத்துக்கொண்டு, button-க்கான `title`-ஐ விவரிக்கும் type ஒன்றை சேர்க்கலாம்:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>என் app-க்கு வரவேற்கிறோம்</h1>
      <MyButton title="நான் ஒரு button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

இந்த sandboxes TypeScript code-ஐ handle செய்யும்; ஆனால் type-checker-ஐ run செய்யாது. அதாவது கற்க TypeScript sandboxes-ஐ மாற்றலாம், ஆனால் type errors அல்லது warnings கிடைக்காது. Type-checking பெற, [TypeScript Playground](https://www.typescriptlang.org/play) அல்லது மேலும் முழுமையான online sandbox பயன்படுத்தலாம்.

</Note>

இந்த inline syntax ஒரு component-க்கு types வழங்கும் நேரடியான வழி. ஆனால் விவரிக்க வேண்டிய fields சில அதிகமானவுடன் இது கையாள கடினமாகலாம். அதற்கு பதிலாக, component props-ஐ விவரிக்க `interface` அல்லது `type` பயன்படுத்தலாம்:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>என் app-க்கு வரவேற்கிறோம்</h1>
      <MyButton title="நான் disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

உங்கள் component props-ஐ விவரிக்கும் type, தேவைக்கேற்ப நேரடியாகவோ சிக்கலாகவோ இருக்கலாம்; ஆனால் அவை `type` அல்லது `interface` மூலம் விவரிக்கப்பட்ட object type ஆக இருக்க வேண்டும். TypeScript objects-ஐ எப்படி விவரிக்கிறது என்பதை [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)-இல் கற்கலாம். மேலும், prop பல வேறு types-இல் ஒன்றாக இருக்க முடியும் என்பதை விவரிக்க [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) மற்றும் advanced use cases-க்கு [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) guide உங்களுக்கு பயனுள்ளதாக இருக்கலாம்.


## Example Hooks {/*example-hooks*/}

`@types/react`-இலிருந்து வரும் type definitions built-in Hooks-க்கான types-ஐ உள்ளடக்கியுள்ளன; ஆகவே கூடுதல் setup இல்லாமல் அவற்றை உங்கள் components-இல் பயன்படுத்தலாம். உங்கள் component-இல் நீங்கள் எழுதும் code-ஐ கணக்கில் கொள்ளும்படி அவை build செய்யப்பட்டுள்ளன; எனவே பல நேரங்களில் [inferred types](https://www.typescriptlang.org/docs/handbook/type-inference.html) கிடைக்கும், types வழங்கும் சிறிய விவரங்களை நீங்களே கையாள வேண்டியதில்லை.

ஆனால் Hooks-க்கு types வழங்குவது எப்படி என்பதைக் காட்ட சில examples பார்க்கலாம்.

### `useState` {/*typing-usestate*/}

[`useState` Hook](/reference/react/useState), value-ன் type என்னாக இருக்க வேண்டும் என்பதை தீர்மானிக்க initial state ஆக pass செய்யப்பட்ட value-ஐ reuse செய்யும். உதாரணமாக:

```ts
// Infer the type as "boolean"
const [enabled, setEnabled] = useState(false);
```

இது `enabled`-க்கு `boolean` type assign செய்யும்; `setEnabled` ஒரு `boolean` argument அல்லது `boolean` return செய்யும் function ஏற்கும் function ஆக இருக்கும். State-க்கு type-ஐ explicit ஆக வழங்க விரும்பினால், `useState` call-க்கு type argument வழங்கலாம்:

```ts
// Explicitly set the type to "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

இந்த case-இல் இது அதிக பயனில்லை; ஆனால் union type இருக்கும்போது type வழங்குவது பொதுவான case. உதாரணமாக, இங்கே `status` சில வேறு strings-இல் ஒன்றாக இருக்கலாம்:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

அல்லது, [State அமைப்பதற்கான principles](/learn/choosing-the-state-structure#principles-for-structuring-state)-இல் பரிந்துரைக்கப்பட்டபடி, தொடர்புடைய state-ஐ object ஆக group செய்து, object types மூலம் வெவ்வேறு சாத்தியங்களை விவரிக்கலாம்:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` Hook](/reference/react/useReducer) reducer function மற்றும் initial state எடுக்கும் சற்று சிக்கலான Hook ஆகும். Reducer function-க்கான types initial state-இலிருந்து infer செய்யப்படுகின்றன. State-க்கு type வழங்க `useReducer` call-க்கு type argument விருப்பமாக வழங்கலாம்; ஆனால் பெரும்பாலும் initial state-இலேயே type set செய்வது நல்லது:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("தெரியாத action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>என் counter-க்கு வரவேற்கிறோம்</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>5 சேர்க்க</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


நாங்கள் சில முக்கிய இடங்களில் TypeScript பயன்படுத்துகிறோம்:

 - `interface State` reducer-ன் state shape-ஐ விவரிக்கிறது.
 - `type CounterAction` reducer-க்கு dispatch செய்யக்கூடிய வெவ்வேறு actions-ஐ விவரிக்கிறது.
 - `const initialState: State` initial state-க்கு type வழங்குகிறது; மேலும் default ஆக `useReducer` பயன்படுத்தும் type-யும் இதுவே.
 - `stateReducer(state: State, action: CounterAction): State` reducer function-ன் arguments மற்றும் return value-க்கான types-ஐ set செய்கிறது.

`initialState`-இல் type set செய்வதற்கு மேலும் explicit மாற்று, `useReducer`-க்கு type argument வழங்குவது:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` Hook](/reference/react/useContext), component tree வழியாக props pass செய்யாமல் data-வை கீழே pass செய்யும் technique ஆகும். இது provider component உருவாக்கியும், child component-இல் value consume செய்ய Hook உருவாக்கியும் அடிக்கடி பயன்படுத்தப்படுகிறது.

Context வழங்கும் value-ன் type, `createContext` call-க்கு pass செய்யப்பட்ட value-இலிருந்து infer செய்யப்படுகிறது:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

அர்த்தமுள்ள default value இருக்கும் போது இந்த technique வேலை செய்கிறது. ஆனால் சில சமயம் அது இருக்காது; அப்படிப்பட்ட cases-இல் `null` default value ஆக reasonable போல தோன்றலாம். ஆனால் type-system உங்கள் code-ஐ புரிந்துகொள்ள, `createContext`-இல் `ContextShape | null`-ஐ explicit ஆக set செய்ய வேண்டும்.

இதனால் context consumers-க்கான type-இல் `| null`-ஐ நீக்க வேண்டிய சிக்கல் ஏற்படும். Hook அதன் இருப்பை runtime-இல் check செய்து, இல்லையெனில் error throw செய்ய வேண்டும் என்பதே எங்கள் பரிந்துரை:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// This is a simpler example, but you can imagine a more complex object here
type ComplexObject = {
  kind: string
};

// The context is created with `| null` in the type, to accurately reflect the default value.
const Context = createContext<ComplexObject | null>(null);

// The `| null` will be removed via the check in the Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

<Note>

[React Compiler](/learn/react-compiler) values மற்றும் functions-ஐ தானாக memoize செய்கிறது; இதனால் manual `useMemo` calls தேவையை குறைக்கிறது. Memoization-ஐ தானாக கையாள compiler-ஐ பயன்படுத்தலாம்.

</Note>

[`useMemo`](/reference/react/useMemo) Hook, function call-இலிருந்து memorized value ஒன்றை create/re-access செய்யும்; 2வது parameter ஆக pass செய்யப்பட்ட dependencies மாறும்போது மட்டுமே function மீண்டும் run ஆகும். Hook call செய்த result, முதல் parameter-இல் உள்ள function return value-இலிருந்து infer செய்யப்படுகிறது. Hook-க்கு type argument வழங்கி மேலும் explicit ஆகலாம்.

```ts
// The type of visibleTodos is inferred from the return value of filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

<Note>

[React Compiler](/learn/react-compiler) values மற்றும் functions-ஐ தானாக memoize செய்கிறது; இதனால் manual `useCallback` calls தேவையை குறைக்கிறது. Memoization-ஐ தானாக கையாள compiler-ஐ பயன்படுத்தலாம்.

</Note>

[`useCallback`](/reference/react/useCallback), second parameter-க்கு pass செய்யப்பட்ட dependencies அதேபோல இருக்கும் வரை function-க்கு stable reference வழங்குகிறது. `useMemo` போலவே, function-ன் type முதல் parameter-இல் உள்ள function return value-இலிருந்து infer செய்யப்படுகிறது; Hook-க்கு type argument வழங்கி மேலும் explicit ஆகலாம்.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript strict mode-இல் வேலை செய்யும்போது, `useCallback` உங்கள் callback-இல் parameters-க்கு types சேர்க்க வேண்டும். ஏனெனில் callback-ன் type function return value-இலிருந்து infer செய்யப்படுகிறது; parameters இல்லாமல் type முழுமையாகப் புரியாது.

உங்கள் code-style விருப்பங்களைப் பொறுத்து, callback define செய்யும் அதே நேரத்தில் event handler-க்கான type வழங்க React types-இலிருந்து `*EventHandler` functions-ஐ பயன்படுத்தலாம்:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("என்னை மாற்றுங்கள்");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## பயனுள்ள Types {/*useful-types*/}

`@types/react` package-இலிருந்து வரும் types தொகுப்பு மிகவும் விரிவானது; React மற்றும் TypeScript எப்படி interact செய்கின்றன என்பதை நன்றாகப் புரிந்தபின் அதை படிப்பது பயனுள்ளதாக இருக்கும். அவற்றை [DefinitelyTyped-இல் React folder](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)-இல் காணலாம். இங்கே அதிகமாகப் பயன்படுத்தப்படும் சில types-ஐ பார்க்கிறோம்.

### DOM Events {/*typing-dom-events*/}

React-இல் DOM events உடன் வேலை செய்யும்போது, event-ன் type பெரும்பாலும் event handler-இலிருந்து infer செய்யப்படும். ஆனால் event handler-க்கு pass செய்ய function ஒன்றை extract செய்ய விரும்பும்போது, event-ன் type-ஐ explicit ஆக set செய்ய வேண்டும்.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("என்னை மாற்றுங்கள்");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

React types-இல் பல event types வழங்கப்பட்டுள்ளன; முழு பட்டியலை [இங்கே](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) காணலாம். இது [DOM-இலிருந்து மிகவும் popular events](https://developer.mozilla.org/en-US/docs/Web/Events)-ஐ அடிப்படையாகக் கொண்டது.

நீங்கள் தேடும் type-ஐ தீர்மானிக்கும்போது, முதலில் நீங்கள் பயன்படுத்தும் event handler-க்கான hover information-ஐ பார்க்கலாம்; அது event-ன் type-ஐ காட்டும்.

இந்த பட்டியலில் இல்லாத event ஒன்றைப் பயன்படுத்த வேண்டுமானால், அனைத்து events-க்கும் base type ஆக இருக்கும் `React.SyntheticEvent` type-ஐ பயன்படுத்தலாம்.

### Children {/*typing-children*/}

Component-ன் children-ஐ விவரிக்க இரண்டு common paths உள்ளன. முதல் வழி `React.ReactNode` type-ஐப் பயன்படுத்துவது; இது JSX-இல் children ஆக pass செய்யக்கூடிய அனைத்து possible types-ன் union ஆகும்:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

இது children-க்கான மிகவும் broad definition. இரண்டாவது வழி `React.ReactElement` type-ஐப் பயன்படுத்துவது; இது JSX elements மட்டுமே, strings அல்லது numbers போன்ற JavaScript primitives அல்ல:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Children ஒரு குறிப்பிட்ட வகை JSX elements தான் என்பதை TypeScript மூலம் விவரிக்க முடியாது என்பதை கவனிக்கவும்; ஆகவே `<li>` children மட்டும் accept செய்யும் component-ஐ type-system மூலம் விவரிக்க முடியாது.

Type-checker உடன் `React.ReactNode` மற்றும் `React.ReactElement` இரண்டிற்குமான example-ஐ [இந்த TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA)-இல் காணலாம்.

### Style Props {/*typing-style-props*/}

React-இல் inline styles பயன்படுத்தும்போது, `style` prop-க்கு pass செய்யப்படும் object-ஐ விவரிக்க `React.CSSProperties` பயன்படுத்தலாம். இந்த type அனைத்து possible CSS properties-ன் union ஆகும்; `style` prop-க்கு valid CSS properties pass செய்கிறீர்கள் என்பதை உறுதிசெய்யவும் editor-இல் auto-complete பெறவும் இது நல்ல வழி.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## மேலும் கற்றல் {/*further-learning*/}

இந்த guide React உடன் TypeScript பயன்படுத்துவதின் basics-ஐ cover செய்தது; ஆனால் கற்க இன்னும் நிறைய உள்ளது.
Docs-இல் உள்ள individual API pages, அவற்றை TypeScript உடன் எப்படி பயன்படுத்துவது என்பதற்கான மேலும் ஆழமான documentation கொண்டிருக்கலாம்.

கீழ்கண்ட resources-ஐ பரிந்துரைக்கிறோம்:

 - [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) TypeScript-க்கான official documentation; பெரும்பாலான முக்கிய language features-ஐ cover செய்கிறது.

 - [TypeScript release notes](https://devblogs.microsoft.com/typescript/) புதிய features-ஐ ஆழமாக cover செய்கின்றன.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) React உடன் TypeScript பயன்படுத்த community-maintained cheatsheet ஆகும்; பல பயனுள்ள edge cases-ஐ cover செய்து, இந்த document-ஐ விட அதிக breadth வழங்குகிறது.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) TypeScript மற்றும் React சிக்கல்களைப் பற்றி கேள்விகள் கேட்கவும் உதவி பெறவும் சிறந்த இடம்.
