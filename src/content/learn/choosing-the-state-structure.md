---
title: State அமைப்பைத் தேர்வு செய்தல்
---

<Intro>

state-ஐ நன்றாக அமைப்பது, மாற்றவும் debug செய்யவும் இனிமையான component-க்கும், தொடர்ந்து bug-களின் மூலமாக இருக்கும் component-க்கும் உள்ள வேறுபாட்டை உருவாக்கும். state-ஐ அமைக்கும் போது கருத வேண்டிய சில குறிப்புகள் இங்கே.

</Intro>

<YouWillLearn>

* ஒரே state variable மற்றும் பல state variable-களை எப்போது பயன்படுத்துவது
* state-ஐ ஒழுங்குபடுத்தும் போது எதைத் தவிர்க்க வேண்டும்
* state அமைப்பில் பொதுவான பிரச்சினைகளை எப்படி சரிசெய்வது

</YouWillLearn>

## state-ஐ அமைப்பதற்கான கொள்கைகள் {/*principles-for-structuring-state*/}

சில state-ஐ வைத்திருக்கும் component-ஐ எழுதும்போது, எத்தனை state variable-களைப் பயன்படுத்த வேண்டும், அவற்றின் data shape எப்படி இருக்க வேண்டும் என்பதில் தேர்வுகள் செய்ய வேண்டும். சிறந்ததல்லாத state அமைப்புடனும் சரியான program-களை எழுத முடிந்தாலும், சிறந்த தேர்வுகளைச் செய்ய உங்களுக்கு வழிகாட்டும் சில கொள்கைகள் உள்ளன:

1. **தொடர்புடைய state-ஐ group செய்யுங்கள்.** இரண்டு அல்லது அதற்கு மேற்பட்ட state variable-களை எப்போதும் ஒரே நேரத்தில் update செய்கிறீர்கள் என்றால், அவற்றை ஒரே state variable-ஆக merge செய்வதை கருதுங்கள்.
2. **state-இல் முரண்பாடுகளைத் தவிருங்கள்.** பல state துண்டுகள் ஒன்றுக்கொன்று முரண்பட்டு "ஒத்துக்கொள்ளாமல்" இருக்குமாறு state அமைக்கப்பட்டால், பிழைகளுக்கு இடமளிக்கிறீர்கள். இதைத் தவிர்க்க முயலுங்கள்.
3. **redundant state-ஐத் தவிருங்கள்.** rendering நடக்கும் போது component-ன் props அல்லது ஏற்கனவே உள்ள state variable-களிலிருந்து சில தகவலை கணக்கிட முடிந்தால், அந்த தகவலை அந்த component-ன் state-இல் வைக்க வேண்டாம்.
4. **state-இல் duplication-ஐத் தவிருங்கள்.** ஒரே data பல state variable-களுக்கிடையே, அல்லது nested object-களுக்குள் duplicate செய்யப்பட்டால், அவற்றை sync-இல் வைத்திருப்பது கடினம். முடிந்தால் duplication-ஐக் குறையுங்கள்.
5. **ஆழமாக nested state-ஐத் தவிருங்கள்.** ஆழமான hierarchical state update செய்ய வசதியாக இருக்காது. முடிந்தால், state-ஐ flat முறையில் அமைப்பதை விரும்புங்கள்.

இந்த கொள்கைகளின் நோக்கம், *பிழைகளை அறிமுகப்படுத்தாமல் state-ஐ update செய்வதை மேம்படுத்துவது*. state-இலிருந்து redundant மற்றும் duplicate data-வை நீக்குவது, அதன் எல்லா பகுதிகளும் sync-இல் இருப்பதை உறுதிசெய்ய உதவும். bug வாய்ப்பைக் குறைக்க database engineer ஒருவர் database அமைப்பை ["normalize" செய்ய](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description) விரும்புவதை இது ஒத்திருக்கும். Albert Einstein சொன்னதை மாற்றிச் சொன்னால், **"உங்கள் state-ஐ இயன்ற அளவு நேரடியாக வைத்திருங்கள்; ஆனால் அதற்கும் குறைவாக அல்ல."**

இப்போது இந்த கொள்கைகள் செயலில் எப்படி பொருந்துகின்றன என்பதைப் பார்ப்போம்.

## தொடர்புடைய state-ஐ group செய்யுங்கள் {/*group-related-state*/}

சில சமயம் ஒரே state variable-ஐப் பயன்படுத்தலாமா, பல state variable-களைப் பயன்படுத்தலாமா என்று குழப்பமாக இருக்கலாம்.

இப்படிச் செய்ய வேண்டுமா?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

அல்லது இப்படியா?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

