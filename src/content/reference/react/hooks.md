---
title: "உள்ளமைந்த React Hooks"
---

<Intro>

*Hooks* உங்கள் components-இலிருந்து பல்வேறு React அம்சங்களைப் பயன்படுத்த உதவுகின்றன. உள்ளமைந்த Hooks-ஐப் பயன்படுத்தலாம் அல்லது அவற்றை சேர்த்து உங்கள் சொந்த Hooks-ஐ உருவாக்கலாம். React-இல் உள்ள அனைத்து built-in Hooks-ஐ இந்தப் பக்கம் பட்டியலிடுகிறது.

</Intro>

---

## State Hooks {/*state-hooks*/}

*State* ஒரு component-க்கு user input போன்ற தகவலை ["நினைவில்" வைத்திருக்க](/learn/state-a-components-memory) உதவுகிறது. உதாரணமாக, form component input value-ஐ சேமிக்க state பயன்படுத்தலாம்; image gallery component தேர்ந்தெடுக்கப்பட்ட image index-ஐ சேமிக்க state பயன்படுத்தலாம்.

ஒரு component-க்கு state சேர்க்க, இந்த Hooks-இல் ஒன்றைப் பயன்படுத்துங்கள்:

* [`useState`](/reference/react/useState) நேரடியாக update செய்யக்கூடிய state variable ஒன்றை declare செய்கிறது.
* [`useReducer`](/reference/react/useReducer) update logic-ஐ [reducer function](/learn/extracting-state-logic-into-a-reducer)-க்குள் கொண்ட state variable ஒன்றை declare செய்கிறது.

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context* ஒரு component-க்கு [தொலைவில் உள்ள parents-இலிருந்து props ஆக pass செய்யாமல் தகவலைப் பெற](/learn/passing-props-to-a-component) உதவுகிறது. உதாரணமாக, உங்கள் app-இன் top-level component, current UI theme-ஐ எவ்வளவு ஆழத்தில் இருந்தாலும் கீழே உள்ள அனைத்து components-க்கும் pass செய்யலாம்.

* [`useContext`](/reference/react/useContext) context ஒன்றை read செய்து subscribe செய்கிறது.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* ஒரு component-க்கு DOM node அல்லது timeout ID போன்ற [rendering-க்கு பயன்படுத்தப்படாத சில தகவலை வைத்திருக்க](/learn/referencing-values-with-refs) உதவுகின்றன. State போலல்லாமல், ref update செய்தால் உங்கள் component re-render ஆகாது. Refs என்பது React paradigm-இலிருந்து ஒரு "escape hatch". Built-in browser API-கள் போன்ற React அல்லாத systems-உடன் வேலை செய்ய வேண்டியபோது அவை பயனுள்ளதாக இருக்கும்.

* [`useRef`](/reference/react/useRef) ref ஒன்றை declare செய்கிறது. அதில் எந்த value-யையும் வைத்திருக்கலாம், ஆனால் பொதுவாக DOM node வைத்திருக்க பயன்படுத்தப்படுகிறது.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) உங்கள் component வெளிப்படுத்தும் ref-ஐ customize செய்ய உதவுகிறது. இது அரிதாகப் பயன்படுத்தப்படுகிறது.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects* ஒரு component-க்கு [external systems-உடன் connect செய்து synchronize செய்ய](/learn/synchronizing-with-effects) உதவுகின்றன. இதில் network, browser DOM, animations, வேறு UI library பயன்படுத்தி எழுதப்பட்ட widgets, மற்றும் பிற React அல்லாத code ஆகியவற்றுடன் வேலை செய்வது அடங்கும்.

* [`useEffect`](/reference/react/useEffect) ஒரு component-ஐ external system-உடன் connect செய்கிறது.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effects என்பது React paradigm-இலிருந்து ஒரு "escape hatch". உங்கள் application-இன் data flow-ஐ orchestrate செய்ய Effects-ஐப் பயன்படுத்த வேண்டாம். External system-உடன் interact செய்யவில்லை என்றால், [உங்களுக்கு Effect தேவையில்லாமல் இருக்கலாம்.](/learn/you-might-not-need-an-effect)

