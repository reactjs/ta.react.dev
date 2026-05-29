---
title: "use memo"
titleForTitleTag: "'use memo' directive"
---

<Intro>

`"use memo"` ஒரு function-ஐ React Compiler optimization-க்கு குறிக்கிறது.

</Intro>

<Note>

பெரும்பாலான சூழல்களில் `"use memo"` தேவையில்லை. Functions-ஐ optimization-க்கு வெளிப்படையாக குறிக்க வேண்டிய `annotation` mode-இல்தான் இது முக்கியமாக தேவைப்படும். `infer` mode-இல் compiler components மற்றும் hooks-ஐ அவற்றின் naming patterns மூலம் தானாக கண்டறியும் (components-க்கு PascalCase, hooks-க்கு `use` prefix). `infer` mode-இல் ஒரு component அல்லது hook compile ஆகவில்லை என்றால், `"use memo"` மூலம் compilation-ஐ force செய்வதற்கு பதிலாக அதன் naming convention-ஐ சரிசெய்ய வேண்டும்.

</Note>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `"use memo"` {/*use-memo*/}

React Compiler optimization-க்கு ஒரு function-ஐ குறிக்க, அந்த function-ன் தொடக்கத்தில் `"use memo"` சேர்க்கவும்.

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

ஒரு function-இல் `"use memo"` இருந்தால், React Compiler build time-இல் அதை analyze செய்து optimize செய்யும். தேவையற்ற re-computations மற்றும் re-renders-ஐத் தடுக்க values மற்றும் components-ஐ compiler தானாக memoize செய்யும்.

#### எச்சரிக்கைகள் {/*caveats*/}

* `"use memo"` function body-யின் முற்றிலும் தொடக்கத்தில், எந்த imports அல்லது பிற code-க்கும் முன் இருக்க வேண்டும் (comments சரி).
* Directive double quotes அல்லது single quotes-இல் எழுதப்பட வேண்டும்; backticks-இல் அல்ல.
* Directive துல்லியமாக `"use memo"` ஆகவே இருக்க வேண்டும்.
* ஒரு function-இல் முதல் directive மட்டுமே process செய்யப்படும்; கூடுதல் directives புறக்கணிக்கப்படும்.
* Directive-ன் விளைவு உங்கள் [`compilationMode`](/reference/react-compiler/compilationMode) setting-ஐப் பொறுத்தது.

### `"use memo"` functions-ஐ optimization-க்கு எப்படி குறிக்கிறது {/*how-use-memo-marks*/}

React Compiler பயன்படுத்தும் React app-இல், functions optimize செய்யக் கூடியவையா என்பதைத் தீர்மானிக்க build time-இல் அவை analyze செய்யப்படும். Default-ஆக compiler எந்த components-ஐ memoize செய்ய வேண்டும் என்பதை தானாக infer செய்கிறது; ஆனால் நீங்கள் [`compilationMode`](/reference/react-compiler/compilationMode) setting அமைத்திருந்தால், அது அதைப் பொறுத்திருக்கலாம்.

`"use memo"` default behavior-ஐ override செய்து, ஒரு function-ஐ optimization-க்கு explicit-ஆக குறிக்கிறது:

* `annotation` mode-இல்: `"use memo"` உள்ள functions மட்டும் optimize செய்யப்படும்
* `infer` mode-இல்: compiler heuristics-ஐப் பயன்படுத்தும்; ஆனால் `"use memo"` optimization-ஐ force செய்யும்
* `all` mode-இல்: default-ஆக எல்லாமே optimize செய்யப்படும்; அதனால் `"use memo"` redundant ஆகிறது

இந்த directive உங்கள் codebase-இல் optimized மற்றும் non-optimized code இடையே தெளிவான boundary-ஐ உருவாக்கி, compilation process மீது fine-grained control வழங்குகிறது.

### `"use memo"` எப்போது பயன்படுத்த வேண்டும் {/*when-to-use*/}

பின்வரும் சூழல்களில் `"use memo"` பயன்படுத்துவதைக் கருதலாம்:

#### நீங்கள் annotation mode பயன்படுத்துகிறீர்கள் {/*annotation-mode-use*/}
`compilationMode: 'annotation'`-இல், optimize செய்ய வேண்டிய ஒவ்வொரு function-க்கும் இந்த directive தேவை:

```js
// ✅ This component will be optimized
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ This component won't be optimized
function SimpleWrapper() {
  // ...
}
```

#### நீங்கள் React Compiler-ஐ படிப்படியாக adopt செய்கிறீர்கள் {/*gradual-adoption*/}
`annotation` mode-இல் தொடங்கி, stable components-ஐ தேர்ந்தெடுத்து optimize செய்யுங்கள்:

```js
// Start by optimizing leaf components
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// Gradually move up the tree as you verify behavior
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## பயன்பாடு {/*usage*/}

### வெவ்வேறு compilation modes உடன் வேலை செய்தல் {/*compilation-modes*/}

உங்கள் compiler configuration-ஐப் பொறுத்து `"use memo"`-ன் behavior மாறும்:

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // அல்லது 'infer' அல்லது 'all'
    }]
  ]
};
```

#### Annotation mode {/*annotation-mode-example*/}
```js
// ✅ Optimized with "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ Not optimized (no directive)
function ProductList({ products }) {
  // ...
}
```

#### Infer mode (default) {/*infer-mode-example*/}
```js
// Automatically memoized because this is named like a Component
function ComplexDashboard({ data }) {
  // ...
}

// Skipped: Is not named like a Component
function simpleDisplay({ text }) {
  // ...
}
```

`infer` mode-இல் compiler components மற்றும் hooks-ஐ அவற்றின் naming patterns மூலம் தானாக கண்டறியும் (components-க்கு PascalCase, hooks-க்கு `use` prefix). `infer` mode-இல் ஒரு component அல்லது hook compile ஆகவில்லை என்றால், `"use memo"` மூலம் compilation-ஐ force செய்வதற்கு பதிலாக அதன் naming convention-ஐ சரிசெய்ய வேண்டும்.

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Optimization-ஐச் சரிபார்த்தல் {/*verifying-optimization*/}

உங்கள் component optimize செய்யப்படுகிறதா என்பதை உறுதிப்படுத்த:

1. உங்கள் build-இல் compiled output-ஐச் சரிபார்க்கவும்
2. Memo ✨ badge உள்ளதா என்பதை React DevTools-இல் சரிபார்க்கவும்

### மேலும் பார்க்க {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - Compilation-இலிருந்து opt out செய்யுங்கள்
* [`compilationMode`](/reference/react-compiler/compilationMode) - Compilation behavior-ஐ configure செய்யுங்கள்
* [React Compiler](/learn/react-compiler) - தொடங்குவதற்கான வழிகாட்டி
