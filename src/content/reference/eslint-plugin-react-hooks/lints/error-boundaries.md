---
title: error-boundaries
---

<Intro>

Child components-இல் ஏற்படும் errors-க்கு try/catch-க்கு பதிலாக Error Boundaries பயன்படுத்தப்படுகிறதா என்பதை validate செய்கிறது.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

React rendering process நடக்கும் போது ஏற்படும் errors-ஐ try/catch blocks பிடிக்க முடியாது. Rendering methods அல்லது hooks-இல் throw செய்யப்படும் errors component tree வழியாக மேலே செல்கின்றன. இந்த errors-ஐ [Error Boundaries](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) மட்டுமே பிடிக்க முடியும்.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Try/catch won't catch render errors
function Parent() {
  try {
    return <ChildComponent />; // If this throws, catch won't help
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Using error boundary
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## Troubleshooting {/*troubleshooting*/}

### `use`-ஐ `try`/`catch`-இல் wrap செய்ய வேண்டாம் என்று linter ஏன் சொல்கிறது? {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

`use` hook வழக்கமான அர்த்தத்தில் errors throw செய்யாது; அது component execution-ஐ suspend செய்கிறது. `use` pending promise ஒன்றை சந்திக்கும்போது, component-ஐ suspend செய்து React fallback காட்ட அனுமதிக்கிறது. Suspense மற்றும் Error Boundaries மட்டுமே இந்நிலைகளை கையாள முடியும். `catch` block ஒருபோதும் இயங்காது என்பதால் குழப்பத்தைத் தவிர்க்க, `use` சுற்றி `try`/`catch` பயன்படுத்த வேண்டாம் என்று linter எச்சரிக்கிறது.

```js {expectedErrors: {'react-compiler': [5]}}
// ❌ Try/catch around `use` hook
function Component({promise}) {
  try {
    const data = use(promise); // Won't catch - `use` suspends, not throws
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // Unreachable
  }
}

// ✅ Error boundary catches `use` errors
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```
