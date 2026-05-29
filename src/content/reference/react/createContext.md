---
title: createContext
---

<Intro>

Components provide செய்யவோ read செய்யவோ கூடிய [context](/learn/passing-data-deeply-with-context)-ஐ உருவாக்க `createContext` உதவுகிறது.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Context உருவாக்க எந்த components-க்கும் வெளியே `createContext`-ஐ call செய்யுங்கள்.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `defaultValue`: Context read செய்யும் component-க்கு மேலுள்ள tree-இல் பொருந்தும் context provider இல்லாதபோது context கொண்டிருக்க வேண்டிய value. உங்களிடம் meaningful default value இல்லையெனில், `null` குறிப்பிடுங்கள். Default value என்பது "last resort" fallback ஆகும். இது static; காலப்போக்கில் மாறாது.

#### Returns {/*returns*/}

`createContext` ஒரு context object-ஐ return செய்கிறது.

**Context object தானாகவே எந்த information-ஐயும் hold செய்யாது.** பிற components எந்த context-ஐ read அல்லது provide செய்கின்றன என்பதை அது represent செய்கிறது. பொதுவாக, மேலுள்ள components-இல் context value-ஐ குறிப்பிட [`SomeContext`](#provider)-ஐ பயன்படுத்தி, கீழுள்ள components-இல் அதை read செய்ய [`useContext(SomeContext)`](/reference/react/useContext)-ஐ call செய்வீர்கள். Context object-க்கு சில properties உள்ளன:

* `SomeContext` components-க்கு context value provide செய்ய உதவுகிறது.
* `SomeContext.Consumer` context value read செய்யும் மாற்று மற்றும் அரிதாக பயன்படுத்தப்படும் வழி.
* `SomeContext.Provider` React 19-க்கு முன் context value provide செய்யும் legacy வழி.

---

### `SomeContext` Provider {/*provider*/}

உள்ளே உள்ள அனைத்து components-க்கும் இந்த context-ன் value-ஐ குறிப்பிட, உங்கள் components-ஐ context provider-க்குள் wrap செய்யுங்கள்:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

<Note>

React 19 முதல், `<SomeContext>`-ஐ provider ஆக render செய்யலாம்.

React-ன் பழைய versions-இல், `<SomeContext.Provider>` பயன்படுத்துங்கள்.

</Note>

#### Props {/*provider-props*/}

* `value`: இந்த provider-க்குள், எவ்வளவு ஆழமாக இருந்தாலும், இந்த context-ஐ read செய்யும் அனைத்து components-க்கும் pass செய்ய வேண்டிய value. Context value எந்த type ஆகவும் இருக்கலாம். Provider-க்குள் [`useContext(SomeContext)`](/reference/react/useContext) call செய்யும் component, அதற்கு மேலுள்ள innermost corresponding context provider-ன் `value`-ஐ பெறும்.

---

### `SomeContext.Consumer` {/*consumer*/}

`useContext` வருவதற்கு முன், context read செய்ய பழைய வழி ஒன்று இருந்தது:

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

இந்த பழைய வழி இன்னும் வேலை செய்தாலும், **புதியதாக எழுதப்படும் code context-ஐ [`useContext()`](/reference/react/useContext) மூலம் read செய்ய வேண்டும்:**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: ஒரு function. [`useContext()`](/reference/react/useContext) பயன்படுத்தும் அதே algorithm மூலம் தீர்மானிக்கப்பட்ட current context value உடன், நீங்கள் pass செய்யும் function-ஐ React call செய்து, அந்த function return செய்யும் result-ஐ render செய்யும். Parent components-இலிருந்து context மாறும் போதெல்லாம் React இந்த function-ஐ மீண்டும் run செய்து UI-ஐ update செய்யும்.

---

## பயன்பாடு {/*usage*/}

### Context உருவாக்குதல் {/*creating-context*/}

Props-ஐ explicit-ஆக pass செய்யாமல் components [information-ஐ ஆழமாக கீழே pass செய்ய](/learn/passing-data-deeply-with-context) context உதவுகிறது.

ஒன்று அல்லது அதற்கு மேற்பட்ட contexts உருவாக்க, எந்த components-க்கும் வெளியே `createContext`-ஐ call செய்யுங்கள்.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` ஒரு <CodeStep step={1}>context object</CodeStep>-ஐ return செய்கிறது. அதை [`useContext()`](/reference/react/useContext)-க்கு pass செய்வதன் மூலம் components context-ஐ read செய்யலாம்:

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Default-ஆக, அவை பெறும் values contexts உருவாக்கும்போது நீங்கள் குறிப்பிட்ட <CodeStep step={3}>default values</CodeStep> ஆக இருக்கும். ஆனால் இது தனியாக பயனுள்ளதாக இல்லை; ஏனெனில் default values ஒருபோதும் மாறாது.

Context பயனுள்ளது; ஏனெனில் உங்கள் components-இலிருந்து **பிற dynamic values-ஐ provide செய்யலாம்:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

இப்போது `Page` component மற்றும் அதன் உள்ளே எவ்வளவு ஆழமாக இருந்தாலும் உள்ள components, pass செய்யப்பட்ட context values-ஐ "பார்க்கும்". Pass செய்யப்பட்ட context values மாறினால், context-ஐ read செய்யும் components-ஐயும் React re-render செய்யும்.

[Context read மற்றும் provide செய்வது குறித்து மேலும் படித்து உதாரணங்களைப் பார்க்கவும்.](/reference/react/useContext)

---

### File-இலிருந்து context import மற்றும் export செய்தல் {/*importing-and-exporting-context-from-a-file*/}

அடிக்கடி, வெவ்வேறு files-இல் உள்ள components-க்கு அதே context access தேவைப்படும். அதனால்தான் contexts-ஐ தனி file-இல் declare செய்வது பொதுவானது. பின்னர் [`export` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)-ஐப் பயன்படுத்தி context-ஐ பிற files-க்கு கிடைக்கச் செய்யலாம்:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

பிற files-இல் declare செய்யப்பட்ட components பின்னர் [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) statement-ஐப் பயன்படுத்தி இந்த context-ஐ read அல்லது provide செய்யலாம்:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext value={theme}>
      <AuthContext value={currentUser}>
        <Page />
      </AuthContext>
    </ThemeContext>
  );
}
```

இது [components import மற்றும் export செய்வது](/learn/importing-and-exporting-components) போலவே வேலை செய்கிறது.

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### Context value-ஐ மாற்ற வழி கிடைக்கவில்லை {/*i-cant-find-a-way-to-change-the-context-value*/}


இப்படியான code *default* context value-ஐ குறிப்பிடுகிறது:

```js
const ThemeContext = createContext('light');
```

இந்த value ஒருபோதும் மாறாது. மேலே பொருந்தும் provider கிடைக்கவில்லை என்றால் மட்டுமே React இந்த value-ஐ fallback ஆகப் பயன்படுத்தும்.

Context காலத்தோடு மாற வேண்டுமெனில், [state சேர்த்து components-ஐ context provider-இல் wrap செய்யுங்கள்.](/reference/react/useContext#updating-data-passed-via-context)
