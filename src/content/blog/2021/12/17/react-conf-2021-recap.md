---
title: "React Conf 2021 சுருக்கம்"
author: Jesslyn Tannady and Rick Hanlon
date: 2021/12/17
description: கடந்த வாரம் எங்கள் 6வது React Conf நடத்தினோம். முந்தைய ஆண்டுகளில், React Native மற்றும் React Hooks போன்ற industry-யை மாற்றிய announcements வழங்க React Conf stage-ஐ பயன்படுத்தியுள்ளோம். இந்த ஆண்டு, React 18 release மற்றும் concurrent features-ன் gradual adoption-இலிருந்து தொடங்கி, React-க்கான எங்கள் multi-platform vision-ஐ பகிர்ந்தோம்.
---

December 17, 2021 by [Jesslyn Tannady](https://twitter.com/jtannady) and [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

கடந்த வாரம் எங்கள் 6வது React Conf நடத்தினோம். முந்தைய ஆண்டுகளில், [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) மற்றும் [_React Hooks_](https://reactjs.org/docs/hooks-intro.html) போன்ற industry-யை மாற்றிய announcements வழங்க React Conf stage-ஐ பயன்படுத்தியுள்ளோம். இந்த ஆண்டு, React 18 release மற்றும் concurrent features-ன் gradual adoption-இலிருந்து தொடங்கி, React-க்கான எங்கள் multi-platform vision-ஐ பகிர்ந்தோம்.

</Intro>

---

React Conf online-இல் host செய்யப்பட்ட முதல் முறை இதுவாகும்; அது இலவசமாக stream செய்யப்பட்டு 8 வேறு மொழிகளில் மொழிபெயர்க்கப்பட்டது. உலகம் முழுவதிலிருந்தும் participants எங்கள் conference Discord-இலும், அனைத்து timezones-க்கும் accessibility கிடைக்க replay event-இலும் இணைந்தனர். 50,000-க்கும் மேற்பட்டோர் register செய்தனர்; 19 talks-க்கு 60,000-க்கும் மேற்பட்ட views, இரண்டு events முழுவதும் Discord-இல் 5,000 participants இருந்தனர்.

எல்லா talks-யும் [online-இல் stream செய்ய கிடைக்கின்றன](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa).

Stage-இல் பகிரப்பட்டவற்றின் சுருக்கம்:

## React 18 மற்றும் concurrent features {/*react-18-and-concurrent-features*/}

Keynote-இல், React 18-இலிருந்து தொடங்கி React-ன் எதிர்காலத்திற்கான எங்கள் vision-ஐ பகிர்ந்தோம்.

React 18, நீண்டநாள் எதிர்பார்த்த concurrent renderer மற்றும் Suspense updates-ஐ major breaking changes இல்லாமல் சேர்க்கிறது. Apps React 18-க்கு upgrade செய்து, மற்ற major release போலவே இருக்கும் effort அளவில் concurrent features-ஐ gradual-ஆக adopt செய்யத் தொடங்கலாம்.

**இதன் பொருள் concurrent mode இல்லை; concurrent features மட்டுமே உள்ளன.**

Keynote-இல் Suspense, Server Components, புதிய React working groups, மற்றும் React Native-க்கான எங்கள் நீண்டகால many-platform vision-யையும் பகிர்ந்தோம்.

[Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), மற்றும் [Rick Hanlon](https://twitter.com/rickhanlonii) வழங்கிய முழு keynote-ஐ இங்கே பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## Application developers-க்கான React 18 {/*react-18-for-application-developers*/}

Keynote-இல், React 18 RC இப்போது முயற்சிக்க கிடைக்கிறது என்றும் அறிவித்தோம். கூடுதல் feedback நிலுவையில், அடுத்த ஆண்டின் ஆரம்பத்தில் stable-க்கு publish செய்யும் React version இதுவே.

React 18 RC முயற்சிக்க, உங்கள் dependencies-ஐ upgrade செய்யுங்கள்:

```bash
npm install react@rc react-dom@rc
```

புதிய `createRoot` API-க்கு மாறுங்கள்:

```js
// before
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// after
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

React 18-க்கு upgrade செய்வதற்கான demo-க்கு, [Shruti Kapoor](https://twitter.com/shrutikapoor08) வழங்கிய talk-ஐ இங்கே பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Suspense உடன் சேவையக ஸ்ட்ரீமிங் {/*streaming-server-rendering-with-suspense*/}

React 18, Suspense பயன்படுத்தி server-side rendering performance மேம்பாடுகளையும் கொண்டுள்ளது.

Streaming server rendering, server-இல் React components-இலிருந்து HTML generate செய்து, அந்த HTML-ஐ உங்கள் users-க்கு stream செய்ய அனுமதிக்கிறது. React 18-இல், `Suspense` பயன்படுத்தி உங்கள் app-ஐ சிறிய independent units ஆகப் பிரிக்கலாம்; அவை app-ன் மீதமுள்ள பகுதியை block செய்யாமல் ஒன்றுக்கொன்று independent-ஆக stream செய்யப்படலாம். இதனால் users உங்கள் content-ஐ விரைவில் பார்த்து அதனுடன் மிகவும் வேகமாக interact செய்யத் தொடங்கலாம்.

Deep dive-க்கு, [Shaundai Person](https://twitter.com/shaundai) வழங்கிய talk-ஐ இங்கே பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## முதல் React working group {/*the-first-react-working-group*/}

React 18-க்காக, experts, developers, library maintainers, மற்றும் educators குழுவுடன் collaborate செய்ய எங்கள் முதல் Working Group-ஐ உருவாக்கினோம். ஒன்றாக, gradual adoption strategy-ஐ உருவாக்கவும் `useId`, `useSyncExternalStore`, மற்றும் `useInsertionEffect` போன்ற புதிய APIs-ஐ refine செய்யவும் பணியாற்றினோம்.

இந்த பணியின் overview-க்கு, [Aakansha Doshi](https://twitter.com/aakansha1216) வழங்கிய talk-ஐ பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## React Developer Tooling {/*react-developer-tooling*/}

இந்த release-இல் உள்ள புதிய features-க்கு support தர, புதிய React DevTools team மற்றும் developers தங்கள் React apps-ஐ debug செய்ய உதவும் புதிய Timeline Profiler-ஐயும் அறிவித்தோம்.

புதிய DevTools features பற்றிய கூடுதல் தகவல் மற்றும் demo-க்கு, [Brian Vaughn](https://twitter.com/brian_d_vaughn) வழங்கிய talk-ஐ பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## React without memo {/*react-without-memo*/}

எதிர்காலத்தை நோக்கி, auto-memoizing compiler குறித்த எங்கள் React Labs research update-ஐ [Xuan Huang (黄玄)](https://twitter.com/Huxpro) பகிர்ந்தார். கூடுதல் தகவல் மற்றும் compiler prototype demo-க்கு இந்த talk-ஐ பார்க்கவும்:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## React docs keynote {/*react-docs-keynote*/}

React கொண்டு கற்றலும் design செய்வதுமென்கிற talks பகுதியை, React-ன் புதிய docs-இல் எங்கள் investment பற்றி [Rachel Nabors](https://twitter.com/rachelnabors) வழங்கிய keynote தொடங்கியது ([இப்போது react.dev ஆக ship ஆகியுள்ளது](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## மேலும்... {/*and-more*/}

**React கொண்டு கற்றல் மற்றும் design செய்வது பற்றிய talks-யையும் கேட்டோம்:**

* Debbie O'Brien: [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Relay, React Native, மற்றும் PyTorch teams வழங்கிய talks:**

* Robert Balicki: [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**Accessibility, tooling, மற்றும் Server Components குறித்து community வழங்கிய talks:**

* Daishi Kato: [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## நன்றி {/*thank-you*/}

Conference ஒன்றை நாங்களே திட்டமிட்ட முதல் ஆண்டு இதுவாகும்; நன்றி சொல்ல வேண்டியோர் பலர் உள்ளனர்.

முதலில், எங்கள் அனைத்து speakers-க்கும் நன்றி: [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0), மற்றும் [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

Talks மீது feedback வழங்க உதவிய அனைவருக்கும் நன்றி: [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors), மற்றும் [Tim Yung](https://twitter.com/yungsters).

Conference Discord-ஐ set up செய்து எங்கள் Discord admin ஆக இருந்த [Lauren Tan](https://twitter.com/potetotes)-க்கு நன்றி.

Overall direction குறித்த feedback வழங்கி, diversity மற்றும் inclusion மீது நாங்கள் கவனம் செலுத்துவதை உறுதி செய்த [Seth Webster](https://twitter.com/sethwebster)-க்கு நன்றி.

எங்கள் moderation முயற்சியை spearhead செய்த [Rachel Nabors](https://twitter.com/rachelnabors)-க்கு நன்றி; moderation guide உருவாக்கி, moderation team-ஐ வழிநடத்தி, translators மற்றும் moderators-ஐ train செய்து, இரு events-யையும் moderate செய்ய உதவிய [Aisha Blake](https://twitter.com/AishaBlake)-க்கும் நன்றி.

எங்கள் moderators [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li, மற்றும் [Xuan Huang (黄玄)](https://twitter.com/Huxpro)-க்கு நன்றி.

எங்கள் replay event-ஐ moderate செய்து community-க்கு engaging ஆக வைத்திருக்க உதவிய [React India](https://www.reactindia.io/)-இன் [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0), மற்றும் Vihang Patel; [React China](https://twitter.com/ReactChina)-வின் [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15), மற்றும் [YanLun Li](https://twitter.com/anneincoding)-க்கு நன்றி.

Conference website கட்டப்பட்ட [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit)-ஐ publish செய்த Vercel-க்கு நன்றி; Next.js Conf நடத்தும் அனுபவத்தை பகிர்ந்த [Lee Robinson](https://twitter.com/leeerob) மற்றும் [Delba de Oliveira](https://twitter.com/delba_oliveira)-க்கு நன்றி.

Conferences நடத்தும் அனுபவம், [RustConf](https://rustconf.com/) நடத்திக் கற்றவை, மேலும் conferences நடத்துவதற்கான ஆலோசனைகள் கொண்ட அவரது [Event Driven](https://leanpub.com/eventdriven/) புத்தகம் ஆகியவற்றை பகிர்ந்த [Leah Silber](https://twitter.com/wifelette)-க்கு நன்றி.

Women of React Conf நடத்தும் அனுபவத்தை பகிர்ந்த [Kevin Lewis](https://twitter.com/_phzn) மற்றும் [Rachel Nabors](https://twitter.com/rachelnabors)-க்கு நன்றி.

Planning முழுவதும் ஆலோசனைகள் மற்றும் ideas வழங்கிய [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic), மற்றும் [Shaundai Person](https://twitter.com/shaundai)-க்கு நன்றி.

Conference website மற்றும் tickets design செய்து build செய்ய உதவிய [Dan Lebowitz](https://twitter.com/lebo)-க்கு நன்றி.

Keynote மற்றும் Meta employee talks-க்கான videos record செய்த Facebook Video Productions team-இன் Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman மற்றும் பிறருக்கு நன்றி.

Conference organize செய்ய, stream-இல் உள்ள எல்லா videos-யையும் edit செய்ய, அனைத்து talks-யையும் translate செய்ய, மேலும் Discord-ஐ பல மொழிகளில் moderate செய்ய உதவிய எங்கள் partner HitPlay-க்கு நன்றி.

இறுதியாக, இதை சிறந்த React Conf ஆக்கிய அனைத்து participants-க்கும் நன்றி!
