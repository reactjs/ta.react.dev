---
title: refs
---

<Intro>

Refs சரியாகப் பயன்படுத்தப்படுகிறதா, render நடக்கும் போது read/write செய்யப்படுகிறதா என்பதை validate செய்கிறது. [`useRef()` usage](/reference/react/useRef#usage)-இல் உள்ள "pitfalls" பகுதியைப் பார்க்கவும்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

Refs rendering-க்கு பயன்படுத்தப்படாத values-ஐ வைத்திருக்கும். State போலல்லாமல், ref மாற்றுவது re-render trigger செய்யாது. Render நடக்கும் போது `ref.current`-ஐ read அல்லது write செய்வது React-இன் எதிர்பார்ப்புகளை உடைக்கும். Refs-ஐ வாசிக்க முயற்சிக்கும் நேரத்தில் அவை initialize செய்யப்படாமல் இருக்கலாம்; அவற்றின் values stale அல்லது inconsistent ஆக இருக்கலாம்.

## இது refs-ஐ எவ்வாறு கண்டறிகிறது {/*how-it-detects-refs*/}

Ref என்று அறிந்த values-க்கு மட்டுமே lint இந்த விதிகளைப் பயன்படுத்தும். Compiler பின்வரும் patterns-இல் ஏதாவது ஒன்றைக் கண்டால், value ref என்று infer செய்யப்படும்:

- `useRef()` அல்லது `React.createRef()`-இலிருந்து return ஆனது.

  ```js
  const scrollRef = useRef(null);
  ```

- `ref` என்று பெயரிடப்பட்ட அல்லது `Ref`-இல் முடியும் identifier, `.current`-இலிருந்து read செய்யவோ அதற்கு write செய்யவோ செய்கிறது.

  ```js
  buttonRef.current = node;
  ```

- JSX `ref` prop மூலம் pass செய்யப்பட்டது (உதாரணம் `<div ref={someRef} />`).

  ```jsx
  <input ref={inputRef} />
  ```

ஏதாவது ஒன்று ref ஆகக் குறிக்கப்பட்ட பிறகு, assignments, destructuring, அல்லது helper calls வழியாக அந்த value-ஐ அந்த inference பின்தொடரும். Ref-ஐ argument ஆகப் பெற்ற மற்றொரு function உள்ளே `ref.current` access செய்யப்பட்டாலும், lint violations-ஐ surface செய்ய இதனால் முடிகிறது.

## பொதுவான மீறல்கள் {/*common-violations*/}

- Render நடக்கும் போது `ref.current` வாசித்தல்
- Render நடக்கும் போது `refs` update செய்தல்
- State ஆக இருக்க வேண்டிய values-க்கு `refs` பயன்படுத்துதல்

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Reading ref during render
function Component() {
  const ref = useRef(0);
  const value = ref.current; // Don't read during render
  return <div>{value}</div>;
}

// ❌ Modifying ref during render
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // Don't modify during render
  return <div />;
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Read ref in effects/handlers
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // OK in effect
    }
  });

  return <div ref={ref} />;
}

// ✅ Use state for UI values
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Lazy initialization of ref value
function Component() {
  const ref = useRef(null);

  // Initialize only once on first use
  if (ref.current === null) {
    ref.current = expensiveComputation(); // OK - lazy initialization
  }

  const handleClick = () => {
    console.log(ref.current); // Use the initialized value
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## Troubleshooting {/*troubleshooting*/}

### `.current` கொண்ட என் plain object-ஐ lint flag செய்தது {/*plain-object-current*/}

Name heuristic திட்டமிட்டே `ref.current` மற்றும் `fooRef.current`-ஐ உண்மையான refs ஆகக் கருதுகிறது. நீங்கள் custom container object ஒன்றை model செய்கிறீர்கள் என்றால், வேறு பெயரைத் தேர்ந்தெடுக்கவும் (உதாரணமாக `box`) அல்லது mutable value-ஐ state-க்கு நகர்த்தவும். Rename செய்தால் compiler அதை ref என்று infer செய்வதை நிறுத்தும்; அதனால் lint தவிர்க்கப்படும்.
