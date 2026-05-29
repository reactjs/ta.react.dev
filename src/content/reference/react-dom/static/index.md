---
title: Static React DOM API-கள்
---

<Intro>

`react-dom/static` API-கள் React components-க்கான static HTML-ஐ உருவாக்க உதவுகின்றன. Streaming API-களுடன் ஒப்பிடும்போது இவற்றின் செயல்பாடு வரம்புடையது. ஒரு [framework](/learn/creating-a-react-app#full-stack-frameworks) உங்களுக்குப் பதிலாக அவற்றை அழைக்கலாம். உங்கள் பெரும்பாலான components அவற்றை import செய்யவோ பயன்படுத்தவோ தேவையில்லை.

</Intro>

---

## Web Streams-க்கான Static API-கள் {/*static-apis-for-web-streams*/}

இந்த methods, [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) உள்ள சூழல்களில் மட்டுமே கிடைக்கும். இதில் உலாவிகள், Deno, மற்றும் சில நவீன edge runtimes அடங்கும்:

* [`prerender`](/reference/react-dom/static/prerender) ஒரு React tree-ஐ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) மூலம் static HTML ஆக render செய்கிறது.
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) ஏற்கனவே prerender செய்யப்பட்ட React tree-ஐ [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) மூலம் static HTML ஆகத் தொடர்கிறது.

இணக்கத்திற்காக Node.js-லும் இந்த methods உள்ளன, ஆனால் குறைந்த செயல்திறன் காரணமாக அவை பரிந்துரைக்கப்படவில்லை. அதற்கு பதிலாக [Node.js-க்கு தனியாக உள்ள API-களை](#static-apis-for-nodejs-streams) பயன்படுத்துங்கள்.

---

## Node.js Streams-க்கான Static API-கள் {/*static-apis-for-nodejs-streams*/}

இந்த methods, [Node.js Streams](https://nodejs.org/api/stream.html) உள்ள சூழல்களில் மட்டுமே கிடைக்கும்:

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) ஒரு React tree-ஐ [Node.js Stream](https://nodejs.org/api/stream.html) மூலம் static HTML ஆக render செய்கிறது.
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) ஏற்கனவே prerender செய்யப்பட்ட React tree-ஐ [Node.js Stream](https://nodejs.org/api/stream.html) மூலம் static HTML ஆகத் தொடர்கிறது.
