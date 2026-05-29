---
title: 'Custom Hook-களுடன் லாஜிக்கைக் மீண்டும் பயன்படுத்துதல்'
---

<Intro>

React-இல் `useState`, `useContext`, `useEffect` போன்ற பல உள்ளமைந்த Hook-கள் உள்ளன. சில நேரங்களில், இன்னும் குறிப்பிட்ட நோக்கத்திற்கான ஒரு Hook இருந்தால் நன்றாக இருக்கும் என்று தோன்றலாம்: உதாரணமாக, தரவை fetch செய்வது, பயனர் ஆன்லைனில் உள்ளாரா என்பதை கண்காணிப்பது, அல்லது chat room-க்கு இணைப்பது. இத்தகைய Hook-களை React-இல் நீங்கள் காணாமல் போகலாம், ஆனால் உங்கள் application-ன் தேவைகளுக்காக நீங்களே Hook-களை உருவாக்கலாம்.

</Intro>

<YouWillLearn>

- custom Hook-கள் என்றால் என்ன, உங்களுடையதை எப்படி எழுதுவது
- component-களுக்கிடையே logic-ஐ எப்படி மீண்டும் பயன்படுத்துவது
- உங்கள் custom Hook-களை எப்படி பெயரிட்டு அமைப்பது
- custom Hook-களை எப்போது, ஏன் பிரித்தெடுக்க வேண்டும்

</YouWillLearn>

## Custom Hook-கள்: component-களுக்கிடையே logic-ஐப் பகிர்தல் {/*custom-hooks-sharing-logic-between-components*/}

நீங்கள் network-ஐ அதிகமாக நம்பும் ஒரு app-ஐ உருவாக்குகிறீர்கள் என்று நினைத்துப் பாருங்கள் (பெரும்பாலான app-கள் அப்படித்தான்). உங்கள் app-ஐப் பயன்படுத்திக்கொண்டிருக்கும்போது பயனரின் network connection தவறுதலாக துண்டிக்கப்பட்டால், அவரை எச்சரிக்க விரும்புகிறீர்கள். இதை எப்படி செய்வீர்கள்? உங்கள் component-இல் இரண்டு விஷயங்கள் தேவைப்படுவது போல தெரிகிறது:

1. network online-இல் உள்ளதா என்பதை கண்காணிக்கும் ஒரு state பகுதி.
2. உலகளாவிய [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) மற்றும் [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) event-களுக்கு subscribe செய்து, அந்த state-ஐ புதுப்பிக்கும் ஒரு Effect.

இது உங்கள் component-ஐ network status உடன் [ஒத்திசைவாக](/learn/synchronizing-with-effects) வைத்திருக்கும். நீங்கள் இதுபோன்ற ஒன்றில் தொடங்கலாம்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}
```

</Sandpack>

உங்கள் network-ஐ on மற்றும் off செய்து பாருங்கள்; உங்கள் செயல்களுக்கு பதிலாக இந்த `StatusBar` எப்படி புதுப்பிக்கப்படுகிறது என்பதை கவனியுங்கள்.

இப்போது இதே logic-ஐ வேறு component-இலும் பயன்படுத்த விரும்புகிறீர்கள் என்று நினைத்துப் பாருங்கள். network off ஆக இருக்கும்போது disabled ஆகி, "சேமி" என்பதற்குப் பதிலாக "மீண்டும் இணைக்கிறது..." என்று காட்டும் Save button-ஐ உருவாக்க விரும்புகிறீர்கள்.

தொடங்க, `isOnline` state-ஐயும் Effect-ஐயும் `SaveButton`-க்குள் copy-paste செய்யலாம்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ முன்னேற்றம் சேமிக்கப்பட்டது');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'முன்னேற்றத்தைச் சேமி' : 'மீண்டும் இணைக்கிறது...'}
    </button>
  );
}
```

</Sandpack>

network-ஐ off செய்தால் button-ன் தோற்றம் மாறுமா என்பதைச் சரிபாருங்கள்.

இந்த இரண்டு component-களும் நன்றாக வேலை செய்கின்றன, ஆனால் அவற்றுக்கிடையே logic மீண்டும் மீண்டும் இருப்பது நல்லதல்ல. அவற்றின் *காட்சி தோற்றம்* வேறுபட்டிருந்தாலும், அவற்றுக்கிடையே logic-ஐ மீண்டும் பயன்படுத்த விரும்புகிறீர்கள்.

### ஒரு component-இலிருந்து உங்கள் சொந்த custom Hook-ஐப் பிரித்தெடுத்தல் {/*extracting-your-own-custom-hook-from-a-component*/}

