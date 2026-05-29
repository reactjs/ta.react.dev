---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

`eslint-plugin-react-hooks`, [React விதிகளை](/reference/rules) enforce செய்ய ESLint rules-ஐ வழங்குகிறது.

</Intro>

இந்த plugin build time-இல் React விதிமீறல்களைப் பிடிக்க உதவுகிறது; இதனால் உங்கள் components மற்றும் hooks correctness மற்றும் performance-க்கான React விதிகளைப் பின்பற்றுகின்றன என்பதை உறுதிசெய்யலாம். Lints அடிப்படை React patterns (`exhaustive-deps` மற்றும் `rules-of-hooks`) மற்றும் React Compiler குறிக்கும் பிரச்சினைகள் இரண்டையும் கையாளுகின்றன. React Compiler diagnostics இந்த ESLint plugin மூலம் தானாக வெளிப்படுத்தப்படுகின்றன; உங்கள் app இன்னும் compiler-ஐ ஏற்றுக்கொள்ளவில்லை என்றாலும் இதைப் பயன்படுத்தலாம்.

<Note>
Compiler diagnostic ஒன்றை report செய்தால், ஆதரிக்கப்படாத அல்லது React விதிகளை மீறும் pattern ஒன்றை compiler statically கண்டறிந்துள்ளது என்று பொருள். இதை கண்டறிந்தபோது, உங்கள் app-இன் மீதமுள்ள பகுதி compile செய்யப்பட்டபடியே இருக்கும்; அந்த components மற்றும் hooks-ஐ அது **தானாக** skip செய்யும். இது உங்கள் app-ஐ உடைக்காத பாதுகாப்பான optimizations-க்கு சிறந்த coverage-ஐ உறுதிசெய்கிறது.

Linting-க்கு இதன் பொருள், அனைத்து violations-ஐயும் உடனே சரிசெய்ய வேண்டிய அவசியமில்லை. Optimized components எண்ணிக்கையை படிப்படியாக அதிகரிக்க, உங்கள் வேகத்தில் அவற்றை address செய்யலாம்.
</Note>

## பரிந்துரைக்கப்படும் விதிகள் {/*recommended*/}

இந்த விதிகள் `eslint-plugin-react-hooks`-இல் உள்ள `recommended` preset-இல் சேர்க்கப்பட்டுள்ளன:

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) - React hooks-க்கான dependency arrays தேவையான அனைத்து dependencies-ஐ கொண்டுள்ளனவா என்பதை validate செய்கிறது
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) - Components மற்றும் hooks Hooks விதிகளைப் பின்பற்றுகின்றனவா என்பதை validate செய்கிறது
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) - Nested components அல்லது hooks-ஐ வரையறுக்கும் higher order functions-ஐ validate செய்கிறது
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) - Compiler configuration options-ஐ validate செய்கிறது
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) - Child errors-க்கு try/catch-க்கு பதிலாக Error Boundaries பயன்படுத்தப்படுகிறதா என்பதை validate செய்கிறது
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) - Gating mode configuration-ஐ validate செய்கிறது
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) - Render நடக்கும் போது globals-க்கு assignment/mutation செய்வதை எதிர்த்து validate செய்கிறது
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) - Props, state, மற்றும் பிற immutable values-ஐ mutate செய்வதை எதிர்த்து validate செய்கிறது
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) - Memoization-உடன் compatible அல்லாத libraries பயன்படுத்தப்படுவதை எதிர்த்து validate செய்கிறது
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) - ஏற்கனவே உள்ள manual memoization-ஐ compiler பாதுகாக்கிறதா என்பதை validate செய்கிறது
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) - அறியப்பட்ட impure functions-ஐச் சரிபார்த்து components/hooks pure ஆக உள்ளனவா என்பதை validate செய்கிறது
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) - Render நடக்கும் போது read/write செய்யாமல், refs சரியாகப் பயன்படுத்தப்படுகிறதா என்பதை validate செய்கிறது
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) - Effect-இல் setState synchronously அழைப்பதை எதிர்த்து validate செய்கிறது
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) - Render நடக்கும் போது state அமைப்பதை எதிர்த்து validate செய்கிறது
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) - Components static ஆக உள்ளனவா, ஒவ்வொரு render-இலும் மறுபடியும் உருவாக்கப்படுகிறதா என்பதை validate செய்கிறது
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) - React Compiler ஆதரிக்காத syntax-ஐ எதிர்த்து validate செய்கிறது
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) - Return value இல்லாமல் `useMemo` hook பயன்படுத்தப்படுகிறதா என்பதை validate செய்கிறது
