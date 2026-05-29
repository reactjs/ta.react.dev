---
title: கிளையண்ட் React DOM API-கள்
---

<Intro>

`react-dom/client` API-கள், கிளையண்டில் (உலாவியில்) React components-ஐ render செய்ய உதவுகின்றன. உங்கள் React tree-ஐ தொடங்க, இந்த API-கள் பொதுவாக உங்கள் app-இன் மேல் நிலையில் பயன்படுத்தப்படுகின்றன. ஒரு [framework](/learn/creating-a-react-app#full-stack-frameworks) உங்களுக்குப் பதிலாக அவற்றை அழைக்கலாம். உங்கள் பெரும்பாலான components அவற்றை import செய்யவோ பயன்படுத்தவோ தேவையில்லை.

</Intro>

---

## கிளையண்ட் API-கள் {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) ஒரு browser DOM node-க்குள் React components-ஐ காட்ட root ஒன்றை உருவாக்க உதவுகிறது.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) முன்பே [`react-dom/server`.](/reference/react-dom/server) மூலம் HTML உள்ளடக்கம் உருவாக்கப்பட்ட browser DOM node-க்குள் React components-ஐ காட்ட உதவுகிறது.

---

## உலாவி ஆதரவு {/*browser-support*/}

Internet Explorer 9 மற்றும் அதற்கு மேற்பட்ட பதிப்புகள் உட்பட, அனைத்து பிரபலமான உலாவிகளையும் React ஆதரிக்கிறது. IE 9 மற்றும் IE 10 போன்ற பழைய உலாவிகளுக்கு சில polyfills தேவைப்படும்.
