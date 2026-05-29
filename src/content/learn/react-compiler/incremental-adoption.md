---
title: Incremental Adoption
---

<Intro>
React Compiler-ஐ incremental-ஆக adopt செய்யலாம்; முதலில் உங்கள் codebase-ன் குறிப்பிட்ட பகுதிகளில் முயற்சிக்க இது அனுமதிக்கிறது. Existing projects-இல் compiler-ஐ படிப்படியாக rollout செய்வது எப்படி என்பதை இந்த guide காட்டுகிறது.
</Intro>

<YouWillLearn>

* Incremental adoption ஏன் பரிந்துரைக்கப்படுகிறது
* Directory-based adoption-க்கு Babel overrides பயன்படுத்துதல்
* Opt-in compilation-க்கு "use memo" directive பயன்படுத்துதல்
* Components-ஐ exclude செய்ய "use no memo" directive பயன்படுத்துதல்
* Gating உடன் runtime feature flags
* உங்கள் adoption progress-ஐ monitor செய்தல்

</YouWillLearn>

## Incremental adoption ஏன்? {/*why-incremental-adoption*/}

React Compiler உங்கள் முழு codebase-ஐ தானாக optimize செய்ய வடிவமைக்கப்பட்டுள்ளது; ஆனால் அதை ஒரே நேரத்தில் முழுவதும் adopt செய்ய வேண்டியதில்லை. Incremental adoption rollout process மீது control தருகிறது; app-ன் சிறிய பகுதிகளில் compiler-ஐ test செய்து, பிறகு மீதிப் பகுதிகளுக்கு விரிவாக்கலாம்.

சிறியதாக தொடங்குவது compiler optimizations மீது நம்பிக்கை உருவாக்க உதவும். Compiled code உடன் உங்கள் app சரியாக behave செய்கிறதா என்பதை verify செய்யலாம், performance improvements-ஐ measure செய்யலாம், உங்கள் codebase-க்கு specific ஆன edge cases-ஐ identify செய்யலாம். Stability critical ஆன production applications-க்கு இந்த approach மிகவும் பயனுள்ளதாகும்.

Compiler கண்டுபிடிக்கக்கூடிய Rules of React violations-ஐ address செய்வதையும் incremental adoption உதவுகிறது. முழு codebase முழுவதும் violations-ஐ ஒரே நேரத்தில் fix செய்வதற்கு பதிலாக, compiler coverage விரிவடையும் போதெல்லாம் அவற்றை systematic-ஆக tackle செய்யலாம். இதனால் migration manageable ஆகும்; bugs introduce செய்யும் risk குறையும்.

உங்கள் code-ன் எந்த பகுதிகள் compile செய்யப்பட வேண்டும் என்பதை control செய்வதன் மூலம், compiler optimizations-ன் real-world impact-ஐ measure செய்ய A/B tests-யும் run செய்யலாம். இந்த data, full adoption பற்றிய informed decisions எடுக்கவும் உங்கள் team-க்கு value-வை demonstrate செய்யவும் உதவும்.

## Incremental adoption-க்கு அணுகுமுறைகள் {/*approaches-to-incremental-adoption*/}

React Compiler-ஐ incremental-ஆக adopt செய்ய மூன்று முக்கிய approaches உள்ளன:

1. **Babel overrides** - குறிப்பிட்ட directories-க்கு compiler apply செய்தல்
2. **"use memo" மூலம் opt-in** - Explicit ஆக opt in செய்கிற components-ஐ மட்டுமே compile செய்தல்
3. **Runtime gating** - Feature flags மூலம் compilation-ஐ control செய்தல்

முழு rollout-க்கு முன், இந்த எல்லா approaches-யும் உங்கள் application-ன் குறிப்பிட்ட பகுதிகளில் compiler-ஐ test செய்ய அனுமதிக்கின்றன.

## Babel overrides உடன் directory அடிப்படையிலான adoption {/*directory-based-adoption*/}

Babel-ன் `overrides` option உங்கள் codebase-ன் வெவ்வேறு பகுதிகளுக்கு வெவ்வேறு plugins apply செய்ய அனுமதிக்கிறது. Directory by directory ஆக React Compiler-ஐ gradual-ஆக adopt செய்ய இது சிறந்தது.

### Basic configuration {/*basic-configuration*/}

