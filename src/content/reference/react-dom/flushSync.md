---
title: flushSync
---

<Pitfall>

`flushSync` பயன்படுத்துவது அரிதானது; இது உங்கள் app-ன் performance-ஐ பாதிக்கலாம்.

</Pitfall>

<Intro>

கொடுக்கப்பட்ட callback-க்குள் உள்ள updates-ஐ synchronously flush செய்ய React-ஐ force செய்ய `flushSync` உதவுகிறது. இதனால் DOM உடனடியாக update ஆகிறது என்பதை உறுதிசெய்கிறது.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Pending work எதையும் flush செய்து DOM-ஐ synchronously update செய்ய React-ஐ force செய்ய `flushSync`-ஐ call செய்யுங்கள்.

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

பெரும்பாலும், `flushSync`-ஐத் தவிர்க்கலாம். கடைசி வழியாக மட்டுமே `flushSync` பயன்படுத்துங்கள்.

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}


* `callback`: ஒரு function. React இந்த callback-ஐ உடனடியாக call செய்து, இதில் உள்ள updates-ஐ synchronously flush செய்யும். Pending updates, Effects, அல்லது Effects-க்குள் உள்ள updates-ஐயும் flush செய்யலாம். இந்த `flushSync` call-ன் விளைவாக ஒரு update suspend ஆனால், fallbacks மீண்டும் காட்டப்படலாம்.

#### Returns {/*returns*/}

`flushSync` `undefined` return செய்கிறது.

#### Caveats {/*caveats*/}

* `flushSync` performance-ஐ குறிப்பிடத்தக்க அளவில் பாதிக்கலாம். குறைவாக பயன்படுத்துங்கள்.
* Pending Suspense boundaries அவற்றின் `fallback` state-ஐ காட்ட `flushSync` force செய்யலாம்.
* Return செய்வதற்கு முன் pending Effects-ஐ run செய்து, அவற்றில் உள்ள updates-ஐ synchronously apply செய்ய `flushSync` செய்யலாம்.
* Callback-க்குள் உள்ள updates-ஐ flush செய்ய தேவையானபோது, callback-க்கு வெளியிலுள்ள updates-ஐயும் `flushSync` flush செய்யலாம். உதாரணமாக, ஒரு click-இலிருந்து pending updates இருந்தால், callback-க்குள் உள்ள updates-க்கு முன் React அவற்றை flush செய்யலாம்.

---

## பயன்பாடு {/*usage*/}

### Third-party integrations-க்காக updates flush செய்தல் {/*flushing-updates-for-third-party-integrations*/}

Browser APIs அல்லது UI libraries போன்ற third-party code உடன் integrate செய்யும்போது, updates-ஐ flush செய்ய React-ஐ force செய்ய வேண்டியிருக்கலாம். Callback-க்குள் உள்ள <CodeStep step={1}>state updates</CodeStep>-ஐ synchronously flush செய்ய React-ஐ force செய்ய `flushSync`-ஐப் பயன்படுத்துங்கள்:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

அடுத்த code line run ஆகும் நேரத்திற்குள் React ஏற்கனவே DOM-ஐ update செய்துவிட்டதை இது உறுதிசெய்கிறது.

**`flushSync` பயன்படுத்துவது அரிதானது; அதை அடிக்கடி பயன்படுத்துவது உங்கள் app-ன் performance-ஐ குறிப்பிடத்தக்க அளவில் பாதிக்கலாம்.** உங்கள் app React APIs மட்டும் பயன்படுத்தி, third-party libraries உடன் integrate செய்யவில்லை என்றால், `flushSync` தேவையில்லை.

ஆனால் browser APIs போன்ற third-party code உடன் integrate செய்ய இது உதவியாக இருக்கலாம்.

சில browser APIs, callbacks-க்குள் உள்ள results callback முடியும் நேரத்திற்குள் DOM-இல் synchronously எழுதப்பட்டிருக்க வேண்டும் என்று எதிர்பார்க்கின்றன; அப்போதுதான் browser rendered DOM-ஐ வைத்து ஏதாவது செய்ய முடியும். பெரும்பாலான சூழல்களில் React இதை உங்களுக்காக தானாக கையாளுகிறது. ஆனால் சில சூழல்களில் synchronous update-ஐ force செய்ய வேண்டியிருக்கலாம்.

