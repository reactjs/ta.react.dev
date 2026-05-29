---
title: புதிதாக React app உருவாக்குதல்
---

<Intro>

உங்கள் app-க்கு existing frameworks சரியாகப் பூர்த்தி செய்யாத constraints இருந்தால், உங்கள் சொந்த framework உருவாக்க விரும்பினால், அல்லது React app-ன் அடிப்படைகளை மட்டும் கற்றுக்கொள்ள விரும்பினால், React app-ஐ புதிதாக உருவாக்கலாம்.

</Intro>

<DeepDive>

#### Framework பயன்படுத்துவதை பரிசீலிக்கவும் {/*consider-using-a-framework*/}

புதிதாகத் தொடங்குவது React பயன்படுத்த ஆரம்பிக்க நேரடியான வழி. ஆனால் கவனிக்க வேண்டிய முக்கிய tradeoff என்னவென்றால், இந்த வழி பெரும்பாலும் உங்கள் சொந்த ad hoc framework உருவாக்குவதற்குச் சமம். உங்கள் requirements வளரும்போது, நாங்கள் பரிந்துரைக்கும் frameworks ஏற்கனவே நன்றாக உருவாக்கி support செய்யும் framework போன்ற பல பிரச்சினைகளை நீங்களே தீர்க்க வேண்டியிருக்கும்.

உதாரணமாக, எதிர்காலத்தில் உங்கள் app-க்கு server-side rendering (SSR), static site generation (SSG), மற்றும்/அல்லது React Server Components (RSC) support தேவைப்பட்டால், அவற்றை நீங்களே implement செய்ய வேண்டும். அதேபோல், framework level-இல் integration தேவைப்படும் எதிர்கால React features-ஐ பயன்படுத்த விரும்பினால் அவற்றையும் நீங்களே implement செய்ய வேண்டும்.

நாங்கள் பரிந்துரைக்கும் frameworks, மேலும் நல்ல performance கொண்ட apps உருவாக்கவும் உதவுகின்றன. உதாரணமாக, network requests-இல் waterfalls-ஐ குறைப்பது அல்லது நீக்குவது நல்ல user experience தரும். Toy project உருவாக்கும்போது இது பெரிய priority ஆக இருக்காமல் இருக்கலாம்; ஆனால் உங்கள் app users பெறத் தொடங்கினால், அதன் performance-ஐ மேம்படுத்த விரும்பலாம்.

இந்த வழியில் சென்றால் support பெறுவதும் கடினமாகும்; ஏனெனில் routing, data-fetching, மற்றும் பிற features-ஐ நீங்கள் உருவாக்கும் முறை உங்கள் சூழ்நிலைக்கே தனிப்பட்டதாக இருக்கும். இந்த பிரச்சினைகளை நீங்களே கையாளத் தயார் என்றால், அல்லது இந்த features உங்களுக்கு ஒருபோதும் தேவைப்படாது என நம்பிக்கை இருந்தால் மட்டுமே இந்த option-ஐத் தேர்ந்தெடுக்கவும்.

பரிந்துரைக்கப்படும் frameworks பட்டியலுக்கு, [React App உருவாக்குதல்](/learn/creating-a-react-app)-ஐ பார்க்கவும்.

</DeepDive>


## படி 1: Build tool install செய்யுங்கள் {/*step-1-install-a-build-tool*/}

முதல் படி `vite`, `parcel`, அல்லது `rsbuild` போன்ற build tool install செய்வது. இந்த build tools source code-ஐ package செய்து run செய்ய features வழங்குகின்றன; local development-க்கு development server-ஐயும், production server-க்கு உங்கள் app-ஐ deploy செய்ய build command-ஐயும் வழங்குகின்றன.

### Vite {/*vite*/}

