---
title: Directives
---

<Intro>
React Compiler directives என்பது குறிப்பிட்ட functions compile செய்யப்பட வேண்டுமா என்பதை கட்டுப்படுத்தும் சிறப்பு string literals.
</Intro>

```js
function MyComponent() {
  "use memo"; // இந்த component-ஐ compilation-க்கு opt in செய்யவும்
  return <div>{/* ... */}</div>;
}
```

<InlineToc />

---

## மேற்பார்வை {/*overview*/}

Compiler எந்த functions-ஐ optimize செய்ய வேண்டும் என்பதற்கு React Compiler directives fine-grained control வழங்குகின்றன. அவை function body-யின் தொடக்கத்தில் அல்லது module-ன் மேற்பகுதியில் வைக்கப்படும் string literals.

### கிடைக்கும் directives {/*available-directives*/}

* **[`"use memo"`](/reference/react-compiler/directives/use-memo)** - ஒரு function-ஐ compilation-க்கு opt in செய்கிறது
* **[`"use no memo"`](/reference/react-compiler/directives/use-no-memo)** - ஒரு function-ஐ compilation-இலிருந்து opt out செய்கிறது

### விரைவான ஒப்பீடு {/*quick-comparison*/}

| Directive | நோக்கம் | எப்போது பயன்படுத்துவது |
|-----------|---------|-------------|
| [`"use memo"`](/reference/react-compiler/directives/use-memo) | Compilation-ஐ force செய்கிறது | `annotation` mode பயன்படுத்தும்போது அல்லது `infer` mode heuristics-ஐ override செய்யும்போது |
| [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) | Compilation-ஐத் தடுக்கிறது | சிக்கல்களை debug செய்யும்போது அல்லது incompatible code உடன் வேலை செய்யும்போது |

---

## பயன்பாடு {/*usage*/}

### Function-level directives {/*function-level*/}

ஒரு function-ன் compilation-ஐ கட்டுப்படுத்த, அதன் தொடக்கத்தில் directives-ஐ வையுங்கள்:

```js
// Opt into compilation
function OptimizedComponent() {
  "use memo";
  return <div>This will be optimized</div>;
}

// Opt out of compilation
function UnoptimizedComponent() {
  "use no memo";
  return <div>This won't be optimized</div>;
}
```

### Module-level directives {/*module-level*/}

அந்த module-இல் உள்ள அனைத்து functions-க்கும் பொருந்த, file-ன் மேற்பகுதியில் directives-ஐ வையுங்கள்:

```js
// At the very top of the file
"use memo";

// All functions in this file will be compiled
function Component1() {
  return <div>Compiled</div>;
}

function Component2() {
  return <div>Also compiled</div>;
}

// Can be overridden at function level
function Component3() {
  "use no memo"; // இது module directive-ஐ override செய்கிறது
  return <div>Not compiled</div>;
}
```

### Compilation modes interaction {/*compilation-modes*/}

உங்கள் [`compilationMode`](/reference/react-compiler/compilationMode)-ஐப் பொறுத்து directives வேறுபட்டு செயல்படும்:

* **`annotation` mode**: `"use memo"` உள்ள functions மட்டும் compile செய்யப்படும்
* **`infer` mode**: எதை compile செய்ய வேண்டும் என்பதை compiler தீர்மானிக்கும்; directives அந்த முடிவுகளை override செய்யும்
* **`all` mode**: எல்லாமே compile செய்யப்படும்; `"use no memo"` குறிப்பிட்ட functions-ஐ exclude செய்யலாம்

---

## சிறந்த நடைமுறைகள் {/*best-practices*/}

### Directives-ஐ குறைவாக பயன்படுத்துங்கள் {/*use-sparingly*/}

Directives escape hatches. Compiler-ஐ project level-இல் configure செய்வதையே விரும்புங்கள்:

```js
// ✅ Good - project-wide configuration
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer'
    }]
  ]
}

// ⚠️ Use directives only when needed
function SpecialCase() {
  "use no memo"; // இது ஏன் தேவை என்பதை document செய்யுங்கள்
  // ...
}
```

### Directive usage-ஐ document செய்யுங்கள் {/*document-usage*/}

ஒரு directive ஏன் பயன்படுத்தப்படுகிறது என்பதை எப்போதும் விளக்குங்கள்:

```js
// ✅ Good - clear explanation
function DataGrid() {
  "use no memo"; // TODO: dynamic row heights சிக்கலை சரிசெய்த பிறகு அகற்றவும் (JIRA-123)
  // Complex grid implementation
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### அகற்றுவதற்கான திட்டம் {/*plan-removal*/}

Opt-out directives தற்காலிகமாக இருக்க வேண்டும்:

1. TODO comment உடன் directive-ஐச் சேர்க்கவும்
2. Tracking issue உருவாக்கவும்
3. அடிப்படை பிரச்சினையைச் சரிசெய்யவும்
4. Directive-ஐ அகற்றவும்

```js
function TemporaryWorkaround() {
  "use no memo"; // TODO: ThirdPartyLib-ஐ v2.0-க்கு upgrade செய்த பிறகு அகற்றவும்
  return <ThirdPartyComponent />;
}
```

---

## பொதுவான patterns {/*common-patterns*/}

### படிப்படியான adoption {/*gradual-adoption*/}

பெரிய codebase-இல் React Compiler-ஐ adopt செய்யும்போது:

```js
// Start with annotation mode
{
  compilationMode: 'annotation'
}

// Opt in stable components
function StableComponent() {
  "use memo";
  // Well-tested component
}

// Later, switch to infer mode and opt out problematic ones
function ProblematicComponent() {
  "use no memo"; // அகற்றுவதற்கு முன் சிக்கல்களை சரிசெய்யுங்கள்
  // ...
}
```


---

## சிக்கல் தீர்வு {/*troubleshooting*/}

Directives தொடர்பான குறிப்பிட்ட சிக்கல்களுக்கு, இவற்றில் உள்ள troubleshooting sections-ஐப் பார்க்கவும்:

* [`"use memo"` troubleshooting](/reference/react-compiler/directives/use-memo#troubleshooting)
* [`"use no memo"` troubleshooting](/reference/react-compiler/directives/use-no-memo#troubleshooting)

### பொதுவான சிக்கல்கள் {/*common-issues*/}

1. **Directive புறக்கணிக்கப்படுகிறது**: Placement (முதலில் இருக்க வேண்டும்) மற்றும் spelling-ஐச் சரிபார்க்கவும்
2. **Compilation இன்னும் நடக்கிறது**: `ignoreUseNoForget` setting-ஐச் சரிபார்க்கவும்
3. **Module directive வேலை செய்யவில்லை**: அது அனைத்து imports-க்கும் முன் இருக்கிறதா என்பதை உறுதிசெய்யவும்

---

## மேலும் பார்க்க {/*see-also*/}

* [`compilationMode`](/reference/react-compiler/compilationMode) - எதை optimize செய்ய வேண்டும் என்பதை compiler எப்படி தேர்வு செய்கிறது என்பதை configure செய்யுங்கள்
* [`Configuration`](/reference/react-compiler/configuration) - முழு compiler configuration options
* [React Compiler documentation](https://react.dev/learn/react-compiler) - தொடங்குவதற்கான வழிகாட்டி