[`useState`](/reference/react/useState) மற்றும் [`useEffect`](/reference/react/useEffect) போல, உள்ளமைந்த `useOnlineStatus` Hook இருந்தது என்று ஒரு நிமிடம் நினைத்துப் பாருங்கள். அப்போது இந்த இரண்டு component-களையும் தெளிவுப்படுத்தி, அவற்றுக்கிடையிலான மீளுருவாக்கத்தை நீக்கலாம்:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ முன்னேற்றம் சேமிக்கப்பட்டது');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'முன்னேற்றத்தைச் சேமி' : 'மீண்டும் இணைக்கிறது...'}
    </button>
  );
}
```

அப்படியான உள்ளமைந்த Hook இல்லை என்றாலும், அதை நீங்களே எழுதலாம். `useOnlineStatus` என்ற function-ஐ அறிவித்து, முன்பு எழுதிய component-களிலிருந்த மீண்டும் வரும் code அனைத்தையும் அதற்குள் நகர்த்துங்கள்:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

function-ன் முடிவில் `isOnline`-ஐ return செய்யுங்கள். இதனால் உங்கள் component-கள் அந்த மதிப்பைப் படிக்க முடியும்:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ முன்னேற்றம் சேமிக்கப்பட்டது');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'முன்னேற்றத்தைச் சேமி' : 'மீண்டும் இணைக்கிறது...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

network-ஐ on/off செய்தால் இரண்டு component-களும் புதுப்பிக்கப்படுகின்றனவா என்பதைச் சரிபாருங்கள்.

இப்போது உங்கள் component-களில் அதிகமான மீண்டும் வரும் logic இல்லை. **இன்னும் முக்கியமாக, அவற்றுக்குள் இருக்கும் code, *எப்படி செய்வது* (browser event-களுக்கு subscribe செய்வது) என்பதைக் காட்டாமல், *எதைச் செய்ய விரும்புகின்றன* (online status-ஐப் பயன்படுத்துதல்!) என்பதை விவரிக்கிறது.**

logic-ஐ custom Hook-களுக்குள் பிரித்தெடுத்தால், ஒரு external system அல்லது browser API-யுடன் நீங்கள் எப்படி செயல்படுகிறீர்கள் என்ற சிக்கலான விவரங்களை மறைக்கலாம். உங்கள் component-களின் code உங்கள் நோக்கத்தை வெளிப்படுத்தும்; implementation-ஐ அல்ல.

### Hook பெயர்கள் எப்போதும் `use`-ஆல் தொடங்கும் {/*hook-names-always-start-with-use*/}

React application-கள் component-களிலிருந்து கட்டப்படுகின்றன. component-கள் உள்ளமைந்தவையாக இருந்தாலும் custom ஆனவையாக இருந்தாலும் Hook-களிலிருந்து கட்டப்படுகின்றன. மற்றவர்கள் உருவாக்கிய custom Hook-களை நீங்கள் அடிக்கடி பயன்படுத்தலாம்; ஆனால் சில சமயம் ஒன்றை நீங்களே எழுத வேண்டி வரலாம்!

இந்த பெயரிடும் மரபுகளை நீங்கள் பின்பற்ற வேண்டும்:

1. **React component பெயர்கள் capital letter-ஆல் தொடங்க வேண்டும்,** `StatusBar` மற்றும் `SaveButton` போல. React component-கள் JSX துண்டு போன்ற, React காட்டத் தெரிந்த ஏதாவது ஒன்றையும் return செய்ய வேண்டும்.
2. **Hook பெயர்கள் `use`-க்கு பின் capital letter வருமாறு தொடங்க வேண்டும்,** [`useState`](/reference/react/useState) (உள்ளமைந்தது) அல்லது `useOnlineStatus` (இந்தப் பக்கத்தில் முன்பு பார்த்த custom Hook) போல. Hook-கள் எந்த மதிப்பையும் return செய்யலாம்.

இந்த மரபு, ஒரு component-ஐ பார்த்தவுடன் அதன் state, Effect-கள் மற்றும் பிற React அம்சங்கள் எங்கு "மறைந்திருக்கலாம்" என்பதை எப்போதும் அறிய உதவுகிறது. உதாரணமாக, உங்கள் component-க்குள் `getColor()` function call-ஐ பார்த்தால், அதன் பெயர் `use`-ஆல் தொடங்காததால் அதற்குள் React state இருக்க முடியாது என்பதில் உறுதியாக இருக்கலாம். ஆனால் `useOnlineStatus()` போன்ற function call-க்குள் பெரும்பாலும் பிற Hook call-கள் இருக்கும்!

<Note>

உங்கள் linter [React-க்காக configure செய்யப்பட்டிருந்தால்,](/learn/editor-setup#linting) அது இந்த பெயரிடும் மரபை கட்டாயப்படுத்தும். மேலுள்ள sandbox-க்கு scroll செய்து, `useOnlineStatus`-ஐ `getOnlineStatus` என rename செய்து பாருங்கள். அதன் பிறகு அதற்குள் `useState` அல்லது `useEffect`-ஐ call செய்ய linter அனுமதிக்காது என்பதை கவனியுங்கள். Hook-களும் component-களும் மட்டுமே பிற Hook-களை call செய்ய முடியும்!

</Note>

<DeepDive>

#### rendering நடக்கும் போது call செய்யப்படும் எல்லா function-களும் use prefix-ஆல் தொடங்க வேண்டுமா? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

இல்லை. Hook-களை *call* செய்யாத function-கள் Hook-களாக *இருக்க* தேவையில்லை.

உங்கள் function எந்த Hook-களையும் call செய்யவில்லை என்றால், `use` prefix-ஐ தவிருங்கள். அதற்கு பதிலாக, `use` prefix இல்லாத சாதாரண function-ஆக எழுதுங்கள். உதாரணமாக, கீழே உள்ள `useSorted` Hook-களை call செய்யவில்லை, எனவே அதற்கு பதிலாக `getSorted` என்று அழையுங்கள்:

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

இதனால் உங்கள் code இந்த சாதாரண function-ஐ conditions உட்பட எங்கும் call செய்ய முடியும்:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

ஒரு function அதன் உள்ளே குறைந்தது ஒரு Hook-ஐயாவது பயன்படுத்தினால், அதற்கு `use` prefix கொடுத்து (அதனால் அதை Hook ஆக்கி) எழுத வேண்டும்:

```js
// ✅ Good: A Hook that uses other Hooks
function useAuth() {
  return useContext(Auth);
}
```

தொழில்நுட்ப ரீதியாக, இதை React கட்டாயப்படுத்தாது. கொள்கை ரீதியாக, பிற Hook-களை call செய்யாத Hook-ஐ நீங்கள் உருவாக்கலாம். இது பெரும்பாலும் குழப்பமாகவும் கட்டுப்பாடாகவும் இருக்கும், எனவே அந்த pattern-ஐ தவிர்ப்பது நல்லது. ஆனால் அரிதாக அது பயனுள்ளதாக இருக்கும் சூழல்கள் இருக்கலாம். உதாரணமாக, உங்கள் function இப்போது எந்த Hook-களையும் பயன்படுத்தாமல் இருக்கலாம், ஆனால் எதிர்காலத்தில் அதில் சில Hook call-களை சேர்க்க திட்டமிட்டிருக்கலாம். அப்போது அதற்கு `use` prefix உடன் பெயரிடுவது பொருத்தமாகும்:

```js {3-4}
// ✅ Good: A Hook that will likely use some other Hooks later
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

அப்போது component-கள் அதை conditionally call செய்ய முடியாது. நீங்கள் உண்மையில் அதற்குள் Hook call-களை சேர்க்கும்போது இது முக்கியமாகும். அதற்குள் Hook-களைப் பயன்படுத்த திட்டமில்லையெனில் (இப்போது அல்லது பின்னர்), அதை Hook ஆக்க வேண்டாம்.

</DeepDive>

### Custom Hook-கள் stateful logic-ஐப் பகிர உதவும்; state-ஐயே அல்ல {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

முன்னைய உதாரணத்தில், network-ஐ on/off செய்தபோது இரண்டு component-களும் ஒன்றாக புதுப்பிக்கப்பட்டன. ஆனால் ஒரே `isOnline` state variable அவற்றுக்கிடையே பகிரப்படுகிறது என்று நினைப்பது தவறு. இந்த code-ஐ பாருங்கள்:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

