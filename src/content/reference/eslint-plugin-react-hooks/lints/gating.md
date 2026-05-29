---
title: gating
---

<Intro>

[Gating mode](/reference/react-compiler/gating) configuration-ஐ validate செய்கிறது.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

Gating mode, குறிப்பிட்ட components-ஐ optimization-க்காகக் குறிக்கும் மூலம் React Compiler-ஐ படிப்படியாக ஏற்றுக்கொள்ள உதவுகிறது. Compiler எந்த components-ஐ process செய்ய வேண்டும் என்பதை அறிய, உங்கள் gating configuration செல்லுபடியாக உள்ளதா என்பதை இந்த விதி உறுதிசெய்கிறது.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Missing required fields
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Missing 'source' field
      }
    }]
  ]
};

// ❌ Invalid gating type
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Should be object
    }]
  ]
};
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Complete gating configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // exported function name
        source: 'featureFlags' // module name
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ No gating (compile everything)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // No gating field - compiles all components
    }]
  ]
};
```
