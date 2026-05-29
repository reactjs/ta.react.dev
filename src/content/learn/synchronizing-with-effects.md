---
title: 'Effects உடன் synchronize செய்தல்'
---

<Intro>

சில components external systems உடன் synchronize செய்ய வேண்டும். உதாரணமாக, React state அடிப்படையில் non-React component-ஐ control செய்ய, server connection setup செய்ய, அல்லது ஒரு component screen-இல் தோன்றும் போது analytics log அனுப்ப வேண்டும் என்று இருக்கலாம். *Effects* rendering பிறகு சில code-ஐ run செய்ய அனுமதிப்பதால், உங்கள் component-ஐ React-க்கு வெளியே உள்ள system ஒன்றுடன் synchronize செய்ய முடியும்.

</Intro>

<YouWillLearn>

- Effects என்றால் என்ன
- Effects events-இலிருந்து எப்படி வேறுபடுகின்றன
- உங்கள் component-இல் Effect declare செய்வது எப்படி
- தேவையில்லாமல் Effect மீண்டும் run ஆகுவதை skip செய்வது எப்படி
- Development-இல் Effects ஏன் இருமுறை run ஆகின்றன, அவற்றை எப்படி fix செய்வது

</YouWillLearn>

## Effects என்றால் என்ன, அவை events-இலிருந்து எப்படி வேறுபடுகின்றன? {/*what-are-effects-and-how-are-they-different-from-events*/}

Effects-க்கு செல்லும் முன், React components-க்குள் உள்ள இரண்டு வகை logic-ஐ அறிந்திருக்க வேண்டும்:

- **Rendering code** ([UI-ஐ விவரித்தல்](/learn/describing-the-ui) பகுதியில் அறிமுகமானது) உங்கள் component-ன் top level-இல் இருக்கும். இங்கே props மற்றும் state-ஐ எடுத்து, அவற்றை transform செய்து, screen-இல் பார்க்க விரும்பும் JSX-ஐ return செய்கிறீர்கள். [Rendering code pure ஆக இருக்க வேண்டும்.](/learn/keeping-components-pure) Math formula போல, அது result-ஐ மட்டும் _calculate_ செய்ய வேண்டும்; வேறு எதையும் செய்யக்கூடாது.

- **Event handlers** ([Interactivity சேர்த்தல்](/learn/adding-interactivity) பகுதியில் அறிமுகமானது) உங்கள் components-க்குள் உள்ள nested functions; அவை வெறும் calculate செய்வதற்கு பதிலாக விஷயங்களை *செய்கின்றன*. ஒரு event handler input field-ஐ update செய்யலாம், product வாங்க HTTP POST request submit செய்யலாம், அல்லது பயனரை மற்றொரு screen-க்கு navigate செய்யலாம். Event handlers, குறிப்பிட்ட user action-ஆல் (உதாரணமாக button click அல்லது typing) ஏற்படும் ["side effects"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) கொண்டிருக்கும் (அவை program state-ஐ மாற்றுகின்றன).

சில நேரங்களில் இது போதாது. Screen-இல் visible ஆகும் ஒவ்வொரு முறையும் chat server-க்கு connect செய்ய வேண்டிய `ChatRoom` component-ஐ எடுத்துக் கொள்ளுங்கள். Server-க்கு connect செய்வது pure calculation அல்ல (அது side effect), எனவே rendering போது அது நடக்க முடியாது. ஆனால் `ChatRoom` display ஆக காரணமான click போன்ற single particular event இல்லை.

***Effects* என்பது குறிப்பிட்ட event-ஆல் அல்ல, rendering தானே காரணமாகும் side effects-ஐ specify செய்ய அனுமதிக்கிறது.** Chat-இல் message அனுப்புவது ஒரு *event*, ஏனெனில் அது பயனர் குறிப்பிட்ட button-ஐ click செய்வதால் நேரடியாக ஏற்படுகிறது. ஆனால் server connection setup செய்வது ஒரு *Effect*, ஏனெனில் component தோன்ற காரணமான interaction எதுவாக இருந்தாலும் அது நடக்க வேண்டும். Screen update ஆன பிறகு [commit](/learn/render-and-commit)-ன் முடிவில் Effects run ஆகும். React components-ஐ external system (network அல்லது third-party library போன்றவை) உடன் synchronize செய்ய இது நல்ல நேரம்.

<Note>

இங்கேயும் இந்த text-இல் பின்னரும், capitalized "Effect" என்பது மேலுள்ள React-specific definition-ஐ குறிக்கும், அதாவது rendering காரணமாக ஏற்படும் side effect. பரந்த programming concept-ஐ குறிக்க "side effect" என்று சொல்வோம்.

</Note>


## உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம் {/*you-might-not-need-an-effect*/}

**உங்கள் components-க்கு Effects சேர்க்க அவசரப்பட வேண்டாம்.** Effects பொதுவாக உங்கள் React code-இலிருந்து "step out" செய்து, ஏதேனும் *external* system உடன் synchronize செய்யப் பயன்படுகின்றன என்பதை நினைவில் கொள்ளுங்கள். இதில் browser APIs, third-party widgets, network போன்றவை அடங்கும். உங்கள் Effect மற்ற state அடிப்படையில் சில state-ஐ மட்டும் adjust செய்தால், [உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம்.](/learn/you-might-not-need-an-effect)

## Effect எழுதுவது எப்படி {/*how-to-write-an-effect*/}

Effect எழுத, இந்த மூன்று steps-ஐ பின்பற்றுங்கள்:

1. **Effect-ஐ declare செய்யுங்கள்.** Default ஆக, உங்கள் Effect ஒவ்வொரு [commit](/learn/render-and-commit) பிறகும் run ஆகும்.
2. **Effect dependencies-ஐ specify செய்யுங்கள்.** பெரும்பாலான Effects ஒவ்வொரு render பிறகும் அல்ல, *தேவைப்படும் போது* மட்டுமே re-run ஆக வேண்டும். உதாரணமாக, fade-in animation component தோன்றும் போது மட்டுமே trigger ஆக வேண்டும். Chat room-க்கு connect/disconnect செய்வது component தோன்றும் மற்றும் மறையும் போது, அல்லது chat room மாறும் போது மட்டுமே நடக்க வேண்டும். *Dependencies* specify செய்வதன் மூலம் இதை எப்படி control செய்வது என்பதை கற்பீர்கள்.
3. **தேவைப்பட்டால் cleanup சேர்க்கவும்.** சில Effects தாங்கள் செய்ததை stop, undo, அல்லது clean up செய்வது எப்படி என்பதை specify செய்ய வேண்டும். உதாரணமாக, "connect"-க்கு "disconnect" தேவை, "subscribe"-க்கு "unsubscribe" தேவை, "fetch"-க்கு "cancel" அல்லது "ignore" தேவை. *Cleanup function* return செய்வதன் மூலம் இதை எப்படி செய்வது என்பதை கற்பீர்கள்.

இந்த steps ஒவ்வொன்றையும் விரிவாகப் பார்ப்போம்.

### Step 1: Effect-ஐ declare செய்யுங்கள் {/*step-1-declare-an-effect*/}

உங்கள் component-இல் Effect declare செய்ய, React-இலிருந்து [`useEffect` Hook](/reference/react/useEffect)-ஐ import செய்யுங்கள்:

```js
import { useEffect } from 'react';
```

பிறகு, அதை உங்கள் component-ன் top level-இல் call செய்து, உங்கள் Effect-க்குள் சில code-ஐ வையுங்கள்:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

உங்கள் component render ஆகும் ஒவ்வொரு முறையும், React screen-ஐ update செய்து *பிறகு* `useEffect`-க்குள் உள்ள code-ஐ run செய்யும். வேறு வார்த்தைகளில், **அந்த render screen-இல் பிரதிபலிக்கும் வரை code பகுதி run ஆகாமல் `useEffect` "delay" செய்கிறது.**

External system உடன் synchronize செய்ய Effect-ஐ எப்படி use செய்யலாம் என்பதைப் பார்ப்போம். `<VideoPlayer>` React component-ஐ எடுத்துக் கொள்ளுங்கள். அதற்கு `isPlaying` prop pass செய்வதன் மூலம் அது play ஆகிறதா pause ஆகிறதா என்பதை control செய்ய முடியுமானால் நன்றாக இருக்கும்:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