Compiler-ஐ ஒரு குறிப்பிட்ட directory-க்கு apply செய்து தொடங்குங்கள்:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins that apply to all files
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### Coverage-ஐ விரிவாக்குதல் {/*expanding-coverage*/}

நம்பிக்கை அதிகரிக்கும்போது, மேலும் directories சேர்க்கவும்:

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Different plugins for legacy code
      ]
    }
  ]
};
```

### Compiler options உடன் {/*with-compiler-options*/}

ஒவ்வொரு override-க்கும் compiler options configure செய்யலாம்:

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    }
  ]
};
```


## "use memo" உடன் opt-in mode {/*opt-in-mode-with-use-memo*/}

அதிகபட்ச control-க்கு, `"use memo"` directive மூலம் explicit ஆக opt in செய்யும் components மற்றும் hooks-ஐ மட்டுமே compile செய்ய `compilationMode: 'annotation'` பயன்படுத்தலாம்.

<Note>
இந்த approach individual components மற்றும் hooks மீது fine-grained control தருகிறது. முழு directories-ஐ பாதிக்காமல் குறிப்பிட்ட components-இல் compiler-ஐ test செய்ய விரும்பும்போது இது பயனுள்ளதாகும்.
</Note>

### Annotation mode அமைப்பு {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### Directive-ஐ பயன்படுத்துதல் {/*using-the-directive*/}

Compile செய்ய விரும்பும் functions-ன் தொடக்கத்தில் `"use memo"` சேர்க்கவும்:

```js
function TodoList({ todos }) {
  "use memo"; // இந்த component-ஐ compilation-க்கு opt in செய்க

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // இந்த hook-ஐ compilation-க்கு opt in செய்க

  return data.slice().sort();
}
```

`compilationMode: 'annotation'` உடன், நீங்கள் செய்ய வேண்டியது:
- Optimize செய்ய விரும்பும் ஒவ்வொரு component-க்கும் `"use memo"` சேர்க்கவும்
- ஒவ்வொரு custom hook-க்கும் `"use memo"` சேர்க்கவும்
- புதிய components-க்கு அதைச் சேர்க்க மறக்காதீர்கள்

Compiler-ன் impact-ஐ evaluate செய்யும் போது, எந்த components compile செய்யப்பட வேண்டும் என்பதில் இது துல்லியமான control தருகிறது.

## Gating உடன் runtime feature flags பயன்படுத்துதல் {/*runtime-feature-flags-with-gating*/}

`gating` option, feature flags பயன்படுத்தி runtime-இல் compilation-ஐ control செய்ய அனுமதிக்கிறது. A/B tests run செய்ய அல்லது user segments அடிப்படையில் compiler-ஐ gradual-ஆக rollout செய்ய இது பயனுள்ளதாகும்.

### Gating எப்படி வேலை செய்கிறது {/*how-gating-works*/}

Compiler optimized code-ஐ runtime check ஒன்றில் wrap செய்கிறது. Gate `true` return செய்தால், optimized version run ஆகும். இல்லையெனில் original code run ஆகும்.

### Gating configuration {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### Feature flag implement செய்தல் {/*implementing-the-feature-flag*/}

உங்கள் gating function-ஐ export செய்யும் module ஒன்றை உருவாக்கவும்:

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use your feature flag system
  return getFeatureFlag('react-compiler-enabled');
}
```

## Adoption பிரச்சினைகளைச் சரிசெய்தல் {/*troubleshooting-adoption*/}

Adoption நடக்கும் போது issues சந்தித்தால்:

1. Problematic components-ஐ தற்காலிகமாக exclude செய்ய `"use no memo"` பயன்படுத்தவும்
2. பொதுவான issues-க்கு [debugging guide](/learn/react-compiler/debugging)-ஐ பார்க்கவும்
3. ESLint plugin identify செய்த Rules of React violations-ஐ fix செய்யவும்
4. மேலும் gradual adoption-க்கு `compilationMode: 'annotation'` பயன்படுத்துவது பற்றி பரிசீலிக்கவும்

## அடுத்த steps {/*next-steps*/}

- கூடுதல் options-க்கு [configuration guide](/reference/react-compiler/configuration)-ஐ படிக்கவும்
- [Debugging techniques](/learn/react-compiler/debugging) பற்றி அறியவும்
- எல்லா compiler options-க்கும் [API reference](/reference/react-compiler/configuration)-ஐ பார்க்கவும்
