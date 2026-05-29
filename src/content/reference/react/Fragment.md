---
title: <Fragment> (<>...</>)
---

<Intro>

அடிக்கடி `<>...</>` syntax மூலம் பயன்படுத்தப்படும் `<Fragment>`, wrapper node இல்லாமல் elements-ஐ group செய்ய உதவுகிறது.

<Canary> Fragments refs-ஐயும் accept செய்ய முடியும்; wrapper elements சேர்க்காமல் underlying DOM nodes உடன் interact செய்ய இது உதவுகிறது. Reference மற்றும் usage-ஐ கீழே பார்க்கவும்.</Canary>

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `<Fragment>` {/*fragment*/}

ஒரே element தேவைப்படும் சூழல்களில் elements-ஐ ஒன்றாக group செய்ய அவற்றை `<Fragment>`-இல் wrap செய்யுங்கள். `Fragment`-இல் elements-ஐ group செய்வதால் resulting DOM-இல் எந்த மாற்றமும் இல்லை; elements group செய்யப்படாதது போலவே இருக்கும். பெரும்பாலான சூழல்களில் empty JSX tag `<></>` என்பது `<Fragment></Fragment>`-க்கு shorthand.

#### Props {/*props*/}

- **optional** `key`: Explicit `<Fragment>` syntax மூலம் declare செய்யப்பட்ட Fragments-க்கு [keys](/learn/rendering-lists#keeping-list-items-in-order-with-key) இருக்கலாம்.
- <CanaryBadge />  **optional** `ref`: Ref object (எ.கா. [`useRef`](/reference/react/useRef)-இலிருந்து) அல்லது [callback function](/reference/react-dom/components/common#ref-callback). Fragment wrap செய்துள்ள DOM nodes உடன் interact செய்ய methods implement செய்யும் `FragmentInstance`-ஐ ref value ஆக React வழங்கும்.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

ஒரு fragment-க்கு ref pass செய்தால், fragment wrap செய்துள்ள DOM nodes உடன் interact செய்ய methods கொண்ட `FragmentInstance` object-ஐ React வழங்கும்:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Fragment-ன் அனைத்து first-level DOM children-க்கும் event listener சேர்க்கிறது.
- `removeEventListener(type, listener, options?)`: Fragment-ன் அனைத்து first-level DOM children-இலிருந்தும் event listener அகற்றுகிறது.
- `dispatchEvent(event)`: சேர்க்கப்பட்ட listeners-ஐ call செய்ய Fragment-ன் virtual child-க்கு event dispatch செய்கிறது; மேலும் DOM parent-க்கு bubble ஆகலாம்.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Fragment-ன் document position-ஐ மற்றொரு node உடன் compare செய்கிறது.
  - Fragment-க்கு children இருந்தால், native `compareDocumentPosition` value return செய்யப்படும்.
  - Empty Fragments React tree-க்குள் positioning-ஐ compare செய்ய முயன்று `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`-ஐ சேர்க்கும்.
  - Portaling அல்லது பிற insertions காரணமாக React tree மற்றும் DOM tree-இல் வேறுபட்ட relationship கொண்ட elements `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` ஆகும்.
- `getClientRects()`: அனைத்து children-ன் bounding rectangles-ஐ represent செய்யும் `DOMRect` objects-ன் flat array-ஐ return செய்கிறது.
- `getRootNode()`: Fragment-ன் parent DOM node-ஐ கொண்ட root node-ஐ return செய்கிறது.

**Focus management methods:**
- `focus(options?)`: Fragment-இல் உள்ள முதல் focusable DOM node-ஐ focus செய்கிறது. Nested children மீது depth-first முறையில் focus முயற்சி செய்யப்படும்.
- `focusLast(options?)`: Fragment-இல் உள்ள கடைசி focusable DOM node-ஐ focus செய்கிறது. Nested children மீது depth-first முறையில் focus முயற்சி செய்யப்படும்.
- `blur()`: `document.activeElement` Fragment-க்குள் இருந்தால் focus-ஐ அகற்றுகிறது.

**Observer methods:**
- `observeUsing(observer)`: IntersectionObserver அல்லது ResizeObserver மூலம் Fragment-ன் DOM children-ஐ observe செய்யத் தொடங்குகிறது.
- `unobserveUsing(observer)`: குறிப்பிட்ட observer மூலம் Fragment-ன் DOM children-ஐ observe செய்வதை நிறுத்துகிறது.

#### Caveats {/*caveats*/}

- Fragment-க்கு `key` pass செய்ய விரும்பினால், `<>...</>` syntax பயன்படுத்த முடியாது. `'react'`-இலிருந்து `Fragment`-ஐ explicit-ஆக import செய்து `<Fragment key={yourKey}>...</Fragment>` render செய்ய வேண்டும்.

- `<><Child /></>` render செய்வதிலிருந்து `[<Child />]`-க்கு அல்லது மீண்டும் அதற்கு செல்லும்போதோ, `<><Child /></>` render செய்வதிலிருந்து `<Child />`-க்கு அல்லது மீண்டும் அதற்கு செல்லும்போதோ React [state-ஐ reset செய்யாது](/learn/preserving-and-resetting-state). இது ஒரே level ஆழத்திற்கே வேலை செய்கிறது: உதாரணமாக, `<><><Child /></></>`-இலிருந்து `<Child />`-க்கு சென்றால் state reset ஆகும். துல்லியமான semantics-ஐ [இங்கே](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b) பார்க்கவும்.

- <CanaryBadge /> Fragment-க்கு `ref` pass செய்ய விரும்பினால், `<>...</>` syntax பயன்படுத்த முடியாது. `'react'`-இலிருந்து `Fragment`-ஐ explicit-ஆக import செய்து `<Fragment ref={yourRef}>...</Fragment>` render செய்ய வேண்டும்.

---

## பயன்பாடு {/*usage*/}

### பல elements return செய்தல் {/*returning-multiple-elements*/}

பல elements-ஐ ஒன்றாக group செய்ய `Fragment` அல்லது அதற்கு equivalent ஆன `<>...</>` syntax-ஐப் பயன்படுத்துங்கள். ஒரே element செல்லக்கூடிய எந்த இடத்திலும் பல elements வைக்க இதைப் பயன்படுத்தலாம். உதாரணமாக, ஒரு component ஒரே element மட்டும் return செய்ய முடியும்; ஆனால் Fragment பயன்படுத்தி பல elements-ஐ ஒன்றாக group செய்து, பின்னர் அவற்றை group ஆக return செய்யலாம்:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments பயனுள்ளவை; ஏனெனில் DOM element போன்ற மற்றொரு container-இல் wrap செய்வதைப் போல அல்லாமல், Fragment மூலம் elements group செய்வதால் layout அல்லது styles மீது எந்த தாக்கமும் இல்லை. Browser tools மூலம் இந்த உதாரணத்தை inspect செய்தால், அனைத்து `<h1>` மற்றும் `<article>` DOM nodes-உம் wrappers இல்லாமல் siblings ஆக தோன்றுவதைப் பார்க்கலாம்:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Special syntax இல்லாமல் Fragment எழுதுவது எப்படி? {/*how-to-write-a-fragment-without-the-special-syntax*/}

மேலுள்ள உதாரணம் React-இலிருந்து `Fragment` import செய்வதற்கு equivalent:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

உங்கள் `Fragment`-க்கு [`key` pass செய்ய](#rendering-a-list-of-fragments) வேண்டியதில்லையெனில், பொதுவாக இது தேவையில்லை.

</DeepDive>

---

### பல elements-ஐ variable-க்கு assign செய்தல் {/*assigning-multiple-elements-to-a-variable*/}

மற்ற எந்த element போலவும், Fragment elements-ஐ variables-க்கு assign செய்யலாம், props ஆக pass செய்யலாம், போன்றவை:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Text உடன் elements-ஐ group செய்தல் {/*grouping-elements-with-text*/}

Components உடன் text-ஐ group செய்ய `Fragment` பயன்படுத்தலாம்:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Fragments பட்டியலை render செய்தல் {/*rendering-a-list-of-fragments*/}

`<></>` syntax பயன்படுத்துவதற்குப் பதிலாக `Fragment`-ஐ explicit-ஆக எழுத வேண்டிய சூழல் இதோ. நீங்கள் [loop-இல் பல elements render செய்யும்போது](/learn/rendering-lists), ஒவ்வொரு element-க்கும் `key` assign செய்ய வேண்டும். Loop-க்குள் உள்ள elements Fragments என்றால், `key` attribute வழங்க normal JSX element syntax பயன்படுத்த வேண்டும்:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Fragment children சுற்றிலும் wrapper elements இல்லை என்பதை உறுதிசெய்ய DOM-ஐ inspect செய்யலாம்:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <CanaryBadge /> DOM interaction-க்கு Fragment refs பயன்படுத்துதல் {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs, கூடுதல் wrapper elements சேர்க்காமல் Fragment wrap செய்துள்ள DOM nodes உடன் interact செய்ய அனுமதிக்கின்றன. Event handling, visibility tracking, focus management, மற்றும் `ReactDOM.findDOMNode()` போன்ற deprecated patterns-ஐ மாற்றுவதற்கு இது பயனுள்ளதாகும்.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Fragment refs மூலம் visibility track செய்தல் {/*tracking-visibility-with-fragment-refs*/}

Visibility tracking மற்றும் intersection observation-க்கு Fragment refs பயனுள்ளவை. Child Components refs expose செய்ய வேண்டிய அவசியமின்றி, content எப்போது visible ஆகிறது என்பதை monitor செய்ய இது உதவுகிறது:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );

    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

இந்த pattern Effect-based visibility logging-க்கு மாற்று; அது பெரும்பாலான சூழல்களில் anti-pattern. Effects மட்டும் நம்புவது, rendered Component user-க்கு observable ஆக இருப்பதை guarantee செய்யாது.

---

### <CanaryBadge /> Fragment refs மூலம் focus management {/*focus-management-with-fragment-refs*/}

Fragment refs, Fragment-க்குள் உள்ள அனைத்து DOM nodes முழுவதும் வேலை செய்யும் focus management methods-ஐ வழங்குகின்றன:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

`focus()` method Fragment-க்குள் உள்ள முதல் focusable element-ஐ focus செய்கிறது; `focusLast()` கடைசி focusable element-ஐ focus செய்கிறது.
