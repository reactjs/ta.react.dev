---
title: compilationMode
---

<Intro>

React Compiler எந்த functions-ஐ compile செய்ய வேண்டும் என்பதை எவ்வாறு தேர்வு செய்கிறது என்பதை `compilationMode` option கட்டுப்படுத்துகிறது.

</Intro>

```js
{
  compilationMode: 'infer' // அல்லது 'annotation', 'syntax', 'all'
}
```

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `compilationMode` {/*compilationmode*/}

React Compiler எந்த functions-ஐ optimize செய்யும் என்பதை தீர்மானிக்கும் strategy-ஐ கட்டுப்படுத்துகிறது.

#### Type {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### Default value {/*default-value*/}

`'infer'`

#### Options {/*options*/}

- **`'infer'`** (default): React components மற்றும் hooks-ஐ கண்டறிய compiler intelligent heuristics-ஐப் பயன்படுத்தும்:
  - `"use memo"` directive மூலம் explicit-ஆக annotated செய்யப்பட்ட functions
  - Components போல பெயரிடப்பட்ட (PascalCase) அல்லது hooks போல பெயரிடப்பட்ட (`use` prefix) functions, மேலும் JSX உருவாக்கும் மற்றும்/அல்லது பிற hooks-ஐ call செய்யும் functions

- **`'annotation'`**: `"use memo"` directive மூலம் explicit-ஆக குறிக்கப்பட்ட functions மட்டும் compile செய்யப்படும். Incremental adoption-க்கு ஏற்றது.

- **`'syntax'`**: Flow-ன் [component](https://flow.org/en/docs/react/component-syntax/) மற்றும் [hook](https://flow.org/en/docs/react/hook-syntax/) syntax பயன்படுத்தும் components மற்றும் hooks மட்டும் compile செய்யப்படும்.

- **`'all'`**: அனைத்து top-level functions-ஐயும் compile செய்யும். Non-React functions-ஐயும் compile செய்யக்கூடும் என்பதால் பரிந்துரைக்கப்படவில்லை.

#### Caveats {/*caveats*/}

- `'infer'` mode functions கண்டறியப்பட React naming conventions-ஐப் பின்பற்ற வேண்டும்
- `'all'` mode பயன்படுத்துவது utility functions-ஐ compile செய்வதால் performance-ஐ பாதிக்கலாம்
- `'syntax'` mode-க்கு Flow தேவை; TypeScript உடன் வேலை செய்யாது
- Mode எதுவாக இருந்தாலும், `"use no memo"` directive உள்ள functions எப்போதும் skip செய்யப்படும்

---

## பயன்பாடு {/*usage*/}

### Default inference mode {/*default-inference-mode*/}

React conventions-ஐப் பின்பற்றும் பெரும்பாலான codebases-க்கு default `'infer'` mode நன்றாக வேலை செய்கிறது:

```js
{
  compilationMode: 'infer'
}
```

இந்த mode-இல், பின்வரும் functions compile செய்யப்படும்:

```js
// ✅ Compiled: Named like a component + returns JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Compiled: Named like a hook + calls hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ Compiled: Explicit directive
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ Not compiled: Not a component/hook pattern
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### Annotation mode உடன் incremental adoption {/*incremental-adoption*/}

Gradual migration-க்கு, குறிக்கப்பட்ட functions மட்டும் compile செய்ய `'annotation'` mode-ஐப் பயன்படுத்துங்கள்:

```js
{
  compilationMode: 'annotation'
}
```

பின்னர் compile செய்ய வேண்டிய functions-ஐ explicit-ஆக குறிக்கவும்:

```js
// Only this function will be compiled
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// This won't be compiled without the directive
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### Flow syntax mode பயன்படுத்துதல் {/*flow-syntax-mode*/}

உங்கள் codebase TypeScript-க்கு பதிலாக Flow பயன்படுத்தினால்:

```js
{
  compilationMode: 'syntax'
}
```

Then use Flow's component syntax:

```js
// Compiled: Flow component syntax
component Button(label: string) {
  return <button>{label}</button>;
}

// Compiled: Flow hook syntax
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// Not compiled: Regular function syntax
function helper(data) {
  return process(data);
}
```

### குறிப்பிட்ட functions-ஐ opt out செய்தல் {/*opting-out*/}

Compilation mode எதுவாக இருந்தாலும், compilation-ஐ skip செய்ய `"use no memo"` பயன்படுத்துங்கள்:

```js
function ComponentWithSideEffects() {
  "use no memo"; // Compilation-ஐத் தடுக்கவும்

  // This component has side effects that shouldn't be memoized
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Infer mode-இல் component compile ஆகவில்லை {/*component-not-compiled-infer*/}

`'infer'` mode-இல், உங்கள் component React conventions-ஐப் பின்பற்றுகிறதா என்பதை உறுதிசெய்யுங்கள்:

```js
// ❌ Won't be compiled: lowercase name
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ Will be compiled: PascalCase name
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ Won't be compiled: doesn't create JSX or call hooks
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ Will be compiled: calls a hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```
