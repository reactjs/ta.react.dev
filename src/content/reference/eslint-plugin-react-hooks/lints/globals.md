---
title: globals
---

<Intro>

Render நடக்கும் போது globals-க்கு assignment/mutation செய்வதை எதிர்த்து validate செய்கிறது. இது [side effects render-க்கு வெளியே இயங்க வேண்டும்](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) என்பதை உறுதிசெய்வதின் ஒரு பகுதி.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

Global variables React-இன் கட்டுப்பாட்டுக்கு வெளியே உள்ளன. Render நடக்கும் போது அவற்றை மாற்றினால், rendering pure என்று React வைத்திருக்கும் கருதுகோளை நீங்கள் உடைக்கிறீர்கள். இதனால் components development மற்றும் production-இல் வேறுபட்டு நடக்கலாம், Fast Refresh உடையலாம், மேலும் React Compiler போன்ற அம்சங்களால் உங்கள் app-ஐ optimize செய்வது சாத்தியமற்றதாகலாம்.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Global counter
let renderCount = 0;
function Component() {
  renderCount++; // Mutating global
  return <div>Count: {renderCount}</div>;
}

// ❌ Modifying window properties
function Component({userId}) {
  window.currentUser = userId; // Global mutation
  return <div>User: {userId}</div>;
}

// ❌ Global array push
const events = [];
function Component({event}) {
  events.push(event); // Mutating global array
  return <div>Events: {events.length}</div>;
}

// ❌ Cache manipulation
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // Modifying cache during render
  }
  return <div>{cache[id]}</div>;
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Use state for counters
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ Use context for global values
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ Synchronize external state with React
function Component({title}) {
  useEffect(() => {
    document.title = title; // OK in effect
  }, [title]);

  return <div>Page: {title}</div>;
}
```
