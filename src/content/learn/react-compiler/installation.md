---
title: Installation
---

<Intro>
உங்கள் React application-இல் React Compiler-ஐ install செய்து configure செய்ய இந்த guide உதவும்.
</Intro>

<YouWillLearn>

* React Compiler install செய்வது எப்படி
* வெவ்வேறு build tools-க்கான basic configuration
* உங்கள் setup வேலை செய்கிறதா என்பதை verify செய்வது எப்படி

</YouWillLearn>

## Prerequisites {/*prerequisites*/}

React Compiler, React 19 உடன் சிறப்பாக வேலை செய்ய வடிவமைக்கப்பட்டுள்ளது; ஆனால் React 17 மற்றும் 18-ஐயும் support செய்கிறது. [React version compatibility](/reference/react-compiler/target) பற்றி மேலும் அறியவும்.

## Installation {/*installation*/}

React Compiler-ஐ `devDependency` ஆக install செய்யவும்:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

அல்லது Yarn உடன்:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

அல்லது pnpm உடன்:

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## Basic setup {/*basic-setup*/}

React Compiler எந்த configuration இல்லாமலேயே default ஆக வேலை செய்ய வடிவமைக்கப்பட்டுள்ளது. ஆனால் சிறப்பு சூழ்நிலைகளில் configure செய்ய வேண்டுமெனில் (உதாரணமாக, React 19-க்கு கீழான versions target செய்ய), [compiler options reference](/reference/react-compiler/configuration)-ஐ பார்க்கவும்.

Setup process உங்கள் build tool-ஐப் பொறுத்தது. உங்கள் build pipeline உடன் integrate ஆகும் Babel plugin ஒன்றை React Compiler கொண்டுள்ளது.

<Pitfall>
React Compiler உங்கள் Babel plugin pipeline-இல் **முதலில்** run ஆக வேண்டும். சரியான analysis-க்கு compiler-க்கு original source information தேவை; எனவே பிற transformations-க்கு முன் உங்கள் code-ஐ அது process செய்ய வேண்டும்.
</Pitfall>

### Babel {/*babel*/}

உங்கள் `babel.config.js`-ஐ create அல்லது update செய்யவும்:

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // முதலில் run ஆக வேண்டும்!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite {/*vite*/}

`@vitejs/plugin-react` version 6.0.0 அல்லது அதற்குப் பிறகு உள்ள Vite பயன்படுத்தினால், `reactCompilerPreset` பயன்படுத்தலாம்:

<TerminalBlock>
npm install -D @rolldown/plugin-babel
</TerminalBlock>

```js {3-4,9-11}
// vite.config.js
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
  ],
});
```

