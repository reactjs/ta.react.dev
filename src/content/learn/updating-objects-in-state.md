---
title: State-இல் Objects-ஐ update செய்தல்
---

<Intro>

State எந்த வகையான JavaScript value-யையும் வைத்திருக்க முடியும், objects உட்பட. ஆனால் React state-இல் நீங்கள் வைத்திருக்கும் objects-ஐ நேரடியாக change செய்யக்கூடாது. அதற்கு பதிலாக, object-ஐ update செய்ய வேண்டும் என்றால், புதிய ஒன்றை create செய்ய வேண்டும் (அல்லது existing ஒன்றின் copy உருவாக்க வேண்டும்), பிறகு அந்த copy-ஐ use செய்ய state-ஐ set செய்ய வேண்டும்.

</Intro>

<YouWillLearn>

- React state-இல் object-ஐ சரியாக update செய்வது எப்படி
- Nested object-ஐ mutate செய்யாமல் update செய்வது எப்படி
- Immutability என்றால் என்ன, அதை எப்படி break செய்யாமல் இருப்பது
- Immer மூலம் object copying-ஐ குறைவாக repetitive ஆக்குவது எப்படி

</YouWillLearn>

## Mutation என்றால் என்ன? {/*whats-a-mutation*/}

State-இல் எந்த வகையான JavaScript value-யையும் store செய்யலாம்.

```js
const [x, setX] = useState(0);
```

இதுவரை நீங்கள் numbers, strings, மற்றும் booleans உடன் வேலை செய்துள்ளீர்கள். இந்த வகை JavaScript values "immutable", அதாவது மாற்ற முடியாதவை அல்லது "read-only". ஒரு value-ஐ _replace_ செய்ய re-render trigger செய்யலாம்:

```js
setX(5);
```

`x` state `0`-இலிருந்து `5` ஆக மாறியது, ஆனால் _number `0` தானாக_ மாறவில்லை. JavaScript-இல் numbers, strings, booleans போன்ற built-in primitive values-க்கு எந்த மாற்றமும் செய்ய முடியாது.

இப்போது state-இல் உள்ள object-ஐ கருதுங்கள்:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Technically, _object தானாக_ கொண்டுள்ள contents-ஐ change செய்ய முடியும். **இது mutation என்று அழைக்கப்படுகிறது:**

```js
position.x = 5;
```

ஆனால் React state-இல் உள்ள objects technically mutable என்றாலும், numbers, booleans, strings போல அவை immutable ஆக இருப்பது **போல்** அவற்றை நடத்த வேண்டும். அவற்றை mutate செய்வதற்கு பதிலாக எப்போதும் replace செய்ய வேண்டும்.

## State-ஐ read-only ஆக நடத்துங்கள் {/*treat-state-as-read-only*/}

வேறு வார்த்தைகளில், state-க்குள் வைக்கும் எந்த JavaScript object-ஐயும் **read-only ஆக நடத்த வேண்டும்.**

இந்த example current pointer position-ஐ represent செய்ய state-இல் object வைத்திருக்கிறது. Preview area மீது touch செய்தாலோ cursor நகர்த்தினாலோ red dot நகர வேண்டும். ஆனால் dot initial position-இலேயே இருக்கும்:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Problem இந்த code பகுதியில்தான் உள்ளது.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

இந்த code [previous render](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)-இலிருந்து `position`-க்கு assign செய்யப்பட்ட object-ஐ modify செய்கிறது. ஆனால் state setting function use செய்யாமல் இருந்தால், அந்த object மாறியுள்ளது என்று React-க்கு தெரியாது. எனவே React response ஆக எதையும் செய்யாது. இது நீங்கள் உணவைச் சாப்பிட்ட பிறகு order-ஐ மாற்ற முயல்வது போல. State-ஐ mutate செய்வது சில cases-இல் வேலை செய்யலாம், ஆனால் அதை நாங்கள் பரிந்துரைக்கவில்லை. Render-இல் உங்களுக்கு access உள்ள state value-ஐ read-only ஆக நடத்த வேண்டும்.

