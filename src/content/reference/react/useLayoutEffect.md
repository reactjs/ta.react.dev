---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` performance-ஐ பாதிக்கக்கூடும். சாத்தியமான போது [`useEffect`](/reference/react/useEffect)-ஐ முன்னுரிமை அளியுங்கள்.

</Pitfall>

<Intro>

`useLayoutEffect` என்பது browser screen-ஐ repaint செய்வதற்கு முன் fire ஆகும் [`useEffect`](/reference/react/useEffect)-ன் ஒரு version.

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Browser screen-ஐ repaint செய்வதற்கு முன் layout measurements செய்ய `useLayoutEffect`-ஐ call செய்யுங்கள்:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[மேலும் எடுத்துக்காட்டுகளை கீழே பாருங்கள்.](#usage)

#### Parameters {/*parameters*/}

* `setup`: உங்கள் Effect-ன் logic கொண்ட function. உங்கள் setup function விருப்பமாக *cleanup* function ஒன்றையும் return செய்யலாம். உங்கள் [component commit](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom) ஆகும் முன், React உங்கள் setup function-ஐ run செய்யும். Dependencies மாறிய ஒவ்வொரு commit-க்கும் பிறகு, React முதலில் பழைய values உடன் cleanup function-ஐ (நீங்கள் வழங்கியிருந்தால்) run செய்து, பின்னர் புதிய values உடன் setup function-ஐ run செய்யும். உங்கள் component DOM-இலிருந்து remove செய்யப்படுவதற்கு முன், React உங்கள் cleanup function-ஐ run செய்யும்.

* **optional** `dependencies`: `setup` code-க்குள் referenced செய்யப்படும் அனைத்து reactive values-ன் list. Reactive values-ல் props, state, மேலும் உங்கள் component body-க்குள் நேரடியாக declared செய்யப்பட்ட அனைத்து variables மற்றும் functions அடங்கும். உங்கள் linter [React-க்காக configured](/learn/editor-setup#linting) செய்யப்பட்டிருந்தால், ஒவ்வொரு reactive value-மும் dependency ஆக சரியாக குறிப்பிடப்பட்டுள்ளதா என்பதை அது verify செய்யும். Dependencies list நிலையான எண்ணிக்கையிலான items கொண்டதாகவும் `[dep1, dep2, dep3]` போல inline ஆக எழுதப்பட்டதாகவும் இருக்க வேண்டும். React ஒவ்வொரு dependency-யையும் அதன் முந்தைய value-உடன் [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison மூலம் compare செய்யும். இந்த argument-ஐ omit செய்தால், component-ன் ஒவ்வொரு commit-க்கும் பிறகு உங்கள் Effect மீண்டும் run ஆகும்.

#### Returns {/*returns*/}

`useLayoutEffect` `undefined`-ஐ return செய்கிறது.

#### Caveats {/*caveats*/}

* `useLayoutEffect` ஒரு Hook; எனவே அதை **உங்கள் component-ன் top level-இல்** அல்லது உங்கள் சொந்த Hooks-இல் மட்டுமே call செய்யலாம். Loops அல்லது conditions-க்குள் அதை call செய்ய முடியாது. அது தேவைப்பட்டால், component ஒன்றை extract செய்து Effect-ஐ அங்கே நகர்த்துங்கள்.

* Strict Mode on ஆக இருக்கும்போது, முதல் உண்மையான setup-க்கு முன் React **development-only setup+cleanup cycle ஒன்றை கூடுதலாக** run செய்யும். இது உங்கள் cleanup logic உங்கள் setup logic-ஐ "mirrors" செய்கிறது என்பதையும், setup செய்யும் எதையும் அது stop அல்லது undo செய்கிறது என்பதையும் உறுதி செய்யும் stress-test. இது பிரச்சினை ஏற்படுத்தினால், [cleanup function-ஐ implement செய்யுங்கள்.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* உங்கள் dependencies-இல் சில component-க்குள் defined செய்யப்பட்ட objects அல்லது functions ஆக இருந்தால், அவை **Effect தேவைக்கு அதிகமாக re-run ஆகும்** அபாயம் உள்ளது. இதைச் சரிசெய்ய, தேவையற்ற [object](/reference/react/useEffect#removing-unnecessary-object-dependencies) மற்றும் [function](/reference/react/useEffect#removing-unnecessary-function-dependencies) dependencies-ஐ remove செய்யுங்கள். உங்கள் Effect-க்கு வெளியே [state updates](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) மற்றும் [non-reactive logic](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect)-ஐயும் extract செய்யலாம்.

* Effects **client-இல் மட்டுமே run ஆகும்.** Server rendering போது அவை run ஆகாது.

* `useLayoutEffect`-க்குள் உள்ள code மற்றும் அதிலிருந்து schedule செய்யப்படும் அனைத்து state updates-மும் **browser screen-ஐ repaint செய்வதை block செய்கின்றன.** அதிகமாக பயன்படுத்தினால், இது உங்கள் app-ஐ slow ஆக்கும். சாத்தியமானபோது [`useEffect`](/reference/react/useEffect)-ஐ முன்னுரிமை அளியுங்கள்.

* `useLayoutEffect`-க்குள் state update ஒன்றை trigger செய்தால், `useEffect` உட்பட மீதமுள்ள அனைத்து Effects-ஐயும் React உடனே execute செய்யும்.

---

## Usage {/*usage*/}

### Browser screen-ஐ repaint செய்வதற்கு முன் layout-ஐ measure செய்தல் {/*measuring-layout-before-the-browser-repaints-the-screen*/}

பெரும்பாலான components என்ன render செய்ய வேண்டும் என்பதை முடிவு செய்ய screen-இல் தங்களின் position மற்றும் size-ஐ அறிய தேவையில்லை. அவை சில JSX-ஐ மட்டும் return செய்கின்றன. பின்னர் browser அவற்றின் *layout* (position மற்றும் size)-ஐ calculate செய்து screen-ஐ repaint செய்கிறது.

சில நேரங்களில் அது போதாது. Hover செய்யும்போது ஒரு element-க்கு அருகில் தோன்றும் tooltip ஒன்றைக் கற்பனை செய்யுங்கள். போதுமான இடம் இருந்தால், tooltip element-க்கு மேல் தோன்ற வேண்டும்; பொருந்தவில்லை என்றால் கீழே தோன்ற வேண்டும். Tooltip-ஐ சரியான இறுதி position-இல் render செய்ய, அதன் height-ஐ தெரிந்திருக்க வேண்டும் (அதாவது அது மேலே பொருந்துமா என்பதை).

இதற்கு, இரண்டு passes-இல் render செய்ய வேண்டும்:

1. Tooltip-ஐ எங்காவது render செய்யுங்கள் (தவறான position உடனாக இருந்தாலும்).
2. அதன் height-ஐ measure செய்து tooltip-ஐ எங்கு வைக்க வேண்டும் என்பதை முடிவு செய்யுங்கள்.
3. Tooltip-ஐ சரியான இடத்தில் *மீண்டும்* render செய்யுங்கள்.

**இவை அனைத்தும் browser screen-ஐ repaint செய்வதற்கு முன் நடக்க வேண்டும்.** Tooltip நகர்வதை user பார்க்க நீங்கள் விரும்பமாட்டீர்கள். Browser screen-ஐ repaint செய்வதற்கு முன் layout measurements செய்ய `useLayoutEffect`-ஐ call செய்யுங்கள்:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // உண்மையான height இன்னும் தெரியாது

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // உண்மையான height தெரிந்ததால் இப்போது re-render செய்
  }, []);

  // ...use tooltipHeight in the rendering logic below...
}
```

