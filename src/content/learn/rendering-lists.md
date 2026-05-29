---
title: Lists render செய்தல்
---

<Intro>

Data collection ஒன்றிலிருந்து பல ஒத்த components-ஐ display செய்ய நீங்கள் அடிக்கடி விரும்புவீர்கள். Data array-ஐ manipulate செய்ய [JavaScript array methods](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) பயன்படுத்தலாம். இந்த page-இல், data array-ஐ filter செய்து components array-ஆக transform செய்ய React உடன் [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) மற்றும் [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) பயன்படுத்துவீர்கள்.

</Intro>

<YouWillLearn>

* JavaScript-ன் `map()` பயன்படுத்தி array-இலிருந்து components render செய்வது எப்படி
* JavaScript-ன் `filter()` பயன்படுத்தி குறிப்பிட்ட components மட்டும் render செய்வது எப்படி
* React keys எப்போது, ஏன் பயன்படுத்த வேண்டும்

</YouWillLearn>

## Arrays-இலிருந்து data render செய்தல் {/*rendering-data-from-arrays*/}

உங்களிடம் content list ஒன்று உள்ளது என்று வைத்துக்கொள்ளுங்கள்.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

அந்த list items-க்கு உள்ள ஒரே வித்தியாசம் அவற்றின் contents, அதாவது அவற்றின் data. Interfaces உருவாக்கும்போது, வெவ்வேறு data பயன்படுத்தி ஒரே component-ன் பல instances-ஐ அடிக்கடி காட்ட வேண்டியிருக்கும்: comments lists முதல் profile images galleries வரை. இத்தகைய சூழல்களில், அந்த data-வை JavaScript objects மற்றும் arrays-இல் store செய்து, அவற்றிலிருந்து components lists render செய்ய [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) மற்றும் [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) போன்ற methods பயன்படுத்தலாம்.

Array-இலிருந்து items list generate செய்வது எப்படி என்பதற்கான சுருக்கமான example:

1. Data-வை array-க்குள் **move** செய்யுங்கள்:

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people` members-ஐ JSX nodes-ன் புதிய array ஆன `listItems`-க்கு **map** செய்யுங்கள்:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. `<ul>`-இல் wrap செய்யப்பட்ட `listItems`-ஐ உங்கள் component-இலிருந்து **return** செய்யுங்கள்:

```js
return <ul>{listItems}</ul>;
```

இதோ result:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

மேலுள்ள sandbox console error ஒன்றை display செய்கிறது என்பதை கவனியுங்கள்:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

இந்த error-ஐ எப்படி fix செய்வது என்பதை இந்த page-இல் பின்னர் கற்பீர்கள். அதற்கு முன், உங்கள் data-க்கு சிறிது structure சேர்ப்போம்.

## Items arrays-ஐ filter செய்தல் {/*filtering-arrays-of-items*/}

இந்த data-வை இன்னும் structured ஆக மாற்றலாம்.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

`'chemist'` profession கொண்டவர்களை மட்டும் காட்ட வேண்டும் என்று வைத்துக்கொள்ளுங்கள். அந்த people மட்டும் return செய்ய JavaScript-ன் `filter()` method பயன்படுத்தலாம். இந்த method items array ஒன்றை எடுத்து, அவற்றை “test” ( `true` அல்லது `false` return செய்யும் function) வழியாக pass செய்து, test-ஐ pass செய்த (`true` return செய்த) items மட்டுமுள்ள புதிய array-ஐ return செய்கிறது.

`profession` `'chemist'` ஆக உள்ள items மட்டும் உங்களுக்கு வேண்டும். இதற்கான "test" function `(person) => person.profession === 'chemist'` போல இருக்கும். அதை ஒன்றாக அமைப்பது இப்படி:

1. `people` மீது `filter()` call செய்து `person.profession === 'chemist'` மூலம் filter செய்வதன் மூலம், “chemist” people மட்டும் கொண்ட புதிய array `chemists`-ஐ **create** செய்யுங்கள்:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. இப்போது `chemists` மீது **map** செய்யுங்கள்:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
     </p>
  </li>
);
```

3. இறுதியாக, உங்கள் component-இலிருந்து `listItems`-ஐ **return** செய்யுங்கள்:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Arrow functions `=>`-க்கு உடனே பின்வரும் expression-ஐ implicit ஆக return செய்யும்; எனவே `return` statement தேவையில்லை:

```js
const listItems = chemists.map(person =>
  <li>...</li> // மறைமுக return!
);
```

