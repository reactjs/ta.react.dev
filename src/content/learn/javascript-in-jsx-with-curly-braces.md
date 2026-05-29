---
title: Curly Braces உடன் JSX-இல் JavaScript
---

<Intro>

JSX, JavaScript file-க்குள் HTML போன்ற markup எழுத உதவுகிறது; rendering logic மற்றும் content ஒரே இடத்தில் இருக்கும். சில நேரங்களில் அந்த markup-க்குள் சிறிது JavaScript logic சேர்க்கவோ dynamic property ஒன்றை reference செய்யவோ நீங்கள் விரும்புவீர்கள். அப்படிப்பட்ட சூழலில், JSX-இல் curly braces பயன்படுத்தி JavaScript-க்கு ஒரு சாளரம் திறக்கலாம்.

</Intro>

<YouWillLearn>

* Quotes கொண்டு strings pass செய்வது எப்படி
* JSX-க்குள் curly braces கொண்டு JavaScript variable ஒன்றை reference செய்வது எப்படி
* JSX-க்குள் curly braces கொண்டு JavaScript function ஒன்றை call செய்வது எப்படி
* JSX-க்குள் curly braces கொண்டு JavaScript object ஒன்றை பயன்படுத்துவது எப்படி

</YouWillLearn>

## Quotes கொண்டு strings pass செய்தல் {/*passing-strings-with-quotes*/}

JSX-க்கு string attribute pass செய்ய விரும்பும்போது, அதை single அல்லது double quotes-க்குள் வைப்பீர்கள்:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

இங்கே, `"https://react.dev/images/docs/scientists/7vQD0fPs.jpg"` மற்றும் `"Gregorio Y. Zara"` strings ஆக pass செய்யப்படுகின்றன.

ஆனால் `src` அல்லது `alt` text-ஐ dynamically specify செய்ய விரும்பினால் என்ன? **`"` மற்றும் `"`-ஐ `{` மற்றும் `}`-ஆல் மாற்றி JavaScript-இலிருந்து ஒரு value-ஐப் பயன்படுத்தலாம்**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://react.dev/images/docs/scientists/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Image round ஆகும் `"avatar"` CSS class name-ஐ specify செய்யும் `className="avatar"` மற்றும் `avatar` என்ற JavaScript variable-ன் value-ஐ படிக்கும் `src={avatar}` இடையிலான வேறுபாட்டைக் கவனிக்கவும். ஏனெனில் curly braces உங்கள் markup-இலேயே JavaScript உடன் வேலை செய்ய அனுமதிக்கின்றன!

## Curly braces பயன்படுத்துதல்: JavaScript உலகுக்கான சாளரம் {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX என்பது JavaScript எழுதும் ஒரு சிறப்பு வழி. அதனால் அதற்குள் JavaScript-ஐ `{ }` curly braces கொண்டு பயன்படுத்த முடியும். கீழே உள்ள example முதலில் scientist-க்கான பெயரை `name` என்று declare செய்து, பிறகு அதை `<h1>`-க்குள் curly braces மூலம் embed செய்கிறது:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}-ன் To Do List</h1>
  );
}
```

</Sandpack>

`name`-ன் value-ஐ `'Gregorio Y. Zara'`-இலிருந்து `'Hedy Lamarr'` ஆக மாற்றிப் பாருங்கள். List title எப்படி மாறுகிறது என்பதை கவனிக்கவும்.

`formatDate()` போன்ற function calls உட்பட எந்த JavaScript expression-உம் curly braces இடையில் வேலை செய்யும்:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>{formatDate(today)}-க்கான To Do List</h1>
  );
}
```

</Sandpack>

### Curly braces எங்கு பயன்படுத்தலாம் {/*where-to-use-curly-braces*/}

JSX-க்குள் curly braces இரண்டு வழிகளில் மட்டுமே பயன்படுத்தலாம்:

1. **Text ஆக** நேரடியாக JSX tag-க்குள்: `<h1>{name}-ன் To Do List</h1>` வேலை செய்யும், ஆனால் `<{tag}>Gregorio Y. Zara-ன் To Do List</{tag}>` வேலை செய்யாது.
2. **Attributes ஆக** `=` sign-க்கு உடனடியாக பின்: `src={avatar}` `avatar` variable-ஐ படிக்கும், ஆனால் `src="{avatar}"` `"{avatar}"` என்ற string-ஐ pass செய்யும்.

## "Double curlies" பயன்படுத்துதல்: JSX-இல் CSS மற்றும் பிற objects {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Strings, numbers மற்றும் பிற JavaScript expressions மட்டுமல்லாமல், JSX-இல் objects கூட pass செய்யலாம். Objects-உம் `{ name: "Hedy Lamarr", inventions: 5 }` போல curly braces-ஆல் குறிக்கப்படுகின்றன. ஆகவே JSX-இல் JS object ஒன்றை pass செய்ய, object-ஐ இன்னொரு curly braces ஜோடிக்குள் wrap செய்ய வேண்டும்: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

JSX-இல் inline CSS styles-இல் இதைப் பார்க்கலாம். React inline styles பயன்படுத்த வேண்டும் என்று கட்டாயப்படுத்தாது (பெரும்பாலான cases-க்கு CSS classes நன்றாகவே வேலை செய்யும்). ஆனால் inline style தேவைப்படும்போது, `style` attribute-க்கு object pass செய்வீர்கள்:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Videophone-ஐ மேம்படுத்து</li>
      <li>Aeronautics lectures தயார் செய்</li>
      <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

`backgroundColor` மற்றும் `color` values-ஐ மாற்றிப் பாருங்கள்.

இதுபோல் எழுதும்போது curly braces-க்குள் JavaScript object இருப்பதை தெளிவாகக் காணலாம்:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

