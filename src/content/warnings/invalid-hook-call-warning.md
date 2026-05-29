---
title: Hooks-இன் விதிகள்
---

பின்வரும் error message-ஐப் பெற்றதால் நீங்கள் இங்கு வந்திருக்கலாம்:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

இந்த எரர் தோன்றுவதற்கு மூன்று பொதுவான காரணங்கள் உள்ளன:

1. நீங்கள் **Hooks-இன் விதிகளை மீறிக்** கொண்டிருக்கலாம்.
2. React மற்றும் React DOM-இன் **பொருந்தாத பதிப்புகள்** உங்களிடம் இருக்கலாம்.
3. ஒரே செயலியில் **ஒன்றுக்கு மேற்பட்ட React நகல்கள்** இருக்கலாம்.

இந்த நிலைகள் ஒவ்வொன்றையும் பார்ப்போம்.

## Hooks-இன் விதிகளை மீறுதல் {/*breaking-rules-of-hooks*/}

React-இல் `use` எனத் தொடங்கும் பெயர்களைக் கொண்ட functions [*Hooks*](/reference/react) என அழைக்கப்படுகின்றன.

**loops, conditions, அல்லது nested functions-க்குள் Hooks-ஐ அழைக்க வேண்டாம்.** அதற்குப் பதிலாக, எந்த early return-க்கும் முன்னர், உங்கள் React function-இன் top level-இல் எப்போதும் Hooks-ஐப் பயன்படுத்தவும். React ஒரு function component-ஐ render செய்யும் போது மட்டுமே Hooks-ஐ அழைக்க முடியும்:

* ✅ ஒரு [function component](/learn/your-first-component)-இன் உடற்பகுதியின் top level-இல் அவற்றை அழைக்கவும்.
* ✅ ஒரு [custom Hook](/learn/reusing-logic-with-custom-hooks)-இன் உடற்பகுதியின் top level-இல் அவற்றை அழைக்கவும்.

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

வேறு எந்த நிலையிலும் Hooks-ஐ (`use` எனத் தொடங்கும் functions-ஐ) அழைப்பது ஆதரிக்கப்படுவதில்லை. உதாரணமாக:

* 🔴 conditions அல்லது loops-க்குள் Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 நிபந்தனைக்குட்பட்ட `return` statement-க்குப் பிறகு Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 event handlers-இல் Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 class components-இல் Hooks-ஐ அழைக்க வேண்டாம்.
* 🔴 `useMemo`, `useReducer`, அல்லது `useEffect`-க்கு அனுப்பப்படும் செயல்பாடுகளுக்குள் Hooks-ஐ அழைக்க வேண்டாம்.

இந்த விதிகளை மீறினால், இந்த error தோன்றக்கூடும்.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

இந்தத் தவறுகளைக் கண்டறிய [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)-ஐப் பயன்படுத்தலாம்.

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) மற்ற Hooks-ஐ அழைக்கலாம் (அவற்றின் நோக்கமே அதுதான்). ஒரு function component render செய்யப்படும் போது மட்டுமே custom Hooks-உம் அழைக்கப்பட வேண்டும் என்பதால் இது செயல்படுகிறது.

</Note>

## React மற்றும் React DOM-இன் பொருந்தாத பதிப்புகள் {/*mismatching-versions-of-react-and-react-dom*/}

Hooks-ஐ இன்னும் ஆதரிக்காத `react-dom` (< 16.8.0) அல்லது `react-native` (< 0.59) பதிப்பை நீங்கள் பயன்படுத்திக் கொண்டிருக்கலாம். நீங்கள் பயன்படுத்தும் பதிப்பைச் சரிபார்க்க, உங்கள் application folder-இல் `npm ls react-dom` அல்லது `npm ls react-native`-ஐ இயக்கலாம். அவற்றில் ஒன்றுக்கு மேற்பட்ட நகல்களைக் கண்டால், அதுவும் பிரச்சினைகளை உருவாக்கலாம் (கீழே மேலும் பார்க்கலாம்).

## நகல் React {/*duplicate-react*/}

