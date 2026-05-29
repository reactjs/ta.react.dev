---
title: React விதிகள்
---

<Intro>
வெவ்வேறு programming languages கருத்துகளை வெளிப்படுத்த தங்களுக்கான வழிகளை கொண்டிருப்பதுபோல, நேரடியாகப் புரிந்துகொள்ளக்கூடியதும் உயர்தர applications-ஐ உருவாக்க உதவுவதுமான முறையில் patterns-ஐ வெளிப்படுத்த React-க்கும் தனக்கான idioms அல்லது விதிகள் உள்ளன.
</Intro>

<InlineToc />

---

<Note>
React-உடன் UI-களை வெளிப்படுத்துவது பற்றி மேலும் அறிய, [Thinking in React](/learn/thinking-in-react)-ஐப் படிக்க பரிந்துரைக்கிறோம்.
</Note>

Idiomatic React code எழுத நீங்கள் பின்பற்ற வேண்டிய விதிகளை இந்தப் பகுதி விளக்குகிறது. Idiomatic React code எழுதுவது, நன்றாக ஒழுங்கமைக்கப்பட்ட, பாதுகாப்பான, மற்றும் ஒன்றோடொன்று சேர்க்கக்கூடிய applications-ஐ உருவாக்க உதவும். இந்த பண்புகள் உங்கள் app மாற்றங்களுக்கு மேலும் தாங்கும் தன்மை பெறச் செய்கின்றன; மேலும் மற்ற developers, libraries, மற்றும் tools-உடன் வேலை செய்வதை உதவுகின்றன.

இந்த விதிகள் **React விதிகள்** என்று அழைக்கப்படுகின்றன. இவை வெறும் வழிகாட்டுதல்கள் அல்ல; உண்மையான விதிகள். அவை மீறப்பட்டால், உங்கள் app-இல் bugs இருக்க வாய்ப்பு அதிகம். உங்கள் code idiomatic அல்லாததாகவும், புரிந்துகொள்ளவும் காரணம் காணவும் கடினமானதாகவும் மாறும்.

உங்கள் codebase React விதிகளைப் பின்பற்ற உதவ, React-இன் [ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)-உடன் [Strict Mode](/reference/react/StrictMode)-ஐப் பயன்படுத்த வலுவாக பரிந்துரைக்கிறோம். React விதிகளைப் பின்பற்றுவதன் மூலம், இந்த bugs-ஐ கண்டுபிடித்து சரிசெய்யவும், உங்கள் application-ஐ பராமரிக்கக்கூடியதாக வைத்திருக்கவும் முடியும்.

---

## Components மற்றும் Hooks pure ஆக இருக்க வேண்டும் {/*components-and-hooks-must-be-pure*/}

[Components மற்றும் Hooks-இல் purity](/reference/rules/components-and-hooks-must-be-pure) என்பது React-இன் முக்கிய விதி. இது உங்கள் app-ஐ கணிக்கக்கூடியதாகவும் debug செய்ய நேரடியானதாகவும் ஆக்குகிறது; மேலும் React உங்கள் code-ஐ தானாக optimize செய்ய அனுமதிக்கிறது.

* [Components idempotent ஆக இருக்க வேண்டும்](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – React components அவற்றின் inputs ஆன props, state, மற்றும் context-க்கு ஏற்ப எப்போதும் அதே output-ஐத் தரும் என்று கருதப்படுகின்றன.
* [Side effects render-க்கு வெளியே இயங்க வேண்டும்](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – சிறந்த user experience உருவாக்க React components-ஐ பலமுறை render செய்யலாம் என்பதால், side effects render-இல் இயங்கக்கூடாது.
* [Props மற்றும் state immutable](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – ஒரு render-ஐப் பொறுத்தவரை component-இன் props மற்றும் state immutable snapshots ஆகும். அவற்றை நேரடியாக mutate செய்ய வேண்டாம்.
* [Hooks-க்கு தரப்படும் return values மற்றும் arguments immutable](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Values ஒரு Hook-க்கு அனுப்பப்பட்ட பிறகு அவற்றை மாற்றக்கூடாது. JSX-இல் props போலவே, Hook-க்கு அனுப்பப்படும் values immutable ஆகின்றன.
* [JSX-க்கு அனுப்பப்பட்ட பிறகு values immutable](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Values JSX-இல் பயன்படுத்தப்பட்ட பிறகு அவற்றை mutate செய்ய வேண்டாம். Mutation-ஐ JSX உருவாக்கப்படுவதற்கு முன் நகர்த்துங்கள்.

---

## React தான் Components மற்றும் Hooks-ஐ அழைக்கிறது {/*react-calls-components-and-hooks*/}

[User experience-ஐ optimize செய்ய தேவையானபோது components மற்றும் hooks-ஐ render செய்வதற்கு React பொறுப்பாகும்.](/reference/rules/react-calls-components-and-hooks) இது declarative: உங்கள் component logic-இல் என்ன render செய்ய வேண்டும் என்பதை React-க்கு சொல்கிறீர்கள்; அதை உங்கள் user-க்கு எவ்வாறு சிறந்த முறையில் காட்டுவது என்பதை React தீர்மானிக்கும்.

* [Component functions-ஐ நேரடியாக ஒருபோதும் அழைக்க வேண்டாம்](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – Components JSX-இல் மட்டுமே பயன்படுத்தப்பட வேண்டும். அவற்றை சாதாரண functions போல அழைக்க வேண்டாம்.
* [Hooks-ஐ சாதாரண values போல ஒருபோதும் பகிர வேண்டாம்](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – Hooks components உள்ளேயே மட்டுமே அழைக்கப்பட வேண்டும். அவற்றை சாதாரண value போல இடமாற்ற வேண்டாம்.

---

## Hooks விதிகள் {/*rules-of-hooks*/}

Hooks JavaScript functions-ஐப் பயன்படுத்தி வரையறுக்கப்படுகின்றன; ஆனால் அவை எங்கு அழைக்கப்படலாம் என்பதில் கட்டுப்பாடுகளைக் கொண்ட, மீண்டும் பயன்படுத்தக்கூடிய UI logic-இன் ஒரு சிறப்பு வகையை குறிக்கின்றன. அவற்றைப் பயன்படுத்தும்போது [Hooks விதிகளை](/reference/rules/rules-of-hooks) பின்பற்ற வேண்டும்.

* [Hooks-ஐ top level-இல் மட்டுமே அழைக்கவும்](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Loops, conditions, அல்லது nested functions உள்ளே Hooks-ஐ அழைக்க வேண்டாம். அதற்கு பதிலாக, எந்த early returns-க்கும் முன், உங்கள் React function-இன் top level-இல் எப்போதும் Hooks-ஐப் பயன்படுத்துங்கள்.
* [React functions-இலிருந்து மட்டுமே Hooks-ஐ அழைக்கவும்](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – சாதாரண JavaScript functions-இலிருந்து Hooks-ஐ அழைக்க வேண்டாம்.