இந்த case-இல் உண்மையில் [re-render trigger செய்ய](/learn/state-as-a-snapshot#setting-state-triggers-renders), **ஒரு *new* object create செய்து அதை state setting function-க்கு pass செய்யுங்கள்:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition` மூலம் நீங்கள் React-க்கு சொல்வது:

* `position`-ஐ இந்த புதிய object-ஆல் replace செய்
* மேலும் இந்த component-ஐ மீண்டும் render செய்

Preview area-வை touch அல்லது hover செய்யும் போது red dot இப்போது உங்கள் pointer-ஐப் பின்தொடருகிறது என்பதை கவனிக்கவும்:

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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Local mutation சரியே {/*local-mutation-is-fine*/}

இப்படியான code problem, ஏனெனில் இது state-இல் உள்ள *existing* object-ஐ modify செய்கிறது:

```js
position.x = e.clientX;
position.y = e.clientY;
```

ஆனால் இப்படியான code **முழுமையாக சரி**, ஏனெனில் நீங்கள் *இப்போதுதான் create செய்த* fresh object-ஐ mutate செய்கிறீர்கள்:

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

உண்மையில், இது இதை எழுதுவதற்கு முற்றிலும் equivalent:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutation என்பது state-இல் ஏற்கனவே உள்ள *existing* objects-ஐ change செய்யும்போது மட்டுமே problem. நீங்கள் இப்போதுதான் create செய்த object-ஐ mutate செய்வது சரி, ஏனெனில் *வேறு எந்த code-உம் இன்னும் அதை reference செய்யவில்லை.* அதை change செய்வது அதைப் சார்ந்துள்ள எதையும் தவறுதலாக பாதிக்காது. இது "local mutation" என்று அழைக்கப்படுகிறது. [Rendering போது](/learn/keeping-components-pure#local-mutation-your-components-little-secret) கூட local mutation செய்யலாம். மிகவும் வசதியானது, முற்றிலும் சரி!

</DeepDive>

## Spread syntax மூலம் objects-ஐ copy செய்தல் {/*copying-objects-with-the-spread-syntax*/}

முந்தைய example-இல், `position` object எப்போதும் current cursor position-இலிருந்து fresh ஆக create செய்யப்படுகிறது. ஆனால் பல நேரங்களில், நீங்கள் create செய்யும் புதிய object-ன் பகுதியாக *existing* data-வையும் include செய்ய விரும்புவீர்கள். உதாரணமாக, form-இல் *ஒரே ஒரு* field-ஐ update செய்ய, மற்ற எல்லா fields-க்கும் previous values-ஐ வைத்திருக்க விரும்பலாம்.

இந்த input fields வேலை செய்யவில்லை, ஏனெனில் `onChange` handlers state-ஐ mutate செய்கின்றன:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11, 15, 19]}}
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        முதல் பெயர்:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        மின்னஞ்சல்:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

உதாரணமாக, இந்த line past render-இலிருந்து state-ஐ mutate செய்கிறது:

```js
person.firstName = e.target.value;
```

நீங்கள் எதிர்பார்க்கும் behavior பெற reliable வழி, புதிய object create செய்து அதை `setPerson`-க்கு pass செய்வது. ஆனால் இங்கே, field-களில் ஒன்று மட்டுமே மாறியதால், **existing data-வையும் அதற்குள் copy செய்ய** விரும்புகிறீர்கள்:

```js
setPerson({
  firstName: e.target.value, // Input-இலிருந்து புதிய first name
  lastName: person.lastName,
  email: person.email
});
```

