---
title: preserve-manual-memoization
---

<Intro>

ஏற்கனவே உள்ள manual memoization-ஐ compiler பாதுகாக்கிறதா என்பதை validate செய்கிறது. React Compiler-இன் inference [ஏற்கனவே உள்ள manual memoization-ஐப் பொருந்தினாலோ அதைவிட மேம்பட்டதாக இருந்தாலோ](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo) மட்டுமே components மற்றும் hooks-ஐ compile செய்யும்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

React Compiler உங்கள் ஏற்கனவே உள்ள `useMemo`, `useCallback`, மற்றும் `React.memo` calls-ஐ பாதுகாக்கிறது. நீங்கள் ஏதாவது ஒன்றை கைமுறையாக memoize செய்திருந்தால், அதற்கு நல்ல காரணம் உண்டு என்று compiler கருதி அதை நீக்காது. ஆனால் முழுமையற்ற dependencies உங்கள் code-இன் data flow-ஐ compiler புரிந்துகொண்டு மேலும் optimizations செய்யத் தடையாகின்றன.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Missing dependencies in useMemo
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // Missing 'filter' dependency
  );

  return <List items={filtered} />;
}

// ❌ Missing dependencies in useCallback
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // Missing 'value'

  return <button onClick={handleClick}>Update</button>;
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Complete dependencies
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // All dependencies included
  );

  return <List items={filtered} />;
}

// ✅ Or let the compiler handle it
function Component({ data, filter }) {
  // No manual memoization needed
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## Troubleshooting {/*troubleshooting*/}

### என் manual memoization-ஐ நீக்க வேண்டுமா? {/*remove-manual-memoization*/}

React Compiler manual memoization-ஐ தேவையற்றதாக ஆக்குகிறதா என்று நீங்கள் யோசிக்கலாம்:

```js
// Do I still need this?
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

React Compiler பயன்படுத்தினால், இதைப் பாதுகாப்பாக நீக்கலாம்:

```js
// ✅ Better: Let the compiler optimize
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```
