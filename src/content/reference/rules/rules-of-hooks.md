---
title: Hooks விதிகள்
---

<Intro>
Hooks JavaScript functions-ஐப் பயன்படுத்தி வரையறுக்கப்படுகின்றன; ஆனால் அவை எங்கு அழைக்கப்படலாம் என்பதில் கட்டுப்பாடுகளைக் கொண்ட, மீண்டும் பயன்படுத்தக்கூடிய UI logic-இன் ஒரு சிறப்பு வகையை குறிக்கின்றன.
</Intro>

<InlineToc />

---

## Hooks-ஐ top level-இல் மட்டுமே அழைக்கவும் {/*only-call-hooks-at-the-top-level*/}

`use` என்று தொடங்கும் பெயர் கொண்ட functions React-இல் [*Hooks*](/reference/react) என்று அழைக்கப்படுகின்றன.

**Loops, conditions, nested functions, அல்லது `try`/`catch`/`finally` blocks உள்ளே Hooks-ஐ அழைக்க வேண்டாம்.** அதற்கு பதிலாக, எந்த early returns-க்கும் முன், உங்கள் React function-இன் top level-இல் எப்போதும் Hooks-ஐப் பயன்படுத்துங்கள். React function component ஒன்றை render செய்யும் போது மட்டுமே Hooks-ஐ அழைக்கலாம்:

* ✅ [Function component](/learn/your-first-component)-இன் body-இல் top level-இல் அவற்றை அழைக்கவும்.
* ✅ [Custom Hook](/learn/reusing-logic-with-custom-hooks)-இன் body-இல் top level-இல் அவற்றை அழைக்கவும்.

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

மற்ற எந்த நிலைகளிலும் Hooks (`use` என்று தொடங்கும் functions) அழைப்பது ஆதரிக்கப்படவில்லை. உதாரணமாக:

* 🔴 Conditions அல்லது loops உள்ளே Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 Conditional `return` statement-க்கு பிறகு Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 Event handlers-இல் Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 Class components-இல் Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 `useMemo`, `useReducer`, அல்லது `useEffect`-க்கு pass செய்யப்படும் functions உள்ளே Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 `try`/`catch`/`finally` blocks உள்ளே Hooks-ஐ அழைக்க வேண்டாம்.

இந்த விதிகளை மீறினால், இந்த error-ஐக் காணலாம்.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Bad: inside try/catch/finally block (to fix, move it outside!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

இந்த பிழைகளைப் பிடிக்க [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)-ஐப் பயன்படுத்தலாம்.

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) மற்ற Hooks-ஐ அழைக்க *முடியும்* (அதுவே அவற்றின் நோக்கம்). இது வேலை செய்வதன் காரணம், custom Hooks-உம் function component render ஆகும் போது மட்டுமே அழைக்கப்பட வேண்டும் என்பதுதான்.

</Note>

---

## React functions-இலிருந்து மட்டுமே Hooks-ஐ அழைக்கவும் {/*only-call-hooks-from-react-functions*/}

சாதாரண JavaScript functions-இலிருந்து Hooks-ஐ அழைக்க வேண்டாம். அதற்கு பதிலாக:

✅ React function components-இலிருந்து Hooks-ஐ அழைக்கலாம்.
✅ [Custom Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)-இலிருந்து Hooks-ஐ அழைக்கலாம்.

இந்த விதியைப் பின்பற்றுவதன் மூலம், ஒரு component-இல் உள்ள அனைத்து stateful logic-உம் அதன் source code-இலிருந்து தெளிவாகத் தெரிகிறது என்பதை உறுதிசெய்கிறீர்கள்.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Component அல்லது custom Hook அல்ல!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
