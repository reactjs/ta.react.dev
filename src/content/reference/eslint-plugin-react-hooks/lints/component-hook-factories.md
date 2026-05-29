---
title: component-hook-factories
---

<Intro>

Nested components அல்லது hooks-ஐ வரையறுக்கும் higher order functions-ஐ எதிர்த்து validate செய்கிறது. Components மற்றும் hooks module level-இல் வரையறுக்கப்பட வேண்டும்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

மற்ற functions உள்ளே components அல்லது hooks-ஐ வரையறுப்பது ஒவ்வொரு call-இலும் புதிய instances உருவாக்கும். React ஒவ்வொன்றையும் முற்றிலும் வேறு component ஆகக் கருதி, முழு component tree-ஐ அழித்து மறுபடியும் உருவாக்கும்; இதனால் state அனைத்தும் இழக்கப்படும் மற்றும் performance பிரச்சினைகள் ஏற்படும்.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js {expectedErrors: {'react-compiler': [14]}}
// ❌ Factory function creating components
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Component defined inside component
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hook factory function
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Component defined at module level
function Component({ defaultValue }) {
  // ...
}

// ✅ Custom hook at module level
function useData(endpoint) {
  // ...
}
```

## Troubleshooting {/*troubleshooting*/}

### Dynamic component behavior தேவை {/*dynamic-behavior*/}

Customized components உருவாக்க factory தேவை என்று நினைக்கலாம்:

```js
// ❌ Wrong: Factory pattern
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

அதற்கு பதிலாக [JSX-ஐ children ஆக pass செய்யுங்கள்](/learn/passing-props-to-a-component#passing-jsx-as-children):

```js
// ✅ Better: Pass JSX as children
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```
