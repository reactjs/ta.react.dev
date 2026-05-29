---
title: React App உருவாக்குதல்
---

<Intro>

React கொண்டு புதிய app அல்லது website உருவாக்க விரும்பினால், framework-இலிருந்து தொடங்க பரிந்துரைக்கிறோம்.

</Intro>

உங்கள் app-க்கு existing frameworks சரியாகப் பூர்த்தி செய்யாத கட்டுப்பாடுகள் இருந்தால், உங்கள் சொந்த framework உருவாக்க விரும்பினால், அல்லது React app-ன் அடிப்படைகளை மட்டும் கற்றுக்கொள்ள விரும்பினால், நீங்கள் [புதிதாக ஒரு React app உருவாக்கலாம்](/learn/build-a-react-app-from-scratch).

## Full-stack frameworks {/*full-stack-frameworks*/}

Production-இல் உங்கள் app-ஐ deploy செய்து scale செய்ய தேவையான எல்லா features-க்கும் இந்த பரிந்துரைக்கப்பட்ட frameworks support தருகின்றன. இவை சமீபத்திய React features-ஐ integrate செய்து React-ன் architecture-ஐ பயன்படுத்துகின்றன.

<Note>

#### Full-stack frameworks-க்கு server அவசியமில்லை. {/*react-frameworks-do-not-require-a-server*/}

இந்தப் பக்கத்தில் உள்ள எல்லா frameworks-மும் client-side rendering ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), single-page apps ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), மற்றும் static-site generation ([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG))-க்கு support தருகின்றன. இத்தகைய apps-ஐ server இல்லாமல் [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) அல்லது static hosting service-க்கு deploy செய்யலாம். மேலும், உங்கள் use case-க்கு பொருத்தமாக இருக்கும் போது, இந்த frameworks ஒவ்வொரு route அடிப்படையிலும் server-side rendering சேர்க்க அனுமதிக்கின்றன.