<Note>
`@vitejs/plugin-react@6.0.0`-இல் inline Babel option remove செய்யப்பட்டது. பழைய version பயன்படுத்தினால், இதைப் பயன்படுத்தலாம்:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```
</Note>

மாற்றாக, `@rolldown/plugin-babel` உடன் Babel plugin-ஐ நேரடியாகப் பயன்படுத்தலாம்:

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: ['babel-plugin-react-compiler'],
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

மேலும் தகவலுக்கு [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)-ஐ பார்க்கவும்.

### React Router {/*usage-with-react-router*/}
`vite-plugin-babel` install செய்து, compiler-ன் Babel plugin-ஐ அதில் சேர்க்கவும்:

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // TypeScript பயன்படுத்தினால்
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

Community webpack loader ஒன்று [இங்கே கிடைக்கிறது](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Expo apps-இல் React Compiler-ஐ enable செய்து பயன்படுத்த [Expo docs](https://docs.expo.dev/guides/react-compiler/)-ஐ பார்க்கவும்.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native, Metro வழியாக Babel பயன்படுத்துகிறது; எனவே installation instructions-க்கு [Babel உடன் usage](#babel) section-ஐ பார்க்கவும்.

### Rspack {/*usage-with-rspack*/}

Rspack apps-இல் React Compiler-ஐ enable செய்து பயன்படுத்த [Rspack docs](https://rspack.dev/guide/tech/react#react-compiler)-ஐ பார்க்கவும்.

### Rsbuild {/*usage-with-rsbuild*/}

Rsbuild apps-இல் React Compiler-ஐ enable செய்து பயன்படுத்த [Rsbuild docs](https://rsbuild.dev/guide/framework/react#react-compiler)-ஐ பார்க்கவும்.


## ESLint integration {/*eslint-integration*/}

Optimize செய்ய முடியாத code-ஐ identify செய்ய உதவும் ESLint rule ஒன்றை React Compiler கொண்டுள்ளது. ESLint rule error report செய்தால், அந்த குறிப்பிட்ட component அல்லது hook-ஐ compiler optimize செய்யாமல் skip செய்யும் என்று அர்த்தம். இது safe: compiler உங்கள் codebase-ன் பிற பகுதிகளை தொடர்ந்து optimize செய்யும். எல்லா violations-யையும் உடனடியாக fix செய்ய தேவையில்லை. Optimized components எண்ணிக்கையை gradual-ஆக அதிகரிக்க, உங்கள் சொந்த pace-இல் அவற்றை address செய்யவும்.

ESLint plugin install செய்யவும்:

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

eslint-plugin-react-hooks ஏற்கனவே configure செய்யப்படவில்லை என்றால், [readme-இல் உள்ள installation instructions](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation)-ஐ பின்பற்றவும். Compiler rules `recommended-latest` preset-இல் கிடைக்கின்றன.

ESLint rule:
- [React விதிகள்](/reference/rules) violations-ஐ identify செய்யும்
- எந்த components optimize செய்ய முடியாது என்பதை காட்டும்
- Issues fix செய்ய உதவும் error messages வழங்கும்

## உங்கள் setup-ஐ verify செய்யுங்கள் {/*verify-your-setup*/}

Installation முடிந்த பிறகு, React Compiler சரியாக வேலை செய்கிறதா என்பதை verify செய்யவும்.

### React DevTools-ஐ check செய்யுங்கள் {/*check-react-devtools*/}

React Compiler optimize செய்த components, React DevTools-இல் "Memo ✨" badge காட்டும்:

1. [React Developer Tools](/learn/react-developer-tools) browser extension install செய்யவும்
2. Development mode-இல் உங்கள் app-ஐ திறக்கவும்
3. React DevTools-ஐ திறக்கவும்
4. Component names அருகில் ✨ emoji தேடவும்

Compiler வேலை செய்தால்:
- Components, React DevTools-இல் "Memo ✨" badge காட்டும்
- Expensive calculations தானாக memoize செய்யப்படும்
- Manual `useMemo` தேவையில்லை

### Build output-ஐ check செய்யுங்கள் {/*check-build-output*/}

உங்கள் build output-ஐப் பார்த்தும் compiler run ஆகிறதா verify செய்யலாம். Compiled code-இல் compiler தானாக சேர்க்கும் automatic memoization logic இருக்கும்.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>வணக்கம் உலகம்</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## Troubleshooting {/*troubleshooting*/}

### குறிப்பிட்ட components-ஐ opt out செய்தல் {/*opting-out-specific-components*/}

Compilation-க்கு பிறகு component ஒன்று issues ஏற்படுத்தினால், `"use no memo"` directive பயன்படுத்தி அதை temporary ஆக opt out செய்யலாம்:

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

இந்த specific component-க்கு optimization skip செய்ய compiler-க்கு இது சொல்கிறது. Underlying issue-ஐ fix செய்து, resolve ஆனதும் directive-ஐ remove செய்ய வேண்டும்.

மேலும் troubleshooting உதவிக்கு, [debugging guide](/learn/react-compiler/debugging)-ஐ பார்க்கவும்.

## அடுத்த steps {/*next-steps*/}

இப்போது React Compiler install செய்யப்பட்டுள்ளதால், இவற்றைப் பற்றி மேலும் அறியவும்:

- React 17 மற்றும் 18-க்கான [React version compatibility](/reference/react-compiler/target)
- Compiler-ஐ customize செய்ய [configuration options](/reference/react-compiler/configuration)
- Existing codebases-க்கான [incremental adoption strategies](/learn/react-compiler/incremental-adoption)
- Issues troubleshoot செய்ய [debugging techniques](/learn/react-compiler/debugging)
- உங்கள் React library-ஐ compile செய்ய [Compiling Libraries guide](/reference/react-compiler/compiling-libraries)
