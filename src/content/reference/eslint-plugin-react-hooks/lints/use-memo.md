---
title: use-memo
---

<Intro>

`useMemo` hook return value-உடன் பயன்படுத்தப்படுகிறதா என்பதை validate செய்கிறது. மேலும் தகவல்களுக்கு [`useMemo` docs](/reference/react/useMemo)-ஐப் பார்க்கவும்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

`useMemo` expensive values-ஐ compute செய்து cache செய்யத்தான்; side effects-க்காக அல்ல. Return value இல்லாமல் `useMemo` `undefined` return செய்யும்; இது அதன் நோக்கத்தையே வீணாக்குகிறது, மேலும் நீங்கள் தவறான hook-ஐப் பயன்படுத்துகிறீர்கள் என்பதைக் குறிக்கலாம்.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ No return value
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // Missing return!
  }, [data]);

  return <div>{processed}</div>; // Always undefined
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Returns computed value
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## Troubleshooting {/*troubleshooting*/}

### Dependencies மாறும்போது side effects இயக்க வேண்டும் {/*side-effects*/}

Side effects-க்காக `useMemo` பயன்படுத்த முயற்சிக்கலாம்:

{/* TODO(@poteto) fix compiler validation to check for unassigned useMemos */}
```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Wrong: Side effects in useMemo
function Component({user}) {
  // No return value, just side effect
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // Not assigned to a variable
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

Side effect user interaction-க்கு பதிலாக நடக்க வேண்டுமெனில், அந்த side effect-ஐ event-உடன் சேர்த்து வைப்பது சிறந்தது:

```js
// ✅ Good: Side effects in event handlers
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // Other click logic...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

Side effect React state-ஐ ஏதேனும் external state-உடன் synchronize செய்தால் (அல்லது மாறாக), `useEffect` பயன்படுத்துங்கள்:

```js
// ✅ Good: Synchronization in useEffect
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>Current theme: {theme}</div>;
}
```