இதனால் நீங்கள் client-only app-ஆக தொடங்கலாம்; பிறகு உங்கள் தேவைகள் மாறினால், app-ஐ rewrite செய்யாமல் தனித்தனி routes-இல் server features பயன்படுத்த opt-in செய்யலாம். Rendering strategy-ஐ configure செய்ய உங்கள் framework-ன் documentation-ஐ பார்க்கவும்.

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js-ன் App Router](https://nextjs.org/docs) என்பது full-stack React apps-ஐ உருவாக்க React architecture-ஐ முழுமையாகப் பயன்படுத்தும் React framework ஆகும்.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js-ஐ [Vercel](https://vercel.com/) maintain செய்கிறது. Node.js அல்லது Docker containers-க்கு support தரும் எந்த hosting provider-க்கும், அல்லது உங்கள் சொந்த server-க்கும், நீங்கள் [Next.js app-ஐ deploy செய்யலாம்](https://nextjs.org/docs/app/building-your-application/deploying). Server தேவையில்லாத [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)-க்கும் Next.js support தருகிறது.

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) என்பது React-க்கான மிகவும் பிரபலமான routing library; இதை Vite உடன் இணைத்து full-stack React framework உருவாக்கலாம்**. இது standard Web APIs-ஐ முன்னிலைப்படுத்துகிறது; பல்வேறு JavaScript runtimes மற்றும் platforms-க்கான பல [ready-to-deploy templates](https://github.com/remix-run/react-router-templates)-ஐ கொண்டுள்ளது.

புதிய React Router framework project உருவாக்க, இதை run செய்யுங்கள்:

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router-ஐ [Shopify](https://www.shopify.com) maintain செய்கிறது.

### Expo (for native apps) {/*expo*/}

**[Expo](https://expo.dev/) என்பது உண்மையான native UIs உடன் universal Android, iOS, மற்றும் web apps உருவாக்க உதவும் React framework ஆகும்.** Native பகுதிகளை பயன்படுத்த உதவும் [React Native](https://reactnative.dev/)-க்கான SDK-ஐ இது வழங்குகிறது. புதிய Expo project உருவாக்க, இதை run செய்யுங்கள்:

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Expo-க்கு நீங்கள் புதியவராக இருந்தால், [Expo tutorial](https://docs.expo.dev/tutorial/introduction/)-ஐ பார்க்கவும்.

Expo-ஐ [Expo (the company)](https://expo.dev/about) maintain செய்கிறது. Expo கொண்டு apps உருவாக்குவது இலவசம்; அவற்றை Google மற்றும் Apple app stores-க்கு கட்டுப்பாடுகளில்லாமல் submit செய்யலாம். கூடுதலாக, opt-in paid cloud services-யையும் Expo வழங்குகிறது.


## மற்ற frameworks {/*other-frameworks*/}

எங்கள் full stack React vision நோக்கி செயல்படும் இன்னும் சில வளர்ந்து வரும் frameworks உள்ளன:

- [TanStack Start (Beta)](https://tanstack.com/start/): TanStack Start என்பது TanStack Router மூலம் இயங்கும் full-stack React framework. Nitro மற்றும் Vite போன்ற tools பயன்படுத்தி, இது full-document SSR, streaming, server functions, bundling, மேலும் பலவற்றை வழங்குகிறது.
- [RedwoodSDK](https://rwsdk.com/): Redwood என்பது full stack web applications உருவாக்க உதவும் பல pre-installed packages மற்றும் configuration கொண்ட full stack React framework.

<DeepDive>

#### React team-ன் full-stack architecture vision-ஐ உருவாக்கும் features எவை? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js-ன் App Router bundler, அதிகாரப்பூர்வ [React Server Components specification](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)-ஐ முழுமையாக implement செய்கிறது. இதனால் build-time, server-only, மற்றும் interactive components-ஐ ஒரே React tree-இல் mix செய்யலாம்.

உதாரணமாக, database அல்லது file-இலிருந்து read செய்யும் `async` function ஆக server-only React component எழுதலாம். பிறகு அதிலிருந்து data-வை உங்கள் interactive components-க்கு pass செய்யலாம்:

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js-ன் App Router, [Suspense உடன் data fetching](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)-யையும் integrate செய்கிறது. இதனால் உங்கள் user interface-ன் வேறு பகுதிகளுக்கான loading state-ஐ (skeleton placeholder போன்றது) நேரடியாக உங்கள் React tree-இல் குறிப்பிடலாம்:

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components மற்றும் Suspense ஆகியவை Next.js features அல்ல; React features. ஆனால் அவற்றை framework level-இல் ஏற்க buy-in மற்றும் சிக்கலான implementation work தேவைப்படும். இப்போது Next.js App Router தான் மிகவும் முழுமையான implementation. அடுத்த தலைமுறை frameworks-இல் இந்த features-ஐ implement செய்வதை மேம்படுத்த React team bundler developers உடன் பணியாற்றுகிறது.

</DeepDive>

## புதிதாகத் தொடங்குதல் {/*start-from-scratch*/}

உங்கள் app-க்கு existing frameworks சரியாகப் பூர்த்தி செய்யாத கட்டுப்பாடுகள் இருந்தால், உங்கள் சொந்த framework உருவாக்க விரும்பினால், அல்லது React app-ன் அடிப்படைகளை மட்டும் கற்றுக்கொள்ள விரும்பினால், React project-ஐ புதிதாகத் தொடங்க மற்ற options உள்ளன.

புதிதாகத் தொடங்குவது உங்களுக்கு அதிக flexibility தரும்; ஆனால் routing, data fetching, மற்றும் பிற பொதுவான usage patterns-க்கு எந்த tools பயன்படுத்த வேண்டும் என்பதை நீங்கள் தேர்வு செய்ய வேண்டி வரும். Existing framework-ஐ பயன்படுத்துவதற்கு பதிலாக, உங்கள் சொந்த framework உருவாக்குவது போல இது இருக்கும். [நாங்கள் பரிந்துரைக்கும் frameworks](#full-stack-frameworks)-இல் இந்த பிரச்சினைகளுக்கான built-in solutions உள்ளன.

உங்கள் சொந்த solutions உருவாக்க விரும்பினால், [Vite](https://vite.dev/), [Parcel](https://parceljs.org/), அல்லது [RSbuild](https://rsbuild.dev/) போன்ற build tool-இலிருந்து புதிய React project அமைப்பதற்கான வழிமுறைகளுக்கு [புதிதாக React app உருவாக்குதல்](/learn/build-a-react-app-from-scratch) guide-ஐ பார்க்கவும்.

-----

_இந்தப் பக்கத்தில் சேர்க்கப்பட விரும்பும் framework author நீங்கள் என்றால், [தயவுசெய்து எங்களுக்குத் தெரிவிக்கவும்](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