தொழில்நுட்ப ரீதியாக, இந்த இரு அணுகுமுறைகளிலும் ஏதாவது ஒன்றைப் பயன்படுத்தலாம். ஆனால் **இரண்டு state variable-கள் எப்போதும் ஒன்றாக மாறினால், அவற்றை ஒரே state variable-ஆக ஒன்றிணைப்பது நல்ல யோசனையாக இருக்கலாம்.** அப்போது அவற்றை எப்போதும் sync-இல் வைத்திருக்க மறந்து விடமாட்டீர்கள்; cursor-ஐ நகர்த்தும்போது red dot-ன் இரண்டு coordinate-களும் update ஆகும் இந்த உதாரணம் போல:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

உங்களுக்கு எத்தனை state துண்டுகள் தேவைப்படும் என்று தெரியாதபோது data-வை object அல்லது array-ஆக group செய்வதும் உதவும். உதாரணமாக, பயனர் custom field-களைச் சேர்க்கக்கூடிய form இருந்தால் இது பயனுள்ளதாக இருக்கும்.

<Pitfall>

உங்கள் state variable object ஆக இருந்தால், மற்ற field-களை வெளிப்படையாக copy செய்யாமல் [அதில் ஒரே ஒரு field-ஐ மட்டும் update செய்ய முடியாது](/learn/updating-objects-in-state) என்பதை நினைவில் கொள்ளுங்கள். உதாரணமாக, மேலுள்ள உதாரணத்தில் `setPosition({ x: 100 })` செய்ய முடியாது, ஏனெனில் அதில் `y` property இல்லையே! அதற்கு பதிலாக, `x`-ஐ மட்டும் அமைக்க விரும்பினால், `setPosition({ ...position, x: 100 })` செய்யலாம், அல்லது அவற்றை இரண்டு state variable-களாகப் பிரித்து `setX(100)` செய்யலாம்.

</Pitfall>

## state-இல் முரண்பாடுகளைத் தவிருங்கள் {/*avoid-contradictions-in-state*/}

