---
title: "State: ஒரு Component-ன் நினைவகம்"
---

<Intro>

ஒரு interaction-ன் விளைவாக screen-இல் இருப்பதை components அடிக்கடி மாற்ற வேண்டியிருக்கும். Form-இல் type செய்வது input field-ஐ update செய்ய வேண்டும்; image carousel-இல் "next" click செய்வது எந்த image காட்டப்படுகிறது என்பதை மாற்ற வேண்டும்; "buy" click செய்வது product-ஐ shopping cart-இல் வைக்க வேண்டும். Components சில விஷயங்களை "நினைவில்" வைத்திருக்க வேண்டும்: current input value, current image, shopping cart. React-இல், இவ்வகை component-specific memory *state* என்று அழைக்கப்படுகிறது.

</Intro>

<YouWillLearn>

* [`useState`](/reference/react/useState) Hook மூலம் state variable சேர்ப்பது எப்படி
* `useState` Hook எந்த value pair-ஐ return செய்கிறது
* ஒன்றுக்கு மேற்பட்ட state variables சேர்ப்பது எப்படி
* State ஏன் local என்று அழைக்கப்படுகிறது

</YouWillLearn>

## Regular variable போதாத போது {/*when-a-regular-variable-isnt-enough*/}

Sculpture image ஒன்றை render செய்யும் component இதோ. "அடுத்து" button-ஐ click செய்தால் `index`-ஐ `1`, பிறகு `2`, என்று மாற்றி அடுத்த sculpture-ஐ காட்ட வேண்டும். ஆனால் இது **வேலை செய்யாது** (நீங்கள் முயற்சி செய்யலாம்!):

<Sandpack>

