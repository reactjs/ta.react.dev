---
title: "React 18-க்கான திட்டம்"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, மற்றும் Seth Webster
date: 2021/06/08
description: சில updates-ஐ பகிர React team மகிழ்ச்சியடைகிறது. எங்கள் அடுத்த major version ஆன React 18 release-க்கு வேலை தொடங்கியுள்ளோம். React 18-இல் வரும் புதிய அம்சங்களை படிப்படியாக ஏற்றுக்கொள்ள சமூகத்தைத் தயார்படுத்த Working Group ஒன்றை உருவாக்கியுள்ளோம். Library authors அதை முயற்சி செய்து feedback வழங்க React 18 Alpha-வை வெளியிட்டுள்ளோம்...
---

June 8, 2021 அன்று [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Seth Webster](https://twitter.com/sethwebster) எழுதியது

---

<Intro>

சில updates-ஐ பகிர React team மகிழ்ச்சியடைகிறது:

1. எங்கள் அடுத்த major version ஆன React 18 release-க்கு வேலை தொடங்கியுள்ளோம்.
2. React 18-இல் வரும் புதிய அம்சங்களை படிப்படியாக ஏற்றுக்கொள்ள சமூகத்தைத் தயார்படுத்த Working Group ஒன்றை உருவாக்கியுள்ளோம்.
3. Library authors அதை முயற்சி செய்து feedback வழங்க React 18 Alpha-வை வெளியிட்டுள்ளோம்.

இந்த updates முதன்மையாக third-party libraries-இன் maintainers-க்காக உள்ளன. நீங்கள் React-ஐ கற்றுக்கொண்டு இருக்கிறீர்களானாலும், கற்பிக்கிறீர்களானாலும், அல்லது user-facing applications உருவாக்க பயன்படுத்துகிறீர்களானாலும், இந்த post-ஐ பாதுகாப்பாக புறக்கணிக்கலாம். ஆனால் ஆர்வமிருந்தால் React 18 Working Group-இல் உள்ள விவாதங்களைப் பின்தொடரலாம்!

---

</Intro>

## React 18-இல் என்ன வருகிறது {/*whats-coming-in-react-18*/}

Release ஆகும் போது, React 18-இல் out-of-the-box மேம்பாடுகள் ([automatic batching](https://github.com/reactwg/react-18/discussions/21) போன்றவை), புதிய API-கள் ([`startTransition`](https://github.com/reactwg/react-18/discussions/41) போன்றவை), மற்றும் `React.lazy`-க்கு built-in ஆதரவு கொண்ட [புதிய streaming server renderer](https://github.com/reactwg/react-18/discussions/37) இருக்கும்.

React 18-இல் சேர்க்கும் புதிய opt-in mechanism காரணமாக இந்த அம்சங்கள் சாத்தியமாகின்றன. அது “concurrent rendering” என்று அழைக்கப்படுகிறது; React ஒரே நேரத்தில் UI-யின் பல versions-ஐத் தயாரிக்க இது உதவுகிறது. இந்த மாற்றம் பெரும்பாலும் பின்னணியில் இருக்கும், ஆனால் உங்கள் app-இன் உண்மையான செயல்திறனையும் user உணரும் செயல்திறனையும் மேம்படுத்த புதிய வாய்ப்புகளைத் திறக்கிறது.

React-இன் எதிர்காலம் குறித்த எங்கள் ஆராய்ச்சியை நீங்கள் பின்தொடர்ந்து இருந்தால் (அதை எதிர்பார்ப்பதில்லை!), “concurrent mode” என்று ஒன்றைப் பற்றியோ அது உங்கள் app-ஐ உடைக்கலாம் என்பதையோ கேட்டிருக்கலாம். சமூகத்திலிருந்து வந்த இந்த feedback-க்கு பதிலாக, படிப்படியாக ஏற்றுக்கொள்ளும் upgrade strategy-ஐ மறுவடிவமைத்துள்ளோம். எல்லாவற்றையும் ஒரே நேரத்தில் மாற்ற வேண்டிய “mode” ஆக இல்லாமல், புதிய அம்சங்களில் ஒன்றால் trigger செய்யப்படும் updates-க்கு மட்டுமே concurrent rendering enable செய்யப்படும். நடைமுறையில் இதன் பொருள்: **rewrites இல்லாமல் React 18-ஐ ஏற்றுக்கொண்டு, புதிய அம்சங்களை உங்கள் வேகத்தில் முயற்சி செய்ய முடியும்.**

## படிப்படியான ஏற்றுக்கொள்ளும் strategy {/*a-gradual-adoption-strategy*/}

React 18-இல் concurrency opt-in ஆக இருப்பதால், component behavior-க்கு குறிப்பிடத்தக்க out-of-the-box breaking changes இல்லை. **சாதாரண major React release-க்கு ஒத்த முயற்சியிலேயே, உங்கள் application code-இல் குறைந்த மாற்றங்களோ மாற்றமே இல்லாமலோ React 18-க்கு upgrade செய்ய முடியும்**. பல apps-ஐ React 18-க்கு மாற்றிய எங்கள் அனுபவத்தின் அடிப்படையில், பல users ஒரு பிற்பகலுக்குள் upgrade செய்ய முடியும் என்று எதிர்பார்க்கிறோம்.

Facebook-இல் ஆயிரக்கணக்கான components-க்கு concurrent features-ஐ வெற்றிகரமாக ship செய்துள்ளோம்; எங்கள் அனுபவத்தில், பெரும்பாலான React components கூடுதல் மாற்றங்கள் இல்லாமல் “அப்படியே வேலை செய்கின்றன” என்று கண்டறிந்துள்ளோம். முழு சமூகத்திற்கும் இது smooth upgrade ஆக இருப்பதை உறுதிசெய்ய நாங்கள் உறுதியாக உள்ளோம்; அதனால் இன்று React 18 Working Group-ஐ அறிவிக்கிறோம்.

## சமூகத்துடன் பணிபுரிதல் {/*working-with-the-community*/}

இந்த release-க்காக புதிதாக ஒன்றை முயற்சி செய்கிறோம்: React சமூகத்தின் பல பகுதிகளிலிருந்து experts, developers, library authors, மற்றும் educators கொண்ட குழுவை feedback வழங்க, கேள்விகள் கேட்க, release-இல் இணைந்து பணியாற்ற எங்கள் [React 18 Working Group](https://github.com/reactwg/react-18)-இல் பங்கேற்க அழைத்துள்ளோம். இந்த தொடக்க சிறிய குழுவுக்கு அழைக்க விரும்பிய அனைவரையும் அழைக்க முடியவில்லை; ஆனால் இந்த முயற்சி நன்றாக செயல்பட்டால், எதிர்காலத்தில் மேலும் பலர் இருப்பார்கள் என்று நம்புகிறோம்!

**இருக்கும் applications மற்றும் libraries React 18-ஐ smooth ஆகவும் படிப்படியாகவும் ஏற்றுக்கொள்ள ecosystem-ஐத் தயார்படுத்துவதே React 18 Working Group-இன் குறிக்கோள்.** Working Group [GitHub Discussions](https://github.com/reactwg/react-18/discussions)-இல் hosted ஆக உள்ளது; public அதை வாசிக்கலாம். Working group உறுப்பினர்கள் feedback இடலாம், கேள்விகள் கேட்கலாம், ideas பகிரலாம். Core team எங்கள் research findings-ஐ பகிரவும் discussions repo-வைப் பயன்படுத்தும். Stable release நெருங்கும் போது, முக்கிய தகவல்கள் இந்த blog-இலும் வெளியிடப்படும்.

React 18-க்கு upgrade செய்வது பற்றிய கூடுதல் தகவல்களுக்கு, அல்லது release பற்றிய கூடுதல் resources-க்கு, [React 18 announcement post](https://github.com/reactwg/react-18/discussions/4)-ஐப் பார்க்கவும்.

## React 18 Working Group-ஐ அணுகுதல் {/*accessing-the-react-18-working-group*/}

[React 18 Working Group repo](https://github.com/reactwg/react-18)-இல் உள்ள discussions-ஐ அனைவரும் வாசிக்கலாம்.

Working Group-இல் ஆரம்பத்தில் பெரும் ஆர்வம் இருக்கும் என்று எதிர்பார்ப்பதால், invited members மட்டுமே threads உருவாக்கவோ comment செய்யவோ அனுமதிக்கப்படுவர். இருப்பினும், threads முழுவதும் public-க்கு தெரியும்; எனவே அனைவருக்கும் அதே தகவல் கிடைக்கும். Working group உறுப்பினர்களுக்கு productive environment உருவாக்குவதற்கும், பெரிய சமூகத்துடன் transparency வைத்திருப்பதற்கும் இடையிலான நல்ல சமநிலை இது என்று நாங்கள் நம்புகிறோம்.

எப்போதும் போல, bug reports, கேள்விகள், மற்றும் பொதுவான feedback-ஐ எங்கள் [issue tracker](https://github.com/facebook/react/issues)-இல் submit செய்யலாம்.

## இன்று React 18 Alpha-வை முயற்சி செய்வது எப்படி {/*how-to-try-react-18-alpha-today*/}

புதிய alphas [`@alpha` tag பயன்படுத்தி npm-க்கு சீராக publish செய்யப்படுகின்றன](https://github.com/reactwg/react-18/discussions/9). இந்த releases எங்கள் main repo-வின் சமீபத்திய commit கொண்டு build செய்யப்படுகின்றன. ஒரு feature அல்லது bugfix merge செய்யப்பட்டால், அடுத்த வேலை நாளில் அது alpha-வில் தோன்றும்.

Alpha releases இடையே குறிப்பிடத்தக்க behavioral அல்லது API மாற்றங்கள் இருக்கலாம். **User-facing, production applications-க்கு alpha releases பரிந்துரைக்கப்படவில்லை** என்பதை நினைவில் கொள்ளுங்கள்.

## React 18 release-க்கான எதிர்பார்க்கப்படும் timeline {/*projected-react-18-release-timeline*/}

குறிப்பிட்ட release date இன்னும் schedule செய்யப்படவில்லை; ஆனால் பெரும்பாலான production applications-க்கு React 18 தயாராகும் முன் பல மாதங்கள் feedback மற்றும் iteration தேவைப்படும் என்று எதிர்பார்க்கிறோம்.

* Library Alpha: இன்று கிடைக்கிறது
* Public Beta: குறைந்தது பல மாதங்கள்
* Release Candidate (RC): Beta-க்கு பிறகு குறைந்தது பல வாரங்கள்
* General Availability: RC-க்கு பிறகு குறைந்தது பல வாரங்கள்

எங்கள் எதிர்பார்க்கப்படும் release timeline பற்றிய கூடுதல் விவரங்கள் [Working Group-இல் கிடைக்கின்றன](https://github.com/reactwg/react-18/discussions/9). Public release நெருங்கும் போது இந்த blog-இல் updates post செய்வோம்.
