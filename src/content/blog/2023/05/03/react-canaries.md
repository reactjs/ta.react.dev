---
title: "React Canaries: Meta-க்கு வெளியே incremental feature rollout-ஐ சாத்தியமாக்குதல்"
author: Dan Abramov, Sophie Alpert, Rick Hanlon, Sebastian Markbage, and Andrew Clark
date: 2023/05/03
description: Meta நீண்ட காலமாக React-ன் bleeding-edge versions-ஐ internally பயன்படுத்தியதைப் போல, புதிய individual features-ன் design இறுதி நிலைக்கு நெருக்கமாக வந்தவுடன், stable version-இல் release ஆகும்முன் அவற்றை adopt செய்ய React community-க்கு ஒரு option வழங்க விரும்புகிறோம். புதிய அதிகாரப்பூர்வ support கொண்ட [Canary release channel](/community/versioning-policy#canary-channel)-ஐ அறிமுகப்படுத்துகிறோம். Frameworks போன்ற curated setups, individual React features adoption-ஐ React release schedule-இலிருந்து decouple செய்ய இதனால் முடியும்.
---

May 3, 2023 by [Dan Abramov](https://bsky.app/profile/danabra.mov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Meta நீண்ட காலமாக React-ன் bleeding-edge versions-ஐ internally பயன்படுத்தியதைப் போல, புதிய individual features-ன் design இறுதி நிலைக்கு நெருக்கமாக வந்தவுடன், stable version-இல் release ஆகும்முன் அவற்றை adopt செய்ய React community-க்கு ஒரு option வழங்க விரும்புகிறோம். புதிய அதிகாரப்பூர்வ support கொண்ட [Canary release channel](/community/versioning-policy#canary-channel)-ஐ அறிமுகப்படுத்துகிறோம். Frameworks போன்ற curated setups, individual React features adoption-ஐ React release schedule-இலிருந்து decouple செய்ய இதனால் முடியும்.

</Intro>

---

## tl;dr {/*tldr*/}

* React-க்காக அதிகாரப்பூர்வ support கொண்ட [Canary release channel](/community/versioning-policy#canary-channel)-ஐ அறிமுகப்படுத்துகிறோம். இது அதிகாரப்பூர்வமாக support செய்யப்படுவதால், regressions ஏதேனும் வந்தால் stable releases-இல் உள்ள bugs-க்கு அளிக்கும் அளவிலான urgency-யுடன் அவற்றை கையாளுவோம்.
* Individual புதிய React features semver-stable releases-இல் வருவதற்கு முன்பே அவற்றை பயன்படுத்த தொடங்க Canaries உதவும்.
* [Experimental](/community/versioning-policy#experimental-channel) channel-க்கு மாறாக, adoption-க்கு தயாராக உள்ளன என்று நாங்கள் நியாயமாக நம்பும் features மட்டுமே React Canaries-இல் சேர்க்கப்படும். Pinned Canary React releases-ஐ bundle செய்வதை frameworks பரிசீலிக்க ஊக்குவிக்கிறோம்.
* Breaking changes மற்றும் புதிய features Canary releases-இல் வரும் போதே அவற்றை எங்கள் blog-இல் அறிவிப்போம்.
* **எப்போதும் போல, ஒவ்வொரு Stable release-க்கும் React தொடர்ந்து semver-ஐப் பின்பற்றும்.**

## React features பொதுவாக எப்படி உருவாக்கப்படுகின்றன {/*how-react-features-are-usually-developed*/}

பொதுவாக, ஒவ்வொரு React feature-மும் இதே கட்டங்களைக் கடந்து வந்துள்ளது:

1. நாங்கள் ஒரு initial version உருவாக்கி அதற்கு `experimental_` அல்லது `unstable_` prefix சேர்ப்போம். அந்த feature `experimental` release channel-இல் மட்டுமே கிடைக்கும். இந்த கட்டத்தில் feature குறிப்பிடத்தக்க அளவு மாறும் என்று எதிர்பார்க்கப்படும்.
2. இந்த feature-ஐ test செய்து feedback வழங்க உதவ விரும்பும் ஒரு team-ஐ Meta-வில் கண்டுபிடிப்போம். இதனால் ஒரு சுற்று மாற்றங்கள் வரும். Feature மேலும் stable ஆகும் போது, அதை முயற்சிக்க Meta-வில் மேலும் பல teams உடன் பணியாற்றுவோம்.
3. இறுதியில் design மீது நம்பிக்கை வரும். API name-இலிருந்து prefix-ஐ அகற்றி, பெரும்பாலான Meta products பயன்படுத்தும் `main` branch-இல் அந்த feature-ஐ default-ஆக கிடைக்கச் செய்வோம். இந்த கட்டத்தில் Meta-வில் எந்த team-மும் இந்த feature-ஐ பயன்படுத்தலாம்.
4. அந்த direction மீது நம்பிக்கை அதிகரிக்கும் போது, புதிய feature-க்கான RFC-யையும் post செய்வோம். இந்த கட்டத்தில் design பலவகை cases-க்கு வேலை செய்கிறது என்பதை அறிந்திருப்போம்; ஆனால் கடைசி நேரத்தில் சில adjustments செய்யலாம்.
5. Open source release வெட்டுவதற்கு நெருக்கமாக இருக்கும் போது, அந்த feature-க்கான documentation எழுதுவோம்; இறுதியில் stable React release-இல் அந்த feature-ஐ release செய்வோம்.

இதுவரை release செய்த பெரும்பாலான features-க்கு இந்த playbook நன்றாக வேலை செய்தது. ஆனால் feature பொதுவாக பயன்படுத்த தயாராகும் நேரம் (step 3) மற்றும் open source-இல் release ஆகும் நேரம் (step 5) இடையே குறிப்பிடத்தக்க இடைவெளி இருக்கலாம்.

**Meta பின்பற்றும் அதே அணுகுமுறையை React community-க்கும் option ஆக வழங்கி, React-ன் அடுத்த release cycle-க்காக காத்திருக்காமல் individual புதிய features கிடைக்கும் போதே அவற்றை முன்கூட்டியே adopt செய்ய உதவ விரும்புகிறோம்.**

எப்போதும் போல, எல்லா React features-மும் இறுதியில் Stable release-க்கு வரும்.

## இன்னும் அதிக minor releases செய்தால் போதாதா? {/*can-we-just-do-more-minor-releases*/}

பொதுவாக, புதிய features அறிமுகப்படுத்த minor releases-ஐ நாங்கள் *பயன்படுத்துகிறோம்*.

ஆனால் இது எப்போதும் சாத்தியமில்லை. சில நேரங்களில் புதிய features இன்னும் முழுமையாக முடியாத, மேலும் நாங்கள் இன்னும் actively iterate செய்து கொண்டிருக்கும் *மற்ற* புதிய features உடன் தொடர்புடையதாக இருக்கும். அவற்றின் implementations தொடர்புடையவை என்பதால் தனியாக release செய்ய முடியாது. அதே packages-ஐ (உதாரணமாக `react` மற்றும் `react-dom`) பாதிப்பதால் தனியாக version செய்ய முடியாது. மேலும் இன்னும் தயாராகாத பகுதிகளில் iterate செய்யும் திறனை வைத்திருக்க வேண்டும்; semver படி செய்வதானால் பல major version releases தேவைப்படும்.

Meta-வில், React-ஐ `main` branch-இலிருந்து build செய்து, ஒவ்வொரு வாரமும் ஒரு குறிப்பிட்ட pinned commit-க்கு manually update செய்வதன் மூலம் இந்த பிரச்சினையை தீர்த்துள்ளோம். கடந்த பல ஆண்டுகளாக React Native releases பின்பற்றும் அணுகுமுறையும் இதுவே. React Native-ன் ஒவ்வொரு *stable* release-மும் React repository-ன் `main` branch-இலிருந்து ஒரு குறிப்பிட்ட commit-க்கு pinned ஆக இருக்கும். இதனால் React Native, உலகளாவிய React release schedule-க்கு tightly coupled ஆகாமல், முக்கிய bugfixes-ஐ சேர்த்து framework level-இல் புதிய React features-ஐ incrementally adopt செய்ய முடியும்.

இந்த workflow-ஐ மற்ற frameworks மற்றும் curated setups-க்கும் கிடைக்கச் செய்ய விரும்புகிறோம். உதாரணமாக, React *மேல் கட்டப்பட்ட* framework, ஒரு React-related breaking change stable React release-இல் சேர்வதற்கு *முன்பே* அதை சேர்க்க முடியும். சில breaking changes framework integrations-ஐ மட்டும் பாதிப்பதால் இது குறிப்பாக பயனுள்ளது. இதனால் ஒரு framework semver-ஐ உடைக்காமல், அத்தகைய மாற்றத்தை அதன் சொந்த minor version-இல் release செய்ய முடியும்.

Canaries channel உடன் rolling releases வைத்திருப்பது, எங்களுக்கு tighter feedback loop அளித்து, புதிய features community-யில் comprehensive testing பெறுவதை உறுதி செய்யும். இந்த workflow, JavaScript standards committee ஆன TC39 [numbered stages-இல் changes-ஐ கையாளும் விதத்திற்கு](https://tc39.es/process-document/) நெருக்கமாக உள்ளது. புதிய JavaScript features specification-ன் பகுதியாக அதிகாரப்பூர்வமாக ratify ஆகும்முன் browsers-இல் ship ஆகுவது போலவே, புதிய React features React stable release-க்கு முன்பே React-இல் கட்டப்பட்ட frameworks-இல் கிடைக்கலாம்.

## அதற்கு பதிலாக experimental releases ஏன் பயன்படுத்தக்கூடாது? {/*why-not-use-experimental-releases-instead*/}

Technically [Experimental releases](/community/versioning-policy#canary-channel)-ஐ நீங்கள் பயன்படுத்த *முடியும்* என்றாலும், அவற்றை production-இல் பயன்படுத்த வேண்டாம் என்று பரிந்துரைக்கிறோம்; ஏனெனில் experimental APIs stabilization நோக்கி செல்லும் வழியில் குறிப்பிடத்தக்க breaking changes-ஐ சந்திக்கலாம் (அல்லது முற்றிலுமாக அகற்றப்படலாம்). Canaries-லும் எந்த release போலவே தவறுகள் இருக்கலாம்; இருந்தாலும் இனிமேல் Canaries-இல் வரும் முக்கிய breaking changes-ஐ எங்கள் blog-இல் அறிவிக்க திட்டமிட்டுள்ளோம். Canaries, Meta internally run செய்யும் code-க்கு மிக அருகிலுள்ளது; எனவே அவை பொதுவாக ஒப்பீட்டளவில் stable இருக்கும் என்று எதிர்பார்க்கலாம். ஆனால் version-ஐ pinned ஆக வைத்திருப்பதும், pinned commits இடையே update செய்யும்போது GitHub commit log-ஐ manually scan செய்வதும் அவசியம்.

**Framework போன்ற curated setup-க்கு வெளியே React பயன்படுத்தும் பெரும்பாலானோர் Stable releases-ஐ தொடர்ந்து பயன்படுத்த விரும்புவார்கள் என்று எதிர்பார்க்கிறோம்.** ஆனால் நீங்கள் framework உருவாக்கினால், ஒரு குறிப்பிட்ட commit-க்கு pinned ஆன React Canary version-ஐ bundle செய்து, உங்கள் சொந்த வேகத்தில் update செய்வதை பரிசீலிக்கலாம். இதன் நன்மை: கடந்த சில ஆண்டுகளாக React Native செய்து வருவது போல, முடிந்த individual React features மற்றும் bugfixes-ஐ உங்கள் users-க்கு முன்கூட்டியே, உங்கள் release schedule-இல் ship செய்ய முடியும். குறை: எந்த React commits உள்ளே வருகிறது என்பதை review செய்வதும், உங்கள் releases-இல் எந்த React changes சேர்க்கப்பட்டுள்ளன என்பதை users-க்கு communicate செய்வதும் கூடுதல் பொறுப்பாகும்.

நீங்கள் framework author ஆக இருந்து இந்த அணுகுமுறையை முயற்சிக்க விரும்பினால், தயவுசெய்து எங்களைத் தொடர்புகொள்ளுங்கள்.

## Breaking changes மற்றும் புதிய features-ஐ முன்கூட்டியே அறிவித்தல் {/*announcing-breaking-changes-and-new-features-early*/}

எந்த நேரத்திலும் அடுத்த stable React release-க்குள் என்ன சேரும் என்பதற்கான எங்களின் சிறந்த கணிப்பை Canary releases பிரதிநிதித்துவப்படுத்துகின்றன.

பாரம்பரியமாக, release cycle-ன் *இறுதியில்* (major release செய்யும் போது) மட்டுமே breaking changes-ஐ அறிவித்தோம். இப்போது Canary releases React-ஐ consume செய்ய அதிகாரப்பூர்வ support கொண்ட வழியாக இருப்பதால், Canaries-இல் breaking changes மற்றும் முக்கிய புதிய features *வரும் போதே* அவற்றை அறிவிக்கும் திசைக்கு நகர திட்டமிட்டுள்ளோம். உதாரணமாக, Canary-யில் வெளியேறும் breaking change ஒன்றை merge செய்தால், தேவையானால் codemods மற்றும் migration instructions உடன் React blog-இல் அதைப் பற்றி post எழுதுவோம். பிறகு, அந்த change-ஐ சேர்க்க pinned React canary-ஐ update செய்து major release வெட்டும் framework author நீங்கள் என்றால், உங்கள் release notes-இலிருந்து எங்கள் blog post-க்கு link செய்யலாம். இறுதியில், React-ன் stable major version தயாரானபோது, ஏற்கனவே வெளியிடப்பட்ட அந்த blog posts-க்கு link செய்வோம்; இது எங்கள் team வேகமாக முன்னேற உதவும் என்று நம்புகிறோம்.

APIs Canaries-இல் வரும் போதே அவற்றை document செய்ய திட்டமிட்டுள்ளோம்; அந்த APIs இன்னும் Canaries-க்கு வெளியே கிடைக்காவிட்டாலும். Canaries-இல் மட்டும் கிடைக்கும் APIs, தொடர்புடைய pages-இல் special note மூலம் குறிக்கப்படும். இதில் [`use`](https://github.com/reactjs/rfcs/pull/229) போன்ற APIs, மேலும் RFCs அனுப்பவுள்ள `cache` மற்றும் `createServerContext` போன்ற சில APIs அடங்கும்.

## Canaries pinned ஆக இருக்க வேண்டும் {/*canaries-must-be-pinned*/}

உங்கள் app அல்லது framework-க்காக Canary workflow-ஐ adopt செய்ய முடிவு செய்தால், நீங்கள் பயன்படுத்தும் Canary-ன் *exact* version-ஐ எப்போதும் pin செய்கிறீர்கள் என்பதை உறுதி செய்யுங்கள். Canaries pre-releases என்பதால், அவற்றில் இன்னும் breaking changes இருக்கலாம்.

## உதாரணம்: React Server Components {/*example-react-server-components*/}

[மார்ச் மாதம் அறிவித்தபடி](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), React Server Components conventions இறுதி செய்யப்பட்டுள்ளன; அவற்றின் user-facing API contract தொடர்பாக குறிப்பிடத்தக்க breaking changes எதிர்பார்க்கவில்லை. இருப்பினும் React-ன் stable version-இல் React Server Components support-ஐ இன்னும் release செய்ய முடியாது; ஏனெனில் [asset loading](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading) போன்ற பல ஒன்றோடொன்று தொடர்புடைய framework-only features-இல் இன்னும் பணியாற்றுகிறோம், மேலும் அங்கு breaking changes வரும் என்று எதிர்பார்க்கிறோம்.

இதன் பொருள் React Server Components-ஐ frameworks adopt செய்ய தயாராக உள்ளன. ஆனால் அடுத்த major React release வரும்வரை, framework அவற்றை adopt செய்ய ஒரே வழி React-ன் pinned Canary version-ஐ ship செய்வதே. (React-ன் இரண்டு copies bundle ஆகாமல் இருக்க, இதைச் செய்ய விரும்பும் frameworks, தங்கள் framework உடன் ship செய்யும் pinned Canary-க்கு `react` மற்றும் `react-dom` resolution-ஐ enforce செய்ய வேண்டும்; அதை தங்கள் users-க்கு விளக்க வேண்டும். உதாரணமாக, Next.js App Router இதையே செய்கிறது.)

## Stable மற்றும் Canary versions இரண்டிற்கும் எதிராக libraries-ஐ test செய்தல் {/*testing-libraries-against-both-stable-and-canary-versions*/}

ஒவ்வொரு Canary release-யையும் library authors test செய்வார்கள் என்று எதிர்பார்க்கவில்லை; அது மிகவும் கடினமாக இருக்கும். ஆனால், [மூன்று ஆண்டுகள் முன்பு வேறு React pre-release channels-ஐ முதலில் அறிமுகப்படுத்தியபோது](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html) செய்தது போல, latest Stable மற்றும் latest Canary versions *இரண்டிற்கும்* எதிராக tests run செய்ய libraries-ஐ ஊக்குவிக்கிறோம். அறிவிக்கப்படாத behavior மாற்றம் ஒன்றைக் கண்டால், அதை diagnose செய்ய நாங்கள் உதவ React repository-யில் bug file செய்யுங்கள். இந்த நடைமுறை பரவலாக ஏற்றுக்கொள்ளப்படும் போது, accidental regressions அவை வரும் போதே கண்டுபிடிக்கப்படுவதால், libraries-ஐ React-ன் புதிய major versions-க்கு upgrade செய்ய தேவையான முயற்சி குறையும் என்று எதிர்பார்க்கிறோம்.

<Note>

கடுமையாகச் சொன்னால், Canary ஒரு *புதிய* release channel அல்ல; முன்பு அது Next என்று அழைக்கப்பட்டது. ஆனால் Next.js உடன் குழப்பம் வராமல் இருக்க அதை rename செய்ய முடிவு செய்தோம். Canaries என்பது React பயன்படுத்த அதிகாரப்பூர்வ support கொண்ட வழி போன்ற புதிய எதிர்பார்ப்புகளை communicate செய்ய, இதை *புதிய* release channel ஆக அறிவிக்கிறோம்.

</Note>

## Stable releases முன்பைப் போலவே செயல்படும் {/*stable-releases-work-like-before*/}

Stable React releases-க்கு எந்த மாற்றங்களையும் அறிமுகப்படுத்தவில்லை.