```js {expectedErrors: {'react-compiler': [7]}}
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        உருவாக்கியவர் {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

`handleClick` event handler local variable ஆன `index`-ஐ update செய்கிறது. ஆனால் இரண்டு விஷயங்கள் அந்த மாற்றம் visible ஆகாமல் தடுக்கின்றன:

1. **Local variables renders இடையில் persist ஆகாது.** React இந்த component-ஐ இரண்டாவது முறையாக render செய்யும்போது, அதை scratch-இலிருந்து render செய்கிறது; local variables-க்கு செய்யப்பட்ட மாற்றங்களை அது கருதாது.
2. **Local variables-இல் மாற்றங்கள் renders-ஐ trigger செய்யாது.** புதிய data உடன் component-ஐ மீண்டும் render செய்ய வேண்டும் என்பதை React அறியாது.

புதிய data உடன் component-ஐ update செய்ய, இரண்டு விஷயங்கள் நடக்க வேண்டும்:

1. Renders இடையில் data-வை **retain** செய்ய வேண்டும்.
2. புதிய data உடன் component-ஐ render செய்ய React-ஐ **trigger** செய்ய வேண்டும் (re-rendering).

[`useState`](/reference/react/useState) Hook இந்த இரண்டு விஷயங்களையும் provide செய்கிறது:

1. Renders இடையில் data-வை retain செய்ய ஒரு **state variable**.
2. Variable-ஐ update செய்து component-ஐ மீண்டும் render செய்ய React-ஐ trigger செய்ய ஒரு **state setter function**.

## State variable சேர்த்தல் {/*adding-a-state-variable*/}

State variable சேர்க்க, file-ன் top-இல் React-இலிருந்து `useState`-ஐ import செய்யுங்கள்:

```js
import { useState } from 'react';
```

பிறகு, இந்த line-ஐ:

```js
let index = 0;
```

இதனுடன் replace செய்யுங்கள்:

```js
const [index, setIndex] = useState(0);
```

`index` ஒரு state variable; `setIndex` setter function ஆகும்.

> இங்கே உள்ள `[` மற்றும் `]` syntax [array destructuring](https://javascript.info/destructuring-assignment) என்று அழைக்கப்படுகிறது; அது array-இலிருந்து values-ஐ read செய்ய அனுமதிக்கிறது. `useState` return செய்யும் array எப்போதும் சரியாக இரண்டு items-ஐக் கொண்டிருக்கும்.

`handleClick`-இல் அவை ஒன்றாக வேலை செய்வது இப்படி:

```js
function handleClick() {
  setIndex(index + 1);
}
```

இப்போது "அடுத்து" button-ஐ click செய்தால் current sculpture மாறும்:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        உருவாக்கியவர் {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

### உங்கள் முதல் Hook-ஐ சந்தியுங்கள் {/*meet-your-first-hook*/}

React-இல், `useState` மற்றும் "`use`" என்று தொடங்கும் மற்ற எந்த function-உம் Hook என்று அழைக்கப்படுகிறது.

*Hooks* என்பது React [rendering](/learn/render-and-commit#step-1-trigger-a-render) செய்யும் போது மட்டுமே available ஆக இருக்கும் special functions (அதை அடுத்த page-இல் மேலும் விரிவாக பார்க்கப் போகிறோம்). அவை பல்வேறு React features-க்கு "hook into" செய்ய அனுமதிக்கின்றன.

State அவற்றில் ஒரு feature மட்டுமே; பிற Hooks-ஐ பின்னர் சந்திப்பீர்கள்.

<Pitfall>

**`use` என்று தொடங்கும் functions ஆன Hooks-ஐ உங்கள் components-ன் top level-இல் அல்லது [உங்கள் சொந்த Hooks](/learn/reusing-logic-with-custom-hooks)-இல் மட்டுமே call செய்யலாம்.** Conditions, loops, அல்லது பிற nested functions-க்குள் Hooks-ஐ call செய்ய முடியாது. Hooks functions தான், ஆனால் உங்கள் component-ன் தேவைகள் பற்றிய unconditional declarations ஆக அவற்றை நினைப்பது உதவும். File-ன் top-இல் modules-ஐ "import" செய்வது போல, component-ன் top-இல் React features-ஐ "use" செய்கிறீர்கள்.

</Pitfall>

### `useState`-ன் anatomy {/*anatomy-of-usestate*/}

நீங்கள் [`useState`](/reference/react/useState) call செய்யும்போது, இந்த component ஏதாவது ஒன்றை நினைவில் வைத்திருக்க வேண்டும் என்று React-க்கு சொல்லுகிறீர்கள்:

```js
const [index, setIndex] = useState(0);
```

இந்த case-இல், `index`-ஐ React நினைவில் வைத்திருக்க வேண்டும் என்று நீங்கள் விரும்புகிறீர்கள்.

<Note>

இந்த pair-க்கு `const [something, setSomething]` போல பெயரிடுவது convention. உங்களுக்கு விருப்பமான பெயரை வைக்கலாம், ஆனால் conventions projects முழுவதும் விஷயங்களை நேரடியாகப் புரிந்துகொள்ள உதவுகின்றன.

</Note>

`useState`-க்கு உள்ள ஒரே argument உங்கள் state variable-ன் **initial value**. இந்த example-இல், `useState(0)` மூலம் `index`-ன் initial value `0` ஆக set செய்யப்படுகிறது.

உங்கள் component render ஆகும் ஒவ்வொரு முறையும், இரண்டு values கொண்ட array-ஐ `useState` தருகிறது:

1. நீங்கள் stored செய்த value உடன் உள்ள **state variable** (`index`).
2. State variable-ஐ update செய்து component-ஐ மீண்டும் render செய்ய React-ஐ trigger செய்யும் **state setter function** (`setIndex`).

அது action-இல் நடப்பது இப்படி:

```js
const [index, setIndex] = useState(0);
```

1. **உங்கள் component முதல் முறையாக render ஆகிறது.** `index`-க்கு initial value ஆக `0`-ஐ `useState`-க்கு pass செய்ததால், அது `[0, setIndex]` return செய்யும். `0` தான் latest state value என்று React நினைவில் வைத்துக்கொள்கிறது.
2. **நீங்கள் state-ஐ update செய்கிறீர்கள்.** பயனர் button-ஐ click செய்தால், அது `setIndex(index + 1)` call செய்கிறது. `index` `0`, எனவே அது `setIndex(1)`. இது `index` இப்போது `1` என்று React நினைவில் வைத்துக்கொள்ளச் சொல்லி, மற்றொரு render-ஐ trigger செய்கிறது.
3. **உங்கள் component-ன் இரண்டாவது render.** React இன்னும் `useState(0)`-ஐப் பார்க்கிறது, ஆனால் நீங்கள் `index`-ஐ `1` ஆக set செய்ததை React *நினைவில்* வைத்திருப்பதால், அதற்கு பதிலாக `[1, setIndex]` return செய்கிறது.
4. இப்படியே தொடர்கிறது!

## ஒரு component-க்கு பல state variables கொடுத்தல் {/*giving-a-component-multiple-state-variables*/}

ஒரே component-இல் விரும்பிய அளவு state variables-ஐ, விரும்பிய types-இல் வைத்திருக்கலாம். இந்த component-இல் இரண்டு state variables உள்ளன: number ஆன `index`, மேலும் "விவரங்கள் காட்டு" click செய்தால் toggle ஆகும் boolean ஆன `showMore`:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        உருவாக்கியவர் {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'மறை' : 'காட்டு'} விவரங்கள்
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

இந்த example-இல் உள்ள `index` மற்றும் `showMore` போல state ஒன்றுக்கொன்று தொடர்பற்றதாக இருந்தால், பல state variables வைத்திருப்பது நல்லது. ஆனால் நீங்கள் அடிக்கடி இரண்டு state variables-ஐ ஒன்றாக change செய்கிறீர்கள் என்றால், அவற்றை ஒன்றாக combine செய்வது நேரடியாக இருக்கலாம். உதாரணமாக, பல fields கொண்ட form இருந்தால், ஒவ்வொரு field-க்கும் தனி state variable வைத்திருப்பதை விட object வைத்திருக்கும் single state variable வைத்திருப்பது வசதியாக இருக்கும். மேலும் tips-க்கு [State Structure-ஐ தேர்ந்தெடுத்தல்](/learn/choosing-the-state-structure)-ஐ படிக்கவும்.

<DeepDive>

#### எந்த state-ஐ return செய்ய வேண்டும் என்பதை React எப்படி அறிகிறது? {/*how-does-react-know-which-state-to-return*/}

`useState` call *எந்த* state variable-ஐ குறிக்கிறது என்பதற்கான எந்த information-ஐயும் பெறவில்லை என்பதை நீங்கள் கவனித்திருக்கலாம். `useState`-க்கு pass செய்யப்படும் "identifier" எதுவும் இல்லை; அப்படியானால் எந்த state variable-ஐ return செய்ய வேண்டும் என்பதை அது எப்படி அறிகிறது? உங்கள் functions-ஐ parse செய்வது போன்ற ஏதேனும் magic-ஐ அது சார்ந்துள்ளதா? பதில் இல்லை.

அதற்கு பதிலாக, அவற்றின் concise syntax-ஐ சாத்தியமாக்க, Hooks **அதே component-ன் ஒவ்வொரு render-இலும் stable call order-ஐ சார்ந்துள்ளன.** மேலுள்ள rule-ஐ ("Hooks-ஐ top level-இல் மட்டுமே call செய்யுங்கள்") பின்பற்றினால், Hooks எப்போதும் அதே order-இல் call செய்யப்படும் என்பதால் இது நடைமுறையில் நன்றாக வேலை செய்கிறது. கூடுதலாக, [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) பெரும்பாலான தவறுகளைப் பிடிக்கும்.

Internally, ஒவ்வொரு component-க்கும் state pairs-ன் array ஒன்றை React வைத்திருக்கிறது. Rendering-க்கு முன் `0` ஆக set செய்யப்படும் current pair index-ஐயும் அது maintain செய்கிறது. நீங்கள் `useState` call செய்யும் ஒவ்வொரு முறையும், React அடுத்த state pair-ஐ தருகிறது மற்றும் index-ஐ increment செய்கிறது. இந்த mechanism பற்றி [React Hooks: Not Magic, Just Arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)-இல் மேலும் படிக்கலாம்.

இந்த example **React-ஐ use செய்யவில்லை**, ஆனால் `useState` internally எப்படி வேலை செய்கிறது என்ற ஒரு idea-வை தருகிறது:

<Sandpack>

```js src/index.js active
let componentHooks = [];
let currentHookIndex = 0;