ஒவ்வொரு property-யையும் தனித்தனியாக copy செய்ய வேண்டாம் என்பதற்காக `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) syntax-ஐ use செய்யலாம்.

```js
setPerson({
  ...person, // பழைய fields-ஐ copy செய்க
  firstName: e.target.value // ஆனால் இதை override செய்க
});
```

இப்போது form வேலை செய்கிறது!

ஒவ்வொரு input field-க்கும் separate state variable declare செய்யவில்லை என்பதை கவனிக்கவும். பெரிய forms-க்கு, எல்லா data-வையும் object-இல் grouped ஆக வைத்திருப்பது மிகவும் வசதியானது--அதை சரியாக update செய்யும் வரை!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        முதல் பெயர்:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        மின்னஞ்சல்:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`...` spread syntax "shallow" என்பதை கவனிக்கவும்--அது ஒரு level deep மட்டுமே copy செய்கிறது. இதனால் அது fast, ஆனால் nested property-ஐ update செய்ய விரும்பினால் அதை ஒன்றுக்கு மேற்பட்ட முறை use செய்ய வேண்டும் என்பதையும் குறிக்கிறது.

<DeepDive>

#### பல fields-க்கு ஒரு single event handler use செய்தல் {/*using-a-single-event-handler-for-multiple-fields*/}

Dynamic name உடைய property specify செய்ய உங்கள் object definition-க்குள் `[` மற்றும் `]` braces-ஐயும் use செய்யலாம். மூன்று different handlers-க்கு பதிலாக single event handler உடன் அதே example இதோ:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        முதல் பெயர்:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        கடைசி பெயர்:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        மின்னஞ்சல்:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

இங்கே, `e.target.name` என்பது `<input>` DOM element-க்கு கொடுக்கப்பட்ட `name` property-ஐ குறிக்கிறது.

</DeepDive>

## Nested object-ஐ update செய்தல் {/*updating-a-nested-object*/}

இதுபோன்ற nested object structure-ஐ கருதுங்கள்:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
});
```

`person.artwork.city`-ஐ update செய்ய விரும்பினால், mutation மூலம் அதை எப்படி செய்வது என்பது தெளிவாக இருக்கிறது:

```js
person.artwork.city = 'New Delhi';
```

ஆனால் React-இல், state-ஐ immutable ஆக நடத்துகிறீர்கள்! `city`-ஐ change செய்ய, முதலில் புதிய `artwork` object-ஐ produce செய்ய வேண்டும் (previous one-இலிருந்து data கொண்டு pre-populated), பிறகு புதிய `artwork`-ஐ point செய்யும் புதிய `person` object-ஐ produce செய்ய வேண்டும்:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

அல்லது, single function call ஆக எழுதினால்:

```js
setPerson({
  ...person, // மற்ற fields-ஐ copy செய்க
  artwork: { // ஆனால் artwork-ஐ replace செய்க
    ...person.artwork, // அதே ஒன்றுடன்
    city: 'New Delhi' // ஆனால் New Delhi-இல்!
  }
});
```

இது கொஞ்சம் நீளமாகிறது, ஆனால் பல cases-க்கு நன்றாக வேலை செய்கிறது:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        பெயர்:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        தலைப்பு:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        நகரம்:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        படம்:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' உருவாக்கியவர் '}
        {person.name}
        <br />
        ({person.artwork.city}-இல் உள்ளது)
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Objects உண்மையில் nested அல்ல {/*objects-are-not-really-nested*/}

இப்படிப்பட்ட object code-இல் "nested" போல தோன்றுகிறது:

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  }
};
```

ஆனால் objects எப்படி behave செய்கின்றன என்பதைப் பற்றி நினைக்க "nesting" என்பது துல்லியமான வழி அல்ல. Code execute ஆகும் போது, "nested" object என்ற ஒன்று இல்லை. உண்மையில் நீங்கள் இரண்டு different objects-ஐப் பார்க்கிறீர்கள்:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` object, `obj2`-க்கு "inside" இல்லை. உதாரணமாக, `obj3` கூட `obj1`-ஐ "point" செய்யலாம்:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

நீங்கள் `obj3.artwork.city`-ஐ mutate செய்தால், அது `obj2.artwork.city` மற்றும் `obj1.city` இரண்டையும் பாதிக்கும். ஏனெனில் `obj3.artwork`, `obj2.artwork`, மற்றும் `obj1` ஒரே object. Objects-ஐ "nested" என்று நினைக்கும்போது இதை பார்க்க கடினம். அதற்கு பதிலாக, அவை properties மூலம் ஒன்றை ஒன்று "point" செய்யும் separate objects.

