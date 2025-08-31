---
title: விரைவான தொடக்கம்
---

<Intro>

ரியாக்ட் ஆவணங்களுக்கு வரவேற்கிறோம்! இந்தப் பக்கம், நீங்கள் தினசரி பயன்படுத்தும் ரியாக்ட் கருத்துக்களில் 80% குறித்து ஒரு அறிமுகத்தை வழங்கும்.

</Intro>

<YouWillLearn>

- காம்போனென்டுகளை உருவாக்கி உறையிடுவது எப்படி
- மார்க்அப் மற்றும் ஸ்டைல்களைச் சேர்ப்பது எப்படி
- தரவை காட்டுவது எப்படி
- நிபந்தனைகள் மற்றும் பட்டியல்களை ரெண்டர் செய்வது எப்படி
- நிகழ்வுகளுக்கு பதிலளித்து திரையைப் புதுப்பிப்பது எப்படி
- காம்போனென்டுகளுக்கு இடையில் தரவைப் பகிர்வது எப்படி

</YouWillLearn>

## காம்போனென்டுகளை உருவாக்குதல் மற்றும் உறையிடுதல் {/*components*/}

ரியாக்ட் செயலிகள் *காம்போனென்டுகள்* கொண்டு உருவாக்கப்பட்டவை. ஒரு காம்போனென்ட் என்பது UI (பயனர் இடைமுகம்) இன் ஒரு பகுதி; அதற்குத் தனது சுயமான தார்க்கிகமும் தோற்றமும் இருக்கும். ஒரு காம்போனென்ட் ஒரு பொத்தானைப் போலச் சிறியதாக இருக்கலாம், அல்லது ஒரு முழுப் பக்கத்தைப் போலப் பெரியதாக இருக்கலாம்.

ரியாக்ட் காம்போனென்டுகள் மார்க்அப்பைத் திருப்பி தரும் JavaScript செயல்பாடுகள்:

```js
function MyButton() {
  return (
    <button>நான் ஒரு பொத்தான்</button>
  );
}
```

இப்போது நீங்கள் `MyButton`-ஐ அறிவித்துள்ளதால், அதை வேறு ஒரு காம்போனென்டின் உள்ளே உறையிடலாம்:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>என் செயலிக்கு வரவேற்பு</h1>
      <MyButton />
    </div>
  );
}
```

`<MyButton />` பெரிய எழுத்தால் தொடங்குவதை கவனிக்கவும். அதுவே அது ரியாக்ட் காம்போனென்ட் என்பதை அறிய உதவும். ரியாக்ட் காம்போனென்ட் பெயர்கள் எப்போதும் பெரிய எழுத்தால் தொடங்க வேண்டும்; ஆனால் HTML குறிச்சொற்கள் சிறிய எழுத்தில் இருக்க வேண்டும்.

விளைவைக் காணுங்கள்:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      நான் ஒரு பொத்தான்
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>என் செயலிக்கு வரவேற்பு</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

`export default` என்ற முக்கியச்சொற்கள், இந்த கோப்பிலுள்ள முக்கிய காம்போனென்டை குறிப்பிடுகின்றன. சில JavaScript வடிவமுறைகள் உங்களுக்கு பரிச்சயமில்லையென்றால், [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) மற்றும் [javascript.info](https://javascript.info/import-export) சிறந்த குறிப்புகளைக் கொண்டுள்ளன.

## JSX மூலம் மார்க்அப் எழுதுதல் {/*writing-markup-with-jsx*/}

மேலே நீங்கள் பார்த்த மார்க்அப் வடிவமைப்பு *JSX* என்று அழைக்கப்படுகிறது. இது கட்டாயமல்ல, ஆனால் அதன் வசதிக்காக பெரும்பாலான ரியாக்ட் திட்டங்கள் JSX-ஐப் பயன்படுத்துகின்றன. [லோகல் டெவலப்மெண்டுக்கு நாங்கள் பரிந்துரைக்கும் கருவிகள்](/learn/installation) அனைத்தும் JSX-ஐ உடனடியாக ஆதரிக்கின்றன.

JSX, HTML-ஐ விடக் கடுமையானது. `<br />` போன்ற குறிச்சொற்களை நீங்கள் மூடவேண்டும். மேலும், உங்கள் காம்போனென்ட் பல JSX குறிச்சொற்களை நேரடியாக திருப்ப முடியாது. அவற்றை ஒரு பொதுவான பெற்றோரின் உள்ளே, `<div>...</div>` அல்லது காலியான `<>...</>` உலரப்பரப்பில் சுற்றிக்கொள்ள வேண்டும்:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>வணக்கம்.<br />நீங்கள் எப்படி இருக்கிறீர்கள்?</p>
    </>
  );
}
```