// How useState works inside React (simplified).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // This is not the first render,
    // so the state pair already exists.
    // Return it and prepare for next Hook call.
    currentHookIndex++;
    return pair;
  }

  // This is the first time we're rendering,
  // so create a state pair and store it.
  pair = [initialState, setState];

  function setState(nextState) {
    // When the user requests a state change,
    // put the new value into the pair.
    pair[0] = nextState;
    updateDOM();
  }

  // Store the pair for future renders
  // and prepare for the next Hook call.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Each useState() call will get the next pair.
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // This example doesn't use React, so
  // return an output object instead of JSX.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} - ${sculpture.artist}`,
    counter: `${index + 1} / ${sculptureList.length}`,
    more: `${showMore ? 'மறை' : 'காட்டு'} விவரங்கள்`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Reset the current Hook index
  // before rendering the component.
  currentHookIndex = 0;
  let output = Gallery();

  // Update the DOM to match the output.
  // This is the part React does for you.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];

// Make UI match the initial state.
updateDOM();
```

```html public/index.html
<button id="nextButton">
  அடுத்து
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

React-ஐ use செய்ய இதை புரிந்திருக்க வேண்டியதில்லை, ஆனால் இது ஒரு பயனுள்ள mental model ஆக இருக்கலாம்.

</DeepDive>

