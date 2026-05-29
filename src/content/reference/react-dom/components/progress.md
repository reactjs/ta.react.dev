---
title: "<progress>"
---

<Intro>

[உலாவியில் உள்ளமைந்த `<progress>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress), progress indicator ஒன்றை render செய்ய உதவுகிறது.

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<progress>` {/*progress*/}

Progress indicator ஒன்றைக் காட்ட, [உலாவியில் உள்ளமைந்த `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) component-ஐ render செய்யுங்கள்.

```js
<progress value={0.5} />
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Props {/*props*/}

`<progress>` அனைத்து [common element props](/reference/react-dom/components/common#common-props)-ஐ ஆதரிக்கிறது.

மேலும், `<progress>` இந்த props-ஐ ஆதரிக்கிறது:

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): ஒரு number. அதிகபட்ச `value`-ஐ குறிப்பிடுகிறது. Default ஆக `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): `0` மற்றும் `max` இடையிலான number, அல்லது முடிவறியாத progress-க்கு `null`. எவ்வளவு முடிந்துள்ளது என்பதை குறிப்பிடுகிறது.

---

## Usage {/*usage*/}

### Progress indicator-ஐ கட்டுப்படுத்துதல் {/*controlling-a-progress-indicator*/}

Progress indicator ஒன்றைக் காட்ட, `<progress>` component-ஐ render செய்யுங்கள். நீங்கள் குறிப்பிடும் `max` value மற்றும் `0` இடையிலான number `value`-ஐ pass செய்யலாம். `max` value-ஐ pass செய்யவில்லை என்றால், default ஆக அது `1` என்று கருதப்படும்.

செயல்பாடு இன்னும் நடைபெற்று கொண்டிருந்தாலும் அதன் அளவு தெரியாவிட்டால், progress indicator-ஐ indeterminate state-இல் வைக்க `value={null}` pass செய்யுங்கள்.

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