ஆனால், **உங்கள் `=>`-க்கு பின் `{` curly brace வந்தால் `return`-ஐ explicit ஆக எழுத வேண்டும்!**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

`=> {` கொண்ட arrow functions-க்கு ["block body"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) உள்ளது என்று கூறப்படுகிறது. அவை single line-ஐ விட அதிக code எழுத அனுமதிக்கும்; ஆனால் `return` statement-ஐ நீங்கள் *தானாகவே* எழுத வேண்டும். அதை மறந்தால், எதுவும் return ஆகாது!

</Pitfall>

## `key` மூலம் list items-ஐ order-இல் வைத்தல் {/*keeping-list-items-in-order-with-key*/}

மேலுள்ள sandboxes அனைத்தும் console-இல் error காட்டுகின்றன என்பதை கவனியுங்கள்:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

ஒவ்வொரு array item-க்கும் ஒரு `key` தர வேண்டும் -- அந்த array-இல் உள்ள பிற items இடையே அதை unique ஆக அடையாளம் காணும் string அல்லது number:

```js
<li key={person.id}>...</li>
```

<Note>

`map()` call-க்குள் நேரடியாக உள்ள JSX elements-க்கு எப்போதும் keys தேவை!

</Note>

ஒவ்வொரு component எந்த array item-க்கு corresponds செய்கிறது என்பதை keys React-க்கு தெரிவிக்கும்; இதனால் பின்னர் அவற்றை match செய்ய முடியும். உங்கள் array items move ஆகலாம் (எ.கா. sorting காரணமாக), insert ஆகலாம், அல்லது delete ஆகலாம் என்றால் இது முக்கியமாகிறது. நன்றாகத் தேர்ந்தெடுத்த `key`, என்ன நடந்தது என்பதை React infer செய்து DOM tree-க்கு சரியான updates செய்ய உதவும்.

Keys-ஐ on the fly generate செய்வதற்குப் பதிலாக, அவற்றை உங்கள் data-க்குள் சேர்க்க வேண்டும்:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // JSX-இல் key ஆக பயன்படுத்தப்படுகிறது
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSX-இல் key ஆக பயன்படுத்தப்படுகிறது
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSX-இல் key ஆக பயன்படுத்தப்படுகிறது
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSX-இல் key ஆக பயன்படுத்தப்படுகிறது
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSX-இல் key ஆக பயன்படுத்தப்படுகிறது
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### ஒவ்வொரு list item-க்கும் பல DOM nodes-ஐ காட்டுதல் {/*displaying-several-dom-nodes-for-each-list-item*/}

ஒவ்வொரு item-மும் ஒன்று அல்ல, பல DOM nodes render செய்ய வேண்டுமானால் என்ன செய்வீர்கள்?