`isSending` மற்றும் `isSent` state variable-களுடன் ஒரு hotel feedback form இதோ:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>feedback-க்கு நன்றி!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>The Prancing Pony-இல் உங்கள் தங்கும் அனுபவம் எப்படி இருந்தது?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        அனுப்பு
      </button>
      {isSending && <p>அனுப்புகிறது...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

இந்த code வேலை செய்தாலும், "சாத்தியமில்லாத" state-களுக்கான வாய்ப்பை திறந்து விடுகிறது. உதாரணமாக, `setIsSent` மற்றும் `setIsSending`-ஐ சேர்த்து call செய்ய மறந்தால், `isSending` மற்றும் `isSent` இரண்டும் ஒரே நேரத்தில் `true` ஆக இருக்கும் நிலை உருவாகலாம். உங்கள் component அதிகமாக சிக்கலானதாக இருக்கும்போது, என்ன நடந்தது என்பதைப் புரிந்துகொள்வது கடினமாகும்.

**`isSending` மற்றும் `isSent` ஒரே நேரத்தில் `true` ஆக இருக்கக்கூடாததால், அவற்றை *மூன்று* செல்லுபடியான state-களில் ஒன்றை எடுக்கக்கூடிய ஒரே `status` state variable-ஆல் மாற்றுவது நல்லது:** `'typing'` (initial), `'sending'`, மற்றும் `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>feedback-க்கு நன்றி!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>The Prancing Pony-இல் உங்கள் தங்கும் அனுபவம் எப்படி இருந்தது?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        அனுப்பு
      </button>
      {isSending && <p>அனுப்புகிறது...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

வாசிப்புத் தெளிவுக்காக சில constant-களை இன்னும் அறிவிக்கலாம்:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

ஆனால் அவை state variable-கள் அல்ல, எனவே அவை ஒன்றுக்கொன்று sync-இல் இல்லாமல் போகுமா என்று கவலைப்பட வேண்டியதில்லை.

## redundant state-ஐத் தவிருங்கள் {/*avoid-redundant-state*/}

rendering நடக்கும் போது component-ன் props அல்லது ஏற்கனவே உள்ள state variable-களிலிருந்து சில தகவலை கணக்கிட முடிந்தால், அந்த தகவலை அந்த component-ன் state-இல் **வைக்கக்கூடாது**.

உதாரணமாக, இந்த form-ஐ எடுத்துக் கொள்ளுங்கள். இது வேலை செய்கிறது, ஆனால் இதில் redundant state ஏதாவது இருக்கிறதா கண்டுபிடிக்க முடியுமா?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>உங்களை check in செய்வோம்</h2>
      <label>
        முதல் பெயர்:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        உங்கள் ticket இப்பெயரில் வழங்கப்படும்: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

இந்த form-இல் மூன்று state variable-கள் உள்ளன: `firstName`, `lastName`, மற்றும் `fullName`. ஆனால் `fullName` redundant. **render நடக்கும் போது `firstName` மற்றும் `lastName`-இலிருந்து `fullName`-ஐ எப்போதும் கணக்கிட முடியும், எனவே அதை state-இலிருந்து நீக்குங்கள்.**

இதைக் இப்படிச் செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>உங்களை check in செய்வோம்</h2>
      <label>
        முதல் பெயர்:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        உங்கள் ticket இப்பெயரில் வழங்கப்படும்: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

இங்கே, `fullName` state variable *அல்ல*. அதற்கு பதிலாக, அது render நடக்கும் போது கணக்கிடப்படுகிறது:

```js
const fullName = firstName + ' ' + lastName;
```

இதன் விளைவாக, change handler-கள் அதை update செய்ய சிறப்பாக எதையும் செய்ய வேண்டியதில்லை. நீங்கள் `setFirstName` அல்லது `setLastName`-ஐ call செய்தால், re-render trigger ஆகும்; பின்னர் புதிய data-விலிருந்து அடுத்த `fullName` கணக்கிடப்படும்.

<DeepDive>

#### props-ஐ state-இல் mirror செய்ய வேண்டாம் {/*don-t-mirror-props-in-state*/}

redundant state-ன் பொதுவான உதாரணம் இதுபோன்ற code:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

இங்கே, `color` state variable `messageColor` prop-ன் மதிப்பால் initialize செய்யப்படுகிறது. பிரச்சினை என்னவென்றால், **parent component பின்னர் வேறு `messageColor` மதிப்பை pass செய்தால் (உதாரணமாக, `'blue'`-க்கு பதிலாக `'red'`), `color` *state variable* update ஆகாது!** state முதல் render-இல் மட்டுமே initialize செய்யப்படுகிறது.

அதனால் prop ஒன்றை state variable-இல் "mirror" செய்வது குழப்பத்திற்கு வழிவகுக்கலாம். அதற்கு பதிலாக, உங்கள் code-இல் `messageColor` prop-ஐ நேரடியாகப் பயன்படுத்துங்கள். அதற்கு குறுகிய பெயர் தர விரும்பினால், constant ஒன்றைப் பயன்படுத்துங்கள்:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

இவ்வாறு செய்தால், parent component-இலிருந்து pass செய்யப்பட்ட prop-உடன் அது sync இழக்காது.

குறிப்பிட்ட prop-க்கான எல்லா update-களையும் *நீங்கள் புறக்கணிக்க விரும்பும்* போது மட்டுமே props-ஐ state-க்கு "mirror" செய்வது பொருள் கொள்ளும். அதன் புதிய மதிப்புகள் புறக்கணிக்கப்படுகின்றன என்பதைத் தெளிவுபடுத்த, மரபுப்படி prop பெயரை `initial` அல்லது `default`-ஆல் தொடங்குங்கள்:

```js
function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## state-இல் duplication-ஐத் தவிருங்கள் {/*avoid-duplication-in-state*/}

இந்த menu list component பலவற்றிலிருந்து ஒரு travel snack-ஐத் தேர்ந்தெடுக்க அனுமதிக்கிறது:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'பிரெட்ஸல்கள்', id: 0 },
  { title: 'மொறு மொறு கடல்பாசி', id: 1 },
  { title: 'கிரானோலா பார்', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>உங்கள் travel snack என்ன?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>தேர்வு செய்</button>
          </li>
        ))}
      </ul>
      <p>நீங்கள் {selectedItem.title}-ஐ தேர்ந்தெடுத்தீர்கள்.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

தற்போது, தேர்ந்தெடுக்கப்பட்ட item-ஐ `selectedItem` state variable-இல் object ஆக சேமிக்கிறது. ஆனால் இது சிறந்ததல்ல: **`selectedItem`-ன் உள்ளடக்கம் `items` பட்டியலுக்குள் உள்ள item-களில் ஒன்றே அதே object ஆகும்.** இதன் பொருள், item பற்றிய தகவல் இரண்டு இடங்களில் duplicate செய்யப்பட்டுள்ளது.

இது ஏன் பிரச்சினை? ஒவ்வொரு item-ஐயும் edit செய்யக்கூடியதாக மாற்றுவோம்:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'பிரெட்ஸல்கள்', id: 0 },
  { title: 'மொறு மொறு கடல்பாசி', id: 1 },
  { title: 'கிரானோலா பார்', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>உங்கள் travel snack என்ன?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>தேர்வு செய்</button>
          </li>
        ))}
      </ul>
      <p>நீங்கள் {selectedItem.title}-ஐ தேர்ந்தெடுத்தீர்கள்.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

