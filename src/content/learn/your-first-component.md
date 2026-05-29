---
title: உங்கள் முதல் Component
---

<Intro>

*Components* React-ன் core concepts-இல் ஒன்று. User interfaces (UI) உருவாக்கும் அடித்தளம் அவைதான்; அதனால் உங்கள் React பயணத்தை தொடங்க சிறந்த இடம் components ஆகும்!

</Intro>

<YouWillLearn>

* Component என்றால் என்ன
* React application-இல் components என்ன பங்கு வகிக்கின்றன
* உங்கள் முதல் React component-ஐ எழுதுவது எப்படி

</YouWillLearn>

## Components: UI கட்டுமானக் கூறுகள் {/*components-ui-building-blocks*/}

Web-இல், `<h1>` மற்றும் `<li>` போன்ற built-in tags தொகுப்பைக் கொண்டு rich structured documents உருவாக்க HTML உதவுகிறது:

```html
<article>
  <h1>என் முதல் Component</h1>
  <ol>
    <li>Components: UI கட்டுமானக் கூறுகள்</li>
    <li>Component-ஐ வரையறுத்தல்</li>
    <li>Component-ஐ பயன்படுத்துதல்</li>
  </ol>
</article>
```

இந்த markup, இந்த article-ஐ `<article>` ஆகவும், அதன் heading-ஐ `<h1>` ஆகவும், சுருக்கப்பட்ட table of contents-ஐ ordered list `<ol>` ஆகவும் குறிக்கிறது. இப்படிப்பட்ட markup, styling-க்கு CSS மற்றும் interactivity-க்கு JavaScript உடன் சேர்ந்து, Web-இல் நீங்கள் பார்க்கும் ஒவ்வொரு sidebar, avatar, modal, dropdown மற்றும் UI-ன் ஒவ்வொரு பகுதியின் பின்னணியில் உள்ளது.

React உங்கள் markup, CSS, JavaScript ஆகியவற்றை custom "components" ஆக இணைக்க உதவுகிறது; அவை **உங்கள் app-க்கான reusable UI elements.** மேலே பார்த்த table of contents code-ஐ ஒவ்வொரு page-இலும் render செய்யக்கூடிய `<TableOfContents />` component ஆக மாற்றலாம். Under the hood, அது இன்னும் `<article>`, `<h1>` போன்ற அதே HTML tags-ஐப் பயன்படுத்துகிறது.

HTML tags போலவே, முழு pages-ஐ design செய்ய components-ஐ compose, order, nest செய்யலாம். உதாரணமாக, நீங்கள் படிக்கும் documentation page React components-ஆல் உருவாக்கப்பட்டுள்ளது:

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

