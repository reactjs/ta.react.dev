---
title: purity
---

<Intro>

அறியப்பட்ட impure functions-ஐ அவை அழைக்கவில்லை என்பதைச் சரிபார்த்து, [components/hooks pure ஆக உள்ளனவா](/reference/rules/components-and-hooks-must-be-pure) என்பதை validate செய்கிறது.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

React components pure functions ஆக இருக்க வேண்டும். அதே props கொடுக்கப்பட்டால், அவை எப்போதும் அதே JSX-ஐ return செய்ய வேண்டும். Components render நடக்கும் போது `Math.random()` அல்லது `Date.now()` போன்ற functions-ஐப் பயன்படுத்தினால், ஒவ்வொரு முறையும் வேறு output உருவாகும். இது React-இன் கருதுகோள்களை உடைத்து, hydration mismatches, தவறான memoization, மற்றும் கணிக்க முடியாத நடத்தை போன்ற bugs ஏற்படுத்தும்.

## பொதுவான மீறல்கள் {/*common-violations*/}

பொதுவாக, அதே inputs-க்கு வேறு value return செய்யும் எந்த API-யும் இந்த விதியை மீறுகிறது. வழக்கமான உதாரணங்கள்:

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Math.random() in render
function Component() {
  const id = Math.random(); // Different every render
  return <div key={id}>Content</div>;
}

// ❌ Date.now() for values
function Component() {
  const timestamp = Date.now(); // Changes every render
  return <div>Created at: {timestamp}</div>;
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Stable IDs from initial state
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## Troubleshooting {/*troubleshooting*/}

### தற்போதைய நேரத்தை காட்ட வேண்டும் {/*current-time*/}

Render நடக்கும் போது `Date.now()` அழைப்பது உங்கள் component-ஐ impure ஆக்கும்:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Wrong: Time changes every render
function Clock() {
  return <div>Current time: {Date.now()}</div>;
}
```

அதற்கு பதிலாக, [impure function-ஐ render-க்கு வெளியே நகர்த்துங்கள்](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent):

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Current time: {time}</div>;
}
```
