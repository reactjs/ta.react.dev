---
title: Events-க்கு பதிலளித்தல்
---

<Intro>

உங்கள் JSX-க்கு *event handlers* சேர்க்க React அனுமதிக்கிறது. Event handlers என்பது clicking, hovering, form inputs-ஐ focusing செய்வது போன்ற interactions-க்கு பதிலாக trigger ஆகும் உங்கள் சொந்த functions.

</Intro>

<YouWillLearn>

* Event handler எழுதும் வெவ்வேறு வழிகள்
* Parent component-இலிருந்து event handling logic-ஐ எப்படி pass செய்வது
* Events எப்படி propagate ஆகின்றன மற்றும் அவற்றை எப்படி stop செய்வது

</YouWillLearn>

## Event handlers சேர்த்தல் {/*adding-event-handlers*/}

Event handler சேர்க்க, முதலில் ஒரு function-ஐ define செய்து, பின்னர் அதை பொருத்தமான JSX tag-க்கு [prop ஆக pass](/learn/passing-props-to-a-component) செய்வீர்கள். உதாரணமாக, இன்னும் எதையும் செய்யாத button ஒன்று இங்கே:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      நான் எதையும் செய்யவில்லை
    </button>
  );
}
```

</Sandpack>

User click செய்தால் ஒரு message காட்ட, இந்த மூன்று படிகளைப் பின்பற்றலாம்:

1. உங்கள் `Button` component-க்குள் `handleClick` எனும் function-ஐ declare செய்யுங்கள்.
2. அந்த function-க்குள் logic-ஐ implement செய்யுங்கள் (message காட்ட `alert` பயன்படுத்துங்கள்).
3. `<button>` JSX-க்கு `onClick={handleClick}` சேர்க்குங்கள்.

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('நீங்கள் என்னை click செய்தீர்கள்!');
  }

  return (
    <button onClick={handleClick}>
      என்னை click செய்க
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

நீங்கள் `handleClick` function-ஐ define செய்து, பின்னர் அதை `<button>`-க்கு [prop ஆக pass](/learn/passing-props-to-a-component) செய்தீர்கள். `handleClick` ஒரு **event handler.** Event handler functions:

* பொதுவாக உங்கள் components-க்குள் define செய்யப்படும்.
* `handle` என்று தொடங்கி, அதன் பின் event பெயர் வரும் names கொண்டிருக்கும்.

Convention படி, event handlers-க்கு `handle` தொடர்ந்து event name வரும் பெயர் வைப்பது பொதுவானது. `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}` போன்றவற்றை அடிக்கடி காண்பீர்கள்.

மாற்றாக, JSX-க்குள் inline ஆக event handler define செய்யலாம்:

```jsx
<button onClick={function handleClick() {
  alert('நீங்கள் என்னை click செய்தீர்கள்!');
}}>
```

அல்லது, இன்னும் சுருக்கமாக arrow function பயன்படுத்தலாம்:

```jsx
<button onClick={() => {
  alert('நீங்கள் என்னை click செய்தீர்கள்!');
}}>
```

இந்த styles அனைத்தும் equivalent. Short functions-க்கு inline event handlers வசதியானவை.

<Pitfall>

Event handlers-க்கு pass செய்யப்படும் functions pass செய்யப்பட வேண்டும்; call செய்யப்படக்கூடாது. உதாரணமாக:

| function pass செய்வது (சரி)       | function call செய்வது (தவறு)       |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

வேறுபாடு நுட்பமானது. முதல் example-இல், `handleClick` function `onClick` event handler ஆக pass செய்யப்படுகிறது. இதனால் அதை React நினைவில் வைத்திருந்து, user button-ஐ click செய்தால் மட்டுமே உங்கள் function-ஐ call செய்யும்.

இரண்டாவது example-இல், `handleClick()` முடிவில் உள்ள `()` clicks இல்லாமலேயே [rendering](/learn/render-and-commit) போது function-ஐ *உடனடியாக* fire செய்கிறது. ஏனெனில் [JSX `{` மற்றும் `}`](/learn/javascript-in-jsx-with-curly-braces)-க்குள் உள்ள JavaScript உடனே execute ஆகிறது.

Inline ஆக code எழுதும்போது, அதே pitfall வேறு வடிவில் தோன்றும்:

| function pass செய்வது (சரி)              | function call செய்வது (தவறு)      |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


இப்படி inline code pass செய்தால் click போது fire ஆகாது--component render ஆகும் ஒவ்வொரு முறையும் fire ஆகும்:

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('நீங்கள் என்னை click செய்தீர்கள்!')}>
```