## State isolated மற்றும் private ஆகும் {/*state-is-isolated-and-private*/}

State screen-இல் உள்ள component instance-க்கு local ஆகும். வேறு வார்த்தைகளில், **அதே component-ஐ இரண்டு முறை render செய்தால், ஒவ்வொரு copy-க்கும் முழுமையாக isolated state இருக்கும்!** ஒன்றை change செய்தால் மற்றொன்று பாதிக்கப்படாது.

இந்த example-இல், முன்பு பார்த்த `Gallery` component அதன் logic-ல் எந்த மாற்றமும் இல்லாமல் இரண்டு முறை render செய்யப்படுகிறது. ஒவ்வொரு gallery-க்குள் உள்ள buttons-ஐ click செய்து பாருங்கள். அவற்றின் state independent ஆக இருப்பதை கவனிக்கவும்:

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js src/Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
      <button onClick={handleNextClick}>
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        உருவாக்கியவர் {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'மறை' : 'காட்டு'} விவரங்கள்
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </section>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

உங்கள் module-ன் top-இல் declare செய்யக்கூடிய regular variables-இலிருந்து state-ஐ வேறுபடுத்துவது இதுவே. State ஒரு குறிப்பிட்ட function call-க்கும் code-இல் உள்ள ஒரு இடத்திற்கும் கட்டுப்பட்டதல்ல; அது screen-இல் உள்ள குறிப்பிட்ட இடத்துக்கு "local" ஆகும். நீங்கள் இரண்டு `<Gallery />` components-ஐ render செய்துள்ளீர்கள், எனவே அவற்றின் state தனித்தனியாக store செய்யப்படுகிறது.

மேலும் `Page` component, `Gallery` state பற்றி அல்லது அதற்கு state ஏதேனும் இருக்கிறதா என்பது பற்றியும் எதையும் "அறியவில்லை" என்பதை கவனிக்கவும். Props-க்கு மாறாக, **state அதை declare செய்யும் component-க்கு முழுமையாக private ஆகும்.** Parent component அதை change செய்ய முடியாது. இதனால் மற்ற components-ஐ பாதிக்காமல் எந்த component-க்கும் state சேர்க்கவோ remove செய்யவோ முடியும்.

இரண்டு galleries-உம் தங்கள் states-ஐ sync-இல் வைத்திருக்க வேண்டும் என்றால் என்ன செய்வது? React-இல் இதைச் செய்வதற்கான சரியான வழி, child components-இலிருந்து state-ஐ *remove* செய்து, அவற்றின் closest shared parent-க்கு அதைச் சேர்ப்பது. அடுத்த சில pages ஒரு single component-ன் state-ஐ organize செய்வதில் கவனம் செலுத்தும்; ஆனால் [Components இடையில் State-ஐ பகிர்தல்](/learn/sharing-state-between-components) பகுதியில் இந்த topic-க்கு திரும்புவோம்.

<Recap>

* ஒரு component renders இடையில் சில information-ஐ "நினைவில்" வைத்திருக்க வேண்டும்போது state variable-ஐ use செய்யுங்கள்.
* `useState` Hook-ஐ call செய்வதன் மூலம் state variables declare செய்யப்படுகின்றன.
* Hooks என்பது `use` என்று தொடங்கும் special functions. State போன்ற React features-க்கு "hook into" செய்ய அவை அனுமதிக்கின்றன.
* Hooks imports-ஐ நினைவூட்டலாம்: அவை unconditionally call செய்யப்பட வேண்டும். `useState` உட்பட Hooks-ஐ call செய்வது component அல்லது மற்றொரு Hook-ன் top level-இல் மட்டுமே valid.
* `useState` Hook ஒரு value pair-ஐ return செய்கிறது: current state மற்றும் அதை update செய்யும் function.
* ஒன்றுக்கு மேற்பட்ட state variables வைத்திருக்கலாம். Internally, React அவற்றை அவற்றின் order மூலம் match செய்கிறது.
* State component-க்கு private. அதை இரண்டு இடங்களில் render செய்தால், ஒவ்வொரு copy-க்கும் தனித் state கிடைக்கும்.

