---
title: static-components
---

<Intro>

Components static ஆக உள்ளனவா, ஒவ்வொரு render-இலும் மறுபடியும் உருவாக்கப்படுகிறதா என்பதை validate செய்கிறது. Dynamically மறுபடியும் உருவாக்கப்படும் components state-ஐ reset செய்து அதிகப்படியான re-rendering-ஐ trigger செய்யலாம்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

மற்ற components உள்ளே வரையறுக்கப்படும் components ஒவ்வொரு render-இலும் மறுபடியும் உருவாக்கப்படுகின்றன. React ஒவ்வொன்றையும் புதிய component type ஆகக் காண்கிறது; பழையதை unmount செய்து புதியதை mount செய்யும் போது state மற்றும் DOM nodes அனைத்தும் அழிக்கப்படுகின்றன.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Component defined inside component
function Parent() {
  const ChildComponent = () => { // New component every render!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // State resets every render
}

// ❌ Dynamic component creation
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Components at module level
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // Reference existing component
    : TextComponent;

  return <Component />;
}
```

## Troubleshooting {/*troubleshooting*/}

### வேறு components-ஐ conditionally render செய்ய வேண்டும் {/*conditional-components*/}

Local state-ஐ அணுக components-ஐ உள்ளே வரையறுக்கலாம் என்று நினைக்கலாம்:

```js {expectedErrors: {'react-compiler': [13]}}
// ❌ Wrong: Inner component to access parent state
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // Recreated every render!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

அதற்கு பதிலாக data-வை props ஆக pass செய்யுங்கள்:

```js
// ✅ Better: Pass props to static component
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

Local variables-ஐ அணுக மற்ற components உள்ளே components வரையறுக்க வேண்டும் என்று தோன்றினால், அதற்கு பதிலாக props pass செய்ய வேண்டும் என்பதற்கான அறிகுறி அது. இது components-ஐ மீண்டும் பயன்படுத்தக்கூடியதாகவும் test செய்ய நேரடியானதாகவும் ஆக்கும்.

</Note>
