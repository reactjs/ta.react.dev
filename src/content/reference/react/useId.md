---
title: useId
---

<Intro>

Accessibility attributes-க்கு pass செய்யக்கூடிய unique IDs உருவாக்க பயன்படும் React Hook தான் `useId`.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `useId()` {/*useid*/}

Unique ID உருவாக்க உங்கள் component-ன் top level-இல் `useId`-ஐ call செய்யுங்கள்:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

#### Parameters {/*parameters*/}

`useId` parameters எதையும் ஏற்காது.

#### Returns {/*returns*/}

இந்த குறிப்பிட்ட component-இல் உள்ள இந்த குறிப்பிட்ட `useId` call-உடன் தொடர்புடைய unique ID string-ஐ `useId` return செய்கிறது.

#### Caveats {/*caveats*/}

* `useId` ஒரு Hook; எனவே அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் call செய்ய முடியாது. அது தேவைப்பட்டால், புதிய component-ஐ extract செய்து state-ஐ அதற்குள் நகர்த்துங்கள்.

* [use()](/reference/react/use)-க்கான **cache keys உருவாக்க `useId` பயன்படுத்தக்கூடாது**. Component mounted ஆக இருக்கும் போது ID stable; ஆனால் rendering நேரத்தில் மாறலாம். Cache keys உங்கள் data-இலிருந்து உருவாக்கப்பட வேண்டும்.