உங்கள் custom `VideoPlayer` component, built-in browser [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) tag-ஐ render செய்கிறது:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

ஆனால் browser `<video>` tag-க்கு `isPlaying` prop இல்லை. அதை control செய்ய ஒரே வழி, DOM element மீது [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) மற்றும் [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) methods-ஐ manually call செய்வது. **Video தற்போது play ஆக _வேண்டுமா_ என்பதை சொல்லும் `isPlaying` prop-ன் value-ஐ `play()` மற்றும் `pause()` போன்ற calls உடன் synchronize செய்ய வேண்டும்.**

முதலில் `<video>` DOM node-க்கு [ref பெற](/learn/manipulating-the-dom-with-refs) வேண்டும்.

Rendering போது `play()` அல்லது `pause()` call செய்ய முயற்சிக்கலாம் என்று தோன்றலாம், ஆனால் அது சரி அல்ல:

<Sandpack>

```js {expectedErrors: {'react-compiler': [7, 9]}}
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Rendering போது இவற்றை call செய்வது அனுமதிக்கப்படாது.
  } else {
    ref.current.pause(); // மேலும், இது crash ஆகும்.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause செய்' : 'Play செய்'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

இந்த code சரி அல்லாத காரணம், rendering போது DOM node-ஐ வைத்து ஏதாவது செய்ய முயற்சிப்பதுதான். React-இல், [rendering என்பது JSX-ன் pure calculation ஆக இருக்க வேண்டும்](/learn/keeping-components-pure), மேலும் DOM-ஐ modify செய்வது போன்ற side effects இருக்கக் கூடாது.

மேலும், `VideoPlayer` முதல் முறையாக call செய்யப்படும் போது, அதன் DOM இன்னும் இல்லை! `play()` அல்லது `pause()` call செய்ய DOM node இன்னும் இல்லை, ஏனெனில் நீங்கள் JSX return செய்யும் வரை எந்த DOM create செய்ய வேண்டும் என்பதை React அறியாது.

இதற்கான தீர்வு, **side effect-ஐ `useEffect`-ஆல் wrap செய்து rendering calculation-இலிருந்து வெளியே நகர்த்துவது:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM update-ஐ Effect-க்குள் wrap செய்வதன் மூலம், முதலில் screen-ஐ update செய்ய React-க்கு அனுமதிக்கிறீர்கள். பிறகு உங்கள் Effect run ஆகும்.

உங்கள் `VideoPlayer` component render ஆகும் போது (முதல் முறையோ அல்லது re-render ஆனாலோ), சில விஷயங்கள் நடக்கும். முதலில், சரியான props உடன் `<video>` tag DOM-இல் இருப்பதை உறுதி செய்து React screen-ஐ update செய்யும். பிறகு React உங்கள் Effect-ஐ run செய்யும். இறுதியாக, `isPlaying` value அடிப்படையில் உங்கள் Effect `play()` அல்லது `pause()` call செய்யும்.

Play/Pause பல முறை press செய்து, video player `isPlaying` value-க்கு எப்படி synchronized ஆக இருக்கிறது என்பதைப் பாருங்கள்:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause செய்' : 'Play செய்'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

இந்த example-இல், React state உடன் நீங்கள் synchronize செய்த "external system" browser media API ஆகும். Legacy non-React code-ஐ (jQuery plugins போன்றவை) declarative React components-க்குள் wrap செய்ய இதே போன்ற அணுகுமுறையை use செய்யலாம்.

Video player-ஐ control செய்வது நடைமுறையில் மிகவும் complex என்பதை கவனிக்கவும். `play()` call fail ஆகலாம், பயனர் built-in browser controls மூலம் play அல்லது pause செய்யலாம், போன்றவை. இந்த example மிகவும் simplified மற்றும் incomplete.

<Pitfall>

Default ஆக, Effects *ஒவ்வொரு* render பிறகும் run ஆகும். அதனால்தான் இப்படியான code **infinite loop உருவாக்கும்:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effects rendering-ன் *result* ஆக run ஆகின்றன. State set செய்வது rendering-ஐ *trigger* செய்கிறது. Effect-இல் உடனடியாக state set செய்வது power outlet-ஐ அதே outlet-க்குள் plug செய்வது போல. Effect run ஆகிறது, அது state set செய்கிறது, அது re-render ஏற்படுத்துகிறது, அது Effect மீண்டும் run ஆக காரணமாகிறது, அது மீண்டும் state set செய்கிறது, இது இன்னொரு re-render ஏற்படுத்துகிறது, இப்படியே தொடர்கிறது.

Effects பொதுவாக உங்கள் components-ஐ *external* system உடன் synchronize செய்ய வேண்டும். External system எதுவும் இல்லாமல், மற்ற state அடிப்படையில் சில state-ஐ மட்டும் adjust செய்ய விரும்பினால், [உங்களுக்கு Effect தேவைப்படாமல் இருக்கலாம்.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Step 2: Effect dependencies-ஐ specify செய்யுங்கள் {/*step-2-specify-the-effect-dependencies*/}

Default ஆக, Effects *ஒவ்வொரு* render பிறகும் run ஆகும். பல நேரங்களில், இது **நீங்கள் விரும்புவது அல்ல:**

- சில நேரங்களில், அது slow. External system உடன் synchronize செய்வது எப்போதும் instant அல்ல, எனவே தேவையில்லாத போது அதை skip செய்ய விரும்பலாம். உதாரணமாக, ஒவ்வொரு keystroke-க்கும் chat server-க்கு reconnect செய்ய விரும்பமாட்டீர்கள்.
- சில நேரங்களில், அது தவறு. உதாரணமாக, ஒவ்வொரு keystroke-க்கும் component fade-in animation trigger செய்ய விரும்பமாட்டீர்கள். Component முதல் முறையாக தோன்றும் போது மட்டுமே animation play ஆக வேண்டும்.

Issue-ஐ demonstrate செய்ய, சில `console.log` calls மற்றும் parent component-ன் state-ஐ update செய்யும் text input உடன் முந்தைய example இதோ. Typing Effect மீண்டும் run ஆக காரணமாக இருப்பதை கவனிக்கவும்:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause செய்' : 'Play செய்'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

`useEffect` call-க்கு second argument ஆக *dependencies* array-ஐ specify செய்வதன் மூலம், **தேவையில்லாமல் Effect மீண்டும் run ஆகுவதை skip செய்ய** React-க்கு சொல்லலாம். மேலுள்ள example-இல் line 14-க்கு empty `[]` array சேர்த்து தொடங்குங்கள்:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`React Hook useEffect has a missing dependency: 'isPlaying'` என்று சொல்லும் error-ஐ நீங்கள் பார்க்க வேண்டும்:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // இது error ஏற்படுத்தும்

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause செய்' : 'Play செய்'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Problem என்னவெனில், உங்கள் Effect-க்குள் உள்ள code என்ன செய்ய வேண்டும் என்பதை தீர்மானிக்க `isPlaying` prop-ஐ *சார்ந்துள்ளது*, ஆனால் இந்த dependency explicit ஆக declare செய்யப்படவில்லை. இந்த issue-ஐ fix செய்ய, dependency array-க்கு `isPlaying`-ஐ சேர்க்கவும்:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // இது இங்கே use செய்யப்படுகிறது...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...அதனால் இங்கே declare செய்யப்பட வேண்டும்!
```

இப்போது எல்லா dependencies-உம் declare செய்யப்பட்டுள்ளதால் error இல்லை. Dependency array ஆக `[isPlaying]` specify செய்வது, previous render போது இருந்தது போலவே `isPlaying` இருந்தால் உங்கள் Effect-ஐ மீண்டும் run செய்வதை skip செய்ய வேண்டும் என்று React-க்கு சொல்கிறது. இந்த மாற்றத்தால், input-இல் type செய்வது Effect மீண்டும் run ஆக காரணமாகாது; ஆனால் Play/Pause press செய்வது காரணமாகும்:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause செய்' : 'Play செய்'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Dependency array பல dependencies கொண்டிருக்கலாம். நீங்கள் specify செய்த *எல்லா* dependencies-உம் previous render போது இருந்த அதே values-ஐ கொண்டிருந்தால் மட்டுமே React Effect மீண்டும் run ஆகுவதை skip செய்யும். React dependency values-ஐ [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் ஒப்பிடுகிறது. விவரங்களுக்கு [`useEffect` reference](/reference/react/useEffect#reference)-ஐ பார்க்கவும்.

