---
title: "React Labs: நாங்கள் செய்து கொண்டிருப்பவை – June 2022"
author:  Andrew Clark, Dan Abramov, Jan Kassens, Joseph Savona, Josh Story, Lauren Tan, Luna Ruan, Mengdi Chen, Rick Hanlon, Robert Zhang, Sathya Gunasekaran, Sebastian Markbage, and Xuan Huang
date: 2022/06/15
description: "React 18 உருவாக பல ஆண்டுகள் எடுத்தது; அதனுடன் React team-க்கு மதிப்புமிக்க பாடங்களும் வந்தன. அதன் release பல ஆண்டுகளாக நடந்த ஆராய்ச்சி மற்றும் பல பாதைகளை ஆராய்ந்ததன் விளைவு. அவற்றில் சில பாதைகள் வெற்றி பெற்றன; பல பாதைகள் முட்டுக்கட்டையாக முடிந்து புதிய புரிதல்களைத் தந்தன. நாங்கள் கற்ற ஒரு பாடம்: நாங்கள் ஆராயும் பாதைகள் பற்றிய பார்வை இல்லாமல், புதிய features-க்காக community காத்திருப்பது ஏமாற்றமாக இருக்கும்."
---

June 15, 2022 by [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](/blog/2022/03/29/react-v18) உருவாக பல ஆண்டுகள் எடுத்தது; அதனுடன் React team-க்கு மதிப்புமிக்க பாடங்களும் வந்தன. அதன் release பல ஆண்டுகளாக நடந்த ஆராய்ச்சி மற்றும் பல பாதைகளை ஆராய்ந்ததன் விளைவு. அவற்றில் சில பாதைகள் வெற்றி பெற்றன; பல பாதைகள் முட்டுக்கட்டையாக முடிந்து புதிய புரிதல்களைத் தந்தன. நாங்கள் கற்ற ஒரு பாடம்: நாங்கள் ஆராயும் பாதைகள் பற்றிய பார்வை இல்லாமல், புதிய features-க்காக community காத்திருப்பது ஏமாற்றமாக இருக்கும்.

</Intro>

---

எப்போதும் பல projects-ல் நாங்கள் பணியாற்றிக் கொண்டிருப்போம்; மிகவும் experimental ஆனவற்றிலிருந்து தெளிவாக வரையறுக்கப்பட்டவற்றுவரை அவை பரவியிருக்கும். இனிமேல், இந்த projects முழுவதிலும் நாங்கள் செய்து கொண்டிருப்பதை community-யுடன் தொடர்ந்து பகிரத் தொடங்க விரும்புகிறோம்.

எதிர்பார்ப்புகளை தெளிவுபடுத்த: இது தெளிவான timelines கொண்ட roadmap அல்ல. இந்த projects பலவும் active research-இல் உள்ளன; அவற்றிற்கு உறுதியான ship dates குறிப்பிடுவது கடினம். நாங்கள் கற்றுக்கொள்வதைப் பொறுத்து, அவை இப்போதைய வடிவிலேயே ஒருபோதும் ship ஆகாமல் இருக்கவும் கூடும். அதற்கு பதிலாக, நாங்கள் தீவிரமாக சிந்தித்து வரும் problem spaces-களையும் இதுவரை கற்றவற்றையும் உங்களுடன் பகிர விரும்புகிறோம்.

## Server Components {/*server-components*/}

2020 டிசம்பரில் [React Server Components-ன் experimental demo](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) (RSC)-வை அறிவித்தோம். அதன் பிறகு, React 18-இல் அதன் dependencies-ஐ முடித்துக் கொண்டும், experimental feedback-ஆல் தூண்டப்பட்ட மாற்றங்களில் பணியாற்றியும் வருகிறோம்.

குறிப்பாக, fork செய்யப்பட்ட I/O libraries (எ.கா. react-fetch) வைத்திருக்கும் யோசனையை விட்டு, சிறந்த compatibility-க்காக async/await model-ஐ ஏற்கிறோம். Data fetching-க்கு routers-ஐயும் பயன்படுத்தலாம் என்பதால், இது technically RSC release-ஐ block செய்யாது. மற்றொரு மாற்றம்: file extension approach-இலிருந்து விலகி, [boundaries-ஐ annotate செய்வது](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278) நோக்கி நகர்கிறோம்.

