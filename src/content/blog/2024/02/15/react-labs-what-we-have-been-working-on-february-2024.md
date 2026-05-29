---
title: "React Labs: நாங்கள் செய்து கொண்டிருப்பவை – February 2024"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: React Labs posts-இல், active research மற்றும் development-இல் உள்ள projects பற்றி எழுதுகிறோம். எங்கள் கடைசி update-க்கு பிறகு குறிப்பிடத்தக்க முன்னேற்றம் செய்துள்ளோம்; எங்கள் முன்னேற்றத்தை பகிர விரும்புகிறோம்.
---

February 15, 2024 by [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), and [Dan Abramov](https://bsky.app/profile/danabra.mov).

---

<Intro>

React Labs posts-இல், active research மற்றும் development-இல் உள்ள projects பற்றி எழுதுகிறோம். எங்கள் [கடைசி update](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)-க்கு பிறகு குறிப்பிடத்தக்க முன்னேற்றம் செய்துள்ளோம்; எங்கள் முன்னேற்றத்தை பகிர விரும்புகிறோம்.

</Intro>

---

## React Compiler {/*react-compiler*/}

React Compiler இனி research project அல்ல: compiler இப்போது production-இல் instagram.com-ஐ இயக்குகிறது; மேலும் Meta-வில் கூடுதல் surfaces முழுவதும் compiler-ஐ ship செய்யவும் முதல் open source release-ஐத் தயாரிக்கவும் பணியாற்றுகிறோம்.

எங்கள் [முந்தைய post](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler)-இல் விவாதித்தபடி, state மாறும்போது React *சில நேரங்களில்* அதிகமாக re-render செய்யலாம். React-ன் ஆரம்ப நாட்களிலிருந்தே அத்தகைய cases-க்கு எங்கள் solution manual memoization ஆக இருந்தது. தற்போதைய APIs-இல், state changes-இல் React எவ்வளவு re-render செய்ய வேண்டும் என்பதை manually tune செய்ய [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), மற்றும் [`memo`](/reference/react/memo) APIs பயன்படுத்துவது என்று இதன் பொருள். ஆனால் manual memoization ஒரு compromise. அது code-ஐ clutter செய்கிறது, தவறாகப் பயன்படுத்த சாத்தியம், மேலும் update ஆக வைத்திருக்க கூடுதல் வேலை தேவை.

Manual memoization ஒரு நியாயமான compromise என்றாலும், அதில் நாங்கள் திருப்தியடையவில்லை. State மாறும் போது UI-யின் சரியான பகுதிகளை மட்டும் React *தானாக* re-render செய்ய வேண்டும், அதுவும் *React-ன் core mental model-இல் compromise இல்லாமல்* என்பதே எங்கள் vision. Standard JavaScript values மற்றும் idioms உடன் UI-ஐ state-ன் நேரடியான function ஆக பார்க்கும் React-ன் அணுகுமுறை, பல developers-க்கு React அணுகத்தக்கதாக இருந்ததற்கான முக்கிய காரணம் என்று நாங்கள் நம்புகிறோம். அதனால்தான் React-க்கான optimizing compiler உருவாக்க முதலீடு செய்துள்ளோம்.

JavaScript-ன் loose rules மற்றும் dynamic nature காரணமாக அதை optimize செய்வது மிகவும் சவாலானது. JavaScript-ன் rules *மற்றும்* “rules of React” இரண்டையும் model செய்வதன் மூலம் React Compiler code-ஐ பாதுகாப்பாக compile செய்ய முடிகிறது. உதாரணமாக, React components idempotent ஆக இருக்க வேண்டும், அதாவது அதே inputs கொடுத்தால் அதே value return செய்ய வேண்டும், மேலும் props அல்லது state values-ஐ mutate செய்யக்கூடாது. இந்த rules developers என்ன செய்ய முடியும் என்பதைக் கட்டுப்படுத்தி, compiler optimize செய்ய பாதுகாப்பான இடத்தை உருவாக்க உதவுகின்றன.

நிச்சயமாக, developers சில நேரங்களில் rules-ஐ ஓரளவு வளைப்பார்கள் என்பதை நாங்கள் புரிந்துகொள்கிறோம்; React Compiler அதிகமான code-இல் out of the box வேலை செய்ய வேண்டும் என்பதே எங்கள் இலக்கு. Code React-ன் rules-ஐ strict-ஆகப் பின்பற்றாதபோது compiler அதை detect செய்ய முயற்சிக்கும்; பாதுகாப்பான இடங்களில் code-ஐ compile செய்யும் அல்லது பாதுகாப்பாக இல்லாவிட்டால் compilation-ஐ skip செய்யும். இந்த அணுகுமுறையை validate செய்ய Meta-வின் பெரிய மற்றும் பல்வகை codebase-க்கு எதிராக test செய்கிறோம்.

தங்கள் code React-ன் rules-ஐப் பின்பற்றுகிறதா என்பதை உறுதி செய்ய ஆர்வமுள்ள developers-க்கு, [Strict Mode enable செய்ய](/reference/react/StrictMode) மற்றும் [React-ன் ESLint plugin configure செய்ய](/learn/editor-setup#linting) பரிந்துரைக்கிறோம். இந்த tools உங்கள் React code-இல் subtle bugs-ஐப் பிடிக்க உதவும்; இன்று உங்கள் applications-ன் quality-ஐ மேம்படுத்தும்; React Compiler போன்ற வரவிருக்கும் features-க்கு உங்கள் applications-ஐ future-proof செய்யும். Teams இந்த rules-ஐ புரிந்து கொண்டு apply செய்து இன்னும் robust apps உருவாக்க உதவ, React-ன் rules குறித்த consolidated documentation மற்றும் எங்கள் ESLint plugin updates-லிலும் பணியாற்றுகிறோம்.

Compiler செயல்படுவதைக் காண, கடந்த fall-இல் எங்கள் [talk](https://www.youtube.com/watch?v=qOQClO3g8-Y)-ஐ பார்க்கலாம். Talk நடந்த நேரத்தில், instagram.com-ன் ஒரு page-இல் React Compiler-ஐ முயற்சித்த early experimental data எங்களிடம் இருந்தது. அதன் பிறகு, instagram.com முழுவதும் compiler-ஐ production-க்கு ship செய்தோம். Meta-வில் கூடுதல் surfaces மற்றும் open source-க்கு rollout-ஐ வேகப்படுத்த எங்கள் team-ஐயும் விரிவாக்கியுள்ளோம். முன் இருக்கும் பாதையைப் பற்றி உற்சாகமாக உள்ளோம்; வரும் மாதங்களில் பகிர மேலும் விஷயங்கள் இருக்கும்.

## Actions {/*actions*/}


Database mutations execute செய்து forms implement செய்ய, Server Actions மூலம் client-இலிருந்து server-க்கு data அனுப்ப solutions-ஐ ஆராய்ந்து வருகிறோம் என்று [முன்பு பகிர்ந்தோம்](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components). Server Actions development-இன் போது, client-only applications-இலும் data handling support செய்ய இந்த APIs-ஐ விரிவாக்கினோம்.

இந்த விரிவான feature தொகுப்பை நேரடியாக "Actions" என்று அழைக்கிறோம். Actions, [`<form/>`](/reference/react-dom/components/form) போன்ற DOM elements-க்கு function pass செய்ய அனுமதிக்கின்றன:

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

`action` function synchronous-ஆகவும் asynchronous-ஆகவும் இயங்க முடியும். Standard JavaScript பயன்படுத்தி client side-இல் அல்லது [`'use server'`](/reference/rsc/use-server) directive உடன் server-இல் அவற்றை define செய்யலாம். Action பயன்படுத்தும் போது, data submission-ன் life cycle-ஐ React உங்களுக்காக manage செய்யும்; form action-ன் current state மற்றும் response-ஐ access செய்ய [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) மற்றும் [`useActionState`](/reference/react/useActionState) போன்ற hooks வழங்கப்படும்.

Default-ஆக, Actions ஒரு [transition](/reference/react/useTransition)-க்குள் submit செய்யப்படும்; action process ஆகும் போது current page interactive-ஆக இருக்கும். Actions async functions-க்கு support தருவதால், transitions-இல் `async/await` பயன்படுத்தும் திறனையும் சேர்த்துள்ளோம். `fetch` போன்ற async request தொடங்கும் போது transition-ன் `isPending` state மூலம் pending UI காட்டவும், update apply ஆகும் வரை அந்த pending UI-ஐ தொடரவும் இதனால் முடியும்.

Actions-க்கு இணையாக, optimistic state updates manage செய்ய [`useOptimistic`](/reference/react/useOptimistic) என்ற feature-ஐ அறிமுகப்படுத்துகிறோம். இந்த hook மூலம், final state commit ஆனதும் தானாக revert ஆகும் temporary updates-ஐ apply செய்யலாம். Actions-க்கு, submission வெற்றிகரமாக இருக்கும் என்று கருதி client-இல் data-வின் final state-ஐ optimistically set செய்து, server-இலிருந்து கிடைக்கும் data value-க்கு revert செய்ய இது அனுமதிக்கிறது. இது சாதாரண `async`/`await` பயன்படுத்தி இயங்குவதால், client-இல் `fetch` பயன்படுத்தினாலும் server-இலிருந்து Server Action பயன்படுத்தினாலும் ஒரேபோல் வேலை செய்கிறது.

Library authors தங்கள் சொந்த components-இல் `useTransition` மூலம் custom `action={fn}` props implement செய்யலாம். React developers-க்கு consistent experience வழங்க, component APIs design செய்யும் போது libraries Actions pattern-ஐ adopt செய்ய வேண்டும் என்பதே எங்கள் நோக்கம். உதாரணமாக, உங்கள் library `<Calendar onSelect={eventHandler}>` component வழங்கினால், `<Calendar selectAction={action}>` API-யையும் expose செய்வதை பரிசீலிக்கவும்.

முதல் கட்டத்தில் client-server data transfer-க்கான Server Actions மீது கவனம் செலுத்தினாலும், React-க்கான எங்கள் philosophy எல்லா platforms மற்றும் environments முழுவதும் ஒரே programming model வழங்குவது. சாத்தியமான போது, client-இல் feature ஒன்றை அறிமுகப்படுத்தினால் அதை server-இலும் வேலை செய்யச் செய்வதே எங்கள் நோக்கம்; அதேபோல் மாறாகவும். உங்கள் app எங்கு run ஆனாலும் வேலை செய்யும் single set of APIs உருவாக்க இந்த philosophy உதவுகிறது; பின்னர் வேறு environments-க்கு upgrade செய்வதும் மேம்படுகிறது.

Actions இப்போது Canary channel-இல் கிடைக்கின்றன; React-ன் அடுத்த release-இல் ship ஆகும்.

## React Canary-யில் புதிய features {/*new-features-in-react-canary*/}

புதிய stable features-ன் design இறுதி நிலைக்கு நெருக்கமாக வந்தவுடன், stable semver version-இல் release ஆகும்முன் அவற்றை adopt செய்யும் option ஆக [React Canaries](/blog/2023/05/03/react-canaries)-ஐ அறிமுகப்படுத்தினோம்.

Canaries என்பது React-ஐ நாங்கள் develop செய்யும் முறையில் ஏற்பட்ட மாற்றம். முன்பு features Meta-க்குள் private-ஆக research செய்து build செய்யப்பட்டன; எனவே Stable-க்கு release ஆனபோது மட்டுமே users இறுதி polished product-ஐ பார்த்தனர். Canaries மூலம், React Labs blog series-இல் பகிரும் features-ஐ finalize செய்ய community உதவியுடன் public-ஆக build செய்கிறோம். இதனால் features முழுமையாக முடிந்த பிறகு அல்லாமல், அவை finalize ஆகும் போதே அவற்றைப் பற்றி நீங்கள் விரைவாகக் கேட்கிறீர்கள்.

React Server Components, Asset Loading, Document Metadata, மற்றும் Actions அனைத்தும் React Canary-யில் வந்துள்ளன; react.dev-இல் இந்த features-க்கான docs சேர்த்துள்ளோம்:

- **Directives**: [`"use client"`](/reference/rsc/use-client) மற்றும் [`"use server"`](/reference/rsc/use-server) ஆகியவை full-stack React frameworks-க்காக வடிவமைக்கப்பட்ட bundler features. அவை இரண்டு environments இடையிலான "split points"-ஐ குறிக்கின்றன: `"use client"` bundler-க்கு `<script>` tag உருவாக்க சொல்லும் ([Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island) போல); `"use server"` bundler-க்கு POST endpoint உருவாக்க சொல்லும் ([tRPC Mutations](https://trpc.io/docs/concepts) போல). ஒன்றாக, client-side interactivity-யை தொடர்புடைய server-side logic உடன் compose செய்யும் reusable components எழுத இவை அனுமதிக்கின்றன.

- **Document Metadata**: உங்கள் component tree-இல் எங்கிருந்தும் [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta), மற்றும் metadata [`<link>`](/reference/react-dom/components/link) tags render செய்ய built-in support சேர்த்துள்ளோம். Fully client-side code, SSR, மற்றும் RSC உட்பட எல்லா environments-லும் இவை ஒரேபோல் வேலை செய்கின்றன. [React Helmet](https://github.com/nfl/react-helmet) போன்ற libraries முன்னோடியாக கொண்டு வந்த features-க்கு built-in support இதனால் கிடைக்கிறது.

- **Asset Loading**: stylesheets, fonts, மற்றும் scripts போன்ற resources-ன் loading lifecycle உடன் Suspense-ஐ integrate செய்துள்ளோம்; இதனால் [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link), மற்றும் [`<script>`](/reference/react-dom/components/script) போன்ற elements-இலுள்ள content display செய்ய தயாரா என்பதை React தீர்மானிக்கும் போது அவற்றையும் கணக்கில் கொள்ளும். Resource எப்போது load மற்றும் initialize ஆக வேண்டும் என்பதில் அதிக control வழங்க, `preload` மற்றும் `preinit` போன்ற புதிய [Resource Loading APIs](/reference/react-dom#resource-preloading-apis)-யையும் சேர்த்துள்ளோம்.

- **Actions**: மேலே பகிர்ந்தபடி, client-இலிருந்து server-க்கு data அனுப்புவதை manage செய்ய Actions சேர்த்துள்ளோம். [`<form/>`](/reference/react-dom/components/form) போன்ற elements-க்கு `action` சேர்க்கலாம்; [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) மூலம் status-ஐ access செய்யலாம்; [`useActionState`](/reference/react/useActionState) மூலம் result-ஐ handle செய்யலாம்; [`useOptimistic`](/reference/react/useOptimistic) மூலம் UI-ஐ optimistically update செய்யலாம்.

இந்த features அனைத்தும் ஒன்றாக வேலை செய்வதால், அவற்றை Stable channel-இல் தனித்தனியாக release செய்வது கடினம். Form states access செய்ய complementary hooks இல்லாமல் Actions release செய்தால், Actions-ன் practical usability குறையும். Server Actions integrate செய்யாமல் React Server Components அறிமுகப்படுத்தினால், server-இல் data modify செய்வது சிக்கலாகும்.

ஒரு feature தொகுப்பை Stable channel-க்கு release செய்யும் முன், அவை cohesively வேலை செய்கின்றனவா மற்றும் production-இல் பயன்படுத்த developers-க்கு தேவையான அனைத்தும் உள்ளதா என்பதை உறுதி செய்ய வேண்டும். React Canaries, இந்த features-ஐ தனித்தனியாக develop செய்து, முழு feature set முடியும் வரை stable APIs-ஐ incrementally release செய்ய அனுமதிக்கின்றன.

React Canary-யில் உள்ள தற்போதைய feature set முழுமையாக உள்ளது; release செய்ய தயாராக உள்ளது.

## React-ன் அடுத்த major version {/*the-next-major-version-of-react*/}

சில ஆண்டுகள் iteration-க்கு பிறகு, `react@canary` இப்போது `react@latest`-க்கு ship ஆக தயாராக உள்ளது. மேலே கூறிய புதிய features, உங்கள் app run ஆகும் எந்த environment உடனும் compatible ஆக இருந்து, production use-க்கு தேவையான அனைத்தையும் வழங்குகின்றன. Asset Loading மற்றும் Document Metadata சில apps-க்கு breaking change ஆக இருக்கலாம் என்பதால், React-ன் அடுத்த version major version ஆக இருக்கும்: **React 19**.

Release-க்கு தயார் செய்ய இன்னும் வேலை உள்ளது. React 19-இல், Web Components support போன்ற breaking changes தேவைப்படும் நீண்ட காலமாக கேட்டுவரப்பட்ட improvements-யையும் சேர்க்கிறோம். இப்போது எங்கள் கவனம் இந்த changes-ஐ land செய்வது, release-க்கு தயார் செய்வது, புதிய features-க்கான docs-ஐ finalize செய்வது, மேலும் சேர்க்கப்பட்டவை பற்றிய announcements publish செய்வது.

React 19-இல் உள்ள அனைத்தும், புதிய client features-ஐ எப்படி adopt செய்வது, React Server Components-க்கு support எப்படி build செய்வது பற்றிய கூடுதல் தகவலை வரும் மாதங்களில் பகிர்வோம்.

## Offscreen (Activity என rename செய்யப்பட்டது). {/*offscreen-renamed-to-activity*/}

எங்கள் கடைசி update-க்கு பிறகு, research செய்து வந்த capability-யை “Offscreen” என்பதிலிருந்து “Activity” என rename செய்துள்ளோம். “Offscreen” என்ற பெயர் app-இன் visible அல்லாத பகுதிகளுக்கே இது பொருந்தும் என்று உணர்த்தியது; ஆனால் feature-ஐ research செய்தபோது, modal-க்கு பின்னால் உள்ள content போன்ற app-இன் சில பகுதிகள் visible ஆக இருந்தும் inactive ஆக இருக்க முடியும் என்பதை உணர்ந்தோம். App-இன் சில பகுதிகளை “active” அல்லது “inactive” என்று mark செய்யும் behavior-ஐ புதிய பெயர் இன்னும் நெருக்கமாக பிரதிபலிக்கிறது.

Activity இன்னும் research-இல் உள்ளது; library developers-க்கு expose செய்யப்படும் primitives-ஐ finalize செய்வதே எங்கள் மீதமுள்ள வேலை. அதிகமாக complete ஆன features-ஐ ship செய்வதில் கவனம் செலுத்துவதால், இந்த பகுதியின் priority-ஐ குறைத்துள்ளோம்.

* * *

இந்த update-க்கு கூடுதலாக, எங்கள் team conferences-இல் present செய்து, podcasts-இல் பங்கேற்று எங்கள் பணியைப் பற்றி மேலும் பேசவும் கேள்விகளுக்கு பதிலளிக்கவும் செய்துள்ளது.

- [Sathya Gunasekaran](https://github.com/gsathya) [React India](https://www.youtube.com/watch?v=kjOacmVsLSE) conference-இல் React Compiler பற்றி பேசினார்

- [Dan Abramov](/community/team#dan-abramov) [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s)-இல் “React from Another Dimension” என்ற talk வழங்கினார்; React Server Components மற்றும் Actions எப்படி உருவாகியிருக்கலாம் என்ற alternative history-யை அது ஆராய்கிறது

- [Dan Abramov](/community/team#dan-abramov) React Server Components பற்றி [Changelog-ன் JS Party podcast](https://changelog.com/jsparty/311)-இல் interview செய்யப்பட்டார்

- [Matt Carroll](/community/team#matt-carroll) [Front-End Fire podcast](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll)-இல் interview செய்யப்பட்டார்; அங்கு அவர் [The Two Reacts](https://overreacted.io/the-two-reacts/) பற்றி விவாதித்தார்

இந்த post-ஐ review செய்த [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White), மற்றும் [Sathya Gunasekaran](https://twitter.com/_gsathya)-க்கு நன்றி.

படித்ததற்கு நன்றி; [React Conf-இல் சந்திப்போம்](https://conf.react.dev/)!