**உங்கள் dependencies-ஐ "choose" செய்ய முடியாது என்பதை கவனிக்கவும்.** உங்கள் Effect-க்குள் உள்ள code அடிப்படையில் React எதிர்பார்ப்பதுடன் நீங்கள் specify செய்த dependencies match ஆகவில்லை என்றால் lint error கிடைக்கும். இது உங்கள் code-இல் பல bugs-ஐ catch செய்ய உதவும். சில code re-run ஆக வேண்டாம் என்றால், [அந்த dependency "தேவைப்படாதபடி" *Effect code-ஐயே edit செய்யுங்கள்*.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Dependency array இல்லாத behavior மற்றும் *empty* `[]` dependency array உடைய behavior வேறுபட்டவை:

```js {3,7,11}
useEffect(() => {
  // This runs after every render
});

useEffect(() => {
  // This runs only on mount (when the component appears)
}, []);

useEffect(() => {
  // This runs on mount *and also* if either a or b have changed since the last render
}, [a, b]);
```

அடுத்த step-இல் "mount" என்றால் என்ன என்பதை நெருக்கமாகப் பார்ப்போம்.

</Pitfall>

<DeepDive>

#### Ref dependency array-இலிருந்து ஏன் omit செய்யப்பட்டது? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

இந்த Effect `ref` மற்றும் `isPlaying` _இரண்டையும்_ use செய்கிறது, ஆனால் dependency ஆக `isPlaying` மட்டும் declare செய்யப்பட்டுள்ளது:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

இதற்குக் காரணம் `ref` object-க்கு *stable identity* இருப்பது: ஒவ்வொரு render-இலும் அதே `useRef` call-இலிருந்து [எப்போதும் அதே object கிடைக்கும்](/reference/react/useRef#returns) என்று React guarantee செய்கிறது. அது மாறாது, எனவே அது தனியாக Effect மீண்டும் run ஆக காரணமாகாது. அதனால் அதை include செய்கிறீர்களா இல்லையா என்பது முக்கியமல்ல. Include செய்தாலும் சரி:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState` return செய்யும் [`set` functions](/reference/react/useState#setstate)-க்கும் stable identity உள்ளது, எனவே அவையும் dependencies-இலிருந்து omit செய்யப்பட்டிருப்பதை அடிக்கடி காண்பீர்கள். Linter ஒரு dependency-ஐ errors இல்லாமல் omit செய்ய அனுமதித்தால், அதைச் செய்வது safe.

Object stable என்பதை linter "பார்க்க" முடிந்தால் மட்டுமே always-stable dependencies-ஐ omit செய்வது வேலை செய்யும். உதாரணமாக, `ref` parent component-இலிருந்து pass செய்யப்பட்டிருந்தால், dependency array-இல் அதை specify செய்ய வேண்டியிருக்கும். ஆனால் இது நல்லது, ஏனெனில் parent component எப்போதும் அதே ref pass செய்கிறதா, அல்லது பல refs-இல் ஒன்றை conditionally pass செய்கிறதா என்பதை நீங்கள் அறிய முடியாது. எனவே உங்கள் Effect pass செய்யப்பட்ட ref-ஐ _சார்ந்திருக்கும்_.

</DeepDive>

### Step 3: தேவைப்பட்டால் cleanup சேர்க்கவும் {/*step-3-add-cleanup-if-needed*/}

வேறு example-ஐ எடுத்துக் கொள்ளுங்கள். அது தோன்றும் போது chat server-க்கு connect செய்ய வேண்டிய `ChatRoom` component-ஐ நீங்கள் எழுதுகிறீர்கள். `connect()` மற்றும் `disconnect()` methods கொண்ட object-ஐ return செய்யும் `createConnection()` API உங்களுக்கு கொடுக்கப்பட்டுள்ளது. Component பயனருக்கு display ஆகும் வரை அதை connected ஆக வைத்திருப்பது எப்படி?

Effect logic எழுதுவதிலிருந்து தொடங்குங்கள்:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

ஒவ்வொரு re-render பிறகும் chat-க்கு connect செய்வது slow ஆக இருக்கும், எனவே dependency array-ஐ சேர்க்கிறீர்கள்:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect-க்குள் உள்ள code எந்த props அல்லது state-ஐயும் use செய்யவில்லை, எனவே உங்கள் dependency array `[]` (empty). Component "mount" ஆகும் போது, அதாவது screen-இல் முதல் முறையாக தோன்றும் போது மட்டும் இந்த code-ஐ run செய்ய வேண்டும் என்று இது React-க்கு சொல்கிறது.**

இந்த code-ஐ run செய்து பார்ப்போம்:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Chat-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ Disconnect ஆனது.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

இந்த Effect mount போது மட்டுமே run ஆகும், எனவே console-இல் `"✅ Connect செய்கிறது..."` ஒருமுறை print ஆகும் என்று எதிர்பார்க்கலாம். **ஆனால் console-ஐ check செய்தால், `"✅ Connect செய்கிறது..."` இருமுறை print ஆகிறது. இது ஏன் நடக்கிறது?**

`ChatRoom` component பல different screens கொண்ட பெரிய app-இன் ஒரு பகுதி என்று கற்பனை செய்யுங்கள். பயனர் `ChatRoom` page-இல் தன் பயணத்தைத் தொடங்குகிறார். Component mount ஆகி `connection.connect()` call செய்கிறது. பிறகு பயனர் மற்றொரு screen-க்கு navigate செய்கிறார் என்று நினைக்கவும்--உதாரணமாக Settings page-க்கு. `ChatRoom` component unmount ஆகிறது. இறுதியாக, பயனர் Back click செய்கிறார்; `ChatRoom` மீண்டும் mount ஆகிறது. இது second connection setup செய்யும்--ஆனால் முதல் connection ஒருபோதும் destroy செய்யப்படவில்லை! பயனர் app முழுவதும் navigate செய்யும்போது connections குவிந்து கொண்டே இருக்கும்.

இப்படியான bugs extensive manual testing இல்லாமல் நேரடியாக தவறவிடப்படும். அவற்றை விரைவாக கண்டறிய உதவ, development-இல் React ஒவ்வொரு component-ஐயும் அதன் initial mount உடனடியாக பிறகு ஒருமுறை remount செய்கிறது.

`"✅ Connect செய்கிறது..."` log இருமுறை தெரிகிறது என்பது உண்மையான issue-ஐ கவனிக்க உதவும்: component unmount ஆகும் போது உங்கள் code connection-ஐ close செய்யவில்லை.

Issue-ஐ fix செய்ய, உங்கள் Effect-இலிருந்து *cleanup function* return செய்யுங்கள்:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

Effect மீண்டும் run ஆகும் முன் ஒவ்வொரு முறையும், மேலும் component unmount ஆகும் (remove செய்யப்படும்) போது இறுதியாக ஒருமுறையும் React உங்கள் cleanup function-ஐ call செய்யும். Cleanup function implement செய்யப்பட்டால் என்ன நடக்கிறது என்பதைப் பார்ப்போம்:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Chat-க்கு வரவேற்கிறோம்!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connect செய்கிறது...');
    },
    disconnect() {
      console.log('❌ Disconnect ஆனது.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

இப்போது development-இல் மூன்று console logs கிடைக்கும்:

1. `"✅ Connect செய்கிறது..."`
2. `"❌ Disconnect ஆனது."`
3. `"✅ Connect செய்கிறது..."`

**இது development-இல் சரியான behavior.** உங்கள் component-ஐ remount செய்வதன் மூலம், away சென்று திரும்ப navigate செய்வது உங்கள் code-ஐ உடைக்காது என்பதை React verify செய்கிறது. Disconnect செய்து மீண்டும் connect செய்வதே சரியாக நடக்க வேண்டியது! Cleanup-ஐ நன்றாக implement செய்தால், Effect ஒருமுறை run ஆகுவதும், run ஆகி clean up செய்து மீண்டும் run ஆகுவதும் user-visible ஆக வேறுபடக் கூடாது. Development-இல் bugs தேட React உங்கள் code-ஐ probe செய்வதால் கூடுதல் connect/disconnect call pair உள்ளது. இது normal--அதை மறையச் செய்ய முயற்சிக்க வேண்டாம்!

**Production-இல், `"✅ Connect செய்கிறது..."` ஒருமுறை மட்டுமே print ஆகும்.** Cleanup தேவைப்படும் Effects-ஐ கண்டுபிடிக்க உதவ development-இல் மட்டுமே components remount ஆகின்றன. Development behavior-இலிருந்து opt out செய்ய [Strict Mode](/reference/react/StrictMode)-ஐ turn off செய்யலாம், ஆனால் அதை on ஆக வைத்திருக்க நாங்கள் பரிந்துரைக்கிறோம். இது மேலுள்ளதைப் போன்ற பல bugs-ஐ கண்டுபிடிக்க உதவும்.

## Development-இல் Effect இருமுறை fire ஆகுவதை எப்படி handle செய்வது? {/*how-to-handle-the-effect-firing-twice-in-development*/}

கடைசி example-இல் உள்ளதைப் போன்ற bugs கண்டுபிடிக்க React development-இல் உங்கள் components-ஐ நினைத்தே remount செய்கிறது. **சரியான கேள்வி "Effect-ஐ ஒருமுறை மட்டும் எப்படி run செய்வது" அல்ல; "remount ஆன பிறகும் என் Effect வேலை செய்ய அதை எப்படி fix செய்வது" என்பதே.**

பொதுவாக, பதில் cleanup function-ஐ implement செய்வது. Cleanup function, Effect செய்ததை stop அல்லது undo செய்ய வேண்டும். Rule of thumb: Effect ஒருமுறை run ஆகுவது (production போல) மற்றும் _setup → cleanup → setup_ sequence (development-இல் நீங்கள் காண்பது) இவற்றை பயனர் வேறுபடுத்த முடியக்கூடாது.

நீங்கள் எழுதும் பெரும்பாலான Effects கீழுள்ள common patterns-இல் ஒன்றுக்குள் பொருந்தும்.

<Pitfall>

#### Effects fire ஆகுவதைத் தடுக்க refs use செய்ய வேண்டாம் {/*dont-use-refs-to-prevent-effects-from-firing*/}

Development-இல் Effects இருமுறை fire ஆகுவதைத் தடுக்க common pitfall என்னவெனில், Effect ஒருமுறைக்கு மேல் run ஆகாமல் தடுக்க `ref` use செய்வது. உதாரணமாக, மேலுள்ள bug-ஐ `useRef` மூலம் "fix" செய்யலாம்:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

இதனால் development-இல் `"✅ Connect செய்கிறது..."` ஒருமுறை மட்டுமே தெரியும், ஆனால் அது bug-ஐ fix செய்யாது.

பயனர் away navigate செய்தால், connection இன்னும் close ஆகாது; அவர்கள் திரும்ப navigate செய்தால், புதிய connection create ஆகும். "Fix" முன்பு போலவே, பயனர் app முழுவதும் navigate செய்யும்போது connections குவிந்து கொண்டே இருக்கும்.

Bug-ஐ fix செய்ய Effect ஒருமுறை run ஆகச் செய்வது மட்டும் போதாது. Effect re-mounting பிறகும் வேலை செய்ய வேண்டும்; அதாவது மேலுள்ள solution போல connection clean up செய்யப்பட வேண்டும்.

Common patterns-ஐ எப்படி handle செய்வது என்பதை கீழுள்ள examples-இல் பார்க்கவும்.

</Pitfall>

### Non-React widgets-ஐ control செய்தல் {/*controlling-non-react-widgets*/}

சில நேரங்களில் React-இல் எழுதப்படாத UI widgets சேர்க்க வேண்டியிருக்கும். உதாரணமாக, உங்கள் page-க்கு map component சேர்க்கிறீர்கள் என்று வைத்துக் கொள்ளுங்கள். அதற்கு `setZoomLevel()` method உள்ளது, மேலும் உங்கள் React code-இல் உள்ள `zoomLevel` state variable உடன் zoom level-ஐ sync-இல் வைத்திருக்க விரும்புகிறீர்கள். உங்கள் Effect இதுபோல இருக்கும்:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

இந்த case-இல் cleanup தேவையில்லை என்பதை கவனிக்கவும். Development-இல் React Effect-ஐ இருமுறை call செய்யும், ஆனால் அதே value உடன் `setZoomLevel` இருமுறை call செய்வது எதையும் செய்யாததால் இது problem அல்ல. சிறிது slow ஆக இருக்கலாம், ஆனால் production-இல் தேவையில்லாமல் remount ஆகாது என்பதால் இது முக்கியமல்ல.

சில APIs-ஐ தொடர்ச்சியாக இருமுறை call செய்ய அனுமதிக்காமல் இருக்கலாம். உதாரணமாக, built-in [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) element-ன் [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method-ஐ இருமுறை call செய்தால் அது throw செய்யும். Cleanup function-ஐ implement செய்து dialog-ஐ close செய்யுங்கள்:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Development-இல், உங்கள் Effect `showModal()` call செய்து, உடனே `close()` செய்து, பிறகு மீண்டும் `showModal()` call செய்யும். Production-இல் நீங்கள் காண்பது போல `showModal()` ஒருமுறை call செய்வதற்குச் சமமான user-visible behavior இதற்கு இருக்கும்.

### Events-க்கு subscribe செய்தல் {/*subscribing-to-events*/}

உங்கள் Effect ஏதேனும் ஒன்றுக்கு subscribe செய்தால், cleanup function unsubscribe செய்ய வேண்டும்:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Development-இல், உங்கள் Effect `addEventListener()` call செய்து, உடனே `removeEventListener()` செய்து, பிறகு அதே handler உடன் மீண்டும் `addEventListener()` call செய்யும். எனவே ஒரே நேரத்தில் ஒரே active subscription மட்டும் இருக்கும். Production-இல் போல `addEventListener()` ஒருமுறை call செய்வதற்குச் சமமான user-visible behavior இதற்கு இருக்கும்.

### Animations-ஐ trigger செய்தல் {/*triggering-animations*/}

உங்கள் Effect ஏதாவது ஒன்றை animate செய்தால், cleanup function animation-ஐ initial values-க்கு reset செய்ய வேண்டும்:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Animation-ஐ trigger செய்க
  return () => {
    node.style.opacity = 0; // Initial value-க்கு reset செய்க
  };
}, []);
```

Development-இல், opacity `1` ஆக set செய்யப்பட்டு, பிறகு `0`, பின்னர் மீண்டும் `1` ஆக set செய்யப்படும். Production-இல் நேரடியாக `1` ஆக set செய்வதற்குச் சமமான user-visible behavior இதற்கு இருக்க வேண்டும். Tweening support உடைய third-party animation library use செய்தால், உங்கள் cleanup function timeline-ஐ அதன் initial state-க்கு reset செய்ய வேண்டும்.

### Data fetch செய்தல் {/*fetching-data*/}

உங்கள் Effect ஏதாவது fetch செய்தால், cleanup function [fetch-ஐ abort](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) செய்யவோ அல்லது அதன் result-ஐ ignore செய்யவோ வேண்டும்:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

ஏற்கனவே நடந்த network request-ஐ "undo" செய்ய முடியாது, ஆனால் _இனி relevant அல்லாத_ fetch உங்கள் application-ஐ தொடர்ந்து பாதிக்காததை உங்கள் cleanup function உறுதி செய்ய வேண்டும். `userId` `'Alice'`-இலிருந்து `'Bob'` ஆக மாறினால், `'Bob'` பிறகு `'Alice'` response வந்தாலும் அது ignore செய்யப்படுவதை cleanup உறுதி செய்யும்.

**Development-இல், Network tab-இல் இரண்டு fetches காண்பீர்கள்.** அதில் தவறு இல்லை. மேலுள்ள அணுகுமுறையில், முதல் Effect உடனடியாக clean up செய்யப்படும், எனவே அதன் `ignore` variable copy `true` ஆக set செய்யப்படும். அதனால் extra request இருந்தாலும், `if (!ignore)` check காரணமாக அது state-ஐ பாதிக்காது.

**Production-இல், ஒரு request மட்டுமே இருக்கும்.** Development-இல் இரண்டாவது request உங்களைத் தொந்தரவு செய்தால், requests-ஐ deduplicate செய்து components இடையில் அவற்றின் responses-ஐ cache செய்யும் solution-ஐ use செய்வதே சிறந்த அணுகுமுறை:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

இது development experience-ஐ மட்டும் அல்ல, உங்கள் application வேகமாக உணரப்படவும் செய்யும். உதாரணமாக, பயனர் Back button press செய்தால், data cached ஆக இருப்பதால் மீண்டும் load ஆக காத்திருக்க வேண்டியதில்லை. இப்படிப்பட்ட cache-ஐ நீங்கள் தானே build செய்யலாம் அல்லது Effects-இல் manual fetching-க்கு இருக்கும் பல alternatives-இல் ஒன்றை use செய்யலாம்.

<DeepDive>

#### Effects-இல் data fetching-க்கு நல்ல alternatives என்ன? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effects-க்குள் `fetch` calls எழுதுவது [data fetch செய்ய popular வழி](https://www.robinwieruch.de/react-hooks-fetch-data/), குறிப்பாக fully client-side apps-இல். ஆனால் இது மிகவும் manual approach, மேலும் குறிப்பிடத்தக்க downsides உள்ளது:

- **Effects server-இல் run ஆகாது.** இதனால் initial server-rendered HTML data இல்லாத loading state மட்டும் கொண்டிருக்கும். Client computer எல்லா JavaScript-ஐயும் download செய்து app-ஐ render செய்த பிறகே data load செய்ய வேண்டும் என்பதை அறியும். இது மிகவும் efficient அல்ல.
- **Effects-இல் நேரடியாக fetching செய்வது "network waterfalls" உருவாக்க உதவுகிறது.** நீங்கள் parent component-ஐ render செய்கிறீர்கள், அது சில data fetch செய்கிறது, child components-ஐ render செய்கிறது, பிறகு அவை தங்கள் data fetch செய்ய தொடங்குகின்றன. Network மிக வேகமாக இல்லையெனில், எல்லா data-வையும் parallel ஆக fetch செய்வதை விட இது குறிப்பிடத்தக்க அளவு slow.
- **Effects-இல் நேரடியாக fetching செய்வது பொதுவாக data-ஐ preload அல்லது cache செய்யவில்லை என்பதைக் குறிக்கும்.** உதாரணமாக, component unmount ஆகி மீண்டும் mount ஆனால், data-ஐ மீண்டும் fetch செய்ய வேண்டியிருக்கும்.
- **இது மிகவும் ergonomic அல்ல.** [Race conditions](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) போன்ற bugs வராத வகையில் `fetch` calls எழுதும்போது நிறைய boilerplate code தேவைப்படும்.

இந்த downsides பட்டியல் React-க்கு மட்டும் உரியது அல்ல. எந்த library-யாக இருந்தாலும் mount போது data fetch செய்வதற்கு இது பொருந்தும். Routing போல, data fetching-ஐ நன்றாக செய்வது சுலபமல்ல, எனவே பின்வரும் approaches-ஐ பரிந்துரைக்கிறோம்:

- **நீங்கள் [framework](/learn/creating-a-react-app#full-stack-frameworks) use செய்தால், அதன் built-in data fetching mechanism-ஐ use செய்யுங்கள்.** Modern React frameworks-க்கு efficient ஆன, மேலுள்ள pitfalls இல்லாத integrated data fetching mechanisms உள்ளன.
- **இல்லையெனில், client-side cache use செய்வதையோ build செய்வதையோ பரிசீலிக்கவும்.** Popular open source solutions-ல் [TanStack Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), மற்றும் [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) அடங்கும். உங்கள் சொந்த solution-ஐயும் build செய்யலாம்; அப்போது under the hood Effects use செய்யப்படும், ஆனால் requests deduplicate செய்தல், responses cache செய்தல், network waterfalls தவிர்த்தல் (data preload செய்வதன் மூலம் அல்லது data requirements-ஐ routes-க்கு hoist செய்வதன் மூலம்) ஆகிய logic-ஐ சேர்ப்பீர்கள்.

இந்த approaches எதுவும் உங்களுக்கு பொருந்தவில்லை என்றால், Effects-இல் நேரடியாக data fetch செய்வதைத் தொடரலாம்.

</DeepDive>

### Analytics அனுப்புதல் {/*sending-analytics*/}

Page visit போது analytics event அனுப்பும் இந்த code-ஐ கருதுங்கள்:

```js
useEffect(() => {
  logVisit(url); // POST request அனுப்பும்
}, [url]);
```

Development-இல், ஒவ்வொரு URL-க்கும் `logVisit` இருமுறை call செய்யப்படும், எனவே அதை fix செய்ய முயற்சிக்க வேண்டும் என்று தோன்றலாம். **இந்த code-ஐ இருப்பதுபோலவே வைத்திருக்க பரிந்துரைக்கிறோம்.** முன் examples போல, ஒருமுறை run செய்வதும் இருமுறை run செய்வதும் *user-visible* behavior-இல் வேறுபாடு தராது. Practical point of view-இல், development-இல் `logVisit` எதையும் செய்யக்கூடாது, ஏனெனில் development machines-இலிருந்து வரும் logs production metrics-ஐ skew செய்ய வேண்டாம். File save செய்யும் ஒவ்வொரு முறையும் உங்கள் component remount ஆகிறது, எனவே development-இல் அது anyway extra visits log செய்யும்.

**Production-இல் duplicate visit logs இருக்காது.**

நீங்கள் அனுப்பும் analytics events-ஐ debug செய்ய, உங்கள் app-ஐ staging environment-க்கு deploy செய்யலாம் (அது production mode-இல் run ஆகும்) அல்லது [Strict Mode](/reference/react/StrictMode) மற்றும் அதன் development-only remounting checks-இலிருந்து தற்காலிகமாக opt out செய்யலாம். Effects-க்கு பதிலாக route change event handlers-இலிருந்தும் analytics அனுப்பலாம். மேலும் precise analytics-க்கு, எந்த components viewport-இல் உள்ளன மற்றும் எவ்வளவு நேரம் visible ஆக இருக்கின்றன என்பதை track செய்ய [intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) உதவும்.

### Effect அல்ல: Application-ஐ initialize செய்தல் {/*not-an-effect-initializing-the-application*/}

Application தொடங்கும் போது சில logic ஒருமுறை மட்டுமே run ஆக வேண்டும். அதை உங்கள் components-க்கு வெளியே வைக்கலாம்:

```js {2-3}
if (typeof window !== 'undefined') { // Browser-இல் run ஆகிறோமா என்று check செய்க.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Browser page-ஐ load செய்த பிறகு இப்படிப்பட்ட logic ஒருமுறை மட்டுமே run ஆகும் என்பதை இது guarantee செய்கிறது.

### Effect அல்ல: Product வாங்குதல் {/*not-an-effect-buying-a-product*/}

சில நேரங்களில், cleanup function எழுதினாலும் Effect இருமுறை run ஆகுவதால் ஏற்படும் user-visible consequences-ஐத் தடுக்க வழி இருக்காது. உதாரணமாக, உங்கள் Effect product வாங்குவது போன்ற POST request அனுப்பலாம்:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Product-ஐ இருமுறை வாங்க விரும்பமாட்டீர்கள். ஆனால் இந்த logic-ஐ Effect-இல் வைக்கக் கூடாததற்கான காரணமும் இதுதான். பயனர் மற்றொரு page-க்கு சென்று பிறகு Back press செய்தால் என்ன? உங்கள் Effect மீண்டும் run ஆகும். பயனர் ஒரு page-ஐ *visit* செய்யும் போது product வாங்க வேண்டாம்; பயனர் Buy button-ஐ *click* செய்யும் போது வாங்க வேண்டும்.

Buying rendering காரணமாக ஏற்படவில்லை; அது குறிப்பிட்ட interaction காரணமாக ஏற்படுகிறது. பயனர் button press செய்தால் மட்டுமே அது run ஆக வேண்டும். **Effect-ஐ delete செய்து, உங்கள் `/api/buy` request-ஐ Buy button event handler-க்குள் நகர்த்துங்கள்:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Remounting உங்கள் application logic-ஐ உடைத்தால், அது பொதுவாக ஏற்கனவே உள்ள bugs-ஐ வெளிப்படுத்துகிறது என்பதை இது காட்டுகிறது.** பயனரின் பார்வையில், ஒரு page-ஐ visit செய்வதும், அதை visit செய்து link click செய்து, பின்னர் Back press செய்து page-ஐ மீண்டும் பார்ப்பதும் வேறுபடக்கூடாது. Development-இல் components-ஐ ஒருமுறை remount செய்வதன் மூலம், உங்கள் components இந்த principle-ஐ பின்பற்றுகின்றனவா என்று React verify செய்கிறது.

## அனைத்தையும் ஒன்றாக இணைத்தல் {/*putting-it-all-together*/}

Effects நடைமுறையில் எப்படி வேலை செய்கின்றன என்பதற்கான "feel" பெற இந்த playground உதவும்.

இந்த example, Effect run ஆன மூன்று seconds பிறகு input text உடன் console log தோன்ற [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)-ஐ use செய்கிறது. Cleanup function pending timeout-ஐ cancel செய்கிறது. "Component-ஐ mount செய்" press செய்வதன் மூலம் தொடங்குங்கள்:

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        Log செய்ய வேண்டியது:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        Component-ஐ {show ? 'unmount செய்' : 'mount செய்'}
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

முதலில் மூன்று logs காண்பீர்கள்: `Schedule "a" log`, `Cancel "a" log`, மற்றும் மீண்டும் `Schedule "a" log`. மூன்று seconds பிறகு `a` என்று சொல்லும் log-உம் இருக்கும். முன்பு கற்றதுபோல், cleanup நன்றாக implement செய்துள்ளீர்களா என்று verify செய்ய React development-இல் component-ஐ ஒருமுறை remount செய்வதால் கூடுதல் schedule/cancel pair வருகிறது.

இப்போது input-ஐ `abc` என்று edit செய்யுங்கள். அதை வேகமாக செய்தால், `Schedule "ab" log` உடனடியாக `Cancel "ab" log` மற்றும் `Schedule "abc" log` தொடர்ந்து தெரியும். **அடுத்த render-ன் Effect-க்கு முன் React எப்போதும் previous render-ன் Effect-ஐ clean up செய்கிறது.** அதனால் input-இல் வேகமாக type செய்தாலும், ஒரே நேரத்தில் அதிகபட்சம் ஒரு timeout மட்டுமே scheduled ஆக இருக்கும். Effects எப்படி clean up ஆகின்றன என்பதை உணர input-ஐ சில முறை edit செய்து console-ஐ பாருங்கள்.

Input-இல் ஏதாவது type செய்து உடனே "Component-ஐ unmount செய்" press செய்யுங்கள். Unmounting last render-ன் Effect-ஐ எப்படி clean up செய்கிறது என்பதை கவனிக்கவும். இங்கே, last timeout fire ஆகும் வாய்ப்பு வருவதற்கு முன் அதை clear செய்கிறது.

இறுதியாக, மேலுள்ள component-ஐ edit செய்து, timeouts cancel ஆகாமல் இருக்க cleanup function-ஐ comment out செய்யுங்கள். `abcde`-ஐ வேகமாக type செய்து பாருங்கள். மூன்று seconds-இல் என்ன நடக்கும் என்று எதிர்பார்க்கிறீர்கள்? Timeout-க்குள் உள்ள `console.log(text)` *latest* `text`-ஐ print செய்து ஐந்து `abcde` logs உருவாக்குமா? உங்கள் intuition-ஐ check செய்ய முயற்சிக்கவும்!

மூன்று seconds பிறகு, ஐந்து `abcde` logs-க்கு பதிலாக (`a`, `ab`, `abc`, `abcd`, மற்றும் `abcde`) என்ற logs வரிசையை காண வேண்டும். **ஒவ்வொரு Effect-உம் அதற்கான render-இலிருந்து `text` value-ஐ "capture" செய்கிறது.** `text` state மாறியது முக்கியமல்ல: `text = 'ab'` உடைய render-இலிருந்து வந்த Effect எப்போதும் `'ab'`-ஐத்தான் பார்க்கும். வேறு வார்த்தைகளில், ஒவ்வொரு render-இலிருந்தும் வரும் Effects ஒன்றிலிருந்து ஒன்று isolated. இது எப்படி வேலை செய்கிறது என்று ஆர்வமாக இருந்தால், [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) பற்றி படிக்கலாம்.

<DeepDive>

#### ஒவ்வொரு render-க்கும் தனி Effects உள்ளன {/*each-render-has-its-own-effects*/}

`useEffect`-ஐ render output-க்கு behavior-ன் ஒரு பகுதியை "attach" செய்வதாக நினைக்கலாம். இந்த Effect-ஐ கருதுங்கள்:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId}-க்கு வரவேற்கிறோம்!</h1>;
}
```

பயனர் app-இல் navigate செய்யும்போது சரியாக என்ன நடக்கிறது என்று பார்ப்போம்.

#### ஆரம்ப render {/*initial-render*/}

பயனர் `<ChatRoom roomId="general" />`-ஐ visit செய்கிறார். `roomId`-ஐ `'general'` உடன் [மனதளவில் substitute](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) செய்வோம்:

```js
  // JSX for the first render (roomId = "general")
  return <h1>general-க்கு வரவேற்கிறோம்!</h1>;
```

**Effect-உம் rendering output-ன் ஒரு பகுதிதான்.** முதல் render-ன் Effect இதாகிறது:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React இந்த Effect-ஐ run செய்கிறது; அது `'general'` chat room-க்கு connect செய்கிறது.

#### அதே dependencies உடன் re-render {/*re-render-with-same-dependencies*/}

`<ChatRoom roomId="general" />` re-render ஆகிறது என்று வைத்துக் கொள்ளுங்கள். JSX output அதே:

```js
  // JSX for the second render (roomId = "general")
  return <h1>general-க்கு வரவேற்கிறோம்!</h1>;
```

Rendering output மாறவில்லை என்று React பார்க்கிறது, எனவே DOM-ஐ update செய்யாது.

இரண்டாவது render-இலிருந்து வரும் Effect இதுபோல் இருக்கும்:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React இரண்டாவது render-இலிருந்து வந்த `['general']`-ஐ முதல் render-இலிருந்து வந்த `['general']`-உடன் compare செய்கிறது. **எல்லா dependencies-உம் same என்பதால், React இரண்டாவது render-இலிருந்து வந்த Effect-ஐ *ignore* செய்கிறது.** அது ஒருபோதும் call செய்யப்படாது.

#### வேறு dependencies உடன் re-render {/*re-render-with-different-dependencies*/}

பிறகு, பயனர் `<ChatRoom roomId="travel" />`-ஐ visit செய்கிறார். இம்முறை, component வேறு JSX return செய்கிறது:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>travel-க்கு வரவேற்கிறோம்!</h1>;
```

`"general-க்கு வரவேற்கிறோம்"`-ஐ `"travel-க்கு வரவேற்கிறோம்"` ஆக மாற்ற React DOM-ஐ update செய்கிறது.

மூன்றாவது render-இலிருந்து வரும் Effect இதுபோல் இருக்கும்:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React மூன்றாவது render-இலிருந்து வந்த `['travel']`-ஐ இரண்டாவது render-இலிருந்து வந்த `['general']`-உடன் compare செய்கிறது. ஒரு dependency வேறாக உள்ளது: `Object.is('travel', 'general')` என்பது `false`. Effect-ஐ skip செய்ய முடியாது.

**மூன்றாவது render-இலிருந்து வந்த Effect-ஐ React apply செய்வதற்கு முன், _run ஆன_ last Effect-ஐ clean up செய்ய வேண்டும்.** இரண்டாவது render-ன் Effect skip செய்யப்பட்டதால், React முதல் render-ன் Effect-ஐ clean up செய்ய வேண்டும். முதல் render-க்கு மேலே scroll செய்தால், அதன் cleanup `createConnection('general')` மூலம் create செய்யப்பட்ட connection மீது `disconnect()` call செய்வதைப் பார்ப்பீர்கள். இது app-ஐ `'general'` chat room-இலிருந்து disconnect செய்கிறது.

அதற்குப் பிறகு, React மூன்றாவது render-ன் Effect-ஐ run செய்கிறது. அது `'travel'` chat room-க்கு connect செய்கிறது.

#### Unmount செய்தல் {/*unmount*/}

இறுதியாக, பயனர் away navigate செய்கிறார், `ChatRoom` component unmount ஆகிறது என்று வைத்துக் கொள்ளுங்கள். React last Effect-ன் cleanup function-ஐ run செய்கிறது. Last Effect மூன்றாவது render-இலிருந்து வந்தது. மூன்றாவது render-ன் cleanup `createConnection('travel')` connection-ஐ destroy செய்கிறது. எனவே app `'travel'` room-இலிருந்து disconnect ஆகிறது.

#### Development-இல் மட்டும் உள்ள behaviors {/*development-only-behaviors*/}

[Strict Mode](/reference/react/StrictMode) on ஆக இருக்கும்போது, React ஒவ்வொரு component-ஐயும் mount பிறகு ஒருமுறை remount செய்கிறது (state மற்றும் DOM preserve செய்யப்படும்). இது [cleanup தேவைப்படும் Effects-ஐ கண்டுபிடிக்க உதவுகிறது](#step-3-add-cleanup-if-needed) மற்றும் race conditions போன்ற bugs-ஐ ஆரம்பத்திலேயே வெளிப்படுத்துகிறது. கூடுதலாக, development-இல் file save செய்யும் போதெல்லாம் React Effects-ஐ remount செய்யும். இந்த behaviors இரண்டும் development-only.

</DeepDive>

<Recap>

- Events-க்கு மாறாக, Effects குறிப்பிட்ட interaction காரணமாக அல்ல; rendering தானே காரணமாக ஏற்படும்.
- Effects ஒரு component-ஐ external system (third-party API, network போன்றவை) உடன் synchronize செய்ய அனுமதிக்கின்றன.
- Default ஆக, Effects ஒவ்வொரு render பிறகும் (initial render உட்பட) run ஆகும்.
- அதன் dependencies அனைத்தும் last render போது இருந்த அதே values-ஐ கொண்டிருந்தால் React Effect-ஐ skip செய்யும்.
- உங்கள் dependencies-ஐ "choose" செய்ய முடியாது. அவை Effect-க்குள் உள்ள code மூலம் தீர்மானிக்கப்படுகின்றன.
- Empty dependency array (`[]`) component "mounting", அதாவது screen-க்கு சேர்க்கப்படுவதை குறிக்கும்.
- Strict Mode-இல், உங்கள் Effects-ஐ stress-test செய்ய React components-ஐ இருமுறை mount செய்கிறது (development-இல் மட்டும்!).
- Remounting காரணமாக உங்கள் Effect உடைந்தால், cleanup function implement செய்ய வேண்டும்.
- Effect அடுத்த முறை run ஆகும் முன்பும், unmount நேரத்திலும் React உங்கள் cleanup function-ஐ call செய்யும்.

</Recap>

<Challenges>

#### Mount போது field-ஐ focus செய்யுங்கள் {/*focus-a-field-on-mount*/}

இந்த example-இல், form `<MyInput />` component-ஐ render செய்கிறது.

`MyInput` screen-இல் தோன்றும் போது automatic ஆக focus ஆக, input-ன் [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) method-ஐ use செய்யுங்கள். ஏற்கனவே commented out implementation உள்ளது, ஆனால் அது முழுமையாக வேலை செய்யவில்லை. அது ஏன் வேலை செய்யவில்லை என்பதை கண்டுபிடித்து fix செய்யுங்கள். (`autoFocus` attribute உங்களுக்கு தெரிந்திருந்தால், அது இல்லை என்று நினைத்துக் கொள்ளுங்கள்: அதே functionality-ஐ scratch-இலிருந்து reimplement செய்கிறோம்.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'மறை' : 'காட்டு'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            உங்கள் பெயரை உள்ளிடுங்கள்:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Uppercase ஆக மாற்று
          </label>
          <p>வணக்கம், <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


உங்கள் solution வேலை செய்கிறது என்பதை verify செய்ய, "form காட்டு" press செய்து input focus பெறுகிறதா (highlight ஆகி cursor உள்ளே வைக்கப்படுகிறதா) என்பதை verify செய்யுங்கள். "form மறை" மற்றும் "form காட்டு" மீண்டும் press செய்யுங்கள். Input மீண்டும் highlighted ஆகிறதா verify செய்யுங்கள்.

`MyInput` ஒவ்வொரு render பிறகும் அல்ல, _mount போது மட்டும்_ focus ஆக வேண்டும். Behavior சரியாக இருக்கிறதா verify செய்ய, "form காட்டு" press செய்து பிறகு "Uppercase ஆக மாற்று" checkbox-ஐ மீண்டும் மீண்டும் press செய்யுங்கள். Checkbox click செய்வது அதன் மேல் உள்ள input-ஐ focus செய்யக் கூடாது.

<Solution>

Render போது `ref.current.focus()` call செய்வது தவறு, ஏனெனில் அது *side effect*. Side effects event handler-க்குள் வைக்கப்படவோ அல்லது `useEffect` மூலம் declare செய்யப்படவோ வேண்டும். இந்த case-இல், side effect குறிப்பிட்ட interaction காரணமாக அல்ல; component தோன்றுவதால் _caused_ ஆகிறது, எனவே அதை Effect-இல் வைப்பது பொருத்தமானது.

தவறை fix செய்ய, `ref.current.focus()` call-ஐ Effect declaration-க்குள் wrap செய்யுங்கள். பிறகு, இந்த Effect ஒவ்வொரு render பிறகும் அல்ல, mount போது மட்டும் run ஆகுமாறு உறுதி செய்ய, empty `[]` dependencies-ஐ அதற்கு சேர்க்கவும்.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'மறை' : 'காட்டு'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            உங்கள் பெயரை உள்ளிடுங்கள்:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Uppercase ஆக மாற்று
          </label>
          <p>வணக்கம், <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Condition அடிப்படையில் field-ஐ focus செய்யுங்கள் {/*focus-a-field-conditionally*/}

இந்த form இரண்டு `<MyInput />` components-ஐ render செய்கிறது.

"form காட்டு" press செய்து, இரண்டாவது field automatic ஆக focus ஆகிறது என்பதை கவனிக்கவும். இரண்டு `<MyInput />` components-உம் உள்ளே உள்ள field-ஐ focus செய்ய முயற்சிப்பதால் இது நடக்கிறது. இரண்டு input fields-க்கு தொடர்ச்சியாக `focus()` call செய்தால், கடைசியாக call செய்யப்பட்டதே எப்போதும் "wins".

நீங்கள் முதல் field-ஐ focus செய்ய விரும்புகிறீர்கள் என்று வைத்துக் கொள்ளுங்கள். முதல் `MyInput` component இப்போது `true` ஆக set செய்யப்பட்ட boolean `shouldFocus` prop பெறுகிறது. `MyInput` பெற்ற `shouldFocus` prop `true` ஆக இருந்தால் மட்டுமே `focus()` call செய்யப்படும் வகையில் logic-ஐ மாற்றுங்கள்.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'மறை' : 'காட்டு'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            உங்கள் முதல் பெயரை உள்ளிடுங்கள்:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            உங்கள் கடைசி பெயரை உள்ளிடுங்கள்:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>வணக்கம், <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

உங்கள் solution-ஐ verify செய்ய, "form காட்டு" மற்றும் "form மறை" ஆகியவற்றை மீண்டும் மீண்டும் press செய்யுங்கள். Form தோன்றும் போது, *முதல்* input மட்டும் focus ஆக வேண்டும். ஏனெனில் parent component முதல் input-ஐ `shouldFocus={true}` உடன் மற்றும் இரண்டாவது input-ஐ `shouldFocus={false}` உடன் render செய்கிறது. இரண்டு inputs-உம் இன்னும் வேலை செய்கிறதா, அவற்றில் type செய்ய முடியுமா என்பதையும் check செய்யுங்கள்.

<Hint>

Effect-ஐ conditionally declare செய்ய முடியாது, ஆனால் உங்கள் Effect conditional logic-ஐ கொண்டிருக்கலாம்.

</Hint>

<Solution>

Conditional logic-ஐ Effect-க்குள் வையுங்கள். Effect-க்குள் `shouldFocus`-ஐ use செய்வதால், அதை dependency ஆக specify செய்ய வேண்டும். (இதன் பொருள், ஒரு input-ன் `shouldFocus` `false`-இலிருந்து `true` ஆக மாறினால், அது mount பிறகு focus ஆகும்.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'மறை' : 'காட்டு'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            உங்கள் முதல் பெயரை உள்ளிடுங்கள்:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            உங்கள் கடைசி பெயரை உள்ளிடுங்கள்:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>வணக்கம், <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### இருமுறை fire ஆகும் interval-ஐ fix செய்யுங்கள் {/*fix-an-interval-that-fires-twice*/}

இந்த `Counter` component ஒவ்வொரு second-க்கும் increment ஆக வேண்டிய counter-ஐ display செய்கிறது. Mount போது, அது [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) call செய்கிறது. இதனால் `onTick` ஒவ்வொரு second-க்கும் run ஆகும். `onTick` function counter-ஐ increment செய்கிறது.

ஆனால் ஒவ்வொரு second-க்கும் ஒருமுறை increment ஆகுவதற்கு பதிலாக, அது இருமுறை increment ஆகிறது. ஏன்? Bug-ன் காரணத்தை கண்டுபிடித்து fix செய்யுங்கள்.

<Hint>

`setInterval` interval ID return செய்கிறது; அதை [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)-க்கு pass செய்து interval-ஐ stop செய்யலாம் என்பதை நினைவில் கொள்ளுங்கள்.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'மறை' : 'காட்டு'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

[Strict Mode](/reference/react/StrictMode) on ஆக இருக்கும்போது (இந்த site-இல் உள்ள sandboxes போல), React development-இல் ஒவ்வொரு component-ஐயும் ஒருமுறை remount செய்கிறது. இதனால் interval இருமுறை setup செய்யப்படுகிறது, அதனால்தான் counter ஒவ்வொரு second-க்கும் இருமுறை increment ஆகிறது.

ஆனால் React-ன் behavior bug-ன் *cause* அல்ல: bug ஏற்கனவே code-இல் உள்ளது. React-ன் behavior bug-ஐ மேலும் தெளிவாக காட்டுகிறது. உண்மையான காரணம், இந்த Effect ஒரு process-ஐ தொடங்குகிறது, ஆனால் அதை clean up செய்ய வழி provide செய்யவில்லை.

இந்த code-ஐ fix செய்ய, `setInterval` return செய்யும் interval ID-ஐ save செய்து, [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) உடன் cleanup function implement செய்யுங்கள்:

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'மறை' : 'காட்டு'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Development-இல், cleanup நன்றாக implement செய்துள்ளீர்களா என்று verify செய்ய React இன்னும் உங்கள் component-ஐ ஒருமுறை remount செய்யும். எனவே ஒரு `setInterval` call, உடனடியாக `clearInterval`, பின்னர் மீண்டும் `setInterval` இருக்கும். Production-இல், ஒரே ஒரு `setInterval` call மட்டுமே இருக்கும். இரு cases-இலும் user-visible behavior ஒன்றே: counter ஒவ்வொரு second-க்கும் ஒருமுறை increment ஆகும்.

</Solution>

#### Effect-க்குள் fetching-ஐ fix செய்யுங்கள் {/*fix-fetching-inside-an-effect*/}

இந்த component selected person-க்கான biography-ஐ காட்டுகிறது. Mount போது மற்றும் `person` மாறும் ஒவ்வொரு முறையும் asynchronous function `fetchBio(person)` call செய்து biography-ஐ load செய்கிறது. அந்த asynchronous function ஒரு [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) return செய்கிறது; அது இறுதியில் string ஆக resolve ஆகும். Fetching முடிந்ததும், select box-க்கு கீழே அந்த string-ஐ display செய்ய `setBio` call செய்கிறது.

<Sandpack>

{/* மிக efficient அல்ல, ஆனால் இந்த validation linter-இல் மட்டும் enabled; எனவே நாங்கள் என்ன செய்கிறோம் என தெரிந்ததால் இங்கே ignore செய்வது சரி */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('இது ' + person + ' உடைய bio.');
    }, delay);
  })
}