உங்கள் event handler-ஐ inline ஆக define செய்ய விரும்பினால், அதை anonymous function-க்குள் wrap செய்யுங்கள்:

```jsx
<button onClick={() => alert('நீங்கள் என்னை click செய்தீர்கள்!')}>
```

ஒவ்வொரு render-இலும் உள்ள code-ஐ execute செய்வதற்கு பதிலாக, இது பின்னர் call செய்யப்பட வேண்டிய function ஒன்றை உருவாக்குகிறது.

இரண்டு cases-லுமே, நீங்கள் pass செய்ய விரும்புவது ஒரு function:

* `<button onClick={handleClick}>` `handleClick` function-ஐ pass செய்கிறது.
* `<button onClick={() => alert('...')}>` `() => alert('...')` function-ஐ pass செய்கிறது.

[Arrow functions பற்றி மேலும் படிக்கவும்.](https://javascript.info/arrow-functions-basics)

</Pitfall>

### Event handlers-இல் props-ஐ வாசித்தல் {/*reading-props-in-event-handlers*/}

Event handlers ஒரு component-க்குள் declared செய்யப்படுவதால், அவற்றுக்கு அந்த component-ன் props access இருக்கும். Click செய்தால் தனது `message` prop உடன் alert காட்டும் button இதோ:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="இயக்கப்படுகிறது!">
        Movie-ஐ இயக்கு
      </AlertButton>
      <AlertButton message="Upload செய்யப்படுகிறது!">
        Image-ஐ upload செய்
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

இதனால் இந்த இரண்டு buttons வெவ்வேறு messages காட்ட முடியும். அவற்றுக்கு pass செய்யப்பட்ட messages-ஐ மாற்றிப் பாருங்கள்.

### Event handlers-ஐ props ஆக pass செய்தல் {/*passing-event-handlers-as-props*/}

Parent component ஒரு child-ன் event handler-ஐ specify செய்ய வேண்டும் என்பது அடிக்கடி வரும். Buttons-ஐ எடுத்துக்கொள்ளுங்கள்: `Button` component-ஐ எங்கு பயன்படுத்துகிறீர்கள் என்பதைப் பொறுத்து வேறு function execute செய்ய விரும்பலாம்--ஒன்று movie play செய்யலாம், மற்றொன்று image upload செய்யலாம்.

இதைக் செய்ய, component தனது parent-இலிருந்து பெறும் prop-ஐ event handler ஆக இதுபோல் pass செய்யுங்கள்:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`${movieName} இயக்கப்படுகிறது!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      "{movieName}"-ஐ இயக்கு
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Upload செய்யப்படுகிறது!')}>
      Image-ஐ upload செய்
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

இங்கே, `Toolbar` component ஒரு `PlayButton` மற்றும் ஒரு `UploadButton`-ஐ render செய்கிறது:

- `PlayButton` உள்ளே உள்ள `Button`-க்கு `handlePlayClick`-ஐ `onClick` prop ஆக pass செய்கிறது.
- `UploadButton` உள்ளே உள்ள `Button`-க்கு `() => alert('Upload செய்யப்படுகிறது!')`-ஐ `onClick` prop ஆக pass செய்கிறது.

இறுதியாக, உங்கள் `Button` component `onClick` எனும் prop-ஐ ஏற்கிறது. அது அந்த prop-ஐ built-in browser `<button>`-க்கு `onClick={onClick}` உடன் நேரடியாக pass செய்கிறது. இதனால் click போது pass செய்யப்பட்ட function-ஐ call செய்ய React-க்கு தெரியும்.

நீங்கள் [design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) பயன்படுத்தினால், buttons போன்ற components styling-ஐ கொண்டிருப்பதும் behavior-ஐ specify செய்யாததும் பொதுவானது. அதற்கு பதிலாக, `PlayButton` மற்றும் `UploadButton` போன்ற components event handlers-ஐ கீழே pass செய்யும்.

### Event handler props-க்கு பெயர் வைப்பது {/*naming-event-handler-props*/}

`<button>` மற்றும் `<div>` போன்ற built-in components, `onClick` போன்ற [browser event names](/reference/react-dom/components/common#common-props)-ஐ மட்டுமே support செய்கின்றன. ஆனால் நீங்கள் உங்கள் சொந்த components கட்டும்போது, அவற்றின் event handler props-க்கு உங்களுக்கு விருப்பமான எந்தப் பெயரையும் வைக்கலாம்.

Convention படி, event handler props `on` என்று தொடங்கி, அதன் பின் capital letter வர வேண்டும்.

உதாரணமாக, `Button` component-ன் `onClick` prop-க்கு `onSmash` என்று பெயர் வைத்திருக்கலாம்:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('இயக்கப்படுகிறது!')}>
        Movie-ஐ இயக்கு
      </Button>
      <Button onSmash={() => alert('Upload செய்யப்படுகிறது!')}>
        Image-ஐ upload செய்
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

இந்த example-இல், browser `<button>` (lowercase) இன்னும் `onClick` எனும் prop-ஐத் தேவைப்படுகின்றது என்பதை `<button onClick={onSmash}>` காட்டுகிறது. ஆனால் உங்கள் custom `Button` component பெறும் prop name உங்கள் விருப்பம்!

உங்கள் component பல interactions-ஐ support செய்தால், app-specific concepts-ஐ வைத்து event handler props-க்கு பெயர் வைக்கலாம். உதாரணமாக, இந்த `Toolbar` component `onPlayMovie` மற்றும் `onUploadImage` event handlers-ஐப் பெறுகிறது:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('இயக்கப்படுகிறது!')}
      onUploadImage={() => alert('Upload செய்யப்படுகிறது!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Movie-ஐ இயக்கு
      </Button>
      <Button onClick={onUploadImage}>
        Image-ஐ upload செய்
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`App` component, `Toolbar` `onPlayMovie` அல்லது `onUploadImage` கொண்டு *என்ன* செய்யும் என்பதை அறிய தேவையில்லை என்பதை கவனியுங்கள். அது `Toolbar`-ன் implementation detail. இங்கே, `Toolbar` அவற்றை தனது `Button`s-க்கு `onClick` handlers ஆக கீழே pass செய்கிறது; ஆனால் பின்னர் keyboard shortcut-இலும் அவற்றை trigger செய்யலாம். `onPlayMovie` போன்ற app-specific interactions பெயர்களை props-க்கு வைப்பது, அவை பின்னர் எப்படி பயன்படுத்தப்படுகின்றன என்பதை மாற்றும் flexibility-யை உங்களுக்கு வழங்குகிறது.

<Note>

உங்கள் event handlers-க்கு பொருத்தமான HTML tags-ஐ பயன்படுத்துகிறீர்கள் என்பதை உறுதி செய்யுங்கள். உதாரணமாக, clicks handle செய்ய, `<div onClick={handleClick}>`-க்கு பதிலாக [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)-ஐ பயன்படுத்துங்கள். உண்மையான browser `<button>` பயன்படுத்துவது keyboard navigation போன்ற built-in browser behaviors-ஐ enable செய்கிறது. Button-ன் default browser styling பிடிக்கவில்லை என்றால், அதை link அல்லது வேறு UI element போல தோற்றமளிக்க CSS மூலம் செய்யலாம். [Accessible markup எழுதுவது பற்றி மேலும் அறிக.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</Note>

## Event propagation {/*event-propagation*/}

Event handlers, உங்கள் component-க்கு இருக்கக்கூடிய எந்த children-இலிருந்தும் events-ஐ catch செய்யும். ஒரு event tree-யில் மேலே "bubbles" அல்லது "propagates" ஆகிறது என்று சொல்வோம்: event நடந்த இடத்திலிருந்து தொடங்கி tree-யில் மேலே செல்கிறது.

இந்த `<div>` இரண்டு buttons-ஐ கொண்டுள்ளது. `<div>` *மற்றும்* ஒவ்வொரு button-க்கும் தனி `onClick` handlers உள்ளன. Button ஒன்றை click செய்தால் எந்த handlers fire ஆகும் என்று நினைக்கிறீர்கள்?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('நீங்கள் toolbar-ஐ click செய்தீர்கள்!');
    }}>
      <button onClick={() => alert('இயக்கப்படுகிறது!')}>
        Movie-ஐ இயக்கு
      </button>
      <button onClick={() => alert('Upload செய்யப்படுகிறது!')}>
        Image-ஐ upload செய்
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

ஏதாவது button-ஐ click செய்தால், முதலில் அதன் `onClick` run ஆகும்; அதன் பின் parent `<div>`-ன் `onClick` run ஆகும். எனவே இரண்டு messages தோன்றும். Toolbar-ஐத் தானே click செய்தால், parent `<div>`-ன் `onClick` மட்டும் run ஆகும்.

<Pitfall>

React-இல் அனைத்து events-மும் propagate ஆகும்; `onScroll` மட்டும் விதிவிலக்கு, அது நீங்கள் attach செய்த JSX tag-இல் மட்டுமே வேலை செய்யும்.

</Pitfall>

### Propagation-ஐ நிறுத்துதல் {/*stopping-propagation*/}

Event handlers தங்கள் ஒரே argument ஆக **event object**-ஐப் பெறுகின்றன. Convention படி, அது பொதுவாக `e` என்று அழைக்கப்படுகிறது; அது "event" என்பதைக் குறிக்கும். Event பற்றிய தகவலை வாசிக்க இந்த object-ஐ பயன்படுத்தலாம்.

அந்த event object propagation-ஐ stop செய்யவும் அனுமதிக்கிறது. Event parent components-ஐ அடையாமல் தடுக்க விரும்பினால், இந்த `Button` component செய்வது போல `e.stopPropagation()` call செய்ய வேண்டும்:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('நீங்கள் toolbar-ஐ click செய்தீர்கள்!');
    }}>
      <Button onClick={() => alert('இயக்கப்படுகிறது!')}>
        Movie-ஐ இயக்கு
      </Button>
      <Button onClick={() => alert('Upload செய்யப்படுகிறது!')}>
        Image-ஐ upload செய்
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Button ஒன்றை click செய்தால்:

1. `<button>`-க்கு pass செய்யப்பட்ட `onClick` handler-ஐ React call செய்கிறது.
2. `Button`-இல் defined செய்யப்பட்ட அந்த handler, பின்வருவன செய்கிறது:
   * `e.stopPropagation()`-ஐ call செய்து, event மேலும் bubble ஆகாமல் தடுக்கிறது.
   * `Toolbar` component-இலிருந்து prop ஆக pass செய்யப்பட்ட `onClick` function-ஐ call செய்கிறது.
3. `Toolbar` component-இல் defined செய்யப்பட்ட அந்த function, button-ன் சொந்த alert-ஐ display செய்கிறது.
4. Propagation stop செய்யப்பட்டதால், parent `<div>`-ன் `onClick` handler run ஆகாது.

`e.stopPropagation()`-ன் விளைவாக, buttons-ஐ click செய்தால் இப்போது இரண்டு alerts-க்கு பதிலாக (`<button>` மற்றும் parent toolbar `<div>`-இலிருந்து), ஒரு alert மட்டும் (`<button>`-இலிருந்து) காட்டும். Button click செய்வது surrounding toolbar click செய்வதற்கு சமமல்ல; எனவே இந்த UI-க்கு propagation-ஐ stop செய்வது பொருத்தமானது.

<DeepDive>

#### Capture phase events {/*capture-phase-events*/}

அரிதான cases-இல், child elements-இல் உள்ள அனைத்து events-ஐயும், *அவை propagation stop செய்திருந்தாலும்* catch செய்ய வேண்டியிருக்கும். உதாரணமாக, propagation logic எப்படியிருந்தாலும் ஒவ்வொரு click-ஐயும் analytics-க்கு log செய்ய விரும்பலாம். Event name-ன் முடிவில் `Capture` சேர்ப்பதன் மூலம் இதைச் செய்யலாம்:

```js
<div onClickCapture={() => { /* இது முதலில் run ஆகும் */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

ஒவ்வொரு event-மும் மூன்று phases-இல் propagate ஆகிறது:

1. அது கீழே பயணித்து, அனைத்து `onClickCapture` handlers-ஐ call செய்கிறது.
2. Click செய்யப்பட்ட element-ன் `onClick` handler-ஐ run செய்கிறது.
3. அது மேலே பயணித்து, அனைத்து `onClick` handlers-ஐ call செய்கிறது.

Capture events routers அல்லது analytics போன்ற code-க்கு பயனுள்ளவை; ஆனால் app code-இல் அவற்றை நீங்கள் பெரும்பாலும் பயன்படுத்தமாட்டீர்கள்.

</DeepDive>

### Propagation-க்கு மாற்றாக handlers-ஐ pass செய்தல் {/*passing-handlers-as-alternative-to-propagation*/}

இந்த click handler ஒரு வரி code-ஐ run செய்து _பிறகு_ parent pass செய்த `onClick` prop-ஐ call செய்வதை கவனியுங்கள்:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Parent `onClick` event handler-ஐ call செய்வதற்கு முன் இந்த handler-க்கு இன்னும் code சேர்க்கலாம். இந்த pattern propagation-க்கு ஒரு *alternative* வழங்குகிறது. இது child component event-ஐ handle செய்ய அனுமதிக்கிறது; அதே சமயம் parent component கூடுதல் behavior ஒன்றை specify செய்யவும் அனுமதிக்கிறது. Propagation போல இது automatic அல்ல. ஆனால் இந்த pattern-ன் நன்மை, event ஒன்றின் விளைவாக execute ஆகும் code chain முழுவதையும் தெளிவாகப் பின்தொடர முடியும் என்பதுதான்.

நீங்கள் propagation-ஐ சார்ந்து, எந்த handlers ஏன் execute ஆகின்றன என்பதை trace செய்வது கடினமாக இருந்தால், இந்த அணுகுமுறையை முயற்சி செய்யுங்கள்.

### Default behavior-ஐத் தடுப்பது {/*preventing-default-behavior*/}

சில browser events-க்கு அவற்றுடன் தொடர்புடைய default behavior உள்ளது. உதாரணமாக, ஒரு `<form>` submit event, அதற்குள் உள்ள button click செய்யப்பட்டால் நடக்கும்; default ஆக அது முழு page-ஐ reload செய்யும்:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submit செய்யப்படுகிறது!')}>
      <input />
      <button>அனுப்பு</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

இது நடக்காமல் தடுக்க event object-இல் `e.preventDefault()` call செய்யலாம்:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submit செய்யப்படுகிறது!');
    }}>
      <input />
      <button>அனுப்பு</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

`e.stopPropagation()` மற்றும் `e.preventDefault()`-ஐ குழப்ப வேண்டாம். இரண்டும் பயனுள்ளவை, ஆனால் தொடர்பில்லாதவை:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) மேலுள்ள tags-க்கு attach செய்யப்பட்ட event handlers fire ஆகாமல் தடுக்கிறது.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) default browser behavior உள்ள சில events-க்கு அந்த behavior-ஐத் தடுக்கிறது.