* List-இல் **keys உருவாக்க `useId` பயன்படுத்தக்கூடாது**. [Keys உங்கள் data-இலிருந்து உருவாக்கப்பட வேண்டும்.](/learn/rendering-lists#where-to-get-your-key)

* தற்போது [async Server Components](/reference/rsc/server-components#async-components-with-server-components)-இல் `useId` பயன்படுத்த முடியாது.

---

## பயன்பாடு {/*usage*/}

<Pitfall>

**List-இல் keys உருவாக்க `useId` call செய்ய வேண்டாம்.** [Keys உங்கள் data-இலிருந்து உருவாக்கப்பட வேண்டும்.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Accessibility attributes-க்கு unique IDs உருவாக்குதல் {/*generating-unique-ids-for-accessibility-attributes*/}

Unique ID உருவாக்க உங்கள் component-ன் top level-இல் `useId`-ஐ call செய்யுங்கள்:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

பிறகு <CodeStep step={1}>உருவாக்கப்பட்ட ID</CodeStep>-ஐ வெவ்வேறு attributes-க்கு pass செய்யலாம்:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**இது எப்போது பயனுள்ளதாக இருக்கும் என்பதை ஒரு உதாரணத்தின் மூலம் பார்ப்போம்.**

[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) போன்ற [HTML accessibility attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), இரண்டு tags ஒன்றுடன் ஒன்று தொடர்புடையவை என்பதை குறிப்பிட உதவுகின்றன. உதாரணமாக, ஒரு element (input போன்றது) மற்றொரு element (paragraph போன்றது) மூலம் விவரிக்கப்படுகிறது என்று குறிப்பிடலாம்.

வழக்கமான HTML-இல், இதை இவ்வாறு எழுதுவீர்கள்:

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

ஆனால் React-இல் இப்படியாக IDs hardcode செய்வது நல்ல நடைமுறை அல்ல. ஒரு component page-இல் ஒன்றுக்கு மேற்பட்ட முறை render ஆகலாம்; ஆனால் IDs unique ஆக இருக்க வேண்டும்! ID hardcode செய்வதற்கு பதிலாக, `useId` மூலம் unique ID உருவாக்குங்கள்:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

இப்போது `PasswordField` screen-இல் பல முறை தோன்றினாலும், உருவாக்கப்பட்ட IDs clash ஆகாது.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Assistive technologies உடன் user experience-இல் உள்ள வித்தியாசத்தைப் பார்க்க [இந்த video-ஐ பாருங்கள்](https://www.youtube.com/watch?v=0dNzNcuEuOo).

<Pitfall>

[Server rendering](/reference/react-dom/server) உடன், **server மற்றும் client-இல் identical component tree `useId`-க்கு தேவை**. Server மற்றும் client-இல் render செய்யும் trees துல்லியமாக match ஆகாவிட்டால், generated IDs match ஆகாது.

</Pitfall>

<DeepDive>

#### Incrementing counter-ஐ விட useId ஏன் சிறந்தது? {/*why-is-useid-better-than-an-incrementing-counter*/}

`nextId++` போன்ற global variable-ஐ increment செய்வதை விட `useId` ஏன் சிறந்தது என்று நீங்கள் யோசிக்கலாம்.

`useId`-ன் முக்கிய நன்மை: இது [server rendering](/reference/react-dom/server) உடன் வேலை செய்வதை React உறுதிசெய்கிறது. Server rendering நேரத்தில், உங்கள் components HTML output உருவாக்குகின்றன. பின்னர் client-இல், [hydration](/reference/react-dom/client/hydrateRoot) உங்கள் event handlers-ஐ generated HTML-க்கு attach செய்கிறது. Hydration வேலை செய்ய, client output server HTML-க்கு match ஆக வேண்டும்.

Incrementing counter உடன் இதை guarantee செய்வது மிகவும் கடினம்; ஏனெனில் Client Components hydrate ஆகும் வரிசை server HTML emit செய்யப்பட்ட வரிசைக்கு match ஆகாமல் இருக்கலாம். `useId` call செய்வதன் மூலம், hydration வேலை செய்யும் மற்றும் server/client output match ஆகும் என்பதை உறுதிசெய்கிறீர்கள்.

React-க்குள், calling component-ன் "parent path" இலிருந்து `useId` உருவாக்கப்படுகிறது. அதனால்தான் client மற்றும் server tree ஒன்றாக இருந்தால், rendering order எதுவாக இருந்தாலும் "parent path" match ஆகும்.

</DeepDive>

---

### தொடர்புடைய பல elements-க்கு IDs உருவாக்குதல் {/*generating-ids-for-several-related-elements*/}

தொடர்புடைய பல elements-க்கு IDs கொடுக்க வேண்டுமெனில், அவற்றுக்கான shared prefix உருவாக்க `useId` call செய்யலாம்:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Unique ID தேவைப்படும் ஒவ்வொரு element-க்கும் தனித்தனியாக `useId` call செய்வதை இதனால் தவிர்க்கலாம்.

---

### உருவாக்கப்படும் அனைத்து IDs-க்கும் shared prefix குறிப்பிடுதல் {/*specifying-a-shared-prefix-for-all-generated-ids*/}

ஒரே page-இல் பல independent React applications render செய்தால், உங்கள் [`createRoot`](/reference/react-dom/client/createRoot#parameters) அல்லது [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) calls-க்கு `identifierPrefix` option ஆக pass செய்யுங்கள். `useId` மூலம் உருவாக்கப்படும் ஒவ்வொரு identifier-உம் நீங்கள் குறிப்பிட்ட distinct prefix-ஆல் தொடங்கும்; எனவே இரண்டு apps உருவாக்கும் IDs ஒருபோதும் clash ஆகாது.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### Client மற்றும் server-இல் அதே ID prefix பயன்படுத்துதல் {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

நீங்கள் [ஒரே page-இல் பல independent React apps render செய்கிறீர்கள்](#specifying-a-shared-prefix-for-all-generated-ids), மேலும் அவற்றில் சில server-rendered என்றால், client side-இல் [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) call-க்கு pass செய்யும் `identifierPrefix`, [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) போன்ற [server APIs](/reference/react-dom/server)-க்கு pass செய்யும் `identifierPrefix` போலவே இருக்கிறதா என்பதை உறுதிசெய்யுங்கள்.

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

Page-இல் ஒரே React app மட்டுமே இருந்தால் `identifierPrefix` pass செய்ய தேவையில்லை.
