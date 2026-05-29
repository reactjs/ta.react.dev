---
title: JSX உடன் markup எழுதுதல்
---

<Intro>

*JSX* என்பது JavaScript file உள்ளே HTML போல இருக்கும் markup எழுத அனுமதிக்கும் JavaScript-க்கான syntax extension. Components எழுத வேறு வழிகளும் இருந்தாலும், பெரும்பாலான React developers JSX-ன் conciseness-ஐ விரும்புகிறார்கள்; பெரும்பாலான codebases அதைப் பயன்படுத்துகின்றன.

</Intro>

<YouWillLearn>

* React ஏன் markup-ஐ rendering logic உடன் mix செய்கிறது
* JSX, HTML-இலிருந்து எப்படி வேறுபடுகிறது
* JSX மூலம் தகவலை எப்படி display செய்வது

</YouWillLearn>

## JSX: Markup-ஐ JavaScript-க்குள் வைப்பது {/*jsx-putting-markup-into-javascript*/}

Web, HTML, CSS, மற்றும் JavaScript மேல் build செய்யப்பட்டுள்ளது. பல ஆண்டுகளாக, web developers content-ஐ HTML-இல், design-ஐ CSS-இல், logic-ஐ JavaScript-இல் வைத்தனர் - பெரும்பாலும் தனித்தனி files-இல்! Page-ன் logic JavaScript-இல் தனியாக இருந்தபோது, content HTML உள்ளே marked up செய்யப்பட்டது:

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="Purple background உடன் HTML markup; இரண்டு child tags கொண்ட div: p மற்றும் form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Yellow background உடன் மூன்று JavaScript handlers: onSubmit, onLogin, மற்றும் onClick.">

JavaScript

</Diagram>

</DiagramGroup>

ஆனால் Web மேலும் interactive ஆனபோது, content-ஐ logic அதிகமாக determine செய்தது. HTML-ன் பொறுப்பை JavaScript எடுத்துக்கொண்டது! இதனால் தான் **React-இல், rendering logic மற்றும் markup ஒரே இடமான components-இல் சேர்ந்து வாழ்கின்றன.**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="முந்தைய examples-இலிருந்து HTML மற்றும் JavaScript mix செய்யப்பட்ட React component. Function name Sidebar; அது yellow-ஆக highlighted ஆன isLoggedIn function-ஐ call செய்கிறது. Purple-ஆக highlighted ஆன function உள்ளே, முன்பிருந்த p tag மற்றும் அடுத்த diagram-இல் காட்டப்படும் component-ஐ reference செய்யும் Form tag nested ஆக உள்ளது.">

`Sidebar.js` React component

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="முந்தைய examples-இலிருந்து HTML மற்றும் JavaScript mix செய்யப்பட்ட React component. Function name Form; அதில் onClick மற்றும் onSubmit என இரண்டு handlers yellow-ஆக highlighted. Handlers-க்கு பிறகு HTML purple-ஆக highlighted. HTML-ல் nested input element கொண்ட form element உள்ளது; ஒவ்வொன்றிலும் onClick prop உள்ளது.">

`Form.js` React component

</Diagram>

</DiagramGroup>

Button-ன் rendering logic மற்றும் markup ஒன்றாக இருப்பதால், ஒவ்வொரு edit-இலும் அவை ஒன்றுடன் ஒன்று sync-இல் இருக்கும். மாறாக, button-ன் markup மற்றும் sidebar-ன் markup போன்ற தொடர்பில்லாத details ஒன்றிலிருந்து ஒன்று isolated ஆக இருக்கும்; இதனால் அவற்றை தனித்தனியாக மாற்றுவது safer.

ஒவ்வொரு React component-மும் browser-இல் React render செய்யும் சில markup கொண்டிருக்கக்கூடிய JavaScript function. அந்த markup-ஐ represent செய்ய React components JSX என்ற syntax extension பயன்படுத்துகின்றன. JSX HTML போலவே தெரியும்; ஆனால் அது சிறிது strict, மேலும் dynamic information display செய்ய முடியும். இதைப் புரிந்துகொள்ள சிறந்த வழி, சில HTML markup-ஐ JSX markup-ஆக convert செய்வது.

<Note>