```

</Sandpack>


இந்த code-இல் bug உள்ளது. "Alice" select செய்வதிலிருந்து தொடங்குங்கள். பிறகு "Bob" select செய்து உடனடியாக "Taylor" select செய்யுங்கள். இதை வேகமாக செய்தால், bug-ஐ கவனிப்பீர்கள்: Taylor selected ஆக உள்ளது, ஆனால் கீழுள்ள paragraph "இது Bob உடைய bio." என்று சொல்கிறது.

இது ஏன் நடக்கிறது? இந்த Effect-க்குள் bug-ஐ fix செய்யுங்கள்.

<Hint>

Effect ஏதேனும் ஒன்றை asynchronously fetch செய்தால், அதற்கு பொதுவாக cleanup தேவைப்படும்.

</Hint>

<Solution>

Bug-ஐ trigger செய்ய, விஷயங்கள் இந்த order-இல் நடக்க வேண்டும்:

- `'Bob'` select செய்வது `fetchBio('Bob')`-ஐ trigger செய்கிறது
- `'Taylor'` select செய்வது `fetchBio('Taylor')`-ஐ trigger செய்கிறது
- **`'Bob'` fetching முடிவதற்கு *முன்* `'Taylor'` fetching முடிகிறது**
- `'Taylor'` render-இலிருந்து வந்த Effect `setBio('இது Taylor உடைய bio')` call செய்கிறது
- `'Bob'` fetching முடிகிறது
- `'Bob'` render-இலிருந்து வந்த Effect `setBio('இது Bob உடைய bio')` call செய்கிறது

அதனால்தான் Taylor selected ஆக இருந்தாலும் Bob-ன் bio-ஐ பார்க்கிறீர்கள். இப்படியான bugs [race conditions](https://en.wikipedia.org/wiki/Race_condition) என்று அழைக்கப்படுகின்றன, ஏனெனில் இரண்டு asynchronous operations ஒன்றுடன் ஒன்று "race" செய்கின்றன, அவை எதிர்பாராத order-இல் வந்து சேரலாம்.

இந்த race condition-ஐ fix செய்ய, cleanup function சேர்க்கவும்:

<Sandpack>

{/* மிக efficient அல்ல, ஆனால் இந்த validation linter-இல் மட்டும் enabled; எனவே நாங்கள் என்ன செய்கிறோம் என தெரிந்ததால் இங்கே ignore செய்வது சரி */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('இது ' + person + ' உடைய bio.');
    }, delay);
  })
}

```