Webpack மற்றும் Vite இரண்டிலும் shared semantics-க்கான bundler support-ஐ ஒன்றுபடுத்த Vercel மற்றும் Shopify உடன் இணைந்து பணியாற்றுகிறோம். Launch-க்கு முன், RSCs-ன் semantics முழு React ecosystem முழுவதும் ஒரே மாதிரியாக இருப்பதை உறுதி செய்ய விரும்புகிறோம். Stable நிலையை அடைவதற்கான முக்கிய blocker இதுதான்.

## Asset Loading {/*asset-loading*/}

தற்போது scripts, external styles, fonts, மற்றும் images போன்ற assets பொதுவாக external systems மூலம் preload மற்றும் load செய்யப்படுகின்றன. Streaming, Server Components போன்ற புதிய environments-இல் இதை coordinate செய்வது சிக்கலாக இருக்கலாம்.
எல்லா React environments-லும் செயல்படும் React APIs மூலம் deduplicated external assets-ஐ preload மற்றும் load செய்ய APIs சேர்ப்பதை நாங்கள் ஆராய்கிறோம்.

இவை Suspense-க்கு support தருமாறு செய்வதையும் ஆராய்கிறோம்; இதனால் images, CSS, மற்றும் fonts load ஆகும் வரை display-ஐ block செய்யலாம், ஆனால் streaming மற்றும் concurrent rendering-ஐ block செய்யாது. Visuals திடீரென்று தோன்றி layout shifts ஏற்படும்போது வரும் [“popcorning“](https://twitter.com/sebmarkbage/status/1516852731251724293)-ஐ தவிர்க்க இது உதவும்.

## Static server rendering மேம்பாடுகள் {/*static-server-rendering-optimizations*/}

Static Site Generation (SSG) மற்றும் Incremental Static Regeneration (ISR) ஆகியவை cache செய்யக்கூடிய pages-க்கு நல்ல performance பெற சிறந்த வழிகள். ஆனால் dynamic Server Side Rendering (SSR)-ன் performance-ஐ மேம்படுத்த features சேர்க்கலாம் என்று நினைக்கிறோம்; குறிப்பாக content-இன் பெரும்பகுதி cache செய்யக்கூடியதாக இருந்தாலும் அனைத்தும் அப்படியில்லாதபோது. Compilation மற்றும் static passes பயன்படுத்தி server rendering-ஐ optimize செய்யும் வழிகளை ஆராய்கிறோம்.

## React Optimizing Compiler {/*react-compiler*/}

React Conf 2021-இல் React Forget-ன் [early preview](https://www.youtube.com/watch?v=lGEMwh32soc)-ஐ வழங்கினோம். React-ன் programming model-ஐ வைத்துக்கொண்டே, re-rendering செலவை குறைக்க `useMemo` மற்றும் `useCallback` calls-க்கு இணையானதை தானாக உருவாக்கும் compiler அது.

சமீபத்தில், compiler-ஐ அதிக reliable மற்றும் capable ஆக மாற்ற அதன் rewrite-ஐ முடித்தோம். இந்த புதிய architecture, [local mutations](/learn/keeping-components-pure#local-mutation-your-components-little-secret) பயன்படுத்துதல் போன்ற சிக்கலான patterns-ஐ analyze செய்து memoize செய்ய அனுமதிக்கிறது; மேலும் memoization Hooks-க்கு இணையாக இருப்பதைக் கடந்த பல புதிய compile-time optimization வாய்ப்புகளைத் திறக்கிறது.

Compiler-ன் பல அம்சங்களை explore செய்ய ஒரு playground-லிலும் பணியாற்றுகிறோம். Playground-ன் நோக்கம் compiler development-ஐ மேம்படுத்துவதாக இருந்தாலும், compiler என்ன செய்கிறது என்பதை முயற்சித்து உள்ளுணர்வு பெற இதுவும் உதவும் என்று நினைக்கிறோம். அது உள்ளே எப்படி செயல்படுகிறது என்பதற்கான பல insights-ஐ காட்டுகிறது; நீங்கள் type செய்யும் போதே compiler outputs-ஐ live render செய்கிறது. Compiler release ஆகும் போது இதுவும் அதனுடன் ship செய்யப்படும்.

## Offscreen {/*offscreen*/}

இன்று, ஒரு component-ஐ hide மற்றும் show செய்ய விரும்பினால், உங்களுக்கு இரண்டு options உள்ளன. ஒன்று, அதை tree-இலிருந்து முழுவதுமாக add அல்லது remove செய்வது. இந்த அணுகுமுறையின் பிரச்சினை: ஒவ்வொரு unmount-லும் உங்கள் UI state இழக்கப்படும்; scroll position போன்ற DOM-இல் சேமிக்கப்பட்ட state உட்பட.

மற்றொரு option, component-ஐ mounted-ஆக வைத்துக் கொண்டு CSS மூலம் அதன் தோற்றத்தை visually toggle செய்வது. இது உங்கள் UI state-ஐ preserve செய்யும்; ஆனால் performance cost உண்டு, ஏனெனில் புதிய updates வந்தாலெல்லாம் hidden component-ையும் அதன் children அனைத்தையும் React தொடர்ந்து render செய்ய வேண்டும்.

Offscreen மூன்றாவது option-ஐ அறிமுகப்படுத்துகிறது: UI-ஐ visually hide செய்யுங்கள், ஆனால் அதன் content-க்கு குறைந்த priority கொடுங்கள். இந்த யோசனை `content-visibility` CSS property-யின் ஆன்மாவுக்கு ஒத்தது: content hidden-ஆக இருக்கும் போது, அது UI-ன் மீதமுள்ள பகுதிகளுடன் sync-இல் இருக்க தேவையில்லை. App-ன் மீதமுள்ள பகுதி idle ஆகும் வரை, அல்லது content மீண்டும் visible ஆகும் வரை, React rendering work-ஐ defer செய்ய முடியும்.

Offscreen என்பது high level features-ஐ திறக்கும் low level capability. `startTransition` போன்ற React-ன் மற்ற concurrent features போல, பெரும்பாலான நேரங்களில் நீங்கள் Offscreen API-யுடன் நேரடியாக interact செய்ய மாட்டீர்கள்; அதற்கு பதிலாக, opinionated framework வழியாக இதுபோன்ற patterns-ஐ implement செய்வீர்கள்:

* **Instant transitions.** Link மீது hover செய்வது போன்ற subsequent navigations-ஐ வேகப்படுத்த, சில routing frameworks ஏற்கனவே data-வை prefetch செய்கின்றன. Offscreen மூலம், அவை அடுத்த screen-ஐ background-இல் prerender செய்யவும் முடியும்.
* **Reusable state.** அதேபோல், routes அல்லது tabs இடையே navigate செய்யும்போது, முந்தைய screen-ன் state-ஐ preserve செய்ய Offscreen பயன்படுத்தலாம்; பின்னர் திரும்பிச் சென்று விட்ட இடத்திலிருந்து தொடரலாம்.
* **Virtualized list rendering.** பெரிய item lists காட்டும்போது, virtualized list frameworks தற்போது visible உள்ளதை விட அதிக rows-ஐ prerender செய்யும். List-இல் visible items-ஐ விட குறைந்த priority-யில் hidden rows-ஐ prerender செய்ய Offscreen பயன்படுத்தலாம்.
* **Backgrounded content.** Modal overlay காட்டும் போது போல, content-ஐ hide செய்யாமல் background-இல் deprioritize செய்ய தொடர்புடைய feature ஒன்றையும் நாங்கள் ஆராய்கிறோம்.

## Transition Tracing {/*transition-tracing*/}

தற்போது React-க்கு இரண்டு profiling tools உள்ளன. [அசல் Profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html), profiling session-இல் உள்ள எல்லா commits-ன் overview-ஐ காட்டுகிறது. ஒவ்வொரு commit-க்கும் render ஆன components மற்றும் அவற்றை render செய்ய எடுத்த நேரத்தையும் காட்டுகிறது. React 18-இல் அறிமுகமான [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76)-ன் beta version-யும் எங்களிடம் உள்ளது; components எப்போது updates schedule செய்கின்றன மற்றும் React அந்த updates-இல் எப்போது வேலை செய்கிறது என்பதைக் காட்டுகிறது. இந்த இரண்டு profilers-மும் developers தங்கள் code-இல் performance பிரச்சினைகளை கண்டறிய உதவுகின்றன.

Context இல்லாமல் தனித்தனி slow commits அல்லது components பற்றித் தெரிந்துகொள்வது developers-க்கு பெரிதாக பயனில்லை என்பதை உணர்ந்தோம். Slow commits-க்கு உண்மையில் என்ன காரணம் என்பதை அறிதல்தான் அதிக பயனுள்ளதாகும். மேலும் developers, performance regressions-ஐ கவனிக்கவும், ஒரு interaction ஏன் slow ஆனது மற்றும் அதை எப்படி சரிசெய்வது என்பதைப் புரிந்துகொள்ளவும், குறிப்பிட்ட interactions-ஐ (எ.கா. button click, initial load, அல்லது page navigation) track செய்ய விரும்புகிறார்கள்.

முன்பு [Interaction Tracing API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16) உருவாக்கி இந்த பிரச்சினையை தீர்க்க முயன்றோம்; ஆனால் ஒரு interaction ஏன் slow ஆனது என்பதை track செய்வதின் துல்லியத்தை குறைக்கும் சில அடிப்படை design flaws அதில் இருந்தன, சில நேரங்களில் interactions முடிவில்லாமல் நீடிக்கும் நிலையும் ஏற்பட்டது. இந்த பிரச்சினைகளால் இறுதியில் [இந்த API-யை அகற்றினோம்](https://github.com/facebook/react/pull/20037).

இந்த பிரச்சினைகளை தீர்க்கும் Interaction Tracing API-ன் புதிய version-இல் பணியாற்றுகிறோம் (இது `startTransition` மூலம் தொடங்கப்படுவதால் தற்காலிகமாக Transition Tracing என்று அழைக்கப்படுகிறது).

## New React Docs {/*new-react-docs*/}

கடந்த ஆண்டு, புதிய React documentation website-ன் beta version-ஐ ([பின்னர் react.dev ஆக ship ஆனது](/blog/2023/03/16/introducing-react-dev)) அறிவித்தோம். புதிய learning materials Hooks-ஐ முதலில் கற்பிக்கின்றன; புதிய diagrams, illustrations, மேலும் பல interactive examples மற்றும் challenges கொண்டுள்ளன. React 18 release-இல் கவனம் செலுத்த அந்த பணியிலிருந்து ஓரளவு இடைவெளி எடுத்தோம்; இப்போது React 18 வெளிவந்ததால், புதிய documentation-ஐ முடித்து ship செய்ய தீவிரமாக பணியாற்றுகிறோம்.

தற்போது effects பற்றிய விரிவான பகுதியை எழுதுகிறோம்; புதியவர்களுக்கும் அனுபவமுள்ள React users-க்கும் இது சவாலான topics-இல் ஒன்றாக இருப்பதாக கேள்விப்பட்டுள்ளோம். [Synchronizing with Effects](/learn/synchronizing-with-effects) இந்த தொடரில் வெளியான முதல் பக்கம்; அடுத்த வாரங்களில் மேலும் பக்கங்கள் வரும். Effects பற்றி விரிவான பகுதி எழுதத் தொடங்கியபோது, பல பொதுவான effect patterns-ஐ React-க்கு புதிய primitive சேர்ப்பதன் மூலம் தெளிவுப்படுத்தலாம் என்பதை உணர்ந்தோம். அதைப் பற்றிய சில ஆரம்ப எண்ணங்களை [useEvent RFC](https://github.com/reactjs/rfcs/pull/220)-இல் பகிர்ந்துள்ளோம். இது தற்போது early research-இல் உள்ளது; இன்னும் இந்த யோசனையில் iterate செய்து வருகிறோம். இதுவரை RFC மீது community வழங்கிய comments-க்கும், நடந்து கொண்டிருக்கும் documentation rewrite-க்கு கிடைத்த [feedback](https://github.com/reactjs/react.dev/issues/3308) மற்றும் contributions-க்கும் நன்றி. புதிய website implementation-க்கு பல improvements submit செய்து review செய்த [Harish Kumar](https://github.com/harish-sethuraman)-க்கு குறிப்பாக நன்றி தெரிவிக்க விரும்புகிறோம்.

*இந்த blog post-ஐ review செய்த [Sophie Alpert](https://twitter.com/sophiebits)-க்கு நன்றி!*