[Vite](https://vite.dev/) என்பது modern web projects-க்கு வேகமான மற்றும் lean development experience வழங்கும் நோக்கம் கொண்ட build tool.

<TerminalBlock>
npm create vite@latest my-app -- --template react-ts
</TerminalBlock>

Vite opinionated ஆக இருப்பதுடன், out of the box sensible defaults உடன் வருகிறது. Fast refresh, JSX, Babel/SWC, மற்றும் பிற பொதுவான features support செய்ய Vite-க்கு வளமான plugins ecosystem உள்ளது. தொடங்குவதற்கு Vite-ன் [React plugin](https://vite.dev/plugins/#vitejs-plugin-react) அல்லது [React SWC plugin](https://vite.dev/plugins/#vitejs-plugin-react-swc) மற்றும் [React SSR example project](https://vite.dev/guide/ssr.html#example-projects)-ஐ பார்க்கவும்.

நாங்கள் [பரிந்துரைக்கும் frameworks](/learn/creating-a-react-app)-இல் ஒன்றான [React Router](https://reactrouter.com/start/framework/installation)-இல் Vite ஏற்கனவே build tool ஆக பயன்படுத்தப்படுகிறது.

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/) சிறந்த out-of-the-box development experience-ஐ, உங்கள் project-ஐ ஆரம்ப நிலையிலிருந்து பெரிய production applications வரை கொண்டு செல்லக்கூடிய scalable architecture உடன் இணைக்கிறது.

<TerminalBlock>
npm install --save-dev parcel
</TerminalBlock>

Parcel fast refresh, JSX, TypeScript, Flow, மற்றும் styling-க்கு out of the box support தருகிறது. தொடங்க [Parcel-ன் React recipe](https://parceljs.org/recipes/react/#getting-started)-ஐ பார்க்கவும்.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/) என்பது React applications-க்கு seamless development experience வழங்கும் Rspack-powered build tool. கவனமாக tune செய்யப்பட்ட defaults மற்றும் பயன்படுத்தத் தயாரான performance optimizations உடன் வருகிறது.

<TerminalBlock>
npx create-rsbuild --template react
</TerminalBlock>

Fast refresh, JSX, TypeScript, மற்றும் styling போன்ற React features-க்கு Rsbuild built-in support கொண்டுள்ளது. தொடங்க [Rsbuild-ன் React guide](https://rsbuild.dev/guide/framework/react)-ஐ பார்க்கவும்.

<Note>

#### React Native-க்கான Metro {/*react-native*/}

React Native உடன் புதிதாகத் தொடங்குகிறீர்கள் என்றால், React Native-க்கான JavaScript bundler ஆன [Metro](https://metrobundler.dev/)-வை பயன்படுத்த வேண்டும். iOS மற்றும் Android போன்ற platforms-க்கு bundling செய்ய Metro support தருகிறது; ஆனால் இங்கே உள்ள tools-களுடன் ஒப்பிடும்போது பல features குறைவாக உள்ளன. உங்கள் project-க்கு React Native support தேவைப்படாவிட்டால் Vite, Parcel, அல்லது Rsbuild-இலிருந்து தொடங்க பரிந்துரைக்கிறோம்.

</Note>

## படி 2: பொதுவான application patterns உருவாக்குதல் {/*step-2-build-common-application-patterns*/}

மேலே பட்டியலிட்ட build tools client-only, single-page app (SPA)-ஆக தொடங்குகின்றன; ஆனால் routing, data fetching, அல்லது styling போன்ற பொதுவான functionality-க்கு கூடுதல் solutions சேர்த்து தருவதில்லை.

இந்த பிரச்சினைகளுக்காக React ecosystem பல tools கொண்டுள்ளது. Starting point ஆக பரவலாக பயன்படுத்தப்படும் சிலவற்றை பட்டியலிட்டுள்ளோம்; ஆனால் உங்களுக்கு வேறு tools சிறப்பாக வேலை செய்தால் அவற்றை தேர்வு செய்யலாம்.

### Routing {/*routing*/}

ஒரு user குறிப்பிட்ட URL-ஐ visit செய்யும் போது எந்த content அல்லது pages display செய்யப்பட வேண்டும் என்பதை routing தீர்மானிக்கிறது. URLs-ஐ உங்கள் app-ன் வேறு பகுதிகளுடன் map செய்ய router அமைக்க வேண்டும். Nested routes, route parameters, மற்றும் query parameters-ஐயும் handle செய்ய வேண்டும். Routers-ஐ உங்கள் code-க்குள் configure செய்யலாம், அல்லது உங்கள் component folder மற்றும் file structures அடிப்படையில் define செய்யலாம்.

Routers modern applications-ன் core பகுதி; அவை பொதுவாக data fetching (வேகமான loading-க்காக முழு page-க்கான data prefetch செய்தல் உட்பட), code splitting (client bundle sizes-ஐ குறைக்க), மற்றும் page rendering approaches (ஒவ்வொரு page எப்படி generate ஆக வேண்டும் என்பதை முடிவு செய்ய) உடன் integrate செய்யப்படுகின்றன.

பயன்படுத்த பரிந்துரைப்பவை:

- [React Router](https://reactrouter.com/start/framework/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### Data Fetching {/*data-fetching*/}

Server அல்லது பிற data source-இலிருந்து data fetch செய்வது பெரும்பாலான applications-ன் முக்கிய பகுதி. இதை சரியாகச் செய்ய loading states, error states, மற்றும் fetched data caching ஆகியவற்றை handle செய்ய வேண்டும்; இது சிக்கலாக இருக்கலாம்.

இதற்கென உருவாக்கப்பட்ட data fetching libraries, data fetch செய்வதும் cache செய்வதும் போன்ற கடின வேலையை உங்களுக்காகச் செய்கின்றன; உங்கள் app-க்கு எந்த data தேவை, அதை எப்படி display செய்வது என்பதில் கவனம் செலுத்தலாம். இந்த libraries பொதுவாக உங்கள் components-இல் நேரடியாகப் பயன்படுத்தப்படுகின்றன; ஆனால் வேகமான pre-fetching மற்றும் சிறந்த performance-க்காக routing loaders-இலும், server rendering-இலும் integrate செய்யலாம்.

Components-இல் data-வை நேரடியாக fetch செய்வது network request waterfalls காரணமாக loading time-ஐ மெதுவாக்கலாம். ஆகவே முடிந்தவரை router loaders-இல் அல்லது server-இல் data prefetch செய்ய பரிந்துரைக்கிறோம்! இதனால் page display ஆகும் போதே அந்த page-ன் data அனைத்தும் ஒரே நேரத்தில் fetch செய்யப்படும்.

பெரும்பாலான backends அல்லது REST-style APIs-இலிருந்து data fetch செய்தால், இவற்றைப் பயன்படுத்த பரிந்துரைக்கிறோம்:

- [TanStack Query](https://tanstack.com/query/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

GraphQL API-இலிருந்து data fetch செய்தால், இவற்றைப் பயன்படுத்த பரிந்துரைக்கிறோம்:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### Code-splitting {/*code-splitting*/}

Code-splitting என்பது உங்கள் app-ஐ demand அடிப்படையில் load செய்யக்கூடிய சிறிய bundles ஆகப் பிரிக்கும் process. ஒவ்வொரு புதிய feature மற்றும் கூடுதல் dependency உடன் app-ன் code size அதிகரிக்கும். பயன்படுத்துவதற்கு முன் முழு app-க்கான code அனைத்தும் அனுப்பப்பட வேண்டியதால் apps load ஆக மெதுவாகலாம். Caching, features/dependencies குறைத்தல், மற்றும் சில code-ஐ server-இல் run செய்ய நகர்த்துதல் ஆகியவை slow loading-ஐ mitigate செய்ய உதவலாம்; ஆனால் overuse செய்தால் functionality-ஐ இழக்கச் செய்யக்கூடிய incomplete solutions.

அதேபோல், உங்கள் framework பயன்படுத்தும் apps code-ஐ split செய்யும் என்ற நம்பிக்கையில் இருந்தால், code splitting இல்லாததை விட loading மெதுவாகும் நிலைகள் வரலாம். உதாரணமாக, chart-ஐ [lazily loading](/reference/react/lazy) செய்வது, chart render செய்ய வேண்டிய code அனுப்புவதை தாமதப்படுத்தி, chart code-ஐ app-ன் மீதமுள்ள பகுதியிலிருந்து பிரிக்கிறது. [Parcel React.lazy உடன் code splitting support செய்கிறது](https://parceljs.org/recipes/react/#code-splitting). ஆனால் chart முதலில் render ஆன *பிறகு* அதன் data-வை load செய்தால், நீங்கள் இப்போது இரண்டு முறை காத்திருக்கிறீர்கள். இது waterfall: chart-க்கான data fetch செய்து அதை render செய்ய code-ஐ ஒரே நேரத்தில் அனுப்புவதற்கு பதிலாக, ஒவ்வொரு படியும் ஒன்றன் பின் ஒன்றாக முடியும் வரை காத்திருக்க வேண்டும்.

Bundling மற்றும் data fetching உடன் integrate செய்யப்பட்ட route அடிப்படையிலான code splitting, உங்கள் app-ன் initial load time-ஐயும் app-ன் largest visible content render ஆக எடுக்கும் நேரத்தையும் ([Largest Contentful Paint](https://web.dev/articles/lcp)) குறைக்கலாம்.

Code-splitting வழிமுறைகளுக்கு, உங்கள் build tool docs-ஐ பார்க்கவும்:
- [Vite build optimizations](https://vite.dev/guide/features.html#build-optimizations)
- [Parcel code splitting](https://parceljs.org/features/code-splitting/)
- [Rsbuild code splitting](https://rsbuild.dev/guide/optimization/code-splitting)

### Application performance மேம்படுத்துதல் {/*improving-application-performance*/}

நீங்கள் தேர்ந்தெடுக்கும் build tool single page apps (SPAs)-க்கு மட்டும் support தருவதால், server-side rendering (SSR), static site generation (SSG), மற்றும்/அல்லது React Server Components (RSC) போன்ற பிற [rendering patterns](https://www.patterns.dev/vanilla/rendering-patterns)-ஐ implement செய்ய வேண்டும். ஆரம்பத்தில் இந்த features தேவையில்லாவிட்டாலும், எதிர்காலத்தில் SSR, SSG, அல்லது RSC மூலம் பயன் பெறும் routes இருக்கலாம்.

* **Single-page apps (SPA)** ஒரு HTML page-ஐ load செய்து, user app உடன் interact செய்யும் போது page-ஐ dynamically update செய்கின்றன. SPAs-ஐ தொடங்குவது சாத்தியம்; ஆனால் initial load times மெதுவாக இருக்கலாம். பெரும்பாலான build tools-க்கு SPAs default architecture.

* **Streaming Server-side rendering (SSR)** server-இல் page-ஐ render செய்து, முழுமையாக rendered page-ஐ client-க்கு அனுப்புகிறது. SSR performance-ஐ மேம்படுத்தலாம்; ஆனால் single-page app-ஐ விட set up மற்றும் maintain செய்வது சிக்கலாக இருக்கலாம். Streaming சேர்க்கப்பட்டால், SSR set up மற்றும் maintain செய்வது மிகவும் சிக்கலாகலாம். [Vite-ன் SSR guide]( https://vite.dev/guide/ssr)-ஐ பார்க்கவும்.

* **Static site generation (SSG)** build time-இல் உங்கள் app-க்கான static HTML files generate செய்கிறது. SSG performance-ஐ மேம்படுத்தலாம்; ஆனால் server-side rendering-ஐ விட set up மற்றும் maintain செய்வது சிக்கலாக இருக்கலாம். [Vite-ன் SSG guide](https://vite.dev/guide/ssr.html#pre-rendering-ssg)-ஐ பார்க்கவும்.

* **React Server Components (RSC)** build-time, server-only, மற்றும் interactive components-ஐ single React tree-இல் mix செய்ய அனுமதிக்கிறது. RSC performance-ஐ மேம்படுத்தலாம்; ஆனால் தற்போது set up மற்றும் maintain செய்ய ஆழமான expertise தேவை. [Parcel-ன் RSC examples](https://github.com/parcel-bundler/rsc-examples)-ஐ பார்க்கவும்.

உங்கள் framework கொண்டு உருவாக்கப்படும் apps ஒவ்வொரு route level-இலும் rendering strategy-ஐ தேர்வு செய்ய, உங்கள் rendering strategies உங்கள் router உடன் integrate ஆக வேண்டும். இதனால் முழு app-ஐ rewrite செய்யாமல் வேறு rendering strategies பயன்படுத்த முடியும். உதாரணமாக, உங்கள் app-ன் landing page statically generated (SSG) ஆக இருப்பதால் பயன் பெறலாம்; content feed கொண்ட page server-side rendering-இல் சிறப்பாக செயல்படலாம்.

சரியான routes-க்கு சரியான rendering strategy பயன்படுத்துவது, content-ன் முதல் byte load ஆக எடுக்கும் நேரம் ([Time to First Byte](https://web.dev/articles/ttfb)), முதல் content render ஆகும் நேரம் ([First Contentful Paint](https://web.dev/articles/fcp)), மற்றும் app-ன் largest visible content render ஆகும் நேரம் ([Largest Contentful Paint](https://web.dev/articles/lcp)) ஆகியவற்றைக் குறைக்க முடியும்.

### மேலும்... {/*and-more*/}

புதிதாக build செய்யும் போது புதிய app பரிசீலிக்க வேண்டிய features-க்கான சில உதாரணங்கள் மட்டுமே இவை. நீங்கள் சந்திக்கும் பல limitations தீர்க்க கடினமாக இருக்கலாம்; ஏனெனில் ஒவ்வொரு பிரச்சினையும் மற்றவற்றுடன் ஒன்றோடொன்று தொடர்புடையதாக இருக்கும், மேலும் உங்களுக்கு பரிச்சயம் இல்லாத problem areas-இல் ஆழமான expertise தேவைப்படலாம்.

இந்த பிரச்சினைகளை நீங்களே தீர்க்க விரும்பவில்லை என்றால், இந்த features-ஐ out of the box வழங்கும் [framework-இலிருந்து தொடங்கலாம்](/learn/creating-a-react-app).
