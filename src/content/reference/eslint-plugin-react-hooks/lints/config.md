---
title: config
---

<Intro>

Compiler [configuration options](/reference/react-compiler/configuration)-ஐ validate செய்கிறது.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

React Compiler-இன் நடத்தையை கட்டுப்படுத்த பல்வேறு [configuration options](/reference/react-compiler/configuration) ஏற்கப்படுகின்றன. உங்கள் configuration சரியான option names மற்றும் value types பயன்படுத்துகிறதா என்பதை இந்த விதி validate செய்கிறது; இதனால் typos அல்லது தவறான settings காரணமாக அமைதியாக தோல்வியடைவது தவிர்க்கப்படுகிறது.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Unknown option name
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Typo: should be compilationMode
    }]
  ]
};

// ❌ Invalid option value
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Invalid: use 'all' or 'infer'
    }]
  ]
};
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Valid compiler configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## Troubleshooting {/*troubleshooting*/}

### Configuration எதிர்பார்த்தபடி வேலை செய்யவில்லை {/*config-not-working*/}

உங்கள் compiler configuration-இல் typos அல்லது தவறான values இருக்கலாம்:

```js
// ❌ Wrong: Common configuration mistakes
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Typo in option name
      compilationMod: 'all',
      // Wrong value type
      panicThreshold: true,
      // Unknown option
      optimizationLevel: 'max'
    }]
  ]
};
```

செல்லுபடியாகும் options-க்கு [configuration documentation](/reference/react-compiler/configuration)-ஐப் பார்க்கவும்:

```js
// ✅ Better: Valid configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // or 'infer'
      panicThreshold: 'none', // or 'critical_errors', 'all_errors'
      // Only use documented options
    }]
  ]
};
```
