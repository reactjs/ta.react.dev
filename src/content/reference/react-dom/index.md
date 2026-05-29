---
title: React DOM API-கள்
---

<Intro>

`react-dom` package, web applications-க்கு மட்டும் ஆதரிக்கப்படும் methods-ஐக் கொண்டுள்ளது (அவை browser DOM சூழலில் இயங்குகின்றன). அவை React Native-க்கு ஆதரிக்கப்படவில்லை.

</Intro>

---

## APIs {/*apis*/}

இந்த API-களை உங்கள் components-இலிருந்து import செய்யலாம். அவை அரிதாகவே பயன்படுத்தப்படுகின்றன:

* [`createPortal`](/reference/react-dom/createPortal) child components-ஐ DOM tree-இன் வேறு பகுதியில் render செய்ய உதவுகிறது.
* [`flushSync`](/reference/react-dom/flushSync) ஒரு state update-ஐ flush செய்து DOM-ஐ synchronously update செய்ய React-ஐ கட்டாயப்படுத்த உதவுகிறது.

## Resource Preloading API-கள் {/*resource-preloading-apis*/}

Scripts, stylesheets, மற்றும் fonts போன்ற resources தேவைப்படும் என்று தெரிந்தவுடன் அவற்றை முன்கூட்டியே load செய்து apps-ஐ வேகமாக்க இந்த API-களைப் பயன்படுத்தலாம். உதாரணமாக, அந்த resources பயன்படுத்தப்படும் வேறு பக்கத்துக்கு navigate செய்வதற்கு முன் இதைச் செய்யலாம்.

[React அடிப்படையிலான frameworks](/learn/creating-a-react-app) பெரும்பாலும் resource loading-ஐ உங்களுக்குப் பதிலாக கையாளும், எனவே இந்த API-களை நீங்களே அழைக்க வேண்டியிருக்காமல் இருக்கலாம். விவரங்களுக்கு உங்கள் framework-இன் documentation-ஐப் பாருங்கள்.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) நீங்கள் connect செய்யப் போகிறீர்கள் என்று எதிர்பார்க்கும் DNS domain name-இன் IP address-ஐ prefetch செய்ய உதவுகிறது.
* [`preconnect`](/reference/react-dom/preconnect) இன்னும் எந்த resources தேவைப்படும் என்று தெரியாவிட்டாலும், resources கேட்கப் போகிறீர்கள் என்று எதிர்பார்க்கும் server-க்கு connect செய்ய உதவுகிறது.
* [`preload`](/reference/react-dom/preload) நீங்கள் பயன்படுத்தப் போகிறீர்கள் என்று எதிர்பார்க்கும் stylesheet, font, image, அல்லது external script-ஐ fetch செய்ய உதவுகிறது.
* [`preloadModule`](/reference/react-dom/preloadModule) நீங்கள் பயன்படுத்தப் போகிறீர்கள் என்று எதிர்பார்க்கும் ESM module-ஐ fetch செய்ய உதவுகிறது.
* [`preinit`](/reference/react-dom/preinit) external script ஒன்றை fetch செய்து evaluate செய்யவும், அல்லது stylesheet ஒன்றை fetch செய்து insert செய்யவும் உதவுகிறது.
* [`preinitModule`](/reference/react-dom/preinitModule) ESM module ஒன்றை fetch செய்து evaluate செய்ய உதவுகிறது.

---

## Entry points {/*entry-points*/}

`react-dom` package இரண்டு கூடுதல் entry points-ஐ வழங்குகிறது:

* [`react-dom/client`](/reference/react-dom/client) client-இல் (உலாவியில்) React components-ஐ render செய்யும் API-களை கொண்டுள்ளது.
* [`react-dom/server`](/reference/react-dom/server) server-இல் React components-ஐ render செய்யும் API-களை கொண்டுள்ளது.

---

## நீக்கப்பட்ட API-கள் {/*removed-apis*/}

இந்த API-கள் React 19-இல் நீக்கப்பட்டன:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): [மாற்று வழிகளை](https://18.react.dev/reference/react-dom/findDOMNode#alternatives) பார்க்கவும்.
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): இதற்கு பதிலாக [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)-ஐப் பயன்படுத்துங்கள்.
* [`render`](https://18.react.dev/reference/react-dom/render): இதற்கு பதிலாக [`createRoot`](/reference/react-dom/client/createRoot)-ஐப் பயன்படுத்துங்கள்.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): இதற்கு பதிலாக [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)-ஐப் பயன்படுத்துங்கள்.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): இதற்கு பதிலாக [`react-dom/server`](/reference/react-dom/server) API-களைப் பயன்படுத்துங்கள்.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): இதற்கு பதிலாக [`react-dom/server`](/reference/react-dom/server) API-களைப் பயன்படுத்துங்கள்.