</Recap>



<Challenges>

#### Gallery-ஐ complete செய்யுங்கள் {/*complete-the-gallery*/}

கடைசி sculpture-இல் "அடுத்து" press செய்தால் code crash ஆகிறது. Crash-ஐத் தடுக்க logic-ஐ fix செய்யுங்கள். Event handler-க்கு extra logic சேர்ப்பதன் மூலமோ, action சாத்தியமில்லாத போது button-ஐ disable செய்வதன் மூலமோ இதைச் செய்யலாம்.

Crash-ஐ fix செய்த பிறகு, முந்தைய sculpture-ஐ காட்டும் "முந்தையது" button-ஐ சேர்க்கவும். முதல் sculpture-இல் அது crash ஆகக் கூடாது.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        உருவாக்கியவர் {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'மறை' : 'காட்டு'} விவரங்கள்
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

இது இரண்டு event handlers-க்குள்ளும் guarding condition சேர்த்து, தேவைப்படும் போது buttons-ஐ disable செய்கிறது:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        முந்தையது
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        அடுத்து
      </button>
      <h2>
        <i>{sculpture.name} </i>
        உருவாக்கியவர் {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} / {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'மறை' : 'காட்டு'} விவரங்கள்
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

`hasPrev` மற்றும் `hasNext` returned JSX-க்கும் event handlers-க்குள்ளும் *இரண்டிலும்* பயன்படுத்தப்படுகின்றன என்பதை கவனிக்கவும்! Rendering போது declare செய்யப்பட்ட எந்த variables-ஐயும் event handler functions ["close over"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) செய்வதால் இந்த பயனுள்ள pattern வேலை செய்கிறது.

</Solution>

#### சிக்கிக் கொண்ட form inputs-ஐ fix செய்யுங்கள் {/*fix-stuck-form-inputs*/}

Input fields-இல் type செய்தால் எதுவும் தோன்றவில்லை. Input values empty strings-உடன் "stuck" ஆக இருப்பது போல உள்ளது. முதல் `<input>`-ன் `value` எப்போதும் `firstName` variable-க்கு match ஆக set செய்யப்பட்டுள்ளது; இரண்டாவது `<input>`-ன் `value` எப்போதும் `lastName` variable-க்கு match ஆக set செய்யப்பட்டுள்ளது. இது சரி. இரண்டு inputs-க்கும் `onChange` event handlers உள்ளன; அவை latest user input (`e.target.value`) அடிப்படையில் variables-ஐ update செய்ய முயற்சிக்கின்றன. ஆனால் variables re-renders இடையில் தங்கள் values-ஐ "நினைவில்" வைத்திருக்கவில்லை போல தெரிகிறது. அதற்கு பதிலாக state variables use செய்து இதை fix செய்யுங்கள்.

<Sandpack>

```js {expectedErrors: {'react-compiler': [6]}}
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="முதல் பெயர்"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="கடைசி பெயர்"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>வணக்கம், {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset செய்</button>
    </form>
  );
}
```

```css
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

முதலில், React-இலிருந்து `useState`-ஐ import செய்யுங்கள். பிறகு `firstName` மற்றும் `lastName`-ஐ `useState` call செய்து declare செய்யப்பட்ட state variables-ஆல் replace செய்யுங்கள். இறுதியாக, ஒவ்வொரு `firstName = ...` assignment-ஐ `setFirstName(...)`-ஆல் replace செய்யுங்கள்; `lastName`-க்கும் அதையே செய்யுங்கள். Reset button வேலை செய்ய `handleReset`-ஐயும் update செய்ய மறக்க வேண்டாம்.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="முதல் பெயர்"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="கடைசி பெயர்"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>வணக்கம், {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset செய்</button>
    </form>
  );
}
```