JSX மற்றும் React இரண்டு தனி விஷயங்கள். அவை பெரும்பாலும் ஒன்றாகப் பயன்படுத்தப்படுகின்றன; ஆனால் ஒன்றையொன்று சாராமல் [independently பயன்படுத்த முடியும்](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform). JSX ஒரு syntax extension; React ஒரு JavaScript library.

</Note>

## HTML-ஐ JSX-ஆக convert செய்தல் {/*converting-html-to-jsx*/}

உங்களிடம் சில (முழுமையாக valid) HTML உள்ளது என்று வைத்துக்கொள்ளுங்கள்:

```html
<h1>Hedy Lamarr-ன் Todos</h1>
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
    <li>புதிய traffic lights கண்டுபிடி
    <li>ஒரு movie scene rehearse செய்
    <li>Spectrum technology-ஐ மேம்படுத்து
</ul>
```

அதை உங்கள் component-க்குள் வைக்க விரும்புகிறீர்கள்:

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

அப்படியே copy paste செய்தால், அது வேலை செய்யாது:


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr-ன் Todos</h1>
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>புதிய traffic lights கண்டுபிடி
      <li>ஒரு movie scene rehearse செய்
      <li>Spectrum technology-ஐ மேம்படுத்து
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

இதற்குக் காரணம் JSX, HTML-ஐ விட strict; மேலும் சில கூடுதல் rules கொண்டது! மேலுள்ள error messages படித்தால், markup fix செய்ய அவை உங்களை வழிநடத்தும்; அல்லது கீழுள்ள guide-ஐ பின்பற்றலாம்.

<Note>

பெரும்பாலான நேரங்களில், React-ன் on-screen error messages problem எங்கே உள்ளது என்று கண்டுபிடிக்க உதவும். நீங்கள் stuck ஆனால் அவற்றைப் படியுங்கள்!

</Note>

## JSX விதிகள் {/*the-rules-of-jsx*/}

### 1. Single root element return செய்யுங்கள் {/*1-return-a-single-root-element*/}

Component-இலிருந்து multiple elements return செய்ய, **அவற்றை single parent tag-இல் wrap செய்யுங்கள்.**

உதாரணமாக, `<div>` பயன்படுத்தலாம்:

```js {1,11}
<div>
  <h1>Hedy Lamarr-ன் Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


உங்கள் markup-க்கு கூடுதல் `<div>` சேர்க்க விரும்பவில்லை என்றால், அதற்கு பதிலாக `<>` மற்றும் `</>` எழுதலாம்:

```js {1,11}
<>
  <h1>Hedy Lamarr-ன் Todos</h1>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

இந்த empty tag *[Fragment](/reference/react/Fragment)* என்று அழைக்கப்படுகிறது. Browser HTML tree-இல் எந்த trace-யும் வைக்காமல் things-ஐ group செய்ய Fragments அனுமதிக்கின்றன.

<DeepDive>

#### Multiple JSX tags ஏன் wrap செய்யப்பட வேண்டும்? {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX HTML போலத் தெரியும்; ஆனால் under the hood அது plain JavaScript objects-ஆக transform செய்யப்படுகிறது. அவற்றை array-க்குள் wrap செய்யாமல் function-இலிருந்து இரண்டு objects return செய்ய முடியாது. அதனால் தான் இரண்டு JSX tags-ஐ மற்றொரு tag அல்லது Fragment-இல் wrap செய்யாமல் return செய்ய முடியாது.

</DeepDive>

### 2. எல்லா tags-ஐயும் close செய்யுங்கள் {/*2-close-all-the-tags*/}

JSX-இல் tags explicit ஆக closed இருக்க வேண்டும்: `<img>` போன்ற self-closing tags `<img />` ஆக மாற வேண்டும்; `<li>oranges` போன்ற wrapping tags `<li>oranges</li>` ஆக எழுதப்பட வேண்டும்.

Hedy Lamarr-ன் image மற்றும் list items closed ஆக இருந்தால் இவ்வாறு தெரியும்:

```js {2-6,8-10}
<>
  <img
    src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>புதிய traffic lights கண்டுபிடி</li>
    <li>ஒரு movie scene rehearse செய்</li>
    <li>Spectrum technology-ஐ மேம்படுத்து</li>
  </ul>
</>
```

### 3. பெரும்பாலானவற்றை camelCase செய்யுங்கள்! {/*3-camelcase-salls-most-of-the-things*/}