Timing-இல் வேறுபடும், அரிதாகப் பயன்படுத்தப்படும் `useEffect`-இன் இரண்டு variations உள்ளன:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) browser screen-ஐ repaint செய்வதற்கு முன் fire ஆகிறது. இங்கே layout-ஐ measure செய்யலாம்.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) React DOM-க்கு changes செய்வதற்கு முன் fire ஆகிறது. Libraries இங்கே dynamic CSS insert செய்யலாம்.

Events-ஐ Effects-இலிருந்து பிரித்தும் வைத்திருக்கலாம்:

- [`useEffectEvent`](/reference/react/useEffectEvent) எந்த Effect hook-இலிருந்தும் fire செய்ய non-reactive event ஒன்றை உருவாக்குகிறது.
---

## Performance Hooks {/*performance-hooks*/}

Re-rendering performance-ஐ optimize செய்யும் பொதுவான வழி தேவையற்ற பணியை skip செய்வது. உதாரணமாக, cached calculation ஒன்றை re-use செய்யவோ அல்லது முந்தைய render-க்குப் பிறகு data மாறவில்லை என்றால் re-render-ஐ skip செய்யவோ React-க்கு சொல்லலாம்.

Calculations மற்றும் தேவையற்ற re-rendering-ஐ skip செய்ய, இந்த Hooks-இல் ஒன்றைப் பயன்படுத்துங்கள்:

- [`useMemo`](/reference/react/useMemo) expensive calculation-இன் result-ஐ cache செய்ய உதவுகிறது.
- [`useCallback`](/reference/react/useCallback) optimized component-க்கு pass செய்வதற்கு முன் function definition ஒன்றை cache செய்ய உதவுகிறது.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

சில நேரங்களில் screen உண்மையில் update ஆக வேண்டியதால் re-rendering-ஐ skip செய்ய முடியாது. அப்போது, synchronous ஆக இருக்க வேண்டிய blocking updates (input-இல் type செய்வது போன்றவை) மற்றும் user interface-ஐ block செய்ய வேண்டியதில்லாத non-blocking updates (chart update செய்வது போன்றவை) ஆகியவற்றைப் பிரிப்பதன் மூலம் performance-ஐ மேம்படுத்தலாம்.

Rendering-க்கு priority கொடுக்க, இந்த Hooks-இல் ஒன்றைப் பயன்படுத்துங்கள்:

- [`useTransition`](/reference/react/useTransition) state transition ஒன்றை non-blocking ஆகக் குறிக்கவும், பிற updates அதை interrupt செய்ய அனுமதிக்கவும் உதவுகிறது.
- [`useDeferredValue`](/reference/react/useDeferredValue) UI-யின் critical அல்லாத பகுதியை update செய்வதை defer செய்து, மற்ற பகுதிகள் முதலில் update ஆக அனுமதிக்கிறது.

---

## பிற Hooks {/*other-hooks*/}

இந்த Hooks பெரும்பாலும் library authors-க்கு பயனுள்ளதாக இருக்கும்; application code-இல் பொதுவாகப் பயன்படுத்தப்படுவதில்லை.

- [`useDebugValue`](/reference/react/useDebugValue) உங்கள் custom Hook-க்காக React DevTools காட்டும் label-ஐ customize செய்ய உதவுகிறது.
- [`useId`](/reference/react/useId) ஒரு component தன்னுடன் unique ID ஒன்றை associate செய்ய உதவுகிறது. பொதுவாக accessibility APIs-உடன் பயன்படுத்தப்படுகிறது.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) ஒரு component external store ஒன்றுக்கு subscribe செய்ய உதவுகிறது.
* [`useActionState`](/reference/react/useActionState) actions-இன் state-ஐ நிர்வகிக்க அனுமதிக்கிறது.

---

## உங்கள் சொந்த Hooks {/*your-own-hooks*/}

JavaScript functions ஆக [உங்கள் சொந்த custom Hooks-ஐ வரையறுக்கவும்](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) முடியும்.