JSX-இல் அடுத்த முறை `{{` மற்றும் `}}` பார்த்தால், அது JSX curlies-க்குள் உள்ள JavaScript object தவிர வேறெதுவும் அல்ல என்பதை அறிந்திருங்கள்!

<Pitfall>

Inline `style` properties camelCase-இல் எழுதப்படுகின்றன. உதாரணமாக, HTML `<ul style="background-color: black">` உங்கள் component-இல் `<ul style={{ backgroundColor: 'black' }}>` ஆக எழுதப்படும்.

</Pitfall>

## JavaScript objects மற்றும் curly braces உடன் மேலும் பயிற்சி {/*more-fun-with-javascript-objects-and-curly-braces*/}

பல expressions-ஐ ஒரு object-க்குள் நகர்த்தி, உங்கள் JSX-இல் curly braces-க்குள் அவற்றை reference செய்யலாம்:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

இந்த example-இல், `person` JavaScript object ஒரு `name` string மற்றும் `theme` object கொண்டுள்ளது:

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Component இந்த values-ஐ `person`-இலிருந்து இவ்வாறு பயன்படுத்தலாம்:

```js
<div style={person.theme}>
  <h1>{person.name}-ன் Todos</h1>
```

Templating language ஆக JSX மிகவும் minimal; ஏனெனில் JavaScript பயன்படுத்தி data மற்றும் logic organize செய்ய அது அனுமதிக்கிறது.

<Recap>

இப்போது JSX பற்றி கிட்டத்தட்ட அனைத்தையும் அறிந்துள்ளீர்கள்:

* Quotes-க்குள் உள்ள JSX attributes strings ஆக pass செய்யப்படுகின்றன.
* Curly braces JavaScript logic மற்றும் variables-ஐ உங்கள் markup-க்குள் கொண்டு வர உதவுகின்றன.
* அவை JSX tag content-க்குள் அல்லது attributes-இல் `=`-க்கு உடனடியாக பின் வேலை செய்கின்றன.
* `{{` மற்றும் `}}` special syntax அல்ல: அது JSX curly braces-க்குள் உள்ள JavaScript object.

</Recap>

<Challenges>

#### தவறை சரிசெய்யுங்கள் {/*fix-the-mistake*/}

இந்த code `Objects are not valid as a React child` என்று error சொல்லி crash ஆகிறது:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}-ன் Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Problem-ஐ கண்டுபிடிக்க முடியுமா?

<Hint>Curly braces-க்குள் என்ன இருக்கிறது என்று பாருங்கள். அங்கே சரியான விஷயத்தை வைத்திருக்கிறோமா?</Hint>

<Solution>

இந்த example string ஒன்றுக்கு பதிலாக *object-ஐயே* markup-க்குள் render செய்வதால் இது நடக்கிறது: `<h1>{person}-ன் Todos</h1>` முழு `person` object-ஐ render செய்ய முயல்கிறது! Raw objects-ஐ text content ஆக சேர்த்தால் error throw ஆகும்; ஏனெனில் அவற்றை எப்படி display செய்ய வேண்டும் என்று React அறியாது.

சரிசெய்ய, `<h1>{person}-ன் Todos</h1>`-ஐ `<h1>{person.name}-ன் Todos</h1>` ஆக மாற்றவும்:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### தகவலை object-க்குள் எடுத்துச் செல்லுங்கள் {/*extract-information-into-an-object*/}

Image URL-ஐ `person` object-க்குள் extract செய்யவும்.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Image URL-ஐ `person.imageUrl` என்ற property-க்குள் நகர்த்தி, `<img>` tag-இல் curlies பயன்படுத்தி அதைப் படிக்கவும்:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://react.dev/images/docs/scientists/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### JSX curly braces-க்குள் expression எழுதுங்கள் {/*write-an-expression-inside-jsx-curly-braces*/}

கீழே உள்ள object-இல், முழு image URL நான்கு பகுதிகளாகப் பிரிக்கப்பட்டுள்ளது: base URL, `imageId`, `imageSize`, மற்றும் file extension.

Image URL இந்த attributes ஒன்றாக combine ஆக வேண்டும்: base URL (எப்போதும் `'https://react.dev/images/docs/scientists/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), மற்றும் file extension (எப்போதும் `'.jpg'`). ஆனால் `<img>` tag அதன் `src`-ஐ specify செய்யும் முறையில் ஏதோ தவறு உள்ளது.

அதை சரிசெய்ய முடியுமா?

<Sandpack>

```js

const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

உங்கள் fix வேலை செய்ததா என்பதை check செய்ய, `imageSize` value-ஐ `'b'` ஆக மாற்றிப் பாருங்கள். உங்கள் edit-க்கு பிறகு image resize ஆக வேண்டும்.

<Solution>

இதை `src={baseUrl + person.imageId + person.imageSize + '.jpg'}` என்று எழுதலாம்.

1. `{` JavaScript expression-ஐ திறக்கிறது
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` சரியான URL string உருவாக்குகிறது
3. `}` JavaScript expression-ஐ மூடுகிறது

<Sandpack>

```js
const baseUrl = 'https://react.dev/images/docs/scientists/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

இந்த expression-ஐ கீழே உள்ள `getImageUrl` போன்ற தனி function-க்குள் நகர்த்தவும் முடியும்:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}-ன் Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Videophone-ஐ மேம்படுத்து</li>
        <li>Aeronautics lectures தயார் செய்</li>
        <li>Alcohol-fuelled engine-ல் வேலை செய்</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://react.dev/images/docs/scientists/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Variables மற்றும் functions markup-ஐ நேரடியாக வைத்திருக்க உதவும்!

</Solution>

</Challenges>