</DeepDive>

### Immer மூலம் concise update logic எழுதுதல் {/*write-concise-update-logic-with-immer*/}

உங்கள் state ஆழமாக nested ஆக இருந்தால், அதை [flatten செய்வதை](/learn/choosing-the-state-structure#avoid-deeply-nested-state) பரிசீலிக்கலாம். ஆனால் state structure-ஐ change செய்ய விரும்பவில்லை என்றால், nested spreads-க்கு shortcut விரும்பலாம். [Immer](https://github.com/immerjs/use-immer) என்பது convenient ஆனால் mutating syntax-ஐப் பயன்படுத்தி எழுத அனுமதித்து, உங்கள் சார்பாக copies produce செய்வதை handle செய்யும் popular library. Immer உடன், நீங்கள் எழுதும் code "rules-ஐ break" செய்து object-ஐ mutate செய்வது போல தெரியும்:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

ஆனால் regular mutation போல அல்லாமல், அது past state-ஐ overwrite செய்யாது!

<DeepDive>

#### Immer எப்படி வேலை செய்கிறது? {/*how-does-immer-work*/}

Immer provide செய்யும் `draft` என்பது [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) என்று அழைக்கப்படும் special type object; அதில் நீங்கள் என்ன செய்கிறீர்கள் என்பதை அது "record" செய்கிறது. அதனால்தான் அதை விருப்பமான அளவு freely mutate செய்ய முடியும்! Under the hood, `draft`-ன் எந்த parts மாறின என்பதை Immer கண்டறிந்து, உங்கள் edits கொண்ட முற்றிலும் புதிய object-ஐ produce செய்கிறது.

</DeepDive>

Immer முயற்சிக்க:

1. Immer-ஐ dependency ஆக சேர்க்க `npm install use-immer` run செய்யுங்கள்
2. பிறகு `import { useState } from 'react'`-ஐ `import { useImmer } from 'use-immer'`-ஆல் replace செய்யுங்கள்

மேலுள்ள example Immer-க்கு convert செய்யப்பட்ட வடிவம் இதோ:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        பெயர்:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        தலைப்பு:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        நகரம்:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        படம்:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' உருவாக்கியவர் '}
        {person.name}
        <br />
        ({person.artwork.city}-இல் உள்ளது)
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Event handlers எவ்வளவு concise ஆகியுள்ளன என்பதை கவனிக்கவும். Single component-இல் `useState` மற்றும் `useImmer`-ஐ விருப்பமான அளவு mix and match செய்யலாம். உங்கள் state-இல் nesting இருந்தால், மேலும் objects copy செய்வது repetitive code-க்கு வழிவகுத்தால், update handlers-ஐ concise ஆக வைத்திருக்க Immer சிறந்த வழி.

<DeepDive>

#### React-இல் state-ஐ mutate செய்வது ஏன் பரிந்துரைக்கப்படவில்லை? {/*why-is-mutating-state-not-recommended-in-react*/}

சில காரணங்கள் உள்ளன:

* **Debugging:** நீங்கள் `console.log` use செய்து state-ஐ mutate செய்யவில்லை என்றால், உங்கள் past logs recent state changes-ஆல் clobber ஆகாது. எனவே renders இடையில் state எப்படி மாறியது என்பதை தெளிவாகப் பார்க்கலாம்.
* **Optimizations:** Common React [optimization strategies](/reference/react/memo), previous props அல்லது state அடுத்தவற்றுடன் same ஆக இருந்தால் work skip செய்வதை சார்ந்துள்ளன. State-ஐ ஒருபோதும் mutate செய்யவில்லை என்றால் மாற்றங்கள் இருந்ததா என்று check செய்வது மிகவும் fast. `prevObj === obj` என்றால், அதன் உள்ளே எதுவும் மாறியிருக்க முடியாது என்று உறுதியாக இருக்கலாம்.
* **New Features:** நாங்கள் build செய்யும் புதிய React features, state [snapshot போல நடத்தப்படுவதைக்](/learn/state-as-a-snapshot) சார்ந்துள்ளன. நீங்கள் state-ன் past versions-ஐ mutate செய்தால், புதிய features use செய்வதை அது தடுக்கலாம்.
* **Requirement Changes:** Undo/Redo implement செய்தல், changes history காட்டுதல், அல்லது பயனர் form-ஐ earlier values-க்கு reset செய்ய அனுமதித்தல் போன்ற சில application features, எதுவும் mutate செய்யப்படாதபோது நேரடியாக செய்யலாம். ஏனெனில் state-ன் past copies-ஐ memory-இல் வைத்திருந்து, பொருத்தமானபோது reuse செய்யலாம். Mutative approach-இல் தொடங்கினால், இப்படிப்பட்ட features பின்னர் சேர்ப்பது கடினமாகலாம்.
* **Simpler Implementation:** React mutation-ஐ சார்ந்து இல்லாததால், உங்கள் objects உடன் special ஆக எதையும் செய்ய வேண்டியதில்லை. பல "reactive" solutions செய்வது போல properties-ஐ hijack செய்யவோ, எப்போதும் Proxies-க்குள் wrap செய்யவோ, initialization போது வேறு work செய்யவோ தேவையில்லை. இதனால்தான் எந்த object-ஆக இருந்தாலும்--எவ்வளவு பெரியதாக இருந்தாலும்--additional performance அல்லது correctness pitfalls இல்லாமல் state-க்குள் வைக்க React அனுமதிக்கிறது.

நடைமுறையில், React-இல் state-ஐ mutate செய்தும் பல நேரங்களில் "get away" ஆகலாம், ஆனால் இந்த அணுகுமுறையை மனதில் வைத்து உருவாக்கப்படும் புதிய React features-ஐ use செய்ய முடிவதற்காக அதைச் செய்ய வேண்டாம் என்று நாங்கள் வலியுறுத்துகிறோம். Future contributors மற்றும் உங்கள் future self கூட உங்களுக்கு நன்றி சொல்வார்கள்!

</DeepDive>

<Recap>

* React-இல் எல்லா state-ஐயும் immutable ஆக நடத்துங்கள்.
* Objects-ஐ state-இல் store செய்தால், அவற்றை mutate செய்வது renders-ஐ trigger செய்யாது, மேலும் previous render "snapshots"-இல் state-ஐ மாற்றும்.
* Object-ஐ mutate செய்வதற்கு பதிலாக, அதன் *புதிய* version create செய்து, state-ஐ அதற்கு set செய்வதன் மூலம் re-render trigger செய்யுங்கள்.
* Objects-ன் copies create செய்ய `{...obj, something: 'newValue'}` object spread syntax-ஐ use செய்யலாம்.
* Spread syntax shallow: அது ஒரு level deep மட்டுமே copy செய்கிறது.
* Nested object-ஐ update செய்ய, நீங்கள் update செய்யும் இடத்திலிருந்து மேலே வரை copies create செய்ய வேண்டும்.
* Repetitive copying code-ஐ குறைக்க Immer use செய்யுங்கள்.

</Recap>



<Challenges>

#### தவறான state updates-ஐ fix செய்யுங்கள் {/*fix-incorrect-state-updates*/}

இந்த form-இல் சில bugs உள்ளன. Score-ஐ increase செய்யும் button-ஐ சில முறை click செய்யுங்கள். அது increase ஆகவில்லை என்பதை கவனிக்கவும். பிறகு first name-ஐ edit செய்யுங்கள்; score திடீரென உங்கள் changes-ஐ "caught up" செய்ததை கவனிக்கவும். இறுதியாக, last name-ஐ edit செய்து score முற்றிலும் மறைந்ததை கவனிக்கவும்.

