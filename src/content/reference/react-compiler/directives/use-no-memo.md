---
title: "use no memo"
titleForTitleTag: "'use no memo' directive"
---

<Intro>

`"use no memo"` ஒரு function-ஐ React Compiler optimize செய்வதைத் தடுக்கிறது.

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

React Compiler optimization-ஐத் தடுக்க, ஒரு function-ன் தொடக்கத்தில் `"use no memo"` சேர்க்கவும்.

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

ஒரு function-இல் `"use no memo"` இருந்தால், optimization நேரத்தில் React Compiler அதை முழுவதும் skip செய்யும். Debug செய்யும்போது அல்லது compiler உடன் சரியாக வேலை செய்யாத code-ஐ கையாளும்போது, இது தற்காலிக escape hatch-ஆக பயனுள்ளது.

#### எச்சரிக்கைகள் {/*caveats*/}

* `"use no memo"` function body-யின் முற்றிலும் தொடக்கத்தில், எந்த imports அல்லது பிற code-க்கும் முன் இருக்க வேண்டும் (comments சரி).
* Directive double quotes அல்லது single quotes-இல் எழுதப்பட வேண்டும்; backticks-இல் அல்ல.
* Directive துல்லியமாக `"use no memo"` அல்லது அதன் alias `"use no forget"` ஆக இருக்க வேண்டும்.
* இந்த directive எல்லா compilation modes மற்றும் பிற directives-ஐ விட முன்னுரிமை பெறும்.
* இது நிரந்தர தீர்வாக அல்ல, தற்காலிக debugging கருவியாகவே கருதப்படுகிறது.

### `"use no memo"` optimization-இலிருந்து எப்படி opt out செய்கிறது {/*how-use-no-memo-opts-out*/}

React Compiler optimizations-ஐப் பயன்படுத்த build time-இல் உங்கள் code-ஐ analyze செய்கிறது. `"use no memo"` compiler-க்கு ஒரு function-ஐ முழுவதும் skip செய்ய சொல்லும் explicit boundary-ஐ உருவாக்குகிறது.

இந்த directive மற்ற எல்லா settings-ஐ விட முன்னுரிமை பெறுகிறது:
* `all` mode-இல்: global setting இருந்தாலும் function skip செய்யப்படும்
* `infer` mode-இல்: heuristics அதை optimize செய்யக் கூடியதாக இருந்தாலும் function skip செய்யப்படும்

React Compiler enable செய்யப்படாதது போலவே compiler இந்த functions-ஐ கையாளும்; அவை எழுதப்பட்டபடியே இருக்கும்.

### `"use no memo"` எப்போது பயன்படுத்த வேண்டும் {/*when-to-use*/}

`"use no memo"`-ஐ குறைவாகவும் தற்காலிகமாகவும் மட்டுமே பயன்படுத்த வேண்டும். பொதுவான சூழல்கள்:

#### Compiler சிக்கல்களை debug செய்தல் {/*debugging-compiler*/}
Compiler பிரச்சினை ஏற்படுத்துகிறது என்று சந்தேகித்தால், பிரச்சினையை தனியாக கண்டறிய optimization-ஐ தற்காலிகமாக disable செய்யுங்கள்:

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: issue #123 சரிசெய்த பிறகு அகற்றவும்

  // Rules of React violations that weren't statically detected
  // ...
}
```

#### Third-party library integration {/*third-party*/}
Compiler உடன் compatible இல்லாமல் இருக்கக்கூடிய libraries-ஐ integrate செய்யும்போது:

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // Compiler தவறாக optimize செய்யக்கூடிய side effects உள்ளன
  // ...
}
```

---

## பயன்பாடு {/*usage*/}

React Compiler அந்த function-ஐ optimize செய்வதைத் தடுக்க, `"use no memo"` directive function body-யின் தொடக்கத்தில் வைக்கப்படுகிறது:

```js
function MyComponent() {
  "use no memo";
  // Function body
}
```

அந்த module-இல் உள்ள அனைத்து functions-க்கும் பொருந்தும் வகையில் directive-ஐ file-ன் மேற்பகுதியிலும் வைக்கலாம்:

```js
"use no memo";

// All functions in this file will be skipped by the compiler
```

Function level-இல் உள்ள `"use no memo"` module level directive-ஐ override செய்கிறது.

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Directive compilation-ஐத் தடுக்கவில்லை {/*not-preventing*/}

`"use no memo"` வேலை செய்யவில்லை என்றால்:

```js
// ❌ Wrong - directive after code
function Component() {
  const data = getData();
  "use no memo"; // மிகவும் தாமதம்!
}

// ✅ Correct - directive first
function Component() {
  "use no memo";
  const data = getData();
}
```

இதையும் சரிபார்க்கவும்:
* Spelling - துல்லியமாக `"use no memo"` ஆக இருக்க வேண்டும்
* Quotes - single அல்லது double quotes பயன்படுத்த வேண்டும்; backticks அல்ல

### சிறந்த நடைமுறைகள் {/*best-practices*/}

நீங்கள் optimization-ஐ ஏன் disable செய்கிறீர்கள் என்பதை **எப்போதும் document செய்யுங்கள்**:

```js
// ✅ Good - clear explanation and tracking
function DataProcessor() {
  "use no memo"; // TODO: Rules of React violation சரிசெய்த பிறகு அகற்றவும்
  // ...
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### மேலும் பார்க்க {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - Compilation-க்கு opt in செய்யுங்கள்
* [React Compiler](/learn/react-compiler) - தொடங்குவதற்கான வழிகாட்டி
