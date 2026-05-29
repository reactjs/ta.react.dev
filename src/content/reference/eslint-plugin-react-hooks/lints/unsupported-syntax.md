---
title: unsupported-syntax
---

<Intro>

React Compiler ஆதரிக்காத syntax-ஐ எதிர்த்து validate செய்கிறது. தேவையெனில், standalone utility function போன்ற React-க்கு வெளியே இந்த syntax-ஐ இன்னும் பயன்படுத்தலாம்.

</Intro>

## விதி விவரங்கள் {/*rule-details*/}

Optimizations apply செய்ய React Compiler உங்கள் code-ஐ statically analyze செய்ய வேண்டும். `eval` மற்றும் `with` போன்ற அம்சங்கள் compile time-இல் code என்ன செய்கிறது என்பதை statically புரிந்து கொள்வதை சாத்தியமற்றதாக்குகின்றன; எனவே அவற்றைப் பயன்படுத்தும் components-ஐ compiler optimize செய்ய முடியாது.

### செல்லாதது {/*invalid*/}

இந்த விதிக்கான தவறான code உதாரணங்கள்:

```js
// ❌ Using eval in component
function Component({ code }) {
  const result = eval(code); // Can't be analyzed
  return <div>{result}</div>;
}

// ❌ Using with statement
function Component() {
  with (Math) { // Changes scope dynamically
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ Dynamic property access with eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### செல்லுபடியாகும் {/*valid*/}

இந்த விதிக்கான சரியான code உதாரணங்கள்:

```js
// ✅ Use normal property access
function Component({propName, props}) {
  const value = props[propName]; // Analyzable
  return <div>{value}</div>;
}

// ✅ Use standard Math methods
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## Troubleshooting {/*troubleshooting*/}

### Dynamic code-ஐ evaluate செய்ய வேண்டும் {/*evaluate-dynamic-code*/}

User வழங்கிய code-ஐ evaluate செய்ய வேண்டியிருக்கலாம்:

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Wrong: eval in component
function Calculator({expression}) {
  const result = eval(expression); // Unsafe and unoptimizable
  return <div>Result: {result}</div>;
}
```

அதற்கு பதிலாக பாதுகாப்பான expression parser ஒன்றைப் பயன்படுத்துங்கள்:

```js
// ✅ Better: Use a safe parser
import {evaluate} from 'mathjs'; // or similar library

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // Safe mathematical expression evaluation
      setResult(evaluate(expression));
    } catch (error) {
      setResult('Invalid expression');
    }
  };

  return (
    <div>
      <button onClick={calculate}>Calculate</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
```

<Note>

User input-உடன் `eval`-ஐ ஒருபோதும் பயன்படுத்த வேண்டாம் - அது security risk. Mathematical expressions, JSON parsing, அல்லது template evaluation போன்ற குறிப்பிட்ட use cases-க்கு dedicated parsing libraries-ஐப் பயன்படுத்துங்கள்.

</Note>