```css
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Crash-ஐ fix செய்யுங்கள் {/*fix-a-crash*/}

பயனர் feedback விட அனுமதிக்க வேண்டிய small form இதோ. Feedback submit செய்யப்பட்டால் thank-you message காட்ட வேண்டும். ஆனால் இது "Rendered fewer hooks than expected" என்ற error message உடன் crash ஆகிறது. தவறை கண்டுபிடித்து fix செய்ய முடியுமா?

<Hint>

Hooks எங்கு call செய்யப்படலாம் என்பதில் ஏதேனும் limitations உள்ளனவா? இந்த component ஏதேனும் rules-ஐ break செய்கிறதா? Linter checks-ஐ disable செய்யும் comments ஏதேனும் உள்ளனவா என்று check செய்யுங்கள்--bugs அடிக்கடி மறையும் இடம் இதுதான்!

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [9]}}
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>நன்றி!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`அனுப்புகிறது: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="செய்தி"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">அனுப்பு</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Hooks component function-ன் top level-இல் மட்டுமே call செய்யப்படலாம். இங்கே, முதல் `isSent` definition இந்த rule-ஐ பின்பற்றுகிறது; ஆனால் `message` definition ஒரு condition-க்குள் nested ஆக உள்ளது.

Issue-ஐ fix செய்ய அதை condition-க்கு வெளியே நகர்த்துங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>நன்றி!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`அனுப்புகிறது: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="செய்தி"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">அனுப்பு</button>
      </form>
    );
  }
}
```

</Sandpack>

நினைவில் கொள்ளுங்கள்: Hooks unconditionally மற்றும் எப்போதும் அதே order-இல் call செய்யப்பட வேண்டும்!

Nesting-ஐ குறைக்க தேவையற்ற `else` branch-ஐயும் remove செய்யலாம். ஆனால் Hooks-க்கான எல்லா calls-உம் முதல் `return`-க்கு *முன்* நடக்க வேண்டும் என்பதும் இன்னும் முக்கியம்.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>நன்றி!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`அனுப்புகிறது: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="செய்தி"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">அனுப்பு</button>
    </form>
  );
}
```

</Sandpack>

இரண்டாவது `useState` call-ஐ `if` condition-க்கு பிறகு நகர்த்திப் பார்த்து, அது மீண்டும் எப்படி உடைகிறது என்பதை கவனிக்கவும்.

உங்கள் linter [React-க்காக configure செய்யப்பட்டிருந்தால்](/learn/editor-setup#linting), இப்படிப்பட்ட தவறு செய்தால் lint error பார்க்க வேண்டும். Faulty code-ஐ locally try செய்யும்போது error தெரியவில்லை என்றால், உங்கள் project-க்கு linting setup செய்ய வேண்டும்.

</Solution>

#### தேவையற்ற state-ஐ remove செய்யுங்கள் {/*remove-unnecessary-state*/}

Button click செய்தால், இந்த example பயனரின் பெயரை கேட்டு, அவரை greet செய்யும் alert காட்ட வேண்டும். பெயரை வைத்திருக்க state use செய்ய முயற்சித்துள்ளீர்கள், ஆனால் ஏதோ காரணத்தால் முதல் முறையில் "வணக்கம், !" என்று காட்டுகிறது; அதன் பிறகு ஒவ்வொரு முறையும் previous input உடன் "வணக்கம், [name]!" என்று காட்டுகிறது.

இந்த code-ஐ fix செய்ய, தேவையற்ற state variable-ஐ remove செய்யுங்கள். ([இது ஏன் வேலை செய்யவில்லை](/learn/state-as-a-snapshot) என்பதை பின்னர் விவாதிப்போம்.)

இந்த state variable ஏன் தேவையற்றது என்பதை விளக்க முடியுமா?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('உங்கள் பெயர் என்ன?'));
    alert(`வணக்கம், ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      வாழ்த்து
    </button>
  );
}
```

</Sandpack>

<Solution>

தேவைப்படும் function-இல் declare செய்யப்பட்ட regular `name` variable-ஐ use செய்யும் fixed version இதோ:

<Sandpack>

```js
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('உங்கள் பெயர் என்ன?');
    alert(`வணக்கம், ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      வாழ்த்து
    </button>
  );
}
```

</Sandpack>

ஒரு component-ன் re-renders இடையில் information-ஐ வைத்திருக்க மட்டுமே state variable தேவை. Single event handler-க்குள் regular variable போதுமானது. Regular variable நன்றாக வேலை செய்யும் போது state variables அறிமுகப்படுத்த வேண்டாம்.

</Solution>

</Challenges>