இந்த எல்லா bugs-ஐயும் fix செய்வதே உங்கள் task. அவற்றை fix செய்யும் போது, ஒவ்வொன்றும் ஏன் நடக்கிறது என்பதை விளக்கவும்.

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        மதிப்பெண்: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        முதல் பெயர்:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

இரண்டு bugs-உம் fix செய்யப்பட்ட version இதோ:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        மதிப்பெண்: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        முதல் பெயர்:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        கடைசி பெயர்:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick`-இல் problem என்னவெனில் அது `player` object-ஐ mutate செய்தது. அதன் விளைவாக, re-render செய்ய காரணம் உள்ளது என்று React அறியவில்லை, screen-இல் score update ஆகவில்லை. அதனால்தான் நீங்கள் first name edit செய்தபோது, state update ஆகி re-render trigger ஆனது; அது screen-இல் score-ஐயும் _update_ செய்தது.

`handleLastNameChange`-இல் problem என்னவெனில், அது existing `...player` fields-ஐ புதிய object-க்குள் copy செய்யவில்லை. அதனால்தான் last name edit செய்த பிறகு score lost ஆனது.

</Solution>

#### Mutation-ஐ கண்டுபிடித்து fix செய்யுங்கள் {/*find-and-fix-the-mutation*/}

Static background மீது draggable box ஒன்று உள்ளது. Select input பயன்படுத்தி box-ன் color-ஐ change செய்யலாம்.

ஆனால் bug உள்ளது. முதலில் box-ஐ move செய்து, பிறகு அதன் color-ஐ change செய்தால், background (move ஆகக்கூடாதது!) box position-க்கு "jump" ஆகும். ஆனால் இது நடக்கக் கூடாது: `Background`-ன் `position` prop `{ x: 0, y: 0 }` ஆன `initialPosition`-க்கு set செய்யப்பட்டுள்ளது. Color change பிறகு background ஏன் move ஆகிறது?

Bug-ஐ கண்டுபிடித்து fix செய்யுங்கள்.

<Hint>

எதாவது எதிர்பாராத விதமாக change ஆனால், mutation உள்ளது. `App.js`-இல் mutation-ஐ கண்டுபிடித்து fix செய்யுங்கள்.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [17]}} src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        என்னை இழுக்கவும்!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Problem `handleMove`-க்குள் உள்ள mutation-இல் இருந்தது. அது `shape.position`-ஐ mutate செய்தது, ஆனால் அது `initialPosition` point செய்யும் அதே object. அதனால்தான் shape மற்றும் background இரண்டும் move ஆகின்றன. (இது mutation என்பதால், தொடர்பில்லாத update--color change--re-render trigger செய்யும் வரை change screen-இல் reflect ஆகாது.)

Fix என்னவெனில் `handleMove`-இலிருந்து mutation-ஐ remove செய்து, shape-ஐ copy செய்ய spread syntax use செய்வது. `+=` mutation என்பதை கவனிக்கவும், எனவே regular `+` operation use செய்ய அதை rewrite செய்ய வேண்டும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        என்னை இழுக்கவும்!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Immer மூலம் object-ஐ update செய்யுங்கள் {/*update-an-object-with-immer*/}

இது முந்தைய challenge-இல் இருந்த அதே buggy example. இம்முறை, Immer use செய்து mutation-ஐ fix செய்யுங்கள். உங்கள் வசதிக்காக, `useImmer` ஏற்கனவே import செய்யப்பட்டுள்ளது; எனவே `shape` state variable-ஐ அதை use செய்ய மாற்ற வேண்டும்.

<Sandpack>

```js {expectedErrors: {'react-compiler': [18]}} src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        என்னை இழுக்கவும்!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

இது Immer உடன் rewrite செய்யப்பட்ட solution. Event handlers mutating fashion-இல் எழுதப்பட்டுள்ளன, ஆனால் bug ஏற்படவில்லை என்பதை கவனிக்கவும். காரணம் under the hood, Immer existing objects-ஐ ஒருபோதும் mutate செய்யாது.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        என்னை இழுக்கவும்!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
