---
title: "React Compiler v1.0"
author: Lauren Tan, Joe Savona, and Mofei Zhang
date: 2025/10/07
description: Compiler-ன் முதல் stable release-ஐ இன்று வெளியிடுகிறோம்.

---

அக் 7, 2025 அன்று [Lauren Tan](https://x.com/potetotes), [Joe Savona](https://x.com/en_JS), and [Mofei Zhang](https://x.com/zmofei) எழுதியது.

---

<Intro>

React team புதிய updates-ஐ பகிர்வதில் மகிழ்ச்சி அடைகிறது:

</Intro>

1. React Compiler 1.0 இன்று கிடைக்கிறது.
2. Compiler-powered lint rules, `eslint-plugin-react-hooks`-ன் `recommended` மற்றும் `recommended-latest` preset-களில் ship ஆகின்றன.
3. Incremental adoption guide ஒன்றை வெளியிட்டுள்ளோம்; புதிய apps compiler enabled ஆகத் தொடங்க Expo, Vite, மற்றும் Next.js உடன் இணைந்து பணிபுரிந்துள்ளோம்.

---

Compiler-ன் முதல் stable release-ஐ இன்று வெளியிடுகிறோம். React Compiler, React மற்றும் React Native இரண்டிலும் வேலை செய்கிறது; rewrites தேவையில்லாமல் components மற்றும் hooks-ஐ தானாக optimize செய்கிறது. Meta-வில் பெரிய apps-இல் compiler கடுமையாக test செய்யப்பட்டுள்ளது, மேலும் முழுமையாக production-ready ஆக உள்ளது.

[React Compiler](/learn/react-compiler) என்பது automatic memoization மூலம் உங்கள் React app-ஐ optimize செய்யும் build-time tool. கடந்த ஆண்டு, React Compiler-ன் [முதல் beta](/blog/2024/10/21/react-compiler-beta-release)-வை வெளியிட்டோம்; அதன்பிறகு பல சிறந்த feedback மற்றும் contributions கிடைத்தன. Compiler-ஐ adopt செய்தவர்களிடம் இருந்து பார்த்த gains குறித்து உற்சாகமாக இருக்கிறோம் ([Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) மற்றும் [Wakelet](https://github.com/reactwg/react-compiler/discussions/52) case studies-ஐ பார்க்கவும்), மேலும் React community-யில் இன்னும் அதிக users-க்கு compiler-ஐ கொண்டு வருவதில் மகிழ்ச்சியாக இருக்கிறோம்.

இந்த release, கிட்டத்தட்ட ஒரு தசாப்தம் நீண்ட பெரிய மற்றும் சிக்கலான engineering effort-ன் culmination. React team compilers-ஐ முதலில் ஆராயத் தொடங்கியது 2017-இல் [Prepack](https://github.com/facebookarchive/prepack) மூலம். இந்த project இறுதியில் நிறுத்தப்பட்டாலும், எதிர்கால compiler-ஐ மனதில் வைத்து வடிவமைக்கப்பட்ட Hooks-ன் design பற்றி team-க்கு பல learnings கிடைத்தன. 2021-இல், [Xuan Huang](https://x.com/Huxpro), React Compiler குறித்த புதிய அணுகுமுறையின் [முதல் iteration](https://www.youtube.com/watch?v=lGEMwh32soc)-ஐ demo செய்தார்.

புதிய React Compiler-ன் இந்த முதல் version பின்னர் rewrite செய்யப்பட்டாலும், முதல் prototype இந்த பிரச்சினை tractable என்பதைப் பற்றிய எங்கள் நம்பிக்கையை உயர்த்தியது; மேலும் alternative compiler architecture, நாங்கள் விரும்பிய memoization characteristics-ஐ துல்லியமாக வழங்க முடியும் என்ற learnings-ஐ கொடுத்தது. [Joe Savona](https://x.com/en_JS), [Sathya Gunasekaran](https://x.com/_gsathya), [Mofei Zhang](https://x.com/zmofei), மற்றும் [Lauren Tan](https://x.com/potetotes) எங்கள் முதல் rewrite-இல் பணிபுரிந்து, compiler architecture-ஐ Control Flow Graph (CFG) அடிப்படையிலான High-Level Intermediate Representation (HIR)-க்கு மாற்றினர். இது React Compiler-இல் இன்னும் துல்லியமான analysis மற்றும் type inference-க்கும் வழி அமைத்தது. அதன்பிறகு compiler-ன் பல முக்கிய பகுதிகள் rewrite செய்யப்பட்டுள்ளன; ஒவ்வொரு rewrite-மும் முந்தைய முயற்சியிலிருந்து கற்றவற்றால் வழிநடத்தப்பட்டது. இந்த பயணத்தில் [React team](/community/team)-ன் பல உறுப்பினர்களிடமிருந்து முக்கியமான உதவி மற்றும் contributions கிடைத்தன.

இந்த stable release பலவற்றில் முதல் ஒன்று மட்டுமே. Compiler தொடர்ந்து evolve ஆகி மேம்படும்; அடுத்த தசாப்தத்திற்கும் அதற்கு அப்பாலும் React-க்கான புதிய foundation மற்றும் era ஆக இது மாறும் என்று எதிர்பார்க்கிறோம்.

நீங்கள் நேராக [quickstart](/learn/react-compiler)-க்கு செல்லலாம், அல்லது React Conf 2025-இலிருந்து highlights படிக்க தொடர்ந்து செல்லலாம்.

<DeepDive>

#### React Compiler எப்படி வேலை செய்கிறது? {/*how-does-react-compiler-work*/}

React Compiler என்பது automatic memoization மூலம் components மற்றும் hooks-ஐ optimize செய்யும் optimizing compiler. தற்போது இது Babel plugin ஆக implement செய்யப்பட்டாலும், compiler பெரும்பாலும் Babel-இலிருந்து decoupled ஆக உள்ளது; Babel வழங்கும் Abstract Syntax Tree (AST)-ஐ அதன் சொந்த novel HIR-ஆக lower செய்கிறது. பின்னர் பல compiler passes வழியாக, உங்கள் React code-ன் data-flow மற்றும் mutability-ஐ கவனமாகப் புரிந்துகொள்கிறது. இதனால் rendering-இல் பயன்படுத்தப்படும் values-ஐ compiler granular-ஆக memoize செய்ய முடிகிறது; conditional-ஆக memoize செய்வதையும் இதில் அடக்கம், இது manual memoization மூலம் சாத்தியமில்லை.

```js {8}
import { use } from 'react';

export default function ThemeProvider(props) {
  if (!props.children) {
    return null;
  }
  // The compiler can still memoize code after a conditional return
  const theme = mergeTheme(props.theme, use(ThemeContext));
  return (
    <ThemeContext value={theme}>
      {props.children}
    </ThemeContext>
  );
}
```
_இந்த உதாரணத்தை [React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA)-இல் பார்க்கவும்_

Automatic memoization-க்கு கூடுதலாக, React Compiler உங்கள் React code மீது run ஆகும் validation passes-யும் கொண்டுள்ளது. இந்த passes [React விதிகள்](/reference/rules)-ஐ encode செய்கின்றன; மேலும் data-flow மற்றும் mutability பற்றிய compiler-ன் புரிதலைப் பயன்படுத்தி Rules of React உடைக்கப்படும் இடங்களில் diagnostics வழங்குகின்றன. இந்த diagnostics, React code-இல் மறைந்து இருக்கும் latent bugs-ஐ பெரும்பாலும் வெளிக்கொணர்கின்றன; அவை முக்கியமாக `eslint-plugin-react-hooks` மூலம் surface செய்யப்படுகின்றன.

Compiler உங்கள் code-ஐ எப்படி optimize செய்கிறது என்பதை மேலும் அறிய, [Playground](https://playground.react.dev)-ஐ பார்க்கவும்.

</DeepDive>

## இன்று React Compiler பயன்படுத்துங்கள் {/*use-react-compiler-today*/}
Compiler install செய்ய:

npm
<TerminalBlock>
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
</TerminalBlock>

pnpm
<TerminalBlock>
pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest
</TerminalBlock>

yarn
<TerminalBlock>
yarn add --dev --exact babel-plugin-react-compiler@latest
</TerminalBlock>

Stable release-ன் ஒரு பகுதியாக, React Compiler-ஐ உங்கள் projects-க்கு சேர்ப்பதை மேம்படுத்தியும் compiler memoization generate செய்வதை optimize செய்தும் பணிபுரிந்துள்ளோம். React Compiler இப்போது optional chains மற்றும் array indices-ஐ dependencies ஆக support செய்கிறது. இந்த மேம்பாடுகள் இறுதியில் குறைவான re-renders மற்றும் இன்னும் responsive UIs-க்கு வழிவகுக்கின்றன; அதே நேரத்தில் idiomatic declarative code எழுதுவதையே தொடர அனுமதிக்கின்றன.

Compiler பயன்படுத்துவது பற்றிய கூடுதல் விவரங்களை [எங்கள் docs](/learn/react-compiler)-இல் காணலாம்.

## Production-இல் நாம் காண்பது {/*react-compiler-at-meta*/}
[Compiler ஏற்கனவே Meta Quest Store போன்ற apps-இல் ship செய்யப்பட்டுள்ளது](https://youtu.be/lyEKhv8-3n0?t=3002). Initial loads மற்றும் cross-page navigations 12% வரை மேம்பட்டதை பார்த்துள்ளோம்; சில interactions 2.5x-க்கும் அதிகமாக வேகமானவை. இந்த gains இருந்தாலும் memory usage neutral ஆகவே உள்ளது. உங்கள் app-இல் முடிவுகள் மாறுபடலாம் என்றாலும், இதுபோன்ற performance gains காண compiler-ஐ முயற்சிக்க பரிந்துரைக்கிறோம்.

## Backwards compatibility {/*backwards-compatibility*/}
Beta announcement-இல் குறிப்பிட்டபடி, React Compiler, React 17 மற்றும் அதற்கு மேல் compatible. நீங்கள் இன்னும் React 19-இல் இல்லையெனில், compiler config-இல் minimum target குறிப்பிடியும் `react-compiler-runtime`-ஐ dependency ஆக சேர்த்தும் React Compiler பயன்படுத்தலாம். இதற்கான docs-ஐ [இங்கே](/reference/react-compiler/target#targeting-react-17-or-18) காணலாம்.

## Compiler-powered linting மூலம் React விதிகளை enforce செய்யுங்கள் {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
React Compiler, [React விதிகள்](/reference/rules)-ஐ உடைக்கும் code-ஐ identify செய்ய உதவும் ESLint rule ஒன்றைக் கொண்டுள்ளது. Linter-க்கு compiler install செய்யப்பட்டிருக்க வேண்டியதில்லை; எனவே eslint-plugin-react-hooks upgrade செய்வதில் risk இல்லை. அனைவரும் இன்று upgrade செய்ய பரிந்துரைக்கிறோம்.

நீங்கள் ஏற்கனவே `eslint-plugin-react-compiler` install செய்திருந்தால், அதை இப்போது remove செய்து `eslint-plugin-react-hooks@latest` பயன்படுத்தலாம். இந்த மேம்பாட்டுக்கு contribution செய்த [@michaelfaith](https://bsky.app/profile/michael.faith)-க்கு நன்றி!

Install செய்ய:

npm
<TerminalBlock>
npm install --save-dev eslint-plugin-react-hooks@latest
</TerminalBlock>

pnpm
<TerminalBlock>
pnpm add --save-dev eslint-plugin-react-hooks@latest
</TerminalBlock>

yarn
<TerminalBlock>
yarn add --dev eslint-plugin-react-hooks@latest
</TerminalBlock>

```js {6}
// eslint.config.js (Flat Config)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
]);
```

```js {3}
// eslintrc.json (Legacy Config)
{
  "extends": ["plugin:react-hooks/recommended"],
  // ...
}
```

React Compiler rules enable செய்ய, `recommended` preset பயன்படுத்த பரிந்துரைக்கிறோம். கூடுதல் instructions-க்கு [README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md)-யையும் பார்க்கலாம். React Conf-இல் நாங்கள் காட்டிய சில examples:

- [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) மூலம் render loops ஏற்படுத்தும் `setState` patterns-ஐ பிடித்தல்.
- [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) மூலம் effects உள்ளே expensive work-ஐ flag செய்தல்.
- [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) மூலம் render செய்யும் போது unsafe ref access-ஐத் தடுப்பது.

## useMemo, useCallback, மற்றும் React.memo பற்றி என்ன செய்ய வேண்டும்? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}
Default ஆக, React Compiler அதன் analysis மற்றும் heuristics அடிப்படையில் உங்கள் code-ஐ memoize செய்யும். பெரும்பாலான cases-இல், இந்த memoization நீங்கள் எழுதியிருக்கக்கூடியதைப் போலவே, அல்லது அதைவிடவும், துல்லியமாக இருக்கும்; மேலும் மேலே குறிப்பிட்டபடி, early return-க்கு பிறகு போன்ற `useMemo`/`useCallback` பயன்படுத்த முடியாத cases-இலும் compiler memoize செய்ய முடியும்.

ஆனால் சில cases-இல் developers-க்கு memoization மீது கூடுதல் control தேவைப்படலாம். எந்த values memoize செய்யப்பட வேண்டும் என்பதில் control தரும் escape hatch ஆக `useMemo` மற்றும் `useCallback` hooks-ஐ React Compiler உடன் தொடர்ந்து பயன்படுத்தலாம். இதற்கான பொதுவான use-case ஒன்று: ஒரு memoized value effect dependency ஆக பயன்படுத்தப்படும்போது, அதன் dependencies அர்த்தமுள்ள வகையில் மாறாதபோதும் effect மீண்டும் மீண்டும் fire ஆகாமல் உறுதிசெய்வது.

புதிய code-க்கு, memoization-க்கு compiler-ஐ நம்பவும், precise control தேவைப்படும் இடங்களில் `useMemo`/`useCallback` பயன்படுத்தவும் பரிந்துரைக்கிறோம்.

Existing code-க்கு, ஏற்கனவே உள்ள memoization-ஐ அப்படியே விடவோ (அதை நீக்குவது compilation output-ஐ மாற்றக்கூடும்), அல்லது memoization-ஐ நீக்கும் முன் கவனமாக test செய்யவோ பரிந்துரைக்கிறோம்.

## புதிய apps React Compiler பயன்படுத்த வேண்டும் {/*new-apps-should-use-react-compiler*/}
புதிய app experience-க்கு compiler சேர்க்க Expo, Vite, மற்றும் Next.js teams உடன் இணைந்து பணிபுரிந்துள்ளோம்.

[Expo SDK 54](https://docs.expo.dev/guides/react-compiler/) மற்றும் அதற்கு மேல் compiler default ஆக enabled ஆக உள்ளது; எனவே புதிய apps தொடக்கம் முதலே compiler-ன் பயனை தானாகப் பெற முடியும்.

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

[Vite](https://vite.dev/guide/) மற்றும் [Next.js](https://nextjs.org/docs/app/api-reference/cli/create-next-app) users, `create-vite` மற்றும் `create-next-app`-இல் compiler enabled templates-ஐத் தேர்வு செய்யலாம்.

<TerminalBlock>
npm create vite@latest
</TerminalBlock>

<br />

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

## React Compiler-ஐ incremental-ஆக adopt செய்யுங்கள் {/*adopt-react-compiler-incrementally*/}
நீங்கள் existing application maintain செய்து கொண்டிருந்தால், compiler-ஐ உங்கள் சொந்த pace-இல் rollout செய்யலாம். Gating strategies, compatibility checks, மற்றும் rollout tooling-ஐ உள்ளடக்கும் step-by-step [incremental adoption guide](/learn/react-compiler/incremental-adoption)-ஐ வெளியிட்டுள்ளோம்; இதனால் compiler-ஐ நம்பிக்கையுடன் enable செய்யலாம்.

## swc support (experimental) {/*swc-support-experimental*/}
React Compiler, Babel, Vite, மற்றும் Rsbuild போன்ற [பல build tools](/learn/react-compiler#installation)-இல் install செய்யப்படலாம்.

அந்த tools-க்கு கூடுதலாக, React Compiler-க்கு swc plugin ஆக கூடுதல் support சேர்க்க [swc](https://swc.rs/) team-இலிருந்து Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) உடன் collaborate செய்து வருகிறோம். இந்த வேலை இன்னும் முடிவடையவில்லை என்றாலும், [உங்கள் Next.js app-இல் React Compiler enabled](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) ஆகும்போது Next.js build performance இப்போது குறிப்பிடத்தக்க அளவில் வேகமாக இருக்க வேண்டும்.

சிறந்த build performance பெற Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) அல்லது அதற்கு மேல் பயன்படுத்த பரிந்துரைக்கிறோம்.

Vite users, compiler enable செய்ய [Babel plugin](/learn/react-compiler/installation#vite) ஆக சேர்த்து [vite-plugin-react](https://github.com/vitejs/vite-plugin-react)-ஐ தொடர்ந்து பயன்படுத்தலாம். Compiler-க்கு [support சேர்க்க](https://github.com/oxc-project/oxc/issues/10048) [oxc](https://oxc.rs/) team உடனும் பணிபுரிகிறோம். [rolldown](https://github.com/rolldown/rolldown) அதிகாரப்பூர்வமாக release ஆகி Vite-இல் support செய்யப்படும்போது, மேலும் React Compiler-க்கு oxc support சேர்க்கப்பட்டதும், migrate செய்வது பற்றிய தகவல்களுடன் docs-ஐ update செய்வோம்.

## React Compiler upgrade செய்தல் {/*upgrading-react-compiler*/}
Applied auto-memoization strictly performance-க்காக இருக்கும்போது React Compiler சிறப்பாக வேலை செய்கிறது. Compiler-ன் எதிர்கால versions memoization எப்படி apply செய்யப்படுகிறது என்பதை மாற்றலாம்; உதாரணமாக அது மேலும் granular மற்றும் precise ஆகலாம்.

ஆனால் product code சில நேரங்களில் JavaScript-இல் எப்போதும் statically detectable அல்லாத வகையில் [React விதிகள்](/reference/rules)-ஐ உடைக்கக்கூடும் என்பதால், memoization மாற்றுவது சில நேரங்களில் எதிர்பாராத முடிவுகளை தரலாம். உதாரணமாக, முன்பு memoized செய்யப்பட்ட value ஒன்று component tree-இல் எங்காவது `useEffect`-க்கு dependency ஆக பயன்படுத்தப்படலாம். இந்த value எப்படி அல்லது memoize செய்யப்படுகிறதா என்பதை மாற்றுவது அந்த `useEffect` அதிகமாகவோ குறைவாகவோ fire ஆக காரணமாகலாம். [Synchronization-க்காக மட்டுமே useEffect பயன்படுத்த](/learn/synchronizing-with-effects) ஊக்குவித்தாலும், குறிப்பிட்ட values மாறும்போது மட்டும் run ஆக வேண்டிய effects போன்ற பிற use cases-ஐ cover செய்யும் `useEffect`-கள் உங்கள் codebase-இல் இருக்கலாம்.

வேறு வார்த்தைகளில், memoization-ஐ மாற்றுவது அரிதான சூழ்நிலைகளில் எதிர்பாராத behavior ஏற்படுத்தலாம். இந்த காரணத்தால், React விதிகளைப் பின்பற்றவும் உங்கள் app-க்கு continuous end-to-end testing பயன்படுத்தவும் பரிந்துரைக்கிறோம்; இதனால் compiler-ஐ நம்பிக்கையுடன் upgrade செய்து issues ஏற்படுத்தக்கூடிய React விதி violations-ஐ அடையாளம் காணலாம்.

உங்களிடம் நல்ல test coverage இல்லையெனில், SemVer range (எ.கா. `^1.0.0`) பதிலாக exact version-க்கு (எ.கா. `1.0.0`) compiler-ஐ pin செய்ய பரிந்துரைக்கிறோம். Compiler upgrade செய்யும்போது `--save-exact` (npm/pnpm) அல்லது `--exact` flags (yarn) pass செய்வதன் மூலம் இதை செய்யலாம். அதன் பிறகு compiler upgrades அனைத்தையும் manual-ஆக செய்து, உங்கள் app எதிர்பார்த்தபடி இன்னும் வேலை செய்கிறதா என்பதை கவனமாகச் சரிபார்க்க வேண்டும்.

---

இந்த post-ஐ review செய்து edit செய்த [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev), மற்றும் [Dan Abramov](https://bsky.app/profile/danabra.mov)-க்கு நன்றி.
