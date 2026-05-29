---
title: Versioning கொள்கை
---

<Intro>

React-ன் எல்லா stable builds-மும் உயர் நிலை testing-ஐ கடந்து semantic versioning (semver)-ஐப் பின்பற்றுகின்றன. Experimental features குறித்து early feedback ஊக்குவிக்க React unstable release channels-யையும் வழங்குகிறது. React releases-இலிருந்து என்ன எதிர்பார்க்கலாம் என்பதை இந்த page விவரிக்கிறது.

</Intro>

இந்த versioning policy, `react` மற்றும் `react-dom` போன்ற packages-க்கான version numbers-க்கு எங்கள் அணுகுமுறையை விவரிக்கிறது. முந்தைய releases பட்டியலுக்கு [Versions](/versions) page-ஐ பார்க்கவும்.

## Stable releases {/*stable-releases*/}

Stable React releases ("Latest" release channel என்றும் அழைக்கப்படும்) [semantic versioning (semver)](https://semver.org/) principles-ஐப் பின்பற்றுகின்றன.

அதாவது **x.y.z** என்ற version number-இல்:

* **Critical bug fixes** release செய்யும்போது, **z** number-ஐ மாற்றி **patch release** செய்கிறோம் (எ.கா. 15.6.2-இலிருந்து 15.6.3).
* **New features** அல்லது **non-critical fixes** release செய்யும்போது, **y** number-ஐ மாற்றி **minor release** செய்கிறோம் (எ.கா. 15.6.2-இலிருந்து 15.7.0).
* **Breaking changes** release செய்யும்போது, **x** number-ஐ மாற்றி **major release** செய்கிறோம் (எ.கா. 15.6.2-இலிருந்து 16.0.0).

Major releases புதிய features-யையும் கொண்டிருக்கலாம்; எந்த release-யும் bug fixes சேர்க்கலாம்.

Minor releases தான் மிகவும் பொதுவான release வகை.

எங்கள் users production-இல் React-ன் பழைய versions-ஐ தொடர்ந்து பயன்படுத்துகிறார்கள் என்பதை நாங்கள் அறிவோம். React-இல் security vulnerability பற்றி தெரிந்தால், அந்த vulnerability பாதிக்கும் அனைத்து major versions-க்கும் backported fix release செய்கிறோம்.

### Breaking changes {/*breaking-changes*/}

Breaking changes அனைவருக்கும் சிரமமாக இருப்பதால், major releases எண்ணிக்கையை குறைக்க முயற்சிக்கிறோம். உதாரணமாக, React 15 ஏப்ரல் 2016-இல், React 16 செப்டம்பர் 2017-இல், React 17 அக்டோபர் 2020-இல் release செய்யப்பட்டது.

அதற்கு பதிலாக, புதிய features-ஐ minor versions-இல் release செய்கிறோம். பெயர் சாதாரணமாக இருந்தாலும், minor releases பல நேரங்களில் majors-ஐ விட interesting மற்றும் compelling ஆக இருக்கும்.

### Commitment to stability {/*commitment-to-stability*/}

React காலப்போக்கில் மாறும்போது, புதிய features-ன் பயனைப் பெற தேவையான effort-ஐ குறைக்க முயற்சிக்கிறோம். சாத்தியமானால், பழைய API-ஐ தொடர்ந்து வேலை செய்ய வைத்திருப்போம்; அதை separate package-இல் வைக்க வேண்டியிருந்தாலும். உதாரணமாக, [mixins பல ஆண்டுகளாக discouraged செய்யப்பட்டுள்ளன](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html), ஆனால் அவை இன்றும் [create-react-class வழியாக](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) support செய்யப்படுகின்றன; பல codebases stable, legacy code-இல் அவற்றை தொடர்ந்து பயன்படுத்துகின்றன.

ஒரு million-க்கும் மேற்பட்ட developers React பயன்படுத்துகிறார்கள்; சேர்ந்து millions of components-ஐ maintain செய்கிறார்கள். Facebook codebase-இல் மட்டும் 50,000-க்கும் மேற்பட்ட React components உள்ளன. அதனால் React-ன் புதிய versions-க்கு upgrade செய்வதை நேரடியாக செய்ய வேண்டும்; migration path இல்லாமல் பெரிய changes செய்தால், மக்கள் பழைய versions-இல் சிக்கிக் கொள்வார்கள். இந்த upgrade paths-ஐ Facebook-இலேயே test செய்கிறோம்; 10 பேருக்கும் குறைவான எங்கள் team 50,000+ components-ஐ update செய்ய முடிந்தால், React பயன்படுத்தும் யாருக்கும் upgrade manageable ஆக இருக்கும் என்று நம்புகிறோம். பல cases-இல் component syntax upgrade செய்ய [automated scripts](https://github.com/reactjs/react-codemod) எழுதுகிறோம்; பின்னர் அனைவரும் பயன்படுத்த open-source release-இல் அவற்றை சேர்க்கிறோம்.

### Warnings மூலம் gradual upgrades {/*gradual-upgrades-via-warnings*/}

React-ன் development builds பல helpful warnings கொண்டுள்ளன. சாத்தியமான எல்லா நேரங்களிலும், எதிர்கால breaking changes-க்கான preparation ஆக warnings சேர்க்கிறோம். இதனால் latest release-இல் உங்கள் app-க்கு warnings இல்லையென்றால், அது அடுத்த major release உடன் compatible ஆக இருக்கும். இதனால் உங்கள் apps-ஐ ஒரே நேரத்தில் ஒரு component ஆக upgrade செய்யலாம்.

Development warnings உங்கள் app-ன் runtime behavior-ஐ பாதிக்காது. அதனால் development மற்றும் production builds இடையே உங்கள் app ஒரேபோல் behave செய்யும் என்று நம்பலாம்; வேறுபாடுகள் என்னவென்றால் production build warnings log செய்யாது, மேலும் அது அதிக efficient. (வேறுபாடு கவனித்தால் issue file செய்யுங்கள்.)

### எது breaking change ஆக கருதப்படும்? {/*what-counts-as-a-breaking-change*/}

பொதுவாக, கீழ்க்கண்ட changes-க்காக major version number-ஐ *bump செய்ய மாட்டோம்*:

* **Development warnings.** இவை production behavior-ஐ பாதிக்காததால், major versions இடையில் புதிய warnings சேர்க்கலாம் அல்லது existing warnings மாற்றலாம். உண்மையில், இதுவே upcoming breaking changes பற்றி நம்பகமாக warn செய்ய அனுமதிக்கிறது.
* **`unstable_`-ஆல் தொடங்கும் APIs.** இவை இன்னும் நம்பிக்கை பெறாத APIs கொண்ட experimental features ஆக வழங்கப்படுகின்றன. இவற்றை `unstable_` prefix உடன் release செய்வதால் வேகமாக iterate செய்து stable API-ஐ விரைவில் அடைய முடியும்.
* **React-ன் Alpha மற்றும் Canary versions.** புதிய features-ஐ early-ஆக test செய்ய alpha versions வழங்குகிறோம்; ஆனால் alpha period-இல் கற்றவற்றின் அடிப்படையில் changes செய்ய flexibility தேவை. இந்த versions பயன்படுத்தினால், stable release-க்கு முன் APIs மாறலாம் என்பதை கவனிக்கவும்.
* **Undocumented APIs மற்றும் internal data structures.** `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` அல்லது `__reactInternalInstance$uk43rzhitjg` போன்ற internal property names-ஐ access செய்தால் எந்த warranty-யும் இல்லை. நீங்கள் தனிப்பொறுப்பில் உள்ளீர்கள்.

இந்த policy pragmatic ஆக வடிவமைக்கப்பட்டுள்ளது: நிச்சயமாக, உங்களுக்கு தலைவலி தர விரும்பவில்லை. இந்த changes அனைத்திற்கும் major version bump செய்தால், மேலும் பல major versions release செய்ய வேண்டி, இறுதியில் community-க்கு versioning சிரமம் அதிகரிக்கும். React-ஐ மேம்படுத்த நாங்கள் விரும்பும் வேகத்தில் முன்னேற முடியாது என்பதையும் அதுவே குறிக்கும்.

அப்படியிருந்தாலும், இந்த பட்டியலில் உள்ள change ஒன்று community முழுவதும் பெரிய பிரச்சினைகளை ஏற்படுத்தும் என்று எதிர்பார்த்தால், gradual migration path வழங்க எங்களால் முடிந்ததைச் செய்வோம்.

### Minor release-இல் புதிய features இல்லை என்றால், அது patch அல்லாதது ஏன்? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

Minor release-இல் புதிய features இல்லாமலும் இருக்கலாம். [இதை semver அனுமதிக்கிறது](https://semver.org/#spec-item-7); அது **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."** என்று கூறுகிறது.

ஆனால் இத்தகைய releases patches ஆக version செய்யப்படாதது ஏன் என்ற கேள்வி எழுகிறது.

பதில்: React (அல்லது பிற software)-இல் எந்த change-க்கும் எதிர்பாராத விதமாக break ஆகும் சிறிய risk உண்டு. ஒரு bug-ஐ fix செய்யும் patch release தவறுதலாக வேறு bug ஒன்றை அறிமுகப்படுத்தும் scenario-வை கற்பனை செய்யுங்கள். இது developers-க்கு disruptive ஆக இருப்பதோடு, எதிர்கால patch releases மீதான நம்பிக்கையையும் பாதிக்கும். Original fix நடைமுறையில் அரிதாக சந்திக்கப்படும் bug-க்காக இருந்தால் இது குறிப்பாக வருந்தத்தக்கது.

React releases bugs இல்லாமல் இருக்க நாங்கள் நல்ல track record வைத்திருக்கிறோம்; ஆனால் patch releases-க்கு reliability bar இன்னும் அதிகம், ஏனெனில் பெரும்பாலான developers அவற்றை adverse consequences இல்லாமல் adopt செய்யலாம் என்று கருதுகிறார்கள்.

இந்த காரணங்களால், patch releases-ஐ மிகவும் critical bugs மற்றும் security vulnerabilities-க்காக மட்டுமே reserve செய்கிறோம்.

ஒரு release internal refactors, implementation details மாற்றங்கள், performance improvements, அல்லது minor bugfixes போன்ற non-essential changes கொண்டிருந்தால், புதிய features இல்லாவிட்டாலும் minor version-ஐ bump செய்வோம்.

## All release channels {/*all-release-channels*/}

Bug reports file செய்ய, pull requests open செய்ய, மற்றும் [RFCs submit செய்ய](https://github.com/reactjs/rfcs) வளர்ந்த open source community மீது React சார்ந்துள்ளது. Feedback ஊக்குவிக்க சில நேரங்களில் unreleased features கொண்ட React special builds-ஐ பகிர்கிறோம்.

<Note>

Frameworks, libraries, அல்லது developer tooling-இல் பணிபுரியும் developers-க்கு இந்த section மிகவும் தொடர்புடையது. User-facing applications build செய்ய React-ஐ முதன்மையாக பயன்படுத்தும் developers, எங்கள் prerelease channels பற்றி கவலைப்பட தேவையில்லை.

</Note>

React-ன் ஒவ்வொரு release channel-மும் தனித்த use case-க்காக வடிவமைக்கப்பட்டுள்ளது:

- [**Latest**](#latest-channel) stable, semver React releases-க்காக. npm-இலிருந்து React install செய்யும்போது கிடைப்பது இதுவே. இன்று நீங்கள் ஏற்கனவே பயன்படுத்தும் channel இதுதான். **React-ஐ நேரடியாக consume செய்யும் user-facing applications இந்த channel-ஐ பயன்படுத்துகின்றன.**
- [**Canary**](#canary-channel) React source code repository-ன் main branch-ஐ track செய்கிறது. இவற்றை அடுத்த semver release-க்கான release candidates போல நினைக்கலாம். **[Frameworks அல்லது பிற curated setups, pinned React version உடன் இந்த channel-ஐ பயன்படுத்தத் தேர்வு செய்யலாம்.](/blog/2023/05/03/react-canaries) React மற்றும் third party projects இடையிலான integration testing-க்கும் Canaries பயன்படுத்தலாம்.**
- [**Experimental**](#experimental-channel) stable releases-இல் இல்லாத experimental APIs மற்றும் features-ஐ கொண்டுள்ளது. இவையும் main branch-ஐ track செய்கின்றன; ஆனால் கூடுதல் feature flags turned on ஆக இருக்கும். Release ஆகும்முன் upcoming features முயற்சிக்க இதைப் பயன்படுத்தவும்.

அனைத்து releases-மும் npm-க்கு publish செய்யப்படுகின்றன; ஆனால் Latest மட்டும் semantic versioning பயன்படுத்துகிறது. Prereleases (Canary மற்றும் Experimental channels-இல் உள்ளவை) அவற்றின் contents hash மற்றும் commit date-இலிருந்து generated versions கொண்டிருக்கும்; உதாரணமாக Canary-க்கு `18.3.0-canary-388686f29-20230503`, Experimental-க்கு `0.0.0-experimental-388686f29-20230503`.

**Latest மற்றும் Canary channels இரண்டும் user-facing applications-க்கு அதிகாரப்பூர்வமாக support செய்யப்படுகின்றன; ஆனால் எதிர்பார்ப்புகள் வேறுபடும்**:

* Latest releases பாரம்பரிய semver model-ஐப் பின்பற்றுகின்றன.
* Canary releases [pinned ஆக இருக்க வேண்டும்](/blog/2023/05/03/react-canaries) மற்றும் breaking changes கொண்டிருக்கலாம். தங்கள் சொந்த release schedule-இல் புதிய React features மற்றும் bugfixes-ஐ gradual-ஆக release செய்ய விரும்பும் frameworks போன்ற curated setups-க்காக அவை உள்ளன.

Experimental releases testing purposes-க்காக மட்டும் வழங்கப்படுகின்றன; releases இடையே behavior மாறாது என்ற எந்த guarantee-யும் வழங்கவில்லை. Latest releases-க்கு நாங்கள் பயன்படுத்தும் semver protocol-ஐ அவை பின்பற்றுவதில்லை.

Stable releases-க்கு பயன்படுத்தும் அதே registry-க்கு prereleases publish செய்வதால், [unpkg](https://unpkg.com) மற்றும் [CodeSandbox](https://codesandbox.io) போன்ற npm workflow support செய்யும் பல tools-ன் பயனைப் பெற முடிகிறது.

### Latest channel {/*latest-channel*/}

Latest என்பது stable React releases-க்கு பயன்படுத்தப்படும் channel. இது npm-இல் உள்ள `latest` tag-க்கு தொடர்புடையது. உண்மையான users-க்கு ship செய்யப்படும் எல்லா React apps-க்கும் இது பரிந்துரைக்கப்படும் channel.

**எந்த channel பயன்படுத்த வேண்டும் என்று உறுதியாக தெரியாவிட்டால், அது Latest.** React-ஐ நேரடியாகப் பயன்படுத்தினால், நீங்கள் ஏற்கனவே இதையே பயன்படுத்துகிறீர்கள். Latest-க்கு வரும் updates மிகவும் stable இருக்கும் என்று எதிர்பார்க்கலாம். Versions [முன்பு விவரித்தபடி](#stable-releases) semantic versioning scheme-ஐப் பின்பற்றுகின்றன.

### Canary channel {/*canary-channel*/}

Canary channel என்பது React repository-ன் main branch-ஐ track செய்யும் prerelease channel. Canary channel-இல் உள்ள prereleases-ஐ Latest channel-க்கான release candidates ஆக பயன்படுத்துகிறோம். Canary-யை அதிகமாக update செய்யப்படும் Latest-ன் superset போல நினைக்கலாம்.

மிக சமீபத்திய Canary release மற்றும் மிக சமீபத்திய Latest release இடையிலான change அளவு, இரண்டு minor semver releases இடையே காணும் அளவிற்கு சுமார் சமமானது. இருப்பினும், **Canary channel semantic versioning-க்கு conform ஆகாது.** Canary channel-இல் successive releases இடையே அவ்வப்போது breaking changes எதிர்பார்க்க வேண்டும்.

**[Canary workflow](/blog/2023/05/03/react-canaries)-ஐ பின்பற்றாவிட்டால், user-facing applications-இல் prereleases-ஐ நேரடியாக பயன்படுத்த வேண்டாம்.**

Canary releases npm-இல் `canary` tag உடன் publish செய்யப்படுகின்றன. Versions build contents hash மற்றும் commit date-இலிருந்து generate செய்யப்படுகின்றன; எ.கா. `18.3.0-canary-388686f29-20230503`.

#### Integration testing-க்கு canary channel பயன்படுத்துதல் {/*using-the-canary-channel-for-integration-testing*/}

Canary channel, React மற்றும் பிற projects இடையிலான integration testing-க்கும் support தருகிறது.

React-க்கு வரும் எல்லா changes-மும் public release ஆகும்முன் extensive internal testing-ஐ கடக்கும். ஆனால் React ecosystem முழுவதும் பல environments மற்றும் configurations பயன்படுத்தப்படுகின்றன; அவற்றில் ஒவ்வொன்றுக்கும் எதிராக test செய்வது சாத்தியமில்லை.

நீங்கள் third party React framework, library, developer tool, அல்லது இதுபோன்ற infrastructure-type project-ன் author என்றால், மிக சமீபத்திய changes-க்கு எதிராக உங்கள் test suite-ஐ periodical-ஆக run செய்வதன் மூலம் உங்கள் users மற்றும் முழு React community-க்கு React stable ஆக இருக்க உதவலாம். ஆர்வமிருந்தால், இந்த படிகளைப் பின்பற்றவும்:

- உங்களுக்கு விருப்பமான continuous integration platform பயன்படுத்தி cron job அமைக்கவும். Cron jobs [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) மற்றும் [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) இரண்டாலும் support செய்யப்படுகின்றன.
- Cron job-இல், npm-இல் `canary` tag பயன்படுத்தி உங்கள் React packages-ஐ Canary channel-இல் உள்ள மிக சமீபத்திய React release-க்கு update செய்யவும். npm cli பயன்படுத்தி:

  ```console
  npm update react@canary react-dom@canary
  ```

  அல்லது yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Updated packages-க்கு எதிராக உங்கள் test suite-ஐ run செய்யவும்.
- எல்லாம் pass ஆனால் சிறப்பு! உங்கள் project அடுத்த minor React release உடன் வேலை செய்யும் என்று எதிர்பார்க்கலாம்.
- எதிர்பாராத விதமாக ஏதேனும் break ஆனால், [issue file செய்து](https://github.com/facebook/react/issues) எங்களுக்கு தெரிவிக்கவும்.

இந்த workflow-ஐ பயன்படுத்தும் project Next.js. உதாரணமாக அவர்களின் [CircleCI configuration](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml)-ஐ பார்க்கலாம்.

### Experimental channel {/*experimental-channel*/}

Canary போலவே, Experimental channel என்பது React repository-ன் main branch-ஐ track செய்யும் prerelease channel. Canary-க்கு மாறாக, Experimental releases இன்னும் wide release-க்கு தயாராகாத கூடுதல் features மற்றும் APIs கொண்டுள்ளன.

பொதுவாக Canary update-க்கு இணையாக Experimental update-மும் வரும். அவை அதே source revision அடிப்படையில் இருக்கும்; ஆனால் வேறு feature flags set பயன்படுத்தி build செய்யப்படும்.

Experimental releases, Canary மற்றும் Latest releases-ஐ விட குறிப்பிடத்தக்க அளவு வேறுபட்டிருக்கலாம். **User-facing applications-இல் Experimental releases பயன்படுத்த வேண்டாம்.** Experimental channel releases இடையே அடிக்கடி breaking changes எதிர்பார்க்க வேண்டும்.

Experimental releases npm-இல் `experimental` tag உடன் publish செய்யப்படுகின்றன. Versions build contents hash மற்றும் commit date-இலிருந்து generate செய்யப்படுகின்றன; எ.கா. `0.0.0-experimental-68053d940-20210623`.

#### Experimental release-க்குள் என்ன சேரும்? {/*what-goes-into-an-experimental-release*/}

Experimental features என்பது wider public-க்கு release செய்ய இன்னும் தயாராகாதவை; finalize ஆகும்முன் மிகவும் மாறக்கூடியவை. சில experiments ஒருபோதும் finalize ஆகாமல் இருக்கலாம்; proposed changes viable ஆக உள்ளனவா என்பதை test செய்வதற்காகத்தான் experiments வைத்துள்ளோம்.

உதாரணமாக, Hooks அறிவித்தபோது Experimental channel இருந்திருந்தால், Hooks Latest-இல் கிடைக்கும் சில வாரங்களுக்கு முன்பே Experimental channel-க்கு release செய்திருப்போம்.

Experimental-க்கு எதிராக integration tests run செய்வது பயனுள்ளதாக இருக்கலாம். அது உங்கள் விருப்பம். ஆனால் Experimental, Canary-யை விடவும் குறைவான stable என்பதை கவனிக்கவும். **Experimental releases இடையே எந்த stability-யையும் guarantee செய்யவில்லை.**

#### Experimental features பற்றி மேலும் எப்படி அறியலாம்? {/*how-can-i-learn-more-about-experimental-features*/}

Experimental features documented ஆக இருக்கலாம் அல்லது இருக்காமல் இருக்கலாம். பொதுவாக experiments Canary அல்லது Latest-இல் ship ஆக நெருங்கும் வரை document செய்யப்படுவதில்லை.

Feature document செய்யப்படவில்லை என்றால், அதற்கு [RFC](https://github.com/reactjs/rfcs) இணைந்திருக்கலாம்.

புதிய experiments அறிவிக்க தயாரானபோது [React blog](/blog)-இல் post செய்வோம்; ஆனால் ஒவ்வொரு experiment-யையும் publicize செய்வோம் என்று அர்த்தமில்லை.

மாற்றங்களின் முழுமையான பட்டியலுக்கு எப்போதும் எங்கள் public GitHub repository-ன் [history](https://github.com/facebook/react/commits/main)-ஐ பார்க்கலாம்.