முதலில் ஒரு item-இல் "தேர்வு செய்" click செய்து *பிறகு* அதை edit செய்தால், **input update ஆகிறது ஆனால் கீழே உள்ள label அந்த edit-களை பிரதிபலிக்கவில்லை** என்பதை கவனியுங்கள். இதற்குக் காரணம் state duplicate ஆகியிருக்கிறது, மேலும் `selectedItem`-ஐ update செய்ய மறந்துவிட்டீர்கள்.

`selectedItem`-யையும் update செய்யலாம், ஆனால் நேரடியான சரிசெய்தல் duplication-ஐ நீக்குவது. இந்த உதாரணத்தில், `selectedItem` object-க்கு பதிலாக (`items`-க்குள் உள்ள object-களுடன் duplication உருவாக்குவது), `selectedId`-ஐ state-இல் வைத்திருந்து, *பிறகு* அந்த ID உடைய item-ஐ `items` array-இல் தேடி `selectedItem`-ஐ பெறுகிறீர்கள்:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'பிரெட்ஸல்கள்', id: 0 },
  { title: 'மொறு மொறு கடல்பாசி', id: 1 },
  { title: 'கிரானோலா பார்', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>உங்கள் travel snack என்ன?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>தேர்வு செய்</button>
          </li>
        ))}
      </ul>
      <p>நீங்கள் {selectedItem.title}-ஐ தேர்ந்தெடுத்தீர்கள்.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

state முன்பு இவ்வாறு duplicate ஆக இருந்தது:

* `items = [{ id: 0, title: 'பிரெட்ஸல்கள்'}, ...]`
* `selectedItem = {id: 0, title: 'பிரெட்ஸல்கள்'}`

ஆனால் மாற்றத்திற்குப் பிறகு இது இவ்வாறு உள்ளது:

* `items = [{ id: 0, title: 'பிரெட்ஸல்கள்'}, ...]`
* `selectedId = 0`

duplication நீக்கப்பட்டுள்ளது, மேலும் அவசியமான state மட்டும் வைத்திருக்கப்படுகிறது!

இப்போது *தேர்ந்தெடுக்கப்பட்ட* item-ஐ edit செய்தால், கீழே உள்ள message உடனடியாக update ஆகும். ஏனெனில் `setItems` re-render-ஐ trigger செய்கிறது, மேலும் `items.find(...)` update செய்யப்பட்ட title உடைய item-ஐ கண்டுபிடிக்கும். *தேர்ந்தெடுக்கப்பட்ட item*-ஐ state-இல் வைத்திருக்க வேண்டியதில்லை, ஏனெனில் *தேர்ந்தெடுக்கப்பட்ட ID* மட்டுமே அவசியமானது. மீதமுள்ளவை render நடக்கும் போது கணக்கிடலாம்.

## ஆழமாக nested state-ஐத் தவிருங்கள் {/*avoid-deeply-nested-state*/}

