---
title: "React Conf 2025 சுருக்கம்"
author: Matt Carroll and Ricky Hanlon
date: 2025/10/16
description: கடந்த வாரம் React Conf 2025 நடத்தினோம்; இந்த post-இல், அந்த நிகழ்வின் talks மற்றும் announcements-ஐ சுருக்கமாகப் பார்க்கிறோம்...
---

October 16, 2025 by [Matt Carroll](https://x.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

கடந்த வாரம் React Conf 2025 நடத்தினோம்; அங்கு [React Foundation](/blog/2025/10/07/introducing-the-react-foundation)-ஐ அறிவித்து, React மற்றும் React Native-க்கு வரவிருக்கும் புதிய features-ஐ showcase செய்தோம்.

</Intro>

---

React Conf 2025 அக்டோபர் 7-8, 2025 அன்று Henderson, Nevada-வில் நடைபெற்றது.

முழு [day 1](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s) மற்றும் [day 2](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) streams online-இல் கிடைக்கின்றன; நிகழ்வின் photos-ஐ [இங்கே](https://conf.react.dev/photos) பார்க்கலாம்.

இந்த post-இல், அந்த நிகழ்வின் talks மற்றும் announcements-ஐ சுருக்கமாகப் பார்க்கிறோம்.


## Day 1 keynote {/*day-1-keynote*/}

_முழு day 1 stream-ஐ [இங்கே பார்க்கவும்.](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

Day 1 keynote-இல், கடந்த React Conf-க்கு பிறகு team மற்றும் community updates-ஐயும் React 19.0 மற்றும் 19.1-ன் highlights-ஐயும் Joe Savona பகிர்ந்தார்.

Mofei Zhang, React 19.2-இல் உள்ள புதிய features-ஐ highlight செய்தார்:
* [`<Activity />`](https://react.dev/reference/react/Activity) - visibility-ஐ manage செய்யும் புதிய component.
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) - Effects-இலிருந்து events fire செய்ய.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) - DevTools-இல் புதிய profiling tool.
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) - app-ன் ஒரு பகுதியை முன்கூட்டியே pre-render செய்து, பின்னர் அதன் rendering-ஐ resume செய்ய.

Jack Pope, Canary-இல் உள்ள புதிய features-ஐ அறிவித்தார்:

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) - page transitions-ஐ animate செய்யும் புதிய component.
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) - Fragment wrap செய்த DOM nodes உடன் interact செய்ய புதிய வழி.