சுருக்கமான [`<>...</>` Fragment](/reference/react/Fragment) syntax key pass செய்ய அனுமதிக்காது. எனவே அவற்றை single `<div>`-க்குள் group செய்ய வேண்டும், அல்லது சற்றே நீளமான, [மேலும் explicit ஆன `<Fragment>` syntax](/reference/react/Fragment#rendering-a-list-of-fragments)-ஐ பயன்படுத்த வேண்டும்:

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragments DOM-இலிருந்து மறைந்துவிடும்; எனவே இது `<h1>`, `<p>`, `<h1>`, `<p>` போன்ற flat list ஒன்றை உருவாக்கும்.

</DeepDive>

### உங்கள் `key` எங்கிருந்து பெறுவது {/*where-to-get-your-key*/}

வெவ்வேறு data sources வெவ்வேறு key sources வழங்குகின்றன:

* **Database-இலிருந்து data:** உங்கள் data database-இலிருந்து வந்தால், இயல்பாகவே unique ஆன database keys/IDs பயன்படுத்தலாம்.
* **Locally generated data:** உங்கள் data locally generate செய்து persist செய்யப்படுமானால் (எ.கா. note-taking app-இல் notes), items create செய்யும்போது incrementing counter, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID), அல்லது [`uuid`](https://www.npmjs.com/package/uuid) போன்ற package பயன்படுத்துங்கள்.

### Keys-ன் விதிகள் {/*rules-of-keys*/}

* **Keys siblings இடையே unique ஆக இருக்க வேண்டும்.** ஆனால் _வேறு_ arrays-இல் உள்ள JSX nodes-க்கு அதே keys பயன்படுத்துவது பரவாயில்லை.
* **Keys மாறக்கூடாது**; இல்லையெனில் அவற்றின் நோக்கம் கெடும்! Rendering போது அவற்றை generate செய்ய வேண்டாம்.

### React-க்கு keys ஏன் தேவை? {/*why-does-react-need-keys*/}

உங்கள் desktop-இல் உள்ள files-க்கு பெயர்கள் இல்லை என்று கற்பனை செய்யுங்கள். அதற்கு பதிலாக, அவற்றை அவற்றின் order மூலம் குறிப்பிடுவீர்கள் -- முதல் file, இரண்டாவது file போன்றது. அதற்கு பழகிக்கொள்ளலாம்; ஆனால் ஒரு file delete செய்தவுடன் குழப்பமாகும். இரண்டாவது file முதல் file ஆகும், மூன்றாவது file இரண்டாவது file ஆகும், இப்படி தொடரும்.

Folder-இல் file names மற்றும் array-இல் JSX keys ஒரேபோன்ற நோக்கத்தை நிறைவேற்றுகின்றன. Siblings இடையே ஒரு item-ஐ unique ஆக identify செய்ய அவை உதவுகின்றன. நன்றாகத் தேர்ந்தெடுத்த key, array-க்குள் உள்ள position-ஐ விட அதிக தகவல் தரும். Reordering காரணமாக _position_ மாறினாலும், `key` அந்த item-ஐ அதன் lifetime முழுவதும் React identify செய்ய அனுமதிக்கிறது.

<Pitfall>

Array-இல் உள்ள item-ன் index-ஐ key ஆக பயன்படுத்த tempted ஆகலாம். உண்மையில், நீங்கள் `key` ஒன்றும் specify செய்யாவிட்டால் React அதையே பயன்படுத்தும். ஆனால் item insert, delete, அல்லது array reorder செய்யப்பட்டால், நீங்கள் items render செய்யும் order காலப்போக்கில் மாறும். Index-ஐ key ஆக பயன்படுத்துவது அடிக்கடி subtle மற்றும் confusing bugs-க்கு வழிவகுக்கும்.

அதேபோல், `key={Math.random()}` போன்ற முறையில் keys-ஐ on the fly generate செய்ய வேண்டாம். இதனால் renders இடையே keys ஒருபோதும் match ஆகாது; அதனால் உங்கள் components மற்றும் DOM ஒவ்வொரு முறையும் recreate செய்யப்படும். இது மெதுவாக இருப்பதோடு மட்டுமல்லாமல், list items-க்குள் உள்ள எந்த user input-ஐயும் இழக்கும். அதற்கு பதிலாக, data அடிப்படையிலான stable ID பயன்படுத்துங்கள்.

உங்கள் components `key`-ஐ prop ஆக receive செய்யாது என்பதை நினைவில் கொள்ளுங்கள். React தானாகவே hint ஆக மட்டும் இதைப் பயன்படுத்தும். உங்கள் component-க்கு ID தேவைப்பட்டால், அதை separate prop ஆக pass செய்ய வேண்டும்: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

இந்த page-இல் நீங்கள் கற்றது:

* Components-இலிருந்து data-வை arrays மற்றும் objects போன்ற data structures-க்குள் move செய்வது எப்படி.
* JavaScript-ன் `map()` மூலம் ஒத்த components sets உருவாக்குவது எப்படி.
* JavaScript-ன் `filter()` மூலம் filtered items arrays உருவாக்குவது எப்படி.
* ஒரு collection-இல் ஒவ்வொரு component-க்கும் `key` ஏன், எப்படி set செய்வது; position அல்லது data மாறினாலும் React ஒவ்வொன்றையும் track செய்ய இதனால் முடியும்.

</Recap>



<Challenges>

#### List-ஐ இரண்டாகப் பிரித்தல் {/*splitting-a-list-in-two*/}

இந்த example எல்லா people-ன் list-ஐ காட்டுகிறது.

அதை ஒருவருக்குப் பிறகு ஒருவர் இரண்டு தனி lists காட்டுமாறு மாற்றுங்கள்: **Chemists** மற்றும் **மற்றவர்கள்.** முன்பைப் போலவே, `person.profession === 'chemist'` check செய்து ஒருவர் chemist தானா என்பதை தீர்மானிக்கலாம்.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>விஞ்ஞானிகள்</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

`filter()`-ஐ இருமுறை பயன்படுத்தி இரண்டு தனி arrays create செய்து, பின்னர் இரண்டிலும் `map` செய்யலாம்:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>விஞ்ஞானிகள்</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>மற்றவர்கள்</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

இந்த solution-இல், `map` calls parent `<ul>` elements-க்குள் நேரடியாக inline ஆக வைக்கப்பட்டுள்ளன; அது மேலும் readable என்று நினைத்தால் அவற்றுக்காக variables அறிமுகப்படுத்தலாம்.

Rendered lists இடையே இன்னும் சிறிது duplication உள்ளது. மேலும் சென்று repetitive பகுதிகளை `<ListSection>` component-ஆக extract செய்யலாம்:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>விஞ்ஞானிகள்</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="மற்றவர்கள்"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

மிக கவனமான reader, இரண்டு `filter` calls இருப்பதால் ஒவ்வொருவரின் profession-ஐ இருமுறை check செய்கிறோம் என்பதை கவனிக்கலாம். Property check செய்வது மிகவும் வேகமானது; எனவே இந்த example-இல் இது பரவாயில்லை. உங்கள் logic அதைவிட expensive ஆக இருந்தால், `filter` calls-க்கு பதிலாக arrays-ஐ manually construct செய்து ஒவ்வொருவரையும் ஒருமுறை மட்டும் check செய்யும் loop பயன்படுத்தலாம்.

உண்மையில், `people` ஒருபோதும் மாறவில்லை என்றால், இந்த code-ஐ component-க்கு வெளியே move செய்யலாம். React-ன் பார்வையில், இறுதியில் JSX nodes array ஒன்றை கொடுக்கிறீர்களா என்பதே முக்கியம். அந்த array-ஐ எப்படி produce செய்கிறீர்கள் என்பதை அது கவலைப்படாது:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              இதற்குப் புகழ்பெற்றவர்: {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>விஞ்ஞானிகள்</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="மற்றவர்கள்"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### ஒரே component-இல் nested lists {/*nested-lists-in-one-component*/}

இந்த array-இலிருந்து recipes list உருவாக்குங்கள்! Array-இல் உள்ள ஒவ்வொரு recipe-க்கும், அதன் name-ஐ `<h2>` ஆகவும் ingredients-ஐ `<ul>`-இல் list ஆகவும் display செய்யுங்கள்.

<Hint>

இதற்கு இரண்டு வெவ்வேறு `map` calls nest செய்ய வேண்டும்.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>சமையல் குறிப்புகள்</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

இதற்கு ஒரு வழி:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>சமையல் குறிப்புகள்</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

`recipes` ஒவ்வொன்றிலும் ஏற்கனவே `id` field உள்ளது; எனவே outer loop தனது `key`-க்கு அதைப் பயன்படுத்துகிறது. Ingredients மீது loop செய்ய பயன்படுத்தக்கூடிய ID இல்லை. ஆனால் அதே recipe-க்குள் ஒரே ingredient இருமுறை list செய்யப்படாது என்று கருதுவது reasonable; எனவே அதன் name `key` ஆகச் செயல்படலாம். மாற்றாக, IDs சேர்க்க data structure-ஐ மாற்றலாம், அல்லது index-ஐ `key` ஆக பயன்படுத்தலாம் (ingredients-ஐ பாதுகாப்பாக reorder செய்ய முடியாது என்ற caveat உடன்).

</Solution>

#### List item component-ஐ extract செய்தல் {/*extracting-a-list-item-component*/}

இந்த `RecipeList` component-இல் இரண்டு nested `map` calls உள்ளன. அதை simplify செய்ய, `id`, `name`, மற்றும் `ingredients` props ஏற்கும் `Recipe` component ஒன்றை அதிலிருந்து extract செய்யுங்கள். Outer `key`-ஐ எங்கே வைப்பீர்கள், ஏன்?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>சமையல் குறிப்புகள்</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Outer `map`-இலிருந்து JSX-ஐ புதிய `Recipe` component-க்குள் copy-paste செய்து அந்த JSX-ஐ return செய்யலாம். பிறகு `recipe.name`-ஐ `name`, `recipe.id`-ஐ `id` போன்றவையாக மாற்றி, அவற்றை props ஆக `Recipe`-க்கு pass செய்யலாம்:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>சமையல் குறிப்புகள்</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

இங்கே, `<Recipe {...recipe} key={recipe.id} />` என்பது "`recipe` object-ன் எல்லா properties-ஐ `Recipe` component-க்கு props ஆக pass செய்" என்று சொல்லும் syntax shortcut. ஒவ்வொரு prop-ஐயும் explicit ஆகவும் எழுதலாம்: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**`key` என்பது `Recipe` return செய்யும் root `<div>`-இல் அல்ல, `<Recipe>` தன்னிலேயே specify செய்யப்பட்டிருப்பதை கவனியுங்கள்.** ஏனெனில் இந்த `key`, surrounding array context-க்குள் நேரடியாக தேவைப்படுகிறது. முன்பு உங்களிடம் `<div>`s array இருந்ததால் அவற்றில் ஒவ்வொன்றுக்கும் `key` தேவைப்பட்டது; இப்போது `<Recipe>`s array உள்ளது. வேறு வார்த்தைகளில், component extract செய்யும்போது, copy-paste செய்யும் JSX-க்கு வெளியே `key`-ஐ விட மறக்க வேண்டாம்.

</Solution>

#### Separator உடன் list {/*list-with-a-separator*/}

இந்த example Tachibana Hokushi-ன் புகழ்பெற்ற haiku ஒன்றை render செய்கிறது; ஒவ்வொரு line-உம் `<p>` tag-இல் wrap செய்யப்பட்டுள்ளது. ஒவ்வொரு paragraph இடையிலும் `<hr />` separator insert செய்வதே உங்கள் வேலை. உங்கள் final structure இப்படி இருக்க வேண்டும்:

```js
<article>
  <p>நான் எழுதுகிறேன், அழிக்கிறேன், மீண்டும் எழுதுகிறேன்</p>
  <hr />
  <p>மீண்டும் அழிக்கிறேன், பின்னர்</p>
  <hr />
  <p>ஒரு poppy மலர்கிறது.</p>
</article>
```

Haiku மூன்று lines மட்டுமே கொண்டது, ஆனால் உங்கள் solution எந்த எண்ணிக்கையிலான lines உடனும் வேலை செய்ய வேண்டும். `<hr />` elements `<p>` elements இடையில் *மட்டுமே* தோன்ற வேண்டும்; தொடக்கத்திலும் முடிவிலும் அல்ல என்பதை கவனியுங்கள்!

<Sandpack>

```js
const poem = {
  lines: [
    'நான் எழுதுகிறேன், அழிக்கிறேன், மீண்டும் எழுதுகிறேன்',
    'மீண்டும் அழிக்கிறேன், பின்னர்',
    'ஒரு poppy மலர்கிறது.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(கவிதை lines ஒருபோதும் reorder ஆகாது என்பதால் index-ஐ key ஆக பயன்படுத்துவது acceptable ஆன rare case இது.)

<Hint>

`map`-ஐ manual loop ஆக மாற்றவோ, அல்லது Fragment பயன்படுத்தவோ வேண்டும்.

</Hint>

<Solution>

Manual loop எழுதலாம்; loop செய்யும்போது `<hr />` மற்றும் `<p>...</p>`-ஐ output array-க்குள் insert செய்யலாம்:

<Sandpack>

```js
const poem = {
  lines: [
    'நான் எழுதுகிறேன், அழிக்கிறேன், மீண்டும் எழுதுகிறேன்',
    'மீண்டும் அழிக்கிறேன், பின்னர்',
    'ஒரு poppy மலர்கிறது.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Original line index-ஐ `key` ஆக பயன்படுத்துவது இனி வேலை செய்யாது; ஏனெனில் ஒவ்வொரு separator மற்றும் paragraph இப்போது ஒரே array-இல் உள்ளன. ஆனால் suffix பயன்படுத்தி ஒவ்வொன்றுக்கும் தனித்த key தரலாம், உதாரணமாக `key={i + '-text'}`.

மாற்றாக, `<hr />` மற்றும் `<p>...</p>` கொண்ட Fragments collection ஒன்றை render செய்யலாம். ஆனால் `<>...</>` shorthand syntax keys pass செய்வதை support செய்யாது; எனவே `<Fragment>`-ஐ explicit ஆக எழுத வேண்டும்:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'நான் எழுதுகிறேன், அழிக்கிறேன், மீண்டும் எழுதுகிறேன்',
    'மீண்டும் அழிக்கிறேன், பின்னர்',
    'ஒரு poppy மலர்கிறது.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

நினைவில் கொள்ளுங்கள்: Fragments (அடிக்கடி `<> </>` என்று எழுதப்படும்) கூடுதல் `<div>`s சேர்க்காமல் JSX nodes-ஐ group செய்ய அனுமதிக்கின்றன!

</Solution>

</Challenges>
