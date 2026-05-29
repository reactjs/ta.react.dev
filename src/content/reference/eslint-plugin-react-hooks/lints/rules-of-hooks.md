---
title: rules-of-hooks
---

<Intro>

Components மற்றும் hooks [Rules of Hooks](/reference/rules/rules-of-hooks)-ஐப் பின்பற்றுகின்றனவா என்பதை validate செய்கிறது.

</Intro>

## Rule விவரங்கள் {/*rule-details*/}

Renders இடையே state-ஐ சரியாக preserve செய்ய, hooks எந்த வரிசையில் call செய்யப்படுகின்றன என்பதையே React நம்புகிறது. உங்கள் component ஒவ்வொரு முறை render ஆகும்போதும், அதே hooks அதே வரிசையில் call செய்யப்படும் என்று React எதிர்பார்க்கிறது. Hooks conditionally அல்லது loops-இல் call செய்யப்பட்டால், எந்த state எந்த hook call-க்கு பொருந்துகிறது என்பதை React track செய்ய முடியாது; இதனால் state mismatches மற்றும் `"Rendered fewer/more hooks than expected"` போன்ற errors ஏற்படும்.

## பொதுவான மீறல்கள் {/*common-violations*/}

இந்த patterns Rules of Hooks-ஐ மீறுகின்றன:

- **Conditions-இல் hooks** (`if`/`else`, ternary, `&&`/`||`)
- **Loops-இல் hooks** (`for`, `while`, `do-while`)
- **Early returns-க்கு பிறகு hooks**
- **Callbacks/event handlers-இல் hooks**
- **Async functions-இல் hooks**
- **Class methods-இல் hooks**
- **Module level-இல் hooks**

<Note>

### `use` hook {/*use-hook*/}

`use` hook பிற React hooks-இலிருந்து வேறுபட்டது. அதை conditionally மற்றும் loops-இல் call செய்யலாம்:

```js
// ✅ `use` can be conditional
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ `use` can be in loops
for (const promise of promises) {
  results.push(use(promise));
}
```

ஆனால் `use`-க்கு இன்னும் சில restrictions உள்ளன:
- try/catch-க்குள் wrap செய்யக்கூடாது
- Component அல்லது hook-க்குள் call செய்யப்பட வேண்டும்

மேலும் அறிக: [`use` API Reference](/reference/react/use)

</Note>

### Invalid {/*invalid*/}

இந்த rule-க்கான தவறான code உதாரணங்கள்:

```js
// ❌ Hook in condition
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ Hook after early return
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ Hook in callback
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ `use` in try/catch
try {
  const data = use(promise);
} catch (e) {
  // error handling
}

// ❌ Hook at module level
const globalState = useState(0); // Component-க்கு வெளியே
```

### Valid {/*valid*/}

இந்த rule-க்கான சரியான code உதாரணங்கள்:

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Hooks at top level
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ `use` can be conditional
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## சிக்கல் தீர்வு {/*troubleshooting*/}

### ஒரு condition அடிப்படையில் data fetch செய்ய வேண்டும் {/*conditional-data-fetching*/}

நீங்கள் `useEffect`-ஐ conditionally call செய்ய முயற்சிக்கிறீர்கள்:

```js
// ❌ Conditional hook
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

Hook-ஐ unconditionally call செய்து, condition-ஐ உள்ளே check செய்யுங்கள்:

```js
// ✅ Condition inside hook
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

<Note>

`useEffect`-இல் data fetch செய்வதைவிட சிறந்த வழிகள் உள்ளன. Data fetching-க்கு TanStack Query, useSWR, அல்லது React Router 6.4+ பயன்படுத்துவதைக் கருதுங்கள். இந்த solutions requests-ஐ deduplicate செய்தல், responses-ஐ cache செய்தல், network waterfalls-ஐத் தவிர்த்தல் ஆகியவற்றை கையாளுகின்றன.

மேலும் அறிக: [Fetching Data](/learn/synchronizing-with-effects#fetching-data)

</Note>

### வெவ்வேறு சூழல்களுக்கு வெவ்வேறு state தேவை {/*conditional-state-initialization*/}

நீங்கள் state-ஐ conditionally initialize செய்ய முயற்சிக்கிறீர்கள்:

```js
// ❌ Conditional state
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

எப்போதும் `useState`-ஐ call செய்து, initial value-ஐ conditionally அமைக்கவும்:

```js
// ✅ Conditional initial value
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
```

## Options {/*options*/}

Shared ESLint settings மூலம் custom effect hooks-ஐ configure செய்யலாம் (`eslint-plugin-react-hooks` 6.1.1 மற்றும் அதன் பின்வரும் versions-இல் கிடைக்கும்):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: Effects-ஆக நடத்தப்பட வேண்டிய custom hooks-ஐ match செய்யும் Regex pattern. இதனால் `useEffectEvent` மற்றும் அதுபோன்ற event functions உங்கள் custom effect hooks-இலிருந்து call செய்யப்படலாம்.

இந்த shared configuration `rules-of-hooks` மற்றும் `exhaustive-deps` என்ற இரு rules-களாலும் பயன்படுத்தப்படுகிறது; இதனால் hook தொடர்பான எல்லா linting-இலும் consistent behavior உறுதியாகும்.
