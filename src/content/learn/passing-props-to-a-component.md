---
title: Component-க்கு Props Pass செய்தல்
---

<Intro>

React components ஒருவருடன் ஒருவர் தொடர்பு கொள்ள *props* பயன்படுத்துகின்றன. ஒவ்வொரு parent component-மும் props கொடுத்து தனது child components-க்கு சில information pass செய்யலாம். Props உங்களுக்கு HTML attributes-ஐ நினைவூட்டலாம்; ஆனால் objects, arrays, functions உட்பட எந்த JavaScript value-யையும் அவற்றின் மூலம் pass செய்யலாம்.

</Intro>

<YouWillLearn>

* Component-க்கு props pass செய்வது எப்படி
* Component-இல் இருந்து props read செய்வது எப்படி
* Props-க்கு default values குறிப்பிடுவது எப்படி
* Component-க்கு சில JSX pass செய்வது எப்படி
* Props காலப்போக்கில் எப்படி மாறுகின்றன

</YouWillLearn>

## பழக்கமான props {/*familiar-props*/}

Props என்பது JSX tag-க்கு நீங்கள் pass செய்யும் information. உதாரணமாக, `className`, `src`, `alt`, `width`, மற்றும் `height` ஆகியவை `<img>`-க்கு pass செய்யக்கூடிய props-இல் சில:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

`<img>` tag-க்கு pass செய்யக்கூடிய props predefined ஆக உள்ளன (ReactDOM [HTML standard](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)-ஐ பின்பற்றுகிறது). ஆனால் `<Avatar>` போன்ற *உங்கள் சொந்த* components-ஐ customize செய்ய எந்த props-ஐயும் pass செய்யலாம். எப்படி என்று பார்ப்போம்!

## Component-க்கு props pass செய்தல் {/*passing-props-to-a-component*/}

இந்த code-இல், `Profile` component தனது child component ஆன `Avatar`-க்கு எந்த props-ஐயும் pass செய்யவில்லை:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

இரண்டு steps-இல் `Avatar`-க்கு சில props கொடுக்கலாம்.

### படி 1: Child component-க்கு props pass செய்யுங்கள் {/*step-1-pass-props-to-the-child-component*/}

முதலில், `Avatar`-க்கு சில props pass செய்யுங்கள். உதாரணமாக, இரண்டு props pass செய்வோம்: `person` (ஒரு object), மற்றும் `size` (ஒரு number):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

`person=`-க்கு பிறகு வரும் double curly braces குழப்பமாக இருந்தால், JSX curlies-க்குள் [அவை ஒரு object மட்டுமே](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) என்பதை நினைவில் கொள்ளுங்கள்.

</Note>

இப்போது `Avatar` component-க்குள் இந்த props-ஐ read செய்யலாம்.

### படி 2: Child component-க்குள் props read செய்யுங்கள் {/*step-2-read-props-inside-the-child-component*/}

`function Avatar`-க்கு நேரடியாக பிறகு `({` மற்றும் `})` உள்ளே, props பெயர்களான `person, size`-ஐ comma-களால் பிரித்து list செய்வதன் மூலம் இந்த props-ஐ read செய்யலாம். இது ஒரு variable போல `Avatar` code-க்குள் அவற்றைப் பயன்படுத்த அனுமதிக்கிறது.

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

Rendering-க்கு `person` மற்றும் `size` props பயன்படுத்தும் சில logic-ஐ `Avatar`-க்கு சேர்த்தால் முடிந்தது.

இப்போது வெவ்வேறு props கொண்டு பல வகையில் render செய்ய `Avatar`-ஐ configure செய்யலாம். Values-ஐ மாற்றிப் பார்த்து முயற்சிக்கவும்!

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Props, parent மற்றும் child components பற்றி தனித்தனியாக சிந்திக்க உதவுகின்றன. உதாரணமாக, `Avatar` அவற்றைப் பயன்படுத்தும் முறையைப் பற்றி சிந்திக்காமல் `Profile`-க்குள் `person` அல்லது `size` props-ஐ மாற்றலாம். அதேபோல், `Profile`-ஐ பார்க்காமல் `Avatar` இந்த props-ஐ எப்படி பயன்படுத்துகிறது என்பதை மாற்றலாம்.