Hooks செயல்பட, உங்கள் application code-இல் உள்ள `react` import, `react-dom` package-இன் உள்ளே பயன்படுத்தப்படும் `react` import குறிப்பிடும் அதே module-ஐக் குறிப்பிட வேண்டும்.

இந்த `react` imports இரண்டு வேறுபட்ட exports objects-ஐக் குறிப்பிட்டால், இந்த warning-ஐப் பார்ப்பீர்கள். `react` package-இன் **இரண்டு நகல்கள் தவறுதலாக** உங்களிடம் இருப்பதால் இது நிகழலாம்.

Package நிர்வாகத்திற்கு Node-ஐப் பயன்படுத்தினால், உங்கள் project folder-இல் இந்தச் சரிபார்ப்பை இயக்கலாம்:

<TerminalBlock>

npm ls react

</TerminalBlock>

ஒன்றுக்கு மேற்பட்ட React-ஐக் கண்டால், அது ஏன் நிகழ்கிறது என்பதைக் கண்டறிந்து உங்கள் dependency tree-ஐச் சரிசெய்ய வேண்டும். உதாரணமாக, நீங்கள் பயன்படுத்தும் library ஒன்று `react`-ஐ peer dependency-ஆகக் குறிப்பிடுவதற்குப் பதிலாக dependency-ஆகத் தவறாகக் குறிப்பிட்டிருக்கலாம். அந்த library சரிசெய்யப்படும் வரை, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) ஒரு சாத்தியமான workaround.

சில logs-ஐச் சேர்த்து, உங்கள் development server-ஐ மறுதொடக்கம் செய்வதன் மூலமும் இந்தப் பிரச்சினையை debug செய்ய முயற்சிக்கலாம்:

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

இது `false` என அச்சிட்டால், உங்களிடம் இரண்டு React நகல்கள் இருக்கலாம்; அது ஏன் நிகழ்ந்தது என்பதைக் கண்டறிய வேண்டும். சமூகத்தினர் எதிர்கொண்ட சில பொதுவான காரணங்கள் [இந்த issue-இல்](https://github.com/facebook/react/issues/13991) உள்ளன.

நீங்கள் `npm link` அல்லது அதற்கு இணையான ஒன்றைப் பயன்படுத்தும்போதும் இந்தப் பிரச்சினை ஏற்படலாம். அப்போது, உங்கள் bundler இரண்டு React நகல்களைக் காணலாம்: ஒன்று செயலிக் கோப்புறையிலும் மற்றொன்று உங்கள் library கோப்புறையிலும் இருக்கும். `myapp` மற்றும் `mylib` ஆகியவை அருகருகே உள்ள கோப்புறைகள் எனக் கொண்டால், `mylib`-இலிருந்து `npm link ../myapp/node_modules/react`-ஐ இயக்குவது ஒரு சாத்தியமான தீர்வு. இதனால் library, செயலியின் React நகலைப் பயன்படுத்தும்.

<Note>

பொதுவாக, ஒரே பக்கத்தில் ஒன்றுக்கொன்று சாராத பல React நகல்களைப் பயன்படுத்துவதை React ஆதரிக்கிறது (உதாரணமாக, ஒரு செயலியும் third-party widget ஒன்றும் அதைப் பயன்படுத்தினால்). component-க்கும் அதை render செய்த `react-dom` நகலுக்கும் இடையில் `require('react')` வெவ்வேறாகக் குறிப்பிடப்பட்டால் மட்டுமே இது செயலிழக்கும்.

</Note>

## பிற காரணங்கள் {/*other-causes*/}

இவற்றில் எதுவும் செயல்படவில்லை எனில், [இந்த issue-இல்](https://github.com/facebook/react/issues/13991) கருத்திடவும்; உதவ முயற்சிப்போம். பிரச்சினையை மீண்டும் உருவாக்கும் ஒரு சிறிய உதாரணத்தை உருவாக்க முயற்சிக்கவும்; அதைச் செய்யும்போதே பிரச்சினையை நீங்கள் கண்டறியக்கூடும்.
