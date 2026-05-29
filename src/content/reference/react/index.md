---
title: React Reference மேலோட்டம்
---

<Intro>

React-உடன் வேலை செய்வதற்கான விரிவான reference documentation-ஐ இந்தப் பகுதி வழங்குகிறது. React அறிமுகத்திற்கு, [Learn](/learn) பகுதியைப் பாருங்கள்.

</Intro>

React reference documentation செயல்பாட்டு அடிப்படையிலான துணைப் பிரிவுகளாகப் பிரிக்கப்பட்டுள்ளது:

## React {/*react*/}

நிரலாக்கத்தில் பயன்படுத்தப்படும் React அம்சங்கள்:

* [Hooks](/reference/react/hooks) - உங்கள் components-இலிருந்து பல்வேறு React அம்சங்களைப் பயன்படுத்துங்கள்.
* [Components](/reference/react/components) - உங்கள் JSX-இல் பயன்படுத்தக்கூடிய உள்ளமைந்த components.
* [APIs](/reference/react/apis) - components-ஐ வரையறுக்க பயனுள்ள API-கள்.
* [Directives](/reference/rsc/directives) - React Server Components-உடன் இணக்கமான bundlers-க்கு வழிமுறைகளை வழங்குகின்றன.

## React DOM {/*react-dom*/}

React DOM, web applications-இல் மட்டும் ஆதரிக்கப்படும் அம்சங்களை கொண்டுள்ளது (அவை browser DOM சூழலில் இயங்குகின்றன). இந்தப் பகுதி பின்வருமாறு பிரிக்கப்பட்டுள்ளது:

* [Hooks](/reference/react-dom/hooks) - browser DOM சூழலில் இயங்கும் web applications-க்கான Hooks.
* [Components](/reference/react-dom/components) - உலாவியில் உள்ளமைந்த அனைத்து HTML மற்றும் SVG components-ஐ React ஆதரிக்கிறது.
* [APIs](/reference/react-dom) - `react-dom` package, web applications-இல் மட்டும் ஆதரிக்கப்படும் methods-ஐக் கொண்டுள்ளது.
* [Client APIs](/reference/react-dom/client) - `react-dom/client` API-கள் React components-ஐ client-இல் (உலாவியில்) render செய்ய உதவுகின்றன.
* [Server APIs](/reference/react-dom/server) - `react-dom/server` API-கள் React components-ஐ server-இல் HTML ஆக render செய்ய உதவுகின்றன.
* [Static APIs](/reference/react-dom/static) - `react-dom/static` API-கள் React components-க்கான static HTML-ஐ உருவாக்க உதவுகின்றன.

## React Compiler {/*react-compiler*/}

React Compiler என்பது உங்கள் React components மற்றும் values-ஐ தானாக memoize செய்யும் build-time optimization கருவி:

* [Configuration](/reference/react-compiler/configuration) - React Compiler-க்கான configuration options.
* [Directives](/reference/react-compiler/directives) - compilation-ஐ கட்டுப்படுத்த function-level directives.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - முன்கூட்டியே compiled செய்யப்பட்ட library code-ஐ வெளியிடுவதற்கான வழிகாட்டி.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

[React Hooks-க்கான ESLint plugin](/reference/eslint-plugin-react-hooks), React விதிகளைப் பின்பற்றச் செய்ய உதவுகிறது:

* [Lints](/reference/eslint-plugin-react-hooks) - ஒவ்வொரு lint-க்கும் உதாரணங்களுடன் கூடிய விரிவான documentation.

## Rules of React {/*rules-of-react*/}

நேரடியாகப் புரிந்துகொள்ளக்கூடியதும், உயர்தர applications-ஐ உருவாக்கக்கூடியதுமான முறையில் patterns-ஐ வெளிப்படுத்த React-க்கு idioms அல்லது விதிகள் உள்ளன:

* [Components மற்றும் Hooks pure ஆக இருக்க வேண்டும்](/reference/rules/components-and-hooks-must-be-pure) – Purity உங்கள் code-ஐப் புரிந்துகொள்வதும் debug செய்வதும் உதவுகிறது; மேலும் React உங்கள் components மற்றும் hooks-ஐ சரியாக தானாக optimize செய்ய உதவுகிறது.
* [React தான் Components மற்றும் Hooks-ஐ அழைக்கிறது](/reference/rules/react-calls-components-and-hooks) – User experience-ஐ optimize செய்ய தேவையானபோது components மற்றும் hooks-ஐ render செய்வதற்கு React பொறுப்பாகும்.
* [Hooks விதிகள்](/reference/rules/rules-of-hooks) – Hooks JavaScript functions-ஐப் பயன்படுத்தி வரையறுக்கப்படுகின்றன; ஆனால் அவை எங்கு அழைக்கப்படலாம் என்பதில் கட்டுப்பாடுகளைக் கொண்ட, மீண்டும் பயன்படுத்தக்கூடிய UI logic-இன் ஒரு சிறப்பு வகையை குறிக்கின்றன.

## Legacy APIs {/*legacy-apis*/}

* [Legacy API-கள்](/reference/react/legacy) - `react` package-இலிருந்து export செய்யப்படுகின்றன, ஆனால் புதிதாக எழுதப்படும் code-இல் பயன்படுத்த பரிந்துரைக்கப்படவில்லை.
