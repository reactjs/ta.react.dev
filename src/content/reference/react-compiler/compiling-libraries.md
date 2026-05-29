---
title: Libraries-ஐ compile செய்தல்
---

<Intro>
Optimized library code-ஐ தங்கள் users-க்கு ship செய்ய React Compiler-ஐ எவ்வாறு பயன்படுத்துவது என்பதை library authors புரிந்துகொள்ள இந்த வழிகாட்டி உதவும்.
</Intro>

<InlineToc />

## Compiled code-ஐ ஏன் ship செய்ய வேண்டும்? {/*why-ship-compiled-code*/}

Library author ஆக, npm-க்கு publish செய்வதற்கு முன் உங்கள் library code-ஐ compile செய்யலாம். இது பல நன்மைகளை வழங்குகிறது:

- **அனைத்து users-க்கும் performance மேம்பாடுகள்** - உங்கள் library users இன்னும் React Compiler பயன்படுத்தவில்லை என்றாலும் optimized code கிடைக்கும்
- **Users-க்கு configuration தேவையில்லை** - Optimizations out of the box வேலை செய்யும்
- **Consistent behavior** - Build setup எதுவாக இருந்தாலும் அனைத்து users-க்கும் அதே optimized version கிடைக்கும்

## Compilation அமைத்தல் {/*setting-up-compilation*/}

உங்கள் library-இன் build process-க்கு React Compiler-ஐ சேர்க்கவும்:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

உங்கள் library-ஐ compile செய்ய build tool-ஐ configure செய்யுங்கள். உதாரணமாக, Babel-உடன்:

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... other config
};
```

## பின்னோக்கி இணக்கம் {/*backwards-compatibility*/}

உங்கள் library React 19-க்கு கீழே உள்ள versions-ஐ ஆதரித்தால், கூடுதல் configuration தேவைப்படும்:

### 1. Runtime package-ஐ நிறுவுதல் {/*install-runtime-package*/}

react-compiler-runtime-ஐ direct dependency ஆக நிறுவ பரிந்துரைக்கிறோம்:

<TerminalBlock>
npm install react-compiler-runtime@latest
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. Target version-ஐ configure செய்தல் {/*configure-target-version*/}

உங்கள் library ஆதரிக்கும் குறைந்தபட்ச React version-ஐ அமைக்கவும்:

```js
{
  target: '17', // ஆதரிக்கப்படும் குறைந்தபட்ச React version
}
```

## Testing strategy {/*testing-strategy*/}

Compatibility-ஐ உறுதிசெய்ய உங்கள் library-ஐ compilation உடனும் இல்லாமலும் test செய்யுங்கள். Compiled code-க்கு எதிராக உங்கள் existing test suite-ஐ இயக்குங்கள்; compiler-ஐ bypass செய்யும் தனி test configuration ஒன்றையும் உருவாக்குங்கள். Compilation process-இலிருந்து வரக்கூடிய பிரச்சினைகளைப் பிடிக்கவும், அனைத்து scenarios-இலும் உங்கள் library சரியாக வேலை செய்கிறது என்பதை உறுதிசெய்யவும் இது உதவும்.

## Troubleshooting {/*troubleshooting*/}

### பழைய React versions-உடன் library வேலை செய்யவில்லை {/*library-doesnt-work-with-older-react-versions*/}

உங்கள் compiled library React 17 அல்லது 18-இல் errors throw செய்தால்:

1. `react-compiler-runtime` dependency ஆக நிறுவப்பட்டுள்ளதா என்பதைச் சரிபார்க்கவும்
2. உங்கள் `target` configuration, நீங்கள் ஆதரிக்கும் குறைந்தபட்ச React version-உடன் பொருந்துகிறதா என்பதைச் சரிபார்க்கவும்
3. Published bundle-இல் runtime package சேர்க்கப்பட்டுள்ளதா என்பதை உறுதிசெய்யவும்

### Compilation மற்ற Babel plugins-உடன் conflict ஆகிறது {/*compilation-conflicts-with-other-babel-plugins*/}

சில Babel plugins React Compiler-உடன் conflict ஆகலாம்:

1. உங்கள் plugin list-இல் `babel-plugin-react-compiler`-ஐ ஆரம்பத்தில் வையுங்கள்
2. மற்ற plugins-இல் conflicting optimizations-ஐ disable செய்யுங்கள்
3. உங்கள் build output-ஐ முழுமையாக test செய்யுங்கள்

### Runtime module கிடைக்கவில்லை {/*runtime-module-not-found*/}

Users "Cannot find module 'react-compiler-runtime'" எனக் கண்டால்:

1. Runtime `devDependencies` அல்ல, `dependencies`-இல் listed ஆக உள்ளதா என்பதை உறுதிசெய்யுங்கள்
2. உங்கள் bundler output-இல் runtime-ஐ சேர்க்கிறதா என்பதைச் சரிபார்க்கவும்
3. Package உங்கள் library-உடன் npm-க்கு publish செய்யப்பட்டுள்ளதா என்பதைச் சரிபார்க்கவும்

## அடுத்த படிகள் {/*next-steps*/}

- Compiled code-க்கான [debugging techniques](/learn/react-compiler/debugging) பற்றி அறிக
- அனைத்து compiler options-க்கும் [configuration options](/reference/react-compiler/configuration)-ஐப் பார்க்கவும்
- Selective optimization-க்கான [compilation modes](/reference/react-compiler/compilationMode)-ஐ ஆராயுங்கள்
