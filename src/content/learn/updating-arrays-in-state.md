---
title: State-இல் Arrays-ஐ update செய்தல்
---

<Intro>

Arrays JavaScript-இல் mutable; ஆனால் அவற்றை state-இல் store செய்யும்போது immutable போல treat செய்ய வேண்டும். Objects போலவே, state-இல் store செய்யப்பட்ட array-ஐ update செய்ய விரும்பும்போது, புதிய array ஒன்றை create செய்ய வேண்டும் (அல்லது existing array-ன் copy உருவாக்க வேண்டும்), பின்னர் அந்த புதிய array-ஐ use செய்ய state set செய்ய வேண்டும்.

</Intro>

<YouWillLearn>

- React state-இல் array-க்குள் items-ஐ add, remove, அல்லது change செய்வது எப்படி
- Array-க்குள் உள்ள object-ஐ update செய்வது எப்படி
- Immer மூலம் array copying-ஐ குறைவாக repetitive ஆக்குவது எப்படி

</YouWillLearn>

## Mutation இல்லாமல் arrays-ஐ update செய்தல் {/*updating-arrays-without-mutation*/}

JavaScript-இல் arrays என்பது மற்றொரு வகை object. [Objects போலவே](/learn/updating-objects-in-state), **React state-இல் உள்ள arrays-ஐ read-only ஆக treat செய்ய வேண்டும்.** இதன் பொருள் `arr[0] = 'bird'` போல array-க்குள் items reassign செய்யக்கூடாது; மேலும் `push()` மற்றும் `pop()` போன்ற array-ஐ mutate செய்யும் methods use செய்யக்கூடாது.

அதற்கு பதிலாக, array update செய்யும் ஒவ்வொரு முறையும் உங்கள் state setting function-க்கு *புதிய* array pass செய்ய வேண்டும். அதற்கு, உங்கள் state-இல் உள்ள original array-இலிருந்து `filter()` மற்றும் `map()` போன்ற non-mutating methods call செய்து புதிய array create செய்யலாம். பின்னர் resulting new array-க்கு உங்கள் state set செய்யலாம்.

பொதுவான array operations-க்கான reference table இதோ. React state-க்குள் arrays-ஐ கையாளும்போது, இடது column-இல் உள்ள methods-ஐ தவிர்த்து, வலது column-இல் உள்ள methods-ஐ விரும்பி use செய்ய வேண்டும்:

|           | தவிர்க்கவும் (array-ஐ mutate செய்கிறது) | விரும்பவும் (புதிய array return செய்கிறது)                          |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| சேர்த்தல் | `push`, `unshift`                   | `concat`, `[...arr]` spread syntax ([example](#adding-to-an-array)) |
| நீக்குதல் | `pop`, `shift`, `splice`            | `filter`, `slice` ([example](#removing-from-an-array))              |
| மாற்றுதல் | `splice`, `arr[i] = ...` assignment | `map` ([example](#replacing-items-in-an-array))                     |
| sort செய்தல் | `reverse`, `sort`                | முதலில் array-ஐ copy செய்யவும் ([example](#making-other-changes-to-an-array)) |

மாற்றாக, இரு columns-இலிருந்தும் methods use செய்ய அனுமதிக்கும் [Immer use செய்யலாம்](#write-concise-update-logic-with-immer).

<Pitfall>

துரதிர்ஷ்டவசமாக, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) மற்றும் [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) ஒரே மாதிரி பெயரிடப்பட்டுள்ளன; ஆனால் மிகவும் வேறுபட்டவை:

* `slice` array அல்லது அதன் பகுதியை copy செய்ய அனுமதிக்கிறது.
* `splice` items insert அல்லது delete செய்ய array-ஐ **mutate** செய்கிறது.

React-இல், state-இல் objects அல்லது arrays mutate செய்ய வேண்டாம் என்பதால், `slice`-ஐ (`p` இல்லாமல்!) மிகவும் அதிகமாக use செய்வீர்கள். Mutation என்றால் என்ன, state-க்கு அது ஏன் பரிந்துரைக்கப்படவில்லை என்பதை [Objects update செய்தல்](/learn/updating-objects-in-state) விளக்குகிறது.

</Pitfall>

### Array-க்கு சேர்த்தல் {/*adding-to-an-array*/}

`push()` array-ஐ mutate செய்யும்; அதை நீங்கள் விரும்பமாட்டீர்கள்:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>ஊக்கமளிக்கும் சிற்பிகள்:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>சேர்</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

அதற்கு பதிலாக, existing items *மற்றும்* இறுதியில் புதிய item ஒன்றைக் கொண்ட *புதிய* array create செய்யுங்கள். இதை செய்ய பல வழிகள் உள்ளன; ஆனால் நேரடியானது `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) syntax use செய்வது:

```js
setArtists( // State-ஐ replace செய்க
  [ // புதிய array-ஆல்
    ...artists, // பழைய items அனைத்தையும் கொண்டது
    { id: nextId++, name: name } // மேலும் இறுதியில் ஒரு புதிய item
  ]
);
```

இப்போது இது சரியாக வேலை செய்கிறது:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>ஊக்கமளிக்கும் சிற்பிகள்:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>சேர்</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Array spread syntax, original `...artists`-க்கு *முன்* item-ஐ வைத்து prepend செய்யவும் அனுமதிக்கிறது:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // பழைய items-ஐ இறுதியில் வைக்கவும்
]);
```

இந்த முறையில், array இறுதியில் add செய்வதன் மூலம் `push()` செய்யும் வேலையையும், array தொடக்கத்தில் add செய்வதன் மூலம் `unshift()` செய்யும் வேலையையும் spread செய்ய முடியும். மேலுள்ள sandbox-இல் முயற்சிக்கவும்!

### Array-இலிருந்து நீக்குதல் {/*removing-from-an-array*/}

Array-இலிருந்து item ஒன்றை remove செய்ய நேரடியான வழி அதை *filter out* செய்வது. வேறு வார்த்தைகளில், அந்த item இல்லாத புதிய array ஒன்றை நீங்கள் produce செய்வீர்கள். இதை செய்ய `filter` method use செய்யுங்கள், உதாரணமாக:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>ஊக்கமளிக்கும் சிற்பிகள்:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              நீக்கு
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

"நீக்கு" button-ஐ சில முறை click செய்து, அதன் click handler-ஐ பாருங்கள்.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

இங்கே, `artists.filter(a => a.id !== artist.id)` என்பது "`artist.id`-இலிருந்து வேறுபட்ட IDs கொண்ட `artists` மட்டும் உள்ள array create செய்" என்று அர்த்தம். வேறு வார்த்தைகளில், ஒவ்வொரு artist-ன் "நீக்கு" button _அந்த_ artist-ஐ array-இலிருந்து filter out செய்து, resulting array உடன் re-render request செய்யும். `filter` original array-ஐ modify செய்யாது என்பதை கவனிக்கவும்.

### Array-ஐ transform செய்தல் {/*transforming-an-array*/}

Array-இல் சில அல்லது எல்லா items-ஐ change செய்ய விரும்பினால், **புதிய** array create செய்ய `map()` use செய்யலாம். `map`-க்கு pass செய்யும் function, ஒவ்வொரு item-க்கும் அதன் data அல்லது index (அல்லது இரண்டும்) அடிப்படையில் என்ன செய்ய வேண்டும் என்பதை decide செய்யலாம்.

இந்த example-இல், ஒரு array இரண்டு circles மற்றும் ஒரு square-ன் coordinates வைத்திருக்கிறது. Button அழுத்தும்போது, circles மட்டும் 50 pixels கீழே நகர்கின்றன. இது `map()` பயன்படுத்தி data-வின் புதிய array produce செய்வதன் மூலம் நடக்கிறது:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Circles-ஐ கீழே நகர்த்து!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Array-இல் items-ஐ replace செய்தல் {/*replacing-items-in-an-array*/}

Array-இல் ஒன்று அல்லது அதற்கு மேற்பட்ட items-ஐ replace செய்ய விரும்புவது மிகவும் common. `arr[0] = 'bird'` போன்ற assignments original array-ஐ mutate செய்கின்றன; எனவே இதற்கும் `map` use செய்ய வேண்டும்.

Item ஒன்றை replace செய்ய, `map` மூலம் புதிய array create செய்யுங்கள். உங்கள் `map` call-க்குள், இரண்டாவது argument ஆக item index கிடைக்கும். Original item-ஐ (முதல் argument) return செய்ய வேண்டுமா அல்லது வேறு ஏதாவது return செய்ய வேண்டுமா என்பதை decide செய்ய அதைப் பயன்படுத்துங்கள்:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Array-க்குள் insert செய்தல் {/*inserting-into-an-array*/}

சில நேரங்களில், தொடக்கமோ முடிவோ அல்லாத குறிப்பிட்ட position-இல் item ஒன்றை insert செய்ய விரும்பலாம். இதை செய்ய, `slice()` method உடன் `...` array spread syntax-ஐ use செய்யலாம். `slice()` method array-ன் ஒரு "slice"-ஐ cut செய்ய அனுமதிக்கிறது. Item insert செய்ய, insertion point-க்கு _முன்_ உள்ள slice-ஐ spread செய்து, பின்னர் new item-ஐ, அதன் பிறகு original array-ன் மீதியை சேர்த்த array create செய்வீர்கள்.

இந்த example-இல், Insert button எப்போதும் index `1`-இல் insert செய்கிறது:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // எந்த index-ஆகவும் இருக்கலாம்
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>ஊக்கமளிக்கும் சிற்பிகள்:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert செய்
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Array-க்கு மற்ற changes செய்தல் {/*making-other-changes-to-an-array*/}

Spread syntax மற்றும் `map()`/`filter()` போன்ற non-mutating methods மட்டும் கொண்டு செய்ய முடியாத சில விஷயங்கள் உள்ளன. உதாரணமாக, array-ஐ reverse அல்லது sort செய்ய விரும்பலாம். JavaScript `reverse()` மற்றும் `sort()` methods original array-ஐ mutate செய்கின்றன; எனவே அவற்றை நேரடியாக use செய்ய முடியாது.

**ஆனால், முதலில் array-ஐ copy செய்து, பிறகு அதில் changes செய்யலாம்.**

உதாரணமாக:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse செய்
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

இங்கே, முதலில் original array-ன் copy create செய்ய `[...list]` spread syntax use செய்கிறீர்கள். இப்போது copy இருப்பதால், `nextList.reverse()` அல்லது `nextList.sort()` போன்ற mutating methods use செய்யலாம்; அல்லது `nextList[0] = "something"` மூலம் individual items assign செய்யவும் முடியும்.

ஆனால், **array-ஐ copy செய்தாலும், அதற்குள் உள்ள existing items-ஐ நேரடியாக mutate செய்ய முடியாது.** காரணம் copying shallow--புதிய array original array-இல் உள்ள அதே items-ஐ கொண்டிருக்கும். எனவே copied array-க்குள் உள்ள object-ஐ modify செய்தால், existing state-ஐ mutate செய்கிறீர்கள். உதாரணமாக, இத்தகைய code பிரச்சினை.

```js
const nextList = [...list];
nextList[0].seen = true; // பிரச்சினை: list[0]-ஐ mutate செய்கிறது
setList(nextList);
```

`nextList` மற்றும் `list` இரண்டு வேறுபட்ட arrays என்றாலும், **`nextList[0]` மற்றும் `list[0]` அதே object-ஐ point செய்கின்றன.** எனவே `nextList[0].seen` மாற்றும்போது, `list[0].seen`-ஐயும் மாற்றுகிறீர்கள். இது state mutation; அதை தவிர்க்க வேண்டும்! [Nested JavaScript objects update செய்வது](/learn/updating-objects-in-state#updating-a-nested-object) போலவே, mutate செய்வதற்கு பதிலாக மாற்ற விரும்பும் individual items-ஐ copy செய்வதன் மூலம் இந்த issue-ஐ solve செய்யலாம். இதோ எப்படி:

## Arrays-க்குள் objects update செய்தல் {/*updating-objects-inside-arrays*/}

Objects _உண்மையில்_ arrays-க்குள் "inside" இல்லை. Code-இல் அவை "inside" இருப்பது போல தோன்றலாம்; ஆனால் array-இல் உள்ள ஒவ்வொரு object-உம் array "point" செய்யும் தனி value. அதனால்தான் `list[0]` போன்ற nested fields மாற்றும்போது கவனமாக இருக்க வேண்டும். மற்றொருவரின் artwork list அதே array element-ஐ point செய்யலாம்!

**Nested state update செய்யும்போது, update செய்ய விரும்பும் point-இலிருந்து top level வரை copies create செய்ய வேண்டும்.** இது எப்படி வேலை செய்கிறது என்று பார்ப்போம்.

இந்த example-இல், இரண்டு தனி artwork lists ஒரே initial state கொண்டுள்ளன. அவை isolated ஆக இருக்க வேண்டும்; ஆனால் mutation காரணமாக அவற்றின் state தவறுதலாக shared ஆகிறது, ஒரு list-இல் box check செய்வது மற்ற list-ஐ பாதிக்கிறது:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>கலை Bucket List</h1>
      <h2>நான் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>நீங்கள் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

பிரச்சினை இத்தகைய code-இல் உள்ளது:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // பிரச்சினை: existing item-ஐ mutate செய்கிறது
setMyList(myNextList);
```

`myNextList` array தானாகவே புதியது என்றாலும், *items தாமாகவே* original `myList` array-இல் இருந்தவையே. எனவே `artwork.seen` மாற்றுவது *original* artwork item-ஐ மாற்றுகிறது. அந்த artwork item `yourList`-இலும் உள்ளது; அதுவே bug-க்கு காரணம். இத்தகைய bugs பற்றி சிந்திப்பது கடினமாக இருக்கலாம்; ஆனால் state mutate செய்வதைத் தவிர்த்தால் அவை மறைந்துவிடும்.

**Mutation இல்லாமல் பழைய item-ஐ அதன் updated version-ஆக substitute செய்ய `map` use செய்யலாம்.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

இங்கே, `...` என்பது [object copy create செய்ய](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) use செய்யப்படும் object spread syntax.

இந்த approach உடன், existing state items எதுவும் mutate செய்யப்படாது; bug fix ஆகும்:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>கலை Bucket List</h1>
      <h2>நான் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>நீங்கள் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

பொதுவாக, **நீங்கள் இப்போதுதான் create செய்த objects-ஐ மட்டுமே mutate செய்ய வேண்டும்.** *புதிய* artwork insert செய்தால் அதை mutate செய்யலாம்; ஆனால் ஏற்கனவே state-இல் உள்ள ஒன்றை கையாளும்போது copy உருவாக்க வேண்டும்.

### Immer மூலம் concise update logic எழுதுதல் {/*write-concise-update-logic-with-immer*/}

Mutation இல்லாமல் nested arrays update செய்வது சிறிது repetitive ஆகலாம். [Objects போலவே](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- பொதுவாக, state-ஐ இரண்டு levels-ஐ விட ஆழமாக update செய்ய வேண்டிய அவசியம் இருக்கக்கூடாது. உங்கள் state objects மிக deep ஆக இருந்தால், அவை flat ஆக இருக்க [வேறு விதமாக restructure செய்ய](/learn/choosing-the-state-structure#avoid-deeply-nested-state) விரும்பலாம்.
- State structure-ஐ மாற்ற விரும்பவில்லை என்றால், convenient ஆனால் mutating syntax-ஐ பயன்படுத்தி எழுத அனுமதித்து copies produce செய்வதை உங்களுக்காக handle செய்யும் [Immer](https://github.com/immerjs/use-immer)-ஐ use செய்ய விரும்பலாம்.

கலை Bucket List example Immer உடன் rewrite செய்யப்பட்டு இதோ:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>கலை Bucket List</h1>
      <h2>நான் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>நீங்கள் பார்க்க வேண்டிய art list:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
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

</Sandpack>

Immer உடன் **`artwork.seen = nextSeen` போன்ற mutation இப்போது சரி** என்பதை கவனியுங்கள்:

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

காரணம், நீங்கள் _original_ state-ஐ mutate செய்யவில்லை; Immer provide செய்யும் special `draft` object-ஐ mutate செய்கிறீர்கள். அதேபோல், `draft`-ன் content-க்கு `push()` மற்றும் `pop()` போன்ற mutating methods apply செய்யலாம்.

Behind the scenes, நீங்கள் `draft`-க்கு செய்த changes அடிப்படையில் Immer எப்போதும் next state-ஐ scratch-இலிருந்து construct செய்கிறது. இதனால் state-ஐ ஒருபோதும் mutate செய்யாமல் உங்கள் event handlers மிகவும் concise ஆக இருக்கும்.

<Recap>

- Arrays-ஐ state-இல் வைக்கலாம்; ஆனால் அவற்றை மாற்ற முடியாது.
- Array-ஐ mutate செய்வதற்கு பதிலாக, அதன் *புதிய* version create செய்து state-ஐ அதற்கு update செய்யுங்கள்.
- புதிய items கொண்ட arrays create செய்ய `[...arr, newItem]` array spread syntax use செய்யலாம்.
- Filter செய்யப்பட்ட அல்லது transformed items கொண்ட புதிய arrays create செய்ய `filter()` மற்றும் `map()` use செய்யலாம்.
- உங்கள் code concise ஆக இருக்க Immer use செய்யலாம்.

</Recap>



<Challenges>

#### Shopping cart-இல் item ஒன்றை update செய்தல் {/*update-an-item-in-the-shopping-cart*/}

"+" அழுத்தும்போது corresponding number அதிகரிக்க `handleIncreaseClick` logic-ஐ நிரப்புங்கள்:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

புதிய array create செய்ய `map` function-ஐ use செய்து, பின்னர் புதிய array-க்காக changed object-ன் copy create செய்ய `...` object spread syntax-ஐ use செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Shopping cart-இலிருந்து item ஒன்றை remove செய்தல் {/*remove-an-item-from-the-shopping-cart*/}

இந்த shopping cart-இல் வேலை செய்யும் "+" button உள்ளது; ஆனால் "–" button எதையும் செய்யாது. அதை அழுத்தும்போது corresponding product-ன் `count` குறைய event handler சேர்க்க வேண்டும். Count 1 ஆக இருக்கும் போது "–" அழுத்தினால், product automatic ஆக cart-இலிருந்து remove ஆக வேண்டும். அது ஒருபோதும் 0 காட்டாததை உறுதி செய்யுங்கள்.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

முதலில் புதிய array produce செய்ய `map` use செய்து, பின்னர் `count` `0` ஆக set செய்யப்பட்ட products-ஐ remove செய்ய `filter` use செய்யலாம்:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Non-mutative methods பயன்படுத்தி mutations-ஐ fix செய்தல் {/*fix-the-mutations-using-non-mutative-methods*/}

இந்த example-இல், `App.js`-இல் உள்ள event handlers அனைத்தும் mutation use செய்கின்றன. அதன் விளைவாக, todos edit செய்வதும் delete செய்வதும் வேலை செய்யாது. Non-mutative methods use செய்ய `handleAddTodo`, `handleChangeTodo`, மற்றும் `handleDeleteTodo`-ஐ rewrite செய்யுங்கள்:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'பால் வாங்கு', done: true },
  { id: 1, title: 'டாகோ சாப்பிடு', done: false },
  { id: 2, title: 'டீ தயார் செய்', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Todo சேர்க்க"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        நீக்கு
      </button>
    </label>
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

`handleAddTodo`-இல் array spread syntax use செய்யலாம். `handleChangeTodo`-இல் `map` மூலம் புதிய array create செய்யலாம். `handleDeleteTodo`-இல் `filter` மூலம் புதிய array create செய்யலாம். இப்போது list சரியாக வேலை செய்கிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'பால் வாங்கு', done: true },
  { id: 1, title: 'டாகோ சாப்பிடு', done: false },
  { id: 2, title: 'டீ தயார் செய்', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Todo சேர்க்க"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Immer பயன்படுத்தி mutations-ஐ fix செய்தல் {/*fix-the-mutations-using-immer*/}

இது முந்தைய challenge-இல் இருந்த அதே example. இந்த முறை, Immer use செய்து mutations-ஐ fix செய்யுங்கள். வசதிக்காக `useImmer` ஏற்கனவே imported; எனவே `todos` state variable அதை use செய்யுமாறு மாற்ற வேண்டும்.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'பால் வாங்கு', done: true },
  { id: 1, title: 'டாகோ சாப்பிடு', done: false },
  { id: 2, title: 'டீ தயார் செய்', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Todo சேர்க்க"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer உடன், Immer உங்களுக்கு தரும் `draft` பகுதிகளை மட்டும் mutate செய்கிறவரை mutative fashion-இல் code எழுதலாம். இங்கே, mutations அனைத்தும் `draft` மீது perform செய்யப்படுகின்றன; எனவே code வேலை செய்கிறது:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'பால் வாங்கு', done: true },
  { id: 1, title: 'டாகோ சாப்பிடு', done: false },
  { id: 2, title: 'டீ தயார் செய்', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Todo சேர்க்க"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer உடன் mutative மற்றும் non-mutative approaches-ஐ mix and match செய்யவும் முடியும்.

உதாரணமாக, இந்த version-இல் `handleAddTodo` Immer `draft`-ஐ mutate செய்வதன் மூலம் implemented; ஆனால் `handleChangeTodo` மற்றும் `handleDeleteTodo` non-mutative `map` மற்றும் `filter` methods use செய்கின்றன:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'பால் வாங்கு', done: true },
  { id: 1, title: 'டாகோ சாப்பிடு', done: false },
  { id: 2, title: 'டீ தயார் செய்', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Todo சேர்க்க"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>சேர்</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          சேமி
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          திருத்து
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        நீக்கு
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer உடன், ஒவ்வொரு தனி case-க்கும் மிகவும் natural ஆக உணரப்படும் style-ஐ தேர்வு செய்யலாம்.

</Solution>

</Challenges>