Props-ஐ நீங்கள் adjust செய்யக்கூடிய "knobs" போல நினைக்கலாம். Functions-க்கு arguments செய்யும் வேலையே இவை செய்கின்றன--உண்மையில், props _தான்_ உங்கள் component-க்கு வரும் ஒரே argument! React component functions ஒரு `props` object என்ற single argument-ஐ accept செய்கின்றன:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

பொதுவாக முழு `props` object தேவையில்லை; எனவே அதை individual props ஆக destructure செய்வீர்கள்.

<Pitfall>

Props declare செய்யும்போது `(` மற்றும் `)` உள்ளே உள்ள **`{` மற்றும் `}` curlies ஜோடியை மறக்க வேண்டாம்**:

```js
function Avatar({ person, size }) {
  // ...
}
```

இந்த syntax ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) என்று அழைக்கப்படுகிறது; இது function parameter-இலிருந்து properties read செய்வதற்கு equivalent:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Prop-க்கு default value குறிப்பிடுதல் {/*specifying-a-default-value-for-a-prop*/}

Value specify செய்யப்படாதபோது fallback ஆக prop-க்கு default value கொடுக்க விரும்பினால், destructuring-இல் parameter-க்கு உடனே பிறகு `=` மற்றும் default value வை வைத்து செய்யலாம்:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

இப்போது, `<Avatar person={...} />` `size` prop இல்லாமல் render செய்யப்பட்டால், `size` `100` ஆக set செய்யப்படும்.

Default value, `size` prop missing ஆக இருந்தால் அல்லது `size={undefined}` pass செய்தால் மட்டுமே பயன்படுத்தப்படும். ஆனால் `size={null}` அல்லது `size={0}` pass செய்தால், default value **பயன்படுத்தப்படாது**.

## JSX spread syntax மூலம் props forwarding {/*forwarding-props-with-the-jsx-spread-syntax*/}

சில நேரங்களில் props pass செய்வது மிகவும் repetitive ஆகிவிடும்:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Repetitive code-இல் தவறு எதுவும் இல்லை--அது அதிகம் legible ஆக இருக்கலாம். ஆனால் சில நேரங்களில் conciseness-ஐ நீங்கள் விரும்பலாம். சில components தங்கள் props அனைத்தையும் children-க்கு forward செய்கின்றன; இந்த `Profile` `Avatar`-க்கு செய்வது போல. அவை தங்கள் props எதையும் நேரடியாக பயன்படுத்தவில்லை என்பதால், மேலும் concise ஆன "spread" syntax பயன்படுத்துவது பொருத்தமாக இருக்கலாம்:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

இது `Profile`-ன் அனைத்து props-ஐயும் அவற்றின் பெயர்களை ஒவ்வொன்றாக list செய்யாமல் `Avatar`-க்கு forward செய்கிறது.

**Spread syntax-ஐ கட்டுப்பாட்டுடன் பயன்படுத்துங்கள்.** ஒவ்வொரு மற்ற component-இலும் அதை பயன்படுத்துகிறீர்கள் என்றால், ஏதோ தவறு இருக்கிறது. பெரும்பாலும், நீங்கள் components-ஐ split செய்து children-ஐ JSX ஆக pass செய்ய வேண்டும் என்பதைக் குறிக்கிறது. அதைப் பற்றி அடுத்து பார்க்கலாம்!

## JSX-ஐ children ஆக pass செய்தல் {/*passing-jsx-as-children*/}

Built-in browser tags-ஐ nest செய்வது பொதுவானது:

```js
<div>
  <img />
</div>
```

சில நேரங்களில் உங்கள் சொந்த components-ஐயும் இதேபோல் nest செய்ய விரும்புவீர்கள்:

```js
<Card>
  <Avatar />
</Card>
```

ஒரு JSX tag-க்குள் content-ஐ nest செய்தால், parent component அந்த content-ஐ `children` என்ற prop-இல் receive செய்யும். உதாரணமாக, கீழுள்ள `Card` component `<Avatar />` ஆக set செய்யப்பட்ட `children` prop-ஐ receive செய்து, wrapper div-இல் அதை render செய்யும்:

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

`Card`-க்குள் உள்ள `<Avatar>`-ஐ சில text-ஆக replace செய்து, `Card` component எந்த nested content-ஐயும் wrap செய்ய முடியும் என்பதைப் பாருங்கள். அதன் உள்ளே என்ன render ஆகிறது என்பதை அது "தெரிந்திருக்க" வேண்டியதில்லை. இந்த flexible pattern-ஐ பல இடங்களில் காண்பீர்கள்.

`children` prop கொண்ட component-ஐ, அதன் parent components arbitrary JSX கொண்டு "fill in" செய்யக்கூடிய "hole" வைத்திருப்பது போல நினைக்கலாம். Panels, grids போன்ற visual wrappers-க்கு `children` prop-ஐ அடிக்கடி பயன்படுத்துவீர்கள்.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Text மற்றும் Avatar போன்ற "children" pieces-க்கான slot உடைய puzzle போல Card tile' />

## Props காலப்போக்கில் எப்படி மாறுகின்றன {/*how-props-change-over-time*/}

கீழுள்ள `Clock` component தனது parent component-இலிருந்து இரண்டு props receive செய்கிறது: `color` மற்றும் `time`. (Parent component-ன் code omit செய்யப்பட்டுள்ளது, ஏனெனில் அது [state](/learn/state-a-components-memory) பயன்படுத்துகிறது; அதில் இப்போது ஆழமாகப் போகமாட்டோம்.)

கீழுள்ள select box-இல் color-ஐ மாற்றிப் பாருங்கள்:

<Sandpack>