## Event handlers-க்கு side effects இருக்க முடியுமா? {/*can-event-handlers-have-side-effects*/}

மிகவும் முடியும்! Side effects-க்கு event handlers சிறந்த இடம்.

Rendering functions போல அல்லாமல், event handlers [pure](/learn/keeping-components-pure) ஆக இருக்க வேண்டியதில்லை; எனவே ஏதாவது ஒன்றை *மாற்ற* அது சிறந்த இடம்--உதாரணமாக, typing-க்கு பதிலாக input-ன் value-ஐ மாற்றுதல், அல்லது button press-க்கு பதிலாக list-ஐ மாற்றுதல். ஆனால் எந்த தகவலையும் மாற்ற, முதலில் அதை store செய்ய ஒரு வழி தேவை. React-இல், இது [state, component-ன் memory](/learn/state-a-components-memory) பயன்படுத்தி செய்யப்படுகிறது. அடுத்த page-இல் இதைப் பற்றி அனைத்தையும் கற்றுக்கொள்வீர்கள்.

<Recap>

* `<button>` போன்ற element-க்கு function-ஐ prop ஆக pass செய்வதன் மூலம் events-ஐ handle செய்யலாம்.
* Event handlers pass செய்யப்பட வேண்டும், **call செய்யப்படக்கூடாது!** `onClick={handleClick}`, `onClick={handleClick()}` அல்ல.
* Event handler function-ஐ தனியாகவோ inline ஆகவோ define செய்யலாம்.
* Event handlers component-க்குள் define செய்யப்படுகின்றன, எனவே அவை props-ஐ access செய்ய முடியும்.
* Parent-இல் event handler ஒன்றை declare செய்து child-க்கு prop ஆக pass செய்யலாம்.
* Application-specific names கொண்டு உங்கள் சொந்த event handler props-ஐ define செய்யலாம்.
* Events மேலே propagate ஆகும். அதைத் தடுக்க முதல் argument-இல் `e.stopPropagation()` call செய்யுங்கள்.
* Events-க்கு வேண்டாத default browser behavior இருக்கலாம். அதைத் தடுக்க `e.preventDefault()` call செய்யுங்கள்.
* Child handler-இலிருந்து event handler prop-ஐ explicit ஆக call செய்வது propagation-க்கு நல்ல alternative.

