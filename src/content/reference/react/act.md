---
title: act
---

<Intro>

Assertions செய்வதற்கு முன் pending React updates-ஐ apply செய்ய `act` பயன்படும் test helper.

```js
await act(async actFn)
```

</Intro>

Assertions-க்கு ஒரு component-ஐத் தயாராக்க, அதை render செய்வதும் updates செய்வதும் உள்ள code-ஐ `await act()` call-க்குள் wrap செய்யுங்கள். இதனால் உங்கள் test, browser-இல் React செயல்படும் முறைக்கு நெருக்கமாக run ஆகும்.

<Note>
`act()`-ஐ நேரடியாகப் பயன்படுத்துவது சற்று verbose ஆக தோன்றலாம். Boilerplate-ஐ குறைக்க, helpers `act()`-ஆல் wrap செய்யப்பட்டுள்ள [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) போன்ற library-ஐப் பயன்படுத்தலாம்.
</Note>


<InlineToc />

---

## குறிப்பு {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

UI tests எழுதும்போது, rendering, user events, அல்லது data fetching போன்ற tasks-ஐ user interface உடன் interaction செய்யும் “units” ஆகக் கருதலாம். Assertions செய்வதற்கு முன், இந்த “units” தொடர்பான எல்லா updates-உம் process செய்யப்பட்டு DOM-இல் apply செய்யப்பட்டுள்ளன என்பதை உறுதிசெய்ய React `act()` என்ற helper-ஐ வழங்குகிறது.

`act` என்ற பெயர் [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert) pattern-இலிருந்து வருகிறது.

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

`await` மற்றும் `async` function உடன் `act` பயன்படுத்த பரிந்துரைக்கிறோம். Sync version பல சூழல்களில் வேலை செய்தாலும், எல்லா சூழல்களிலும் வேலை செய்யாது; மேலும் React updates-ஐ internally schedule செய்யும் விதத்தால், sync version எப்போது பயன்படுத்தலாம் என்பதை கணிப்பது கடினம்.

எதிர்காலத்தில் sync version-ஐ deprecate செய்து அகற்றுவோம்.

</Note>

#### Parameters {/*parameters*/}

* `async actFn`: Test செய்யப்படும் components-க்கான renders அல்லது interactions-ஐ wrap செய்யும் async function. `actFn`-க்குள் trigger செய்யப்படும் updates அனைத்தும் internal act queue-க்கு சேர்க்கப்பட்டு, பின்னர் DOM-இல் மாற்றங்களை process செய்து apply செய்ய ஒன்றாக flush செய்யப்படும். இது async என்பதால், async boundary-ஐ கடக்கும் code-ஐயும் React run செய்து, scheduled updates-ஐ flush செய்யும்.

#### Returns {/*returns*/}

`act` எதையும் return செய்யாது.

## பயன்பாடு {/*usage*/}

ஒரு component-ஐ test செய்யும்போது, அதன் output குறித்து assertions செய்ய `act`-ஐப் பயன்படுத்தலாம்.

உதாரணமாக, இந்த `Counter` component உங்களிடம் உள்ளது என்று வைத்துக் கொள்ளுங்கள். கீழே உள்ள usage examples அதை எப்படி test செய்வது என்பதை காட்டுகின்றன:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### Tests-இல் components render செய்தல் {/*rendering-components-in-tests*/}

ஒரு component-ன் render output-ஐ test செய்ய, render-ஐ `act()`-க்குள் wrap செய்யுங்கள்:

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);

  // ✅ Render the component inside act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

இங்கு நாம் ஒரு container உருவாக்கி, அதை document-க்கு append செய்து, `Counter` component-ஐ `act()`-க்குள் render செய்கிறோம். Assertions செய்வதற்கு முன் component render செய்யப்பட்டு அதன் effects apply செய்யப்பட்டுள்ளன என்பதை இது உறுதிசெய்கிறது.

Assertions செய்வதற்கு முன் அனைத்து updates-உம் apply செய்யப்பட்டுள்ளன என்பதை `act` உறுதிசெய்கிறது.

### Tests-இல் events dispatch செய்தல் {/*dispatching-events-in-tests*/}

Events-ஐ test செய்ய, event dispatch-ஐ `act()`-க்குள் wrap செய்யுங்கள்:

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });

  // ✅ Dispatch the event inside act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

இங்கு நாம் component-ஐ `act` உடன் render செய்து, பின்னர் மற்றொரு `act()`-க்குள் event-ஐ dispatch செய்கிறோம். Assertions செய்வதற்கு முன் event-இலிருந்து வந்த அனைத்து updates-உம் apply செய்யப்பட்டுள்ளன என்பதை இது உறுதிசெய்கிறது.

<Pitfall>

DOM container document-க்கு சேர்க்கப்பட்டிருக்கும்போது மட்டுமே DOM events dispatch செய்வது வேலை செய்யும் என்பதை மறக்க வேண்டாம். Boilerplate code-ஐ குறைக்க [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) போன்ற library-ஐப் பயன்படுத்தலாம்.

</Pitfall>

## சிக்கல் தீர்வு {/*troubleshooting*/}

### "The current testing environment is not configured to support act(...)" என்ற error வருகிறது {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

`act` பயன்படுத்த, உங்கள் test environment-இல் `global.IS_REACT_ACT_ENVIRONMENT=true` set செய்ய வேண்டும். சரியான environment-இல் மட்டுமே `act` பயன்படுத்தப்படுவதை உறுதிசெய்ய இதை செய்கிறோம்.

Global-ஐ set செய்யவில்லை என்றால், இப்படியான error தெரியும்:

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

சரிசெய்ய, React tests-க்கான உங்கள் global setup file-இல் இதைச் சேர்க்கவும்:

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro) போன்ற testing frameworks-இல், `IS_REACT_ACT_ENVIRONMENT` ஏற்கனவே உங்களுக்காக set செய்யப்பட்டிருக்கும்.

</Note>