இது படிப்படியாக எப்படி வேலை செய்கிறது:

1. `Tooltip` ஆரம்ப `tooltipHeight = 0` உடன் render ஆகிறது (எனவே tooltip தவறாக positioned ஆக இருக்கலாம்).
2. React அதை DOM-இல் வைத்து, `useLayoutEffect`-க்குள் உள்ள code-ஐ run செய்கிறது.
3. உங்கள் `useLayoutEffect` tooltip content-ன் [height-ஐ measure](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) செய்து உடனடி re-render ஒன்றை trigger செய்கிறது.
4. `Tooltip` உண்மையான `tooltipHeight` உடன் மீண்டும் render ஆகிறது (எனவே tooltip சரியாக positioned ஆகிறது).
5. React அதை DOM-இல் update செய்கிறது, இறுதியாக browser tooltip-ஐ display செய்கிறது.

கீழே உள்ள buttons மீது hover செய்து, அது பொருந்துகிறதா என்பதைப் பொறுத்து tooltip எப்படி தனது position-ஐ adjust செய்கிறது என்பதைப் பாருங்கள்:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            இந்த tooltip button-க்கு மேல் பொருந்தவில்லை.
            <br />
            அதனால்தான் இது பதிலாக கீழே காட்டப்படுகிறது!
          </div>
        }
      >
        என்னை hover செய்க (tooltip மேல்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('அளவிடப்பட்ட tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

`Tooltip` component இரண்டு passes-இல் render செய்ய வேண்டியிருந்தாலும் (முதலில் `tooltipHeight` `0` ஆக initialized ஆக, பின்னர் உண்மையாக measured height உடன்), நீங்கள் இறுதி result-ஐ மட்டுமே பார்க்கிறீர்கள் என்பதை கவனியுங்கள். இந்த example-க்கு [`useEffect`](/reference/react/useEffect)-க்கு பதிலாக `useLayoutEffect` தேவைப்படுவதற்கான காரணம் இதுவே. கீழே வேறுபாட்டைப் பார்க்கலாம்.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` browser repaint செய்வதை block செய்கிறது {/*uselayouteffect-blocks-the-browser-from-repainting*/}

`useLayoutEffect`-க்குள் உள்ள code மற்றும் அதற்குள் schedule செய்யப்படும் எந்த state updates-மும் **browser screen-ஐ repaint செய்வதற்கு முன்** process செய்யப்படும் என்று React guarantee செய்கிறது. இதனால் tooltip-ஐ render செய்து, measure செய்து, user முதல் கூடுதல் render-ஐ கவனிக்காமல் மீண்டும் render செய்யலாம். வேறு வார்த்தைகளில், `useLayoutEffect` browser painting-ஐ block செய்கிறது.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            இந்த tooltip button-க்கு மேல் பொருந்தவில்லை.
            <br />
            அதனால்தான் இது பதிலாக கீழே காட்டப்படுகிறது!
          </div>
        }
      >
        என்னை hover செய்க (tooltip மேல்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` browser-ஐ block செய்யாது {/*useeffect-does-not-block-the-browser*/}

இதே example இதோ, ஆனால் `useLayoutEffect`-க்கு பதிலாக [`useEffect`](/reference/react/useEffect) உடன். நீங்கள் மெதுவான device-இல் இருந்தால், சில நேரங்களில் tooltip "flicker" ஆகி, corrected position-க்கு முன் அதன் initial position-ஐ மிகச் சிறிது நேரம் பார்க்கலாம்.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            இந்த tooltip button-க்கு மேல் பொருந்தவில்லை.
            <br />
            அதனால்தான் இது பதிலாக கீழே காட்டப்படுகிறது!
          </div>
        }
      >
        என்னை hover செய்க (tooltip மேல்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Bug-ஐ reproduce செய்வதை மேம்படுத்த, இந்த version rendering போது artificial delay ஒன்றைச் சேர்க்கிறது. `useEffect`-க்குள் உள்ள state update-ஐ process செய்வதற்கு முன், React browser-க்கு screen-ஐ paint செய்ய அனுமதிக்கும். அதன் விளைவாக, tooltip flicker ஆகும்:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            இந்த tooltip button-க்கு மேல் பொருந்தவில்லை.
            <br />
            அதனால்தான் இது பதிலாக கீழே காட்டப்படுகிறது!
          </div>
        }
      >
        என்னை hover செய்க (tooltip மேல்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>இந்த tooltip button-க்கு மேல் பொருந்துகிறது</div>
        }
      >
        என்னை hover செய்க (tooltip கீழ்)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js {expectedErrors: {'react-compiler': [10, 11]}} src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

இந்த example-ஐ `useLayoutEffect` ஆக edit செய்து, rendering மெதுவாக்கப்பட்டிருந்தாலும் அது paint-ஐ block செய்வதை observe செய்யுங்கள்.

<Solution />

</Recipes>

<Note>

இரண்டு passes-இல் render செய்வதும் browser-ஐ block செய்வதும் performance-ஐ பாதிக்கும். முடிந்தவரை இதைத் தவிர்க்க முயலுங்கள்.

</Note>

---

## Troubleshooting {/*troubleshooting*/}

### எனக்கு error வருகிறது: "`useLayoutEffect` server-இல் எதுவும் செய்யாது" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

`useLayoutEffect`-ன் நோக்கம் உங்கள் component [rendering-க்கு layout information பயன்படுத்த](/reference/react/useLayoutEffect#measuring-layout-before-the-browser-repaints-the-screen) அனுமதிப்பதே:

1. Initial content-ஐ render செய்யுங்கள்.
2. *Browser screen-ஐ repaint செய்வதற்கு முன்* layout-ஐ measure செய்யுங்கள்.
3. நீங்கள் வாசித்த layout information-ஐ பயன்படுத்தி final content-ஐ render செய்யுங்கள்.

நீங்கள் அல்லது உங்கள் framework [server rendering](/reference/react-dom/server)-ஐ பயன்படுத்தும்போது, initial render-க்காக உங்கள் React app server-இல் HTML ஆக render ஆகிறது. இதனால் JavaScript code load ஆகும் முன் initial HTML-ஐ காட்டலாம்.

பிரச்சினை என்னவெனில் server-இல் layout information இல்லை.

[முந்தைய example](#measuring-layout-before-the-browser-repaints-the-screen)-இல், `Tooltip` component-இல் உள்ள `useLayoutEffect` call, content height-ஐப் பொறுத்து அது தன்னைத்தானே சரியாக position செய்ய (content-க்கு மேலோ கீழோ) அனுமதிக்கிறது. Initial server HTML-ன் பகுதியாக `Tooltip`-ஐ render செய்ய முயன்றால், இதை தீர்மானிப்பது சாத்தியமில்லை. Server-இல் layout இன்னும் இல்லை! ஆகவே, server-இல் அதை render செய்தாலும், JavaScript load ஆகி run ஆன பிறகு அதன் position client-இல் "jump" ஆகும்.

வழக்கமாக, layout information-ஐ சார்ந்த components server-இல் render ஆக தேவையில்லை. உதாரணமாக, initial render போது `Tooltip` காட்டுவது பெரும்பாலும் பொருள் இல்லாதது. அது client interaction மூலம் trigger செய்யப்படுகிறது.

ஆனால், இந்த பிரச்சினையை நீங்கள் சந்தித்தால், சில வேறு options உங்களிடம் உள்ளன:

- `useLayoutEffect`-ஐ [`useEffect`](/reference/react/useEffect)-ஆல் replace செய்யுங்கள். இது original HTML உங்கள் Effect run ஆகும் முன் visible ஆகிவிடுவதால், paint-ஐ block செய்யாமல் initial render result-ஐ display செய்வது பரவாயில்லை என்று React-க்கு சொல்கிறது.

- மாற்றாக, [உங்கள் component-ஐ client-only ஆக mark செய்யுங்கள்.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) Server rendering போது, closest [`<Suspense>`](/reference/react/Suspense) boundary வரை அதன் content-ஐ loading fallback (உதாரணமாக spinner அல்லது glimmer) ஒன்றால் replace செய்ய React-க்கு இது சொல்கிறது.

- மாற்றாக, hydration-க்கு பிறகே `useLayoutEffect` உள்ள component-ஐ render செய்யலாம். `false` ஆக initialized செய்யப்படும் boolean `isMounted` state ஒன்றை வைத்திருந்து, `useEffect` call-க்குள் அதை `true` ஆக set செய்யுங்கள். பின்னர் உங்கள் rendering logic `return isMounted ? <RealContent /> : <FallbackContent />` போல இருக்கலாம். Server-இலும் hydration நேரத்திலும், user `FallbackContent`-ஐப் பார்ப்பார்; அது `useLayoutEffect`-ஐ call செய்யக்கூடாது. பின்னர் React அதை client-இல் மட்டும் run ஆகும் மற்றும் `useLayoutEffect` calls சேர்க்கக்கூடிய `RealContent`-ஆல் replace செய்யும்.

- உங்கள் component-ஐ external data store-உடன் synchronize செய்து, layout measure செய்வதைத் தவிர வேறு காரணங்களுக்காக `useLayoutEffect`-ஐ சார்ந்திருந்தால், அதற்குப் பதிலாக [`useSyncExternalStore`](/reference/react/useSyncExternalStore)-ஐ பரிசீலிக்கவும்; அது [server rendering-ஐ support செய்கிறது.](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)