JSX JavaScript-ஆக மாறுகிறது; JSX-இல் எழுதப்பட்ட attributes JavaScript objects-ன் keys ஆக மாறுகின்றன. உங்கள் சொந்த components-இல், அந்த attributes-ஐ variables-குள் read செய்ய விரும்புவீர்கள். ஆனால் JavaScript variable names-க்கு limitations உள்ளன. உதாரணமாக, names dashes கொண்டிருக்க முடியாது; `class` போன்ற reserved words ஆகவும் இருக்க முடியாது.

இதனால் தான் React-இல் பல HTML மற்றும் SVG attributes camelCase-இல் எழுதப்படுகின்றன. உதாரணமாக, `stroke-width` பதிலாக `strokeWidth` பயன்படுத்துகிறீர்கள். `class` reserved word என்பதால், React-இல் அதற்கு பதிலாக [corresponding DOM property](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)-ன் பெயரால் `className` எழுதுகிறீர்கள்:

```js {4}
<img
  src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

[DOM component props பட்டியலில் இந்த attributes அனைத்தையும் காணலாம்.](/reference/react-dom/components/common) ஒன்றை தவறாக எழுதினால் கவலைப்பட வேண்டாம் - React [browser console](https://developer.mozilla.org/docs/Tools/Browser_Console)-இல் possible correction உடன் message print செய்யும்.

<Pitfall>

Historical reasons காரணமாக, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) மற்றும் [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) attributes HTML போலவே dashes உடன் எழுதப்படுகின்றன.

</Pitfall>

### Pro-tip: JSX converter பயன்படுத்துங்கள் {/*pro-tip-use-a-jsx-converter*/}

Existing markup-இல் இந்த attributes அனைத்தையும் convert செய்வது சலிப்பாக இருக்கலாம்! உங்கள் existing HTML மற்றும் SVG-ஐ JSX-க்கு translate செய்ய [converter](https://transform.tools/html-to-jsx) பயன்படுத்த பரிந்துரைக்கிறோம். Converters நடைமுறையில் மிகவும் பயனுள்ளவை; ஆனால் என்ன நடக்கிறது என்பதைப் புரிந்துகொள்வது இன்னும் மதிப்புள்ளது, அப்போதுதான் நீங்கள் சுலபமாக உங்கள் சொந்தமாக JSX எழுத முடியும்.

இது உங்கள் final result:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr-ன் Todos</h1>
      <img
        src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>புதிய traffic lights கண்டுபிடி</li>
        <li>ஒரு movie scene rehearse செய்</li>
        <li>Spectrum technology-ஐ மேம்படுத்து</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

இப்போது JSX ஏன் உள்ளது, components-இல் அதை எப்படி பயன்படுத்துவது என்பதை நீங்கள் அறிவீர்கள்:

* React components, markup உடன் rendering logic-ஐ group செய்கின்றன, ஏனெனில் அவை தொடர்புடையவை.
* JSX சில differences உடன் HTML-க்கு similar. தேவைப்பட்டால் [converter](https://transform.tools/html-to-jsx) பயன்படுத்தலாம்.
* Error messages பெரும்பாலும் உங்கள் markup fix செய்ய சரியான திசையை காட்டும்.

</Recap>



<Challenges>

#### சில HTML-ஐ JSX-ஆக convert செய்யுங்கள் {/*convert-some-html-to-jsx*/}

இந்த HTML ஒரு component-க்குள் paste செய்யப்பட்டது; ஆனால் இது valid JSX அல்ல. இதை fix செய்யுங்கள்:

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>என் website-க்கு வரவேற்கிறேன்!</h1>
    </div>
    <p class="summary">
      என் சிந்தனைகளை இங்கே காணலாம்.
      <br><br>
      <b>மேலும் <i>படங்கள்</b></i> scientists-ன்!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

கையால் செய்வதா அல்லது converter பயன்படுத்துவதா என்பது உங்கள் விருப்பம்!

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>என் website-க்கு வரவேற்கிறேன்!</h1>
      </div>
      <p className="summary">
        என் சிந்தனைகளை இங்கே காணலாம்.
        <br /><br />
        <b>மேலும் <i>படங்கள்</i></b> scientists-ன்!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
