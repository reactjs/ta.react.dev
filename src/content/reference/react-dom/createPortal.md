---
title: createPortal
---

<Intro>

சில children-ஐ DOM-ன் வேறு பகுதியில் render செய்ய `createPortal` உதவுகிறது.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## குறிப்பு {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Portal உருவாக்க, சில JSX மற்றும் அது render ஆக வேண்டிய DOM node-ஐ pass செய்து `createPortal`-ஐ call செய்யுங்கள்:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[மேலும் உதாரணங்களை கீழே பார்க்கவும்.](#usage)

Portal DOM node-ன் physical placement-ஐ மட்டும் மாற்றுகிறது. மற்ற எல்லா விதங்களிலும், portal-க்குள் நீங்கள் render செய்யும் JSX, அதை render செய்யும் React component-ன் child node போலவே செயல்படும். உதாரணமாக, child parent tree வழங்கும் context-ஐ access செய்ய முடியும்; events React tree அடிப்படையில் children-இலிருந்து parents-க்கு bubble ஆகும்.

#### Parameters {/*parameters*/}

* `children`: React மூலம் render செய்யக்கூடிய எதுவும்; உதாரணமாக JSX பகுதி (`<div />` அல்லது `<SomeComponent />`), [Fragment](/reference/react/Fragment) (`<>...</>`), string அல்லது number, அல்லது இவற்றின் array.

* `domNode`: `document.getElementById()` return செய்யும் போன்ற ஏதேனும் DOM node. Node ஏற்கனவே இருக்க வேண்டும். Update நேரத்தில் வேறு DOM node pass செய்தால் portal content மீண்டும் உருவாக்கப்படும்.

* **optional** `key`: Portal-ன் [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) ஆக பயன்படுத்த வேண்டிய unique string அல்லது number.

#### Returns {/*returns*/}

`createPortal` JSX-இல் சேர்க்கவோ React component-இலிருந்து return செய்யவோ கூடிய React node-ஐ return செய்கிறது. Render output-இல் React அதை கண்டால், வழங்கப்பட்ட `children`-ஐ வழங்கப்பட்ட `domNode`-க்குள் வைக்கும்.

#### Caveats {/*caveats*/}

* Portals-இலிருந்து வரும் events DOM tree-க்கு பதிலாக React tree அடிப்படையில் propagate ஆகும். உதாரணமாக, portal-க்குள் click செய்தால், மேலும் portal `<div onClick>`-க்குள் wrap செய்யப்பட்டிருந்தால், அந்த `onClick` handler fire ஆகும். இது சிக்கல் தருமானால், portal-க்குள் event propagation-ஐ stop செய்யுங்கள், அல்லது portal-ஐ React tree-இல் மேலே நகர்த்துங்கள்.

---

## பயன்பாடு {/*usage*/}

### DOM-ன் வேறு பகுதியில் render செய்தல் {/*rendering-to-a-different-part-of-the-dom*/}

*Portals* உங்கள் components தங்களின் சில children-ஐ DOM-இல் வேறு இடத்தில் render செய்ய அனுமதிக்கின்றன. இதனால் உங்கள் component-ன் ஒரு பகுதி அது இருக்கும் containers-இலிருந்து "escape" செய்ய முடியும். உதாரணமாக, ஒரு component page-ன் மீதமுள்ள பகுதியை விட மேலிலும் வெளியிலும் தோன்றும் modal dialog அல்லது tooltip காட்ட முடியும்.

Portal உருவாக்க, <CodeStep step={1}>சில JSX</CodeStep> மற்றும் <CodeStep step={2}>அது செல்ல வேண்டிய DOM node</CodeStep> உடன் `createPortal` result-ஐ render செய்யுங்கள்:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

நீங்கள் pass செய்த <CodeStep step={1}>JSX</CodeStep>-க்கான DOM nodes-ஐ, நீங்கள் வழங்கிய <CodeStep step={2}>DOM node</CodeStep>-க்குள் React வைக்கும்.