உங்கள் project வளரும்போது, ஏற்கனவே எழுதிய components-ஐ reuse செய்வதன் மூலம் பல designs compose செய்யப்படலாம் என்பதை கவனிப்பீர்கள்; இது development-ஐ வேகப்படுத்தும். மேலுள்ள table of contents-ஐ எந்த screen-க்கும் `<TableOfContents />` மூலம் சேர்க்கலாம்! [Chakra UI](https://chakra-ui.com/) மற்றும் [Material UI](https://material-ui.com/) போன்ற React open source community பகிர்ந்திருக்கும் ஆயிரக்கணக்கான components மூலம் உங்கள் project-ஐ jumpstart கூட செய்யலாம்.

## Component-ஐ வரையறுத்தல் {/*defining-a-component*/}

பாரம்பரியமாக web pages உருவாக்கும்போது, web developers முதலில் content-ஐ markup செய்து, பின்னர் சில JavaScript சேர்த்து interaction சேர்த்தனர். Interaction web-இல் nice-to-have ஆக இருந்தபோது இது மிக நன்றாக வேலை செய்தது. இப்போது பல sites மற்றும் எல்லா apps-க்கும் அது எதிர்பார்க்கப்படுகிறது. React அதே technology-ஐ பயன்படுத்தியபடியே interactivity-க்கு முன்னுரிமை தருகிறது: **React component என்பது _markup சேர்க்கக்கூடிய_ JavaScript function.** அது எப்படி இருக்கும் என்பதை இங்கே பார்க்கலாம் (கீழே உள்ள example-ஐ edit செய்யலாம்):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Component உருவாக்குவது எப்படி:

### Step 1: Component-ஐ export செய்யுங்கள் {/*step-1-export-the-component*/}

`export default` prefix என்பது [standard JavaScript syntax](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (React-க்கு மட்டும் சொந்தமானது அல்ல). ஒரு file-இல் main function-ஐ mark செய்ய இது உதவுகிறது; பின்னர் அதை மற்ற files-இலிருந்து import செய்யலாம். (Import செய்வது பற்றி [Components-ஐ Import மற்றும் Export செய்தல்](/learn/importing-and-exporting-components)-இல் மேலும் பார்க்கலாம்!)

### Step 2: Function-ஐ define செய்யுங்கள் {/*step-2-define-the-function*/}

`function Profile() { }` மூலம் `Profile` என்ற பெயர் கொண்ட JavaScript function ஒன்றை define செய்கிறீர்கள்.

<Pitfall>

React components வழக்கமான JavaScript functions தான், ஆனால் **அவற்றின் பெயர்கள் capital letter-ஆல் தொடங்க வேண்டும்**; இல்லையெனில் அவை வேலை செய்யாது!

</Pitfall>

### Step 3: Markup சேர்க்கவும் {/*step-3-add-markup*/}

Component `src` மற்றும் `alt` attributes கொண்ட `<img />` tag ஒன்றை return செய்கிறது. `<img />` HTML போல எழுதப்படுகிறது, ஆனால் under the hood அது உண்மையில் JavaScript! இந்த syntax [JSX](/learn/writing-markup-with-jsx) என்று அழைக்கப்படுகிறது; இது JavaScript-க்குள் markup embed செய்ய உதவுகிறது.

Return statements இந்த component போல ஒரே line-இல் எழுதலாம்:

```js
return <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

ஆனால் உங்கள் markup `return` keyword இருக்கும் அதே line-இல் முழுவதும் இல்லாவிட்டால், அதை parentheses ஜோடிக்குள் wrap செய்ய வேண்டும்:

```js
return (
  <div>
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Parentheses இல்லாமல், `return`-க்கு அடுத்த lines-இல் உள்ள code [ignored செய்யப்படும்](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Component-ஐ பயன்படுத்துதல் {/*using-a-component*/}

இப்போது உங்கள் `Profile` component-ஐ define செய்துள்ளீர்கள்; அதை மற்ற components-க்குள் nest செய்யலாம். உதாரணமாக, பல `Profile` components-ஐ பயன்படுத்தும் `Gallery` component ஒன்றை export செய்யலாம்:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>அற்புதமான விஞ்ஞானிகள்</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Browser பார்க்கும் விஷயம் {/*what-the-browser-sees*/}

Casing-இல் உள்ள வேறுபாட்டைக் கவனிக்கவும்:

* `<section>` lowercase; ஆகவே நாம் HTML tag-ஐ குறிக்கிறோம் என்று React அறியும்.
* `<Profile />` capital `P`-ஆல் தொடங்குகிறது; ஆகவே `Profile` என்ற நமது component-ஐ பயன்படுத்த வேண்டும் என்று React அறியும்.

மேலும் `Profile` இன்னும் அதிகமான HTML கொண்டுள்ளது: `<img />`. இறுதியில், browser பார்க்குவது இதுதான்:

```html
<section>
  <h1>அற்புதமான விஞ்ஞானிகள்</h1>
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Components-ஐ nest மற்றும் organize செய்தல் {/*nesting-and-organizing-components*/}

Components வழக்கமான JavaScript functions; ஆகவே ஒரே file-இல் பல components வைத்திருக்கலாம். Components சற்றுச் சிறியதாகவோ ஒன்றுக்கொன்று நெருக்கமாக தொடர்புடையதாகவோ இருந்தால் இது வசதியானது. இந்த file நெரிசலாகினால், `Profile`-ஐ எப்போதும் தனி file-க்கு நகர்த்தலாம். இதை எப்படி செய்வது என்பதை விரைவில் [imports பற்றிய page](/learn/importing-and-exporting-components)-இல் கற்பீர்கள்.

`Profile` components `Gallery`-க்குள் rendered ஆகின்றன, அதுவும் பல முறை; ஆகவே `Gallery` ஒரு **parent component**, ஒவ்வொரு `Profile`-ஐ "child" ஆக render செய்கிறது என்று சொல்லலாம். இதுவே React-ன் magic-இன் ஒரு பகுதி: component ஒன்றை ஒருமுறை define செய்து, நீங்கள் விரும்பும் அளவு இடங்களிலும் விரும்பும் அளவு முறைகளிலும் பயன்படுத்தலாம்.

<Pitfall>

Components மற்ற components-ஐ render செய்யலாம்; ஆனால் **அவற்றின் definitions-ஐ ஒருபோதும் nest செய்யக்கூடாது:**

```js {2-5}
export default function Gallery() {
  // 🔴 Never define a component inside another component!
  function Profile() {
    // ...
  }
  // ...
}
```

மேலுள்ள snippet [மிகவும் மெதுவாக இருக்கும் மற்றும் bugs ஏற்படுத்தும்](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state). அதற்கு பதிலாக, ஒவ்வொரு component-ஐயும் top level-இல் define செய்யவும்:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Declare components at the top level
function Profile() {
  // ...
}
```

Child component-க்கு parent-இலிருந்து data தேவைப்பட்டால், definitions-ஐ nest செய்வதற்கு பதிலாக [props மூலம் pass செய்யவும்](/learn/passing-props-to-a-component).

</Pitfall>

<DeepDive>

#### எல்லா நிலைகளிலும் components {/*components-all-the-way-down*/}

உங்கள் React application ஒரு "root" component-இல் தொடங்குகிறது. பொதுவாக, புதிய project தொடங்கும்போது அது தானாக உருவாக்கப்படும். உதாரணமாக, நீங்கள் [CodeSandbox](https://codesandbox.io/) பயன்படுத்தினாலோ அல்லது [Next.js](https://nextjs.org/) framework பயன்படுத்தினாலோ, root component `pages/index.js`-இல் define செய்யப்படுகிறது. இந்த examples-இல், நீங்கள் root components export செய்து வந்துள்ளீர்கள்.

பெரும்பாலான React apps அனைத்துநிலைகளிலும் components-ஐ பயன்படுத்துகின்றன. இதன் அர்த்தம், buttons போன்ற reusable pieces-க்கு மட்டுமல்லாமல், sidebars, lists, இறுதியில் complete pages போன்ற பெரிய pieces-க்கும் components பயன்படுத்துவீர்கள்! அவற்றில் சில ஒருமுறை மட்டுமே பயன்படுத்தப்பட்டாலும், UI code மற்றும் markup-ஐ organize செய்ய components ஒரு வசதியான வழி.

[React-based frameworks](/learn/creating-a-react-app) இதை இன்னும் ஒரு படி முன்னேற்றுகின்றன. Empty HTML file ஒன்றைப் பயன்படுத்தி page management-ஐ JavaScript மூலம் React "take over" செய்ய விடுவதற்கு பதிலாக, அவை உங்கள் React components-இலிருந்து HTML-ஐ தானாக generate செய்கின்றன. இதனால் JavaScript code load ஆகும்முன் உங்கள் app சில content-ஐ காட்ட முடியும்.

இன்னும் பல websites, [ஏற்கனவே உள்ள HTML pages-க்கு interactivity சேர்க்க](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) மட்டுமே React-ஐ பயன்படுத்துகின்றன. முழு page-க்கு ஒரே root component-க்கு பதிலாக, அவற்றுக்கு பல root components இருக்கும். உங்களுக்கு தேவையான அளவு அதிகமாகவோ குறைவாகவோ React பயன்படுத்தலாம்.

</DeepDive>

<Recap>

React-ன் முதல் சுவையை இப்போது பார்த்துவிட்டீர்கள்! சில முக்கிய points-ஐ recap செய்வோம்.

* React components உருவாக்க உதவுகிறது; அவை **உங்கள் app-க்கான reusable UI elements.**
* React app-இல் UI-ன் ஒவ்வொரு பகுதியும் component ஆகும்.
* React components வழக்கமான JavaScript functions தான், ஆனால்:

  1. அவற்றின் பெயர்கள் எப்போதும் capital letter-ஆல் தொடங்கும்.
  2. அவை JSX markup return செய்கின்றன.

</Recap>



<Challenges>

#### Component-ஐ export செய்யுங்கள் {/*export-the-component*/}

இந்த sandbox வேலை செய்யவில்லை; ஏனெனில் root component export செய்யப்படவில்லை:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Solution பார்க்கும்முன் நீங்களே சரிசெய்ய முயற்சிக்கவும்!

<Solution>

Function definition-க்கு முன் `export default` சேர்க்கவும்:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

இந்த example-ஐ சரிசெய்ய `export` மட்டும் எழுதுவது ஏன் போதாது என்று நீங்கள் யோசிக்கலாம். `export` மற்றும் `export default` இடையிலான வேறுபாட்டை [Components-ஐ Import மற்றும் Export செய்தல்](/learn/importing-and-exporting-components)-இல் கற்றுக்கொள்ளலாம்.

</Solution>

#### Return statement-ஐ சரிசெய்யுங்கள் {/*fix-the-return-statement*/}

இந்த `return` statement-இல் ஏதோ சரியில்லை. அதை சரிசெய்ய முடியுமா?

<Hint>

இதை சரிசெய்ய முயலும்போது "Unexpected token" error கிடைக்கலாம். அப்படியானால், semicolon closing parenthesis-க்கு *பிறகு* வருகிறது என்பதை check செய்யவும். `return ( )`-க்குள் semicolon விட்டால் error ஏற்படும்.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Return statement-ஐ இவ்வாறு ஒரே line-க்கு நகர்த்தி இந்த component-ஐ சரிசெய்யலாம்:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

அல்லது returned JSX markup-ஐ `return`-க்கு உடனே பிறகு தொடங்கும் parentheses-க்குள் wrap செய்யலாம்:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### தவறைக் கண்டுபிடிக்கவும் {/*spot-the-mistake*/}

`Profile` component declare மற்றும் use செய்யப்பட்டுள்ள முறையில் ஏதோ தவறு உள்ளது. தவறைக் கண்டுபிடிக்க முடியுமா? (React components-ஐ வழக்கமான HTML tags-இலிருந்து எப்படி வேறுபடுத்துகிறது என்பதை நினைவில் கொள்ளுங்கள்!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>அற்புதமான விஞ்ஞானிகள்</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React component names capital letter-ஆல் தொடங்க வேண்டும்.

`function profile()`-ஐ `function Profile()` ஆக மாற்றி, பிறகு ஒவ்வொரு `<profile />`-ஐ `<Profile />` ஆக மாற்றவும்:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>அற்புதமான விஞ்ஞானிகள்</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### உங்கள் சொந்த component {/*your-own-component*/}

புதிதாக ஒரு component எழுதுங்கள். அதற்கு எந்த valid name வேண்டுமானாலும் கொடுத்து, எந்த markup வேண்டுமானாலும் return செய்யலாம். Ideas இல்லையெனில், `<h1>நன்றாக செய்தீர்கள்!</h1>` காட்டும் `Congratulations` component எழுதலாம். அதை export செய்ய மறக்காதீர்கள்!

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>நன்றாக செய்தீர்கள்!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