மீண்டும் வரும் logic-ஐ பிரித்தெடுக்கும் முன் இருந்தது போலவே இது வேலை செய்கிறது:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

இவை இரண்டு முற்றிலும் தனித்தனி state variable-களும் Effect-களும்! நீங்கள் அவற்றை ஒரே external value-உடன் (network on-ஆக உள்ளதா) ஒத்திசைத்ததால், அவை ஒரே நேரத்தில் ஒரே மதிப்பைக் கொண்டிருந்தன.

இதைக் கூடுதல் தெளிவாக காட்ட, வேறு உதாரணம் தேவை. இந்த `Form` component-ஐ கருதுங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        முதல் பெயர்:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        கடைசி பெயர்:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>காலை வணக்கம், {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

ஒவ்வொரு form field-க்கும் சில மீண்டும் வரும் logic உள்ளது:

1. state-ன் ஒரு பகுதி உள்ளது (`firstName` மற்றும் `lastName`).
1. change handler ஒன்று உள்ளது (`handleFirstNameChange` மற்றும் `handleLastNameChange`).
1. அந்த input-க்கான `value` மற்றும் `onChange` attribute-களை குறிப்பிடும் JSX துண்டு உள்ளது.

மீண்டும் வரும் logic-ஐ இந்த `useFormInput` custom Hook-க்குள் பிரித்தெடுக்கலாம்:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        முதல் பெயர்:
        <input {...firstNameProps} />
      </label>
      <label>
        கடைசி பெயர்:
        <input {...lastNameProps} />
      </label>
      <p><b>காலை வணக்கம், {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

இது `value` எனப்படும் *ஒரே ஒரு* state variable-ஐ மட்டுமே அறிவிப்பதை கவனியுங்கள்.

ஆனால் `Form` component `useFormInput`-ஐ *இரண்டு முறை* call செய்கிறது:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

இதனால் இது இரண்டு தனித்தனி state variable-களை அறிவித்தது போல வேலை செய்கிறது!

**Custom Hook-கள் *stateful logic*-ஐப் பகிர உதவும்; ஆனால் *state-ஐயே* பகிராது. ஒரே Hook-க்கு செய்யப்படும் ஒவ்வொரு call-மும், அதே Hook-க்கு செய்யப்படும் மற்ற எல்லா call-களிலிருந்தும் முற்றிலும் தனித்தனி.** அதனால் மேலுள்ள இரண்டு sandbox-களும் முழுமையாக சமமானவை. விரும்பினால், மேலே scroll செய்து அவற்றை ஒப்பிடுங்கள். custom Hook-ஐ பிரித்தெடுக்கும் முன் மற்றும் பின் நடத்தை ஒன்றுதான்.

பல component-களுக்கிடையே state-ஐயே பகிர வேண்டுமெனில், அதற்கு பதிலாக [அதை மேலே தூக்கி கீழே pass செய்யுங்கள்](/learn/sharing-state-between-components).

## Hook-களுக்கிடையே reactive மதிப்புகளை pass செய்தல் {/*passing-reactive-values-between-hooks*/}

உங்கள் custom Hook-களுக்குள் உள்ள code, உங்கள் component ஒவ்வொரு re-render-க்கும் மீண்டும் இயங்கும். அதனால் component-களைப் போலவே, custom Hook-களும் [pure ஆக இருக்க வேண்டும்.](/learn/keeping-components-pure) custom Hook-களின் code-ஐ உங்கள் component body-ன் ஒரு பகுதியாக நினைத்துக்கொள்ளுங்கள்!

custom Hook-கள் உங்கள் component-உடன் சேர்ந்து re-render ஆகுவதால், அவை எப்போதும் சமீபத்திய props மற்றும் state-ஐ பெறும். இதன் அர்த்தம் என்ன என்பதைப் பார்க்க, இந்த chat room உதாரணத்தை கருதுங்கள். server URL அல்லது chat room-ஐ மாற்றிப் பாருங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        chat room-ஐத் தேர்ந்தெடுக்கவும்:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('புதிய செய்தி: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        சர்வர் URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்கும் என எதிர்பார்த்தோம். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்கும் என எதிர்பார்த்தோம். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ ' + serverUrl + '-இல் உள்ள "' + roomId + '" அறைக்கு இணைக்கிறது...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ ' + serverUrl + '-இல் உள்ள "' + roomId + '" அறையிலிருந்து துண்டிக்கப்பட்டது');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இருமுறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

நீங்கள் `serverUrl` அல்லது `roomId`-ஐ மாற்றும்போது, Effect உங்கள் மாற்றங்களுக்கு ["react" செய்து](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) மீண்டும் ஒத்திசைகிறது. உங்கள் Effect-ன் dependency-களை மாற்றும் ஒவ்வொரு முறையும் chat மீண்டும் இணைக்கிறது என்பதை console செய்திகளிலிருந்து அறியலாம்.

இப்போது Effect-ன் code-ஐ custom Hook-க்குள் நகர்த்துங்கள்:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('புதிய செய்தி: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

இதனால் உங்கள் `ChatRoom` component, அது உள்ளே எப்படி வேலை செய்கிறது என்பதைப் பற்றி கவலைப்படாமல் உங்கள் custom Hook-ஐ call செய்ய முடியும்:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        சர்வர் URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
    </>
  );
}
```

இது மிகவும் நேரடியாகத் தெரிகிறது! (ஆனால் அதே செயலைத்தான் செய்கிறது.)

logic இப்போது கூட prop மற்றும் state மாற்றங்களுக்கு *பதிலளிப்பதை* கவனியுங்கள். server URL அல்லது தேர்ந்தெடுத்த அறையைத் திருத்திப் பாருங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        chat room-ஐத் தேர்ந்தெடுக்கவும்:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        சர்வர் URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('புதிய செய்தி: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்கும் என எதிர்பார்த்தோம். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்கும் என எதிர்பார்த்தோம். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ ' + serverUrl + '-இல் உள்ள "' + roomId + '" அறைக்கு இணைக்கிறது...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ ' + serverUrl + '-இல் உள்ள "' + roomId + '" அறையிலிருந்து துண்டிக்கப்பட்டது');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இருமுறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

ஒரு Hook-ன் return value-ஐ நீங்கள் எப்படி எடுத்துக்கொள்கிறீர்கள் என்பதை கவனியுங்கள்:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

அதை மற்றொரு Hook-க்கு input ஆக pass செய்கிறீர்கள்:

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

உங்கள் `ChatRoom` component ஒவ்வொரு re-render-க்கும், சமீபத்திய `roomId` மற்றும் `serverUrl`-ஐ உங்கள் Hook-க்கு pass செய்கிறது. அதனால் re-render-க்கு பிறகு அவற்றின் மதிப்புகள் வேறுபட்டிருந்தால் உங்கள் Effect chat-க்கு மீண்டும் இணைகிறது. (நீங்கள் எப்போதாவது audio அல்லது video processing software-களில் வேலை செய்திருந்தால், இவ்வாறு Hook-களை chain செய்வது visual அல்லது audio effect-களை chain செய்வதை நினைவூட்டலாம். `useState`-ன் output, `useChatRoom`-ன் input-க்கு "feed" செய்வது போல.)

### event handler-களை custom Hook-களுக்கு pass செய்தல் {/*passing-event-handlers-to-custom-hooks*/}

`useChatRoom`-ஐ மேலும் பல component-களில் பயன்படுத்தத் தொடங்கும்போது, அதன் நடத்தை component-கள் customize செய்ய அனுமதிக்க விரும்பலாம். உதாரணமாக, தற்போது message வந்தால் என்ன செய்ய வேண்டும் என்ற logic Hook-க்குள் hardcode செய்யப்பட்டுள்ளது:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('புதிய செய்தி: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

இந்த logic-ஐ மீண்டும் உங்கள் component-க்குள் நகர்த்த விரும்புகிறீர்கள் என்று வைத்துக்கொள்வோம்:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('புதிய செய்தி: ' + msg);
    }
  });
  // ...
```

இது வேலை செய்ய, உங்கள் custom Hook அதன் named option-களில் ஒன்றாக `onReceiveMessage`-ஐ ஏற்கும்படி மாற்றுங்கள்:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ எல்லா dependency-களும் அறிவிக்கப்பட்டுள்ளன
}
```

இது வேலை செய்யும், ஆனால் உங்கள் custom Hook event handler-களை ஏற்கும்போது இன்னும் ஒரு மேம்பாட்டை செய்யலாம்.

`onReceiveMessage` மீது dependency சேர்ப்பது சிறந்ததல்ல, ஏனெனில் component re-render ஆகும் ஒவ்வொரு முறையும் chat மீண்டும் இணைக்கப்படும். [இந்த event handler-ஐ Effect Event-க்குள் wrap செய்து dependency-களிலிருந்து அதை நீக்குங்கள்:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ எல்லா dependency-களும் அறிவிக்கப்பட்டுள்ளன
}
```