Portal இல்லையெனில், இரண்டாவது `<p>` parent `<div>`-க்குள் வைக்கப்படும்; ஆனால் portal அதை [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)-க்குள் "teleport" செய்தது:

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Border கொண்ட parent `<div>`-க்கு வெளியே இரண்டாவது paragraph எப்படி visually தோன்றுகிறது என்பதை கவனியுங்கள். Developer tools மூலம் DOM structure inspect செய்தால், இரண்டாவது `<p>` நேரடியாக `<body>`-க்குள் வைக்கப்பட்டிருப்பதைப் பார்ப்பீர்கள்:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

Portal DOM node-ன் physical placement-ஐ மட்டும் மாற்றுகிறது. மற்ற எல்லா விதங்களிலும், portal-க்குள் render செய்யும் JSX, அதை render செய்யும் React component-ன் child node போலவே செயல்படும். உதாரணமாக, child parent tree வழங்கும் context-ஐ access செய்ய முடியும்; மேலும் events React tree அடிப்படையில் children-இலிருந்து parents-க்கு bubble ஆகும்.

---

### Portal மூலம் modal dialog render செய்தல் {/*rendering-a-modal-dialog-with-a-portal*/}

Dialog-ஐ summon செய்யும் component `overflow: hidden` அல்லது dialog-ஐ பாதிக்கும் பிற styles கொண்ட container-க்குள் இருந்தாலும், page-ன் மீதமுள்ள பகுதியின் மேல் float ஆகும் modal dialog உருவாக்க portal பயன்படுத்தலாம்.

இந்த உதாரணத்தில், இரண்டு containers-க்கும் modal dialog-ஐ பாதிக்கும் styles உள்ளன; ஆனால் portal-க்குள் render செய்யப்படுவது பாதிக்கப்படவில்லை, ஏனெனில் DOM-இல் modal parent JSX elements-க்குள் contained இல்லை.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Portals பயன்படுத்தும்போது உங்கள் app accessible ஆக இருப்பதை உறுதிசெய்வது முக்கியம். உதாரணமாக, user focus-ஐ portal-க்குள் மற்றும் வெளியே இயல்பாக நகர்த்த keyboard focus manage செய்ய வேண்டியிருக்கலாம்.

Modals உருவாக்கும்போது [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal)-ஐப் பின்பற்றுங்கள். Community package பயன்படுத்தினால், அது accessible ஆகவும் இந்த guidelines-ஐப் பின்பற்றுவதையும் உறுதிசெய்யுங்கள்.

</Pitfall>

---

### Non-React server markup-க்குள் React components render செய்தல் {/*rendering-react-components-into-non-react-server-markup*/}

உங்கள் React root, React கொண்டு build செய்யப்படாத static அல்லது server-rendered page-ன் ஒரு பகுதி மட்டுமே என்றால் portals பயனுள்ளதாக இருக்கும். உதாரணமாக, உங்கள் page Rails போன்ற server framework மூலம் build செய்யப்பட்டிருந்தால், sidebars போன்ற static areas-க்குள் interactivity areas உருவாக்கலாம். [பல தனித்தனி React roots](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) வைத்திருப்பதை ஒப்பிடும்போது, app-ன் பகுதிகள் DOM-ன் வெவ்வேறு இடங்களில் render ஆனாலும், shared state கொண்ட ஒரே React tree ஆக app-ஐ நடத்த portals உதவுகின்றன.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Non-React DOM nodes-க்குள் React components render செய்தல் {/*rendering-react-components-into-non-react-dom-nodes*/}

React-க்கு வெளியே manage செய்யப்படும் DOM node-ன் content-ஐ manage செய்யவும் portal பயன்படுத்தலாம். உதாரணமாக, non-React map widget உடன் integrate செய்து popup-க்குள் React content render செய்ய விரும்புகிறீர்கள் என்று வைத்துக் கொள்ளுங்கள். இதை செய்ய, render செய்யப் போகும் DOM node-ஐ store செய்ய `popupContainer` state variable declare செய்யுங்கள்:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Third-party widget உருவாக்கும்போது, அதில் render செய்ய widget return செய்த DOM node-ஐ store செய்யுங்கள்:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

`popupContainer` கிடைத்ததும், அதற்குள் React content render செய்ய `createPortal` பயன்படுத்த இதனால் முடியும்:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

நீங்கள் முயற்சிக்கக்கூடிய முழு உதாரணம் இங்கே:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