HTML-இல் இருந்து JSX-ஆக மாற்ற வேண்டியவை அதிகமாக இருந்தால், நீங்கள் ஒரு [ஆன்லைன் மாற்றியை](https://transform.tools/html-to-jsx) பயன்படுத்தலாம்.

## ஸ்டைல்களைச் சேர்த்தல் {/*adding-styles*/}

ரியாக்டில், நீங்கள் CSS வகுப்பை `className` மூலம் குறிப்பிடுகிறீர்கள். இது HTML இன் [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) பண்புக்கூற்றைப் போலவே செயல்படுகிறது:

```js
<img className="avatar" />
```

பிறகு அதற்கான CSS விதிகளை தனி CSS கோப்பில் எழுதுங்கள்:

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

CSS கோப்புகளை எப்படி சேர்ப்பது என்பதை ரியாக்ட் நிர்ணயிக்கவில்லை. எளிய நிலையில், உங்கள் HTML-க்கு ஒரு [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) குறிச்சொல்லைச் சேர்ப்பீர்கள். நீங்கள் ஒரு build tool அல்லது framework பயன்படுத்தினால், உங்கள் திட்டத்தில் CSS கோப்பைச் சேர்ப்பது எப்படி என்பதை அதன் ஆவணங்களில் பார்க்கவும்.

## தரவை காட்டுதல் {/*displaying-data*/}

JSX, JavaScript-உள்ளே மார்க்அப்பை இட அனுமதிக்கிறது. சுருள்வளைவுகள் மூலம் நீங்கள் மீண்டும் JavaScript-க்கு "சென்று", உங்கள் கோடிலுள்ள ஒரு வேரியபிளின் மதிப்பை உள்ளடக்கி, அதை பயனருக்கு காட்டலாம். உதாரணமாக, இது `user.name`-ஐக் காட்டும்:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

JSX பண்புக்கூறுகளிலிருந்தும் நீங்கள் JavaScript-க்கு "செல்ல"லாம், ஆனால் அப்போது குறிக்கோடுகளுக்குப் பதிலாக சுருள்வளைவுகளைப் பயன்படுத்த வேண்டும். உதாரணமாக, `className="avatar"` என்பது `"avatar"` என்ற string-ஐ CSS class-ஆக அனுப்புகிறது; ஆனால் `src={user.imageUrl}` என்பது JavaScript-இலுள்ள `user.imageUrl` வேரியபிளின் மதிப்பைப் படித்து, அதை `src` பண்புக்கூற்றாக அனுப்புகிறது:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

மேலும் சிக்கலான வெளிப்பாடுகளையும் JSX சுருள்வளைவுகளுக்குள் இடலாம்; உதாரணமாக, [string சேர்த்தல்](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={user.name + ' -ன் படம்'}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

மேலுள்ள எடுத்துக்காட்டில், `style={{}}` என்பது ஒரு சிறப்பு வடிவமுறை அல்ல; அது `style={ }` JSX சுருள்வளைவுகளுக்குள் உள்ள ஒரு சாதாரண `{}` பொருள். உங்கள் ஸ்டைல்கள் JavaScript வேரியபிள்களின் மதிப்புகளில் சார்ந்திருக்கும் போது `style` பண்புக்கூற்றைப் பயன்படுத்தலாம்.

## நிபந்தனை ரெண்டரிங் {/*conditional-rendering*/}

ரியாக்டில் நிபந்தனைகளை எழுதுவதற்கு தனியான வடிவமுறை இல்லை. அதற்குப் பதிலாக, சாதாரண JavaScript கோடை எழுதும் போது பயன்படுத்தும் அதே நுட்பங்களை இங்கும் பயன்படுத்தலாம். உதாரணமாக, [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) அறிக்கையைப் பயன்படுத்தி, நிபந்தனைப்படி JSX-ஐக் கலந்து கொள்ளலாம்:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

நீங்கள் மேலும் சுருக்கமான கோடைக் விரும்பினால், [நிபந்தனை `?` இயக்கியை](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) பயன்படுத்தலாம். `if`-க்கு மாறாக, இது JSX-ன் உள்ளேயே வேலை செய்யும்:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` கிளை தேவையில்லையெனில், மேலும் சுருக்கமான [தார்க்கிக `&&` வடிவமுறையை](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) பயன்படுத்தலாம்:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

இந்த அணுகுமுறைகள் அனைத்தும், நிபந்தனைப்படி attribute-களை குறிப்பிடுவதற்கும் வேலை செய்கின்றன. இந்த JavaScript வடிவமுறைகளில் சில உங்களுக்கு பரிச்சயமில்லையென்றால், முதலில் எப்போதும் `if...else`-ஐப் பயன்படுத்தி தொடங்கலாம்.

## பட்டியல்களை ரெண்டர் செய்தல் {/*rendering-lists*/}

காம்போனென்டுகளின் பட்டியலை ரெண்டர் செய்ய, நீங்கள் JavaScript-இன் [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) மற்றும் [array `map()` செயல்பாடு](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) போன்ற அம்சங்களை நம்புவீர்கள்.

உதாரணமாக, உங்களிடம் ஒரு பொருட்களின் வரிசை (array) இருப்பதாக வைத்துக்கொள்வோம்:

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

உங்கள் காம்போனென்டின் உள்ளே, `map()` செயல்பாட்டை பயன்படுத்தி, பொருட்களின் வரிசையை `<li>` உருப்படிகளின் வரிசையாக மாற்றுங்கள்:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

`<li>`-க்கு ஒரு `key` attribute இருப்பதை கவனியுங்கள். பட்டியலின் ஒவ்வொரு உருப்படிக்கும், அதன் உடன்பிறப்புகளுக்குள் அதை தனித்தனியாக அடையாளப்படுத்தும் ஒரு string அல்லது எண்ணைப் பாஸ் செய்ய வேண்டும். பொதுவாக, ஒரு key உங்கள் தரவிலிருந்து (உதாரணமாக, database ID) வர வேண்டும். நீங்கள் பின்னர் உருப்படிகளைச் சேர்த்தாலும், நீக்கினாலும், மறுவரிசைப்படுத்தினாலும் என்ன நிகழ்ந்தது என்பதை ரியாக்ட் உங்கள் keys மூலம் அறியும்.

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## நிகழ்வுகளுக்கு பதிலளித்தல் {/*responding-to-events*/}

உங்கள் காம்போனென்டுகளின் உள்ளே *event handler* செயல்பாடுகளை அறிவித்து, நிகழ்வுகளுக்கு பதிலளிக்கலாம்:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('நீங்கள் என்னை சொடுக்கினீர்கள்!');
  }

  return (
    <button onClick={handleClick}>
      என்னை சொடுக்கவும்
    </button>
  );
}
```

`onClick={handleClick}`-க்கு முடிவில் வளைவுக்குறிகள் (parentheses) இல்லையென்பதை கவனியுங்கள்! event handler செயல்பாட்டை _அழைக்க_ வேண்டாம்; அதை *அப்படியே பாஸ்* செய்தால் போதும். பயனர் பொத்தானை சொடுக்கும் போது, ரியாக்ட் உங்கள் event handler-ஐ அழைக்கும்.

## திரையைப் புதுப்பித்தல் {/*updating-the-screen*/}

பல நேரங்களில், உங்கள் காம்போனென்ட் சில தகவலை "நினைத்துக் கொண்டு" அதை காட்ட வேண்டும். உதாரணமாக, ஒரு பொத்தானை எத்தனை முறை சொடுக்கப்பட்டது என்பதை எண்ண விரும்பலாம். இதைச் செய்ய, உங்கள் காம்போனென்டில் *state* சேர்க்கவும்.

முதலில், ரியாக்டிலிருந்து [`useState`](/reference/react/useState)-ஐ import செய்யவும்:

```js
import { useState } from 'react';
```

இப்போது, உங்கள் காம்போனென்டின் உள்ளே ஒரு *state வேரியபிளை* அறிவிக்கலாம்:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState`-இலிருந்து நீங்கள் இரண்டு விஷயங்களைப் பெறுவீர்கள்: நடப்பு state (`count`), மற்றும் அதை மேம்படுத்த அனுமதிக்கும் செயல்பாடு (`setCount`). அவற்றிற்கு நீங்கள் எந்தப் பெயர்களையும் கொடுக்கலாம்; வழக்கமாக `[ஏதோ ஒன்று, setஏதோ ஒன்று]` என்ற வடிவத்தில் எழுதுவார்கள்.

பொத்தான் முதல் முறை காட்டப்படும் போது, நீங்கள் `useState()`-க்கு `0`-ஐப் பாஸ் செய்துள்ளதால், `count` மதிப்பு `0` ஆக இருக்கும். state-ஐ மாற்ற வேண்டுமெனில், `setCount()`-ஐ அழைத்து புதிய மதிப்பைப் பாஸ் செய்யவும். இந்த பொத்தானை சொடுக்குவது கவுன்டரை ஒரு அளவு அதிகரிக்கும்:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} முறை சொடுக்கப்பட்டது
    </button>
  );
}
```

ரியாக்ட் உங்கள் காம்போனென்ட் செயல்பாட்டை மீண்டும் அழைக்கும். அப்போதோ, `count` `1` ஆகும். அதன் பின்னர் `2`. இப்படிப் தொடரும்.

அதே காம்போனென்டை பல முறை ரெண்டர் செய்தால், ஒவ்வொன்றுக்கும் தனித்தனி state இருக்கும். ஒவ்வொரு பொத்தானையும் தனித்தனியாக சொடுக்கிப் பாருங்கள்:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>தனித்தனியாகப் புதுப்பிக்கும் கவுன்டர்கள்</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} முறை சொடுக்கப்பட்டது
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

ஒவ்வொரு பொத்தானும் தன் `count` state-ஐ "நினைத்துக்" கொண்டு, மற்ற பொத்தான்களை பாதிக்காததை கவனியுங்கள்.

## Hooks-ஐ பயன்படுத்துதல் {/*using-hooks*/}

`use` என்று தொடங்கும் செயல்பாடுகள் *Hooks* என்று அழைக்கப்படுகின்றன. `useState` என்பது ரியாக்ட் வழங்கும் உட்கட்டமைக்கப்பட்ட Hook. மற்ற உட்கட்டமைக்கப்பட்ட Hooks-களை [API குறிப்பில்](/reference/react) காணலாம். இயங்கிவரும் Hooks-களை ஒன்றுசேர்த்தும், உங்கள் சொந்த Hooks-களையும் எழுதலாம்.

Hooks, பிற செயல்பாடுகளை விட கட்டுப்பாடுகளுடன் இருக்கும். நீங்கள் Hooks-ஐ உங்கள் காம்போனென்ட்களின் (அல்லது வேறு Hooks-களின்) *முதல் மட்டத்தில்* மட்டுமே அழைக்கலாம். `useState`-ஐ ஒரு நிபந்தனை அல்லது loop-இல் பயன்படுத்த வேண்டுமெனில், புதிய காம்போனென்டை பிரித்து அதில் இடவும்.

## காம்போனென்டுகளுக்கிடையில் தரவைப் பகிர்தல் {/*sharing-data-between-components*/}

முந்தைய உதாரணத்தில், ஒவ்வொரு `MyButton`-க்கும் தனித்தனி `count` இருந்தது; ஒவ்வொரு பொத்தானையும் சொடுக்கும் போது, அந்தப் பொத்தானின் `count` மட்டுமே மாறியது:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="மூன்று காம்போனென்டுகளைக் கொண்ட மர வடிவ விளக்கம்: MyApp என்று பெயரிடப்பட்ட ஒரு பெற்றோர், MyButton என்று பெயரிடப்பட்ட இரண்டு குழந்தைகள். இரண்டு MyButton காம்போனென்டுகளிலும் count மதிப்பு பூஜ்ஜியம்.">

ஆரம்பத்தில், ஒவ்வொரு `MyButton`-னும் `count` state `0` ஆகும்

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="முந்தையதையே போன்ற வரைபடம்; முதல் MyButton குழந்தையின் count ஒரு சொடுக்கலின் காரணமாக ஒன்றாக அதிகரித்துள்ளது. இரண்டாம் MyButton இன் மதிப்பு இன்னும் பூஜ்ஜியம்." >

முதல் `MyButton` தன் `count`-ஐ `1` ஆகப் புதுப்பிக்கிறது

</Diagram>

</DiagramGroup>

ஆனால், பல நேரங்களில் காம்போனென்டுகள் *தரவைப் பகிர்ந்து எப்போதும் ஒன்றாகப் புதுப்பிக்க* வேண்டியிருக்கும்.

இரண்டு `MyButton` காம்போனென்டுகளும் ஒரே `count`-ஐக் காட்டி, ஒன்றாகப் புதுப்பிக்க வேண்டுமெனில், அந்த state-ஐ ஒவ்வொரு பொத்தானிலிருந்தும் "மேலே" கொண்டு, அவற்றை எல்லாம் உள்ளடக்கியுள்ள அருகிலுள்ள காம்போனென்டுக்கு நகர்த்த வேண்டும்.

இந்த உதாரணத்தில், அது `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="மூன்று காம்போனென்டுகளின் மரம்: MyApp என்ற பெற்றோர், MyButton என்ற இரண்டு குழந்தைகள். MyApp-இல் count மதிப்பு பூஜ்ஜியம்; அது இரு MyButton களுக்கும் கீழிறக்கப்பட்டுள்ளது, அவற்றிலும் பூஜ்ஜியம் காட்டப்படுகிறது." >

ஆரம்பத்தில், `MyApp`-ன் `count` state `0`; அது இரு குழந்தைகளுக்கும் கீழிறக்கப்படுகிறது

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="முந்தையதையே போன்ற வரைபடம்; பெற்றோர் MyApp இன் count ஒரு சொடுக்கலால் ஒன்றாக உயர்ந்துள்ளது. அந்த மதிப்பு இரு MyButton குழந்தைகளுக்கும் கீழிறக்கப்பட்டதால், அவற்றிலும் count ஒன்று ஆகிறது." >

சொடுக்கும் போது, `MyApp` தன் `count` state-ஐ `1` ஆக மாற்றி, இரு குழந்தைகளுக்கும் கீழிறக்குகிறது

</Diagram>

</DiagramGroup>

இப்போது எந்தப் பொத்தானையும் சொடுக்கினாலும், `MyApp`-இலுள்ள `count` மாறும்; அதனால் இரு `MyButton` களிலும் உள்ள count-களும் மாறும். இதை கோடில் இவ்வாறு வெளிப்படுத்தலாம்.

முதலில், `MyButton`-லிருந்து state-ஐ *மேலே நகர்த்தி* `MyApp`-இல் வையுங்கள்:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>தனித்தனியாகப் புதுப்பிக்கும் கவுன்டர்கள்</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

பிறகு, பகிரப்பட்ட click handler-உடன் சேர்த்து, `MyApp`-இலிருந்து ஒவ்வொரு `MyButton`-க்கும் state-ஐ *கீழிறக்குங்கள்*. `<img>` போன்ற உட்கட்டமைக்கப்பட்ட குறிச்சொற்களுடன் செய்ததுபோலவே, JSX சுருள்வளைவுகளைப் பயன்படுத்தி `MyButton`-க்கு தகவலைப் பாஸ் செய்யலாம்:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>ஒன்றாகப் புதுப்பிக்கும் கவுன்டர்கள்</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

இவ்வாறு நீங்கள் கீழிறக்கும் தகவலை _props_ என்று அழைக்கின்றனர். இப்போது `MyApp` காம்போனென்ட் `count` state-ஐயும் `handleClick` event handler-யையும் கொண்டுள்ளது; இரண்டையும் ஒவ்வொரு பொத்தானுக்கும் *props-ஆக கீழிறக்குகிறது*.

இறுதியாக, பெற்றோர் காம்போனென்டில் இருந்து கீழிறக்கப்பட்ட props-ஐ *படிக்கும்* வகையில் `MyButton`-ஐ மாற்றுங்கள்:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} முறை சொடுக்கப்பட்டது
    </button>
  );
}
```

பொத்தானைச் சொடுக்கும்போது, `onClick` handler இயங்கும். ஒவ்வொரு பொத்தானிலும் `onClick` prop `MyApp`-இலுள்ள `handleClick` செயல்பாட்டில் அமைக்கப்பட்டுள்ளது; எனவே அதன் உள்ளேயுள்ள கோடு இயங்கும். அந்தக் கோடு `setCount(count + 1)`-ஐ அழைத்து, `count` state-ஐ ஒரு அளவு உயர்த்தும். புதிய `count` மதிப்பு ஒவ்வொரு பொத்தானுக்கும் prop-ஆக கீழிறக்கப்படும்; ஆகவே அனைத்தும் புதிய மதிப்பை காட்டும். இதையே "state-ஐ மேலே தூக்குதல்" (lifting state up) என்கிறோம். state-ஐ மேலே நகர்த்துவதன் மூலம், அதை காம்போனென்டுகளுக்கு இடையே பகிர்ந்துள்ளீர்கள்.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>ஒன்றாகப் புதுப்பிக்கும் கவுன்டர்கள்</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} முறை சொடுக்கப்பட்டது
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## அடுத்த படிகள் {/*next-steps*/}

இப்போது வரை, ரியாக்ட் கோடெழுதும் அடிப்படைகளை நீங்கள் கற்றிருக்கிறீர்கள்!

இவற்றை நடைமுறையில் பயன்படுத்திப் பார்க்கவும்; ரியாக்டில் உங்கள் முதல் சிறிய செயலியை உருவாக்கவும் [பயிற்சியை](/learn/tutorial-tic-tac-toe) பாருங்கள்.
