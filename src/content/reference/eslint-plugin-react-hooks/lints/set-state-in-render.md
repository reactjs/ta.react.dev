---
title: set-state-in-render
---

<Intro>

Render நடக்கும் போது state-ஐ unconditionally அமைப்பதை எதிர்த்து validate செய்கிறது; இது கூடுதல் renders மற்றும் infinite render loops ஏற்படுத்தக்கூடும்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

Render நடக்கும் போது `setState`-ஐ unconditionally அழைப்பது, தற்போதைய render முடிவதற்கு முன் மற்றொரு render-ஐ trigger செய்கிறது. இது உங்கள் app crash ஆகும் infinite loop ஒன்றை உருவாக்கும்.

## பொதுவான மீறல்கள் {/*common-violations*/}

### செல்லாதது {/*invalid*/}

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Unconditional setState directly in render
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // Infinite loop!
  return <div>{count}</div>;
}
```

### செல்லுபடியாகும் {/*valid*/}

```js
// ✅ Derive during render
function Component({items}) {
  const sorted = [...items].sort(); // Just calculate it in render
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ Set state in event handler
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Derive from props instead of setting state
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ Conditionally derive state from props and state from previous renders
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // This condition makes it valid
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## Troubleshooting {/*troubleshooting*/}

### State-ஐ prop ஒன்றுடன் sync செய்ய வேண்டும் {/*clamp-state-to-prop*/}

Render ஆன பிறகு state-ஐ "fix" செய்ய முயல்வது ஒரு பொதுவான பிரச்சினை. Counter ஒன்று `max` prop-ஐ விட அதிகமாகாமல் இருக்க வேண்டும் என்று வைத்துக்கொள்ளுங்கள்:

```js
// ❌ Wrong: clamps during render
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

`count` `max`-ஐ கடந்தவுடன் infinite loop trigger ஆகும்.

அதற்கு பதிலாக, இந்த logic-ஐ event-க்கு (state முதலில் அமைக்கப்படும் இடம்) நகர்த்துவது பெரும்பாலும் சிறந்தது. உதாரணமாக, state update செய்யும் தருணத்திலேயே maximum-ஐ enforce செய்யலாம்:

```js
// ✅ Clamp when updating
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

இப்போது setter click-க்கு பதிலாக மட்டுமே இயங்கும்; React render-ஐ வழக்கம்போல் முடிக்கும்; `count` ஒருபோதும் `max`-ஐ கடக்காது.

அரிதான சில நிலைகளில், முந்தைய renders-இலிருந்து கிடைக்கும் தகவலின் அடிப்படையில் state-ஐ adjust செய்ய வேண்டியிருக்கலாம். அத்தகைய நிலைகளில், state-ஐ conditionally அமைக்கும் [இந்த pattern](https://react.dev/reference/react/useState#storing-information-from-previous-renders)-ஐப் பின்பற்றுங்கள்.
