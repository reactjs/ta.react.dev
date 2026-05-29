---
title: <ViewTransition>
version: canary
---



<Intro>

<Canary>

**`<ViewTransition />` API தற்போது React-ன் Canary மற்றும் Experimental channel-களில் மட்டுமே கிடைக்கிறது.**

[React-ன் release channel-கள் பற்றி இங்கே மேலும் அறிக.](/community/versioning-policy#all-release-channels)

</Canary>

`<ViewTransition>` Transitions மற்றும் Suspense உடன் component tree ஒன்றை animate செய்ய அனுமதிக்கிறது.

```js
import {ViewTransition} from 'react';

<ViewTransition>
  <div>...</div>
</ViewTransition>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<ViewTransition>` {/*viewtransition*/}

ஒரு component tree-ஐ animate செய்ய அதை `<ViewTransition>`-இல் wrap செய்யுங்கள்:

```js
<ViewTransition>
  <Page />
</ViewTransition>
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

<DeepDive>

#### `<ViewTransition>` எப்படி வேலை செய்கிறது? {/*how-does-viewtransition-work*/}

உள்ளே, `<ViewTransition>` component-க்குள் nested ஆன மிக அருகிலுள்ள DOM node-ன் inline style-களுக்கு React `view-transition-name`-ஐப் பயன்படுத்துகிறது. `<ViewTransition><div /><div /></ViewTransition>` போன்ற பல sibling DOM node-கள் இருந்தால், ஒவ்வொன்றும் unique ஆக இருக்க React பெயருக்கு suffix சேர்க்கிறது; ஆனால் கருத்து ரீதியாக அவை அதே ஒன்றின் பகுதிகளாகும். React இவற்றை முன்கூட்டியே apply செய்யாது; அந்த boundary animation-இல் பங்கேற்க வேண்டிய நேரத்தில் மட்டுமே apply செய்யும்.

React பின்னணியில் தானாகவே `startViewTransition`-ஐ call செய்கிறது; எனவே அதை நீங்கள் நீங்களே ஒருபோதும் செய்யக்கூடாது. உண்மையில், page-இல் வேறு ஏதாவது ViewTransition ஓடிக்கொண்டிருந்தால் React அதை interrupt செய்யும். எனவே இவற்றை coordinate செய்ய React-ஐயே பயன்படுத்துவது பரிந்துரைக்கப்படுகிறது. முன்பு ViewTransition-களை trigger செய்ய வேறு வழிகளைப் பயன்படுத்தியிருந்தால், built-in வழிக்கு migrate செய்ய பரிந்துரைக்கிறோம்.

மற்ற React ViewTransition-கள் ஏற்கனவே ஓடிக்கொண்டிருந்தால், அடுத்ததைத் தொடங்கும் முன் அவை முடியும் வரை React காத்திருக்கும். ஆனால் முக்கியமாக, முதல் animation ஓடிக்கொண்டிருக்கும்போது பல update-கள் நடந்தால், அவை அனைத்தும் ஒன்றாக batch செய்யப்படும். நீங்கள் A->B-ஐத் தொடங்கினால், நடுவில் C-க்கும் பிறகு D-க்கும் செல்ல update கிடைத்தால், முதல் A->B animation முடிந்ததும் அடுத்தது B->D-ஐ animate செய்யும்.

`startViewTransition`-க்கு முன் `getSnapshotBeforeUpdate` lifecycle call செய்யப்படும்; அதே நேரத்தில் சில `view-transition-name` update ஆகும்.

பின்னர் React `startViewTransition`-ஐ call செய்கிறது. `updateCallback`-க்குள் React:

- DOM-க்கு அதன் mutation-களை apply செய்து `useInsertionEffect`-ஐ invoke செய்யும்.
- font-கள் load ஆக காத்திருக்கும்.
- `componentDidMount`, `componentDidUpdate`, `useLayoutEffect` மற்றும் ref-களை call செய்யும்.
- pending Navigation ஏதேனும் முடியும் வரை காத்திருக்கும்.
- பிறகு எந்த boundary-கள் animate ஆக வேண்டும் என்பதைப் பார்க்க layout-இல் உள்ள மாற்றங்களை React measure செய்யும்.

`startViewTransition`-ன் ready Promise resolve ஆன பிறகு, React `view-transition-name`-ஐ revert செய்யும். பின்னர் animations மீது manual programmatic control வழங்க `onEnter`, `onExit`, `onUpdate`, மற்றும் `onShare` callback-களை React invoke செய்யும். built-in default animation-கள் ஏற்கனவே compute செய்யப்பட்ட பிறகு இது நடக்கும்.

இந்த sequence-ன் நடுவில் `flushSync` நடந்தால், synchronously முடிக்க முடிய வேண்டும் என்பதையே இது சார்ந்திருப்பதால் React Transition-ஐ skip செய்யும்.

`startViewTransition`-ன் finished Promise resolve ஆன பிறகு, React `useEffect`-ஐ invoke செய்யும். இது அவை animation performance-இல் குறுக்கிடுவதைத் தடுக்கிறது. ஆனால் இது ஒரு guarantee அல்ல; animation ஓடிக்கொண்டிருக்கும்போது இன்னொரு `setState` நடந்தால், sequential guarantee-களைப் பாதுகாக்க `useEffect`-ஐ முன்னதாகவே invoke செய்ய வேண்டியிருக்கும்.

</DeepDive>

#### Props {/*props*/}

- **optional** `name`: string அல்லது object. shared element transition-களுக்கு பயன்படுத்தப்படும் View Transition-ன் பெயர். இது வழங்கப்படாவிட்டால், எதிர்பாராத animation-களைத் தடுக்க ஒவ்வொரு View Transition-க்கும் React unique பெயரைப் பயன்படுத்தும்.
- [View Transition Class](#view-transition-class) props.
- [View Transition Event](#view-transition-event) props.

#### எச்சரிக்கைகள் {/*caveats*/}

- `name`-ஐ [shared element transition-களுக்கு](#animating-a-shared-element) மட்டும் பயன்படுத்துங்கள். மற்ற எல்லா animation-களுக்கும், எதிர்பாராத animation-களைத் தடுக்க React தானாகவே unique பெயரை உருவாக்கும்.
- இயல்பாக, `setState` உடனடியாக update ஆகும்; அது `<ViewTransition>`-ஐ activate செய்யாது. [Transition](/reference/react/useTransition), [`<Suspense>`](/reference/react/Suspense), அல்லது `useDeferredValue`-இல் wrap செய்யப்பட்ட update-கள் மட்டுமே ViewTransition-ஐ activate செய்யும்.
- `<ViewTransition>` நகர்த்தவும் scale செய்யவும் cross-fade செய்யவும் முடியும் image ஒன்றை உருவாக்குகிறது. React Native அல்லது Motion-இல் நீங்கள் பார்த்திருக்கக்கூடிய Layout Animation-களுக்கு மாறாக, இதன் உள்ளே இருக்கும் ஒவ்வொரு தனிப்பட்ட Element-மும் அதன் position-ஐ animate செய்யாது. ஒவ்வொரு தனிப்பட்ட துண்டையும் animate செய்வதைவிட, இது மேம்பட்ட performance-க்கும் தொடர்ச்சியான, smooth animation உணர்வுக்கும் வழிவகுக்கலாம். ஆனால் தனியே நகர வேண்டும் என எதிர்பார்க்கப்படும் விஷயங்களில் continuity இழக்கலாம். எனவே அதன் விளைவாக கூடுதல் `<ViewTransition>` boundary-களை கைமுறையாகச் சேர்க்க வேண்டியிருக்கும்.
- தற்போது, `<ViewTransition>` DOM-இல் மட்டுமே வேலை செய்கிறது. React Native மற்றும் பிற platform-களுக்கான support-ஐச் சேர்க்க நாங்கள் பணிபுரிகிறோம்.

#### Animation trigger-கள் {/*animation-triggers*/}

எந்த வகை View Transition animation-ஐ trigger செய்ய வேண்டும் என்பதை React தானாக தீர்மானிக்கும்:

- `enter`: இந்த Transition-இல் insert செய்யப்படும் முதல் component `ViewTransition` ஆக இருந்தால், இது activate ஆகும்.
- `exit`: இந்த Transition-இல் delete செய்யப்படும் முதல் component `ViewTransition` ஆக இருந்தால், இது activate ஆகும்.
- `update`: React செய்யும் DOM mutation ஏதேனும் `ViewTransition`-க்குள் இருந்தால் (prop மாறுவது போன்றது), அல்லது immediate sibling காரணமாக `ViewTransition` boundary-யே size அல்லது position மாறினால். nested `ViewTransition` இருந்தால் mutation அவற்றுக்கு apply ஆகும்; parent-க்கு அல்ல.
- `share`: named `ViewTransition` ஒன்று deleted subtree-க்குள் இருந்து, அதே பெயருள்ள மற்றொரு named `ViewTransition` அதே Transition-இல் inserted subtree-ன் பகுதியாக இருந்தால், அவை Shared Element Transition உருவாக்கும்; அது deleted ஒன்றிலிருந்து inserted ஒன்றுக்குச் animate செய்கிறது.

இயல்பாக, `<ViewTransition>` smooth cross-fade உடன் animate ஆகும் (browser-ன் default view transition).

ஒவ்வொரு வகை trigger-க்கும் `<ViewTransition>` component-க்கு [View Transition Class](#view-transition-class) வழங்கி animation-ஐ customize செய்யலாம் ([Styling View Transitions](#styling-view-transitions) பார்க்கவும்), அல்லது [ViewTransition Event-களை](#view-transition-events) பயன்படுத்தி [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) மூலம் JavaScript-இல் animation-ஐ control செய்யலாம்.

<Note>

#### எப்போதும் `prefers-reduced-motion`-ஐச் சரிபார்க்கவும் {/*always-check-prefers-reduced-motion*/}

பல பயனர்கள் page-இல் animation-கள் இல்லாமலிருக்க விரும்பலாம். இந்தச் சூழலில் React தானாக animation-களை disable செய்யாது.

பயனர் விருப்பத்தின் அடிப்படையில் animation-களை disable செய்ய அல்லது குறைக்க `@media (prefers-reduced-motion)` media query-ஐ எப்போதும் பயன்படுத்த பரிந்துரைக்கிறோம்.

எதிர்காலத்தில், CSS library-களின் preset-களில் இது built-in ஆக இருக்கலாம்.

</Note>

### View Transition Class {/*view-transition-class*/}

எந்த animation-கள் trigger ஆக வேண்டும் என்பதை வரையறுக்க `<ViewTransition>` props வழங்குகிறது:

```js
<ViewTransition
  default="none"
  enter="slide-up"
  exit="slide-down"
/>
```

#### Props {/*view-transition-class-props*/}

- **optional** `enter`: `"auto"`, `"none"`, a string, or an object.
- **optional** `exit`: `"auto"`, `"none"`, a string, or an object.
- **optional** `update`: `"auto"`, `"none"`, a string, or an object.
- **optional** `share`: `"auto"`, `"none"`, a string, or an object.
- **optional** `default`: `"auto"`, `"none"`, a string, or an object.

#### எச்சரிக்கைகள் {/*view-transition-class-caveats*/}

- `default` `"none"` ஆக இருந்தால், வெளிப்படையாக பட்டியலிடப்படாத அனைத்து trigger-களும் off செய்யப்படும்.

#### மதிப்புகள் {/*view-transition-values*/}

View Transition class value-கள் இவையாக இருக்கலாம்:
- `auto`: default. browser default animation-ஐப் பயன்படுத்தும்.
- `none`: இந்த வகைக்கான animation-களை disable செய்யும்.
- `<classname>`: [View Transition-களை customize செய்ய](#styling-view-transitions) பயன்படுத்தும் custom CSS class name.

Object value-கள் string key-களும் `auto`, `none` அல்லது custom className மதிப்பும் கொண்ட object ஆக இருக்கலாம்:
- `{[type]: value}`: animation [Transition Type](/reference/react/addTransitionType)-க்கு match ஆனால் `value`-ஐ apply செய்கிறது.
- `{default: value}`: எந்த [Transition Type](/reference/react/addTransitionType)-மும் match ஆகாவிட்டால் apply செய்யப்படும் default value.

உதாரணமாக, ViewTransition-ஐ இவ்வாறு define செய்யலாம்:

```js
<ViewTransition
  /* turn off any animation not defined below */
  default="none"
  enter={{
    /* apply slide-in for Transition Type `forward` */
    "forward": 'slide-in',
    /* otherwise use the browser default animation */
    "default": 'auto'
  }}
  /* use the browser default for exit animations*/
  exit="auto"
  /* apply a custom `cross-fade` class for updates */
  update="cross-fade"
>
```

custom animation-களுக்கான CSS class-களை எப்படி define செய்வது என்பதை [Styling View Transitions](#styling-view-transitions)-இல் பார்க்கவும்.

---

### View Transition Event {/*view-transition-event*/}

View Transition Event-கள் [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)-யைப் பயன்படுத்தி JavaScript மூலம் animation-ஐ control செய்ய அனுமதிக்கின்றன:

```js
<ViewTransition
  onEnter={instance => {/* ... */}}
  onExit={instance => {/* ... */}}
/>
```

#### Props {/*view-transition-event-props*/}

- **optional** `onEnter`: "enter" animation trigger ஆகும் போது call செய்யப்படும்.
- **optional** `onExit`: "exit" animation trigger ஆகும் போது call செய்யப்படும்.
- **optional** `onShare`: "share" animation trigger ஆகும் போது call செய்யப்படும்.
- **optional** `onUpdate`: "update" animation trigger ஆகும் போது call செய்யப்படும்.


#### எச்சரிக்கைகள் {/*view-transition-event-caveats*/}
- ஒவ்வொரு Transition-க்கும் ஒவ்வொரு `<ViewTransition>`-க்கு ஒரு event மட்டுமே fire ஆகும். `onEnter` மற்றும் `onExit`-ஐ விட `onShare` முன்னுரிமை பெறுகிறது.
- ஒவ்வொரு event-மும் **cleanup function** ஒன்றை return செய்ய வேண்டும். View Transition முடிந்ததும் cleanup function call செய்யப்படும்; இதனால் எந்த animation-களையும் cancel அல்லது cleanup செய்ய முடியும்.

#### Argument-கள் {/*view-transition-event-arguments*/}

ஒவ்வொரு event-க்கும் இரண்டு argument-கள் கிடைக்கும்:

- `instance`: view transition [pseudo-element-களுக்கு](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_process) அணுகலை வழங்கும் View Transition instance.
  - `old`: `::view-transition-old` pseudo-element.
  - `new`: `::view-transition-new` pseudo-element.
  - `name`: இந்த boundary-க்கான `view-transition-name` string.
  - `group`: `::view-transition-group` pseudo-element.
  - `imagePair`: `::view-transition-image-pair` pseudo-element.
- `types`: animation-இல் உள்ள [Transition Type-களின்](/reference/react/addTransitionType) `Array<string>`. type எதுவும் குறிப்பிடப்படவில்லை என்றால் காலியான array.

உதாரணமாக, JavaScript மூலம் animation-ஐ இயக்கும் `onEnter` event ஒன்றை define செய்யலாம்:

```js
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate([{opacity: 0}, {opacity: 1}], {
      duration: 500,
    });
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

மேலும் உதாரணங்களுக்கு [Animating with JavaScript](#animating-with-javascript) பார்க்கவும்.

---

## View Transition-களை style செய்தல் {/*styling-view-transitions*/}

<Note>

web-இல் உள்ள View Transition-களின் பல ஆரம்ப உதாரணங்களில், [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name)-ஐப் பயன்படுத்தி, பிறகு `::view-transition-...(my-name)` selector-கள் மூலம் style செய்வதை பார்த்திருப்பீர்கள். styling-க்கு அதை பரிந்துரைக்கவில்லை. அதற்கு பதிலாக பொதுவாக View Transition Class-ஐப் பயன்படுத்த பரிந்துரைக்கிறோம்.

</Note>

`<ViewTransition>`-க்கான animation-ஐ customize செய்ய, activation prop-களில் ஒன்றுக்கு View Transition Class வழங்கலாம். View Transition activate ஆகும் போது child element-களுக்கு React apply செய்யும் CSS class name-தான் View Transition Class.

உதாரணமாக, "enter" animation-ஐ customize செய்ய, `enter` prop-க்கு class name ஒன்றை வழங்குங்கள்:

```js
<ViewTransition enter="slide-in">
```

`<ViewTransition>` "enter" animation-ஐ activate செய்யும்போது, React `slide-in` class name-ஐச் சேர்க்கும். பிறகு reusable animation-களை உருவாக்க [view transition pseudo selector-களை](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API#pseudo-elements) பயன்படுத்தி இந்த class-ஐ refer செய்யலாம்:

```css
::view-transition-group(.slide-in) {
}
::view-transition-old(.slide-in) {
}
::view-transition-new(.slide-in) {
}
```

எதிர்காலத்தில், இதைப் பயன்படுத்த மேம்படுத்த CSS library-கள் View Transition Class-களைப் பயன்படுத்தி built-in animation-களைச் சேர்க்கலாம்.

---

## Usage {/*usage*/}

### enter/exit-இல் ஒரு element-ஐ animate செய்தல் {/*animating-an-element-on-enter*/}

ஒரு transition-இல் component ஒன்று `<ViewTransition>`-ஐ சேர்க்கும்போது அல்லது நீக்கும்போது Enter/Exit Transition-கள் trigger ஆகும்:

```js {3}
function Child() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <div>வணக்கம்</div>
    </ViewTransition>
  );
}

function Parent() {
  const [show, setShow] = useState();
  if (show) {
    return <Child />;
  }
  return null;
}
```

`setShow` call செய்யப்படும் போது, `show` `true` ஆக மாறி `Child` component render ஆகும். `startTransition`-க்குள் `setShow` call செய்யப்படும்போது, மேலும் `Child` வேறு எந்த DOM node-க்கும் முன் `ViewTransition`-ஐ render செய்தால், `enter` animation trigger ஆகும்.

`show` மீண்டும் `false` ஆக மாறும்போது, `exit` animation trigger ஆகும்.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Pitfall>

#### top-level ViewTransition-கள் மட்டுமே exit/enter-இல் animate ஆகும் {/*only-top-level-viewtransition-animates-on-exit-enter*/}

`<ViewTransition>` எந்த DOM node-க்கும் _முன்_ வைக்கப்பட்டால் மட்டுமே exit/enter-ஐ activate செய்யும்.

`<ViewTransition>`-க்கு மேலே `<div>` இருந்தால், exit/enter animation எதுவும் trigger ஆகாது:

```js [3, 5]
function Item() {
  return (
    <div> {/* 🚩<div> above <ViewTransition> breaks exit/enter */}
      <ViewTransition enter="auto" exit="auto" default="none">
        <Video video={videos[0]} />
      </ViewTransition>
    </div>
  );
}
```

அதிகமாகவோ குறைவாகவோ animate ஆகும் நுணுக்கமான bug-களை இந்த கட்டுப்பாடு தடுக்கிறது.

</Pitfall>

---

### Activity உடன் enter/exit-ஐ animate செய்தல் {/*animating-enter-exit-with-activity*/}

ஒரு component-ன் state-ஐப் பாதுகாத்தபடி அதை உள்ளே/வெளியே animate செய்ய, அல்லது animation-க்காக content-ஐ pre-render செய்ய விரும்பினால், [`<Activity>`](/reference/react/Activity)-ஐப் பயன்படுத்தலாம். `<Activity>`-க்குள் உள்ள `<ViewTransition>` visible ஆகும்போது, `enter` animation activate ஆகும். அது hidden ஆகும்போது, `exit` animation activate ஆகும்:

```js
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="auto" exit="auto">
    <Counter />
  </ViewTransition>
</Activity>

```

இந்த உதாரணத்தில், `Counter`-க்கு internal state உடைய counter உள்ளது. counter-ஐ increment செய்து, அதை hide செய்து, பிறகு மீண்டும் show செய்து பாருங்கள். sidebar உள்ளே/வெளியே animate ஆகும்போது counter-ன் மதிப்பு பாதுகாக்கப்படுகிறது:

<Sandpack>

```js
import { Activity, ViewTransition, useState, startTransition } from 'react';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div className="layout">
      <Toggle show={show} setShow={setShow} />
      <Activity mode={show ? 'visible' : 'hidden'}>
        <ViewTransition enter="auto" exit="auto" default="none">
          <Counter />
        </ViewTransition>
      </Activity>
    </div>
  );
}
function Toggle({show, setShow}) {
  return (
    <button
      className="toggle"
      onClick={() => {
        startTransition(() => {
          setShow(s => !s);
        });
      }}>
      {show ? 'மறை' : 'காட்டு'}
    </button>
  )
}
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="counter">
      <h2>எண்ணி</h2>
      <p>எண்ணிக்கை: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        அதிகரி
      </button>
    </div>
  );
}

```

```css
.layout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 200px;
}
.counter {
  padding: 15px;
  background: #f0f4f8;
  border-radius: 8px;
  width: 200px;
}
.counter h2 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.counter p {
  margin: 0 0 10px 0;
}
.toggle {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f0f8ff;
  cursor: pointer;
  font-size: 14px;
}
.toggle:hover {
  background: #e0e8ff;
}
.counter button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`<Activity>` இல்லாமல், sidebar மீண்டும் தோன்றும் ஒவ்வொரு முறையும் counter `0`-க்கு reset ஆகும்.

---

### shared element ஒன்றை animate செய்தல் {/*animating-a-shared-element*/}

பொதுவாக, `<ViewTransition>`-க்கு பெயர் assign செய்வதை பரிந்துரைக்க மாட்டோம்; அதற்கு பதிலாக React தானாக பெயர் assign செய்ய அனுமதிக்கிறோம். continuity-ஐப் பாதுகாக்க, ஒரு tree unmount ஆகி மற்றொரு tree அதே நேரத்தில் mount ஆகும்போது முற்றிலும் வேறு component-களுக்கிடையே animate செய்ய வேண்டுமெனில் பெயர் assign செய்ய விரும்பலாம்.

```js
<ViewTransition name={UNIQUE_NAME}>
  <Child />
</ViewTransition>
```

ஒரு tree unmount ஆகி மற்றொன்று mount ஆகும்போது, unmount ஆகும் tree-யிலும் mount ஆகும் tree-யிலும் அதே பெயர் இருக்கும் pair இருந்தால், அவை இரண்டிலும் "share" animation-ஐ trigger செய்யும். அது unmount ஆகும் பக்கத்திலிருந்து mount ஆகும் பக்கத்துக்கு animate செய்கிறது.

exit/enter animation-க்கு மாறாக, இது deleted/mounted tree-க்குள் ஆழமாக இருக்கலாம். ஒரு `<ViewTransition>` exit/enter-க்கும் eligible ஆக இருந்தால், "share" animation முன்னுரிமை பெறும்.

Transition முதலில் ஒரு பக்கத்தை unmount செய்து, பிறகு இறுதியில் புதிய பெயர் mount ஆகும் முன் `<Suspense>` fallback காட்டப்படுமாறு செய்தால், shared element transition நடக்காது.

<Sandpack>

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video, Thumbnail, FullscreenVideo} from './Video';
import videos from './data';

export default function Component() {
  const [fullscreen, setFullscreen] = useState(false);
  if (fullscreen) {
    return (
      <FullscreenVideo
        video={videos[0]}
        onExit={() => startTransition(() => setFullscreen(false))}
      />
    );
  }
  return (
    <Video
      video={videos[0]}
      onClick={() => startTransition(() => setFullscreen(true))}
    />
  );
}
```

```js src/Video.js
import {ViewTransition} from 'react';

const THUMBNAIL_NAME = 'video-thumbnail';

export function Thumbnail({video, children}) {
  return (
    <ViewTransition name={THUMBNAIL_NAME}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      />
    </ViewTransition>
  );
}

export function Video({video, onClick}) {
  return (
    <div className="video">
      <div className="link" onClick={onClick}>
        <Thumbnail video={video} />
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function FullscreenVideo({video, onExit}) {
  return (
    <div className="fullscreenLayout">
      <ViewTransition name={THUMBNAIL_NAME}>
        <div
          aria-hidden="true"
          tabIndex={-1}
          className={`thumbnail ${video.image} fullscreen`}
        />
        <button className="close-button" onClick={onExit}>
          ✖
        </button>
      </ViewTransition>
    </div>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.fullscreen {
  width: 100%;
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
.fullscreenLayout {
  position: relative;
  height: 100%;
  width: 100%;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
}
@keyframes progress-animation {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

ஒரு pair-இன் mounted அல்லது unmounted பக்கம் viewport-க்கு வெளியே இருந்தால், pair உருவாகாது. ஏதாவது scroll செய்யப்படும் போது அது viewport-க்கு உள்ளே அல்லது வெளியே பறந்து வராமல் இருப்பதை இது உறுதிசெய்கிறது. அதற்கு பதிலாக அது தனியாக regular enter/exit ஆக நடத்தப்படும்.

அதே Component instance position மாறினால் இது நடக்காது; அது "update"-ஐ trigger செய்கிறது. ஒரு position viewport-க்கு வெளியே இருந்தாலும் அவை animate ஆகும்.

ஆழமாக nested ஆன unmounted `<ViewTransition>` viewport-க்குள் இருந்தும் mounted பக்கம் viewport-க்குள் இல்லாத known case ஒன்று உள்ளது; அப்போது unmounted பக்கம் parent animation-ன் பகுதியாக அல்லாமல், அது ஆழமாக nested இருந்தாலும் தன் சொந்த "exit" animation ஆக animate ஆகும்.

</Note>

<Pitfall>

முழு app-இல் ஒரே நேரத்தில் அதே பெயருடன் mount ஆன ஒன்று மட்டுமே இருப்பது முக்கியம். எனவே conflict-களைத் தவிர்க்க பெயருக்கு unique namespace-களைப் பயன்படுத்துவது முக்கியம். இதைச் செய்ய முடியும் என்பதை உறுதிசெய்ய, நீங்கள் import செய்யும் தனி module-இல் constant ஒன்றைச் சேர்க்கலாம்.

```js
export const MY_NAME = "my-globally-unique-name";
import {MY_NAME} from './shared-name';
...
<ViewTransition name={MY_NAME}>
```

</Pitfall>

---

### list-இல் item-களின் reorder-ஐ animate செய்தல் {/*animating-reorder-of-items-in-a-list*/}

```js
items.map((item) => <Component key={item.id} item={item} />);
```

content-ஐ update செய்யாமல் list-ஐ reorder செய்யும்போது, அவை DOM node-க்கு வெளியே இருந்தால், list-இல் உள்ள ஒவ்வொரு `<ViewTransition>`-க்கும் "update" animation trigger ஆகும். enter/exit animation-களைப் போல.

இதன் பொருள், இது இந்த `<ViewTransition>`-இல் animation-ஐ trigger செய்யும்:

```js
function Component() {
  return (
    <ViewTransition>
      <div>...</div>
    </ViewTransition>
  );
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <div className="listContainer">
        {orderedVideos.map((video, i) => {
          return (
            <ViewTransition key={video.title}>
              <Video video={video} />
            </ViewTransition>
          );
        })}
      </div>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
  {
    id: '2',
    title: 'இரண்டாவது வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'red',
  },
  {
    id: '3',
    title: 'மூன்றாவது வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'green',
  },
  {
    id: '4',
    title: 'நான்காவது வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

ஆனால் இது ஒவ்வொரு தனிப்பட்ட item-ஐ animate செய்யாது:

```js
function Component() {
  return (
    <div>
      <ViewTransition>...</ViewTransition>
    </div>
  );
}
```

அதற்கு பதிலாக, parent `<ViewTransition>` ஏதேனும் இருந்தால் அது cross-fade ஆகும். parent `<ViewTransition>` இல்லையெனில், அந்தச் சூழலில் animation இல்லை.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

export default function Component() {
  const [orderedVideos, setOrderedVideos] = useState(videos);
  const reorder = () => {
    startTransition(() => {
      setOrderedVideos((prev) => {
        return [...prev.sort(() => Math.random() - 0.5)];
      });
    });
  };
  return (
    <>
      <button onClick={reorder}>🎲</button>
      <ViewTransition>
        <div className="listContainer">
          {orderedVideos.map((video, i) => {
            return <Video video={video} key={video.title} />;
          })}
        </div>
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
  {
    id: '2',
    title: 'இரண்டாவது வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'red',
  },
  {
    id: '3',
    title: 'மூன்றாவது வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'green',
  },
  {
    id: '4',
    title: 'நான்காவது வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'purple',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}
.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}
.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Component தன் சொந்த reorder animation-ஐ control செய்ய அனுமதிக்க விரும்பும் list-களில் wrapper element-களைத் தவிர்க்கலாம் என்பதைக் குறிக்கிறது:

```
items.map(item => <div><Component key={item.id} item={item} /></div>)
```

item-களில் ஒன்று resize ஆக update ஆகி, அதனால் sibling-களும் resize ஆகும் சூழலுக்கும் மேலுள்ள விதி பொருந்தும்; அவை immediate sibling-களாக இருந்தால் மட்டுமே அது sibling `<ViewTransition>`-ஐயும் animate செய்யும்.

அதாவது அதிக re-layout ஏற்படுத்தும் update-இன் போது, page-இல் உள்ள ஒவ்வொரு `<ViewTransition>`-யையும் தனித்தனியாக animate செய்யாது. அது உண்மையான மாற்றத்திலிருந்து கவனத்தைத் திருப்பும் பல noisy animation-களுக்கு வழிவகுக்கும். எனவே தனிப்பட்ட animation எப்போது trigger ஆக வேண்டும் என்பதில் React சற்றுக் கவனமாக இருக்கும்.

<Pitfall>

list-களை reorder செய்யும்போது identity-ஐப் பாதுகாக்க key-களை சரியாகப் பயன்படுத்துவது முக்கியம். reorder-களை animate செய்ய "name", shared element transition-களைப் பயன்படுத்தலாம் போல தோன்றலாம்; ஆனால் ஒரு பக்கம் viewport-க்கு வெளியே இருந்தால் அது trigger ஆகாது. reorder-ஐ animate செய்யும்போது அது viewport-க்கு வெளியே உள்ள position-க்கு சென்றதைப் பல நேரங்களில் காட்ட விரும்புவீர்கள்.

</Pitfall>

---

### Suspense content-இலிருந்து animate செய்தல் {/*animating-from-suspense-content*/}

எந்த Transition போலவே, animation ஓடுவதற்கு முன் data மற்றும் புதிய CSS (`<link rel="stylesheet" precedence="...">`) க்காக React காத்திருக்கும். இதற்கு கூடுதலாக, புதிய font-கள் பின்னர் flicker ஆகாமல் இருக்க animation தொடங்குவதற்கு முன் ViewTransition-கள் அவை load ஆக 500ms வரை காத்திருக்கும். அதே காரணத்திற்காக, ViewTransition-இல் wrap செய்யப்பட்ட image, image load ஆக காத்திருக்கும்.

இது புதிய Suspense boundary instance-க்குள் இருந்தால், fallback முதலில் காட்டப்படும். Suspense boundary முழுமையாக load ஆன பிறகு, content reveal-ஐ animate செய்ய அது `<ViewTransition>`-ஐ trigger செய்கிறது.

`<ViewTransition>`-ஐ எங்கே வைக்கிறீர்கள் என்பதன் அடிப்படையில் Suspense boundary-களை animate செய்ய இரண்டு வழிகள் உள்ளன:

**Update:**

```
<ViewTransition>
  <Suspense fallback={<A />}>
    <B />
  </Suspense>
</ViewTransition>
```

இந்தச் சூழலில் content A-இலிருந்து B-க்கு மாறும்போது, அது "update" ஆக நடத்தப்படும்; பொருத்தமானால் அந்த class apply செய்யப்படும். A மற்றும் B இரண்டுக்கும் அதே view-transition-name கிடைக்கும், எனவே இயல்பாக அவை cross-fade போல செயல்படும்.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, Suspense} from 'react';
import {Video, VideoPlaceholder} from './Video';
import {useLazyVideoData} from './data';

function LazyVideo() {
  const video = useLazyVideoData();
  return <Video video={video} />;
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>
      {showItem ? (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      ) : null}
    </>
  );
}
```

```js src/data.js hidden
import {use} from 'react';

let cache = null;

function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'முதல் வீடியோ',
          description: 'வீடியோ விளக்கம்',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}

export function useLazyVideoData() {
  return use(fetchVideo());
}
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

**Enter/Exit:**

```
<Suspense fallback={<ViewTransition><A /></ViewTransition>}>
  <ViewTransition><B /></ViewTransition>
</Suspense>
```

இந்தச் சூழலில், இவை தத்தமுடைய `view-transition-name` கொண்ட இரண்டு தனித்தனி ViewTransition instance-கள். இது `<A>`-ன் "exit" மற்றும் `<B>`-ன் "enter" ஆக நடத்தப்படும்.

`<ViewTransition>` boundary-ஐ எங்கே வைக்கிறீர்கள் என்பதன் அடிப்படையில் வேறு effect-களைப் பெறலாம்.

---

### animation ஒன்றிலிருந்து opt out செய்தல் {/*opting-out-of-an-animation*/}

சில நேரங்களில் முழு page போன்ற பெரிய existing component ஒன்றை wrap செய்து, theme மாற்றம் போன்ற சில update-களை animate செய்ய விரும்பலாம். ஆனால் முழு page-க்குள் update ஆகும் எல்லா update-களும் cross-fade ஆக opt-in ஆக வேண்டாம் என்று நினைக்கலாம். குறிப்பாக நீங்கள் animation-களை படிப்படியாகச் சேர்க்கும்போது.

animation ஒன்றிலிருந்து opt out செய்ய "none" class-ஐப் பயன்படுத்தலாம். உங்கள் children-ஐ "none"-இல் wrap செய்வதன் மூலம், parent இன்னும் trigger ஆகினாலும் அவற்றின் update-களுக்கான animation-களை disable செய்யலாம்.

```js
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">{children}</ViewTransition>
  </div>
</ViewTransition>
```

theme மாறினால் மட்டுமே இது animate ஆகும்; children மட்டும் update ஆனால் அல்ல. children தங்களுடைய `<ViewTransition>` மூலம் மீண்டும் opt-in ஆகலாம், ஆனால் குறைந்தது அது மீண்டும் manual ஆக இருக்கும்.

---

### animation-களை customize செய்தல் {/*customizing-animations*/}

இயல்பாக, `<ViewTransition>` browser-இலிருந்து default cross-fade-ஐ உட்கொண்டுள்ளது.

animation-களை customize செய்ய, `<ViewTransition>` எப்படி activate ஆகிறது என்பதன் அடிப்படையில் எந்த animation-களை பயன்படுத்த வேண்டும் என்பதை குறிப்பிட `<ViewTransition>` component-க்கு props வழங்கலாம்.

உதாரணமாக, default cross fade animation-ஐ மெதுவாக்கலாம்:

```js
<ViewTransition default="slow-fade">
  <Video />
</ViewTransition>
```

மேலும் view transition class-களைப் பயன்படுத்தி CSS-இல் slow-fade-ஐ define செய்யலாம்:

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition default="slow-fade">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`default`-ஐ அமைப்பதற்குப் கூடுதலாக, `enter`, `exit`, `update`, மற்றும் `share` animation-களுக்கான configuration-களையும் வழங்கலாம்.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### type-களுடன் animation-களை customize செய்தல் {/*customizing-animations-with-types*/}

குறிப்பிட்ட activation trigger-க்கு குறிப்பிட்ட transition type activate ஆகும்போது child element-களுக்கு class name சேர்க்க [`addTransitionType`](/reference/react/addTransitionType) API-யைப் பயன்படுத்தலாம். இது ஒவ்வொரு transition type-க்கும் animation-ஐ customize செய்ய அனுமதிக்கிறது.

உதாரணமாக, அனைத்து forward மற்றும் backward navigation-களுக்கான animation-ஐ customize செய்ய:

```js
<ViewTransition
  default={{
    'navigation-back': 'slide-right',
    'navigation-forward': 'slide-left',
  }}>
  <div>...</div>
</ViewTransition>;

// in your router:
startTransition(() => {
  addTransitionType('navigation-' + navigationType);
});
```

ViewTransition "navigation-back" animation-ஐ activate செய்யும்போது, React "slide-right" class name-ஐச் சேர்க்கும். ViewTransition "navigation-forward" animation-ஐ activate செய்யும்போது, React "slide-left" class name-ஐச் சேர்க்கும்.

எதிர்காலத்தில், router-களும் பிற library-களும் standard view-transition type-களுக்கும் style-களுக்கும் support சேர்க்கலாம்.

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
} from 'react';
import {Video} from './Video';
import videos from './data';

function Item() {
  return (
    <ViewTransition
      enter={{
        'add-video-back': 'slide-in-back',
        'add-video-forward': 'slide-in-forward',
      }}
      exit={{
        'remove-video-back': 'slide-in-forward',
        'remove-video-forward': 'slide-in-back',
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-back');
              } else {
                addTransitionType('add-video-back');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              if (showItem) {
                addTransitionType('remove-video-forward');
              } else {
                addTransitionType('add-video-forward');
              }
              setShowItem((prev) => !prev);
            });
          }}>
          ➡️
        </button>
      </div>
      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
::view-transition-old(.slide-in-back) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-back) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-back) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-back) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-in-forward) {
  animation-name: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-in-forward) {
  animation-name: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-old(.slide-out-forward) {
  animation-name: slideOutRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

::view-transition-new(.slide-out-forward) {
  animation-name: slideInRight;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### JavaScript மூலம் animate செய்தல் {/*animating-with-javascript*/}

[View Transition Class-கள்](#view-transition-class) CSS மூலம் animation-களை define செய்ய அனுமதித்தாலும், சில நேரங்களில் animation மீது imperative control தேவைப்படும். `onEnter`, `onExit`, `onUpdate`, மற்றும் `onShare` callback-கள் view transition pseudo-element-களுக்கு நேரடி அணுகலை வழங்குகின்றன; எனவே [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)-யைப் பயன்படுத்தி அவற்றை animate செய்யலாம்.

ஒவ்வொரு callback-க்கும் view transition pseudo-element-களை பிரதிநிதித்துவப்படுத்தும் `.old` மற்றும் `.new` property-கள் கொண்ட `instance` கிடைக்கும். DOM element-இல் செய்வது போலவே அவற்றிலும் `.animate()`-ஐ call செய்யலாம்:

```js
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      [
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'},
      ],
      {duration: 300, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}>
  <div>...</div>
</ViewTransition>
```

இது CSS-driven animation-களையும் JavaScript-driven animation-களையும் இணைக்க அனுமதிக்கிறது.

பின்வரும் உதாரணத்தில், default cross-fade CSS மூலம் கையாளப்படுகிறது; slide animation-கள் `onEnter` மற்றும் `onExit` animation-களில் JavaScript மூலம் இயக்கப்படுகின்றன:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      default="none"
      /* CSS driven cross fade defaults */
      enter="auto"
      exit="auto"
      /* JS driven slide animations */
      onEnter={(instance) => {
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: 500, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance) => {
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: 300, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {transform: 'translateY(20px)'},
  {transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {transform: 'translateY(0)'},
  {transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

<Note>

#### View Transition Event-களை எப்போதும் clean up செய்யுங்கள் {/*always-clean-up-view-transition-events*/}

View Transition Event-கள் எப்போதும் cleanup function ஒன்றை return செய்ய வேண்டும்:

```js {7}
<ViewTransition
  onEnter={(instance) => {
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: 500, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

View Transition interrupt செய்யப்படும் போது animation-ஐ cancel செய்ய இது browser-க்கு அனுமதிக்கிறது.

</Note>

---

### JavaScript மூலம் transition type-களை animate செய்தல் {/*animating-transition-types-with-javascript*/}

Transition எப்படி trigger செய்யப்பட்டது என்பதன் அடிப்படையில் வேறு animation-களை conditionally apply செய்ய, `ViewTransition` event-களுக்கு pass செய்யப்படும் `types`-ஐப் பயன்படுத்தலாம்.

```js {3}
 <ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 2000;
    const anim = instance.new.animate(
      SLIDE_IN,
      {duration: duration, easing: 'ease-out'}
    );
    return () => anim.cancel();
  }}
>
```

இந்த உதாரணம் Transition-ஐ "fast" என குறிக்க [`addTransitionType`](/reference/react/addTransitionType)-ஐ call செய்து, பின்னர் animation duration-ஐ adjust செய்கிறது:

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {ViewTransition, useState, startTransition, addTransitionType} from 'react';
import {Video} from './Video';
import videos from './data';
import {SLIDE_IN, SLIDE_OUT} from './animations';

function Item() {
  return (
    <ViewTransition
      onEnter={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 2000;
        const anim = instance.new.animate(
          SLIDE_IN,
          {duration: duration, easing: 'ease-out'}
        );
        return () => anim.cancel();
      }}
      onExit={(instance, types) => {
        const duration = types.includes('fast') ? 150 : 500;
        const anim = instance.old.animate(
          SLIDE_OUT,
          {duration: duration, easing: 'ease-in'}
        );
        return () => anim.cancel();
      }}>
      <Video video={videos[0]} />
    </ViewTransition>
  );
}

export default function Component() {
  const [showItem, setShowItem] = useState(false);
  const [isFast, setIsFast] = useState(false);
  return (
    <>
      <div>
        வேகம்: <input type="checkbox" onChange={() => {setIsFast(f => !f)}} value={isFast}></input>
      </div><br />
      <button
        onClick={() => {
          startTransition(() => {
            if (isFast) {
              addTransitionType('fast');
            }
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem ? <Item /> : null}
    </>
  );
}
```

```js src/animations.js
export const SLIDE_IN = [
  {opacity: 0, transform: 'translateY(20px)'},
  {opacity: 1, transform: 'translateY(0)'},
];

export const SLIDE_OUT = [
  {opacity: 1, transform: 'translateY(0)'},
  {opacity: 0, transform: 'translateY(-20px)'},
];
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'முதல் வீடியோ',
    description: 'வீடியோ விளக்கம்',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}

```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### View Transition enabled router-களை உருவாக்குதல் {/*building-view-transition-enabled-routers*/}

scroll restoration animation-க்குள் நடப்பதை உறுதிசெய்ய, pending Navigation ஏதேனும் முடியும் வரை React காத்திருக்கும். Navigation React-இல் blocked ஆக இருந்தால், `useEffect` deadlock-க்கு வழிவகுக்கும் என்பதால், உங்கள் router `useLayoutEffect`-இல் unblock செய்ய வேண்டும்.

legacy popstate event-இலிருந்து `startTransition` தொடங்கப்பட்டால், உதாரணமாக "back" navigation-இன் போது, scroll மற்றும் form restoration சரியாக வேலை செய்வதை உறுதிசெய்ய அது synchronously முடிக்கப்பட வேண்டும். இது View Transition animation ஓடுவதுடன் முரண்படும். எனவே React popstate-இலிருந்து வரும் animation-களை skip செய்யும்; back button-க்கு animation ஓடாது. உங்கள் router-ஐ Navigation API பயன்படுத்துமாறு upgrade செய்வதன் மூலம் இதைச் சரிசெய்யலாம்.

---

## Troubleshooting {/*troubleshooting*/}

### என் `<ViewTransition>` activate ஆகவில்லை {/*my-viewtransition-is-not-activating*/}

`<ViewTransition>` எந்த DOM node-க்கும் முன் வைக்கப்பட்டால் மட்டுமே activate ஆகும்:

```js [3, 5]
function Component() {
  return (
    <div>
      <ViewTransition>வணக்கம்</ViewTransition>
    </div>
  );
}
```

சரிசெய்ய, `<ViewTransition>` மற்ற எந்த DOM node-க்கும் முன் வருவதை உறுதிசெய்யுங்கள்:

```js [3, 5]
function Component() {
  return (
    <ViewTransition>
      <div>வணக்கம்</div>
    </ViewTransition>
  );
}
```

### "There are two `<ViewTransition name=%s>` components with the same name mounted at the same time." என்ற error வருகிறது {/*two-viewtransition-with-same-name*/}

ஒரே `name` கொண்ட இரண்டு `<ViewTransition>` component-கள் ஒரே நேரத்தில் mount ஆனால் இந்த error ஏற்படும்:

```js [3]
function Item() {
  // 🚩 All items will get the same "name".
  return <ViewTransition name="item">...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} />
      ))}
    </>
  );
}
```

இதனால் View Transition error ஆகும். development-இல், React இந்த issue-வை வெளிக்காட்ட detect செய்து இரண்டு error-களை log செய்கிறது:

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

There are two `<ViewTransition name=%s>` components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.
{' '}at Item
{' '}at ItemList

</ConsoleLogLine>

<ConsoleLogLine level="error">

The existing `<ViewTransition name=%s>` duplicate has this stack trace.
{' '}at Item
{' '}at ItemList

</ConsoleLogLine>
</ConsoleBlockMulti>

சரிசெய்ய, `name` unique என்பதை உறுதிசெய்தோ அல்லது பெயருக்கு `id` சேர்த்தோ, முழு app-இல் ஒரே நேரத்தில் அதே பெயருடன் ஒரே ஒரு `<ViewTransition>` மட்டுமே mount ஆகும் என்பதை உறுதிசெய்யுங்கள்:

```js [3]
function Item({id}) {
  // ✅ All items will get a unique name.
  return <ViewTransition name={`item-${id}`}>...</ViewTransition>;
}

function ItemList({items}) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
}
```