</Sandpack>

ஒவ்வொரு render-ன் Effect-க்கும் தனித்தனி `ignore` variable உள்ளது. ஆரம்பத்தில், `ignore` variable `false` ஆக set செய்யப்படுகிறது. ஆனால் ஒரு Effect clean up செய்யப்பட்டால் (உதாரணமாக, வேறு person select செய்யும் போது), அதன் `ignore` variable `true` ஆகிறது. எனவே requests எந்த order-இல் complete ஆகின்றன என்பது இப்போது முக்கியமில்லை. கடைசி person-ன் Effect மட்டும் `ignore` `false` ஆக இருக்கும், எனவே அது `setBio(result)` call செய்யும். கடந்த Effects clean up செய்யப்பட்டுள்ளதால், `if (!ignore)` check அவற்றை `setBio` call செய்வதைத் தடுக்கும்:

- `'Bob'` select செய்வது `fetchBio('Bob')`-ஐ trigger செய்கிறது
- `'Taylor'` select செய்வது `fetchBio('Taylor')`-ஐ trigger செய்கிறது **மேலும் previous (Bob-ன்) Effect-ஐ clean up செய்கிறது**
- `'Bob'` fetching முடிவதற்கு *முன்* `'Taylor'` fetching முடிகிறது
- `'Taylor'` render-இலிருந்து வந்த Effect `setBio('இது Taylor உடைய bio')` call செய்கிறது
- `'Bob'` fetching முடிகிறது
- `'Bob'` render-இலிருந்து வந்த Effect **எதையும் செய்யாது, ஏனெனில் அதன் `ignore` flag `true` ஆக set செய்யப்பட்டது**

Outdated API call-ன் result-ஐ ignore செய்வதுடன், இனி தேவையில்லாத requests-ஐ cancel செய்ய [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)-ஐயும் use செய்யலாம். ஆனால் இது மட்டும் race conditions-இலிருந்து பாதுகாக்க போதாது. Fetch பிறகு மேலும் asynchronous steps chain ஆக இருக்கலாம், எனவே `ignore` போன்ற explicit flag use செய்வதே இந்த வகை problem-ஐ fix செய்ய மிகவும் reliable வழி.

</Solution>

</Challenges>
