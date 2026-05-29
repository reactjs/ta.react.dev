---
title: gating
---

<Intro>

`gating` option conditional compilation-ஐ enable செய்கிறது; runtime-இல் optimized code எப்போது பயன்படுத்தப்பட வேண்டும் என்பதை நீங்கள் கட்டுப்படுத்தலாம்.

</Intro>

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `gating` {/*gating*/}

Compiled functions-க்கு runtime feature flag gating-ஐ configure செய்கிறது.

#### வகை {/*type*/}

```
{
  source: string;
  importSpecifierName: string;
} | null
```

#### Default value {/*default-value*/}

`null`

#### பண்புகள் {/*properties*/}

- **`source`**: Feature flag-ஐ import செய்ய வேண்டிய module path
- **`importSpecifierName`**: Import செய்ய வேண்டிய exported function-ன் பெயர்

#### எச்சரிக்கைகள் {/*caveats*/}

- Gating function ஒரு boolean-ஐ return செய்ய வேண்டும்
- Compiled மற்றும் original என இரு versions-மும் bundle size-ஐ அதிகரிக்கும்
- Compiled functions உள்ள ஒவ்வொரு file-க்கும் இந்த import சேர்க்கப்படும்

---

## பயன்பாடு {/*usage*/}

### அடிப்படை feature flag அமைப்பு {/*basic-setup*/}

1. ஒரு feature flag module உருவாக்குங்கள்:

```js
// src/utils/feature-flags.js
export function shouldUseCompiler() {
  // your logic here
  return getFeatureFlag('react-compiler-enabled');
}
```

2. Compiler-ஐ configure செய்யுங்கள்:

```js
{
  gating: {
    source: './src/utils/feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

3. Compiler gated code-ஐ உருவாக்கும்:

```js
// Input
function Button(props) {
  return <button>{props.label}</button>;
}

// Output (simplified)
import { shouldUseCompiler } from './src/utils/feature-flags';

const Button = shouldUseCompiler()
  ? function Button_optimized(props) { /* compiled version */ }
  : function Button_original(props) { /* original version */ };
```

Gating function module time-இல் ஒரே முறை evaluate செய்யப்படும் என்பதை கவனியுங்கள். ஆகவே JS bundle parse மற்றும் evaluate ஆன பிறகு, எந்த component பயன்படுத்தப்பட வேண்டும் என்ற தேர்வு browser session முழுவதும் static-ஆக இருக்கும்.

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Feature flag வேலை செய்யவில்லை {/*flag-not-working*/}

உங்கள் flag module சரியான function-ஐ export செய்கிறதா என்பதைச் சரிபார்க்கவும்:

```js
// ❌ Wrong: Default export
export default function shouldUseCompiler() {
  return true;
}

// ✅ Correct: Named export matching importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### Import errors {/*import-errors*/}

`source` path சரியாக இருக்கிறதா என்பதை உறுதிசெய்யுங்கள்:

```js
// ❌ Wrong: Relative to babel.config.js
{
  source: './src/flags',
  importSpecifierName: 'flag'
}

// ✅ Correct: Module resolution path
{
  source: '@myapp/feature-flags',
  importSpecifierName: 'flag'
}

// ✅ Also correct: Absolute path from project root
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```