இப்போது `ChatRoom` component re-render ஆகும் ஒவ்வொரு முறையும் chat மீண்டும் இணைக்காது. custom Hook-க்கு event handler-ஐ pass செய்வதற்கான முழுமையாக வேலை செய்யும் demo இதோ; இதை நீங்கள் முயற்சி செய்யலாம்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        chat room-ஐத் தேர்ந்தெடுக்கவும்:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">பொது</option>
          <option value="travel">பயணம்</option>
          <option value="music">இசை</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('புதிய செய்தி: ' + msg);
    }
  });

  return (
    <>
      <label>
        சர்வர் URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>{roomId} அறைக்கு வரவேற்கிறோம்!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl string ஆக இருக்கும் என எதிர்பார்த்தோம். கிடைத்தது: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId string ஆக இருக்கும் என எதிர்பார்த்தோம். கிடைத்தது: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ ' + serverUrl + '-இல் உள்ள "' + roomId + '" அறைக்கு இணைக்கிறது...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ ' + serverUrl + '-இல் உள்ள "' + roomId + '" அறையிலிருந்து துண்டிக்கப்பட்டது');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('handler-ஐ இருமுறை சேர்க்க முடியாது.');
      }
      if (event !== 'message') {
        throw Error('"message" event மட்டுமே ஆதரிக்கப்படுகிறது.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`useChatRoom`-ஐ பயன்படுத்த, அது *எப்படி* வேலை செய்கிறது என்பதை நீங்கள் இனி அறிய வேண்டியதில்லை என்பதை கவனியுங்கள். அதை வேறு எந்த component-க்கும் சேர்த்து, வேறு option-களை pass செய்தாலும், அது அதேபோல் வேலை செய்யும். அதுதான் custom Hook-களின் பலம்.

## custom Hook-களை எப்போது பயன்படுத்துவது {/*when-to-use-custom-hooks*/}

மீண்டும் வரும் ஒவ்வொரு சிறிய code துண்டிற்கும் custom Hook-ஐ பிரித்தெடுக்க வேண்டியதில்லை. சில duplicate code பரவாயில்லை. உதாரணமாக, முன்பு பார்த்ததுபோல் ஒரே `useState` call-ஐ wrap செய்ய `useFormInput` Hook-ஐ பிரித்தெடுப்பது பெரும்பாலும் அவசியமில்லை.

ஆனால், நீங்கள் Effect எழுதும் போதெல்லாம், அதை custom Hook-க்குள் wrap செய்தால் இன்னும் தெளிவாகுமா என்று கருதுங்கள். [Effect-கள் உங்களுக்கு அடிக்கடி தேவையில்லை,](/learn/you-might-not-need-an-effect) எனவே ஒன்றை எழுதுகிறீர்களானால், ஏதாவது external system உடன் ஒத்திசைக்க அல்லது React-இல் உள்ளமைந்த API இல்லாத ஒன்றை செய்ய "React-க்கு வெளியே செல்ல" வேண்டியிருக்கிறது என்பதாகும். அதை custom Hook-க்குள் wrap செய்வது, உங்கள் நோக்கத்தையும் அதன் வழியாக data எப்படி பாய்கிறது என்பதையும் துல்லியமாகச் சொல்ல உதவும்.

உதாரணமாக, இரண்டு dropdown-களை காட்டும் `ShippingForm` component-ஐ கருதுங்கள்: ஒன்று நகரங்களின் பட்டியலைக் காட்டுகிறது, மற்றொன்று தேர்ந்தெடுத்த நகரில் உள்ள பகுதிகளின் பட்டியலைக் காட்டுகிறது. நீங்கள் இதுபோன்ற code-இல் தொடங்கலாம்:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

இந்த code மிகவும் repetitive ஆனதாக இருந்தாலும், [இந்த Effect-களை ஒன்றிலிருந்து ஒன்றாகப் பிரித்தே வைத்திருப்பது சரியானது.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) அவை இரண்டு வேறு விஷயங்களை ஒத்திசைக்கின்றன, எனவே அவற்றை ஒரே Effect-ஆக merge செய்யக்கூடாது. அதற்கு பதிலாக, அவற்றுக்கிடையே உள்ள common logic-ஐ உங்கள் சொந்த `useData` Hook-க்குள் பிரித்தெடுத்து மேலுள்ள `ShippingForm` component-ஐ தெளிவுப்படுத்தலாம்:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

இப்போது `ShippingForm` component-இல் உள்ள இரண்டு Effect-களையும் `useData` call-களால் மாற்றலாம்:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

custom Hook-ஐ பிரித்தெடுப்பது data flow-ஐ வெளிப்படையாக ஆக்கும். நீங்கள் `url`-ஐ உள்ளே கொடுக்கிறீர்கள்; `data`-வை வெளியே பெறுகிறீர்கள். உங்கள் Effect-ஐ `useData`-க்குள் "மறைப்பதன்" மூலம், `ShippingForm` component-இல் பணிபுரியும் ஒருவர் அதற்கு [தேவையற்ற dependency-களை](/learn/removing-effect-dependencies) சேர்ப்பதையும் தடுக்கிறீர்கள். காலப்போக்கில், உங்கள் app-ன் பெரும்பாலான Effect-கள் custom Hook-களில் இருக்கும்.

<DeepDive>

#### உங்கள் custom Hook-களை தெளிவான high-level use case-களில் கவனம் செலுத்த வைத்திருங்கள் {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

உங்கள் custom Hook-ன் பெயரைத் தேர்ந்தெடுப்பதிலிருந்து தொடங்குங்கள். தெளிவான பெயரைத் தேர்ந்தெடுக்க சிரமப்படுகிறீர்கள் என்றால், உங்கள் Effect உங்கள் component-ன் மீதமுள்ள logic-உடன் அதிகமாக இணைந்திருக்கிறது, இன்னும் பிரித்தெடுக்கத் தயாராக இல்லை என்பதைக் குறிக்கலாம்.

சிறந்த நிலையில், உங்கள் custom Hook-ன் பெயர், அடிக்கடி code எழுதாத ஒருவரும் கூட அது என்ன செய்கிறது, என்ன எடுக்கிறது, என்ன return செய்கிறது என்று நல்ல கணிப்பு செய்யுமளவு தெளிவாக இருக்க வேண்டும்:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

external system-உடன் ஒத்திசைக்கும் போது, உங்கள் custom Hook பெயர் மேலும் technical ஆகவும் அந்த system-க்கு உரிய jargon-ஐ பயன்படுத்துவதாகவும் இருக்கலாம். அந்த system-ஐ அறிந்த ஒருவருக்கு அது தெளிவாக இருந்தால் அது சரிதான்:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**custom Hook-களை தெளிவான high-level use case-களில் கவனம் செலுத்த வைத்திருங்கள்.** `useEffect` API-க்கே மாற்றாகவும் வசதியான wrapper-களாகவும் நடக்கும் custom "lifecycle" Hook-களை உருவாக்கி பயன்படுத்துவதைத் தவிருங்கள்:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

உதாரணமாக, இந்த `useMount` Hook சில code "mount ஆகும் போது" மட்டுமே இயங்குவதை உறுதிசெய்ய முயற்சிக்கிறது:

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect-க்கு dependency 'fn' இல்லை
}
```

**`useMount` போன்ற custom "lifecycle" Hook-கள் React paradigm-க்கு நன்றாக பொருந்தாது.** உதாரணமாக, இந்த code உதாரணத்தில் ஒரு தவறு உள்ளது (`roomId` அல்லது `serverUrl` மாற்றங்களுக்கு இது "react" செய்யவில்லை), ஆனால் linter இதைப் பற்றி எச்சரிக்காது, ஏனெனில் linter நேரடி `useEffect` call-களை மட்டுமே சரிபார்க்கிறது. உங்கள் Hook பற்றி அதற்கு தெரியாது.

நீங்கள் Effect எழுதுகிறீர்களானால், React API-யை நேரடியாகப் பயன்படுத்துவதிலிருந்து தொடங்குங்கள்:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

பிறகு, வேறு high-level use case-களுக்காக custom Hook-களை பிரித்தெடுக்கலாம் (ஆனால் அவசியமில்லை):

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**ஒரு நல்ல custom Hook அது செய்யக்கூடியவற்றைக் கட்டுப்படுத்துவதன் மூலம் calling code-ஐ மேலும் declarative ஆக்குகிறது.** உதாரணமாக, `useChatRoom(options)` chat room-க்கு மட்டுமே இணைக்க முடியும்; `useImpressionLog(eventName, extraData)` analytics-க்கு impression log-ஐ மட்டுமே அனுப்ப முடியும். உங்கள் custom Hook API use case-களை கட்டுப்படுத்தாமல் மிகவும் abstract ஆக இருந்தால், நீண்ட காலத்தில் அது தீர்ப்பதைவிட அதிக பிரச்சினைகளை உருவாக்க வாய்ப்புள்ளது.

</DeepDive>

### Custom Hook-கள் மேம்பட்ட pattern-களுக்கு migrate செய்ய உதவும் {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect-கள் ஒரு ["escape hatch"](/learn/escape-hatches): நீங்கள் "React-க்கு வெளியே செல்ல" வேண்டியபோது, மேலும் உங்கள் use case-க்காக சிறந்த உள்ளமைந்த தீர்வு இல்லாதபோது அவற்றைப் பயன்படுத்துகிறீர்கள். காலப்போக்கில், குறிப்பிட்ட பிரச்சினைகளுக்கு மேலும் குறிப்பிட்ட தீர்வுகளை வழங்குவதன் மூலம் உங்கள் app-இல் உள்ள Effect-களின் எண்ணிக்கையை குறைந்தபட்சமாகக் குறைப்பதே React குழுவின் இலக்கு. உங்கள் Effect-களை custom Hook-களில் wrap செய்வது, இத்தகைய தீர்வுகள் கிடைக்கும்போது உங்கள் code-ஐ upgrade செய்வதை உதவுகிறது.

இந்த உதாரணத்திற்குத் திரும்புவோம்:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ முன்னேற்றம் சேமிக்கப்பட்டது');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'முன்னேற்றத்தைச் சேமி' : 'மீண்டும் இணைக்கிறது...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

மேலுள்ள உதாரணத்தில், `useOnlineStatus` [`useState`](/reference/react/useState) மற்றும் [`useEffect`.](/reference/react/useEffect) ஜோடியால் implement செய்யப்பட்டுள்ளது. ஆனால் இது சாத்தியமான சிறந்த தீர்வு அல்ல. இது கருதாத பல edge case-கள் உள்ளன. உதாரணமாக, component mount ஆகும் போது `isOnline` ஏற்கனவே `true` என்று இது கருதுகிறது; ஆனால் network ஏற்கனவே offline சென்றிருந்தால் இது தவறாக இருக்கலாம். இதைச் சரிபார்க்க browser [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API-யைப் பயன்படுத்தலாம், ஆனால் அதை நேரடியாகப் பயன்படுத்துவது server-இல் initial HTML உருவாக்கும்போது வேலை செய்யாது. சுருக்கமாக, இந்த code மேம்படுத்தப்படலாம்.

React-இல் [`useSyncExternalStore`](/reference/react/useSyncExternalStore) என்ற dedicated API உள்ளது; இது இந்த எல்லா பிரச்சினைகளையும் உங்களுக்காக கவனிக்கிறது. இந்த புதிய API-யைப் பயன்படுத்துமாறு மீண்டும் எழுதப்பட்ட உங்கள் `useOnlineStatus` Hook இதோ:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ ஆன்லைன்' : '❌ துண்டிக்கப்பட்டது'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ முன்னேற்றம் சேமிக்கப்பட்டது');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'முன்னேற்றத்தைச் சேமி' : 'மீண்டும் இணைக்கிறது...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // client-இல் மதிப்பை பெறுவது எப்படி
    () => true // server-இல் மதிப்பை பெறுவது எப்படி
  );
}

```

</Sandpack>

இந்த migration-ஐ செய்ய **எந்த component-ஐயும் மாற்ற வேண்டியிருக்கவில்லை** என்பதை கவனியுங்கள்:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Effect-களை custom Hook-களில் wrap செய்வது ஏன் பெரும்பாலும் பயனுள்ளதாக இருக்கிறது என்பதற்கான இன்னொரு காரணம் இதுதான்:

1. உங்கள் Effect-களுக்குள் செல்லும் மற்றும் வெளியே வரும் data flow-ஐ மிகவும் வெளிப்படையாக ஆக்குகிறீர்கள்.
2. உங்கள் Effect-களின் சரியான implementation-ஐ விட, உங்கள் component-கள் நோக்கத்தில் கவனம் செலுத்த அனுமதிக்கிறீர்கள்.
3. React புதிய அம்சங்களைச் சேர்க்கும்போது, எந்த component-ஐயும் மாற்றாமல் அந்த Effect-களை நீக்க முடியும்.

[design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) போல, உங்கள் app-ன் component-களிலிருந்து common idiom-களை custom Hook-களாக பிரித்தெடுக்கத் தொடங்குவது பயனுள்ளதாக இருக்கலாம். இது உங்கள் component-களின் code-ஐ நோக்கத்தில் கவனம் செலுத்த வைத்திருக்கும்; மேலும் raw Effect-களை அடிக்கடி எழுதுவதைத் தவிர்க்க உதவும். பல சிறந்த custom Hook-களை React community பராமரிக்கிறது.

<DeepDive>

#### data fetching-க்காக React உள்ளமைந்த தீர்வை வழங்குமா? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

இன்று, [`use`](/reference/react/use#streaming-data-from-server-to-client) API மூலம், [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-ஐ `use`-க்கு pass செய்து render-இல் data-வைப் படிக்கலாம்:

```js {1,4,11}
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>செய்தி இதோ: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛செய்தி பதிவிறங்குகிறது...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

நாங்கள் இன்னும் விவரங்களில் பணிபுரிந்து கொண்டிருக்கிறோம், ஆனால் எதிர்காலத்தில் நீங்கள் data fetching-ஐ இதுபோல் எழுதுவீர்கள் என்று எதிர்பார்க்கிறோம்:

```js {1,4,6}
import { use } from 'react';

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

உங்கள் app-இல் மேலே உள்ள `useData` போன்ற custom Hook-களைப் பயன்படுத்தினால், ஒவ்வொரு component-இலும் raw Effect-களை கைமுறையாக எழுதுவதைக் காட்டிலும், இறுதியில் பரிந்துரைக்கப்படும் அணுகுமுறைக்கு migrate செய்ய குறைவான மாற்றங்கள் போதும். ஆனால் பழைய அணுகுமுறையும் தொடர்ந்து நன்றாகவே வேலை செய்யும், எனவே raw Effect-களை எழுதுவதில் நீங்கள் வசதியாக இருந்தால் அதைத் தொடரலாம்.

</DeepDive>

### இதைச் செய்வதற்கு ஒன்றுக்கு மேற்பட்ட வழிகள் உள்ளன {/*there-is-more-than-one-way-to-do-it*/}

browser [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API-யைப் பயன்படுத்தி fade-in animation-ஐ *ஆரம்பத்திலிருந்து* implement செய்ய விரும்புகிறீர்கள் என்று வைத்துக்கொள்வோம். animation loop-ஐ அமைக்கும் Effect-இல் நீங்கள் தொடங்கலாம். animation-ன் ஒவ்வொரு frame-இலும், `1`-ஐ அடையும் வரை நீங்கள் [ref-இல் வைத்திருக்கும்](/learn/manipulating-the-dom-with-refs) DOM node-ன் opacity-ஐ மாற்றலாம். உங்கள் code இதுபோல் தொடங்கலாம்:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

component-ஐ வாசிக்க மேம்படுத்த, logic-ஐ `useFadeIn` custom Hook-க்குள் பிரித்தெடுக்கலாம்:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

`useFadeIn` code-ஐ அப்படியே வைத்திருக்கலாம், ஆனால் அதை மேலும் refactor செய்யவும் முடியும். உதாரணமாக, animation loop-ஐ அமைக்கும் logic-ஐ `useFadeIn`-இலிருந்து custom `useAnimationLoop` Hook-க்குள் பிரித்தெடுக்கலாம்:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

ஆனால், அதை நீங்கள் *கட்டாயமாக* செய்ய வேண்டியதில்லை. சாதாரண function-களைப் போலவே, உங்கள் code-ன் வேறு பகுதிகளுக்கிடையே எல்லைகளை எங்கு வரைய வேண்டும் என்பதை இறுதியில் நீங்களே தீர்மானிக்கிறீர்கள். மிகவும் வேறுபட்ட அணுகுமுறையையும் எடுக்கலாம். Effect-இல் logic-ஐ வைத்திருப்பதற்கு பதிலாக, பெரும்பாலான imperative logic-ஐ JavaScript [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)-க்குள் நகர்த்தலாம்:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect-கள் React-ஐ external system-களுடன் இணைக்க உதவுகின்றன. Effect-களுக்கிடையே அதிக coordination தேவைப்படும் போது (உதாரணமாக, பல animation-களை chain செய்வதற்கு), அந்த logic-ஐ மேலுள்ள sandbox போல Effect-களிலும் Hook-களிலும் இருந்து *முழுமையாக* வெளியே பிரித்தெடுப்பது அதிக பொருள் கொள்ளும். பிறகு, நீங்கள் பிரித்தெடுத்த code தானே "external system" ஆகிறது. இதனால் உங்கள் Effect-கள் நேரடியாக இருக்கும், ஏனெனில் அவை React-க்கு வெளியே நகர்த்திய system-க்கு message-களை அனுப்புவதுமே அவற்றின் பணி.

மேலுள்ள உதாரணங்கள் fade-in logic JavaScript-இல் எழுதப்பட வேண்டும் என்று கருதுகின்றன. ஆனால் இந்த குறிப்பிட்ட fade-in animation-ஐ சாதாரண [CSS Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) மூலம் implement செய்வது இன்னும் தெளிவுயும் மிகவும் efficient-ஆகவும் இருக்கும்:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      வரவேற்கிறோம்
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'அகற்று' : 'காட்டு'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

சில நேரங்களில், Hook கூட தேவையில்லை!

<Recap>

- Custom Hook-கள் component-களுக்கிடையே logic-ஐப் பகிர உதவும்.
- Custom Hook-களின் பெயர் `use`-க்கு பின் capital letter வரும் வகையில் தொடங்க வேண்டும்.
- Custom Hook-கள் stateful logic-ஐ மட்டுமே பகிரும்; state-ஐயே அல்ல.
- ஒரு Hook-இலிருந்து மற்றொரு Hook-க்கு reactive மதிப்புகளை pass செய்யலாம்; அவை up-to-date ஆக இருக்கும்.
- உங்கள் component re-render ஆகும் ஒவ்வொரு முறையும் எல்லா Hook-களும் மீண்டும் இயங்கும்.
- உங்கள் custom Hook-களின் code, உங்கள் component code போல pure ஆக இருக்க வேண்டும்.
- custom Hook-கள் பெறும் event handler-களை Effect Event-களுக்குள் wrap செய்யுங்கள்.
- `useMount` போன்ற custom Hook-களை உருவாக்க வேண்டாம். அவற்றின் நோக்கத்தை குறிப்பிட்டதாக வைத்திருங்கள்.
- உங்கள் code-ன் எல்லைகளை எப்படி, எங்கே தேர்வு செய்வது என்பது உங்கள் முடிவு.

</Recap>

<Challenges>

#### `useCounter` Hook-ஐப் பிரித்தெடுக்கவும் {/*extract-a-usecounter-hook*/}

இந்த component ஒவ்வொரு விநாடியும் அதிகரிக்கும் எண்ணைக் காட்ட state variable மற்றும் Effect-ஐப் பயன்படுத்துகிறது. இந்த logic-ஐ `useCounter` என்ற custom Hook-க்குள் பிரித்தெடுக்கவும். உங்கள் இலக்கு `Counter` component implementation இதுபோலவே தோன்றச் செய்வது:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

உங்கள் custom Hook-ஐ `useCounter.js`-இல் எழுதிப், அதை `App.js` file-க்குள் import செய்ய வேண்டும்.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

```js src/useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

உங்கள் code இதுபோல் இருக்க வேண்டும்:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

`App.js` இனி `useState` அல்லது `useEffect`-ஐ import செய்ய வேண்டியதில்லை என்பதை கவனியுங்கள்.

</Solution>

#### counter delay-ஐ configure செய்யக்கூடியதாக மாற்றுங்கள் {/*make-the-counter-delay-configurable*/}

இந்த உதாரணத்தில், slider கட்டுப்படுத்தும் `delay` state variable உள்ளது, ஆனால் அதன் மதிப்பு பயன்படுத்தப்படவில்லை. `delay` மதிப்பை உங்கள் custom `useCounter` Hook-க்கு pass செய்து, `1000` ms-ஐ hardcode செய்வதற்கு பதிலாக pass செய்யப்பட்ட `delay`-ஐ பயன்படுத்துமாறு `useCounter` Hook-ஐ மாற்றுங்கள்.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        tick நேரம்: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>tick-கள்: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

`useCounter(delay)` மூலம் உங்கள் Hook-க்கு `delay`-ஐ pass செய்யுங்கள். பிறகு Hook-க்குள், hardcode செய்யப்பட்ட `1000` மதிப்பிற்கு பதிலாக `delay`-ஐ பயன்படுத்துங்கள். உங்கள் Effect-ன் dependency-களில் `delay`-ஐ சேர்க்க வேண்டும். இதனால் `delay` மாறும்போது interval reset ஆகும்.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        tick நேரம்: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>tick-கள்: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### `useCounter`-இலிருந்து `useInterval`-ஐப் பிரித்தெடுக்கவும் {/*extract-useinterval-out-of-usecounter*/}

தற்போது, உங்கள் `useCounter` Hook இரண்டு விஷயங்களைச் செய்கிறது. அது interval-ஐ அமைக்கிறது; மேலும் ஒவ்வொரு interval tick-க்கும் state variable-ஐ அதிகரிக்கிறது. interval-ஐ அமைக்கும் logic-ஐ `useInterval` என்ற தனி Hook-க்குள் பிரித்தெடுக்கவும். அது இரண்டு argument-களை எடுக்க வேண்டும்: `onTick` callback மற்றும் `delay`. இந்த மாற்றத்திற்குப் பிறகு, உங்கள் `useCounter` implementation இதுபோல் இருக்க வேண்டும்:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval`-ஐ `useInterval.js` file-இல் எழுதி, அதை `useCounter.js` file-க்குள் import செய்யுங்கள்.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

`useInterval`-க்குள் உள்ள logic interval-ஐ அமைத்து clear செய்ய வேண்டும். வேறு எதையும் செய்ய வேண்டியதில்லை.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

இந்த தீர்வில் சிறிய பிரச்சினை இருப்பதை கவனியுங்கள்; அதை அடுத்த challenge-இல் நீங்கள் தீர்ப்பீர்கள்.

</Solution>

#### reset ஆகும் interval-ஐச் சரிசெய்யுங்கள் {/*fix-a-resetting-interval*/}

இந்த உதாரணத்தில் *இரண்டு* தனித்தனி interval-கள் உள்ளன.

`App` component `useCounter`-ஐ call செய்கிறது; அது counter-ஐ ஒவ்வொரு விநாடியும் update செய்ய `useInterval`-ஐ call செய்கிறது. ஆனால் `App` component இரண்டு விநாடிகளுக்கு ஒருமுறை page background color-ஐ random ஆக update செய்ய *மேலும்* `useInterval`-ஐ call செய்கிறது.

ஏதோ காரணத்தால் page background-ஐ update செய்யும் callback ஒருபோதும் இயங்கவில்லை. `useInterval`-க்குள் சில log-களைச் சேருங்கள்:

```js {2,5}
  useEffect(() => {
    console.log('✅ delay உடன் interval அமைக்கிறது ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ delay உடன் interval clear செய்கிறது ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

நடக்கும் என்று நீங்கள் எதிர்பார்ப்பதுடன் log-கள் பொருந்துகிறதா? உங்கள் சில Effect-கள் தேவையின்றி re-synchronize ஆகும் போல தெரிந்தால், எந்த dependency அதற்குக் காரணமாக இருக்கிறது என்று கணிக்க முடியுமா? உங்கள் Effect-இலிருந்து அந்த dependency-ஐ [நீக்க ஏதேனும் வழி](/learn/removing-effect-dependencies) உள்ளதா?

பிரச்சினையைச் சரிசெய்த பிறகு, page background இரண்டு விநாடிகளுக்கு ஒருமுறை update ஆகும் என்று எதிர்பார்க்கலாம்.

<Hint>

உங்கள் `useInterval` Hook ஒரு event listener-ஐ argument ஆக ஏற்கும் போல தெரிகிறது. அந்த event listener உங்கள் Effect-ன் dependency ஆக இருக்க வேண்டியதில்லை என அதை wrap செய்ய ஏதேனும் வழி நினைக்க முடியுமா?

</Hint>

<Sandpack>

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

`useInterval`-க்குள், tick callback-ஐ Effect Event-க்குள் wrap செய்யுங்கள்; [இந்தப் பக்கத்தில் முன்பு](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks) செய்தது போல.

இதனால் உங்கள் Effect-ன் dependency-களிலிருந்து `onTick`-ஐ விட முடியும். component ஒவ்வொரு re-render-க்கும் Effect re-synchronize ஆகாது; எனவே page background color மாற்றும் interval இயங்க வாய்ப்பு பெறுவதற்கு முன் ஒவ்வொரு விநாடியும் reset ஆகாது.

இந்த மாற்றத்துடன், இரண்டு interval-களும் எதிர்பார்த்தபடி வேலை செய்து ஒன்றையொன்று பாதிக்காது:

<Sandpack>


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>கடந்த விநாடிகள்: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### staggered movement-ஐ implement செய்யுங்கள் {/*implement-a-staggering-movement*/}

இந்த உதாரணத்தில், `usePointerPosition()` Hook தற்போதைய pointer position-ஐ கண்காணிக்கிறது. preview பகுதியில் cursor அல்லது உங்கள் விரலை நகர்த்திப் பாருங்கள்; red dot உங்கள் நகர்வைப் பின்தொடர்வதைப் பாருங்கள். அதன் position `pos1` variable-இல் சேமிக்கப்படுகிறது.

உண்மையில், ஐந்து (!) வேறு red dot-கள் render செய்யப்படுகின்றன. தற்போது அவை எல்லாம் ஒரே position-இல் தோன்றுவதால் நீங்கள் அவற்றைக் காணவில்லை. இதைத்தான் நீங்கள் சரிசெய்ய வேண்டும். அதற்கு பதிலாக implement செய்ய வேண்டியது "staggered" movement: ஒவ்வொரு dot-மும் முந்தைய dot-ன் பாதையை "follow" செய்ய வேண்டும். உதாரணமாக, cursor-ஐ வேகமாக நகர்த்தினால், முதல் dot உடனடியாக அதைப் பின்தொடர வேண்டும்; இரண்டாவது dot சிறிய தாமதத்துடன் முதல் dot-ஐப் பின்தொடர வேண்டும்; மூன்றாவது dot இரண்டாவது dot-ஐப் பின்தொடர வேண்டும்; இவ்வாறு தொடர வேண்டும்.

நீங்கள் `useDelayedValue` custom Hook-ஐ implement செய்ய வேண்டும். அதன் தற்போதைய implementation அதற்கு வழங்கப்பட்ட `value`-ஐ return செய்கிறது. அதற்கு பதிலாக, `delay` milliseconds முன்பிருந்த value-ஐ return செய்ய வேண்டும். இதைச் செய்ய சில state மற்றும் Effect தேவைப்படலாம்.

`useDelayedValue`-ஐ implement செய்த பிறகு, dot-கள் ஒன்றை ஒன்று பின்தொடர்ந்து நகர்வதைப் பார்க்க வேண்டும்.

<Hint>

உங்கள் custom Hook-க்குள் `delayedValue`-ஐ state variable ஆகச் சேமிக்க வேண்டும். `value` மாறும்போது, நீங்கள் ஒரு Effect-ஐ இயக்க வேண்டும். இந்த Effect `delay`-க்கு பிறகு `delayedValue`-ஐ update செய்ய வேண்டும். `setTimeout`-ஐ call செய்வது பயனுள்ளதாக இருக்கலாம்.

இந்த Effect-க்கு cleanup தேவைப்படுமா? ஏன் அல்லது ஏன் இல்லை?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

வேலை செய்யும் version இதோ. நீங்கள் `delayedValue`-ஐ state variable ஆக வைத்திருக்கிறீர்கள். `value` update ஆகும்போது, உங்கள் Effect `delayedValue`-ஐ update செய்ய timeout ஒன்றை schedule செய்கிறது. அதனால் `delayedValue` எப்போதும் உண்மையான `value`-க்கு "பின்னால் தாமதமாக" இருக்கும்.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

இந்த Effect-க்கு cleanup *தேவையில்லை* என்பதை கவனியுங்கள். cleanup function-இல் `clearTimeout`-ஐ call செய்தால், `value` மாறும் ஒவ்வொரு முறையும் ஏற்கனவே schedule செய்யப்பட்ட timeout reset ஆகிவிடும். movement தொடர்ந்து இருக்க, எல்லா timeout-களும் fire ஆக வேண்டும்.

</Solution>

</Challenges>