உதாரணமாக, browser `onbeforeprint` API print dialog திறக்கும் முன் page-ஐ உடனடியாக மாற்ற அனுமதிக்கிறது. Printing-க்கு document சிறப்பாக display ஆக custom print styles apply செய்ய இது பயனுள்ளது. கீழே உள்ள உதாரணத்தில், React state-ஐ DOM-க்கு உடனடியாக "flush" செய்ய `onbeforeprint` callback-க்குள் `flushSync` பயன்படுத்துகிறீர்கள். பிறகு print dialog திறக்கும் நேரத்திற்குள், `isPrinting` `"yes"` என்று காட்டும்:

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

`flushSync` இல்லையெனில், print dialog `isPrinting`-ஐ `"no"` என்று காட்டும். ஏனெனில் React updates-ஐ asynchronously batch செய்கிறது; state update ஆகும் முன்பே print dialog காட்டப்படுகிறது.

<Pitfall>

`flushSync` performance-ஐ குறிப்பிடத்தக்க அளவில் பாதிக்கலாம்; மேலும் pending Suspense boundaries திடீரென fallback state-ஐ காட்ட force செய்யப்படலாம்.

பெரும்பாலும், `flushSync`-ஐத் தவிர்க்கலாம்; எனவே கடைசி வழியாக மட்டுமே `flushSync` பயன்படுத்துங்கள்.

</Pitfall>

---

## சிக்கல் தீர்வு {/*troubleshooting*/}

### "flushSync was called from inside a lifecycle method" என்ற error வருகிறது {/*im-getting-an-error-flushsync-was-called-from-inside-a-lifecycle-method*/}


ஒரு render நடுவில் React `flushSync` செய்ய முடியாது. அப்படிச் செய்தால், அது noop ஆகி warning காட்டும்:

<ConsoleBlock level="error">

Warning: flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task.

</ConsoleBlock>

இதில் `flushSync`-ஐ பின்வரும் இடங்களில் call செய்வதும் அடங்கும்:

- ஒரு component render செய்யும்போது.
- `useLayoutEffect` அல்லது `useEffect` hooks-இல்.
- Class component lifecycle methods-இல்.

உதாரணமாக, Effect-இல் `flushSync` call செய்தால் அது noop ஆகி warning காட்டும்:

```js
import { useEffect } from 'react';
import { flushSync } from 'react-dom';

function MyComponent() {
  useEffect(() => {
    // 🚩 Wrong: calling flushSync inside an effect
    flushSync(() => {
      setSomething(newValue);
    });
  }, []);

  return <div>{/* ... */}</div>;
}
```

இதைக் சரிசெய்ய, பொதுவாக `flushSync` call-ஐ ஒரு event-க்கு நகர்த்த வேண்டும்:

```js
function handleClick() {
  // ✅ Correct: flushSync in event handlers is safe
  flushSync(() => {
    setSomething(newValue);
  });
}
```


Event-க்கு நகர்த்துவது கடினமாக இருந்தால், microtask-இல் `flushSync`-ஐ defer செய்யலாம்:

```js {3,7}
useEffect(() => {
  // ✅ Correct: defer flushSync to a microtask
  queueMicrotask(() => {
    flushSync(() => {
      setSomething(newValue);
    });
  });
}, []);
```

இது தற்போதைய render முடிவதற்கு அனுமதித்து, updates-ஐ flush செய்ய மற்றொரு synchronous render-ஐ schedule செய்யும்.

<Pitfall>

`flushSync` performance-ஐ குறிப்பிடத்தக்க அளவில் பாதிக்கலாம்; ஆனால் இந்த குறிப்பிட்ட pattern performance-க்கு இன்னும் மோசமானது. Escape hatch ஆக microtask-இல் `flushSync` call செய்வதற்கு முன் மற்ற எல்லா options-ஐயும் முயற்சி செய்யுங்கள்.

</Pitfall>
