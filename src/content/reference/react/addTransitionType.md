---
title: addTransitionType
version: canary
---

<Canary>

**`addTransitionType` API தற்போது React-ன் Canary மற்றும் Experimental channels-இல் மட்டுமே கிடைக்கிறது.**

[React-ன் release channels பற்றி இங்கே மேலும் அறிக.](/community/versioning-policy#all-release-channels)

</Canary>

<Intro>

ஒரு transition-ன் காரணத்தை குறிப்பிட `addTransitionType` உதவுகிறது.


```js
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### Parameters {/*parameters*/}

- `type`: சேர்க்க வேண்டிய transition வகை. இது எந்த string ஆகவும் இருக்கலாம்.

#### Returns {/*returns*/}

`addTransitionType` எதையும் return செய்யாது.

#### Caveats {/*caveats*/}

- பல transitions ஒன்றாக combine செய்யப்பட்டால், அனைத்து Transition Types-உம் collect செய்யப்படும். ஒரு Transition-க்கு ஒன்றுக்கு மேற்பட்ட type-ஐயும் சேர்க்கலாம்.
- ஒவ்வொரு commit-க்கும் பிறகு Transition Types reset செய்யப்படும். இதன் பொருள்: `startTransition`-க்கு பிறகு ஒரு `<Suspense>` fallback types-ஐ associate செய்யும்; ஆனால் content reveal ஆகும்போது அது செய்யாது.

---

## பயன்பாடு {/*usage*/}

### Transition-ன் காரணத்தைச் சேர்த்தல் {/*adding-the-cause-of-a-transition*/}

Transition-ன் காரணத்தை காட்ட `startTransition`-க்குள் `addTransitionType`-ஐ call செய்யுங்கள்:

``` [[1, 6, "addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

<CodeStep step={2}>startTransition</CodeStep> scope-க்குள் <CodeStep step={1}>addTransitionType</CodeStep>-ஐ call செய்தால், React <CodeStep step={3}>submit-click</CodeStep>-ஐ Transition-ன் காரணங்களில் ஒன்றாக associate செய்யும்.

தற்போது, Transition-க்கு என்ன காரணம் என்பதை அடிப்படையாகக் கொண்டு வெவ்வேறு animations-ஐ customize செய்ய Transition Types பயன்படுத்தலாம். அவற்றைப் பயன்படுத்த மூன்று வழிகளில் தேர்வு செய்யலாம்:

- [Browser view transition types பயன்படுத்தி animations-ஐ customize செய்தல்](#customize-animations-using-browser-view-transition-types)
- [`View Transition` Class பயன்படுத்தி animations-ஐ customize செய்தல்](#customize-animations-using-view-transition-class)
- [`ViewTransition` events பயன்படுத்தி animations-ஐ customize செய்தல்](#customize-animations-using-viewtransition-events)

எதிர்காலத்தில் transition-ன் காரணத்தைப் பயன்படுத்தும் மேலும் பல use cases-ஐ support செய்ய திட்டமிட்டுள்ளோம்.

---
### Browser view transition types பயன்படுத்தி animations-ஐ customize செய்தல் {/*customize-animations-using-browser-view-transition-types*/}

ஒரு transition-இலிருந்து [`ViewTransition`](/reference/react/ViewTransition) activate ஆகும்போது, React அனைத்து Transition Types-ஐயும் browser [view transition types](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) ஆக element-க்கு சேர்க்கும்.

இதனால் CSS scopes அடிப்படையில் வெவ்வேறு animations-ஐ customize செய்யலாம்:

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### `View Transition` Class பயன்படுத்தி animations-ஐ customize செய்தல் {/*customize-animations-using-view-transition-class*/}

View Transition Class-க்கு ஒரு object pass செய்வதன் மூலம், type அடிப்படையில் activated `ViewTransition`-க்கான animations-ஐ customize செய்யலாம்:

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

பல types match ஆனால், அவை ஒன்றாக இணைக்கப்படும். எந்த types-உம் match ஆகவில்லை என்றால், அதற்கு பதிலாக சிறப்பு `"default"` entry பயன்படுத்தப்படும். எந்த type-க்கும் `"none"` value இருந்தால், அது முன்னுரிமை பெற்று ViewTransition disable செய்யப்படும் (name assign செய்யப்படாது).

Trigger வகை மற்றும் Transition Type அடிப்படையில் match செய்ய, இவற்றை enter/exit/update/layout/share props உடன் combine செய்யலாம்.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### `ViewTransition` events பயன்படுத்தி animations-ஐ customize செய்தல் {/*customize-animations-using-viewtransition-events*/}

View Transition events பயன்படுத்தி, type அடிப்படையில் activated `ViewTransition`-க்கான animations-ஐ imperatively customize செய்யலாம்:

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

இதனால் காரணத்தை அடிப்படையாகக் கொண்டு வெவ்வேறு imperative Animations-ஐ தேர்வு செய்யலாம்.