```js src/Clock.js active
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
        ஒரு color தேர்வு செய்க:{' '}
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

இந்த example, **ஒரு component காலப்போக்கில் வெவ்வேறு props receive செய்யலாம்** என்பதை காட்டுகிறது. Props எப்போதும் static அல்ல! இங்கே, `time` prop ஒவ்வொரு second-மும் மாறுகிறது, `color` prop நீங்கள் வேறு color select செய்தால் மாறுகிறது. Props, தொடக்கத்தில் மட்டும் அல்லாமல் எந்த நேரத்திலும் component-ன் data-வை reflect செய்கின்றன.

ஆனால் props [immutable](https://en.wikipedia.org/wiki/Immutable_object)--computer science-இல் "மாற்ற முடியாதது" என்று பொருள் கொண்ட term. Component தனது props-ஐ மாற்ற வேண்டியிருந்தால் (உதாரணமாக, user interaction அல்லது new data-க்கு response ஆக), அது parent component-இடம் _வேறு props_--புதிய object--pass செய்ய "கேட்க" வேண்டும்! அதன் பழைய props பிறகு aside செய்யப்படும்; இறுதியில் JavaScript engine அவை எடுத்த memory-ஐ reclaim செய்யும்.

**"Props-ஐ change செய்ய" முயலாதீர்கள்.** User input-க்கு respond செய்ய வேண்டியபோது (selected color மாற்றுவது போன்றது), நீங்கள் "state set" செய்ய வேண்டும்; இதைப் பற்றி [State: A Component's Memory.](/learn/state-a-components-memory)-இல் கற்றுக்கொள்ளலாம்.

<Recap>

* Props pass செய்ய, HTML attributes போலவே அவற்றை JSX-க்கு சேர்க்கவும்.
* Props read செய்ய, `function Avatar({ person, size })` destructuring syntax பயன்படுத்தவும்.
* `size = 100` போன்ற default value குறிப்பிடலாம்; இது missing மற்றும் `undefined` props-க்கு பயன்படுத்தப்படும்.
* `<Avatar {...props} />` JSX spread syntax மூலம் அனைத்து props-ஐ forward செய்யலாம், ஆனால் அதிகமாக பயன்படுத்த வேண்டாம்!
* `<Card><Avatar /></Card>` போன்ற nested JSX, `Card` component-ன் `children` prop ஆக தோன்றும்.
* Props என்பது காலத்திலான read-only snapshots: ஒவ்வொரு render-மும் props-ன் புதிய version receive செய்கிறது.
* Props-ஐ change செய்ய முடியாது. Interactivity தேவைப்படும்போது, state set செய்ய வேண்டும்.

</Recap>



<Challenges>

#### Component ஒன்றை extract செய்யுங்கள் {/*extract-a-component*/}

இந்த `Gallery` component இரண்டு profiles-க்கு மிகவும் ஒத்த markup கொண்டுள்ளது. Duplication-ஐ குறைக்க அதிலிருந்து `Profile` component ஒன்றை extract செய்யுங்கள். அதற்கு எந்த props pass செய்ய வேண்டும் என்பதை நீங்கள் தேர்வு செய்ய வேண்டும்.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>குறிப்பிடத்தக்க விஞ்ஞானிகள்</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>தொழில்: </b>
            physicist மற்றும் chemist
          </li>
          <li>
            <b>விருதுகள்: 4 </b>
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>கண்டுபிடித்தது: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>தொழில்: </b>
            geochemist
          </li>
          <li>
            <b>விருதுகள்: 2 </b>
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>கண்டுபிடித்தது: </b>
            seawater-இல் carbon dioxide அளவிடும் method
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

Scientists-இல் ஒருவருக்கான markup-ஐ extract செய்வதிலிருந்து தொடங்குங்கள். பிறகு second example-இல் அதோடு match ஆகாத pieces-ஐ கண்டுபிடித்து, அவற்றை props மூலம் configurable ஆக்குங்கள்.

</Hint>

<Solution>

இந்த solution-இல், `Profile` component பல props accept செய்கிறது: `imageId` (string), `name` (string), `profession` (string), `awards` (strings array), `discovery` (string), மற்றும் `imageSize` (number).

`imageSize` prop-க்கு default value உள்ளது; அதனால்தான் அதை component-க்கு pass செய்யவில்லை என்பதை கவனியுங்கள்.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>தொழில்:</b> {profession}</li>
        <li>
          <b>விருதுகள்: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>கண்டுபிடித்தது: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>குறிப்பிடத்தக்க விஞ்ஞானிகள்</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist மற்றும் chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="seawater-இல் carbon dioxide அளவிடும் method"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

`awards` array ஆக இருந்தால் தனி `awardCount` prop தேவையில்லை என்பதை கவனியுங்கள். அப்போது awards எண்ணிக்கையை count செய்ய `awards.length` பயன்படுத்தலாம். Props எந்த values-ஐயும் எடுக்க முடியும்; அதில் arrays-உம் அடங்கும் என்பதை நினைவில் கொள்ளுங்கள்!

இந்த page-இல் முந்தைய examples-க்கு மேலும் ஒத்த மற்றொரு solution: ஒரு person பற்றிய அனைத்து information-ஐ single object-இல் group செய்து, அந்த object-ஐ ஒரு prop ஆக pass செய்வது:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>தொழில்:</b> {person.profession}
        </li>
        <li>
          <b>விருதுகள்: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>கண்டுபிடித்தது: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>குறிப்பிடத்தக்க விஞ்ஞானிகள்</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist மற்றும் chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'seawater-இல் carbon dioxide அளவிடும் method',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

JSX attributes collection-ஐ விட JavaScript object-ன் properties-ஐ describe செய்கிறீர்கள் என்பதால் syntax கொஞ்சம் வேறுபட்டதாகத் தோன்றினாலும், இந்த examples பெரும்பாலும் equivalent; நீங்கள் எந்த approach-ஐ வேண்டுமானாலும் தேர்வு செய்யலாம்.

</Solution>

#### Prop அடிப்படையில் image size-ஐ adjust செய்யுங்கள் {/*adjust-the-image-size-based-on-a-prop*/}

இந்த example-இல், `Avatar` numeric `size` prop receive செய்கிறது; அது `<img>` width மற்றும் height-ஐ தீர்மானிக்கிறது. இந்த example-இல் `size` prop `40` ஆக set செய்யப்பட்டுள்ளது. ஆனால் image-ஐ புதிய tab-இல் open செய்தால், image தானாகவே பெரியது (`160` pixels) என்பதை கவனிப்பீர்கள். உண்மையான image size, நீங்கள் request செய்யும் thumbnail size-ஐப் பொறுத்து தீர்மானிக்கப்படுகிறது.

`size` prop அடிப்படையில் closest image size request செய்ய `Avatar` component-ஐ மாற்றுங்கள். குறிப்பாக, `size` `90`-க்கு குறைவாக இருந்தால், `getImageUrl` function-க்கு `'b'` ("big")-க்கு பதிலாக `'s'` ("small") pass செய்யுங்கள். `size` prop-க்கு வெவ்வேறு values கொண்ட avatars render செய்து images-ஐ புதிய tab-இல் open செய்து உங்கள் changes வேலை செய்கிறதா verify செய்யுங்கள்.

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{
        name: 'Gregorio Y. Zara',
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

இதை இப்படிச் செய்யலாம்:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

[`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)-ஐ கருத்தில் கொண்டு high DPI screens-க்கு sharper image-ஐயும் காட்டலாம்:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{
          name: 'Gregorio Y. Zara',
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Props, இதுபோன்ற logic-ஐ `Avatar` component-க்குள் encapsulate செய்ய (தேவையானால் பின்னர் மாற்றவும்) அனுமதிக்கின்றன; இதனால் அனைவரும் images எப்படி request மற்றும் resize செய்யப்படுகின்றன என்று யோசிக்காமல் `<Avatar>` component-ஐ பயன்படுத்த முடியும்.

</Solution>

#### `children` prop-இல் JSX pass செய்தல் {/*passing-jsx-in-a-children-prop*/}

கீழுள்ள markup-இலிருந்து `Card` component ஒன்றை extract செய்து, அதற்கு வெவ்வேறு JSX pass செய்ய `children` prop-ஐ பயன்படுத்துங்கள்:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>புகைப்படம்</h1>
          <img
            className="avatar"
            src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>பற்றி</h1>
          <p>Aklilu Lemma schistosomiasis-க்கு இயற்கை சிகிச்சையை கண்டுபிடித்த சிறப்புமிக்க Ethiopian scientist ஆவார்.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Component tag-க்குள் நீங்கள் வைக்கும் எந்த JSX-மும் அந்த component-க்கு `children` prop ஆக pass செய்யப்படும்.

</Hint>

<Solution>

இரண்டு இடங்களிலும் `Card` component-ஐ இப்படிப் பயன்படுத்தலாம்:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>புகைப்படம்</h1>
        <img
          className="avatar"
          src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>பற்றி</h1>
        <p>Aklilu Lemma schistosomiasis-க்கு இயற்கை சிகிச்சையை கண்டுபிடித்த சிறப்புமிக்க Ethiopian scientist ஆவார்.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

ஒவ்வொரு `Card`-க்கும் எப்போதும் title இருக்க வேண்டும் என்று விரும்பினால், `title`-ஐ separate prop ஆகவும் செய்யலாம்:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="புகைப்படம்">
        <img
          className="avatar"
          src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="பற்றி">
        <p>Aklilu Lemma schistosomiasis-க்கு இயற்கை சிகிச்சையை கண்டுபிடித்த சிறப்புமிக்க Ethiopian scientist ஆவார்.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