கோள்கள், கண்டங்கள், நாடுகள் அடங்கிய travel plan ஒன்றை நினைத்துப் பாருங்கள். இந்த உதாரணம் போல nested object-களையும் array-களையும் பயன்படுத்தி அதன் state-ஐ அமைக்க உங்களுக்கு தோன்றலாம்:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>பார்வையிட வேண்டிய இடங்கள்</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenya',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Morocco',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigeria',
        childPlaces: []
      }, {
        id: 9,
        title: 'South Africa',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Americas',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brazil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canada',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'Mexico',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinidad and Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Asia',
      childPlaces: [{
        id: 20,
        title: 'China',
        childPlaces: []
      }, {
        id: 21,
        title: 'India',
        childPlaces: []
      }, {
        id: 22,
        title: 'Singapore',
        childPlaces: []
      }, {
        id: 23,
        title: 'South Korea',
        childPlaces: []
      }, {
        id: 24,
        title: 'Thailand',
        childPlaces: []
      }, {
        id: 25,
        title: 'Vietnam',
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Europe',
      childPlaces: [{
        id: 27,
        title: 'Croatia',
        childPlaces: [],
      }, {
        id: 28,
        title: 'France',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Germany',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Italy',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Spain',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Turkey',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Oceania',
      childPlaces: [{
        id: 35,
        title: 'Australia',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Bora Bora (French Polynesia)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Easter Island (Chile)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Fiji',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Hawaii (the USA)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'New Zealand',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Moon',
    childPlaces: [{
      id: 43,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 44,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 45,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Mars',
    childPlaces: [{
      id: 47,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 48,
      title: 'Green Hill',
      childPlaces: []
    }]
  }]
};
```

</Sandpack>

இப்போது நீங்கள் ஏற்கனவே பார்வையிட்ட இடத்தை delete செய்ய button ஒன்றைச் சேர்க்க விரும்புகிறீர்கள் என்று வைத்துக்கொள்வோம். அதை எப்படி செய்வீர்கள்? [nested state-ஐ update செய்வது](/learn/updating-objects-in-state#updating-a-nested-object), மாறிய பகுதியிலிருந்து மேலே உள்ள எல்லா object-களையும் copy செய்வதை உள்ளடக்கும். ஆழமாக nested ஆன இடத்தை delete செய்வது, அதன் முழு parent place chain-ஐ copy செய்வதை உள்ளடக்கும். இத்தகைய code மிகவும் verbose ஆக இருக்கலாம்.

**state நேரடியாக update செய்ய முடியாத அளவுக்கு nested ஆக இருந்தால், அதை "flat" ஆக்குவதை கருதுங்கள்.** இந்த data-வை restructure செய்யும் ஒரு வழி இதோ. ஒவ்வொரு `place`-க்கும் *அதன் child place-கள்* கொண்ட array இருக்கும் tree போன்ற அமைப்பிற்கு பதிலாக, ஒவ்வொரு place-மும் *அதன் child place ID-கள்* கொண்ட array-ஐ வைத்திருக்கலாம். பிறகு ஒவ்வொரு place ID-யிலிருந்தும் தொடர்புடைய place-க்கு mapping ஒன்றைச் சேமிக்கலாம்.

இந்த data restructuring database table ஒன்றைப் பார்க்கும் உணர்வை தரலாம்:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>பார்வையிட வேண்டிய இடங்கள்</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**இப்போது state "flat" ஆக (அதாவது "normalized" ஆகவும் அழைக்கப்படும்) இருப்பதால், nested item-களை update செய்வது மேம்படுகிறது.**

இப்போது ஒரு இடத்தை remove செய்ய, state-ன் இரண்டு level-களை மட்டுமே update செய்ய வேண்டும்:

- அதன் *parent* place-ன் updated version, நீக்கப்பட்ட ID-யை அதன் `childIds` array-இலிருந்து விலக்க வேண்டும்.
- root "table" object-ன் updated version, parent place-ன் updated version-ஐச் சேர்க்க வேண்டும்.

இதை எப்படி செய்யலாம் என்பதற்கான உதாரணம் இதோ:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Create a new version of the parent place
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Update the root state object...
    setPlan({
      ...plan,
      // ...so that it has the updated parent.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>பார்வையிட வேண்டிய இடங்கள்</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        முடி
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25],
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

நீங்கள் விரும்பும் அளவுக்கு state-ஐ nest செய்யலாம், ஆனால் அதை "flat" ஆக்குவது பல பிரச்சினைகளைத் தீர்க்கும். இது state-ஐ update செய்வதை உதவுகிறது, மேலும் nested object-ன் வேறு பகுதிகளில் duplication இல்லாமல் இருக்க உதவுகிறது.

<DeepDive>

#### memory usage-ஐ மேம்படுத்துதல் {/*improving-memory-usage*/}

சிறந்த நிலையில், memory usage-ஐ மேம்படுத்த "table" object-இலிருந்து deleted item-களையும் (அவற்றின் children-களையும்!) நீக்குவீர்கள். இந்த version அதையே செய்கிறது. update logic-ஐ சுருக்கமாக்க இது [Immer-யையும் பயன்படுத்துகிறது](/learn/updating-objects-in-state#write-concise-update-logic-with-immer).

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Remove from the parent place's child IDs.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Forget this place and all its subtree.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>பார்வையிட வேண்டிய இடங்கள்</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        முடி
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  },
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  },
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25,],
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'India',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Singapore',
    childIds: []
  },
  23: {
    id: 23,
    title: 'South Korea',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Thailand',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Vietnam',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Europe',
    childIds: [27, 28, 29, 30, 31, 32, 33],
  },
  27: {
    id: 27,
    title: 'Croatia',
    childIds: []
  },
  28: {
    id: 28,
    title: 'France',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Germany',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Italy',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Portugal',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Spain',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Turkey',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Oceania',
    childIds: [35, 36, 37, 38, 39, 40, 41],
  },
  35: {
    id: 35,
    title: 'Australia',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Fiji',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'New Zealand',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Vanuatu',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Moon',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Rheita',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Piccolomini',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Tycho',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Mars',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Corn Town',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</DeepDive>

சில நேரங்களில், nested state-ன் சில பகுதியை child component-களுக்குள் நகர்த்துவதன் மூலமும் state nesting-ஐக் குறைக்கலாம். ஒரு item hover செய்யப்பட்டுள்ளதா போன்ற, சேமிக்க வேண்டிய அவசியமில்லாத ephemeral UI state-க்கு இது நன்றாக வேலை செய்கிறது.

<Recap>

* இரண்டு state variable-கள் எப்போதும் ஒன்றாக update ஆகினால், அவற்றை ஒன்றாக merge செய்வதை கருதுங்கள்.
* "சாத்தியமில்லாத" state-களை உருவாக்காமல் இருக்க உங்கள் state variable-களை கவனமாகத் தேர்ந்தெடுக்கவும்.
* state-ஐ update செய்யும்போது பிழை செய்வதற்கான வாய்ப்பைக் குறைக்கும் வகையில் state-ஐ அமைக்கவும்.
* redundant மற்றும் duplicate state-ஐத் தவிருங்கள்; அப்படிச் செய்தால் அதை sync-இல் வைத்திருக்க வேண்டியதில்லை.
* update-களைத் தடுப்பது உங்கள் குறிப்பிட்ட நோக்கமல்லாவிட்டால் props-ஐ state-*க்குள்* வைக்க வேண்டாம்.
* selection போன்ற UI pattern-களுக்கு, object-ஐயே state-இல் வைப்பதற்குப் பதிலாக ID அல்லது index-ஐ வைத்திருங்கள்.
* ஆழமாக nested state-ஐ update செய்வது சிக்கலானதாக இருந்தால், அதை flatten செய்ய முயலுங்கள்.

</Recap>

<Challenges>

#### update ஆகாத component-ஐச் சரிசெய்யுங்கள் {/*fix-a-component-thats-not-updating*/}

இந்த `Clock` component இரண்டு props பெறுகிறது: `color` மற்றும் `time`. select box-இல் வேறு color-ஐத் தேர்ந்தெடுக்கும்போது, `Clock` component அதன் parent component-இலிருந்து வேறு `color` prop-ஐப் பெறுகிறது. ஆனால் ஏதோ காரணத்தால் காட்டப்படும் color update ஆகவில்லை. ஏன்? பிரச்சினையைச் சரிசெய்யுங்கள்.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        color-ஐத் தேர்ந்தெடுக்கவும்:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

பிரச்சினை என்னவென்றால், இந்த component-இல் `color` prop-ன் initial value-ஆல் initialize செய்யப்பட்ட `color` state உள்ளது. ஆனால் `color` prop மாறும்போது, இது state variable-ஐ பாதிக்காது! அதனால் அவை sync இழக்கின்றன. இந்த பிரச்சினையைச் சரிசெய்ய, state variable-ஐ முற்றிலும் நீக்கி, `color` prop-ஐ நேரடியாகப் பயன்படுத்துங்கள்.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        color-ஐத் தேர்ந்தெடுக்கவும்:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

அல்லது destructuring syntax-ஐப் பயன்படுத்தி:

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        color-ஐத் தேர்ந்தெடுக்கவும்:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### உடைந்த packing list-ஐச் சரிசெய்யுங்கள் {/*fix-a-broken-packing-list*/}

இந்த packing list-இல் எத்தனை item-கள் packed ஆக உள்ளன, மொத்தம் எத்தனை item-கள் உள்ளன என்பதைக் காட்டும் footer உள்ளது. தொடக்கத்தில் இது வேலை செய்வது போல தெரிகிறது, ஆனால் இதில் bug உள்ளது. உதாரணமாக, ஒரு item-ஐ packed என்று குறித்துப் பிறகு அதை delete செய்தால், counter சரியாக update ஆகாது. counter எப்போதும் சரியாக இருக்குமாறு சரிசெய்யுங்கள்.

<Hint>

இந்த உதாரணத்தில் ஏதேனும் state redundant ஆக உள்ளதா?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'சூடான காலுறைகள்', packed: true },
  { id: 1, title: 'பயண குறிப்பேடு', packed: false },
  { id: 2, title: 'நீர்வண்ணங்கள்', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{total}-இல் {packed} பேக் செய்யப்பட்டது!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="item-ஐச் சேர்"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            நீக்கு
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

ஒவ்வொரு event handler-யையும் கவனமாக மாற்றி `total` மற்றும் `packed` counter-களை சரியாக update செய்யலாம், ஆனால் அடிப்படை பிரச்சினை இந்த state variable-கள் இருப்பதே. அவை redundant, ஏனெனில் item-களின் எண்ணிக்கையை (packed அல்லது total) `items` array-இலிருந்தே எப்போதும் கணக்கிடலாம். bug-ஐச் சரிசெய்ய redundant state-ஐ நீக்குங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'சூடான காலுறைகள்', packed: true },
  { id: 1, title: 'பயண குறிப்பேடு', packed: false },
  { id: 2, title: 'நீர்வண்ணங்கள்', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{total}-இல் {packed} பேக் செய்யப்பட்டது!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="item-ஐச் சேர்"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            நீக்கு
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

இந்த மாற்றத்திற்குப் பிறகு event handler-கள் `setItems`-ஐ call செய்வதில் மட்டுமே கவனம் செலுத்துகின்றன என்பதை கவனியுங்கள். item count-கள் இப்போது அடுத்த render-இல் `items`-இலிருந்து கணக்கிடப்படுகின்றன, எனவே அவை எப்போதும் up-to-date ஆக இருக்கும்.

</Solution>

#### மறைந்து போகும் selection-ஐச் சரிசெய்யுங்கள் {/*fix-the-disappearing-selection*/}

state-இல் `letters` பட்டியல் உள்ளது. குறிப்பிட்ட letter-ஐ hover அல்லது focus செய்தால், அது highlight செய்யப்படும். தற்போது highlighted ஆன letter `highlightedLetter` state variable-இல் சேமிக்கப்படுகிறது. தனிப்பட்ட letter-களை "நட்சத்திரமிடு" மற்றும் "நட்சத்திரத்தை நீக்கு" செய்யலாம்; இது state-இல் உள்ள `letters` array-ஐ update செய்கிறது.

இந்த code வேலை செய்கிறது, ஆனால் சிறிய UI glitch உள்ளது. நீங்கள் "நட்சத்திரமிடு" அல்லது "நட்சத்திரத்தை நீக்கு" அழுத்தும்போது, highlighting ஒரு கணம் மறைகிறது. ஆனால் pointer-ஐ நகர்த்தியவுடன் அல்லது keyboard மூலம் வேறு letter-க்கு மாறியவுடன் அது மீண்டும் தோன்றும். இது ஏன் நடக்கிறது? button click-க்கு பிறகு highlighting மறையாதபடி சரிசெய்யுங்கள்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>அஞ்சல் பெட்டி</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'நட்சத்திரத்தை நீக்கு' : 'நட்சத்திரமிடு'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'சாகசத்துக்கு தயாரா?',
  isStarred: true,
}, {
  id: 1,
  subject: 'check in செய்ய நேரம்!',
  isStarred: false,
}, {
  id: 2,
  subject: 'விழா இன்னும் ஏழு நாட்களில் தொடங்குகிறது!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

பிரச்சினை என்னவென்றால், நீங்கள் letter object-ஐ `highlightedLetter`-இல் வைத்திருக்கிறீர்கள். ஆனால் அதே தகவலை `letters` array-இலும் வைத்திருக்கிறீர்கள். எனவே உங்கள் state-இல் duplication உள்ளது! button click-க்கு பிறகு `letters` array-ஐ update செய்யும்போது, `highlightedLetter`-இலிருந்து வேறான புதிய letter object ஒன்றை உருவாக்குகிறீர்கள். அதனால் `highlightedLetter === letter` check `false` ஆகிறது, highlight மறைகிறது. pointer நகரும் போது அடுத்த முறை `setHighlightedLetter`-ஐ call செய்ததும் அது மீண்டும் தோன்றுகிறது.

பிரச்சினையைச் சரிசெய்ய, state-இலிருந்து duplication-ஐ நீக்குங்கள். *letter-ஐயே* இரண்டு இடங்களில் சேமிப்பதற்கு பதிலாக, `highlightedId`-ஐச் சேமியுங்கள். பிறகு ஒவ்வொரு letter-க்கும் `letter.id === highlightedId` மூலம் `isHighlighted`-ஐச் சரிபார்க்கலாம்; last render-க்கு பிறகு `letter` object மாறியிருந்தாலும் இது வேலை செய்யும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>அஞ்சல் பெட்டி</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'நட்சத்திரத்தை நீக்கு' : 'நட்சத்திரமிடு'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'சாகசத்துக்கு தயாரா?',
  isStarred: true,
}, {
  id: 1,
  subject: 'check in செய்ய நேரம்!',
  isStarred: false,
}, {
  id: 2,
  subject: 'விழா இன்னும் ஏழு நாட்களில் தொடங்குகிறது!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### பல selection-களை implement செய்யுங்கள் {/*implement-multiple-selection*/}

இந்த உதாரணத்தில், ஒவ்வொரு `Letter`-க்கும் `isSelected` prop மற்றும் அதை selected ஆக குறிக்கும் `onToggle` handler உள்ளது. இது வேலை செய்கிறது, ஆனால் state `selectedId` (அல்லது `null` அல்லது ID) ஆக சேமிக்கப்படுகிறது; எனவே எந்த நேரத்திலும் ஒரே ஒரு letter மட்டுமே selected ஆக முடியும்.

பல selection-களை support செய்ய state structure-ஐ மாற்றுங்கள். (அதை எப்படி structure செய்வீர்கள்? code எழுதுவதற்கு முன் இதைப் பற்றி யோசியுங்கள்.) ஒவ்வொரு checkbox-மும் மற்றவற்றிலிருந்து independent ஆக இருக்க வேண்டும். selected letter-ஐ click செய்தால் அது uncheck ஆக வேண்டும். இறுதியாக, footer selected item-களின் சரியான எண்ணிக்கையை காட்ட வேண்டும்.

<Hint>

ஒரே selected ID-க்கு பதிலாக, selected ID-களின் array அல்லது [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-ஐ state-இல் வைத்திருக்கலாம்.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: allow multiple selection
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: allow multiple selection
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>அஞ்சல் பெட்டி</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: allow multiple selection
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            நீங்கள் {selectedCount} letter-களைத் தேர்ந்தெடுத்துள்ளீர்கள்
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'சாகசத்துக்கு தயாரா?',
  isStarred: true,
}, {
  id: 1,
  subject: 'check in செய்ய நேரம்!',
  isStarred: false,
}, {
  id: 2,
  subject: 'விழா இன்னும் ஏழு நாட்களில் தொடங்குகிறது!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

ஒரே `selectedId`-க்கு பதிலாக, `selectedIds` *array*-ஐ state-இல் வைத்திருங்கள். உதாரணமாக, முதல் மற்றும் கடைசி letter-ஐத் தேர்ந்தெடுத்தால், அதில் `[0, 2]` இருக்கும். எதுவும் selected இல்லாதபோது, அது காலியான `[]` array ஆக இருக்கும்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Was it previously selected?
    if (selectedIds.includes(toggledId)) {
      // Then remove this ID from the array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Otherwise, add this ID to the array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>அஞ்சல் பெட்டி</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            நீங்கள் {selectedCount} letter-களைத் தேர்ந்தெடுத்துள்ளீர்கள்
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'சாகசத்துக்கு தயாரா?',
  isStarred: true,
}, {
  id: 1,
  subject: 'check in செய்ய நேரம்!',
  isStarred: false,
}, {
  id: 2,
  subject: 'விழா இன்னும் ஏழு நாட்களில் தொடங்குகிறது!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

array-ஐப் பயன்படுத்துவதில் சிறிய குறை என்னவென்றால், ஒவ்வொரு item-க்கும் அது selected ஆக உள்ளதா என்பதைச் சரிபார்க்க `selectedIds.includes(letter.id)`-ஐ call செய்கிறீர்கள். array மிகவும் பெரியதாக இருந்தால், இது performance பிரச்சினையாக மாறலாம், ஏனெனில் [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) மூலம் array search linear time எடுக்கும், மேலும் இந்த search-ஐ ஒவ்வொரு தனிப்பட்ட item-க்கும் செய்கிறீர்கள்.

இதைக் சரிசெய்ய, அதற்கு பதிலாக state-இல் [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-ஐ வைத்திருக்கலாம்; அது வேகமான [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) operation-ஐ வழங்குகிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>அஞ்சல் பெட்டி</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            நீங்கள் {selectedCount} letter-களைத் தேர்ந்தெடுத்துள்ளீர்கள்
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'சாகசத்துக்கு தயாரா?',
  isStarred: true,
}, {
  id: 1,
  subject: 'check in செய்ய நேரம்!',
  isStarred: false,
}, {
  id: 2,
  subject: 'விழா இன்னும் ஏழு நாட்களில் தொடங்குகிறது!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

இப்போது ஒவ்வொரு item-மும் `selectedIds.has(letter.id)` check செய்கிறது; இது மிகவும் வேகமானது.

நீங்கள் [state-இல் உள்ள object-களை mutate செய்யக்கூடாது](/learn/updating-objects-in-state) என்பதை நினைவில் கொள்ளுங்கள்; அதில் Set-களும் அடங்கும். அதனால் `handleToggle` function முதலில் Set-ன் *copy*-ஐ உருவாக்கி, பிறகு அந்த copy-ஐ update செய்கிறது.

</Solution>

</Challenges>