</Recap>



<Challenges>

#### Event handler-ஐ சரிசெய்யுங்கள் {/*fix-an-event-handler*/}

இந்த button-ஐ click செய்தால் page background white மற்றும் black இடையே மாற வேண்டும். ஆனால் அதை click செய்தால் எதுவும் நடக்கவில்லை. பிரச்சினையைச் சரிசெய்யுங்கள். (`handleClick`-க்குள் உள்ள logic பற்றி கவலைப்பட வேண்டாம்--அந்த பகுதி சரியாக இருக்கிறது.)

<Sandpack>

```js {expectedErrors: {'react-compiler': [5, 7]}}
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      விளக்குகளை மாற்று
    </button>
  );
}
```

</Sandpack>

<Solution>

பிரச்சினை என்னவெனில் `<button onClick={handleClick()}>` rendering போது `handleClick` function-ஐ _passing_ செய்வதற்கு பதிலாக அதை _call_ செய்கிறது. `()` call-ஐ remove செய்து `<button onClick={handleClick}>` ஆக்கினால் issue சரியாகும்:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      விளக்குகளை மாற்று
    </button>
  );
}
```

</Sandpack>

மாற்றாக, `<button onClick={() => handleClick()}>` போல call-ஐ வேறு function-க்குள் wrap செய்யலாம்:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      விளக்குகளை மாற்று
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Events-ஐ wire up செய்யுங்கள் {/*wire-up-the-events*/}

இந்த `ColorSwitch` component ஒரு button-ஐ render செய்கிறது. அது page color-ஐ மாற்ற வேண்டும். Parent-இலிருந்து பெறும் `onChangeColor` event handler prop-உடன் அதை wire up செய்யுங்கள், button click செய்தால் color மாறும்.

இதை செய்த பிறகு, button click செய்தால் page click counter-உம் increment ஆகிறது என்பதை கவனியுங்கள். Parent component எழுதிய உங்கள் colleague, `onChangeColor` எந்த counters-ஐயும் increment செய்யாது என்று வலியுறுத்துகிறார். வேறு என்ன நடக்கலாம்? Button click செய்தால் color மட்டும் மாறி, counter increment ஆகாமல் இருப்பதற்குச் சரிசெய்யுங்கள்.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Color மாற்று
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Page-இல் clicks: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

முதலில், `<button onClick={onChangeColor}>` போல event handler-ஐ சேர்க்க வேண்டும்.

ஆனால் இது incrementing counter என்ற பிரச்சினையை அறிமுகப்படுத்துகிறது. உங்கள் colleague சொல்வது போல `onChangeColor` இதைச் செய்யவில்லை என்றால், பிரச்சினை இந்த event மேலே propagate ஆகி, மேலே உள்ள ஏதோ handler அதைச் செய்கிறது என்பதுதான். இந்த பிரச்சினையைத் தீர்க்க propagation-ஐ stop செய்ய வேண்டும். ஆனால் `onChangeColor`-ஐ இன்னும் call செய்ய வேண்டும் என்பதை மறக்காதீர்கள்.

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Color மாற்று
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Page-இல் clicks: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
