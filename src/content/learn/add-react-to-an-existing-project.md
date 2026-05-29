---
title: Existing project-இல் React சேர்த்தல்
---

<Intro>

உங்கள் existing project-இல் சிறிது interactivity சேர்க்க விரும்பினால், அதை React-இல் rewrite செய்ய தேவையில்லை. உங்கள் existing stack-க்கு React சேர்த்து, எங்கு வேண்டுமானாலும் interactive React components render செய்யலாம்.

</Intro>

<Note>

**Local development-க்கு [Node.js](https://nodejs.org/en/) install செய்ய வேண்டும்.** Online-இல் அல்லது நேரடியான HTML page மூலம் [React முயற்சிக்க](/learn/installation#try-react) முடிந்தாலும், development-க்கு நீங்கள் பயன்படுத்த விரும்பும் பெரும்பாலான JavaScript tooling-க்கு நடைமுறையில் Node.js தேவைப்படும்.

</Note>

## Existing website-ன் முழு subroute-க்கு React பயன்படுத்துதல் {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

`example.com`-இல் Rails போன்ற வேறு server technology கொண்டு உருவாக்கப்பட்ட existing web app உள்ளது என்று வைத்துக்கொள்வோம்; `example.com/some-app/` என்று தொடங்கும் அனைத்து routes-ஐயும் முழுமையாக React கொண்டு implement செய்ய விரும்புகிறீர்கள்.

அதை இவ்வாறு set up செய்ய பரிந்துரைக்கிறோம்:

1. [React-based frameworks](/learn/creating-a-react-app)-இல் ஒன்றைப் பயன்படுத்தி **உங்கள் app-ன் React பகுதியை build செய்யுங்கள்**.
2. உங்கள் framework configuration-இல் **`/some-app`-ஐ *base path* ஆக குறிப்பிடுங்கள்** (இதற்கான வழி: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. `/some-app/`-க்குள் வரும் அனைத்து requests-யும் உங்கள் React app handle செய்யும் வகையில் **உங்கள் server அல்லது proxy-ஐ configure செய்யுங்கள்**.

இதனால் உங்கள் app-ன் React பகுதி, அந்த frameworks-இல் உள்ள [best practices-ன் பயனைப் பெறும்](/learn/build-a-react-app-from-scratch#consider-using-a-framework).

பல React-based frameworks full-stack ஆக உள்ளன; அவை உங்கள் React app server-ன் பயனைப் பெற அனுமதிக்கின்றன. ஆனால் server-இல் JavaScript run செய்ய முடியாவிட்டாலும் அல்லது விரும்பாவிட்டாலும் இதே அணுகுமுறையைப் பயன்படுத்தலாம். அந்த case-இல், `/some-app/`-இல் HTML/CSS/JS export-ஐ (Next.js-க்கு [`next export` output](https://nextjs.org/docs/advanced-features/static-html-export), Gatsby-க்கு default) serve செய்யுங்கள்.

## Existing page-ன் ஒரு பகுதிக்கு React பயன்படுத்துதல் {/*using-react-for-a-part-of-your-existing-page*/}

Rails போன்ற server technology அல்லது Backbone போன்ற client technology கொண்டு உருவாக்கப்பட்ட existing page ஒன்று உங்களிடம் உள்ளது, அதில் எங்கோ interactive React components render செய்ய விரும்புகிறீர்கள் என்று வைத்துக்கொள்வோம். இது React integrate செய்யும் பொதுவான வழி; உண்மையில் பல ஆண்டுகள் Meta-வில் React usage பெரும்பாலும் இப்படித்தான் இருந்தது!

இதை இரண்டு படிகளில் செய்யலாம்:

1. [JSX syntax](/learn/writing-markup-with-jsx) பயன்படுத்தவும், [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) syntax மூலம் code-ஐ modules ஆகப் பிரிக்கவும், [npm](https://www.npmjs.com/) package registry-யிலிருந்து packages (உதாரணமாக React) பயன்படுத்தவும் அனுமதிக்கும் **JavaScript environment அமைக்கவும்**.
2. Page-இல் நீங்கள் பார்க்க விரும்பும் இடத்தில் **உங்கள் React components-ஐ render செய்யவும்**.

சரியான அணுகுமுறை உங்கள் existing page setup-ஐப் பொறுத்தது; சில விவரங்களைப் பார்ப்போம்.

### படி 1: Modular JavaScript environment அமைத்தல் {/*step-1-set-up-a-modular-javascript-environment*/}

Modular JavaScript environment, உங்கள் code அனைத்தையும் ஒரே file-இல் எழுதுவதற்கு பதிலாக, React components-ஐ தனித்தனி files-இல் எழுத அனுமதிக்கிறது. [npm](https://www.npmjs.com/) registry-யில் பிற developers publish செய்த சிறந்த packages அனைத்தையும், React உட்பட, பயன்படுத்தவும் அனுமதிக்கிறது! இதை எப்படி செய்வது உங்கள் existing setup-ஐப் பொறுத்தது:

* **உங்கள் app ஏற்கனவே `import` statements பயன்படுத்தும் files ஆகப் பிரிக்கப்பட்டிருந்தால்,** உங்களிடம் ஏற்கனவே உள்ள setup-ஐ பயன்படுத்த முயற்சிக்கவும். உங்கள் JS code-இல் `<div />` எழுதுவது syntax error தருகிறதா என்று பார்க்கவும். Syntax error வந்தால், JSX பயன்படுத்த [Babel மூலம் உங்கள் JavaScript code-ஐ transform செய்ய](https://babeljs.io/setup), மேலும் [Babel React preset](https://babeljs.io/docs/babel-preset-react)-ஐ enable செய்ய வேண்டியிருக்கலாம்.

* **உங்கள் app-க்கு JavaScript modules compile செய்ய existing setup இல்லையென்றால்,** [Vite](https://vite.dev/) கொண்டு அதை அமைக்கவும். Rails, Django, Laravel உட்பட [backend frameworks உடன் பல integrations](https://github.com/vitejs/awesome-vite#integrations-with-backends)-ஐ Vite community maintain செய்கிறது. உங்கள் backend framework பட்டியலில் இல்லையென்றால், Vite builds-ஐ உங்கள் backend உடன் manually integrate செய்ய [இந்த guide](https://vite.dev/guide/backend-integration.html)-ஐப் பின்பற்றவும்.

உங்கள் setup வேலை செய்கிறதா என்பதைப் பார்க்க, உங்கள் project folder-இல் இந்த command-ஐ run செய்யுங்கள்:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

பிறகு உங்கள் main JavaScript file-ன் மேலே இந்த code lines-ஐ சேர்க்கவும் (அது `index.js` அல்லது `main.js` என்று அழைக்கப்படலாம்):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

உங்கள் page-ன் முழு content "Hello, world!"-ஆல் replace செய்யப்பட்டிருந்தால், எல்லாம் வேலை செய்தது! தொடர்ந்து படியுங்கள்.

<Note>

Existing project-இல் modular JavaScript environment-ஐ முதல் முறையாக integrate செய்வது சற்று பயமுறுத்தலாம்; ஆனால் அது மதிப்புள்ளது! நீங்கள் சிக்கினால், எங்கள் [community resources](/community) அல்லது [Vite Chat](https://chat.vite.dev/)-ஐ முயற்சிக்கவும்.

</Note>

### படி 2: Page-இல் எங்கும் React components render செய்தல் {/*step-2-render-react-components-anywhere-on-the-page*/}

முந்தைய படியில், உங்கள் main file-ன் மேலே இந்த code-ஐ வைத்தீர்கள்:

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

நிச்சயமாக, existing HTML content-ஐ உண்மையில் clear செய்ய நீங்கள் விரும்பவில்லை!

இந்த code-ஐ delete செய்யுங்கள்.

அதற்கு பதிலாக, உங்கள் HTML-இல் குறிப்பிட்ட இடங்களில் React components render செய்ய விரும்புவீர்கள். உங்கள் HTML page-ஐ (அல்லது அதை generate செய்யும் server templates-ஐ) open செய்து, எந்த tag-க்கும் unique [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute சேர்க்கவும். உதாரணமாக:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

இதனால் அந்த HTML element-ஐ [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) மூலம் கண்டுபிடித்து [`createRoot`](/reference/react-dom/client/createRoot)-க்கு pass செய்யலாம்; அதன் உள்ளே உங்கள் சொந்த React component-ஐ render செய்ய முடியும்:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

`index.html`-இலிருந்த original HTML content preserve செய்யப்பட்டிருப்பதையும், ஆனால் உங்கள் சொந்த `NavigationBar` React component இப்போது உங்கள் HTML-இல் உள்ள `<nav id="navigation">`-க்குள் தோன்றுவதையும் கவனியுங்கள். Existing HTML page-க்குள் React components render செய்வதைப் பற்றி மேலும் அறிய [`createRoot` usage documentation](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)-ஐ படிக்கவும்.

Existing project-இல் React adopt செய்யும்போது, buttons போன்ற சிறிய interactive components-இலிருந்து தொடங்கி, பிறகு படிப்படியாக "மேலே நகர்ந்து", இறுதியில் உங்கள் முழு page-யும் React கொண்டு build ஆகும் நிலைக்கு செல்வது பொதுவானது. அந்த நிலையை அடைந்தால், React-ன் முழு பயனைப் பெற உடனே [React framework](/learn/creating-a-react-app)-க்கு migrate செய்ய பரிந்துரைக்கிறோம்.

## Existing native mobile app-இல் React Native பயன்படுத்துதல் {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) existing native apps-இலும் incrementally integrate செய்யலாம். Android (Java அல்லது Kotlin) அல்லது iOS (Objective-C அல்லது Swift)-க்கான existing native app உங்களிடம் இருந்தால், அதில் React Native screen சேர்க்க [இந்த guide](https://reactnative.dev/docs/integration-with-existing-apps)-ஐப் பின்பற்றவும்.