Lauren Tan [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)-ஐ அறிவித்து, இதுபோன்ற நன்மைகளுக்காக எல்லா apps-மும் React Compiler பயன்படுத்த பரிந்துரைத்தார்:
* React code-ஐப் புரிந்துகொள்ளும் [automatic memoization](/learn/react-compiler/introduction#what-does-react-compiler-do).
* Best practices கற்பிக்க React Compiler மூலம் இயங்கும் [புதிய lint rules](/learn/react-compiler/installation#eslint-integration).
* Vite, Next.js, மற்றும் Expo-இல் புதிய apps-க்கு [default support](/learn/react-compiler/installation#basic-setup).
* React Compiler-க்கு migrate செய்யும் existing apps-க்கான [migration guides](/learn/react-compiler/incremental-adoption).

இறுதியாக, React-ன் open source development மற்றும் community-யை வழிநடத்த [React Foundation](/blog/2025/10/07/introducing-the-react-foundation)-ஐ Seth Webster அறிவித்தார்.

Day 1-ஐ இங்கே பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## Day 2 keynote {/*day-2-keynote*/}

_முழு day 2 stream-ஐ [இங்கே பார்க்கவும்.](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

Jorge Cohen மற்றும் Nicola Corti, React Native-ன் அசாதாரண வளர்ச்சியை day 2 தொடக்கத்தில் highlight செய்தனர்: 4M weekly downloads (100% YoY growth), Shopify, Zalando, மற்றும் HelloFresh-இலிருந்து சில குறிப்பிடத்தக்க app migrations, RISE, RUNNA, Partyful போன்ற award-winning apps, மேலும் Mistral, Replit, v0 ஆகியவற்றின் AI apps.

Riccardo Cipolleschi React Native-க்கான இரண்டு முக்கிய announcements-ஐ பகிர்ந்தார்:
- [React Native 0.82 New Architecture மட்டும் இருக்கும்](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [Experimental Hermes V1 support](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

Ruben Norte மற்றும் Alex Hunt, இதை அறிவித்து keynote-ஐ முடித்தனர்:
- Web-இல் React உடன் மேம்பட்ட compatibility-க்கான [புதிய web-aligned DOM APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis).
- புதிய network panel மற்றும் desktop app உடன் [புதிய Performance APIs](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary).

Day 2-ஐ இங்கே பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React team talks {/*react-team-talks*/}

Conference முழுவதும் React team-இலிருந்து பல talks இருந்தன:
* [Async React Part I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) மற்றும் [Part II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) ஆகியவற்றில் [(Ricky Hanlon)](https://x.com/rickhanlonii), கடந்த 10 ஆண்டுகளின் innovation-ஐ பயன்படுத்தி என்ன சாத்தியம் என்பதை காட்டினார்.
* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s)-இல் [(Joe Savona)](https://x.com/en_js), எங்கள் React performance research-ன் முடிவுகளை காட்டினார்.
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s)-இல் [(Luna Wei)](https://x.com/lunaleaps), visibility-ஐ mode-based rendering (hidden/pre-render/visible) மூலம் manage செய்யும் lists-க்கான புதிய primitive ஆன Virtual View-ஐ அறிமுகப்படுத்தினார்.
* [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s)-இல் [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin), performance issues debug செய்து சிறந்த apps உருவாக்க புதிய React Performance Tracks-ஐ எப்படி பயன்படுத்துவது என்று காட்டினார்.
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s)-இல் [(Nicolas Gallagher)](https://nicolasgallagher.com/), native-இல் web code பயன்படுத்தும் Meta-வின் அணுகுமுறை பற்றி பேசினார்.
* [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s)-இல் [(Chance Strickland)](https://x.com/chancethedev), வேகமான native-feeling animations உருவாக்க `<Activity />` மற்றும் `<ViewTransition />`-ஐ எப்படி பயன்படுத்துவது என்பதை showcase செய்ய React team உடன் பணியாற்றினார்.
* [In case you missed the memo](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s)-இல் [(Cody Olsen)](https://bsky.app/profile/codey.bsky.social), Sanity Studio-வில் Compiler-ஐ adopt செய்ய React team உடன் பணியாற்றி, அது எப்படி நடந்தது என்பதை பகிர்ந்தார்.
## React framework talks {/*react-framework-talks*/}

Day 2-ன் இரண்டாம் பாதியில் React Framework teams-இலிருந்து பல talks இருந்தன:

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) - [Giovanni Laquidara](https://x.com/giolaq) மற்றும் [Eric Fahsl](https://x.com/efahsl) வழங்கியது.
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) - [Mike Grabowski](https://x.com/grabbou) வழங்கியது.
* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) - [Devon Govett](https://x.com/devonovett) வழங்கியது.
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) - [Delba de Oliveira](https://x.com/delba_oliveira) வழங்கியது.
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) - [Evan Bacon](https://x.com/baconbrix) வழங்கியது.
* [The React Router's take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) - [Kent C. Dodds](https://x.com/kentcdodds) வழங்கியது.
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) - [Peter Pistorius](https://x.com/appfactory) மற்றும் [Aurora Scharff](https://x.com/aurorascharff) வழங்கியது.
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) - [Tanner Linsley](https://x.com/tannerlinsley) வழங்கியது.

## Q&A {/*q-and-a*/}
Conference-இல் மூன்று Q&A panels இருந்தன:

* [React Team at Meta Q&A](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s) - [Shruti Kapoor](https://x.com/shrutikapoor08) host செய்தார்
* [React Frameworks Q&A](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s) - [Jack Herrington](https://x.com/jherr) host செய்தார்
* [React and AI Panel](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s) - [Lee Robinson](https://x.com/leerob) host செய்தார்

## மேலும்... {/*and-more*/}

Community-யிலிருந்தும் talks கேட்டோம்:
* [Building an MCP Server](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) - [James Swinton](https://x.com/JamesSwintonDev) வழங்கியது ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025))
* [Modern Emails using React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) - [Zeno Rocha](https://x.com/zenorocha) வழங்கியது ([Resend](https://resend.com/))
* [Why React Native Apps Make All the Money](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) - [Perttu Lähteenlahti](https://x.com/plahteenlahti) வழங்கியது ([RevenueCat](https://www.revenuecat.com/))
* [The invisible craft of great UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) - [Michał Dudak](https://x.com/michaldudak) வழங்கியது ([MUI](https://mui.com/))

## நன்றி {/*thanks*/}

React Conf 2025-ஐ சாத்தியமாக்கிய அனைத்து staff, speakers, மற்றும் participants-க்கு நன்றி. பட்டியலிட மிக அதிகமானோர் உள்ளனர்; ஆனால் சிலருக்கு குறிப்பாக நன்றி சொல்ல விரும்புகிறோம்.

முழு event-ஐ திட்டமிட்டு conference website உருவாக்கிய [Matt Carroll](https://x.com/mattcarrollcode)-க்கு நன்றி.

React Conf-ஐ அற்புதமான அர்ப்பணிப்பு மற்றும் energy உடன் MC செய்து, thoughtful speaker intros, fun jokes, மற்றும் நிகழ்வு முழுவதும் உண்மையான உற்சாகத்தை கொண்டு வந்த [Michael Chan](https://x.com/chantastic)-க்கு நன்றி. Livestream-ஐ host செய்து, ஒவ்வொரு speaker-யையும் interview செய்து, in-person React Conf அனுபவத்தை online-க்கு கொண்டு வந்த [Jorge Cohen](https://x.com/JorgeWritesCode)-க்கு நன்றி.

React Conf-ஐ co-organize செய்து design, engineering, மற்றும் marketing support வழங்கிய [Mateusz Kornacki](https://x.com/mat_kornacki), [Mike Grabowski](https://x.com/grabbou), [Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) மற்றும் [Callstack](https://www.callstack.com/) team-க்கு நன்றி. Event-ஐ organize செய்ய உதவிய [ZeroSlope team](https://zeroslopeevents.com/contact-us/): Sunny Leggett, Tracey Harrison, Tara Larish, Whitney Pogue, மற்றும் Brianne Smythia-க்கு நன்றி.

Discord-இலிருந்து livestream-க்கு கேள்விகளை கொண்டு வந்த [Jorge Cabiedes Acosta](https://github.com/jorge-cab), [Gijs Weterings](https://x.com/gweterings), [Tim Yung](https://x.com/yungsters), மற்றும் [Jason Bonta](https://x.com/someextent)-க்கு நன்றி. Discord moderation-ஐ வழிநடத்திய [Lynn Yu](https://github.com/lynnshaoyu)-க்கு நன்றி. ஒவ்வொரு நாளும் எங்களை வரவேற்ற [Seth Webster](https://x.com/sethwebster)-க்கு நன்றி; after-party-இல் special message உடன் இணைந்த [Christopher Chedeau](https://x.com/vjeux), [Kevin Gozali](https://x.com/fkgozali), மற்றும் [Pieter De Baets](https://x.com/Javache)-க்கு நன்றி.

Conference mobile app-ஐ உருவாக்கிய [Kadi Kraman](https://x.com/kadikraman), [Beto](https://x.com/betomoedano), மற்றும் [Nicolas Solerieu](https://www.linkedin.com/in/nicolas-solerieu/)-க்கு நன்றி. Conference website-க்கு உதவிய [Wojtek Szafraniec](https://x.com/wojteg1337)-க்கு நன்றி. Visuals, stage, மற்றும் sound-க்காக [Mustache](https://www.mustachepower.com/) & [Cornerstone](https://cornerstoneav.com/)-க்கு நன்றி; எங்களை host செய்த Westin Hotel-க்கும் நன்றி.

இந்த நிகழ்வை சாத்தியமாக்கிய அனைத்து sponsors-க்கும் நன்றி: [Amazon](https://www.developer.amazon.com), [MUI](https://mui.com/), [Vercel](https://vercel.com/), [Expo](https://expo.dev/), [RedwoodSDK](https://rwsdk.com), [Ag Grid](https://www.ag-grid.com), [RevenueCat](https://www.revenuecat.com/), [Resend](https://resend.com), [Mux](https://www.mux.com/), [Old Mission](https://www.oldmissioncapital.com/), [Arcjet](https://arcjet.com), [Infinite Red](https://infinite.red/), மற்றும் [RenderATL](https://renderatl.com).

தங்கள் அறிவையும் அனுபவத்தையும் community-யுடன் பகிர்ந்த அனைத்து speakers-க்கும் நன்றி.

இறுதியாக, React-ஐ React ஆக்கும் விஷயம் என்ன என்பதை காட்ட in person மற்றும் online-இல் கலந்து கொண்ட அனைவருக்கும் நன்றி. React ஒரு library-யை விட அதிகம்; அது ஒரு community. எல்லோரும் ஒன்றாக வந்து பகிர்ந்து கற்றுக்கொண்டதை பார்க்க மிகவும் ஊக்கமளித்தது.

அடுத்த முறை சந்திப்போம்!
