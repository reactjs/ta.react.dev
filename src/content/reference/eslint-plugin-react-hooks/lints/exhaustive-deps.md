---
title: exhaustive-deps
---

<Intro>

React hooks-க்கான dependency arrays எல்லா தேவையான dependencies-ஐ கொண்டுள்ளனவா என்பதை validate செய்கிறது.

</Intro>

## Rule விவரங்கள் {/*rule-details*/}

`useEffect`, `useMemo`, `useCallback` போன்ற React hooks dependency arrays-ஐ ஏற்கின்றன. இந்த hooks-க்குள் reference செய்யப்படும் value dependency array-இல் சேர்க்கப்படவில்லை என்றால், அந்த dependency மாறும்போது React effect-ஐ மீண்டும் run செய்யாது அல்லது value-ஐ மீண்டும் calculate செய்யாது. இதனால் hook பழைய values-ஐப் பயன்படுத்தும் stale closures ஏற்படும்.

## பொதுவான மீறல்கள் {/*common-violations*/}

ஒரு effect எப்போது run ஆக வேண்டும் என்பதை கட்டுப்படுத்த dependencies குறித்து React-ஐ "trick" செய்ய முயன்றால் இந்த error அடிக்கடி ஏற்படும். Effects உங்கள் component-ஐ external systems உடன் synchronize செய்ய வேண்டும். Effect எந்த values-ஐப் பயன்படுத்துகிறது என்பதை dependency array React-க்கு சொல்கிறது; அதனால் எப்போது re-synchronize செய்ய வேண்டும் என்பதை React அறியும்.

நீங்கள் linter-உடன் போராடிக்கொண்டிருக்கிறீர்கள் எனத் தோன்றினால், உங்கள் code-ஐ restructure செய்ய வேண்டியிருக்கலாம். எப்படி செய்வது என்பதை அறிய [Removing Effect Dependencies](/learn/removing-effect-dependencies)-ஐப் பார்க்கவும்.

### Invalid {/*invalid*/}

இந்த rule-க்கான தவறான code உதாரணங்கள்:

```js
// ❌ Missing dependency
useEffect(() => {
  console.log(count);
}, []); // 'count' விடுபட்டுள்ளது

// ❌ Missing prop
useEffect(() => {
  fetchUser(userId);
}, []); // 'userId' விடுபட்டுள்ளது

// ❌ Incomplete dependencies
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // 'sortOrder' விடுபட்டுள்ளது
```

### Valid {/*valid*/}

இந்த rule-க்கான சரியான code உதாரணங்கள்:

```js
// ✅ All dependencies included
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ All dependencies included
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Function dependency சேர்ப்பது infinite loops ஏற்படுத்துகிறது {/*function-dependency-loops*/}

உங்களிடம் ஒரு effect உள்ளது, ஆனால் ஒவ்வொரு render-இலும் புதிய function உருவாக்குகிறீர்கள்:

```js
// ❌ Causes infinite loop
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // Infinite loop!
```

பெரும்பாலான சூழல்களில் effect தேவையில்லை. அதற்கு பதிலாக action நடக்கும் இடத்திலேயே function-ஐ call செய்யுங்கள்:

```js
// ✅ Call it from the event handler
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ Or derive during render if there's no side effect
items.forEach(item => {
  console.log(item);
});
```

உங்களுக்கு உண்மையிலேயே effect தேவைப்பட்டால் (எடுத்துக்காட்டாக, external ஒன்றுக்கு subscribe செய்ய), dependency-ஐ stable ஆக்குங்கள்:

```js
// ✅ useCallback keeps the function reference stable
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ Or move the logic straight into the effect
useEffect(() => {
  console.log(items);
}, [items]);
```

### Effect-ஐ ஒரே முறை மட்டும் run செய்தல் {/*effect-on-mount*/}

Mount ஆனபோது effect-ஐ ஒரே முறை run செய்ய விரும்புகிறீர்கள்; ஆனால் missing dependencies குறித்து linter புகார் செய்கிறது:

```js
// ❌ Missing dependency
useEffect(() => {
  sendAnalytics(userId);
}, []); // 'userId' விடுபட்டுள்ளது
```

Dependency-ஐ சேர்க்கவும் (பரிந்துரைக்கப்படுகிறது), அல்லது உண்மையில் ஒரே முறை run செய்ய வேண்டுமெனில் ref பயன்படுத்தவும்:

```js
// ✅ Include dependency
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ Or use a ref guard inside an effect
const sent = useRef(false);

useEffect(() => {
  if (sent.current) {
    return;
  }

  sent.current = true;
  sendAnalytics(userId);
}, [userId]);
```

## Options {/*options*/}

Shared ESLint settings மூலம் custom effect hooks-ஐ configure செய்யலாம் (`eslint-plugin-react-hooks` 6.1.1 மற்றும் அதன் பின்வரும் versions-இல் கிடைக்கும்):

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: Exhaustive dependencies-க்காக check செய்ய வேண்டிய custom hooks-ஐ match செய்யும் Regex pattern. இந்த configuration அனைத்து `react-hooks` rules-களிலும் shared ஆகும்.

Backward compatibility-க்காக, இந்த rule ஒரு rule-level option-ஐயும் ஏற்கிறது:

```js
{
  "rules": {
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherHook)"
    }]
  }
}
```

- `additionalHooks`: Exhaustive dependencies-க்காக check செய்ய வேண்டிய hooks-க்கான Regex. **குறிப்பு:** இந்த rule-level option குறிப்பிடப்பட்டால், shared `settings` configuration-ஐ விட இது முன்னுரிமை பெறும்.
