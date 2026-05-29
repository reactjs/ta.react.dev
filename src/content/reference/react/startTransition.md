---
title: startTransition
---

<Intro>

`startTransition`, UI-யின் ஒரு பகுதியை background-இல் render செய்ய உதவுகிறது.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

`startTransition` function, state update ஒன்றை Transition ஆகக் குறிக்க உதவுகிறது.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

* `action`: ஒன்று அல்லது அதற்கு மேற்பட்ட [`set` functions](/reference/react/useState#setstate)-ஐ அழைத்து சில state-ஐ update செய்யும் function. React `action`-ஐ எந்த parameters-மும் இல்லாமல் உடனே அழைத்து, `action` function call நடக்கும் போது synchronously schedule செய்யப்படும் அனைத்து state updates-ஐ Transitions ஆகக் குறிக்கும். `action`-இல் `await` செய்யப்படும் async calls transition-இல் சேர்க்கப்படும், ஆனால் தற்போது `await`-க்கு பிறகு வரும் எந்த `set` functions-ஐயும் கூடுதல் `startTransition`-இல் wrap செய்ய வேண்டும் ([Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)-ஐப் பார்க்கவும்). Transitions ஆகக் குறிக்கப்பட்ட state updates [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) ஆக இருக்கும்; மேலும் [தேவையற்ற loading indicators-ஐ காட்டாது.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Returns {/*returns*/}

`startTransition` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

* Transition pending ஆக உள்ளதா என்பதை track செய்ய `startTransition` வழி வழங்காது. Transition நடைபெறும்போது pending indicator ஒன்றைக் காட்ட வேண்டுமெனில், அதற்கு பதிலாக [`useTransition`](/reference/react/useTransition) தேவை.

* அந்த state-இன் `set` function-ஐ அணுக முடிந்தால் மட்டுமே update ஒன்றை Transition ஆக wrap செய்ய முடியும். ஏதேனும் prop அல்லது custom Hook return value-க்கு பதிலாக Transition ஒன்றைத் தொடங்க விரும்பினால், அதற்கு பதிலாக [`useDeferredValue`](/reference/react/useDeferredValue)-ஐ முயற்சிக்கவும்.

* `startTransition`-க்கு pass செய்யும் function உடனே அழைக்கப்படும்; அது இயங்கும் போது நிகழும் அனைத்து state updates-ஐ Transitions ஆகக் குறிக்கும். உதாரணமாக, `setTimeout`-இல் state updates செய்ய முயன்றால், அவை Transitions ஆகக் குறிக்கப்படாது.

* எந்த async requests-க்கும் பிறகு வரும் state updates-ஐ Transitions ஆகக் குறிக்க அவற்றை மற்றொரு `startTransition`-இல் wrap செய்ய வேண்டும். இது அறியப்பட்ட வரம்பு; எதிர்காலத்தில் இதை சரிசெய்வோம் ([Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)-ஐப் பார்க்கவும்).

* Transition ஆகக் குறிக்கப்பட்ட state update, பிற state updates-ஆல் interrupt செய்யப்படும். உதாரணமாக, Transition உள்ளே chart component ஒன்றை update செய்தபின், chart re-render நடந்து கொண்டிருக்கும்போது input ஒன்றில் type செய்யத் தொடங்கினால், input state update-ஐ கையாள்ந்த பிறகு React chart component-இன் rendering பணியை மீண்டும் தொடங்கும்.

* Text inputs-ஐ control செய்ய Transition updates-ஐப் பயன்படுத்த முடியாது.

* பல Transitions ஒரே நேரத்தில் நடைபெற்று கொண்டிருந்தால், React தற்போது அவற்றை ஒன்றாக batch செய்கிறது. இது எதிர்கால release-இல் நீக்கப்படக்கூடிய வரம்பு.

---

## Usage {/*usage*/}

### State update ஒன்றை non-blocking Transition ஆகக் குறித்தல் {/*marking-a-state-update-as-a-non-blocking-transition*/}

State update ஒன்றை `startTransition` call-இல் wrap செய்வதன் மூலம் அதை *Transition* ஆகக் குறிக்கலாம்:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Slow devices-ல்கூட user interface updates responsive ஆக இருக்க Transitions உதவுகின்றன.

Transition பயன்படுத்தும்போது, re-render நடந்து கொண்டிருக்கும்போதும் உங்கள் UI responsive ஆகவே இருக்கும். உதாரணமாக, user ஒரு tab-ஐ click செய்துவிட்டு உடனே மனம் மாறி மற்றொரு tab-ஐ click செய்தால், முதல் re-render முடிவதற்காக காத்திருக்காமல் அதைச் செய்ய முடியும்.

<Note>

`startTransition` என்பது [`useTransition`](/reference/react/useTransition)-க்கு மிகவும் ஒத்தது; ஆனால் Transition நடைபெறுகிறதா என்பதை track செய்ய `isPending` flag-ஐ வழங்காது. `useTransition` கிடைக்காத இடங்களில் `startTransition`-ஐ அழைக்கலாம். உதாரணமாக, data library போன்ற components-க்கு வெளியே `startTransition` வேலை செய்கிறது.

[`useTransition` பக்கத்தில் Transitions பற்றி அறிந்து உதாரணங்களைப் பாருங்கள்.](/reference/react/useTransition)

</Note>
