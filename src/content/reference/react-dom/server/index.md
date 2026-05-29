---
title: Server React DOM API-கள்
---

<Intro>

`react-dom/server` API-கள் React components-ஐ server-side-இல் HTML ஆக render செய்ய உதவுகின்றன. Initial HTML-ஐ உருவாக்க, இந்த API-கள் உங்கள் app-இன் மேல் நிலையில் server-இல் மட்டுமே பயன்படுத்தப்படுகின்றன. ஒரு [framework](/learn/creating-a-react-app#full-stack-frameworks) உங்களுக்குப் பதிலாக அவற்றை அழைக்கலாம். உங்கள் பெரும்பாலான components அவற்றை import செய்யவோ பயன்படுத்தவோ தேவையில்லை.

</Intro>

---

## Web Streams-க்கான Server API-கள் {/*server-apis-for-web-streams*/}

இந்த methods, [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) உள்ள சூழல்களில் மட்டுமே கிடைக்கும். இதில் உலாவிகள், Deno, மற்றும் சில நவீன edge runtimes அடங்கும்:

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) ஒரு React tree-ஐ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) ஆக render செய்கிறது.
* [`resume`](/reference/react-dom/server/renderToPipeableStream) [`prerender`](/reference/react-dom/static/prerender)-ஐ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) ஆகத் தொடர்கிறது.


<Note>

இணக்கத்திற்காக Node.js-லும் இந்த methods உள்ளன, ஆனால் குறைந்த செயல்திறன் காரணமாக அவை பரிந்துரைக்கப்படவில்லை. அதற்கு பதிலாக [Node.js-க்கு தனியாக உள்ள API-களை](#server-apis-for-nodejs-streams) பயன்படுத்துங்கள்.

</Note>
---

## Node.js Streams-க்கான Server API-கள் {/*server-apis-for-nodejs-streams*/}

இந்த methods, [Node.js Streams](https://nodejs.org/api/stream.html) உள்ள சூழல்களில் மட்டுமே கிடைக்கும்:

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) ஒரு React tree-ஐ pipe செய்யக்கூடிய [Node.js Stream](https://nodejs.org/api/stream.html) ஆக render செய்கிறது.
* [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)-ஐ pipe செய்யக்கூடிய [Node.js Stream](https://nodejs.org/api/stream.html) ஆகத் தொடர்கிறது.

---

## Streaming இல்லாத சூழல்களுக்கான Legacy Server API-கள் {/*legacy-server-apis-for-non-streaming-environments*/}

Streams-ஐ ஆதரிக்காத சூழல்களில் இந்த methods-ஐப் பயன்படுத்தலாம்:

* [`renderToString`](/reference/react-dom/server/renderToString) ஒரு React tree-ஐ string ஆக render செய்கிறது.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) interactive அல்லாத React tree-ஐ string ஆக render செய்கிறது.

Streaming API-களுடன் ஒப்பிடும்போது இவற்றின் செயல்பாடு வரம்புடையது.
