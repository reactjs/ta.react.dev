---
title: "React Labs: நாங்கள் செய்து கொண்டிருப்பவை – March 2023"
author: Joseph Savona, Josh Story, Lauren Tan, Mengdi Chen, Samuel Susla, Sathya Gunasekaran, Sebastian Markbage, and Andrew Clark
date: 2023/03/22
description: React Labs posts-இல், active research மற்றும் development-இல் உள்ள projects பற்றி எழுதுகிறோம். எங்கள் கடைசி update-க்கு பிறகு அவற்றில் குறிப்பிடத்தக்க முன்னேற்றம் செய்துள்ளோம்; கற்றவற்றை பகிர விரும்புகிறோம்.
---

March 22, 2023 by [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

React Labs posts-இல், active research மற்றும் development-இல் உள்ள projects பற்றி எழுதுகிறோம். எங்கள் [கடைசி update](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022)-க்கு பிறகு அவற்றில் குறிப்பிடத்தக்க முன்னேற்றம் செய்துள்ளோம்; கற்றவற்றை பகிர விரும்புகிறோம்.

</Intro>

---

## React Server Components {/*react-server-components*/}

React Server Components (அல்லது RSC) என்பது React team வடிவமைத்த புதிய application architecture.

RSC பற்றிய எங்கள் research-ஐ முதலில் ஒரு [introductory talk](/blog/2020/12/21/data-fetching-with-react-server-components) மற்றும் [RFC](https://github.com/reactjs/rfcs/pull/188)-இல் பகிர்ந்தோம். சுருக்கமாகச் சொன்னால், முன்கூட்டியே run ஆகி உங்கள் JavaScript bundle-இலிருந்து விலக்கப்படும் புதிய வகை component-களை, Server Components-ஐ, அறிமுகப்படுத்துகிறோம். Server Components build நேரத்தில் run ஆக முடியும்; இதனால் filesystem-இலிருந்து read செய்யலாம் அல்லது static content fetch செய்யலாம். அவை server-இலும் run ஆக முடியும்; API உருவாக்காமல் உங்கள் data layer-ஐ access செய்யலாம். Server Components-இலிருந்து browser-இல் உள்ள interactive Client Components-க்கு props மூலம் data pass செய்யலாம்.

RSC, server-centric Multi-Page Apps-ன் நேரடியான "request/response" mental model-ஐ, client-centric Single-Page Apps-ன் seamless interactivity உடன் இணைத்து, இரண்டின் சிறந்த அம்சங்களையும் தருகிறது.

எங்கள் கடைசி update-க்கு பிறகு, proposal-ஐ ratify செய்ய [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)-ஐ merge செய்துள்ளோம். [React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) proposal-இல் இருந்த நிலுவை issues-ஐ தீர்த்தோம்; எங்கள் partners உடன் `"use client"` convention-ஐ பயன்படுத்த consensus அடைந்தோம். RSC-compatible implementation எதை support செய்ய வேண்டும் என்பதற்கான specification ஆகவும் இந்த documents செயல்படுகின்றன.

மிகப்பெரிய மாற்றம்: Server Components-இலிருந்து data fetching செய்யும் primary வழியாக [`async` / `await`](https://github.com/reactjs/rfcs/pull/229)-ஐ அறிமுகப்படுத்தினோம். Promises-ஐ unwrap செய்யும் `use` என்ற புதிய Hook-ஐ அறிமுகப்படுத்தி client-இலிருந்து data loading-க்கும் support தர திட்டமிட்டுள்ளோம். Client-only apps-இல் arbitrary components-க்குள் `async / await`-ஐ support செய்ய முடியாவிட்டாலும், உங்கள் client-only app-ஐ RSC apps அமைப்பைப் போல structure செய்தால் அதற்கான support சேர்க்க திட்டமிட்டுள்ளோம்.

Data fetching பெரும்பாலும் தெளிவாக அமைந்துவிட்டதால், இப்போது மற்ற திசையை ஆராய்கிறோம்: client-இலிருந்து server-க்கு data அனுப்புவது; இதனால் database mutations execute செய்து forms implement செய்யலாம். Server/client boundary-ஐ கடந்தும் Server Action functions-ஐ pass செய்ய அனுமதிப்பதன் மூலம் இதை செய்கிறோம்; பின்னர் client அவற்றை call செய்யலாம், seamless RPC கிடைக்கும். JavaScript load ஆகும்முன்பே progressively enhanced forms-ஐ Server Actions தருகின்றன.

React Server Components [Next.js App Router](/learn/creating-a-react-app#nextjs-app-router)-இல் ship ஆகியுள்ளது. RSC-ஐ primitive ஆக உண்மையாக ஏற்றுக் கொள்ளும் router-ன் ஆழமான integration-ஐ இது காட்டுகிறது; ஆனால் RSC-compatible router மற்றும் framework உருவாக்க இதுவே ஒரே வழி அல்ல. RSC spec வழங்கும் features மற்றும் implementation இடையே தெளிவான பிரிப்பு உள்ளது. Compatible React frameworks முழுவதும் வேலை செய்யும் components-க்கான spec ஆக React Server Components நோக்கப்பட்டுள்ளது.

பொதுவாக existing framework பயன்படுத்த பரிந்துரைக்கிறோம்; ஆனால் உங்கள் சொந்த custom framework உருவாக்க வேண்டுமென்றால் அது சாத்தியம். தேவையான deep bundler integration காரணமாக, உங்கள் சொந்த RSC-compatible framework உருவாக்குவது நாங்கள் விரும்பும் அளவிற்கு எளிதல்ல. தற்போதைய தலைமுறை bundlers client-இல் பயன்பாட்டிற்கு சிறந்தவை; ஆனால் ஒரு single module graph-ஐ server மற்றும் client இடையே split செய்ய first-class support உடன் அவை வடிவமைக்கப்படவில்லை. அதனால்தான் RSC-க்கான primitives built-in ஆக கிடைக்க bundler developers உடன் இப்போது நேரடியாக கூட்டாண்மை செய்கிறோம்.

## Asset Loading {/*asset-loading*/}

[Suspense](/reference/react/Suspense), உங்கள் components-க்கான data அல்லது code இன்னும் load ஆகும் போது screen-இல் என்ன display செய்ய வேண்டும் என்பதை குறிப்பிட அனுமதிக்கிறது. Page load ஆகும் போதும், மேலும் data மற்றும் code load செய்யும் router navigations நடந்துகொண்டிருக்கும் போதும், users படிப்படியாக அதிக content பார்க்க இது உதவுகிறது. ஆனால் user-ன் பார்வையில், புதிய content தயாரா என்பதை தீர்மானிக்க data loading மற்றும் rendering மட்டும் முழு கதை அல்ல. Default-ஆக browsers stylesheets, fonts, மற்றும் images-ஐ தனித்தனியாக load செய்கின்றன; இது UI jumps மற்றும் தொடர்ச்சியான layout shifts-க்கு வழிவகுக்கலாம்.

Stylesheets, fonts, மற்றும் images-ன் loading lifecycle உடன் Suspense-ஐ முழுமையாக integrate செய்ய பணியாற்றுகிறோம்; content display செய்ய தயாரா என்பதை React தீர்மானிக்கும் போது அவற்றையும் கணக்கில் கொள்ள இதனால் முடியும். நீங்கள் React components எழுதும் முறையில் எந்த மாற்றமும் இல்லாமல், updates இன்னும் coherent மற்றும் pleasing முறையில் நடக்கும். Optimization ஆக, fonts போன்ற assets-ஐ components-இலிருந்து நேரடியாக preload செய்ய manual வழியையும் வழங்குவோம்.

தற்போது இந்த features-ஐ implement செய்து வருகிறோம்; விரைவில் பகிர மேலும் தகவல்கள் இருக்கும்.

## Document Metadata {/*document-metadata*/}

உங்கள் app-இல் வெவ்வேறு pages மற்றும் screens-க்கு `<title>` tag, description, மற்றும் அந்த screen-க்கு உரிய பிற `<meta>` tags போன்ற வெவ்வேறு metadata இருக்கலாம். Maintenance perspective-இல், இந்த information-ஐ அந்த page அல்லது screen-க்கான React component-க்கு அருகில் வைத்திருப்பது scalable. ஆனால் இந்த metadata-க்கான HTML tags, பொதுவாக உங்கள் app-ன் root-இல் உள்ள component-ல் render செய்யப்படும் document `<head>`-இல் இருக்க வேண்டும்.

இன்று இந்த பிரச்சினையை மக்கள் இரண்டு techniques-இல் ஒன்றைப் பயன்படுத்தி தீர்க்கிறார்கள்.

ஒரு technique: அதன் உள்ளே உள்ள `<title>`, `<meta>`, மற்றும் பிற tags-ஐ document `<head>`-க்குள் நகர்த்தும் சிறப்பு third-party component-ஐ render செய்வது. இது முக்கிய browsers-க்கு வேலை செய்கிறது; ஆனால் Open Graph parsers போன்ற client-side JavaScript run செய்யாத பல clients உள்ளன, எனவே இந்த technique எல்லா இடத்திற்கும் பொருந்தாது.

மற்றொரு technique: page-ஐ இரண்டு பகுதிகளாக server-render செய்வது. முதலில் main content render செய்யப்படுகிறது; அத்தகைய tags அனைத்தும் collect செய்யப்படுகின்றன. பிறகு இந்த tags உடன் `<head>` render செய்யப்படுகிறது. இறுதியில் `<head>` மற்றும் main content browser-க்கு அனுப்பப்படுகின்றன. இந்த அணுகுமுறை வேலை செய்கிறது; ஆனால் `<head>` அனுப்புவதற்கு முன் அனைத்து content render ஆக காத்திருக்க வேண்டியதால், [React 18-ன் Streaming Server Renderer](/reference/react-dom/server/renderToReadableStream)-ன் பயனை பெற முடியாது.

அதனால்தான் உங்கள் component tree-இல் எங்கிருந்தும் `<title>`, `<meta>`, மற்றும் metadata `<link>` tags render செய்ய built-in support சேர்க்கிறோம். Fully client-side code, SSR, மற்றும் எதிர்காலத்தில் RSC உட்பட எல்லா environments-லும் இது ஒரே விதமாக வேலை செய்யும். இதைப் பற்றிய கூடுதல் விவரங்களை விரைவில் பகிர்வோம்.

## React மேம்படுத்தும் compiler {/*react-optimizing-compiler*/}

எங்கள் முந்தைய update-க்கு பிறகு, React-க்கான optimizing compiler ஆன [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler)-ன் design-இல் active-ஆக iterate செய்து வருகிறோம். முன்பு இதைப் பற்றி "auto-memoizing compiler" என்று பேசியுள்ளோம்; சில அளவில் அது உண்மை. ஆனால் compiler உருவாக்கியதே React-ன் programming model-ஐ இன்னும் ஆழமாகப் புரிந்துகொள்ள உதவியது. React Forget-ஐ automatic *reactivity* compiler ஆகப் புரிந்துகொள்வதே சிறந்த வழி.

React-ன் core idea: developers தங்கள் UI-ஐ current state-ன் function ஆக define செய்கிறார்கள். நீங்கள் plain JavaScript values, numbers, strings, arrays, objects, ஆகியவற்றுடன் வேலை செய்து, component logic-ஐ விவரிக்க standard JavaScript idioms, if/else, for போன்றவற்றை பயன்படுத்துகிறீர்கள். Application state மாறும் போதெல்லாம் React re-render செய்யும் என்பதே mental model. இந்த நேரடியான mental model மற்றும் JavaScript semantics-க்கு நெருக்கமாக இருப்பது React-ன் programming model-இல் முக்கிய principle என்று நாங்கள் நம்புகிறோம்.

சிக்கல் என்னவென்றால் React சில நேரங்களில் *அதிகமாக* reactive ஆக இருக்கலாம்: அது தேவைக்கு அதிகமாக re-render செய்யலாம். உதாரணமாக, JavaScript-இல் இரண்டு objects அல்லது arrays equivalent-ஆக உள்ளனவா (அதே keys மற்றும் values கொண்டுள்ளனவா) என்பதை cheap-ஆக compare செய்ய வழிகள் இல்லை. எனவே ஒவ்வொரு render-லும புதிய object அல்லது array உருவாக்குவது, React-க்கு தேவைக்குக் கூடுதல் வேலை செய்யச் செய்யலாம். இதனால் changes-க்கு over-react ஆகாமல் இருக்க developers components-ஐ explicitly memoize செய்ய வேண்டியுள்ளது.

React Forget மூலம் எங்கள் இலக்கு: React apps default-ஆக சரியான அளவு reactivity கொண்டிருப்பதை உறுதி செய்வது; state values *அர்த்தமுள்ள வகையில்* மாறும்போது மட்டுமே apps re-render ஆக வேண்டும். Implementation perspective-இல் இது automatically memoizing என்று பொருள்படும்; ஆனால் React மற்றும் Forget-ஐப் புரிந்துகொள்ள reactivity framing சிறந்தது என்று நாங்கள் நம்புகிறோம். இதை சிந்திக்க ஒரு வழி: தற்போது object identity மாறும் போது React re-render செய்கிறது. Forget உடன், semantic value மாறும் போது React re-render செய்யும்; ஆனால் deep comparisons-ன் runtime cost இல்லாமல்.

கண்கூடாகிய முன்னேற்றம் என்று சொன்னால், எங்கள் கடைசி update-க்கு பிறகு இந்த automatic reactivity அணுகுமுறையுடன் align ஆகவும், compiler-ஐ internally பயன்படுத்திய feedback-ஐ சேர்க்கவும் compiler design-இல் பெரிதாக iterate செய்துள்ளோம். கடந்த ஆண்டின் இறுதியில் தொடங்கிய compiler-ன் முக்கிய refactors பிறகு, இப்போது Meta-வில் வரையறுக்கப்பட்ட பகுதிகளில் production-இல் compiler-ஐ பயன்படுத்தத் தொடங்கியுள்ளோம். Production-இல் அதை நிரூபித்த பிறகு open-source செய்ய திட்டமிட்டுள்ளோம்.

இறுதியாக, compiler எப்படி செயல்படுகிறது என்பதில் பலர் ஆர்வம் தெரிவித்துள்ளனர். Compiler-ஐ நிரூபித்து open-source செய்த பிறகு, இன்னும் பல விவரங்களை பகிர ஆவலாக உள்ளோம். ஆனால் இப்போது பகிரக்கூடிய சில விஷயங்கள் உள்ளன:

Compiler-ன் core, Babel-இலிருந்து கிட்டத்தட்ட முழுமையாக decoupled. Core compiler API சுமார் old AST in, new AST out (source location data-வை retain செய்தபடி) என்ற மாதிரி. Under the hood, low-level semantic analysis செய்ய custom code representation மற்றும் transformation pipeline பயன்படுத்துகிறோம். இருப்பினும் compiler-க்கு primary public interface Babel மற்றும் பிற build system plugins வழியாக இருக்கும். Testing நேரடியாக இருக்க, ஒவ்வொரு function-ன் புதிய version உருவாக்க compiler-ஐ call செய்து அதை swap செய்யும் மிக மெல்லிய wrapper ஆன Babel plugin தற்போது எங்களிடம் உள்ளது.

கடந்த சில மாதங்களில் compiler-ஐ refactor செய்தபோது, conditionals, loops, reassignment, மற்றும் mutation போன்ற complexities-ஐ கையாள முடியும் என்பதை உறுதி செய்ய core compilation model-ஐ refine செய்வதில் கவனம் செலுத்த விரும்பினோம். ஆனால் JavaScript-இல் அந்த features ஒவ்வொன்றையும் வெளிப்படுத்த பல வழிகள் உள்ளன: if/else, ternaries, for, for-in, for-of, போன்றவை. முழு language-ஐ upfront support செய்ய முயல்வது, core model-ஐ validate செய்யும் நேரத்தை தாமதப்படுத்தியிருக்கும். அதற்கு பதிலாக language-ன் சிறிய ஆனால் representative subset-இல் தொடங்கினோம்: let/const, if/else, for loops, objects, arrays, primitives, function calls, மற்றும் சில பிற features. Core model மீது நம்பிக்கை கிடைத்து internal abstractions-ஐ refine செய்தபோது, supported language subset-ஐ விரிவாக்கினோம். இன்னும் support செய்யாத syntax பற்றியும் explicit-ஆக இருக்கிறோம்; unsupported input-க்கு diagnostics log செய்து compilation-ஐ skip செய்கிறோம். Meta-ன் codebases-இல் compiler-ஐ முயற்சித்து எந்த unsupported features பொதுவாக உள்ளன என்று பார்த்து, அடுத்ததாக அவற்றை prioritize செய்ய utilities உள்ளன. முழு language-ஐ support செய்வதற்காக தொடர்ந்து incrementally விரிவாக்குவோம்.

React components-இல் plain JavaScript-ஐ reactive ஆக்க, code துல்லியமாக என்ன செய்கிறது என்பதை புரிந்துகொள்ள semantics பற்றிய ஆழமான புரிதல் கொண்ட compiler தேவை. இந்த அணுகுமுறையை எடுத்துக்கொள்வதன் மூலம், domain specific language-க்கு கட்டுப்படாமல், language-ன் முழு expressivity உடன் எந்த complexity கொண்ட product code-யையும் எழுத அனுமதிக்கும் JavaScript-க்குள் reactivity system ஒன்றை உருவாக்குகிறோம்.

## Offscreen Rendering {/*offscreen-rendering*/}

Offscreen rendering என்பது கூடுதல் performance overhead இல்லாமல் screens-ஐ background-இல் render செய்ய React-இல் வரவிருக்கும் capability. [`content-visibility` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)-ன் DOM elements மட்டுமல்ல, React components-க்கும் வேலை செய்யும் version போல இதை நினைக்கலாம். எங்கள் research-இல் பல use cases கண்டுபிடித்தோம்:

- User அவற்றுக்கு navigate செய்யும் போது உடனே கிடைக்க, router background-இல் screens-ஐ prerender செய்யலாம்.
- Tab switching component hidden tabs-ன் state-ஐ preserve செய்யலாம்; இதனால் user முன்னேற்றத்தை இழக்காமல் அவற்றிடையே switch செய்ய முடியும்.
- Virtualized list component visible window-க்கு மேல் மற்றும் கீழ் கூடுதல் rows-ஐ prerender செய்யலாம்.
- Modal அல்லது popup திறக்கும் போது, modal தவிர மற்ற அனைத்திற்கும் events மற்றும் updates disable ஆகும் வகையில் app-ன் மீதமுள்ள பகுதியை "background" mode-இல் வைக்கலாம்.

பெரும்பாலான React developers React-ன் offscreen APIs உடன் நேரடியாக interact செய்யமாட்டார்கள். அதற்கு பதிலாக offscreen rendering, routers மற்றும் UI libraries போன்றவற்றில் integrate செய்யப்படும்; பின்னர் அந்த libraries பயன்படுத்தும் developers கூடுதல் வேலை இல்லாமல் தானாகவே பயன் பெறுவார்கள்.

உங்கள் components எழுதும் முறையை மாற்றாமல் எந்த React tree-யையும் offscreen render செய்ய முடியும் என்பதே யோசனை. ஒரு component offscreen render செய்யப்படும் போது, அது visible ஆகும் வரை உண்மையில் *mount* ஆகாது; அதன் effects fire ஆகாது. உதாரணமாக, ஒரு component முதல் முறையாக தோன்றும் போது analytics log செய்ய `useEffect` பயன்படுத்தினால், prerendering அந்த analytics-ன் துல்லியத்தை கெடுப்பதில்லை. அதேபோல், ஒரு component offscreen செல்லும் போது அதன் effects-மும் unmount ஆகும். Offscreen rendering-ன் முக்கிய feature: component-ன் state-ஐ இழக்காமல் அதன் visibility-ஐ toggle செய்ய முடியும்.

எங்கள் கடைசி update-க்கு பிறகு, Android மற்றும் iOS-இல் உள்ள எங்கள் React Native apps-இல் Meta-வில் internally prerendering-ன் experimental version-ஐ test செய்தோம்; performance முடிவுகள் நல்லவை. Suspense உடன் offscreen rendering எப்படி வேலை செய்கிறது என்பதையும் மேம்படுத்தியுள்ளோம்; offscreen tree-க்குள் suspend செய்வது Suspense fallbacks-ஐ trigger செய்யாது. Library developers-க்கு expose செய்யப்படும் primitives-ஐ இறுதி செய்வதே எங்கள் மீதமுள்ள வேலை. இந்த ஆண்டின் பின்னர் testing மற்றும் feedback-க்கான experimental API உடன் RFC ஒன்றை publish செய்ய எதிர்பார்க்கிறோம்.

## Transition Tracing {/*transition-tracing*/}

Transition Tracing API, [React Transitions](/reference/react/useTransition) slow ஆகும் போது கண்டறிந்து அவை ஏன் slow ஆக இருக்கலாம் என்பதை ஆராய அனுமதிக்கிறது. எங்கள் கடைசி update-க்கு பிறகு, API-ன் initial design-ஐ முடித்து [RFC](https://github.com/reactjs/rfcs/pull/238)-ஐ publish செய்துள்ளோம். அடிப்படை capabilities-ம் implement செய்யப்பட்டுள்ளன. Project தற்போது hold-இல் உள்ளது. RFC மீது feedback வரவேற்கிறோம்; React-க்கு சிறந்த performance measurement tool வழங்க அதன் development-ஐ மீண்டும் தொடங்க ஆவலாக உள்ளோம். [Next.js App Router](/learn/creating-a-react-app#nextjs-app-router) போல React Transitions மேல் கட்டப்பட்ட routers உடன் இது குறிப்பாக பயனுள்ளதாக இருக்கும்.

* * *
இந்த update-க்கு கூடுதலாக, எங்கள் team சமீபத்தில் community podcasts மற்றும் livestreams-இல் guest ஆக பங்கேற்று எங்கள் பணியைப் பற்றி மேலும் பேசவும் கேள்விகளுக்கு பதிலளிக்கவும் சென்றுள்ளது.

* [Dan Abramov](https://bsky.app/profile/danabra.mov) மற்றும் [Joe Savona](https://twitter.com/en_JS)-வை [Kent C. Dodds தனது YouTube channel-இல்](https://www.youtube.com/watch?v=h7tur48JSaw) interview செய்தார்; அங்கு அவர்கள் React Server Components பற்றிய concerns-ஐ விவாதித்தனர்.
* [Dan Abramov](https://bsky.app/profile/danabra.mov) மற்றும் [Joe Savona](https://twitter.com/en_JS) [JSParty podcast](https://jsparty.fm/267)-இல் guests ஆக கலந்து கொண்டு React-ன் எதிர்காலம் பற்றிய தங்கள் எண்ணங்களைப் பகிர்ந்தனர்.

இந்த post-ஐ review செய்த [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), மற்றும் [Sophie Alpert](https://twitter.com/sophiebits)-க்கு நன்றி.

படித்ததற்கு நன்றி; அடுத்த update-இல் சந்திப்போம்!
