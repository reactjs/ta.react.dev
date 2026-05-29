---
title: "React Compiler Beta வெளியீடு"
author: Lauren Tan
date: 2024/10/21
description: React Conf 2024-இல், automatic memoization மூலம் உங்கள் React app-ஐ optimize செய்யும் build-time tool ஆன React Compiler-ன் experimental release-ஐ அறிவித்தோம். இந்த post-இல், open source-க்கான அடுத்த படி மற்றும் compiler-இல் எங்கள் முன்னேற்றத்தை பகிர விரும்புகிறோம்.

---

October 21, 2024 by [Lauren Tan](https://twitter.com/potetotes).

---

<Note>

### React Compiler இப்போது RC-யில் உள்ளது! {/*react-compiler-is-now-in-rc*/}

விவரங்களுக்கு [stable release blog post](/blog/2025/10/07/react-compiler-1)-ஐ பார்க்கவும்.

</Note>

<Intro>

புதிய updates-ஐ பகிர React team உற்சாகமாக உள்ளது:

</Intro>

1. Early adopters மற்றும் library maintainers முயற்சித்து feedback வழங்க, இன்று React Compiler Beta-ஐ publish செய்கிறோம்.
2. Optional `react-compiler-runtime` package மூலம், React 17+ apps-க்கு React Compiler-ஐ அதிகாரப்பூர்வமாக support செய்கிறோம்.
3. Compiler-ஐ gradual-ஆக adopt செய்ய community-யைத் தயாரிக்க, [React Compiler Working Group](https://github.com/reactwg/react-compiler)-ன் public membership-ஐ திறக்கிறோம்.

---

[React Conf 2024](/blog/2024/05/22/react-conf-2024-recap)-இல், automatic memoization மூலம் உங்கள் React app-ஐ optimize செய்யும் build-time tool ஆன React Compiler-ன் experimental release-ஐ அறிவித்தோம். [React Compiler அறிமுகத்தை இங்கே காணலாம்](/learn/react-compiler).

முதல் release-க்கு பிறகு, React community report செய்த பல bugs-ஐ சரிசெய்தோம்; compiler-க்கு பல உயர்தர bug fixes மற்றும் contributions[^1] கிடைத்தன; JavaScript patterns-ன் பரந்த diversity-க்கு compiler-ஐ இன்னும் resilient ஆக்கினோம்; மேலும் Meta-வில் compiler-ஐ மேலும் பரவலாக roll out செய்து வருகிறோம்.

இந்த post-இல், React Compiler-க்கு அடுத்தது என்ன என்பதை பகிர விரும்புகிறோம்.

## React Compiler Beta-ஐ இன்றே முயற்சிக்கவும் {/*try-react-compiler-beta-today*/}

[React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg)-இல், React Compiler பற்றிய update-ஐ பகிர்ந்தோம். இன்று React Compiler மற்றும் ESLint plugin-ன் புதிய Beta release-ஐ அறிவிப்பதில் உற்சாகமாக உள்ளோம். புதிய betas `@beta` tag பயன்படுத்தி npm-க்கு publish செய்யப்படுகின்றன.

React Compiler Beta install செய்ய:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

அல்லது, நீங்கள் Yarn பயன்படுத்தினால்:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

React India-வில் [Sathya Gunasekaran](https://twitter.com/_gsathya) வழங்கிய talk-ஐ இங்கே பார்க்கலாம்:

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## அனைவரும் React Compiler linter-ஐ இன்றே பயன்படுத்த பரிந்துரைக்கிறோம் {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

React Compiler-ன் ESLint plugin, [Rules of React](/reference/rules) violations-ஐ proactive-ஆக identify செய்து correct செய்ய developers-க்கு உதவுகிறது. **அனைவரும் linter-ஐ இன்றே பயன்படுத்த வேண்டும் என்று வலுவாக பரிந்துரைக்கிறோம்**. Linter பயன்படுத்த compiler installed ஆக இருக்க வேண்டியதில்லை; எனவே compiler முயற்சிக்க இன்னும் தயாராக இல்லாவிட்டாலும், அதை independent-ஆக பயன்படுத்தலாம்.

Linter மட்டும் install செய்ய:

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

அல்லது, நீங்கள் Yarn பயன்படுத்தினால்:

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Installation-க்கு பிறகு, [உங்கள் ESLint config-இல் அதை சேர்த்து](/learn/react-compiler/installation#eslint-integration) linter-ஐ enable செய்யலாம். Linter பயன்படுத்துவது Rules of React breakages-ஐ identify செய்ய உதவும்; compiler முழுமையாக release ஆனபோது அதை adopt செய்வதும் மேம்படும்.

## பின்னோக்கி compatibility {/*backwards-compatibility*/}

React Compiler, React 19-இல் சேர்க்கப்பட்ட runtime APIs மீது சார்ந்த code உருவாக்குகிறது; ஆனால் compiler React 17 மற்றும் 18 உடனும் வேலை செய்ய support சேர்த்துள்ளோம். நீங்கள் இன்னும் React 19-இல் இல்லாவிட்டால், Beta release-இல் உங்கள் compiler config-இல் minimum `target` குறிப்பிடியும், `react-compiler-runtime`-ஐ dependency ஆக சேர்த்தும் React Compiler-ஐ முயற்சிக்கலாம். [இதற்கான docs-ஐ இங்கே காணலாம்](/reference/react-compiler/configuration#react-17-18).

## Libraries-இல் React Compiler பயன்படுத்துதல் {/*using-react-compiler-in-libraries*/}

எங்கள் initial release, applications-இல் compiler பயன்படுத்தும்போது வரும் முக்கிய issues-ஐ identify செய்வதில் கவனம் செலுத்தியது. அதன் பிறகு சிறந்த feedback கிடைத்துள்ளது; compiler-ஐ குறிப்பிடத்தக்க அளவில் மேம்படுத்தியுள்ளோம். இப்போது community-யிலிருந்து broad feedback பெறவும், performance மற்றும் உங்கள் library maintain செய்யும் developer experience-ஐ மேம்படுத்த library authors compiler-ஐ முயற்சிக்கவும் தயாராக உள்ளோம்.

React Compiler-ஐ libraries compile செய்யவும் பயன்படுத்தலாம். எந்த code transformations-க்கும் முன் original source code மீது React Compiler run ஆக வேண்டும். எனவே ஒரு application-ன் build pipeline, அது பயன்படுத்தும் libraries-ஐ compile செய்வது சாத்தியமில்லை. ஆகவே library maintainers தங்கள் libraries-ஐ compiler கொண்டு independent-ஆக compile செய்து test செய்து, compiled code-ஐ npm-க்கு ship செய்ய பரிந்துரைக்கிறோம்.

உங்கள் code pre-compiled ஆக இருப்பதால், உங்கள் library-க்கு apply செய்யப்பட்ட automatic memoization-ன் பயனை பெற உங்கள் library users compiler enable செய்திருக்க தேவையில்லை. உங்கள் library இன்னும் React 19-இல் இல்லாத apps-ஐ target செய்தால், minimum `target` குறிப்பிடவும்; `react-compiler-runtime`-ஐ direct dependency ஆக சேர்க்கவும். Runtime package, application version-ஐப் பொறுத்து APIs-ன் சரியான implementation-ஐப் பயன்படுத்தும்; தேவையானால் missing APIs-ஐ polyfill செய்யும்.

[இதற்கான கூடுதல் docs-ஐ இங்கே காணலாம்.](/reference/react-compiler/compiling-libraries)

## React Compiler Working Group-ஐ அனைவருக்கும் திறத்தல் {/*opening-up-react-compiler-working-group-to-everyone*/}

Compiler-ன் experimental release மீது feedback வழங்க, கேள்விகள் கேட்க, மற்றும் collaborate செய்ய invite-only [React Compiler Working Group](https://github.com/reactwg/react-compiler)-ஐ முன்பு React Conf-இல் அறிவித்தோம்.

இன்றிலிருந்து, React Compiler Beta release உடன், Working Group membership-ஐ அனைவருக்கும் திறக்கிறோம். Existing applications மற்றும் libraries React Compiler-ஐ smooth மற்றும் gradual-ஆக adopt செய்ய ecosystem-ஐ தயார்படுத்துவதே React Compiler Working Group-ன் இலக்கு. Bug reports-ஐ தொடர்ந்து [React repo](https://github.com/facebook/react)-இல் file செய்யுங்கள்; ஆனால் feedback வழங்க, கேள்விகள் கேட்க, அல்லது ideas பகிர [Working Group discussion forum](https://github.com/reactwg/react-compiler/discussions)-ஐ பயன்படுத்துங்கள்.

எங்கள் research findings-ஐ பகிர core team இந்த discussions repo-வையும் பயன்படுத்தும். Stable Release நெருங்கும் போது, முக்கியமான தகவல்களும் இந்த forum-இல் post செய்யப்படும்.

## React Compiler at Meta {/*react-compiler-at-meta*/}

[React Conf](/blog/2024/05/22/react-conf-2024-recap)-இல், Quest Store மற்றும் Instagram-இல் compiler rollout வெற்றிகரமாக இருந்தது என்று பகிர்ந்தோம். அதன் பிறகு, [Facebook](https://www.facebook.com) மற்றும் [Threads](https://www.threads.net) உட்பட Meta-வின் மேலும் பல major web apps முழுவதும் React Compiler-ஐ deploy செய்துள்ளோம். அதாவது, சமீபத்தில் இவற்றில் ஏதேனும் app பயன்படுத்தியிருந்தால், உங்கள் experience compiler மூலம் powered ஆகியிருக்கலாம். 100,000-க்கும் மேற்பட்ட React components கொண்ட monorepo-வில், குறைந்த code changes மட்டுமே தேவைப்பட்டு இந்த apps-ஐ compiler-க்கு onboard செய்ய முடிந்தது.

இந்த apps அனைத்திலும் குறிப்பிடத்தக்க performance improvements-ஐ பார்த்துள்ளோம். Rollout செய்தபோது, [ReactConf-இல் முன்பு பகிர்ந்த wins](https://youtu.be/lyEKhv8-3n0?t=3223) அளவிலான results தொடர்ந்து கிடைக்கின்றன. இந்த apps பல ஆண்டுகளாக Meta engineers மற்றும் React experts மூலம் ஏற்கனவே பெரிதும் hand-tuned மற்றும் optimized செய்யப்பட்டுள்ளன; எனவே சில percent அளவிலான improvements கூட எங்களுக்கு பெரிய வெற்றி.

React Compiler மூலம் developer productivity-யிலும் wins கிடைக்கும் என்று எதிர்பார்த்தோம். இதை measure செய்ய, productivity மீது manual memoization ஏற்படுத்தும் தாக்கத்தை ஆழமான statistical analysis செய்ய Meta-வில் எங்கள் data science partners[^2] உடன் collaborate செய்தோம். Meta-வில் compiler rollout செய்வதற்கு முன், React pull requests-இல் சுமார் 8% மட்டும் manual memoization பயன்படுத்தின; அந்த pull requests author செய்ய 31-46% கூடுதல் நேரம் எடுத்தன[^3] என்பதை கண்டோம். Manual memoization cognitive overhead கொண்டு வருகிறது என்ற எங்கள் intuition இதனால் உறுதியாகியது; React Compiler இன்னும் efficient code authoring மற்றும் review-க்கு வழிவகுக்கும் என்று எதிர்பார்க்கிறோம். குறிப்பிடத்தக்கது: developers explicit-ஆக memoization apply செய்யும் (எங்கள் case-இல்) 8% மட்டுமல்லாமல், *அனைத்து* code-மும் default-ஆக memoized ஆக இருப்பதை React Compiler உறுதி செய்கிறது.

## Stable நோக்கிய roadmap {/*roadmap-to-stable*/}

*இது final roadmap அல்ல; மாற்றப்படலாம்.*

Beta release-க்கு பிறகு, Rules of React-ஐப் பின்பற்றும் பெரும்பாலான apps மற்றும் libraries compiler உடன் நன்றாக வேலை செய்கின்றன என்பது நிரூபிக்கப்பட்டதும், compiler-ன் Release Candidate-ஐ விரைவில் ship செய்ய எண்ணுகிறோம். Community-யிலிருந்து final feedback காலத்துக்கு பிறகு, compiler-க்கான Stable Release திட்டமிடுகிறோம். Stable Release React-க்கான புதிய அடித்தளத்தின் தொடக்கமாக இருக்கும்; எல்லா apps மற்றும் libraries compiler மற்றும் ESLint plugin பயன்படுத்த வலுவாக பரிந்துரைக்கப்படும்.

* ✅ Experimental: React Conf 2024-இல் release செய்யப்பட்டது; முதன்மையாக early adopters feedback-க்காக.
* ✅ Public Beta: பரந்த community feedback-க்காக இன்று கிடைக்கிறது.
* 🚧 Release Candidate (RC): Rules பின்பற்றும் பெரும்பாலான apps மற்றும் libraries-க்கு React Compiler issue இல்லாமல் வேலை செய்யும்.
* 🚧 General Availability: Community-யின் final feedback காலத்துக்குப் பிறகு.

இந்த releases, compiler statically analyze செய்த diagnostics-ஐ surface செய்யும் compiler-ன் ESLint plugin-யையும் கொண்டுள்ளன. Existing eslint-plugin-react-hooks plugin-ஐ compiler-ன் ESLint plugin உடன் combine செய்ய திட்டமிட்டுள்ளோம்; அதனால் ஒரு plugin மட்டும் install செய்தால் போதும்.

Stable-க்கு பிறகு, மேலும் compiler optimizations மற்றும் improvements சேர்க்க திட்டமிட்டுள்ளோம். Product code-இல் மிகக் குறைந்த அல்லது எந்த மாற்றமும் இல்லாமல், automatic memoization-க்கு தொடர்ச்சியான improvements மற்றும் முற்றிலும் புதிய optimizations இரண்டும் இதில் அடங்கும். Compiler-ன் ஒவ்வொரு புதிய release-க்கும் upgrade செய்வது straightforward ஆக இருக்க வேண்டும் என்பதே நோக்கம்; ஒவ்வொரு upgrade-மும் performance-ஐ தொடர்ந்து மேம்படுத்தி, பல்வகை JavaScript மற்றும் React patterns-ஐ இன்னும் சிறப்பாக கையாளும்.

இந்த process முழுவதும், React-க்கான IDE extension ஒன்றை prototype செய்யவும் திட்டமிட்டுள்ளோம். இது இன்னும் research-ன் மிகவும் ஆரம்ப நிலையில் உள்ளது; எனவே எதிர்கால React Labs blog post-இல் எங்கள் findings-ஐ மேலும் பகிர முடியும் என்று எதிர்பார்க்கிறோம்.

---

இந்த post-ஐ review செய்து edit செய்த [Sathya Gunasekaran](https://twitter.com/_gsathya), [Joe Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Alex Taylor](https://github.com/alexmckenley), [Jason Bonta](https://twitter.com/someextent), மற்றும் [Eli White](https://twitter.com/Eli_White)-க்கு நன்றி.

---

[^1]: Compiler-க்கு contributions செய்த [@nikeee](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anikeee), [@henryqdineen](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Ahenryqdineen), [@TrickyPi](https://github.com/facebook/react/pulls?q=is%3Apr+author%3ATrickyPi), மற்றும் பலருக்கு நன்றி.

[^2]: Meta-வில் React Compiler பற்றிய இந்த study-ஐ வழிநடத்தி, இந்த post-ஐ review செய்த [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09)-க்கு நன்றி.

[^3]: Author tenure, diff length/complexity, மற்றும் பிற potential confounding factors-ஐ control செய்த பிறகு.
